"use client";

const ACCENT = "#0ea05f";

export function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}>
        <span>{label}</span><b style={{ color: "#1a1a1a" }}>{format(value)}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: ACCENT }} />
    </label>
  );
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const LAB_ACCENT = ACCENT;
