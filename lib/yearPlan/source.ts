/**
 * The Year Plan's content for each class group, built from what the app
 * really has - every course lesson, the class's own Communication Lab and
 * Aptitude Lab track, every tool page in the feature menus (the same task
 * lists My Progress uses), the Startups course and the career tools - so the
 * plan never points at a page that doesn't exist and grows with the content.
 *
 * SERVER-ONLY in practice: it pulls in every course and lab. The browser gets
 * a track's plan from /api/year-plan/<track> (built once at deploy); the
 * institution portal imports it on the server.
 *
 * Each stream is spread over its own part of the year (`from`-`to`, 0-1),
 * which is what makes the plan different per class: entrance exams early for
 * Class 11-12 and late for Class 6-8, resume and jobs early for graduates.
 */
import { MONEY_COURSE } from "@/data/courses/money";
import { LEGAL_COURSE } from "@/data/courses/legal";
import { EXAMS_COURSE } from "@/data/courses/exams";
import { SCHOLARSHIPS_COURSE } from "@/data/courses/scholarships";
import { STUDY_ABROAD_COURSE } from "@/data/courses/studyAbroad";
import { RESEARCH_COURSE } from "@/data/courses/research";
import type { CourseContent } from "@/lib/course/types";
import { BUILDER_TRACK } from "@/data/startups/content";
import { TRACKS as COMM_TRACKS, lessonHref } from "@/lib/commLab/content";
import { APT_TRACKS, MOCKS_PER_TRACK, TOPIC_INFO } from "@/lib/aptitude/tracks";
import { FEATURE_TASK_SPECS } from "@/lib/progress/buildFeatureTasks";
import { FEATURES } from "@/lib/features/catalog";
import type { PlanItem, PlanSource, PlanStream, PlanTask, PlanTrackId, TaskKind } from "./plan";

export const PLAN_TRACKS: { id: PlanTrackId; label: string }[] = [
  { id: "t1", label: "Class 6–8" },
  { id: "t2", label: "Class 9–10" },
  { id: "t3", label: "Class 11–12" },
  { id: "t4", label: "College" },
];

const COURSES: Record<string, CourseContent> = {
  money: MONEY_COURSE, legal: LEGAL_COURSE, exams: EXAMS_COURSE, scholarships: SCHOLARSHIPS_COURSE,
  "study-abroad": STUDY_ABROAD_COURSE, research: RESEARCH_COURSE,
};

type Win = [number, number];
/** Where in the year each course (and its tools) sits, per class group. */
const COURSE_WIN: Record<PlanTrackId, Record<string, Win>> = {
  t1: { money: [0.03, 0.45], legal: [0.25, 0.8], research: [0.45, 0.95], scholarships: [0.55, 0.9], exams: [0.65, 0.97], "study-abroad": [0.7, 0.97] },
  t2: { money: [0.03, 0.4], exams: [0.08, 0.55], scholarships: [0.15, 0.6], legal: [0.3, 0.85], research: [0.5, 0.95], "study-abroad": [0.6, 0.97] },
  t3: { exams: [0.03, 0.5], scholarships: [0.08, 0.55], money: [0.2, 0.6], "study-abroad": [0.3, 0.75], legal: [0.45, 0.92], research: [0.5, 0.97] },
  t4: { money: [0.03, 0.4], legal: [0.15, 0.6], research: [0.25, 0.8], scholarships: [0.3, 0.75], "study-abroad": [0.4, 0.9], exams: [0.5, 0.97] },
};
const TOOL_WIN: Record<PlanTrackId, Record<string, Win>> = {
  t1: { careers: [0.04, 0.3], internships: [0.6, 0.9], ai: [0.08, 0.6] },
  t2: { careers: [0.04, 0.3], internships: [0.5, 0.85], ai: [0.08, 0.6] },
  t3: { careers: [0.04, 0.3], internships: [0.4, 0.8], ai: [0.08, 0.6] },
  t4: { careers: [0.04, 0.3], internships: [0.2, 0.6], ai: [0.08, 0.6] },
};
const STARTUPS_WIN: Record<PlanTrackId, Win> = { t1: [0.45, 0.9], t2: [0.4, 0.85], t3: [0.35, 0.8], t4: [0.25, 0.75] };
/** One-off career tools, each at its own point in the year. */
const SINGLE_WIN: Record<string, Record<PlanTrackId, Win>> = {
  testDrive: { t1: [0.15, 0.3], t2: [0.1, 0.3], t3: [0.1, 0.25], t4: [0.1, 0.25] },
  decision: { t1: [0.7, 0.8], t2: [0.35, 0.5], t3: [0.3, 0.45], t4: [0.35, 0.5] },
  passport: { t1: [0.4, 0.6], t2: [0.4, 0.6], t3: [0.4, 0.6], t4: [0.3, 0.5] },
  portfolio: { t1: [0.8, 0.95], t2: [0.75, 0.9], t3: [0.7, 0.85], t4: [0.4, 0.6] },
  resume: { t1: [0.9, 1], t2: [0.85, 0.95], t3: [0.75, 0.9], t4: [0.15, 0.3] },
  interview: { t1: [0.92, 1], t2: [0.88, 1], t3: [0.8, 0.95], t4: [0.3, 0.45] },
  jobs: { t1: [0.95, 1], t2: [0.9, 1], t3: [0.85, 1], t4: [0.45, 0.6] },
  spotlight: { t1: [0.85, 1], t2: [0.8, 1], t3: [0.7, 0.9], t4: [0.55, 0.75] },
  startupsMore: { t1: [0.88, 0.97], t2: [0.84, 0.95], t3: [0.8, 0.92], t4: [0.7, 0.85] },
};

