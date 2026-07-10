import { NextResponse } from "next/server";
import { scoreAssessment } from "@/lib/newAssessment/scoring";
import type { Category, StageKey } from "@/lib/newAssessment/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    stage?: StageKey;
    chosenSets?: Record<Category, string>;
    answers?: Record<string, string>;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body", data: null }, { status: 400 });
  }
  if (!body.stage || !body.chosenSets || !body.answers) {
    return NextResponse.json({ success: false, message: "Missing stage/chosenSets/answers", data: null }, { status: 400 });
  }
  try {
    const summary = scoreAssessment(body.stage, body.chosenSets, body.answers);
    return NextResponse.json({ success: true, message: "scored", data: summary });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Scoring failed", data: null },
      { status: 500 }
    );
  }
}
