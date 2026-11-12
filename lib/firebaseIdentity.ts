// Resolve the caller's email from their Firebase ID token, using the public
// Auth REST API rather than the Admin SDK - the payment routes run on
// deployments that may have no admin credentials at all, and an email address
// is only ever used here to label a CRM lead / notification. Never throws:
// a lookup failure returns "" so a mail or CRM side-effect can degrade to the
// details the client passed instead of failing the payment.

// Public Firebase web API key (safe to expose - it identifies the project, it
// does not authorise anything on its own). From the environment, with the
// project's existing public value as the fallback so nothing breaks.
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA3fUy9CkpoNf-vjrhswJQNwqy0qSr2cL0";

export async function emailFromToken(idToken?: string): Promise<string> {
  if (!idToken) return "";
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) }
    );
    const data = (await res.json()) as { users?: { email?: string; localId?: string }[] };
    return data?.users?.[0]?.email || "";
  } catch {
    return "";
  }
}

/** Same lookup, but returns the uid (and whether the email is verified) too. */
export async function identityFromToken(idToken?: string): Promise<{ email: string; uid: string; emailVerified: boolean }> {
  if (!idToken) return { email: "", uid: "", emailVerified: false };
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) }
    );
    const data = (await res.json()) as { users?: { email?: string; localId?: string; emailVerified?: boolean }[] };
    const u = data?.users?.[0];
    return { email: u?.email || "", uid: u?.localId || "", emailVerified: u?.emailVerified === true };
  } catch {
    return { email: "", uid: "", emailVerified: false };
  }
}
