"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchProjects, type ResearchProject } from "@/lib/research/clientProgress";

const ACCENT = "#7c3aed";

function nextDueStep(p: ResearchProject) {
  return p.steps.find((s) => s.status !== "DONE") ?? null;
}

export default function ResearchHomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[] | null>(null);

  useEffect(() => {
    if (!user?.uid) { setProjects([]); return; }
    fetchProjects(user.uid).then(setProjects);
  }, [user?.uid]);

  const active = (projects ?? []).filter((p) => p.status === "active");

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "8px 0 6px" }}>🔬 Research & Conferences</h1>
      <p style={{ color: "#666", margin: "0 0 28px", fontSize: 14 }}>
        Pick a real conference, work backwards from its date, and present your own research.
      </p>

      {projects === null && <p style={{ color: "#888" }}>Loading…</p>}

      {projects !== null && active.length === 0 && (
        <div style={{ border: `1px solid ${ACCENT}40`, background: `${ACCENT}0d`, borderRadius: 14, padding: "20px", marginBottom: 24, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#333", margin: "0 0 14px" }}>You haven't started a research project yet.</p>
          <Link href="/account/research/projects/new" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 10, background: ACCENT, color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 13.5 }}>
            Start a project →
          </Link>
        </div>
      )}

      {active.map((p) => {
        const next = nextDueStep(p);
        return (
          <Link key={p.id} href={`/account/research/projects/${p.id}`} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "16px 20px", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{p.conferenceTitle}</div>
              <div style={{ fontSize: 12.5, color: "#888", marginTop: 4 }}>{p.question || "No question written yet"}</div>
              {next && <div style={{ fontSize: 12, color: ACCENT, marginTop: 8, fontWeight: 600 }}>Next: {next.title} · due {new Date(next.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>}
            </div>
          </Link>
        );
      })}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        <Link href="/account/research/conferences" style={{ textDecoration: "none" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>🗓️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1a1a1a" }}>Conference Finder</div>
              <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>Real, verified research opportunities in India and worldwide</div>
            </div>
          </div>
        </Link>
        <Link href="/account/research/studio" style={{ textDecoration: "none" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>📚</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1a1a1a" }}>Research Studio</div>
              <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>8 short units - from a good question to presenting with confidence</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
