/**
 * All 24 guides from the Legal Resources plan, in the plan's own numbering
 * and six life areas. Content is drafted from real, named Indian statutes and
 * official or regulator sources (listed per guide in `sources`), checked on
 * the `draftedOn` date - but UNREVIEWED by a qualified advocate.
 * GuideView (components/legal/GuideView.tsx) renders a mandatory
 * draft-review banner on every guide; this file holds no "reviewedBy" field
 * because nobody has reviewed it yet - do not add one until a real advocate
 * signs off, per the plan's "Legal guides ship as drafts" note.
 *
 * Several facts here changed in 2025-2026 (new labour codes, DPDP Rules,
 * RBI's 2026 ombudsman scheme, the 2026 IT Rules amendment, RBI's 2027
 * fraud-liability and recovery directions). Re-check them at every review.
 */

export type AgeBand = "SCHOOL" | "COLLEGE" | "WORKING" | "SENIOR";

export interface GuideSource {
  label: string;
  url: string;
}

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
  /** Pages that hold sensitive guides show a neutral browser-tab title (plan section 11). */
  sensitive?: boolean;
  sources?: GuideSource[];
  draftedOn: string;
}

/** The plan's six life areas, in display order. */
export const LEGAL_AREAS = [
  "School and childhood",
  "Online and digital life",
  "Money, shopping and housing",
  "Work",
  "Family, home and personal safety",
  "Police, courts and government",
] as const;

