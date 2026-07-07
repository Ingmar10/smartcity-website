// Lightweight in-memory, per-IP sliding-window rate limiter for the Bolt widget.
//
// Purpose: a cost-control gate against scripted abuse of the Claude-backed
// /api/bolt endpoint. 20 messages / IP / hour by default.
//
// Scope/limitation: this counter lives in the serverless instance's memory, so
// it is per-instance, not globally shared. That is sufficient to blunt a single
// abusive client hammering one warm instance. For strict, cross-instance
// enforcement at scale, move the counter to Vercel KV / Upstash Redis (see
// README). Kept dependency-free here so the site runs with zero extra services.

type Hit = { count: number; windowStart: number };

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 20; // messages per IP per window

// Module-level map persists across requests within a warm instance.
const store = new Map<string, Hit>();

export type RateResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  ip: string,
  max = MAX_HITS,
  windowMs = WINDOW_MS
): RateResult {
  const now = Date.now();
  const existing = store.get(ip);

  if (!existing || now - existing.windowStart >= windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return { ok: true, remaining: max - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= max) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.windowStart + windowMs - now) / 1000)
    );
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  store.set(ip, existing);
  return { ok: true, remaining: max - existing.count, retryAfterSeconds: 0 };
}

// Best-effort periodic cleanup so the map doesn't grow unbounded on a
// long-lived instance. Cheap; runs on each call opportunistically.
export function pruneRateLimitStore(windowMs = WINDOW_MS): void {
  const now = Date.now();
  for (const [ip, hit] of store) {
    if (now - hit.windowStart >= windowMs) store.delete(ip);
  }
}

// Extract the client IP from standard proxy headers (Vercel sets x-forwarded-for).
export function clientIpFrom(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
