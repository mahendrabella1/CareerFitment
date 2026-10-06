/**
 * Family Decision Room - two futures side by side, for a student, their
 * parents and their counsellor deciding together.
 *
 * The figures below are INDICATIVE ranges for India, compiled from commonly
 * published fee, salary and course-length information. They vary widely by
 * college, city, skill and year, and the screen says so. They exist to start
 * an informed family conversation, not to predict any one student's future.
 */
import { AREA_BY_KEY, areasFor, type CareerArea } from "@/lib/institution/features";

export interface AreaFacts {
  route: string;
  yearsToFirstJob: string;
  studyCost: string;
  startingPay: string;
  tenYearPay: string;
}

export const AREA_FACTS: Record<string, AreaFacts> = {
  computing: { route: "Class 12 → B.Tech CSE / BCA / B.Sc CS (3-4 yrs) → job; skills and projects matter as much as the college", yearsToFirstJob: "3-4 years", studyCost: "₹1-8 lakh (govt) · ₹6-20 lakh (private)", startingPay: "₹3.5-12 lakh a year", tenYearPay: "₹15-40 lakh a year" },
  engineering: { route: "Class 12 (PCM) → JEE / state CET → B.Tech (4 yrs) → job, PSU via GATE, or M.Tech", yearsToFirstJob: "4 years", studyCost: "₹2-8 lakh (govt) · ₹6-20 lakh (private)", startingPay: "₹3-8 lakh a year", tenYearPay: "₹10-30 lakh a year" },
  medicine: { route: "Class 12 (PCB) → NEET → MBBS (5.5 yrs incl. internship) → often PG (3 yrs) to specialise", yearsToFirstJob: "5.5-9 years", studyCost: "₹0.5-5 lakh (govt) · ₹50 lakh-1.2 crore (private)", startingPay: "₹6-12 lakh a year", tenYearPay: "₹15-50 lakh a year (specialists more)" },
  science: { route: "Class 12 → B.Sc (3-4 yrs) → M.Sc (2 yrs) → research, labs, industry or teaching", yearsToFirstJob: "3-5 years", studyCost: "₹0.5-6 lakh", startingPay: "₹2.5-6 lakh a year", tenYearPay: "₹8-25 lakh a year" },
  business: { route: "Class 12 → BBA / B.Com (3 yrs) → work → MBA (2 yrs) for management roles", yearsToFirstJob: "3-5 years", studyCost: "₹2-8 lakh (degree) · ₹5-25 lakh (MBA)", startingPay: "₹3-8 lakh a year (more after a good MBA)", tenYearPay: "₹12-40 lakh a year" },
  finance: { route: "Class 12 (Commerce) → CA / CMA / CS (4-5 yrs, with articleship) or B.Com + finance roles", yearsToFirstJob: "4-5 years", studyCost: "₹1-4 lakh (CA route) · ₹3-10 lakh (degree)", startingPay: "₹6-12 lakh a year (qualified CA)", tenYearPay: "₹15-40 lakh a year" },
  law: { route: "Class 12 → CLAT / AILET → 5-year BA LLB, or a degree + 3-year LLB → practice, firms or judiciary", yearsToFirstJob: "5 years", studyCost: "₹3-15 lakh (NLUs and private vary)", startingPay: "₹3-10 lakh a year (top firms more)", tenYearPay: "₹10-40 lakh a year" },
  government: { route: "Any degree → UPSC / state PSC / SSC exams (1-3 years of preparation is common) → service", yearsToFirstJob: "4-6 years", studyCost: "₹1-5 lakh (degree) + coaching ₹1-3 lakh", startingPay: "₹5-9 lakh a year with allowances", tenYearPay: "₹10-20 lakh a year, plus housing and job security" },
  defence: { route: "Class 12 → NDA (3 yrs + 1 yr training), or a degree → CDS / AFCAT → commissioned officer", yearsToFirstJob: "4 years", studyCost: "Training is free", startingPay: "₹9-11 lakh a year", tenYearPay: "₹15-25 lakh a year, plus benefits" },
  design: { route: "Class 12 → NID / NIFT / UCEED → B.Des (4 yrs) → studios, brands, tech; portfolio matters most", yearsToFirstJob: "4 years", studyCost: "₹8-20 lakh", startingPay: "₹3-8 lakh a year", tenYearPay: "₹10-30 lakh a year" },
  education: { route: "Degree (3-4 yrs) → B.Ed (2 yrs) / NET → school or college teaching", yearsToFirstJob: "5-6 years", studyCost: "₹1-5 lakh", startingPay: "₹2.5-6 lakh a year (govt schools more)", tenYearPay: "₹6-15 lakh a year" },
  hospitality: { route: "Class 12 → hotel management / aviation / tourism course (3-4 yrs) → hotels, airlines, events", yearsToFirstJob: "3-4 years", studyCost: "₹3-12 lakh", startingPay: "₹2-4.5 lakh a year", tenYearPay: "₹6-18 lakh a year" },
  agriculture: { route: "Class 12 → B.Sc Agriculture / food tech (4 yrs) → govt posts, agri-business, food industry", yearsToFirstJob: "4 years", studyCost: "₹1-6 lakh", startingPay: "₹3-6 lakh a year", tenYearPay: "₹8-20 lakh a year" },
  sports: { route: "Training alongside school → competitions → B.P.Ed / sports science / coaching certifications", yearsToFirstJob: "Varies", studyCost: "₹1-6 lakh plus training", startingPay: "₹2-6 lakh a year", tenYearPay: "Varies widely" },
  social: { route: "Class 12 → BA / B.Sc Psychology or Social Work (3 yrs) → MA / MSW (2 yrs) → counselling, NGOs, HR", yearsToFirstJob: "3-5 years", studyCost: "₹1-6 lakh", startingPay: "₹2.5-5 lakh a year", tenYearPay: "₹6-15 lakh a year" },
};

