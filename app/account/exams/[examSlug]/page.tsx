import { notFound } from "next/navigation";
import { examBySlug } from "@/data/exams/exams";
import { ExamDetailClient } from "@/components/exams/ExamDetailClient";

export default function ExamDetailPage({ params }: { params: { examSlug: string } }) {
  const exam = examBySlug(params.examSlug);
  if (!exam) notFound();
  return <ExamDetailClient exam={exam} />;
}
