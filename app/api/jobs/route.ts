/**
 * GET /api/jobs - public job search (active listings only, 20 per page).
 * Query: q, location, category, type, workplace, fresher=1, role (repeatable), page.
 * Reads with the public Supabase key, so row-level security applies.
 */
import { NextResponse } from "next/server";
import { JOB_CATEGORIES } from "@/lib/jobs/clusters";
import { parseSearchParams, searchJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Jobs are not set up on this deployment yet." }, { status: 503 });
  }
  try {
    const params = parseSearchParams(new URL(req.url).searchParams, [...JOB_CATEGORIES]);
    const result = await searchJobs(params);
    return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (e) {
    console.error("[jobs] search failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't load jobs right now. Please try again." }, { status: 500 });
  }
}
