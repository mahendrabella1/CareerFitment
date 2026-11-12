import { notFound } from "next/navigation";
import { courseBySlug } from "@/data/studyAbroad/courses";
import { CoursePageView } from "@/components/studyAbroad/CoursePageView";

export default async function CourseDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const course = courseBySlug(params.slug);
  if (!course) notFound();
  return (
    <div className="fx-narrow" style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <CoursePageView course={course} />
    </div>
  );
}
