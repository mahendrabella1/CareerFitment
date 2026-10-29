/**
 * Startup funding directory (Startups -> Funding, /account/startups/funding):
 * every grant, loan, subsidy, equity and credit-guarantee programme for Indian
 * startups from CapEasy's directory (https://www.capeasy.in/schemes/ -
 * CapEasy is OneGrasp's own company, shared with consent). The data is
 * data/startups/funding.json, refreshed with `node scripts/update-startup-funding.mjs`.
 * Each programme's details, eligibility and application live on its CapEasy page.
 *
 * Pure helpers (labels, filters, deadline status) - tested in tests/startups.
 */

export type FundingKind = "grant" | "subsidy" | "loan" | "equity" | "guarantee";
export type RunBy = "central" | "state" | "incubator" | "bank";

export interface Programme {
  slug: string;
  name: string;
  amount_band: string | null;
  amount_max: number | null;
  deadline_word: string;
  deadline_date: string | null;
  /** A one-click application through CapEasy Grant Studio. */
  draftable: boolean;
  kind: FundingKind;
  stages: string[];
  sectors: string[];
  states: string[];
  run_by_kind: RunBy;
}

export interface FundingData {
  source: string;
  fetchedAt: string;
  totals: { programmes: number; crore: number; oneClick: number; runBy: Record<RunBy, number> } | null;
  programmes: Programme[];
}

export const KIND_LABEL: Record<FundingKind, string> = { grant: "Grant", subsidy: "Subsidy", loan: "Loan", equity: "Equity", guarantee: "Credit guarantee" };
export const RUN_BY_LABEL: Record<RunBy, string> = { central: "Central government", state: "State government", incubator: "Incubators and funds", bank: "Banks and SIDBI" };

export const STAGES: { id: string; label: string }[] = [
  { id: "idea", label: "Idea" },
  { id: "proof-of-concept", label: "Proof of concept" },
  { id: "prototype", label: "Prototype" },
  { id: "early-stage", label: "Early stage" },
  { id: "seed", label: "Seed" },
  { id: "paid-pilot", label: "Paid pilot" },
  { id: "early-revenue", label: "Early revenue" },
  { id: "growth", label: "Growth" },
  { id: "scale", label: "Scale" },
];
export const stageLabel = (id: string) => STAGES.find((s) => s.id === id)?.label ?? id;
/** The stages a student or first-time founder is usually at. */
export const EARLY_STAGES = new Set(["idea", "proof-of-concept", "prototype"]);

const SMALL_WORDS = new Set(["and", "of"]);
const STATE_FIX: Record<string, string> = { "jammu-and-kashmir": "Jammu & Kashmir", "dadra-and-nagar-haveli-and-daman-and-diu": "Dadra & Nagar Haveli and Daman & Diu" };
export const stateName = (slug: string) =>
  STATE_FIX[slug] ?? slug.split("-").map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w[0].toUpperCase() + w.slice(1))).join(" ");

export const AMOUNT_BANDS: { id: string; label: string; min: number; max: number }[] = [
  { id: "u5l", label: "Under ₹5 lakh", min: 0, max: 5e5 },
  { id: "5l-25l", label: "₹5 lakh to ₹25 lakh", min: 5e5, max: 25e5 },
  { id: "25l-1cr", label: "₹25 lakh to ₹1 crore", min: 25e5, max: 1e7 },
  { id: "1cr-5cr", label: "₹1 crore to ₹5 crore", min: 1e7, max: 5e7 },
  { id: "5cr+", label: "₹5 crore and above", min: 5e7, max: Infinity },
];
/** The amount band a programme falls in, by its largest amount (programmes without one fall in none). */
export function amountBand(p: Programme): string | null {
  if (p.amount_max == null) return null;
  return AMOUNT_BANDS.find((b) => p.amount_max! >= b.min && p.amount_max! < b.max)?.id ?? null;
}

/** The amount as shown - a few source amounts lost their unit ("₹1", "USD 50"); those read "See the programme". */
export function amountText(p: Programme): string {
  const a = p.amount_band?.trim();
  if (!a || /^(Up to |From )?(₹|USD |US\$|INR )\s?\d{1,3}(\.\d+)?$/.test(a)) return "See the programme";
  return a;
}

