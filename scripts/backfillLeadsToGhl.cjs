// One-time backfill: sends every stored consent, waitlist and contact record to
// the n8n workflow "SmartCity: website lead" (tagged "backfill"), so leads that
// came in before the GHL hookup land in the SmartCity Ingmar sub-account too.
//
// Safe to re-run: GHL upserts by email/phone, so a repeat updates the same
// contact (it does add another note and task).
//
// Run from the repo root with production values in a temp env file:
//   vercel env pull .env.backfill --environment=production --yes
//   node --env-file=.env.backfill scripts/backfillLeadsToGhl.cjs --dry-run   # counts only
//   node --env-file=.env.backfill scripts/backfillLeadsToGhl.cjs             # send
//   rm .env.backfill
//
// Prints counts and record ids only, never names, phones or emails.
//
// NOTE (Oct 2026): POSTGRES_URL is a sensitive Vercel variable, so `vercel env pull`
// returns a placeholder. Use the server route instead:
//   POST https://smartcity.contractors/api/admin/backfill-leads?dry=1   (header x-smartcity-key)

const { Pool } = require("pg");

const dryRun = process.argv.includes("--dry-run");
const dbUrl = process.env.POSTGRES_URL || process.env.POSTGRES_DATABASE_URL;
const hook = process.env.N8N_LEAD_WEBHOOK_URL;
const key = process.env.N8N_LEAD_SECRET;

if (!dbUrl) {
  console.error("POSTGRES_URL is not set. See the usage notes at the top of this file.");
  process.exit(1);
}
if (!dryRun && (!hook || !key)) {
  console.error("N8N_LEAD_WEBHOOK_URL and N8N_LEAD_SECRET must be set to send.");
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false }, max: 2 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function rows(sql) {
  try {
    return (await pool.query(sql)).rows;
  } catch (err) {
    if (/does not exist/.test(String(err && err.message))) return [];
    throw err;
  }
}

async function send(lead) {
  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-smartcity-key": key },
    body: JSON.stringify({ ...lead, backfill: true }),
  });
  return res.ok;
}

(async () => {
  const consent = await rows(
    "SELECT id, created_at, name, phone, rep, tcpa_consent FROM consent_submissions ORDER BY created_at"
  );
  const waitlist = await rows(
    "SELECT id, created_at, name, email, source, rep FROM waitlist_signups ORDER BY created_at"
  );
  const contact = await rows(
    "SELECT id, created_at, name, email, interest, message FROM contact_submissions ORDER BY created_at"
  );

  console.log(`consent: ${consent.length}  waitlist: ${waitlist.length}  contact: ${contact.length}`);
  if (dryRun) {
    await pool.end();
    return;
  }

  const all = [
    ...consent.map((r) => ({ kind: "consent", ...r })),
    ...waitlist.map((r) => ({ kind: "waitlist", ...r })),
    ...contact.map((r) => ({ kind: "contact", ...r })),
  ];
  let ok = 0;
  const failed = [];
  for (const r of all) {
    const lead = { ...r, created_at: new Date(r.created_at).toISOString() };
    try {
      if (await send(lead)) ok += 1;
      else failed.push(`${r.kind}:${r.id}`);
    } catch {
      failed.push(`${r.kind}:${r.id}`);
    }
    await sleep(400);
  }
  console.log(`sent: ${ok}/${all.length}`);
  if (failed.length) console.log(`failed: ${failed.join(", ")}`);
  await pool.end();
})().catch(async (err) => {
  console.error("backfill failed:", err && err.message ? err.message : err);
  await pool.end().catch(() => {});
  process.exit(1);
});
