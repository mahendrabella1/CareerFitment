import { notFound } from "next/navigation";
import { LEGAL_SCENARIOS } from "@/data/legal/scenarios";
import { ClassroomScenario } from "@/components/legal/ClassroomScenario";

export default async function LegalClassroomPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const index = LEGAL_SCENARIOS.findIndex((s) => s.id === params.id);
  if (index < 0) notFound();
  const scenario = LEGAL_SCENARIOS[index];
  const nextId = LEGAL_SCENARIOS[(index + 1) % LEGAL_SCENARIOS.length].id;
  return (
    <div style={{ padding: "0 0 8px" }}>
      <ClassroomScenario scenario={scenario} nextId={nextId} />
    </div>
  );
}
