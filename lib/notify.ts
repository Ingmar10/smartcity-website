// Lead notification over Resend.
//
// Sends plain-text mail through the Resend REST API with `fetch` rather than
// the `resend` SDK: one HTTP POST, no new dependency, no lockfile churn, and
// the message id comes straight back in the JSON response.
//
// CONTRACT, and the reason this file never throws: the caller has ALREADY
// durably stored the lead by the time it gets here. A notification failure must
// therefore never propagate — losing the email is an annoyance, losing the row
// is a lost customer. Every export below resolves to a SendOutcome and swallows
// its own errors, so `await notifyNewWaitlistLead(...)` cannot roll back or
// fail the surrounding request.

export type WaitlistLead = {
  id: string;
  created_at: string; // ISO-8601
  name: string;
  email: string;
  source: string;
  rep: string | null;
  ip: string | null;
  user_agent: string | null;
};

export type SendOutcome =
  | { ok: true; id: string }
  | { ok: false; reason: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8_000;

// Resend's shared sender works without domain verification — the documented
// fallback until notifications@smartcity.contractors is verified. Override with
// WAITLIST_FROM_EMAIL to swap it without a deploy.
const DEFAULT_FROM = "SmartCity Leads <onboarding@resend.dev>";
const DEFAULT_TO = "smartcitycontractors@gmail.com";

const SOURCE_LABELS: Record<string, string> = {
  "voice-waitlist": "Voice waitlist",
  "payments-waitlist": "Payments waitlist",
  "university-waitlist": "University waitlist",
  "network-apply": "Network application",
  "inventory-waitlist": "Inventory waitlist",
};

export function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

function fromAddress(): string {
  return process.env.WAITLIST_FROM_EMAIL || DEFAULT_FROM;
}

function toAddress(): string {
  return process.env.WAITLIST_NOTIFY_TO || DEFAULT_TO;
}

// Wesley Chapel, FL — show the local wall-clock time the lead actually arrived,
// with the ISO instant kept alongside so the record stays unambiguous.
function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "medium",
    timeZoneName: "short",
  }).format(d);
  return `${local}  (${d.toISOString()})`;
}

/**
 * One lead as a plain-text block. `rep` is placed above the fold and called out
 * in the `?rep=` form it arrives as, because campaign attribution is the point
 * of the notification — an unattributed lead reads as "direct / organic"
 * rather than as a blank line you have to interpret.
 */
export function formatLead(lead: WaitlistLead): string {
  const rep = lead.rep
    ? `?rep=${lead.rep}`
    : "(none — direct / organic)";

  return [
    `  Name        ${lead.name}`,
    `  Email       ${lead.email}`,
    ``,
    `  REP         ${rep}`,
    `  Source      ${sourceLabel(lead.source)}  [${lead.source}]`,
    `  Received    ${formatTimestamp(lead.created_at)}`,
    ``,
    `  id          ${lead.id}`,
    `  ip          ${lead.ip ?? "—"}`,
    `  user agent  ${lead.user_agent ?? "—"}`,
  ].join("\n");
}

export function newLeadSubject(lead: WaitlistLead): string {
  return `[SmartCity] New lead from ${sourceLabel(lead.source)} — ${lead.name}`;
}

/**
 * POST one email to Resend. Resolves to an outcome; never rejects.
 */
export async function sendEmail(
  subject: string,
  text: string
): Promise<SendOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "RESEND_API_KEY is not set" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [toAddress()],
        subject,
        text,
      }),
      signal: controller.signal,
    });

    const payload = (await res.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;

    if (!res.ok) {
      const detail = payload?.message || payload?.name || `HTTP ${res.status}`;
      return { ok: false, reason: `Resend rejected the send: ${detail}` };
    }
    if (!payload?.id) {
      return { ok: false, reason: "Resend accepted the send but returned no id" };
    }
    return { ok: true, id: payload.id };
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? `timed out after ${SEND_TIMEOUT_MS}ms`
        : err instanceof Error
          ? err.message
          : String(err);
    return { ok: false, reason };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Notify on a single new signup. Logs the outcome on both paths so a silent
 * failure is impossible to mistake for a delivered lead in the Vercel logs.
 */
export async function notifyNewWaitlistLead(
  lead: WaitlistLead
): Promise<SendOutcome> {
  const body = [
    `NEW LEAD — ${sourceLabel(lead.source)}`,
    ``,
    formatLead(lead),
    ``,
    `—`,
    `Sent by the smartcity-website waitlist endpoint.`,
  ].join("\n");

  const outcome = await sendEmail(newLeadSubject(lead), body);

  if (outcome.ok) {
    console.log(
      `[notify] waitlist lead ${lead.id} emailed — resend_id=${outcome.id} source=${lead.source} rep=${lead.rep ?? "none"}`
    );
  } else {
    // Deliberately loud and distinct from a store failure: the lead IS saved.
    console.error(
      `[notify] WAITLIST EMAIL FAILED for lead ${lead.id} — ${outcome.reason}. ` +
        `The row is stored; this lead needs to be read out of the database manually.`
    );
  }
  return outcome;
}

/**
 * One consolidated email for a batch of already-stored leads (the backlog
 * export). Ordered oldest first so the list reads as a work queue.
 */
export async function notifyWaitlistBacklog(
  leads: WaitlistLead[]
): Promise<SendOutcome> {
  if (leads.length === 0) {
    return { ok: false, reason: "no leads to send" };
  }

  const blocks = leads.map(
    (lead, i) =>
      `${"─".repeat(60)}\nLEAD ${i + 1} of ${leads.length}\n${"─".repeat(60)}\n${formatLead(lead)}`
  );

  const attributed = leads.filter((l) => l.rep).length;

  const body = [
    `${leads.length} PENDING WAITLIST LEADS`,
    ``,
    `These were already in the database before notifications were wired up.`,
    `${attributed} of ${leads.length} carry a ?rep= attribution.`,
    ``,
    ...blocks,
    ``,
    `${"─".repeat(60)}`,
    `Sent by scripts/backfillWaitlistNotify.cjs`,
  ].join("\n");

  const outcome = await sendEmail(
    `[SmartCity] ${leads.length} pending waitlist leads — backlog export`,
    body
  );

  if (outcome.ok) {
    console.log(`[notify] backlog of ${leads.length} emailed — resend_id=${outcome.id}`);
  } else {
    console.error(`[notify] BACKLOG EMAIL FAILED — ${outcome.reason}`);
  }
  return outcome;
}
