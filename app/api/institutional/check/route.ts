import { NextResponse } from "next/server";
import { isFirestoreConfigured, getFirestore } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

// A code's format, shared with the redeem route - uppercase letters, digits
// and dashes only. Rejecting anything else before it reaches Firestore means
// a stray "/" in a mistyped code can't be read as a nested document path.
const CODE_RE = /^[A-Z0-9-]{4,32}$/;

/**
 * GET /api/institutional/check?code=... - public, unauthenticated: this runs
 * before the student has an account. /register uses it to decide whether to
 * show the registration form at all for a ?ref= link - an invalid link
 * BLOCKS entry entirely (with a reason-specific message) rather than letting
 * the student fill in a form that was never going to waive their fee.
 * Returns ONLY the school's name and, when invalid, why - never contact
 * details, never usedCount/maxStudents (those would leak how close a school
 * is to its cap to anyone who can view page source).
 *
 * A "no" here is advisory, not authoritative - the real, race-safe check
 * happens again inside the transaction in /api/institutional/redeem at
 * signup time, for the rare case a link is deactivated in the few seconds
 * between this check and the student submitting the form.
 */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code")?.trim().toUpperCase() || "";
  if (!CODE_RE.test(code)) return NextResponse.json({ valid: false, reason: "not_found" });
  if (!isFirestoreConfigured()) return NextResponse.json({ valid: false, reason: "not_found" });

  try {
    const db = await getFirestore();
    const snap = await db.collection("institutional_links").doc(code).get();
    if (!snap.exists) return NextResponse.json({ valid: false, reason: "not_found" });
    const link = snap.data() as {
      schoolName?: string; status?: string; expiresAt?: string | null;
      maxStudents?: number | null; usedCount?: number;
    };
    const schoolName = link.schoolName || "";
    if (link.status !== "active") return NextResponse.json({ valid: false, reason: "inactive", schoolName });
    if (link.expiresAt && Date.now() >= Date.parse(link.expiresAt)) return NextResponse.json({ valid: false, reason: "expired", schoolName });
    if (link.maxStudents != null && (link.usedCount || 0) >= link.maxStudents) return NextResponse.json({ valid: false, reason: "full", schoolName });
    return NextResponse.json({ valid: true, schoolName });
  } catch (e) {
    console.error("[institutional] check failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ valid: false, reason: "not_found" });
  }
}
