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

// Real hex values, not Tailwind utility classes - this project has no
// Tailwind config, so `text-blue-600` etc. never applied anything and every
// bar rendered with an invisible, uncoloured fill.
const colorSchemes = {
  blue: { display: '#2f6bff', bar: '#e8edff', fill: '#2f6bff' },
  green: { display: '#12996b', bar: '#eaf6f0', fill: '#12996b' },
  amber: { display: '#e08a1e', bar: '#fdf1e0', fill: '#e08a1e' },
  red: { display: '#E23B41', bar: '#FDECED', fill: '#E23B41' },
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
          <span className="progress-bar-score" style={{ color: colors.display }}>
            {Math.round(score)}%
          </span>
        )}
      </div>

      <div className="progress-bar" style={{ background: colors.bar }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, score))}%`, background: colors.fill }}
        />
      </div>

      {description && (
        <div className="progress-bar-description">{description}</div>
      )}
    </div>
  );
}
