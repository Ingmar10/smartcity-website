// Durable storage for DialBolt TCPA consent submissions.
//
// The consent record IS the compliance artifact — it must be captured from day
// one, before any email/Zapier/GHL forwarding is wired up. Storage strategy:
//
//   1. Postgres (via node-postgres / `pg`, see lib/db.ts) when POSTGRES_URL is
//      set — the production path. ensureTables() auto-creates the
//      `consent_submissions` table on first use.
//   2. Local `.data/consent.jsonl` append fallback — LOCAL DEVELOPMENT ONLY.
//
// The fallback is NOT available in a deployed environment. It used to be, and
// that was a silent-data-loss bug: a serverless filesystem is ephemeral and
// per-instance, so a deploy with no POSTGRES_URL would accept submissions,
// report success to the customer, and lose every consent record when the
// container recycled. This comment claimed we threw in that case; the code did
// not. It does now — see saveConsent.

import { promises as fs } from "fs";
import path from "path";
import { ensureTables, query } from "./db";

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

/**
 * Is this a deployed environment, where the local-file fallback is not durable?
 *
 * FAILS CLOSED. Anything that looks like a deploy counts as production unless it
 * explicitly identifies itself otherwise, because the cost of being wrong here
 * is a lost consent record and the cost of being wrong the other way is a local
 * developer seeing an error.
 */
function isDeployedEnvironment(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV !== "development";
  if (process.env.VERCEL) return true; // on Vercel with no VERCEL_ENV — assume deployed
  return process.env.NODE_ENV === "production";
}

/** Thrown when a consent record cannot be stored durably. Never swallowed. */
export class ConsentStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConsentStorageError";
  }
}

async function saveToPostgres(record: ConsentRecord): Promise<void> {
  // Idempotently ensure the schema exists (self-heals on cold start).
  await ensureTables();

  await query(
    `INSERT INTO consent_submissions
       (id, created_at, name, phone, rep, ip, user_agent, tcpa_consent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      record.id,
      record.created_at,
      record.name,
      record.phone,
      record.rep,
      record.ip,
      record.user_agent,
      record.tcpa_consent,
    ]
  );
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

  // NO DATABASE CONFIGURED.
  //
  // The header above has always said we throw rather than silently drop a
  // record. The code did not: it fell through to a local file, which on a
  // serverless deploy is an EPHEMERAL, PER-INSTANCE filesystem — so the write
  // "succeeded", the customer was told they were subscribed, and the consent
  // record disappeared with the container. A TCPA consent record is the artifact
  // you produce when someone asks why you texted them; one that evaporates is
  // worse than none, because the submission that created it is real and the
  // proof of permission is not.
  //
  // A hard failure is strictly better here. The customer sees "we couldn't
  // record your consent, please try again", which is true, and nobody gets
  // messaged on a permission we cannot evidence.
  if (isDeployedEnvironment()) {
    throw new ConsentStorageError(
      "No consent store is configured (POSTGRES_URL is unset) in a deployed environment. " +
        "Refusing the submission rather than writing to an ephemeral filesystem."
    );
  }

  // Local development only — a real filesystem that persists between requests.
  await saveToLocalFile(record);
  return record;
}
