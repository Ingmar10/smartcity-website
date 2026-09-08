// Lead notification over SendGrid.
//
// CONTRACT, and the reason this file never throws: the caller has ALREADY
// durably stored the lead by the time it gets here. A notification failure must
// therefore never propagate — losing the email is an annoyance, losing the row
// is a lost customer. Every export below resolves to a SendOutcome and swallows
// its own errors, so `await notifyNewWaitlistLead(...)` cannot roll back or
// fail the surrounding request.
//
// Sender and recipient both come from the environment. There is no hardcoded
// fallback on purpose: SendGrid will only accept a FROM that has been verified
// (Single Sender or domain auth), so a baked-in default would be a guess that
// fails at send time with a confusing 403 rather than a clear config error.

import sgMail from "@sendgrid/mail";

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
  | { ok: true; id: string; statusCode: number }
  | { ok: false; reason: string };

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

// Wesley Chapel, FL — show the local wall-clock time the lead actually arrived,
// with the ISO instant kept alongside so the record stays unambiguous.
function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  // Individual component options, NOT dateStyle/timeStyle: ECMA-402 forbids
  // combining those shorthands with `timeZoneName` and throws a TypeError if
  // you try. Spelling the components out is what makes the zone label legal.
  const local = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(d);
  return `${local}  (${d.toISOString()})`;
}

/**
 * One lead as a plain-text block. `rep` is placed above the fold and rendered
 * in the `?rep=` form it arrives as, because campaign attribution is the point
 * of the notification — an unattributed lead reads as "direct / organic"
 * rather than as a blank line you have to interpret.
 */
export function formatLead(lead: WaitlistLead): string {
  const rep = lead.rep ? `?rep=${lead.rep}` : "(none — direct / organic)";

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
 * Send one email through SendGrid. Resolves to an outcome; never rejects.
 *
 * SendGrid answers a successful send with 202 Accepted and puts the message id
 * in the `x-message-id` response header — that id is what you search on in the
 * SendGrid Activity Feed, so it is captured and logged rather than discarded.
 */
export async function sendEmail(
  subject: string,
  text: string
): Promise<SendOutcome> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL;
  const to = process.env.WAITLIST_NOTIFY_TO;

  if (!apiKey) return { ok: false, reason: "SENDGRID_API_KEY is not set" };
  if (!from) return { ok: false, reason: "WAITLIST_FROM_EMAIL is not set" };
  if (!to) return { ok: false, reason: "WAITLIST_NOTIFY_TO is not set" };

  try {
    sgMail.setApiKey(apiKey);
    const [response] = await sgMail.send({ to, from, subject, text });

    const headers = (response?.headers ?? {}) as Record<string, string>;
    const messageId = headers["x-message-id"] ?? "(no x-message-id header)";
    const statusCode = response?.statusCode ?? 0;

    if (statusCode < 200 || statusCode >= 300) {
      return { ok: false, reason: `SendGrid returned HTTP ${statusCode}` };
    }
    return { ok: true, id: messageId, statusCode };
  } catch (err) {
    // SendGrid errors carry the useful detail in response.body.errors, not in
    // the top-level message — surface it or the log just says "Bad Request".
    let reason = err instanceof Error ? err.message : String(err);
    const body = (err as { response?: { body?: unknown } })?.response?.body;
    if (body) reason += ` — ${JSON.stringify(body)}`;
    return { ok: false, reason };
  }
}

/**
 * Notify on a single new signup. Logs the outcome on both paths so a silent
 * failure is impossible to mistake for a delivered lead in the Vercel logs.
 */
export async function notifyNewWaitlistLead(
  lead: WaitlistLead
): Promise<SendOutcome> {
  // The try wraps BODY CONSTRUCTION as well as the send. An earlier version
  // only guarded the send, and a formatting bug (an illegal Intl option) threw
  // straight past it and 500'd a request whose lead was already stored — the
  // precise failure this module exists to prevent. Nothing between here and the
  // return is allowed to escape.
  let outcome: SendOutcome;
  try {
    const body = [
      `NEW LEAD — ${sourceLabel(lead.source)}`,
      ``,
      formatLead(lead),
      ``,
      `—`,
      `Sent by the smartcity-website waitlist endpoint.`,
    ].join("\n");

    outcome = await sendEmail(newLeadSubject(lead), body);
  } catch (err) {
    outcome = {
      ok: false,
      reason: `could not build the notification: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (outcome.ok) {
    console.log(
      `[notify] waitlist lead ${lead.id} emailed — sendgrid_id=${outcome.id} ` +
        `status=${outcome.statusCode} source=${lead.source} rep=${lead.rep ?? "none"}`
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

  // Same guarantee as notifyNewWaitlistLead: body construction is inside the try.
  let outcome: SendOutcome;
  try {
    const rule = "─".repeat(60);
    const blocks = leads.map(
      (lead, i) =>
        `${rule}\nLEAD ${i + 1} of ${leads.length}\n${rule}\n${formatLead(lead)}`
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
      rule,
      `Sent by scripts/backfillWaitlistNotify.cjs`,
    ].join("\n");

    outcome = await sendEmail(
      `[SmartCity] ${leads.length} pending waitlist leads — backlog export`,
      body
    );
  } catch (err) {
    outcome = {
      ok: false,
      reason: `could not build the backlog notification: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (outcome.ok) {
    console.log(
      `[notify] backlog of ${leads.length} emailed — sendgrid_id=${outcome.id} status=${outcome.statusCode}`
    );
  } else {
    console.error(`[notify] BACKLOG EMAIL FAILED — ${outcome.reason}`);
  }
  return outcome;
}
