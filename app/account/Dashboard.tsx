"use client";

/**
 * Dashboard — the premium /account experience (2026 redesign).
 *
 * A calm, scannable control centre built on the saved assessment summary:
 *   · Hero      — archetype, strongest-interest ring, quick stats, actions
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

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";
import dynamic from "next/dynamic";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, SkillBar, RadarChart, type RadarDatum } from "@/app/account/viz";
// The full report is ~85KB of source behind a "Full report" click, and most
// dashboard visits never open it. Loading it on demand keeps that weight off
// the dashboard's own first paint.
const FullReport = dynamic(() => import("@/app/account/FullReport"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: "center", color: "#64748b", fontSize: 14 }}>Preparing your report…</div>
  ),
});
const FeaturesDetailPage = dynamic(() => import("@/app/account/features/FeaturesDetailPage"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: "center", color: "#64748b", fontSize: 14 }}>Loading feature…</div>
  ),
});
import { TOOLKIT_TABS } from "@/app/account/toolkitData";
import {
  archetype, actionPlan, domainFit,
  percentileOf, subTraits, resultOf, categoryDeepDive,
} from "@/lib/report/knowledge";
import StudyAbroad from "@/app/account/features/StudyAbroad";
import FeaturesHub from "@/app/account/FeaturesHub";

// Dashboard accent — OneGrasp red theme (white, black, grey, red #db3433).
const IN = "#db3433", IN_STRONG = "#b82a2b", IN_TINT = "#fef0f0", IN_LINE = "#f5d5d5";
// The same branded "eight dimensions" illustration used on the full report cover.
const DIMS8 = "https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";
// KPI tile accent colours (red / grey / grey-dark / black), matching OneGrasp design.
const KPI = [
  { c: "#db3433", t: "#fef0f0" },
  { c: "#6b7280", t: "#f3f4f6" },
  { c: "#374151", t: "#f9fafb" },
  { c: "#111827", t: "#f9fafb" },
];

// Left-sidebar navigation → scrolls to the matching section id.
const NAV = [
  { id: "dimensions", label: "8 Dimensions", icon: "radar" },
  { id: "overview", label: "Overview", icon: "clusters" },
  { id: "fields", label: "Best-fit Fields", icon: "compass" },
  { id: "mind", label: "How You Think", icon: "multiple_intelligence" },
  { id: "plan", label: "My Plan", icon: "check" },
  { id: "careers", label: "Career Library", icon: "briefcase" },
  { id: "study-abroad", label: "Study Abroad", icon: "signpost" },
  { id: "exams", label: "Entrance Exams", icon: "edit" },
  { id: "internships", label: "Internships", icon: "route" },
  { id: "financial", label: "Financial Literacy", icon: "card" },
  { id: "legal", label: "Legal Resources", icon: "shield" },
  { id: "research", label: "Research Opportunities", icon: "pulse" },
  { id: "startups", label: "Startup Ecosystem", icon: "flag" },
  { id: "resources", label: "Scholarships", icon: "star" },
];

// Career-toolkit (colleges/exams/internships/scholarships/careers) is
// temporarily disabled — flip to true to bring it back.
const SHOW_TOOLKIT = false;

const CANON = [
  "personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
  "learning_styles", "motivators", "strengths", "aptitude",
] as const;

const CAT_LABEL: Record<string, string> = {
  personality: "Personality", career_interest: "Career Interest", multiple_intelligence: "Multiple Intelligence",
  emotional_intelligence: "Emotional Intelligence", learning_styles: "Learning Style", motivators: "Motivators",
  strengths: "Strengths", aptitude: "Aptitude",
};

// Short forms for the dimension tile row — keeps all 8 tiles on one row
// without scrolling on desktop. The full name still shows in the detail
// panel below (via CAT_LABEL).
const DIM_TAB_LABEL: Record<string, string> = {
  personality: "Personality", career_interest: "Interests", multiple_intelligence: "Intelligence",
  emotional_intelligence: "EQ", learning_styles: "Learning", motivators: "Motivators",
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

/**
 * An extra section injected into the dashboard, with its own sidebar entry.
 *
 * The class 11-12 demo shows the same report class 9-10 students get, plus two
 * sections that only make sense there (wanted-vs-found, and the roadmaps). This
 * prop is how it adds them without forking 1,000 lines of dashboard that must
 * not drift apart. Omit it and the dashboard is exactly what it always was.
 */
export interface ExtraSection {
  id: string;
  label: string;
  icon: string;
  node: ReactNode;
  /** Render before this built-in section id; appended if omitted or unmatched. */
  before?: string;
  /**
   * Also render this section inside the in-depth "Full report", as its own
   * sheet. Without it a class 11-12 student who opened the full report found
   * the standard one, with no sign of the career they chose or the roadmap -
   * which is the whole reason the demo report exists.
   */
  inFullReport?: boolean;
  /** Variant used inside the full report, where sheet chrome replaces the card. */
  reportNode?: ReactNode;
}

