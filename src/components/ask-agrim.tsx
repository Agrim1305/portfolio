"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArrowUp, Volume2, VolumeX, X } from "lucide-react";
import { Cloud } from "@/components/cloud";
import { Dock } from "@/components/dock";
import {
  setMuted,
  speak,
  stop,
  takeSentences,
  unlock,
  useCanSpeak,
  useSpeech,
} from "@/lib/speech";

// Small models sometimes emit **bold** or __underline__ despite the prompt
// forbidding it; strip the wrappers so a slip renders as plain text.
function stripStrayMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1");
}

function renderLineWithLinks(line: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts = stripStrayMarkdown(line).split(urlPattern);

  return parts.map((part, i) => {
    if (!part.match(urlPattern)) return <span key={i}>{part}</span>;

    // Trailing punctuation reads as part of the sentence, not the URL.
    const trailingPunctuation = part.match(/[).,;:!?]+$/)?.[0] ?? "";
    const cleanUrl = trailingPunctuation
      ? part.slice(0, -trailingPunctuation.length)
      : part;

    return (
      <span key={i}>
        <a
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-1 underline-offset-2 hover:decoration-2 transition-colors break-all"
        >
          {cleanUrl}
        </a>
        {trailingPunctuation}
      </span>
    );
  });
}

// Mirrors the formatting the system prompt asks for: blank lines separate
// paragraphs, and a run of "- " lines is a bullet list.
function renderMessageContent(content: string) {
  return content
    .trim()
    .split(/\n\s*\n/)
    .map((block, blockIndex) => {
      const lines = block.split("\n").filter((l) => l.trim().length > 0);
      const isBulletBlock =
        lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));

      if (isBulletBlock) {
        return (
          <ul key={blockIndex} className="list-disc pl-4 space-y-1 my-1">
            {lines.map((line, i) => (
              <li key={i}>
                {renderLineWithLinks(line.trim().replace(/^-\s+/, ""))}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={blockIndex} className={blockIndex > 0 ? "mt-2" : ""}>
          {renderLineWithLinks(lines.join(" "))}
        </p>
      );
    });
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What's Agrim's strongest project?",
  "Is he eligible to work in Australia?",
  "What's he looking for in a role?",
];

const INTRO_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi, I'm an AI assistant trained only on Agrim's portfolio content. Ask me anything about his projects, experience, or background, and I'll answer from what's actually here rather than guessing.",
};

const OPEN_EVENT = "ask:open";

/* Opens the assistant from anywhere on the page (hero card, menu, the cloud,
   a section's question), optionally sending a first message. */
export function openAsk(message?: string) {
  window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_EVENT, { detail: message }));
}

/* The hero's open Ask card, under the cloud: the assistant's header, the
   suggested questions and an input. A question or a submitted message opens
   the chat window and sends it there. */
export function AskCard({ className = "" }: { className?: string }) {
  const [text, setText] = useState("");
  return (
    <div
      className={`hero-rise rounded-[26px] border border-ink/12 bg-[linear-gradient(180deg,#1B1B20,#141417)] p-5 shadow-[0_40px_80px_rgb(0_0_0/0.45)] ${className}`}
      style={{ animationDelay: "1.1s" }}
    >
      <p className="font-display text-[20px] font-bold leading-tight lg:text-[22px]">Ask about Agrim</p>
      {/* From md up the hero's cloud perches on the card's top-right corner;
          the line wraps short of it. */}
      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted md:pr-[190px]">
        AI assistant · grounded in his portfolio
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => openAsk(q)}
            className="min-h-11 rounded-full border border-ink/16 px-3.5 py-2 text-left text-sm text-[#D6D3CD] transition-colors hover:border-accent hover:text-ink"
          >
            {q}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          openAsk(text);
          setText("");
        }}
        className="mt-3 flex h-12 items-center gap-2.5 rounded-2xl border border-accent/70 pl-4 pr-1.5 transition-colors focus-within:border-accent"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question…"
          aria-label="Ask a question"
          maxLength={500}
          className="chat-input min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-paper transition-opacity disabled:opacity-40"
        >
          <ArrowUp className="size-5" aria-hidden />
        </button>
      </form>
    </div>
  );
}

