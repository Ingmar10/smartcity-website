import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "DialBolt",
  description:
    "DialBolt is done-for-you dead-lead reactivation. Compliant SMS and email revive the leads you already paid for, book the appointment, and route every one into QuoteSmart for quoting and close verification.",
};

const steps = [
  {
    n: "01",
    title: "We load your dead leads",
    body: "Old, aging, and never-closed leads you already paid for. DialBolt takes it from there — no dialer for you to run.",
  },
  {
    n: "02",
    title: "Compliant outreach revives them",
    body: "TCPA-compliant SMS and email re-engage each lead with STOP/HELP handling built in. Consent is captured and recorded.",
  },
  {
    n: "03",
    title: "Appointments get booked",
    body: "Interested leads are booked automatically. Every conversation is rep-attributed, so the source of each close is tracked.",
  },
  {
    n: "04",
    title: "Every lead lands in QuoteSmart",
    body: "This is the part that matters: reactivated leads flow straight into QuoteSmart for quoting and close verification. DialBolt doesn't end at a booked appointment — QuoteSmart is the delivery layer underneath it.",
  },
];

export default function DialBoltPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad pb-16">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">DialBolt</p>
              <h1 className="mt-5 display-1">
                Your dead leads<br />
                aren&apos;t dead.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl lede">
                DialBolt is done-for-you reactivation. It revives the leads you
                already paid for over compliant SMS and email, books the
                appointment, and routes every one into QuoteSmart for quoting
                and close verification.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton href="/contact">Start with DialBolt</CTAButton>
                <CTAButton href="/quotesmart" variant="secondary">
                  See where leads land
                </CTAButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-4 display-2">
                Four steps. The rail never breaks.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={(i % 2) * 0.06}>
                <div
                  className={`card h-full p-8 ${
                    i === 3 ? "ring-1 ring-brand/30" : ""
                  }`}
                >
                  <span className="text-gradient text-4xl font-bold">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-subtle">{s.body}</p>
                  {i === 3 && (
                    <p className="mt-4 inline-flex rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                      QuoteSmart is the delivery layer
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance band */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-black/5 bg-canvas p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
                <div>
                  <p className="eyebrow">Compliant by design</p>
                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    Built to pass A2P review, not skirt it.
                  </h2>
                  <p className="mt-4 leading-relaxed text-subtle">
                    DialBolt captures explicit opt-in consent, records it as a
                    compliance artifact, and honors STOP and HELP on every
                    channel. Consent data is never sold or shared with third
                    parties for their marketing.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <CTAButton href="/dialbolt/consent" variant="secondary">
                      SMS consent form
                    </CTAButton>
                    <CTAButton
                      href="/dialbolt/privacy"
                      variant="ghost"
                    >
                      Privacy Policy <span aria-hidden>→</span>
                    </CTAButton>
                  </div>
                </div>
                <ul className="space-y-3 rounded-2xl bg-white p-6 text-[0.95rem]">
                  {[
                    "Explicit TCPA opt-in, recorded",
                    "STOP to opt out, HELP for help",
                    "Message frequency disclosed at sign-up",
                    "No selling or sharing of consent data",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-1 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      </span>
                      <span className="text-ink/80">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="display-2">
                Stop buying new leads to ignore the old ones.
              </h2>
              <p className="mx-auto mt-6 max-w-xl lede">
                DialBolt turns a cold list into booked jobs — and QuoteSmart
                turns those jobs into signed proposals. Let&apos;s wire it up.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton href="/contact">Talk to us</CTAButton>
                <CTAButton href="/quotesmart" variant="secondary">
                  See QuoteSmart
                </CTAButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
