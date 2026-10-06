import { LegalShell } from "@/components/legal/LegalShell";
import { ScenarioCards } from "@/components/legal/ScenarioCards";
import { PageHeader } from "@/components/course/fx";

export default function LegalLearnPage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 1040 }}>
        <PageHeader icon="users" eyebrow="Learn before you need it" title="What would you do?"
          subtitle="Short scenario cards with a choice to make. Try them on your own, or run one with a class." />
        <ScenarioCards />
      </div>
    </LegalShell>
  );
}
