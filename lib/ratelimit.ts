import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-IP sliding-window rate limiter for the (unauthenticated) resume-generator
 * API. Each request triggers a gpt-4o call, so without this the endpoint can be
 * scripted into a very large OpenAI bill.
 *
 * 30 requests / hour / IP is generous for real use — even a heavy paid user
 * rarely regenerates that often — while capping a single scripted IP to roughly
 * 30 × ~$0.17 ≈ $5/hour of worst-case OpenAI spend.
 *
 * Upstash REST is edge-compatible, so this works inside the route's
 * `runtime = 'edge'`. If UPSTASH_REDIS_REST_URL / _TOKEN are not set this is
 * null and the API FAILS OPEN (no limiting) — set those env vars in Vercel for
 * the protection to take effect, and keep an OpenAI monthly spend cap as a
 * hard backstop.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL/_TOKEN not set — resume-generator API is NOT rate limited. Configure Upstash in Vercel to enable protection."
  );
}

export const ratelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(30, "1 h"),
        prefix: "rl:resume-generator",
      })
    : null;

/** Best-effort client IP from Vercel's proxy headers. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}
