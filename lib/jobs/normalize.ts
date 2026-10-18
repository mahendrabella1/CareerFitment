/**
 * Turning a source's raw job into a safe, consistent row. Pure (no I/O), so
 * it is unit-tested directly (tests/jobs/normalize.test.mjs).
 *
 * Rules: required strings must be present; the apply link must be HTTPS and
 * (when the source lists hosts) on one of its hosts; descriptions become
 * plain text (never rendered as HTML); nothing is guessed that the listing
 * doesn't say - an unclear job type stays "Unknown".
 */
import type { EmploymentType, ExperienceHint, JobSource, NormalizedJob, RawJob, WorkplaceType } from "./types";
import { classifyJob } from "./classify";
import { assessTrust } from "./trust";

const MAX = { title: 200, company: 120, location: 160, description: 6000, salary: 120, id: 200, url: 2000 };

export function cleanText(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };

/** HTML -> readable plain text (paragraphs and list items kept as line breaks). */
export function htmlToText(html: unknown, max = MAX.description): string {
  if (typeof html !== "string" || !html) return "";
  const text = html
    .replace(/<(script|style|iframe|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6]|\/tr)\s*\/?>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+\d*);/gi, (m, e: string) => {
      if (e[0] === "#") {
        const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) && code > 31 && code < 0x10ffff ? String.fromCodePoint(code) : " ";
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    })
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
}

/** A clean https URL, or null. With hosts given, only those hosts (and their subdomains). */
export function safeHttpsUrl(raw: unknown, allowedHosts: string[] = []): string | null {
  if (typeof raw !== "string" || raw.length > MAX.url) return null;
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password) return null;
  const host = u.hostname.toLowerCase();
  if (!host.includes(".") || /^\d+\.\d+\.\d+\.\d+$/.test(host) || host === "localhost") return null;
  if (allowedHosts.length && !allowedHosts.some((h) => host === h || host.endsWith(`.${h}`))) return null;
  // Tracking parameters are not part of the job.
  for (const k of [...u.searchParams.keys()]) if (/^utm_|^ref$|^fbclid$|^gclid$/i.test(k)) u.searchParams.delete(k);
  return u.toString();
}

export function inferEmploymentType(...hints: (string | null | undefined)[]): EmploymentType {
  const t = hints.filter(Boolean).join(" ").toLowerCase().replace(/[_-]/g, " ");
  if (/\bintern(ship)?s?\b|\btrainee\b|\bapprentice/.test(t)) return "Internship";
  if (/\bpart ?time\b/.test(t)) return "Part-time";
  if (/\bcontract(or)?\b|\bfreelance\b/.test(t)) return "Contract";
  if (/\btemporary\b|\btemp\b|\bseasonal\b/.test(t)) return "Temporary";
  if (/\bfull ?time\b|\bpermanent\b/.test(t)) return "Full-time";
  return "Unknown";
}

export function inferWorkplace(defaultRemote: boolean, ...hints: (string | null | undefined)[]): WorkplaceType {
  const t = hints.filter(Boolean).join(" ").toLowerCase();
  if (/\bhybrid\b/.test(t)) return "Hybrid";
  if (defaultRemote || /\bremote\b|work from home|\bwfh\b|anywhere/.test(t)) return "Remote";
  if (/\bon-?site\b|\bin[- ]office\b|\boffice[- ]based\b/.test(t)) return "On-site";
  return "Unknown";
}

/** From the title only - a hint for filtering, never shown as a requirement. */
export function experienceHint(title: string): ExperienceHint {
  const t = title.toLowerCase();
  if (/\bintern(ship)?\b|\btrainee\b|\bapprentice/.test(t)) return "internship";
  if (/\b(senior|sr\.?|lead|principal|principle|staff|head|director|vp|vice president|chief|co-?founder|founder|cto|ceo|cfo|coo|cso|cmo|cpo|ciso)\b/.test(t)) return "senior";
  if (/\b(junior|jr\.?|entry[- ]level|graduate|associate|fresher|campus)\b/.test(t)) return "entry";
  return null;
}

