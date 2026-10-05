import type { CourseContent, LessonContent } from "@/lib/course/types";
import { EXAMS } from "@/data/exams/exams";

const STAGE_LABEL: Record<string, string> = {
  school: "School",
  after12: "After class 12",
  college: "College",
  professional: "Professional",
};

const examLessons: LessonContent[] = EXAMS.map((e) => {
  const notes = e.cycle.rules.flatMap((r) => (r.type === "note" ? [r.text] : []));
  return {
    id: `exam-${e.slug}`,
    title: e.name,
    minutes: 4,
    summary: `Conducted by ${e.body} for the ${e.cycle.year} cycle. Stage: ${STAGE_LABEL[e.stage] ?? e.stage}.`,
    body: [
      `Fields: ${e.fields.join(", ")}.`,
      ...notes,
      `Rules last checked on ${e.cycle.checkedAt}${e.cycle.tentative ? ". Dates for this cycle are still tentative" : ""}. Confirm everything on the official notice before you apply.`,
    ],
    tool: { href: `/account/exams/${e.slug}`, label: "Open this exam's page" },
    source: { label: `${e.body} official site`, url: e.officialUrl },
  };
});

export const EXAMS_COURSE: CourseContent = {
  key: "exams",
  accent: "#2563eb",
  kicker: "Entrance Exams and Eligibility",
  title: "Find the exams you can take, and plan back from each date",
  subtitle:
    "Fill in your profile once. The checker then shows only the exams you are eligible for now or soon, with a plan counting back from each date. Every rule links to its official notice, and every result can be checked.",
  outcomes: [
    "Know which exams you can take now, which you can take soon, and why",
    "Plan a year at a time, from class 6 to a career, without missing an application window",
    "Use the official syllabus, past papers and honest mock analysis to prepare",
    "Make drop-year and coaching decisions with a checklist, not pressure",
  ],
  modules: [
    {
      id: "start-here",
      title: "Start here",
      summary: "How eligibility is worked out, and what your profile needs.",
      lessons: [
        {
          id: "how-eligibility-works",
          title: "How eligibility works: four states",
          minutes: 6,
          summary: "Every exam is marked eligible now, eligible soon, not eligible, or check needed.",
          body: [
            "Eligible now means you can apply in the current cycle. Eligible soon means you will qualify after a known event, such as passing class 12. Not eligible means you fail a rule that will not change, and the result tells you which one. Check needed means the profile is missing information, so the checker asks for it rather than guessing.",
            "Every result says it is based on the official notice of a given date. It is never final until you confirm it on the official website.",
          ],
          points: [
            "Eligible now: you can apply in this cycle",
            "Eligible soon: you qualify after a known event",
            "Not eligible: the reason is shown in one line",
            "Check needed: add the missing information",
          ],
          tool: { href: "/account/exams/dashboard", label: "Open your eligibility checker" },
        },
        {
          id: "build-profile",
          title: "Build your profile once, and keep it current",
          minutes: 5,
          summary: "Class, date of birth, subjects, marks and optional category. Update it each year.",
          body: [
            "Your profile needs your current class or level, your date of birth, your stream and subjects, and your marks. Age limits are checked on each exam's cut-off date, so the date of birth matters.",
            "The category field is optional. It is used only to apply official relaxations in age, marks and attempts, and it is never shown to anyone else.",
          ],
          points: [
            "Date of birth sets age limits",
            "Subjects decide subject requirements",
            "Category is optional and used only for official relaxations",
          ],
          tool: { href: "/account/exams/dashboard", label: "Fill in your profile" },
        },
      ],
    },
    {
      id: "plan-by-stage",
      title: "Plan by stage",
      summary: "What to do each year, from class 6 to working life.",
      lessons: [
        {
          id: "class-6-8",
          title: "Class 6 to 8: curiosity and strong basics",
          minutes: 5,
          summary: "Read widely, build maths and reading habits, and try one Olympiad for fun.",
          body: [
            "This stage is about curiosity and strong basics, not pressure. Read widely, build maths and reading habits, explore interests through clubs and projects, and try one Olympiad for fun.",
            "Scholarship and talent exams such as NMMS in class 8 are worth knowing about. Check whether each one is still running before you plan around it.",
          ],
          points: ["Read widely", "Build maths and reading habits", "Try one Olympiad for fun", "Explore clubs and projects"],
          tool: { href: "/account/exams/roadmap", label: "Open the stage roadmap" },
        },
        {
          id: "class-9-10",
          title: "Class 9 to 10: discover interests and choose a stream",
          minutes: 5,
          summary: "Find out what you enjoy and what each stream leads to, before you choose.",
          body: [
            "Take a career-interest quiz, talk to people in three careers, and understand what each stream leads to. Keep the NCERT basics strong. Focus on building foundations rather than cramming.",
          ],
          points: ["Career-interest quiz", "Talk to people in three careers", "Understand each stream", "Keep NCERT basics strong"],
          tool: { href: "/account/exams/roadmap", label: "Open the stage roadmap" },
        },
        {
          id: "class-11",
          title: "Class 11: choose two to four target exams",
          minutes: 6,
          summary: "Pick exams from your eligibility list, get the official syllabus, and start weekly study.",
          body: [
            "Pick two to four target exams from the eligibility list. Get the official syllabus for each. Build a weekly study plan, and try past papers by the end of the year. Class 11 is the densest stage for entrance exams, and most learners follow three to six of them.",
          ],
          points: ["Pick two to four targets", "Get the official syllabus", "Weekly study plan", "Past papers by year end"],
          tool: { href: "/account/exams/roadmap", label: "Open the stage roadmap" },
        },
        {
          id: "class-12",
          title: "Class 12: board and entrance exams together",
          minutes: 6,
          summary: "A month-by-month plan that links board topics to entrance topics, with a backup option kept open.",
          body: [
            "Follow a month-by-month plan that links board and entrance topics. Register on time, take full mocks, and keep backup options open. The actual dates come from each exam's notice, and the dashboard fills them in when they are published.",
          ],
          points: ["Register on time", "Link board and entrance topics", "Full mocks in the final months", "Keep a backup option"],
          tool: { href: "/account/exams/roadmap", label: "Open the stage roadmap" },
        },
        {
          id: "after-12-gap",
          title: "After class 12: decide a gap year with a checklist",
          minutes: 6,
          summary: "A drop year is a real decision. Answer six questions before you choose it.",
          body: [
            "Decide whether a drop year is worth it using a checklist, not a yes or no opinion. Always register for a backup course while you decide.",
          ],
          points: [
            "How far was my score from the cut-off I need?",
            "How many attempts and years of eligibility do I have left?",
            "Can my family afford another year, including coaching and living costs?",
            "Was I unwell or unprepared for a specific, fixable reason?",
            "How did the last year affect my health and mood?",
            "Have I also secured a backup admission?",
          ],
          tool: { href: "/account/exams/roadmap", label: "Open the stage roadmap" },
        },
        {
          id: "college-working",
          title: "College and working professionals",
          minutes: 6,
          summary: "Plan the next step by year two. Check age and attempt limits, which many people misjudge.",
          body: [
            "In college, decide between a job, higher study, an MBA, government service or study abroad by year two. Start GATE, CAT, UPSC or GRE planning in years two and three.",
            "Working professionals should check age and attempt limits carefully. Many assume they are too old when they are not, or the reverse. Build a part-time study plan around real career value.",
          ],
          points: ["Decide the next step by year two", "Check age and attempt limits", "Build a realistic part-time plan"],
          tool: { href: "/account/exams/roadmap", label: "Open the stage roadmap" },
        },
      ],
    },
    {
      id: "directory",
      title: "Exam directory",
      summary: "Each exam with its conducting body, current cycle, fields and official source.",
      lessons: examLessons,
    },
    {
      id: "deadlines",
      title: "Deadlines and alerts",
      summary: "A missed application date costs a whole year. Here is how the radar keeps dates right.",
      lessons: [
        {
          id: "deadline-radar",
          title: "The deadline radar: what it tracks",
          minutes: 6,
          summary: "Notifications, registration windows, admit cards, exam dates, answer keys, results and counselling.",
          body: [
            "The radar tracks each step for the exams you follow: the notification, registration opening and closing (including late-fee windows), admit card release, exam dates, answer key and objection window, results and counselling rounds.",
            "Every date links to the official notice it came from. Dates that are expected but not announced are labelled Tentative, in a different style, so they are never mistaken for confirmed dates.",
          ],
          points: [
            "Every date links to its official notice",
            "Tentative dates are labelled, never shown as confirmed",
            "Changed dates trigger an alert to everyone following that exam",
          ],
          tool: { href: "/account/exams/dashboard", label: "Open your deadline radar" },
        },
        {
          id: "exam-scams",
          title: "Fake sites and exam scams",
          minutes: 4,
          summary: "Exams never ask for payment through personal UPI IDs, phone calls or unofficial sites.",
          body: [
            "Watch for guaranteed seats, management quota agents, fake result or admit card links forwarded on WhatsApp, and anyone who asks you to pay through a personal UPI ID. Always use the official website, which is shown first on every exam page.",
          ],
          points: ["Use the official website", "No real exam takes payment through personal UPI or phone calls", "Be wary of guaranteed seats"],
        },
      ],
    },
    {
      id: "prepare",
      title: "Prepare well",
      summary: "The official syllabus, past papers, and mock tests that give honest feedback.",
      lessons: [
        {
          id: "syllabus-papers",
          title: "Use the official syllabus and past papers",
          minutes: 7,
          summary: "Start from the official source. Free resources come next, and your own mock tests last.",
          body: [
            "Every exam page has a Prepare tab built around the official syllabus, official past papers and good free resources. Use the NCERT textbooks as a foundation for many school-level exams, and SWAYAM or NPTEL for college-level courses.",
            "Track the syllabus as a checklist. Mark each topic as not started, learning, revised or confident, and revisit the topics you marked as not started first.",
            "The study planner does this for JEE Main, NEET-UG, CUET-UG, CLAT, CAT, UPSC Prelims and GATE General Aptitude, and lets you add your own topics for any other exam. It spreads what is left across the weeks before your revision phase and adjusts as you go.",
          ],
          points: ["Official syllabus first", "Past papers from official sources", "NCERT for foundations", "Track topics as a checklist"],
          tool: { href: "/account/exams/planner", label: "Open the study planner" },
        },
        {
          id: "mock-analysis",
          title: "Mock tests: read the analysis, not just the score",
          minutes: 7,
          summary: "The analysis tells you what to fix next. The score alone does not.",
          body: [
            "A mock test copies the real interface and timing. The analysis shows accuracy against attempts, the marks lost to negative marking, a heatmap of weak topics, time per question, and an error log tagged as concept gap, silly mistake, misread question or time pressure.",
            "Any estimated range is an estimate from the platform's own test-takers, never a prediction of the real exam. No honest preparation promises a guaranteed rank.",
            "The practice sets here are short and original, with each exam's real marking scheme. For full-length practice, use the official mock tests and past papers on the exam's own website.",
          ],
          points: ["Accuracy against attempts", "Weak-topic heatmap", "Error log by cause", "Three specific next actions"],
          tool: { href: "/account/exams/mocks", label: "Take a practice mock" },
        },
      ],
    },
    {
      id: "wellbeing",
      title: "Wellbeing and honest guidance",
      summary: "One exam does not decide a life. Backup paths, coaching decisions and support for stress.",
      lessons: [
        {
          id: "backup-paths",
          title: "Backup paths to the same career",
          minutes: 5,
          summary: "Every target exam comes with alternatives, and most careers have more than one route.",
          body: [
            "When you add a target exam, the dashboard suggests two or three related alternatives with different eligibility or difficulty. For example, a JEE target also shows state CETs, BITSAT, CUET-UG for B.Sc programmes and private university exams.",
            "Someone can become an engineer, doctor, lawyer or designer through several routes, including later entry. Knowing this lowers the pressure of any single result.",
          ],
          points: ["Alternatives with different difficulty", "Several routes to most careers", "Later entry is a real option"],
          tool: { href: "/account/exams/roadmap", label: "See the stage roadmap" },
        },
        {
          id: "judging-coaching",
          title: "Judging coaching before you pay",
          minutes: 5,
          summary: "Ask for proof, check refunds in writing, and compare with free resources first.",
          body: [
            "Ask for a free demo class and real past results with student names you can verify. Be careful with 100% selection or guaranteed rank claims. Check the refund policy in writing before paying a large fee.",
            "Many students succeed through self-study with official resources and mock tests. Compare the free route first.",
          ],
          points: ["Ask for a free demo", "Verify results with names", "Get refund terms in writing", "Try the free route first"],
        },
        {
          id: "stress-support",
          title: "Support for exam stress",
          minutes: 4,
          summary: "Sleep, breaks, and free support if the pressure becomes too much.",
          body: [
            "Exam stress is common. Keep to a sleep routine, take study breaks, and plan exam-day logistics in advance. If the pressure becomes too much, Tele-MANAS on 14416 gives free mental health support.",
            "Avoid comparison and leaderboards on result day. Parents can help most by focusing on effort, avoiding comparisons and keeping communication open.",
          ],
          points: ["Sleep and breaks", "Plan exam-day logistics early", "Tele-MANAS 14416 is free", "Focus on effort, not comparison"],
        },
      ],
    },
  ],
};
