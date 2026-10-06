import { RealLifeSim } from "@/components/money/RealLifeSim";
import { PageHeader } from "@/components/course/fx";

export default function RealLifePage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <PageHeader icon="clock" eyebrow="Money Life · Real Life world" title="Fast-forward ten years" />
      <RealLifeSim />
    </div>
  );
}
