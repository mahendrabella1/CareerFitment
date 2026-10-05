"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchProjects, type ResearchProject } from "@/lib/research/clientProgress";
import { fetchMyProfile, makeSlug, publishProfile, unpublishProfile, validateProfile, type ResearchProfileDoc } from "@/lib/research/clientProfile";
import { QrCode } from "@/components/research/QrCode";
import { PublicProfileView } from "@/components/research/PublicProfileView";

const ACCENT = "#7c3aed";

export function ResearchProfileEditor() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ displayName: "", school: "", under18: true, bio: "", subjects: "" });
  const [consent, setConsent] = useState(false);
  const [published, setPublished] = useState<ResearchProfileDoc | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "saving">("loading");
  const [message, setMessage] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    if (!user?.uid) {
      setState("ready");
      return;
    }
    (async () => {
      const [ps, existing] = await Promise.all([fetchProjects(user.uid).catch(() => []), fetchMyProfile(user.uid)]);
      setProjects(ps);
      if (existing) {
        setPublished(existing);
        setForm({ displayName: existing.displayName, school: existing.school, under18: existing.under18, bio: existing.bio, subjects: existing.subjects.join(", ") });
        setSelected(ps.filter((p) => existing.projects.some((ep) => ep.question === p.question && ep.conferenceTitle === p.conferenceTitle)).map((p) => p.id));
      }
      setState("ready");
    })();
  }, [user?.uid]);

  if (!user?.uid) return <p style={{ fontSize: 14, color: "#475569" }}>Sign in to create your research profile.</p>;
  if (state === "loading") return <p style={{ fontSize: 14, color: "#64748b" }}>Loading…</p>;

  const draft: ResearchProfileDoc = {
    uid: user.uid,
    slug: published?.slug ?? "",
    displayName: form.displayName.trim(),
    school: form.school.trim(),
    under18: form.under18,
    bio: form.bio.trim(),
    subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 6),
    projects: projects
      .filter((p) => selected.includes(p.id))
      .map((p) => ({ question: p.question, conferenceTitle: p.conferenceTitle, organiser: p.conferenceOrganiser, level: p.level, status: p.status, startsAt: p.startsAt })),
  };

  const publish = async () => {
    const err = validateProfile(draft, consent);
    if (err) {
      setMessage(err);
      return;
    }
    setState("saving");
    const slug = draft.slug || makeSlug(draft.displayName || draft.school);
    const ok = await publishProfile({ ...draft, slug });
    setState("ready");
    if (ok) {
      setPublished({ ...draft, slug });
      setMessage("Published. Share the link or print the QR code on your poster.");
    } else setMessage("We couldn't publish your profile right now. Please try again later.");
  };

  const unpublish = async () => {
    if (!published) return;
    setState("saving");
    const ok = await unpublishProfile(published.slug);
    setState("ready");
    if (ok) {
      setPublished(null);
      setMessage("Your profile is no longer public.");
    } else setMessage("We couldn't remove your profile right now. Please try again later.");
  };

  const url = published ? `${origin}/r/${published.slug}` : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <h2 style={h2}>What appears on your public profile</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <label style={label}>Display name<input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder={form.under18 ? "First name and initial, e.g. Ananya R" : "Your name"} style={input} /></label>
          <label style={label}>School or college (optional)<input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} style={input} /></label>
          <label style={label}>Subjects (comma separated)<input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} placeholder="e.g. Environmental science, Statistics" style={input} /></label>
        </div>
        <label style={{ ...label, marginTop: 10 }}>Short bio ({form.bio.length}/400)<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 400) })} rows={3} placeholder="What you research and why. No contact details." style={{ ...input, resize: "vertical", fontFamily: "inherit" }} /></label>
        <label style={{ ...checkRow, marginTop: 10 }}><input type="checkbox" checked={form.under18} onChange={(e) => setForm({ ...form, under18: e.target.checked })} style={{ accentColor: ACCENT }} /> I am under 18</label>
        {form.under18 && (
          <label style={{ ...checkRow, marginTop: 6 }}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ accentColor: ACCENT }} /> A parent or guardian has seen this profile and agrees to it being public.</label>
        )}
      </section>

      <section style={panel}>
        <h2 style={h2}>Projects to show</h2>
        {projects.length === 0 ? (
          <p style={pText}>No projects yet. <Link href="/account/research/projects/new" style={{ color: ACCENT, fontWeight: 800 }}>Start a project</Link> and it will appear here.</p>
        ) : (
          projects.map((p) => (
            <label key={p.id} style={{ ...checkRow, borderTop: "1px solid #f1f5f9", paddingTop: 8, marginTop: 6 }}>
              <input type="checkbox" checked={selected.includes(p.id)} onChange={() => setSelected((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))} style={{ accentColor: ACCENT, marginTop: 3 }} />
              <span><b>{p.question || "Untitled project"}</b><br /><span style={{ color: "#64748b", fontSize: 12.5 }}>{p.conferenceTitle} · {p.conferenceOrganiser} · {p.status}</span></span>
            </label>
          ))
        )}
        <p style={{ ...pText, marginTop: 10 }}>Only the question, the conference and its date are shown. Abstract text and mentor feedback stay private.</p>
      </section>

      <section style={panel}>
        <h2 style={h2}>Preview</h2>
        <PublicProfileView profile={draft} />
      </section>

      {message && <p style={{ fontSize: 13.5, fontWeight: 700, color: message.startsWith("Published") || message.startsWith("Your profile") ? "#166534" : "#b45309", margin: 0 }}>{message}</p>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={publish} disabled={state === "saving"} style={primaryBtn}>{published ? "Update public profile" : "Publish profile"}</button>
        {published && <button onClick={unpublish} disabled={state === "saving"} style={secondaryBtn}>Make private again</button>}
      </div>

      {published && (
        <section style={{ ...panel, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <QrCode value={url} label={`QR code linking to ${url}`} />
          <div style={{ minWidth: 0, flex: "1 1 240px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0f172a" }}>Your public link</div>
            <Link href={`/r/${published.slug}`} style={{ fontSize: 13.5, color: ACCENT, fontWeight: 700, overflowWrap: "anywhere" }}>{url}</Link>
            <p style={{ ...pText, marginTop: 6 }}>Put the QR code in your poster footer so judges and visitors can see your work.</p>
          </div>
        </section>
      )}
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const checkRow: CSSProperties = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "#1e293b", lineHeight: 1.5 };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
const primaryBtn: CSSProperties = { fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer" };
const secondaryBtn: CSSProperties = { fontSize: 13.5, fontWeight: 700, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10, padding: "9px 14px", cursor: "pointer" };
