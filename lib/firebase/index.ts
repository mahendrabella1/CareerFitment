/**
 * Convenience session helper for the career-counselling dashboard module.
 * Reads the currently signed-in Firebase user from the existing web client.
 */
import { getFirebaseAuth } from "@/lib/firebase/client";

export type Session = { name?: string; email?: string; uid?: string };

export function getSession(): Session | null {
  const u = getFirebaseAuth()?.currentUser;
  if (!u) return null;
  return { name: u.displayName || undefined, email: u.email || undefined, uid: u.uid };
}
