/**
 * The words and videos of the home page (app/Landing.tsx). Every number here
 * is one the app itself shows - check the feature before changing it.
 * Videos are hosted in the WordPress media library on onegrasp.com; their
 * stills are frames taken from the videos (public/home/*.webp).
 */

const WP = "https://onegrasp.com/wp-content/uploads/2026/10/";

export interface HomeVideoInfo {
  src: string;
  poster: string;
  length: string;
  /** Play only this part (seconds), e.g. one chapter of the tour. */
  start?: number;
  end?: number;
  /** false = the video has no soundtrack, so no sound button. */
  sound?: boolean;
}

export const TOUR: HomeVideoInfo = { src: `${WP}onegrasp-dashboard-tour-web-1080p.mp4`, poster: "/home/tour.webp", length: "1:31" };

/** Where the tour's end card starts - the last chapter runs until here. */
export const TOUR_END = 83;

/** The tour's own chapter cards ("Dashboard tour 01 / 13" ...), in seconds. */
export const TOUR_CHAPTERS: { t: number; label: string }[] = [
  { t: 5, label: "Your report" },
  { t: 11, label: "Career Library" },
  { t: 14, label: "Entrance Exams" },
  { t: 20, label: "Scholarships" },
  { t: 26, label: "Study Abroad" },
  { t: 32, label: "Internships" },
  { t: 39, label: "Jobs" },
  { t: 45, label: "Startups" },
  { t: 52, label: "Financial Literacy" },
  { t: 57, label: "Law & Rights" },
  { t: 62, label: "Research" },
  { t: 69, label: "My Progress" },
  { t: 75, label: "For schools" },
];

/** The report, explained: cover, scorecard, the three career views, roles and roadmap. */
export const REPORT_VIDEO: HomeVideoInfo = { src: `${WP}onegrasp-report-video-web-1080p.mp4`, poster: "/home/report.webp", length: "0:36" };

export const SCHOOLS_VIDEO: HomeVideoInfo = { src: `${WP}institution_portal_promo_web.mp4`, poster: "/home/institution.webp", length: "0:15" };

export const FACTS = [
  { n: "8", l: "dimensions measured" },
  { n: "930", l: "careers explained" },
  { n: "40", l: "scholarships tracked" },
  { n: "200+", l: "free programmes" },
];

export interface Stage { key: string; title: string; short: string; icon: string; text: string; school?: boolean }
export const STAGES: Stage[] = [
  { key: "6-8", title: "Class 6-8", short: "Interests & strengths", icon: "school", text: "Discover what you enjoy and where you're strong - interests, intelligences and learning style, explained for your age." },
  { key: "9-10", title: "Class 9-10", short: "Choose your stream", icon: "route", text: "Choose your stream with confidence - your interests mapped to career clusters and the subjects that lead there." },
  { key: "11-12", title: "Class 11-12", short: "Career + roadmap", icon: "compass", text: "Pick a career and the road to it - best-fit careers with 308 researched roadmaps: exams, colleges and skills." },
  { key: "ug", title: "Undergraduates", short: "Roles for your degree", icon: "cap", text: "Turn your degree into a direction - best-fit roles for your course, each with a step-by-step roadmap." },
  { key: "pro", title: "Professionals", short: "Workplace stress check", icon: "briefcase", text: "See where your work stress comes from - a 5-minute check, the 14 drivers behind it and a 30-day plan." },
  { key: "school", title: "Schools", short: "Follow every student", icon: "users", text: "Follow every student's journey - who's on track, who needs a nudge, and what to do next.", school: true },
];

/** The report's eight dimensions (Class 6-12; undergraduates get eight pillars of their own). */
export const DIMENSIONS = [
  "Personality", "Career interests", "Multiple intelligences", "Emotional intelligence",
  "Learning style", "Motivators", "Strengths", "Aptitude",
];

