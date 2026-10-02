import { notFound } from "next/navigation";
import { legalGuideBySlug } from "@/data/legal/guides";
import { LegalShell } from "@/components/legal/LegalShell";
import { GuideView } from "@/components/legal/GuideView";

export default function LegalGuidePage({ params }: { params: { slug: string } }) {
  const guide = legalGuideBySlug(params.slug);
  if (!guide) notFound();
  return (
    <LegalShell>
      <GuideView guide={guide} />
    </LegalShell>
  );
}
