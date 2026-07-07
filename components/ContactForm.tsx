"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/brand";

// Lightweight, dependency-free contact form. On submit it composes a prefilled
// email to the company inbox (opens the visitor's mail client). This keeps the
// form genuinely functional with no backend/email service wired up yet; it can
// be pointed at an API route or CRM later without changing the UI.

const interests = [
  "QuoteSmart demo",
  "DialBolt reactivation",
  "Both",
  "Something else",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(interests[0]);
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Website inquiry — ${interest}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Interested in: ${interest}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:${COMPANY.generalEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
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

        <button
          type="submit"
          className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-brand-dark"
        >
          Send message
        </button>
      </div>
    </form>
  );
}
