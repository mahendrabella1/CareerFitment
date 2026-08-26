/**
 * OneGrasp Data Schema
 * Phase 1 Foundation: Core entities, types, and relationships
 *
 * Principles:
 * - All external content has source attribution
 * - All data is verified with timestamp
 * - Schema is extensible for admin CMS
 * - No hardcoded content
 */

// ============================================================================
// SOURCE MANAGEMENT
// ============================================================================

export interface Source {
  id: string;
  name: string;          // e.g., "NEET Official", "LinkedIn Learning"
  url?: string;          // Source website
  type: 'official' | 'verified' | 'educational' | 'database' | 'research';
  lastVerified: Date;
  verificationStatus: 'verified' | 'needs_review' | 'expired' | 'unverified';
  lastUpdated: Date;
}

// ============================================================================
// STUDENT PROFILE & ASSESSMENT
// ============================================================================

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  class: 9 | 10 | 11 | 12;
  school?: string;
  stream?: 'science' | 'commerce' | 'humanities' | 'vocational';
  createdAt: Date;
  updatedAt: Date;

  // Assessment
  assessmentId?: string;
  assessmentCompletedAt?: Date;
  latestAssessment?: AssessmentData;

  // Preferences (for recommendations)
  preferences?: StudentPreferences;

  // Saved opportunities
  savedCareers?: string[];
  savedColleges?: string[];
  savedInternships?: string[];
  savedScholarships?: string[];
  savedResearch?: string[];
}

export interface StudentPreferences {
  preferredCountries?: string[];
  preferredSubjects?: string[];
  budgetRange?: { min: number; max: number; currency: string };
  careerInterests?: string[];
  studyAbroadInterest: boolean;
  entrepreneurshipInterest: boolean;
  researchInterest: boolean;
}

export interface AssessmentData {
  id: string;
  studentId: string;
  completedAt: Date;

  // 8 Dimensions
  dimensions: {
    personality: number;
    careerInterest: number;
    multipleIntelligence: number;
    emotionalIntelligence: number;
    learningStyles: number;
    motivators: number;
    strengths: number;
    aptitude: number;
  };

  // Career clusters
  clusters: {
    id: string;
    name: string;
    score: number;
    rank: number;
  }[];

  // Themes/RIASEC
  themes?: string[];
  riasecScores?: { letter: string; name: string; score: number }[];

  // Overall
  overallFitment: number;
  archetype?: string;
  journeyCode?: string;
  journeyName?: string;
}

// ============================================================================
// CAREER LIBRARY
// ============================================================================

export interface CareerDomain {
  id: string;
  name: string;                    // e.g., "Technology", "Healthcare"
  description: string;
  clusters: CareerCluster[];
  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerCluster {
  id: string;
  domainId: string;
  name: string;                    // e.g., "Software Development"
  description: string;
  roles: Career[];
  color?: string;                  // For UI
  source?: Source | string;
}

export interface Career {
  id: string;
  clusterId: string;
  name: string;                    // e.g., "Software Developer"

  // Core information
  overview: string;
  whatTheyDo: string;

  // Education
  education: {
    subjects: string[];            // e.g., ["Mathematics", "Computer Science"]
    degrees: string[];             // e.g., ["Bachelor's in CS", "Master's in AI"]
    certifications?: string[];
    entranceExams?: string[];
  };

  // Requirements
  skills: string[];
  tools?: string[];

  // Opportunities
  companies?: string[];            // Top hiring companies
  industries?: string[];

  // Demand
  currentDemand: 'high' | 'medium' | 'low';
  emergingDemand?: 'high' | 'medium' | 'low';
  futureOutlook?: string;
  aiImpact?: string;               // How AI affects this role

  // Salary (with sources)
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    experience: string;            // e.g., "0-2 years", "5-10 years"
    region?: string;               // e.g., "India", "USA"
    source?: Source | string;
  }[];

  // Pathways
  beginner: {
    title: string;
    steps: string[];
    duration?: string;
  };
  advanced?: {
    title: string;
    steps: string[];
    duration?: string;
  };

  // Resources
  recommendedInternships?: string[];  // Internship IDs
  recommendedProjects?: string[];
  relatedCareers?: string[];          // Career IDs

