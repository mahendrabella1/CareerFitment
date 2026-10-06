"use client";

import { useState } from "react";
import Link from "next/link";
import type { LetterTemplate } from "@/lib/legal/templates";
import { fillTemplate } from "@/lib/legal/templates";
import { legalGuideBySlug } from "@/data/legal/guides";
import { containsDistressLanguage } from "@/lib/legal/distressCheck";
import { LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { PageHeader } from "@/components/course/fx";

const LB_CSS = `
.lb-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:20px;align-items:start}
.lb-draft{position:sticky;top:56px;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;background:#fff;max-height:calc(100vh - 80px);overflow:auto}
@media (max-width:1180px){.lb-cols{grid-template-columns:minmax(0,1fr)}.lb-draft{position:static;max-height:none}}
`;

export function LetterBuilder({ template }: { template: LetterTemplate }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showDistressNote, setShowDistressNote] = useState(false);

  const filled = fillTemplate(template.template, values);
  const relatedGuides = template.guideSlugs
    .map((slug) => legalGuideBySlug(slug))
    .filter((g): g is NonNullable<ReturnType<typeof legalGuideBySlug>> => Boolean(g))
    .slice(0, 3);

  function onChange(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (containsDistressLanguage(value)) setShowDistressNote(true);
  }

  return (
    <div style={{ padding: "0 0 8px" }}>
      <style dangerouslySetInnerHTML={{ __html: LB_CSS }} />
      <PageHeader icon="doc" eyebrow="Action tool" title={template.name} subtitle={template.purpose || undefined}
        meta={["Nothing you type is saved or sent anywhere", "Copy or print when it's ready"]} />
      {relatedGuides.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "0 0 20px" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Read first:</span>
          {relatedGuides.map((g) => (
            <Link key={g.slug} href={`/account/legal/guides/${g.slug}`} style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>
              {g.number}. {g.title} →
            </Link>
          ))}
        </div>
      )}

      {showDistressNote && (
        <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
          <p style={{ fontSize: 13, color: "#3730a3", margin: 0, lineHeight: 1.6 }}>
            If things feel really hard right now, please know support is available - <a href="tel:14416" style={{ color: "#3730a3", fontWeight: 800 }}>Tele-MANAS, 14416</a>, free and confidential, any time. You don't have to go through this alone.
          </p>
        </div>
      )}

      {/* Form on the left, the letter building itself live on the right. */}
      <div className="lb-cols">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {template.fields.map((f) => (
          <div key={f.key}>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5 }}>{f.label}</label>
            {f.multiline ? (
              <textarea
                rows={4}
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, fontFamily: "inherit", resize: "vertical" }}
              />
            ) : (
              <input
                type="text"
                placeholder={f.placeholder}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9 }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="lb-draft">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "3px 9px", borderRadius: 999 }}>Draft - review before sending</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigator.clipboard?.writeText(filled)} style={{ fontSize: 12, fontWeight: 700, color: ACCENT, background: "none", border: `1px solid ${ACCENT}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Copy</button>
            <button onClick={() => window.print()} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: ACCENT, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Download / Print</button>
          </div>
        </div>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.7, color: "#1e293b", margin: 0 }}>{filled}</pre>
      </div>
      </div>

      {template.nextStep && (
        <div style={{ marginTop: 16, border: `1px solid ${ACCENT}30`, background: `${ACCENT}08`, borderRadius: 12, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em" }}>After you send it</div>
          <p style={{ fontSize: 13, color: "#334155", margin: "4px 0 0", lineHeight: 1.6 }}>{template.nextStep}</p>
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
        Keep it factual and polite. A complaint you know to be false can have legal consequences for the person who makes it. This draft is general information, not legal advice; for advice, call NALSA on 15100.
      </p>
    </div>
  );
}
