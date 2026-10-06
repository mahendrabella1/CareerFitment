"use client";

/** Look and small building blocks of the institution portal. */
import type { ReactNode } from "react";
import { Icon } from "@/app/Icons";
import { dayLabel } from "@/lib/progress/activity";
import { STATUS_META, type StudentStatus } from "@/lib/institution/analytics";

export const PORTAL_CSS = `
.ip{--ink:#141417;--ink2:#3d3d45;--ink3:#63636f;--muted:#9a9aa6;--faint:#c4c4cd;--line:#ececef;--line2:#f4f4f6;--bg:#f6f7fb;
  --brand:#E23B41;--brandTint:#FDECED;--accent:#4c5fd5;--accentTint:#eef0fc;--good:#2f9e6f;--goodTint:#eaf6f0;--warn:#b7791f;--warnTint:#fdf3e2;--bad:#d9363e;--badTint:#fdecec;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,"Segoe UI",sans-serif;font-size:14px}
.ip *{box-sizing:border-box}
.ip-muted{color:var(--ink3);font-size:13px;line-height:1.5}
.ip-card{background:#fff;border:1px solid var(--line);border-radius:16px}
.ip-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--brand);color:#fff;border:none;border-radius:10px;padding:10px 16px;font:inherit;font-weight:700;cursor:pointer;white-space:nowrap}
.ip-btn:disabled{opacity:.55;cursor:default}
.ip-btn.ghost{background:#fff;color:var(--ink2);border:1px solid var(--line)}
.ip-btn.ghost:hover{background:var(--line2)}
.ip-btn.sm{padding:7px 12px;font-size:12.5px;border-radius:9px}
.ip-label{display:block;font-size:12px;font-weight:700;color:var(--ink3);margin-bottom:6px}
.ip-input{width:100%;border:1px solid var(--line);border-radius:10px;padding:10px 12px;font:inherit;color:var(--ink);background:#fff}
.ip-input:focus{outline:2px solid var(--accentTint);border-color:var(--accent)}
.ip-alert{border-radius:10px;padding:10px 13px;font-size:13px;font-weight:600;margin:10px 0;line-height:1.45}
.ip-alert.bad{background:var(--badTint);color:var(--bad)}
.ip-alert.good{background:var(--goodTint);color:var(--good)}
.ip-alert.warn{background:var(--warnTint);color:var(--warn)}

.ip-login{min-height:100vh;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,420px);gap:48px;align-items:center;max-width:1040px;margin:0 auto;padding:32px 20px}
.ip-login-side h1{font-size:34px;line-height:1.15;margin:22px 0 10px;letter-spacing:-.02em;text-wrap:balance}
.ip-login-side p{font-size:15.5px;color:var(--ink3);line-height:1.6;max-width:480px;margin:0}
.ip-login-side ul{list-style:none;padding:0;margin:22px 0 0;display:grid;gap:10px}
.ip-login-side li{display:flex;align-items:center;gap:10px;font-weight:600;color:var(--ink2)}
.ip-login-side li svg{color:var(--brand)}
.ip-login-form{padding:26px}
.ip-login-form h2{margin:0 0 4px;font-size:21px}

.ip-top{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.94);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid var(--line)}
.ip-top-in{max-width:1360px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:12px 22px}
.ip-inst{display:flex;flex-direction:column;min-width:0}
.ip-inst b{font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ip-inst span{font-size:11.5px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.ip-shell{max-width:1360px;margin:0 auto;display:grid;grid-template-columns:220px minmax(0,1fr);gap:0;align-items:start}
.ip-nav{position:sticky;top:64px;display:flex;flex-direction:column;gap:3px;padding:20px 12px}
.ip-nav a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:var(--ink2);font-weight:600;text-decoration:none}
.ip-nav a:hover{background:#fff}
.ip-nav a.on{background:#fff;color:var(--brand);font-weight:800;box-shadow:0 1px 2px rgba(15,23,42,.06)}
.ip-nav a.on svg{color:var(--brand)}
.ip-nav svg{color:var(--muted)}
.ip-nav-group{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:14px 12px 4px}
.ip-nav .ip-badge{margin-left:auto}
.ip-main{min-width:0;padding:22px 22px 60px}
.ip-h1{font-size:24px;font-weight:800;margin:0;letter-spacing:-.015em}
.ip-sub{color:var(--ink3);margin:4px 0 0;font-size:13.5px}
.ip-head{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.ip-head > div:first-child{flex:1;min-width:240px}
.ip-badge{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--brand);color:#fff;font-size:11px;font-weight:800}

.ip-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.ip-kpi{padding:16px;display:flex;flex-direction:column;gap:4px;min-width:0}
.ip-kpi-k{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;color:var(--ink3)}
.ip-kpi-k svg{color:var(--accent)}
.ip-kpi-v{font-size:28px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
.ip-kpi-s{font-size:12px;color:var(--muted);line-height:1.4}
.ip-grid2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px;margin-top:12px}
.ip-grid2e{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin-top:12px}
.ip-sec{padding:16px 18px;min-width:0}
.ip-sec-h{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.ip-sec-h h2{font-size:15px;margin:0;font-weight:800}
.ip-sec-h .ip-muted{margin-left:auto;font-size:12px}

.ip-pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.ip-pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.ip-pill.good{background:var(--goodTint);color:var(--good)}
.ip-pill.warn{background:var(--warnTint);color:var(--warn)}
.ip-pill.bad{background:var(--badTint);color:var(--bad)}
.ip-pill.muted{background:var(--line2);color:var(--ink3)}
.ip-pill.plain::before{display:none}

.ip-bars{display:flex;flex-direction:column;gap:9px}
.ip-bar-row{display:grid;grid-template-columns:minmax(90px,38%) minmax(0,1fr) auto;gap:10px;align-items:center;font-size:13px}
.ip-bar-row > span:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink2);font-weight:600}
.ip-bar{height:9px;border-radius:999px;background:var(--line2);overflow:hidden}
.ip-bar > div{height:100%;border-radius:999px;background:var(--accent)}
.ip-bar-n{font-variant-numeric:tabular-nums;color:var(--ink3);font-size:12.5px;white-space:nowrap}

.ip-table-wrap{overflow-x:auto}
.ip-table{width:100%;border-collapse:collapse;font-size:13px}
.ip-table th{text-align:left;padding:10px 12px;font-size:11px;font-weight:800;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;background:var(--line2);white-space:nowrap;position:sticky;top:0}
.ip-table th button{all:unset;cursor:pointer}
.ip-table td{padding:11px 12px;border-top:1px solid var(--line);vertical-align:middle}
.ip-table tbody tr:hover{background:#fafbff}
.ip-table .num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.ip-name a{color:var(--ink);font-weight:700;text-decoration:none}
.ip-name a:hover{color:var(--brand)}
.ip-name small{display:block;color:var(--muted);font-size:11.5px;margin-top:1px}

.ip-insight{display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border-radius:12px;background:var(--line2);font-size:13px;line-height:1.5;color:var(--ink2)}
.ip-insight + .ip-insight{margin-top:8px}
.ip-insight svg{flex:none;margin-top:1px}
.ip-insight.warn svg{color:var(--warn)}
.ip-insight.good svg{color:var(--good)}
.ip-insight.info svg{color:var(--accent)}
.ip-insight .ip-btn{margin-left:auto}

.ip-chart{width:100%;height:auto;display:block}
.ip-chart text{font-family:inherit;font-size:10px;fill:var(--muted)}
.ip-tabs{display:flex;gap:6px;flex-wrap:wrap}
.ip-tab{border:1px solid var(--line);background:#fff;color:var(--ink2);border-radius:999px;padding:6px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
.ip-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.ip-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:12px;border-bottom:1px solid var(--line)}
.ip-toolbar .ip-input{max-width:280px;padding:8px 11px}
.ip-select{border:1px solid var(--line);border-radius:10px;padding:8px 10px;font:inherit;background:#fff;color:var(--ink2)}
.ip-empty{padding:34px 16px;text-align:center;color:var(--muted)}
.ip-rec{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--line)}
.ip-rec:first-child{border-top:none;padding-top:0}
.ip-rec-dot{width:9px;height:9px;border-radius:50%;margin-top:6px;flex:none}

@media (max-width:1100px){.ip-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.ip-grid2,.ip-grid2e{grid-template-columns:minmax(0,1fr)}}
@media (max-width:860px){
  .ip-login{grid-template-columns:minmax(0,1fr);gap:24px}
  .ip-login-side h1{font-size:27px}
  .ip-shell{grid-template-columns:minmax(0,1fr)}
  .ip-nav{position:static;flex-direction:row;overflow-x:auto;padding:10px 16px 0;gap:6px}
  .ip-nav a{white-space:nowrap;padding:8px 12px}
  .ip-nav-group{display:none}
  .ip-main{padding:16px 16px 48px}
  .ip-top-in{padding:10px 16px}
}
@media (max-width:860px){.ip-updated,.ip-div{display:none}.ip-inst{flex:1}.ip-inst b{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:13.5px;line-height:1.3}}
@media (max-width:520px){.ip-kpi-v{font-size:23px}.ip-kpis{gap:8px}.ip-logo{display:none}}
`;

