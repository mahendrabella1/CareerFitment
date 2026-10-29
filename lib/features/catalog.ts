/**
 * One entry per feature section (every class group sees these): its hero
 * artwork, two-line headline, the layout its home page uses and the slides of
 * its first-visit tour. The artwork lives in public/features/<art>.webp (and
 * <art>-640.webp for phones) - 3D illustrations generated in Canva on a
 * #f4f0eb background, which the hero band matches so the picture has no edge.
 */

export type FeatureLayout = "path" | "course" | "helpdesk" | "catalogue" | "board" | "library" | "listing" | "progress";

export interface TourSlide {
  title: string;
  text: string;
  /** Icon name from app/Icons.tsx. */
  icon: string;
}

/** A "Start here" card on a feature's home page: one of its most useful or
 *  most interesting things to do (components/feature/FeatureHero.tsx). */
export interface FeatureCta {
  /** Icon name from app/Icons.tsx. */
  icon: string;
  title: string;
  text: string;
  href: string;
}

export interface FeatureMeta {
  key: string;
  title: string;
  href: string;
  art: string;
  accent: string;
  /** Headline in two parts; the second is drawn in the accent colour. */
  headline: [string, string];
  tagline: string;
  layout: FeatureLayout;
  /** What the layout is, in a few words, for the tour's first slide. */
  style: string;
  tour: TourSlide[];
  /** Up to four "Start here" cards under the hero. */
  ctas?: FeatureCta[];
}

export const HERO_BG = "#f4f0eb";

