"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { RIGHTS_CARDS, type RightsCard } from "@/data/legal/rightsCards";

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Splits text into lines that fit maxWidth with the context's current font. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws the card as a 1080x1350 image (portrait, phone-gallery friendly). Runs in the browser only. */
function drawCard(card: RightsCard): HTMLCanvasElement {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = card.color;
  ctx.fillRect(0, 0, W, 330);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `800 32px ${FONT}`;
  ctx.fillText("KNOW YOUR RIGHTS", 80, 105);
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 66px ${FONT}`;
  let y = 190;
  for (const l of wrapLines(ctx, card.title, W - 160)) {
    ctx.fillText(l, 80, y);
    y += 78;
  }

  y = 430;
  ctx.font = `500 42px ${FONT}`;
  for (const line of card.lines) {
    ctx.fillStyle = card.color;
    ctx.beginPath();
    ctx.arc(94, y - 14, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    for (const l of wrapLines(ctx, line, W - 210)) {
      ctx.fillText(l, 128, y);
      y += 56;
    }
    y += 26;
  }

  const boxY = H - 260;
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(60, boxY, W - 120, 120);
  ctx.fillStyle = "#0f172a";
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText(card.help, 90, boxY + 74);

  ctx.fillStyle = "#64748b";
  ctx.font = `400 26px ${FONT}`;
  ctx.fillText("OneGrasp · General information, not legal advice. Emergency: 112", 80, H - 64);
  return canvas;
}

function cardText(card: RightsCard) {
  return [card.title, ...card.lines.map((l) => `• ${l}`), card.help, "General information, not legal advice. Emergency: 112"].join("\n");
}

export function RightsCards() {
  const [status, setStatus] = useState<Record<string, string>>({});

  const flash = (id: string, msg: string) => {
    setStatus((s) => ({ ...s, [id]: msg }));
    setTimeout(() => setStatus((s) => ({ ...s, [id]: "" })), 2200);
  };

  const saveImage = (card: RightsCard) => {
    const canvas = drawCard(card);
    canvas.toBlob((blob) => {
      if (!blob) return flash(card.id, "Could not create the image");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rights-card-${card.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      flash(card.id, "Saved");
    }, "image/png");
  };

  const copy = async (card: RightsCard) => {
    try {
      await navigator.clipboard.writeText(cardText(card));
      flash(card.id, "Copied");
    } catch {
      flash(card.id, "Copy not allowed here");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
      {RIGHTS_CARDS.map((card) => (
        <article key={card.id} style={{ border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
          <div style={{ background: card.color, color: "#fff", padding: "14px 16px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", opacity: 0.85 }}>KNOW YOUR RIGHTS</div>
            <div style={{ fontSize: 17, fontWeight: 900, marginTop: 4, lineHeight: 1.3 }}>{card.title}</div>
          </div>
          <ul style={{ margin: 0, padding: "12px 16px 0 32px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {card.lines.map((l) => <li key={l} style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.5 }}>{l}</li>)}
          </ul>
          <div style={{ margin: "12px 16px 0", background: "#f1f5f9", borderRadius: 10, padding: "8px 10px", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{card.help}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "12px 16px 14px" }}>
            <button onClick={() => saveImage(card)} style={btn(card.color, true)}>Save image</button>
            <button onClick={() => copy(card)} style={btn(card.color, false)}>Copy text</button>
            <Link href={`/account/legal/guides/${card.guideSlug}`} style={{ fontSize: 12.5, fontWeight: 800, color: card.color, textDecoration: "none" }}>Guide →</Link>
            {status[card.id] && <span style={{ fontSize: 12, color: "#64748b" }}>{status[card.id]}</span>}
          </div>
        </article>
      ))}
    </div>
  );
}

const btn = (color: string, solid: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: solid ? "#fff" : color,
  background: solid ? color : "#fff",
  border: `1px solid ${color}`,
  borderRadius: 9,
  padding: "7px 12px",
  cursor: "pointer",
});
