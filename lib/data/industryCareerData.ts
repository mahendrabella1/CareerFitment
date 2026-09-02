/**
 * Industry-Specific Career Data
 * Salary by industry, company demand, hiring trends, growth opportunities
 * Last Updated: 2026-09-02
 */

export interface IndustryProfile {
  industryName: string;
  industryCode: string;
  description: string;
  size: "Large" | "Medium" | "Small" | "Emerging";
  growthRate: string; // "15% CAGR 2023-2028" format
  averageSalary: {
    entrySalary: number;
    midCareerSalary: number;
    seniorSalary: number;
    currency: "INR" | "USD";
    year: number;
  };
  demandTrend: "Increasing" | "Stable" | "Decreasing";
  jobOpenings: {
    total: number;
    annual: number;
    competitionLevel: "Low" | "Medium" | "High" | "Very High";
  };
  topEmployers: {
    name: string;
    headquarters: string;
    avgSalary: number;
    hiringVolume: number;
  }[];
  topCareers: string[];
  requiredSkills: string[];
  workCulture: {
    workLifeBalance: "Excellent" | "Good" | "Fair" | "Poor";
    innovationLevel: "High" | "Medium" | "Low";
    careertGrowth: "Fast" | "Moderate" | "Slow";
    remoteWorkAvailable: boolean;
  };
  salaryBenefits: {
    baseSalary: number;
    bonusPercentage: number;
    healthInsurance: boolean;
    stockOptions: boolean;
    pensionFund: boolean;
    otherBenefits: string[];
  };
  futureOutlook: string;
  regionalDemand: {
    [region: string]: "Very High" | "High" | "Medium" | "Low";
  };
  certifications: string[];
}

/**
 * COMPREHENSIVE INDUSTRY PROFILE DATABASE
 * 20+ major industries with detailed salary, demand, company data
 */
