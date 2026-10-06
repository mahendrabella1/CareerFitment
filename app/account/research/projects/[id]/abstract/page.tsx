"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchProject, fetchAbstracts, saveAbstractDraft, submitAbstract, type ResearchProject, type AbstractVersion } from "@/lib/research/clientProgress";
import { RUBRIC_ITEMS } from "@/lib/research/rubric";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";
const TEMPLATE = "Background (1-2 sentences): why the topic matters.\n\nAim (1 sentence): the question you tried to answer.\n\nMethod (2 sentences): what you did, with whom, how many.\n\nResults (2-3 sentences): the main findings, with numbers.\n\nConclusion (1-2 sentences): what it means and what could come next.";

export default function AbstractPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [project, setProject] = useState<ResearchProject | null | undefined>(undefined);
  const [versions, setVersions] = useState<AbstractVersion[]>([]);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const p = await fetchProject(params.id);
    setProject(p);
    const v = await fetchAbstracts(params.id);
    setVersions(v);
    if (v.length > 0 && !text) setText(v[0].text);
  };
  useEffect(() => { load(); }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (project === undefined) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading…</div>;
  if (project === null) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Project not found.</div>;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const latest = versions[0];

  const saveDraft = async () => {
    if (!user?.uid || !text.trim()) return;
    setSaving(true);
    try { await saveAbstractDraft(project.id, user.uid, text, versions.length); await load(); }
    finally { setSaving(false); }
  };

  const submit = async () => {
    if (!latest || latest.status !== "draft") return;
    await submitAbstract(latest.id);
    await load();
  };

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <PageHeader back={{ href: `/account/research/projects/${project.id}`, label: project.conferenceTitle }} icon="answer" eyebrow="Your project"
        title="Abstract editor" subtitle="Aim for about 250 words, using the 5-part structure." />

      {text === "" && (
        <button onClick={() => setText(TEMPLATE)} style={{ fontSize: 12, color: ACCENT, background: "none", border: "none", cursor: "pointer", marginBottom: 10, fontWeight: 600 }}>
          Start from the template
        </button>
      )}

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={14}
        style={{ width: "100%", borderRadius: 10, border: "1px solid #ddd", padding: 14, fontSize: 13.5, fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 12, color: wordCount > 300 || wordCount < 150 ? "#b91c1c" : "#888" }}>{wordCount} words (aim for ~250)</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={saveDraft} disabled={saving || !text.trim()} style={{ padding: "7px 14px", borderRadius: 7, border: `1.5px solid ${ACCENT}`, background: "#fff", color: ACCENT, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
            Save new version
          </button>
          {latest && latest.status === "draft" && latest.text === text && (
            <button onClick={submit} style={{ padding: "7px 14px", borderRadius: 7, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
              Submit for mentor review
            </button>
          )}
        </div>
      </div>

      {versions.length > 0 && (
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>Version history</h3>
          {versions.map((v) => (
            <div key={v.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a1a" }}>v{v.version}</span>
                <StatusBadge status={v.status} />
              </div>
              {v.review && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    {RUBRIC_ITEMS.map((item) => (
                      <span key={item} style={{ background: v.review!.scores[item] >= 3 ? "#dcfce7" : "#fee2e2", color: v.review!.scores[item] >= 3 ? "#166534" : "#991b1b", borderRadius: 6, padding: "2px 7px", fontSize: 10.5 }}>
                        {item}: {v.review!.scores[item]}/4
                      </span>
                    ))}
                  </div>
                  {v.review.comments && <p style={{ margin: 0, lineHeight: 1.5 }}>{v.review.comments}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: AbstractVersion["status"] }) {
  const styles: Record<string, { bg: string; fg: string; label: string }> = {
    draft: { bg: "#f3f3f5", fg: "#666", label: "Draft" },
    submitted: { bg: "#fef3c7", fg: "#92400e", label: "Awaiting review" },
    reviewed: { bg: "#dcfce7", fg: "#166534", label: "Reviewed" },
  };
  const s = styles[status];
  return <span style={{ fontSize: 10.5, fontWeight: 700, background: s.bg, color: s.fg, borderRadius: 999, padding: "3px 9px" }}>{s.label}</span>;
}
