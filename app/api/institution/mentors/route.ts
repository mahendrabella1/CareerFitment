import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, studentOf } from "@/lib/institution/server";
import { AREA_BY_KEY } from "@/lib/institution/features";
import { categoryLabel } from "@/lib/auth/formOptions";
import type { InstitutionMessage } from "@/lib/institution/types";

export const dynamic = "force-dynamic";

/**
 * /api/institution/mentors - seniors paired to mentor juniors who share a
 * career area (suggestions are computed on the page, features.ts
 * suggestMentors; the school confirms each pair).
 *
 * GET     confirmed pairs
 * POST    { mentorUid, menteeUid, area } - confirm a pair; both students get
 *         an introduction message (no contact details - the school arranges
 *         the first meeting)
 * DELETE  ?id= - end a pair
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const snap = await db.collection("mentorPairs").where("institutionId", "==", institution.id).get();
    return NextResponse.json({ pairs: snap.docs.map((d) => ({ ...d.data(), id: d.id })) });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { mentorUid?: string; menteeUid?: string; area?: string };
    const [mentor, mentee] = await Promise.all([studentOf(db, institution, String(b.mentorUid)), studentOf(db, institution, String(b.menteeUid))]);
    if (!mentor || !mentee || b.mentorUid === b.menteeUid) throw new ApiError(404, "Both must be your students.");
    const area = AREA_BY_KEY[String(b.area)]?.label ?? "your career area";
    const now = Date.now();
    const pairRef = db.collection("mentorPairs").doc();
    const mName = String(mentor.name || "A senior"), jName = String(mentee.name || "A junior");
    const msg = (to: string, title: string, body: string): [FirebaseFirestore.DocumentReference, InstitutionMessage] => {
      const ref = db.collection("institutionMessages").doc();
      return [ref, {
        id: ref.id, institutionId: institution.id, institutionName: institution.name, kind: "message", title, body, link: "/account",
        audience: { type: "students", label: "Mentor introduction" }, recipients: [to], readBy: {},
        sentBy: account.uid, sentByName: account.displayName || institution.name, createdAt: now,
      }];
    };
    const batch = db.batch();
    batch.set(pairRef, { institutionId: institution.id, mentorUid: b.mentorUid, menteeUid: b.menteeUid, mentorName: mName, menteeName: jName, area, createdAt: now, createdBy: account.displayName || institution.name });
    for (const [ref, m] of [
      msg(String(b.mentorUid), "You've been chosen as a peer mentor", `Hi {name}, your school has chosen you to mentor ${jName} (${categoryLabel(String(mentee.category || ""))}), who is interested in ${area} - the same area as you. Share what you've learned: subjects, exams, projects, mistakes to avoid. Your school will arrange your first meeting.`),
      msg(String(b.menteeUid), "Meet your peer mentor", `Hi {name}, your school has matched you with ${mName} (${categoryLabel(String(mentor.category || ""))}), a senior interested in ${area} like you. Note down three questions to ask them. Your school will arrange your first meeting.`),
    ]) batch.set(ref, m);
    await batch.commit();
    return NextResponse.json({ id: pairRef.id });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const ref = db.collection("mentorPairs").doc(new URL(req.url).searchParams.get("id") || "");
    const snap = await ref.get();
    if (!snap.exists || snap.get("institutionId") !== institution.id) throw new ApiError(404, "Not found.");
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
