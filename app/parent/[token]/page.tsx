"use client";

/**
 * /parent/[token] - the family page a school shares by link (no account):
 *   - the parent survey: six quick questions about what the family hopes for
 *     (the school compares the answers with the child's assessment and goal)
 *   - the child's Family Decision Room sheet, with "We agree" / "Let's discuss"
 *   - this week's Career GPS progress
 */
import { useEffect, useState } from "react";
import { Logo } from "@/app/Logo";
import { HowItWorks } from "@/components/HowItWorks";
import { pathView, type FamilyDecision, type PathView } from "@/lib/decisionRoom";
import { enjoymentLabel } from "@/lib/testDrive";

interface Info {
  child: string; school: string; areas: { key: string; label: string }[]; priorities: string[]; submitted: boolean;
  survey: { areas: string[]; priorities: string[] } | null;
  decision: FamilyDecision | null;
  childData: { fits: { name: string; pct: number }[]; goal: string | null; testDrives: { career: string; enjoyment: number }[] };
  gps: { done: number; total: number; points: number; streak: number };
}

const CSS = `
.ps{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif;padding:24px 16px 48px}
.ps *{box-sizing:border-box}
.ps-card{max-width:680px;margin:0 auto 14px;background:#fff;border:1px solid #ececef;border-radius:18px;padding:24px}
.ps-help{max-width:680px;margin:0 auto}
.ps h1{font-size:23px;margin:14px 0 6px;letter-spacing:-.01em;text-wrap:balance}
.ps h2{font-size:18px;margin:0 0 6px}
.ps p{color:#63636f;line-height:1.6;margin:0}
.ps-q{margin-top:22px}
.ps-q > b{display:block;font-size:15px;margin-bottom:4px}
.ps-q > span{display:block;font-size:12.5px;color:#9a9aa6;margin-bottom:10px}
.ps-opts{display:flex;flex-wrap:wrap;gap:8px}
.ps-opt{border:1.5px solid #ececef;background:#fff;border-radius:999px;padding:8px 14px;font:inherit;font-size:13.5px;font-weight:600;color:#3d3d45;cursor:pointer}
.ps-opt.on{border-color:#E23B41;background:#FDECED;color:#B4232A}
.ps-in{width:100%;border:1px solid #ececef;border-radius:10px;padding:11px 12px;font:inherit;font-size:15px}
.ps-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ps-btn{width:100%;margin-top:26px;background:#E23B41;color:#fff;border:none;border-radius:12px;padding:14px;font:inherit;font-size:16px;font-weight:800;cursor:pointer}
.ps-btn:disabled{opacity:.5}
.ps-btn.small{width:auto;margin-top:0;padding:10px 16px;font-size:14px}
.ps-btn.ghost{background:#fff;color:#3d3d45;border:1px solid #ececef}
.ps-err{background:#fdecec;color:#c62828;border-radius:10px;padding:10px 12px;margin-top:14px;font-size:14px}
.ps-gps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
.ps-gps div{background:#f6f7fb;border-radius:12px;padding:12px}
.ps-gps b{display:block;font-size:22px;font-variant-numeric:tabular-nums}
.ps-gps span{font-size:11.5px;font-weight:700;color:#63636f;text-transform:uppercase;letter-spacing:.05em}
.ps-tbl-wrap{overflow-x:auto;margin-top:12px}
.ps-tbl{width:100%;border-collapse:collapse;font-size:13.5px;min-width:440px}
.ps-tbl th,.ps-tbl td{text-align:left;vertical-align:top;padding:9px 10px;border-top:1px solid #f0f0f3;line-height:1.45}
.ps-tbl thead th{border-top:none;font-size:15px}
.ps-tbl tbody th{font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#63636f;width:30%}
.ps-chosen{background:#eaf6f0;color:#1f7a55;border-radius:6px;font-size:11px;font-weight:800;padding:2px 7px;margin-left:6px}
.ps-note{border-radius:12px;padding:12px 14px;margin-top:12px;line-height:1.55;font-size:14px}
@media (max-width:520px){.ps-row{grid-template-columns:1fr}.ps-card{padding:18px}.ps-gps b{font-size:18px}.ps-tbl{min-width:0;font-size:12.5px}.ps-tbl th,.ps-tbl td{padding:8px 5px}.ps-tbl tbody th{font-size:10px;letter-spacing:.02em}}
`;

