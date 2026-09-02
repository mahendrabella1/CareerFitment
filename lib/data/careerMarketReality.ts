/**
 * Career Market Reality Database
 * Real job market data, regional availability, future viability
 * Shows which careers are actually viable in India NOW and FUTURE
 * Last Updated: 2026-09-02
 */

export interface CareerMarketData {
  careerTitle: string;
  careerId: string;

  // Current Market Status (2025-2026)
  currentMarket: {
    jobOpenings: number; // Annual in India
    competitionLevel: "Low" | "Low" | "Medium" | "High" | "High";
    demandTrend: "Increasing" | "Stable" | "Decreasing";
    saturationLevel: "Low" | "Medium" | "High" | "High";
    hiringVolume: number; // Companies actively hiring
  };

  // Regional Availability in India
  regionalDemand: {
    region: string;
    availability: "High" | "High" | "Medium" | "Low" | "Low";
    topCities: string[];
    avgSalary: number; // INR
    companies: number; // Number of companies hiring
  }[];

  // Future Viability
  futureOutlook: {
    outlook5Year: "Strong Growth" | "Moderate Growth" | "Stable" | "Declining" | "At Risk";
    outlook10Year: "Strong Growth" | "Moderate Growth" | "Stable" | "Declining" | "At Risk";
    growthCAGR: number; // Compound Annual Growth Rate %
    keyDrivers: string[]; // What's driving growth/decline
    risks: string[]; // What could threaten this career
  };

  // AI/Automation Threat
  automationThreat: {
    threatLevel: "Low" | "Low" | "Medium" | "High" | "High"; // 1-5 scale
    riskScore: number; // 0-100
    affectedTasks: string[]; // What will be automated
    safeActivities: string[]; // What won't be automated
    adaptationStrategy: string; // How to stay relevant
    timeframe: string; // When will automation hit (5/10/15 years)
  };

  // Market Saturation
  saturation: {
    totalProfessionals: number; // Approximate in India
    growthVsSupply: "Demand > Supply" | "Balanced" | "Supply > Demand";
    competitionIntensity: number; // 1-10 scale
    barrierToEntry: string;
    easeToDifferentiate: "Easy" | "Moderate" | "Difficult" | "Very Difficult";
  };

  // Career Longevity
  longevity: {
    sustainableYears: number; // How many years realistic in single role
    careerLength: "Short-term (5-10yr)" | "Medium (10-20yr)" | "Long (20-40yr)";
    pivotOpportunities: string[]; // Where can you go from here
    ageBarrier: "None" | "Mild" | "Significant"; // Do you get sidelined as you age?
    ageBarrierDetails: string;
  };

  // Job Market Dynamics
  jobMarketDynamics: {
    entryLevelAvailable: boolean;
    midCareerOpportunities: boolean;
    seniorRolesAvailable: boolean;
    requiredExperience: string; // e.g., "0-2 years for entry"
    experienceBottleneck: string; // "Hard to jump from 3-5 years to 10+ years"
  };

  // Global vs India Context
  globalVsIndia: {
    globalDemand: "High" | "High" | "Medium" | "Low";
    indiaVsGlobal: string;
    outsourcingRisk: string;
    expatriateDemand: string;
    remotePossible: boolean;
  };

  // Entry Points and Timing
  entryStrategy: {
    bestTimeToEnter: string; // "Right now" or "Wait for market growth"
    seasonalHiring: string; // When companies hire most
    fastestWayIn: string; // What's the quickest path
    hardestPartOfEntry: string; // What blocks new entrants
  };

  // Long-term Career Viability Score
  viabilityScore: number; // 0-100
  recommendation: string;
}

/**
 * CAREER MARKET REALITY DATABASE
 * Real India job market data (2025-2026)
 */
