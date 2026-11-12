/**
 * Career-stage comparison without reading every row (performance audit P-06).
 * stressBenchmarks/_summary_{band} keeps a histogram (how many people scored
 * 0, 1, ... 100) for the overall score and each area. A POST moves the
 * person's old scores out and the new ones in, in the same transaction as
 * their row, so a GET reads one document and computes deciles from the counts.
 * Pure - shared by app/api/stress/benchmarks and the tests.
 */
export type Histogram = number[]; // 101 counts, index = score

export interface BenchmarkRow { overall: number; areas: Record<string, number> }

export interface BenchmarkSummary {
  kind: "summary";
  v: number;
  forBand: string;
  n: number;
  overall: Histogram;
  areas: Record<string, Histogram>;
}

export const summaryId = (band: string) => `_summary_${band}`;

const empty = (): Histogram => Array.from({ length: 101 }, () => 0);
const clampScore = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function emptySummary(v: number, band: string, areas: readonly string[]): BenchmarkSummary {
  return { kind: "summary", v, forBand: band, n: 0, overall: empty(), areas: Object.fromEntries(areas.map((a) => [a, empty()])) };
}

/** Add (+1) or remove (-1) one person's scores. Never goes below zero. */
export function applyRow(s: BenchmarkSummary, row: BenchmarkRow, sign: 1 | -1): BenchmarkSummary {
  const bump = (h: Histogram | undefined, score: number): Histogram => {
    const out = [...(h ?? empty())];
    const i = clampScore(score);
    out[i] = Math.max(0, (out[i] ?? 0) + sign);
    return out;
  };
  return {
    ...s,
    n: Math.max(0, s.n + sign),
    overall: bump(s.overall, row.overall),
    areas: Object.fromEntries(Object.keys(s.areas).map((a) => [a, bump(s.areas[a], row.areas[a] ?? 0)])),
  };
}

/** The score at 0, 10, ... 100% - the same points as sorting every score and indexing round(i/10 × (n-1)). */
export function decilesFromHistogram(h: Histogram): number[] {
  const n = h.reduce((t, c) => t + c, 0);
  if (!n) return Array.from({ length: 11 }, () => 0);
  const at = (k: number) => {
    let seen = 0;
    for (let score = 0; score < h.length; score++) {
      seen += h[score];
      if (seen > k) return score;
    }
    return 100;
  };
  return Array.from({ length: 11 }, (_, i) => at(Math.min(n - 1, Math.round((i / 10) * (n - 1)))));
}

/** Build a summary from scanned rows (the fallback, and to create the document the first time). */
export function summaryFromRows(v: number, band: string, areas: readonly string[], rows: BenchmarkRow[]): BenchmarkSummary {
  return rows.reduce((s, r) => applyRow(s, r, 1), emptySummary(v, band, areas));
}
