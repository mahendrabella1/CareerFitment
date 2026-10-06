import { AbroadScholarshipFinder } from "@/components/studyAbroad/AbroadScholarshipFinder";
import { PageHeader } from "@/components/course/fx";

export default function AbroadScholarshipsPage() {
  return (
    <div>
      <PageHeader icon="award" eyebrow="Money" title="Scholarship finder"
        subtitle={<>The major study-abroad scholarships for Indian students, matched to where you want to go, your level and your work experience. Each one shows this cycle&apos;s status and the one requirement people most often miss.</>} />
      <AbroadScholarshipFinder />
    </div>
  );
}
