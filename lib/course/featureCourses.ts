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
}

export interface FeatureCourse {
  accent: string;
  title: string;
  intro: string;
  groups: CourseNavGroup[];
  safety?: string;
}


export const MONEY_COURSE: FeatureCourse = {
  accent: "#0ea05f",
  title: "Financial Literacy",
  intro: "Money skills are habits, not facts. Short, real tools instead of a syllabus.",
  groups: [
    { title: "Learn", items: [{ href: "/account/money/cards", label: "Concept Library", meta: "Short cards" }] },
    {
      title: "Money Life",
      items: [
        { href: "/account/money/play", label: "Money Life simulation", meta: "12 months" },
        { href: "/account/money/real-life", label: "Real Life world", meta: "10 years" },
        { href: "/account/money/journey", label: "Your Money Journey", meta: "Year-end report" },
        { href: "/account/money/habits", label: "Real money habits", meta: "Tracker" },
      ],
    },
    {
      title: "Scam Shield",
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
      title: "Money Labs",
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
  title: "Research & Conferences",
  intro: "Pick a real conference, work backwards from its date, and present your own research.",
  groups: [
    {
      title: "Research Studio",
      items: STUDIO_UNITS.map((u) => ({ href: `/account/research/studio/${u.slug}`, label: `${u.unit}. ${u.title}` })),
    },
    {
      title: "Your project",
      items: [
        { href: "/account/research", label: "Course overview", exact: true },
        { href: "/account/research/projects/new", label: "Start a project" },
      ],
    },
    {
      title: "Find and get feedback",
      items: [
        { href: "/account/research/conferences", label: "Conference Finder" },
        { href: "/account/research/mentor", label: "Mentor review queue" },
      ],
    },
    {
      title: "Present and share",
      items: [
        { href: "/account/research/practice", label: "Practice recorder", meta: "3 or 10 minutes" },
        { href: "/account/research/profile", label: "Research profile", meta: "With QR code" },
      ],
    },
  ],
};

export const LEGAL_COURSE: FeatureCourse = {
  accent: "#6366f1",
  title: "Legal Resources & Rights",
  intro: "Answer a couple of quick questions and get the right guide, steps and helpline in about three taps.",
  groups: [
    {
      title: "Start here",
      items: [
        { href: "/account/legal", label: "Situation navigator", exact: true, meta: "3 taps" },
        { href: "/account/legal/help", label: "Emergency & help directory", meta: "112 first" },
      ],
    },
    {
      title: "Guides",
      items: [
        { href: "/account/legal/guides", label: "All guides", exact: true },
        ...LEGAL_GUIDES.map((g) => ({ href: `/account/legal/guides/${g.slug}`, label: `${g.number}. ${g.title}` })),
      ],
    },
    {
      title: "Action tools",
      items: [
        ...LETTER_TEMPLATES.map((t) => ({ href: `/account/legal/tools/${t.slug}`, label: t.name })),
        { href: "/account/legal/toolkit", label: "Evidence, timeline and deadlines", meta: "Stays on this device" },
        { href: "/account/legal/rights-cards", label: "Rights cards", meta: "Save to your phone" },
      ],
    },
    {
      title: "Learn",
      items: [{ href: "/account/legal/learn", label: "What would you do? scenarios", meta: `${LEGAL_SCENARIOS.length} cards and badges` }],
    },
  ],
  safety: "In danger right now? Call 112. Use Quick exit at the top right to leave this page at once.",
};

export const EXAMS_COURSE: FeatureCourse = {
  accent: "#2563eb",
  title: "Entrance Exams & Eligibility",
  intro: "Fill in your profile once and see only the exams you can take now or soon, with a plan counting back from each date.",
  groups: [
    {
      title: "Your exams",
      items: [
        { href: "/account/exams", label: "Course overview", exact: true },
        { href: "/account/exams/dashboard", label: "My exams and deadlines", exact: true },
        { href: "/account/exams/roadmap", label: "Stage roadmap" },
      ],
    },
    {
      title: "Exam directory",
      items: EXAMS.map((e) => ({ href: `/account/exams/${e.slug}`, label: e.name, meta: e.body })),
    },
    {
      title: "Prepare",
      items: [
        { href: "/account/exams/planner", label: "Study planner and syllabus tracker", exact: true },
        { href: "/account/exams/mocks", label: "Mock tests and analysis", meta: `${MOCK_TESTS.length} practice sets` },
      ],
    },
    { title: "Wellbeing", items: [{ href: "/account/exams/wellbeing", label: "Wellbeing and backup paths" }] },
  ],
  safety: "Always confirm dates and eligibility on the official website. Exams never ask for payment through personal UPI IDs or phone calls.",
};

export const SCHOLARSHIPS_COURSE: FeatureCourse = {
  accent: "#166534",
  title: "Scholarships",
  intro: "Find the money you qualify for, then get help winning it: documents, deadlines and renewals in one place.",
  groups: [
    {
      title: "Find",
      items: [
        { href: "/account/scholarships", label: "Course overview", exact: true },
        { href: "/account/scholarships/dashboard", label: "Money you can apply for", exact: true },
      ],
    },
    {
      title: "All scholarships",
      items: SCHOLARSHIPS.map((s) => ({ href: `/account/scholarships/${s.slug}`, label: s.name })),
    },
    {
      title: "Track and prepare",
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
  title: "Abroad Compass",
  intro: "Decide whether to go, where, for what course, and whether the numbers work, before anyone sells you a university.",
  groups: [
    {
      title: "Decide",
      items: [
        { href: "/account/study-abroad", label: "Course overview", exact: true },
        { href: "/account/study-abroad/dashboard", label: "Your dashboard", exact: true },
        { href: "/account/study-abroad/countries", label: "Compare countries", exact: true },
        { href: "/account/study-abroad/roi", label: "ROI calculator", meta: "Money check" },
      ],
    },
    {
      title: "Countries",
      items: STUDY_ABROAD_COUNTRIES.map((c) => ({ href: `/account/study-abroad/countries/${c.code.toLowerCase()}`, label: `${c.flag} ${c.name}` })),
    },
    {
      title: "Courses",
      items: STUDY_ABROAD_COURSES.map((c) => ({ href: `/account/study-abroad/courses/${c.slug}`, label: c.name })),
    },
    {
      title: "Universities and applications",
      items: [
        { href: "/account/study-abroad/universities", label: "Universities", meta: `${UNIVERSITIES.length} to start with` },
        { href: "/account/study-abroad/applications", label: "Shortlist and application tracker", meta: "Reach, match, safe" },
        { href: "/account/study-abroad/sop", label: "SOP and LOR helper" },
        { href: "/account/study-abroad/reviews", label: "Verified reviews", exact: true },
      ],
    },
    {
      title: "Money",
      items: [
        { href: "/account/study-abroad/scholarships", label: "Scholarship finder" },
        { href: "/account/study-abroad/loans", label: "Education loans" },
      ],
    },
    {
      title: "Prepare",
      items: [
        { href: "/account/study-abroad/vault", label: "Document vault" },
        { href: "/account/study-abroad/safety", label: "Safety checks" },
      ],
    },
  ],
  safety: "Confirm every offer letter directly with the university. Never let anyone submit visa forms or bank statements for you.",
};
