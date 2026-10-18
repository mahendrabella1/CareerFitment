/**
 * Job portal (OneGrasp Launchpad) - shared types. Pure: safe to import from
 * client and server code. See docs/JOB_PORTAL.md.
 */

export type EmploymentType = "Full-time" | "Part-time" | "Internship" | "Contract" | "Temporary" | "Unknown";
export type WorkplaceType = "Remote" | "Hybrid" | "On-site" | "Unknown";
export type ExperienceHint = "internship" | "entry" | "senior" | null;
export type TrustLevel = "verified" | "standard" | "caution";
export type SourceKind = "aggregator" | "employer" | "onegrasp" | "school";

/** A job as an adapter hands it over, before normalising. */
export interface RawJob {
  externalId: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location?: string | null;
  employmentType?: string | null;
  /** Free text the source gives about remote/hybrid/office, if any. */
  workplace?: string | null;
  descriptionHtml?: string | null;
  descriptionText?: string | null;
  salary?: string | null;
  applyUrl: string;
  sourceUrl?: string | null;
  postedAt?: string | number | null;
  /** The source's own category label ("Software Development"). */
  sourceCategory?: string | null;
  /** The source's own seniority label, mapped (Himalayas, Jobicy). The title wins when it says. */
  level?: ExperienceHint;
  tags?: string[];
}

/** A row ready for the jobs table. */
export interface NormalizedJob {
  source: string;
  external_id: string;
  title: string;
  company: string;
  company_logo: string | null;
  location: string | null;
  employment_type: EmploymentType;
  workplace_type: WorkplaceType;
  experience_hint: ExperienceHint;
  is_fresher: boolean;
  description: string | null;
  salary_text: string | null;
  apply_url: string;
  source_url: string | null;
  attribution: string | null;
  category: string | null;
  role_match: string | null;
  trust_level: TrustLevel;
  trust_flags: string[];
  posted_at: string | null;
}

/** What one source returned in one run. */
export interface FetchResult {
  jobs: RawJob[];
  /** True only when this run saw ALL of the source's live jobs (enables missing-means-closed). */
  complete: boolean;
}

export interface SourceContext {
  /** fetch with a timeout and the importer's user agent. */
  fetchJson: (url: string, init?: { headers?: Record<string, string> }) => Promise<unknown>;
  now: Date;
}

export interface JobSource {
  id: string;
  name: string;
  kind: SourceKind;
  /** Where the permission to show these jobs was reviewed, and when. */
  termsUrl: string;
  reviewedOn: string;
  permissionNote: string;
  /** Shown on every card from this source ("via Remotive"). */
  attribution: string;
  /** Hosts an apply link may point to; empty = any HTTPS host. */
  allowedApplyHosts: string[];
  /** Whether a single fetch returns every live job of the source. */
  completeSnapshot: boolean;
  /** Fallback expiry: inactive after this many days unseen (after a successful run). */
  staleDays: number;
  /** Store the description? Only when the source's terms allow showing it. */
  keepDescription: boolean;
  /** Why it can run: false keeps it off (permission or configuration missing). */
  enabled: boolean;
  disabledReason?: string;
  fetch: (ctx: SourceContext) => Promise<FetchResult>;
}

export interface SourceRunResult {
  source: string;
  status: "ok" | "partial" | "failed" | "skipped";
  fetched: number;
  valid: number;
  upserted: number;
  expired: number;
  complete: boolean;
  message: string;
}

export interface JobListItem {
  id: string;
  source: string;
  title: string;
  company: string;
  company_logo: string | null;
  location: string | null;
  employment_type: EmploymentType;
  workplace_type: WorkplaceType;
  experience_hint: ExperienceHint;
  is_fresher: boolean;
  salary_text: string | null;
  apply_url: string;
  source_url: string | null;
  attribution: string | null;
  category: string | null;
  role_match: string | null;
  trust_level: TrustLevel;
  trust_flags: string[];
  posted_at: string | null;
  last_seen_at: string;
}

export interface JobDetail extends JobListItem {
  description: string | null;
}

export interface JobSearchParams {
  q?: string;
  location?: string;
  category?: string;
  type?: EmploymentType;
  workplace?: WorkplaceType;
  fresher?: boolean;
  role?: string;
  roles?: string[];
  /** "student" (default): internships / entry level / fresher-friendly first, senior roles last. "new": newest first. */
  sort?: "student" | "new";
  page?: number;
}

export interface JobSearchResult {
  jobs: JobListItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** Real counts over the active listings, for the portal's home view. */
export interface JobStats {
  total: number;
  companies: number;
  postedThisWeek: number;
  fresher: number;
  remote: number;
  /** Active jobs per career cluster name. */
  categories: Record<string, number>;
  /** The companies with the most active listings. */
  topCompanies: { name: string; logo: string | null; count: number }[];
  /** The most common location labels, for the location box's suggestions. */
  locations: string[];
  /** The most common matched roles, for "Popular" searches. */
  popularRoles: string[];
  /** When the import last saw a live job (≈ the last successful update). */
  lastUpdated: string | null;
}

/** A student's own tracker entry (Firestore users/{uid}.jobs.{jobId}). */
export type TrackStatus = "saved" | "applied" | "interview" | "offer" | "closed";
export interface TrackedJob {
  status: TrackStatus;
  title: string;
  company: string;
  applyUrl: string;
  savedAt: number;
  updatedAt: number;
}
