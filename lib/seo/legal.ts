/**
 * The Privacy Policy (/privacy) and Terms of Use (/terms). Written to match
 * what the app actually does (see CLAUDE.md) - if a feature starts collecting
 * or sharing something new, update this text in the same change.
 *
 * Plain-language drafts, written under India's Digital Personal Data
 * Protection Act, 2023 (DPDP) - they should be reviewed by a lawyer, who may
 * also add OneGrasp's registered legal name and address, a named grievance
 * officer and a refund policy.
 */
import type { Block } from "@/lib/blog";

export const LEGAL_UPDATED = "2026-11-13";

export const PRIVACY: Block[] = [
  { p: "OneGrasp (\"we\", \"us\") runs this website and app (careerfitment.onegrasp.com): career assessments and reports, a learning dashboard, tools for schools and colleges, and the Workplace Stress Check for working professionals. This policy explains what personal data we collect, why, who it is shared with, and the choices and rights you have. Many of our users are under 18, so we have written it to be read by students and their parents." },
  { h2: "The short version" },
  { ul: [
    "We collect what we need to give you your assessment, report and dashboard, and to run our service.",
    "We don't sell your personal data.",
    "Your school sees your results and progress only if you link your account to a school that uses OneGrasp.",
    "You can ask to see, correct or delete your data at any time - [send a request here](/privacy/request) or email support@onegrasp.com.",
  ] },
  { h2: "What we collect" },
  { ul: [
    "**Account details** - your name, email, phone number, class or stage, city, age, school or college name, the career you're thinking of, and how sure you feel about it. Your password is handled by our sign-in provider (Google Firebase); we never see it.",
    "**Your assessment** - your answers, how long you took, and the results and report we produce from them.",
    "**What you do on the dashboard** - lessons you finish, pages and tools you open, time spent in each area, your Year Plan and Career GPS progress, practice scores in the Aptitude and Communication Labs, your resume, saved jobs, Career Passport entries and similar things you create.",
    "**Voice and writing practice** - when you record an answer in the Communication Lab or a mock interview, the recording is sent to be turned into text and is **not stored**. We keep the transcript (shortened) and the scores. If that service is unavailable, your browser's own speech recognition may be used instead, under your browser's terms. Writing you submit for feedback is kept with its feedback.",
    "**Payments** - if you pay, our payment provider (Razorpay) handles your card or UPI details. We keep the payment reference, amount and any coupon used - never card or bank details.",
    "**Messages and requests** - messages between you and your school or OneGrasp, and requests you send us (such as Spotlight, school partnership or privacy requests), with any file you attach.",
    "**Working professionals** - your Workplace Stress Check answers and results, and your experience band. For career-stage comparisons we keep one anonymous row (band and scores, no name or contact) per person.",
    "**Technical data** - your IP address and browser details (used briefly to keep the service secure, for example to stop spam), and settings saved in your own browser (such as drafts and which page you were on).",
  ] },
  { h2: "Why we use it" },
  { ul: [
    "To create your account, run your assessment and produce your report and dashboard.",
    "To show your progress, suggest next steps and send you emails you asked for (for example deadline reminders or your report).",
    "To give AI-powered feedback on your writing, speaking, resume and interview answers.",
    "To let your school or college support you, if you linked your account to one.",
    "To take payments and keep the records the law requires.",
    "To keep the service secure, fix problems and improve it.",
    "To measure how well our advertising works (see \"Analytics and advertising\" below).",
  ] },
  { p: "We use your data on the basis of your consent (or your parent's or guardian's, for children), and for the legitimate uses the law allows - such as keeping records we are legally required to keep." },
  { h2: "Children" },
  { p: "If you are under 18, please use OneGrasp with your parent's or guardian's knowledge and permission. Parents and guardians can contact us at any time to see, correct or delete their child's data, or to withdraw consent - use the [request form](/privacy/request) and choose \"my child's account\"." },
  { h2: "Who we share it with" },
  { ul: [
    "**Your school or college** - only if you entered the name of an institution that uses the OneGrasp portal. It sees your profile, results, report and progress so its counsellors can guide you, and can message you.",
    "**Your parents** - only what you choose to share with them, for example a Family Decision Room link.",
    "**Service providers who run parts of OneGrasp for us**, under their own security and privacy terms: Google Firebase (sign-in and database), Vercel (hosting and privacy-friendly site analytics), Supabase (the job listings), Razorpay (payments), Groq and DeepSeek (the AI that turns speech into text and gives feedback on text you submit), our email provider, Upstash (spam protection, using IP addresses briefly), Twilio (voice calls a school may send to parents), and Meta (advertising measurement).",
    "**Authorities** - when the law requires it.",
  ] },
  { p: "Some of these providers process data outside India. We don't sell personal data or share it for other companies' own marketing." },
  { h2: "Analytics and advertising" },
  { p: "We use Vercel Analytics to count visits without cookies. We also use the Meta Pixel, which tells Meta (Facebook and Instagram) which of our pages are visited so we can measure our advertising; Meta may use cookies for this. You can limit this through your Meta ad settings and your browser's cookie and tracking settings." },
  { h2: "How long we keep it" },
  { p: "We keep your data while your account is active, so your report, progress and certificates stay available. When you ask us to delete your account, we delete or anonymise your personal data, except records the law requires us to keep for a period (for example payment and tax records). Certificates you have shared stay checkable at their link until the account is deleted." },
  { h2: "Your rights" },
  { ul: [
    "**Access** - ask for a summary of the personal data we hold about you and how we use it.",
    "**Correction** - ask us to correct, complete or update it.",
    "**Erasure** - ask us to delete it.",
    "**Withdraw consent** - at any time; this doesn't affect what was done before.",
    "**Nominate** someone to exercise these rights for you if you are unable to.",
    "**Complain** - to us first, and if you're not satisfied, to the Data Protection Board of India.",
  ] },
  { p: "To use any of these, [send a request](/privacy/request) or email support@onegrasp.com. We'll confirm it's you (or that you're the parent or guardian) before acting, and reply without undue delay." },
  { h2: "Security" },
  { p: "Data travels encrypted (HTTPS). Access to the database is restricted by security rules, so only you, your linked school and authorised OneGrasp staff can see your data, and admin access needs a verified account. No system is perfectly secure; if a breach affected you, we would tell you and the authorities as the law requires." },
  { h2: "Contact and grievances" },
  { p: "For any question, request or complaint about your data, write to **support@onegrasp.com** or call **+91 89777 60442**. We aim to reply as quickly as we can." },
  { h2: "Changes" },
  { p: "If we change this policy, we'll update the date below, and tell you on the dashboard or by email when the change is significant." },
];

