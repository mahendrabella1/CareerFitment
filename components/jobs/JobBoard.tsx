"use client";

/**
 * OneGrasp Launchpad - the job portal (public /jobs and the dashboard's
 * /account/jobs). Two panes like LinkedIn Jobs: results on the left, the
 * chosen job on the right (one pane with a back button on phones).
 *
 * What sets it apart: each listing carries a Trust Shield check (scam warning
 * signs), "on your path" when its role is one the student's report points to
 * (with that role's roadmap one click away), and a saved / applied tracker.
 * Listings come from third-party sources and are applied for on the
 * employer's site; nothing here states a salary, deadline or requirement the
 * source didn't.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { HowItWorks } from "@/components/HowItWorks";
import { CATEGORY_SHORT, JOB_CATEGORIES } from "@/lib/jobs/clusters";
import { isOnPath, loadTracker, pathCareers, saveTracked, TRACK_STATUSES } from "@/lib/jobs/student";
import type { EmploymentType, JobDetail, JobListItem, JobSearchResult, TrackStatus, TrackedJob, WorkplaceType } from "@/lib/jobs/types";
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

interface Filters { q: string; location: string; type: string; workplace: string; category: string; fresher: boolean; path: boolean; page: number }
const EMPTY: Filters = { q: "", location: "", type: "", workplace: "", category: "", fresher: false, path: false, page: 1 };

function readUrl(): Filters {
  if (typeof window === "undefined") return EMPTY;
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "", location: p.get("location") ?? "", type: p.get("type") ?? "", workplace: p.get("workplace") ?? "",
    category: p.get("category") ?? "", fresher: p.get("fresher") === "1", path: p.get("path") === "1", page: Math.max(1, Number(p.get("page")) || 1),
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

const initials = (s: string) => s.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

export function JobBoard({ variant }: { variant: "public" | "account" }) {
  const { user, profile, loading: authLoading } = useAuth();
  const careers = useMemo(() => pathCareers(profile), [profile]);
  const [tab, setTab] = useState<"find" | "mine">("find");
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [draft, setDraft] = useState({ q: "", location: "" });
  const [result, setResult] = useState<JobSearchResult | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error" | "unavailable">("loading");
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<JobDetail | null>(null);
  const [detailState, setDetailState] = useState<"idle" | "loading" | "error" | "gone">("idle");
  const [mobileDetail, setMobileDetail] = useState(false);
  const [tracker, setTracker] = useState<Record<string, TrackedJob>>({});
  const [toast, setToast] = useState("");
  const [urlRead, setUrlRead] = useState(false);
  const [pathRoles, setPathRoles] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const requestNo = useRef(0);

  // First load: filters from the address bar (shareable searches).
  useEffect(() => {
    const f = readUrl();
    setFilters(f);
    setDraft({ q: f.q, location: f.location });
    setUrlRead(true);
  }, []);

  // The job role names the student's careers correspond to (as jobs are
  // labelled), so "On my path" works however the report words a career.
  useEffect(() => {
    if (!careers.length) { setPathRoles([]); return; }
    const p = new URLSearchParams();
    careers.forEach((c) => p.append("career", c));
    let live = true;
    fetch(`/api/jobs/roles?${p}`)
      .then((r) => (r.ok ? r.json() : { roles: [] }))
      .then((d: { roles?: string[] }) => { if (live) setPathRoles(Array.isArray(d.roles) ? d.roles : []); })
      .catch(() => undefined);
    return () => { live = false; };
  }, [careers]);
  const pathNames = useMemo(() => [...new Set([...pathRoles, ...careers])].slice(0, 20), [pathRoles, careers]);
  const pathRef = useRef<string[]>([]);
  pathRef.current = pathNames;

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
    if (f.page > 1) p.set("page", String(f.page));
    const shown = new URLSearchParams(p);
    if (f.path) {
      shown.set("path", "1");
      pathRef.current.forEach((c) => p.append("role", c));
    }
    window.history.replaceState(null, "", `${window.location.pathname}${shown.toString() ? `?${shown}` : ""}`);
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
    if (filters.path && !pathKey) { setFilters((f) => ({ ...f, path: false })); return; }
    load(filters);
  }, [filters, load, authLoading, urlRead, pathKey]);

  useEffect(() => {
    if (!selected) { setDetail(null); return; }
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
  }, [selected]);

  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));
  const submit = (e: FormEvent) => { e.preventDefault(); set({ q: draft.q.trim(), location: draft.location.trim() }); };
  const clearAll = () => { setDraft({ q: "", location: "" }); setFilters(EMPTY); };
  const anyFilter = Boolean(filters.q || filters.location || filters.type || filters.workplace || filters.category || filters.fresher || filters.path);

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

  const open = (id: string) => { setSelected(id); setMobileDetail(true); };
  const pages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  const tracked = Object.entries(tracker);

  return (
    <div className="jb">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="jb-bar">
        <Link href={variant === "account" ? "/account" : "/"} className="jb-logo" aria-label="OneGrasp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
        </Link>
        <nav className="jb-crumbs" aria-label="Breadcrumb">
          {variant === "account" ? <><Link href="/account">Dashboard</Link><span aria-hidden="true">›</span></> : null}
          <b>Jobs</b>
        </nav>
        <div className="jb-bar-r">
          {user
            ? (variant === "public" ? <Link href="/account/jobs" className="jb-btn">My dashboard</Link> : <Link href="/account" className="jb-btn">Dashboard</Link>)
            : <Link href="/signin" className="jb-btn jb-btn-primary">Sign in</Link>}
        </div>
      </header>

      <section className="jb-hero">
        <div className="jb-wrap">
          <h1>Find internships and jobs that fit you</h1>
          <p>New listings every day from sources that allow us to show them. Every listing is checked for scam warning signs, and you always apply on the employer&apos;s own site.</p>
          <div className="jb-how">
            <HowItWorks id="jobs" accent="#2563eb" steps={[
              "Listings are imported once a day from job sources that allow us to show them. Closed listings drop off automatically.",
              "Every listing gets a Trust Shield check for scam warning signs - fees, chat-app-only contact, personal email, \"guaranteed job\" promises.",
              "★ On my path shows jobs for the careers your report points to, with that career's roadmap one click away.",
              "You apply on the employer's own site. Signed in, save jobs and track them: saved → applied → interview → offer.",
            ]} sync="Your saved and tracked jobs are stored on your account only." />
          </div>
          <form className="jb-search" onSubmit={submit} role="search">
            <label className="jb-field">
              <span>What</span>
              <input value={draft.q} onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))} placeholder="Role, skill or company - e.g. data analyst" maxLength={100} />
            </label>
            <label className="jb-field">
              <span>Where</span>
              <input value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} placeholder="City, country or “Remote”" maxLength={60} />
            </label>
            <button className="jb-btn jb-btn-primary jb-go" type="submit">Search jobs</button>
          </form>
          {variant === "account" && user && (
            <div className="jb-tabs" role="tablist">
              <button role="tab" aria-selected={tab === "find"} onClick={() => setTab("find")}>Find jobs</button>
              <button role="tab" aria-selected={tab === "mine"} onClick={() => setTab("mine")}>My jobs{tracked.length ? ` (${tracked.length})` : ""}</button>
            </div>
          )}
        </div>
      </section>

      {tab === "mine" && user ? (
        <MyJobs tracked={tracked} onMove={(id, t, s) => track({ id, title: t.title, company: t.company, apply_url: t.applyUrl }, s)} />
      ) : (
        <>
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
            {anyFilter && <button className="jb-clear" onClick={clearAll}>Clear all</button>}
          </div>

          <div className={`jb-main jb-wrap${mobileDetail ? " show-detail" : ""}`}>
            <div className="jb-list" ref={listRef} aria-busy={state === "loading"}>
              <div className="jb-count">
                {state === "idle" && result ? `${result.total.toLocaleString("en-IN")} ${result.total === 1 ? "job" : "jobs"}${filters.path ? " on your path" : ""}` : state === "loading" ? "Loading jobs…" : ""}
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
                  <b>{anyFilter ? "No jobs match these filters." : "No jobs yet."}</b>
                  <span>{anyFilter ? "Try a broader search, or remove a filter." : "New listings arrive with the daily update."}</span>
                  {anyFilter && <button className="jb-btn" onClick={clearAll}>Clear all filters</button>}
                </div>
              )}
              {state === "idle" && result?.jobs.map((j) => {
                const onPath = isOnPath(j, pathNames);
                const t = tracker[j.id];
                return (
                  <button key={j.id} className={`jb-card${selected === j.id ? " is-active" : ""}`} onClick={() => open(j.id)} aria-current={selected === j.id ? "true" : undefined}>
                    <span className="jb-logo-box" aria-hidden="true">{j.company_logo ? <img src={j.company_logo} alt="" loading="lazy" referrerPolicy="no-referrer" /> : initials(j.company)}</span>
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
              <p className="jb-disclaimer">Listings come from third-party sources and are applied for on the employer&apos;s website. OneGrasp checks for warning signs but cannot verify every employer. Never pay a fee to get a job.</p>
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
        </>
      )}
      {toast && <div className="jb-toast" role="status">{toast}</div>}
    </div>
  );
}

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

  return (
    <article className="jb-panel">
      <div className="jb-panel-h">
        <span className="jb-logo-box jb-logo-lg" aria-hidden="true">{job.company_logo ? <img src={job.company_logo} alt="" referrerPolicy="no-referrer" /> : initials(job.company)}</span>
        <div style={{ minWidth: 0 }}>
          <h2>{job.title}</h2>
          <div className="jb-co">{job.company}</div>
          <div className="jb-facts">
            {[job.location, job.workplace_type !== "Unknown" && job.workplace_type, job.employment_type !== "Unknown" && job.employment_type, job.posted_at && `Posted ${ago(job.posted_at)}`].filter(Boolean).join(" · ")}
          </div>
        </div>
      </div>

      <div className="jb-actions">
        <a className="jb-btn jb-btn-primary" href={job.apply_url} target="_blank" rel="noopener noreferrer">Apply on employer site ↗</a>
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
      </div>

      <section className={`jb-box jb-trust is-${job.trust_level}`}>
        <h3>{job.trust_level === "caution" ? "Trust Shield: check before you apply" : job.trust_level === "verified" ? "Trust Shield: verified source, no warning signs" : "Trust Shield: no warning signs found"}</h3>
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
          <div className="jb-row">
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
        {job.description ? <div className="jb-desc">{job.description}</div> : <p>The full description is on the employer&apos;s page.</p>}
      </section>

      <footer className="jb-source">
        <span>{job.attribution ?? "Third-party listing"}{job.source_url ? <> · <a href={job.source_url} target="_blank" rel="noopener noreferrer">view the original listing ↗</a></> : null}</span>
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
      <div className="jb-row">
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
      <div className="jb-row">
        <button className="jb-btn jb-btn-primary" disabled={busy}>{busy ? "Sending…" : "Send report"}</button>
        <button type="button" className="jb-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function MyJobs({ tracked, onMove }: { tracked: [string, TrackedJob][]; onMove: (id: string, t: TrackedJob, s: TrackStatus | null) => void }) {
  if (!tracked.length) {
    return (
      <div className="jb-wrap"><div className="jb-empty jb-empty-wide">
        <b>No saved jobs yet.</b>
        <span>Save jobs while you search, then track them here: saved → applied → interview → offer.</span>
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
                <div className="jb-row">
                  <a className="jb-link" href={t.applyUrl} target="_blank" rel="noopener noreferrer">Employer page ↗</a>
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
.jb{--ink:#111827;--ink2:#4b5563;--mute:#6b7280;--line:#e5e7eb;--bg:#f6f7f9;--card:#fff;--acc:#2563eb;--acc-t:#eff6ff;--ok:#15803d;--ok-t:#f0fdf4;--warn:#b45309;--warn-t:#fffbeb;--path:#7c3aed;--path-t:#f5f3ff;
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,"Segoe UI",sans-serif}
.jb *{box-sizing:border-box}
.jb-wrap{max-width:1240px;margin:0 auto;padding-left:24px;padding-right:24px}
.jb-bar{position:sticky;top:0;z-index:30;height:56px;display:flex;align-items:center;gap:16px;padding:0 20px;background:#fff;border-bottom:1px solid var(--line)}
.jb-logo img{height:34px;width:auto;display:block}
.jb-logo{padding-right:16px;border-right:1px solid var(--line)}
.jb-crumbs{display:flex;gap:8px;align-items:center;font-size:13.5px;color:var(--mute)}
.jb-crumbs a{color:var(--mute);text-decoration:none}.jb-crumbs a:hover{color:var(--ink)}
.jb-crumbs b{color:var(--ink);font-weight:600}
.jb-bar-r{margin-left:auto}
.jb-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;font-size:13.5px;font-weight:600;padding:8px 14px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:var(--ink);cursor:pointer;text-decoration:none;white-space:nowrap;line-height:1.2}
.jb-btn:hover{background:#f9fafb}.jb-btn:disabled{opacity:.5;cursor:not-allowed}
.jb-btn-primary{background:var(--acc);border-color:var(--acc);color:#fff}.jb-btn-primary:hover{background:#1d4ed8}
.jb-btn[aria-pressed="true"]{border-color:var(--acc);color:var(--acc);background:var(--acc-t)}
.jb-hero{background:#fff;border-bottom:1px solid var(--line);padding:24px 0 0}
.jb-hero h1{font-size:26px;line-height:1.2;margin:0;letter-spacing:-.02em}
.jb-hero p{font-size:14.5px;color:var(--ink2);margin:6px 0 16px;max-width:72ch;line-height:1.55}
.jb-how{margin:0 0 14px;max-width:820px}
.jb-search{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto;gap:10px;align-items:end;padding-bottom:18px}
.jb-field{display:flex;flex-direction:column;gap:5px;font-size:12.5px;font-weight:600;color:var(--ink2);min-width:0}
.jb-field input,.jb-field textarea{font:inherit;font-size:14.5px;font-weight:400;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:var(--ink);width:100%}
.jb-field input:focus,.jb-field textarea:focus,.jb-select select:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px #dbeafe}
.jb-go{height:42px;padding:0 20px}
.jb-tabs{display:flex;gap:4px;margin-top:2px}
.jb-tabs button{font:inherit;font-size:14px;font-weight:600;color:var(--mute);background:none;border:0;border-bottom:2px solid transparent;padding:10px 12px;cursor:pointer}
.jb-tabs button[aria-selected="true"]{color:var(--acc);border-bottom-color:var(--acc)}
.jb-filters{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-top:14px;padding-bottom:14px}
.jb-chip{font:inherit;font-size:13px;font-weight:500;padding:6px 13px;border-radius:999px;border:1px solid var(--line);background:#fff;color:#374151;cursor:pointer}
.jb-chip:hover{border-color:#cbd5e1}
.jb-chip[aria-pressed="true"]{background:var(--acc-t);border-color:#93c5fd;color:var(--acc);font-weight:600}
.jb-chip-path[aria-pressed="true"],.jb-chip-path:hover{border-color:#c4b5fd;color:var(--path)}
.jb-chip-path[aria-pressed="true"]{background:var(--path-t)}
.jb-sep{width:1px;height:20px;background:var(--line)}
.jb-select select{font:inherit;font-size:13px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;color:#374151}
.jb-select-sm select{padding:3px 6px;font-size:12px}
.jb-clear{font:inherit;font-size:13px;font-weight:600;color:var(--acc);background:none;border:0;cursor:pointer;padding:6px}
.jb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.jb-main{display:grid;grid-template-columns:minmax(300px,420px) minmax(0,1fr);gap:16px;align-items:start;padding-bottom:40px}
.jb-list{display:flex;flex-direction:column;gap:8px;min-width:0}
.jb-count{font-size:13px;color:var(--mute);min-height:18px}
.jb-card{display:flex;gap:12px;text-align:left;width:100%;padding:14px;background:var(--card);border:1px solid var(--line);border-radius:10px;cursor:pointer;font:inherit;color:inherit}
.jb-card:hover{border-color:#cbd5e1}
.jb-card.is-active{border-color:var(--acc);box-shadow:inset 3px 0 0 var(--acc)}
.jb-logo-box{flex:none;width:44px;height:44px;border-radius:8px;background:#f3f4f6;color:#374151;display:grid;place-items:center;font-weight:700;font-size:14px;overflow:hidden}
.jb-logo-box img{width:100%;height:100%;object-fit:contain;background:#fff}
.jb-logo-lg{width:56px;height:56px;font-size:18px}
.jb-card-b{display:flex;flex-direction:column;gap:3px;min-width:0}
.jb-title{font-size:15px;font-weight:600;line-height:1.3;color:var(--ink)}
.jb-card.is-active .jb-title{color:var(--acc)}
.jb-co{font-size:13.5px;color:var(--ink2)}
.jb-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}
.jb-tag{font-style:normal;font-size:11.5px;font-weight:500;color:#374151;background:#f3f4f6;border-radius:6px;padding:2px 7px}
.jb-tag-path{color:var(--path);background:var(--path-t);font-weight:600}
.jb-tag-warn{color:var(--warn);background:var(--warn-t);font-weight:600}
.jb-tag-ok{color:var(--ok);background:var(--ok-t)}
.jb-meta{font-size:12px;color:var(--mute);margin-top:2px}
.jb-skel{cursor:default;flex-direction:column;gap:8px}
.jb-skel i{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,#f1f2f4,#e7e9ec,#f1f2f4);background-size:200% 100%;animation:jbsh 1.2s infinite}
.jb-skel i:nth-child(1){width:70%}.jb-skel i:nth-child(2){width:45%}.jb-skel i:nth-child(3){width:30%}
@keyframes jbsh{to{background-position:-200% 0}}
.jb-empty{display:flex;flex-direction:column;gap:8px;align-items:flex-start;padding:24px;background:#fff;border:1px dashed #d1d5db;border-radius:10px;font-size:14px;color:var(--ink2)}
.jb-empty b{color:var(--ink);font-size:15px}
.jb-empty-wide{margin-top:20px;align-items:center;text-align:center}
.jb-pages{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;color:var(--mute);padding-top:6px}
.jb-disclaimer{font-size:12px;color:var(--mute);line-height:1.5;margin:8px 0 0}
.jb-detail{position:sticky;top:72px;max-height:calc(100vh - 88px);overflow-y:auto;background:#fff;border:1px solid var(--line);border-radius:12px;min-width:0}
.jb-detail>.jb-empty{border:0}
.jb-back{display:none}
.jb-panel{padding:22px 24px 20px;display:flex;flex-direction:column;gap:16px}
.jb-panel-h{display:flex;gap:14px;align-items:flex-start}
.jb-panel h2{font-size:21px;line-height:1.25;margin:0 0 4px;letter-spacing:-.01em}
.jb-facts{font-size:13px;color:var(--mute);margin-top:4px}
.jb-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.jb-box{border:1px solid var(--line);border-radius:10px;padding:14px 16px;background:#fafafa}
.jb-box h3,.jb-about h3{font-size:14px;margin:0 0 6px}
.jb-box p,.jb-box li{font-size:13.5px;color:var(--ink2);line-height:1.55;margin:0}
.jb-box ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}
.jb-trust.is-verified{background:var(--ok-t);border-color:#bbf7d0}.jb-trust.is-verified h3{color:var(--ok)}
.jb-trust.is-caution{background:var(--warn-t);border-color:#fde68a}.jb-trust.is-caution h3{color:var(--warn)}
.jb-path{background:#fff}.jb-path.is-on{background:var(--path-t);border-color:#ddd6fe}.jb-path.is-on h3{color:var(--path)}
.jb-row{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin-top:8px}
.jb-link{font-size:13.5px;font-weight:600;color:var(--acc);text-decoration:none}.jb-link:hover{text-decoration:underline}
.jb-desc{font-size:14px;line-height:1.65;color:#374151;white-space:pre-line;overflow-wrap:anywhere}
.jb-about p{font-size:14px;color:var(--ink2);margin:0}
.jb-source{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:12.5px;color:var(--mute);border-top:1px solid var(--line);padding-top:12px}
.jb-source a{color:var(--acc)}
.jb-report{align-self:flex-start;font:inherit;font-size:12.5px;color:var(--mute);background:none;border:0;text-decoration:underline;cursor:pointer;padding:0}
.jb-report-form{background:#fff}
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
.jb-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#111827;color:#fff;font-size:13px;font-weight:600;padding:9px 16px;border-radius:999px;z-index:60}
@media (max-width:980px){
  .jb-wrap{padding-left:16px;padding-right:16px}
  .jb-main{grid-template-columns:minmax(0,1fr)}
  .jb-detail{position:static;max-height:none;display:none}
  .jb-main.show-detail .jb-detail{display:block}
  .jb-main.show-detail .jb-list{display:none}
  .jb-back{display:inline-flex;margin:14px 0 0 16px;font:inherit;font-size:13.5px;font-weight:600;color:var(--acc);background:none;border:0;cursor:pointer}
  .jb-panel{padding:16px}
  .jb-search{grid-template-columns:minmax(0,1fr)}
  .jb-go{width:100%}
  .jb-kanban{grid-template-columns:minmax(0,1fr)}
  .jb-bar{padding:0 12px}.jb-logo{display:none}
  .jb-hero h1{font-size:22px}
}
`;
