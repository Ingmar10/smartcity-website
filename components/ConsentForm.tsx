"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/brand";

/**
 * `rep` arrives as a PROP, read from searchParams by the server page.
 *
 * It used to come from `useSearchParams()` here, and that one hook decided how
 * the whole page rendered: reading search params on the client forces this
 * subtree to be client-only, so the prerendered HTML carried the Suspense
 * fallback — literally the word "Loading…" — and the consent checkbox and its
 * disclosure were absent from the served markup entirely.
 *
 * That matters beyond performance. This page is the opt-in workflow named in
 * SmartCity's A2P campaign registration, and a carrier reviewer whose tooling
 * does not execute JavaScript would fetch it and find no consent language at
 * all. The disclosure a compliance reviewer needs to see must be in the HTML,
 * not assembled after hydration.
 */
export default function ConsentForm({ rep = "" }: { rep?: string }) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tcpa, setTcpa] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);

    if (!tcpa) {
      setError("Please check the box to agree to receive text messages.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, rep, tcpaConsent: tcpa }),
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
        <h3 className="text-xl font-bold">You&apos;re all set</h3>
        <p className="mt-2 text-subtle">
          Thanks{ name ? `, ${name.split(" ")[0]}` : "" }. Your consent has been
          recorded. Reply STOP at any time to opt out.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      {/* Hidden rep attribution — populated from the ?rep= URL param */}
      <input type="hidden" name="rep" value={rep} />

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">
            Mobile number
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
            placeholder="(555) 123-4567"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-canvas p-4">
          {/* UNCHECKED BY DEFAULT and never pre-ticked — `tcpa` starts false
              and this is a controlled input. Pre-checked consent is the classic
              TCPA violation and it must stay impossible here.

              `required` is deliberate and is NOT what enforces this: the submit
              handler below and the server route both refuse without it. The
              attribute exists so assistive technology announces the field as
              required, and so the browser's own message appears before a
              round trip. Three layers, none of them load-bearing alone.

              On THIS page refusing without the box is correct — the box is the
              entire transaction, nothing else is being obtained. The autoquoter
              at quotesmart.app is different: there the customer is getting a
              quote, so consent must be optional and the form must submit either
              way, with the SMS path branching only on a ticked box. */}
          <input
            type="checkbox"
            required
            checked={tcpa}
            onChange={(e) => setTcpa(e.target.checked)}
            className="mt-1 h-5 w-5 flex-none accent-brand"
          />
          <span className="text-sm leading-relaxed text-ink/80">
            By checking this box, I agree to receive recurring text messages from{" "}
            {COMPANY.shortName} / DialBolt at the mobile number provided,
            including messages sent by an automated system, about my project,
            appointments, and quotes. Consent is not a condition of purchase.
            Message frequency varies. Message &amp; data rates may apply. Reply{" "}
            <strong>STOP</strong> to opt out or <strong>HELP</strong> for help.
            See our{" "}
            <a href="/dialbolt/privacy" className="text-brand underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/dialbolt/terms" className="text-brand underline">
              Terms
            </a>
            .
          </span>
        </label>

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
          {status === "sending" ? "Submitting…" : "Agree & continue"}
        </button>

        <p className="text-center text-xs text-subtle">
          Your information is used to contact you about your project and is not
          sold or shared with third parties for their marketing. Questions?{" "}
          <a
            href={`mailto:${COMPANY.policyEmail}`}
            className="text-brand underline"
          >
            {COMPANY.policyEmail}
          </a>
        </p>
      </div>
    </form>
  );
}
