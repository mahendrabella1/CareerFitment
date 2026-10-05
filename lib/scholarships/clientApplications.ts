"use client";

/**
 * Firestore read/write for scholarship applications and sent-alert dedup -
 * same pattern as lib/exams/clientFollow.ts.
 */
import { collection, doc, getDoc, getDocs, setDoc, query, where, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

const APPLICATIONS = "scholarshipApplications";
const ALERTS_SENT = "scholarshipAlertsSent";

export type ApplicationStatus = "not_started" | "in_progress" | "submitted" | "verification_pending" | "selected" | "rejected";

export interface ScholarshipChecklist {
  eligibilityConfirmed: boolean;
  documentsAttached: boolean;
  essayFinal: boolean;
  instituteVerificationRequested: boolean;
  submitted: boolean;
  /** Interview or test preparation, for schemes that have one. */
  interviewPrep?: boolean;
}

export interface ScholarshipApplication {
  scholarshipSlug: string;
  status: ApplicationStatus;
  checklist: ScholarshipChecklist;
  /** Amount awarded per year, entered by the learner once selected. */
  amountWonInr?: number;
  /** When the learner expects the next payment (YYYY-MM-DD). */
  expectedPaymentOn?: string;
  /** Total actually received so far, entered by the learner. */
  receivedInr?: number;
  receivedOn?: string;
  updatedAt?: unknown;
}

const EMPTY_CHECKLIST: ScholarshipChecklist = {
  eligibilityConfirmed: false, documentsAttached: false, essayFinal: false, instituteVerificationRequested: false, submitted: false, interviewPrep: false,
};

export async function fetchApplications(uid: string): Promise<Record<string, ScholarshipApplication>> {
  const db = getDb();
  if (!db) return {};
  const snap = await getDocs(query(collection(db, APPLICATIONS), where("uid", "==", uid)));
  const out: Record<string, ScholarshipApplication> = {};
  snap.forEach((d) => {
    const data = d.data() as ScholarshipApplication & { uid: string };
    out[data.scholarshipSlug] = data;
  });
  return out;
}

export async function saveApplication(uid: string, scholarshipSlug: string, patch: Partial<ScholarshipApplication>): Promise<void> {
  const db = getDb();
  if (!db) return;
  const id = `${uid}_${scholarshipSlug}`;
  const existing = await getDoc(doc(db, APPLICATIONS, id));
  const current = existing.exists() ? (existing.data() as ScholarshipApplication) : { scholarshipSlug, status: "not_started" as ApplicationStatus, checklist: EMPTY_CHECKLIST };
  await setDoc(doc(db, APPLICATIONS, id), {
    uid, scholarshipSlug,
    status: patch.status ?? current.status,
    checklist: { ...current.checklist, ...(patch.checklist ?? {}) },
    amountWonInr: patch.amountWonInr ?? current.amountWonInr ?? null,
    expectedPaymentOn: patch.expectedPaymentOn ?? current.expectedPaymentOn ?? null,
    receivedInr: patch.receivedInr ?? current.receivedInr ?? null,
    receivedOn: patch.receivedOn ?? current.receivedOn ?? null,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function fetchAlertsSentKeys(uid: string): Promise<Set<string>> {
  const db = getDb();
  if (!db) return new Set();
  const snap = await getDocs(query(collection(db, ALERTS_SENT), where("uid", "==", uid)));
  return new Set(snap.docs.map((d) => {
    const data = d.data() as { scholarshipSlug: string; eventKind: string };
    return `${data.scholarshipSlug}:${data.eventKind}`;
  }));
}

export async function recordAlertSent(uid: string, scholarshipSlug: string, eventKind: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, ALERTS_SENT, `${uid}_${scholarshipSlug}_${eventKind}`), { uid, scholarshipSlug, eventKind, sentAt: serverTimestamp() });
}
