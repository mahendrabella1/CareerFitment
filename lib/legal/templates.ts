/**
 * Letter/complaint template filling - pure string substitution, runs
 * entirely on the client (components/legal/LetterBuilder.tsx). Nothing the
 * learner types is ever sent to a server; the filled text only ever exists
 * in the browser tab, matching the section's privacy-by-design rule (see
 * CareerFitment plan: "navigator answers, letter-builder text... stay in
 * the browser for the session").
 */

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key]?.trim() || `[${key}]`);
}

export interface LetterTemplate {
  slug: string;
  name: string;
  guideSlugs: string[];
  fields: { key: string; label: string; placeholder?: string; multiline?: boolean }[];
  template: string;
}

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    slug: "police-complaint",
    name: "Police complaint draft",
    guideSlugs: ["online-fraud", "cyberbullying", "public-safety", "police-rights"],
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
  },
  {
    slug: "school-college-complaint",
    name: "Complaint to school or college",
    guideSlugs: ["cyberbullying", "safe-unsafe-touch"],
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
  },
];

export function letterTemplateBySlug(slug: string): LetterTemplate | undefined {
  return LETTER_TEMPLATES.find((t) => t.slug === slug);
}