/** How well each area tends to meet a family priority (from the parent survey). 2 = strongly, 1 = partly. */
const PRIORITY_FIT: Record<string, Record<string, number>> = {
  "Stable job": { government: 2, defence: 2, medicine: 2, education: 2, finance: 1, engineering: 1, science: 1 },
  "High salary": { computing: 2, finance: 2, medicine: 2, business: 2, law: 1, engineering: 1 },
  "Government job": { government: 2, defence: 2, education: 1, engineering: 1, medicine: 1, agriculture: 1 },
  "Study or work abroad": { computing: 2, engineering: 2, science: 2, medicine: 1, business: 1, design: 1, hospitality: 1 },
  "Close to home": { education: 2, business: 1, agriculture: 1, finance: 1, social: 1 },
  "Social respect": { medicine: 2, government: 2, defence: 2, law: 1, engineering: 1, education: 1 },
  "Business of our own": { business: 2, finance: 1, agriculture: 1, design: 1, computing: 1, hospitality: 1 },
};

export interface PathView {
  label: string;
  area: CareerArea | null;
  facts: AreaFacts | null;
  /** Fit from the student's own report, when this path is one of their best fits. */
  fitPct: number | null;
  isGoal: boolean;
  /** Test-drive enjoyment (1-5) if they test-drove a matching career. */
  enjoyment: number | null;
  /** Parent priorities this path meets, and how strongly. */
  priorities: { priority: string; level: number }[];
  parentsWant: boolean;
}

export function pathView(
  label: string,
  ctx: { fits: { name: string; pct: number }[]; goal: string | null; testDrives: { career: string; enjoyment: number }[]; parentAreas: string[]; parentPriorities: string[] },
): PathView {
  const key = areasFor(label)[0] ?? null;
  const area = key ? AREA_BY_KEY[key] : null;
  const sameArea = (t: string) => key !== null && areasFor(t).includes(key);
  const fit = ctx.fits.find((f) => f.name.toLowerCase() === label.toLowerCase()) ?? ctx.fits.find((f) => sameArea(f.name));
  const drive = ctx.testDrives.find((d) => d.career.toLowerCase() === label.toLowerCase()) ?? ctx.testDrives.find((d) => sameArea(d.career));
  return {
    label, area, facts: key ? AREA_FACTS[key] ?? null : null,
    fitPct: fit ? fit.pct : null,
    isGoal: !!ctx.goal && (ctx.goal.toLowerCase() === label.toLowerCase() || sameArea(ctx.goal)),
    enjoyment: drive ? drive.enjoyment : null,
    priorities: ctx.parentPriorities.map((p) => ({ priority: p, level: key ? PRIORITY_FIT[p]?.[key] ?? 0 : 0 })),
    parentsWant: !!key && ctx.parentAreas.includes(key),
  };
}

export interface FamilyDecision {
  pathA: string;
  pathB: string;
  chosen: "A" | "B" | "undecided";
  reasons: string;
  savedAt: number;
  parentResponse?: { answer: "agree" | "discuss"; comment: string; at: number };
}
