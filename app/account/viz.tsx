"use client";

/**
 * viz — small, dependency-free SVG data-visualisation primitives shared by the
 * dashboard and (later) the premium report. Everything is hand-drawn SVG so it
 * stays crisp on screen and in print. One accent system: near-black ink, greys,
 * and a single light-red primary. No external chart libraries.
 */

import type { ReactNode } from "react";

/* --------------------------- design tokens ----------------------------- */
export const C = {
  ink: "#141417",
  ink2: "#3d3d45",
  ink3: "#63636f",
  muted: "#9a9aa6",
  faint: "#c4c4cd",
  line: "#ececef",
  line2: "#f4f4f6",
  bg: "#f7f7f8",
  surface: "#ffffff",
  red: "#F2555A",
  redStrong: "#E23B41",
  redTint: "#FDECED",
  redLine: "#F8CBCD",
  good: "#2f9e6f",
  goodTint: "#eaf6f0",
} as const;

export const clampPct = (n: number) => Math.max(2, Math.min(100, Math.round(n)));

/**
 * Per-dimension identity colours — the validated 8-slot categorical palette
 * (colourblind-safe, CVD ΔE ≥ 8; see dataviz skill). Used to colour charts by
 * dimension. Page chrome stays ink/grey/red; only data marks take these hues.
 */
export const DIM_COLORS: Record<string, string> = {
  personality: "#2a78d6",
  career_interest: "#008300",
  multiple_intelligence: "#e87ba4",
  emotional_intelligence: "#eda100",
  learning_styles: "#1baf7a",
  motivators: "#eb6834",
  strengths: "#4a3aa7",
  aptitude: "#e34948",
};
export const dimColor = (key: string) => DIM_COLORS[key] ?? C.red;

/* ------------------------------- Ring ---------------------------------- */
/** Progress ring with a slot for centred content. */
export function Ring({
  value,
  size = 128,
  stroke = 12,
  color = C.red,
  track = C.line,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - clampPct(value) / 100);
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden style={{ display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ.toFixed(1)}
          strokeDashoffset={off.toFixed(1)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- SkillBar -------------------------------- */
/** Horizontal bar with an optional benchmark tick (typical-student marker). */
export function SkillBar({
  value,
  color = C.red,
  height = 8,
  benchmark,
  track = C.line,
}: {
  value: number;
  color?: string;
  height?: number;
  benchmark?: number;
  track?: string;
}) {
  return (
    <div style={{ position: "relative", height, background: track, borderRadius: 999, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${clampPct(value)}%`,
          background: color,
          borderRadius: 999,
          transition: "width .9s cubic-bezier(.2,.8,.2,1)",
        }}
      />
      {benchmark != null && (
        <div
          title={`Typical: ${Math.round(benchmark)}`}
          style={{
            position: "absolute",
            top: -2,
            bottom: -2,
            left: `${clampPct(benchmark)}%`,
            width: 2,
            background: C.ink,
            opacity: 0.35,
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------- RadarChart ------------------------------- */
export type RadarDatum = { key: string; label: string; score: number };

/** Single-series radar. Stateless — parent owns the selected index. */
export function RadarChart({
  data,
  selected = -1,
  onSelect,
  color = C.red,
  abbr,
}: {
  data: RadarDatum[];
  selected?: number;
  onSelect?: (i: number) => void;
  color?: string;
  abbr?: Record<string, string>;
}) {
  const cx = 170,
    cy = 160,
    R = 116,
    n = data.length || 8;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, rad: number): [number, number] => [cx + rad * Math.cos(ang(i)), cy + rad * Math.sin(ang(i))];
  const ringPath = (f: number) =>
    data.map((_, i) => pt(i, R * f)).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  const poly = data.map((d, i) => pt(i, (R * clampPct(d.score)) / 100));
  const polyD = poly.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  const rgbA = hexToRgba(color, 0.14);

  return (
    <svg viewBox="0 0 340 330" role="img" aria-label="Your profile across eight dimensions"
      style={{ width: "100%", maxWidth: 360, height: "auto", overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <path key={f} d={ringPath(f)} fill="none" stroke={C.line} strokeWidth={1} />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.line} strokeWidth={1} />;
      })}
      <path d={polyD} fill={rgbA} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {poly.map(([x, y], i) => (
        <circle
          key={i}
          cx={x.toFixed(1)}
          cy={y.toFixed(1)}
          r={i === selected ? 6 : 3.6}
          fill={i === selected ? C.ink : color}
          onClick={onSelect ? () => onSelect(i) : undefined}
          style={{ cursor: onSelect ? "pointer" : "default" }}
        />
      ))}
      {data.map((d, i) => {
        const [x, y] = pt(i, R + 20);
        const anchor = Math.abs(x - cx) < 12 ? "middle" : x > cx ? "start" : "end";
        return (
          <text
            key={d.key}
            x={x.toFixed(1)}
            y={(y + 3).toFixed(1)}
            textAnchor={anchor}
            fontSize="10"
            fontWeight={i === selected ? 800 : 600}
            fill={i === selected ? C.ink : C.muted}
            onClick={onSelect ? () => onSelect(i) : undefined}
            style={{ cursor: onSelect ? "pointer" : "default" }}
          >
            {abbr?.[d.key] ?? d.label.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------ helpers -------------------------------- */
function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
