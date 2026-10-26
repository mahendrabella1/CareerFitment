/**
 * The look of every feature home page (and My Progress): the job board's
 * visual language - a warm hero band with a 3D illustration, a big two-line
 * headline, a search box front and centre - with small 6-8px corners, hairline
 * borders, ink buttons and the section's accent used only for the second
 * headline line and small "you are here" marks. Injected by
 * CoursePlayerShell, so every feature page can use the fp- classes.
 */
export const FP_CSS = `
.fp{--ink:#16181d;--ink2:#4a4f59;--mute:#7b808b;--line:#e8e5df;--line2:#d9d5cd;--soft:#f7f5f1;--hero:#f4f0eb;--ok:#15803d}
.fp h1,.fp h2,.fp h3,.fp-display{font-family:Poppins,Inter,system-ui,sans-serif;letter-spacing:-.015em;color:var(--ink)}
.fp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 16px;border-radius:6px;border:1px solid var(--line2);background:#fff;color:var(--ink);font:inherit;font-size:14px;font-weight:600;text-decoration:none;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s}
.fp-btn:hover{background:var(--soft);border-color:#c9c4ba}
.fp-btn-pri{background:var(--ink);border-color:var(--ink);color:#fff}
.fp-btn-pri:hover{background:#2b2e35;border-color:#2b2e35;color:#fff}
.fp-btn-sm{height:34px;padding:0 12px;font-size:13px}
.fp-link{display:inline-flex;align-items:center;gap:6px;background:none;border:0;padding:0;font:inherit;font-size:14px;font-weight:600;color:var(--ink);text-decoration:none;cursor:pointer}
.fp-link:hover{text-decoration:underline;text-underline-offset:3px}
.fp-card{background:#fff;border:1px solid var(--line);border-radius:8px}
.fp-sec{margin-top:44px}
.fp-sec-h{display:flex;align-items:flex-end;justify-content:space-between;gap:10px 20px;flex-wrap:wrap;margin-bottom:16px}
.fp-sec-h h2{font-size:21px;font-weight:600;margin:0;line-height:1.25}
.fp-sec-h p{margin:4px 0 0;font-size:14px;color:var(--mute)}
.fp-kicker{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.fp-chip{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:6px;border:1px solid var(--line2);background:#fff;font:inherit;font-size:13px;font-weight:500;color:var(--ink2);text-decoration:none;cursor:pointer;white-space:nowrap}
.fp-chip:hover{border-color:#bdb7ac;color:var(--ink)}
.fp-chip[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.fp-bar{height:6px;border-radius:3px;background:#ece9e3;overflow:hidden}
.fp-bar>i{display:block;height:100%;background:var(--ink);border-radius:0 3px 3px 0;transition:width .3s}
.fp-muted{color:var(--mute);font-size:13px}

/* hero */
.fp-hero{position:relative;background:var(--hero);border-bottom:1px solid var(--line);margin:-28px calc(50% - 50vw) 0}
.fp-hero-in{max-width:1240px;margin:0 auto;padding:40px 32px 0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:28px;align-items:center}
.fp-hero h1{font-size:clamp(30px,3.5vw,46px);line-height:1.08;font-weight:700;margin:10px 0 0;text-wrap:balance}
.fp-hero h1 span{display:block;color:var(--accent)}
.fp-hero-tag{font-size:16.5px;line-height:1.55;color:var(--ink2);margin:14px 0 0;max-width:34em}
.fp-hero-art{align-self:end;display:flex;justify-content:center}
.fp-hero-art img{width:100%;max-width:540px;max-height:380px;height:auto;object-fit:contain;display:block;margin-bottom:18px}
.fp-hero-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:18px}
.fp-tourbtn{display:inline-flex;align-items:center;gap:8px;background:none;border:0;font:inherit;font-size:14px;font-weight:600;color:var(--ink);cursor:pointer;padding:0 6px;height:42px}
.fp-tourbtn i{width:26px;height:26px;border-radius:50%;background:#fff;border:1px solid var(--line2);display:grid;place-items:center}
.fp-tourbtn:hover span{text-decoration:underline;text-underline-offset:3px}
.fp-stats{grid-column:1 / -1;display:flex;flex-wrap:wrap;gap:0;border-top:1px solid var(--line2);margin-top:6px}
.fp-stat{flex:1 1 140px;padding:16px 20px 18px 0}
.fp-stat+.fp-stat{padding-left:20px;border-left:1px solid var(--line2)}
.fp-stat b{display:block;font-family:Poppins,Inter,sans-serif;font-size:24px;font-weight:600;line-height:1.15;color:var(--ink)}
.fp-stat span{font-size:13px;color:var(--mute)}

/* search */
.fp-search{position:relative;margin-top:22px;max-width:640px}
.fp-search-box{display:flex;align-items:center;gap:10px;height:54px;padding:0 8px 0 16px;background:#fff;border:1px solid var(--line2);border-radius:8px;box-shadow:0 10px 26px rgba(22,24,29,.07)}
.fp-search-box:focus-within{border-color:var(--ink)}
.fp-search-box svg{flex:none;color:var(--mute)}
.fp-search-box input{flex:1;min-width:0;height:100%;border:0;outline:0;background:none;font:inherit;font-size:15.5px;color:var(--ink)}
.fp-search-box input::placeholder{color:#9a9fa9}
.fp-search-box kbd{font:inherit;font-size:12px;color:var(--mute);border:1px solid var(--line2);border-radius:4px;padding:1px 7px}
.fp-sr{position:absolute;z-index:30;left:0;right:0;top:calc(100% + 6px);background:#fff;border:1px solid var(--line2);border-radius:8px;box-shadow:0 18px 40px rgba(22,24,29,.14);padding:6px;max-height:380px;overflow:auto}
.fp-sr a,.fp-sr button{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:10px 12px;border:0;border-radius:6px;background:none;font:inherit;text-align:left;text-decoration:none;color:var(--ink);cursor:pointer}
.fp-sr [aria-selected="true"]{background:var(--soft)}
.fp-sr b{font-size:14px;font-weight:600;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fp-sr small{font-size:12px;color:var(--mute)}
.fp-sr em{font-style:normal;font-size:11.5px;font-weight:600;color:var(--mute);border:1px solid var(--line);border-radius:4px;padding:2px 7px;white-space:nowrap}
.fp-sr-empty{padding:14px 12px;font-size:14px;color:var(--mute)}
.fp-popular{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px;font-size:13px;color:var(--mute)}

/* tour */
.fp-tour{position:fixed;inset:0;z-index:100;background:rgba(18,20,24,.55);display:grid;place-items:center;padding:16px;animation:fpfade .18s ease-out}
.fp-tour-d{position:relative;width:min(560px,100%);background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.3)}
.fp-tour-bars{position:absolute;z-index:2;top:12px;left:16px;right:16px;display:flex;gap:4px}
.fp-tour-bars i{flex:1;height:3px;border-radius:2px;background:rgba(22,24,29,.15);overflow:hidden}
.fp-tour-bars b{display:block;height:100%;background:var(--ink);width:0}
.fp-tour-bars b.is-done{width:100%}
.fp-tour-bars b.is-run{animation:fpbar var(--dur) linear forwards}
.fp-tour-d.is-paused .fp-tour-bars b.is-run{animation-play-state:paused}
.fp-tour-top{height:210px;background:var(--hero);display:grid;place-items:center;position:relative}
.fp-tour-top img{max-height:180px;max-width:86%;width:auto;height:auto}
.fp-tour-ic{width:84px;height:84px;border-radius:14px;background:#fff;border:1px solid var(--line);display:grid;place-items:center;color:var(--ink)}
.fp-tour-body{padding:22px 26px 6px;min-height:150px}
.fp-tour-body small{font-size:12.5px;font-weight:600;color:var(--mute)}
.fp-tour-body h2{font-size:22px;font-weight:600;margin:6px 0 0;line-height:1.25}
.fp-tour-body p{font-size:15px;line-height:1.6;color:var(--ink2);margin:8px 0 0}
.fp-tour-f{display:flex;align-items:center;gap:10px;padding:16px 26px 22px}
.fp-tour-x{position:absolute;z-index:3;top:22px;right:14px;width:32px;height:32px;border-radius:6px;border:0;background:rgba(255,255,255,.85);display:grid;place-items:center;cursor:pointer;color:var(--ink)}
.fp-tour-tap{position:absolute;z-index:1;top:0;bottom:0;width:30%;border:0;background:none;cursor:pointer}
@keyframes fpbar{from{width:0}to{width:100%}}
@media (prefers-reduced-motion:reduce){.fp-tour-bars b.is-run{animation:none;width:100%}}
@keyframes fpfade{from{opacity:0}to{opacity:1}}

/* lesson drawer */
.fp-drawer-bg{position:fixed;inset:0;z-index:90;background:rgba(18,20,24,.4);animation:fpfade .15s ease-out}
.fp-drawer{position:fixed;z-index:91;top:0;right:0;bottom:0;width:min(720px,100vw);background:#fff;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.18);animation:fpslide .2s ease-out}
@keyframes fpslide{from{transform:translateX(40px);opacity:.4}to{transform:none;opacity:1}}
.fp-drawer-h{display:flex;align-items:flex-start;gap:12px;padding:18px 22px;border-bottom:1px solid var(--line)}
.fp-drawer-h h2{font-size:20px;font-weight:600;margin:4px 0 0;line-height:1.3}
.fp-drawer-b{flex:1;overflow:auto;padding:20px 22px 28px}
.fp-drawer-b p{font-size:15px;line-height:1.75;color:#2f333b;margin:0 0 14px;max-width:64ch}
.fp-drawer-b .lead{font-size:16px;font-weight:600;color:var(--ink);line-height:1.55}
.fp-points{background:var(--soft);border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin:4px 0 16px}
.fp-points ul{margin:6px 0 0;padding-left:18px}
.fp-points li{font-size:14px;line-height:1.6;color:var(--ink);margin:3px 0}
.fp-drawer-f{display:flex;align-items:center;gap:8px;padding:14px 22px;border-top:1px solid var(--line);background:#fff}

/* curriculum (course layout) */
.fp-curr{border:1px solid var(--line);border-radius:8px;background:#fff;overflow:hidden}
.fp-mod{border-top:1px solid var(--line)}
.fp-mod:first-child{border-top:0}
.fp-mod-h{display:grid;grid-template-columns:18px minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:15px 18px;border:0;background:var(--soft);font:inherit;text-align:left;cursor:pointer}
.fp-mod-h b{font-size:15px;font-weight:600;color:var(--ink);display:block}
.fp-mod-h small{font-size:12.5px;color:var(--mute)}
.fp-mod-h svg{transition:transform .15s;color:var(--mute)}
.fp-mod-h[aria-expanded="true"] svg{transform:rotate(90deg)}
.fp-les{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:11px 18px 11px 48px;border:0;border-top:1px solid #f0ede8;background:#fff;font:inherit;text-align:left;cursor:pointer;color:var(--ink);text-decoration:none}
.fp-les:hover{background:#fcfbf9}
.fp-les span{font-size:14px}
.fp-les small{font-size:12.5px;color:var(--mute);white-space:nowrap}
.fp-tick{width:20px;height:20px;border-radius:50%;border:1.5px solid #c9c4ba;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:700}
.fp-tick.is-done{background:var(--ok);border-color:var(--ok)}
.fp-tick.is-locked{border-style:dashed}
.fp-two{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:28px;align-items:start}
.fp-side{position:sticky;top:76px;display:grid;gap:14px}
.fp-learn{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 24px;list-style:none;margin:0;padding:18px 20px}
.fp-learn li{display:grid;grid-template-columns:18px minmax(0,1fr);gap:10px;font-size:14px;line-height:1.5;color:var(--ink2)}
.fp-learn svg{margin-top:2px;color:var(--ok)}
.fp-includes{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.fp-includes li{display:flex;gap:10px;align-items:center;font-size:14px;color:var(--ink2)}

/* path (money) */
.fp-path{position:relative;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:8px;padding:8px 0 0}
.fp-path::before{content:"";position:absolute;top:36px;left:calc(50% / var(--n));right:calc(50% / var(--n));height:3px;background:repeating-linear-gradient(90deg,#d9d5cd 0 10px,transparent 10px 18px)}
.fp-stop{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;border:0;background:none;font:inherit;cursor:pointer;padding:0 4px 8px;color:var(--ink)}
.fp-node{position:relative;width:62px;height:62px;border-radius:50%;background:#fff;border:2px solid #d9d5cd;display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-size:20px;font-weight:700;color:var(--mute);transition:transform .15s}
.fp-stop:hover .fp-node{transform:translateY(-2px)}
.fp-stop.is-done .fp-node{background:var(--ink);border-color:var(--ink);color:#fff}
.fp-stop.is-now .fp-node{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 6px color-mix(in srgb,var(--accent) 14%,transparent)}
.fp-stop[aria-pressed="true"] .fp-node{outline:2px solid var(--ink);outline-offset:4px}
.fp-stop b{font-size:13.5px;font-weight:600;line-height:1.3;max-width:15ch}
.fp-stop small{font-size:12px;color:var(--mute)}
.fp-here{position:absolute;top:-24px;font-size:11px;font-weight:700;color:var(--accent);white-space:nowrap}
.fp-shelf{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.fp-shelf-c{display:flex;flex-direction:column;padding:18px}
.fp-shelf-c h3{font-size:16px;font-weight:600;margin:10px 0 2px}
.fp-shelf-c ul{list-style:none;margin:10px 0 14px;padding:0;flex:1}
.fp-shelf-c li a{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #f0ede8;font-size:14px;color:var(--ink);text-decoration:none}
.fp-shelf-c li a:hover{color:var(--accent)}
.fp-shelf-c li small{color:var(--mute);font-size:12px}
.fp-ic{width:40px;height:40px;border-radius:8px;background:var(--hero);display:grid;place-items:center;color:var(--ink)}

/* directory rows (catalogue, helpdesk) */
.fp-dir{border:1px solid var(--line);border-radius:8px;background:#fff;overflow:hidden}
.fp-dir-h{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid var(--line);background:var(--soft)}
.fp-dir-h input{flex:1 1 220px;height:36px;border:1px solid var(--line2);border-radius:6px;padding:0 12px;font:inherit;font-size:14px;background:#fff}
.fp-dir-h input:focus{outline:none;border-color:var(--ink)}
.fp-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.7fr) 20px;gap:16px;align-items:center;padding:13px 16px;border-top:1px solid #f0ede8;text-decoration:none;color:var(--ink)}
.fp-row:first-child{border-top:0}
.fp-row:hover{background:#fcfbf9}
.fp-row b{font-size:14.5px;font-weight:600}
.fp-row span{font-size:13px;color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fp-row svg{color:#b5b0a6}
.fp-row.is-num{grid-template-columns:34px minmax(0,1fr) 20px}
.fp-row.is-num i{font-style:normal;font-family:Poppins,Inter,sans-serif;font-weight:700;color:var(--mute);font-size:15px}
.fp-row.is-wide{grid-template-columns:minmax(0,1.4fr) minmax(0,.8fr) minmax(0,.6fr) 110px 20px}
.fp-row .fp-sal{text-align:right;color:var(--ink);font-weight:600}
.fp-more{display:block;width:100%;padding:12px;border:0;border-top:1px solid var(--line);background:#fff;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer;color:var(--ink)}
.fp-tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.fp-tool{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid var(--line);border-radius:8px;background:#fff;text-decoration:none;color:var(--ink)}
.fp-tool:hover{border-color:#c9c4ba}
.fp-tool b{font-size:14px;font-weight:600;display:block}
.fp-tool small{font-size:12px;color:var(--mute)}
.fp-index{columns:3 240px;column-gap:28px;padding:6px 18px 14px}
.fp-index a{display:flex;gap:10px;break-inside:avoid;padding:9px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:var(--ink);text-decoration:none}
.fp-index a:hover{color:var(--accent)}
.fp-index i{font-style:normal;font-variant-numeric:tabular-nums;color:var(--mute);min-width:1.6em}
.fp-sos{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border:1px solid var(--line);border-radius:8px;background:#fff;overflow:hidden}
.fp-sos a{display:flex;flex-direction:column;gap:2px;padding:14px 16px;text-decoration:none;color:var(--ink);border-left:1px solid var(--line)}
.fp-sos a:first-child{border-left:0;background:#fdf2f2}
.fp-sos b{font-family:Poppins,Inter,sans-serif;font-size:22px;font-weight:700}
.fp-sos span{font-size:12.5px;color:var(--ink2)}

/* board (study abroad) */
.fp-board{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(232px,1fr);gap:12px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin}
.fp-col{display:flex;flex-direction:column;background:var(--soft);border:1px solid var(--line);border-radius:8px;min-height:100%}
.fp-col-h{padding:14px 14px 10px}
.fp-col-h small{font-size:12px;font-weight:600;color:var(--mute)}
.fp-col-h h3{font-size:15px;font-weight:600;margin:3px 0 0}
.fp-col-h p{font-size:12.5px;color:var(--mute);line-height:1.45;margin:4px 0 0}
.fp-col-l{display:grid;gap:6px;padding:0 10px 10px;max-height:320px;overflow:auto}
.fp-col-l a{display:block;padding:10px 12px;background:#fff;border:1px solid var(--line);border-radius:6px;font-size:13.5px;font-weight:500;color:var(--ink);text-decoration:none}
.fp-col-l a:hover{border-color:#c9c4ba}
.fp-col-l a small{display:block;font-size:11.5px;color:var(--mute);font-weight:400}

@media (max-width:1100px){.fp-two{grid-template-columns:minmax(0,1fr)}.fp-side{position:static}.fp-shelf{grid-template-columns:minmax(0,1fr)}}
@media (max-width:1023px){.fp-hero{margin-top:-20px}.fp-hero-in{padding:24px 16px 0}}
@media (max-width:820px){
  .fp-hero-in{grid-template-columns:minmax(0,1fr);gap:0}
  .fp-hero-art{order:-1;align-self:center}
  .fp-hero-art img{max-width:320px;max-height:210px;margin:0 0 4px}
  .fp-path{grid-template-columns:minmax(0,1fr);gap:4px}
  .fp-path::before{top:31px;bottom:31px;left:30px;right:auto;width:3px;height:auto;background:repeating-linear-gradient(180deg,#d9d5cd 0 10px,transparent 10px 18px)}
  .fp-stop{flex-direction:row;text-align:left;padding:6px 0;gap:14px}
  .fp-stop b{max-width:none}
  .fp-here{position:static;order:3;margin-left:auto}
  .fp-learn{grid-template-columns:minmax(0,1fr)}
  .fp-sos{grid-template-columns:repeat(2,minmax(0,1fr))}
  .fp-sos a:nth-child(odd){border-left:0}
  .fp-sos a{border-top:1px solid var(--line)}
  .fp-sos a:first-child{grid-column:1 / -1;border-top:0}
  .fp-row,.fp-row.is-wide{grid-template-columns:minmax(0,1fr) auto 16px}
  .fp-row span{display:none}
  .fp-row .fp-sal{display:block}
  .fp-row.is-num{grid-template-columns:30px minmax(0,1fr) 16px}
}
@media (max-width:560px){
  .fp-stat{flex-basis:45%;padding:12px 10px 14px 0}
  .fp-stat+.fp-stat{padding-left:12px}
  .fp-stat:nth-child(3){border-left:0;padding-left:0}
  .fp-stat b{font-size:20px}
  .fp-tour-top{height:170px}.fp-tour-top img{max-height:150px}
  .fp-tour-body{padding:18px 18px 4px}.fp-tour-f{padding:14px 18px 18px}
  .fp-les{padding-left:18px}
  .fp-drawer-h,.fp-drawer-b,.fp-drawer-f{padding-left:16px;padding-right:16px}
  .fp-search-box kbd{display:none}
}
`;