export default function Dashboard({ a, profile, email, onSignOut, extraSections = [] }: { a: AssessmentSummary; profile?: UserProfile | null; email?: string | null; onSignOut?: () => void; extraSections?: ExtraSection[] }) {
  const [view, setView] = useState<"dashboard" | "report" | "feature">("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("dimensions");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [toolkitTab, setToolkitTab] = useState(TOOLKIT_TABS[0].id);
  const [dimKey, setDimKey] = useState<string>(() => {
    const top = (a.radar ?? []).slice().sort((x, y) => y.score - x.score)[0];
    return top?.key || CANON[0];
  });
  const [menuOpen, setMenuOpen] = useState(false);
  // Sidebar order must match render order, or the scroll-spy highlights the
  // wrong entry. Both are derived from the same list.
  const navItems = [
    ...NAV.flatMap((n) => [
      ...extraSections.filter((x) => x.before === n.id).map((x) => ({ id: x.id, label: x.label, icon: x.icon })),
      n,
    ]),
    // Anchored extras render before their section; the rest render after the
    // built-in ones, so they come LAST in the sidebar too. Listing them first
    // put "Your roadmap" above "8 Dimensions" while it rendered at the bottom,
    // which made the scroll-spy highlight the wrong entry the whole way down.
    ...extraSections
      .filter((x) => !x.before || !NAV.some((n) => n.id === x.before))
      .map((x) => ({ id: x.id, label: x.label, icon: x.icon })),
  ];
  // Extras anchored to a section, rendered wherever that section is. `before`
  // was documented as accepting any built-in id but only "dimensions" was
  // actually handled - anything else fell through to the end of the page while
  // the sidebar listed it in its anchored position, so the nav and the page
  // disagreed for every anchor but one.
  const extrasBefore = (id: string) =>
    extraSections
      .filter((x) => x.before === id)
      .map((x) => (
        <section key={x.id} id={x.id} className="ash-sec">{x.node}</section>
      ));
  const name = (profile?.name || "").trim();
  const first = name.split(/\s+/)[0] || "there";
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

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
    // Check if it's a feature ID
    const featureIds = ["careers", "study-abroad", "exams", "internships", "financial", "legal", "research", "startups", "resources"];
    if (featureIds.includes(id)) {
      setView("feature");
      setSelectedFeature(id);
      window.scrollTo(0, 0);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const radar: RadarDatum[] = useMemo(() => {
    const src = ((a.radar ?? []).length ? a.radar! : []).map((r) => ({ ...r, bench: BENCH[r.key] || 50 }));
    return CANON.map((k) => src.find((r) => r.key === k) ?? { key: k, label: CAT_LABEL[k], score: 0, bench: BENCH[k] || 50 });
  }, [a.radar]);

  // Coherent recommendation: blend interest + abilities + intelligences + values.
  const fits = domainFit(a);
  const topField = fits[0];
  const topDomainName = topField?.name ?? "your best-fit field";
  // NOT an "overall fit" percentage. There isn't one, and there can't be.
  // The top career's fitmentPct is 58 + 34 + 4 by construction and the top
  // domainFit is 40 + 48 — both are the ceiling of a display band, so every
  // student who ever took this saw the same ~96%. A number identical for
  // everyone measures nothing; showing it as a headline invited a confidence
  // the method cannot support.
  //
  // What IS real and does vary is how strongly the student scored their leading
  // interest cluster, so that is what the hero reports, named rather than
  // abstract.
  const topTheme = (a.themes ?? [])[0] ?? null;
  const topInterestScore = Math.round(topTheme?.score ?? 0);
  const topInterestName = topTheme?.title ?? "—";
  const arch = archetype(a);
  const code = a.riasecCode || (a.themes ?? []).slice(0, 3).map((t) => t.letter).join("");
  const strongest = radar.slice().sort((x, y) => y.score - x.score)[0];
  const plan = actionPlan(a, topDomainName);
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

  if (view === "feature") {
    return (
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {selectedFeature && <FeaturesDetailPage featureId={selectedFeature} onClose={() => { setView("dashboard"); window.scrollTo(0, 0); }} />}
      </div>
    );
  }

  if (view === "report") {
    return (
      <div className="ogd-reportwrap">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="ogd-reportbar og-noprint">
          <button className="ogd-btn ghost" onClick={() => { setView("dashboard"); window.scrollTo(0, 0); }}>
            <Icon name="chevronLeft" size={16} /> Back to dashboard
          </button>
          {/* No download here by design — the PDF is delivered by email, so the
              inbox holds the one canonical copy. See <ViewOnlyReport/>. */}
          <span className="ogd-mailnote">
            <Icon name="bell" size={14} /> A PDF copy has been emailed to you
          </span>
        </div>
        <FullReport
          a={a}
          name={name}
          extraSheets={extraSections
            .filter((x) => x.inFullReport)
            .map((x) => ({ id: x.id, kicker: x.label, node: x.reportNode ?? x.node }))}
        />
      </div>
    );
  }

  return (
    <div className="ash">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {navOpen && <div className="ash-scrim og-noprint" onClick={() => setNavOpen(false)} />}

      {/* ============================ SIDEBAR ============================ */}
      <aside className={`ash-side${navOpen ? " open" : ""} og-noprint`}>
        <div className="ash-brand"><Link href="/" style={{ textDecoration: "none" }}><Logo height={50} /></Link></div>
        <nav className="ash-nav">
          <div className="ash-nav-lbl">Menu</div>
          {navItems.map((n) => (
            <button key={n.id} className={`ash-navi${active === n.id ? " on" : ""}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={18} /><span>{n.label}</span>
            </button>
          ))}
          <div className="ash-nav-lbl">Report</div>
          <button className="ash-navi" onClick={() => setView("report")}><Icon name="explain" size={18} /><span>Full report</span></button>
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
            <div className="ash-top-h">Welcome back, {first}</div>
            <div className="ash-top-s">Here&apos;s your career assessment overview</div>
          </div>
          <div className="ash-top-actions">
            <div className="ash-user-wrap">
              <button className="ash-top-ava" onClick={() => setMenuOpen((o) => !o)} aria-label="Account">{initial}</button>
              {menuOpen && (
                <>
                  <div className="ash-menu-scrim" onClick={() => setMenuOpen(false)} />
                  <div className="ash-menu">
                    <div className="ash-menu-head">
                      <span className="ash-menu-ava">{initial}</span>
                      <div className="ash-menu-id">
                        <div className="ash-menu-n">{name || "You"}</div>
                        <div className="ash-menu-e">{email || profile?.email || ""}</div>
                      </div>
                    </div>
                    <div className="ash-menu-rows">
                      <MRow k="Phone" v={profile?.phone} />
                      <MRow k="School / College" v={profile?.institution} />
                      <MRow k="Desired career" v={profile?.desiredCareer} />
                      <MRow k="Category" v={profile?.category} />
                      <MRow k="Current status" v={profile?.clarity} />
                    </div>
                    {onSignOut ? (
                      <button className="ash-menu-signout" onClick={onSignOut}><Icon name="power" size={14} /> Sign out</button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="ash-main">
          <div className="ash-grid">
            <div className="ash-content">

              {extrasBefore("dimensions")}

              {/* ===== REPORT PREVIEW ===== */}
              <section id="report-preview" className="ash-sec">
                <div className="ogd-card report-preview-card">
                  <CardHead icon="explain" title="Your Career Report"
                    sub="Your personalized assessment results and detailed analysis." />
                  <div className="report-actions">
                    <button className="report-btn primary" onClick={() => setView("report")}>
                      <Icon name="explain" size={16} /> View Full Report
                    </button>
                    <button className="report-btn secondary" onClick={() => go("dimensions")}>
                      <Icon name="radar" size={16} /> View Assessment Details
                    </button>
                  </div>
                </div>
              </section>

              {/* ===== FEATURES HUB ===== */}
              <section id="careers" className="ash-sec" style={{paddingTop: 0, paddingBottom: 0, marginLeft: '-24px', marginRight: '-24px', paddingLeft: 0, paddingRight: 0}}>
                <div style={{background: 'linear-gradient(135deg, #f0e7ff 0%, #e8f4ff 100%)'}}>
                  {/* Hero Section */}
                  <div style={{display: 'flex', alignItems: 'center', padding: '80px 80px', gap: '80px', maxWidth: '100%', margin: '0 auto'}}>
                    <div style={{flex: 1}}>
                      <h2 style={{fontSize: '48px', fontWeight: '800', color: C.ink, margin: '0 0 16px 0', lineHeight: 1.2}}>
                        Explore Your Opportunities
                      </h2>
                      <p style={{fontSize: '18px', color: C.ink3, margin: 0, lineHeight: 1.6}}>
                        Discover pathways, resources and experiences aligned with your future. 500+ careers, 100+ universities, internships, research, finance, and more.
                      </p>
                      <div style={{width: '100px', height: '4px', background: IN, marginTop: '24px', borderRadius: '2px'}}></div>
                    </div>
                    <div style={{flex: 1, textAlign: 'center'}}>
                      <img src="https://onegrasp.com/wp-content/uploads/2026/08/69045c6d-9060-4669-8cc6-b8cf030a3f35.png" alt="Explore" style={{maxWidth: '100%', height: 'auto', maxHeight: '380px'}} />
                    </div>
                  </div>

                  {/* Features Grid with Background Images */}
                  <div style={{padding: '0 80px 80px', maxWidth: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px'}}>
                    {[
                      {id:'startups', title:'Startups', desc:'Connect with innovative founders and ideas.', color:'#ea580c', emoji:'🚀', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_39_45-AM.png)'},
                      {id:'research', title:'Research', desc:'Explore cutting-edge research programs.', color:'#0369a1', emoji:'🔬', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_40_43-AM.png)'},
                      {id:'financial', title:'Financial Literacy', desc:'Build practical money management skills.', color:'#16a34a', emoji:'₹', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_41_34-AM.png)'},
                      {id:'legal', title:'Law & Rights', desc:'Know your legal rights and protections.', color:'#7c3aed', emoji:'⚖️', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_42_40-AM.png)'},
                      {id:'careers', title:'Career Library', desc:'Explore 500+ careers with detailed paths.', color:'#2563eb', emoji:'🎓', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_49_20-AM.png)'},
                      {id:'study-abroad', title:'Study Abroad', desc:'Discover universities worldwide.', color:'#dc2626', emoji:'✈️', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_46_05-AM.png)'},
                      {id:'exams', title:'Entrance Exams', desc:'Explore exams and eligibility details.', color:'#9333ea', emoji:'📝', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_54_06-AM.png)'},
                      {id:'internships', title:'Internships', desc:'Gain real-world experience with top opportunities.', color:'#ca8a04', emoji:'💼', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-11_02_22-AM.png)'},
                      {id:'resources', title:'Scholarships', desc:'Fund your education with 200+ awards.', color:'#f59e0b', emoji:'🎓', bg:'url(https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_59_10-AM.png)'},
                    ].map((feature) => (
                      <div key={feature.id} onClick={() => go(feature.id)} style={{background:'#fff', borderRadius:'12px', border:`1px solid ${C.line}`, cursor:'pointer', transition:'all 250ms ease', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', overflow:'hidden', display:'flex', flexDirection:'column', height: '100%'}}>
                        <div style={{height:'160px', backgroundImage:feature.bg, backgroundSize:'cover', backgroundPosition:'center', position:'relative'}}>
                          <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.2) 100%)'}}></div>
                        </div>
                        <div style={{padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column'}}>
                          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px'}}>
                            <div style={{width:'44px', height:'44px', borderRadius:'50%', background:feature.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0}}>
                              {feature.emoji}
                            </div>
                            <h3 style={{fontSize:'16px', fontWeight:'700', color:C.ink, margin:0}}>{feature.title}</h3>
                          </div>
                          <p style={{fontSize:'13px', color:C.ink3, margin:'0 0 16px 0', lineHeight:1.5, flex:1}}>{feature.desc}</p>
                          <div style={{display:'flex', alignItems:'center', color:feature.color, fontSize:'14px', fontWeight:'600'}}>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ===== DIMENSIONS ===== */}
              <section id="dimensions" className="ash-sec" style={{display: 'none'}}>
                <div className="ogd-card">
                  <CardHead icon="radar" title="Your eight dimensions"
                    sub="Tap a dimension below to see its full breakdown — everything from your report, right here." />
                  <div className="ogd-dims8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={DIMS8} alt="The eight dimensions of your profile" loading="lazy" />
                  </div>
                  <div className="ogd-dimtabs">
                    {radar.map((d) => (
                      <button key={d.key} className={`ogd-dimtab${dimKey === d.key ? " on" : ""}`} onClick={() => setDimKey(d.key)} title={CAT_LABEL[d.key]}>
                        <span className="ogd-dimtab-ic"><Icon name={d.key} size={20} /></span>
                        <span className="ogd-dimtab-lab">
                          {d.score > 0 ? <span className="ogd-dimtab-check"><Icon name="check" size={10} stroke={2.4} /></span> : null}
                          {DIM_TAB_LABEL[d.key]}
                        </span>
                      </button>
                    ))}
                  </div>
                  <DimPanel d={radar.find((r) => r.key === dimKey) ?? radar[0]} a={a} />
                </div>
              </section>

              {extrasBefore("overview")}

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
                      <Ring value={topInterestScore} size={168} stroke={13} color={IN} track="rgba(255,255,255,0.14)">
                        <div className="ogd-ring-pct">{topInterestScore}<small>%</small></div>
                        <div className="ogd-ring-lab">{topInterestName}</div>
                      </Ring>
                    </div>
                  </div>
                </div>

                <div className="ogd-kpis">
                  <KpiTile icon="star" c={KPI[0]} label="Strongest interest" value={topInterestName}
                    sub={topTheme ? `${topInterestScore}% of your interest answers` : ""} subAccent />
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

              {extrasBefore("fields")}

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

              {extrasBefore("mind")}

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

              {extrasBefore("plan")}

              {/* ===== PLAN ===== */}
              <section id="plan" className="ash-sec">
                <GoalTracker plan={plan} storageKey={`og-goals-${a.completedAt}`} domain={topDomainName} />
              </section>

              {/* ===== CAREER TOOLKIT (in-dashboard listings) — temporarily disabled ===== */}
              {SHOW_TOOLKIT && (
                <section id="resources" className="ash-sec">
                  <Toolkit tab={toolkitTab} setTab={setToolkitTab} />
                </section>
              )}

              {/* Anything not anchored to a section lands here, at the end. */}
              {extraSections
                .filter((x) => !x.before || !NAV.some((n) => n.id === x.before))
                .map((x) => (
                  <section key={x.id} id={x.id} className="ash-sec">{x.node}</section>
                ))}

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
                <div className="rail-h">Your top match</div>
                <div className="rail-top-nm">{topField?.name || a.topCareer || "—"}</div>
                {topField?.tagline ? <div className="rail-top-tag">{topField.tagline}</div> : null}
                <div className="rail-top-fit">Drawn from your <b>{topInterestName}</b> answers</div>
              </div>

              <div className="ogd-card rail-card">
                <div className="rail-h">Interest strength</div>
                <Ring value={topInterestScore} size={100} stroke={8} color={IN}>
                  <div style={{fontSize:'24px', fontWeight:'800', color:C.ink}}>{topInterestScore}%</div>
                </Ring>
                <div style={{fontSize:'12px', color:C.ink3, textAlign:'center', marginTop:'8px'}}>{topInterestName}</div>
              </div>

              <div className="ogd-card rail-card">
                <div className="rail-h">Featured features</div>
                <div className="rail-feature">
                  <Icon name="lightbulb" size={18} style={{color:'#ff6b35'}} />
                  <div><div style={{fontSize:'12px', fontWeight:'700', color:C.ink}}>Startups</div><div style={{fontSize:'10px', color:C.ink3}}>12 opportunities</div></div>
                </div>
                <div className="rail-feature">
                  <Icon name="microscope" size={18} style={{color:'#004e89'}} />
                  <div><div style={{fontSize:'12px', fontWeight:'700', color:C.ink}}>Research</div><div style={{fontSize:'10px', color:C.ink3}}>12 programs</div></div>
                </div>
                <div className="rail-feature">
                  <Icon name="piggybank" size={18} style={{color:'#1e7b34'}} />
                  <div><div style={{fontSize:'12px', fontWeight:'700', color:C.ink}}>Finances</div><div style={{fontSize:'10px', color:C.ink3}}>12 courses</div></div>
                </div>
                <div className="rail-feature">
                  <Icon name="scale" size={18} style={{color:'#8b5a8e'}} />
                  <div><div style={{fontSize:'12px', fontWeight:'700', color:C.ink}}>Law & Rights</div><div style={{fontSize:'10px', color:C.ink3}}>12 resources</div></div>
                </div>
              </div>

              <div className="ogd-card rail-card">
                <div className="rail-h">Next steps</div>
                <button className="rail-act primary" onClick={() => setView("report")}><Icon name="explain" size={16} /> View report</button>
                <div className="rail-note"><Icon name="check" size={14} /> PDF emailed to you</div>
              </div>

              {SHOW_TOOLKIT && (
                <div className="ogd-card rail-card">
                  <div className="rail-h">Career toolkit</div>
                  <button className="rail-act" onClick={() => go("resources")}><Icon name="route" size={16} /> Explore toolkit</button>
                  <div className="rail-toolhint">Colleges · exams · internships · scholarships — more in your menu.</div>
                </div>
              )}
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

function MRow({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="ash-menu-row">
      <span>{k}</span><b>{v || "—"}</b>
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

/** The full breakdown for whichever dimension is active in the horizontal
 *  tab row above — score, benchmark, sub-traits, and the complete deep-dive
 *  (meaning, strengths, growth areas, recommended actions, next step). */
function DimPanel({ d, a }: { d: RadarDatum; a: AssessmentSummary }) {
  const dd = categoryDeepDive(d.key, a);
  const res = resultOf(d.key, a);
  const subs = subTraits(d.key, a);
  const pct = percentileOf(d.score);
  const bench = BENCH[d.key];
  const delta = Math.round(d.score - bench);
  return (
    <div className="ogd-dimpanel">
      <div className="ogd-dimpanel-top">
        <div className="ogd-dimpanel-head">
          <span className="ogd-dim-ic lg"><Icon name={d.key} size={20} /></span>
          <div>
            <div className="ogd-dimpanel-name">{CAT_LABEL[d.key]}</div>
            {res ? <span className="ogd-dim-result">{res.label}: <b>{res.value}</b></span> : null}
          </div>
        </div>
        <div className="ogd-dimpanel-score">
          <div className="ogd-dimpanel-num">{Math.round(d.score)}</div>
          <div className={`ogd-dim-delta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "+" : ""}{delta} vs. typical</div>
        </div>
      </div>
      <SkillBar value={d.score} color={IN} benchmark={bench} />
      <span className="ogd-dim-pct">Higher than {pct}% of students at your stage</span>

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

      <div className="ogd-dim-lists">
        {dd.strengths.length > 0 && (
          <div className="ogd-dim-list">
            <div className="ogd-dim-list-h good">Strengths</div>
            {dd.strengths.map((s, i) => <div className="ogd-dim-li" key={i}>{s}</div>)}
          </div>
        )}
        {dd.grow.length > 0 && (
          <div className="ogd-dim-list">
            <div className="ogd-dim-list-h">Areas to grow</div>
            {dd.grow.map((s, i) => <div className="ogd-dim-li" key={i}>{s}</div>)}
          </div>
        )}
        {dd.recommend.length > 0 && (
          <div className="ogd-dim-list">
            <div className="ogd-dim-list-h">Recommended actions</div>
            {dd.recommend.map((s, i) => <div className="ogd-dim-li" key={i}>{s}</div>)}
          </div>
        )}
      </div>

      {dd.next ? <div className="ogd-dim-next"><b>Next:</b> {dd.next}</div> : null}
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
.ash-navi.locked{cursor:not-allowed;color:${C.faint};opacity:.85}
.ash-navi.locked:hover{background:none}
.ash-navi.locked svg{color:${C.faint}}
.ash-navi-lock{margin-left:auto;color:${C.faint};display:grid;place-items:center}
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
.ash-grid{display:grid;grid-template-columns:1fr;gap:18px;max-width:1400px;margin:0 auto}
.ash-content{display:flex;flex-direction:column;gap:16px;min-width:0}
.ash-sec{scroll-margin-top:78px;display:flex;flex-direction:column;gap:16px}
.ash-banner{display:flex;align-items:center;gap:13px;background:#fff;border:1px solid ${C.line};border-radius:14px;padding:13px 18px;box-shadow:0 1px 2px rgba(20,20,25,.04)}
.ash-banner-ic{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;background:${C.goodTint};color:#1f7a55}
.ash-banner-t{flex:1;min-width:0;display:flex;flex-direction:column}
.ash-banner-t b{font-size:13.5px;font-weight:700;color:${C.ink}}
.ash-banner-t span{font-size:12.5px;color:${C.ink3}}
.ash-banner-a{display:flex;gap:8px;flex-wrap:wrap}
@media(max-width:560px){.ash-banner{flex-wrap:wrap}.ash-banner-a{width:100%}}
.ash-rail{display:none}

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
.rail-note{display:flex;align-items:flex-start;gap:8px;margin-top:10px;font-size:12px;line-height:1.45;color:${C.ink3};font-weight:600}
.rail-note svg{color:${C.muted};flex:none;margin-top:1px}
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

/* top-bar bell + avatar */
.ash-top-actions{display:flex;align-items:center;gap:14px}
.ash-bell{position:relative;width:40px;height:40px;border-radius:11px;display:grid;place-items:center;color:${C.ink2};background:#fff;border:1px solid ${C.line};cursor:pointer}
.ash-bell-dot{position:absolute;top:-5px;right:-5px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:${IN};color:#fff;font-size:10px;font-weight:800;font-style:normal;display:grid;place-items:center;border:2px solid #fff}
.ash-top-ava{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:${IN};color:#fff;font-weight:800;font-size:16px;cursor:pointer;border:none;font-family:inherit}
.ash-user-wrap{position:relative}
.ash-menu-scrim{position:fixed;inset:0;z-index:40}
.ash-menu{position:absolute;top:calc(100% + 10px);right:0;z-index:41;width:280px;background:#fff;border:1px solid ${C.line};
  border-radius:14px;box-shadow:0 18px 46px rgba(20,20,25,.16);padding:14px;animation:ashfade .14s ease}
@keyframes ashfade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.ash-menu-head{display:flex;align-items:center;gap:11px;padding-bottom:12px;border-bottom:1px solid ${C.line2}}
.ash-menu-ava{width:40px;height:40px;border-radius:50%;flex:none;display:grid;place-items:center;background:${IN};color:#fff;font-weight:800;font-size:16px}
.ash-menu-id{min-width:0}
.ash-menu-n{font-size:14px;font-weight:800;color:${C.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-menu-e{font-size:11.5px;color:${C.muted};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-menu-rows{padding:10px 0 4px}
.ash-menu-row{display:flex;justify-content:space-between;gap:12px;align-items:baseline;padding:7px 2px}
.ash-menu-row span{font-size:11.5px;color:${C.muted};flex:none}
.ash-menu-row b{font-size:12.5px;font-weight:700;color:${C.ink};text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-menu-signout{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;margin-top:8px;padding:10px;
  background:#fff;color:${C.redStrong};border:1px solid ${C.line};border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
.ash-menu-signout:hover{border-color:${C.redLine};background:${C.redTint}}

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

/* dimensions — horizontal tile row (icon + checkmark + label) + single detail panel */
.ogd-dims8{margin-bottom:18px;border:1px solid ${C.line};border-radius:14px;overflow:hidden;background:${C.bg};max-height:220px}
.ogd-dims8 img{width:100%;display:block;object-fit:cover;max-height:220px}
@media(max-width:640px){.ogd-dims8{max-height:150px}.ogd-dims8 img{max-height:150px}}
.ogd-dimtabs{display:flex;overflow-x:auto;margin-bottom:20px;border:1px solid ${C.line};border-radius:14px;background:${C.bg};scrollbar-width:thin}
.ogd-dimtab{flex:1 1 0;min-width:82px;display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 6px;
  background:none;border:none;border-right:1px solid ${C.line};cursor:pointer;font-family:inherit;transition:background .15s}
.ogd-dimtab:last-child{border-right:none}
.ogd-dimtab:hover{background:rgba(255,255,255,.6)}
.ogd-dimtab.on{background:#fff;box-shadow:inset 0 -3px 0 ${IN}}
.ogd-dimtab-ic{width:46px;height:46px;border-radius:50%;flex:none;display:grid;place-items:center;background:${IN_TINT};color:${IN};transition:background .15s,color .15s}
.ogd-dimtab.on .ogd-dimtab-ic{background:${IN};color:#fff}
.ogd-dimtab-lab{display:flex;align-items:center;gap:4px;font-size:11.5px;font-weight:700;color:${C.ink2};white-space:nowrap}
.ogd-dimtab.on .ogd-dimtab-lab{color:${C.ink}}
.ogd-dimtab-check{width:14px;height:14px;border-radius:50%;flex:none;display:grid;place-items:center;background:${C.good};color:#fff}
@media(max-width:700px){.ogd-dimtab{flex:none;min-width:92px}}

.ogd-dimpanel{border-top:1px solid ${C.line2};padding-top:16px;animation:ogdslide .2s ease}
@keyframes ogdslide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.ogd-dimpanel-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px}
.ogd-dimpanel-head{display:flex;align-items:center;gap:12px}
.ogd-dim-ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:${C.line2};color:${C.ink2}}
.ogd-dim-ic.lg{width:38px;height:38px;border-radius:11px}
.ogd-dimpanel-name{font-size:16px;font-weight:800;color:${C.ink};margin-bottom:4px}
.ogd-dimpanel-score{text-align:right;flex:none}
.ogd-dimpanel-num{font-size:24px;font-weight:800;color:${C.ink};line-height:1}
.ogd-dim-delta{font-size:11px;font-weight:700;margin-top:3px}
.ogd-dim-delta.up{color:${C.good}}
.ogd-dim-delta.down{color:${C.muted}}
.ogd-dim-result{display:inline-block;font-size:11.5px;font-weight:600;border-radius:999px;padding:4px 10px;background:${IN_TINT};color:${C.ink2}}
.ogd-dim-result b{color:${IN};font-weight:800}
.ogd-dim-pct{display:inline-block;font-size:11.5px;font-weight:600;color:${C.ink3};margin-top:9px}
.ogd-dim-text{font-size:13.5px;line-height:1.65;color:${C.ink2};max-width:72ch;margin-top:14px}
.ogd-dim-subs{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.ogd-dim-subrow{display:grid;grid-template-columns:130px 1fr 28px;align-items:center;gap:10px}
@media(max-width:560px){.ogd-dim-subrow{grid-template-columns:100px 1fr 26px}}
.ogd-dim-sublab{font-size:12px;color:${C.ink3};font-weight:600}
.ogd-dim-subval{font-size:12px;font-weight:700;text-align:right;color:${C.ink2}}
.ogd-dim-lists{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:18px}
@media(max-width:820px){.ogd-dim-lists{grid-template-columns:1fr}}
.ogd-dim-list-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:${C.muted};margin-bottom:8px}
.ogd-dim-list-h.good{color:${C.good}}
.ogd-dim-li{font-size:12.5px;line-height:1.55;color:${C.ink2};padding:6px 0;border-top:1px solid ${C.line2}}
.ogd-dim-li:first-child{border-top:none;padding-top:0}
.ogd-dim-next{margin-top:16px;padding:12px 14px;background:${C.bg};border:1px solid ${C.line};border-radius:11px;font-size:12.5px;color:${C.ink2}}
.ogd-dim-next b{color:${C.ink};font-weight:800}

/* how you think (small multiples) */
.ogd-mind{display:grid;grid-template-columns:1fr 1fr;gap:22px}
@media(max-width:560px){.ogd-mind{grid-template-columns:1fr}}
.ogd-minilist-h{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;color:${C.ink2};margin-bottom:12px}
.ogd-minirow{display:grid;grid-template-columns:148px 1fr;align-items:center;gap:10px;margin-bottom:9px}
@media(max-width:560px){.ogd-minirow{grid-template-columns:112px 1fr}}
.ogd-minilab{font-size:11.5px;color:${C.ink3};font-weight:600;line-height:1.3;white-space:normal;word-break:break-word}

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
.ogd-mailnote{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:${C.ink3};white-space:nowrap}
.ogd-mailnote svg{color:${C.muted}}
@media (max-width:560px){.ogd-mailnote{display:none}}
@media print{.ogd-reportwrap{padding:0;margin:0;max-width:none}.ogd-reportbar{display:none}}

/* Toolkit Features Grid */
.toolkit-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:12px}
@media(max-width:1000px){.toolkit-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:640px){.toolkit-grid{grid-template-columns:repeat(2,1fr)}}
.toolkit-card{display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px 18px;border:2px solid ${C.line};border-radius:14px;transition:all .2s;cursor:pointer;background:#fff}
.toolkit-card:hover{border-color:${IN};box-shadow:0 8px 24px rgba(${IN.replace('#','')},0.12);transform:translateY(-2px)}
.toolkit-card.startups{border-top-color:#ff6b35}
.toolkit-card.research{border-top-color:#004e89}
.toolkit-card.finance{border-top-color:#1e7b34}
.toolkit-card.law{border-top-color:#8b5a8e}
.toolkit-card.colleges{border-top-color:#6366f1}
.toolkit-card.universities{border-top-color:#db2777}
.toolkit-card.exams{border-top-color:#f59e0b}
.toolkit-card.internships{border-top-color:#10b981}
.toolkit-icon{width:56px;height:56px;border-radius:12px;display:grid;place-items:center;margin-bottom:12px;font-weight:600}
.toolkit-card.startups .toolkit-icon{background:#ff6b35;color:#fff;opacity:.15}
.toolkit-card.research .toolkit-icon{background:#004e89;color:#fff;opacity:.15}
.toolkit-card.finance .toolkit-icon{background:#1e7b34;color:#fff;opacity:.15}
.toolkit-card.law .toolkit-icon{background:#8b5a8e;color:#fff;opacity:.15}
.toolkit-card.colleges .toolkit-icon{background:#6366f1;color:#fff;opacity:.15}
.toolkit-card.universities .toolkit-icon{background:#db2777;color:#fff;opacity:.15}
.toolkit-card.exams .toolkit-icon{background:#f59e0b;color:#fff;opacity:.15}
.toolkit-card.internships .toolkit-icon{background:#10b981;color:#fff;opacity:.15}
.toolkit-card h3{font-size:15px;font-weight:800;color:${C.ink};margin:0 0 6px;letter-spacing:-.01em}
.toolkit-card p{font-size:12px;color:${C.ink2};margin:0 0 12px;line-height:1.4}
.toolkit-count{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:${IN};background:${IN}15;padding:4px 10px;border-radius:6px}

/* Report Preview */
.report-preview-card{background:linear-gradient(135deg, ${C.surface} 0%, #f5f3ff 100%);border:2px solid ${IN_LINE}}
.report-actions{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}
.report-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;font-size:13.5px;font-weight:700;border-radius:10px;border:1px solid;transition:all .2s;cursor:pointer;font-family:inherit}
.report-btn.primary{background:${IN};color:#fff;border-color:${IN}}
.report-btn.primary:hover{background:${IN_STRONG};border-color:${IN_STRONG}}
.report-btn.secondary{background:#fff;color:${IN};border-color:${IN_LINE}}
.report-btn.secondary:hover{background:${IN_TINT};border-color:${IN}}

/* Improve text contrast */
.ash-top-s{color:${C.ink2}!important}
.ogd-arch-tag{color:${C.ink2}!important}
.ogd-cardhead p{color:${C.ink2}!important}

/* Sidebar branding size */
.ash-brand{padding:24px 22px 20px}

/* Right Rail Features */
.rail-feature{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid ${C.line2};align-items:flex-start}
.rail-feature:last-child{border-bottom:none}
.rail-feature svg{flex:none;margin-top:2px}
`;
