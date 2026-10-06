import { NextResponse } from "next/server";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { ApiError, fail, institutionForStudent } from "@/lib/institution/server";
import { categoryLabel } from "@/lib/auth/formOptions";
import type { Milestone } from "@/lib/institution/passport";

export const dynamic = "force-dynamic";

/**
 * GET /api/passport/[id] - a student's public Career Passport (linked from
 * its QR code): first name and initial, class, institution, best-fit areas
 * and ONLY institution-verified milestones. No contact details.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    if (!isFirestoreConfigured()) throw new ApiError(503, "This service isn't available right now.");
    if (!/^[A-Za-z0-9_-]{8,40}$/.test(params.id)) throw new ApiError(404, "Passport not found.");
    const db = await getFirestore();
    const p = await db.collection("passports").doc(params.id).get();
    if (!p.exists) throw new ApiError(404, "Passport not found.");
    const uid = String(p.get("uid"));
    const [user, snap] = await Promise.all([
      db.collection("users").doc(uid).get(),
      db.collection("milestones").where("uid", "==", uid).where("status", "==", "verified").get(),
    ]);
    const parts = String(user.get("name") || "Student").trim().split(/\s+/);
    const a = user.get("latestAssessment") as { customFields?: { name: string }[]; matches?: { title: string }[] } | undefined;
    const fits = (a?.customFields?.length ? a.customFields.map((f) => f.name) : (a?.matches ?? []).map((m) => m.title)).slice(0, 3);
    const inst = await institutionForStudent(db, user.get("institution"));
    const milestones = snap.docs.map((d) => d.data() as Milestone).sort((x, y) => y.date.localeCompare(x.date))
      .map((m) => ({ title: m.title, kind: m.kind, date: m.date, evidenceUrl: m.evidenceUrl, verifiedBy: m.reviewedBy ?? "", verifiedAt: m.reviewedAt ?? null }));
    return NextResponse.json({
      name: parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0],
      className: user.get("category") ? categoryLabel(String(user.get("category"))) : "",
      institution: inst?.name ?? String(user.get("institution") || ""),
      fits, milestones,
    });
  } catch (e) {
    return fail(e);
  }
}
