import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark shadow-[0_8px_24px_-8px_rgba(107,63,208,0.6)] hover:shadow-[0_10px_28px_-8px_rgba(107,63,208,0.7)] hover:-translate-y-0.5",
  secondary:
    "bg-white text-ink border border-black/10 hover:border-black/20 hover:-translate-y-0.5",
  ghost: "text-brand hover:text-brand-dark",
};

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  const isExternal = href.startsWith("http");
  const cls = `${base} ${variants[variant]} ${className}`;

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
