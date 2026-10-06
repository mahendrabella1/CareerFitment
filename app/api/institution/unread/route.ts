import { NextResponse } from "next/server";
import { fail, requireInstitution } from "@/lib/institution/server";

export const dynamic = "force-dynamic";

/** GET /api/institution/unread - counts for the portal's navigation badges. */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const [replies, own, all, threads, milestones] = await Promise.all([
      db.collection("messageReplies").where("institutionId", "==", institution.id).where("seenBySchool", "==", false).get(),
      db.collection("portalNotices").where("institutionIds", "array-contains", institution.id).get(),
      db.collection("portalNotices").where("institutionIds", "array-contains", "all").get(),
      db.collection("supportThreads").where("institutionId", "==", institution.id).where("unreadForSchool", "==", true).get(),
      db.collection("milestones").where("institutionId", "==", institution.id).where("status", "==", "pending").get(),
    ]);
    const notices = [...own.docs, ...all.docs].filter((d) => !d.get(`readBy.${institution.id}`)).length;
    return NextResponse.json({ replies: replies.size, onegrasp: notices + threads.size, milestones: milestones.size });
  } catch (e) {
    return fail(e);
  }
}
