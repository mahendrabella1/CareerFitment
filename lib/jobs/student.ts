"use client";

/**
 * The signed-in student's side of the job portal: which careers are "on their
 * path" (from their own report), and their saved / applied tracker, stored on
 * their own Firestore document (users/{uid}.jobs - student-writable, like gps).
 */
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { UserProfile } from "@/lib/auth/AuthProvider";
import type { JobListItem, TrackStatus, TrackedJob } from "./types";

export const TRACK_STATUSES: { id: TrackStatus; label: string }[] = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "closed", label: "Closed" },
];

export const normCareer = (s: string) => s.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();

/** Careers the student chose or their report ranks highest - the "path". */
export function pathCareers(profile: UserProfile | null): string[] {
  if (!profile) return [];
  const a = profile.latestAssessment;
  const out = [profile.desiredCareer, a?.desiredCareer, a?.topCareer];
  for (const m of a?.matches?.slice(0, 6) ?? []) out.push(m.title, ...(m.roles ?? []).slice(0, 4));
  const seen = new Set<string>();
  return out.filter((c): c is string => typeof c === "string" && Boolean(c.trim())).filter((c) => {
    const k = normCareer(c);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 20);
}

export function isOnPath(job: Pick<JobListItem, "role_match">, careers: string[]): boolean {
  if (!job.role_match) return false;
  const r = normCareer(job.role_match);
  return careers.some((c) => normCareer(c) === r);
}

export async function loadTracker(uid: string): Promise<Record<string, TrackedJob>> {
  const db = getDb();
  if (!db) return {};
  const snap = await getDoc(doc(db, "users", uid));
  const jobs = snap.get("jobs");
  return jobs && typeof jobs === "object" ? (jobs as Record<string, TrackedJob>) : {};
}

export async function saveTracked(uid: string, jobId: string, entry: TrackedJob | null): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Not connected");
  await updateDoc(doc(db, "users", uid), { [`jobs.${jobId}`]: entry ?? deleteField() });
}
