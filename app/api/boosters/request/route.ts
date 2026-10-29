import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { cleanRequest, fileProblem, type FormId } from "@/lib/boosters/catalog";
import { emailRequest, saveRequest } from "@/lib/boosters/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/**
 * POST /api/boosters/request (multipart: form, data = JSON of the fields,
 * optional file) - a Spotlight request. Saved first, then emailed to
 * support@onegrasp.com; answers { id, emailed }.
 */
export async function POST(req: Request) {
  try {
    const { uid, email } = await caller(req);
    const body = await req.formData().catch(() => null);
    if (!body) throw new ApiError(400, "The form didn't arrive - please try again.");
    const formId = String(body.get("form") ?? "");
    let raw: Record<string, unknown> = {};
    try { raw = JSON.parse(String(body.get("data") ?? "{}")); } catch { /* checked below */ }
    const clean = cleanRequest(formId, raw);
    if (!clean.ok) throw new ApiError(400, clean.error);

    const f = body.get("file");
    let file: { filename: string; content: Buffer; contentType: string } | null = null;
    if (f && typeof f !== "string" && f.size > 0) {
      const problem = fileProblem(f.name, f.size);
      if (problem) throw new ApiError(400, problem);
      const ext = f.name.toLowerCase().match(/\.[a-z0-9]+$/)![0];
      file = { filename: f.name.replace(/[^\w.\- ()]+/g, "_").slice(-120), content: Buffer.from(await f.arrayBuffer()), contentType: TYPES[ext] };
    }

    const db = await getFirestore();
    const saved = await saveRequest(db, uid, email, formId as FormId, clean.data, file ? { name: file.filename, size: file.content.length } : null);
    const emailed = await emailRequest(saved, file);
    if (emailed) await db.collection("boosterRequests").doc(saved.id).update({ emailed: true }).catch(() => undefined);
    return NextResponse.json({ id: saved.id, emailed });
  } catch (e) {
    return fail(e);
  }
}
