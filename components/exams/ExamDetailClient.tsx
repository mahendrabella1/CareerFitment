"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { ExamDef } from "@/data/exams/exams";
import { MOCK_TESTS } from "@/data/exams/mocks";
import { syllabusFor } from "@/data/exams/syllabus";
import { evaluate } from "@/lib/exams/eligibility";
import { fetchExamProfile, type ExamProfile } from "@/lib/exams/clientProfile";
import { fetchFollowedSlugs, followExam, unfollowExam } from "@/lib/exams/clientFollow";
import { buildIcsCalendar, downloadFile } from "@/lib/calendar/ics";

const ACCENT = "#2563eb";

// Real, free, official resources named in the spec itself - never a paid
// third-party prep service, per the "no api costs" instruction.
const GENERAL_PREP_LINKS = [
  { label: "NCERT textbooks (free, English & Hindi)", url: "https://ncert.nic.in/" },
  { label: "DIKSHA - free school-level lessons", url: "https://diksha.gov.in/" },
  { label: "SWAYAM / NPTEL - free college-level courses (IIT/university faculty)", url: "https://swayam.gov.in/" },
];

const fmt = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function ExamDetailClient({ exam }: { exam: ExamDef }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ExamProfile | null | undefined>(undefined);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }
    fetchExamProfile(user.uid).then(setProfile);
    fetchFollowedSlugs(user.uid).then((slugs) => setFollowing(slugs.includes(exam.slug)));
  }, [user?.uid, exam.slug]);

  const result = profile ? evaluate(exam.cycle.rules, profile) : null;
  const mocks = MOCK_TESTS.filter((m) => m.examSlug === exam.slug);
  const syllabus = syllabusFor(exam.slug);
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = exam.events.filter((e) => (e.endDate ?? e.date) >= todayIso);

  const addToCalendar = () => {
    const events = upcoming.map((e) => ({
      title: `${exam.name}: ${e.label}`,
      description: `${e.tentative ? "Tentative date; " : ""}confirm on ${exam.officialUrl}`,
      date: new Date(`${e.date}T00:00:00`),
      url: exam.officialUrl,
      remindDaysBefore: e.kind === "regClose" ? [7, 2] : e.kind === "exam" ? [30, 7, 3] : [3],
    }));
    if (events.length) downloadFile(`${exam.slug}-dates.ics`, buildIcsCalendar(events, exam.name));
  };

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/account/exams/dashboard" style={{ color: "#64748b", textDecoration: "none" }}>← My exams and deadlines</Link>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>{exam.name}</h1>
      <p style={{ color: "#64748b", margin: "0 0 4px", fontSize: 14 }}>Conducted by {exam.body} · {exam.cycle.year} cycle</p>
      <a href={exam.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none" }}>
        Official website: {exam.officialUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
      </a>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
        {user?.uid && (
          <button
            onClick={() => { if (following) { unfollowExam(user.uid, exam.slug); setFollowing(false); } else { followExam(user.uid, exam.slug); setFollowing(true); } }}
            style={{ fontSize: 12.5, fontWeight: 700, padding: "8px 16px", borderRadius: 9, border: `1px solid ${ACCENT}`, background: following ? ACCENT : "#fff", color: following ? "#fff" : ACCENT, cursor: "pointer" }}
          >
            {following ? "Following this exam" : "Follow for deadline reminders"}
          </button>
        )}
        <Link href={`/account/exams/${exam.slug}/plan`} style={pill}>Study plan and syllabus tracker</Link>
        {mocks.length > 0 && <Link href={`/account/exams/mocks/${mocks[0].id}`} style={pill}>Take a practice mock</Link>}
      </div>

      {exam.pattern && (
        <div style={{ ...box, marginTop: 18 }}>
          <div style={boxTitle}>Exam pattern</div>
          <p style={{ fontSize: 13.5, color: "#334155", margin: 0, lineHeight: 1.6 }}>{exam.pattern}</p>
          {syllabus && <p style={{ fontSize: 12.5, color: "#64748b", margin: "6px 0 0" }}>Syllabus: {syllabus.sections.reduce((n, s) => n + s.units.length, 0)} units in the planner ({syllabus.official ? "official" : "commonly tested areas"}).</p>}
        </div>
      )}

      <div style={{ ...box, marginTop: 16 }}>
        <div style={boxTitle}>Your eligibility</div>
        {!profile ? (
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}><Link href="/account/exams/dashboard" style={{ color: ACCENT, fontWeight: 700 }}>Fill in your profile</Link> to see whether you&apos;re eligible for this exam.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result!.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 13, color: "#334155", padding: "8px 10px", borderRadius: 8, background: r.verdict === "ELIGIBLE" ? "#f0fdf4" : r.verdict === "NOT_ELIGIBLE" ? "#fef2f2" : "#f8fafc" }}>{r.reason}</div>
            ))}
          </div>
        )}
        <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "10px 0 0", fontStyle: "italic" }}>Based on the {exam.cycle.year} rules checked on {fmt(exam.cycle.checkedAt)}. Always confirm on the official website before applying.</p>
      </div>

      <div style={{ ...box, marginTop: 16 }}>
        <div style={boxTitle}>Dates</div>
        {exam.cycle.expected && <p style={{ fontSize: 13, color: "#475569", margin: "0 0 8px", lineHeight: 1.6 }}>{exam.cycle.expected}</p>}
        {exam.events.length === 0 ? (
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No dates have been announced for this cycle yet. Follow the exam to get a reminder when they are added.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {exam.events.map((e, i) => {
              const past = (e.endDate ?? e.date) < todayIso;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontSize: 13.5, borderTop: i ? "1px solid #f1f5f9" : "none", paddingTop: i ? 6 : 0, opacity: past ? 0.55 : 1 }}>
                  <span style={{ color: "#334155" }}>
                    {e.label}
                    {e.tentative && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: "#b45309", background: "#fef3c7", borderRadius: 999, padding: "1px 7px" }}>Tentative</span>}
                    {past && <span style={{ marginLeft: 6, fontSize: 11, color: "#94a3b8" }}>(passed)</span>}
                  </span>
                  <span style={{ color: "#0f172a", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmt(e.date)}{e.endDate ? ` to ${fmt(e.endDate)}` : ""}</span>
                </div>
              );
            })}
          </div>
        )}
        {upcoming.length > 0 && (
          <button onClick={addToCalendar} style={{ marginTop: 12, fontSize: 12.5, fontWeight: 800, color: ACCENT, background: "#fff", border: `1px solid ${ACCENT}`, borderRadius: 9, padding: "7px 12px", cursor: "pointer" }}>
            Add upcoming dates to my calendar (.ics)
          </button>
        )}
        <p style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 10, fontStyle: "italic" }}>
          Last checked {fmt(exam.cycle.checkedAt)} against <a href={exam.cycle.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#64748b" }}>{exam.cycle.sourceUrl.replace(/^https?:\/\//, "").split("/")[0]}</a>. Tentative dates can change; the official notice always wins.
        </p>
      </div>

      <div style={{ ...box, marginTop: 16 }}>
        <div style={boxTitle}>Prepare</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a href={exam.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none" }}>Official syllabus, past papers & notices ↗</a>
          {syllabus && <a href={syllabus.source.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>Syllabus source: {syllabus.source.label} ↗</a>}
          {GENERAL_PREP_LINKS.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>{l.label} ↗</a>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, border: "1px solid #fecaca", background: "#fef2f2" }}>
        <p style={{ fontSize: 12.5, color: "#991b1b", margin: 0, lineHeight: 1.55 }}>
          Exams never ask for payment through personal UPI IDs, phone calls or unofficial sites. Ignore &quot;guaranteed seat&quot; or &quot;management quota&quot; agents, and admit-card or result links forwarded on WhatsApp.
        </p>
      </div>
    </div>
  );
}

const box: CSSProperties = { border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 18px", background: "#fff" };
const boxTitle: CSSProperties = { fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8 };
const pill: CSSProperties = { fontSize: 12.5, fontWeight: 800, color: ACCENT, background: "#eff6ff", border: `1px solid ${ACCENT}40`, borderRadius: 9, padding: "8px 14px", textDecoration: "none" };
