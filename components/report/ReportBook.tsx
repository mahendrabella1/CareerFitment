"use client";
/**
 * The report as a book: one sheet at a time, turned with a page flip. It wraps
 * the report from outside and never changes it - FullReport already draws each
 * section as an A4 "sheet" (.frx > .sheet), and this shows one of them and
 * animates the turn (the page swings over its left edge, the next one waiting
 * underneath).
 *
 * Previous / Next, the side arrows, the ← → keys, a swipe on phones and the
 * contents menu turn the pages; "Scroll view" goes back to the long page (the
 * choice is remembered per student). Printing and "Download report" are
 * unaffected: every rule here is screen-only and scoped to this wrapper, which
 * the downloaded file doesn't have, so both still get every page.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/app/Icons";
import { scopedKey } from "@/lib/progress/userStorage";

type Mode = "book" | "scroll";
interface Page { el: HTMLElement; title: string }

const MODE_KEY = "onegrasp.report.view.v1";
const TURN_MS = 700;

/** A sheet's own heading, for the contents menu. */
function titleOf(el: HTMLElement, i: number): string {
  if (el.classList.contains("cover")) return "Cover";
  const h = el.querySelector(".sband-title, .sechd h2, h1, h2, h3")?.textContent
    || el.querySelector(".rh .ey")?.textContent?.replace(/·\s*\d+\s*$/, "");
  return (h || `Page ${i + 1}`).replace(/\s+/g, " ").trim().slice(0, 64);
}

/** True when the touch started inside something that scrolls sideways (a wide table). */
function inSideScroller(target: EventTarget | null, stop: HTMLElement): boolean {
  for (let n = target as HTMLElement | null; n && n !== stop; n = n.parentElement) {
    const o = getComputedStyle(n).overflowX;
    if ((o === "auto" || o === "scroll") && n.scrollWidth > n.clientWidth + 2) return true;
  }
  return false;
}

