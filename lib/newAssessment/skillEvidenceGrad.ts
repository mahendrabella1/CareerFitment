/**
 * Graduates (UG) skill evidence - the measured skill levels a student's
 * answers actually support, derived once at submit time from the computed
 * 8-pillar profile and stored with the report. Raw per-question answers are
 * never stored, so this is the only per-skill record that survives.
 *
 * A skill appears only when a real question set measures it. Hands-on
 * programming, hands-on data-analysis tools and presentation delivery are not
 * tested, so they are absent here and shown as "not assessed" by the
 * skill-gap page.
 */
import type { PsychometricProfileGrad } from "@/lib/newAssessment/scoringGrad";

export const MEASURED_SKILLS = [
  "leadership", "strategic", "analytical", "communication", "relationships",
  "emotional", "creativity", "execution", "learning", "ownership",
  "digital", "ai", "data",
] as const;
export type MeasuredSkillKey = (typeof MEASURED_SKILLS)[number];

export const MEASURED_SKILL_LABELS: Record<MeasuredSkillKey, string> = {
  leadership: "Leadership",
  strategic: "Strategic thinking",
  analytical: "Analytical & critical thinking",
  communication: "Communication",
  relationships: "Teamwork & relationships",
  emotional: "Emotional intelligence",
  creativity: "Creativity & innovation",
  execution: "Execution & follow-through",
  learning: "Learning agility",
  ownership: "Resilience under setbacks",
  digital: "Digital literacy",
  ai: "AI readiness",
  data: "Data literacy",
};

export interface SkillEvidenceEntry {
  level: number; // 1-5
  basis: string;
}
export type SkillEvidenceGrad = Partial<Record<MeasuredSkillKey, SkillEvidenceEntry>>;

const clampLevel = (pct: number) => Math.min(5, Math.max(1, Math.round(1 + pct / 25)));

function average(values: (number | null | undefined)[]): number | null {
  const present = values.filter((v): v is number => typeof v === "number");
  return present.length ? present.reduce((s, v) => s + v, 0) / present.length : null;
}

export function deriveSkillEvidence(layer1: PsychometricProfileGrad): SkillEvidenceGrad {
  const strength = (name: string) => layer1.strengthDomains.find((d) => d.domain === name)?.score;
  const sub = (pillar: string, name: string) => {
    const s = layer1.pillars.find((p) => p.key === pillar)?.subDimensions.find((d) => d.name === name);
    return s && s.score !== null && s.answered > 0 ? s.score : null;
  };
  const apt = (name: string) => {
    const s = layer1.aptitude.subdomains.find((d) => d.name === name);
    return s && s.total ? s.score : null;
  };
  const ei = layer1.emotionalIntelligence;
  const HUMAN = "ug_human_professional_skills";
  const DIGITAL = "ug_digital_future_skills";

  const sources: Record<MeasuredSkillKey, { label: string; value: number | null | undefined }[]> = {
    leadership: [
      { label: "Leadership scenarios", value: sub(HUMAN, "Leadership") },
      { label: "Influence & Leadership", value: strength("Influence & Leadership") },
    ],
    strategic: [{ label: "Strategic & Futuristic", value: strength("Strategic & Futuristic") }],
    analytical: [
      { label: "Logical reasoning", value: apt("Logical Reasoning") },
      { label: "Analytical reasoning", value: apt("Analytical Reasoning") },
      { label: "Numerical reasoning", value: apt("Numerical Reasoning") },
      { label: "Problem solving", value: apt("Problem Solving") },
    ],
    communication: [{ label: "Communication scenarios", value: sub(HUMAN, "Communication") }],
    relationships: [
      { label: "Teamwork scenarios", value: sub(HUMAN, "Teamwork") },
      { label: "Relationship & Adaptability", value: strength("Relationship & Adaptability") },
    ],
    emotional: [{
      label: "Emotional intelligence scenarios",
      value: ei ? ((ei.selfAwareness + ei.selfManagement + ei.socialAwareness + ei.relationshipManagement) / 4) * 100 : null,
    }],
    creativity: [{ label: "Creative & Innovative", value: strength("Creative & Innovative") }],
    execution: [{ label: "Execution scenarios", value: sub(HUMAN, "Execution") }],
    learning: [{ label: "Learning agility scenario", value: sub("ug_future_adaptability", "Learning Agility") }],
    ownership: [{ label: "Resilience scenarios", value: sub(HUMAN, "Resilience") }],
    digital: [{ label: "Digital literacy questions", value: sub(DIGITAL, "Digital Literacy") }],
    ai: [{ label: "AI readiness questions", value: sub(DIGITAL, "AI Readiness") }],
    data: [{ label: "Data literacy questions", value: sub(DIGITAL, "Data Literacy") }],
  };

  const out: SkillEvidenceGrad = {};
  for (const key of MEASURED_SKILLS) {
    const used = sources[key].filter((s) => typeof s.value === "number");
    const avg = average(used.map((s) => s.value));
    if (avg === null) continue;
    out[key] = { level: clampLevel(avg), basis: used.map((s) => s.label).join(" · ") };
  }
  return out;
}
