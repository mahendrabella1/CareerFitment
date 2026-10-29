/**
 * Spotlight (/account/spotlight/*) - OneGrasp's paid "career boosters": present
 * research at a OneGrasp conference or publish a paper, research-writing
 * support, help getting an ISBN or an ISSN, and Awardees Magazine. Every
 * request form goes to support@onegrasp.com (app/api/boosters/request); the
 * fee is quoted by the team, never charged here.
 *
 * The ISBN and ISSN facts come from the agencies' own pages (isbn.gov.in's
 * About and FAQ, the ISSN National Centre at CSIR-NIScPR), checked in October
 * 2026. Both numbers are free from the agency - what OneGrasp charges for is
 * the help around them, and the pages say so.
 */

export const CHECKED = "October 2026";

export const ONEGRASP = {
  email: "support@onegrasp.com",
  phones: ["+91 89777 60441", "+91 89777 60442", "+91 89777 60443"],
  tel: "+918977760442",
  whatsapp: "https://wa.me/918977760443",
  events: "https://onegrasp.com/events/",
  academicWriting: "https://onegrasp.com/academicwriting",
} as const;

/** The live list of OneGrasp conferences (the events site's own feed). */
export const CONFERENCES_FEED = "https://onegrasp.com/wp-json/onegrasp/v1/conferences";

export type ServiceId = "publishing" | "writing" | "isbn" | "issn" | "magazine";

export interface Service {
  id: ServiceId;
  title: string;
  /** One line for cards. */
  short: string;
  /** Who it suits. */
  forWho: string;
  icon: string;
  href: string;
}

export const SERVICES: Service[] = [
  { id: "publishing", title: "Research publishing", short: "Present your abstract at a OneGrasp international conference, or publish your paper - with a DOI.", forWho: "Students, researchers, faculty and professionals", icon: "flask", href: "/account/spotlight/conferences" },
  { id: "writing", title: "Research writing", short: "Help with your paper, thesis or proposal - from the research question to a publication-ready draft.", forWho: "Undergraduates, PhD scholars, researchers, faculty", icon: "doc", href: "/account/spotlight/writing" },
  { id: "isbn", title: "ISBN for your book", short: "Publish a book with its own ISBN - we help you meet the rules and apply.", forWho: "Authors who live in India, and institutions", icon: "book", href: "/account/spotlight/isbn" },
  { id: "issn", title: "ISSN for a journal", short: "Start a journal or magazine with its own ISSN - we help you get it ready for the ISSN centre's checks.", forWho: "Undergraduates and up, and working professionals", icon: "bookmark", href: "/account/spotlight/issn" },
  { id: "magazine", title: "Awardees Magazine", short: "Get your article, blog or story into an international magazine, or be interviewed for its podcast.", forWho: "Everyone with something worth sharing", icon: "star", href: "/account/spotlight/magazine" },
];

/** ISSN is for degree level and up, and for working professionals. An
 *  unknown category (an admin, an old account) is let through. */
export function issnAllowed(category?: string | null): boolean {
  if (!category) return true;
  return category === "graduate" || category === "experienced_professional";
}

export const servicesFor = (category?: string | null) => SERVICES.filter((s) => s.id !== "issn" || issnAllowed(category));

/* ---------------- official facts ---------------- */

