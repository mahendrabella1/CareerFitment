import { EssayHelper } from "@/components/scholarships/EssayHelper";
import { PageHeader } from "@/components/course/fx";

export default function ScholarshipEssayPage() {
  return (
    <div>
      <PageHeader icon="answer" eyebrow="Application studio" title="Essay and statement helper"
        subtitle="Most scholarships ask the same few questions. Prepare strong answers once, in your own words, then adapt them for each application." />
      <EssayHelper />
    </div>
  );
}
