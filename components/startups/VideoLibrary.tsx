"use client";

import { useRef, useState, type CSSProperties } from "react";
import { STARTUP_VIDEO_LIBRARY } from "@/data/startups/videos";
import { Pager, usePaged } from "@/components/ui/Pager";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#f97316";
const PAGE_SIZE = 8;

// One grid for every talk, with the module as a filter, instead of a
// separate small section per module (most hold a single video).
const ALL_VIDEOS = STARTUP_VIDEO_LIBRARY.flatMap((g) => g.videos.map((v) => ({ ...v, module: g.module })));

export function VideoLibrary() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [module, setModule] = useState<string | null>(null);
  const shown = module ? ALL_VIDEOS.filter((v) => v.module === module) : ALL_VIDEOS;
  const paged = usePaged(shown, PAGE_SIZE, module);
  const top = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <PageHeader icon="video" eyebrow="Learn from founders" title="Video library"
        subtitle={`${ALL_VIDEOS.length} expert talks from Y Combinator, TED and Stanford, tagged by the module they support. Each video plays here, so you can watch without leaving the page.`} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setModule(null)} style={chip(module === null)}>All · {ALL_VIDEOS.length}</button>
        {STARTUP_VIDEO_LIBRARY.map((g) => (
          <button key={g.module} onClick={() => setModule(g.module)} style={chip(module === g.module)}>{g.module} · {g.videos.length}</button>
        ))}
      </div>

      <div ref={top} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14, scrollMarginTop: 80 }}>
        {paged.items.map((v) => (
          <article key={v.id} className="fx-lift" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {playing === v.id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                title={v.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", aspectRatio: "16 / 9", border: 0, display: "block" }}
              />
            ) : (
              <button
                onClick={() => setPlaying(v.id)}
                aria-label={`Play: ${v.title}`}
                style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", border: 0, padding: 0, background: "#0f172a", cursor: "pointer", display: "block" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                />
                <span style={{ position: "absolute", inset: 0, margin: "auto", width: 52, height: 52, borderRadius: 999, background: ACCENT, color: "#fff", display: "grid", placeItems: "center", fontSize: 20 }}>▶</span>
              </button>
            )}
            <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
              {!module && <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em" }}>{v.module}</div>}
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{v.title}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{v.channel}</div>
              <div style={{ fontSize: 11.5, color: ACCENT, fontWeight: 700, marginTop: "auto", paddingTop: 4 }}>Best for: {v.bestFor}</div>
            </div>
          </article>
        ))}
      </div>
      <Pager paged={paged} accent={ACCENT} noun="videos" scrollTo={top} />

      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginTop: 18 }}>
        Videos are hosted by YouTube. If one stops playing, tell us and we will replace it. Module 4 (validation) and Module 10 (legal in India) have no suitable free video yet.
      </p>
    </div>
  );
}

const chip = (on: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 700,
  color: on ? "#fff" : "#475569",
  background: on ? ACCENT : "#fff",
  border: `1px solid ${on ? ACCENT : "#e2e8f0"}`,
  borderRadius: 999,
  padding: "6px 12px",
  cursor: "pointer",
});
