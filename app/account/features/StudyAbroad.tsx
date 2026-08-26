"use client";

import { useState, useMemo } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { getCountries, getUniversitiesByCountry, searchUniversities } from "@/lib/data/studyAbroadData";

type Country = ReturnType<typeof getCountries>[0];
type University = ReturnType<typeof getUniversitiesByCountry>[0];

const BUDGET_RANGES = [
  { label: "Under $25k/year", min: 0, max: 25000 },
  { label: "$25k - $50k/year", min: 25000, max: 50000 },
  { label: "$50k - $100k/year", min: 50000, max: 100000 },
  { label: "$100k+/year", min: 100000, max: Infinity },
];

const DESTINATIONS = [
  { id: "USA", name: "🇺🇸 United States", count: 4300 },
  { id: "UK", name: "🇬🇧 United Kingdom", count: 160 },
  { id: "Canada", name: "🇨🇦 Canada", count: 200 },
  { id: "Germany", name: "🇩🇪 Germany", count: 400 },
  { id: "Australia", name: "🇦🇺 Australia", count: 43 },
  { id: "Netherlands", name: "🇳🇱 Netherlands", count: 50 },
  { id: "Singapore", name: "🇸🇬 Singapore", count: 10 },
  { id: "Japan", name: "🇯🇵 Japan", count: 780 },
];

