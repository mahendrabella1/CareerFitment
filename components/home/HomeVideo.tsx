"use client";
/**
 * A home-page video that costs nothing until it plays: a lazy still over a
 * `preload="none"` video.
 *
 * - Click mode (default, the hero tour): a play button; playing starts inside
 *   the click, so phones allow sound, then the native controls take over.
 * - `auto` (the zig-zag rows): plays muted and loops whenever at least half of
 *   it is on screen, and pauses when it leaves, with its own pause and sound
 *   buttons. Visitors who asked their device for less motion or to save data
 *   get click mode instead.
 *
 * Only one video plays sound at a time: turning sound on in one mutes the rest.
 */
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { Icon } from "@/app/Icons";
import type { HomeVideoInfo } from "./homeContent";

export interface HomeVideoHandle {
  /** Jump to `t` seconds and play with sound. */
  playFrom: (t: number) => void;
  /** Jump to `t` seconds and keep playing, sound left as it is. */
  seek: (t: number) => void;
}

const SOUND_EVENT = "hm-sound";

export const HomeVideo = forwardRef<HomeVideoHandle, {
  video: HomeVideoInfo;
  title: string;
  auto?: boolean;
  eager?: boolean;
  onTime?: (t: number) => void;
}>(function HomeVideo({ video, title, auto, eager, onTime }, ref) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [autoOn, setAutoOn] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);
  const userPaused = useRef(false);
  const start = video.start ?? 0;
  const hasSound = video.sound !== false;

  const claimSound = () => window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: id }));

  const play = (t: number | null, withSound: boolean) => {
    const v = el.current;
    if (!v) return;
    v.muted = !withSound;
    setMuted(!withSound);
    if (withSound) claimSound();
    if (t !== null) { try { v.currentTime = t; } catch { /* not seekable yet - the #t= fragment covers the start */ } }
    setStarted(true);
    userPaused.current = false;
    // If the browser won't allow sound, play muted rather than not at all.
    void v.play().catch(() => { v.muted = true; setMuted(true); void v.play().catch(() => undefined); });
  };

  useImperativeHandle(ref, () => ({
    playFrom: (t) => play(t, true),
    seek: (t) => play(t, el.current ? !el.current.muted : false),
  }));

  // Someone else turned their sound on.
  useEffect(() => {
    const off = (e: Event) => {
      const v = el.current;
      if ((e as CustomEvent).detail !== id && v && !v.muted) { v.muted = true; setMuted(true); }
    };
    window.addEventListener(SOUND_EVENT, off);
    return () => window.removeEventListener(SOUND_EVENT, off);
  }, [id]);

  // Auto mode: play while on screen.
  useEffect(() => {
    if (!auto || !box.current || !("IntersectionObserver" in window)) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || saveData) return;
    setAutoOn(true);
    const io = new IntersectionObserver(([e]) => {
      const v = el.current;
      if (!v) return;
      if (e.intersectionRatio >= 0.5) {
        if (userPaused.current) return;
        if (!v.currentTime && start) { try { v.currentTime = start; } catch { /* fragment */ } }
        setStarted(true);
        void v.play().catch(() => undefined);
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: [0, 0.5] });
    io.observe(box.current);
    return () => io.disconnect();
  }, [auto, start]);

  const togglePause = () => {
    const v = el.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; void v.play().catch(() => undefined); }
    else { userPaused.current = true; v.pause(); }
  };
  const toggleSound = () => {
    const v = el.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) { claimSound(); if (v.paused) togglePause(); }
  };

  const custom = autoOn && started; // our own buttons instead of the native controls
  return (
    <div ref={box} className="hm-video">
      <video
        ref={el}
        src={start ? `${video.src}#t=${start}` : video.src}
        preload="none"
        playsInline
        muted
        loop={autoOn && !video.end}
        controls={started && !autoOn}
        poster={started ? video.poster : undefined}
        aria-label={title}
        onClick={custom ? togglePause : undefined}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          onTime?.(v.currentTime);
          // A clip of a longer video: loop it in auto mode, otherwise stop, ready to replay.
          if (video.end && v.currentTime >= video.end) {
            v.currentTime = start;
            if (!autoOn) v.pause();
          }
        }}
      />
      {!started && (
        <button type="button" className="hm-video-cover" onClick={() => play(start, true)} aria-label={`Play: ${title}, ${video.length}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={video.poster} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
          <span className="hm-play"><Icon name="play" size={22} /></span>
          <span className="hm-len">{video.length}</span>
        </button>
      )}
      {custom && (
        <div className="hm-vctl">
          <button type="button" onClick={togglePause} aria-label={paused ? `Play ${title}` : `Pause ${title}`}>
            {paused ? <Icon name="play" size={15} /> : <PauseGlyph />}
          </button>
          {hasSound && (
            <button type="button" onClick={toggleSound} aria-label={muted ? `Turn on sound for ${title}` : `Turn off sound for ${title}`} aria-pressed={!muted}>
              <SoundGlyph on={!muted} />{muted && <span>Sound</span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

function PauseGlyph() {
  return <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>;
}

function SoundGlyph({ on }: { on: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" stroke="none" />
      {on ? <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></> : <><path d="m16 9 5 6" /><path d="m21 9-5 6" /></>}
    </svg>
  );
}
