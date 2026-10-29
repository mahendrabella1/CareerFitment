"use client";
/**
 * The report as a book: one sheet at a time, turned with a page flip. It wraps
 * the report from outside and never changes it - FullReport already draws each
 * section as an A4 "sheet" (.frx > .sheet), and this shows one of them and
 * animates the turn (the page swings over its left edge, the next one waiting
 * underneath).
 *
 * Each page is fitted to the screen (a page much longer than A4 is fitted to
 * its first part and scrolls); − / + zoom it, the percentage goes back to
 * "fit". Phones keep the report's own phone layout at its natural size and
 * pinch to zoom. Also: full screen, an "All pages" grid of thumbnails, and -
 * when the screen passes `resumeKey` - the student's place is remembered.
 *
 * Previous / Next, the side arrows, ← → (Home / End, + − 0), a swipe on phones
 * and the contents menu turn the pages; "Scroll view" goes back to the long
 * page (remembered per student). Printing and "Download report" are
 * unaffected: every rule here is screen-only and scoped to this wrapper, which
 * the downloaded file doesn't have, so both still get every page.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/app/Icons";
import { scopedKey } from "@/lib/progress/userStorage";

type Mode = "book" | "scroll";
interface Page { el: HTMLElement; title: string }

const MODE_KEY = "onegrasp.report.view.v1";
const PAGE_KEY = "onegrasp.report.page.v1";
const TURN_MS = 700;
/** An A4 sheet on screen (210 × 297 mm). */
const A4_W = 794, A4_H = 1123;
/** Narrower than this, the report's phone layout is shown at its natural size. */
const NARROW = 700;
/** A page up to this many A4 heights is fitted whole; a longer one is fitted to that much of it and scrolls. */
const FIT_MAX = 1.35;
const STEPS = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];
/** Space between the toolbar and the page, and below the page. */
const GAP_TOP = 10, GAP_BOTTOM = 14;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void; webkitFullscreenEnabled?: boolean };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };
const fsElement = () => { const d = document as FsDoc; return d.fullscreenElement ?? d.webkitFullscreenElement ?? null; };

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

