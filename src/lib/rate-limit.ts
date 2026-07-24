// A minimal, in-memory rate limiter for public API routes.
//
// Honest limitation: Vercel serverless functions don't guarantee a shared,
// persistent process between invocations — under real load this resets more
// often than a dedicated store would. It still meaningfully slows down naive
// scripted abuse (the common case) within a warm instance. For real
// protection at scale, put this behind Vercel's Attack Challenge Mode /
// Firewall, or swap this for Upstash Redis — this is a stopgap, not a
// production-grade rate limiter.

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
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

/** Pulls the best-effort client identifier out of standard proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0].trim() || "unknown";
}
