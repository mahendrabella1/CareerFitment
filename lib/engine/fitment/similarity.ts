import {
  AptitudeVector,
  BigFiveVector,
  MiVector,
  RiasecLetter,
  RiasecVector,
  ValueTag,
} from "./types";

const RIASEC_LETTERS: RiasecLetter[] = ["R", "I", "A", "S", "E", "C"];

/**
 * Interest similarity — cosine between the two 6-D RIASEC vectors (blueprint
 * §8: interest is the workhorse matcher). Cosine captures *shape* (which
 * themes dominate) rather than absolute level, which is what Holland fit is.
 * Returns 0-1.
 */
export function riasecCosine(user: RiasecVector, career: RiasecVector): number {
  let dot = 0;
  let ua = 0;
  let ca = 0;
  for (const l of RIASEC_LETTERS) {
    const u = user[l] ?? 0;
    const c = career[l] ?? 0;
    dot += u * c;
    ua += u * u;
    ca += c * c;
  }
  if (ua === 0 || ca === 0) return 0;
  return clamp01(dot / (Math.sqrt(ua) * Math.sqrt(ca)));
}

/**
 * Aptitude similarity — threshold satisfaction (§8). For each required skill,
 * min(1, user/required): under-capability is penalised, over-capability capped
 * at 1. Averaged over the skills the career actually requires. Skills the user
 * didn't test are treated as "just meeting" (1) rather than failing, so a
 * missing aptitude bank doesn't zero out an otherwise strong match.
 */
export function aptitudeThresholdSat(
  user: AptitudeVector,
  required: AptitudeVector | undefined
): number | null {
  if (!required) return null;
  const skills = Object.keys(required) as (keyof AptitudeVector)[];
  if (skills.length === 0) return null;
  let sum = 0;
  for (const skill of skills) {
    const req = required[skill]!;
    if (req <= 0) {
      sum += 1;
      continue;
    }
    const u = user[skill];
    sum += u === undefined ? 1 : clamp01(u / req);
  }
  return sum / skills.length;
}

/** Big Five similarity — 1 − normalised euclidean distance over shared traits. */
export function bigFiveSim(
  user: BigFiveVector,
  ideal: BigFiveVector | undefined
): number | null {
  if (!ideal) return null;
  const traits = Object.keys(ideal) as (keyof BigFiveVector)[];
  const shared = traits.filter((t) => user[t] !== undefined);
  if (shared.length === 0) return null;
  let sq = 0;
  for (const t of shared) {
    const d = (user[t]! - ideal[t]!) / 100;
    sq += d * d;
  }
  return clamp01(1 - Math.sqrt(sq / shared.length));
}

/** MI similarity — 1 − normalised distance over shared intelligences. */
export function miSim(user: MiVector, ideal: MiVector | undefined): number | null {
  if (!ideal) return null;
  const keys = Object.keys(ideal) as (keyof MiVector)[];
  const shared = keys.filter((k) => user[k] !== undefined);
  if (shared.length === 0) return null;
  let sq = 0;
  for (const k of shared) {
    const d = (user[k]! - ideal[k]!) / 100;
    sq += d * d;
  }
  return clamp01(1 - Math.sqrt(sq / shared.length));
}

/**
 * Values similarity — overlap of the user's dominant values with the values a
 * career rewards. Uses the top-K user values weighted by rank so the strongest
 * driver counts most. Returns 0-1.
 */
export function valuesSim(
  userValues: { tag: ValueTag; score: number }[],
  careerValues: ValueTag[] | undefined,
  topK = 4
): number | null {
  if (!careerValues || careerValues.length === 0) return null;
  if (userValues.length === 0) return null;
  const top = userValues.slice(0, topK);
  const wanted = new Set(careerValues);
  let hit = 0;
  let total = 0;
  top.forEach((v, i) => {
    const w = topK - i; // rank weight: 4,3,2,1
    total += w;
    if (wanted.has(v.tag)) hit += w;
  });
  return total === 0 ? null : clamp01(hit / total);
}

/** EI similarity — how well the user's composite meets a role's minimum. */
export function eiSim(userEi: number | null, eiMin: number | undefined): number | null {
  if (eiMin === undefined || userEi === null) return null;
  if (eiMin <= 0) return 1;
  return clamp01(userEi / eiMin);
}

/**
 * Academic feasibility — a soft gate. If the career names entry subjects, use
 * the user's mean score on academic sub-traits that match those subjects
 * (best-effort name overlap); otherwise fall back to overall academic mean.
 */
export function academicFeasibility(
  academic: { name: string; score: number }[],
  entrySubjects: string[] | undefined
): number | null {
  if (academic.length === 0) return null;
  if (!entrySubjects || entrySubjects.length === 0) {
    return clamp01(mean(academic.map((a) => a.score)) / 100);
  }
  const matched: number[] = [];
  for (const subj of entrySubjects) {
    const hit = academic.find((a) =>
      a.name.toLowerCase().includes(subj.toLowerCase()) ||
      subj.toLowerCase().includes(a.name.toLowerCase().split(/[^a-z]/i)[0] ?? "")
    );
    if (hit) matched.push(hit.score);
  }
  const base = matched.length ? matched : academic.map((a) => a.score);
  return clamp01(mean(base) / 100);
}

function clamp01(x: number): number {
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function mean(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}
