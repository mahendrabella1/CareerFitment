import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution } from "@/lib/institution/server";
import type { PortalNotice, SupportThread } from "@/lib/institution/types";

export const dynamic = "force-dynamic";

/**
 * /api/institution/support - the institution's line to OneGrasp.
 *
 * GET   { notices, threads } - OneGrasp's notices to this institution (or to
 *       all), and its support conversations
 * POST  { subject, text }      start a conversation with OneGrasp
 *       { threadId, text }     add to one
 *       { seenNotices: [id] }  mark notices read
 *       { seenThread: id }     mark OneGrasp's answers read
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const [own, all, threads] = await Promise.all([
      db.collection("portalNotices").where("institutionIds", "array-contains", institution.id).get(),
      db.collection("portalNotices").where("institutionIds", "array-contains", "all").get(),
      db.collection("supportThreads").where("institutionId", "==", institution.id).get(),
    ]);
    const notices = [...own.docs, ...all.docs].map((d) => ({ ...(d.data() as PortalNotice), id: d.id }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ readBy, institutionIds: _ids, ...n }) => ({ ...n, read: !!readBy?.[institution.id] }));
    return NextResponse.json({
      notices,
      threads: threads.docs.map((d) => ({ ...(d.data() as SupportThread), id: d.id })).sort((a, b) => b.updatedAt - a.updatedAt),
    });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db, viewAs } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { subject?: string; text?: string; threadId?: string; seenNotices?: unknown; seenThread?: string };
    if (Array.isArray(b.seenNotices)) {
      if (viewAs) return NextResponse.json({ ok: true }); // an admin looking doesn't mark it read for the school
      for (const id of b.seenNotices.map(String).slice(0, 50)) {
        await db.collection("portalNotices").doc(id).update({ [`readBy.${institution.id}`]: Date.now() }).catch(() => undefined);
      }
      return NextResponse.json({ ok: true });
    }
    if (b.seenThread) {
      const ref = db.collection("supportThreads").doc(b.seenThread);
      const snap = await ref.get();
      if (snap.exists && snap.get("institutionId") === institution.id && !viewAs) await ref.update({ unreadForSchool: false });
      return NextResponse.json({ ok: true });
    }
    const text = String(b.text ?? "").trim().slice(0, 2000);
    if (!text) throw new ApiError(400, "Write your message.");
    const entry = { from: "school" as const, name: account.displayName || institution.name, text, at: Date.now() };
    if (b.threadId) {
      const ref = db.collection("supportThreads").doc(b.threadId);
      const snap = await ref.get();
      if (!snap.exists || snap.get("institutionId") !== institution.id) throw new ApiError(404, "Conversation not found.");
      await ref.update({ messages: [...(snap.get("messages") ?? []), entry], updatedAt: entry.at, unreadForAdmin: true, status: "open" });
      return NextResponse.json({ ok: true });
    }
    const subject = String(b.subject ?? "").trim().slice(0, 120);
    if (!subject) throw new ApiError(400, "Add a subject.");
    const ref = db.collection("supportThreads").doc();
    const thread: SupportThread = {
      id: ref.id, institutionId: institution.id, institutionName: institution.name, subject, status: "open",
      createdAt: entry.at, updatedAt: entry.at, messages: [entry], unreadForAdmin: true, unreadForSchool: false,
    };
    await ref.set(thread);
    return NextResponse.json({ thread });
  } catch (e) {
    return fail(e);
  }
}
