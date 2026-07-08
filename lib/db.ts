import { createClient } from "@vercel/postgres";

// Vercel provisioned Prisma Postgres, whose POSTGRES_URL is a DIRECT (non-pooled)
// connection string. The pooled `sql` helper from @vercel/postgres rejects that
// with `invalid_connection_string`, so we use createClient() (a single direct
// connection) instead — it accepts the direct string. Each operation opens a
// client, runs, and cleans up.

type DbClient = ReturnType<typeof createClient>;

// Run a unit of work against a fresh direct client, guaranteeing cleanup.
export async function withDb<T>(
  fn: (client: DbClient) => Promise<T>
): Promise<T> {
  const client = createClient(); // defaults to POSTGRES_URL (direct connection)
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

// Idempotent schema init. Creates both tables the app writes to, so a freshly
// provisioned database self-heals on the first API call. The `ensured` flag
// caches success for a warm serverless instance and resets on cold start.
// Takes the active client so it shares the caller's connection (one connection
// per operation, not two).
let ensured = false;

export async function ensureTables(client: DbClient): Promise<void> {
  if (ensured) return;

  await client.sql`
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

  await client.sql`
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
