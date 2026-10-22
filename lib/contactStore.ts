// Durable storage for the /contact form. Same strategy as the consent store:
// Postgres when POSTGRES_URL is set; a local JSONL file for local development
// only; and a throw in a deployed environment with no database, so a visitor is
// never told "sent" for a message that was not kept.

import { promises as fs } from "fs";
import path from "path";
import { ensureTables, query } from "./db";

export type ContactRecord = {
  id: string;
  created_at: string; // ISO-8601
  name: string;
  email: string;
  interest: string;
  message: string;
  ip: string | null;
  user_agent: string | null;
};

const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_FILE = path.join(LOCAL_DIR, "contact.jsonl");

function isDeployedEnvironment(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV !== "development";
  if (process.env.VERCEL) return true;
  return process.env.NODE_ENV === "production";
}

export async function saveContact(
  input: Omit<ContactRecord, "id" | "created_at">
): Promise<ContactRecord> {
  const record: ContactRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...input,
  };

  if (process.env.POSTGRES_URL) {
    await ensureTables();
    await query(
      `INSERT INTO contact_submissions
         (id, created_at, name, email, interest, message, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        record.id,
        record.created_at,
        record.name,
        record.email,
        record.interest,
        record.message,
        record.ip,
        record.user_agent,
      ]
    );
    return record;
  }

  if (isDeployedEnvironment()) {
    throw new Error(
      "POSTGRES_URL is not set: contact messages cannot be stored durably in a deployed environment."
    );
  }

  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.appendFile(LOCAL_FILE, JSON.stringify(record) + "\n", "utf8");
  return record;
}
