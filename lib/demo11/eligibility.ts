/**
 * Which degrees a class 11-12 stream combination can actually lead to.
 *
 * This is the authority at runtime. The build scripts resolve the same rules to
 * print their summary, but nothing precomputed reaches the app: expanding 32
 * combinations x 118 degrees into the data file cost 478KB, duplicated a truth
 * that is cheap to derive, and pushed the Next build past its default heap.
 *
 * The three cases below are the whole point, and conflating them is how MBBS
 * ends up looking open to a commerce student:
 *
 *   1. The degree has no eligibility matrix at all (the workbook's media and
 *      hospitality lists carry none). Those programmes genuinely do accept
 *      every stream, so: eligible.
 *
 *   2. The matrix has a column for this stream, directly or through the
 *      fallback chain. Whatever the workbook says.
 *
 *   3. The matrix has columns but none for this student's stream FAMILY. The
 *      domain tab enumerated the streams it accepts and this was not among
 *      them - the Medical tab lists only PCM/PCB/PCMB, which is exactly how it
 *      says "medicine is a science-stream pathway". Not eligible, flagged
 *      `unlisted` so the UI can word it as "not offered from your stream"
 *      rather than implying the student failed a requirement.
 */

import streamsData from "@/data/demo-11-12/streams.json";

export type Verdict = "green" | "yellow" | "red";

export interface DegreeEligibility {
  verdict: Verdict;
  conditional: boolean;
}

export interface Degree {
  degree: string;
  domain: string;
  eligibility: Record<string, DegreeEligibility>;
}

export interface Combination {
  combination: string;
  family: string;
  group: string;
}

interface StreamsFile {
  families: { family: string; combinations: string[] }[];
  groups: string[];
  degrees: Degree[];
  combinations: Combination[];
  /** Column headers vary by tab; a group falls through until one matches. */
  groupFallback: Record<string, string[]>;
  /** Which family a matrix COLUMN belongs to. */
  columnFamily: Record<string, string>;
  /** Which family a stream GROUP belongs to. */
  familyOf: Record<string, string>;
}

const S = streamsData as unknown as StreamsFile;

const BY_COMBINATION = new Map(S.combinations.map((c) => [c.combination, c]));
const DEGREES_BY_NAME = new Map(S.degrees.map((d) => [d.degree, d]));

export interface ResolvedDegree {
  degree: string;
  domain: string;
  verdict: Verdict;
  conditional: boolean;
  unlisted: boolean;
}

export function streamFamilies() {
  return S.families;
}

export function combinationNames(): string[] {
  return S.combinations.map((c) => c.combination);
}

export function isKnownCombination(combination: string): boolean {
  return BY_COMBINATION.has(combination);
}

export function groupFor(combination: string): string | null {
  return BY_COMBINATION.get(combination)?.group ?? null;
}

/** Verdict for one degree from one stream group. See the three cases above. */
export function resolveDegree(degree: Degree, group: string): ResolvedDegree {
  const base = { degree: degree.degree, domain: degree.domain };
  const columns = Object.keys(degree.eligibility);

  if (columns.length === 0) {
    return { ...base, verdict: "green", conditional: true, unlisted: false };
  }

  for (const col of S.groupFallback[group] ?? [group]) {
    const hit = degree.eligibility[col];
    if (hit) {
      return { ...base, verdict: hit.verdict, conditional: hit.conditional, unlisted: false };
    }
  }

  const family = S.familyOf[group];
  const covered = new Set(columns.map((c) => S.columnFamily[c]));
  if (family && covered.has(family)) {
    // The family is on the tab but this exact combination is not spelled out.
    // Genuinely unknown, so say "check the institution" rather than inventing
    // either answer.
    return { ...base, verdict: "yellow", conditional: true, unlisted: false };
  }
  return { ...base, verdict: "red", conditional: false, unlisted: true };
}

/** Every degree, resolved for this combination. */
export function degreesForCombination(combination: string): ResolvedDegree[] {
  const group = groupFor(combination);
  if (!group) return [];
  return S.degrees.map((d) => resolveDegree(d, group));
}

/** Degree name -> its verdict for this combination, for joining onto careers. */
export function degreeVerdictMap(combination: string): Map<string, ResolvedDegree> {
  const group = groupFor(combination);
  const out = new Map<string, ResolvedDegree>();
  if (!group) return out;
  for (const d of S.degrees) out.set(d.degree, resolveDegree(d, group));
  return out;
}

export function getDegree(name: string): Degree | undefined {
  return DEGREES_BY_NAME.get(name);
}
