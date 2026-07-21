"use client";

/**
 * Dashboard — the premium /account experience (2026 redesign).
 *
 * A calm, scannable control centre built on the saved assessment summary:
 *   · Hero      — archetype, overall-fit ring, quick stats, primary actions
 *   · KPI strip — four at-a-glance tiles
 *   · Profile   — interactive 8-dimension radar + a plain-language snapshot
 *   · Matches   — ranked career fits
 *   · Dimensions— expandable accordion, each with a benchmark comparison
 *   · Mind      — how you think & work (small multiples)
 *   · Plan      — 30/90-day goal tracker with live progress
 *   · Resources — where to learn & get funded
 *
 * Palette: white / near-black / grey with a single light-red accent. All
 * charts are hand-built SVG (see ./viz). The in-depth report lives in
 * <FullReport/>, reachable via the "Full report" action.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, SkillBar, RadarChart, type RadarDatum } from "@/app/account/viz";
import FullReport from "@/app/account/FullReport";
import { TOOLKIT_TABS } from "@/app/account/toolkitData";
import {
  archetype, actionPlan, domainFit,
  percentileOf, subTraits, resultOf, categoryDeepDive,
} from "@/lib/report/knowledge";

// Dashboard accent — indigo/purple (the red brand logo stays as-is).
const IN = "#6366F1", IN_STRONG = "#4F46E5", IN_TINT = "#EEF0FF", IN_LINE = "#D5D9FB";
// KPI tile accent colours (purple / blue / green / orange), matching the design.
const KPI = [
  { c: "#6366F1", t: "#EEF0FF" },
  { c: "#2F80ED", t: "#E8F1FE" },
  { c: "#22A06B", t: "#E6F5EE" },
  { c: "#F2994A", t: "#FCF0E5" },
];

// Left-sidebar navigation → scrolls to the matching section id.
const NAV = [
  { id: "overview", label: "Overview", icon: "clusters" },
  { id: "matches", label: "Career Matches", icon: "match" },
  { id: "fields", label: "Best-fit Fields", icon: "compass" },
  { id: "dimensions", label: "8 Dimensions", icon: "radar" },
  { id: "mind", label: "How You Think", icon: "multiple_intelligence" },
  { id: "plan", label: "My Plan", icon: "check" },
];

const CANON = [
  "personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
  "learning_styles", "motivators", "strengths", "aptitude",
] as const;

const CAT_LABEL: Record<string, string> = {
  personality: "Personality", career_interest: "Career Interest", multiple_intelligence: "Multiple Intelligence",
  emotional_intelligence: "Emotional Intelligence", learning_styles: "Learning Style", motivators: "Motivators",
  strengths: "Strengths", aptitude: "Aptitude",
};

// "Typical student at your stage" markers — presentational benchmark only,
// not part of scoring. Lets each dimension show a comparison, not just a value.
const BENCH: Record<string, number> = {
  personality: 55, career_interest: 52, multiple_intelligence: 54, emotional_intelligence: 56,
  learning_styles: 58, motivators: 55, strengths: 50, aptitude: 52,
};

const bandLabel = (p: number) =>
  p >= 80 ? "Standout" : p >= 65 ? "Strength" : p >= 50 ? "Solid" : p >= 35 ? "Emerging" : "Developing";

export default function Dashboard({ a, profile, email, onSignOut }: { a: AssessmentSummary; profile?: UserProfile | null; email?: string | null; onSignOut?: () => void }) {
  const [view, setView] = useState<"dashboard" | "report">("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [toolkitTab, setToolkitTab] = useState(TOOLKIT_TABS[0].id);
  const name = (profile?.name || "").trim();
  const first = name.split(/\s+/)[0] || "there";

  // Highlight the sidebar item for whichever section is in view.
  useEffect(() => {
    if (view !== "dashboard") return;
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".ash-sec[id]"));
    if (!secs.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => { const vis = es.filter((e) => e.isIntersecting).sort((x, y) => y.intersectionRatio - x.intersectionRatio)[0]; if (vis) setActive(vis.target.id); },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [view]);

  const go = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const radar: RadarDatum[] = useMemo(() => {
    const src = (a.radar ?? []).length ? a.radar! : [];
    return CANON.map((k) => src.find((r) => r.key === k) ?? { key: k, label: CAT_LABEL[k], score: 0 });
  }, [a.radar]);

  // Coherent recommendation: blend interest + abilities + intelligences + values.
  const fits = domainFit(a);
  const topField = fits[0];
  const topDomainName = topField?.name ?? "your best-fit field";
  const fit = Math.max(a.overallFitmentPct ?? 0, topField?.fit ?? 0);
  const arch = archetype(a);
  const code = a.riasecCode || (a.themes ?? []).slice(0, 3).map((t) => t.letter).join("");
  const strongest = radar.slice().sort((x, y) => y.score - x.score)[0];
  const plan = actionPlan(a, topDomainName);
  const topRole = topField
    ? { role: (topField.roles ?? [])[0] ?? topField.name, salaryIndia: topField.salaryIndia, salaryAbroad: topField.salaryAbroad }
    : null;
  const scoreOf = (k: string) => radar.find((r) => r.key === k)?.score ?? 0;
  const pbars = [
    { label: "Personality", score: scoreOf("personality"), c: KPI[0].c },
    { label: "Work Style", score: scoreOf("strengths"), c: KPI[1].c },
    { label: "Values", score: scoreOf("motivators"), c: KPI[2].c },
  ];

  const dateStr = (() => {
    try { return new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return ""; }
  })();

  if (view === "report") {
    return (
      <div className="ogd-reportwrap">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="ogd-reportbar og-noprint">
          <button className="ogd-btn ghost" onClick={() => { setView("dashboard"); window.scrollTo(0, 0); }}>
            <Icon name="chevronLeft" size={16} /> Back to dashboard
          </button>
          <button className="ogd-btn solid" onClick={() => window.print()}>
            <Icon name="save" size={15} /> Download PDF
          </button>
        </div>
        <FullReport a={a} name={name} />
      </div>
    );
  }

  return (
    <div className="ash">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {navOpen && <div className="ash-scrim og-noprint" onClick={() => setNavOpen(false)} />}

      {/* ============================ SIDEBAR ============================ */}
      <aside className={`ash-side${navOpen ? " open" : ""} og-noprint`}>
        <div className="ash-brand"><Link href="/" style={{ textDecoration: "none" }}><Logo height={30} /></Link></div>
        <nav className="ash-nav">
          <div className="ash-nav-lbl">Menu</div>
          {NAV.map((n) => (
            <button key={n.id} className={`ash-navi${active === n.id ? " on" : ""}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={18} /><span>{n.label}</span>
            </button>
          ))}
          <div className="ash-nav-lbl">Career Toolkit</div>
          {TOOLKIT_TABS.map((t) => (
            <button key={t.id} className={`ash-navi${active === "resources" && toolkitTab === t.id ? " on" : ""}`}
              onClick={() => { setToolkitTab(t.id); go("resources"); }}>
              <Icon name={t.icon} size={18} /><span>{t.label}</span><span className="ash-navi-c">{t.items.length}</span>
            </button>
          ))}
          <div className="ash-nav-lbl">Report</div>
          <button className="ash-navi" onClick={() => setView("report")}><Icon name="explain" size={18} /><span>Full report</span></button>
          <Link href="/?begin=1" className="ash-navi"><Icon name="answer" size={18} /><span>Retake assessment</span></Link>
        </nav>
        <div className="ash-side-foot">
          <div className="ash-user">
            <span className="ash-ava">{(name || email || "?").trim().charAt(0).toUpperCase()}</span>
            <div className="ash-user-i"><div className="ash-user-n">{name || "You"}</div><div className="ash-user-e">{email}</div></div>
          </div>
          {onSignOut ? <button className="ash-signout" onClick={onSignOut}><Icon name="power" size={14} /> Sign out</button> : null}
        </div>
      </aside>

      {/* ============================ BODY ============================ */}
      <div className="ash-body">
        <header className="ash-top og-noprint">
          <button className="ash-burger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu"><Icon name="clusters" size={18} /></button>
          <div className="ash-top-t">
            <div className="ash-top-h">Welcome back, {first}! <span className="ash-wave">👋</span></div>
            <div className="ash-top-s">Here&apos;s your career assessment overview</div>
          </div>
          <div className="ash-top-actions">
            <span className="ash-bell"><Icon name="bell" size={19} /><i className="ash-bell-dot">3</i></span>
            <span className="ash-top-ava">{(name || email || "?").trim().charAt(0).toUpperCase()}</span>
          </div>
        </header>

        <main className="ash-main">
          <div className="ash-grid">
            <div className="ash-content">

              {/* ===== OVERVIEW ===== */}
              <section id="overview" className="ash-sec">
                <div className="ash-banner">
                  <span className="ash-banner-ic"><Icon name="check" size={18} /></span>
                  <div className="ash-banner-t">
                    <b>Assessment complete</b>
                    <span>Your personalised results are ready{dateStr ? ` · completed ${dateStr}` : ""}.</span>
                  </div>
                  <div className="ash-banner-a">
                    <button className="ogd-btn solid sm" onClick={() => setView("report")}><Icon name="explain" size={14} /> View report</button>
                    <button className="ogd-btn ghost sm" onClick={() => go("matches")}>View matches</button>
                  </div>
                </div>

                <div className="ogd-hero dark">
                  <div className="ogd-hero-l">
                    <span className="ogd-eyebrow">Your archetype</span>
                    <div className="ogd-arch">{arch.name}</div>
                    <div className="ogd-arch-ul" />
                    <p className="ogd-arch-tag">{a.summary || arch.tagline}</p>
                    <div className="ogd-hero-chips">
                      {code ? <span className="ogd-chip"><b>{code}</b> interest code</span> : null}
                      {a.topCareer ? <span className="ogd-chip"><b>{a.topCareer}</b> best fit</span> : null}
                      {dateStr ? <span className="ogd-chip ghost">Completed {dateStr}</span> : null}
                    </div>
                  </div>
                  <div className="ogd-hero-r">
                    <div className="ogd-ring-glow">
                      <Ring value={fit} size={168} stroke={13} color={IN} track="rgba(255,255,255,0.14)">
                        <div className="ogd-ring-pct">{fit}<small>%</small></div>
                        <div className="ogd-ring-lab">overall fit</div>
                      </Ring>
                    </div>
                  </div>
                </div>

                <div className="ogd-kpis">
                  <KpiTile icon="star" c={KPI[0]} label="Overall fitment" value={`${fit}%`} sub={bandLabel(fit)} subAccent />
                  <KpiTile icon="career_interest" c={KPI[1]} label="Interest code" value={code || "—"} sub="Holland RIASEC" />
                  <KpiTile icon="motivators" c={KPI[2]} label="Strongest area"
                    value={strongest ? String(Math.round(strongest.score)) : "—"} sub={strongest ? CAT_LABEL[strongest.key] : ""} />
                  <KpiTile icon="heart" c={KPI[3]} label="Emotional Intelligence"
                    value={a.ei != null ? String(Math.round(a.ei)) : "—"} sub={resultOf("emotional_intelligence", a)?.value || "Solid EQ"} />
                </div>

                <div className="ogd-grid-radar">
                  <div className="ogd-card">
                    <CardHead icon="user" title="Profile at a glance" sub="A quick snapshot of your personality and preferences." />
                    <div className="ogd-pbars">
                      {pbars.map((b) => (
                        <div className="ogd-pbar" key={b.label}>
                          <div className="ogd-pbar-top"><span>{b.label}</span><b>{Math.round(b.score)}%</b></div>
                          <SkillBar value={b.score} color={b.c} height={9} />
                        </div>
                      ))}
                    </div>
                    <button className="ogd-morelink" onClick={() => go("dimensions")}>View full profile <Icon name="chevronRight" size={14} /></button>
                  </div>
                  <div className="ogd-card">
                    <CardHead icon="pulse" title="Your snapshot" sub="Key highlights from your assessment." />
                    <div className="ogd-radar-chart"><RadarChart data={radar} color={IN} abbr={CATEGORY_ABBR} /></div>
                    <button className="ogd-morelink" onClick={() => setView("report")}>View detailed analysis <Icon name="chevronRight" size={14} /></button>
                  </div>
                </div>
              </section>

              {/* ===== MATCHES ===== */}
              {(a.matches?.length ? a.matches : []).length > 0 && (
                <section id="matches" className="ash-sec">
                  <div className="ogd-card">
                    <CardHead icon="match" title="Top career matches" sub="Roles your whole profile points to, ranked by fit." />
                    <div className="ogd-matches">
                      {a.matches.slice(0, 5).map((m, i) => (
                        <div className="ogd-match" key={i}>
                          <div className="ogd-match-rk">{i + 1}</div>
                          <div className="ogd-match-main">
                            <div className="ogd-match-top">
                              <span className="ogd-match-title">{m.title}</span>
                              <span className="ogd-match-pct">{m.fitmentPct}%<em>{m.band}</em></span>
                            </div>
                            <SkillBar value={m.fitmentPct} color={IN} />
                            {m.roles?.length ? (
                              <div className="ogd-match-roles">{m.roles.slice(0, 4).map((r) => <span key={r}>{r}</span>)}</div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                    {topRole && (
                      <div className="ogd-salaryhint">
                        e.g. <b>{topRole.role}</b> — {topRole.salaryIndia} in India · {topRole.salaryAbroad} abroad
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* ===== FIELDS ===== */}
              <section id="fields" className="ash-sec">
                <div className="ogd-card">
                  <CardHead icon="compass" title="Your best-fit fields"
                    sub="Blended from your interests, abilities, intelligences and drivers — so these actually reinforce each other." />
                  <div className="ogd-fields">
                    {fits.slice(0, 3).map((d, i) => (
                      <div className="ogd-field" key={d.name}>
                        <div className="ogd-field-rk">{i + 1}</div>
                        <div className="ogd-field-main">
                          <div className="ogd-field-top">
                            <span className="ogd-field-nm">{d.name}</span>
                            <span className="ogd-field-fit">{d.fit}%</span>
                          </div>
                          <SkillBar value={d.fit} color={IN} />
                          <div className="ogd-field-why">{d.tagline} · <b>{d.why}</b></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ===== DIMENSIONS ===== */}
              <section id="dimensions" className="ash-sec">
                <div className="ogd-card">
                  <CardHead icon="radar" title="Your eight dimensions"
                    sub="Tap a dimension to expand. The dark tick marks a typical student at your stage." />
                  <div className="ogd-dims">
                    {radar.map((d) => <DimRow key={d.key} d={d} a={a} />)}
                  </div>
                </div>
              </section>

              {/* ===== MIND ===== */}
              <section id="mind" className="ash-sec">
                <div className="ogd-card">
                  <CardHead icon="multiple_intelligence" title="How you think & work" sub="Your natural leanings across four lenses." />
                  <div className="ogd-mind">
                    <MiniList title="Intelligences" items={(a.topIntelligences ?? []).map((x) => ({ label: x.name, score: x.score }))} icon="multiple_intelligence" />
                    <MiniList title="Aptitudes" items={(a.topAptitudes ?? []).map((x) => ({ label: x.skill, score: x.score }))} icon="aptitude" />
                    <MiniList title="Motivators" items={(a.topValues ?? []).map((x) => ({ label: x.tag, score: x.score }))} icon="motivators" />
                    <MiniList title="Learning styles" items={(a.learningStyles ?? []).map((x) => ({ label: x.name, score: x.score }))} icon="learning_styles" />
                  </div>
                </div>
              </section>

              {/* ===== PLAN ===== */}
              <section id="plan" className="ash-sec">
                <GoalTracker plan={plan} storageKey={`og-goals-${a.completedAt}`} domain={topDomainName} />
              </section>

              {/* ===== CAREER TOOLKIT (in-dashboard listings) ===== */}
              <section id="resources" className="ash-sec">
                <Toolkit tab={toolkitTab} setTab={setToolkitTab} />
              </section>

              {/* ===== DETAILS ===== */}
              <section className="ash-sec">
                <div className="ogd-card ogd-profile">
                  <CardHead icon="user" title="Your details" />
                  <div className="ogd-details">
                    <Detail k="Full name" v={name || "—"} />
                    <Detail k="Email" v={email || profile?.email || "—"} />
                    <Detail k="Phone" v={profile?.phone || "—"} />
                    <Detail k="School / College / Company" v={profile?.institution || "—"} />
                    <Detail k="Desired career" v={profile?.desiredCareer || "—"} />
                    <Detail k="Current status" v={profile?.clarity || "—"} />
                  </div>
                </div>
              </section>
            </div>

            {/* ===== RIGHT RAIL ===== */}
            <aside className="ash-rail og-noprint">
              <div className="ogd-card rail-card">
                <div className="rail-h">Quick actions</div>
                <button className="rail-act primary" onClick={() => setView("report")}><Icon name="explain" size={16} /> View full report</button>
                <button className="rail-act" onClick={() => setView("report")}><Icon name="save" size={16} /> Download PDF</button>
                <Link href="/?begin=1" className="rail-act"><Icon name="answer" size={16} /> Retake assessment</Link>
              </div>

              <div className="ogd-card rail-card">
                <div className="rail-h">Your top match</div>
                <div className="rail-top-nm">{topField?.name || a.topCareer || "—"}</div>
                {topField?.tagline ? <div className="rail-top-tag">{topField.tagline}</div> : null}
                <div className="rail-top-bar"><SkillBar value={fit} color={IN} /></div>
                <div className="rail-top-fit"><b>{fit}%</b> overall fit</div>
              </div>

              <div className="ogd-card rail-card">
                <div className="rail-h">Career toolkit</div>
                <button className="rail-act" onClick={() => go("resources")}><Icon name="route" size={16} /> Open toolkit</button>
                <div className="rail-toolhint">Colleges · exams · internships · scholarships · careers — in your sidebar.</div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================== pieces ================================ */

function KpiTile({ icon, c, label, value, sub, subAccent }: { icon: string; c: { c: string; t: string }; label: string; value: string; sub?: string; subAccent?: boolean }) {
  return (
    <div className="ogd-kpi">
      <span className="ogd-kpi-ic" style={{ color: c.c, background: c.t }}><Icon name={icon} size={18} /></span>
      <div className="ogd-kpi-label">{label}</div>
      <div className="ogd-kpi-value">{value}</div>
      {sub ? <div className="ogd-kpi-sub" style={subAccent ? { color: c.c, fontWeight: 700 } : undefined}>{sub}</div> : null}
    </div>
  );
}

function CardHead({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="ogd-cardhead">
      <div className="ogd-cardhead-top">
        <span className="ogd-cardhead-ic"><Icon name={icon} size={17} /></span>
        <h2>{title}</h2>
      </div>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}


function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="ogd-detail">
      <span className="ogd-detail-k">{k}</span>
      <span className="ogd-detail-v">{v}</span>
    </div>
  );
}

/** In-dashboard toolkit: tabbed listings of real colleges, exams, internships,
 *  scholarships and careers — each row links to the official source. */
function Toolkit({ tab, setTab }: { tab: string; setTab: (id: string) => void }) {
  const active = TOOLKIT_TABS.find((t) => t.id === tab) ?? TOOLKIT_TABS[0];
  return (
    <div className="ogd-card">
      <CardHead icon="route" title="Career toolkit" sub="Explore real colleges, exams, internships, scholarships and careers — right here." />
      <div className="tk-tabs">
        {TOOLKIT_TABS.map((t) => (
          <button key={t.id} className={`tk-tab${t.id === tab ? " on" : ""}`} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={15} /> {t.label}<span className="tk-count">{t.items.length}</span>
          </button>
        ))}
      </div>
      <p className="tk-blurb">{active.blurb}</p>
      <div className="tk-list">
        {active.items.map((it) => (
          <a className="tk-row" key={it.name} href={it.href} target="_blank" rel="noreferrer">
            <div className="tk-row-main"><div className="tk-row-n">{it.name}</div><div className="tk-row-m">{it.meta}</div></div>
            {it.tag ? <span className="tk-tag">{it.tag}</span> : null}
            <span className="tk-go"><Icon name="chevronRight" size={15} /></span>
          </a>
        ))}
      </div>
    </div>
  );
}

/** One expandable dimension row with a benchmark comparison. */
function DimRow({ d, a }: { d: RadarDatum; a: AssessmentSummary }) {
  const [open, setOpen] = useState(false);
  const dd = categoryDeepDive(d.key, a);
  const res = resultOf(d.key, a);
  const subs = subTraits(d.key, a);
  const pct = percentileOf(d.score);
  const bench = BENCH[d.key];
  const delta = Math.round(d.score - bench);
  return (
    <div className={`ogd-dim${open ? " open" : ""}`}>
      <button className="ogd-dim-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="ogd-dim-ic"><Icon name={d.key} size={16} /></span>
        <span className="ogd-dim-name">{CAT_LABEL[d.key]}</span>
        <span className="ogd-dim-bar"><SkillBar value={d.score} color={IN} benchmark={bench} /></span>
        <span className="ogd-dim-score">{Math.round(d.score)}</span>
        <span className={`ogd-dim-delta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "+" : ""}{delta}</span>
        <span className="ogd-dim-chev"><Icon name="chevronRight" size={15} /></span>
      </button>
      {open && (
        <div className="ogd-dim-body">
          <div className="ogd-dim-meta">
            {res ? <span className="ogd-dim-result">{res.label}: <b>{res.value}</b></span> : null}
            <span className="ogd-dim-pct">Higher than {pct}% of students at your stage</span>
          </div>
          <p className="ogd-dim-text">{dd.meaning}</p>
          {subs.length > 0 && (
            <div className="ogd-dim-subs">
              {subs.slice(0, 6).map((s) => (
                <div className="ogd-dim-subrow" key={s.label}>
                  <span className="ogd-dim-sublab">{s.label}</span>
                  <SkillBar value={s.value} color={C.faint} height={6} />
                  <span className="ogd-dim-subval">{Math.round(s.value)}</span>
                </div>
              ))}
            </div>
          )}
          {dd.next ? <div className="ogd-dim-next"><b>Next:</b> {dd.next}</div> : null}
        </div>
      )}
    </div>
  );
}

function MiniList({ title, items, icon }: { title: string; items: { label: string; score: number }[]; icon: string }) {
  if (!items.length) return null;
  const max = Math.max(1, ...items.map((i) => i.score));
  return (
    <div className="ogd-minilist">
      <div className="ogd-minilist-h"><Icon name={icon} size={14} /> {title}</div>
      {items.slice(0, 4).map((it) => (
        <div className="ogd-minirow" key={it.label}>
          <span className="ogd-minilab">{it.label}</span>
          <SkillBar value={(it.score / max) * 100} color={IN} height={6} />
        </div>
      ))}
    </div>
  );
}

/** 30/90-day checklist with live progress persisted to localStorage. */
function GoalTracker({ plan, storageKey, domain }: { plan: { days30: string[]; days90: string[] }; storageKey: string; domain: string }) {
  const all = [...plan.days30, ...plan.days90];
  // Start empty for a stable first render, then load saved progress after mount
  // (localStorage is client-only — reading it during render risks a mismatch).
  const [done, setDone] = useState<Record<number, boolean>>({});
  useEffect(() => {
    try { setDone(JSON.parse(window.localStorage.getItem(storageKey) || "{}")); } catch { /* ignore */ }
  }, [storageKey]);
  const toggle = (i: number) => {
    setDone((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  const count = all.filter((_, i) => done[i]).length;
  const progress = Math.round((count / all.length) * 100);

  return (
    <section className="ogd-card">
      <div className="ogd-goal-head">
        <CardHead icon="check" title="Your action plan" sub={`Small steps toward ${domain}. Check items off as you go.`} />
        <Ring value={progress} size={72} stroke={8} color={progress >= 100 ? C.good : IN}>
          <div className="ogd-goal-prog">{count}<small>/{all.length}</small></div>
        </Ring>
      </div>
      <div className="ogd-goal-cols">
        <div className="ogd-goal-col">
          <div className="ogd-goal-tag n30">Next 30 days · quick wins</div>
          {plan.days30.map((t, i) => <GoalItem key={i} text={t} done={!!done[i]} onToggle={() => toggle(i)} />)}
        </div>
        <div className="ogd-goal-col">
          <div className="ogd-goal-tag n90">Next 90 days · momentum</div>
          {plan.days90.map((t, i) => {
            const idx = plan.days30.length + i;
            return <GoalItem key={idx} text={t} done={!!done[idx]} onToggle={() => toggle(idx)} />;
          })}
        </div>
      </div>
    </section>
  );
}

function GoalItem({ text, done, onToggle }: { text: string; done: boolean; onToggle: () => void }) {
  return (
    <button className={`ogd-goal-item${done ? " done" : ""}`} onClick={onToggle}>
      <span className="ogd-goal-box">{done ? <Icon name="check" size={13} /> : null}</span>
      <span className="ogd-goal-text">{text}</span>
    </button>
  );
}

/* =============================== styles =============================== */
const SIDE = 244;
const CSS = `
/* ===================== APP SHELL ===================== */
.ash{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:${C.ink};background:${C.bg};min-height:100vh;letter-spacing:-.005em}
.ash *{box-sizing:border-box}
.ash h1,.ash h2,.ash-top-h,.ogd-arch,.ogd-kpi-value,.ogd-ring-pct,.rail-top-nm,.ogd-cardhead h2,.tk-row-n,.ash-user-n{font-family:'Plus Jakarta Sans',Inter,sans-serif}
.ash h1,.ash h2{margin:0;letter-spacing:-.022em;font-weight:700}
.ash p{margin:0}

.ash-side{position:fixed;top:0;left:0;bottom:0;width:${SIDE}px;background:#fff;border-right:1px solid ${C.line};
  display:flex;flex-direction:column;z-index:40;transition:transform .22s cubic-bezier(.2,.8,.2,1)}
.ash-brand{padding:20px 22px 14px}
.ash-nav{flex:1;overflow-y:auto;padding:6px 12px}
.ash-nav-lbl{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:${C.faint};padding:14px 10px 6px}
.ash-navi{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:none;cursor:pointer;
  font-family:inherit;font-size:13.5px;font-weight:600;color:${C.ink2};padding:9px 12px;border-radius:10px;text-decoration:none;transition:background .12s,color .12s}
.ash-navi svg{color:${C.muted};flex:none;transition:color .12s}
.ash-navi:hover{background:${C.line2}}
.ash-navi.on{background:${IN_TINT};color:${IN_STRONG};font-weight:700}
.ash-navi.on svg{color:${IN}}
.ash-navi-c{margin-left:auto;font-size:10.5px;font-weight:700;color:${C.muted};background:${C.line2};border-radius:999px;padding:1px 7px}
.ash-navi.on .ash-navi-c{background:#fff;color:${IN}}
.rail-toolhint{font-size:11.5px;color:${C.ink3};line-height:1.5;margin-top:8px}
.ash-side-foot{padding:14px 14px 16px;border-top:1px solid ${C.line}}
.ash-user{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.ash-ava{width:36px;height:36px;border-radius:50%;flex:none;display:grid;place-items:center;background:${IN};color:#fff;font-weight:800;font-size:15px}
.ash-user-n{font-size:13px;font-weight:700;color:${C.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px}
.ash-user-e{font-size:11px;color:${C.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px}
.ash-signout{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;padding:9px;background:#fff;color:${C.redStrong};border:1px solid ${C.line};border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit}
.ash-signout:hover{border-color:${C.redLine};background:${C.redTint}}
.ash-scrim{position:fixed;inset:0;background:rgba(20,20,25,.4);z-index:39}

.ash-body{margin-left:${SIDE}px;min-height:100vh;display:flex;flex-direction:column}
.ash-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:13px 26px;background:rgba(255,255,255,.85);
  backdrop-filter:saturate(160%) blur(8px);border-bottom:1px solid ${C.line}}
.ash-burger{display:none;width:38px;height:38px;border-radius:9px;border:1px solid ${C.line};background:#fff;color:${C.ink2};place-items:center;cursor:pointer}
.ash-top-t{flex:1;min-width:0}
.ash-top-h{font-size:16px;font-weight:800;color:${C.ink}}
.ash-top-s{font-size:12px;color:${C.ink3};margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-main{padding:22px 26px 56px}
.ash-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:18px;max-width:1200px;margin:0 auto}
.ash-content{display:flex;flex-direction:column;gap:16px;min-width:0}
.ash-sec{scroll-margin-top:78px;display:flex;flex-direction:column;gap:16px}
.ash-banner{display:flex;align-items:center;gap:13px;background:#fff;border:1px solid ${C.line};border-radius:14px;padding:13px 18px;box-shadow:0 1px 2px rgba(20,20,25,.04)}
.ash-banner-ic{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;background:${C.goodTint};color:#1f7a55}
.ash-banner-t{flex:1;min-width:0;display:flex;flex-direction:column}
.ash-banner-t b{font-size:13.5px;font-weight:700;color:${C.ink}}
.ash-banner-t span{font-size:12.5px;color:${C.ink3}}
.ash-banner-a{display:flex;gap:8px;flex-wrap:wrap}
@media(max-width:560px){.ash-banner{flex-wrap:wrap}.ash-banner-a{width:100%}}
.ash-rail{display:flex;flex-direction:column;gap:14px;position:sticky;top:78px;align-self:start}

/* right rail */
.rail-card{padding:16px 17px !important}
.rail-h{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-bottom:12px}
.rail-act{display:flex;align-items:center;gap:9px;width:100%;text-align:left;padding:10px 12px;margin-bottom:7px;border-radius:10px;
  border:1px solid ${C.line};background:#fff;color:${C.ink2};font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit}
.rail-act svg{color:${C.muted}}
.rail-act:hover{border-color:${IN_LINE}}
.rail-act.primary{background:${IN};color:#fff;border-color:${IN}}
.rail-act.primary svg{color:#fff}
.rail-act:last-child{margin-bottom:0}
.rail-top-nm{font-size:15px;font-weight:800;color:${C.ink}}
.rail-top-tag{font-size:12px;color:${C.ink3};margin-top:3px;line-height:1.45}
.rail-top-bar{margin:12px 0 8px}
.rail-top-fit{font-size:12px;color:${C.ink3}}.rail-top-fit b{color:${IN};font-weight:800}
.rail-explore{display:flex;flex-direction:column}
.rail-ex{display:flex;align-items:center;gap:11px;padding:10px 0;border-top:1px solid ${C.line2};text-decoration:none}
.rail-ex:first-child{border-top:none;padding-top:0}
.rail-ex>svg{color:${C.faint};margin-left:auto;flex:none}
.rail-ex-ic{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;background:${IN_TINT};color:${IN}}
.rail-ex-t2{min-width:0}
.rail-ex-t{font-size:13px;font-weight:700;color:${C.ink}}
.rail-ex-d{font-size:11px;color:${C.ink3};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

@media(max-width:1080px){
  .ash-grid{grid-template-columns:1fr}
  .ash-rail{position:static;flex-direction:row;flex-wrap:wrap}
  .ash-rail>.ogd-card{flex:1;min-width:240px}
}
@media(max-width:860px){
  .ash-side{transform:translateX(-100%)}
  .ash-side.open{transform:none;box-shadow:0 20px 60px rgba(20,20,25,.25)}
  .ash-body{margin-left:0}
  .ash-burger{display:grid}
  .ash-rail{flex-direction:column}
}
@media print{.ash-body{margin-left:0}.ash-main{padding:0}}

.ogd{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:${C.ink};display:flex;flex-direction:column;gap:16px;letter-spacing:-.006em}
.ogd *{box-sizing:border-box}
.ogd h1,.ogd h2{margin:0;letter-spacing:-.02em}
.ogd p{margin:0}
.ogd-btn.sm{padding:8px 13px;font-size:13px}
.ogd-eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.muted}}
.ogd-sub{font-size:11.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:${C.muted};margin-bottom:12px}

/* buttons */
.ogd-btn{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;border-radius:11px;
  padding:11px 18px;cursor:pointer;text-decoration:none;border:1px solid transparent;transition:background .15s,border-color .15s,transform .05s;font-family:inherit}
.ogd-btn:active{transform:translateY(1px)}
.ogd-btn.solid{background:${IN};color:#fff}
.ogd-btn.solid:hover{background:${IN_STRONG}}
.ogd-btn.ghost{background:#fff;color:${C.ink2};border-color:${C.line}}
.ogd-btn.ghost:hover{border-color:${C.faint}}
.ogd-btn.lg{padding:14px 26px;font-size:15px}

/* card shell */
.ogd-card{background:${C.surface};border:1px solid ${C.line};border-radius:14px;padding:22px 24px;
  box-shadow:0 1px 2px rgba(20,20,25,.04)}
@media(max-width:560px){.ogd-card{padding:18px 16px;border-radius:12px}}
.ogd-cardhead{margin-bottom:16px}
.ogd-cardhead-top{display:flex;align-items:center;gap:10px}
.ogd-cardhead-ic{width:28px;height:28px;border-radius:8px;flex:none;display:grid;place-items:center;background:${C.line2};color:${C.ink3}}
.ogd-cardhead h2{font-size:15.5px;font-weight:700;letter-spacing:-.01em}
.ogd-cardhead p{font-size:13px;color:${C.ink3};margin-top:7px;line-height:1.55;max-width:64ch}

/* hero */
.ogd-hero{background:${C.surface};border:1px solid ${C.line};border-radius:18px;padding:28px 30px;
  display:grid;grid-template-columns:1fr auto;gap:26px;align-items:center;box-shadow:0 1px 2px rgba(20,20,25,.04);overflow:hidden;position:relative}
@media(max-width:640px){.ogd-hero{grid-template-columns:1fr;padding:22px 18px}}
.ogd-hi{font-size:15px;font-weight:600;color:${C.ink3};margin:10px 0 0}
.ogd-arch-kick{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};margin-top:16px}
.ogd-arch{font-size:clamp(25px,4.2vw,34px);font-weight:700;line-height:1.1;margin-top:6px;letter-spacing:-.02em}
.ogd-arch-tag{font-size:14px;line-height:1.62;color:${C.ink2};margin-top:12px;max-width:50ch}
.ogd-hero-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.ogd-chip{font-size:12px;font-weight:600;color:${C.ink2};background:${C.bg};border:1px solid ${C.line};border-radius:8px;padding:6px 12px}
.ogd-chip b{font-weight:700;color:${C.ink}}
.ogd-chip.ghost{color:${C.muted}}
.ogd-hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.ogd-hero-r{display:flex;flex-direction:column;align-items:center;gap:10px}
.ogd-ring-pct{font-size:36px;font-weight:700;line-height:1;color:${C.ink};letter-spacing:-.02em}
.ogd-ring-pct small{font-size:17px;color:${C.muted};font-weight:700}
.ogd-ring-lab{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-top:4px}
.ogd-ring-sub{font-size:11.5px;color:${C.muted};text-align:center;max-width:150px;line-height:1.4}

/* dark hero (matches design) */
.ogd-hero.dark{background:radial-gradient(120% 140% at 100% 0%, #2a2760 0%, #201d47 42%, #171633 100%);border:none;color:#fff;
  padding:34px 36px;border-radius:20px;box-shadow:0 12px 30px rgba(30,27,75,.28);overflow:hidden}
.ogd-hero.dark::after{content:"";position:absolute;top:22px;right:26px;width:120px;height:120px;opacity:.5;
  background-image:radial-gradient(rgba(255,255,255,.18) 1.4px, transparent 1.4px);background-size:14px 14px}
@media(max-width:640px){.ogd-hero.dark{padding:24px 20px}}
.ogd-hero.dark .ogd-eyebrow{color:#a9a6e6}
.ogd-hero.dark .ogd-arch{color:#fff;font-size:clamp(26px,4.2vw,36px)}
.ogd-arch-ul{width:56px;height:4px;border-radius:3px;background:${IN};margin:12px 0 0}
.ogd-hero.dark .ogd-arch-tag{color:#c9c7ea;max-width:44ch}
.ogd-hero.dark .ogd-chip{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#d7d5f2}
.ogd-hero.dark .ogd-chip b{color:#fff}
.ogd-hero.dark .ogd-chip.ghost{color:#9c99c9}
.ogd-ring-glow{position:relative;display:grid;place-items:center}
.ogd-ring-glow::before{content:"";position:absolute;width:150px;height:150px;border-radius:50%;
  background:radial-gradient(circle, rgba(99,102,241,.55), transparent 68%);filter:blur(14px)}
.ogd-hero.dark .ogd-ring-pct{color:#fff;font-size:40px}
.ogd-hero.dark .ogd-ring-pct small{color:#b9b7e4}
.ogd-hero.dark .ogd-ring-lab{color:#a9a6e6}

/* top-bar bell + avatar + wave */
.ash-wave{display:inline-block;animation:ashwave 2.4s ease-in-out infinite;transform-origin:70% 70%}
@keyframes ashwave{0%,60%,100%{transform:rotate(0)}20%{transform:rotate(16deg)}40%{transform:rotate(-8deg)}}
.ash-top-actions{display:flex;align-items:center;gap:14px}
.ash-bell{position:relative;width:40px;height:40px;border-radius:11px;display:grid;place-items:center;color:${C.ink2};background:#fff;border:1px solid ${C.line};cursor:pointer}
.ash-bell-dot{position:absolute;top:-5px;right:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:${IN};color:#fff;font-size:10px;font-weight:800;font-style:normal;display:grid;place-items:center;border:2px solid #fff}
.ash-top-ava{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:${IN};color:#fff;font-weight:800;font-size:16px;cursor:pointer}

/* profile-at-a-glance bars + more link */
.ogd-pbars{display:flex;flex-direction:column;gap:16px}
.ogd-pbar-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}
.ogd-pbar-top span{font-size:13.5px;font-weight:600;color:${C.ink2}}
.ogd-pbar-top b{font-size:13.5px;font-weight:800;color:${C.ink}}
.ogd-morelink{display:inline-flex;align-items:center;gap:6px;margin-top:18px;background:none;border:none;padding:0;cursor:pointer;
  font-family:inherit;font-size:12.5px;font-weight:700;color:${IN}}
.ogd-morelink svg{transition:transform .12s}
.ogd-morelink:hover svg{transform:translateX(2px)}

/* kpi strip */
.ogd-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:720px){.ogd-kpis{grid-template-columns:repeat(2,1fr)}}
.ogd-kpi{background:${C.surface};border:1px solid ${C.line};border-radius:13px;padding:16px 17px;box-shadow:0 1px 2px rgba(20,20,25,.04)}
.ogd-kpi-ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:${C.line2};color:${C.ink2};margin-bottom:12px}
.ogd-kpi-label{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${C.muted}}
.ogd-kpi-value{font-size:26px;font-weight:800;line-height:1.1;margin-top:5px;color:${C.ink}}
.ogd-kpi-sub{font-size:12px;color:${C.ink3};margin-top:3px;font-weight:600}

/* radar + snapshot */
.ogd-grid-radar{display:grid;grid-template-columns:1.05fr .95fr;gap:16px}
@media(max-width:820px){.ogd-grid-radar{grid-template-columns:1fr}}
.ogd-radar-chart{display:flex;justify-content:center;margin:2px 0 8px}
.ogd-radar-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.ogd-radar-chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:${C.ink2};
  background:#fff;border:1px solid ${C.line};border-radius:999px;padding:6px 11px;cursor:pointer;font-family:inherit}
.ogd-radar-chip b{color:${IN};font-weight:800}
.ogd-radar-chip.on{background:${C.ink};border-color:${C.ink};color:#fff}
.ogd-radar-chip.on b{color:#fff}
.ogd-radar-explain{background:${C.bg};border:1px solid ${C.line};border-radius:13px;padding:15px 16px}
.ogd-radar-explain-top{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.ogd-radar-explain-ic{color:${IN}}
.ogd-radar-explain-title{font-size:15px;font-weight:800;flex:1}
.ogd-radar-explain-score{font-size:20px;font-weight:800;color:${C.ink}}
.ogd-radar-explain-score small{font-size:11px;color:${C.muted};font-weight:600}
.ogd-radar-explain p{font-size:13.5px;line-height:1.6;color:${C.ink2}}
.ogd-resultchip{display:inline-block;font-size:12px;font-weight:600;color:${C.ink3};margin-bottom:9px}
.ogd-resultchip b{color:${IN};font-weight:800}
.ogd-snap{align-self:start}
.ogd-snap-row{display:flex;justify-content:space-between;gap:14px;align-items:baseline;padding:11px 0;border-bottom:1px solid ${C.line2}}
.ogd-snap-k{font-size:12.5px;color:${C.muted};font-weight:600}
.ogd-snap-v{font-size:13.5px;color:${C.ink};font-weight:700;text-align:right}
.ogd-snap-note{display:flex;gap:10px;margin-top:15px;padding:13px 14px;background:${C.bg};border:1px solid ${C.line};border-radius:11px;
  font-size:12.5px;line-height:1.5;color:${C.ink2}}
.ogd-snap-em{font-size:16px;flex:none}

/* matches */
.ogd-matches{display:flex;flex-direction:column;gap:12px}
.ogd-match{display:flex;gap:13px;align-items:flex-start}
.ogd-match-rk{width:26px;height:26px;border-radius:8px;flex:none;display:grid;place-items:center;background:${C.line2};
  color:${C.ink2};font-weight:800;font-size:12.5px;margin-top:1px}
.ogd-match-main{flex:1;min-width:0}
.ogd-match-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:7px}
.ogd-match-title{font-size:14px;font-weight:700}
.ogd-match-pct{font-size:13px;font-weight:800;color:${IN};white-space:nowrap}
.ogd-match-pct em{font-style:normal;font-weight:600;font-size:11px;color:${C.muted};margin-left:6px}
.ogd-match-roles{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.ogd-match-roles span{font-size:11px;font-weight:600;color:${C.ink3};background:${C.line2};border-radius:6px;padding:3px 9px}
.ogd-salaryhint{margin-top:16px;padding-top:14px;border-top:1px solid ${C.line2};font-size:12.5px;color:${C.ink3}}
.ogd-salaryhint b{color:${C.ink};font-weight:700}

/* recommended fields */
.ogd-fields{display:flex;flex-direction:column;gap:14px}
.ogd-field{display:flex;gap:13px;align-items:flex-start}
.ogd-field-rk{width:26px;height:26px;border-radius:8px;flex:none;display:grid;place-items:center;background:${C.ink};color:#fff;font-weight:700;font-size:12.5px;margin-top:1px}
.ogd-field-main{flex:1;min-width:0}
.ogd-field-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:7px}
.ogd-field-nm{font-size:14px;font-weight:800}
.ogd-field-fit{font-size:13px;font-weight:800;color:${IN}}
.ogd-field-why{font-size:12px;color:${C.ink3};margin-top:7px;line-height:1.5}
.ogd-field-why b{color:${C.ink2};font-weight:700}

/* explore next */
.ogd-explore{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.ogd-explore{grid-template-columns:1fr}}
.ogd-ex{display:flex;align-items:center;gap:13px;border:1px solid ${C.line};border-radius:13px;padding:14px 15px;text-decoration:none;background:#fff;transition:border-color .15s,transform .05s}
.ogd-ex:hover{border-color:${IN_LINE}}
.ogd-ex:active{transform:translateY(1px)}
.ogd-ex-ic{width:38px;height:38px;border-radius:10px;flex:none;display:grid;place-items:center;background:${IN_TINT};color:${IN}}
.ogd-ex-t{font-size:14px;font-weight:800;color:${C.ink}}
.ogd-ex-d{font-size:11.5px;color:${C.ink3};margin-top:1px}
.ogd-ex-go{margin-left:auto;color:${C.faint};flex:none}

/* dimensions accordion */
.ogd-dims{display:flex;flex-direction:column}
.ogd-dim{border-top:1px solid ${C.line2}}
.ogd-dim:first-child{border-top:none}
.ogd-dim-head{width:100%;display:grid;grid-template-columns:30px 1.35fr 1fr auto auto 16px;align-items:center;gap:12px;
  padding:14px 2px;background:none;border:none;cursor:pointer;text-align:left;font-family:inherit}
@media(max-width:560px){.ogd-dim-head{grid-template-columns:26px 1fr auto 16px;gap:9px}.ogd-dim-bar,.ogd-dim-delta{display:none}}
.ogd-dim-ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:${C.line2};color:${C.ink2}}
.ogd-dim-name{font-size:13.5px;font-weight:700;color:${C.ink}}
.ogd-dim-bar{min-width:60px}
.ogd-dim-score{font-size:14px;font-weight:800;text-align:right;min-width:26px}
.ogd-dim-delta{font-size:11.5px;font-weight:800;min-width:34px;text-align:right}
.ogd-dim-delta.up{color:${C.good}}
.ogd-dim-delta.down{color:${C.muted}}
.ogd-dim-chev{color:${C.faint};display:grid;place-items:center;transition:transform .2s}
.ogd-dim.open .ogd-dim-chev{transform:rotate(90deg)}
.ogd-dim-body{padding:2px 2px 18px;animation:ogdslide .25s ease}
@keyframes ogdslide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.ogd-dim-meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.ogd-dim-result,.ogd-dim-pct{font-size:11.5px;font-weight:600;border-radius:999px;padding:5px 11px}
.ogd-dim-result{background:${IN_TINT};color:${C.ink2}}
.ogd-dim-result b{color:${IN};font-weight:800}
.ogd-dim-pct{background:${C.line2};color:${C.ink3}}
.ogd-dim-text{font-size:13px;line-height:1.6;color:${C.ink2};max-width:70ch}
.ogd-dim-subs{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.ogd-dim-subrow{display:grid;grid-template-columns:130px 1fr 28px;align-items:center;gap:10px}
@media(max-width:560px){.ogd-dim-subrow{grid-template-columns:100px 1fr 26px}}
.ogd-dim-sublab{font-size:12px;color:${C.ink3};font-weight:600}
.ogd-dim-subval{font-size:12px;font-weight:700;text-align:right;color:${C.ink2}}
.ogd-dim-next{margin-top:14px;padding:11px 14px;background:${C.bg};border:1px solid ${C.line};border-radius:11px;font-size:12.5px;color:${C.ink2}}
.ogd-dim-next b{color:${C.ink};font-weight:800}

/* how you think (small multiples) */
.ogd-mind{display:grid;grid-template-columns:1fr 1fr;gap:22px}
@media(max-width:560px){.ogd-mind{grid-template-columns:1fr}}
.ogd-minilist-h{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;color:${C.ink2};margin-bottom:12px}
.ogd-minirow{display:grid;grid-template-columns:120px 1fr;align-items:center;gap:10px;margin-bottom:9px}
@media(max-width:560px){.ogd-minirow{grid-template-columns:96px 1fr}}
.ogd-minilab{font-size:12px;color:${C.ink3};font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* goal tracker */
.ogd-goal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.ogd-goal-prog{font-size:16px;font-weight:800;color:${C.ink}}
.ogd-goal-prog small{font-size:11px;color:${C.muted};font-weight:700}
.ogd-goal-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:6px}
@media(max-width:560px){.ogd-goal-cols{grid-template-columns:1fr}}
.ogd-goal-tag{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:6px 11px;border-radius:8px;
  display:inline-block;margin-bottom:12px}
.ogd-goal-tag.n30{background:${IN_TINT};color:${IN_STRONG}}
.ogd-goal-tag.n90{background:${C.line2};color:${C.ink2}}
.ogd-goal-item{display:flex;gap:11px;align-items:flex-start;width:100%;text-align:left;background:none;border:none;
  cursor:pointer;padding:8px 0;font-family:inherit}
.ogd-goal-box{width:20px;height:20px;border-radius:6px;border:2px solid ${C.faint};flex:none;display:grid;place-items:center;
  color:#fff;transition:background .15s,border-color .15s;margin-top:1px}
.ogd-goal-item.done .ogd-goal-box{background:${C.good};border-color:${C.good}}
.ogd-goal-text{font-size:13px;line-height:1.5;color:${C.ink2}}
.ogd-goal-item.done .ogd-goal-text{color:${C.muted};text-decoration:line-through}

/* learn + scholarships */
.ogd-learn{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}
@media(max-width:640px){.ogd-learn{grid-template-columns:1fr 1fr}}
@media(max-width:400px){.ogd-learn{grid-template-columns:1fr}}
.ogd-learn-chip{display:block;border:1px solid ${C.line};border-radius:12px;padding:11px 13px;text-decoration:none;background:#fff;transition:border-color .15s}
.ogd-learn-chip:hover{border-color:${IN_LINE}}
.ogd-learn-chip b{display:block;font-size:13px;font-weight:800;color:${C.ink}}
.ogd-learn-chip span{display:block;font-size:11px;color:${C.ink3};margin-top:2px}
.ogd-schol{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.ogd-schol{grid-template-columns:1fr}}
.ogd-schol-card{display:block;border:1px solid ${C.line};border-left:3px solid ${IN};border-radius:12px;padding:12px 14px;text-decoration:none;background:#fff}
.ogd-schol-n{font-size:13px;font-weight:800;color:${C.ink}}
.ogd-schol-w{font-size:11.5px;color:${C.ink3};margin-top:3px;line-height:1.45}

/* career toolkit (tabbed listings) */
.tk-tabs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px}
.tk-tab{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;color:${C.ink2};background:#fff;
  border:1px solid ${C.line};border-radius:999px;padding:7px 13px;cursor:pointer;font-family:inherit}
.tk-tab svg{color:${C.muted}}
.tk-tab:hover{border-color:${C.faint}}
.tk-tab.on{background:${C.ink};border-color:${C.ink};color:#fff}
.tk-tab.on svg{color:#fff}
.tk-count{font-size:10.5px;font-weight:800;background:${C.line2};color:${C.ink3};border-radius:999px;padding:1px 7px;margin-left:1px}
.tk-tab.on .tk-count{background:rgba(255,255,255,.22);color:#fff}
.tk-blurb{font-size:12.5px;color:${C.ink3};line-height:1.55;margin:0 0 14px;max-width:70ch}
.tk-list{border:1px solid ${C.line};border-radius:13px;overflow:hidden}
.tk-row{display:flex;align-items:center;gap:12px;padding:12px 15px;border-top:1px solid ${C.line2};text-decoration:none;transition:background .12s}
.tk-row:first-child{border-top:none}
.tk-row:hover{background:${C.line2}}
.tk-row-main{flex:1;min-width:0}
.tk-row-n{font-size:13.5px;font-weight:700;color:${C.ink}}
.tk-row-m{font-size:11.5px;color:${C.ink3};margin-top:1px}
.tk-tag{font-size:10.5px;font-weight:800;color:${IN};background:${IN_TINT};border:1px solid ${IN_LINE};border-radius:999px;padding:3px 9px;white-space:nowrap;flex:none}
.tk-go{color:${C.faint};flex:none;display:grid;place-items:center}

/* details */
.ogd-details{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}
@media(max-width:560px){.ogd-details{grid-template-columns:1fr}}
.ogd-detail{display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:1px solid ${C.line2}}
.ogd-detail-k{font-size:12.5px;color:${C.muted};font-weight:600}
.ogd-detail-v{font-size:13.5px;color:${C.ink};font-weight:700;text-align:right}

.ogd-foot{display:flex;justify-content:center;margin-top:8px}

/* report view */
.ogd-reportwrap{max-width:980px;margin:0 auto;padding:16px 24px 64px}
.ogd-reportbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;position:sticky;top:0;
  z-index:5;background:${C.bg};padding:8px 0}
@media print{.ogd-reportwrap{padding:0}.ogd-reportbar{display:none}}
`;
