import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Script from "next/script";
import JsonLd from "@/components/JsonLd";
import { COMPANY } from "@/lib/brand";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.siteUrl),
  title: {
    default: "SmartCity Contractors — The quoting rail for the trades",
    template: "%s · SmartCity Contractors",
  },
  description:
    "SmartCity Contractors builds QuoteSmart, the quoting platform for contractors and dealers, and DialBolt, done-for-you dead-lead reactivation. Software from an operator who ran the jobs first.",
  keywords: [
    "QuoteSmart",
    "DialBolt",
    "contractor quoting software",
    "solar quoting",
    "dealer pricing",
    "lead reactivation",
    "SmartCity Contractors",
  ],
  openGraph: {
    title: "SmartCity Contractors — The quoting rail for the trades",
    description:
      "QuoteSmart for quoting. DialBolt for reviving dead leads. Every lead runs through QuoteSmart.",
    url: COMPANY.siteUrl,
    siteName: "SmartCity Contractors",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SmartCity Contractors: QuoteSmart quoting, automations and websites for the trades" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
    title: "SmartCity Contractors",
    description:
      "QuoteSmart for quoting. DialBolt for reviving dead leads. Every lead runs through QuoteSmart.",
  },
  alternates: { canonical: "./" },
  robots: { index: true, follow: true },
};

// Explicit mobile viewport so phones render at device width (not desktop width).
// initialScale 1; zoom left enabled for accessibility.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-white antialiased">
        <JsonLd />
        <Nav />
        <main>{children}</main>
        <Footer />
        {/* Bolt: the same assistant as Bolt HQ, with a public front-desk badge (answers, captures and books leads into GHL). */}
        <Script src="https://hq.smartcity.contractors/widget.js" data-site="smartcity" strategy="afterInteractive" />
      </body>
    </html>
  );
}
