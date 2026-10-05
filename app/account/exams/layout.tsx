import { FeatureCourseLayout } from "@/components/course/FeatureCourseLayout";
import { EXAMS_COURSE } from "@/lib/course/featureCourses";

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
  return <FeatureCourseLayout course={EXAMS_COURSE}>{children}</FeatureCourseLayout>;
}
