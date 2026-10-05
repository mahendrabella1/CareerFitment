import { PILLARS, type PillarKey } from "@/lib/money/profile";

const R = 52;
const STROKE = 14;
const GAP = 3; // degrees between segments

function arc(startDeg: number, endDeg: number) {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const x1 = 70 + R * Math.cos(rad(startDeg));
  const y1 = 70 + R * Math.sin(rad(startDeg));
  const x2 = 70 + R * Math.cos(rad(endDeg));
  const y2 = 70 + R * Math.sin(rad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
}

/** Ring with one segment per pillar: segment size = pillar weight, filled part = pillar score. */
export function HealthRing({ total, pillars, size = 150 }: { total: number; pillars: Record<PillarKey, number>; size?: number }) {
  let cursor = 0;
  const segments = PILLARS.map((p) => {
    const span = (p.weight / 100) * 360;
    const start = cursor + GAP / 2;
    const end = cursor + span - GAP / 2;
    cursor += span;
    const filled = start + ((end - start) * Math.max(0, Math.min(100, pillars[p.key]))) / 100;
    return { ...p, start, end, filled };
  });
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label={`Money Health Score ${total} out of 100`}>
        {segments.map((s) => (
          <g key={s.key}>
            <path d={arc(s.start, s.end)} stroke="#e2e8f0" strokeWidth={STROKE} fill="none" />
            {s.filled > s.start + 0.5 && <path d={arc(s.start, s.filled)} stroke={s.color} strokeWidth={STROKE} fill="none" />}
          </g>
        ))}
        <text x={70} y={70} textAnchor="middle" fontSize={30} fontWeight={900} fill="#0f172a">{total}</text>
        <text x={70} y={88} textAnchor="middle" fontSize={10} fill="#64748b">of 100</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, minWidth: 0 }}>
        {PILLARS.map((p) => (
          <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: p.color, flexShrink: 0 }} />
            <span style={{ color: "#334155", fontWeight: 700, width: 104 }}>{p.label}</span>
            <span style={{ color: "#64748b", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{pillars[p.key]}</span>
            <span style={{ color: "#94a3b8", fontSize: 11 }}>({p.weight}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
