import { COMPANY } from "@/lib/brand";
import { saveContact } from "@/lib/contactStore";
import { forwardLead } from "@/lib/leadForward";
import {
  checkRateLimit,
  clientIpFrom,
  pruneRateLimitStore,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Must match the options in components/ContactForm.tsx.
const INTERESTS = new Set([
  "QuoteSmart demo",
  "DialBolt reactivation",
  "Both",
  "Something else",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim().slice(0, 120) : "";
  const email =
    typeof data.email === "string" ? data.email.trim().slice(0, 200) : "";
  const interestRaw = typeof data.interest === "string" ? data.interest : "";
  const interest = INTERESTS.has(interestRaw) ? interestRaw : "Something else";
  const message =
    typeof data.message === "string" ? data.message.trim().slice(0, 4000) : "";

  if (!name) return json({ error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email))
    return json({ error: "Please enter a valid email address." }, 400);
  if (!message) return json({ error: "Please add a short message." }, 400);

  const ip = clientIpFrom(req.headers);

  // Speed bump against scripted spam (in-instance memory, see lib/rateLimit.ts).
  pruneRateLimitStore();
  const limit = checkRateLimit(`contact:ip:${ip}`, 5);
  if (!limit.ok) {
    return json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  let recordId: string;
  let createdAt: string;
  try {
    const record = await saveContact({
      name,
      email,
      interest,
      message,
      ip,
      user_agent: req.headers.get("user-agent"),
    });
    recordId = record.id;
    createdAt = record.created_at;
  } catch (err) {
    console.error("Contact store failure:", err);
    return json(
      {
        error: `We couldn't send your message just now. Please try again, or email ${COMPANY.generalEmail}.`,
      },
      500
    );
  }

  // Best-effort: the message is already stored, so a CRM hiccup never fails the visitor.
  await forwardLead({
    kind: "contact",
    id: recordId,
    created_at: createdAt,
    name,
    email,
    interest,
    message,
  });

  return json({ ok: true });
}

function json(payload: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
