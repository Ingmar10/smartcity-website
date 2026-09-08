// backfillWaitlistNotify — one consolidated email containing every waitlist lead
// already sitting in the database.
//
// PURPOSE: notifications were wired onto POST /api/waitlist after leads had
// already been collected. Those existing rows would never trigger a
// notification, so without this they stay unread forever. This sends them once.
//
// SAFE BY DEFAULT: with no flags this is a DRY RUN — it reads, prints, and
// sends nothing. Actually delivering requires an explicit `--commit`.
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
// POSTGRES_URL lives in Vercel's Production environment, NOT Development, so a
// plain `vercel env pull` will not give you one. Pull production explicitly:
//
//   cd ~/Documents/smartcity-notify
//   vercel env pull .env.production.local --environment=production --yes
//   set -a && . ./.env.production.local && set +a
//   node scripts/backfillWaitlistNotify.cjs             # dry run, sends nothing
//   node scripts/backfillWaitlistNotify.cjs --commit    # actually sends

const { Pool } = require("pg");
const sgMail = require("@sendgrid/mail");

const COMMIT = process.argv.includes("--commit");

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
    "POSTGRES_URL is not set. It lives in Vercel's PRODUCTION environment:\n" +
      "  vercel env pull .env.production.local --environment=production --yes\n" +
      "  set -a && . ./.env.production.local && set +a"
  );
  process.exit(2);
}

const apiKey = process.env.SENDGRID_API_KEY;
const from = process.env.WAITLIST_FROM_EMAIL;
const to = process.env.WAITLIST_NOTIFY_TO;

if (COMMIT) {
  const missing = [
    !apiKey && "SENDGRID_API_KEY",
    !from && "WAITLIST_FROM_EMAIL",
    !to && "WAITLIST_NOTIFY_TO",
  ].filter(Boolean);
  if (missing.length) {
    console.error(
      `Cannot --commit: ${missing.join(", ")} not set.\n` +
        "Re-run without --commit to dry run."
    );
    process.exit(2);
  }
}

function sourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

function formatTimestamp(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  // Individual component options, NOT dateStyle/timeStyle: ECMA-402 forbids
  // combining those shorthands with `timeZoneName` and throws a TypeError.
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
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
  sgMail.setApiKey(apiKey);
  const [response] = await sgMail.send({ to, from, subject, text });
  const headers = (response && response.headers) || {};
  return {
    id: headers["x-message-id"] || "(no x-message-id header)",
    statusCode: (response && response.statusCode) || 0,
  };
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

    if (!COMMIT) {
      console.log("\n=== DRY RUN — nothing sent. Re-run with --commit to send. ===\n");
      console.log(`Subject: ${subject}`);
      console.log(`To:      ${to || "(WAITLIST_NOTIFY_TO not set)"}`);
      console.log(`From:    ${from || "(WAITLIST_FROM_EMAIL not set)"}`);
      console.log("");
      console.log(body);
      return;
    }

    const { id, statusCode } = await sendEmail(subject, body);
    console.log(`\nSENT. HTTP ${statusCode}. SendGrid message id: ${id}`);
  } catch (err) {
    let detail = err.message;
    if (err.response && err.response.body) {
      detail += ` — ${JSON.stringify(err.response.body)}`;
    }
    console.error("Backfill failed:", detail);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
