"use client";

/**
 * OneGrasp Dashboard – Production-Grade SaaS Redesign
 *
 * A clean, purposeful interface inspired by Linear, Stripe, and Notion.
 * Clear information hierarchy: Who am I? → What fits me? → What can I do?
 *
 * Architecture:
 *   · Hero        – Archetype + interest strength (what defines the student)
 *   · Top Matches – Top 3 career fits with images (primary action)
 *   · Dimensions  – 8-point radar + grid of dimension insights
 *   · Action Plan – 30/90-day goal tracker
 *   · Resources   – Career toolkit links (tertiary)
 *   · Full Report – Deep-dive link (secondary action)
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, SkillBar, RadarChart, type RadarDatum } from "@/app/account/viz";
import { TOOLKIT_TABS } from "@/app/account/toolkitData";
import {
  archetype, actionPlan, domainFit, percentileOf, subTraits, resultOf, categoryDeepDive,
} from "@/lib/report/knowledge";

// Components
import { Card, CardGrid, SectionHeader, Badge, PageContainer, HeroCard, HeroContent } from "@/app/account/components";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";

// Lazy load full report (large bundle)
const FullReport = dynamic(() => import("@/app/account/FullReport"), {
  ssr: false,
  loading: () => <div style={{ padding: spacing[8], textAlign: "center", color: colors.ink[40] }}>Preparing your report…</div>,
});

// Dimension canonical list
const CANON = [
  "personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
  "learning_styles", "motivators", "strengths", "aptitude",
] as const;

const CAT_LABEL: Record<string, string> = {
  personality: "Personality",
  career_interest: "Career Interest",
  multiple_intelligence: "Multiple Intelligence",
  emotional_intelligence: "Emotional Intelligence",
  learning_styles: "Learning Style",
  motivators: "Motivators",
  strengths: "Strengths",
  aptitude: "Aptitude",
};

const DIM_TAB_LABEL: Record<string, string> = {
  personality: "Personality",
  career_interest: "Interests",
  multiple_intelligence: "Intelligence",
  emotional_intelligence: "EQ",
  learning_styles: "Learning",
  motivators: "Motivators",
  strengths: "Strengths",
  aptitude: "Aptitude",
};

const BENCH: Record<string, number> = {
  personality: 55,
  career_interest: 52,
  multiple_intelligence: 54,
  emotional_intelligence: 56,
  learning_styles: 58,
  motivators: 55,
  strengths: 50,
  aptitude: 52,
};

const bandLabel = (p: number) =>
  p >= 80 ? "Standout" : p >= 65 ? "Strength" : p >= 50 ? "Solid" : p >= 35 ? "Emerging" : "Developing";

const SHOW_TOOLKIT = true;

export default function DashboardRedesigned({
  a, profile, email, onSignOut,
}: {
  a: AssessmentSummary;
  profile?: UserProfile | null;
  email?: string | null;
  onSignOut?: () => void;
}) {
  const [view, setView] = useState<"dashboard" | "report">("dashboard");
  const [toolkitTab, setToolkitTab] = useState(TOOLKIT_TABS[0].id);
  const [dimKey, setDimKey] = useState<string>(() => {
    const top = (a.radar ?? []).slice().sort((x, y) => y.score - x.score)[0];
    return top?.key || CANON[0];
  });

  // Get archetype info
  const arch = archetype(a);
  const topRing = (a.radar ?? []).slice().sort((x, y) => y.score - x.score)[0];
  const topDimLabel = topRing?.key ? CAT_LABEL[topRing.key] || topRing.key : "Personality";

  // Get top 3 career matches
  const topMatches = (a.clusters ?? [])
    .slice(0, 3)
    .map((c) => ({
      rank: c.cluster,
      title: c.cluster.charAt(0).toUpperCase() + c.cluster.slice(1),
      fit: c.score,
      verdict: c.score >= 65 ? "Top choice" : "Strong fit",
    }));

  // Build radar data
  const radarData: RadarDatum[] = (a.radar ?? [])
    .filter((r) => CANON.includes(r.key as any))
    .map((r) => ({
      key: r.key,
      label: DIM_TAB_LABEL[r.key] || r.key,
      score: r.score,
      bench: BENCH[r.key] || 50,
    }));

  // Get toolkit items
  const currentToolkit = TOOLKIT_TABS.find((t) => t.id === toolkitTab)?.items || [];

  if (view === "report") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: colors.ink[100] }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: spacing[4],
            borderBottom: `1px solid ${colors.ink[80]}`,
            backgroundColor: colors.ink[95],
          }}
        >
          <Logo height={40} />
          <button
            onClick={() => setView("dashboard")}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: colors.ink[100],
              border: `1px solid ${colors.ink[80]}`,
              borderRadius: radius.md,
              fontSize: typography.scale.sm.fontSize,
              color: colors.ink[10],
              cursor: "pointer",
              fontWeight: 600,
              transition: `background-color ${180}ms ease-out`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.ink[90])}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.ink[100])}
          >
            ← Back to Dashboard
          </button>
        </div>
        <FullReport a={a} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.ink[95] }}>
      {/* Header */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.ink[80]}`,
          backgroundColor: colors.ink[100],
          boxShadow: shadows.sm,
        }}
      >
        <PageContainer>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Logo height={40} />
            <div style={{ display: "flex", alignItems: "center", gap: spacing[4], fontSize: typography.scale.sm.fontSize }}>
              <span style={{ color: colors.ink[40] }}>{email}</span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.ink[95],
                    border: "none",
                    borderRadius: radius.md,
                    color: colors.ink[10],
                    cursor: "pointer",
                    fontSize: typography.scale.sm.fontSize,
                    transition: `background-color ${180}ms ease-out`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.ink[80])}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.ink[95])}
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Main Content */}
      <PageContainer style={{ paddingTop: spacing[8], paddingBottom: spacing[8] }}>
        {/* ===== HERO SECTION: Who Am I? ===== */}
        <HeroCard withGradient>
          <HeroContent
            title={arch.name || "Your Career Profile"}
            subtitle={arch.tagline}
            icon={arch.icon ? <Icon type={arch.icon} /> : undefined}
            metadata={[
              { label: "Top Strength", value: topDimLabel },
              {
                label: "Interest Strength",
                value: (
                  <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
                    <span style={{ color: colors.accent[40], fontWeight: 700, fontSize: "16px" }}>
                      {topRing?.score || 0}%
                    </span>
                    <span style={{ color: colors.ink[50], fontSize: "11px" }}>
                      {bandLabel(topRing?.score || 0)}
                    </span>
                  </div>
                ),
              },
              {
                label: "Profile Completion",
                value: (
                  <div style={{ fontSize: "14px", fontWeight: 600, color: colors.success }}>
                    100% Complete
                  </div>
                ),
              },
            ]}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setView("report");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: spacing[2],
                padding: `${spacing[2]} ${spacing[3]}`,
                backgroundColor: colors.accent[40],
                color: colors.ink[100],
                borderRadius: radius.md,
                textDecoration: "none",
                fontSize: typography.scale.sm.fontSize,
                fontWeight: 600,
                cursor: "pointer",
                transition: `background-color ${180}ms ease-out`,
                marginTop: spacing[4],
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.accent[30])}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.accent[40])}
            >
              View Full Report →
            </Link>
          </HeroContent>
        </HeroCard>

        {/* ===== TOP CAREER MATCHES: What Fits Me? ===== */}
        <SectionHeader
          title="Your Top Career Matches"
          subtitle={`Based on your ${topDimLabel.toLowerCase()} profile and assessment results`}
          icon={<Icon type="compass" />}
        />
        <CardGrid columns={3} gap={spacing[4]} style={{ marginBottom: spacing[8] }}>
          {topMatches.map((match) => (
            <Card key={match.rank} variant="elevated">
              <div style={{ display: "flex", alignItems: "flex-start", gap: spacing[3] }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    backgroundColor: colors.accent[100],
                    borderRadius: "50%",
                    color: colors.accent[40],
                    fontWeight: 700,
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  #{match.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: typography.scale.h3.fontSize, fontWeight: 600, color: colors.ink[10], marginBottom: spacing[1] }}>
                    {match.title}
                  </h3>
                  <Badge variant="success" size="sm">
                    {match.verdict}
                  </Badge>
                  <div style={{ marginTop: spacing[2] }}>
                    <div style={{ fontSize: "11px", color: colors.ink[50], marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                      Fit Score
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: colors.accent[40] }}>
                      {match.fit}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardGrid>

        {/* ===== YOUR 8 DIMENSIONS ===== */}
        <SectionHeader
          title="Your 8 Dimensions"
          subtitle="How you think, work, and learn"
          icon={<Icon type="radar" />}
        />

        {/* Radar Chart */}
        <Card
          variant="elevated"
          padding="lg"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: spacing[6],
            minHeight: "300px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            {radarData.length > 0 && <RadarChart data={radarData} />}
          </div>
        </Card>

        {/* Dimension Grid */}
        <CardGrid columns={4} gap={spacing[4]} style={{ marginBottom: spacing[8] }}>
          {radarData.map((dim) => (
            <Card
              key={dim.key}
              variant="subtle"
              padding="md"
              style={{
                cursor: "pointer",
                transition: `background-color ${180}ms ease-out, border-color ${180}ms ease-out`,
              }}
              onClick={() => setDimKey(dim.key)}
              clickable
            >
              <div style={{ display: "flex", flexDirection: "column", gap: spacing[1] }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em", color: colors.ink[50] }}>
                  {dim.label}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: colors.accent[40] }}>
                  {dim.score}
                </div>
                <div style={{ fontSize: "11px", color: colors.ink[40] }}>
                  {bandLabel(dim.score)} vs. typical {Math.round(dim.bench)}
                </div>
              </div>
            </Card>
          ))}
        </CardGrid>

        {/* ===== ACTION PLAN: What Can I Do? ===== */}
        <SectionHeader
          title="30/90-Day Action Plan"
          subtitle="Build momentum with achievable goals"
          icon={<Icon type="check" />}
        />
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing[8] }}>
          <GoalTracker />
        </Card>

        {/* ===== CAREER RESOURCES ===== */}
        {SHOW_TOOLKIT && (
          <>
            <SectionHeader
              title="Career Toolkit"
              subtitle="Everything you need to explore careers and build your future"
              icon={<Icon type="briefcase" />}
            />

            {/* Toolkit Tabs */}
            <div
              style={{
                display: "flex",
                gap: spacing[2],
                marginBottom: spacing[4],
                borderBottom: `1px solid ${colors.ink[80]}`,
                overflowX: "auto",
              }}
            >
              {TOOLKIT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setToolkitTab(tab.id)}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: toolkitTab === tab.id ? `2px solid ${colors.accent[40]}` : "1px solid transparent",
                    color: toolkitTab === tab.id ? colors.accent[40] : colors.ink[40],
                    cursor: "pointer",
                    fontSize: typography.scale.sm.fontSize,
                    fontWeight: 600,
                    transition: `color ${180}ms ease-out, border-color ${180}ms ease-out`,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (toolkitTab !== tab.id) e.currentTarget.style.color = colors.ink[10];
                  }}
                  onMouseLeave={(e) => {
                    if (toolkitTab !== tab.id) e.currentTarget.style.color = colors.ink[40];
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Toolkit Grid */}
            <CardGrid columns={2} gap={spacing[4]} style={{ marginBottom: spacing[8] }}>
              {currentToolkit.slice(0, 6).map((item, idx) => (
                <Card key={idx} variant="subtle" padding="md" clickable>
                  <div style={{ display: "flex", gap: spacing[3] }}>
                    {item.icon && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          backgroundColor: colors.accent[100],
                          borderRadius: radius.md,
                          color: colors.accent[40],
                          flexShrink: 0,
                        }}
                      >
                        <Icon type={item.icon} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: typography.scale.body.fontSize, fontWeight: 600, color: colors.ink[10] }}>
                        {item.name}
                      </h3>
                      {item.meta && (
                        <p style={{ margin: 0, marginTop: spacing[1], fontSize: "12px", color: colors.ink[40] }}>
                          {item.meta}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </CardGrid>
          </>
        )}

        {/* Footer CTA - Reports & AI */}
        <div
          style={{
            padding: spacing[6],
            borderTop: `1px solid ${colors.ink[80]}`,
            marginTop: spacing[8],
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: spacing[4] }}>
            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.accent[100],
                borderRadius: radius.lg,
                border: `2px solid ${colors.accent[40]}`,
              }}
            >
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 14, color: colors.ink[10] }}>
                📋 Comprehensive Report
              </p>
              <p style={{ margin: 0, fontSize: 13, color: colors.ink[40], lineHeight: 1.5, marginBottom: spacing[2] }}>
                30+ sections with full profile analysis
              </p>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setView("report");
                }}
                style={{
                  display: "inline-block",
                  padding: `${spacing[2]} ${spacing[3]}`,
                  backgroundColor: colors.accent[40],
                  color: colors.ink[100],
                  borderRadius: radius.md,
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Report →
              </Link>
            </div>

            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.ink[90],
                borderRadius: radius.lg,
                border: `1px solid ${colors.ink[80]}`,
              }}
            >
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 14, color: colors.ink[10] }}>
                🎯 Career Fit Report
              </p>
              <p style={{ margin: 0, fontSize: 13, color: colors.ink[40], lineHeight: 1.5, marginBottom: spacing[2] }}>
                Top careers matched to your profile
              </p>
              <Link
                href="/account/reports"
                style={{
                  display: "inline-block",
                  padding: `${spacing[2]} ${spacing[3]}`,
                  backgroundColor: colors.ink[40],
                  color: colors.ink[100],
                  borderRadius: radius.md,
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Report →
              </Link>
            </div>

            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.ink[90],
                borderRadius: radius.lg,
                border: `1px solid ${colors.ink[80]}`,
              }}
            >
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 14, color: colors.ink[10] }}>
                🤖 AI Assistant
              </p>
              <p style={{ margin: 0, fontSize: 13, color: colors.ink[40], lineHeight: 1.5, marginBottom: spacing[2] }}>
                Ask education & career questions (7/month)
              </p>
              <Link
                href="/account/reports"
                style={{
                  display: "inline-block",
                  padding: `${spacing[2]} ${spacing[3]}`,
                  backgroundColor: colors.ink[40],
                  color: colors.ink[100],
                  borderRadius: radius.md,
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Open Assistant →
              </Link>
            </div>

            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.accent[100],
                borderRadius: radius.lg,
                border: `2px solid ${colors.accent[40]}`,
              }}
            >
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 14, color: colors.ink[10] }}>
                🌟 Explore All Features
              </p>
              <p style={{ margin: 0, fontSize: 13, color: colors.ink[40], lineHeight: 1.5, marginBottom: spacing[2] }}>
                500+ careers, internships, study abroad & more
              </p>
              <Link
                href="/account/features"
                style={{
                  display: "inline-block",
                  padding: `${spacing[2]} ${spacing[3]}`,
                  backgroundColor: colors.accent[40],
                  color: colors.ink[100],
                  borderRadius: radius.md,
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Explore Features →
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

// ============================================================================
// GOAL TRACKER COMPONENT
// ============================================================================

function GoalTracker() {
  const [goals30, setGoals30] = useState<string[]>([]);
  const [goals90, setGoals90] = useState<string[]>([]);
  const [checked30, setChecked30] = useState<boolean[]>([]);
  const [checked90, setChecked90] = useState<boolean[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("og_goals");
    if (saved) {
      const { goals30: g30, goals90: g90, checked30: c30, checked90: c90 } = JSON.parse(saved);
      setGoals30(g30 || []);
      setGoals90(g90 || []);
      setChecked30(c30 || []);
      setChecked90(c90 || []);
    }
  }, []);

  const save = () => {
    localStorage.setItem("og_goals", JSON.stringify({ goals30, goals90, checked30, checked90 }));
  };

  return (
    <div>
      <div style={{ marginBottom: spacing[6] }}>
        <h3 style={{ margin: 0, marginBottom: spacing[3], fontSize: typography.scale.h3.fontSize, fontWeight: 600, color: colors.ink[10] }}>
          30-Day Sprint
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
          {(goals30 || []).map((g, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: spacing[2], cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={checked30[i] || false}
                onChange={(e) => {
                  const newChecked = [...checked30];
                  newChecked[i] = e.target.checked;
                  setChecked30(newChecked);
                  save();
                }}
                style={{ width: "16px", height: "16px", accentColor: colors.accent[40], cursor: "pointer" }}
              />
              <span style={{ color: checked30[i] ? colors.ink[50] : colors.ink[10], textDecoration: checked30[i] ? "line-through" : "none" }}>
                {g}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ margin: 0, marginBottom: spacing[3], fontSize: typography.scale.h3.fontSize, fontWeight: 600, color: colors.ink[10] }}>
          90-Day Roadmap
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
          {(goals90 || []).map((g, i) => (
            <label key={i} style={{ display: "flex", alignItems: "center", gap: spacing[2], cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={checked90[i] || false}
                onChange={(e) => {
                  const newChecked = [...checked90];
                  newChecked[i] = e.target.checked;
                  setChecked90(newChecked);
                  save();
                }}
                style={{ width: "16px", height: "16px", accentColor: colors.accent[40], cursor: "pointer" }}
              />
              <span style={{ color: checked90[i] ? colors.ink[50] : colors.ink[10], textDecoration: checked90[i] ? "line-through" : "none" }}>
                {g}
              </span>
            </label>
          ))}
        </div>
      </div>

      <p style={{ marginTop: spacing[4], fontSize: typography.scale.sm.fontSize, color: colors.ink[40] }}>
        💡 Goals automatically saved to your browser
      </p>
    </div>
  );
}
