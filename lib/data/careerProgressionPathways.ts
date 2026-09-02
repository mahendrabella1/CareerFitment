/**
 * Career Progression Pathways - Year-by-Year Growth Tracks
 * Shows realistic career trajectory from entry to 20+ years
 * Includes salary progression, role evolution, skills development
 * Last Updated: 2026-09-02
 */

export interface CareerStage {
  years: number; // Years in career
  stageName: string; // Role title at this stage
  salary: {
    min: number; // INR annually
    max: number;
    median: number;
    currency: "INR" | "USD";
  };
  responsibilities: string[];
  skills: string[];
  skillsToAcquire: string[];
  typicalCompanies: string[];
  demandLevel: "Very High" | "High" | "Medium" | "Low";
  jobSecurity: "Very High" | "High" | "Medium" | "Low";
  workLifeBalance: "Excellent" | "Good" | "Fair" | "Poor";
  advancementOpportunity: string;
  alternativePaths: string[];
}

export interface CareerProgression {
  careerTitle: string;
  careerId: string;
  domain: string;
  currentDemand: "Very High" | "High" | "Medium" | "Low";
  growthOutlook: "Strong" | "Moderate" | "Stable" | "Declining";
  averageTenureYears: number;
  stages: CareerStage[];
  keyMilestones: {
    year: number;
    milestone: string;
    action: string;
  }[];
  skillProgression: {
    technical: string[];
    soft: string[];
    leadership: string[];
  };
  salaryGrowthFactor: number; // 1.5x = 50% growth per stage
  notes: string;
}

/**
 * COMPREHENSIVE CAREER PROGRESSION PATHWAYS
 * Shows realistic 20+ year career journeys
 */
