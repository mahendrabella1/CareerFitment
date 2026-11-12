import type { Block } from "./index";

/**
 * The "go deeper" sections of each post - examples, common mistakes and
 * step-by-step detail - inserted before the post's closing paragraph (the one
 * that points to a OneGrasp feature) by lib/blog/index.ts. Kept here so the
 * post files stay readable; edit both together.
 */
export const DEEPER: Record<string, Block[]> = {
  "how-to-choose-stream-after-10th": [
    { h2: "What if you're still unsure?" },
    { p: "Being unsure is normal. If two streams look equally good, choose the one that keeps more of your shortlisted careers open and that you'd be willing to study hard for two years. You can still specialise later - many people do." },
  ],
  "career-options-after-12th-science": [
    { h2: "A simple way to shortlist" },
    { ol: [
      "Write down every field above that you'd be curious to spend a day in.",
      "Cross out the ones whose daily work you'd find boring - be honest.",
      "For the rest, check two things: the entrance exam and the subjects it needs.",
      "Keep three. Read about each in depth, and talk to one person working in it.",
    ] },
    { h2: "Mistakes to avoid" },
    { ul: [
      "Taking every entrance exam 'just in case' - it spreads preparation too thin.",
      "Choosing a college brand over a course you'll enjoy.",
      "Ignoring newer fields because relatives haven't heard of them.",
    ] },
  ],
  "career-options-after-12th-commerce": [
    { h2: "Skills that help in every Commerce career" },
    { ul: [
      "**Spreadsheets** - comfortable with formulas, charts and clean data.",
      "**Clear writing** - reports, emails and presentations that get to the point.",
      "**Numerical reasoning** - quick, accurate work with percentages, ratios and growth.",
      "**Understanding business** - how companies make money, from news and case studies.",
    ] },
    { p: "Start building them in Class 11-12. They make degree courses easier and set you apart in internships." },
    { h2: "Mistakes to avoid" },
    { ul: [
      "Starting a professional course only because a cousin did - the workload is heavy if you don't enjoy it.",
      "Choosing a degree without checking whether it needs Maths.",
      "Ignoring internships until the final year - start small, early.",
    ] },
  ],
  "career-options-after-12th-arts-humanities": [
    { h2: "How to prepare in Class 11-12" },
    { ol: [
      "Read widely - newspapers, long-form articles and books in your area of interest.",
      "Write regularly - a blog, school magazine or debate notes.",
      "Take part in debates, model UN, quizzes or drama to build confidence.",
      "Check entrance exams early: law, design and some universities have their own tests.",
      "Collect your best work in one place for applications.",
    ] },
    { h2: "Answering the 'what will you become?' question" },
    { p: "Relatives may ask. A clear answer helps: name two careers you're exploring and what you're doing about them this year. Showing a plan is the best reply to doubt." },
  ],
  "what-is-a-psychometric-career-test": [
    { h2: "Free online quizzes vs a proper assessment" },
    { p: "Short online quizzes can be fun, but they often measure one thing loosely and give generic results. A proper assessment uses more questions, is written for your age group, looks at several dimensions together, and explains why each suggestion fits you." },
    { h2: "What parents should look for" },
    { ul: [
      "Questions suited to the student's class, not one test for everyone.",
      "A report that explains results in plain language with reasons.",
      "Next steps - not just a list of job titles.",
      "Privacy: who can see the results.",
    ] },
    { h2: "After the test" },
    { p: "Discuss the report together. Pick two or three suggested fields and explore them over the next month - read about them, watch a day-in-the-life video, and talk to someone who works in one." },
  ],
  "riasec-holland-code-explained": [
    { h2: "Examples of codes and careers" },
    { ul: [
      "**RI** (Realistic-Investigative) - engineering, lab technology, agriculture science.",
      "**IA** (Investigative-Artistic) - architecture, product design research, science writing.",
      "**SE** (Social-Enterprising) - teaching leadership, HR, counselling practice management.",
      "**EC** (Enterprising-Conventional) - banking, business management, sales operations.",
      "**AS** (Artistic-Social) - teaching art or music, media for social causes, occupational therapy.",
    ] },
    { h2: "Common misunderstandings" },
    { ul: [
      "A type is not a label for life - interests shift, especially in your teens.",
      "A low score in a type doesn't mean you can't do that work - only that it may not energise you.",
      "Your code works best combined with aptitude and values, not alone.",
    ] },
    { p: "Try this: write down three activities you lose track of time doing. Which types do they belong to? It's often a good check on your test result." },
  ],
  "multiple-intelligences-for-students": [
    { h2: "Study tips for each strength" },
    { ul: [
      "**Linguistic** - explain topics aloud or write summaries in your own words.",
      "**Logical** - turn topics into steps, flowcharts and problems to solve.",
      "**Spatial** - draw diagrams, mind maps and colour-coded notes.",
      "**Musical** - use rhythm and mnemonics for lists and formulas.",
      "**Bodily** - study in short bursts with movement; use models and experiments.",
      "**Interpersonal** - study groups and teaching a friend.",
      "**Intrapersonal** - quiet planning, journals and personal goals.",
      "**Naturalistic** - sort and classify; connect topics to the real world.",
    ] },
    { h2: "For parents and teachers" },
    { p: "Notice and name strengths beyond marks - 'you're great at explaining things to your friends' or 'you see patterns quickly'. Students who know their strengths are more confident in exploring careers that use them." },
  ],
  "career-guidance-class-6-7-8": [
    { h2: "Simple activities for this age" },
    { ol: [
      "Interview a relative about their job: what they do on a normal day, and what they like and dislike.",
      "Keep an 'interest diary' for a month - what you chose to do in free time.",
      "Try one new club or activity each term.",
      "Pick a career a month and read about it together as a family.",
      "Do a small project: a science model, a short story, a mini business at a school fair.",
    ] },
    { h2: "What to avoid" },
    { ul: [
      "Fixing a career too early and narrowing everything around it.",
      "Comparing with siblings or classmates.",
      "Treating one test result as final - it's a snapshot at this age.",
    ] },
  ],
  "communication-skills-for-students": [
    { h2: "Practise by situation" },
    { ul: [
      "**Class presentation** - open with a question or a surprising fact, keep three main points, and end with one sentence to remember.",
      "**Group discussion** - listen to the first speakers, then add a new angle, an example or a summary; use people's names when building on their point.",
      "**Interview** - prepare a one-minute 'tell me about yourself' and two stories that show your strengths.",
      "**Email to a teacher or employer** - a clear subject line, greeting, one-line purpose, the detail, and a polite close.",
    ] },
    { h2: "A weekly routine" },
    { ol: [
      "Monday: one-minute recorded answer to a new question.",
      "Wednesday: read an article aloud, then summarise it in three sentences.",
      "Friday: write a short email or paragraph and edit it to half the length.",
      "Weekend: listen to a talk and note how the speaker opened and closed.",
    ] },
    { p: "Twenty minutes a week, every week, is enough to hear a clear difference in a couple of months." },
  ],
  "how-to-prepare-for-aptitude-tests": [
    { h2: "A sample six-week plan" },
    { ol: [
      "**Weeks 1-2:** arithmetic basics - percentages, ratios, averages - and simple series and analogies.",
      "**Weeks 3-4:** time and work, speed and distance, interest; coding-decoding, directions and blood relations.",
      "**Week 5:** data interpretation and verbal ability; first full timed mock.",
      "**Week 6:** weak topics only, two more mocks, and a review of every mistake.",
    ] },
    { h2: "Speed tricks that actually help" },
    { ul: [
      "Know percentage-fraction pairs (1/8 = 12.5%, 1/6 ≈ 16.7%) by heart.",
      "Estimate first, then calculate - many options can be ruled out quickly.",
      "In reasoning puzzles, draw a quick table before you start.",
      "Skip and return: never spend three minutes on one question in a timed test.",
    ] },
  ],
  "free-ai-courses-with-certificates-for-students": [
    { h2: "A path by age" },
    { ul: [
      "**Class 6-8:** start with AI awareness courses and classroom-friendly tools; try a simple project like training an image classifier with a no-code tool.",
      "**Class 9-12:** beginner AI courses with a certificate, then a small project - for example, a chatbot for school FAQs or a model that sorts photos.",
      "**College:** programming and machine learning courses, data projects, and building with AI tools in your own field.",
    ] },
    { h2: "Turn a certificate into proof" },
    { p: "Certificates show you finished a course; projects show you can use it. After each course, build something small, write two lines about what it does, and add it to your portfolio or Career Passport." },
    { h2: "Mistakes to avoid" },
    { ul: ["Collecting certificates without building anything.", "Paying for a certificate when a free one exists elsewhere.", "Sharing personal or school data with AI tools."] },
  ],
  "how-to-plan-your-school-year": [
    { h2: "An example week" },
    { ul: [
      "**Learn (25 min):** one lesson in a short course - say, money basics.",
      "**Practise (15 min):** ten aptitude questions or a one-minute speaking challenge.",
      "**Explore (15 min):** read about one career or open a tool you haven't tried.",
    ] },
    { p: "That's under an hour, and over a year it adds up to dozens of lessons, skills that improved week by week, and careers you've actually looked into." },
    { h2: "When motivation drops" },
    { ul: [
      "Shrink the task: five minutes still counts.",
      "Attach it to a habit: after Sunday breakfast, before checking your phone.",
      "Look back: count what you've done since the start, not what's left.",
    ] },
  ],
  "how-to-write-a-research-paper-as-a-student": [
    { h2: "Citing sources" },
    { p: "Every fact you didn't discover yourself needs a source. Pick one citation style (your teacher may name one) and use it consistently: author, title, where it was published, year, and a link if it's online. Never copy text without quotation marks and a citation - that's plagiarism, even by accident." },
    { h2: "Common mistakes" },
    { ul: [
      "A question too big to answer in a few weeks.",
      "Too few responses or measurements to say anything.",
      "Claiming more than the data shows - 'some students' is not 'all students'.",
      "Leaving the abstract to the last minute - it's what most readers see first.",
    ] },
    { h2: "A timeline that works" },
    { ol: ["Week 1: question and reading", "Weeks 2-3: collect data", "Week 4: analyse", "Week 5: write and get feedback", "Week 6: revise and submit"] },
  ],
  "entrance-exams-after-12th-how-to-choose": [
    { h2: "A sample preparation timeline" },
    { ol: [
      "**Early Class 11:** understand the syllabus and pattern of your two or three exams.",
      "**Class 11:** build concepts alongside school; weekly practice.",
      "**First half of Class 12:** finish the syllabus; topic-wise tests.",
      "**Final months:** full mocks, revision, error log - and rest.",
    ] },
    { h2: "Keeping a backup" },
    { p: "Always have a good backup option - another exam, a university with merit-based admission, or a related course you'd still enjoy. A backup lowers pressure, and lower pressure often means better scores in your first choice." },
  ],
  "how-to-find-scholarships-in-india": [
    { h2: "A scholarship calendar habit" },
    { ol: [
      "At the start of each academic year, list the scholarships you qualify for.",
      "Note when each usually opens and closes, and confirm on the official site.",
      "Set two reminders for each: one when it opens, one a week before it closes.",
      "Keep scans of your documents in one folder so applying takes minutes.",
      "Renew on time - many scholarships need yearly renewal with marks and attendance.",
    ] },
    { h2: "Mistakes that cost scholarships" },
    { ul: [
      "Waiting until the last day, when portals are slow.",
      "Mismatched names or details between documents and the bank account.",
      "Forgetting to submit the hard copy or institute verification when required.",
    ] },
  ],
  "is-studying-abroad-worth-it": [
    { h2: "A worked example (illustrative)" },
    { p: "Suppose a two-year master's costs a family a large sum including living costs and loan interest. If the graduate earns noticeably more each year than they would have with an Indian degree, the extra earnings may repay the cost within a few years. If they return to India after the course and earn about the same as Indian graduates, it may never pay back. The decision turns on realistic numbers for your field - not on averages for all graduates." },
    { h2: "Questions to ask before applying" },
    { ul: [
      "What do graduates of this exact course earn, and where do they work?",
      "What are the current post-study work rules, from the government's own website?",
      "What is my plan if I can't find work there?",
      "Could a similar course in India give most of the benefit at a lower cost?",
    ] },
  ],
  "financial-literacy-for-teenagers": [
    { h2: "A sample budget for pocket money" },
    { ul: [
      "**50% spend** - snacks, outings, small purchases.",
      "**30% save** - towards a goal like a cycle, a course or a gadget.",
      "**10% grow** - left untouched in a savings account to learn how interest works.",
      "**10% give** - a gift for someone, or a cause you care about.",
    ] },
    { p: "The exact split matters less than the habit of deciding before you spend." },
    { h2: "Talk about money at home" },
    { p: "Ask your parents how they plan a month's expenses, what a bank statement shows, and how they decide big purchases. Families that talk openly about money raise children who handle it confidently." },
  ],
  "upi-and-online-scams-targeting-students": [
    { h2: "How to check an offer in two minutes" },
    { ol: [
      "Search the company or scheme name with the word 'scam' or 'fraud'.",
      "Find the official website yourself - don't use the link in the message.",
      "Check the email domain: official bodies don't use free email addresses.",
      "Ask a parent, teacher or friend before paying anything.",
    ] },
    { h2: "Protect your accounts" },
    { ul: [
      "Turn on two-step verification for email and social media.",
      "Use a different strong password for your email than anywhere else.",
      "Never install screen-sharing apps at a stranger's request.",
      "Check UPI app permissions and remove apps you don't use.",
    ] },
  ],
  "legal-rights-every-student-in-india-should-know": [
    { h2: "How to raise a problem, step by step" },
    { ol: [
      "Write down what happened, when, and who was involved.",
      "Raise it with the right person first - a class teacher, principal, college committee or the company's customer care - in writing.",
      "Keep copies of everything you send and receive.",
      "If it isn't resolved, go to the next level - a helpline, a portal or a formal complaint.",
      "For serious matters, involve a parent or guardian and seek legal advice.",
    ] },
    { h2: "Online safety basics" },
    { ul: ["Keep accounts private and accept only people you know.", "Don't share passwords, OTPs or personal photos.", "Block and report harassment, and save evidence before deleting anything."] },
  ],
  "startup-ideas-for-students": [
    { h2: "Idea starters" },
    { ul: [
      "A service for your school or college - notes, tutoring, event photography.",
      "A product made by hand - crafts, baked goods, upcycled items.",
      "A digital tool - a simple website or app that saves people time.",
      "A local problem - waste, safety, transport - with a small, testable fix.",
    ] },
    { h2: "Keep it legal and safe" },
    { ul: [
      "Involve a parent or guardian if you're under 18, especially for payments.",
      "Be honest about what you sell, and keep simple records of money in and out.",
      "Protect customers' personal data.",
    ] },
    { h2: "What you gain even if it fails" },
    { p: "Talking to customers, solving problems, working with money and handling setbacks are skills every employer values. A venture that teaches you these is a success on your resume, whatever happens to it." },
  ],
  "resume-for-freshers-pass-the-ats": [
    { h2: "A simple fresher resume structure" },
    { ol: [
      "**Name and contact** - phone, email, city, LinkedIn.",
      "**Summary** - two or three lines on what you're looking for and your strongest skills.",
      "**Education** - degree, college, year, marks if strong.",
      "**Projects** - two or three, each with what you did and the result.",
      "**Experience** - internships, part-time work, volunteering.",
      "**Skills** - technical skills first, then tools and languages.",
      "**Certificates and achievements.**",
    ] },
    { h2: "Before you send it" },
    { ul: [
      "Read it aloud to catch mistakes.",
      "Check the file name: Firstname-Lastname-Resume.pdf.",
      "Tailor the summary and skills to each job.",
    ] },
  ],
  "interview-tips-for-freshers": [
    { h2: "Example: 'Tell me about yourself'" },
    { p: "'I'm a final-year B.Com student at a college in Hyderabad. Over the last year I've worked on two finance projects - one analysing a small business's cash flow - and interned with a CA firm, where I prepared GST working papers. I enjoy turning numbers into decisions, and that's why this analyst role interests me.' It's short, specific and points to the role." },
    { h2: "Mistakes to avoid" },
    { ul: [
      "Reciting your resume line by line.",
      "Answers without examples.",
      "Criticising a previous college, teacher or employer.",
      "Saying 'I have no weaknesses'.",
    ] },
  ],
  "how-to-find-a-good-internship": [
    { h2: "A short outreach email" },
    { p: "'Dear Ms Rao, I'm a second-year B.Sc. Computer Science student. I read about your team's work on crop-disease detection and would love to learn from it. Last term I built a small image classifier for leaf photos (link). Would you consider me for a short internship this summer? I've attached my resume. Thank you for your time.' Personal, specific and polite - and short." },
    { h2: "Make the most of it" },
    { ul: [
      "Ask what success looks like in the first week.",
      "Keep a log of what you did each day - it becomes your resume bullets.",
      "Ask for feedback before you leave, and a letter or certificate.",
      "Stay in touch - many jobs come from former internships.",
    ] },
  ],
  "parents-guide-to-career-conversations": [
    { h2: "Questions that open the conversation" },
    { ul: [
      "'What did you enjoy most this term, and why?'",
      "'If you could try any job for a week, what would it be?'",
      "'What worries you about choosing?'",
      "'What would you like from us?'",
    ] },
    { h2: "When you disagree" },
    { p: "Name the worry behind your view - money, safety, respect - and ask your child to answer that worry with facts. Agree to gather information together: talk to someone in the field, check costs and routes, try the work. Decisions made together are easier to stick with." },
  ],
  "career-guidance-in-schools": [
    { h2: "A sample year for a school" },
    { ol: [
      "**Term 1:** assessments by class; reports shared with students and parents.",
      "**Through the year:** students follow a weekly plan; counsellors see progress monthly.",
      "**Monthly:** counsellors meet students on the counselling list first.",
      "**Before stream and course choices:** family conversations, supported by parent surveys.",
      "**End of year:** a school report for leadership and next year's planning.",
    ] },
    { h2: "What success looks like" },
    { ul: ["Most students complete the assessment and know their best-fit fields.", "Most are on track with their plan.", "Every student flagged for a conversation gets one.", "Fewer last-minute, pressured stream and course changes."] },
  ],
  "workplace-stress-causes-and-what-to-do": [
    { h2: "Signs stress is building" },
    { ul: ["Sleep problems or dreading Monday from Saturday", "Irritability and difficulty concentrating", "Working longer but getting less done", "Withdrawing from colleagues, friends or hobbies"] },
    { h2: "Example: a boundary message" },
    { p: "'Hi team - to keep my focus during work hours, I'll be offline after 7 pm on weekdays. For anything urgent, please call me. Thanks for understanding.' Short, calm, and clear about what counts as urgent." },
    { h2: "When to look for a change" },
    { p: "If harassment or unfair treatment continues after you've raised it, or your health is suffering despite real efforts, it may be time to plan a move - quietly and carefully. Update your resume and start looking before you resign." },
  ],
};

