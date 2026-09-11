/**
 * Internship & Learning Platforms - Complete List
 * Includes free virtual internships, hands-on labs, and skill certifications
 * All programs are 100% free, self-paced unless otherwise noted
 */

export interface InternshipProgram {
  company: string;
  title: string;
  url: string;
  category: string;
  type?: string;
  platform?: "forage" | "aws" | "cisco" | "salesforce" | "oracle" | "google" | "other";
}

export const INTERNSHIP_PROGRAMS: InternshipProgram[] = [
  // Cloud & Infrastructure Platforms
  { company: "AWS", title: "AWS Educate", url: "https://aws.amazon.com/education/awseducate/", category: "Cloud Computing", type: "Self-paced", platform: "aws" },
  { company: "AWS", title: "AWS Skill Builder", url: "https://skillbuilder.aws/", category: "Cloud Computing", type: "Self-paced", platform: "aws" },
  { company: "Google Cloud", title: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google/", category: "Cloud Computing", type: "Self-paced", platform: "google" },
  { company: "Oracle", title: "Oracle Academy", url: "https://academy.oracle.com/", category: "Database & Backend", type: "Self-paced", platform: "oracle" },

  // Networking & Security
  { company: "Cisco", title: "Networking Academy - Networking", url: "https://www.netacad.com/", category: "Networking", type: "Self-paced", platform: "cisco" },
  { company: "Cisco", title: "Networking Academy - Cybersecurity", url: "https://www.netacad.com/", category: "Security", type: "Self-paced", platform: "cisco" },
  { company: "Cisco", title: "Networking Academy - Python", url: "https://www.netacad.com/", category: "Programming", type: "Self-paced", platform: "cisco" },
  { company: "Cisco", title: "Networking Academy - Data Analytics", url: "https://www.netacad.com/", category: "Data Science", type: "Self-paced", platform: "cisco" },
  { company: "Cisco", title: "Networking Academy - AI", url: "https://www.netacad.com/", category: "AI", type: "Self-paced", platform: "cisco" },

  // CRM & Business Platforms
  { company: "Salesforce", title: "Trailhead - CRM Fundamentals", url: "https://trailhead.salesforce.com/", category: "Business", type: "Self-paced", platform: "salesforce" },
  { company: "Salesforce", title: "Trailhead - Admin", url: "https://trailhead.salesforce.com/", category: "Business", type: "Self-paced", platform: "salesforce" },
  { company: "Salesforce", title: "Trailhead - Automation", url: "https://trailhead.salesforce.com/", category: "Business", type: "Self-paced", platform: "salesforce" },
  { company: "Salesforce", title: "Trailhead - AI & Analytics", url: "https://trailhead.salesforce.com/", category: "Business", type: "Self-paced", platform: "salesforce" },

  // Virtual Internships & Forage Simulations
  { company: "Forage", title: "Forage - Virtual Internships", url: "https://www.theforage.com/", category: "Tech", type: "Virtual Internship", platform: "forage" },

  // Tech / Software Engineering / Data / AI
  { company: "Walmart", title: "Advanced Software Engineering", url: "https://www.theforage.com/simulations/walmart/software-engineering-fceb", category: "Tech", type: "Software Engineering" },
  { company: "Wells Fargo", title: "Software Engineering", url: "https://www.theforage.com/simulations/wells-fargo/software-engineering-nkq4", category: "Tech", type: "Software Engineering" },
  { company: "Commonwealth Bank", title: "Software Engineering", url: "https://www.theforage.com/simulations/commonwealth-bank/software-engineering-c4hw", category: "Tech", type: "Software Engineering" },
  { company: "Commonwealth Bank", title: "Intro Software Engineering", url: "https://www.theforage.com/simulations/commonwealth-bank/intro-software-engineering-m2ma", category: "Tech", type: "Software Engineering" },
  { company: "Commonwealth Bank", title: "Tech Explorer", url: "https://www.theforage.com/simulations/commonwealth-bank/tech-explorer-jrnj", category: "Tech", type: "Exploration" },
  { company: "Commonwealth Bank", title: "Intro Data Science", url: "https://www.theforage.com/simulations/commonwealth-bank/intro-data-science-sd7t", category: "Tech", type: "Data Science" },
  { company: "Commonwealth Bank", title: "Intro Cybersecurity", url: "https://www.theforage.com/simulations/commonwealth-bank/intro-cybersecurity-rdxl", category: "Tech", type: "Security" },
  { company: "Citi", title: "Software Development", url: "https://www.theforage.com/simulations/citi/software-development-dlxt", category: "Tech", type: "Software Engineering" },
  { company: "Skyscanner", title: "Software Engineering", url: "https://www.theforage.com/simulations/skyscanner/software-engineering-cm01", category: "Tech", type: "Software Engineering" },
  { company: "Skyscanner", title: "Front-End Software Engineering", url: "https://www.theforage.com/simulations/skyscanner/front-end-software-engineering-cbwl", category: "Tech", type: "Software Engineering" },
  { company: "Hewlett Packard Enterprise", title: "Software Engineering", url: "https://www.theforage.com/simulations/hewlett-packard-enterprise/software-engineering-pcij", category: "Tech", type: "Software Engineering" },
  { company: "Hewlett Packard Enterprise", title: "Presales", url: "https://www.theforage.com/simulations/hewlett-packard-enterprise/presales-hp1a", category: "Tech", type: "Sales" },
  { company: "Hewlett Packard Enterprise", title: "Digital Sales", url: "https://www.theforage.com/simulations/hewlett-packard-enterprise/digital-sales-mmkg", category: "Tech", type: "Sales" },
  { company: "Blackbird", title: "Software Engineering", url: "https://www.theforage.com/simulations/blackbird/software-engineering-4mt9", category: "Tech", type: "Software Engineering" },
  { company: "Datacom", title: "Software Development", url: "https://www.theforage.com/simulations/datacom/software-development-l47g", category: "Tech", type: "Software Engineering" },
  { company: "Datacom", title: "Intro Cloud", url: "https://www.theforage.com/simulations/datacom/intro-cloud-yfvk", category: "Tech", type: "Cloud Computing" },
  { company: "Datacom", title: "Automation", url: "https://www.theforage.com/simulations/datacom/automation-zn3l", category: "Tech", type: "DevOps" },
  { company: "Datacom", title: "Cybersecurity", url: "https://www.theforage.com/simulations/datacom/cybersecurity-zm6d", category: "Tech", type: "Security" },
  { company: "Datacom", title: "Service Desk", url: "https://www.theforage.com/simulations/datacom/service-desk-hoq5", category: "Tech", type: "IT Support" },
  { company: "Datacom", title: "Partnering with AI in the Workplace", url: "https://www.theforage.com/simulations/datacom/partnering-with-ai-in-the-workplace-khv2", category: "Tech", type: "AI" },
  { company: "BCG", title: "Data Science", url: "https://www.theforage.com/simulations/bcg/data-science-ccdz", category: "Tech", type: "Data Science" },
  { company: "BCG", title: "Gen AI", url: "https://www.theforage.com/simulations/bcg/gen-ai-anlo", category: "Tech", type: "AI" },
  { company: "BCG", title: "IT Architect", url: "https://www.theforage.com/simulations/bcg/it-architect-wjf1", category: "Tech", type: "Architecture" },
  { company: "BCG", title: "Data for Decision Makers", url: "https://www.theforage.com/simulations/bcg/data-for-decision-makers-tod0", category: "Tech", type: "Data Science" },
  { company: "BCG", title: "Digital Transformation", url: "https://www.theforage.com/simulations/bcg/digital-transformation-pk18", category: "Tech", type: "Consulting" },
  { company: "Tata", title: "Data Visualisation", url: "https://www.theforage.com/simulations/tata/data-visualisation-p5xo", category: "Tech", type: "Data Science" },
  { company: "Tata", title: "Data Analytics", url: "https://www.theforage.com/simulations/tata/data-analytics-t3zr", category: "Tech", type: "Data Science" },
  { company: "Tata", title: "Cybersecurity", url: "https://www.theforage.com/simulations/tata/cybersecurity-sbda", category: "Tech", type: "Security" },
  { company: "Tata", title: "ESG", url: "https://www.theforage.com/simulations/tata/esg-j4vw", category: "Tech", type: "Sustainability" },
  { company: "British Airways", title: "Data Science", url: "https://www.theforage.com/simulations/british-airways/data-science-yqoz", category: "Tech", type: "Data Science" },
  { company: "British Airways", title: "Engineering", url: "https://www.theforage.com/simulations/british-airways/engineering-y2tt", category: "Tech", type: "Engineering" },
  { company: "Mastercard", title: "Cybersecurity", url: "https://www.theforage.com/simulations/mastercard/cybersecurity-t8ye", category: "Tech", type: "Security" },
  { company: "Mastercard", title: "Advisors & Client Services", url: "https://www.theforage.com/simulations/mastercard/advisors-client-services-xvlw", category: "Tech", type: "Services" },
  { company: "AIG", title: "Cybersecurity", url: "https://www.theforage.com/simulations/aig/cybersecurity-ku1i", category: "Tech", type: "Security" },
  { company: "Clifford Chance", title: "Cybersecurity", url: "https://www.theforage.com/simulations/clifford-chance/cybersecurity-sjiw", category: "Tech", type: "Security" },
  { company: "DLA Piper", title: "Global Cyber with Data Privacy", url: "https://www.theforage.com/simulations/dla-piper/global-cyber-with-data-privacy-obq6", category: "Tech", type: "Security" },
  { company: "DLA Piper", title: "M&A for AI Innovation", url: "https://www.theforage.com/simulations/dla-piper/m-a-for-ai-innovation-uhyb", category: "Tech", type: "AI" },
  { company: "Vista Equity Partners", title: "AI in Action", url: "https://www.theforage.com/simulations/vista-equity-partners/ai-in-action-cugo", category: "Tech", type: "AI" },
  { company: "EAB", title: "Gen AI for Proposal Generation", url: "https://www.theforage.com/simulations/eab/gen-ai-for-proposal-generation-u7cu", category: "Tech", type: "AI" },
  { company: "Johnson & Johnson", title: "Robotics & Controls", url: "https://www.theforage.com/simulations/johnson-and-johnson/robotics-controls-aozc", category: "Tech", type: "Robotics" },
  { company: "Forage", title: "Data Labeling", url: "https://www.theforage.com/simulations/forage/data-labeling-c1t0", category: "Tech", type: "Data Science" },
  { company: "Forage", title: "Solutions Architecture", url: "https://www.theforage.com/simulations/forage/solutions-architecture-ts4o-fg-acad", category: "Tech", type: "Architecture" },
  { company: "Forage", title: "Product Management", url: "https://www.theforage.com/simulations/forage/product-management-5c7c-fg-acad", category: "Tech", type: "Product" },
  { company: "Forage", title: "Mastering Technical Interviews", url: "https://www.theforage.com/simulations/forage/sponsored-content-mastering-technical-interviews-ofas", category: "Tech", type: "Interviews" },
  { company: "Y Combinator", title: "Working at a Startup", url: "https://www.theforage.com/simulations/y-combinator/working-start-up-nhsg", category: "Tech", type: "Startups" },
  { company: "H2 Ventures", title: "Venture Capital", url: "https://www.theforage.com/simulations/h2-ventures/venture-capital-comi", category: "Tech", type: "Finance" },
  { company: "Siemens Mobility", title: "Commercial Project Manager", url: "https://www.theforage.com/simulations/siemens-mobility/commercial-project-manager-fi6g", category: "Tech", type: "Project Management" },
  { company: "Siemens Mobility", title: "Project Management", url: "https://www.theforage.com/simulations/siemens-mobility/project-management-qydx", category: "Tech", type: "Project Management" },
  { company: "Siemens Mobility", title: "Operations & Industrial Engineering", url: "https://www.theforage.com/simulations/siemens-mobility/operations-industrial-engineering-xh22", category: "Tech", type: "Engineering" },

  // Banking, Finance & Investment
  { company: "Goldman Sachs", title: "Operations", url: "https://www.theforage.com/simulations/goldman-sachs/operations-9vyc", category: "Finance", type: "Operations" },
  { company: "Goldman Sachs", title: "Controllers", url: "https://www.theforage.com/simulations/goldman-sachs/controllers-8npc", category: "Finance", type: "Accounting" },
  { company: "Goldman Sachs", title: "Risk", url: "https://www.theforage.com/simulations/goldman-sachs/risk-ljdz", category: "Finance", type: "Risk Management" },
  { company: "Goldman Sachs", title: "Internal Audit", url: "https://www.theforage.com/simulations/goldman-sachs/internal-audit-j8c6", category: "Finance", type: "Audit" },
  { company: "Bank of America", title: "Private Bank", url: "https://www.theforage.com/simulations/bank-of-america/private-bank-vblo", category: "Finance", type: "Banking" },
  { company: "Bank of America", title: "Investment Banking", url: "https://www.theforage.com/simulations/bank-of-america/investment-banking-bwp7", category: "Finance", type: "Investment Banking" },
  { company: "Bank of America", title: "Sales & Trading Analyst", url: "https://www.theforage.com/simulations/bank-of-america/sales-and-trading-analyst-i5jo", category: "Finance", type: "Trading" },
  { company: "Citi", title: "Finance", url: "https://www.theforage.com/simulations/citi/finance-qt4o", category: "Finance", type: "Finance" },
  { company: "Citi", title: "Markets Sales & Trading", url: "https://www.theforage.com/simulations/citi/markets-sales-trading-0vhv", category: "Finance", type: "Trading" },
  { company: "Citi", title: "Personal Banking", url: "https://www.theforage.com/simulations/citi/personal-banking-onxf", category: "Finance", type: "Banking" },
  { company: "Citi", title: "Global Quantitative Analysis Analyst", url: "https://www.theforage.com/simulations/citi/global-quantitative-analysis-analyst-6b4m", category: "Finance", type: "Analysis" },
  { company: "Citi", title: "Treasury & Trade Solutions", url: "https://www.theforage.com/simulations/citi/treasury-trade-solutions-v8tg", category: "Finance", type: "Treasury" },
  { company: "Citi", title: "Investment Banking", url: "https://www.theforage.com/simulations/citi/investment-banking-9wcw", category: "Finance", type: "Investment Banking" },
  { company: "Citi", title: "Wealth", url: "https://www.theforage.com/simulations/citi/wealth-za8x", category: "Finance", type: "Wealth Management" },
  { company: "Wells Fargo", title: "Personal Banker", url: "https://www.theforage.com/simulations/wells-fargo/personal-banker-dkfi", category: "Finance", type: "Banking" },
  { company: "Wells Fargo", title: "Consumer & Small Business Banking", url: "https://www.theforage.com/simulations/wells-fargo/consumer-small-business-banking-tkzc", category: "Finance", type: "Banking" },
  { company: "Wells Fargo", title: "Commercial Banking", url: "https://www.theforage.com/simulations/wells-fargo/commercial-banking-vrde", category: "Finance", type: "Banking" },
  { company: "Wells Fargo", title: "Bank Teller", url: "https://www.theforage.com/simulations/wells-fargo/bank-teller-6j0j", category: "Finance", type: "Banking" },
  { company: "PNC", title: "Key Roles and Business Segments", url: "https://www.theforage.com/simulations/pnc/key-roles-and-business-segments-0sqm", category: "Finance", type: "Exploration" },
  { company: "PNC", title: "Overview of Financial Services and Banking", url: "https://www.theforage.com/simulations/pnc/overview-of-financial-services-and-banking-vzpb", category: "Finance", type: "Exploration" },
  { company: "PNC", title: "Banking at PNC / Building Career Skills", url: "https://www.theforage.com/simulations/pnc/banking-at-pnc-building-career-skills-pd92", category: "Finance", type: "Banking" },
  { company: "PNC", title: "Professionalism & Power Skills", url: "https://www.theforage.com/simulations/pnc/professionalism-power-skills-dxef", category: "Finance", type: "Skills" },
  { company: "Standard Chartered", title: "Banking Coverage", url: "https://www.theforage.com/simulations/standardchartered/banking-coverage-kr4i", category: "Finance", type: "Banking" },
  { company: "Fidelity International", title: "Investment Management", url: "https://www.theforage.com/simulations/fidelity-international/investment-management-bqoj", category: "Finance", type: "Investment Management" },
  { company: "PGIM", title: "Fixed Income", url: "https://www.theforage.com/simulations/pgim/fixed-income-fqv9", category: "Finance", type: "Investment Management" },
  { company: "AIG", title: "Underwriting", url: "https://www.theforage.com/simulations/aig/underwriting-uium", category: "Finance", type: "Insurance" },
  { company: "AIG", title: "Claims", url: "https://www.theforage.com/simulations/aig/claims-u9yu", category: "Finance", type: "Insurance" },
  { company: "AIG", title: "Actuarial Analyst", url: "https://www.theforage.com/simulations/aig/actuarial-analyst-dcil", category: "Finance", type: "Actuarial" },
  { company: "London Insurance Life", title: "Claims Adjuster", url: "https://www.theforage.com/simulations/london-insurance-life/claims-adjuster-cfim", category: "Finance", type: "Insurance" },
  { company: "London Insurance Life", title: "Claims Operations", url: "https://www.theforage.com/simulations/london-insurance-life/claims-operations-m6eg", category: "Finance", type: "Insurance" },
  { company: "ACCA APAC", title: "Sustainability in Banking", url: "https://www.theforage.com/simulations/acca-apac/sustainability-banking-4sca", category: "Finance", type: "Sustainability" },
  { company: "Vista Equity Partners", title: "PE Deal Lifecycle", url: "https://www.theforage.com/simulations/vista-equity-partners/understanding-the-private-equity-deal-lifecycle-at-vista-equity-partners-tlv0", category: "Finance", type: "Private Equity" },
  { company: "Vista Equity Partners", title: "Demystifying Private Equity", url: "https://www.theforage.com/simulations/vista-equity-partners/demystifying-private-equity-xzrs", category: "Finance", type: "Private Equity" },
  { company: "Chartered Accountants ANZ", title: "Run Your Own Business", url: "https://www.theforage.com/simulations/chartered-accountants-anz/run-own-business-jvwc", category: "Finance", type: "Entrepreneurship" },
  { company: "Chartered Accountants ANZ", title: "Working @ YouTube", url: "https://www.theforage.com/simulations/chartered-accountants-anz/working-youtube-rdmr", category: "Finance", type: "Business" },
  { company: "Chartered Accountants ANZ", title: "Plan a Community-Led Initiative", url: "https://www.theforage.com/simulations/chartered-accountants-anz/plan-community-led-initiative-24ib", category: "Finance", type: "Social Impact" },
  { company: "Bloomberg", title: "Client Engagement", url: "https://www.theforage.com/simulations/bloomberg/client-engagement-a6hi", category: "Finance", type: "Client Services" },
  { company: "Bloomberg", title: "Client Service", url: "https://www.theforage.com/simulations/bloomberg/client-service-l3u2", category: "Finance", type: "Client Services" },

  // Consulting
  { company: "BCG", title: "Strategy Consulting", url: "https://www.theforage.com/simulations/bcg/strategy-consulting-jk76", category: "Consulting", type: "Strategy" },
  { company: "BCG", title: "Intro to Strategy Consulting", url: "https://www.theforage.com/simulations/bcg/intro-strategy-consulting-ubsq", category: "Consulting", type: "Strategy" },
  { company: "BCG", title: "X Ventures", url: "https://www.theforage.com/simulations/bcg/x-ventures-lbvf", category: "Consulting", type: "Innovation" },
  { company: "BCG", title: "Social Impact", url: "https://www.theforage.com/simulations/bcg/social-impact-imzt", category: "Consulting", type: "Social Impact" },
  { company: "BCG", title: "Climate & Sustainability", url: "https://www.theforage.com/simulations/bcg/climate-sustainability-irs7", category: "Consulting", type: "Sustainability" },
  { company: "BCG", title: "Knowledge Team & Client Focus", url: "https://www.theforage.com/simulations/bcg/knowledge-team-client-focus-wqlb", category: "Consulting", type: "Strategy" },
  { company: "BCG", title: "Case Team", url: "https://www.theforage.com/simulations/bcg/bcg-case-team-cna0", category: "Consulting", type: "Strategy" },
  { company: "BCG", title: "Return to Work (Parents/Carers)", url: "https://www.theforage.com/simulations/bcg/return-work-for-parents-carers-tgvm", category: "Consulting", type: "Diversity" },
  { company: "PwC US", title: "Technology Consulting", url: "https://www.theforage.com/simulations/pwc-us/technology-consulting-fgpq", category: "Consulting", type: "Technology" },
  { company: "PwC US", title: "Management Consulting", url: "https://www.theforage.com/simulations/pwc-us/management-consulting-gwcm", category: "Consulting", type: "Management" },
  { company: "PwC US", title: "Cybersecurity Consulting", url: "https://www.theforage.com/simulations/pwc-us/cybersecurity-consulting-sr1m", category: "Consulting", type: "Security" },
  { company: "PwC US", title: "Audit", url: "https://www.theforage.com/simulations/pwc-us/audit-w3fr", category: "Consulting", type: "Audit" },
  { company: "PwC US", title: "Tax", url: "https://www.theforage.com/simulations/pwc-us/tax-l9rj", category: "Consulting", type: "Tax" },
  { company: "PwC US", title: "Digital Assurance & Transparency", url: "https://www.theforage.com/simulations/pwc-us/digital-assurance-9rtv", category: "Consulting", type: "Assurance" },
  { company: "KPMG US", title: "Advisory", url: "https://www.theforage.com/simulations/kpmg-us/advisory-f7ke", category: "Consulting", type: "Advisory" },
  { company: "KPMG US", title: "Tax", url: "https://www.theforage.com/simulations/kpmg-us/tax-b0hl", category: "Consulting", type: "Tax" },
  { company: "KPMG US", title: "Audit", url: "https://www.theforage.com/simulations/kpmg-us/audit-gsyv", category: "Consulting", type: "Audit" },
  { company: "EY", title: "Forensics", url: "https://www.theforage.com/simulations/ey/forensics-g8l7", category: "Consulting", type: "Forensics" },
  { company: "EY", title: "Audit", url: "https://www.theforage.com/simulations/ey/audit-k5kl", category: "Consulting", type: "Audit" },
  { company: "EY", title: "Technology Risk", url: "https://www.theforage.com/simulations/ey/technology-risk-ydqh", category: "Consulting", type: "Risk" },
  { company: "Deloitte Australia", title: "Cyber", url: "https://www.theforage.com/simulations/deloitte-au/cyber-c1e3", category: "Consulting", type: "Security" },
  { company: "Deloitte Australia", title: "Data Analytics", url: "https://www.theforage.com/simulations/deloitte-au/data-analytics-s5zy", category: "Consulting", type: "Data Analytics" },
  { company: "Deloitte Australia", title: "Technology", url: "https://www.theforage.com/simulations/deloitte-au/technology-fz0w", category: "Consulting", type: "Technology" },
  { company: "Oliver Wyman", title: "Integrated Consulting Group", url: "https://www.theforage.com/simulations/oliver-wyman/integrated-consulting-group-tvnj", category: "Consulting", type: "Strategy" },
  { company: "Oliver Wyman", title: "Financial Services & Climate Change", url: "https://www.theforage.com/simulations/oliver-wyman/financial-services-climate-change-rv72", category: "Consulting", type: "Strategy" },
  { company: "Comcast", title: "Interview Fundamentals", url: "https://www.theforage.com/simulations/comcast/interview-fundamentals-3j7g", category: "Consulting", type: "Skills" },

  // Engineering / Science / Life Sciences
  { company: "GE Aerospace", title: "Supply Chain", url: "https://www.theforage.com/simulations/ge-aerospace/supply-chain-n0yr", category: "Engineering", type: "Supply Chain" },
  { company: "GE Aerospace", title: "Explore Electrical Engineering", url: "https://www.theforage.com/simulations/ge-aerospace/explore-electrical-engineering-ftgs", category: "Engineering", type: "Engineering" },
  { company: "GE Aerospace", title: "Engineering", url: "https://www.theforage.com/simulations/ge-aerospace/engineering-xadc", category: "Engineering", type: "Engineering" },
  { company: "GE Aerospace", title: "Human Resources", url: "https://www.theforage.com/simulations/ge-aerospace/human-resources-8hl7", category: "Engineering", type: "HR" },
  { company: "Pfizer UK", title: "Molecule Market", url: "https://www.theforage.com/simulations/pfizer-uk/molecule-market-prll", category: "Engineering", type: "Life Sciences" },
  { company: "APA", title: "Engineering New Energy", url: "https://www.theforage.com/simulations/apa/engineering-new-energy-5nbl", category: "Engineering", type: "Energy" },
  { company: "Engineers Without Borders UK", title: "Globally Responsible Engineering", url: "https://www.theforage.com/simulations/engineers-without-borders-uk/globally-responsible-engineering-qhol", category: "Engineering", type: "Engineering" },

  // Other
  { company: "Walmart", title: "Pharmacy Technician", url: "https://www.theforage.com/simulations?companies=walmart", category: "Other", type: "Retail" },
  { company: "Red Bull", title: "On-Premise Sales", url: "https://www.theforage.com/simulations?companies=red-bull", category: "Other", type: "Sales" },
  { company: "CBRE", title: "Commercial Real Estate", url: "https://www.theforage.com/simulations?companies=cbre", category: "Other", type: "Real Estate" },
  { company: "Pearson", title: "Marketing", url: "https://www.theforage.com/simulations/pearson/marketing-oxce", category: "Other", type: "Marketing" },
  { company: "NBN Co", title: "Trainee Customer Field Technician", url: "https://www.theforage.com/simulations/nbnco/trainee-customer-field-technician-a9el", category: "Other", type: "Customer Service" },
  { company: "Forage", title: "Resume Writing with AI", url: "https://www.theforage.com/simulations?companies=learning", category: "Other", type: "Career Development" },
];

export const INTERNSHIP_CATEGORIES = [
  "Tech", "Finance", "Consulting", "Engineering", "Law", "Other",
  "Cloud Computing", "Networking", "Security", "Business", "Data Science", "AI", "Programming", "Database & Backend"
];

export const getCategoryCount = (category: string): number => {
  return INTERNSHIP_PROGRAMS.filter(s => s.category === category).length;
};

export const getProgramsByCategory = (category: string): InternshipProgram[] => {
  return INTERNSHIP_PROGRAMS.filter(s => s.category === category);
};

// Legacy exports for backwards compatibility
export const FORAGE_CATEGORIES = INTERNSHIP_CATEGORIES;
export const getSimulationsByCategory = getProgramsByCategory;
