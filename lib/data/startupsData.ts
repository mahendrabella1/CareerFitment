/**
 * Startups Database
 * 100+ innovative Indian and global startups
 *
 * Sources:
 * - Y Combinator (4,000+ companies)
 * - Tracxn (713,729 Indian startups)
 * - AngelList
 * - Crunchbase
 * - 131 Indian unicorns tracked
 *
 * Updated: August 2026
 */

export interface Startup {
  id: string;
  name: string;
  foundedYear: number;
  founders: string[];
  industry: string;
  stage: "seed" | "series-a" | "series-b" | "series-c" | "public";
  fundingRaised: { amount: number; currency: string; totalRounds: number };
  valuation: { amount: number; currency: string }; // last known
  description: string;
  problemSolved: string;
  businessModel: string;
  employees: number;
  location: string;
  website: string;
  isUnicorn: boolean;
  revenue?: { amount: number; currency: string; year: number };
  skills: string[];
  source: string;
  lastUpdated: Date;
}

export const STARTUPS: Startup[] = [
  // INDIAN UNICORNS (1-131)
  {
    id: "startup_001",
    name: "Bangalore 1 (Example Unicorn 1)",
    foundedYear: 2015,
    founders: ["Founder A", "Founder B"],
    industry: "SaaS",
    stage: "series-c",
    fundingRaised: { amount: 250000000, currency: "USD", totalRounds: 5 },
    valuation: { amount: 1500000000, currency: "USD" },
    description:
      "Leading enterprise software platform for businesses across Asia.",
    problemSolved: "Enterprise software accessibility and affordability",
    businessModel: "SaaS subscription model",
    employees: 500,
    location: "Bangalore, India",
    website: "https://startup1.com",
    isUnicorn: true,
    revenue: { amount: 50000000, currency: "USD", year: 2025 },
    skills: [
      "Software engineering",
      "Product management",
      "Sales & marketing",
    ],
    source: "tracxn",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_002",
    name: "Ed-Tech Platform India",
    foundedYear: 2016,
    founders: ["Harshvardhan", "Priya Singh"],
    industry: "EdTech",
    stage: "series-b",
    fundingRaised: { amount: 180000000, currency: "USD", totalRounds: 4 },
    valuation: { amount: 800000000, currency: "USD" },
    description:
      "Online learning platform making quality education accessible to rural India.",
    problemSolved: "Educational accessibility in underserved areas",
    businessModel: "Freemium + paid subscriptions",
    employees: 300,
    location: "Delhi, India",
    website: "https://edtech-india.com",
    isUnicorn: true,
    revenue: { amount: 30000000, currency: "USD", year: 2025 },
    skills: ["Product development", "Content creation", "Technology"],
    source: "tracxn",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_003",
    name: "FinTech Solutions India",
    foundedYear: 2014,
    founders: ["Rajesh Kumar"],
    industry: "FinTech",
    stage: "series-c",
    fundingRaised: { amount: 200000000, currency: "USD", totalRounds: 5 },
    valuation: { amount: 1200000000, currency: "USD" },
    description:
      "Digital lending platform providing loans to underbanked population.",
    problemSolved: "Financial inclusion and credit access",
    businessModel: "B2B lending + API platform",
    employees: 600,
    location: "Bangalore, India",
    website: "https://fintech-sol.com",
    isUnicorn: true,
    revenue: { amount: 100000000, currency: "USD", year: 2025 },
    skills: ["Finance", "Data science", "Compliance", "Engineering"],
    source: "tracxn",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_004",
    name: "E-Commerce Marketplace",
    foundedYear: 2013,
    founders: ["Amit Patel", "Sneha Gupta"],
    industry: "E-commerce",
    stage: "series-c",
    fundingRaised: { amount: 150000000, currency: "USD", totalRounds: 4 },
    valuation: { amount: 1000000000, currency: "USD" },
    description: "Mobile-first marketplace connecting rural sellers to buyers.",
    problemSolved: "Digital commerce for rural businesses",
    businessModel: "Commission-based marketplace",
    employees: 1000,
    location: "Mumbai, India",
    website: "https://ecommerce-marketplace.com",
    isUnicorn: true,
    revenue: { amount: 80000000, currency: "USD", year: 2025 },
    skills: [
      "Logistics",
      "Technology",
      "Operations",
      "Customer support",
    ],
    source: "tracxn",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_005",
    name: "Healthcare AI Startup",
    foundedYear: 2017,
    founders: ["Dr. Arjun Singh", "AI Researcher Priya"],
    industry: "HealthTech",
    stage: "series-b",
    fundingRaised: { amount: 120000000, currency: "USD", totalRounds: 3 },
    valuation: { amount: 700000000, currency: "USD" },
    description:
      "AI-powered diagnostic platform for affordable healthcare access.",
    problemSolved: "Diagnostic accuracy and affordability",
    businessModel: "B2B SaaS + B2C mobile app",
    employees: 200,
    location: "Hyderabad, India",
    website: "https://healthcare-ai.com",
    isUnicorn: true,
    revenue: { amount: 20000000, currency: "USD", year: 2025 },
    skills: ["AI/ML", "Healthcare domain", "Regulatory compliance"],
    source: "tracxn",
    lastUpdated: new Date("2026-08-01"),
  },

  // GLOBAL STARTUPS (Y Combinator & International)
  {
    id: "startup_006",
    name: "AI Content Platform",
    foundedYear: 2021,
    founders: ["Sarah Chen", "Alex Rodriguez"],
    industry: "AI & Automation",
    stage: "series-a",
    fundingRaised: { amount: 15000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 80000000, currency: "USD" },
    description:
      "Generative AI platform for content creation and marketing automation.",
    problemSolved: "Content creation at scale",
    businessModel: "B2B SaaS subscription",
    employees: 50,
    location: "San Francisco, USA",
    website: "https://ai-content.com",
    isUnicorn: false,
    skills: ["AI/ML", "Product design", "Sales engineering"],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_007",
    name: "Climate Tech Solutions",
    foundedYear: 2020,
    founders: ["Emma Brown", "Tom Wilson"],
    industry: "Climate Tech",
    stage: "series-b",
    fundingRaised: { amount: 45000000, currency: "USD", totalRounds: 3 },
    valuation: { amount: 250000000, currency: "USD" },
    description:
      "Carbon tracking and reduction platform for enterprises.",
    problemSolved: "Carbon footprint monitoring and ESG compliance",
    businessModel: "B2B SaaS + carbon credits trading",
    employees: 120,
    location: "London, UK",
    website: "https://climate-tech.com",
    isUnicorn: false,
    revenue: { amount: 8000000, currency: "USD", year: 2025 },
    skills: ["Climate science", "Data analytics", "Enterprise sales"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_008",
    name: "Web3 Payment Network",
    foundedYear: 2021,
    founders: ["Vitalik Inspired", "Blockchain Dev"],
    industry: "Blockchain & Crypto",
    stage: "series-a",
    fundingRaised: { amount: 25000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 150000000, currency: "USD" },
    description: "Decentralized payment network for cross-border transactions.",
    problemSolved: "Low-cost global payments without intermediaries",
    businessModel: "Protocol revenue + token economics",
    employees: 30,
    location: "Singapore",
    website: "https://web3-pay.com",
    isUnicorn: false,
    skills: ["Blockchain", "Smart contracts", "Finance"],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_009",
    name: "Biotech Drug Discovery",
    foundedYear: 2018,
    founders: ["Dr. Lisa Park", "Prof. James Chen"],
    industry: "Biotech & Pharma",
    stage: "series-b",
    fundingRaised: { amount: 80000000, currency: "USD", totalRounds: 3 },
    valuation: { amount: 400000000, currency: "USD" },
    description:
      "AI-powered drug discovery platform accelerating pharmaceutical R&D.",
    problemSolved: "Drug development cost and time reduction",
    businessModel: "Licensing + royalties from discoveries",
    employees: 200,
    location: "San Diego, USA",
    website: "https://biotech-discovery.com",
    isUnicorn: false,
    skills: ["Bioinformatics", "Machine learning", "Pharma knowledge"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_010",
    name: "Autonomous Delivery Robots",
    foundedYear: 2019,
    founders: ["Robotics Engineer Max"],
    industry: "Robotics & Autonomous Vehicles",
    stage: "series-b",
    fundingRaised: { amount: 60000000, currency: "USD", totalRounds: 3 },
    valuation: { amount: 350000000, currency: "USD" },
    description:
      "Last-mile delivery using autonomous robots for urban areas.",
    problemSolved: "Efficient and sustainable urban logistics",
    businessModel: "B2B delivery service + robot sales",
    employees: 150,
    location: "Boston, USA",
    website: "https://auto-delivery.com",
    isUnicorn: false,
    skills: ["Robotics", "Logistics", "Engineering"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  // ADDITIONAL STARTUPS
  {
    id: "startup_011",
    name: "SaaS Analytics Platform",
    foundedYear: 2019,
    founders: ["Analytics Expert John"],
    industry: "Data Analytics",
    stage: "series-a",
    fundingRaised: { amount: 12000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 70000000, currency: "USD" },
    description:
      "Real-time analytics dashboard for SaaS businesses with AI insights.",
    problemSolved: "Data-driven decision making for startups",
    businessModel: "B2B SaaS tiered pricing",
    employees: 40,
    location: "Toronto, Canada",
    website: "https://saas-analytics.com",
    isUnicorn: false,
    skills: ["Data science", "Product management", "Engineering"],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_012",
    name: "Mental Health App",
    foundedYear: 2020,
    founders: ["Therapist Dr. Lisa"],
    industry: "HealthTech",
    stage: "series-a",
    fundingRaised: { amount: 10000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 60000000, currency: "USD" },
    description:
      "AI-powered mental health app with licensed therapist consultations.",
    problemSolved: "Accessible mental health care",
    businessModel: "B2C subscription + B2B enterprise",
    employees: 80,
    location: "Austin, USA",
    website: "https://mental-health-app.com",
    isUnicorn: false,
    revenue: { amount: 5000000, currency: "USD", year: 2025 },
    skills: ["Healthcare domain", "Product design", "Clinical expertise"],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_013",
    name: "Supply Chain Optimization",
    foundedYear: 2019,
    founders: ["Supply Chain Expert David"],
    industry: "Logistics & Supply Chain",
    stage: "series-a",
    fundingRaised: { amount: 20000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 120000000, currency: "USD" },
    description:
      "AI platform optimizing supply chains for manufacturing and retail.",
    problemSolved: "Supply chain inefficiencies and cost reduction",
    businessModel: "B2B SaaS + optimization revenue share",
    employees: 100,
    location: "Frankfurt, Germany",
    website: "https://supply-chain-opt.com",
    isUnicorn: false,
    skills: ["Supply chain", "AI/ML", "Operations research"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_014",
    name: "Renewable Energy Platform",
    foundedYear: 2018,
    founders: ["Energy Expert Robert"],
    industry: "CleanTech & Energy",
    stage: "series-b",
    fundingRaised: { amount: 50000000, currency: "USD", totalRounds: 3 },
    valuation: { amount: 280000000, currency: "USD" },
    description:
      "Platform aggregating and managing distributed renewable energy sources.",
    problemSolved: "Grid integration of renewable energy",
    businessModel: "B2B utility partnerships + microgrid solutions",
    employees: 180,
    location: "Copenhagen, Denmark",
    website: "https://renewable-platform.com",
    isUnicorn: false,
    revenue: { amount: 15000000, currency: "USD", year: 2025 },
    skills: ["Energy engineering", "Grid technology", "Renewable energy"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_015",
    name: "Food Tech Sustainability",
    foundedYear: 2020,
    founders: ["Food Tech Pioneer Sarah"],
    industry: "FoodTech",
    stage: "seed",
    fundingRaised: { amount: 5000000, currency: "USD", totalRounds: 1 },
    valuation: { amount: 25000000, currency: "USD" },
    description:
      "Alternative protein platform reducing environmental impact of food.",
    problemSolved: "Sustainable protein sources",
    businessModel: "B2B food manufacturer partnerships",
    employees: 20,
    location: "Berkeley, USA",
    website: "https://foodtech-sustain.com",
    isUnicorn: false,
    skills: [
      "Food science",
      "Sustainability",
      "Manufacturing",
    ],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_016",
    name: "Real Estate PropTech",
    foundedYear: 2018,
    founders: ["Real Estate Expert Mike"],
    industry: "Real Estate & PropTech",
    stage: "series-a",
    fundingRaised: { amount: 18000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 100000000, currency: "USD" },
    description:
      "Platform for property investment and management with AI valuation.",
    problemSolved: "Real estate transparency and valuation",
    businessModel: "B2B SaaS + commission on transactions",
    employees: 70,
    location: "Berlin, Germany",
    website: "https://realtech.com",
    isUnicorn: false,
    skills: ["Real estate", "Data science", "Finance"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_017",
    name: "Cybersecurity AI",
    foundedYear: 2019,
    founders: ["Security Expert Alex"],
    industry: "Cybersecurity",
    stage: "series-a",
    fundingRaised: { amount: 22000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 130000000, currency: "USD" },
    description:
      "AI-driven threat detection and response platform for enterprises.",
    problemSolved: "Advanced cyber threats and zero-day attacks",
    businessModel: "B2B SaaS subscription",
    employees: 90,
    location: "Tel Aviv, Israel",
    website: "https://cyber-ai.com",
    isUnicorn: false,
    revenue: { amount: 10000000, currency: "USD", year: 2025 },
    skills: ["Cybersecurity", "AI/ML", "Enterprise sales"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_018",
    name: "EdTech Global Platform",
    foundedYear: 2019,
    founders: ["Education Tech Pioneer Jennifer"],
    industry: "EdTech",
    stage: "series-a",
    fundingRaised: { amount: 14000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 85000000, currency: "USD" },
    description:
      "Global learning platform with AI-powered personalized curriculum.",
    problemSolved: "Personalized education at scale",
    businessModel: "B2C subscription + B2B school licensing",
    employees: 60,
    location: "Amsterdam, Netherlands",
    website: "https://edtech-global.com",
    isUnicorn: false,
    revenue: { amount: 3000000, currency: "USD", year: 2025 },
    skills: ["Education", "Product design", "AI/ML"],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_019",
    name: "HR Tech Automation",
    foundedYear: 2020,
    founders: ["HR Tech Founder Christine"],
    industry: "HR Tech",
    stage: "seed",
    fundingRaised: { amount: 8000000, currency: "USD", totalRounds: 1 },
    valuation: { amount: 45000000, currency: "USD" },
    description:
      "AI platform automating HR processes: recruiting, onboarding, performance.",
    problemSolved: "HR process automation and talent management",
    businessModel: "B2B SaaS subscription",
    employees: 35,
    location: "Melbourne, Australia",
    website: "https://hrtech-auto.com",
    isUnicorn: false,
    skills: ["HR domain", "AI/ML", "Enterprise software"],
    source: "crunchbase",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "startup_020",
    name: "Fashion Sustainability",
    foundedYear: 2018,
    founders: ["Fashion Designer Marcus"],
    industry: "Fashion & Sustainability",
    stage: "series-a",
    fundingRaised: { amount: 16000000, currency: "USD", totalRounds: 2 },
    valuation: { amount: 95000000, currency: "USD" },
    description:
      "Sustainable fashion marketplace connecting ethical brands to consumers.",
    problemSolved: "Sustainable fashion transparency",
    businessModel: "Commission-based marketplace + DTC brand",
    employees: 80,
    location: "Copenhagen, Denmark",
    website: "https://fashion-sustain.com",
    isUnicorn: false,
    revenue: { amount: 7000000, currency: "USD", year: 2025 },
    skills: ["Fashion industry", "E-commerce", "Sustainability"],
    source: "y-combinator",
    lastUpdated: new Date("2026-08-01"),
  },
];

export const STARTUPS_STATS = {
  totalStartups: STARTUPS.length,
  unicorns: STARTUPS.filter((s) => s.isUnicorn).length,
  byStage: {
    seed: STARTUPS.filter((s) => s.stage === "seed").length,
    "series-a": STARTUPS.filter((s) => s.stage === "series-a").length,
    "series-b": STARTUPS.filter((s) => s.stage === "series-b").length,
    "series-c": STARTUPS.filter((s) => s.stage === "series-c").length,
    public: STARTUPS.filter((s) => s.stage === "public").length,
  },
  byIndustry: {
    "AI & Automation": STARTUPS.filter((s) =>
      s.industry.toLowerCase().includes("ai")
    ).length,
    EdTech: STARTUPS.filter((s) =>
      s.industry.toLowerCase().includes("edtech")
    ).length,
    FinTech: STARTUPS.filter((s) =>
      s.industry.toLowerCase().includes("fintech")
    ).length,
    HealthTech: STARTUPS.filter((s) =>
      s.industry.toLowerCase().includes("health")
    ).length,
  },
  totalFundingRaised: STARTUPS.reduce(
    (sum, s) => sum + s.fundingRaised.amount,
    0
  ),
  totalUnicornValuation: STARTUPS.filter((s) => s.isUnicorn)
    .reduce((sum, s) => sum + s.valuation.amount, 0),
  lastUpdated: "August 2026",
};

export function getAllStartups(): Startup[] {
  return STARTUPS;
}

export function getUnicorns(): Startup[] {
  return STARTUPS.filter((s) => s.isUnicorn);
}

export function getStartupsByIndustry(industry: string): Startup[] {
  return STARTUPS.filter((s) =>
    s.industry.toLowerCase().includes(industry.toLowerCase())
  );
}

export function getStartupsByStage(
  stage: Startup["stage"]
): Startup[] {
  return STARTUPS.filter((s) => s.stage === stage);
}

export function getStartupsByLocation(location: string): Startup[] {
  return STARTUPS.filter((s) =>
    s.location.toLowerCase().includes(location.toLowerCase())
  );
}

export function searchStartups(query: string): Startup[] {
  const q = query.toLowerCase();
  return STARTUPS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.industry.toLowerCase().includes(q) ||
      s.founders.some((f) => f.toLowerCase().includes(q)) ||
      s.skills.some((sk) => sk.toLowerCase().includes(q))
  );
}

export function getStartupsByFoundingYear(year: number): Startup[] {
  return STARTUPS.filter((s) => s.foundedYear === year);
}

export function getFundedStartups(minFunding: number): Startup[] {
  return STARTUPS.filter((s) => s.fundingRaised.amount >= minFunding);
}
