"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  advanceMonth,
  healthScore,
  mulberry32,
  netWorth,
  pickEvent,
  type Jars,
  type SimState,
} from "@/lib/money/simulation";
import { WORLDS, eventsForWorld, type WorldId, type SimEventDef } from "@/data/money/simEvents";
import { loadRun, saveRun, type HistoryRow, type Run } from "@/lib/money/simStore";
import { loadScamTally } from "@/lib/money/localProgress";
import { financialAge, levelFor, personalityFor, PERSONALITY_MIN_MONTHS, type PillarKey } from "@/lib/money/profile";
import { HealthRing } from "@/components/money/HealthRing";

const ACCENT = "#0ea05f";
const YEAR_MONTHS = 12;

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Protect pillar: scam choices in the game plus Scam Shield rounds played on this device. */
function scamAccuracy(s: SimState) {
  const tally = loadScamTally();
  const right = s.scamsAvoided + tally.correct;
  const total = s.scamsAvoided + s.scamsFallen + tally.total;
  return total ? right / total : 0;
}

export function MoneyLifeSim() {
  const [run, setRun] = useState<Run | null>(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"plan" | "event" | "report">("plan");
  const [jars, setJars] = useState<Jars>({ needs: 0, wants: 0, save: 0, grow: 0 });
  const [chosen, setChosen] = useState<{ event: SimEventDef & { resolvedAmount: number }; choiceId: string } | null>(null);
  const [lastReport, setLastReport] = useState<{ before: number; after: number; health: number; healthBefore: number; pillars: Record<string, number>; why: string; choice: string; event: SimEventDef; savingsChange: number; debtChange: number } | null>(null);

  useEffect(() => {
    const saved = loadRun();
    setRun(saved);
    setReady(true);
  }, []);

  const world = run ? WORLDS.find((w) => w.id === run.world)! : null;

  const planDefaults = (state: SimState): Jars => {
    const needs = state.fixedNeeds;
    const save = Math.round(state.monthlyIncome * 0.1);
    const grow = Math.round(state.monthlyIncome * 0.05);
    const wants = Math.max(0, state.cash + state.monthlyIncome - needs - save - grow);
    return { needs, wants, save, grow };
  };

  const startWorld = (id: WorldId) => {
    const w = WORLDS.find((x) => x.id === id)!;
    const fresh: Run = { world: id, seed: Math.floor(Math.random() * 1_000_000), month: 1, state: { ...w.start }, history: [] };
    setRun(fresh);
    saveRun(fresh);
    setJars(planDefaults(fresh.state));
    setPhase("plan");
    setChosen(null);
    setLastReport(null);
  };

  const resetRun = () => {
    setRun(null);
    saveRun(null);
    setPhase("plan");
    setChosen(null);
    setLastReport(null);
  };

  const planTotal = jars.needs + jars.wants + jars.save + jars.grow;
  const available = run ? run.state.cash + run.state.monthlyIncome : 0;
  const planOver = planTotal > available;

  const deck = useMemo(() => (run ? eventsForWorld(run.world) : []), [run]);

  const lockPlan = () => {
    if (!run || planOver) return;
    const rng = mulberry32(run.seed + run.month * 97);
    const event = pickEvent(deck, run.state, rng) as SimEventDef & { resolvedAmount: number };
    setChosen({ event, choiceId: "" });
    setPhase("event");
  };

  const takeChoice = (choiceId: string) => {
    if (!run || !world || !chosen) return;
    const { event } = chosen;
    const choice = event.choices.find((c) => c.id === choiceId)!;
    const marketRng = mulberry32(run.seed * 31 + run.month);
    const marketMove = (marketRng() - 0.5) * 0.2;
    const before = netWorth(run.state);
    const effects = choice.effects(event.resolvedAmount);
    const next = advanceMonth(run.state, jars, effects, marketMove);
    const health = healthScore(next, {
      wantsShare: jars.wants / Math.max(1, run.state.monthlyIncome),
      scamAccuracy: scamAccuracy(next),
      trackerStreak: 0,
      saveTargetMonths: world.saveTargetMonths,
    });
    const healthBefore = run.history.length ? run.history[run.history.length - 1].health : 50;
    const after = netWorth(next);
    const row: HistoryRow = {
      month: run.month, event: event.title, choice: choice.label, netWorth: after, health: health.total,
      netWorthBefore: before,
      plan: { income: run.state.monthlyIncome, ...jars, risky: (effects.debt ?? 0) > 0 || (effects.scamsFallen ?? 0) > 0 },
      pillars: health.pillars as Record<PillarKey, number>,
      concept: event.concept.label,
    };
    const updated: Run = { ...run, state: next, history: [...run.history, row], month: run.month + 1 };
    setRun(updated);
    saveRun(updated);
    setChosen({ event, choiceId });
    setLastReport({
      before, after, health: health.total, healthBefore, pillars: health.pillars, why: choice.why, choice: choice.label, event,
      savingsChange: next.savings + next.invested - run.state.savings - run.state.invested, debtChange: next.debt - run.state.debt,
    });
    setPhase("report");
  };

  const nextMonth = () => {
    if (!run) return;
    setJars(planDefaults(run.state));
    setChosen(null);
    setLastReport(null);
    setPhase("plan");
  };

  if (!ready) return <div style={{ color: "#64748b", fontSize: 14 }}>Loading your run…</div>;

  if (!run || !world) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>
          Choose a world. Each month you split your money into four jars, face one life event, and see the result. Mistakes are free: a high-interest loan in the game costs you nothing real.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {WORLDS.map((w) => (
          <div key={w.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" }}>{w.ages}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>{w.title}</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4, lineHeight: 1.5 }}>{w.summary}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Monthly income {inr(w.start.monthlyIncome)} · Starting cash {inr(w.start.cash)}</div>
            </div>
            <button onClick={() => startWorld(w.id)} style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>
              Start this world
            </button>
          </div>
        ))}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" }}>Working professionals</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>Real Life</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 4, lineHeight: 1.5 }}>Fast-forward 10 years, one round a year: insurance, rent or buy, home loan tenure, a child&apos;s education fund and parents&apos; health costs.</div>
          </div>
          <Link href="/account/money/real-life" style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, borderRadius: 10, padding: "10px 16px", textDecoration: "none" }}>Open Real Life</Link>
        </div>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Growth in this game uses assumed rates (savings about 3.5% a year, invested money about 10% a year, with market moves). These are illustrations, not product returns.</p>
      </div>
    );
  }

  const s = run.state;
  const yearDone = run.month > YEAR_MONTHS;
  // Keep the month-12 report on screen until the learner presses "See your year".
  const finished = yearDone && phase !== "report";
  const lastRow = run.history[run.history.length - 1];
  const health = lastRow?.pillars
    ? { total: lastRow.health, pillars: lastRow.pillars }
    : healthScore(s, { wantsShare: jars.wants / Math.max(1, s.monthlyIncome), scamAccuracy: scamAccuracy(s), trackerStreak: 0, saveTargetMonths: world.saveTargetMonths });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" }}>{world.title}</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{yearDone ? "Year complete" : `Month ${run.month} of ${YEAR_MONTHS}`}</div>
        </div>
        <button onClick={resetRun} style={{ fontSize: 12.5, fontWeight: 700, color: "#64748b", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "7px 12px", cursor: "pointer" }}>Reset this run</button>
      </div>

      <StatusPanel run={run} state={s} health={health.total} pillars={health.pillars as Record<PillarKey, number>} showCredit={world.id === "first-salary"} />

      {finished && (
        <YearSummary history={run.history} netWorth={netWorth(s)} onRestart={resetRun} />
      )}

      {!finished && phase === "plan" && (
        <section style={panel}>
          <h3 style={panelTitle}>1. Split this month&apos;s money into four jars</h3>
          <p style={panelText}>Income arrives: {inr(s.monthlyIncome)}. You also have {inr(s.cash)} in cash. Needs are what you cannot skip. Set the other jars yourself.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            {(["needs", "wants", "save", "grow"] as const).map((jar) => (
              <label key={jar} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#334155", textTransform: "capitalize" }}>
                  {jar === "needs" ? "Needs" : jar === "wants" ? "Wants" : jar === "save" ? "Save" : "Grow"}
                  <span style={{ fontWeight: 500, color: "#64748b" }}> — {jar === "needs" ? "must-haves" : jar === "wants" ? "fun" : jar === "save" ? "emergency and goals" : "long-term growth"}</span>
                </span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={jars[jar]}
                  onChange={(e) => setJars({ ...jars, [jar]: Math.max(0, Number(e.target.value) || 0) })}
                  style={{ fontSize: 15, fontWeight: 700, padding: "8px 10px", borderRadius: 10, border: "1px solid #cbd5e1" }}
                />
              </label>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: planOver ? "#b91c1c" : "#475569" }}>
            Planned {inr(planTotal)} of {inr(available)} available{planOver ? ". You are planning more than you have. Lower a jar before you continue." : "."}
          </div>
          {jars.needs < s.fixedNeeds && (
            <div style={{ marginTop: 6, fontSize: 12.5, color: "#92400e" }}>
              Your needs jar is {inr(s.fixedNeeds - jars.needs)} short of your fixed needs. The shortfall becomes debt this month.
            </div>
          )}
          <button disabled={planOver} onClick={lockPlan} style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: "#fff", background: planOver ? "#94a3b8" : ACCENT, border: "none", borderRadius: 10, padding: "11px 18px", cursor: planOver ? "not-allowed" : "pointer" }}>
            Lock in the plan and see the month
          </button>
        </section>
      )}

      {!finished && phase === "event" && chosen && (
        <section style={panel}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>Life event · {chosen.event.kind}</div>
          <h3 style={panelTitle}>{chosen.event.title}</h3>
          <p style={panelText}>{chosen.event.body}</p>
          <div style={{ fontSize: 13, color: "#334155", marginBottom: 10 }}>Amount involved: {inr(chosen.event.resolvedAmount)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {chosen.event.choices.map((c) => (
              <button key={c.id} onClick={() => takeChoice(c.id)} style={{ textAlign: "left", fontSize: 14, fontWeight: 700, color: "#0f172a", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}>
                {c.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {phase === "report" && lastReport && (
        <section style={panel}>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" }}>Month {run.month - 1} report</div>
          <h3 style={panelTitle}>You chose: {lastReport.choice}</h3>
          <p style={panelText}>{lastReport.why}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 8 }}>
            <Stat label="Net worth change" value={`${lastReport.after >= lastReport.before ? "+" : "−"}${inr(Math.abs(lastReport.after - lastReport.before))}`} />
            <Stat label="Savings + invested" value={`${lastReport.savingsChange >= 0 ? "+" : "−"}${inr(Math.abs(lastReport.savingsChange))}`} />
            <Stat label="Debt" value={`${lastReport.debtChange > 0 ? "+" : lastReport.debtChange < 0 ? "−" : ""}${inr(Math.abs(lastReport.debtChange))}`} />
            <Stat label="Health Score" value={`${lastReport.health} (${lastReport.health >= lastReport.healthBefore ? "+" : ""}${lastReport.health - lastReport.healthBefore})`} />
          </div>
          <p style={{ ...panelText, marginTop: 10 }}>The decision that mattered most this month: <b>{lastReport.choice}</b> when &ldquo;{lastReport.event.title.toLowerCase()}&rdquo;.</p>
          <div style={{ marginTop: 12, fontSize: 13, color: "#334155", lineHeight: 1.6 }}>
            Learn more: <Link href="/account/money/cards" style={{ color: ACCENT, fontWeight: 800 }}>{lastReport.event.concept.label} in the Concept Library →</Link>
          </div>
          <button onClick={nextMonth} style={{ marginTop: 14, fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "11px 18px", cursor: "pointer" }}>
            {run.month > YEAR_MONTHS ? "See your year" : "Next month"}
          </button>
        </section>
      )}

      {run.history.length > 0 && !finished && (
        <section style={panel}>
          <h3 style={panelTitle}>Your months so far</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {run.history.map((h) => (
              <div key={h.month} style={{ fontSize: 13, color: "#334155", display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <span>Month {h.month}: {h.event} ({h.choice})</span>
                <span style={{ fontWeight: 700 }}>Net worth {inr(h.netWorth)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 18px 16px" };
const panelTitle: CSSProperties = { fontSize: 17, fontWeight: 900, color: "#0f172a", margin: "4px 0 6px" };
const panelText: CSSProperties = { fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 10px" };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>{value}</div>
    </div>
  );
}

function StatusPanel({ run, state, health, pillars, showCredit }: { run: Run; state: SimState; health: number; pillars: Record<PillarKey, number>; showCredit: boolean }) {
  const plans = run.history.flatMap((h) => (h.plan ? [h.plan] : []));
  const personality = personalityFor(plans);
  const level = levelFor(run.history.map((h) => h.health));
  return (
    <section style={panel}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        <Stat label="Cash" value={inr(state.cash)} />
        <Stat label="Savings" value={inr(state.savings)} />
        <Stat label="Invested" value={inr(state.invested)} />
        <Stat label="Debt" value={inr(state.debt)} />
        {showCredit && <Stat label="Credit score" value={String(state.creditScore)} />}
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
        <HealthRing total={health} pillars={pillars} size={132} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#334155", minWidth: 0, flex: "1 1 200px" }}>
          <div><b>Financial Age:</b> {financialAge(run.world, health)}</div>
          <div><b>Level:</b> {level ?? `Play ${3 - Math.min(3, run.history.length)} more month(s) to get a level`}</div>
          <div><b>Money Personality:</b> {personality ? `${personality.name} (${personality.pattern})` : `Unlocks after ${PERSONALITY_MIN_MONTHS} months`}</div>
        </div>
      </div>
      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "10px 0 0", lineHeight: 1.5 }}>Protect uses your scam choices in this game and your Scam Shield rounds on this device. Financial Age is a fun estimate from benchmarks we set, not a measurement. Levels use the lowest of your last three monthly scores.</p>
    </section>
  );
}

function YearSummary({ history, netWorth: nw, onRestart }: { history: HistoryRow[]; netWorth: number; onRestart: () => void }) {
  const peak = Math.max(1, ...history.map((h) => Math.abs(h.netWorth)));
  return (
    <section style={panel}>
      <h3 style={panelTitle}>Your year in money</h3>
      <p style={panelText}>Net worth at the end of the year: <b>{inr(nw)}</b>.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {history.map((h) => (
          <div key={h.month} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5 }}>
            <span style={{ width: 62, color: "#475569", fontWeight: 700 }}>Month {h.month}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
              <div style={{ width: `${Math.max(2, (Math.abs(h.netWorth) / peak) * 100)}%`, height: "100%", background: h.netWorth >= 0 ? ACCENT : "#dc2626" }} />
            </div>
            <span style={{ width: 110, textAlign: "right", color: "#334155", fontWeight: 700 }}>{inr(h.netWorth)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <Link href="/account/money/journey" style={{ fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, borderRadius: 10, padding: "11px 18px", textDecoration: "none" }}>Open your Money Journey report</Link>
        <button onClick={onRestart} style={{ fontSize: 14, fontWeight: 800, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 16px", cursor: "pointer" }}>Play again</button>
      </div>
    </section>
  );
}
