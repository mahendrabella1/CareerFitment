/**
 * Career-stage comparison for the Workplace Stress Check.
 *
 * POST (signed in): records the caller's latest scores - band, overall score
 * and the 4 area scores only, no answers or identity beyond the doc id - in
 * the server-only collection stressBenchmarks/{uid}, so each person counts once.
 * GET ?band=0-5: deciles of the overall score and each area for that band, once
 * at least MIN_N people have taken the current check; until then { ready: false }.
 *
 * Performance audit P-06: GET reads one summary document per band
 * (stressBenchmarks/_summary_{band}, a score histogram kept up to date by each
 * POST in the same transaction - lib/stress/benchmarkSummary.ts) instead of
 * every row. If the summary doesn't exist yet, GET scans once, answers from
 * the rows and writes the summary.
 */
import { NextResponse } from "next/server";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { verifySignIn } from "@/lib/firebase/adminAuth";
import { isBand } from "@/lib/stress/bank";
import { AREAS, type Band } from "@/lib/stress/types";
import { applyRow, decilesFromHistogram, summaryFromRows, summaryId, type BenchmarkRow, type BenchmarkSummary } from "@/lib/stress/benchmarkSummary";

export const dynamic = "force-dynamic";

const COLLECTION = "stressBenchmarks";
/** Only rows from the current check (3-answer scale) are comparable; earlier
 *  versions (no `v`, or v3's 5-point scale) are ignored. */
const VERSION = 4;
const MIN_N = 30;
const cache = new Map<Band, { at: number; body: unknown }>();

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100 ? Math.round(v) : null);

const bodyFrom = (s: BenchmarkSummary) => s.n < MIN_N
  ? { ready: false, n: s.n, needed: MIN_N }
  : { ready: true, n: s.n, overall: decilesFromHistogram(s.overall), areas: Object.fromEntries(AREAS.map((a) => [a, decilesFromHistogram(s.areas[a] ?? [])])) };

export async function GET(req: Request) {
  const band = new URL(req.url).searchParams.get("band");
  if (!isBand(band)) return NextResponse.json({ error: "Unknown band" }, { status: 400 });
  if (!isFirestoreConfigured()) return NextResponse.json({ ready: false, n: 0, reason: "not-configured" });
  const hit = cache.get(band);
  if (hit && Date.now() - hit.at < 10 * 60_000) return NextResponse.json(hit.body);
  try {
    const db = await getFirestore();
    const ref = db.collection(COLLECTION).doc(summaryId(band));
    const saved = (await ref.get()).data() as BenchmarkSummary | undefined;
    let summary: BenchmarkSummary;
    if (saved?.kind === "summary" && saved.v === VERSION) summary = saved;
    else {
      // First time for this band (or after a version change): scan once and keep the result.
      const snap = await db.collection(COLLECTION).where("band", "==", band).limit(20_000).get();
      const rows = snap.docs.map((d) => d.data()).filter((r) => r.v === VERSION) as BenchmarkRow[];
      summary = summaryFromRows(VERSION, band, AREAS, rows);
      await ref.set(summary);
    }
    const body = bodyFrom(summary);
    cache.set(band, { at: Date.now(), body });
    return NextResponse.json(body);
  } catch (e) {
    console.error("[stress] benchmarks failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ready: false, n: 0, reason: "error" });
  }
}

export async function POST(req: Request) {
  if (!isFirestoreConfigured()) return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const who = token ? await verifySignIn(token).catch(() => null) : null;
  if (!who) return NextResponse.json({ ok: false, reason: "sign-in" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { band?: unknown; overall?: unknown; areas?: Record<string, unknown> } | null;
  const overall = num(body?.overall);
  if (!body || !isBand(body.band) || overall === null) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  const areas: Record<string, number> = {};
  for (const a of AREAS) {
    const v = num(body.areas?.[a]);
    if (v === null) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
    areas[a] = v;
  }
  try {
    const db = await getFirestore();
    const band = body.band;
    const rowRef = db.collection(COLLECTION).doc(who.uid);
    await db.runTransaction(async (tx) => {
      const old = (await tx.get(rowRef)).data() as ({ v?: number; band?: Band } & BenchmarkRow) | undefined;
      const oldBand = old?.v === VERSION && isBand(old.band) ? old.band : null;
      const bands = [...new Set([band, ...(oldBand ? [oldBand] : [])])];
      const refs = bands.map((b) => db.collection(COLLECTION).doc(summaryId(b)));
      const sums = await Promise.all(refs.map((r) => tx.get(r)));
      // Summaries that exist are kept in step; a band without one is built from a scan on its next GET.
      bands.forEach((b, i) => {
        let s = sums[i].data() as BenchmarkSummary | undefined;
        if (s?.kind !== "summary" || s.v !== VERSION) return;
        if (oldBand === b && old) s = applyRow(s, old, -1);
        if (b === band) s = applyRow(s, { overall, areas }, 1);
        tx.set(refs[i], s);
      });
      tx.set(rowRef, { v: VERSION, band, overall, areas, at: new Date().toISOString() });
    });
    cache.delete(band);
    for (const b of cache.keys()) cache.delete(b);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[stress] benchmark save failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
