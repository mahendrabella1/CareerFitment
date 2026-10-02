/**
 * The Graduates (UG) "2026-2046 Career Horizon" - an ADDITIONAL report
 * section appended after the 7-section Career Selector roadmap (see
 * careerFitGradSheets.tsx), not a replacement for it. Covers 4 long-range
 * time horizons x 5 skill layers per CAREER_CLUSTERS_18 cluster (18 keys,
 * matching careerClustersGrad.ts exactly).
 *
 * Authored at CLUSTER grain, not per-role: there is no defensible way to
 * write non-fabricated 20-year-outlook content for 3,447 individual job
 * titles, the same reasoning already applied to clusterRoadmapsGrad.ts's
 * content. Seeded from real, already-reviewed cluster data
 * (flagshipRoadmapsGrad.ts's technicalSkillsChecklist/nonTechnicalSkills/
 * careerFamilies for 17/18 clusters, clusterRoadmapsGrad.ts's
 * yearlySkillBuilding as the fallback seed for "Personal Care, Beauty &
 * Wellness") via a template-driven generator script (scratchpad, not
 * committed - same precedent as this session's enrich_clusters.js), then
 * human-reviewed before being committed as data/graduates/career-horizons.json.
 * Flagged as directional synthesis, not primary research - see
 * CAREER_HORIZON_GUIDANCE_NOTE, which every rendering of this section must
 * show.
 */
import raw from "@/data/graduates/career-horizons.json";

export type HorizonId = "2026-2030" | "2030-2035" | "2035-2040" | "2040-2046";

export interface HorizonSkillLayers {
  foundationalHuman: string;
  digital: string;
  ai: string;
  domain: string;
  strategic: string;
}

export interface CareerHorizonPhase {
  id: HorizonId;
  label: string;
  theme: string;
  /** The framing question this horizon answers - "What can I enter now?",
   *  "How should I specialize?", etc. Pure framing, not a claim about the
   *  student, so safe to show as-is. */
  assessmentQuestion: string;
  outlook: string;
  skills: HorizonSkillLayers;
}

export interface ClusterCareerHorizon {
  cluster: string;
  phases: CareerHorizonPhase[];
}

export const CAREER_HORIZONS_GRAD: Record<string, ClusterCareerHorizon> = raw as Record<string, ClusterCareerHorizon>;

export function careerHorizonForCluster(cluster: string | undefined | null): ClusterCareerHorizon | null {
  if (!cluster) return null;
  return CAREER_HORIZONS_GRAD[cluster] ?? null;
}

export const HORIZON_PHASE_META: { id: HorizonId; label: string; theme: string; icon: string }[] = [
  { id: "2026-2030", label: "2026-2030", theme: "Entry", icon: "route" },
  { id: "2030-2035", label: "2030-2035", theme: "Specialisation", icon: "star" },
  { id: "2035-2040", label: "2035-2040", theme: "Career Evolution", icon: "compass" },
  { id: "2040-2046", label: "2040-2046", theme: "Long-Term Adaptability", icon: "score" },
];

// Standard, well-established terms for what each skill layer covers - real,
// current industry/education vocabulary (not fabricated, not scored against
// the student - see CareerHorizonSectionGrad's header comment on why these
// are shown as reference examples only, never as measured skill levels).
export const SKILL_LAYER_META: { key: keyof HorizonSkillLayers; label: string; examples: string[] }[] = [
  { key: "foundationalHuman", label: "Foundational Human Skills", examples: ["Communication", "Critical thinking", "Collaboration", "Creativity", "Emotional intelligence"] },
  { key: "digital", label: "Digital Skills", examples: ["Digital literacy", "Data literacy", "Digital collaboration tools", "Cybersecurity awareness"] },
  { key: "ai", label: "AI Skills", examples: ["AI literacy", "Prompting", "AI-assisted workflows", "Verification of AI output", "Human-AI collaboration"] },
  { key: "domain", label: "Domain Skills", examples: ["The specific technical core of this field - what it actually takes to do the job"] },
  { key: "strategic", label: "Strategic Skills", examples: ["Systems thinking", "Leadership", "Innovation", "Entrepreneurship", "Decision-making"] },
];

// Shown once per rendering of this section (not duplicated per-cluster in
// the JSON) - the explicit "directional, not certain fact" framing that
// every 2040-2046-reaching claim in this file needs, since nobody can
// verify what the job market will actually look like that far out.
export const CAREER_HORIZON_GUIDANCE_NOTE =
  "This section is directional, forward-looking guidance based on current, well-established trends (continuous upskilling, growing AI/automation literacy, deepening specialisation) - not a verified prediction of exactly what 2040-2046 will look like. Use it to decide what to keep building, not as a fixed roadmap.";
