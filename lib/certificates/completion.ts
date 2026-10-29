/**
 * Each certificate course's facts (lesson ids, modules, learning time), read
 * from the course content - so use it on the server (API route, server pages)
 * and pass the browser only the facts. The rule itself is ./status.ts.
 */
import { MONEY_COURSE } from "@/data/courses/money";
import { LEGAL_COURSE } from "@/data/courses/legal";
import { EXAMS_COURSE } from "@/data/courses/exams";
import { SCHOLARSHIPS_COURSE } from "@/data/courses/scholarships";
import { STUDY_ABROAD_COURSE } from "@/data/courses/studyAbroad";
import { RESEARCH_COURSE } from "@/data/courses/research";
import { BUILDER_TRACK } from "@/data/startups/content";
import type { CourseContent } from "@/lib/course/types";
import { CERT_COURSES } from "./catalog";
import type { CourseFacts } from "./status";

export { courseStatus, type CourseFacts } from "./status";

const LESSON_COURSES: Record<string, CourseContent> = Object.fromEntries(
  [MONEY_COURSE, LEGAL_COURSE, EXAMS_COURSE, SCHOLARSHIPS_COURSE, STUDY_ABROAD_COURSE, RESEARCH_COURSE].map((c) => [c.key, c]),
);

export function courseFacts(key: string): CourseFacts | null {
  const c = LESSON_COURSES[key];
  if (c) {
    const all = c.modules.flatMap((m) => m.lessons);
    return { key, lessons: all.length, minutes: all.reduce((s, l) => s + l.minutes, 0), lessonIds: all.map((l) => l.id) };
  }
  if (key === "startups") {
    const all = BUILDER_TRACK.modules.flatMap((m) => m.lessons);
    return {
      key, lessons: all.length, minutes: all.reduce((s, l) => s + l.durationMin, 0),
      modules: BUILDER_TRACK.modules.map((m) => ({ slug: m.slug, passMark: m.passMark })),
    };
  }
  return null;
}

export const ALL_COURSE_FACTS: CourseFacts[] = CERT_COURSES.map((c) => courseFacts(c.key)).filter((f): f is CourseFacts => !!f);
