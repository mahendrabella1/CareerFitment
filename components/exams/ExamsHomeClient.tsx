"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { EXAMS, type ExamDef } from "@/data/exams/exams";
import { evaluate, type Verdict } from "@/lib/exams/eligibility";
import { fetchExamProfile, saveExamProfile, type ExamProfile } from "@/lib/exams/clientProfile";
import { fetchFollowedSlugs, followExam, unfollowExam, fetchAlertsSentKeys, recordAlertSent } from "@/lib/exams/clientFollow";
import { dueAlerts, upcomingEvents } from "@/lib/exams/alertLogic";

const ACCENT = "#2563eb";

const LEVEL_OPTIONS = [
  { value: "class5", label: "Class 5" }, { value: "class6", label: "Class 6" }, { value: "class7", label: "Class 7" }, { value: "class8", label: "Class 8" },
  { value: "class9", label: "Class 9" }, { value: "class10", label: "Class 10" },
  { value: "class11", label: "Class 11" }, { value: "class12", label: "Class 12 (appearing)" },
  { value: "ug", label: "Undergraduate, years 1 to 3" },
  { value: "ugFinal", label: "Final-year undergraduate" }, { value: "graduate", label: "Graduate or postgraduate" }, { value: "working", label: "Working" },
];
const STREAM_SUBJECTS: Record<string, string[]> = {
  PCM: ["Physics", "Chemistry", "Mathematics"],
  PCB: ["Physics", "Chemistry", "Biology"],
  PCMB: ["Physics", "Chemistry", "Mathematics", "Biology"],
  Commerce: ["Accountancy", "Business Studies", "Economics"],
  Arts: ["History", "Political Science", "Economics"],
  Other: [],
};
const VERDICT_META: Record<Verdict, { label: string; bg: string; fg: string }> = {
  ELIGIBLE: { label: "Eligible now", bg: "#dcfce7", fg: "#166534" },
  SOON: { label: "Eligible soon", bg: "#dbeafe", fg: "#1e40af" },
  CHECK: { label: "Check needed", bg: "#fef3c7", fg: "#92400e" },
  NOT_ELIGIBLE: { label: "Not eligible", bg: "#fee2e2", fg: "#991b1b" },
};
const VERDICT_ORDER: Verdict[] = ["ELIGIBLE", "SOON", "CHECK", "NOT_ELIGIBLE"];

