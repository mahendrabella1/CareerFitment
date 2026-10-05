"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProject, addSource, type ResearchProject } from "@/lib/research/clientProgress";

const ACCENT = "#7c3aed";

export default function SourcesPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ResearchProject | null | undefined>(undefined);
  const [title, setTitle] = useState(""); const [url, setUrl] = useState("");
  const [authors, setAuthors] = useState(""); const [year, setYear] = useState(""); const [note, setNote] = useState("");

  const load = () => fetchProject(params.id).then(setProject);
  useEffect(() => { load(); }, [params.id]);

  if (project === undefined) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading…</div>;
  if (project === null) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Project not found.</div>;

  const save = async () => {
    if (!title.trim()) return;
    await addSource(project.id, { title: title.trim(), url, authors, year, note });
    setTitle(""); setUrl(""); setAuthors(""); setYear(""); setNote("");
    load();
  };

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <Link href={`/account/research/projects/${project.id}`} style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← {project.conferenceTitle}</Link>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 20px" }}>Sources ({project.sources.length})</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {project.sources.map((s, i) => (
          <div key={i} style={{ border: "1px solid #eee", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a" }}>{s.title}</div>
            {(s.authors || s.year) && <div style={{ fontSize: 11.5, color: "#999" }}>{[s.authors, s.year].filter(Boolean).join(" · ")}</div>}
            {s.url && <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: ACCENT }}>{s.url}</a>}
            {s.note && <p style={{ fontSize: 12.5, color: "#555", margin: "6px 0 0" }}>{s.note}</p>}
          </div>
        ))}
        {project.sources.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>No sources yet.</p>}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "16px 18px" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", color: "#1a1a1a" }}>Add a source</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={inp} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link (optional)" style={inp} />
        <div style={{ display: "flex", gap: 8 }}>
          <input value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Author(s)" style={{ ...inp, flex: 1 }} />
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" style={{ ...inp, width: 80 }} />
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="One-line note: what it found, do you trust it?" rows={2} style={{ ...inp, resize: "vertical" as const }} />
        <button onClick={save} disabled={!title.trim()} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 13, cursor: title.trim() ? "pointer" : "default", opacity: title.trim() ? 1 : 0.5 }}>
          Add source
        </button>
      </div>
    </div>
  );
}

const inp = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit", marginBottom: 8, boxSizing: "border-box" as const };
