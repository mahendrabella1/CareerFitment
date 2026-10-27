"use client";
/**
 * The small charts on the Workplace Stress Check results dashboard. Thin
 * marks, hairline grids, one blue ramp for level and one colour per area;
 * every chart has its numbers in text next to it, so nothing is readable by
 * colour alone.
 */
import { useEffect, useRef, useState } from "react";
import { LEVEL_META } from "@/lib/stress/content";
import { COMPASS_CUT, LEVEL_CUTS, levelFor } from "@/lib/stress/scoring";
import type { Quadrant } from "@/lib/stress/types";
import { ACCENT } from "./styles";

/** One area's bar: the fill's shade is its level; white ticks mark the level cut-offs. */
export function AreaTrack({ value, avg }: { value: number; avg?: number | null }) {
  return (
    <span className="ws-track" aria-hidden="true">
      <i style={{ width: `${Math.max(value, 1.5)}%`, background: LEVEL_META[levelFor(value)].color }} />
      {[LEVEL_CUTS.mild, LEVEL_CUTS.moderate, LEVEL_CUTS.high].map((c) => <s key={c} style={{ left: `${c}%` }} />)}
      {avg != null && <u style={{ left: `calc(${avg}% - 3px)` }} />}
    </span>
  );
}

const QUAD_LABEL: Record<Quadrant, string> = { steady: "Steady ground", load: "Heavy load", place: "Hard place", both: "Both" };

