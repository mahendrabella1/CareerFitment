/**
 * The portal's home-page numbers, computed from the active listings
 * themselves - never estimates. Pure: unit-tested in tests/jobs/stats.test.mjs.
 */
import type { JobStats } from "./types";

export interface StatsRow {
  company: string;
  company_logo: string | null;
  category: string | null;
  location: string | null;
  employment_type: string;
  workplace_type: string;
  is_fresher: boolean;
  experience_hint: string | null;
  posted_at: string | null;
  role_match: string | null;
  last_seen_at: string;
}

export const STATS_COLUMNS = "company,company_logo,category,location,employment_type,workplace_type,is_fresher,experience_hint,posted_at,role_match,last_seen_at";

/** The same rule as the "Fresher-friendly" filter (lib/jobs/search.ts). */
export const isFresherRow = (r: Pick<StatsRow, "is_fresher" | "experience_hint" | "employment_type">) =>
  r.is_fresher || r.experience_hint === "internship" || r.experience_hint === "entry" || r.employment_type === "Internship";

function top<T>(counts: Map<string, { item: T; count: number }>, n: number): T[] {
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, n).map((x) => x.item);
}

export function summarizeJobs(rows: StatsRow[], now: Date): JobStats {
  const weekAgo = now.getTime() - 7 * 86_400_000;
  const companies = new Map<string, { item: { name: string; logo: string | null; count: number }; count: number }>();
  const locations = new Map<string, { item: string; count: number }>();
  const roles = new Map<string, { item: string; count: number }>();
  const categories: Record<string, number> = {};
  let postedThisWeek = 0, fresher = 0, remote = 0;
  let lastUpdated: string | null = null;

  for (const r of rows) {
    const name = (r.company ?? "").trim();
    if (name) {
      const key = name.toLowerCase();
      const c = companies.get(key) ?? { item: { name, logo: null, count: 0 }, count: 0 };
      c.count++;
      c.item.count = c.count;
      c.item.logo ??= r.company_logo || null;
      companies.set(key, c);
    }
    const loc = (r.location ?? "").trim();
    if (loc && loc.length <= 40) {
      const l = locations.get(loc.toLowerCase()) ?? { item: loc, count: 0 };
      l.count++;
      locations.set(loc.toLowerCase(), l);
    }
    if (r.role_match) {
      const x = roles.get(r.role_match) ?? { item: r.role_match, count: 0 };
      x.count++;
      roles.set(r.role_match, x);
    }
    if (r.category) categories[r.category] = (categories[r.category] ?? 0) + 1;
    if (r.posted_at && new Date(r.posted_at).getTime() >= weekAgo) postedThisWeek++;
    if (isFresherRow(r)) fresher++;
    if (r.workplace_type === "Remote") remote++;
    if (r.last_seen_at && (!lastUpdated || r.last_seen_at > lastUpdated)) lastUpdated = r.last_seen_at;
  }

  return {
    total: rows.length,
    companies: companies.size,
    postedThisWeek,
    fresher,
    remote,
    categories,
    topCompanies: top(companies, 8),
    locations: top(locations, 12),
    popularRoles: top(roles, 6),
    lastUpdated,
  };
}
