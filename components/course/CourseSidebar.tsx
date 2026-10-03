import Link from "next/link";

export type ItemStatus = "done" | "current" | "todo" | "locked";

export interface SidebarItem {
  href: string;
  label: string;
  status: ItemStatus;
  meta?: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

const STATUS_GLYPH: Record<ItemStatus, string> = { done: "✓", current: "▶", todo: "○", locked: "🔒" };

export function CourseSidebar({
  accent,
  backHref,
  backLabel,
  groups,
  progressLabel,
}: {
  accent: string;
  backHref: string;
  backLabel: string;
  groups: SidebarGroup[];
  progressLabel?: { done: number; total: number };
}) {
  const total = progressLabel?.total ?? 0;
  const done = progressLabel?.done ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <nav aria-label="Course navigation" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 12px" }}>
      <Link href={backHref} style={{ fontSize: 12, color: "#64748b", textDecoration: "none", display: "block", padding: "4px 8px 10px" }}>← {backLabel}</Link>

      {progressLabel && total > 0 && (
        <div style={{ padding: "4px 8px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".04em" }}>Your progress</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>{done} of {total} done</div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: accent }} />
          </div>
        </div>
      )}

      {groups.map((g) => (
        <div key={g.title} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em", padding: "6px 8px" }}>{g.title}</div>
          {g.items.map((item) => {
            const isCurrent = item.status === "current";
            const isLocked = item.status === "locked";
            const content = (
              <div style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9,
                background: isCurrent ? `${accent}12` : "transparent",
                color: isLocked ? "#94a3b8" : "#0f172a",
                fontSize: 13, fontWeight: isCurrent ? 800 : 600,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 999, flex: "none", display: "grid", placeItems: "center", fontSize: 10,
                  background: item.status === "done" ? accent : isCurrent ? "#fff" : "#f1f5f9",
                  color: item.status === "done" ? "#fff" : accent,
                  border: isCurrent ? `2px solid ${accent}` : "none",
                }}>{STATUS_GLYPH[item.status]}</span>
                <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
                {item.meta && <span style={{ fontSize: 10.5, color: "#94a3b8", flex: "none" }}>{item.meta}</span>}
              </div>
            );
            return isLocked ? <div key={item.href} aria-disabled="true">{content}</div> : <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "block" }}>{content}</Link>;
          })}
        </div>
      ))}
    </nav>
  );
}
