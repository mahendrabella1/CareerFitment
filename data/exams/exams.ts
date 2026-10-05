/**
 * Exam directory - 29 exams across five life stages, re-checked on
 * 2026-10-03. Dates come from official calendars and notices where they
 * have been published:
 *   - NTA examination calendar to March 2027 (public notice, 16 Sept 2026),
 *     which NTA itself calls tentative
 *   - UPSC annual calendar 2027 (released 20 May 2026)
 *   - IBPS calendar 2026-27, CLAT and AILET notices, GATE 2027 brochure,
 *     XAT, NID, UCEED, Navodaya and IAPT NSE notices
 * Every event carries `tentative` when the source calls it tentative or it
 * was reported rather than read on the official site. Where nothing has been
 * announced, `events` stays empty and `cycle.expected` says what to watch
 * for - the UI never shows an invented date as confirmed.
 */
import type { Rule } from "@/lib/exams/eligibility";

export interface ExamEvent {
  kind: "notification" | "regOpen" | "regClose" | "admitCard" | "exam" | "answerKey" | "result" | "counselling";
  label: string;
  date: string; // ISO date (start of a window)
  endDate?: string; // ISO date, for windows such as a multi-day exam
  tentative?: boolean;
}

export interface ExamDef {
  slug: string;
  name: string;
  body: string; // conducting body
  officialUrl: string;
  stage: "school" | "after12" | "college" | "professional";
  fields: string[];
  /** Short pattern summary shown on the exam page. */
  pattern?: string;
  cycle: {
    year: string;
    rules: Rule[];
    sourceUrl: string;
    checkedAt: string; // ISO date this entry was last checked against the source
    tentative: boolean;
    /** What is expected when no date has been announced yet. */
    expected?: string;
  };
  events: ExamEvent[];
}

const CHECKED = "2026-10-03";
const NTA_CALENDAR = "https://news.careers360.com/nta-exam-calendar-2026-27-out-jee-main-ugc-net-cmat-cuet-pg-nittt-nift-csir-net-aissee-exam-dates-schedule-nta-ac-in/amp";
const UPSC_CALENDAR = "https://deccanherald.com/education/upsc-cse-prelims-2027-on-may-23-mains-begins-aug-20-check-full-calendar-4015277";

