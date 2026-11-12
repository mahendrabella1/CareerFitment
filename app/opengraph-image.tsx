import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** The default share card (1200 × 630) for every page without its own - built once at deploy. */
export const alt = "OneGrasp Career Fitment - the career assessment and dashboard for students, Class 6 to college";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/onegrasp-logo-tight.png")).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#f4f0eb", color: "#1c1917" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" height={64} style={{ height: 64 }} />
          <span style={{ fontSize: 30, fontWeight: 700, color: "#57534e" }}>Career Fitment</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Stop guessing your career.</span>
          <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#db3433" }}>Start knowing it.</span>
          <span style={{ fontSize: 30, color: "#57534e", marginTop: 12 }}>One test, your career report and a dashboard of courses, labs and tools - Class 6 to college.</span>
        </div>
        <span style={{ fontSize: 26, fontWeight: 600, color: "#78716c" }}>careerfitment.onegrasp.com</span>
      </div>
    ),
    size,
  );
}
