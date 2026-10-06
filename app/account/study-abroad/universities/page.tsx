import { UniversityBrowser } from "@/components/studyAbroad/UniversityBrowser";
import { PageHeader } from "@/components/course/fx";

export default function UniversitiesPage() {
  return (
    <div>
      <PageHeader icon="school" eyebrow="Universities and applications" title="Universities"
        subtitle="Judge fit and value, not just rank: the programme, total cost, location, job outcomes and your chance of admission matter more for most students. Add universities to your shortlist, then classify each programme as reach, match or safe." />
      <UniversityBrowser />
    </div>
  );
}
