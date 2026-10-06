import { LegalShell } from "@/components/legal/LegalShell";
import { LegalToolkit } from "@/components/legal/LegalToolkit";
import { PageHeader } from "@/components/course/fx";

export default function LegalToolkitPage() {
  return (
    <LegalShell>
      <div>
        <PageHeader icon="archive" eyebrow="Get organised" title="Evidence, timeline and deadlines" />
        <LegalToolkit />
      </div>
    </LegalShell>
  );
}
