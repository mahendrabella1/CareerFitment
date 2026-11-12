/**
 * GET /api/year-plan/<t1|t2|t3|t4> - a class group's Year Plan content
 * (lib/yearPlan/source.ts): every task with its items and how each is
 * checked. Built once at deploy and served as a static file, so the browser
 * gets the plan without loading every course and lab itself.
 */
import { NextResponse } from "next/server";
import { buildPlanSource, PLAN_TRACKS } from "@/lib/yearPlan/source";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return PLAN_TRACKS.map((t) => ({ track: t.id }));
}

export async function GET(_req: Request, props: { params: Promise<{ track: string }> }) {
  const { track } = await props.params;
  const t = PLAN_TRACKS.find((x) => x.id === track);
  if (!t) return NextResponse.json({ error: "Unknown class group" }, { status: 404 });
  return NextResponse.json(buildPlanSource(t.id));
}
