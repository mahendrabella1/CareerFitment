/**
 * Resume templates - one source for the on-screen preview (ResumeSheet) and
 * the downloaded PDF (ResumePdf), so they match. All are ATS-safe: one
 * column, standard section headings, real text, standard fonts (Helvetica /
 * Times), no tables, photos, icons or text boxes. Sizes are in points.
 */
import { customSections, dateRange, hasSection, orderFor, sectionTitle, type Design, type Entry, type Resume, type Stage, type TemplateId } from "./resume";

/* ---------------- what the page shows, independent of the template ---------------- */

export interface DocEntry { key: string; title: string; org: string; place: string; dates: string; score: string; bullets: string[] }
export type DocBlock =
  | { kind: "text"; title: string; text: string }
  | { kind: "entries"; title: string; entries: DocEntry[] }
  | { kind: "skills"; title: string; groups: { label: string; items: string }[] }
  | { kind: "list"; title: string; items: string[] };
export interface DocModel { name: string; contact: string[]; links: string[]; blocks: DocBlock[] }

const lines = (a: string[]) => a.map((x) => x.trim()).filter(Boolean);
const filled = (e: Entry) => !!(e.title.trim() || e.org.trim() || e.bullets.some((b) => b.trim()));
const docEntry = (e: Entry): DocEntry => ({ key: e.id, title: e.title.trim(), org: e.org.trim(), place: e.place.trim(), dates: dateRange(e), score: (e.score ?? "").trim(), bullets: lines(e.bullets) });

/** The resume as the templates draw it: header, then each section in print order. */
export function documentModel(r: Resume, stage: Stage): DocModel {
  const c = r.contact;
  const blocks: DocBlock[] = [];
  for (const k of orderFor(r, stage)) {
    if (!hasSection(r, k)) continue;
    const title = sectionTitle(k, stage);
    if (k === "summary") blocks.push({ kind: "text", title, text: r.summary.trim() });
    else if (k === "education" || k === "experience" || k === "projects") blocks.push({ kind: "entries", title, entries: r[k].filter(filled).map(docEntry) });
    else if (k === "skills") blocks.push({ kind: "skills", title, groups: r.skills.filter((g) => g.items.trim()).map((g) => ({ label: g.label.trim(), items: g.items.trim() })) });
    else if (k === "certifications") blocks.push({ kind: "list", title, items: r.certifications.filter((x) => x.name.trim()).map((x) => [x.name, x.issuer, x.year].map((y) => y.trim()).filter(Boolean).join(", ")) });
    else if (k === "achievements" || k === "activities") blocks.push({ kind: "list", title, items: lines(r[k]) });
    else if (k === "languages") blocks.push({ kind: "text", title, text: r.languages.trim() });
  }
  for (const s of customSections(r)) blocks.push({ kind: "list", title: s.title, items: s.items });
  return { name: c.name.trim(), contact: lines([c.city, c.phone, c.email]), links: lines([c.linkedin, c.link]), blocks };
}

export interface TemplateSpec {
  id: TemplateId;
  name: string;
  /** Who it suits, for the picker. */
  text: string;
  font: "Helvetica" | "Times-Roman";
  nameAlign: "left" | "center";
  nameUpper: boolean;
  nameSize: number;
  nameAccent: boolean;
  headingUpper: boolean;
  headingSize: number;
  headingAccent: boolean;
  /** A rule under each section heading. */
  headingRule: boolean;
  /** A rule under the header (name and contact). */
  headerRule: boolean;
  /** Entry layout: "role" = Title, Organisation | dates; "org" = Organisation (bold) | place, then Title (italic) | dates - the Harvard layout. */
  entry: "role" | "org";
  base: number;
  lineHeight: number;
  sectionGap: number;
  entryGap: number;
}

export const TEMPLATES: TemplateSpec[] = [
  { id: "modern", name: "Modern", text: "Clean and current - suits most roles.", font: "Helvetica", nameAlign: "left", nameUpper: false, nameSize: 22, nameAccent: true, headingUpper: true, headingSize: 10, headingAccent: true, headingRule: true, headerRule: false, entry: "role", base: 10, lineHeight: 1.38, sectionGap: 11, entryGap: 6 },
  { id: "classic", name: "Classic", text: "The Harvard-style format - finance, law, consulting, government.", font: "Times-Roman", nameAlign: "center", nameUpper: true, nameSize: 19, nameAccent: false, headingUpper: true, headingSize: 10.5, headingAccent: false, headingRule: true, headerRule: false, entry: "org", base: 10.5, lineHeight: 1.32, sectionGap: 10, entryGap: 6 },
  { id: "compact", name: "Compact", text: "Fits more on one page - good for lots of projects.", font: "Helvetica", nameAlign: "left", nameUpper: false, nameSize: 18, nameAccent: false, headingUpper: true, headingSize: 9.5, headingAccent: true, headingRule: true, headerRule: true, entry: "role", base: 9.3, lineHeight: 1.28, sectionGap: 7, entryGap: 4 },
  { id: "executive", name: "Executive", text: "Confident and spacious - for experienced professionals.", font: "Times-Roman", nameAlign: "left", nameUpper: false, nameSize: 24, nameAccent: true, headingUpper: false, headingSize: 12.5, headingAccent: true, headingRule: true, headerRule: true, entry: "org", base: 10.8, lineHeight: 1.36, sectionGap: 12, entryGap: 7 },
];

export const templateById = (id: TemplateId) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

const SCALE = { s: 0.92, m: 1, l: 1.08 } as const;
export const PAPER = { A4: { w: 595.28, h: 841.89 }, Letter: { w: 612, h: 792 } } as const;

/** Every size the renderers need, for one design. */
export function tokens(d: Design) {
  const t = templateById(d.template);
  const k = SCALE[d.size] ?? 1;
  const margin = d.margins === "narrow" ? 36 : 50;
  const paper = PAPER[d.paper] ?? PAPER.A4;
  return {
    t, margin, paper,
    accent: d.accent,
    ink: "#111111",
    muted: "#444444",
    base: +(t.base * k).toFixed(2),
    small: +(t.base * k * 0.92).toFixed(2),
    name: +(t.nameSize * k).toFixed(2),
    heading: +(t.headingSize * k).toFixed(2),
    lineHeight: t.lineHeight,
    sectionGap: t.sectionGap * k,
    entryGap: t.entryGap * k,
    /** Usable height of one page, for the page-break guide. */
    pageBody: paper.h - margin * 2,
  };
}
export type Tokens = ReturnType<typeof tokens>;

/** Characters the PDF's standard fonts can't draw, swapped for ones they can. */
export function pdfSafe(s: string): string {
  return s
    .replace(/₹\s?/g, "Rs. ").replace(/[→⟶]/g, "->").replace(/[←]/g, "<-").replace(/[✓✔]/g, "").replace(/[★☆●○◆■□►▶➤♦]/g, "")
    .replace(/[\u{1F000}-\u{1FAFF}☀-➿]/gu, "")
    .replace(/ /g, " ");
}
