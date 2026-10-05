import { CourseLanding } from "@/components/course/CourseLanding";
import { STUDY_ABROAD_COURSE } from "@/data/courses/studyAbroad";

export default function StudyAbroadPage() {
  return <CourseLanding content={STUDY_ABROAD_COURSE} />;
}
