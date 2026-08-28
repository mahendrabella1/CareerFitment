import Link from "next/link";
import { getAllCareers } from "@/lib/data/careerLibraryData";
import type { Career } from "@/lib/data/schema";

interface CareerDetailPageProps {
  params: {
    id: string;
  };
}

export default function CareerDetailPage({ params }: CareerDetailPageProps) {
  const allCareers = getAllCareers();
  const career = allCareers.find(c => c.id === params.id);

  if (!career) {
    return <div style={styles.notFound}>Career not found</div>;
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <Link href="/career-library" style={styles.backLink}>← Career Library</Link>
        <div style={styles.breadcrumb}>
          <Link href="/" style={styles.breadcrumbLink}>Home</Link>
          <span style={styles.breadcrumbSeparator}>›</span>
          <Link href="/career-library" style={styles.breadcrumbLink}>{career.clusterId}</Link>
          <span style={styles.breadcrumbSeparator}>›</span>
          <span style={styles.breadcrumbCurrent}>{career.name}</span>
        </div>
      </header>

      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <h1 style={styles.title}>{career.name}</h1>
            <div style={styles.badges}>
              <span style={{...styles.badge, backgroundColor: career.currentDemand === 'high' ? '#22c55e' : '#60a5fa'}}>
                {career.currentDemand === 'high' ? '🔥 High Demand' : '📈 Growing'}
              </span>
              <span style={{...styles.badge, backgroundColor: '#6366f1'}}>⭐ Future Ready</span>
            </div>
            <p style={styles.heroDescription}>{career.overview}</p>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroImage}>🎯</div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav style={styles.tabsNav}>
          {['Overview', 'Skills', 'Education & Eligibility', 'Salary', 'Companies', 'Future Scope', 'Resources'].map((tab) => (
            <button key={tab} style={tab === 'Overview' ? {...styles.tab, ...styles.tabActive} : styles.tab}>
              {tab}
            </button>
          ))}
        </nav>

        <div style={styles.divider}></div>

        {/* Content Sections */}
        <div style={styles.contentGrid}>
          <div style={styles.contentLeft}>
            {/* About the Role */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>About the Role</h2>
              <p style={styles.sectionText}>{career.whatTheyDo}</p>
              <ul style={styles.list}>
                {career.skills?.slice(0, 5).map((skill, i) => (
                  <li key={i} style={styles.listItem}>✓ {skill}</li>
                ))}
              </ul>
            </section>

            {/* Key Skills */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Key Skills Needed</h2>
              <div style={styles.skillsGrid}>
                {career.skills?.slice(0, 12).map((skill, i) => (
                  <span key={i} style={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </section>

            {/* Salary Overview */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Salary Overview</h2>
              <div style={styles.salaryGrid}>
                <div style={styles.salaryItem}>
                  <div style={styles.salaryLabel}>In India (Per Year)</div>
                  <div style={styles.salaryRange}>
                    <span style={{...styles.salaryBand, borderColor: '#10b981'}}>₹12 LPA</span>
                    <span style={{...styles.salaryBand, borderColor: '#f59e0b'}}>₹18 LPA</span>
                    <span style={{...styles.salaryBand, borderColor: '#ef4444'}}>₹28 LPA</span>
                  </div>
                  <div style={styles.salaryLabels}>
                    <span>Low End</span>
                    <span>Average</span>
                    <span>High End</span>
                  </div>
                </div>
                <div style={styles.salaryItem}>
                  <div style={styles.salaryLabel}>Abroad (Per Year)</div>
                  <div style={styles.salaryRange}>
                    <span style={{...styles.salaryBand, borderColor: '#3b82f6'}}>$ 85K</span>
                    <span style={{...styles.salaryBand, borderColor: '#6366f1'}}>$ 115K</span>
                    <span style={{...styles.salaryBand, borderColor: '#8b5cf6'}}>$ 160K</span>
                  </div>
                  <div style={styles.salaryLabels}>
                    <span>Low End</span>
                    <span>Average</span>
                    <span>High End</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Companies */}
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Top Companies Hiring</h2>
              <div style={styles.companiesGrid}>
                {['Google', 'Microsoft', 'Amazon', 'Meta', 'IBM', 'NVIDIA'].map((company) => (
                  <div key={company} style={styles.companyCard}>
                    <div style={styles.companyLogo}>{company[0]}</div>
                    <div style={styles.companyName}>{company}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside style={styles.sidebar}>
            {/* Future Scope */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Future Scope</h3>
              <div style={styles.futureItem}>
                <span style={styles.futureIcon}>📈</span>
                <span style={styles.futureLabel}>{career.futureOutlook}</span>
              </div>
              <p style={styles.futureNote}>The demand for {career.name} is growing rapidly across industries.</p>
            </div>

            {/* Career Pathways */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Career Pathways</h3>
              <div style={styles.pathway}>
                <div style={styles.pathwayStep}>
                  <div style={styles.pathwayDot}></div>
                  <div>Entry Level</div>
                </div>
                <div style={styles.pathwayArrow}>↓</div>
                <div style={styles.pathwayStep}>
                  <div style={styles.pathwayDot}></div>
                  <div>Mid Level</div>
                </div>
                <div style={styles.pathwayArrow}>↓</div>
                <div style={styles.pathwayStep}>
                  <div style={styles.pathwayDot}></div>
                  <div>Senior Level</div>
                </div>
              </div>
            </div>

            {/* Learning Path */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Learning Path & Resources</h3>
              <div style={styles.resourcesList}>
                <div style={styles.resourceItem}>
                  <span style={styles.resourceIcon}>📚</span>
                  <span style={styles.resourceLabel}>Books & eBooks</span>
                </div>
                <div style={styles.resourceItem}>
                  <span style={styles.resourceIcon}>🎥</span>
                  <span style={styles.resourceLabel}>Online Courses</span>
                </div>
                <div style={styles.resourceItem}>
                  <span style={styles.resourceIcon}>🏫</span>
                  <span style={styles.resourceLabel}>Universities</span>
                </div>
                <div style={styles.resourceItem}>
                  <span style={styles.resourceIcon}>💻</span>
                  <span style={styles.resourceLabel}>Certifications</span>
                </div>
                <div style={styles.resourceItem}>
                  <span style={styles.resourceIcon}>👥</span>
                  <span style={styles.resourceLabel}>Communities</span>
                </div>
                <div style={styles.resourceItem}>
                  <span style={styles.resourceIcon}>📺</span>
                  <span style={styles.resourceLabel}>YouTube Channels</span>
                </div>
              </div>
              <button style={styles.resourcesBtn}>View all resources →</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

const styles = {
  notFound: {
    padding: '40px',
    textAlign: 'center' as const,
    fontSize: '18px',
    color: '#64748b',
  } as React.CSSProperties,

  pageContainer: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  } as React.CSSProperties,

  header: {
    backgroundColor: '#fff',
    padding: '20px 40px',
    borderBottom: '1px solid #e2e8f0',
  } as React.CSSProperties,

  backLink: {
    fontSize: '14px',
    color: '#3b5bdb',
    textDecoration: 'none',
    marginBottom: '12px',
    display: 'inline-block',
  } as React.CSSProperties,

  breadcrumb: {
    fontSize: '13px',
    color: '#64748b',
  } as React.CSSProperties,

  breadcrumbLink: {
    color: '#3b5bdb',
    textDecoration: 'none',
    marginRight: '8px',
  } as React.CSSProperties,

  breadcrumbSeparator: {
    marginRight: '8px',
    color: '#cbd5e1',
  } as React.CSSProperties,

  breadcrumbCurrent: {
    color: '#1e293b',
    fontWeight: '600',
  } as React.CSSProperties,

  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
  } as React.CSSProperties,

  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    marginBottom: '40px',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
  } as React.CSSProperties,

  heroLeft: {
  } as React.CSSProperties,

  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 16px 0',
    lineHeight: '1.2',
  } as React.CSSProperties,

  badges: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,

  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    borderRadius: '4px',
  } as React.CSSProperties,

  heroDescription: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.6',
    margin: '0',
  } as React.CSSProperties,

  heroRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  heroImage: {
    fontSize: '80px',
  } as React.CSSProperties,

  tabsNav: {
    display: 'flex',
    gap: '24px',
    backgroundColor: '#fff',
    padding: '20px 40px',
    borderRadius: '12px',
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    overflowX: 'auto' as const,
  } as React.CSSProperties,

  tab: {
    padding: '12px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  tabActive: {
    color: '#3b5bdb',
    borderBottomColor: '#3b5bdb',
  } as React.CSSProperties,

  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    marginBottom: '40px',
  } as React.CSSProperties,

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '32px',
  } as React.CSSProperties,

  contentLeft: {
  } as React.CSSProperties,

  section: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    marginBottom: '24px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
  } as React.CSSProperties,

  sectionText: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  } as React.CSSProperties,

  list: {
    margin: '0',
    paddingLeft: '0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  listItem: {
    fontSize: '14px',
    color: '#475569',
    margin: '0',
  } as React.CSSProperties,

  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '12px',
  } as React.CSSProperties,

  skillTag: {
    display: 'inline-block',
    padding: '6px 14px',
    backgroundColor: '#e0e7ff',
    color: '#3b5bdb',
    fontSize: '13px',
    fontWeight: '600',
    borderRadius: '6px',
  } as React.CSSProperties,

  salaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  } as React.CSSProperties,

  salaryItem: {
  } as React.CSSProperties,

  salaryLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '12px',
    display: 'block',
  } as React.CSSProperties,

  salaryRange: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  } as React.CSSProperties,

  salaryBand: {
    flex: 1,
    padding: '8px',
    textAlign: 'center' as const,
    fontSize: '12px',
    fontWeight: '600',
    borderLeft: '4px solid',
    backgroundColor: '#f8fafc',
    borderRadius: '4px',
  } as React.CSSProperties,

  salaryLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b',
  } as React.CSSProperties,

  companiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  } as React.CSSProperties,

  companyCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  companyLogo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#3b5bdb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '18px',
  } as React.CSSProperties,

  companyName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
  } as React.CSSProperties,

  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  } as React.CSSProperties,

  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
  } as React.CSSProperties,

  futureItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '12px',
  } as React.CSSProperties,

  futureIcon: {
    fontSize: '20px',
  } as React.CSSProperties,

  futureLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  } as React.CSSProperties,

  futureNote: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0',
    lineHeight: '1.5',
  } as React.CSSProperties,

  pathway: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  pathwayStep: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  } as React.CSSProperties,

  pathwayDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3b5bdb',
    borderRadius: '50%',
  } as React.CSSProperties,

  pathwayArrow: {
    fontSize: '12px',
    color: '#cbd5e1',
    textAlign: 'center' as const,
    margin: '0 0 -4px 0',
  } as React.CSSProperties,

  resourcesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,

  resourceItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '13px',
    color: '#475569',
  } as React.CSSProperties,

  resourceIcon: {
    fontSize: '16px',
  } as React.CSSProperties,

  resourceLabel: {
  } as React.CSSProperties,

  resourcesBtn: {
    width: '100%',
    padding: '8px 12px',
    backgroundColor: '#3b5bdb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  } as React.CSSProperties,
};
