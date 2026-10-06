import { PageHeader } from "@/components/course/fx";

const ACCENT = "#2563eb";

const STAGES: { stage: string; focus: string; doThis: string; exams: string }[] = [
  { stage: "Class 6-8", focus: "Curiosity and strong basics", doThis: "Read widely, build maths and reading habits, try one Olympiad for fun, and explore interests through clubs and projects.", exams: "Olympiads, NMMS (class 8), Navodaya/Sainik School entry where relevant" },
  { stage: "Class 9-10", focus: "Discover interests, choose a stream wisely", doThis: "Take a career-interest quiz, talk to people in a few different careers, understand what each stream actually leads to, and keep your NCERT basics strong.", exams: "Olympiad stages, INSPIRE-MANAK, state scholarships" },
  { stage: "Class 11", focus: "Choose 2-4 target exams and start", doThis: "Pick exams from your eligibility list, get the official syllabus, build a weekly study plan, and try a past paper by the end of the year.", exams: "Same, plus your first mock tests" },
  { stage: "Class 12", focus: "Board exams and entrance exams together", doThis: "Follow a month-by-month plan linking board and entrance topics, register on time, take full mocks, and keep backup options open.", exams: "JEE, NEET, CUET-UG, CLAT, NDA, NATA, design exams, IPMAT, state CETs" },
  { stage: "After class 12 (gap year)", focus: "A clear decision, not drift", doThis: "Decide whether a drop year is worth it using a real checklist (score gap, attempts left, finances, wellbeing) - and always register for a backup course.", exams: "Same exams, plus colleges still admitting" },
  { stage: "College", focus: "Plan the next step by year 2", doThis: "Decide between a job, higher study, an MBA, government service or studying abroad - start GATE, CAT, UPSC or GRE planning in year 2-3.", exams: "GATE, CAT, CUET-PG, UPSC, SSC, banking, GRE, GMAT, IELTS" },
  { stage: "Working professionals", focus: "Use limited time well", doThis: "Check age and attempt limits carefully, build a part-time study plan, and choose exams with real career value for your situation.", exams: "CAT, GMAT, UPSC (within age), state PSCs, certifications" },
];

export default function ExamsRoadmapPage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="route" eyebrow="Stage roadmap" title="What should I be doing this year?"
        subtitle="A stage-by-stage view - younger students get exploration and foundations, not pressure; older students get exact exam plans." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {STAGES.map((s, i) => (
          <div key={s.stage} style={{ border: "1px solid #e2e8f0", borderTop: `4px solid ${ACCENT}`, borderRadius: 12, padding: "14px 18px 16px", background: "#fff" }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", letterSpacing: ".06em", textTransform: "uppercase" }}>Stage {i + 1}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{s.stage}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, marginTop: 2 }}>{s.focus}</div>
            <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: "8px 0" }}>{s.doThis}</p>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}><b>Exams & events:</b> {s.exams}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
