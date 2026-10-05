"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProject, markStepDone, type ResearchProject } from "@/lib/research/clientProgress";
import { STUDIO_UNITS } from "@/data/research/studioUnits";

const ACCENT = "#7c3aed";

export default function ProjectTrackerPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ResearchProject | null | undefined>(undefined);

  useEffect(() => { fetchProject(params.id).then(setProject); }, [params.id]);

  const refresh = () => fetchProject(params.id).then(setProject);

  if (project === undefined) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading…</div>;
  if (project === null) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Project not found.</div>;

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <Link href="/account/research" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Research & Conferences</Link>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 2px" }}>{project.conferenceTitle}</h1>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 4px" }}>{project.conferenceOrganiser}</p>
      <p style={{ fontSize: 13.5, color: "#444", margin: "0 0 22px", fontStyle: "italic" }}>{project.question || "No question written yet"}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {project.steps.map((s) => {
          const unit = STUDIO_UNITS.find((u) => u.stepTitle === s.title);
          const overdue = s.status !== "DONE" && s.dueAt < Date.now();
          return (
            <div key={s.order} style={{ border: "1px solid #eee", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => markStepDone(project.id, s.order).then(refresh)} disabled={s.status === "DONE"}
                style={{
                  width: 22, height: 22, borderRadius: "50%", flex: "none", border: `1.5px solid ${s.status === "DONE" ? "#22c55e" : "#ccc"}`,
                  background: s.status === "DONE" ? "#22c55e" : "#fff", color: "#fff", fontSize: 12, cursor: s.status === "DONE" ? "default" : "pointer",
                }}>
                {s.status === "DONE" ? "✓" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1a1a" }}>{s.order}. {s.title}</div>
                <div style={{ fontSize: 11.5, color: overdue ? "#b91c1c" : "#999" }}>
                  due {new Date(s.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}{overdue ? " · overdue" : ""}
                </div>
              </div>
              {unit && <Link href={`/account/research/studio/${unit.slug}`} style={{ fontSize: 11.5, color: ACCENT, fontWeight: 600, whiteSpace: "nowrap" }}>Unit {unit.unit} →</Link>}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Link href={`/account/research/projects/${project.id}/sources`} style={{ flex: 1, textDecoration: "none" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 10, padding: "12px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
            📎 Sources ({project.sources.length})
          </div>
        </Link>
        <Link href={`/account/research/projects/${project.id}/abstract`} style={{ flex: 1, textDecoration: "none" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 10, padding: "12px", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
            ✍️ Abstract
          </div>
        </Link>
      </div>
    </div>
  );
}
