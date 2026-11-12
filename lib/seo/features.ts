/**
 * The public feature pages (/features and /features/<slug>): what each part
 * of the dashboard does, written for people searching for it, with a way in
 * (sign up and take the assessment). Everything here must be true of the
 * feature as built - check the feature (and CLAUDE.md) before changing a claim.
 * No prices: the price is shown before paying and changes with offers.
 */
export interface FeaturePage {
  slug: string;
  /** Short name, used in lists and breadcrumbs. */
  name: string;
  /** The search title (the site name is added after it). */
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  /** Picture: /features/<art>.webp or a /home/... path. */
  image: string;
  /** Where it lives once signed in. */
  dashboard: string;
  who: string;
  intro: string[];
  points: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
  group: "Start" | "Learn" | "Practise" | "Plan your career" | "Get ready for work" | "For schools and professionals";
}

const art = (k: string) => `/features/${k}.webp`;

export const FEATURE_PAGES: FeaturePage[] = [
  {
    slug: "career-assessment-test", name: "Career assessment test", group: "Start",
    title: "Career Assessment Test for Students - Class 6 to College",
    h1: "A career assessment test made for your stage - Class 6 to college",
    description: "OneGrasp's career fitment test has its own questions for Class 6, 7, 8, 9-10, 11-12 and undergraduates. See how you think, learn and work, and the careers that fit you.",
    keywords: ["career assessment test", "career test for students", "psychometric test for class 10", "career aptitude test India", "career test after 12th"],
    image: "/home/tour.webp", dashboard: "/?begin=1", who: "Class 6 to 12 and undergraduates",
    intro: [
      "Most career tests ask a Class 7 student and a final-year undergraduate the same questions. OneGrasp doesn't: each stage has its own assessment, written for what that stage is deciding - interests and strengths in middle school, stream and subjects in Class 9-10, careers and courses in Class 11-12, and roles after the degree for undergraduates.",
      "You take it online, one question at a time. You can pause and come back - your answers are saved. At the end you get a report and a dashboard built on it.",
    ],
    points: [
      { t: "Questions for your stage", d: "Separate assessments for Class 6, 7 and 8, Class 9-10, Class 11-12 (after you pick your stream and the career you're thinking of) and undergraduates (after you pick your degree and course)." },
      { t: "How you think, learn and work", d: "Your profile across eight dimensions - personality, interests, aptitude, the ways you're intelligent, your strengths and what motivates you." },
      { t: "Careers that fit, with reasons", d: "Your best-fit fields and careers, and for Class 11-12 and undergraduates, how well the career you have in mind fits you." },
      { t: "A plan, not just a score", d: "Your report comes with next steps and a dashboard - courses, labs, tools and a 40-week Year Plan for your class." },
    ],
    faqs: [
      { q: "Which classes can take the career assessment?", a: "Students from Class 6 to Class 12 and undergraduates. Each stage has its own questions. Working professionals take the Workplace Stress Check instead." },
      { q: "Can I stop in the middle?", a: "Yes. Your answers are saved, so you can pause and come back to where you left off." },
      { q: "What do I get after the test?", a: "Your career report - your profile across eight dimensions and the careers that fit you best - a copy by email, and your dashboard with every course, lab and tool." },
      { q: "How much does it cost?", a: "The price is shown before you pay, with any offer running at the time." },
    ],
    related: ["career-report", "year-plan", "career-library"],
  },
  {
    slug: "career-report", name: "Career report", group: "Start",
    title: "Your Career Report - Strengths, Best-Fit Careers and a Plan",
    h1: "Your career report: who you are, what fits, what to do next",
    description: "After the assessment, your OneGrasp report shows your profile across eight dimensions, your best-fit fields and careers, how you think and learn, and a plan - as a page-turning book you can download.",
    keywords: ["career report", "psychometric report", "career guidance report", "best career for me", "career roadmap"],
    image: "/home/report.webp", dashboard: "/account?view=report", who: "Everyone who takes the assessment",
    intro: [
      "Your report turns your answers into something you can use: a clear picture of how you think, learn and work, the fields and careers that match it, and what to do next.",
      "It opens like a book - one page at a time, with a contents list - and you can download it to read anywhere, even offline. A copy comes to your email.",
    ],
    points: [
      { t: "Eight dimensions", d: "Your profile across eight dimensions, each explained in plain words with what it means for study and work." },
      { t: "Best-fit fields and careers", d: "The fields and careers your profile points to, with the reasons - not just a list of job titles." },
      { t: "Roadmaps", d: "For Class 11-12 and undergraduates, step-by-step roadmaps for careers - what to study, which exams, skills and internships." },
      { t: "Your 30- and 90-day plan", d: "Small first steps you can tick off on your dashboard." },
    ],
    faqs: [
      { q: "Can I download my career report?", a: "Yes. You can download it as a file that opens on any phone or computer, even offline, and a copy is sent to your email." },
      { q: "Can my school see my report?", a: "If your school uses OneGrasp's institution portal, your counsellor can open your report to guide you." },
    ],
    related: ["career-assessment-test", "year-plan", "career-library"],
  },
  {
    slug: "year-plan", name: "Year Plan", group: "Start",
    title: "A 40-Week Year Plan for Students - Explore Everything, Step by Step",
    h1: "Your Year Plan: 40 weeks, a few tasks a week, made for your class",
    description: "OneGrasp's Year Plan takes Class 6 to college students through every lesson, lab and career tool in a sensible order - about an hour a week, lighter in exam months, ticked automatically.",
    keywords: ["study plan for students", "career planning for class 9", "weekly study plan", "student year planner", "career guidance programme for schools"],
    image: art("progress"), dashboard: "/account/year-plan", who: "Class 6 to 12 and undergraduates",
    intro: [
      "A dashboard full of courses, labs and tools is only useful if you know where to start. The Year Plan answers that: a 40-week path made for your class group, with a few tasks each week.",
      "Week 1 starts the day you join. Tasks tick themselves when you finish a lesson or open a tool - nothing to mark by hand - and exam months get a lighter week.",
    ],
    points: [
      { t: "Different for each class", d: "Class 6-8, 9-10, 11-12 and college each get their own order - entrance exams early for Class 11-12, resume and jobs early for college." },
      { t: "Covers everything", d: "Every course lesson, the Communication and Aptitude Labs, every tool, startups, and the career tools - ending with your course certificates." },
      { t: "About an hour a week", d: "Weeks are balanced by time, so none is a pile; exam months get one small task." },
      { t: "Catch up any time", d: "Missed a week? Earlier tasks wait in a 'Catch up' list and still count." },
      { t: "Schools see progress", d: "Schools using the institution portal see who is on track and who needs a nudge." },
    ],
    faqs: [
      { q: "How long does the Year Plan take each week?", a: "About an hour on average, a little more in some weeks and one small task in exam months." },
      { q: "Do I have to mark tasks as done?", a: "No. A task ticks itself when you finish its lessons or open its pages." },
    ],
    related: ["career-assessment-test", "communication-lab", "aptitude-test-practice"],
  },
  {
    slug: "communication-lab", name: "Communication Lab", group: "Learn",
    title: "Communication Skills Course for Students - With Voice Practice and Feedback",
    h1: "Communication Lab: speak, write and listen with confidence",
    description: "A communication skills course for every class - short videos, reading, activities, writing tasks and voice practice with instant feedback on pace, filler words and pauses, plus your Communication Score.",
    keywords: ["communication skills for students", "spoken English practice", "public speaking for students", "group discussion practice", "communication skills course online"],
    image: art("communication"), dashboard: "/account/communication", who: "Class 6 to college, with a track for each stage",
    intro: [
      "Communication is the skill every career asks for and few schools teach directly. The Communication Lab has a track for each stage - Class 6-8, 9-10, 11-12 and college - with modules that build from clear speaking to interviews and group discussions.",
      "Every module mixes short videos, reading, quizzes, hands-on activities, a writing task and voice practice. Record an answer and get feedback on what you said and how you said it.",
    ],
    points: [
      { t: "Voice practice with feedback", d: "Your speaking pace, filler words and long pauses are measured, and you get notes on content, structure and tone." },
      { t: "Writing tasks", d: "Letters, emails and short pieces reviewed with clear suggestions." },
      { t: "Listening exercises", d: "Clips read aloud for you to follow and summarise." },
      { t: "Your Communication Score", d: "Speaking, writing, listening and reading combined into one score you can grow." },
      { t: "Daily one-minute challenge", d: "A short speaking prompt every day to build the habit." },
    ],
    faqs: [
      { q: "Is my voice recording stored?", a: "No. Only the transcript and your scores are kept on your profile - the recording itself is not stored." },
      { q: "Which classes is the Communication Lab for?", a: "Every class from 6 to college, with a separate track for each stage." },
    ],
    related: ["aptitude-test-practice", "resume-builder-and-interview-practice", "year-plan"],
  },
  {
    slug: "aptitude-test-practice", name: "Aptitude Lab", group: "Practise",
    title: "Aptitude Test Practice - Maths, Reasoning and English With Solutions",
    h1: "Aptitude Lab: practise aptitude questions with a worked solution every time",
    description: "Practise quantitative, logical reasoning, verbal and data interpretation questions for your class, with a worked solution after each answer, Today's 10, timed mock tests and your Aptitude Score.",
    keywords: ["aptitude test practice", "reasoning questions for students", "NMMS mental ability practice", "CUET general test practice", "placement aptitude test practice"],
    image: art("aptitude"), dashboard: "/account/aptitude", who: "Class 6 to college and job-seekers",
    intro: [
      "Aptitude sections appear everywhere - Olympiads and NMMS in school, CUET and other entrance tests after Class 12, and campus placement tests in college. The Aptitude Lab lets you practise the topics for your stage, at your level.",
      "Maths and reasoning questions are generated fresh, so you never run out, and every answer is followed by a worked solution showing the method and the shortcut.",
    ],
    points: [
      { t: "33 topics in four sections", d: "Quantitative aptitude, logical reasoning, verbal ability and data interpretation, each with a concept card." },
      { t: "Levels that adapt", d: "Score well in a topic and it gets harder; struggle and it eases off." },
      { t: "Today's 10", d: "A mixed set of ten questions every day - about eight minutes." },
      { t: "Timed mock tests", d: "In the style of Olympiad and NMMS tests for school, CUET and entrance tests after Class 12, and placement tests for college." },
    ],
    faqs: [
      { q: "Are these real exam papers?", a: "No. Mock tests are written in the style of those exams for practice; they are not official papers." },
      { q: "Does the Aptitude Lab use my career assessment answers?", a: "No. It's practice only and is separate from the assessment." },
    ],
    related: ["entrance-exams", "communication-lab", "year-plan"],
  },
  {
    slug: "ai-courses-certificates", name: "AI & Certifications", group: "Learn",
    title: "Free AI Courses With Certificates for Students, and AI Tools Rated by Age",
    h1: "AI & Certifications: free AI courses that end in a real certificate",
    description: "A guide to free AI courses that end in a free certificate or badge - from beginner to builder - and AI tools rated for safety, privacy and age, for school and college students.",
    keywords: ["free AI course with certificate", "AI courses for students", "AI for school students", "learn AI free India", "AI tools for students"],
    image: art("ai"), dashboard: "/account/ai", who: "Class 6 to college",
    intro: [
      "There are good free AI courses from governments, universities and tech companies - and many that only look free until the certificate. This section lists courses that end in a free certificate or badge, arranged as a ladder from 'AI aware' to 'AI builder'.",
      "It also rates AI tools - what they do, the free tier, privacy, safety and Indian languages - and shows each student only the tools suitable for their age.",
    ],
    points: [
      { t: "A four-step ladder", d: "AI Aware, AI User, AI Maker and AI Builder, so you know what to take next." },
      { t: "Free certificates only", d: "Courses with a paid certificate are left out." },
      { t: "Tools rated by age", d: "Tools for children and classrooms for Class 6-8, more for Class 9-12, and adult tools only for college students." },
      { t: "Using AI safely", d: "A short guide to privacy, checking AI answers and using it honestly for schoolwork." },
    ],
    faqs: [
      { q: "Do I need to pay for the AI courses?", a: "The courses listed end in a free certificate or badge on the provider's own site. Free tiers and certificate rules change, so check the provider's page." },
    ],
    related: ["communication-lab", "research-and-conferences", "career-library"],
  },
  {
    slug: "financial-literacy", name: "Money skills", group: "Learn",
    title: "Financial Literacy for Students - Money Course, Calculators and Scam Shield",
    h1: "Money skills: financial literacy for students, in short lessons and tools",
    description: "Budgeting, saving, banking, UPI safety, salary and taxes basics - a financial literacy course for students with calculators, money labs and the Scam Shield game, and a certificate.",
    keywords: ["financial literacy for students", "money management for teenagers", "how to save money as a student", "UPI scams", "financial literacy course India"],
    image: art("money"), dashboard: "/account/money", who: "Class 6 to college",
    intro: [
      "Money mistakes are expensive and most of them are avoidable. This course teaches the basics in short lessons - budgeting, saving, banking and payments, borrowing, salary and taxes - with tools to try each idea on real numbers.",
      "Scam Shield turns spotting frauds into a game, so you recognise a fake UPI request or a too-good-to-be-true offer before it costs your family money.",
    ],
    points: [
      { t: "Short lessons", d: "Money basics, payments, borrowing and credit, salary and taxes, and protecting yourself from scams." },
      { t: "Calculators and labs", d: "Try saving versus growing, read a salary slip, and run a month of real-life choices." },
      { t: "Scam Shield", d: "Rounds of real-looking messages: spot the scam and learn the warning signs." },
      { t: "Certificate", d: "Finish every lesson and claim a course certificate you can share." },
    ],
    faqs: [
      { q: "Is the money course suitable for Class 6-8?", a: "Yes. The lessons are short and practical, and the Scam Shield game is a good start at any age." },
    ],
    related: ["legal-rights-for-students", "startups-for-students", "scholarships"],
  },
  {
    slug: "legal-rights-for-students", name: "Law & Rights", group: "Learn",
    title: "Know Your Rights - Legal Awareness Course for Students in India",
    h1: "Law & Rights: the legal basics every student should know",
    description: "Your rights at school, online, as a consumer and at work, explained in plain language - lessons, guides, ready-to-use letter templates and 'What would you do?' scenarios.",
    keywords: ["legal awareness for students", "rights of students in India", "cyber safety laws India", "consumer rights India", "legal literacy course"],
    image: art("legal"), dashboard: "/account/legal", who: "Class 6 to college",
    intro: [
      "Knowing your rights changes how you handle a problem - a refund that never comes, a harassing message, an unfair rule at work. This section explains the basics in plain words and shows what to actually do.",
      "Scenarios let you practise the decision first, and letter templates help you write the complaint or request when you need one.",
    ],
    points: [
      { t: "Lessons in plain words", d: "Childhood and school, money and shopping, online safety and privacy, work, and the action tools that help." },
      { t: "Guides", d: "Step-by-step help for common situations." },
      { t: "Letter templates", d: "Ready-to-fill letters and emails for complaints and requests." },
      { t: "What would you do?", d: "Short scenarios to practise the right response before you need it." },
    ],
    faqs: [
      { q: "Is this legal advice?", a: "No. It is legal awareness for students. For a specific case, speak to a lawyer or the relevant authority." },
    ],
    related: ["financial-literacy", "workplace-stress-check", "internships"],
  },
  {
    slug: "entrance-exams", name: "Entrance exams", group: "Plan your career",
    title: "Entrance Exams After 10th and 12th - Guide, Eligibility and Preparation",
    h1: "Entrance exams: which exams lead where, and how to prepare",
    description: "Which entrance exams lead to which courses, eligibility by stage, how to plan your preparation, mock tests and deadline alerts - for Class 9 to 12 and graduates.",
    keywords: ["entrance exams after 12th", "entrance exams after 10th", "CUET preparation", "competitive exams list India", "exam eligibility"],
    image: art("exams"), dashboard: "/account/exams", who: "Class 9 to college",
    intro: [
      "The right entrance exam depends on the course you want - and missing a registration window can cost a year. This section maps exams to courses and stages, explains eligibility, and helps you plan the preparation.",
      "Lessons cover how to read a pattern and syllabus, plan by stage, use mocks well, and look after yourself during the exam year.",
    ],
    points: [
      { t: "Exam directory", d: "Exams by field and stage, each with who it's for and where it leads." },
      { t: "A plan for each exam", d: "Turn the exam date into a week-by-week preparation plan." },
      { t: "Mock tests and alerts", d: "Practise, and get a reminder email before registration closes." },
      { t: "Wellbeing", d: "Honest guidance on pressure, rest and asking for help." },
    ],
    faqs: [
      { q: "Are exam dates always up to date?", a: "Dates are checked, but always confirm on the exam's official website before you apply - each exam page links to it." },
    ],
    related: ["aptitude-test-practice", "scholarships", "career-library"],
  },
  {
    slug: "scholarships", name: "Scholarships", group: "Plan your career",
    title: "Scholarships for Students in India - Finder, Deadlines and How to Apply",
    h1: "Scholarships: find the ones you qualify for, and apply on time",
    description: "Search scholarships by eligibility, amount and deadline, track applications, get deadline reminders, write a stronger essay, and avoid scholarship scams - for school and college students.",
    keywords: ["scholarships for students in India", "scholarship for class 11", "scholarships after 12th", "NSP scholarship", "how to apply for scholarship"],
    image: art("scholarships"), dashboard: "/account/scholarships", who: "Class 6 to college",
    intro: [
      "Many students miss scholarships simply because they never hear of them, or hear too late. This section brings scholarships into one list you can filter by your class, eligibility, amount and deadline.",
      "Then it helps you apply well: a deadline calendar, an application tracker, an essay helper, renewals once you've won - and clear warnings about scholarship scams.",
    ],
    points: [
      { t: "Scholarship finder", d: "Eligibility, amount and deadline for each scholarship, with a link to the official page." },
      { t: "Calendar and tracker", d: "Never miss a closing date; keep every application in one place." },
      { t: "Essay helper", d: "Structure a scholarship essay that shows who you are." },
      { t: "Scam warnings", d: "No real scholarship asks you to pay a fee to receive it." },
    ],
    faqs: [
      { q: "Can I get an email before a scholarship closes?", a: "Yes. Set a reminder on any scholarship and you get an email at your account's address before the deadline." },
    ],
    related: ["study-abroad", "entrance-exams", "financial-literacy"],
  },
  {
    slug: "study-abroad", name: "Study abroad", group: "Plan your career",
    title: "Study Abroad After 12th or Graduation - Honest Guide, ROI and Safety",
    h1: "Study abroad: decide honestly before anyone sells you a university",
    description: "Is studying abroad worth it for you? Compare countries and courses, work out the return on investment, find scholarships and loans, and check agents and MBBS-abroad rules before you pay.",
    keywords: ["study abroad after 12th", "study abroad cost", "MBBS abroad NMC rules", "education loan for abroad", "best country to study abroad"],
    image: art("study-abroad"), dashboard: "/account/study-abroad", who: "Class 9 to college",
    intro: [
      "Studying abroad can change a career - or leave a family with a large loan and a degree that doesn't pay back. This section helps you decide on evidence: cost, return, country rules and safety.",
      "Start with the ROI calculator, compare countries and popular courses, then plan the money - scholarships abroad and how education loans really work.",
    ],
    points: [
      { t: "ROI calculator", d: "See whether a degree abroad pays back, before you apply." },
      { t: "Countries and courses", d: "Compare costs, work rules and popular courses side by side." },
      { t: "Scholarships and loans", d: "Funding options abroad, and the questions to ask a lender." },
      { t: "Safety checks", d: "Check an agent or offer letter, and the NMC rules if you're considering MBBS abroad." },
    ],
    faqs: [
      { q: "Does OneGrasp work with study-abroad agents?", a: "No. The section is there to help you decide independently, including how to check any agent before you pay." },
    ],
    related: ["scholarships", "entrance-exams", "financial-literacy"],
  },
  {
    slug: "research-and-conferences", name: "Research", group: "Learn",
    title: "Research for Students - From a Question to a Paper You Can Present",
    h1: "Research: learn how research works, and do your own project",
    description: "A research course for school and college students - asking a good question, finding and citing sources, writing an abstract - with a research studio for your own project and ways to present it.",
    keywords: ["research for students", "how to write a research paper", "research project for school students", "student research conference", "how to write an abstract"],
    image: art("research"), dashboard: "/account/research", who: "Class 8 to college",
    intro: [
      "Research is a habit of mind - asking good questions and checking answers - and it stands out on any application. This course walks you through it, then gives you a studio to do your own project.",
      "When your work is ready, Spotlight shows ways to present and publish it.",
    ],
    points: [
      { t: "Research course", d: "From choosing a question to methods, sources, ethics and writing." },
      { t: "Research studio", d: "Plan a project, keep sources, and draft an abstract." },
      { t: "Present and share", d: "Prepare for a conference or a publication." },
      { t: "Certificate", d: "Finish the course and claim a shareable certificate." },
    ],
    faqs: [
      { q: "Can school students do research?", a: "Yes. Many good projects start in school - a careful question, honest data and a clear write-up matter more than age." },
    ],
    related: ["publish-research-isbn-issn", "ai-courses-certificates", "career-passport"],
  },
  {
    slug: "startups-for-students", name: "Startups", group: "Learn",
    title: "Startup Course for Students - Build an Idea, Find Funding",
    h1: "Startups: turn an idea into a small venture",
    description: "A step-by-step startup course for students - founder mindset, finding a real problem, building an MVP and first customers - with founder videos, a funding directory and a venture page.",
    keywords: ["startup ideas for students", "entrepreneurship course for students", "startup funding India", "how to start a startup as a student", "student entrepreneur"],
    image: art("startups"), dashboard: "/account/startups", who: "Class 8 to college",
    intro: [
      "You don't need a company to start learning how startups work - you need a real problem and a way to test a solution. The Builder track takes you there module by module, each ending with a short test.",
      "Alongside it: founders' stories, a directory of real grants, loans and programmes (most need a registered company, and the page says which suit students), and a page for your venture.",
    ],
    points: [
      { t: "Builder track", d: "Founder mindset, the right problem, building the MVP, marketing and first customers." },
      { t: "Funding directory", d: "Grants, loans, subsidies and equity programmes, with the ones open to students marked." },
      { t: "Founder videos", d: "Real founders on how they started." },
      { t: "Certificate", d: "Pass every module test and claim the Startups: Builder Track certificate." },
    ],
    faqs: [
      { q: "Can students apply for startup funding?", a: "Some programmes are open to students and individual innovators; most need a registered company with adult directors. The funding page marks the ones for students." },
    ],
    related: ["financial-literacy", "research-and-conferences", "career-passport"],
  },
  {
    slug: "career-library", name: "Career library", group: "Plan your career",
    title: "Career Library - Careers Explained, With Degree-by-Degree Roadmaps",
    h1: "Career library: explore careers and the roadmap to each one",
    description: "Explore careers - what the work is, the skills, the routes in - and degree roadmaps for over 2,000 roles: what to study, internships, certifications and the next step after your degree.",
    keywords: ["career options after 12th", "list of careers", "how to become", "career roadmap", "career options after graduation"],
    image: art("careers"), dashboard: "/account/career-library", who: "Class 6 to college",
    intro: [
      "It's hard to choose a career you've never heard of. The career library lets you explore careers by field - what the work involves, the skills it needs and how people get there.",
      "For undergraduates, degree roadmaps go further: for over 2,000 roles, what to do year by year, internships, certifications, jobs, postgraduate options and study abroad.",
    ],
    points: [
      { t: "Careers by field", d: "Browse careers grouped by field, each explained in plain words." },
      { t: "Degree roadmaps", d: "Year-by-year steps for the role you want, written for your degree and course." },
      { t: "From your report", d: "Your best-fit careers link straight to their pages." },
      { t: "Test-drive", d: "Try a day in the job with Career Test-Drive." },
    ],
    faqs: [
      { q: "Are the roadmaps reviewed by experts?", a: "Most roadmaps are researched; a few are shorter drafts that are clearly marked as awaiting expert review." },
    ],
    related: ["career-test-drive", "career-report", "internships"],
  },
  {
    slug: "internships", name: "Internships", group: "Get ready for work",
    title: "Internships and Free Programmes for Students",
    h1: "Internships: free programmes to build experience",
    description: "Browse free internships and programmes for school and college students - government and other schemes - and see which suit your stage and field.",
    keywords: ["internships for students", "free internships India", "government internship for students", "summer internship", "virtual internship"],
    image: art("internships"), dashboard: "/account/internships-new", who: "Class 9 to college",
    intro: [
      "Experience matters, and it doesn't have to cost money. This section lists free programmes and internships you can join, with what each offers and who it's for.",
      "Pair it with the job board for paid openings, and add what you complete to your Career Passport.",
    ],
    points: [
      { t: "Free programmes", d: "Government and other schemes, each with eligibility and a link to apply." },
      { t: "By stage and field", d: "Find the ones that fit where you are now." },
      { t: "Add it to your passport", d: "Record what you did, with proof, in your Career Passport." },
    ],
    faqs: [
      { q: "Do I pay to join these programmes?", a: "The programmes listed are free. Be careful of anyone asking for a fee to 'guarantee' an internship." },
    ],
    related: ["jobs-for-freshers", "resume-builder-and-interview-practice", "career-passport"],
  },
  {
    slug: "jobs-for-freshers", name: "Jobs board", group: "Get ready for work",
    title: "Jobs and Internships for Freshers - Updated Daily",
    h1: "Jobs board: internships and entry-level jobs, updated daily",
    description: "Internships and entry-level jobs from trusted sources, updated every day and checked for scam warning signs, matched to your career path. Apply on the employer's own site.",
    keywords: ["jobs for freshers", "remote jobs for freshers India", "internships for college students", "entry level jobs", "work from home internship"],
    image: art("jobready"), dashboard: "/account/jobs", who: "College students and job-seekers",
    intro: [
      "The job board brings together internships and entry-level roles from sources that allow it, refreshed daily. Each listing is checked for common scam warning signs, and you always apply on the employer's own site.",
      "Signed in, you see which jobs are on your career path, save the ones you like and track your applications.",
    ],
    points: [
      { t: "Updated daily", d: "New listings every day from permitted sources." },
      { t: "Scam checks", d: "Warning signs flagged before you click apply." },
      { t: "On your path", d: "Jobs matched to the roles in your degree roadmap." },
      { t: "Application tracker", d: "Saved, applied, interview - all in one list." },
    ],
    faqs: [
      { q: "Do I need an account to see the jobs?", a: "No. Anyone can browse the board at /jobs. Sign in to save jobs and see the ones on your career path." },
    ],
    related: ["resume-builder-and-interview-practice", "internships", "career-passport"],
  },
  {
    slug: "resume-builder-and-interview-practice", name: "Resume & interview", group: "Get ready for work",
    title: "Resume Builder With ATS Check, and Mock Interview Practice",
    h1: "Resume & interview: an ATS-ready resume and interview practice",
    description: "Build a resume that applicant tracking systems can read, check it against a job post, get AI help with bullets and cover letters, and practise interviews with feedback on your answers.",
    keywords: ["resume builder for freshers", "ATS resume checker", "mock interview practice", "interview questions for freshers", "cover letter for internship"],
    image: art("jobready"), dashboard: "/account/resume/plan", who: "Class 11 to college and job-seekers",
    intro: [
      "Most large employers screen resumes with software before a person reads them. The resume builder uses clean, one-column templates that software reads correctly, and an ATS check tells you exactly what to fix.",
      "Then practise the interview: 100 common questions with model answers for students and freshers, and a mock interview that gives feedback on what you said.",
    ],
    points: [
      { t: "ATS check", d: "Readability, impact, sections and match to a job post - every finding with a fix." },
      { t: "Real PDF download", d: "A proper PDF made from four ATS-safe templates." },
      { t: "AI help, your facts", d: "Better bullets, a summary, a cover letter and your LinkedIn - from what you actually did." },
      { t: "Mock interviews", d: "Answer by voice or in writing and get scores and a stronger version of your answer." },
    ],
    faqs: [
      { q: "Will the AI invent achievements for my resume?", a: "No. It works only from what you tell it and leaves a [placeholder] where a number would help." },
    ],
    related: ["jobs-for-freshers", "communication-lab", "internships"],
  },
  {
    slug: "publish-research-isbn-issn", name: "Spotlight", group: "Get ready for work",
    title: "Publish Your Work - Conferences, Research Writing, ISBN and ISSN Help",
    h1: "Spotlight: present, publish and get your work seen",
    description: "Present at a conference, get coaching on research writing, publish a book with an ISBN, start a journal with an ISSN (college and professionals) or write for a magazine - with OneGrasp's team.",
    keywords: ["how to publish a research paper as a student", "how to get ISBN in India", "ISSN for journal India", "student conference India", "publish a book India"],
    image: art("spotlight"), dashboard: "/account/spotlight", who: "Students and professionals",
    intro: [
      "Spotlight brings together OneGrasp's services for getting your work seen: upcoming conferences, a research writing programme, help with an ISBN for a book or an ISSN for a journal, and the Awardees Magazine.",
      "These are paid services. Asking is free - send a request and the team replies with the details and fee.",
    ],
    points: [
      { t: "Conferences", d: "Upcoming OneGrasp conferences and how to submit an abstract." },
      { t: "Research writing", d: "Coaching and editing - you stay the author." },
      { t: "ISBN and ISSN", d: "The numbers are free from the government agencies; OneGrasp charges for help with the process. ISSN help is for college students and professionals." },
      { t: "Magazine", d: "Write an article for the Awardees Magazine." },
    ],
    faqs: [
      { q: "Is an ISBN free in India?", a: "Yes, the ISBN agency issues it free. OneGrasp's fee is only for help with the application, if you want it." },
    ],
    related: ["research-and-conferences", "career-passport", "resume-builder-and-interview-practice"],
  },
  {
    slug: "career-test-drive", name: "Career Test-Drive", group: "Plan your career",
    title: "Career Test-Drive - Try a Day in a Career Before You Choose It",
    h1: "Career Test-Drive: try a day in the job before you choose it",
    description: "A short, realistic day in a career - the tasks, decisions and pressures - so you can feel whether it suits you before you pick a course.",
    keywords: ["career simulation for students", "day in the life of a career", "try a career", "career exploration activities", "which career suits me"],
    image: art("careers"), dashboard: "/account/test-drive", who: "Class 6 to college",
    intro: [
      "Reading about a career is not the same as doing it. A Test-Drive puts you in a typical day - what you'd work on, the decisions you'd make - in about fifteen minutes.",
      "Try the careers from your report, compare how they felt, and take the result to your family conversation.",
    ],
    points: [
      { t: "A realistic day", d: "Typical tasks and decisions, grounded in the career's real roadmap." },
      { t: "Your reaction counts", d: "Note what you enjoyed and what you didn't." },
      { t: "Bring it to the family", d: "Use it in the Family Decision Room." },
    ],
    faqs: [
      { q: "How long does a Career Test-Drive take?", a: "About fifteen minutes per career." },
    ],
    related: ["career-library", "family-decision-room", "career-report"],
  },
  {
    slug: "family-decision-room", name: "Family Decision Room", group: "Plan your career",
    title: "Family Decision Room - Choose a Stream or Course Together",
    h1: "Family Decision Room: decide a stream, course or career together",
    description: "Put the options side by side - fit, cost, time and risk - and invite your parents to add their view through a private link, so the family agrees on the next step.",
    keywords: ["how to choose a stream after 10th", "career decision with parents", "choosing a course after 12th", "career counselling for parents", "stream selection"],
    image: "/home/tour.webp", dashboard: "/account/decision-room", who: "Class 9 to college, and parents",
    intro: [
      "Big choices - a stream after Class 10, a course after Class 12 - are family decisions. The Decision Room gives the conversation a structure: each option with how well it fits you, cost, time and risk.",
      "Parents answer through a private link, so everyone's view is on the same page - literally.",
    ],
    points: [
      { t: "Options side by side", d: "Fit from your report, plus indicative cost and time ranges." },
      { t: "Parents' view", d: "A private link for parents to add their thoughts." },
      { t: "A clear next step", d: "End with an agreed decision or what to find out next." },
    ],
    faqs: [
      { q: "Do my parents need an account?", a: "No. They answer through a private link you share." },
    ],
    related: ["career-test-drive", "career-report", "career-gps"],
  },
  {
    slug: "career-gps", name: "Career GPS", group: "Plan your career",
    title: "Career GPS - Three Small Career Missions a Week",
    h1: "Career GPS: three small missions a week, chosen for you",
    description: "Three small weekly missions picked from your class, report and goal - watch, do, build - checked automatically, with points and streaks your school can see.",
    keywords: ["career planning activities for students", "weekly career goals", "career habits", "student goal tracker", "career readiness"],
    image: art("progress"), dashboard: "/account/gps", who: "Class 6 to college",
    intro: [
      "Career readiness is built in small steps. Career GPS picks three missions each week from your own situation - test-drive a career, finish a lesson, add an achievement - and checks them off as you do them.",
      "Keep a streak going week after week; your school sees your progress if it uses the portal.",
    ],
    points: [
      { t: "Chosen for you", d: "Missions based on your class, assessment and goal." },
      { t: "Checked automatically", d: "From what you actually do in the app." },
      { t: "Streaks", d: "Finish all three in a week to keep your streak." },
    ],
    faqs: [
      { q: "How is Career GPS different from the Year Plan?", a: "The Year Plan is the full 40-week path through everything; Career GPS is three quick missions a week to build the habit." },
    ],
    related: ["year-plan", "career-passport", "career-test-drive"],
  },
  {
    slug: "career-passport", name: "Career Passport", group: "Get ready for work",
    title: "Career Passport - A Verified Record of Your Achievements",
    h1: "Career Passport: your achievements, with proof",
    description: "Record projects, certificates, competitions and internships with proof, get them verified by your school, and share one link with colleges and employers.",
    keywords: ["student achievement portfolio", "student portfolio for college admission", "verified certificates", "co-curricular record", "skills record"],
    image: art("progress"), dashboard: "/account/passport", who: "Class 6 to college",
    intro: [
      "Achievements get lost in folders and phone galleries. The Career Passport keeps them in one place - each with proof - and your school can verify them.",
      "Share a single link when you apply for a college, a scholarship or a job.",
    ],
    points: [
      { t: "One place", d: "Projects, certificates, competitions, internships and more." },
      { t: "Verified", d: "Your institution can verify entries." },
      { t: "One link to share", d: "A public page for applications." },
    ],
    faqs: [
      { q: "Who can see my Career Passport?", a: "People you share the link with. It is not listed in search engines." },
    ],
    related: ["career-gps", "resume-builder-and-interview-practice", "internships"],
  },
  {
    slug: "for-schools", name: "For schools", group: "For schools and professionals",
    title: "Career Guidance Platform for Schools and Colleges",
    h1: "For schools: career guidance for every student, with a portal for counsellors",
    description: "Give every student an assessment, report and Year Plan, and give counsellors a portal - class-wise rollout, a counselling list, Year Plan progress, parent surveys, messages and a printable school report.",
    keywords: ["career guidance for schools", "career counselling platform for schools", "school career guidance programme", "psychometric test for schools", "career counselling software"],
    image: "/home/institution.webp", dashboard: "/institution", who: "Schools, colleges and counsellors",
    intro: [
      "One counsellor cannot sit with every student. OneGrasp gives each student an assessment, a report and a 40-week Year Plan, and gives the school a portal to see where everyone is and who to see first.",
      "The portal shows assessment by class, a counselling list with the reason each student needs a conversation, Year Plan progress, and a school report you can print.",
    ],
    points: [
      { t: "Assessment by class", d: "See who has finished, and remind those who haven't." },
      { t: "Counselling list", d: "Students who would benefit from a one-to-one, with the reason and a way to start." },
      { t: "Year Plan progress", d: "Who is on track, who is behind, and a message to nudge them." },
      { t: "Parents and messages", d: "Parent surveys, messages to students and replies in one place." },
      { t: "School report", d: "Participation, best-fit fields, career areas and counselling needs - printable." },
    ],
    faqs: [
      { q: "How do students join our school's portal?", a: "Students enter your institution's name when they sign up; they then appear in your portal." },
      { q: "How do we get a portal login?", a: "Write to support@onegrasp.com and the team sets up your institution's login." },
    ],
    related: ["year-plan", "career-assessment-test", "career-report"],
  },
  {
    slug: "workplace-stress-check", name: "Workplace Stress Check", group: "For schools and professionals",
    title: "Workplace Stress Check - Find What's Causing Your Stress at Work",
    h1: "Workplace Stress Check: find what's really causing your stress at work",
    description: "A five-minute check for working professionals across workload, toxic behaviour, culture and job security - what's driving your stress, and a 30-day plan with ready-to-use messages.",
    keywords: ["workplace stress test", "work stress check", "toxic workplace signs", "burnout at work India", "job stress"],
    image: "/home/tour.webp", dashboard: "/account/stress", who: "Working professionals",
    intro: [
      "Stress at work has causes, and naming them is the first step to changing them. This short check - about five minutes, three simple answers per question - looks at four areas: workload, toxic behaviour, culture and psychological safety, and career and job security.",
      "Your results show the drivers behind your stress and a 30-day plan, with ready-to-send messages for the hard conversations. Your individual answers are never shown back - only what they point to.",
    ],
    points: [
      { t: "Four areas, fourteen drivers", d: "From time pressure to job insecurity, so you see what's behind the score." },
      { t: "Is it the work or the workplace?", d: "A compass that separates heavy workload from a difficult environment." },
      { t: "A 30-day plan", d: "Practical steps and templates - a priorities talk, a boundary message, an HR email." },
      { t: "Support", d: "If you're struggling, the Tele-MANAS helpline (14416) is on every results page." },
    ],
    faqs: [
      { q: "How long is the Workplace Stress Check?", a: "About five minutes - 34 questions with three answers each." },
      { q: "Is this a medical diagnosis?", a: "No. It's a self-check to understand your situation. If you're struggling, talk to someone - Tele-MANAS is free on 14416." },
    ],
    related: ["legal-rights-for-students", "resume-builder-and-interview-practice", "communication-lab"],
  },
];

export const featurePage = (slug: string) => FEATURE_PAGES.find((f) => f.slug === slug);
export const FEATURE_GROUPS = ["Start", "Learn", "Practise", "Plan your career", "Get ready for work", "For schools and professionals"] as const;
