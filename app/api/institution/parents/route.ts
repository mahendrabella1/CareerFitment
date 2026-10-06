import { NextResponse } from "next/server";
import { ApiError, fail, randomToken, requireInstitution, rowsOf } from "@/lib/institution/server";
import type { ParentSurvey } from "@/lib/institution/features";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * /api/institution/parents
 *
 * GET   the institution's students with their parent-survey link (if made)
 *       and the parents' answers (if given)
 * POST  { uids } - make survey links for those students (an existing link
 *       is reused). Each link opens /parent/<token>: no account needed, the
 *       unguessable token is the key, and it only ever reaches one student.
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const [students, links, surveys] = await Promise.all([
      rowsOf(db, institution),
      db.collection("parentLinks").where("institutionId", "==", institution.id).get(),
      db.collection("parentSurveys").where("institutionId", "==", institution.id).get(),
    ]);
    const linkByUid: Record<string, string> = {};
    links.forEach((d) => { linkByUid[String(d.get("uid"))] = d.id; });
    const surveyByUid: Record<string, ParentSurvey> = {};
    surveys.forEach((d) => { surveyByUid[d.id] = d.data() as ParentSurvey; });
    return NextResponse.json({ students: students.filter((s) => !s.archived), links: linkByUid, surveys: surveyByUid });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const body = (await req.json().catch(() => ({}))) as { uids?: unknown };
    const wanted = new Set((Array.isArray(body.uids) ? body.uids : []).map(String));
    if (!wanted.size) throw new ApiError(400, "Pick at least one student.");
    const students = (await rowsOf(db, institution)).filter((s) => wanted.has(s.uid));
    const existing = await db.collection("parentLinks").where("institutionId", "==", institution.id).get();
    const linkByUid: Record<string, string> = {};
    existing.forEach((d) => { linkByUid[String(d.get("uid"))] = d.id; });
    const batch = db.batch();
    for (const s of students) {
      if (linkByUid[s.uid]) continue;
      const token = randomToken();
      linkByUid[s.uid] = token;
      batch.set(db.collection("parentLinks").doc(token), { uid: s.uid, institutionId: institution.id, createdAt: Date.now() });
    }
    await batch.commit();
    return NextResponse.json({ links: Object.fromEntries(students.map((s) => [s.uid, linkByUid[s.uid]])) });
  } catch (e) {
    return fail(e);
  }
}
