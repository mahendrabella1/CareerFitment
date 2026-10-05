import type { CourseContent, LessonContent } from "@/lib/course/types";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";
import { STUDY_ABROAD_COURSES } from "@/data/studyAbroad/courses";

const countryLessons: LessonContent[] = STUDY_ABROAD_COUNTRIES.map((c) => ({
  id: `country-${c.code.toLowerCase()}`,
  title: `${c.flag} ${c.name}`,
  minutes: 6,
  summary: `Tuition about ${c.tuitionPerYearApprox} a year (approximate). Check the current figures before you plan around them.`,
  body: [
    `Working while studying: ${c.workWhileStudying}`,
    `After study: ${c.postStudyWork}`,
    `Main intakes: ${c.mainIntakes}. Tests usually needed: ${c.testsNeeded}.`,
    `Proof of funds: ${c.livingFundsNote}`,
    `Settlement: ${c.settlementPathway}`,
    `Safety and community: ${c.safetyNote}`,
  ],
  points: c.whatChanged.map((w) => `${w.title} (${w.date}): ${w.summary}`),
  tool: { href: `/account/study-abroad/countries/${c.code.toLowerCase()}`, label: "Open the country profile" },
  source: c.officialLinks[0] ? { label: c.officialLinks[0].label, url: c.officialLinks[0].url } : undefined,
}));

const courseLessons: LessonContent[] = STUDY_ABROAD_COURSES.map((c) => ({
  id: `course-${c.slug}`,
  title: c.name,
  minutes: 5,
  summary: `Typically ${c.typicalLength}.`,
  body: [c.whatToKnow, c.studyInIndiaInstead],
  tool: { href: `/account/study-abroad/courses/${c.slug}`, label: "Open the course page" },
}));

