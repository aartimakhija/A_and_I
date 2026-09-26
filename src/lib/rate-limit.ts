// Rate limiter for public API routes, backed by Upstash Redis when it's
// configured — falling back to the original in-memory Map otherwise, so
// this behaves exactly as before until UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are actually set (e.g. via Vercel's Upstash
// integration, which sets both automatically once a Redis database is
// attached to the project).
//
// Honest limitation of the in-memory fallback, unchanged from before: Vercel
// serverless functions don't guarantee a shared, persistent process between
// invocations, so under real load this resets more often than a durable
// store would. It still meaningfully slows down naive scripted abuse within
// a warm instance, but it's a stopgap, not production-grade protection —
// which is exactly why the Redis path below exists.

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const buckets = new Map<string, { count: number; resetAt: number }>();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

// One Ratelimit instance per distinct (limit, window) pair, reused across
// calls — each call site here always passes the same two numbers, so this
// cache stays tiny (one entry per call site) rather than growing per key.
const limiters = new Map<string, Ratelimit>();
function getLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  const existing = limiters.get(cacheKey);
  if (existing) return existing;
  const rl = new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.fixedWindow(limit, `${windowMs}ms`),
    prefix: "ratelimit",
  });
  limiters.set(cacheKey, rl);
  return rl;
}

function inMemoryRateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) return { ok: false, remaining: 0 };
  bucket.count++;
  return { ok: true, remaining: limit - bucket.count };
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<{ ok: boolean; remaining: number }> {
  if (redis) {
    try {
      const { success, remaining } = await getLimiter(limit, windowMs).limit(key);
      return { ok: success, remaining };
    } catch {
      // Redis unreachable or misconfigured — fail open to the in-memory
      // limiter rather than blocking every request on a Redis outage.
    }
  }
  return inMemoryRateLimit(key, limit, windowMs);
}

/** Pulls the best-effort client identifier out of standard proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0].trim() || "unknown";
}
