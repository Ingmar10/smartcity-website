import { notifyNewWaitlistLead } from "@/lib/notify";
import { saveWaitlist } from "@/lib/waitlistStore";
import { clientIpFrom } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allowed sources — keeps the `source` tag clean and prevents arbitrary values.
const SOURCES = new Set([
  "voice-waitlist",
  "payments-waitlist",
  "university-waitlist",
  "network-apply",
  "inventory-waitlist",
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
  const source = typeof data.source === "string" ? data.source : "";
  const rep =
    typeof data.rep === "string" && data.rep.trim().length > 0
      ? data.rep.trim().slice(0, 120)
      : null;

  if (!name) return json({ error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email))
    return json({ error: "Please enter a valid email address." }, 400);
  if (!SOURCES.has(source))
    return json({ error: "Invalid request." }, 400);

  // ---- Store first -----------------------------------------------------------
  // The try/catch closes around the WRITE ALONE, deliberately. Storing the lead
  // is the only operation allowed to fail this request; nothing after it is.
  let record;
  try {
    record = await saveWaitlist({
      name,
      email,
      source,
      rep,
      ip: clientIpFrom(req.headers),
      user_agent: req.headers.get("user-agent"),
    });
  } catch (err) {
    console.error("Waitlist store failure:", err);
    return json(
      {
        error:
          "We couldn't add you just now. Please try again, or email contact@smartctycontractors.com.",
      },
      500
    );
  }

  // ---- Then notify, best-effort ----------------------------------------------
  // The lead is durably stored by this point. `notifyNewWaitlistLead` resolves
  // to an outcome and never rejects, so a Resend outage cannot reach the catch
  // above, cannot undo the row, and cannot turn a captured lead into a 500 that
  // the visitor would see and retry. Its failure path is a loud server log.
  //
  // Awaited rather than fire-and-forget: a serverless instance can freeze the
  // moment the response is returned, which would silently drop an un-awaited
  // send. The response shape is unchanged either way, so the form's success
  // branch — and the Meta pixel Lead event that will hang off it — is untouched.
  await notifyNewWaitlistLead(record);

  return json({ ok: true, id: record.id });
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
