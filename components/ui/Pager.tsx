"use client";

import { useEffect, useState, type RefObject } from "react";

export interface Paged<T> {
  page: number;
  pages: number;
  setPage: (p: number) => void;
  items: T[];
  from: number;
  to: number;
  total: number;
}

/** Client-side paging for a long list. Goes back to page 1 whenever
 *  `resetKey` changes (pass the active filter/search so a new filter never
 *  opens on an empty page 4). */
export function usePaged<T>(items: readonly T[], pageSize: number, resetKey?: unknown): Paged<T> {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [resetKey]);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    pages,
    setPage,
    items: items.slice(start, start + pageSize),
    from: items.length ? start + 1 : 0,
    to: Math.min(items.length, start + pageSize),
    total: items.length,
  };
}

/** Page numbers to show: always the first and last, the current page and its
 *  neighbours, with a gap marker where pages are skipped. */
function pageList(page: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | "gap")[] = [1];
  const lo = Math.max(2, Math.min(page - 1, pages - 4));
  const hi = Math.min(pages - 1, Math.max(page + 1, 5));
  if (lo > 2) out.push("gap");
  for (let p = lo; p <= hi; p++) out.push(p);
  if (hi < pages - 1) out.push("gap");
  out.push(pages);
  return out;
}

const PAGER_CSS = `
.pgr{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:16px}
.pgr-count{font-size:12.5px;color:#64748b;font-variant-numeric:tabular-nums}
.pgr-count b{color:#0f172a}
.pgr-btns{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.pgr-btn{min-width:34px;height:34px;padding:0 10px;border-radius:9px;border:1px solid #e2e8f0;background:#fff;color:#334155;font:inherit;font-size:13px;font-weight:700;cursor:pointer;font-variant-numeric:tabular-nums}
.pgr-btn:hover:not(:disabled){border-color:var(--pgr-accent);color:var(--pgr-accent)}
.pgr-btn:disabled{opacity:.45;cursor:default}
.pgr-btn[aria-current="page"]{background:var(--pgr-accent);border-color:var(--pgr-accent);color:#fff}
.pgr-gap{min-width:20px;text-align:center;color:#94a3b8;font-size:13px}
`;

export function Pager<T>({
  paged,
  accent = "#2563eb",
  noun = "items",
  scrollTo,
}: {
  paged: Paged<T>;
  accent?: string;
  /** Plural noun for the count line, e.g. "universities". */
  noun?: string;
  /** The list's top - scrolled back into view when the page changes. */
  scrollTo?: RefObject<HTMLElement | null>;
}) {
  if (paged.total === 0) return null;
  const go = (p: number) => {
    paged.setPage(p);
    requestAnimationFrame(() => {
      const el = scrollTo?.current;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  return (
    <div className="pgr" style={{ ["--pgr-accent" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: PAGER_CSS }} />
      <span className="pgr-count">
        {paged.pages > 1 ? <>Showing <b>{paged.from}–{paged.to}</b> of <b>{paged.total}</b> {noun}</> : <><b>{paged.total}</b> {noun}</>}
      </span>
      {paged.pages > 1 && (
        <nav className="pgr-btns" aria-label="Pages">
          <button type="button" className="pgr-btn" onClick={() => go(paged.page - 1)} disabled={paged.page <= 1} aria-label="Previous page">‹ Prev</button>
          {pageList(paged.page, paged.pages).map((p, i) =>
            p === "gap" ? (
              <span key={`g${i}`} className="pgr-gap">…</span>
            ) : (
              <button key={p} type="button" className="pgr-btn" onClick={() => go(p)} aria-current={p === paged.page ? "page" : undefined}>{p}</button>
            )
          )}
          <button type="button" className="pgr-btn" onClick={() => go(paged.page + 1)} disabled={paged.page >= paged.pages} aria-label="Next page">Next ›</button>
        </nav>
      )}
    </div>
  );
}
