import "./home.css";
import Image from "next/image";
import HomeHero from "@/components/home/HomeHero";
import RailSwitcher from "@/components/home/RailSwitcher";
import ServicesSection from "@/components/home/ServicesSection";
import AlternatingRow from "@/components/AlternatingRow";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";
import EcosystemRow from "@/components/EcosystemRow";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <RailSwitcher />

      {/* Trust strip */}
      <section className="border-y border-black/5 bg-canvas">
        <div className="container-content py-10">
          <ScrollReveal>
            <p className="text-center text-sm font-medium uppercase tracking-[0.12em] text-subtle">
              Built and run by a licensed contractor — not a software company
              guessing at the trades · Ori Energy runs live on the stack
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* What we do */}
      <section className="section-pad">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">What runs on the rail</p>
              <h2 className="mt-4 display-2">
                Three pieces. One lead, start to signed.
              </h2>
              <p className="mx-auto mt-6 max-w-xl lede">
                QuoteSmart is the center of everything we build. DialBolt feeds
                it. Bolt sits inside it. The lead never leaves the rail.
              </p>
            </div>
          </ScrollReveal>

          <div className="sc2 mt-16">
            <div className="hero-shot">
              <div className="glow2" aria-hidden="true" />
              <Image
                src="/screenshots/desktop.webp"
                alt="QuoteSmart on desktop: sidebar navigation, a $51,500 pipeline card with win rate and margin, quotes sent and approved, recent activity, and pipeline stages"
                width={1600}
                height={1118}
                sizes="(min-width: 1200px) 1136px, 100vw"
              />
            </div>
          </div>

          <div className="mt-20 space-y-28 md:space-y-36">
            <AlternatingRow
              eyebrow="QuoteSmart"
              title="The quoting platform for contractors and dealers."
              body="Price a job, brand the proposal, and enforce your floor — all in one place. Dealers never see your cost or margin; that data is stripped at the server, not hidden in the UI."
              bullets={[
                "Dealer/reseller logins with scoped access",
                "Floor-price enforcement and per-dealer overrides",
                "Dual-output quotes: a clean customer proposal, separate from the internal material list",
                "PDF proposals and a public customer-facing quote view",
              ]}
              cta={{ href: "/quotesmart", label: "Explore QuoteSmart" }}
              visual={
                <div className="sc2">
                  <div className="ph">
                    <Image src="/screenshots/phone-dashboard.webp" alt="The QuoteSmart dashboard on iPhone: pipeline value, win rate, margin, quotes sent, and a needs-attention prompt" width={640} height={1221} sizes="336px" />
                  </div>
                </div>
              }
            />

            <AlternatingRow
              flip
              eyebrow="DialBolt"
              title="Revive the leads you already paid for."
              body="DialBolt re-engages your dead and aging leads over compliant SMS and email, books the appointment, and drops every reactivated lead straight into QuoteSmart for quoting and close verification."
              bullets={[
                "Done-for-you reactivation — no dialer to run yourself",
                "TCPA-compliant opt-in, STOP/HELP handling built in",
                "Booked appointments flow into QuoteSmart automatically",
                "Rep-attributed so every close is tracked to the source",
              ]}
              cta={{ href: "/dialbolt", label: "See how DialBolt works" }}
              visual={
                <div className="sc2">
                  <div className="thread">
                    <p className="lab">A dead lead, five days later</p>
                    <div className="msgs">
                      <p className="m l">Hi Dana, still thinking about the roof? Your June number is good through Friday.</p>
                      <p className="m r">What was it again?</p>
                      <p className="m l">$16,550 all in. Thursday 9am to walk it?</p>
                      <p className="m r">Thursday works</p>
                    </div>
                    <div className="foot"><span>Booked · Thursday 9:00a</span><span>Into QuoteSmart →</span></div>
                  </div>
                </div>
              }
            />

            <AlternatingRow
              eyebrow="Bolt"
              title="An operator's assistant, inside the software."
              body="Bolt is the AI built into QuoteSmart — and the assistant in the corner of this page. It reads and edits quotes, customers, catalog, and financing, and keeps everyone pointed at the next step. Ask it anything about what we build."
              cta={{ href: "/quotesmart", label: "Meet Bolt in QuoteSmart" }}
              visual={
                <div className="sc2">
                  <div className="ph">
                    <Image src="/screenshots/phone-bolt.webp" alt="The Bolt panel open over the QuoteSmart dashboard, suggesting actions like what needs me today and why is margin down" width={640} height={1221} sizes="336px" />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* What we build around QuoteSmart */}
      <ServicesSection />

      {/* The SmartCity Ecosystem */}
      <EcosystemRow />

      {/* Closing CTA */}
      <section className="section-pad pt-0">
        <div className="container-content">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient px-8 py-16 text-center md:px-16 md:py-24">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_0%,rgba(255,255,255,0.22),transparent_50%)]"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-[-0.02em] text-white">
                  See the rail in action.
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">
                  Book a walkthrough of QuoteSmart and DialBolt, or start a
                  conversation with Bolt in the corner.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <CTAButton href="/contact" variant="secondary">
                    Book a demo
                  </CTAButton>
                  <CTAButton
                    href="/quotesmart"
                    variant="ghost"
                    className="text-white hover:text-white/80"
                  >
                    See QuoteSmart <span aria-hidden>→</span>
                  </CTAButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
