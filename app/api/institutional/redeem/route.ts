import { NextResponse } from "next/server";
import { isFirestoreConfigured, getFirestore } from "@/lib/firebase/admin";
import { identityFromToken } from "@/lib/firebaseIdentity";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const CODE_RE = /^[A-Z0-9-]{4,32}$/;

/**
 * POST /api/institutional/redeem — { code, idToken }.
 *
 * Called by /register right after a normal signup already succeeded (the
 * student's Firebase Auth account and `users/{uid}` doc — with paid:false —
 * already exist by the time this runs; register() itself is unchanged). This
 * is an EXTRA step layered on top, not a replacement: if it fails, the
 * account still exists and the student just falls through to the normal
 * PaymentGate, same as anyone else.
 *
 * All validation happens INSIDE the Firestore transaction, not before it —
 * checking first and writing after would leave a window where two students
 * redeeming the same near-full link at once could both pass the check and
 * both get in, overrunning maxStudents. Firestore retries the whole callback
 * if the link doc changes before commit, so this is race-safe as written.
 *
 * The final `paid: true` write goes straight through the Admin SDK inside
 * this same transaction — unlike the client-side markPaid() pattern the
 * coupon-redeem flow uses (trusted only because the server verified the
 * waiver first), this write needs no Firestore rule trust at all, since the
 * Admin SDK bypasses rules entirely.
 */
export async function POST(req: Request) {
  let body: { code?: unknown; idToken?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const code = String(body.code ?? "").trim().toUpperCase();
  if (!CODE_RE.test(code)) {
    return NextResponse.json({ success: false, reason: "not_found", message: "That link code isn't valid." }, { status: 400 });
  }

  const { uid } = await identityFromToken(typeof body.idToken === "string" ? body.idToken : undefined);
  if (!uid) {
    return NextResponse.json({ success: false, reason: "unauthenticated", message: "Couldn't verify your account." }, { status: 401 });
  }

  if (!isFirestoreConfigured()) {
    return NextResponse.json({ success: false, reason: "not_configured", message: "This deployment can't verify institutional links right now." }, { status: 503 });
  }

  try {
    const db = await getFirestore();
    const { FieldValue } = await import("firebase-admin/firestore");
    const linkRef = db.collection("institutional_links").doc(code);
    const userRef = db.collection("users").doc(uid);

    let schoolName = "";
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(linkRef); // all reads before any writes
      if (!snap.exists) throw new Error("not_found");
      const link = snap.data() as {
        schoolName?: string; status?: string; expiresAt?: string | null;
        maxStudents?: number | null; usedCount?: number;
      };
      if (link.status !== "active") throw new Error("inactive");
      if (link.expiresAt && Date.now() >= Date.parse(link.expiresAt)) throw new Error("expired");
      if (link.maxStudents != null && (link.usedCount || 0) >= link.maxStudents) throw new Error("full");

      schoolName = link.schoolName || "";
      tx.update(linkRef, { usedCount: FieldValue.increment(1) });
      tx.set(
        userRef,
        {
          paid: true,
          paymentStatus: "paid",
          paidAt: new Date().toISOString(),
          paymentId: `INSTITUTIONAL-${code}`,
          institutionalLinkCode: code,
          institution: schoolName,
          amountPaid: 0,
        },
        { merge: true }
      );
    });

    return NextResponse.json({ success: true, schoolName });
  } catch (e) {
    const reason = e instanceof Error ? e.message : "unknown";
    const messages: Record<string, string> = {
      not_found: "That link code isn't valid.",
      inactive: "This registration link has been switched off.",
      expired: "This registration link has expired.",
      full: "This registration link has reached its student limit.",
    };
    const message = messages[reason] || "That link could not be applied.";
    if (!(reason in messages)) console.error("[institutional] redeem failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, reason, message }, { status: 400 });
  }
}
