"use client";

/**
 * Class 11-12 Report Cover Page
 * Professional PDF-ready first page with student details and test info
 */

import { format } from "date-fns";

interface ReportCoverProps {
  studentName: string;
  studentEmail: string;
  studentClass: "11" | "12";
  school?: string;
  stream?: "MPC" | "BiPC" | "PCMB" | "Arts" | "Commerce" | "Vocational";
  completedDate: Date;
  reportGeneratedDate?: Date;
}

export function Class11ReportCover({
  studentName,
  studentEmail,
  studentClass,
  school,
  stream,
  completedDate,
  reportGeneratedDate = new Date()
}: ReportCoverProps) {
  return (
    <div className="report-cover">
      {/* Background decoration */}
      <div className="cover-bg-accent accent-1" />
      <div className="cover-bg-accent accent-2" />
      <div className="cover-bg-accent accent-3" />

      {/* Top section - Logo */}
      <div className="cover-top">
        <div className="logo-container">
          <img
            src="/onegrasp-logo-tight.png"
            alt="OneGrasp"
            className="cover-logo"
          />
        </div>
        <p className="tagline">Advanced Career Discovery & Fitment Assessment</p>
      </div>

      {/* Middle section - Report title */}
      <div className="cover-middle">
        <div className="report-header">
          <h1 className="report-title">Career Discovery Report</h1>
          <p className="report-subtitle">Class {studentClass} Assessment Results</p>
          <div className="divider" />
          <p className="report-description">
            Your comprehensive 4-layer analysis of career fit, education pathways,
            and personalized recommendations
          </p>
        </div>
      </div>

      {/* Bottom section - Student details */}
      <div className="cover-bottom">
        <div className="details-grid">
          <div className="detail-block">
            <label className="detail-label">Student Name</label>
            <p className="detail-value">{studentName}</p>
          </div>

          <div className="detail-block">
            <label className="detail-label">Email Address</label>
            <p className="detail-value">{studentEmail}</p>
          </div>

          <div className="detail-block">
            <label className="detail-label">Class</label>
            <p className="detail-value">Class {studentClass}</p>
          </div>

          {stream && (
            <div className="detail-block">
              <label className="detail-label">Current Stream</label>
              <p className="detail-value">{stream}</p>
            </div>
          )}

          {school && (
            <div className="detail-block">
              <label className="detail-label">School</label>
              <p className="detail-value">{school}</p>
            </div>
          )}

          <div className="detail-block">
            <label className="detail-label">Assessment Completed</label>
            <p className="detail-value">{format(completedDate, "dd MMMM yyyy")}</p>
          </div>

          <div className="detail-block">
            <label className="detail-label">Report Generated</label>
            <p className="detail-value">{format(reportGeneratedDate, "dd MMMM yyyy")}</p>
          </div>

          <div className="detail-block">
            <label className="detail-label">Questions Attempted</label>
            <p className="detail-value">81 Questions</p>
          </div>
        </div>

        <div className="test-info">
          <div className="info-block">
            <h3 className="info-title">About This Assessment</h3>
            <ul className="info-list">
              <li>8 Psychometric dimensions</li>
              <li>RIASEC career interests</li>
              <li>Aptitude & reasoning test</li>
              <li>Strength & intelligence mapping</li>
              <li>Academic & career fit analysis</li>
              <li>Personalized education pathway</li>
            </ul>
          </div>

          <div className="info-block">
            <h3 className="info-title">Report Includes</h3>
            <ul className="info-list">
              <li><strong>Layer 1:</strong> Your psychometric profile</li>
              <li><strong>Layer 2:</strong> Academic reality check</li>
              <li><strong>Layer 3:</strong> Education & career pathway</li>
              <li><strong>Layer 4:</strong> Career aspiration analysis</li>
              <li><strong>Summary:</strong> Top career recommendations</li>
            </ul>
          </div>
        </div>

        <div className="footer-note">
          <p>
            This report is confidential and based on your responses to the OneGrasp
            Career Discovery Assessment. It is designed to guide your career exploration
            and academic planning decisions.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="cover-footer">
        <div className="footer-left">
          <p className="footer-text">OneGrasp Assessment System 2026</p>
        </div>
        <div className="footer-right">
          <p className="footer-text">www.onegrasp.com</p>
        </div>
      </div>
    </div>
  );
}

export const Class11ReportCoverStyles = `
.report-cover {
  position: relative;
  width: 100%;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 60px;
  page-break-after: always;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Background accents - decorative shapes */
.cover-bg-accent {
  position: absolute;
  opacity: 0.05;
  z-index: 0;
}

.cover-bg-accent.accent-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #2f6bff, #0052ff);
  border-radius: 50%;
  top: -100px;
  right: -100px;
}

.cover-bg-accent.accent-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #12996b, #008a45);
  border-radius: 50%;
  bottom: 200px;
  left: -50px;
}

.cover-bg-accent.accent-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #e08a1e, #d67c0f);
  border-radius: 50%;
  bottom: -80px;
  right: 100px;
}

/* Top section - Logo */
.cover-top {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 40px;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.cover-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
}

.tagline {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin: 0;
}

/* Middle section - Report title */
.cover-middle {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.report-header {
  text-align: center;
  max-width: 600px;
}

.report-title {
  font-size: 56px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
}

.report-subtitle {
  font-size: 28px;
  color: #2f6bff;
  font-weight: 700;
  margin: 0 0 24px 0;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #2f6bff, #12996b);
  border-radius: 2px;
  margin: 0 auto 24px;
}

.report-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
}

/* Bottom section - Details */
.cover-bottom {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-block {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.detail-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  word-break: break-word;
}

/* Test info sections */
.test-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.info-block {
  background: #f8f8f8;
  padding: 24px;
  border-radius: 12px;
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  font-size: 13px;
  color: #555;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
}

.info-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #12996b;
  font-weight: 700;
}

/* Footer note */
.footer-note {
  background: #f0f4ff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
  margin-bottom: 20px;
}

.footer-note p {
  font-size: 12px;
  color: #555;
  margin: 0;
  line-height: 1.5;
}

/* Footer */
.cover-footer {
  position: absolute;
  bottom: 40px;
  left: 60px;
  right: 60px;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.footer-left,
.footer-right {
  flex: 1;
}

.footer-left {
  text-align: left;
}

.footer-right {
  text-align: right;
}

.footer-text {
  font-size: 11px;
  color: #999;
  margin: 0;
  letter-spacing: 0.5px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .report-cover {
    padding: 40px;
    height: auto;
    min-height: 100vh;
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .test-info {
    grid-template-columns: 1fr;
  }

  .report-title {
    font-size: 42px;
  }

  .report-subtitle {
    font-size: 22px;
  }

  .cover-footer {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
  }
}

@media (max-width: 640px) {
  .report-cover {
    padding: 24px;
  }

  .cover-logo {
    height: 60px;
  }

  .report-title {
    font-size: 32px;
  }

  .report-subtitle {
    font-size: 18px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .test-info {
    gap: 16px;
  }

  .info-block {
    padding: 16px;
  }

  .cover-bg-accent {
    display: none;
  }
}

/* Print styles */
@media print {
  .report-cover {
    page-break-after: always;
    height: 100vh;
  }

  .cover-bg-accent {
    display: none;
  }
}
`;
