"use client";

/**
 * /parent/[token] - the parent survey a school shares by link (no account).
 * Six quick questions about what the family hopes for; the school compares
 * the answers with the child's assessment and own goal.
 */
import { useEffect, useState } from "react";
import { Logo } from "@/app/Logo";

interface Info { child: string; school: string; areas: { key: string; label: string }[]; priorities: string[]; submitted: boolean }

const CSS = `
.ps{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif;padding:24px 16px 48px}
.ps *{box-sizing:border-box}
.ps-card{max-width:620px;margin:0 auto;background:#fff;border:1px solid #ececef;border-radius:18px;padding:24px}
.ps h1{font-size:23px;margin:14px 0 6px;letter-spacing:-.01em;text-wrap:balance}
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
.ps-err{background:#fdecec;color:#c62828;border-radius:10px;padding:10px 12px;margin-top:14px;font-size:14px}
@media (max-width:520px){.ps-row{grid-template-columns:1fr}.ps-card{padding:18px}}
`;

export default function ParentSurveyPage({ params }: { params: { token: string } }) {
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ parentName: "", relation: "", phone: "", language: "en", areas: [] as string[], firmness: "", priorities: [] as string[], note: "" });

  useEffect(() => {
    fetch(`/api/parent/${params.token}`).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "This link isn't valid.");
      setInfo(d);
    }).catch((e) => setError(e instanceof Error ? e.message : "This link isn't valid."));
  }, [params.token]);

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
      setDone(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't save."); }
    finally { setBusy(false); }
  }

  const ready = f.areas.length > 0 && !!f.firmness;
  return (
    <div className="ps">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ps-card">
        <Logo height={34} />
        {!info && !error && <p style={{ marginTop: 16 }}>Loading…</p>}
        {error && !info && <><h1>Link not valid</h1><p>{error}</p></>}
        {info && done && (
          <><h1>Thank you!</h1><p>Your answers have reached {info.school}. Your child&apos;s counsellor will use them to guide {info.child} - together with {info.child}&apos;s own career assessment.</p></>
        )}
        {info && !done && (
          <>
            <h1>What do you hope for {info.child}?</h1>
            <p>{info.school} uses OneGrasp to guide {info.child}&apos;s career choices. Your answers help the counsellor understand your family&apos;s wishes and compare them with {info.child}&apos;s own assessment. It takes about 2 minutes.{info.submitted ? " (You have answered before - answering again replaces it.)" : ""}</p>

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
          </>
        )}
      </div>
    </div>
  );
}
