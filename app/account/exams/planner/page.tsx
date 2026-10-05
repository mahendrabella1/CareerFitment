import Link from "next/link";
import { EXAMS } from "@/data/exams/exams";
import { SYLLABI } from "@/data/exams/syllabus";

const ACCENT = "#2563eb";

export default function ExamPlannerIndexPage() {
  const withSyllabus = SYLLABI.map((s) => ({ s, exam: EXAMS.find((e) => e.slug === s.examSlug) })).filter((x) => x.exam);
  const others = EXAMS.filter((e) => !SYLLABI.some((s) => s.examSlug === e.slug));
  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".08em" }}>Prepare</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Study planner and syllabus tracker</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 18px", maxWidth: 680 }}>
        Pick your exam. Track every unit of the syllabus and get a weekly plan that counts back from exam day. Plans are saved on your device.
      </p>

      <h2 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 10px" }}>With the syllabus built in</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 22 }}>
        {withSyllabus.map(({ s, exam }) => (
          <Link key={s.examSlug} href={`/account/exams/${s.examSlug}/plan`} style={{ textDecoration: "none", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", background: "#fff" }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a" }}>{exam!.name}</div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4 }}>{s.sections.reduce((n, sec) => n + sec.units.length, 0)} units · {s.official ? "official syllabus" : "commonly tested areas"}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 10px" }}>Any other exam (add your own topics)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {others.map((e) => (
          <Link key={e.slug} href={`/account/exams/${e.slug}/plan`} style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none", border: `1px solid ${ACCENT}40`, borderRadius: 999, padding: "6px 12px", background: "#fff" }}>
            {e.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
