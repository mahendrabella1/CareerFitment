import { notFound } from "next/navigation";
import { courseBySlug } from "@/data/studyAbroad/courses";
import { CoursePageView } from "@/components/studyAbroad/CoursePageView";

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courseBySlug(params.slug);
  if (!course) notFound();
  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <CoursePageView course={course} />
    </div>
  );
}
