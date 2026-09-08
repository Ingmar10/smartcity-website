// backfillWaitlistNotify — one consolidated email containing every waitlist lead
// already sitting in the database.
//
// PURPOSE: notifications were wired onto POST /api/waitlist after leads had
// already been collected. Those existing rows would never trigger a
// notification, so without this they stay unread forever. This sends them once.
//
// ONE-SHOT BY DESIGN. It deliberately re-implements the plain-text formatting
// from lib/notify.ts rather than importing it: this is a .cjs script run
// straight through node with no build step and no TS runtime dependency, and it
// is expected to run exactly once. Format drift against lib/notify.ts is
// therefore not a live concern — if you find yourself running this a second
// time, prefer re-sending through the app.
//
// READ-ONLY against Postgres. The SELECT is the only statement; nothing is
// written, updated or deleted here.
//
// Run it where both secrets are set:
//
//   cd ~/Documents/smartcity-website
//   vercel env pull .env.local
//   set -a && . ./.env.local && set +a
//   node scripts/backfillWaitlistNotify.cjs --dry-run   # print, send nothing
//   node scripts/backfillWaitlistNotify.cjs             # actually send

const { Pool } = require("pg");

const DRY_RUN = process.argv.includes("--dry-run");

const DEFAULT_FROM = "SmartCity Leads <onboarding@resend.dev>";
const DEFAULT_TO = "smartcitycontractors@gmail.com";

const SOURCE_LABELS = {
  "voice-waitlist": "Voice waitlist",
  "payments-waitlist": "Payments waitlist",
  "university-waitlist": "University waitlist",
  "network-apply": "Network application",
  "inventory-waitlist": "Inventory waitlist",
};

const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) {
  console.error(
    "POSTGRES_URL is not set. Run this where the production connection string is\n" +
      "available (e.g. after `vercel env pull .env.local`), or export it for this\n" +
      "one command."
  );
  process.exit(2);
}

const resendKey = process.env.RESEND_API_KEY;
if (!resendKey && !DRY_RUN) {
  console.error(
    "RESEND_API_KEY is not set. Set it, or re-run with --dry-run to print the\n" +
      "email body without sending."
  );
  process.exit(2);
}

function sourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

function formatTimestamp(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "medium",
    timeZoneName: "short",
  }).format(d);
  return `${local}  (${d.toISOString()})`;
}

function formatLead(lead) {
  const rep = lead.rep ? `?rep=${lead.rep}` : "(none — direct / organic)";
  return [
    `  Name        ${lead.name}`,
    `  Email       ${lead.email}`,
    ``,
    `  REP         ${rep}`,
    `  Source      ${sourceLabel(lead.source)}  [${lead.source}]`,
    `  Received    ${formatTimestamp(lead.created_at)}`,
    ``,
    `  id          ${lead.id}`,
    `  ip          ${lead.ip || "—"}`,
    `  user agent  ${lead.user_agent || "—"}`,
  ].join("\n");
}

function buildBody(leads) {
  const rule = "─".repeat(60);
  const attributed = leads.filter((l) => l.rep).length;
  const blocks = leads.map(
    (lead, i) =>
      `${rule}\nLEAD ${i + 1} of ${leads.length}\n${rule}\n${formatLead(lead)}`
  );
  return [
    `${leads.length} PENDING WAITLIST LEADS`,
    ``,
    `These were already in the database before notifications were wired up.`,
    `${attributed} of ${leads.length} carry a ?rep= attribution.`,
    ``,
    ...blocks,
    ``,
    rule,
    `Sent by scripts/backfillWaitlistNotify.cjs`,
  ].join("\n");
}

async function sendEmail(subject, text) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.WAITLIST_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.WAITLIST_NOTIFY_TO || DEFAULT_TO],
      subject,
      text,
    }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = (payload && (payload.message || payload.name)) || `HTTP ${res.status}`;
    throw new Error(`Resend rejected the send: ${detail}`);
  }
  if (!payload || !payload.id) {
    throw new Error("Resend accepted the send but returned no id");
  }
  return payload.id;
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});

(async () => {
  try {
    const { rows } = await pool.query(
      `SELECT id, created_at, name, email, source, rep, ip, user_agent
         FROM waitlist_signups
        ORDER BY created_at ASC`
    );

    console.log(`Found ${rows.length} row(s) in waitlist_signups.`);
    if (rows.length === 0) {
      console.log("Nothing to send.");
      return;
    }

    const subject = `[SmartCity] ${rows.length} pending waitlist leads — backlog export`;
    const body = buildBody(rows);

    if (DRY_RUN) {
      console.log("\n--- DRY RUN, nothing sent ---");
      console.log(`Subject: ${subject}`);
      console.log(`To:      ${process.env.WAITLIST_NOTIFY_TO || DEFAULT_TO}`);
      console.log(`From:    ${process.env.WAITLIST_FROM_EMAIL || DEFAULT_FROM}`);
      console.log("");
      console.log(body);
      return;
    }

    const id = await sendEmail(subject, body);
    console.log(`\nSENT. Resend message id: ${id}`);
  } catch (err) {
    console.error("Backfill failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
