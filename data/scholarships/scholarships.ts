/**
 * Scholarship directory - real, currently running national, CSR and
 * study-abroad schemes only. Every entry was re-checked on 2026-10-03:
 *
 * - NSP schemes: dates come from the official scheme list at
 *   scholarships.gov.in/All-Scholarships (AY 2026-27), amounts and rules
 *   from the ministries' own guidelines.
 * - CSR and study-abroad schemes: from the provider's site where it states
 *   the detail, otherwise from recent news coverage of the launch. Those
 *   dates are marked `tentative: true` and shown as "reported" in the UI.
 *
 * Removed: Begum Hazrat Mahal National Scholarship (the Maulana Azad
 * Education Foundation that ran it was ordered closed in February 2024).
 * Nothing here is invented: where a figure is not published, the text says
 * so instead of guessing.
 */
import type { Rule } from "@/lib/scholarships/eligibility";

export type ScholarshipType = "merit" | "means" | "merit_means" | "category" | "group" | "abroad";

export type CycleStatus = "open" | "closed" | "upcoming" | "renewal-only" | "varies";

export interface ScholarshipCycle {
  year: string; // e.g. "2026-27"
  status: CycleStatus; // as of `checkedAt`; the UI recomputes open/closed from the dates
  opensAt?: string; // YYYY-MM-DD
  closesAt?: string; // last date for student applications
  verifyBy?: string; // institute (first-level) verification deadline on NSP
  l2VerifyBy?: string; // district/state (second-level) verification deadline on NSP
  tentative: boolean; // true when the date is reported, not read from the official portal
  note?: string;
  sourceUrl: string;
}

export interface ScholarshipDef {
  slug: string;
  name: string;
  provider: string;
  type: ScholarshipType;
  officialUrl: string;
  applyVia: string;
  amountText: string;
  amountPerYearInr: number | null; // for ranking; null when genuinely unknown
  years: number | null;
  deadlineNote: string;
  rules: Rule[];
  sourceUrl: string;
  checkedAt: string;
  cycle?: ScholarshipCycle;
  /** What you must do each year to keep the money. */
  renewal?: string;
  /** Minimum marks (%) to renew, used to warn learners whose marks are close. */
  renewalMinPct?: number;
  /** NSP from AY 2026-27: one merit-based scheme plus any welfare-based schemes. */
  nspKind?: "merit" | "welfare";
  selection?: string;
  hasTestOrInterview?: boolean;
}

const NSP = "https://scholarships.gov.in/";
const NSP_LIST = "https://scholarships.gov.in/All-Scholarships";
const CHECKED = "2026-10-03";

/** The common NSP 2026-27 window, read from the official scheme list. */
const NSP_2026 = (opensAt = "2026-06-01"): ScholarshipCycle => ({
  year: "2026-27",
  status: "open",
  opensAt,
  closesAt: "2026-10-31",
  verifyBy: "2026-11-15",
  l2VerifyBy: "2026-11-30",
  tentative: false,
  sourceUrl: NSP_LIST,
});

const UG = ["ug1", "ug2", "ug3", "ug4"];
const UG_PG = [...UG, "pg"];
const POST_MATRIC = ["class11", "class12", ...UG_PG];
const GRADUATES = ["ug4", "pg", "working"];
const NE_STATES = ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"];