export const ISBN = {
  agency: "Raja Rammohun Roy National Agency for ISBN (RRRNA)",
  under: "Book Promotion Division, Department of Higher Education, Ministry of Education",
  portal: "https://isbn.gov.in/",
  register: "https://isbn.gov.in/ApplicantRegistrationlatest",
  faq: "https://isbn.gov.in/Home/Faq",
  search: "https://isbn.gov.in/Home/IsbnSearch",
  address: "Room No. 13, Jeevan Deep Building, 4th Floor, Parliament Street, New Delhi - 110001",
  general: { email: "isbn-mhrd@gov.in", phone: "+91-11-2334 1739" },
  technical: { email: "isbnhelp@inflibnet.ac.in", phone: "+91-79-2326 8302" },
  /** The 13 digits of an Indian ISBN, part by part (the FAQ's own example). */
  parts: [
    { digits: "978", name: "GS1 prefix", text: "978 or 979 - marks it as a book number." },
    { digits: "93", name: "Country", text: "93 or 81 for India." },
    { digits: "5300", name: "Publisher", text: "You, or your publisher. Shorter = a bigger block of numbers." },
    { digits: "895", name: "Title", text: "This book, in this edition and format." },
    { digits: "6", name: "Check digit", text: "Catches typing mistakes." },
  ],
  who: [
    "A person or organisation that publishes from an office based in India.",
    "An author publishing their own book must live in India. Nationality and where you plan to sell don't matter.",
    "The ISBN goes in the publisher's name - whoever pays for and owns the publication. That can be you, if you self-publish; it is not the printer.",
  ],
  eligible: ["Printed books and booklets", "E-books", "Audiobooks", "Braille books", "Educational videos and software", "Maps and atlases", "A book with a CD or DVD", "Art and illustrated books with a title page"],
  notEligible: ["Journals and magazines as a whole (they get an ISSN)", "CVs and personal documents", "Adverts and promotional material", "Printed music", "Greeting cards", "Games", "Personalised books not sold to the public"],
  rules: [
    { q: "Does it cost anything?", a: "No - the agency gives ISBNs free of cost." },
    { q: "Does each format need its own?", a: "Yes. Paperback, hardback, e-book and audiobook each get their own ISBN." },
    { q: "Revised it?", a: "A substantial change of text needs a new ISBN, and the book should say \"revised edition\". A plain reprint keeps the same one." },
    { q: "New title or author name?", a: "Both need a new ISBN. A price change doesn't." },
    { q: "Can an ISBN be reused?", a: "Never - not even for a book that was never published." },
    { q: "Is it a copyright?", a: "No. An ISBN gives no legal or copyright protection, and no law requires one - it's how shops and libraries find and order your book." },
    { q: "Barcode?", a: "The agency doesn't make barcodes - your printer or designer does." },
    { q: "Where does it go?", a: "On the copyright page (the back of the title page), and on the back cover if there's no barcode." },
  ],
  steps: [
    "Decide who the publisher is: you (self-publishing) or an institution or company.",
    "Register on the ISBN portal, isbn.gov.in, as an applicant - everyone registers fresh on the new portal.",
    "Fill in the application and upload the proof the portal asks for.",
    "Once approved, enter each book's details (title, author, format, language) to get its number.",
    "Print the ISBN on the copyright page, and keep the book's details up to date on the portal.",
  ],
  platformNote: "A self-publishing platform's free ISBN makes the platform the publisher. If you later move your book elsewhere, you'll need a new ISBN - so it's better to have your own from the start.",
};

/** From the centre's "Guidelines for requesting an ISSN" and its "Detailed
 *  information document" (both PDFs on nsl.niscpr.res.in/ISSNPROCESS). */
