/**
 * Source Management Utilities
 * Handles verification, freshness checks, and source attribution
 */

import { Source } from './schema';

// ============================================================================
// PREDEFINED SOURCES (No content should use unknown sources)
// ============================================================================

export const VERIFIED_SOURCES: Record<string, Source> = {
  // Official Government
  'neet-official': {
    id: 'neet-official',
    name: 'NEET Official',
    url: 'https://neet.nta.ac.in',
    type: 'official',
    lastVerified: new Date('2026-08-01'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-01'),
  },

  'jee-official': {
    id: 'jee-official',
    name: 'JEE Official',
    url: 'https://jeemain.nta.ac.in',
    type: 'official',
    lastVerified: new Date('2026-08-01'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-01'),
  },

  'nep-2020': {
    id: 'nep-2020',
    name: 'National Education Policy 2020',
    url: 'https://www.education.gov.in',
    type: 'official',
    lastVerified: new Date('2026-07-15'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-07-15'),
  },

  // Educational Platforms
  'linkedin-learning': {
    id: 'linkedin-learning',
    name: 'LinkedIn Learning',
    url: 'https://www.linkedin.com/learning',
    type: 'educational',
    lastVerified: new Date('2026-08-20'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-20'),
  },

  'coursera': {
    id: 'coursera',
    name: 'Coursera',
    url: 'https://www.coursera.org',
    type: 'educational',
    lastVerified: new Date('2026-08-20'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-20'),
  },

  'udemy': {
    id: 'udemy',
    name: 'Udemy',
    url: 'https://www.udemy.com',
    type: 'educational',
    lastVerified: new Date('2026-08-20'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-20'),
  },

  // Financial & Market Data
  'nse-india': {
    id: 'nse-india',
    name: 'National Stock Exchange India',
    url: 'https://www.nseindia.com',
    type: 'official',
    lastVerified: new Date('2026-08-26'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-26'),
  },

  'bse-india': {
    id: 'bse-india',
    name: 'Bombay Stock Exchange',
    url: 'https://www.bseindia.com',
    type: 'official',
    lastVerified: new Date('2026-08-26'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-26'),
  },

  // Legal Resources
  'indian-penal-code': {
    id: 'indian-penal-code',
    name: 'Indian Penal Code',
    url: 'https://www.indiacode.nic.in',
    type: 'official',
    lastVerified: new Date('2026-08-01'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-01'),
  },

  'pocso-act': {
    id: 'pocso-act',
    name: 'Protection of Children from Sexual Offences Act',
    url: 'https://www.indiacode.nic.in',
    type: 'official',
    lastVerified: new Date('2026-08-01'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-01'),
  },

  // Career Data
  'indeed-salaries': {
    id: 'indeed-salaries',
    name: 'Indeed Salary Data',
    url: 'https://www.indeed.com/salaries',
    type: 'database',
    lastVerified: new Date('2026-08-15'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-15'),
  },

  'payscale': {
    id: 'payscale',
    name: 'PayScale',
    url: 'https://www.payscale.com',
    type: 'database',
    lastVerified: new Date('2026-08-15'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-15'),
  },

  // University Rankings
  'qs-rankings': {
    id: 'qs-rankings',
    name: 'QS World University Rankings',
    url: 'https://www.topuniversities.com',
    type: 'database',
    lastVerified: new Date('2026-08-10'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-10'),
  },

  'times-higher-ed': {
    id: 'times-higher-ed',
    name: 'Times Higher Education',
    url: 'https://www.timeshighereducation.com',
    type: 'database',
    lastVerified: new Date('2026-08-10'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-10'),
  },

  // Internship & Opportunity Sources
  'internshala': {
    id: 'internshala',
    name: 'Internshala',
    url: 'https://www.internshala.com',
    type: 'database',
    lastVerified: new Date('2026-08-25'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-25'),
  },

  'linkedin-jobs': {
    id: 'linkedin-jobs',
    name: 'LinkedIn Jobs',
    url: 'https://www.linkedin.com/jobs',
    type: 'database',
    lastVerified: new Date('2026-08-26'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-26'),
  },

  // Research & Publications
  'google-scholar': {
    id: 'google-scholar',
    name: 'Google Scholar',
    url: 'https://scholar.google.com',
    type: 'database',
    lastVerified: new Date('2026-08-20'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-20'),
  },

  'arxiv': {
    id: 'arxiv',
    name: 'arXiv',
    url: 'https://arxiv.org',
    type: 'research',
    lastVerified: new Date('2026-08-20'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-20'),
  },

  // Scholarships
  'mhrd-scholarships': {
    id: 'mhrd-scholarships',
    name: 'Ministry of Education - Scholarships',
    url: 'https://www.education.gov.in',
    type: 'official',
    lastVerified: new Date('2026-08-15'),
    verificationStatus: 'verified',
    lastUpdated: new Date('2026-08-15'),
  },
};

// ============================================================================
// SOURCE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Get a verified source by ID
 * Throws error if source is not pre-approved
 */
export function getSource(sourceId: string): Source {
  const source = VERIFIED_SOURCES[sourceId];
  if (!source) {
    throw new Error(`Unknown source: ${sourceId}. Add to VERIFIED_SOURCES first.`);
  }
  return source;
}

/**
 * Add a new source (admin only in production)
 * Never called from frontend
 */
export function addSource(source: Source): void {
  if (VERIFIED_SOURCES[source.id]) {
    throw new Error(`Source ${source.id} already exists`);
  }
  VERIFIED_SOURCES[source.id] = source;
}

/**
 * Check if content needs refresh based on verification date
 */
export function needsRefresh(lastVerified: Date, maxAgeDays: number = 90): boolean {
  const daysOld = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
  return daysOld > maxAgeDays;
}

/**
 * Get freshness status
 */
export function getFreshnessStatus(lastVerified: Date): 'fresh' | 'aging' | 'stale' {
  const daysOld = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));

  if (daysOld <= 30) return 'fresh';
  if (daysOld <= 90) return 'aging';
  return 'stale';
}

/**
 * Format source attribution
 * e.g., "Source: NEET Official (verified Aug 1, 2026)"
 */
export function formatSourceAttribution(source: Source): string {
  const date = source.lastVerified.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const status =
    source.verificationStatus === 'verified' ? 'verified' : `needs review (${source.verificationStatus})`;

  return `Source: ${source.name} (${status} ${date})`;
}

/**
 * Create source citation object for content
 */
export interface SourceCitation {
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  verifiedDate: string;
  status: 'verified' | 'needs_review' | 'expired' | 'unverified';
  attribution: string;
}

export function createCitation(sourceId: string): SourceCitation {
  const source = getSource(sourceId);

  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl: source.url,
    verifiedDate: source.lastVerified.toISOString(),
    status: source.verificationStatus,
    attribution: formatSourceAttribution(source),
  };
}

/**
 * Validate content before publishing
 * Ensures all external claims have sources
 */
export interface ContentValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateContent(content: {
  externalClaims?: string[];      // Facts that need sources
  source?: Source | string;        // Source ID or object
  lastVerified?: Date;
}): ContentValidationResult {
  const issues: string[] = [];

  if (content.externalClaims && content.externalClaims.length > 0) {
    if (!content.source) {
      issues.push('External claims require a source');
    }
  }

  if (content.source && typeof content.source === 'string') {
    try {
      getSource(content.source);
    } catch (e) {
      issues.push(`Invalid source ID: ${content.source}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// SOURCE METADATA
// ============================================================================

/**
 * Mark a source as needing review
 * Called when content from this source needs verification
 */
export function flagSourceForReview(sourceId: string, reason: string): void {
  const source = VERIFIED_SOURCES[sourceId];
  if (source) {
    source.verificationStatus = 'needs_review';
    source.lastUpdated = new Date();
    console.warn(`Source flagged: ${source.name} - ${reason}`);
  }
}

/**
 * Mark a source as expired
 * Content from this source should not be used until re-verified
 */
export function markSourceExpired(sourceId: string): void {
  const source = VERIFIED_SOURCES[sourceId];
  if (source) {
    source.verificationStatus = 'expired';
    source.lastUpdated = new Date();
    console.warn(`Source marked expired: ${source.name}`);
  }
}

/**
 * Get all sources grouped by status
 * Useful for admin dashboard
 */
export function getSourcesByStatus() {
  const grouped: Record<string, Source[]> = {
    verified: [],
    needs_review: [],
    expired: [],
    unverified: [],
  };

  Object.values(VERIFIED_SOURCES).forEach((source) => {
    grouped[source.verificationStatus].push(source);
  });

  return grouped;
}

/**
 * Get sources that need attention
 */
export function getSourcesNeedingAttention(): Source[] {
  return Object.values(VERIFIED_SOURCES).filter(
    (s) => s.verificationStatus !== 'verified' || needsRefresh(s.lastVerified, 90)
  );
}
