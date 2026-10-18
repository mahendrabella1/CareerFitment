/**
 * Reading listings for the portal - with the PUBLIC (anon) Supabase key, so
 * row-level security only ever returns active jobs. Server-side (used by the
 * /api/jobs routes); every filter value is checked against a fixed list.
 */
import { getSupabaseClient } from "@/lib/supabase/client";
import type { EmploymentType, JobDetail, JobListItem, JobSearchParams, JobSearchResult, JobStats, WorkplaceType } from "./types";
import { STATS_COLUMNS, summarizeJobs, type StatsRow } from "./stats";

export const PAGE_SIZE = 20;
export const EMPLOYMENT_TYPES: EmploymentType[] = ["Internship", "Full-time", "Part-time", "Contract", "Temporary"];
export const WORKPLACE_TYPES: WorkplaceType[] = ["Remote", "Hybrid", "On-site"];

const LIST_COLUMNS = "id,source,title,company,company_logo,location,employment_type,workplace_type,experience_hint,is_fresher,salary_text,apply_url,source_url,attribution,category,role_match,trust_level,trust_flags,reported_count,posted_at,last_seen_at";

const clip = (s: unknown, n: number) => (typeof s === "string" ? s.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n) : "");
const likeSafe = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Query-string values -> validated search parameters. */
export function parseSearchParams(q: URLSearchParams, clusters: string[]): JobSearchParams {
  const type = q.get("type") as EmploymentType | null;
  const workplace = q.get("workplace") as WorkplaceType | null;
  const category = clip(q.get("category"), 80);
  const roles = q.getAll("role").map((r) => clip(r, 100)).filter(Boolean).slice(0, 20);
  return {
    q: clip(q.get("q"), 100) || undefined,
    location: clip(q.get("location"), 60) || undefined,
    category: clusters.includes(category) ? category : undefined,
    type: type && EMPLOYMENT_TYPES.includes(type) ? type : undefined,
    workplace: workplace && WORKPLACE_TYPES.includes(workplace) ? workplace : undefined,
    fresher: q.get("fresher") === "1" || undefined,
    roles: roles.length ? roles : undefined,
    sort: q.get("sort") === "new" ? "new" : "student",
    page: Math.min(Math.max(parseInt(q.get("page") || "1", 10) || 1, 1), 50),
  };
}

type Row = JobListItem & { reported_count?: number };

/** Several open reports make a listing "caution", whatever the import said. */
function withReports(r: Row): JobListItem {
  const { reported_count, ...job } = r;
  if ((reported_count ?? 0) >= 3) {
    return { ...job, trust_level: "caution", trust_flags: [...job.trust_flags, "Several people reported this listing - check carefully before applying"] };
  }
  return job;
}

// Student-friendly = the "Fresher-friendly" filter's rule.
const STUDENT_FRIENDLY = "is_fresher.eq.true,experience_hint.in.(internship,entry),employment_type.eq.Internship";

type Db = ReturnType<typeof getSupabaseClient>;

/** The jobs query with every filter applied (no ordering or paging yet). */
function filtered(db: Db, p: JobSearchParams, columns: string, head = false) {
  let query = db.from("jobs").select(columns, { count: "exact", head }).eq("is_active", true);
  if (p.q) query = query.textSearch("search", p.q, { type: "websearch", config: "simple" });
  if (p.location) {
    query = /^remote$/i.test(p.location)
      ? query.eq("workplace_type", "Remote")
      : query.ilike("location", `%${likeSafe(p.location)}%`);
  }
  if (p.category) query = query.eq("category", p.category);
  if (p.type) query = query.eq("employment_type", p.type);
  if (p.workplace) query = query.eq("workplace_type", p.workplace);
  if (p.fresher) query = query.or(STUDENT_FRIENDLY);
  if (p.roles?.length) query = query.in("role_match", p.roles);
  return query;
}
type Query = ReturnType<typeof filtered>;

// "Students first" (the default order): internships, entry-level and
// fresher-friendly jobs; then jobs that don't say; senior roles last. Newest
// first within each. The three tiers split every job exactly once.
const TIERS: ((q: Query) => Query)[] = [
  (q) => q.or(STUDENT_FRIENDLY),
  (q) => q.eq("is_fresher", false).neq("employment_type", "Internship").is("experience_hint", null),
  (q) => q.eq("is_fresher", false).neq("employment_type", "Internship").eq("experience_hint", "senior"),
];
const newestFirst = (q: Query) => q.order("posted_at", { ascending: false, nullsFirst: false }).order("last_seen_at", { ascending: false });
const toJobs = (data: unknown) => ((data ?? []) as unknown as Row[]).map(withReports);

export async function searchJobs(p: JobSearchParams): Promise<JobSearchResult> {
  const db = getSupabaseClient();
  const page = p.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;

  // Newest first - or only student-friendly jobs anyway.
  if (p.sort === "new" || p.fresher) {
    const { data, count, error } = await newestFirst(filtered(db, p, LIST_COLUMNS)).range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    return { jobs: toJobs(data), total: count ?? 0, page, pageSize: PAGE_SIZE };
  }

  // Students first: count each tier, then read the page across tiers.
  const counts = await Promise.all(TIERS.map(async (tier) => {
    const { count, error } = await tier(filtered(db, p, "id", true));
    if (error) throw new Error(error.message);
    return count ?? 0;
  }));
  const jobs: JobListItem[] = [];
  let skip = from, need = PAGE_SIZE;
  for (let i = 0; i < TIERS.length && need > 0; i++) {
    if (skip >= counts[i]) { skip -= counts[i]; continue; }
    const take = Math.min(need, counts[i] - skip);
    const { data, error } = await newestFirst(TIERS[i](filtered(db, p, LIST_COLUMNS))).range(skip, skip + take - 1);
    if (error) throw new Error(error.message);
    jobs.push(...toJobs(data));
    need -= take;
    skip = 0;
  }
  return { jobs, total: counts.reduce((a, b) => a + b, 0), page, pageSize: PAGE_SIZE };
}

/** Counts for the home view, read page by page (PostgREST returns at most 1,000 rows a request). */
export async function getJobStats(): Promise<JobStats> {
  const db = getSupabaseClient();
  const rows: StatsRow[] = [];
  for (let from = 0; from < 20_000; from += 1000) {
    const { data, error } = await db.from("jobs").select(STATS_COLUMNS).eq("is_active", true).order("id").range(from, from + 999);
    if (error) throw new Error(error.message);
    const page = (data ?? []) as unknown as StatsRow[];
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return summarizeJobs(rows, new Date());
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getJob(id: string): Promise<JobDetail | null> {
  if (!UUID.test(id)) return null;
  const { data, error } = await getSupabaseClient().from("jobs").select(`${LIST_COLUMNS},description`).eq("id", id).eq("is_active", true).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as unknown as Row & { description: string | null };
  return { ...withReports(row), description: row.description };
}

export const isUuid = (s: string) => UUID.test(s);
