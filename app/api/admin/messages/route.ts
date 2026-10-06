import { NextResponse } from "next/server";
import { ApiError, belongsTo, fail, requireAdmin } from "@/lib/institution/server";
import { categoryLabel } from "@/lib/auth/formOptions";
import { sendMessageEmails } from "@/lib/institution/messageEmail";
import { ONEGRASP_SENDER, type Institution, type InstitutionMessage, type MessageKind, type MessageReply, type PortalNotice, type SupportThread } from "@/lib/institution/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KINDS: MessageKind[] = ["message", "reminder", "alert", "recommendation"];

/**
 * /api/admin/messages - OneGrasp's own message centre.
 *
 * GET   { sent, notices, threads, replies, institutions }
 * POST  { kind: "students", title, body, msgKind, link?, institutionIds?, classes?, email? }
 *         -> students' inboxes ("from OneGrasp"); no institution = everyone
 *       { kind: "notice", title, body, institutionIds? } -> institution portals
 *       { kind: "support-reply", threadId, text, close? } -> an institution's conversation
 *       { kind: "student-reply", messageId, studentUid, text } -> a student who replied to OneGrasp
 *       { kind: "seen", threadId? , replyIds? }
 */
export async function GET(req: Request) {
  try {
    const { db } = await requireAdmin(req);
    const [sent, notices, threads, replies, insts] = await Promise.all([
      db.collection("institutionMessages").where("institutionId", "==", ONEGRASP_SENDER).get(),
      db.collection("portalNotices").get(),
      db.collection("supportThreads").get(),
      db.collection("messageReplies").where("institutionId", "==", ONEGRASP_SENDER).get(),
      db.collection("institutions").get(),
    ]);
    return NextResponse.json({
      sent: sent.docs.map((d) => ({ ...(d.data() as InstitutionMessage), id: d.id })).sort((a, b) => b.createdAt - a.createdAt).slice(0, 100)
        .map(({ recipients, readBy, clickedBy, ...m }) => ({ ...m, recipientCount: recipients.length, readCount: Object.keys(readBy ?? {}).length, clickCount: Object.keys(clickedBy ?? {}).length })),
      notices: notices.docs.map((d) => ({ ...(d.data() as PortalNotice), id: d.id })).sort((a, b) => b.createdAt - a.createdAt),
      threads: threads.docs.map((d) => ({ ...(d.data() as SupportThread), id: d.id })).sort((a, b) => Number(b.unreadForAdmin) - Number(a.unreadForAdmin) || b.updatedAt - a.updatedAt),
      replies: replies.docs.map((d) => ({ ...(d.data() as MessageReply), id: d.id })).sort((a, b) => b.createdAt - a.createdAt),
      institutions: insts.docs.map((d) => ({ id: d.id, name: String(d.get("name") || "") })).sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { db, email } = await requireAdmin(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const now = Date.now();
    const title = String(b.title ?? "").trim().slice(0, 120);
    const text = String(b.body ?? b.text ?? "").trim().slice(0, 2000);

    if (b.kind === "students") {
      if (!title || !text) throw new ApiError(400, "Add a title and a message.");
      const instIds = (Array.isArray(b.institutionIds) ? b.institutionIds : []).map(String);
      const classes = (Array.isArray(b.classes) ? b.classes : []).map(String);
      const insts = instIds.length ? (await db.getAll(...instIds.map((id) => db.collection("institutions").doc(id)))).filter((s) => s.exists).map((s) => ({ ...(s.data() as Institution), id: s.id })) : [];
      const users = await db.collection("users").select("name", "email", "category", "institution", "archived").get();
      const targets = users.docs.filter((d) => !d.get("archived")
        && (!insts.length || insts.some((i) => belongsTo(i, d.get("institution"))))
        && (!classes.length || classes.includes(String(d.get("category") || ""))));
      if (!targets.length) throw new ApiError(400, "No students match.");
      const link = typeof b.link === "string" && /^\/[A-Za-z0-9/_\-?=&.#]*$/.test(b.link) ? b.link : undefined;
      const ref = db.collection("institutionMessages").doc();
      const label = [insts.length ? insts.map((i) => i.name).join(", ") : "All students", classes.length ? classes.map(categoryLabel).join(", ") : ""].filter(Boolean).join(" · ");
      const m: InstitutionMessage = {
        id: ref.id, institutionId: ONEGRASP_SENDER, institutionName: "OneGrasp", kind: KINDS.includes(b.msgKind as MessageKind) ? (b.msgKind as MessageKind) : "message",
        title, body: text, ...(link ? { link } : {}), audience: { type: "students", label }, recipients: targets.map((d) => d.id), readBy: {},
        sentBy: email, sentByName: "OneGrasp", createdAt: now,
      };
      await ref.set(m);
      let emailed = 0;
      if (b.email) {
        emailed = await sendMessageEmails(targets.slice(0, 500).filter((d) => d.get("email")).map((d) => ({
          to: String(d.get("email")), institutionName: "OneGrasp", title, body: text.replace(/\{name\}/g, String(d.get("name") || "").split(" ")[0] || "there"), link,
        })));
        if (emailed) await ref.update({ emailed });
      }
      return NextResponse.json({ recipients: targets.length, emailed });
    }

    if (b.kind === "notice") {
      if (!title || !text) throw new ApiError(400, "Add a title and a message.");
      const ids = (Array.isArray(b.institutionIds) ? b.institutionIds : []).map(String);
      const ref = db.collection("portalNotices").doc();
      const n: PortalNotice = { id: ref.id, title, body: text, institutionIds: ids.length ? ids : ["all"], createdAt: now, createdBy: email, readBy: {} };
      await ref.set(n);
      return NextResponse.json({ notice: n });
    }

    if (b.kind === "support-reply") {
      const ref = db.collection("supportThreads").doc(String(b.threadId || ""));
      const snap = await ref.get();
      if (!snap.exists) throw new ApiError(404, "Conversation not found.");
      const msgs = (snap.get("messages") ?? []) as SupportThread["messages"];
      if (text) msgs.push({ from: "onegrasp", name: "OneGrasp", text, at: now });
      await ref.update({ messages: msgs, updatedAt: now, unreadForAdmin: false, ...(text ? { unreadForSchool: true } : {}), status: b.close ? "closed" : "open" });
      return NextResponse.json({ ok: true });
    }

    if (b.kind === "student-reply") {
      if (!text) throw new ApiError(400, "Write your answer.");
      const msg = await db.collection("institutionMessages").doc(String(b.messageId || "")).get();
      if (!msg.exists || msg.get("institutionId") !== ONEGRASP_SENDER || !(msg.get("recipients") as string[]).includes(String(b.studentUid))) throw new ApiError(404, "Message not found.");
      const user = await db.collection("users").doc(String(b.studentUid)).get();
      const ref = db.collection("messageReplies").doc();
      const r: MessageReply = {
        id: ref.id, messageId: msg.id, messageTitle: String(msg.get("title") || ""), institutionId: ONEGRASP_SENDER,
        studentUid: String(b.studentUid), studentName: String(user.get("name") || "Student"), from: "school", authorName: "OneGrasp",
        text, createdAt: now, seenBySchool: true, seenByStudent: false,
      };
      await ref.set(r);
      return NextResponse.json({ reply: r });
    }

    if (b.kind === "seen") {
      if (b.threadId) await db.collection("supportThreads").doc(String(b.threadId)).update({ unreadForAdmin: false }).catch(() => undefined);
      for (const id of (Array.isArray(b.replyIds) ? b.replyIds : []).map(String).slice(0, 200)) {
        await db.collection("messageReplies").doc(id).update({ seenBySchool: true }).catch(() => undefined);
      }
      return NextResponse.json({ ok: true });
    }

    throw new ApiError(400, "Unknown action.");
  } catch (e) {
    return fail(e);
  }
}
