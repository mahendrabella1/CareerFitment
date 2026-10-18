"use client";

/**
 * OneGrasp Jobs - the job portal (public /jobs and the dashboard's
 * /account/jobs).
 *
 * Home view, like a job site's front page: search, the companies hiring now,
 * real counts from the listings, fields, the student's path and the latest
 * jobs. Any search, filter or click opens the results view: list on the
 * left, the chosen job on the right (one pane with a back button on phones).
 *
 * What sets it apart: each listing carries a Trust Shield check (scam warning
 * signs), "on your path" when its role is one the student's report points to
 * (with that role's roadmap one click away), and a saved / applied tracker.
 * Every number shown is counted from the live listings; listings come from
 * third-party sources and are applied for on the original listing; nothing
 * here states a salary, deadline or requirement the source didn't.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { HowItWorks } from "@/components/HowItWorks";
import { CATEGORY_SHORT, JOB_CATEGORIES } from "@/lib/jobs/clusters";
import { isOnPath, loadTracker, pathCareers, saveTracked, TRACK_STATUSES } from "@/lib/jobs/student";
import type { EmploymentType, JobDetail, JobListItem, JobSearchResult, JobStats, TrackStatus, TrackedJob, WorkplaceType } from "@/lib/jobs/types";
import { loadRoadmapCatalog } from "@/lib/report/roleRoadmapGrad";

const TYPES: EmploymentType[] = ["Internship", "Full-time", "Part-time", "Contract"];
const PLACES: WorkplaceType[] = ["Remote", "Hybrid", "On-site"];
const REPORT_REASONS = [
  { id: "scam", label: "Looks like a scam" },
  { id: "expired", label: "Job has closed" },
  { id: "wrong_info", label: "Wrong details" },
  { id: "duplicate", label: "Duplicate" },
  { id: "other", label: "Something else" },
];

interface Filters { q: string; location: string; type: string; workplace: string; category: string; fresher: boolean; path: boolean; all: boolean; sort: "" | "new"; page: number }
const EMPTY: Filters = { q: "", location: "", type: "", workplace: "", category: "", fresher: false, path: false, all: false, sort: "", page: 1 };
type SearchValue = { q: string; location: string; type: string };
type NavId = "home" | "intern" | "remote" | "fresher" | "path" | "mine" | "";

const hasFilter = (f: Filters) => Boolean(f.q || f.location || f.type || f.workplace || f.category || f.fresher || f.path);
const isBrowsing = (f: Filters) => f.all || hasFilter(f) || f.page > 1;

function readUrl(): Filters {
  if (typeof window === "undefined") return EMPTY;
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "", location: p.get("location") ?? "", type: p.get("type") ?? "", workplace: p.get("workplace") ?? "",
    category: p.get("category") ?? "", fresher: p.get("fresher") === "1", path: p.get("path") === "1", all: p.get("all") === "1",
    sort: p.get("sort") === "new" ? "new" : "",
    page: Math.max(1, Number(p.get("page")) || 1),
  };
}

function ago(iso: string | null): string {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

function updatedAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins} minutes ago`;
  const h = Math.round(mins / 60);
  return h < 24 ? `${h} ${h === 1 ? "hour" : "hours"} ago` : ago(iso);
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const initials = (s: string) => s.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
const hostOf = (url: string) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };
const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;

// ---------------------------------------------------------------- icons (this page only)
const ICONS: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  briefcase: <><rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" /><path d="M3 12.5h18" /></>,
  building: <><path d="M4.5 21V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V21" /><path d="M14.5 9.5h4a1 1 0 0 1 1 1V21" /><path d="M3 21h18" /><path d="M8 7.5h3M8 11h3M8 14.5h3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  sprout: <><path d="M12 21v-8" /><path d="M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z" /><path d="M12 15.5c0-3.2-2.4-5.2-5.6-5.2 0 3.2 2.4 5.2 5.6 5.2z" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  star: <polygon points="12 3.5 14.7 9 20.5 9.8 16.2 14 17.3 20 12 17.1 6.7 20 7.8 14 3.5 9.8 9.3 9" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2.5 19h19" /></>,
  flask: <><path d="M9 3.5h6" /><path d="M10 3.5v6L4.8 18.3a1.6 1.6 0 0 0 1.4 2.2h11.6a1.6 1.6 0 0 0 1.4-2.2L14 9.5v-6" /><path d="M7.2 14.5h9.6" /></>,
  heart: <path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 5.5 5 5 0 0 1 21.3 11c-2.3 4.4-9.3 9-9.3 9z" />,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6" /><path d="M18.2 14.3a6.5 6.5 0 0 1 3.3 5.7" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.6M16 6h2.5a2.5 2.5 0 0 1-2.6 3.6" /><path d="M12 13v3.5M8.5 20h7M9.5 16.5h5V20h-5z" /></>,
  leaf: <><path d="M5 19c0-8 5.5-14 15-14 0 9.5-6 15-14 15z" /><path d="M5 19c2.5-4 6-7 10-9" /></>,
  bolt: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" />,
  house: <><path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5.5h4V20" /></>,
  chart: <><path d="M4 20h16" /><path d="M7 16v-5M12 16V6M17 16v-8" /></>,
  scale: <><path d="M12 3.5v17" /><path d="M7 20.5h10" /><path d="M4 7.5h16" /><path d="M6.5 7.5 3.5 14a3 3 0 0 0 6 0z" /><path d="M17.5 7.5 14.5 14a3 3 0 0 0 6 0z" /></>,
  landmark: <><path d="M3 10 12 4l9 6" /><path d="M4 10h16" /><path d="M6 10v9M10 10v9M14 10v9M18 10v9" /><path d="M3.5 20.5h17" /></>,
  cap: <><path d="M2.5 8.5 12 4.5l9.5 4-9.5 4z" /><path d="M6.5 10.3V15c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.7" /><path d="M21.5 8.5v5" /></>,
  megaphone: <><path d="M4 10.5v3a1 1 0 0 0 1 1h2l7 4.5v-14L7 9.5H5a1 1 0 0 0-1 1z" /><path d="M17.5 9a4 4 0 0 1 0 6" /></>,
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.3M12 18.7V21M3 12h2.3M18.7 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" /></>,
  truck: <><path d="M3 6.5h11v9H3z" /><path d="M14 9.5h3.5l3 3v3H14" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  plane: <path d="M21 15.5v-1.8l-7.5-4.6V4.5a1.5 1.5 0 0 0-3 0v4.6L3 13.7v1.8l7.5-2.3v4.4l-2 1.5V21l3.5-1 3.5 1v-1.9l-2-1.5v-4.4z" />,
};
// One per career cluster, in JOB_CATEGORIES order.
const CAT_ICON = ["laptop", "flask", "heart", "users", "trophy", "leaf", "bolt", "house", "chart", "scale", "landmark", "cap", "megaphone", "gear", "truck", "plane", "shield"];

function Ic({ n, s = 18 }: { n: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[n] ?? ICONS.briefcase}
    </svg>
  );
}

const TINTS: [string, string][] = [["#eef2ff", "#3b5bdb"], ["#ecfdf5", "#047857"], ["#fff7ed", "#c2410c"], ["#fdf2f8", "#be185d"], ["#f0f9ff", "#0369a1"], ["#f5f3ff", "#6d28d9"]];

/** The company's logo when the source gives one, else its initials on a soft tint. */
function CoLogo({ name, src, size = 44 }: { name: string; src: string | null; size?: number }) {
  const [failed, setFailed] = useState(false);
  const h = [...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const [bg, fg] = TINTS[h % TINTS.length];
  const img = src && !failed;
  return (
    <span className="jb-logo-box" style={{ width: size, height: size, background: img ? "#fff" : bg, color: fg, fontSize: Math.round(size * 0.34) }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img ? <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} /> : initials(name)}
    </span>
  );
}

