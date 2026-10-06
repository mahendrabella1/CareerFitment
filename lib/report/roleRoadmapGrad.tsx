"use client";

/**
 * Role-specific roadmaps for the Graduates (UG) Career Selector, built from
 * the Word files by scripts/build-ug-role-roadmaps.py into
 * public/roadmaps/ug/. Nothing here is bundled into the report: the small
 * index and the one roadmap a student needs are fetched only when that
 * student's chosen career has one, so the set can grow to thousands.
 *
 * When a role has several versions (e.g. Project Engineer written for
 * Electrical and for Mechanical), the one whose stated degree/course best
 * matches the student's own is used. If the role has no roadmap, or loading
 * fails, the caller's existing roadmap (`fallback`) is shown instead.
 */
import { useEffect, useState, type ReactNode } from "react";

export interface RoleRoadmapCell { text: string; url?: string }
export type RoleRoadmapBlock =
  | { type: "p"; text: string; url?: string }
  | { type: "h"; text: string }
  | { type: "note"; label: string; text: string }
  | { type: "list"; items: { text: string; url?: string }[] }
  /** A progression ("A → B → C") or, with sep "+", a skill stack. */
  | { type: "flow"; items: string[]; sep?: "+"; label?: string }
  | { type: "table"; header: string[]; rows: RoleRoadmapCell[][] };
export interface RoleRoadmapSection {
  heading: string;
  /** build, internships, certifications, careers, pg_india, abroad, growth, horizons or other */
  kind: string;
  blocks: RoleRoadmapBlock[];
}
export interface RoleRoadmap {
  title: string;
  role: string;
  summary: string;
  facts: Record<string, string>;
  about: { label: string; text: string }[];
  /** Guidance written among the facts (e.g. the usual progression). */
  intro?: RoleRoadmapBlock[];
  horizons: { period: string; question: string; output: string }[];
  sections: RoleRoadmapSection[];
}

/** Per version: the degree/course it states it was written for, and the
 *  wider text around it (career cluster, route notes, opening lines). */
export interface RoadmapVersion { for: string; about: string; level?: DegreeLevel }
export type DegreeLevel = "ug" | "pg" | "doctoral";

/** Same rule as degree_level() in scripts/build-ug-role-roadmaps.py. */
export function degreeLevel(s: string): DegreeLevel {
  if (/ph\.?\s?d\b|\bd\.\s?sc\b|d\.\s?litt|\bdba\b|doctorate|post-?doctoral|doctoral/i.test(s)) return "doctoral";
  if (/\b(m\.\s?(tech|e|sc|a|com|phil|pharm|des|arch|ed|s)\b|mba\b|pgdm|master|post-?graduate)/i.test(s)) return "pg";
  return "ug";
}
interface RoadmapIndex { roles: Record<string, string[]>; versions: Record<string, RoadmapVersion> }

const BASE = "/roadmaps/ug";
let indexPromise: Promise<RoadmapIndex | null> | null = null;
function loadIndex(): Promise<RoadmapIndex | null> {
  indexPromise ??= fetch(`${BASE}/index.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return indexPromise;
}

// Words that say nothing about which course a version was written for.
const GENERIC = new Set(["and", "the", "for", "with", "bachelor", "technology", "engineering", "tech", "b.tech", "b.e", "degree", "of", "in"]);
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !GENERIC.has(w)));
const phrase = (s: string) => ` ${s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim()} `;
const hits = (a: Set<string>, b: Set<string>) => [...a].filter((w) => b.has(w)).length;

/** The version best matching the student's course, among those written for
 *  the student's own degree level (a Ph.D. plan starts at Ph.D. Year 1, so
 *  it is never offered to an undergraduate) - null when there is none.
 *  The student's exact course named in what a version was written for wins
 *  outright; then course words found there (x3), course words in the wider
 *  text, and degree words. The first version on a tie. */
export function pickVersion(slugs: string[], versions: Record<string, RoadmapVersion>, degree: string, course: string): string | null {
  const level = degreeLevel(`${degree} ${course}`);
  const candidates = slugs.filter((s) => (versions[s]?.level ?? "ug") === level);
  if (!candidates.length) return null;
  const courseWords = words(course);
  const degreeWords = words(degree);
  let best = candidates[0];
  let bestScore = -1;
  for (const slug of candidates) {
    const v = versions[slug] ?? { for: "", about: "" };
    const forWords = words(v.for);
    const score = (course.trim() && phrase(v.for).includes(phrase(course)) ? 10 : 0)
      + 3 * hits(courseWords, forWords) + hits(courseWords, words(v.about)) + hits(degreeWords, forWords);
    if (score > bestScore) { best = slug; bestScore = score; }
  }
  return best;
}

type State = { status: "loading" } | { status: "none" } | { status: "ready"; roadmap: RoleRoadmap };

export function RoleRoadmapSwitch({ role, degree, course, found, fallback }: {
  role: string | undefined;
  degree: string;
  course: string;
  /** Renders a loaded roadmap (the caller supplies the report's look). */
  found: (roadmap: RoleRoadmap) => ReactNode;
  /** What to show when this role has no roadmap of its own. */
  fallback: ReactNode;
}) {
  const [state, setState] = useState<State>(role ? { status: "loading" } : { status: "none" });

  useEffect(() => {
    if (!role) { setState({ status: "none" }); return; }
    let live = true;
    setState({ status: "loading" });
    loadIndex()
      .then(async (index) => {
        const slugs = index?.roles[role];
        if (!index || !slugs?.length) return null;
        const slug = pickVersion(slugs, index.versions, degree, course);
        if (!slug) return null;
        const res = await fetch(`${BASE}/${slug}.json`);
        return res.ok ? ((await res.json()) as RoleRoadmap) : null;
      })
      .catch(() => null)
      .then((roadmap) => { if (live) setState(roadmap ? { status: "ready", roadmap } : { status: "none" }); });
    return () => { live = false; };
  }, [role, degree, course]);

  if (state.status === "ready") return <>{found(state.roadmap)}</>;
  if (state.status === "loading") {
    return <div style={{ marginTop: 20, padding: "28px 16px", textAlign: "center", fontSize: 13, color: "var(--muted, #64748b)" }}>Loading your career roadmap…</div>;
  }
  return <>{fallback}</>;
}
