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
  | { type: "subjects"; allOf: string[] }
  | { type: "minMarks"; field: "class10Pct" | "class12Pct" | "cgpa" | "lastPct"; value: number; relax?: Record<string, number> }
  | { type: "incomeMax"; valueInr: number; relax?: Record<string, number> }
  | { type: "gender"; equals: string }
  | { type: "category"; oneOf: string[] }
  | { type: "state"; field: "domicileState" | "studyState"; oneOf: string[] }
  | { type: "field"; oneOf: string[] }
  | { type: "institutionType"; oneOf: ("government" | "aided" | "private")[] }
  | { type: "notCombinable"; note: string } // can't hold alongside another govt scholarship
  | { type: "note"; text: string };

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
      return rule.oneOf.includes(have) ? { verdict: "ELIGIBLE", reason: `Open in ${have}` } : { verdict: "NOT_ELIGIBLE", reason: `Only open to students of ${rule.oneOf.join("/")}` };
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
  const verdict = results.reduce<Verdict>((w, r) => (RANK[r.verdict] > RANK[w] ? r.verdict : w), "ELIGIBLE");
  return { verdict, reasons: results.filter((r) => r.verdict !== "ELIGIBLE" || verdict === "ELIGIBLE") };
}
