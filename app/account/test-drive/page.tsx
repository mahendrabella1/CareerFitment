"use client";

/**
 * /account/test-drive - Career Test-Drive: live a working day in a career
 * before choosing it. Pick a career, make five real decisions, say how much
 * you'd enjoy each moment, and get an honest summary.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import { apiFetch } from "@/lib/institution/client";
import { HowItWorks } from "@/components/HowItWorks";
import { enjoymentLabel, type TestDrive, type TestDriveResult } from "@/lib/testDrive";

const CSS = `
.td{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif}
.td *{box-sizing:border-box}
.td-top{display:flex;align-items:center;gap:12px;padding:12px 20px;background:#fff;border-bottom:1px solid #ececef}
.td-wrap{max-width:820px;margin:0 auto;padding:22px 16px 60px}
.td-card{background:#fff;border:1px solid #ececef;border-radius:18px;padding:20px;margin-bottom:14px}
.td h1{font-size:26px;margin:0 0 4px;letter-spacing:-.015em}
.td-muted{color:#63636f;font-size:14px;line-height:1.6}
.td-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.td-chip{border:1.5px solid #ececef;background:#fff;border-radius:999px;padding:9px 14px;font:inherit;font-size:14px;font-weight:700;color:#3d3d45;cursor:pointer}
.td-chip:hover{border-color:#4c5fd5;color:#4c5fd5}
.td-btn{background:#4c5fd5;color:#fff;border:none;border-radius:12px;padding:12px 18px;font:inherit;font-size:15px;font-weight:800;cursor:pointer}
.td-btn.ghost{background:#fff;color:#3d3d45;border:1px solid #ececef}
.td-btn:disabled{opacity:.5}
.td-in{flex:1;min-width:200px;border:1px solid #ececef;border-radius:12px;padding:11px 13px;font:inherit;font-size:15px}
.td-time{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#4c5fd5}
.td-choice{display:block;width:100%;text-align:left;border:1.5px solid #ececef;background:#fff;border-radius:14px;padding:13px 15px;font:inherit;font-size:15px;margin-top:10px;cursor:pointer;line-height:1.45}
.td-choice:hover:not(:disabled){border-color:#4c5fd5}
.td-choice.on{border-color:#4c5fd5;background:#eef0fc}
.td-choice:disabled{color:#141417;cursor:default}
.td-choice:disabled:not(.on){opacity:.5}
.td-out{margin-top:14px;padding:13px 15px;border-radius:14px;background:#f4f4f6;line-height:1.55}
.td-rate{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.td-rate button{flex:1;min-width:58px;border:1.5px solid #ececef;background:#fff;border-radius:12px;padding:9px 4px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
.td-rate button.on{border-color:#4c5fd5;background:#4c5fd5;color:#fff}
.td-bar{height:6px;border-radius:999px;background:#ececef;overflow:hidden;margin:12px 0 4px}
.td-bar>div{height:100%;background:#4c5fd5}
.td-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:640px){.td-grid{grid-template-columns:1fr}}
`;

const FACES = ["Not at all", "A little", "It's OK", "I'd like it", "Love it"];

export default function TestDrivePage() {
  const { user, profile, loading } = useAuth();
  const [career, setCareer] = useState("");
  const [typed, setTyped] = useState("");
  const [drive, setDrive] = useState<TestDrive | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(-1); // -1 intro, 0..n-1 scenes, n = summary
  const [choices, setChoices] = useState<number[]>([]);
  const [ratings, setRatings] = useState<number[]>([]);
  const [result, setResult] = useState<TestDriveResult | null>(null);
  const [done, setDone] = useState<Record<string, TestDriveResult>>({});

  const a = profile?.latestAssessment;
  const suggestions = useMemo(() => {
    const fits = a?.customFields?.length ? a.customFields.map((f) => f.name) : (a?.matches ?? []).map((m) => m.title);
    return [...new Set([a?.desiredCareer, ...fits].filter(Boolean) as string[])].slice(0, 6);
  }, [a]);
  const past = { ...((profile as unknown as { testDrives?: Record<string, TestDriveResult> })?.testDrives ?? {}), ...done };

  async function start(c: string) {
    setCareer(c); setDrive(null); setError(""); setBusy(true); setStep(-1); setChoices([]); setRatings([]); setResult(null);
    try { setDrive((await apiFetch<{ drive: TestDrive }>(`/api/test-drive?career=${encodeURIComponent(c)}`)).drive); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't prepare this test-drive."); }
    finally { setBusy(false); }
  }
  async function finish(finalRatings: number[]) {
    if (!drive) return;
    try {
      const r = await apiFetch<{ result: TestDriveResult }>("/api/test-drive", { method: "POST", body: JSON.stringify({ slug: drive.slug, ratings: finalRatings, choices }) });
      setResult(r.result); setDone((d) => ({ ...d, [drive.slug]: r.result }));
    } catch (e) { setError(e instanceof Error ? e.message : "Couldn't save your result."); }
  }

  const scene = drive && step >= 0 && step < drive.scenes.length ? drive.scenes[step] : null;
  const picked = choices[step];
  return (
    <div className="td">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="td-top"><Link href="/account"><Logo height={32} /></Link><span style={{ flex: 1 }} /><Link href="/account" style={{ fontWeight: 700, color: "#3d3d45", textDecoration: "none" }}>← Dashboard</Link></header>
      <div className="td-wrap">
        {loading ? <p className="td-muted">Loading…</p> : !user ? <p className="td-muted">Please <Link href="/signin">sign in</Link> to test-drive a career.</p> : !drive ? (
          <>
            <div className="td-card">
              <h1>Career Test-Drive</h1>
              <p className="td-muted">Live one working day in a career before you choose it - five real moments, your decisions, and an honest look at what the job is like.</p>
            </div>
            <HowItWorks id="test-drive" steps={[
              "Pick a career - your best fits from the report are suggested, or type any career.",
              "Read each moment of the day and choose what you would do. You'll see what happens next.",
              "Say how much you'd enjoy that moment - be honest, there are no wrong answers.",
              "At the end you get your enjoyment score, how well you judged each situation, and next steps.",
            ]} sync="Your enjoyment score is saved to your profile; your school sees which careers you test-drove and how much you enjoyed them, and the Family Decision Room uses it when you compare paths." />
            <div className="td-card">
              <b>Choose a career to test-drive</b>
              {suggestions.length > 0 && <div className="td-chips">{suggestions.map((s) => <button key={s} className="td-chip" disabled={busy} onClick={() => void start(s)}>{s}{past[Object.keys(past).find((k) => past[k].career === s) ?? ""] ? " ✓" : ""}</button>)}</div>}
              <form style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }} onSubmit={(e) => { e.preventDefault(); if (typed.trim().length >= 3) void start(typed.trim()); }}>
                <input className="td-in" placeholder="Or type any career, e.g. Pilot, Chartered Accountant" value={typed} onChange={(e) => setTyped(e.target.value)} />
                <button className="td-btn" disabled={busy || typed.trim().length < 3}>Start</button>
              </form>
              {busy && <p className="td-muted" style={{ marginTop: 12 }}>Preparing a day as a <b>{career}</b>… the first test-drive of a career can take up to a minute.</p>}
              {error && <p style={{ color: "#c62828", marginTop: 12 }}>{error}</p>}
            </div>
            {Object.keys(past).length > 0 && (
              <div className="td-card">
                <b>Your test-drives</b>
                {Object.values(past).sort((x, y) => y.enjoyment - x.enjoyment).map((r) => (
                  <div key={r.career} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                    <span style={{ flex: 1, fontWeight: 700 }}>{r.career}</span>
                    <span className="td-muted">{enjoymentLabel(r.enjoyment)} · {r.enjoyment}/5</span>
                    <button className="td-btn ghost" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => void start(r.career)}>Again</button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : step === -1 ? (
          <div className="td-card">
            <div className="td-time">A day as a {drive.career}</div>
            <h1 style={{ marginTop: 6 }}>Your working day starts now</h1>
            <p className="td-muted" style={{ fontSize: 15.5 }}>{drive.intro}</p>
            <button className="td-btn" style={{ marginTop: 14 }} onClick={() => setStep(0)}>Start my day →</button>
            <button className="td-btn ghost" style={{ marginTop: 14, marginLeft: 8 }} onClick={() => setDrive(null)}>Choose another career</button>
          </div>
        ) : scene ? (
          <div className="td-card">
            <div className="td-bar"><div style={{ width: `${(step / drive.scenes.length) * 100}%` }} /></div>
            <div className="td-time">{scene.time} · moment {step + 1} of {drive.scenes.length}</div>
            <h2 style={{ margin: "6px 0 8px", fontSize: 20 }}>{scene.title}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: 0 }}>{scene.situation}</p>
            {scene.choices.map((c, i) => (
              <button key={i} className={`td-choice${picked === i ? " on" : ""}`} disabled={picked !== undefined} onClick={() => setChoices((cs) => { const n = [...cs]; n[step] = i; return n; })}>{c.text}</button>
            ))}
            {picked !== undefined && (
              <>
                <div className="td-out">
                  {scene.choices[picked].outcome}
                  <div style={{ marginTop: 6, fontSize: 12.5, color: "#63636f" }}>Skill used: <b>{scene.choices[picked].skill}</b>{!scene.choices[picked].best && <> · A stronger move: <i>{scene.choices.find((c) => c.best)?.text}</i></>}</div>
                </div>
                <p style={{ margin: "14px 0 0", fontWeight: 700 }}>How much would you enjoy this moment?</p>
                <div className="td-rate">{FACES.map((f, i) => <button key={f} className={ratings[step] === i + 1 ? "on" : ""} onClick={() => setRatings((rs) => { const n = [...rs]; n[step] = i + 1; return n; })}>{f}</button>)}</div>
                <button className="td-btn" style={{ marginTop: 14 }} disabled={!ratings[step]} onClick={() => { const next = step + 1; setStep(next); if (next === drive.scenes.length) void finish(ratings); }}>
                  {step + 1 === drive.scenes.length ? "End my day" : "Next moment →"}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="td-card">
              <div className="td-time">Your day as a {drive.career} is over</div>
              <h1 style={{ marginTop: 6 }}>{result ? `${enjoymentLabel(result.enjoyment)} - ${result.enjoyment}/5` : "Saving…"}</h1>
              {result && <p className="td-muted">You picked the most effective move in {result.judgementPct}% of the moments. Skills you used today: {[...new Set(drive.scenes.map((s, i) => s.choices[choices[i]]?.skill).filter(Boolean))].join(", ")}.</p>}
              {error && <p style={{ color: "#c62828" }}>{error}</p>}
            </div>
            <div className="td-grid">
              <div className="td-card"><b>What people like about it</b><ul className="td-muted">{drive.reality.pros.map((p) => <li key={p}>{p}</li>)}</ul></div>
              <div className="td-card"><b>The honest downsides</b><ul className="td-muted">{drive.reality.cons.map((p) => <li key={p}>{p}</li>)}</ul></div>
            </div>
            <div className="td-card"><b>Good to know</b><ul className="td-muted">{drive.reality.facts.map((p) => <li key={p}>{p}</li>)}</ul>
              <b>Try this month</b><ul className="td-muted">{drive.nextSteps.map((p) => <li key={p}>{p}</li>)}</ul></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="td-btn" onClick={() => setDrive(null)}>Test-drive another career</button>
              <Link className="td-btn ghost" style={{ textDecoration: "none" }} href="/account/decision-room">Compare paths in the Decision Room →</Link>
            </div>
            <p className="td-muted" style={{ fontSize: 12, marginTop: 14 }}>A test-drive is a realistic illustration written with AI from OneGrasp&apos;s career information - real days vary by employer and city.</p>
          </>
        )}
      </div>
    </div>
  );
}