const COURSE_WHY: Record<string, string> = {
  money: "Money skills you'll use all your life - budgeting, saving, banking and spotting scams.",
  legal: "Know your rights - at school, online, at work and as a consumer.",
  exams: "Which entrance exams lead where, when they happen and how to prepare.",
  scholarships: "Find the scholarships you qualify for and apply well before the deadline.",
  "study-abroad": "Decide honestly about studying abroad - costs, countries, courses and safety.",
  research: "How research works - from a question to a paper you could present.",
};

const lessonsMinutes = (ls: { minutes?: number }[]) => ls.reduce((s, l) => s + (l.minutes || 5), 0);
const one = (kind: TaskKind, id: string, title: string, why: string, href: string, minutes: number, items: PlanItem[]): PlanTask =>
  ({ id, kind, title, why, href, minutes, items });

function courseStream(track: PlanTrackId, key: string): PlanStream {
  const c = COURSES[key];
  const home = FEATURES[key].href;
  const [from, to] = COURSE_WIN[track][key];
  return {
    key: `course:${key}`, from, to,
    // A long module is split into parts of about half an hour, so no single week is a pile.
    tasks: c.modules.flatMap((m) => {
      const parts = Math.max(1, Math.ceil(lessonsMinutes(m.lessons) / PART_MINUTES));
      const size = Math.ceil(m.lessons.length / parts);
      const chunks = Array.from({ length: Math.ceil(m.lessons.length / size) }, (_, i) => m.lessons.slice(i * size, (i + 1) * size));
      return chunks.map((ls, i) => {
        const items = ls.map((l) => ({ label: l.title, href: `${home}?lesson=${l.id}`, check: { k: "lesson" as const, c: key, l: l.id } }));
        const part = chunks.length > 1 ? ` (part ${i + 1} of ${chunks.length})` : "";
        return one("learn", `course:${key}:${m.id}${chunks.length > 1 ? `:${i + 1}` : ""}`, `${FEATURES[key].title}: ${m.title}${part}`, COURSE_WHY[key], items[0].href, lessonsMinutes(ls), items);
      });
    }),
  };
}
/** Course modules longer than this are split into parts. */
const PART_MINUTES = 40;

/** Each feature's tools, one task per menu group ("open each one once"). */
function toolStream(track: PlanTrackId, key: string): PlanStream | null {
  const spec = FEATURE_TASK_SPECS.find((s) => s.key === key);
  if (!spec?.tasks.length) return null;
  const groups = new Map<string, PlanItem[]>();
  for (const t of spec.tasks) {
    const items = groups.get(t.group) ?? [];
    items.push({ label: t.kind === "any" ? `${t.label} (open any one)` : t.label, href: t.href, check: { k: "tool", f: key, t: t.id } });
    groups.set(t.group, items);
  }
  const win = COURSE_WIN[track][key] ?? TOOL_WIN[track][key] ?? [0.1, 0.9];
  const from = Math.min(0.97, win[0] + 0.05), to = Math.min(1, Math.max(from + 0.02, win[1] + 0.02));
  const title = FEATURES[key].title;
  return {
    key: `tools:${key}`, from, to,
    tasks: [...groups.entries()].map(([group, items]) =>
      one("explore", `tools:${key}:${group}`, `${title} - ${group.toLowerCase() === title.toLowerCase() ? "tools" : group}`,
        "Open each of these once and try it - a few minutes each.", items[0].href, 5 * items.length, items)),
  };
}