// ---------------------------------------------------------------- the board
export function JobBoard({ variant }: { variant: "public" | "account" }) {
  const { user, profile, loading: authLoading } = useAuth();
  // Keyed by the names, so a new profile object with the same careers doesn't refetch.
  const careersKey = pathCareers(profile).join("\u0001");
  const careers = useMemo(() => (careersKey ? careersKey.split("\u0001") : []), [careersKey]);
  const [tab, setTab] = useState<"find" | "mine">("find");
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [result, setResult] = useState<JobSearchResult | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error" | "unavailable">("loading");
  const [stats, setStats] = useState<JobStats | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<JobDetail | null>(null);
  const [detailState, setDetailState] = useState<"idle" | "loading" | "error" | "gone">("idle");
  const [mobileDetail, setMobileDetail] = useState(false);
  const [tracker, setTracker] = useState<Record<string, TrackedJob>>({});
  const [toast, setToast] = useState("");
  const [urlRead, setUrlRead] = useState(false);
  const [pathRoles, setPathRoles] = useState<string[]>([]);
  const [rolesReady, setRolesReady] = useState(false);
  const [pathJobs, setPathJobs] = useState<JobSearchResult | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const requestNo = useRef(0);
  const browsing = isBrowsing(filters);

  // Filters come from the address bar (shareable searches), and back/forward
  // moves between the home and results views.
  useEffect(() => {
    setFilters(readUrl());
    setUrlRead(true);
    const onPop = () => { setFilters(readUrl()); setMobileDetail(false); setTab("find"); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    fetch("/api/jobs/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: JobStats | null) => setStats(d && typeof d.total === "number" ? d : null))
      .catch(() => setStats(null));
  }, []);

  // The job role names the student's careers correspond to (as jobs are
  // labelled), so "On my path" works however the report words a career.
  useEffect(() => {
    if (!careers.length) { setPathRoles([]); setRolesReady(true); return; }
    setRolesReady(false);
    const p = new URLSearchParams();
    careers.forEach((c) => p.append("career", c));
    let live = true;
    fetch(`/api/jobs/roles?${p}`)
      .then((r) => (r.ok ? r.json() : { roles: [] }))
      .then((d: { roles?: string[] }) => { if (live) setPathRoles(Array.isArray(d.roles) ? d.roles : []); })
      .catch(() => undefined)
      .finally(() => { if (live) setRolesReady(true); });
    return () => { live = false; };
  }, [careers]);
  const pathNames = useMemo(() => [...new Set([...pathRoles, ...careers])].slice(0, 20), [pathRoles, careers]);
  const pathRef = useRef<string[]>([]);
  pathRef.current = pathNames;
  const pathNamesKey = rolesReady ? pathNames.join("|") : "";

  // The home view's "Jobs on your path".
  useEffect(() => {
    if (!pathNamesKey) { setPathJobs(null); return; }
    const p = new URLSearchParams();
    pathNamesKey.split("|").forEach((r) => p.append("role", r));
    let live = true;
    const none: JobSearchResult = { jobs: [], total: 0, page: 1, pageSize: 20 };
    fetch(`/api/jobs?${p}`)
      .then((r) => (r.ok ? r.json() : none))
      .then((d: JobSearchResult) => { if (live) setPathJobs(d); })
      .catch(() => { if (live) setPathJobs(none); });
    return () => { live = false; };
  }, [pathNamesKey]);

  useEffect(() => {
    if (!user) { setTracker({}); return; }
    loadTracker(user.uid).then(setTracker).catch(() => setTracker({}));
  }, [user]);

  const flash = (t: string) => { setToast(t); window.setTimeout(() => setToast(""), 2200); };

  const load = useCallback(async (f: Filters) => {
    const no = ++requestNo.current;
    setState("loading");
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.location) p.set("location", f.location);
    if (f.type) p.set("type", f.type);
    if (f.workplace) p.set("workplace", f.workplace);
    if (f.category) p.set("category", f.category);
    if (f.fresher) p.set("fresher", "1");
    if (f.sort) p.set("sort", f.sort);
    if (f.page > 1) p.set("page", String(f.page));
    const shown = new URLSearchParams(p);
    if (f.path) {
      shown.set("path", "1");
      pathRef.current.forEach((c) => p.append("role", c));
    }
    if (f.all && !hasFilter(f)) shown.set("all", "1");
    const url = `${window.location.pathname}${shown.toString() ? `?${shown}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      // Home -> results is a new page for the back button; refining a search is not.
      if (!isBrowsing(readUrl()) && isBrowsing(f)) window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    }
    try {
      const res = await fetch(`/api/jobs?${p}`);
      if (no !== requestNo.current) return; // a newer search has started
      if (res.status === 503) { setState("unavailable"); setResult(null); return; }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as JobSearchResult;
      if (no !== requestNo.current) return;
      setResult(data);
      setState("idle");
      setSelected((cur) => (cur && data.jobs.some((j) => j.id === cur) ? cur : data.jobs[0]?.id ?? null));
      listRef.current?.scrollTo({ top: 0 });
    } catch {
      if (no === requestNo.current) setState("error");
    }
  }, []);

  // Re-run when the filters change - and, while filtering by path, when the
  // path's role names arrive.
  const pathKey = filters.path ? pathNames.join("|") : "";
  useEffect(() => {
    if (!urlRead || authLoading) return;
    // "?path=1" shared to someone with no report: show everything instead.
    if (filters.path && !pathKey) { setFilters((f) => ({ ...f, path: false, all: true })); return; }
    load(filters);
  }, [filters, load, authLoading, urlRead, pathKey]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [browsing, tab]);

  useEffect(() => {
    if (!browsing || !selected) { setDetail(null); return; }
    let live = true;
    setDetailState("loading");
    fetch(`/api/jobs/${selected}`)
      .then(async (r) => {
        if (!live) return;
        if (r.status === 404) { setDetail(null); setDetailState("gone"); return; }
        if (!r.ok) throw new Error();
        setDetail((await r.json()) as JobDetail);
        setDetailState("idle");
      })
      .catch(() => { if (live) setDetailState("error"); });
    return () => { live = false; };
  }, [selected, browsing]);

  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));
  const go = (patch: Partial<Filters>) => { setTab("find"); setMobileDetail(false); setFilters({ ...EMPTY, ...patch }); };
  const openJob = (id: string, patch: Partial<Filters> = {}) => {
    setTab("find");
    setSelected(id);
    setMobileDetail(true);
    setFilters((f) => (isBrowsing(f) && !Object.keys(patch).length ? f : { ...EMPTY, all: true, ...patch }));
  };
  const nav = (id: NavId) => {
    if (id === "home") go({});
    else if (id === "intern") go({ type: "Internship" });
    else if (id === "remote") go({ workplace: "Remote" });
    else if (id === "fresher") go({ fresher: true });
    else if (id === "path") go({ path: true });
  };
  const active: NavId = tab === "mine" ? "mine"
    : !browsing ? "home"
    : filters.path ? "path"
    : filters.type === "Internship" && !filters.q && !filters.category ? "intern"
    : filters.workplace === "Remote" && !filters.q && !filters.category ? "remote"
    : filters.fresher && !filters.q && !filters.category ? "fresher" : "";

  const track = async (job: Pick<JobListItem, "id" | "title" | "company" | "apply_url">, status: TrackStatus | null) => {
    if (!user) return;
    const prev = tracker[job.id];
    const entry: TrackedJob | null = status ? { status, title: job.title, company: job.company, applyUrl: job.apply_url, savedAt: prev?.savedAt ?? Date.now(), updatedAt: Date.now() } : null;
    setTracker((t) => { const n = { ...t }; if (entry) n[job.id] = entry; else delete n[job.id]; return n; });
    try {
      await saveTracked(user.uid, job.id, entry);
      flash(entry ? (status === "saved" ? "Saved to My jobs" : `Marked as ${status}`) : "Removed from My jobs");
    } catch {
      setTracker((t) => { const n = { ...t }; if (prev) n[job.id] = prev; else delete n[job.id]; return n; });
      flash("Couldn't save - please try again");
    }
  };

  const pages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  const tracked = Object.entries(tracker);
  const resultsTitle = filters.path ? "Jobs on your path"
    : filters.category ? (CATEGORY_SHORT[filters.category] ?? filters.category)
    : filters.q ? `“${filters.q}”`
    : active === "intern" ? "Internships" : active === "remote" ? "Remote jobs" : active === "fresher" ? "Fresher-friendly jobs" : "All jobs";

  return (
    <div className="jb">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <TopBar
        home={variant === "account" ? "/account" : "/"}
        signedIn={Boolean(user)}
        trackedCount={tracked.length}
        active={active}
        showPath={careers.length > 0}
        onNav={nav}
        onMine={() => { setTab("mine"); setMobileDetail(false); }}
      />

      {tab === "mine" && user ? (
        <div className="jb-results">
          <div className="jb-wrap jb-mine-h">
            <h1>My jobs</h1>
            <p>Jobs you saved, and where each application stands. Move a job along as you hear back.</p>
          </div>
          <MyJobs tracked={tracked} onMove={(id, t, s) => track({ id, title: t.title, company: t.company, apply_url: t.applyUrl }, s)} onBrowse={() => go({ all: true })} />
        </div>
      ) : !browsing ? (
        <HomeView
          stats={stats}
          latest={result?.jobs ?? []}
          latestState={state}
          pathJobs={pathJobs}
          pathNames={pathNames}
          hasCareers={careers.length > 0}
          signedIn={Boolean(user)}
          tracker={tracker}
          onSearch={(v) => go({ ...v, all: true })}
          onOpen={openJob}
          onCategory={(category) => go({ category })}
          onCompany={(q) => go({ q })}
          onBrowseAll={() => go({ all: true })}
          onPath={() => go({ path: true })}
          onRetry={() => load(filters)}
        />
      ) : (
        <div className="jb-results">
          <section className="jb-sbar">
            <div className="jb-wrap">
              <nav className="jb-crumbs" aria-label="Breadcrumb">
                <button onClick={() => go({})}>Jobs</button><span aria-hidden="true">›</span><b>{resultsTitle}</b>
              </nav>
              <SearchBar value={{ q: filters.q, location: filters.location, type: filters.type }} locations={stats?.locations ?? []} onSearch={(v) => set(v)} />
            </div>
          </section>

          <div className="jb-filters jb-wrap" aria-label="Filters">
            {careers.length > 0 && (
              <button className="jb-chip jb-chip-path" aria-pressed={filters.path} onClick={() => set({ path: !filters.path })} title={`Roles your report points to: ${careers.slice(0, 5).join(", ")}`}>
                ★ On my path
              </button>
            )}
            <button className="jb-chip" aria-pressed={filters.fresher} onClick={() => set({ fresher: !filters.fresher })}>Fresher-friendly</button>
            {TYPES.map((t) => (
              <button key={t} className="jb-chip" aria-pressed={filters.type === t} onClick={() => set({ type: filters.type === t ? "" : t })}>{t}</button>
            ))}
            <span className="jb-sep" aria-hidden="true" />
            {PLACES.map((w) => (
              <button key={w} className="jb-chip" aria-pressed={filters.workplace === w} onClick={() => set({ workplace: filters.workplace === w ? "" : w })}>{w}</button>
            ))}
            <label className="jb-select">
              <span className="jb-sr">Field</span>
              <select value={filters.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="">All fields</option>
                {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_SHORT[c] ?? c}</option>)}
              </select>
            </label>
            <label className="jb-select jb-sort">
              <span className="jb-sr">Order</span>
              <select value={filters.sort} onChange={(e) => set({ sort: e.target.value === "new" ? "new" : "" })}>
                <option value="">Students first</option>
                <option value="new">Newest first</option>
              </select>
            </label>
            {hasFilter(filters) && <button className="jb-clear" onClick={() => go({ all: true })}>Clear all</button>}
          </div>

          <div className={`jb-main jb-wrap${mobileDetail ? " show-detail" : ""}`}>
            <div className="jb-list" ref={listRef} aria-busy={state === "loading"}>
              <div className="jb-count">
                {state === "idle" && result ? `${plural(result.total, "job")}${filters.path ? " on your path" : ""}` : state === "loading" ? "Loading jobs…" : ""}
              </div>
              {state === "loading" && Array.from({ length: 6 }).map((_, i) => <div key={i} className="jb-card jb-skel" aria-hidden="true"><i /><i /><i /></div>)}
              {state === "unavailable" && (
                <div className="jb-empty"><b>The job portal is being set up.</b><span>Listings will appear here after the first daily update.</span></div>
              )}
              {state === "error" && (
                <div className="jb-empty"><b>Couldn&apos;t load jobs.</b><span>Check your connection and try again.</span><button className="jb-btn" onClick={() => load(filters)}>Try again</button></div>
              )}
              {state === "idle" && result && result.jobs.length === 0 && (
                <div className="jb-empty">
                  <b>{hasFilter(filters) ? "No jobs match these filters." : "No jobs yet."}</b>
                  <span>{hasFilter(filters) ? "Try a broader search, or remove a filter." : "New listings arrive with the daily update."}</span>
                  {hasFilter(filters) && <button className="jb-btn" onClick={() => go({ all: true })}>Clear all filters</button>}
                </div>
              )}
              {state === "idle" && result?.jobs.map((j) => {
                const onPath = isOnPath(j, pathNames);
                const t = tracker[j.id];
                return (
                  <button key={j.id} className={`jb-card${selected === j.id ? " is-active" : ""}`} onClick={() => { setSelected(j.id); setMobileDetail(true); }} aria-current={selected === j.id ? "true" : undefined}>
                    <CoLogo name={j.company} src={j.company_logo} />
                    <span className="jb-card-b">
                      <span className="jb-title">{j.title}</span>
                      <span className="jb-co">{j.company}{j.location ? ` · ${j.location}` : ""}</span>
                      <span className="jb-tags">
                        {onPath && <em className="jb-tag jb-tag-path">★ On your path</em>}
                        {j.trust_level === "caution" && <em className="jb-tag jb-tag-warn">Check first</em>}
                        {j.trust_level === "verified" && <em className="jb-tag jb-tag-ok">Verified source</em>}
                        {j.workplace_type !== "Unknown" && <em className="jb-tag">{j.workplace_type}</em>}
                        {j.employment_type !== "Unknown" && <em className="jb-tag">{j.employment_type}</em>}
                        {(j.is_fresher || j.experience_hint === "entry") && <em className="jb-tag">Fresher-friendly</em>}
                      </span>
                      <span className="jb-meta">{j.posted_at ? `Posted ${ago(j.posted_at)}` : `Seen ${ago(j.last_seen_at)}`}{j.attribution ? ` · ${j.attribution}` : ""}{t ? ` · ${TRACK_STATUSES.find((s) => s.id === t.status)?.label}` : ""}</span>
                    </span>
                  </button>
                );
              })}
              {state === "idle" && result && pages > 1 && (
                <nav className="jb-pages" aria-label="Pages">
                  <button className="jb-btn" disabled={filters.page <= 1} onClick={() => set({ page: filters.page - 1 })}>← Previous</button>
                  <span>Page {filters.page} of {pages}</span>
                  <button className="jb-btn" disabled={filters.page >= pages} onClick={() => set({ page: filters.page + 1 })}>Next →</button>
                </nav>
              )}
              <p className="jb-disclaimer">Listings come from third-party sources and are applied for on the original listing. OneGrasp checks for warning signs but cannot verify every employer. Never pay a fee to get a job.</p>
            </div>

            <div className="jb-detail" aria-live="polite">
              <button className="jb-back" onClick={() => setMobileDetail(false)}>← Back to results</button>
              {!selected && state === "idle" && <div className="jb-empty"><b>Select a job</b><span>Its details, Trust Shield check and path appear here.</span></div>}
              {selected && detailState === "loading" && <div className="jb-empty"><span>Loading job…</span></div>}
              {selected && detailState === "error" && <div className="jb-empty"><b>Couldn&apos;t load this job.</b><button className="jb-btn" onClick={() => setSelected(selected)}>Try again</button></div>}
              {selected && detailState === "gone" && <div className="jb-empty"><b>This listing has closed.</b><span>It is no longer active at the source.</span></div>}
              {detail && detailState === "idle" && (
                <JobPanel job={detail} onPath={isOnPath(detail, pathNames)} tracked={tracker[detail.id]} signedIn={Boolean(user)} onTrack={(s) => track(detail, s)} onReported={() => flash("Thanks - we'll review this listing")} />
              )}
            </div>
          </div>
        </div>
      )}
      {toast && <div className="jb-toast" role="status">{toast}</div>}
    </div>
  );
}

