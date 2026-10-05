import { FeatureCourseLayout } from "@/components/course/FeatureCourseLayout";
import { STUDY_ABROAD_COURSE } from "@/lib/course/featureCourses";

export default function StudyAbroadLayout({ children }: { children: React.ReactNode }) {
  return <FeatureCourseLayout course={STUDY_ABROAD_COURSE}>{children}</FeatureCourseLayout>;
}
