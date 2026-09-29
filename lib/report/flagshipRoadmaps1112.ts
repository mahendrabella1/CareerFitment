/**
 * "Flagship" domain roadmaps - a genuinely deeper treatment than the
 * generic CLUSTER_ROADMAPS/domainRoadmapFor() content in
 * careerFit1112Sheets.tsx, built cluster by cluster on request (starting
 * with Finance) rather than all 16 at once, since each one needs real,
 * independently-verified research (colleges, certification bodies,
 * government internship programmes), not just restructuring what's
 * already in the codebase.
 *
 * Every fact below was checked against a live source this session, not
 * carried over from memory or copied from a user-supplied reference
 * without verification - two real corrections came out of that check
 * against the reference this was modelled on:
 *  - RBI's Research Internship Scheme requires an ENROLLED/COMPLETED
 *    postgraduate (or final-year integrated) degree in Economics/Finance/
 *    Statistics - not something a standard 3-year UG student can apply to
 *    in their 3rd year, contrary to how a "Year 3 government internship
 *    target" framing would suggest.
 *  - NABARD's Student Internship Scheme (SIS) is gated the same way -
 *    PG/PGDM students who've completed 1st year, or 5-year integrated
 *    students who've completed year 4. Both are flagged as PG-gated here
 *    rather than listed as a plain UG-year-3 target.
 * Figures that change often (stipends, fees) are given as a snapshot with
 * an explicit "verify against the current notification" caveat, the same
 * standard CLUSTER_FUNDED_PROGRAMS already holds itself to - conflicting
 * stipend figures showed up across sources for RBI's scheme specifically
 * (₹35,000 vs ₹45,000/month), so that one is deliberately given as a
 * range with a verify note rather than a single false-precise number.
 */

export interface FlagshipSubject {
  subject: string;
  importance: "Essential" | "Highly recommended" | "Useful";
  why: string;
}
export interface FlagshipDegreeGroup {
  category: string;
  degrees: string[];
}
export interface FlagshipCollegeTier {
  tier: string;
  note: string;
  colleges: { name: string; route: string }[];
}
export interface FlagshipYearPlan {
  year: string;
  academicFocus: string;
  skills: string;
  experience: string;
  output: string;
}
export interface FlagshipGovInternship {
  name: string;
  body: string;
  eligibility: string;
  stipend: string;
  verify: string;
  url: string;
}
export interface FlagshipTrack {
  name: string;
  pathway: string;
  careers: string[];
  skills: string[];
  certifications: string[];
  pgOptions: string[];
  progression: string[];
}
export interface FlagshipDomainRoadmap {
  tagline: string;
  recommendedStream: string;
  subjects: FlagshipSubject[];
  subjectCombinations: { name: string; combo: string }[];
  degreeGroups: FlagshipDegreeGroup[];
  decisionTree: { goal: string; path: string }[];
  collegeTiers: FlagshipCollegeTier[];
  financialSupportNote: string;
  yearPlan: FlagshipYearPlan[];
  virtualSimulations: { platform: string; note: string; items: { name: string; skills: string[] }[] };
  governmentInternships: FlagshipGovInternship[];
  tracks: FlagshipTrack[];
  abroadPrograms: string[];
  abroadJobs: string[];
  abroadJobsNote: string;
  completeJourney: { age: string; stage: string }[];
  disclaimer: string;
}

