"use client";
/**
 * The resume builder. Left: the content, section by section, in print order
 * (move, hide or add sections; custom sections; AI help; line-by-line notes
 * under every bullet list; import from OneGrasp). Right: the live resume in
 * the chosen template (design bar: template, accent, size, margins, paper),
 * the ATS check, and "Match a job". Saved by useResume(). "Download PDF"
 * makes a real, text-based PDF in the browser (ResumePdf).
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { pathCareers } from "@/lib/jobs/student";
import { CERT_COURSES, certCode } from "@/lib/certificates/catalog";
import {
  ACCENTS, ALL_SECTIONS, EXPERIENCE_LABEL, SECTION_LABEL, SECTION_ORDER, blankEntry, newId, plainText, sectionTitle, skillList,
  type Entry, type Resume, type SectionKey, type Stage,
} from "@/lib/resume/resume";
import { atsReport, bulletIssues, parsedView } from "@/lib/resume/ats";
import { TEMPLATES, documentModel } from "@/lib/resume/templates";
import { authedPost } from "./JobReadyShell";
import { addSkills, takeJob, useResume, type JobHandoff } from "./useResume";
import { CoverLetter } from "./CoverLetter";
import { ResumeSheet } from "./ResumeSheet";
import { AtsPanel } from "./AtsPanel";

type ListKey = "education" | "experience" | "projects";
type SetR = (fn: (x: Resume) => Resume) => void;

/** Every section in the editor's order: the student's order, then the stage's, then any left. */
function editorOrder(r: Resume, stage: Stage): SectionKey[] {
  const base = r.sectionOrder?.length ? [...r.sectionOrder.filter((k) => ALL_SECTIONS.includes(k)), ...SECTION_ORDER[stage]] : [...SECTION_ORDER[stage]];
  return [...new Set(base)];
}

const fileName = (r: Resume, ext: string) => `${(r.contact.name || "Resume").trim().replace(/[^\w]+/g, "_")}_Resume.${ext}`;
function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