export default function StudyAbroad() {
  const countries = getCountries();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState(0);
  const [sortBy, setSortBy] = useState<"ranking" | "tuition" | "name">("ranking");

  const universities = useMemo(() => {
    let result: University[] = [];

    if (selectedCountry) {
      result = getUniversitiesByCountry(selectedCountry);
    } else {
      // All universities
      countries.forEach(country => {
        result = result.concat(getUniversitiesByCountry(country.name));
      });
    }

    if (searchQuery) {
      result = result.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.programs?.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    const budget = BUDGET_RANGES[selectedBudget];
    result = result.filter(u => {
      const tuition = u.tuition_range?.min || 0;
      return tuition >= budget.min && tuition <= budget.max;
    });

    // Sort
    if (sortBy === "ranking") {
      result.sort((a, b) => (a.ranking?.rank || 999) - (b.ranking?.rank || 999));
    } else if (sortBy === "tuition") {
      result.sort((a, b) => (a.tuition_range?.min || 0) - (b.tuition_range?.min || 0));
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCountry, searchQuery, selectedBudget, sortBy, countries]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Study Abroad</h1>
        <p style={styles.subtitle}>Explore 100+ universities across 20 countries with detailed admissions and cost information</p>
      </div>

      {/* Controls */}
      <div style={styles.controlsPanel}>
        {/* Search */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search universities, programs, or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Country Grid */}
        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Destination Country</label>
          <div style={styles.countryGrid}>
            {DESTINATIONS.map(dest => (
              <button
                key={dest.id}
                onClick={() => setSelectedCountry(selectedCountry === dest.id ? null : dest.id)}
                style={{
                  ...styles.countryButton,
                  ...(selectedCountry === dest.id ? styles.countryButtonActive : {}),
                }}
              >
                <span style={styles.countryName}>{dest.name}</span>
                <span style={styles.countryCount}>{dest.count} unis</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Budget Range (Tuition)</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(Number(e.target.value))}
              style={styles.select}
            >
              <option value={0}>All Budgets</option>
              {BUDGET_RANGES.map((range, idx) => (
                <option key={idx} value={idx}>{range.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={styles.select}
            >
              <option value="ranking">QS Ranking</option>
              <option value="tuition">Lowest Tuition</option>
              <option value="name">University Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={styles.resultCounter}>
        Found {universities.length} universities
      </div>

      {/* University Grid */}
      <div style={styles.universityGrid}>
        {universities.map(university => (
          <UniversityCard key={university.id} university={university} />
        ))}
      </div>

      {universities.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No universities match your criteria. Try adjusting your filters.</p>
        </div>
      )}

      {/* Country Deep Dives */}
      {!selectedCountry && (
        <div style={styles.countriesSection}>
          <h2 style={styles.sectionHeading}>Explore by Country</h2>
          <div style={styles.countriesGrid}>
            {countries.slice(0, 8).map(country => (
              <div key={country.name} style={styles.countryCard}>
                <h3 style={styles.countryCardTitle}>{country.name}</h3>
                <p style={styles.countryCardDesc}>{country.description}</p>
                <div style={styles.countryStats}>
                  <div>
                    <span style={styles.statLabel}>Universities</span>
                    <span style={styles.statValue}>{country.universitiesCount}+</span>
                  </div>
                  <div>
                    <span style={styles.statLabel}>Tuition</span>
                    <span style={styles.statValue}>${country.tuition_range.min / 1000}k-${country.tuition_range.max / 1000}k</span>
                  </div>
                  <div>
                    <span style={styles.statLabel}>Cost of Living</span>
                    <span style={styles.statValue}>${country.livingCosts.min / 1000}k-${country.livingCosts.max / 1000}k</span>
                  </div>
                </div>
                {country.scholarships && country.scholarships.length > 0 && (
                  <div style={styles.scholarshipsInfo}>
                    <p style={styles.scholarshipsLabel}>Available Scholarships:</p>
                    <p style={styles.scholarshipsList}>{country.scholarships.slice(0, 2).join(", ")}</p>
                  </div>
                )}
                <a
                  href={country.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.exploreBtn}
                >
                  Explore →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UniversityCard({ university }: { university: University }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rankingDisplay = university.ranking?.rank
    ? `#${university.ranking.rank} ${university.ranking.source || "QS"}`
    : "Ranked";

  return (
    <div style={styles.uniCard}>
      {/* Header */}
      <div style={styles.uniHeader}>
        <div style={styles.uniTitleSection}>
          <h3 style={styles.uniTitle}>{university.name}</h3>
          <p style={styles.uniLocation}>📍 {university.location}</p>
          {university.ranking?.rank && (
            <span style={styles.rankingBadge}>⭐ {rankingDisplay}</span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.expandBtn}
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {/* Key Info Bar */}
      <div style={styles.infoBar}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Tuition</span>
          <span style={styles.infoValue}>
            ${university.tuition_range?.min / 1000}k-${university.tuition_range?.max / 1000}k
          </span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Living Costs</span>
          <span style={styles.infoValue}>
            ${university.living_costs?.min / 1000}k-${university.living_costs?.max / 1000}k
          </span>
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div style={styles.expandedContent}>
          {/* Programs */}
          {university.programs && university.programs.length > 0 && (
            <section>
              <h4 style={styles.sectionTitle}>Programs Offered</h4>
              <div style={styles.programsList}>
                {university.programs.slice(0, 8).map((prog, i) => (
                  <span key={i} style={styles.programTag}>{prog}</span>
                ))}
              </div>
            </section>
          )}

          {/* Scholarships */}
          {university.scholarships && university.scholarships.length > 0 && (
            <section>
              <h4 style={styles.sectionTitle}>Available Scholarships</h4>
              <div style={styles.scholarships}>
                {university.scholarships.map((scholarship, i) => (
                  <div key={i} style={styles.scholarshipItem}>
                    ✓ {scholarship}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Application Info */}
          <section style={styles.applicationSection}>
            <h4 style={styles.sectionTitle}>Admission Requirements</h4>
            <div style={styles.requirementsList}>
              <div>
                <span style={styles.requirementLabel}>Test Scores</span>
                <span style={styles.requirementValue}>IELTS, TOEFL, GRE, GMAT</span>
              </div>
              <div>
                <span style={styles.requirementLabel}>Application Timeline</span>
                <span style={styles.requirementValue}>3-6 months before intake</span>
              </div>
              <div>
                <span style={styles.requirementLabel}>Student Visa</span>
                <span style={styles.requirementValue}>International students supported</span>
              </div>
            </div>
          </section>

          {/* CTA Button */}
          <a
            href={university.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.visitBtn}
          >
            Visit University Website →
          </a>
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
    fontFamily: typography.fontFamily,
    backgroundColor: colors.bg,
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
    border: `1px solid ${colors.line}`,
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
    border: `1px solid ${colors.line}`,
    borderRadius: radius.md,
    fontFamily: typography.fontFamily,
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
    textTransform: "uppercase",
  } as React.CSSProperties,

  countryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: spacing[2],
  } as React.CSSProperties,

  countryButton: {
    padding: spacing[3],
    border: `1px solid ${colors.line}`,
    borderRadius: radius.md,
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
  } as React.CSSProperties,

  countryButtonActive: {
    background: colors.info,
    color: "#fff",
    border: `1px solid ${colors.info}`,
  } as React.CSSProperties,

  countryName: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
  } as React.CSSProperties,

  countryCount: {
    display: "block",
    fontSize: 11,
    color: colors.ink[60],
    marginTop: spacing[1],
  } as React.CSSProperties,

  filterRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing[4],
  } as React.CSSProperties,

  filterGroup: {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  select: {
    padding: spacing[3],
    fontSize: 14,
    border: `1px solid ${colors.line}`,
    borderRadius: radius.md,
    fontFamily: typography.fontFamily,
    backgroundColor: "#fff",
  } as React.CSSProperties,

  resultCounter: {
    fontSize: 14,
    color: colors.ink[60],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  universityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: spacing[4],
    marginBottom: spacing[8],
  } as React.CSSProperties,

  uniCard: {
    background: "#fff",
    border: `1px solid ${colors.line}`,
    borderRadius: radius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    transition: "all 0.2s",
  } as React.CSSProperties,

  uniHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing[3],
  } as React.CSSProperties,

  uniTitleSection: {
    flex: 1,
  } as React.CSSProperties,

  uniTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  uniLocation: {
    fontSize: 13,
    color: colors.ink[60],
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  rankingBadge: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: colors.warning,
    color: colors.ink[100],
    borderRadius: radius.sm,
  } as React.CSSProperties,

  expandBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `1px solid ${colors.line}`,
    background: "#fff",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  infoBar: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.ink[95],
    borderRadius: radius.md,
    marginBottom: spacing[3],
  } as React.CSSProperties,

  infoItem: {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  infoLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.ink[60],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  } as React.CSSProperties,

  infoValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[100],
  } as React.CSSProperties,

  expandedContent: {
    borderTop: `1px solid ${colors.line}`,
    paddingTop: spacing[4],
    marginTop: spacing[4],
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.ink[80],
    margin: 0,
    marginBottom: spacing[2],
    textTransform: "uppercase",
  } as React.CSSProperties,

  programsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
  } as React.CSSProperties,

  programTag: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: colors.info,
    color: "#fff",
    borderRadius: radius.full,
  } as React.CSSProperties,

  scholarships: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  } as React.CSSProperties,

  scholarshipItem: {
    fontSize: 13,
    color: colors.ink[80],
    paddingLeft: spacing[2],
  } as React.CSSProperties,

  applicationSection: {} as React.CSSProperties,

  requirementsList: {
    display: "grid",
    gap: spacing[2],
  } as React.CSSProperties,

  requirementLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: colors.ink[60],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  } as React.CSSProperties,

  requirementValue: {
    display: "block",
    fontSize: 13,
    color: colors.ink[80],
  } as React.CSSProperties,

  visitBtn: {
    display: "inline-block",
    padding: `${spacing[3]} ${spacing[4]}`,
    background: colors.info,
    color: "#fff",
    borderRadius: radius.md,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.2s",
    width: "100%",
    textAlign: "center",
    boxSizing: "border-box",
  } as React.CSSProperties,

  countriesSection: {
    marginTop: spacing[8],
  } as React.CSSProperties,

  sectionHeading: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[5],
  } as React.CSSProperties,

  countriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing[4],
  } as React.CSSProperties,

  countryCard: {
    background: "#fff",
    border: `1px solid ${colors.line}`,
    borderRadius: radius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
  } as React.CSSProperties,

  countryCardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  countryCardDesc: {
    fontSize: 13,
    color: colors.ink[70],
    lineHeight: 1.6,
    margin: 0,
    marginBottom: spacing[3],
  } as React.CSSProperties,

  countryStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.ink[95],
    borderRadius: radius.md,
    marginBottom: spacing[3],
    textAlign: "center",
  } as React.CSSProperties,

  statLabel: {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    color: colors.ink[60],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  } as React.CSSProperties,

  statValue: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: colors.ink[100],
  } as React.CSSProperties,

  scholarshipsInfo: {
    padding: spacing[3],
    backgroundColor: colors.success,
    borderRadius: radius.md,
    color: "#fff",
    marginBottom: spacing[3],
  } as React.CSSProperties,

  scholarshipsLabel: {
    fontSize: 11,
    fontWeight: 700,
    margin: 0,
    marginBottom: spacing[1],
    textTransform: "uppercase",
  } as React.CSSProperties,

  scholarshipsList: {
    fontSize: 12,
    margin: 0,
  } as React.CSSProperties,

  exploreBtn: {
    display: "inline-block",
    padding: `${spacing[2]} ${spacing[4]}`,
    background: colors.accent[40],
    color: "#fff",
    borderRadius: radius.md,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13,
    transition: "all 0.2s",
    width: "100%",
    textAlign: "center",
    boxSizing: "border-box",
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
