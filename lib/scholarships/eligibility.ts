/**
 * Scholarships eligibility engine - same Rule/Profile/evaluate() shape as
 * lib/exams/eligibility.ts (per the source spec's own instruction to reuse
 * it), extended with incomeMax and notCombinable - the two rule types
 * scholarships need that exams don't. Kept as its own copy rather than a
 * shared import, matching this session's convention of each section owning
 * its own lib/<section>/ (Entrance Exams and Scholarships are independent
 * features that can evolve separately, not two views of the same rules).
 */

export interface ScholarshipProfile {
  level: string; // "class8".."class12", "ug1".."ug4", "pg", "working"
  institutionType?: "government" | "aided" | "private";
  lastPct?: number;
  class10Pct?: number;
  class12Pct?: number;
  cgpa?: number; // out of 10
  incomeBandInr?: number; // annual family income, in rupees
  gender?: string;
  category?: string;
  disabilityPct?: number;
  domicileState?: string;
  studyState?: string;
  field?: string; // "engineering", "science", "medicine", "arts", ...
  situations?: string[]; // single_parent, orphan, crisis, first_gen
  hasGovtScholarship?: boolean;
}

export type Rule =
  | { type: "minAge"; years: number; onDate: string }
  | { type: "ageRange"; min: number; max: number; onDate: string; relaxYears?: Record<string, number> }
  | { type: "qualification"; level: "class12" | "graduate"; allowAppearing?: boolean }
  /** The study levels a scholarship accepts, using the profile's level codes. */
  | { type: "level"; oneOf: string[]; label: string }
  | { type: "subjects"; allOf: string[] }
  | { type: "minMarks"; field: "class10Pct" | "class12Pct" | "cgpa" | "lastPct"; value: number; relax?: Record<string, number> }
  /** forLevels: the limit applies only at these levels (e.g. a lower limit for school students). */
  | { type: "incomeMax"; valueInr: number; relax?: Record<string, number>; forLevels?: string[] }
  | { type: "gender"; equals: string }
  | { type: "category"; oneOf: string[] }
  | { type: "state"; field: "domicileState" | "studyState"; oneOf: string[] }
  | { type: "field"; oneOf: string[] }
  | { type: "institutionType"; oneOf: ("government" | "aided" | "private")[] }
  /** Benchmark disability, as certified (40% or more for most schemes). */
  | { type: "minDisability"; pct: number }
  /** A family or personal situation the scheme is limited to (see SITUATIONS). */
  | { type: "situation"; oneOf: string[]; label: string }
  | { type: "notCombinable"; note: string } // can't hold alongside another govt scholarship
  | { type: "note"; text: string };

/** Study levels in order, matching the profile form's level codes. */
export const LEVEL_ORDER = ["class6", "class7", "class8", "class9", "class10", "class11", "class12", "ug1", "ug2", "ug3", "ug4", "pg", "working"] as const;

/** Optional situations a learner can tick; some schemes are limited to them. */
export const SITUATIONS: { value: string; label: string }[] = [
  { value: "orphan", label: "I have lost one or both parents (including to COVID-19)" },
  { value: "martyr_family", label: "My parent was an armed forces or CAPF member martyred in action" },
  { value: "capf_family", label: "My parent is or was in a Central Armed Police Force or the Assam Rifles" },
  { value: "police_martyr_family", label: "My parent was a state or UT police officer killed in a terror or Naxal attack" },
  { value: "rpf_family", label: "My parent is or was in the Railway Protection Force (RPF or RPSF)" },
  { value: "labour_welfare", label: "My parent is a beedi, cine, or iron, manganese, chrome, limestone or dolomite mine worker" },
  { value: "crisis", label: "My family is facing a financial crisis (illness, job loss or a death)" },
  { value: "single_parent", label: "I live with a single parent" },
  { value: "first_gen", label: "I am the first in my family to go to college" },
];

export type Verdict = "ELIGIBLE" | "ALMOST" | "NOT_ELIGIBLE" | "CHECK";
export interface Check { verdict: Verdict; reason: string }

