import Anthropic from "@anthropic-ai/sdk";
import { BOLT_SYSTEM_PROMPT } from "@/lib/boltSystemPrompt";
import {
  checkRateLimit,
  clientIpFrom,
  pruneRateLimitStore,
} from "@/lib/rateLimit";

// Node runtime (Anthropic SDK + streaming). Not Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = "claude-haiku-4-5"; // fast, low-cost — scoped FAQ widget
const MAX_TOKENS = 1024;
const MAX_HISTORY = 12; // cap turns sent to control cost
const MAX_CHARS = 2000; // cap per-message length

function sanitize(messages: unknown): ChatMessage[] | null {
  if (!Array.isArray(messages)) return null;
  const cleaned: ChatMessage[] = [];
  for (const m of messages) {
    if (
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0
    ) {
      cleaned.push({
        role: m.role,
        content: m.content.slice(0, MAX_CHARS),
      });
    }
  }
  if (cleaned.length === 0) return null;
  // Keep only the most recent turns; ensure the last message is from the user.
  const trimmed = cleaned.slice(-MAX_HISTORY);
  if (trimmed[trimmed.length - 1].role !== "user") return null;
  return trimmed;
}

export async function POST(req: Request) {
  // ── Cost-control gate: 20 messages / IP / hour ──────────────────────────
  pruneRateLimitStore();
  const ip = clientIpFrom(req.headers);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return new Response(
      JSON.stringify({
        error:
          "Bolt is seeing high volume from your connection right now. Give it a little while and try again — or reach the team on the Contact page.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rate.retryAfterSeconds),
        },
      }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Bolt isn't configured yet (missing API key). Reach the team on the Contact page in the meantime.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = sanitize(
    (body as { messages?: unknown })?.messages
  );
  if (!messages) {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Haiku 4.5 does not support adaptive thinking / effort — plain stream call.
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: BOLT_SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("Bolt stream error:", err);
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
