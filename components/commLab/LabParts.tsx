"use client";
/**
 * Communication Lab - the shell (tabs, progress provider, badge toast) and
 * the pieces several pages share: progress ring, skill radar, CQ trend,
 * the module list and the badge shelf.
 */
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { FEATURES } from "@/lib/features/catalog";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { moduleHref } from "@/lib/commLab/content";
import { BADGES, SKILL_LABEL, moduleStatus, moduleUnlocked } from "@/lib/commLab/scoring";
import { SKILLS, type CommLabState, type Skill, type Track } from "@/lib/commLab/types";
import { CommLabProvider, useCommLab } from "./CommLabProvider";

const TABS = [
  { href: "/account/communication", label: "Lab home" },
  { href: "/account/communication/practice", label: "Daily challenge" },
  { href: "/account/communication/progress", label: "My CQ and progress" },
];

export function LabLayout({ children }: { children: ReactNode }) {
  const meta = FEATURES.communication;
  const pathname = usePathname() ?? "";
  const inPractice = pathname.startsWith("/account/communication/practice");
  const inProgress = pathname.startsWith("/account/communication/progress");
  return (
    <CommLabProvider>
      <CoursePlayerShell
        accent={meta.accent}
        banner={{ title: meta.title, icon: "audio", backHref: "/account", backLabel: "Dashboard" }}
        homeHref="/account/communication"
        tabs={TABS.map((t, i) => ({ ...t, active: i === 1 ? inPractice : i === 2 ? inProgress : !inPractice && !inProgress }))}
      >
        <style dangerouslySetInnerHTML={{ __html: LAB_CSS }} />
        <div className="fp cl" style={{ ["--accent" as string]: meta.accent }}>{children}</div>
        <Toast />
      </CoursePlayerShell>
    </CommLabProvider>
  );
}

function Toast() {
  const { toast } = useCommLab();
  return toast ? <div className="cl-toast" role="status"><Icon name="award" size={18} stroke={2} /> {toast}</div> : null;
}

// ------------------------------------------------------------------ charts (one series each: the Lab's accent, no legend)

/**
 * A listening clip, read aloud by the browser in an Indian English voice where
 * there is one. The words are never shown - the point is to listen. Counts plays.
 */
