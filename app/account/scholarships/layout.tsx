import { FeatureCourseLayout } from "@/components/course/FeatureCourseLayout";
import { SCHOLARSHIPS_COURSE } from "@/lib/course/featureCourses";

export default function ScholarshipsLayout({ children }: { children: React.ReactNode }) {
  return <FeatureCourseLayout course={SCHOLARSHIPS_COURSE}>{children}</FeatureCourseLayout>;
}
