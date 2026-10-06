import { WellbeingPage } from "@/components/exams/WellbeingPage";
import { PageHeader } from "@/components/course/fx";

export default function ExamsWellbeingPage() {
  return (
    <div>
      <PageHeader icon="heart" eyebrow="Wellbeing and honest guidance" title="Plan the next step without pressure" />
      <WellbeingPage />
    </div>
  );
}
