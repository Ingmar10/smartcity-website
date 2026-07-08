import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";
import WaitlistForm from "@/components/WaitlistForm";
import StatusTag from "@/components/StatusTag";

export const metadata: Metadata = {
  title: "University",
  description:
    "SmartCity University — contractor training built by an operator, not an influencer. Field-tested tracks in solar & roofing sales, D2D, business ops, and financial strategy.",
};

const tracks = [
  {
    title: "Solar & Roofing Sales",
    body: "How to actually sell solar and roofing — sit at the kitchen table, run the numbers, handle objections, and close. Real pricing, real financing, real proposals built in QuoteSmart, not slideware.",
  },
  {
    title: "D2D Excellence",
    body: "Door-to-door done right. Territory strategy, the knock, the pitch, the setter-to-closer handoff, and the discipline that separates reps who grind from reps who earn. Built from real doors, not theory.",
  },
  {
    title: "Contractor Business Ops",
    body: "The part nobody teaches: permitting, scheduling, crews, margins, and the systems that keep a contracting business from eating itself. How to run the company, not just work in it.",
  },
  {
    title: "Financial Strategy for Owners",
    body: "Keep what you earn and turn it into wealth. Cash-flow management, tax structure, and the wealth-building playbook for contractor owners — the same thinking behind SmartCity Capital.",
  },
];

export default function UniversityPage() {
  return (
    <>
      <PageHero
        eyebrow="SmartCity University"
        status="soon"
        title={
          <>
            Built by an <span className="text-gradient">operator</span>.
            <br className="hidden sm:block" /> Not an influencer.
          </>
        }
        lede="Most contractor training is either theoretical fluff or a hype reel selling you the next course. SmartCity University is field-tested — the sales, ops, and money playbooks that actually built a contracting business, taught by someone who ran the jobs."
      >
        <CTAButton href="#waitlist">Join the waitlist</CTAButton>
      </PageHero>

      {/* Why this exists */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Why this exists</p>
              <h2 className="mt-4 display-2">Field-tested, not theoretical.</h2>
              <p className="mx-auto mt-6 max-w-2xl lede">
                There are two kinds of contractor training out there: academic
                stuff written by people who&apos;ve never pulled a permit, and
                hype from influencers selling the dream instead of the reality.
                SmartCity University is the third thing — the playbooks that
                actually closed jobs, ran crews, and kept the lights on, taught
                straight, operator to operator.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tracks */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">The tracks</p>
              <h2 className="mt-4 display-2">Four ways to level up.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {tracks.map((t, i) => (
              <ScrollReveal key={t.title} delay={(i % 2) * 0.06}>
                <div className="card flex h-full flex-col p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gradient text-3xl font-bold">
                      0{i + 1}
                    </span>
                    <StatusTag status="soon" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{t.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-subtle">
                    {t.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bolt / QuoteSmart tie-in */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-canvas px-8 py-12 text-center md:px-14">
              <h2 className="display-2">Learn the tools you&apos;ll run on.</h2>
              <p className="mx-auto mt-6 max-w-xl lede">
                University isn&apos;t separate from the stack — you&apos;ll learn
                to quote and close on QuoteSmart, the same platform you&apos;ll
                run your business on. And it&apos;s all powered by{" "}
                <strong>Bolt AI</strong>, the same brain running inside
                QuoteSmart, so the training and the tools are one continuous
                system.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="section-pad pt-4">
        <div className="container-content">
          <div className="mx-auto max-w-xl">
            <ScrollReveal>
              <div className="text-center">
                <p className="eyebrow">Waitlist</p>
                <h2 className="mt-4 display-2">Get the playbook first.</h2>
                <p className="mx-auto mt-5 max-w-md lede">
                  Join the list and get first access when the first track goes
                  live.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mt-10">
                <WaitlistForm
                  source="university-waitlist"
                  cta="Join the University waitlist"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
