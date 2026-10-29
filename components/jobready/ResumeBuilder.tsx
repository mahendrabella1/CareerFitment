"use client";
/**
 * The resume builder: an editor on the left, the live resume (and its ATS
 * check and job-post match) on the right. Saved in this browser at once and
 * to the student's account (users/{uid}.resume) a couple of seconds after
 * the last change. "Download PDF" prints only the resume page - the PDF
 * keeps real, selectable text, which is what applicant-tracking systems read.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/app/Icons";
import {
  EXPERIENCE_LABEL, SECTION_LABEL, SECTION_ORDER, atsCheck, blankEntry, dateRange, hasSection, plainText, skillList,
  type Entry, type Resume, type Stage,
} from "@/lib/resume/resume";
import { authedPost } from "./JobReadyShell";
import { addSkills, takeJob, useResume, type JobHandoff } from "./useResume";
import { CoverLetter } from "./CoverLetter";

type ListKey = "education" | "experience" | "projects";

export function ResumeBuilder() {
  const { r, set, stage, status } = useResume();
  const [view, setView] = useState<"preview" | "ats" | "job">("preview");
  const [jd, setJd] = useState("");
  const [job, setJob] = useState<JobHandoff | null>(null);

  // A job sent from "Jobs for you": open "Match a job" with its description.
  useEffect(() => {
    const j = takeJob();
    if (j) { setJob(j); setJd(j.jd); setView("job"); }
  }, []);

  const ats = useMemo(() => (r ? atsCheck(r, stage, view === "job" ? jd : "") : null), [r, stage, jd, view]);
  if (!r || !ats) return <p className="fp-muted" style={{ padding: 24 }}>Loading your resume…</p>;

  // Prints the resume alone from a hidden frame - nothing else on the page can reach the PDF.
  const print = () => {
    const src = document.querySelector(".rb-print .rb-paper");
    if (!src) return;
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(f);
    const d = f.contentDocument!;
    const title = `${r.contact.name || "Resume"} - Resume`.replace(/[<>&]/g, "");
    d.open();
    d.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${PAPER_CSS}@page{size:A4;margin:14mm}.rb-paper{border:0;box-shadow:none;padding:0;max-height:none;overflow:visible}</style></head><body>${src.outerHTML}</body></html>`);
    d.close();
    window.setTimeout(() => { f.contentWindow?.focus(); f.contentWindow?.print(); window.setTimeout(() => f.remove(), 1500); }, 60);
  };
  const download = () => {
    const blob = new Blob([plainText(r, stage)], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(r.contact.name || "resume").replace(/\s+/g, "-")}-resume.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <div className="rb">
      <div className="rb-bar">
        <div>
          <h1>Resume builder</h1>
          <p>{stage === "school" ? "For school students: education, achievements and activities first." : stage === "professional" ? "For working professionals: experience first." : "For college students: education, internships and projects first."} {status === "saving" ? "Saving…" : status === "saved" ? "Saved to your account." : status === "local" ? "Saved on this device." : ""}</p>
        </div>
        <div className="rb-bar-a">
          <button className="fp-btn fp-btn-sm" onClick={download}>Download .txt</button>
          <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={print}><Icon name="save" size={14} stroke={2} /> Download PDF</button>
        </div>
      </div>

      <div className="rb-grid">
        <div className="rb-edit">
          <RoleKitCard r={r} stage={stage} set={set} />

          <Card title="Contact">
            <div className="rb-2">
              {([["name", "Full name"], ["email", "Email"], ["phone", "Phone"], ["city", "City"], ["linkedin", "LinkedIn URL"], ["link", "Portfolio / GitHub URL"]] as const).map(([k, label]) => (
                <Field key={k} label={label}><input className="rb-in" value={r.contact[k]} onChange={(e) => set((x) => ({ ...x, contact: { ...x.contact, [k]: e.target.value } }))} /></Field>
              ))}
            </div>
          </Card>

          <SummaryCard r={r} stage={stage} set={set} />

          {SECTION_ORDER[stage].filter((k) => k !== "summary").map((k) => {
            if (k === "education" || k === "experience" || k === "projects") return <EntryList key={k} kind={k} stage={stage} r={r} set={set} />;
            if (k === "skills") return (
              <Card key={k} title="Skills" hint="One group per line. ATS searches match these words - use the names employers use (e.g. Microsoft Excel, Python).">
                {r.skills.map((g, i) => (
                  <div key={i} className="rb-skill">
                    <input className="rb-in" style={{ width: 150 }} value={g.label} placeholder="Group" onChange={(e) => set((x) => ({ ...x, skills: x.skills.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)) }))} />
                    <input className="rb-in" value={g.items} placeholder="Comma-separated, e.g. Python, SQL, Excel" onChange={(e) => set((x) => ({ ...x, skills: x.skills.map((s, j) => (j === i ? { ...s, items: e.target.value } : s)) }))} />
                    <button className="rb-x" aria-label="Remove group" onClick={() => set((x) => ({ ...x, skills: x.skills.filter((_, j) => j !== i) }))}>×</button>
                  </div>
                ))}
                <button className="rb-add" onClick={() => set((x) => ({ ...x, skills: [...x.skills, { label: "", items: "" }] }))}>+ Add a skill group</button>
              </Card>
            );
            if (k === "certifications") return (
              <Card key={k} title="Certifications">
                {r.certifications.map((c, i) => (
                  <div key={i} className="rb-skill">
                    <input className="rb-in" value={c.name} placeholder="Certificate" onChange={(e) => set((x) => ({ ...x, certifications: x.certifications.map((s, j) => (j === i ? { ...s, name: e.target.value } : s)) }))} />
                    <input className="rb-in" style={{ width: 160 }} value={c.issuer} placeholder="Issued by" onChange={(e) => set((x) => ({ ...x, certifications: x.certifications.map((s, j) => (j === i ? { ...s, issuer: e.target.value } : s)) }))} />
                    <input className="rb-in" style={{ width: 80 }} value={c.year} placeholder="Year" onChange={(e) => set((x) => ({ ...x, certifications: x.certifications.map((s, j) => (j === i ? { ...s, year: e.target.value } : s)) }))} />
                    <button className="rb-x" aria-label="Remove" onClick={() => set((x) => ({ ...x, certifications: x.certifications.filter((_, j) => j !== i) }))}>×</button>
                  </div>
                ))}
                <button className="rb-add" onClick={() => set((x) => ({ ...x, certifications: [...x.certifications, { name: "", issuer: "", year: "" }] }))}>+ Add a certification</button>
              </Card>
            );
            if (k === "achievements" || k === "activities") return (
              <Card key={k} title={SECTION_LABEL[k]} hint={k === "achievements" ? "One per line: awards, ranks, competitions, scholarships - with the level or number." : "One per line: clubs, sports, volunteering, positions you held."}>
                <textarea className="rb-in" rows={4} value={r[k].join("\n")} onChange={(e) => set((x) => ({ ...x, [k]: e.target.value.split("\n") }))} />
              </Card>
            );
            if (k === "languages") return (
              <Card key={k} title="Languages"><input className="rb-in" value={r.languages} placeholder="e.g. English (fluent), Hindi (fluent), Telugu (native)" onChange={(e) => set((x) => ({ ...x, languages: e.target.value }))} /></Card>
            );
            return null;
          })}
        </div>

        <div className="rb-side">
          <div className="rb-tabs" role="tablist">
            <button role="tab" aria-selected={view === "preview"} onClick={() => setView("preview")}>Preview</button>
            <button role="tab" aria-selected={view === "ats"} onClick={() => setView("ats")}>ATS check <b>{ats.score}</b></button>
            <button role="tab" aria-selected={view === "job"} onClick={() => setView("job")}>Match a job</button>
          </div>
          {view === "preview" && <Paper r={r} stage={stage} />}
          {view === "ats" && <AtsPanel ats={ats} />}
          {view === "job" && <JobPanel r={r} stage={stage} jd={jd} setJd={setJd} ats={ats} job={job} />}
        </div>
      </div>
      {/* The copy "Download PDF" prints (see print()). */}
      <div className="rb-print" aria-hidden="true"><Paper r={r} stage={stage} /></div>
      <style dangerouslySetInnerHTML={{ __html: RB_CSS }} />
    </div>
  );
}

