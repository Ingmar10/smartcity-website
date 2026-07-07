import Link from "next/link";

// Inline SVG logo — the rounded-square purple-gradient tile + lightning bolt
// icon plus the "SmartCity Contractors" wordmark. Built as code so the site
// renders without waiting on the high-res PNG; swap in the PNG when supplied.

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B5FDD" />
          <stop offset="1" stopColor="#9F3FD8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#scGrad)" />
      <path
        d="M27.5 9 15 26.2h7.4L20 39l12.8-17.6h-7.6L27.5 9Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function Logo({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const textColor = variant === "light" ? "text-white" : "text-ink";
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="SmartCity Contractors — home"
    >
      <LogoMark size={30} />
      <span className={`text-[1.05rem] font-bold tracking-[-0.02em] ${textColor}`}>
        SmartCity{" "}
        <span className="font-medium text-subtle group-hover:text-brand transition-colors">
          Contractors
        </span>
      </span>
    </Link>
  );
}
