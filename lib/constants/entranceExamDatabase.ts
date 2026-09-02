/**
 * Comprehensive Entrance Exam Database
 * Maps entrance exams to careers, streams, difficulty, preparation time
 * Last Updated: 2026-09-02
 */

export interface EntranceExamProfile {
  examCode: string;
  examName: string;
  shortName: string;
  category: "Engineering" | "Medical" | "Law" | "Management" | "Commerce" | "Public Service" | "Other";
  forStreams: string[];
  forDegrees: string[];
  leadingCareers: string[];
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  totalApplicants: number;
  passingRate: number;
  averageScore: number;
  cutoffPercentile: number;
  prepTimeMonths: number;
  subjects: string[];
  syllabus: string;
  frequency: "Once yearly" | "Twice yearly" | "Multiple times";
  eligibility: {
    minAge?: number;
    maxAge?: number;
    streamRequired: string[];
    minEducation: string;
    maxAttempts?: number;
  };
  examFee: number;
  successRate: number;
  topColleges: string[];
  avgPackage: string;
  wfhAvailability: string;
  demandTrend: "Increasing" | "Stable" | "Decreasing";
  prepMaterials: string[];
  coachingNecessary: boolean;
  notes: string;
}

export const ENTRANCE_EXAM_DATABASE: Record<string, EntranceExamProfile> = {
  "JEE-MAIN": {
    examCode: "JEE-MAIN",
    examName: "Joint Entrance Examination (Main)",
    shortName: "JEE Main",
    category: "Engineering",
    forStreams: ["MPC", "PCMB"],
    forDegrees: ["B.Tech", "B.E", "B.Arch"],
    leadingCareers: [
      "Software Engineer",
      "Mechanical Engineer",
      "Civil Engineer",
      "Electrical Engineer",
      "Computer Engineer",
      "Data Scientist"
    ],
    difficulty: "Hard",
    totalApplicants: 1200000,
    passingRate: 23,
    averageScore: 55,
    cutoffPercentile: 85,
    prepTimeMonths: 12,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    syllabus: "NCERT Class 11-12 Physics, Chemistry, Mathematics",
    frequency: "Multiple times",
    eligibility: {
      minAge: 16,
      maxAge: undefined,
      streamRequired: ["MPC", "PCMB"],
      minEducation: "Class 12 Pass or Appearing",
      maxAttempts: 7
    },
    examFee: 800,
    successRate: 8.5,
    topColleges: ["NIT", "IIIT", "Top 200 Engineering Colleges"],
    avgPackage: "8-12 LPA",
    wfhAvailability: "High",
    demandTrend: "Increasing",
    prepMaterials: [
      "NCERT Textbooks",
      "MTG / Arihant guides",
      "Online coaching (Unacademy, Byjus, etc)",
      "YouTube channels",
      "Mock tests"
    ],
    coachingNecessary: false,
    notes: "Gateway to most engineering colleges in India. Multiple attempts per year. Class 12 score not considered."
  },

  "JEE-ADVANCED": {
    examCode: "JEE-ADVANCED",
    examName: "Joint Entrance Examination (Advanced)",
    shortName: "JEE Advanced",
    category: "Engineering",
    forStreams: ["MPC", "PCMB"],
    forDegrees: ["B.Tech at IITs"],
    leadingCareers: [
      "Software Engineer",
      "Data Scientist",
      "AI/ML Engineer",
      "Researcher",
      "Entrepreneur"
    ],
    difficulty: "Very Hard",
    totalApplicants: 150000,
    passingRate: 2.3,
    averageScore: 175,
    cutoffPercentile: 99.5,
    prepTimeMonths: 18,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    syllabus: "Advanced NCERT + Competitive level physics, chemistry, mathematics",
    frequency: "Once yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["MPC", "PCMB"],
      minEducation: "Class 12 Pass or Appearing",
      maxAttempts: 2
    },
    examFee: 3200,
    successRate: 2.5,
    topColleges: ["IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Madras", "IIT Roorkee"],
    avgPackage: "20-30 LPA",
    wfhAvailability: "Very High",
    demandTrend: "Increasing",
    prepMaterials: [
      "Advanced coaching materials",
      "Kota coaching centers",
      "Online coaching platforms",
      "Previous 20 years papers",
      "Advanced problem books"
    ],
    coachingNecessary: true,
    notes: "Gateway to IITs. Extremely competitive. Requires exceptional understanding. Only top JEE Main scorers eligible."
  },

  "NEET": {
    examCode: "NEET",
    examName: "National Eligibility cum Entrance Test",
    shortName: "NEET",
    category: "Medical",
    forStreams: ["BiPC", "PCMB"],
    forDegrees: ["MBBS", "BDS", "AYUSH"],
    leadingCareers: [
      "Doctor (MBBS)",
      "Dentist (BDS)",
      "Nurse",
      "Pharmacist",
      "Veterinarian",
      "Clinical Psychologist"
    ],
    difficulty: "Hard",
    totalApplicants: 1600000,
    passingRate: 11.4,
    averageScore: 445,
    cutoffPercentile: 50,
    prepTimeMonths: 12,
    subjects: ["Physics", "Chemistry", "Biology"],
    syllabus: "NCERT Class 11-12 Physics, Chemistry, Biology",
    frequency: "Once yearly",
    eligibility: {
      minAge: 17,
      streamRequired: ["BiPC", "PCMB"],
      minEducation: "Class 12 Pass or Appearing",
      maxAttempts: 7
    },
    examFee: 1600,
    successRate: 6.2,
    topColleges: ["AIIMS", "Top Medical Colleges", "State Medical Colleges"],
    avgPackage: "10-15 LPA",
    wfhAvailability: "Medium",
    demandTrend: "Increasing",
    prepMaterials: [
      "NCERT Textbooks",
      "Agarwal guides",
      "Medical coaching centers",
      "Online platforms",
      "Biology diagrams and mnemonics"
    ],
    coachingNecessary: false,
    notes: "Only entrance exam for MBBS in India. Conducted by NTA. Biology is crucial. Organic chemistry very important."
  },

  "BITSAT": {
    examCode: "BITSAT",
    examName: "BITS Admission Test",
    shortName: "BITSAT",
    category: "Engineering",
    forStreams: ["MPC", "PCMB"],
    forDegrees: ["B.Tech at BITS Pilani"],
    leadingCareers: [
      "Software Engineer",
      "Data Scientist",
      "Computer Engineer",
      "Entrepreneur"
    ],
    difficulty: "Hard",
    totalApplicants: 85000,
    passingRate: 15,
    averageScore: 280,
    cutoffPercentile: 90,
    prepTimeMonths: 6,
    subjects: ["Physics", "Chemistry", "Mathematics", "Logical Reasoning"],
    syllabus: "JEE level + Logical Reasoning",
    frequency: "Once yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["MPC", "PCMB"],
      minEducation: "Class 12 Pass or Appearing",
      maxAttempts: 1
    },
    examFee: 2750,
    successRate: 8,
    topColleges: ["BITS Pilani", "BITS Goa", "BITS Hyderabad"],
    avgPackage: "15-20 LPA",
    wfhAvailability: "Very High",
    demandTrend: "Stable",
    prepMaterials: [
      "BITSAT previous papers",
      "Online coaching",
      "Logical reasoning guides"
    ],
    coachingNecessary: false,
    notes: "Computer-based test. Negative marking. Logical reasoning component unique. Good packages."
  },

  "VITEEE": {
    examCode: "VITEEE",
    examName: "VIT Engineering Entrance Examination",
    shortName: "VITEEE",
    category: "Engineering",
    forStreams: ["MPC", "PCMB"],
    forDegrees: ["B.Tech at VIT"],
    leadingCareers: [
      "Software Engineer",
      "Data Scientist",
      "Mechanical Engineer"
    ],
    difficulty: "Medium",
    totalApplicants: 120000,
    passingRate: 20,
    averageScore: 85,
    cutoffPercentile: 80,
    prepTimeMonths: 6,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    syllabus: "JEE level - slightly easier",
    frequency: "Once yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["MPC", "PCMB"],
      minEducation: "Class 12 Pass or Appearing"
    },
    examFee: 1150,
    successRate: 15,
    topColleges: ["VIT Vellore", "VIT Chennai", "VIT Bhopal"],
    avgPackage: "7-10 LPA",
    wfhAvailability: "High",
    demandTrend: "Stable",
    prepMaterials: [
      "VITEEE previous papers",
      "Online coaching",
      "Self-study"
    ],
    coachingNecessary: false,
    notes: "Good college, decent packages. Multiple slots available. Easier than JEE."
  },

  "CLAT": {
    examCode: "CLAT",
    examName: "Common Law Admission Test",
    shortName: "CLAT",
    category: "Law",
    forStreams: ["Arts", "Commerce", "MPC", "BiPC"],
    forDegrees: ["BA LLB", "BBA LLB"],
    leadingCareers: ["Lawyer", "Judge", "Corporate Counsel", "Legal Advisor"],
    difficulty: "Hard",
    totalApplicants: 85000,
    passingRate: 15,
    averageScore: 95,
    cutoffPercentile: 92,
    prepTimeMonths: 6,
    subjects: ["English", "General Knowledge", "Logical Reasoning", "Mathematics", "Legal Awareness"],
    syllabus: "School level English, GK, Reasoning",
    frequency: "Once yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["All streams"],
      minEducation: "Class 12 Pass"
    },
    examFee: 4500,
    successRate: 5,
    topColleges: [
      "NALSAR Hyderabad",
      "NLIU Bhopal",
      "GNLU Gujarat",
      "DNLU Dalit"
    ],
    avgPackage: "12-18 LPA",
    wfhAvailability: "High",
    demandTrend: "Increasing",
    prepMaterials: [
      "CLAT previous papers",
      "Legal awareness guides",
      "Current affairs"
    ],
    coachingNecessary: false,
    notes: "Gateway to top law colleges. English reading comprehension important. Current affairs helpful."
  },

  "CAT": {
    examCode: "CAT",
    examName: "Common Admission Test",
    shortName: "CAT",
    category: "Management",
    forStreams: ["Commerce", "Arts", "MPC", "BiPC"],
    forDegrees: ["MBA"],
    leadingCareers: [
      "Management Consultant",
      "Investment Banker",
      "Business Manager",
      "Entrepreneur"
    ],
    difficulty: "Very Hard",
    totalApplicants: 200000,
    passingRate: 5,
    averageScore: 55,
    cutoffPercentile: 99,
    prepTimeMonths: 12,
    subjects: ["Quantitative Aptitude", "Verbal Ability", "Data Interpretation", "Logical Reasoning"],
    syllabus: "High school mathematics, English, reasoning",
    frequency: "Once yearly",
    eligibility: {
      minAge: 21,
      streamRequired: ["All streams"],
      minEducation: "Bachelor's degree"
    },
    examFee: 2300,
    successRate: 1.2,
    topColleges: [
      "IIM Ahmedabad",
      "IIM Bangalore",
      "IIM Calcutta",
      "IIM Lucknow",
      "IIM Kozhikode"
    ],
    avgPackage: "25-35 LPA",
    wfhAvailability: "Very High",
    demandTrend: "Stable",
    prepMaterials: [
      "CAT previous papers",
      "Online coaching",
      "Coaching centers"
    ],
    coachingNecessary: true,
    notes: "Taken after Class 12 + bachelor's. Highly competitive. Top packages. 2-year MBA course."
  },

  "CA": {
    examCode: "CA",
    examName: "Chartered Accountancy",
    shortName: "CA",
    category: "Commerce",
    forStreams: ["Commerce", "MPC"],
    forDegrees: ["CA"],
    leadingCareers: [
      "Chartered Accountant",
      "Financial Advisor",
      "Tax Consultant",
      "Auditor"
    ],
    difficulty: "Hard",
    totalApplicants: 350000,
    passingRate: 7,
    averageScore: 40,
    cutoffPercentile: 50,
    prepTimeMonths: 36,
    subjects: ["Financial Accounting", "Costing", "Taxation", "Auditing"],
    syllabus: "Professional accounting standards",
    frequency: "Twice yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["Commerce", "MPC"],
      minEducation: "Class 12 Pass",
      maxAttempts: 7
    },
    examFee: 0,
    successRate: 4,
    topColleges: ["Institute of Chartered Accountants of India"],
    avgPackage: "8-15 LPA",
    wfhAvailability: "Very High",
    demandTrend: "Increasing",
    prepMaterials: [
      "ICAI study materials",
      "Coaching centers",
      "Online courses"
    ],
    coachingNecessary: true,
    notes: "Very long course - 4.5 years. Practical training required. Self-employed opportunity."
  },

  "CS": {
    examCode: "CS",
    examName: "Company Secretary",
    shortName: "CS",
    category: "Commerce",
    forStreams: ["Commerce", "Arts"],
    forDegrees: ["CS"],
    leadingCareers: [
      "Company Secretary",
      "Corporate Counsel",
      "Compliance Manager",
      "Legal Advisor"
    ],
    difficulty: "Medium",
    totalApplicants: 180000,
    passingRate: 12,
    averageScore: 45,
    cutoffPercentile: 50,
    prepTimeMonths: 36,
    subjects: ["Company Law", "Corporate Governance", "Secretarial Practice", "Compliance"],
    syllabus: "Corporate and company law",
    frequency: "Twice yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["Commerce", "Arts"],
      minEducation: "Class 12 Pass",
      maxAttempts: 10
    },
    examFee: 0,
    successRate: 7,
    topColleges: ["Institute of Company Secretaries of India"],
    avgPackage: "6-12 LPA",
    wfhAvailability: "High",
    demandTrend: "Increasing",
    prepMaterials: [
      "ICSI study materials",
      "Coaching centers",
      "Online courses"
    ],
    coachingNecessary: false,
    notes: "4.5 year course. Regulatory compliance focus. Good for corporate environment."
  },

  "CMA": {
    examCode: "CMA",
    examName: "Cost Management Accounting",
    shortName: "CMA",
    category: "Commerce",
    forStreams: ["Commerce", "MPC"],
    forDegrees: ["CMA"],
    leadingCareers: [
      "Cost Accountant",
      "Internal Auditor",
      "Management Accountant",
      "Financial Analyst"
    ],
    difficulty: "Hard",
    totalApplicants: 250000,
    passingRate: 8,
    averageScore: 45,
    cutoffPercentile: 50,
    prepTimeMonths: 36,
    subjects: ["Costing", "Financial Management", "Audit", "Strategic Management"],
    syllabus: "Cost accounting and management principles",
    frequency: "Twice yearly",
    eligibility: {
      minAge: 16,
      streamRequired: ["Commerce", "MPC"],
      minEducation: "Class 12 Pass",
      maxAttempts: 7
    },
    examFee: 0,
    successRate: 5,
    topColleges: ["Institute of Cost Accountants of India"],
    avgPackage: "7-13 LPA",
    wfhAvailability: "Very High",
    demandTrend: "Increasing",
    prepMaterials: [
      "ICMAI study materials",
      "Coaching",
      "Online courses"
    ],
    coachingNecessary: true,
    notes: "4.5 year course. Cost optimization focus. Good for manufacturing and finance."
  },

  "UPSC": {
    examCode: "UPSC",
    examName: "Union Public Service Commission Civil Services Exam",
    shortName: "UPSC",
    category: "Public Service",
    forStreams: ["All streams"],
    forDegrees: ["Bachelor's degree"],
    leadingCareers: ["IAS", "IPS", "IFS", "Custom Services"],
    difficulty: "Very Hard",
    totalApplicants: 900000,
    passingRate: 0.3,
    averageScore: 200,
    cutoffPercentile: 99.5,
    prepTimeMonths: 24,
    subjects: ["General Studies", "Optional Subject", "Essay"],
    syllabus: "Comprehensive Indian and world knowledge",
    frequency: "Once yearly",
    eligibility: {
      minAge: 21,
      maxAge: 32,
      streamRequired: ["All streams"],
      minEducation: "Bachelor's degree",
      maxAttempts: 6
    },
    examFee: 100,
    successRate: 0.12,
    topColleges: ["LBSNAA", "AICTE"],
    avgPackage: "56000,
    wfhAvailability: "Low",
    demandTrend: "Stable",
    prepMaterials: [
      "NCERT books",
      "Current affairs magazines",
      "Coaching centers",
      "Online coaching"
    ],
    coachingNecessary: false,
    notes: "Highly prestigious. Extremely competitive. 2-3 year preparation typical. Civil service career."
  },

  "NDA": {
    examCode: "NDA",
    examName: "National Defence Academy",
    shortName: "NDA",
    category: "Public Service",
    forStreams: ["MPC", "Arts"],
    forDegrees: ["B.Tech at NDA"],
    leadingCareers: [
      "Armed Forces Officer",
      "Defence Pilot",
      "Defence Engineer"
    ],
    difficulty: "Hard",
    totalApplicants: 500000,
    passingRate: 5,
    averageScore: 200,
    cutoffPercentile: 90,
    prepTimeMonths: 6,
    subjects: ["Mathematics", "General Ability"],
    syllabus: "Class 11-12 level + current affairs",
    frequency: "Twice yearly",
    eligibility: {
      minAge: 16,
      maxAge: 19,
      streamRequired: ["All streams"],
      minEducation: "Class 12 Pass"
    },
    examFee: 100,
    successRate: 0.5,
    topColleges: ["National Defence Academy", "Indian Military Academy"],
    avgPackage: "As salary + pension",
    wfhAvailability: "Low",
    demandTrend: "Stable",
    prepMaterials: [
      "NDA previous papers",
      "Military books",
      "Online coaching"
    ],
    coachingNecessary: false,
    notes: "Gateway to armed forces. 3-year NDA course, then 15+ year service. Patriotic commitment."
  }
};