/** Extra depth for the most-searched topics, added after DEEPER. */
export const MORE: Record<string, Block[]> = {
  "career-options-after-12th-science": [
    { h2: "Newer fields worth knowing" },
    { ul: [
      "**Data science and AI** - statistics, programming and domain knowledge; routes through B.Tech, B.Sc. statistics or computer science.",
      "**Biomedical engineering** - medicine meets engineering: devices, imaging and prosthetics.",
      "**Environmental and climate science** - energy, water, pollution and sustainability work in government, research and industry.",
      "**Forensic science** - science applied to investigations.",
      "**Food technology and nutrition** - safety, processing and health.",
    ] },
    { p: "These fields often combine subjects, so they suit students who enjoy more than one area of science - and they're growing as industries change." },
  ],
  "career-options-after-12th-commerce": [
    { h2: "Newer and growing Commerce careers" },
    { ul: [
      "**Financial analysis and fintech** - analysing investments and building payment and lending products.",
      "**Business analytics** - using data to answer business questions; Maths and spreadsheets help.",
      "**Digital marketing** - search, social media, content and performance marketing.",
      "**Supply chain and logistics** - moving goods efficiently, from warehouses to e-commerce.",
      "**Human resources** - hiring, training and people policies.",
    ] },
    { p: "Many of these value practical skills and internships as much as the degree, so start building a portfolio of small projects early." },
  ],
  "career-options-after-12th-arts-humanities": [
    { h2: "Newer and growing Humanities careers" },
    { ul: [
      "**User experience (UX) research and writing** - understanding how people use products and writing the words in apps.",
      "**Content strategy and digital media** - planning and producing content for brands and platforms.",
      "**Public policy and development** - research and programmes in government, NGOs and think tanks.",
      "**Counselling and wellbeing** - growing demand in schools, colleges and workplaces, with further study in psychology.",
      "**Heritage, museums and tourism** - history and culture as a career.",
    ] },
  ],
  "what-is-a-psychometric-career-test": [
    { h2: "How results usually look" },
    { p: "A good report doesn't just say 'Engineer' or 'Doctor'. It describes your profile - for example, strong in logical reasoning, curious, prefers working with ideas over routine, motivated by solving problems - and then lists fields that suit that profile, with reasons. That description is the most useful part: it stays true even as specific job titles change." },
    { h2: "Taking it more than once" },
    { p: "Interests and strengths develop, especially between Class 8 and the end of college. Taking a stage-appropriate assessment again before each big decision - stream, course, first job - keeps the guidance current." },
  ],
  "how-to-find-scholarships-in-india": [
    { h2: "Types of scholarships to look for" },
    { ul: [
      "**Merit-based** - for strong marks or exam results.",
      "**Need-based** - for families below an income limit.",
      "**Category-based** - for specific social categories, as defined by each scheme.",
      "**Girls' scholarships** - schemes that encourage girls' education.",
      "**Talent and sports** - for achievement in arts, sports or competitions.",
      "**Course-specific** - for fields such as science, technology or research.",
    ] },
    { p: "Most students qualify for more than one type. Searching across all of them, not just the best-known schemes, finds the most money." },
  ],
  "how-to-prepare-for-aptitude-tests": [
    { h2: "Keep an error log" },
    { p: "After every practice set, write down each mistake in one line: the topic, what went wrong (concept, calculation, reading, time) and the fix. Read the log before each mock. Patterns appear quickly - and fixing your three most common mistakes often raises a score more than learning a new topic." },
    { h2: "On test day" },
    { ul: ["Start with your strongest section to build momentum.", "Watch the clock at fixed points, not after every question.", "Don't leave easy marks: return to skipped questions in the last minutes.", "Check whether wrong answers carry negative marks before guessing."] },
  ],
  "resume-for-freshers-pass-the-ats": [
    { h2: "Before and after: three bullet points" },
    { ul: [
      "Before: 'Worked on a website project.' After: 'Built a responsive college-fest website in React with 3 teammates; 2,000+ visitors in the first week.'",
      "Before: 'Did an internship in marketing.' After: 'Wrote 12 product posts for a D2C brand's Instagram; two reached 10x the page's average engagement.'",
      "Before: 'Good at Excel.' After: 'Automated a monthly attendance report with Excel formulas, cutting preparation time from 3 hours to 20 minutes.'",
    ] },
    { p: "These are examples of the shape to aim for - use your own real numbers only. If you don't have one, describe the scale or the outcome honestly." },
  ],
  "interview-tips-for-freshers": [
    { h2: "Questions to ask the interviewer" },
    { ul: [
      "'What would success look like in the first three months?'",
      "'What do people who do well in this team have in common?'",
      "'What is the next step in the process?'",
    ] },
    { h2: "Online interviews" },
    { ul: ["Sit facing a window or light, not with it behind you.", "Look at the camera when you speak.", "Keep notes off-screen and brief.", "Have a backup: a phone number ready in case the connection drops."] },
  ],
  "communication-skills-for-students": [
    { h2: "Body language basics" },
    { ul: ["Stand or sit upright with shoulders relaxed.", "Make eye contact for a few seconds at a time.", "Use open hand gestures; avoid crossed arms.", "Pause instead of filling silence - it reads as confidence."] },
  ],
  "free-ai-courses-with-certificates-for-students": [
    { h2: "Project ideas after your first course" },
    { ul: [
      "A chatbot that answers common questions about your school's events.",
      "An image classifier that sorts recyclable and non-recyclable waste photos.",
      "A small dashboard that summarises class survey results.",
      "A study helper that turns your notes into practice questions - then check every answer yourself.",
    ] },
  ],
};

