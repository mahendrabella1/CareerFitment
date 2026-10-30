"use client";
/**
 * The ATS check panel: the overall score, the four areas, every finding with
 * its fix (issues first), and "What an ATS reads" - the fields screening
 * software pulls out of this resume.
 */
import { useState } from "react";
import { AREA_META, type AtsArea, type AtsReport, type ParsedView } from "@/lib/resume/ats";

export function AtsPanel({ report, parsed }: { report: AtsReport; parsed: ParsedView }) {
  const [area, setArea] = useState<AtsArea | "all">("all");
  const [showPassed, setShowPassed] = useState(false);
  const [showParsed, setShowParsed] = useState(false);
  const order = { fail: 0, warn: 1, pass: 2 } as const;
  const list = report.checks.filter((c) => area === "all" || c.area === area).sort((a, b) => order[a.state] - order[b.state]);
  const issues = list.filter((c) => c.state !== "pass");
  const passed = list.filter((c) => c.state === "pass");
  const tone = report.score >= 90 ? "good" : report.score >= 75 ? "ok" : "bad";
  const toFix = report.checks.filter((c) => c.state !== "pass").length;

  return (
    <div className="ap">
      <div className="ap-top">
        <div className={`ap-score is-${tone}`}>
          <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15.5" /><circle cx="18" cy="18" r="15.5" style={{ strokeDasharray: `${report.score * 0.974} 100` }} /></svg>
          <b>{report.score}</b>
        </div>
        <div>
          <span className="ap-band">{report.band}</span>
          <p>{report.ready ? "Ready to send. Tailor it to each job for the best match." : `${toFix} thing${toFix === 1 ? "" : "s"} to fix${report.checks.some((c) => c.state === "fail") ? " - start with the red ones" : ""}.`}</p>
        </div>
      </div>

      <div className="ap-areas">
        <button className={area === "all" ? "on" : ""} onClick={() => setArea("all")}><span>All</span><b>{report.score}</b></button>
        {report.areas.map((a) => (
          <button key={a.area} className={area === a.area ? "on" : ""} onClick={() => setArea(a.area)} title={AREA_META[a.area].text}>
            <span>{AREA_META[a.area].label}</span><b>{a.score}</b>
            <i><em style={{ width: `${a.score}%` }} className={a.score >= 90 ? "is-good" : a.score >= 70 ? "is-ok" : "is-bad"} /></i>
          </button>
        ))}
      </div>

      {issues.length === 0 && <p className="ap-none">Nothing to fix here.</p>}
      <ul className="ap-list">
        {issues.map((c) => (
          <li key={c.id} className={`is-${c.state}`}>
            <i aria-hidden="true">{c.state === "fail" ? "!" : "–"}</i>
            <div>
              <b>{c.label}</b>
              <p>{c.detail}</p>
              {c.fix && <p className="ap-fix"><span>Fix:</span> {c.fix}</p>}
              {c.lines && c.lines.length > 0 && <ul className="ap-lines">{c.lines.map((l) => <li key={l}>&ldquo;{l.length > 110 ? `${l.slice(0, 110)}…` : l}&rdquo;</li>)}</ul>}
            </div>
          </li>
        ))}
      </ul>
      {passed.length > 0 && (
        <>
          <button className="ap-more" onClick={() => setShowPassed(!showPassed)}>{showPassed ? "Hide" : "Show"} {passed.length} passed check{passed.length === 1 ? "" : "s"}</button>
          {showPassed && <ul className="ap-list">{passed.map((c) => <li key={c.id} className="is-pass"><i aria-hidden="true">✓</i><div><b>{c.label}</b><p>{c.detail}</p></div></li>)}</ul>}
        </>
      )}

      <div className="ap-parsed">
        <button className="ap-more" onClick={() => setShowParsed(!showParsed)} aria-expanded={showParsed}>{showParsed ? "Hide" : "See"} what an ATS reads from your resume</button>
        {showParsed && <Parsed p={parsed} />}
      </div>
      <style dangerouslySetInnerHTML={{ __html: AP_CSS }} />
    </div>
  );
}

