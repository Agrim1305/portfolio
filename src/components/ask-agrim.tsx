"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";

// Strips markdown emphasis syntax the model shouldn't be using but
// sometimes does anyway (small models don't reliably obey "never use
// bold" instructions). Keeps the inner text, drops the ** or __ wrapper,
// so a prompt slip shows as plain text instead of literal asterisks.
function stripStrayMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1");
}

// Turns a single line of text into React nodes, converting any URLs
// within it into styled, clickable links. Used by renderMessageContent
// for each line/bullet after the message has been split into blocks.
function renderLineWithLinks(line: string, keyPrefix: string) {
  const cleanLine = stripStrayMarkdown(line);
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts = cleanLine.split(urlPattern);

  return parts.map((part, i) => {
    if (part.match(urlPattern)) {
      // Trim trailing punctuation that isn't part of the URL itself.
      const trailingPunctuation = part.match(/[).,;:!?]+$/)?.[0] ?? "";
      const cleanUrl = trailingPunctuation
        ? part.slice(0, -trailingPunctuation.length)
        : part;

      return (
        <span key={`${keyPrefix}-${i}`}>
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
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

// Renders full message text: splits on blank lines into paragraphs,
// treats consecutive "- " lines as a bullet list, and turns any URLs
// within the text into styled, clickable links.
function renderMessageContent(content: string) {
  const blocks = content.trim().split(/\n\s*\n/); // split on blank lines

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n").filter((l) => l.trim().length > 0);
    const isBulletBlock = lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));

    if (isBulletBlock) {
      return (
        <ul key={blockIndex} className="list-disc pl-4 space-y-1 my-1">
          {lines.map((line, i) => (
            <li key={i}>
              {renderLineWithLinks(line.trim().replace(/^-\s+/, ""), `${blockIndex}-${i}`)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={blockIndex} className={blockIndex > 0 ? "mt-2" : ""}>
        {renderLineWithLinks(lines.join(" "), `${blockIndex}`)}
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

export function AskAgrim() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Lock background scroll while the panel is open on mobile, so the
  // widget feels like a contained sheet rather than the page shifting
  // underneath it.
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

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
          // response wasn't JSON — keep the default message
        }
        setError(msg);
        setMessages((prev) => prev.slice(0, -1)); // roll back the user msg on hard failure
        return;
      }

      // Append an empty assistant message and stream tokens into it.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (!acc.trim()) {
        setError("The assistant didn't return a response. Try again.");
        setMessages((prev) => prev.slice(0, -2)); // drop empty assistant + user
      }
    } catch {
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

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Ask AI about Agrim"}
        className="fixed bottom-5 right-5 z-50 flex min-h-11 items-center gap-2.5 pl-4 pr-5 py-3 rounded-full bg-ink text-paper shadow-[0_12px_32px_-12px_hsl(230_15%_13%/0.5)] hover:bg-ink/90 transition-all active:scale-[0.98]"
        
      >
        <span className="relative flex size-2">
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        {open ? (
          <X className="size-4 text-paper" />
        ) : (
          <>
            <Sparkles className="size-4 text-paper" />
            <span className="font-mono text-xs text-paper uppercase tracking-wider hidden sm:inline">
              Ask AI about Agrim
            </span>
            <span className="font-mono text-xs text-paper uppercase tracking-wider sm:hidden">
              Ask AI
            </span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 inset-x-3 bottom-3 top-16 sm:inset-x-auto sm:top-auto sm:bottom-24 sm:right-5 sm:left-auto sm:w-[400px] sm:h-[min(560px,70vh)] rounded-xl bg-surface shadow-[0_24px_64px_-24px_hsl(0_0%_0%/0.6)] border border-hairline flex flex-col overflow-hidden"
          
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-hairline flex items-center gap-3">
            <div className="size-9 rounded-lg bg-accent-wash border border-hairline flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">Ask about Agrim</p>
              <p className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                AI assistant · grounded in his portfolio
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="size-7 shrink-0 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <X className="size-4 text-ink-faint" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 chat-scroll">
            {messages.map((m, i) => {
              // The streaming assistant bubble is empty until the first token
              // arrives — the typing dots stand in for it until then.
              if (m.role === "assistant" && m.content === "") return null;
              return (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed break-words ${
                      m.role === "user"
                        ? "bg-ink text-paper"
                        : "bg-secondary text-ink"
                    }`}
                  >
                    {renderMessageContent(m.content)}
                  </div>
                </div>
              );
            })}

            {loading && waitingForFirstToken && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-xl px-3.5 py-2.5 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-ink-faint animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-ink-faint animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-ink-faint animate-bounce" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive font-mono px-1">{error}</p>
            )}

            {/* Suggested questions — only before the conversation gets going */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-col gap-2 pt-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs font-mono px-3 py-2.5 rounded-lg border border-hairline text-ink-muted hover:border-accent hover:text-accent transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 border-t border-hairline flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              maxLength={500}
              disabled={loading}
              className="flex-1 bg-secondary border border-hairline rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="size-11 shrink-0 rounded-lg bg-ink hover:bg-ink/85 disabled:opacity-30 disabled:hover:bg-ink flex items-center justify-center transition-all"
            >
              <Send className="size-4 text-paper" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}