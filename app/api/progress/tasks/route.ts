/**
 * GET /api/progress/tasks - every feature's task list for progress bars
 * (lib/progress/buildFeatureTasks.ts). Built once at deploy and served as a
 * static file, so the dashboard gets the totals without loading the
 * catalogues' data itself.
 */
import { NextResponse } from "next/server";
import { FEATURE_TASK_SPECS } from "@/lib/progress/buildFeatureTasks";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(FEATURE_TASK_SPECS);
}
