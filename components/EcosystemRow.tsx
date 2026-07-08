import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import StatusTag from "./StatusTag";
import { ECOSYSTEM } from "@/lib/ecosystem";

// "The SmartCity Ecosystem" — a preview of every product in one row so the full
// ecosystem is visible on the homepage even to visitors who never open the nav.
export default function EcosystemRow() {
  return (
    <section className="section-pad border-t border-black/5 bg-canvas">
      <div className="container-content">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The SmartCity ecosystem</p>
            <h2 className="mt-4 display-2">One operator. One stack.</h2>
            <p className="mx-auto mt-6 max-w-xl lede">
              Everything below runs on the same spine — QuoteSmart for quoting,
              Bolt for the AI. Some are live today; more are landing soon.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map((p, i) => (
            <ScrollReveal key={p.href} delay={(i % 3) * 0.05}>
              <Link
                href={p.href}
                className="card group flex h-full flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(20,16,25,0.04),0_20px_50px_-16px_rgba(20,16,25,0.18)]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <StatusTag status={p.status} />
                </div>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-subtle">
                  {p.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  {p.status === "live" ? "Explore" : "Learn more"}
                  <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
