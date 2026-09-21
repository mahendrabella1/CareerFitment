import { NextResponse } from "next/server";
import { isFirestoreConfigured, getFirestore } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

// A code's format, shared with the redeem route — uppercase letters, digits
// and dashes only. Rejecting anything else before it reaches Firestore means
// a stray "/" in a mistyped code can't be read as a nested document path.
const CODE_RE = /^[A-Z0-9-]{4,32}$/;

/**
 * GET /api/institutional/check?code=... — public, unauthenticated: this runs
 * before the student has an account, purely so /register can show "your fee
 * is covered by {school}" before they fill in the form. Returns ONLY whether
 * the code is currently valid and the school's name — never contact details,
 * never usedCount/maxStudents (those would leak how close a school is to its
 * cap to anyone who can view page source).
 *
 * A "no" here is advisory, not authoritative — the real, race-safe check
 * happens again inside the transaction in /api/institutional/redeem at
 * signup time. This route exists only to make the banner honest, not to
 * gate anything.
 */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code")?.trim().toUpperCase() || "";
  if (!CODE_RE.test(code)) return NextResponse.json({ valid: false });
  if (!isFirestoreConfigured()) return NextResponse.json({ valid: false });

  try {
    const db = await getFirestore();
    const snap = await db.collection("institutional_links").doc(code).get();
    if (!snap.exists) return NextResponse.json({ valid: false });
    const link = snap.data() as {
      schoolName?: string; status?: string; expiresAt?: string | null;
      maxStudents?: number | null; usedCount?: number;
    };
    const notExpired = !link.expiresAt || Date.now() < Date.parse(link.expiresAt);
    const underCap = link.maxStudents == null || (link.usedCount || 0) < link.maxStudents;
    const valid = link.status === "active" && notExpired && underCap;
    return NextResponse.json(valid ? { valid: true, schoolName: link.schoolName || "" } : { valid: false });
  } catch (e) {
    console.error("[institutional] check failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ valid: false });
  }
}
