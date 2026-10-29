import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { LIST_COLUMNS, STUDENT_FRIENDLY } from "@/lib/jobs/search";
import type { JobListItem } from "@/lib/jobs/types";
import { fitJob, searchTerms, type MatchInput } from "@/lib/resume/match";
import type { Stage } from "@/lib/resume/resume";

export const dynamic = "force-dynamic";

const STAGES: Stage[] = ["school", "college", "professional"];

/**
 * POST /api/resume/matches { target, skills[], stage } - the live job-portal
 * listings that best fit a resume, with a fit score, the student's skills
 * each post mentions and the gaps. Reads with the public Supabase key (active
 * jobs only); nothing about the student is stored.
 */
export async function POST(req: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Jobs are not set up on this deployment yet." }, { status: 503 });
  }
  try {
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const input: MatchInput = {
      target: String(b.target ?? "").slice(0, 120),
      skills: (Array.isArray(b.skills) ? b.skills : []).map((s) => String(s).slice(0, 40)).slice(0, 30),
      stage: STAGES.includes(b.stage as Stage) ? (b.stage as Stage) : "college",
    };
    const db = getSupabaseClient();
    const cols = `${LIST_COLUMNS},description`;
    const base = () => db.from("jobs").select(cols).eq("is_active", true);
    const { role, skills } = searchTerms(input);
    const reads = [
      role ? base().textSearch("search", role, { type: "websearch", config: "simple" }).order("posted_at", { ascending: false, nullsFirst: false }).limit(80) : null,
      skills ? base().textSearch("search", skills, { type: "websearch", config: "simple" }).order("posted_at", { ascending: false, nullsFirst: false }).limit(80) : null,
      input.stage !== "professional" ? base().or(STUDENT_FRIENDLY).order("posted_at", { ascending: false, nullsFirst: false }).limit(60) : null,
    ].filter(Boolean);
    const results = await Promise.all(reads);
    const pool = new Map<string, JobListItem & { description: string | null; reported_count?: number }>();
    for (const r of results) {
      if (r!.error) throw new Error(r!.error.message);
      for (const j of (r!.data ?? []) as unknown as (JobListItem & { description: string | null; reported_count?: number })[]) pool.set(j.id, j);
    }
    const ranked = [...pool.values()]
      .filter((j) => (j.reported_count ?? 0) < 3)
      .map((j) => ({ j, fit: fitJob(j, input) }))
      .filter((x) => x.fit.score >= 20)
      .sort((a, b) => b.fit.score - a.fit.score || (b.j.posted_at ?? "").localeCompare(a.j.posted_at ?? ""))
      .slice(0, 15)
      .map(({ j, fit }) => {
        const { description, reported_count: _r, ...job } = j;
        return { ...job, description: (description ?? "").slice(0, 4000), fit };
      });
    return NextResponse.json({ jobs: ranked, searched: pool.size });
  } catch (e) {
    console.error("[resume] matches failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Couldn't load matching jobs right now. Please try again." }, { status: 500 });
  }
}
