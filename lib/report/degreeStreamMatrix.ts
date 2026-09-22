/**
 * The Class 12 "every real alternative, not just the obvious one" data -
 * extracted directly from the user-provided workbook "11-12th Streams list
 * (1).xlsx", sheet "Consolidated": 105 real undergraduate degree programmes
 * across 11 categories (Engineering & Technology, Architecture & Planning,
 * Computer & IT Pathways, Medical & Health Sciences, Pure Sciences,
 * Agriculture & Allied Sciences, Commerce & Management, Professional
 * Commerce, Law, Humanities or Social Sciences, Design), each with the
 * workbook's own 🟢/🟡/🔴 eligibility marker per stream.
 *
 * This is deliberately a DEGREE-level view, distinct from careerfit1112.ts's
 * CAREER/job-role-level Fitment/Suitability/Selector system - it answers
 * "every program I could realistically apply to from my stream", which is
 * both broader (105 programmes vs. a ranked shortlist) and a different unit
 * (a specific named degree, not a job title) from the career engine. Used
 * on the Class 12 "estimated score & wider options" page precisely because
 * that page's whole point is showing the FULL breadth available, not a
 * ranked top-N.
 *
 * The eligibility marks are transcribed verbatim from the source workbook,
 * including its own "green-yellow" / "yellow-red" split marks (e.g.
 * "🔴/🟡") for streams the workbook itself treats as borderline rather than
 * a clean yes/no - that ambiguity is real information, not a parsing
 * artifact, so it's preserved rather than collapsed to a single colour.
 * A blank cell in the source (no mark for that stream/degree pair) means
 * the workbook didn't list that stream as a pathway for that degree at all
 * (e.g. Commerce/Humanities students aren't shown against MBBS) - encoded
 * here as the key being absent from `eligibility`, not as "red", since
 * "not a listed pathway" and "explicitly ruled out" are different claims.
 *
 * `salaryDomain` maps each row to the closest matching entry in
 * careerfit1112.ts's DOMAINS_1112, so a salary band can be shown alongside
 * each degree without inventing new figures - it reuses that already-
 * verified data, same as the rest of the Class 11-12 report.
 */
import type { StreamKey1112 } from "@/lib/report/careerfit1112";

export type EligibilityMark = "green" | "yellow" | "red" | "green-yellow" | "yellow-red";

export interface DegreeEligibilityRow {
  category: string;
  degree: string;
  /** Domain name in careerfit1112.ts's DOMAINS_1112, for salary lookup. */
  salaryDomain: string;
  eligibility: Partial<Record<StreamKey1112, EligibilityMark>>;
}

export const ELIGIBILITY_LABEL: Record<EligibilityMark, string> = {
  green: "Eligible",
  yellow: "Conditional / check specific college",
  red: "Not a typical pathway",
  "green-yellow": "Eligible at most colleges, conditional at some",
  "yellow-red": "Conditional at best, blocked at most colleges",
};

export const ELIGIBILITY_SYMBOL: Record<EligibilityMark, string> = {
  green: "🟢",
  yellow: "🟡",
  red: "🔴",
  "green-yellow": "🟢🟡",
  "yellow-red": "🟡🔴",
};

