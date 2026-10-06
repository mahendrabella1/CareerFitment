import Link from "next/link";
import { STUDY_ABROAD_COURSES } from "@/data/studyAbroad/courses";
import { PageHeader } from "@/components/course/fx";

export default function CoursesListPage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="cap" eyebrow="Courses" title="Popular courses" subtitle="Where Indian students most often study abroad, and an honest note on each." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {STUDY_ABROAD_COURSES.map((c) => (
          <Link key={c.slug} href={`/account/study-abroad/courses/${c.slug}`} className="fx-lift" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 4, border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", background: "#fff" }}>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{c.name}</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>{c.typicalLength}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#7c3aed", marginTop: "auto", paddingTop: 6 }}>Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
