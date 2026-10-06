/**
 * The institution portal's deeper features - pure functions shared by the
 * server routes and the screens:
 *
 *   areasFor           broad career areas a text points to (shared vocabulary
 *                      for parents' wishes, students' fits, opportunities)
 *   parentAlignment    what parents want vs the student's measured fit and goal
 *   futureOutlook      how much each area is expected to change by 2035
 *   decisionMomentFor  the next big decision a student faces, with the exams
 *                      that matter for it
 *   traitCheck         teachers' observations vs what the test found
 *   suggestMentors     seniors matched to juniors by career area
 */
import { EXAMS, type ExamDef } from "@/data/exams/exams";
import type { StudentRow } from "@/lib/institution/types";

// ---------------------------------------------------------------- career areas

/**
 * `change` is OneGrasp's estimate of how much of a typical role's day-to-day
 * work is expected to be reshaped by AI and automation by 2035, informed by
 * published studies of AI exposure (e.g. the ILO's 2023 study of generative
 * AI and jobs, the WEF Future of Jobs reports). It is a planning aid for
 * schools, not a prediction about any student.
 */
export interface CareerArea {
  key: string;
  label: string;
  keywords: string[];
  examFields: string[];
  change: "high" | "medium" | "low";
  futureSkills: string[];
}

export const CAREER_AREAS: CareerArea[] = [
  { key: "computing", label: "Computers, IT & AI", keywords: ["software", "computer", "developer", "programm", "data ", "data-", "data scien", "analytics", "cyber", "cloud", "artificial intelligence", " ai ", "ai/", "machine learning", "it ", "information technology", "web ", "app "], examFields: ["engineering", "science"], change: "high", futureSkills: ["Working with AI coding assistants", "System design", "Data and AI ethics"] },
  { key: "engineering", label: "Engineering & Technology", keywords: ["engineer", "technolog", "mechanical", "civil", "electrical", "electronic", "robot", "automation", "aerospace", "manufactur", "mechatronic", "automobile", "chemical"], examFields: ["engineering"], change: "medium", futureSkills: ["Simulation and digital twins", "Data analysis", "Sustainability and energy"] },
  { key: "medicine", label: "Medicine & Healthcare", keywords: ["medic", "doctor", "health", "nurs", "pharma", "dental", "dentist", "clinical", "hospital", "physio", "surgeon", "mbbs", "therap", "paramedic"], examFields: ["medicine", "pharmacy"], change: "low", futureSkills: ["Digital health tools", "AI-assisted diagnosis literacy", "Patient communication"] },
  { key: "science", label: "Science & Research", keywords: ["science", "research", "physics", "chemistry", "biology", "biotech", "lab ", "laborator", "scientist", "geolog", "zoolog", "botan", "microbio", "genetic", "mathemat", "statistic"], examFields: ["science", "research", "olympiad"], change: "medium", futureSkills: ["Computational methods", "Data analysis and coding", "Research writing"] },
  { key: "business", label: "Business & Management", keywords: ["business", "management", "manager", "marketing", "sales", "entrepreneur", "startup", "consult", "operations", "human resource", "hr ", "supply chain", "logistic", "retail"], examFields: ["management"], change: "medium", futureSkills: ["Data-driven decisions", "AI tools for marketing and operations", "Negotiation and leadership"] },
  { key: "finance", label: "Commerce, Finance & Accounts", keywords: ["financ", "account", "commerce", "bank", "chartered", "audit", "tax", "invest", "insurance", "econom", "actuar"], examFields: ["commerce", "banking"], change: "high", futureSkills: ["Financial data analytics", "Automation of routine reporting", "Advisory and judgement"] },
  { key: "law", label: "Law & Public Policy", keywords: ["law", "legal", "lawyer", "advocate", "judici", "policy", "llb"], examFields: ["law"], change: "medium", futureSkills: ["Legal tech and AI research tools", "Argument and drafting", "Data protection"] },
  { key: "government", label: "Government & Civil Services", keywords: ["civil service", "ias", "ips", "government", "public administration", "upsc", "psu", "administrat"], examFields: ["government", "administration"], change: "low", futureSkills: ["Digital governance", "Public data literacy", "Communication"] },
  { key: "defence", label: "Defence & Uniformed Services", keywords: ["defence", "defense", "army", "navy", "air force", "police", "military", "nda"], examFields: ["defence"], change: "low", futureSkills: ["Technology and cyber awareness", "Fitness and leadership", "Drones and systems"] },
  { key: "design", label: "Design, Arts & Media", keywords: ["design", "artist", "creative", "media", "film", "animation", "fashion", "journalis", "music", "photograph", "architect", "fine art", "content", "writer", "game art", "ux"], examFields: ["design", "fashion", "architecture", "arts"], change: "high", futureSkills: ["Creating with generative AI", "Taste, storytelling and direction", "Portfolio building"] },
  { key: "education", label: "Teaching & Education", keywords: ["teach", "education", "professor", "lecturer", "tutor", "school"], examFields: ["teaching"], change: "medium", futureSkills: ["Teaching with AI and edtech", "Learning design", "Mentoring"] },
  { key: "hospitality", label: "Hospitality, Travel & Aviation", keywords: ["hotel", "hospitality", "tourism", "travel", "aviation", "pilot", "airline", "airport", "culinary", "chef", "event", "cabin crew"], examFields: ["general"], change: "low", futureSkills: ["Customer experience", "Digital booking and revenue tools", "Languages"] },
  { key: "agriculture", label: "Agriculture, Food & Environment", keywords: ["agri", "farm", "horticult", "fisher", "forest", "dairy", "food", "environment", "climate", "veterin"], examFields: ["science"], change: "medium", futureSkills: ["Precision agriculture and drones", "Climate data", "Agri-business"] },
  { key: "sports", label: "Sports & Fitness", keywords: ["sport", "fitness", "coach", "yoga", "athlet", "physical education"], examFields: ["general"], change: "low", futureSkills: ["Sports science and analytics", "Nutrition", "Coaching"] },
  { key: "social", label: "Psychology & Social Work", keywords: ["psycholog", "counsel", "social work", "ngo", "community", "sociolog"], examFields: ["arts"], change: "low", futureSkills: ["Digital mental-health tools", "Research methods", "Empathy and communication"] },
];

