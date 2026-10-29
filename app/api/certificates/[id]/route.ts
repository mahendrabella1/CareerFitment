import { NextResponse } from "next/server";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { ApiError, fail } from "@/lib/institution/server";
import { readCertificate } from "@/lib/certificates/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/certificates/[id] - one certificate as issued (name, class, course,
 * date). Public, like the certificate's own page: the id is the proof, and
 * nothing else about the student is returned.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    if (!isFirestoreConfigured()) throw new ApiError(503, "Certificates can't be checked right now.");
    const cert = await readCertificate(await getFirestore(), params.id);
    if (!cert) throw new ApiError(404, "Certificate not found.");
    return NextResponse.json({ certificate: cert });
  } catch (e) {
    return fail(e);
  }
}
