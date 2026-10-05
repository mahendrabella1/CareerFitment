import { FeatureCourseLayout } from "@/components/course/FeatureCourseLayout";
import { RESEARCH_COURSE } from "@/lib/course/featureCourses";

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <FeatureCourseLayout course={RESEARCH_COURSE}>{children}</FeatureCourseLayout>;
}
