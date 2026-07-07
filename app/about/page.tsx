import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "SmartCity Contractors started in the field, not in a software office. The origin story of an operator who built the quoting rail he wished he had.",
};

const chapters = [
  {
    year: "In the field",
    title: "It started on the jobs.",
    body: "SmartCity Contractors didn't begin as a software company. It began with an operator running real jobs — quoting, selling, installing, and getting paid. Every gap in the tooling was a gap he felt personally: quotes that leaked cost data, proposals that took too long, dead leads that just sat there.",
  },
  {
    year: "The problem",
    title: "The tools were built by people who'd never run a job.",
    body: "The quoting software on the market was built for demos, not for a dealer trying to protect margin on a Tuesday afternoon. Cost fields bled through. Floor prices were a suggestion. Nothing tied a booked lead to a real, verifiable close. So the tooling got rebuilt from the operator's side of the table.",
  },
  {
    year: "QuoteSmart",
    title: "A quoting rail, not a quoting toy.",
    body: "QuoteSmart is the result: dealer logins with cost stripped at the server, floor-price enforcement that actually holds, dual-output quotes that keep the material list away from the customer, and a public quote view that closes. It's the rail every SmartCity lead runs on.",
  },
  {
    year: "The platform",
    title: "From one operator to a platform for the trades.",
    body: "DialBolt revives the leads you already paid for and feeds them into QuoteSmart. Bolt puts an AI assistant inside the software. The throughline never changes: everything routes through QuoteSmart, because a quote you can trust is what turns a lead into a paid job.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="section-pad pb-16">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Our story</p>
              <h1 className="mt-5 display-1">
                Built from the <span className="text-gradient">field</span> up.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl lede">
                Most contractor software is built by companies that have never
                pulled a permit. SmartCity Contractors is the opposite: tools
                built by an operator who ran the jobs, felt the gaps, and closed
                them.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-content">
          <div className="mx-auto max-w-3xl">
            {chapters.map((c, i) => (
              <ScrollReveal key={c.year} delay={i * 0.05}>
                <div className="relative grid gap-4 border-l-2 border-brand/20 pb-14 pl-8 md:grid-cols-[160px_1fr] md:gap-8 md:pl-10">
                  <span
                    aria-hidden
                    className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand"
                  />
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                    {c.year}
                  </p>
                  <div>
                    <h2 className="text-2xl font-bold tracking-[-0.01em] md:text-3xl">
                      {c.title}
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-subtle">
                      {c.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-8">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-canvas px-8 py-14 text-center md:px-14">
              <h2 className="display-2">The two-engine model.</h2>
              <p className="mx-auto mt-6 max-w-xl lede">
                Field operations generate cash and prove the tools in the real
                world. QuoteSmart turns that operator knowledge into a platform
                other contractors can run on. One informs the other, every day.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton href="/quotesmart">See QuoteSmart</CTAButton>
                <CTAButton href="/contact" variant="secondary">
                  Talk to us
                </CTAButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