  // Metadata
  tags?: ('high_demand' | 'emerging' | 'new_age' | 'fast_growing' | 'traditional' | 'research_oriented' | 'entrepreneurship' | 'high_specialization' | 'creative')[];
  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// EDUCATION (Colleges, Universities, Courses)
// ============================================================================

export interface College {
  id: string;
  name: string;
  location: string;              // City, State
  type: 'government' | 'private';

  courses: {
    name: string;
    stream?: string;
    specialization?: string;
    duration?: string;
  }[];

  entrance_exams?: string[];     // NEET, JEE, etc.

  website?: string;
  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  description: string;
  educationSystem?: string;
  popularCourses?: string[];
  universitiesCount?: number;
  tuitionRange?: { min: number; max: number; currency: string; perYear?: boolean };
  livingCosts?: { min: number; max: number; currency: string; perMonth?: boolean };
  scholarships?: string[];
  eligibility?: string;
  entranceTests?: string[];
  studentVisa?: string;
  intakeMonths?: string[];
  applicationTimeline?: string;
  durationUg?: string;
  postStudyOptions?: string;
  website?: string;
  lastVerified?: Date;
}

export interface University {
  id: string;
  name: string;
  country: string;
  location?: string;             // City

  // Academic info
  programs: UniversityProgram[];
  ranking?: {
    source: string;              // e.g., "QS World Rankings"
    rank: number;
    year: number;
  };

  // Costs
  tuitionRange?: {
    min: number;
    max: number;
    currency: string;
    perYear: boolean;
  };

  livingCosts?: {
    min: number;
    max: number;
    currency: string;
    perMonth: boolean;
  };

  // Requirements
  englishRequirements?: {
    IELTS?: { min: number; test: string };
    TOEFL?: { min: number; test: string };
  };

  academicRequirements?: string;

  // Scholarships
  scholarships?: string[];       // Scholarship IDs

  // Student life
  accommodationOptions?: string[];
  studentLife?: string;
  safetyRating?: number;         // 1-10

  // Application
  intakePeriods?: string[];      // e.g., "Fall", "Spring"
  applicationDeadline?: Date;

  // Contact
  website?: string;
  admissionsEmail?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UniversityProgram {
  id: string;
  universityId: string;
  name: string;                  // e.g., "Bachelor of Science in Computer Science"
  level: 'UG' | 'PG' | 'PhD' | 'Certificate';
  duration: string;              // e.g., "4 years"
  tuition?: {
    min: number;
    max: number;
    currency: string;
    perYear: boolean;
  };
  requirements?: string[];
}

// ============================================================================
// OPPORTUNITIES
// ============================================================================

export interface Internship {
  id: string;
  title: string;
  organization: string;

  // Details
  description: string;
  skills: string[];

  // Duration & Timeline
  duration: string;              // e.g., "3 months", "6 weeks"
  startDate?: Date;
  applicationDeadline?: Date;

  // Type
  remote: 'onsite' | 'remote' | 'hybrid';
  paid: boolean;
  stipend?: {
    amount: number;
    currency: string;
    perMonth: boolean;
  };

  // Eligibility
  eligibility: string;           // e.g., "Class 10+", "Bachelor's students"
  targetClass?: (9 | 10 | 11 | 12)[];

