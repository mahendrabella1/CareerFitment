import { SopHelper } from "@/components/studyAbroad/SopHelper";
import { PageHeader } from "@/components/course/fx";

export default function AbroadSopPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <PageHeader icon="answer" eyebrow="Apply" title="SOP and LOR helper"
        subtitle="A strong statement of purpose is specific: your goal, your evidence, and why this exact programme. Draft it here and get feedback on structure and clarity." />
      <SopHelper />
    </div>
  );
}
