import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";
import WaitlistForm from "@/components/WaitlistForm";
import StatusTag from "@/components/StatusTag";

export const metadata: Metadata = {
  title: "Network",
  description:
    "The SmartCity Contractors Network — the backbone of the trades. Contractors plug into the operating stack (QuoteSmart, DialBolt, and more), share commission, and keep their independence.",
};

const members = [
  {
    name: "QuoteSmart",
    role: "The quoting platform",
    body: "The central rail. Every lead in the network flows through QuoteSmart for quoting and close verification.",
    href: "/quotesmart",
    status: "live" as const,
  },
  {
    name: "DialBolt",
    role: "Dead-lead reactivation",
    body: "Revives old leads over compliant SMS, books the appointment, and hands them to QuoteSmart.",
    href: "/dialbolt",
    status: "live" as const,
  },
  {
    name: "Ori Energy",
    role: "Operating member · solar, roofing, battery",
    body: "A licensed Florida contractor running live on the stack — the proof that the operating model works in the field.",
    href: null,
    status: "live" as const,
  },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        eyebrow="SmartCity Contractors Network"
        status="live"
        title={
          <>
            The backbone of <span className="text-gradient">the trades</span>.
          </>
        }
        lede="SmartCity Contractors isn't one company — it's an operating stack that contractors plug into. QuoteSmart for quoting, DialBolt for lead reactivation, and a growing bench of tools. You keep your brand and your independence. We provide the rail underneath."
      >
        <CTAButton href="#apply">Apply to join</CTAButton>
        <CTAButton href="/quotesmart" variant="secondary">
          See the stack
        </CTAButton>
      </PageHero>

      {/* Hierarchy diagram */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How it fits together</p>
              <h2 className="mt-4 display-2">One stack. Many contractors.</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center">
              {/* Top: SmartCity */}
              <div className="rounded-2xl bg-brand-gradient px-8 py-5 text-center text-white shadow-[0_16px_40px_-12px_rgba(107,63,208,0.5)]">
                <p className="text-lg font-bold">SmartCity Contractors</p>
                <p className="text-sm text-white/80">The operating stack</p>
              </div>
              <Connector />

              {/* Middle: the stack + members */}
              <div className="grid w-full gap-4 sm:grid-cols-3">
                {[
                  { t: "QuoteSmart", s: "Quoting rail" },
                  { t: "DialBolt", s: "Lead reactivation" },
                  { t: "Ori Energy", s: "Operating member" },
                ].map((n) => (
                  <div key={n.t} className="card p-5 text-center">
                    <p className="font-bold">{n.t}</p>
                    <p className="mt-1 text-sm text-subtle">{n.s}</p>
                  </div>
                ))}
              </div>
              <Connector />

              {/* Bottom: open capacity */}
              <div className="w-full rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 px-6 py-6 text-center">
                <p className="font-bold text-brand">
                  Open capacity — new contractor partners
                </p>
                <p className="mx-auto mt-1 max-w-md text-sm text-subtle">
                  Room on the rail for contractors who want the tools without
                  giving up their business. That could be you.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Who's in the network today */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">In the network today</p>
              <h2 className="mt-4 display-2">Real tools. Real operators.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {members.map((m, i) => (
              <ScrollReveal key={m.name} delay={(i % 3) * 0.06}>
                <div className="card flex h-full flex-col p-7">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    <StatusTag status={m.status} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-brand">{m.role}</p>
                  <p className="mt-4 flex-1 leading-relaxed text-subtle">
                    {m.body}
                  </p>
                  {m.href && (
                    <Link
                      href={m.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand"
                    >
                      Learn more <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How contractors join */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How contractors join</p>
              <h2 className="mt-4 display-2">Two ways onto the rail.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <ScrollReveal>
              <div className="card h-full p-8">
                <span className="text-gradient text-4xl font-bold">01</span>
                <h3 className="mt-4 text-xl font-bold">
                  Partner on commission
                </h3>
                <p className="mt-3 leading-relaxed text-subtle">
                  Keep your business exactly as it is. Bring your dead leads,
                  plug into DialBolt, and split commission on the deals we
                  revive — with every booked lead flowing through QuoteSmart for
                  quoting and close verification.
                </p>
                <ul className="mt-5 space-y-2.5 text-[0.95rem]">
                  {[
                    "Bring your dead / aging leads",
                    "Plug into DialBolt reactivation",
                    "Share commission on closed deals",
                    "Keep your brand and independence",
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
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <div className="card h-full p-8">
                <span className="text-gradient text-4xl font-bold">02</span>
                <h3 className="mt-4 text-xl font-bold">
                  Run on the operating stack
                </h3>
                <p className="mt-3 leading-relaxed text-subtle">
                  Go further and bring your business onto the full stack. Quote
                  on QuoteSmart, reactivate with DialBolt, and tap the tools
                  landing next — Voice, Capital, and University — as they launch.
                  The rail scales with you.
                </p>
                <ul className="mt-5 space-y-2.5 text-[0.95rem]">
                  {[
                    "Quote and close on QuoteSmart",
                    "Full lead-to-signed-job pipeline",
                    "First access to new ecosystem tools",
                    "Operator-to-operator support",
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="section-pad pt-4">
        <div className="container-content">
          <div className="mx-auto max-w-xl">
            <ScrollReveal>
              <div className="text-center">
                <p className="eyebrow">Apply</p>
                <h2 className="mt-4 display-2">Get on the rail.</h2>
                <p className="mx-auto mt-5 max-w-md lede">
                  Tell us about your business. If it&apos;s a fit, we&apos;ll map
                  the fastest way to plug you in.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mt-10">
                <WaitlistForm source="network-apply" cta="Apply to join" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Connector() {
  return <div aria-hidden className="my-4 h-8 w-px bg-brand/25" />;
}
