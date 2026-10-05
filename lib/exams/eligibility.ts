/**
 * Entrance Exams eligibility engine - pure, data-driven rules that run
 * against a student's profile. Deliberately generic: a rule is data (see
 * data/exams/exams.ts), not a special case hard-coded per exam, so adding a
 * 16th exam never means touching this file.
 */

export interface Profile {
  dob: string; // ISO date
  level: string; // "class6".."class12", "ugFinal", "graduate", "working"
  class12Pct?: number;
  class12Status?: "passed" | "appearing";
  gradPct?: number;
  subjects: string[];
  category?: string; // optional; used only for official relaxations
  attempts?: Record<string, number>; // examSlug -> attempts already used
}

export type Rule =
  | { type: "minAge"; years: number; onDate: string }
  | { type: "ageRange"; min: number; max: number; onDate: string; relaxYears?: Record<string, number> }
  /** Date of birth must fall between these dates (inclusive), e.g. Navodaya class 6 entry. */
  | { type: "bornBetween"; from: string; to: string }
  | { type: "qualification"; level: "class12" | "graduate"; allowAppearing?: boolean }
  /** The current class/levels allowed to sit the exam, using the profile's level codes. */
  | { type: "level"; oneOf: string[]; label: string }
  | { type: "subjects"; allOf: string[] }
  | { type: "minMarks"; field: "class12Pct" | "gradPct"; value: number; relax?: Record<string, number> }
  | { type: "maxAttempts"; exam: string; value: number; relax?: Record<string, number> }
  | { type: "note"; text: string };

/** Profile levels in order, from primary school to working professional. */
export const EXAM_LEVEL_ORDER = ["class5", "class6", "class7", "class8", "class9", "class10", "class11", "class12", "ug", "ugFinal", "graduate", "working"] as const;

export type Verdict = "ELIGIBLE" | "SOON" | "NOT_ELIGIBLE" | "CHECK";
export interface Check { verdict: Verdict; reason: string }

function ageOn(dob: string, onDate: string): number {
  const b = new Date(dob), d = new Date(onDate);
  let a = d.getFullYear() - b.getFullYear();
  if (d.getMonth() < b.getMonth() || (d.getMonth() === b.getMonth() && d.getDate() < b.getDate())) a--;
  return a;
}

const SCHOOL = ["class5", "class6", "class7", "class8", "class9", "class10", "class11", "class12"];
const hasGraduated = (l: string) => ["graduate", "working"].includes(l);

/** Category-relaxed threshold, falling back to the base value - a small
 *  helper rather than `(cat && relax?.[cat]) ?? base` inline, which
 *  TypeScript can't narrow to `number` when `cat` is an empty string. */
function relaxed(base: number, category: string | undefined, relax: Record<string, number> | undefined): number {
  if (category && relax && category in relax) return relax[category];
  return base;
}