/**
 * Helper: Get exams for a stream
 */
export function getExamsForStream(streamCode: string): EntranceExamProfile[] {
  return Object.values(ENTRANCE_EXAM_DATABASE).filter(exam =>
    exam.forStreams.includes(streamCode)
  );
}

/**
 * Helper: Get exams for a specific career
 */
export function getExamsForCareer(careerTitle: string): EntranceExamProfile[] {
  return Object.values(ENTRANCE_EXAM_DATABASE).filter(exam =>
    exam.leadingCareers.includes(careerTitle)
  );
}

/**
 * Helper: Get exam profile by short name
 */
export function getExamByShortName(shortName: string): EntranceExamProfile | null {
  return (
    Object.values(ENTRANCE_EXAM_DATABASE).find(
      exam => exam.shortName === shortName
    ) || null
  );
}

/**
 * Helper: Get all exams by category
 */
export function getExamsByCategory(
  category: string
): EntranceExamProfile[] {
  return Object.values(ENTRANCE_EXAM_DATABASE).filter(
    exam => exam.category === category
  );
}

/**
 * Helper: Get exam difficulty ranking
 */
export function rankExamsByDifficulty(): EntranceExamProfile[] {
  const difficultyRank = {
    "Very Hard": 4,
    Hard: 3,
    Medium: 2,
    Easy: 1
  };
  return Object.values(ENTRANCE_EXAM_DATABASE).sort(
    (a, b) =>
      (difficultyRank[b.difficulty as keyof typeof difficultyRank] || 0) -
      (difficultyRank[a.difficulty as keyof typeof difficultyRank] || 0)
  );
}

/**
 * Helper: Get most popular exams
 */
export function getMostPopularExams(): EntranceExamProfile[] {
  return Object.values(ENTRANCE_EXAM_DATABASE)
    .sort((a, b) => b.totalApplicants - a.totalApplicants)
    .slice(0, 5);
}
