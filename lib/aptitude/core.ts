/**
 * Aptitude Lab - the shapes and the small helpers every question generator
 * uses. Maths and reasoning questions are generated in code, so the answer
 * and the worked solution are computed, never typed by hand (and practice
 * never runs out); verbal questions come from a written bank (verbal.ts).
 * Everything here is pure and seeded, so a seed always gives the same set
 * (a mock test can be reviewed exactly as it was taken).
 */

export type Section = "quant" | "reasoning" | "verbal" | "di";
export type Level = 1 | 2 | 3;

export const SECTION_LABEL: Record<Section, string> = { quant: "Quantitative", reasoning: "Logical reasoning", verbal: "Verbal ability", di: "Data interpretation" };
export const SECTIONS: Section[] = ["quant", "reasoning", "verbal", "di"];

export interface Table { caption: string; head: string[]; rows: (string | number)[][] }

/** One multiple-choice question: four options, one right. */
export interface Question {
  id: string;
  topic: string;
  section: Section;
  level: Level;
  stem: string;
  options: string[];
  answer: number;
  /** The worked solution, step by step. */
  solution: string[];
  table?: Table;
  passage?: string;
}

/** What a generator or a bank item gives; the set builder adds id/topic/section/level. */
export type Draft = Omit<Question, "id" | "topic" | "section" | "level">;

export type Rng = () => number;

/** A seeded generator (FNV-1a hash of the seed, then mulberry32). */
export function rngFrom(seed: string): Rng {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const int = (r: Rng, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
export const pick = <T>(r: Rng, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];
export function shuffle<T>(r: Rng, xs: readonly T[]): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

export const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
export const nCr = (n: number, k: number): number => (k < 0 || k > n ? 0 : Math.round(factorial(n) / (factorial(k) * factorial(n - k))));

/** A number as Indian readers write it: 12,50,000 - and at most two decimals, trailing zeros dropped. */
export function num(n: number): string {
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
export const rupees = (n: number) => `₹${num(n)}`;
/** A fraction in lowest terms ("3/4", "2", "-1/2"). */
export function frac(p: number, q: number): string {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  const a = p / g, b = q / g;
  return b === 1 ? String(a) : `${a}/${b}`;
}
/** "p/q", plus " = simplest" only when it simplifies ("3/36 = 1/12", but just "5/6"). */
export function fracEq(p: number, q: number): string { const s = frac(p, q); return s === `${p}/${q}` ? s : `${p}/${q} = ${s}`; }
/** "a : b", plus " = lowest terms" only when it reduces. */
export function ratioEq(a: number, b: number): string { const s = ratio(a, b); return s === `${a} : ${b}` ? s : `${a} : ${b} = ${s}`; }
/** A signed number with a proper minus sign. */
export const signed = (n: number) => (n < 0 ? `−${num(-n)}` : num(n));
/** "x" for 1x, "3x" otherwise. */
export const times = (k: number, v: string) => (k === 1 ? v : `${k}${v}`);
/** A ratio in lowest terms ("3 : 4"). */
export function ratio(a: number, b: number): string { const g = gcd(a, b) || 1; return `${a / g} : ${b / g}`; }

/**
 * Four options: the right one plus three distinct wrong ones from `wrong`
 * (common mistakes first), topped up from `extra` when mistakes coincide.
 * Throws if it can't find three - a generator bug the tests catch.
 */
export function choices(r: Rng, right: string, wrong: string[], extra: string[] = []): { options: string[]; answer: number } {
  const seen = new Set([right]);
  const picked: string[] = [];
  for (const w of [...wrong, ...extra]) {
    if (picked.length === 3) break;
    if (!w || seen.has(w)) continue;
    seen.add(w); picked.push(w);
  }
  if (picked.length < 3) throw new Error(`Not enough distinct options for "${right}"`);
  const options = shuffle(r, [right, ...picked]);
  return { options, answer: options.indexOf(right) };
}

/** Numeric options: wrong values from likely mistakes, then near misses (±1, ±2, ±10%...). */
export function numChoices(r: Rng, right: number, wrong: number[], fmt: (n: number) => string = num): { options: string[]; answer: number } {
  const near = [right + 1, right - 1, right + 2, right - 2, right * 1.1, right * 0.9, right + 5, right - 5, right * 2, right / 2, right + 10, right - 10]
    .map((n) => (Number.isInteger(right) ? Math.round(n) : Math.round(n * 100) / 100));
  const ok = (n: number) => Number.isFinite(n) && (right < 0 || n >= 0);
  return choices(r, fmt(right), shuffle(r, wrong).filter(ok).map(fmt), near.filter(ok).map(fmt));
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st ... */
export function ord(n: number): string {
  const t = n % 100;
  if (t >= 11 && t <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}
/** The smallest factor above 1 (n itself for a prime). */
export const smallestFactor = (n: number) => { for (let f = 2; f * f <= n; f++) if (n % f === 0) return f; return n; };
