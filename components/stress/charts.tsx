"use client";
/** SVG charts for the Stress & Resilience results page. Each has a text
 *  equivalent (aria-label / visible numbers) so nothing depends on the picture. */
import { ZONE_META } from "@/lib/stress/content";
import { ZONE_FROM } from "@/lib/stress/scoring";
import type { Zone } from "@/lib/stress/types";
import { PRESSURE, RESOURCE } from "./styles";

const ZONES_ASC: Zone[] = [...ZONE_FROM].reverse().map(([z]) => z);
const zoneStart = (z: Zone) => ZONE_FROM.find(([k]) => k === z)![1];

function polar(cx: number, cy: number, r: number, value: number) {
  const a = Math.PI * (1 - value / 100);
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from), [x2, y2] = polar(cx, cy, r, to);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** Semicircle gauge 0-100 with the five zones and a marker at the index. */
export function Gauge({ value, zone }: { value: number; zone: Zone }) {
  const cx = 150, cy = 150, r = 116, w = 20;
  const [mx, my] = polar(cx, cy, r, value);
  const meta = ZONE_META[zone];
  return (
    <svg viewBox="0 0 300 178" role="img" aria-label={`Stress Index ${value} out of 100: ${meta.label}`} style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto" }}>
      {ZONES_ASC.map((z, i) => {
        const from = zoneStart(z), to = i < ZONES_ASC.length - 1 ? zoneStart(ZONES_ASC[i + 1]) : 100;
        return <path key={z} d={arc(cx, cy, r, from + 0.6, to - 0.6)} stroke={ZONE_META[z].color} strokeOpacity={z === zone ? 1 : 0.22} strokeWidth={w} fill="none" strokeLinecap="butt" />;
      })}
      <circle cx={mx} cy={my} r={13} fill="#fff" stroke={meta.color} strokeWidth={5} />
      <text x={cx} y={cy - 22} textAnchor="middle" style={{ font: "700 46px Poppins, Inter, sans-serif", fill: "#0f1728" }}>{value}</text>
      <text x={cx} y={cy + 2} textAnchor="middle" style={{ font: "600 13px Inter, sans-serif", fill: "#6b7686" }}>Stress Index · out of 100</text>
      <text x={cx - r} y={cy + 24} textAnchor="middle" style={{ font: "600 11px Inter, sans-serif", fill: "#98a2b3" }}>Low</text>
      <text x={cx + r} y={cy + 24} textAnchor="middle" style={{ font: "600 11px Inter, sans-serif", fill: "#98a2b3" }}>High</text>
    </svg>
  );
}

