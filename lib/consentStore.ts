// Durable storage for DialBolt TCPA consent submissions.
//
// The consent record IS the compliance artifact — it must be captured from day
// one, before any email/Zapier/GHL forwarding is wired up. Storage strategy:
//
//   1. Vercel Postgres (`@vercel/postgres`) when POSTGRES_URL is set — the
//      production path. Auto-creates the `consent_records` table on first use.
//   2. Local `.data/consent.jsonl` append fallback for local development, so
//      nothing is lost while testing without a database.
//
// If BOTH are unavailable (e.g. a misconfigured production deploy with no DB
// and a read-only filesystem), we THROW rather than silently drop the record —
// the API route surfaces the failure to the user instead of faking success.

import { promises as fs } from "fs";
import path from "path";
import { ensureTables, withDb } from "./db";

export type ConsentRecord = {
  id: string;
  created_at: string; // ISO-8601
  name: string;
  phone: string;
  rep: string | null;
  ip: string | null;
  user_agent: string | null;
  tcpa_consent: boolean;
};

const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "consent.jsonl");

function usePostgres(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

async function saveToPostgres(record: ConsentRecord): Promise<void> {
  await withDb(async (client) => {
    // Idempotently ensure the schema exists (self-heals on cold start).
    await ensureTables(client);

    await client.sql`
      INSERT INTO consent_submissions
        (id, created_at, name, phone, rep, ip, user_agent, tcpa_consent)
      VALUES (
        ${record.id}, ${record.created_at}, ${record.name}, ${record.phone},
        ${record.rep}, ${record.ip}, ${record.user_agent}, ${record.tcpa_consent}
      );
    `;
  });
}

async function saveToLocalFile(record: ConsentRecord): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.appendFile(LOCAL_FILE, JSON.stringify(record) + "\n", "utf8");
}

/**
 * Persist a consent record. Returns the stored record on success; throws if the
 * record could not be durably stored anywhere.
 */
export async function saveConsent(
  input: Omit<ConsentRecord, "id" | "created_at">
): Promise<ConsentRecord> {
  const record: ConsentRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...input,
  };

  if (usePostgres()) {
    await saveToPostgres(record);
    return record;
  }

  // No database configured — fall back to the local append-only log.
  await saveToLocalFile(record);
  return record;
}
