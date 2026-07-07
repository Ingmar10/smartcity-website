import Link from "next/link";
import Image from "next/image";

// SmartCity Contractors mark — the real S-monogram (extracted from the brand
// PNG). Dark variant for light backgrounds, white for dark/purple backgrounds.
// (The purple lightning-bolt tile is the QuoteSmart/Bolt product icon, used in
// the Bolt widget — not the corporate mark.)

export function LogoMark({
  size = 32,
  variant = "dark",
}: {
  size?: number;
  variant?: "dark" | "white";
}) {
  const src =
    variant === "white"
      ? "/logo/smartcity-icon-white.png"
      : "/logo/smartcity-icon-dark.png";
  return (
    <Image
      src={src}
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
      <LogoMark size={30} variant={variant} />
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
