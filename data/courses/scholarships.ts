import type { CourseContent, LessonContent } from "@/lib/course/types";
import { SCHOLARSHIPS, SCHOLARSHIP_TYPE_LABEL } from "@/data/scholarships/scholarships";

const listingLessons: LessonContent[] = SCHOLARSHIPS.map((s) => ({
  id: `scholarship-${s.slug}`,
  title: s.name,
  minutes: 3,
  summary: `${SCHOLARSHIP_TYPE_LABEL[s.type]} scholarship from ${s.provider}. ${s.amountText}.`,
  body: [
    `Amount: ${s.amountText}${s.years ? ` for up to ${s.years} years` : ""}.`,
    `Deadline: ${s.deadlineNote}`,
    `Apply via ${s.applyVia}. The matcher checks your profile against this scholarship's rules on its page.`,
  ],
  tool: { href: `/account/scholarships/${s.slug}`, label: "Check if you match" },
  source: { label: s.provider, url: s.officialUrl },
}));

export const SCHOLARSHIPS_COURSE: CourseContent = {
  key: "scholarships",
  accent: "#166534",
  kicker: "Scholarships",
  title: "Find the money you qualify for, and help winning it",
  subtitle:
    "Many eligible students never receive a scholarship. They never hear about it, miss the deadline, or give up on the paperwork. This course covers all three, from matching to renewal.",
  outcomes: [
    "Understand the six types of scholarship and which ones fit your profile",
    "Read a match result: eligible, almost eligible, check needed, or not eligible",
    "Prepare your documents and essays once, and reuse them for every application",
    "Track deadlines and renewals, and spot a scholarship scam before paying anything",
  ],
  modules: [
    {
      id: "start-here",
      title: "Start here",
      summary: "Why scholarships get missed, and how the matcher ranks what it finds.",
      lessons: [
        {
          id: "why-missed",
          title: "Why students miss scholarship money",
          minutes: 4,
          summary: "Discovery, applying, deadlines and renewals are where the money slips away.",
          body: [
            "Most lost scholarship money comes from four gaps: students never hear about a scheme, they give up on the paperwork, they miss a deadline or an institute verification, or they lose a renewal because their marks dropped below a threshold.",
            "The dashboard covers each gap: a profile that finds matches, a document vault for the paperwork, reminders before every deadline, and renewal rules for multi-year schemes.",
          ],
          points: ["Hear about the scheme", "Finish the paperwork", "Meet every deadline", "Renew on time"],
          tool: { href: "/account/scholarships/dashboard", label: "Open your money you can apply for" },
        },
        {
          id: "how-matching-works",
          title: "How the matcher reads a scholarship",
          minutes: 6,
          summary: "Each scheme is checked against your profile, and the results are ranked by value, urgency and effort.",
          body: [
            "Eligible means every rule passes, and the amount and deadline are shown. Almost eligible means one rule that can change fails, for example a marks threshold you are close to. Check needed means your profile is missing a detail the scheme asks about. Not eligible is hidden by default, with the reasons available if you want to see them.",
            "Matches are ranked by a simple score: the yearly amount times the years, urgency based on days to this year's closing date, and effort, where a test or interview counts for more than documents alone. Anything closing within seven days is shown first under Apply this week.",
          ],
          points: ["Eligible: all rules pass", "Almost eligible: one changeable rule fails", "Check needed: add the missing detail", "Ranked by value, urgency and effort"],
          tool: { href: "/account/scholarships/dashboard", label: "Check your matches" },
        },
      ],
    },
    {
      id: "types",
      title: "Types of scholarships",
      summary: "Six types, and why you match some schemes and not others.",
      lessons: [
        {
          id: "merit-means",
          title: "Merit, means and merit-cum-means",
          minutes: 7,
          summary: "Merit looks at marks. Means looks at family income. Merit-cum-means looks at both.",
          body: [
            "Merit scholarships reward marks or ranks, such as central sector schemes that favour top performers in board or entrance exams. Means-based scholarships look at family income, usually with a marks minimum. Merit-cum-means schemes need both good marks and limited income.",
            "Typical values from the plan: merit schemes roughly ₹12,000 to ₹80,000 a year, means-based schemes roughly ₹12,000 to ₹20,000 a year, and merit-cum-means awards roughly ₹50,000 to ₹2 lakh or more. Amounts change each cycle, so check the current figure on the scheme's own page.",
          ],
          points: ["Merit: marks or ranks", "Means: family income band", "Merit-cum-means: both", "Amounts vary, so check the current notice"],
        },
        {
          id: "category-group-abroad",
          title: "Category, group-specific and study-abroad schemes",
          minutes: 7,
          summary: "Category schemes for SC, ST, OBC, minority and disability, group schemes, and funding for study abroad.",
          body: [
            "Category-based schemes support students from SC, ST, OBC, minority or disability groups, usually within income limits. Group-specific schemes support, for example, girls, students from certain states, or students in specific courses.",
            "Study-abroad scholarships such as Chevening, Fulbright-Nehru and Inlaks usually need a graduate degree, and many ask for work experience, leadership or a clear field of study. They are covered in the Study Abroad section.",
          ],
          points: ["Category: SC, ST, OBC, minority, disability", "Group-specific: girls, states, courses", "Study abroad: graduates, often with work experience"],
        },
      ],
    },
    {
      id: "listing",
      title: "Scholarship listing",
      summary: "Each scholarship with its amount, deadline note, provider and how to apply.",
      lessons: listingLessons,
    },
    {
      id: "applying",
      title: "Applying: documents and essays",
      summary: "Prepare the same documents once, then reuse them for every application.",
      lessons: [
        {
          id: "document-vault",
          title: "Documents you need once",
          minutes: 6,
          summary: "Most applications ask for the same eight to ten documents. Keep current, clear copies.",
          body: [
            "Aadhaar: the name must match your marksheets exactly, so fix mismatches early. Income certificate: it must be for the current year, because many applications fail on an old one. Caste, community or disability certificate: check validity dates, since some states need a fresh one.",
            "Domicile certificate is needed for state schemes. Keep clear scans of your class 10, class 12 and semester marksheets. Admission proof or bonafide certificate must be for the current academic year. Some schemes reimburse only fees you have actually paid, so keep the fee receipt. Use a bank passbook in your own name, linked to Aadhaar for direct benefit transfer.",
          ],
          points: [
            "Name on Aadhaar matches marksheets",
            "Income certificate for the current year",
            "Check certificate validity dates",
            "Bank passbook in your own name, linked to Aadhaar",
          ],
          tool: { href: "/account/scholarships/vault", label: "Open the document vault" },
        },
        {
          id: "essays",
          title: "Essays: write your own words",
          minutes: 5,
          summary: "Templates and feedback help you structure an essay. The words must be yours.",
          body: [
            "Common prompts ask why you need the scholarship, what your goals are, or a challenge you overcame. A good essay is specific, honest, shows the impact you have had or want to have, and stays within the word limit.",
            "AI-written or copied essays can lead to rejection. The essay helper gives feedback on clarity and structure, but it does not write the essay for you.",
          ],
          points: ["Be specific and honest", "Show the impact", "Stay within the word limit", "Use your own words"],
          tool: { href: "/account/scholarships/essay", label: "Open the essay helper" },
        },
        {
          id: "nsp-2026",
          title: "The National Scholarship Portal in 2026-27",
          minutes: 5,
          summary: "One registration, one merit-based scheme plus any welfare schemes, and two verification steps.",
          body: [
            "Every student needs a One Time Registration (OTR) number before applying on NSP. It is a 14-digit number generated from your Aadhaar or Aadhaar enrolment ID, and it lasts for your whole academic career. The NSP OTR app is on the Google Play Store.",
            "From AY 2026-27, you may apply for one merit-based scheme and one or more welfare-based schemes. Most 2026-27 schemes opened on 1 June 2026 and close on 31 October 2026. Your institute must verify your form by 15 November, and district or state officers by 30 November.",
            "NSP services are also available at Common Service Centres for a fixed total charge of ₹30. Never pay anyone else to apply for you.",
          ],
          points: ["Get your OTR first", "One merit-based scheme plus any welfare schemes", "Apply by 31 October 2026", "Institute verification by 15 November"],
          tool: { href: "/account/scholarships/calendar", label: "See every NSP date" },
          source: { label: "National Scholarship Portal", url: "https://scholarships.gov.in/" },
        },
        {
          id: "institute-verification",
          title: "Institute verification: the step students miss",
          minutes: 5,
          summary: "Many National Scholarship Portal applications need your institute to verify them. Missing this loses the award.",
          body: [
            "Many applications on the National Scholarship Portal must be verified by your institute before a deadline. A school or college coordinator can see which students have pending verifications.",
            "Once you submit, save a screenshot of the confirmation. Ask your institute the same week you apply, not the week before the deadline.",
          ],
          points: ["Ask your institute the week you apply", "Save the submission screenshot", "Track the verification deadline"],
          tool: { href: "/account/scholarships/applications", label: "Open your applications" },
        },
      ],
    },
    {
      id: "deadlines-renewals",
      title: "Deadlines, renewals and payments",
      summary: "The calendar, the renewal rules, and the 'has my money arrived?' check.",
      lessons: [
        {
          id: "deadline-reminders",
          title: "Deadlines and reminders",
          minutes: 4,
          summary: "Scholarship deadlines cluster between July and November in India. Reminders help.",
          body: [
            "The deadline calendar shows each scholarship's opening date, last date, and the college and state verification deadlines for this cycle. Official dates come from the portal; dates marked reported come from news coverage of the launch.",
            "Add the dates to your own calendar with one tap: the file sets reminders 14, 7 and 2 days before each last date. The dashboard also emails you if you visit it 14, 7 or 2 days before a matched scholarship closes, and My applications warns you when an institute verification is still pending.",
          ],
          points: ["Opening, closing and verification dates", "Calendar reminders at 14, 7 and 2 days", "Pending verification warnings"],
          tool: { href: "/account/scholarships/calendar", label: "Open the deadline calendar" },
        },
        {
          id: "renewals",
          title: "Renewals: the money students quietly lose",
          minutes: 5,
          summary: "Many multi-year scholarships stop if you miss a renewal or your marks drop below a threshold.",
          body: [
            "Multi-year scholarships store their renewal rules. Some need a minimum percentage and a minimum attendance. Others need a minimum CGPA and an annual report. Missing the renewal form, or dropping below the threshold, can end the payments.",
            "Watch your latest marks against the threshold during the year, not only at renewal time.",
          ],
          points: ["Know the renewal rule", "Watch marks against the threshold", "Renew before the window closes"],
          tool: { href: "/account/scholarships/won", label: "Open money won and renewals" },
        },
        {
          id: "money-arrived",
          title: "Has your money arrived?",
          minutes: 5,
          summary: "Payments fail for a few common reasons. Check them before you assume it is lost.",
          body: [
            "For National Scholarship Portal schemes, check the official payment status page. Common reasons for failure are a bank account that is not linked to Aadhaar, a name that does not match, or an account that is closed or inactive.",
            "If the money has not arrived after the expected date, check the status on PFMS Know Your Payment, confirm your account is Aadhaar-seeded, and raise a grievance on NSP if needed. The money won tracker walks you through each step.",
          ],
          points: ["Bank account linked to Aadhaar", "Name matches across documents", "Account active and in your name"],
          tool: { href: "/account/scholarships/won", label: "Open money won and renewals" },
        },
      ],
    },
    {
      id: "safety",
      title: "Scholarship scams and safety",
      summary: "Genuine scholarships never ask you to pay to receive money.",
      lessons: [
        {
          id: "scholarship-scams",
          title: "Scams that target scholarship families",
          minutes: 6,
          summary: "Fee demands, fake government look-alike sites, agents who guarantee awards, and WhatsApp forwards.",
          body: [
            "Watch for calls or messages that say you have won a scholarship but must pay a processing fee or tax to release it. Watch for look-alike NSP or government websites and apps that ask for Aadhaar, bank details, OTPs or UPI PINs.",
            "Agents who guarantee a scholarship or fill forms for a fee can put your eligibility at risk, sometimes with false documents. Be cautious with WhatsApp forwards of fake schemes, and never share your bank account or ATM card to 'deposit' a scholarship.",
          ],
          points: [
            "No genuine scholarship asks for a fee to release money",
            "Never share OTPs, UPI PINs or bank passwords",
            "Ignore guarantees from agents who fill forms for a fee",
            "Check every link against the official domain",
          ],
          tool: { href: "/account/scholarships/safety", label: "Read the safety page" },
        },
        {
          id: "report-scam",
          title: "What to do if you were scammed",
          minutes: 3,
          summary: "Call 1930 right away, then report at cybercrime.gov.in.",
          body: [
            "If you paid someone or shared your bank details, call the national cyber fraud helpline on 1930 right away. Then report the incident at cybercrime.gov.in and tell your bank.",
          ],
          points: ["Call 1930 right away", "Report at cybercrime.gov.in", "Tell your bank"],
          source: { label: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/" },
        },
      ],
    },
  ],
};
