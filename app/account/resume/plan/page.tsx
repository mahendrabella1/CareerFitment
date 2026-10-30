"use client";
/**
 * /account/resume/plan - "Your job plan": the whole journey from a target
 * role to an offer, as six steps whose status comes from the student's own
 * data (resume and ATS score, job tracker users/{uid}.jobs, interview
 * practice in this browser), plus LinkedIn help and ready-to-send follow-up
 * and thank-you emails for each application.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { loadTracker } from "@/lib/jobs/student";
import type { TrackedJob } from "@/lib/jobs/types";
import { plainText, skillList } from "@/lib/resume/resume";
import { atsReport } from "@/lib/resume/ats";
import { JobReadyShell, authedPost } from "@/components/jobready/JobReadyShell";
import { loadPractised, loadReviews, useResume, type Review } from "@/components/jobready/useResume";

const DAY = 864e5;

export default function PlanPage() {
  return <JobReadyShell><Plan /></JobReadyShell>;
}

function Plan() {
  const { r, set, stage, user } = useResume();
  const [tracker, setTracker] = useState<Record<string, TrackedJob>>({});
  const [practised, setPractised] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => { if (user) void loadTracker(user.uid).then(setTracker).catch(() => undefined); }, [user]);
  useEffect(() => { setPractised(loadPractised().size); setReviews(loadReviews()); }, []);
  const ats = useMemo(() => (r ? atsReport(r, stage) : null), [r, stage]);
  if (!r || !ats) return <p className="fp-muted" style={{ padding: 24 }}>Loading your plan…</p>;

  const apps = Object.entries(tracker).map(([id, t]) => ({ id, ...t })).sort((a, b) => b.updatedAt - a.updatedAt);
  const applied = apps.filter((a) => a.status === "applied" || a.status === "interview" || a.status === "offer");
  const avg = reviews.length ? Math.round(reviews.slice(0, 10).reduce((s, x) => s + x.total, 0) / Math.min(10, reviews.length)) : null;
  const followUps = apps.filter((a) => a.status === "applied" && Date.now() - a.updatedAt >= 7 * DAY);

  const steps = [
    { done: r.target.trim().length >= 3, title: "Choose your target role", text: r.target ? <>Aiming for <b>{r.target}</b>. Get the role kit in the builder to see the skills employers ask for.</> : "Every suggestion, match and practice question is tailored to it.", cta: { href: "/account/resume", label: r.target ? "Role kit" : "Set it" } },
    { done: ats.score >= 80, title: "Build an ATS-ready resume", text: <>Your ATS check: <b>{ats.score}/100</b>{ats.score >= 80 ? " - ready to send. Download the PDF." : ` - fix the top items until it's 80 or more.`} {skillList(r).length} skills listed.</>, cta: { href: "/account/resume", label: ats.score >= 80 ? "Download PDF" : "Improve it" } },
    { done: apps.length > 0, title: "Find jobs that fit", text: apps.length ? `${apps.length} job${apps.length === 1 ? "" : "s"} saved or applied to.` : "Live internships and jobs matched to your role and skills, with a fit score.", cta: { href: "/account/resume/jobs", label: "Jobs for you" } },
    { done: applied.length > 0, title: "Apply - tailored, with a cover letter", text: applied.length ? `${applied.length} application${applied.length === 1 ? "" : "s"} sent. Aim for 5-10 well-chosen ones a week.` : "For each job: tailor your resume to the post and write a cover letter, then apply on the employer's page.", cta: { href: "/account/resume/jobs", label: "Apply" } },
    { done: practised >= 10 || reviews.length >= 3, title: "Prepare for interviews", text: <>{practised} of 100 common questions practised{reviews.length ? <> · {reviews.length} mock answer{reviews.length === 1 ? "" : "s"} reviewed{avg != null ? <>, averaging <b>{avg}/100</b></> : ""}</> : ""}. Practise questions for your own role too.</>, cta: { href: "/account/interview/practice", label: "Mock interview" } },
    { done: apps.some((a) => a.status === "interview" || a.status === "offer"), title: "Follow up and keep track", text: followUps.length ? `${followUps.length} application${followUps.length === 1 ? " has" : "s have"} had no news for a week - send a polite follow-up (below).` : "Update each application's status as you hear back. Follow up after a week, and say thank you after every interview.", cta: { href: "#applications", label: "My applications" } },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const next = steps.findIndex((s) => !s.done);

  return (
    <>
      <div className="pl-head">
        <div>
          <h1>Your job plan</h1>
          <p>From a target role to an offer, in six steps. Each step updates as you go.</p>
        </div>
        <div className="pl-prog"><b>{doneCount}</b>/6 steps done<div><i style={{ width: `${(doneCount / 6) * 100}%` }} /></div></div>
      </div>

      {!r.target && (
        <div className="pl-role">
          <label htmlFor="pl-role">What role are you aiming for?</label>
          <input id="pl-role" className="pl-in" placeholder="e.g. Data Analyst intern, Junior Accountant, UX Designer" onBlur={(e) => { const v = e.target.value.trim(); if (v) set((x) => ({ ...x, target: v })); }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} />
        </div>
      )}

      <ol className="pl-steps">
        {steps.map((s, i) => (
          <li key={s.title} className={s.done ? "is-done" : i === next ? "is-next" : ""}>
            <span className="pl-n">{s.done ? <Icon name="check" size={15} stroke={2.6} /> : i + 1}</span>
            <div><b className="pl-t">{s.title}</b><p>{s.text}</p></div>
            <Link href={s.cta.href} className={`fp-btn fp-btn-sm${i === next ? " fp-btn-pri" : ""}`}>{s.cta.label}</Link>
          </li>
        ))}
      </ol>

      <section className="pl-sec" id="applications">
        <h2>My applications</h2>
        {apps.length === 0 ? <p className="fp-muted">Jobs you save or apply to from <Link href="/account/resume/jobs" className="fp-link" style={{ fontSize: 13 }}>Jobs for you</Link> or the job board appear here.</p> : (
          <div className="pl-apps">
            {apps.slice(0, 12).map((a) => <AppRow key={a.id} a={a} name={r.contact.name} phone={r.contact.phone} skills={skillList(r).slice(0, 3)} />)}
          </div>
        )}
      </section>

      <LinkedIn resume={plainText(r, stage)} target={r.target} />
      <style dangerouslySetInnerHTML={{ __html: PL_CSS }} />
    </>
  );
}

function AppRow({ a, name, phone, skills }: { a: TrackedJob & { id: string }; name: string; phone: string; skills: string[] }) {
  const [open, setOpen] = useState<"" | "follow" | "thanks">("");
  const [copied, setCopied] = useState(false);
  const days = Math.floor((Date.now() - a.updatedAt) / DAY);
  const due = a.status === "applied" && days >= 7;
  const sign = `Best regards,\n${name || "[Your name]"}${phone ? `\n${phone}` : ""}`;
  const text = open === "follow"
    ? `Subject: Following up on my application - ${a.title}\n\nDear Hiring Team,\n\nI applied for the ${a.title} role at ${a.company} ${days >= 1 ? `${days} days ago` : "recently"} and wanted to follow up. I'm still very interested in the role, especially [one thing from the job post that excites you].${skills.length ? ` My experience with ${skills.join(", ")} would help me contribute from the start.` : ""}\n\nPlease let me know if you need anything else from me. Thank you for your time.\n\n${sign}`
    : `Subject: Thank you - ${a.title} interview\n\nDear [Interviewer's name],\n\nThank you for speaking with me today about the ${a.title} role at ${a.company}. I enjoyed learning about [something you discussed], and it made me even more interested in joining the team.\n\n[One sentence on how you'd help, linked to what they told you.]\n\nI look forward to hearing from you.\n\n${sign}`;
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* blocked */ } };
  return (
    <div className="pl-app">
      <div className="pl-app-h">
        <span><b>{a.title}</b><small>{a.company} · {a.status[0].toUpperCase() + a.status.slice(1)} · updated {days <= 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}{due ? " · follow up now" : ""}</small></span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {a.status === "saved" && <a href={a.applyUrl} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-sm fp-btn-pri">Apply</a>}
          {a.status === "applied" && <button className={`fp-btn fp-btn-sm${due ? " fp-btn-pri" : ""}`} onClick={() => setOpen(open === "follow" ? "" : "follow")}>Follow-up email</button>}
          {(a.status === "interview" || a.status === "offer") && <button className="fp-btn fp-btn-sm" onClick={() => setOpen(open === "thanks" ? "" : "thanks")}>Thank-you note</button>}
        </div>
      </div>
      {open && (
        <div className="pl-mail">
          <pre>{text}</pre>
          <div style={{ display: "flex", gap: 8 }}><button className="fp-btn fp-btn-sm fp-btn-pri" onClick={() => void copy()}>{copied ? "Copied" : "Copy"}</button><small className="fp-muted">Fill in the [brackets] before you send it.</small></div>
        </div>
      )}
    </div>
  );
}