export const AREA_BY_KEY: Record<string, CareerArea> = Object.fromEntries(CAREER_AREAS.map((a) => [a.key, a]));

/** The career areas a text (a career, cluster or field name) points to. */
export function areasFor(...texts: (string | null | undefined)[]): string[] {
  const t = ` ${texts.filter(Boolean).join(" | ").toLowerCase()} `;
  if (!t.trim()) return [];
  return CAREER_AREAS.filter((a) => a.keywords.some((k) => t.includes(k))).map((a) => a.key);
}

/** A student's areas: from their measured fits, and from their own goal. */
export function studentAreas(row: StudentRow): { fit: string[]; goal: string[] } {
  return { fit: areasFor(...row.assessment.topFits, row.assessment.topFit), goal: areasFor(row.assessment.desiredCareer) };
}

// ---------------------------------------------------------------- parent alignment

export interface ParentSurvey {
  uid: string;
  institutionId: string;
  parentName: string;
  relation: string;
  phone: string;
  language: "en" | "hi" | "te";
  /** Career areas they want for their child, or ["open"] for "whatever my child chooses". */
  areas: string[];
  firmness: "open" | "prefer" | "insist";
  priorities: string[];
  note: string;
  submittedAt: number;
}

export const PARENT_PRIORITIES = ["Stable job", "High salary", "Government job", "Study or work abroad", "Close to home", "Child's own interest", "Social respect", "Business of our own"];

export type AlignmentStatus = "aligned" | "partial" | "conflict" | "open" | "no_report";

export interface Alignment {
  status: AlignmentStatus;
  severity: "high" | "medium" | "low";
  summary: string;
  /** A short guide for the counsellor's three-way conversation. */
  guide: string[];
}

const label = (k: string) => AREA_BY_KEY[k]?.label ?? k;
const list = (ks: string[]) => ks.map(label).join(", ");

