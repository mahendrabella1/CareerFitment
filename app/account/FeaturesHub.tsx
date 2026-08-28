"use client";

import { useState } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import CareerLibrary from "@/app/account/features/CareerLibrary";
import StudyAbroad from "@/app/account/features/StudyAbroad";
import { getInternships, getWorkshops, getScholarships } from "@/lib/data/internshipsData";
import { getFinancialTopics, getTopicsByCategory } from "@/lib/data/financialLiteracyData";
import { getLegalResources, getResourcesByCategory } from "@/lib/data/legalResourcesData";
import { getResearchOpportunities } from "@/lib/data/researchData";
import { getAllStartups, getUnicorns } from "@/lib/data/startupsData";

const FEATURES = [
  {
    id: "careers",
    name: "Career Library",
    icon: "💼",
    desc: "500+ careers with salary, skills, and education paths",
    color: colors.accent[40],
  },
  {
    id: "study-abroad",
    name: "Study Abroad",
    icon: "✈️",
    desc: "100+ universities across 20 countries with costs",
    color: colors.accent[40],
  },
  {
    id: "internships",
    name: "Internships & Opportunities",
    icon: "🎯",
    desc: "300+ internships, 100+ workshops, 200+ scholarships",
    color: colors.accent[40],
  },
  {
    id: "financial",
    name: "Financial Literacy",
    icon: "💰",
    desc: "30+ topics on money, investing, taxes, and planning",
    color: colors.ink[50],
  },
  {
    id: "legal",
    name: "Legal Resources",
    icon: "⚖️",
    desc: "20+ guides on rights, safety, cyber law, and more",
    color: "#6366f1",
  },
  {
    id: "research",
    name: "Research Opportunities",
    icon: "🔬",
    desc: "50+ programs, competitions, and conferences",
    color: "#ec4899",
  },
  {
    id: "startups",
    name: "Startup Ecosystem",
    icon: "🚀",
    desc: "100+ startups and entrepreneurship resources",
    color: "#f97316",
  },
];

export default function FeaturesHub() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleFeatureClick = (featureId: string) => {
    if (activeFeature === featureId) {
      setActiveFeature(null);
    } else {
      setActiveFeature(featureId);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Your Future</h1>
        <p style={styles.subtitle}>Comprehensive resources for career exploration, education, skills, and opportunities</p>
      </div>

      {/* Feature Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabsScrollable}>
          {FEATURES.map(feature => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              style={{
                ...styles.tab,
                ...(activeFeature === feature.id ? { ...styles.tabActive, backgroundColor: feature.color, color: "#fff" } : {}),
              }}
            >
              <span style={styles.tabIcon}>{feature.icon}</span>
              <span style={styles.tabName}>{feature.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Grid - Overview */}
      {!activeFeature && (
        <div style={styles.featuresGrid}>
          {FEATURES.map(feature => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              style={{
                ...styles.featureCard,
                borderLeftColor: feature.color,
                cursor: "pointer",
              }}
            >
              <span style={styles.featureIcon}>{feature.icon}</span>
              <h3 style={styles.featureName}>{feature.name}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
              <span style={styles.arrow}>→</span>
            </div>
          ))}
        </div>
      )}

      {/* Feature Detail View */}
      {activeFeature === "careers" && (
        <div style={styles.featureDetailContainer}>
          <CareerLibrary />
        </div>
      )}

      {activeFeature === "study-abroad" && (
        <div style={styles.featureDetailContainer}>
          <StudyAbroad />
        </div>
      )}

      {activeFeature === "internships" && (
        <div style={styles.featureDetailContainer}>
          <InternshipsPage />
        </div>
      )}

      {activeFeature === "financial" && (
        <div style={styles.featureDetailContainer}>
          <FinancialLiteracyPage />
        </div>
      )}

      {activeFeature === "legal" && (
        <div style={styles.featureDetailContainer}>
          <LegalResourcesPage />
        </div>
      )}

      {activeFeature === "research" && (
        <div style={styles.featureDetailContainer}>
          <ResearchPage />
        </div>
      )}

      {activeFeature === "startups" && (
        <div style={styles.featureDetailContainer}>
          <StartupsPage />
        </div>
      )}
    </div>
  );
}

