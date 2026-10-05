import { FeatureCourseLayout } from "@/components/course/FeatureCourseLayout";
import { MONEY_COURSE } from "@/lib/course/featureCourses";

export default function MoneyLayout({ children }: { children: React.ReactNode }) {
  return <FeatureCourseLayout course={MONEY_COURSE}>{children}</FeatureCourseLayout>;
}
