"use client";
/**
 * /account/resume/jobs - "Jobs for you": live job-portal listings that fit the
 * student's resume (/api/resume/matches), each with a fit score, the skills
 * the post mentions that the student has and the ones it asks for that they
 * don't. Apply (saved to the job tracker, users/{uid}.jobs), tailor the
 * resume to it, write a cover letter, or practise interview questions for it.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/Icons";
import { loadTracker, saveTracked, TRACK_STATUSES } from "@/lib/jobs/student";
import type { JobListItem, TrackStatus, TrackedJob } from "@/lib/jobs/types";
import type { JobFit } from "@/lib/resume/match";
import { skillList } from "@/lib/resume/resume";
import { JobReadyShell } from "@/components/jobready/JobReadyShell";
import { CoverLetter } from "@/components/jobready/CoverLetter";
import { handJob, useResume } from "@/components/jobready/useResume";

type Match = JobListItem & { description: string; fit: JobFit };

const ago = (iso: string | null) => {
  if (!iso) return "";
  const d = Math.floor((Date.now() - Date.parse(iso)) / 864e5);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : d < 30 ? `${d} days ago` : `${Math.floor(d / 30)} mo ago`;
};
const fitLabel = (n: number) => (n >= 70 ? "Strong fit" : n >= 50 ? "Good fit" : "Worth a look");

export default function JobsForYou() {
  return <JobReadyShell><Jobs /></JobReadyShell>;
}

function Jobs() {
  const { r, stage, user } = useResume();
  const router = useRouter();
  const [jobs, setJobs] = useState<Match[] | null>(null);
  const [err, setErr] = useState("");
  const [tracker, setTracker] = useState<Record<string, TrackedJob>>({});
  const [open, setOpen] = useState<string | null>(null);

  const skills = r ? skillList(r) : [];
  const ready = !!r && (r.target.trim().length >= 3 || skills.length >= 3);

  const load = useCallback(async () => {
    if (!r) return;
    setErr(""); setJobs(null);
    try {
      const res = await fetch("/api/resume/matches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target: r.target, skills: skillList(r), stage }) });
      const d = (await res.json()) as { jobs?: Match[]; error?: string };
      if (!res.ok) throw new Error(d.error || "Couldn't load jobs.");
      setJobs(d.jobs ?? []);
    } catch (e) { setErr(e instanceof Error ? e.message : "Couldn't load jobs."); setJobs([]); }
  }, [r?.target, r?.skills, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (ready) void load(); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (user) void loadTracker(user.uid).then(setTracker).catch(() => undefined); }, [user]);

  const track = async (j: Match, status: TrackStatus | null) => {
    if (!user) return;
    const now = Date.now();
    const entry: TrackedJob | null = status ? { status, title: j.title, company: j.company, applyUrl: j.apply_url, savedAt: tracker[j.id]?.savedAt ?? now, updatedAt: now } : null;
    setTracker((t) => { const n = { ...t }; if (entry) n[j.id] = entry; else delete n[j.id]; return n; });
    try { await saveTracked(user.uid, j.id, entry); } catch { /* the tracker is a convenience */ }
  };
  const tailor = (j: Match) => { handJob({ title: j.title, company: j.company, jd: j.description }); router.push("/account/resume"); };

  const counts = Object.values(tracker).reduce<Record<string, number>>((c, t) => ({ ...c, [t.status]: (c[t.status] ?? 0) + 1 }), {});

  if (!r) return <p className="fp-muted" style={{ padding: 24 }}>Loading…</p>;

  return (
    <>
      <div className="jf-head">
        <div>
          <h1>Jobs for you</h1>
          <p>Live internships and jobs from the OneGrasp job board that fit your resume{r.target ? <> and your target role, <b>{r.target}</b></> : ""}. The fit score shows where to apply first - it&apos;s based on the role, your skills and your stage, not a prediction.</p>
        </div>
        <div className="jf-track">
          {TRACK_STATUSES.filter((s) => s.id !== "closed").map((s) => <span key={s.id}><b>{counts[s.id] ?? 0}</b>{s.label}</span>)}
          <Link href="/account/jobs" className="fp-link" style={{ fontSize: 13 }}>All jobs <Icon name="arrowRight" size={13} stroke={2} /></Link>
        </div>
      </div>

      {!ready ? (
        <div className="jf-empty">
          <b>Add your target role and a few skills first</b>
          <p>The matches come from your resume. Fill in the target role and at least three skills in the resume builder.</p>
          <Link href="/account/resume" className="fp-btn fp-btn-pri fp-btn-sm">Open the resume builder</Link>
        </div>
      ) : jobs === null ? <p className="fp-muted">Finding jobs that fit your resume…</p> : (
        <>
          {err && <p className="rb-err">{err}</p>}
          {jobs.length === 0 && !err && (
            <div className="jf-empty"><b>No close matches right now</b><p>New jobs arrive every day. Try a broader target role (e.g. &quot;Analyst&quot; instead of &quot;Junior Credit Risk Analyst&quot;), add more skills, or browse the whole board.</p><Link href="/account/jobs" className="fp-btn fp-btn-sm">Browse all jobs</Link></div>
          )}
          <div className="jf-list">
            {jobs.map((j) => {
              const t = tracker[j.id];
              const isOpen = open === j.id;
              return (
                <article key={j.id} className="jf-job">
                  <div className="jf-fit"><b>{j.fit.score}</b><small>{fitLabel(j.fit.score)}</small></div>
                  <div className="jf-b">
                    <h2>{j.title}</h2>
                    <p className="jf-meta">{[j.company, j.location, j.employment_type !== "Unknown" ? j.employment_type : "", j.workplace_type !== "Unknown" ? j.workplace_type : "", j.salary_text, ago(j.posted_at)].filter(Boolean).join(" · ")}</p>
                    {j.trust_level === "caution" && <p className="jf-warn"><Icon name="shield" size={13} stroke={2} /> Check before applying: {j.trust_flags.slice(0, 2).join("; ")}</p>}
                    <div className="jf-sk">
                      {j.fit.have.length > 0 && <span><i>You have</i>{j.fit.have.map((s) => <em key={s} className="is-in">{s}</em>)}</span>}
                      {j.fit.gaps.length > 0 && <span><i>They also ask for</i>{j.fit.gaps.map((s) => <em key={s}>{s}</em>)}</span>}
                    </div>
                    <div className="jf-a">
                      <a href={j.apply_url} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => { if (!t) void track(j, "saved"); }}>Apply <Icon name="arrowRight" size={13} stroke={2} /></a>
                      {t && t.status !== "applied" && t.status !== "interview" && t.status !== "offer" && <button className="fp-btn fp-btn-sm" onClick={() => void track(j, "applied")}>I applied</button>}
                      <button className="fp-btn fp-btn-sm" onClick={() => tailor(j)}>Tailor my resume</button>
                      <button className="fp-btn fp-btn-sm" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : j.id)}>{isOpen ? "Hide cover letter" : "Cover letter"}</button>
                      <Link className="fp-btn fp-btn-sm" href={`/account/interview/practice?role=${encodeURIComponent(j.title)}`}>Practise for it</Link>
                      {t && (
                        <select className="jf-sel" value={t.status} onChange={(e) => void track(j, e.target.value as TrackStatus)} aria-label="Application status">
                          {TRACK_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      )}
                    </div>
                    {isOpen && <CoverLetter r={r} stage={stage} title={j.title} company={j.company} jd={j.description} />}
                  </div>
                </article>
              );
            })}
          </div>
          {jobs.length > 0 && <p className="fp-muted" style={{ marginTop: 12, fontSize: 12.5 }}>Applying opens the employer&apos;s own page. OneGrasp never asks for money to apply - if a listing does, don&apos;t pay, and report it on the job board.</p>}
        </>
      )}
      <style dangerouslySetInnerHTML={{ __html: JF_CSS }} />
    </>
  );
}