// Quick placeholder pages for remaining features
function InternshipsPage() {
  const [activeTab, setActiveTab] = useState<"internships" | "workshops" | "scholarships">("internships");
  const internships = getInternships();
  const workshops = getWorkshops();
  const scholarships = getScholarships();

  const data = activeTab === "internships" ? internships : activeTab === "workshops" ? workshops : scholarships;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: spacing[4] }}>Opportunities & Scholarships</h1>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6] }}>
        {["internships", "workshops", "scholarships"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              ...{ padding: `${spacing[2]} ${spacing[4]}`, border: "none", borderRadius: radius.md, fontSize: 14, fontWeight: 700, cursor: "pointer" },
              ...(activeTab === tab ? { background: colors.success, color: "#fff" } : { background: colors.ink[90], color: colors.ink[80] }),
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {data.slice(0, 12).map((item: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{item.title || item.name}</h3>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[3] }}>
              {item.description || item.provider || item.awardAmount?.min}
            </p>
            <div style={{ display: "flex", gap: spacing[2], flexWrap: "wrap", marginBottom: spacing[3] }}>
              {item.organization && <span style={{ ...styles.badge, backgroundColor: colors.accent[40] }}>{item.organization}</span>}
              {item.provider && <span style={{ ...styles.badge, backgroundColor: colors.info }}>{item.provider}</span>}
              {item.paid !== undefined && <span style={{ ...styles.badge, backgroundColor: colors.success }}>{item.paid ? "Paid" : "Free"}</span>}
              {item.free !== undefined && <span style={{ ...styles.badge, backgroundColor: colors.info }}>{item.free ? "Free" : "Paid"}</span>}
            </div>
            {item.stipend && <p style={{ fontSize: 13, fontWeight: 700, color: colors.accent[40], margin: 0 }}>₹{item.stipend.amount}/month</p>}
            {item.awardAmount && <p style={{ fontSize: 13, fontWeight: 700, color: colors.success, margin: 0 }}>₹{item.awardAmount.min}-₹{item.awardAmount.max}/year</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancialLiteracyPage() {
  const topics = getFinancialTopics();
  const categories = [...new Set(topics.map((t: any) => t.category))];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filtered = selectedCategory ? getTopicsByCategory(selectedCategory as "basics" | "banking" | "investing" | "markets" | "taxes" | "planning") : topics;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: spacing[4] }}>Financial Literacy</h1>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCategory(null)} style={{ ...styles.categoryBtn, ...(selectedCategory === null ? styles.categoryBtnActive : {}) }}>All Topics</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat as any)} style={{ ...styles.categoryBtn, ...(selectedCategory === cat ? styles.categoryBtnActive : {}) }}>
            {(cat as string).replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: spacing[4] }}>
        {filtered.slice(0, 12).map((topic: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{topic.title}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={styles.badge}>{topic.difficulty}</span>
              <span style={styles.badge}>{topic.duration}</span>
            </div>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[3] }}>{topic.description}</p>
            <div style={{ fontSize: 12, color: colors.ink[70] }}>
              <strong>Learn:</strong> {topic.keyLearnings.slice(0, 3).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalResourcesPage() {
  const resources = getLegalResources();
  const categories = [...new Set(resources.map((r: any) => r.category))];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filtered = selectedCategory ? getResourcesByCategory(selectedCategory as "student-rights" | "safety" | "labor" | "cyber" | "relationships" | "protection") : resources;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: spacing[4] }}>Legal Resources & Rights</h1>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCategory(null)} style={{ ...styles.categoryBtn, ...(selectedCategory === null ? styles.categoryBtnActive : {}) }}>All Topics</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat as any)} style={{ ...styles.categoryBtn, ...(selectedCategory === cat ? styles.categoryBtnActive : {}) }}>
            {(cat as string).replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: spacing[4] }}>
        {filtered.slice(0, 12).map((resource: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{resource.title}</h3>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[3] }}>{resource.description}</p>
            <div style={{ marginBottom: spacing[2] }}>
              <strong style={{ fontSize: 12, color: colors.ink[80] }}>Key Points:</strong>
              <ul style={{ fontSize: 12, color: colors.ink[70], margin: `${spacing[1]} 0 0 ${spacing[3]}` }}>
                {resource.keyPoints.slice(0, 3).map((point: string, i: number) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            {resource.helplineNumber && (
              <p style={{ fontSize: 12, fontWeight: 700, color: colors.accent[40], margin: 0 }}>🆘 Helpline: {resource.helplineNumber}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResearchPage() {
  const opportunities = getResearchOpportunities();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: spacing[4] }}>Research Opportunities</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {opportunities.slice(0, 12).map((opp: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{opp.title}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={styles.badge}>{opp.type}</span>
              <span style={styles.badge}>{opp.level}</span>
              <span style={styles.badge}>{opp.field}</span>
            </div>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[2] }}>{opp.description}</p>
            {opp.prizes && <p style={{ fontSize: 12, fontWeight: 700, color: colors.success, margin: 0 }}>🏆 {opp.prizes}</p>}
            <a href={opp.url} target="_blank" rel="noopener" style={{ fontSize: 12, color: colors.accent[40], textDecoration: "none", fontWeight: 700 }}>Learn more →</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartupsPage() {
  const [showUnicorns, setShowUnicorns] = useState(false);
  const startups = showUnicorns ? getUnicorns() : getAllStartups();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: spacing[4] }}>Startup Ecosystem</h1>

      <div style={{ marginBottom: spacing[6] }}>
        <button onClick={() => setShowUnicorns(false)} style={{ ...styles.categoryBtn, ...(showUnicorns === false ? styles.categoryBtnActive : {}) }}>All Startups</button>
        <button onClick={() => setShowUnicorns(true)} style={{ ...styles.categoryBtn, ...(showUnicorns === true ? styles.categoryBtnActive : {}), marginLeft: spacing[2] }}>Unicorns Only</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {startups.slice(0, 12).map((startup: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[1] }}>{startup.name}</h3>
            <p style={{ fontSize: 12, color: colors.ink[60], margin: 0, marginBottom: spacing[2] }}>Founded {startup.foundedYear} • {startup.location}</p>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={styles.badge}>{startup.industry}</span>
              <span style={styles.badge}>{startup.stage}</span>
              {startup.isUnicorn && <span style={{ ...styles.badge, backgroundColor: colors.warning }}>🦄 Unicorn</span>}
            </div>
            <p style={{ fontSize: 13, color: colors.ink[70], lineHeight: 1.5, margin: 0, marginBottom: spacing[2] }}>{startup.description}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: colors.accent[40], margin: 0 }}>Funding: ${startup.fundingRaised.amount / 1000000}M</p>
            <a href={startup.website} target="_blank" rel="noopener" style={{ fontSize: 12, color: colors.info, textDecoration: "none", fontWeight: 700 }}>Visit website →</a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: typography.family.sans,
    backgroundColor: colors.ink[95],
    minHeight: "100vh",
  } as React.CSSProperties,

  header: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: spacing[8],
    paddingBottom: spacing[6],
  } as React.CSSProperties,

  title: {
    fontSize: 40,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  subtitle: {
    fontSize: 18,
    color: colors.ink[60],
    margin: 0,
    lineHeight: 1.6,
  } as React.CSSProperties,

  tabsContainer: {
    borderBottom: `1px solid ${colors.ink[80]}`,
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  } as React.CSSProperties,

  tabsScrollable: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: `0 ${spacing[8]}`,
    display: "flex",
    gap: spacing[3],
    overflowX: "auto",
  } as React.CSSProperties,

  tab: {
    padding: `${spacing[3]} ${spacing[4]}`,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[60],
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    whiteSpace: "nowrap",
    borderRadius: 0,
    borderBottom: `2px solid transparent`,
    transition: "all 0.2s",
  } as React.CSSProperties,

  tabActive: {
    borderBottomColor: colors.accent[40],
  } as React.CSSProperties,

  tabIcon: {
    fontSize: 18,
  } as React.CSSProperties,

  tabName: {
    fontSize: 13,
  } as React.CSSProperties,

  featuresGrid: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: spacing[8],
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: spacing[4],
  } as React.CSSProperties,

  featureCard: {
    background: "#fff",
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.lg,
    padding: spacing[6],
    boxShadow: shadows.sm,
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    borderLeft: `4px solid ${colors.accent[40]}`,
  } as React.CSSProperties,

  featureIcon: {
    fontSize: 40,
    display: "block",
    marginBottom: spacing[3],
  } as React.CSSProperties,

  featureName: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  featureDesc: {
    fontSize: 14,
    color: colors.ink[60],
    lineHeight: 1.6,
    margin: 0,
    marginBottom: spacing[3],
    flex: 1,
  } as React.CSSProperties,

  arrow: {
    fontSize: 24,
    color: colors.accent[40],
    position: "absolute",
    right: spacing[4],
    bottom: spacing[4],
  } as React.CSSProperties,

  featureDetailContainer: {
    animation: "fadeIn 0.3s",
    width: "100%",
    overflow: "visible",
  } as React.CSSProperties,

  categoryBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    background: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    color: colors.ink[80],
  } as React.CSSProperties,

  categoryBtnActive: {
    background: colors.accent[40],
    color: "#fff",
    borderColor: colors.accent[40],
  } as React.CSSProperties,

  badge: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radius.sm,
    backgroundColor: colors.ink[90],
    color: colors.ink[80],
  } as React.CSSProperties,
};
