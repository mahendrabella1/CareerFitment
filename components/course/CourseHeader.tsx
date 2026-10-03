import Link from "next/link";

export function CourseHeader({
  accent,
  crumbs,
  title,
  subtitle,
  chip,
}: {
  accent: string;
  crumbs?: { href?: string; label: string }[];
  title: string;
  subtitle?: string;
  chip?: string;
}) {
  return (
    <header style={{ marginBottom: 20 }}>
      {crumbs && crumbs.length > 0 && (
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {crumbs.map((c, i) => (
            <span key={i}>
              {c.href ? <Link href={c.href} style={{ color: "#94a3b8", textDecoration: "none" }}>{c.label}</Link> : c.label}
              {i < crumbs.length - 1 && <span style={{ marginLeft: 6 }}>/</span>}
            </span>
          ))}
        </div>
      )}
      {chip && (
        <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 800, color: accent, background: `${accent}14`, padding: "3px 9px", borderRadius: 999, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>{chip}</span>
      )}
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.25 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: "#64748b", margin: "6px 0 0", lineHeight: 1.55 }}>{subtitle}</p>}
    </header>
  );
}