const JF_CSS = `
.jf-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
.jf-head h1{margin:0;font-size:22px;font-weight:600}
.jf-head p{margin:6px 0 0;font-size:14px;line-height:1.55;color:var(--ink2);max-width:720px}
.jf-track{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--mute)}
.jf-track span{display:flex;flex-direction:column;line-height:1.2}
.jf-track b{font-size:20px;font-weight:700;color:var(--ink)}
.jf-empty{background:#fff;border:1px solid var(--line);border-radius:8px;padding:22px;display:grid;gap:8px;justify-items:start}
.jf-empty b{font-size:15.5px}
.jf-empty p{margin:0;font-size:14px;color:var(--ink2);line-height:1.55}
.jf-list{display:grid;gap:10px}
.jf-job{display:grid;grid-template-columns:76px minmax(0,1fr);gap:16px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}
.jf-fit{display:flex;flex-direction:column;align-items:center;justify-content:center;height:72px;border-radius:8px;border:1px solid var(--line);text-align:center}
.jf-fit b{font-size:24px;font-weight:700;line-height:1}
.jf-fit small{font-size:11px;color:var(--mute);margin-top:3px}
.jf-b{min-width:0}
.jf-b h2{margin:0;font-size:16px;font-weight:600;line-height:1.35}
.jf-meta{margin:3px 0 0;font-size:13px;color:var(--mute)}
.jf-warn{display:flex;gap:6px;align-items:center;margin:6px 0 0;font-size:12.5px;color:#9a3412}
.jf-sk{display:grid;gap:5px;margin-top:10px}
.jf-sk span{display:flex;flex-wrap:wrap;gap:5px;align-items:center}
.jf-sk i{font-style:normal;font-size:12px;color:var(--mute);margin-right:2px}
.jf-sk em{font-style:normal;font-size:12px;padding:2px 8px;border-radius:5px;background:#f4f4f5;color:var(--ink2)}
.jf-sk em.is-in{background:#ecfdf3;color:#166534}
.jf-a{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;align-items:center}
.jf-sel{border:1px solid var(--line);border-radius:6px;padding:6px 8px;font:inherit;font-size:12.5px;background:#fff}
.rb-in{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:6px;padding:8px 10px;font:inherit;font-size:13.5px;color:var(--ink);background:#fff;line-height:1.45}
.rb-err{margin:0;font-size:13px;color:#b42318}
@media (max-width:600px){.jf-job{grid-template-columns:minmax(0,1fr)}.jf-fit{flex-direction:row;gap:8px;height:auto;padding:6px 10px;justify-content:flex-start}}
`;
