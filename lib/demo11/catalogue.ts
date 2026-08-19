/**
 * Class 11-12 demo: streams, degrees, careers and roadmaps.
 *
 * Data source is the client's two 2026 workbooks, converted by
 * scripts/build_demo_streams.py and scripts/build_demo_careers.py. Nothing here
 * is hand-maintained — re-run those scripts when the client sends a new sheet.
 *
 * Server-only. The JSON carries every career's full roadmap, which is far more
 * than any single page needs; route handlers pick out the slice they serve.
 */

import careersData from "@/data/demo-11-12/careers.json";
import {
  streamFamilies as families,
  isKnownCombination as knownCombination,
  degreeVerdictMap,
  type Verdict,
} from "./eligibility";

export type { Verdict };

export interface StreamFamily {
  family: string;
  combinations: string[];
}

export interface OfferedCareer {
  id: string;
  title: string;
  cluster: string;
  domain: string;
  verdict: Verdict;
  /** Possible, but with a condition (bridge subject, entrance route, institution rule). */
  conditional: boolean;
  /** Closed because the workbook never offers this domain to this stream family. */
  unlisted: boolean;
  /** The degrees carrying this career's best verdict, e.g. "via B.Tech CSE". */
  via: string[];
}

export interface RoadmapStep {
  stage: string;
  years: string;
  what: string;
}

export interface EntranceExam {
  name: string;
  when: string;
  opens: string;
}

export interface Roadmap {
  entranceExams: EntranceExam[];
  afterSchool: RoadmapStep[];
  topColleges: string[];
  coreSkills: string[];
  buildNow: string[];
  salary: { entry: string; mid: string; senior: string };
  realityCheck: string;
  whatYouDo: string[];
  dayInLife: string;
  alternates: string[];
  /** Which fields are specific to this career rather than shared with its family. */
  bespokeFields: string[];
}

export interface Career {
  id: string;
  title: string;
  cluster: string;
  clusterName: string;
  family: string;
  familyLabel: string;
  degrees: string[];
  blurb: string;
  roadmap: Roadmap;
}

export interface Figures {
  asOf: string;
  basis: string;
  confidence: string;
  reviewNeeded: boolean;
}

const CAREERS = careersData as unknown as {
  careers: Career[];
  figures: Figures;
};

const VERDICT_RANK: Record<Verdict, number> = { green: 3, yellow: 2, red: 1 };

/**
 * Where the salary, college and exam-timing figures come from.
 *
 * They are authored, not sourced from a live feed, and the report says so next
 * to the numbers. Printing a salary band with no provenance invites a student
 * to read it as a measurement, which it is not.
 */
export function figures(): Figures {
  return CAREERS.figures;
}

const BY_ID = new Map(CAREERS.careers.map((c) => [c.id, c]));

/** The four stream families and their subject combinations, for step 2. */
export function streamFamilies(): StreamFamily[] {
  return families();
}

export function isKnownCombination(combination: string): boolean {
  return knownCombination(combination);
}

/**
 * Careers a student in this stream combination may choose from, already sorted
 * open-first. Closed ones are included on purpose: the brief was to show all
 * three verdicts with the closed ones disabled, so a student can SEE what their
 * subject choice ruled out rather than silently never being offered it.
 */
export function careersForCombination(combination: string): OfferedCareer[] {
  const byDegree = degreeVerdictMap(combination);
  if (byDegree.size === 0) return [];

  const offered: OfferedCareer[] = [];
  for (const c of CAREERS.careers) {
    // A career is offered at the BEST verdict among the degrees leading to it:
    // one open route is enough to make the career reachable.
    let best: Verdict | null = null;
    let bestConditional = false;
    let bestUnlisted = false;
    for (const name of c.degrees) {
      const d = byDegree.get(name);
      if (!d) continue;
      if (best === null || VERDICT_RANK[d.verdict] > VERDICT_RANK[best]) {
        best = d.verdict;
        bestConditional = d.conditional;
        bestUnlisted = d.unlisted;
      }
    }
    if (best === null) continue;
    // Which degrees actually carry that verdict - shown as "via B.Tech CSE".
    const via = c.degrees.filter((n) => byDegree.get(n)?.verdict === best);
    offered.push({
      id: c.id,
      title: c.title,
      cluster: c.cluster,
      domain: c.familyLabel,
      verdict: best,
      conditional: bestConditional,
      unlisted: bestUnlisted && best === "red",
      via,
    });
  }
  offered.sort(
    (a, b) =>
      VERDICT_RANK[b.verdict] - VERDICT_RANK[a.verdict] ||
      a.domain.localeCompare(b.domain) ||
      a.title.localeCompare(b.title)
  );
  return offered;
}

export function getCareer(id: string): Career | undefined {
  return BY_ID.get(id);
}

/** Careers grouped by domain, which is how the dropdown renders them. */
export function groupedForCombination(combination: string) {
  const offered = careersForCombination(combination);
  const groups = new Map<string, OfferedCareer[]>();
  for (const c of offered) {
    const list = groups.get(c.domain) ?? [];
    list.push(c);
    groups.set(c.domain, list);
  }
  return [...groups.entries()]
    .map(([domain, careers]) => ({ domain, careers }))
    .sort((a, b) => a.domain.localeCompare(b.domain));
}

/**
 * Resolve a career's `alternates` (which are ids) into titles the report can
 * print, dropping any the student's stream cannot actually reach. Suggesting a
 * fallback that their subject combination has already closed off would be worse
 * than suggesting nothing.
 */
export function alternativesFor(careerId: string, combination: string) {
  const career = BY_ID.get(careerId);
  if (!career) return [];
  const reachable = new Map(
    careersForCombination(combination)
      .filter((c) => c.verdict !== "red")
      .map((c) => [c.id, c])
  );
  return career.roadmap.alternates
    .map((id) => {
      const alt = reachable.get(id);
      const full = BY_ID.get(id);
      if (!alt || !full) return null;
      return { id, title: full.title, blurb: full.blurb, verdict: alt.verdict, cluster: full.cluster };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
