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
  // An admin opening an institution's portal ("Open portal" on /admin/institutions).
  let viewAs = "";
  try { viewAs = path.startsWith("/api/institution/") ? sessionStorage.getItem(VIEW_KEY) ?? "" : ""; } catch { /* storage blocked */ }
  const send = async (fresh: boolean) => fetch(path, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}), ...(init.headers ?? {}),
      Authorization: `Bearer ${await user.getIdToken(fresh)}`,
      ...(viewAs ? { "X-View-Institution": viewAs } : {}),
    },
  });
  let res = await send(false);
  // A rejected sign-in token gets one retry with a freshly issued one.
  if (res.status === 401) res = await send(true);
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

/** sessionStorage key: the institution an admin is viewing the portal as. */
export const VIEW_KEY = "og.viewInstitution";

/** Institution logins sign in with a username; Firebase Auth needs an email
 *  (kept in step with lib/institution/server.ts). A full email is used as is. */
export function institutionLoginEmail(username: string): string {
  const u = username.trim().toLowerCase();
  return u.includes("@") ? u : `${u}@institution.onegrasp.com`;
}
