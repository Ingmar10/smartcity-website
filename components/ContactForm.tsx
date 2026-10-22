"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/brand";

// Contact form. Posts to /api/contact, which stores the message in the site's
// database and copies it into the SmartCity Ingmar GHL sub-account (contact,
// note and a follow-up task). It used to open the visitor's mail app instead,
// which silently lost every message from anyone without one set up.

const interests = [
  "QuoteSmart demo",
  "DialBolt reactivation",
  "Both",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(interests[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest, message }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || `Something went wrong. Please email ${COMPANY.generalEmail}.`);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError(`We couldn't reach the server. Please try again, or email ${COMPANY.generalEmail}.`);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-6 md:p-8" role="status">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
          Message sent
        </p>
        <p className="mt-3 text-lg text-ink">
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}. We got it and we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">
              Name
            </label>
            <input
              id="c-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input
              id="c-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="c-interest" className="mb-1.5 block text-sm font-semibold">
            I&apos;m interested in
          </label>
          <select
            id="c-interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
          >
            {interests.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold">
            Message
          </label>
          <textarea
            id="c-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none focus:border-brand"
            placeholder="Tell us about your business and what you're looking for."
          />
        </div>

        {status === "error" && error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