export const ISSN = {
  centre: "ISSN National Centre - India, National Science Library, CSIR-NIScPR",
  address: "14, Satsang Vihar Marg, New Delhi - 110067",
  apply: "https://nsl.niscpr.res.in/ISSNPROCESS/applyissn.jsp",
  site: "https://nsl.niscpr.res.in/ISSNPROCESS/issn.jsp",
  guidelines: "https://nsl.niscpr.res.in/ISSNPROCESS/ISSN%20India%20Guidelines.pdf",
  email: "issnindia.niscpr@csir.res.in",
  what: "An ISSN is an 8-digit number for a publication that keeps coming out under one title - a journal, magazine, newsletter, newspaper or book series. It identifies the title, not one issue or one article. A single book gets an ISBN instead.",
  when: [
    { title: "A print journal", text: "Can get its ISSN before the first issue, with full details and an advanced mock-up - but not more than one month before the first issue comes out. It's only registered once the centre receives the first issue: the title page, the editorial page and at least 5-6 original articles (10 for a yearly one)." },
    { title: "An online journal", text: "Gets its ISSN only after the first issue is online, with enough articles to be a real issue: at least 5 (10 for a yearly one), each article linked separately - not one PDF of the whole issue." },
  ],
  needs: [
    "The same title everywhere - website, cover, articles and the form. Check the ISSN databases first so the title isn't taken.",
    "The publisher's name and full address in India on the publication or its website.",
    "An editorial board of at least five experts in the subject, each with their designation, institutional address, institutional email (not Gmail or Yahoo) and a profile link on their institution's site. For a scholarly journal they should be senior faculty, not students; an \"international\" journal needs members from abroad.",
    "An online journal needs its own page, linked from the institution's website, with: about the journal, aims and scope, frequency, language, starting year, format, publisher details, author guidelines, and an archive of issues.",
    "Every article's first page shows the journal's name, volume, issue, month and year, and page numbers.",
  ],
  facts: [
    { q: "Does it cost anything?", a: "No - ISSNs are assigned free of charge." },
    { q: "How long does it take?", a: "At least 30 working days. Incomplete or inaccurate forms are rejected." },
    { q: "Do I need RNI registration?", a: "Not for a scientific, technical or academic journal (Press and Registration of Periodicals Act, 2023). A newspaper or news magazine does need it." },
    { q: "Who applies?", a: "The publisher, online. The centre says it has no agents or brokers - anyone can help you prepare, but nobody can get you an ISSN on the side." },
    { q: "Does an ISSN mean the journal is approved?", a: "No. It identifies the title; it doesn't approve the journal or its articles. It can be refused or withdrawn for plagiarised articles or misleading claims (board members, indexing, address)." },
  ],
};

export const MAGAZINE = {
  name: "Awardees Magazine",
  tagline: "An international magazine",
  reg: "Reg. No. 3071-1649",
  url: "https://magazine.awardees.org/",
  publish: "https://magazine.awardees.org/publish-with-us/",
  guidelines: "https://magazine.awardees.org/author-guidelines/",
  special: "https://magazine.awardees.org/guidelines-for-spacial-issue/",
  email: "magazine@awardees.org",
  parent: { name: "Awardees", url: "https://awardees.org/", email: "info@awardees.org", phone: "+91 62813 33383", text: "Conferences, awards, faculty development programmes, internships and certifications." },
  address: "2000 S Colorado Blvd, BLDG 1-2000, Denver, CO 80222, United States",
  sections: ["Education", "Technology", "Business", "Healthcare", "Research", "Law & Judiciary", "Student Stories", "Interviews", "Podcasts"],
  article: [
    { part: "Abstract", limit: "under 200 words" },
    { part: "Main content", limit: "under 500 words" },
    { part: "Conclusion", limit: "under 200 words" },
    { part: "References", limit: "no limit - they should support the main content" },
  ],
  podcast: "Experts send their profile (achievements); the team then gets in touch to plan the conversation.",
  specialIssues: [
    { name: "Institutional Excellence", for: "Universities, colleges, schools, hospitals, research centres, NGOs, associations" },
    { name: "Corporate Excellence", for: "Companies, MNCs, startups, SMEs, manufacturers" },
    { name: "Entrepreneurs & Business Leaders", for: "Founders, CEOs, consultants, business owners" },
    { name: "Industry & Innovation", for: "Technology, healthcare, finance, real estate, agriculture and other sectors" },
    { name: "Leadership & Achievers", for: "Award winners, scientists, doctors, educators, social-impact leaders" },
  ],
};

