import type { Auth } from "firebase-admin/auth";
import { getFirestore } from "@/lib/firebase/admin";

/**
 * Firebase Admin Auth (server only) - verifying ID tokens and creating or
 * updating accounts on someone else's behalf (institution logins). Uses the
 * same credentials as lib/firebase/admin.ts; callers must guard with
 * isFirestoreConfigured() first.
 */
export async function getAdminAuth(): Promise<Auth> {
  await getFirestore(); // initialises the Admin app if this is the first call
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth();
}