export function parentAlignment(survey: ParentSurvey, row: StudentRow): Alignment {
  if (survey.areas.includes("open")) {
    return { status: "open", severity: "low", summary: "Parents are open to whatever the child chooses.", guide: ["Share the report's best-fit areas with the parents so they can support the choice."] };
  }
  if (row.assessment.status !== "completed") {
    return { status: "no_report", severity: "low", summary: `Parents hope for ${list(survey.areas)}; the student hasn't completed the assessment yet.`, guide: ["Ask the student to complete the assessment, then compare."] };
  }
  const { fit, goal } = studentAreas(row);
  const fitMatch = survey.areas.filter((a) => fit.includes(a));
  const goalMatch = survey.areas.filter((a) => goal.includes(a));
  const childWants = row.assessment.desiredCareer ? `the student wants ${row.assessment.desiredCareer}` : "the student hasn't named a goal";
  const fits = row.assessment.topFits.length ? row.assessment.topFits.slice(0, 2).join(" and ") : "no clear fit";
  if (fitMatch.length && (goalMatch.length || !goal.length)) {
    return { status: "aligned", severity: "low", summary: `Parents, report and student point the same way (${list(fitMatch)}).`, guide: ["Confirm the plan together and agree the next step on the roadmap."] };
  }
  if (fitMatch.length || goalMatch.length) {
    return {
      status: "partial", severity: survey.firmness === "insist" ? "medium" : "low",
      summary: `Parents want ${list(survey.areas)}; the report's strongest fits are ${fits}; ${childWants}.`,
      guide: [
        `Start from what overlaps: ${list([...new Set([...fitMatch, ...goalMatch])])}.`,
        "Show the parents the evidence in the report for the other options.",
        "Agree on one shared next step to try for a term.",
      ],
    };
  }
  return {
    status: "conflict", severity: survey.firmness === "insist" ? "high" : "medium",
    summary: `Parents want ${list(survey.areas)}${survey.firmness === "insist" ? " and are firm about it" : ""}; the report's strongest fits are ${fits}; ${childWants}.`,
    guide: [
      "Meet the student first, alone: what do they want, and why?",
      `With the parents, start from their priorities (${survey.priorities.slice(0, 2).join(", ") || "what they value"}) - show which options meet them.`,
      "Walk through the report's evidence, not opinions.",
      "Look for a path that keeps both doors open (e.g. a stream that allows both).",
      "Agree a review date after the student tries a related activity.",
    ],
  };
}

// ---------------------------------------------------------------- future outlook

export function futureOutlook(rows: StudentRow[]): {
  students: number;
  byChange: Record<"high" | "medium" | "low" | "unknown", number>;
  areas: { key: string; label: string; change: CareerArea["change"]; students: number; futureSkills: string[] }[];
} {
  const byChange = { high: 0, medium: 0, low: 0, unknown: 0 };
  const count = new Map<string, number>();
  for (const r of rows) {
    const { fit, goal } = studentAreas(r);
    const primary = goal[0] ?? fit[0];
    if (!primary) { byChange.unknown++; continue; }
    byChange[AREA_BY_KEY[primary].change]++;
    count.set(primary, (count.get(primary) ?? 0) + 1);
  }
  const areas = [...count.entries()].map(([key, students]) => ({ key, label: label(key), change: AREA_BY_KEY[key].change, students, futureSkills: AREA_BY_KEY[key].futureSkills }))
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.change] - { high: 0, medium: 1, low: 2 }[b.change]) || b.students - a.students);
  return { students: rows.length, byChange, areas };
}

// ---------------------------------------------------------------- decision moments

export interface DecisionMoment {
  key: string;
  title: string;
  why: string;
  /** What to settle, as questions for the student, parents and counsellor. */
  questions: string[];
}

