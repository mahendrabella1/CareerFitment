import Link from "next/link";
import { STUDY_ABROAD_COURSES } from "@/data/studyAbroad/courses";

export default function CoursesListPage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad" style={{ color: "#999", textDecoration: "none" }}>← Study Abroad</Link>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Popular courses</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>Where Indian students most often study abroad, and an honest note on each.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STUDY_ABROAD_COURSES.map((c) => (
          <Link key={c.slug} href={`/account/study-abroad/courses/${c.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px" }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{c.typicalLength}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
