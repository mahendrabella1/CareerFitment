import Link from "next/link";

export function CourseAsideCard({
  title,
  accent,
  children,
  href,
  hrefLabel,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{children}</div>
      {href && hrefLabel && (
        <Link href={href} style={{ display: "inline-block", marginTop: 10, fontSize: 12.5, fontWeight: 700, color: accent, textDecoration: "none" }}>{hrefLabel} →</Link>
      )}
    </section>
  );
}

export function CourseAsideEmpty({ text }: { text: string }) {
  return <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>{text}</p>;
}

export interface NextBarLink {
  href: string;
  label: string;
  /** Small line under the label, e.g. the menu group. */
  note?: string;
}

const NEXTBAR_CSS = `
.cnb{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cnb a,.cnb .cnb-end{display:flex;flex-direction:column;gap:3px;min-width:0;padding:14px 16px;border-radius:14px;background:#fff;border:1px solid #e2e8f0;text-decoration:none;transition:border-color .15s,box-shadow .15s}
.cnb a:hover{border-color:var(--cnb-accent);box-shadow:0 4px 14px rgba(15,23,42,.06)}
.cnb .cnb-next{grid-column:2;text-align:right;align-items:flex-end}
.cnb .cnb-k{font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#94a3b8}
.cnb .cnb-next .cnb-k{color:var(--cnb-accent)}
.cnb .cnb-l{font-size:14px;font-weight:800;color:#0f172a;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cnb .cnb-n{font-size:12px;color:#64748b}
@media (max-width:640px){.cnb{grid-template-columns:1fr}.cnb .cnb-next{grid-column:1}}
`;

/** Previous / next links at the foot of a page, like a course player. */
export function CourseNextBar({ accent, prev, next, doneText }: { accent: string; prev?: NextBarLink; next?: NextBarLink; doneText?: string }) {
  if (!prev && !next && !doneText) return null;
  return (
    <nav aria-label="Previous and next" className="cnb" style={{ ["--cnb-accent" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: NEXTBAR_CSS }} />
      {prev && (
        <Link href={prev.href}>
          <span className="cnb-k">← Previous</span>
          <span className="cnb-l">{prev.label}</span>
          {prev.note && <span className="cnb-n">{prev.note}</span>}
        </Link>
      )}
      {next ? (
        <Link href={next.href} className="cnb-next">
          <span className="cnb-k">Up next →</span>
          <span className="cnb-l">{next.label}</span>
          {next.note && <span className="cnb-n">{next.note}</span>}
        </Link>
      ) : doneText ? (
        <div className="cnb-end cnb-next">
          <span className="cnb-k">All done</span>
          <span className="cnb-n">{doneText}</span>
        </div>
      ) : null}
    </nav>
  );
}
