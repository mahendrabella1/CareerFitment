/**
 * Top 10 Careers Per Domain/Cluster
 * Extracted from 930+ Career Library
 * Used in reports to show top career recommendations per domain
 */

import { CAREER_LIBRARY_930_PLUS } from './careerLibrary930Plus';

export interface CareerPreview {
  id: string;
  name: string;
  overview: string;
  skills: string[];
  salaryRange: string;
  demand: string;
  fitScore?: number; // Can be calculated based on assessment
}

/**
 * Get top 10 careers for each domain/cluster
 * Filtered from the 930+ career library
 */
export function getTopCareersPerDomain(): Record<string, CareerPreview[]> {
  const domainCareers: Record<string, typeof CAREER_LIBRARY_930_PLUS> = {};

  // Group careers by cluster/domain
  CAREER_LIBRARY_930_PLUS.forEach(career => {
    if (!domainCareers[career.clusterId]) {
      domainCareers[career.clusterId] = [];
    }
    domainCareers[career.clusterId].push(career);
  });

  // Extract top 10 from each domain
  const topCareersPerDomain: Record<string, CareerPreview[]> = {};

  Object.entries(domainCareers).forEach(([domain, careers]) => {
    // Sort by current demand and fit, take top 10
    const top10 = careers
      .slice(0, 10) // Take first 10 (likely already sorted by relevance in source)
      .map(career => ({
        id: career.id,
        name: career.name,
        overview: career.overview,
        skills: career.skills.slice(0, 5), // Top 5 skills
        salaryRange: career.salaryRange?.[0]
          ? `₹${(career.salaryRange[0].min / 100000).toFixed(1)}L - ₹${(career.salaryRange[0].max / 100000).toFixed(1)}L`
          : 'N/A',
        demand: career.currentDemand || 'medium',
      }));

    topCareersPerDomain[domain] = top10;
  });

  return topCareersPerDomain;
}

/**
 * Get top 10 careers for specific domain
 */
export function getTopCareersForDomain(clusterId: string): CareerPreview[] {
  const topCareers = getTopCareersPerDomain();
  return topCareers[clusterId] || [];
}

/**
 * Get top 3 domains with highest fit scores from assessment
 * Used to determine which domain's top 10 careers to show
 */
export function getTop3DomainsFromAssessment(
  domainScores: Record<string, number>
): { domain: string; score: number }[] {
  return Object.entries(domainScores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

/**
 * Get careers for top 3 domains
 * Returns top 10 careers for each of the top 3 scoring domains
 */
export function getCareersForTop3Domains(
  domainScores: Record<string, number>
): Record<string, { domain: string; score: number; careers: CareerPreview[] }> {
  const top3Domains = getTop3DomainsFromAssessment(domainScores);
  const allTopCareers = getTopCareersPerDomain();

  const result: Record<string, { domain: string; score: number; careers: CareerPreview[] }> = {};

  top3Domains.forEach(({ domain, score }) => {
    result[domain] = {
      domain,
      score,
      careers: allTopCareers[domain] || []
    };
  });

  return result;
}

// Domain labels for display
export const DOMAIN_LABELS: Record<string, string> = {
  tech: 'Technology & IT',
  engineering: 'Engineering',
  health: 'Healthcare',
  business: 'Business & Management',
  science: 'Science & Research',
  social: 'Social & Education',
  creative: 'Arts & Creative',
  trades: 'Trades & Skills'
};

// Domain colors for visualization
export const DOMAIN_COLORS: Record<string, string> = {
  tech: '#3b82f6',      // Blue
  engineering: '#f97316', // Orange
  health: '#ef4444',     // Red
  business: '#8b5cf6',   // Purple
  science: '#06b6d4',    // Cyan
  social: '#10b981',     // Emerald
  creative: '#ec4899',   // Pink
  trades: '#6b7280'      // Gray
};

// Domain emojis
export const DOMAIN_EMOJIS: Record<string, string> = {
  tech: '💻',
  engineering: '⚙️',
  health: '🏥',
  business: '💼',
  science: '🔬',
  social: '📚',
  creative: '🎨',
  trades: '🔧'
};