export const WRITING = {
  programme: {
    name: "Academic Writing Programme",
    url: ONEGRASP.academicWriting,
    text: "OneGrasp's 20-chapter live programme for PhD scholars, researchers, academicians and working professionals - with a test, a certificate and CPD credits (PACE Council). The last batch ran on 25 September 2026; ask us for the next one.",
  },
  /** The programme's eight stages, from its own curriculum. */
  stages: [
    { name: "Foundations", text: "How academic writing works and how to read the literature." },
    { name: "Your topic", text: "Choosing a topic, the problem statement and the research gap." },
    { name: "Your question", text: "Research questions and a conceptual framework." },
    { name: "Proposal", text: "Planning a proposal or synopsis that gets approved." },
    { name: "Literature review", text: "Searching, reading critically and writing a review that compares, not summarises." },
    { name: "Methodology", text: "Choosing a method, sampling and data, and writing the chapter." },
    { name: "Results and structure", text: "Data analysis, the paper's structure, the introduction and conclusion." },
    { name: "Publication-ready", text: "Style, referencing and citations, editing and proofreading." },
  ],
  integrity: "You stay the author. We coach, review and edit - we don't write work for you to hand in as your own, and every reference must be one you've read.",
};

/* ---------------- request forms ---------------- */

export type FormId = "conference" | "journal" | "writing" | "isbn" | "issn" | "magazine";

export interface Field {
  name: string;
  label: string;
  kind: "text" | "textarea" | "select" | "date" | "url";
  required?: boolean;
  options?: string[];
  /** Longest answer kept, in characters. */
  max: number;
  hint?: string;
  placeholder?: string;
}

export interface FormSpec {
  id: FormId;
  service: ServiceId;
  title: string;
  /** What the team does once it arrives. */
  intro: string;
  fields: Field[];
  /** The optional attachment's label. */
  file: string;
}

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const FILE_TYPES = [".doc", ".docx", ".pdf"];

const MESSAGE: Field = { name: "message", label: "Anything else we should know", kind: "textarea", max: 2000 };

