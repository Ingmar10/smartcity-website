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

  try {
    const record = await saveWaitlist({
      name,
      email,
      source,
      rep,
      ip: clientIpFrom(req.headers),
      user_agent: req.headers.get("user-agent"),
    });
    return json({ ok: true, id: record.id });
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
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