export const CAREER_PROGRESSIONS: CareerProgression[] = [
  // ==================== SOFTWARE ENGINEER ====================
  {
    careerTitle: "Software Engineer",
    careerId: "software-engineer-001",
    domain: "Technology",
    currentDemand: "Very High",
    growthOutlook: "Strong",
    averageTenureYears: 15,
    stages: [
      {
        years: 0,
        stageName: "Junior Developer",
        salary: {
          min: 300000,
          max: 600000,
          median: 450000,
          currency: "INR"
        },
        responsibilities: [
          "Write code according to specifications",
          "Fix bugs reported by QA",
          "Code review feedback",
          "Attend standup meetings",
          "Complete assigned tickets"
        ],
        skills: [
          "Programming in assigned language",
          "Version control (Git)",
          "Unit testing",
          "Basic debugging",
          "Problem solving"
        ],
        skillsToAcquire: [
          "System design",
          "Database optimization",
          "Software architecture",
          "Leadership"
        ],
        typicalCompanies: [
          "TCS",
          "Infosys",
          "Capgemini",
          "Accenture",
          "Startup"
        ],
        demandLevel: "Very High",
        jobSecurity: "High",
        workLifeBalance: "Good",
        advancementOpportunity:
          "Become Senior Developer within 2-3 years if high performer",
        alternativePaths: [
          "QA Engineer",
          "DevOps Engineer",
          "Data Engineer"
        ]
      },
      {
        years: 3,
        stageName: "Senior Developer",
        salary: {
          min: 700000,
          max: 1200000,
          median: 900000,
          currency: "INR"
        },
        responsibilities: [
          "Design system modules",
          "Lead junior developers",
          "Code architecture decisions",
          "Mentor team members",
          "Optimize system performance",
          "Technical documentation"
        ],
        skills: [
          "System design",
          "Optimization",
          "Leadership",
          "Mentoring",
          "Cross-team communication",
          "Architecture design"
        ],
        skillsToAcquire: [
          "Product thinking",
          "Strategic planning",
          "Management skills"
        ],
        typicalCompanies: [
          "Google",
          "Amazon",
          "Microsoft",
          "Goldman Sachs",
          "Startups (scaling)"
        ],
        demandLevel: "Very High",
        jobSecurity: "Very High",
        workLifeBalance: "Fair",
        advancementOpportunity:
          "Move to Tech Lead or Manager track",
        alternativePaths: [
          "Engineering Manager",
          "Architect",
          "Product Manager"
        ]
      },
      {
        years: 7,
        stageName: "Tech Lead / Engineering Manager",
        salary: {
          min: 1500000,
          max: 2500000,
          median: 1800000,
          currency: "INR"
        },
        responsibilities: [
          "Lead engineering team",
          "Make architectural decisions",
          "Performance reviews",
          "Hiring and recruitment",
          "Roadmap planning",
          "Cross-functional collaboration",
          "Budget management"
        ],
        skills: [
          "Leadership",
          "People management",
          "Strategic thinking",
          "Negotiation",
          "System architecture",
          "Business acumen"
        ],
        skillsToAcquire: [
          "Executive communication",
          "P&L management",
          "Org strategy"
        ],
        typicalCompanies: [
          "FAANG companies",
          "Unicorn startups",
          "Established tech firms"
        ],
        demandLevel: "High",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Progress to Senior Engineering Manager or VP Engineering",
        alternativePaths: [
          "Product Manager",
          "Engineering Director",
          "Consultant"
        ]
      },
      {
        years: 12,
        stageName: "VP Engineering / Engineering Director",
        salary: {
          min: 3000000,
          max: 5000000,
          median: 3800000,
          currency: "INR"
        },
        responsibilities: [
          "Own entire engineering org",
          "Set engineering strategy",
          "P&L responsibility",
          "C-suite collaboration",
          "Long-term planning",
          "Culture building",
          "Major hiring decisions"
        ],
        skills: [
          "Executive leadership",
          "Strategic planning",
          "Business acumen",
          "Stakeholder management",
          "Org design"
        ],
        skillsToAcquire: [
          "Board-level communication",
          "IPO preparation"
        ],
        typicalCompanies: [
          "FAANG",
          "Scaled startups",
          "Unicorns",
          "Fortune 500"
        ],
        demandLevel: "Medium",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Move to CTO or Co-founder role",
        alternativePaths: [
          "CTO",
          "Entrepreneur",
          "Board member"
        ]
      },
      {
        years: 18,
        stageName: "CTO / Head of Engineering",
        salary: {
          min: 5000000,
          max: 10000000,
          median: 6500000,
          currency: "INR"
        },
        responsibilities: [
          "Own all technology decisions",
          "Company tech strategy",
          "Innovation direction",
          "External tech partnerships",
          "Board presentations",
          "C-suite peer"
        ],
        skills: [
          "Visionary thinking",
          "Executive leadership",
          "Business strategy",
          "Board communication"
        ],
        skillsToAcquire: [
          "M&A strategy",
          "IPO planning"
        ],
        typicalCompanies: [
          "Large tech companies",
          "Scaled startups",
          "Unicorns pre-IPO"
        ],
        demandLevel: "Low",
        jobSecurity: "Very High",
        workLifeBalance: "Very Poor",
        advancementOpportunity:
          "Move to CEO or founding your own company",
        alternativePaths: [
          "CEO",
          "Investor",
          "Angel Investor"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "First job",
        action: "Learn codebase, contribute to small features"
      },
      {
        year: 2,
        milestone: "Ownership",
        action: "Own a module, mentor junior devs"
      },
      {
        year: 5,
        milestone: "Leadership",
        action: "Lead a team of 5-10 engineers"
      },
      {
        year: 10,
        milestone: "Strategic",
        action: "Influence company-level tech decisions"
      },
      {
        year: 15,
        milestone: "Executive",
        action: "C-suite or founder"
      }
    ],
    skillProgression: {
      technical: [
        "Programming basics",
        "System design",
        "Architecture",
        "Emerging tech",
        "Innovation"
      ],
      soft: [
        "Communication",
        "Collaboration",
        "Teaching",
        "Negotiation",
        "Executive presence"
      ],
      leadership: [
        "Individual contributor",
        "Tech lead",
        "Team lead",
        "Manager",
        "Executive"
      ]
    },
    salaryGrowthFactor: 2.0,
    notes:
      "One of the fastest-growing careers in tech. High demand. Can transition to management, product, or stay technical (architect path)."
  },

  // ==================== DATA SCIENTIST ====================
  {
    careerTitle: "Data Scientist",
    careerId: "data-scientist-001",
    domain: "Technology / Analytics",
    currentDemand: "Very High",
    growthOutlook: "Strong",
    averageTenureYears: 12,
    stages: [
      {
        years: 0,
        stageName: "Junior Data Scientist",
        salary: {
          min: 600000,
          max: 1000000,
          median: 750000,
          currency: "INR"
        },
        responsibilities: [
          "Analyze datasets",
          "Build basic ML models",
          "Data cleaning and preprocessing",
          "Create visualizations",
          "Run A/B tests",
          "Document findings"
        ],
        skills: [
          "Python / R programming",
          "SQL",
          "Machine Learning basics",
          "Statistics",
          "Data visualization",
          "SQL and databases"
        ],
        skillsToAcquire: [
          "Deep learning",
          "Advanced ML",
          "Production ML"
        ],
        typicalCompanies: [
          "Tech companies",
          "E-commerce",
          "Fintech",
          "Analytics firms"
        ],
        demandLevel: "Very High",
        jobSecurity: "Very High",
        workLifeBalance: "Good",
        advancementOpportunity:
          "Senior Data Scientist within 3-4 years",
        alternativePaths: [
          "ML Engineer",
          "Data Engineer",
          "Analytics Manager"
        ]
      },
      {
        years: 4,
        stageName: "Senior Data Scientist",
        salary: {
          min: 1200000,
          max: 2000000,
          median: 1500000,
          currency: "INR"
        },
        responsibilities: [
          "Design ML solutions",
          "Lead data projects",
          "Mentor junior data scientists",
          "Present to executives",
          "Define data strategy",
          "Research new techniques"
        ],
        skills: [
          "Advanced ML algorithms",
          "Deep learning",
          "MLOps",
          "Leadership",
          "Project management",
          "Business acumen"
        ],
        skillsToAcquire: [
          "Product thinking",
          "Organizational strategy",
          "Management"
        ],
        typicalCompanies: [
          "FAANG",
          "Unicorns",
          "Top analytics firms"
        ],
        demandLevel: "Very High",
        jobSecurity: "Very High",
        workLifeBalance: "Fair",
        advancementOpportunity:
          "Manager or Principal Data Scientist",
        alternativePaths: [
          "ML Manager",
          "Product Manager",
          "Chief Analytics Officer"
        ]
      },
      {
        years: 8,
        stageName: "Principal Data Scientist / Analytics Lead",
        salary: {
          min: 2000000,
          max: 3500000,
          median: 2500000,
          currency: "INR"
        },
        responsibilities: [
          "Own analytics function",
          "Set data strategy",
          "Lead multiple teams",
          "Business partnership",
          "Innovation projects",
          "Org-wide impact"
        ],
        skills: [
          "Strategic thinking",
          "Leadership",
          "Business acumen",
          "Communication",
          "Innovation"
        ],
        skillsToAcquire: [
          "Executive presence",
          "P&L management"
        ],
        typicalCompanies: [
          "Tech giants",
          "Fintech leaders",
          "E-commerce leaders"
        ],
        demandLevel: "High",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "VP Analytics or Chief Data Officer",
        alternativePaths: [
          "CDO",
          "VP Data",
          "Consultant"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "First model",
        action: "Build end-to-end ML project"
      },
      {
        year: 2,
        milestone: "Production impact",
        action: "Model used in production"
      },
      {
        year: 5,
        milestone: "Leadership",
        action: "Lead data science team"
      },
      {
        year: 10,
        milestone: "Strategic",
        action: "Define data strategy"
      }
    ],
    skillProgression: {
      technical: [
        "Statistics basics",
        "ML algorithms",
        "Deep learning",
        "MLOps",
        "Production ML"
      ],
      soft: [
        "Communication",
        "Presentation",
        "Collaboration",
        "Negotiation",
        "Executive presence"
      ],
      leadership: [
        "Individual contributor",
        "Project lead",
        "Team lead",
        "Manager",
        "Executive"
      ]
    },
    salaryGrowthFactor: 1.8,
    notes:
      "Fastest-growing tech field. High salary from day 1. Can transition to management, product, or stay technical. Requires continuous learning."
  },

  // ==================== DOCTOR (MBBS) ====================
  {
    careerTitle: "Doctor (MBBS)",
    careerId: "doctor-mbbs-001",
    domain: "Healthcare",
    currentDemand: "High",
    growthOutlook: "Strong",
    averageTenureYears: 35,
    stages: [
      {
        years: 0,
        stageName: "Resident Doctor / MBBS Graduate",
        salary: {
          min: 400000,
          max: 800000,
          median: 500000,
          currency: "INR"
        },
        responsibilities: [
          "Patient consultation",
          "Diagnosis",
          "Treatment planning",
          "Case documentation",
          "Ward duties",
          "Emergency response"
        ],
        skills: [
          "Medical knowledge",
          "Patient communication",
          "Diagnosis skills",
          "Emergency management",
          "Empathy"
        ],
        skillsToAcquire: [
          "Specialization",
          "Research",
          "Management"
        ],
        typicalCompanies: [
          "Government hospitals",
          "Private clinics",
          "Medical colleges"
        ],
        demandLevel: "High",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Specialize in MD/MS within 5-6 years",
        alternativePaths: [
          "Specialist doctor",
          "Research",
          "Public health",
          "Hospital management"
        ]
      },
      {
        years: 5,
        stageName: "Specialist Doctor (MD/MS)",
        salary: {
          min: 1000000,
          max: 2000000,
          median: 1300000,
          currency: "INR"
        },
        responsibilities: [
          "Complex case management",
          "Teaching residents",
          "Research projects",
          "Patient management",
          "Clinic/OPD work",
          "Surgery/procedures"
        ],
        skills: [
          "Specialized medical knowledge",
          "Procedural skills",
          "Leadership",
          "Teaching",
          "Research"
        ],
        skillsToAcquire: [
          "Super specialization",
          "Private practice",
          "Administration"
        ],
        typicalCompanies: [
          "Medical colleges",
          "Hospitals",
          "Private practice"
        ],
        demandLevel: "High",
        jobSecurity: "Very High",
        workLifeBalance: "Fair",
        advancementOpportunity:
          "Super-specialist or private practice",
        alternativePaths: [
          "Super-specialist",
          "Private practice owner",
          "Hospital administrator",
          "Medical consultant"
        ]
      },
      {
        years: 12,
        stageName: "Senior Consultant / Hospital Head",
        salary: {
          min: 2000000,
          max: 5000000,
          median: 3000000,
          currency: "INR"
        },
        responsibilities: [
          "Patient care",
          "Department management",
          "Teaching and training",
          "Research leadership",
          "Policy making",
          "Quality assurance"
        ],
        skills: [
          "Medical expertise",
          "Management",
          "Leadership",
          "Strategic thinking",
          "Public speaking"
        ],
        skillsToAcquire: [
          "Healthcare administration",
          "Public health"
        ],
        typicalCompanies: [
          "Private hospitals",
          "Medical colleges",
          "Healthcare startups"
        ],
        demandLevel: "Medium",
        jobSecurity: "Very High",
        workLifeBalance: "Good",
        advancementOpportunity:
          "Hospital director or Chief Medical Officer",
        alternativePaths: [
          "Hospital owner",
          "Healthcare startup founder",
          "Medical educator",
          "Public health officer"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "MBBS completion",
        action: "License to practice"
      },
      {
        year: 5,
        milestone: "Specialization",
        action: "MD/MS degree"
      },
      {
        year: 12,
        milestone: "Expertise",
        action: "Consultant level"
      },
      {
        year: 20,
        milestone: "Leadership",
        action: "Department head or private practice"
      }
    ],
    skillProgression: {
      technical: [
        "Clinical knowledge",
        "Diagnosis skills",
        "Procedural skills",
        "Specialization",
        "Advanced procedures"
      ],
      soft: [
        "Patient communication",
        "Empathy",
        "Teaching",
        "Leadership",
        "Public speaking"
      ],
      leadership: [
        "Individual practitioner",
        "Senior doctor",
        "Department head",
        "Hospital head",
        "Entrepreneur"
      ]
    },
    salaryGrowthFactor: 1.5,
    notes:
      "Long education path (5.5 years MBBS + 3-5 years specialization). High job security. Good salary growth. Can practice independently. Social impact."
  },

  // ==================== CHARTERED ACCOUNTANT ====================
  {
    careerTitle: "Chartered Accountant",
    careerId: "ca-001",
    domain: "Finance / Business",
    currentDemand: "High",
    growthOutlook: "Strong",
    averageTenureYears: 25,
    stages: [
      {
        years: 0,
        stageName: "Articleship / CA Finalist",
        salary: {
          min: 100000,
          max: 300000,
          median: 150000,
          currency: "INR"
        },
        responsibilities: [
          "Audit work",
          "Financial statement preparation",
          "Tax advisory",
          "Compliance work",
          "Client interaction",
          "Documentation"
        ],
        skills: [
          "Accounting knowledge",
          "Audit skills",
          "Tax knowledge",
          "Compliance understanding",
          "Client management"
        ],
        skillsToAcquire: [
          "Specialization",
          "Practice development",
          "Management"
        ],
        typicalCompanies: [
          "Big 4 (Deloitte, EY, KPMG, PwC)",
          "Mid-size audit firms",
          "Corporate finance teams"
        ],
        demandLevel: "Very High",
        jobSecurity: "High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Senior associate within 3-4 years",
        alternativePaths: [
          "Corporate accounting",
          "Finance",
          "Taxation",
          "Consulting"
        ]
      },
      {
        years: 4,
        stageName: "Senior Associate / Manager",
        salary: {
          min: 800000,
          max: 1500000,
          median: 1000000,
          currency: "INR"
        },
        responsibilities: [
          "Audit team lead",
          "Client relationship",
          "Complex audits",
          "Junior supervision",
          "Specialization development",
          "Business development"
        ],
        skills: [
          "Audit expertise",
          "Client management",
          "Team leadership",
          "Specialization",
          "Business acumen"
        ],
        skillsToAcquire: [
          "Partner potential",
          "P&L management",
          "Practice leadership"
        ],
        typicalCompanies: [
          "Big 4",
          "Mid-size firms",
          "In-house finance"
        ],
        demandLevel: "High",
        jobSecurity: "Very High",
        workLifeBalance: "Fair",
        advancementOpportunity:
          "Senior manager or Partner track",
        alternativePaths: [
          "CFO",
          "Corporate finance head",
          "Private practice"
        ]
      },
      {
        years: 10,
        stageName: "Partner / Senior Manager",
        salary: {
          min: 2000000,
          max: 5000000,
          median: 2500000,
          currency: "INR"
        },
        responsibilities: [
          "Client acquisition",
          "Firm management",
          "Team leadership",
          "Profit sharing",
          "Strategic decisions",
          "Specialization leadership"
        ],
        skills: [
          "Practice management",
          "Business development",
          "Leadership",
          "Strategic thinking",
          "Client relationships"
        ],
        skillsToAcquire: [
          "Firm growth",
          "M&A"
        ],
        typicalCompanies: [
          "Big 4 partnership",
          "Mid-size firm partnership",
          "Sole practice"
        ],
        demandLevel: "Medium",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Firm leader or founder of own practice",
        alternativePaths: [
          "Founder",
          "Corporate CFO",
          "Investment banker"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "CA degree completion",
        action: "Start practicing"
      },
      {
        year: 3,
        milestone: "First specialization",
        action: "Become expert in an area"
      },
      {
        year: 7,
        milestone: "Practice established",
        action: "Own client base"
      },
      {
        year: 12,
        milestone: "Partnership",
        action: "Become partner"
      }
    ],
    skillProgression: {
      technical: [
        "Accounting basics",
        "Audit",
        "Tax",
        "Specialization",
        "Advanced consulting"
      ],
      soft: [
        "Client management",
        "Communication",
        "Negotiation",
        "Leadership",
        "Business development"
      ],
      leadership: [
        "Individual auditor",
        "Senior auditor",
        "Manager",
        "Partner",
        "Firm founder"
      ]
    },
    salaryGrowthFactor: 1.6,
    notes:
      "Long qualification (4.5 years). Good salary growth. Can practice independently. Self-employment opportunity. Financial independence possible."
  },

  // ==================== LAWYER ====================
  {
    careerTitle: "Lawyer",
    careerId: "lawyer-001",
    domain: "Law / Justice",
    currentDemand: "Medium",
    growthOutlook: "Stable",
    averageTenureYears: 30,
    stages: [
      {
        years: 0,
        stageName: "Junior Lawyer / Associate",
        salary: {
          min: 300000,
          max: 700000,
          median: 400000,
          currency: "INR"
        },
        responsibilities: [
          "Legal research",
          "Case preparation",
          "Client meetings",
          "Court appearances",
          "Document drafting",
          "Precedent analysis"
        ],
        skills: [
          "Legal knowledge",
          "Case law research",
          "Writing skills",
          "Argumentation",
          "Client communication"
        ],
        skillsToAcquire: [
          "Specialization",
          "Practice building",
          "Leadership"
        ],
        typicalCompanies: [
          "Law firms",
          "Government",
          "Corporate legal",
          "NGOs"
        ],
        demandLevel: "Medium",
        jobSecurity: "High",
        workLifeBalance: "Fair",
        advancementOpportunity:
          "Senior lawyer within 5-7 years",
        alternativePaths: [
          "In-house counsel",
          "Judge",
          "Legal consultant",
          "Mediator"
        ]
      },
      {
        years: 7,
        stageName: "Senior Lawyer / Partner",
        salary: {
          min: 1000000,
          max: 3000000,
          median: 1500000,
          currency: "INR"
        },
        responsibilities: [
          "Case handling",
          "Client relationship",
          "Team leadership",
          "Specialization",
          "Business development",
          "Mentoring"
        ],
        skills: [
          "Legal expertise",
          "Negotiation",
          "Client management",
          "Leadership",
          "Business acumen"
        ],
        skillsToAcquire: [
          "Practice management",
          "Strategic law"
        ],
        typicalCompanies: [
          "Law firm partner",
          "Corporate counsel head",
          "Judicial appointments"
        ],
        demandLevel: "Medium",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Law firm founder or judicial appointment",
        alternativePaths: [
          "Judge",
          "Law practice founder",
          "Corporate board"
        ]
      },
      {
        years: 15,
        stageName: "Senior Partner / Judge / Corporate Counsel",
        salary: {
          min: 2000000,
          max: 5000000,
          median: 3000000,
          currency: "INR"
        },
        responsibilities: [
          "Law firm management",
          "Major case handling",
          "Client acquisition",
          "Team building",
          "Firm strategy",
          "Thought leadership"
        ],
        skills: [
          "Strategic law",
          "Firm management",
          "Business law",
          "Leadership",
          "Industry influence"
        ],
        skillsToAcquire: [
          "Board directorships",
          "Legal advisory"
        ],
        typicalCompanies: [
          "Top law firms",
          "Judiciary",
          "Corporate boardrooms"
        ],
        demandLevel: "Low",
        jobSecurity: "Very High",
        workLifeBalance: "Fair",
        advancementOpportunity:
          "Supreme Court Judge or law firm founder",
        alternativePaths: [
          "Judge",
          "Law school founder",
          "Legal consultant",
          "Author / Thought leader"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "Bar admission",
        action: "Start practice"
      },
      {
        year: 3,
        milestone: "First major case",
        action: "Build reputation"
      },
      {
        year: 7,
        milestone: "Specialization",
        action: "Become expert"
      },
      {
        year: 15,
        milestone: "Senior position",
        action: "Partner or judge"
      }
    ],
    skillProgression: {
      technical: [
        "Legal knowledge",
        "Case law",
        "Specialization",
        "Complex cases",
        "Strategic law"
      ],
      soft: [
        "Argumentation",
        "Negotiation",
        "Client management",
        "Public speaking",
        "Leadership"
      ],
      leadership: [
        "Junior lawyer",
        "Senior lawyer",
        "Partner",
        "Senior partner",
        "Judicial/Board level"
      ]
    },
    salaryGrowthFactor: 1.7,
    notes:
      "5-year qualification (3 year LLB + 2 year practice). Slow growth initially. High income potential. Job security. Can practice independently."
  },

  // ==================== TEACHER ====================
  {
    careerTitle: "Teacher",
    careerId: "teacher-001",
    domain: "Education",
    currentDemand: "High",
    growthOutlook: "Stable",
    averageTenureYears: 30,
    stages: [
      {
        years: 0,
        stageName: "Junior Teacher / Fresher",
        salary: {
          min: 300000,
          max: 500000,
          median: 400000,
          currency: "INR"
        },
        responsibilities: [
          "Class teaching",
          "Lesson planning",
          "Student assessment",
          "Parent communication",
          "Classroom management",
          "Administrative work"
        ],
        skills: [
          "Subject knowledge",
          "Teaching skills",
          "Student engagement",
          "Communication",
          "Patience"
        ],
        skillsToAcquire: [
          "Advanced teaching methods",
          "Leadership",
          "Research"
        ],
        typicalCompanies: [
          "Schools",
          "Coaching centers",
          "Private institutions"
        ],
        demandLevel: "High",
        jobSecurity: "Very High",
        workLifeBalance: "Good",
        advancementOpportunity:
          "Senior teacher within 5-7 years",
        alternativePaths: [
          "School principal",
          "Curriculum designer",
          "Educational researcher",
          "Online educator"
        ]
      },
      {
        years: 5,
        stageName: "Senior Teacher / Head of Department",
        salary: {
          min: 600000,
          max: 1000000,
          median: 800000,
          currency: "INR"
        },
        responsibilities: [
          "Subject leadership",
          "Curriculum design",
          "Teacher mentoring",
          "Student guidance",
          "Exam coordination",
          "School policy input"
        ],
        skills: [
          "Advanced subject knowledge",
          "Curriculum design",
          "Leadership",
          "Mentoring",
          "Innovation"
        ],
        skillsToAcquire: [
          "School management",
          "Administration"
        ],
        typicalCompanies: [
          "Quality schools",
          "Educational institutions"
        ],
        demandLevel: "Medium",
        jobSecurity: "Very High",
        workLifeBalance: "Good",
        advancementOpportunity:
          "Principal or higher education",
        alternativePaths: [
          "Principal",
          "University professor",
          "Educational consultant"
        ]
      },
      {
        years: 12,
        stageName: "Principal / Senior Educational Leader",
        salary: {
          min: 1200000,
          max: 2000000,
          median: 1500000,
          currency: "INR"
        },
        responsibilities: [
          "School leadership",
          "Institution management",
          "Staff management",
          "Policy making",
          "Academic vision",
          "Community engagement"
        ],
        skills: [
          "Educational leadership",
          "Management",
          "Strategic thinking",
          "Finance understanding",
          "Stakeholder management"
        ],
        skillsToAcquire: [
          "Advanced management",
          "Entrepreneurship"
        ],
        typicalCompanies: [
          "School principal",
          "Educational institution head",
          "EdTech founder"
        ],
        demandLevel: "Low",
        jobSecurity: "Very High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Founder of educational institution or EdTech",
        alternativePaths: [
          "EdTech founder",
          "Educational consultant",
          "Government education officer",
          "University administrator"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "Teaching certification",
        action: "First teaching job"
      },
      {
        year: 3,
        milestone: "Expertise",
        action: "Master your subject"
      },
      {
        year: 7,
        milestone: "Leadership",
        action: "Lead a department"
      },
      {
        year: 15,
        milestone: "Principal",
        action: "Lead institution"
      }
    ],
    skillProgression: {
      technical: [
        "Subject knowledge",
        "Teaching methods",
        "Curriculum design",
        "Advanced pedagogy",
        "Educational research"
      ],
      soft: [
        "Communication",
        "Mentoring",
        "Empathy",
        "Leadership",
        "Public speaking"
      ],
      leadership: [
        "Classroom teacher",
        "Senior teacher",
        "Department head",
        "Principal",
        "Educational entrepreneur"
      ]
    },
    salaryGrowthFactor: 1.4,
    notes:
      "Job security excellent. Good work-life balance. Pension benefits. Social impact. Salary growth slower than corporate. Can start EdTech venture."
  },

  // ==================== ENTREPRENEUR / STARTUP FOUNDER ====================
  {
    careerTitle: "Entrepreneur",
    careerId: "entrepreneur-001",
    domain: "Business / Startups",
    currentDemand: "Very High",
    growthOutlook: "Strong",
    averageTenureYears: 10,
    stages: [
      {
        years: 0,
        stageName: "Founder / Early Stage",
        salary: {
          min: 0,
          max: 500000,
          median: 100000,
          currency: "INR"
        },
        responsibilities: [
          "Idea validation",
          "Team building",
          "Fundraising",
          "Product development",
          "Customer acquisition",
          "All roles"
        ],
        skills: [
          "Entrepreneurial mindset",
          "Problem solving",
          "Sales",
          "Product thinking",
          "Fundraising"
        ],
        skillsToAcquire: [
          "Scale-up",
          "Management",
          "Finance"
        ],
        typicalCompanies: [
          "Self-founded startup"
        ],
        demandLevel: "N/A",
        jobSecurity: "Low",
        workLifeBalance: "Very Poor",
        advancementOpportunity:
          "Scale to Series A/B within 2-3 years",
        alternativePaths: [
          "Acquired by larger company",
          "Join another startup",
          "Go back to corporate"
        ]
      },
      {
        years: 3,
        stageName: "Growth Stage Founder",
        salary: {
          min: 500000,
          max: 2000000,
          median: 1000000,
          currency: "INR"
        },
        responsibilities: [
          "Product scaling",
          "Team expansion",
          "Revenue growth",
          "Market expansion",
          "Investor relations",
          "Strategic partnerships"
        ],
        skills: [
          "Leadership",
          "Management",
          "Sales",
          "Finance",
          "Strategic thinking"
        ],
        skillsToAcquire: [
          "Enterprise sales",
          "IPO preparation"
        ],
        typicalCompanies: [
          "Series A/B startup"
        ],
        demandLevel: "N/A",
        jobSecurity: "Medium",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Exit (IPO/Acquisition) within 5-7 years",
        alternativePaths: [
          "IPO",
          "Acquisition",
          "Pivot",
          "Angel investor"
        ]
      },
      {
        years: 7,
        stageName: "Unicorn Founder / Public Company CEO",
        salary: {
          min: 5000000,
          max: 50000000,
          median: 10000000,
          currency: "INR"
        },
        responsibilities: [
          "Company strategy",
          "Board leadership",
          "Investor communication",
          "Employee culture",
          "Market innovation",
          "Legacy building"
        ],
        skills: [
          "Visionary leadership",
          "Strategic thinking",
          "Communication",
          "Board management",
          "Innovation"
        ],
        skillsToAcquire: [
          "Philanthropy",
          "Public influence"
        ],
        typicalCompanies: [
          "Public company",
          "Unicorn startup"
        ],
        demandLevel: "N/A",
        jobSecurity: "High",
        workLifeBalance: "Poor",
        advancementOpportunity:
          "Influence, legacy, investment",
        alternativePaths: [
          "VC investor",
          "Advisor",
          "Philanthropist",
          "Angel investor"
        ]
      }
    ],
    keyMilestones: [
      {
        year: 0,
        milestone: "Idea stage",
        action: "Validate idea"
      },
      {
        year: 1,
        milestone: "MVP launch",
        action: "Get first customers"
      },
      {
        year: 2,
        milestone: "Funding",
        action: "Seed/Series A"
      },
      {
        year: 5,
        milestone: "Scale",
        action: "Series B/C"
      },
      {
        year: 7,
        milestone: "Exit",
        action: "IPO or acquisition"
      }
    ],
    skillProgression: {
      technical: [
        "Idea validation",
        "MVP building",
        "Product-market fit",
        "Scale-up",
        "Enterprise sales"
      ],
      soft: [
        "Pitching",
        "Negotiation",
        "Team building",
        "Leadership",
        "Public speaking"
      ],
      leadership: [
        "Founder",
        "CEO",
        "Board member",
        "Investor",
        "Thought leader"
      ]
    },
    salaryGrowthFactor: 5.0,
    notes:
      "High risk, high reward. No salary initially. Potential for significant wealth. Success rate 10-20%. All-consuming. Can create massive impact."
  }
];

/**
 * Helper: Get career progression by career title
 */
export function getCareerProgression(
  careerTitle: string
): CareerProgression | null {
  return (
    CAREER_PROGRESSIONS.find(
      c => c.careerTitle.toLowerCase() === careerTitle.toLowerCase()
    ) || null
  );
}

/**
 * Helper: Get salary range for a specific stage
 */
export function getSalaryAtStage(careerTitle: string, years: number): {
  min: number;
  max: number;
  median: number;
} | null {
  const career = getCareerProgression(careerTitle);
  if (!career) return null;

  // Find the stage closest to the given years
  const stage = career.stages
    .sort((a, b) => Math.abs(a.years - years) - Math.abs(b.years - years))
    .at(0);

  return stage
    ? {
        min: stage.salary.min,
        max: stage.salary.max,
        median: stage.salary.median
      }
    : null;
}

/**
 * Helper: Get career stages in order
 */
export function getCareerStages(careerTitle: string): CareerStage[] {
  const career = getCareerProgression(careerTitle);
  return career
    ? career.stages.sort((a, b) => a.years - b.years)
    : [];
}

/**
 * Helper: Get alternative paths at a specific stage
 */
export function getAlternativePathsAtStage(
  careerTitle: string,
  yearsInCareer: number
): string[] {
  const career = getCareerProgression(careerTitle);
  if (!career) return [];

  const stage = career.stages
    .filter(s => s.years <= yearsInCareer)
    .sort((a, b) => b.years - a.years)
    .at(0);

  return stage?.alternativePaths || [];
}

/**
 * Helper: Calculate total salary over career years
 */
export function calculateCumulativeSalary(
  careerTitle: string,
  yearsWorked: number
): number {
  const career = getCareerProgression(careerTitle);
  if (!career) return 0;

  let totalSalary = 0;
  let currentYears = 0;

  for (const stage of career.stages.sort((a, b) => a.years - b.years)) {
    if (currentYears >= yearsWorked) break;

    const stageStart = stage.years;
    const nextStage = career.stages
      .filter(s => s.years > stage.years)
      .sort((a, b) => a.years - b.years)
      .at(0);
    const stageEnd = nextStage ? nextStage.years : yearsWorked;
    const stageYears = Math.min(stageEnd, yearsWorked) - stageStart;

    totalSalary += (stage.salary.median * stageYears) || 0;
    currentYears += stageYears;
  }

  return totalSalary;
}

/**
 * Helper: Get salary growth factor for a career
 */
export function getSalaryGrowthFactor(careerTitle: string): number {
  const career = getCareerProgression(careerTitle);
  return career?.salaryGrowthFactor || 1.5;
}
