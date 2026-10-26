"use client";
/**
 * The 20-second starter guide on a feature's first visit: story-style slides
 * that play themselves (a bar fills, then the next slide), pause while the
 * pointer is over them, and can be tapped left/right or stepped with the
 * arrow keys. Seen once per student per feature (scopedKey, so a shared
 * computer doesn't hide it from the next student); "Quick tour" in the hero
 * replays it.
 */
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/app/Icons";
import { scopedKey } from "@/lib/progress/userStorage";
import type { FeatureMeta } from "@/lib/features/catalog";
import { featureArt } from "@/lib/features/catalog";

const SLIDE_MS = 4500;
const seenKey = (key: string) => scopedKey(`onegrasp.tour.${key}.v1`);

export function tourSeen(key: string): boolean {
  try { return window.localStorage.getItem(seenKey(key)) === "1"; } catch { return true; }
}
function markSeen(key: string) {
  try { window.localStorage.setItem(seenKey(key), "1"); } catch { /* private mode */ }
}

export function FeatureTour({ meta, onClose, stats }: { meta: FeatureMeta; onClose: () => void; stats?: string }) {
  const slides = [
    { icon: "", title: `Welcome to ${meta.title}`, text: `${meta.style}${stats ? ` - ${stats}` : ""}. Here's what's inside, in 20 seconds.` },
    ...meta.tour,
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const last = i === slides.length - 1;
  const art = featureArt(meta.key);

  const close = () => { markSeen(meta.key); onClose(); };
  const next = () => (last ? close() : setI((n) => n + 1));
  const prev = () => setI((n) => Math.max(0, n - 1));

  useEffect(() => {
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const s = slides[i];
  return (
    <div className="fp-tour" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div
        ref={dialog}
        className={`fp-tour-d${paused ? " is-paused" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${meta.title}: quick tour`}
        tabIndex={-1}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ ["--dur" as string]: `${SLIDE_MS}ms` }}
      >
        <div className="fp-tour-bars" aria-hidden="true">
          {slides.map((_, n) => (
            <i key={n}>
              <b
                key={`${n}-${i}`}
                className={n < i ? "is-done" : n === i && !last ? "is-run" : n === i ? "is-done" : ""}
                onAnimationEnd={n === i ? next : undefined}
              />
            </i>
          ))}
        </div>
        <button className="fp-tour-x" onClick={close} aria-label="Close the tour"><Icon name="close" size={16} stroke={2} /></button>

        <div className="fp-tour-top">
          <button className="fp-tour-tap" style={{ left: 0 }} onClick={prev} aria-label="Previous slide" tabIndex={-1} />
          <button className="fp-tour-tap" style={{ right: 0 }} onClick={next} aria-label="Next slide" tabIndex={-1} />
          {i === 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={art.src} alt="" />
          ) : (
            <span className="fp-tour-ic"><Icon name={s.icon} size={38} stroke={1.6} /></span>
          )}
        </div>
        <div className="fp-tour-body" aria-live="polite">
          <small>{i === 0 ? "Quick tour" : `${i} of ${slides.length - 1}`}</small>
          <h2>{s.title}</h2>
          <p>{s.text}</p>
        </div>
        <div className="fp-tour-f">
          {i > 0 ? <button className="fp-btn fp-btn-sm" onClick={prev}><Icon name="arrowLeft" size={15} stroke={2} /> Back</button> : <button className="fp-link" style={{ fontSize: 13.5, color: "var(--mute)" }} onClick={close}>Skip tour</button>}
          <button className="fp-btn fp-btn-pri" style={{ marginLeft: "auto" }} onClick={next}>
            {last ? "Start exploring" : "Next"} <Icon name="arrowRight" size={15} stroke={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