export const DEGREE_ELIGIBILITY: DegreeEligibilityRow[] = [
  { category: "Engineering & Technology", degree: "B.Tech Computer Science", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "yellow-red", "PCMB": "green", "Commerce+Maths": "yellow-red", "Commerce (CEC, no Maths)": "yellow-red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech AI/ML", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "yellow-red", "PCMB": "green", "Commerce+Maths": "yellow-red", "Commerce (CEC, no Maths)": "yellow-red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Data Science", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "yellow-red", "PCMB": "green", "Commerce+Maths": "yellow-red", "Commerce (CEC, no Maths)": "yellow-red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech ECE", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "red", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech EEE", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "red", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Mechanical", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "red", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Civil", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "red", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Chemical", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Aerospace", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "red", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Biotechnology", salaryDomain: "Engineering", eligibility: { "MPC": "green-yellow", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Food Technology", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Agricultural Engineering", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Dairy Technology", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Engineering & Technology", degree: "B.Tech Environmental Engineering", salaryDomain: "Engineering", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red", "Vocational/Other": "yellow" } },
  { category: "Architecture & Planning", degree: "B.Arch", salaryDomain: "Architecture", eligibility: { "MPC": "green", "BiPC": "yellow-red", "PCMB": "green", "Commerce+Maths": "red", "Commerce (CEC, no Maths)": "red", "Humanities": "red" } },
  { category: "Architecture & Planning", degree: "B.Planning", salaryDomain: "Architecture", eligibility: { "MPC": "green", "BiPC": "yellow-red", "PCMB": "green", "Commerce+Maths": "yellow-red", "Commerce (CEC, no Maths)": "yellow-red", "Humanities": "yellow-red" } },
  { category: "Architecture & Planning", degree: "B.Des", salaryDomain: "Architecture", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Architecture & Planning", degree: "BFA", salaryDomain: "Architecture", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Architecture & Planning", degree: "B.Plan-related programmes", salaryDomain: "Architecture", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "yellow", "Commerce (CEC, no Maths)": "yellow", "Humanities": "yellow" } },
  { category: "Computer & IT Pathways", degree: "B.Tech CSE", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "yellow-red", "Commerce+Maths": "yellow-red", "Commerce (CEC, no Maths)": "red", "Humanities": "red" } },
  { category: "Computer & IT Pathways", degree: "B.Sc CS", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "yellow", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "yellow", "Humanities": "yellow" } },
  { category: "Computer & IT Pathways", degree: "BCA", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green-yellow", "Humanities": "yellow" } },
  { category: "Computer & IT Pathways", degree: "B.Sc Data Science", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "yellow", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "yellow", "Humanities": "yellow" } },
  { category: "Computer & IT Pathways", degree: "B.Sc AI", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "yellow", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "yellow", "Humanities": "yellow" } },
  { category: "Computer & IT Pathways", degree: "B.Sc Cybersecurity", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "yellow", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "yellow", "Humanities": "yellow" } },
  { category: "Computer & IT Pathways", degree: "B.Tech AI/ML", salaryDomain: "Computer Science / IT", eligibility: { "MPC": "green", "BiPC": "yellow-red", "Commerce+Maths": "yellow-red", "Commerce (CEC, no Maths)": "red", "Humanities": "red" } },
  { category: "Medical & Health Sciences", degree: "MBBS", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "BDS", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "BAMS", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "BHMS", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "BUMS", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "BSMS", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Veterinary / BVSc", salaryDomain: "Medicine", eligibility: { "MPC": "red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "B.Sc Nursing", salaryDomain: "Medicine", eligibility: { "MPC": "yellow-red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Physiotherapy", salaryDomain: "Medicine", eligibility: { "MPC": "yellow-red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Occupational Therapy", salaryDomain: "Medicine", eligibility: { "MPC": "yellow-red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Medical Laboratory Technology", salaryDomain: "Medicine", eligibility: { "MPC": "yellow", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Radiology / Imaging", salaryDomain: "Medicine", eligibility: { "MPC": "yellow", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Optometry", salaryDomain: "Medicine", eligibility: { "MPC": "yellow", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Pharmacy", salaryDomain: "Medicine", eligibility: { "MPC": "yellow", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Biotechnology", salaryDomain: "Biotechnology / Life Sciences", eligibility: { "MPC": "yellow", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Microbiology", salaryDomain: "Biotechnology / Life Sciences", eligibility: { "MPC": "yellow-red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Biochemistry", salaryDomain: "Biotechnology / Life Sciences", eligibility: { "MPC": "yellow-red", "BiPC": "green", "PCMB": "green" } },
  { category: "Medical & Health Sciences", degree: "Genetics", salaryDomain: "Biotechnology / Life Sciences", eligibility: { "MPC": "yellow-red", "BiPC": "green", "PCMB": "green" } },
  { category: "Pure Sciences", degree: "B.Sc Physics", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "yellow-red", "PCMB": "green", "Commerce+Maths": "red", "Humanities": "red" } },
  { category: "Pure Sciences", degree: "B.Sc Mathematics", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "red", "PCMB": "green", "Commerce+Maths": "yellow", "Humanities": "yellow" } },
  { category: "Pure Sciences", degree: "B.Sc Chemistry", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "red", "Humanities": "red" } },
  { category: "Pure Sciences", degree: "B.Sc Statistics", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Humanities": "yellow" } },
  { category: "Pure Sciences", degree: "B.Sc Computer Science", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "yellow", "Humanities": "yellow" } },
  { category: "Pure Sciences", degree: "B.Sc Data Science", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Humanities": "yellow" } },
  { category: "Pure Sciences", degree: "B.Sc Economics", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Humanities": "green" } },
  { category: "Pure Sciences", degree: "B.Sc Psychology", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Humanities": "green" } },
  { category: "Pure Sciences", degree: "B.Sc Geology", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "green-yellow", "PCMB": "green", "Commerce+Maths": "red", "Humanities": "red" } },
  { category: "Pure Sciences", degree: "B.Sc Environmental Science", salaryDomain: "Pure Science", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "yellow", "Humanities": "yellow" } },
  { category: "Pure Sciences", degree: "B.Sc Biotechnology", salaryDomain: "Pure Science", eligibility: { "MPC": "yellow", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "red", "Humanities": "red" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Sc Agriculture", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Sc Horticulture", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Sc Forestry", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.F.Sc Fisheries", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Tech Agricultural Engineering", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Tech Food Technology", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Tech Dairy Technology", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Sc Agribusiness", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Sc Food Nutrition & Dietetics", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Agriculture & Allied Sciences", degree: "B.Tech Biotechnology", salaryDomain: "Agriculture & Allied Sciences", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green" } },
  { category: "Commerce & Management", degree: "B.Com", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Commerce & Management", degree: "B.Com Hons", salaryDomain: "Business / Management", eligibility: { "MPC": "green-yellow", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "yellow" } },
  { category: "Commerce & Management", degree: "BBA", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Commerce & Management", degree: "BMS", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Commerce & Management", degree: "BBM", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Commerce & Management", degree: "BBA Finance", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "green", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Commerce & Management", degree: "BBA Business Analytics", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "yellow" } },
  { category: "Commerce & Management", degree: "B.Sc Finance", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "yellow" } },
  { category: "Commerce & Management", degree: "B.Sc Economics", salaryDomain: "Business / Management", eligibility: { "MPC": "green", "BiPC": "yellow", "PCMB": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Professional Commerce", degree: "CA", salaryDomain: "Commerce / Accounting", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Professional Commerce", degree: "CS", salaryDomain: "Commerce / Accounting", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Professional Commerce", degree: "CMA", salaryDomain: "Commerce / Accounting", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Professional Commerce", degree: "CFA pathway", salaryDomain: "Commerce / Accounting", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Professional Commerce", degree: "Actuarial Science", salaryDomain: "Commerce / Accounting", eligibility: { "MPC": "green", "BiPC": "yellow", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "yellow" } },
  { category: "Professional Commerce", degree: "ACCA", salaryDomain: "Commerce / Accounting", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Law", degree: "BA LLB", salaryDomain: "Law", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Law", degree: "BBA LLB", salaryDomain: "Law", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Law", degree: "B.Com LLB", salaryDomain: "Law", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Law", degree: "B.Sc LLB", salaryDomain: "Law", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA English", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA History", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Political Science", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Sociology", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Psychology", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Philosophy", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Geography", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Economics", salaryDomain: "Humanities", eligibility: { "MPC": "yellow", "BiPC": "yellow", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Journalism", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Mass Communication", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA International Relations", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Public Policy", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Anthropology", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Humanities or Social Sciences", degree: "BA Linguistics", salaryDomain: "Humanities", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green" } },
  { category: "Design", degree: "B.Des", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
  { category: "Design", degree: "BFA", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
  { category: "Design", degree: "Fashion Design", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
  { category: "Design", degree: "Communication Design", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
  { category: "Design", degree: "Product Design", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
  { category: "Design", degree: "Interior Design", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
  { category: "Design", degree: "UX/UI Design", salaryDomain: "Design", eligibility: { "MPC": "green", "BiPC": "green", "Commerce+Maths": "green", "Commerce (CEC, no Maths)": "green", "Humanities": "green", "Vocational/Other": "green" } },
];

/** Every degree row that lists the given stream at all (green/yellow - excludes "red" and "not listed"), grouped by category. */
export function degreesForStream(streamKey: StreamKey1112, opts: { includeConditional?: boolean } = {}): Map<string, DegreeEligibilityRow[]> {
  const out = new Map<string, DegreeEligibilityRow[]>();
  for (const row of DEGREE_ELIGIBILITY) {
    const mark = row.eligibility[streamKey];
    if (!mark || mark === "red") continue;
    if (!opts.includeConditional && (mark === "yellow" || mark === "yellow-red")) continue;
    const list = out.get(row.category) ?? [];
    list.push(row);
    out.set(row.category, list);
  }
  return out;
}
