"use client";

import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { University } from "@/lib/data/universities100Plus";

export default function UniversityDetail({ university, onClose }: { university: University; onClose: () => void }) {
  return (
    <div style={styles.detailPage}>
      <button type="button" onClick={onClose} style={styles.backBtn}>← Back to Universities</button>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.rankingBadges}>
            <span style={styles.badge}>QS Rank: {university.ranking.qs}</span>
            <span style={styles.badge}>THE Rank: {university.ranking.the}</span>
            <span style={{...styles.badge, background: colors.success, color: "#fff"}}>⭐ Top {Math.min(100, university.ranking.world_rank)}</span>
          </div>
          <h1 style={styles.heroTitle}>{university.name}</h1>
          <p style={styles.heroSubtitle}>{university.overview}</p>
          <div style={styles.heroMeta}>
            <span>📍 {university.location}, {university.country}</span>
            <span>🏛️ {university.type} University</span>
            <span>📅 Founded {university.established}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div style={styles.mainLayout}>
        {/* Left Column - Key Info */}
        <div style={styles.leftColumn}>
          {/* Quick Stats */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 Quick Stats</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Acceptance Rate</div>
                <div style={styles.statValue}>{university.acceptanceRate}%</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Student-Teacher Ratio</div>
                <div style={styles.statValue}>{university.studentTeacherRatio}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>International Students</div>
                <div style={styles.statValue}>{university.internationalStudents}%</div>
              </div>
            </div>
          </div>

          {/* Costs Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💰 Annual Costs (International)</h2>
            <div style={styles.costSection}>
              <div style={styles.costItem}>
                <div style={styles.costLabel}>Tuition Range</div>
                <div style={styles.costValue}>
                  ${university.tuitionRange.international.min.toLocaleString()} - ${university.tuitionRange.international.max.toLocaleString()}
                </div>
              </div>
              <div style={styles.costItem}>
                <div style={styles.costLabel}>Living Costs</div>
                <div style={styles.costValue}>
                  ${university.livingCosts.min.toLocaleString()} - ${university.livingCosts.max.toLocaleString()} per year
                </div>
              </div>
              <div style={styles.costItem}>
                <div style={styles.costLabel}>Total Estimated Cost</div>
                <div style={styles.costTotal}>
                  ${(university.tuitionRange.international.min + university.livingCosts.min).toLocaleString()} - ${(university.tuitionRange.international.max + university.livingCosts.max).toLocaleString()} per year
                </div>
              </div>
            </div>
          </div>

          {/* Scholarships Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🎁 Scholarships Available</h2>
            <div style={styles.scholarshipsGrid}>
              {university.scholarships.map((scholarship, idx) => (
                <div key={idx} style={styles.scholarshipBadge}>
                  <div style={styles.scholarshipName}>{scholarship.name}</div>
                  <div style={styles.scholarshipPercentage}>{scholarship.percentage}% Coverage</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div style={styles.rightColumn}>
          {/* Programs Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📚 Programs Offered ({university.programs.length})</h2>
            <div style={styles.programsGrid}>
              {university.programs.map((program, idx) => (
                <div key={idx} style={styles.programCard}>
                  <div style={styles.programName}>{program.name}</div>
                  <div style={styles.programMeta}>
                    <span>{program.level}</span>
                    <span>•</span>
                    <span>{program.duration}</span>
                  </div>
                  <div style={styles.programIntake}>
                    Intake: {program.intake.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Requirements Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>✅ Admission Requirements</h2>
            <ul style={styles.requirementsList}>
              {university.admissionRequirements.map((req, idx) => (
                <li key={idx} style={styles.requirementItem}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Application Info Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 Application Information</h2>
            <div style={styles.appInfoGrid}>
              <div style={styles.appInfoBox}>
                <div style={styles.appInfoLabel}>Application Deadline</div>
                <div style={styles.appInfoValue}>{university.applicationDeadline}</div>
              </div>
              <div style={styles.appInfoBox}>
                <div style={styles.appInfoLabel}>University Type</div>
                <div style={styles.appInfoValue}>{university.type}</div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📞 Contact & Links</h2>
            <div style={styles.contactSection}>
              <div style={styles.contactItem}>
                <div style={styles.contactLabel}>Email</div>
                <a href={`mailto:${university.contact.email}`} style={styles.contactLink}>{university.contact.email}</a>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactLabel}>Phone</div>
                <div style={styles.contactValue}>{university.contact.phone}</div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactLabel}>Official Website</div>
                <a href={university.website} target="_blank" rel="noopener noreferrer" style={styles.contactLink}>
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  detailPage: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: spacing[6],
    background: colors.ink[95],
    minHeight: "100vh",
  },

  backBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    background: colors.ink[90],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: colors.ink[10],
    marginBottom: spacing[6],
  },

  heroSection: {
    background: "#fff",
    padding: spacing[8],
    borderRadius: radius.lg,
    marginBottom: spacing[6],
    boxShadow: shadows.md,
    borderLeft: `6px solid ${colors.accent[40]}`,
  },

  heroContent: {},

  rankingBadges: {
    display: "flex",
    gap: spacing[3],
    marginBottom: spacing[4],
    flexWrap: "wrap",
  },

  badge: {
    padding: `${spacing[2]} ${spacing[3]}`,
    background: colors.info,
    color: "#fff",
    borderRadius: radius.full,
    fontSize: 12,
    fontWeight: 600,
  },

  heroTitle: {
    fontSize: 48,
    fontWeight: 900,
    color: colors.ink[10],
    margin: 0,
    marginBottom: spacing[2],
  },

  heroSubtitle: {
    fontSize: 18,
    color: colors.ink[20],
    margin: 0,
    marginBottom: spacing[4],
    lineHeight: 1.6,
  },

  heroMeta: {
    display: "flex",
    gap: spacing[4],
    fontSize: 14,
    color: colors.ink[30],
    flexWrap: "wrap",
  },

  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: spacing[6],
    marginBottom: spacing[6],
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
  },

  card: {
    background: "#fff",
    padding: spacing[6],
    borderRadius: radius.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${colors.ink[90]}`,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.ink[10],
    margin: 0,
    marginBottom: spacing[4],
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: spacing[3],
  },

  statBox: {
    background: colors.ink[95],
    padding: spacing[4],
    borderRadius: radius.md,
    textAlign: "center",
    border: `1px solid ${colors.ink[80]}`,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.ink[20],
    textTransform: "uppercase",
    marginBottom: spacing[2],
  },

  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.accent[40],
  },

  costSection: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },

  costItem: {
    paddingBottom: spacing[4],
    borderBottom: `1px solid ${colors.ink[80]}`,
  },

  costLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.ink[20],
    textTransform: "uppercase",
    marginBottom: spacing[2],
  },

  costValue: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[10],
  },

  costTotal: {
    fontSize: 18,
    fontWeight: 800,
    color: colors.accent[40],
  },

  scholarshipsGrid: {
    display: "grid",
    gap: spacing[2],
  },

  scholarshipBadge: {
    padding: spacing[3],
    background: colors.success,
    color: "#fff",
    borderRadius: radius.md,
  },

  scholarshipName: {
    fontSize: 14,
    fontWeight: 600,
  },

  scholarshipPercentage: {
    fontSize: 12,
    opacity: 0.9,
  },

  programsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: spacing[3],
  },

  programCard: {
    padding: spacing[4],
    background: colors.ink[95],
    borderRadius: radius.md,
    border: `1px solid ${colors.ink[80]}`,
  },

  programName: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.ink[10],
    marginBottom: spacing[2],
  },

  programMeta: {
    fontSize: 12,
    color: colors.ink[30],
    marginBottom: spacing[2],
  },

  programIntake: {
    fontSize: 11,
    color: colors.ink[20],
    fontWeight: 500,
  },

  requirementsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  requirementItem: {
    padding: `${spacing[3]} 0`,
    borderBottom: `1px solid ${colors.ink[90]}`,
    fontSize: 14,
    color: colors.ink[10],
    lineHeight: 1.6,
  },

  appInfoGrid: {
    display: "grid",
    gap: spacing[3],
  },

  appInfoBox: {
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${colors.ink[80]}`,
  },

  appInfoLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.ink[20],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  },

  appInfoValue: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.ink[10],
  },

  contactSection: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
  },

  contactItem: {
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${colors.ink[80]}`,
  },

  contactLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.ink[20],
    textTransform: "uppercase",
    marginBottom: spacing[1],
  },

  contactValue: {
    fontSize: 14,
    color: colors.ink[10],
    fontWeight: 500,
  },

  contactLink: {
    fontSize: 14,
    color: colors.accent[40],
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  },
};
