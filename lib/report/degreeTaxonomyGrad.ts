/**
 * The Graduates (UG) degree taxonomy - extracted from
 * "India_UG_PG_PhD_Master_Database.xlsx"'s `Streams` + `Master` sheets: 21
 * academic "UG Domain" categories, 41 real UG degree programmes, 566
 * degree->course/specialization combinations, each course carrying its own
 * semicolon-split job-role list straight from the workbook.
 *
 * This is the pre-exam Domain -> Degree -> Course picker's data source
 * (mirrors what degreeStreamMatrix.ts is for Class 11-12's stream picker,
 * except keyed the other direction - degree-first, not stream-eligibility-
 * first, since Graduates already know their exact degree rather than
 * needing to discover eligible ones). `duration`/`eligibility`/
 * `entranceExams` per degree come straight from the workbook's own text,
 * used later for roadmap content (Phase D) rather than invented.
 */
import raw from "@/data/graduates/degree-taxonomy.json";

export interface GradCourse {
  course: string;
  roles: string[];
}

export interface GradDegree {
  domain: string;
  duration: string;
  eligibility: string;
  entranceExams: string;
  courses: GradCourse[];
}

export interface GradDomain {
  name: string;
  degrees: string[];
}

interface RawTaxonomy {
  domains: GradDomain[];
  degrees: Record<string, GradDegree>;
}

const DATA = raw as unknown as RawTaxonomy;

export const UG_DOMAINS: GradDomain[] = DATA.domains;
export const UG_DEGREES: Record<string, GradDegree> = DATA.degrees;

export function coursesForDegree(degree: string): GradCourse[] {
  return UG_DEGREES[degree]?.courses ?? [];
}

export function degreeInfo(degree: string): GradDegree | null {
  return UG_DEGREES[degree] ?? null;
}
