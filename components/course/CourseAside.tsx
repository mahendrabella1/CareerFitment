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
