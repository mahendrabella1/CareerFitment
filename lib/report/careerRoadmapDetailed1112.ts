// Real, individually-researched in-depth roadmaps for a growing subset of
// CAREERS_1112 (50 so far, out of 332) - school stream through abroad
// options, sourced from data/class-11-12/career-roadmaps-detailed.json.
// Keyed by the exact CAREERS_1112 `name` so careerFit1112Sheets.tsx can
// join on selector.career.name directly. Every other career (no entry
// here yet) keeps falling back to the generic 16-cluster CLUSTER_ROADMAPS
// in clusterRoadmaps1112.ts - this file only ever ADDS detail, never
// removes the fallback.
import raw from "@/data/class-11-12/career-roadmaps-detailed.json";

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

export const CAREER_ROADMAPS_DETAILED: Record<string, DetailedCareerRoadmap> = raw as Record<string, DetailedCareerRoadmap>;

export function detailedRoadmapFor(careerName: string | undefined | null): DetailedCareerRoadmap | null {
  if (!careerName) return null;
  return CAREER_ROADMAPS_DETAILED[careerName] ?? null;
}
