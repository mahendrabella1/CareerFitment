import Link from "next/link";
import type { CourseDef } from "@/data/studyAbroad/courses";
import { countryByCode } from "@/data/studyAbroad/countries";

const ACCENT = "#7c3aed";

export function CoursePageView({ course }: { course: CourseDef }) {
  const countries = course.oftenChosenCountries.map(countryByCode).filter(Boolean);
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>{course.name}</h1>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px" }}>Typical length: {course.typicalLength}</p>

      {countries.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Often-chosen countries</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {countries.map((c) => (
              <Link key={c!.code} href={`/account/study-abroad/countries/${c!.code}`} style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT, textDecoration: "none", border: `1px solid ${ACCENT}40`, borderRadius: 999, padding: "6px 13px" }}>{c!.flag} {c!.name}</Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>What to know</div>
        <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.6 }}>{course.whatToKnow}</p>
      </div>

      <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#3730a3", textTransform: "uppercase", marginBottom: 6 }}>Study it in India instead?</div>
        <p style={{ fontSize: 13, color: "#3730a3", margin: 0, lineHeight: 1.6 }}>{course.studyInIndiaInstead}</p>
      </div>

      <Link href="/account/study-abroad/roi" style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: ACCENT, padding: "11px 18px", borderRadius: 10, textDecoration: "none" }}>Run the ROI calculator for this course →</Link>
    </div>
  );
}
