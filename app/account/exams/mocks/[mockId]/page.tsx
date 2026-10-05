import Link from "next/link";
import { notFound } from "next/navigation";
import { mockById } from "@/data/exams/mocks";
import { MockTestRunner } from "@/components/exams/MockTestRunner";

export default function MockTestPage({ params }: { params: { mockId: string } }) {
  const mock = mockById(params.mockId);
  if (!mock) notFound();
  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 10, fontSize: 13 }}>
        <Link href="/account/exams/mocks" style={{ color: "#64748b", textDecoration: "none" }}>← All practice tests</Link>
      </div>
      <MockTestRunner mock={mock} />
    </div>
  );
}