export const DECISION_MOMENTS: Record<string, DecisionMoment> = {
  explore: { key: "explore", title: "Explore interests", why: "Classes 6 to 8 are for discovering what you enjoy before streams narrow the choices.", questions: ["Which subjects or activities do you lose track of time in?", "Which two careers from your report would you like to learn more about?"] },
  stream: { key: "stream", title: "Choosing your Class 11 stream", why: "The stream decides which courses and entrance exams stay open after Class 12.", questions: ["Which stream keeps your best-fit careers open?", "Which subjects are you strongest and happiest in?", "Do your parents and you agree - and if not, which stream keeps both options open?"] },
  exams: { key: "exams", title: "Planning your entrance exams", why: "Most entrance exams need a year of preparation; registrations open months before the exam.", questions: ["Which exams lead to your target courses?", "When do their registrations open and close?", "What is your weekly preparation plan?"] },
  college: { key: "college", title: "Choosing your course and college", why: "Entrance results, counselling rounds and admissions come in quick succession.", questions: ["Which courses match your best fit and your goal?", "Which colleges, and what are their cut-offs and fees?", "What is your backup option if a result disappoints?"] },
  internship: { key: "internship", title: "Internships and your next step", why: "Internships during the degree are the strongest proof for a first job or a master's admission.", questions: ["Which internship would build your target role's skills?", "Job, master's in India or study abroad - which first?", "What will your final-year project prove?"] },
};

export function decisionMomentFor(row: StudentRow): DecisionMoment {
  switch (row.category) {
    case "class_6": case "class_7": case "class_8": return DECISION_MOMENTS.explore;
    case "class_9_10": return DECISION_MOMENTS.stream;
    case "class_11": return DECISION_MOMENTS.exams;
    case "class_12": case "class_11_12": return DECISION_MOMENTS.college;
    default: return DECISION_MOMENTS.internship;
  }
}

/** Exams relevant to the student's areas and stage, with their next date in
 *  the coming 180 days - or, when the new cycle isn't announced yet, what is
 *  expected (date ""). Dated ones first. */
export function examsFor(row: StudentRow, now: number = Date.now()): { exam: ExamDef; next: { label: string; date: string } }[] {
  const { fit, goal } = studentAreas(row);
  const fields = new Set([...goal, ...fit].flatMap((k) => AREA_BY_KEY[k]?.examFields ?? []));
  const stage = row.category === "graduate" ? ["college", "professional"] : ["class_11", "class_12", "class_11_12"].includes(row.category) ? ["after12"] : ["school"];
  const horizon = now + 180 * 86400000;
  const out: { exam: ExamDef; next: { label: string; date: string } }[] = [];
  for (const e of EXAMS) {
    if (!stage.includes(e.stage) || !e.fields.some((f) => fields.has(f) || (stage[0] === "school" && f === "olympiad"))) continue;
    const next = e.events.map((ev) => ({ label: ev.label, date: ev.date, t: Date.parse(ev.date) })).filter((ev) => ev.t >= now - 86400000 && ev.t <= horizon).sort((a, b) => a.t - b.t)[0];
    if (next) out.push({ exam: e, next: { label: next.label, date: next.date } });
    else if (!e.events.some((ev) => Date.parse(ev.date) > horizon)) out.push({ exam: e, next: { label: e.cycle.expected ?? "Dates not announced yet - check the official site", date: "" } });
  }
  return out.sort((a, b) => (a.next.date ? 0 : 1) - (b.next.date ? 0 : 1) || a.next.date.localeCompare(b.next.date)).slice(0, 5);
}

