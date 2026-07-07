"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Bolt. Ask me anything about SmartCity Contractors, QuoteSmart, or DialBolt.",
};

// Quick-reply suggestions shown before the first user message (mirrors the
// in-app Bolt panel's suggestion chips).
const SUGGESTIONS = [
  "What is QuoteSmart?",
  "How does DialBolt work?",
  "Can I book a demo?",
];

function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 2 5 13h5.2L9 22l8.5-11H12l1.5-9Z" />
    </svg>
  );
}

// Gradient bolt tile — the QuoteSmart/Bolt product icon.
function BoltTile({ className = "", iconClass = "" }: { className?: string; iconClass?: string }) {
  return (
    <span
      className={`flex items-center justify-center rounded-[0.6rem] bg-brand-gradient text-white ${className}`}
    >
      <BoltIcon className={iconClass} />
    </span>
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

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      const nextMessages: Msg[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      // Drop the canned greeting before sending to the API.
      const payload = nextMessages.filter((m, i) => !(i === 0 && m === GREETING));

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
            /* non-JSON */
          }
          setError(msg);
          setLoading(false);
          return;
        }

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
    },
    [loading, messages]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText(input);
    }
  };

  const showSuggestions = messages.length === 1 && !loading;

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
            <span className="relative text-[0.95rem] font-semibold">Ask Bolt</span>
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
            className="fixed bottom-5 right-5 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_-18px_rgba(20,16,25,0.35)] print:hidden"
            role="dialog"
            aria-label="Bolt assistant"
          >
            {/* Header — white, gradient tile on the left (matches in-app Bolt) */}
            <div className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <BoltTile className="h-9 w-9" iconClass="h-5 w-5" />
                <div className="leading-tight">
                  <p className="text-[1rem] font-bold text-ink">Bolt</p>
                  <p className="text-[0.72rem] text-subtle">
                    SmartCity Contractors
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Bolt"
                className="flex h-8 w-8 items-center justify-center rounded-full text-subtle transition-colors hover:bg-canvas"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-white px-4 py-4">
              {messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div key={i} className="flex items-start gap-2.5">
                    <BoltTile className="mt-0.5 h-8 w-8 flex-none" iconClass="h-4 w-4" />
                    <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tl-md bg-[#F1F0F6] px-3.5 py-2.5 text-[0.9rem] leading-relaxed text-ink">
                      {m.content || (
                        <span className="inline-flex gap-1 py-1">
                          <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[0.9rem] leading-relaxed text-white">
                      {m.content}
                    </div>
                  </div>
                )
              )}

              {/* typing indicator while waiting for first token */}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-start gap-2.5">
                  <BoltTile className="mt-0.5 h-8 w-8 flex-none" iconClass="h-4 w-4" />
                  <div className="rounded-2xl rounded-tl-md bg-[#F1F0F6] px-3.5 py-3">
                    <span className="inline-flex gap-1">
                      <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                    </span>
                  </div>
                </div>
              )}

              {/* suggestion chips */}
              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pl-10">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendText(s)}
                      className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-[0.85rem] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
                  {error}
                </p>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-black/10 bg-white p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 focus-within:border-brand">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Ask Bolt…"
                  className="max-h-28 flex-1 resize-none bg-transparent text-[0.9rem] leading-relaxed text-ink outline-none placeholder:text-subtle/70"
                />
                <button
                  onClick={() => sendText(input)}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-white transition-all hover:bg-brand-dark disabled:bg-brand-light disabled:opacity-70"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[0.68rem] text-subtle/70">
                Bolt only discusses SmartCity Contractors, QuoteSmart &amp; DialBolt.
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
