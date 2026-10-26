import { LegalShell } from "@/components/legal/LegalShell";
import { Navigator } from "@/components/legal/Navigator";
import { FeatureLanding } from "@/components/feature/FeatureLanding";
import { LEGAL_COURSE } from "@/data/courses/legal";

export default function LegalHomePage() {
  return (
    <LegalShell>
      <FeatureLanding content={LEGAL_COURSE} afterBar topSlot={<Navigator />} />
    </LegalShell>
  );
}