function LinkedIn({ resume, target }: { resume: string; target: string }) {
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ headline: string; about: string } | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const go = async () => {
    setBusy(true); setErr("");
    try { setOut(await authedPost("/api/resume/ai", { action: "linkedin", resume, target })); }
    catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  const copy = async (k: string, v: string) => { try { await navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(""), 1500); } catch { /* blocked */ } };
  return (
    <section className="pl-sec">
      <h2>Make your LinkedIn match</h2>
      <p className="fp-muted" style={{ margin: "0 0 10px" }}>Recruiters check LinkedIn after reading a resume. Get a headline and an About section written from your resume - then paste them into your profile.</p>
      {!out ? <button className="fp-btn fp-btn-sm" disabled={busy} onClick={() => void go()}>{busy ? "Writing…" : "Write my headline and About"}</button> : (
        <div className="pl-li">
          <div><span className="fp-kicker" style={{ border: 0, padding: 0 }}>Headline</span><p>{out.headline}</p><button className="fp-btn fp-btn-sm" onClick={() => void copy("h", out.headline)}>{copied === "h" ? "Copied" : "Copy"}</button></div>
          <div><span className="fp-kicker" style={{ border: 0, padding: 0 }}>About</span><p style={{ whiteSpace: "pre-line" }}>{out.about}</p><button className="fp-btn fp-btn-sm" onClick={() => void copy("a", out.about)}>{copied === "a" ? "Copied" : "Copy"}</button></div>
        </div>
      )}
      {err && <p style={{ color: "#b42318", fontSize: 13 }}>{err}</p>}
    </section>
  );
}

