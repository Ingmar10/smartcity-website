import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import AlternatingRow from "@/components/AlternatingRow";
import CTAButton from "@/components/CTAButton";
import PhoneShot from "@/components/Screenshot";
import WaitlistForm from "@/components/WaitlistForm";
import StatusTag from "@/components/StatusTag";

export const metadata: Metadata = {
  title: "QuoteSmart",
  description:
    "QuoteSmart is the quoting platform for contractors and dealers — server-side cost stripping, floor-price enforcement, dual-output quotes, branded PDF proposals, and a public customer quote view.",
};

const features = [
  {
    title: "Server-side cost stripping",
    body: "Dealers never receive cost, margin, or distributor pricing. It's enforced at the Cloud Function layer — a hard architectural rule, not a UI toggle.",
  },
  {
    title: "Floor-price enforcement",
    body: "Flat, per-watt, or per-square-foot floors with greater-of logic and adders-inclusive totals. Your floor holds.",
  },
  {
    title: "Per-dealer overrides",
    body: "A three-tier precedence chain — per-kit rule, dealer override, global line rule — so every account prices the way it should.",
  },
  {
    title: "Dual-output quotes",
    body: "A clean customer-facing proposal, fully separated from the internal contractor material list. The BOM never leaks.",
  },
  {
    title: "Per-dealer branding",
    body: "Each dealer can present under their own brand or the parent brand. One platform, many storefronts.",
  },
  {
    title: "Role-based access",
    body: "Five roles enforced by security rules. Dealer quote writes are forced through a callable function — no direct client writes.",
  },
  {
    title: "Bolt AI, built in",
    body: "A streaming AI assistant with markdown, voice input, and attachments — right inside the quoting flow.",
  },
  {
    title: "Rep profiles & attribution",
    body: "Photo upload and per-rep quote attribution, so every quote is tied to the person who sent it.",
  },
  {
    title: "Public quote view & PDF",
    body: "Share a live customer-facing quote at a clean URL, or export a branded PDF proposal. Works offline as a PWA.",
  },
];

