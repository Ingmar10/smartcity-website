import Link from "next/link";
import { LogoMark } from "./Logo";
import SocialLinks from "./SocialLinks";
import { COMPANY, fullAddress } from "@/lib/brand";
import { ECOSYSTEM } from "@/lib/ecosystem";

const cols = [
  {
    heading: "Ecosystem",
    links: ECOSYSTEM.map((p) => ({ href: p.href, label: p.name })),
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "DialBolt Legal",
    links: [
      { href: "/dialbolt/privacy", label: "Privacy Policy" },
      { href: "/dialbolt/terms", label: "Terms of Service" },
      { href: "/dialbolt/consent", label: "SMS Consent" },
    ],
  },
];

export default function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-black/5 bg-canvas">
      <div className="container-content py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <span className="text-[1.05rem] font-bold tracking-[-0.02em]">
                SmartCity Contractors
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-subtle">
              Software built by an operator who ran the jobs first. QuoteSmart is
              the quoting rail underneath everything we ship.
            </p>
            <p className="mt-4 text-sm text-subtle">
              {fullAddress()}
              <br />
              <a
                href={`mailto:${COMPANY.policyEmail}`}
                className="text-brand hover:text-brand-dark"
              >
                {COMPANY.policyEmail}
              </a>
            </p>
            {/* Renders only for socials with a URL set in lib/brand.ts */}
            <SocialLinks className="mt-6" />
          </div>

          {cols.map((c) => (
            <div key={c.heading}>
              <h4 className="text-sm font-semibold text-ink">{c.heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-subtle transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-black/5 pt-6 text-sm text-subtle md:flex-row md:items-center">
          <p>
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="text-xs">
            QuoteSmart, DialBolt, and Bolt are products of SmartCity Contractors
            LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