/** "From one test to a plan" - read left to right under the story picture (public/home/story.webp). */
export const STEPS = [
  { t: "Take the test", d: "Questions written for your stage. Go at your own pace - your answers save as you go." },
  { t: "Get your report", d: "How you think, learn and work, and the careers that fit you - in plain words." },
  { t: "Use your dashboard", d: "Careers, exams, scholarships, study abroad, internships, jobs and more." },
  { t: "Track your progress", d: "Lessons finished, time spent and your streak, for every feature you use." },
];

export interface Feature {
  key: string;
  title: string;
  line: string;
  points: string[];
  video: HomeVideoInfo;
  /** 3D illustration key (lib/features/catalog featureArt), or a photo. */
  art?: string;
  photo?: string;
}

export const FEATURES: Feature[] = [
  { key: "careers", title: "Career Library", art: "careers", line: "930 careers - what they do and what they pay.",
    points: ["What each career is, the skills it needs and what it pays in India", "Browse by field, or search any career, skill or subject", "1,500+ degree roadmaps to get there"],
    video: { ...TOUR, poster: "/home/careers.webp", length: "0:03", start: 11, end: 14 } },
  { key: "exams", title: "Entrance Exams", art: "exams", line: "Every exam, who can take it, and when.",
    points: ["Tell us your profile once - see only the exams you're eligible for", "Track your deadlines, with a plan counted back from exam day", "A study planner with the official syllabus built in - JEE Main, NEET-UG, CUET, CLAT, CAT and more"],
    video: { src: `${WP}onegrasp-exams-hero-web-1080p.mp4`, poster: "/home/exams.webp", length: "0:19", sound: false } },
  { key: "scholarships", title: "Scholarships", art: "scholarships", line: "Money you qualify for, with the deadlines.",
    points: ["40 scholarships, each with its eligibility, amount and deadline", "Fill in your profile once and see only the ones you qualify for", "A deadline calendar, so you never miss a date"],
    video: { src: `${WP}scholarships_promo_web.mp4`, poster: "/home/scholarships.webp", length: "0:15" } },
  { key: "study-abroad", title: "Study Abroad", art: "study-abroad", line: "Where, what - and does the money work?",
    points: ["Compare up to four of eight countries side by side", "What it really costs, work rights and options after you study", "Universities, and a step-by-step plan from deciding to preparing"],
    video: { src: `${WP}study_abroad_promo_web.mp4`, poster: "/home/study-abroad.webp", length: "0:16" } },
  { key: "internships", title: "Internships", art: "internships", line: "Free programmes from real companies.",
    points: ["200+ free, mostly self-paced programmes, many with a certificate", "From companies like AWS, Google Cloud and Microsoft", "Filter by level - beginner, intermediate or advanced"],
    video: { src: `${WP}internships_promo_web.mp4`, poster: "/home/internships.webp", length: "0:13" } },
  { key: "jobs", title: "Jobs", photo: "/jobs/hero-800.webp", line: "Fresh internships and fresher jobs, checked for scam signs.",
    points: ["New listings brought in every day", "Browse by field, with internships and fresher-friendly jobs first", "Every listing checked for warning signs before you apply"],
    video: { src: `${WP}jobs_promo_web.mp4`, poster: "/home/jobs.webp", length: "0:14" } },
  { key: "money", title: "Financial Literacy", art: "money", line: "Money skills as a level path - and games.",
    points: ["A six-level path, from money basics upwards", "Safe or Scam: spot a fake message before it costs you", "Money Labs: see what an EMI, a card's minimum due or rent-vs-buy really costs"],
    video: { src: `${WP}financail-literacy.mp4`, poster: "/home/money.webp", length: "0:24", sound: false } },
  { key: "legal", title: "Law & Rights", art: "legal", line: "Rights, helplines and ready-made letters.",
    points: ["Know your rights - and get help in three taps", "Emergency and helpline numbers, all in one place", "Step-by-step guides and ready-to-send drafts, like a police complaint"],
    video: { src: `${WP}legal_promo_web.mp4`, poster: "/home/legal.webp", length: "0:15" } },
  { key: "research", title: "Research & Conferences", art: "research", line: "From a good question to a conference talk.",
    points: ["Eight short units - from asking a good question to presenting it", "A conference finder for students, in India and worldwide", "Record practice talks and compare your takes"],
    video: { src: `${WP}research_promo_web.mp4`, poster: "/home/research.webp", length: "0:15" } },
  { key: "startups", title: "Startups", art: "startups", line: "Build a startup, lesson by lesson.",
    points: ["52 video lessons, with a quiz after each one", "11 missions on your own idea", "A placement quiz, so you start at the right level"],
    video: { src: `${WP}startups_promo_web.mp4`, poster: "/home/startups.webp", length: "0:17" } },
  { key: "progress", title: "My Progress", art: "progress", line: "Everything you've done, in one place.",
    points: ["Lessons finished and modules left, for every feature", "Your activity calendar and your streak", "Where your time goes, feature by feature"],
    video: { src: `${WP}my_progress_promo_web.mp4`, poster: "/home/progress.webp", length: "0:13" } },
];