export const LEGAL_GUIDES: LegalGuide[] = [
  // ---------------------------------------------------------------- School and childhood
  {
    slug: "right-to-education",
    number: 1,
    area: "School and childhood",
    title: "Your right to education",
    ageBands: ["SCHOOL"],
    oneLine: "Every child aged 6 to 14 has a legal right to free education in a neighbourhood school, and no school may charge a capitation fee or test a child before admission.",
    rights: [
      "Children aged 6 to 14 have the right to free and compulsory education in a neighbourhood school until they complete Class 8.",
      "Private unaided schools must admit children from weaker sections and disadvantaged groups to at least 25% of the seats in their entry class, free of cost, until Class 8.",
      "No school may charge a capitation fee, or put a child or the parents through a screening test, for admission.",
      "A child cannot be refused admission only because they have no age proof such as a birth certificate.",
      "No child can be expelled before completing elementary education (Class 8).",
    ],
    firstSteps: [
      "Ask the school in writing for the admission or facility you are entitled to, and keep a copy with the date.",
      "For a 25% seat, apply in your state's RTE admission process. Many states run an online lottery, and the dates differ by state, so check your state education department's website early.",
      "If the school refuses or asks for a capitation fee, complain in writing to the Block or District Education Officer.",
      "If that does not work, complain to your State Commission for Protection of Child Rights, or file free online on NCPCR's e-Baal Nidan portal.",
    ],
    evidence: [
      "The admission form, receipt or the school's written reply",
      "Proof of residence, and age proof if you have it",
      "Income or category certificate, for a 25% seat",
      "Any fee demand, in writing or as a screenshot",
      "Names of the officials you spoke to, with dates",
    ],
    helpSlugs: ["ncpcr", "child", "legal-aid"],
    toolSlugs: ["school-college-complaint", "rti-application"],
    legalDetail: {
      law: "Right of Children to Free and Compulsory Education Act, 2009 (RTE Act), as amended in 2019; RTE (Amendment) Rules, 2024 for central government schools.",
      points: [
        "Section 12(1)(c): private unaided schools admit at least 25% of the entry class from weaker sections and disadvantaged groups in the neighbourhood, and provide free education until Class 8.",
        "Section 13: a school that collects a capitation fee can be fined up to ten times the fee; screening a child can be fined up to ₹25,000 for a first offence and ₹50,000 for each later one.",
        "Section 17 bans physical punishment and mental harassment of children (see guide 2).",
        "After the 2019 amendment, a child who fails the Class 5 or Class 8 year-end exam gets extra teaching and a re-exam within two months, and can be held back only if they fail again. In December 2024 the Centre applied this to the schools it runs, such as Kendriya Vidyalayas, Navodaya Vidyalayas and Sainik Schools. Many states had already done so. Even then, no child can be expelled before completing Class 8.",
        "The NCPCR and the State Commissions for Protection of Child Rights monitor how the RTE Act is implemented.",
      ],
    },
    sources: [
      { label: "RTE Act, 2009, full text (Government of Kerala)", url: "https://panchayatwiki.lsgkerala.gov.in/THE_RIGHT_OF_CHILDREN_TO_FREE_AND_COMPULSORY_EDUCATION_ACT,_2009" },
      { label: "NCPCR e-Baal Nidan complaint portal", url: "https://ncpcr.gov.in/ebaalnidan/" },
      { label: "No-detention policy change, December 2024 (Drishti IAS)", url: "https://www.drishtiias.com/daily-updates/daily-news-analysis/centre-scrapped-no-detention-policy/print_manually" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "school-bullying-punishment",
    number: 2,
    area: "School and childhood",
    title: "Bullying and punishment at school",
    ageBands: ["SCHOOL"],
    oneLine: "No teacher or school is allowed to hit, humiliate or frighten a student, and the school must act when other students bully you.",
    rights: [
      "Physical punishment and mental harassment of children are banned. That includes hitting, being made to stand or kneel as punishment, and insults or humiliation.",
      "You have the right to a safe school. CBSE schools must have an anti-bullying committee, and NCPCR has guidelines for every school on preventing bullying and cyberbullying.",
      "Bullying includes physical attacks, name-calling, spreading rumours, leaving someone out on purpose and cyberbullying.",
      "Telling an adult about bullying or punishment is the right thing to do, and the school should protect the student who reports it.",
    ],
    firstSteps: [
      "Tell a trusted adult today: a parent, a teacher you trust or the school counsellor.",
      "Write down what happened, when, where and who saw it, while you still remember.",
      "With a parent, give a written complaint to the principal or the anti-bullying committee and ask for a written reply.",
      "If the school does not act, complain to the District Education Officer, the State Commission for Protection of Child Rights, or NCPCR's e-Baal Nidan portal.",
      "If you are hurt or in danger, call the Child Helpline on 1098 or call 112.",
    ],
    evidence: [
      "Your notes with dates, times and places",
      "Names of students or staff who saw it",
      "Photos of any injury and a doctor's note",
      "Screenshots, if the bullying continued online",
      "Copies of your complaints and the school's replies",
    ],
    helpSlugs: ["child", "ncpcr", "mental-health"],
    toolSlugs: ["school-college-complaint"],
    legalDetail: {
      law: "RTE Act, 2009 (Section 17); Juvenile Justice (Care and Protection of Children) Act, 2015 (Section 75); CBSE and NCPCR anti-bullying guidelines.",
      points: [
        "Section 17 of the RTE Act says no child shall be subjected to physical punishment or mental harassment; a person who does so faces disciplinary action under their service rules.",
        "Section 75 of the Juvenile Justice Act makes cruelty to a child by a person who has charge of the child punishable with up to 3 years' imprisonment, a fine of up to ₹1 lakh, or both. The punishment is higher for staff of an organisation entrusted with the child's care.",
        "CBSE's 2015 guidelines require schools to set up an anti-bullying committee, state in the prospectus that bullying is prohibited, and give students a confidential way to report it.",
        "Serious bullying that involves assault, threats or sharing images can also be reported to the police.",
      ],
    },
    supportNote: "Being bullied or punished can make school feel frightening. You are not alone: Tele-MANAS (14416) and the Child Helpline (1098) are free and confidential.",
    sources: [
      { label: "CBSE circular: prevention of bullying and ragging in schools (2015)", url: "https://cbseacademic.nic.in/web_material/Circulars/2015/17_Prevention%20of%20Bullying%20%26%20Ragging%20in%20Schools.pdf" },
      { label: "RTE Act, 2009, full text (Government of Kerala)", url: "https://panchayatwiki.lsgkerala.gov.in/THE_RIGHT_OF_CHILDREN_TO_FREE_AND_COMPULSORY_EDUCATION_ACT,_2009" },
    ],
    draftedOn: "2026-10-03",
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
    sensitive: true,
    draftedOn: "2026-10-02",
  },
  {
    slug: "ragging",
    number: 4,
    area: "School and childhood",
    title: "Ragging in college",
    ageBands: ["COLLEGE"],
    oneLine: "Ragging is banned in every college in India. You can call the free National Anti-Ragging Helpline on 1800-180-5522, and your college must act.",
    rights: [
      "Ragging in any form is banned in all higher education institutions, and every college must take steps to prevent it.",
      "Ragging includes teasing or rude treatment, forcing a student to do something that causes shame, fear or embarrassment, and making freshers pay for things.",
      "You can complain to the college's Anti-Ragging Committee or Squad, the head of the institution, or the national helpline.",
      "Ragging is never the junior's fault, and it is not a harmless tradition.",
    ],
    firstSteps: [
      "If you are in danger or hurt, get to a safe place and call 112.",
      "Call the National Anti-Ragging Helpline on 1800-180-5522 (toll-free, in 12 languages) or use antiragging.in.",
      "Report it in writing to the Anti-Ragging Committee, Squad or the head of the institution, and keep a copy.",
      "Tell your parents or guardian.",
    ],
    evidence: [
      "Date, time and place of each incident",
      "Names or descriptions of the people involved",
      "Names of witnesses",
      "Messages, call logs or social media posts",
      "A medical report, if you were hurt",
    ],
    helpSlugs: ["ragging", "emergency", "mental-health"],
    toolSlugs: ["school-college-complaint", "police-complaint"],
    legalDetail: {
      law: "UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009 (with later amendments), framed after Supreme Court directions.",
      points: [
        "Punishments include suspension from classes, withholding results or scholarships, debarring from exams, suspension or expulsion from the hostel, rustication for 1 to 4 semesters, expulsion, and a fine of up to ₹25,000. Ragging can also be prosecuted as a crime.",
        "If the students responsible cannot be identified, the institution can impose collective punishment.",
        "Every student and every parent must submit an online anti-ragging undertaking at antiragging.in each academic year.",
        "Several states also have their own laws against ragging.",
      ],
    },
    supportNote: "Ragging can be frightening and isolating. Tele-MANAS (14416) is free and confidential, alongside any complaint you make.",
    sources: [
      { label: "National Anti-Ragging portal and undertaking", url: "https://www.antiragging.in/" },
      { label: "Anti-ragging policies (Vikaspedia)", url: "https://en.vikaspedia.in/viewcontent/education/policies-and-schemes/anti-ragging-policies?lgn=en" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "child-labour-marriage",
    number: 5,
    area: "School and childhood",
    title: "Child labour and child marriage",
    ageBands: ["SCHOOL", "COLLEGE"],
    oneLine: "Children under 14 cannot be employed, and a girl under 18 or a boy under 21 cannot legally marry. Call 1098 if you or someone you know is at risk.",
    rights: [
      "No child under 14 may be employed in any work. The only exceptions are helping in the family's own business or working as a child artist, and only after school hours or in holidays.",
      "Teenagers aged 14 to 18 cannot be employed in hazardous occupations or processes.",
      "A girl under 18 or a boy under 21 cannot legally marry. Anyone who arranges, performs or allows a child marriage can be punished.",
      "A person who was married as a child can ask a court to cancel the marriage until two years after becoming an adult.",
      "A court can stop a planned child marriage with an injunction before it happens.",
    ],
    firstSteps: [
      "Tell a trusted adult, a teacher or the school counsellor.",
      "Call the Child Helpline on 1098 (free, 24x7) or 112. For a marriage, call before the wedding date if you can.",
      "A planned child marriage can be reported to the police or the district Child Marriage Prohibition Officer.",
      "Child labour can be reported online on the PENCIL portal. The district nodal officer checks a complaint within 48 hours and arranges a rescue with the police if it is genuine.",
    ],
    evidence: [
      "Where the child works, or where and when the wedding is planned",
      "A wedding invitation, if there is one",
      "The child's age proof, if available",
      "Only collect evidence if it is safe. Telling someone matters more.",
    ],
    helpSlugs: ["child", "emergency", "pencil", "legal-aid"],
    toolSlugs: ["police-complaint"],
    legalDetail: {
      law: "Child and Adolescent Labour (Prohibition and Regulation) Act, 1986, as amended in 2016; Prohibition of Child Marriage Act, 2006.",
      points: [
        "The 2016 amendment bans employing children below 14 in any establishment, hazardous or not, and bans adolescents aged 14 to 18 from hazardous occupations and processes.",
        "The amendment also set up a district-level Child and Adolescent Labour Rehabilitation Fund for rescued children.",
        "Under the Prohibition of Child Marriage Act, a child marriage is voidable at the option of the party who was a child, by a petition filed before they complete two years after reaching majority.",
        "A parent, guardian or anyone else who promotes, permits or negligently fails to prevent a child marriage can be punished with up to 2 years' rigorous imprisonment, a fine of up to ₹1 lakh, or both.",
        "States appoint Child Marriage Prohibition Officers to prevent child marriages.",
      ],
    },
    supportNote: "If you are being pressured to marry or to work, it is not your fault and you do not have to face it alone. 1098 is free and confidential, any time.",
    sources: [
      { label: "Child Labour (Prohibition and Regulation) Amendment Act, 2016 (PRS)", url: "https://prsindia.org/files/bills_acts/bills_parliament/2012/Child%20Labour%20(Prohibition%20and%20Regulation)%20Amendment%20Act,%202016.pdf" },
      { label: "PENCIL portal (Ministry of Labour and Employment)", url: "https://pencil.gov.in/" },
      { label: "Prohibition of Child Marriage Act, 2006 (Odisha WCD copy)", url: "https://wcd.odisha.gov.in/sites/default/files/2021-06/Prohibition_of_Child_marriage_Act-2006.pdf" },
    ],
    draftedOn: "2026-10-03",
  },

  // ---------------------------------------------------------------- Online and digital life
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
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/" },
    ],
    draftedOn: "2026-10-02",
  },
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
    helpSlugs: ["cyber-fraud", "rbi", "legal-aid"],
    toolSlugs: ["police-complaint", "bank-complaint"],
    legalDetail: {
      law: "Information Technology Act, 2000; reported via the Indian Cyber Crime Coordination Centre's helpline and portal.",
      points: [
        "1930 and cybercrime.gov.in are run by the Indian Cyber Crime Coordination Centre (I4C).",
        "Reporting promptly matters: many banks can only attempt a hold on funds within a short window after a fraudulent transfer.",
        "You can file anonymously for reporting purposes, but a full complaint (for possible recovery) needs your details.",
        "Your liability for an unauthorised bank transaction depends on how quickly you tell your bank - see guide 11, 'Problems with your bank'.",
      ],
    },
    sources: [{ label: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/" }],
    draftedOn: "2026-10-02",
  },
  {
    slug: "data-privacy",
    number: 8,
    area: "Online and digital life",
    title: "Your personal data and privacy",
    ageBands: ["COLLEGE", "WORKING"],
    oneLine: "India's data protection law gives you rights over your personal data, but most of them start on 13 May 2027. Until then, use each company's grievance officer and its privacy settings.",
    rights: [
      "From 13 May 2027, under the Digital Personal Data Protection Act you can ask a company what personal data it holds about you, and ask it to correct, complete, update or erase that data.",
      "From the same date, companies must ask for clear consent, explain why they collect your data, and let you withdraw consent as easily as you gave it.",
      "Processing the data of anyone under 18 will need verifiable consent from a parent.",
      "Right now, social media and other online platforms must have a Grievance Officer who acknowledges your complaint within 24 hours. If you are not satisfied, you can appeal to the government's Grievance Appellate Committee within 30 days.",
    ],
    firstSteps: [
      "Use the app's own settings to download, correct or delete your data, and close accounts you no longer use.",
      "Write to the company's Grievance Officer (named in its privacy policy) asking for correction or deletion. Keep the date and their reply.",
      "If a platform does not resolve your complaint, appeal to the Grievance Appellate Committee at gac.gov.in within 30 days.",
      "If your data was used to cheat you or your account was hacked, call 1930 and report it on cybercrime.gov.in.",
    ],
    evidence: [
      "Screenshots of the data the app shows about you",
      "Your request and the date you sent it",
      "The company's reply or ticket number",
      "Any message showing your data was leaked or misused",
    ],
    helpSlugs: ["gac", "cyber-fraud", "legal-aid"],
    toolSlugs: ["data-deletion"],
    legalDetail: {
      law: "Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025; Information Technology Act, 2000 and the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.",
      points: [
        "The DPDP Rules were notified in November 2025 with an 18-month phase-in. The Data Protection Board provisions applied from 13 November 2025, consent-manager rules apply from 13 November 2026, and most duties of companies and the rights of individuals apply from 13 May 2027.",
        "The rights of individuals under the Act are access to information, correction and erasure, grievance redressal, and nominating someone to act for you after death or incapacity.",
        "A company can verify a parent's consent for a child's data using details it already holds, details the parent provides, or a token issued by the government or an authorised body.",
        "The Act's amendment to the RTI Act's exemption for personal information (Section 8(1)(j)) took effect on 13 November 2025.",
        "Until the remaining provisions start, Section 43A of the IT Act and the 2011 data-security rules still govern how companies protect sensitive personal data.",
      ],
    },
    sources: [
      { label: "DPDP Rules, 2025 backgrounder (PIB)", url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf" },
      { label: "DPDP Act commencement dates (Taxmann)", url: "https://www.taxmann.com/post/blog/govt-notifies-commencement-dates-for-dpdp-act/" },
      { label: "Grievance Appellate Committee portal", url: "https://gac.gov.in/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "photo-misuse",
    number: 9,
    area: "Online and digital life",
    title: "Misuse of photos and morphed images",
    ageBands: ["SCHOOL", "COLLEGE"],
    oneLine: "If someone shares, morphs or threatens to share private images of you, it is not your fault. Platforms must take intimate images down within 2 hours of a complaint, and you can report it to the cybercrime portal.",
    rights: [
      "Taking, sharing or threatening to share someone's private images without consent is a crime. So is making fake (morphed or deepfake) sexual images of a real person.",
      "Since 20 February 2026, platforms must remove non-consensual intimate images, including morphed and deepfake nudity, within 2 hours of a complaint.",
      "Sexual images of anyone under 18 are illegal to make, share or keep. A child shown in them is a victim, never an offender.",
      "You can report sexual content involving women or children on cybercrime.gov.in, and reports of child sexual abuse material can be made anonymously.",
    ],
    firstSteps: [
      "Tell a trusted adult or friend right away. You will not be blamed.",
      "If someone is threatening you, do not pay and do not send more pictures. Threats usually get worse after payment.",
      "Note the links, usernames and phone numbers involved and screenshot the threats. If you are under 18, do not save or forward the images themselves.",
      "Report the post on the platform using its nudity or non-consensual image option, and report it on cybercrime.gov.in under crimes against women and children. Call 112 if you feel unsafe.",
      "Adults can use StopNCII.org to stop an image being uploaded to partner platforms. If the image was taken when you were under 18, use NCMEC's Take It Down.",
    ],
    evidence: [
      "Links (URLs) to the posts and profiles",
      "Usernames, phone numbers or email IDs used",
      "Screenshots of threats or demands (not of the images, if you are under 18)",
      "Dates and times",
      "Complaint numbers from the platform and the portal",
    ],
    helpSlugs: ["cyber-fraud", "women", "child", "mental-health"],
    toolSlugs: ["police-complaint"],
    legalDetail: {
      law: "Information Technology Act, 2000 (Sections 66E, 67, 67A, 67B); Bharatiya Nyaya Sanhita, 2023 (Sections 77, 78, 351, 356); POCSO Act, 2012; IT Rules, 2021 as amended in 2026.",
      points: [
        "IT Act Section 66E punishes capturing or sharing images of a person's private area without consent. Sections 67 and 67A cover obscene and sexually explicit material, and Section 67B covers material depicting children.",
        "BNS Section 77 covers voyeurism, Section 78 stalking (including monitoring a woman's online activity), Section 351 criminal intimidation and Section 356 defamation.",
        "The IT (Intermediary Guidelines and Digital Media Ethics Code) Amendment Rules, 2026, notified on 10 February 2026 and in force from 20 February 2026, require removal of non-consensual intimate imagery within 2 hours and labelling of AI-generated content.",
        "The cybercrime portal lets anyone report child sexual abuse material and rape or gang-rape content anonymously.",
      ],
    },
    supportNote: "This can feel overwhelming and embarrassing, but it is not your fault and it can be stopped. Tele-MANAS (14416) is free and confidential, and the Child Helpline (1098) helps anyone under 18.",
    sensitive: true,
    sources: [
      { label: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/" },
      { label: "IT Amendment Rules, 2026 (Drishti IAS)", url: "https://www.drishtiias.com/daily-updates/daily-news-analysis/information-technology-amendment-rules-2026/print_manually" },
      { label: "StopNCII.org", url: "https://stopncii.org/" },
      { label: "Take It Down (NCMEC), for images taken under 18", url: "https://takeitdown.ncmec.org/" },
    ],
    draftedOn: "2026-10-03",
  },

  // ---------------------------------------------------------------- Money, shopping and housing
  {
    slug: "faulty-product",
    number: 10,
    area: "Money, shopping and housing",
    title: "Consumer rights: refunds, defects, misleading ads",
    ageBands: ["SCHOOL", "COLLEGE", "WORKING", "SENIOR"],
    oneLine: "In India you have a legal right to a product that works as promised, and you can complain to a consumer commission online, often without a lawyer.",
    rights: [
      "You have the right to goods and services that are safe, of the promised quality, and as advertised.",
      "You can ask for a repair, replacement or refund when a product is defective or a service is deficient.",
      "'No refund' or 'no exchange' signs do not take away your legal rights when the product is defective.",
      "These rights apply to online shopping as well as shops.",
    ],
    firstSteps: [
      "Stop using the product if it is unsafe, and keep the box and any parts.",
      "Contact the seller or brand in writing (email, app chat or a letter) and ask for a repair, replacement or refund. Give a reasonable deadline, such as 7 to 15 days.",
      "If they do not solve it, call the National Consumer Helpline on 1915 or use its app or website. It often settles complaints with the company without going to court.",
      "If that fails, file a complaint with the District Consumer Commission online through e-Jagriti (formerly e-Daakhil). You can file it yourself.",
    ],
    evidence: [
      "Bill or invoice, and payment proof (UPI screenshot, card statement)",
      "Warranty card and the box",
      "Photos or videos of the defect",
      "Every message and email with the seller or brand, with dates",
      "Service centre job sheets, if you took it for repair",
    ],
    helpSlugs: ["consumer", "e-jagriti", "legal-aid"],
    toolSlugs: ["seller-complaint", "consumer-commission"],
    legalDetail: {
      law: "Consumer Protection Act, 2019; Consumer Protection (Jurisdiction of the District Commission, the State Commission and the National Commission) Rules, 2021.",
      points: [
        "District Commissions hear complaints where the value paid is up to ₹50 lakh. State Commissions hear those above ₹50 lakh and up to ₹2 crore, and the National Commission those above ₹2 crore.",
        "No fee is charged for complaints up to ₹5 lakh.",
        "Most complaints must be filed within 2 years of the problem (Section 69).",
        "You can file in the district where you live or work, not only where the seller is.",
        "e-Daakhil has been renamed e-Jagriti. Check the current value limits and fees there before filing.",
      ],
    },
    sources: [
      { label: "e-Jagriti consumer commission portal", url: "https://e-jagriti.gov.in/" },
      { label: "National Consumer Helpline", url: "https://consumerhelpline.gov.in/" },
      { label: "Consumer Protection Rules, 2021: pecuniary limits (Drishti IAS)", url: "https://www.drishtiias.com/daily-updates/daily-news-analysis/consumer-protection-rules-2021" },
      { label: "Fee for making consumer complaints (Nyaaya)", url: "https://nyaaya.org/legal-explainer/fee-for-making-complaints/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "bank-problems",
    number: 11,
    area: "Money, shopping and housing",
    title: "Problems with your bank",
    ageBands: ["COLLEGE", "WORKING", "SENIOR"],
    oneLine: "Complain to your bank in writing first. If it does not reply within 30 days, or you are unhappy with the reply, the RBI Ombudsman is free, but under the 2026 scheme you must go to it within 90 days.",
    rights: [
      "Every bank, NBFC and payment app regulated by RBI must have a complaint process and give you a reference number.",
      "If money leaves your account without your authorisation because of a third-party breach and you tell the bank within 3 working days, your liability is zero. The bank must credit the amount back (a 'shadow reversal') within 10 working days of your report.",
      "From 1 January 2027 that window becomes 5 calendar days. Victims of small-value fraud (a loss of up to ₹50,000) can also get compensation of 85% of the loss, up to ₹25,000, once in a lifetime.",
      "The RBI Ombudsman is free. Since 1 July 2026 it can award up to ₹30 lakh for consequential loss and up to ₹3 lakh for harassment, time and expenses.",
      "You don't need an agent to complain to RBI. RBI has no arrangement with any outside firm for this.",
    ],
    firstSteps: [
      "For fraud: block your card or UPI at once through the bank app or helpline, call 1930, and report it to the bank in writing. The sooner you report, the better your protection.",
      "For other problems (wrong charges, a failed transfer, account issues), write to the bank's grievance cell and note the complaint number.",
      "If the bank does not reply in 30 days, or the reply is unsatisfactory, file at cms.rbi.org.in within 90 days. You can also email crpc@rbi.org.in or post it to RBI's CRPC, 4th Floor, Sector 17, Chandigarh 160017.",
      "For help with filing, call RBI's contact centre on 14448 (9:30 am to 5:15 pm on working days).",
    ],
    evidence: [
      "Account statement showing the transaction",
      "Transaction ID, date and time",
      "Your complaint to the bank and its reference number",
      "The bank's reply",
      "SMS and email alerts you received",
      "Your 1930 or cybercrime complaint number, for fraud",
    ],
    helpSlugs: ["rbi", "cyber-fraud", "legal-aid"],
    toolSlugs: ["bank-complaint"],
    legalDetail: {
      law: "Reserve Bank - Integrated Ombudsman Scheme, 2026 (in force from 1 July 2026); RBI rules on customer liability in unauthorised electronic banking transactions.",
      points: [
        "The 2026 scheme covers commercial banks, regional rural banks, co-operative banks, eligible NBFCs, prepaid payment instrument issuers and credit information companies.",
        "You must complain to the regulated entity first. You can then approach the Ombudsman if there is no reply in 30 days, or the reply is unsatisfactory, within 90 days of the reply deadline or the entity's last communication, whichever is later. The 2021 scheme allowed one year.",
        "A complaint cannot be filed through an advocate unless the advocate is the complainant. Either side can appeal an award to the Appellate Authority within 30 days.",
        "Until 31 December 2026: zero liability for third-party breaches reported within 3 working days; limited liability (capped at ₹5,000 to ₹25,000 depending on the account type) if reported within 4 to 7 working days; after that, the bank's board-approved policy applies. The bank carries the burden of proving that the customer is liable.",
        "From 1 January 2027 (RBI Responsible Business Conduct Third Amendment Directions, issued 24 June 2026): zero liability for third-party breaches reported within 5 calendar days, credit-card shadow reversal within 5 calendar days, and a compensation scheme for bona fide individual victims of small-value fraud.",
      ],
    },
    sources: [
      { label: "RBI Complaint Management System", url: "https://cms.rbi.org.in/" },
      { label: "RB-IOS 2026 key changes (Vinod Kothari)", url: "https://vinodkothari.com/2026/01/rbi-integrated-ombudsman-scheme-2026-key-changes/" },
      { label: "RBI's 2026 digital fraud protection directions (CAalley)", url: "https://caalley.com/news-updates/indian-news/rbi-finalises-digital-banking-fraud-protection-rules-introduces-shadow-reversal-extends-relief-to-sole-proprietors" },
      { label: "RBI's 2017 limited-liability framework (SCC Online)", url: "https://www.scconline.com/blog/post/2017/07/17/rbi-limlits-liability-of-customers-in-unauthorised-electronic-banking-transactions/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "loan-recovery",
    number: 12,
    area: "Money, shopping and housing",
    title: "Loans and harassment by recovery agents",
    ageBands: ["COLLEGE", "WORKING"],
    oneLine: "Even if you owe money, nobody may threaten you, shame you or pressure your contacts, and recovery calls are allowed only between 8 am and 7 pm.",
    rights: [
      "Lenders and their agents must not intimidate or harass you, verbally or physically, or call you persistently, before 8 am or after 7 pm.",
      "They must not humiliate you in public or intrude on the privacy of your family, friends or referees.",
      "A digital lending app working with a regulated lender must not access your contacts, call logs or media. One-time access for KYC is allowed only with your consent.",
      "Before you sign a digital loan you must get a Key Fact Statement showing the full cost, and you can exit during a cooling-off period of at least one day by repaying the principal and proportionate interest.",
      "Loan money must go straight into your bank account, and repayments straight to the lender's account, not through a third party.",
    ],
    firstSteps: [
      "Do not pay anyone under threat, and do not share OTPs or your contact list.",
      "Check the app in RBI's directory of Digital Lending Apps on rbi.org.in to see whether it is linked to a regulated lender.",
      "Complain in writing to the lender's grievance officer. If unresolved, go to the RBI Ombudsman at cms.rbi.org.in.",
      "If the app is unregulated or anyone threatens you, report it on sachet.rbi.org.in, and to the police or cybercrime.gov.in (call 1930). Threats and morphed photos are crimes.",
    ],
    evidence: [
      "Call logs and recordings of threatening calls",
      "Screenshots of messages sent to you or your contacts",
      "Loan agreement, Key Fact Statement and repayment receipts",
      "The app's name and the bank or NBFC named in it",
      "Names or numbers of the agents who called",
    ],
    helpSlugs: ["rbi", "sachet", "cyber-fraud", "emergency"],
    toolSlugs: ["bank-complaint", "police-complaint"],
    legalDetail: {
      law: "RBI instructions on recovery agents (12 August 2022); Reserve Bank of India (Digital Lending) Directions, 2025; Bharatiya Nyaya Sanhita, 2023.",
      points: [
        "RBI's 12 August 2022 instructions bar intimidation or harassment of any kind, persistent calls, and calls before 8 am or after 7 pm. Lenders stay responsible for their outsourced agents.",
        "New RBI directions on conduct in recovery of loans and engagement of recovery agents take effect on 1 January 2027. They require a documented recovery policy and recording of recovery communication.",
        "The Digital Lending Directions, 2025 (8 May 2025) require a Key Fact Statement and a cooling-off period of at least one day, and restrict apps' access to phone resources. RBI's public directory of digital lending apps has been live since 1 July 2025.",
        "Sachet complaints against unregulated lenders go to the Registrar of Companies or the state's Economic Offences Wing.",
        "Threats, extortion and circulating morphed photos are offences that can be reported to the police.",
      ],
    },
    sources: [
      { label: "RBI press release on recovery agents, 12 August 2022", url: "https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=54205" },
      { label: "RBI press release on recovery directions effective 1 January 2027", url: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63305" },
      { label: "RBI issues Digital Lending Directions, 2025", url: "https://website.rbi.org.in/web/rbi/-/press-releases/rbi-issues-reserve-bank-of-india-digital-lending-directions-2025" },
      { label: "RBI Sachet portal", url: "https://sachet.rbi.org.in/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "renting",
    number: 13,
    area: "Money, shopping and housing",
    title: "Renting a home: agreement and deposit",
    ageBands: ["COLLEGE", "WORKING"],
    oneLine: "Always get a written rent agreement and proof of the deposit. Deposit limits and eviction rules depend on your state's rent law.",
    rights: [
      "Insist on a written agreement that sets out the rent, deposit, notice period and who pays for repairs. Under the Model Tenancy Act, every tenancy must be in writing.",
      "In states with a tenancy law based on the Model Tenancy Act, the security deposit for a home is capped at two months' rent.",
      "Under the Model Act a landlord must give 24 hours' written notice before entering, and must not cut off essential supplies such as water or electricity.",
      "A landlord cannot evict you without following the legal process in your state's law.",
      "Your deposit should come back when you leave, minus only lawful deductions such as unpaid rent or damage beyond normal wear.",
    ],
    firstSteps: [
      "Before paying, read the agreement: rent, deposit, lock-in, notice period, maintenance charges and rent increases.",
      "Pay the deposit and rent by bank transfer or UPI, or get signed receipts.",
      "Take dated photos and videos of the home's condition when you move in and when you move out.",
      "If the landlord keeps your deposit or harasses you, send a written request first. If that fails, approach the Rent Authority or court under your state's law, or get free legal aid (15100).",
    ],
    evidence: [
      "Signed rent agreement (and registration receipt, if registered)",
      "Proof of deposit and rent payments",
      "Move-in and move-out photos and videos",
      "Messages with the landlord or broker",
      "Utility bills",
    ],
    helpSlugs: ["legal-aid", "tele-law"],
    toolSlugs: [],
    legalDetail: {
      law: "State rent laws; Model Tenancy Act, 2021 (only where a state has passed a law based on it); Registration Act, 1908.",
      points: [
        "The Model Tenancy Act is a model law. It applies only after a state passes its own version. In a July 2022 reply to the Rajya Sabha, the Housing Ministry said Andhra Pradesh, Tamil Nadu, Uttar Pradesh and Assam had revised their tenancy laws on its lines. Check your own state's current law.",
        "Under the Model Act, deposits are capped at 2 months' rent for homes and 6 months' for non-residential premises, and disputes go to a Rent Authority, then a Rent Court and a Rent Tribunal.",
        "Section 17 of the Registration Act requires leases of more than one year to be registered, which is why many agreements run for 11 months.",
        "Some states go further. In Maharashtra, Section 55 of the Maharashtra Rent Control Act, 1999 requires every leave and licence agreement to be in writing and registered, whatever its length.",
        "Stamp duty on rent agreements differs by state.",
      ],
    },
    sources: [
      { label: "Model Tenancy Act and the states that adopted it (Drishti IAS, 2022)", url: "https://www.drishtiias.com/daily-updates/daily-news-analysis/model-tenancy-act-2/print_manually" },
      { label: "Model Tenancy Act key features (Drishti IAS)", url: "https://www.drishtiias.com/daily-updates/daily-news-analysis/model-tenancy-act-1/print_manually" },
      { label: "Maharashtra Rent Control Act, Section 55 (AdvocateKhoj)", url: "https://www.advocatekhoj.com/library/bareacts/maharashtrarentcontrol/55.php" },
    ],
    draftedOn: "2026-10-03",
  },

  // ---------------------------------------------------------------- Work
  {
    slug: "first-job",
    number: 14,
    area: "Work",
    title: "Your first job: offer letter, wages, hours",
    ageBands: ["COLLEGE", "WORKING"],
    oneLine: "Since 21 November 2025, every worker must get an appointment letter, monthly wages by the 7th of the next month, and overtime at twice the normal rate.",
    rights: [
      "You must get a written appointment letter.",
      "Your pay cannot be below the minimum wage, and employers cannot pay different wages because of gender for the same or similar work.",
      "Monthly wages must be paid by the 7th day of the following month.",
      "Overtime must be paid at twice your normal wage rate.",
      "Fixed-term employees get the same benefits as permanent staff, and gratuity after one year of service.",
    ],
    firstSteps: [
      "Before joining, get the offer and appointment letter in writing. Check the salary break-up (CTC versus take-home pay), probation, notice period and any bond clause.",
      "Check the deductions on your first payslip: PF, ESI if it applies, professional tax and income tax (TDS).",
      "If your employer is covered by EPF, make sure you have a UAN and that contributions show in your EPFO passbook.",
      "Keep copies of all letters, payslips and emails. If something is wrong, raise it with HR in writing first.",
    ],
    evidence: [
      "Offer letter and appointment letter",
      "Payslips and bank statements",
      "Attendance records or timesheets",
      "Emails about pay, hours or leave",
      "EPF passbook and UAN details",
    ],
    helpSlugs: ["labour-samadhan", "legal-aid"],
    toolSlugs: ["salary-demand"],
    legalDetail: {
      law: "Code on Wages, 2019; Industrial Relations Code, 2020; Code on Social Security, 2020; Occupational Safety, Health and Working Conditions Code, 2020. All four have been in force since 21 November 2025.",
      points: [
        "The four codes replaced 29 central labour laws. Rules under them are made by the Centre and by each state, so some details, such as minimum wages and working-hour arrangements, differ by state.",
        "Code on Wages: timely payment (monthly wages by the 7th of the next month), equal pay without gender discrimination, and a national floor wage below which state minimum wages cannot fall.",
        "Code on Social Security: EPF, ESI, maternity benefit, and gratuity, including for fixed-term employees after one year.",
        "Whether an employment bond or penalty for leaving early can be enforced depends on its terms. Take advice before signing one.",
      ],
    },
    sources: [
      { label: "New labour codes in force from 21 November 2025 (EY alert)", url: "https://www.ey.com/content/dam/ey-unified-site/ey-com/en-in/alerts-hub/2025/11/new-labour-codes-implemented-across-the-country-effective-21-november-2025.pdf" },
      { label: "Salaries by the 7th of the following month (People Matters)", url: "https://www.peoplematters.in/news/economy-policy/new-labour-code-says-employers-should-pay-salaries-by-the-7th-of-the-following-month-50981" },
      { label: "Labour Ministry FAQs on the labour codes (SCC Online)", url: "https://www.scconline.com/blog/post/2026/01/03/labour-ministry-issued-faqs-on-the-labour-codes/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "workplace-harassment",
    number: 15,
    area: "Work",
    title: "Sexual harassment at work",
    ageBands: ["COLLEGE", "WORKING"],
    oneLine: "Every workplace with 10 or more employees must have an Internal Committee to hear sexual harassment complaints, and you can also file on the government's SHe-Box portal.",
    rights: [
      "Women at work are protected, including permanent, temporary and contract staff, trainees, apprentices and interns.",
      "Workplaces with 10 or more employees must have an Internal Committee. Complaints against the employer, or from smaller workplaces, go to the district's Local Committee.",
      "You can file a written complaint within 3 months of the incident (or the last of a series). The committee can allow 3 more months if something stopped you filing earlier.",
      "The inquiry must be completed within 90 days, and your identity and the proceedings must be kept confidential.",
      "During the inquiry you can ask for interim relief, such as a transfer for you or the other person, or leave.",
    ],
    firstSteps: [
      "If you are in danger, call 112.",
      "Write down what happened, with dates, times, places and witnesses, as soon as you can.",
      "Give a written complaint to your Internal Committee, or file it on SHe-Box (shebox.wcd.gov.in), which sends it to the committee concerned and lets you track it.",
      "If there is no Internal Committee, or the complaint is against your employer, complain to the Local Committee through the District Officer.",
      "You can also make a police complaint for sexual harassment, stalking or assault, as well as or instead of the committee route.",
    ],
    evidence: [
      "Your dated notes of each incident",
      "Messages, emails or call logs",
      "Names of witnesses",
      "Any earlier complaints and replies",
      "Medical records, if you were hurt",
    ],
    helpSlugs: ["she-box", "women", "ncw", "legal-aid"],
    toolSlugs: ["workplace-harassment", "police-complaint"],
    legalDetail: {
      law: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act); SHe-Box portal, relaunched on 29 August 2024.",
      points: [
        "Section 4 requires an Internal Committee in every workplace with 10 or more employees; Section 6 sets up a Local Committee in each district.",
        "Section 9: written complaint within 3 months, extendable by up to 3 months. Section 11: the inquiry is completed within 90 days.",
        "Section 14: action against a complainant is possible only if the complaint is found false or malicious. Being unable to prove a complaint is not, by itself, a reason for action.",
        "In colleges, the UGC's 2015 regulations on sexual harassment of women employees and students require an Internal Complaints Committee.",
      ],
    },
    supportNote: "Harassment at work can affect your health and confidence. Tele-MANAS (14416) is free and confidential, alongside any complaint you make.",
    sensitive: true,
    sources: [
      { label: "SHe-Box portal", url: "https://shebox.wcd.gov.in/" },
      { label: "SHe-Box and the POSH complaint process (SCC Online)", url: "https://www.scconline.com/blog/post/2025/09/20/posh-act-complaints-guide-shebox-initiative-india-legal-update/" },
      { label: "Time limit for filing a POSH complaint (S.S. Rana)", url: "https://ssrana.in/posh-law/ufaq/is-there-any-specific-time-frame-for-filing-a-posh-complaint/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "unpaid-salary",
    number: 16,
    area: "Work",
    title: "Unpaid salary and losing your job",
    ageBands: ["WORKING"],
    oneLine: "Monthly wages are due by the 7th of the next month, and final dues within 2 working days of leaving a job. You can claim unpaid wages for up to 3 years.",
    rights: [
      "Monthly wages must be paid by the 7th day of the following month.",
      "If you resign, are dismissed or retrenched, or the workplace closes, your wages must be paid within 2 working days.",
      "You can file a claim for unpaid wages within 3 years. The authority can also order compensation of up to 10 times the amount claimed.",
      "A worker with at least one year of continuous service who is retrenched must get 1 month's notice (or pay instead) and compensation of 15 days' average pay for each completed year.",
      "The employer must also pay 15 days' wages for each retrenched worker into a Worker Re-skilling Fund.",
    ],
    firstSteps: [
      "Ask HR in writing for the unpaid amount and the date it will be paid. Keep a copy.",
      "Send a formal salary demand letter with a clear deadline, such as 7 to 15 days.",
      "If you are still unpaid, complain to your state labour department or file a wage claim before the authority under the Code on Wages. For disputes in the central sphere, you can use the Samadhan portal.",
      "Get free legal aid (15100) or Tele-Law advice (14454) if the amount is large or the employer stops responding.",
    ],
    evidence: [
      "Appointment letter",
      "Payslips and bank statements showing missed payments",
      "Attendance records or timesheets",
      "Emails or messages about pay",
      "Resignation or termination letter, and relieving letter",
    ],
    helpSlugs: ["labour-samadhan", "legal-aid", "tele-law"],
    toolSlugs: ["salary-demand"],
    legalDetail: {
      law: "Code on Wages, 2019 (Sections 17 and 45); Industrial Relations Code, 2020. Both have been in force since 21 November 2025.",
      points: [
        "Section 17 of the Code on Wages sets payment deadlines, including payment within 2 working days of removal, dismissal, retrenchment, resignation or closure.",
        "Section 45 lets you file a claim before the authority appointed by the government within 3 years. The authority should try to decide it within 3 months.",
        "Under the Industrial Relations Code, retrenching a worker with 1 or more years of continuous service needs 1 month's notice or wages instead, plus 15 days' average pay per completed year.",
        "Government permission for lay-off, retrenchment or closure is now needed only in industrial establishments with 300 or more workers (earlier 100).",
        "The Code's definition of 'worker' leaves out people in managerial or administrative roles, and supervisors above a wage limit, so some protections differ for them.",
      ],
    },
    sources: [
      { label: "Industrial Relations Code, 2020 (PRS)", url: "https://prsindia.org/files/bills_acts/bills_parliament/2020/Industrial%20Relations%20Code,%202020.pdf" },
      { label: "The Code on Wages, 2019 explained (Mondaq)", url: "https://www.mondaq.com/india/employee-benefits-compensation/843340/the-code-on-wages-2019" },
      { label: "Samadhan portal (Ministry of Labour and Employment)", url: "https://samadhan.labour.gov.in/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "internships-gig-work",
    number: 17,
    area: "Work",
    title: "Internships, freelance and gig work",
    ageBands: ["COLLEGE", "WORKING"],
    oneLine: "Get every internship, freelance or gig arrangement in writing. Gig and platform workers can register on e-Shram, and platforms now pay into a social security fund for them.",
    rights: [
      "No general law fixes a stipend for private internships (apprenticeships under the Apprentices Act are different), so your written offer is what protects you.",
      "As a freelancer, your contract and invoices are your protection. Unpaid fees can be claimed like any other debt.",
      "If you register as a micro or small enterprise (Udyam), a buyer must pay you within the agreed time, and never later than 45 days. Late payments can be taken to MSME Samadhaan.",
      "Gig and platform workers are now recognised under the Code on Social Security, 2020, and aggregators pay 1 to 2% of their annual turnover into a social security fund for them.",
      "You can register on e-Shram to get a Universal Account Number and access government schemes.",
    ],
    firstSteps: [
      "Before starting, get the work, hours, pay, payment dates and who owns the work in writing. An email counts.",
      "Keep a record of what you deliver, and send invoices with due dates.",
      "If payment is late, send a polite reminder, then a formal demand. MSME-registered freelancers can file at samadhaan.msme.gov.in.",
      "Gig workers: register on eshram.gov.in, and use the platform's grievance process for pay or deactivation problems.",
    ],
    evidence: [
      "Offer letter, contract or the email where terms were agreed",
      "Invoices and delivery records",
      "Chats and emails about payment",
      "Bank statements",
      "Screenshots of earnings and ratings on the platform",
    ],
    helpSlugs: ["eshram", "msme-samadhaan", "legal-aid"],
    toolSlugs: ["salary-demand"],
    legalDetail: {
      law: "Code on Social Security, 2020 (gig and platform workers); Micro, Small and Medium Enterprises Development Act, 2006; Indian Contract Act, 1872.",
      points: [
        "The Code on Social Security came into force on 21 November 2025 and recognises gig and platform workers. The Social Security (Central) Rules, 2026 set out aggregator registration and contributions.",
        "Aggregators contribute 1 to 2% of annual turnover, capped at 5% of what they pay or owe to gig and platform workers.",
        "Under the MSMED Act, a buyer must pay a registered micro or small enterprise within the agreed period, not exceeding 45 days, or pay compound interest at three times the RBI bank rate.",
      ],
    },
    sources: [
      { label: "Aggregator obligations under the Code on Social Security (Taxmann)", url: "https://www.taxmann.com/post/blog/analysis-aggregator-obligations-code-on-social-security/" },
      { label: "e-Shram portal", url: "https://eshram.gov.in/" },
      { label: "MSME Samadhaan delayed payment portal", url: "https://samadhaan.msme.gov.in/" },
    ],
    draftedOn: "2026-10-03",
  },

  // ---------------------------------------------------------------- Family, home and personal safety
  {
    slug: "domestic-violence",
    number: 18,
    area: "Family, home and personal safety",
    title: "Domestic violence",
    ageBands: ["COLLEGE", "WORKING", "SENIOR"],
    oneLine: "Domestic violence includes physical, sexual, verbal, emotional and economic abuse. A woman can get a protection order and the right to stay in her home, and 181 is free, 24x7.",
    rights: [
      "Domestic violence includes physical, sexual, verbal and emotional abuse, and economic abuse such as taking your money or cutting you off from the household's resources.",
      "The law protects women in a domestic relationship: wives, women in live-in relationships, mothers, sisters, daughters and widows.",
      "A woman has the right to live in the shared household, even if she does not own it, and cannot be thrown out except by legal process.",
      "A magistrate can order the abuser to stop (a protection order), pay for expenses and losses, and decide temporary custody of children.",
      "Every woman is entitled to free legal aid, whatever her income.",
    ],
    firstSteps: [
      "If you are in danger now, call 112. Leave if you can do so safely.",
      "Call 181 (Women Helpline) or NCW's helpline 14490. They can connect you to a One Stop Centre (Sakhi) for shelter, medical, legal and counselling help.",
      "Ask the One Stop Centre or the police to connect you with the district Protection Officer, who helps you file a Domestic Incident Report and an application to the magistrate.",
      "Get a free lawyer through NALSA (15100) or your District Legal Services Authority.",
      "Use a phone and browser the abuser cannot check, and use private browsing.",
    ],
    evidence: [
      "Only if it is safe: photos of injuries and medical records",
      "Threatening messages",
      "Names of people who saw or heard the abuse",
      "Your safety comes before evidence. Do not take risks to collect it.",
    ],
    helpSlugs: ["emergency", "women", "ncw", "legal-aid", "mental-health"],
    toolSlugs: ["police-complaint"],
    legalDetail: {
      law: "Protection of Women from Domestic Violence Act, 2005; Bharatiya Nyaya Sanhita, 2023 (Sections 85 and 86 on cruelty by a husband or his relatives, earlier IPC Section 498A).",
      points: [
        "Section 17: right to reside in the shared household. Section 18: protection orders. Section 19: residence orders. Section 20: monetary relief. Section 21: custody orders. Section 22: compensation.",
        "Protection Officers are appointed by state governments to help women use the Act.",
        "One Stop Centres offer free legal help, counselling, medical aid and temporary shelter for up to 5 days.",
        "Men and children facing abuse at home can still call 112, and children can call 1098.",
      ],
    },
    supportNote: "If you are living with abuse, you deserve to be safe, and it is not your fault. Tele-MANAS (14416) offers free, confidential support. Use Quick exit at the top if someone comes near.",
    sensitive: true,
    sources: [
      { label: "Protection of Women from Domestic Violence Act, 2005 (NCW)", url: "https://cdn.ncw.gov.in/wp-content/uploads/2022/12/TheProtectionofWomenfromDomesticViolenceAct2005_0.pdf" },
      { label: "NCW 24x7 helpline (Vikaspedia)", url: "https://en.vikaspedia.in/social-welfare/women-and-child-development/women-development-1/pro-woman-initiatives/247-helpline-for-women-affected-by-violence" },
      { label: "NCW short-code helpline 14490 (The Tribune, November 2025)", url: "https://www.tribuneindia.com/news/india/ncw-launches-24x7-short-code-helpline-14490-for-women-in-distress" },
    ],
    draftedOn: "2026-10-03",
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
  {
    slug: "senior-citizens",
    number: 20,
    area: "Family, home and personal safety",
    title: "Senior citizens: maintenance and care",
    ageBands: ["SENIOR"],
    oneLine: "Children and heirs have a legal duty to look after parents and senior citizens. A Maintenance Tribunal can order up to ₹10,000 a month, and Elderline 14567 gives free help.",
    rights: [
      "Parents and senior citizens who cannot support themselves can claim monthly maintenance from their adult children, or from relatives who would inherit their property.",
      "A Maintenance Tribunal decides the claim, normally within 90 days, and can order up to ₹10,000 a month.",
      "If you transferred property to someone on condition that they look after you, and they fail to, the Tribunal can declare the transfer void.",
      "You do not need a lawyer at the Tribunal. Lawyers are not allowed to represent the parties there.",
      "Abandoning a senior citizen is a crime.",
    ],
    firstSteps: [
      "Call Elderline on 14567 for information, guidance and help with abuse.",
      "Apply to the Maintenance Tribunal for maintenance. You can apply yourself, or an organisation can apply for you.",
      "Do not sign property papers you do not understand. Get independent advice first.",
      "For abuse or threats, call 112. For free legal advice, call NALSA on 15100 or Tele-Law on 14454.",
    ],
    evidence: [
      "Age proof",
      "Proof of your income and expenses",
      "Names and addresses of your children or relatives",
      "Property papers and any gift or transfer deed",
      "Records or messages showing neglect or abuse",
    ],
    helpSlugs: ["senior", "legal-aid", "tele-law", "emergency"],
    toolSlugs: [],
    legalDetail: {
      law: "Maintenance and Welfare of Parents and Senior Citizens Act, 2007.",
      points: [
        "Section 5: a maintenance application should be decided within 90 days of serving notice, extendable once by up to 30 days in exceptional cases.",
        "Section 9: the maximum maintenance the Tribunal can order is ₹10,000 a month.",
        "Section 17: parties cannot be represented by a lawyer before the Tribunal.",
        "Section 23: a property transfer made on condition of care can be declared void if the person fails to provide it.",
        "Section 24: abandoning a senior citizen is punishable with up to 3 months' imprisonment, a fine of up to ₹5,000, or both.",
      ],
    },
    sources: [
      { label: "Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (Supreme Court Legal Services Committee)", url: "https://sclsc.gov.in/theme/front/pdf/ACTS%20FINAL/THE-MAINTENANCE-AND-WELFARE-OF-PARENTS-AND-SENIOR-CITIZENS-ACT-2007.pdf" },
      { label: "The Senior Citizens Act explained (LiveLaw)", url: "https://www.livelaw.in/law-firms/law-firm-articles-/the-maintenance-and-welfare-of-parents-and-senior-citizens-act-ang-partners-251685" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "disability-rights",
    number: 21,
    area: "Family, home and personal safety",
    title: "Rights of persons with disabilities",
    ageBands: ["SCHOOL", "COLLEGE", "WORKING", "SENIOR"],
    oneLine: "The law recognises 21 disabilities. People with a benchmark disability (40% or more) get reserved seats in higher education and government jobs, and a UDID card works across India.",
    rights: [
      "Discrimination because of disability is prohibited, and public buildings, transport and services must be made accessible.",
      "Children with benchmark disabilities have the right to free education from age 6 to 18.",
      "At least 5% of seats in government and government-aided higher education institutions are reserved for persons with benchmark disabilities.",
      "At least 4% of government job vacancies are reserved for persons with benchmark disabilities.",
      "You can ask for reasonable accommodation, such as extra time or a scribe in exams, or changes at work.",
    ],
    firstSteps: [
      "Get a disability certificate and UDID card through swavlambancard.gov.in.",
      "Ask the school, college, employer or office in writing for the accommodation you need.",
      "If they refuse, complain to the establishment's grievance redressal officer, then the State Commissioner for Persons with Disabilities or the Chief Commissioner (ccdisabilities.nic.in).",
      "Persons with disabilities are entitled to free legal aid, whatever their income (NALSA 15100).",
    ],
    evidence: [
      "Disability certificate or UDID card",
      "Your written request and the reply",
      "Admission or recruitment notices",
      "Photos of inaccessible facilities",
    ],
    helpSlugs: ["disability", "legal-aid"],
    toolSlugs: ["rti-application"],
    legalDetail: {
      law: "Rights of Persons with Disabilities Act, 2016.",
      points: [
        "The Act lists 21 specified disabilities, including blindness, low vision, locomotor disability, cerebral palsy, autism spectrum disorder, intellectual disability, specific learning disabilities, mental illness, acid attack victims, thalassaemia, haemophilia and sickle cell disease.",
        "Benchmark disability means at least 40% of a specified disability, as certified by the certifying authority.",
        "Section 32 reserves at least 5% of seats in government and government-aided higher education institutions; Section 34 reserves at least 4% of government job vacancies.",
        "The Chief Commissioner and State Commissioners for Persons with Disabilities monitor the Act and act as grievance redressal bodies.",
      ],
    },
    sources: [
      { label: "Rights of Persons with Disabilities Act, 2016 (Vikaspedia)", url: "https://en.vikaspedia.in/viewcontent/social-welfare/differently-abled-welfare/policies-and-standards/rights-of-persons-with-disabilities-act-2016?lgn=en" },
      { label: "UDID card portal", url: "https://swavlambancard.gov.in/" },
      { label: "Chief Commissioner for Persons with Disabilities", url: "https://ccdisabilities.nic.in/" },
    ],
    draftedOn: "2026-10-03",
  },

  // ---------------------------------------------------------------- Police, courts and government
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
    sources: [{ label: "NALSA: free legal services", url: "https://nalsa.gov.in/" }],
    draftedOn: "2026-10-02",
  },
  {
    slug: "rti",
    number: 23,
    area: "Police, courts and government",
    title: "Right to Information (RTI)",
    ageBands: ["COLLEGE", "WORKING", "SENIOR"],
    oneLine: "Any citizen can ask a government office for information for a ₹10 fee. It must reply within 30 days, or within 48 hours if someone's life or liberty is at stake.",
    rights: [
      "Any Indian citizen can ask a public authority for information it holds, without giving a reason.",
      "The fee for central government offices is ₹10. People below the poverty line pay nothing.",
      "The Public Information Officer must reply within 30 days, or within 48 hours if the information concerns someone's life or liberty.",
      "If there is no reply or the reply is unsatisfactory, you can file a first appeal within 30 days, and a second appeal to the Information Commission within 90 days.",
      "Some information is exempt, including information that relates to other people's personal information.",
    ],
    firstSteps: [
      "Work out which department holds the information, and write short, specific, numbered questions.",
      "For central government bodies, file online at rtionline.gov.in and pay ₹10 online. For state bodies, use your state's RTI portal or post an application with the fee.",
      "Keep the registration number and note the 30-day deadline.",
      "If there is no reply or it is incomplete, file the first appeal within 30 days, then a second appeal to the Central or State Information Commission within 90 days.",
    ],
    evidence: [
      "A copy of your application",
      "Fee payment proof (or BPL certificate)",
      "Registration number or postal receipt",
      "The reply and the date you received it",
    ],
    helpSlugs: ["rti-online", "legal-aid"],
    toolSlugs: ["rti-application"],
    legalDetail: {
      law: "Right to Information Act, 2005; RTI Rules, 2012 (₹10 fee for central public authorities).",
      points: [
        "Section 7(1): reply within 30 days, or within 48 hours where the information concerns the life or liberty of a person.",
        "Section 7(5): no fee for persons below the poverty line.",
        "Section 19: first appeal within 30 days; second appeal within 90 days to the Central or State Information Commission.",
        "Since 13 November 2025, Section 8(1)(j), as amended by the DPDP Act, lets a public authority refuse 'information which relates to personal information'.",
        "State governments set their own fees and rules for state public authorities.",
      ],
    },
    sources: [
      { label: "RTI Online portal", url: "https://rtionline.gov.in/" },
      { label: "RTI fees and payment modes (Vikaspedia)", url: "https://en.vikaspedia.in/viewcontent/e-governance/about-rti-act-2005/rti-fees-and-payment-modes?lgn=en" },
      { label: "DPDP Act commencement, including the RTI amendment (Taxmann)", url: "https://www.taxmann.com/post/blog/govt-notifies-commencement-dates-for-dpdp-act/" },
    ],
    draftedOn: "2026-10-03",
  },
  {
    slug: "legal-aid",
    number: 24,
    area: "Police, courts and government",
    title: "Free legal aid and how courts work",
    ageBands: ["SCHOOL", "COLLEGE", "WORKING", "SENIOR"],
    oneLine: "Every woman and child, SC and ST members, persons with disabilities, people in custody and people below an income limit can get a free lawyer through NALSA (15100).",
    rights: [
      "Free legal services are a legal right for women, children, SC and ST members, persons with disabilities, victims of trafficking and disasters, industrial workers, people in custody, and people below the income limit set by each state.",
      "Women and children qualify whatever their income.",
      "Free legal services include advice, drafting, a lawyer to represent you in court, and court costs.",
      "Lok Adalats settle cases without court fees. Their awards are final and cannot be appealed.",
    ],
    firstSteps: [
      "Call NALSA's helpline on 15100, or visit the District Legal Services Authority at your district court.",
      "For quick advice before going to court, call Tele-Law on 14454, use the Tele-Law app, or visit a Common Service Centre.",
      "Ask whether your case can be settled at a Lok Adalat. National Lok Adalats are held across India on fixed dates; the next is on 12 December 2026.",
      "Take all your papers to the first meeting.",
    ],
    evidence: [
      "Any notice, summons or court papers",
      "ID and address proof",
      "Income certificate, if you are applying on income grounds",
      "A short timeline of what happened",
    ],
    helpSlugs: ["legal-aid", "tele-law"],
    toolSlugs: [],
    legalDetail: {
      law: "Legal Services Authorities Act, 1987.",
      points: [
        "Section 12 lists who is entitled to free legal services. Women and children qualify regardless of income.",
        "Each state sets its own income limit. For cases before the Supreme Court Legal Services Committee, it is ₹5 lakh a year.",
        "Section 21: a Lok Adalat award counts as a civil court decree, is final and binding, and cannot be appealed. Court fees already paid are refunded when a case settles there.",
        "Legal services are organised at four levels: NALSA nationally, State Legal Services Authorities, District Legal Services Authorities and Taluk Legal Services Committees.",
      ],
    },
    sources: [
      { label: "NALSA: free legal services", url: "https://nalsa.gov.in/" },
      { label: "Tele-Law", url: "https://www.tele-law.in/" },
      { label: "Legal Services Authorities Act explained (Vajiram and Ravi)", url: "https://vajiramandravi.com/current-affairs/legal-services-authorities-act-1987/" },
      { label: "National Lok Adalat dates for 2026 (Angel One)", url: "https://www.angelone.in/news/economy/national-lok-adalat-schedule-march-may-september-and-december-dates-2026-released" },
    ],
    draftedOn: "2026-10-03",
  },
];

export function legalGuideBySlug(slug: string): LegalGuide | undefined {
  return LEGAL_GUIDES.find((g) => g.slug === slug);
}
