"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { PublicTrack } from "@/lib/startups/publicShape";
import { fetchProgress, fetchSkillScoresHistory } from "@/lib/startups/clientProgress";
import { moduleStatus, nextUnfinishedLesson, type ProgressMap } from "@/lib/startups/unlock";
import { readinessScore } from "@/lib/startups/scoring";

const ACCENT = "#f97316";
const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  COMPLETED: { bg: "#dcfce7", fg: "#166534", label: "Done" },
  IN_PROGRESS: { bg: "#fef3c7", fg: "#92400e", label: "In progress" },
  NOT_STARTED: { bg: "#f3f4f6", fg: "#6b7280", label: "Not started" },
};

export function StartupsHomeClient({ track }: { track: PublicTrack }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap | null>(null);
  const [readiness, setReadiness] = useState<{ overall: number; bySkill: Record<string, number> } | null>(null);

  useEffect(() => {
    if (!user?.uid) { setProgress({ lessonBestPercent: {}, moduleTestBestPercent: {} }); setReadiness({ overall: 0, bySkill: {} }); return; }
    fetchProgress(user.uid).then(setProgress);
    fetchSkillScoresHistory(user.uid).then((attempts) => {
      // Average every attempt's per-skill score across the learner's whole
      // history - simple version per the PDF (70% quiz / 30% mission; Phase
      // 1 has no mission-approval flow yet, so this is the quiz-only term).
      const sums: Record<string, { total: number; count: number }> = {};
      for (const a of attempts) {
        for (const [tag, score] of Object.entries(a.skillScores)) {
          sums[tag] ??= { total: 0, count: 0 };
          sums[tag].total += score; sums[tag].count += 1;
        }
      }
      const quizAverages = Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, Math.round(v.total / v.count)]));
      setReadiness(readinessScore(quizAverages));
    });
  }, [user?.uid]);

  if (!progress) {
    return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading your progress…</div>;
  }

  const next = nextUnfinishedLesson(track, progress);
  const nextModule = next ? track.modules.find((m) => m.slug === next.moduleSlug) : null;
  const nextLesson = nextModule?.lessons.find((l) => l.slug === next?.lessonSlug);

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account" style={{ color: "#999", textDecoration: "none" }}>← Dashboard</Link>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>🚀 Startups</h1>
      <p style={{ color: "#666", margin: "0 0 28px", fontSize: 14 }}>
        Finish with a real startup you've shaped yourself - watch, read, try it on your own idea, take the quiz.
      </p>

      {nextLesson && nextModule && (
        <Link href={`/account/startups/${track.slug}/${nextModule.slug}/${nextLesson.slug}`} style={{ textDecoration: "none" }}>
          <div style={{
            borderRadius: 14, padding: "18px 20px", marginBottom: 28, cursor: "pointer",
            background: `linear-gradient(110deg, ${ACCENT}14, #fff)`, border: `1px solid ${ACCENT}40`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: ACCENT }}>Continue where you left off</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginTop: 4 }}>{nextModule.title} → {nextLesson.title}</div>
          </div>
        </Link>
      )}

      {!next && (
        <div style={{ borderRadius: 14, padding: "18px 20px", marginBottom: 28, background: "#dcfce7", border: "1px solid #86efac" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#166534" }}>You've completed every module in the Builder track 🎉</div>
        </div>
      )}

      {readiness && readiness.overall > 0 && (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Startup Readiness Score</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{readiness.overall}</span>
          </div>
          {Object.entries(readiness.bySkill).map(([skill, score]) => (
            <div key={skill} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, marginBottom: 5 }}>
              <span style={{ width: 100, textTransform: "capitalize", color: "#666" }}>{skill.replace("-", " ")}</span>
              <div style={{ flex: 1, height: 5, background: "#eee", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${score}%`, height: "100%", background: ACCENT }} />
              </div>
              <span style={{ width: 28, textAlign: "right", color: "#999" }}>{score}</span>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>{track.title} track</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {track.modules.map((m) => {
          const status = moduleStatus(m, progress);
          const style = STATUS_STYLE[status];
          return (
            <Link key={m.slug} href={`/account/startups/${track.slug}/${m.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 15 }}>{m.order}. {m.title}</div>
                  <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>{m.lessons.length} lessons · mission: {m.missionText}</div>
                </div>
                <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: style.bg, color: style.fg, whiteSpace: "nowrap" }}>{style.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
        <Link href="/account/startups/placement" style={{ fontSize: 13, color: "#888" }}>Not sure which track fits? Take the 2-minute placement quiz</Link>
      </div>
      <div style={{ marginTop: 10 }}>
        <Link href="/account/startups/portfolio" style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>View your Startup Portfolio →</Link>
      </div>
      <div style={{ marginTop: 10 }}>
        <Link href="/account/startups/videos" style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>Watch the video library →</Link>
      </div>
    </div>
  );
}