export default function ParentFamilyPage({ params }: { params: { token: string } }) {
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ parentName: "", relation: "", phone: "", language: "en", areas: [] as string[], firmness: "", priorities: [] as string[], note: "" });
  const [comment, setComment] = useState("");
  const [respBusy, setRespBusy] = useState(false);
  const [respErr, setRespErr] = useState("");

  const load = () => fetch(`/api/parent/${params.token}`).then(async (r) => {
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "This link isn't valid.");
    setInfo(d);
  }).catch((e) => setError(e instanceof Error ? e.message : "This link isn't valid."));
  useEffect(() => { void load(); }, [params.token]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (k: "areas" | "priorities", v: string, max: number) => setF((p) => {
    if (k === "areas" && v === "open") return { ...p, areas: p.areas.includes("open") ? [] : ["open"] };
    const cur = p[k].filter((x) => x !== "open");
    return { ...p, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : cur.length >= max ? cur : [...cur, v] };
  });

  async function submit() {
    setBusy(true); setError("");
    try {
      const r = await fetch(`/api/parent/${params.token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Couldn't save.");
      setDone(true); setEditing(false);
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't save."); }
    finally { setBusy(false); }
  }

  async function respond(answer: "agree" | "discuss") {
    setRespBusy(true); setRespErr("");
    try {
      const r = await fetch(`/api/parent/${params.token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decisionResponse: answer, comment }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Couldn't send.");
      setComment("");
      await load();
    } catch (e) { setRespErr(e instanceof Error ? e.message : "Couldn't send."); }
    finally { setRespBusy(false); }
  }

  const ready = f.areas.length > 0 && !!f.firmness;
  const showSurvey = !!info && (!info.submitted || editing) && !done;
  const dec = info?.decision;
  const ctx = info ? { ...info.childData, parentAreas: (info.survey?.areas ?? []).filter((a) => a !== "open"), parentPriorities: (info.survey?.priorities ?? []).filter((p) => p !== "Child's own interest") } : null;
  const views: [PathView, PathView] | null = dec && ctx ? [pathView(dec.pathA, ctx), pathView(dec.pathB, ctx)] : null;

  return (
    <div className="ps">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ps-card">
        <Logo height={34} />
        {!info && !error && <p style={{ marginTop: 16 }}>Loading…</p>}
        {error && !info && <><h1>Link not valid</h1><p>{error}</p></>}
        {info && (
          <>
            <h1>{info.child}&apos;s family page</h1>
            <p>{info.school} uses OneGrasp to guide {info.child}&apos;s career choices. On this page you can tell the school what you hope for, see the decision {info.child} is making, and follow this week&apos;s progress. Keep this link private - it opens {info.child}&apos;s page without a password.</p>
          </>
        )}
      </div>
      {info && (
        <div className="ps-help">
          <HowItWorks id="parent-page" accent="#E23B41" steps={[
            `Answer the short survey once - what you hope for ${info.child} and what matters most to your family.`,
            `When ${info.child} compares two paths in the Family Decision Room, the sheet appears here. Read it together, then press "We agree" or "Let's discuss" (you can add a note).`,
            `"This week" shows ${info.child}'s Career GPS missions - three small steps a week. Encourage them to keep the streak going.`,
          ]} sync={`${info.child} sees your answer on their Decision Room page; ${info.school} sees your survey and your answer, so the counsellor can help if you disagree. Your phone number is only used by the school.`} />
        </div>
      )}

      {info && done && (
        <div className="ps-card"><h2>Thank you!</h2><p>Your answers have reached {info.school}. The counsellor will use them to guide {info.child} - together with {info.child}&apos;s own career assessment.</p></div>
      )}

      {info && views && dec && (
        <div className="ps-card">
          <h2>{info.child}&apos;s decision</h2>
          <p>{dec.chosen === "undecided" ? `${info.child} is comparing two paths and hasn't chosen yet.` : <>{info.child} has chosen <b style={{ color: "#141417" }}>{dec.chosen === "A" ? dec.pathA : dec.pathB}</b>.</>}</p>
          {dec.reasons && <div className="ps-note" style={{ background: "#f6f7fb" }}><b>In {info.child}&apos;s words:</b> &ldquo;{dec.reasons}&rdquo;</div>}
          <div className="ps-tbl-wrap">
            <table className="ps-tbl">
              <thead><tr><th />{views.map((v, i) => <th key={i}>{v.label}{dec.chosen === (i === 0 ? "A" : "B") && <span className="ps-chosen">Chosen</span>}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">Fit from the assessment</th>{views.map((v, i) => <td key={i}>{v.fitPct != null ? `${v.fitPct}% fit` : "Not among the best fits"}</td>)}</tr>
                <tr><th scope="row">{info.child}&apos;s own goal</th>{views.map((v, i) => <td key={i}>{v.isGoal ? "✓ Yes" : "-"}</td>)}</tr>
                <tr><th scope="row">Career test-drive</th>{views.map((v, i) => <td key={i}>{v.enjoyment != null ? `${enjoymentLabel(v.enjoyment)} (${v.enjoyment}/5)` : "Not tried yet"}</td>)}</tr>
                <tr><th scope="row">Your wishes</th>{views.map((v, i) => <td key={i}>{!info.survey ? "Answer the survey below" : info.survey.areas.includes("open") ? "Whatever they choose" : v.parentsWant ? "✓ One of your choices" : "Not what you named"}</td>)}</tr>
                <tr><th scope="row">Route</th>{views.map((v, i) => <td key={i}>{v.facts?.route ?? "-"}</td>)}</tr>
                <tr><th scope="row">Years to first job</th>{views.map((v, i) => <td key={i}>{v.facts?.yearsToFirstJob ?? "-"}</td>)}</tr>
                <tr><th scope="row">Cost of study</th>{views.map((v, i) => <td key={i}>{v.facts?.studyCost ?? "-"}</td>)}</tr>
                <tr><th scope="row">Starting pay</th>{views.map((v, i) => <td key={i}>{v.facts?.startingPay ?? "-"}</td>)}</tr>
                <tr><th scope="row">Pay after ~10 years</th>{views.map((v, i) => <td key={i}>{v.facts?.tenYearPay ?? "-"}</td>)}</tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, marginTop: 8 }}>Costs and pay are indicative ranges for India and vary by college, city and skill.</p>
          {dec.parentResponse ? (
            <div className="ps-note" style={{ background: dec.parentResponse.answer === "agree" ? "#eaf6f0" : "#fdf3e2" }}>
              You answered: <b>{dec.parentResponse.answer === "agree" ? "We agree" : "Let's discuss"}</b>{dec.parentResponse.comment && <> - &ldquo;{dec.parentResponse.comment}&rdquo;</>}
              <div style={{ fontSize: 12, color: "#63636f", marginTop: 4 }}>You can change your answer below.</div>
            </div>
          ) : null}
          <textarea className="ps-in" style={{ marginTop: 12 }} rows={2} maxLength={500} placeholder={`A note for ${info.child} (optional)`} value={comment} onChange={(e) => setComment(e.target.value)} />
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button className="ps-btn small" disabled={respBusy} onClick={() => void respond("agree")}>We agree</button>
            <button className="ps-btn small ghost" disabled={respBusy} onClick={() => void respond("discuss")}>Let&apos;s discuss</button>
          </div>
          {respErr && <div className="ps-err">{respErr}</div>}
        </div>
      )}

      {info && (
        <div className="ps-card">
          <h2>This week</h2>
          <p>{info.child}&apos;s Career GPS: three small missions a week, like test-driving a career or adding an achievement.</p>
          <div className="ps-gps">
            <div><span>Missions done</span><b>{info.gps.done} / {info.gps.total}</b></div>
            <div><span>Week streak</span><b>{info.gps.streak}</b></div>
            <div><span>Points</span><b>{info.gps.points}</b></div>
          </div>
        </div>
      )}

      {info && info.submitted && !editing && !done && (
        <div className="ps-card" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}><h2>Your survey ✓</h2><p>{info.school} has your answers.</p></div>
          <button className="ps-btn small ghost" onClick={() => setEditing(true)}>Update my answers</button>
        </div>
      )}

      {showSurvey && (
        <div className="ps-card">
          <h2>What do you hope for {info.child}?</h2>
          <p>Your answers help the counsellor understand your family&apos;s wishes and compare them with {info.child}&apos;s own assessment. It takes about 2 minutes.{info.submitted ? " (Answering again replaces your earlier answers.)" : ""}</p>

          <div className="ps-q">
            <b>1. Who is answering?</b>
            <div className="ps-row">
              <input className="ps-in" placeholder="Your name" value={f.parentName} onChange={(e) => setF({ ...f, parentName: e.target.value })} />
              <select className="ps-in" value={f.relation} onChange={(e) => setF({ ...f, relation: e.target.value })}>
                <option value="">Relation</option><option>Mother</option><option>Father</option><option>Guardian</option>
              </select>
            </div>
          </div>
          <div className="ps-q">
            <b>2. Phone and language for school calls (optional)</b>
            <span>The school may call you with updates - in the language you choose.</span>
            <div className="ps-row">
              <input className="ps-in" inputMode="tel" placeholder="Mobile number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <select className="ps-in" value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>
                <option value="en">English</option><option value="hi">हिन्दी (Hindi)</option><option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>
          <div className="ps-q">
            <b>3. Which career areas do you hope {info.child} goes into?</b>
            <span>Pick up to 3 - or &quot;whatever my child chooses&quot;.</span>
            <div className="ps-opts">
              <button type="button" className={`ps-opt${f.areas.includes("open") ? " on" : ""}`} onClick={() => toggle("areas", "open", 1)}>Whatever my child chooses</button>
              {info.areas.map((a) => <button type="button" key={a.key} className={`ps-opt${f.areas.includes(a.key) ? " on" : ""}`} onClick={() => toggle("areas", a.key, 3)}>{a.label}</button>)}
            </div>
          </div>
          <div className="ps-q">
            <b>4. How firm are you about this?</b>
            <div className="ps-opts">
              {[["open", "Open - happy with what suits my child"], ["prefer", "I have a preference"], ["insist", "It should be this area"]].map(([k, l]) => (
                <button type="button" key={k} className={`ps-opt${f.firmness === k ? " on" : ""}`} onClick={() => setF({ ...f, firmness: k })}>{l}</button>
              ))}
            </div>
          </div>
          <div className="ps-q">
            <b>5. What matters most to you? (up to 3)</b>
            <div className="ps-opts">
              {info.priorities.map((p) => <button type="button" key={p} className={`ps-opt${f.priorities.includes(p) ? " on" : ""}`} onClick={() => toggle("priorities", p, 3)}>{p}</button>)}
            </div>
          </div>
          <div className="ps-q">
            <b>6. Anything the counsellor should know? (optional)</b>
            <textarea className="ps-in" rows={3} maxLength={500} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. family business, financial limits, health, a dream they've shared with you" />
          </div>
          {error && <div className="ps-err">{error}</div>}
          <button className="ps-btn" disabled={!ready || busy} onClick={() => void submit()}>{busy ? "Sending…" : "Send to the school"}</button>
          {!ready && <p style={{ fontSize: 12.5, marginTop: 8, textAlign: "center" }}>Answer questions 3 and 4 to send.</p>}
        </div>
      )}
    </div>
  );
}