export function ReportBook({ children, stickBelow }: {
  children: ReactNode;
  /** A sticky bar above the book (e.g. "Back to dashboard"); the toolbar sticks under it. */
  stickBelow?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("book");
  const [pages, setPages] = useState<Page[]>([]);
  const [cur, setCur] = useState(0);
  const [top, setTop] = useState(0);
  const turning = useRef(false);
  /** Where the current touch started, and whether it may turn the page. */
  const touch = useRef<{ x: number; y: number; ok: boolean } | null>(null);

  // The student's choice of view.
  useEffect(() => {
    try { if (window.localStorage.getItem(scopedKey(MODE_KEY)) === "scroll") setMode("scroll"); } catch { /* storage blocked */ }
  }, []);
  const switchMode = (m: Mode) => {
    setMode(m);
    try { window.localStorage.setItem(scopedKey(MODE_KEY), m); } catch { /* storage blocked */ }
    if (m === "scroll") requestAnimationFrame(() => pages[cur]?.el.scrollIntoView({ block: "start" }));
  };

  // The report loads on demand - pick up its sheets once they're there.
  useEffect(() => {
    const box = stage.current;
    if (!box) return;
    let raf = 0;
    const collect = () => {
      raf = 0;
      const els = Array.from(box.querySelectorAll<HTMLElement>(".frx > .sheet"));
      setPages((old) => (old.length === els.length && old.every((p, i) => p.el === els[i]) ? old : els.map((el, i) => ({ el, title: titleOf(el, i) }))));
    };
    collect();
    const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(collect); });
    mo.observe(box, { childList: true, subtree: true });
    return () => { mo.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Stick under the bar above, whatever its height.
  useEffect(() => {
    const bar = stickBelow ? document.querySelector<HTMLElement>(stickBelow) : null;
    if (!bar) return;
    const measure = () => setTop(bar.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bar);
    return () => ro.disconnect();
  }, [stickBelow]);

  // Which sheet is showing.
  const n = pages.length;
  const at = Math.min(cur, Math.max(0, n - 1));
  useEffect(() => {
    pages.forEach((p, i) => {
      p.el.classList.toggle("rbk-on", i === at);
      p.el.classList.remove("rbk-under", "rbk-turn-out", "rbk-turn-in");
    });
  }, [pages, at, mode]);

  // A sideways swipe turns the page - not the browser's own "swipe to go back".
  // The page-wide overscroll setting covers most browsers; claiming a clearly
  // sideways move as it happens covers the rest (React's touch handlers can't,
  // they're passive). Vertical scrolling and wide tables are left alone.
  useEffect(() => {
    if (mode !== "book") return;
    const html = document.documentElement;
    html.classList.add("rbk-lock-x");
    const box = stage.current;
    const onMove = (e: TouchEvent) => {
      const s = touch.current, p = e.touches[0];
      if (!s?.ok || !p || !e.cancelable) return;
      const dx = p.clientX - s.x, dy = p.clientY - s.y;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) e.preventDefault();
    };
    box?.addEventListener("touchmove", onMove, { passive: false });
    return () => { html.classList.remove("rbk-lock-x"); box?.removeEventListener("touchmove", onMove); };
  }, [mode]);

  const toBookTop = () => {
    const s = stage.current;
    if (!s) return;
    const y = s.getBoundingClientRect().top - top - 70;
    if (y < 0) window.scrollTo({ top: window.scrollY + y, behavior: "smooth" });
  };

  const go = useCallback((to: number) => {
    if (mode !== "book" || turning.current || to === at || to < 0 || to >= n) return;
    const from = pages[at].el, next = pages[to].el;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setCur(to); toBookTop(); return; }
    turning.current = true;
    if (to > at) { next.classList.add("rbk-under"); from.classList.add("rbk-turn-out"); }
    else { from.classList.add("rbk-under"); next.classList.add("rbk-turn-in"); }
    window.setTimeout(() => { turning.current = false; setCur(to); toBookTop(); }, TURN_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, at, n, pages, top]);

  // ← → keys (not while typing).
  useEffect(() => {
    if (mode !== "book") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, at, go]);

  // Swipe on phones.
  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    touch.current = { x: p.clientX, y: p.clientY, ok: !inSideScroller(e.target, e.currentTarget as HTMLElement) };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current, p = e.changedTouches[0];
    touch.current = null;
    if (!s?.ok || mode !== "book") return;
    const dx = p.clientX - s.x, dy = p.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(dx < 0 ? at + 1 : at - 1);
  };

  const jump = (i: number) => {
    if (mode === "book") go(i);
    else pages[i]?.el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={wrap} className="rbk" data-mode={mode} style={{ ["--rbk-top" as string]: `${top}px` }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {n > 0 && (
        <div className="rbk-bar" role="toolbar" aria-label="Report pages">
          {mode === "book" && (
            <button type="button" className="rbk-btn" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous page">
              <Icon name="chevronLeft" size={16} stroke={2} /><span className="rbk-hide-sm">Previous</span>
            </button>
          )}
          <div className="rbk-where">
            <select value={at} onChange={(e) => jump(Number(e.target.value))} aria-label="Go to a page">
              {pages.map((p, i) => <option key={i} value={i}>{i + 1}. {p.title}</option>)}
            </select>
            {mode === "book" && <small>Page {at + 1} of {n}</small>}
          </div>
          {mode === "book" && (
            <button type="button" className="rbk-btn rbk-pri" onClick={() => go(at + 1)} disabled={at >= n - 1} aria-label="Next page">
              <span className="rbk-hide-sm">Next</span><Icon name="chevronRight" size={16} stroke={2} />
            </button>
          )}
          <button type="button" className="rbk-mode" onClick={() => switchMode(mode === "book" ? "scroll" : "book")}>
            <Icon name={mode === "book" ? "layers" : "book"} size={15} stroke={2} />
            <span className="rbk-hide-sm">{mode === "book" ? "Scroll view" : "Book view"}</span>
          </button>
          {mode === "book" && <span className="rbk-prog" aria-hidden="true"><i style={{ width: `${((at + 1) / n) * 100}%` }} /></span>}
        </div>
      )}
      {mode === "book" && n > 1 && (
        <>
          <button type="button" className="rbk-side rbk-side-prev" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous page"><Icon name="chevronLeft" size={22} stroke={2} /></button>
          <button type="button" className="rbk-side rbk-side-next" onClick={() => go(at + 1)} disabled={at >= n - 1} aria-label="Next page"><Icon name="chevronRight" size={22} stroke={2} /></button>
        </>
      )}
      <div ref={stage} className="rbk-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {children}
      </div>
    </div>
  );
}

const CSS = `
.rbk-bar{position:sticky;top:var(--rbk-top,0px);z-index:6;display:flex;align-items:center;gap:8px;max-width:210mm;margin:0 auto;padding:9px 10px 12px;background:#fff;border:1px solid #e8e5df;border-radius:10px;box-shadow:0 8px 22px -16px rgba(20,20,25,.35)}
.rbk-btn,.rbk-mode{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:38px;padding:0 13px;border:1px solid #d9d5cd;border-radius:6px;background:#fff;font:inherit;font-size:13.5px;font-weight:600;color:#16181d;cursor:pointer;white-space:nowrap;flex:none}
.rbk-btn:hover:not(:disabled),.rbk-mode:hover{background:#f7f5f1}
.rbk-btn:disabled{opacity:.38;cursor:default}
.rbk-pri{background:#16181d;border-color:#16181d;color:#fff}
.rbk-pri:hover:not(:disabled){background:#2b2e35}
.rbk-mode{border-color:transparent;color:#4a4f59}
.rbk-where{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:1px}
.rbk-where select{max-width:100%;font:inherit;font-size:14px;font-weight:600;color:#16181d;border:0;background:transparent;text-align:center;text-align-last:center;cursor:pointer;padding:2px 4px;border-radius:4px;text-overflow:ellipsis}
.rbk-where select:hover{background:#f7f5f1}
.rbk-where small{font-size:11.5px;color:#7b808b;font-variant-numeric:tabular-nums}
.rbk-prog{position:absolute;left:10px;right:10px;bottom:5px;height:3px;border-radius:2px;background:#ece9e3;overflow:hidden}
.rbk-prog i{display:block;height:100%;background:#db3433;transition:width .4s ease}
.rbk-side{position:fixed;top:50%;z-index:5;width:46px;height:46px;margin-top:-23px;border-radius:50%;border:1px solid #d9d5cd;background:#fff;color:#16181d;display:grid;place-items:center;cursor:pointer;box-shadow:0 8px 20px -10px rgba(20,20,25,.35);transition:background .15s,opacity .15s}
.rbk-side:hover:not(:disabled){background:#16181d;color:#fff}
.rbk-side:disabled{opacity:0;pointer-events:none}
.rbk-side-prev{left:max(12px,calc(50% - 105mm - 80px))}
.rbk-side-next{right:max(12px,calc(50% - 105mm - 80px))}
@media (max-width:1060px){.rbk-side{display:none}}
@media (max-width:560px){.rbk-hide-sm{display:none}.rbk-btn{padding:0 11px}.rbk-bar{border-radius:8px}}
@media screen{
  .rbk[data-mode="book"] .rbk-stage{overflow:hidden}
  .rbk[data-mode="book"] .frx{display:grid;justify-items:center;align-items:start;gap:0;perspective:2600px;perspective-origin:50% 30%}
  .rbk[data-mode="book"] .frx>.sheet{grid-area:1/1;display:none;border-radius:6px 16px 16px 6px}
  .rbk[data-mode="book"] .frx>.sheet.rbk-on,.rbk[data-mode="book"] .frx>.sheet.rbk-under,
  .rbk[data-mode="book"] .frx>.sheet.rbk-turn-out,.rbk[data-mode="book"] .frx>.sheet.rbk-turn-in{display:block}
  .rbk[data-mode="book"] .frx>.sheet.rbk-on{z-index:2}
  .rbk[data-mode="book"] .frx>.sheet.rbk-under{z-index:1}
  .rbk[data-mode="book"] .frx>.sheet.rbk-turn-out,.rbk[data-mode="book"] .frx>.sheet.rbk-turn-in{z-index:3;transform-origin:left center;backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform}
  .rbk[data-mode="book"] .frx>.sheet.rbk-turn-out{animation:rbkOut ${TURN_MS}ms cubic-bezier(.45,.05,.25,1) forwards}
  .rbk[data-mode="book"] .frx>.sheet.rbk-turn-in{animation:rbkIn ${TURN_MS}ms cubic-bezier(.45,.05,.25,1) forwards}
  /* The flip is the motion here - the long page's scroll-in reveal is off. */
  .rbk[data-mode="book"] .frx .rv{opacity:1;transform:none;transition:none}
}
@keyframes rbkOut{
  0%{transform:rotateY(0deg);box-shadow:0 14px 40px rgba(20,20,25,.08)}
  50%{box-shadow:-30px 20px 50px rgba(20,20,25,.28)}
  100%{transform:rotateY(-180deg);box-shadow:0 14px 40px rgba(20,20,25,.08)}
}
@keyframes rbkIn{
  0%{transform:rotateY(-180deg);box-shadow:0 14px 40px rgba(20,20,25,.08)}
  50%{box-shadow:-30px 20px 50px rgba(20,20,25,.28)}
  100%{transform:rotateY(0deg);box-shadow:0 14px 40px rgba(20,20,25,.08)}
}
html.rbk-lock-x,html.rbk-lock-x body{overscroll-behavior-x:none}
@media print{.rbk-bar,.rbk-side{display:none!important}}
`;
