import { notFound } from "next/navigation";
import { mockById } from "@/data/exams/mocks";
import { MockTestRunner } from "@/components/exams/MockTestRunner";
import { PageHeader } from "@/components/course/fx";

export default async function MockTestPage(props: { params: Promise<{ mockId: string }> }) {
  const params = await props.params;
  const mock = mockById(params.mockId);
  if (!mock) notFound();
  return (
    <div className="fx-narrow" style={{ maxWidth: 880 }}>
      <PageHeader back={{ href: "/account/exams/mocks", label: "All practice tests" }} icon="clock" eyebrow="Practice test" title={mock.title} />
      <MockTestRunner mock={mock} />
    </div>
  );
}
