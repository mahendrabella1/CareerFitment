"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getUnit, STUDIO_UNITS } from "@/data/research/studioUnits";
import { fetchStudioNote, saveStudioNote } from "@/lib/research/clientProgress";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";

export default function StudioUnitPage({ params }: { params: { unit: string } }) {
  const unit = getUnit(params.unit);
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.uid || !unit) return;
    fetchStudioNote(user.uid, unit.slug).then(setText);
  }, [user?.uid, unit]);

  if (!unit) {
    return (
      <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
        <Link href="/account/research/studio" style={{ fontSize: 13, color: "#999" }}>← Research Studio</Link>
        <p style={{ marginTop: 20, color: "#888" }}>That unit doesn't exist.</p>
      </div>
    );
  }

  const save = async () => {
    if (!user?.uid) return;
    await saveStudioNote(user.uid, unit.slug, text);
    setSaved(true);
  };

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <PageHeader back={{ href: "/account/research/studio", label: "Research Studio" }} icon="book" eyebrow={`Unit ${unit.unit} of ${STUDIO_UNITS.length}`} title={unit.title} />

      <p style={{ fontSize: 15, lineHeight: 1.6, color: "#333", fontStyle: "italic", borderLeft: `3px solid ${ACCENT}`, paddingLeft: 14, marginBottom: 22 }}>{unit.hook}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {unit.contentMd.split("\n").filter(Boolean).map((line, i) => (
          <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#444", margin: 0, display: "flex", gap: 8 }}>
            <span style={{ color: ACCENT, flex: "none" }}>•</span><span>{line}</span>
          </p>
        ))}
      </div>

      {unit.freeTools.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: ".03em", margin: "0 0 8px" }}>Free tools</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {unit.freeTools.map((t) => t.url ? (
              <a key={t.name} href={t.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: ACCENT, background: `${ACCENT}10`, borderRadius: 999, padding: "4px 10px", textDecoration: "none", fontWeight: 600 }}>{t.name}</a>
            ) : (
              <span key={t.name} style={{ fontSize: 12, color: "#666", background: "#f3f3f5", borderRadius: 999, padding: "4px 10px" }}>{t.name}</span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Do it</h3>
        <p style={{ fontSize: 13.5, color: "#666", margin: "0 0 10px" }}>{unit.taskPrompt}</p>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} rows={5}
          placeholder="Write your work here…"
          style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd", padding: 10, fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }} />
        <button onClick={save} disabled={!text.trim()}
          style={{ marginTop: 8, padding: "8px 16px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, fontSize: 13, cursor: text.trim() ? "pointer" : "default", opacity: text.trim() ? 1 : 0.5 }}>
          Save
        </button>
        {saved && <span style={{ marginLeft: 10, fontSize: 12.5, color: "#166534" }}>Saved ✓</span>}
      </div>
    </div>
  );
}
