/**
 * Public "How to become a ..." career pages (/careers, /careers/<slug>): one
 * page for each of the 360 careers with a researched Class 11-12 roadmap
 * (data/class-11-12/career-roadmaps-detailed.json - the same content the
 * 11-12 report uses) plus its field and streams from CAREERS_1112.
 *
 * SERVER-ONLY: imports the ~3.6 MB roadmap file. Pages are built at deploy.
 * The data's lists mix sub-headings into the items ("Government / Public -
 * 5 relevant options", "Technical Skills", route names before "A -> B" lines);
 * groupsOf() splits them back out for display.
 */
import ROADMAPS from "@/data/class-11-12/career-roadmaps-detailed.json";
import { CAREERS_1112 } from "@/lib/report/careerfit1112";
import type { DetailedCareerRoadmap } from "@/lib/report/careerRoadmapDetailed1112";
import { careerSlug } from "./careerSlug";

export interface CareerPage {
  slug: string;
  name: string;
  domain: string;
  streams: string;
  /** "a" or "an", for "How to become a/an ...". */
  article: "a" | "an";
  roadmap: DetailedCareerRoadmap;
}

export { careerSlug };

/** Known link-text left in the research notes ("... JEE rank. IIT Bombay Login"). */
export const clean = (s: string) => s.replace(/\s+(IIT Bombay )?Login(?=$|")/g, "").replace(/\s{2,}/g, " ").trim();

const all = ROADMAPS as unknown as Record<string, DetailedCareerRoadmap>;
const byName = new Map(CAREERS_1112.map((c) => [c.name, c]));

export const CAREER_PAGES: CareerPage[] = Object.keys(all).map((name) => {
  const c = byName.get(name);
  return {
    slug: careerSlug(name),
    name,
    domain: c?.domain ?? "Other",
    streams: c?.eligibleStreamsText ?? "",
    article: (/^[aeiou]/i.test(name) && !/^(uni|use|eu)/i.test(name) ? "an" : "a") as CareerPage["article"],
    roadmap: all[name],
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const bySlug = new Map(CAREER_PAGES.map((c) => [c.slug, c]));
export const careerPage = (slug: string) => bySlug.get(slug);
export const CAREER_DOMAINS = [...new Set(CAREER_PAGES.map((c) => c.domain))].sort();
export const careersIn = (domain: string) => CAREER_PAGES.filter((c) => c.domain === domain);

/** The page for a career name, if there is one (normalised: case, spaces, "&"). */
const norm = (s: string) => careerSlug(s).replace(/-/g, "");
const byNorm = new Map(CAREER_PAGES.map((c) => [norm(c.name), c]));
export const careerByName = (name: string) => byNorm.get(norm(name));

/** The streams code from CAREERS_1112 in words ("MPC, PCMB" -> "Science with Maths (MPC/PCMB)"). */
export function streamsInWords(code: string): string {
  if (!code) return "";
  return code
    .replace(/\bMPC\b/g, "Science with Maths (MPC)")
    .replace(/\bBiPC\b/g, "Science with Biology (BiPC)")
    .replace(/\bPCMB\b/g, "PCMB")
    .replace(/^Any\b/, "Any stream");
}

/** Shortens text to at most `n` characters, ending on a whole word. */
export function cut(s: string, n: number): string {
  if (s.length <= n) return s;
  const head = s.slice(0, n - 1);
  const at = head.lastIndexOf(" ");
  return `${(at > n * 0.6 ? head.slice(0, at) : head).replace(/[\s,;:.\-—]+$/, "")}…`;
}

/** "How to become a Mechanical Engineer" */
export const howTo = (c: CareerPage) => `How to become ${c.article} ${c.name}`;

/** The tagline without its "Name: " prefix. */
export function summary(c: CareerPage): string {
  const t = clean(c.roadmap.tagline ?? "");
  return t.startsWith(`${c.name}:`) ? t.slice(c.name.length + 1).trim() : t;
}

/** "Stream: ...", "Subjects: ..." lines from the school list. */
export function schoolFacts(c: CareerPage): { label: string; text: string }[] {
  return c.roadmap.school.map((l) => {
    const m = clean(l).match(/^([^:]{2,30}):\s*(.+)$/);
    return m ? { label: m[1], text: m[2] } : { label: "", text: clean(l) };
  });
}
export const fact = (c: CareerPage, label: RegExp) => schoolFacts(c).find((f) => label.test(f.label))?.text;

const HEAD = /^(government|private|relevant\b|common requirements|typical pathway|roles$|job titles|specializations?$|project ideas|technical skills|soft skills|core skills|key skills|domain skills|tools( \/ technologies)?$|useful certifications|ideal areas|certifications$)/i;

/** A line inside a list that is really a sub-heading. */
export function isHeading(line: string, field: string): boolean {
  const t = line.trim();
  if (/—\s*\d+\s+relevant options$/i.test(t) || /^\d+\s+relevant\b/i.test(t)) return true;
  if (t.endsWith(":") && t.length <= 60) return true;
  if (field === "afterUgPathways") return !t.includes("→");
  return HEAD.test(t) && t.length <= 48 && !/[.;]$/.test(t) && !t.includes(": ");
}

export interface Group { heading?: string; items: string[] }

/** Splits a list into groups at its sub-headings ("— 5 relevant options" is dropped from the heading). */
export function groupsOf(lines: string[] | undefined, field: string): Group[] {
  const out: Group[] = [];
  for (const raw of lines ?? []) {
    const l = clean(raw);
    if (!l) continue;
    if (isHeading(l, field)) {
      const h = l.replace(/\s*—\s*\d+\s+relevant options$/i, "").replace(/:$/, "").replace(/^\d+\s+/, "");
      out.push({ heading: h.charAt(0).toUpperCase() + h.slice(1), items: [] });
      continue;
    }
    if (!out.length) out.push({ items: [] });
    out[out.length - 1].items.push(l);
  }
  return out.filter((g) => g.items.length);
}

/** Questions people search, answered from the career's own roadmap. */
export function careerFaqs(c: CareerPage): { q: string; a: string }[] {
  const r = c.roadmap;
  const faqs: { q: string; a: string }[] = [];
  const stream = fact(c, /stream/i);
  if (stream) faqs.push({ q: `Which stream should I take to become ${c.article} ${c.name}?`, a: stream });
  const exams = fact(c, /entrance/i);
  if (exams) faqs.push({ q: `Which entrance exams do I need to become ${c.article} ${c.name}?`, a: exams });
  const degrees = r.ugPathways.slice(0, 3).map((p) => clean(p).split("→")[0].trim()).filter(Boolean);
  if (degrees.length) faqs.push({ q: `What should I study after Class 12 to become ${c.article} ${c.name}?`, a: `Common degrees include ${degrees.join(", ")}. See the full list of pathways and colleges on this page.` });
  const jobs = r.jobOptions.map(clean).filter(Boolean).slice(0, 6);
  if (jobs.length) faqs.push({ q: `What jobs can I get on this path?`, a: `Roles include ${jobs.join(", ")}.` });
  return faqs;
}

/** Other careers in the same field, for "Related careers". */
export const relatedCareers = (c: CareerPage, n = 6) => careersIn(c.domain).filter((x) => x.slug !== c.slug).slice(0, n);
