/**
 * Shared psychometric-profile shape used by the career-counselling dashboard
 * module. Kept intentionally flexible — the module only reads a few fields
 * (name, email); everything else is optional.
 */
export interface PsychometricProfile {
  name?: string;
  email?: string;
  completedAt?: string;
  [key: string]: unknown;
}
