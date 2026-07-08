import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Voice",
  description:
    "SmartCity Voice — done-for-you inbound AI voice agents for contractors. Answers 24/7, qualifies the lead, books the appointment. Proven live on Ori Energy's line today.",
};

const does = [
  {
    title: "Answers every call, 24/7",
    body: "Nights, weekends, on a roof, mid-install — the line is always picked up on the first ring. No missed calls, no voicemail graveyard.",
  },
  {
    title: "Qualifies the lead",
    body: "Asks the right questions for your trade, figures out what the caller actually needs, and routes by service type — no more tire-kickers eating your day.",
  },
  {
    title: "Books the appointment",
    body: "Checks your calendar and books the estimate or service call on the spot, so the lead is on your schedule before they hang up.",
  },
  {
    title: "Or takes a callback",
    body: "If it can't close the booking, it captures the details, adds them to your pipeline, and flags the callback — nothing falls through.",
  },
];

const steps = [
  {
    n: "01",
    title: "We clone your voice agent",
    body: "Start from the same agent running live for Ori Energy, tuned to sound like your business — not a generic robot.",
  },
  {
    n: "02",
    title: "We train it on your services",
    body: "Your trades, your service area, your pricing rules and booking policies. It answers like someone who works for you.",
  },
  {
    n: "03",
    title: "We integrate your calendar",
    body: "Connect your scheduling so it books real appointments into real availability — and syncs back to your pipeline.",
  },
  {
    n: "04",
    title: "You sound personal, hands-free",
    body: "Every caller gets a fast, knowledgeable, on-brand experience while you stay on the job. You never lift a finger.",
  },
];

export default function VoicePage() {
  return (
    <>
      <PageHero
        eyebrow="SmartCity Voice"
        status="soon"
        title={
          <>
            You&apos;re too busy on the roof
            <br className="hidden sm:block" /> to answer the phone.
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">We&apos;re not.</span>
          </>
        }
        lede="Done-for-you inbound AI voice agents for contractors. They answer 24/7, qualify the lead, and book the appointment — so a missed call never turns into a lost job again."
      >
        <CTAButton href="#waitlist">Join the waitlist</CTAButton>
        <CTAButton href="#proven" variant="secondary">
          See it in action
        </CTAButton>
      </PageHero>

      {/* The problem */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">The problem</p>
              <h2 className="mt-4 display-2">
                Every missed call is a job you gave away.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl lede">
                Contractors miss calls all day — you&apos;re on a roof, under a
                house, mid-install. The homeowner doesn&apos;t leave a voicemail.
                They call the next contractor on the list. That&apos;s not a
                missed call; it&apos;s revenue walking out the door, over and
                over, while you&apos;re doing the work you got hired for.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What it does */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">What the voice agent does</p>
              <h2 className="mt-4 display-2">Picks up. Qualifies. Books.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {does.map((d, i) => (
              <ScrollReveal key={d.title} delay={(i % 2) * 0.06}>
                <div className="card h-full p-8">
                  <h3 className="text-xl font-bold">{d.title}</h3>
                  <p className="mt-3 leading-relaxed text-subtle">{d.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-4 display-2">Done for you, start to finish.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={(i % 2) * 0.06}>
                <div className="card h-full p-8">
                  <span className="text-gradient text-4xl font-bold">{s.n}</span>
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-subtle">{s.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Already proven */}
      <section id="proven" className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-canvas p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
                <div>
                  <p className="eyebrow">Already proven</p>
                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    This isn&apos;t a concept. It&apos;s answering Ori
                    Energy&apos;s phone right now.
                  </h2>
                  <p className="mt-4 leading-relaxed text-subtle">
                    Sarah — our inbound voice agent — handles Ori Energy&apos;s
                    calls live today: greeting callers, routing by service type,
                    and booking estimates around the clock. SmartCity Voice is
                    that exact system, cloned and tuned for your business.
                  </p>
                  <p className="mt-4 leading-relaxed text-subtle">
                    And it&apos;s all powered by <strong>Bolt AI</strong> — the
                    same brain running inside QuoteSmart — so the agent that
                    answers your phone speaks the same language as the platform
                    that quotes and closes the job.
                  </p>
                </div>
                <ul className="space-y-3 rounded-2xl bg-white p-6 text-[0.95rem]">
                  {[
                    "Live on Ori Energy's inbound line",
                    "Answers in English and Spanish",
                    "Routes by trade and service type",
                    "Books straight into the calendar",
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

      {/* Waitlist */}
      <section id="waitlist" className="section-pad pt-4">
        <div className="container-content">
          <div className="mx-auto max-w-xl">
            <ScrollReveal>
              <div className="text-center">
                <p className="eyebrow">Waitlist</p>
                <h2 className="mt-4 display-2">Stop missing calls.</h2>
                <p className="mx-auto mt-5 max-w-md lede">
                  Get on the list and we&apos;ll clone a voice agent for your
                  business the moment we open the next batch.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mt-10">
                <WaitlistForm source="voice-waitlist" cta="Join the Voice waitlist" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