export const STUDY_ABROAD_COURSE: CourseContent = {
  key: "study-abroad",
  accent: "#7c3aed",
  kicker: "Abroad Compass",
  title: "Decide honestly whether, where and what to study abroad",
  subtitle:
    "Studying abroad is often the biggest money decision a family makes. This course puts the money check before any application, shows what has changed in each country, and gives you the full cost, not just the tuition.",
  outcomes: [
    "Run the money check on a course before you pay any application fee",
    "Read the latest rule changes for each country, with dated items and official links",
    "Work out the full cost of a programme, the loan EMI and the payback time",
    "Plan the 18-month application timeline and understand the visa and NMC rules",
  ],
  modules: [
    {
      id: "decide-first",
      title: "Decide before you apply",
      summary: "Why the money check comes first, and how honest advice differs from agent advice.",
      lessons: [
        {
          id: "money-check-first",
          title: "Why the money check comes before any application",
          minutes: 6,
          summary: "If the cost does not make sense against a realistic salary, change the country, the course, or study in India.",
          body: [
            "Most families see the full cost only after an offer letter arrives, when it is hardest to say no. The Abroad Compass puts the cost check first. If the numbers do not work against a realistic take-home salary, go back and change the country or course, or seriously consider strong options in India, before paying any application fees.",
            "Start early. A master's application usually takes twelve to eighteen months from first research to departure, and a bachelor's from class 12 often starts twelve to eighteen months before intake.",
          ],
          points: ["Check money before applying", "Change country, course or location if the numbers fail", "Start twelve to eighteen months before intake"],
          tool: { href: "/account/study-abroad/roi", label: "Open the ROI calculator" },
        },
        {
          id: "honest-advice",
          title: "What honest advice looks like",
          minutes: 5,
          summary: "A short comparison of agent-led advice with a learner-first approach.",
          body: [
            "Agent advice often starts with 'which university do you want?' and shows tuition but hides the total cost. A learner-first approach starts with what you want to do, shows the full cost and loan payback, and labels any partnership clearly.",
            "Never pay for a university to rank or promote reviews, and treat any commission-based recommendation with caution.",
          ],
          points: ["Start with goals, not a university", "Show total cost, not only tuition", "Label every partnership"],
        },
      ],
    },
    {
      id: "destinations",
      title: "Destinations and what changed",
      summary: "Compare countries on work rights, post-study options and recent rule changes.",
      lessons: [
        ...countryLessons,
        {
          id: "compare-countries",
          title: "Compare countries on what matters to you",
          minutes: 5,
          summary: "Weigh cost, work rights, post-study work, settlement and safety against your own priorities.",
          body: [
            "Use the country comparison to weigh what matters to you: cost, post-study work rights, settlement chances, safety and lifestyle. The right answer depends on your numbers and goals, not on what relatives or agents say.",
            "Rules change quickly. Each country page has a what-changed box with dated items. Read it before you decide, and check the official link for anything that affects your plan.",
          ],
          points: ["Weigh your own priorities", "Read the dated what-changed items", "Confirm rules on official sites"],
          tool: { href: "/account/study-abroad/countries", label: "Compare countries" },
        },
      ],
    },
    {
      id: "courses",
      title: "Courses and where to study them",
      summary: "The courses Indian students choose most, with the honest risks of each.",
      lessons: courseLessons,
    },
    {
      id: "costs-roi",
      title: "Costs, loans and payback",
      summary: "The full cost checklist, the loan EMI, and when a plan does not pay back.",
      lessons: [
        {
          id: "full-cost",
          title: "The full cost checklist",
          minutes: 7,
          summary: "Tuition is only one line. Living costs, visas, insurance, tests, flights and a job-search buffer all count.",
          body: [
            "Count tuition for the whole course, living costs for the city for the whole course, the visa fee and health insurance or surcharge, application and test fees, any attestation fees, flights and the initial setup, loan processing fees and the interest during study, and a buffer of three to six months of living costs for the job search after graduation.",
          ],
          points: [
            "Tuition for the whole course",
            "Living costs for the whole course",
            "Visa, health insurance or surcharge",
            "Tests, applications, attestation",
            "Flights, setup and laptop",
            "Loan fees and interest during study",
            "A three to six month job-search buffer",
          ],
          tool: { href: "/account/study-abroad/roi", label: "Run the ROI calculator" },
        },
        {
          id: "roi-check",
          title: "How the ROI check works",
          minutes: 8,
          summary: "Total investment, loan EMI, monthly saving at three salary levels, and payback time.",
          body: [
            "Total investment is the full cost in rupees minus scholarships. The loan EMI uses the standard formula, where P is the loan, r the monthly interest rate and n the number of months: EMI = P × r(1+r)^n / ((1+r)^n − 1).",
            "Monthly saving abroad is the post-tax salary minus living costs, at low, median and high salary levels. Payback time is the number of months until savings repay the loan. If the low case takes more than seven to eight years, or the plan only works with a job abroad, treat that as a serious warning.",
          ],
          points: [
            "Total investment minus scholarships",
            "Loan EMI from amount, rate and tenure",
            "Saving at low, median and high salary",
            "Payback shown as 'does not pay back' when savings cannot cover the loan",
          ],
          tool: { href: "/account/study-abroad/roi", label: "Run the ROI calculator" },
        },
        {
          id: "scholarship-gates",
          title: "Scholarship gates to check each year",
          minutes: 6,
          summary: "Fulbright-Nehru, DAAD and Chevening each have eligibility gates. Check the current call.",
          body: [
            "Fulbright-Nehru Master's Fellowships require a bachelor's degree with at least 55% and three years of full-time paid work relevant to the field. DAAD master's scholarships have looked for an undergraduate CGPA of about 7.5 out of 10 or more, English or German at B2, and two years of work experience is preferred.",
            "Chevening normally asks for work experience too. Scholarship rules and deadlines change each cycle, so confirm the current call on the official site before you plan around it.",
          ],
          points: [
            "Fulbright-Nehru: 55% and three years of paid work",
            "DAAD: about 7.5/10 CGPA, B2 language, two years preferred",
            "Chevening: work experience usually expected",
            "Confirm every call on the official site",
          ],
          source: { label: "DAAD", url: "https://www.daad.in/" },
          tool: { href: "/account/study-abroad/scholarships", label: "Open the scholarship finder" },
        },
        {
          id: "education-loans",
          title: "Education loans without surprises",
          minutes: 6,
          summary: "Compare at least three lenders on the same points, after the money check, not before.",
          body: [
            "Secured loans are backed by collateral and usually cost less; unsecured loans lean on the co-applicant and usually cost more. Loans up to ₹7.5 lakh can be covered by the government's CGFSEL guarantee without collateral, but most study-abroad budgets are larger.",
            "Repayment usually starts after the course plus one year, and interest builds up meanwhile. Section 80E lets you deduct education loan interest for up to 8 years under the old tax regime, and since 1 April 2025 no TCS is collected on fees paid from a loan by a financial institution.",
          ],
          points: ["Compare three lenders", "Ask for the full repayment schedule", "Know the 80E and TCS rules", "Never pay to guarantee a loan"],
          tool: { href: "/account/study-abroad/loans", label: "Read the loans guide" },
        },
      ],
    },
    {
      id: "applications-visas",
      title: "Applications and visas",
      summary: "The application timeline from research to departure, and why visas come last.",
      lessons: [
        {
          id: "timeline",
          title: "The 18-month application timeline",
          minutes: 7,
          summary: "Five phases, each with a checklist. Money and visa come last, but they need the earliest planning.",
          body: [
            "Eighteen to twelve months before intake: decide goals, countries and courses, run the ROI check, and start IELTS, TOEFL or GRE/GMAT preparation. Twelve to nine months before: take tests, finalise seven to nine programmes across reach, match and safe bands, request recommendation letters and draft your statement of purpose.",
            "Nine to six months before: submit applications and scholarship forms before their deadlines. Six to three months before: compare offers with the ROI calculator, accept an offer, pay the deposit, and sanction the education loan. Three to zero months before: apply for the visa as soon as the country allows, book housing and flights, and arrange insurance.",
          ],
          points: [
            "18 to 12 months: goals, ROI check, test prep",
            "12 to 9 months: tests and shortlist",
            "9 to 6 months: applications and scholarships",
            "6 to 3 months: offers, deposit, loan",
            "3 to 0 months: visa, housing, flights, insurance",
          ],
          tool: { href: "/account/study-abroad/applications", label: "Open your application tracker" },
        },
        {
          id: "reach-match-safe",
          title: "Reach, match and safe: build a balanced list",
          minutes: 5,
          summary: "Compare yourself with each programme's typical admitted student, after checking its hard minimums.",
          body: [
            "Reach means you are below the typical admitted profile, so admission is possible but uncertain. Match means you are close to it. Safe means you are comfortably above it and meet every stated minimum.",
            "Apply to about 2 reach, 3 to 4 match and 2 safe programmes, adjusted for your budget and the application fees. Use each programme's class profile or admission statistics, not an agent's promise.",
          ],
          points: ["Check hard minimums first", "Compare with the typical admit", "About 2 reach, 3-4 match, 2 safe", "Count the application fees"],
          tool: { href: "/account/study-abroad/applications", label: "Build your shortlist" },
        },
        {
          id: "visa-early",
          title: "Visas: start as early as the country allows",
          minutes: 5,
          summary: "Visa processing times vary by country and season. It is the stage most outside your control.",
          body: [
            "Visa processing depends on the country and the season, and you cannot always control the timing. Apply as early as each country allows, keep the documents organised, and read the visa checklist for your country on its official site.",
            "Check the rules on dependants as well, since rules for spouses and family members have been tightened in several countries.",
          ],
          points: ["Apply as early as allowed", "Keep documents organised", "Check dependant rules"],
        },
      ],
    },
    {
      id: "safety",
      title: "Safety and the NMC rules",
      summary: "Fake agents, unrecognised institutions, housing scams, and the rules for medicine abroad.",
      lessons: [
        {
          id: "fake-agents",
          title: "Fake agents and pressure sales",
          minutes: 5,
          summary: "Confirm every offer letter directly with the university, using contact details from its official website.",
          body: [
            "Warning signs include guaranteed admission or visa, asking you to pay agent fees in cash or to a personal account, discouraging you from contacting the university directly, and rushing you to pay a deposit.",
            "Never let anyone submit visa forms with false documents or bank statements, because visa fraud can lead to long bans. Check that an institution is officially recognised in its country, and check equivalence rules before you enrol if you plan to use the degree in India.",
          ],
          points: [
            "Confirm offers with the university directly",
            "Never pay agent fees to a personal account",
            "Check the institution is recognised",
            "Never submit false documents",
          ],
        },
        {
          id: "mbbs-nmc",
          title: "MBBS abroad and India's NMC rules",
          minutes: 7,
          summary: "To practise in India, a foreign medical graduate must meet the National Medical Commission requirements.",
          body: [
            "The NMC advisory requires at least 54 months of study plus a 12-month internship at the same foreign institution, completed within 10 years, taught in English, with a syllabus and clinical training matching Indian MBBS subjects. After returning, a graduate must complete a 12-month supervised internship in India and pass the licensing exit test.",
            "Before you choose an MBBS programme abroad, check every one of these conditions on the NMC's current guidance, not on the university's marketing.",
          ],
          points: [
            "54 months of study plus a 12-month internship",
            "Completed within 10 years, taught in English",
            "12-month supervised internship in India after return",
            "Pass the licensing exit test",
          ],
          source: { label: "National Medical Commission", url: "https://www.nmc.org.in/" },
        },
      ],
    },
  ],
};
