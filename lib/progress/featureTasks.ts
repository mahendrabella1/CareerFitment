/**
 * Tasks in a feature beyond its lessons: every tool page a student can use
 * (a calculator, the scholarship finder, the deadline calendar...) and every
 * catalogue (all scholarships, the exam directory, countries...) counted once.
 * A task is done once the student has opened it - visits are recorded by
 * components/ActivityTracker.tsx on users/{uid}.progress.visited[area].
 *
 * This file is only the shape and the matching, so the dashboard can use it
 * cheaply; the task lists are built on the server from the feature menus in
 * lib/progress/buildFeatureTasks.ts and served by /api/progress/tasks.
 */

export interface FeatureTask {
  id: string;
  label: string;
  href: string;
  /** "page": this page (and the pages under it unless `exact`).
   *  "any": a catalogue - any page under `href` that no "page" task claims. */
  kind: "page" | "any";
  exact?: boolean;
  /** For a catalogue: how many entries it has. */
  count?: number;
  /** The menu group it sits in. */
  group: string;
}

export interface FeatureTaskSpec {
  /** Feature key (lib/features/catalog.ts). */
  key: string;
  /** Activity area the visits are recorded under (lib/progress/activity.ts). */
  area: string;
  /** The feature's home page - opening it is not a task. Empty when it is one. */
  home: string;
  /** Lessons in the feature's course (0 when it has none). */
  lessons: number;
  tasks: FeatureTask[];
}

/** "/account/money/labs/" -> "/account/money/labs". */
export const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

const under = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/** The task a visited page counts towards, if any: the most specific "page"
 *  task first, then the most specific catalogue. */
export function taskFor(spec: FeatureTaskSpec, rawPath: string): FeatureTask | null {
  const path = normalizePath(rawPath);
  if (spec.home && path === spec.home) return null;
  let best: FeatureTask | null = null;
  for (const t of spec.tasks) {
    if (t.kind !== "page") continue;
    const hit = t.exact ? path === t.href : under(path, t.href);
    if (hit && (!best || t.href.length > best.href.length)) best = t;
  }
  if (best) return best;
  for (const t of spec.tasks) {
    if (t.kind === "any" && under(path, t.href) && (!best || t.href.length > best.href.length)) best = t;
  }
  return best;
}

/** Which tasks are done, and how many entries of each catalogue were opened. */
export function tasksDone(spec: FeatureTaskSpec, visited: string[] = []): { done: Set<string>; explored: Record<string, number> } {
  const done = new Set<string>();
  const explored: Record<string, number> = {};
  for (const p of new Set(visited.map(normalizePath))) {
    const t = taskFor(spec, p);
    if (!t) continue;
    done.add(t.id);
    if (t.kind === "any" && p !== t.href) explored[t.id] = (explored[t.id] ?? 0) + 1;
  }
  return { done, explored };
}
