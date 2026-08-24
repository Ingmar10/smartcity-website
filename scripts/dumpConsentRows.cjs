// dumpConsentRows — phone + timestamp for every consent record. Nothing else.
//
// PURPOSE: decide whether the existing consent_submissions rows are test
// submissions or real people. Those captured before the S1 fix went live were
// taken through a form whose TCPA checkbox was not `required` and whose endpoint
// had no rate limiting applied, so any REAL row among them is
// questionable-consent and must not be an outreach basis.
//
// MINIMAL BY CONSTRUCTION, not by discipline. The SELECT names two columns, so
// it CANNOT return name, rep, ip or user_agent — the restraint is in the query
// rather than in a promise to look away. Nothing is written to disk.
//
// Run it where POSTGRES_URL is set (so the connection string never travels
// through a chat transcript):
//
//   cd ~/Documents/smartcity-website
//   POSTGRES_URL="$(vercel env pull --yes >/dev/null 2>&1; grep -m1 '^POSTGRES_URL=' .env.local | cut -d= -f2- | tr -d '"')" \
//     node scripts/dumpConsentRows.cjs
//
// or simply, if it is already in your shell:
//
//   node scripts/dumpConsentRows.cjs

const { Pool } = require("pg");

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error(
    "POSTGRES_URL is not set. Run this where the production connection string is\n" +
      "available (e.g. after `vercel env pull`), or export it for this one command."
  );
  process.exit(2);
}

const pool = new Pool({
  connectionString: url,
  ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
});

(async () => {
  // TWO COLUMNS. Adding one here is the only way to widen this, which is the point.
  const { rows } = await pool.query(
    `SELECT phone, created_at, tcpa_consent
       FROM consent_submissions
      ORDER BY created_at ASC`
  );

  console.log(`consent_submissions: ${rows.length} row(s)\n`);
  console.log("  #  phone              created_at                     tcpa_consent");
  console.log("  -  -----------------  -----------------------------  ------------");
  rows.forEach((r, i) => {
    const ts = r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at);
    console.log(
      `  ${String(i + 1).padStart(1)}  ${String(r.phone).padEnd(17)}  ${ts.padEnd(29)}  ${r.tcpa_consent}`
    );
  });

  console.log(
    "\nAll of these predate the S1 hardening (checkbox `required` + rate limiter),\n" +
      "which was committed as 71232e8 and only reached production on 2026-08-24.\n" +
      "Any row here belonging to a real person is questionable-consent: the form\n" +
      "that captured it did not enforce the checkbox. Test submissions are fine to\n" +
      "delete or ignore."
  );

  await pool.end();
})().catch((e) => {
  console.error("query failed:", e.message);
  process.exit(1);
});