export type DeadlineState = "closed" | "soon" | "dated" | "open" | "calls" | "see";
/** Deadline status on a given day ("YYYY-MM-DD"): closing within 30 days is "soon". */
export function deadlineOf(p: Programme, today: string): { state: DeadlineState; text: string } {
  if (p.deadline_date) {
    const d = new Date(`${p.deadline_date}T00:00:00Z`);
    const text = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
    if (p.deadline_date < today) return { state: "closed", text: `Closed ${text}` };
    const days = (d.getTime() - new Date(`${today}T00:00:00Z`).getTime()) / 86_400_000;
    return { state: days <= 30 ? "soon" : "dated", text: `Closes ${text}` };
  }
  if (/rolling|open now/i.test(p.deadline_word)) return { state: "open", text: "Open now or rolling" };
  if (/calls/i.test(p.deadline_word)) return { state: "calls", text: "Opens in calls" };
  return { state: "see", text: "See the programme" };
}

/**
 * Programmes open to students or individual innovators (no company needed) -
 * picked by hand from what each programme says it is for. Most others need a
 * registered business, and company directors in India must be adults.
 */
export const FOR_STUDENTS = new Set([
  "student-startup-and-innovation-policy-for-the-state-of-gujarat-ssip-2-0",
  "youth-entrepreneurs-challenge-yec-2027-viksit-bharat-young-leaders-dialogue",
  "sitare-students-innovations-for-translation-advancement-of-research-explorations",
  "birac-e-yuva-innovation-fellowship-e-yuva-scheme-4th-call",
  "e-yuva-fellows-innovation-fellows-call-birac-e-yuva-scheme",
  "nidhi-prayas",
  "dst-nidhi-prayas-sine-iit-bombay-pmu",
]);

export const programmeUrl = (slug: string) => `https://www.capeasy.in/schemes/${slug}/?utm_source=onegrasp&utm_medium=referral&utm_campaign=startups_funding`;
export const CAPEASY_START = "https://www.capeasy.in/schemes/workspace/start/?utm_source=onegrasp&utm_medium=referral&utm_campaign=startups_funding";

export interface FundingFilters {
  q: string;
  students: boolean;
  early: boolean;
  oneClick: boolean;
  kinds: string[];
  stages: string[];
  runBy: string[];
  states: string[];
  sectors: string[];
  amounts: string[];
  deadline: "any" | "soon" | "open";
}
export const NO_FILTERS: FundingFilters = { q: "", students: false, early: false, oneClick: false, kinds: [], stages: [], runBy: [], states: [], sectors: [], amounts: [], deadline: "any" };

/** Programmes matching every filter, closed ones left out. "Across India" is the state id "india". */
export function filterProgrammes(list: Programme[], f: FundingFilters, today: string): Programme[] {
  const q = f.q.trim().toLowerCase();
  return list.filter((p) => {
    const dl = deadlineOf(p, today).state;
    if (dl === "closed") return false;
    if (q && !`${p.name} ${p.sectors.join(" ")} ${p.states.map(stateName).join(" ")}`.toLowerCase().includes(q)) return false;
    if (f.students && !FOR_STUDENTS.has(p.slug)) return false;
    if (f.early && !p.stages.some((s) => EARLY_STAGES.has(s))) return false;
    if (f.oneClick && !p.draftable) return false;
    if (f.kinds.length && !f.kinds.includes(p.kind)) return false;
    if (f.stages.length && !p.stages.some((s) => f.stages.includes(s))) return false;
    if (f.runBy.length && !f.runBy.includes(p.run_by_kind)) return false;
    if (f.states.length && !(p.states.length ? p.states.some((s) => f.states.includes(s)) : f.states.includes("india"))) return false;
    if (f.sectors.length && !p.sectors.some((s) => f.sectors.includes(s))) return false;
    if (f.amounts.length && !f.amounts.includes(amountBand(p) ?? "")) return false;
    if (f.deadline === "soon" && dl !== "soon") return false;
    if (f.deadline === "open" && dl !== "open") return false;
    return true;
  });
}

export type FundingSort = "amount" | "closing" | "name";
export function sortProgrammes(list: Programme[], by: FundingSort): Programme[] {
  const out = [...list];
  if (by === "name") out.sort((a, b) => a.name.localeCompare(b.name));
  else if (by === "closing") out.sort((a, b) => (a.deadline_date ?? "9999").localeCompare(b.deadline_date ?? "9999") || (b.amount_max ?? 0) - (a.amount_max ?? 0));
  else out.sort((a, b) => (b.amount_max ?? -1) - (a.amount_max ?? -1) || a.name.localeCompare(b.name));
  return out;
}
