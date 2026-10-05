import { CourseLanding } from "@/components/course/CourseLanding";
import { ScamAccuracyCard } from "@/components/course/ScamAccuracyCard";
import { MoneyHomeStatus } from "@/components/money/MoneyHomeStatus";
import { MONEY_COURSE } from "@/data/courses/money";

export default function MoneyHomePage() {
  return (
    <CourseLanding
      content={MONEY_COURSE}
      topSlot={
        <>
          <MoneyHomeStatus />
          <ScamAccuracyCard accent={MONEY_COURSE.accent} />
        </>
      }
    />
  );
}
