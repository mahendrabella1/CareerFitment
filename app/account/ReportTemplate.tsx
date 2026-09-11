'use client';

/**
 * Unified Report Template
 * Shared wrapper for all assessment reports (Class 6, 7, 8, 11-12)
 * Handles header, page sizing, footer, and print styling
 */

import React, { ReactNode } from 'react';

interface ReportTemplateProps {
  studentName: string;
  studentEmail?: string;
  assessmentDate: string;
  reportType: 'class6' | 'class7' | 'class8' | 'class11';
  children: ReactNode;
  onPrint?: () => void;
}

export function ReportTemplate({
  studentName,
  studentEmail,
  assessmentDate,
  reportType,
  children,
  onPrint,
}: ReportTemplateProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const reportTypeLabel = {
    class6: 'Class 6',
    class7: 'Class 7',
    class8: 'Class 8',
    class11: 'Class 11-12',
  }[reportType];

  const styles = `
    .report-wrapper {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1f2937;
      background: #f9fafb;
    }

    .report-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .report-header-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .report-header-actions {
      display: flex;
      gap: 8px;
    }

    .print-button {
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .print-button:hover {
      background: #2563eb;
    }

    .report-content {
      max-width: 100%;
      background: white;
    }

    .report-page {
      background: white;
      page-break-after: always;
      page-break-inside: avoid;
      padding: 40px;
      min-height: 297mm;
      display: flex;
      flex-direction: column;
    }

    .report-footer {
      margin-top: auto;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }

    .student-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .student-info-row {
      display: flex;
      flex-direction: column;
    }

    .student-info-label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .student-info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    @media print {
      .report-header {
        display: none;
      }

      .report-page {
        margin: 0;
        padding: 40px;
        min-height: 297mm;
        break-after: page;
      }

      .report-page:last-child {
        min-height: auto;
      }

      @page {
        size: A4;
        margin: 0.5in;
      }

      body {
        background: white;
      }
    }
  `;

  return (
    <div className="report-wrapper">
      <style>{styles}</style>

      {/* Header - Hidden on print */}
      <div className="report-header">
        <div className="report-header-title">
          Assessment Report - {reportTypeLabel}
        </div>
        <div className="report-header-actions">
          <button className="print-button" onClick={handlePrint}>
            🖨️ Print or Save as PDF
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="report-content">
        {/* Student Info Section */}
        <div className="report-page">
          <div className="student-info">
            <div className="student-info-row">
              <span className="student-info-label">Student Name</span>
              <span className="student-info-value">{studentName}</span>
            </div>
            <div className="student-info-row">
              <span className="student-info-label">Assessment Date</span>
              <span className="student-info-value">{assessmentDate}</span>
            </div>
            {studentEmail && (
              <div className="student-info-row" style={{ gridColumn: '1 / -1' }}>
                <span className="student-info-label">Email</span>
                <span className="student-info-value">{studentEmail}</span>
              </div>
            )}
          </div>

          {/* Main Content */}
          {children}

          {/* Footer */}
          <div className="report-footer">
            <p>
              OneGrasp Assessment System | {reportTypeLabel} Career & Personal Development | {assessmentDate}
            </p>
            <p>This report is confidential and customized for {studentName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
