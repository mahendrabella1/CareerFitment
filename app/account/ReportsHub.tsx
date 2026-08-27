"use client";

/**
 * Reports Hub - Unified interface for all reports and AI assistant
 * Integrates:
 * - Comprehensive Career Report (existing)
 * - Career Fit Report (new)
 * - Career Roadmap Report (new)
 * - AI Education Assistant
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { Card, SectionHeader, Badge } from "@/app/account/components";
import { Icon } from "@/app/Icons";

// Lazy load reports (they're large)
const ComprehensiveReport = dynamic(() => import("@/app/account/FullReport"), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
});

const CareerFitReportComponent = dynamic(() => import("@/app/account/CareerFitReport"), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
});

const CareerRoadmapReportComponent = dynamic(() => import("@/app/account/CareerRoadmapReport"), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
});

const AIAssistant = dynamic(
  () => import("@/app/account/components/AIEducationAssistant").then((m) => ({ default: m.AIEducationAssistant })),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder />,
  }
);

function LoadingPlaceholder() {
  return (
    <div style={{ padding: spacing[8], textAlign: "center", color: colors.ink[40] }}>
      <div style={{ marginBottom: spacing[4] }}>⏳ Loading...</div>
      <div style={{ fontSize: "12px" }}>Preparing your report</div>
    </div>
  );
}

type ReportType = "comprehensive" | "career_fit" | "roadmap" | "ai_assistant";

interface ReportTabProps {
  id: ReportType;
  label: string;
  icon: string;
  description: string;
}

const REPORTS: ReportTabProps[] = [
  {
    id: "comprehensive",
    label: "Complete Report",
    icon: "📋",
    description: "30+ sections with full profile analysis",
  },
  {
    id: "career_fit",
    label: "Career Fit",
    icon: "🎯",
    description: "Top careers matched to your profile",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: "🗺️",
    description: "8-phase personalized career timeline",
  },
  {
    id: "ai_assistant",
    label: "Ask AI",
    icon: "🤖",
    description: "Ask education & career questions (7 per month)",
  },
];

export default function ReportsHub({
  a,
  profile,
  email,
  studentId,
}: {
  a: AssessmentSummary;
  profile?: UserProfile | null;
  email?: string | null;
  studentId?: string;
}) {
  const [activeReport, setActiveReport] = useState<ReportType>("comprehensive");
  const [showAI, setShowAI] = useState(false);

  const studentName = (email || "").split("@")[0] || "Student";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.ink[95] }}>
      {/* Header */}
      <div
        style={{
          padding: spacing[6],
          borderBottom: `1px solid ${colors.ink[80]}`,
          backgroundColor: colors.ink[100],
          boxShadow: shadows.sm,
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: typography.scale.h1.fontSize,
              fontWeight: 700,
              color: colors.ink[10],
              margin: 0,
              marginBottom: spacing[2],
            }}
          >
            📚 Career Reports & Guidance
          </h1>
          <p
            style={{
              fontSize: typography.scale.body.fontSize,
              color: colors.ink[40],
              margin: 0,
            }}
          >
            Choose from comprehensive analysis, focused career recommendations, personalized roadmap, or ask the AI assistant
          </p>
        </div>
      </div>

      {/* Report Tabs */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.ink[80]}`,
          backgroundColor: colors.ink[100],
          display: "flex",
          gap: spacing[2],
          overflowX: "auto",
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {REPORTS.map((report) => (
          <button
            key={report.id}
            onClick={() => {
              setActiveReport(report.id);
              if (report.id === "ai_assistant") {
                setShowAI(true);
              }
            }}
            style={{
              padding: `${spacing[3]} ${spacing[4]}`,
              backgroundColor: activeReport === report.id ? colors.ink[95] : "transparent",
              border: activeReport === report.id ? `2px solid ${colors.accent[40]}` : "none",
              borderRadius: radius.md,
              cursor: "pointer",
              fontSize: typography.scale.sm.fontSize,
              fontWeight: 600,
              color: activeReport === report.id ? colors.accent[40] : colors.ink[40],
              transition: `all 180ms ease-out`,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: spacing[1],
            }}
            onMouseEnter={(e) => {
              if (activeReport !== report.id) {
                e.currentTarget.style.backgroundColor = colors.ink[95];
              }
            }}
            onMouseLeave={(e) => {
              if (activeReport !== report.id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <span>{report.icon}</span>
            <span>{report.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: spacing[6],
        }}
      >
        {/* Comprehensive Report */}
        {activeReport === "comprehensive" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing[4],
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: typography.scale.h2.fontSize,
                    fontWeight: 700,
                    color: colors.ink[10],
                    margin: 0,
                  }}
                >
                  Complete Career Report
                </h2>
                <p
                  style={{
                    fontSize: typography.scale.sm.fontSize,
                    color: colors.ink[40],
                    margin: "4px 0 0",
                  }}
                >
                  30+ sections with comprehensive profile analysis
                </p>
              </div>
              <div style={{ display: "flex", gap: spacing[2] }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.accent[40],
                    color: colors.ink[100],
                    border: "none",
                    borderRadius: radius.md,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  🖨️ Print/PDF
                </button>
              </div>
            </div>
            <div
              style={{
                backgroundColor: colors.ink[100],
                borderRadius: radius.lg,
                overflow: "hidden",
              }}
            >
              <ComprehensiveReport a={a} name={studentName} />
            </div>
          </div>
        )}

        {/* Career Fit Report */}
        {activeReport === "career_fit" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing[4],
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: typography.scale.h2.fontSize,
                    fontWeight: 700,
                    color: colors.ink[10],
                    margin: 0,
                  }}
                >
                  Career Fit Report
                </h2>
                <p
                  style={{
                    fontSize: typography.scale.sm.fontSize,
                    color: colors.ink[40],
                    margin: "4px 0 0",
                  }}
                >
                  Top careers matched to your profile
                </p>
              </div>
              <div style={{ display: "flex", gap: spacing[2] }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.accent[40],
                    color: colors.ink[100],
                    border: "none",
                    borderRadius: radius.md,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  🖨️ Print/PDF
                </button>
              </div>
            </div>
            <div
              style={{
                backgroundColor: colors.ink[100],
                borderRadius: radius.lg,
                overflow: "hidden",
              }}
            >
              <CareerFitReportComponent a={a} name={studentName} />
            </div>
          </div>
        )}

        {/* Career Roadmap Report */}
        {activeReport === "roadmap" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing[4],
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: typography.scale.h2.fontSize,
                    fontWeight: 700,
                    color: colors.ink[10],
                    margin: 0,
                  }}
                >
                  Career Roadmap
                </h2>
                <p
                  style={{
                    fontSize: typography.scale.sm.fontSize,
                    color: colors.ink[40],
                    margin: "4px 0 0",
                  }}
                >
                  8-phase personalized timeline from Class 9 to career
                </p>
              </div>
              <div style={{ display: "flex", gap: spacing[2] }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.accent[40],
                    color: colors.ink[100],
                    border: "none",
                    borderRadius: radius.md,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  🖨️ Print/PDF
                </button>
              </div>
            </div>
            <div
              style={{
                backgroundColor: colors.ink[100],
                borderRadius: radius.lg,
                overflow: "hidden",
              }}
            >
              <CareerRoadmapReportComponent a={a} name={studentName} />
            </div>
          </div>
        )}

        {/* AI Assistant */}
        {activeReport === "ai_assistant" && (
          <div>
            <div style={{ marginBottom: spacing[4] }}>
              <h2
                style={{
                  fontSize: typography.scale.h2.fontSize,
                  fontWeight: 700,
                  color: colors.ink[10],
                  margin: 0,
                  marginBottom: spacing[2],
                }}
              >
                🤖 AI Education Assistant
              </h2>
              <p
                style={{
                  fontSize: typography.scale.body.fontSize,
                  color: colors.ink[40],
                  margin: 0,
                }}
              >
                Ask questions about careers, colleges, exams, and career planning. You have 7 questions per month.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: spacing[4], maxHeight: "600px" }}>
              {studentId && (
                <AIAssistant
                  studentId={studentId}
                  context={{
                    class: 10,
                    name: studentName,
                    topCareerCluster: "Technology",
                  }}
                  onClose={() => setShowAI(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          [role="button"] {
            display: none;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