// ---------------------------------------------------------------- header
function TopBar({ home, signedIn, trackedCount, active, showPath, onNav, onMine }: {
  home: string; signedIn: boolean; trackedCount: number; active: NavId; showPath: boolean;
  onNav: (id: NavId) => void; onMine: () => void;
}) {
  const items: { id: NavId; label: string }[] = [
    { id: "home", label: "Jobs" },
    { id: "intern", label: "Internships" },
    { id: "remote", label: "Remote jobs" },
    { id: "fresher", label: "Fresher jobs" },
    ...(showPath ? [{ id: "path" as NavId, label: "★ On my path" }] : []),
  ];
  return (
    <header className="jb-bar">
      <div className="jb-bar-in">
        <Link href={home} className="jb-brand" aria-label="OneGrasp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
          <span>Jobs</span>
        </Link>
        <nav className="jb-nav" aria-label="Jobs">
          {items.map((i) => (
            <button key={i.id} className={active === i.id ? "is-on" : ""} aria-current={active === i.id ? "page" : undefined} onClick={() => onNav(i.id)}>{i.label}</button>
          ))}
        </nav>
        <div className="jb-bar-r">
          {signedIn ? (
            <>
              <button className={`jb-btn${active === "mine" ? " is-on" : ""}`} onClick={onMine}>My jobs{trackedCount ? <em>{trackedCount}</em> : null}</button>
              <Link href="/account" className="jb-btn jb-btn-ink">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/signin" className="jb-btn">Sign in</Link>
              <Link href="/register" className="jb-btn jb-btn-ink">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchBar({ big, value, locations, onSearch }: { big?: boolean; value: SearchValue; locations: string[]; onSearch: (v: SearchValue) => void }) {
  const [d, setD] = useState<SearchValue>(value);
  useEffect(() => { setD({ q: value.q, location: value.location, type: value.type }); }, [value.q, value.location, value.type]);
  const submit = (e: FormEvent) => { e.preventDefault(); onSearch({ q: d.q.trim(), location: d.location.trim(), type: d.type }); };
  const suggestions = ["Remote", ...locations.filter((l) => !/^remote$/i.test(l))];
  return (
    <form className={`jb-search${big ? " is-big" : ""}`} onSubmit={submit} role="search">
      <label className="jb-sf jb-sf-q">
        <Ic n="search" />
        <span className="jb-sr">Job title, skills or company</span>
        <input value={d.q} onChange={(e) => setD({ ...d, q: e.target.value })} placeholder="Job title, skills or company" maxLength={100} />
      </label>
      <label className="jb-sf">
        <Ic n="pin" />
        <span className="jb-sr">Location</span>
        <input value={d.location} onChange={(e) => setD({ ...d, location: e.target.value })} placeholder="Location" list="jb-locs" maxLength={60} />
        <datalist id="jb-locs">{suggestions.map((l) => <option key={l} value={l} />)}</datalist>
      </label>
      <label className="jb-sf">
        <Ic n="briefcase" />
        <span className="jb-sr">Job type</span>
        <select value={d.type} onChange={(e) => setD({ ...d, type: e.target.value })}>
          <option value="">Any job type</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <button className="jb-btn jb-btn-primary jb-go" type="submit">Search jobs</button>
    </form>
  );
}

// ---------------------------------------------------------------- home view
function HomeView({ stats, latest, latestState, pathJobs, pathNames, hasCareers, signedIn, tracker, onSearch, onOpen, onCategory, onCompany, onBrowseAll, onPath, onRetry }: {
  stats: JobStats | null; latest: JobListItem[]; latestState: "idle" | "loading" | "error" | "unavailable";
  pathJobs: JobSearchResult | null; pathNames: string[]; hasCareers: boolean; signedIn: boolean; tracker: Record<string, TrackedJob>;
  onSearch: (v: SearchValue) => void; onOpen: (id: string, patch?: Partial<Filters>) => void; onCategory: (c: string) => void;
  onCompany: (name: string) => void; onBrowseAll: () => void; onPath: () => void; onRetry: () => void;
}) {
  const [allFields, setAllFields] = useState(false);
  const cats = useMemo(
    () => JOB_CATEGORIES.map((name, i) => ({ name, icon: CAT_ICON[i], count: stats?.categories[name] ?? 0 })).sort((a, b) => b.count - a.count),
    [stats],
  );
  const live = Boolean(stats && stats.total > 0);
  const empty = useMemo<SearchValue>(() => ({ q: "", location: "", type: "" }), []);

  return (
    <>
      <section className="jb-hero">
        <div className="jb-hero-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jobs/hero.webp" srcSet="/jobs/hero-800.webp 800w, /jobs/hero.webp 1600w" sizes="(max-width: 980px) 100vw, 58vw" alt="" />
          <div className="jb-hero-badge">
            <span><Ic n="shield" s={19} /></span>
            <div><b>Trust Shield</b><small>Every listing checked for scam signs</small></div>
          </div>
        </div>
        <div className="jb-wrap jb-hero-in">
          <p className="jb-eyebrow">Internships and jobs, checked for you</p>
          <h1>Find the right job <span>for your future</span></h1>
          <p className="jb-lead">Fresh listings every day from job sources that allow us to show them. Each one is checked for scam warning signs, and you apply on the original listing.</p>
          <SearchBar big value={empty} locations={stats?.locations ?? []} onSearch={onSearch} />
          <div className="jb-hero-meta">
            {stats?.lastUpdated && <span className="jb-live"><i aria-hidden="true" />Updated {updatedAgo(stats.lastUpdated)}</span>}
            {stats && stats.popularRoles.length > 0 && (
              <span className="jb-popular">
                Popular:
                {stats.popularRoles.slice(0, 4).map((r) => <button key={r} onClick={() => onSearch({ q: r, location: "", type: "" })}>{r}</button>)}
              </span>
            )}
          </div>
        </div>
      </section>

      {live && stats!.topCompanies.length > 0 && (
        <section className="jb-cos">
          <div className="jb-wrap jb-cos-in">
            <b className="jb-cos-h">Companies hiring now</b>
            <div className="jb-cos-list">
              {stats!.topCompanies.map((c) => (
                <button key={c.name} onClick={() => onCompany(c.name)} title={`${plural(c.count, "open job")} - see them`}>
                  <CoLogo name={c.name} src={c.logo} size={28} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
            <button className="jb-more" onClick={onBrowseAll}>View all jobs <Ic n="arrow" s={15} /></button>
          </div>
        </section>
      )}

      {live && (
        <section className="jb-stats" aria-label="Live job counts">
          <div className="jb-wrap jb-stats-in">
            {[
              { n: stats!.total, l: "Live jobs", i: "briefcase" },
              { n: stats!.companies, l: "Companies hiring", i: "building" },
              { n: stats!.postedThisWeek, l: "Posted this week", i: "clock" },
              { n: stats!.fresher, l: "Fresher-friendly", i: "sprout" },
            ].map((s) => (
              <div key={s.l} className="jb-stat">
                <Ic n={s.i} s={28} />
                <div><b>{s.n.toLocaleString("en-IN")}</b><span>{s.l}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="jb-sec jb-wrap">
        {hasCareers ? (
          <div className="jb-pathbox">
            <div className="jb-sec-h">
              <div>
                <h2><Ic n="star" s={20} /> Jobs on your path</h2>
                <p>For the careers your OneGrasp report points to: {pathNames.slice(0, 3).join(" · ")}</p>
              </div>
              {pathJobs && pathJobs.total > 0 && <button className="jb-more" onClick={onPath}>See all {pathJobs.total.toLocaleString("en-IN")} <Ic n="arrow" s={15} /></button>}
            </div>
            {pathJobs === null ? <p className="jb-muted">Looking for jobs on your path…</p>
              : pathJobs.jobs.length ? (
                <div className="jb-rows">
                  {pathJobs.jobs.slice(0, 4).map((j) => <JobRow key={j.id} job={j} onPath tracked={tracker[j.id]} onOpen={() => onOpen(j.id, { path: true })} />)}
                </div>
              ) : <p className="jb-muted">No open jobs for these careers right now - new listings arrive every day. Meanwhile, browse the fields below.</p>}
          </div>
        ) : (
          <div className="jb-cta">
            <span className="jb-cta-ic"><Ic n="star" s={22} /></span>
            <div>
              <b>See the jobs that fit you</b>
              <span>{signedIn
                ? "Take the OneGrasp career assessment, and jobs for your best-fit careers show up here - with the roadmap to get there."
                : "Sign in and take the OneGrasp career assessment, and jobs for your best-fit careers show up here - with the roadmap to get there."}</span>
            </div>
            <Link className="jb-btn jb-btn-ink" href={signedIn ? "/account" : "/signin"}>{signedIn ? "Take the assessment" : "Sign in"}</Link>
          </div>
        )}
      </section>

      <section className="jb-sec jb-wrap">
        <div className="jb-sec-h">
          <h2>Browse jobs by field</h2>
          <button className="jb-more" onClick={() => setAllFields((v) => !v)}>{allFields ? "Show fewer" : "View all fields"} <Ic n="arrow" s={15} /></button>
        </div>
        <div className="jb-cats">
          {(allFields ? cats : cats.slice(0, 10)).map((c) => (
            <button key={c.name} className="jb-cat" onClick={() => onCategory(c.name)} title={c.name}>
              <Ic n={c.icon} s={26} />
              <b>{CATEGORY_SHORT[c.name] ?? c.name}</b>
              <span>{stats ? (c.count ? plural(c.count, "job") : "No jobs yet") : " "}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="jb-sec jb-wrap">
        <div className="jb-sec-h">
          <div>
            <h2>Latest job opportunities</h2>
            <p>Internships and fresher-friendly jobs first</p>
          </div>
          {latest.length > 0 && <button className="jb-more" onClick={onBrowseAll}>View all jobs <Ic n="arrow" s={15} /></button>}
        </div>
        {latestState === "loading" && <div className="jb-rows">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="jb-row jb-skel" aria-hidden="true"><i /><i /><i /></div>)}</div>}
        {latestState === "unavailable" && <div className="jb-empty"><b>The job portal is being set up.</b><span>Listings appear here after the first daily update.</span></div>}
        {latestState === "error" && <div className="jb-empty"><b>Couldn&apos;t load jobs.</b><span>Check your connection and try again.</span><button className="jb-btn" onClick={onRetry}>Try again</button></div>}
        {latestState === "idle" && (latest.length ? (
          <div className="jb-rows">
            {latest.slice(0, 8).map((j) => <JobRow key={j.id} job={j} onPath={isOnPath(j, pathNames)} tracked={tracker[j.id]} onOpen={() => onOpen(j.id)} />)}
          </div>
        ) : <div className="jb-empty"><b>No jobs yet.</b><span>New listings arrive with the daily update.</span></div>)}
      </section>

      <section className="jb-sec jb-wrap jb-foot">
        <div className="jb-why">
          {[
            { i: "shield", t: "Trust Shield on every listing", d: "We check each job for fees, chat-app-only contact, personal email addresses and other scam signs - and tell you what to check before applying." },
            { i: "star", t: "Jobs on your career path", d: "Matched to the careers in your OneGrasp report, with the roadmap for each career one click away." },
            { i: "external", t: "Apply at the source", d: "You apply on the original listing. OneGrasp never charges you or asks for your documents to apply." },
          ].map((w) => (
            <div key={w.t}>
              <span className="jb-why-ic"><Ic n={w.i} s={20} /></span>
              <b>{w.t}</b>
              <p>{w.d}</p>
            </div>
          ))}
        </div>
        <div className="jb-how">
          <HowItWorks id="jobs" accent="#3b5bdb" steps={[
            "Listings are imported once a day from job sources that allow us to show them. Closed listings drop off automatically.",
            "Every listing gets a Trust Shield check for scam warning signs - fees, chat-app-only contact, personal email, \"guaranteed job\" promises.",
            "★ On my path shows jobs for the careers your report points to, with that career's roadmap one click away.",
            "You apply on the original listing. Signed in, save jobs and track them: saved → applied → interview → offer.",
          ]} sync="Your saved and tracked jobs are stored on your account only." />
        </div>
        <p className="jb-disclaimer">Every number on this page is counted from the listings live right now. Listings come from third-party sources; OneGrasp checks for warning signs but cannot verify every employer. Never pay a fee to get a job.</p>
      </section>
    </>
  );
}

function JobRow({ job, onPath, tracked, onOpen }: { job: JobListItem; onPath: boolean; tracked?: TrackedJob; onOpen: () => void }) {
  return (
    <button className="jb-row" onClick={onOpen}>
      <CoLogo name={job.company} src={job.company_logo} size={40} />
      <span className="jb-row-t"><b>{job.title}</b><span>{job.company}</span></span>
      <span className="jb-row-loc"><Ic n="pin" s={15} /><span>{job.location || "Location not stated"}</span></span>
      <span className="jb-row-tags">
        {onPath && <em className="jb-tag jb-tag-path">★ On your path</em>}
        {job.trust_level === "caution" && <em className="jb-tag jb-tag-warn">Check first</em>}
        {job.employment_type !== "Unknown" && <em className="jb-tag jb-tag-type">{job.employment_type}</em>}
        {job.workplace_type === "Remote" && job.employment_type === "Unknown" && <em className="jb-tag">Remote</em>}
      </span>
      <span className="jb-row-when">{job.posted_at ? cap(ago(job.posted_at)) : ""}</span>
      <span className="jb-row-go">{tracked ? TRACK_STATUSES.find((s) => s.id === tracked.status)?.label : "View & apply"}</span>
    </button>
  );
}

// ---------------------------------------------------------------- job detail
function JobPanel({ job, onPath, tracked, signedIn, onTrack, onReported }: {
  job: JobDetail; onPath: boolean; tracked?: TrackedJob; signedIn: boolean;
  onTrack: (s: TrackStatus | null) => void; onReported: () => void;
}) {
  const [roadmapHref, setRoadmapHref] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    setRoadmapHref(null);
    setReporting(false);
    if (!job.role_match) return;
    let live = true;
    loadRoadmapCatalog().then((c) => {
      const role = c?.roles.find((r) => r.role.toLowerCase() === job.role_match!.toLowerCase());
      const v = role?.versions.find((x) => x.level === "ug") ?? role?.versions[0];
      if (live && v) setRoadmapHref(`/account/career-library/roadmaps/${v.slug}`);
    });
    return () => { live = false; };
  }, [job.id, job.role_match]);

  const host = hostOf(job.apply_url);
  return (
    <article className="jb-panel">
      <div className="jb-panel-h">
        <CoLogo name={job.company} src={job.company_logo} size={56} />
        <div style={{ minWidth: 0 }}>
          <h2>{job.title}</h2>
          <div className="jb-co">{job.company}</div>
          <div className="jb-facts">
            {[job.location, job.workplace_type !== "Unknown" && job.workplace_type, job.employment_type !== "Unknown" && job.employment_type, job.posted_at && `Posted ${ago(job.posted_at)}`].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>

      <div className="jb-actions">
        <a className="jb-btn jb-btn-primary" href={job.apply_url} target="_blank" rel="noopener">Apply now <Ic n="external" s={15} /></a>
        {signedIn ? (
          <>
            <button className="jb-btn" aria-pressed={Boolean(tracked)} onClick={() => onTrack(tracked ? null : "saved")}>{tracked ? "✓ Saved" : "Save"}</button>
            <label className="jb-select">
              <span className="jb-sr">My status</span>
              <select value={tracked?.status ?? ""} onChange={(e) => onTrack((e.target.value || null) as TrackStatus | null)}>
                <option value="">Track status…</option>
                {TRACK_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </>
        ) : (
          <Link className="jb-btn" href="/signin">Sign in to save</Link>
        )}
        {host && <span className="jb-apply-note">Opens {host} in a new tab</span>}
      </div>

      <section className={`jb-box jb-trust is-${job.trust_level}`}>
        <h3><Ic n="shield" s={17} /> {job.trust_level === "caution" ? "Trust Shield: check before you apply" : job.trust_level === "verified" ? "Trust Shield: verified source, no warning signs" : "Trust Shield: no warning signs found"}</h3>
        {job.trust_flags.length ? (
          <ul>{job.trust_flags.map((f) => <li key={f}>{f}</li>)}</ul>
        ) : (
          <p>We checked this listing for fees, chat-app-only contact, personal email addresses, &quot;guaranteed job&quot; promises and short links. Still, never share your Aadhaar, bank details or OTP before an official offer.</p>
        )}
      </section>

      {job.role_match && (
        <section className={`jb-box jb-path${onPath ? " is-on" : ""}`}>
          <h3>{onPath ? `★ On your path: ${job.role_match}` : `This is a ${job.role_match} role`}</h3>
          <p>{onPath ? "Your report points to this career. See the full plan for it, or live a day in it first." : "OneGrasp has a full roadmap for this career - what to learn, internships, certifications and how it grows."}</p>
          <div className="jb-row-links">
            {roadmapHref && <Link className="jb-link" href={roadmapHref}>See the {job.role_match} roadmap →</Link>}
            <Link className="jb-link" href="/account/test-drive">Try a Career Test-Drive →</Link>
          </div>
        </section>
      )}

      {job.salary_text && (
        <section className="jb-box"><h3>Pay (as listed by the source)</h3><p>{job.salary_text}</p></section>
      )}

      <section className="jb-about">
        <h3>About the job</h3>
        {job.description ? <div className="jb-desc">{job.description}</div> : <p>The full description is on the original listing.</p>}
      </section>

      <footer className="jb-source">
        <span>{job.attribution ?? "Third-party listing"}{job.source_url ? <> · <a href={job.source_url} target="_blank" rel="noopener">view the original listing ↗</a></> : null}</span>
        <span>Last checked {ago(job.last_seen_at)}</span>
      </footer>

      {reporting ? <ReportForm jobId={job.id} onDone={() => { setReporting(false); onReported(); }} onCancel={() => setReporting(false)} /> : (
        <button className="jb-report" onClick={() => setReporting(true)}>Report this listing</button>
      )}
    </article>
  );
}

function ReportForm({ jobId, onDone, onCancel }: { jobId: string; onDone: () => void; onCancel: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!reason) return setErr("Choose a reason.");
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/jobs/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, reason, details, website: trap }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't send the report.");
      onDone();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Couldn't send the report.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="jb-box jb-report-form" onSubmit={send}>
      <h3>Report this listing</h3>
      <div className="jb-row-links">
        {REPORT_REASONS.map((r) => (
          <label key={r.id} className="jb-radio"><input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} />{r.label}</label>
        ))}
      </div>
      <label className="jb-field"><span>What did you notice? (optional)</span>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} rows={3} />
      </label>
      {/* Hidden from people; bots fill it in. */}
      <input className="jb-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />
      {err && <p className="jb-err">{err}</p>}
      <div className="jb-row-links">
        <button className="jb-btn jb-btn-primary" disabled={busy}>{busy ? "Sending…" : "Send report"}</button>
        <button type="button" className="jb-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function MyJobs({ tracked, onMove, onBrowse }: { tracked: [string, TrackedJob][]; onMove: (id: string, t: TrackedJob, s: TrackStatus | null) => void; onBrowse: () => void }) {
  if (!tracked.length) {
    return (
      <div className="jb-wrap"><div className="jb-empty jb-empty-wide">
        <b>No saved jobs yet.</b>
        <span>Save jobs while you search, then track them here: saved → applied → interview → offer.</span>
        <button className="jb-btn jb-btn-primary" onClick={onBrowse}>Browse jobs</button>
      </div></div>
    );
  }
  return (
    <div className="jb-wrap jb-kanban">
      {TRACK_STATUSES.map((col) => {
        const items = tracked.filter(([, t]) => t.status === col.id).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
        return (
          <section key={col.id} className="jb-col" aria-label={col.label}>
            <h3>{col.label} <span>{items.length}</span></h3>
            {items.map(([id, t]) => (
              <div key={id} className="jb-mini">
                <b>{t.title}</b>
                <span>{t.company}</span>
                <div className="jb-row-links">
                  <a className="jb-link" href={t.applyUrl} target="_blank" rel="noopener">Original listing ↗</a>
                  <label className="jb-select jb-select-sm">
                    <span className="jb-sr">Move to</span>
                    <select value={t.status} onChange={(e) => onMove(id, t, (e.target.value || null) as TrackStatus | null)}>
                      {TRACK_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      <option value="">Remove</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}
            {!items.length && <p className="jb-col-empty">Nothing here</p>}
          </section>
        );
      })}
    </div>
  );
}

const CSS = `
.jb{--acc:#3b5bdb;--acc-d:#2f49b8;--acc-t:#eef2ff;--acc-l:#c7d2fe;--ink:#151a24;--ink2:#4b5563;--mute:#6b7280;--line:#e7eaf0;--bg:#f7f8fb;--ok:#15803d;--ok-t:#f0fdf4;--warn:#b45309;--warn-t:#fffbeb;--path:#7c3aed;--path-t:#f5f3ff;
  min-height:100vh;background:#fff;color:var(--ink);font-family:Inter,system-ui,"Segoe UI",sans-serif}
.jb *{box-sizing:border-box}
.jb h1,.jb h2{font-family:Poppins,Inter,sans-serif;text-wrap:balance}
.jb-wrap{max-width:1240px;margin:0 auto;padding-left:24px;padding-right:24px}
.jb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* header */
.jb-bar{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.96);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid var(--line)}
.jb-bar-in{max-width:1240px;margin:0 auto;padding:0 24px;min-height:64px;display:flex;align-items:center;gap:24px}
.jb-brand{display:flex;align-items:center;gap:10px;text-decoration:none;flex:none}
.jb-brand img{height:34px;width:auto;display:block}
.jb-brand span{font-family:Poppins,Inter,sans-serif;font-weight:600;font-size:15px;color:var(--ink2);padding-left:10px;border-left:1px solid var(--line)}
.jb-nav{display:flex;gap:2px;flex:1;justify-content:center;min-width:0}
.jb-nav button{font:inherit;font-size:14px;font-weight:600;color:var(--ink2);background:none;border:0;padding:8px 12px;border-radius:8px;cursor:pointer;white-space:nowrap}
.jb-nav button:hover{color:var(--ink);background:#f3f4f6}
.jb-nav button.is-on{color:var(--acc);background:var(--acc-t)}
.jb-bar-r{display:flex;gap:10px;align-items:center;flex:none}
.jb-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;font-size:13.5px;font-weight:600;padding:9px 15px;border-radius:9px;border:1px solid #d6dae2;background:#fff;color:var(--ink);cursor:pointer;text-decoration:none;white-space:nowrap;line-height:1.2}
.jb-btn:hover{background:#f9fafb}.jb-btn:disabled{opacity:.5;cursor:not-allowed}
.jb-btn em{font-style:normal;background:var(--acc);color:#fff;border-radius:999px;font-size:11px;font-weight:700;padding:1px 7px}
.jb-btn-ink{background:var(--ink);border-color:var(--ink);color:#fff}.jb-btn-ink:hover{background:#272e3d}
.jb-btn-primary{background:var(--acc);border-color:var(--acc);color:#fff}.jb-btn-primary:hover{background:var(--acc-d)}
.jb-btn[aria-pressed="true"],.jb-btn.is-on{border-color:var(--acc);color:var(--acc);background:var(--acc-t)}

/* hero */
.jb-hero{position:relative;overflow:hidden;background:#f6f7fb;border-bottom:1px solid var(--line)}
.jb-hero-photo{position:absolute;top:0;right:0;bottom:0;width:58%}
.jb-hero-photo img{width:100%;height:100%;object-fit:cover;object-position:30% 45%;display:block}
.jb-hero-photo::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,#f6f7fb 0%,rgba(246,247,251,.9) 12%,rgba(246,247,251,0) 45%)}
.jb-hero-badge{position:absolute;right:28px;bottom:28px;z-index:2;display:flex;gap:10px;align-items:center;background:rgba(255,255,255,.97);border-radius:12px;padding:10px 14px;box-shadow:0 12px 30px rgba(21,26,36,.16)}
.jb-hero-badge>span{width:34px;height:34px;border-radius:9px;background:var(--ok-t);color:var(--ok);display:grid;place-items:center;flex:none}
.jb-hero-badge b{display:block;font-size:13.5px}.jb-hero-badge small{display:block;font-size:12px;color:var(--mute)}
.jb-hero-in{position:relative;z-index:2;padding-top:60px;padding-bottom:60px}
.jb-eyebrow{font-size:12.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2);margin:0 0 14px}
.jb-hero h1{font-size:clamp(34px,4.4vw,56px);line-height:1.08;letter-spacing:-.025em;margin:0;max-width:11.5em;font-weight:700}
.jb-hero h1 span{color:var(--acc);display:block}
.jb-lead{font-size:17px;line-height:1.6;color:var(--ink2);max-width:46ch;margin:16px 0 26px}

/* search */
.jb-search{display:flex;align-items:stretch;background:#fff;border:1px solid var(--line);border-radius:14px;padding:6px;max-width:880px}
.jb-search.is-big{box-shadow:0 16px 36px rgba(21,26,36,.10)}
.jb-search:focus-within{border-color:var(--acc-l);box-shadow:0 0 0 4px rgba(59,91,219,.12)}
.jb-sf{display:flex;align-items:center;gap:10px;padding:0 14px;min-width:0;flex:1;color:var(--mute);border-right:1px solid var(--line)}
.jb-sf-q{flex:1.5}
.jb-sf:nth-of-type(3){border-right:0}
.jb-sf svg{flex:none}
.jb-sf input,.jb-sf select{border:0;outline:0;background:transparent;font:inherit;font-size:14.5px;color:var(--ink);width:100%;min-width:0;padding:12px 0}
.jb-sf select{cursor:pointer}
.jb-go{padding:0 26px;border-radius:10px;font-size:15px}
.jb-hero-meta{display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center;margin-top:18px;font-size:13px;color:var(--ink2)}
.jb-live{display:inline-flex;align-items:center;gap:8px}
.jb-live i{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px #dcfce7}
.jb-popular{display:inline-flex;flex-wrap:wrap;gap:6px;align-items:center}
.jb-popular button{font:inherit;font-size:12.5px;font-weight:600;color:var(--ink2);background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px 11px;cursor:pointer}
.jb-popular button:hover{border-color:var(--acc);color:var(--acc)}

/* companies + counts */
.jb-cos{border-bottom:1px solid var(--line);background:#fff}
.jb-cos-in{display:flex;align-items:center;gap:22px;padding-top:14px;padding-bottom:14px}
.jb-cos-h{font-size:14px;white-space:nowrap}
.jb-cos-list{display:flex;gap:6px;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none}
.jb-cos-list::-webkit-scrollbar{display:none}
.jb-cos-list button{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);background:none;border:1px solid transparent;border-radius:10px;padding:6px 10px;cursor:pointer;white-space:nowrap}
.jb-cos-list button:hover{border-color:var(--line);background:var(--bg)}
.jb-more{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13.5px;font-weight:600;color:var(--acc);background:none;border:0;cursor:pointer;white-space:nowrap;padding:4px 0;flex:none}
.jb-more:hover{color:var(--acc-d)}
.jb-stats{background:var(--bg);border-bottom:1px solid var(--line)}
.jb-stats-in{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));padding-top:22px;padding-bottom:22px}
.jb-stat{display:flex;align-items:center;justify-content:center;gap:14px;color:var(--ink2);padding:4px 12px}
.jb-stat+.jb-stat{border-left:1px solid var(--line)}
.jb-stat b{display:block;font-family:Poppins,Inter,sans-serif;font-size:24px;line-height:1.15;color:var(--ink);font-variant-numeric:tabular-nums}
.jb-stat span{font-size:13px;color:var(--mute)}

/* sections */
.jb-sec{padding-top:36px}
.jb-sec-h{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px}
.jb-sec h2{font-size:21px;margin:0;letter-spacing:-.01em;display:flex;align-items:center;gap:8px}
.jb-sec-h p{margin:4px 0 0;font-size:13.5px;color:var(--mute)}
.jb-cats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.jb-cat{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;font:inherit;background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 10px;cursor:pointer;color:var(--ink)}
.jb-cat svg{color:var(--ink2)}
.jb-cat:hover{border-color:var(--acc-l);box-shadow:0 8px 20px rgba(21,26,36,.06)}.jb-cat:hover svg{color:var(--acc)}
.jb-cat b{font-size:14px;font-weight:600}
.jb-cat span{font-size:12.5px;color:var(--mute);min-height:1.2em}
.jb-rows{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}
.jb-row{display:grid;grid-template-columns:40px minmax(0,2.3fr) minmax(0,1.4fr) minmax(0,1.3fr) 96px 124px;align-items:center;gap:16px;width:100%;text-align:left;font:inherit;color:inherit;background:#fff;border:0;border-top:1px solid var(--line);padding:12px 16px;cursor:pointer}
.jb-row:first-child{border-top:0}
.jb-row:hover{background:#fafbfd}
.jb-row-t{display:flex;flex-direction:column;min-width:0;gap:1px}
.jb-row-t b{font-size:14.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jb-row-t span{font-size:13px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jb-row-loc{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--ink2);min-width:0}
.jb-row-loc svg{flex:none;color:var(--mute)}
.jb-row-loc span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jb-row-tags{display:flex;flex-wrap:wrap;gap:5px;min-width:0}
.jb-row-when{font-size:12.5px;color:var(--mute);text-align:right;white-space:nowrap}
.jb-row-go{justify-self:end;font-size:13px;font-weight:600;color:var(--acc);border:1px solid var(--acc-l);border-radius:8px;padding:7px 12px;white-space:nowrap}
.jb-row:hover .jb-row-go{background:var(--acc);border-color:var(--acc);color:#fff}
.jb-row.jb-skel{grid-template-columns:1fr;gap:8px}
.jb-pathbox{border:1px solid #e4dcfd;background:linear-gradient(180deg,#faf8ff,#fff 70%);border-radius:14px;padding:18px}
.jb-pathbox h2 svg{color:var(--path)}
.jb-muted{font-size:13.5px;color:var(--mute);margin:0}
.jb-cta{display:flex;align-items:center;gap:16px;border:1px solid #e4dcfd;border-radius:14px;padding:16px 18px;background:linear-gradient(90deg,#faf8ff,#fff)}
.jb-cta-ic{width:44px;height:44px;border-radius:12px;background:var(--path-t);color:var(--path);display:grid;place-items:center;flex:none}
.jb-cta>div{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.jb-cta b{font-size:15px}.jb-cta span{font-size:13.5px;color:var(--ink2);line-height:1.5}
.jb-why{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.jb-why>div{border:1px solid var(--line);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:6px}
.jb-why-ic{width:38px;height:38px;border-radius:10px;background:var(--acc-t);color:var(--acc);display:grid;place-items:center;margin-bottom:4px}
.jb-why b{font-size:15px}.jb-why p{margin:0;font-size:13.5px;color:var(--ink2);line-height:1.55}
.jb-how{margin:16px 0 0}
.jb-foot{padding-bottom:48px}

/* results view */
.jb-results{background:var(--bg);min-height:calc(100vh - 64px)}
.jb-sbar{background:#fff;border-bottom:1px solid var(--line);padding:14px 0 16px}
.jb-crumbs{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--mute);margin-bottom:10px}
.jb-crumbs button{font:inherit;color:var(--mute);background:none;border:0;padding:0;cursor:pointer}.jb-crumbs button:hover{color:var(--acc)}
.jb-crumbs b{color:var(--ink);font-weight:600}
.jb-mine-h{padding-top:26px}
.jb-mine-h h1{font-size:24px;margin:0}
.jb-mine-h p{font-size:14px;color:var(--ink2);margin:6px 0 0}
.jb-filters{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-top:14px;padding-bottom:14px}
.jb-chip{font:inherit;font-size:13px;font-weight:500;padding:6px 13px;border-radius:999px;border:1px solid var(--line);background:#fff;color:#374151;cursor:pointer}
.jb-chip:hover{border-color:#cbd5e1}
.jb-chip[aria-pressed="true"]{background:var(--acc-t);border-color:var(--acc-l);color:var(--acc);font-weight:600}
.jb-chip-path[aria-pressed="true"],.jb-chip-path:hover{border-color:#c4b5fd;color:var(--path)}
.jb-chip-path[aria-pressed="true"]{background:var(--path-t)}
.jb-sep{width:1px;height:20px;background:var(--line)}
.jb-select select{font:inherit;font-size:13px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;color:#374151}
.jb-select-sm select{padding:3px 6px;font-size:12px}
.jb-sort{margin-left:auto}
.jb-clear{font:inherit;font-size:13px;font-weight:600;color:var(--acc);background:none;border:0;cursor:pointer;padding:6px}
.jb-main{display:grid;grid-template-columns:minmax(300px,420px) minmax(0,1fr);gap:16px;align-items:start;padding-bottom:40px}
.jb-list{display:flex;flex-direction:column;gap:8px;min-width:0}
.jb-count{font-size:13px;color:var(--mute);min-height:18px}
.jb-card{display:flex;gap:12px;text-align:left;width:100%;padding:14px;background:#fff;border:1px solid var(--line);border-radius:10px;cursor:pointer;font:inherit;color:inherit}
.jb-card:hover{border-color:#cbd5e1}
.jb-card.is-active{border-color:var(--acc);box-shadow:inset 3px 0 0 var(--acc)}
.jb-logo-box{flex:none;width:44px;height:44px;border-radius:9px;display:grid;place-items:center;font-weight:700;overflow:hidden;border:1px solid rgba(21,26,36,.06)}
.jb-logo-box img{width:100%;height:100%;object-fit:contain}
.jb-card-b{display:flex;flex-direction:column;gap:3px;min-width:0}
.jb-title{font-size:15px;font-weight:600;line-height:1.3;color:var(--ink)}
.jb-card.is-active .jb-title{color:var(--acc)}
.jb-co{font-size:13.5px;color:var(--ink2)}
.jb-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}
.jb-tag{font-style:normal;font-size:11.5px;font-weight:500;color:#374151;background:#f3f4f6;border-radius:6px;padding:2px 7px;white-space:nowrap}
.jb-tag-path{color:var(--path);background:var(--path-t);font-weight:600}
.jb-tag-warn{color:var(--warn);background:var(--warn-t);font-weight:600}
.jb-tag-ok,.jb-tag-type{color:var(--ok);background:var(--ok-t)}
.jb-meta{font-size:12px;color:var(--mute);margin-top:2px}
.jb-skel{cursor:default;flex-direction:column;gap:8px}
.jb-skel i{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,#f1f2f4,#e7e9ec,#f1f2f4);background-size:200% 100%;animation:jbsh 1.2s infinite}
.jb-skel i:nth-child(1){width:70%}.jb-skel i:nth-child(2){width:45%}.jb-skel i:nth-child(3){width:30%}
@keyframes jbsh{to{background-position:-200% 0}}
.jb-empty{display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:24px;background:#fff;border:1px dashed #d1d5db;border-radius:12px;font-size:14px;color:var(--ink2)}
.jb-empty b{color:var(--ink);font-size:15px}
.jb-empty-wide{margin-top:20px;align-items:center;text-align:center}
.jb-pages{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;color:var(--mute);padding-top:6px}
.jb-disclaimer{font-size:12px;color:var(--mute);line-height:1.5;margin:14px 0 0}
.jb-detail{position:sticky;top:76px;max-height:calc(100vh - 92px);overflow-y:auto;background:#fff;border:1px solid var(--line);border-radius:12px;min-width:0}
.jb-detail>.jb-empty{border:0}
.jb-back{display:none}
.jb-panel{padding:22px 24px 20px;display:flex;flex-direction:column;gap:16px}
.jb-panel-h{display:flex;gap:14px;align-items:flex-start}
.jb-panel h2{font-size:21px;line-height:1.25;margin:0 0 4px;letter-spacing:-.01em}
.jb-facts{font-size:13px;color:var(--mute);margin-top:4px}
.jb-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.jb-apply-note{font-size:12px;color:var(--mute)}
.jb-box{border:1px solid var(--line);border-radius:10px;padding:14px 16px;background:#fafafa}
.jb-box h3,.jb-about h3{font-size:14px;margin:0 0 6px;display:flex;align-items:center;gap:6px}
.jb-box p,.jb-box li{font-size:13.5px;color:var(--ink2);line-height:1.55;margin:0}
.jb-box ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}
.jb-trust.is-verified,.jb-trust.is-standard{background:var(--ok-t);border-color:#bbf7d0}.jb-trust.is-verified h3,.jb-trust.is-standard h3{color:var(--ok)}
.jb-trust.is-caution{background:var(--warn-t);border-color:#fde68a}.jb-trust.is-caution h3{color:var(--warn)}
.jb-path{background:#fff}.jb-path.is-on{background:var(--path-t);border-color:#ddd6fe}.jb-path.is-on h3{color:var(--path)}
.jb-row-links{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin-top:8px}
.jb-link{font-size:13.5px;font-weight:600;color:var(--acc);text-decoration:none}.jb-link:hover{text-decoration:underline}
.jb-desc{font-size:14px;line-height:1.65;color:#374151;white-space:pre-line;overflow-wrap:anywhere}
.jb-about p{font-size:14px;color:var(--ink2);margin:0}
.jb-source{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:12.5px;color:var(--mute);border-top:1px solid var(--line);padding-top:12px}
.jb-source a{color:var(--acc)}
.jb-report{align-self:flex-start;font:inherit;font-size:12.5px;color:var(--mute);background:none;border:0;text-decoration:underline;cursor:pointer;padding:0}
.jb-report-form{background:#fff}
.jb-field{display:flex;flex-direction:column;gap:5px;font-size:12.5px;font-weight:600;color:var(--ink2);margin-top:10px}
.jb-field textarea{font:inherit;font-size:14px;font-weight:400;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;width:100%}
.jb-radio{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#374151}
.jb-trap{position:absolute;left:-9999px;width:1px;height:1px}
.jb-err{color:#b91c1c;font-size:13px;margin:8px 0 0}
.jb-kanban{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;padding-top:20px;padding-bottom:40px}
.jb-col{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0}
.jb-col h3{font-size:13px;margin:0;display:flex;justify-content:space-between;color:#374151}
.jb-col h3 span{color:var(--mute);font-weight:500}
.jb-mini{border:1px solid var(--line);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:2px;font-size:13px}
.jb-mini b{font-size:13.5px}.jb-mini span{color:var(--ink2)}
.jb-col-empty{font-size:12.5px;color:#9ca3af;margin:0}
.jb-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:var(--ink);color:#fff;font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px;z-index:60}

@media (max-width:1100px){
  .jb-row{grid-template-columns:40px minmax(0,2fr) minmax(0,1.3fr) minmax(0,1.2fr) 112px}
  .jb-row-when{display:none}
}
@media (max-width:980px){
  .jb-wrap{padding-left:16px;padding-right:16px}
  .jb-bar-in{flex-wrap:wrap;gap:8px 12px;padding:8px 16px 0}
  .jb-brand img{height:28px}
  .jb-bar-r{margin-left:auto}
  .jb-bar-r .jb-btn{padding:7px 11px;font-size:13px}
  .jb-nav{order:3;width:100%;flex:none;justify-content:flex-start;overflow-x:auto;scrollbar-width:none;margin:0 -6px;padding-bottom:6px}
  .jb-nav::-webkit-scrollbar{display:none}
  .jb-hero-photo{position:relative;width:100%;height:200px}
  .jb-hero-photo::before{background:linear-gradient(0deg,#f6f7fb 0%,rgba(246,247,251,0) 50%)}
  .jb-hero-badge{right:16px;bottom:14px;padding:8px 12px}
  .jb-hero-in{padding-top:6px;padding-bottom:32px}
  .jb-lead{font-size:15.5px}
  .jb-search{flex-direction:column;padding:4px}
  .jb-sf{border-right:0;border-bottom:1px solid var(--line)}
  .jb-sf:nth-of-type(3){border-bottom:0}
  .jb-go{height:46px;margin-top:4px}
  .jb-cos-in{flex-wrap:wrap;gap:6px 16px}
  .jb-cos-list{order:3;width:100%;flex:none;margin:0 -10px}
  .jb-stats-in{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 0}
  .jb-stat{justify-content:flex-start}
  .jb-stat:nth-child(3){border-left:0}
  .jb-cats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .jb-row{grid-template-columns:40px minmax(0,1fr);gap:4px 12px;padding:12px 14px}
  .jb-row>.jb-logo-box{grid-row:span 3;align-self:start}
  .jb-row-loc,.jb-row-tags{grid-column:2}
  .jb-row-when,.jb-row-go{display:none}
  .jb-why{grid-template-columns:minmax(0,1fr)}
  .jb-cta{flex-wrap:wrap}
  .jb-main{grid-template-columns:minmax(0,1fr)}
  .jb-detail{position:static;max-height:none;display:none}
  .jb-main.show-detail .jb-detail{display:block}
  .jb-main.show-detail .jb-list{display:none}
  .jb-back{display:inline-flex;margin:14px 0 0 16px;font:inherit;font-size:13.5px;font-weight:600;color:var(--acc);background:none;border:0;cursor:pointer}
  .jb-panel{padding:16px}
  .jb-kanban{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:520px){
  .jb-brand span{display:none}
  .jb-sec h2{font-size:18px}
}
`;
