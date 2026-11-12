/**
 * Server-only: a simple fixed-window rate limit for public endpoints
 * (security audit M-04). With UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN set it counts in Upstash Redis over its REST API
 * (plain fetch - no extra dependency); without them every request is allowed
 * and one warning is logged. If Upstash can't be reached, the request is
 * allowed too - a limiter outage must never take the site down.
 *
 * Limits are generous on purpose: a whole school lab often shares one IP
 * address, so they stop floods and scripts, not a class signing up together.
 */
import { NextResponse } from "next/server";

export type Limiter = (key: string, max: number, windowSec: number) => Promise<boolean>;

let warned = false;

const upstash: Limiter = async (key, max, windowSec) => {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    if (!warned) { warned = true; console.warn("[rateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set - rate limiting is off"); }
    return true;
  }
  const bucket = `rl:${key}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", bucket], ["EXPIRE", bucket, String(windowSec + 5)]]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return true;
    const data = (await res.json()) as { result?: unknown }[];
    return Number(data?.[0]?.result ?? 0) <= max;
  } catch {
    return true;
  }
};

let current: Limiter = upstash;

/** Tests swap in a fake; pass nothing to restore Upstash. */
export function setLimiter(l?: Limiter): void {
  current = l ?? upstash;
}

/** True when this request may go ahead. */
export function limit(key: string, max: number, windowSec: number): Promise<boolean> {
  return current(key, max, windowSec);
}

/** The caller's IP as Vercel reports it (first x-forwarded-for entry). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return (fwd.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim().slice(0, 64);
}

/**
 * For a route: null to carry on, or a 429 response to return. `key` defaults
 * to the caller's IP; pass e.g. a uid to limit per account instead.
 */
export async function rateLimited(req: Request, route: string, max: number, windowSec: number, key = clientIp(req)): Promise<NextResponse | null> {
  if (await limit(`${route}:${key}`, max, windowSec)) return null;
  return NextResponse.json(
    { success: false, error: "Too many requests - please wait a few minutes and try again.", message: "Too many requests - please wait a few minutes and try again." },
    { status: 429, headers: { "Retry-After": String(windowSec) } },
  );
}
