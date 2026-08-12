import type { Metadata } from "next";
import ConsentForm from "@/components/ConsentForm";

export const metadata: Metadata = {
  title: "SMS Consent",
  description:
    "Opt in to receive text messages from SmartCity Contractors / DialBolt. TCPA-compliant consent — message and data rates may apply, reply STOP to opt out.",
  robots: { index: false, follow: false },
};

/**
 * `rep` is read HERE, on the server, and passed down — not read from
 * `useSearchParams()` inside the form.
 *
 * That is the whole SSR fix. Reading search params on the client forced the
 * form into a client-only subtree, so the served HTML contained the Suspense
 * fallback instead of the consent checkbox and its TCPA disclosure. This page
 * is the opt-in workflow named in the A2P campaign registration, so that
 * language has to be in the markup a reviewer fetches, JavaScript or not.
 *
 * Accepting `searchParams` makes this page dynamically rendered rather than
 * statically prerendered, which is correct: the response genuinely varies by
 * `?rep=`.
 */
export default function ConsentPage({
  searchParams,
}: {
  searchParams?: { rep?: string | string[] };
}) {
  const raw = searchParams?.rep;
  // A repeated ?rep=a&rep=b arrives as an array — take the first rather than
  // stringifying "a,b" into the attribution field.
  const rep = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  return (
    <section className="section-pad">
      <div className="container-content">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <p className="eyebrow">DialBolt</p>
            <h1 className="mt-4 display-2">Text message consent</h1>
            <p className="mx-auto mt-5 max-w-md lede">
              Confirm your number to receive updates about your project,
              appointments, and quotes from SmartCity Contractors.
            </p>
          </div>

          <div className="mt-10">
            <ConsentForm rep={rep} />
          </div>
        </div>
      </div>
    </section>
  );
}
