# SmartCity Contractors — Marketing Website

Marketing site for **SmartCity Contractors**, publisher of **QuoteSmart** (the
quoting platform), **DialBolt** (dead-lead reactivation), and **Bolt** (the AI
assistant). Built as a coded stack, deployed to Vercel at
`smartctycontractors.com`.

## Stack
- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — brand tokens in `tailwind.config.ts`
- **Framer Motion** — scroll reveals + widget transitions
- **Anthropic SDK** (`@anthropic-ai/sdk`) — powers the Bolt chat widget (Claude Haiku 4.5)
- **@vercel/postgres** — stores DialBolt TCPA consent records

## Pages
| Route | Purpose |
| --- | --- |
| `/` | Home — hero, "what we do" rows, trust, CTA |
| `/about` | Origin story: operator-in-the-field → platform |
| `/quotesmart` | QuoteSmart feature showcase + app CTA |
| `/dialbolt` | DialBolt reactivation service |
| `/dialbolt/consent` | Rep-attributed TCPA SMS consent form (`?rep=` param) |
| `/dialbolt/privacy` | Privacy Policy (A2P 10DLC) |
| `/dialbolt/terms` | Terms of Service (A2P 10DLC) |
| `/network` | SmartCity Contractors Network (live) — hierarchy, members, apply |
| `/voice` | SmartCity Voice (coming soon) — AI voice agents, waitlist |
| `/payments` | SmartCity Payments (coming soon) — XRPL + Stripe money rail, waitlist |
| `/university` | SmartCity University (coming soon) — training tracks, waitlist |
| `/contact` | Contact form + business info |

The ecosystem is defined in one place — `lib/ecosystem.ts` — which drives the nav
"Ecosystem" dropdown, the homepage ecosystem row, and the footer. Coming-soon
pages use rep-attributed waitlist forms (`components/WaitlistForm.tsx`, hidden
`rep` from `?rep=` + a per-page `source` tag) that POST to `/api/waitlist` and
store durably via `lib/waitlistStore.ts` (Vercel Postgres → `waitlist_signups`,
local `.data/waitlist.jsonl` fallback in dev), same pattern as DialBolt consent.
Valid `source` values: `voice-waitlist`, `payments-waitlist`,
`university-waitlist`, `network-apply`.

Site-wide: a floating **Ask Bolt** pill (bottom-right) opens a Claude-powered
chat widget scoped to the SmartCity ecosystem. It **never auto-opens** (cost
control).

## Local development
```bash
npm install
cp .env.local.example .env.local   # then fill in ANTHROPIC_API_KEY to test Bolt
npm run dev                        # http://localhost:3000
```
Without `POSTGRES_URL`, consent submissions are written to `.data/consent.jsonl`
(gitignored) so nothing is lost while testing locally.

## Environment variables
Set these in **Vercel → Project → Settings → Environment Variables** (never commit real values):

| Var | Required | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes (for Bolt) | Claude API key. Powers `/api/bolt`. |
| `POSTGRES_URL` | Yes (before launch) | Auto-set when you provision Vercel Postgres. Stores consent records. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical/OG URL. Defaults to `https://smartctycontractors.com`. |

## Deploy (Vercel)
1. Push to GitHub (`Ingmar10/smartcity-website`, public).
2. Import the repo in Vercel (framework auto-detected as Next.js).
3. Add `ANTHROPIC_API_KEY` as an env var.
4. **Provision Vercel Postgres** (Storage tab → Create → Postgres) and link it to
   the project — this sets `POSTGRES_URL` automatically. The `consent_records`
   table is created on the first submission.
5. Deploy, test on the `*.vercel.app` URL, then point DNS.

## DNS
Point `smartctycontractors.com` (and `www`) to Vercel per the records Vercel
shows in **Settings → Domains**. Do this only after the site is tested.

## ⚠️ Before A2P 10DLC filing — required swaps
- [ ] **DialBolt support phone.** The Twilio line isn't provisioned yet. Set
      `COMPANY.supportPhone` in `lib/brand.ts` once it's live — it flows into the
      Terms automatically. Search the codebase for `SWAP BEFORE A2P FILING`.
- [ ] **Legal review.** `app/dialbolt/privacy/page.tsx` and
      `app/dialbolt/terms/page.tsx` are templates (marked at the top of each
      file: *NOT LEGAL ADVICE*). Confirm final language before filing.
- [ ] **Provision Postgres** so consent records are durably captured in
      production (the consent record is the TCPA compliance artifact).

## Notes
- **Consent records** (`lib/consentStore.ts`) are stored on submit — the raw
  record is the compliance artifact. Email/Zapier/GHL forwarding can be wired
  later without changing the form.
- **Bolt rate limit** (`lib/rateLimit.ts`): 20 messages / IP / hour, returns 429.
  It's in-memory (per serverless instance). For strict cross-instance limits at
  scale, move the counter to Vercel KV / Upstash Redis.
- **Brand assets** (`public/`): the purple **house/bulb mark**
  (`public/logo/smartcity-mark.png`) is the brand mark — used consistently in the
  nav, footer, and favicon. Also included: the S-monogram exports
  (`smartcity-icon-{dark,white}.png`, `smartcity-lockup-{dark,white}.png`) as
  spare brand-kit assets, and `public/screenshots/*.jpg` (QuoteSmart dashboard,
  Bolt panel, proposal branding, team).
- **Favicons:** SmartCity site favicon is the purple house/bulb mark —
  `app/icon.png`, `app/apple-icon.png` (white-backed for iOS), and
  `app/favicon.ico`, all generated from `public/logo/smartcity-mark.png`.
  DialBolt has its own per-route favicon at `app/dialbolt/icon.svg` (bolt tile).
