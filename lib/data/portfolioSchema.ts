/**
 * Portfolio Schema - LinkedIn-like profile builder
 * Comprehensive user portfolio with work experience, education, skills, certifications
 */

export interface PortfolioExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string; // YYYY-MM format
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  skills: string[];
}

export interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  description?: string;
}

export interface PortfolioCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  endorsements: number;
  category: 'technical' | 'professional' | 'language' | 'other';
}

export interface PortfolioProfile {
  userId: string;
  profileSlug: string; // unique URL slug like "john-doe-engineer"
  headline: string; // Professional headline
  bio: string; // Short bio/about
  profileImage?: string; // URL or base64
  coverImage?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;

  // Career info from assessment
  careerFit?: string; // Top career recommendation
  careerScore?: number; // Overall fit score

  // Portfolio sections
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  certifications: PortfolioCertification[];
  skills: PortfolioSkill[];

  // Social links
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;

  // Portfolio metadata
  isPublic: boolean;
  shareToken: string; // For public share link
  views: number;
  lastUpdated: string; // ISO date
  createdAt: string;

  // Privacy settings
  showEmail: boolean;
  showPhone: boolean;
  showCareerScore: boolean;
}

export interface PortfolioPreview {
  profileSlug: string;
  headline: string;
  location?: string;
  careerFit?: string;
  skills: string[];
  experience: Array<{ title: string; company: string }>;
}