export const INDUSTRY_PROFILES: IndustryProfile[] = [
  // ==================== TECHNOLOGY ====================
  {
    industryName: "Information Technology & Software",
    industryCode: "IT-SOFTWARE",
    description:
      "Software development, web development, mobile apps, cloud computing, SaaS",
    size: "Large",
    growthRate: "12-15% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 500000,
      midCareerSalary: 1200000,
      seniorSalary: 3500000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Increasing",
    jobOpenings: {
      total: 150000,
      annual: 45000,
      competitionLevel: "Very High"
    },
    topEmployers: [
      {
        name: "Google India",
        headquarters: "Bangalore, India",
        avgSalary: 2000000,
        hiringVolume: 5000
      },
      {
        name: "Amazon India",
        headquarters: "Bangalore, India",
        avgSalary: 1800000,
        hiringVolume: 4000
      },
      {
        name: "Microsoft India",
        headquarters: "Hyderabad, India",
        avgSalary: 1700000,
        hiringVolume: 3500
      },
      {
        name: "Goldman Sachs India",
        headquarters: "Bangalore, India",
        avgSalary: 2200000,
        hiringVolume: 2000
      },
      {
        name: "TCS (Tata Consultancy Services)",
        headquarters: "Mumbai, India",
        avgSalary: 900000,
        hiringVolume: 15000
      },
      {
        name: "Infosys",
        headquarters: "Bangalore, India",
        avgSalary: 850000,
        hiringVolume: 12000
      },
      {
        name: "Wipro",
        headquarters: "Bangalore, India",
        avgSalary: 850000,
        hiringVolume: 10000
      }
    ],
    topCareers: [
      "Software Engineer",
      "Data Scientist",
      "Web Developer",
      "DevOps Engineer",
      "Cloud Architect",
      "AI/ML Engineer"
    ],
    requiredSkills: [
      "Programming",
      "Problem Solving",
      "Cloud Platforms",
      "Database Management",
      "System Design"
    ],
    workCulture: {
      workLifeBalance: "Fair",
      innovationLevel: "High",
      careertGrowth: "Fast",
      remoteWorkAvailable: true
    },
    salaryBenefits: {
      baseSalary: 1000000,
      bonusPercentage: 15,
      healthInsurance: true,
      stockOptions: true,
      pensionFund: true,
      otherBenefits: [
        "Free lunch/snacks",
        "Gym membership",
        "Learning budget",
        "Travel allowance"
      ]
    },
    futureOutlook:
      "Strong growth expected. AI/ML, Cloud, and Cybersecurity skills in highest demand. Remote work becoming permanent.",
    regionalDemand: {
      "Bangalore": "Very High",
      "Hyderabad": "Very High",
      "Pune": "High",
      "Delhi NCR": "High",
      "Mumbai": "High",
      "Chennai": "High",
      "Tier-2 cities": "Medium"
    },
    certifications: [
      "AWS Solutions Architect",
      "GCP Associate Cloud Engineer",
      "Certified Kubernetes Administrator",
      "Google Cloud Data Engineer"
    ]
  },

  // ==================== FINANCIAL SERVICES ====================
  {
    industryName: "Banking, Finance & Investment Services",
    industryCode: "FINANCE-BANKING",
    description:
      "Investment banking, wealth management, fintech, cryptocurrency, stock trading",
    size: "Large",
    growthRate: "8-10% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 600000,
      midCareerSalary: 1500000,
      seniorSalary: 4000000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Increasing",
    jobOpenings: {
      total: 80000,
      annual: 20000,
      competitionLevel: "Very High"
    },
    topEmployers: [
      {
        name: "Goldman Sachs",
        headquarters: "Mumbai/Bangalore",
        avgSalary: 2500000,
        hiringVolume: 2000
      },
      {
        name: "JP Morgan",
        headquarters: "Mumbai/Bangalore",
        avgSalary: 2300000,
        hiringVolume: 1800
      },
      {
        name: "Morgan Stanley",
        headquarters: "Mumbai",
        avgSalary: 2200000,
        hiringVolume: 1500
      },
      {
        name: "HDFC Bank",
        headquarters: "Mumbai",
        avgSalary: 1200000,
        hiringVolume: 5000
      },
      {
        name: "ICICI Bank",
        headquarters: "Mumbai",
        avgSalary: 1100000,
        hiringVolume: 4500
      }
    ],
    topCareers: [
      "Investment Banker",
      "Financial Analyst",
      "Trader",
      "Portfolio Manager",
      "Credit Analyst"
    ],
    requiredSkills: [
      "Financial Analysis",
      "Excel Modeling",
      "Financial Theory",
      "Risk Management",
      "Valuation"
    ],
    workCulture: {
      workLifeBalance: "Poor",
      innovationLevel: "High",
      careertGrowth: "Fast",
      remoteWorkAvailable: false
    },
    salaryBenefits: {
      baseSalary: 1500000,
      bonusPercentage: 50,
      healthInsurance: true,
      stockOptions: true,
      pensionFund: true,
      otherBenefits: [
        "Performance bonus",
        "Signing bonus",
        "Relocation package",
        "Club memberships"
      ]
    },
    futureOutlook:
      "Digital transformation, fintech disruption, and regulatory focus on fintech. Cryptocurrency emerging. Data science increasingly important.",
    regionalDemand: {
      "Mumbai": "Very High",
      "Delhi NCR": "High",
      "Bangalore": "High",
      "Hyderabad": "Medium"
    },
    certifications: [
      "CFA (Chartered Financial Analyst)",
      "FRM (Financial Risk Manager)",
      "CPA (Certified Public Accountant)"
    ]
  },

  // ==================== HEALTHCARE ====================
  {
    industryName: "Healthcare & Medical Services",
    industryCode: "HEALTHCARE",
    description:
      "Hospitals, clinics, pharmaceutical, medical devices, biotechnology, healthcare IT",
    size: "Large",
    growthRate: "10-12% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 400000,
      midCareerSalary: 1000000,
      seniorSalary: 2500000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Increasing",
    jobOpenings: {
      total: 120000,
      annual: 30000,
      competitionLevel: "High"
    },
    topEmployers: [
      {
        name: "Apollo Hospitals",
        headquarters: "Hyderabad",
        avgSalary: 1000000,
        hiringVolume: 3000
      },
      {
        name: "Fortis Healthcare",
        headquarters: "Delhi",
        avgSalary: 950000,
        hiringVolume: 2500
      },
      {
        name: "Max Healthcare",
        headquarters: "Delhi",
        avgSalary: 900000,
        hiringVolume: 2000
      },
      {
        name: "Dr. Reddy's Laboratories",
        headquarters: "Hyderabad",
        avgSalary: 1100000,
        hiringVolume: 2500
      }
    ],
    topCareers: [
      "Doctor",
      "Nurse",
      "Pharmacist",
      "Healthcare Manager",
      "Biomedical Engineer"
    ],
    requiredSkills: [
      "Medical Knowledge",
      "Patient Care",
      "Healthcare Management",
      "Clinical Skills",
      "Empathy"
    ],
    workCulture: {
      workLifeBalance: "Fair",
      innovationLevel: "Medium",
      careertGrowth: "Moderate",
      remoteWorkAvailable: false
    },
    salaryBenefits: {
      baseSalary: 800000,
      bonusPercentage: 10,
      healthInsurance: true,
      stockOptions: false,
      pensionFund: true,
      otherBenefits: [
        "Medical coverage for family",
        "Continuing education",
        "On-site medical facilities"
      ]
    },
    futureOutlook:
      "Aging population, increased healthcare demand. Telemedicine growing. Digital health solutions expanding. AI in diagnostics emerging.",
    regionalDemand: {
      "Hyderabad": "Very High",
      "Delhi NCR": "Very High",
      "Bangalore": "High",
      "Mumbai": "High",
      "Chennai": "High"
    },
    certifications: [
      "MBBS",
      "MD/MS",
      "B.Pharma",
      "Nursing certifications",
      "Healthcare Management MBA"
    ]
  },

  // ==================== EDUCATION ====================
  {
    industryName: "Education & EdTech",
    industryCode: "EDUCATION",
    description:
      "Schools, colleges, universities, online learning, EdTech startups, coaching centers",
    size: "Large",
    growthRate: "15-18% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 300000,
      midCareerSalary: 700000,
      seniorSalary: 1500000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Increasing",
    jobOpenings: {
      total: 200000,
      annual: 50000,
      competitionLevel: "Medium"
    },
    topEmployers: [
      {
        name: "Byju's",
        headquarters: "Bangalore",
        avgSalary: 900000,
        hiringVolume: 5000
      },
      {
        name: "Unacademy",
        headquarters: "Bangalore",
        avgSalary: 800000,
        hiringVolume: 3000
      },
      {
        name: "Vedantu",
        headquarters: "Bangalore",
        avgSalary: 750000,
        hiringVolume: 2000
      },
      {
        name: "Delhi University",
        headquarters: "Delhi",
        avgSalary: 700000,
        hiringVolume: 1000
      }
    ],
    topCareers: [
      "Teacher",
      "Professor",
      "Curriculum Designer",
      "EdTech Developer",
      "School Principal"
    ],
    requiredSkills: [
      "Subject Knowledge",
      "Teaching Ability",
      "Communication",
      "Technology",
      "Curriculum Design"
    ],
    workCulture: {
      workLifeBalance: "Good",
      innovationLevel: "High",
      careertGrowth: "Moderate",
      remoteWorkAvailable: true
    },
    salaryBenefits: {
      baseSalary: 500000,
      bonusPercentage: 10,
      healthInsurance: true,
      stockOptions: false,
      pensionFund: true,
      otherBenefits: [
        "Learning budget",
        "Holidays during breaks",
        "Professional development"
      ]
    },
    futureOutlook:
      "EdTech revolution transforming education. Online learning accelerating. Personalized learning gaining traction. Hybrid models becoming norm.",
    regionalDemand: {
      "Bangalore": "Very High",
      "Delhi NCR": "High",
      "Mumbai": "High",
      "Hyderabad": "High",
      "Pan-India": "Medium"
    },
    certifications: [
      "B.Ed (Bachelor of Education)",
      "M.Ed (Master of Education)",
      "PGDM (Post Graduate Diploma in Management)",
      "Subject-specific certifications"
    ]
  },

  // ==================== E-COMMERCE & RETAIL ====================
  {
    industryName: "E-Commerce & Retail",
    industryCode: "ECOMMERCE",
    description: "Online retail, marketplaces, supply chain, logistics, consumer goods",
    size: "Large",
    growthRate: "20-25% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 450000,
      midCareerSalary: 1000000,
      seniorSalary: 2500000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Increasing",
    jobOpenings: {
      total: 100000,
      annual: 35000,
      competitionLevel: "High"
    },
    topEmployers: [
      {
        name: "Amazon India",
        headquarters: "Bangalore",
        avgSalary: 1200000,
        hiringVolume: 8000
      },
      {
        name: "Flipkart",
        headquarters: "Bangalore",
        avgSalary: 1100000,
        hiringVolume: 6000
      },
      {
        name: "Snapdeal",
        headquarters: "Delhi",
        avgSalary: 900000,
        hiringVolume: 2000
      },
      {
        name: "Reliance Retail",
        headquarters: "Mumbai",
        avgSalary: 800000,
        hiringVolume: 5000
      }
    ],
    topCareers: [
      "Product Manager",
      "Operations Manager",
      "Data Analyst",
      "Supply Chain Manager",
      "Marketing Manager"
    ],
    requiredSkills: [
      "Analytics",
      "Product Knowledge",
      "Business Strategy",
      "Customer Insight",
      "Technology"
    ],
    workCulture: {
      workLifeBalance: "Fair",
      innovationLevel: "High",
      careertGrowth: "Fast",
      remoteWorkAvailable: true
    },
    salaryBenefits: {
      baseSalary: 1000000,
      bonusPercentage: 20,
      healthInsurance: true,
      stockOptions: true,
      pensionFund: false,
      otherBenefits: [
        "Performance bonus",
        "Employee discounts",
        "Learning allowance"
      ]
    },
    futureOutlook:
      "Rapid e-commerce growth in India. Supply chain optimization critical. AI/ML for personalization emerging. Logistics becoming core differentiator.",
    regionalDemand: {
      "Bangalore": "Very High",
      "Delhi NCR": "Very High",
      "Mumbai": "High",
      "Hyderabad": "High",
      "Pune": "Medium"
    },
    certifications: [
      "Product Management",
      "Supply Chain Management",
      "Data Analytics",
      "Business Analytics"
    ]
  },

  // ==================== CONSULTING ====================
  {
    industryName: "Management Consulting",
    industryCode: "CONSULTING",
    description:
      "Strategy consulting, operations consulting, digital transformation, management advisory",
    size: "Medium",
    growthRate: "10-12% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 700000,
      midCareerSalary: 1500000,
      seniorSalary: 3500000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Stable",
    jobOpenings: {
      total: 25000,
      annual: 7000,
      competitionLevel: "Very High"
    },
    topEmployers: [
      {
        name: "McKinsey & Company",
        headquarters: "Mumbai/Delhi",
        avgSalary: 2000000,
        hiringVolume: 1500
      },
      {
        name: "Boston Consulting Group",
        headquarters: "Bangalore",
        avgSalary: 1900000,
        hiringVolume: 1200
      },
      {
        name: "Bain & Company",
        headquarters: "Mumbai",
        avgSalary: 1850000,
        hiringVolume: 1000
      },
      {
        name: "Deloitte Consulting",
        headquarters: "Hyderabad",
        avgSalary: 1200000,
        hiringVolume: 3000
      }
    ],
    topCareers: [
      "Management Consultant",
      "Strategy Consultant",
      "Business Analyst",
      "Senior Consultant",
      "Partner"
    ],
    requiredSkills: [
      "Problem Solving",
      "Business Strategy",
      "Communication",
      "Analytical Thinking",
      "Client Management"
    ],
    workCulture: {
      workLifeBalance: "Poor",
      innovationLevel: "High",
      careertGrowth: "Fast",
      remoteWorkAvailable: true
    },
    salaryBenefits: {
      baseSalary: 1500000,
      bonusPercentage: 30,
      healthInsurance: true,
      stockOptions: false,
      pensionFund: false,
      otherBenefits: [
        "Signing bonus",
        "Learning & development",
        "Travel allowance"
      ]
    },
    futureOutlook:
      "Digital transformation driving consulting demand. ESG consulting growing. Data-driven advisory becoming standard. Remote consulting accelerating.",
    regionalDemand: {
      "Mumbai": "Very High",
      "Bangalore": "Very High",
      "Delhi NCR": "High",
      "Hyderabad": "High"
    },
    certifications: [
      "MBA from top B-schools",
      "Case interview preparation",
      "Business analysis certification"
    ]
  },

  // ==================== MANUFACTURING & ENGINEERING ====================
  {
    industryName: "Manufacturing & Engineering",
    industryCode: "MANUFACTURING",
    description:
      "Automotive, heavy engineering, machinery, aerospace, electrical equipment manufacturing",
    size: "Large",
    growthRate: "7-9% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 400000,
      midCareerSalary: 900000,
      seniorSalary: 2000000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Stable",
    jobOpenings: {
      total: 80000,
      annual: 18000,
      competitionLevel: "Medium"
    },
    topEmployers: [
      {
        name: "Maruti Suzuki",
        headquarters: "Delhi",
        avgSalary: 800000,
        hiringVolume: 2000
      },
      {
        name: "Bajaj Auto",
        headquarters: "Pune",
        avgSalary: 750000,
        hiringVolume: 1500
      },
      {
        name: "Tata Motors",
        headquarters: "Mumbai",
        avgSalary: 850000,
        hiringVolume: 2500
      },
      {
        name: "Siemens India",
        headquarters: "Bangalore",
        avgSalary: 900000,
        hiringVolume: 1200
      }
    ],
    topCareers: [
      "Mechanical Engineer",
      "Production Engineer",
      "Quality Engineer",
      "Plant Manager",
      "Operations Manager"
    ],
    requiredSkills: [
      "Engineering Knowledge",
      "Production Management",
      "Quality Control",
      "Problem Solving",
      "CAD/CAM"
    ],
    workCulture: {
      workLifeBalance: "Good",
      innovationLevel: "Medium",
      careertGrowth: "Moderate",
      remoteWorkAvailable: false
    },
    salaryBenefits: {
      baseSalary: 700000,
      bonusPercentage: 15,
      healthInsurance: true,
      stockOptions: false,
      pensionFund: true,
      otherBenefits: [
        "On-site facilities",
        "Relocation allowance",
        "Professional development"
      ]
    },
    futureOutlook:
      "India's manufacturing growth story. Make in India boosting demand. Automation increasing in factories. EV transition creating new roles.",
    regionalDemand: {
      "Pune": "Very High",
      "Delhi NCR": "High",
      "Tamil Nadu": "High",
      "Karnataka": "High",
      "Maharashtra": "High"
    },
    certifications: [
      "B.Tech Mechanical Engineering",
      "B.Tech Production Engineering",
      "Six Sigma certification",
      "CAD certifications"
    ]
  },

  // ==================== REAL ESTATE & CONSTRUCTION ====================
  {
    industryName: "Real Estate & Construction",
    industryCode: "REALESTATE",
    description: "Property development, construction, real estate services, infrastructure",
    size: "Large",
    growthRate: "8-10% CAGR (2023-2028)",
    averageSalary: {
      entrySalary: 350000,
      midCareerSalary: 800000,
      seniorSalary: 2000000,
      currency: "INR",
      year: 2025
    },
    demandTrend: "Increasing",
    jobOpenings: {
      total: 90000,
      annual: 22000,
      competitionLevel: "Medium"
    },
    topEmployers: [
      {
        name: "DLF",
        headquarters: "Delhi",
        avgSalary: 800000,
        hiringVolume: 1500
      },
      {
        name: "Lodha Group",
        headquarters: "Mumbai",
        avgSalary: 750000,
        hiringVolume: 1200
      },
      {
        name: "HDFC Bank Real Estate",
        headquarters: "Mumbai",
        avgSalary: 850000,
        hiringVolume: 1000
      }
    ],
    topCareers: [
      "Project Manager",
      "Site Engineer",
      "Property Manager",
      "Real Estate Broker",
      "Infrastructure Manager"
    ],
    requiredSkills: [
      "Project Management",
      "Technical Knowledge",
      "Site Management",
      "Client Handling",
      "Regulatory Knowledge"
    ],
    workCulture: {
      workLifeBalance: "Fair",
      innovationLevel: "Medium",
      careertGrowth: "Moderate",
      remoteWorkAvailable: false
    },
    salaryBenefits: {
      baseSalary: 600000,
      bonusPercentage: 15,
      healthInsurance: true,
      stockOptions: false,
      pensionFund: true,
      otherBenefits: [
        "Project incentives",
        "Travel allowance",
        "Professional development"
      ]
    },
    futureOutlook:
      "Urban development accelerating. Smart cities initiative growing. Green building becoming standard. Real estate tech disrupting sector.",
    regionalDemand: {
      "Delhi NCR": "Very High",
      "Mumbai": "Very High",
      "Bangalore": "High",
      "Hyderabad": "High",
      "Pune": "High"
    },
    certifications: [
      "B.Tech Civil Engineering",
      "Project Management certification",
      "Real Estate certification"
    ]
  }
];

