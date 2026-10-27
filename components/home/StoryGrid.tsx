"use client";
/**
 * Photos from OneGrasp's sessions with schools and colleges, as a mosaic:
 * filter chips, wide and tall photos keep their shape, captions on hover
 * (always on touch screens), and a full-size viewer with previous / next,
 * arrow keys and Escape. Grid copies are public/home/stories/*.webp; the
 * viewer loads the original only when a photo is opened.
 */
import { useEffect, useRef, useState } from "react";
import { STORIES, STORIES_FIRST, STORY_TAGS, type Story, type StoryTag } from "./homeContent";

const TAG_LABEL = Object.fromEntries(STORY_TAGS.map((t) => [t.key, t.label])) as Record<StoryTag, string>;

export function StoryGrid() {
  const [tag, setTag] = useState<StoryTag | "all">("all");
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const list = STORIES.filter((s) => tag === "all" || s.tag === tag);
  const shown = tag === "all" && !all ? list.slice(0, STORIES_FIRST) : list;

  return (
    <>
      <div className="hm-chips" role="group" aria-label="Show photos of">
        {[{ key: "all" as const, label: "All" }, ...STORY_TAGS].map((t) => (
          <button key={t.key} type="button" aria-pressed={tag === t.key} onClick={() => { setTag(t.key); setOpen(null); }}>
            {t.label}<em>{t.key === "all" ? STORIES.length : STORIES.filter((s) => s.tag === t.key).length}</em>
          </button>
        ))}
      </div>
      <div className="hm-stories">
        {shown.map((s, i) => (
          <button key={s.key} type="button" className={`hm-st ${s.w > s.h ? "is-wide" : "is-tall"}`} onClick={() => setOpen(i)} aria-label={`${s.caption} - open photo`}
            data-rv="zoom" style={{ transitionDelay: `${(i % STORIES_FIRST) * 55}ms` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/home/stories/${s.key}.webp`} alt="" width={s.w} height={s.h} loading="lazy" decoding="async" style={s.pos ? { objectPosition: s.pos } : undefined} />
            <span className="hm-st-cap"><b>{s.caption}</b><small>{TAG_LABEL[s.tag]}</small></span>
          </button>
        ))}
      </div>
      {tag === "all" && !all && list.length > STORIES_FIRST && (
        <div className="hm-stories-more">
          <button type="button" className="hm-btn" onClick={() => setAll(true)}>Show all {list.length} photos</button>
        </div>
      )}
      {open !== null && shown[open] && <Viewer items={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

function Viewer({ items, index, onIndex, onClose }: { items: Story[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const s = items[index];
  const closeBtn = useRef<HTMLButtonElement>(null);
  const step = (d: number) => onIndex((index + d + items.length) % items.length);

  // On open: focus the close button, stop the page scrolling; give both back on close.
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => { document.body.style.overflow = overflow; before?.focus?.(); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // "Fixed" to the screen only while no ancestor is transformed - the photo
  // section opts out of the home page's scroll-in lift (#stories in Landing's CSS).
  return (
    <div className="hm-lb" role="dialog" aria-modal="true" aria-label={s.caption} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <figure>
        {/* The grid copy shows at once; the original replaces it as it loads. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={s.key} src={s.full} alt={s.caption} style={{ backgroundImage: `url(/home/stories/${s.key}.webp)` }} />
        <figcaption><b>{s.caption}</b><span>{TAG_LABEL[s.tag]} · {index + 1} / {items.length}</span></figcaption>
      </figure>
      <button ref={closeBtn} type="button" className="hm-lb-x" onClick={onClose} aria-label="Close">×</button>
      {items.length > 1 && <>
        <button type="button" className="hm-lb-prev" onClick={() => step(-1)} aria-label="Previous photo">‹</button>
        <button type="button" className="hm-lb-next" onClick={() => step(1)} aria-label="Next photo">›</button>
      </>}
    </div>
  );
}