/** "Is it the work or the workplace?" - Workload across, the other three areas up. */
export function Compass({ work, place, quadrant }: { work: number; place: number; quadrant: Quadrant }) {
  const L = 34, T = 8, S = 216, PAD = 10;
  const x = (v: number) => L + PAD + (v / 100) * (S - 2 * PAD);
  const y = (v: number) => T + S - PAD - (v / 100) * (S - 2 * PAD);
  const cx = x(COMPASS_CUT), cy = y(COMPASS_CUT);
  const quads: { q: Quadrant; x: number; y: number; w: number; h: number; lx: number; ly: number; anchor: "start" | "end" }[] = [
    { q: "place", x: L, y: T, w: cx - L, h: cy - T, lx: L + 8, ly: T + 16, anchor: "start" },
    { q: "both", x: cx, y: T, w: L + S - cx, h: cy - T, lx: L + S - 8, ly: T + 16, anchor: "end" },
    { q: "steady", x: L, y: cy, w: cx - L, h: T + S - cy, lx: L + 8, ly: T + S - 10, anchor: "start" },
    { q: "load", x: cx, y: cy, w: L + S - cx, h: T + S - cy, lx: L + S - 8, ly: T + S - 10, anchor: "end" },
  ];
  const px = x(work), py = y(place);
  const labelLeft = px > L + S - 40;
  const labelY = py > T + S - 24 ? py - 10 : py + 4;
  // A corner label the dot (or its "You") would sit on is left out - the quadrant is named beside the chart.
  const clash = (r: (typeof quads)[number]) => {
    const lx0 = r.anchor === "start" ? r.lx : r.lx - 80, lx1 = lx0 + 80;
    return px + 40 > lx0 && px - 14 < lx1 && Math.abs(py - (r.ly - 4)) < 16;
  };
  return (
    <svg viewBox="0 0 260 262" role="img" aria-label={`The work (Workload) ${work}, the workplace ${place}: ${QUAD_LABEL[quadrant]}`}>
      {quads.map((r) => (
        <g key={r.q}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.q === quadrant ? "#edf3fb" : "#fafaf8"} />
          {!clash(r) && <text x={r.lx} y={r.ly} textAnchor={r.anchor} fontSize="10.5" fontWeight={r.q === quadrant ? 650 : 500} fill={r.q === quadrant ? "#0b0b0b" : "#898781"}>{QUAD_LABEL[r.q]}</text>}
        </g>
      ))}
      <line x1={cx} y1={T} x2={cx} y2={T + S} stroke="#e1e0d9" strokeWidth="1" />
      <line x1={L} y1={cy} x2={L + S} y2={cy} stroke="#e1e0d9" strokeWidth="1" />
      <line x1={L} y1={T} x2={L} y2={T + S} stroke="#c3c2b7" strokeWidth="1" />
      <line x1={L} y1={T + S} x2={L + S} y2={T + S} stroke="#c3c2b7" strokeWidth="1" />
      <text x={L + S / 2} y={T + S + 22} textAnchor="middle" fontSize="11" fill="#52514e" fontWeight="600">The work (Workload): {work} →</text>
      <text transform={`translate(${L - 14} ${T + S / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fill="#52514e" fontWeight="600">The workplace: {place} →</text>
      <g>
        <title>{`Workload ${work} · Workplace ${place}`}</title>
        <circle cx={px} cy={py} r="12" fill="transparent" />
        <circle cx={px} cy={py} r="6.5" fill={ACCENT} stroke="#fff" strokeWidth="2.5" />
        <text x={labelLeft ? px - 12 : px + 12} y={labelY} textAnchor={labelLeft ? "end" : "start"} fontSize="11.5" fontWeight="650" fill="#0b0b0b">You</text>
      </g>
    </svg>
  );
}

/** A tiny trend: first point = the check, then each weekly check-in. */
export function Sparkline({ values }: { values: number[] }) {
  const W = 120, H = 34, P = 4;
  const x = (i: number) => (values.length < 2 ? W / 2 : P + (i / (values.length - 1)) * (W - 2 * P));
  const y = (v: number) => P + (1 - v / 100) * (H - 2 * P);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const last = values[values.length - 1] ?? 0;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ display: "block" }}>
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#e6e5df" strokeWidth="1" />
      {values.length > 1 && <path d={d} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
      <circle cx={x(values.length - 1)} cy={y(last)} r="3.5" fill={ACCENT} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/** Overall score across retakes, with the level cut-offs as hairlines. Drawn
 *  at its real pixel width, so the text stays 11px at any size. */
export function TrendChart({ points }: { points: { label: string; value: number }[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(640);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div ref={box}><TrendSvg points={points} W={W} /></div>;
}

function TrendSvg({ points, W }: { points: { label: string; value: number }[]; W: number }) {
  const H = 200, L = 34, R = 70, T = 18, B = 30;
  const pw = W - L - R, ph = H - T - B;
  const x = (i: number) => L + (points.length < 2 ? pw / 2 : (i / (points.length - 1)) * pw);
  const y = (v: number) => T + (1 - v / 100) * ph;
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const bands: [string, number][] = [["Low", 12], ["Mild", 35], ["Moderate", 55], ["High", 82]];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} role="img" aria-label={`Workplace Stress Score over time: ${points.map((p) => `${p.label} ${p.value}`).join(", ")}`}>
      {[0, LEVEL_CUTS.mild, LEVEL_CUTS.moderate, LEVEL_CUTS.high, 100].map((v) => (
        <g key={v}>
          <line x1={L} y1={y(v)} x2={L + pw} y2={y(v)} stroke={v === 0 ? "#c3c2b7" : "#e6e5df"} strokeWidth="1" />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#898781" style={{ fontVariantNumeric: "tabular-nums" }}>{v}</text>
        </g>
      ))}
      {bands.map(([t, v]) => <text key={t} x={L + pw + 10} y={y(v) + 4} fontSize="11" fill="#898781">{t}</text>)}
      <path d={d} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <title>{`${p.label}: ${p.value}`}</title>
          <circle cx={x(i)} cy={y(p.value)} r="12" fill="transparent" />
          <circle cx={x(i)} cy={y(p.value)} r="4.5" fill={ACCENT} stroke="#fff" strokeWidth="2" />
          {(points.length <= 8 || i === 0 || i === points.length - 1) && (
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#898781">{p.label}</text>
          )}
        </g>
      ))}
      {points.length > 0 && (
        <text x={x(points.length - 1)} y={y(points[points.length - 1].value) - 12} textAnchor="middle" fontSize="12.5" fontWeight="650" fill="#0b0b0b">{points[points.length - 1].value}</text>
      )}
    </svg>
  );
}

/** Each area's share of all the stress reported, as a donut (4 segments, a
 *  2px surface gap between them; the numbers are in the legend beside it). */
export function ShareDonut({ parts, size = 168 }: { parts: { key: string; label: string; value: number; color: string }[]; size?: number }) {
  const r = size / 2 - 14, c = 2 * Math.PI * r, cx = size / 2;
  const total = parts.reduce((s, p) => s + p.value, 0);
  const gap = total ? 2 : 0;
  let acc = 0;
  const top = [...parts].sort((a, b) => b.value - a.value)[0];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={parts.map((p) => `${p.label} ${p.value}%`).join(", ")}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#ece9e3" strokeWidth="18" />
      {total > 0 && parts.map((p) => {
        const len = (p.value / total) * c;
        const el = (
          <circle key={p.key} cx={cx} cy={cx} r={r} fill="none" stroke={p.color} strokeWidth="18"
            strokeDasharray={`${Math.max(0, len - gap)} ${c}`} strokeDashoffset={-acc} transform={`rotate(-90 ${cx} ${cx})`}>
            <title>{`${p.label}: ${p.value}% of your stress`}</title>
          </circle>
        );
        acc += len;
        return el;
      })}
      <text x={cx} y={cx - 2} textAnchor="middle" fontSize="26" fontWeight="700" fill="#16181d" fontFamily="Poppins, Inter, sans-serif">{total ? `${top.value}%` : "-"}</text>
      <text x={cx} y={cx + 18} textAnchor="middle" fontSize="11.5" fill="#7b808b">{total ? top.label : "no stress"}</text>
    </svg>
  );
}

/** A thin horizontal bar in a given colour, 0-100. */
export function Bar({ value, color, height = 8 }: { value: number; color: string; height?: number }) {
  return (
    <span style={{ display: "block", height, borderRadius: 4, background: "#ece9e3", overflow: "hidden" }} aria-hidden="true">
      <span style={{ display: "block", height: "100%", width: `${Math.max(value, value > 0 ? 2 : 0)}%`, background: color, borderRadius: "0 4px 4px 0" }} />
    </span>
  );
}

/** Steps done in one action, as a thin ring. */
export function Ring({ done, total }: { done: number; total: number }) {
  const r = 19, c = 2 * Math.PI * r, f = total ? done / total : 0;
  return (
    <div className="ws-ring" aria-label={`${done} of ${total} steps done`}>
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} fill="none" stroke="#edf3fb" strokeWidth="4" />
        {f > 0 && <circle cx="23" cy="23" r={r} fill="none" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${f * c} ${c}`} transform="rotate(-90 23 23)" />}
      </svg>
      <span>{done}/{total}</span>
    </div>
  );
}