/* The chat window and its button, the docked cloud. `heroId` names the hero,
   where the cloud starts (see dock.tsx); without one it is docked from the
   start. */
export function AskAgrim({ heroId }: { heroId?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { muted } = useSpeech();
  const canSpeak = useCanSpeak();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  // Where focus goes back to when the window closes: whatever opened it.
  const returnTo = useRef<HTMLElement | null>(null);
  // Read inside the streaming loop, so an answer still arriving after the
  // chat closes keeps filling in but stops talking.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  function show() {
    if (openRef.current) return;
    const from = document.activeElement;
    returnTo.current = from instanceof HTMLElement && from !== document.body ? from : dockRef.current;
    setOpen(true);
  }

  function close() {
    if (!openRef.current) return;
    setOpen(false);
    stop();
    // A frame later, once the window has gone, so focus lands on the page.
    requestAnimationFrame(() => returnTo.current?.focus());
  }

  // Opened by the hero card, the menu, the cloud, or Cmd/Ctrl+K, which also
  // closes it again.
  const onOpenEvent = useEffectEvent((message?: string) => {
    show();
    if (message) sendMessage(message);
  });
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;
    // Ctrl+K in a text field is "delete to end of line" on macOS; leave it be.
    // Cmd+K has no such meaning, so it still works from the chat's own input.
    const target = e.target as HTMLElement;
    const inField = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    if (inField && !e.metaKey) return;
    e.preventDefault();
    if (openRef.current) close();
    else show();
  });
  useEffect(() => {
    const open = (e: Event) => onOpenEvent((e as CustomEvent<string | undefined>).detail);
    const key = (e: KeyboardEvent) => onKey(e);
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("keydown", key);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    // A suggested question unmounts and the send button disables once this
    // runs, so move focus to the input rather than letting it drop to <body>.
    inputRef.current?.focus();
    // A new question cuts off the previous answer. This runs inside the tap,
    // which iOS needs before it will speak the reply later on.
    stop();
    unlock();

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          // Send prior turns (excluding the static intro) so follow-up
          // questions have context, capped to keep payloads small.
          history: nextMessages.slice(1, -1).slice(-12),
        }),
      });

      if (!res.ok || !res.body) {
        // Error responses are JSON; success responses are a text stream.
        let msg = "Something went wrong.";
        try {
          const data = await res.json();
          msg = data?.error ?? msg;
        } catch {
          // response wasn't JSON, keep the default message
        }
        setError(msg);
        setMessages((prev) => prev.slice(0, -1)); // roll back the user msg on hard failure
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = "";
      // Speech follows the stream a sentence at a time, so it starts before
      // the answer has finished arriving.
      let unspoken = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        received += chunk;
        const [sentences, rest] = takeSentences(unspoken + chunk);
        unspoken = rest;
        if (openRef.current) sentences.forEach((s) => speak(s));
        setMessages((prev) => {
          const copy = prev.slice();
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = {
            role: "assistant",
            content: last.content + chunk,
          };
          return copy;
        });
      }
      if (openRef.current) speak(unspoken);

      if (!received.trim()) {
        setError("The assistant didn't return a response. Try again.");
        setMessages((prev) => prev.slice(0, -2)); // drop empty assistant + user
      }
    } catch {
      stop();
      setError("Couldn't reach the assistant. Check your connection and try again.");
      // Remove a trailing empty assistant bubble, then the user message.
      setMessages((prev) => {
        const copy = prev.slice();
        if (
          copy.length &&
          copy[copy.length - 1].role === "assistant" &&
          copy[copy.length - 1].content === ""
        ) {
          copy.pop();
        }
        return copy.slice(0, -1);
      });
    } finally {
      setLoading(false);
    }
  }

  // While a request is in flight, show the typing dots until the streaming
  // assistant bubble has received its first token.
  const lastMessage = messages[messages.length - 1];
  const waitingForFirstToken =
    lastMessage?.role !== "assistant" || lastMessage.content === "";
  // The cloud thinks while the request waits for its first token, and
  // answers while the tokens stream in.
  const mood = !loading ? "idle" : waitingForFirstToken ? "thinking" : "answering";

  return (
    <>
      <Dock heroId={heroId} open={open} mood={mood} onClick={show} onAsk={openAsk} buttonRef={dockRef} />

      {/* A small window, not a modal: no backdrop, no scroll lock and no focus
          trap, so the page stays usable behind it. It opens above the docked
          cloud; below md it is a bottom sheet. */}
      <div
        id="ask-agrim"
        role="dialog"
        aria-modal="false"
        aria-labelledby="ask-agrim-title"
        hidden={!open}
        // A wheel over the conversation scrolls the conversation, not the page.
        data-lenis-prevent
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
        }}
        className="chat-window fixed inset-x-0 bottom-0 z-50 h-[85dvh] overflow-hidden rounded-t-[22px] border border-b-0 border-white/14 bg-sheet text-ink shadow-[0_30px_80px_rgb(0_0_0/0.6)] md:inset-x-auto md:bottom-[7.25rem] md:right-6 md:h-[min(540px,calc(100dvh-8.75rem))] md:w-[380px] md:rounded-[22px] md:border-b"
      >
        <div className="flex h-full flex-col">
          <span aria-hidden className="mx-auto mt-2.5 h-[5px] w-10 shrink-0 rounded-full bg-ink/25 md:hidden" />
          <div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3 md:py-3.5">
            <Cloud className="w-11 shrink-0 md:w-10" />
            <div className="min-w-0 flex-1">
              <p id="ask-agrim-title" className="font-display text-[17px] font-bold leading-tight">
                Ask about Agrim
              </p>
              <p className="font-mono text-[10px] uppercase leading-snug tracking-[0.06em] text-ink-muted">
                AI assistant · grounded in his portfolio
              </p>
            </div>
            {canSpeak && (
              <button
                type="button"
                onClick={() => setMuted(!muted)}
                aria-pressed={!muted}
                aria-label="Read answers aloud"
                title={muted ? "Voice off" : "Voice on"}
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  muted ? "border-ink/20 text-ink-muted hover:text-ink" : "border-accent text-accent-soft"
                }`}
              >
                {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink-soft transition-colors hover:text-ink"
            >
              <X className="size-[18px]" aria-hidden />
            </button>
          </div>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-busy={loading}
            className="thin-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => {
              // The streaming assistant bubble is empty until the first token
              // arrives; the typing dots stand in for it until then.
              if (m.role === "assistant" && m.content === "") return null;
              return (
                <div
                  key={i}
                  className={`max-w-[88%] break-words px-3.5 py-2.5 text-[15px] leading-relaxed md:text-sm ${
                    m.role === "user"
                      ? "self-end rounded-[18px_18px_6px_18px] bg-accent font-medium text-paper"
                      : "self-start rounded-[18px_18px_18px_6px] bg-surface-raised text-[#E4E1DB]"
                  }`}
                >
                  {renderMessageContent(m.content)}
                </div>
              );
            })}

            {loading && waitingForFirstToken && (
              <div
                className="flex items-center gap-1.5 self-start rounded-[18px_18px_18px_6px] bg-surface-raised px-4 py-3.5"
                aria-hidden
              >
                <span className="size-1.5 rounded-full bg-ink-faint animate-bounce motion-reduce:animate-none [animation-delay:-0.3s]" />
                <span className="size-1.5 rounded-full bg-ink-faint animate-bounce motion-reduce:animate-none [animation-delay:-0.15s]" />
                <span className="size-1.5 rounded-full bg-ink-faint animate-bounce motion-reduce:animate-none" />
              </div>
            )}

            {error && (
              <p role="alert" className="px-1 font-mono text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          {/* Suggested questions, only before the conversation gets going */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="min-h-10 rounded-full border border-ink/20 px-3 py-1.5 text-left text-[13px] text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="mx-4 mb-4 flex h-[54px] shrink-0 items-center gap-2.5 rounded-[14px] border border-ink/15 bg-paper pl-4 pr-1.5 transition-colors focus-within:border-accent"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              aria-label="Ask a question"
              maxLength={500}
              // readOnly rather than disabled: a disabled input drops keyboard
              // focus to <body> mid-conversation.
              readOnly={loading}
              className="chat-input min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint read-only:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-paper transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="size-5" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