function commStream(track: PlanTrackId): PlanStream {
  const t = COMM_TRACKS.find((x) => x.id === track)!;
  return {
    key: "comm", from: 0.02, to: 0.98,
    tasks: t.modules.map((m) => one("learn", `comm:${m.id}`, `Communication Lab: ${m.title}`,
      "Speak, write and listen with confidence - videos, activities and voice practice with feedback.",
      lessonHref(t, m, m.lessons[0]), lessonsMinutes(m.lessons),
      m.lessons.map((l) => ({ label: l.title, href: lessonHref(t, m, l), check: { k: "comm" as const, l: l.id } })))),
  };
}

function aptStreams(track: PlanTrackId): PlanStream[] {
  const t = APT_TRACKS[Number(track.slice(1)) - 1];
  const info = TOPIC_INFO as Record<string, { title: string; section: string }>;
  const order = ["quant", "reasoning", "verbal", "di"];
  // Topics in threes within a section, then the sections taken in turn so the
  // weeks alternate between maths, reasoning and English.
  const queues = order.map((sec) => {
    const ids = t.topics.filter((x) => info[x.id].section === sec).map((x) => ({ id: x.id }));
    const q: { id: string }[][] = [];
    for (let i = 0; i < ids.length; i += 3) q.push(ids.slice(i, i + 3));
    return q;
  });
  const mixed: { id: string }[][] = [];
  while (queues.some((q) => q.length)) for (const q of queues) { const c = q.shift(); if (c) mixed.push(c); }
  return [
    {
      key: "apt", from: 0.04, to: 0.9,
      tasks: mixed.map((c) => one("practise", `apt:${c.map((x) => x.id).join("+")}`, `Aptitude: ${c.map((x) => info[x.id].title).join(", ")}`,
        "A set of 10 questions per topic, with the worked solution after each answer.",
        `/account/aptitude/topic/${c[0].id}`, 12 * c.length,
        c.map((x) => ({ label: info[x.id].title, href: `/account/aptitude/topic/${x.id}`, check: { k: "apt" as const, t: x.id } })))),
    },
    {
      key: "apt-mock", from: 0.35, to: 0.97,
      tasks: Array.from({ length: MOCKS_PER_TRACK }, (_, i) => one("practise", `apt:mock${i + 1}`, `Aptitude mock test ${i + 1}`,
        `A timed test in the style of ${t.forExams.split(",")[0]} - then review every question.`,
        `/account/aptitude/mock/${i + 1}`, t.mock.minutes + 10,
        [{ label: `Mock test ${i + 1}`, href: `/account/aptitude/mock/${i + 1}`, check: { k: "mock" as const, n: i + 1 } }])),
    },
  ];
}

function startupsStream(track: PlanTrackId): PlanStream {
  const [from, to] = STARTUPS_WIN[track];
  const tr = BUILDER_TRACK;
  return {
    key: "startups", from, to,
    tasks: tr.modules.map((m) => {
      const items = m.lessons.map((l) => ({ label: l.title, href: `/account/startups/${tr.slug}/${m.slug}/${l.slug}`, check: { k: "page" as const, a: "startups", p: `/account/startups/${tr.slug}/${m.slug}/${l.slug}` } }));
      return one("learn", `startups:${m.slug}`, `Startups: ${m.title}`, "Turn an idea into a small venture - short lessons, then the module test.",
        items[0].href, m.lessons.reduce((s, l) => s + (l.durationMin || 8), 0), items);
    }),
  };
}

const page = (a: string, p: string, label: string): PlanItem => ({ label, href: p, check: { k: "page", a, p } });