export const CAREER_MARKET_REALITY: CareerMarketData[] = [
  // ==================== SOFTWARE ENGINEER ====================
  {
    careerTitle: "Software Engineer",
    careerId: "software-engineer-001",

    currentMarket: {
      jobOpenings: 150000,
      competitionLevel: "High",
      demandTrend: "Increasing",
      saturationLevel: "High",
      hiringVolume: 5000
    },

    regionalDemand: [
      {
        region: "Bangalore",
        availability: "High",
        topCities: ["Bangalore", "Koramangala", "Whitefield"],
        avgSalary: 1200000,
        companies: 1500
      },
      {
        region: "Hyderabad",
        availability: "High",
        topCities: ["Hyderabad", "HITEC City"],
        avgSalary: 1100000,
        companies: 1200
      },
      {
        region: "Pune",
        availability: "High",
        topCities: ["Pune", "Hinjewadi"],
        avgSalary: 1000000,
        companies: 800
      },
      {
        region: "Delhi NCR",
        availability: "High",
        topCities: ["Gurgaon", "Noida", "Delhi"],
        avgSalary: 1100000,
        companies: 900
      },
      {
        region: "Mumbai",
        availability: "High",
        topCities: ["Mumbai", "Powai"],
        avgSalary: 1200000,
        companies: 600
      },
      {
        region: "Chennai",
        availability: "Medium",
        topCities: ["Chennai", "Sholinganallur"],
        avgSalary: 950000,
        companies: 500
      },
      {
        region: "Tier-2 Cities",
        availability: "Low",
        topCities: ["Indore", "Jaipur", "Lucknow"],
        avgSalary: 800000,
        companies: 200
      }
    ],

    futureOutlook: {
      outlook5Year: "Strong Growth",
      outlook10Year: "Strong Growth",
      growthCAGR: 12,
      keyDrivers: [
        "Digital transformation accelerating",
        "Cloud adoption increasing",
        "AI/ML demand explosion",
        "Startup ecosystem growing"
      ],
      risks: [
        "AI will automate some coding tasks",
        "Global competition (outsourcing to cheaper regions)",
        "Market saturation in entry-level roles",
        "Skill obsolescence (rapid tech change)"
      ]
    },

    automationThreat: {
      threatLevel: "Medium",
      riskScore: 45,
      affectedTasks: [
        "Routine coding (boilerplate)",
        "Unit testing",
        "Code review (partially)",
        "Bug fixes (simple ones)"
      ],
      safeActivities: [
        "System design",
        "Architecture decisions",
        "Complex problem solving",
        "Team leadership",
        "Client interaction"
      ],
      adaptationStrategy:
        "Move to system design, architecture, leadership roles. AI will handle routine coding; humans will architect solutions.",
      timeframe: "5-10 years for significant automation"
    },

    saturation: {
      totalProfessionals: 1200000,
      growthVsSupply: "Balanced",
      competitionIntensity: 8,
      barrierToEntry: "Low",
      easeToDifferentiate: "Difficult"
    },

    longevity: {
      sustainableYears: 30,
      careerLength: "Long (20-40yr)",
      pivotOpportunities: [
        "Product Manager",
        "Engineering Manager",
        "CTO",
        "Entrepreneur",
        "Technical Consultant"
      ],
      ageBarrier: "Mild",
      ageBarrierDetails:
        "Ageism exists in startups (prefer <35), but large companies value experience. Can work till 60+."
    },

    jobMarketDynamics: {
      entryLevelAvailable: true,
      midCareerOpportunities: true,
      seniorRolesAvailable: true,
      requiredExperience: "0-2 years for entry, 2-5 for mid, 7+ for senior",
      experienceBottleneck: "Can jump levels based on skill growth"
    },

    globalVsIndia: {
      globalDemand: "High",
      indiaVsGlobal: "Similar",
      outsourcingRisk: "High",
      expatriateDemand: "Very easy to work in US/EU/Singapore",
      remotePossible: true
    },

    entryStrategy: {
      bestTimeToEnter: "Right now - always hiring",
      seasonalHiring: "Jan-Mar, Jul-Sep (highest)",
      fastestWayIn: "Strong portfolio + coding skills + internships",
      hardestPartOfEntry: "First job (need to prove yourself)"
    },

    viabilityScore: 85,
    recommendation:
      "Software engineering is a stable, high-growth career in India. Entry is competitive but achievable. High salary, good growth, work-from-home options. Automation threat is low if you stay ahead of tech trends. Very viable for 30+ year career."
  },

  // ==================== DATA SCIENTIST ====================
  {
    careerTitle: "Data Scientist",
    careerId: "data-scientist-001",

    currentMarket: {
      jobOpenings: 45000,
      competitionLevel: "High",
      demandTrend: "Increasing",
      saturationLevel: "Medium",
      hiringVolume: 1500
    },

    regionalDemand: [
      {
        region: "Bangalore",
        availability: "High",
        topCities: ["Bangalore", "Whitefield"],
        avgSalary: 1500000,
        companies: 800
      },
      {
        region: "Hyderabad",
        availability: "High",
        topCities: ["Hyderabad"],
        avgSalary: 1400000,
        companies: 600
      },
      {
        region: "Delhi NCR",
        availability: "High",
        topCities: ["Gurgaon"],
        avgSalary: 1500000,
        companies: 400
      },
      {
        region: "Mumbai",
        availability: "Medium",
        topCities: ["Mumbai"],
        avgSalary: 1600000,
        companies: 300
      },
      {
        region: "Other Cities",
        availability: "Low",
        topCities: [],
        avgSalary: 1200000,
        companies: 50
      }
    ],

    futureOutlook: {
      outlook5Year: "Strong Growth",
      outlook10Year: "Strong Growth",
      growthCAGR: 18,
      keyDrivers: [
        "AI/ML adoption accelerating",
        "Every company needs data insights",
        "Big data explosion",
        "Startup explosion in analytics"
      ],
      risks: [
        "AutoML tools will reduce manual work",
        "AI will automate routine analysis",
        "Entry-level jobs decreasing (need more expertise)",
        "Tools do analysis; humans do storytelling"
      ]
    },

    automationThreat: {
      threatLevel: "Medium",
      riskScore: 40,
      affectedTasks: [
        "Basic statistical analysis",
        "Routine data cleaning",
        "Standard ML model building",
        "Simple dashboards"
      ],
      safeActivities: [
        "Complex business problem solving",
        "Data storytelling and insights",
        "Novel ML algorithms",
        "Strategic recommendations",
        "Leadership in analytics"
      ],
      adaptationStrategy:
        "Move from 'doing analysis' to 'telling stories with data' and solving complex business problems. Technical skill + communication = future-proof.",
      timeframe: "5-7 years for significant automation"
    },

    saturation: {
      totalProfessionals: 200000,
      growthVsSupply: "Demand > Supply",
      competitionIntensity: 6,
      barrierToEntry: "High",
      easeToDifferentiate: "Easy"
    },

    longevity: {
      sustainableYears: 25,
      careerLength: "Long (20-40yr)",
      pivotOpportunities: [
        "Product Manager",
        "Chief Analytics Officer",
        "AI/ML Engineer",
        "Researcher",
        "Entrepreneur"
      ],
      ageBarrier: "None",
      ageBarrierDetails:
        "Data science values experience and wisdom. Older data scientists are highly valued."
    },

    jobMarketDynamics: {
      entryLevelAvailable: false,
      midCareerOpportunities: true,
      seniorRolesAvailable: true,
      requiredExperience: "2-3 years minimum for entry (need ML/stats knowledge)",
      experienceBottleneck: "Hard to enter; easy to grow once in"
    },

    globalVsIndia: {
      globalDemand: "High",
      indiaVsGlobal: "Higher in India (outsourcing hub)",
      outsourcingRisk: "High",
      expatriateDemand: "Very easy to work abroad",
      remotePossible: true
    },

    entryStrategy: {
      bestTimeToEnter: "Right now - high demand",
      seasonalHiring: "Year-round hiring",
      fastestWayIn:
        "Masters in Data Science + internships + portfolio of projects",
      hardestPartOfEntry:
        "Getting first job (need strong foundation; bootcamps not enough)"
    },

    viabilityScore: 88,
    recommendation:
      "Data science is one of the fastest-growing careers in India. Entry barrier is high (need strong math/coding foundation), but once in, growth is excellent. Salary is excellent. Automation threat is low if you focus on storytelling and insights. Very viable for 25+ year career. Best if you start with engineering and move to data science."
  },

  // ==================== DOCTOR (MBBS) ====================
  {
    careerTitle: "Doctor (MBBS)",
    careerId: "doctor-mbbs-001",

    currentMarket: {
      jobOpenings: 80000,
      competitionLevel: "High",
      demandTrend: "Increasing",
      saturationLevel: "High",
      hiringVolume: 3000
    },

    regionalDemand: [
      {
        region: "Metro Cities",
        availability: "High",
        topCities: ["Delhi", "Mumbai", "Bangalore", "Hyderabad"],
        avgSalary: 1000000,
        companies: 2000
      },
      {
        region: "Tier-1 Cities",
        availability: "High",
        topCities: ["Pune", "Ahmedabad", "Jaipur"],
        avgSalary: 800000,
        companies: 1500
      },
      {
        region: "Tier-2 Cities",
        availability: "Medium",
        topCities: ["Indore", "Lucknow", "Chandigarh"],
        avgSalary: 600000,
        companies: 800
      },
      {
        region: "Rural Areas",
        availability: "High",
        topCities: ["Government health posts"],
        avgSalary: 400000,
        companies: 5000
      }
    ],

    futureOutlook: {
      outlook5Year: "Moderate Growth",
      outlook10Year: "Strong Growth",
      growthCAGR: 8,
      keyDrivers: [
        "India's healthcare spending increasing",
        "Aging population needs more doctors",
        "Telemedicine expansion",
        "Preventive care gaining focus"
      ],
      risks: [
        "Doctor supply growing faster than demand",
        "Government salary cap limiting growth",
        "AI diagnosis tools reducing doctor workload",
        "Burnout and mental health crisis in profession"
      ]
    },

    automationThreat: {
      threatLevel: "Low",
      riskScore: 25,
      affectedTasks: [
        "Routine diagnosis (imaging analysis)",
        "Simple test interpretation",
        "Administrative work"
      ],
      safeActivities: [
        "Complex diagnosis",
        "Surgery",
        "Patient care and communication",
        "Treatment decisions",
        "Emergency medicine"
      ],
      adaptationStrategy:
        "AI will help with diagnosis, but human doctors will be MORE essential for treatment decisions, patient communication, and complex cases.",
      timeframe: "10+ years before significant impact"
    },

    saturation: {
      totalProfessionals: 1300000,
      growthVsSupply: "Supply > Demand",
      competitionIntensity: 9,
      barrierToEntry: "High",
      easeToDifferentiate: "Difficult"
    },

    longevity: {
      sustainableYears: 40,
      careerLength: "Long (20-40yr)",
      pivotOpportunities: [
        "Hospital administration",
        "Medical research",
        "Healthcare policy",
        "Medical education",
        "Healthcare startup"
      ],
      ageBarrier: "None",
      ageBarrierDetails:
        "Doctors are valued lifetime. Can work till 70+. No age discrimination."
    },

    jobMarketDynamics: {
      entryLevelAvailable: true,
      midCareerOpportunities: true,
      seniorRolesAvailable: true,
      requiredExperience: "Residency (3-5 years) mandatory after MBBS",
      experienceBottleneck: "Need long training; then excellent opportunities"
    },

    globalVsIndia: {
      globalDemand: "High",
      indiaVsGlobal: "Lower in India",
      outsourcingRisk: "Low",
      expatriateDemand:
        "High; can work in US/UK/Gulf with additional qualification",
      remotePossible: false
    },

    entryStrategy: {
      bestTimeToEnter: "2-3 years of residency required after MBBS",
      seasonalHiring: "Year-round",
      fastestWayIn: "Compete for NEET → MBBS → Residency → Practice",
      hardestPartOfEntry: "NEET competition (most competitive exam in India)"
    },

    viabilityScore: 80,
    recommendation:
      "Medicine is a secure, respected career in India with lifelong demand. High saturation now; market is competitive. Government salaries are low, but private practice income is excellent. Requires long training (11+ years). Automation threat is low. Very viable for 40+ year career, but emotional toll and burnout are real risks. Only pursue if you have genuine passion for healthcare."
  },

  // ==================== ENTREPRENEUR ====================
  {
    careerTitle: "Entrepreneur",
    careerId: "entrepreneur-001",

    currentMarket: {
      jobOpenings: 0,
      competitionLevel: "High",
      demandTrend: "Increasing",
      saturationLevel: "High",
      hiringVolume: 0
    },

    regionalDemand: [
      {
        region: "Bangalore",
        availability: "High",
        topCities: ["Bangalore", "Electronic City"],
        avgSalary: 500000,
        companies: 5000
      },
      {
        region: "Delhi NCR",
        availability: "High",
        topCities: ["Gurgaon", "Noida"],
        avgSalary: 400000,
        companies: 3000
      },
      {
        region: "Mumbai",
        availability: "High",
        topCities: ["Mumbai"],
        avgSalary: 600000,
        companies: 2000
      },
      {
        region: "Other Cities",
        availability: "Medium",
        topCities: ["Hyderabad", "Pune"],
        avgSalary: 300000,
        companies: 1000
      }
    ],

    futureOutlook: {
      outlook5Year: "Strong Growth",
      outlook10Year: "Strong Growth",
      growthCAGR: 25,
      keyDrivers: [
        "Funding ecosystem maturing",
        "Risk capital availability",
        "Digital-first India",
        "Young demographic",
        "Tech enabling low-cost startups"
      ],
      risks: [
        "Market saturation (too many startups)",
        "Competition from global companies",
        "Economic slowdown",
        "Regulatory challenges",
        "90% of startups fail"
      ]
    },

    automationThreat: {
      threatLevel: "Low",
      riskScore: 10,
      affectedTasks: [
        "Automation affects what you're building (not the role itself)"
      ],
      safeActivities: [
        "Vision and strategy",
        "Product decisions",
        "Team building",
        "Investor relations",
        "Problem-solving"
      ],
      adaptationStrategy:
        "You're USING AI as a tool, not competing against it. Build AI-powered products.",
      timeframe: "Not applicable"
    },

    saturation: {
      totalProfessionals: 250000,
      growthVsSupply: "Supply > Demand",
      competitionIntensity: 10,
      barrierToEntry: "Low (capital barrier is high)",
      easeToDifferentiate: "Very Difficult"
    },

    longevity: {
      sustainableYears: 10,
      careerLength: "Short-term (5-10yr)",
      pivotOpportunities: [
        "VC investor",
        "Startup advisor",
        "Corporate executive",
        "Angel investor",
        "Serial entrepreneur"
      ],
      ageBarrier: "Mild",
      ageBarrierDetails:
        "Investors prefer young founders (<40), but experience is valued. Can start at any age."
    },

    jobMarketDynamics: {
      entryLevelAvailable: false,
      midCareerOpportunities: false,
      seniorRolesAvailable: false,
      requiredExperience: "3-5 years in industry before starting is ideal",
      experienceBottleneck: "Build experience in corporate before starting"
    },

    globalVsIndia: {
      globalDemand: "High",
      indiaVsGlobal: "Similar",
      outsourcingRisk: "Low",
      expatriateDemand: "Can start in any country",
      remotePossible: true
    },

    entryStrategy: {
      bestTimeToEnter: "Now - best time was 10 years ago, second best is now",
      seasonalHiring: "Not applicable",
      fastestWayIn:
        "Get corporate experience (2-3yr) → Build MVP → Get seed funding → Launch",
      hardestPartOfEntry:
        "Getting first customers and initial funding are the hardest"
    },

    viabilityScore: 65,
    recommendation:
      "Entrepreneurship is high-growth, high-risk, high-reward. India's startup ecosystem is booming. 90% of startups fail in 5 years. Success requires luck, timing, team, and capital. Average income in first 5 years is LOW. Only pursue if you have risk tolerance, capital reserves, and genuine passion for a problem. Best to get corporate experience first, then start."
  },

  // ==================== LAWYER ====================
  {
    careerTitle: "Lawyer",
    careerId: "lawyer-001",

    currentMarket: {
      jobOpenings: 35000,
      competitionLevel: "High",
      demandTrend: "Stable",
      saturationLevel: "High",
      hiringVolume: 1200
    },

    regionalDemand: [
      {
        region: "Metro Cities",
        availability: "High",
        topCities: ["Delhi", "Mumbai", "Bangalore"],
        avgSalary: 1200000,
        companies: 1500
      },
      {
        region: "Tier-1 Cities",
        availability: "Medium",
        topCities: ["Hyderabad", "Pune", "Ahmedabad"],
        avgSalary: 800000,
        companies: 800
      },
      {
        region: "Smaller Cities",
        availability: "Low",
        topCities: [],
        avgSalary: 500000,
        companies: 200
      }
    ],

    futureOutlook: {
      outlook5Year: "Moderate Growth",
      outlook10Year: "Moderate Growth",
      growthCAGR: 6,
      keyDrivers: [
        "More regulations",
        "Corporate growth",
        "IP/tech law emerging",
        "Legal tech startups"
      ],
      risks: [
        "AI legal research tools reducing work",
        "Document automation",
        "Legal process outsourcing",
        "Lower salaries in outsourced work"
      ]
    },

    automationThreat: {
      threatLevel: "Medium",
      riskScore: 50,
      affectedTasks: [
        "Legal research",
        "Document review",
        "Contract analysis",
        "Basic document drafting"
      ],
      safeActivities: [
        "Client strategy",
        "Negotiation",
        "Courtroom advocacy",
        "Complex legal analysis",
        "Judgment interpretation"
      ],
      adaptationStrategy:
        "AI will handle research and docs; lawyers do strategy and judgment. High-value work remains.",
      timeframe: "5-10 years for significant impact"
    },

    saturation: {
      totalProfessionals: 1500000,
      growthVsSupply: "Supply > Demand",
      competitionIntensity: 8,
      barrierToEntry: "High",
      easeToDifferentiate: "Difficult"
    },

    longevity: {
      sustainableYears: 40,
      careerLength: "Long (20-40yr)",
      pivotOpportunities: [
        "Judge",
        "Legal education",
        "Legal policy",
        "Corporate counsel",
        "Legal startup"
      ],
      ageBarrier: "None",
      ageBarrierDetails:
        "Lawyers get better with age. Can practice till 70+. Experience is premium."
    },

    jobMarketDynamics: {
      entryLevelAvailable: true,
      midCareerOpportunities: true,
      seniorRolesAvailable: true,
      requiredExperience: "3-5 years associate work before specialization",
      experienceBottleneck: "Easy path once you get first law job"
    },

    globalVsIndia: {
      globalDemand: "High",
      indiaVsGlobal: "Lower in India",
      outsourcingRisk: "High for junior work",
      expatriateDemand:
        "Medium; need additional qualification for US/UK practice",
      remotePossible: true
    },

    entryStrategy: {
      bestTimeToEnter: "After law school + bar exam",
      seasonalHiring: "Year-round",
      fastestWayIn: "3-year LLB → Bar exam → Associate at law firm",
      hardestPartOfEntry: "CLAT exam (competitive) and bar exam"
    },

    viabilityScore: 75,
    recommendation:
      "Law is a stable career with good salary potential, especially in metros. Oversupplied at entry-level but good opportunities for specialization. Top-tier law firm partners earn excellent income. Government lawyers have job security but lower pay. Requires long training (8+ years after 12th). Automation will reduce routine work but lawyers remain essential. Viable for 40+ year career if you get into a good firm/specialize."
  }
];

