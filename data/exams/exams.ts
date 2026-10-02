/**
 * Phase 1 exam directory - 15 exams, per the Entrance Exams & Eligibility
 * spec's own rollout list. Eligibility RULES are real, stable, well-known
 * facts (age/qualification/subject/marks criteria rarely change year to
 * year). CYCLE DATES are only given as confirmed where the source spec
 * itself cited real, dated current-cycle info (JEE Main, NEET-UG, CLAT,
 * GATE, CAT) - checked 2 October 2026 per the spec. For exams without that
 * sourced info, `cycle.tentative` is true and `events` is deliberately
 * empty rather than inventing plausible-looking dates - the UI must show
 * "check the official site" instead of a fabricated date.
 *
 * This is a static data file, not a CMS - keeping it current going forward
 * is a file edit (update `checkedAt`/`sourceUrl`/events), the same
 * discipline the spec itself asks for, just without an admin panel.
 */
import type { Rule } from "@/lib/exams/eligibility";

export interface ExamEvent {
  kind: "notification" | "regOpen" | "regClose" | "admitCard" | "exam" | "answerKey" | "result" | "counselling";
  label: string;
  date: string; // ISO date
}

export interface ExamDef {
  slug: string;
  name: string;
  body: string; // conducting body
  officialUrl: string;
  stage: "school" | "after12" | "college" | "professional";
  fields: string[];
  cycle: {
    year: string;
    rules: Rule[];
    sourceUrl: string;
    checkedAt: string; // ISO date this entry was last checked against the source
    tentative: boolean;
  };
  events: ExamEvent[];
}

