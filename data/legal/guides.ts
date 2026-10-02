/**
 * Phase 1 guides - the 5 the spec's own rollout picks as "urgent and
 * common": online fraud, cyberbullying, safe/unsafe touch, police/arrest
 * rights, public safety. Content is drafted from real, named Indian
 * statutes (cited inline per guide) - but UNREVIEWED by a qualified
 * advocate. GuideView (components/legal/GuideView.tsx) renders a mandatory
 * draft-review banner on every guide; this file holds no "reviewedBy"
 * field because nobody has reviewed it yet - do not add one until a real
 * advocate signs off, per the plan's "Legal guides ship as drafts" note.
 */

export type AgeBand = "SCHOOL" | "COLLEGE" | "WORKING" | "SENIOR";

export interface LegalGuide {
  slug: string;
  number: number;
  area: string;
  title: string;
  ageBands: AgeBand[];
  oneLine: string;
  rights: string[];
  firstSteps: string[];
  evidence: string[];
  helpSlugs: string[];
  toolSlugs: string[];
  legalDetail: { law: string; points: string[] };
  supportNote?: string; // shown for guides touching abuse/harassment/violence
  draftedOn: string;
}

export const LEGAL_GUIDES: LegalGuide[] = [
  {
    slug: "online-fraud",
    number: 7,
    area: "Online and digital life",
    title: "Online fraud and scams",
    ageBands: ["SCHOOL", "COLLEGE", "WORKING", "SENIOR"],
    oneLine: "If you've lost money or shared details in an online scam, report it within hours - banks can sometimes freeze or reverse a transfer if you act fast.",
    rights: [
      "You have the right to report cyber fraud free of cost through the national portal and helpline.",
      "Banks and payment apps are required to have a grievance process for unauthorised transactions.",
      "You are not required to pay any 'fee' to recover scammed money - that itself is almost always a second scam.",
    ],
    firstSteps: [
      "Call 1930 (the cyber fraud helpline) immediately - speed matters, since banks can sometimes freeze funds in transit within the first few hours.",
      "File a detailed complaint at cybercrime.gov.in with screenshots, transaction IDs and the scammer's contact details if you have them.",
      "Tell your bank or payment app to block further transactions and flag the account.",
      "Change passwords on any account you used around the time of the scam.",
    ],
    evidence: ["Screenshots of the chat/call/message", "Transaction ID, amount and time", "The scammer's phone number, UPI ID or account details", "Any app or website link used"],
    helpSlugs: ["cyber-fraud", "legal-aid"],
    toolSlugs: ["police-complaint"],
    legalDetail: {
      law: "Information Technology Act, 2000; reported via the Indian Cyber Crime Coordination Centre's helpline and portal.",
      points: [
        "1930 and cybercrime.gov.in are run by the Indian Cyber Crime Coordination Centre (I4C).",
        "Reporting promptly matters: many banks can only attempt a hold on funds within a short window after a fraudulent transfer.",
        "You can file anonymously for reporting purposes, but a full complaint (for possible recovery) needs your details.",
      ],
    },
    draftedOn: "2026-10-02",
  },
  {
    slug: "cyberbullying",
    number: 6,
    area: "Online and digital life",
    title: "Cyberbullying and online harassment",
    ageBands: ["SCHOOL", "COLLEGE"],
    oneLine: "Online bullying and harassment are real, reportable problems - you don't have to just 'ignore it', and you won't get in trouble for reporting it.",
    rights: [
      "You have the right to use the internet without being threatened, humiliated or harassed.",
      "Platforms are required to have a reporting and takedown process for abusive content.",
      "Sharing or threatening to share someone's photos without consent is a reportable offence, not just 'platform rule-breaking'.",
    ],
    firstSteps: [
      "Don't reply in anger - it rarely helps and can be used against you later.",
      "Take screenshots of everything, including usernames, dates and times, before anything is deleted.",
      "Use the platform's own block and report buttons.",
      "Tell a parent, teacher or trusted adult - and if it's affecting your safety, report it to the National Cyber Crime Reporting Portal or call 1930.",
    ],
    evidence: ["Screenshots with visible usernames, dates and times", "Links or usernames of the accounts involved", "A simple timeline of what happened and when"],
    helpSlugs: ["cyber-fraud", "child", "legal-aid"],
    toolSlugs: ["school-college-complaint", "police-complaint"],
    legalDetail: {
      law: "Information Technology Act, 2000; Bharatiya Nyaya Sanhita, 2023 (replaced the Indian Penal Code from 1 July 2024).",
      points: [
        "Serious or repeated harassment, threats or morphed/non-consensual images can be reported to the police as well as the platform.",
        "Schools and colleges are expected to have an anti-bullying / anti-ragging process - use it alongside, not instead of, official reporting.",
        "The old IPC is no longer in force; current reporting uses the Bharatiya Nyaya Sanhita's provisions, though people may still see the old IPC section numbers referenced in older material.",
      ],
    },
    supportNote: "If this is affecting how you feel day to day, you don't have to handle it alone - Tele-MANAS (14416) offers free, confidential support alongside anything you report.",
    draftedOn: "2026-10-02",
  },
  {
    slug: "safe-unsafe-touch",
    number: 3,
    area: "School and childhood",
    title: "Safe and unsafe touch, and reporting abuse",
    ageBands: ["SCHOOL"],
    oneLine: "If someone touches you in a way that feels wrong, or you're worried about a child, it is never that child's fault, and there is a free, 24x7 helpline to call.",
    rights: [
      "Every child has the right to be safe from any kind of unsafe touch, no matter who it's from - including a family member or someone they know well.",
      "Children are legally protected under a dedicated law (POCSO) specifically written to protect them.",
      "It is never a child's fault, and telling someone is always the right thing to do, however long it's been.",
    ],
    firstSteps: [
      "Tell a trusted adult - a parent, teacher, relative or counsellor - as soon as you can.",
      "If you can't tell someone in person right away, call the Child Helpline on 1098 (free, 24x7) or 112.",
      "You will not be made to confront the person who did this, and your identity is protected under the law.",
      "If an adult doesn't believe you or doesn't act, tell another adult, or call 1098 directly yourself.",
    ],
    evidence: ["If it's safe to, note down roughly when and where it happened", "This is the one guide where evidence matters far less than telling someone - don't wait to 'collect proof' before speaking up"],
    helpSlugs: ["child", "legal-aid"],
    toolSlugs: [],
    legalDetail: {
      law: "Protection of Children from Sexual Offences (POCSO) Act, 2012.",
      points: [
        "POCSO is a dedicated law written specifically to protect children, with child-friendly reporting and court procedures.",
        "Reporting abuse of a child is mandatory for adults who become aware of it - a trusted adult who is told is expected to help, not stay silent.",
        "A child's identity is legally protected from being disclosed.",
      ],
    },
    supportNote: "This can be a hard thing to talk about. Tele-MANAS (14416) and the Child Helpline (1098) are both free, confidential and here to help - telling someone is the right first step, always.",
    draftedOn: "2026-10-02",
  },
  {
    slug: "police-rights",
    number: 22,
    area: "Police, courts and government",
    title: "Police, FIR and your rights if questioned or arrested",
    ageBands: ["COLLEGE", "WORKING", "SENIOR"],
    oneLine: "You have specific, real rights if police want to question you or make an arrest - knowing them in advance makes a stressful moment much less confusing.",
    rights: [
      "You have the right to know the grounds for your arrest.",
      "You have the right to inform a family member or friend of your arrest and where you're being held.",
      "You have the right to consult a lawyer of your choice, and to free legal aid if you can't afford one.",
      "An arrested person must be produced before a magistrate within 24 hours (excluding travel time).",
      "A Zero FIR can be filed at any police station, regardless of where the incident happened - the station cannot refuse to register it on that basis.",
    ],
    firstSteps: [
      "Stay calm and polite - you can assert your rights clearly without being confrontational.",
      "Ask clearly what you are being questioned about or arrested for.",
      "Ask to inform a family member or friend, and ask for a lawyer - you're entitled to both.",
      "If police refuse to register an FIR for a complaint you're making, you can approach a senior officer, or go to the Judicial Magistrate.",
    ],
    evidence: ["Officer's name and ID/badge number if visible", "Time, date and location", "Any witnesses present", "A copy of the FIR or complaint receipt if one is filed"],
    helpSlugs: ["legal-aid", "emergency"],
    toolSlugs: ["police-complaint"],
    legalDetail: {
      law: "Bharatiya Nagarik Suraksha Sanhita, 2023 (replaced the Code of Criminal Procedure from 1 July 2024).",
      points: [
        "The new criminal law framework (Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, Bharatiya Sakshya Adhiniyam) has been in force since 1 July 2024, replacing the IPC, CrPC and Evidence Act respectively.",
        "Zero FIR and e-FIR are both formally recognised under the new framework.",
        "Free legal aid is available through NALSA for many categories of people, including anyone who cannot afford a lawyer - call 15100.",
      ],
    },
    draftedOn: "2026-10-02",
  },
  {
    slug: "public-safety",
    number: 19,
    area: "Family, home and personal safety",
    title: "Safety in public places and while travelling",
    ageBands: ["SCHOOL", "COLLEGE", "WORKING", "SENIOR"],
    oneLine: "112 is a single number for any emergency, anywhere in India - police, fire or ambulance - and several states now link women's and child helplines to it directly.",
    rights: [
      "You have the right to move freely and safely in public places.",
      "112 connects you to police, fire and ambulance services from anywhere, and can often locate you via your phone if you can't speak.",
      "Sexual harassment in public - following, touching, lewd remarks or gestures - is a reportable offence, not something to just 'put up with'.",
    ],
    firstSteps: [
      "If you're in immediate danger, call 112 - stay on the line if you can, even briefly.",
      "If possible, move toward a public, well-lit or crowded place.",
      "Note down any identifying details - vehicle number, description, direction - as soon as it's safe to.",
      "Report to the nearest police station, or file an e-FIR where your state offers it, as soon as you can.",
    ],
    evidence: ["Time, date and exact location", "Any photos or videos taken safely", "Vehicle number or description if relevant", "Names/contact details of anyone who witnessed it"],
    helpSlugs: ["emergency", "women", "legal-aid"],
    toolSlugs: ["police-complaint"],
    legalDetail: {
      law: "Bharatiya Nyaya Sanhita, 2023; the 112 National Emergency Response Support System; the 181 women's helpline.",
      points: [
        "112 is built to work even with limited information from the caller, and several states (for example Nagaland) have since linked their dedicated child and women helplines into the same 112 system for faster response.",
        "You can file a police complaint without a lawyer; NALSA (15100) can help if you want legal support alongside it.",
      ],
    },
    draftedOn: "2026-10-02",
  },
];

export function legalGuideBySlug(slug: string): LegalGuide | undefined {
  return LEGAL_GUIDES.find((g) => g.slug === slug);
}