const SCHOOL = ["class6", "class7", "class8", "class9", "class10", "class11", "class12"];
const hasGraduated = (l: string) => ["pg", "working"].includes(l) || l.startsWith("ug");

function relaxed(base: number, category: string | undefined, relax: Record<string, number> | undefined): number {
  if (category && relax && category in relax) return relax[category];
  return base;
}

function check(rule: Rule, p: ScholarshipProfile): Check {
  switch (rule.type) {
    case "minAge":
    case "ageRange":
      // Scholarships rarely gate on age the way exams do; kept for shape
      // parity with the exam engine but unused by this section's own data.
      return { verdict: "ELIGIBLE", reason: "No age restriction for this scholarship" };
    case "qualification": {
      if (rule.level === "class12") {
        if (!SCHOOL.includes(p.level) || p.level === "class12") return { verdict: "ELIGIBLE", reason: "Class 12 level or above" };
        return { verdict: "ALMOST", reason: "Opens once you reach class 12" };
      }
      return hasGraduated(p.level) ? { verdict: "ELIGIBLE", reason: "Graduate level or above" } : { verdict: "ALMOST", reason: "Opens once you're in a UG/PG programme" };
    }
    case "level": {
      if (rule.oneOf.includes(p.level)) return { verdict: "ELIGIBLE", reason: `For ${rule.label}` };
      const order = LEVEL_ORDER as readonly string[];
      const mine = order.indexOf(p.level);
      const earliest = Math.min(...rule.oneOf.map((l) => order.indexOf(l)).filter((i) => i >= 0));
      if (mine >= 0 && Number.isFinite(earliest) && mine < earliest) return { verdict: "ALMOST", reason: `Opens when you reach this stage: ${rule.label}` };
      return { verdict: "NOT_ELIGIBLE", reason: `Only for ${rule.label}` };
    }
    case "minDisability": {
      if (p.disabilityPct === undefined) {
        return p.category === "PwBD"
          ? { verdict: "CHECK", reason: `Add your certified disability % to check this (needs ${rule.pct}% or more)` }
          : { verdict: "CHECK", reason: `For students with a benchmark disability (${rule.pct}% or more). Add yours if this applies` };
      }
      return p.disabilityPct >= rule.pct
        ? { verdict: "ELIGIBLE", reason: `${p.disabilityPct}% disability meets the ${rule.pct}% benchmark` }
        : { verdict: "NOT_ELIGIBLE", reason: `Needs a certified disability of ${rule.pct}% or more` };
    }
    case "situation": {
      if (p.situations === undefined) return { verdict: "CHECK", reason: `Only for ${rule.label}. Tick it in your profile if it applies` };
      return p.situations.some((s) => rule.oneOf.includes(s))
        ? { verdict: "ELIGIBLE", reason: `For ${rule.label}` }
        : { verdict: "NOT_ELIGIBLE", reason: `Only for ${rule.label}` };
    }
    case "subjects":
      return { verdict: "ELIGIBLE", reason: "No subject restriction" };
    case "minMarks": {
      const need = relaxed(rule.value, p.category, rule.relax);
      const have = p[rule.field];
      if (have === undefined) return { verdict: "CHECK", reason: `Add your ${rule.field} to check this (needs ${need}${rule.field === "cgpa" ? "" : "%"})` };
      if (have >= need) return { verdict: "ELIGIBLE", reason: `${have}${rule.field === "cgpa" ? "" : "%"} meets ${need}${rule.field === "cgpa" ? "" : "%"}` };
      const gap = need - have;
      return gap <= 5
        ? { verdict: "ALMOST", reason: `Score ${need}${rule.field === "cgpa" ? "" : "%"} in ${rule.field.replace("Pct", "")} to qualify - you're ${gap.toFixed(1)} short` }
        : { verdict: "NOT_ELIGIBLE", reason: `${have}${rule.field === "cgpa" ? "" : "%"} is below the ${need}${rule.field === "cgpa" ? "" : "%"} needed` };
    }
    case "incomeMax": {
      if (rule.forLevels && !rule.forLevels.includes(p.level)) return { verdict: "ELIGIBLE", reason: "A different income limit applies at your level" };
      const need = relaxed(rule.valueInr, p.category, rule.relax);
      if (p.incomeBandInr === undefined) return { verdict: "CHECK", reason: `Add your family income to check this (limit ₹${need.toLocaleString("en-IN")}/year)` };
      return p.incomeBandInr <= need
        ? { verdict: "ELIGIBLE", reason: `Within the ₹${need.toLocaleString("en-IN")}/year limit` }
        : { verdict: "NOT_ELIGIBLE", reason: `Above the ₹${need.toLocaleString("en-IN")}/year limit` };
    }
    case "gender":
      if (!p.gender) return { verdict: "CHECK", reason: "Add your gender to check this" };
      return p.gender === rule.equals ? { verdict: "ELIGIBLE", reason: `For ${rule.equals} students` } : { verdict: "NOT_ELIGIBLE", reason: `Only open to ${rule.equals} students` };
    case "category":
      if (!p.category) return { verdict: "CHECK", reason: "Add your category to check this" };
      return rule.oneOf.includes(p.category) ? { verdict: "ELIGIBLE", reason: `Open to ${rule.oneOf.join("/")} category` } : { verdict: "NOT_ELIGIBLE", reason: `Only open to ${rule.oneOf.join("/")} category` };
    case "state": {
      const have = p[rule.field];
      if (!have) return { verdict: "CHECK", reason: "Add your state to check this" };
      const norm = (s: string) => s.trim().toLowerCase();
      return rule.oneOf.some((s) => norm(s) === norm(have))
        ? { verdict: "ELIGIBLE", reason: `Open in ${have}` }
        : { verdict: "NOT_ELIGIBLE", reason: `Only open to students of ${rule.oneOf.join(", ")}` };
    }
    case "field":
      if (!p.field) return { verdict: "CHECK", reason: "Add your field of study to check this" };
      return rule.oneOf.includes(p.field) ? { verdict: "ELIGIBLE", reason: `Open to ${p.field}` } : { verdict: "NOT_ELIGIBLE", reason: `Only open to ${rule.oneOf.join("/")}` };
    case "institutionType":
      if (!p.institutionType) return { verdict: "CHECK", reason: "Add your institution type to check this" };
      return rule.oneOf.includes(p.institutionType) ? { verdict: "ELIGIBLE", reason: `Open to ${p.institutionType} institutions` } : { verdict: "NOT_ELIGIBLE", reason: `Only open to ${rule.oneOf.join("/")} institutions` };
    case "notCombinable":
      return p.hasGovtScholarship ? { verdict: "ALMOST", reason: rule.note } : { verdict: "ELIGIBLE", reason: "No conflicting scholarship on file" };
    case "note":
      return { verdict: "ELIGIBLE", reason: rule.text };
  }
}

const RANK: Record<Verdict, number> = { NOT_ELIGIBLE: 3, CHECK: 2, ALMOST: 1, ELIGIBLE: 0 };

export interface EvaluateResult { verdict: Verdict; reasons: Check[] }

export function evaluate(rules: Rule[], p: ScholarshipProfile): EvaluateResult {
  const results = rules.map((r) => check(r, p));
  let verdict = results.reduce<Verdict>((w, r) => (RANK[r.verdict] > RANK[w] ? r.verdict : w), "ELIGIBLE");
  // A scheme for a later stage of study ("opens when you reach...") is "almost
  // eligible" even if details it will ask about later (like Class 12 marks for
  // a Class 8 student) are still missing - asking for them now would confuse.
  const levelAlmost = rules.some((r, i) => r.type === "level" && results[i].verdict === "ALMOST");
  if (verdict === "CHECK" && levelAlmost) verdict = "ALMOST";
  const reasons = results.filter((r) => r.verdict !== "ELIGIBLE" || verdict === "ELIGIBLE");
  if (levelAlmost && verdict === "ALMOST") reasons.sort((a, b) => (a.verdict === "ALMOST" ? -1 : 0) - (b.verdict === "ALMOST" ? -1 : 0));
  return { verdict, reasons };
}
