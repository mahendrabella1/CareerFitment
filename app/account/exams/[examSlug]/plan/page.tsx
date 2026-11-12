import { notFound } from "next/navigation";
import { examBySlug } from "@/data/exams/exams";
import { syllabusFor } from "@/data/exams/syllabus";
import { StudyPlanner } from "@/components/exams/StudyPlanner";
import { PageHeader } from "@/components/course/fx";

export default async function ExamPlanPage(props: { params: Promise<{ examSlug: string }> }) {
  const params = await props.params;
  const exam = examBySlug(params.examSlug);
  if (!exam) notFound();
  const syllabus = syllabusFor(exam.slug);
  return (
    <div className="fx-narrow" style={{ maxWidth: 880 }}>
      <PageHeader back={{ href: `/account/exams/${exam.slug}`, label: exam.name }} icon="calendar" eyebrow="Study planner and syllabus tracker"
        title={`${exam.name}: plan backwards from exam day`}
        subtitle="Mark each unit as you study it. The plan spreads what is left across the weeks before your revision phase, and keeps adjusting as you go." />
      <StudyPlanner exam={exam} syllabus={syllabus} />
    </div>
  );
}
