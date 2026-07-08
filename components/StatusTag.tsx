import type { EcosystemStatus } from "@/lib/ecosystem";

// Small status pill: "Live" or "Coming soon".
export default function StatusTag({
  status,
  className = "",
}: {
  status: EcosystemStatus;
  className?: string;
}) {
  if (status === "live") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ${className}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Live
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Coming soon
    </span>
  );
}