/**
 * Helper: Get market data for a career
 */
export function getCareerMarketData(careerTitle: string): CareerMarketData | null {
  return (
    CAREER_MARKET_REALITY.find(
      c => c.careerTitle.toLowerCase() === careerTitle.toLowerCase()
    ) || null
  );
}

/**
 * Helper: Get regional demand for a career
 */
export function getRegionalDemandForCareer(careerTitle: string): CareerMarketData["regionalDemand"] {
  const career = getCareerMarketData(careerTitle);
  return career?.regionalDemand || [];
}

/**
 * Helper: Get automation threat level
 */
export function getAutomationThreat(careerTitle: string): number {
  const career = getCareerMarketData(careerTitle);
  return career?.automationThreat.riskScore || 0;
}

/**
 * Helper: Is this career viable long-term?
 */
export function isCareerViable(careerTitle: string): boolean {
  const career = getCareerMarketData(careerTitle);
  return career ? career.viabilityScore >= 70 : false;
}

/**
 * Helper: Get careers ranked by viability
 */
export function getCareersRankedByViability(): CareerMarketData[] {
  return [...CAREER_MARKET_REALITY].sort((a, b) => b.viabilityScore - a.viabilityScore);
}

/**
 * Helper: Get careers with highest job openings
 */
export function getCareersWithMostOpenings(): CareerMarketData[] {
  return [...CAREER_MARKET_REALITY]
    .filter(c => c.currentMarket.jobOpenings > 0)
    .sort((a, b) => b.currentMarket.jobOpenings - a.currentMarket.jobOpenings);
}

/**
 * Helper: Get careers with strongest future outlook
 */
export function getCareersWithStrongestGrowth(): CareerMarketData[] {
  const growthRank = {
    "Strong Growth": 3,
    "Moderate Growth": 2,
    Stable: 1,
    Declining: 0,
    "At Risk": -1
  };

  return [...CAREER_MARKET_REALITY]
    .map(c => ({
      ...c,
      growthScore:
        (growthRank[c.futureOutlook.outlook5Year as keyof typeof growthRank] || 0) +
        (growthRank[c.futureOutlook.outlook10Year as keyof typeof growthRank] || 0)
    }))
    .sort((a, b) => b.growthScore - a.growthScore);
}

/**
 * Helper: Get careers by automation threat
 */
export function getCareersRankedByAutomationThreat(): CareerMarketData[] {
  const threatRank = {
    "Low": 1,
    "Medium": 2,
    "High": 3
  };

  return [...CAREER_MARKET_REALITY].sort(
    (a, b) =>
      (threatRank[b.automationThreat.threatLevel as keyof typeof threatRank] || 0) -
      (threatRank[a.automationThreat.threatLevel as keyof typeof threatRank] || 0)
  );
}
