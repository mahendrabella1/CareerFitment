import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import type { InstitutionMessage, MessageReply, StudentInboxMessage } from "@/lib/institution/types";

export const dynamic = "force-dynamic";

/**
 * /api/student/messages - the signed-in student's inbox of messages from
 * their school or college (sent from the institution portal).
 *
 * GET   their 30 newest messages, "{name}" filled with their first name
 * POST  { ids } - mark read; { clicked: id } - they followed its button;
 *       { applied: id } - they applied to the opportunity it announced;
 *       { reply: { id, text } } - reply to the sender (their school, or OneGrasp).
 *       Only messages addressed to them are touched.
 */
export async function GET(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const [snap, user, replySnap] = await Promise.all([
      db.collection("institutionMessages").where("recipients", "array-contains", uid).get(),
      db.collection("users").doc(uid).get(),
      db.collection("messageReplies").where("studentUid", "==", uid).get(),
    ]);
    const threads = new Map<string, MessageReply[]>();
    replySnap.docs.map((d) => d.data() as MessageReply).sort((a, b) => a.createdAt - b.createdAt)
      .forEach((r) => threads.set(r.messageId, [...(threads.get(r.messageId) ?? []), r]));
    // The school's answers are flagged once as new, then counted as seen.
    const unseen = replySnap.docs.filter((d) => d.get("from") === "school" && !d.get("seenByStudent"));
    const newReplyIn = new Set(unseen.map((d) => String(d.get("messageId"))));
    if (unseen.length) { const b = db.batch(); unseen.forEach((d) => b.update(d.ref, { seenByStudent: true })); await b.commit(); }
    const first = String(user.get("name") || "").trim().split(" ")[0] || "there";
    const recent = snap.docs.map((d) => ({ ...(d.data() as InstitutionMessage), id: d.id })).sort((a, b) => b.createdAt - a.createdAt).slice(0, 30);
    const oppIds = [...new Set(recent.map((m) => m.opportunityId).filter(Boolean))] as string[];
    const opps = oppIds.length ? await db.getAll(...oppIds.map((id) => db.collection("opportunities").doc(id))) : [];
    const appliedTo = new Set(opps.filter((o) => o.exists && o.get(`applied.${uid}`)).map((o) => o.id));
    const messages: StudentInboxMessage[] = recent.map((m) => ({
      id: m.id, kind: m.kind, title: m.title, body: m.body.replace(/\{name\}/g, first),
      ...(m.link ? { link: m.link } : {}),
      ...(m.externalUrl ? { externalUrl: m.externalUrl } : {}),
      ...(m.opportunityId ? { opportunityId: m.opportunityId, applied: appliedTo.has(m.opportunityId) } : {}),
      from: m.institutionName, createdAt: m.createdAt, read: !!m.readBy?.[uid],
      thread: (threads.get(m.id) ?? []).map((r) => ({ from: r.from, authorName: r.authorName, text: r.text, createdAt: r.createdAt })),
      ...(newReplyIn.has(m.id) ? { newReply: true } : {}),
    }));
    return NextResponse.json({ messages, unread: messages.filter((m) => !m.read || m.newReply).length });
  } catch (e) {
    return fail(e);
  }
}

const ID = /^[A-Za-z0-9]{10,40}$/;

export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as { ids?: unknown; clicked?: unknown; applied?: unknown; reply?: unknown };
    const db = await getFirestore();
    const now = Date.now();
    const addressed = async (id: string) => {
      const snap = await db.collection("institutionMessages").doc(id).get();
      return snap.exists && (snap.get("recipients") as string[] | undefined)?.includes(uid) ? snap : null;
    };

    if (typeof body.clicked === "string" && ID.test(body.clicked)) {
      const snap = await addressed(body.clicked);
      if (snap && !snap.get(`clickedBy.${uid}`)) await snap.ref.update({ [`clickedBy.${uid}`]: now, [`readBy.${uid}`]: snap.get(`readBy.${uid}`) ?? now });
      return NextResponse.json({ ok: true });
    }
    const reply = body.reply as { id?: unknown; text?: unknown } | undefined;
    if (reply && typeof reply.id === "string" && ID.test(reply.id)) {
      const text = String(reply.text ?? "").trim().slice(0, 1000);
      if (!text) throw new ApiError(400, "Write your reply.");
      const snap = await addressed(reply.id);
      if (!snap) throw new ApiError(404, "Message not found.");
      const user = await db.collection("users").doc(uid).get();
      const ref = db.collection("messageReplies").doc();
      const r: MessageReply = {
        id: ref.id, messageId: snap.id, messageTitle: String(snap.get("title") || ""), institutionId: String(snap.get("institutionId")),
        studentUid: uid, studentName: String(user.get("name") || "Student"), from: "student", authorName: String(user.get("name") || "Student"),
        text, createdAt: now, seenBySchool: false, seenByStudent: true,
      };
      await ref.set(r);
      if (!snap.get(`readBy.${uid}`)) await snap.ref.update({ [`readBy.${uid}`]: now });
      return NextResponse.json({ ok: true, reply: { from: r.from, authorName: r.authorName, text: r.text, createdAt: r.createdAt } });
    }
    if (typeof body.applied === "string" && ID.test(body.applied)) {
      const snap = await addressed(body.applied);
      const oppId = snap?.get("opportunityId") as string | undefined;
      if (!snap || !oppId) throw new ApiError(404, "Not found.");
      await db.collection("opportunities").doc(oppId).update({ [`applied.${uid}`]: now });
      return NextResponse.json({ ok: true });
    }

    const ids = (Array.isArray(body.ids) ? body.ids : []).map(String).filter((s) => ID.test(s)).slice(0, 50);
    if (!ids.length) throw new ApiError(400, "No messages given.");
    await Promise.all(ids.map(async (id) => {
      const snap = await addressed(id);
      if (snap && !snap.get(`readBy.${uid}`)) await snap.ref.update({ [`readBy.${uid}`]: now });
    }));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
