/**
 * Career-stage comparison for the Stress & Resilience Check.
 *
 * POST (signed in): records the caller's latest scores - band, index and the 8
 * pillars only, no answers or identity beyond the doc id - in the server-only
 * collection stressBenchmarks/{uid}, so each person counts once.
 * GET ?band=0-5: deciles of the index and each pillar for that band, once at
 * least MIN_N people have taken the check; until then { ready: false }.
 */
import { NextResponse } from "next/server";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { verifySignIn } from "@/lib/firebase/adminAuth";
import { isBand } from "@/lib/stress/bank";
import { PILLARS, type Band } from "@/lib/stress/types";

export const dynamic = "force-dynamic";

const COLLECTION = "stressBenchmarks";
const MIN_N = 30;
const cache = new Map<Band, { at: number; body: unknown }>();

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100 ? Math.round(v) : null);

/** Values at 0, 10, ... 100% of the sorted list. */
function deciles(values: number[]): number[] {
  const s = [...values].sort((a, b) => a - b);
  return Array.from({ length: 11 }, (_, i) => s[Math.min(s.length - 1, Math.round((i / 10) * (s.length - 1)))]);
}

export async function GET(req: Request) {
  const band = new URL(req.url).searchParams.get("band");
  if (!isBand(band)) return NextResponse.json({ error: "Unknown band" }, { status: 400 });
  if (!isFirestoreConfigured()) return NextResponse.json({ ready: false, n: 0, reason: "not-configured" });
  const hit = cache.get(band);
  if (hit && Date.now() - hit.at < 10 * 60_000) return NextResponse.json(hit.body);
  try {
    const db = await getFirestore();
    const snap = await db.collection(COLLECTION).where("band", "==", band).limit(20_000).get();
    const rows = snap.docs.map((d) => d.data());
    const body = rows.length < MIN_N
      ? { ready: false, n: rows.length, needed: MIN_N }
      : {
          ready: true,
          n: rows.length,
          index: deciles(rows.map((r) => r.index as number)),
          pillars: Object.fromEntries(PILLARS.map((p) => [p, deciles(rows.map((r) => (r.pillars?.[p] as number) ?? 0))])),
        };
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
  const body = (await req.json().catch(() => null)) as { band?: unknown; index?: unknown; pillars?: Record<string, unknown> } | null;
  const index = num(body?.index);
  if (!body || !isBand(body.band) || index === null) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  const pillars: Record<string, number> = {};
  for (const p of PILLARS) {
    const v = num(body.pillars?.[p]);
    if (v === null) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
    pillars[p] = v;
  }
  try {
    const db = await getFirestore();
    await db.collection(COLLECTION).doc(who.uid).set({ band: body.band, index, pillars, at: new Date().toISOString() });
    cache.delete(body.band);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[stress] benchmark save failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, reason: "error" }, { status: 500 });
  }
}
