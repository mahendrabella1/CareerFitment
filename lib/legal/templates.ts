/**
 * Letter/complaint template filling - pure string substitution, runs
 * entirely on the client (components/legal/LetterBuilder.tsx). Nothing the
 * learner types is ever sent to a server; the filled text only ever exists
 * in the browser tab, matching the section's privacy-by-design rule (see
 * CareerFitment plan: "navigator answers, letter-builder text... stay in
 * the browser for the session").
 *
 * Plan rules for every template: plain, polite language with no threats or
 * legal jargon; marked "Draft - review before sending"; reviewed with the
 * guides. Templates only ever produce factual complaints and requests.
 */

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]?.trim() || `[${key}]`);
}

export interface LetterTemplate {
  slug: string;
  name: string;
  /** One line shown above the form: who the letter goes to and why. */
  purpose?: string;
  guideSlugs: string[];
  fields: { key: string; label: string; placeholder?: string; multiline?: boolean }[];
  template: string;
  /** What to do after sending, shown under the draft. */
  nextStep?: string;
}

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    slug: "police-complaint",
    name: "Police complaint draft",
    purpose: "A clear written complaint to take to the police station or attach to an online complaint.",
    guideSlugs: ["online-fraud", "cyberbullying", "photo-misuse", "public-safety", "police-rights", "ragging", "child-labour-marriage", "loan-recovery", "domestic-violence", "workplace-harassment"],
    fields: [
      { key: "name", label: "Your name" },
      { key: "address", label: "Your address" },
      { key: "station", label: "Police station (if known)" },
      { key: "what", label: "What happened", multiline: true, placeholder: "Describe what happened, as factually as you can." },
      { key: "when", label: "When it happened" },
      { key: "where", label: "Where it happened" },
      { key: "evidence", label: "Evidence you have", multiline: true, placeholder: "Screenshots, messages, witnesses, CCTV, etc." },
    ],
    template: `To,
The Station House Officer,
{{station}} Police Station

Subject: Complaint regarding an incident on {{when}}

Respected Sir/Madam,

I, {{name}}, residing at {{address}}, wish to report the following incident that took place on {{when}} at {{where}}:

{{what}}

I have the following evidence available: {{evidence}}

I request that this complaint be registered and appropriate action taken. I am available to provide any further information or a statement as required.

Thank you.

Name: {{name}}
Address: {{address}}
Date: ___
Signature`,
    nextStep: "Ask for a receipt or a copy of the FIR. A Zero FIR can be filed at any police station. For online crimes you can also file at cybercrime.gov.in.",
  },
  {
    slug: "school-college-complaint",
    name: "Complaint to school or college",
    purpose: "A written complaint to the principal, anti-bullying committee or anti-ragging committee.",
    guideSlugs: ["school-bullying-punishment", "ragging", "right-to-education", "cyberbullying", "safe-unsafe-touch"],
    fields: [
      { key: "name", label: "Your name" },
      { key: "classOrCourse", label: "Class / course and section" },
      { key: "recipient", label: "Addressed to (e.g. Principal, Anti-Ragging Committee)" },
      { key: "what", label: "What happened", multiline: true, placeholder: "Describe what happened, as factually as you can." },
      { key: "when", label: "When it happened" },
      { key: "witnesses", label: "Anyone who saw it or can confirm it", placeholder: "Names, if comfortable sharing" },
    ],
    template: `To,
The {{recipient}},
[School / College name]

Subject: Complaint regarding an incident on {{when}}

Respected Sir/Madam,

I, {{name}}, a student of {{classOrCourse}}, wish to bring the following to your attention:

{{what}}

This happened on {{when}}. {{witnesses}}

I request that this matter be looked into and appropriate action taken, in line with the institution's policy. I am available to discuss this further if needed.

Thank you.

Name: {{name}}
Class/Course: {{classOrCourse}}
Date: ___
Signature`,
    nextStep: "Keep a copy and ask for a written reply. For ragging, you can also call 1800-180-5522. If a school does not act, complain to the District Education Officer or NCPCR's e-Baal Nidan.",
  },
  {
    slug: "seller-complaint",
    name: "Complaint to a seller or brand",
    purpose: "A polite complaint about a faulty product or poor service, with a deadline to fix it.",
    guideSlugs: ["faulty-product"],
    fields: [
      { key: "name", label: "Your name" },
      { key: "address", label: "Your address" },
      { key: "contact", label: "Your phone or email" },
      { key: "seller", label: "Seller or brand name" },
      { key: "product", label: "Product or service", placeholder: "e.g. a phone, a laptop repair, a course" },
      { key: "orderId", label: "Order or invoice number" },
      { key: "purchaseDate", label: "Date of purchase" },
      { key: "problem", label: "What is wrong", multiline: true, placeholder: "e.g. The screen stopped working after 5 days of normal use." },
      { key: "want", label: "What you want", placeholder: "repair / replacement / full refund" },
      { key: "deadline", label: "Days you are giving them to fix it", placeholder: "e.g. 15" },
    ],
    template: `To,
The Customer Care / Grievance Officer,
{{seller}}

Subject: Complaint about {{product}} (Order/Invoice No. {{orderId}})

Dear Sir/Madam,

I bought {{product}} from you on {{purchaseDate}} (Order/Invoice No. {{orderId}}).

The problem: {{problem}}

Under the Consumer Protection Act, 2019, I am entitled to goods and services of the promised quality. I request a {{want}} within {{deadline}} days of the date of this letter.

If the matter is not resolved by then, I will approach the National Consumer Helpline (1915) and, if needed, file a complaint with the District Consumer Commission through e-Jagriti.

I have attached copies of the invoice, the payment proof and photos of the problem.

Yours faithfully,
{{name}}
{{address}}
Phone/Email: {{contact}}
Date: ___`,
    nextStep: "Send it by email or the app's chat so you have a dated record. If nothing happens by your deadline, call 1915 or register on consumerhelpline.gov.in.",
  },
  {
    slug: "consumer-commission",
    name: "Consumer commission complaint draft",
    purpose: "A structured draft to adapt when you file on e-Jagriti, after the seller and the helpline have not solved it.",
    guideSlugs: ["faulty-product"],
    fields: [
      { key: "district", label: "District of the Commission", placeholder: "the district where you live or work" },
      { key: "name", label: "Your name" },
      { key: "address", label: "Your address" },
      { key: "opposite", label: "Seller or company name and address" },
      { key: "product", label: "Product or service" },
      { key: "purchaseDate", label: "Date of purchase" },
      { key: "amountPaid", label: "Amount paid (₹)" },
      { key: "problem", label: "The defect or deficiency", multiline: true },
      { key: "stepsTried", label: "What you already tried, with dates", multiline: true, placeholder: "e.g. Emailed the seller on 3 March; National Consumer Helpline docket no. ___ on 20 March." },
      { key: "relief", label: "What you are asking the Commission for", multiline: true, placeholder: "e.g. Refund of ₹___, compensation of ₹___ for inconvenience, and ₹___ as costs." },
    ],
    template: `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, {{district}}

Complaint under Section 35 of the Consumer Protection Act, 2019

{{name}}, residing at {{address}}
... Complainant

Versus

{{opposite}}
... Opposite Party

1. The complainant bought {{product}} from the opposite party on {{purchaseDate}} and paid ₹{{amountPaid}}. Copies of the invoice and payment proof are attached.

2. Defect or deficiency: {{problem}}

3. Steps already taken: {{stepsTried}}

4. The opposite party has not repaired, replaced or refunded the product or service, which is a defect in goods or a deficiency in service under the Act.

5. This complaint is filed within two years of the cause of action. The amount paid is within the pecuniary limit of this Commission, and the complainant resides or works within its jurisdiction.

6. Relief sought: {{relief}}

Documents attached: invoice, payment proof, photos or videos of the defect, correspondence with the opposite party, and the National Consumer Helpline docket (if any).

Verification: I, {{name}}, the complainant, state that the contents of this complaint are true and correct to the best of my knowledge and belief.

Place: ___
Date: ___
Signature`,
    nextStep: "File it on e-jagriti.gov.in; the portal has its own form, so use this draft to fill it in. No fee is charged for complaints up to ₹5 lakh. Check the current limits on e-Jagriti before filing.",
  },
  {
    slug: "rti-application",
    name: "RTI application",
    purpose: "Ask a government office for information under the Right to Information Act, 2005.",
    guideSlugs: ["rti", "right-to-education", "disability-rights"],
    fields: [
      { key: "department", label: "Department name and address", placeholder: "e.g. Office of the District Education Officer, ___" },
      { key: "info", label: "The information you want, as numbered questions", multiline: true, placeholder: "1. The status of my scholarship application no. ___ submitted on ___\n2. Copies of the file notings on it, if any" },
      { key: "period", label: "Period the information covers", placeholder: "From ___ to ___" },
      { key: "fee", label: "How you paid the fee", placeholder: "₹10 paid by postal order no. ___ / I belong to the BPL category; proof attached" },
      { key: "format", label: "How you want the information", placeholder: "photocopies by post / by email" },
      { key: "name", label: "Your name" },
      { key: "address", label: "Your address" },
    ],
    template: `To,
The Public Information Officer,
{{department}}

Subject: Application under the Right to Information Act, 2005

Sir/Madam,

I request the following information under Section 6(1) of the Right to Information Act, 2005:

{{info}}

Period: {{period}}

Fee: {{fee}}

I am a citizen of India. Please provide the information as {{format}}. If any part of this information is held by another public authority, please transfer that part under Section 6(3) of the Act and inform me.

Name: {{name}}
Address: {{address}}
Date: ___
Signature`,
    nextStep: "For central government offices, file at rtionline.gov.in and pay ₹10 online. The reply is due within 30 days. If there is none, file a first appeal within 30 days after that.",
  },
  {
    slug: "bank-complaint",
    name: "Complaint to a bank, NBFC or payment app",
    purpose: "A written complaint to your bank or lender, with the RBI Ombudsman as the next step.",
    guideSlugs: ["bank-problems", "loan-recovery", "online-fraud"],
    fields: [
      { key: "bank", label: "Bank, NBFC or app name and branch" },
      { key: "subject", label: "Short subject", placeholder: "e.g. an unauthorised UPI debit / harassment by recovery agents" },
      { key: "accountRef", label: "Last 4 digits of your account, card or loan number", placeholder: "Never write a full card number, PIN, CVV or OTP" },
      { key: "transaction", label: "Transaction or loan details", multiline: true, placeholder: "Date, amount and transaction ID, or the loan account and what happened" },
      { key: "problem", label: "What happened", multiline: true },
      { key: "earlier", label: "Earlier complaint numbers, if any", placeholder: "e.g. 1930 complaint no. ___, bank ticket no. ___" },
      { key: "want", label: "What you want the bank to do", placeholder: "e.g. reverse the debit / stop the calls and share your recovery policy" },
      { key: "name", label: "Your name" },
      { key: "contact", label: "Your phone or email" },
    ],
    template: `To,
The Branch Manager / Grievance Redressal Officer,
{{bank}}

Subject: Complaint regarding {{subject}}

Dear Sir/Madam,

I hold an account, card or loan with you (number ending {{accountRef}}).

Details: {{transaction}}

What happened: {{problem}}

Earlier complaint numbers, if any: {{earlier}}

I request you to {{want}}, and to send me a written reply with a complaint reference number.

If the complaint is not resolved within 30 days, I will approach the RBI Ombudsman under the Reserve Bank - Integrated Ombudsman Scheme, 2026.

Yours faithfully,
{{name}}
Phone/Email: {{contact}}
Date: ___`,
    nextStep: "For fraud, block the card or UPI and call 1930 first, then send this the same day. If the bank does not reply in 30 days, or the reply is unsatisfactory, file at cms.rbi.org.in within 90 days.",
  },
  {
    slug: "salary-demand",
    name: "Salary demand letter",
    purpose: "A formal, polite request for unpaid salary or fees, with a deadline.",
    guideSlugs: ["unpaid-salary", "first-job", "internships-gig-work"],
    fields: [
      { key: "employer", label: "Employer or client name and address" },
      { key: "name", label: "Your name" },
      { key: "designation", label: "Your role and employee ID (or project, for freelance work)" },
      { key: "months", label: "Months or work unpaid", placeholder: "e.g. July and August 2026" },
      { key: "amount", label: "Total amount due (₹)" },
      { key: "deadline", label: "Days you are giving them to pay", placeholder: "e.g. 7" },
      { key: "contact", label: "Your phone or email" },
    ],
    template: `To,
The HR Manager / Director,
{{employer}}

Subject: Request for payment of unpaid salary for {{months}}

Dear Sir/Madam,

I, {{name}}, working as {{designation}}, have not received my pay for {{months}}. The total amount due is ₹{{amount}}.

Under the Code on Wages, 2019, monthly wages are to be paid by the 7th day of the following month, and on resignation or termination within two working days.

I request you to pay the full amount within {{deadline}} days of this letter and to confirm the payment date in writing.

If the amount remains unpaid, I will approach the labour department or the authority under the Code on Wages for recovery. I would prefer to settle this directly and am happy to discuss it.

Yours sincerely,
{{name}}
{{contact}}
Date: ___`,
    nextStep: "Send it by email so it is dated. If you are still unpaid after the deadline, contact your state labour department or file a wage claim under the Code on Wages (within 3 years). Free legal aid: 15100.",
  },
  {
    slug: "data-deletion",
    name: "Data deletion request",
    purpose: "Ask a company to erase your personal data and close your account.",
    guideSlugs: ["data-privacy"],
    fields: [
      { key: "company", label: "Company or app name" },
      { key: "accountId", label: "Your username or the email/phone on the account" },
      { key: "dataDesc", label: "What data you want deleted", multiline: true, placeholder: "e.g. my profile, photos, contact list, location history and saved payment details" },
      { key: "reason", label: "Reason (optional)", placeholder: "e.g. I no longer use the service." },
      { key: "name", label: "Your name" },
      { key: "contact", label: "Email or phone for the reply" },
    ],
    template: `To,
The Grievance Officer / Data Protection Officer,
{{company}}

Subject: Request to delete my personal data and close my account

Dear Sir/Madam,

I hold an account with you under {{accountId}}.

I request that you erase the following personal data you hold about me, and close my account: {{dataDesc}}

{{reason}}

I make this request under your privacy policy and, once it is in force, my right to erasure under Section 12 of the Digital Personal Data Protection Act, 2023.

Please acknowledge this request with a reference number, confirm in writing when the data has been deleted, and tell me if any data must be kept by law and for how long.

Yours faithfully,
{{name}}
Contact: {{contact}}
Date: ___`,
    nextStep: "Find the Grievance Officer's email in the app's privacy policy. Platforms must acknowledge complaints within 24 hours. If it is not resolved, you can appeal to the Grievance Appellate Committee at gac.gov.in within 30 days.",
  },
  {
    slug: "workplace-harassment",
    name: "Workplace harassment complaint",
    purpose: "A written complaint of sexual harassment to your Internal Committee.",
    guideSlugs: ["workplace-harassment"],
    fields: [
      { key: "org", label: "Organisation name" },
      { key: "name", label: "Your name" },
      { key: "designation", label: "Your role and department" },
      { key: "respondent", label: "Name and role of the person you are complaining about" },
      { key: "incidents", label: "What happened, with dates and places", multiline: true, placeholder: "List each incident on its own line, with the date, place and what was said or done." },
      { key: "witnesses", label: "Witnesses (if any)" },
      { key: "interim", label: "Interim relief you want during the inquiry (optional)", placeholder: "e.g. I request interim relief under Section 12, such as a transfer of the respondent or leave." },
      { key: "contact", label: "Your phone or email" },
    ],
    template: `To,
The Presiding Officer,
Internal Committee,
{{org}}

Subject: Complaint of sexual harassment at the workplace under Section 9 of the POSH Act, 2013

Madam/Sir,

I, {{name}}, working as {{designation}}, make a complaint of sexual harassment against {{respondent}}.

Details of the incident(s):
{{incidents}}

Witnesses (if any): {{witnesses}}

Evidence attached (if any): messages, emails, call logs and my notes.

I request the Committee to inquire into this complaint under the Act and to keep my identity and the proceedings confidential. {{interim}}

Yours sincerely,
{{name}}
Contact: {{contact}}
Date: ___
Signature`,
    nextStep: "Submit it within 3 months of the incident (or the last incident). You can also file on SHe-Box (shebox.wcd.gov.in). If there is no Internal Committee, or the complaint is against your employer, send it to the Local Committee through the District Officer.",
  },
];

export function letterTemplateBySlug(slug: string): LetterTemplate | undefined {
  return LETTER_TEMPLATES.find((t) => t.slug === slug);
}