function Card({ title, hint, children, action }: { title: string; hint?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rb-card">
      <div className="rb-card-h"><h2>{title}</h2>{action}</div>
      {hint && <p className="rb-hint">{hint}</p>}
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="rb-f"><span>{label}</span>{children}</label>;
}

function Suggest({ text, onUse, onDrop }: { text: string; onUse: () => void; onDrop: () => void }) {
  return (
    <div className="rb-sug">
      <span className="fp-kicker" style={{ border: 0, padding: 0 }}>AI suggestion - check every word is true</span>
      <p>{text}</p>
      <div style={{ display: "flex", gap: 8 }}><button className="fp-btn fp-btn-pri fp-btn-sm" onClick={onUse}>Use this</button><button className="fp-btn fp-btn-sm" onClick={onDrop}>Keep mine</button></div>
    </div>
  );
}

/** Target role + the AI "role kit": skills employers ask for (tap to add the ones you have), what recruiters look for, projects to fill gaps. */
function RoleKitCard({ r, stage, set }: { r: Resume; stage: Stage; set: (fn: (x: Resume) => Resume) => void }) {
  const [busy, setBusy] = useState(false);
  const [kit, setKit] = useState<{ skills: string[]; focus: string[]; projects: string[] } | null>(null);
  const [err, setErr] = useState("");
  const mine = new Set(skillList(r).map((s) => s.toLowerCase()));
  const get = async () => {
    setBusy(true); setErr("");
    try { setKit(await authedPost("/api/resume/ai", { action: "role", target: r.target, stage, skills: skillList(r) })); }
    catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  return (
    <Card title="Target role" hint="The job you're applying for. The AI tailors every suggestion to it."
      action={<button className="rb-ai" disabled={busy || r.target.trim().length < 3} onClick={() => void get()}>{busy ? "Building your kit…" : kit ? "Refresh role kit" : "Get the role kit"}</button>}>
      <input className="rb-in" value={r.target} placeholder="e.g. Data Analyst intern" onChange={(e) => { set((x) => ({ ...x, target: e.target.value })); setKit(null); }} />
      {err && <p className="rb-err" style={{ marginTop: 8 }}>{err}</p>}
      {kit && (
        <div className="rb-kit">
          <span className="fp-kicker" style={{ border: 0, padding: 0 }}>Skills employers ask for - tap the ones you have</span>
          <div className="rb-kit-sk">
            {kit.skills.map((s) => {
              const on = mine.has(s.toLowerCase());
              return <button key={s} className={on ? "is-on" : ""} disabled={on} onClick={() => set((x) => addSkills(x, [s]))}>{on ? "✓ " : "+ "}{s}</button>;
            })}
          </div>
          <span className="fp-kicker" style={{ border: 0, padding: 0 }}>What recruiters look for first</span>
          <ul>{kit.focus.map((f) => <li key={f}>{f}</li>)}</ul>
          <span className="fp-kicker" style={{ border: 0, padding: 0 }}>Projects that would make your case stronger</span>
          <ul>{kit.projects.map((p) => <li key={p}>{p}</li>)}</ul>
          <small className="rb-hint" style={{ display: "block", margin: 0 }}>Add only skills you can show. Missing ones are a plan, not a line on your resume yet.</small>
        </div>
      )}
    </Card>
  );
}

function SummaryCard({ r, stage, set }: { r: Resume; stage: Stage; set: (fn: (x: Resume) => Resume) => void }) {
  const [busy, setBusy] = useState(false);
  const [sug, setSug] = useState("");
  const [err, setErr] = useState("");
  const write = async () => {
    setBusy(true); setErr("");
    try {
      const facts = plainText({ ...r, summary: "" }, stage);
      const d = await authedPost<{ summary: string }>("/api/resume/ai", { action: "summary", facts, target: r.target, stage });
      setSug(d.summary);
    } catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  return (
    <Card title="Summary" hint={'2-3 lines: who you are, your strongest skills, what you\'re looking for. No "I".'} action={<button className="rb-ai" disabled={busy} onClick={() => void write()}>{busy ? "Writing…" : "Write with AI"}</button>}>
      <textarea className="rb-in" rows={3} value={r.summary} onChange={(e) => set((x) => ({ ...x, summary: e.target.value }))} placeholder="e.g. Final-year B.Com student with hands-on GST and reconciliation experience from a CA-firm internship..." />
      {err && <p className="rb-err">{err}</p>}
      {sug && <Suggest text={sug} onUse={() => { set((x) => ({ ...x, summary: sug })); setSug(""); }} onDrop={() => setSug("")} />}
    </Card>
  );
}

const LIST_COPY: Record<ListKey, { title: (s: Stage) => string; t: string; o: string; add: string; hint: string }> = {
  education: { title: () => "Education", t: "Degree / class", o: "College / school", add: "+ Add education", hint: "Most recent first. Add marks, CGPA or percentage if they help." },
  experience: { title: (s) => EXPERIENCE_LABEL[s], t: "Role", o: "Organisation", add: "+ Add experience", hint: "Internships, jobs, freelance work and volunteering count. 2-4 bullets each: what you did and what came of it." },
  projects: { title: () => "Projects", t: "Project name", o: "Tools used / link", add: "+ Add a project", hint: "College, personal or hackathon projects. Say what it does, your part, and a result." },
};

function EntryList({ kind, stage, r, set }: { kind: ListKey; stage: Stage; r: Resume; set: (fn: (x: Resume) => Resume) => void }) {
  const copy = LIST_COPY[kind];
  const list = r[kind];
  const upd = (id: string, patch: Partial<Entry>) => set((x) => ({ ...x, [kind]: x[kind].map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const move = (i: number, d: number) => set((x) => { const a = [...x[kind]]; const [e] = a.splice(i, 1); a.splice(Math.max(0, Math.min(a.length, i + d)), 0, e); return { ...x, [kind]: a }; });
  return (
    <Card title={copy.title(stage)} hint={copy.hint}>
      {list.map((e, i) => <EntryEditor key={e.id} kind={kind} e={e} target={r.target} upd={(p) => upd(e.id, p)}
        remove={() => set((x) => ({ ...x, [kind]: x[kind].filter((y) => y.id !== e.id) }))}
        up={i > 0 ? () => move(i, -1) : undefined} down={i < list.length - 1 ? () => move(i, 1) : undefined} />)}
      <button className="rb-add" onClick={() => set((x) => ({ ...x, [kind]: [...x[kind], blankEntry()] }))}>{copy.add}</button>
    </Card>
  );
}

function EntryEditor({ kind, e, target, upd, remove, up, down }: { kind: ListKey; e: Entry; target: string; upd: (p: Partial<Entry>) => void; remove: () => void; up?: () => void; down?: () => void }) {
  const copy = LIST_COPY[kind];
  const [busy, setBusy] = useState(false);
  const [sug, setSug] = useState<string[] | null>(null);
  const [err, setErr] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const ask = async (body: Record<string, unknown>) => {
    setBusy(true); setErr("");
    try { setSug((await authedPost<{ bullets: string[] }>("/api/resume/ai", { title: e.title, org: e.org, target, ...body })).bullets); }
    catch (x) { setErr(x instanceof Error ? x.message : "That didn't work."); } finally { setBusy(false); }
  };
  const improve = () => ask({ action: "bullets", bullets: e.bullets.filter((b) => b.trim()) });
  const draft = () => ask({ action: "draft", notes });
  return (
    <div className="rb-entry">
      <div className="rb-2">
        <Field label={copy.t}><input className="rb-in" value={e.title} onChange={(x) => upd({ title: x.target.value })} /></Field>
        <Field label={copy.o}><input className="rb-in" value={e.org} onChange={(x) => upd({ org: x.target.value })} /></Field>
        {kind !== "projects" && <Field label="City"><input className="rb-in" value={e.place} onChange={(x) => upd({ place: x.target.value })} /></Field>}
        {kind === "education" && <Field label="Marks / CGPA"><input className="rb-in" value={e.score ?? ""} placeholder="e.g. CGPA 8.4/10" onChange={(x) => upd({ score: x.target.value })} /></Field>}
        <Field label="Start"><input className="rb-in" value={e.start} placeholder="e.g. Jun 2025" onChange={(x) => upd({ start: x.target.value })} /></Field>
        <Field label="End"><input className="rb-in" value={e.end} placeholder="e.g. Aug 2025 or Present" onChange={(x) => upd({ end: x.target.value })} /></Field>
      </div>
      <Field label={kind === "education" ? "Highlights (optional, one per line)" : "Bullet points (one per line)"}>
        <textarea className="rb-in" rows={kind === "education" ? 2 : 4} value={e.bullets.join("\n")} placeholder={kind === "education" ? "e.g. Ranked 3rd in the department" : "e.g. Built a dashboard tracking weekly sales for 15 stores"} onChange={(x) => upd({ bullets: x.target.value.split("\n") })} />
      </Field>
      {notesOpen && (
        <div className="rb-notes">
          <Field label="In your own words: what did you do, with what, and what came of it?">
            <textarea className="rb-in" rows={3} value={notes} onChange={(x) => setNotes(x.target.value)} placeholder="e.g. helped the college placement cell clean student data in Excel, made a weekly report for the placement officer, about 600 students" />
          </Field>
          <button className="fp-btn fp-btn-pri fp-btn-sm" disabled={busy || notes.trim().length < 20} onClick={() => void draft()}>{busy ? "Writing…" : "Write the bullets"}</button>
        </div>
      )}
      {err && <p className="rb-err">{err}</p>}
      {sug && <Suggest text={sug.map((b) => `• ${b}`).join("\n")} onUse={() => { upd({ bullets: sug }); setSug(null); setNotesOpen(false); }} onDrop={() => setSug(null)} />}
      <div className="rb-entry-a">
        {kind !== "education" && (e.bullets.some((b) => b.trim())
          ? <button className="rb-ai" disabled={busy} onClick={() => void improve()}>{busy ? "Improving…" : "Improve bullets with AI"}</button>
          : <button className="rb-ai" onClick={() => setNotesOpen(!notesOpen)}>{notesOpen ? "Close" : "Write with AI from a description"}</button>)}
        <span style={{ flex: 1 }} />
        {up && <button className="rb-mini" onClick={up} aria-label="Move up">↑</button>}
        {down && <button className="rb-mini" onClick={down} aria-label="Move down">↓</button>}
        <button className="rb-mini" onClick={remove}>Remove</button>
      </div>
    </div>
  );
}

/** The resume itself - one column, standard headings, plain text: what an ATS parses cleanly. */
function Paper({ r, stage }: { r: Resume; stage: Stage }) {
  const c = r.contact;
  const ent = (e: Entry) => (
    <div key={e.id} className="rp-ent">
      <div className="rp-row"><b>{[e.title, e.org].filter(Boolean).join(", ")}</b><span>{[e.place, dateRange(e)].filter(Boolean).join(" | ")}</span></div>
      {e.score && <div className="rp-sub">{e.score}</div>}
      {e.bullets.some((b) => b.trim()) && <ul>{e.bullets.filter((b) => b.trim()).map((b, i) => <li key={i}>{b.trim()}</li>)}</ul>}
    </div>
  );
  const filled = (e: Entry) => !!(e.title.trim() || e.org.trim() || e.bullets.some((b) => b.trim()));
  return (
    <article className="rb-paper">
      <h1>{c.name || "Your Name"}</h1>
      <p className="rp-contact">{[c.city, c.phone, c.email].filter(Boolean).join(" | ")}</p>
      {(c.linkedin || c.link) && <p className="rp-contact">{[c.linkedin, c.link].filter(Boolean).join(" | ")}</p>}
      {SECTION_ORDER[stage].filter((k) => hasSection(r, k)).map((k) => (
        <section key={k}>
          <h2>{k === "experience" ? EXPERIENCE_LABEL[stage] : SECTION_LABEL[k]}</h2>
          {k === "summary" && <p>{r.summary.trim()}</p>}
          {(k === "education" || k === "experience" || k === "projects") && r[k].filter(filled).map(ent)}
          {k === "skills" && r.skills.filter((g) => g.items.trim()).map((g, i) => <p key={i} className="rp-line"><b>{g.label ? `${g.label}: ` : ""}</b>{g.items.trim()}</p>)}
          {k === "certifications" && <ul>{r.certifications.filter((x) => x.name.trim()).map((x, i) => <li key={i}>{[x.name, x.issuer, x.year].filter(Boolean).join(", ")}</li>)}</ul>}
          {(k === "achievements" || k === "activities") && <ul>{r[k].filter((x) => x.trim()).map((x, i) => <li key={i}>{x.trim()}</li>)}</ul>}
          {k === "languages" && <p>{r.languages.trim()}</p>}
        </section>
      ))}
    </article>
  );
}

function AtsPanel({ ats }: { ats: ReturnType<typeof atsCheck> }) {
  const order = { fail: 0, warn: 1, pass: 2 } as const;
  return (
    <div className="rb-ats">
      <div className="rb-score"><b>{ats.score}</b><span>/100<br /><small>{ats.score >= 85 ? "Ready to send" : ats.score >= 65 ? "Nearly there" : "Needs work"}</small></span></div>
      <p className="rb-hint" style={{ margin: "0 0 12px" }}>What applicant-tracking systems and recruiters trip over. Fix the top items first.</p>
      <ul>
        {[...ats.checks].sort((a, b) => order[a.state] - order[b.state]).map((c) => (
          <li key={c.id} className={`is-${c.state}`}>
            <i aria-hidden="true">{c.state === "pass" ? "✓" : c.state === "warn" ? "!" : "×"}</i>
            <span><b>{c.label}</b><small>{c.detail}</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JobPanel({ r, stage, jd, setJd, ats, job }: { r: Resume; stage: Stage; jd: string; setJd: (s: string) => void; ats: ReturnType<typeof atsCheck>; job: JobHandoff | null }) {
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<{ missing: string[]; suggestions: string[] } | null>(null);
  const [err, setErr] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);
  const tailor = async () => {
    setBusy(true); setErr("");
    try { setAi(await authedPost("/api/resume/ai", { action: "tailor", resume: plainText(r, stage), jd, target: r.target })); }
    catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  return (
    <div className="rb-ats">
      {job && <p style={{ margin: "0 0 8px", fontSize: 14 }}>Tailoring for <b>{job.title}</b> at <b>{job.company}</b></p>}
      <p className="rb-hint" style={{ margin: "0 0 8px" }}>Paste a job or internship post - or pick one from <a href="/account/resume/jobs" className="fp-link" style={{ fontSize: 12.5 }}>Jobs for you</a>. You&apos;ll see which of its key terms your resume already has - add the missing ones you genuinely have.</p>
      <textarea ref={box} className="rb-in" rows={7} value={jd} onChange={(e) => { setJd(e.target.value); setAi(null); }} placeholder="Paste the job description here" />
      {ats.keywords && (
        <>
          <div className="rb-kw"><span className="fp-kicker" style={{ border: 0, padding: 0 }}>In your resume ({ats.keywords.matched.length})</span><div>{ats.keywords.matched.map((k) => <em key={k} className="is-in">{k}</em>)}{!ats.keywords.matched.length && <small>None yet</small>}</div></div>
          <div className="rb-kw"><span className="fp-kicker" style={{ border: 0, padding: 0 }}>Missing ({ats.keywords.missing.length})</span><div>{ats.keywords.missing.map((k) => <em key={k}>{k}</em>)}</div></div>
          <button className="fp-btn fp-btn-sm" style={{ marginTop: 10 }} disabled={busy || jd.trim().length < 80} onClick={() => void tailor()}>{busy ? "Reading the post…" : "Get AI suggestions to tailor it"}</button>
        </>
      )}
      {err && <p className="rb-err">{err}</p>}
      {ai && (
        <div className="rb-sug" style={{ marginTop: 12 }}>
          <span className="fp-kicker" style={{ border: 0, padding: 0 }}>How to tailor it - only add what's true</span>
          {ai.missing.length > 0 && <p><b>Missing from your resume:</b> {ai.missing.join(", ")}</p>}
          <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>{ai.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
      {jd.trim().length >= 80 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0ede8" }}>
          <span className="fp-kicker" style={{ border: 0, padding: 0 }}>Cover letter</span>
          <CoverLetter key={`${job?.title ?? ""}|${job?.company ?? ""}`} r={r} stage={stage} title={job?.title ?? ""} company={job?.company ?? ""} jd={jd} />
        </div>
      )}
    </div>
  );
}

/** The resume page itself - also written into the print frame, so screen and PDF match. */
const PAPER_CSS = `
.rb-paper{background:#fff;padding:36px 40px;font-family:Arial,Helvetica,sans-serif;color:#111;font-size:12.5px;line-height:1.45}
.rb-paper h1{margin:0;font-size:22px;font-weight:700;text-align:center;letter-spacing:.01em}
.rp-contact{margin:3px 0 0;text-align:center;font-size:11.5px;color:#333}
.rb-paper h2{margin:16px 0 6px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid #999;padding-bottom:2px}
.rb-paper p{margin:0 0 4px}
.rb-paper ul{margin:3px 0 0;padding-left:16px}
.rb-paper li{margin:1px 0}
.rp-ent{margin-bottom:8px}
.rp-row{display:flex;justify-content:space-between;gap:12px}
.rp-row span{flex:none;color:#333;font-size:11.5px}
.rp-sub{font-size:11.5px;color:#333}
.rp-line b{font-weight:700}
`;

const RB_CSS = `
.jr-wide{max-width:1320px}
.rb-bar{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin:8px 0 16px}
.rb-bar h1{margin:0;font-size:22px;font-weight:600}
.rb-bar p{margin:4px 0 0;font-size:13.5px;color:var(--ink2)}
.rb-bar-a{display:flex;gap:8px}
.rb-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:18px;align-items:start}
.rb-edit{display:grid;gap:12px;min-width:0}
.rb-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}
.rb-card-h{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rb-card h2{margin:0;font-size:15px;font-weight:600}
.rb-hint{margin:4px 0 10px;font-size:12.5px;line-height:1.5;color:var(--mute)}
.rb-card-h + .rb-in,.rb-card-h + .rb-2{margin-top:10px}
.rb-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px}
.rb-f{display:flex;flex-direction:column;gap:4px;min-width:0;font-size:12.5px;font-weight:600;color:var(--ink2)}
.rb-in{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:6px;padding:8px 10px;font:inherit;font-size:13.5px;font-weight:400;color:var(--ink);background:#fff;line-height:1.45}
textarea.rb-in{resize:vertical}
.rb-in:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.rb-entry{border:1px solid var(--line);border-radius:7px;padding:12px;margin-bottom:10px;display:grid;gap:10px;background:#fcfcfb}
.rb-entry-a{display:flex;align-items:center;gap:6px}
.rb-skill{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.rb-add{border:1px dashed var(--line2);background:#fff;border-radius:6px;padding:8px 12px;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;width:100%}
.rb-add:hover{border-color:var(--accent);color:var(--accent)}
.rb-x,.rb-mini{border:1px solid var(--line);background:#fff;border-radius:6px;padding:4px 9px;font:inherit;font-size:12.5px;color:var(--ink2);cursor:pointer}
.rb-x{font-size:16px;line-height:1;padding:5px 10px}
.rb-ai{border:1px solid color-mix(in srgb,var(--accent) 35%,#fff);background:color-mix(in srgb,var(--accent) 6%,#fff);color:var(--accent);border-radius:6px;padding:5px 10px;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.rb-ai:disabled{opacity:.5;cursor:default}
.rb-kit{display:grid;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #f0ede8}
.rb-kit ul{margin:0 0 4px;padding-left:18px;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.rb-kit-sk{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px}
.rb-kit-sk button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12.5px;color:var(--ink2);cursor:pointer}
.rb-kit-sk button:hover{border-color:var(--accent);color:var(--accent)}
.rb-kit-sk button.is-on{background:#ecfdf3;border-color:#bbf7d0;color:#166534;cursor:default}
.rb-notes{display:grid;gap:8px;justify-items:start;padding:10px;border:1px dashed var(--line);border-radius:6px;background:#fff}
.rb-notes .rb-f{width:100%}
.rb-sug{border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;padding:10px 12px;background:#fff;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.rb-sug p{margin:4px 0 8px;white-space:pre-line}
.rb-err{margin:0;font-size:13px;color:#b42318}
.rb-side{position:sticky;top:120px;min-width:0}
.rb-tabs{display:flex;gap:4px;margin-bottom:10px}
.rb-tabs button{border:1px solid var(--line);background:#fff;border-radius:6px;padding:7px 12px;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer}
.rb-tabs button[aria-selected="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.rb-tabs b{margin-left:4px;font-weight:700}
${PAPER_CSS}
.rb-paper{border:1px solid var(--line);box-shadow:0 1px 3px rgba(0,0,0,.05);max-height:calc(100vh - 190px);overflow:auto}
.rb-print{display:none}
.rb-ats{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}
.rb-score{display:flex;align-items:baseline;gap:6px;margin-bottom:6px}
.rb-score b{font-size:40px;font-weight:700;line-height:1;color:var(--ink)}
.rb-score span{font-size:13px;color:var(--mute);line-height:1.3}
.rb-score small{font-size:13px;font-weight:600;color:var(--ink2)}
.rb-ats ul{list-style:none;margin:0;padding:0;display:grid}
.rb-ats li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px;padding:9px 0;border-top:1px solid #f0ede8}
.rb-ats li i{font-style:normal;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;font-size:12px;font-weight:700;background:#f4f4f5;color:#71717a}
.rb-ats li.is-pass i{background:#ecfdf3;color:#166534}
.rb-ats li.is-warn i{background:#fff7ed;color:#9a3412}
.rb-ats li.is-fail i{background:#fef2f2;color:#b42318}
.rb-ats li b{display:block;font-size:13.5px;font-weight:600}
.rb-ats li small{display:block;font-size:12.5px;line-height:1.5;color:var(--ink2)}
.rb-kw{margin-top:12px}
.rb-kw div{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}
.rb-kw em{font-style:normal;font-size:12.5px;padding:2px 8px;border-radius:5px;background:#f4f4f5;color:var(--ink2)}
.rb-kw em.is-in{background:#ecfdf3;color:#166534}
@media (max-width:1000px){.rb-grid{grid-template-columns:minmax(0,1fr)}.rb-side{position:static}.rb-paper{max-height:none}}
@media (max-width:560px){.rb-2{grid-template-columns:minmax(0,1fr)}.rb-paper{padding:20px 18px}.rb-skill{flex-wrap:wrap}}
`;