export const TOOLS = [
  { icon: "compass", title: "Career GPS", text: "Three small missions a week, picked for you from your own results." },
  { icon: "play", title: "Career Test-Drive", text: "Live a day in a career - five real moments - before you choose it." },
  { icon: "signpost", title: "Family Decision Room", text: "Compare two paths side by side with facts, and decide with your parents." },
  { icon: "award", title: "Career Passport", text: "Projects, certificates and wins with proof - verified by your school." },
];

export const SCHOOL_POINTS = [
  "Where every student stands - on track, needs a nudge, inactive or yet to take the assessment",
  "Filter, find and follow up: message students, and read their replies",
  "Parents answer a short survey and see their child's decision and weekly plan",
  "Verify students' Career Passports",
];

export const FAQ: { q: string; a: string }[] = [
  { q: "Who is it for?", a: "Students from Class 6 to 12, undergraduates, and working professionals - each stage gets its own questions and its own report. Schools and colleges get a portal to follow their students." },
  { q: "How long does it take?", a: "It depends on your stage. There's no rush: you can pause and come back, and your answers are saved as you go." },
  { q: "What do I get at the end?", a: "Your report - your profile across eight dimensions and the careers that fit you best - with a PDF copy emailed to you. Then your dashboard, with every feature on this page." },
  { q: "How much does it cost?", a: "The price is shown before you pay, with any offer running at the time. The Workplace Stress Check for working professionals is free for now." },
  { q: "Can my parents be part of it?", a: "Yes. In the Family Decision Room you share a link, your parents answer, and you compare paths together." },
  { q: "My school uses OneGrasp. What can it see?", a: "If you register under your school, it sees your results and progress so it can support you. Your parents see only what you share with them." },
  { q: "We're a school. How do we start?", a: "Write to support@onegrasp.com or call +91 89777 60442, and we'll show you the portal with your own students in mind." },
];

/* ---------- photos from our sessions (public/home/stories/*.webp; `full` = the original) ---------- */
export type StoryTag = "assess" | "talks" | "guide" | "schools";
export const STORY_TAGS: { key: StoryTag; label: string }[] = [
  { key: "assess", label: "Assessment days" },
  { key: "talks", label: "Talks & workshops" },
  { key: "guide", label: "One-to-one guidance" },
  { key: "schools", label: "With schools" },
];