export function ResumeBuilder() {
  const { r, set, stage, status } = useResume();
  const [view, setView] = useState<"preview" | "ats" | "job">("preview");
  const [jd, setJd] = useState("");
  const [job, setJob] = useState<JobHandoff | null>(null);
  const [pages, setPages] = useState(1);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfErr, setPdfErr] = useState("");

  // A job sent from "Jobs for you": open "Match a job" with its description.
  useEffect(() => {
    const j = takeJob();
    if (j) { setJob(j); setJd(j.jd); setView("job"); }
  }, []);

  const model = useMemo(() => (r ? documentModel(r, stage) : null), [r, stage]);
  const report = useMemo(() => (r ? atsReport(r, stage, { jd, jobTitle: job?.title, pages }) : null), [r, stage, jd, job?.title, pages]);
  const parsed = useMemo(() => (r ? parsedView(r, stage) : null), [r, stage]);
  const onPages = useCallback((n: number) => setPages(n), []);
  if (!r || !model || !report || !parsed) return <p className="fp-muted" style={{ padding: 24 }}>Loading your resume…</p>;

  const downloadPdf = async () => {
    setPdfBusy(true); setPdfErr("");
    try {
      const { resumePdf } = await import("./ResumePdf");
      const { blob } = await resumePdf(model, r.design);
      save(blob, fileName(r, "pdf"));
    } catch (e) {
      console.error("[resume] pdf", e);
      setPdfErr("Couldn't make the PDF - please try again.");
    } finally { setPdfBusy(false); }
  };
  const order = editorOrder(r, stage);
  const unused = ALL_SECTIONS.filter((k) => !order.includes(k));
  const move = (k: SectionKey, d: -1 | 1) => set((x) => {
    const o = editorOrder(x, stage);
    const i = o.indexOf(k), j = i + d;
    if (i < 0 || j < 0 || j >= o.length) return x;
    [o[i], o[j]] = [o[j], o[i]];
    return { ...x, sectionOrder: o };
  });
  const toggle = (k: SectionKey) => set((x) => ({ ...x, hidden: x.hidden.includes(k) ? x.hidden.filter((h) => h !== k) : [...x.hidden, k] }));
  const controls = (k: SectionKey, i: number) => (
    <span className="rb-ctl">
      <button aria-label={`Move ${SECTION_LABEL[k]} up`} disabled={i === 0} onClick={() => move(k, -1)}>↑</button>
      <button aria-label={`Move ${SECTION_LABEL[k]} down`} disabled={i === order.length - 1} onClick={() => move(k, 1)}>↓</button>
      <button onClick={() => toggle(k)}>{r.hidden.includes(k) ? "Show" : "Hide"}</button>
    </span>
  );

  return (
    <div className="rb">
      <div className="rb-bar">
        <div>
          <h1>Resume builder</h1>
          <p>{stage === "school" ? "For school students: education, achievements and activities first." : stage === "professional" ? "For working professionals: experience first." : "For college students: education, internships and projects first."} {status === "saving" ? "Saving…" : status === "saved" ? "Saved to your account." : status === "local" ? "Saved on this device." : ""}</p>
        </div>
        <div className="rb-bar-a">
          <span className={`rb-pages${pages > (stage === "professional" ? 2 : 1) ? " is-over" : ""}`}>{pages} page{pages === 1 ? "" : "s"}</span>
          <button className="fp-btn fp-btn-sm" onClick={() => save(new Blob([plainText(r, stage)], { type: "text/plain;charset=utf-8" }), fileName(r, "txt"))}>Plain text</button>
          <button className="fp-btn fp-btn-pri fp-btn-sm" disabled={pdfBusy} onClick={() => void downloadPdf()}><Icon name="save" size={14} stroke={2} /> {pdfBusy ? "Making PDF…" : "Download PDF"}</button>
        </div>
      </div>
      {pdfErr && <p className="rb-err" style={{ marginBottom: 10 }}>{pdfErr}</p>}

      <div className="rb-grid">
        <div className="rb-edit">
          <ImportCard r={r} set={set} />
          <RoleKitCard r={r} stage={stage} set={set} />

          <Card title="Contact" hint="Your name and contact line sit at the top - where an ATS looks for them.">
            <div className="rb-2">
              {([["name", "Full name"], ["email", "Email"], ["phone", "Phone (with +91)"], ["city", "City, State"], ["linkedin", "LinkedIn URL"], ["link", "Portfolio / GitHub URL"]] as const).map(([k, label]) => (
                <Field key={k} label={label}><input className="rb-in" value={r.contact[k]} onChange={(e) => set((x) => ({ ...x, contact: { ...x.contact, [k]: e.target.value } }))} /></Field>
              ))}
            </div>
          </Card>

          {order.map((k, i) => {
            const hidden = r.hidden.includes(k);
            const ctl = controls(k, i);
            if (hidden) return <Card key={k} title={sectionTitle(k, stage)} action={ctl} muted><p className="rb-hint" style={{ margin: "6px 0 0" }}>Hidden - it won&apos;t appear on your resume.</p></Card>;
            if (k === "summary") return <SummaryCard key={k} r={r} stage={stage} set={set} action={ctl} />;
            if (k === "education" || k === "experience" || k === "projects") return <EntryList key={k} kind={k} stage={stage} r={r} set={set} action={ctl} />;
            if (k === "skills") return (
              <Card key={k} title="Skills" action={ctl} hint="A group per line. ATS searches match these words - name tools and software the way job posts do (Microsoft Excel, Python, Tally ERP).">
                {r.skills.map((g, j) => (
                  <div key={j} className="rb-skill">
                    <input className="rb-in" style={{ width: 150 }} value={g.label} placeholder="Group" onChange={(e) => set((x) => ({ ...x, skills: x.skills.map((s, n) => (n === j ? { ...s, label: e.target.value } : s)) }))} />
                    <input className="rb-in" value={g.items} placeholder="Comma-separated, e.g. Python, SQL, Excel" onChange={(e) => set((x) => ({ ...x, skills: x.skills.map((s, n) => (n === j ? { ...s, items: e.target.value } : s)) }))} />
                    <button className="rb-x" aria-label="Remove group" onClick={() => set((x) => ({ ...x, skills: x.skills.filter((_, n) => n !== j) }))}>×</button>
                  </div>
                ))}
                <button className="rb-add" onClick={() => set((x) => ({ ...x, skills: [...x.skills, { label: "", items: "" }] }))}>+ Add a skill group</button>
              </Card>
            );
            if (k === "certifications") return (
              <Card key={k} title="Certifications" action={ctl} hint="Name, who issued it, year. Your OneGrasp certificates can be imported at the top.">
                {r.certifications.map((c, j) => (
                  <div key={j} className="rb-skill">
                    <input className="rb-in" value={c.name} placeholder="Certificate" onChange={(e) => set((x) => ({ ...x, certifications: x.certifications.map((s, n) => (n === j ? { ...s, name: e.target.value } : s)) }))} />
                    <input className="rb-in" style={{ width: 150 }} value={c.issuer} placeholder="Issued by" onChange={(e) => set((x) => ({ ...x, certifications: x.certifications.map((s, n) => (n === j ? { ...s, issuer: e.target.value } : s)) }))} />
                    <input className="rb-in" style={{ width: 76 }} value={c.year} placeholder="Year" onChange={(e) => set((x) => ({ ...x, certifications: x.certifications.map((s, n) => (n === j ? { ...s, year: e.target.value } : s)) }))} />
                    <button className="rb-x" aria-label="Remove" onClick={() => set((x) => ({ ...x, certifications: x.certifications.filter((_, n) => n !== j) }))}>×</button>
                  </div>
                ))}
                <button className="rb-add" onClick={() => set((x) => ({ ...x, certifications: [...x.certifications, { name: "", issuer: "", year: "" }] }))}>+ Add a certification</button>
              </Card>
            );
            if (k === "achievements" || k === "activities") return (
              <Card key={k} title={SECTION_LABEL[k]} action={ctl} hint={k === "achievements" ? "One per line: awards, ranks, competitions, scholarships - with the level and a number (e.g. \"1st of 40 teams\")." : "One per line: clubs, sports, volunteering, positions you held - and what you did there."}>
                <textarea className="rb-in" rows={4} value={r[k].join("\n")} onChange={(e) => set((x) => ({ ...x, [k]: e.target.value.split("\n") }))} />
                <BulletHints lines={r[k]} opts={{ ongoing: true }} />
              </Card>
            );
            if (k === "languages") return (
              <Card key={k} title="Languages" action={ctl}><input className="rb-in" value={r.languages} placeholder="e.g. English (fluent), Hindi (fluent), Telugu (native)" onChange={(e) => set((x) => ({ ...x, languages: e.target.value }))} /></Card>
            );
            return null;
          })}

          <CustomSections r={r} set={set} />
          {unused.length > 0 && (
            <div className="rb-unused">
              <span>Add a section:</span>
              {unused.map((k) => <button key={k} onClick={() => set((x) => ({ ...x, sectionOrder: [...editorOrder(x, stage), k] }))}>+ {sectionTitle(k, stage)}</button>)}
            </div>
          )}
        </div>

        <div className="rb-side">
          <div className="rb-tabs" role="tablist">
            <button role="tab" aria-selected={view === "preview"} onClick={() => setView("preview")}>Preview</button>
            <button role="tab" aria-selected={view === "ats"} onClick={() => setView("ats")}>ATS check <b className={report.score >= 90 ? "is-good" : report.score >= 75 ? "is-ok" : "is-bad"}>{report.score}</b></button>
            <button role="tab" aria-selected={view === "job"} onClick={() => setView("job")}>Match a job{report.keywords ? <b>{report.areas.find((a) => a.area === "match")?.score ?? ""}</b> : null}</button>
          </div>
          {view === "preview" && (
            <>
              <DesignBar r={r} set={set} />
              <div className="rb-preview"><ResumeSheet model={model} design={r.design} onPages={onPages} /></div>
            </>
          )}
          {view === "ats" && <AtsPanel report={report} parsed={parsed} />}
          {view === "job" && <JobPanel r={r} stage={stage} jd={jd} setJd={setJd} report={report} job={job} />}
          {view !== "preview" && <div style={{ position: "absolute", left: -99999, width: 800 }} aria-hidden="true"><ResumeSheet model={model} design={r.design} onPages={onPages} fixedScale={1} /></div>}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: RB_CSS }} />
    </div>
  );
}

