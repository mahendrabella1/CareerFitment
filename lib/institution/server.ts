/**
 * Server-only helpers for the institution portal and its admin screens.
 *
 * Every route verifies the caller's Firebase ID token with the Admin SDK and
 * then decides what they may see:
 *   - requireAdmin: an email in lib/auth/admins.ts
 *   - requireInstitution: an active institutionAccounts/{uid} login, scoped
 *     to that one institution's students - a school can never read, message
 *     or even count another school's students.
 * Student data is read with the Admin SDK, so none of this depends on
 * Firestore security rules (the institution collections stay default-deny).
 */
import { NextResponse } from "next/server";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { getAdminAuth } from "@/lib/firebase/adminAuth";
import { isAdmin } from "@/lib/auth/admins";
import type { Institution, InstitutionAccount } from "@/lib/institution/types";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function fail(e: unknown) {
  if (e instanceof ApiError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error("[institution]", e instanceof Error ? e.message : e);
  return NextResponse.json({ error: "Something went wrong on the server. Please try again." }, { status: 500 });
}

export interface Caller { uid: string; email: string }

/** The signed-in caller, from the "Authorization: Bearer <ID token>" header. */
export async function caller(req: Request): Promise<Caller> {
  if (!isFirestoreConfigured()) {
    throw new ApiError(503, "This deployment has no Firebase admin credentials (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY).");
  }
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) throw new ApiError(401, "Please sign in.");
  try {
    const decoded = await (await getAdminAuth()).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email || "" };
  } catch {
    throw new ApiError(401, "Your session has expired - please sign in again.");
  }
}

export async function requireAdmin(req: Request): Promise<Caller & { db: Firestore }> {
  const c = await caller(req);
  if (!isAdmin(c.email)) throw new ApiError(403, "Only OneGrasp administrators can do this.");
  return { ...c, db: await getFirestore() };
}

export interface InstitutionContext {
  caller: Caller;
  account: InstitutionAccount;
  institution: Institution;
  db: Firestore;
}

export async function requireInstitution(req: Request): Promise<InstitutionContext> {
  const c = await caller(req);
  const db = await getFirestore();
  const accSnap = await db.collection("institutionAccounts").doc(c.uid).get();
  if (!accSnap.exists) throw new ApiError(403, "This login isn't an institution account.");
  const account = { ...(accSnap.data() as InstitutionAccount), uid: c.uid };
  if (!account.active) throw new ApiError(403, "This institution login has been switched off. Please contact OneGrasp.");
  const instSnap = await db.collection("institutions").doc(account.institutionId).get();
  if (!instSnap.exists) throw new ApiError(403, "This login's institution no longer exists. Please contact OneGrasp.");
  return { caller: c, account, institution: { ...(instSnap.data() as Institution), id: instSnap.id }, db };
}

/** Every spelling students' profiles use for this institution. */
export function institutionNames(inst: Pick<Institution, "name" | "aliases">): string[] {
  return [...new Set([inst.name, ...(inst.aliases ?? [])].map((s) => (s || "").trim()).filter(Boolean))];
}

/** The fields an institution's student list needs - not exam answers, not the full report. */
export const STUDENT_LIST_FIELDS = [
  "name", "email", "phone", "category", "city", "createdAt", "archived", "institution", "desiredCareer",
  "progress", "activity", "examSession.status",
  "latestAssessment.completedAt", "latestAssessment.customFields", "latestAssessment.matches",
  "latestAssessment.topCareer", "latestAssessment.overallFitmentPct", "latestAssessment.desiredCareer",
];

/** uid -> student document for everyone linked to this institution. */
export async function studentsOf(db: Firestore, inst: Institution, fields: string[] = STUDENT_LIST_FIELDS) {
  const names = institutionNames(inst);
  const out = new Map<string, Record<string, unknown>>();
  for (let i = 0; i < names.length; i += 30) {
    const snap = await db.collection("users").where("institution", "in", names.slice(i, i + 30)).select(...fields).get();
    snap.forEach((d) => out.set(d.id, d.data()));
  }
  return out;
}

/** The student's full document, only if they belong to this institution. */
export async function studentOf(db: Firestore, inst: Institution, uid: string) {
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(uid)) return null;
  const snap = await db.collection("users").doc(uid).get();
  const data = snap.data();
  if (!data || !institutionNames(inst).includes(String(data.institution || "").trim())) return null;
  return data;
}

/** Institution logins sign in with a username; Firebase Auth needs an email. */
export const INSTITUTION_EMAIL_DOMAIN = "institution.onegrasp.com";
export const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/;
export const usernameEmail = (username: string) => `${username.trim().toLowerCase()}@${INSTITUTION_EMAIL_DOMAIN}`;
