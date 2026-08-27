"use client";

import { useState, useMemo } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { getAllCareers, searchCareers } from "@/lib/data/careerLibraryData";
import type { Career } from "@/lib/data/schema";
import { Icon } from "@/app/Icons";

type ViewType = "grid" | "detailed";

const CLUSTERS = [
  { id: "tech", label: "Technology", emoji: "💻", color: "#2563eb" },
  { id: "health", label: "Healthcare", emoji: "🏥", color: "#10b981" },
  { id: "engineering", label: "Engineering", emoji: "⚙️", color: "#f59e0b" },
  { id: "business", label: "Business", emoji: "💼", color: "#8b5cf6" },
  { id: "creative", label: "Creative", emoji: "🎨", color: "#ec4899" },
  { id: "science", label: "Science", emoji: "🔬", color: "#06b6d4" },
  { id: "social", label: "Social Impact", emoji: "❤️", color: "#ef4444" },
  { id: "trades", label: "Trades & Skills", emoji: "🔧", color: "#ca8a04" },
];

export default function CareerLibraryEnhanced() {
  const allCareers = getAllCareers();
  const [view, setView] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "salary" | "demand">("name");

  const filtered = useMemo(() => {
    let result = searchQuery ? searchCareers(searchQuery) : allCareers;

    if (selectedCluster) {
      result = result.filter(c => c.clusterId === selectedCluster);
    }

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
  }, [searchQuery, selectedCluster, sortBy, allCareers]);

  const clusterInfo = selectedCluster
    ? CLUSTERS.find(c => c.id === selectedCluster)
    : null;

  if (selectedCareer) {
    return <CareerDetailView career={selectedCareer} onClose={() => setSelectedCareer(null)} />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Career Library</h1>
          <p style={styles.subtitle}>Explore {allCareers.length}+ detailed career paths with salary, skills, education requirements, and growth potential</p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{filtered.length}</div>
            <div style={styles.statLabel}>Careers</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{CLUSTERS.length}</div>
            <div style={styles.statLabel}>Clusters</div>
          </div>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {/* Sidebar Filters */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>Explore by Cluster</h3>
            <button
              type="button"
              onClick={() => setSelectedCluster(null)}
              style={styles.clearBtn}
            >
              Reset
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
            <div style={styles.clusterList}>
              {CLUSTERS.map(cluster => (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
                  style={{
                    ...styles.clusterOption,
                    ...(selectedCluster === cluster.id ? styles.clusterOptionActive : {}),
                    borderLeftColor: cluster.color,
                  }}
                >
                  <span style={styles.clusterEmoji}>{cluster.emoji}</span>
                  <div style={styles.clusterText}>
                    <div style={styles.clusterName}>{cluster.label}</div>
                    <div style={styles.clusterCount}>
                      {allCareers.filter(c => c.clusterId === cluster.id).length} careers
                    </div>
                  </div>
                </button>
              ))}
            </div>
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
          {/* Header Info */}
          {clusterInfo && (
            <div style={styles.clusterHeader}>
              <span style={{ fontSize: 32 }}>{clusterInfo.emoji}</span>
              <div>
                <h2 style={styles.clusterTitle}>{clusterInfo.label}</h2>
                <p style={styles.clusterDesc}>
                  {filtered.length} careers in this cluster
                </p>
              </div>
            </div>
          )}

          {/* View Controls & Counter */}
          <div style={styles.controls}>
            <div style={styles.viewToggle}>
              <button
                type="button"
                onClick={() => setView("grid")}
                style={{...styles.viewBtn, ...(view === "grid" ? styles.viewBtnActive : {})}}
              >
                ⊞ Grid View
              </button>
              <button
                type="button"
                onClick={() => setView("detailed")}
                style={{...styles.viewBtn, ...(view === "detailed" ? styles.viewBtnActive : {})}}
              >
                📋 Detailed View
              </button>
            </div>
            <div style={styles.resultCounter}>Showing {filtered.length} careers</div>
          </div>

          {/* Grid View */}
          {view === "grid" && (
            <div style={styles.careerGrid}>
              {filtered.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  onViewDetails={() => setSelectedCareer(career)}
                  clusterColor={CLUSTERS.find(c => c.id === career.clusterId)?.color || "#6b7280"}
                />
              ))}
            </div>
          )}

          {/* Detailed List View */}
          {view === "detailed" && (
            <div style={styles.detailedList}>
              {filtered.map((career) => (
                <CareerListItem
                  key={career.id}
                  career={career}
                  onViewDetails={() => setSelectedCareer(career)}
                  clusterColor={CLUSTERS.find(c => c.id === career.clusterId)?.color || "#6b7280"}
                />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={styles.empty}>
              <p style={styles.emptyText}>No careers match your search. Try different keywords or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Career Grid Card
function CareerCard({ career, onViewDetails, clusterColor }: { career: Career; onViewDetails: () => void; clusterColor: string }) {
  const demandColor = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#6b7280",
  }[career.currentDemand] || "#6b7280";

  const avgSalary = career.salaryRange?.[0]?.min || 0;

  return (
    <div style={styles.gridCard}>
      <div style={{ ...styles.cardHeader, borderLeftColor: clusterColor }}>
        <h3 style={styles.cardTitle}>{career.name}</h3>
        <span style={{ ...styles.demandBadge, background: demandColor }}>
          {career.currentDemand === "high" ? "🔥" : "📈"} {career.currentDemand.toUpperCase()}
        </span>
      </div>
      <p style={styles.cardDesc}>{career.overview}</p>
      <div style={styles.cardStats}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Salary</div>
          <div style={styles.statValue}>₹{(avgSalary / 100000).toFixed(1)}L+</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Future</div>
          <div style={styles.statValue}>{career.futureOutlook?.split(" ")[0] || "Good"}</div>
        </div>
      </div>
      <div style={styles.cardSkills}>
        {career.skills?.slice(0, 3).map((skill, i) => (
          <span key={i} style={styles.skillTag}>{skill}</span>
        ))}
        {career.skills && career.skills.length > 3 && (
          <span style={styles.skillTag}>+{career.skills.length - 3}</span>
        )}
      </div>
      <button type="button" onClick={onViewDetails} style={styles.detailsBtn}>
        View Full Details →
      </button>
    </div>
  );
}

// Career List Item
function CareerListItem({ career, onViewDetails, clusterColor }: { career: Career; onViewDetails: () => void; clusterColor: string }) {
  const avgSalary = career.salaryRange?.[0]?.min || 0;

  return (
    <div style={{ ...styles.listItem, borderLeftColor: clusterColor }}>
      <div style={styles.listItemContent}>
        <h3 style={styles.listItemTitle}>{career.name}</h3>
        <p style={styles.listItemDesc}>{career.overview}</p>
        <div style={styles.listItemMeta}>
          <span>💼 {career.skills?.length || 0} key skills</span>
          <span>🎓 {career.education?.degrees?.length || 0} degree options</span>
          <span>💰 ₹{(avgSalary / 100000).toFixed(1)}L+ salary</span>
          <span style={{ color: career.currentDemand === "high" ? "#ef4444" : "#f59e0b" }}>
            {career.currentDemand === "high" ? "🔥" : "📈"} {career.currentDemand.toUpperCase()}
          </span>
        </div>
      </div>
      <button type="button" onClick={onViewDetails} style={styles.listBtn}>
        Details
      </button>
    </div>
  );
}

// Career Detail View
function CareerDetailView({ career, onClose }: { career: Career; onClose: () => void }) {
  return (
    <div style={styles.detailContainer}>
      <button type="button" onClick={onClose} style={styles.backBtn}>← Back to List</button>

      <div style={styles.detailContent}>
        <h1 style={styles.detailTitle}>{career.name}</h1>
        <p style={styles.detailSubtitle}>{career.overview}</p>

        <div style={styles.detailGrid}>
          {/* What They Do */}
          <section style={styles.detailSection}>
            <h2 style={styles.sectionHead}>📋 What They Do</h2>
            <p>{career.whatTheyDo}</p>
          </section>

          {/* Salary */}
          <section style={styles.detailSection}>
            <h2 style={styles.sectionHead}>💰 Salary Expectations</h2>
            {career.salaryRange?.map((range, i) => (
              <div key={i} style={styles.salaryRange}>
                <strong>{range.experience}</strong>
                <p>₹{(range.min / 100000).toFixed(1)}L - ₹{(range.max / 100000).toFixed(1)}L {range.currency === "INR" ? "(India)" : "(USA)"}</p>
              </div>
            ))}
          </section>

          {/* Education */}
          <section style={styles.detailSection}>
            <h2 style={styles.sectionHead}>🎓 Education Required</h2>
            <div>
              <p><strong>Subjects:</strong> {career.education?.subjects?.join(", ")}</p>
              <p><strong>Degrees:</strong> {career.education?.degrees?.join(", ")}</p>
              {career.education?.certifications && (
                <p><strong>Certifications:</strong> {career.education.certifications.join(", ")}</p>
              )}
            </div>
          </section>

          {/* Skills */}
          <section style={styles.detailSection}>
            <h2 style={styles.sectionHead}>⚡ Key Skills</h2>
            <div style={styles.skillsList}>
              {career.skills?.map((skill, i) => (
                <span key={i} style={styles.skillBadge}>{skill}</span>
              ))}
            </div>
          </section>

          {/* Tools */}
          {career.tools && (
            <section style={styles.detailSection}>
              <h2 style={styles.sectionHead}>🛠️ Tools & Technologies</h2>
              <div style={styles.skillsList}>
                {career.tools.map((tool, i) => (
                  <span key={i} style={{...styles.skillBadge, background: colors.info}}>💻 {tool}</span>
                ))}
              </div>
            </section>
          )}

          {/* Top Companies */}
          {career.companies && (
            <section style={styles.detailSection}>
              <h2 style={styles.sectionHead}>🏢 Top Hiring Companies</h2>
              <div style={styles.companiesList}>
                {career.companies.map((company, i) => (
                  <span key={i} style={styles.companyTag}>{company}</span>
                ))}
              </div>
            </section>
          )}

          {/* Future Outlook */}
          <section style={styles.detailSection}>
            <h2 style={styles.sectionHead}>📈 Future Outlook</h2>
            <p>{career.futureOutlook}</p>
            {career.aiImpact && (
              <p><strong>AI Impact:</strong> {career.aiImpact}</p>
            )}
          </section>

          {/* Learning Paths */}
          {career.beginner && (
            <section style={styles.detailSection}>
              <h2 style={styles.sectionHead}>🚀 {career.beginner.title}</h2>
              <ul style={styles.pathList}>
                {career.beginner.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
              <p><em>Duration: {career.beginner.duration}</em></p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

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
    fontSize: 40,
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
    fontSize: 28,
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
    gridTemplateColumns: "260px 1fr",
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

  searchInput: {
    width: "100%",
    padding: spacing[3],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontFamily: typography.family.sans,
    boxSizing: "border-box",
  },

  clusterList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },

  clusterOption: {
    padding: spacing[3],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    borderLeft: `4px solid`,
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: colors.ink[70],
    transition: "all 0.2s",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
  },

  clusterOptionActive: {
    background: colors.accent[100],
    color: colors.accent[40],
    borderColor: colors.accent[40],
  },

  clusterEmoji: {
    fontSize: 20,
  },

  clusterText: {
    flex: 1,
  },

  clusterName: {
    fontSize: 13,
    fontWeight: 700,
  },

  clusterCount: {
    fontSize: 11,
    color: colors.ink[60],
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

  clusterHeader: {
    display: "flex",
    alignItems: "center",
    gap: spacing[4],
    padding: spacing[6],
    background: "#fff",
    borderRadius: radius.lg,
    marginBottom: spacing[6],
    boxShadow: shadows.sm,
  },

  clusterTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
  },

  clusterDesc: {
    fontSize: 14,
    color: colors.ink[60],
    margin: `${spacing[1]} 0 0 0`,
  },

  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[6],
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
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.lg,
    padding: spacing[5],
    boxShadow: shadows.sm,
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing[2],
    marginBottom: spacing[3],
    paddingBottom: spacing[3],
    borderBottom: `2px solid`,
    borderLeftWidth: 4,
    borderLeftStyle: "solid",
    paddingLeft: 0,
    marginLeft: -spacing[5],
    paddingLeft: spacing[5],
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
  },

  demandBadge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radius.full,
    color: "#fff",
    whiteSpace: "nowrap",
  },

  cardDesc: {
    fontSize: 13,
    color: colors.ink[70],
    margin: 0,
    marginBottom: spacing[4],
    lineHeight: 1.5,
  },

  cardStats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.ink[95],
    borderRadius: radius.md,
    marginBottom: spacing[4],
  },

  stat: {
    textAlign: "center",
  },

  statLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.ink[60],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  },

  statValue: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[100],
  },

  cardSkills: {
    display: "flex",
    gap: spacing[2],
    marginBottom: spacing[4],
    flexWrap: "wrap",
  },

  skillTag: {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[2]}`,
    fontSize: 11,
    fontWeight: 700,
    background: colors.accent[100],
    color: colors.accent[40],
    borderRadius: radius.full,
  },

  detailsBtn: {
    padding: spacing[3],
    background: colors.accent[40],
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    marginTop: "auto",
  },

  detailedList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },

  listItem: {
    background: "#fff",
    border: `1px solid ${colors.ink[80]}`,
    borderLeft: `4px solid`,
    borderRadius: radius.lg,
    padding: spacing[5],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing[4],
  },

  listItemContent: {
    flex: 1,
  },

  listItemTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[2],
  },

  listItemDesc: {
    fontSize: 14,
    color: colors.ink[70],
    margin: 0,
    marginBottom: spacing[3],
  },

  listItemMeta: {
    display: "flex",
    gap: spacing[3],
    fontSize: 12,
    color: colors.ink[60],
    flexWrap: "wrap",
  },

  listBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    background: colors.accent[40],
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  detailContainer: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: spacing[8],
    fontFamily: typography.family.sans,
    backgroundColor: colors.ink[95],
    minHeight: "100vh",
  },

  backBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    background: colors.ink[95],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: colors.ink[70],
    marginBottom: spacing[6],
  },

  detailContent: {
    background: "#fff",
    borderRadius: radius.lg,
    padding: spacing[8],
    boxShadow: shadows.sm,
  },

  detailTitle: {
    fontSize: 48,
    fontWeight: 800,
    color: colors.ink[100],
    margin: 0,
    marginBottom: spacing[3],
  },

  detailSubtitle: {
    fontSize: 18,
    color: colors.ink[60],
    margin: 0,
    marginBottom: spacing[8],
    lineHeight: 1.6,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: spacing[6],
  },

  detailSection: {
    paddingBottom: spacing[6],
    borderBottom: `1px solid ${colors.ink[80]}`,
  },

  sectionHead: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[100],
    margin: `0 0 ${spacing[3]} 0`,
  },

  salaryRange: {
    padding: spacing[3],
    background: colors.accent[100],
    borderRadius: radius.md,
    marginBottom: spacing[2],
  },

  skillsList: {
    display: "flex",
    gap: spacing[2],
    flexWrap: "wrap",
  },

  skillBadge: {
    display: "inline-block",
    padding: `${spacing[2]} ${spacing[3]}`,
    background: colors.accent[100],
    color: colors.accent[40],
    borderRadius: radius.full,
    fontSize: 13,
    fontWeight: 600,
  },

  companiesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: spacing[3],
  },

  companyTag: {
    padding: `${spacing[2]} ${spacing[3]}`,
    background: colors.info,
    color: "#fff",
    borderRadius: radius.md,
    fontSize: 13,
    fontWeight: 600,
    textAlign: "center",
  },

  pathList: {
    paddingLeft: spacing[4],
    margin: 0,
  },

  empty: {
    textAlign: "center",
    padding: spacing[12],
  },

  emptyText: {
    fontSize: 16,
    color: colors.ink[60],
    margin: 0,
  },
};
