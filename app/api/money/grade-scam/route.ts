import { NextResponse } from "next/server";
import { SCAM_ITEMS, FAMILY_GUARD_ITEMS } from "@/data/money/scamItems";
import { gradeSwipeRound, type SwipeAnswer } from "@/lib/money/scoring";

// Same stateless, re-read-the-real-data grading pattern as /api/startups/
// grade - isScam/lesson never reach the client until after this response.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { mode?: "swipe" | "family"; answers?: SwipeAnswer[] } | null;
  if (!body?.mode || !Array.isArray(body.answers)) {
    return NextResponse.json({ success: false, error: "bad_request" }, { status: 400 });
  }
  const bank = body.mode === "family" ? FAMILY_GUARD_ITEMS : SCAM_ITEMS;
  const result = gradeSwipeRound(bank, body.answers);
  return NextResponse.json({ success: true, result });
}
