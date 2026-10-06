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
 * POST  { ids } - mark read; { clicked: id } - they followed its button;
 *       { applied: id } - they applied to the opportunity it announced.
 *       Only messages addressed to them are touched.
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
    }));
    return NextResponse.json({ messages, unread: messages.filter((m) => !m.read).length });
  } catch (e) {
    return fail(e);
  }
}

const ID = /^[A-Za-z0-9]{10,40}$/;

export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as { ids?: unknown; clicked?: unknown; applied?: unknown };
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
