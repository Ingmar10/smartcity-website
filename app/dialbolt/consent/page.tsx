import type { Metadata } from "next";
import { Suspense } from "react";
import ConsentForm from "@/components/ConsentForm";

export const metadata: Metadata = {
  title: "SMS Consent",
  description:
    "Opt in to receive text messages from SmartCity Contractors / DialBolt. TCPA-compliant consent — message and data rates may apply, reply STOP to opt out.",
  robots: { index: false, follow: false },
};

export default function ConsentPage() {
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
            {/* useSearchParams requires a Suspense boundary in the App Router */}
            <Suspense
              fallback={
                <div className="card p-8 text-center text-subtle">
                  Loading…
                </div>
              }
            >
              <ConsentForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
