/**
 * Styles for the Workplace Stress Check results dashboard (the start screen
 * and the test use the exam's own look, app/examTheme.tsx). Same shell as the
 * student dashboard: white sidebar, sticky top bar, warm neutral page, 8px
 * cards. One blue ramp carries stress level (darker = more); one colour per
 * area (AREA_COLOR) carries identity in the donut and driver bars.
 */
export const LEVEL_COLORS = { low: "#86b6ef", mild: "#5598e7", moderate: "#256abf", high: "#104281" } as const;
export const ACCENT = "#256abf";

export const STRESS_CSS = `
.ws{--page:#fbfaf8;--card:#fff;--ink:#16181d;--ink2:#4a4f59;--muted:#7b808b;--line:#e8e5df;--grid:#f0ede8;--soft:#f7f5f1;--warm:#f4f0eb;--base:#c9c4ba;
--acc:${ACCENT};--track:#edf3fb;--crit:#d03b3b;
min-height:100vh;background:var(--page);color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip}
.ws *{box-sizing:border-box}
.ws h1,.ws h2,.ws h3,.ws h4,.ws p{margin:0}
.ws h1,.ws h2{font-family:Poppins,Inter,sans-serif;letter-spacing:-.015em}
.ws :where(a){color:inherit}
.ws button{font-family:inherit}
.ws-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:38px;padding:0 14px;border-radius:6px;border:1px solid #d9d5cd;background:#fff;color:var(--ink);font:inherit;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .15s,border-color .15s}
.ws-btn:hover{background:var(--soft)}
.ws-btn:focus-visible,.ws button:focus-visible,.ws a:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.ws-btn:disabled{opacity:.45;cursor:not-allowed}
.ws-btn-pri{background:var(--ink);border-color:var(--ink);color:#fff}
.ws-btn-pri:hover{background:#2b2e35}
.ws-btn-sm{height:32px;padding:0 10px;font-size:13px}
.ws-link{background:none;border:0;padding:0;font:inherit;font-weight:600;color:var(--acc);cursor:pointer;text-decoration:none}
.ws-link:hover{text-decoration:underline}
.ws-card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:22px}
.ws-h2{font-size:17px;font-weight:600;line-height:1.3}
.ws-h3{font-size:15.5px;font-weight:650;line-height:1.35}
.ws-sub{color:var(--ink2);margin-top:4px}
.ws-small{font-size:13.5px;color:var(--ink2)}
.ws-muted{font-size:12.5px;color:var(--muted)}
.ws-label{font-size:13px;font-weight:600;color:var(--ink2)}
.ws-kicker{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.ws-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
.ws-grid2.ws-eq{align-items:stretch}
.ws-eq>.ws-card{display:flex;flex-direction:column}
.ws-eq .ws-donut{margin:auto 0;padding-top:14px}
.ws-sec{scroll-margin-top:84px;margin-top:44px}
.ws-sec-h{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.ws-sec-h h2{font-size:21px;font-weight:600}
.ws-chip{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--ink2);background:#fff;border:1px solid var(--line);border-radius:6px;padding:4px 10px}
.ws-pill{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:2px 10px 2px 8px;background:#fff;white-space:nowrap}
.ws-pill i{width:10px;height:10px;border-radius:3px;display:inline-block}
.ws-atag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--ink2);white-space:nowrap}
.ws-atag i,.ws-sw{width:9px;height:9px;border-radius:2px;display:inline-block;flex:none}

/* shell: sidebar + top bar, as on the student dashboard */
.ws-side{position:fixed;top:0;left:0;bottom:0;width:240px;background:#fff;border-right:1px solid var(--line);display:flex;flex-direction:column;z-index:40;transition:transform .22s ease}
.ws-side-brand{display:block;padding:18px 20px 8px}
.ws-side-brand img{height:28px;width:auto;display:block}
.ws-me{display:flex;align-items:center;gap:10px;margin:6px 14px 4px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--soft);min-width:0}
.ws-ava{width:34px;height:34px;border-radius:6px;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-weight:600;font-size:15px;flex:none}
.ws-me>span:last-child{min-width:0}
.ws-me b{display:block;font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-me small{display:block;font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-side-nav{flex:1;overflow-y:auto;padding:2px 10px 14px;scrollbar-width:thin}
.ws-side-lbl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:16px 10px 6px}
.ws-navi{position:relative;display:flex;align-items:center;gap:10px;width:100%;height:36px;padding:0 10px;border:0;background:none;border-radius:6px;font-size:13.5px;font-weight:500;color:var(--ink2);cursor:pointer;text-align:left;text-decoration:none}
.ws-navi:hover{background:var(--soft);color:var(--ink)}
.ws-navi svg{color:var(--muted);flex:none}
.ws-navi span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-navi.on{background:var(--warm);color:var(--ink);font-weight:600}
.ws-navi.on::before{content:"";position:absolute;left:-10px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--acc)}
.ws-navi.on svg{color:var(--ink)}
.ws-side-foot{padding:12px 14px 16px;border-top:1px solid var(--line)}
.ws-scrim{position:fixed;inset:0;background:rgba(18,20,24,.4);z-index:39}
.ws-body{margin-left:240px;min-height:100vh}
.ws-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;height:64px;padding:0 28px;background:rgba(255,255,255,.95);backdrop-filter:saturate(1.4) blur(8px);border-bottom:1px solid var(--line)}
.ws-burger{display:none;width:38px;height:38px;border-radius:6px;border:1px solid var(--line);background:#fff;color:var(--ink);place-items:center;cursor:pointer;flex:none}
.ws-hello{min-width:0}
.ws-hello b{display:block;font-family:Poppins,Inter,sans-serif;font-size:16px;font-weight:600;white-space:nowrap}
.ws-hello small{display:block;font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-top-r{margin-left:auto;display:flex;gap:8px;align-items:center;flex:none}
.ws-main{padding:28px 28px 32px}
.ws-mwrap{max-width:1120px;margin:0 auto}

/* overview */
.ws-head h1{font-size:clamp(24px,2.8vw,32px);font-weight:700;line-height:1.15;margin-top:8px;text-wrap:balance}
.ws-head p{font-size:15.5px;color:var(--ink2);margin-top:8px;max-width:72ch}
.ws-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:20px}
.ws-kpi{display:flex;flex-direction:column;align-items:stretch;text-align:left;min-width:0;background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px 18px;font:inherit;color:inherit}
.ws-kpi>span{font-size:12.5px;font-weight:500;color:var(--muted)}
.ws-kpi>b{font-family:Poppins,Inter,sans-serif;font-size:34px;font-weight:600;line-height:1.1;margin-top:6px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.ws-kpi>b small{font-size:15px;font-weight:500;color:var(--muted);margin-left:4px;letter-spacing:0}
.ws-kpi>b.ws-kpi-t{font-size:18px;line-height:1.3;letter-spacing:-.01em;margin-top:8px;min-height:2.6em}
.ws-kpi>small{display:block;margin-top:10px;font-size:12.5px;color:var(--ink2)}
.ws-kpi-btn{cursor:pointer;transition:border-color .15s}
.ws-kpi-btn:hover:not(:disabled){border-color:var(--base)}
.ws-kpi-btn:disabled{cursor:default}
.ws-dots{display:grid;grid-template-columns:repeat(14,minmax(0,1fr));gap:3px;margin-top:12px}
.ws-dots i{display:block;height:8px;border-radius:2px;background:#ece9e3}
.ws-donut{display:grid;grid-template-columns:auto minmax(0,1fr);gap:24px;align-items:center;margin-top:14px}
.ws-donut svg{display:block}
.ws-legend{display:grid;gap:2px}
.ws-legend button{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 8px;margin:0 -8px;border:0;border-radius:6px;background:none;font:inherit;font-size:14px;color:var(--ink);text-align:left;cursor:pointer}
.ws-legend button:hover{background:var(--soft)}
.ws-legend i{width:12px;height:12px;border-radius:3px}
.ws-legend b{font-weight:600;font-variant-numeric:tabular-nums}

/* area bars */
.ws-areas{display:grid;gap:2px;margin-top:12px}
.ws-arow{position:relative;display:grid;grid-template-columns:minmax(118px,150px) minmax(0,1fr) 34px;align-items:center;gap:12px;padding:10px;margin:0 -10px;border:0;border-radius:6px;background:none;font:inherit;text-align:left;color:inherit;cursor:pointer;width:calc(100% + 20px)}
.ws-arow:hover{background:var(--soft)}
.ws-arow-name{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;min-width:0}
.ws-arow-name svg{flex:none;color:var(--ink2)}
.ws-arow-name small{display:block;font-size:12px;font-weight:500;color:var(--muted)}
.ws-arow-val{font-size:15px;font-weight:650;text-align:right;font-variant-numeric:tabular-nums}
.ws-track{position:relative;display:block;height:10px;background:var(--track);border-radius:0 4px 4px 0}
.ws-track>i{position:absolute;left:0;top:0;bottom:0;border-radius:0 4px 4px 0}
.ws-track>u{position:absolute;top:-4px;bottom:-4px;width:6px;background:#fff;border:2px solid var(--ink2);border-radius:2px}
.ws-track>s{position:absolute;top:0;bottom:0;width:2px;background:#fff}

/* drivers */
.ws-drv{display:grid;gap:2px;margin-top:10px}
.ws-drv button{display:grid;grid-template-columns:minmax(0,190px) minmax(0,1fr) 70px;gap:14px;align-items:center;padding:9px 8px;margin:0 -8px;border:0;border-radius:6px;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}
.ws-drv button:hover,.ws-drv button[aria-pressed="true"]{background:var(--soft)}
.ws-drv button[aria-pressed="true"]{box-shadow:inset 3px 0 0 var(--ink)}
.ws-drv-name{min-width:0}
.ws-drv-name b{display:block;font-size:14px;font-weight:600;line-height:1.3}
.ws-drv-val{text-align:right;font-size:15px;font-weight:650;font-variant-numeric:tabular-nums;line-height:1.2}
.ws-drv-val small{display:block;font-size:11.5px;font-weight:500;color:var(--muted)}
.ws-drvgrid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px;align-items:start}
.ws-drvpanel{position:sticky;top:84px;scroll-margin-top:80px}
.ws-score{display:flex;align-items:baseline;gap:6px}
.ws-score b{font-family:Poppins,Inter,sans-serif;line-height:1;font-weight:600;letter-spacing:-.03em}
.ws-score .ws-of{font-size:16px;color:var(--muted);font-weight:500}

/* compass */
.ws-compass{display:grid;grid-template-columns:minmax(0,210px) minmax(0,1fr);gap:18px;align-items:center;margin-top:12px}
.ws-compass svg{width:100%;height:auto;display:block}

/* area detail */
.ws-tabs{display:flex;gap:6px;flex-wrap:wrap}
.ws-tab{display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:6px;border:1px solid var(--line);background:#fff;font:inherit;font-size:14px;font-weight:600;color:var(--ink2);cursor:pointer}
.ws-tab b{font-weight:650;color:var(--ink)}
.ws-tab[aria-selected="true"]{border-color:var(--ink);color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.ws-detail{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:0;padding:0;margin-top:12px;overflow:hidden}
.ws-detail>div{padding:24px}
.ws-detail>div+div{border-left:1px solid var(--line)}
.ws-note{margin-top:16px;padding:12px 14px;border-radius:8px;background:var(--soft);font-size:13.5px;color:var(--ink2)}
.ws-note b{color:var(--ink)}
.ws-qs{display:grid}
.ws-qrow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 0;border-top:1px solid var(--grid)}
.ws-qrow:first-child{border-top:0;padding-top:6px}
.ws-qrow b{font-size:14px;font-weight:600;display:block}
.ws-qrow p{font-size:12.5px;color:var(--muted);line-height:1.45;margin-top:2px}
.ws-helps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
.ws-help{display:flex;flex-direction:column;gap:6px;padding:16px;border:1px solid var(--line);border-radius:8px;background:#fff}
.ws-help h4{font-size:14.5px;font-weight:650;line-height:1.35}
.ws-help p{font-size:13px;color:var(--ink2);line-height:1.5;flex:1}

/* plan */
.ws-planhead{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center}
.ws-prog{height:8px;border-radius:4px;background:var(--track);overflow:hidden;margin-top:10px}
.ws-prog i{display:block;height:100%;background:var(--acc);border-radius:0 4px 4px 0;transition:width .3s}
.ws-weeks{display:flex;gap:6px;flex-wrap:wrap;margin-top:16px}
.ws-week{height:34px;padding:0 13px;border-radius:6px;border:1px solid var(--line);background:#fff;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink2);cursor:pointer}
.ws-week[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.ws-week em{font-style:normal;font-weight:500;opacity:.7;margin-left:4px}
.ws-actions{display:grid;gap:12px;margin-top:14px}
.ws-action{padding:0;overflow:hidden}
.ws-action-h{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:18px 20px 6px}
.ws-action-tag{display:flex;align-items:center;flex-wrap:wrap;gap:4px 6px;font-size:12.5px;font-weight:600;color:var(--ink2)}
.ws-action h3{font-size:16.5px;font-weight:650;line-height:1.35;margin-top:6px}
.ws-action-why{font-size:13.5px;color:var(--ink2);margin-top:4px}
.ws-ring{position:relative;width:46px;height:46px;flex:none}
.ws-ring svg{display:block}
.ws-ring span{position:absolute;inset:0;display:grid;place-items:center;font-size:12px;font-weight:650}
.ws-steps{list-style:none;margin:0;padding:6px 20px 8px}
.ws-step{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:10px;align-items:start;padding:9px 0;border-top:1px solid var(--grid)}
.ws-step:first-child{border-top:0}
.ws-step input{width:18px;height:18px;margin:2px 0 0;accent-color:var(--ink);cursor:pointer}
.ws-step label{font-size:14px;cursor:pointer}
.ws-step[data-done="true"] label{color:var(--muted);text-decoration:line-through;text-decoration-color:var(--base)}
.ws-step small{font-size:12px;color:var(--muted);white-space:nowrap;padding-top:2px}
.ws-action-f{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px 20px 16px;border-top:1px solid var(--grid);background:#fcfbf9}
.ws-script{margin:0 20px 16px;border:1px solid var(--line);border-radius:8px;background:#fcfbf9}
.ws-script pre{margin:0;padding:14px 16px;font:inherit;font-size:13.5px;line-height:1.6;white-space:pre-wrap;color:var(--ink)}
.ws-script-h{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 8px 0 16px;font-size:12.5px;font-weight:600;color:var(--ink2)}

/* progress */
.ws-pulse{display:grid;gap:12px;margin-top:14px}
.ws-prow{display:grid;grid-template-columns:170px minmax(0,1fr);gap:14px;align-items:center}
.ws-pbtns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}
.ws-pbtns button{min-height:38px;border:1px solid var(--line);border-radius:6px;background:#fff;font:inherit;font-size:13.5px;line-height:1.2;font-weight:600;color:var(--ink2);cursor:pointer;padding:4px}
.ws-pbtns button[aria-checked="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.ws-sparks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:4px}
.ws-spark{padding:14px;border:1px solid var(--line);border-radius:8px;background:#fff}

/* callouts + footer */
.ws-callout{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:start}
.ws-callout-ic{width:36px;height:36px;border-radius:8px;display:grid;place-items:center;background:var(--soft);color:var(--ink)}
.ws-callout[data-tone="crit"]{border-color:rgba(208,59,59,.45)}
.ws-callout[data-tone="crit"] .ws-callout-ic{background:#fbeaea;color:var(--crit)}
.ws-callout ul{margin:8px 0 0;padding-left:18px;font-size:14px;color:var(--ink2)}
.ws-callout li{margin-top:4px}
.ws-tel{font-family:Poppins,Inter,sans-serif;font-size:22px;font-weight:600;letter-spacing:-.01em;text-decoration:none}
.ws-details{border-top:1px solid var(--line);padding-top:6px}
.ws-details summary{cursor:pointer;font-weight:600;padding:12px 0;list-style:none;display:flex;align-items:center;justify-content:space-between}
.ws-details summary::-webkit-details-marker{display:none}
.ws-details summary::after{content:"+";font-size:20px;font-weight:400;color:var(--muted)}
.ws-details[open] summary::after{content:"−"}
.ws-details ul{margin:0 0 14px;padding-left:18px;color:var(--ink2);font-size:14px}
.ws-details li{margin-top:6px}
.ws-foot{margin-top:40px;padding:18px 0 8px;border-top:1px solid var(--line);display:flex;gap:10px 20px;flex-wrap:wrap;justify-content:space-between;font-size:13px;color:var(--ink2)}
.ws-show-sm{display:none}
.ws-offweek{display:none!important}

@media (max-width:1180px){
  .ws-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ws-drv button{grid-template-columns:minmax(0,160px) minmax(0,1fr) 64px}
}
@media (max-width:980px){
  .ws-side{transform:translateX(-100%);box-shadow:none}
  .ws-side.open{transform:none;box-shadow:0 0 40px rgba(0,0,0,.18)}
  .ws-body{margin-left:0}
  .ws-burger{display:grid}
  .ws-top{padding:0 16px}
  .ws-main{padding:20px 16px 28px}
  .ws-grid2,.ws-drvgrid{grid-template-columns:1fr}
  .ws-drvpanel{position:static}
  .ws-detail{grid-template-columns:1fr}
  .ws-detail>div+div{border-left:0;border-top:1px solid var(--line)}
  .ws-helps{grid-template-columns:1fr}
  .ws-sparks{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:560px){
  .ws-card{padding:18px}
  .ws-action{padding:0}
  .ws-detail>div{padding:18px}
  .ws-kpis{gap:10px}
  .ws-kpi{padding:14px}
  .ws-kpi>b{font-size:28px}
  .ws-kpi>b.ws-kpi-t{font-size:15.5px}
  .ws-donut{grid-template-columns:1fr;justify-items:center;gap:14px}
  .ws-legend{width:100%}
  .ws-compass{grid-template-columns:1fr}
  .ws-compass svg{max-width:280px;margin:0 auto}
  .ws-arow{grid-template-columns:minmax(0,1fr) 34px;row-gap:8px}
  .ws-arow .ws-track{grid-column:1 / -1;grid-row:2}
  .ws-drv button{grid-template-columns:minmax(0,1fr) 56px;row-gap:8px}
  .ws-drv button>span[aria-hidden]{grid-column:1 / -1;grid-row:2}
  .ws-prow{grid-template-columns:1fr;gap:6px}
  .ws-step{grid-template-columns:24px minmax(0,1fr)}
  .ws-step small:not(.ws-hide-sm){grid-column:2}
  .ws-hide-sm{display:none}
  .ws-show-sm{display:inline}
  .ws-action-h,.ws-steps,.ws-action-f{padding-left:16px;padding-right:16px}
  .ws-script{margin-left:16px;margin-right:16px}
}
@media print{
  .ws{background:#fff}
  .ws-side,.ws-top,.ws-scrim,.ws-noprint{display:none!important}
  .ws-body{margin-left:0}
  .ws-main{padding:0}
  .ws-card,.ws-kpi{break-inside:avoid}
  .ws-sec{margin-top:24px}
  .ws-drvpanel{position:static}
  .ws-detail-wrap[hidden]{display:block!important;margin-top:16px}
  .ws-offweek{display:grid!important}
  .ws-tabs{display:none}
  .ws-details[open] summary::after,.ws-details summary::after{content:""}
}
`;
