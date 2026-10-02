import { notFound } from "next/navigation";
import { letterTemplateBySlug } from "@/lib/legal/templates";
import { LegalShell } from "@/components/legal/LegalShell";
import { LetterBuilder } from "@/components/legal/LetterBuilder";

export default function LegalToolPage({ params }: { params: { tool: string } }) {
  const template = letterTemplateBySlug(params.tool);
  if (!template) notFound();
  return (
    <LegalShell>
      <LetterBuilder template={template} />
    </LegalShell>
  );
}
