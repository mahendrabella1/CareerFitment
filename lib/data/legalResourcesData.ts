/**
 * Legal Resources Database
 * 20+ topics on student rights, safety, and legal awareness
 *
 * Sources:
 * - NCERT Free Resources
 * - Ministry of Law & Justice
 * - Child protection agencies
 * - Government awareness programs
 * - Official legal resources
 *
 * Updated: August 2026
 */

export interface LegalResource {
  id: string;
  title: string;
  category:
    | "student-rights"
    | "safety"
    | "labor"
    | "cyber"
    | "relationships"
    | "protection";
  description: string;
  keyPoints: string[];
  relevantActs?: string[];
  helplineNumber?: string;
  resources: {
    title: string;
    type: "article" | "video" | "official" | "guide";
    provider: string;
    url: string;
  }[];
  relevantForClass: number[];
  source: string;
  lastUpdated: Date;
}

export const LEGAL_RESOURCES: LegalResource[] = [
  // STUDENT RIGHTS & EDUCATION
  {
    id: "legal_001",
    title: "Your Rights as a Student",
    category: "student-rights",
    description:
      "Understand your fundamental rights as a student in schools and educational institutions.",
    keyPoints: [
      "Right to education (RTE Act 2009)",
      "Non-discrimination in admissions",
      "Safe and healthy school environment",
      "Protection from corporal punishment",
      "Fair evaluation and assessment",
      "Right to information and transparency",
      "Freedom of expression within limits",
    ],
    relevantActs: ["Right to Free and Compulsory Education Act, 2009", "IPC"],
    resources: [
      {
        title: "RTE Act: Student Guide",
        type: "article",
        provider: "NCERT",
        url: "https://www.ncert.nic.in/",
      },
      {
        title: "Student Rights Handbook",
        type: "guide",
        provider: "Ministry of Education",
        url: "https://www.education.gov.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_002",
    title: "Your Responsibilities as a Student",
    category: "student-rights",
    description:
      "Understand the duties and responsibilities expected of every student.",
    keyPoints: [
      "Respect for teachers and school authority",
      "Following school rules and discipline",
      "Regular attendance and punctuality",
      "Academic honesty and no cheating",
      "Respect for peers and diversity",
      "Care for school property",
      "Reporting bullying and wrongdoing",
    ],
    relevantActs: ["School Act, State Education Rules"],
    resources: [
      {
        title: "Student Code of Conduct",
        type: "guide",
        provider: "State Education Department",
        url: "https://education.gov.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_003",
    title: "Admission & Scholarship Rights",
    category: "student-rights",
    description:
      "Know your rights regarding fair admissions, merit-based selection, and scholarship access.",
    keyPoints: [
      "Merit-based admission process",
      "Non-discrimination on caste/religion/gender",
      "Scholarship eligibility and grievance redressal",
      "Right to information on selection criteria",
      "Reservation policies and compliance",
      "Fee waiver provisions",
      "Equal access to sports and activities",
    ],
    relevantActs: ["RTE Act", "Scheduled Castes/Tribes Acts"],
    resources: [
      {
        title: "Scholarship & Admission Guide",
        type: "guide",
        provider: "Ministry of Education",
        url: "https://scholarships.gov.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // SAFETY & PROTECTION
  {
    id: "legal_004",
    title: "Protection from Harassment & Bullying",
    category: "safety",
    description:
      "Know how to identify, report, and protect yourself from harassment and bullying.",
    keyPoints: [
      "What constitutes bullying and harassment",
      "Physical, verbal, and cyber bullying",
      "Sexual harassment: definition and forms",
      "Reporting procedures in schools",
      "Anti-bullying committees and grievance cells",
      "Your right to a safe environment",
      "Witness protection during complaints",
    ],
    relevantActs: [
      "IPC Sections 294, 509",
      "Sexual Harassment of Women at Workplace Act",
    ],
    resources: [
      {
        title: "Bullying: Know Your Rights",
        type: "article",
        provider: "NCERT",
        url: "https://www.ncert.nic.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_005",
    title: "Protection of Women & Girls: POCSO & Anti-Harassment",
    category: "protection",
    description:
      "Understand laws protecting girls and women from sexual abuse and exploitation.",
    keyPoints: [
      "POCSO Act: Crimes against children",
      "Sexual assault and rape laws",
      "Child sexual abuse material",
      "Grooming and online exploitation",
      "Consent and age of consent (18 years)",
      "Reporting without fear of blame",
      "Medical and legal support available",
      "Anonymity and privacy protection",
    ],
    relevantActs: ["Protection of Children from Sexual Offences (POCSO) Act"],
    helplineNumber: "1098",
    resources: [
      {
        title: "POCSO: Know Your Rights",
        type: "article",
        provider: "Ministry of Law & Justice",
        url: "https://www.mlaw.gov.in/",
      },
      {
        title: "Childline India",
        type: "official",
        provider: "Childline Foundation",
        url: "https://www.childlineindia.org/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_006",
    title: "Men's Safety & Responsibilities",
    category: "safety",
    description:
      "Understand consent, healthy relationships, and legal responsibilities.",
    keyPoints: [
      "Consent: What it means and matters",
      "Age of consent is 18 years",
      "Respect in relationships",
      "Emotional abuse and manipulation",
      "Online safety and privacy",
      "False accusations and legal defense",
      "Supporting victims",
      "Prevention and bystander action",
    ],
    relevantActs: ["IPC, Indian Contract Act"],
    resources: [
      {
        title: "Consent & Relationships",
        type: "article",
        provider: "Ministry of Law",
        url: "https://www.mlaw.gov.in/",
      },
    ],
    relevantForClass: [11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_007",
    title: "Online Safety & Cyber Laws",
    category: "cyber",
    description:
      "Learn about cyber crimes, online safety, and your legal protections online.",
    keyPoints: [
      "Cyberstalking and online harassment",
      "Revenge porn and intimate image sharing",
      "Online scams and fraud",
      "Hacking and unauthorized access",
      "Privacy of personal data",
      "Your rights on social media",
      "Reporting cyber crimes",
      "Digital footprint awareness",
    ],
    relevantActs: ["Information Technology Act 2000", "IPC 2023"],
    helplineNumber: "1930",
    resources: [
      {
        title: "Cyber Safety Guide for Youth",
        type: "guide",
        provider: "Ministry of Home Affairs",
        url: "https://www.mha.gov.in/",
      },
      {
        title: "Report Cyber Crime",
        type: "official",
        provider: "Cyber Crime Portal",
        url: "https://cybercrime.gov.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_008",
    title: "Cyber Bullying & Fake News",
    category: "cyber",
    description:
      "Understand and combat cyber bullying, fake news, and harmful online content.",
    keyPoints: [
      "Cyber bullying forms and impact",
      "Screenshot sharing without consent",
      "Blocking and reporting mechanisms",
      "Identifying fake news and misinformation",
      "Fact-checking and verification",
      "Legal action against cyber bullies",
      "Mental health support",
      "Digital citizenship",
    ],
    relevantActs: ["IT Act, IPC"],
    resources: [
      {
        title: "Fight Cyber Bullying",
        type: "guide",
        provider: "NCERT",
        url: "https://www.ncert.nic.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // LABOR & EMPLOYMENT
  {
    id: "legal_009",
    title: "Child Labor Laws: Your Protection",
    category: "labor",
    description:
      "Understand laws protecting children from exploitation through labor.",
    keyPoints: [
      "Minimum age for employment: 15-18 years",
      "Prohibited occupations for children",
      "Working hours and conditions",
      "Safety standards and education rights",
      "Minimum wages applicability",
      "Trafficking and bonded labor",
      "Reporting child labor exploitation",
      "Rights of working children",
    ],
    relevantActs: [
      "Child Labour (Prohibition and Regulation) Act 2016",
      "Bonded Labour System (Abolition) Act",
    ],
    helplineNumber: "1098",
    resources: [
      {
        title: "Child Labor Laws in India",
        type: "article",
        provider: "Ministry of Labour",
        url: "https://labour.gov.in/",
      },
    ],
    relevantForClass: [10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_010",
    title: "First Job: Rights & Responsibilities",
    category: "labor",
    description: "Learn your rights when entering the job market for the first time.",
    keyPoints: [
      "Minimum wages and wage deduction limits",
      "Working hours and overtime rules",
      "Leave entitlements",
      "Safe working conditions",
      "Sexual harassment at workplace",
      "Discrimination protection",
      "Contract reading and terms",
      "Grievance procedures",
    ],
    relevantActs: ["Minimum Wages Act", "IPC", "Labour Code"],
    resources: [
      {
        title: "Employee Rights Guide",
        type: "guide",
        provider: "Ministry of Labour",
        url: "https://labour.gov.in/",
      },
    ],
    relevantForClass: [12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_011",
    title: "Internship Legal Rights",
    category: "labor",
    description:
      "Know your legal protections and rights during internships and apprenticeships.",
    keyPoints: [
      "Internship vs employment distinction",
      "Reasonable tasks and learning focus",
      "Stipend or wages when applicable",
      "Safety and health standards",
      "Sexual harassment policy",
      "Certificate and experience letter",
      "Reporting exploitation",
      "Legal status and protections",
    ],
    relevantActs: ["Apprentices Act", "IPC"],
    resources: [
      {
        title: "Intern Rights",
        type: "guide",
        provider: "Ministry of Labour",
        url: "https://labour.gov.in/",
      },
    ],
    relevantForClass: [11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // RELATIONSHIPS & CONSENT
  {
    id: "legal_012",
    title: "Consent & Healthy Relationships",
    category: "relationships",
    description:
      "Understand what consent means and how to build healthy relationships.",
    keyPoints: [
      "Consent definition: voluntary, informed, reversible",
      "Consent cannot be assumed",
      "Age of consent is 18 years",
      "Coercion and manipulation are NOT consent",
      "Consent in online interactions",
      "Right to say NO anytime",
      "Respecting boundaries",
      "Building healthy relationships",
    ],
    relevantActs: ["IPC Sections on rape and sexual assault"],
    resources: [
      {
        title: "Consent: A Conversation",
        type: "video",
        provider: "Ministry of Health",
        url: "https://www.mohfw.gov.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_013",
    title: "Marriage Laws: Know Before Deciding",
    category: "relationships",
    description:
      "Understand marriage laws, rights, and protections in India.",
    keyPoints: [
      "Minimum age for marriage: 18 (female), 21 (male)",
      "Consent required from both parties",
      "No forced marriages",
      "Registration importance",
      "Rights after marriage",
      "Separation and divorce laws",
      "Custody and maintenance",
      "Protection from domestic violence",
    ],
    relevantActs: [
      "Hindu Marriage Act",
      "Protection of Women from Domestic Violence Act",
      "Muslim Personal Law",
      "Christian Marriage Act",
    ],
    helplineNumber: "181",
    resources: [
      {
        title: "Marriage & Divorce Laws",
        type: "guide",
        provider: "Ministry of Law & Justice",
        url: "https://www.mlaw.gov.in/",
      },
    ],
    relevantForClass: [12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_014",
    title: "LGBTQ+ Rights & Protections",
    category: "relationships",
    description:
      "Know the legal rights and protections for LGBTQ+ individuals in India.",
    keyPoints: [
      "Section 377 decriminalization (2018)",
      "Right to choice of partner",
      "Protection from discrimination",
      "Right to medical care",
      "Online harassment and reporting",
      "Social security benefits",
      "Marriage rights status",
      "Available support resources",
    ],
    relevantActs: ["Transgender Persons (Protection of Rights) Act 2019", "IPC"],
    helplineNumber: "1078",
    resources: [
      {
        title: "LGBTQ+ Rights in India",
        type: "article",
        provider: "Ministry of Law & Justice",
        url: "https://www.mlaw.gov.in/",
      },
    ],
    relevantForClass: [11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  // PROTECTION & RIGHTS
  {
    id: "legal_015",
    title: "Domestic Violence: Protection & Support",
    category: "protection",
    description:
      "Understand domestic violence, protection measures, and support available.",
    keyPoints: [
      "Forms of domestic violence",
      "Physical, emotional, and financial abuse",
      "Protection Order (restraining order)",
      "Right to shelter",
      "Compensation and damages",
      "Criminal action against abuser",
      "Support centers and helplines",
      "Steps to take when in danger",
    ],
    relevantActs: [
      "Protection of Women from Domestic Violence Act 2005",
      "IPC Sections on cruelty",
    ],
    helplineNumber: "181",
    resources: [
      {
        title: "Domestic Violence: Get Help",
        type: "guide",
        provider: "Ministry of Women & Child Development",
        url: "https://wcd.nic.in/",
      },
    ],
    relevantForClass: [11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_016",
    title: "Child Protection & Welfare",
    category: "protection",
    description:
      "Understand laws protecting children's rights, welfare, and safety.",
    keyPoints: [
      "Juvenile Justice System",
      "Protection from abuse and neglect",
      "Right to education and development",
      "Child marriage prevention",
      "Trafficking protection",
      "Custody and adoption laws",
      "Child welfare authorities",
      "Reporting obligations for adults",
    ],
    relevantActs: [
      "Juvenile Justice Act 2015",
      "Protection of Children from Sexual Offences Act",
    ],
    helplineNumber: "1098",
    resources: [
      {
        title: "Child Rights & Protection",
        type: "guide",
        provider: "Ministry of Women & Child Development",
        url: "https://wcd.nic.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_017",
    title: "Right to Privacy & Personal Data",
    category: "student-rights",
    description:
      "Understand your right to privacy and protection of personal data.",
    keyPoints: [
      "Fundamental right to privacy",
      "Personal data protection",
      "Consent for data collection",
      "AADHAR and identity documents",
      "Photo and video recording consent",
      "Social media privacy settings",
      "Data deletion rights",
      "Government access limitations",
    ],
    relevantActs: ["Digital Personal Data Protection Act 2023", "IPC"],
    resources: [
      {
        title: "Privacy Rights Guide",
        type: "guide",
        provider: "Ministry of Electronics & IT",
        url: "https://meity.gov.in/",
      },
    ],
    relevantForClass: [10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_018",
    title: "Consumer Rights: Know Your Protection",
    category: "student-rights",
    description:
      "Understand consumer protection laws and your rights when buying products/services.",
    keyPoints: [
      "Right to quality products and services",
      "Right to information and transparency",
      "Right to safety",
      "Right to choose",
      "Right to be heard and grievance redressal",
      "Right to compensation",
      "Online purchases protection",
      "Consumer complaints procedure",
    ],
    relevantActs: ["Consumer Protection Act 2019"],
    helplineNumber: "1915",
    resources: [
      {
        title: "Consumer Rights Handbook",
        type: "guide",
        provider: "Consumer Commission",
        url: "https://consumeraffairs.nic.in/",
      },
    ],
    relevantForClass: [10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_019",
    title: "Know Your Constitution: Fundamental Rights",
    category: "student-rights",
    description:
      "Understand the fundamental rights guaranteed by the Indian Constitution.",
    keyPoints: [
      "Right to Equality (Article 14-18)",
      "Right to Freedom (Article 19-22)",
      "Right Against Exploitation (Article 23-24)",
      "Right to Freedom of Religion (Article 25-28)",
      "Right to Constitutional Remedies (Article 32)",
      "Directive Principles of State Policy",
      "Fundamental Duties",
      "How to file a PIL (Public Interest Litigation)",
    ],
    relevantActs: ["Indian Constitution"],
    resources: [
      {
        title: "Constitution Simplified for Students",
        type: "guide",
        provider: "NCERT",
        url: "https://www.ncert.nic.in/",
      },
      {
        title: "Watch: Fundamental Rights",
        type: "video",
        provider: "CBSE",
        url: "https://www.cbseboard.ac.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },

  {
    id: "legal_020",
    title: "Disability Rights & Inclusive Education",
    category: "protection",
    description:
      "Know the rights and protections available for students with disabilities.",
    keyPoints: [
      "Right to education without discrimination",
      "Accessible infrastructure requirement",
      "Reasonable accommodation",
      "Equal opportunities in exams",
      "Reservation in education and employment",
      "Scholarship schemes",
      "Anti-discrimination protection",
      "Grievance redressal mechanisms",
    ],
    relevantActs: [
      "Rights of Persons with Disabilities Act 2016",
      "RTE Act",
    ],
    resources: [
      {
        title: "Disability Rights Guide",
        type: "guide",
        provider: "Ministry of Social Justice",
        url: "https://socialjustice.gov.in/",
      },
    ],
    relevantForClass: [9, 10, 11, 12],
    source: "government",
    lastUpdated: new Date("2026-08-01"),
  },
];

export const LEGAL_STATS = {
  totalResources: LEGAL_RESOURCES.length,
  categories: {
    "student-rights": LEGAL_RESOURCES.filter(
      (r) => r.category === "student-rights"
    ).length,
    safety: LEGAL_RESOURCES.filter((r) => r.category === "safety").length,
    labor: LEGAL_RESOURCES.filter((r) => r.category === "labor").length,
    cyber: LEGAL_RESOURCES.filter((r) => r.category === "cyber").length,
    relationships: LEGAL_RESOURCES.filter(
      (r) => r.category === "relationships"
    ).length,
    protection: LEGAL_RESOURCES.filter((r) => r.category === "protection")
      .length,
  },
  lastUpdated: "August 2026",
  emergencyHotlines: {
    childline: "1098",
    policySOS: "100",
    cyberCrime: "1930",
    womenHelpline: "181",
    mentalHealth: "9152987821",
  },
};

export function getLegalResources(): LegalResource[] {
  return LEGAL_RESOURCES;
}

export function getResourcesByCategory(
  category: LegalResource["category"]
): LegalResource[] {
  return LEGAL_RESOURCES.filter((r) => r.category === category);
}

export function searchLegalResources(query: string): LegalResource[] {
  const q = query.toLowerCase();
  return LEGAL_RESOURCES.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.keyPoints.some((k) => k.toLowerCase().includes(q)) ||
      r.relevantActs?.some((a) => a.toLowerCase().includes(q))
  );
}

export function getResourcesForClass(classNumber: number): LegalResource[] {
  return LEGAL_RESOURCES.filter((r) =>
    r.relevantForClass.includes(classNumber)
  );
}