/* ---------------- design bar ---------------- */

function DesignBar({ r, set }: { r: Resume; set: SetR }) {
  const d = r.design;
  const upd = (p: Partial<Resume["design"]>) => set((x) => ({ ...x, design: { ...x.design, ...p } }));
  return (
    <div className="rb-design">
      <div className="rb-tpl">
        {TEMPLATES.map((t) => (
          <button key={t.id} className={d.template === t.id ? "on" : ""} onClick={() => upd({ template: t.id })} title={t.text}>
            <span className={`rb-tpl-ic is-${t.id}`} aria-hidden="true"><i /><i /><i /><i /></span>
            {t.name}
          </button>
        ))}
      </div>
      <div className="rb-opts">
        <span className="rb-sw" role="radiogroup" aria-label="Accent colour">
          {ACCENTS.map((a) => <button key={a.id} role="radio" aria-checked={d.accent === a.id} aria-label={a.name} title={a.name} style={{ background: a.id }} onClick={() => upd({ accent: a.id })} />)}
        </span>
        <Seg label="Text" value={d.size} options={[["s", "S"], ["m", "M"], ["l", "L"]]} onChange={(v) => upd({ size: v as Resume["design"]["size"] })} />
        <Seg label="Margins" value={d.margins} options={[["narrow", "Narrow"], ["normal", "Normal"]]} onChange={(v) => upd({ margins: v as Resume["design"]["margins"] })} />
        <Seg label="Paper" value={d.paper} options={[["A4", "A4"], ["Letter", "Letter"]]} onChange={(v) => upd({ paper: v as Resume["design"]["paper"] })} />
      </div>
      <p className="rb-hint" style={{ margin: "6px 0 0" }}>{TEMPLATES.find((t) => t.id === d.template)?.text} Every template is one column with standard headings, so applicant-tracking systems read it.</p>
    </div>
  );
}

