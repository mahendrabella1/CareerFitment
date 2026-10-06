"use client";

/**
 * /account/decision-room - Family Decision Room: two futures side by side
 * (the student's fit, their own goal, their test-drive, what their parents
 * want, and the route, cost, pay and AI outlook of each), a choice with
 * reasons, and the parents' answer through their family page.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import { apiFetch } from "@/lib/institution/client";
import { HowItWorks } from "@/components/HowItWorks";
import { AREA_BY_KEY } from "@/lib/institution/features";
import { pathView, type FamilyDecision, type PathView } from "@/lib/decisionRoom";
import { enjoymentLabel, type TestDriveResult } from "@/lib/testDrive";

const CSS = `
.dr{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif}
.dr *{box-sizing:border-box}
.dr-top{display:flex;align-items:center;gap:12px;padding:12px 20px;background:#fff;border-bottom:1px solid #ececef}
.dr-wrap{max-width:980px;margin:0 auto;padding:22px 16px 60px}
.dr-card{background:#fff;border:1px solid #ececef;border-radius:18px;padding:20px;margin-bottom:14px}
.dr h1{font-size:26px;margin:0 0 4px;letter-spacing:-.015em}
.dr-muted{color:#63636f;font-size:14px;line-height:1.6}
.dr-pick{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.dr-in{width:100%;border:1px solid #ececef;border-radius:12px;padding:11px 13px;font:inherit;font-size:15px;background:#fff}
.dr-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.dr-chip{border:1px solid #ececef;background:#fff;border-radius:999px;padding:5px 11px;font:inherit;font-size:12.5px;font-weight:700;color:#3d3d45;cursor:pointer}
.dr-chip:hover{border-color:#4c5fd5;color:#4c5fd5}
.dr-tbl-wrap{overflow-x:auto}
.dr-tbl{width:100%;border-collapse:collapse;font-size:14px;min-width:560px}
.dr-tbl th,.dr-tbl td{text-align:left;vertical-align:top;padding:11px 12px;border-top:1px solid #f0f0f3;line-height:1.5}
.dr-tbl thead th{border-top:none;font-size:16px}
.dr-tbl tbody th{width:26%;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#63636f}
.dr-tbl td{width:37%}
.dr-sec td,.dr-sec th{background:#f8f8fb;font-size:11.5px !important;color:#4c5fd5 !important}
.dr-yes{color:#1f7a55;font-weight:800}.dr-mid{color:#9a6700;font-weight:800}.dr-no{color:#8a8a96}
.dr-btn{background:#4c5fd5;color:#fff;border:none;border-radius:12px;padding:11px 18px;font:inherit;font-size:15px;font-weight:800;cursor:pointer;text-decoration:none}
.dr-btn.ghost{background:#fff;color:#3d3d45;border:1px solid #ececef}
.dr-btn:disabled{opacity:.5}
.dr-choose{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.dr-choose button{flex:1;min-width:150px;border:1.5px solid #ececef;background:#fff;border-radius:12px;padding:11px;font:inherit;font-weight:800;cursor:pointer}
.dr-choose button.on{border-color:#4c5fd5;background:#eef0fc;color:#2f3fae}
.dr-note{border-radius:14px;padding:13px 15px;line-height:1.55;font-size:14px}
@media (max-width:640px){.dr-pick{grid-template-columns:1fr}.dr-tbl{min-width:0;font-size:12.5px}.dr-tbl th,.dr-tbl td{padding:8px 6px}.dr-tbl thead th{font-size:13.5px}.dr-tbl tbody th{font-size:10px;letter-spacing:.02em}}
`;

const CHANGE = { high: "A lot - many tasks will be done with AI; the skills below matter", medium: "Partly - some tasks will be automated", low: "Little - the core work stays human" } as const;
const LEVEL = ["Less so", "Partly", "Strongly"];

export default function DecisionRoomPage() {
  const { user, profile, loading } = useAuth();
  const [data, setData] = useState<{ decision: FamilyDecision | null; parent: { areas: string[]; priorities: string[]; firmness: string; name: string; relation: string } | null; testDrives: { career: string; enjoyment: number }[] } | null>(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [chosen, setChosen] = useState<"A" | "B" | "undecided">("undecided");
  const [reasons, setReasons] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    apiFetch<NonNullable<typeof data>>("/api/student/decision").then((d) => {
      setData(d);
      if (d.decision) { setA(d.decision.pathA); setB(d.decision.pathB); setChosen(d.decision.chosen); setReasons(d.decision.reasons); }
    }).catch((e) => setMsg(e instanceof Error ? e.message : "Couldn't load your Decision Room."));
  }, [user]);

  const la = profile?.latestAssessment;
  const fits = useMemo(() => (la?.customFields?.length ? la.customFields.map((f) => ({ name: f.name, pct: Math.round(f.fit) })) : (la?.matches ?? []).map((m) => ({ name: m.title, pct: Math.round(m.fitmentPct) }))), [la]);
  const goal = la?.desiredCareer || profile?.desiredCareer || null;
  const drives = useMemo(() => data?.testDrives ?? Object.values((profile as unknown as { testDrives?: Record<string, TestDriveResult> })?.testDrives ?? {}), [data, profile]);
  const parentAreas = (data?.parent?.areas ?? []).filter((k) => k !== "open");
  const ctx = { fits, goal, testDrives: drives, parentAreas, parentPriorities: (data?.parent?.priorities ?? []).filter((p) => p !== "Child's own interest") };
  const suggestions = [...new Set([goal, ...fits.map((f) => f.name), la?.topCareer, ...drives.map((d) => d.career), ...parentAreas.map((k) => AREA_BY_KEY[k]?.label)].filter(Boolean) as string[])].slice(0, 10);

  const va = a.trim() ? pathView(a.trim(), ctx) : null;
  const vb = b.trim() ? pathView(b.trim(), ctx) : null;
  const saved = data?.decision;
  const unchanged = !!saved && saved.pathA === a.trim() && saved.pathB === b.trim() && saved.chosen === chosen && saved.reasons === reasons.trim();

  async function save() {
    setBusy(true); setMsg("");
    try {
      const r = await apiFetch<{ decision: FamilyDecision }>("/api/student/decision", { method: "POST", body: JSON.stringify({ pathA: a, pathB: b, chosen, reasons }) });
      setData((d) => (d ? { ...d, decision: r.decision } : d));
      setMsg("Saved - your parents can now see this sheet on their family page.");
    } catch (e) { setMsg(e instanceof Error ? e.message : "Couldn't save."); }
    finally { setBusy(false); }
  }

  const row = (label: string, f: (v: PathView) => React.ReactNode) => (
    <tr key={label}><th scope="row">{label}</th><td>{va ? f(va) : "-"}</td><td>{vb ? f(vb) : "-"}</td></tr>
  );
  const section = (label: string) => <tr className="dr-sec"><th colSpan={3}>{label}</th></tr>;
  const fact = (k: "route" | "yearsToFirstJob" | "studyCost" | "startingPay" | "tenYearPay") => (v: PathView) => v.facts ? v.facts[k] : <span className="dr-no">No figures for this path yet</span>;

  return (
    <div className="dr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="dr-top"><Link href="/account"><Logo height={32} /></Link><span style={{ flex: 1 }} /><Link href="/account" style={{ fontWeight: 700, color: "#3d3d45", textDecoration: "none" }}>← Dashboard</Link></header>
      <div className="dr-wrap">
        {loading ? <p className="dr-muted">Loading…</p> : !user || !profile ? <p className="dr-muted">Please <Link href="/signin">sign in</Link> to open the Decision Room.</p> : (
          <>
            <div className="dr-card">
              <h1>Family Decision Room</h1>
              <p className="dr-muted">Two possible futures, side by side - what your report says, what you enjoyed, what your parents hope for, and what each path really takes. Decide together, with facts.</p>
            </div>
            <HowItWorks id="decision-room" steps={[
              "Pick the two paths your family is choosing between - your report's best fits, your own goal and your parents' wishes are suggested.",
              "Read the comparison together: your fit, your test-drive, your parents' priorities, then the route, years, cost, pay and how AI will change the work.",
              "Choose a path (or 'Still deciding') and write your reasons in your own words, then save.",
              "Your parents see the sheet on their family page and answer 'We agree' or 'Let's discuss'. Their answer appears here.",
            ]} sync="Your parents see the sheet through the family link your school shared; your school sees your choice and your parents' answer, so a counsellor can help if you disagree." />

            <div className="dr-card">
              <b>The two paths</b>
              <div className="dr-pick" style={{ marginTop: 10 }}>
                {([["Path A", a, setA], ["Path B", b, setB]] as const).map(([label, val, set]) => (
                  <div key={label}>
                    <input className="dr-in" maxLength={80} placeholder={`${label}, e.g. ${label === "Path A" ? "Software Engineer" : "Doctor"}`} value={val} onChange={(e) => set(e.target.value)} />
                    <div className="dr-chips">{suggestions.filter((s) => s !== a && s !== b).slice(0, 6).map((s) => <button key={s} className="dr-chip" onClick={() => set(s)}>{s}</button>)}</div>
                  </div>
                ))}
              </div>
              {!data?.parent && <p className="dr-muted" style={{ fontSize: 13, marginTop: 12 }}>Your parents haven&apos;t filled in the family survey yet, so their wishes aren&apos;t shown. Your school shares the survey link with them.</p>}
            </div>

            {(va || vb) && (
              <div className="dr-card dr-tbl-wrap" style={{ padding: "8px 8px 4px" }}>
                <table className="dr-tbl">
                  <thead><tr><th /><th>{va?.label ?? "Path A"}</th><th>{vb?.label ?? "Path B"}</th></tr></thead>
                  <tbody>
                    {section("You")}
                    {row("Fit from your report", (v) => v.fitPct != null ? <span className="dr-yes">{v.fitPct}% fit</span> : <span className="dr-no">Not among your best fits</span>)}
                    {row("Your own goal", (v) => v.isGoal ? <span className="dr-yes">✓ Matches your goal</span> : <span className="dr-no">-</span>)}
                    {row("Your test-drive", (v) => v.enjoyment != null ? <span className={v.enjoyment >= 3.4 ? "dr-yes" : v.enjoyment >= 2.6 ? "dr-mid" : "dr-no"}>{enjoymentLabel(v.enjoyment)} ({v.enjoyment}/5)</span> : <Link href="/account/test-drive">Test-drive it →</Link>)}
                    {section("Your parents")}
                    {row("What they hope for", (v) => !data?.parent ? <span className="dr-no">Survey not filled</span> : data.parent.areas.includes("open") ? <span className="dr-yes">Whatever you choose</span> : v.parentsWant ? <span className="dr-yes">✓ One of their choices</span> : <span className="dr-mid">Not what they named</span>)}
                    {ctx.parentPriorities.map((p) => row(p, (v) => { const l = v.priorities.find((x) => x.priority === p)?.level ?? 0; return <span className={l === 2 ? "dr-yes" : l === 1 ? "dr-mid" : "dr-no"}>{LEVEL[l]}</span>; }))}
                    {section("The path")}
                    {row("Area", (v) => v.area?.label ?? <span className="dr-no">Not recognised - try a more common name</span>)}
                    {row("Route", fact("route"))}
                    {row("Years to first job", fact("yearsToFirstJob"))}
                    {row("Cost of study", fact("studyCost"))}
                    {row("Starting pay", fact("startingPay"))}
                    {row("Pay after ~10 years", fact("tenYearPay"))}
                    {row("How much AI will change it by 2035", (v) => v.area ? <>{CHANGE[v.area.change]}<div className="dr-muted" style={{ fontSize: 12.5 }}>Skills to build: {v.area.futureSkills.join(", ")}</div></> : "-")}
                  </tbody>
                </table>
                <p className="dr-muted" style={{ fontSize: 12, padding: "4px 12px 10px" }}>Costs and pay are indicative ranges for India and vary a lot by college, city, skill and year - use them to start the conversation, then check the colleges you&apos;re considering.</p>
              </div>
            )}

            {va && vb && (
              <div className="dr-card">
                <b>Our decision</b>
                <div className="dr-choose">
                  <button className={chosen === "A" ? "on" : ""} onClick={() => setChosen("A")}>{va.label}</button>
                  <button className={chosen === "B" ? "on" : ""} onClick={() => setChosen("B")}>{vb.label}</button>
                  <button className={chosen === "undecided" ? "on" : ""} onClick={() => setChosen("undecided")}>Still deciding</button>
                </div>
                <textarea className="dr-in" rows={3} maxLength={800} placeholder="Why? In your own words - what matters most to you about this choice." value={reasons} onChange={(e) => setReasons(e.target.value)} />
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                  <button className="dr-btn" disabled={busy || unchanged} onClick={() => void save()}>{busy ? "Saving…" : saved ? "Save changes" : "Save and share with my parents"}</button>
                  {saved && !unchanged && <span className="dr-muted" style={{ fontSize: 12.5 }}>Saving a change asks your parents to answer again.</span>}
                </div>
                {msg && <p className="dr-muted" style={{ marginTop: 10 }}>{msg}</p>}
              </div>
            )}

            {saved && (
              <div className="dr-card">
                <b>Your parents&apos; answer</b>
                {saved.parentResponse ? (
                  <div className="dr-note" style={{ marginTop: 10, background: saved.parentResponse.answer === "agree" ? "#eaf6f0" : "#fdf3e2" }}>
                    <b>{saved.parentResponse.answer === "agree" ? "✓ We agree with your choice" : "Let's sit down and discuss this"}</b>
                    {saved.parentResponse.comment && <div style={{ marginTop: 4 }}>&ldquo;{saved.parentResponse.comment}&rdquo;</div>}
                    <div className="dr-muted" style={{ fontSize: 12, marginTop: 4 }}>{data?.parent?.name ? `${data.parent.name} · ` : ""}{new Date(saved.parentResponse.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                ) : <p className="dr-muted">Waiting for your parents. They see your sheet on their family page - the link your school sent them. Show it to them, or ask your school to resend it.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
