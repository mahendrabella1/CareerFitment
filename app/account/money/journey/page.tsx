import { MoneyJourney } from "@/components/money/MoneyJourney";
import { PageHeader } from "@/components/course/fx";

export default function MoneyJourneyPage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <PageHeader icon="route" eyebrow="Money Life" title="Your Money Journey" />
      <MoneyJourney />
    </div>
  );
}