export default function QuoteSmartPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-pad pb-16">
        <div className="container-content">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <ScrollReveal>
              <p className="eyebrow">QuoteSmart</p>
              <h1 className="mt-5 display-1">
                Quote like you<br />
                mean it.
              </h1>
              <p className="mt-7 lede">
                The quoting platform for contractors and dealers. Price the job,
                protect your margin, brand the proposal, and close — all on one
                rail that every lead runs through.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <CTAButton href="/contact">Book a demo</CTAButton>
                <CTAButton href="#download" variant="secondary">
                  Get the app
                </CTAButton>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <PhoneShot
                src="/screenshots/quotesmart-dashboard.jpg"
                alt="QuoteSmart dashboard on mobile, showing pipeline value, profit margin, and the Ask Bolt assistant"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="section-pad pt-8">
        <div className="container-content">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">The platform</p>
              <h2 className="mt-4 display-2">
                Everything a quote needs to become a job.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={(i % 3) * 0.06}>
                <div className="card h-full p-7">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
                    <span className="h-3 w-3 rounded-sm bg-brand-gradient" />
                  </div>
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-subtle">
                    {f.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Showcases */}
      <section className="section-pad pt-8">
        <div className="container-content space-y-28 md:space-y-36">
          <AlternatingRow
            eyebrow="Branded proposals"
            title="Your brand on the outside. Your margin on the inside."
            body="Every proposal goes out under the right brand — the dealer's or the parent's — with a clean, customer-ready layout. The material list and cost build-up stay internal, always."
            bullets={[
              "Logos, colors, and typography per brand",
              "Puppeteer-rendered PDF export",
              "Customer-facing quote at a public link",
            ]}
            visual={
              <PhoneShot
                src="/screenshots/proposal-branding.jpg"
                alt="QuoteSmart proposal branding settings — logos, default cover, brand colors, and typography"
              />
            }
          />
          <AlternatingRow
            flip
            eyebrow="Your team"
            title="Reps, roles, and attribution that actually hold."
            body="Rep profiles, quote attribution per person, and enforced roles — Owner, Admin, Sales Rep, Dealer. Dealer writes are routed through a secured function so quotes can't be tampered with client-side."
            bullets={[
              "Invite members and assign roles",
              "Owner / Admin / Sales Rep / Dealer access",
              "Measurement PDF import pipeline",
            ]}
            visual={
              <PhoneShot
                src="/screenshots/team.jpg"
                alt="QuoteSmart team management — add members, assign roles, and manage access"
              />
            }
          />
        </div>
      </section>

      {/* AI-Powered Inventory — coming soon, Bolt-powered, inside QuoteSmart */}
      <section id="inventory" className="section-pad pt-8">
        <div className="container-content">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-canvas p-8 md:p-14">
              <div className="grid gap-12 md:grid-cols-2 md:items-center">
                {/* Copy */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="eyebrow">Bolt-powered · inside QuoteSmart</p>
                    <StatusTag status="soon" />
                  </div>
                  <h2 className="mt-4 display-2">
                    Inventory that thinks like you do.
                  </h2>
                  <p className="mt-6 lede">
                    Bolt-powered inventory management inside QuoteSmart. Track
                    stock levels, get reorder alerts based on your pipeline, and
                    ask Bolt about anything — like you&apos;re talking to your
                    best purchasing manager.
                  </p>
                  <ul className="mt-8 space-y-3">
                    {[
                      "Track stock levels across your catalog",
                      "Reorder alerts driven by your live pipeline",
                      "Ask Bolt about pricing, availability, and what to order next",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/10">
                          <span className="h-2 w-2 rounded-full bg-brand" />
                        </span>
                        <span className="text-base leading-relaxed text-ink/80">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Example "ask Bolt" bubbles */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-subtle">
                    Just ask, like you would a person:
                  </p>
                  {[
                    "What's the best price on a Powerwall 3 right now?",
                    "I'm running low on IQ8+ microinverters — reorder?",
                  ].map((q) => (
                    <div key={q} className="flex items-start gap-3">
                      <InventoryBoltTile />
                      <div className="rounded-2xl rounded-tl-md border border-black/5 bg-white px-4 py-3 text-[0.95rem] leading-relaxed text-ink shadow-[0_1px_2px_rgba(20,16,25,0.04)]">
                        {q}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waitlist */}
              <div className="mx-auto mt-12 max-w-xl border-t border-black/5 pt-10">
                <p className="mb-4 text-center text-sm font-semibold text-ink">
                  Want it first? Join the AI-Powered Inventory waitlist.
                </p>
                <WaitlistForm
                  source="inventory-waitlist"
                  cta="Join the Inventory waitlist"
                  note="No spam. We'll email you when AI-Powered Inventory opens."
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="section-pad pt-8">
        <div className="container-content">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient px-8 py-16 text-center md:px-16">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,rgba(255,255,255,0.2),transparent_50%)]"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-[-0.02em] text-white">
                  Put QuoteSmart in your pocket.
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-lg text-white/85">
                  QuoteSmart installs as an app and works offline — quote from
                  the truck, the roof, or the kitchen table. Book a demo and
                  we&apos;ll get you set up.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <CTAButton href="/contact" variant="secondary">
                    Book a demo
                  </CTAButton>
                  <CTAButton
                    href="/dialbolt"
                    variant="ghost"
                    className="text-white hover:text-white/80"
                  >
                    Feed it with DialBolt <span aria-hidden>→</span>
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

// Small gradient bolt tile echoing the Bolt widget, for the "ask Bolt" bubbles.
function InventoryBoltTile() {
  return (
    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[0.6rem] bg-brand-gradient text-white">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M13.5 2 5 13h5.2L9 22l8.5-11H12l1.5-9Z" />
      </svg>
    </span>
  );
}
