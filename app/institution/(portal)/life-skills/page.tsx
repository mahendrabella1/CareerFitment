"use client";

/** /institution/life-skills - how safe students are with money scams and legal situations, by class. */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { categoryLabel } from "@/lib/auth/formOptions";
import { Bars, Kpi, Section } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { useApi } from "@/components/institution/useApi";
import type { StudentRow } from "@/lib/institution/types";

type Scam = Record<string, Record<string, { correct: number; total: number; rounds: number }>>;

const MODES: { key: string; label: string; slug: string; lesson: string }[] = [
  { key: "swipe", label: "Safe or Scam (UPI, OTP, links)", slug: "swipe", lesson: "Put 10 real messages on the projector - students vote safe or scam, then you reveal the red flags: urgency, links, OTP requests." },
  { key: "family", label: "Family Guard (scams on parents)", slug: "family", lesson: "Role-play a call to a parent claiming a relative is in trouble - students list what to verify before anyone pays." },
  { key: "spot-fake", label: "Spot the Fake (fake sites, apps, offers)", slug: "spot-the-fake", lesson: "Compare a real and a fake bank page side by side - students find the five differences (URL, spelling, urgency, logo, requests)." },
  { key: "the-call", label: "The Call (phone fraud)", slug: "the-call", lesson: "Play a fake 'bank/courier/police' call script - students practise the three-word answer: hang up, verify, report (1930)." },
  { key: "too-good", label: "Too Good to Be True (jobs, prizes, investments)", slug: "too-good-to-be-true", lesson: "Show three 'earn from home' and 'double your money' ads - students calculate why each cannot be true." },
];

