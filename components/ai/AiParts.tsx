"use client";
/**
 * AI & Certifications (/account/ai/*): the shell with its four tabs, the
 * learner's age band, and the course row and tool card every page uses.
 * Courses and tools open on the provider's own site in a new tab; opening one
 * is recorded as a visit (My Progress counts it).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { FEATURES } from "@/lib/features/catalog";
import { recordVisit } from "@/lib/progress/progressStore";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { BAND_LABEL, CHECKED, LEVELS, learnerOf, type AiCourse, type AiTool } from "@/lib/ai/catalog";

const TABS = [
  { href: "/account/ai", label: "Overview" },
  { href: "/account/ai/courses", label: "Free courses" },
  { href: "/account/ai/tools", label: "AI tools" },
  { href: "/account/ai/safety", label: "Use AI safely" },
];

export function AiShell({ children }: { children: ReactNode }) {
  const meta = FEATURES.ai;
  const pathname = usePathname() ?? "";
  return (
    <CoursePlayerShell
      accent={meta.accent}
      banner={{ title: meta.title, icon: "cpu", backHref: "/account", backLabel: "Dashboard" }}
      homeHref="/account/ai"
      tabs={TABS.map((t) => ({ ...t, active: pathname === t.href }))}
    >
      <style dangerouslySetInnerHTML={{ __html: AI_CSS }} />
      <div className="fp" style={{ ["--accent" as string]: meta.accent }}>{children}</div>
    </CoursePlayerShell>
  );
}

/** The signed-in learner's age band and class group (from their class). */
export function useLearner() {
  const { profile } = useAuth();
  return learnerOf(profile?.category);
}

const initials = (s: string) => s.replace(/\(.*?\)/g, "").split(/[\s,]+/).filter((w) => /^[A-Z0-9]/.test(w)).slice(0, 2).map((w) => w[0]).join("") || s[0];

export function CourseRow({ c }: { c: AiCourse }) {
  const level = LEVELS[c.level - 1];
  return (
    <div className="ai-crs" id={c.slug}>
      <span className={`ai-logo${c.kind === "india" ? " is-in" : ""}`} aria-hidden="true">{initials(c.provider)}</span>
      <div className="ai-crs-b">
        <b>{c.name}</b>
        <small>{c.provider}</small>
        <p>{c.why}</p>
        <div className="ai-tags">
          <span className="ai-tag is-lvl">Level {c.level} · {level.short}</span>
          {c.kind === "india" && <span className="ai-tag is-in">Government of India</span>}
          {c.time && <span className="ai-tag">{c.time}</span>}
          {c.languages && <span className="ai-tag">{c.languages}</span>}
        </div>
        {c.note && <p className="ai-note"><Icon name="info" size={14} stroke={2} /> {c.note}</p>}
      </div>
      <div className="ai-crs-a">
        <span className="ai-cert"><Icon name="award" size={16} stroke={2} /> Free {c.certificate}</span>
        <small>{c.certNote}</small>
        <a href={c.url} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => recordVisit("ai", `/account/ai/courses/${c.slug}`)}>
          Go to course <Icon name="arrowRight" size={14} stroke={2} />
        </a>
      </div>
    </div>
  );
}

