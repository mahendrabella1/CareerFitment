/** Shared options + validation for the registration flow. */

export const CLASS_OPTIONS: { value: string; label: string }[] = [
  { value: "career_discovery", label: "Class 6 – 8" },
  { value: "stream_selection", label: "Class 9 – 10" },
  { value: "career_planning", label: "Class 11 – 12" },
  { value: "graduate_readiness", label: "Graduate" },
  { value: "career_growth", label: "Early Professional" },
  { value: "leadership_excellence", label: "Experienced Professional" },
];

export const STATUS_OPTIONS: string[] = [
  "School student",
  "College student",
  "Working professional",
  "Other",
];

export function classLabel(value: string): string {
  return CLASS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

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
