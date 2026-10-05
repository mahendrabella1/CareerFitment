import { CourseLanding } from "@/components/course/CourseLanding";
import { EXAMS_COURSE } from "@/data/courses/exams";

export default function ExamsPage() {
  return <CourseLanding content={EXAMS_COURSE} />;
}
