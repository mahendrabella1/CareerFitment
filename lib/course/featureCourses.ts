import { EXAMS } from "@/data/exams/exams";
import { MOCK_TESTS } from "@/data/exams/mocks";
import { LEGAL_GUIDES } from "@/data/legal/guides";
import { LEGAL_SCENARIOS } from "@/data/legal/scenarios";
import { LABS } from "@/data/money/labs";
import { SCHOLARSHIPS } from "@/data/scholarships/scholarships";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";
import { STUDY_ABROAD_COURSES } from "@/data/studyAbroad/courses";
import { UNIVERSITIES } from "@/data/studyAbroad/universities";
import { STUDIO_UNITS } from "@/data/research/studioUnits";
import { LETTER_TEMPLATES } from "@/lib/legal/templates";

export interface CourseNavItem {
  href: string;
  label: string;
  meta?: string;
  exact?: boolean;
  planned?: boolean;
}

export interface CourseNavGroup {
  title: string;
  items: CourseNavItem[];
  /** Shown on the section's home page ("What's inside"). */
  icon?: string;
  blurb?: string;
  /** Where the group's "Open" button goes - its first item when left out. */
  href?: string;
  cta?: string;
}

export interface FeatureCourse {
  accent: string;
  /** Second colour, kept for older callers - the shell no longer uses gradients. */
  accent2: string;
  /** Icon name from app/Icons.tsx for the section. */
  icon: string;
  title: string;
  intro: string;
  /** The section's home page; pinned as "Overview" at the top of the menu. */
  home: string;
  /** The one thing to do first - the main button on the home page. */
  start: { href: string; label: string };
  secondary?: { href: string; label: string };
  groups: CourseNavGroup[];
  safety?: string;
}


export const MONEY_COURSE: FeatureCourse = {
  accent: "#087f4b",
  accent2: "#0d9488",
  icon: "wallet",
  title: "Financial Literacy",
  intro: "Money skills are habits, not facts. Short, real tools instead of a syllabus.",
  home: "/account/money",
  start: { href: "/account/money/play", label: "Play Money Life" },
  secondary: { href: "/account/money/labs", label: "Try a Money Lab" },
  groups: [
    {
      title: "Learn", icon: "book", blurb: "One idea per card, in plain words - read one in a minute.", cta: "Open the cards",
      items: [{ href: "/account/money/cards", label: "Concept Library", meta: "Short cards" }],
    },
    {
      title: "Money Life", icon: "play", blurb: "Simulations where your money choices play out over months and years.", cta: "Start playing",
      items: [
        { href: "/account/money/play", label: "Money Life simulation", meta: "12 months" },
        { href: "/account/money/real-life", label: "Real Life world", meta: "10 years" },
        { href: "/account/money/journey", label: "Your Money Journey", meta: "Year-end report" },
        { href: "/account/money/habits", label: "Real money habits", meta: "Tracker" },
      ],
    },
    {
      title: "Scam Shield", icon: "shield", blurb: "Quick games that train you to spot a scam before it costs you.", href: "/account/money/scam-shield/swipe", cta: "Play Safe or Scam",
      items: [
        { href: "/account/money/scam-shield", label: "All games", exact: true },
        { href: "/account/money/scam-shield/swipe", label: "Safe or Scam" },
        { href: "/account/money/scam-shield/family", label: "Family Guard" },
        { href: "/account/money/scam-shield/spot-the-fake", label: "Spot the Fake" },
        { href: "/account/money/scam-shield/the-call", label: "The Call" },
        { href: "/account/money/scam-shield/too-good-to-be-true", label: "Too Good to Be True" },
        { href: "/account/money/scam-shield/scam-of-the-week", label: "Scam of the Week" },
      ],
    },
    {
      title: "Money Labs", icon: "score", blurb: "Move a slider and see what a choice really costs: EMIs, inflation, salary slips.", href: "/account/money/labs", cta: "See all labs",
      items: [
        { href: "/account/money/labs", label: "All labs", exact: true },
        ...LABS.map((l) => ({ href: `/account/money/labs/${l.slug}`, label: l.title })),
      ],
    },
  ],
  safety: "Virtual money only. No one from a bank, the police or a government office asks for your OTP, UPI PIN or CVV.",
};

