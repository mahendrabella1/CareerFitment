"use client";

/**
 * Dashboard - the student's /account home, for every class group.
 *
 * Laid out like the feature pages (components/feature/*): a grouped menu on
 * the left (features first), a top bar with a greeting and a search over
 * results and tools, then:
 *   · Toolkit    - "your report is ready" with the report button, then every
 *                  feature as a tile with its 3D illustration and progress
 *   · Overview   - the profile hero (archetype, strongest interest, key
 *                  numbers), OneGrasp's tools, profile bars and the radar
 *   · Dimensions - the eight dimensions as tabs, one full breakdown at a time
 *   · Fields     - ranked best-fit fields
 *   · Mind       - how you think & work
 *   · Plan       - the 30/90-day checklist
 *
 * Warm off-white surfaces, ink text and buttons, hairline borders, small
 * corners; OneGrasp red only for "you are here" marks and the radar. The
 * in-depth report lives in <FullReport/> ("Open my full report") and keeps
 * its own styles (LEGACY_CSS).
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, type AssessmentSummary, type CustomDimension, type UserProfile } from "@/lib/auth/AuthProvider";
import { readGoals, saveGoals } from "@/lib/progress/progressStore";
import { dayKey } from "@/lib/progress/activity";
import { tasksDone, type FeatureTaskSpec } from "@/lib/progress/featureTasks";
import { FEATURES, featureArt } from "@/lib/features/catalog";
import { FeatureSearch, type SearchItem } from "@/components/feature/FeatureSearch";
import { FP_CSS } from "@/components/feature/styles";
import { SchoolInbox } from "@/components/SchoolInbox";
import { Logo } from "@/app/Logo";
import dynamic from "next/dynamic";
import { Icon } from "@/app/Icons";
import { categoryLabel } from "@/lib/auth/formOptions";
import { C, Ring, SkillBar, dimColor, type RadarDatum } from "@/app/account/viz";
import { prepareStudentReport } from "@/lib/report/prepareStudentReport";
import { ReportBook } from "@/components/report/ReportBook";
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

// Dashboard accent - OneGrasp red theme (white, black, grey, red #db3433).
const IN = "#db3433", IN_STRONG = "#b82a2b", IN_TINT = "#fef0f0", IN_LINE = "#f5d5d5";
// Ink for bars and buttons on the dashboard view; red stays for "you are here" marks.
const INK = "#16181d";
// The same branded "eight dimensions" illustration used on the full report cover.
const DIMS8 = "https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";
// KPI tile accent colours (red / grey / grey-dark / black), matching OneGrasp design.
const KPI = [
  { c: "#db3433", t: "#fef0f0" },
  { c: "#6b7280", t: "#f3f4f6" },
  { c: "#374151", t: "#f9fafb" },
  { c: "#111827", t: "#f9fafb" },
];

// Left-sidebar navigation, in groups - the features first, as on the page.
// "Your results" entries scroll to their section (in this order on the page,
// so the scroll-spy matches); the rest open their own page (FEATURE_ROUTES).
// `art` is a feature's 3D illustration.
const RESULTS = "Your results";
const NAV: { id: string; label: string; icon: string; group: string; art?: string }[] = [
  { id: "overview", label: "Your profile", icon: "clusters", group: RESULTS },
  { id: "dimensions", label: "8 Dimensions", icon: "radar", group: RESULTS },
  { id: "fields", label: "Best-fit fields", icon: "compass", group: RESULTS },
  { id: "mind", label: "How you think", icon: "multiple_intelligence", group: RESULTS },
  { id: "plan", label: "My plan", icon: "check", group: RESULTS },
  { id: "progress", label: "My Progress", icon: "score", group: "Track", art: "progress" },
  { id: "certificates", label: "Certificates", icon: "award", group: "Track" },
  { id: "careers", label: "Career Library", icon: "briefcase", group: "Explore", art: "careers" },
  { id: "exams", label: "Entrance Exams", icon: "edit", group: "Explore", art: "exams" },
  { id: "resources", label: "Scholarships", icon: "star", group: "Explore", art: "scholarships" },
  { id: "study-abroad", label: "Study Abroad", icon: "signpost", group: "Explore", art: "study-abroad" },
  { id: "internships", label: "Internships", icon: "route", group: "Explore", art: "internships" },
  { id: "jobs", label: "Jobs", icon: "briefcase", group: "Explore" },
  { id: "financial", label: "Financial Literacy", icon: "card", group: "Explore", art: "money" },
  { id: "legal", label: "Law & Rights", icon: "shield", group: "Explore", art: "legal" },
  { id: "research", label: "Research", icon: "pulse", group: "Explore", art: "research" },
  { id: "startups", label: "Startups", icon: "flag", group: "Explore", art: "startups" },
  { id: "ai", label: "AI & Certifications", icon: "cpu", group: "Explore", art: "ai" },
  { id: "portfolio", label: "Build your website", icon: "user", group: "Create" },
];
const NAV_GROUPS = ["Explore", RESULTS, "Track", "Create"];

/** The toolkit at the top of the dashboard: every feature with its 3D
 *  illustration (lib/features/catalog.ts), then jobs, progress and the
 *  website builder - 12 tiles, so the grid fills evenly at 4, 3, 2 or 1 columns. */
const TOOLKIT: { key: string; text: string; href?: string; title?: string; photo?: string; icon?: string }[] = [
  { key: "careers", text: "930 careers - what they do and pay." },
  { key: "exams", text: "Every exam, who can take it, when." },
  { key: "scholarships", text: "Money you qualify for, with deadlines." },
  { key: "study-abroad", text: "Where, what - and does the money work." },
  { key: "internships", text: "Free programmes from real companies." },
  { key: "jobs", title: "Jobs", href: "/account/jobs", photo: "/jobs/hero-800.webp", text: "Fresh internships and fresher jobs." },
  { key: "money", text: "Money skills as a level path and games." },
  { key: "legal", text: "Rights, helplines, ready-made letters." },
  { key: "research", text: "From a question to a conference talk." },
  { key: "startups", text: "Build a startup, lesson by lesson." },
  { key: "progress", text: "Every lesson done and still to do." },
  { key: "portfolio", title: "Build your website", href: "/account/portfolio", icon: "user", text: "Your own portfolio site in minutes." },
];

/** Everything the dashboard opens - features, tools, the report - opens in a
 *  new tab, so this tab always stays on the dashboard. */
const NEW_TAB = { target: "_blank", rel: "noopener" } as const;
/** The full report has its own address so it can open in a tab of its own. */
const REPORT_HREF = "/account?view=report";
const openInNewTab = (href: string) => window.open(href, "_blank", "noopener");

// Left-panel features -> their pages.
const FEATURE_ROUTES: Record<string, string> = {
  "careers": "/account/career-library",
  "study-abroad": "/account/study-abroad",
  "exams": "/account/exams",
  "internships": "/account/internships-new",
  "jobs": "/account/jobs",
  "financial": "/account/money",
  "legal": "/account/legal",
  "research": "/account/research",
  "startups": "/account/startups",
  "resources": "/account/scholarships",
  "portfolio": "/account/portfolio",
  "progress": "/account/progress",
  "certificates": "/account/certificates",
  "ai": "/account/ai",
};

// Career-toolkit (colleges/exams/internships/scholarships/careers) is
// temporarily disabled - flip to true to bring it back.
const SHOW_TOOLKIT = false;