export const FEATURES: Record<string, FeatureMeta> = {
  money: {
    key: "money", title: "Financial Literacy", href: "/account/money", art: "money", accent: "#0b7a4b",
    headline: ["Money skills,", "one level at a time"], layout: "path", style: "A level path, games and labs",
    tagline: "Short lessons, money games and calculators - with virtual money, so mistakes cost nothing.",
    tour: [
      { icon: "route", title: "Climb the level path", text: "Six levels, two or three short lessons each. Tick a lesson off and the next level opens up." },
      { icon: "play", title: "Play Money Life", text: "Run your own money for 12 months - or 10 years - and see where your choices lead." },
      { icon: "shield", title: "Train with Scam Shield", text: "Quick games that teach you to spot a fake message, call or offer before it costs you." },
      { icon: "score", title: "Try a Money Lab", text: "Move a slider and see what an EMI, inflation or a salary slip really means." },
    ],
    ctas: [
      { icon: "play", title: "Play Money Life", text: "Run your money for 12 months and see where your choices lead.", href: "/account/money/play" },
      { icon: "shield", title: "Play Safe or Scam", text: "Swipe through real messages - spot the scam before it costs you.", href: "/account/money/scam-shield/swipe" },
      { icon: "score", title: "See what an EMI really costs", text: "Move a slider and watch the interest add up.", href: "/account/money/labs/emi" },
      { icon: "book", title: "Read a money card", text: "One idea per card, in plain words - a minute each.", href: "/account/money/cards" },
    ],
  },
  startups: {
    key: "startups", title: "Startups", href: "/account/startups", art: "startups", accent: "#c2410c",
    headline: ["Build a startup,", "lesson by lesson"], layout: "course", style: "A full video course",
    tagline: "Watch, read, try it on your own idea and pass the quiz - module by module, like a real course.",
    tour: [
      { icon: "video", title: "Short video lessons", text: "Each lesson is a video, a short read and a task you do on your own idea." },
      { icon: "exam", title: "Quizzes unlock the next step", text: "Pass a lesson's quiz to open the next one. Each module ends with a short test." },
      { icon: "flag", title: "Missions build your portfolio", text: "Every module's mission becomes a page of your Startup Portfolio." },
      { icon: "target", title: "Not sure where to start?", text: "Take the 2-minute placement quiz and we'll point you to the right module." },
    ],
    ctas: [
      { icon: "target", title: "Take the placement quiz", text: "Two minutes - we'll point you to the right module.", href: "/account/startups/placement" },
      { icon: "play", title: "Start module 1", text: "Founder Mindset: short video lessons, a quiz after each.", href: "/account/startups/builder/founder-mindset" },
      { icon: "wallet", title: "Funding for your startup", text: "Grants, loans and incubators - with amounts and deadlines.", href: "/account/startups/funding" },
      { icon: "flag", title: "Your startup portfolio", text: "Every mission you finish becomes a page here.", href: "/account/startups/portfolio" },
    ],
  },
  legal: {
    key: "legal", title: "Law & Rights", href: "/account/legal", art: "legal", accent: "#4338ca",
    headline: ["Know your rights.", "Get help in three taps."], layout: "helpdesk", style: "A help desk",
    tagline: "Tell us what happened and get the right guide, the steps to take and who to call.",
    tour: [
      { icon: "signpost", title: "Start with what happened", text: "Answer two quick questions and get the guide, steps and helpline for your situation." },
      { icon: "phone", title: "Helplines at the top", text: "In danger? 112 is always first. Every other helpline is one tap away." },
      { icon: "doc", title: "Step-by-step guides", text: "Plain-word guides for common problems - from online fraud to unfair fees." },
      { icon: "answer", title: "Letters and tools", text: "Ready-to-send letters, an evidence log with deadlines, and rights cards for your phone." },
    ],
    ctas: [
      { icon: "signpost", title: "Find help for my situation", text: "Answer two questions - get the right guide and helpline.", href: "/account/legal#situation" },
      { icon: "phone", title: "Emergency numbers", text: "112 first, then every helpline - one tap to call.", href: "/account/legal/help" },
      { icon: "doc", title: "Draft a police complaint", text: "A ready-to-send draft - fill in the blanks and print.", href: "/account/legal/tools/police-complaint" },
      { icon: "answer", title: "What would you do?", text: "Real-life scenarios - pick an answer and see why.", href: "/account/legal/learn" },
    ],
  },
  exams: {
    key: "exams", title: "Entrance Exams", href: "/account/exams", art: "exams", accent: "#1d4ed8",
    headline: ["Every entrance exam,", "and the ones you can take"], layout: "catalogue", style: "A searchable exam catalogue",
    tagline: "Search any exam, check if you're eligible, and plan backwards from its date.",
    tour: [
      { icon: "search", title: "Search the catalogue", text: "Every exam with its conducting body, eligibility, dates and official link." },
      { icon: "calendar", title: "See what you can take", text: "Fill in your profile once and see only the exams open to you now or soon." },
      { icon: "target", title: "Plan and practise", text: "A study planner with a syllabus tracker, and mock tests with analysis." },
    ],
    ctas: [
      { icon: "calendar", title: "See exams I can take", text: "Fill in your profile once - see only the exams open to you.", href: "/account/exams/dashboard" },
      { icon: "target", title: "Take a mock test", text: "Practise against the clock, then see where you lost marks.", href: "/account/exams/mocks" },
      { icon: "book", title: "Plan my preparation", text: "A study planner with the official syllabus built in.", href: "/account/exams/planner" },
      { icon: "route", title: "My stage roadmap", text: "What to do now, this year and next, for your class.", href: "/account/exams/roadmap" },
    ],
  },
  scholarships: {
    key: "scholarships", title: "Scholarships", href: "/account/scholarships", art: "scholarships", accent: "#166534",
    headline: ["Find the money", "you qualify for"], layout: "catalogue", style: "A scholarship finder",
    tagline: "Search every scholarship, see how much it pays, and track your applications to the deadline.",
    tour: [
      { icon: "search", title: "Search and filter", text: "Every scholarship with its eligibility, amount and deadline in one list." },
      { icon: "calendar", title: "Never miss a deadline", text: "A deadline calendar and an application tracker keep everything in one place." },
      { icon: "doc", title: "Win it", text: "An essay helper and a document vault for the paperwork, then renewals once you've won." },
    ],
    ctas: [
      { icon: "search", title: "Find scholarships for me", text: "Fill in your profile once - see only the ones you qualify for.", href: "/account/scholarships/dashboard" },
      { icon: "calendar", title: "Deadline calendar", text: "Every official date in one place, so you never miss one.", href: "/account/scholarships/calendar" },
      { icon: "doc", title: "Get help with the essay", text: "Prompts and a checklist for a stronger application.", href: "/account/scholarships/essay" },
      { icon: "shield", title: "Check for scams", text: "Real scholarships never ask you to pay. Spot the fakes.", href: "/account/scholarships/safety" },
    ],
  },
  "study-abroad": {
    key: "study-abroad", title: "Study Abroad", href: "/account/study-abroad", art: "study-abroad", accent: "#6d28d9",
    headline: ["Study abroad,", "one decision at a time"], layout: "board", style: "A step-by-step decision board",
    tagline: "Decide whether to go, where and for what - and check the money works - before anyone sells you a university.",
    tour: [
      { icon: "signpost", title: "Six steps, left to right", text: "Decide, pick a country, a course and universities, sort the money, then prepare." },
      { icon: "wallet", title: "Run the money check first", text: "The ROI calculator shows whether a degree abroad pays back - before you apply." },
      { icon: "shield", title: "Stay safe", text: "Check any agent or offer letter before you pay, and keep your documents in one vault." },
    ],
    ctas: [
      { icon: "wallet", title: "Run the money check", text: "Does a degree abroad pay back? Find out before you apply.", href: "/account/study-abroad/roi" },
      { icon: "globe", title: "Compare countries", text: "Up to four side by side: real costs, work rights, what's next.", href: "/account/study-abroad/countries" },
      { icon: "award", title: "Scholarships abroad", text: "Funding you can apply for, by country and course.", href: "/account/study-abroad/scholarships" },
      { icon: "shield", title: "Check an agent or offer", text: "Before you pay anyone, run these checks.", href: "/account/study-abroad/safety" },
    ],
  },
  research: {
    key: "research", title: "Research & Conferences", href: "/account/research", art: "research", accent: "#6d28d9",
    headline: ["From a good question", "to your first conference talk"], layout: "course", style: "A research studio",
    tagline: "Pick a real conference, work back from its date, and present your own research.",
    tour: [
      { icon: "book", title: "Eight studio units", text: "From a good question to a finished talk - one short unit at a time." },
      { icon: "flag", title: "Your project", text: "Pick a conference first, then plan every step back from its date." },
      { icon: "video", title: "Rehearse and share", text: "Practise your talk against the clock and share your research profile." },
    ],
    ctas: [
      { icon: "flag", title: "Start a research project", text: "Pick a conference, then plan every step back from its date.", href: "/account/research/projects/new" },
      { icon: "search", title: "Find a conference", text: "Student conferences in India and worldwide.", href: "/account/research/conferences" },
      { icon: "book", title: "Begin the studio", text: "Unit 1: what research is - the first of eight short units.", href: "/account/research/studio/what-is-research" },
      { icon: "video", title: "Practise your talk", text: "Record a 3- or 10-minute take and compare your tries.", href: "/account/research/practice" },
    ],
  },
  careers: {
    key: "careers", title: "Career Library", href: "/account/career-library", art: "careers", accent: "#1d4ed8",
    headline: ["900+ careers,", "explained simply"], layout: "library", style: "A career encyclopedia",
    tagline: "What each career is, the skills it needs, what it pays in India - and a degree roadmap to get there.",
    tour: [
      { icon: "search", title: "Search any career", text: "Type a job, a skill or a subject - doctor, design, coding - and open the career." },
      { icon: "clusters", title: "Browse by field", text: "Eight fields, from technology to trades. Pick one to see every career in it." },
      { icon: "route", title: "Degree roadmaps", text: "A year-by-year plan for 1,500+ roles: skills, internships, exams and jobs." },
    ],
    ctas: [
      { icon: "route", title: "Degree roadmaps", text: "A year-by-year plan for 1,500+ roles: skills, exams, jobs.", href: "/account/career-library/roadmaps" },
      { icon: "play", title: "Test-drive a career", text: "Live a day in a career - five real moments - before you choose it.", href: "/account/test-drive" },
      { icon: "signpost", title: "Decide with your family", text: "Compare two paths side by side with facts, then decide together.", href: "/account/decision-room" },
      { icon: "briefcase", title: "Jobs on your path", text: "Fresh internships and fresher jobs, checked for scam signs.", href: "/account/jobs" },
    ],
  },
  internships: {
    key: "internships", title: "Internships", href: "/account/internships-new", art: "internships", accent: "#0f766e",
    headline: ["Free internships", "and learning programmes"], layout: "listing", style: "A programme listing",
    tagline: "Hands-on programmes from real companies - free, mostly self-paced, many with a certificate.",
    tour: [
      { icon: "search", title: "Search programmes", text: "By skill, company or topic. Filter by level and industry." },
      { icon: "award", title: "All of them are free", text: "No fees, no subscriptions. Many end with a certificate you can add to your CV." },
      { icon: "briefcase", title: "Real jobs too", text: "Ready for paid work? The Jobs board lists fresh internships and fresher jobs every day." },
    ],
    ctas: [
      { icon: "briefcase", title: "Fresh jobs and internships", text: "Paid openings, brought in every day.", href: "/account/jobs" },
      { icon: "award", title: "Add it to your Career Passport", text: "Certificates and wins with proof, verified by your school.", href: "/account/passport" },
      { icon: "user", title: "Build your website", text: "Your own portfolio site in minutes.", href: "/account/portfolio" },
      { icon: "compass", title: "Career GPS", text: "Three small missions a week, picked for you.", href: "/account/gps" },
    ],
  },
  ai: {
    key: "ai", title: "AI & Certifications", href: "/account/ai", art: "ai", accent: "#a21caf",
    headline: ["Learn AI for free,", "get certified"], layout: "listing", style: "Free AI courses and safe AI tools",
    tagline: "Free AI courses that end in a real certificate, and AI tools rated for safety and age - picked for your class.",
    tour: [
      { icon: "award", title: "Free courses, free certificates", text: "From the Government of India's YUVA AI for All to Harvard, Google, IBM and Kaggle - every one ends in a free certificate or badge." },
      { icon: "layers", title: "Four levels", text: "AI Aware, AI User, AI Maker, AI Builder. Everyone starts with AI Aware: what AI is, where it goes wrong and how to stay safe." },
      { icon: "shield", title: "Tools rated for you", text: "Each AI tool has a rating card - age, privacy, what's free - and you only see the ones allowed at your age." },
    ],
    ctas: [
      { icon: "award", title: "Free certificate courses", text: "Courses that end in a free certificate or badge.", href: "/account/ai/courses" },
      { icon: "cpu", title: "AI tools for you", text: "Rated for age, privacy and what's free.", href: "/account/ai/tools" },
      { icon: "shield", title: "Use AI safely", text: "Five rules, schoolwork honesty, deepfakes and scams.", href: "/account/ai/safety" },
      { icon: "check", title: "Your OneGrasp certificates", text: "Finish a OneGrasp course, get a certificate too.", href: "/account/certificates" },
    ],
  },
  communication: {
    key: "communication", title: "Communication Lab", href: "/account/communication", art: "communication", accent: "#0e7490",
    headline: ["Speak, write and listen", "with confidence"], layout: "course", style: "A self-paced communication course for your class",
    tagline: "Short videos, activities and voice practice with instant feedback - and your Communication Score (CQ) to show how far you've come.",
    tour: [
      { icon: "route", title: "A track for your class", text: "Class 6–8, 9–10, 11–12 or college - modules open one after another, week by week." },
      { icon: "audio", title: "Practise out loud", text: "Record yourself and get feedback in seconds: your pace, filler words, pauses and three things to try next." },
      { icon: "score", title: "Your CQ", text: "Speaking, writing, listening and reading roll into one Communication Score, with streaks, XP and badges." },
    ],
    ctas: [
      { icon: "play", title: "Continue the course", text: "Pick up your next lesson.", href: "/account/communication#track" },
      { icon: "audio", title: "Today's speaking challenge", text: "A new prompt every day - 1 minute.", href: "/account/communication/practice" },
      { icon: "radar", title: "My CQ and progress", text: "Skills, trend, streak and badges.", href: "/account/communication/progress" },
      { icon: "award", title: "Free AI courses", text: "More certificates in AI & Certifications.", href: "/account/ai" },
    ],
  },
  spotlight: {
    key: "spotlight", title: "Spotlight", href: "/account/spotlight", art: "spotlight", accent: "#a16207",
    headline: ["Get published,", "get recognised"], layout: "catalogue", style: "OneGrasp's career boosters - paid services",
    tagline: "Career boosters from OneGrasp: present your research at an international conference, publish a paper, get an ISBN for your book, start a journal with an ISSN, or be featured in Awardees Magazine.",
    tour: [
      { icon: "flask", title: "Present and publish", text: "Send your abstract to a OneGrasp international conference, or ask us where your paper should be published." },
      { icon: "book", title: "Your own ISBN or ISSN", text: "The official rules in plain words - who can get one, what's needed - and help to get it right." },
      { icon: "wallet", title: "Paid services, free to ask", text: "Send a request and the OneGrasp team replies with the fee and the next steps. Nothing is charged here." },
    ],
    ctas: [
      { icon: "flask", title: "Submit an abstract", text: "Pick an upcoming OneGrasp conference and send your abstract.", href: "/account/spotlight/conferences" },
      { icon: "doc", title: "Research writing help", text: "From your research question to a publication-ready draft.", href: "/account/spotlight/writing" },
      { icon: "book", title: "Get an ISBN", text: "Who can get one, the rules, and help to apply.", href: "/account/spotlight/isbn" },
      { icon: "star", title: "Write for Awardees Magazine", text: "Articles, blogs, stories and podcast interviews.", href: "/account/spotlight/magazine" },
    ],
  },
  jobready: {
    key: "jobready", title: "Resume & Interview", href: "/account/resume", art: "jobready", accent: "#be185d",
    headline: ["An ATS-friendly resume,", "and interviews you've practised"], layout: "course", style: "A resume builder and interview practice",
    tagline: "Build a resume that applicant-tracking systems can read, check it against a job post, and practise the 100 questions interviewers ask most - out loud, with feedback.",
    tour: [
      { icon: "doc", title: "Build your resume", text: "Fill in the sections for your stage and watch an ATS-safe resume take shape. Download it as a PDF." },
      { icon: "target", title: "Check it like an ATS", text: "A score with the fixes that matter, and the job-post keywords you're missing." },
      { icon: "audio", title: "Practise interviews", text: "100 common questions with model answers - then answer out loud and get feedback on what you said and how." },
    ],
    ctas: [
      { icon: "doc", title: "Build my resume", text: "Starts with your details already filled in.", href: "/account/resume" },
      { icon: "answer", title: "100 interview questions", text: "Why they ask, how to answer, a model answer.", href: "/account/interview" },
      { icon: "audio", title: "Mock interview", text: "Answer out loud, camera optional, get feedback.", href: "/account/interview/practice" },
      { icon: "briefcase", title: "Find jobs to apply for", text: "Fresh internships and fresher jobs.", href: "/account/jobs" },
    ],
  },
  progress: {
    key: "progress", title: "My Progress", href: "/account/progress", art: "progress", accent: "#db3433",
    headline: ["Everything you've done,", "in one place"], layout: "progress", style: "Your progress across every feature",
    tagline: "Lessons finished, modules left, time spent and your streak - for every feature you use.",
    tour: [],
  },
};

/** The feature a page belongs to: the one whose home is the longest prefix
 *  of the path ("/account/scholarships/calendar" -> Scholarships). */
export function featureForPath(path: string): FeatureMeta | undefined {
  let best: FeatureMeta | undefined;
  for (const f of Object.values(FEATURES)) {
    if ((path === f.href || path.startsWith(`${f.href}/`)) && (!best || f.href.length > best.href.length)) best = f;
  }
  return best;
}

export const featureArt = (key: string) => {
  const art = FEATURES[key]?.art ?? key;
  return {
    src: `/features/${art}.webp`,
    srcSet: `/features/${art}-640.webp 640w, /features/${art}.webp 1200w`,
    /** 160px wide, for menus and lists. */
    thumb: `/features/${art}-160.webp`,
    /** 600px wide, for cards. */
    card: `/features/${art}-640.webp`,
  };
};