/** Only when the listing itself says so. */
export function isFresherListing(title: string, text: string): boolean {
  return /\bfreshers?\b|\bentry[- ]level\b|\bgraduate (trainee|programme|program|engineer|analyst)\b|\bno (prior )?experience (required|needed)\b|\b0\s*[-–to]+\s*1\s*(yrs?|years?)\b|\bcampus (hire|hiring|recruitment)\b|\bnew grad/i.test(`${title} ${text}`);
}

export function parseDate(v: unknown, now: Date): string | null {
  if (v === null || v === undefined || v === "") return null;
  const d = typeof v === "number" ? new Date(v < 1e12 ? v * 1000 : v) : new Date(String(v));
  if (Number.isNaN(d.getTime())) return null;
  // Not in the future (a day of clock skew allowed) and not absurdly old.
  if (d.getTime() > now.getTime() + 86_400_000 || d.getFullYear() < 2000) return null;
  return d.toISOString();
}

export type NormalizeOutcome = { ok: true; job: NormalizedJob } | { ok: false; reason: string };

export function normalizeJob(raw: RawJob, source: Pick<JobSource, "id" | "kind" | "attribution" | "allowedApplyHosts" | "keepDescription">, now: Date): NormalizeOutcome {
  const externalId = cleanText(raw.externalId, MAX.id);
  if (!externalId || !/^[\w.:@/+-]+$/.test(externalId)) return { ok: false, reason: "invalid external id" };
  const title = cleanText(raw.title, MAX.title);
  const company = cleanText(raw.company, MAX.company);
  if (!title || title.length < 2) return { ok: false, reason: "missing title" };
  if (!company) return { ok: false, reason: "missing company" };
  const applyUrl = safeHttpsUrl(raw.applyUrl, source.allowedApplyHosts);
  if (!applyUrl) return { ok: false, reason: "apply link is not a valid https link on an allowed host" };
  const sourceUrl = raw.sourceUrl ? safeHttpsUrl(raw.sourceUrl) : null;

  const description = source.keepDescription ? htmlToText(raw.descriptionHtml || "") || cleanText(raw.descriptionText, MAX.description) || null : null;
  const location = cleanText(raw.location, MAX.location) || null;
  const text = `${raw.employmentType ?? ""} ${raw.workplace ?? ""} ${location ?? ""} ${(raw.tags ?? []).join(" ")}`;
  const employment = inferEmploymentType(raw.employmentType, title, (raw.tags ?? []).join(" "));
  const workplace = inferWorkplace(false, raw.workplace, location, title);
  const { category, role } = classifyJob(title, raw.sourceCategory ?? null, raw.tags ?? []);
  const trust = assessTrust({ kind: source.kind, title, company, description: description ?? cleanText(raw.descriptionText, 3000), applyUrl, salary: raw.salary ?? null });

  return {
    ok: true,
    job: {
      source: source.id,
      external_id: externalId,
      title,
      company,
      company_logo: raw.companyLogo ? safeHttpsUrl(raw.companyLogo) : null,
      location,
      employment_type: employment,
      workplace_type: workplace,
      experience_hint: experienceHint(title) ?? raw.level ?? null,
      is_fresher: isFresherListing(title, `${text} ${description ?? ""}`),
      description,
      salary_text: cleanText(raw.salary, MAX.salary) || null,
      apply_url: applyUrl,
      source_url: sourceUrl,
      attribution: source.attribution || null,
      category,
      role_match: role,
      trust_level: trust.level,
      trust_flags: trust.flags,
      posted_at: parseDate(raw.postedAt, now),
    },
  };
}

/** Keep one row per (source, external_id) within a batch - the last one wins. */
export function dedupeBatch(rows: NormalizedJob[]): NormalizedJob[] {
  const byKey = new Map<string, NormalizedJob>();
  for (const r of rows) byKey.set(`${r.source}\u0000${r.external_id}`, r);
  return [...byKey.values()];
}