function Seg({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <span className="rb-seg" role="radiogroup" aria-label={label}>
      <small>{label}</small>
      {options.map(([v, l]) => <button key={v} role="radio" aria-checked={value === v} className={value === v ? "on" : ""} onClick={() => onChange(v)}>{l}</button>)}
    </span>
  );
}

/* ---------------- cards ---------------- */

function Card({ title, hint, children, action, muted }: { title: string; hint?: string; children: ReactNode; action?: ReactNode; muted?: boolean }) {
  return (
    <section className={`rb-card${muted ? " is-muted" : ""}`}>
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

/** Line-by-line notes under a bullet list (the first issue per line, up to five lines). */
function BulletHints({ lines, opts }: { lines: string[]; opts: { ongoing?: boolean; wantNumber?: boolean } }) {
  const notes = lines.map((l, i) => ({ n: i + 1, l: l.trim(), issue: bulletIssues(l, opts)[0] })).filter((x) => x.l && x.issue);
  if (!notes.length) return null;
  return (
    <ul className="rb-hints">
      {notes.slice(0, 5).map((x) => <li key={x.n}><b>Line {x.n}:</b> {x.issue}</li>)}
      {notes.length > 5 && <li>…and {notes.length - 5} more - see the ATS check.</li>}
    </ul>
  );
}

/** OneGrasp's own: verified course certificates and the strengths the assessment found. */
function ImportCard({ r, set }: { r: Resume; set: SetR }) {
  const { profile } = useAuth();
  if (!profile) return null;
  const have = new Set(r.certifications.map((c) => c.name.toLowerCase()));
  const certs = Object.entries(profile.certificates ?? {}).map(([key, v]) => {
    const course = CERT_COURSES.find((c) => c.key === key);
    return course ? { name: `${course.title} Course Certificate (${certCode(v.id)})`, issuer: "OneGrasp", year: String(new Date(v.issuedAt).getFullYear()) } : null;
  }).filter((c): c is { name: string; issuer: string; year: string } => !!c && !have.has(c.name.toLowerCase()));
  const mine = new Set(skillList(r).map((s) => s.toLowerCase()));
  const strengths = [...new Set((profile.latestAssessment?.topStrengths ?? []).map((s) => (s.subTraitName || s.parameterName || "").trim()).filter(Boolean))].filter((s) => !mine.has(s.toLowerCase())).slice(0, 6);
  if (!certs.length && !strengths.length) return null;
  const addSoft = (s: string) => set((x) => {
    const i = x.skills.findIndex((g) => /soft|working|personal/i.test(g.label));
    if (i < 0) return addSkills(x, [s]);
    const groups = [...x.skills];
    groups[i] = { ...groups[i], items: [groups[i].items.trim(), s].filter(Boolean).join(", ") };
    return { ...x, skills: groups };
  });
  return (
    <section className="rb-card rb-import">
      <div className="rb-card-h"><h2>From your OneGrasp profile</h2></div>
      {certs.length > 0 && (
        <div className="rb-imp-row">
          <p>{certs.length} verified OneGrasp certificate{certs.length === 1 ? "" : "s"} - each has a code recruiters can check.</p>
          <button className="fp-btn fp-btn-sm" onClick={() => set((x) => ({ ...x, certifications: [...x.certifications.filter((c) => c.name.trim()), ...certs] }))}>Add to Certifications</button>
        </div>
      )}
      {strengths.length > 0 && (
        <div className="rb-imp-row">
          <p>Strengths your assessment found - add the ones you can back with an example:</p>
          <div className="rb-kit-sk">{strengths.map((s) => <button key={s} onClick={() => addSoft(s)}>+ {s}</button>)}</div>
        </div>
      )}
    </section>
  );
}

/** Target role + the AI "role kit": skills employers ask for (tap to add the ones you have), what recruiters look for, projects to fill gaps. */
function RoleKitCard({ r, stage, set }: { r: Resume; stage: Stage; set: SetR }) {
  const { profile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [kit, setKit] = useState<{ skills: string[]; focus: string[]; projects: string[] } | null>(null);
  const [err, setErr] = useState("");
  const mine = new Set(skillList(r).map((s) => s.toLowerCase()));
  const ideas = pathCareers(profile).filter((c) => c.toLowerCase() !== r.target.trim().toLowerCase()).slice(0, 4);
  const get = async () => {
    setBusy(true); setErr("");
    try { setKit(await authedPost("/api/resume/ai", { action: "role", target: r.target, stage, skills: skillList(r) })); }
    catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  return (
    <Card title="Target role" hint="The job you're applying for. The ATS check, the AI and Jobs for you all tailor to it."
      action={<button className="rb-ai" disabled={busy || r.target.trim().length < 3} onClick={() => void get()}>{busy ? "Building your kit…" : kit ? "Refresh role kit" : "Get the role kit"}</button>}>
      <input className="rb-in" value={r.target} placeholder="e.g. Data Analyst intern" onChange={(e) => { set((x) => ({ ...x, target: e.target.value })); setKit(null); }} />
      {ideas.length > 0 && (
        <div className="rb-ideas"><small>From your assessment:</small>{ideas.map((c) => <button key={c} onClick={() => { set((x) => ({ ...x, target: c })); setKit(null); }}>{c}</button>)}</div>
      )}
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

function SummaryCard({ r, stage, set, action }: { r: Resume; stage: Stage; set: SetR; action: ReactNode }) {
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
  const words = r.summary.trim().split(/\s+/).filter(Boolean).length;
  return (
    <Card title="Summary" action={<span className="rb-ctl-wrap"><button className="rb-ai" disabled={busy} onClick={() => void write()}>{busy ? "Writing…" : "Write with AI"}</button>{action}</span>} hint={'2-3 lines (25-80 words): who you are, your strongest skills with proof, the role you want. No "I".'}>
      <textarea className="rb-in" rows={3} value={r.summary} onChange={(e) => set((x) => ({ ...x, summary: e.target.value }))} placeholder="e.g. Final-year B.Com student with hands-on GST and reconciliation experience from a CA-firm internship..." />
      <small className={`rb-count${words && (words < 25 || words > 80) ? " is-off" : ""}`}>{words} words</small>
      {err && <p className="rb-err">{err}</p>}
      {sug && <Suggest text={sug} onUse={() => { set((x) => ({ ...x, summary: sug })); setSug(""); }} onDrop={() => setSug("")} />}
    </Card>
  );
}

const LIST_COPY: Record<ListKey, { title: (s: Stage) => string; t: string; o: string; add: string; hint: string }> = {
  education: { title: () => "Education", t: "Degree / class", o: "College / school", add: "+ Add education", hint: "Most recent first. Add your score if it helps (CGPA 8.4/10, 92%)." },
  experience: { title: (s) => EXPERIENCE_LABEL[s], t: "Role", o: "Organisation", add: "+ Add experience", hint: "Most recent first. Internships, jobs, freelance work and volunteering count. 2-4 bullets each: what you did and what came of it." },
  projects: { title: () => "Projects", t: "Project name", o: "Tools used / link", add: "+ Add a project", hint: "College, personal or hackathon projects. Say what it does, your part, the tools, and a result." },
};

function EntryList({ kind, stage, r, set, action }: { kind: ListKey; stage: Stage; r: Resume; set: SetR; action: ReactNode }) {
  const copy = LIST_COPY[kind];
  const list = r[kind];
  const upd = (id: string, patch: Partial<Entry>) => set((x) => ({ ...x, [kind]: x[kind].map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const move = (i: number, d: number) => set((x) => { const a = [...x[kind]]; const [e] = a.splice(i, 1); a.splice(Math.max(0, Math.min(a.length, i + d)), 0, e); return { ...x, [kind]: a }; });
  return (
    <Card title={copy.title(stage)} hint={copy.hint} action={action}>
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
  const current = /^(present|current|now|ongoing)$/i.test(e.end.trim()) || !e.end.trim();
  return (
    <div className="rb-entry">
      <div className="rb-2">
        <Field label={copy.t}><input className="rb-in" value={e.title} onChange={(x) => upd({ title: x.target.value })} /></Field>
        <Field label={copy.o}><input className="rb-in" value={e.org} onChange={(x) => upd({ org: x.target.value })} /></Field>
        {kind !== "projects" && <Field label="City"><input className="rb-in" value={e.place} onChange={(x) => upd({ place: x.target.value })} /></Field>}
        {kind === "education" && <Field label="Score"><input className="rb-in" value={e.score ?? ""} placeholder="e.g. CGPA 8.4/10" onChange={(x) => upd({ score: x.target.value })} /></Field>}
        <Field label="Start"><input className="rb-in" value={e.start} placeholder="e.g. Jun 2025" onChange={(x) => upd({ start: x.target.value })} /></Field>
        <Field label="End"><input className="rb-in" value={e.end} placeholder="e.g. Aug 2025 or Present" onChange={(x) => upd({ end: x.target.value })} /></Field>
      </div>
      <Field label={kind === "education" ? "Highlights (optional, one per line)" : "Bullet points (one per line)"}>
        <textarea className="rb-in" rows={kind === "education" ? 2 : 4} value={e.bullets.join("\n")} placeholder={kind === "education" ? "e.g. Ranked 3rd in the department" : "e.g. Built a dashboard tracking weekly sales for 15 stores"} onChange={(x) => upd({ bullets: x.target.value.split("\n") })} />
      </Field>
      <BulletHints lines={e.bullets} opts={{ ongoing: kind !== "experience" || current, wantNumber: kind !== "education" }} />
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

/** The student's own sections: Publications, Volunteering, Leadership, Hobbies... */
function CustomSections({ r, set }: { r: Resume; set: SetR }) {
  const upd = (id: string, p: Partial<Resume["custom"][number]>) => set((x) => ({ ...x, custom: x.custom.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  return (
    <>
      {r.custom.map((c) => (
        <Card key={c.id} title={c.title || "New section"} action={<button className="rb-mini" onClick={() => set((x) => ({ ...x, custom: x.custom.filter((y) => y.id !== c.id) }))}>Remove</button>}>
          <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <input className="rb-in" value={c.title} placeholder="Section title, e.g. Publications" onChange={(e) => upd(c.id, { title: e.target.value })} />
            <textarea className="rb-in" rows={3} value={c.items.join("\n")} placeholder="One item per line" onChange={(e) => upd(c.id, { items: e.target.value.split("\n") })} />
          </div>
        </Card>
      ))}
      <div className="rb-unused">
        <span>Add your own section:</span>
        {["Publications", "Volunteering", "Leadership", "Conferences & Talks"].filter((t) => !r.custom.some((c) => c.title === t)).map((t) => (
          <button key={t} onClick={() => set((x) => ({ ...x, custom: [...x.custom, { id: newId(), title: t, items: [] }] }))}>+ {t}</button>
        ))}
        <button onClick={() => set((x) => ({ ...x, custom: [...x.custom, { id: newId(), title: "", items: [] }] }))}>+ Other</button>
      </div>
    </>
  );
}

/* ---------------- match a job ---------------- */

function JobPanel({ r, stage, jd, setJd, report, job }: { r: Resume; stage: Stage; jd: string; setJd: (s: string) => void; report: ReturnType<typeof atsReport>; job: JobHandoff | null }) {
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<{ missing: string[]; suggestions: string[] } | null>(null);
  const [err, setErr] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);
  const kw = report.keywords;
  const match = report.areas.find((a) => a.area === "match");
  const tailor = async () => {
    setBusy(true); setErr("");
    try { setAi(await authedPost("/api/resume/ai", { action: "tailor", resume: plainText(r, stage), jd, target: r.target })); }
    catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  return (
    <div className="rb-ats">
      {job && <p style={{ margin: "0 0 8px", fontSize: 14 }}>Tailoring for <b>{job.title}</b> at <b>{job.company}</b></p>}
      <p className="rb-hint" style={{ margin: "0 0 8px" }}>Paste a job or internship post - or pick one from <a href="/account/resume/jobs" className="fp-link" style={{ fontSize: 12.5 }}>Jobs for you</a>. You&apos;ll see the skills it asks for that your resume shows and the ones it doesn&apos;t - add the missing ones you genuinely have, in the post&apos;s own words.</p>
      <textarea ref={box} className="rb-in" rows={7} value={jd} onChange={(e) => { setJd(e.target.value); setAi(null); }} placeholder="Paste the job description here" />
      {kw && (
        <>
          <div className="rb-match"><b>{match?.score ?? 0}</b><span>/100 match{match && match.issues ? ` · ${match.issues} to improve` : ""}</span></div>
          <div className="rb-kw"><span className="fp-kicker" style={{ border: 0, padding: 0 }}>Skills you show ({kw.skillsMatched.length})</span><div>{kw.skillsMatched.map((k) => <em key={k} className="is-in">{k}</em>)}{!kw.skillsMatched.length && <small>None yet</small>}</div></div>
          <div className="rb-kw"><span className="fp-kicker" style={{ border: 0, padding: 0 }}>Skills the post asks for that you don&apos;t show ({kw.skillsMissing.length})</span><div>{kw.skillsMissing.map((k) => <em key={k}>{k}</em>)}{!kw.skillsMissing.length && <small>None - good.</small>}</div></div>
          {kw.missing.length > 0 && <div className="rb-kw"><span className="fp-kicker" style={{ border: 0, padding: 0 }}>Other terms it repeats</span><div>{[...kw.matched.map((k) => ({ k, on: true })), ...kw.missing.map((k) => ({ k, on: false }))].map((x) => <em key={x.k} className={x.on ? "is-in" : ""}>{x.k}</em>)}</div></div>}
          <ul className="rb-mchecks">{report.checks.filter((c) => c.area === "match").map((c) => <li key={c.id} className={`is-${c.state}`}><b>{c.label}:</b> {c.detail}{c.fix && c.state !== "pass" ? ` ${c.fix}` : ""}</li>)}</ul>
          <button className="fp-btn fp-btn-sm" style={{ marginTop: 10 }} disabled={busy} onClick={() => void tailor()}>{busy ? "Reading the post…" : "Get AI suggestions to tailor it"}</button>
        </>
      )}
      {err && <p className="rb-err">{err}</p>}
      {ai && (
        <div className="rb-sug" style={{ marginTop: 12 }}>
          <span className="fp-kicker" style={{ border: 0, padding: 0 }}>How to tailor it - only add what&apos;s true</span>
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

const RB_CSS = `
.jr-wide{max-width:1360px}
.rb-bar{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin:8px 0 16px}
.rb-bar h1{margin:0;font-size:22px;font-weight:600}
.rb-bar p{margin:4px 0 0;font-size:13.5px;color:var(--ink2)}
.rb-bar-a{display:flex;gap:8px;align-items:center}
.rb-pages{font-size:12.5px;font-weight:600;color:#166534;background:#ecfdf3;border-radius:999px;padding:3px 10px}
.rb-pages.is-over{color:#9a3412;background:#fff7ed}
.rb-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:18px;align-items:start}
.rb-edit{display:grid;gap:12px;min-width:0}
.rb-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}
.rb-card.is-muted{background:#fafaf9}
.rb-card.is-muted h2{color:var(--mute)}
.rb-card-h{display:flex;justify-content:space-between;align-items:center;gap:8px}
.rb-card h2{margin:0;font-size:15px;font-weight:600}
.rb-hint{margin:4px 0 10px;font-size:12.5px;line-height:1.5;color:var(--mute)}
.rb-card-h + .rb-in,.rb-card-h + .rb-2{margin-top:10px}
.rb-ctl,.rb-ctl-wrap{display:inline-flex;gap:4px;align-items:center}
.rb-ctl-wrap{gap:8px}
.rb-ctl button{border:1px solid var(--line);background:#fff;border-radius:5px;min-width:26px;height:26px;padding:0 7px;font:inherit;font-size:12px;color:var(--ink2);cursor:pointer}
.rb-ctl button:disabled{opacity:.35;cursor:default}
.rb-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px}
.rb-f{display:flex;flex-direction:column;gap:4px;min-width:0;font-size:12.5px;font-weight:600;color:var(--ink2)}
.rb-in{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:6px;padding:8px 10px;font:inherit;font-size:13.5px;font-weight:400;color:var(--ink);background:#fff;line-height:1.45}
textarea.rb-in{resize:vertical}
.rb-in:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.rb-count{display:block;text-align:right;font-size:11.5px;color:var(--mute);margin-top:3px}
.rb-count.is-off{color:#9a3412}
.rb-entry{border:1px solid var(--line);border-radius:7px;padding:12px;margin-bottom:10px;display:grid;gap:10px;background:#fcfcfb}
.rb-entry-a{display:flex;align-items:center;gap:6px}
.rb-hints{list-style:none;margin:-4px 0 0;padding:8px 10px;background:#fffbeb;border:1px solid #fde9c3;border-radius:6px;display:grid;gap:3px}
.rb-hints li{font-size:12.3px;line-height:1.45;color:#7c4a03}
.rb-hints b{font-weight:700}
.rb-skill{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.rb-add{border:1px dashed var(--line2);background:#fff;border-radius:6px;padding:8px 12px;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;width:100%}
.rb-add:hover{border-color:var(--accent);color:var(--accent)}
.rb-x,.rb-mini{border:1px solid var(--line);background:#fff;border-radius:6px;padding:4px 9px;font:inherit;font-size:12.5px;color:var(--ink2);cursor:pointer}
.rb-x{font-size:16px;line-height:1;padding:5px 10px}
.rb-ai{border:1px solid color-mix(in srgb,var(--accent) 35%,#fff);background:color-mix(in srgb,var(--accent) 6%,#fff);color:var(--accent);border-radius:6px;padding:5px 10px;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap}
.rb-ai:disabled{opacity:.5;cursor:default}
.rb-ideas{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}
.rb-ideas small{font-size:12px;color:var(--mute)}
.rb-ideas button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:3px 10px;font:inherit;font-size:12.5px;color:var(--ink2);cursor:pointer}
.rb-ideas button:hover{border-color:var(--accent);color:var(--accent)}
.rb-kit{display:grid;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid #f0ede8}
.rb-kit ul{margin:0 0 4px;padding-left:18px;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.rb-kit-sk{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px}
.rb-kit-sk button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:4px 11px;font:inherit;font-size:12.5px;color:var(--ink2);cursor:pointer}
.rb-kit-sk button:hover{border-color:var(--accent);color:var(--accent)}
.rb-kit-sk button.is-on{background:#ecfdf3;border-color:#bbf7d0;color:#166534;cursor:default}
.rb-import{border-color:color-mix(in srgb,var(--accent) 30%,#fff);background:color-mix(in srgb,var(--accent) 3%,#fff)}
.rb-imp-row{display:grid;gap:6px;margin-top:10px}
.rb-imp-row p{margin:0;font-size:13px;color:var(--ink2)}
.rb-imp-row .fp-btn{justify-self:start}
.rb-unused{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:2px 2px 4px}
.rb-unused span{font-size:12.5px;color:var(--mute);margin-right:2px}
.rb-unused button{border:1px dashed var(--line2);background:#fff;border-radius:6px;padding:5px 10px;font:inherit;font-size:12.5px;font-weight:600;color:var(--ink2);cursor:pointer}
.rb-unused button:hover{border-color:var(--accent);color:var(--accent)}
.rb-notes{display:grid;gap:8px;justify-items:start;padding:10px;border:1px dashed var(--line);border-radius:6px;background:#fff}
.rb-notes .rb-f{width:100%}
.rb-sug{border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;padding:10px 12px;background:#fff;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.rb-sug p{margin:4px 0 8px;white-space:pre-line}
.rb-err{margin:0;font-size:13px;color:#b42318}
.rb-side{position:sticky;top:120px;min-width:0}
.rb-tabs{display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap}
.rb-tabs button{border:1px solid var(--line);background:#fff;border-radius:6px;padding:7px 12px;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer}
.rb-tabs button[aria-selected="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.rb-tabs b{margin-left:5px;font-weight:700;padding:0 6px;border-radius:999px;background:#f4f4f5;color:var(--ink)}
.rb-tabs b.is-good{background:#dcfce7;color:#166534}.rb-tabs b.is-ok{background:#fef3c7;color:#92400e}.rb-tabs b.is-bad{background:#fee2e2;color:#b42318}
.rb-design{background:#fff;border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin-bottom:10px}
.rb-tpl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
.rb-tpl button{display:flex;flex-direction:column;align-items:center;gap:5px;border:1px solid var(--line);background:#fff;border-radius:7px;padding:8px 4px;font:inherit;font-size:12.5px;font-weight:600;color:var(--ink2);cursor:pointer}
.rb-tpl button.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink);color:var(--ink)}
.rb-tpl-ic{display:grid;gap:3px;width:38px;padding:5px 6px;border:1px solid #e7e5e4;border-radius:3px;background:#fff}
.rb-tpl-ic i{display:block;height:2px;background:#d6d3d1;border-radius:2px}
.rb-tpl-ic i:first-child{height:4px;width:60%;background:#57534e}
.rb-tpl-ic.is-classic i:first-child,.rb-tpl-ic.is-classic i:nth-child(2){margin:0 auto}
.rb-tpl-ic.is-classic i:nth-child(2){width:80%}
.rb-tpl-ic.is-modern i:first-child{background:#1f3a5f}
.rb-tpl-ic.is-compact{gap:2px}
.rb-tpl-ic.is-executive i:first-child{width:75%;height:5px;background:#1f3a5f}
.rb-opts{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:10px}
.rb-sw{display:inline-flex;gap:5px}
.rb-sw button{width:20px;height:20px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--line);cursor:pointer;padding:0}
.rb-sw button[aria-checked="true"]{box-shadow:0 0 0 2px var(--ink)}
.rb-seg{display:inline-flex;align-items:center;gap:2px}
.rb-seg small{font-size:11.5px;color:var(--mute);margin-right:4px}
.rb-seg button{border:1px solid var(--line);background:#fff;padding:3px 8px;font:inherit;font-size:12px;font-weight:600;color:var(--ink2);cursor:pointer}
.rb-seg button:first-of-type{border-radius:5px 0 0 5px}.rb-seg button:last-of-type{border-radius:0 5px 5px 0}
.rb-seg button.on{background:var(--ink);border-color:var(--ink);color:#fff}
.rb-preview{background:#f1efec;border:1px solid var(--line);border-radius:8px;padding:14px;max-height:calc(100vh - 290px);overflow:auto}
.rb-ats{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}
.rb-match{display:flex;align-items:baseline;gap:4px;margin-top:12px}
.rb-match b{font-size:30px;font-weight:700}
.rb-match span{font-size:13px;color:var(--mute)}
.rb-kw{margin-top:10px}
.rb-kw div{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}
.rb-kw em{font-style:normal;font-size:12.5px;padding:2px 8px;border-radius:5px;background:#f4f4f5;color:var(--ink2)}
.rb-kw em.is-in{background:#ecfdf3;color:#166534}
.rb-kw small{font-size:12.5px;color:var(--mute)}
.rb-mchecks{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:5px}
.rb-mchecks li{font-size:12.8px;line-height:1.5;color:var(--ink2);padding-left:10px;border-left:3px solid #d6d3d1}
.rb-mchecks li.is-pass{border-color:#86efac}.rb-mchecks li.is-warn{border-color:#fcd34d}.rb-mchecks li.is-fail{border-color:#fca5a5}
@media (max-width:1060px){.rb-grid{grid-template-columns:minmax(0,1fr)}.rb-side{position:static}.rb-preview{max-height:none}}
@media (max-width:560px){.rb-2{grid-template-columns:minmax(0,1fr)}.rb-skill{flex-wrap:wrap}.rb-tpl{grid-template-columns:repeat(2,minmax(0,1fr))}.rb-preview{padding:8px}}
`;
