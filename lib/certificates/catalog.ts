/**
 * Course certificates: finish a feature's course and OneGrasp issues a
 * certificate with the student's name, class and the course - shareable as a
 * public link (/certificate/<id>) and as an image.
 *
 * Which courses award one, and who issues it. Light and client-safe; the
 * completion check and issuing live in ./server.ts (Admin SDK).
 */
import { FEATURES } from "@/lib/features/catalog";

/** The issuer, printed on every certificate. */
export const ISSUER = {
  name: "OneGrasp",
  line: "Career guidance and life-skills learning for students",
  site: "onegrasp.com",
  email: "support@onegrasp.com",
} as const;

export interface CertCourse {
  /** = the feature key, and the course key in progress.courses (lesson courses). */
  key: string;
  /** The course name printed on the certificate. */
  title: string;
  href: string;
  accent: string;
  /** "lessons": every lesson ticked off; "track": every Startups module test passed. */
  kind: "lessons" | "track";
}

const course = (key: keyof typeof FEATURES, title: string, kind: CertCourse["kind"] = "lessons"): CertCourse =>
  ({ key, title, href: FEATURES[key].href, accent: FEATURES[key].accent, kind });

export const CERT_COURSES: CertCourse[] = [
  course("money", "Financial Literacy"),
  course("legal", "Law & Rights"),
  course("exams", "Entrance Exams & Eligibility"),
  course("scholarships", "Scholarships"),
  course("study-abroad", "Study Abroad"),
  course("research", "Research & Conferences"),
  course("startups", "Startups: Builder Track", "track"),
];

export const certCourse = (key: string): CertCourse | undefined => CERT_COURSES.find((c) => c.key === key);

/** A certificate as issued (certificates/{id}, written only by the server). */
export interface CertRecord {
  id: string;
  course: string;
  courseTitle: string;
  name: string;
  className: string;
  lessons: number;
  minutes: number;
  issuedAt: number;
}

/** What's kept on the student's own profile: users/{uid}.certificates.<course>. */
export interface CertRef { id: string; issuedAt: number }

export const certCode = (id: string) => `OG-${id.toUpperCase()}`;
export const certPath = (id: string) => `/certificate/${id}`;
export const validCertId = (id: string) => /^[a-z0-9]{10}$/.test(id);

/** A certificate id: 10 characters with nothing that reads two ways (no 0/o, 1/l/i). */
export const CERT_ID_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** "about 2 hours", "45 minutes" */
export function learningTime(minutes: number): string {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} minutes`;
  const h = Math.round(minutes / 30) / 2;
  return `about ${h % 1 ? h.toFixed(1) : h} ${h === 1 ? "hour" : "hours"}`;
}

/** The class line on a certificate: "Class 9 – 10", "Undergraduate" (no age band). */
export const certClass = (label: string) => label.replace(/\s*\(.*\)\s*$/, "").trim();

/** Names typed all in lower or upper case read better in title case on a certificate. */
export function certName(raw: string): string {
  const name = raw.replace(/\s+/g, " ").trim() || "Student";
  if (name !== name.toLowerCase() && name !== name.toUpperCase()) return name;
  return name.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}
