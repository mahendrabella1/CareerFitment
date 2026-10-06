import { LegalShell, LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { PHONE_CONTACTS, ALL_PORTALS } from "@/data/legal/helpContacts";
import { PageHeader } from "@/components/course/fx";

const HELP_CSS = `
.lh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
.lh-card{display:flex;flex-direction:column;gap:4px;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;background:#fff}
.lh-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.lh-name{font-size:14px;font-weight:800;color:#0f172a;line-height:1.35}
.lh-num{font-size:18px;font-weight:900;color:${ACCENT};text-decoration:none;white-space:nowrap;font-variant-numeric:tabular-nums}
.lh-note{font-size:12.5px;color:#64748b;margin:0;line-height:1.5;flex:1}
.lh-link{font-size:12px;color:${ACCENT};font-weight:700;text-decoration:none}
.lh-portal{display:flex;flex-direction:column;gap:3px;border:1px solid #e2e8f0;border-radius:14px;padding:12px 16px;background:#fff;text-decoration:none;transition:border-color .15s}
.lh-portal:hover{border-color:${ACCENT}}
.lh-h{font-size:12px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px}
`;

export default function LegalHelpPage() {
  return (
    <LegalShell>
      <style dangerouslySetInnerHTML={{ __html: HELP_CSS }} />
      <div style={{ padding: "0 0 8px" }}>
        <PageHeader icon="phone" eyebrow="Start here" title="Emergency & help directory"
          subtitle="Real, national, government-run helplines and portals - free to use. In an emergency, call 112 first." />

        <h2 className="lh-h">Phone helplines · {PHONE_CONTACTS.length}</h2>
        <div className="lh-grid" style={{ marginBottom: 28 }}>
          {PHONE_CONTACTS.map((c) => (
            <div key={c.slug} className="lh-card">
              <div className="lh-top">
                <span className="lh-name">{c.name}</span>
                {c.number && <a href={`tel:${c.number}`} className="lh-num">{c.number}</a>}
              </div>
              <p className="lh-note">{c.note}{c.hours ? ` · ${c.hours}` : ""}</p>
              {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="lh-link">Visit site ↗</a>}
            </div>
          ))}
        </div>

        <h2 className="lh-h">Online portals · {ALL_PORTALS.length}</h2>
        <div className="lh-grid">
          {ALL_PORTALS.map((p) => (
            <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="lh-portal fx-lift">
              <span style={{ fontSize: 13.5, fontWeight: 800, color: ACCENT }}>{p.name} ↗</span>
              <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{p.note}</span>
            </a>
          ))}
        </div>

        <p style={{ marginTop: 22, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
          Each entry was checked against its official source when this directory was last updated. If a number does not connect, call 112.
        </p>
      </div>
    </LegalShell>
  );
}