export interface Story {
  key: string; tag: StoryTag; caption: string; full: string; w: number; h: number;
  /** Where to centre the crop in the grid (CSS object-position), when the subject isn't central. */
  pos?: string;
}
const WP08 ="https://onegrasp.com/wp-content/uploads/2026/08/";
/** In the order shown under "All" - the first STORIES_FIRST show before "Show all". */
export const STORIES: Story[] = [
  { key: "new2", tag: "assess", caption: "A full class taking the Career Fitment assessment", full: `${WP}Screenshot-2026-10-10-111544.png`, w: 820, h: 460 },
  { key: "old09", tag: "talks", caption: "A career talk on why career mismatch happens", full: `${WP08}IMG20260418112244-scaled.jpg`, w: 615, h: 820 },
  { key: "new1", tag: "talks", caption: "Introducing OneGrasp to students before the assessment", full: `${WP}Screenshot-2026-10-10-111651.png`, w: 820, h: 457 },
  { key: "old11", tag: "guide", caption: "A teacher helping a student through the assessment", full: `${WP08}WhatsApp-Image-2026-08-28-at-10.41.13-AM.jpeg`, w: 461, h: 820 },
  { key: "old06", tag: "assess", caption: "Students taking the assessment in the computer lab", full: `${WP08}IMG_20260418_122233827-scaled.jpg`, w: 369, h: 820 },
  { key: "new4", tag: "guide", caption: "A one-to-one counselling session", full: `${WP}assesement-image.jpg`, w: 820, h: 367 },
  { key: "old02", tag: "talks", caption: "Career Lab workshop for students and parents", full: `${WP08}IMG_20260418_105125190_HDR-scaled.jpg`, w: 820, h: 369 },
  { key: "old03", tag: "talks", caption: "A session on international scientific conferences", full: `${WP08}IMG_20260418_120203457_PORTRAIT-scaled.jpg`, w: 369, h: 820 },
  { key: "new3", tag: "assess", caption: "Students working through the assessment on their laptops", full: `${WP}assesment-image-2.jpg`, w: 820, h: 367 },
  { key: "old14", tag: "guide", caption: "Working through the assessment together", full: `${WP08}WhatsApp-Image-2026-08-28-at-10.42.01-AM.jpeg`, w: 615, h: 820 },
  { key: "old07", tag: "schools", caption: "With the school's leadership", full: `${WP08}IMG-20260420-WA0060.jpg`, w: 615, h: 820 },
  { key: "new6", tag: "talks", caption: "Walking students through the OneGrasp platform", full: `${WP}Screenshot-2026-10-10-111826.png`, w: 820, h: 461, pos: "85% 50%" },
  { key: "old10", tag: "guide", caption: "A guided assessment, one student at a time", full: `${WP08}WhatsApp-Image-2026-08-28-at-10.41.13-AM-1.jpeg`, w: 615, h: 820 },
  { key: "new5", tag: "assess", caption: "A student mid-assessment", full: `${WP}Screenshot-2026-10-10-111453.png`, w: 820, h: 458 },
  { key: "old04", tag: "talks", caption: "A career talk for students", full: `${WP08}IMG_20260418_120614298-scaled.jpg`, w: 369, h: 820 },
  { key: "old13", tag: "guide", caption: "Notes and answers, side by side", full: `${WP08}WhatsApp-Image-2026-08-28-at-10.42.02-AM.jpeg`, w: 615, h: 820 },
  { key: "old08", tag: "schools", caption: "Planning the programme with the school", full: `${WP08}IMG20260418103653_01-scaled.jpg`, w: 615, h: 820 },
  { key: "old12", tag: "guide", caption: "Guided assessment session", full: `${WP08}WhatsApp-Image-2026-08-28-at-10.41.36-AM.jpeg`, w: 615, h: 820 },
  { key: "old05", tag: "talks", caption: "Career talk, in session", full: `${WP08}IMG_20260418_120615426-scaled.jpg`, w: 369, h: 820 },
  { key: "old01", tag: "schools", caption: "Meeting the school before the session", full: `${WP08}IMG_20260418_103613991-scaled.jpg`, w: 369, h: 820 },
];
export const STORIES_FIRST = 8;

export const CONTACT ={ email: "support@onegrasp.com", phone: "+918977760442", phoneLabel: "+91 89777 60442" };
