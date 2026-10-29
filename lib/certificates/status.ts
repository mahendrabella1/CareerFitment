/**
 * How far along a course is - the rule certificates are issued by. Light (no
 * course content), so the server and the browser share it; the facts it reads
 * come from ./completion.ts on the server.
 *
 *   lesson courses: every lesson ticked off (progress.courses.<key>.done)
 *   Startups (Builder track): every module test passed
 */
import { moduleStatus, type ProgressMap } from "@/lib/startups/unlock";

/** What a course asks of the student: its lesson ids (lesson courses) or its modules (Startups). */
export interface CourseFacts {
  key: string;
  lessons: number;
  minutes: number;
  lessonIds?: string[];
  /** Startups: each module and the score its test needs. */
  modules?: { slug: string; passMark: number }[];
}

export function courseStatus(f: CourseFacts, input: { done?: string[]; startups?: ProgressMap | null }): { done: number; total: number; complete: boolean } {
  if (f.lessonIds) {
    const ticked = new Set(input.done ?? []);
    const done = f.lessonIds.filter((id) => ticked.has(id)).length;
    return { done, total: f.lessonIds.length, complete: f.lessonIds.length > 0 && done === f.lessonIds.length };
  }
  const p = input.startups ?? { lessonBestPercent: {}, moduleTestBestPercent: {} };
  const mods = f.modules ?? [];
  const done = mods.filter((m) => moduleStatus({ slug: m.slug, passMark: m.passMark, lessons: [] }, p) === "COMPLETED").length;
  return { done, total: mods.length, complete: mods.length > 0 && done === mods.length };
}
