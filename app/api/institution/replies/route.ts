import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, studentOf } from "@/lib/institution/server";
import type { MessageReply } from "@/lib/institution/types";

export const dynamic = "force-dynamic";

/**
 * /api/institution/replies - students' replies to the institution's messages.
 *
 * GET   every conversation, newest first: { threads: [{ messageId,
 *       messageTitle, studentUid, studentName, replies, unread }] }
 *       ?uid= limits it to one student
 * POST  { messageId, studentUid, text } - answer a student (they see it under
 *       the message in their inbox)
 *       { seen: [replyId] } - mark students' replies as read
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const only = new URL(req.url).searchParams.get("uid");
    const snap = await db.collection("messageReplies").where("institutionId", "==", institution.id).get();
    const all = snap.docs.map((d) => ({ ...(d.data() as MessageReply), id: d.id })).filter((r) => !only || r.studentUid === only);
    const byThread = new Map<string, MessageReply[]>();
    for (const r of all.sort((a, b) => a.createdAt - b.createdAt)) {
      const k = `${r.messageId}|${r.studentUid}`;
      byThread.set(k, [...(byThread.get(k) ?? []), r]);
    }
    const threads = [...byThread.values()].map((rs) => ({
      messageId: rs[0].messageId, messageTitle: rs[0].messageTitle, studentUid: rs[0].studentUid, studentName: rs[0].studentName,
      replies: rs, unread: rs.filter((r) => r.from === "student" && !r.seenBySchool).length, lastAt: rs[rs.length - 1].createdAt,
    })).sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0) || b.lastAt - a.lastAt);
    return NextResponse.json({ threads });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db, viewAs } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { messageId?: string; studentUid?: string; text?: string; seen?: unknown };
    if (Array.isArray(b.seen)) {
      if (viewAs) return NextResponse.json({ ok: true }); // an admin looking doesn't mark it read for the school
      const ids = b.seen.map(String).slice(0, 200);
      const batch = db.batch();
      for (const id of ids) {
        const snap = await db.collection("messageReplies").doc(id).get();
        if (snap.exists && snap.get("institutionId") === institution.id) batch.update(snap.ref, { seenBySchool: true });
      }
      await batch.commit();
      return NextResponse.json({ ok: true });
    }
    const text = String(b.text ?? "").trim().slice(0, 1000);
    if (!text) throw new ApiError(400, "Write your answer.");
    const msg = await db.collection("institutionMessages").doc(String(b.messageId || "")).get();
    if (!msg.exists || msg.get("institutionId") !== institution.id) throw new ApiError(404, "Message not found.");
    const student = await studentOf(db, institution, String(b.studentUid || ""));
    if (!student || !(msg.get("recipients") as string[]).includes(String(b.studentUid))) throw new ApiError(404, "That student didn't receive this message.");
    const ref = db.collection("messageReplies").doc();
    const r: MessageReply = {
      id: ref.id, messageId: msg.id, messageTitle: String(msg.get("title") || ""), institutionId: institution.id,
      studentUid: String(b.studentUid), studentName: String(student.name || "Student"), from: "school",
      authorName: account.displayName || institution.name, text, createdAt: Date.now(), seenBySchool: true, seenByStudent: false,
    };
    await ref.set(r);
    return NextResponse.json({ reply: r });
  } catch (e) {
    return fail(e);
  }
}
