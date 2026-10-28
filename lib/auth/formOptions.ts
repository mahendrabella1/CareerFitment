/** Shared options + validation for the registration flow. */

/**
 * Category (class / life-stage). Each maps to one of the assessment journeys.
 * Granular classes are offered but several collapse onto the same journey.
 */
export const CATEGORY_OPTIONS: { value: string; label: string; journey: string }[] = [
  { value: "class_6", label: "Class 6", journey: "career_discovery" },
  { value: "class_7", label: "Class 7", journey: "career_discovery" },
  { value: "class_8", label: "Class 8", journey: "career_discovery" },
  { value: "class_9_10", label: "Class 9 – 10", journey: "stream_selection" },
  { value: "class_11", label: "Class 11", journey: "career_planning" },
  { value: "class_12", label: "Class 12", journey: "career_planning" },
  { value: "graduate", label: "Undergraduate (18 – 21)", journey: "graduate_readiness" },
  { value: "experienced_professional", label: "Working Professional", journey: "leadership_excellence" },
  // Kept only so categoryLabel() still shows a friendly name for accounts
  // registered before the 11/12 split - no longer offered at registration.
  { value: "class_11_12", label: "Class 11 – 12", journey: "career_planning" },
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

/** Password rules - each returns true when satisfied. */
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

/**
 * What's wrong with a mobile number, or null when it looks real.
 * Indian numbers (10 digits; "+91", "91" or "0" in front is fine) must start
 * with 6, 7, 8 or 9, and obvious placeholders are refused: one digit
 * repeated (9999999999, 9000000000), or a straight run (9876543210). A number
 * written with another country code ("+44 ...") needs 8-15 digits.
 */
export function phoneProblem(phone: string): string | null {
  const raw = phone.trim().replace(/[\s\-().]/g, "");
  if (!raw) return "Please enter your mobile number.";
  if (!/^\+?\d+$/.test(raw)) return "Use digits only.";
  let d = raw.replace(/^\+/, "");
  if (raw.startsWith("+") && !d.startsWith("91")) {
    return /^\d{8,15}$/.test(d) ? null : "Enter the full number, with its country code.";
  }
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10) return "Enter a 10-digit mobile number.";
  if (!/^[6-9]/.test(d)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
  const counts = [...d].reduce<Record<string, number>>((c, x) => ({ ...c, [x]: (c[x] ?? 0) + 1 }), {});
  const steps = [...d].slice(1).map((x, i) => (Number(x) - Number(d[i]) + 10) % 10);
  const run = steps.every((s) => s === 1) || steps.every((s) => s === 9);
  if (Math.max(...Object.values(counts)) >= 8 || run) return "That looks like a sample number - please enter your real mobile number.";
  return null;
}

export const phoneIsValid = (phone: string) => phoneProblem(phone) === null;
