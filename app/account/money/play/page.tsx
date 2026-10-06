import { MoneyLifeSim } from "@/components/money/MoneyLifeSim";
import { PageHeader } from "@/components/course/fx";

export default function MoneyPlayPage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <PageHeader icon="wallet" eyebrow="Money Life simulation" title="Live a year with your money" />
      <MoneyLifeSim />
    </div>
  );
}
