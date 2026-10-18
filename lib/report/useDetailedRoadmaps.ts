"use client";

import { useEffect, useState } from "react";
import { detailedRoadmapsLoaded, loadDetailedRoadmaps } from "@/lib/report/careerRoadmapDetailed1112";

/**
 * True once the Class 11-12 detailed roadmaps (careerRoadmapDetailed1112.ts)
 * are loaded - or straight away when this assessment's report never uses them
 * (every class except 11-12 and Graduates). Pages that build a report call
 * this before buildCareerFit1112Sheets / buildCareerFitGradSheets. If loading
 * fails it still says ready: the report then shows its cluster roadmap
 * fallback, as it does for a career with no detailed roadmap.
 */
export function useDetailedRoadmapsReady(assessment: unknown): boolean {
  const a = assessment as { class11Output?: unknown; graduateOutput?: unknown } | null | undefined;
  const needs = Boolean(a && (a.class11Output || a.graduateOutput));
  const [loaded, setLoaded] = useState(detailedRoadmapsLoaded);
  useEffect(() => {
    if (!needs || detailedRoadmapsLoaded()) return;
    let live = true;
    loadDetailedRoadmaps().catch(() => undefined).then(() => { if (live) setLoaded(true); });
    return () => { live = false; };
  }, [needs]);
  return !needs || loaded || detailedRoadmapsLoaded();
}
