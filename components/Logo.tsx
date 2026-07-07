import Link from "next/link";
import Image from "next/image";

// SmartCity Contractors brand mark — the purple house/bulb icon. Single purple
// mark works on both light and dark backgrounds, so nav, footer, and favicon all
// share it for full brand consistency. The `variant` prop controls the wordmark
// text color only.

export function LogoMark({
  size = 32,
}: {
  size?: number;
  /** Accepted for call-site symmetry; the mark is a single purple asset. */
  variant?: "dark" | "white";
}) {
  return (
    <Image
      src="/logo/smartcity-mark.png"
      width={size}
      height={size}
      alt=""
      aria-hidden
      priority
      className="object-contain"
    />
  );
}

export default function Logo({
  variant = "dark",
}: {
  variant?: "dark" | "white";
}) {
  const textColor = variant === "white" ? "text-white" : "text-ink";
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="SmartCity Contractors — home"
    >
      <LogoMark size={34} variant={variant} />
      <span
        className={`text-[1.05rem] font-bold tracking-[-0.02em] ${textColor}`}
      >
        SmartCity{" "}
        <span className="font-medium text-subtle transition-colors group-hover:text-brand">
          Contractors
        </span>
      </span>
    </Link>
  );
}
