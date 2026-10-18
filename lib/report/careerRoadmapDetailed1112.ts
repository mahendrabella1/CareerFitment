// Real, individually-researched in-depth roadmaps for a growing subset of
// CAREERS_1112 (50 so far, out of 332) - school stream through abroad
// options, sourced from data/class-11-12/career-roadmaps-detailed.json.
// Keyed by the exact CAREERS_1112 `name` so careerFit1112Sheets.tsx can
// join on selector.career.name directly. Every other career (no entry
// here yet) keeps falling back to the generic 16-cluster CLUSTER_ROADMAPS
// in clusterRoadmaps1112.ts - this file only ever ADDS detail, never
// removes the fallback.
//
// The file is ~3 MB, so it is NOT bundled into the dashboard: it loads on
// demand (loadDetailedRoadmaps), only for the reports that use it (Class
// 11-12 and Graduates). Pages that build those reports wait for it with
// useDetailedRoadmapsReady (useDetailedRoadmaps.ts) before calling the sheet
// builders, which then look roadmaps up synchronously as before.

export interface YearFocus {
  year: string;
  focus: string;
}
export interface DetailedCareerRoadmap {
  tagline: string | null;
  school: string[];
  ugPathways: string[];
  topColleges: string[];
  scholarships: string[];
  ugDevelopment: { years: YearFocus[]; notes: string[] };
  internships: string[];
  afterUgPathways: string[];
  pgSpecialization: string[];
  jobOptions: string[];
  skills: string[];
  abroadEducation: string[];
  abroadJobs: string[];
  careerProgression: string[];
  completeRoadmap: string[];
  keyDistinction: string | null;
  disclaimer: string | null;
}

let roadmaps: Record<string, DetailedCareerRoadmap> | null = null;
let pending: Promise<void> | null = null;

/** Fetches the roadmaps once (a separate chunk); later calls reuse it. */
export function loadDetailedRoadmaps(): Promise<void> {
  pending ??= import("@/data/class-11-12/career-roadmaps-detailed.json")
    .then((m) => { roadmaps = ((m as { default?: unknown }).default ?? m) as Record<string, DetailedCareerRoadmap>; })
    .catch((e) => { pending = null; throw e; });
  return pending;
}

export const detailedRoadmapsLoaded = () => roadmaps !== null;

/** The roadmap for a career - null when it has none, or before loadDetailedRoadmaps() finished. */
export function detailedRoadmapFor(careerName: string | undefined | null): DetailedCareerRoadmap | null {
  if (!careerName || !roadmaps) return null;
  return roadmaps[careerName] ?? null;
}
