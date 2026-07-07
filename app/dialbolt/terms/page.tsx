// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE — NOT LEGAL ADVICE.
// Ingmar to confirm final language before A2P filing.
//
// NOTE: DialBolt support phone is not yet provisioned. The "Contact us" section
// lists email only and flags that a support number will be added once the
// DialBolt Twilio line is live. SWAP BEFORE A2P FILING (see lib/brand.ts).
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/Legal";
import { COMPANY, fullAddress, LEGAL_EFFECTIVE_DATE } from "@/lib/brand";

export const metadata: Metadata = {
  title: "DialBolt Terms of Service",
  description:
    "Terms of Service for SmartCity Contractors / DialBolt, including SMS/text messaging program terms for A2P 10DLC.",
};

export default function TermsPage() {
  const email = COMPANY.policyEmail;

  return (
    <LegalShell title="Terms of Service" effectiveDate={LEGAL_EFFECTIVE_DATE}>
      <LegalSection heading="1. Acceptance of these Terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the
          services provided by {COMPANY.legalName} (&ldquo;
          {COMPANY.shortName},&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;),
          including <strong>QuoteSmart</strong> and the <strong>DialBolt</strong>{" "}
          lead-reactivation and text-messaging program. By using our services or
          opting in to receive messages, you agree to these Terms and to our{" "}
          <a href="/dialbolt/privacy" className="text-brand underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. Our services">
        <p>
          QuoteSmart is a quoting platform for contractors and dealers. DialBolt
          is a done-for-you lead-reactivation service that re-engages leads over
          SMS and email, books appointments, and routes leads into QuoteSmart
          for quoting and close verification. We may modify, suspend, or
          discontinue any part of the services at any time.
        </p>
      </LegalSection>

      <LegalSection heading="3. SMS / text messaging program">
        <p>
          By providing your mobile number and opting in, you agree to receive
          recurring text messages from {COMPANY.shortName} / DialBolt, including
          messages sent using an automated system. The following terms apply:
        </p>
        <LegalList
          items={[
            <>
              <strong>Consent is not a condition of purchase.</strong> You may
              opt in through our consent form or another approved method.
            </>,
            <>
              <strong>Message frequency</strong> varies based on your
              interactions with us.
            </>,
            <>
              <strong>Message and data rates may apply</strong> per your carrier
              plan.
            </>,
            <>
              To stop messages, reply <strong>STOP</strong> at any time. For
              help, reply <strong>HELP</strong>.
            </>,
            <>
              We support major U.S. wireless carriers; carriers are not liable
              for delayed or undelivered messages.
            </>,
            <>
              You confirm that you are the account holder or authorized user of
              the mobile number you provide, and that the number is accurate.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="4. Your responsibilities">
        <LegalList
          items={[
            "Provide accurate information and keep it up to date.",
            "Use the services only for lawful purposes and in compliance with these Terms.",
            "Do not misuse, disrupt, or attempt to gain unauthorized access to the services.",
            "If you use our services as a business, ensure you have any required consent from your own contacts before engaging our reactivation services.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. No guarantees">
        <p>
          Our services are provided &ldquo;as is&rdquo; and &ldquo;as
          available.&rdquo; We do not guarantee specific results, revenue,
          conversion rates, or outcomes from the use of QuoteSmart or DialBolt.
          To the fullest extent permitted by law, we disclaim all warranties,
          express or implied, including merchantability and fitness for a
          particular purpose.
        </p>
      </LegalSection>

      <LegalSection heading="6. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {COMPANY.shortName} will not
          be liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenue, arising out of or
          related to your use of the services. Our total liability for any claim
          relating to the services will not exceed the amount you paid us, if
          any, for the services in the twelve months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection heading="7. Intellectual property">
        <p>
          QuoteSmart, DialBolt, Bolt, and all related content, software, and
          branding are the property of {COMPANY.legalName} and are protected by
          applicable laws. You may not copy, modify, or create derivative works
          without our written permission.
        </p>
      </LegalSection>

      <LegalSection heading="8. Governing law">
        <p>
          These Terms are governed by the laws of the State of Florida, without
          regard to its conflict-of-laws principles. Any dispute will be subject
          to the exclusive jurisdiction of the state and federal courts located
          in Florida.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to these Terms">
        <p>
          We may update these Terms from time to time. When we do, we will
          revise the effective date above. Your continued use of the services
          after changes take effect constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contact us">
        <p>Questions about these Terms? Contact us:</p>
        <p className="rounded-xl bg-canvas p-4 leading-relaxed">
          {COMPANY.legalName}
          <br />
          {fullAddress()}
          <br />
          <a href={`mailto:${email}`} className="text-brand underline">
            {email}
          </a>
          <br />
          <span className="text-sm text-subtle">
            {COMPANY.supportPhone
              ? `Support phone: ${COMPANY.supportPhone}`
              : "A dedicated support phone number will be added here once our DialBolt line is provisioned. Until then, email is the fastest way to reach us."}
          </span>
        </p>
      </LegalSection>
    </LegalShell>
  );
}
