/**
 * Reading listings for the portal - with the PUBLIC (anon) Supabase key, so
 * row-level security only ever returns active jobs. Server-side (used by the
 * /api/jobs routes); every filter value is checked against a fixed list.
 */
import { getSupabaseClient } from "@/lib/supabase/client";
import type { EmploymentType, JobDetail, JobListItem, JobSearchParams, JobSearchResult, WorkplaceType } from "./types";

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

export async function searchJobs(p: JobSearchParams): Promise<JobSearchResult> {
  const db = getSupabaseClient();
  const page = p.page ?? 1;
  let query = db.from("jobs").select(LIST_COLUMNS, { count: "exact" }).eq("is_active", true);
  if (p.q) query = query.textSearch("search", p.q, { type: "websearch", config: "simple" });
  if (p.location) {
    query = /^remote$/i.test(p.location)
      ? query.eq("workplace_type", "Remote")
      : query.ilike("location", `%${likeSafe(p.location)}%`);
  }
  if (p.category) query = query.eq("category", p.category);
  if (p.type) query = query.eq("employment_type", p.type);
  if (p.workplace) query = query.eq("workplace_type", p.workplace);
  if (p.fresher) query = query.or("is_fresher.eq.true,experience_hint.in.(internship,entry),employment_type.eq.Internship");
  if (p.roles?.length) query = query.in("role_match", p.roles);
  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("posted_at", { ascending: false, nullsFirst: false })
    .order("last_seen_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw new Error(error.message);
  return { jobs: ((data ?? []) as unknown as Row[]).map(withReports), total: count ?? 0, page, pageSize: PAGE_SIZE };
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
