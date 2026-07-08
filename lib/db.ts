import { Pool, type QueryResult, type QueryResultRow } from "pg";

// Database layer on node-postgres (pg). We connect with the plain direct
// connection string in POSTGRES_URL — standard Postgres wire protocol, so it
// works with Prisma Postgres (and any other provider) without the Vercel-
// specific pooled/non-pooled env-var quirks of @vercel/postgres.

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.POSTGRES_URL || process.env.POSTGRES_DATABASE_URL;
    pool = new Pool({
      connectionString,
      // Managed Postgres requires TLS; we don't pin the provider's cert chain.
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    // Prevent an idle-client error from crashing the process (serverless freeze
    // can drop connections); the pool evicts the bad client and reconnects.
    pool.on("error", (err) => {
      console.error("pg pool error:", err.message);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params as never[]);
}

// Idempotent schema init. Creates both tables the app writes to, so a freshly
// provisioned database self-heals on the first API call. The `ensured` flag
// caches success for a warm serverless instance and resets on cold start.
let ensured = false;

export async function ensureTables(): Promise<void> {
  if (ensured) return;

  await query(`
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
  `);

  await query(`
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
  `);

  // Only cache success after both statements complete, so a failure retries on
  // the next call rather than being silently skipped.
  ensured = true;
}