export const SCHOLARSHIPS: ScholarshipDef[] = [
  // ---------------------------------------------------------------- Merit
  {
    slug: "central-sector-scheme",
    name: "Central Sector Scheme of Scholarships for College and University Students (CSSS)",
    provider: "Department of Higher Education, Ministry of Education (PM-USP)",
    type: "merit",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹12,000 a year for the first three years of a degree; ₹20,000 a year in years 4 and 5 of professional courses and at PG level",
    amountPerYearInr: 12000, years: 3,
    deadlineNote: "2026-27: NSP lists CSSS for renewals only. Renewal applications closed on 30 September 2026; college verification ran to 15 October.",
    rules: [
      { type: "level", oneOf: ["ug1"], label: "first-year degree students (later years renew)" },
      { type: "note", text: "Above the 80th percentile of successful candidates in your stream and board in Class 12. Regular degree courses only, not distance or diploma." },
      { type: "incomeMax", valueInr: 450000 },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "closed", opensAt: "2026-06-01", closesAt: "2026-09-30", verifyBy: "2026-10-15", l2VerifyBy: "2026-10-30", tentative: false, note: "Listed on NSP for renewals only in 2026-27.", sourceUrl: NSP_LIST },
    renewal: "At least 50% marks in the previous year's exam and 75% attendance. Renew on NSP every year.",
    renewalMinPct: 50,
    nspKind: "merit",
    selection: "Class 12 board merit (80th percentile); 82,000 fresh awards a year, half for girls",
  },
  {
    slug: "inspire-she",
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    provider: "Department of Science & Technology",
    type: "merit",
    officialUrl: "https://online-inspire.gov.in/",
    applyVia: "INSPIRE portal",
    amountText: "₹80,000 a year: ₹60,000 scholarship plus a ₹20,000 summer research mentorship grant",
    amountPerYearInr: 80000, years: 5,
    deadlineNote: "The previous call closed on 31 December 2025, as reported. Watch online-inspire.gov.in for the 2026-27 call.",
    rules: [
      { type: "level", oneOf: ["ug1"], label: "first-year BSc, BS or integrated MSc/MS students" },
      { type: "field", oneOf: ["science"] },
      { type: "note", text: "Top 1% of your Class 12 board, or a JEE Advanced or NEET rank within the top 10,000, or a KVPY, NTSE, JBNSTS or International Olympiad scholar. Natural and basic sciences only." },
    ],
    sourceUrl: "https://online-inspire.gov.in/", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "upcoming", tentative: true, note: "2026-27 call not yet announced when checked.", sourceUrl: "https://online-inspire.gov.in/" },
    renewal: "Pass each year with at least 60% marks (or the equivalent CGPA) and submit a progress report.",
    renewalMinPct: 60,
  },
  {
    slug: "nmms",
    name: "National Means-cum-Merit Scholarship (NMMSS)",
    provider: "Department of School Education & Literacy, Ministry of Education",
    type: "means",
    officialUrl: NSP,
    applyVia: "State test in Class 8, then NSP",
    amountText: "₹12,000 a year (₹1,000 a month) from Class 9 to Class 12",
    amountPerYearInr: 12000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; school verification by 15 November.",
    rules: [
      { type: "level", oneOf: ["class8", "class9", "class10", "class11", "class12"], label: "Class 8 students (the state test), continuing to Class 12" },
      { type: "incomeMax", valueInr: 350000 },
      { type: "note", text: "At least 55% in Class 7 (50% for SC/ST) to sit the state test. For students of government, government-aided and local body schools." },
    ],
    sourceUrl: "https://dsel.education.gov.in/scheme/nmmss", checkedAt: CHECKED,
    cycle: NSP_2026(),
    renewal: "Clear promotion in the first attempt: 55% in Class 9 to continue in Class 10, 60% in Class 10 to continue in Class 11, and 55% in Class 11 to continue in Class 12 (5% lower for SC/ST).",
    renewalMinPct: 55,
    nspKind: "merit",
    selection: "State-level test in Class 8: Mental Ability Test and Scholastic Aptitude Test",
    hasTestOrInterview: true,
  },

  // ---------------------------------------------------------------- Means
  {
    slug: "hdfc-parivartan-ecss",
    name: "HDFC Bank Parivartan Educational Crisis Scholarship Support (ECSS)",
    provider: "HDFC Bank Parivartan",
    type: "means",
    officialUrl: "https://www.parivartanecss.com/",
    applyVia: "Online form at parivartanecss.com (run with Buddy4Study)",
    amountText: "₹15,000 (Classes 1 to 6) or ₹18,000 (Classes 7 to 12, diploma, ITI and polytechnic); separate, higher amounts for UG and PG",
    amountPerYearInr: 15000, years: 1,
    deadlineNote: "2026-27: deadline reported as extended from 31 August to 31 October 2026.",
    rules: [
      { type: "level", oneOf: ["class6", "class7", "class8", "class9", "class10", "class11", "class12", ...UG_PG], label: "school, diploma, UG and PG students" },
      { type: "minMarks", field: "lastPct", value: 55 },
      { type: "incomeMax", valueInr: 250000 },
      { type: "note", text: "Preference for students whose family faces a crisis such as illness, job loss or a death." },
    ],
    sourceUrl: "https://school.careers360.com/articles/hdfc-parivartan-ecss-programme-2026", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "open", closesAt: "2026-10-31", tentative: true, note: "Extended deadline as reported; confirm on the application page.", sourceUrl: "https://school.careers360.com/articles/hdfc-parivartan-ecss-programme-2026" },
  },

  // ---------------------------------------------------------------- Merit-cum-means
  {
    slug: "aicte-pragati-girls",
    name: "AICTE Pragati Scholarship for Girl Students (degree and diploma)",
    provider: "AICTE",
    type: "merit_means",
    officialUrl: "https://www.aicte-india.org/schemes/students-development-schemes",
    applyVia: "NSP",
    amountText: "₹50,000 a year for every year of the course",
    amountPerYearInr: 50000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November, state verification by 30 November.",
    rules: [
      { type: "gender", equals: "female" },
      { type: "level", oneOf: ["ug1", "ug2"], label: "first year of an AICTE-approved degree or diploma (second year for lateral entry)" },
      { type: "incomeMax", valueInr: 800000 },
      { type: "note", text: "Up to two girls per family." },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "aicte-saksham",
    name: "AICTE Saksham Scholarship for Specially Abled Students (degree and diploma)",
    provider: "AICTE",
    type: "merit_means",
    officialUrl: "https://www.aicte-india.org/schemes/students-development-schemes",
    applyVia: "NSP",
    amountText: "₹50,000 a year for every year of the course",
    amountPerYearInr: 50000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "minDisability", pct: 40 },
      { type: "level", oneOf: ["ug1", "ug2"], label: "first year of an AICTE-approved degree or diploma (second year for lateral entry)" },
      { type: "incomeMax", valueInr: 800000 },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "welfare",
  },
  {
    slug: "aicte-swanath",
    name: "AICTE Swanath Scholarship (degree and diploma)",
    provider: "AICTE",
    type: "group",
    officialUrl: "https://www.aicte-india.org/schemes/students-development-schemes",
    applyVia: "NSP",
    amountText: "₹50,000 a year for every year of the course",
    amountPerYearInr: 50000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "situation", oneOf: ["orphan", "martyr_family"], label: "orphans, students who lost a parent to COVID-19, and wards of armed forces or CAPF personnel martyred in action" },
      { type: "level", oneOf: ["ug1", "ug2"], label: "first year of an AICTE-approved degree or diploma (second year for lateral entry)" },
      { type: "incomeMax", valueInr: 800000 },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "welfare",
  },
  {
    slug: "reliance-foundation-ug",
    name: "Reliance Foundation Undergraduate Scholarships",
    provider: "Reliance Foundation",
    type: "merit_means",
    officialUrl: "https://scholarships.reliancefoundation.org/",
    applyVia: "Reliance Foundation scholarships portal (no fee)",
    amountText: "Up to ₹2 lakh over the degree; 5,000 scholarships for 2026-27",
    amountPerYearInr: 50000, years: 4,
    deadlineNote: "2026-27: applications opened on 14 August 2026 and close on 5 October 2026 (as reported).",
    rules: [
      { type: "level", oneOf: ["ug1"], label: "first-year students in a full-time regular degree in India" },
      { type: "minMarks", field: "class12Pct", value: 60 },
      { type: "incomeMax", valueInr: 1500000 },
      { type: "note", text: "Preference for family income below ₹2.5 lakh. Resident Indian citizens only." },
    ],
    sourceUrl: "https://www.reliancefoundation.org/media/media-release/Reliance_Foundation_Scholarships_2026-27", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "open", opensAt: "2026-08-14", closesAt: "2026-10-05", tentative: true, note: "Closing date as reported in launch coverage; confirm on the portal.", sourceUrl: "https://www.reliancefoundation.org/media/media-release/Reliance_Foundation_Scholarships_2026-27" },
    selection: "Aptitude test and financial background",
    hasTestOrInterview: true,
  },
  {
    slug: "reliance-foundation-pg",
    name: "Reliance Foundation Postgraduate Scholarships",
    provider: "Reliance Foundation",
    type: "merit",
    officialUrl: "https://scholarships.reliancefoundation.org/",
    applyVia: "Reliance Foundation scholarships portal (no fee)",
    amountText: "Up to ₹6 lakh over the PG degree; 100 scholarships for 2026-27",
    amountPerYearInr: 300000, years: 2,
    deadlineNote: "2026-27: applications opened on 14 August 2026 and close on 5 October 2026 (as reported).",
    rules: [
      { type: "level", oneOf: ["pg"], label: "first-year full-time postgraduate students in India" },
      { type: "note", text: "For future-ready fields including engineering, technology, energy and life sciences." },
    ],
    sourceUrl: "https://www.reliancefoundation.org/media/media-release/Reliance_Foundation_Scholarships_2026-27", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "open", opensAt: "2026-08-14", closesAt: "2026-10-05", tentative: true, note: "Closing date as reported in launch coverage; confirm on the portal.", sourceUrl: "https://www.reliancefoundation.org/media/media-release/Reliance_Foundation_Scholarships_2026-27" },
    selection: "Academic merit, aptitude and other parameters",
    hasTestOrInterview: true,
  },
  {
    slug: "kotak-kanya",
    name: "Kotak Kanya Scholarship",
    provider: "Kotak Education Foundation",
    type: "merit_means",
    officialUrl: "https://www.kotakeducationfoundation.org/",
    applyVia: "Online form (Buddy4Study)",
    amountText: "₹1.5 lakh a year until the professional degree is complete; 500 new scholars in 2026-27",
    amountPerYearInr: 150000, years: 4,
    deadlineNote: "2026-27 applications opened on 28 July 2026 and have closed. The next call is expected around July 2027.",
    rules: [
      { type: "gender", equals: "female" },
      { type: "level", oneOf: ["ug1"], label: "first year of a professional degree (engineering, MBBS, architecture, design, integrated LLB and similar) at an NIRF-ranked institute" },
      { type: "minMarks", field: "class12Pct", value: 75 },
      { type: "incomeMax", valueInr: 600000 },
    ],
    sourceUrl: "https://telanganatoday.com/kotak-education-foundation-launches-kotak-kanya-scholarship-2026", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "closed", opensAt: "2026-07-28", tentative: true, note: "Deadline reported as 31 August, later 30 September 2026.", sourceUrl: "https://telanganatoday.com/kotak-education-foundation-launches-kotak-kanya-scholarship-2026" },
  },
  {
    slug: "tata-capital-pankh",
    name: "Tata Capital Pankh Scholarship (Classes 11 and 12)",
    provider: "Tata Capital",
    type: "merit_means",
    officialUrl: "https://www.tatacapital.com/",
    applyVia: "Online form (Buddy4Study)",
    amountText: "60-80% marks: 80% of fees or ₹10,000; 80-90%: 90% of fees or ₹12,000; 90%+: 100% of fees or ₹15,000 (whichever is less)",
    amountPerYearInr: 12000, years: 1,
    deadlineNote: "2026-27: apply by 26 October 2026 (as reported). Separate Pankh programmes cover diploma, ITI and UG students.",
    rules: [
      { type: "level", oneOf: ["class11", "class12"], label: "Class 11 and 12 students" },
      { type: "minMarks", field: "lastPct", value: 60 },
      { type: "incomeMax", valueInr: 400000 },
      { type: "note", text: "Preference for girls, students with disabilities, single-parent and orphaned students, and SC/ST students." },
    ],
    sourceUrl: "https://school.careers360.com/articles/tata-capital-pankh-scholarship-program-2026-27", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "open", closesAt: "2026-10-26", tentative: true, note: "Deadline as reported; confirm on the application page.", sourceUrl: "https://school.careers360.com/articles/tata-capital-pankh-scholarship-program-2026-27" },
  },
  {
    slug: "sbi-asha",
    name: "SBI Platinum Jubilee Asha Scholarship",
    provider: "SBI Foundation",
    type: "merit_means",
    officialUrl: "https://www.sbiashascholarship.co.in/",
    applyVia: "SBI Asha portal or Buddy4Study",
    amountText: "₹15,000 to ₹15 lakh a year, depending on level (school, UG, PG, IIT, IIM, AIIMS, and PG abroad at a top-200 university)",
    amountPerYearInr: null, years: 1,
    deadlineNote: "2026-27: deadline reported as 19 September 2026, so this cycle has closed.",
    rules: [
      { type: "level", oneOf: ["class9", "class10", "class11", "class12", ...UG_PG], label: "Classes 9 to 12, UG and PG students" },
      { type: "minMarks", field: "lastPct", value: 75, relax: { SC: 65, ST: 65, PwBD: 60 } },
      { type: "incomeMax", valueInr: 300000, forLevels: ["class9", "class10", "class11", "class12"] },
      { type: "incomeMax", valueInr: 600000, forLevels: UG_PG },
      { type: "note", text: "Half the scholarships are for girls." },
    ],
    sourceUrl: "https://www.businesstoday.in/education/story/sbi-foundation-launches-asha-scholarship-2026-27-check-eligibility-how-to-apply-553546-2026-09-07", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "closed", closesAt: "2026-09-19", tentative: true, note: "Deadline as reported.", sourceUrl: "https://www.businesstoday.in/education/story/sbi-foundation-launches-asha-scholarship-2026-27-check-eligibility-how-to-apply-553546-2026-09-07" },
  },

  // ---------------------------------------------------------------- Category-based
  {
    slug: "post-matric-sc",
    name: "Post-Matric Scholarship for SC Students",
    provider: "Department of Social Justice & Empowerment (run by each state)",
    type: "category",
    officialUrl: NSP,
    applyVia: "Your state's scholarship portal or NSP, depending on the state",
    amountText: "Compulsory non-refundable fees plus an academic allowance that depends on the course",
    amountPerYearInr: null, years: null,
    deadlineNote: "A centrally sponsored scheme run by each state, so dates differ by state. Check your state scholarship portal.",
    rules: [
      { type: "category", oneOf: ["SC"] },
      { type: "level", oneOf: POST_MATRIC, label: "Class 11 and above" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: "https://news.careers360.com/post-matric-scholarship-pms-for-sc-rules-change-msje-course-fee-cap-4-5-lakh-income-limit-next-year-social-justice-and-empowerment/amp", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "varies", tentative: true, note: "State-run: dates differ by state.", sourceUrl: NSP },
  },
  {
    slug: "post-matric-st",
    name: "Post-Matric Scholarship for ST Students",
    provider: "Ministry of Tribal Affairs (run by each state)",
    type: "category",
    officialUrl: NSP,
    applyVia: "Your state's scholarship portal or NSP, depending on the state",
    amountText: "Compulsory non-refundable fees plus a maintenance allowance that depends on the course",
    amountPerYearInr: null, years: null,
    deadlineNote: "A centrally sponsored scheme run by each state, so dates differ by state. Check your state scholarship portal.",
    rules: [
      { type: "category", oneOf: ["ST"] },
      { type: "level", oneOf: POST_MATRIC, label: "Class 11 and above" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: NSP, checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "varies", tentative: true, note: "State-run: dates differ by state.", sourceUrl: NSP },
  },
  {
    slug: "post-matric-obc",
    name: "PM YASASVI Post-Matric Scholarship for OBC, EBC and DNT Students",
    provider: "Department of Social Justice & Empowerment (run by each state)",
    type: "category",
    officialUrl: NSP,
    applyVia: "Your state's scholarship portal or NSP, depending on the state",
    amountText: "Fees plus a maintenance allowance, as fixed by the scheme for your course group",
    amountPerYearInr: null, years: null,
    deadlineNote: "A centrally sponsored scheme run by each state, so dates differ by state. Check your state scholarship portal.",
    rules: [
      { type: "category", oneOf: ["OBC", "EBC", "DNT"] },
      { type: "level", oneOf: POST_MATRIC, label: "Class 11 and above" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: NSP, checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "varies", tentative: true, note: "State-run: dates differ by state.", sourceUrl: NSP },
  },
  {
    slug: "pre-matric-minorities",
    name: "Pre-Matric Scholarship for Minorities",
    provider: "Ministry of Minority Affairs",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "Admission and tuition fees plus a maintenance allowance, at the scheme's rates",
    amountPerYearInr: null, years: null,
    deadlineNote: "Limited to Classes 9 and 10 since 2022-23. We could not confirm the 2026-27 window on the official portal; check the Centrally Sponsored Schemes tab on scholarships.gov.in.",
    rules: [
      { type: "category", oneOf: ["Muslim", "Christian", "Sikh", "Buddhist", "Parsi", "Jain"] },
      { type: "level", oneOf: ["class9", "class10"], label: "Classes 9 and 10" },
      { type: "incomeMax", valueInr: 100000 },
      { type: "minMarks", field: "lastPct", value: 50 },
    ],
    sourceUrl: NSP, checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "varies", tentative: true, note: "2026-27 window not confirmed on the official portal.", sourceUrl: NSP },
  },
  {
    slug: "pm-yasasvi",
    name: "PM YASASVI Top Class School Education for OBC, EBC and DNT Students",
    provider: "Department of Social Justice & Empowerment",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹75,000 a year in Classes 9 and 10; ₹1,25,000 a year in Classes 11 and 12, at identified top-class schools",
    amountPerYearInr: 100000, years: 4,
    deadlineNote: "2026-27: NSP lists this scheme for renewals only (apply by 31 October 2026).",
    rules: [
      { type: "category", oneOf: ["OBC", "EBC", "DNT"] },
      { type: "level", oneOf: ["class9", "class10", "class11", "class12"], label: "Classes 9 to 12 at identified top-class schools" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: { ...NSP_2026(), status: "renewal-only", note: "Renewals only in 2026-27." },
    nspKind: "merit",
  },
  {
    slug: "pm-yasasvi-top-class-college",
    name: "PM YASASVI Top Class College Education for OBC, EBC and DNT Students",
    provider: "Department of Social Justice & Empowerment",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "Full tuition and non-refundable fees (up to ₹2 lakh a year at private institutions), ₹3,000 a month for living costs, ₹5,000 a year for books and ₹45,000 once for a computer",
    amountPerYearInr: 200000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "category", oneOf: ["OBC", "EBC", "DNT"] },
      { type: "level", oneOf: UG_PG, label: "UG and PG students at notified top institutions (IITs, IIMs, AIIMS, NLUs and others)" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "top-class-sc",
    name: "Central Sector Scholarship of Top Class Education for SC Students",
    provider: "Department of Social Justice & Empowerment",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "Full tuition and non-refundable fees (up to ₹2 lakh a year at private institutions), ₹3,000 a month for living costs, ₹5,000 a year for books and up to ₹45,000 once for a computer",
    amountPerYearInr: 200000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "category", oneOf: ["SC"] },
      { type: "level", oneOf: UG_PG, label: "UG and PG students at notified top institutions" },
      { type: "incomeMax", valueInr: 800000 },
    ],
    sourceUrl: "https://socialjustice.gov.in/writereaddata/UploadFile/topcls.pdf", checkedAt: CHECKED,
    cycle: NSP_2026(),
    renewal: "Continues to the end of the course, subject to satisfactory performance.",
    nspKind: "merit",
  },
  {
    slug: "top-class-st",
    name: "National Fellowship and Scholarship for Higher Education of ST Students (Top Class scholarship)",
    provider: "Ministry of Tribal Affairs",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "Full tuition and non-refundable fees (up to ₹2 lakh a year at private institutions), ₹2,220 a month for living costs, ₹3,000 a year for books and up to ₹45,000 once for a computer",
    amountPerYearInr: 200000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "category", oneOf: ["ST"] },
      { type: "level", oneOf: UG_PG, label: "UG and PG students at identified institutions of excellence" },
      { type: "incomeMax", valueInr: 600000 },
    ],
    sourceUrl: "https://vikaspedia.in/education/policies-and-schemes/scholarships/p-g-and-above-scholarships/national-fellowship-and-scholarship-for-higher-education-of-st-students", checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "top-class-disability",
    name: "Scholarship for Top Class Education for Students with Disabilities",
    provider: "Department of Empowerment of Persons with Disabilities",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "Tuition and admission fees up to ₹1.9 lakh a year, other compulsory fees up to ₹10,000 a year, and ₹45,000 once for a computer, plus other allowances",
    amountPerYearInr: 190000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "minDisability", pct: 40 },
      { type: "level", oneOf: UG_PG, label: "UG and PG students at notified top institutions" },
      { type: "incomeMax", valueInr: 800000 },
      { type: "note", text: "300 awards a year, half for girls." },
    ],
    sourceUrl: "https://scholarships.gov.in/public/schemeGuidelines/DEPDGuidelines_1.pdf", checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "welfare",
  },
  {
    slug: "post-matric-disability",
    name: "Post-Matric Scholarship for Students with Disabilities",
    provider: "Department of Empowerment of Persons with Disabilities",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "Fees up to ₹1.4 lakh a year, ₹1,200 a month (hostellers) or ₹650 a month (day scholars), a ₹2,000-4,000 disability allowance and ₹1,500 for books each year",
    amountPerYearInr: null, years: null,
    deadlineNote: "NSP 2026-27: opened 25 July; apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "minDisability", pct: 40 },
      { type: "level", oneOf: POST_MATRIC, label: "Class 11 and above, including diplomas and degrees" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: "https://scholarships.gov.in/public/schemeGuidelines/DEPDGuidelines_1.pdf", checkedAt: CHECKED,
    cycle: NSP_2026("2026-07-25"),
    nspKind: "welfare",
  },
  {
    slug: "pre-matric-disability",
    name: "Pre-Matric Scholarship for Students with Disabilities",
    provider: "Department of Empowerment of Persons with Disabilities",
    type: "category",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹800 a month (hostellers) or ₹500 a month (day scholars), a ₹2,000-4,000 disability allowance and ₹1,000 for books each year",
    amountPerYearInr: null, years: 2,
    deadlineNote: "NSP 2026-27: opened 25 July; apply by 31 October 2026; school verification by 15 November.",
    rules: [
      { type: "minDisability", pct: 40 },
      { type: "level", oneOf: ["class9", "class10"], label: "Classes 9 and 10" },
      { type: "incomeMax", valueInr: 250000 },
    ],
    sourceUrl: "https://scholarships.gov.in/public/schemeGuidelines/DEPDGuidelines_1.pdf", checkedAt: CHECKED,
    cycle: NSP_2026("2026-07-25"),
    nspKind: "welfare",
  },

  // ---------------------------------------------------------------- Group-specific
  {
    slug: "ugc-nspg",
    name: "UGC National Scholarship for Post Graduate Studies (NSPG)",
    provider: "University Grants Commission",
    type: "merit",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹15,000 a month for 10 months a year, for two years; 10,000 scholarships",
    amountPerYearInr: 150000, years: 2,
    deadlineNote: "NSP 2026-27: opened 16 September; apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "level", oneOf: ["pg"], label: "first-year regular full-time PG students in India" },
      { type: "note", text: "30% of slots are for women, filled first by single, twin or fraternal girl children without regard to UG marks." },
    ],
    sourceUrl: "https://nitkkr.ac.in/wp-content/uploads/2025/04/Guidelines-for-NATIONAL_SCHOLARSHIP_FOR_POSTGRADUATE_STUDIES_UGC.pdf", checkedAt: CHECKED,
    cycle: NSP_2026("2026-09-16"),
    renewal: "Renewed for the second year on completing the first year, with good conduct and the required attendance.",
    nspKind: "merit",
  },
  {
    slug: "ishan-uday",
    name: "Ishan Uday Special Scholarship Scheme for the North Eastern Region",
    provider: "University Grants Commission",
    type: "group",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹5,400 a month for general degrees; ₹7,800 a month for technical, medical, professional and paramedical courses",
    amountPerYearInr: 64800, years: 3,
    deadlineNote: "NSP 2026-27: opened 16 September; apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "state", field: "domicileState", oneOf: NE_STATES },
      { type: "level", oneOf: ["ug1"], label: "first-year degree students" },
      { type: "incomeMax", valueInr: 450000 },
    ],
    sourceUrl: "https://scholarships.gov.in//public/schemeGuidelines/ISHAN_UDAY_GUIDELINE.pdf", checkedAt: CHECKED,
    cycle: NSP_2026("2026-09-16"),
    renewal: "Renewed each year on an annual progress report from your institution.",
    nspKind: "merit",
  },
  {
    slug: "pmss-capf",
    name: "Prime Minister's Scholarship Scheme for CAPF and Assam Rifles",
    provider: "Ministry of Home Affairs",
    type: "group",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹3,000 a month for girls and ₹2,500 a month for boys",
    amountPerYearInr: 30000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "situation", oneOf: ["capf_family"], label: "wards and widows of CAPF and Assam Rifles personnel" },
      { type: "level", oneOf: ["ug1"], label: "first year of a first professional degree (engineering, medicine, BBA, BCA, BPharm, nursing, MBA, MCA and others)" },
      { type: "note", text: "At least 60% in the qualifying exam (Class 12, diploma or graduation)." },
    ],
    sourceUrl: "https://en.vikaspedia.in/viewcontent/education/policies-and-schemes/scholarships/post-matric-scholarship/prime-ministers-scholarship-scheme-for-central-armed-police-forces-assam-rifles?lgn=en", checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "pmss-police-martyrs",
    name: "Prime Minister's Scholarship Scheme for Wards of State/UT Police Personnel Martyred in Terror or Naxal Attacks",
    provider: "Ministry of Home Affairs",
    type: "group",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹3,000 a month for girls and ₹2,500 a month for boys",
    amountPerYearInr: 30000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "situation", oneOf: ["police_martyr_family"], label: "wards of state and UT police personnel martyred in terror or Naxal attacks" },
      { type: "level", oneOf: ["ug1"], label: "first year of a professional degree" },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "pmss-railways",
    name: "Prime Minister's Scholarship Scheme for RPF and RPSF",
    provider: "Ministry of Railways",
    type: "group",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹3,000 a month for girls and ₹2,500 a month for boys",
    amountPerYearInr: 30000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "situation", oneOf: ["rpf_family"], label: "wards and widows of RPF and RPSF personnel" },
      { type: "level", oneOf: ["ug1"], label: "first year of a professional degree" },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "icar-nts-ug",
    name: "ICAR National Talent Scholarship (UG)",
    provider: "Indian Council of Agricultural Research",
    type: "merit",
    officialUrl: NSP,
    applyVia: "NSP",
    amountText: "₹2,000 a month",
    amountPerYearInr: 24000, years: 4,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; institute verification by 15 November.",
    rules: [
      { type: "field", oneOf: ["agriculture"] },
      { type: "level", oneOf: UG, label: "bachelor's students in agriculture and allied subjects at an agricultural university" },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "merit",
  },
  {
    slug: "labour-welfare-wards",
    name: "Financial Assistance for Education of Wards of Beedi, Cine, IOMC and LSDM Workers",
    provider: "Ministry of Labour & Employment",
    type: "group",
    officialUrl: NSP,
    applyVia: "NSP (pre-matric and post-matric schemes)",
    amountText: "From ₹1,000 to ₹25,000 a year, depending on the class or course",
    amountPerYearInr: null, years: null,
    deadlineNote: "NSP 2026-27: apply by 31 October 2026; school or institute verification by 15 November.",
    rules: [
      { type: "situation", oneOf: ["labour_welfare"], label: "children of beedi, cine, and iron, manganese, chrome ore, limestone and dolomite mine workers" },
    ],
    sourceUrl: NSP_LIST, checkedAt: CHECKED,
    cycle: NSP_2026(),
    nspKind: "welfare",
  },
  {
    slug: "loreal-fywis",
    name: "L'Oréal India For Young Women in Science Scholarship",
    provider: "L'Oréal India",
    type: "group",
    officialUrl: "https://www.buddy4study.com/",
    applyVia: "Buddy4Study (search 'L'Oréal India For Young Women in Science')",
    amountText: "Up to ₹2.5 lakh in instalments towards tuition and academic costs for a science degree",
    amountPerYearInr: 62500, years: 4,
    deadlineNote: "The 2026 call closed on 1 June 2026 (as reported). The next call is expected in the first half of 2027.",
    rules: [
      { type: "gender", equals: "female" },
      { type: "level", oneOf: ["class12", "ug1"], label: "girls who have just finished Class 12 and are starting a science degree" },
      { type: "field", oneOf: ["science"] },
      { type: "minMarks", field: "class12Pct", value: 85 },
      { type: "incomeMax", valueInr: 600000 },
      { type: "note", text: "85% or more in Class 12 with physics, chemistry and maths or biology. The income limit is set each cycle; the latest listings show ₹6 lakh." },
    ],
    sourceUrl: "https://m.tribuneindia.com/news/jobs-careers/for-science-and-engineering-students-138816", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "closed", closesAt: "2026-06-01", tentative: true, note: "Deadline as reported.", sourceUrl: "https://m.tribuneindia.com/news/jobs-careers/for-science-and-engineering-students-138816" },
    selection: "Academic merit and income, then a telephone interview",
    hasTestOrInterview: true,
  },
  {
    slug: "santoor-womens-scholarship",
    name: "Santoor Women's Scholarship Programme",
    provider: "Wipro Consumer Care and Wipro Cares",
    type: "group",
    officialUrl: "https://www.buddy4study.com/",
    applyVia: "Buddy4Study (search 'Santoor Women's Scholarship')",
    amountText: "₹30,000 a year for the length of the degree (2026-27 rate as listed)",
    amountPerYearInr: 30000, years: 3,
    deadlineNote: "2026-27: apply by 15 October 2026 (as reported).",
    rules: [
      { type: "gender", equals: "female" },
      { type: "state", field: "domicileState", oneOf: ["Andhra Pradesh", "Telangana", "Karnataka", "Chhattisgarh"] },
      { type: "level", oneOf: ["ug1"], label: "first-year full-time undergraduate students" },
      { type: "note", text: "Class 10 and Class 12 from government schools or junior colleges." },
    ],
    sourceUrl: "https://www.agrijob.in/santoor-scholarship-program-2026-27-apply-online/", checkedAt: CHECKED,
    cycle: { year: "2026-27", status: "open", closesAt: "2026-10-15", tentative: true, note: "Deadline as reported; confirm on the application page.", sourceUrl: "https://www.agrijob.in/santoor-scholarship-program-2026-27-apply-online/" },
  },

  // ---------------------------------------------------------------- Study abroad
  {
    slug: "chevening",
    name: "Chevening Scholarships (UK)",
    provider: "UK Foreign, Commonwealth & Development Office",
    type: "abroad",
    officialUrl: "https://www.chevening.org/",
    applyVia: "Chevening application portal",
    amountText: "Fully funded one-year master's: tuition, monthly living allowance, return airfare and visa costs",
    amountPerYearInr: null, years: 1,
    deadlineNote: "2027/28: applications opened on 4 August 2026 and close on 6 October 2026 at 11:00 UTC (12:00 UK time).",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "graduates with work experience" },
      { type: "note", text: "At least 2,800 hours of work experience; apply to three eligible UK master's courses and hold an unconditional offer by 8 July 2027; return home for at least two years after the course." },
    ],
    sourceUrl: "https://www.businesstoday.in/nri/story/chevening-scholarship-opens-for-2027-28-who-can-apply-what-it-covers-key-deadline-for-indians-555345-2026-09-14", checkedAt: CHECKED,
    cycle: { year: "2027-28", status: "open", opensAt: "2026-08-04", closesAt: "2026-10-06", tentative: true, note: "Dates as reported for the 2027/28 round; confirm on chevening.org.", sourceUrl: "https://www.businesstoday.in/nri/story/chevening-scholarship-opens-for-2027-28-who-can-apply-what-it-covers-key-deadline-for-indians-555345-2026-09-14" },
    selection: "Essays, then interviews at the British High Commission",
    hasTestOrInterview: true,
  },
  {
    slug: "commonwealth-scholarship",
    name: "Commonwealth Master's Scholarships (UK)",
    provider: "Commonwealth Scholarship Commission in the UK",
    type: "abroad",
    officialUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships",
    applyVia: "CSC Central, after nomination by the Ministry of Education",
    amountText: "Fully funded taught master's in the UK",
    amountPerYearInr: null, years: 1,
    deadlineNote: "2027/28: CSC applications opened on 8 September and close on 20 October 2026 at 16:00 UK time. Indian candidates must also be nominated by the Ministry of Education.",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "graduates" },
      { type: "note", text: "For people who could not otherwise afford to study in the UK, in fields linked to development." },
    ],
    sourceUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships", checkedAt: CHECKED,
    cycle: { year: "2027-28", status: "open", opensAt: "2026-09-08", closesAt: "2026-10-20", tentative: true, note: "CSC dates as reported; nomination route for India runs through the Ministry of Education.", sourceUrl: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships" },
  },
  {
    slug: "daad-scholarships",
    name: "DAAD Scholarships (Germany)",
    provider: "German Academic Exchange Service (DAAD)",
    type: "abroad",
    officialUrl: "https://www.daad.in/en/find-funding/scholarship-database/",
    applyVia: "DAAD portal or the university, depending on the programme",
    amountText: "Monthly stipend plus travel and insurance; amounts depend on the programme and level",
    amountPerYearInr: null, years: null,
    deadlineNote: "India deadlines (2026): Research Grants 7 October; Doctoral Programmes in Germany 21 October; University Summer Courses 30 October. Development-related master's (EPOS) deadlines are set by each university.",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "graduates, doctoral candidates and researchers" },
    ],
    sourceUrl: "https://www.daad.in/en/find-funding/scholarship-database/", checkedAt: CHECKED,
    cycle: { year: "2027-28", status: "open", closesAt: "2026-10-21", tentative: false, note: "Doctoral Programmes in Germany deadline; other programmes have their own dates.", sourceUrl: "https://www.daad.in/en/find-funding/scholarship-database/" },
  },
  {
    slug: "erasmus-mundus",
    name: "Erasmus Mundus Joint Master's Scholarships",
    provider: "European Commission",
    type: "abroad",
    officialUrl: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
    applyVia: "Each joint master's programme's own application",
    amountText: "Tuition, travel and a monthly allowance (€1,400) for up to 24 months",
    amountPerYearInr: null, years: 2,
    deadlineNote: "For September 2027 entry, most programmes take applications between October 2026 and February 2027. Each programme sets its own date.",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "final-year students and graduates" },
    ],
    sourceUrl: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en", checkedAt: CHECKED,
    cycle: { year: "2027-28", status: "upcoming", tentative: true, note: "Programme-specific deadlines, mostly October 2026 to February 2027.", sourceUrl: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en" },
  },
  {
    slug: "fulbright-nehru-masters",
    name: "Fulbright-Nehru Master's Fellowships (USA)",
    provider: "United States-India Educational Foundation (USIEF)",
    type: "abroad",
    officialUrl: "https://www.usief.org.in/",
    applyVia: "USIEF application portal",
    amountText: "Fully funded master's for up to two years: J-1 visa support, airfare, tuition, living costs and health cover",
    amountPerYearInr: null, years: 2,
    deadlineNote: "The 2027-28 round has closed. The 2028-29 round is expected to open in early 2027.",
    rules: [
      { type: "level", oneOf: ["pg", "working"], label: "graduates with at least three years of full-time work experience" },
      { type: "note", text: "A US-equivalent bachelor's degree with at least 55% marks." },
    ],
    sourceUrl: "https://www.usief.org.in/", checkedAt: CHECKED,
    cycle: { year: "2028-29", status: "upcoming", tentative: true, note: "Expected early 2027.", sourceUrl: "https://www.usief.org.in/" },
    selection: "Application, then interview",
    hasTestOrInterview: true,
  },
  {
    slug: "jn-tata-endowment",
    name: "J N Tata Endowment Loan Scholarship",
    provider: "J N Tata Endowment (Tata Trusts)",
    type: "abroad",
    officialUrl: "https://www.jntataendowment.org/",
    applyVia: "Online form on jntataendowment.org",
    amountText: "Loan scholarship (repayable) towards higher study abroad; the amount is decided after the interview",
    amountPerYearInr: null, years: 1,
    deadlineNote: "The Fall 2026 to Spring 2027 forms were open from 5 January to 29 March 2026. The next forms are expected in early 2027.",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "Indian graduates from recognised Indian universities" },
    ],
    sourceUrl: "https://www.jntataendowment.org/", checkedAt: CHECKED,
    cycle: { year: "2027-28", status: "upcoming", tentative: true, note: "Expected January to March 2027, going by the 2026 window.", sourceUrl: "https://www.jntataendowment.org/" },
    selection: "Written application, then interview",
    hasTestOrInterview: true,
  },
  {
    slug: "kc-mahindra-pg-abroad",
    name: "K C Mahindra Scholarships for Post-Graduate Studies Abroad",
    provider: "K C Mahindra Education Trust",
    type: "abroad",
    officialUrl: "https://kcmet.org/what-we-do-Scholarship-Grants.aspx",
    applyVia: "Online form on kcmet.org",
    amountText: "Interest-free loan scholarship: up to ₹10 lakh for the top 3 fellows and up to ₹5 lakh for others; at least 50 awards a year",
    amountPerYearInr: 500000, years: 1,
    deadlineNote: "The 2026 deadline was 30 April 2026. The next call is expected in early 2027.",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "Indian graduates with a first-class degree, enrolled in a PG programme abroad" },
    ],
    sourceUrl: "https://kcmet.org/what-we-do-Scholarship-Grants.aspx", checkedAt: CHECKED,
    cycle: { year: "2027", status: "upcoming", tentative: true, note: "Expected early 2027, going by the 2026 call.", sourceUrl: "https://kcmet.org/what-we-do-Scholarship-Grants.aspx" },
    hasTestOrInterview: true,
  },
  {
    slug: "inlaks-scholarship",
    name: "Inlaks Shivdasani Scholarships",
    provider: "Inlaks Shivdasani Foundation",
    type: "abroad",
    officialUrl: "https://www.inlaksfoundation.org/",
    applyVia: "Inlaks Foundation application",
    amountText: "Up to US$100,000, covering tuition, living costs, one-way travel and a health allowance",
    amountPerYearInr: null, years: null,
    deadlineNote: "The next call is expected in early 2027. You need an offer from an eligible top university abroad.",
    rules: [
      { type: "level", oneOf: GRADUATES, label: "Indian citizens with a high first-class degree (60% or CGPA 6.3), aged 30 or under" },
      { type: "note", text: "Resident in India for the past six months. Not for engineering, computer science, business studies, medicine, dentistry or public health." },
    ],
    sourceUrl: "https://www.rug.nl/education/scholarships/inlaks-shivdasani-scholarships?lang=en", checkedAt: CHECKED,
    cycle: { year: "2027", status: "upcoming", tentative: true, note: "Expected early 2027.", sourceUrl: "https://www.inlaksfoundation.org/" },
    hasTestOrInterview: true,
  },
];

export function scholarshipBySlug(slug: string): ScholarshipDef | undefined {
  return SCHOLARSHIPS.find((s) => s.slug === slug);
}

export const SCHOLARSHIP_TYPE_LABEL: Record<ScholarshipType, string> = {
  merit: "Merit", means: "Means (need-based)", merit_means: "Merit-cum-means",
  category: "Category-based", group: "Group-specific", abroad: "Study abroad",
};

/** Parses a YYYY-MM-DD date as a local calendar date (end of day for closing dates). */
export function cycleDate(iso: string | undefined, endOfDay = false): Date | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return endOfDay ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 23, 59, 59) : new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** Live status from the dates: an "open" cycle whose closing date has passed reads as closed. */
export function liveStatus(s: ScholarshipDef, now: Date = new Date()): CycleStatus | "none" {
  const c = s.cycle;
  if (!c) return "none";
  const closes = cycleDate(c.closesAt, true);
  const opens = cycleDate(c.opensAt);
  if ((c.status === "open" || c.status === "renewal-only") && closes && now > closes) return "closed";
  if (c.status === "upcoming" && opens && now >= opens && (!closes || now <= closes)) return "open";
  return c.status;
}