export const FORMS: Record<FormId, FormSpec> = {
  conference: {
    id: "conference", service: "publishing", title: "Submit an abstract",
    intro: "The team checks your abstract against the conference's theme and writes back with the review, the fee for your country and role, and the next steps.",
    fields: [
      { name: "conference", label: "Conference", kind: "text", required: true, max: 300, hint: "Pick one from the list above, or type its name." },
      { name: "role", label: "I want to take part as", kind: "select", required: true, max: 60, options: ["Speaker (oral presentation)", "Poster presenter", "Listener (attend only)"] },
      { name: "title", label: "Abstract title", kind: "text", required: true, max: 250 },
      { name: "authors", label: "Authors and their institutions", kind: "text", required: true, max: 600, placeholder: "e.g. A. Rao (XYZ College, Hyderabad); B. Shah (...)" },
      { name: "abstract", label: "Abstract", kind: "textarea", required: true, max: 4000, hint: "Paste it here. You can also attach the Word file." },
      { name: "country", label: "Country you'll present from", kind: "text", required: true, max: 80, hint: "The fee depends on it." },
      MESSAGE,
    ],
    file: "Abstract file (Word or PDF)",
  },
  journal: {
    id: "journal", service: "publishing", title: "Publish a paper",
    intro: "Tell us about the paper. The team suggests where it fits - a OneGrasp conference's proceedings or a journal - and sends the fee and the steps.",
    fields: [
      { name: "title", label: "Paper title", kind: "text", required: true, max: 250 },
      { name: "subject", label: "Subject area", kind: "text", required: true, max: 120 },
      { name: "stage", label: "Where it is now", kind: "select", required: true, max: 60, options: ["Idea or early draft", "Full draft", "Finished paper", "Already presented at a conference"] },
      { name: "target", label: "I'd like to publish in", kind: "select", required: true, max: 60, options: ["Conference proceedings (with a DOI)", "A peer-reviewed journal", "Not sure - advise me"] },
      { ...MESSAGE, hint: "Any indexing you need (Scopus, Web of Science...), a deadline, your co-authors." },
    ],
    file: "The paper (Word or PDF)",
  },
  writing: {
    id: "writing", service: "writing", title: "Ask for writing support",
    intro: "A OneGrasp mentor looks at what you have and replies with how they'd help, the time it takes and the fee.",
    fields: [
      { name: "work", label: "What are you writing?", kind: "select", required: true, max: 60, options: ["Research paper or article", "Thesis or dissertation", "Research proposal or synopsis", "Conference abstract", "Book chapter", "Something else"] },
      { name: "stage", label: "Where do you need help?", kind: "select", required: true, max: 60, options: ["Choosing a topic and question", "The proposal", "Literature review", "Methodology", "Writing up the results", "Referencing and formatting", "Editing a finished draft"] },
      { name: "subject", label: "Subject", kind: "text", required: true, max: 120 },
      { name: "deadline", label: "Your deadline", kind: "date", max: 10 },
      { name: "message", label: "What help do you need?", kind: "textarea", required: true, max: 2000 },
    ],
    file: "Your draft (Word or PDF)",
  },
  isbn: {
    id: "isbn", service: "isbn", title: "Get help with an ISBN",
    intro: "The team checks your book and who should be its publisher, then helps you register and apply on the ISBN portal. They reply with the fee for this help - the ISBN itself is free.",
    fields: [
      { name: "title", label: "Book title", kind: "text", required: true, max: 250 },
      { name: "format", label: "Format", kind: "select", required: true, max: 60, options: ["Print", "E-book", "Print and e-book", "Audiobook"] },
      { name: "publisher", label: "Who is publishing it?", kind: "select", required: true, max: 80, options: ["Me - I'm self-publishing and live in India", "My institution or company", "Not sure yet"] },
      { name: "stage", label: "Where is the book now?", kind: "select", required: true, max: 60, options: ["Still writing", "Manuscript ready", "Designed and ready to print"] },
      { name: "language", label: "Language", kind: "text", max: 60 },
      MESSAGE,
    ],
    file: "Manuscript or title page (Word or PDF)",
  },
  issn: {
    id: "issn", service: "issn", title: "Get help with an ISSN",
    intro: "The team checks the journal against the ISSN centre's guidelines (title, editorial board, first issue, website), helps you get each part ready, and replies with the fee for this help. The ISSN itself is free, and the publisher sends the application.",
    fields: [
      { name: "title", label: "Journal or magazine title", kind: "text", required: true, max: 250 },
      { name: "medium", label: "Published", kind: "select", required: true, max: 40, options: ["In print", "Online", "In print and online"] },
      { name: "frequency", label: "How often", kind: "select", required: true, max: 40, options: ["Monthly", "Every two months", "Quarterly", "Twice a year", "Yearly", "Other"] },
      { name: "publisher", label: "Publisher (institution or organisation)", kind: "text", required: true, max: 200 },
      { name: "firstIssue", label: "First issue", kind: "select", required: true, max: 40, options: ["Already published", "Ready to publish", "Being planned"] },
      { name: "board", label: "Editorial board", kind: "select", required: true, max: 60, options: ["Five or more members in place", "Fewer than five so far", "Not formed yet"] },
      { name: "website", label: "Journal website", kind: "url", max: 300, hint: "Needed for an online ISSN." },
      MESSAGE,
    ],
    file: "Cover or first issue (Word or PDF)",
  },
  magazine: {
    id: "magazine", service: "magazine", title: "Submit to Awardees Magazine",
    intro: "The team checks your piece against the magazine's guidelines and replies with the next steps and the fee, if one applies to your submission.",
    fields: [
      { name: "type", label: "What are you sending?", kind: "select", required: true, max: 60, options: ["An article", "A blog post", "A podcast interview (my profile)", "A special-issue feature"] },
      { name: "title", label: "Title or topic", kind: "text", required: true, max: 250 },
      { name: "section", label: "Section", kind: "select", required: true, max: 60, options: [...MAGAZINE.sections.filter((s) => s !== "Podcasts" && s !== "Interviews"), "Other"] },
      { name: "summary", label: "A short summary, or your profile for a podcast", kind: "textarea", required: true, max: 3000 },
      MESSAGE,
    ],
    file: "Your article or profile (Word or PDF)",
  },
};

export const formsFor = (service: ServiceId) => Object.values(FORMS).filter((f) => f.service === service);

export type CleanResult = { ok: true; data: Record<string, string> } | { ok: false; error: string };

/** Keeps only the form's own fields, trimmed and cut to length, and checks
 *  what's required (shared by the browser form and the server route). */
