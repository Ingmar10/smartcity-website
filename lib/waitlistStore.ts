// Durable storage for waitlist / apply signups across the ecosystem pages
// (Voice, Capital, University, Network). Same strategy as the DialBolt consent
// store: Vercel Postgres when POSTGRES_URL is set, local JSONL fallback for dev,
// and a throw (not a silent success) if a record can't be stored anywhere.

import { promises as fs } from "fs";
import path from "path";
import { ensureTables, withDb } from "./db";

export type WaitlistRecord = {
  id: string;
  created_at: string; // ISO-8601
  name: string;
  email: string;
  source: string; // e.g. "voice-waitlist", "capital-waitlist"
  rep: string | null;
  ip: string | null;
  user_agent: string | null;
};

const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "waitlist.jsonl");

function usePostgres(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

async function saveToPostgres(record: WaitlistRecord): Promise<void> {
  await withDb(async (client) => {
    // Idempotently ensure the schema exists (self-heals on cold start).
    await ensureTables(client);

    await client.sql`
      INSERT INTO waitlist_signups
        (id, created_at, name, email, source, rep, ip, user_agent)
      VALUES (
        ${record.id}, ${record.created_at}, ${record.name}, ${record.email},
        ${record.source}, ${record.rep}, ${record.ip}, ${record.user_agent}
      );
    `;
  });
}

async function saveToLocalFile(record: WaitlistRecord): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.appendFile(LOCAL_FILE, JSON.stringify(record) + "\n", "utf8");
}

export async function saveWaitlist(
  input: Omit<WaitlistRecord, "id" | "created_at">
): Promise<WaitlistRecord> {
  const record: WaitlistRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...input,
  };
  if (usePostgres()) {
    await saveToPostgres(record);
    return record;
  }
  await saveToLocalFile(record);
  return record;
}