function check(rule: Rule, p: Profile): Check {
  switch (rule.type) {
    case "minAge": {
      if (!p.dob) return { verdict: "CHECK", reason: "Add your date of birth to check this" };
      const a = ageOn(p.dob, rule.onDate);
      return a >= rule.years
        ? { verdict: "ELIGIBLE", reason: `Age ${a} meets the minimum of ${rule.years}` }
        : { verdict: "SOON", reason: `You need to be ${rule.years} by ${rule.onDate}` };
    }
    case "ageRange": {
      if (!p.dob) return { verdict: "CHECK", reason: "Add your date of birth to check this" };
      const a = ageOn(p.dob, rule.onDate);
      const max = rule.max + (relaxed(0, p.category, rule.relaxYears));
      if (a < rule.min) return { verdict: "SOON", reason: `Minimum age is ${rule.min}` };
      if (a > max) return { verdict: "NOT_ELIGIBLE", reason: `Upper age limit is ${max} for your category` };
      return { verdict: "ELIGIBLE", reason: `Age ${a} is within ${rule.min}-${max}` };
    }
    case "bornBetween": {
      if (!p.dob) return { verdict: "CHECK", reason: "Add your date of birth to check this" };
      const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      if (p.dob >= rule.from && p.dob <= rule.to) return { verdict: "ELIGIBLE", reason: `Born between ${fmt(rule.from)} and ${fmt(rule.to)}` };
      return { verdict: "NOT_ELIGIBLE", reason: `Only for students born between ${fmt(rule.from)} and ${fmt(rule.to)}` };
    }
    case "level": {
      if (rule.oneOf.includes(p.level)) return { verdict: "ELIGIBLE", reason: `Open to ${rule.label}` };
      const order = EXAM_LEVEL_ORDER as readonly string[];
      const mine = order.indexOf(p.level);
      const earliest = Math.min(...rule.oneOf.map((l) => order.indexOf(l)).filter((i) => i >= 0));
      if (mine >= 0 && Number.isFinite(earliest) && mine < earliest) return { verdict: "SOON", reason: `Opens when you reach this stage: ${rule.label}` };
      return { verdict: "NOT_ELIGIBLE", reason: `Only for ${rule.label}` };
    }
    case "qualification": {
      if (rule.level === "class12") {
        if (p.class12Status === "passed" || !SCHOOL.includes(p.level)) return { verdict: "ELIGIBLE", reason: "Class 12 completed" };
        if (p.level === "class12" && rule.allowAppearing) return { verdict: "ELIGIBLE", reason: "Students appearing in class 12 can apply" };
        return { verdict: "SOON", reason: "Eligible after class 12" };
      }
      if (hasGraduated(p.level)) return { verdict: "ELIGIBLE", reason: "Graduate" };
      if (p.level === "ugFinal" && rule.allowAppearing) return { verdict: "ELIGIBLE", reason: "Final-year students can apply" };
      return { verdict: "SOON", reason: "Needs a graduate degree" };
    }
    case "subjects": {
      const missing = rule.allOf.filter((s) => !p.subjects.includes(s));
      if (!p.subjects.length) return { verdict: "CHECK", reason: "Add your subjects to check this" };
      return missing.length
        ? { verdict: "NOT_ELIGIBLE", reason: `Needs ${missing.join(", ")}` }
        : { verdict: "ELIGIBLE", reason: "Required subjects present" };
    }
    case "minMarks": {
      const need = relaxed(rule.value, p.category, rule.relax);
      const have: number | undefined = rule.field === "class12Pct" ? p.class12Pct : p.gradPct;
      if (have === undefined) return { verdict: "CHECK", reason: `Add your ${rule.field === "class12Pct" ? "class 12" : "graduation"} marks (needs ${need}%)` };
      return have >= need
        ? { verdict: "ELIGIBLE", reason: `${have}% meets ${need}%` }
        : { verdict: "NOT_ELIGIBLE", reason: `${have}% is below the ${need}% needed` };
    }
    case "maxAttempts": {
      const used = p.attempts?.[rule.exam] ?? 0;
      const limit = relaxed(rule.value, p.category, rule.relax);
      return used < limit
        ? { verdict: "ELIGIBLE", reason: `${limit - used} attempts left` }
        : { verdict: "NOT_ELIGIBLE", reason: "No attempts left" };
    }
    case "note":
      return { verdict: "ELIGIBLE", reason: rule.text };
  }
}

const RANK: Record<Verdict, number> = { NOT_ELIGIBLE: 3, CHECK: 2, SOON: 1, ELIGIBLE: 0 };

export interface EvaluateResult { verdict: Verdict; reasons: Check[] }

/** The worst result across rules wins; reasons returned are the failing
 *  ones, or every rule when fully eligible (so an "ELIGIBLE" result still
 *  shows what made it so, not an empty list). */
export function evaluate(rules: Rule[], p: Profile): EvaluateResult {
  const results = rules.map((r) => check(r, p));
  const verdict = results.reduce<Verdict>((w, r) => (RANK[r.verdict] > RANK[w] ? r.verdict : w), "ELIGIBLE");
  return { verdict, reasons: results.filter((r) => r.verdict !== "ELIGIBLE" || verdict === "ELIGIBLE") };
}
