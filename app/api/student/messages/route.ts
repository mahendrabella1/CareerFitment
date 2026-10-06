import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import type { InstitutionMessage, StudentInboxMessage } from "@/lib/institution/types";

export const dynamic = "force-dynamic";

/**
 * /api/student/messages - the signed-in student's inbox of messages from
 * their school or college (sent from the institution portal).
 *
 * GET   their 30 newest messages, "{name}" filled with their first name
 * POST  { ids } - mark those messages read (only ones addressed to them)
 */
export async function GET(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const [snap, user] = await Promise.all([
      db.collection("institutionMessages").where("recipients", "array-contains", uid).get(),
      db.collection("users").doc(uid).get(),
    ]);
    const first = String(user.get("name") || "").trim().split(" ")[0] || "there";
    const messages: StudentInboxMessage[] = snap.docs
      .map((d) => ({ ...(d.data() as InstitutionMessage), id: d.id }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 30)
      .map((m) => ({
        id: m.id, kind: m.kind, title: m.title, body: m.body.replace(/\{name\}/g, first),
        ...(m.link ? { link: m.link } : {}),
        from: m.institutionName, createdAt: m.createdAt, read: !!m.readBy?.[uid],
      }));
    return NextResponse.json({ messages, unread: messages.filter((m) => !m.read).length });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as { ids?: unknown };
    const ids = (Array.isArray(body.ids) ? body.ids : []).map(String).filter((s) => /^[A-Za-z0-9]{10,40}$/.test(s)).slice(0, 50);
    if (!ids.length) throw new ApiError(400, "No messages given.");
    const db = await getFirestore();
    const now = Date.now();
    await Promise.all(ids.map(async (id) => {
      const ref = db.collection("institutionMessages").doc(id);
      const snap = await ref.get();
      const recipients = snap.get("recipients") as string[] | undefined;
      if (snap.exists && recipients?.includes(uid) && !snap.get(`readBy.${uid}`)) {
        await ref.update({ [`readBy.${uid}`]: now });
      }
    }));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
