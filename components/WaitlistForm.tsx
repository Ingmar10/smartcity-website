"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COMPANY } from "@/lib/brand";

// Rep-attributed waitlist / apply form — same pattern as the DialBolt consent
// form: a hidden `rep` field auto-populated from ?rep=, plus a hidden `source`
// tag per page. Posts to /api/waitlist, which stores the record durably.

function WaitlistFormInner({
  source,
  cta = "Join the waitlist",
  note,
}: {
  source: string;
  cta?: string;
  note?: string;
}) {
  const searchParams = useSearchParams();
  const rep = searchParams.get("rep") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source, rep }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Couldn't submit. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">You&apos;re on the list</h3>
        <p className="mt-2 text-subtle">
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}. We&apos;ll reach out at{" "}
          <span className="font-medium text-ink">{email}</span> the moment it&apos;s
          ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      <input type="hidden" name="rep" value={rep} />
      <input type="hidden" name="source" value={source} />
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            aria-label="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
            placeholder="Full name"
          />
          <input
            required
            type="email"
            aria-label="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
            placeholder="you@company.com"
          />
        </div>
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "sending" ? "Submitting…" : cta}
        </button>
        <p className="text-center text-xs text-subtle">
          {note ??
            "No spam. We'll only email you about this launch."}{" "}
          Questions?{" "}
          <a
            href={`mailto:${COMPANY.generalEmail}`}
            className="text-brand underline"
          >
            {COMPANY.generalEmail}
          </a>
        </p>
      </div>
    </form>
  );
}

export default function WaitlistForm(props: {
  source: string;
  cta?: string;
  note?: string;
}) {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense
      fallback={<div className="card p-8 text-center text-subtle">Loading…</div>}
    >
      <WaitlistFormInner {...props} />
    </Suspense>
  );
}
