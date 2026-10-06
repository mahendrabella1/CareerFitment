import { LegalShell } from "@/components/legal/LegalShell";
import { RightsCards } from "@/components/legal/RightsCards";
import { PageHeader } from "@/components/course/fx";

export default function LegalRightsCardsPage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 980 }}>
        <PageHeader icon="shield" eyebrow="Keep them on your phone" title="Rights cards"
          subtitle={<>Short cards for the moments that matter. Save a card as an image to your phone&apos;s photos, or copy the text to share it. Each card links to its full guide.</>} />
        <RightsCards />
      </div>
    </LegalShell>
  );
}
