/** GET /api/jobs/stats - real counts over the active listings, for the portal's home view. */
import { NextResponse } from "next/server";
import { getJobStats } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Jobs are not set up on this deployment yet." }, { status: 503 });
  }
  try {
    return NextResponse.json(await getJobStats(), { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } });
  } catch (e) {
    console.error("[jobs] stats failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't load job counts right now." }, { status: 500 });
  }
}