export const EXAMS: ExamDef[] = [
  // ---------------------------------------------------------------- School stage
  {
    slug: "jnvst",
    name: "JNVST (Navodaya Class 6)",
    body: "Navodaya Vidyalaya Samiti",
    officialUrl: "https://navodaya.gov.in/",
    stage: "school",
    fields: ["school"],
    pattern: "2-hour objective test (mental ability, arithmetic and language). No application fee.",
    cycle: {
      year: "2027",
      rules: [
        { type: "level", oneOf: ["class5"], label: "students in Class 5 in 2026-27" },
        { type: "bornBetween", from: "2015-05-01", to: "2017-07-31" },
        { type: "note", text: "You apply in your own district, and most seats are for rural students. Registration for the 2027 test closed on 10 August 2026." },
      ],
      sourceUrl: "https://news.careers360.com/jnvst-notiification-2027-out-class-6-navodaya-admission-2027-exam-date-eligibility-selection-process",
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "regClose", label: "Registration closed", date: "2026-08-10" },
      { kind: "exam", label: "Selection test (11:30 am to 1:30 pm)", date: "2026-11-28" },
    ],
  },
  {
    slug: "aissee",
    name: "AISSEE (Sainik School Class 6 and 9)",
    body: "NTA",
    officialUrl: "https://exams.nta.nic.in/sainik-school-society/",
    stage: "school",
    fields: ["school", "defence"],
    pattern: "Offline OMR test. Class 6: 125 questions, 300 marks, 150 minutes. Class 9: 150 questions, 400 marks, 180 minutes. No negative marking.",
    cycle: {
      year: "2027",
      rules: [
        { type: "level", oneOf: ["class5", "class8"], label: "Class 5 students (for Class 6 entry) and Class 8 students (for Class 9 entry)" },
        { type: "note", text: "For Class 6 entry you must be 10 to 12 on 31 March 2027; for Class 9, 13 to 15. The 2027 bulletin with exact birth-date ranges is expected around October 2026." },
      ],
      sourceUrl: NTA_CALENDAR,
      checkedAt: CHECKED,
      tentative: true,
      expected: "Registration is expected to open around October 2026.",
    },
    events: [{ kind: "exam", label: "Exam (NTA calendar)", date: "2027-01-31", tentative: true }],
  },
  {
    slug: "nmms",
    name: "NMMS",
    body: "State education departments (central scheme)",
    officialUrl: "https://scholarships.gov.in/",
    stage: "school",
    fields: ["scholarship"],
    pattern: "State-level test: Mental Ability Test and Scholastic Aptitude Test.",
    cycle: {
      year: "2026-27",
      rules: [
        { type: "level", oneOf: ["class8"], label: "Class 8 students in government, government-aided and local body schools" },
        { type: "note", text: "Family income up to ₹3.5 lakh a year and at least 55% in Class 7 (50% for SC/ST). Winners get ₹12,000 a year from Class 9 to 12. Your state sets the test date." },
      ],
      sourceUrl: "https://dsel.education.gov.in/scheme/nmmss",
      checkedAt: CHECKED,
      tentative: true,
      expected: "Each state announces its own test date, usually between November and January.",
    },
    events: [],
  },
  {
    slug: "nse-olympiads",
    name: "National Standard Examinations (NSEP, NSEC, NSEB, NSEA, NSEJS)",
    body: "Indian Association of Physics Teachers (IAPT), first stage of the Olympiad programme",
    officialUrl: "https://iapt.org.in/",
    stage: "school",
    fields: ["science", "olympiad"],
    pattern: "Objective papers in physics, chemistry, biology, astronomy and junior science. The first stage of the national Olympiad programme run with HBCSE.",
    cycle: {
      year: "2026-27",
      rules: [
        { type: "level", oneOf: ["class8", "class9", "class10", "class11", "class12"], label: "school students (NSEJS for Class 10 and below; the others for Class 12 and below)" },
        { type: "note", text: "Students enrol through a registered school or centre. Enrolment for 2026 ran from 21 August to 14 September 2026." },
      ],
      sourceUrl: "https://iapt.org.in/wp-content/uploads/NSE-2026-Student-Brochure.pdf",
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "regClose", label: "Student enrolment closed", date: "2026-09-14" },
      { kind: "exam", label: "NSEA (astronomy)", date: "2026-11-21" },
      { kind: "exam", label: "NSEP, NSEC, NSEB and NSEJS", date: "2026-11-22" },
    ],
  },

  // ---------------------------------------------------------------- After Class 12
  {
    slug: "jee-main",
    name: "JEE Main",
    body: "NTA",
    officialUrl: "https://jeemain.nta.nic.in/",
    stage: "after12",
    fields: ["engineering"],
    pattern: "75 questions (25 each in physics, chemistry and maths; 20 MCQs and 5 numerical in each), 300 marks, 3 hours. +4 for correct, -1 for wrong.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "subjects", allOf: ["Physics", "Mathematics"] },
        { type: "note", text: "No age limit. You can attempt in up to 3 consecutive years from your Class 12 year. The 75% Class 12 rule applies to NIT, IIIT and GFTI admission, not to sitting the exam." },
      ],
      sourceUrl: NTA_CALENDAR,
      checkedAt: CHECKED,
      tentative: true,
      expected: "Session 1 registration is expected to open in October 2026; session 2 dates are not yet announced.",
    },
    events: [{ kind: "exam", label: "Session 1 (22-24 and 28-30 Jan; 31 Jan buffer)", date: "2027-01-22", endDate: "2027-01-30", tentative: true }],
  },
  {
    slug: "jee-advanced",
    name: "JEE Advanced",
    body: "IIT Delhi for 2027 (rotates among IITs)",
    officialUrl: "https://jeeadv.ac.in/",
    stage: "after12",
    fields: ["engineering"],
    pattern: "Two compulsory 3-hour papers on the same day.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "subjects", allOf: ["Physics", "Chemistry", "Mathematics"] },
        { type: "note", text: "Only for candidates who qualify in JEE Main and rank within the top bracket set that year. At most 2 attempts, in 2 consecutive years." },
      ],
      sourceUrl: "https://jeeadv.ac.in/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "Usually held in mid-May. The 2027 date had not been announced when checked.",
    },
    events: [],
  },
  {
    slug: "neet-ug",
    name: "NEET-UG",
    body: "NTA",
    officialUrl: "https://neet.nta.nic.in/",
    stage: "after12",
    fields: ["medicine"],
    pattern: "180 questions (physics 45, chemistry 45, biology 90), 720 marks, 3 hours, pen and paper. +4 for correct, -1 for wrong.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "minAge", years: 17, onDate: "2027-12-31" },
        { type: "subjects", allOf: ["Physics", "Chemistry", "Biology"] },
        { type: "note", text: "Biology or biotechnology both count, with English. No limit on attempts under current rules." },
      ],
      sourceUrl: "https://neet.nta.nic.in/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "Usually held on the first Sunday of May. The 2027 bulletin had not been released when checked.",
    },
    events: [],
  },
  {
    slug: "cuet-ug",
    name: "CUET-UG",
    body: "NTA",
    officialUrl: "https://cuet.nta.nic.in/",
    stage: "after12",
    fields: ["general", "arts", "commerce", "science"],
    pattern: "Computer-based. Each test has 50 compulsory questions in 60 minutes. +5 for correct, -1 for wrong.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "No minimum Class 12 percentage to appear; each university sets its own admission criteria." },
      ],
      sourceUrl: "https://cuet.nta.nic.in/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "Registration is usually in January to February and the exam in May. The 2027 notice had not been released when checked.",
    },
    events: [],
  },
  {
    slug: "clat-ug",
    name: "CLAT (UG)",
    body: "Consortium of NLUs",
    officialUrl: "https://consortiumofnlus.ac.in/",
    stage: "after12",
    fields: ["law"],
    pattern: "120 passage-based MCQs in 2 hours, pen and paper: English, current affairs, legal reasoning, logical reasoning and quantitative techniques. +1 for correct, -0.25 for wrong.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "minMarks", field: "class12Pct", value: 45, relax: { SC: 40, ST: 40, PwBD: 40 } },
        { type: "note", text: "No upper age limit." },
      ],
      sourceUrl: "https://consortiumofnlus.ac.in/",
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "regOpen", label: "Registration opened", date: "2026-08-03" },
      { kind: "regClose", label: "Registration closes", date: "2026-10-31" },
      { kind: "exam", label: "Exam (2 pm to 4 pm)", date: "2026-12-06" },
    ],
  },
  {
    slug: "ailet",
    name: "AILET (BA LLB)",
    body: "National Law University Delhi",
    officialUrl: "https://nationallawuniversitydelhi.in/",
    stage: "after12",
    fields: ["law"],
    pattern: "Offline (pen and paper), 2 hours.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "Check the minimum Class 12 marks and reserved-category relaxations in NLU Delhi's AILET 2027 bulletin." },
      ],
      sourceUrl: "https://law.careers360.com/articles/ailet-2027-registration",
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [
      { kind: "regOpen", label: "Registration opened", date: "2026-08-07" },
      { kind: "regClose", label: "Registration closes", date: "2026-11-10", tentative: true },
      { kind: "admitCard", label: "Admit card", date: "2026-11-30", tentative: true },
      { kind: "exam", label: "Exam (2 pm to 4 pm)", date: "2026-12-13", tentative: true },
    ],
  },
  {
    slug: "nda",
    name: "NDA & NA",
    body: "UPSC",
    officialUrl: "https://upsc.gov.in/",
    stage: "after12",
    fields: ["defence"],
    pattern: "Written exam (maths and a general ability test), then an SSB interview.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "Unmarried candidates only. The age window (about 16½ to 19½) is set in each notification. Physics, chemistry and maths in Class 12 are needed for the Air Force, Navy and Naval Academy; the Army wing accepts any stream." },
      ],
      sourceUrl: UPSC_CALENDAR,
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "notification", label: "NDA & NA (I) notification", date: "2026-12-02" },
      { kind: "exam", label: "NDA & NA (I) exam", date: "2027-04-11" },
      { kind: "notification", label: "NDA & NA (II) notification", date: "2027-05-12" },
      { kind: "exam", label: "NDA & NA (II) exam", date: "2027-09-19" },
    ],
  },
  {
    slug: "nata",
    name: "NATA",
    body: "Council of Architecture",
    officialUrl: "https://www.nata.in/",
    stage: "after12",
    fields: ["architecture", "design"],
    pattern: "Aptitude test for B.Arch, held on several dates; your best score counts.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "subjects", allOf: ["Mathematics"] },
        { type: "minMarks", field: "class12Pct", value: 50 },
        { type: "note", text: "A 10+3 diploma with mathematics is also accepted in place of Class 12." },
      ],
      sourceUrl: "https://www.nata.in/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "In 2026 the tests ran from April to June. The 2027 schedule had not been announced when checked.",
    },
    events: [],
  },
  {
    slug: "nift",
    name: "NIFT (UG)",
    body: "NIFT, exam conducted by NTA",
    officialUrl: "https://www.nift.ac.in/",
    stage: "after12",
    fields: ["design", "fashion"],
    pattern: "Stage 1 written test (general ability and, for B.Des, a creative ability test), then a situation test for B.Des.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "No subject requirement for B.Des. Check the age rule in the 2027 notification before applying." },
      ],
      sourceUrl: NTA_CALENDAR,
      checkedAt: CHECKED,
      tentative: true,
      expected: "Applications are expected to open around November to December 2026.",
    },
    events: [{ kind: "exam", label: "Stage 1 exam (NTA calendar)", date: "2027-01-10", tentative: true }],
  },
  {
    slug: "nid-dat",
    name: "NID DAT (B.Des)",
    body: "National Institute of Design",
    officialUrl: "https://admissions.nid.edu/",
    stage: "after12",
    fields: ["design"],
    pattern: "DAT Prelims (pen and paper, may include visual questions), then DAT Mains for shortlisted candidates.",
    cycle: {
      year: "2027",
      rules: [{ type: "qualification", level: "class12", allowAppearing: true }],
      sourceUrl: "https://news.careers360.com/nid-dat-2027-registraion-begins-b-des-m-des-admission-application-last-date-novermber-30-apply-admissions-nid-edu-exam-date",
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [
      { kind: "regOpen", label: "Applications opened", date: "2026-09-10" },
      { kind: "regClose", label: "Applications close", date: "2026-11-30", tentative: true },
      { kind: "exam", label: "DAT Prelims", date: "2026-12-20", tentative: true },
    ],
  },
  {
    slug: "uceed",
    name: "UCEED (B.Des at IITs)",
    body: "IIT Bombay",
    officialUrl: "https://www.uceed.iitb.ac.in/",
    stage: "after12",
    fields: ["design"],
    pattern: "3 hours: Part A computer-based objective questions, Part B pen-and-paper drawing and design aptitude.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "Open to science, commerce and arts students. You need to pass Class 12; there is no minimum percentage." },
      ],
      sourceUrl: "https://design.careers360.com/articles/uceed-2027-exam-date-announced",
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [
      { kind: "regOpen", label: "Applications open", date: "2026-10-01", tentative: true },
      { kind: "regClose", label: "Last date without late fee", date: "2026-10-31", tentative: true },
      { kind: "exam", label: "Exam", date: "2027-01-17" },
    ],
  },
  {
    slug: "ipmat",
    name: "IPMAT (Indore)",
    body: "IIM Indore",
    officialUrl: "https://www.iimidr.ac.in/",
    stage: "after12",
    fields: ["management"],
    pattern: "Quantitative ability and verbal ability, for the 5-year Integrated Programme in Management.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "minMarks", field: "class12Pct", value: 60 },
        { type: "note", text: "IIM Indore also sets an age limit and a Class 10 marks minimum in each notification. IIM Rohtak and others run their own IPMAT." },
      ],
      sourceUrl: "https://www.iimidr.ac.in/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "The notice usually comes in January and the exam in May.",
    },
    events: [],
  },
  {
    slug: "bitsat",
    name: "BITSAT",
    body: "BITS Pilani",
    officialUrl: "https://www.bitsadmission.com/",
    stage: "after12",
    fields: ["engineering", "pharmacy"],
    pattern: "Computer-based test, usually held in two sessions.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "subjects", allOf: ["Physics", "Chemistry"] },
        { type: "note", text: "Engineering needs maths; pharmacy accepts biology. Check the minimum Class 12 marks in physics, chemistry and maths in the 2027 brochure." },
      ],
      sourceUrl: "https://www.bitsadmission.com/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "Registration usually opens in December to January; the tests run around April to June.",
    },
    events: [],
  },

  // ---------------------------------------------------------------- College stage
  {
    slug: "gate",
    name: "GATE",
    body: "IIT Madras (for 2027)",
    officialUrl: "https://gate2027.iitm.ac.in/",
    stage: "college",
    fields: ["engineering", "science", "commerce", "arts"],
    pattern: "65 questions, 100 marks, 3 hours, including 15 marks of General Aptitude. Negative marking only on MCQs.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "note", text: "Open to students in their third year or later of an undergraduate degree, and to graduates, across engineering, science, commerce, arts and more. A new Robotics and Automation paper starts in 2027." },
      ],
      sourceUrl: "https://gate2027.iitm.ac.in/",
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "regClose", label: "Registration without late fee closed", date: "2026-09-27" },
      { kind: "regClose", label: "Last date with late fee", date: "2026-10-05" },
      { kind: "exam", label: "Exam days: 6, 7, 13, 14, 20 and 21 Feb", date: "2027-02-06", endDate: "2027-02-21" },
    ],
  },
  {
    slug: "cat",
    name: "CAT",
    body: "IIM Indore (for 2026)",
    officialUrl: "https://iimcat.ac.in/",
    stage: "college",
    fields: ["management"],
    pattern: "68 questions in 2 hours: VARC 24, DILR 22, QA 22, with 40 minutes per section. +3 for correct, -1 for a wrong MCQ, no negative for typed answers.",
    cycle: {
      year: "2026",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "minMarks", field: "gradPct", value: 50, relax: { SC: 45, ST: 45, PwBD: 45 } },
      ],
      sourceUrl: "https://iimcat.ac.in/",
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "admitCard", label: "Admit card", date: "2026-11-04", tentative: true },
      { kind: "exam", label: "Exam day", date: "2026-11-29" },
    ],
  },
  {
    slug: "xat",
    name: "XAT",
    body: "XLRI Jamshedpur (for XAMI)",
    officialUrl: "https://xatonline.in/",
    stage: "college",
    fields: ["management"],
    pattern: "3 hours (2 pm to 5 pm), accepted by XLRI and over 250 business schools.",
    cycle: {
      year: "2027",
      rules: [{ type: "qualification", level: "graduate", allowAppearing: true }],
      sourceUrl: "https://bschool.careers360.com/articles/xat-2027-exam-date-announced-notification-application-form-process",
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [
      { kind: "regOpen", label: "Registration opened", date: "2026-07-15" },
      { kind: "regClose", label: "Registration closes", date: "2026-12-06", tentative: true },
      { kind: "admitCard", label: "Admit card", date: "2026-12-20", tentative: true },
      { kind: "exam", label: "Exam (2 pm to 5 pm)", date: "2027-01-03" },
    ],
  },
  {
    slug: "cmat",
    name: "CMAT",
    body: "NTA",
    officialUrl: "https://nta.ac.in/",
    stage: "college",
    fields: ["management"],
    pattern: "Computer-based test for admission to AICTE-approved MBA and PGDM programmes.",
    cycle: {
      year: "2027",
      rules: [{ type: "qualification", level: "graduate", allowAppearing: true }],
      sourceUrl: NTA_CALENDAR,
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [{ kind: "exam", label: "Exam (NTA calendar)", date: "2027-02-07", tentative: true }],
  },
  {
    slug: "cuet-pg",
    name: "CUET-PG",
    body: "NTA",
    officialUrl: "https://exams.nta.nic.in/cuet-pg/",
    stage: "college",
    fields: ["general"],
    pattern: "Computer-based, subject-wise papers for postgraduate admission to central and other universities.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "note", text: "Each university sets its own degree and marks requirement for each programme." },
      ],
      sourceUrl: NTA_CALENDAR,
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [{ kind: "exam", label: "Exam window (1-5, 8-20 and 24-25 Mar)", date: "2027-03-01", endDate: "2027-03-25", tentative: true }],
  },
  {
    slug: "ugc-net",
    name: "UGC NET (December 2026)",
    body: "NTA",
    officialUrl: "https://ugcnet.nta.ac.in/",
    stage: "college",
    fields: ["research", "teaching"],
    pattern: "Two computer-based papers: general teaching and research aptitude, then your subject.",
    cycle: {
      year: "Dec 2026",
      rules: [
        { type: "level", oneOf: ["graduate", "working"], label: "postgraduates and final-year PG students" },
        { type: "note", text: "Needs a master's degree (or final-year PG). Junior Research Fellowship has an upper age limit; eligibility for Assistant Professor and PhD admission has none." },
      ],
      sourceUrl: NTA_CALENDAR,
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [{ kind: "exam", label: "Exam window (buffer 20-21 Dec)", date: "2026-12-14", endDate: "2026-12-19", tentative: true }],
  },

  // ---------------------------------------------------------------- Jobs and professionals
  {
    slug: "upsc-cse",
    name: "UPSC Civil Services",
    body: "UPSC",
    officialUrl: "https://upsc.gov.in/",
    stage: "professional",
    fields: ["government", "administration"],
    pattern: "Prelims: General Studies (100 questions, 200 marks) and CSAT (80 questions, qualifying at 33%), with a one-third negative mark. Then Mains and an interview.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "ageRange", min: 21, max: 32, onDate: "2027-08-01", relaxYears: { OBC: 3, SC: 5, ST: 5 } },
        { type: "note", text: "Attempts: 6 for General and EWS, 9 for OBC, unlimited within the age limit for SC and ST. Final-year students can sit Prelims but must hold the degree before Mains." },
      ],
      sourceUrl: UPSC_CALENDAR,
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "notification", label: "Notification", date: "2027-01-13" },
      { kind: "exam", label: "Prelims", date: "2027-05-23" },
      { kind: "exam", label: "Mains begins (5 days)", date: "2027-08-20" },
    ],
  },
  {
    slug: "cds",
    name: "CDS (Combined Defence Services)",
    body: "UPSC",
    officialUrl: "https://upsc.gov.in/",
    stage: "professional",
    fields: ["defence"],
    pattern: "Written exam (English, general knowledge and, for some academies, elementary maths), then SSB interview.",
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "note", text: "Age limits and degree rules differ by academy (IMA, INA, AFA, OTA). Most entries are for unmarried candidates; check the notification for yours." },
      ],
      sourceUrl: UPSC_CALENDAR,
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "notification", label: "CDS (I) notification", date: "2026-12-02" },
      { kind: "exam", label: "CDS (I) exam", date: "2027-04-11" },
      { kind: "notification", label: "CDS (II) notification", date: "2027-05-12" },
      { kind: "exam", label: "CDS (II) exam", date: "2027-09-19" },
    ],
  },
  {
    slug: "ssc-cgl",
    name: "SSC CGL",
    body: "Staff Selection Commission",
    officialUrl: "https://ssc.gov.in/",
    stage: "professional",
    fields: ["government"],
    pattern: "Computer-based Tier 1 and Tier 2.",
    cycle: {
      year: "2026",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "ageRange", min: 18, max: 32, onDate: "2026-08-01", relaxYears: { OBC: 3, SC: 5, ST: 5 } },
        { type: "note", text: "The exact age limit depends on the post. The 2026 cycle (notified 21 May 2026, about 12,256 vacancies) held Tier 1 in August to September." },
      ],
      sourceUrl: "https://ssc.gov.in/",
      checkedAt: CHECKED,
      tentative: true,
      expected: "Tier 2 of the 2026 cycle is expected in December 2026.",
    },
    events: [],
  },
  {
    slug: "ibps-po",
    name: "IBPS PO",
    body: "Institute of Banking Personnel Selection",
    officialUrl: "https://www.ibps.in/",
    stage: "professional",
    fields: ["banking"],
    pattern: "Prelims, Mains and an interview.",
    cycle: {
      year: "2026-27",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: false },
        { type: "note", text: "Usually 20 to 30 years of age, with category relaxations. Check the notification for the exact cut-off date." },
      ],
      sourceUrl: "https://www.ibps.in/",
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [
      { kind: "exam", label: "Prelims", date: "2026-08-22", endDate: "2026-08-23", tentative: true },
      { kind: "exam", label: "Mains", date: "2026-10-04", tentative: true },
    ],
  },
  {
    slug: "ibps-clerk",
    name: "IBPS Clerk",
    body: "Institute of Banking Personnel Selection",
    officialUrl: "https://www.ibps.in/",
    stage: "professional",
    fields: ["banking"],
    pattern: "Prelims and Mains, with a test of the local language.",
    cycle: {
      year: "2026-27",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: false },
        { type: "note", text: "Usually 20 to 28 years of age, with category relaxations." },
      ],
      sourceUrl: "https://www.ibps.in/",
      checkedAt: CHECKED,
      tentative: true,
    },
    events: [
      { kind: "exam", label: "Prelims", date: "2026-10-10", endDate: "2026-10-11", tentative: true },
      { kind: "exam", label: "Mains", date: "2026-12-27", tentative: true },
    ],
  },
  {
    slug: "sat",
    name: "SAT (for study abroad)",
    body: "College Board",
    officialUrl: "https://satsuite.collegeboard.org/sat/dates-deadlines",
    stage: "after12",
    fields: ["abroad"],
    pattern: "Digital test of reading and writing and maths, taken at a test centre.",
    cycle: {
      year: "2026-27",
      rules: [
        { type: "level", oneOf: ["class9", "class10", "class11", "class12", "ug"], label: "school students applying to universities abroad" },
        { type: "note", text: "No eligibility rules. Check which dates centres in your city offer when you register." },
      ],
      sourceUrl: "https://satsuite.collegeboard.org/sat/dates-deadlines",
      checkedAt: CHECKED,
      tentative: false,
    },
    events: [
      { kind: "regClose", label: "Register for 7 Nov test by", date: "2026-10-23" },
      { kind: "exam", label: "SAT", date: "2026-11-07" },
      { kind: "regClose", label: "Register for 5 Dec test by", date: "2026-11-20" },
      { kind: "exam", label: "SAT", date: "2026-12-05" },
      { kind: "exam", label: "SAT", date: "2027-03-06" },
      { kind: "exam", label: "SAT", date: "2027-05-01" },
      { kind: "exam", label: "SAT", date: "2027-06-05" },
    ],
  },
];

export function examBySlug(slug: string): ExamDef | undefined {
  return EXAMS.find((e) => e.slug === slug);
}
