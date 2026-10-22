// Forwards a stored website submission to the n8n workflow "SmartCity: website
// lead", which creates or updates the contact in the SmartCity Ingmar GHL
// sub-account, adds a note, and (for contact + waitlist) a follow-up task.
//
// The database record is written FIRST and stays the source of truth (for
// consent it is the compliance artifact). Forwarding is best-effort: it never
// throws, never holds the visitor for more than a few seconds, and a failure is
// only logged. scripts/backfillLeadsToGhl.cjs re-sends anything that was missed.

export type LeadKind = "contact" | "waitlist" | "consent";

export type LeadPayload = {
  kind: LeadKind;
  id: string;
  created_at: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  interest?: string | null;
  message?: string | null;
  rep?: string | null;
  tcpa_consent?: boolean;
  backfill?: boolean;
};

const TIMEOUT_MS = 4000;

export async function forwardLead(lead: LeadPayload): Promise<boolean> {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  const key = process.env.N8N_LEAD_SECRET;
  if (!url || !key) {
    console.warn(
      `[leads] not forwarded (${lead.kind} ${lead.id}): N8N_LEAD_WEBHOOK_URL or N8N_LEAD_SECRET is not set`
    );
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-smartcity-key": key },
      body: JSON.stringify(lead),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[leads] forward failed (${lead.kind} ${lead.id}): HTTP ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      `[leads] forward failed (${lead.kind} ${lead.id}):`,
      err instanceof Error ? err.message : err
    );
    return false;
  } finally {
    clearTimeout(timer);
  }
}
