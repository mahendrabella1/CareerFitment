import { FeatureCourseLayout } from "@/components/course/FeatureCourseLayout";
import { LEGAL_COURSE } from "@/lib/course/featureCourses";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <FeatureCourseLayout course={LEGAL_COURSE}>{children}</FeatureCourseLayout>;
}
