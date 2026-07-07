// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE — NOT LEGAL ADVICE.
// Ingmar to confirm final language before A2P filing.
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/Legal";
import { COMPANY, fullAddress, LEGAL_EFFECTIVE_DATE } from "@/lib/brand";

export const metadata: Metadata = {
  title: "DialBolt Privacy Policy",
  description:
    "Privacy Policy for SmartCity Contractors / DialBolt, including SMS/text messaging disclosures for A2P 10DLC.",
};

export default function PrivacyPage() {
  const email = COMPANY.policyEmail;

  return (
    <LegalShell title="Privacy Policy" effectiveDate={LEGAL_EFFECTIVE_DATE}>
      <LegalSection heading="Overview">
        <p>
          This Privacy Policy explains how {COMPANY.legalName} (&ldquo;
          {COMPANY.shortName},&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, and protects information in
          connection with our services, including <strong>QuoteSmart</strong>{" "}
          and the <strong>DialBolt</strong> lead-reactivation and text-messaging
          program. By using our services or opting in to receive text messages,
          you agree to this Policy.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <LegalList
          items={[
            <>
              <strong>Contact information</strong> you provide — such as your
              name, mobile phone number, and email address.
            </>,
            <>
              <strong>Project information</strong> related to services you
              request or that a contractor engages us to perform (for example,
              property details or the type of work).
            </>,
            <>
              <strong>Communication records</strong> — the content and metadata
              of messages exchanged with us, including SMS and email, and your
              consent selections and timestamps.
            </>,
            <>
              <strong>Technical data</strong> collected automatically, such as
              IP address, device/browser information, and usage data when you
              visit our website.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="SMS / text messaging program">
        <p>
          If you opt in, {COMPANY.shortName} / DialBolt will send you recurring
          text messages related to your project, appointments, and quotes,
          including messages sent using an automated system. The specifics of
          the program:
        </p>
        <LegalList
          items={[
            <>
              <strong>Consent:</strong> You will only receive SMS messages after
              you provide express written consent (for example, by submitting
              our consent form or otherwise opting in). Consent is not a
              condition of any purchase.
            </>,
            <>
              <strong>Message frequency</strong> varies based on your
              interactions with us.
            </>,
            <>
              <strong>Message and data rates may apply</strong> according to
              your mobile carrier plan.
            </>,
            <>
              <strong>Opt out at any time</strong> by replying{" "}
              <strong>STOP</strong> to any message. Reply <strong>HELP</strong>{" "}
              for assistance.
            </>,
            <>
              Carriers are not liable for delayed or undelivered messages.
            </>,
          ]}
        />
        <p className="rounded-xl bg-canvas p-4 text-[0.98rem]">
          <strong>
            We do not sell, rent, or share your mobile opt-in information or SMS
            consent with third parties or affiliates for their own marketing
            purposes.
          </strong>{" "}
          Mobile information collected for the SMS program is used solely to
          deliver the program and support you.
        </p>
      </LegalSection>

      <LegalSection heading="How we use information">
        <LegalList
          items={[
            "To provide, operate, and improve our services, including QuoteSmart and DialBolt.",
            "To contact you about your project, appointments, quotes, and support requests.",
            "To send SMS and email communications you have consented to receive.",
            "To maintain records of consent and communications as required for compliance.",
            "To secure our services and prevent fraud or abuse.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="How we share information">
        <p>
          We do not sell your personal information. We share information only as
          needed to operate our services:
        </p>
        <LegalList
          items={[
            <>
              <strong>Service providers</strong> that help us deliver our
              services (for example, messaging, hosting, and scheduling
              vendors), under obligations to protect your information and use it
              only for the services they provide to us.
            </>,
            <>
              <strong>The contractor or business</strong> engaging our services
              on your behalf, so they can serve you.
            </>,
            <>
              <strong>Legal and safety</strong> reasons — to comply with law,
              enforce our terms, or protect rights and safety.
            </>,
          ]}
        />
        <p>
          As stated above, we never share SMS opt-in or consent data with third
          parties for their marketing.
        </p>
      </LegalSection>

      <LegalSection heading="Data retention & security">
        <p>
          We retain personal information for as long as needed to provide our
          services and to meet legal, tax, and compliance obligations —
          including retaining records of SMS consent. We use reasonable
          administrative, technical, and organizational measures to protect your
          information, though no method of transmission or storage is completely
          secure.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <LegalList
          items={[
            "Opt out of SMS at any time by replying STOP.",
            "Unsubscribe from marketing emails using the link in the email.",
            <>
              Request access to, correction of, or deletion of your personal
              information by contacting us at{" "}
              <a href={`mailto:${email}`} className="text-brand underline">
                {email}
              </a>
              .
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="Children's privacy">
        <p>
          Our services are intended for adults and are not directed to
          individuals under 18. We do not knowingly collect personal information
          from children.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the effective date above. Your continued use of our
          services after changes take effect constitutes acceptance of the
          updated Policy.
        </p>
      </LegalSection>

      <LegalSection heading="Contact us">
        <p>Questions about this Policy or your information? Contact us:</p>
        <p className="rounded-xl bg-canvas p-4 not-italic leading-relaxed">
          {COMPANY.legalName}
          <br />
          {fullAddress()}
          <br />
          <a href={`mailto:${email}`} className="text-brand underline">
            {email}
          </a>
        </p>
      </LegalSection>
    </LegalShell>
  );
}