export function cleanRequest(formId: string, raw: Record<string, unknown>): CleanResult {
  const spec = FORMS[formId as FormId];
  if (!spec) return { ok: false, error: "Unknown request." };
  const data: Record<string, string> = {};
  for (const f of spec.fields) {
    const v = String(raw?.[f.name] ?? "").replace(/\r\n/g, "\n").trim().slice(0, f.max);
    if (!v) {
      if (f.required) return { ok: false, error: `Please fill in "${f.label}".` };
      continue;
    }
    if (f.kind === "select" && f.options && !f.options.includes(v)) return { ok: false, error: `Please choose an option for "${f.label}".` };
    if (f.kind === "url" && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v)) return { ok: false, error: `"${f.label}" should be a web address starting with https://` };
    if (f.kind === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { ok: false, error: `"${f.label}" isn't a date.` };
    data[f.name] = v;
  }
  return { ok: true, data };
}

/** A file the forms accept: Word or PDF, up to 4 MB. */
export function fileProblem(name: string, size: number): string | null {
  const ext = (name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
  if (!FILE_TYPES.includes(ext)) return "Attach a Word (.doc, .docx) or PDF file.";
  if (size > MAX_FILE_BYTES) return "The file is over 4 MB - attach a smaller one, or send it by email after you hear from us.";
  if (size === 0) return "That file is empty.";
  return null;
}

/* ---------------- conferences ---------------- */

export interface Conference {
  id: number;
  title: string;
  category: string;
  /** The day it runs (YYYY-MM-DD), when the feed has one. */
  date: string | null;
  /** The feed's own wording of the dates ("Oct 28-29"). */
  dateText: string;
  /** Abstract deadline (YYYY-MM-DD). */
  abstractBy: string | null;
  /** Registration deadline (YYYY-MM-DD). */
  registerBy: string | null;
  mode: string;
  url: string;
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-10-13", "October 13, 2026" or "13 October 2026" -> "2026-10-13"; anything else -> null. */
export function parseDay(s: unknown): string | null {
  const t = String(s ?? "").trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i);
  let month = -1, day = 0, year = 0;
  if (m) { month = MONTHS.findIndex((x) => x.startsWith(m![1].toLowerCase().slice(0, 3))); day = Number(m[2]); year = Number(m[3]); }
  else {
    m = t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\.?,?\s+(\d{4})$/i);
    if (m) { month = MONTHS.findIndex((x) => x.startsWith(m![2].toLowerCase().slice(0, 3))); day = Number(m[1]); year = Number(m[3]); }
  }
  if (month < 0 || day < 1 || day > 31 || year < 2000) return null;
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Today in India (YYYY-MM-DD) - deadlines are Indian dates. */
export function todayIST(now: Date = new Date()): string {
  const d = new Date(now.getTime() + 5.5 * 3600_000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** The feed's conferences that haven't happened yet, soonest first. */
export function upcomingConferences(raw: unknown, today: string): Conference[] {
  if (!Array.isArray(raw)) return [];
  const out: Conference[] = [];
  for (const r of raw as Record<string, unknown>[]) {
    if (!r || typeof r !== "object" || r.is_past === true) continue;
    const url = String(r.permalink ?? "");
    const title = String(r.title ?? "").replace(/\s+/g, " ").trim();
    if (!title || !/^https:\/\/onegrasp\.com\//.test(url)) continue;
    const date = parseDay(r.event_date);
    if (date && date < today) continue;
    out.push({
      id: Number(r.id) || 0,
      title,
      category: String(r.category ?? "").trim() || "Other",
      date,
      dateText: String(r.dates ?? "").trim(),
      abstractBy: parseDay(r.deadline),
      registerBy: parseDay(r.registration_deadline),
      mode: String(r.mode ?? "").trim() || "Online",
      url,
    });
  }
  return out.sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999") || a.title.localeCompare(b.title));
}

/** Abstracts still accepted: no deadline given, or it hasn't passed. */
export const abstractOpen = (c: Conference, today: string) => !c.abstractBy || c.abstractBy >= today;
