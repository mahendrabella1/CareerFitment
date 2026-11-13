import { NextResponse } from "next/server";
import { ApiError, fail, requireAdmin } from "@/lib/institution/server";
import { STATUSES, type RequestStatus } from "@/lib/enquiries/forms";

export const dynamic = "force-dynamic";

/** Where each kind of request is kept. Spotlight requests come from the
 *  dashboard (lib/boosters/server.ts); the other two from public forms. */
const SOURCES = { spotlight: "boosterRequests", school: "schoolEnquiries", privacy: "privacyRequests" } as const;
type Kind = keyof typeof SOURCES;
const isKind = (k: unknown): k is Kind => typeof k === "string" && k in SOURCES;

/**
 * GET /api/admin/requests?kind=spotlight|school|privacy - the latest 300,
 * newest first (admins only). PATCH {kind, id, status, note} - set the status
 * and an internal note. Records are never deleted here.
 */
export async function GET(req: Request) {
  try {
    const { db } = await requireAdmin(req);
    const kind = new URL(req.url).searchParams.get("kind");
    if (!isKind(kind)) throw new ApiError(400, "Unknown kind.");
    const snap = await db.collection(SOURCES[kind]).orderBy("at", "desc").limit(300).get();
    const items = snap.docs.map((d) => ({ ...(d.data() as Record<string, unknown>), id: d.id }));
    const counts: Record<string, number> = {};
    for (const k of Object.keys(SOURCES) as Kind[]) {
      const c = await db.collection(SOURCES[k]).where("status", "==", "new").count().get();
      counts[k] = c.data().count;
    }
    return NextResponse.json({ items, counts });
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const { db, uid } = await requireAdmin(req);
    const body = (await req.json().catch(() => ({}))) as { kind?: unknown; id?: unknown; status?: unknown; note?: unknown };
    if (!isKind(body.kind)) throw new ApiError(400, "Unknown kind.");
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!/^[A-Z]{2}-[A-Z0-9]{4,12}$/.test(id)) throw new ApiError(400, "Unknown request.");
    const update: Record<string, unknown> = { updatedAt: Date.now(), updatedBy: uid };
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status as RequestStatus)) throw new ApiError(400, "Unknown status.");
      update.status = body.status;
    }
    if (body.note !== undefined) update.note = String(body.note).slice(0, 1000);
    const ref = db.collection(SOURCES[body.kind]).doc(id);
    if (!(await ref.get()).exists) throw new ApiError(404, "Request not found.");
    await ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
