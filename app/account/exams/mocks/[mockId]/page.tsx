import { notFound } from "next/navigation";
import { mockById } from "@/data/exams/mocks";
import { MockTestRunner } from "@/components/exams/MockTestRunner";
import { PageHeader } from "@/components/course/fx";

export default function MockTestPage({ params }: { params: { mockId: string } }) {
  const mock = mockById(params.mockId);
  if (!mock) notFound();
  return (
    <div style={{ maxWidth: 880 }}>
      <PageHeader back={{ href: "/account/exams/mocks", label: "All practice tests" }} icon="clock" eyebrow="Practice test" title={mock.title} />
      <MockTestRunner mock={mock} />
    </div>
  );
}