/** OneGrasp's signature tools - found through the dashboard search (no cards on the page). */
const SIGNATURE = [
  { href: "/account/gps", icon: "compass", title: "Career GPS", text: "Three small missions a week, picked for you. Keep your streak going." },
  { href: "/account/test-drive", icon: "play", title: "Career Test-Drive", text: "Live a day in a career - five real moments - before you choose it." },
  { href: "/account/decision-room", icon: "signpost", title: "Family Decision Room", text: "Compare two paths side by side with facts, and decide with your parents." },
  { href: "/account/passport", icon: "award", title: "Career Passport", text: "Projects, certificates and wins with proof - verified by your school." },
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

// Short forms for the dimension tile row - keeps all 8 tiles on one row
// without scrolling on desktop. The full name still shows in the detail
// panel below (via CAT_LABEL).
const DIM_TAB_LABEL: Record<string, string> = {
  personality: "Personality", career_interest: "Interests", multiple_intelligence: "Intelligence",
  emotional_intelligence: "EQ", learning_styles: "Learning", motivators: "Motivators",
  strengths: "Strengths", aptitude: "Aptitude",
};

// "Typical student at your stage" markers - presentational benchmark only,
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

export default function Dashboard({ a: savedSummary, profile, email, onSignOut, extraSections = [] }: { a: AssessmentSummary; profile?: UserProfile | null; email?: string | null; onSignOut?: () => void; extraSections?: ExtraSection[] }) {
  // Classes 6-8, 11-12 and Graduates store their scorer's raw output; the
  // dashboard reads the same adapted summary as the report
  // (lib/report/prepareStudentReport.ts), or every number would show as 0.
  // `stale` = saved by an earlier version of the assessment: no usable scores.
  const prepared = useMemo(() => prepareStudentReport(savedSummary, { sheets: false }), [savedSummary]);
  const a = prepared.summary;
  // Opened from REPORT_HREF: this tab is the report's own.
  const [reportTab] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "report");
  const [view, setView] = useState<"dashboard" | "report" | "feature">(reportTab ? "report" : "dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("overview");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [toolkitTab, setToolkitTab] = useState(TOOLKIT_TABS[0].id);
  const [dimKey, setDimKey] = useState<string>(() => {
    const top = (a.radar ?? []).slice().sort((x, y) => y.score - x.score)[0];
    return top?.key || CANON[0];
  });
  const [menuOpen, setMenuOpen] = useState(false);
  // Every feature's task list (/api/progress/tasks, a small file built once on
  // the server) for the toolkit's progress bars - lessons finished + tools used.
  const [taskSpecs, setTaskSpecs] = useState<FeatureTaskSpec[] | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/progress/tasks").then((r) => (r.ok ? r.json() : null)).then((d) => { if (live && Array.isArray(d)) setTaskSpecs(d); }).catch(() => undefined);
    return () => { live = false; };
  }, []);
  // Sidebar order must match render order, or the scroll-spy highlights the
  // wrong entry. Both are derived from the same list.
  const navItems: { id: string; label: string; icon: string; group: string; art?: string }[] = [
    ...NAV.flatMap((n) => [
      ...extraSections.filter((x) => x.before === n.id).map((x) => ({ id: x.id, label: x.label, icon: x.icon, group: RESULTS })),
      n,
    ]),
    // Anchored extras render before their section; the rest render after the
    // built-in ones, so they come LAST in the sidebar too. Listing them first
    // put "Your roadmap" above "8 Dimensions" while it rendered at the bottom,
    // which made the scroll-spy highlight the wrong entry the whole way down.
    ...extraSections
      .filter((x) => !x.before || !NAV.some((n) => n.id === x.before))
      .map((x) => ({ id: x.id, label: x.label, icon: x.icon, group: RESULTS })),
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
        <section key={x.id} id={x.id} className="db-sec">{x.node}</section>
      ));
  const name = (profile?.name || "").trim();
  const first = name.split(/\s+/)[0] || "there";
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  // Highlight the sidebar item for whichever section is in view.
  useEffect(() => {
    if (view !== "dashboard") return;
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".db-sec[id]"));
    if (!secs.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => { const vis = es.filter((e) => e.isIntersecting).sort((x, y) => y.intersectionRatio - x.intersectionRatio)[0]; if (vis) setActive(vis.target.id); },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [view]);

  // Features open in other tabs, so re-read the profile when the student comes
  // back to this one - lessons done or a retake there show up here.
  const { refreshProfile } = useAuth();
  useEffect(() => {
    let last = Date.now();
    const onShow = () => {
      if (document.visibilityState !== "visible" || Date.now() - last < 15000) return;
      last = Date.now();
      void refreshProfile();
    };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [refreshProfile]);

  // Result sections scroll within the dashboard; features are links (NEW_TAB).
  const go = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // The report's own tab closes back to the dashboard tab. If the browser
  // won't close it, it turns into the dashboard instead.
  const backToDashboard = () => {
    if (reportTab) window.close();
    if (window.location.search) window.history.replaceState(null, "", "/account");
    setView("dashboard");
    window.scrollTo(0, 0);
  };

  // Graduates (UG) supply their own 8 pillar dimensions (customDimensions);
  // every other class keeps the fixed categories.
  const customDims = useMemo(() => new Map((a.customDimensions ?? []).map((d) => [d.key, d])), [a.customDimensions]);
  const radar: RadarDatum[] = useMemo(() => {
    if ((a.customDimensions ?? []).length) return a.customDimensions!.map((d) => ({ key: d.key, label: d.label, score: d.score, bench: 50 }));
    const src = ((a.radar ?? []).length ? a.radar! : []).map((r) => ({ ...r, bench: BENCH[r.key] || 50 }));
    return CANON.map((k) => src.find((r) => r.key === k) ?? { key: k, label: CAT_LABEL[k], score: 0, bench: BENCH[k] || 50 });
  }, [a.radar, a.customDimensions]);
  const activeCustom = customDims.get(dimKey) ?? customDims.get(radar[0]?.key);

  // Coherent recommendation: blend interest + abilities + intelligences + values.
  // Graduates rank their own career clusters (adaptGraduate.ts); the shared
  // 15-domain domainFit() can't read that data and would show every UG
  // student the same fields. Every other class is unchanged.
  const fits: { name: string; fit: number; tagline: string; why: string }[] = a.customFields?.length ? a.customFields : domainFit(a);
  const topField = fits[0];
  const topDomainName = topField?.name ?? "your best-fit field";
  // NOT an "overall fit" percentage. There isn't one, and there can't be.
  // The top career's fitmentPct is 58 + 34 + 4 by construction and the top
  // domainFit is 40 + 48 - both are the ceiling of a display band, so every
  // student who ever took this saw the same ~96%. A number identical for
  // everyone measures nothing; showing it as a headline invited a confidence
  // the method cannot support.
  //
  // What IS real and does vary is how strongly the student scored their leading
  // interest cluster, so that is what the hero reports, named rather than
  // abstract.
  const topTheme = (a.themes ?? [])[0] ?? null;
  const topInterestScore = Math.round(topTheme?.score ?? 0);
  const topInterestName = topTheme?.title ?? "-";
  const arch = archetype(a);
  const code = a.riasecCode || (a.themes ?? []).slice(0, 3).map((t) => t.letter).join("");
  const strongest = radar.slice().sort((x, y) => y.score - x.score)[0];
  // A result with no usable scores (an earlier assessment version) gets a
  // plain notice on the dashboard instead of every number drawn as 0.
  const hasScores = !prepared.stale && radar.some((r) => r.score > 0);
  const hasMind = [a.topIntelligences, a.topAptitudes, a.topValues, a.learningStyles].some((l) => (l ?? []).length > 0);
  // Menu and search list only the result sections actually on the page.
  const shown = (n: { id: string; group: string }) =>
    n.group !== RESULTS || (hasScores ? n.id !== "mind" || hasMind : n.id === "overview");
  const plan = actionPlan(a, topDomainName);
  const scoreOf = (k: string) => radar.find((r) => r.key === k)?.score ?? 0;
  const pbars = customDims.size
    ? [
        { label: "Human & Professional Skills", score: scoreOf("ug_human_professional_skills"), c: KPI[0].c },
        { label: "Digital & Future Skills", score: scoreOf("ug_digital_future_skills"), c: KPI[1].c },
        { label: "Career Readiness", score: scoreOf("ug_career_readiness"), c: KPI[2].c },
      ]
    : [
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
        <style dangerouslySetInnerHTML={{ __html: LEGACY_CSS }} />
        {selectedFeature && <FeaturesDetailPage featureId={selectedFeature} onClose={() => { setView("dashboard"); window.scrollTo(0, 0); }} />}
      </div>
    );
  }

  if (view === "report") {
    // The same per-class adaptation every report screen uses
    // (lib/report/prepareStudentReport.ts): a stale report (saved by an
    // earlier version of the assessment) is shown as "needs a refresh"
    // rather than rendered with numbers the current scoring can't explain.
    const rep = prepareStudentReport(savedSummary);

    return (
      <div className="ogd-reportwrap">
        <style dangerouslySetInnerHTML={{ __html: LEGACY_CSS }} />
        <div className="ogd-reportbar og-noprint">
          <button className="ogd-btn ghost" onClick={backToDashboard}>
            <Icon name="chevronLeft" size={16} /> Back to dashboard
          </button>
          <span className="ogd-mailnote">
            <Icon name="bell" size={14} /> A PDF copy has been emailed to you
          </span>
        </div>

        {rep.stale ? (
          <div style={{ maxWidth: 560, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#141417", marginBottom: 10 }}>
              Your report needs a quick refresh
            </h2>
            <p style={{ fontSize: 14, color: "#63636f", lineHeight: 1.6, marginBottom: 20 }}>
              This report was generated by an earlier version of the assessment. Retake the assessment
              to see your updated report with the current question set and scoring.
            </p>
            <button className="ogd-btn solid" onClick={backToDashboard}>
              Back to dashboard
            </button>
          </div>
        ) : (
          // Every class (6, 7, 8, 9-10, 11-12) shares the exact same
          // FullReport - each class-specific engine's own score data is
          // adapted into the same AssessmentSummary shape 9-10 uses, so the
          // report is genuinely identical (same code, CSS, images) rather
          // than a separately designed report per class that drifts from it.
          // Read as a book - one sheet at a time with a page turn - or as the
          // long page ("Scroll view"); the report itself is the same either way.
          <ReportBook stickBelow=".ogd-reportbar" resumeKey={savedSummary.completedAt}>
            <FullReport
              a={rep.summary}
              name={name}
              institution={profile?.institution || undefined}
              studentClass={profile?.category ? categoryLabel(profile.category) : undefined}
              hideCareerFitSections={rep.hideCareerFitSections}
              extraSheets={[
                ...rep.extraSheets,
                ...extraSections
                  .filter((x) => x.inFullReport)
                  .map((x) => ({ id: x.id, kicker: x.label, node: x.reportNode ?? x.node })),
              ]}
            />
          </ReportBook>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------ dashboard view
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const classLabel = profile?.category ? categoryLabel(profile.category) : "";
  const openReport = () => openInNewTab(REPORT_HREF);
  const themes3 = (a.themes ?? []).slice(0, 3);
  // Some class adapters start the summary with the student's name, which is
  // saved empty - so it can begin ", you're a..." Trim that and capitalise.
  const heroRaw = (a.summary || arch.tagline || "").replace(/^[\s,;:-]+/, "");
  const heroLine = heroRaw.charAt(0).toUpperCase() + heroRaw.slice(1);
  const eiResult = resultOf("emotional_intelligence", a)?.value;

  // The student's own progress across the feature courses and days active
  // (lib/progress) - the full breakdown lives on /account/progress.
  const courses = profile?.progress?.courses ?? {};
  const lessonsDone = Object.values(courses).reduce((n, c) => n + (c?.done?.length ?? 0), 0);
  const byDay = profile?.activity?.byDay ?? {};
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if ((byDay[dayKey(d)] ?? 0) >= 60) streak++;
    else if (i > 0) break;
  }
  const courseKey: Record<string, string> = { money: "money", legal: "legal", exams: "exams", scholarships: "scholarships", "study-abroad": "study-abroad", research: "research" };
  const visited = profile?.progress?.visited;
  const toolsUsedAll = (taskSpecs ?? []).reduce((n, s) => n + tasksDone(s, visited?.[s.area]).done.size, 0);

  const search: SearchItem[] = [
    ...navItems.filter((n) => n.group === RESULTS && shown(n)).map((n) => ({ label: n.label, kind: "Section", onSelect: () => go(n.id) })),
    { label: "Full report", kind: "Report", hint: "Every page of your assessment", onSelect: openReport },
    ...TOOLKIT.map((t) => ({ label: t.title ?? FEATURES[t.key].title, kind: "Feature", hint: t.text, href: t.href ?? FEATURES[t.key].href, newTab: true })),
    ...SIGNATURE.map((s) => ({ label: s.title, kind: "Tool", hint: s.text, href: s.href, newTab: true })),
    { label: "My certificates", kind: "Page", hint: "Finish a course, get a certificate to share", href: "/account/certificates", newTab: true },
    { label: FEATURES.ai.title, kind: "Feature", hint: "Free AI courses with free certificates, and AI tools", href: FEATURES.ai.href, newTab: true },
    ...fits.slice(0, 3).map((f) => ({ label: f.name, kind: "Best-fit field", onSelect: () => go("fields") })),
  ];

  return (
    <div className="db">
      <style dangerouslySetInnerHTML={{ __html: DASH_CSS + FP_CSS }} />
      {navOpen && <div className="db-scrim og-noprint" onClick={() => setNavOpen(false)} />}

      {/* ============================ SIDEBAR ============================ */}
      <aside className={`db-side${navOpen ? " open" : ""} og-noprint`} aria-label="Dashboard menu">
        <div className="db-brand"><Link href="/" {...NEW_TAB} style={{ textDecoration: "none" }}><Logo height={42} /></Link></div>
        <div className="db-me">
          <span className="db-ava">{initial}</span>
          <div style={{ minWidth: 0 }}><b>{name || "You"}</b><small>{classLabel || email}</small></div>
        </div>
        <nav className="db-nav">
          {NAV_GROUPS.map((g) => (
            <div key={g}>
              <div className="db-nav-lbl">{g}</div>
              {navItems.filter((n) => n.group === g && shown(n)).map((n) => {
                const inner = (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {n.art ? <img src={featureArt(n.art).thumb} alt="" /> : <Icon name={n.icon} size={17} />}
                    <span>{n.label}</span>
                  </>
                );
                return FEATURE_ROUTES[n.id] ? (
                  <Link key={n.id} href={FEATURE_ROUTES[n.id]} {...NEW_TAB} className="db-navi" onClick={() => setNavOpen(false)}>{inner}</Link>
                ) : (
                  <button key={n.id} className={`db-navi${active === n.id ? " on" : ""}`} onClick={() => go(n.id)} aria-current={active === n.id ? "true" : undefined}>{inner}</button>
                );
              })}
            </div>
          ))}
        </nav>
        {onSignOut ? <div className="db-side-foot"><button className="db-signout" onClick={onSignOut}><Icon name="power" size={14} /> Sign out</button></div> : null}
      </aside>

      {/* ============================ BODY ============================ */}
      <div className="db-body">
        <header className="db-top og-noprint">
          <button className="db-burger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu"><Icon name="menu" size={18} /></button>
          <div className="db-hello">
            <b>{greeting}, {first}</b>
            <small>{today}{classLabel ? ` · ${classLabel}` : ""}</small>
          </div>
          <div className="db-top-search"><FeatureSearch items={search} placeholder="Search your results, features and tools" /></div>
          <div className="db-top-r">
            <Link href="/account/progress" {...NEW_TAB} className="db-topbtn"><Icon name="score" size={15} /><span>My progress</span></Link>
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
                      <MRow k="Class" v={classLabel} />
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

        <main className="db-main">
          <div className="db-wrap">
            <div className="db-msearch og-noprint"><FeatureSearch items={search} placeholder="Search your results and tools" /></div>
            {/* Messages from the student's school, if it uses the institution portal (renders nothing otherwise). */}
            <SchoolInbox />

            {/* ===== REPORT + TOOLKIT - first thing on the page ===== */}
            <section id="toolkit" className="db-sec db-first">
              <div className="db-report">
                <div style={{ minWidth: 0 }}>
                  <span className="db-kicker">Your career report{dateStr ? ` · ${dateStr}` : ""}</span>
                  <b>Your report is ready, {first}.</b>
                  <small>Every page of your assessment - your profile, best-fit careers and the plan. A PDF copy is in your email.</small>
                </div>
                <div className="db-report-a">
                  <Link href={REPORT_HREF} {...NEW_TAB} className="db-btn pri">Open my full report <Icon name="arrowRight" size={16} stroke={2} /></Link>
                  <button className="db-btn" onClick={() => go("overview")}>See my profile</button>
                </div>
              </div>

              <div className="db-sec-h" style={{ marginTop: 28 }}>
                <div><h2>Your toolkit</h2><p>Everything OneGrasp gives you - pick up where you left off.</p></div>
                <Link href="/account/progress" {...NEW_TAB} className="db-more" style={{ marginTop: 0 }}>See my progress <Icon name="arrowRight" size={14} stroke={2} /></Link>
              </div>
              <div className="db-kit">
                {/* The newest feature, across the whole row above the twelve tiles. */}
                <Link href={FEATURES.ai.href} {...NEW_TAB} className="db-kit-new">
                  <span className="db-kit-art">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featureArt("ai").card} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="db-kit-b">
                    <span className="db-new">New</span>
                    <b>{FEATURES.ai.title}</b>
                    <small>Free AI courses that end in a real certificate - YUVA AI for All, Harvard, Google, IBM, Kaggle - and AI tools rated for your age.</small>
                  </span>
                  <span className="db-btn pri" aria-hidden="true">Explore <Icon name="arrowRight" size={15} stroke={2} /></span>
                </Link>
                {TOOLKIT.map((t) => {
                  const f = FEATURES[t.key];
                  // Lessons finished + tools used - the same count as My Progress.
                  const c = courseKey[t.key] ? courses[courseKey[t.key]] : undefined;
                  const spec = taskSpecs?.find((s) => s.key === t.key);
                  const toolsUsed = spec ? tasksDone(spec, visited?.[spec.area]).done.size : 0;
                  const total = (spec?.lessons ?? c?.total ?? 0) + (spec?.tasks.length ?? 0);
                  const done = (c?.done?.length ?? 0) + toolsUsed;
                  const pct = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <Link key={t.key} href={t.href ?? f.href} {...NEW_TAB}>
                      <span className={`db-kit-art${t.photo ? " is-photo" : ""}`}>
                        {t.icon
                          ? <Icon name={t.icon} size={52} stroke={1.3} />
                          // eslint-disable-next-line @next/next/no-img-element
                          : <img src={t.photo ?? featureArt(t.key).card} alt="" loading="lazy" decoding="async" />}
                      </span>
                      <span className="db-kit-b">
                        <b>{t.title ?? f.title}</b>
                        <small>{t.text}</small>
                        {total > 0 && done > 0 && <span className="db-kit-p"><i><b style={{ width: `${pct}%` }} /></i>{pct}%</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {hasScores ? (<>
            {extrasBefore("overview")}

            {/* ===== OVERVIEW ===== */}
            <section id="overview" className="db-sec">
              <div className="db-hero">
                <div className="db-hero-l">
                  <span className="db-kicker">Your career profile{dateStr ? ` · ${dateStr}` : ""}</span>
                  <h1>{arch.name}</h1>
                  <p className="db-hero-tag">{heroLine}</p>
                  <div className="db-chips">
                    {code ? <span><b>{code}</b> interest code</span> : null}
                    {topField ? <span>Top field: <b>{topField.name}</b></span> : null}
                    {a.topCareer ? <span>Best fit: <b>{a.topCareer}</b></span> : null}
                  </div>
                  <div className="db-actions">
                    <button className="db-btn" onClick={() => go("fields")}>See best-fit fields</button>
                    <button className="db-btn" onClick={() => go("dimensions")}>All 8 dimensions</button>
                  </div>
                </div>
                <div className="db-hero-r">
                  <span className="db-kicker">Strongest interest</span>
                  <div className="db-big">{topInterestScore}<small>%</small></div>
                  <div className="db-big-l">{topInterestName}</div>
                  <div className="db-big-s">of your interest answers lean this way</div>
                  {themes3.length > 0 && (
                    <div className="db-themes">
                      {themes3.map((t) => (
                        <div className="db-theme" key={t.title}>
                          <span>{t.title}</span>
                          <SkillBar value={t.score} color={INK} height={6} track="#ece9e3" />
                          <b>{Math.round(t.score)}</b>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="db-stats">
                  <div className="db-stat"><span>Interest code</span><b>{code || "-"}</b><small>From your career interests</small></div>
                  <div className="db-stat"><span>Strongest area</span><b>{strongest ? Math.round(strongest.score) : "-"}</b><small>{strongest ? (CAT_LABEL[strongest.key] ?? strongest.label) : ""}</small></div>
                  <div className="db-stat"><span>Emotional intelligence</span><b>{a.ei != null ? Math.round(a.ei) : "-"}</b><small>{eiResult || "Out of 100"}</small></div>
                  <Link href="/account/progress" {...NEW_TAB} className="db-stat db-stat-link"><span>Learning so far</span><b>{lessonsDone} {lessonsDone === 1 ? "lesson" : "lessons"}{toolsUsedAll ? ` · ${toolsUsedAll} ${toolsUsedAll === 1 ? "tool" : "tools"}` : ""}</b><small>{streak > 0 ? `${streak}-day streak` : "Start any feature"} · My Progress →</small></Link>
                </div>
              </div>

              <div className="db-card db-glance">
                <CardHead icon="user" title="Profile at a glance" sub="Three quick reads of who you are at school and work." />
                <div className="ogd-pbars">
                  {pbars.map((b) => (
                    <div className="ogd-pbar" key={b.label}>
                      <div className="ogd-pbar-top"><span>{b.label}</span><b>{Math.round(b.score)}</b></div>
                      <SkillBar value={b.score} color={INK} height={7} track="#ece9e3" />
                    </div>
                  ))}
                </div>
                <div className="db-glance-a">
                  <button className="db-more" onClick={() => go("dimensions")}>All eight dimensions <Icon name="arrowRight" size={14} stroke={2} /></button>
                  <Link href={REPORT_HREF} {...NEW_TAB} className="db-more">Read the detailed analysis <Icon name="arrowRight" size={14} stroke={2} /></Link>
                </div>
              </div>
            </section>

            {extrasBefore("dimensions")}

            {/* ===== DIMENSIONS ===== */}
            <section id="dimensions" className="db-sec">
              <div className="db-sec-h"><div><h2>Your eight dimensions</h2><p>Pick one to see what it means, your strengths and what to work on.</p></div></div>
              <div className="db-card db-dims">
                <div className="db-dimtabs" role="tablist" aria-label="Dimensions">
                  {radar.map((d) => (
                    <button key={d.key} role="tab" aria-selected={dimKey === d.key} className="db-dimtab" onClick={() => setDimKey(d.key)} title={CAT_LABEL[d.key] ?? d.label}>
                      <Icon name={customDims.get(d.key)?.icon ?? d.key} size={18} />
                      <span>{DIM_TAB_LABEL[d.key] ?? customDims.get(d.key)?.short ?? d.label}</span>
                      <b>{Math.round(d.score)}</b>
                    </button>
                  ))}
                </div>
                <div className="db-dimbody">
                  {activeCustom?.img ? (
                    // Undergraduates: the active pillar's own picture.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="db-pillar" src={activeCustom.img} alt="" loading="lazy" />
                  ) : null}
                  {activeCustom
                    ? <CustomDimPanel c={activeCustom} />
                    : <DimPanel d={radar.find((r) => r.key === dimKey) ?? radar[0]} a={a} />}
                </div>
              </div>
            </section>

            {extrasBefore("fields")}

            {/* ===== FIELDS ===== */}
            <section id="fields" className="db-sec">
              <div className="db-sec-h"><div><h2>Your best-fit fields</h2>
                <p>{a.customFields?.length
                  ? "Matched from your interests, strengths and motivators - the same ranking as your report's Career Fitment page."
                  : "Blended from your interests, abilities, intelligences and drivers."}</p></div>
                <Link href="/account/career-library" {...NEW_TAB} className="db-more" style={{ marginTop: 0 }}>Explore careers <Icon name="arrowRight" size={14} stroke={2} /></Link>
              </div>
              <div className="db-card db-fields">
                {fits.slice(0, 3).map((d, i) => (
                  <div className="db-field" key={d.name}>
                    <span className="db-field-rk">{i + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <div className="db-field-top"><b>{d.name}</b><span>{d.fit}%</span></div>
                      <SkillBar value={d.fit} color={i === 0 ? IN : INK} height={6} track="#ece9e3" />
                      <p>{d.tagline} · <b>{d.why}</b></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {extrasBefore("mind")}

            {/* ===== MIND ===== (left out when the result has none of the four lists) */}
            {hasMind && (
              <section id="mind" className="db-sec">
                <div className="db-sec-h"><div><h2>How you think and work</h2><p>Your natural leanings across four lenses.</p></div></div>
                <div className="db-card">
                  <div className="ogd-mind">
                    <MiniList title="Intelligences" items={(a.topIntelligences ?? []).map((x) => ({ label: x.name, score: x.score }))} icon="multiple_intelligence" />
                    <MiniList title="Aptitudes" items={(a.topAptitudes ?? []).map((x) => ({ label: x.skill, score: x.score }))} icon="aptitude" />
                    <MiniList title="Motivators" items={(a.topValues ?? []).map((x) => ({ label: x.tag, score: x.score }))} icon="motivators" />
                    <MiniList title="Learning styles" items={(a.learningStyles ?? []).map((x) => ({ label: x.name, score: x.score }))} icon="learning_styles" />
                  </div>
                </div>
              </section>
            )}

            {extrasBefore("plan")}

            {/* ===== PLAN ===== */}
            <section id="plan" className="db-sec">
              <GoalTracker plan={plan} goalKey={String(a.completedAt)} domain={topDomainName} />
            </section>
            </>) : (
              // No usable scores - saved by an earlier version of the
              // assessment. Say so plainly rather than drawing 0s.
              <section id="overview" className="db-sec">
                <div className="db-card db-noscores">
                  <span className="db-kicker">Your profile</span>
                  <h2>Your scores can&apos;t be shown here yet</h2>
                  <p>Your saved result was made by an earlier version of the assessment, so this page can&apos;t read its scores. Your full report shows what was saved; retaking the assessment brings your profile, dimensions and best-fit fields to this page.</p>
                  <div className="db-actions">
                    <Link href={REPORT_HREF} {...NEW_TAB} className="db-btn pri">Open my full report <Icon name="arrowRight" size={16} stroke={2} /></Link>
                    <Link href="/?begin=1" {...NEW_TAB} className="db-btn">Retake the assessment</Link>
                  </div>
                </div>
              </section>
            )}

            {/* ===== CAREER TOOLKIT (in-dashboard listings) - temporarily disabled ===== */}
            {SHOW_TOOLKIT && (
              <section id="resources" className="db-sec">
                <Toolkit tab={toolkitTab} setTab={setToolkitTab} />
              </section>
            )}

            {/* Anything not anchored to a section lands here, at the end. */}
            {extraSections
              .filter((x) => !x.before || !NAV.some((n) => n.id === x.before))
              .map((x) => (
                <section key={x.id} id={x.id} className="db-sec">{x.node}</section>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

/* =============================== pieces ================================ */

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

function MRow({ k, v }: { k: string; v?: string | null }) {
  return (
    <div className="ash-menu-row">
      <span>{k}</span><b>{v || "-"}</b>
    </div>
  );
}

/** In-dashboard toolkit: tabbed listings of real colleges, exams, internships,
 *  scholarships and careers - each row links to the official source. */
function Toolkit({ tab, setTab }: { tab: string; setTab: (id: string) => void }) {
  const active = TOOLKIT_TABS.find((t) => t.id === tab) ?? TOOLKIT_TABS[0];
  return (
    <div className="ogd-card">
      <CardHead icon="route" title="Career toolkit" sub="Explore real colleges, exams, internships, scholarships and careers - right here." />
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
 *  tab row above - score, benchmark, sub-traits, and the complete deep-dive
 *  (meaning, strengths, growth areas, recommended actions, next step). */
/** Dimension panel for a scorer-supplied dimension (Graduates' pillars). */
function CustomDimPanel({ c }: { c: CustomDimension }) {
  return (
    <div className="ogd-dimpanel">
      <div className="ogd-dimpanel-top">
        <div className="ogd-dimpanel-head">
          <span className="ogd-dim-ic lg"><Icon name={c.icon} size={20} /></span>
          <div>
            <div className="ogd-dimpanel-name">{c.label}</div>
            <span className="ogd-dim-result">Your result: <b>{c.result}</b></span>
          </div>
        </div>
        <div className="ogd-dimpanel-score">
          <div className="ogd-dimpanel-num">{Math.round(c.score)}</div>
        </div>
      </div>
      <SkillBar value={c.score} color={IN} />
      <span className="ogd-dim-pct">{c.scoreBasis}</span>

      <p className="ogd-dim-text">{c.meaning}</p>

      {c.subs.length > 0 && (
        <div className="ogd-dim-subs">
          {c.subs.slice(0, 8).map((s) => (
            <div className="ogd-dim-subrow" key={s.label}>
              <span className="ogd-dim-sublab">{s.label}</span>
              <SkillBar value={s.value} color={C.faint} height={6} />
              <span className="ogd-dim-subval">{Math.round(s.value)}</span>
            </div>
          ))}
        </div>
      )}
      {c.preferences.length > 0 && (
        <div className="ogd-dim-text">
          {c.preferences.map((p) => <div key={p.label}><b>{p.label}:</b> {p.value}</div>)}
        </div>
      )}

      <div className="ogd-dim-lists">
        <div className="ogd-dim-list">
          <div className="ogd-dim-list-h good">Strengths</div>
          {c.strengths.slice(0, 3).map((s, i) => <div className="ogd-dim-li" key={i}>{s}</div>)}
        </div>
        <div className="ogd-dim-list">
          <div className="ogd-dim-list-h">Areas to grow</div>
          {c.grow.slice(0, 3).map((s, i) => <div className="ogd-dim-li" key={i}>{s}</div>)}
        </div>
        {c.recommend.length > 0 && (
          <div className="ogd-dim-list">
            <div className="ogd-dim-list-h">Recommended actions</div>
            {c.recommend.map((s, i) => <div className="ogd-dim-li" key={i}>{s}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

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
          <SkillBar value={(it.score / max) * 100} color={INK} height={6} track="#ece9e3" />
        </div>
      ))}
    </div>
  );
}

/** 30/90-day checklist. Ticks are the signed-in student's own, saved to their
 *  account (lib/progress/progressStore.ts) for this assessment result. */
function GoalTracker({ plan, goalKey, domain }: { plan: { days30: string[]; days90: string[] }; goalKey: string; domain: string }) {
  const all = [...plan.days30, ...plan.days90];
  const accountGoals = useAuth().profile?.progress?.goals;
  // Start empty for a stable first render, then load saved progress after mount
  // (localStorage is client-only - reading it during render risks a mismatch).
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setDone(readGoals(goalKey, accountGoals));
  }, [goalKey, accountGoals]);
  const toggle = (i: number) => {
    setDone((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      saveGoals(goalKey, next, all.length);
      return next;
    });
  };
  const count = all.filter((_, i) => done[i]).length;
  const progress = Math.round((count / all.length) * 100);

  return (
    <section className="ogd-card">
      <div className="ogd-goal-head">
        <CardHead icon="check" title="Your action plan" sub={`Small steps toward ${domain}. Check items off as you go.`} />
        <Ring value={progress} size={72} stroke={7} color={progress >= 100 ? C.good : INK} track="#ece9e3">
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
// The report and feature views keep the original styles (LEGACY_CSS) - the
// report's look is unchanged. The dashboard view has its own (DASH_CSS, below).
const SIDE = 244;
const LEGACY_CSS = `
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
.ash-navi{position:relative;display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:none;cursor:pointer;
  font-family:inherit;font-size:13.5px;font-weight:600;color:${C.ink2};padding:9px 12px;border-radius:10px;text-decoration:none;transition:background .12s,color .12s}
.ash-navi svg{color:${C.muted};flex:none;transition:color .12s}
.ash-navi:hover{background:${C.line2}}
/* A tint alone (barely different from the sidebar's own white) wasn't a clear
   "you are here" signal. A solid accent bar at the sidebar's outer edge is
   the unambiguous marker; the tint and bold label now back it up instead of
   carrying the whole state alone. */
.ash-navi.on{background:${IN_TINT};color:${IN_STRONG};font-weight:700;border-radius:0 10px 10px 0}
.ash-navi.on::before{content:"";position:absolute;left:-8px;top:6px;bottom:6px;width:3px;
  border-radius:0 3px 3px 0;background:${IN}}
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
@media(max-width:480px){.ash-top-h{font-size:20px}.ash-top-s{font-size:13px}}
@media(max-width:375px){.ash-top-h{font-size:18px;margin-top:4px}.ash-top-s{font-size:12px}}
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
@media(max-width:640px){
  .ash-main{padding:18px 14px}
  .ash-top{padding:14px 16px}
  .ash-top-t{flex-direction:column;align-items:flex-start}
  .ash-grid{gap:10px}
  .ogd-card{padding:16px 14px}
}
@media(max-width:480px){
  .ash-main{padding:14px 10px}
  .ash-top{padding:12px 12px}
  .ogd-card{padding:12px 12px}
  .ogd-hero{grid-template-columns:1fr !important;padding:18px 12px !important;gap:16px}
  .ogd-kpis{gap:8px;grid-template-columns:1fr 1fr}
  .ogd-rail{gap:8px}
  .ogd-rail>.ogd-card{min-width:auto}
  .ogd-learn{gap:6px}
  .ogd-schol{gap:6px}
}
@media(max-width:375px){
  .ash-main{padding:10px 8px}
  .ogd-card{padding:10px 10px;border-radius:10px}
  .ogd h1{font-size:20px}
  .ogd h2{font-size:17px}
  .tk-row{padding:10px 12px;gap:8px}
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
@media(max-width:480px){.ogd-kpis{grid-template-columns:1fr;gap:10px}}
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

/* dimensions - horizontal tile row (icon + checkmark + label) + single detail panel */
.ogd-dims8{margin-bottom:18px;border:1px solid ${C.line};border-radius:14px;overflow:hidden;background:${C.bg};max-height:220px}
.ogd-dims8 img{width:100%;display:block;object-fit:cover;max-height:220px}
@media(max-width:640px){.ogd-dims8{max-height:150px}.ogd-dims8 img{max-height:150px}}
.ogd-dims8.pillar img{object-fit:contain;height:220px}
@media(max-width:640px){.ogd-dims8.pillar img{height:150px}}
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
@media(max-width:480px){.ogd-dimtab{min-width:80px;font-size:11px;padding:8px 10px}.ogd-dimtab-ic{width:16px;height:16px}}

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
@media(max-width:480px){.ogd-goal-cols{gap:14px}.ogd-goal-item{padding:6px 0}.ogd-goal-text{font-size:12px}}
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
@media(max-width:480px){.ogd-learn{grid-template-columns:1fr;gap:6px}.ogd-learn-chip{padding:9px 11px;border-radius:9px}.ogd-learn-chip b{font-size:12px}.ogd-learn-chip span{font-size:10px}}
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

/* COMPREHENSIVE MOBILE RESPONSIVENESS ENHANCEMENTS */

/* Ensure no horizontal scroll */
html, body {
  overflow-x: hidden;
  width: 100%;
}

/* Touch target minimum sizes (WCAG 2.5.5 - 44x44px) */
button, a[href], input[type="button"], input[type="submit"], .ogd-btn, .tk-row, .ogd-goal-item, .rail-act, .ash-bell, .ash-top-ava {
  min-height: 44px;
  min-width: 44px;
}

/* Extra padding on ultra-small screens (320px - 375px) */
@media(max-width:375px){
  .ash-main{padding:8px 6px !important}
  .ash-top{padding:10px 10px !important}
  .ogd-card{padding:12px 10px !important;border-radius:10px}
  .ogd-hero{padding:16px 12px !important;gap:12px}
  .ogd-hero.dark{padding:20px 16px !important}
  .ogd-kpi{padding:14px 12px !important}
  .ogd-btn{padding:10px 14px;font-size:12px}
  .ogd-btn.lg{padding:12px 18px;font-size:13px}

  /* Font scaling */
  .ogd h1{font-size:18px !important}
  .ogd h2{font-size:15px !important}
  .ogd-arch{font-size:clamp(20px,3.5vw,28px) !important}
  .ogd-ring-pct{font-size:28px !important}

  /* Grid adjustments */
  .ogd-explore{grid-template-columns:1fr !important}
  .ogd-mind{grid-template-columns:1fr !important}
  .ogd-learn{grid-template-columns:1fr !important;gap:6px}
  .ogd-schol{grid-template-columns:1fr !important}
  .ogd-details{grid-template-columns:1fr !important}
  .ogd-goal-cols{grid-template-columns:1fr !important}
  .toolkit-grid{grid-template-columns:1fr !important}

  /* Reduce gaps */
  .ogd-kpis{gap:8px}
  .ogd-hero-chips{gap:6px}
  .ogd-hero-actions{gap:8px}

  /* Sidebar optimization */
  .rail-card{padding:12px 14px !important}

  /* Text adjustments */
  .tk-tab{font-size:11px;padding:6px 10px}
  .rail-act{font-size:12px;padding:9px 11px;min-height:40px}
}

/* Small phones (376px - 480px) */
@media(max-width:480px){
  .toolkit-grid{grid-template-columns:1fr !important}
  .ogd-dimtab{min-width:70px;padding:6px 8px;font-size:10px}
  .ogd-dimtab-ic{width:14px;height:14px}

  /* Ensure KPI section uses single column */
  .ogd-kpis{grid-template-columns:1fr !important}

  /* Sidebar drawer optimization */
  .ash-side{max-height:100vh;overflow-y:auto}
  .ash-rail{max-height:calc(100vh - 140px);overflow-y:auto}

  /* Menu positioning */
  .ash-menu{max-width:280px;right:8px}
}

/* Medium phones (481px - 640px) */
@media(max-width:640px){
  .ogd-grid-radar{grid-template-columns:1fr !important}
  .ogd-dim-lists{grid-template-columns:1fr !important}

  /* Better spacing */
  .ogd-card{margin:0 auto;width:100%}
}

/* Landscape mode adjustments for small phones */
@media(max-height:500px) and (orientation:landscape){
  .ash-main{padding:12px 14px}
  .ogd-card{padding:14px 12px}
  .ogd-hero{padding:16px 18px;gap:14px}
}

/* Prevent overflow on all elements */
.ogd, .ash-main, .ogd-card {
  overflow-x: hidden;
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Ensure sidebar buttons stay accessible on mobile */
@media(max-width:860px){
  .rail-act{padding:12px 12px;min-height:44px}
}
`;

/** The dashboard view's own styles - same visual language as the feature
 *  pages (components/feature/styles.ts): warm off-white, ink, hairlines,
 *  6-8px corners, Poppins headings. Nothing here leaks outside .db. */
const DASH_CSS = `
.db{--ink:#16181d;--ink2:#4a4f59;--mute:#7b808b;--line:#e8e5df;--line2:#f0ede8;--soft:#f7f5f1;--warm:#f4f0eb;--red:${IN};
  font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:#fbfaf8;min-height:100vh;overflow-x:clip}
.db *{box-sizing:border-box}
.db h1,.db h2,.db h3{font-family:Poppins,Inter,sans-serif;letter-spacing:-.015em;margin:0;color:var(--ink)}
.db p{margin:0}
.db button{font-family:inherit}

/* sidebar */
.db-side{position:fixed;top:0;left:0;bottom:0;width:248px;background:#fff;border-right:1px solid var(--line);display:flex;flex-direction:column;z-index:40;transition:transform .22s ease}
.db-brand{padding:18px 20px 8px}
.db-me{display:flex;align-items:center;gap:10px;margin:6px 14px 4px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--soft)}
.db-ava{width:34px;height:34px;border-radius:6px;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-weight:600;font-size:15px;flex:none}
.db-me b{display:block;font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-me small{display:block;font-size:12px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-nav{flex:1;overflow-y:auto;padding:2px 10px 14px;scrollbar-width:thin}
.db-nav-lbl{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding:16px 10px 6px}
.db-navi{position:relative;display:flex;align-items:center;gap:10px;width:100%;height:36px;padding:0 10px;border:0;background:none;border-radius:6px;font-size:13.5px;font-weight:500;color:var(--ink2);cursor:pointer;text-align:left;text-decoration:none}
.db-navi:hover{background:var(--soft);color:var(--ink)}
.db-navi svg{color:var(--mute);flex:none}
.db-navi img{width:26px;height:22px;object-fit:contain;flex:none;margin:0 -3px 0 -4px}
.db-navi span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-navi.on{background:var(--warm);color:var(--ink);font-weight:600}
.db-navi.on::before{content:"";position:absolute;left:-10px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:var(--red)}
.db-navi.on svg{color:var(--ink)}
.db-side-foot{padding:12px 14px 16px;border-top:1px solid var(--line)}
.db-signout{width:100%;height:36px;display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer}
.db-signout:hover{background:var(--soft);color:var(--ink)}
.db-scrim{position:fixed;inset:0;background:rgba(18,20,24,.4);z-index:39}

/* top bar */
.db-body{margin-left:248px;min-height:100vh}
.db-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:18px;height:64px;padding:0 28px;background:rgba(255,255,255,.95);backdrop-filter:saturate(1.4) blur(8px);border-bottom:1px solid var(--line)}
.db-burger{display:none;width:38px;height:38px;border-radius:6px;border:1px solid var(--line);background:#fff;color:var(--ink);place-items:center;cursor:pointer;flex:none}
.db-hello{min-width:0}
.db-hello b{display:block;font-family:Poppins,Inter,sans-serif;font-size:16px;font-weight:600;white-space:nowrap}
.db-hello small{display:block;font-size:12.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-top-search{flex:1;display:flex;justify-content:center;min-width:0}
.db-top .fp-search{margin:0;width:100%;max-width:460px}
.db-top .fp-search-box,.db-msearch .fp-search-box{height:40px;box-shadow:none;border-radius:6px;background:var(--soft)}
.db-top .fp-search-box input,.db-msearch .fp-search-box input{font-size:14px}
.db-top-r{display:flex;align-items:center;gap:10px;flex:none}
.db-topbtn{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 12px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13px;font-weight:600;color:var(--ink);text-decoration:none}
.db-topbtn:hover{background:var(--soft)}
.db .ash-user-wrap{position:relative}
.db .ash-top-ava{width:38px;height:38px;border-radius:6px;display:grid;place-items:center;background:var(--ink);color:#fff;font-family:Poppins,Inter,sans-serif;font-weight:600;font-size:15px;cursor:pointer;border:0}
.db .ash-menu-scrim{position:fixed;inset:0;z-index:40}
.db .ash-menu{position:absolute;top:calc(100% + 8px);right:0;z-index:41;width:290px;background:#fff;border:1px solid var(--line);border-radius:8px;box-shadow:0 18px 44px rgba(22,24,29,.16);padding:14px}
.db .ash-menu-head{display:flex;align-items:center;gap:11px;padding-bottom:12px;border-bottom:1px solid var(--line2)}
.db .ash-menu-ava{width:38px;height:38px;border-radius:6px;flex:none;display:grid;place-items:center;background:var(--ink);color:#fff;font-weight:600}
.db .ash-menu-id{min-width:0}
.db .ash-menu-n{font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.db .ash-menu-e{font-size:12px;color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.db .ash-menu-rows{padding:8px 0 4px}
.db .ash-menu-row{display:flex;justify-content:space-between;gap:12px;align-items:baseline;padding:7px 0}
.db .ash-menu-row span{font-size:12px;color:var(--mute);flex:none}
.db .ash-menu-row b{font-size:13px;font-weight:600;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.db .ash-menu-signout{width:100%;height:38px;display:flex;align-items:center;justify-content:center;gap:7px;margin-top:8px;background:#fff;color:var(--ink);border:1px solid var(--line);border-radius:6px;font-size:13px;font-weight:600;cursor:pointer}
.db .ash-menu-signout:hover{background:var(--soft)}

/* page */
.db-main{padding:28px 28px 72px}
.db-wrap{max-width:1180px;margin:0 auto}
.db-msearch{display:none;margin-bottom:16px}
.db-msearch .fp-search{margin:0;max-width:none}
.db-sec{scroll-margin-top:84px;margin-top:44px}
.db-sec.db-first{margin-top:0}
.db-sec-h{display:flex;justify-content:space-between;align-items:flex-end;gap:10px 20px;flex-wrap:wrap;margin-bottom:14px}
.db-sec-h h2{font-size:21px;font-weight:600;line-height:1.25}
.db-sec-h p{font-size:14px;color:var(--mute);margin-top:4px;max-width:70ch}
.db-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:22px}
.db-more{display:inline-flex;align-items:center;gap:6px;margin-top:18px;background:none;border:0;padding:0;font-size:13.5px;font-weight:600;color:var(--ink);text-decoration:none;cursor:pointer}
.db-more:hover{text-decoration:underline;text-underline-offset:3px}
.db-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 16px;border-radius:6px;border:1px solid #d9d5cd;background:#fff;color:var(--ink);font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap}
.db-btn:hover{background:var(--soft)}
.db-btn.pri{background:var(--ink);border-color:var(--ink);color:#fff}
.db-btn.pri:hover{background:#2b2e35}
.db-kicker{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.db-note{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--mute)}

/* hero */
.db-hero{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);background:var(--warm);border:1px solid var(--line);border-radius:10px;overflow:hidden}
.db-hero-l{padding:32px 32px 28px}
.db-hero h1{font-size:clamp(30px,3.4vw,44px);line-height:1.08;font-weight:700;margin-top:10px;text-wrap:balance}
.db-hero-tag{font-size:15.5px;line-height:1.6;color:var(--ink2);margin-top:12px;max-width:54ch}
.db-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.db-chips span{font-size:13px;color:var(--ink2);background:#fff;border:1px solid var(--line);border-radius:6px;padding:6px 10px}
.db-chips b{color:var(--ink);font-weight:600}
.db-actions{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;margin-top:22px}
.db-hero-r{padding:32px 30px 28px;border-left:1px solid var(--line);background:#fff;display:flex;flex-direction:column}
.db-big{font-family:Poppins,Inter,sans-serif;font-size:64px;font-weight:700;line-height:1;margin-top:10px;letter-spacing:-.03em}
.db-big small{font-size:24px;color:var(--mute);font-weight:600;margin-left:2px}
.db-big-l{font-size:16px;font-weight:600;margin-top:8px}
.db-big-s{font-size:13px;color:var(--mute);margin-top:2px}
.db-themes{display:grid;gap:10px;margin-top:auto;padding-top:22px}
.db-theme{display:grid;grid-template-columns:minmax(0,120px) minmax(0,1fr) 28px;gap:10px;align-items:center;font-size:13px;color:var(--ink2)}
.db-theme span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-theme b{text-align:right;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums}
.db-stats{grid-column:1 / -1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--line);background:#fff}
.db-stat{display:block;padding:16px 22px;min-width:0;text-decoration:none;color:var(--ink)}
.db-stat+.db-stat{border-left:1px solid var(--line)}
.db-stat span{display:block;font-size:12.5px;color:var(--mute)}
.db-stat b{display:block;font-family:Poppins,Inter,sans-serif;font-size:22px;font-weight:600;margin-top:4px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-stat small{display:block;font-size:12.5px;color:var(--ink2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-stat-link:hover{background:var(--soft)}

/* tools + overview cards */
.db-glance{margin-top:16px}
.db .db-glance .ogd-pbars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 32px}
.db-glance-a{display:flex;flex-wrap:wrap;gap:6px 24px}
.db .ogd-cardhead{margin-bottom:16px}
.db .ogd-cardhead-top{display:flex;align-items:center;gap:10px}
.db .ogd-cardhead-ic{display:none}
.db .ogd-cardhead h2{font-size:17px;font-weight:600}
.db .ogd-cardhead p{font-size:13.5px;color:var(--mute);margin-top:4px;line-height:1.5;max-width:64ch}
.db .ogd-pbars{display:flex;flex-direction:column;gap:16px}
.db .ogd-pbar-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:7px;font-size:14px}
.db .ogd-pbar-top span{color:var(--ink2)}
.db .ogd-pbar-top b{font-weight:600;font-variant-numeric:tabular-nums}
.db .ogd-radar-chart{display:flex;justify-content:center;margin:0 0 4px}

/* dimensions */
.db-dims{padding:0;overflow:hidden}
.db-dimtabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--line);scrollbar-width:thin;background:var(--soft)}
.db-dimtab{flex:1 0 auto;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:92px;padding:14px 10px 12px;border:0;border-right:1px solid var(--line);background:none;cursor:pointer;color:var(--ink2)}
.db-dimtab:last-child{border-right:0}
.db-dimtab:hover{background:#fff}
.db-dimtab span{font-size:12.5px;font-weight:600;white-space:nowrap}
.db-dimtab b{font-family:Poppins,Inter,sans-serif;font-size:15px;font-weight:600;color:var(--ink)}
.db-dimtab[aria-selected="true"]{background:#fff;color:var(--ink);box-shadow:inset 0 -2px 0 var(--ink)}
.db-dimtab[aria-selected="true"] svg{color:var(--red)}
.db-dimbody{position:relative;padding:22px}
.db-pillar{float:right;width:180px;max-width:36%;height:auto;margin:0 0 12px 18px;border-radius:8px}
.db .ogd-dimpanel{animation:none}
.db .ogd-dimpanel-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px}
.db .ogd-dimpanel-head{display:flex;align-items:center;gap:12px}
.db .ogd-dim-ic{display:none}
.db .ogd-dimpanel-name{font-family:Poppins,Inter,sans-serif;font-size:20px;font-weight:600;margin-bottom:6px}
.db .ogd-dim-result{display:inline-block;font-size:13px;color:var(--ink2);border:1px solid var(--line);border-radius:6px;padding:4px 10px;background:var(--soft)}
.db .ogd-dim-result b{color:var(--ink);font-weight:600}
.db .ogd-dimpanel-score{text-align:right;flex:none}
.db .ogd-dimpanel-num{font-family:Poppins,Inter,sans-serif;font-size:34px;font-weight:700;line-height:1}
.db .ogd-dim-delta{font-size:12px;font-weight:600;margin-top:4px}
.db .ogd-dim-delta.up{color:#15803d}
.db .ogd-dim-delta.down{color:var(--mute)}
.db .ogd-dim-pct{display:inline-block;font-size:12.5px;color:var(--mute);margin-top:8px}
.db .ogd-dim-text{font-size:14.5px;line-height:1.7;color:var(--ink2);max-width:72ch;margin-top:14px}
.db .ogd-dim-subs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 28px;margin-top:18px}
.db .ogd-dim-subrow{display:grid;grid-template-columns:minmax(0,130px) minmax(0,1fr) 28px;align-items:center;gap:10px}
.db .ogd-dim-sublab{font-size:13px;color:var(--ink2)}
.db .ogd-dim-subval{font-size:13px;font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.db .ogd-dim-lists{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin-top:22px;padding-top:18px;border-top:1px solid var(--line2)}
.db .ogd-dim-list-h{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
.db .ogd-dim-list-h.good{color:#15803d}
.db .ogd-dim-li{font-size:13.5px;line-height:1.55;color:var(--ink2);padding:7px 0;border-top:1px solid var(--line2)}
.db .ogd-dim-li:first-child{border-top:0;padding-top:0}
.db .ogd-dim-next{margin-top:18px;padding:12px 14px;background:var(--soft);border:1px solid var(--line);border-radius:6px;font-size:13.5px;color:var(--ink2)}
.db .ogd-dim-next b{color:var(--ink);font-weight:600}

/* fields */
.db-fields{padding:6px 22px}
.db-field{display:grid;grid-template-columns:44px minmax(0,1fr);gap:16px;align-items:start;padding:18px 0;border-top:1px solid var(--line2)}
.db-field:first-child{border-top:0}
.db-field-rk{font-family:Poppins,Inter,sans-serif;font-size:28px;font-weight:700;line-height:1;color:#c9c4ba}
.db-field:first-child .db-field-rk{color:var(--red)}
.db-field-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}
.db-field-top b{font-size:16px;font-weight:600}
.db-field-top span{font-family:Poppins,Inter,sans-serif;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.db-field p{font-size:13.5px;color:var(--mute);margin-top:8px;line-height:1.5}
.db-field p b{color:var(--ink2);font-weight:600}

/* how you think */
.db .ogd-mind{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px 34px}
.db .ogd-minilist-h{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:12px}
.db .ogd-minirow{display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr);align-items:center;gap:12px;margin-bottom:10px}
.db .ogd-minilab{font-size:13.5px;color:var(--ink2);line-height:1.3}

/* plan */
.db .ogd-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:22px}
.db .ogd-goal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.db .ogd-goal-prog{font-family:Poppins,Inter,sans-serif;font-size:16px;font-weight:600}
.db .ogd-goal-prog small{font-size:11px;color:var(--mute)}
.db .ogd-goal-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 32px;margin-top:4px}
.db .ogd-goal-tag{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:6px;padding:0;background:none;display:block}
.db .ogd-goal-item{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line2);cursor:pointer;padding:11px 0}
.db .ogd-goal-box{width:20px;height:20px;border-radius:5px;border:1.5px solid #c9c4ba;flex:none;display:grid;place-items:center;color:#fff;margin-top:1px}
.db .ogd-goal-item.done .ogd-goal-box{background:#15803d;border-color:#15803d}
.db .ogd-goal-text{font-size:14px;line-height:1.5;color:var(--ink2)}
.db .ogd-goal-item.done .ogd-goal-text{color:var(--mute);text-decoration:line-through}

.db-noscores{padding:26px}
.db-noscores h2{font-size:21px;font-weight:600;margin-top:8px}
.db-noscores p{font-size:14.5px;line-height:1.6;color:var(--ink2);margin-top:8px;max-width:66ch}

/* report banner + toolkit (top of the page) */
.db-report{display:flex;align-items:center;gap:16px 24px;flex-wrap:wrap;justify-content:space-between;padding:22px 24px;background:var(--warm);border:1px solid var(--line);border-radius:10px}
.db-report>div:first-child{flex:1 1 360px}
.db-report b{display:block;font-family:Poppins,Inter,sans-serif;font-size:22px;font-weight:600;margin-top:6px;line-height:1.25}
.db-report small{display:block;font-size:14px;color:var(--ink2);margin-top:4px;line-height:1.5}
.db-report-a{display:flex;gap:10px;flex-wrap:wrap}
.db-kit{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.db-kit>a{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:8px;text-decoration:none;color:var(--ink);overflow:hidden;transition:border-color .15s,transform .2s}
.db-kit>a:hover{border-color:#c9c4ba;transform:translateY(-2px)}
.db-kit-art{height:136px;background:var(--warm);display:grid;place-items:center;border-bottom:1px solid var(--line);color:var(--ink)}
.db-kit-art img{width:76%;height:118px;object-fit:contain;transition:transform .25s}
.db-kit-art.is-photo img{width:100%;height:100%;object-fit:cover}
.db-kit>a:hover .db-kit-art img{transform:scale(1.05)}
.db-kit>a:hover .db-kit-art.is-photo img{transform:none}
.db-kit-b{padding:12px 14px 14px;display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.db-kit-b>b{font-size:15px;font-weight:600;line-height:1.3}
.db-kit-b>small{font-size:12.5px;color:var(--mute);line-height:1.4}
.db-kit-p{display:flex;align-items:center;gap:8px;padding-top:6px;font-size:11.5px;color:var(--mute);font-variant-numeric:tabular-nums}
.db-kit-p i{flex:1;height:4px;border-radius:2px;background:#ece9e3;overflow:hidden;display:block}
.db-kit-p i b{display:block;height:100%;background:var(--ink)}
.db-kit>a.db-kit-new{grid-column:1/-1;flex-direction:row;align-items:center;gap:6px;border-color:color-mix(in srgb,#a21caf 30%,var(--line));background:linear-gradient(100deg,color-mix(in srgb,#a21caf 6%,#fff),#fff 60%)}
.db-kit-new .db-kit-art{flex:none;width:220px;height:124px;border-bottom:0;background:transparent}
.db-kit-new .db-kit-art img{width:100%;height:112px}
.db-kit-new .db-kit-b{padding:14px 10px}
.db-kit-new .db-kit-b>small{font-size:13.5px;max-width:620px}
.db-kit-new .db-btn{flex:none;margin-right:18px}
.db-new{align-self:flex-start;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:#a21caf;border-radius:999px;padding:2px 8px;margin-bottom:2px}
@media (max-width:700px){.db-kit>a.db-kit-new{flex-direction:column;align-items:stretch}.db-kit-new .db-kit-art{width:100%}.db-kit-new .db-btn{display:none}}

/* details */
.db .ogd-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px}
.db .ogd-detail{display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:1px solid var(--line2)}
.db .ogd-detail-k{font-size:13px;color:var(--mute)}
.db .ogd-detail-v{font-size:14px;font-weight:600;text-align:right}

@media (max-width:1240px){
  .db-kit{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:760px){
  .db-kit{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:1000px){
  .db-hero{grid-template-columns:minmax(0,1fr)}
  .db-hero-r{border-left:0;border-top:1px solid var(--line)}
  .db-themes{padding-top:16px}
  .db .ogd-dim-lists{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:900px){
  .db-side{transform:translateX(-102%)}
  .db-side.open{transform:none;box-shadow:0 20px 60px rgba(18,20,24,.25)}
  .db-body{margin-left:0}
  .db-burger{display:grid}
  .db-top{padding:0 14px;gap:12px}
  .db-top-search{display:none}
  .db-hello{flex:1}
  .db-msearch{display:block}
  .db .db-glance .ogd-pbars{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .db-main{padding:16px 14px 56px}
  .db-topbtn span{display:none}
  .db-topbtn{padding:0 10px}
  .db-hero-l,.db-hero-r{padding:22px 18px}
  .db-big{font-size:52px}
  .db-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .db-stat{padding:14px 16px}
  .db-stat:nth-child(3){border-left:0}
  .db-stat:nth-child(n+3){border-top:1px solid var(--line)}
  .db-stat b{font-size:19px}
  .db-kit{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .db-kit-art{height:104px}
  .db-kit-art img{height:88px}
  .db-kit-b{padding:10px 11px 12px}
  .db-kit-b>b{font-size:14px}
  .db-kit-b>small{font-size:12px}
  .db-report{padding:18px 16px}
  .db-report b{font-size:19px}
  .db-report-a{width:100%}
  .db-report-a .db-btn{flex:1}
  .db-card:not(.db-dims),.db-dimbody{padding:18px 16px}
  .db-fields{padding:4px 16px}
  .db .ogd-mind,.db .ogd-goal-cols,.db .ogd-details,.db .ogd-dim-subs{grid-template-columns:minmax(0,1fr)}
  .db-pillar{float:none;display:block;width:150px;max-width:60%;margin:0 auto 14px}
  .db-sec{margin-top:36px}
}
@media print{
  .db-side,.db-top,.db-msearch{display:none!important}
  .db-body{margin-left:0}
}
`;
