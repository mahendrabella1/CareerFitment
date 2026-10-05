"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchProjects, type ResearchProject } from "@/lib/research/clientProgress";

export function ResearchActiveCard({ accent }: { accent: string }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[] | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setProjects([]);
      return;
    }
    fetchProjects(user.uid).then(setProjects);
  }, [user?.uid]);

  const active = (projects ?? []).find((p) => p.status === "active");
  const nextStep = active?.steps.find((s) => s.status !== "DONE") ?? null;

  if (projects === null) {
    return <div style={{ fontSize: 13, color: "#64748b" }}>Loading your project…</div>;
  }

  if (!active) {
    return (
      <div style={{ background: "#fff", border: `1px dashed ${accent}88`, borderRadius: 16, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13.5, color: "#475569" }}>You have not started a research project yet. Pick a conference and work backwards from its date.</span>
        <Link href="/account/research/projects/new" style={{ fontSize: 13, fontWeight: 800, color: "#fff", background: accent, padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>Start a project →</Link>
      </div>
    );
  }

  return (
    <Link href={`/account/research/projects/${active.id}`} style={{ textDecoration: "none" }}>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>Your active project</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{active.conferenceTitle}</div>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>{active.question || "No research question written yet"}</div>
        {nextStep && (
          <div style={{ fontSize: 12.5, color: accent, fontWeight: 700, marginTop: 8 }}>
            Next: {nextStep.title} · due {new Date(nextStep.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        )}
      </div>
    </Link>
  );
}
