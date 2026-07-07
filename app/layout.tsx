import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BoltWidget from "@/components/BoltWidget";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCity Contractors",
    description:
      "QuoteSmart for quoting. DialBolt for reviving dead leads. Every lead runs through QuoteSmart.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-white antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <BoltWidget />
      </body>
    </html>
  );
}
