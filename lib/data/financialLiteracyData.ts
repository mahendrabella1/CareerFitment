/**
 * Financial Literacy Database
 * 30+ topics covering money management, investing, markets
 *
 * Sources:
 * - NSE (National Stock Exchange) educational resources
 * - BSE FinX - financial education from Bombay Stock Exchange
 * - NISM (National Institute of Securities Market)
 * - RBI (Reserve Bank of India) resources
 * - Government financial awareness programs
 *
 * Updated: August 2026
 */

export interface FinancialTopic {
  id: string;
  title: string;
  category: "basics" | "banking" | "investing" | "markets" | "taxes" | "planning";
  description: string;
  duration: string; // e.g., "15 mins", "1 hour"
  difficulty: "beginner" | "intermediate" | "advanced";
  keyLearnings: string[];
  resources: {
    title: string;
    type: "article" | "video" | "interactive" | "podcast";
    provider: string;
    url: string;
    free: boolean;
  }[];
  relevantForClass: number[];
  source: string;
  lastUpdated: Date;
}

export const FINANCIAL_TOPICS: FinancialTopic[] = [
  // BASICS (Money Fundamentals)
  {
    id: "finance_001",
    title: "Money Basics: History and Evolution",
    category: "basics",
    description:
      "Understand what money is, how it evolved from barter to digital currencies, and its role in modern economies.",
    duration: "20 mins",
    difficulty: "beginner",
    keyLearnings: [
      "What is money and its functions",
      "Evolution from barter to digital",
      "Types of money: fiat, commodity, cryptocurrency",
      "Money supply and inflation basics",
    ],
    resources: [
      {
        title: "Money Basics for Teens",
        type: "video",
        provider: "Khan Academy",
        url: "https://www.khanacademy.org/economics-finance-domain/finance-and-capital-markets",
        free: true,
      },
      {
        title: "RBI Monetary Basics",
        type: "article",
        provider: "Reserve Bank of India",
        url: "https://www.rbi.org.in/",
        free: true,
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government-education",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_002",
    title: "Budgeting: Plan Your Money",
    category: "basics",
    description:
      "Learn to create a personal budget, track expenses, and manage your pocket money effectively.",
    duration: "30 mins",
    difficulty: "beginner",
    keyLearnings: [
      "Creating a budget: income vs expenses",
      "Tracking expenses and identifying spending patterns",
      "Budget categories: needs vs wants",
      "Tools and apps for budgeting",
      "Adjusting budget when needed",
    ],
    resources: [
      {
        title: "50/30/20 Budget Rule",
        type: "article",
        provider: "NSE Educational",
        url: "https://www.nseindia.com/",
        free: true,
      },
      {
        title: "Personal Budget Calculator",
        type: "interactive",
        provider: "Mint India",
        url: "https://www.mintindia.com/",
        free: true,
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_003",
    title: "Saving Strategies: Build Your Wealth",
    category: "basics",
    description:
      "Understand different saving methods, emergency funds, and short/long-term savings goals.",
    duration: "25 mins",
    difficulty: "beginner",
    keyLearnings: [
      "Emergency fund importance (3-6 months expenses)",
      "Savings accounts and interest rates",
      "High-yield savings alternatives",
      "Automatic savings methods",
      "Saving vs investing",
    ],
    resources: [
      {
        title: "Building Your Emergency Fund",
        type: "article",
        provider: "BSE FinX",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [10, 11, 12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  // BANKING (Banking Systems & Products)
  {
    id: "finance_004",
    title: "Banking Basics: Accounts and Services",
    category: "banking",
    description:
      "Learn about different bank account types, services, and how to open and manage your first account.",
    duration: "20 mins",
    difficulty: "beginner",
    keyLearnings: [
      "Types of accounts: savings, current, recurring",
      "Debit vs credit cards",
      "Digital banking: app, online, UPI",
      "Bank charges and fees",
      "Account security and passwords",
    ],
    resources: [
      {
        title: "Banking 101 for Youth",
        type: "video",
        provider: "RBI Financial Education",
        url: "https://www.rbi.org.in/",
        free: true,
      },
      {
        title: "UPI and Digital Payments",
        type: "article",
        provider: "NPCI",
        url: "https://www.npci.org.in/",
        free: true,
      },
    ],
    relevantForClass: [10, 11, 12],
    source: "government-bank",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_005",
    title: "Interest Rates: Simple vs Compound",
    category: "banking",
    description:
      "Understand how interest works, the power of compound interest, and how it affects your savings and loans.",
    duration: "30 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "Simple interest formula and calculation",
      "Compound interest and compounding frequency",
      "The power of compounding over time",
      "APR (Annual Percentage Rate)",
      "Real interest vs nominal interest",
      "Impact on savings and loans",
    ],
    resources: [
      {
        title: "Compound Interest Calculator",
        type: "interactive",
        provider: "Khan Academy",
        url: "https://www.khanacademy.org/",
        free: true,
      },
      {
        title: "Einstein's Favorite Formula",
        type: "article",
        provider: "BSE FinX",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [11, 12],
    source: "educational-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_006",
    title: "Inflation & Its Impact",
    category: "banking",
    description:
      "Learn how inflation works, its causes, and how it affects your purchasing power and savings.",
    duration: "20 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What is inflation and CPI (Consumer Price Index)",
      "Causes of inflation",
      "Impact on purchasing power",
      "Rupee depreciation",
      "Real returns vs nominal returns",
      "RBI monetary policy",
    ],
    resources: [
      {
        title: "Understanding Inflation",
        type: "article",
        provider: "RBI",
        url: "https://www.rbi.org.in/",
        free: true,
      },
    ],
    relevantForClass: [11, 12],
    source: "government-bank",
    lastUpdated: new Date("2026-08-01"),
  },

  // INVESTING (Investment Basics)
  {
    id: "finance_007",
    title: "Stock Market Basics: Stocks & Shares",
    category: "investing",
    description:
      "Understand what stocks are, how stock markets work, and the basics of stock trading.",
    duration: "35 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What are stocks and shares",
      "Stock exchanges: NSE and BSE",
      "How to read stock prices",
      "Market indices: Nifty and Sensex",
      "IPO (Initial Public Offering)",
      "Market capitalization",
    ],
    resources: [
      {
        title: "Stock Market 101",
        type: "video",
        provider: "NSE Academy",
        url: "https://www.nseindia.com/",
        free: true,
      },
      {
        title: "Understanding Nifty 50",
        type: "interactive",
        provider: "NSE",
        url: "https://www.nseindia.com/",
        free: true,
      },
      {
        title: "Sensex Explained",
        type: "article",
        provider: "BSE",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [11, 12],
    source: "exchange",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_008",
    title: "Mutual Funds: Collective Investing",
    category: "investing",
    description:
      "Learn how mutual funds work, different types, and why they're popular for beginner investors.",
    duration: "30 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What are mutual funds",
      "Active vs passive funds",
      "Fund types: equity, debt, hybrid, liquid",
      "NAV (Net Asset Value)",
      "Expense ratio and charges",
      "Benefits of diversification",
    ],
    resources: [
      {
        title: "Mutual Funds for Beginners",
        type: "article",
        provider: "AMFI",
        url: "https://www.amfiindia.com/",
        free: true,
      },
      {
        title: "Fund Selection Guide",
        type: "interactive",
        provider: "Value Research",
        url: "https://www.valueresearch.org/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_009",
    title: "SIPs: Invest Regularly with Small Amounts",
    category: "investing",
    description:
      "Understand Systematic Investment Plans (SIPs) and how they make investing accessible for everyone.",
    duration: "20 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What is SIP (Systematic Investment Plan)",
      "Benefits of rupee cost averaging",
      "Starting SIP with small amounts (₹100+)",
      "SIP vs lump sum investing",
      "Power of compounding with SIPs",
    ],
    resources: [
      {
        title: "SIP Calculator",
        type: "interactive",
        provider: "AMFI",
        url: "https://www.amfiindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_010",
    title: "Bonds & Fixed Income Securities",
    category: "investing",
    description:
      "Learn about government and corporate bonds, and how they provide steady returns with lower risk.",
    duration: "25 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What are bonds and how they work",
      "Government securities (G-Secs)",
      "Corporate bonds",
      "Bond coupon and yield",
      "Credit rating and risk",
      "Tax-saving bonds",
    ],
    resources: [
      {
        title: "Government Securities Guide",
        type: "article",
        provider: "RBI",
        url: "https://www.rbi.org.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "government-bank",
    lastUpdated: new Date("2026-08-01"),
  },

  // MARKETS & ANALYSIS
  {
    id: "finance_011",
    title: "Market Indices: Nifty & Sensex Explained",
    category: "markets",
    description:
      "Understand India's major market indices and what they tell us about the economy.",
    duration: "20 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "Sensex: BSE's 30-share index",
      "Nifty 50: NSE's top 50 companies",
      "Nifty Bank, IT, Pharma sectors",
      "Market movements and corrections",
      "Using indices for market analysis",
    ],
    resources: [
      {
        title: "Nifty 50 Overview",
        type: "interactive",
        provider: "NSE",
        url: "https://www.nseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "exchange",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_012",
    title: "Reading Financial News & Making Decisions",
    category: "markets",
    description:
      "Learn how to read financial news, understand market reports, and make informed decisions.",
    duration: "30 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "Key financial news sources",
      "Understanding quarterly results",
      "P/E ratio and valuation metrics",
      "Market sentiment indicators",
      "Avoiding emotional decisions",
      "Research before investing",
    ],
    resources: [
      {
        title: "Financial News Literacy",
        type: "article",
        provider: "BSE FinX",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  // RISK & DIVERSIFICATION
  {
    id: "finance_013",
    title: "Risk & Diversification: Don't Put All Eggs in One Basket",
    category: "investing",
    description:
      "Understand different types of investment risk and how diversification helps reduce it.",
    duration: "25 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "Types of risk: market, credit, inflation, liquidity",
      "Risk vs return trade-off",
      "Portfolio diversification",
      "Asset allocation by age",
      "Rebalancing portfolio",
    ],
    resources: [
      {
        title: "Portfolio Construction Guide",
        type: "article",
        provider: "NISM",
        url: "https://www.nism.org/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },

  // TAXES & PLANNING
  {
    id: "finance_014",
    title: "Income Tax Basics: File Your Returns",
    category: "taxes",
    description:
      "Understand income tax, filing returns, and legal ways to reduce your tax burden.",
    duration: "30 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What is income tax and tax slabs",
      "Taxable vs non-taxable income",
      "Filing income tax return (ITR)",
      "Deductions and exemptions (Section 80C, 80D)",
      "TDS (Tax Deducted at Source)",
      "ITR forms: 1, 2, 3, 4",
    ],
    resources: [
      {
        title: "Income Tax Guide for Youth",
        type: "article",
        provider: "Income Tax Department",
        url: "https://www.incometaxindia.gov.in/",
        free: true,
      },
      {
        title: "ITR Filing Process",
        type: "video",
        provider: "e-Kranti",
        url: "https://www.incometaxindia.gov.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_015",
    title: "Tax-Saving Investments: 80C & Beyond",
    category: "taxes",
    description:
      "Learn about investments that provide tax benefits and help you save money legally.",
    duration: "25 mins",
    difficulty: "advanced",
    keyLearnings: [
      "Section 80C: ELSS, EPF, LIC, NSC",
      "ELSS (Equity Linked Saving Scheme)",
      "PPF (Public Provident Fund)",
      "Section 80D: Health Insurance",
      "Section 80E: Education Loan Interest",
      "Tax planning checklist",
    ],
    resources: [
      {
        title: "80C Investment Options",
        type: "article",
        provider: "Income Tax",
        url: "https://www.incometaxindia.gov.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // INSURANCE & PROTECTION
  {
    id: "finance_016",
    title: "Insurance Basics: Protect Your Future",
    category: "planning",
    description:
      "Understand health, life, and other insurance and why it's important for financial security.",
    duration: "30 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What is insurance and risk transfer",
      "Health insurance: coverage and claims",
      "Life insurance: term vs endowment",
      "Insurance premiums and claims",
      "No-claim bonus",
      "Insurance policy documents",
    ],
    resources: [
      {
        title: "Insurance Essentials",
        type: "article",
        provider: "IRDA",
        url: "https://www.irdai.gov.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "regulator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_017",
    title: "Health Insurance: Coverage You Need to Know",
    category: "planning",
    description:
      "Deep dive into health insurance, coverage types, and how to choose the right plan.",
    duration: "25 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "Types: individual, family, group plans",
      "Coverage: hospitalization, daycare, pre/post",
      "Sum insured and deductibles",
      "Cashless vs reimbursement",
      "Network hospitals",
      "AYUSH coverage",
    ],
    resources: [
      {
        title: "Health Insurance Guide",
        type: "article",
        provider: "IRDAI",
        url: "https://www.irdai.gov.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "regulator",
    lastUpdated: new Date("2026-08-01"),
  },

  // RETIREMENT PLANNING
  {
    id: "finance_018",
    title: "Retirement Planning: Think Long Term",
    category: "planning",
    description:
      "Start thinking about retirement early. Learn how time and compounding work in your favor.",
    duration: "30 mins",
    difficulty: "advanced",
    keyLearnings: [
      "Why start early: time value of money",
      "Calculating retirement needs",
      "EPF, NPS, and pension schemes",
      "Retirement corpus calculation",
      "Investment allocation by age",
      "Inflation impact on retirement",
    ],
    resources: [
      {
        title: "NPS: National Pension System",
        type: "article",
        provider: "PFRDA",
        url: "https://www.pfrda.org.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // LOANS & CREDIT
  {
    id: "finance_019",
    title: "Credit Score: Your Financial Report Card",
    category: "planning",
    description:
      "Understand credit scores, credit reports, and how they affect your financial future.",
    duration: "20 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "What is CIBIL score (300-900)",
      "Factors affecting credit score",
      "Credit report checking",
      "Improving low scores",
      "Impact on loan approval",
      "Impact on interest rates",
    ],
    resources: [
      {
        title: "Check Your Credit Score",
        type: "interactive",
        provider: "CIBIL",
        url: "https://www.cibil.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "financial-bureau",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_020",
    title: "Loans: When to Borrow and How",
    category: "planning",
    description:
      "Learn about different types of loans, EMI calculations, and responsible borrowing.",
    duration: "25 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "Loan types: personal, auto, home, education",
      "EMI (Equated Monthly Installment)",
      "Principal vs interest",
      "APR and effective rate",
      "Loan terms and conditions",
      "Early repayment benefits",
    ],
    resources: [
      {
        title: "EMI Calculator",
        type: "interactive",
        provider: "RBI",
        url: "https://www.rbi.org.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "government-bank",
    lastUpdated: new Date("2026-08-01"),
  },

  // ADVANCED TOPICS
  {
    id: "finance_021",
    title: "IPO: Investing in New Companies",
    category: "markets",
    description:
      "Understand IPOs (Initial Public Offerings) and how to participate in new company listings.",
    duration: "25 mins",
    difficulty: "advanced",
    keyLearnings: [
      "What is an IPO",
      "IPO timeline and process",
      "Pricing bands and bidding",
      "Allotment and trading",
      "Analyzing IPO prospectus",
      "IPO vs primary vs secondary market",
    ],
    resources: [
      {
        title: "NSE IPO Guide",
        type: "article",
        provider: "NSE",
        url: "https://www.nseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "exchange",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_022",
    title: "Cryptocurrencies: Digital Money Explained",
    category: "investing",
    description:
      "Understand cryptocurrencies, blockchain technology, and the risks involved.",
    duration: "30 mins",
    difficulty: "advanced",
    keyLearnings: [
      "What is blockchain technology",
      "Bitcoin and major cryptocurrencies",
      "Mining and wallets",
      "Crypto exchanges",
      "Regulatory status in India",
      "High risk and volatility",
      "Scams and security",
    ],
    resources: [
      {
        title: "Crypto Basics Explained",
        type: "article",
        provider: "Khan Academy",
        url: "https://www.khanacademy.org/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "educational-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_023",
    title: "Personal Finance Planning: Your Money Blueprint",
    category: "planning",
    description:
      "Create a comprehensive personal finance plan covering income, expenses, saving, investing, and protection.",
    duration: "45 mins",
    difficulty: "advanced",
    keyLearnings: [
      "Financial goals: short, medium, long term",
      "Income sources and growth",
      "Expense tracking and optimization",
      "Emergency fund importance",
      "Investing strategy by goal",
      "Regular review and rebalancing",
      "Financial independence journey",
    ],
    resources: [
      {
        title: "Financial Planning Framework",
        type: "article",
        provider: "BSE FinX",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_024",
    title: "Economic Indicators & Market Cycles",
    category: "markets",
    description:
      "Understand economic indicators that drive markets and how to spot bull and bear markets.",
    duration: "30 mins",
    difficulty: "advanced",
    keyLearnings: [
      "GDP, inflation, interest rates",
      "RBI policy rate and impact",
      "Market cycles: bull, bear, sideways",
      "Technical vs fundamental analysis",
      "Market correction vs crash",
      "Predicting market trends",
    ],
    resources: [
      {
        title: "Economics and Markets",
        type: "article",
        provider: "RBI",
        url: "https://www.rbi.org.in/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "government-bank",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_025",
    title: "Investment Scams & Protection",
    category: "planning",
    description:
      "Learn to identify investment scams, red flags, and how to protect your money.",
    duration: "20 mins",
    difficulty: "beginner",
    keyLearnings: [
      "Common scams: Ponzi, fake tips, pump & dump",
      "Red flags in investment offers",
      "Verification: SEBI registered advisors",
      "Protecting your data online",
      "Complaint procedures",
      "Cyber security best practices",
    ],
    resources: [
      {
        title: "SEBI Investor Protection",
        type: "article",
        provider: "SEBI",
        url: "https://www.sebi.gov.in/",
        free: true,
      },
      {
        title: "Report Financial Fraud",
        type: "interactive",
        provider: "SEBI",
        url: "https://www.sebi.gov.in/",
        free: true,
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "regulator",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_026",
    title: "Green Investing: Sustainable Finance",
    category: "investing",
    description:
      "Learn about ESG investing, sustainable funds, and making money with impact.",
    duration: "25 mins",
    difficulty: "intermediate",
    keyLearnings: [
      "ESG: Environmental, Social, Governance",
      "Sustainable and green funds",
      "Impact investing",
      "Corporate sustainability ratings",
      "Avoiding harmful businesses",
      "Green bonds",
    ],
    resources: [
      {
        title: "ESG Investing Guide",
        type: "article",
        provider: "BSE",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "exchange",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_027",
    title: "Financial Independence & FIRE Movement",
    category: "planning",
    description:
      "Understand the FIRE (Financial Independence, Retire Early) movement and strategies to achieve it.",
    duration: "30 mins",
    difficulty: "advanced",
    keyLearnings: [
      "FIRE principles and 4% rule",
      "Calculating FI number",
      "High savings rate",
      "Investment returns needed",
      "Geographic arbitrage",
      "Passive income sources",
    ],
    resources: [
      {
        title: "Path to Financial Independence",
        type: "article",
        provider: "NSE",
        url: "https://www.nseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "educational-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_028",
    title: "Behavioral Finance: Psychology of Money",
    category: "planning",
    description:
      "Understand common psychological biases that affect financial decisions.",
    duration: "25 mins",
    difficulty: "advanced",
    keyLearnings: [
      "Emotional investing pitfalls",
      "Overconfidence and FOMO",
      "Anchoring bias",
      "Herd mentality in markets",
      "Loss aversion",
      "Staying rational with money",
    ],
    resources: [
      {
        title: "Investment Psychology",
        type: "article",
        provider: "BSE FinX",
        url: "https://www.bseindia.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "financial-platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_029",
    title: "Real Estate Investing: Property as Investment",
    category: "investing",
    description:
      "Learn about real estate as an investment, rental income, and property analysis.",
    duration: "30 mins",
    difficulty: "advanced",
    keyLearnings: [
      "Real estate fundamentals",
      "Buying properties: process and costs",
      "Rental income and yields",
      "Property appreciation",
      "Real estate investment trusts (REITs)",
      "Tax implications",
    ],
    resources: [
      {
        title: "Real Estate 101",
        type: "article",
        provider: "Housing.com",
        url: "https://housing.com/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "platform",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "finance_030",
    title: "Passive Income: Make Money While You Sleep",
    category: "planning",
    description:
      "Explore various sources of passive income and how to build them.",
    duration: "30 mins",
    difficulty: "advanced",
    keyLearnings: [
      "Dividend income from stocks",
      "Interest from bonds and savings",
      "Rental income",
      "Royalties and licensing",
      "Affiliate marketing",
      "Creating digital products",
      "Building passive income gradually",
    ],
    resources: [
      {
        title: "Passive Income Strategies",
        type: "article",
        provider: "NISM",
        url: "https://www.nism.org/",
        free: true,
      },
    ],
    relevantForClass: [12],
    source: "institute",
    lastUpdated: new Date("2026-08-01"),
  },
];

export const FINANCIAL_STATS = {
  totalTopics: FINANCIAL_TOPICS.length,
  categories: {
    basics: FINANCIAL_TOPICS.filter((t) => t.category === "basics").length,
    banking: FINANCIAL_TOPICS.filter((t) => t.category === "banking").length,
    investing: FINANCIAL_TOPICS.filter((t) => t.category === "investing").length,
    markets: FINANCIAL_TOPICS.filter((t) => t.category === "markets").length,
    taxes: FINANCIAL_TOPICS.filter((t) => t.category === "taxes").length,
    planning: FINANCIAL_TOPICS.filter((t) => t.category === "planning").length,
  },
  difficultyLevels: {
    beginner: FINANCIAL_TOPICS.filter((t) => t.difficulty === "beginner").length,
    intermediate: FINANCIAL_TOPICS.filter((t) => t.difficulty === "intermediate")
      .length,
    advanced: FINANCIAL_TOPICS.filter((t) => t.difficulty === "advanced").length,
  },
  lastUpdated: "August 2026",
};

export function getFinancialTopics(): FinancialTopic[] {
  return FINANCIAL_TOPICS;
}

export function getTopicsByCategory(
  category: FinancialTopic["category"]
): FinancialTopic[] {
  return FINANCIAL_TOPICS.filter((t) => t.category === category);
}

export function searchFinancialTopics(query: string): FinancialTopic[] {
  const q = query.toLowerCase();
  return FINANCIAL_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keyLearnings.some((k) => k.toLowerCase().includes(q))
  );
}

export function getTopicsByDifficulty(
  difficulty: FinancialTopic["difficulty"]
): FinancialTopic[] {
  return FINANCIAL_TOPICS.filter((t) => t.difficulty === difficulty);
}

export function getTopicsForClass(classNumber: number): FinancialTopic[] {
  return FINANCIAL_TOPICS.filter((t) =>
    t.relevantForClass.includes(classNumber)
  );
}