/** A balance scale: pressure on the left, resources on the right; the heavier side sinks. */
export function Seesaw({ pressure, resources }: { pressure: number; resources: number }) {
  const tilt = Math.max(-14, Math.min(14, ((pressure - resources) / 100) * 30)); // +: pressure side down
  const cx = 180, cy = 54, half = 126;
  const a = (tilt * Math.PI) / 180;
  // Beam ends: left = pressure, right = resources; a positive tilt lowers the left end.
  const end = (side: -1 | 1) => [cx + side * half * Math.cos(a), cy - side * half * Math.sin(a)] as const;
  const pan = (side: -1 | 1, value: number, label: string, color: string) => {
    const [x, y] = end(side);
    return (
      <g key={label}>
        <line x1={x} y1={y} x2={x} y2={y + 18} stroke="#c3cad4" strokeWidth={2} />
        <path d={`M ${x - 44} ${y + 18} Q ${x} ${y + 46} ${x + 44} ${y + 18} Z`} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={2} />
        <text x={x} y={y + 76} textAnchor="middle" style={{ font: "700 24px Poppins, Inter, sans-serif", fill: color }}>{value}</text>
        <text x={x} y={y + 95} textAnchor="middle" style={{ font: "700 12.5px Inter, sans-serif", fill: "#465467" }}>{label}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 360 178" role="img" aria-label={`Pressure ${pressure}, resources ${resources}`} style={{ width: "100%", maxWidth: 440, display: "block", margin: "0 auto" }}>
      <path d={`M ${cx - 15} 170 L ${cx} ${cy + 4} L ${cx + 15} 170 Z`} fill="#dfe4ea" />
      <rect x={cx - 56} y={168} width={112} height={6} rx={3} fill="#dfe4ea" />
      <line x1={end(-1)[0]} y1={end(-1)[1]} x2={end(1)[0]} y2={end(1)[1]} stroke="#475467" strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={7} fill="#475467" />
      {pan(-1, pressure, "Pressure", PRESSURE)}
      {pan(1, resources, "Resources", RESOURCE)}
    </svg>
  );
}

/** A 0-100 bar with the Copenhagen Burnout Inventory's 50 and 75 cut-offs marked. */
export function BurnoutMeter({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? "#be123c" : value >= 50 ? "#c2410c" : RESOURCE;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
        <b>{label}</b><b style={{ color }}>{value}</b>
      </div>
      <div style={{ position: "relative", height: 12, borderRadius: 99, background: "linear-gradient(90deg,#e6f6f4 0 50%,#fff6e0 50% 75%,#ffe4e6 75%)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${value}%`, background: color, borderRadius: 99, opacity: 0.9 }} />
        {[50, 75].map((t) => <span key={t} style={{ position: "absolute", left: `${t}%`, top: -3, bottom: -3, width: 2, background: "#fff" }} />)}
      </div>
      <div style={{ position: "relative", height: 16, fontSize: 10.5, color: "#98a2b3", marginTop: 3 }}>
        <span style={{ position: "absolute", left: 0 }}>Low</span>
        <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>Moderate</span>
        <span style={{ position: "absolute", left: "75%", transform: "translateX(-50%)" }}>High</span>
      </div>
    </div>
  );
}

/** The Stress Index across retests, on the zone bands. */
export function TrendChart({ points }: { points: { at: string; index: number }[] }) {
  const W = 420, H = 230, padL = 30, padR = 18, padT = 22, padB = 30;
  const n = points.length;
  const inset = 18; // keeps the first and last points clear of the axis labels
  const x = (i: number) => padL + inset + (n === 1 ? (W - padL - padR - 2 * inset) / 2 : (i * (W - padL - padR - 2 * inset)) / (n - 1));
  const y = (v: number) => padT + ((100 - v) / 100) * (H - padT - padB);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Stress Index over time: ${points.map((p) => `${fmt(p.at)} ${p.index}`).join(", ")}`} style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
      {ZONES_ASC.map((z, i) => {
        const from = zoneStart(z), to = i < ZONES_ASC.length - 1 ? zoneStart(ZONES_ASC[i + 1]) : 100;
        return <rect key={z} x={padL} y={y(to)} width={W - padL - padR} height={y(from) - y(to)} fill={ZONE_META[z].color} fillOpacity={0.07} />;
      })}
      {[0, 25, 50, 75, 100].map((t) => <text key={t} x={padL - 8} y={y(t) + 4} textAnchor="end" style={{ font: "500 11.5px Inter, sans-serif", fill: "#98a2b3" }}>{t}</text>)}
      {n > 1 && <polyline points={points.map((p, i) => `${x(i)},${y(p.index)}`).join(" ")} fill="none" stroke="#0f766e" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />}
      {points.map((p, i) => (
        <g key={p.at}>
          <circle cx={x(i)} cy={y(p.index)} r={6} fill="#fff" stroke="#0f766e" strokeWidth={3} />
          <text x={x(i)} y={y(p.index) - 12} textAnchor="middle" style={{ font: "700 14px Inter, sans-serif", fill: "#0f1728" }}>{p.index}</text>
          <text x={x(i)} y={H - 8} textAnchor="middle" style={{ font: "500 12.5px Inter, sans-serif", fill: "#6b7686" }}>{fmt(p.at)}</text>
        </g>
      ))}
    </svg>
  );
}
