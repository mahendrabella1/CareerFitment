/**
 * The job sources and the permission behind each one. Server-side only (reads
 * environment variables). Adding a source: write an adapter below, record
 * where its terms allow showing its jobs (termsUrl, reviewedOn,
 * permissionNote), and keep it disabled until that is confirmed. See
 * docs/JOB_PORTAL.md "Adding a source".
 *
 * No user input ever reaches a URL here: hosts are fixed, and board tokens
 * come only from server configuration, checked against a strict pattern.
 */
import type { FetchResult, JobSource, RawJob, SourceContext } from "./types";

type Env = Record<string, string | undefined>;
const REVIEWED = "2026-10-17";
const TOKEN = /^[a-z0-9][a-z0-9-]{1,60}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const asArray = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? (v as Record<string, unknown>[]) : []);
const str = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter(Boolean) : str(v) ? [str(v)] : []);
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PERIOD: Record<string, string> = { hourly: "an hour", hour: "an hour", daily: "a day", weekly: "a week", monthly: "a month", month: "a month", annual: "a year", yearly: "a year", year: "a year" };
/** "USD 50,000–70,000 a year (as listed)" - only when the source states a pay figure. */
export function salaryText(min: unknown, max: unknown, currency: unknown, period: unknown): string | null {
  const lo = Number(min), hi = Number(max);
  if (!Number.isFinite(lo) || lo <= 0) return null;
  const cur = typeof currency === "string" && /^[A-Z]{3}$/.test(currency) ? `${currency} ` : "";
  const per = PERIOD[str(period).toLowerCase()];
  const n = (v: number) => Math.round(v).toLocaleString("en-US");
  return `${cur}${n(lo)}${Number.isFinite(hi) && hi > lo ? `–${n(hi)}` : ""}${per ? ` ${per}` : ""} (as listed)`;
}

/** A source's seniority labels -> "entry" (any entry/junior/intern), "senior" (all senior-type), else null. */
export function seniorityLevel(labels: string[]): "entry" | "senior" | null {
  const l = labels.map((x) => x.trim()).filter(Boolean);
  if (l.some((x) => /entry|junior|intern|graduate/i.test(x))) return "entry";
  if (l.length && l.every((x) => /senior|executive|director|manager|lead|principal|head|chief/i.test(x))) return "senior";
  return null;
}

/** Text that was UTF-8 read as Latin-1 ("MÃ©xico") back to "México"; unchanged when unsure. */
export function fixMojibake(s: string): string {
  if (!/[ÃÂ][\u0080-¿]/.test(s) || /[^\u0000-ÿ]/.test(s)) return s;
  const t = Buffer.from(s, "latin1").toString("utf8");
  return t.includes("�") ? s : t;
}

// ---------------------------------------------------------------- Remotive (worldwide remote)
// Terms: https://github.com/remotive-com/remote-jobs-api (reviewed 2026-10-17).
// Link back to the Remotive job URL and name Remotive as the source; jobs are
// delayed 24 h by the API; max 4 fetches a day and 2 requests a minute; do not
// submit the jobs to Google Jobs / LinkedIn (so no JobPosting markup); do not
// use them to collect sign-ups (so they are visible without signing in).
export function remotive(enabled: boolean): JobSource {
  return {
    id: "remotive",
    name: "Remotive",
    kind: "aggregator",
    termsUrl: "https://github.com/remotive-com/remote-jobs-api",
    reviewedOn: REVIEWED,
    permissionNote: "Free public API. Required: link to the Remotive job page and credit Remotive. 24 h delay, at most 4 fetches a day, no resubmission to Google Jobs or LinkedIn, no sign-up gating.",
    attribution: "via Remotive",
    allowedApplyHosts: ["remotive.com"],
    completeSnapshot: true, // the endpoint returns every live job when no limit is set
    staleDays: 14,
    keepDescription: true,
    enabled,
    async fetch(ctx: SourceContext): Promise<FetchResult> {
      const data = (await ctx.fetchJson("https://remotive.com/api/remote-jobs")) as Record<string, unknown>;
      const jobs = asArray(data?.jobs);
      const count = Number(data?.["job-count"]);
      const raw: RawJob[] = jobs.map((j) => ({
        externalId: str(j.id),
        title: str(j.title),
        company: str(j.company_name),
        companyLogo: str(j.company_logo) || null,
        location: str(j.candidate_required_location) || "Remote",
        employmentType: str(j.job_type),
        workplace: "remote",
        descriptionHtml: str(j.description),
        salary: str(j.salary) || null,
        applyUrl: str(j.url),
        sourceUrl: str(j.url),
        postedAt: str(j.publication_date),
        sourceCategory: str(j.category),
        tags: Array.isArray(j.tags) ? (j.tags as unknown[]).map(str).filter(Boolean).slice(0, 15) : [],
      }));
      return { jobs: raw, complete: Number.isFinite(count) && count > 0 && count === jobs.length };
    },
  };
}

