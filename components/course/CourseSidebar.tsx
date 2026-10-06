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

const SIDEBAR_CSS = `
.cs-nav{background:#fff;border:1px solid #e7eaf2;border-radius:18px;padding:10px;box-shadow:0 1px 2px rgba(15,23,42,.04),0 10px 28px -20px rgba(15,23,42,.25)}
.cs-back{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#64748b;text-decoration:none;padding:4px 10px 10px}
.cs-back:hover{color:var(--accent)}
.cs-title{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:15px;font-weight:800;color:#0f172a;padding:2px 10px 0;line-height:1.3}
.cs-intro{font-size:12px;color:#64748b;line-height:1.5;padding:4px 10px 0}
.cs-prog{margin:4px 2px 6px;padding:12px;border-radius:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 10%,#fff),#fff);border:1px solid color-mix(in srgb,var(--accent) 16%,#fff)}
.cs-group{margin-top:2px}
.cs-group+.cs-group{border-top:1px dashed #edf0f6;margin-top:4px;padding-top:4px}
.cs-ghead{width:100%;display:flex;align-items:center;gap:8px;padding:9px 10px 7px;border:0;background:none;cursor:pointer;font:inherit;text-align:left;border-radius:10px}
.cs-ghead:hover{background:#f6f8fc}
.cs-gtitle{flex:1;min-width:0;font-size:10.5px;font-weight:800;color:#7a869a;text-transform:uppercase;letter-spacing:.08em}
.cs-gcount{font-size:10px;font-weight:800;color:#7a869a;background:#f1f4f9;border-radius:999px;padding:2px 7px;font-variant-numeric:tabular-nums}
.cs-chev{flex:none;width:14px;height:14px;color:#a3adbf;transition:transform .15s}
.cs-ghead[aria-expanded="true"] .cs-chev{transform:rotate(90deg)}
.cs-filter{display:block;width:calc(100% - 12px);margin:2px 6px 6px;font:inherit;font-size:12.5px;padding:8px 11px;border:1px solid #e6e9f2;border-radius:10px;background:#f7f9fc;color:#0f172a}
.cs-filter:focus{outline:none;border-color:var(--accent);background:#fff;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 16%,transparent)}
.cs-item{position:relative;display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:10px;text-decoration:none;color:#334155;font-size:13px;font-weight:600;line-height:1.35;transition:background .15s,color .15s}
a.cs-item:hover{background:#f5f7fb;color:#0f172a}
.cs-item.is-current{background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 13%,#fff),color-mix(in srgb,var(--accent) 4%,#fff));color:#0b1220;font-weight:800}
.cs-item.is-current::before{content:"";position:absolute;left:-10px;top:7px;bottom:7px;width:3px;border-radius:0 3px 3px 0;background:var(--accent)}
.cs-item.is-locked{color:#9aa4b5}
.cs-dot{flex:none;width:16px;height:16px;border-radius:999px;display:grid;place-items:center;font-size:9px;font-weight:900;color:#fff}
.cs-item.is-todo .cs-dot::after{content:"";width:6px;height:6px;border-radius:999px;background:#cdd5e2}
.cs-item.is-current .cs-dot::after{content:"";width:8px;height:8px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}
.cs-item.is-done .cs-dot{background:var(--accent)}
.cs-item.is-locked .cs-dot{font-size:10px;filter:grayscale(1);opacity:.7}
.cs-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cs-meta{flex:none;font-size:10.5px;font-weight:700;color:#97a1b3}
.cs-empty{font-size:12px;color:#94a3b8;padding:4px 10px 8px}
.cs-foot{margin:10px 2px 2px;padding:12px;border-radius:14px;font-size:12px;line-height:1.55;color:#334155;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 9%,#fff),#fff);border:1px solid color-mix(in srgb,var(--accent) 18%,#fff)}
.cs-foot b{display:flex;align-items:center;gap:6px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:4px}
`;

const GLYPH: Record<ItemStatus, string> = { done: "✓", current: "", todo: "", locked: "🔒" };

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
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#334155" }}>
            <span>Your progress</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{done}/{total}</span>
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
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
                      <span className="cs-dot" aria-hidden="true">{GLYPH[item.status]}</span>
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
          <b><Icon name="shield" size={13} stroke={2} />{footer.title}</b>
          {footer.text}
        </div>
      )}
    </nav>
  );
}