/** The decision brief as message text (also shown on the printable brief page). */
export function decisionBriefText(row: StudentRow, now: number = Date.now()): { title: string; body: string } {
  const m = decisionMomentFor(row);
  const first = row.name.split(" ")[0] || "there";
  const lines = [
    `Hi ${first}, you have an important decision coming up: ${m.title.toLowerCase()}.`,
    m.why,
    "",
    row.assessment.topFits.length ? `Your report's strongest fits: ${row.assessment.topFits.join(", ")}.` : "Complete your career assessment first - the decision is much easier with your report.",
    row.assessment.desiredCareer ? `Your goal: ${row.assessment.desiredCareer}.` : "",
  ];
  const exams = examsFor(row, now);
  if (exams.length) {
    lines.push("", "Dates to watch:");
    for (const x of exams) {
      lines.push(x.next.date
        ? `- ${x.exam.name}: ${x.next.label}, ${new Date(x.next.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
        : `- ${x.exam.name}: dates not announced yet. ${x.next.label}`);
    }
  }
  lines.push("", "Talk these through with your parents and counsellor:", ...m.questions.map((q) => `- ${q}`));
  return { title: `Your decision brief: ${m.title}`, body: lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n").trim() };
}

// ---------------------------------------------------------------- teacher observations

export const TRAITS: { key: string; label: string; hint: string; keywords: string[] }[] = [
  { key: "leadership", label: "Leadership", hint: "Takes charge, organises others", keywords: ["lead", "influenc", "command", "executi", "enterpris", "entj", "estj"] },
  { key: "teamwork", label: "Teamwork", hint: "Works well with others, helps peers", keywords: ["team", "relationship", "interpersonal", "social", "empath", "cooperat", "harmony"] },
  { key: "creativity", label: "Creativity", hint: "Original ideas, imaginative work", keywords: ["creativ", "innovat", "imagin", "artistic", "spatial", "ideation", "musical"] },
  { key: "communication", label: "Communication", hint: "Explains clearly, speaks up", keywords: ["communicat", "linguistic", "verbal", "express", "present", "persuas"] },
  { key: "persistence", label: "Persistence", hint: "Finishes work, keeps trying", keywords: ["persist", "disciplin", "conscientious", "achiev", "resilien", "grit", "self-manag", "self manag", "focus"] },
];

/** Traits the test found strong, from the names of the student's top strengths. */
export function testTraits(strengthNames: string[]): string[] {
  const t = strengthNames.join(" | ").toLowerCase();
  return TRAITS.filter((x) => x.keywords.some((k) => t.includes(k))).map((x) => x.key);
}

export interface TraitGap { trait: string; kind: "test_only" | "teacher_only"; text: string }

/** Where teachers and the test disagree: the test says strong but teachers
 *  rate it 1-2, or teachers rate it 5 but the test didn't pick it up. */
export function traitCheck(ratings: Record<string, number>, strengthNames: string[]): TraitGap[] {
  const strong = new Set(testTraits(strengthNames));
  const out: TraitGap[] = [];
  for (const t of TRAITS) {
    const r = ratings[t.key];
    if (!r) continue;
    if (strong.has(t.key) && r <= 2) out.push({ trait: t.key, kind: "test_only", text: `The test shows strong ${t.label.toLowerCase()}, but teachers rarely see it (${r}/5). Is it hidden in class, or over-reported?` });
    if (!strong.has(t.key) && r === 5) out.push({ trait: t.key, kind: "teacher_only", text: `Teachers see excellent ${t.label.toLowerCase()} (5/5) that the test didn't pick up - worth telling the student.` });
  }
  return out;
}

// ---------------------------------------------------------------- mentors

const CLASS_ORDER = ["class_6", "class_7", "class_8", "class_9_10", "class_11", "class_11_12", "class_12", "graduate"];
const classRank = (c: string) => CLASS_ORDER.indexOf(c);

/** For each junior, the best senior from the same institution: a higher
 *  class, assessment done, sharing a career area; seniors who have done more
 *  (lessons, active days) rank first; each mentor gets at most 3 juniors. */
export function suggestMentors(rows: StudentRow[], taken: Set<string> = new Set()): { mentor: StudentRow; mentee: StudentRow; area: string }[] {
  const ready = rows.filter((r) => !r.archived && r.assessment.status === "completed");
  const load = new Map<string, number>();
  const score = (r: StudentRow) => Object.values(r.courses).reduce((s, c) => s + c.done, 0) + Object.keys(r.activity.byDay).length;
  const seniors = [...ready].sort((a, b) => score(b) - score(a));
  const out: { mentor: StudentRow; mentee: StudentRow; area: string }[] = [];
  for (const junior of ready) {
    if (taken.has(junior.uid) || classRank(junior.category) < 0) continue;
    const jAreas = new Set([...studentAreas(junior).goal, ...studentAreas(junior).fit]);
    for (const s of seniors) {
      if (s.uid === junior.uid || classRank(s.category) <= classRank(junior.category) || (load.get(s.uid) ?? 0) >= 3) continue;
      const shared = [...new Set([...studentAreas(s).goal, ...studentAreas(s).fit])].find((a) => jAreas.has(a));
      if (!shared) continue;
      out.push({ mentor: s, mentee: junior, area: shared });
      load.set(s.uid, (load.get(s.uid) ?? 0) + 1);
      break;
    }
  }
  return out;
}