function Parsed({ p }: { p: ParsedView }) {
  const v = (x: string) => x || <em>not found</em>;
  return (
    <div className="ap-p">
      <dl>
        <dt>Name</dt><dd>{v(p.name)}</dd>
        <dt>Email</dt><dd>{v(p.email)}</dd>
        <dt>Phone</dt><dd>{v(p.phone)}</dd>
        <dt>Location</dt><dd>{v(p.location)}</dd>
        <dt>Links</dt><dd>{p.links.length ? p.links.join(", ") : <em>none</em>}</dd>
        <dt>Sections</dt><dd>{p.sections.join(" → ") || <em>none</em>}</dd>
        <dt>Experience</dt><dd>{p.jobs.length ? p.jobs.map((j, i) => <div key={i}>{[j.title, j.org].filter(Boolean).join(" at ")}{j.dates ? ` (${j.dates})` : <em> - no dates</em>}</div>) : <em>none</em>}</dd>
        <dt>Education</dt><dd>{p.education.length ? p.education.map((e, i) => <div key={i}>{[e.degree, e.school].filter(Boolean).join(", ")}{e.dates ? ` (${e.dates})` : ""}{e.score ? ` - ${e.score}` : ""}</div>) : <em>none</em>}</dd>
        <dt>Skills</dt><dd>{p.skills.length ? <>{p.skills.length} found - {p.hardSkills.length} recognised as hard skills{p.hardSkills.length ? `: ${p.hardSkills.join(", ")}` : ""}</> : <em>none</em>}</dd>
      </dl>
      <p>Recruiters search these fields - a missing one means you won&apos;t appear in that search.</p>
    </div>
  );
}

const AP_CSS = `
.ap{background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px}
.ap-top{display:flex;gap:14px;align-items:center;margin-bottom:14px}
.ap-score{position:relative;width:64px;height:64px;flex:none}
.ap-score svg{width:100%;height:100%;transform:rotate(-90deg)}
.ap-score circle{fill:none;stroke-width:3.2}
.ap-score circle:first-child{stroke:#eeece8}
.ap-score circle:last-child{stroke-linecap:round;transition:stroke-dasharray .4s}
.ap-score.is-good circle:last-child{stroke:#15803d}
.ap-score.is-ok circle:last-child{stroke:#b45309}
.ap-score.is-bad circle:last-child{stroke:#b42318}
.ap-score b{position:absolute;inset:0;display:grid;place-items:center;font-size:19px;font-weight:700}
.ap-band{font-size:16px;font-weight:700}
.ap-top p{margin:2px 0 0;font-size:13px;color:var(--ink2);line-height:1.45}
.ap-areas{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;margin-bottom:12px}
.ap-areas button{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:2px 6px;align-items:baseline;padding:8px 10px;border:1px solid var(--line);border-radius:7px;background:#fff}
.ap-areas button.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.ap-areas span{font-size:12px;color:var(--ink2);font-weight:600}
.ap-areas b{font-size:14px}
.ap-areas i{grid-column:1/-1;height:4px;border-radius:9px;background:#eeece8;overflow:hidden;display:block}
.ap-areas em{display:block;height:100%;border-radius:9px}
.ap-areas em.is-good{background:#15803d}.ap-areas em.is-ok{background:#d08a1c}.ap-areas em.is-bad{background:#b42318}
.ap-none{margin:6px 0;font-size:13.5px;color:#166534}
.ap-list{list-style:none;margin:0;padding:0}
.ap-list>li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px;padding:10px 0;border-top:1px solid #f0ede8}
.ap-list>li>i{font-style:normal;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;font-size:12px;font-weight:800}
.ap-list>li.is-fail>i{background:#fef2f2;color:#b42318}
.ap-list>li.is-warn>i{background:#fff7ed;color:#9a3412}
.ap-list>li.is-pass>i{background:#ecfdf3;color:#166534}
.ap-list b{display:block;font-size:13.5px;font-weight:600}
.ap-list p{margin:2px 0 0;font-size:12.8px;line-height:1.5;color:var(--ink2)}
.ap-fix span{font-weight:700;color:var(--ink)}
.ap-lines{margin:5px 0 0;padding:0 0 0 10px;border-left:2px solid #eeece8;list-style:none}
.ap-lines li{font-size:12.3px;color:var(--mute);line-height:1.45;margin:2px 0}
.ap-more{all:unset;cursor:pointer;display:inline-block;margin-top:10px;font-size:13px;font-weight:600;color:var(--accent)}
.ap-parsed{margin-top:6px;padding-top:6px;border-top:1px solid #f0ede8}
.ap-p dl{display:grid;grid-template-columns:96px minmax(0,1fr);gap:6px 10px;margin:10px 0 0;font-size:12.8px;line-height:1.45}
.ap-p dt{color:var(--mute);font-weight:600}
.ap-p dd{margin:0;color:var(--ink)}
.ap-p em{color:#b42318;font-style:normal}
.ap-p p{margin:10px 0 0;font-size:12px;color:var(--mute)}
`;
