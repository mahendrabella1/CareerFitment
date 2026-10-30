/**
 * Resume builder (/account/resume): the resume a student fills in, the
 * section order for their stage, an ATS check (what applicant-tracking
 * systems and recruiters trip over), keyword match against a job
 * description, and the plain-text version. Pure - shared by the page, the
 * AI route and the tests.
 */

export interface Entry {
  id: string;
  /** Role, degree/class, or project name. */
  title: string;
  /** Organisation, school/college, or (for a project) the tools used. */
  org: string;
  place: string;
  start: string;
  end: string;
  /** Education only: marks, CGPA or percentage. */
  score?: string;
  /** One line each. */
  bullets: string[];
}

export interface Resume {
  v: 1;
  target: string;
  contact: { name: string; email: string; phone: string; city: string; linkedin: string; link: string };
  summary: string;
  education: Entry[];
  experience: Entry[];
  projects: Entry[];
  /** "Technical: Python, SQL" - one group per line. */
  skills: { label: string; items: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  achievements: string[];
  activities: string[];
  languages: string;
  /** Extra sections the student names (Publications, Volunteering...), shown after the standard ones. */
  custom: { id: string; title: string; items: string[] }[];
  /** The student's own section order and hidden sections (null = the stage's order). */
  sectionOrder: SectionKey[] | null;
  hidden: SectionKey[];
  design: Design;
  updatedAt: number;
}

export type TemplateId = "modern" | "classic" | "compact" | "executive";
export interface Design {
  template: TemplateId;
  /** One ATS-safe accent colour (headings and rules only). */
  accent: string;
  size: "s" | "m" | "l";
  margins: "narrow" | "normal";
  paper: "A4" | "Letter";
}
export const DEFAULT_DESIGN: Design = { template: "modern", accent: "#1f3a5f", size: "m", margins: "normal", paper: "A4" };
export const ACCENTS = [
  { id: "#1f3a5f", name: "Navy" }, { id: "#111111", name: "Black" }, { id: "#0f5257", name: "Teal" },
  { id: "#6b1d2b", name: "Maroon" }, { id: "#3d3d3d", name: "Graphite" }, { id: "#1e4d2b", name: "Forest" },
];

export type SectionKey = "summary" | "education" | "experience" | "projects" | "skills" | "certifications" | "achievements" | "activities" | "languages";

export const SECTION_LABEL: Record<SectionKey, string> = {
  summary: "Summary", education: "Education", experience: "Experience", projects: "Projects", skills: "Skills",
  certifications: "Certifications", achievements: "Achievements", activities: "Activities & Leadership", languages: "Languages",
};

export type Stage = "school" | "college" | "professional";

export function stageOf(category?: string | null): Stage {
  if (category === "experienced_professional") return "professional";
  if (category === "graduate") return "college";
  if (category && category.startsWith("class_")) return "school";
  return "college";
}

/** Recruiters read the most relevant section first: education and activities
 *  for school students, education then internships for college, work first
 *  for professionals. */
export const SECTION_ORDER: Record<Stage, SectionKey[]> = {
  school: ["summary", "education", "achievements", "activities", "projects", "skills", "certifications", "languages"],
  college: ["summary", "education", "experience", "projects", "skills", "certifications", "achievements", "activities", "languages"],
  professional: ["summary", "experience", "skills", "education", "certifications", "projects", "achievements", "languages"],
};

/** What each stage calls "experience". */
export const EXPERIENCE_LABEL: Record<Stage, string> = { school: "Experience & Volunteering", college: "Internships & Experience", professional: "Experience" };

export const ALL_SECTIONS: SectionKey[] = ["summary", "education", "experience", "projects", "skills", "certifications", "achievements", "activities", "languages"];

/** The sections in the order they print: the student's order if set (sections it misses
 *  are added at the end), else the stage's; hidden ones left out. */
export function orderFor(r: Resume, stage: Stage): SectionKey[] {
  const base = r.sectionOrder?.length ? [...r.sectionOrder.filter((k) => ALL_SECTIONS.includes(k)), ...SECTION_ORDER[stage].filter((k) => !r.sectionOrder!.includes(k))] : SECTION_ORDER[stage];
  const seen = new Set<SectionKey>();
  return base.filter((k) => !seen.has(k) && seen.add(k) && !r.hidden.includes(k));
}

export const sectionTitle = (k: SectionKey, stage: Stage) => (k === "experience" ? EXPERIENCE_LABEL[stage] : SECTION_LABEL[k]);

let n = 0;
export const newId = () => `e${Date.now().toString(36)}${(n++).toString(36)}`;
export const blankEntry = (): Entry => ({ id: newId(), title: "", org: "", place: "", start: "", end: "", bullets: [] });

export function emptyResume(p?: { name?: string; email?: string; phone?: string; city?: string; institution?: string; desiredCareer?: string; classLabel?: string }): Resume {
  return {
    v: 1, target: p?.desiredCareer ?? "",
    contact: { name: p?.name ?? "", email: p?.email ?? "", phone: p?.phone ?? "", city: p?.city ?? "", linkedin: "", link: "" },
    summary: "",
    education: p?.institution ? [{ ...blankEntry(), title: p.classLabel ?? "", org: p.institution }] : [blankEntry()],
    experience: [], projects: [],
    skills: [{ label: "Technical", items: "" }, { label: "Soft skills", items: "" }],
    certifications: [], achievements: [], activities: [], languages: "",
    custom: [], sectionOrder: null, hidden: [], design: { ...DEFAULT_DESIGN },
    updatedAt: 0,
  };
}

/** Fills anything missing from an older or partial saved resume. */
export function normalise(raw: unknown, fallback: Resume): Resume {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Resume>;
  const arr = <T,>(v: unknown, d: T[]): T[] => (Array.isArray(v) ? (v as T[]) : d);
  const entries = (v: unknown) => arr<Entry>(v, []).map((e) => ({ ...blankEntry(), ...e, bullets: arr<string>(e?.bullets, []) }));
  return {
    ...fallback, ...r, v: 1,
    contact: { ...fallback.contact, ...(r.contact ?? {}) },
    education: r.education ? entries(r.education) : fallback.education,
    experience: entries(r.experience), projects: entries(r.projects),
    skills: arr(r.skills, fallback.skills), certifications: arr(r.certifications, []),
    achievements: arr<string>(r.achievements, []), activities: arr<string>(r.activities, []),
    custom: arr<Resume["custom"][number]>(r.custom, []).map((c) => ({ id: c?.id || newId(), title: String(c?.title ?? ""), items: arr<string>(c?.items, []) })),
    sectionOrder: Array.isArray(r.sectionOrder) ? r.sectionOrder : null,
    hidden: arr<SectionKey>(r.hidden, []),
    design: { ...DEFAULT_DESIGN, ...(r.design ?? {}) },
  };
}

export const skillList = (r: Resume) => r.skills.flatMap((g) => g.items.split(/[,;|]/)).map((s) => s.trim()).filter(Boolean);
const filled = (e: Entry) => !!(e.title.trim() || e.org.trim() || e.bullets.some((b) => b.trim()));

/** Adds skills to the first group (or a new "Skills" group), skipping ones already listed. */
export function addSkills(r: Resume, add: string[]): Resume {
  const have = new Set(skillList(r).map((s) => s.toLowerCase()));
  const fresh = add.map((s) => s.trim()).filter((s, i, a) => s && !have.has(s.toLowerCase()) && a.findIndex((x) => x.trim().toLowerCase() === s.toLowerCase()) === i);
  if (!fresh.length) return r;
  const groups = r.skills.length ? [...r.skills] : [{ label: "Skills", items: "" }];
  groups[0] = { ...groups[0], items: [groups[0].items.trim(), ...fresh].filter(Boolean).join(", ") };
  return { ...r, skills: groups };
}

export function hasSection(r: Resume, k: SectionKey): boolean {
  switch (k) {
    case "summary": return !!r.summary.trim();
    case "education": return r.education.some(filled);
    case "experience": return r.experience.some(filled);
    case "projects": return r.projects.some(filled);
    case "skills": return skillList(r).length > 0;
    case "certifications": return r.certifications.some((c) => c.name.trim());
    case "achievements": return r.achievements.some((a) => a.trim());
    case "activities": return r.activities.some((a) => a.trim());
    case "languages": return !!r.languages.trim();
  }
}

/** Every bullet line on the resume (experience, projects, education). */
export function allBullets(r: Resume): string[] {
  return [...r.experience, ...r.projects, ...r.education].flatMap((e) => e.bullets).map((b) => b.trim()).filter(Boolean);
}

/** The resume as plain text, in reading order - what an ATS extracts, and what to paste into a job portal. */
export function plainText(r: Resume, stage: Stage): string {
  const out: string[] = [];
  const c = r.contact;
  out.push(c.name.toUpperCase());
  out.push([c.city, c.phone, c.email].filter(Boolean).join(" | "));
  const links = [c.linkedin, c.link].filter(Boolean).join(" | ");
  if (links) out.push(links);
  const ent = (e: Entry) => {
    const head = [e.title, e.org].filter(Boolean).join(", ");
    const meta = [e.place, dateRange(e), e.score].filter(Boolean).join(" | ");
    out.push(meta ? `${head} | ${meta}` : head);
    for (const b of e.bullets.filter((x) => x.trim())) out.push(`- ${b.trim()}`);
  };
  for (const k of orderFor(r, stage)) {
    if (!hasSection(r, k)) continue;
    out.push("", sectionTitle(k, stage).toUpperCase());
    if (k === "summary") out.push(r.summary.trim());
    if (k === "education") r.education.filter(filled).forEach(ent);
    if (k === "experience") r.experience.filter(filled).forEach(ent);
    if (k === "projects") r.projects.filter(filled).forEach(ent);
    if (k === "skills") for (const g of r.skills.filter((g) => g.items.trim())) out.push(`${g.label}: ${g.items.trim()}`);
    if (k === "certifications") for (const x of r.certifications.filter((x) => x.name.trim())) out.push(`- ${[x.name, x.issuer, x.year].filter(Boolean).join(", ")}`);
    if (k === "achievements") for (const a of r.achievements.filter((x) => x.trim())) out.push(`- ${a.trim()}`);
    if (k === "activities") for (const a of r.activities.filter((x) => x.trim())) out.push(`- ${a.trim()}`);
    if (k === "languages") out.push(r.languages.trim());
  }
  for (const c of customSections(r)) {
    out.push("", c.title.toUpperCase());
    for (const a of c.items) out.push(`- ${a}`);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** The student's own sections that have a title and at least one line. */
export const customSections = (r: Resume) => r.custom.map((c) => ({ ...c, title: c.title.trim(), items: c.items.map((x) => x.trim()).filter(Boolean) })).filter((c) => c.title && c.items.length);

export const dateRange = (e: Pick<Entry, "start" | "end">) => [e.start.trim(), e.end.trim()].filter(Boolean).join(" - ");

/* ---------------- shared text rules (the ATS check is lib/resume/ats.ts) ---------------- */

export const ACTION_VERBS = new Set(("achieved analysed analyzed arranged assisted automated boosted built calculated chaired coached collaborated collected compiled completed composed conducted configured coordinated created curated debugged decreased delivered demonstrated deployed designed developed directed drafted drove edited enabled engineered established evaluated expanded facilitated founded generated guided handled helped hosted identified implemented improved increased initiated installed integrated interviewed introduced investigated launched led maintained managed mapped measured mentored modelled modeled monitored negotiated organised organized oversaw participated performed pitched planned prepared presented produced programmed promoted proposed prototyped published raised ran recruited redesigned reduced refactored represented researched resolved reviewed revised saved scheduled secured served shipped simplified solved spearheaded streamlined structured supervised supported surveyed taught tested trained transformed translated tutored upgraded volunteered won wrote awarded ranked qualified selected scored topped contributed captained co-founded co-led delivered documented validated optimised optimized").split(" "));

/** Past-tense words that describe a person, not an action ("Dedicated student"). */
const NOT_ACTIONS = new Set("interested motivated dedicated skilled experienced detailed talented based qualified certified committed passionate focused oriented driven".split(" "));

/** Starts with an action verb: a known one ("Lead", "Built"), or any past-tense verb ("Reconciled"). */
export function startsWithAction(line: string): boolean {
  const w = line.toLowerCase().replace(/^[^a-z]+/, "").split(/[\s,]/)[0] ?? "";
  if (ACTION_VERBS.has(w)) return true;
  return w.length > 4 && w.endsWith("ed") && !NOT_ACTIONS.has(w);
}

const STOP = new Set(("a about above across after again against all also am an and any are as at be because been before being below between both but by can could did do does doing done during each either etc every few for from further get good great had has have having he her here hers him his how however i if in into is it its just like make may me more most must my need new no nor not of off on once only or other our out over own per please plus preferred required requirements responsibilities role same shall she should so some such than that the their them then there these they this those through to too under until up upon us very via want was we well were what when where which while who whom why will with within without work working would year years you your able ability candidate candidates company team teams job looking join opportunity including include includes across strong excellent knowledge understanding experience experienced skills skill related relevant etc using use day days based level apply applicants position hiring hire build support help ensure within across also will can").split(" "));

/** The terms a job post asks for most: two-word phrases it repeats ("power bi",
 *  "data analysis"), then frequent single words not already inside one, minus filler. */
export function jdKeywords(jd: string, max = 18): string[] {
  const toks = jd.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/\s+/).map((t) => t.replace(/^[.-]+|[.-]+$/g, "")).filter(Boolean);
  const term = (t: string) => t.length >= 2 && !STOP.has(t) && !/^\d+$/.test(t);
  const uni = new Map<string, number>(), bi = new Map<string, number>();
  toks.forEach((t, i) => {
    if (term(t)) uni.set(t, (uni.get(t) ?? 0) + 1);
    const nx = toks[i + 1];
    if (nx && term(t) && term(nx)) bi.set(`${t} ${nx}`, (bi.get(`${t} ${nx}`) ?? 0) + 1);
  });
  const phrases = [...bi.entries()].filter(([, n]) => n >= 2).map(([k, n]) => ({ k, n: n + 0.5 }));
  const inPhrase = new Set(phrases.flatMap((p) => p.k.split(" ")));
  const singles = [...uni.entries()].filter(([k]) => !inPhrase.has(k) && k.length > 2).map(([k, n]) => ({ k, n }));
  return [...phrases, ...singles].sort((a, b) => b.n - a.n || a.k.localeCompare(b.k)).slice(0, max).map((x) => x.k);
}
