"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { getAllCareers, searchCareers } from "@/lib/data/careerLibraryData";
import type { Career } from "@/lib/data/schema";

const CLUSTERS = [
  { id: "tech", label: "Information Technology", icon: "💻", color: "#3b5bdb" },
  { id: "engineering", label: "Engineering & Technology", icon: "⚙️", color: "#16a34a" },
  { id: "health", label: "Health Science", icon: "🏥", color: "#e11d48" },
  { id: "business", label: "Business & Finance", icon: "📊", color: "#f59e0b" },
  { id: "creative", label: "Arts & Design", icon: "🎨", color: "#8b5cf6" },
  { id: "science", label: "Science & Research", icon: "🧪", color: "#06b6d4" },
  { id: "social", label: "Social Impact", icon: "❤️", color: "#ec4899" },
  { id: "trades", label: "Law & Public Service", icon: "⚖️", color: "#6366f1" },
  { id: "sustainability", label: "Environment & Sustainability", icon: "🌱", color: "#22c55e" },
  { id: "hospitality", label: "Hospitality & Tourism", icon: "✈️", color: "#f97316" },
  { id: "media", label: "Media & Communication", icon: "📢", color: "#06b6d4" },
  { id: "education", label: "Education", icon: "🎓", color: "#3b82f6" },
];

const ITEMS_PER_PAGE = 20;

