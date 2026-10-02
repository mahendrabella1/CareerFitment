"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { ExamDef } from "@/data/exams/exams";
import { evaluate } from "@/lib/exams/eligibility";
import { fetchExamProfile, type ExamProfile } from "@/lib/exams/clientProfile";
import { fetchFollowedSlugs, followExam, unfollowExam } from "@/lib/exams/clientFollow";

const ACCENT = "#2563eb";

// Real, free, official resources named in the spec itself - never a paid
// third-party prep service, per the "no api costs" instruction.
const GENERAL_PREP_LINKS = [
  { label: "NCERT textbooks (free, English & Hindi)", url: "https://ncert.nic.in/" },
  { label: "DIKSHA - free school-level lessons", url: "https://diksha.gov.in/" },
  { label: "SWAYAM / NPTEL - free college-level courses (IIT/university faculty)", url: "https://swayam.gov.in/" },
];

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

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/exams" style={{ color: "#999", textDecoration: "none" }}>← Entrance Exams</Link>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: "0 0 4px" }}>{exam.name}</h1>
      <p style={{ color: "#666", margin: "0 0 4px", fontSize: 14 }}>Conducted by {exam.body}</p>
      <a href={exam.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none" }}>Official website ↗</a>

      {user?.uid && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => { if (following) { unfollowExam(user.uid, exam.slug); setFollowing(false); } else { followExam(user.uid, exam.slug); setFollowing(true); } }}
            style={{ fontSize: 12.5, fontWeight: 700, padding: "8px 16px", borderRadius: 9, border: `1px solid ${ACCENT}`, background: following ? ACCENT : "#fff", color: following ? "#fff" : ACCENT, cursor: "pointer" }}
          >
            {following ? "Following this exam" : "Follow for deadline reminders"}
          </button>
        </div>
      )}

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginTop: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Your eligibility</div>
        {!profile ? (
          <p style={{ fontSize: 13, color: "#64748b" }}><Link href="/account/exams" style={{ color: ACCENT, fontWeight: 700 }}>Fill in your profile</Link> to see whether you're eligible for this exam.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result!.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 13, color: "#334155", padding: "8px 10px", borderRadius: 8, background: "#f8fafc" }}>{r.reason}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Dates</div>
        {exam.events.length === 0 ? (
          <p style={{ fontSize: 13, color: "#64748b" }}>{exam.cycle.tentative ? "No confirmed dates yet for this cycle - check the official site above." : "No upcoming events."}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {exam.events.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#334155" }}>{e.label}</span>
                <span style={{ color: "#0f172a", fontWeight: 700 }}>{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            ))}
          </div>
        )}
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, fontStyle: "italic" }}>Last checked {new Date(exam.cycle.checkedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} against {exam.cycle.sourceUrl.replace(/^https?:\/\//, "")}. Always confirm on the official site before applying.</p>
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Prepare</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a href={exam.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none" }}>Official syllabus, past papers & notices ↗</a>
          {GENERAL_PREP_LINKS.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>{l.label} ↗</a>
          ))}
        </div>
      </div>
    </div>
  );
}
