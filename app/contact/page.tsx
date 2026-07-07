import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import { COMPANY, fullAddress } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a demo of QuoteSmart or start with DialBolt. Contact SmartCity Contractors.",
};

export default function ContactPage() {
  return (
    <section className="section-pad">
      <div className="container-content">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <ScrollReveal>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 display-2">Let&apos;s wire up your rail.</h1>
            <p className="mt-6 lede">
              Book a walkthrough of QuoteSmart, start reactivating dead leads
              with DialBolt, or just ask a question. We answer like operators,
              because we are.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                  Email
                </p>
                <a
                  href={`mailto:${COMPANY.generalEmail}`}
                  className="mt-1 block text-lg text-ink hover:text-brand"
                >
                  {COMPANY.generalEmail}
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                  Mailing address
                </p>
                <p className="mt-1 text-lg text-ink">{fullAddress()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                  Prefer to just ask?
                </p>
                <p className="mt-1 text-lg text-ink">
                  Tap <strong>Ask Bolt</strong> in the corner — our AI can answer
                  most questions about QuoteSmart and DialBolt on the spot.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