export function ListenClip({ text, label = "Play the clip" }: { text: string; label?: string }) {
  const [on, setOn] = useState(false);
  const [plays, setPlays] = useState(0);
  const ok = typeof window !== "undefined" && "speechSynthesis" in window;
  const play = () => {
    if (!ok) return;
    if (on) { speechSynthesis.cancel(); setOn(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const v = voices.find((x) => x.lang === "en-IN") ?? voices.find((x) => x.lang.startsWith("en"));
    if (v) u.voice = v;
    u.rate = 0.92;
    u.onend = () => setOn(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    setOn(true);
    setPlays((n) => n + 1);
  };
  return (
    <div className="lab-clip">
      <button type="button" className="fp-btn fp-btn-sm" onClick={play} disabled={!ok}>
        <Icon name={on ? "close" : "audio"} size={14} stroke={2} /> {on ? "Stop" : plays ? "Play it again" : label}
      </button>
      <span className="fp-muted" style={{ fontSize: 12.5 }}>{ok ? (plays ? `Played ${plays} time${plays === 1 ? "" : "s"} - listen once more if you need to.` : "Listen carefully - the words aren't shown.") : "This browser can't play the clip - try Chrome or Edge."}</span>
    </div>
  );
}

export function ProgressRing({ pct, size = 84, label }: { pct: number; size?: number; label?: string }) {
  const r = (size - 10) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ece9e3" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${(c * pct) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size / 4.4} fontWeight="700" fill="var(--ink)" fontFamily="Poppins, Inter, sans-serif">{pct}%</text>
    </svg>
  );
}

/** Four skills on four axes (0-100). Values are printed at each axis, so the shape is never the only cue. */
export function SkillRadar({ bySkill, size = 260 }: { bySkill: Partial<Record<Skill, number>>; size?: number }) {
  const cx = size / 2, cy = size / 2, R = size / 2 - 46;
  const angle = (i: number) => -Math.PI / 2 + (i * Math.PI) / 2;
  const pt = (i: number, v: number) => [cx + Math.cos(angle(i)) * (R * v) / 100, cy + Math.sin(angle(i)) * (R * v) / 100] as const;
  const shape = SKILLS.map((s, i) => pt(i, bySkill[s] ?? 0).join(",")).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size }} role="img"
      aria-label={`Skills: ${SKILLS.map((s) => `${SKILL_LABEL[s]} ${bySkill[s] ?? "not measured yet"}`).join(", ")}`}>
      {[25, 50, 75, 100].map((g) => <polygon key={g} points={SKILLS.map((_, i) => pt(i, g).join(",")).join(" ")} fill="none" stroke="#e8e5df" strokeWidth="1" />)}
      {SKILLS.map((_, i) => { const [x, y] = pt(i, 100); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8e5df" strokeWidth="1" />; })}
      <polygon points={shape} fill="color-mix(in srgb, var(--accent) 16%, transparent)" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      {SKILLS.map((s, i) => { const [x, y] = pt(i, bySkill[s] ?? 0); return bySkill[s] !== undefined ? <circle key={s} cx={x} cy={y} r="4" fill="var(--accent)" stroke="#fff" strokeWidth="2" /> : null; })}
      {SKILLS.map((s, i) => {
        const [x, y] = pt(i, 128);
        return (
          <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="var(--ink2)">
            <tspan x={x} dy="-0.5em" fontWeight="600" fill="var(--ink)">{SKILL_LABEL[s]}</tspan>
            <tspan x={x} dy="1.25em">{bySkill[s] ?? "–"}</tspan>
          </text>
        );
      })}
    </svg>
  );
}

/** Weekly CQ, oldest to newest; weeks with no score are left as gaps. Hover or focus a point for its value. */
export function CqTrend({ points }: { points: (number | null)[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 520, H = 170, L = 34, Rr = 12, T = 14, B = 26;
  const x = (i: number) => L + (i * (W - L - Rr)) / Math.max(points.length - 1, 1);
  const y = (v: number) => T + ((100 - v) * (H - T - B)) / 100;
  const segs: string[] = [];
  let cur = "";
  points.forEach((v, i) => { if (v === null) { if (cur) segs.push(cur); cur = ""; } else cur += `${cur ? "L" : "M"}${x(i)},${y(v)}`; });
  if (cur) segs.push(cur);
  const label = (i: number) => (i === points.length - 1 ? "This week" : `${points.length - 1 - i} wk ago`);
  return (
    <div className="cl-trend">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`CQ by week: ${points.map((v, i) => `${label(i)} ${v ?? "none"}`).join(", ")}`}>
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - Rr} y1={y(g)} y2={y(g)} stroke="#eeebe5" strokeWidth="1" />
            <text x={L - 8} y={y(g)} textAnchor="end" dominantBaseline="central" fontSize="11" fill="var(--mute)">{g}</text>
          </g>
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="#cfcac0" strokeWidth="1" />}
        {segs.map((d, i) => <path key={i} d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />)}
        {points.map((v, i) => v === null ? null : (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={hover === i ? 5 : 4} fill="var(--accent)" stroke="#fff" strokeWidth="2" />
            <rect x={x(i) - 18} y={T} width="36" height={H - T - B} fill="transparent" tabIndex={0} aria-label={`${label(i)}: CQ ${v}`}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} />
          </g>
        ))}
        <text x={L} y={H - 6} fontSize="11" fill="var(--mute)">{label(0)}</text>
        <text x={W - Rr} y={H - 6} fontSize="11" fill="var(--mute)" textAnchor="end">This week</text>
      </svg>
      {hover !== null && points[hover] !== null && (
        <div className="cl-tip" style={{ left: `${(x(hover) / W) * 100}%` }}><b>CQ {points[hover]}</b><span>{label(hover)}</span></div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ module list and badges

export function ModuleList({ track, state, preview }: { track: Track; state: CommLabState; preview?: boolean }) {
  return (
    <div className="cl-mods">
      {track.modules.map((m, i) => {
        const st = moduleStatus(m, state.lessons);
        const open = moduleUnlocked(track.modules, i, state.lessons);
        const label = st.complete ? "Done" : !open ? "Locked" : st.done ? "In progress" : "Start";
        return (
          <Link key={m.id} href={moduleHref(track, m)} className={`cl-mod${open ? "" : " is-locked"}`} aria-label={`Module ${i + 1}: ${m.title} - ${label}`}>
            <span className={`cl-mod-n${st.complete ? " is-done" : ""}`}>{st.complete ? <Icon name="check" size={18} stroke={2.6} /> : open ? i + 1 : <Icon name="lock" size={16} stroke={2} />}</span>
            <span className="cl-mod-b">
              <b>{m.title}</b>
              <small>{m.summary} · {m.lessons.length} lessons · {m.minutes} min</small>
              <span className="fp-bar" style={{ marginTop: 8, maxWidth: 360 }}><i style={{ width: `${st.pct}%`, background: "var(--accent)" }} /></span>
            </span>
            <span className="cl-mod-s">{label}{open && !st.complete && <Icon name="arrowRight" size={14} stroke={2} />}</span>
          </Link>
        );
      })}
      {track.planned.map((p, i) => (
        <div key={p.title} className="cl-mod is-planned" aria-label={`Module ${track.modules.length + i + 1}: ${p.title} - coming next`}>
          <span className="cl-mod-n">{track.modules.length + i + 1}</span>
          <span className="cl-mod-b"><b>{p.title}</b><small>{p.lessons}{p.voice !== "None" ? ` · Voice: ${p.voice}` : ""}</small></span>
          <span className="cl-mod-s">Coming next</span>
        </div>
      ))}
      {preview && <p className="fp-muted" style={{ padding: "10px 16px", margin: 0 }}>Previewing this track: your progress is saved, but your CQ and track badges count only your own track.</p>}
    </div>
  );
}

export function BadgeShelf({ track, state }: { track: Track; state: CommLabState }) {
  const list = [...track.modules.map((m) => ({ id: m.badge.id, title: m.badge.title, how: `Finish "${m.title}" (80% of lessons, the check-in${m.lessons.some((l) => l.type === "voice") ? " and the voice practice" : ""}).` })), ...BADGES];
  return (
    <div className="cl-badges">
      {list.map((b) => {
        const at = state.badges[b.id];
        return (
          <div key={b.id} className={`cl-badge${at ? " is-on" : ""}`} title={b.how}>
            <span className="cl-badge-ic" aria-hidden="true"><Icon name={at ? "award" : "lock"} size={20} stroke={1.9} /></span>
            <b>{b.title}</b>
            <small>{at ? `Earned ${new Date(at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : b.how}</small>
          </div>
        );
      })}
    </div>
  );
}

export const LAB_CSS = `
.lab-clip{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;margin:0 0 14px;background:var(--soft);border:1px solid var(--line);border-radius:8px}
.cl .cl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.cl .cl-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:18px 20px;display:flex;flex-direction:column;gap:6px;min-width:0}
.cl .cl-card h3{font-size:15px;font-weight:600;margin:0}
.cl .cl-big{font-family:Poppins,Inter,sans-serif;font-size:40px;font-weight:700;line-height:1;color:var(--ink)}
.cl .cl-band{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent);font-size:12.5px;font-weight:700}
.cl .cl-skillbars{display:grid;gap:6px;margin-top:6px}
.cl .cl-skillbar{display:grid;grid-template-columns:72px minmax(0,1fr) 28px;gap:8px;align-items:center;font-size:12.5px;color:var(--ink2)}
.cl .cl-skillbar i{display:block;height:6px;border-radius:3px;background:#ece9e3;overflow:hidden}
.cl .cl-skillbar i b{display:block;height:100%;background:var(--accent);border-radius:3px}
.cl .cl-skillbar span:last-child{text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.cl .cl-mods{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.cl .cl-mod{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:14px;align-items:center;padding:14px 16px;border-top:1px solid #f0ede8;text-decoration:none;color:var(--ink)}
.cl .cl-mod:first-child{border-top:0}
.cl a.cl-mod:hover{background:#fcfbf9}
.cl .cl-mod.is-locked{color:var(--ink2)}
.cl .cl-mod.is-planned{background:#fcfbf9;color:var(--mute)}
.cl .cl-mod-n{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-weight:700;background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent)}
.cl .cl-mod.is-locked .cl-mod-n,.cl .cl-mod.is-planned .cl-mod-n{background:#f1efea;color:#9a958b}
.cl .cl-mod-n.is-done{background:var(--ok);color:#fff}
.cl .cl-mod-b{min-width:0;display:flex;flex-direction:column}
.cl .cl-mod-b b{font-size:15px;font-weight:600}
.cl .cl-mod-b small{font-size:13px;color:var(--mute);margin-top:2px}
.cl .cl-mod-s{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;white-space:nowrap}
.cl .cl-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,190px),1fr));gap:10px}
.cl .cl-badge{display:flex;flex-direction:column;gap:3px;padding:14px;background:#fff;border:1px solid var(--line);border-radius:8px;color:var(--mute)}
.cl .cl-badge b{font-size:14px;color:var(--ink2)}
.cl .cl-badge small{font-size:12px;line-height:1.4}
.cl .cl-badge-ic{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#f1efea;color:#9a958b;margin-bottom:4px}
.cl .cl-badge.is-on{border-color:color-mix(in srgb,var(--accent) 35%,var(--line))}
.cl .cl-badge.is-on b{color:var(--ink)}
.cl .cl-badge.is-on .cl-badge-ic{background:var(--accent);color:#fff}
.cl .cl-trend{position:relative}
.cl .cl-tip{position:absolute;top:0;transform:translateX(-50%);background:#16181d;color:#fff;border-radius:6px;padding:5px 9px;font-size:12px;display:flex;flex-direction:column;align-items:center;pointer-events:none;white-space:nowrap}
.cl .cl-tip span{color:#c9cbd1;font-size:11px}
.cl .cl-note{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:8px;background:color-mix(in srgb,var(--accent) 6%,#fff);border:1px solid color-mix(in srgb,var(--accent) 22%,#fff);font-size:14px;line-height:1.5;color:var(--ink2)}
.cl .cl-note svg{flex:none;color:var(--accent);margin-top:2px}
.cl .cl-q{border:1px solid var(--line);border-radius:8px;background:#fff;padding:16px 18px;margin-bottom:10px}
.cl .cl-q legend{font-weight:600;font-size:15px;padding:0;margin-bottom:10px;color:var(--ink)}
.cl .cl-opt{display:flex;gap:10px;align-items:flex-start;padding:9px 12px;border:1px solid var(--line);border-radius:6px;margin-top:6px;cursor:pointer;font-size:14.5px;line-height:1.45;background:#fff}
.cl .cl-opt:hover{border-color:#c9c4ba}
.cl .cl-opt input{margin-top:3px;accent-color:var(--accent)}
.cl .cl-opt.is-right{border-color:var(--ok);background:#f0f9f3}
.cl .cl-opt.is-wrong{border-color:#e7a3a3;background:#fdf3f3}
.cl .cl-why{font-size:13px;color:var(--ink2);margin:8px 0 0}
.cl .cl-result{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;padding:14px 16px;border-radius:8px;background:var(--soft);margin:12px 0}
.cl .cl-result b{font-family:Poppins,Inter,sans-serif;font-size:22px}
.cl-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:120;display:flex;align-items:center;gap:8px;background:#16181d;color:#fff;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,.25);animation:fpfade .2s ease-out;max-width:calc(100vw - 32px)}
@media (max-width:900px){.cl .cl-grid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:560px){.cl .cl-mod{grid-template-columns:36px minmax(0,1fr)}.cl .cl-mod-s{grid-column:2}}
`;
