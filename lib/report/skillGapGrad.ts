/**
 * Cluster-level skill gap for Graduates. Compares a student's stored skill
 * evidence against an estimated cluster target. Targets are rule-derived from
 * the cluster's existing signature (a skill a cluster emphasises gets 4, every
 * other measured skill gets 3), not authored norms, and the UI labels them as
 * estimates. Skills this test does not measure get no level and no target.
 */
import {
  MEASURED_SKILLS, MEASURED_SKILL_LABELS, type MeasuredSkillKey, type SkillEvidenceGrad,
} from "@/lib/newAssessment/skillEvidenceGrad";
import { CLUSTER_SIGNATURE } from "@/lib/report/clusterSignatureGrad";

// Digital literacy, AI readiness and data literacy are now measured by the
// 8-pillar bank (Pillar 6). Hands-on tool skills still aren't.
export const UNMEASURED_SKILLS = [
  "Python / programming",
  "Hands-on data analysis tools (Excel, SQL)",
  "Presentation delivery",
] as const;

const BASELINE_TARGET = 3;
const EMPHASIS_TARGET = 4;

export function targetsForCluster(cluster: string): Record<MeasuredSkillKey, number> {
  const sig = CLUSTER_SIGNATURE[cluster];
  const strength = (name: string) => !!sig?.strengths.includes(name);
  const mi = (name: string) => !!sig?.mi.includes(name);
  const motivator = (name: string) => !!sig?.motivators.includes(name);
  const emphasis: Record<MeasuredSkillKey, boolean> = {
    leadership: strength("Influence & Leadership") || motivator("Leadership"),
    strategic: strength("Strategic & Futuristic"),
    analytical: strength("Intellectual & Analytical") || mi("Logical-Mathematical"),
    communication: mi("Linguistic"),
    relationships: strength("Relationship & Adaptability") || mi("Interpersonal"),
    emotional: mi("Intrapersonal") || strength("Relationship & Adaptability"),
    creativity: strength("Creative & Innovative") || motivator("Creativity") || mi("Spatial"),
    execution: strength("Execution & Achievement") || motivator("Achievement"),
    learning: motivator("Learning"),
    ownership: strength("Execution & Achievement") || motivator("Leadership"),
    // Every field now expects working digital skills, so digital literacy keeps
    // the baseline; AI and data literacy are emphasised for investigative and
    // analysis-heavy clusters.
    digital: false,
    ai: !!sig?.riasec.includes("I"),
    data: strength("Intellectual & Analytical"),
  };
  return Object.fromEntries(
    MEASURED_SKILLS.map((key) => [key, emphasis[key] ? EMPHASIS_TARGET : BASELINE_TARGET])
  ) as Record<MeasuredSkillKey, number>;
}

export type GapStatus = "strength" | "build" | "develop";

export interface MeasuredGapRow {
  kind: "measured";
  key: MeasuredSkillKey;
  label: string;
  level: number;
  target: number;
  gap: number;
  status: GapStatus;
  basis: string;
}

export interface UnmeasuredGapRow {
  kind: "unmeasured";
  label: string;
}

export interface SkillGapResult {
  rows: (MeasuredGapRow | UnmeasuredGapRow)[];
  counts: Record<GapStatus, number> & { notAssessed: number };
}

const STATUS_ORDER: Record<GapStatus, number> = { develop: 0, build: 1, strength: 2 };

export function computeSkillGap(evidence: SkillEvidenceGrad | undefined, cluster: string): SkillGapResult | null {
  if (!evidence) return null;
  const targets = targetsForCluster(cluster);
  const measured: MeasuredGapRow[] = [];
  for (const key of MEASURED_SKILLS) {
    const entry = evidence[key];
    if (!entry) continue;
    const target = targets[key];
    const gap = target - entry.level;
    const status: GapStatus = gap >= 2 ? "develop" : gap === 1 ? "build" : "strength";
    measured.push({ kind: "measured", key, label: MEASURED_SKILL_LABELS[key], level: entry.level, target, gap, status, basis: entry.basis });
  }
  measured.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.gap - a.gap);
  const unmeasured: UnmeasuredGapRow[] = UNMEASURED_SKILLS.map((label) => ({ kind: "unmeasured", label }));
  const count = (s: GapStatus) => measured.filter((r) => r.status === s).length;
  return {
    rows: [...measured, ...unmeasured],
    counts: { develop: count("develop"), build: count("build"), strength: count("strength"), notAssessed: unmeasured.length },
  };
}
