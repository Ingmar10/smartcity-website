import { COMPANY } from "@/lib/brand";
import { saveConsent } from "@/lib/consentStore";
import {
  checkRateLimit,
  clientIpFrom,
  pruneRateLimitStore,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic server-side validation. The consent record is a compliance artifact, so
// we store exactly what the user submitted (after light normalization) and the
// request metadata (ip, user-agent) needed to evidence the opt-in.

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "").slice(0, 20);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim().slice(0, 120) : "";
  const phoneRaw = typeof data.phone === "string" ? data.phone.trim() : "";
  const phone = normalizePhone(phoneRaw);
  const rep =
    typeof data.rep === "string" && data.rep.trim().length > 0
      ? data.rep.trim().slice(0, 120)
      : null;
  const tcpaConsent = data.tcpaConsent === true;

  if (!name) return json({ error: "Please enter your name." }, 400);
  if (phone.replace(/\D/g, "").length < 10)
    return json({ error: "Please enter a valid mobile number." }, 400);
  if (!tcpaConsent)
    return json(
      { error: "You must agree to receive text messages to continue." },
      400
    );

  const ip = clientIpFrom(req.headers);
  const userAgent = req.headers.get("user-agent");

  // ---- Rate limit -----------------------------------------------------------
  // `checkRateLimit` already existed in lib/rateLimit.ts and this route imported
  // only `clientIpFrom` from it — the limiter was written and never called on a
  // public, unauthenticated write. A guard with no reader.
  //
  // TWO dimensions, because they stop different things:
  //   per-IP    — one script generating consent records in bulk.
  //   per-PHONE — the more damaging shape. A forged GRANT against a real
  //               person's number is far worse than a forged block: it produces
  //               a record that looks impeccable and authorises texting someone
  //               who never agreed. Limiting per number bounds how fast that
  //               can be manufactured against one victim.
  //
  // Both are checked AFTER validation, so a malformed request cannot consume a
  // legitimate person's quota, and BEFORE the write, so a blocked request
  // stores nothing.
  //
  // LIMITATION, stated rather than implied: this counter is in-instance memory
  // (see lib/rateLimit.ts), so it blunts a single client hammering one warm
  // instance and does not enforce globally. It is a speed bump, not an
  // authorisation boundary. The real control is phone VERIFICATION, which lands
  // when this flow moves to the QuoteSmart Wave 13 endpoint and its Twilio
  // Verify OTP — until then, nothing here proves the submitter controls the
  // number they typed.
  pruneRateLimitStore();
  const ipLimit = checkRateLimit(`consent:ip:${ip}`, 10);
  const phoneLimit = checkRateLimit(`consent:phone:${phone}`, 3);
  if (!ipLimit.ok || !phoneLimit.ok) {
    const retryAfter = Math.max(ipLimit.retryAfterSeconds, phoneLimit.retryAfterSeconds);
    console.warn(
      `[consent] rate limited ip=${ip} ipOk=${ipLimit.ok} phoneOk=${phoneLimit.ok} retryAfter=${retryAfter}s`
    );
    // Deliberately does not say WHICH dimension tripped — naming it tells an
    // abuser which one to vary.
    return json(
      { error: "Too many submissions. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(retryAfter) }
    );
  }

  try {
    const record = await saveConsent({
      name,
      phone,
      rep,
      ip,
      user_agent: userAgent,
      tcpa_consent: tcpaConsent,
    });
    return json({ ok: true, id: record.id });
  } catch (err) {
    // Do NOT report success if we failed to durably store the consent record.
    console.error("Consent store failure:", err);
    return json(
      {
        error: `We couldn't record your consent just now. Please try again, or email ${COMPANY.policyEmail}.`,
      },
      500
    );
  }
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
