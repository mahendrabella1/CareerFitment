import { RoiCalculator } from "@/components/studyAbroad/RoiCalculator";
import { PageHeader } from "@/components/course/fx";

export default function RoiPage() {
  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <PageHeader icon="score" eyebrow="Money check" title="ROI calculator" subtitle="Check the real numbers before you apply, not after an offer letter arrives." />
      <RoiCalculator />
    </div>
  );
}
