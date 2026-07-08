// Central brand + business-identity constants.
// Anything a human might need to update (legal contact, phone) lives here so
// there is a single source of truth across the site and the legal pages.

export const COMPANY = {
  legalName: "SmartCity Contractors LLC",
  shortName: "SmartCity Contractors",
  // Policy / legal contact channel (interim sole channel until the phone is live).
  policyEmail: "contact@smartctycontractors.com",
  generalEmail: "contact@smartctycontractors.com",
  mailingAddress: {
    line1: "27251 Wesley Chapel Blvd, Suite 1051",
    city: "Wesley Chapel",
    state: "FL",
    zip: "33544",
  },
  // ────────────────────────────────────────────────────────────────────────
  // TODO: SWAP BEFORE A2P FILING
  // The DialBolt Twilio line is not provisioned yet. Until it is, policies use
  // email as the sole contact. When the number is live, set it here and it will
  // propagate to the Privacy Policy and Terms automatically.
  // ────────────────────────────────────────────────────────────────────────
  supportPhone: null as string | null,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://smartctycontractors.com",
} as const;

export function fullAddress(): string {
  const a = COMPANY.mailingAddress;
  return `${a.line1}, ${a.city}, ${a.state} ${a.zip}`;
}

// Brand color tokens (kept in sync with tailwind.config.ts).
export const BRAND = {
  primary: "#6B3FD0",
  dark: "#4A2BA0",
  light: "#9F6FE5",
  gradientFrom: "#5B5FDD",
  gradientTo: "#9F3FD8",
  canvas: "#F7F6FB",
} as const;

// Effective date used across legal pages. Update when policy text changes.
export const LEGAL_EFFECTIVE_DATE = "July 7, 2026";

// Products in the public brand hierarchy:
//   SmartCity Contractors → QuoteSmart → Bolt → DialBolt → Melina
export const PRODUCTS = {
  quotesmart: "QuoteSmart",
  dialbolt: "DialBolt",
  bolt: "Bolt",
} as const;

// ── Social profiles ────────────────────────────────────────────────────────
// Add a profile URL to make its icon appear in the footer; leave it "" to hide
// it. Facebook, Instagram, and TikTok are live. LinkedIn, YouTube, and X are
// pre-wired (icon + render logic ready) — just drop in a URL to light them up,
// no code change. Update URLs here; nothing else to touch.
export type SocialKey =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "x";

export const SOCIALS: Record<SocialKey, string> = {
  facebook: "",
  instagram: "",
  tiktok: "",
  linkedin: "",
  youtube: "",
  x: "",
};
