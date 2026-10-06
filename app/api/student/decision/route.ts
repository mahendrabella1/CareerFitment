import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import type { FamilyDecision } from "@/lib/decisionRoom";
import type { ParentSurvey } from "@/lib/institution/features";

export const dynamic = "force-dynamic";

/**
 * /api/student/decision - the signed-in student's Family Decision Room.
 *
 * GET   { decision, parent } - their saved decision sheet (with the parents'
 *       response, if any) and what their parents said in the survey
 * POST  { pathA, pathB, chosen, reasons } - save the sheet; parents see it
 *       through the survey link their school shared, and can agree or ask
 *       to discuss
 */
export async function GET(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const [user, survey] = await Promise.all([db.collection("users").doc(uid).get(), db.collection("parentSurveys").doc(uid).get()]);
    const s = survey.exists ? (survey.data() as ParentSurvey) : null;
    return NextResponse.json({
      decision: (user.get("decision") as FamilyDecision | undefined) ?? null,
      parent: s ? { areas: s.areas, priorities: s.priorities, firmness: s.firmness, name: s.parentName, relation: s.relation } : null,
      testDrives: Object.values((user.get("testDrives") ?? {}) as Record<string, { career: string; enjoyment: number }>).map((t) => ({ career: t.career, enjoyment: t.enjoyment })),
    });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const pathA = String(b.pathA ?? "").trim().slice(0, 80);
    const pathB = String(b.pathB ?? "").trim().slice(0, 80);
    if (!pathA || !pathB) throw new ApiError(400, "Choose two paths to compare.");
    const decision: FamilyDecision = {
      pathA, pathB,
      chosen: b.chosen === "A" || b.chosen === "B" ? b.chosen : "undecided",
      reasons: String(b.reasons ?? "").trim().slice(0, 800),
      savedAt: Date.now(),
    };
    const db = await getFirestore();
    // Replaces the whole sheet - a changed decision needs the parents' fresh response.
    await db.collection("users").doc(uid).update({ decision });
    return NextResponse.json({ decision });
  } catch (e) {
    return fail(e);
  }
}
