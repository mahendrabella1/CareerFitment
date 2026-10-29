import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { certCourse } from "@/lib/certificates/catalog";
import { issueCertificate, NotFinished } from "@/lib/certificates/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/certificates { course } - the signed-in student's certificate for
 * a course they have finished (issued once, then the same one every time).
 * 409 with { done, total } while the course isn't finished yet.
 */
export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as { course?: string };
    const key = String(body.course ?? "");
    if (!certCourse(key)) throw new ApiError(400, "Unknown course.");
    const db = await getFirestore();
    try {
      return NextResponse.json({ certificate: await issueCertificate(db, uid, key) });
    } catch (e) {
      if (e instanceof NotFinished) return NextResponse.json({ error: e.message, done: e.done, total: e.total }, { status: 409 });
      throw e;
    }
  } catch (e) {
    return fail(e);
  }
}
