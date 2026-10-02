"use client";

/**
 * Firestore read/write for Research & Conferences - same client-SDK,
 * flat-top-level-collection pattern as lib/startups/clientProgress.ts and
 * lib/money/clientProgress.ts (see the comment there for why: this app has
 * no server-side Firestore auth check anywhere, identity + access control
 * come from the client's signed-in session plus Firestore security rules).
 * Steps and sources are stored as plain arrays INSIDE the project doc
 * (bounded, small, always <=8 steps and typically <20 sources) rather than
 * as separate subcollections - abstracts get their own top-level
 * collection instead, because the Mentor Review Queue needs to query
 * "every submitted abstract across every learner", which a field buried
 * inside each learner's own project doc can't support.
 */
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Level, PlanStep } from "@/lib/research/plan";
import type { RubricScores } from "@/lib/research/rubric";

const PROJECTS = "researchProjects";
const ABSTRACTS = "researchAbstracts";
const STUDIO_NOTES = "researchStudioNotes";

/** One reflection/task note per learner per Studio unit - overwritten on
 *  resave (unlike the project's abstract, a Unit task isn't versioned
 *  work product, just the learner's own working notes). */
export async function saveStudioNote(uid: string, unitSlug: string, text: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, STUDIO_NOTES, `${uid}_${unitSlug}`), { uid, unitSlug, text, updatedAt: serverTimestamp() }, { merge: true });
}
export async function fetchStudioNote(uid: string, unitSlug: string): Promise<string> {
  const db = getDb();
  if (!db) return "";
  const snap = await getDoc(doc(db, STUDIO_NOTES, `${uid}_${unitSlug}`));
  return snap.exists() ? ((snap.data() as { text: string }).text ?? "") : "";
}

export interface Source { title: string; url: string; authors: string; year: string; note: string }

export interface ResearchProject {
  id: string;
  uid: string;
  conferenceTitle: string;
  conferenceOrganiser: string;
  conferenceUrl: string;
  startsAt: number; // ms epoch
  abstractDeadline: number;
  level: Level | "ATTENDEE";
  question: string;
  status: "active" | "presented" | "dropped";
  steps: (Omit<PlanStep, "dueAt"> & { dueAt: number; status: "TODO" | "DONE" })[];
  sources: Source[];
  createdAt?: unknown;
}

export async function createProject(uid: string, data: Omit<ResearchProject, "id" | "uid" | "sources" | "createdAt">): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Firestore not configured");
  const ref = await addDoc(collection(db, PROJECTS), { ...data, uid, sources: [], createdAt: serverTimestamp() });
  return ref.id;
}

export async function fetchProjects(uid: string): Promise<ResearchProject[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, PROJECTS), where("uid", "==", uid)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ResearchProject, "id">) }));
}

export async function fetchProject(id: string): Promise<ResearchProject | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, PROJECTS, id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as Omit<ResearchProject, "id">) } : null;
}

export async function markStepDone(projectId: string, stepOrder: number): Promise<void> {
  const db = getDb();
  if (!db) return;
  const project = await fetchProject(projectId);
  if (!project) return;
  const steps = project.steps.map((s) => (s.order === stepOrder ? { ...s, status: "DONE" as const } : s));
  await updateDoc(doc(db, PROJECTS, projectId), { steps });
}

export async function addSource(projectId: string, source: Source): Promise<void> {
  const db = getDb();
  if (!db) return;
  const project = await fetchProject(projectId);
  if (!project) return;
  await updateDoc(doc(db, PROJECTS, projectId), { sources: [...project.sources, source] });
}

export interface AbstractVersion {
  id: string;
  projectId: string;
  uid: string;
  version: number;
  text: string;
  wordCount: number;
  status: "draft" | "submitted" | "reviewed";
  review: { scores: RubricScores; comments: string; approved: boolean; reviewedAt: number } | null;
  createdAt?: unknown;
}

export async function saveAbstractDraft(projectId: string, uid: string, text: string, priorVersions: number): Promise<void> {
  const db = getDb();
  if (!db) return;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  await addDoc(collection(db, ABSTRACTS), { projectId, uid, version: priorVersions + 1, text, wordCount, status: "draft", review: null, createdAt: serverTimestamp() });
}

export async function submitAbstract(abstractId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, ABSTRACTS, abstractId), { status: "submitted" });
}

export async function fetchAbstracts(projectId: string): Promise<AbstractVersion[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, ABSTRACTS), where("projectId", "==", projectId), orderBy("version", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AbstractVersion, "id">) }));
}

/** Mentor Review Queue (Phase 1: gated behind the existing admin allowlist
 *  - this app has no dedicated mentor-invite system yet, see the comment
 *  on the /account/research/mentor page for why admins stand in for
 *  mentors in this phase). */
export async function fetchPendingReviews(): Promise<AbstractVersion[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, ABSTRACTS), where("status", "==", "submitted")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AbstractVersion, "id">) }));
}

export async function submitReview(abstractId: string, scores: RubricScores, comments: string, approved: boolean): Promise<void> {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, ABSTRACTS, abstractId), {
    status: "reviewed",
    review: { scores, comments, approved, reviewedAt: Timestamp.now().toMillis() },
  });
}