export const TERMS: Block[] = [
  { p: "These terms apply when you use OneGrasp (careerfitment.onegrasp.com) - as a student, a parent, a school or college, or a working professional. By creating an account or using the service, you agree to them. Please also read our [Privacy Policy](/privacy)." },
  { h2: "Your account" },
  { ul: [
    "Give accurate details and keep your password private. You're responsible for what happens in your account.",
    "If you are under 18, use OneGrasp with your parent's or guardian's permission.",
    "Schools and colleges using the portal must use students' information only to guide and support those students.",
  ] },
  { h2: "What OneGrasp is - and isn't" },
  { p: "OneGrasp's assessments, reports, roadmaps, Year Plan and AI feedback are guidance to help you explore and decide. They are not guarantees of admission, a job, a salary or exam results, and they don't replace advice from your teachers, counsellors or family. Information about exams, colleges, scholarships, jobs and laws can change - always check the official source before you act. The Workplace Stress Check is a self-check, not a medical diagnosis." },
  { h2: "Payments" },
  { p: "The price of a paid assessment is shown before you pay, with any offer running at the time. Payments are processed by Razorpay. If something went wrong with a payment, email support@onegrasp.com with your payment ID and we'll help. Spotlight services (publishing, ISBN, ISSN, writing, magazine) are quoted separately after you send a request." },
  { h2: "Using OneGrasp fairly" },
  { ul: [
    "Don't share your account, copy or resell our content, or try to get around payments.",
    "Don't upload anything unlawful, harmful or that isn't yours to share.",
    "Don't try to break, overload, scrape or misuse the service or other people's data.",
    "Use AI feedback to learn - not to hand in work that isn't your own.",
  ] },
  { h2: "Content" },
  { p: "OneGrasp's questions, reports, lessons and other content belong to OneGrasp or its licensors. What you create - your writing, resume and projects - stays yours; you let us store and process it to provide the service. Links to other websites (courses, jobs, programmes) are for your convenience; we're not responsible for those sites." },
  { h2: "Changes and ending" },
  { p: "We may update the service and these terms; we'll tell you about significant changes. You can stop using OneGrasp and ask us to delete your account at any time ([request here](/privacy/request)). We may suspend accounts that break these terms." },
  { h2: "Liability" },
  { p: "We work hard to keep OneGrasp accurate and available, but it is provided as it is. To the extent the law allows, OneGrasp isn't liable for decisions made on the basis of its guidance or for indirect losses. Nothing here limits rights you have under Indian law that can't be limited." },
  { h2: "Law and contact" },
  { p: "These terms are governed by the laws of India. Questions or complaints: **support@onegrasp.com**, **+91 89777 60442**." },
];
