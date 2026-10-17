"use client";

import Link from "next/link";
import { Icon } from "@/app/Icons";
import { useEffect, useRef, useState } from "react";

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

// Groups longer than this start closed (unless they hold the page you are
// on), so a 40-item list of scholarships doesn't push everything else away.
const OPEN_LIMIT = 7;
// Open groups this long get a filter box.
const FILTER_FROM = 12;
// Meta text longer than this (e.g. a full conducting-body name) is left to
// the item's tooltip instead of squeezing the label.
const META_MAX = 14;

// A flat menu inside the shell's left column (components/course/
// CoursePlayerShell.tsx): small uppercase group labels, plain rows, and one
// quiet highlight for the page you are on.
const SIDEBAR_CSS = `
.cs-nav{display:flex;flex-direction:column}
.cs-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:#4b5563;text-decoration:none;padding:6px 10px}
.cs-back:hover{color:#111827}
.cs-title{font-size:15px;font-weight:700;color:#111827;padding:2px 10px 0;line-height:1.3}
.cs-intro{font-size:12.5px;color:#6b7280;line-height:1.5;padding:4px 10px 0}
.cs-prog{margin:6px 0 4px;padding:10px 12px;border-radius:8px;background:#f9fafb;border:1px solid #eef0f3}
.cs-group{margin-top:12px}
.cs-ghead{width:100%;display:flex;align-items:center;gap:8px;padding:6px 10px;border:0;background:none;cursor:pointer;font:inherit;text-align:left;border-radius:6px}
.cs-ghead:hover{background:#f6f7f9}
.cs-gtitle{flex:1;min-width:0;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.07em;line-height:1.4}
.cs-gcount{font-size:11px;font-weight:600;color:#9ca3af;font-variant-numeric:tabular-nums}
.cs-chev{flex:none;width:14px;height:14px;color:#9ca3af;transition:transform .15s}
.cs-ghead[aria-expanded="true"] .cs-chev{transform:rotate(90deg)}
.cs-filter{display:block;width:calc(100% - 12px);margin:4px 6px 6px;font:inherit;font-size:13px;padding:7px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;color:#111827}
.cs-filter:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.cs-item{position:relative;display:flex;align-items:center;gap:10px;padding:7px 10px;margin:1px 0;border-radius:8px;text-decoration:none;color:#374151;font-size:13.5px;font-weight:500;line-height:1.35}
a.cs-item:hover{background:#f3f4f6;color:#111827}
.cs-item.is-current{background:color-mix(in srgb,var(--accent) 9%,#fff);color:var(--accent);font-weight:600}
.cs-item.is-current::before{content:"";position:absolute;left:-12px;top:6px;bottom:6px;width:3px;border-radius:0 3px 3px 0;background:var(--accent)}
.cs-item.is-locked{color:#9ca3af}
.cs-dot{flex:none;width:16px;height:16px;display:grid;place-items:center;color:#9ca3af}
.cs-item.is-todo .cs-dot::after{content:"";width:5px;height:5px;border-radius:999px;background:#d1d5db}
.cs-item.is-current .cs-dot::after{content:"";width:6px;height:6px;border-radius:999px;background:var(--accent)}
.cs-item.is-done .cs-dot{color:#16a34a}
.cs-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cs-meta{flex:none;font-size:11px;font-weight:500;color:#9ca3af}
.cs-empty{font-size:12.5px;color:#9ca3af;padding:4px 10px 8px}
.cs-foot{margin:18px 0 0;padding:12px;border-radius:8px;font-size:12.5px;line-height:1.5;color:#4b5563;background:#f9fafb;border:1px solid #eef0f3}
.cs-foot b{display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#374151;margin-bottom:4px}
`;

function StatusMark({ status }: { status: ItemStatus }) {
  if (status === "done") return <Icon name="check" size={14} stroke={2.4} />;
  if (status === "locked") return <Icon name="lock" size={13} stroke={2} />;
  return null;
}

