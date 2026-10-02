// Narrow shapes instead of importing Track/Module from data/startups/
// content - this file runs in client components, and keeping it decoupled
// from the full (secret-bearing) content types means nothing here can ever
// accidentally import runtime quiz data. Satisfied by both the real content
// types and lib/startups/publicShape.ts's stripped PublicTrack/PublicModule.
interface UnlockLesson { slug: string; passMark: number }
interface UnlockModule { slug: string; passMark: number; lessons: UnlockLesson[] }
interface UnlockTrack { modules: UnlockModule[] }

export type LessonStatus = "LOCKED" | "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface ProgressMap {
  // key: `${moduleSlug}/${lessonSlug}` -> best percent (undefined = never attempted)
  lessonBestPercent: Record<string, number>;
  // key: moduleSlug -> best module test percent
  moduleTestBestPercent: Record<string, number>;
}

function lessonKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}/${lessonSlug}`;
}

/** A lesson unlocks when the previous lesson's quiz is passed; the first
 *  lesson of the first module is always open. Crossing a module boundary
 *  needs that PRECEDING module's test passed too - you don't get into
 *  Module 2's first lesson just by finishing Module 1's last lesson. */
export function lessonStatus(track: UnlockTrack, moduleSlug: string, lessonSlug: string, progress: ProgressMap): LessonStatus {
  const modules = track.modules;
  const mIdx = modules.findIndex((m) => m.slug === moduleSlug);
  const module = modules[mIdx];
  const lIdx = module.lessons.findIndex((l) => l.slug === lessonSlug);
  const best = progress.lessonBestPercent[lessonKey(moduleSlug, lessonSlug)];

  if (mIdx === 0 && lIdx === 0) return statusFromBest(best, module.lessons[0].passMark);

  if (lIdx > 0) {
    const prevLesson = module.lessons[lIdx - 1];
    const prevBest = progress.lessonBestPercent[lessonKey(moduleSlug, prevLesson.slug)];
    if (prevBest === undefined || prevBest < prevLesson.passMark) return "LOCKED";
    return statusFromBest(best, module.lessons[lIdx].passMark);
  }

  // First lesson of a module after the first: needs the PREVIOUS module's test passed.
  const prevModule = modules[mIdx - 1];
  const prevTestBest = progress.moduleTestBestPercent[prevModule.slug];
  if (prevTestBest === undefined || prevTestBest < prevModule.passMark) return "LOCKED";
  return statusFromBest(best, module.lessons[0].passMark);
}

function statusFromBest(best: number | undefined, passMark: number): LessonStatus {
  if (best === undefined) return "NOT_STARTED";
  return best >= passMark ? "COMPLETED" : "IN_PROGRESS";
}

/** A module test unlocks once every lesson in that module is COMPLETED. */
export function moduleTestUnlocked(module: UnlockModule, progress: ProgressMap): boolean {
  return module.lessons.every((l) => (progress.lessonBestPercent[lessonKey(module.slug, l.slug)] ?? 0) >= l.passMark);
}

export function moduleStatus(module: UnlockModule, progress: ProgressMap): LessonStatus {
  const testBest = progress.moduleTestBestPercent[module.slug];
  if (testBest !== undefined && testBest >= module.passMark) return "COMPLETED";
  if (moduleTestUnlocked(module, progress)) return "IN_PROGRESS";
  return "NOT_STARTED";
}

/** First lesson the learner hasn't finished yet, across the whole track -
 *  powers the "Continue where you left off" card. */
export function nextUnfinishedLesson(track: UnlockTrack, progress: ProgressMap): { moduleSlug: string; lessonSlug: string } | null {
  for (const module of track.modules) {
    for (const lesson of module.lessons) {
      const status = lessonStatus(track, module.slug, lesson.slug, progress);
      if (status !== "COMPLETED") return { moduleSlug: module.slug, lessonSlug: lesson.slug };
    }
  }
  return null; // whole track complete
}