export const RESEARCH_COURSE: FeatureCourse = {
  accent: "#7c3aed",
  accent2: "#c026d3",
  icon: "flask",
  title: "Research & Conferences",
  intro: "Pick a real conference, work backwards from its date, and present your own research.",
  home: "/account/research",
  start: { href: "/account/research/projects/new", label: "Start a research project" },
  secondary: { href: "/account/research/conferences", label: "Find a conference" },
  groups: [
    {
      title: "Research Studio", icon: "book", blurb: "Eight short units, from a good question to a finished talk.", href: "/account/research/studio", cta: "Open the studio",
      items: STUDIO_UNITS.map((u) => ({ href: `/account/research/studio/${u.slug}`, label: `${u.unit}. ${u.title}` })),
    },
    {
      title: "Your project", icon: "flag", blurb: "Pick a conference first, then plan every step back from its date.", cta: "Start a project",
      items: [
        { href: "/account/research", label: "Course overview", exact: true },
        { href: "/account/research/projects/new", label: "Start a project" },
      ],
    },
    {
      title: "Find and get feedback", icon: "search", blurb: "Find the right conference and get your work checked by a mentor.", cta: "Find a conference",
      items: [
        { href: "/account/research/conferences", label: "Conference Finder" },
        { href: "/account/research/mentor", label: "Mentor review queue" },
      ],
    },
    {
      title: "Present and share", icon: "video", blurb: "Rehearse your talk against the clock and share your research profile.", cta: "Practise your talk",
      items: [
        { href: "/account/research/practice", label: "Practice recorder", meta: "3 or 10 minutes" },
        { href: "/account/research/profile", label: "Research profile", meta: "With QR code" },
      ],
    },
  ],
};

export const LEGAL_COURSE: FeatureCourse = {
  accent: "#6366f1",
  accent2: "#4338ca",
  icon: "scale",
  title: "Legal Resources & Rights",
  intro: "Answer a couple of quick questions and get the right guide, steps and helpline in about three taps.",
  home: "/account/legal",
  start: { href: "/account/legal#situation", label: "Find help for my situation" },
  secondary: { href: "/account/legal/help", label: "Emergency numbers" },
  groups: [
    {
      title: "Start here", icon: "phone", blurb: "Who to call first, and the helplines for every kind of problem.", cta: "Open the help directory",
      items: [
        { href: "/account/legal", label: "Situation navigator", exact: true, meta: "3 taps" },
        { href: "/account/legal/help", label: "Emergency & help directory", meta: "112 first" },
      ],
    },
    {
      title: "Guides", icon: "doc", blurb: "Step-by-step guides for common problems, written in plain words.", href: "/account/legal/guides", cta: "Browse the guides",
      items: [
        { href: "/account/legal/guides", label: "All guides", exact: true },
        ...LEGAL_GUIDES.map((g) => ({ href: `/account/legal/guides/${g.slug}`, label: `${g.number}. ${g.title}` })),
      ],
    },
    {
      title: "Action tools", icon: "answer", blurb: "Ready-to-send letters, an evidence log with deadlines, and rights cards.", cta: "Write a letter",
      items: [
        ...LETTER_TEMPLATES.map((t) => ({ href: `/account/legal/tools/${t.slug}`, label: t.name })),
        { href: "/account/legal/toolkit", label: "Evidence, timeline and deadlines", meta: "Stays on this device" },
        { href: "/account/legal/rights-cards", label: "Rights cards", meta: "Save to your phone" },
      ],
    },
    {
      title: "Learn", icon: "bulb", blurb: "Short real-life scenarios: pick what you would do and see why.", cta: "Try a scenario",
      items: [{ href: "/account/legal/learn", label: "What would you do? scenarios", meta: `${LEGAL_SCENARIOS.length} cards and badges` }],
    },
  ],
  safety: "In danger right now? Call 112. Use Quick exit at the top right to leave this page at once.",
};

export const EXAMS_COURSE: FeatureCourse = {
  accent: "#2563eb",
  accent2: "#0891b2",
  icon: "exam",
  title: "Entrance Exams & Eligibility",
  intro: "Fill in your profile once and see only the exams you can take now or soon, with a plan counting back from each date.",
  home: "/account/exams",
  start: { href: "/account/exams/dashboard", label: "See exams I can take" },
  secondary: { href: "/account/exams/mocks", label: "Take a mock test" },
  groups: [
    {
      title: "Your exams", icon: "calendar", blurb: "The exams you are eligible for, their deadlines, and a plan for your stage.", cta: "See my exams",
      items: [
        { href: "/account/exams", label: "Course overview", exact: true },
        { href: "/account/exams/dashboard", label: "My exams and deadlines", exact: true },
        { href: "/account/exams/roadmap", label: "Stage roadmap" },
      ],
    },
    {
      title: "Exam directory", icon: "exam", blurb: "Every exam with its eligibility, dates and official links.", href: "/account/exams/dashboard", cta: "Find my exams",
      items: EXAMS.map((e) => ({ href: `/account/exams/${e.slug}`, label: e.name, meta: e.body })),
    },
    {
      title: "Prepare", icon: "target", blurb: "A study planner with a syllabus tracker, and mock tests with analysis.", cta: "Open the planner",
      items: [
        { href: "/account/exams/planner", label: "Study planner and syllabus tracker", exact: true },
        { href: "/account/exams/mocks", label: "Mock tests and analysis", meta: `${MOCK_TESTS.length} practice sets` },
      ],
    },
    {
      title: "Wellbeing", icon: "heart", blurb: "Handling exam stress, and backup paths to the same career.", cta: "Read the guide",
      items: [{ href: "/account/exams/wellbeing", label: "Wellbeing and backup paths" }],
    },
  ],
  safety: "Always confirm dates and eligibility on the official website. Exams never ask for payment through personal UPI IDs or phone calls.",
};

