/** Styles for the Stress & Resilience Check (test + results). Prefix: st-. */
export const PRESSURE = "#ea580c";
export const RESOURCE = "#0d9488";
export const PRIMARY = "#0f766e";

export const STRESS_CSS = `
.st{--ink:#0f1728;--ink2:#465467;--muted:#6b7686;--line:#e5e8ee;--bg:#f5f7f8;--card:#fff;--pri:${PRIMARY};--pri-t:#e6f4f2;--pri-l:#b9e2dc;
  --press:${PRESSURE};--press-t:#fff1e8;--res:${RESOURCE};--res-t:#e6f6f4;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,"Segoe UI",sans-serif}
.st *{box-sizing:border-box}
.st h1,.st h2,.st h3{font-family:Poppins,Inter,sans-serif;letter-spacing:-.01em;margin:0}
.st-wrap{max-width:1060px;margin:0 auto;padding:0 20px}
.st-narrow{max-width:640px;margin:0 auto;padding:0 18px}
.st-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

/* top bar */
.st-bar{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.st-bar-in{display:flex;align-items:center;gap:14px;min-height:60px}
.st-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink)}
.st-brand img{height:30px;display:block}
.st-brand span{font-weight:700;font-size:14px;color:var(--ink2);padding-left:10px;border-left:1px solid var(--line)}
.st-bar-r{margin-left:auto;display:flex;gap:8px}
.st-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font:inherit;font-size:14px;font-weight:650;padding:10px 16px;border-radius:11px;border:1px solid #d5dae2;background:#fff;color:var(--ink);cursor:pointer;text-decoration:none;line-height:1.2}
.st-btn:hover{background:#f9fafb}
.st-btn:disabled{opacity:.5;cursor:not-allowed}
.st-btn-pri{background:var(--pri);border-color:var(--pri);color:#fff}.st-btn-pri:hover{background:#0b5f59}
.st-btn-lg{padding:14px 22px;font-size:15.5px;border-radius:13px}
.st-link{color:var(--pri);font-weight:650;text-decoration:none}.st-link:hover{text-decoration:underline}

/* cards */
.st-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px}
.st-eyebrow{font-size:11.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:var(--pri)}
.st-h2{font-size:clamp(19px,2.6vw,23px);font-weight:700;margin-top:4px}
.st-sub{font-size:14px;color:var(--ink2);line-height:1.6;margin:6px 0 0}
.st-chip{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:650;padding:5px 11px;border-radius:999px;background:var(--pri-t);color:var(--pri)}

/* ---------- test ---------- */
.st-progress{display:flex;gap:4px;margin:18px 0 6px}
.st-progress i{flex:1;height:6px;border-radius:99px;background:#e3e7ec;overflow:hidden;position:relative}
.st-progress i b{position:absolute;inset:0;background:var(--pri);border-radius:99px;transform-origin:left;transition:transform .3s}
.st-progress-meta{display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted)}
.st-q{margin-top:22px}
.st-q-recall{font-size:12.5px;font-weight:650;color:var(--muted);margin-bottom:10px}
.st-q-text{font-family:Poppins,Inter,sans-serif;font-size:clamp(19px,3.4vw,24px);font-weight:600;line-height:1.35;color:var(--ink);min-height:3.2em}
.st-opts{display:flex;flex-direction:column;gap:10px;margin-top:22px}
.st-opt{display:flex;align-items:center;gap:14px;text-align:left;width:100%;font:inherit;font-size:15.5px;font-weight:550;color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:14px;padding:15px 16px;cursor:pointer;transition:border-color .15s,background .15s,transform .1s}
.st-opt:hover{border-color:var(--pri-l)}
.st-opt:active{transform:scale(.995)}
.st-opt[aria-checked="true"]{border-color:var(--pri);background:var(--pri-t)}
.st-opt-dot{width:22px;height:22px;border-radius:50%;border:2px solid #c6ccd5;flex:none;display:grid;place-items:center}
.st-opt[aria-checked="true"] .st-opt-dot{border-color:var(--pri)}
.st-opt[aria-checked="true"] .st-opt-dot::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--pri)}
.st-opt-key{margin-left:auto;font-size:11.5px;color:#9aa3af;font-weight:700}
.st-nav{display:flex;justify-content:space-between;align-items:center;margin:24px 0 40px}
.st-intro{margin-top:28px;text-align:left}
.st-intro-ic{width:54px;height:54px;border-radius:16px;background:var(--pri-t);color:var(--pri);display:grid;place-items:center;margin-bottom:16px}
.st-intro h2{font-size:clamp(24px,4vw,30px);font-weight:700}
.st-intro p{font-size:15.5px;color:var(--ink2);line-height:1.65;margin:10px 0 0}
.st-std{margin-top:16px;font-size:12.5px;color:var(--muted);background:#fff;border:1px dashed var(--line);border-radius:12px;padding:10px 12px}
.st-fade{animation:stIn .28s ease both}
@keyframes stIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.st-fade{animation:none}}

/* ---------- results ---------- */
.st-hero{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:28px;align-items:center}
.st-hero h1{font-size:clamp(21px,2.8vw,29px);font-weight:700;line-height:1.25}
.st-zone{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase;padding:6px 12px;border-radius:999px}
.st-tabs{display:flex;gap:4px;background:#e9edf0;border-radius:14px;padding:4px;margin:22px 0 18px;overflow-x:auto;scrollbar-width:none}
.st-tabs::-webkit-scrollbar{display:none}
.st-tab{flex:1;font:inherit;font-size:14px;font-weight:650;color:var(--ink2);background:none;border:0;border-radius:10px;padding:10px 14px;cursor:pointer;white-space:nowrap}
.st-tab[aria-selected="true"]{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(16,24,40,.1)}
.st-tab-short{display:none}
.st-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.st-grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.st-stack{display:flex;flex-direction:column;gap:16px}
.st-pillar{background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;min-width:0}
.st-pillar-h{display:flex;align-items:center;gap:10px}
.st-pillar-ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
.st-pillar-name{font-weight:700;font-size:14px;line-height:1.25}
.st-pillar-kind{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.st-pillar-score{font-family:Poppins,Inter,sans-serif;font-size:26px;font-weight:700;line-height:1}
.st-pillar p{margin:0;font-size:13px;color:var(--ink2);line-height:1.5}
.st-bar-track{height:8px;border-radius:99px;background:#edf0f3;overflow:hidden}
.st-bar-fill{height:100%;border-radius:99px}
.st-tone{font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:99px}
.st-tone.good{background:#e7f6ee;color:#15803d}.st-tone.okay{background:#fff6e0;color:#a16207}.st-tone.watch{background:#fff0e8;color:#c2410c}
.st-driver{display:grid;grid-template-columns:34px minmax(0,1fr) 120px 44px;align-items:center;gap:12px;padding:10px 0;border-top:1px solid var(--line)}
.st-driver:first-child{border-top:0}
.st-driver-ic{width:34px;height:34px;border-radius:10px;background:var(--press-t);color:var(--press);display:grid;place-items:center}
.st-driver b{font-size:14px;font-weight:650}
.st-driver small{display:block;font-size:12px;color:var(--muted)}
.st-quad{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.st-quad-cell{border-radius:14px;padding:14px;border:1px solid var(--line);background:#fff}
.st-quad-cell b{display:block;font-size:13.5px}
.st-quad-cell span{font-size:12px;color:var(--muted)}
.st-dots{display:flex;gap:4px;margin-top:10px}
.st-dots i{width:100%;height:8px;border-radius:4px;background:#edf0f3}
.st-legend{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--muted);margin-top:10px}
.st-legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.st-cope{display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr) 34px;gap:12px;align-items:center;font-size:13.5px;padding:5px 0}
.st-action{border:1px solid var(--line);border-radius:18px;background:#fff;overflow:hidden}
.st-action-h{display:flex;gap:14px;padding:18px 18px 12px;align-items:flex-start}
.st-action-n{width:34px;height:34px;border-radius:11px;background:var(--pri);color:#fff;display:grid;place-items:center;font-weight:800;flex:none}
.st-action h3{font-size:16.5px;font-weight:700}
.st-action p{margin:4px 0 0;font-size:13.5px;color:var(--ink2);line-height:1.55}
.st-step{display:flex;gap:12px;align-items:flex-start;padding:12px 18px;border-top:1px solid var(--line);cursor:pointer;font-size:14px;line-height:1.5}
.st-step input{width:20px;height:20px;accent-color:var(--pri);flex:none;margin-top:1px}
.st-step.is-done span{color:var(--muted);text-decoration:line-through}
.st-mood{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.st-mood button{font:inherit;font-size:13.5px;font-weight:600;border:1.5px solid var(--line);background:#fff;border-radius:12px;padding:10px 12px;cursor:pointer;flex:1;min-width:92px}
.st-mood button[aria-pressed="true"]{border-color:var(--pri);background:var(--pri-t);color:var(--pri)}
.st-care{display:flex;gap:14px;align-items:flex-start;border-radius:16px;padding:16px 18px;background:#f0f6ff;border:1px solid #cfe0fb;color:#1e3a6b;font-size:14px;line-height:1.55}
.st-care.is-strong{background:#fff1f2;border-color:#fecdd3;color:#7f1d1d}
.st-care b{font-size:15px}
.st-note{font-size:12.5px;color:var(--muted);line-height:1.55}
.st-accordion summary{cursor:pointer;font-weight:700;font-size:14.5px;list-style:none;display:flex;align-items:center;justify-content:space-between}
.st-accordion summary::-webkit-details-marker{display:none}
.st-caret{display:inline-flex;transform:rotate(90deg);transition:transform .2s}
.st-accordion[open] summary .st-caret{transform:rotate(-90deg)}
.st-accordion p,.st-accordion li{font-size:13.5px;color:var(--ink2);line-height:1.6}
.st-compare{display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr) 116px;gap:12px;align-items:center;padding:8px 0;font-size:13.5px}
.st-compare-track{position:relative;height:10px;border-radius:99px;background:linear-gradient(90deg,#e6f6f4,#f2f4f7 50%,#fff1e8)}
.st-compare-dot{position:absolute;top:50%;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25);transform:translate(-50%,-50%)}

@media print{
  .st{background:#fff}
  .st-bar,.st-tabs,.st-btn,.st-mood{display:none!important}
  .st-panel[hidden]{display:block!important}
  .st-panel{margin-bottom:16px}
  .st-card,.st-pillar,.st-action{break-inside:avoid;box-shadow:none}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
@media(max-width:860px){
  .st-hero{grid-template-columns:minmax(0,1fr);gap:8px;text-align:center}
  .st-hero .st-hero-actions{justify-content:center}
  .st-grid4{grid-template-columns:repeat(2,minmax(0,1fr))}
  .st-grid2{grid-template-columns:minmax(0,1fr)}
}
@media(max-width:520px){
  .st-wrap{padding:0 16px}
  .st-card{padding:18px;border-radius:16px}
  .st-driver{grid-template-columns:34px minmax(0,1fr) 44px}
  .st-driver .st-bar-track{grid-column:2/3}
  .st-cope{grid-template-columns:minmax(0,120px) minmax(0,1fr) 30px;font-size:13px}
  .st-tab-long{display:none}.st-tab-short{display:inline}
  .st-tab{padding:9px 8px;font-size:13.5px}
  .st-opt-key{display:none}
  .st-bands,.st-domains{grid-template-columns:minmax(0,1fr)!important}
  .st-bands .st-opt{flex-direction:row!important;align-items:center!important;justify-content:space-between}
  .st-compare{grid-template-columns:minmax(0,1fr) 56px}
  .st-compare-track{grid-column:1/-1;order:3}
  .st-brand span{display:none}
}
`;