function Chevron() {
  return (
    <svg className="cs-chev" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CourseSidebar({
  accent,
  backHref,
  backLabel,
  title,
  intro,
  groups,
  progressLabel,
  footer,
  openOnlyCurrent,
}: {
  accent: string;
  /** A back link above the menu - optional, the section banner has one. */
  backHref?: string;
  backLabel?: string;
  title?: string;
  intro?: string;
  groups: SidebarGroup[];
  progressLabel?: { done: number; total: number };
  /** A short note pinned under the menu (e.g. a safety line). */
  footer?: { title: string; text: string };
  /** Start with only the group you are in open (the first one elsewhere) -
   *  for menus made of many similar groups, like a course's modules. */
  openOnlyCurrent?: boolean;
}) {
  const total = progressLabel?.total ?? 0;
  const done = progressLabel?.done ?? 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const currentGroup = groups.find((g) => g.items.some((i) => i.status === "current"))?.title;
  const [open, setOpen] = useState<Set<string>>(() =>
    openOnlyCurrent
      ? new Set([currentGroup ?? groups[0]?.title].filter((t): t is string => Boolean(t)))
      : new Set(groups.filter((g) => g.items.length <= OPEN_LIMIT || g.title === currentGroup).map((g) => g.title))
  );
  const [query, setQuery] = useState<Record<string, string>>({});

  // Moving to a page in a closed group opens that group.
  useEffect(() => {
    if (currentGroup) setOpen((s) => (s.has(currentGroup) ? s : new Set(s).add(currentGroup)));
  }, [currentGroup]);

  // Bring the current item into view inside the menu (not the page).
  const currentRef = useRef<HTMLAnchorElement | null>(null);
  const currentHref = groups.flatMap((g) => g.items).find((i) => i.status === "current")?.href;
  useEffect(() => {
    const el = currentRef.current;
    const box = el?.closest(".course-shell__sidebar") as HTMLElement | null;
    if (!el || !box || box.scrollHeight <= box.clientHeight) return;
    const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
    if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 40) box.scrollTop = Math.max(0, top - box.clientHeight / 3);
  }, [currentHref]);

  const toggle = (t: string) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(t)) n.delete(t); else n.add(t);
    return n;
  });

  return (
    <nav aria-label="Section menu" className="cs-nav" style={{ ["--accent" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: SIDEBAR_CSS }} />
      {backHref && <Link href={backHref} className="cs-back">← {backLabel}</Link>}
      {title && <div className="cs-title">{title}</div>}
      {intro && <div className="cs-intro">{intro}</div>}

      {progressLabel && total > 0 && (
        <div className="cs-prog">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "#374151" }}>
            <span>Your progress</span>
            <span style={{ fontVariantNumeric: "tabular-nums", color: "#6b7280" }}>{done}/{total}</span>
          </div>
          <div style={{ height: 5, background: "#e5e7eb", borderRadius: 999, marginTop: 7, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: accent }} />
          </div>
        </div>
      )}

      {groups.map((g) => {
        const isOpen = open.has(g.title);
        const q = (query[g.title] ?? "").trim().toLowerCase();
        const items = q ? g.items.filter((i) => i.label.toLowerCase().includes(q)) : g.items;
        return (
          <div key={g.title} className="cs-group">
            <button type="button" className="cs-ghead" aria-expanded={isOpen} onClick={() => toggle(g.title)}>
              <span className="cs-gtitle">{g.title}</span>
              <span className="cs-gcount">{g.items.length}</span>
              <Chevron />
            </button>
            {isOpen && (
              <div>
                {g.items.length >= FILTER_FROM && (
                  <input
                    className="cs-filter"
                    type="search"
                    placeholder={`Filter ${g.items.length} items`}
                    aria-label={`Filter ${g.title}`}
                    value={query[g.title] ?? ""}
                    onChange={(e) => setQuery((s) => ({ ...s, [g.title]: e.target.value }))}
                  />
                )}
                {items.map((item) => {
                  const cls = `cs-item is-${item.status}`;
                  const meta = item.meta && item.meta.length <= META_MAX ? item.meta : undefined;
                  const tip = item.meta ? `${item.label} · ${item.meta}` : item.label;
                  const inner = (
                    <>
                      <span className="cs-dot" aria-hidden="true"><StatusMark status={item.status} /></span>
                      <span className="cs-label">{item.label}</span>
                      {meta && <span className="cs-meta">{meta}</span>}
                    </>
                  );
                  return item.status === "locked" ? (
                    <div key={item.href} className={cls} title={tip} aria-disabled="true">{inner}</div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cls}
                      title={tip}
                      aria-current={item.status === "current" ? "page" : undefined}
                      ref={item.status === "current" ? currentRef : undefined}
                    >
                      {inner}
                    </Link>
                  );
                })}
                {q && items.length === 0 && <div className="cs-empty">Nothing matches “{query[g.title]}”.</div>}
              </div>
            )}
          </div>
        );
      })}

      {footer && (
        <div className="cs-foot">
          <b><Icon name="shield" size={14} stroke={2} />{footer.title}</b>
          {footer.text}
        </div>
      )}
    </nav>
  );
}
