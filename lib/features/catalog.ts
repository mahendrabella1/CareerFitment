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
  },
  progress: {
    key: "progress", title: "My Progress", href: "/account/progress", art: "progress", accent: "#db3433",
    headline: ["Everything you've done,", "in one place"], layout: "progress", style: "Your progress across every feature",
    tagline: "Lessons finished, modules left, time spent and your streak - for every feature you use.",
    tour: [],
  },
};

export const featureArt = (key: string) => {
  const art = FEATURES[key]?.art ?? key;
  return { src: `/features/${art}.webp`, srcSet: `/features/${art}-640.webp 640w, /features/${art}.webp 1200w` };
};