  // Application
  applicationLink?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workshop {
  id: string;
  title: string;
  provider: string;

  // Details
  description: string;
  category: string;              // e.g., "Programming", "Design"
  level: 'beginner' | 'intermediate' | 'advanced';

  // Duration & Timeline
  duration: string;              // e.g., "4 weeks", "20 hours"
  startDate?: Date;
  registrationDeadline?: Date;

  // Cost
  price?: {
    amount: number;
    currency: string;
  };
  free: boolean;

  // Certificate
  certificateOffered: boolean;
  certificationType?: string;

  // Eligibility
  eligibility: string;
  targetClass?: (9 | 10 | 11 | 12)[];

  // Registration
  registrationLink?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;

  // Details
  description: string;
  awardAmount?: {
    min: number;
    max: number;
    currency: string;
  };

  // Eligibility
  eligibility: string[];         // e.g., "Class 12 pass", "Merit-based"
  targetClass?: (9 | 10 | 11 | 12)[];
  streamEligibility?: ('science' | 'commerce' | 'humanities')[];

  // Academic criteria
  minPercentage?: number;
  minCGPA?: number;

  // Timeline
  applicationDeadline?: Date;

  // Application
  applicationLink?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// RESEARCH & CONFERENCES
// ============================================================================

export interface ResearchResource {
  id: string;
  title: string;
  category: 'basics' | 'methodology' | 'writing' | 'submission' | 'ethics';

  content: string;
  resources?: string[];          // URLs, references

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conference {
  id: string;
  name: string;
  discipline: string;            // e.g., "Biology", "Computer Science"

  description: string;

  // Timeline
  submissionDeadline?: Date;
  eventDate?: Date;
  location?: string;

  // Details
  studentEligibility: boolean;
  website?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Journal {
  id: string;
  name: string;
  discipline: string;

  description: string;
  openAccess: boolean;

  // Submission
  submissionLink?: string;
  reviewProcess?: string;

  // Credibility
  peerReviewed: boolean;
  impactFactor?: number;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// STARTUPS & COMPANIES
// ============================================================================

export interface Startup {
  id: string;
  name: string;
  foundedYear: number;

  // Details
  description: string;
  problem: string;
  solution: string;

  // Business
  businessModel?: string;
  founders?: string[];

  // Growth
  status: 'active' | 'acquired' | 'closed' | 'pivoted';
  funding?: {
    amount: number;
    currency: string;
    round: string;              // e.g., "Series A", "Seed"
    source?: Source | string;
  }[];

  // Impact & Lessons
  lessons?: string[];
  mistakes?: string[];
  currentStatus?: string;

  // Opportunities
  hiringLink?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  industry: string;

  description: string;

  // Size & Reach
  founded?: number;
  headquarters?: string;

  // Hiring
  activeCareers?: Career[];
  hiringFor?: string[];         // Job titles

  // Data
  salaryData?: string[];         // Links to salary info
  reviewsLink?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FINANCIAL & LEGAL RESOURCES
// ============================================================================

export interface FinancialResource {
  id: string;
  title: string;
  category: 'basics' | 'budgeting' | 'saving' | 'investing' | 'markets' | 'insurance';

  content: string;
  examples?: string[];

  // Market data (if applicable)
  marketData?: {
    timestamp: Date;
    source: Source;
    data: Record<string, any>;
  };

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalResource {
  id: string;
  title: string;
  category: 'student_rights' | 'women_safety' | 'men_awareness' | 'child_protection' | 'cyber_safety';

  jurisdiction: string;          // e.g., "India", "Indian Law"
  content: string;

  // Important for legal content
  lastReviewedDate: Date;
  officialReference?: string;    // e.g., "IPC Section 293"
  officialLink?: string;

  source?: Source | string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// AI CONVERSATION & USAGE
// ============================================================================

export interface AIConversation {
  id: string;
  studentId: string;

  messages: AIMessage[];
  usageCount: number;            // Prompts used
  maxUsage: number;              // Limit (7)
  remainingUsage: number;

  studentContext?: {
    dimensions?: Record<string, number>;
    topCareers?: string[];
    recommendedCareers?: string[];
    savedItems?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokensUsed?: number;
}

// ============================================================================
// REPORTS
// ============================================================================

export interface ReportData {
  id: string;
  studentId: string;
  assessmentId: string;

  type: 'comprehensive' | 'career_fit' | 'roadmap';

  // Common sections
  assessment: AssessmentData;
  archetype?: string;
  dimensions: Record<string, { score: number; interpretation: string }>;
  topCareers: Career[];

  // Career Fit Report specific
  matchedClusters?: CareerCluster[];
  suggestedSubjects?: string[];

  // Roadmap Report specific
  roadmapPhases?: RoadmapPhase[];
  timeline?: string;
  milestones?: string[];

  // Metadata
  generatedAt: Date;
  validUntil?: Date;
  source?: Source | string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;                 // e.g., "Class 9-10", "Undergraduate"
  description: string;
  duration: string;
  actions: string[];
  skills: string[];
  opportunities?: (Internship | Workshop | Scholarship)[];
}

// ============================================================================
// CONTENT STATE MANAGEMENT
// ============================================================================

export interface ContentState {
  lastIndexedAt: Date;
  totalItems: {
    careers: number;
    colleges: number;
    universities: number;
    internships: number;
    workshops: number;
    scholarships: number;
    conferences: number;
    startups: number;
  };
  verificationStatus: {
    verified: number;
    needs_review: number;
    expired: number;
  };
}
