"use client";

/**
 * Mobile-Optimized Dashboard
 * Fully responsive version for mobile, tablet, and desktop
 * Responsive padding, fonts, grid layouts
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";
import dynamic from "next/dynamic";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, SkillBar, RadarChart, type RadarDatum } from "@/app/account/viz";

const FullReport = dynamic(() => import("@/app/account/FullReport"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "48px 24px", textAlign: "center", color: "#64748b", fontSize: 14 }}>Preparing your report…</div>
  ),
});
const FeaturesDetailPage = dynamic(() => import("@/app/account/features/FeaturesDetailPage"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "48px 24px", textAlign: "center", color: "#64748b", fontSize: 14 }}>Loading feature…</div>
  ),
});

import { TOOLKIT_TABS } from "@/app/account/toolkitData";
import {
  archetype, actionPlan, domainFit,
  percentileOf, subTraits, resultOf, categoryDeepDive,
} from "@/lib/report/knowledge";
import StudyAbroad from "@/app/account/features/StudyAbroad";
import FeaturesHub from "@/app/account/FeaturesHub";

// Colors
const IN = "#db3433", IN_STRONG = "#b82a2b", IN_TINT = "#fef0f0", IN_LINE = "#f5d5d5";
const DIMS8 = "https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";
const KPI = [
  { c: "#db3433", t: "#fef0f0" },
  { c: "#6b7280", t: "#f3f4f6" },
  { c: "#374151", t: "#f9fafb" },
  { c: "#111827", t: "#f9fafb" },
];

const NAV = [
  { id: "overview", label: "Overview", icon: "clusters" },
  { id: "dimensions", label: "8 Dimensions", icon: "radar" },
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

const DIM_TAB_LABEL: Record<string, string> = {
  personality: "Personality", career_interest: "Interests", multiple_intelligence: "Intelligences",
  emotional_intelligence: "EI", learning_styles: "Learning", motivators: "Values",
  strengths: "Strengths", aptitude: "Aptitude",
};

const BENCH: Record<string, number> = {
  personality: 48, career_interest: 50, multiple_intelligence: 50, emotional_intelligence: 60,
  learning_styles: 50, motivators: 50, strengths: 50, aptitude: 50,
};

export default function DashboardMobile({
  a, name, email, profile, onSignOut,
}: {
  a: AssessmentSummary, name?: string, email?: string, profile?: UserProfile, onSignOut?: () => void,
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<"dashboard" | "report" | "feature">("dashboard");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [dimKey, setDimKey] = useState<string>("personality");
  const [active, setActive] = useState("overview");
  const router = useRouter();
  const first = (name || "You").split(" ")[0];
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  const navItems = SHOW_TOOLKIT ? NAV.slice(0, 5) : NAV;
  const extraSections: any[] = [];
  const extrasBefore = (id: string) => extraSections.filter((x) => x.position === "before").map((x) => x.node);

  const go = (id: string) => {
    setActive(id);
    setNavOpen(false);
    const featureRoutes: Record<string, string> = {
      "careers": "/account/career-library",
      "study-abroad": "/account/features/study-abroad",
      "exams": "/account/features/entrance-exams",
      "internships": "/account/internships-new",
      "financial": "/account/features/financial-literacy",
      "legal": "/account/features/legal-resources",
      "research": "/account/features/research",
      "startups": "/account/features/startups",
      "resources": "/account/features/scholarships",
    };

    if (featureRoutes[id]) {
      router.push(featureRoutes[id]);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const radar: RadarDatum[] = useMemo(() => {
    const src = ((a.radar ?? []).length ? a.radar! : []).map((r) => ({ ...r, bench: BENCH[r.key] || 50 }));
    return CANON.map((k) => src.find((r) => r.key === k) ?? { key: k, label: CAT_LABEL[k], score: 0, bench: BENCH[k] || 50 });
  }, [a.radar]);

  const fits = domainFit(a);
  const topField = fits[0];
  const topDomainName = topField?.name ?? "your best-fit field";
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

  // Mobile responsive styles
  const mobileStyles = `
    @media (max-width: 768px) {
      .dashboard-hero {
        flex-direction: column !important;
        padding: 24px 16px !important;
        gap: 24px !important;
      }

      .dashboard-hero-image {
        flex: 1 !important;
        max-height: 250px !important;
      }

      .dashboard-title {
        font-size: 28px !important;
      }

      .dashboard-grid {
        grid-template-columns: 1fr !important;
      }

      .dashboard-kpis {
        grid-template-columns: 1fr !important;
      }

      .dashboard-feature-grid {
        grid-template-columns: 1fr !important;
      }

      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 80%;
        height: 100vh;
        z-index: 50;
        transform: translateX(-100%);
        transition: transform 300ms ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .dashboard-scrim {
        display: block !important;
      }

      .dashboard-top {
        padding: 12px 16px !important;
      }

      .dashboard-top-text {
        font-size: 16px !important;
      }

      .dashboard-section {
        padding: 20px 16px !important;
        margin: 0 -16px !important;
      }
    }

    @media (max-width: 480px) {
      .dashboard-title {
        font-size: 24px !important;
      }

      .dashboard-description {
        font-size: 14px !important;
      }

      .dashboard-feature-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }

      .dashboard-kpis {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  if (view === "report") {
    return (
      <div className="ogd-reportwrap">
        <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
        <div className="ogd-reportbar og-noprint">
          <button className="ogd-btn ghost" onClick={() => { setView("dashboard"); window.scrollTo(0, 0); }}>
            <Icon name="chevronLeft" size={16} /> Back
          </button>
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />

      {/* Scrim */}
      {navOpen && (
        <div
          className="dashboard-scrim"
          onClick={() => setNavOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: "250px", background: "#f9fafb", borderRight: "1px solid #e5e7eb", overflow: "auto",
          transition: "transform 300ms ease"
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Logo height={40} />
          </Link>
        </div>

        <nav style={{ padding: "16px 0" }}>
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              style={{
                width: "100%", padding: "12px 16px", border: "none", background: active === n.id ? "#f0e7ff" : "transparent",
                color: active === n.id ? "#7c3aed" : "#374151", cursor: "pointer", textAlign: "left",
                fontSize: "14px", fontWeight: "500", transition: "all 200ms"
              }}
            >
              <span style={{ marginRight: "8px" }}>
                <Icon name={n.icon} size={16} />
              </span>
              {n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600" }}>
              {initial}
            </div>
            <div style={{ fontSize: "12px" }}>
              <div style={{ fontWeight: "600", color: "#111827" }}>{name || "You"}</div>
              <div style={{ color: "#6b7280", marginTop: "2px" }}>{email}</div>
            </div>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              style={{ width: "100%", padding: "8px", background: "#fee2e2", border: "none", borderRadius: "6px", color: "#991b1b", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top Bar */}
        <header
          className="dashboard-top"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb", background: "#fff"
          }}
        >
          <button
            onClick={() => setNavOpen(!navOpen)}
            style={{
              display: "none",
              background: "none", border: "none", cursor: "pointer", fontSize: "18px"
            }}
            className="dashboard-burger"
          >
            <Icon name="clusters" size={20} />
          </button>

          <div className="dashboard-top-text">
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>Welcome back, {first}</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>Your career assessment overview</div>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: "36px", height: "36px", borderRadius: "50%", background: "#7c3aed", color: "#fff",
              border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600"
            }}
          >
            {initial}
          </button>
        </header>

        {/* Main */}
        <main style={{ padding: "24px 16px", maxWidth: "100%", margin: "0 auto" }}>
          {/* Banner */}
          <div
            style={{
              background: "#fef0f0", border: `1px solid ${IN_LINE}`, borderRadius: "8px",
              padding: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px"
            }}
          >
            <Icon name="check" size={20} style={{ color: IN, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>Assessment complete</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                Your personalised results are ready{dateStr ? ` · ${dateStr}` : ""}
              </div>
            </div>
            <button
              onClick={() => setView("report")}
              style={{
                background: IN, color: "#fff", border: "none", borderRadius: "6px",
                padding: "8px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"
              }}
            >
              View report
            </button>
          </div>

          {/* Hero */}
          <div
            className="dashboard-hero"
            style={{
              background: "#1f2937", color: "#fff", borderRadius: "12px", padding: "32px 24px",
              marginBottom: "24px", display: "flex", gap: "32px", alignItems: "center"
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#9ca3af", marginBottom: "8px" }}>
                Your archetype
              </div>
              <div className="dashboard-title" style={{ fontSize: "36px", fontWeight: "700", marginBottom: "8px" }}>
                {arch.name}
              </div>
              <div style={{ width: "60px", height: "3px", background: IN, marginBottom: "12px", borderRadius: "2px" }} />
              <div className="dashboard-description" style={{ fontSize: "15px", color: "#d1d5db", lineHeight: "1.6", marginBottom: "16px" }}>
                {a.summary || arch.tagline}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {code && <span style={{ background: "#374151", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}><b>{code}</b> interest code</span>}
                {a.topCareer && <span style={{ background: "#374151", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}><b>{a.topCareer}</b> best fit</span>}
              </div>
            </div>

            <div className="dashboard-hero-image" style={{ flex: 1, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", minWidth: 0 }}>
              <div style={{ width: "140px", height: "140px" }}>
                <Ring value={topInterestScore} size={140} stroke={11} color={IN} track="rgba(255,255,255,0.1)">
                  <div style={{ fontSize: "28px", fontWeight: "700" }}>{topInterestScore}<span style={{ fontSize: "16px" }}>%</span></div>
                  <div style={{ fontSize: "12px", marginTop: "4px", color: "#d1d5db" }}>{topInterestName}</div>
                </Ring>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div
            className="dashboard-kpis"
            style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px",
              marginBottom: "24px"
            }}
          >
            {[
              { icon: "star", label: "Strongest interest", value: topInterestName, sub: `${topInterestScore}% of answers` },
              { icon: "career_interest", label: "Interest code", value: code || "—", sub: "Holland RIASEC" },
              { icon: "motivators", label: "Strongest area", value: strongest ? String(Math.round(strongest.score)) : "—", sub: strongest ? CAT_LABEL[strongest.key] : "" },
              { icon: "heart", label: "Emotional Intelligence", value: a.ei != null ? String(Math.round(a.ei)) : "—", sub: "Strong EQ" },
            ].map((kpi, i) => (
              <div key={i} style={{ background: KPI[i].t, border: `1px solid ${IN_LINE}`, borderRadius: "8px", padding: "16px" }}>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>{kpi.label}</div>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{kpi.value}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="dashboard-section" style={{ background: "linear-gradient(135deg, #f0e7ff 0%, #e8f4ff 100%)", borderRadius: "12px" }}>
            <h2 className="dashboard-title" style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px" }}>
              Your Career Toolkit
            </h2>
            <p className="dashboard-description" style={{ fontSize: "14px", color: "#374151", marginBottom: "20px", lineHeight: "1.6" }}>
              Access resources to shape your future — colleges, internships, scholarships, and strategies tailored to you.
            </p>

            <div className="dashboard-feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
              {[
                { id: "startups", title: "Startups", emoji: "🚀", color: "#ea580c" },
                { id: "research", title: "Research", emoji: "🔬", color: "#0369a1" },
                { id: "financial", title: "Finance", emoji: "₹", color: "#16a34a" },
                { id: "legal", title: "Law", emoji: "⚖️", color: "#7c3aed" },
                { id: "careers", title: "Careers", emoji: "🎓", color: "#2563eb" },
                { id: "study-abroad", title: "Study Abroad", emoji: "✈️", color: "#dc2626" },
                { id: "exams", title: "Exams", emoji: "📝", color: "#9333ea" },
                { id: "internships", title: "Internships", emoji: "💼", color: "#ca8a04" },
              ].map((f) => (
                <div
                  key={f.id}
                  onClick={() => go(f.id)}
                  style={{
                    background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px",
                    cursor: "pointer", transition: "all 200ms", textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{f.emoji}</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{f.title}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
