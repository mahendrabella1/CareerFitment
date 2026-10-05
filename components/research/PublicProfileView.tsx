import type { ResearchProfileDoc } from "@/lib/research/clientProfile";

const ACCENT = "#7c3aed";

/** How a research profile looks to the public. Shared by the preview and the public page. */
export function PublicProfileView({ profile }: { profile: ResearchProfileDoc }) {
  const title = profile.displayName || profile.school || "Young researcher";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".08em" }}>Research profile</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>{title}</div>
        {profile.displayName && profile.school && <div style={{ fontSize: 14, color: "#475569" }}>{profile.school}</div>}
        {profile.subjects.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {profile.subjects.map((s) => <span key={s} style={{ fontSize: 12, fontWeight: 700, color: "#4c1d95", background: "#ede9fe", borderRadius: 999, padding: "3px 10px" }}>{s}</span>)}
          </div>
        )}
      </div>
      {profile.bio && <p style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.7, margin: 0 }}>{profile.bio}</p>}
      <div>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>Projects</div>
        {profile.projects.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>No projects shown yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {profile.projects.map((p, i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 12px", background: "#fff" }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a" }}>{p.question || "Research project"}</div>
                <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>
                  {p.conferenceTitle}{p.organiser ? ` · ${p.organiser}` : ""}{p.startsAt ? ` · ${new Date(p.startsAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` : ""}{p.status === "presented" ? " · Presented" : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>Published by the learner on OneGrasp. Profiles never show contact details.</p>
    </div>
  );
}
