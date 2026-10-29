"use client";

/**
 * Look and small building blocks of the institution portal. One quiet
 * system for every page: neutral greys, a dark primary button, one blue for
 * charts and links, and colour only where it carries a meaning (a status
 * dot, a number that needs action).
 */
import type { ReactNode } from "react";
import { dayLabel } from "@/lib/progress/activity";
import { STATUS_META, type StudentStatus } from "@/lib/institution/analytics";

export const PORTAL_CSS = `
.ip{--ink:#18181b;--ink2:#3f3f46;--ink3:#6b6b76;--muted:#9b9ba5;--faint:#d4d4d8;--line:#e6e6ea;--line2:#f4f4f6;--bg:#f7f7f9;
  --brand:#18181b;--brandTint:#f4f4f6;--accent:#3451b2;--accentTint:#eef1fb;--good:#1f7a4d;--goodTint:#eef7f2;--warn:#a15c07;--warnTint:#fdf6ea;--bad:#b42318;--badTint:#fdf0ef;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,"Segoe UI",sans-serif;font-size:14px;-webkit-font-smoothing:antialiased}
.ip *{box-sizing:border-box}
.ip a{color:inherit}
.ip-muted{color:var(--ink3);font-size:13px;line-height:1.5}
.ip-card{background:#fff;border:1px solid var(--line);border-radius:8px}
.ip-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--ink);color:#fff;border:1px solid var(--ink);border-radius:7px;padding:0 14px;height:38px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap;text-decoration:none}
.ip-btn:hover{background:#2e2e33}
.ip-btn:disabled{opacity:.5;cursor:default}
.ip-btn.ghost{background:#fff;color:var(--ink2);border-color:var(--line)}
.ip-btn.ghost:hover{background:var(--line2);border-color:var(--faint)}
.ip-btn.sm{height:30px;padding:0 11px;font-size:12.5px;border-radius:6px}
.ip-link{color:var(--accent);font-weight:600;text-decoration:none;font-size:13px;white-space:nowrap}
.ip-link:hover{text-decoration:underline}
.ip-label{display:block;font-size:12.5px;font-weight:600;color:var(--ink2);margin-bottom:6px}
.ip-input{width:100%;border:1px solid var(--line);border-radius:7px;padding:9px 11px;font:inherit;color:var(--ink);background:#fff}
.ip-input:focus,.ip-select:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accentTint)}
.ip-alert{border-radius:7px;padding:10px 13px;font-size:13px;font-weight:500;margin:10px 0;line-height:1.45;border:1px solid}
.ip-alert.bad{background:var(--badTint);color:var(--bad);border-color:#f5cfcb}
.ip-alert.good{background:var(--goodTint);color:var(--good);border-color:#cfe8da}
.ip-alert.warn{background:var(--warnTint);color:var(--warn);border-color:#f1dfbf}

.ip-login{min-height:100vh;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,420px);gap:48px;align-items:center;max-width:1040px;margin:0 auto;padding:32px 20px}
.ip-login-side h1{font-size:32px;line-height:1.15;margin:22px 0 10px;letter-spacing:-.02em;font-weight:700;text-wrap:balance}
.ip-login-side p{font-size:15.5px;color:var(--ink3);line-height:1.6;max-width:480px;margin:0}
.ip-login-side ul{list-style:none;padding:0;margin:22px 0 0;display:grid;gap:10px}
.ip-login-side li{display:flex;align-items:center;gap:10px;font-weight:500;color:var(--ink2)}
.ip-login-side li svg{color:var(--ink3)}
.ip-login-form{padding:26px}
.ip-login-form h2{margin:0 0 4px;font-size:20px;font-weight:600}

.ip-top{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.96);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid var(--line)}
.ip-top-in{max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:10px 22px}
.ip-inst{display:flex;flex-direction:column;min-width:0}
.ip-inst b{font-size:14.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ip-inst span{font-size:11.5px;color:var(--muted);font-weight:500}
.ip-shell{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:232px minmax(0,1fr);gap:0;align-items:start}
.ip-nav{position:sticky;top:59px;display:flex;flex-direction:column;gap:1px;padding:18px 12px 30px;max-height:calc(100vh - 59px);overflow-y:auto}
.ip-nav a{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:6px;color:var(--ink2);font-weight:500;font-size:13.5px;text-decoration:none;position:relative}
.ip-nav a:hover{background:#fff}
.ip-nav a.on{background:#fff;color:var(--ink);font-weight:600;box-shadow:inset 0 0 0 1px var(--line)}
.ip-nav a.on::before{content:"";position:absolute;left:-12px;top:7px;bottom:7px;width:3px;border-radius:0 3px 3px 0;background:var(--ink)}
.ip-nav svg{color:var(--muted);flex:none}
.ip-nav a.on svg{color:var(--ink)}
.ip-nav-group{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:16px 10px 5px}
.ip-nav .ip-badge{margin-left:auto}
.ip-main{min-width:0;padding:24px 26px 64px}
.ip-h1{font-size:22px;font-weight:650;margin:0;letter-spacing:-.015em}
.ip-sub{color:var(--ink3);margin:4px 0 0;font-size:13.5px;line-height:1.5;max-width:760px}
.ip-head{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--line)}
.ip-head > div:first-child{flex:1;min-width:240px}
.ip-badge{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--ink);color:#fff;font-size:11px;font-weight:600}

.ip-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;background:#fff;border:1px solid var(--line);border-radius:8px}
.ip-kpis > .ip-kpi{border:0;border-radius:0;border-left:1px solid var(--line)}
.ip-kpis > .ip-kpi:first-child{border-left:0}
.ip-kpi{padding:16px 18px;display:flex;flex-direction:column;gap:3px;min-width:0;background:#fff}
.ip-kpi-k{font-size:12.5px;font-weight:500;color:var(--ink3)}
.ip-kpi-k svg{display:none}
.ip-kpi-v{font-size:26px;font-weight:650;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.2}
.ip-kpi-s{font-size:12px;color:var(--ink3);line-height:1.45}
.ip-kpi.is-act .ip-kpi-v{color:var(--bad)}
.ip-grid2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:14px;margin-top:14px;align-items:start}
.ip-grid2e{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;margin-top:14px}
.ip-sec{padding:16px 18px;min-width:0}
.ip-sec-h{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.ip-sec-h > svg{display:none}
.ip-sec-h h2{font-size:14.5px;margin:0;font-weight:600}
.ip-sec-h .ip-muted{margin-left:auto;font-size:12.5px}
.ip-sec-p{margin:-6px 0 12px;font-size:12.5px;color:var(--ink3);line-height:1.5}

.ip-pill{display:inline-flex;align-items:center;gap:6px;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap;background:var(--line2);color:var(--ink2)}
.ip-pill::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--muted)}
.ip-pill.good::before{background:var(--good)}
.ip-pill.warn::before{background:#d08a1c}
.ip-pill.bad::before{background:var(--bad)}
.ip-pill.plain::before{display:none}

.ip-bars{display:flex;flex-direction:column;gap:9px}
.ip-bar-row{display:grid;grid-template-columns:minmax(90px,38%) minmax(0,1fr) auto;gap:10px;align-items:center;font-size:13px;color:inherit}
.ip-bar-row > span:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink2);font-weight:500}
.ip-bar{height:8px;border-radius:999px;background:var(--line2);overflow:hidden}
.ip-bar > div{height:100%;border-radius:999px;background:var(--accent)}
.ip-bar-n{font-variant-numeric:tabular-nums;color:var(--ink3);font-size:12.5px;white-space:nowrap}

.ip-table-wrap{overflow-x:auto}
.ip-table{width:100%;border-collapse:collapse;font-size:13px}
.ip-table th{text-align:left;padding:9px 12px;font-size:12px;font-weight:600;color:var(--ink3);background:#fafafb;border-bottom:1px solid var(--line);white-space:nowrap;position:sticky;top:0}
.ip-table th button{all:unset;cursor:pointer}
.ip-table td{padding:10px 12px;border-top:1px solid var(--line2);vertical-align:middle}
.ip-table tbody tr:first-child td{border-top:0}
.ip-table tbody tr:hover{background:#fafafb}
.ip-table .num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.ip-name a{color:var(--ink);font-weight:600;text-decoration:none}
.ip-name a:hover{color:var(--accent)}
.ip-name small{display:block;color:var(--muted);font-size:11.5px;margin-top:1px}

.ip-insight{display:flex;gap:10px;align-items:center;padding:10px 0;font-size:13.5px;line-height:1.5;color:var(--ink2);border-top:1px solid var(--line2)}
.ip-insight:first-of-type{border-top:0;padding-top:0}
.ip-insight + .ip-insight{margin-top:0}
.ip-insight svg{flex:none;color:var(--muted)}
.ip-insight.warn svg{color:#d08a1c}
.ip-insight .ip-btn{margin-left:auto}

.ip-chart{width:100%;height:auto;display:block}
.ip-chart text{font-family:inherit;font-size:10px;fill:var(--muted)}
.ip-tabs{display:flex;gap:4px;flex-wrap:wrap}
.ip-tab{border:1px solid var(--line);background:#fff;color:var(--ink2);border-radius:6px;padding:5px 10px;font:inherit;font-size:12.5px;font-weight:500;cursor:pointer}
.ip-tab:hover{border-color:var(--faint)}
.ip-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.ip-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:12px;border-bottom:1px solid var(--line)}
.ip-toolbar .ip-input{max-width:280px;padding:7px 11px}
.ip-select{border:1px solid var(--line);border-radius:7px;padding:7px 10px;font:inherit;background:#fff;color:var(--ink2)}
.ip-empty{padding:34px 16px;text-align:center;color:var(--ink3)}
.ip-rec{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--line2)}
.ip-rec:first-child{border-top:none;padding-top:0}
.ip-rec-dot{width:8px;height:8px;border-radius:50%;margin-top:6px;flex:none}

.ip-todo{display:flex;flex-direction:column}
.ip-todo-r{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 0;border-top:1px solid var(--line2)}
.ip-todo-r:first-child{border-top:0;padding-top:2px}
.ip-todo-n{font-size:20px;font-weight:650;font-variant-numeric:tabular-nums;text-align:right;color:var(--ink)}
.ip-todo-n.is-zero{color:var(--faint)}
.ip-todo-r b{display:block;font-size:13.5px;font-weight:600}
.ip-todo-r small{display:block;font-size:12.5px;color:var(--ink3);line-height:1.45}
.ip-prog{display:flex;align-items:center;gap:8px;min-width:120px}
.ip-prog .ip-bar{flex:1}
.ip-prog span{font-size:12.5px;font-variant-numeric:tabular-nums;color:var(--ink2);width:36px;text-align:right}
.ip-chips{display:flex;flex-wrap:wrap;gap:4px}
.ip-chip{display:inline-block;padding:2px 8px;border-radius:5px;background:var(--line2);color:var(--ink2);font-size:12px;white-space:nowrap}

.ip .hiw{background:#fff!important;border:1px solid var(--line)!important;border-radius:8px!important}
.ip .hiw > button{color:var(--ink2)!important;font-weight:600!important}
.ip .hiw > button > span:first-child{background:var(--line2)!important;color:var(--ink3)!important}

@media (max-width:1100px){.ip-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.ip-kpis > .ip-kpi:nth-child(3){border-left:0}.ip-kpis > .ip-kpi:nth-child(n+3){border-top:1px solid var(--line)}.ip-grid2,.ip-grid2e{grid-template-columns:minmax(0,1fr)}}
@media (max-width:860px){
  .ip-login{grid-template-columns:minmax(0,1fr);gap:24px}
  .ip-login-side h1{font-size:26px}
  .ip-shell{grid-template-columns:minmax(0,1fr)}
  .ip-nav{position:static;flex-direction:row;overflow-x:auto;padding:10px 16px 0;gap:4px;max-height:none}
  .ip-nav a{white-space:nowrap;padding:7px 11px}
  .ip-nav a.on::before{display:none}
  .ip-nav-group{display:none}
  .ip-main{padding:16px 16px 48px}
  .ip-top-in{padding:10px 16px}
}
@media (max-width:860px){.ip-updated,.ip-div{display:none}.ip-inst{flex:1}.ip-inst b{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:13.5px;line-height:1.3}}
@media (max-width:520px){.ip-kpi-v{font-size:22px}.ip-logo{display:none}.ip-kpi{padding:12px 14px}}
@media print{.ip-top,.ip-nav,.ip-noprint,.hiw{display:none!important}.ip-shell{display:block}.ip-main{padding:0}.ip{background:#fff}.ip-card{break-inside:avoid}}
`;

