import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, rowsOf, studentOf } from "@/lib/institution/server";
import type { Milestone } from "@/lib/institution/passport";

export const dynamic = "force-dynamic";

/**
 * /api/institution/milestones - Career Passport verification.
 *
 * GET   milestones the institution's students added (newest first)
 * POST  { id, action: "verify" | "reject", note? } - only for the
 *       institution's own students
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    // By the institution's own students - so milestones added before the
    // school had a portal login (no institution on them yet) show up too,
    // and get tagged with this institution for the navigation badge.
    const uids = (await rowsOf(db, institution)).map((s) => s.uid);
    const docs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
    for (let i = 0; i < uids.length; i += 30) docs.push(...(await db.collection("milestones").where("uid", "in", uids.slice(i, i + 30)).get()).docs);
    const untagged = docs.filter((d) => d.get("institutionId") !== institution.id);
    for (let i = 0; i < untagged.length; i += 400) {
      const b = db.batch();
      untagged.slice(i, i + 400).forEach((d) => b.update(d.ref, { institutionId: institution.id }));
      await b.commit();
    }
    const milestones = docs.map((d) => ({ ...(d.data() as Milestone), id: d.id, institutionId: institution.id })).sort((a, b) => b.createdAt - a.createdAt).slice(0, 500);
    return NextResponse.json({ milestones });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { id?: string; action?: string; note?: string };
    const ref = db.collection("milestones").doc(String(b.id || ""));
    const snap = await ref.get();
    const m = snap.data() as Milestone | undefined;
    if (!m || !(await studentOf(db, institution, m.uid))) throw new ApiError(404, "Milestone not found for your students.");
    if (b.action !== "verify" && b.action !== "reject") throw new ApiError(400, "Unknown action.");
    await ref.update({
      status: b.action === "verify" ? "verified" : "rejected", institutionId: institution.id,
      reviewNote: String(b.note ?? "").trim().slice(0, 300), reviewedBy: account.displayName || institution.name, reviewedAt: Date.now(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
