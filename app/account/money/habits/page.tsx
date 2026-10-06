import { HabitsTracker } from "@/components/money/HabitsTracker";
import { PageHeader } from "@/components/course/fx";

export default function MoneyHabitsPage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <PageHeader icon="pulse" eyebrow="Real money habits" title="Track what you really spend" />
      <HabitsTracker />
    </div>
  );
}
