import { notFound } from "next/navigation";
import Link from "next/link";
import { courseBySlug } from "@/data/studyAbroad/courses";
import { CoursePageView } from "@/components/studyAbroad/CoursePageView";

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = courseBySlug(params.slug);
  if (!course) notFound();
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad/courses" style={{ color: "#999", textDecoration: "none" }}>← Courses</Link>
      </div>
      <CoursePageView course={course} />
    </div>
  );
}
