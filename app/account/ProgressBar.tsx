'use client';

/**
 * Unified Progress Bar Component
 * Displays score 0-100 with consistent styling
 * Used across all assessment reports
 */

import React from 'react';

interface ProgressBarProps {
  label: string;
  score: number;
  colorScheme?: 'blue' | 'green' | 'amber' | 'red';
  showPercentage?: boolean;
  description?: string;
}

const colorSchemes = {
  blue: {
    display: 'text-blue-600 print:text-blue-700',
    bar: 'bg-blue-100 print:bg-blue-200',
    fill: 'bg-blue-600 print:bg-blue-700',
  },
  green: {
    display: 'text-green-600 print:text-green-700',
    bar: 'bg-green-100 print:bg-green-200',
    fill: 'bg-green-600 print:bg-green-700',
  },
  amber: {
    display: 'text-amber-600 print:text-amber-700',
    bar: 'bg-amber-100 print:bg-amber-200',
    fill: 'bg-amber-600 print:bg-amber-700',
  },
  red: {
    display: 'text-red-600 print:text-red-700',
    bar: 'bg-red-100 print:bg-red-200',
    fill: 'bg-red-600 print:bg-red-700',
  },
};

function getColorScheme(score: number): 'green' | 'blue' | 'amber' | 'red' {
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'amber';
  return 'red';
}

export function ProgressBar({
  label,
  score,
  colorScheme,
  showPercentage = true,
  description,
}: ProgressBarProps) {
  const actualScheme = colorScheme || getColorScheme(score);
  const colors = colorSchemes[actualScheme];

  const styles = `
    .progress-bar-container {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .progress-bar-label {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-bar-score {
      font-size: 14px;
      font-weight: 700;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      background: #e5e7eb;
    }

    .progress-bar-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }

    .progress-bar-description {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
      font-style: italic;
    }

    @media print {
      .progress-bar {
        background: #d1d5db !important;
      }

      .progress-bar-fill {
        transition: none;
      }
    }
  `;

  return (
    <div className="progress-bar-container">
      <style>{styles}</style>

      <div className="progress-bar-label">
        <span>{label}</span>
        {showPercentage && (
          <span className={`progress-bar-score ${colors.display}`}>
            {Math.round(score)}%
          </span>
        )}
      </div>

      <div className={`progress-bar ${colors.bar}`}>
        <div
          className={`progress-bar-fill ${colors.fill}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {description && (
        <div className="progress-bar-description">{description}</div>
      )}
    </div>
  );
}
