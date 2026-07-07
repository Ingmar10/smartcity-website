import { saveConsent } from "@/lib/consentStore";
import { clientIpFrom } from "@/lib/rateLimit";

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
        error:
          "We couldn't record your consent just now. Please try again, or email contact@smartctycontractors.com.",
      },
      500
    );
  }
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