export const SCHOLARSHIPS_COURSE: FeatureCourse = {
  accent: "#166534",
  accent2: "#15803d",
  icon: "award",
  title: "Scholarships",
  intro: "Find the money you qualify for, then get help winning it: documents, deadlines and renewals in one place.",
  home: "/account/scholarships",
  start: { href: "/account/scholarships/dashboard", label: "Find scholarships for me" },
  secondary: { href: "/account/scholarships/calendar", label: "See deadlines" },
  groups: [
    {
      title: "Find", icon: "search", blurb: "Scholarships matched to your profile, with how much each one pays.", cta: "Find my matches",
      items: [
        { href: "/account/scholarships", label: "Course overview", exact: true },
        { href: "/account/scholarships/dashboard", label: "Money you can apply for", exact: true },
      ],
    },
    {
      title: "All scholarships", icon: "award", blurb: "Every scholarship with its eligibility, amount and deadline.", href: "/account/scholarships/dashboard", cta: "Browse with filters",
      items: SCHOLARSHIPS.map((s) => ({ href: `/account/scholarships/${s.slug}`, label: s.name })),
    },
    {
      title: "Track and prepare", icon: "calendar", blurb: "Deadlines, applications, essays and documents, all in one place.", cta: "Open the calendar",
      items: [
        { href: "/account/scholarships/calendar", label: "Deadline calendar", meta: "Official dates" },
        { href: "/account/scholarships/applications", label: "Applications" },
        { href: "/account/scholarships/essay", label: "Essay helper" },
        { href: "/account/scholarships/vault", label: "Document vault" },
        { href: "/account/scholarships/won", label: "Money won and renewals" },
        { href: "/account/scholarships/safety", label: "Scam warnings" },
      ],
    },
  ],
  safety: "Genuine scholarships never ask you to pay to receive money. Never share bank passwords, OTPs or PINs.",
};

export const STUDY_ABROAD_COURSE: FeatureCourse = {
  accent: "#7c3aed",
  accent2: "#2563eb",
  icon: "globe",
  title: "Abroad Compass",
  intro: "Decide whether to go, where, for what course, and whether the numbers work, before anyone sells you a university.",
  home: "/account/study-abroad",
  start: { href: "/account/study-abroad/roi", label: "Run the money check" },
  secondary: { href: "/account/study-abroad/countries", label: "Compare countries" },
  groups: [
    {
      title: "Decide", icon: "signpost", blurb: "Your dashboard, a side-by-side country comparison and the money check.", cta: "Open my dashboard",
      items: [
        { href: "/account/study-abroad", label: "Course overview", exact: true },
        { href: "/account/study-abroad/dashboard", label: "Your dashboard", exact: true },
        { href: "/account/study-abroad/countries", label: "Compare countries", exact: true },
        { href: "/account/study-abroad/roi", label: "ROI calculator", meta: "Money check" },
      ],
    },
    {
      title: "Countries", icon: "globe", blurb: "What studying in each country really costs and involves, and what changed this year.", href: "/account/study-abroad/countries", cta: "Compare countries",
      items: STUDY_ABROAD_COUNTRIES.map((c) => ({ href: `/account/study-abroad/countries/${c.code.toLowerCase()}`, label: `${c.flag} ${c.name}` })),
    },
    {
      title: "Courses", icon: "cap", blurb: "Course by course: the full cost, and where it can lead.", href: "/account/study-abroad/courses", cta: "Browse courses",
      items: STUDY_ABROAD_COURSES.map((c) => ({ href: `/account/study-abroad/courses/${c.slug}`, label: c.name })),
    },
    {
      title: "Universities and applications", icon: "school", blurb: "Shortlist universities, track applications and get help with your SOP.", cta: "See universities",
      items: [
        { href: "/account/study-abroad/universities", label: "Universities", meta: `${UNIVERSITIES.length} to start with` },
        { href: "/account/study-abroad/applications", label: "Shortlist and application tracker", meta: "Reach, match, safe" },
        { href: "/account/study-abroad/sop", label: "SOP and LOR helper" },
        { href: "/account/study-abroad/reviews", label: "Verified reviews", exact: true },
      ],
    },
    {
      title: "Money", icon: "wallet", blurb: "Scholarships abroad and how education loans really work.", cta: "Find scholarships",
      items: [
        { href: "/account/study-abroad/scholarships", label: "Scholarship finder" },
        { href: "/account/study-abroad/loans", label: "Education loans" },
      ],
    },
    {
      title: "Prepare", icon: "shield", blurb: "Keep your documents ready, and check an agent or offer before you pay.", cta: "Open the vault",
      items: [
        { href: "/account/study-abroad/vault", label: "Document vault" },
        { href: "/account/study-abroad/safety", label: "Safety checks" },
      ],
    },
  ],
  safety: "Confirm every offer letter directly with the university. Never let anyone submit visa forms or bank statements for you.",
};
