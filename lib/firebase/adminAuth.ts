import { createSign } from "crypto";
import { serviceAccount } from "@/lib/firebase/admin";
import { identityFromToken } from "@/lib/firebaseIdentity";

/**
 * Firebase Authentication administration (server only), over Google's REST
 * APIs rather than `firebase-admin/auth`: that module cannot load on Vercel -
 * its jwks-rsa dependency require()s the ES-module-only `jose`, which the
 * Node runtime there refuses. (Firestore via firebase-admin is unaffected.)
 *
 * - verifySignIn: checks a user's ID token with Google's account lookup -
 *   the same check the payment routes use (lib/firebaseIdentity.ts).
 * - createAuthUser / updateAuthUser / deleteAuthUser: Identity Toolkit admin
 *   calls, authorised with an access token signed by the service account.
 */

const IDENTITY_TOOLKIT = "https://identitytoolkit.googleapis.com/v1";
const SCOPES = "https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/cloud-platform";

export class AuthAdminError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// ---------------------------------------------------------------- sign-in check

const verified = new Map<string, { uid: string; email: string; until: number }>();

function tokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as { exp?: number };
    return (payload.exp ?? 0) * 1000;
  } catch {
    return 0;
  }
}

/** The account an ID token belongs to, or null when it isn't valid. A
 *  verified token is remembered (until it expires, at most 5 minutes) so a
 *  page's several calls don't each repeat the lookup. */
export async function verifySignIn(token: string): Promise<{ uid: string; email: string } | null> {
  const now = Date.now();
  const hit = verified.get(token);
  if (hit && hit.until > now) return { uid: hit.uid, email: hit.email };
  const id = await identityFromToken(token);
  if (!id.uid) return null;
  if (verified.size > 1000) verified.clear();
  verified.set(token, { ...id, until: Math.min(tokenExpiry(token) || now, now + 5 * 60 * 1000) });
  return id;
}

// ---------------------------------------------------------------- admin calls

let cached: { token: string; until: number } | null = null;

/** An OAuth access token for the service account (JWT bearer grant). */
async function accessToken(): Promise<string> {
  if (cached && cached.until > Date.now() + 60_000) return cached.token;
  const sa = serviceAccount();
  if (!sa) throw new AuthAdminError("auth/no-credentials", "This deployment has no Firebase admin credentials.");
  const now = Math.floor(Date.now() / 1000);
  const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({ iss: sa.clientEmail, scope: SCOPES, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.privateKey).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new AuthAdminError("auth/credential", `Google rejected the service account (${data.error_description || data.error || res.status}).`);
  }
  cached = { token: data.access_token, until: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

function codeFor(message: string): string {
  if (message.startsWith("EMAIL_EXISTS") || message.startsWith("DUPLICATE_EMAIL")) return "auth/email-already-exists";
  if (message.startsWith("WEAK_PASSWORD") || message.startsWith("INVALID_PASSWORD")) return "auth/invalid-password";
  if (message.startsWith("USER_NOT_FOUND")) return "auth/user-not-found";
  return "auth/internal";
}

async function call(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const sa = serviceAccount();
  if (!sa) throw new AuthAdminError("auth/no-credentials", "This deployment has no Firebase admin credentials.");
  const res = await fetch(`${IDENTITY_TOOLKIT}/projects/${sa.projectId}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string } };
  if (!res.ok) {
    const message = data.error?.message || `HTTP ${res.status}`;
    throw new AuthAdminError(codeFor(message), message);
  }
  return data;
}

/** Creates an email/password account; returns its uid. */
export async function createAuthUser(u: { email: string; password: string; displayName: string }): Promise<string> {
  const data = await call("accounts", { email: u.email, password: u.password, displayName: u.displayName });
  const uid = String(data.localId ?? "");
  if (!uid) throw new AuthAdminError("auth/internal", "Firebase did not return the new account's id.");
  return uid;
}

/** Changes the password and/or switches the account off or on. `signOut`
 *  ends every existing session (they must sign in again). */
export async function updateAuthUser(uid: string, patch: { password?: string; disabled?: boolean; signOut?: boolean }): Promise<void> {
  await call("accounts:update", {
    localId: uid,
    ...(patch.password ? { password: patch.password } : {}),
    ...(patch.disabled !== undefined ? { disableUser: patch.disabled } : {}),
    ...(patch.signOut ? { validSince: String(Math.floor(Date.now() / 1000)) } : {}),
  });
}

export async function deleteAuthUser(uid: string): Promise<void> {
  await call("accounts:delete", { localId: uid });
}
