import Link from "next/link";
import { notFound } from "next/navigation";
import { examBySlug } from "@/data/exams/exams";
import { syllabusFor } from "@/data/exams/syllabus";
import { StudyPlanner } from "@/components/exams/StudyPlanner";

export default function ExamPlanPage({ params }: { params: { examSlug: string } }) {
  const exam = examBySlug(params.examSlug);
  if (!exam) notFound();
  const syllabus = syllabusFor(exam.slug);
  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href={`/account/exams/${exam.slug}`} style={{ color: "#64748b", textDecoration: "none" }}>← {exam.name}</Link>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: ".08em" }}>Study planner and syllabus tracker</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>{exam.name}: plan backwards from exam day</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        Mark each unit as you study it. The plan spreads what is left across the weeks before your revision phase, and keeps adjusting as you go.
      </p>
      <StudyPlanner exam={exam} syllabus={syllabus} />
    </div>
  );
}
