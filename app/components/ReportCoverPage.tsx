/**
 * Professional Report Cover Page
 * Used for all assessment reports (9-10, 11-12, Career Roadmap, etc.)
 *
 * Features:
 * - OneGrasp branding
 * - Student details (name, age, email)
 * - Report type
 * - Professional design with yellow/blue theme
 * - Geometric design elements
 */

interface ReportCoverPageProps {
  studentName: string;
  studentAge: number;
  studentEmail: string;
  reportType: "Career Report for 9th or 10th PCM" | "Career Report for 11th or 12th PCM" | "Career Roadmap" | "Career Fit Assessment";
}

export default function ReportCoverPage({
  studentName,
  studentAge,
  studentEmail,
  reportType
}: ReportCoverPageProps) {
  return (
    <div style={styles.container}>
      {/* Header with OneGrasp Logo */}
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.oneGraspLogo}>OneGrasp</div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div style={styles.decorativeTop}></div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Report Details Section */}
        <div style={styles.reportDetails}>
          <div style={styles.label}>Report Prepared For</div>
          <h1 style={styles.studentName}>{studentName}</h1>

          <div style={styles.studentInfo}>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>👤</span>
              <span style={styles.infoText}>{studentAge} Years</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>✉️</span>
              <span style={styles.infoText}>{studentEmail}</span>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={styles.spacer}></div>

        {/* Report Type Banner */}
        <div style={styles.reportTypeBanner}>
          <h2 style={styles.reportTypeText}>{reportType}</h2>
        </div>

        {/* Footer Section */}
        <div style={styles.footer}>
          <div style={styles.poweredBy}>
            <span style={styles.poweredByText}>Powered By:</span>
            <div style={styles.poweredByLogo}>OneGrasp</div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom */}
      <div style={styles.decorativeBottom}></div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative' as const,
    overflow: 'hidden',
    pageBreakAfter: 'always' as const,
  },

  header: {
    padding: '30px 40px',
    borderBottom: '1px solid #e5e5e5',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  logoSection: {
    textAlign: 'right' as const,
  },

  oneGraspLogo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a3a52',
    letterSpacing: '1px',
  },

  decorativeTop: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '150px',
    height: '150px',
    background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
    borderRadius: '0 0 100px 0',
    opacity: 0.9,
  },

  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '60px 40px',
    position: 'relative' as const,
    zIndex: 2,
  },

  reportDetails: {
    marginBottom: '40px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },

  studentName: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#1a3a52',
    margin: '0 0 24px',
    lineHeight: 1.2,
  },

  studentInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
  },

  infoIcon: {
    fontSize: '20px',
    display: 'inline-block',
  },

  infoText: {
    color: '#333',
    fontWeight: '500',
  },

  spacer: {
    flex: 1,
  },

  reportTypeBanner: {
    backgroundColor: '#1a3a52',
    color: 'white',
    padding: '24px 28px',
    borderRadius: '12px 12px 0 0',
    marginBottom: '0',
    boxShadow: '0 4px 12px rgba(26, 58, 82, 0.15)',
  },

  reportTypeText: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0',
    color: 'white',
  },

  footer: {
    backgroundColor: '#f9f9f9',
    padding: '20px 28px',
    borderTop: '1px solid #e5e5e5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  poweredBy: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  poweredByText: {
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
  },

  poweredByLogo: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a3a52',
  },

  disclaimer: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#d32f2f',
  },

  decorativeBottom: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '120px',
    background: 'linear-gradient(90deg, #FFA500 0%, #FFD700 50%, transparent 100%)',
    opacity: 0.8,
    zIndex: 0,
  },
};