export function ToolCard({ t, open: linked = false }: { t: AiTool; open?: boolean }) {
  const [open, setOpen] = useState(linked);
  const [copied, setCopied] = useState(false);
  const card = useRef<HTMLElement>(null);
  // Linked to directly (/account/ai/tools#gemini): open its rating card and bring it into view.
  useEffect(() => {
    if (!linked) return;
    setOpen(true);
    requestAnimationFrame(() => card.current?.scrollIntoView({ block: "start" }));
  }, [linked]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(t.tryThis.replace(/^"|"$/g, "")); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };
  return (
    <article className={`ai-tool${linked ? " is-linked" : ""}`} id={t.slug} ref={card}>
      <div className="ai-tool-h">
        <div style={{ minWidth: 0 }}>
          <b>{t.name}</b>
          <small>{t.maker} · {t.categories.join(", ")}</small>
        </div>
        <span className={`ai-age is-${t.band}`}>{BAND_LABEL[t.band]}</span>
      </div>
      <p className="ai-tool-what">{t.what}</p>
      <p className="ai-tool-free"><b>Free:</b> {t.free}</p>
      <div className="ai-tool-a">
        <a href={t.url} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-sm" onClick={() => recordVisit("ai", `/account/ai/tools/${t.slug}`)}>
          Open {t.name.replace(/\s*\(.*\)$/, "")} <Icon name="arrowRight" size={14} stroke={2} />
        </a>
        <button type="button" className="fp-link" style={{ fontSize: 13 }} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Hide rating card" : "Rating card and tips"}
        </button>
      </div>
      {open && (
        <div className="ai-card">
          <dl>
            <dt>Account</dt><dd>{t.account}</dd>
            <dt>Privacy</dt><dd>{t.privacy}</dd>
            <dt>Safety</dt><dd>{t.safety}</dd>
            <dt>Accuracy</dt><dd>{t.accuracy}</dd>
            {t.languages && <><dt>Indian languages</dt><dd>{t.languages}</dd></>}
            <dt>Checked</dt><dd>{CHECKED}. Free plans and age rules change - confirm on the tool&apos;s own site.</dd>
          </dl>
          <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Use it well</span>
          <ul className="ai-tips">{t.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          <div className="ai-try">
            <span><b>Try this:</b> {t.tryThis}</span>
            <button type="button" className="fp-btn fp-btn-sm" onClick={() => void copy()}>{copied ? <><Icon name="check" size={14} stroke={2.4} /> Copied</> : "Copy"}</button>
          </div>
        </div>
      )}
    </article>
  );
}

export const AI_CSS = `
.ai-list{background:#fff;border:1px solid var(--line);border-radius:8px}
.ai-crs{display:grid;grid-template-columns:44px minmax(0,1fr) 250px;gap:16px;padding:18px;border-top:1px solid #f0ede8;scroll-margin-top:140px}
.ai-crs:first-child{border-top:0}
.ai-logo{width:44px;height:44px;border-radius:8px;border:1px solid var(--line);background:var(--soft);display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:14px;color:var(--ink2)}
.ai-logo.is-in{background:#fff7ed;border-color:#fed7aa;color:#9a3412}
.ai-crs-b{min-width:0}
.ai-crs-b>b{display:block;font-size:15.5px;font-weight:600;color:var(--ink)}
.ai-crs-b>small{display:block;font-size:12.5px;color:var(--mute);margin-top:1px}
.ai-crs-b>p{margin:8px 0 0;font-size:14px;line-height:1.55;color:var(--ink2)}
.ai-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.ai-tag{font-size:12px;padding:3px 9px;border-radius:999px;background:var(--soft);color:var(--ink2);border:1px solid var(--line)}
.ai-tag.is-lvl{background:color-mix(in srgb,var(--accent) 8%,#fff);border-color:color-mix(in srgb,var(--accent) 25%,#fff);color:var(--accent);font-weight:600}
.ai-tag.is-in{background:#fff7ed;border-color:#fed7aa;color:#9a3412}
.ai-note{display:flex;gap:6px;align-items:flex-start;margin:10px 0 0!important;font-size:13px!important;color:var(--mute)!important}
.ai-note svg{flex:none;margin-top:2px}
.ai-crs-a{display:flex;flex-direction:column;align-items:flex-start;gap:6px}
.ai-crs-a small{font-size:12.5px;line-height:1.45;color:var(--ink2)}
.ai-crs-a .fp-btn{margin-top:6px}
.ai-cert{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--ok);text-transform:capitalize}
.ai-tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:12px;align-items:start}
.ai-tool{display:flex;flex-direction:column;gap:8px;padding:16px 18px;background:#fff;border:1px solid var(--line);border-radius:8px;scroll-margin-top:140px}
.ai-tool.is-linked{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.ai-tool-h{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.ai-tool-h b{display:block;font-size:15.5px;font-weight:600}
.ai-tool-h small{display:block;font-size:12.5px;color:var(--mute)}
.ai-age{flex:none;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:999px;white-space:nowrap}
.ai-age.is-kids{background:#ecfdf3;color:#166534}
.ai-age.is-teen{background:#fff7ed;color:#9a3412}
.ai-age.is-adult{background:#f4f4f5;color:#3f3f46}
.ai-tool-what{margin:0;font-size:14px;line-height:1.55;color:var(--ink2)}
.ai-tool-free{margin:0;font-size:13px;color:var(--ink2)}
.ai-tool-a{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-top:auto;padding-top:4px}
.ai-card{border-top:1px solid #f0ede8;padding-top:12px;margin-top:4px;display:grid;gap:10px}
.ai-card dl{display:grid;grid-template-columns:120px minmax(0,1fr);gap:6px 12px;margin:0;font-size:13px;line-height:1.5}
.ai-card dt{color:var(--mute);font-weight:600}
.ai-card dd{margin:0;color:var(--ink2)}
.ai-tips{margin:0;padding-left:18px;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.ai-try{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;padding:10px 12px;background:var(--soft);border-radius:6px;font-size:13px;line-height:1.5;color:var(--ink2)}
.ai-banner{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:8px;background:color-mix(in srgb,var(--accent) 6%,#fff);border:1px solid color-mix(in srgb,var(--accent) 22%,#fff);font-size:14px;line-height:1.5;color:var(--ink2);margin-bottom:14px}
.ai-banner svg{flex:none;color:var(--accent);margin-top:2px}
.ai-rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:10px}
.ai-rule{padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px}
.ai-rule i{display:block;font-style:normal;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:20px;color:var(--accent)}
.ai-rule b{display:block;font-size:14.5px;margin:4px 0}
.ai-rule p{margin:0;font-size:13.5px;line-height:1.5;color:var(--ink2)}
@media (max-width:860px){.ai-crs{grid-template-columns:40px minmax(0,1fr)}.ai-crs-a{grid-column:2}.ai-card dl{grid-template-columns:minmax(0,1fr)}.ai-card dt{margin-top:4px}}
`;
