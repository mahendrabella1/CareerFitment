"use client";

import { useState } from "react";

// Click-to-play facade (loads the iframe only once clicked, keeps lesson
// pages fast on mobile data) using youtube-nocookie.com, per the PDF's own
// rule of thumb. Phase 1 skips the PDF's YT IFrame Player API watch-percent
// tracking (a real but secondary feature - lesson completion here is gated
// by the quiz, not by watch time) to keep this component simple; can be
// added later without changing the embed itself.
export function YouTubeEmbed({ videoId, title, startSec = 0 }: { videoId: string; title: string; startSec?: number }) {
  const [active, setActive] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", background: "#000" }}>
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${startSec}&autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <button onClick={() => setActive(true)} aria-label={`Play: ${title}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", cursor: "pointer", padding: 0, background: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          <span style={{
            position: "absolute", inset: 0, margin: "auto", width: 56, height: 56, borderRadius: "50%",
            display: "grid", placeItems: "center", background: "#f97316", color: "#fff", fontSize: 20,
          }}>▶</span>
        </button>
      )}
    </div>
  );
}
