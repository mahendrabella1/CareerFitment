"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { PublicTrack } from "@/lib/startups/publicShape";
import { fetchProgress, submitTask } from "@/lib/startups/clientProgress";
import { lessonStatus, moduleStatus, moduleTestUnlocked, type ProgressMap } from "@/lib/startups/unlock";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#f97316";
const STATUS_DOT: Record<string, string> = { COMPLETED: "#22c55e", IN_PROGRESS: "#f59e0b", NOT_STARTED: "#d1d5db", LOCKED: "#e5e7eb" };

export function ModuleClient({ track, moduleSlug }: { track: PublicTrack; moduleSlug: string }) {
  const trackSlug = track.slug;
  const module = track.modules.find((m) => m.slug === moduleSlug)!;
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap | null>(null);
  const [missionText, setMissionText] = useState("");
  const [missionSaved, setMissionSaved] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProgress({ lessonBestPercent: {}, moduleTestBestPercent: {} }); return; }
    fetchProgress(user.uid).then(setProgress);
  }, [user?.uid]);

  if (!progress) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading…</div>;

  const testReady = moduleTestUnlocked(module, progress);
  const status = moduleStatus(module, progress);

  const saveMission = async () => {
    if (!user?.uid || !missionText.trim()) return;
    await submitTask(user.uid, module.slug, null, "mission", missionText.trim());
    setMissionSaved(true);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader back={{ href: "/account/startups", label: "All modules" }} icon="rocket" eyebrow={`Module ${module.order}`}
        title={module.title} subtitle={`Real-world mission: ${module.missionText}`} meta={[`Portfolio: ${module.portfolioItem}`]} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {module.lessons.map((l) => {
          const st = lessonStatus(track, module.slug, l.slug, progress);
          const locked = st === "LOCKED";
          const inner = (
            <div style={{
              border: "1px solid #eee", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
              opacity: locked ? 0.55 : 1,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: STATUS_DOT[st], flex: "none" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{l.title}</div>
                <div style={{ fontSize: 11.5, color: "#999" }}>{l.durationMin} min · {l.questionCount} questions</div>
              </div>
              {locked && <span style={{ fontSize: 11, color: "#aaa" }}>🔒</span>}
            </div>
          );
          return locked
            ? <div key={l.slug}>{inner}</div>
            : <Link key={l.slug} href={`/account/startups/${trackSlug}/${module.slug}/${l.slug}`} style={{ textDecoration: "none" }}>{inner}</Link>;
        })}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px", color: "#1a1a1a" }}>Real-world mission</h3>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 10px" }}>{module.missionText}</p>
        <textarea value={missionText} onChange={(e) => { setMissionText(e.target.value); setMissionSaved(false); }}
          placeholder="Write what you did / found…" rows={3}
          style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd", padding: 10, fontSize: 13, fontFamily: "inherit", resize: "vertical" }} />
        <button onClick={saveMission} disabled={!missionText.trim()}
          style={{ marginTop: 8, padding: "8px 16px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 13, cursor: missionText.trim() ? "pointer" : "default", opacity: missionText.trim() ? 1 : 0.5 }}>
          Save to Portfolio
        </button>
        {missionSaved && <span style={{ marginLeft: 10, fontSize: 12.5, color: "#166534" }}>Saved ✓</span>}
      </div>

      {testReady || status === "COMPLETED" ? (
        <Link href={`/account/startups/${trackSlug}/${module.slug}/test`} style={{ textDecoration: "none" }}>
          <div style={{ border: `1px solid ${ACCENT}50`, background: `${ACCENT}10`, borderRadius: 12, padding: "14px 18px", textAlign: "center", fontWeight: 700, color: ACCENT }}>
            {status === "COMPLETED" ? "Retake module test" : "Take the module test →"}
          </div>
        </Link>
      ) : (
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "14px 18px", textAlign: "center", color: "#aaa", fontSize: 13 }}>
          🔒 Finish every lesson above to unlock the module test
        </div>
      )}
    </div>
  );
}
