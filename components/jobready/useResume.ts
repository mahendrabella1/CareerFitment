"use client";
/**
 * The student's resume, shared by the builder, the plan and "Jobs for you":
 * loaded once (the newer of the account copy and this browser's copy, else a
 * fresh one from the profile) and saved to this browser at once and to
 * users/{uid}.resume two seconds after the last change. Also the small
 * per-student notes the journey keeps in this browser.
 */
import { useCallback, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getDb } from "@/lib/firebase/client";
import { scopedKey } from "@/lib/progress/userStorage";
import { categoryLabel } from "@/lib/auth/formOptions";
import { emptyResume, normalise, stageOf, type Resume } from "@/lib/resume/resume";

const KEY = "onegrasp.resume.v1";

export function useResume() {
  const { profile, user, loading } = useAuth();
  const stage = stageOf(profile?.category);
  const [r, setR] = useState<Resume | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "local">("idle");

  useEffect(() => {
    if (r || loading || (user && !profile)) return;
    const base = profile ? emptyResume({
      name: profile.name, email: profile.email, phone: profile.phone, city: profile.city, institution: profile.institution,
      desiredCareer: profile.desiredCareer, classLabel: stageOf(profile.category) === "school" ? categoryLabel(profile.category) : "",
    }) : emptyResume();
    let local: unknown = null;
    try { local = JSON.parse(localStorage.getItem(scopedKey(KEY)) || "null"); } catch { /* storage blocked */ }
    const saved = (profile as unknown as { resume?: Resume } | null)?.resume;
    const pick = [saved, local as Resume | null].filter(Boolean).sort((a, b) => (b!.updatedAt || 0) - (a!.updatedAt || 0))[0];
    setR(pick ? normalise(pick, base) : base);
  }, [profile, user, loading, r]);

  useEffect(() => {
    if (!r || !r.updatedAt) return;
    const clean = JSON.parse(JSON.stringify(r)) as Resume;
    try { localStorage.setItem(scopedKey(KEY), JSON.stringify(clean)); } catch { /* storage blocked */ }
    setStatus("saving");
    const t = window.setTimeout(async () => {
      const db = getDb();
      if (!db || !user) { setStatus("local"); return; }
      try { await updateDoc(doc(db, "users", user.uid), { resume: clean }); setStatus("saved"); } catch { setStatus("local"); }
    }, 2000);
    return () => window.clearTimeout(t);
  }, [r, user]);

  const set = useCallback((fn: (x: Resume) => Resume) => setR((x) => (x ? { ...fn(x), updatedAt: Date.now() } : x)), []);
  return { r, set, stage, status, profile, user };
}

export { addSkills } from "@/lib/resume/resume";

/* ---- small per-student notes kept in this browser ---- */

const read = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(scopedKey(k)) || "null") ?? d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(scopedKey(k), JSON.stringify(v)); } catch { /* storage blocked */ } };

export interface Review { id: string; q: string; total: number; at: number }
export const loadReviews = () => read<Review[]>("onegrasp.interview.reviews.v1", []);
export const addReview = (x: Review) => write("onegrasp.interview.reviews.v1", [x, ...loadReviews()].slice(0, 50));
export const loadPractised = () => new Set(read<string[]>("onegrasp.interview.practised.v1", []));

/** A job handed to the builder's "Match a job" tab (from "Jobs for you"). */
export interface JobHandoff { title: string; company: string; jd: string }
export const handJob = (j: JobHandoff) => { try { sessionStorage.setItem("onegrasp.resume.job", JSON.stringify(j)); } catch { /* storage blocked */ } };
export const takeJob = (): JobHandoff | null => {
  try { const v = sessionStorage.getItem("onegrasp.resume.job"); sessionStorage.removeItem("onegrasp.resume.job"); return v ? (JSON.parse(v) as JobHandoff) : null; } catch { return null; }
};

/** Role questions generated for the student, kept for the mock interview. */
export interface RoleQuestion { q: string; how: string }
export const loadRoleQuestions = () => read<{ target: string; questions: RoleQuestion[] } | null>("onegrasp.interview.role.v1", null);
export const saveRoleQuestions = (v: { target: string; questions: RoleQuestion[] }) => write("onegrasp.interview.role.v1", v);
