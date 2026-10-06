import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, studentsOf } from "@/lib/institution/server";
import { categoryLabel } from "@/lib/auth/formOptions";
import { sendMessageEmails } from "@/lib/institution/messageEmail";
import type { InstitutionMessage, MessageAudience, MessageKind } from "@/lib/institution/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KINDS: MessageKind[] = ["message", "reminder", "alert", "recommendation"];
const EMAIL_CAP = 500;

/**
 * /api/institution/messages
 *
 * GET   the caller institution's sent messages, newest first, with how many
 *       recipients have opened each
 * POST  { kind, title, body, link?, audience: { type: "all" | "classes" |
 *       "students", classes?, uids?, label? }, email? } - recipients are
 *       resolved HERE from the institution's own students, so a message can
 *       only ever reach that institution's students, whatever uids are sent.
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const snap = await db.collection("institutionMessages").where("institutionId", "==", institution.id).get();
    const messages = snap.docs
      .map((d) => ({ ...(d.data() as InstitutionMessage), id: d.id }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 200)
      .map(({ recipients, readBy, ...m }) => ({ ...m, recipientCount: recipients.length, readCount: Object.keys(readBy ?? {}).length }));
    return NextResponse.json({ messages });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db } = await requireInstitution(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const kind = KINDS.includes(body.kind as MessageKind) ? (body.kind as MessageKind) : "message";
    const title = String(body.title ?? "").trim().slice(0, 120);
    const text = String(body.body ?? "").trim().slice(0, 2000);
    const link = typeof body.link === "string" && /^\/[A-Za-z0-9/_\-?=&.#]*$/.test(body.link) ? body.link : undefined;
    if (!title) throw new ApiError(400, "Add a title.");
    if (!text) throw new ApiError(400, "Write the message.");

    const a = (body.audience ?? {}) as { type?: string; classes?: unknown; uids?: unknown; label?: unknown };
    const docs = await studentsOf(db, institution, ["name", "email", "category", "archived"]);
    const eligible = [...docs.entries()].filter(([, d]) => !d.archived);
    let recipients: string[];
    let audience: MessageAudience;
    if (a.type === "classes") {
      const classes = (Array.isArray(a.classes) ? a.classes : []).map(String).slice(0, 20);
      if (!classes.length) throw new ApiError(400, "Pick at least one class.");
      recipients = eligible.filter(([, d]) => classes.includes(String(d.category || ""))).map(([uid]) => uid);
      audience = { type: "classes", classes, label: classes.map(categoryLabel).join(", ") };
    } else if (a.type === "students") {
      const wanted = new Set((Array.isArray(a.uids) ? a.uids : []).map(String));
      recipients = eligible.filter(([uid]) => wanted.has(uid)).map(([uid]) => uid);
      const label = String(a.label ?? "").trim().slice(0, 120);
      audience = { type: "students", label: label || `${recipients.length} selected student${recipients.length === 1 ? "" : "s"}` };
    } else {
      recipients = eligible.map(([uid]) => uid);
      audience = { type: "all", label: "All students" };
    }
    if (!recipients.length) throw new ApiError(400, "No students match that audience.");

    const ref = db.collection("institutionMessages").doc();
    const message: InstitutionMessage = {
      id: ref.id, institutionId: institution.id, institutionName: institution.name,
      kind, title, body: text, ...(link ? { link } : {}),
      audience, recipients, readBy: {},
      sentBy: account.uid, sentByName: account.displayName || institution.name,
      createdAt: Date.now(),
    };
    await ref.set(message);

    let emailed = 0;
    if (body.email) {
      const emails = recipients.slice(0, EMAIL_CAP).map((uid) => docs.get(uid)).filter((d) => d && d.email).map((d) => ({
        to: String(d!.email),
        institutionName: institution.name,
        title,
        body: text.replace(/\{name\}/g, String(d!.name || "").split(" ")[0] || "there"),
        link,
      }));
      emailed = await sendMessageEmails(emails);
      if (emailed) await ref.update({ emailed });
    }
    return NextResponse.json({ id: ref.id, recipients: recipients.length, emailed, emailRequested: !!body.email });
  } catch (e) {
    return fail(e);
  }
}