function singles(track: PlanTrackId): PlanStream[] {
  const s = (key: string, task: PlanTask): PlanStream => ({ key, from: SINGLE_WIN[key][track][0], to: SINGLE_WIN[key][track][1], tasks: [task] });
  const spotlight = [page("spotlight", "/account/spotlight/conferences", "Conferences"), page("spotlight", "/account/spotlight/writing", "Research writing"),
    page("spotlight", "/account/spotlight/isbn", "Publish a book (ISBN)"), page("spotlight", "/account/spotlight/magazine", "Awardees Magazine")];
  if (track === "t4") spotlight.push(page("spotlight", "/account/spotlight/issn", "Start a journal (ISSN)"));
  return [
    s("testDrive", one("explore", "x:test-drive", "Test-drive a career", "Fifteen minutes in a real day of the job tells you more than any description.", "/account/test-drive", 15, [page("test_drive", "/account/test-drive", "Career Test-Drive")])),
    s("decision", one("build", "x:decision", "Talk it through in the Family Decision Room", "Put your options side by side with your family, and agree the next step.", "/account/decision-room", 20, [page("decision", "/account/decision-room", "Family Decision Room")])),
    s("passport", one("build", "x:passport", "Start your Career Passport", "Add a project, certificate or win - with proof your school can verify.", "/account/passport", 15, [page("passport", "/account/passport", "Career Passport")])),
    s("portfolio", one("build", "x:portfolio", "Make your portfolio page", "A one-page website of your work to share with schools, colleges and employers.", "/account/portfolio", 25, [page("portfolio", "/account/portfolio", "Portfolio builder")])),
    s("resume", one("build", "x:resume", "Write your resume", "Build it from your profile and check it against what employers' software reads.", "/account/resume/plan",
      30, [page("jobready", "/account/resume/plan", "Your plan"), page("jobready", "/account/resume", "Resume builder")])),
    s("interview", one("practise", "x:interview", "Practise interview questions", "Model answers, then a mock interview with feedback on what you said.", "/account/interview",
      25, [page("jobready", "/account/interview", "Interview questions"), page("jobready", "/account/interview/practice", "Mock interview")])),
    s("jobs", one("explore", "x:jobs", "See jobs and internships for you", "Real openings matched to your resume - and what to add to qualify.", "/account/resume/jobs",
      15, [page("jobready", "/account/resume/jobs", "Jobs for you"), page("jobs", "/account/jobs", "Job board")])),
    s("spotlight", one("explore", "x:spotlight", "Spotlight: conferences, writing and publishing", "Ways to get your work seen - present, publish, or write for a magazine.", spotlight[0].href, 5 * spotlight.length, spotlight)),
    s("startupsMore", one("explore", "x:startups-more", "Startups: videos, funding and your venture page", "Founders' stories, real funding programmes and a page for your idea.", "/account/startups/videos",
      20, [page("startups", "/account/startups/videos", "Founder videos"), page("startups", "/account/startups/funding", "Funding programmes"), page("startups", "/account/startups/portfolio", "Venture portfolio"), page("startups", "/account/startups/placement", "Placement")])),
  ];
}

export function buildPlanSource(track: PlanTrackId): PlanSource {
  const label = PLAN_TRACKS.find((t) => t.id === track)!.label;
  const streams: PlanStream[] = [
    {
      key: "start", from: 0, to: 0.03,
      tasks: [
        one("explore", "x:assessment", "Take your career assessment", "Everything else - your report, your best-fit careers and this plan - builds on it.", "/?begin=1", 45, [{ label: "Career assessment", href: "/?begin=1", check: { k: "assessment" } }]),
        // The dashboard records "/account/report" when the report opens (app/account/Dashboard.tsx).
        one("explore", "x:report", "Read your full report", "Your strengths, best-fit careers and the plan that goes with them - page by page.", "/account?view=report", 20,
          [{ label: "Your full report", href: "/account?view=report", check: { k: "page", a: "dashboard", p: "/account/report" } }]),
        one("build", "x:gps", "Set up your Career GPS", "Three small missions a week, chosen for you - a good habit to start now.", "/account/gps", 10, [page("gps", "/account/gps", "Career GPS")]),
      ],
    },
    {
      key: "daily", from: 0.03, to: 0.08,
      tasks: [one("practise", "x:daily", "Try the daily practice", "A one-minute speaking challenge and Today's 10 aptitude questions - something small for any day.", "/account/communication/practice",
        10, [page("communication", "/account/communication/practice", "Daily speaking challenge"), page("aptitude", "/account/aptitude/daily", "Today's 10"),
          page("communication", "/account/communication/progress", "Your Communication Score"), page("aptitude", "/account/aptitude/progress", "Your Aptitude Score")])],
    },
    commStream(track),
    ...aptStreams(track),
    ...Object.keys(COURSES).map((k) => courseStream(track, k)),
    ...[...Object.keys(COURSES), "careers", "internships", "ai"].map((k) => toolStream(track, k)).filter((x): x is PlanStream => !!x),
    startupsStream(track),
    ...singles(track),
    {
      key: "certificates", from: 0.97, to: 1,
      tasks: [one("build", "x:certificates", "Claim your course certificates", "One for each course you've finished - with a link anyone can check.", "/account/certificates", 10,
        ["money", "legal", "exams", "scholarships", "study-abroad", "research", "startups"].map((c) => ({ label: FEATURES[c].title, href: `/account/certificates?c=${c}`, check: { k: "cert" as const, c } })))],
    },
  ];
  return { track, label, tools: FEATURE_TASK_SPECS, streams };
}
