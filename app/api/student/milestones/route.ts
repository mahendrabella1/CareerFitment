import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail, institutionForStudent, randomToken } from "@/lib/institution/server";
import { MILESTONE_KINDS, type Milestone, type MilestoneKind } from "@/lib/institution/passport";

export const dynamic = "force-dynamic";

/**
 * /api/student/milestones - the signed-in student's Career Passport.
 *
 * GET     their milestones (newest first) and their public passport id
 * POST    { title, kind, evidenceUrl, date, note } - add one (pending until
 *         their institution verifies it)
 * DELETE  ?id= - remove one of their own that isn't verified yet
 */
export async function GET(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const [snap, user] = await Promise.all([
      db.collection("milestones").where("uid", "==", uid).get(),
      db.collection("users").doc(uid).get(),
    ]);
    let passportId = String(user.get("passportId") || "");
    if (!passportId && user.exists) {
      passportId = randomToken(12);
      await Promise.all([
        db.collection("passports").doc(passportId).set({ uid, createdAt: Date.now() }),
        db.collection("users").doc(uid).set({ passportId }, { merge: true }),
      ]);
    }
    const milestones = snap.docs.map((d) => ({ ...(d.data() as Milestone), id: d.id })).sort((a, b) => b.createdAt - a.createdAt);
    const inst = await institutionForStudent(db, user.get("institution"));
    return NextResponse.json({ milestones, passportId, institution: inst?.name ?? null });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const title = String(b.title ?? "").trim().slice(0, 120);
    const kind = MILESTONE_KINDS.some((k) => k.key === b.kind) ? (b.kind as MilestoneKind) : "other";
    const evidenceUrl = String(b.evidenceUrl ?? "").trim().slice(0, 500);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date)) ? String(b.date) : new Date().toISOString().slice(0, 10);
    if (!title) throw new ApiError(400, "Give the milestone a title.");
    if (evidenceUrl && !/^https?:\/\/\S+$/i.test(evidenceUrl)) throw new ApiError(400, "The proof link must start with http:// or https://");
    const user = await db.collection("users").doc(uid).get();
    if ((await db.collection("milestones").where("uid", "==", uid).count().get()).data().count >= 100) throw new ApiError(400, "You can keep up to 100 milestones.");
    const inst = await institutionForStudent(db, user.get("institution"));
    const ref = db.collection("milestones").doc();
    const m: Milestone = {
      id: ref.id, uid, institutionId: inst?.id ?? null, title, kind, evidenceUrl, date,
      note: String(b.note ?? "").trim().slice(0, 500), status: "pending", createdAt: Date.now(),
    };
    await ref.set(m);
    return NextResponse.json({ milestone: m });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const id = new URL(req.url).searchParams.get("id") || "";
    const ref = db.collection("milestones").doc(id);
    const snap = await ref.get();
    if (!snap.exists || snap.get("uid") !== uid) throw new ApiError(404, "Milestone not found.");
    if (snap.get("status") === "verified") throw new ApiError(400, "A verified milestone can't be removed - ask your institution.");
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
