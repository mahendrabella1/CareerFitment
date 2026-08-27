"use client";

import { useState, useMemo } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { getAllCareers, searchCareers } from "@/lib/data/careerLibraryData";
import type { Career } from "@/lib/data/schema";
import { Icon } from "@/app/Icons";

type ViewType = "grid" | "list" | "compare";

const CLUSTERS = [
  { id: "tech", label: "Technology" },
  { id: "health", label: "Healthcare" },
  { id: "engineering", label: "Engineering" },
  { id: "business", label: "Business" },
  { id: "creative", label: "Creative" },
  { id: "science", label: "Science" },
  { id: "social", label: "Social Impact" },
  { id: "trades", label: "Trades & Skills" },
];

const SALARY_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Entry Level ($20k-50k)", min: 20000, max: 50000 },
  { label: "Mid Career ($50k-100k)", min: 50000, max: 100000 },
  { label: "Senior ($100k-200k)", min: 100000, max: 200000 },
  { label: "$200k+", min: 200000, max: Infinity },
];

export default function CareerLibraryPro() {
  const allCareers = getAllCareers();

  // View & Filters
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState(0);
  const [selectedDemand, setSelectedDemand] = useState<"high" | "medium" | "low" | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "salary" | "demand">("name");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = searchQuery ? searchCareers(searchQuery) : allCareers;

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

  // Get comparison data
  const comparisonCareers = filtered.filter(c => selectedForComparison.includes(c.id));

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Career Library</h1>
          <p style={styles.subtitle}>Explore 500+ careers with detailed insights on skills, education, and demand</p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{filtered.length}</div>
            <div style={styles.statLabel}>Careers</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>${(filtered.reduce((sum, c) => sum + (c.salaryRange?.[0]?.min || 0), 0) / filtered.length / 1000).toFixed(0)}k</div>
            <div style={styles.statLabel}>Avg Salary</div>
          </div>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Sidebar Filters */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>Filters</h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCluster(null);
                setSelectedSalaryRange(0);
                setSelectedDemand(null);
              }}
              style={styles.clearBtn}
            >
              Clear
            </button>
          </div>

          {/* Search */}
          <div style={styles.filterGroup}>
            <input
              type="text"
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Clusters */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Career Cluster</label>
            <div style={styles.filterOptions}>
              {CLUSTERS.map(cluster => (
                <button
                  key={cluster.id}
                  onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                  style={{
                    ...styles.filterOption,
                    ...(selectedCluster === cluster.id ? styles.filterOptionActive : {}),
                  }}
                >
                  {cluster.label}
                </button>
              ))}
            </div>
          </div>

          {/* Salary */}
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
              onChange={(e) => setSelectedDemand(e.target.value ? (e.target.value as any) : null)}
              style={styles.select}
            >
              <option value="">All Levels</option>
              <option value="high">🔥 High Demand</option>
              <option value="medium">📈 Medium Demand</option>
              <option value="low">📊 Low Demand</option>
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

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* View Controls */}
          <div style={styles.controls}>
            <div style={styles.viewToggle}>
              <button
                onClick={() => setView("grid")}
                style={{...styles.viewBtn, ...(view === "grid" ? styles.viewBtnActive : {})}}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setView("list")}
                style={{...styles.viewBtn, ...(view === "list" ? styles.viewBtnActive : {})}}
              >
                ≡ List
              </button>
              <button
                onClick={() => setView("compare")}
                style={{...styles.viewBtn, ...(view === "compare" ? styles.viewBtnActive : {})}}
              >
                ⇄ Compare {selectedForComparison.length > 0 && `(${selectedForComparison.length})`}
              </button>
            </div>
            <div style={styles.resultCounter}>Showing {filtered.length} of {allCareers.length} careers</div>
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div style={styles.careerGrid}>
              {filtered.map((career: Career) => (
                <CareerGridCard
                  key={career.id}
                  career={career}
                  isSelected={selectedForComparison.includes(career.id)}
                  onSelect={() => {
                    setSelectedForComparison(prev =>
                      prev.includes(career.id)
                        ? prev.filter(id => id !== career.id)
                        : [...prev, career.id].slice(-3)
                    );
                  }}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {view === "list" && (
            <div style={styles.listView}>
              <div style={styles.listHeader}>
                <div style={{flex: 1}}>Career</div>
                <div style={{width: '120px'}}>Salary Range</div>
                <div style={{width: '100px'}}>Demand</div>
                <div style={{width: '100px'}}>Future</div>
              </div>
              {filtered.map((career: Career) => (
                <CareerListRow
                  key={career.id}
                  career={career}
                  isSelected={selectedForComparison.includes(career.id)}
                  onSelect={() => {
                    setSelectedForComparison(prev =>
                      prev.includes(career.id)
                        ? prev.filter(id => id !== career.id)
                        : [...prev, career.id].slice(-3)
                    );
                  }}
                />
              ))}
            </div>
          )}

          {/* Comparison View */}
          {view === "compare" && (
            <div style={styles.compareView}>
              {selectedForComparison.length === 0 ? (
                <div style={styles.emptyComparison}>
                  <p style={styles.emptyText}>Select 2-3 careers from grid or list view to compare</p>
                </div>
              ) : (
                <CareerComparison careers={comparisonCareers} />
              )}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={styles.empty}>
              <p style={styles.emptyText}>No careers match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Grid Card Component
function CareerGridCard({ career, isSelected, onSelect }: { career: Career; isSelected: boolean; onSelect: () => void }) {
  const demandColor = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#6b7280",
  }[career.currentDemand] || "#6b7280";

  return (
    <div style={{...styles.gridCard, ...(isSelected ? styles.gridCardSelected : {})}}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        style={styles.checkbox}
      />
      <h3 style={styles.gridCardTitle}>{career.name}</h3>
      <div style={styles.gridCardBadges}>
        <span style={{...styles.badge, background: demandColor}}>
          {career.currentDemand === "high" ? "🔥" : "📈"} {career.currentDemand.toUpperCase()}
        </span>
        <span style={styles.badge}>{career.clusterId}</span>
      </div>
      <p style={styles.gridCardDesc}>{career.overview}</p>
      <div style={styles.gridCardStats}>
        <div>
          <div style={styles.gridStatLabel}>Salary</div>
          <div style={styles.gridStatValue}>₹{(career.salaryRange?.[0]?.min || 0) / 100000}L</div>
        </div>
        <div>
          <div style={styles.gridStatLabel}>Future</div>
          <div style={styles.gridStatValue}>{career.futureOutlook}</div>
        </div>
      </div>
      <button style={styles.detailBtn}>View Details →</button>
    </div>
  );
}

// List Row Component
function CareerListRow({ career, isSelected, onSelect }: { career: Career; isSelected: boolean; onSelect: () => void }) {
  return (
    <div style={styles.listRow}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        style={styles.checkbox}
      />
      <div style={{flex: 1}}>
        <div style={styles.listRowName}>{career.name}</div>
        <div style={styles.listRowSubtext}>{career.clusterId}</div>
      </div>
      <div style={{width: '120px'}}>₹{(career.salaryRange?.[0]?.min || 0) / 100000}L - ₹{(career.salaryRange?.[0]?.max || 0) / 100000}L</div>
      <div style={{width: '100px', color: career.currentDemand === "high" ? "#ef4444" : "#f59e0b"}}>
        {career.currentDemand.toUpperCase()}
      </div>
      <div style={{width: '100px'}}>{career.futureOutlook}</div>
    </div>
  );
}

// Comparison Component
function CareerComparison({ careers }: { careers: Career[] }) {
  return (
    <div style={styles.comparisonTable}>
      <div style={styles.compTableRow}>
        <div style={styles.compTableHeader}>Metric</div>
        {careers.map(c => (
          <div key={c.id} style={styles.compTableHeader}>{c.name}</div>
        ))}
      </div>
      {[
        { label: "Avg Salary", key: "salary" },
        { label: "Demand", key: "demand" },
        { label: "Future Outlook", key: "outlook" },
        { label: "Education Required", key: "education" },
      ].map(metric => (
        <div key={metric.key} style={styles.compTableRow}>
          <div style={styles.compTableCell}>{metric.label}</div>
          {careers.map(career => (
            <div key={career.id} style={styles.compTableCell}>
              {metric.key === "salary" && `₹${(career.salaryRange?.[0]?.min || 0) / 100000}L`}
              {metric.key === "demand" && career.currentDemand.toUpperCase()}
              {metric.key === "outlook" && career.futureOutlook}
              {metric.key === "education" && career.education?.degrees?.join(", ")}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1600,
    margin: "0 auto",
    padding: spacing[8],
    fontFamily: typography.family.sans,
    backgroundColor: colors.ink[95],
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing[8],
    gap: spacing[6],
  },

  title: {
    fontSize: 36,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  },

  subtitle: {
    fontSize: 16,
    color: colors.ink[60],
    margin: 0,
  },

  stats: {
    display: "flex",
    gap: spacing[4],
  },

  statCard: {
    background: "#fff",
    padding: spacing[4],
    borderRadius: radius.md,
    textAlign: "center",
    minWidth: "120px",
    boxShadow: shadows.sm,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.accent[40],
  },

  statLabel: {
    fontSize: 12,
    color: colors.ink[60],
    marginTop: spacing[1],
  },

  mainLayout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: spacing[6],
  },

  sidebar: {
    background: "#fff",
    borderRadius: radius.lg,
    padding: spacing[6],
    height: "fit-content",
    position: "sticky",
    top: spacing[4],
    boxShadow: shadows.sm,
  },

  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[4],
  },

  sidebarTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
  },

  clearBtn: {
    padding: "4px 8px",
    fontSize: 12,
    background: colors.ink[95],
    border: "none",
    borderRadius: radius.sm,
    cursor: "pointer",
    color: colors.accent[40],
    fontWeight: 600,
  },

  filterGroup: {
    marginBottom: spacing[4],
  },

  filterLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: colors.ink[80],
    marginBottom: spacing[2],
    textTransform: "uppercase",
  },

  filterOptions: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },

  filterOption: {
    padding: spacing[2],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    color: colors.ink[70],
    transition: "all 0.2s",
    textAlign: "left",
  },

  filterOptionActive: {
    background: colors.accent[40],
    color: "#fff",
    borderColor: colors.accent[40],
  },

  searchInput: {
    width: "100%",
    padding: spacing[3],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontFamily: typography.family.sans,
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: spacing[2],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 13,
    fontFamily: typography.family.sans,
    backgroundColor: "#fff",
  },

  mainContent: {
    flex: 1,
  },

  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[6],
    gap: spacing[4],
  },

  viewToggle: {
    display: "flex",
    gap: spacing[2],
    background: "#fff",
    padding: spacing[2],
    borderRadius: radius.md,
    boxShadow: shadows.sm,
  },

  viewBtn: {
    padding: `${spacing[2]} ${spacing[3]}`,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: colors.ink[60],
    borderRadius: radius.sm,
    transition: "all 0.2s",
  },

  viewBtnActive: {
    background: colors.accent[40],
    color: "#fff",
  },

  resultCounter: {
    fontSize: 14,
    color: colors.ink[60],
  },

  careerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: spacing[4],
  },

  gridCard: {
    background: "#fff",
    border: `2px solid transparent`,
    borderRadius: radius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    transition: "all 0.2s",
    cursor: "pointer",
    position: "relative",
  },

  gridCardSelected: {
    borderColor: colors.accent[40],
    boxShadow: `0 0 0 3px ${colors.accent[100]}`,
  },

  gridCardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: `0 0 ${spacing[2]} 0`,
  },

  gridCardBadges: {
    display: "flex",
    gap: spacing[2],
    marginBottom: spacing[3],
  },

  badge: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radius.full,
    color: "#fff",
  },

  gridCardDesc: {
    fontSize: 13,
    color: colors.ink[70],
    margin: 0,
    marginBottom: spacing[4],
    lineHeight: 1.5,
  },

  gridCardStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.ink[95],
    borderRadius: radius.md,
    marginBottom: spacing[4],
  },

  gridStatLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.ink[60],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  },

  gridStatValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[100],
  },

  detailBtn: {
    width: "100%",
    padding: spacing[3],
    background: colors.accent[40],
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: 14,
  },

  checkbox: {
    position: "absolute",
    top: spacing[4],
    right: spacing[4],
    width: 20,
    height: 20,
    cursor: "pointer",
  },

  listView: {
    background: "#fff",
    borderRadius: radius.lg,
    overflow: "hidden",
    boxShadow: shadows.sm,
  },

  listHeader: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 120px 100px 100px",
    gap: spacing[4],
    padding: spacing[4],
    backgroundColor: colors.ink[95],
    fontWeight: 700,
    fontSize: 13,
    color: colors.ink[80],
    borderBottom: `1px solid ${colors.ink[80]}`,
  },

  listRow: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 120px 100px 100px",
    gap: spacing[4],
    padding: spacing[4],
    borderBottom: `1px solid ${colors.ink[80]}`,
    alignItems: "center",
    transition: "all 0.2s",
  },

  listRowName: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[100],
  },

  listRowSubtext: {
    fontSize: 12,
    color: colors.ink[60],
  },

  compareView: {
    background: "#fff",
    borderRadius: radius.lg,
    padding: spacing[6],
    boxShadow: shadows.sm,
  },

  emptyComparison: {
    textAlign: "center",
    padding: spacing[8],
  },

  emptyText: {
    fontSize: 16,
    color: colors.ink[60],
    margin: 0,
  },

  comparisonTable: {
    display: "grid",
    gap: spacing[2],
  },

  compTableRow: {
    display: "grid",
    gridTemplateColumns: "150px repeat(auto-fit, minmax(200px, 1fr))",
    gap: spacing[3],
  },

  compTableHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.ink[80],
    backgroundColor: colors.ink[95],
    padding: spacing[3],
    borderRadius: radius.md,
    textTransform: "uppercase",
  },

  compTableCell: {
    fontSize: 13,
    color: colors.ink[70],
    padding: spacing[3],
    backgroundColor: colors.ink[95],
    borderRadius: radius.md,
    border: `1px solid ${colors.ink[80]}`,
  },

  empty: {
    textAlign: "center",
    padding: spacing[12],
  },
};
