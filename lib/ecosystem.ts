// Single source of truth for the SmartCity product ecosystem. Used by the nav
// dropdown, the homepage ecosystem row, and the footer so everything stays in
// sync. Order here is the display order.

export type EcosystemStatus = "live" | "soon";

export type EcosystemProduct = {
  name: string;
  href: string;
  tagline: string; // one line for nav/footer
  blurb: string; // slightly longer, for the homepage row
  status: EcosystemStatus;
};

export const ECOSYSTEM: EcosystemProduct[] = [
  {
    name: "QuoteSmart",
    href: "/quotesmart",
    tagline: "The quoting platform",
    blurb:
      "Price, brand, and close — the central rail every SmartCity lead runs through.",
    status: "live",
  },
  {
    name: "DialBolt",
    href: "/dialbolt",
    tagline: "Dead-lead reactivation",
    blurb:
      "Done-for-you SMS reactivation that revives old leads and feeds them into QuoteSmart.",
    status: "live",
  },
  {
    name: "SmartCity Network",
    href: "/network",
    tagline: "The contractor network",
    blurb:
      "The backbone of the trades — contractors plug into the operating stack and keep their independence.",
    status: "live",
  },
  {
    name: "SmartCity Voice",
    href: "/voice",
    tagline: "AI voice agents",
    blurb:
      "Done-for-you inbound AI voice that answers, qualifies, and books — 24/7.",
    status: "soon",
  },
  {
    name: "SmartCity Payments",
    href: "/payments",
    tagline: "The money rail",
    blurb:
      "Instant, low-fee contractor payouts and commission settlement on XRPL rails, plus native Stripe card acceptance.",
    status: "soon",
  },
  {
    name: "SmartCity University",
    href: "/university",
    tagline: "Field-tested training",
    blurb:
      "Contractor training built by an operator who ran the jobs — not an influencer.",
    status: "soon",
  },
];

// ── Network membership (drives the /network page's two-tier structure) ──
// Tier 1 = operating businesses SmartCity builds/runs directly. Tier 2 =
// trusted outside partners who plug into the network. Kept here as the single
// source of truth so the /network page and any future references stay in sync.

export type NetworkMember = {
  name: string;
  role: string;
  body: string;
  href: string | null; // internal link if the member has its own page
};

export type NetworkTier = {
  key: string;
  tier: string; // "Tier 1"
  label: string; // "Operating businesses"
  description: string;
  members: NetworkMember[];
  openCapacity?: { title: string; body: string };
};

export const NETWORK_TIERS: NetworkTier[] = [
  {
    key: "operating",
    tier: "Tier 1",
    label: "Operating businesses",
    description:
      "The companies SmartCity builds and runs directly on the stack.",
    members: [
      {
        name: "QuoteSmart",
        role: "The quoting platform",
        body: "The central rail. Every lead in the network flows through QuoteSmart for quoting and close verification.",
        href: "/quotesmart",
      },
      {
        name: "DialBolt",
        role: "Dead-lead reactivation",
        body: "Revives old leads over compliant SMS, books the appointment, and hands them to QuoteSmart.",
        href: "/dialbolt",
      },
      {
        name: "Ori Energy",
        role: "Operating member · solar, roofing, battery",
        body: "A licensed Florida contractor running live on the stack — the proof the operating model works in the field.",
        href: null,
      },
    ],
  },
  {
    key: "partners",
    tier: "Tier 2",
    label: "Network partners",
    description:
      "Trusted outside partners who plug into the network to deliver in the field.",
    members: [
      {
        name: "Crawl Space Doctor / BeCoolAmerica",
        role: "Trusted field-labor partner",
        body: "Boots on the ground for Detach & Reset (D&R) and crawl space work — the labor partner that gets jobs done across the network.",
        href: null,
      },
    ],
    openCapacity: {
      title: "Open capacity — new partners",
      body: "Room for more trusted field-labor and specialty partners who want to plug into the network's deal flow while keeping their independence.",
    },
  },
];