export default function CareerLibrary() {
  const allCareers = getAllCareers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCareers, setShowAllCareers] = useState(false);

  const filtered = useMemo(() => {
    let result = searchQuery ? searchCareers(searchQuery) : allCareers;
    if (selectedCluster) {
      result = result.filter(c => c.clusterId === selectedCluster);
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, selectedCluster, allCareers]);

  const paginatedCareers = useMemo(() => {
    if (showAllCareers) return filtered;
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage, showAllCareers]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleClusterClick = (id: string) => {
    setSelectedCluster(selectedCluster === id ? null : id);
    setCurrentPage(1);
    setShowAllCareers(false);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Left Sidebar */}
      <aside style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>CAREER CLUSTERS</h3>
        <nav style={styles.clusterList}>
          {CLUSTERS.map(cluster => {
            const count = allCareers.filter(c => c.clusterId === cluster.id).length;
            return (
              <button
                key={cluster.id}
                onClick={() => handleClusterClick(cluster.id)}
                style={{
                  ...styles.clusterItem,
                  ...(selectedCluster === cluster.id ? {...styles.clusterItemActive, borderLeftColor: cluster.color, backgroundColor: '#f8fafc'} : {}),
                }}
              >
                <span style={{...styles.clusterItemIcon, fontSize: '20px'}}>{cluster.icon}</span>
                <div style={styles.clusterItemText}>
                  <div style={styles.clusterItemLabel}>{cluster.label}</div>
                  <div style={styles.clusterItemCount}>{count} Roles</div>
                </div>
                <span style={styles.clusterItemArrow}>›</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>Explore. Discover. <span style={{color: '#3b5bdb', fontWeight: 800}}>Decide.</span></h1>
            <p style={styles.heroSubtitle}>Your future starts with the right information.</p>
            <div style={styles.heroStats}>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>16</div>
                <div style={styles.statLabel}>Career Clusters</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>250+</div>
                <div style={styles.statLabel}>Career Roles</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Skills</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>1000+</div>
                <div style={styles.statLabel}>Resources</div>
              </div>
            </div>
          </div>
          <div style={styles.heroImage}>
            <div style={styles.heroImagePlaceholder}>👨‍💼</div>
          </div>
        </section>

        {/* Search */}
        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Search careers, skills, industries or job roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Explore Career Clusters */}
        <section style={styles.clustersSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Explore Career Clusters</h2>
            <Link href="#" style={styles.viewAllLink}>View all clusters →</Link>
          </div>
          <div style={styles.clustersGrid}>
            {CLUSTERS.map(cluster => {
              const count = filtered.filter(c => c.clusterId === cluster.id).length;
              return (
                <div key={cluster.id} style={{...styles.clusterCard, borderTopColor: cluster.color}}>
                  <div style={{...styles.clusterCardIcon, fontSize: '32px'}}>{cluster.icon}</div>
                  <h3 style={styles.clusterCardTitle}>{cluster.label}</h3>
                  <p style={styles.clusterCardDesc}>{count > 0 ? `Explore ${count} roles` : 'Discover careers'}</p>
                  <div style={styles.clusterCardFooter}>
                    <span style={styles.clusterCardCount}>{count} Roles</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trending Careers */}
        <section style={styles.trendingSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Trending Careers</h2>
            <Link href="#" style={styles.viewAllLink}>View all →</Link>
          </div>
          <div style={styles.trendingList}>
            {filtered.slice(0, 3).map((career) => (
              <Link key={career.id} href={`/careers/${career.id}`} style={styles.trendingItem}>
                <div style={styles.trendingItemIcon}>🎯</div>
                <div style={styles.trendingItemContent}>
                  <div style={styles.trendingItemName}>{career.name}</div>
                  <div style={styles.trendingItemCluster}>{career.clusterId}</div>
                </div>
                <span style={{...styles.trendingItemDemand, backgroundColor: career.currentDemand === 'high' ? '#22c55e' : '#60a5fa'}}>
                  {career.currentDemand === 'high' ? '🔥 High Demand' : '📈 Growing'}
                </span>
                <span style={styles.trendingItemArrow}>›</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Explore By Section */}
        <section style={styles.exploreBySection}>
          <h2 style={styles.sectionTitle}>Explore by</h2>
          <div style={styles.exploreByGrid}>
            {[
              { label: 'Interests', icon: '❤️' },
              { label: 'Skills', icon: '⭐' },
              { label: 'Education', icon: '🎓' },
              { label: 'Salary', icon: '💰' },
              { label: 'Industry', icon: '🏢' },
              { label: 'Future Demand', icon: '📈' },
              { label: 'Tools', icon: '🛠️' },
              { label: 'Location', icon: '📍' },
              { label: 'Career Growth', icon: '📊' },
            ].map(item => (
              <button key={item.label} style={styles.exploreByItem}>
                <div style={styles.exploreByItemIcon}>{item.icon}</div>
                <div style={styles.exploreByItemLabel}>{item.label}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Career Pathways */}
        <section style={styles.pathwaysSection}>
          <h2 style={styles.sectionTitle}>Career Pathways</h2>
          <div style={styles.pathwaysBox}>
            {[
              { label: 'Software Development', color: '#3b5bdb' },
              { label: 'Cybersecurity', color: '#e11d48' },
              { label: 'Data Science', color: '#f59e0b' },
              { label: 'Cloud Computing', color: '#06b6d4' },
              { label: 'Artificial Intelligence', color: '#8b5cf6' },
            ].map(pathway => (
              <div key={pathway.label} style={styles.pathwayItem}>
                <div style={{...styles.pathwayDot, backgroundColor: pathway.color}}></div>
                <span style={styles.pathwayLabel}>{pathway.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Browse All Careers */}
        <section style={styles.allCareersSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              {selectedCluster ? `Browse ${CLUSTERS.find(c => c.id === selectedCluster)?.label || 'Careers'}` : 'Browse All Careers'}
            </h2>
            <div>{filtered.length} roles found</div>
          </div>

          <div style={styles.careersGrid}>
            {paginatedCareers.map((career) => (
              <Link key={career.id} href={`/careers/${career.id}`} style={styles.careerCard}>
                <div style={styles.careerCardTitle}>{career.name}</div>
                <div style={styles.careerCardCluster}>{career.clusterId}</div>
                <div style={{fontSize: '12px', color: '#64748b', marginTop: '8px'}}>
                  {career.currentDemand === 'high' ? '🔥 High Demand' : '📈 Growing'}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && !showAllCareers && (
            <div style={styles.paginationContainer}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{...styles.paginationBtn, ...(currentPage === 1 ? {opacity: 0.5, cursor: 'not-allowed'} : {})}}
              >
                ← Previous
              </button>
              <div style={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{...styles.paginationBtn, ...(currentPage === totalPages ? {opacity: 0.5, cursor: 'not-allowed'} : {})}}
              >
                Next →
              </button>
            </div>
          )}

          {/* Load All Button */}
          {!showAllCareers && filtered.length > ITEMS_PER_PAGE && (
            <div style={{textAlign: 'center', marginTop: '24px'}}>
              <button
                onClick={() => setShowAllCareers(true)}
                style={styles.loadAllBtn}
              >
                Load all {filtered.length} careers
              </button>
            </div>
          )}

          {showAllCareers && filtered.length > ITEMS_PER_PAGE && (
            <div style={{textAlign: 'center', marginTop: '24px'}}>
              <button
                onClick={() => {setShowAllCareers(false); setCurrentPage(1);}}
                style={styles.loadAllBtn}
              >
                Show paginated view
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#f8fafc',
    padding: '24px',
    width: '100%',
  } as React.CSSProperties,

  sidebar: {
    width: '280px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: 'fit-content',
    position: 'sticky' as const,
    top: '24px',
  } as React.CSSProperties,

  sidebarTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '16px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  clusterList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  clusterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    borderLeft: '3px solid transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 200ms ease',
    textAlign: 'left' as const,
  } as React.CSSProperties,

  clusterItemActive: {
    backgroundColor: '#f1f5f9',
    borderLeftColor: '#3b5bdb',
  } as React.CSSProperties,

  clusterItemIcon: {
    fontSize: '18px',
    flexShrink: 0,
  } as React.CSSProperties,

  clusterItemText: {
    flex: 1,
  } as React.CSSProperties,

  clusterItemLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2px',
  } as React.CSSProperties,

  clusterItemCount: {
    fontSize: '12px',
    color: '#64748b',
  } as React.CSSProperties,

  clusterItemArrow: {
    fontSize: '16px',
    color: '#cbd5e1',
    marginLeft: '8px',
  } as React.CSSProperties,

  mainContent: {
    flex: 1,
    maxWidth: '1000px',
  } as React.CSSProperties,

  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
    marginBottom: '48px',
    backgroundColor: 'linear-gradient(135deg, #f0e7ff 0%, #e8f4ff 100%)',
    padding: '48px 60px',
    borderRadius: '12px',
  } as React.CSSProperties,

  heroText: {
  } as React.CSSProperties,

  heroTitle: {
    fontSize: '40px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 12px 0',
    lineHeight: '1.2',
  } as React.CSSProperties,

  heroSubtitle: {
    fontSize: '16px',
    color: '#475569',
    margin: '0 0 32px 0',
    lineHeight: '1.6',
  } as React.CSSProperties,

  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  } as React.CSSProperties,

  statBox: {
    textAlign: 'center' as const,
  } as React.CSSProperties,

  statNumber: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#3b5bdb',
    margin: '0 0 4px 0',
  } as React.CSSProperties,

  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0',
  } as React.CSSProperties,

  heroImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  heroImagePlaceholder: {
    fontSize: '80px',
  } as React.CSSProperties,

  searchSection: {
    marginBottom: '48px',
  } as React.CSSProperties,

  searchInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    color: '#1e293b',
  } as React.CSSProperties,

  clustersSection: {
    marginBottom: '48px',
  } as React.CSSProperties,

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0',
  } as React.CSSProperties,

  viewAllLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b5bdb',
    textDecoration: 'none',
  } as React.CSSProperties,

  clustersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,

  clusterCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    borderTop: '4px solid #3b5bdb',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 200ms ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  } as React.CSSProperties,

  clusterCardIcon: {
    fontSize: '32px',
    marginBottom: '12px',
    display: 'block',
  } as React.CSSProperties,

  clusterCardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
  } as React.CSSProperties,

  clusterCardDesc: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  } as React.CSSProperties,

  clusterCardFooter: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#3b5bdb',
  } as React.CSSProperties,

  clusterCardCount: {
  } as React.CSSProperties,

  trendingSection: {
    marginBottom: '48px',
  } as React.CSSProperties,

  trendingList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,

  trendingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    textDecoration: 'none',
  } as React.CSSProperties,

  trendingItemIcon: {
    fontSize: '20px',
    flexShrink: 0,
  } as React.CSSProperties,

  trendingItemContent: {
    flex: 1,
  } as React.CSSProperties,

  trendingItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0',
  } as React.CSSProperties,

  trendingItemCluster: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  } as React.CSSProperties,

  trendingItemDemand: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#22c55e',
    padding: '4px 12px',
    borderRadius: '4px',
    flexShrink: 0,
  } as React.CSSProperties,

  trendingItemArrow: {
    fontSize: '16px',
    color: '#cbd5e1',
  } as React.CSSProperties,

  exploreBySection: {
    marginBottom: '48px',
  } as React.CSSProperties,

  exploreByGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  } as React.CSSProperties,

  exploreByItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  } as React.CSSProperties,

  exploreByItemIcon: {
    fontSize: '28px',
  } as React.CSSProperties,

  exploreByItemLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  pathwaysSection: {
    marginBottom: '48px',
  } as React.CSSProperties,

  pathwaysBox: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  } as React.CSSProperties,

  pathwayItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  pathwayDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  } as React.CSSProperties,

  pathwayLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  } as React.CSSProperties,

  allCareersSection: {
    marginTop: '48px',
  } as React.CSSProperties,

  careersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,

  careerCard: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    textDecoration: 'none',
    display: 'block',
    ':hover': {
      borderColor: '#3b5bdb',
      boxShadow: '0 4px 12px rgba(59, 91, 219, 0.1)',
    }
  } as React.CSSProperties,

  careerCardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '6px',
  } as React.CSSProperties,

  careerCardCluster: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
  } as React.CSSProperties,

  paginationBtn: {
    padding: '8px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#3b5bdb',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  } as React.CSSProperties,

  paginationInfo: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    minWidth: '120px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  loadAllBtn: {
    padding: '12px 28px',
    backgroundColor: '#3b5bdb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  } as React.CSSProperties,
};
