"use client";

import { getFirebaseAuth } from "@/lib/firebase/client";

/**
 * Calls one of the server routes (app/api/institution, app/api/admin/
 * institutions, app/api/student/messages) as the signed-in user - the route
 * verifies the ID token and decides what they may see. Throws the route's own
 * error message on failure.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error("Please sign in.");
  const token = await user.getIdToken();
  const res = await fetch(path, {
    ...init,
    headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...(init.headers ?? {}), Authorization: `Bearer ${token}` },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

/** Institution logins sign in with a username; Firebase Auth needs an email
 *  (kept in step with lib/institution/server.ts). A full email is used as is. */
export function institutionLoginEmail(username: string): string {
  const u = username.trim().toLowerCase();
  return u.includes("@") ? u : `${u}@institution.onegrasp.com`;
}
