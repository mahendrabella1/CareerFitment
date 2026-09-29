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
  "STEM": {
    tagline: "Science, Technology, Engineering and Mathematics - not one generic engineering path, but five genuinely distinct pathways (Engineering, Computing & Data, Pure & Applied Sciences, Mathematics & Statistics, Interdisciplinary/Future STEM), each with its own subjects, degrees, colleges and careers.",
    recommendedStream: "PCM (Physics, Chemistry, Mathematics) is the widest STEM route; PCB opens Biology-led STEM (biotech, life sciences); PCMB keeps both open at the cost of workload; adding Computer Science/IP strengthens the Computing & Data route specifically.",
    subjects: [
      { subject: "Mathematics", importance: "Essential", why: "Algebra, trigonometry, calculus, coordinate geometry, probability, statistics, vectors, mathematical reasoning - the foundation for nearly every STEM path" },
      { subject: "Physics", importance: "Essential", why: "Mechanics, electricity, magnetism, waves, optics, thermodynamics, modern physics" },
      { subject: "Chemistry", importance: "Essential", why: "Physical, organic and inorganic chemistry, chemical calculations, laboratory fundamentals" },
      { subject: "Biology", importance: "Highly recommended", why: "For PCB/PCMB students - cell biology, genetics, molecular biology, biotechnology, human physiology, ecology, evolution" },
      { subject: "Computer Science", importance: "Highly recommended", why: "Python, programming fundamentals, data structures basics, SQL, algorithms, computational thinking - if available" },
    ],
    subjectCombinations: [
      { name: "Path A - PCM", combo: "Physics + Chemistry + Mathematics - best for Engineering, CS, AI/ML, Data Science, Robotics, Electronics, Mechanical, Civil, Aerospace, Physics, Mathematics, Statistics" },
      { name: "Path B - PCB", combo: "Physics + Chemistry + Biology - the route for Biotechnology, Biological Sciences, Microbiology, Biochemistry, Genetics, Life Sciences, and medicine/healthcare if separate" },
      { name: "Path C - PCMB", combo: "Physics + Chemistry + Mathematics + Biology - widest flexibility for a student genuinely undecided between Engineering/Technology and Biological/Life Sciences, at the cost of workload" },
      { name: "Path D - PCM + Computer Science/IP", combo: "Particularly useful for Computer Science, Software, AI, Data Science, Cybersecurity, Computational Science, FinTech, Scientific Computing" },
      { name: "Path E - Mathematics + Economics/Computer Science", combo: "Useful for Mathematics, Statistics, Economics, Data Science, Computational Economics, quantitative careers" },
    ],
    degreeGroups: [
      { category: "Engineering (4-year B.Tech / B.E.)", degrees: ["Computer Science Engineering", "AI & Machine Learning", "AI & Data Science", "Data Science", "Information Technology", "Electronics & Communication", "Electrical Engineering", "Electronics Engineering", "Electrical & Electronics", "Mechanical Engineering", "Mechatronics", "Robotics & Automation", "Aerospace Engineering", "Aeronautical Engineering", "Chemical Engineering", "Civil Engineering", "Environmental Engineering", "Biomedical Engineering", "Biotechnology", "Industrial Engineering", "Manufacturing Engineering", "Materials Engineering", "Metallurgical Engineering", "Mining Engineering", "Petroleum Engineering", "Energy Engineering", "Engineering Physics", "Semiconductor/VLSI"] },
      { category: "Science pathways (B.Sc / B.S.)", degrees: ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics", "B.Sc Statistics", "B.Sc Computer Science", "B.Sc Data Science", "B.Sc Biotechnology", "B.Sc Biology", "B.Sc Life Sciences", "B.Sc Microbiology", "B.Sc Biochemistry", "B.Sc Environmental Science", "B.Sc Geology", "B.Sc Geophysics", "B.Sc Materials Science", "B.Sc Computational Science"] },
      { category: "Research-oriented degrees", degrees: ["BS Research (e.g. IISc's 4-year BS)", "BS-MS (5-year, e.g. IISERs)", "Integrated MSc Physics", "Integrated MSc Mathematics", "Integrated MSc Chemistry", "Integrated MSc Biology", "Integrated MSc Data/Computational Science"] },
      { category: "Mathematics / Statistics pathways", degrees: ["B.Sc Mathematics", "B.Sc Statistics", "B.Stat", "B.Math", "BS Mathematics", "BS Statistics", "Mathematics & Computing", "Data Science", "Mathematical Economics", "Actuarial Science"] },
    ],
    decisionTree: [
      { goal: "software, AI or data", path: "PCM (+ CS/IP) → B.Tech CSE/AI/Data Science or B.Sc Computer Science/Data Science → CSE/AI track below" },
      { goal: "electronics or semiconductor hardware", path: "PCM → B.Tech Electronics/Electrical/VLSI → Electronics & Semiconductor track below" },
      { goal: "core mechanical or design engineering", path: "PCM → B.Tech Mechanical/Mechatronics/Robotics/Aerospace → Mechanical track below" },
      { goal: "civil, structural or construction-adjacent engineering", path: "PCM → B.Tech Civil/Environmental Engineering → Civil track below" },
      { goal: "pure science or research", path: "PCM/PCB/PCMB → B.Sc/BS/BS-MS/Integrated MSc (Physics/Chemistry/Biology/Maths) → Science & Research track below" },
    ],
    collegeTiers: [
      {
        tier: "Government / public - top 5 (NIRF 2025 Engineering)",
        note: "IIT Madras, Delhi, Bombay, Kanpur and Kharagpur are the top 5 in the NIRF 2025 Engineering ranking.",
        colleges: [
          { name: "IIT Madras", route: "B.Tech, via JEE Advanced" },
          { name: "IIT Delhi", route: "B.Tech, via JEE Advanced" },
          { name: "IIT Bombay", route: "B.Tech, via JEE Advanced" },
          { name: "IIT Kanpur", route: "B.Tech, via JEE Advanced" },
          { name: "IIT Kharagpur", route: "B.Tech, via JEE Advanced" },
        ],
      },
      {
        tier: "Government / public - broader STEM (research-oriented)",
        note: "The best institution for a Physics researcher isn't necessarily the best for Computer Science or Mechanical - these are genuinely different routes.",
        colleges: [
          { name: "IISc Bengaluru", route: "BS (Research), via KVPY/JEE-based routes" },
          { name: "IISERs", route: "5-year BS-MS, via IISER Aptitude Test (IAT)" },
          { name: "NISER Bhubaneswar", route: "5-year Integrated MSc, via NEST" },
          { name: "ISI", route: "B.Stat/B.Math, via ISI Admission Test" },
          { name: "NITs / IIITs", route: "B.Tech, via JEE Main" },
          { name: "University of Hyderabad / University of Delhi", route: "B.Sc, various" },
        ],
      },
      {
        tier: "Private",
        note: "Real, strong options - presented as alternatives, not a ranking above the government tier.",
        colleges: [
          { name: "BITS Pilani", route: "B.E. + M.Sc across CS, Maths & Computing, Electronics, Mechanical, Chemical, Physics, Chemistry, Biological Sciences; via BITSAT" },
          { name: "IIIT Hyderabad", route: "Particularly strong for CS, AI, Data Science, Computational research" },
          { name: "VIT", route: "B.Tech CSE/AI-ML/Data Science/Cybersecurity/Bioinformatics/ECE/VLSI/Mechanical/Biotech/Robotics; via VITEEE" },
          { name: "Manipal Institute of Technology", route: "B.Tech, various" },
          { name: "Amrita Vishwa Vidyapeetham", route: "B.Tech, various" },
        ],
      },
    ],
    financialSupportNote: "Investigate public institutions first (IITs, NITs, IIITs, IISERs, NISER, IISc, ISI, Central Universities, State Government Engineering/Science Colleges) - IISER/NISER/IISc/public universities give research-oriented STEM education without private-university fee structures. Think in three tiers - high-cost private vs. government/public vs. scholarship-supported - rather than treating any one institution as universally \"best.\"",
    yearPlan: [
      { year: "Year 1", academicFocus: "Calculus, linear algebra, physics/chemistry fundamentals, programming fundamentals, scientific communication (by degree)", skills: "Excel → Python → Git/GitHub → basic data analysis (everyone); branch-specific tools beyond that", experience: "1 virtual experience (Forage/Kaggle/open-source) + 1 competition/hackathon/research activity", output: "2 small projects (e.g. numerical simulation, dataset analysis, sensor/Arduino project, Python app)" },
      { year: "Year 2", academicFocus: "Move from basic knowledge to technical competence in the chosen specialisation", skills: "CSE/AI: DSA, SQL, OOP, ML fundamentals, APIs · Electronics: digital electronics, microcontrollers, Embedded C, PCB, VLSI · Mechanical: CAD, SolidWorks/CATIA, MATLAB · Civil: AutoCAD, STAAD/Revit/BIM, surveying, GIS · Electrical: MATLAB/Simulink, power systems, control systems · Science: scientific programming, statistics, research methodology", experience: "Industry + university research internships", output: "2 substantial projects" },
      { year: "Year 3", academicFocus: "Target serious research/industry internships", skills: "Deepen the Year-2 specialisation's tools", experience: "DRDO, ISRO, CSIR laboratories, IIT/IISc/IISER/NIT faculty research projects, R&D/technology/semiconductor/engineering companies - DRDO's 2026 notices show paid internships for engineering and science UG/PG students (e.g. DRDL Hyderabad, RCI Hyderabad, ITR Chandipur)", output: "A serious research or industry internship on the resume" },
      { year: "Year 4", academicFocus: "Convert education into a career", skills: "Technical interview prep, aptitude prep where required", experience: "Final-year project, placement applications, Master's/PhD applications if pursuing research", output: "Degree + specialisation + projects + internship + technical portfolio + career decision" },
    ],
    virtualSimulations: {
      platform: "Forage / Kaggle / open-source",
      note: "Forage job simulations, Kaggle competitions, open-source contributions, university research challenges and coding competitions - genuinely useful experience, but explicitly not equivalent to paid employment.",
      items: [
        { name: "Forage", skills: ["Job-simulation tasks across tech/engineering employers"] },
        { name: "Kaggle", skills: ["Applied data science", "ML competitions", "Public portfolio"] },
        { name: "Open-source / hackathons", skills: ["Real collaborative coding", "Git workflow", "Public contribution history"] },
      ],
    },
    governmentInternships: [
      {
        name: "DRDO internships (DRDL Hyderabad, RCI Hyderabad, ITR Chandipur and other labs)",
        body: "Defence Research and Development Organisation",
        eligibility: "Engineering and science UG/PG students - DRDO's 2026 notices specifically targeted this group.",
        stipend: "Varies by lab and specific notification - check the current opportunity listing rather than assuming a fixed figure.",
        verify: "drdo.gov.in - current internship notices by laboratory.",
        url: "https://www.drdo.gov.in",
      },
      {
        name: "ISRO opportunities",
        body: "Indian Space Research Organisation",
        eligibility: "Varies by specific notification - typically engineering/science students in relevant specialisations.",
        stipend: "Set by the specific current notification.",
        verify: "isro.gov.in - current internship/opportunity notices.",
        url: "https://www.isro.gov.in",
      },
      {
        name: "CSIR laboratories",
        body: "Council of Scientific & Industrial Research",
        eligibility: "Varies by lab and project - typically science/engineering UG/PG students.",
        stipend: "Set by the specific lab's current notification.",
        verify: "csir.res.in - current laboratory-wise opportunities.",
        url: "https://www.csir.res.in",
      },
    ],
    tracks: [
      {
        name: "Computer Science & AI",
        pathway: "B.Tech/B.Sc/BS (CS, AI/ML, Data Science) → Software/Data/ML roles → Senior → Lead/Staff → Engineering Manager or Director",
        careers: ["Software Engineer", "Data Analyst", "Data Scientist", "ML Engineer", "AI Engineer", "Cybersecurity Analyst", "Cloud Engineer"],
        skills: ["Python", "Git/GitHub", "SQL", "Data Structures & Algorithms", "OOP", "Machine Learning fundamentals", "APIs", "AWS/Azure/GCP fundamentals", "TensorFlow/PyTorch"],
        certifications: ["2-3 meaningful cloud/ML credentials (not 15) plus strong projects matters more than certificate count"],
        pgOptions: ["M.Tech CSE", "MS CS", "MS AI", "MS Data Science", "MS Cybersecurity", "MS Robotics"],
        progression: ["Data/ML Engineer", "Senior ML Engineer", "ML Lead", "Staff/Principal Engineer", "AI/Engineering Manager", "Director/Head of AI"],
      },
      {
        name: "Electronics & Semiconductor",
        pathway: "B.Tech Electronics/Electrical/VLSI → Embedded/Hardware/Semiconductor roles → Senior → Lead → Engineering Manager",
        careers: ["Embedded Engineer", "VLSI Engineer", "Electronics Design Engineer", "Semiconductor Engineer", "Hardware Engineer"],
        skills: ["Embedded C", "Verilog/SystemVerilog", "VLSI", "FPGA", "PCB design", "MATLAB", "Semiconductor fundamentals", "Digital electronics", "Microcontrollers"],
        certifications: ["Vendor-specific FPGA/embedded credentials, chosen for relevance over quantity"],
        pgOptions: ["M.Tech/MS Electronics/VLSI", "MS Physics (Materials Science route)"],
        progression: ["Graduate Engineer", "Engineer", "Senior Engineer", "Lead/Specialist", "Principal Engineer", "Engineering Manager/Technical Director"],
      },
      {
        name: "Mechanical",
        pathway: "B.Tech Mechanical/Mechatronics/Robotics/Aerospace → Design/Manufacturing roles → Senior → Lead → Engineering Manager",
        careers: ["Design Engineer", "Manufacturing Engineer", "Automotive Engineer", "Robotics Engineer", "Thermal Engineer"],
        skills: ["CAD", "SolidWorks/CATIA", "MATLAB", "Manufacturing", "Materials", "Simulation", "ANSYS", "CAD/CAM"],
        certifications: ["CAD-tool-specific certifications (SolidWorks/CATIA/ANSYS) matched to the actual sub-field"],
        pgOptions: ["M.Tech Mechanical", "MS Mechanical", "MBA (for management-track roles)"],
        progression: ["Graduate Engineer", "Engineer", "Senior Engineer", "Lead/Specialist", "Principal Engineer", "Engineering Manager/Technical Director"],
      },
      {
        name: "Civil",
        pathway: "B.Tech Civil/Environmental → Structural/Construction/Transportation roles → Senior → Lead → Engineering Manager",
        careers: ["Structural Engineer", "Construction Engineer", "Transportation Engineer", "Environmental Engineer", "BIM Engineer"],
        skills: ["AutoCAD", "Revit", "BIM", "STAAD.Pro", "ETABS", "GIS", "Structural basics", "Surveying"],
        certifications: ["BIM/STAAD/Revit certifications relevant to the specific sub-field"],
        pgOptions: ["M.Tech Civil/Structural/Environmental", "MS Civil Engineering"],
        progression: ["Graduate Engineer", "Engineer", "Senior Engineer", "Lead/Specialist", "Principal Engineer", "Engineering Manager/Technical Director"],
      },
      {
        name: "Science & Research",
        pathway: "B.Sc/BS/BS-MS (Physics/Chemistry/Biology/Maths) → MSc/MS/Integrated Research → PhD → Postdoctoral research → Scientist/Professor",
        careers: ["Research Assistant", "Laboratory Scientist", "Scientific Data Analyst", "Research Scientist", "Science Communicator", "Statistician", "Quantitative Analyst", "Actuary", "Operations Research Analyst"],
        skills: ["Scientific programming", "Statistics", "Research methodology", "Data analysis", "Literature review", "Scientific writing", "Citation management", "Laboratory techniques"],
        certifications: ["Domain-specific lab/analysis credentials where relevant - a strong publication/project record matters more here than certificates"],
        pgOptions: ["MSc/MS Physics, Chemistry, Mathematics, Statistics or Biology", "Astrophysics/Quantum Physics/Materials Science", "Computational/Materials/Pharmaceutical Chemistry", "Applied Mathematics/Operations Research", "Biotechnology/Molecular Biology/Genetics/Bioinformatics/Computational Biology"],
        progression: ["Research Assistant", "Researcher", "PhD", "Postdoctoral Researcher", "Scientist", "Senior Scientist", "Principal Scientist/Research Director (or Assistant → Associate → full Professor on the academic track)"],
      },
    ],
    abroadPrograms: ["MS Computer Science", "MS AI", "MS Data Science", "MS Cybersecurity", "MS Robotics", "MS Mechanical", "MS Electrical", "MS Electronics", "MS Civil", "MS Aerospace", "MS Chemical", "MSc Physics", "MSc Chemistry", "MSc Biology", "MSc Mathematics", "MSc Statistics", "PhD", "Integrated PhD", "Research master's"],
    abroadJobs: ["Software Engineer", "AI Engineer", "Data Scientist", "Semiconductor Engineer", "Robotics Engineer", "Research Scientist", "Mechanical Engineer", "Electrical Engineer", "Materials Scientist", "Biotech Scientist", "Quantitative Analyst", "Computational Scientist"],
    abroadJobsNote: "Before choosing a destination: compare curriculum, research strength, labs, faculty, funding and tuition at the education stage; check work permit rules, the graduate/post-study work route, professional licensing, industry demand, and salary relative to living cost at the jobs stage.",
    completeJourney: [
      { age: "16-18", stage: "Class 11-12: PCM/PCB/PCMB, Maths/CS where appropriate, entrance preparation, STEM projects" },
      { age: "18-19", stage: "UG Year 1: Core academics, Python, Git, Excel, first project" },
      { age: "19-20", stage: "UG Year 2: Technical specialisation, advanced tools, first serious internship, portfolio" },
      { age: "20-22", stage: "UG Year 3-4: Specialisation, research/industry internship, major project, certification, placement/PG applications" },
      { age: "22-25", stage: "Entry-level: Engineer / Analyst / Scientist / Research Assistant" },
      { age: "25-32", stage: "Specialist: Senior Engineer / Scientist / Data Scientist / Researcher" },
      { age: "32-40", stage: "Senior Specialist / Leadership: Principal Engineer / Research Lead / Engineering Manager / Senior Scientist" },
      { age: "40+", stage: "Leadership / Advanced Research: Technical Director / CTO / Principal Scientist / Research Director / Professor / Founder" },
    ],
    disclaimer: "College names, entrance-exam details, fee levels and internship notices all change - checked against live sources in September 2026, refresh at least annually.",
  },
  "Business Management & Administration": {
    tagline: "A family of careers, not one path - General Management, Marketing, HR, Operations, Business Analytics, Consulting and Entrepreneurship all start from the same foundation and branch from UG Year 2 onward.",
    recommendedStream: "Commerce is the most direct route, but management doesn't require it - Science+Maths and Humanities students both have real, well-documented routes in (e.g. IIM Bodh Gaya's IPM accepts Arts, Commerce and Science streams).",
    subjects: [
      { subject: "English", importance: "Essential", why: "Business communication, presentations, case writing" },
      { subject: "Economics", importance: "Essential", why: "Markets, business cycles, policy - foundational to every management function" },
      { subject: "Business Studies", importance: "Essential", why: "How companies and business functions actually work" },
      { subject: "Mathematics / Applied Mathematics", importance: "Highly recommended", why: "Quantitative reasoning for analytics, finance and operations" },
      { subject: "Accountancy", importance: "Highly recommended", why: "Reading financials - relevant across every management function" },
      { subject: "Computer Science / Informatics Practices", importance: "Highly recommended", why: "Business analytics, digital business, FinTech, e-commerce" },
      { subject: "Psychology", importance: "Useful", why: "HR and consumer-behaviour-focused routes" },
      { subject: "Entrepreneurship", importance: "Useful", why: "Startup/business-ownership track" },
      { subject: "Statistics", importance: "Useful", why: "Analytics track" },
      { subject: "Political Science", importance: "Useful", why: "Public administration / international business" },
    ],
    subjectCombinations: [
      { name: "Option 1 - Commerce", combo: "Accountancy + Business Studies + Economics + Mathematics/Applied Maths - best for Business Management, Finance, Marketing, Entrepreneurship, HR, Operations, Business Analytics" },
      { name: "Option 2 - Commerce + Computer Science/IP", combo: "Accountancy + Business Studies + Economics + Computer Science/IP + English - for Business Analytics, Digital Business, FinTech, E-commerce, Technology Management" },
      { name: "Option 3 - Science + Mathematics (PCM/PCMB)", combo: "Science students can enter management too - useful for Business Analytics, Operations, Consulting, Technology Management, Entrepreneurship, Product Management" },
      { name: "Option 4 - Humanities", combo: "Economics + Psychology + Mathematics/Applied Maths + Political Science/other relevant subjects - for HR, Marketing, Management, Consumer Behaviour, Entrepreneurship, International Business" },
    ],
    degreeGroups: [
      { category: "General management", degrees: ["BBA", "BBA (Hons.)", "BMS - Bachelor of Management Studies", "BBM - Bachelor of Business Management", "B.Com", "B.Com (Hons.)", "B.Com Management", "B.Com Business Administration"] },
      { category: "Marketing", degrees: ["BBA Marketing", "BBA Management & Marketing", "BBA Branding & Advertising", "BBA Digital Marketing", "BBA Sales & Marketing"] },
      { category: "Human Resources", degrees: ["BBA Human Resource Management", "BBA HR", "BBA/BMS with HR specialisation"] },
      { category: "Entrepreneurship", degrees: ["BBA Entrepreneurship", "BBA Innovation & Entrepreneurship", "BBA Family Business", "BMS Entrepreneurship"] },
      { category: "International Business", degrees: ["BBA International Business", "BBA Global Business", "BBA International Management"] },
      { category: "Operations / Supply Chain", degrees: ["BBA Operations", "BBA Logistics & Supply Chain Management", "BBA Operations & Supply Chain", "BMS Operations"] },
      { category: "Business Analytics", degrees: ["BBA Business Analytics", "BBA Business Analytics & Intelligence", "B.Sc Business Analytics", "BMS Business Analytics"] },
      { category: "Digital Business / Technology Management", degrees: ["BBA Digital Business", "BBA FinTech", "BBA Technology Management", "BBA E-Commerce"] },
      { category: "Economics / quantitative management", degrees: ["BA Economics", "BA Economics (Hons.)", "B.Sc Economics", "B.Sc Statistics", "B.Sc Data Science"] },
      { category: "Integrated Management (5-year, straight from Class 12)", degrees: ["IIM Indore IPM", "IIM Rohtak IPM", "IIM Jammu IPM", "IIM Bodh Gaya IPM (exit with a BBA possible after 3 years under its current structure)"] },
    ],
    decisionTree: [
      { goal: "general management/corporate track", path: "BBA/BMS/B.Com → Management Trainee → Business Analyst → Manager → Director" },
      { goal: "marketing or brand", path: "BBA Marketing → Marketing Executive → Brand/Marketing Analyst → Brand Manager → CMO" },
      { goal: "HR", path: "BBA HR → HR Executive → HR Analyst → HR Business Partner → CHRO" },
      { goal: "operations or supply chain", path: "BBA Operations/Logistics → Operations Executive → Operations Manager → COO" },
      { goal: "business analytics", path: "BBA/B.Sc Business Analytics → Excel → SQL → Power BI → Python → Business Analyst → Analytics Manager" },
      { goal: "consulting or strategy", path: "BBA/BMS/Economics → Analyst → Consultant → Senior Consultant → Partner" },
      { goal: "your own business", path: "UG + startup/family-business experience → Founder/Co-founder → Business growth → Entrepreneur" },
    ],
    collegeTiers: [
      {
        tier: "Government / public (Delhi University)",
        note: "Check the current CUET-UG subject combination and DU admission rules for the specific programme rather than relying on an old combination.",
        colleges: [
          { name: "Shaheed Sukhdev College of Business Studies", route: "BMS, BBA(FIA) - particularly relevant for management, business analytics or finance-oriented management" },
          { name: "Deen Dayal Upadhyaya College", route: "BMS" },
          { name: "Sri Guru Gobind Singh College of Commerce", route: "B.Com, B.Com (Hons.)" },
          { name: "Sri Venkateswara College", route: "Commerce, Economics" },
          { name: "Ramjas / other DU colleges", route: "Commerce, Economics, business foundations" },
        ],
      },
      {
        tier: "Integrated Management - the public IIM route",
        note: "Instead of 12th → BBA → MBA, a student can enter 12th → 5-year IPM → Bachelor's + MBA directly. IIM Indore runs its own IPM Aptitude Test (IPM AT); IIM Bodh Gaya and IIM Jammu's 2026 admission uses JIPMAT (conducted by NTA).",
        colleges: [
          { name: "IIM Indore IPM", route: "5-year Integrated Programme in Management, via IPM AT" },
          { name: "IIM Rohtak / IIM Jammu / IIM Bodh Gaya IPM", route: "5-year IPM, via JIPMAT (Bodh Gaya, Jammu)" },
        ],
      },
      {
        tier: "Private",
        note: "Not a universal \"top 5\" - the right choice depends on programme, fees, location and placement outcomes.",
        colleges: [
          { name: "NMIMS", route: "BBA, BBA Finance, BBA Management & Marketing, BBA International Business, BBA Branding & Advertising, Integrated BBA-MBA, BBA FinTech; via NPAT" },
          { name: "Christ University", route: "BBA and specialisations, B.Com specialisations, business-oriented programmes" },
          { name: "Symbiosis", route: "BBA, BBA Honours, BBA Honours with Research; via SET" },
          { name: "St. Joseph's University / Manipal / other established private universities", route: "BBA and business-school programmes" },
        ],
      },
    ],
    financialSupportNote: "Prioritise the government/public college and IPM routes first (real fee advantage over private business schools), then established private universities where a specific specialisation is worth the extra cost. Entrance prep should target Quantitative Ability, Verbal Ability, Logical Reasoning and General Awareness (business news, economy, major companies, government/business policy) - the common core across CUET-UG, IPM AT, JIPMAT, NPAT and SET.",
    yearPlan: [
      { year: "Year 1", academicFocus: "Principles of Management, Microeconomics, Business Communication, Accounting, Business Mathematics, Business Statistics, Organisational Behaviour", skills: "Excel (pivot tables, XLOOKUP, SUMIFS, dashboards, data cleaning), PowerPoint (business presentations, pitch decks), professional communication", experience: "Forage business simulations, HubSpot Academy, Google digital marketing learning, case/entrepreneurship competitions, college startup cells", output: "Company business-model analysis, Excel sales dashboard, competitor analysis, startup business plan" },
      { year: "Year 2", academicFocus: "Choose a specialisation: Marketing, HR, Operations, Business Analytics, Entrepreneurship or Consulting/Strategy - each with its own tool stack (see tracks below)", skills: "Specialisation-specific tools", experience: "Digital Marketing/HR/Operations/Business Analyst/Startup internships", output: "First real internship in the chosen function" },
      { year: "Year 3", academicFocus: "Become genuinely employable in the chosen function", skills: "Deepen specialisation tools", experience: "Higher-quality internships (consulting, strategy, product management, corporate strategy, investment/finance) at big companies, consulting firms, startups, banks, e-commerce, FMCG, tech, or government/PSU (NITI Aayog, ministries, RBI, SEBI, NABARD, public-sector banks)", output: "A serious functional internship on the resume" },
      { year: "Year 4", academicFocus: "Convert skills into a job, PG programme or business venture", skills: "Case interviews (for consulting), placement interview prep", experience: "2nd/major internship, case competitions, a live business project", output: "Certification + placement or PG decision" },
    ],
    virtualSimulations: {
      platform: "Forage / HubSpot Academy / Google",
      note: "Free business simulations and skill certificates - real experience and portfolio value, but not a substitute for calling it employment.",
      items: [
        { name: "Forage business simulations", skills: ["Case-style business tasks across real employers"] },
        { name: "HubSpot Academy", skills: ["Inbound marketing", "CRM", "Content marketing"] },
        { name: "Google digital marketing learning", skills: ["Google Analytics", "Google Ads fundamentals"] },
        { name: "Business case / entrepreneurship competitions", skills: ["Structured problem solving", "Pitching", "Team-based analysis"] },
      ],
    },
    governmentInternships: [
      {
        name: "NITI Aayog / Ministry internships",
        body: "Government of India",
        eligibility: "Varies by scheme and ministry - check the current official notification.",
        stipend: "Set by the specific current scheme.",
        verify: "Check the specific ministry's or NITI Aayog's current internship notification rather than relying on a fixed deadline.",
        url: "https://www.niti.gov.in",
      },
      {
        name: "RBI / SEBI / NABARD / public-sector bank opportunities",
        body: "RBI, SEBI, NABARD and PSU banks",
        eligibility: "Varies by institution and scheme - several are PG-level (see the Finance cluster's own roadmap for RBI/NABARD's specific gating).",
        stipend: "Set by the specific current notification.",
        verify: "Check each institution's own current opportunities page - eligibility and windows change every cycle.",
        url: "https://opportunities.rbi.org.in",
      },
      {
        name: "PSU management/HR/operations functions",
        body: "Various public-sector undertakings",
        eligibility: "Varies by PSU and function.",
        stipend: "Set by the specific current notification.",
        verify: "Check the specific PSU's current careers/internship page.",
        url: "https://www.india.gov.in",
      },
    ],
    tracks: [
      {
        name: "General Management",
        pathway: "BBA/BMS/B.Com → Management Trainee → Business Analyst → Manager → Director",
        careers: ["Management Trainee", "Business Analyst", "Business Operations Analyst", "Strategy Analyst", "Management Associate"],
        skills: ["Excel", "PowerPoint", "Business communication", "Business analysis", "Basic accounting", "Basic finance", "Statistics", "Project management"],
        certifications: ["CAPM → PMP (subject to eligibility) for a project-management lean"],
        pgOptions: ["MBA", "MiM (Master in Management)"],
        progression: ["Management Trainee", "Business Analyst/Associate", "Manager", "Senior Manager", "Director", "Business Unit Head/General Manager"],
      },
      {
        name: "Marketing",
        pathway: "BBA Marketing → Marketing Executive → Brand/Marketing Analyst → Brand Manager → Marketing Director → CMO",
        careers: ["Marketing Executive", "Brand Executive", "Digital Marketing Specialist", "Marketing Analyst", "Market Research Analyst", "Brand Manager"],
        skills: ["Consumer behaviour", "Digital marketing", "SEO", "Social media analytics", "Google Analytics", "Advertising", "Brand strategy"],
        certifications: ["Google Analytics", "Google Ads", "HubSpot", "Meta Blueprint"],
        pgOptions: ["MBA Marketing", "MSc Marketing"],
        progression: ["Marketing Executive", "Marketing Manager", "Senior Marketing Manager", "Marketing Director", "CMO"],
      },
      {
        name: "Human Resources",
        pathway: "BBA HR → HR Executive → HR Analyst → HR Business Partner → HR Director → CHRO",
        careers: ["HR Executive", "Recruiter", "Talent Acquisition Specialist", "HR Analyst", "HR Operations Specialist"],
        skills: ["Recruitment", "Talent management", "Performance management", "HR analytics", "Labour laws", "Organisational behaviour", "HRIS"],
        certifications: ["SHRM-oriented learning", "HR analytics certifications", "HRIS certifications"],
        pgOptions: ["MBA HR", "MA/MSc HRM"],
        progression: ["HR Executive", "HR Manager", "Senior HR Manager", "HR Director", "CHRO"],
      },
      {
        name: "Operations",
        pathway: "BBA Operations/Logistics → Operations Executive → Operations Manager → Head of Operations → COO",
        careers: ["Operations Analyst", "Operations Executive", "Supply Chain Analyst", "Procurement Analyst", "Logistics Analyst"],
        skills: ["Supply chain", "Procurement", "Inventory", "Logistics", "Operations research", "Process improvement", "ERP", "Lean/Six Sigma"],
        certifications: ["Lean Six Sigma Yellow/Green Belt"],
        pgOptions: ["MBA Operations", "Supply Chain Management", "Operations Research"],
        progression: ["Operations Analyst", "Operations Manager", "Senior Operations Manager", "Head of Operations", "COO"],
      },
      {
        name: "Business Analytics",
        pathway: "BBA/B.Sc Business Analytics → Business Analyst → Senior Business Analyst → Analytics Consultant → Head of Analytics",
        careers: ["Business Analyst", "BI Analyst", "Business Intelligence Associate", "Product Analyst"],
        skills: ["Excel", "SQL", "Power BI", "Python", "Statistics", "Data visualisation"],
        certifications: ["Power BI/SQL vendor certifications, chosen for relevance"],
        pgOptions: ["MSc Business Analytics", "MBA Business Analytics", "MSc Data/Business Analytics"],
        progression: ["Business Analyst", "Senior Business Analyst", "Analytics Consultant", "Analytics Manager", "Head of Analytics"],
      },
      {
        name: "Consulting / Strategy",
        pathway: "BBA/BMS/Economics → Analyst → Consultant → Senior Consultant → Partner",
        careers: ["Business Analyst", "Consulting Analyst", "Strategy Analyst", "Management Consultant"],
        skills: ["Case interviews", "Market sizing", "Business analysis", "Financial basics", "PowerPoint", "Excel", "Strategic frameworks"],
        certifications: ["No mandatory certification - case-interview readiness and a strong resume matter most here"],
        pgOptions: ["MBA", "MSc Management"],
        progression: ["Analyst", "Consultant", "Senior Consultant", "Manager", "Principal", "Partner"],
      },
      {
        name: "Entrepreneurship",
        pathway: "UG + startup/family-business experience → Founder/Co-founder → Business growth → Entrepreneur/Business Owner",
        careers: ["Founder", "Co-founder", "Startup Operations", "Founder's Office Associate"],
        skills: ["Business model design", "Market research", "Customer discovery", "Unit economics", "Startup finance", "Pitching", "Fundraising basics"],
        certifications: ["Startup accelerator/incubator programmes over formal certifications"],
        pgOptions: ["MBA Entrepreneurship", "Startup accelerator/incubator experience in place of a further degree"],
        progression: ["Business Idea", "Founder", "Product-Market Fit", "Business Growth", "CEO/Business Owner"],
      },
    ],
    abroadPrograms: ["MiM (Master in Management)", "MBA", "MSc Marketing", "MSc Human Resource Management", "MSc Business Analytics", "MSc Supply Chain Management", "MSc International Business", "MSc Management", "MSc Entrepreneurship", "MSc Strategy", "MSc Operations Management"],
    abroadJobs: ["Business Analyst", "Management Consultant", "Strategy Analyst", "Marketing Analyst", "Brand Specialist", "Digital Marketing Specialist", "HR Analyst", "Talent Acquisition Specialist", "HR Business Partner", "Operations Analyst", "Supply Chain Analyst", "Procurement Analyst", "Product Analyst", "Business Intelligence Analyst"],
    abroadJobsNote: "Evaluate degree cost, work rights, internship access, employment outcomes, local demand, and long-term visa/work options - not just whether the programme or role sounds prestigious.",
    completeJourney: [
      { age: "16-18", stage: "Class 11-12: Commerce/Science/Humanities, business fundamentals, Excel + communication, business projects, entrance preparation" },
      { age: "18-19", stage: "UG Year 1: Management fundamentals - Excel, PowerPoint, communication, accounting, economics, statistics; 2 business projects + first virtual experience" },
      { age: "19-20", stage: "UG Year 2: Choose a specialisation (Marketing/HR/Operations/Analytics/Entrepreneurship/Consulting/International Business), learn its tools, first real internship" },
      { age: "20-22", stage: "UG Year 3-4: Advanced specialisation, 2nd/major internship, case competitions, live business project, certification, placement/PG decision" },
      { age: "21-25", stage: "Early career: Management Trainee/Analyst/Executive, building functional expertise" },
      { age: "25-32", stage: "Professional growth: Senior Analyst → Assistant Manager → Manager" },
      { age: "32-40", stage: "Leadership: Senior Manager → Director/Functional Head" },
      { age: "40+", stage: "Senior leadership: Business Unit Head / General Manager / Director / VP / CMO / CHRO / COO / CEO / Entrepreneur" },
    ],
    disclaimer: "College names, entrance-exam formats, fee levels and internship notices all change - checked against live sources in September 2026, refresh at least annually.",
  },
  "Marketing": {
    tagline: "Marketing is not one career - it branches into Brand Management, Digital Marketing, Performance Marketing, Market Research/Consumer Insights, Product Marketing, Content/Social Media and CRM/Marketing Automation, each with its own tools, metrics and career ladder.",
    recommendedStream: "Marketing does not require Commerce - Commerce, Humanities and even Science students all have real, documented routes in, each suited to slightly different marketing sub-fields.",
    subjects: [
      { subject: "English", importance: "Essential", why: "Copywriting, campaigns, client communication" },
      { subject: "Economics", importance: "Essential", why: "Markets, consumer spending, pricing" },
      { subject: "Business Studies", importance: "Essential", why: "How brands and businesses actually operate" },
      { subject: "Mathematics / Applied Mathematics", importance: "Essential", why: "Marketing analytics, performance metrics" },
      { subject: "Psychology", importance: "Highly recommended", why: "Consumer behaviour, brand strategy, advertising" },
      { subject: "Computer Science / Informatics Practices", importance: "Highly recommended", why: "Digital marketing, marketing analytics, growth marketing, MarTech" },
      { subject: "Accountancy", importance: "Useful", why: "Reading business/brand financials" },
      { subject: "Statistics", importance: "Useful", why: "Market research and marketing analytics" },
    ],
    subjectCombinations: [
      { name: "Option 1 - Commerce", combo: "Business Studies + Economics + Accountancy + Mathematics/Applied Maths - best for Marketing, Brand Management, Business Management, Market Research, Marketing Analytics, Entrepreneurship" },
      { name: "Option 2 - Commerce + Computer Science/IP", combo: "Useful for Digital Marketing, Marketing Analytics, Growth Marketing, E-commerce, MarTech" },
      { name: "Option 3 - Humanities", combo: "Economics + Psychology + English + Mathematics/Applied Maths - particularly useful for Consumer Behaviour, Advertising, Brand Strategy, Market Research, Communications" },
      { name: "Option 4 - Science (PCM/PCB/PCMB)", combo: "Genuinely useful for Product Marketing, Technology Marketing, Healthcare/Pharma Marketing, Technical B2B Marketing, Data-driven Marketing" },
    ],
    degreeGroups: [
      { category: "Direct marketing degrees", degrees: ["BBA Marketing", "BBA Management & Marketing", "BBA Digital Marketing", "BBA Marketing Management", "BBA Advertising & Branding", "BBA Brand Management", "BBA Sales & Marketing", "BBA Retail Management", "BBA International Business"] },
      { category: "General management degrees (all lead into marketing)", degrees: ["BBA", "BBA (Hons.)", "BMS", "BBM", "B.Com", "B.Com (Hons.)"] },
      { category: "Economics / analytics routes", degrees: ["BA Economics", "B.Sc Economics", "B.Sc Statistics", "B.Sc Data Science", "B.Sc Business Analytics"] },
      { category: "Communication / advertising routes", degrees: ["BA Advertising", "BA Mass Communication", "BA Journalism & Mass Communication", "BA Media Studies", "Advertising & Public Relations programmes"] },
      { category: "Design route", degrees: ["B.Des Communication Design", "B.Des Visual Communication", "B.Des Interaction/Communication-related programmes"] },
    ],
    decisionTree: [
      { goal: "digital marketing (SEO, SEM, social, ads)", path: "Any marketing/management degree → HubSpot Academy + Google Skillshop → Digital Marketing track below" },
      { goal: "brand management", path: "BBA/BMS/B.Com → Brand Management track below" },
      { goal: "performance marketing / growth", path: "Any marketing/management degree → Google Ads/Meta Ads certification → Performance Marketing track below" },
      { goal: "market research / consumer insights", path: "BA/B.Sc Economics/Statistics/Data Science → SPSS/R/Python → Market Research track below" },
      { goal: "product marketing", path: "Any marketing/management/Science degree → Product Marketing track below" },
      { goal: "content or social media", path: "Any degree + a genuine portfolio → Content/Social Media track below" },
      { goal: "CRM or marketing automation", path: "Any marketing/management degree → CRM/Marketing Automation track below" },
    ],
    collegeTiers: [
      {
        tier: "Government / public (Delhi University and IPM)",
        note: "DU Commerce colleges are primarily Commerce/Economics routes rather than specialised marketing degrees, but give a strong base for a later marketing career.",
        colleges: [
          { name: "Shaheed Sukhdev College of Business Studies", route: "BMS, BBA(FIA) - strong foundation for marketing, management, analytics or finance-related careers" },
          { name: "Shri Ram College of Commerce / Sri Guru Gobind Singh College of Commerce / Hindu College / Hans Raj College / Ramjas College", route: "Commerce/Economics routes" },
          { name: "IIM Indore IPM", route: "5-year Integrated Programme in Management, via IPM Aptitude Test" },
        ],
      },
      {
        tier: "Private",
        note: "Evaluate on marketing curriculum, internships, industry exposure, placement data, fees and location - not on name alone.",
        colleges: [
          { name: "NMIMS", route: "BBA Management & Marketing - curriculum explicitly covers Digital Marketing, Marketing Research, Marketing Analytics, Sales & Distribution, Channel Management, Neuromarketing, Emerging Media; via NPAT" },
          { name: "Christ University", route: "BBA and specialisations, B.Com, business/management programmes" },
          { name: "Symbiosis", route: "BBA, management programmes; via SET" },
          { name: "St. Joseph's University / other established private universities", route: "Management, Commerce, business-related programmes" },
        ],
      },
    ],
    financialSupportNote: "Economical route: government college → B.Com/BMS/BA Economics/BBA where affordable → free/low-cost marketing certifications (HubSpot Academy, Google Skillshop) → internships → marketing portfolio → MBA/PG later if required. This can be significantly cheaper than a specialised private BBA. Entrance prep centres on Quantitative Ability, Verbal, Logical Reasoning and General Awareness (brands, ad campaigns, business news, consumer trends, e-commerce, startups) across CUET-UG, IPMAT, NPAT and SET.",
    yearPlan: [
      { year: "Year 1", academicFocus: "Principles of Marketing, Consumer Behaviour, Business Economics, Business Communication, Business Statistics, Accounting fundamentals, Organisational Behaviour", skills: "Excel (pivot tables, XLOOKUP, SUMIFS, dashboards), PowerPoint (campaign proposals, brand decks), Canva/Figma basics, copywriting; concepts: STP, 4Ps/7Ps, marketing funnel, customer journey, brand positioning, market segmentation", experience: "HubSpot Digital Marketing certification (free)", output: "2 brand analyses + 1 consumer survey + 1 social-media audit → Marketing Portfolio #1" },
      { year: "Year 2", academicFocus: "Choose one primary specialisation: Digital / Brand / Performance / Research / Product / Content / CRM", skills: "Specialisation-specific tools (see tracks below)", experience: "First real marketing internship (social media/content/marketing/community/event-marketing intern)", output: "2 specialisation projects (e.g. a Performance Marketing student builds a Google/Meta campaign simulation and calculates CTR/CPC/CPA/ROAS)" },
      { year: "Year 3", academicFocus: "Become genuinely employable in the chosen specialisation", skills: "Advanced specialisation skills (Digital: ads+analytics+SEO+CRO · Brand: consumer research+positioning+campaign strategy · Analytics: SQL+Power BI+statistics · Product: GTM+positioning+customer research · Research: statistics+survey design+reporting)", experience: "A serious internship at an FMCG/SaaS/E-commerce/agency/consumer-tech/startup/media company - also check the AICTE National Internship Portal, which lists verified marketing internships (digital, content & social, SEO, market research) free to register for, across companies, NGOs and government/public-sector programmes", output: "One major marketing campaign + one major internship + portfolio" },
      { year: "Year 4", academicFocus: "Convert skills into a career", skills: "Marketing case-interview preparation, aptitude prep where required", experience: "Final marketing project, campaign case study, internship", output: "Degree + specialisation + 2-3 internships + portfolio + relevant certifications + job/PG plan" },
    ],
    virtualSimulations: {
      platform: "HubSpot Academy / Google Skillshop",
      note: "Both are genuinely free and give real, verifiable certifications - not equivalent to paid employment, but real skill proof for a portfolio.",
      items: [
        { name: "HubSpot Academy", skills: ["SEO", "Content", "Social Media", "Email", "Lead generation", "Reporting", "Digital strategy", "Digital Advertising"] },
        { name: "Google Skillshop", skills: ["Google Ads", "Google Analytics", "Google Marketing Platform"] },
      ],
    },
    governmentInternships: [
      {
        name: "AICTE National Internship Portal (NIP)",
        body: "AICTE",
        eligibility: "Open registration, free to use - lists verified marketing internships (Digital Marketing, Content & Social Media Marketing, SEO, Market Research) across companies, NGOs and government/public-sector programmes, both paid and unpaid.",
        stipend: "Varies by individual listing - portal access itself is free (₹0 to register/apply), but that doesn't mean every listed internship is paid.",
        verify: "internship.aicte-india.org - current listings.",
        url: "https://internship.aicte-india.org",
      },
    ],
    tracks: [
      {
        name: "Digital Marketing",
        pathway: "Any marketing/management degree → Digital Marketing Executive → Digital Marketing Specialist → Digital Marketing Manager → Head of Digital Marketing",
        careers: ["Digital Marketing Executive", "Digital Marketing Specialist", "SEO Specialist", "SEM Specialist", "Social Media Specialist"],
        skills: ["SEO", "SEM", "Social Media Marketing", "Email Marketing", "Content Marketing", "Google Analytics", "Google Ads", "Meta Ads", "Conversion optimisation"],
        certifications: ["Google Skillshop (Ads, Analytics)", "HubSpot Academy (Digital Marketing, Social Media, Content, Advertising, Email)"],
        pgOptions: ["MBA Marketing", "MSc Digital Marketing", "specialised digital marketing master's"],
        progression: ["Digital Marketing Executive", "Digital Marketing Specialist", "Digital Marketing Manager", "Head of Digital Marketing", "VP Digital/Growth", "CMO"],
      },
      {
        name: "Brand Management",
        pathway: "BBA/BMS/B.Com → Brand Executive → Assistant Brand Manager → Brand Manager → Senior Brand Manager → Marketing Director",
        careers: ["Brand Executive", "Assistant Brand Manager", "Brand Manager"],
        skills: ["Consumer psychology", "Brand positioning", "Brand architecture", "Campaign strategy", "Product lifecycle", "Market research", "Pricing", "Competitive strategy"],
        certifications: ["No single mandatory certification - projects, internships and strong business fundamentals matter more"],
        pgOptions: ["MBA Marketing", "PGDM Marketing"],
        progression: ["Marketing Executive", "Assistant Brand Manager", "Brand Manager", "Senior Brand Manager", "Marketing Director", "VP Marketing", "CMO"],
      },
      {
        name: "Performance Marketing",
        pathway: "Any marketing/management degree → Performance Marketing Analyst → Performance Marketing Specialist → Performance Marketing Manager → Growth/Performance Head",
        careers: ["Performance Marketing Analyst", "Performance Marketing Specialist", "Growth Marketing Specialist"],
        skills: ["CAC", "ROAS", "CTR", "CPC", "CPL", "CPA", "CPM", "A/B testing", "Landing-page optimisation", "Attribution", "Google Ads", "Meta Ads Manager", "Looker Studio"],
        certifications: ["Google Skillshop", "Meta Ads certifications"],
        pgOptions: ["MSc Marketing Analytics", "MSc Business Analytics", "MBA Business Analytics"],
        progression: ["Performance Marketing Analyst", "Performance Marketing Specialist", "Growth Marketing Manager", "Head of Growth", "VP Growth/CMO"],
      },
      {
        name: "Market Research / Consumer Insights",
        pathway: "BA/B.Sc Economics/Statistics/Data Science → Research Executive → Consumer Insights Analyst → Research Manager → Consumer Insights Director",
        careers: ["Market Research Analyst", "Consumer Insights Analyst", "Research Executive"],
        skills: ["Survey design", "Sampling", "SPSS/R/Python", "Statistics", "Regression basics", "Qualitative research", "Quantitative research", "Data visualisation"],
        certifications: ["Statistical-tool certifications (SPSS/R/Python) chosen for relevance over quantity"],
        pgOptions: ["MSc Marketing Research", "MSc Consumer Behaviour", "MSc Market Research"],
        progression: ["Research Executive", "Consumer Insights Analyst", "Research Manager", "Consumer Insights Director", "VP Consumer Insights"],
      },
      {
        name: "Product Marketing",
        pathway: "Any marketing/management/Science degree → Product Marketing Associate → Product Marketing Manager → Senior Product Marketing Manager → Product Marketing Director",
        careers: ["Product Marketing Associate", "Product Marketing Manager"],
        skills: ["Product positioning", "Customer research", "Competitor analysis", "Go-to-market strategy", "Product launches", "Messaging", "Sales enablement", "Product analytics"],
        certifications: ["Product-marketing-specific certificate programmes, optional - GTM project experience matters more"],
        pgOptions: ["MBA Marketing", "MBA Product/Technology Management", "relevant specialised master's"],
        progression: ["Product Marketing Associate", "Product Marketing Manager", "Senior Product Marketing Manager", "Product Marketing Director"],
      },
      {
        name: "Content / Social Media",
        pathway: "Any degree + a genuine portfolio → Content Executive → Content Strategist → Content Manager → Head of Content",
        careers: ["Content Writer", "Content Strategist", "Copywriter", "Social Media Manager"],
        skills: ["Copywriting", "Content strategy", "Short-form video", "Storytelling", "Social media strategy", "Community management", "Content analytics"],
        certifications: ["A strong public portfolio matters more than any single certificate here"],
        pgOptions: ["Master's in Advertising", "Strategic Communications", "Brand/Media programmes"],
        progression: ["Content Executive", "Content Strategist", "Content Manager", "Head of Content"],
      },
      {
        name: "CRM / Marketing Automation",
        pathway: "Any marketing/management degree → CRM Executive → Lifecycle Marketing Specialist → CRM Manager → Customer Lifecycle/Retention Head",
        careers: ["CRM Executive", "Lifecycle Marketing Specialist", "Marketing Automation Specialist"],
        skills: ["CRM", "Email marketing", "Customer segmentation", "Lifecycle marketing", "Lead nurturing", "Marketing automation", "Retention", "Customer lifetime value"],
        certifications: ["HubSpot Academy (CRM/automation modules)"],
        pgOptions: ["MBA Marketing", "MSc Marketing Analytics"],
        progression: ["CRM Executive", "Lifecycle Marketing Specialist", "CRM Manager", "Customer Lifecycle/Retention Head"],
      },
    ],
    abroadPrograms: ["MSc Marketing", "MSc Digital Marketing", "MSc Marketing Analytics", "MSc Consumer Behaviour", "MSc Strategic Marketing", "MSc Brand Management", "MSc Advertising", "MSc Communications", "MSc International Marketing", "MSc Business Analytics", "MBA (usually more useful after work experience)"],
    abroadJobs: ["Marketing Analyst", "Digital Marketing Specialist", "Brand Specialist", "Product Marketing Associate", "Consumer Insights Analyst", "Growth Marketing Specialist", "Marketing Operations Specialist", "CRM Specialist", "Marketing Data Analyst"],
    abroadJobsNote: "Compare tuition, internship opportunities, work authorisation, employment outcomes, the local marketing ecosystem and cost of living before choosing a destination.",
    completeJourney: [
      { age: "16-18", stage: "Class 11-12: Business/Economics/Psychology/Maths + communication, 5 marketing projects, marketing portfolio" },
      { age: "18-19", stage: "UG Year 1: Marketing fundamentals + Excel + portfolio, HubSpot certification" },
      { age: "19-20", stage: "UG Year 2: Choose Digital/Brand/Performance/Research/Product/Content/CRM, first real internship" },
      { age: "20-22", stage: "UG Year 3-4: Advanced skills + major internship, portfolio + placement + specialisation" },
      { age: "22-25", stage: "Early career: Marketing Executive / Analyst / Specialist" },
      { age: "25-32", stage: "Mid career: Manager → Senior Manager" },
      { age: "32-40", stage: "Senior career: Director / VP" },
      { age: "40+", stage: "Long-term: CMO / Marketing Director / Growth Head / Brand Director / Marketing Consultant / Entrepreneur" },
    ],
    disclaimer: "College names, entrance-exam formats, fee levels and internship notices all change - checked against live sources in September 2026, refresh at least annually.",
  },
};

export function flagshipRoadmapFor(cluster: string): FlagshipDomainRoadmap | null {
  return FLAGSHIP_ROADMAPS_1112[cluster] ?? null;
}
