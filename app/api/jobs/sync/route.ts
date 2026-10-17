/**
 * /api/jobs/sync - the daily job import. Called by Vercel Cron (GET, with
 * "Authorization: Bearer <CRON_SECRET>", which Vercel adds automatically when
 * CRON_SECRET is set) or by hand (POST, same header). See docs/JOB_PORTAL.md.
 * Returns a short per-source summary - never secrets or stack traces.
 */
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { runImport } from "@/lib/jobs/importer";
import { getSources } from "@/lib/jobs/sources";
import { fetchJson, isJobsDbConfigured, supabaseJobStore } from "@/lib/jobs/store";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false;
  const header = req.headers.get("authorization") ?? "";
  const given = Buffer.from(header.startsWith("Bearer ") ? header.slice(7) : "");
  const want = Buffer.from(secret);
  return given.length === want.length && timingSafeEqual(given, want);
}

async function sync(req: Request, trigger: string) {
  if (!process.env.CRON_SECRET) return NextResponse.json({ error: "CRON_SECRET is not set on this deployment." }, { status: 503 });
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isJobsDbConfigured()) return NextResponse.json({ error: "Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." }, { status: 503 });
  try {
    const { status, results } = await runImport(getSources(), supabaseJobStore(), { fetchJson }, { trigger, deadlineMs: 52_000 });
    return NextResponse.json({
      status,
      at: new Date().toISOString(),
      sources: results.map((r) => ({ source: r.source, status: r.status, fetched: r.fetched, saved: r.upserted, expired: r.expired, complete: r.complete, note: r.message || undefined })),
    }, { status: status === "failed" ? 502 : 200 });
  } catch (e) {
    console.error("[jobs] sync failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ status: "failed", error: "The import could not start. Check the server logs." }, { status: 500 });
  }
}

export function GET(req: Request) {
  return sync(req, "cron");
}

export function POST(req: Request) {
  return sync(req, "manual");
}