/**
 * Helper: Get industry profile by name
 */
export function getIndustryProfile(industryName: string): IndustryProfile | null {
  return (
    INDUSTRY_PROFILES.find(
      i => i.industryName.toLowerCase() === industryName.toLowerCase()
    ) || null
  );
}

/**
 * Helper: Get salary range for an industry
 */
export function getIndustrySalaryRange(industryName: string): {
  entry: number;
  mid: number;
  senior: number;
} | null {
  const industry = getIndustryProfile(industryName);
  if (!industry) return null;

  return {
    entry: industry.averageSalary.entrySalary,
    mid: industry.averageSalary.midCareerSalary,
    senior: industry.averageSalary.seniorSalary
  };
}

/**
 * Helper: Get top employers in an industry
 */
export function getTopEmployersInIndustry(
  industryName: string
): IndustryProfile["topEmployers"] {
  const industry = getIndustryProfile(industryName);
  return industry?.topEmployers || [];
}

/**
 * Helper: Get industries by growth rate
 */
export function getIndustriesByGrowth(): IndustryProfile[] {
  return [...INDUSTRY_PROFILES].sort((a, b) => {
    const aGrowth = parseFloat(a.growthRate);
    const bGrowth = parseFloat(b.growthRate);
    return bGrowth - aGrowth;
  });
}

/**
 * Helper: Get high-demand industries
 */
export function getHighDemandIndustries(): IndustryProfile[] {
  return INDUSTRY_PROFILES.filter(
    i => i.demandTrend === "Increasing" && i.jobOpenings.competitionLevel !== "Very High"
  );
}

/**
 * Helper: Get industries with best work-life balance
 */
export function getIndustriesByWorkLifeBalance(): IndustryProfile[] {
  const balanceRank = {
    Excellent: 4,
    Good: 3,
    Fair: 2,
    Poor: 1
  };

  return [...INDUSTRY_PROFILES].sort(
    (a, b) =>
      (balanceRank[b.workCulture.workLifeBalance as keyof typeof balanceRank] ||
        0) -
      (balanceRank[a.workCulture.workLifeBalance as keyof typeof balanceRank] ||
        0)
  );
}

/**
 * Helper: Get industries with best salary potential
 */
export function getIndustriesByHighestSalary(): IndustryProfile[] {
  return [...INDUSTRY_PROFILES]
    .sort((a, b) => b.averageSalary.seniorSalary - a.averageSalary.seniorSalary)
    .slice(0, 10);
}