export const EXAMS: ExamDef[] = [
  {
    slug: "jee-main",
    name: "JEE Main",
    body: "NTA",
    officialUrl: "https://jeemain.nta.nic.in/",
    stage: "after12",
    fields: ["engineering"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "subjects", allOf: ["Physics", "Mathematics"] },
        { type: "note", text: "No age limit. Up to 3 consecutive years of attempts counted from your class 12 year. The 75% class 12 marks criterion applies to NIT/IIT/GFTI admission, not to sitting the exam itself." },
      ],
      sourceUrl: "https://jeemain.nta.nic.in/",
      checkedAt: "2026-10-02",
      tentative: false,
    },
    events: [
      { kind: "exam", label: "Session 1 (usually)", date: "2027-01-24" },
      { kind: "exam", label: "Session 2 (usually)", date: "2027-04-02" },
    ],
  },
  {
    slug: "jee-advanced",
    name: "JEE Advanced",
    body: "An IIT (rotates each year)",
    officialUrl: "https://jeeadv.ac.in/",
    stage: "after12",
    fields: ["engineering"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "Open only to candidates who qualify JEE Main and rank within the top bracket set that year. Maximum 2 attempts, in 2 consecutive years, after passing class 12." },
      ],
      sourceUrl: "https://jeeadv.ac.in/",
      checkedAt: "2026-10-02",
      tentative: true,
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
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "minAge", years: 17, onDate: "2027-12-31" },
        { type: "subjects", allOf: ["Physics", "Chemistry", "Biology"] },
        { type: "note", text: "Biology or Biotechnology both count for the subject requirement. No cap on number of attempts under current rules. 2027 information bulletin was still awaited as of the last check - confirm on the official site." },
      ],
      sourceUrl: "https://neet.nta.nic.in/",
      checkedAt: "2026-10-02",
      tentative: true,
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
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "No minimum class 12 percentage is required to appear - each participating university sets its own cut-offs separately for admission." },
      ],
      sourceUrl: "https://cuet.nta.nic.in/",
      checkedAt: "2026-10-02",
      tentative: true,
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
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "minMarks", field: "class12Pct", value: 45, relax: { SC: 40, ST: 40, PwBD: 40 } },
        { type: "note", text: "No upper age limit." },
      ],
      sourceUrl: "https://consortiumofnlus.ac.in/",
      checkedAt: "2026-10-02",
      tentative: false,
    },
    events: [
      { kind: "regClose", label: "Applications close", date: "2026-10-31" },
      { kind: "exam", label: "Exam day", date: "2026-12-06" },
    ],
  },
  {
    slug: "nda",
    name: "NDA & NA",
    body: "UPSC",
    officialUrl: "https://upsc.gov.in/",
    stage: "after12",
    fields: ["defence"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "Unmarried candidates only. Age window is set per notification, typically around 16½-19½ years. PCM (Physics, Chemistry, Mathematics) is required for Air Force and Navy entries; some Army entries accept other streams - check the exact notification for your target wing." },
      ],
      sourceUrl: "https://upsc.gov.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "nata",
    name: "NATA",
    body: "Council of Architecture",
    officialUrl: "https://www.nata.in/",
    stage: "after12",
    fields: ["architecture", "design"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "subjects", allOf: ["Mathematics"] },
        { type: "minMarks", field: "class12Pct", value: 50 },
        { type: "note", text: "A 10+3 diploma with Mathematics as a subject is also accepted in place of class 12." },
      ],
      sourceUrl: "https://www.nata.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "nift",
    name: "NIFT (UG)",
    body: "National Institute of Fashion Technology",
    officialUrl: "https://www.nift.ac.in/",
    stage: "after12",
    fields: ["design", "fashion"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "No specific subject requirement. Age-limit rules have changed across recent cycles - confirm the current notification before relying on any specific figure." },
      ],
      sourceUrl: "https://www.nift.ac.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "nid-dat",
    name: "NID DAT",
    body: "National Institute of Design",
    officialUrl: "https://admissions.nid.edu/",
    stage: "after12",
    fields: ["design"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "note", text: "Separate tracks exist for the UG Bachelor of Design (DAT Prelims + Mains) programme - confirm which track matches your stage before applying." },
      ],
      sourceUrl: "https://admissions.nid.edu/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "ipmat",
    name: "IPMAT",
    body: "IIM Indore / Rohtak / Ranchi / Bodh Gaya",
    officialUrl: "https://www.iimidr.ac.in/",
    stage: "after12",
    fields: ["management"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "class12", allowAppearing: true },
        { type: "minMarks", field: "class12Pct", value: 60 },
        { type: "note", text: "The exact minimum percentage varies slightly between the participating IIMs - verify against the specific IIM's own notification." },
      ],
      sourceUrl: "https://www.iimidr.ac.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "gate",
    name: "GATE",
    body: "IIT Madras (for 2027)",
    officialUrl: "https://gate2027.iitm.ac.in/",
    stage: "college",
    fields: ["engineering", "science", "commerce", "arts"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "note", text: "Open to final-year undergraduates as well as graduates, across engineering, science, commerce, arts and more. A new Robotics paper was added for 2027." },
      ],
      sourceUrl: "https://gate2027.iitm.ac.in/",
      checkedAt: "2026-10-02",
      tentative: false,
    },
    events: [
      { kind: "regClose", label: "Late registration closes", date: "2026-10-05" },
      { kind: "exam", label: "Exam window begins", date: "2027-02-06" },
      { kind: "exam", label: "Exam window ends", date: "2027-02-21" },
    ],
  },
  {
    slug: "cat",
    name: "CAT",
    body: "IIM Indore (for 2026)",
    officialUrl: "https://iimcat.ac.in/",
    stage: "college",
    fields: ["management"],
    cycle: {
      year: "2026",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "minMarks", field: "gradPct", value: 50, relax: { SC: 45, ST: 45, PwBD: 45 } },
      ],
      sourceUrl: "https://iimcat.ac.in/",
      checkedAt: "2026-10-02",
      tentative: false,
    },
    events: [
      { kind: "exam", label: "Exam day", date: "2026-11-29" },
      { kind: "result", label: "Result (expected)", date: "2027-01-05" },
    ],
  },
  {
    slug: "upsc-cse",
    name: "UPSC Civil Services",
    body: "UPSC",
    officialUrl: "https://upsc.gov.in/",
    stage: "professional",
    fields: ["government", "administration"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "ageRange", min: 21, max: 32, onDate: "2027-08-01", relaxYears: { OBC: 3, SC: 5, ST: 5 } },
        { type: "note", text: "Attempt limits: 6 for General/EWS, 9 for OBC, no cap (within the age limit) for SC/ST. Final-year students can sit Prelims, but must hold the degree by the time of Mains." },
      ],
      sourceUrl: "https://upsc.gov.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "ssc-cgl",
    name: "SSC CGL",
    body: "Staff Selection Commission",
    officialUrl: "https://ssc.gov.in/",
    stage: "professional",
    fields: ["government"],
    cycle: {
      year: "2027",
      rules: [
        { type: "qualification", level: "graduate", allowAppearing: true },
        { type: "ageRange", min: 18, max: 32, onDate: "2027-08-01", relaxYears: { OBC: 3, SC: 5, ST: 5 } },
        { type: "note", text: "The exact age limit varies by post within the same exam - check your target post's specific criteria in the notification." },
      ],
      sourceUrl: "https://ssc.gov.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
  {
    slug: "nmms",
    name: "NMMS",
    body: "State education departments (central scheme)",
    officialUrl: "https://scholarships.gov.in/",
    stage: "school",
    fields: ["scholarship"],
    cycle: {
      year: "2027",
      rules: [
        { type: "note", text: "For students in class 8 only, studying in a government, government-aided or local-body school. Family income must be below the limit set by your state (commonly around ₹3.5 lakh/year), with a minimum class 7 mark cut-off (commonly 55%, 50% for SC/ST/PwD) - exact figures vary by state, confirm with your state's scholarship portal." },
      ],
      sourceUrl: "https://scholarships.gov.in/",
      checkedAt: "2026-10-02",
      tentative: true,
    },
    events: [],
  },
];

export function examBySlug(slug: string): ExamDef | undefined {
  return EXAMS.find((e) => e.slug === slug);
}
