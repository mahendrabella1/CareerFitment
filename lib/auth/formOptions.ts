/** Shared options + validation for the registration flow. */

/**
 * Category (class / life-stage). Each maps to one of the assessment journeys.
 * Granular classes are offered but several collapse onto the same journey.
 */
export const CATEGORY_OPTIONS: { value: string; label: string; journey: string }[] = [
  { value: "class_6_8", label: "Class 6 – 8", journey: "career_discovery" },
  { value: "class_9_10", label: "Class 9 – 10", journey: "stream_selection" },
  { value: "class_11_12", label: "Class 11 – 12", journey: "career_planning" },
  { value: "graduate", label: "Graduate (18 – 21)", journey: "graduate_readiness" },
  { value: "early_professional", label: "Early Professional (21 – 35)", journey: "career_growth" },
  { value: "experienced_professional", label: "Experienced Professional (35 – 55)", journey: "leadership_excellence" },
];

export function journeyForCategory(value: string): string {
  return CATEGORY_OPTIONS.find((o) => o.value === value)?.journey ?? "";
}
export function categoryLabel(value: string): string {
  return CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** "Current status" = how clear the user is about their career (JEPI-style). */
export const CLARITY_STAGES: string[] = [
  "I have no idea about my career",
  "I am confused among various options",
  "I am a bit sure but want to explore more",
  "I am sure but need an execution plan",
];

/** Password rules — each returns true when satisfied. */
export interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "An uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "A lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "A number (0–9)", test: (p) => /\d/.test(p) },
  { label: "A special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export const passwordIsValid = (pw: string) => PASSWORD_RULES.every((r) => r.test(pw));

export const emailIsValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Loose phone check: 10–15 digits after stripping spaces/dashes/parens/+. */
export const phoneIsValid = (phone: string) => {
  const digits = phone.replace(/[\s\-()+]/g, "");
  return /^\d{10,15}$/.test(digits);
};
