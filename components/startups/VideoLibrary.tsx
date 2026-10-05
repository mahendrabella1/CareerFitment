"use client";

import { useState } from "react";
import { STARTUP_VIDEO_LIBRARY } from "@/data/startups/videos";

const ACCENT = "#f97316";

export function VideoLibrary() {
  const [playing, setPlaying] = useState<string | null>(null);
  const total = STARTUP_VIDEO_LIBRARY.reduce((sum, g) => sum + g.videos.length, 0);

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Video library</h1>
      <p style={{ fontSize: 14, color: "#475569", margin: "0 0 22px", lineHeight: 1.6 }}>
        {total} expert talks from Y Combinator, TED and Stanford, grouped by the module they support. Each video plays here, so you can watch without leaving the page.
      </p>

      {STARTUP_VIDEO_LIBRARY.map((group) => (
        <section key={group.module} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>{group.module}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            {group.videos.map((v) => (
              <article key={v.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
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
                    <img
                      src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                    />
                    <span style={{ position: "absolute", inset: 0, margin: "auto", width: 52, height: 52, borderRadius: 999, background: ACCENT, color: "#fff", display: "grid", placeItems: "center", fontSize: 20 }}>▶</span>
                  </button>
                )}
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{v.channel}</div>
                  <div style={{ fontSize: 11.5, color: ACCENT, fontWeight: 700, marginTop: 6 }}>Best for: {v.bestFor}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
        Videos are hosted by YouTube. If one stops playing, tell us and we will replace it. Module 4 (validation) and Module 10 (legal in India) have no suitable free video yet.
      </p>
    </div>
  );
}