const PL_CSS = `
.pl-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
.pl-head h1{margin:0;font-size:22px;font-weight:600}
.pl-head p{margin:6px 0 0;font-size:14px;color:var(--ink2)}
.pl-prog{font-size:13px;color:var(--mute);min-width:180px}
.pl-prog b{font-size:24px;color:var(--ink);font-weight:700}
.pl-prog div{height:6px;border-radius:999px;background:#ece9e4;margin-top:6px;overflow:hidden}
.pl-prog i{display:block;height:100%;background:var(--accent);border-radius:999px}
.pl-role{background:#fff;border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin-bottom:12px;display:grid;gap:6px}
.pl-role label{font-size:14px;font-weight:600}
.pl-in{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:6px;padding:9px 11px;font:inherit;font-size:14px}
.pl-steps{list-style:none;margin:0;padding:0;background:#fff;border:1px solid var(--line);border-radius:8px}
.pl-steps li{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:14px;align-items:center;padding:14px 16px;border-top:1px solid #f0ede8}
.pl-steps li:first-child{border-top:0}
.pl-n{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1.5px solid var(--line2);font-size:13px;font-weight:700;color:var(--mute)}
.pl-steps li.is-done .pl-n{background:#ecfdf3;border-color:#bbf7d0;color:#166534}
.pl-steps li.is-next .pl-n{border-color:var(--accent);color:var(--accent)}
.pl-steps li.is-next{background:color-mix(in srgb,var(--accent) 3%,#fff)}
.pl-steps .pl-t{display:block;font-size:15px;font-weight:600}
.pl-steps p{margin:3px 0 0;font-size:13.5px;line-height:1.5;color:var(--ink2)}
.pl-steps p b{font-weight:600;color:var(--ink)}
.pl-steps li.is-done .pl-t{color:var(--ink2)}
.pl-sec{margin-top:26px;scroll-margin-top:140px}
.pl-sec h2{margin:0 0 10px;font-size:17px;font-weight:600}
.pl-apps{background:#fff;border:1px solid var(--line);border-radius:8px}
.pl-app{padding:12px 16px;border-top:1px solid #f0ede8}
.pl-app:first-child{border-top:0}
.pl-app-h{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}
.pl-app-h b{display:block;font-size:14.5px;font-weight:600}
.pl-app-h small{display:block;font-size:12.5px;color:var(--mute)}
.pl-mail{margin-top:10px;display:grid;gap:8px}
.pl-mail pre{margin:0;white-space:pre-wrap;font:inherit;font-size:13.5px;line-height:1.6;background:#fcfcfb;border:1px solid var(--line);border-radius:6px;padding:12px;color:var(--ink)}
.pl-li{display:grid;gap:12px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:14px 16px}
.pl-li p{margin:4px 0 8px;font-size:14px;line-height:1.6;color:var(--ink)}
@media (max-width:640px){.pl-steps li{grid-template-columns:28px minmax(0,1fr)}.pl-steps li .fp-btn{grid-column:2;justify-self:start}}
`;
