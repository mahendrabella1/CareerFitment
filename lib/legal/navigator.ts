/**
 * Situation Navigator decision tree - pure data walked entirely on the
 * client (see components/legal/Navigator.tsx). Answers never leave the
 * device: this file has no Firestore import and no "use client" directive
 * because it needs neither - it's just a lookup table.
 *
 * Safety-first by construction: "start" is always the danger check, and
 * every path that answers "Yes" goes straight to "sos" before anything
 * else - never buried behind other questions. Every guide is reachable in
 * three taps: danger check, life area, situation.
 */

export type NavNode =
  | { kind: "question"; id: string; text: string; options: { label: string; next: string }[] }
  | { kind: "sos" }
  | { kind: "guide"; slug: string };

export const tree: Record<string, NavNode> = {
  start: {
    kind: "question", id: "start", text: "Are you in danger right now?",
    options: [{ label: "Yes", next: "sos" }, { label: "No", next: "area" }],
  },
  sos: { kind: "sos" },
  area: {
    kind: "question", id: "area", text: "What part of life is this about?",
    options: [
      { label: "School or college", next: "school" },
      { label: "Something online", next: "online" },
      { label: "Money, shopping, a loan or renting", next: "money" },
      { label: "Work, salary or an internship", next: "work" },
      { label: "Family, home or personal safety", next: "family" },
      { label: "Police, a government office or a court", next: "police" },
    ],
  },
  school: {
    kind: "question", id: "school", text: "What's going on?",
    options: [
      { label: "I can't get admission, or the school wants a capitation fee", next: "g-right-to-education" },
      { label: "A teacher hit or humiliated me, or I'm being bullied at school", next: "g-school-bullying" },
      { label: "Someone touched me in a way that felt wrong, or I'm worried about a child", next: "g-safe-touch" },
      { label: "Seniors are ragging me in college", next: "g-ragging" },
      { label: "A child is being made to work or to marry", next: "g-child-labour-marriage" },
    ],
  },
  online: {
    kind: "question", id: "online", text: "What happened?",
    options: [
      { label: "I lost money to a scam", next: "g-online-fraud" },
      { label: "Someone is harassing or bullying me online", next: "g-cyberbullying" },
      { label: "My photos are being misused, morphed or threatened", next: "g-photo-misuse" },
      { label: "A company is misusing my data or won't delete it", next: "g-data-privacy" },
    ],
  },
  money: {
    kind: "question", id: "money", text: "What's the problem?",
    options: [
      { label: "I bought something faulty and the seller won't help", next: "g-faulty-product" },
      { label: "A problem with my bank or payment app, or money left my account", next: "g-bank-problems" },
      { label: "Loan agents or a loan app are harassing me", next: "g-loan-recovery" },
      { label: "My rent agreement, deposit or landlord", next: "g-renting" },
    ],
  },
  work: {
    kind: "question", id: "work", text: "What's happening at work?",
    options: [
      { label: "I'm starting a job and want to know my rights", next: "g-first-job" },
      { label: "Someone is sexually harassing me at work", next: "g-workplace-harassment" },
      { label: "My salary hasn't been paid, or I lost my job", next: "g-unpaid-salary" },
      { label: "I'm an intern, freelancer or gig worker", next: "g-internships-gig" },
    ],
  },
  family: {
    kind: "question", id: "family", text: "What's going on?",
    options: [
      { label: "Someone at home is hurting, threatening or controlling me", next: "g-domestic-violence" },
      { label: "I don't feel safe in a public place or while travelling", next: "g-public-safety" },
      { label: "I'm a senior citizen, or I'm worried about one", next: "g-senior-citizens" },
      { label: "Disability rights, certificates or accommodations", next: "g-disability-rights" },
    ],
  },
  police: {
    kind: "question", id: "police", text: "What do you need?",
    options: [
      { label: "Police want to question me or someone I know, or an arrest is happening", next: "g-police-rights" },
      { label: "Information from a government office (RTI)", next: "g-rti" },
      { label: "A free lawyer, or to understand how courts work", next: "g-legal-aid" },
    ],
  },
  "g-right-to-education": { kind: "guide", slug: "right-to-education" },
  "g-school-bullying": { kind: "guide", slug: "school-bullying-punishment" },
  "g-safe-touch": { kind: "guide", slug: "safe-unsafe-touch" },
  "g-ragging": { kind: "guide", slug: "ragging" },
  "g-child-labour-marriage": { kind: "guide", slug: "child-labour-marriage" },
  "g-cyberbullying": { kind: "guide", slug: "cyberbullying" },
  "g-online-fraud": { kind: "guide", slug: "online-fraud" },
  "g-data-privacy": { kind: "guide", slug: "data-privacy" },
  "g-photo-misuse": { kind: "guide", slug: "photo-misuse" },
  "g-faulty-product": { kind: "guide", slug: "faulty-product" },
  "g-bank-problems": { kind: "guide", slug: "bank-problems" },
  "g-loan-recovery": { kind: "guide", slug: "loan-recovery" },
  "g-renting": { kind: "guide", slug: "renting" },
  "g-first-job": { kind: "guide", slug: "first-job" },
  "g-workplace-harassment": { kind: "guide", slug: "workplace-harassment" },
  "g-unpaid-salary": { kind: "guide", slug: "unpaid-salary" },
  "g-internships-gig": { kind: "guide", slug: "internships-gig-work" },
  "g-domestic-violence": { kind: "guide", slug: "domestic-violence" },
  "g-public-safety": { kind: "guide", slug: "public-safety" },
  "g-senior-citizens": { kind: "guide", slug: "senior-citizens" },
  "g-disability-rights": { kind: "guide", slug: "disability-rights" },
  "g-police-rights": { kind: "guide", slug: "police-rights" },
  "g-rti": { kind: "guide", slug: "rti" },
  "g-legal-aid": { kind: "guide", slug: "legal-aid" },
};
