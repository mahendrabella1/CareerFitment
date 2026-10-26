/**
 * Styles for the Workplace Stress Check (start screen, test, results). Quiet
 * neutral surfaces and ink text; one blue ramp carries stress level (darker =
 * more), so the data is the only loud thing on the page.
 */
export const LEVEL_COLORS = { low: "#86b6ef", mild: "#5598e7", moderate: "#256abf", high: "#104281" } as const;
export const ACCENT = "#256abf";

export const STRESS_CSS = `
.ws{--page:#f7f7f5;--card:#fff;--ink:#0b0b0b;--ink2:#52514e;--muted:#898781;--line:rgba(11,11,11,.10);--grid:#e6e5df;--base:#c3c2b7;
--acc:${ACCENT};--acc-t:#edf3fb;--track:#edf3fb;--crit:#d03b3b;
min-height:100vh;background:var(--page);color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
.ws *{box-sizing:border-box}
.ws h1,.ws h2,.ws h3,.ws p{margin:0}
.ws a{color:inherit}
.ws-wrap{max-width:1080px;margin:0 auto;padding:0 16px}
.ws-narrow{max-width:640px;margin:0 auto;padding:0 16px}
.ws-bar{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.94);backdrop-filter:saturate(1.4) blur(8px);border-bottom:1px solid var(--line)}
.ws-bar-in{display:flex;align-items:center;gap:12px;height:60px}
.ws-brand{display:flex;align-items:center;gap:10px;text-decoration:none;min-width:0}
.ws-brand img{height:26px;width:auto}
.ws-brand span{font-weight:600;font-size:14px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:10px;border-left:1px solid var(--line)}
.ws-bar-r{margin-left:auto;display:flex;gap:8px;align-items:center}
.ws-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:38px;padding:0 14px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--ink);font:inherit;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .15s,border-color .15s}
.ws-btn:hover{background:#f3f3f0}
.ws-btn:focus-visible,.ws-focus:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.ws-btn:disabled{opacity:.45;cursor:not-allowed}
.ws-btn-pri{background:var(--ink);border-color:var(--ink);color:#fff}
.ws-btn-pri:hover{background:#262626}
.ws-btn-lg{height:48px;padding:0 22px;font-size:15px;border-radius:12px}
.ws-btn-sm{height:32px;padding:0 10px;font-size:13px;border-radius:8px}
.ws-link{background:none;border:0;padding:0;font:inherit;font-weight:600;color:var(--acc);cursor:pointer;text-decoration:none}
.ws-link:hover{text-decoration:underline}
.ws-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px}
.ws-h2{font-size:19px;font-weight:650;letter-spacing:-.01em;line-height:1.3}
.ws-h3{font-size:16px;font-weight:650;line-height:1.35}
.ws-sub{color:var(--ink2);margin-top:4px}
.ws-small{font-size:13px;color:var(--ink2)}
.ws-muted{font-size:12.5px;color:var(--muted)}
.ws-label{font-size:13px;font-weight:600;color:var(--ink2)}
.ws-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ws-sec{scroll-margin-top:120px;margin-top:40px}
.ws-sec-h{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.ws-sec-h h2{font-size:22px;font-weight:650;letter-spacing:-.015em}
.ws-chip{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--ink2);background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px 11px}
.ws-pill{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:3px 11px 3px 9px;background:#fff;white-space:nowrap}
.ws-pill i{width:10px;height:10px;border-radius:3px;display:inline-block}
/* section nav */
.ws-nav{position:sticky;top:60px;z-index:15;background:var(--page);border-bottom:1px solid var(--line)}
.ws-nav-in{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding:8px 0}
.ws-nav-in::-webkit-scrollbar{display:none}
.ws-nav button{flex:none;height:34px;padding:0 14px;border-radius:999px;border:0;background:none;font:inherit;font-size:14px;font-weight:600;color:var(--ink2);cursor:pointer}
.ws-nav button:hover{background:#ecebe7}
.ws-nav button[aria-current="true"]{background:var(--ink);color:#fff}
/* hero */
.ws-hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:0;padding:0;overflow:hidden}
.ws-hero>div{padding:26px}
.ws-hero>div+div{border-left:1px solid var(--line)}
.ws-hero h1{font-size:clamp(22px,2.6vw,27px);font-weight:650;letter-spacing:-.015em;line-height:1.25}
.ws-score{display:flex;align-items:baseline;gap:6px;margin-top:18px}
.ws-score b{font-size:64px;line-height:1;font-weight:650;letter-spacing:-.03em}
.ws-score .ws-of{font-size:18px;color:var(--muted);font-weight:500}
/* scale strip */
.ws-scale{position:relative;margin-top:30px;padding-bottom:20px}
.ws-scale-track{display:flex;gap:2px;height:8px}
.ws-scale-track i{height:100%;display:block}
.ws-scale-track i:first-child{border-radius:4px 0 0 4px}
.ws-scale-track i:last-child{border-radius:0 4px 4px 0}
.ws-scale-lbl{display:flex;gap:2px;margin-top:6px}
.ws-scale-lbl span{font-size:12px;color:var(--muted)}
.ws-mark{position:absolute;top:-24px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;pointer-events:none}
.ws-mark b{font-size:12px;font-weight:650;white-space:nowrap}
.ws-mark i{width:2px;height:22px;background:var(--ink);border-radius:2px;margin-top:2px}
.ws-avg{position:absolute;top:-4px;width:6px;height:16px;border-radius:2px;background:#fff;border:2px solid var(--ink2);transform:translateX(-50%)}
/* area bars */
.ws-areas{display:grid;gap:4px;margin-top:14px}
.ws-arow{position:relative;display:grid;grid-template-columns:minmax(118px,150px) minmax(0,1fr) 34px;align-items:center;gap:12px;padding:11px 10px;margin:0 -10px;border:0;border-radius:10px;background:none;font:inherit;text-align:left;color:inherit;cursor:pointer;width:calc(100% + 20px)}
.ws-arow:hover,.ws-arow[aria-pressed="true"]{background:#f4f4f1}
.ws-arow-name{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;min-width:0}
.ws-arow-name svg{flex:none;color:var(--ink2)}
.ws-arow-name small{display:block;font-size:12px;font-weight:500;color:var(--muted)}
.ws-arow-val{font-size:15px;font-weight:650;text-align:right}
.ws-track{position:relative;height:10px;background:var(--track);border-radius:0 4px 4px 0}
.ws-track>i{position:absolute;left:0;top:0;bottom:0;border-radius:0 4px 4px 0}
.ws-track>u,.ws-avgkey{position:absolute;top:-4px;bottom:-4px;width:6px;background:#fff;border:2px solid var(--ink2);border-radius:2px}
.ws-avgkey{position:static;display:inline-block;height:14px}
.ws-track>s{position:absolute;top:0;bottom:0;width:2px;background:#fff}
.ws-tip{position:absolute;z-index:5;left:50%;bottom:calc(100% + 6px);transform:translateX(-50%);background:var(--ink);color:#fff;font-size:12.5px;line-height:1.45;padding:8px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.18)}
/* compass */
.ws-compass{display:grid;grid-template-columns:minmax(0,230px) minmax(0,1fr);gap:20px;align-items:center;margin-top:14px}
.ws-compass svg{width:100%;height:auto;display:block}
/* hot spots */
.ws-hot{display:grid;gap:2px;margin-top:10px}
.ws-hot button{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 8px;margin:0 -8px;border:0;border-radius:10px;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}
.ws-hot button:hover{background:#f4f4f1}
.ws-hot-n{font-size:13px;font-weight:650;color:var(--muted)}
.ws-hot b{font-size:14.5px;font-weight:600;display:block;line-height:1.35}
.ws-ans{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.ws-ans span{font-size:12.5px;color:var(--ink2);font-weight:500}
.ws-seg{display:inline-flex;gap:2px}
.ws-seg i{width:10px;height:6px;border-radius:2px;background:var(--grid);display:block}
/* area detail */
.ws-tabs{display:flex;gap:6px;flex-wrap:wrap}
.ws-tab{display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:10px;border:1px solid var(--line);background:#fff;font:inherit;font-size:14px;font-weight:600;color:var(--ink2);cursor:pointer}
.ws-tab b{font-weight:650;color:var(--ink)}
.ws-tab[aria-selected="true"]{border-color:var(--ink);color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.ws-detail{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:0;padding:0;margin-top:12px;overflow:hidden}
.ws-detail>div{padding:24px}
.ws-detail>div+div{border-left:1px solid var(--line)}
.ws-note{margin-top:16px;padding:12px 14px;border-radius:12px;background:#f4f4f1;font-size:13.5px;color:var(--ink2)}
.ws-note b{color:var(--ink)}
.ws-qs{display:grid}
.ws-qrow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px 0;border-top:1px solid var(--grid)}
.ws-qrow:first-child{border-top:0;padding-top:4px}
.ws-qrow b{font-size:14px;font-weight:600;display:block}
.ws-qrow p{font-size:12.5px;color:var(--muted);line-height:1.45;margin-top:2px}
.ws-helps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
.ws-help{display:flex;flex-direction:column;gap:6px;padding:16px;border:1px solid var(--line);border-radius:14px;background:#fff}
.ws-help h4{margin:0;font-size:14.5px;font-weight:650;line-height:1.35}
.ws-help p{font-size:13px;color:var(--ink2);line-height:1.5;flex:1}
/* plan */
.ws-planhead{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center}
.ws-prog{height:8px;border-radius:4px;background:var(--track);overflow:hidden;margin-top:10px}
.ws-prog i{display:block;height:100%;background:var(--acc);border-radius:0 4px 4px 0;transition:width .3s}
.ws-weeks{display:flex;gap:6px;flex-wrap:wrap;margin-top:16px}
.ws-week{height:34px;padding:0 13px;border-radius:999px;border:1px solid var(--line);background:#fff;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink2);cursor:pointer}
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
.ws-action-f{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px 20px 16px;border-top:1px solid var(--grid);background:#fbfbfa}
.ws-script{margin:0 20px 16px;border:1px solid var(--line);border-radius:12px;background:#fbfbfa}
.ws-script pre{margin:0;padding:14px 16px;font:inherit;font-size:13.5px;line-height:1.6;white-space:pre-wrap;color:var(--ink)}
.ws-script-h{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 8px 0 16px;font-size:12.5px;font-weight:600;color:var(--ink2)}
/* pulse */
.ws-pulse{display:grid;gap:12px;margin-top:14px}
.ws-prow{display:grid;grid-template-columns:170px minmax(0,1fr);gap:14px;align-items:center}
.ws-pbtns{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}
.ws-pbtns button{min-height:38px;border:1px solid var(--line);border-radius:8px;background:#fff;font:inherit;font-size:13px;line-height:1.2;font-weight:600;color:var(--ink2);cursor:pointer;padding:4px}
.ws-pbtns button[aria-checked="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.ws-sparks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:4px}
.ws-spark{padding:14px;border:1px solid var(--line);border-radius:12px;background:#fff}
.ws-spark b{font-size:22px;font-weight:650;letter-spacing:-.02em}
/* callouts */
.ws-callout{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:start}
.ws-callout-ic{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:#f4f4f1;color:var(--ink)}
.ws-callout[data-tone="crit"]{border-color:rgba(208,59,59,.45)}
.ws-callout[data-tone="crit"] .ws-callout-ic{background:#fbeaea;color:var(--crit)}
.ws-callout ul{margin:8px 0 0;padding-left:18px;font-size:14px;color:var(--ink2)}
.ws-callout li{margin-top:4px}
.ws-tel{font-size:22px;font-weight:650;letter-spacing:-.01em;text-decoration:none}
.ws-details{border-top:1px solid var(--line);padding-top:6px}
.ws-details summary{cursor:pointer;font-weight:600;padding:12px 0;list-style:none;display:flex;align-items:center;justify-content:space-between}
.ws-details summary::-webkit-details-marker{display:none}
.ws-details summary::after{content:"+";font-size:20px;font-weight:400;color:var(--muted)}
.ws-details[open] summary::after{content:"−"}
.ws-details ul{margin:0 0 14px;padding-left:18px;color:var(--ink2);font-size:14px}
.ws-details li{margin-top:6px}
.ws-foot{margin-top:40px;padding:18px 0 40px;border-top:1px solid var(--line);display:flex;gap:10px 20px;flex-wrap:wrap;justify-content:space-between;font-size:13px;color:var(--ink2)}
/* test */
.ws-steps-bar{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:22px}
.ws-steps-bar>div{min-width:0}
.ws-steps-bar i{display:block;height:4px;border-radius:2px;background:var(--grid);overflow:hidden}
.ws-steps-bar i b{display:block;height:100%;background:var(--ink);transform-origin:left;transition:transform .25s}
.ws-steps-bar span{display:block;font-size:11.5px;color:var(--muted);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-steps-bar>div[data-on="true"] span{color:var(--ink);font-weight:600}
.ws-qcard{margin-top:28px}
.ws-recall{font-size:13px;font-weight:600;color:var(--acc)}
.ws-qtext{font-size:clamp(21px,3.2vw,26px);font-weight:650;letter-spacing:-.015em;line-height:1.3;margin-top:8px}
.ws-opts{display:grid;gap:8px;margin-top:24px}
.ws-opt{display:flex;align-items:center;gap:12px;min-height:54px;padding:12px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;font:inherit;font-size:15.5px;font-weight:500;color:var(--ink);text-align:left;cursor:pointer;transition:border-color .12s,background .12s}
.ws-opt:hover{border-color:rgba(11,11,11,.3)}
.ws-opt-dot{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--base);flex:none;display:grid;place-items:center}
.ws-opt[aria-checked="true"]{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.ws-opt[aria-checked="true"] .ws-opt-dot{border-color:var(--ink);background:var(--ink);box-shadow:inset 0 0 0 4px #fff}
.ws-opt-key{margin-left:auto;font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:1px 7px}
.ws-qnav{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:22px}
.ws-show-sm{display:none}
.ws-offweek{display:none!important}
.ws-fade{animation:wsfade .22s ease-out}
@keyframes wsfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (max-width:860px){
  .ws-hero,.ws-detail{grid-template-columns:1fr}
  .ws-hero>div+div,.ws-detail>div+div{border-left:0;border-top:1px solid var(--line)}
  .ws-grid2{grid-template-columns:1fr}
  .ws-helps{grid-template-columns:1fr}
  .ws-sparks{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:560px){
  .ws-hero>div,.ws-detail>div{padding:20px}
  .ws-card{padding:18px}
  .ws-action{padding:0}
  .ws-score b{font-size:56px}
  .ws-brand span{display:none}
  .ws-compass{grid-template-columns:1fr}
  .ws-compass svg{max-width:300px;margin:0 auto}
  .ws-arow{grid-template-columns:minmax(0,1fr) 34px;row-gap:8px}
  .ws-arow .ws-track{grid-column:1 / -1;grid-row:2}
  .ws-prow{grid-template-columns:1fr;gap:6px}
  .ws-pbtns button{font-size:14px}
  .ws-scale-lbl span{font-size:11px;white-space:nowrap;overflow:hidden}
  .ws-step{grid-template-columns:24px minmax(0,1fr)}
  .ws-step small:not(.ws-hide-sm){grid-column:2}
  .ws-steps-bar span{display:none}
  .ws-hide-sm{display:none}
  .ws-show-sm{display:inline}
  .ws-action-h,.ws-steps{padding-left:16px;padding-right:16px}
  .ws-action-f{padding-left:16px;padding-right:16px}
  .ws-script{margin-left:16px;margin-right:16px}
}
@media print{
  .ws{background:#fff}
  .ws-bar,.ws-nav,.ws-noprint,.ws-tip{display:none!important}
  .ws-card{break-inside:avoid}
  .ws-sec{margin-top:24px}
  .ws-detail-wrap[hidden]{display:block!important;margin-top:16px}
  .ws-offweek{display:grid!important}
  .ws-tabs{display:none}
  .ws-details[open] summary::after,.ws-details summary::after{content:""}
}
`;
