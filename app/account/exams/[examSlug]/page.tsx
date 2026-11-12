import { notFound } from "next/navigation";
import { examBySlug } from "@/data/exams/exams";
import { ExamDetailClient } from "@/components/exams/ExamDetailClient";

export default async function ExamDetailPage(props: { params: Promise<{ examSlug: string }> }) {
  const params = await props.params;
  const exam = examBySlug(params.examSlug);
  if (!exam) notFound();
  return <ExamDetailClient exam={exam} />;
}
