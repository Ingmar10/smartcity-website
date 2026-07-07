import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  cta?: { href: string; label: string };
  flip?: boolean; // visual on the left when true
  visual?: ReactNode; // pass a screenshot; falls back to a branded placeholder
};

export default function AlternatingRow({
  eyebrow,
  title,
  body,
  bullets,
  cta,
  flip = false,
  visual,
}: Props) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
      <ScrollReveal className={flip ? "md:order-2" : ""}>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-4 display-2">{title}</h3>
        <p className="mt-6 lede">{body}</p>
        {bullets && (
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand/10"
                >
                  <span className="h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="text-base leading-relaxed text-ink/80">
                  {b}
                </span>
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <div className="mt-9">
            <CTAButton href={cta.href} variant="ghost">
              {cta.label} <span aria-hidden>→</span>
            </CTAButton>
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal delay={0.1} className={flip ? "md:order-1" : ""}>
        {visual ?? <BrandedPlaceholder label={title} />}
      </ScrollReveal>
    </div>
  );
}

// A tasteful gradient placeholder used until real product screenshots land.
export function BrandedPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 border border-black/5 bg-brand-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_10%,rgba(255,255,255,0.25),transparent_50%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <span className="text-center text-lg font-semibold text-white/85">
          {label}
        </span>
      </div>
    </div>
  );
}