// ---------------------------------------------------------------- Himalayas (remote jobs open to India)
// Terms: https://himalayas.app/docs/remote-jobs-api (reviewed 2026-10-18) -
// for "commercial and personal integrations": show a visible Himalayas credit
// with a link to himalayas.app; every Apply uses the API's applicationLink;
// do not redistribute to other job boards or aggregators (incl. Google Jobs,
// LinkedIn) - so no JobPosting markup. Public allowance without a key; data
// refreshes every 24 h. Searches jobs open to candidates in India, 20 a page.
export function himalayas(env: Env): JobSource {
  const pages = Math.min(Math.max(Number(env.JOB_HIMALAYAS_PAGES) || 10, 1), 25);
  return {
    id: "himalayas",
    name: "Himalayas",
    kind: "aggregator",
    termsUrl: "https://himalayas.app/docs/remote-jobs-api",
    reviewedOn: "2026-10-18",
    permissionNote: "Public API for commercial and personal use. Required: visible Himalayas credit linking to himalayas.app, Apply through the API's applicationLink, no redistribution to other job boards or aggregators (incl. Google Jobs, LinkedIn).",
    attribution: "via Himalayas",
    allowedApplyHosts: ["himalayas.app"],
    completeSnapshot: false,
    staleDays: 14,
    keepDescription: true,
    enabled: true,
    async fetch(ctx: SourceContext): Promise<FetchResult> {
      const seen = new Map<string, RawJob>();
      for (let page = 1; page <= pages; page++) {
        const data = (await ctx.fetchJson(`https://himalayas.app/jobs/api/search?country=India&page=${page}`)) as Record<string, unknown>;
        const jobs = asArray(data?.jobs);
        for (const j of jobs) {
          const link = str(j.applicationLink);
          const id = (str(j.guid) || link).replace(/^https:\/\/himalayas\.app\//, "");
          const where = list(j.locationRestrictions);
          seen.set(id, {
            externalId: id,
            title: str(j.title),
            company: str(j.companyName),
            companyLogo: str(j.companyLogo) || null,
            location: where.length ? where.slice(0, 6).join(", ") : "Worldwide",
            employmentType: str(j.employmentType),
            workplace: "remote",
            descriptionHtml: str(j.description) || str(j.excerpt),
            salary: salaryText(j.minSalary, j.maxSalary, j.currency, j.salaryPeriod),
            applyUrl: link,
            sourceUrl: link,
            postedAt: typeof j.pubDate === "number" ? j.pubDate : str(j.pubDate),
            sourceCategory: list(j.parentCategories).join(" "),
            tags: list(j.seniority).some((s) => /entry|junior|intern/i.test(s)) ? ["entry level"] : [],
            level: seniorityLevel(list(j.seniority)),
          });
        }
        if (jobs.length < 20) break;
        await pause(250);
      }
      return { jobs: [...seen.values()], complete: false };
    },
  };
}

// ---------------------------------------------------------------- Jobicy (remote)
// Terms: https://jobicy.com/jobs-rss-feed (reviewed 2026-10-18): "You may use
// Jobicy listings in your own products and user experiences without requesting
// individual permission." Required: credit Jobicy with a clickable link, keep
// the canonical Jobicy job URL ("all application buttons redirect to the
// original job URL provided in this feed"), cache, avoid excessive requests.
// The feed holds jobs from the last 7 days, up to 200 a request.
export function jobicy(): JobSource {
  return {
    id: "jobicy",
    name: "Jobicy",
    kind: "aggregator",
    termsUrl: "https://jobicy.com/jobs-rss-feed",
    reviewedOn: "2026-10-18",
    permissionNote: "Public API that allows use in other products without asking. Required: credit Jobicy with a clickable link; Apply goes to the listing's Jobicy URL; no excessive requests (3 a day here).",
    attribution: "via Jobicy",
    allowedApplyHosts: ["jobicy.com"],
    completeSnapshot: false,
    staleDays: 14,
    keepDescription: true,
    enabled: true,
    async fetch(ctx: SourceContext): Promise<FetchResult> {
      const seen = new Map<string, RawJob>();
      // The newest jobs anywhere, plus those open to Asia-Pacific and to anyone.
      for (const q of ["count=200", "count=100&geo=apac", "count=100&geo=anywhere"]) {
        const data = (await ctx.fetchJson(`https://jobicy.com/api/v2/remote-jobs?${q}`)) as Record<string, unknown>;
        for (const j of asArray(data?.jobs)) {
          seen.set(str(j.id), {
            externalId: str(j.id),
            title: str(j.jobTitle),
            company: str(j.companyName),
            companyLogo: str(j.companyLogo) || null,
            location: str(j.jobGeo) || "Remote",
            employmentType: list(j.jobType).join(" "),
            workplace: "remote",
            descriptionHtml: str(j.jobDescription) || str(j.jobExcerpt),
            salary: salaryText(j.salaryMin, j.salaryMax, j.salaryCurrency, j.salaryPeriod),
            applyUrl: str(j.url),
            sourceUrl: str(j.url),
            postedAt: str(j.pubDate),
            sourceCategory: list(j.jobIndustry).join(" "),
            tags: /entry|junior/i.test(str(j.jobLevel)) ? ["entry level"] : [],
            level: seniorityLevel(str(j.jobLevel).split(",")),
          });
        }
        await pause(250);
      }
      return { jobs: [...seen.values()], complete: false };
    },
  };
}

// ---------------------------------------------------------------- Remote OK
// Terms (the API's own "legal" notice, reviewed 2026-10-18): link back - with
// follow, not nofollow - to the job's URL on Remote OK and mention Remote OK
// as the source; don't use the Remote OK logo (the name is fine). The feed is
// the latest ~100 jobs. Its tags are broad and noisy, so they aren't used to
// pick a field.
export function remoteOk(): JobSource {
  return {
    id: "remoteok",
    name: "Remote OK",
    kind: "aggregator",
    termsUrl: "https://remoteok.com/api",
    reviewedOn: "2026-10-18",
    permissionNote: "Public API. Required: a followed link back to the job's Remote OK URL and the name Remote OK as the source; no Remote OK logo.",
    attribution: "via Remote OK",
    allowedApplyHosts: ["remoteok.com"],
    completeSnapshot: false,
    staleDays: 14,
    keepDescription: true,
    enabled: true,
    async fetch(ctx: SourceContext): Promise<FetchResult> {
      const rows = asArray(await ctx.fetchJson("https://remoteok.com/api")).filter((j) => j.id && j.position);
      return {
        complete: false,
        jobs: rows.map((j) => ({
          externalId: str(j.id),
          title: fixMojibake(str(j.position)),
          company: fixMojibake(str(j.company)),
          companyLogo: str(j.company_logo) || str(j.logo) || null,
          location: fixMojibake(str(j.location)) || "Remote",
          workplace: "remote",
          descriptionHtml: fixMojibake(str(j.description)),
          salary: salaryText(j.salary_min, j.salary_max, "USD", "yearly"),
          applyUrl: str(j.url),
          sourceUrl: str(j.url),
          postedAt: str(j.date) || (typeof j.epoch === "number" ? j.epoch : null),
        })),
      };
    },
  };
}

// ---------------------------------------------------------------- Adzuna (India)
// Terms: https://developer.adzuna.com/docs/terms_of_service (reviewed 2026-10-17).
// Permits "publishing Adzuna listings" with "Jobs by Adzuna" attribution, but
// another published version asks for an agreement for commercial use - so it
// stays off until OneGrasp has Adzuna's confirmation (ADZUNA_PERMISSION_CONFIRMED_ON)
// and API keys. Limits: 25/min, 250/day - this uses 4 calls a day.
export function adzuna(env: Env): JobSource {
  const id = env.ADZUNA_APP_ID, key = env.ADZUNA_APP_KEY, ok = env.ADZUNA_PERMISSION_CONFIRMED_ON;
  const enabled = Boolean(id && key && ok && DATE.test(ok));
  return {
    id: "adzuna",
    name: "Adzuna",
    kind: "aggregator",
    termsUrl: "https://developer.adzuna.com/docs/terms_of_service",
    reviewedOn: ok && DATE.test(ok) ? ok : REVIEWED,
    permissionNote: "Free developer key. Attribution 'Jobs by Adzuna' on listings. Confirm commercial use with Adzuna before enabling.",
    attribution: "Jobs by Adzuna",
    allowedApplyHosts: ["adzuna.in", "adzuna.com"],
    completeSnapshot: false,
    staleDays: 21,
    keepDescription: true, // Adzuna's API gives a short snippet meant for display
    enabled,
    disabledReason: enabled ? undefined : "Needs ADZUNA_APP_ID, ADZUNA_APP_KEY and ADZUNA_PERMISSION_CONFIRMED_ON (the date Adzuna confirmed commercial use)",
    async fetch(ctx: SourceContext): Promise<FetchResult> {
      const out: RawJob[] = [];
      // Student-relevant first: freshers, interns, graduates, trainees - newest first.
      for (const page of [1, 2, 3, 4]) {
        const q = new URLSearchParams({ app_id: id!, app_key: key!, results_per_page: "50", what_or: "fresher intern internship graduate trainee entry", max_days_old: "21", sort_by: "date" });
        const data = (await ctx.fetchJson(`https://api.adzuna.com/v1/api/jobs/in/search/${page}?${q}`)) as Record<string, unknown>;
        const results = asArray(data?.results);
        for (const j of results) {
          const company = (j.company as Record<string, unknown>) ?? {};
          const loc = (j.location as Record<string, unknown>) ?? {};
          const cat = (j.category as Record<string, unknown>) ?? {};
          const predicted = str(j.salary_is_predicted) === "1";
          const min = Number(j.salary_min), max = Number(j.salary_max);
          out.push({
            externalId: str(j.id),
            title: str(j.title),
            company: str(company.display_name),
            location: str(loc.display_name),
            employmentType: `${str(j.contract_time)} ${str(j.contract_type)}`,
            descriptionText: str(j.description),
            // Only a salary the employer stated - Adzuna's own estimates are not shown.
            salary: !predicted && min > 0 ? `₹${Math.round(min).toLocaleString("en-IN")}${max > min ? `–${Math.round(max).toLocaleString("en-IN")}` : ""} a year (as listed)` : null,
            applyUrl: str(j.redirect_url),
            sourceUrl: str(j.redirect_url),
            postedAt: str(j.created),
            sourceCategory: str(cat.label),
          });
        }
        if (results.length < 50) break;
      }
      return { jobs: out, complete: false };
    },
  };
}

// ---------------------------------------------------------------- Arbeitnow (Europe, remote)
// Terms: https://arbeitnow.com/en/terms (reviewed 2026-10-17). Section 11 asks
// for a link back to Arbeitnow, but Section 2 restricts public/commercial
// display of site materials - unclear for OneGrasp, so off until Arbeitnow
// confirms in writing (ARBEITNOW_PERMISSION_CONFIRMED_ON).
export function arbeitnow(env: Env): JobSource {
  const ok = env.ARBEITNOW_PERMISSION_CONFIRMED_ON;
  const enabled = Boolean(ok && DATE.test(ok));
  return {
    id: "arbeitnow",
    name: "Arbeitnow",
    kind: "aggregator",
    termsUrl: "https://arbeitnow.com/en/terms",
    reviewedOn: enabled ? ok! : REVIEWED,
    permissionNote: "Free API with a required link back to Arbeitnow.com; general terms restrict commercial public display - written confirmation needed.",
    attribution: "via Arbeitnow",
    allowedApplyHosts: ["arbeitnow.com"],
    completeSnapshot: false,
    staleDays: 21,
    keepDescription: true,
    enabled,
    disabledReason: enabled ? undefined : "Needs Arbeitnow's written permission (set ARBEITNOW_PERMISSION_CONFIRMED_ON)",
    async fetch(ctx: SourceContext): Promise<FetchResult> {
      const out: RawJob[] = [];
      for (const page of [1, 2, 3, 4, 5]) {
        const data = (await ctx.fetchJson(`https://www.arbeitnow.com/api/job-board-api?page=${page}`)) as Record<string, unknown>;
        const rows = asArray(data?.data);
        for (const j of rows) {
          out.push({
            externalId: str(j.slug),
            title: str(j.title),
            company: str(j.company_name),
            location: str(j.location),
            employmentType: Array.isArray(j.job_types) ? (j.job_types as unknown[]).map(str).join(" ") : "",
            workplace: j.remote === true ? "remote" : "",
            descriptionHtml: str(j.description),
            applyUrl: str(j.url),
            sourceUrl: str(j.url),
            postedAt: typeof j.created_at === "number" ? j.created_at : str(j.created_at),
            tags: Array.isArray(j.tags) ? (j.tags as unknown[]).map(str).slice(0, 15) : [],
          });
        }
        if (!rows.length) break;
      }
      return { jobs: out, complete: false };
    },
  };
}

// ---------------------------------------------------------------- Employer boards (Greenhouse, Lever)
// Each board is one employer's own careers feed. Their APIs are meant for the
// employer's own careers page, so a board is added ONLY with that employer's
// permission, recorded in the configuration:
//   JOB_GREENHOUSE_BOARDS='[{"token":"acme","company":"Acme","permissionUrl":"https://...","reviewedOn":"2026-10-20"}]'
//   JOB_LEVER_BOARDS='[{"site":"acme","company":"Acme","permissionUrl":"https://...","reviewedOn":"2026-10-20"}]'
interface BoardConfig { token?: string; site?: string; company: string; permissionUrl: string; reviewedOn: string; applyHosts?: string[] }

function parseBoards(json: string | undefined, key: "token" | "site"): BoardConfig[] {
  if (!json) return [];
  try {
    const list = JSON.parse(json) as BoardConfig[];
    return (Array.isArray(list) ? list : []).filter((b) =>
      b && TOKEN.test(String(b[key] ?? "")) && typeof b.company === "string" && b.company.trim()
      && /^https:\/\//.test(String(b.permissionUrl ?? "")) && DATE.test(String(b.reviewedOn ?? "")));
  } catch {
    return [];
  }
}

export function greenhouseBoards(env: Env): JobSource[] {
  return parseBoards(env.JOB_GREENHOUSE_BOARDS, "token").map((b) => ({
    id: `greenhouse:${b.token!.toLowerCase()}`,
    name: `${b.company} (Greenhouse)`,
    kind: "employer",
    termsUrl: b.permissionUrl,
    reviewedOn: b.reviewedOn,
    permissionNote: `${b.company} agreed to OneGrasp showing its Greenhouse job board.`,
    attribution: `${b.company} careers`,
    allowedApplyHosts: ["greenhouse.io", ...(b.applyHosts ?? [])],
    completeSnapshot: true,
    staleDays: 14,
    keepDescription: true,
    enabled: true,
    async fetch(ctx) {
      const data = (await ctx.fetchJson(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(b.token!)}/jobs?content=true`)) as Record<string, unknown>;
      const jobs = asArray(data?.jobs);
      return {
        complete: true,
        jobs: jobs.map((j) => ({
          externalId: str(j.id),
          title: str(j.title),
          company: b.company,
          location: str((j.location as Record<string, unknown>)?.name),
          // Greenhouse escapes the HTML of `content`.
          descriptionHtml: str(j.content).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
          applyUrl: str(j.absolute_url),
          sourceUrl: str(j.absolute_url),
          postedAt: str(j.updated_at),
          sourceCategory: asArray(j.departments).map((d) => str(d.name)).join(" "),
        })),
      };
    },
  }));
}

export function leverBoards(env: Env): JobSource[] {
  return parseBoards(env.JOB_LEVER_BOARDS, "site").map((b) => ({
    id: `lever:${b.site!.toLowerCase()}`,
    name: `${b.company} (Lever)`,
    kind: "employer",
    termsUrl: b.permissionUrl,
    reviewedOn: b.reviewedOn,
    permissionNote: `${b.company} agreed to OneGrasp showing its Lever job board.`,
    attribution: `${b.company} careers`,
    allowedApplyHosts: ["lever.co", ...(b.applyHosts ?? [])],
    completeSnapshot: true,
    staleDays: 14,
    keepDescription: true,
    enabled: true,
    async fetch(ctx) {
      const list = asArray(await ctx.fetchJson(`https://api.lever.co/v0/postings/${encodeURIComponent(b.site!)}?mode=json`));
      return {
        complete: true,
        jobs: list.map((j) => {
          const cats = (j.categories as Record<string, unknown>) ?? {};
          return {
            externalId: str(j.id),
            title: str(j.text),
            company: b.company,
            location: str(cats.location),
            employmentType: str(cats.commitment),
            workplace: str(j.workplaceType),
            descriptionText: str(j.descriptionPlain),
            applyUrl: str(j.applyUrl) || str(j.hostedUrl),
            sourceUrl: str(j.hostedUrl),
            postedAt: typeof j.createdAt === "number" ? j.createdAt : str(j.createdAt),
            sourceCategory: str(cats.team),
          };
        }),
      };
    },
  }));
}

/**
 * Every configured source. Remotive, Himalayas, Jobicy and Remote OK (public
 * APIs whose terms allow showing their jobs) run unless JOB_SOURCES_OFF lists
 * them; the others need their permission (and keys) configured first.
 * Himalayas runs early: its jobs are the ones open to candidates in India.
 */
export function getSources(env: Env = process.env): JobSource[] {
  const off = new Set((env.JOB_SOURCES_OFF ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  const all = [remotive(true), himalayas(env), jobicy(), remoteOk(), adzuna(env), arbeitnow(env), ...greenhouseBoards(env), ...leverBoards(env)];
  return all.map((s) => (off.has(s.id) ? { ...s, enabled: false, disabledReason: "Switched off in JOB_SOURCES_OFF" } : s));
}
