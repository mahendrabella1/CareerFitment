/**
 * Server-only: who is making this request. Reads "Authorization: Bearer <Firebase
 * ID token>" and checks it with Google's account lookup (verifySignIn - the same
 * check every signed-in route uses, cached per token for up to 5 minutes). It
 * needs no Firebase admin credentials, so routes that send mail can use it even
 * on a deployment without them.
 */
import { verifySignIn } from "@/lib/firebase/adminAuth";

export function bearerToken(req: Request): string {
  const header = req.headers.get("authorization") || "";
  return /^Bearer\s+/i.test(header) ? header.replace(/^Bearer\s+/i, "").trim() : "";
}

/** The verified caller, or null when there's no token or it isn't valid. */
export async function bearerIdentity(req: Request): Promise<{ uid: string; email: string } | null> {
  const token = bearerToken(req);
  if (!token || token.length > 4096) return null;
  try {
    const id = await verifySignIn(token);
    return id?.uid ? id : null;
  } catch {
    return null;
  }
}
