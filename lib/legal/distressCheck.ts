/**
 * Lightweight, client-side-only keyword check on free-text fields (the
 * letter builder) - the first half of the spec's safeguarding requirement.
 * The second half ("alert a trained safeguarding contact") needs a real
 * person/inbox this platform's own team designates - not built here, see
 * the plan's "Safeguarding contact gap" note. This check only ever shows
 * the learner a support message; it never saves or sends what they typed.
 */

const DISTRESS_PATTERNS = [
  /\bsuicid/i, /\bkill myself\b/i, /\bend my life\b/i, /\bself[- ]harm/i,
  /\bwant to die\b/i, /\bno reason to live\b/i, /\bcan'?t go on\b/i,
];

export function containsDistressLanguage(text: string): boolean {
  return DISTRESS_PATTERNS.some((p) => p.test(text));
}
