"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { LegalGuide } from "@/data/legal/guides";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";
import { LETTER_TEMPLATES } from "@/lib/legal/templates";
import { fetchBookmarkedSlugs, bookmarkGuide, unbookmarkGuide } from "@/lib/legal/clientBookmarks";
import { LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

export function GuideView({ guide }: { guide: LegalGuide }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    fetchBookmarkedSlugs(user.uid).then((slugs) => setBookmarked(slugs.includes(guide.slug)));
  }, [user?.uid, guide.slug]);

  // Sensitive guides (abuse, violence, image misuse) show a neutral browser-tab
  // title, so a shared device's tab bar and history don't reveal the topic.
  useEffect(() => {
    if (!guide.sensitive) return;
    const previous = document.title;
    document.title = "Learning resources";
    return () => {
      document.title = previous;
    };
  }, [guide.sensitive]);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/legal/guides" style={{ color: "#999", textDecoration: "none" }}>← All guides</Link>
      </div>

      <div style={{ border: "2px solid #f59e0b", background: "#fffbeb", borderRadius: 12, padding: "12px 16px", marginBottom: 18 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "#92400e" }}>Draft content - not yet reviewed by a qualified advocate</div>
        <p style={{ fontSize: 12, color: "#92400e", margin: "4px 0 0", lineHeight: 1.5 }}>
          This guide is drafted from real, named laws but has not yet been signed off by a practising advocate. For advice on your specific situation, call NALSA on <a href="tel:15100" style={{ color: "#92400e", fontWeight: 800 }}>15100</a> or speak to a lawyer. In an emergency, call <a href="tel:112" style={{ color: "#92400e", fontWeight: 800 }}>112</a>.
        </p>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em" }}>{guide.area}</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "4px 0 10px" }}>{guide.title}</h1>
      <p style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.6, margin: 0 }}>{guide.oneLine}</p>

      {user?.uid && (
        <button
          onClick={() => { if (bookmarked) { unbookmarkGuide(user.uid, guide.slug); setBookmarked(false); } else { bookmarkGuide(user.uid, guide.slug); setBookmarked(true); } }}
          style={{ marginTop: 14, fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 8, border: `1px solid ${ACCENT}`, background: bookmarked ? ACCENT : "#fff", color: bookmarked ? "#fff" : ACCENT, cursor: "pointer" }}
        >
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark this guide"}
        </button>
      )}

      <Section title="Your rights">
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {guide.rights.map((r, i) => <li key={i} style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>{r}</li>)}
        </ul>
      </Section>

      <Section title="Do this first">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {guide.firstSteps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 20, height: 20, borderRadius: 6, background: `${ACCENT}18`, color: ACCENT, fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center" }}>{i + 1}</span>
              <span style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>{s}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Keep this evidence">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {guide.evidence.map((e, i) => (
            <label key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#334155" }}>
              <input type="checkbox" /> {e}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Who can help">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {guide.helpSlugs.map((slug) => {
            const c = HELP_CONTACTS.find((h) => h.slug === slug);
            if (!c) return null;
            return (
              <div key={slug} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 9, padding: "9px 12px" }}>
                <span style={{ color: "#334155" }}>{c.name}</span>
                {c.number ? <a href={`tel:${c.number}`} style={{ fontWeight: 800, color: ACCENT, textDecoration: "none" }}>{c.number}</a> : c.url ? <a href={c.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Visit ↗</a> : null}
              </div>
            );
          })}
        </div>
      </Section>

      {guide.toolSlugs.length > 0 && (
        <Section title="Ready-made tools">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {guide.toolSlugs.map((slug) => {
              const t = LETTER_TEMPLATES.find((l) => l.slug === slug);
              if (!t) return null;
              return (
                <Link key={slug} href={`/account/legal/tools/${slug}`} style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: ACCENT, padding: "9px 14px", borderRadius: 9, textDecoration: "none" }}>
                  {t.name} →
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="The legal detail">
        <button onClick={() => setDetailOpen((v) => !v)} style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {detailOpen ? "Hide" : "Show"} the law behind this guide
        </button>
        {detailOpen && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: "#475569", background: "#f8fafc", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{guide.legalDetail.law}</div>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              {guide.legalDetail.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            {guide.sources && guide.sources.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Sources checked</div>
                <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                  {guide.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 600, textDecoration: "none", overflowWrap: "anywhere" }}>{s.label} ↗</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ marginTop: 8, fontStyle: "italic", color: "#94a3b8" }}>Drafted {new Date(guide.draftedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} - not yet reviewed by a qualified advocate.</div>
          </div>
        )}
      </Section>

      {guide.supportNote && (
        <div style={{ marginTop: 22, border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 12, padding: "14px 16px" }}>
          <p style={{ fontSize: 13, color: "#3730a3", margin: 0, lineHeight: 1.6 }}>{guide.supportNote}</p>
        </div>
      )}

      <p style={{ marginTop: 24, fontSize: 11.5, color: "#94a3b8", lineHeight: 1.6 }}>
        This guide gives general legal information to help you understand your rights. It is not legal advice for your specific case. For advice, contact free legal aid (NALSA 15100) or a lawyer. In an emergency, call 112.
      </p>
    </div>
  );
}