export const FLAGSHIP_ROADMAPS_1112: Partial<Record<string, FlagshipDomainRoadmap>> = {
  "Finance": {
    tagline: "The complete path into Finance - not one generic route, but a branching map across Accounting, Investment, Corporate Finance, Banking, Investment Banking, Risk and FinTech, with the exact degree, exam and certification each one actually runs through.",
    recommendedStream: "Commerce is the most direct route (Accountancy, Economics, Business Studies, Mathematics/Applied Mathematics) - Science (PCM) students can still enter via Economics/B.Sc Finance/Statistics routes, just with fewer direct on-ramps.",
    subjects: [
      { subject: "Accountancy", importance: "Essential", why: "Foundation for accounting and corporate finance" },
      { subject: "Economics", importance: "Essential", why: "Markets, inflation, GDP, monetary policy" },
      { subject: "Business Studies", importance: "Essential", why: "How companies and business functions actually work" },
      { subject: "Mathematics", importance: "Highly recommended", why: "Valuation, statistics and quantitative analysis" },
      { subject: "Applied Mathematics", importance: "Highly recommended", why: "A business/finance-oriented quantitative alternative to core Maths" },
      { subject: "English", importance: "Essential", why: "Reports, presentations, interviews, professional writing" },
      { subject: "Computer Science / Informatics Practices", importance: "Useful", why: "Data analysis and financial technology" },
    ],
    subjectCombinations: [
      { name: "Finance + Investment", combo: "Accountancy + Economics + Business Studies + Mathematics/Applied Maths + English" },
      { name: "Finance + Analytics", combo: "Accountancy + Economics + Mathematics + Computer Science/IP + English" },
      { name: "Accounting / CA track", combo: "Accountancy + Economics + Business Studies + Mathematics/Applied Maths + English" },
    ],
    degreeGroups: [
      { category: "Commerce / accounting", degrees: ["B.Com", "B.Com (Hons.)", "B.Com Finance", "B.Com Accounting & Finance (BAF)", "B.Com Banking & Insurance (BBI)", "B.Com Financial Markets (BFM)", "B.Com Investment Management", "B.Com Accountancy & Taxation"] },
      { category: "Business / management", degrees: ["BBA Finance", "BBA Banking & Finance", "BBA Financial Markets", "BBA FinTech", "BMS (Bachelor of Management Studies)", "BBA + MBA Integrated"] },
      { category: "Economics / quantitative", degrees: ["B.A. Economics", "B.A. (Hons.) Economics", "B.Sc. Economics", "B.Sc. Finance", "B.Sc. Economics & Finance"] },
      { category: "Professional qualification + UG combinations", degrees: ["B.Com + CA (via CA Foundation/Intermediate/Articleship)", "B.Com + CMA", "B.Com/BBA + CFA (started in final year)"] },
    ],
    decisionTree: [
      { goal: "Accounting / audit / tax", path: "B.Com / B.Com (Hons.) + CA, CMA or ACCA" },
      { goal: "Investment / markets", path: "B.Com / BBA / B.Sc Finance or Economics + CFA or NISM Series XV" },
      { goal: "Corporate finance / FP&A", path: "B.Com / BBA Finance + Excel, Financial Modelling, Power BI" },
      { goal: "Banking", path: "B.Com / BBA / Economics + banking, credit and risk skills" },
      { goal: "Investment banking", path: "B.Com / BBA / B.Sc Finance or Economics + Financial Modelling, Valuation, CFA" },
      { goal: "Risk", path: "Finance / Economics / Maths + FRM" },
      { goal: "FinTech", path: "BBA FinTech / B.Sc Finance / B.Com Finance + SQL, Python, Power BI" },
    ],
    collegeTiers: [
      {
        tier: "Central / government-supported (Delhi University, CUET-UG route)",
        note: "The Delhi University commerce colleges most students name first - genuinely strong, but not the only serious option.",
        colleges: [
          { name: "Shri Ram College of Commerce (SRCC)", route: "B.Com (Hons.)" },
          { name: "Hindu College", route: "B.Com (Hons.)" },
          { name: "Hans Raj College", route: "B.Com (Hons.)" },
          { name: "Kirori Mal College", route: "B.Com (Hons.)" },
          { name: "Ramjas College", route: "B.Com (Hons.)" },
        ],
      },
      {
        tier: "Other government / deemed institutions (national)",
        note: "Outside Delhi - the pan-India options a Delhi-only list misses.",
        colleges: [
          { name: "Shaheed Sukhdev College of Business Studies (Delhi)", route: "B.Com (Hons.), BBA (FIA)" },
          { name: "IIM Indore - Integrated Programme in Management (IPM)", route: "5-year integrated UG+MBA, finance specialisation available from year 4" },
          { name: "Loyola College, Chennai", route: "B.Com" },
          { name: "St. Xavier's College, Mumbai", route: "B.Com" },
        ],
      },
      {
        tier: "Top private universities",
        note: "Higher fees, but genuinely strong finance-specific programmes and placements.",
        colleges: [
          { name: "NMIMS Mumbai", route: "B.Com, BBA Finance, BBA FinTech, B.Sc Finance" },
          { name: "Christ University, Bangalore", route: "B.Com Finance & Investment, Strategic Finance, Applied Finance & Analytics" },
          { name: "Symbiosis (SCMS), Pune", route: "BBA" },
          { name: "Bennett University, Greater Noida", route: "BBA" },
        ],
      },
    ],
    financialSupportNote: "Prioritise government/public university colleges first, then state-government universities, then government-aided colleges - private universities only where a specific programme (e.g. a named FinTech/analytics specialisation) is worth the extra cost. Individual colleges (SRCC and others) run their own scholarship/fee-concession schemes on top of this - check the specific college's current financial-aid page, since fee and scholarship figures change every admission cycle.",
    yearPlan: [
      { year: "Year 1", academicFocus: "Financial Accounting, Business Economics, Business Mathematics, Business Statistics, Business Law", skills: "Excel (SUMIFS, COUNTIFS, IF, XLOOKUP, INDEX/MATCH, Pivot Tables, Power Query)", experience: "Free virtual simulations (Forage)", output: "A personal budget dashboard + a company revenue-analysis project" },
      { year: "Year 2", academicFocus: "Corporate Finance, Financial Markets", skills: "Financial modelling, Power BI, SQL", experience: "First real internship (accounting, finance operations, bookkeeping or banking-operations intern)", output: "A 3-statement financial model + a finance portfolio" },
      { year: "Year 3", academicFocus: "Valuation, Investments, Risk", skills: "Advanced modelling, equity/credit research", experience: "A second, more targeted internship in the chosen track", output: "A research report + progress toward one track's certification (CFA/NISM/CA/CMA/FRM)" },
      { year: "Year 4", academicFocus: "Track specialisation + final project", skills: "Advanced role-specific skills, interview/case-study practice", experience: "Placement internship or pre-placement offer track", output: "Degree + specialisation + internship history + certification progress + a job or PG plan" },
    ],
    virtualSimulations: {
      platform: "Forage",
      note: "Free, self-paced, open-access virtual job simulations - genuinely useful for a resume line and for testing fit, but Forage itself is explicit these are extracurricular simulations, not real employment or an actual internship.",
      items: [
        { name: "Citi Finance", skills: ["KPI analysis", "Financial risk", "FP&A", "Financial management"] },
        { name: "Citi Investment Banking", skills: ["Company analysis", "Financial projections", "Comparables", "Valuation", "Financial modelling"] },
        { name: "Citi Markets", skills: ["Market analysis", "Trade ideas", "Risk/hedging"] },
      ],
    },
    governmentInternships: [
      {
        name: "RBI Research Internship Scheme",
        body: "Reserve Bank of India",
        eligibility: "Postgraduate (or final-year integrated-programme) students in Economics, Statistics, Finance or a related field - NOT open to a standard 3-year UG student directly; worth knowing about now, aimed at once you're in or finishing a PG programme.",
        stipend: "Roughly ₹35,000-45,000/month per recent notifications (sources vary) - confirm the exact current figure against the live notification.",
        verify: "opportunities.rbi.org.in - applications typically open twice a year (around Jul-Nov for the January batch, Jan-May for the July batch).",
        url: "https://opportunities.rbi.org.in",
      },
      {
        name: "NABARD Student Internship Scheme (SIS)",
        body: "National Bank for Agriculture and Rural Development",
        eligibility: "PG/PGDM students who've completed 1st year, or 5-year integrated-programme students who've completed year 4 - same PG-level gating as RBI's scheme, not a plain UG-year-3 target.",
        stipend: "Recent cycles have paid roughly ₹18,000-20,000/month for an 8-12 week internship - confirm against the current notification.",
        verify: "nabard.org - notifications are released periodically; application windows are short (days to a couple of weeks).",
        url: "https://www.nabard.org",
      },
      {
        name: "SEBI Legal Internship",
        body: "Securities and Exchange Board of India",
        eligibility: "Law students specifically - SEBI's current official internship intake is for LEGAL internships, not a general finance/markets internship, so don't present it as a Finance-track internship target.",
        stipend: "Set by SEBI's current legal-internship notification.",
        verify: "sebi.gov.in - current legal internship application page.",
        url: "https://www.sebi.gov.in",
      },
    ],
    tracks: [
      {
        name: "Accounting / CA",
        pathway: "UG (B.Com) → CA Foundation → CA Intermediate → Articleship → CA Final → Chartered Accountant",
        careers: ["Audit", "Tax", "Financial reporting", "Controllership", "Corporate finance", "CFO track"],
        skills: ["Financial accounting", "Auditing standards", "Direct & indirect tax", "Financial reporting"],
        certifications: ["CA (ICAI) - Foundation can be provisionally registered after Class 10; the Foundation exam itself is taken only after appearing in Class 12", "CMA (ICMAI) - Foundation accessible after the required school qualification", "ACCA"],
        pgOptions: ["M.Com (where a further degree is useful alongside CA/CMA)", "No PG degree is required to qualify as a CA/CMA - the professional qualification itself is the credential"],
        progression: ["Audit/Accounts Associate", "Senior Associate", "Manager", "Senior Manager", "Controller / Finance Director / CFO"],
      },
      {
        name: "Investment",
        pathway: "B.Com/BBA/Economics/Finance → CFA (or NISM Series XV) → Investment Analyst",
        careers: ["Equity Research", "Investment Analyst", "Portfolio Management", "Asset Management", "Wealth Management"],
        skills: ["Equity research", "Fundamental analysis", "Valuation (DCF)", "Portfolio theory", "Fixed income"],
        certifications: ["CFA - Level I can be taken when your exam window is within 23 months of graduation; Level II needs you within 11 months of graduation; Level III needs a completed bachelor's degree (or 4,000 hours of relevant work experience)", "NISM Series XV - Research Analyst (revised syllabus from January 2026, SEBI no longer requires a specific finance/commerce degree to sit it)"],
        pgOptions: ["MSc Finance", "MBA Finance"],
        progression: ["Investment Analyst", "Senior Investment Analyst", "Portfolio Manager / Associate", "Senior Portfolio Manager", "Investment Director / CIO"],
      },
      {
        name: "Corporate Finance",
        pathway: "B.Com/BBA → Financial Analyst → FP&A → Finance Manager → Finance Director/CFO",
        careers: ["Financial Analyst", "FP&A Analyst", "Treasury Analyst"],
        skills: ["Excel", "Financial modelling", "Budgeting & forecasting", "Variance analysis", "Power BI", "SQL", "ERP systems"],
        certifications: ["CMA", "MBA Finance (later, not entry-level)"],
        pgOptions: ["MBA Finance", "MSc Finance", "CMA/CA depending on the specific role"],
        progression: ["Financial Analyst", "Senior Financial Analyst", "Finance Manager", "Senior Finance Manager", "Finance Director", "CFO"],
      },
      {
        name: "Banking",
        pathway: "B.Com/BBA/Economics → banking-specific roles",
        careers: ["Credit Analyst", "Corporate Banking", "Retail Banking", "Treasury", "Banking Operations"],
        skills: ["Credit analysis", "Banking operations", "Risk basics", "Regulatory awareness"],
        certifications: ["JAIIB/CAIIB (once employed in banking)", "NISM modules relevant to the specific banking role"],
        pgOptions: ["MBA Finance/Banking", "PG Diploma in Banking & Finance (several bank-run PGDBF programmes)"],
        progression: ["Banking Analyst", "Relationship/Credit Manager", "Senior Manager", "Regional/Business Head"],
      },
      {
        name: "Investment Banking",
        pathway: "Finance/Economics degree → Financial Modelling + Valuation → Investment Banking Analyst",
        careers: ["Investment Banking Analyst", "M&A Analyst", "Valuation Analyst", "Transaction Advisory Analyst"],
        skills: ["Three-statement modelling", "DCF", "Comparable-company analysis", "Precedent transactions", "Pitch books", "Advanced Excel & PowerPoint"],
        certifications: ["CFA (widely valued, not mandatory)", "In-house/on-the-job training is the real qualifier here"],
        pgOptions: ["MBA Finance (a common route into IB at the Associate level)", "MSc Finance"],
        progression: ["Investment Banking Analyst", "Associate", "Vice President", "Director", "Managing Director"],
      },
      {
        name: "Risk",
        pathway: "Finance/Economics/Maths degree → Risk Analyst → Risk Manager",
        careers: ["Credit risk", "Market risk", "Operational risk analyst roles"],
        skills: ["Statistics & probability", "Financial modelling", "Risk reporting", "SQL/Python (increasingly expected)"],
        certifications: ["FRM (Financial Risk Manager, GARP)"],
        pgOptions: ["MSc Finance/Risk Management", "MBA Finance/Risk"],
        progression: ["Risk Analyst", "Senior Risk Analyst", "Risk Manager", "Head of Risk / CRO"],
      },
      {
        name: "FinTech",
        pathway: "Finance degree + technology skills (BBA FinTech / B.Com Finance + self-taught or elective tech)",
        careers: ["FinTech Analyst", "Financial Data Analyst", "Risk Analytics Analyst"],
        skills: ["SQL", "Python", "Power BI", "APIs", "Payments & digital banking basics"],
        certifications: ["No single mandatory certification - a strong project portfolio (dashboards, small automations) matters more here than a credential"],
        pgOptions: ["MSc Financial Technology", "MSc Finance + Analytics", "MBA FinTech/Business Analytics"],
        progression: ["FinTech/Data Analyst", "Senior Analyst", "Product/Analytics Lead", "Head of FinTech Product or Analytics"],
      },
    ],
    abroadPrograms: ["MSc Finance", "MSc Financial Economics", "MSc Accounting", "MSc Investment Management", "MSc Risk Management", "MSc Financial Analytics", "MSc FinTech", "MSc Economics", "MBA Finance"],
    abroadJobs: ["Financial Analyst", "Investment Analyst", "Risk Analyst", "FP&A Analyst", "Corporate Banking Analyst", "Treasury Analyst", "Financial Data Analyst", "Investment Operations Analyst"],
    abroadJobsNote: "Before counting on any of these: check work-authorisation rules, post-study work visa length, whether the destination country requires its own professional qualification (a CFA/CA charter doesn't automatically transfer), local accounting/financial regulations, total cost of the degree, and realistic graduate employment rates - not just whether the role sounds appealing.",
    completeJourney: [
      { age: "16-18", stage: "Class 11-12: Commerce + Maths, finance fundamentals, CUET/entrance preparation" },
      { age: "18-19", stage: "UG Year 1: Accounting + Economics + Excel, first finance project, first virtual simulation" },
      { age: "19-20", stage: "UG Year 2: Financial modelling + Power BI, first real internship, certification prep begins" },
      { age: "20-22", stage: "UG Year 3-4: Track specialisation, 2-3 internships, professional certification, placement prep" },
      { age: "22-25", stage: "Entry-level: Analyst/Associate, building track specialisation" },
      { age: "25-32", stage: "Senior Analyst → Manager, professional qualification/MBA/master's if useful" },
      { age: "32-40", stage: "Senior Manager → Head/Director-level responsibility" },
      { age: "40+", stage: "Finance leadership: CFO / Finance Director / Investment Director / CIO / Banking Leadership / Entrepreneur" },
    ],
    disclaimer: "College names, fees, admission rules, certification syllabi and stipend figures all change - this was checked against live sources in September 2026, but should be refreshed at least once a year before being presented as current.",
  },
};

export function flagshipRoadmapFor(cluster: string): FlagshipDomainRoadmap | null {
  return FLAGSHIP_ROADMAPS_1112[cluster] ?? null;
}
