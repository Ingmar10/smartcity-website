import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import CTAButton from "@/components/CTAButton";
import WaitlistForm from "@/components/WaitlistForm";
import StatusTag from "@/components/StatusTag";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "SmartCity Payments — the money rail for the trades. Instant, low-fee contractor payouts and commission settlement on XRPL blockchain rails, plus native Stripe card acceptance.",
};

const products = [
  {
    title: "Instant commission splits",
    body: "DialBolt's M1/M2 triggers settle in real time. When a job closes, the rep gets paid the second the trigger fires — not two weeks later, not after a manual spreadsheet reconciliation. The close and the payout are the same event.",
    points: [
      "M1/M2 triggers settle on close",
      "Reps paid the moment the deal fires",
      "No manual reconciliation or lag",
    ],
  },
  {
    title: "XRPL-powered payouts",
    body: "Ultra-low-fee, near-instant settlement to contractors, subs, and reps over XRPL blockchain rails. Move money in seconds for a fraction of a cent — and it's cross-border ready when your crew or partners aren't in the same zip code.",
    points: [
      "Near-instant on-chain settlement",
      "Fractions of a cent per transfer",
      "Cross-border ready",
    ],
  },
  {
    title: "Native Stripe card acceptance",
    body: "Homeowners pay by card the way they already expect to. Contractors get settled to an XRPL wallet or a bank account — contractor's choice. Card-in, on-chain or fiat-out, one rail handling both sides of the transaction.",
    points: [
      "Homeowners pay by card via Stripe",
      "Settle to XRPL wallet or bank",
      "Contractor chooses how they get paid",
    ],
  },
];

export default function PaymentsPage() {
  return (
    <>
      <PageHero
        eyebrow="SmartCity Payments"
        status="soon"
        title={
          <>
            The money rail
            <br className="hidden sm:block" /> contractors{" "}
            <span className="text-gradient">deserve</span>.
          </>
        }
        lede="Instant settlement, low fees, on-chain. SmartCity Payments is the money rail for the network — fast contractor payouts and commission settlement over XRPL blockchain rails, combined with native Stripe for card acceptance."
      >
        <CTAButton href="#waitlist">Get early access</CTAButton>
      </PageHero>

      {/* Why this matters */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Why this matters</p>
              <h2 className="mt-4 display-2">
                Contractors and reps wait weeks for their money. That ends.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl lede">
                The work is done, the job is closed, the customer has paid — and
                the rep still waits two weeks for a commission check, while the
                contractor floats subs out of their own pocket. The trades run on
                the slowest money in the economy. SmartCity Payments settles in
                seconds, on-chain, so the people who did the work get paid when
                the work is done — not whenever the paperwork catches up.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Three products */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">What&apos;s coming</p>
              <h2 className="mt-4 display-2">One rail, both sides of the deal.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {products.map((p, i) => (
              <ScrollReveal key={p.title} delay={(i % 3) * 0.06}>
                <div className="card flex h-full flex-col p-8">
                  <StatusTag status="soon" className="self-start" />
                  <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-subtle">
                    {p.body}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-[0.95rem]">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5">
                        <span className="mt-1 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        </span>
                        <span className="text-ink/80">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* QuoteSmart tie-in (§1.5) */}
      <section className="section-pad pt-4">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-canvas px-8 py-12 text-center md:px-14">
              <h2 className="display-2">Settles the jobs you close in QuoteSmart.</h2>
              <p className="mx-auto mt-6 max-w-xl lede">
                Payments isn&apos;t a separate app to reconcile against — it
                settles the exact jobs originated and closed in QuoteSmart. The
                quote, the close, and the payout live on one rail, so every
                dollar traces back to the job that earned it.
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
                <p className="eyebrow">Early access</p>
                <h2 className="mt-4 display-2">Get paid at the speed of the job.</h2>
                <p className="mx-auto mt-5 max-w-md lede">
                  Join the list. We&apos;ll bring you onto the rail as SmartCity
                  Payments opens.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="mt-10">
                <WaitlistForm
                  source="payments-waitlist"
                  cta="Join the Payments waitlist"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
