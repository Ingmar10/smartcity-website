import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";
import StatusTag from "./StatusTag";
import type { EcosystemStatus } from "@/lib/ecosystem";

// Centered page hero shared across the ecosystem pages, matching the site's
// Apple-style scale and rhythm.
export default function PageHero({
  eyebrow,
  title,
  lede,
  status,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  status?: EcosystemStatus;
  children?: ReactNode; // CTA area
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div className="h-[460px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(107,63,208,0.14),transparent)]" />
      </div>
      <div className="container-content pt-24 pb-16 md:pt-32 md:pb-20">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3">
              <p className="eyebrow">{eyebrow}</p>
              {status && <StatusTag status={status} />}
            </div>
            <h1 className="mt-5 display-1">{title}</h1>
            <p className="mx-auto mt-7 max-w-2xl lede">{lede}</p>
            {children && (
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {children}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
