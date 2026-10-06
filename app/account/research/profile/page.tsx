import { ResearchProfileEditor } from "@/components/research/ResearchProfileEditor";
import { PageHeader } from "@/components/course/fx";

export default function ResearchProfilePage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <PageHeader icon="user" eyebrow="Show your work" title="Research profile"
        subtitle="A simple public page with the projects you choose to share, and a QR code for your poster. You decide what appears, and you can make it private again at any time." />
      <ResearchProfileEditor />
    </div>
  );
}
