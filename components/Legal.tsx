import type { ReactNode } from "react";

// Shared, lightly-styled primitives for the legal pages (no typography plugin).

export function LegalShell({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <section className="section-pad">
      <div className="container-content">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">DialBolt · SmartCity Contractors</p>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.02em]">
            {title}
          </h1>
          <p className="mt-3 text-sm text-subtle">
            Effective date: {effectiveDate}
          </p>
          <div className="mt-10 space-y-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-[-0.01em] md:text-2xl">
        {heading}
      </h2>
      <div className="mt-3 space-y-4 text-[1.02rem] leading-relaxed text-ink/80">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
