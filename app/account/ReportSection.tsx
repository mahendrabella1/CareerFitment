'use client';

/**
 * Reusable Report Section Component
 * Provides collapsible section with consistent styling
 * Used across all assessment reports
 */

import React, { useState, ReactNode } from 'react';

interface ReportSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  colorScheme?: 'blue' | 'amber' | 'green' | 'purple' | 'cyan' | 'pink' | 'violet' | 'yellow';
}

const colorSchemes = {
  blue: {
    header: 'from-blue-900/50 to-indigo-900/50',
    headerPrint: 'print:bg-blue-100 print:border-blue-300',
    content: 'print:bg-white print:border-gray-300',
  },
  amber: {
    header: 'from-amber-900/50 to-orange-900/50',
    headerPrint: 'print:bg-amber-100 print:border-amber-300',
    content: 'print:bg-white print:border-gray-300',
  },
  green: {
    header: 'from-green-900/50 to-emerald-900/50',
    headerPrint: 'print:bg-green-100 print:border-green-300',
    content: 'print:bg-white print:border-gray-300',
  },
  purple: {
    header: 'from-purple-900/50 to-indigo-900/50',
    headerPrint: 'print:bg-purple-100 print:border-purple-300',
    content: 'print:bg-white print:border-gray-300',
  },
  cyan: {
    header: 'from-cyan-900/50 to-blue-900/50',
    headerPrint: 'print:bg-cyan-100 print:border-cyan-300',
    content: 'print:bg-white print:border-gray-300',
  },
  pink: {
    header: 'from-pink-900/50 to-rose-900/50',
    headerPrint: 'print:bg-pink-100 print:border-pink-300',
    content: 'print:bg-white print:border-gray-300',
  },
  violet: {
    header: 'from-violet-900/50 to-purple-900/50',
    headerPrint: 'print:bg-violet-100 print:border-violet-300',
    content: 'print:bg-white print:border-gray-300',
  },
  yellow: {
    header: 'from-yellow-900/50 to-orange-900/50',
    headerPrint: 'print:bg-yellow-100 print:border-yellow-300',
    content: 'print:bg-white print:border-gray-300',
  },
};

export function ReportSection({
  title,
  description,
  children,
  defaultExpanded = true,
  colorScheme = 'blue',
}: ReportSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const colors = colorSchemes[colorScheme];

  const styles = `
    .report-section {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }

    .report-section-header {
      width: 100%;
      padding: 24px;
      background: linear-gradient(to right, var(--from-color), var(--to-color));
      border: 1px solid #9ca3af;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .report-section-header:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .report-section-toggle {
      font-size: 20px;
      transition: transform 0.2s;
      min-width: 24px;
      text-align: center;
    }

    .report-section-toggle.expanded {
      transform: rotate(180deg);
    }

    .report-section-content {
      margin-top: 16px;
      padding: 24px;
      background: #f3f4f6;
      border-radius: 8px;
      border: 1px #e5e7eb solid;
    }

    .report-section-description {
      font-size: 15px;
      color: #6b7280;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .report-section-note {
      font-size: 13px;
      color: #6b7280;
      margin-top: 15px;
      line-height: 1.6;
      font-style: italic;
    }

    @media print {
      .report-section {
        margin-bottom: 24px;
        page-break-inside: avoid;
      }

      .report-section-header {
        background: var(--header-print-bg) !important;
        border: 1px solid var(--header-print-border) !important;
        color: black !important;
      }

      .report-section-toggle {
        display: none;
      }

      .report-section-content {
        background: var(--content-print-bg) !important;
        border: 1px solid var(--content-print-border) !important;
        padding: 20px;
        margin-top: 12px;
      }

      .report-section-description,
      .report-section-note {
        color: black !important;
      }
    }
  `;

  // Map color scheme to CSS variables
  const colorMap = {
    blue: { from: '#1e3a8a', to: '#3730a3' },
    amber: { from: '#78350f', to: '#9a3412' },
    green: { from: '#15803d', to: '#047857' },
    purple: { from: '#581c87', to: '#4c1d95' },
    cyan: { from: '#164e63', to: '#1e3a8a' },
    pink: { from: '#831843', to: '#be123c' },
    violet: { from: '#5b21b6', to: '#6d28d9' },
    yellow: { from: '#713f12', to: '#b45309' },
  };

  const colorVars = colorMap[colorScheme];

  return (
    <div className="report-section" style={{ '--from-color': colorVars.from, '--to-color': colorVars.to } as React.CSSProperties}>
      <style>{styles}</style>

      <button
        className="report-section-header"
        onClick={() => setExpanded(!expanded)}
        style={{ '--from-color': colorVars.from, '--to-color': colorVars.to } as React.CSSProperties}
      >
        <span>{title}</span>
        <span className={`report-section-toggle${expanded ? ' expanded' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="report-section-content">
          {description && (
            <p className="report-section-description">{description}</p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