export function Kpi({ icon, label, value, sub }: { icon: string; label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="ip-card ip-kpi">
      <div className="ip-kpi-k"><Icon name={icon} size={15} stroke={2} /> {label}</div>
      <div className="ip-kpi-v">{value}</div>
      {sub && <div className="ip-kpi-s">{sub}</div>}
    </div>
  );
}

export function Section({ title, icon, aside, children, style }: { title: string; icon?: string; aside?: ReactNode; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <section className="ip-card ip-sec" style={style}>
      <div className="ip-sec-h">
        {icon && <Icon name={icon} size={16} stroke={2} style={{ color: "var(--accent)" }} />}
        <h2>{title}</h2>
        {aside && <span className="ip-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: StudentStatus }) {
  const m = STATUS_META[status];
  return <span className={`ip-pill ${m.tone}`}>{m.label}</span>;
}

export function Bars({ rows, format, empty }: { rows: { label: string; value: number; note?: string }[]; format?: (n: number) => string; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <div className="ip-muted">{empty ?? "Nothing yet."}</div>;
  return (
    <div className="ip-bars">
      {rows.map((r) => (
        <div className="ip-bar-row" key={r.label}>
          <span title={r.label}>{r.label}</span>
          <div className="ip-bar"><div style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} /></div>
          <span className="ip-bar-n">{format ? format(r.value) : r.value}{r.note ? ` · ${r.note}` : ""}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Daily columns for the last N days, drawn to scale: the y axis runs from 0
 * to a rounded maximum with three gridlines, every label names a value the
 * axis reaches, and every 5th day is labelled along the bottom.
 */
export function DailyChart({ data, unit }: { data: { day: string; value: number }[]; unit: string }) {
  const W = 640, H = 190, L = 34, R = 8, T = 10, B = 24;
  const rawMax = Math.max(0, ...data.map((d) => d.value));
  const step = niceStep(rawMax / 3);
  const max = Math.max(step * 3, 1);
  const iw = W - L - R, ih = H - T - B;
  const bw = iw / data.length;
  const y = (v: number) => T + ih - (v / max) * ih;
  return (
    <svg className="ip-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Daily ${unit}, last ${data.length} days`}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={L} x2={W - R} y1={y(step * i)} y2={y(step * i)} stroke="var(--line)" strokeWidth={1} />
          <text x={L - 6} y={y(step * i) + 3} textAnchor="end">{step * i}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * ih;
        return (
          <g key={d.day}>
            <rect x={L + i * bw + bw * 0.18} y={T + ih - h} width={bw * 0.64} height={Math.max(h, d.value > 0 ? 1.5 : 0)} rx={2} fill="var(--accent)" opacity={i === data.length - 1 ? 1 : 0.78}>
              <title>{`${dayLabel(d.day)}: ${d.value} ${unit}`}</title>
            </rect>
            {(data.length - 1 - i) % 5 === 0 && <text x={L + i * bw + bw / 2} y={H - 7} textAnchor="middle">{dayLabel(d.day)}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function niceStep(x: number): number {
  if (x <= 1) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  const f = x / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}
