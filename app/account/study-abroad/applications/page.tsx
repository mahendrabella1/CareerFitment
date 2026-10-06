import { AbroadApplications } from "@/components/studyAbroad/AbroadApplications";
import { PageHeader } from "@/components/course/fx";

export default function AbroadApplicationsPage() {
  return (
    <div style={{ maxWidth: 940 }}>
      <PageHeader icon="clusters" eyebrow="Apply" title="Shortlist and applications"
        subtitle="Label each programme reach, match or safe by comparing yourself with its typical admitted student, track every application from drafting to offer, then compare offers on the full cost." />
      <AbroadApplications />
    </div>
  );
}
