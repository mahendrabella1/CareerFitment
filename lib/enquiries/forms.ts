/**
 * Public forms anyone can send without signing in: a school's request to work
 * with OneGrasp (home page, /features/for-schools) and a privacy request -
 * see, correct or delete my data (/privacy/request). The same checks run in
 * the browser and on the server (app/api/enquiries/*). Saved by
 * lib/enquiries/server.ts in server-only collections and emailed to the team;
 * the admin sees them at /admin/requests.
 */
export type EnquiryKind = "school" | "privacy";

export interface FieldSpec {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  required?: boolean;
  max: number;
  options?: string[];
  placeholder?: string;
}

export const SCHOOL_FIELDS: FieldSpec[] = [
  { name: "school", label: "School or college name", required: true, max: 160 },
  { name: "city", label: "City and state", required: true, max: 120 },
  { name: "contactName", label: "Your name", required: true, max: 100 },
  { name: "role", label: "Your role", type: "select", required: true, max: 60, options: ["Principal / Head", "Counsellor", "Teacher", "Management / Trustee", "Administrator", "Other"] },
  { name: "email", label: "Email", type: "email", required: true, max: 160 },
  { name: "phone", label: "Phone (with WhatsApp, if possible)", type: "tel", required: true, max: 20 },
  { name: "students", label: "About how many students?", type: "select", max: 30, options: ["Under 200", "200-500", "500-1,000", "1,000-3,000", "Over 3,000"] },
  { name: "classes", label: "Classes you'd like to start with", type: "select", max: 60, options: ["Class 6-8", "Class 9-10", "Class 11-12", "Undergraduates", "All of these"] },
  { name: "message", label: "Anything you'd like us to know (optional)", type: "textarea", max: 1500, placeholder: "Your goals, timing, questions…" },
];

export const PRIVACY_FIELDS: FieldSpec[] = [
  { name: "request", label: "What would you like?", type: "select", required: true, max: 60, options: ["Delete my account and data", "Delete my child's account and data", "A copy of my data", "Correct my data", "Withdraw consent", "Something else"] },
  { name: "name", label: "Full name on the account", required: true, max: 100 },
  { name: "email", label: "Email used on OneGrasp", type: "email", required: true, max: 160 },
  { name: "phone", label: "Phone used on OneGrasp (optional)", type: "tel", max: 20 },
  { name: "relation", label: "You are", type: "select", required: true, max: 40, options: ["The account holder", "A parent or guardian of the account holder"] },
  { name: "details", label: "Details (optional)", type: "textarea", max: 1500, placeholder: "Anything that helps us find the account or understand the request." },
];

export const FIELDS: Record<EnquiryKind, FieldSpec[]> = { school: SCHOOL_FIELDS, privacy: PRIVACY_FIELDS };

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()-]{7,20}$/;

/** Trims, caps lengths, checks required fields, emails, phones and select options.
 *  Returns the clean data, or the first problem in words. */
export function cleanEnquiry(kind: EnquiryKind, raw: Record<string, unknown>): { ok: true; data: Record<string, string> } | { ok: false; error: string } {
  const data: Record<string, string> = {};
  for (const f of FIELDS[kind]) {
    const v = typeof raw[f.name] === "string" ? (raw[f.name] as string).replace(/\s+/g, f.type === "textarea" ? " " : " ").trim().slice(0, f.max) : "";
    if (!v) {
      if (f.required) return { ok: false, error: `Please fill in "${f.label}".` };
      continue;
    }
    if (f.type === "email" && !EMAIL.test(v)) return { ok: false, error: "Please enter a valid email address." };
    if (f.type === "tel" && !PHONE.test(v)) return { ok: false, error: "Please enter a valid phone number." };
    if (f.type === "select" && f.options && !f.options.includes(v)) return { ok: false, error: `Please choose an option for "${f.label}".` };
    data[f.name] = v;
  }
  return { ok: true, data };
}

/** The hidden field bots fill in and people never see. */
export const TRAP = "website";

export const STATUSES = ["new", "contacted", "done", "closed"] as const;
export type RequestStatus = (typeof STATUSES)[number];
