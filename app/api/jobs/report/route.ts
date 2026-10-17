/**
 * POST /api/jobs/report - "Report this listing" (suspicious, expired, wrong).
 * Body: { jobId, reason, details?, website? }  ("website" is a hidden honeypot
 * field: real visitors leave it empty).
 * Spam limits per visitor (by salted IP hash): 5 reports an hour, one report
 * per listing a day. Three or more open reports mark the listing "caution"
 * for everyone (lib/jobs/search.ts) until reviewed.
 */
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isUuid } from "@/lib/jobs/search";
import { isJobsDbConfigured } from "@/lib/jobs/store";

export const dynamic = "force-dynamic";

const REASONS = ["scam", "expired", "wrong_info", "duplicate", "other"] as const;

export async function POST(req: Request) {
  if (!isJobsDbConfigured()) return NextResponse.json({ error: "Reporting is not available right now." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { jobId?: unknown; reason?: unknown; details?: unknown; website?: unknown };
  // Bots fill every field; pretend success and store nothing.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });
  const jobId = typeof body.jobId === "string" ? body.jobId : "";
  const reason = REASONS.find((r) => r === body.reason);
  if (!isUuid(jobId) || !reason) return NextResponse.json({ error: "Choose a reason." }, { status: 400 });
  const details = typeof body.details === "string" ? body.details.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 500) : "";

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const salt = process.env.JOB_REPORT_SALT || process.env.CRON_SECRET || "onegrasp-jobs";
  const reporter = createHash("sha256").update(`${salt}:${ip}`).digest("hex");

  try {
    const db = getSupabaseAdmin();
    const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
    const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
    const [{ count: recent }, { count: same }, { data: job }] = await Promise.all([
      db.from("job_reports").select("id", { count: "exact", head: true }).eq("reporter_hash", reporter).gte("created_at", hourAgo),
      db.from("job_reports").select("id", { count: "exact", head: true }).eq("reporter_hash", reporter).eq("job_id", jobId).gte("created_at", dayAgo),
      db.from("jobs").select("id").eq("id", jobId).maybeSingle(),
    ]);
    if (!job) return NextResponse.json({ error: "This listing no longer exists." }, { status: 404 });
    if ((same ?? 0) > 0) return NextResponse.json({ ok: true, note: "You already reported this listing - thank you." });
    if ((recent ?? 0) >= 5) return NextResponse.json({ error: "Too many reports in a short time. Please try again later." }, { status: 429 });

    const { error } = await db.from("job_reports").insert({ job_id: jobId, reason, details: details || null, reporter_hash: reporter });
    if (error) throw new Error(error.message);
    const { count: open } = await db.from("job_reports").select("id", { count: "exact", head: true }).eq("job_id", jobId).eq("status", "open");
    await db.from("jobs").update({ reported_count: open ?? 0 }).eq("id", jobId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[jobs] report failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't send the report. Please try again." }, { status: 500 });
  }
}
