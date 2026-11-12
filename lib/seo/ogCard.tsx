import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** A 1200 × 630 share card with the page's own title (feature pages and blog posts). */
export const OG_SIZE = { width: 1200, height: 630 };

export function ogCard(kicker: string, title: string, sub: string) {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/onegrasp-logo-tight.png")).toString("base64")}`;
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 70;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", background: "#f4f0eb", color: "#1c1917" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" height={56} style={{ height: 56 }} />
          <span style={{ fontSize: 26, fontWeight: 700, color: "#db3433", textTransform: "uppercase", letterSpacing: 2 }}>{kicker}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5 }}>{title}</span>
          <span style={{ fontSize: 28, color: "#57534e", lineHeight: 1.35 }}>{sub.length > 140 ? `${sub.slice(0, 137)}…` : sub}</span>
        </div>
        <span style={{ fontSize: 24, fontWeight: 600, color: "#78716c" }}>careerfitment.onegrasp.com</span>
      </div>
    ),
    OG_SIZE,
  );
}
