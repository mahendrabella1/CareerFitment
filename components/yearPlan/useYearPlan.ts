"use client";

/**
 * The signed-in student's Year Plan (lib/yearPlan/plan.ts): their class's
 * plan from /api/year-plan/<track> (built once at deploy, cached by the CDN),
 * checked against their own profile - the same records My Progress reads,
 * plus this device's lesson ticks (readCourseDone), so both always agree.
 * Working Professionals have no Year Plan.
 */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { trackIdFor } from "@/lib/commLab/scoring";
import { readCourseDone } from "@/lib/progress/progressStore";
import { factsFrom, planStatus, type PlanSource, type PlanStatus, type PlanTrackId } from "@/lib/yearPlan/plan";

const sources = new Map<string, Promise<PlanSource | null>>();
function loadSource(track: string): Promise<PlanSource | null> {
  let p = sources.get(track);
  if (!p) {
    p = fetch(`/api/year-plan/${track}`).then((r) => (r.ok ? (r.json() as Promise<PlanSource>) : null)).catch(() => null);
    sources.set(track, p);
    void p.then((s) => { if (!s) sources.delete(track); }); // try again next time
  }
  return p;
}

export function useYearPlan(): { status: PlanStatus | null; source: PlanSource | null; track: PlanTrackId | null; failed: boolean } {
  const { profile } = useAuth();
  const track: PlanTrackId | null = profile && profile.category !== "experienced_professional" ? trackIdFor(profile.category) : null;
  const [source, setSource] = useState<PlanSource | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!track) return;
    let live = true;
    void loadSource(track).then((s) => { if (live) { setSource(s); setFailed(!s); } });
    return () => { live = false; };
  }, [track]);
  const status = useMemo(() => {
    if (!source || !profile) return null;
    const facts = factsFrom(profile, (k) => readCourseDone(k, profile.progress?.courses?.[k]));
    return planStatus(source, facts, profile.createdAt);
  }, [source, profile]);
  return { status, source, track, failed };
}
