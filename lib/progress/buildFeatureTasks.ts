/**
 * Every feature's task list for My Progress (lib/progress/featureTasks.ts),
 * built from the same menus the feature pages use (lib/course/featureCourses.ts):
 * each tool page is a task, each catalogue group ("directory") is one task,
 * and the feature's home page is not one. Career Library and Internships have
 * no course menu, so their tasks are listed here.
 *
 * Server-only in practice: the menus pull in every catalogue's data. Pages
 * import it on the server (app/account/progress/page.tsx); the dashboard
 * fetches the result from /api/progress/tasks.
 */
import * as NAV from "@/lib/course/featureCourses";
import type { FeatureCourse } from "@/lib/course/featureCourses";
import { MONEY_COURSE } from "@/data/courses/money";
import { LEGAL_COURSE } from "@/data/courses/legal";
import { EXAMS_COURSE } from "@/data/courses/exams";
import { SCHOLARSHIPS_COURSE } from "@/data/courses/scholarships";
import { STUDY_ABROAD_COURSE } from "@/data/courses/studyAbroad";
import { RESEARCH_COURSE } from "@/data/courses/research";
import type { CourseContent } from "@/lib/course/types";
import { normalizePath, type FeatureTask, type FeatureTaskSpec } from "./featureTasks";

const lessonsIn = (c: CourseContent) => c.modules.reduce((n, m) => n + m.lessons.length, 0);
const clean = (href: string) => normalizePath(href.split("#")[0].split("?")[0]);

/** The folder every entry of a catalogue sits in: ["/a/b/x", "/a/b/y"] -> "/a/b". */
function folderOf(hrefs: string[]): string {
  const parts = hrefs.map((h) => clean(h).split("/"));
  let n = 0;
  while (parts.every((p) => n < p.length - 1 && p[n] === parts[0][n])) n++;
  return parts[0].slice(0, n).join("/") || "/";
}

function fromMenu(key: string, area: string, nav: FeatureCourse, content: CourseContent): FeatureTaskSpec {
  const home = clean(nav.home);
  const tasks: FeatureTask[] = [];
  const seen = new Set<string>();
  for (const g of nav.groups) {
    const items = g.items.filter((i) => !i.planned && clean(i.href) !== home);
    if (g.directory) {
      const entries = items.filter((i) => !i.exact); // leave out the catalogue's own index page
      if (!entries.length) continue;
      tasks.push({ id: `${key}:${g.title}`, label: g.title, href: folderOf(entries.map((i) => i.href)), kind: "any", count: entries.length, group: g.title });
      continue;
    }
    for (const i of items) {
      const href = clean(i.href);
      if (seen.has(href)) continue;
      seen.add(href);
      tasks.push({ id: href, label: i.label, href, kind: "page", ...(i.exact ? { exact: true } : {}), group: g.title });
    }
  }
  return { key, area, home, lessons: lessonsIn(content), tasks };
}

export const FEATURE_TASK_SPECS: FeatureTaskSpec[] = [
  fromMenu("money", "money", NAV.MONEY_COURSE, MONEY_COURSE),
  fromMenu("legal", "legal", NAV.LEGAL_COURSE, LEGAL_COURSE),
  fromMenu("exams", "exams", NAV.EXAMS_COURSE, EXAMS_COURSE),
  fromMenu("scholarships", "scholarships", NAV.SCHOLARSHIPS_COURSE, SCHOLARSHIPS_COURSE),
  fromMenu("study-abroad", "study_abroad", NAV.STUDY_ABROAD_COURSE, STUDY_ABROAD_COURSE),
  fromMenu("research", "research", NAV.RESEARCH_COURSE, RESEARCH_COURSE),
  {
    key: "careers", area: "careers", home: "", lessons: 0,
    tasks: [
      { id: "/account/career-library", label: "Browse the career library", href: "/account/career-library", kind: "page", exact: true, group: "Explore" },
      { id: "careers:career", label: "Read about a career", href: "/account/career-library", kind: "any", group: "Explore" },
      { id: "/account/career-library/roadmaps", label: "Degree roadmaps", href: "/account/career-library/roadmaps", kind: "page", group: "Explore" },
    ],
  },
  {
    key: "internships", area: "internships", home: "", lessons: 0,
    tasks: [
      { id: "/account/internships-new", label: "Browse free programmes", href: "/account/internships-new", kind: "page", exact: true, group: "Explore" },
      { id: "internships:programme", label: "Open a programme", href: "/account/internships-new", kind: "any", group: "Explore" },
    ],
  },
];
