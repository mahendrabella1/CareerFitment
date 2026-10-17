/**
 * Trust Shield: a quick check of every listing for the signs common in job
 * scams aimed at students (fees, deposits, chat-app-only contact, personal
 * email addresses, "guaranteed" jobs, earnings-per-day hooks). Pure:
 * unit-tested in tests/jobs/trust.test.mjs.
 *
 * "verified" = posted by OneGrasp or a school, or an employer's own job
 * board, with no warning signs. "caution" = at least one warning sign; the
 * flags say which, in words a student understands. Nothing here claims a
 * listing IS a scam - it says what to check before applying.
 */
import type { SourceKind, TrustLevel } from "./types";

const RED_FLAGS: [RegExp, string][] = [
  [/\b(registration|processing|training|joining|application|security|onboarding|kit)\s+(fee|fees|charges?|deposit)\b|\bpay\s+(a\s+)?(fee|deposit)\b|\brefundable\s+(fee|deposit|amount)\b/i, "Asks you to pay a fee or deposit - genuine employers never charge to hire you"],
  [/\b(whats\s?app|telegram)\b/i, "Asks you to talk on WhatsApp or Telegram instead of an official channel"],
  [/\b[\w.+-]+@(gmail|yahoo|hotmail|outlook|rediffmail|ymail|proton(mail)?)\.(com|in|me)\b/i, "Uses a personal email address, not a company one"],
  [/\b(guaranteed|100\s?%)\s+(job|placement|selection|income)\b|\bno interview\b|\bdirect (joining|selection)\b/i, "Promises a guaranteed job or no interview"],
  [/\b(earn|income of|make)\s+(up to\s+)?(₹|rs\.?|inr|\$)\s?[\d,]+\s*(per|\/|a)\s*(day|hour)\b|\bdaily (payment|payout)\b/i, "Advertises daily earnings - a common hook for task and data-entry scams"],
  [/\b(like|rate|review)\s+(videos?|products?|hotels?)\s+(and|to)\s+earn\b|\bprepaid task\b|\btask[- ]based (job|income)\b/i, "Looks like a 'paid tasks' scheme"],
  [/\b(aadhaar|pan card|bank (account|details)|otp|upi pin)\b.{0,40}\b(send|share|submit|provide)\b|\b(send|share|submit|provide)\b.{0,40}\b(aadhaar|bank details|otp|upi pin)\b/i, "Asks for Aadhaar, bank details or an OTP before you are hired"],
];

const SHORTENERS = /^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|rb\.gy|cutt\.ly|is\.gd|forms\.gle|wa\.me|t\.me)$/i;

export interface TrustInput {
  kind: SourceKind;
  title: string;
  company: string;
  description: string;
  applyUrl: string;
  salary: string | null;
}

export function assessTrust(job: TrustInput): { level: TrustLevel; flags: string[] } {
  const text = `${job.title}\n${job.company}\n${job.description}\n${job.salary ?? ""}`;
  const flags: string[] = [];
  for (const [re, msg] of RED_FLAGS) if (re.test(text)) flags.push(msg);
  let host = "";
  try { host = new URL(job.applyUrl).hostname; } catch { /* normalize already required a valid URL */ }
  if (SHORTENERS.test(host)) flags.push("The apply link is a short link or chat link - check where it leads before entering any details");
  if (/[A-Z]{6,}.*[A-Z]{6,}/.test(job.title) && /!{2,}/.test(text)) flags.push("Pushy, all-caps wording");
  if (flags.length) return { level: "caution", flags };
  return { level: job.kind === "aggregator" ? "standard" : "verified", flags };
}

/** Added when several people report the same listing (see /api/jobs/report). */
export const REPORTED_FLAG = "Several people reported this listing - check carefully before applying";
