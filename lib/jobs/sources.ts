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
 * Every configured source. Remotive runs unless JOB_SOURCES_OFF lists it;
 * the others need their permission (and keys) configured first.
 */
export function getSources(env: Env = process.env): JobSource[] {
  const off = new Set((env.JOB_SOURCES_OFF ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  const all = [remotive(true), adzuna(env), arbeitnow(env), ...greenhouseBoards(env), ...leverBoards(env)];
  return all.map((s) => (off.has(s.id) ? { ...s, enabled: false, disabledReason: "Switched off in JOB_SOURCES_OFF" } : s));
}
