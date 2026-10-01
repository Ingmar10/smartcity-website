import { COMPANY, SOCIALS } from "@/lib/brand";

// Organization + WebSite + QuoteSmart (SoftwareApplication) structured data.
// Rendered once in the root layout. No phone is listed until the business line
// exists (see COMPANY.supportPhone).
export default function JsonLd() {
  const a = COMPANY.mailingAddress;
  const sameAs = Object.values(SOCIALS).filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${COMPANY.siteUrl}/#org`,
        name: COMPANY.shortName,
        legalName: COMPANY.legalName,
        url: COMPANY.siteUrl,
        logo: `${COMPANY.siteUrl}/logo/smartcity-mark.png`,
        email: COMPANY.generalEmail,
        address: {
          "@type": "PostalAddress",
          streetAddress: a.line1,
          addressLocality: a.city,
          addressRegion: a.state,
          postalCode: a.zip,
          addressCountry: "US",
        },
        areaServed: { "@type": "State", name: "Florida" },
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${COMPANY.siteUrl}/#website`,
        url: COMPANY.siteUrl,
        name: COMPANY.shortName,
        publisher: { "@id": `${COMPANY.siteUrl}/#org` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${COMPANY.siteUrl}/quotesmart#app`,
        name: "QuoteSmart",
        url: `${COMPANY.siteUrl}/quotesmart`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android (PWA)",
        description:
          "Quoting platform for contractors and dealers with floor-price enforcement, branded proposals and an AI assistant.",
        publisher: { "@id": `${COMPANY.siteUrl}/#org` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
