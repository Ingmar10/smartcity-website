import { query } from "@/lib/db";
import { forwardLead, type LeadPayload } from "@/lib/leadForward";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// One-time backfill of stored submissions into the SmartCity Ingmar GHL
// sub-account (through the same n8n workflow live submissions use). Runs here
// because the production database credentials are sensitive and can't be pulled
// to a laptop. Locked to the same shared key the n8n webhook checks.
//
//   POST /api/admin/backfill-leads?dry=1                 -> counts only
//   POST /api/admin/backfill-leads?offset=0&limit=10     -> send one batch
//
// Responds with counts and record ids only, never names, phones or emails.
// Remove this route once the backfill is done.

type Row = Record<string, unknown> & { kind: LeadPayload["kind"]; id: string; created_at: string | Date };

async function rows(sql: string): Promise<Record<string, unknown>[]> {
  try {
    return (await query(sql)).rows;
  } catch (err) {
    if (/does not exist/.test(String((err as Error)?.message))) return [];
    throw err;
  }
}

export async function POST(req: Request) {
  const key = process.env.N8N_LEAD_SECRET;
  if (!key || req.headers.get("x-smartcity-key") !== key) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));
  const limit = Math.min(25, Math.max(1, Number(url.searchParams.get("limit") || 10)));

  const consent = await rows(
    "SELECT id, created_at, name, phone, rep, tcpa_consent FROM consent_submissions ORDER BY created_at"
  );
  const waitlist = await rows(
    "SELECT id, created_at, name, email, source, rep FROM waitlist_signups ORDER BY created_at"
  );
  const contact = await rows(
    "SELECT id, created_at, name, email, interest, message FROM contact_submissions ORDER BY created_at"
  );

  const all: Row[] = [
    ...consent.map((r) => ({ ...r, kind: "consent" as const }) as Row),
    ...waitlist.map((r) => ({ ...r, kind: "waitlist" as const }) as Row),
    ...contact.map((r) => ({ ...r, kind: "contact" as const }) as Row),
  ];

  const counts = { consent: consent.length, waitlist: waitlist.length, contact: contact.length, total: all.length };
  if (dry) return Response.json({ ok: true, dry: true, counts });

  const batch = all.slice(offset, offset + limit);
  const sent: string[] = [];
  const failed: string[] = [];
  for (const r of batch) {
    const lead = {
      ...r,
      created_at: new Date(r.created_at).toISOString(),
      backfill: true,
    } as LeadPayload;
    if (await forwardLead(lead)) sent.push(`${r.kind}:${r.id}`);
    else failed.push(`${r.kind}:${r.id}`);
  }

  const next = offset + batch.length < all.length ? offset + batch.length : null;
  return Response.json({ ok: true, counts, offset, sent: sent.length, failed, next });
}
