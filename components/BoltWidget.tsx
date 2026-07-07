"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hey — I'm Bolt. Ask me anything about SmartCity Contractors, QuoteSmart, or DialBolt.",
};

function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 2 5 13h5.2L9 22l8.5-11H12l1.5-9Z" />
    </svg>
  );
}

export default function BoltWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    // Only real conversation turns go to the API (drop the canned greeting).
    const payload = nextMessages.filter(
      (m, i) => !(i === 0 && m === GREETING)
    );

    try {
      const res = await fetch("/api/bolt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok || !res.body) {
        let msg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          /* non-JSON error */
        }
        setError(msg);
        setLoading(false);
        return;
      }

      // Stream the assistant reply in, token by token.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setError("Couldn't reach Bolt. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating pill — click to open. NEVER auto-opens (cost control). */}
      <div className="fixed bottom-5 right-5 z-50 print:hidden">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Ask Bolt"
            className="group relative flex items-center gap-2.5 rounded-full bg-brand-gradient py-3 pl-4 pr-5 text-white shadow-[0_10px_30px_-6px_rgba(107,63,208,0.6)] transition-transform hover:-translate-y-0.5"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-brand/50 animate-pulse-ring"
            />
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <BoltIcon className="h-4 w-4" />
            </span>
            <span className="relative text-[0.95rem] font-semibold">
              Ask Bolt
            </span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="bolt-panel"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed bottom-5 right-5 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_24px_70px_-18px_rgba(20,16,25,0.35)] print:hidden"
            role="dialog"
            aria-label="Bolt assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-brand-gradient px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <BoltIcon className="h-4 w-4" />
                </span>
                <div className="leading-tight">
                  <p className="text-[0.95rem] font-semibold">Bolt</p>
                  <p className="text-[0.7rem] text-white/80">
                    SmartCity Contractors AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Bolt"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-canvas px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[0.9rem] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-brand text-white"
                        : "rounded-bl-md border border-black/5 bg-white text-ink"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1 py-1">
                        <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {loading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-black/5 bg-white px-3.5 py-3">
                      <span className="inline-flex gap-1">
                        <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                      </span>
                    </div>
                  </div>
                )}
              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
                  {error}
                </p>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-black/5 bg-white p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 focus-within:border-brand">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Ask about QuoteSmart, DialBolt…"
                  className="max-h-28 flex-1 resize-none bg-transparent text-[0.9rem] leading-relaxed text-ink outline-none placeholder:text-subtle/70"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-white transition-opacity disabled:opacity-40"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[0.68rem] text-subtle/70">
                Bolt only discusses SmartCity Contractors, QuoteSmart & DialBolt.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-subtle/60"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
    />
  );
}
