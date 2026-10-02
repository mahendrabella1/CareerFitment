/**
 * The Graduates (UG) generic, cluster-wide 7-section roadmap - the analog
 * of clusterRoadmaps1112.ts's CLUSTER_ROADMAPS, restructured into the
 * user's own requested 7-item shape (yearly skill-building, govt/private
 * internships, paid certifications, job roles, PG in India, study abroad,
 * career advancement/PhD) rather than 11-12's 5-phase "I AM HERE...I CAN
 * GROW INTO" shape.
 *
 * Content in data/graduates/cluster-roadmaps.json is a SYNTHESIS, not
 * primary research the way 11-12's 308 career-specific roadmaps were: job
 * roles / PG programmes / PhD programmes / entrance exams / emerging areas
 * are pulled directly from the two verified Excel sources (no fabrication),
 * while yearly skill-building / internship-sector / certification /
 * study-abroad guidance is authored per-cluster from the cluster's own real
 * role list plus ordinary, well-established domain knowledge - flagged for
 * review rather than presented as dedicated research.
 *
 * `emergingAreas` is real data straight from Master_Classified's own
 * "Type" = "Emerging (2023-26)" tag (142 entries across the source
 * workbook) - specific current courses (AI & Data Science, EV Technology,
 * Cyber Security & IoT, Fintech, etc.) with their real associated roles,
 * not a generic "AI is important" note. Empty for clusters the source data
 * doesn't tag any emerging courses under (Sports, Supply Chain, Travel,
 * Defence, Personal Care) - left empty rather than inventing one.
 */
import raw from "@/data/graduates/cluster-roadmaps.json";

export interface GradYearFocus {
  year: string;
  focus: string;
  // Added alongside the per-cluster skill-gap engine work (see
  // skillGapGrad.ts) - splits each year's single `focus` sentence into
  // concrete, checkable skill items a learner can mark off, the same way
  // yearlySkillBuilding's top-level technical/nonTechnical strings already
  // summarised the whole degree. Optional because the 18th cluster
  // ("Personal Care, Beauty & Wellness") wasn't enriched in this pass.
  technicalSkills?: string[];
  nonTechnicalSkills?: string[];
}
export interface GradEmergingArea {
  course: string;
  roles: string[];
}
export interface GradCertification {
  name: string;
  cost: "Free" | "Paid" | "Freemium";
}
// Real, well-known, long-running national scholarship schemes only (per
// explicit instruction) - no cluster-specific fabrication, and
// `universityType` names a real, verifiable grouping/tier (e.g. "TU9
// technical universities", "Russell Group") rather than claiming a
// specific best-fit institution we have no authority to recommend.
export interface GradAbroadDestination {
  country: string;
  universityType: string;
  scholarship: string;
}
export interface GradClusterRoadmap {
  yearlySkillBuilding: { technical: string; nonTechnical: string; years: GradYearFocus[] };
  internships: { government: string; private: string };
  certifications: string | GradCertification[];
  jobRoles: string[];
  pgInIndia: { programmes: string[]; entranceExams: string[]; note: string | null; scholarships?: string[]; topInstitutions?: string[] };
  studyAbroad: string | GradAbroadDestination[];
  // Defence, Security & Emergency Services: most countries restrict defence/
  // security-service entry to their own citizens, so studyAbroad is an
  // empty array there - this note explains why rather than leaving a
  // silently empty section.
  studyAbroadNote?: string;
  careerAdvancement: { phdProgrammes: string[]; phdRoles: string[]; note: string | null };
  emergingAreas: GradEmergingArea[];
}

export const CLUSTER_ROADMAPS_GRAD: Record<string, GradClusterRoadmap> = raw as Record<string, GradClusterRoadmap>;

export function clusterRoadmapGradFor(cluster: string | undefined | null): GradClusterRoadmap | null {
  if (!cluster) return null;
  return CLUSTER_ROADMAPS_GRAD[cluster] ?? null;
}
