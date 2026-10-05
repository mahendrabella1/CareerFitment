import { notFound } from "next/navigation";
import { LEGAL_SCENARIOS } from "@/data/legal/scenarios";
import { ClassroomScenario } from "@/components/legal/ClassroomScenario";

export default function LegalClassroomPage({ params }: { params: { id: string } }) {
  const index = LEGAL_SCENARIOS.findIndex((s) => s.id === params.id);
  if (index < 0) notFound();
  const scenario = LEGAL_SCENARIOS[index];
  const nextId = LEGAL_SCENARIOS[(index + 1) % LEGAL_SCENARIOS.length].id;
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "8px 4px 40px" }}>
      <ClassroomScenario scenario={scenario} nextId={nextId} />
    </div>
  );
}
