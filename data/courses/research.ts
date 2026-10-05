import type { CourseContent, LessonContent } from "@/lib/course/types";
import { STUDIO_UNITS } from "@/data/research/studioUnits";

const studioLessons: LessonContent[] = STUDIO_UNITS.map((u) => ({
  id: `unit-${u.slug}`,
  title: `${u.unit}. ${u.title}`,
  minutes: 8,
  summary: `Journey step: ${u.stepTitle}. ${u.hook}`,
  body: u.contentMd.split("\n").map((p) => p.trim()).filter(Boolean),
  points: [`Your task: ${u.taskPrompt}`],
  tool: { href: `/account/research/studio/${u.slug}`, label: "Open this unit" },
}));

export const RESEARCH_COURSE: CourseContent = {
  key: "research",
  accent: "#7c3aed",
  kicker: "Research and International Conferences",
  title: "From a good question to presenting your own research",
  subtitle:
    "Pick a real conference first, then work backwards from its date. Eight studio units teach each step, and a mentor checks your real abstract, poster and talk. No quiz decides your result.",
  outcomes: [
    "Turn a curiosity into a question that is small, testable and doable in weeks",
    "Write a five-part abstract of about 250 words and a poster that a stranger can follow",
    "Choose the right participation level for your age and experience",
    "Check a conference or fair for quality before you pay or submit",
  ],
  modules: [
    {
      id: "studio",
      title: "Research Studio: eight units",
      summary: "Each unit matches one step of the research journey. You learn it, then apply it to your own project.",
      lessons: studioLessons,
    },
    {
      id: "first-project",
      title: "Your first project",
      summary: "Plan from the conference date, choose a level, and know what the mentor will check.",
      lessons: [
        {
          id: "pick-conference-first",
          title: "Pick the conference first, then plan backwards",
          minutes: 7,
          summary: "The conference date becomes the deadline that drives every other step.",
          body: [
            "Choosing a conference first gives you a fixed date. The planner subtracts the abstract deadline and a two-week buffer, then spreads the remaining steps across the time you have.",
            "If the date is too close for your level, the planner suggests a later conference or a lower level. That is a useful signal, not a failure.",
          ],
          points: [
            "The conference date is the anchor of the plan",
            "Keep a two-week buffer before the abstract deadline",
            "A date that is too close is a reason to choose differently",
          ],
          tool: { href: "/account/research/projects/new", label: "Start a project" },
        },
        {
          id: "participation-levels",
          title: "Participation levels: start where you are",
          minutes: 8,
          summary: "Five levels, from watching to chairing a session. Move up one level per conference.",
          body: [
            "An attendee watches talks, asks a question and writes a short reflection. A poster presenter shows a one-page visual of a small project. An oral presenter gives a seven to twelve minute talk with slides. A full-paper author writes a four to eight page paper for proceedings or a journal. A session chair or reviewer takes on leadership after several presentations.",
            "Most school learners start as attendees or poster presenters. Undergraduates often start with a poster. Postgraduates and working professionals often start with an oral talk.",
          ],
          points: [
            "Attendee: about one week of preparation",
            "Poster: six to ten weeks",
            "Oral talk: eight to twelve weeks",
            "Full paper: twelve to twenty weeks",
          ],
        },
        {
          id: "mentor-rubric",
          title: "What the mentor checks",
          minutes: 7,
          summary: "Seven items, each scored from 1 to 4. An abstract goes forward only when every item scores at least 3.",
          body: [
            "Mentors check a clear question, a suitable method, honest results backed by data, clear writing, correct citations, good visuals and confident delivery. The aim is to protect you from rejection and protect the reputation of the platform.",
            "A low score is feedback for the next revision, not a verdict on you. Revise once, then resubmit.",
          ],
          points: [
            "Clear question",
            "Suitable method",
            "Honest results backed by data",
            "Clear writing, correct citations, good visuals, confident delivery",
          ],
          tool: { href: "/account/research/projects/new", label: "Start a project" },
        },
      ],
    },
    {
      id: "find-conferences",
      title: "Conferences, fairs and safety",
      summary: "Find real events, check them before you pay, and follow the ethics rules for young researchers.",
      lessons: [
        {
          id: "check-before-paying",
          title: "Check a conference before you pay",
          minutes: 8,
          summary: "Some organisers charge fees and give little real review. A short checklist protects you.",
          body: [
            "Before you submit or pay, confirm that the organiser's name, address and contact details are clear and checkable. The scientific committee should list real people with institutions you can look up.",
            "Be wary of acceptance within 24 hours, a guaranteed award for paying, claims of indexing you cannot verify, a name that copies a famous event, and pressure to pay extra for certificates or keynote status.",
          ],
          points: [
            "Organiser details are clear and verifiable",
            "Abstracts are reviewed over days or weeks, not minutes",
            "Fees and refund policy are stated before you submit",
            "Publication promises can be checked independently",
          ],
          tool: { href: "/account/research/conferences", label: "Open the Conference Finder" },
        },
        {
          id: "school-opportunities",
          title: "Opportunities for school students in India",
          minutes: 8,
          summary: "National fairs and challenges where a school project can go a long way.",
          body: [
            "The IRIS National Fair is India's national science and engineering fair for school students. Top projects can go on to the international Regeneron ISEF. INSPIRE Awards MANAK is a government scheme in which schools nominate students' original ideas. The National Children's Science Congress runs a project-based congress on a yearly theme, from district level to national level.",
            "The Breakthrough Junior Challenge asks learners aged 13 to 18 worldwide to explain a science or maths concept in a short video, a good fit for students who enjoy presenting.",
          ],
          points: [
            "IRIS National Fair: school students in India",
            "INSPIRE Awards MANAK: class 6 to 10, nominations through schools",
            "National Children's Science Congress: a yearly theme and district to national levels",
            "Breakthrough Junior Challenge: ages 13 to 18, short video format",
          ],
          source: { label: "IRIS National Fair", url: "https://irisnationalfair.org/" },
          tool: { href: "/account/research/conferences", label: "Open the Conference Finder" },
        },
        {
          id: "ethics-young-researchers",
          title: "Ethics and safety for young researchers",
          minutes: 8,
          summary: "Consent, anonymous surveys, adult supervision, and honest use of AI tools.",
          body: [
            "Surveys of people need consent. Keep them anonymous where you can, and get approval from the school or a guardian before surveying children. Experiments on people's health, food, medicines or bodies are not allowed in school projects. Chemical or electrical work happens only under adult supervision.",
            "AI tools can help you brainstorm questions or check grammar, and you should say so in your abstract. They must not invent data, sources or results. AI tools sometimes give citations to papers that do not exist, so open and check every source you cite.",
          ],
          points: [
            "Consent before any survey, with guardian approval for children",
            "Minors present with a parent, teacher or mentor present",
            "Data must be real. Invented results are never acceptable",
            "Open and check every citation",
          ],
        },
      ],
    },
  ],
};
