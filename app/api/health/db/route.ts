import { ensureTables } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public (but no-index) DB health check. Confirms the Postgres schema is set up
// without having to submit a real record: it runs the idempotent ensureTables()
// self-heal, then reports connection status, per-table existence, and row counts.

const EXPECTED = ["consent_submissions", "waitlist_signups"] as const;

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex", // public but keep it out of search indexes
};

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: HEADERS,
  });
}

export async function GET() {
  const checkedAt = new Date().toISOString();

  // Not configured → we're on the local .data/*.jsonl fallback.
  if (!process.env.POSTGRES_URL) {
    return json(
      {
        ok: false,
        postgres: { configured: false, connected: false },
        expected: EXPECTED,
        tables: Object.fromEntries(
          EXPECTED.map((t) => [t, { exists: false, rows: null }])
        ),
        note: "POSTGRES_URL is not set — using the local .data/*.jsonl fallback in this environment.",
        checkedAt,
      },
      503
    );
  }

  try {
    const { sql } = await import("@vercel/postgres");

    // Self-heal: create the tables if they don't exist yet (idempotent).
    await ensureTables();

    const tableStatus = async (name: string) => {
      const reg = await sql`SELECT to_regclass(${`public.${name}`}) AS t`;
      const exists = reg.rows[0]?.t != null;
      let rows: number | null = null;
      if (exists) {
        // name is from the fixed EXPECTED allowlist — safe to interpolate
        const res = await sql.query(`SELECT count(*)::int AS n FROM ${name}`);
        rows = (res.rows[0]?.n as number) ?? 0;
      }
      return { exists, rows };
    };

    const tables: Record<string, { exists: boolean; rows: number | null }> = {};
    for (const t of EXPECTED) tables[t] = await tableStatus(t);

    const ok = EXPECTED.every((t) => tables[t].exists);
    return json(
      {
        ok,
        postgres: { configured: true, connected: true },
        expected: EXPECTED,
        tables,
        checkedAt,
      },
      ok ? 200 : 503
    );
  } catch (err) {
    return json(
      {
        ok: false,
        postgres: {
          configured: true,
          connected: false,
          error: err instanceof Error ? err.message : String(err),
        },
        expected: EXPECTED,
        tables: Object.fromEntries(
          EXPECTED.map((t) => [t, { exists: false, rows: null }])
        ),
        checkedAt,
      },
      503
    );
  }
}
