import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";
import WaitlistForm from "@/components/WaitlistForm";
import StatusTag from "@/components/StatusTag";
import { NETWORK_TIERS } from "@/lib/ecosystem";

export const metadata: Metadata = {
  title: "Network",
  description:
    "The SmartCity Contractors Network — the backbone of the trades. Operating businesses (QuoteSmart, DialBolt, Ori Energy) plus trusted network partners like Crawl Space Doctor / BeCoolAmerica, with open capacity for new contractors.",
};

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
        lede="SmartCity Contractors isn't one company — it's an operating stack that contractors plug into. QuoteSmart for quoting, DialBolt for lead reactivation, a growing bench of tools, and trusted field partners. You keep your brand and your independence. We provide the rail underneath."
      >
        <CTAButton href="#apply">Apply to join</CTAButton>
        <CTAButton href="/quotesmart" variant="secondary">
          See the stack
        </CTAButton>
      </PageHero>

      {/* Hierarchy diagram (two tiers) */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How it fits together</p>
              <h2 className="mt-4 display-2">One stack. Two tiers.</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center">
              {/* Top: SmartCity */}
              <div className="rounded-2xl bg-brand-gradient px-8 py-5 text-center text-white shadow-[0_16px_40px_-12px_rgba(107,63,208,0.5)]">
                <p className="text-lg font-bold">SmartCity Contractors</p>
                <p className="text-sm text-white/80">The operating stack</p>
              </div>

              {NETWORK_TIERS.map((tier) => (
                <div key={tier.key} className="w-full">
                  <Connector />
                  <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
                    {tier.tier} · {tier.label}
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
                    {tier.members.map((m) => (
                      <div
                        key={m.name}
                        className="card p-5 text-center sm:w-[220px]"
                      >
                        <p className="text-sm font-bold">{m.name}</p>
                        <p className="mt-1 text-xs text-subtle">{m.role}</p>
                      </div>
                    ))}
                    {tier.openCapacity && (
                      <div className="rounded-xl2 border-2 border-dashed border-brand/40 bg-brand/5 p-5 text-center sm:w-[220px]">
                        <p className="text-sm font-bold text-brand">
                          Open capacity
                        </p>
                        <p className="mt-1 text-xs text-subtle">New partners</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* In the network today — two tiers */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">In the network today</p>
              <h2 className="mt-4 display-2">Real tools. Real operators.</h2>
            </div>
          </ScrollReveal>

          <div className="mt-16 space-y-16">
            {NETWORK_TIERS.map((tier) => (
              <div key={tier.key}>
                <ScrollReveal>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="eyebrow">{tier.tier}</p>
                    <h3 className="text-2xl font-bold tracking-[-0.01em]">
                      {tier.label}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-2xl text-subtle">
                    {tier.description}
                  </p>
                </ScrollReveal>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {tier.members.map((m, i) => (
                    <ScrollReveal key={m.name} delay={(i % 3) * 0.06}>
                      <div className="card flex h-full flex-col p-7">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-bold">{m.name}</h4>
                          <StatusTag status="live" />
                        </div>
                        <p className="mt-1 text-sm font-medium text-brand">
                          {m.role}
                        </p>
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

                  {tier.openCapacity && (
                    <ScrollReveal delay={(tier.members.length % 3) * 0.06}>
                      <Link
                        href="#apply"
                        className="flex h-full flex-col rounded-xl2 border-2 border-dashed border-brand/40 bg-brand/5 p-7 transition-colors hover:bg-brand/10"
                      >
                        <h4 className="text-xl font-bold text-brand">
                          {tier.openCapacity.title}
                        </h4>
                        <p className="mt-4 flex-1 leading-relaxed text-subtle">
                          {tier.openCapacity.body}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                          Apply to join <span aria-hidden>→</span>
                        </span>
                      </Link>
                    </ScrollReveal>
                  )}
                </div>
              </div>
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
                  landing next — Voice, Payments, and University — as they
                  launch. The rail scales with you.
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
  return <div aria-hidden className="mx-auto my-4 h-8 w-px bg-brand/25" />;
}
