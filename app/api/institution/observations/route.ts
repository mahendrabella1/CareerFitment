import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, studentOf } from "@/lib/institution/server";
import { TRAITS } from "@/lib/institution/features";

export const dynamic = "force-dynamic";

/**
 * /api/institution/observations - teachers' 1-5 ratings of five visible
 * traits per student (lib/institution/features.ts TRAITS), compared on the
 * page with what the test found.
 *
 * GET   all ratings for the institution: { [uid]: { ratings, by, updatedAt } }
 * POST  { uid, ratings: { trait: 1-5 } }
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const snap = await db.collection("observations").where("institutionId", "==", institution.id).get();
    const observations: Record<string, unknown> = {};
    snap.forEach((d) => { observations[String(d.get("uid"))] = d.data(); });
    return NextResponse.json({ observations });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { uid?: string; ratings?: Record<string, unknown> };
    const uid = String(b.uid || "");
    if (!(await studentOf(db, institution, uid))) throw new ApiError(404, "Not one of your students.");
    const ratings: Record<string, number> = {};
    for (const t of TRAITS) {
      const v = Number(b.ratings?.[t.key]);
      if (v >= 1 && v <= 5) ratings[t.key] = Math.round(v);
    }
    await db.collection("observations").doc(`${institution.id}_${uid}`).set(
      { institutionId: institution.id, uid, ratings, by: account.displayName || institution.name, updatedAt: Date.now() },
      { merge: true },
    );
    return NextResponse.json({ ok: true, ratings });
  } catch (e) {
    return fail(e);
  }
}
