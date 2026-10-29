/**
 * /account/progress - My Progress, for every class group. Built here on the
 * server so only the outline of each course (module and lesson titles, never
 * lesson text or quiz answers) and each feature's task list reach the browser.
 */
import { MONEY_COURSE } from "@/data/courses/money";
import { LEGAL_COURSE } from "@/data/courses/legal";
import { EXAMS_COURSE } from "@/data/courses/exams";
import { SCHOLARSHIPS_COURSE } from "@/data/courses/scholarships";
import { STUDY_ABROAD_COURSE } from "@/data/courses/studyAbroad";
import { RESEARCH_COURSE } from "@/data/courses/research";
import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import type { CourseContent } from "@/lib/course/types";
import { FEATURE_TASK_SPECS } from "@/lib/progress/buildFeatureTasks";
import { TRACKS as COMM_LAB_TRACKS } from "@/lib/commLab/content";
import { MyProgress, type CourseOutline } from "@/components/progress/MyProgress";

const outline = (c: CourseContent): CourseOutline => ({
  key: c.key,
  modules: c.modules.map((m) => ({ id: m.id, title: m.title, lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes })) })),
});

export default function MyProgressPage() {
  const courses = [MONEY_COURSE, LEGAL_COURSE, EXAMS_COURSE, SCHOLARSHIPS_COURSE, STUDY_ABROAD_COURSE, RESEARCH_COURSE].map(outline);
  const labTracks = COMM_LAB_TRACKS.map((t) => ({ id: t.id, modules: t.modules.map((m) => ({ id: m.id, title: m.title, lessons: m.lessons.map((l) => ({ id: l.id, title: l.title })) })) }));
  return <MyProgress courses={courses} track={toPublicTrack(BUILDER_TRACK)} tasks={FEATURE_TASK_SPECS} labTracks={labTracks} />;
}
