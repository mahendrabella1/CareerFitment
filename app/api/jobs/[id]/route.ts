/** GET /api/jobs/[id] - one active listing with its description. */
import { NextResponse } from "next/server";
import { getJob, isUuid } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!isUuid(params.id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Jobs are not set up on this deployment yet." }, { status: 503 });
  }
  try {
    const job = await getJob(params.id);
    if (!job) return NextResponse.json({ error: "This listing is no longer active." }, { status: 404 });
    return NextResponse.json(job, { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } });
  } catch (e) {
    console.error("[jobs] detail failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't load this job right now." }, { status: 500 });
  }
}
