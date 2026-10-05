"use client";

import { useState, type ReactNode } from "react";

export interface ChartSeries {
  label: string;
  color: string;
  values: number[];
  dashed?: boolean;
  start?: number; // index on the x axis of values[0]
}

export interface ChartDots {
  label: string;
  color: string;
  points: { x: number; y: number }[]; // x is an index on the same axis as the series
}

const W = 600;
const H = 250;
const PAD = { l: 64, r: 16, t: 14, b: 30 };

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

/** Small dependency-free line chart for the Money Labs. */
export function LabChart({ series, dots, xLabel, yFormat, ariaLabel, markerIndex }: {
  series: ChartSeries[];
  dots?: ChartDots;
  xLabel: (i: number) => string;
  yFormat: (v: number) => string;
  ariaLabel: string;
  markerIndex?: number;
}) {
  const n = Math.max(...series.map((s) => s.values.length + (s.start ?? 0)));
  const all = series.flatMap((s) => s.values).concat(dots?.points.map((p) => p.y) ?? []);
  const minV = Math.min(0, ...all);
  const maxV = niceMax(Math.max(...all));
  const x = (i: number) => PAD.l + (n <= 1 ? 0 : (i / (n - 1)) * (W - PAD.l - PAD.r));
  const y = (v: number) => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => minV + f * (maxV - minV));
  const xTicks = n <= 1 ? [0] : Array.from(new Set([0, Math.round((n - 1) / 3), Math.round((2 * (n - 1)) / 3), n - 1]));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} style={{ width: "100%", height: "auto", display: "block" }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#64748b">{yFormat(t)}</text>
          </g>
        ))}
        {xTicks.map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize={11} fill="#64748b">{xLabel(i)}</text>
        ))}
        {markerIndex !== undefined && markerIndex >= 0 && markerIndex < n && (
          <line x1={x(markerIndex)} x2={x(markerIndex)} y1={PAD.t} y2={H - PAD.b} stroke="#94a3b8" strokeDasharray="4 4" />
        )}
        {series.map((s) => (
          <polyline key={s.label} fill="none" stroke={s.color} strokeWidth={2.5} strokeDasharray={s.dashed ? "6 5" : undefined}
            points={s.values.map((v, i) => `${x(i + (s.start ?? 0))},${y(v)}`).join(" ")} />
        ))}
        {dots?.points.map((p) => <circle key={p.x} cx={x(p.x)} cy={y(p.y)} r={3.5} fill={dots.color} />)}
      </svg>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: "#475569", marginTop: 4 }}>
        {series.map((s) => (
          <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 3, background: s.color, display: "inline-block", borderRadius: 2 }} />{s.label}
          </span>
        ))}
        {dots && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, background: dots.color, display: "inline-block", borderRadius: 999 }} />{dots.label}
          </span>
        )}
      </div>
    </div>
  );
}

/** The lab's one "aha" sentence, with a copy button so learners can share it. */
export function ShareLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text} (OneGrasp Money Labs)`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div style={{ marginTop: 16, border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: "#14532d", fontWeight: 700, flex: "1 1 260px", minWidth: 0 }}>{text}</p>
      <button onClick={copy} style={{ fontSize: 12.5, fontWeight: 800, color: "#166534", background: "#fff", border: "1px solid #86efac", borderRadius: 9, padding: "7px 12px", cursor: "pointer" }}>
        {copied ? "Copied" : "Copy to share"}
      </button>
    </div>
  );
}

export function HowCalculated({ children }: { children: ReactNode }) {
  return (
    <details style={{ marginTop: 14, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800, color: "#334155" }}>How is this calculated?</summary>
      <div style={{ marginTop: 8 }}>{children}</div>
    </details>
  );
}

export function LabNote({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, margin: "10px 0 0" }}>{children}</p>;
}

export function StatBox({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "#0ea05f" : tone === "bad" ? "#dc2626" : "#0f172a";
  return (
    <div style={{ flex: "1 1 140px", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", textAlign: "center", minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color, overflowWrap: "anywhere" }}>{value}</div>
    </div>
  );
}

export const lakh = (v: number) => {
  const a = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (a >= 1e7) return `${sign}₹${(a / 1e7).toFixed(a >= 1e8 ? 0 : 1)} Cr`;
  if (a >= 1e5) return `${sign}₹${(a / 1e5).toFixed(a >= 1e6 ? 0 : 1)} L`;
  if (a >= 1000) return `${sign}₹${Math.round(a / 1000)}k`;
  return `${sign}₹${Math.round(a)}`;
};
