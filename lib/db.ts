// Idempotent schema init for the Postgres-backed stores.
//
// Runs CREATE TABLE IF NOT EXISTS for every table the app writes to, so a
// freshly-provisioned database self-heals on the first API call — no manual
// migration, prisma migrate, or separate SQL run required. Both tables are
// created together, so any endpoint (consent OR waitlist) provisions the full
// schema.
//
// The `ensured` flag caches success for the life of a warm serverless instance
// (so we don't re-run DDL on every request); it resets on cold start, which is
// exactly when re-checking the schema is worthwhile.

let ensured = false;

export async function ensureTables(): Promise<void> {
  if (ensured) return;

  const { sql } = await import("@vercel/postgres");

  await sql`
    CREATE TABLE IF NOT EXISTS consent_submissions (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      rep TEXT,
      ip TEXT,
      user_agent TEXT,
      tcpa_consent BOOLEAN NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_signups (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      source TEXT NOT NULL,
      rep TEXT,
      ip TEXT,
      user_agent TEXT
    );
  `;

  // Only cache success after both statements complete, so a failure retries on
  // the next call rather than being silently skipped.
  ensured = true;
}