/** A short summary near the top of each post - also the format search engines lift into snippets. */
export const TAKEAWAYS: Record<string, string[]> = {
  "how-to-choose-stream-after-10th": ["Start from your interests and strengths, not friends' choices.", "Work backwards from two or three careers to the stream and subjects they need.", "Many careers accept every stream.", "Try the work briefly, then decide as a family."],
  "career-options-after-12th-science": ["PCM and PCB open many careers beyond engineering and medicine.", "Shortlist by the daily work you'd enjoy, then check exams and subjects.", "Plan entrance exam registration early and confirm dates on official sites."],
  "career-options-after-12th-commerce": ["Commerce leads to professional courses, business, finance, economics and law.", "Check whether a course needs Maths.", "Practical skills and early internships matter as much as the degree."],
  "career-options-after-12th-arts-humanities": ["Humanities is a strong choice with growing careers.", "Law, psychology, media, design, policy and civil services are common routes.", "Build writing, speaking and research skills, and keep a portfolio."],
  "what-is-a-psychometric-career-test": ["Psychometric tests measure interests, aptitude, personality, strengths and values.", "They show patterns and good matches - not destiny.", "Answer honestly, take a test for your stage, and use the results to explore."],
  "riasec-holland-code-explained": ["RIASEC sorts interests into six types.", "Your top two or three types form your Holland code.", "Combine your code with aptitude and values before choosing."],
  "multiple-intelligences-for-students": ["Gardner described eight kinds of intelligence.", "Treat them as a way to notice strengths, not fixed scores.", "Use your strengths to study better and explore careers."],
  "career-guidance-class-6-7-8": ["Middle school is for exploring, not deciding.", "Notice interests and strengths early, without pressure.", "Build communication, reasoning and money skills a little each week."],
  "communication-skills-for-students": ["Communication is a skill that improves with practice.", "Record yourself, listen back, and fix one thing at a time.", "Practise little and often - a minute a day works."],
  "how-to-prepare-for-aptitude-tests": ["Aptitude tests cover maths, reasoning, verbal ability and data.", "Learn the method, practise in sets of ten, then take timed mocks.", "Keep an error log and review every mistake."],
  "free-ai-courses-with-certificates-for-students": ["Learn AI step by step: aware, user, maker, builder.", "Choose courses whose certificate is free on the provider's site.", "Build a small project after each course, and use AI honestly."],
  "how-to-plan-your-school-year": ["Plan in weeks: three small tasks, any time that week.", "Go lighter in exam months.", "Keep a catch-up list instead of giving up."],
  "how-to-write-a-research-paper-as-a-student": ["Start with a small, specific question.", "Choose a method, collect data honestly and cite every source.", "Write a clear abstract and present your work."],
  "entrance-exams-after-12th-how-to-choose": ["Choose exams from the courses you want, not the other way round.", "Check eligibility in the official bulletins.", "Set reminders for registration and keep a backup option."],
  "how-to-find-scholarships-in-india": ["Look across government, state, exam-based, private and university scholarships.", "Keep documents ready and apply early.", "Never pay a fee to receive a scholarship."],
  "is-studying-abroad-worth-it": ["Add up the full cost, including loan interest.", "Use realistic earnings for your field and check current work rules.", "Verify agents and universities directly before paying."],
  "financial-literacy-for-teenagers": ["Save first, then spend.", "Track where money goes and know needs from wants.", "Never share a PIN or OTP."],
  "upi-and-online-scams-targeting-students": ["You never enter your UPI PIN to receive money.", "Genuine internships and scholarships don't charge fees.", "If cheated, call 1930 and report on cybercrime.gov.in quickly."],
  "legal-rights-every-student-in-india-should-know": ["Know the basics: education, safety, ragging, online harassment and consumer rights.", "Write things down and raise problems in writing.", "Helplines: 1930, 1915, 1098, 14416 and the anti-ragging helpline."],
  "startup-ideas-for-students": ["Start with a real problem and talk to people who have it.", "Test cheaply, then build the smallest version.", "Keep studies first; most funding comes later."],
  "resume-for-freshers-pass-the-ats": ["Use a simple one-column format the ATS can read.", "Write action-led bullets with honest results.", "Match your genuine skills to the words in the job post."],
  "interview-tips-for-freshers": ["Prepare a one-minute introduction and two STAR stories.", "Answer with examples, not adjectives.", "Ask a thoughtful question at the end."],
  "how-to-find-a-good-internship": ["Look at public programmes, your college, job boards and direct outreach.", "Send short, tailored messages.", "Never pay to join an internship."],
  "parents-guide-to-career-conversations": ["Listen before advising.", "Separate your hopes from your child's strengths.", "Look at evidence together and agree on the next step."],
  "career-guidance-in-schools": ["Assess every student by class.", "Give everyone a structured weekly plan.", "Use counsellor time for the students who need it most, and report simply."],
  "workplace-stress-causes-and-what-to-do": ["Most work stress comes from workload, toxic behaviour, culture or job security.", "Work out whether it's the work or the workplace.", "Take one small action per cause, and get support if you're struggling."],
};
