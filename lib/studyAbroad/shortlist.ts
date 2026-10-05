/**
 * Shortlist and application tracker data, stored on the learner's device
 * (localStorage) like the other planning tools. Nothing here is sent to a
 * server. The reach/match/safe rule follows plan section 6: compare the
 * learner with the programme's typical admitted profile, and always check
 * hard minimums first.
 */

export type AppStatus = "considering" | "drafting" | "submitted" | "interview" | "offer" | "rejected" | "accepted";

export const STATUS_LABEL: Record<AppStatus, string> = {
  considering: "Considering",
  drafting: "Drafting",
  submitted: "Submitted",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  accepted: "Accepted",
};

export const DOCUMENTS: { key: string; label: string }[] = [
  { key: "passport", label: "Passport (valid for the whole course)" },
  { key: "transcripts", label: "Transcripts and degree or provisional certificate" },
  { key: "tests", label: "English test score (and GRE/GMAT if asked)" },
  { key: "cv", label: "CV" },
  { key: "sop", label: "Statement of purpose" },
  { key: "lors", label: "Letters of recommendation" },
  { key: "funds", label: "Proof of funds or loan sanction letter" },
  { key: "fee", label: "Application fee paid" },
];

export interface Scores {
  pct?: number; // final degree or Class 12 percentage
  ielts?: number;
  gre?: number;
  workYears?: number;
}

export interface ShortlistItem {
  id: string;
  universitySlug?: string;
  universityName: string;
  programme: string;
  countryCode?: string;
  deadline?: string; // YYYY-MM-DD
  feeInr?: number;
  minimum: Scores; // hard requirements from the programme page
  typical: Scores; // typical admitted profile, where the university publishes one
  status: AppStatus;
  documents: Record<string, boolean>;
  offer?: { tuitionInr?: number; livingInr?: number; otherInr?: number; scholarshipInr?: number };
  notes?: string;
}

export interface AbroadPlan {
  me: Scores;
  items: ShortlistItem[];
}

const KEY = "onegrasp.abroad.shortlist.v1";

export function loadPlan(): AbroadPlan {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as Partial<AbroadPlan>) : {};
    return { me: v.me ?? {}, items: Array.isArray(v.items) ? v.items : [] };
  } catch {
    return { me: {}, items: [] };
  }
}

export function savePlan(plan: AbroadPlan) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    // Storage blocked: the shortlist works for this visit only.
  }
}

export function newItem(partial: Partial<ShortlistItem> & { universityName: string }): ShortlistItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    programme: "",
    minimum: {},
    typical: {},
    status: "considering",
    documents: {},
    ...partial,
  };
}

export type Band = "reach" | "match" | "safe" | "below-minimum" | "unclassified";

/** How far above or below the typical value counts as "above" or "close" for each field. */
const MARGINS: Record<keyof Scores, { above: number; close: number }> = {
  pct: { above: 5, close: 3 },
  ielts: { above: 0.5, close: 0.5 },
  gre: { above: 5, close: 5 },
  workYears: { above: 1, close: 1 },
};

export function classify(me: Scores, item: ShortlistItem): { band: Band; reason: string } {
  const fields = Object.keys(MARGINS) as (keyof Scores)[];
  for (const f of fields) {
    const min = item.minimum[f];
    const mine = me[f];
    if (min !== undefined && mine !== undefined && mine < min) {
      return { band: "below-minimum", reason: `Your ${label(f)} (${mine}) is below the stated minimum (${min}).` };
    }
  }
  let above = 0;
  let close = 0;
  let below = 0;
  for (const f of fields) {
    const typ = item.typical[f];
    const mine = me[f];
    if (typ === undefined || mine === undefined) continue;
    const diff = mine - typ;
    if (diff >= MARGINS[f].above) above++;
    else if (diff >= -MARGINS[f].close) close++;
    else below++;
  }
  const compared = above + close + below;
  if (compared === 0) return { band: "unclassified", reason: "Add the programme's typical admitted profile (and your scores) to classify it." };
  if (below > 0 && below >= above) return { band: "reach", reason: `Below the typical admit on ${below} of ${compared} measure${compared === 1 ? "" : "s"}.` };
  if (below === 0 && above > close) return { band: "safe", reason: `Comfortably above the typical admit on ${above} of ${compared} measure${compared === 1 ? "" : "s"}.` };
  return { band: "match", reason: `Close to the typical admit on most measures.` };
}

function label(f: keyof Scores) {
  return f === "pct" ? "percentage" : f === "ielts" ? "IELTS band" : f === "gre" ? "GRE score" : "years of work experience";
}

/** Plan section 6: apply to about 2 reach, 3-4 match and 2 safe programmes. */
export function mixAdvice(counts: Record<Band, number>): string {
  const tips: string[] = [];
  if (counts.reach > 2) tips.push(`you have ${counts.reach} reach programmes; 2 is usually enough`);
  if (counts.match < 3) tips.push(`add ${3 - counts.match} more match programme${3 - counts.match === 1 ? "" : "s"}`);
  if (counts.safe < 2) tips.push(`add ${2 - counts.safe} safe programme${2 - counts.safe === 1 ? "" : "s"}`);
  if (counts["below-minimum"] > 0) tips.push(`${counts["below-minimum"]} programme${counts["below-minimum"] === 1 ? " is" : "s are"} below a stated minimum, so fix the score or drop ${counts["below-minimum"] === 1 ? "it" : "them"}`);
  return tips.length ? `A balanced list is about 2 reach, 3-4 match and 2 safe programmes. To get there: ${tips.join("; ")}.` : "Your list has a balanced mix of reach, match and safe programmes.";
}
