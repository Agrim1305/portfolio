"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";

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
    "Hi — I'm an AI assistant trained only on Agrim's portfolio content. Ask me anything about his projects, experience, or background, and I'll answer from what's actually here rather than guessing.",
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

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        setMessages((prev) => prev.slice(0, -1)); // roll back the user msg on hard failure
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Couldn't reach the assistant — check your connection and try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Ask AI about Agrim"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-black/50 border border-white/10 backdrop-blur-2xl hover:border-accent-gold/50 transition-all hover:scale-[1.03] active:scale-[0.98]"
        style={{ background: "hsl(220 25% 8% / 0.92)" }}
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-60 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-accent-gold" />
        </span>
        {open ? (
          <X className="size-4 text-white/90" />
        ) : (
          <>
            <Sparkles className="size-4 text-accent-gold" />
            <span className="font-mono text-xs text-white/90 uppercase tracking-wider hidden sm:inline">
              Ask AI about Agrim
            </span>
            <span className="font-mono text-xs text-white/90 uppercase tracking-wider sm:hidden">
              Ask AI
            </span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 bottom-24 right-5 left-5 sm:left-auto sm:w-[400px] h-[min(560px,70vh)] rounded-2xl shadow-2xl shadow-black/60 border border-white/10 backdrop-blur-2xl flex flex-col overflow-hidden"
          style={{ background: "hsl(220 25% 8% / 0.97)" }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-blue/10 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-accent-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">Ask about Agrim</p>
              <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
                AI assistant · grounded in his portfolio
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent-gold text-background font-medium"
                      : "bg-white/5 border border-white/10 text-white/85"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-1.5 rounded-full bg-white/50 animate-bounce" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400/90 font-mono px-1">{error}</p>
            )}

            {/* Suggested questions — only before the conversation gets going */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-col gap-2 pt-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs font-mono px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-white/65 hover:border-accent-gold/40 hover:text-accent-gold transition-colors"
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
            className="p-3 border-t border-white/10 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              maxLength={500}
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent-gold/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="size-10 shrink-0 rounded-lg bg-accent-gold hover:bg-accent-gold/90 disabled:opacity-30 disabled:hover:bg-accent-gold flex items-center justify-center transition-all"
            >
              <Send className="size-4 text-background" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}