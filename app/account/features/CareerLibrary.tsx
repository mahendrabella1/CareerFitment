"use client";

import { useState, useMemo } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { getAllCareers, searchCareers } from "@/lib/data/careerLibraryData";
import type { Career } from "@/lib/data/schema";

const CLUSTERS = [
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "health", label: "Healthcare", icon: "🏥" },
  { id: "engineering", label: "Engineering", icon: "⚙️" },
  { id: "business", label: "Business", icon: "📊" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "science", label: "Science", icon: "🧪" },
  { id: "social", label: "Social Impact", icon: "❤️" },
  { id: "trades", label: "Trades & Skills", icon: "🔧" },
];

const SALARY_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Entry Level ($20k-50k)", min: 20000, max: 50000 },
  { label: "Mid Career ($50k-100k)", min: 50000, max: 100000 },
  { label: "Senior ($100k-200k)", min: 100000, max: 200000 },
  { label: "$200k+", min: 200000, max: Infinity },
];

const DEMAND_LEVELS = ["high", "medium", "low"] as const;

export default function CareerLibrary() {
  const allCareers = getAllCareers();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState(0);
  const [selectedDemand, setSelectedDemand] = useState<typeof DEMAND_LEVELS[number] | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "salary" | "demand">("name");

  // Filter and search
  const filtered = useMemo(() => {
    let result = searchQuery
      ? searchCareers(searchQuery)
      : allCareers;

    if (selectedCluster) {
      result = result.filter(c => c.clusterId === selectedCluster);
    }

    if (selectedDemand) {
      result = result.filter(c => c.currentDemand === selectedDemand);
    }

    const salRange = SALARY_RANGES[selectedSalaryRange];
    result = result.filter(c => {
      const avgSalary = c.salaryRange?.[0]?.min || 0;
      return avgSalary >= salRange.min && avgSalary <= salRange.max;
    });

    // Sort
    if (sortBy === "salary") {
      result.sort((a, b) => (b.salaryRange?.[0]?.min || 0) - (a.salaryRange?.[0]?.min || 0));
    } else if (sortBy === "demand") {
      const demandScore = { high: 3, medium: 2, low: 1 };
      result.sort((a, b) =>
        (demandScore[b.currentDemand as keyof typeof demandScore] || 0) -
        (demandScore[a.currentDemand as keyof typeof demandScore] || 0)
      );
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCluster, selectedDemand, selectedSalaryRange, sortBy, allCareers]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Career Library</h1>
        <p style={styles.subtitle}>Explore 500+ careers with detailed insights on skills, education, and demand</p>
      </div>

      {/* Search & Filters */}
      <div style={styles.controlsPanel}>
        {/* Search */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search careers by name or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filter Clusters */}
        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Career Cluster</label>
          <div style={styles.clusterGrid}>
            {CLUSTERS.map(cluster => (
              <button
                key={cluster.id}
                onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                style={{
                  ...styles.clusterButton,
                  ...(selectedCluster === cluster.id ? styles.clusterButtonActive : {}),
                }}
              >
                <span style={styles.clusterIcon}>{cluster.icon}</span>
                <span style={styles.clusterLabel}>{cluster.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Salary Range</label>
            <select
              value={selectedSalaryRange}
              onChange={(e) => setSelectedSalaryRange(Number(e.target.value))}
              style={styles.select}
            >
              {SALARY_RANGES.map((range, idx) => (
                <option key={idx} value={idx}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Demand */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Market Demand</label>
            <select
              value={selectedDemand || ""}
              onChange={(e) => setSelectedDemand(e.target.value ? (e.target.value as typeof selectedDemand) : null)}
              style={styles.select}
            >
              <option value="">All Levels</option>
              {DEMAND_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)} Demand
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={styles.select}
            >
              <option value="name">Name (A-Z)</option>
              <option value="salary">Highest Salary</option>
              <option value="demand">Market Demand</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div style={styles.resultCounter}>
        Showing {filtered.length} of {allCareers.length} careers
      </div>

      {/* Career Grid */}
      <div style={styles.careerGrid}>
        {filtered.map((career: Career) => (
          <CareerCard key={career.id} career={career} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No careers match your filters. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}

function CareerCard({ career }: { career: Career }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const demandColor = {
    high: colors.accent[40],
    medium: colors.ink[50],
    low: colors.ink[60],
  }[career.currentDemand as keyof {high: string; medium: string; low: string}] || colors.ink[60];

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.careerName}>{career.name}</h3>
          <div style={styles.badgeRow}>
            <span style={{ ...styles.badge, backgroundColor: demandColor }}>
              {career.currentDemand === "high" ? "🔥" : "📈"} {career.currentDemand.toUpperCase()}
            </span>
            <span style={styles.badge}>{career.clusterId}</span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.expandBtn}
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {/* Overview */}
      <p style={styles.overview}>{career.overview}</p>

      {/* Key Stats */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Salary Range</span>
          <span style={styles.statValue}>
            ${(career.salaryRange?.[0]?.min || 0) / 1000}k - ${(career.salaryRange?.[0]?.max || 0) / 1000}k
          </span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Future Outlook</span>
          <span style={styles.statValue}>{career.futureOutlook}</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={styles.expandedContent}>
          {/* What They Do */}
          <section>
            <h4 style={styles.sectionTitle}>What You'll Do</h4>
            <p style={styles.sectionText}>{career.whatTheyDo}</p>
          </section>

          {/* Skills */}
          <section>
            <h4 style={styles.sectionTitle}>Key Skills Needed</h4>
            <div style={styles.tagsList}>
              {(career.skills?.slice(0, 8) ?? []).map((skill, i) => (
                <span key={i} style={styles.tag}>{skill}</span>
              ))}
            </div>
          </section>

          {/* Education */}
          {career.education && (
            <section>
              <h4 style={styles.sectionTitle}>Education Paths</h4>
              <div style={styles.educationGrid}>
                {career.education.degrees && career.education.degrees.length > 0 && (
                  <div>
                    <p style={styles.educationLabel}>Degrees</p>
                    <p style={styles.educationValue}>{career.education.degrees.join(", ")}</p>
                  </div>
                )}
                {career.education.certifications && career.education.certifications.length > 0 && (
                  <div>
                    <p style={styles.educationLabel}>Certifications</p>
                    <p style={styles.educationValue}>{career.education.certifications.slice(0, 3).join(", ")}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Top Companies */}
          {career.companies && career.companies.length > 0 && (
            <section>
              <h4 style={styles.sectionTitle}>Top Hiring Companies</h4>
              <div style={styles.tagsList}>
                {career.companies.slice(0, 6).map((company, i) => (
                  <span key={i} style={styles.companyTag}>{company}</span>
                ))}
              </div>
            </section>
          )}

          {/* Learning Pathways */}
          {career.beginner && (
            <section>
              <h4 style={styles.sectionTitle}>Learning Path</h4>
              <div style={styles.pathCard}>
                <p style={styles.pathTitle}>🌱 Beginner: {career.beginner.title}</p>
                <p style={styles.pathText}>{career.beginner.steps.join(" → ")}</p>
                <p style={styles.pathTime}>⏱️ {career.beginner.duration}</p>
              </div>
            </section>
          )}

          {/* Source */}
          <p style={styles.source}>📍 Data from: {career.source?.toString() || "Multiple sources"}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: spacing[8],
    fontFamily: typography.family.sans,
    backgroundColor: colors.ink[95],
  } as React.CSSProperties,

  header: {
    marginBottom: spacing[8],
  } as React.CSSProperties,

  title: {
    fontSize: 32,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  subtitle: {
    fontSize: 16,
    color: colors.ink[60],
    margin: 0,
    lineHeight: 1.6,
  } as React.CSSProperties,

  controlsPanel: {
    background: "#fff",
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    boxShadow: shadows.sm,
  } as React.CSSProperties,

  searchBox: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  searchInput: {
    width: "100%",
    padding: spacing[3],
    fontSize: 15,
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontFamily: typography.family.sans,
    boxSizing: "border-box",
  } as React.CSSProperties,

  filterSection: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  filterLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: colors.ink[80],
    marginBottom: spacing[3],
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  clusterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: spacing[2],
  } as React.CSSProperties,

  clusterButton: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: spacing[2],
    padding: spacing[3],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: 13,
    fontWeight: 600,
    color: colors.ink[80],
  } as React.CSSProperties,

  clusterButtonActive: {
    background: colors.accent[40],
    color: "#fff",
    border: `1px solid ${colors.accent[40]}`,
  } as React.CSSProperties,

  clusterIcon: {
    fontSize: 20,
  } as React.CSSProperties,

  clusterLabel: {
    textAlign: "center" as const,
    fontSize: 12,
  } as React.CSSProperties,

  filterRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing[4],
  } as React.CSSProperties,

  filterGroup: {
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,

  select: {
    padding: spacing[3],
    fontSize: 14,
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontFamily: typography.family.sans,
    backgroundColor: "#fff",
  } as React.CSSProperties,

  resultCounter: {
    fontSize: 14,
    color: colors.ink[60],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  careerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: spacing[4],
  } as React.CSSProperties,

  card: {
    background: "#fff",
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    transition: "all 0.2s",
    cursor: "pointer",
  } as React.CSSProperties,

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing[3],
  } as React.CSSProperties,

  careerName: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  badgeRow: {
    display: "flex",
    gap: spacing[2],
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  badge: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radius.sm,
    backgroundColor: colors.ink[90],
    color: colors.ink[80],
  } as React.CSSProperties,

  expandBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `1px solid ${colors.ink[80]}`,
    background: "#fff",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  overview: {
    fontSize: 14,
    color: colors.ink[70],
    lineHeight: 1.5,
    margin: 0,
    marginBottom: spacing[3],
  } as React.CSSProperties,

  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.ink[95],
    borderRadius: radius.md,
    marginBottom: spacing[3],
  } as React.CSSProperties,

  stat: {
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,

  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.ink[60],
    textTransform: "uppercase" as const,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  statValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[100],
  } as React.CSSProperties,

  expandedContent: {
    borderTop: `1px solid ${colors.ink[80]}`,
    paddingTop: spacing[4],
    marginTop: spacing[4],
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing[4],
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.ink[80],
    margin: 0,
    marginBottom: spacing[2],
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  sectionText: {
    fontSize: 13,
    color: colors.ink[70],
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,

  tagsList: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing[2],
  } as React.CSSProperties,

  tag: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: colors.accent[40],
    color: "#fff",
    borderRadius: radius.full,
  } as React.CSSProperties,

  companyTag: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: colors.info,
    color: "#fff",
    borderRadius: radius.full,
  } as React.CSSProperties,

  educationGrid: {
    display: "grid",
    gap: spacing[3],
  } as React.CSSProperties,

  educationLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.ink[60],
    margin: 0,
    marginBottom: spacing[1],
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  educationValue: {
    fontSize: 13,
    color: colors.ink[80],
    margin: 0,
  } as React.CSSProperties,

  pathCard: {
    padding: spacing[3],
    backgroundColor: colors.accent[40],
    borderRadius: radius.md,
    color: "#fff",
  } as React.CSSProperties,

  pathTitle: {
    fontSize: 13,
    fontWeight: 700,
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  pathText: {
    fontSize: 12,
    margin: 0,
    marginBottom: spacing[2],
    lineHeight: 1.5,
  } as React.CSSProperties,

  pathTime: {
    fontSize: 12,
    fontWeight: 600,
    margin: 0,
  } as React.CSSProperties,

  source: {
    fontSize: 11,
    color: colors.ink[60],
    margin: 0,
    fontStyle: "italic",
  } as React.CSSProperties,

  emptyState: {
    textAlign: "center",
    padding: spacing[8],
  } as React.CSSProperties,

  emptyText: {
    fontSize: 16,
    color: colors.ink[60],
    margin: 0,
  } as React.CSSProperties,
};