export default function LifeSkillsPage() {
  const { data, error } = useApi<{ students: StudentRow[]; scam: Scam }>("/api/institution/life-skills");
  const [compose, setCompose] = useState<ComposePreset | null>(null);

  const v = useMemo(() => {
    if (!data) return null;
    const rows = data.students.filter((s) => !s.archived);
    const acc = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);
    const perStudent = rows.map((s) => {
      const modes = data.scam[s.uid] ?? {};
      const c = Object.values(modes).reduce((x, m) => x + m.correct, 0), t = Object.values(modes).reduce((x, m) => x + m.total, 0);
      return { s, correct: c, total: t, accuracy: acc(c, t) };
    });
    const practised = perStudent.filter((p) => p.total > 0);
    const byMode = MODES.map((m) => {
      let c = 0, t = 0, students = 0;
      for (const r of rows) { const x = data.scam[r.uid]?.[m.key]; if (x) { c += x.correct; t += x.total; students++; } }
      return { ...m, accuracy: acc(c, t), students, answered: t };
    });
    const classMap = new Map<string, { c: number; t: number; n: number }>();
    for (const p of practised) { const k = p.s.category || "unknown"; const e = classMap.get(k) ?? { c: 0, t: 0, n: 0 }; e.c += p.correct; e.t += p.total; e.n++; classMap.set(k, e); }
    const byClass = [...classMap.entries()].map(([k, e]) => ({ label: k === "unknown" ? "Not stated" : categoryLabel(k), value: acc(e.c, e.t), note: `${e.n} students` }));
    const atRisk = practised.filter((p) => p.total >= 10 && p.accuracy < 60).sort((a, b) => a.accuracy - b.accuracy);
    const legal = rows.filter((s) => s.legal && s.legal.done > 0);
    const areaMap = new Map<string, { d: number; s: number }>();
    for (const s of legal) for (const [a, x] of Object.entries(s.legal!.byArea)) { const e = areaMap.get(a) ?? { d: 0, s: 0 }; e.d += x.done; e.s += x.safest; areaMap.set(a, e); }
    const legalAreas = [...areaMap.entries()].map(([a, e]) => ({ label: a, value: acc(e.s, e.d), note: `${e.d} answered` })).sort((a, b) => a.value - b.value);
    const legalTotals = legal.reduce((x, s) => ({ d: x.d + s.legal!.done, s: x.s + s.legal!.safest }), { d: 0, s: 0 });
    const money = rows.filter((s) => (s.courses.money?.done ?? 0) > 0);
    const weakest = [...byMode].filter((m) => m.answered >= 10).sort((a, b) => a.accuracy - b.accuracy)[0];
    const c = practised.reduce((x, p) => x + p.correct, 0), t = practised.reduce((x, p) => x + p.total, 0);
    return { rows, practised, overall: acc(c, t), byMode, byClass, atRisk, legal, legalAreas, legalRate: acc(legalTotals.s, legalTotals.d), money, weakest };
  }, [data]);

  if (error) return <div className="ip-alert bad">{error}</div>;
  if (!v) return <div className="ip-empty">Loading life-skills results…</div>;
  const pct = (n: number) => (v.rows.length ? Math.round((n / v.rows.length) * 100) : 0);

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Life skills</h1>
          <p className="ip-sub">How safe your students are with money scams and legal situations - from the Scam Shield games and &quot;What would you do?&quot; scenarios they play.</p>
        </div>
      </div>

      <div className="ip-kpis">
        <Kpi icon="shield" label="Scam spotting accuracy" value={v.practised.length ? `${v.overall}%` : "-"} sub={`${v.practised.length} students practised (${pct(v.practised.length)}%)`} />
        <Kpi icon="flag" label="At risk of scams" value={v.atRisk.length} sub="Below 60% accuracy over 10+ answers" />
        <Kpi icon="scale" label="Safest legal choices" value={v.legal.length ? `${v.legalRate}%` : "-"} sub={`${v.legal.length} students practised legal scenarios`} />
        <Kpi icon="wallet" label="Money course" value={v.money.length} sub="students have started Money skills" />
      </div>

      {v.weakest && (
        <Section title={`Run this class session: ${v.weakest.label}`} icon="sparkle" aside={`weakest area - ${v.weakest.accuracy}% correct`} style={{ marginTop: 12 }}>
          <p style={{ margin: "0 0 10px", lineHeight: 1.6 }}>{v.weakest.lesson}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link className="ip-btn ghost sm" style={{ textDecoration: "none" }} href={`/account/money/scam-shield/${v.weakest.slug}`} target="_blank">Open the game for the projector ↗</Link>
            {v.atRisk.length > 0 && (
              <button className="ip-btn sm" onClick={() => setCompose({
                audience: { type: "students", uids: v.atRisk.map((p) => p.s.uid), label: `Students at risk of scams (${v.atRisk.length})` },
                kind: "recommendation", title: "Practise spotting scams this week", link: `/account/money/scam-shield/${v.weakest!.slug}`,
                body: "Hi {name}, scams are getting harder to spot. Play 3 rounds of the Scam Shield game this week - it takes 5 minutes and could save you or your family real money.",
              })}>Send practice to the {v.atRisk.length} at-risk students</button>
            )}
          </div>
        </Section>
      )}

      <div className="ip-grid2e">
        <Section title="Scam Shield accuracy by game" icon="shield">
          <Bars rows={v.byMode.filter((m) => m.answered).map((m) => ({ label: m.label, value: m.accuracy, note: `${m.students} students` }))} format={(n) => `${n}%`} empty="No one has played Scam Shield yet - share it in class." />
        </Section>
        <Section title="Scam spotting by class" icon="school">
          <Bars rows={v.byClass} format={(n) => `${n}%`} empty="No results yet." />
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Legal scenarios: safest choices by topic" icon="scale" aside="counts only - never which choice">
          <Bars rows={v.legalAreas} format={(n) => `${n}%`} empty="No one has practised the legal scenarios yet." />
        </Section>
        <Section title="Students most at risk of scams" icon="flag">
          {v.atRisk.length === 0 ? <div className="ip-muted">No one is below 60% (among students with 10+ answers).</div> : (
            <div className="ip-table-wrap">
              <table className="ip-table">
                <thead><tr><th>Student</th><th>Class</th><th className="num">Accuracy</th></tr></thead>
                <tbody>
                  {v.atRisk.slice(0, 12).map((p) => (
                    <tr key={p.s.uid}>
                      <td className="ip-name"><Link href={`/institution/students/${p.s.uid}`}>{p.s.name}</Link></td>
                      <td>{p.s.category ? categoryLabel(p.s.category) : "-"}</td>
                      <td className="num"><span className="ip-pill bad">{p.accuracy}%</span> <small className="ip-muted">of {p.total}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
      <p className="ip-muted" style={{ fontSize: 12, marginTop: 10 }}><Icon name="info" size={13} /> Legal practice is recorded as counts only (scenarios finished, safest choices) - students are told this on the scenarios page.</p>
      <ComposeMessage preset={compose} onClose={() => setCompose(null)} />
    </>
  );
}