export function ReportBook({ children, stickBelow, resumeKey }: {
  children: ReactNode;
  /** A sticky bar above the book (e.g. "Back to dashboard"); the toolbar sticks under it. */
  stickBelow?: string;
  /** Remember the page the reader is on for this report (e.g. its completedAt) and open there next time. */
  resumeKey?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const zoomer = useRef<HTMLDivElement>(null);
  const pagesBtn = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<Mode>("book");
  const [pages, setPages] = useState<Page[]>([]);
  const [cur, setCur] = useState(0);
  const [top, setTop] = useState(0);
  /** "fit" = fitted to the screen, or a fixed scale chosen with − / +. */
  const [zoom, setZoom] = useState<"fit" | number>("fit");
  const [scale, setScale] = useState(1);
  const [full, setFull] = useState(false);
  const [canFull, setCanFull] = useState(false);
  const [overview, setOverview] = useState(false);
  /** The page number reopened at, while that note shows. */
  const [resumed, setResumed] = useState(0);
  const turning = useRef(false);
  /** The page being shown - during a turn, the one being turned to. */
  const showing = useRef(0);
  const restored = useRef(false);
  const aligned = useRef(false);
  const lastScale = useRef(1);
  /** Where the current touch started, and whether it may turn the page. */
  const touch = useRef<{ x: number; y: number; ok: boolean } | null>(null);

  // The student's choice of view.
  useEffect(() => {
    try { if (window.localStorage.getItem(scopedKey(MODE_KEY)) === "scroll") setMode("scroll"); } catch { /* storage blocked */ }
  }, []);

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
    const above = stickBelow ? document.querySelector<HTMLElement>(stickBelow) : null;
    if (!above) return;
    const measure = () => setTop(above.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(above);
    return () => ro.disconnect();
  }, [stickBelow]);

  // The site-wide "no sideways scroll" rule (overflow-x: hidden on html and
  // body, globals.css) turns body into a scroll box, which stops the sticky
  // bars from sticking. "clip" stops sideways scroll the same way without that,
  // so while a report is open the bar above and this toolbar stay in view.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("rbk-page");
    return () => html.classList.remove("rbk-page");
  }, []);

  // Full screen, where the browser allows it on an element (not iPhone).
  useEffect(() => {
    const d = document as FsDoc;
    setCanFull(!!(d.fullscreenEnabled || d.webkitFullscreenEnabled));
    const onFs = () => setFull(!!wrap.current && fsElement() === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => { document.removeEventListener("fullscreenchange", onFs); document.removeEventListener("webkitfullscreenchange", onFs); };
  }, []);

  const n = pages.length;
  const at = Math.min(cur, Math.max(0, n - 1));
  const barTop = full ? 0 : top;

  /** Size the page being shown: fitted to the space under the toolbar, or the chosen zoom. */
  const layout = useCallback(() => {
    const root = wrap.current, st = stage.current, zm = zoomer.current;
    const pg = pages[showing.current]?.el;
    if (mode !== "book" || !root || !st || !zm || !pg) return;
    const small = window.innerWidth < NARROW;
    const room = st.clientWidth;
    const base = small ? room : A4_W;
    root.style.setProperty("--rbk-bw", `${base}px`);
    const h = pg.offsetHeight || A4_H;
    const viewH = full ? root.clientHeight : window.innerHeight;
    const roomH = viewH - barTop - (bar.current?.offsetHeight ?? 0) - GAP_TOP - GAP_BOTTOM;
    const fit = small ? 1 : Math.max(STEPS[0], Math.min(1, room / base, roomH / Math.min(h, A4_H * FIT_MAX)));
    const s = small || zoom === "fit" ? fit : zoom;
    root.style.setProperty("--rbk-s", String(s));
    root.style.setProperty("--rbk-sw", `${Math.ceil(base * s)}px`);
    root.style.setProperty("--rbk-sh", `${Math.ceil(zm.offsetHeight * s)}px`);
    const wide = base * s > room + 1;
    root.classList.toggle("rbk-wide", wide);
    root.classList.toggle("rbk-roomy", !small && window.innerWidth >= base * s + 190);
    // Zoomed wider than the screen: start centred, like a PDF viewer.
    if (wide && Math.abs(s - lastScale.current) > 0.001) st.scrollLeft = (st.scrollWidth - st.clientWidth) / 2;
    lastScale.current = s;
    setScale(Math.round(s * 100) / 100);
  }, [mode, pages, zoom, full, barTop]);

  // Which sheet is showing.
  useIsoLayoutEffect(() => {
    showing.current = at;
    pages.forEach((p, i) => {
      p.el.classList.toggle("rbk-on", i === at);
      p.el.classList.remove("rbk-under", "rbk-turn-out", "rbk-turn-in");
    });
    layout();
  }, [pages, at, layout]);

  // Refit when the window, the toolbar or the page itself changes size.
  useEffect(() => {
    if (mode !== "book") return;
    let raf = 0;
    const later = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; layout(); }); };
    const ro = new ResizeObserver(later);
    [zoomer.current, stage.current, bar.current].forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", later);
    return () => { ro.disconnect(); window.removeEventListener("resize", later); if (raf) cancelAnimationFrame(raf); };
  }, [mode, layout]);

  /** Bring the page's top just under the toolbar. */
  const toBookTop = useCallback((smooth = true) => {
    const root = wrap.current, st = stage.current;
    if (!root || !st) return;
    const want = barTop + (bar.current?.offsetHeight ?? 0) + GAP_TOP;
    const dy = st.getBoundingClientRect().top - (full ? root.getBoundingClientRect().top : 0) - want;
    if (Math.abs(dy) < 2) return;
    (full ? root : window).scrollBy({ top: dy, behavior: smooth ? "smooth" : "auto" });
  }, [barTop, full]);

  // On opening, and in and out of full screen, line the page up under the toolbar.
  useEffect(() => {
    if (mode !== "book" || !n || aligned.current) return;
    aligned.current = true;
    requestAnimationFrame(() => toBookTop(false));
  }, [mode, n, toBookTop]);
  useEffect(() => {
    if (mode === "book" && aligned.current) requestAnimationFrame(() => toBookTop(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full]);
  // Back to "fit": the whole page fits again, so show it from the top.
  useEffect(() => {
    if (mode === "book" && zoom === "fit" && aligned.current) requestAnimationFrame(() => toBookTop(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  // Open where the reader left off.
  useEffect(() => {
    if (!resumeKey || restored.current || !n) return;
    let saved: { k?: string; p?: number } | null = null;
    try { saved = JSON.parse(window.localStorage.getItem(scopedKey(PAGE_KEY)) || "null"); } catch { /* storage blocked */ }
    if (!saved || saved.k !== resumeKey || !saved.p) { restored.current = true; return; }
    if (saved.p >= n) return; // the rest of the report is still loading
    restored.current = true;
    setCur(saved.p);
    setResumed(saved.p + 1);
  }, [n, resumeKey]);
  useEffect(() => {
    if (!resumeKey || !restored.current) return;
    try { window.localStorage.setItem(scopedKey(PAGE_KEY), JSON.stringify({ k: resumeKey, p: at })); } catch { /* storage blocked */ }
  }, [at, resumeKey]);
  useEffect(() => {
    if (!resumed) return;
    const t = window.setTimeout(() => setResumed(0), 8000);
    return () => window.clearTimeout(t);
  }, [resumed]);

  // A sideways swipe turns the page - not the browser's own "swipe to go back".
  // The page-wide overscroll setting covers most browsers; claiming a clearly
  // sideways one-finger move as it happens covers the rest (React's touch
  // handlers can't, they're passive). Pinch zoom, vertical scrolling and wide
  // tables are left alone.
  useEffect(() => {
    if (mode !== "book") return;
    const html = document.documentElement;
    html.classList.add("rbk-lock-x");
    const box = stage.current;
    const onMove = (e: TouchEvent) => {
      const s = touch.current, p = e.touches[0];
      if (e.touches.length > 1) { touch.current = null; return; }
      if (!s?.ok || !p || !e.cancelable) return;
      const dx = p.clientX - s.x, dy = p.clientY - s.y;
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) e.preventDefault();
    };
    box?.addEventListener("touchmove", onMove, { passive: false });
    return () => { html.classList.remove("rbk-lock-x"); box?.removeEventListener("touchmove", onMove); };
  }, [mode]);

  const go = useCallback((to: number) => {
    if (mode !== "book" || turning.current || to === at || to < 0 || to >= n) return;
    restored.current = true;
    setResumed(0);
    const from = pages[at].el, next = pages[to].el;
    showing.current = to;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setCur(to); toBookTop(); return; }
    turning.current = true;
    if (to > at) { next.classList.add("rbk-under"); from.classList.add("rbk-turn-out"); }
    else { from.classList.add("rbk-under"); next.classList.add("rbk-turn-in"); }
    layout();
    window.setTimeout(() => { turning.current = false; setCur(to); toBookTop(); }, TURN_MS);
  }, [mode, at, n, pages, layout, toBookTop]);

  const zoomBy = useCallback((dir: 1 | -1) => {
    const next = dir > 0 ? STEPS.find((s) => s > scale + 0.01) : [...STEPS].reverse().find((s) => s < scale - 0.01);
    if (next) setZoom(next);
  }, [scale]);

  // Keys (not while typing): ← → pages, Home / End first and last, + − zoom, 0 fit.
  useEffect(() => {
    if (mode !== "book" || overview) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (k === "ArrowRight") go(at + 1);
      else if (k === "ArrowLeft") go(at - 1);
      else if (k === "Home") go(0);
      else if (k === "End") go(n - 1);
      else if (k === "+" || k === "=") zoomBy(1);
      else if (k === "-" || k === "_") zoomBy(-1);
      else if (k === "0") setZoom("fit");
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, overview, at, n, go, zoomBy]);

  // Swipe on phones.
  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    const ok = e.touches.length === 1 && !wrap.current?.classList.contains("rbk-wide") && !inSideScroller(e.target, e.currentTarget as HTMLElement);
    touch.current = { x: p.clientX, y: p.clientY, ok };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current, p = e.changedTouches[0];
    touch.current = null;
    if (!s?.ok || mode !== "book") return;
    const dx = p.clientX - s.x, dy = p.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(dx < 0 ? at + 1 : at - 1);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    try { window.localStorage.setItem(scopedKey(MODE_KEY), m); } catch { /* storage blocked */ }
    requestAnimationFrame(() => (m === "scroll" ? pages[at]?.el.scrollIntoView({ block: "start" }) : toBookTop(false)));
  };

  const jump = (i: number) => {
    if (mode === "book") go(i);
    else pages[i]?.el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleFull = () => {
    const d = document as FsDoc, el = wrap.current as FsEl | null;
    if (!el) return;
    if (fsElement()) { if (d.exitFullscreen) d.exitFullscreen().catch(() => undefined); else d.webkitExitFullscreen?.(); }
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => undefined);
    else el.webkitRequestFullscreen?.();
  };

  const closeOverview = () => { setOverview(false); requestAnimationFrame(() => pagesBtn.current?.focus()); };
  const pct = Math.round(scale * 100);

  return (
    <div ref={wrap} className="rbk" data-mode={mode} style={{ ["--rbk-top" as string]: `${barTop}px` }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {n > 0 && (
        <div ref={bar} className="rbk-bar" role="toolbar" aria-label="Report pages">
          {mode === "book" && (
            <button type="button" className="rbk-btn" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous page">
              <Icon name="chevronLeft" size={16} stroke={2} /><span className="rbk-hide-md">Previous</span>
            </button>
          )}
          <div className="rbk-where">
            <select value={at} onChange={(e) => jump(Number(e.target.value))} aria-label="Go to a page">
              {pages.map((p, i) => <option key={i} value={i}>{i + 1}. {p.title}</option>)}
            </select>
            {mode === "book" && <small>{at + 1} / {n}</small>}
          </div>
          {mode === "book" && (
            <button type="button" className="rbk-btn rbk-pri" onClick={() => go(at + 1)} disabled={at >= n - 1} aria-label="Next page">
              <span className="rbk-hide-md">Next</span><Icon name="chevronRight" size={16} stroke={2} />
            </button>
          )}
          {mode === "book" && (
            <div className="rbk-zoomctl" role="group" aria-label="Zoom">
              <button type="button" className="rbk-ic" onClick={() => zoomBy(-1)} disabled={scale <= STEPS[0] + 0.001} aria-label="Zoom out" title="Zoom out (−)"><Glyph d="M5 12h14" /></button>
              <button type="button" className="rbk-pct" onClick={() => setZoom(zoom === "fit" ? 1 : "fit")} title={zoom === "fit" ? "Fitted to your screen - show at full size" : "Fit the page to your screen (0)"} aria-label={zoom === "fit" ? `Fitted to screen, ${pct}%. Show at full size` : `Zoom ${pct}%. Fit to screen`}>
                {zoom === "fit" && <Glyph d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" size={13} />}{pct}%
              </button>
              <button type="button" className="rbk-ic" onClick={() => zoomBy(1)} disabled={scale >= STEPS[STEPS.length - 1] - 0.001} aria-label="Zoom in" title="Zoom in (+)"><Glyph d="M5 12h14M12 5v14" /></button>
            </div>
          )}
          <button ref={pagesBtn} type="button" className="rbk-ic" onClick={() => setOverview(true)} aria-label="All pages" title="All pages">
            <Icon name="clusters" size={17} stroke={1.9} />
          </button>
          {canFull && (
            <button type="button" className="rbk-ic rbk-fs" onClick={toggleFull} aria-label={full ? "Exit full screen" : "Full screen"} title={full ? "Exit full screen (Esc)" : "Full screen"}>
              {full ? <Glyph d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <Glyph d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
            </button>
          )}
          <button type="button" className="rbk-mode" onClick={() => switchMode(mode === "book" ? "scroll" : "book")}>
            <Icon name={mode === "book" ? "layers" : "book"} size={15} stroke={2} />
            <span className="rbk-hide-sm">{mode === "book" ? "Scroll view" : "Book view"}</span>
          </button>
          {mode === "book" && <span className="rbk-prog" aria-hidden="true"><i style={{ width: `${((at + 1) / n) * 100}%` }} /></span>}
          {mode === "book" && resumed > 0 && (
            <div className="rbk-resume" role="status">
              <span>Opened where you left off, page {resumed}</span>
              <button type="button" onClick={() => go(0)}>Start from the cover</button>
              <button type="button" className="rbk-resume-x" onClick={() => setResumed(0)} aria-label="Dismiss"><Icon name="close" size={13} stroke={2} /></button>
            </div>
          )}
        </div>
      )}
      {mode === "book" && n > 1 && (
        <>
          <button type="button" className="rbk-side rbk-side-prev" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous page"><Icon name="chevronLeft" size={22} stroke={2} /></button>
          <button type="button" className="rbk-side rbk-side-next" onClick={() => go(at + 1)} disabled={at >= n - 1} aria-label="Next page"><Icon name="chevronRight" size={22} stroke={2} /></button>
        </>
      )}
      <div ref={stage} className="rbk-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="rbk-size">
          <div ref={zoomer} className="rbk-zoom">{children}</div>
        </div>
      </div>
      {overview && <Overview pages={pages} at={at} onPick={(i) => { closeOverview(); jump(i); }} onClose={closeOverview} />}
    </div>
  );
}

/** A small line icon drawn from one path (zoom and full-screen controls). */
function Glyph({ d, size = 16 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
}

const URL_ATTRS = ["fill", "stroke", "clip-path", "mask", "filter", "marker-start", "marker-mid", "marker-end", "href", "xlink:href", "style"];

/** A copy of a sheet for its thumbnail, with ids made unique so its charts keep their gradients. */
function thumbOf(src: HTMLElement, i: number): HTMLElement {
  const c = src.cloneNode(true) as HTMLElement;
  c.classList.remove("rbk-on", "rbk-under", "rbk-turn-out", "rbk-turn-in");
  c.removeAttribute("id");
  const ids = new Map<string, string>();
  c.querySelectorAll<HTMLElement>("[id]").forEach((el) => { const id = `${el.id}-pg${i}`; ids.set(el.id, id); el.id = id; });
  if (ids.size) {
    c.querySelectorAll("*").forEach((el) => {
      for (const a of URL_ATTRS) {
        const v = el.getAttribute(a);
        if (v?.includes("#")) el.setAttribute(a, v.replace(/#([\w:.-]+)/g, (m, id: string) => (ids.has(id) ? `#${ids.get(id)}` : m)));
      }
    });
  }
  return c;
}

/** Every page as a thumbnail; pick one to go there. */
function Overview({ pages, at, onPick, onClose }: { pages: Page[]; at: number; onPick: (i: number) => void; onClose: () => void }) {
  const grid = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useIsoLayoutEffect(() => {
    const g = grid.current;
    if (!g) return;
    const pageW = pages[at]?.el.offsetWidth || A4_W;
    const boxes = Array.from(g.querySelectorAll<HTMLElement>(".rbk-tn-pg"));
    boxes.forEach((box, i) => {
      const src = pages[i]?.el;
      if (!src) return;
      const inner = document.createElement("div");
      inner.className = "frx rbk-tn-in";
      inner.setAttribute("inert", "");
      inner.setAttribute("aria-hidden", "true");
      inner.style.width = `${pageW}px`;
      inner.appendChild(thumbOf(src, i));
      box.appendChild(inner);
    });
    const fit = () => boxes.forEach((box) => { const inner = box.firstElementChild as HTMLElement | null; if (inner) inner.style.transform = `scale(${box.clientWidth / pageW})`; });
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(g);
    g.querySelector<HTMLElement>(".rbk-tn.on")?.scrollIntoView({ block: "center" });
    closeBtn.current?.focus();
    return () => { ro.disconnect(); boxes.forEach((b) => b.replaceChildren()); };
  }, [pages, at]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="rbk-ov" role="dialog" aria-modal="true" aria-label="All pages">
      <div className="rbk-ov-hd">
        <b>All pages <span>{pages.length}</span></b>
        <button ref={closeBtn} type="button" className="rbk-btn" onClick={onClose}><Icon name="close" size={15} stroke={2} /> Close</button>
      </div>
      <div ref={grid} className="rbk-ov-grid">
        {pages.map((p, i) => (
          <div key={i} className={`rbk-tn${i === at ? " on" : ""}`}>
            <div className="rbk-tn-pg" />
            <small><b>{i + 1}</b>{p.title}</small>
            <button type="button" className="rbk-tn-hit" onClick={() => onPick(i)} aria-label={`Page ${i + 1}: ${p.title}`} aria-current={i === at ? "page" : undefined} />
          </div>
        ))}
      </div>
    </div>
  );
}

const CSS = `
.rbk-bar{position:sticky;top:var(--rbk-top,0px);z-index:6;display:flex;align-items:center;gap:6px;max-width:940px;margin:0 auto;padding:6px 8px 10px;background:#fff;border:1px solid #e8e5df;border-radius:10px;box-shadow:0 8px 22px -16px rgba(20,20,25,.35)}
.rbk-btn,.rbk-mode,.rbk-ic,.rbk-pct{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;min-height:0;padding:0 12px;border:1px solid #d9d5cd;border-radius:6px;background:#fff;font:inherit;font-size:13px;font-weight:600;color:#16181d;cursor:pointer;white-space:nowrap;flex:none}
.rbk-btn:hover:not(:disabled),.rbk-mode:hover,.rbk-ic:hover:not(:disabled),.rbk-pct:hover{background:#f4f2ee}
.rbk-btn:disabled,.rbk-ic:disabled{opacity:.38;cursor:default}
.rbk-pri{background:#16181d;border-color:#16181d;color:#fff}
.rbk-pri:hover:not(:disabled){background:#2b2e35}
.rbk-mode{border-color:transparent;color:#4a4f59}
.rbk-ic{width:34px;padding:0;border-color:transparent;color:#4a4f59}
.rbk-zoomctl{display:inline-flex;align-items:center;flex:none;border:1px solid #e6e2db;border-radius:7px;padding:1px}
.rbk-zoomctl .rbk-ic{width:30px;height:30px}
.rbk-pct{height:30px;min-width:56px;padding:0 6px;gap:4px;border-color:transparent;color:#2b2e35;font-variant-numeric:tabular-nums}
.rbk-pct svg{color:#db3433}
.rbk-where{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;gap:8px}
.rbk-where select{min-width:0;max-width:100%;font:inherit;font-size:14px;font-weight:600;color:#16181d;border:0;background:transparent;text-align:center;text-align-last:center;cursor:pointer;padding:4px;border-radius:4px;text-overflow:ellipsis}
.rbk-where select:hover{background:#f4f2ee}
.rbk-where small{flex:none;font-size:12px;color:#7b808b;font-variant-numeric:tabular-nums}
.rbk-prog{position:absolute;left:10px;right:10px;bottom:4px;height:3px;border-radius:2px;background:#ece9e3;overflow:hidden}
.rbk-prog i{display:block;height:100%;background:#db3433;transition:width .4s ease}
.rbk-resume{position:absolute;left:50%;top:calc(100% + 8px);transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:7px 8px 7px 14px;background:#16181d;color:#fff;border-radius:8px;font-size:12.5px;white-space:nowrap;box-shadow:0 10px 24px -12px rgba(20,20,25,.6)}
.rbk-resume button{border:0;background:transparent;color:#fff;font:inherit;font-weight:700;text-decoration:underline;text-underline-offset:2px;cursor:pointer;padding:2px 4px}
.rbk-resume .rbk-resume-x{display:grid;place-items:center;text-decoration:none;opacity:.7}
.rbk-side{position:fixed;top:50%;z-index:5;width:46px;height:46px;margin-top:-23px;border-radius:50%;border:1px solid #d9d5cd;background:#fff;color:#16181d;display:none;place-items:center;cursor:pointer;box-shadow:0 8px 20px -10px rgba(20,20,25,.35);transition:background .15s,opacity .15s}
.rbk.rbk-roomy .rbk-side{display:grid}
.rbk-side:hover:not(:disabled){background:#16181d;color:#fff}
.rbk-side:disabled{opacity:0;pointer-events:none}
.rbk-side-prev{left:max(12px,calc(50% - var(--rbk-sw,794px) / 2 - 70px))}
.rbk-side-next{right:max(12px,calc(50% - var(--rbk-sw,794px) / 2 - 70px))}
.rbk-stage{margin-top:${GAP_TOP}px}
@media (max-width:900px){.rbk-hide-md{display:none}.rbk-btn{padding:0 10px}}
@media (max-width:${NARROW - 1}px){.rbk-zoomctl,.rbk-fs{display:none}.rbk-hide-sm{display:none}.rbk-bar{border-radius:8px}.rbk-btn,.rbk-mode,.rbk-ic{height:40px}.rbk-ic{width:40px}.rbk-where small{display:none}.rbk-where select{text-align:left;text-align-last:left}.rbk-resume{white-space:normal;width:max-content;max-width:calc(100vw - 40px)}}
@media screen{
  .rbk{padding:10px 16px 28px}
  @media (max-width:${NARROW - 1}px){.rbk{padding:8px 10px 24px}}
  .rbk[data-mode="scroll"] .rbk-stage .frx{padding-left:0;padding-right:0}
  .rbk:fullscreen{overflow:auto;background:#f4f3f0}
  .rbk:-webkit-full-screen{overflow:auto;background:#f4f3f0}
  .rbk::backdrop{background:#f4f3f0}
  .rbk[data-mode="book"] .rbk-stage{overflow:hidden}
  .rbk[data-mode="book"].rbk-wide .rbk-stage{overflow-x:auto}
  .rbk[data-mode="book"] .rbk-size{position:relative;height:var(--rbk-sh,0px);min-width:var(--rbk-sw,0px)}
  .rbk[data-mode="book"] .rbk-zoom{position:absolute;top:0;left:50%;width:var(--rbk-bw,100%);transform:translateX(-50%) scale(var(--rbk-s,1));transform-origin:50% 0;transition:transform .28s cubic-bezier(.2,.7,.2,1)}
  .rbk[data-mode="book"] .rbk-stage .frx{display:grid;justify-items:center;align-items:start;gap:0;padding:0;background:transparent;perspective:2600px;perspective-origin:50% 30%}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet{grid-area:1/1;display:none;margin:0;border-radius:6px 16px 16px 6px}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-on,.rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-under,
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-turn-out,.rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-turn-in{display:block}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-on{z-index:2}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-under{z-index:1}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-turn-out,.rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-turn-in{z-index:3;transform-origin:left center;backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-turn-out{animation:rbkOut ${TURN_MS}ms cubic-bezier(.45,.05,.25,1) forwards}
  .rbk[data-mode="book"] .rbk-stage .frx>.sheet.rbk-turn-in{animation:rbkIn ${TURN_MS}ms cubic-bezier(.45,.05,.25,1) forwards}
  /* The flip is the motion here - the long page's scroll-in reveal is off. */
  .rbk[data-mode="book"] .frx .rv,.rbk-ov .frx .rv{opacity:1;transform:none;transition:none}
}
@media (prefers-reduced-motion:reduce){.rbk .rbk-zoom{transition:none!important}}
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
.rbk-ov{position:fixed;inset:0;z-index:90;overflow:auto;overscroll-behavior:contain;background:rgba(244,243,240,.98);padding:0 20px 40px}
.rbk-ov-hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:1120px;margin:0 auto 6px;padding:16px 0 12px;background:rgba(244,243,240,.98)}
.rbk-ov-hd b{font-size:16px;font-weight:700;color:#16181d}
.rbk-ov-hd b span{margin-left:6px;font-weight:600;color:#7b808b;font-variant-numeric:tabular-nums}
.rbk-ov-grid{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:22px 18px}
.rbk-tn{position:relative;display:flex;flex-direction:column;gap:8px;min-width:0}
.rbk-tn-pg{position:relative;aspect-ratio:210/297;overflow:hidden;background:#fff;border:1px solid #e3dfd8;border-radius:6px;box-shadow:0 6px 16px -10px rgba(20,20,25,.3);transition:transform .15s,box-shadow .15s}
.rbk-tn:hover .rbk-tn-pg{transform:translateY(-2px);box-shadow:0 12px 24px -12px rgba(20,20,25,.4)}
.rbk-tn.on .rbk-tn-pg{outline:2px solid #db3433;outline-offset:2px}
.rbk-tn small{display:block;font-size:12px;line-height:1.35;color:#4a4f59;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rbk-tn small b{margin-right:6px;color:#16181d;font-variant-numeric:tabular-nums}
.rbk-tn-hit{position:absolute;inset:-4px;border:0;border-radius:8px;background:transparent;cursor:pointer;z-index:2}
.rbk-tn-hit:focus-visible{outline:2px solid #16181d;outline-offset:2px}
.rbk-tn-in{position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none;padding:0!important;background:transparent!important;display:block!important}
.rbk-tn-in>.sheet{margin:0!important;box-shadow:none!important;border-radius:0!important;border-left:0!important;border-right:0!important;border-bottom:0!important}
@media (max-width:560px){.rbk-ov{padding:0 14px 32px}.rbk-ov-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 14px}}
html.rbk-lock-x,html.rbk-lock-x body{overscroll-behavior-x:none}
html.rbk-page,html.rbk-page body{overflow-x:clip}
@media print{.rbk-bar,.rbk-side,.rbk-ov{display:none!important}}
`;