function ProfileForm({ initial, onSave }: { initial: ExamProfile | null; onSave: (p: ExamProfile) => void }) {
  const [level, setLevel] = useState(initial?.level ?? "class12");
  const [dob, setDob] = useState(initial?.dob ?? "");
  const [stream, setStream] = useState<string>(() => {
    const subs = initial?.subjects ?? [];
    return Object.entries(STREAM_SUBJECTS).find(([, s]) => s.length && s.every((x) => subs.includes(x)))?.[0] ?? "PCM";
  });
  const [class12Pct, setClass12Pct] = useState(initial?.class12Pct?.toString() ?? "");
  const [class12Status, setClass12Status] = useState<"passed" | "appearing">(initial?.class12Status ?? "appearing");
  const [gradPct, setGradPct] = useState(initial?.gradPct?.toString() ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");

  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#1e293b" };
  const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 5, marginTop: 14, display: "block" };

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Your profile</div>
      <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0" }}>Used only to check which exams you're eligible for - never shown to anyone else.</p>

      <label style={label}>Current class / level</label>
      <select style={input} value={level} onChange={(e) => setLevel(e.target.value)}>
        {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <label style={label}>Date of birth</label>
      <input style={input} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

      <label style={label}>Stream / subjects</label>
      <select style={input} value={stream} onChange={(e) => setStream(e.target.value)}>
        {Object.keys(STREAM_SUBJECTS).map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {(level === "class11" || level === "class12") && (
        <>
          <label style={label}>Class 12 status</label>
          <select style={input} value={class12Status} onChange={(e) => setClass12Status(e.target.value as "passed" | "appearing")}>
            <option value="appearing">Appearing this year</option>
            <option value="passed">Already passed</option>
          </select>
        </>
      )}

      <label style={label}>Class 12 percentage (if known)</label>
      <input style={input} type="number" min={0} max={100} placeholder="e.g. 85" value={class12Pct} onChange={(e) => setClass12Pct(e.target.value)} />

      <label style={label}>Graduation percentage (if applicable)</label>
      <input style={input} type="number" min={0} max={100} placeholder="e.g. 70" value={gradPct} onChange={(e) => setGradPct(e.target.value)} />

      <label style={label}>Category (optional - used only for official relaxations, never shown to anyone)</label>
      <select style={input} value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Prefer not to say / General</option>
        <option value="OBC">OBC</option>
        <option value="SC">SC</option>
        <option value="ST">ST</option>
        <option value="EWS">EWS</option>
        <option value="PwBD">PwBD</option>
      </select>

      <button
        style={{ marginTop: 18, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}
        onClick={() => onSave({
          level, dob, subjects: STREAM_SUBJECTS[stream] ?? [], class12Status,
          class12Pct: class12Pct ? Number(class12Pct) : undefined,
          gradPct: gradPct ? Number(gradPct) : undefined,
          category: category || undefined,
        })}
      >
        Save and see my exams
      </button>
    </div>
  );
}

export function ExamsHomeClient() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ExamProfile | null | undefined>(undefined); // undefined = loading
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }
    fetchExamProfile(user.uid).then(setProfile);
    fetchFollowedSlugs(user.uid).then((slugs) => setFollowed(new Set(slugs)));
  }, [user?.uid]);

  // Visit-triggered deadline alerts - see lib/exams/alertLogic.ts's header
  // comment on why this replaces a cron job.
  useEffect(() => {
    if (!user?.uid || !user.email || !profile || followed.size === 0) return;
    (async () => {
      const followedExams = EXAMS.filter((e) => followed.has(e.slug));
      const alertsSent = await fetchAlertsSentKeys(user.uid);
      const due = dueAlerts(followedExams, alertsSent);
      for (const alert of due) {
        const res = await fetch("/api/exams/send-alert", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: user.email, examName: alert.examName, message: alert.message, officialUrl: EXAMS.find((e) => e.slug === alert.examSlug)?.officialUrl }),
        }).then((r) => r.json()).catch(() => ({ success: false }));
        if (res.success) await recordAlertSent(user.uid, alert.examSlug, alert.eventKind);
      }
    })();
  }, [user?.uid, user?.email, profile, followed]);

  if (profile === undefined) {
    return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading…</div>;
  }

  const results = profile ? EXAMS.map((exam) => ({ exam, result: evaluate(exam.cycle.rules, profile) })) : [];
  const byVerdict: Record<Verdict, { exam: ExamDef; result: ReturnType<typeof evaluate> }[]> = { ELIGIBLE: [], SOON: [], CHECK: [], NOT_ELIGIBLE: [] };
  for (const r of results) byVerdict[r.result.verdict].push(r);

  const followedExams = EXAMS.filter((e) => followed.has(e.slug));
  const radar = upcomingEvents(followedExams);

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account" style={{ color: "#999", textDecoration: "none" }}>← Dashboard</Link>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>🧭 Entrance Exams & Eligibility</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>
        Tell us your profile once - we'll show only the exams you're eligible for, now or soon, and track your deadlines.
      </p>
      <div style={{ marginBottom: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Link href="/account/exams/roadmap" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>What should I be doing this year? →</Link>
        <Link href="/account/exams/planner" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Study planner →</Link>
        <Link href="/account/exams/mocks" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Practice mocks →</Link>
        <Link href="/account/exams/wellbeing" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Wellbeing and backup paths →</Link>
      </div>

      {(!profile || editingProfile) && (
        <ProfileForm
          initial={profile ?? null}
          onSave={(p) => { if (user?.uid) saveExamProfile(user.uid, p); setProfile(p); setEditingProfile(false); }}
        />
      )}

      {profile && !editingProfile && (
        <>
          <button onClick={() => setEditingProfile(true)} style={{ marginBottom: 20, fontSize: 12.5, fontWeight: 700, color: ACCENT, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Edit my profile
          </button>

          {radar.length > 0 && (
            <div style={{ border: `1px solid ${ACCENT}35`, background: `${ACCENT}08`, borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>Deadline radar</div>
              {radar.slice(0, 5).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderTop: i ? "1px solid #e2e8f0" : "none" }}>
                  <span style={{ color: "#1e293b", fontWeight: 600 }}>{r.exam.name} - {r.event.label}</span>
                  <span style={{ color: r.daysAway <= 7 ? "#b91c1c" : "#64748b", fontWeight: 700 }}>{r.daysAway === 0 ? "Today" : `${r.daysAway} day${r.daysAway === 1 ? "" : "s"}`}</span>
                </div>
              ))}
            </div>
          )}

          {VERDICT_ORDER.map((v) => {
            const group = byVerdict[v];
            if (!group.length) return null;
            const meta = VERDICT_META[v];
            return (
              <div key={v} style={{ marginBottom: 22 }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: meta.bg, color: meta.fg, marginBottom: 10 }}>{meta.label} ({group.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {group.map(({ exam, result }) => (
                    <Link key={exam.slug} href={`/account/exams/${exam.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{exam.name}</div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{result.reasons[0]?.reason ?? ""}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            if (!user?.uid) return;
                            if (followed.has(exam.slug)) { unfollowExam(user.uid, exam.slug); setFollowed((s) => { const n = new Set(s); n.delete(exam.slug); return n; }); }
                            else { followExam(user.uid, exam.slug); setFollowed((s) => new Set(s).add(exam.slug)); }
                          }}
                          style={{ flex: "none", fontSize: 11.5, fontWeight: 700, padding: "6px 12px", borderRadius: 8, border: `1px solid ${ACCENT}`, background: followed.has(exam.slug) ? ACCENT : "#fff", color: followed.has(exam.slug) ? "#fff" : ACCENT, cursor: "pointer" }}
                        >
                          {followed.has(exam.slug) ? "Following" : "Follow"}
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