export function Kpi({ label, value, sub, action }: { icon?: string; label: string; value: ReactNode; sub?: ReactNode; action?: boolean }) {
  return (
    <div className={`ip-card ip-kpi${action ? " is-act" : ""}`}>
      <div className="ip-kpi-k">{label}</div>
      <div className="ip-kpi-v">{value}</div>
      {sub && <div className="ip-kpi-s">{sub}</div>}
    </div>
  );
}

export function Section({ title, aside, intro, children, style }: { title: string; icon?: string; aside?: ReactNode; intro?: ReactNode; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <section className="ip-card ip-sec" style={style}>
      <div className="ip-sec-h">
        <h2>{title}</h2>
        {aside && <span className="ip-muted">{aside}</span>}
      </div>
      {intro && <p className="ip-sec-p">{intro}</p>}
      {children}
    </section>
  );
}

/** A page's title, what the page is for, and its main actions. */
export function PageHead({ title, purpose, children }: { title: string; purpose: ReactNode; children?: ReactNode }) {
  return (
    <div className="ip-head">
      <div>
        <h1 className="ip-h1">{title}</h1>
        <p className="ip-sub">{purpose}</p>
      </div>
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: StudentStatus }) {
  const m = STATUS_META[status];
  return <span className={`ip-pill ${m.tone}`}>{m.label}</span>;
}

/** A thin progress bar with its percentage. */
export function Progress({ pct }: { pct: number }) {
  return <div className="ip-prog"><div className="ip-bar"><div style={{ width: `${Math.max(pct > 0 ? 2 : 0, Math.min(100, pct))}%` }} /></div><span>{pct}%</span></div>;
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
            <rect x={L + i * bw + bw * 0.2} y={T + ih - h} width={bw * 0.6} height={Math.max(h, d.value > 0 ? 1.5 : 0)} rx={2} fill="var(--accent)" opacity={i === data.length - 1 ? 1 : 0.7}>
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
