"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { RL_ASSUMPTIONS, RL_DECISIONS, RL_START, netWorthRL, runYear, type RLState, type YearLog } from "@/lib/money/realLife";
import { LabChart, lakh } from "@/components/money/LabChart";

const KEY = "onegrasp.money.reallife.v1";
const ACCENT = "#0ea05f";

interface Saved {
  state: RLState;
  log: YearLog[];
}

function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function save(v: Saved | null) {
  try {
    if (v) window.localStorage.setItem(KEY, JSON.stringify(v));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: progress lasts for this visit only.
  }
}

export function RealLifeSim() {
  const [game, setGame] = useState<Saved | null>(null);
  const [ready, setReady] = useState(false);
  const [justPlayed, setJustPlayed] = useState<YearLog | null>(null);

  useEffect(() => {
    setGame(load());
    setReady(true);
  }, []);

  if (!ready) return <p style={{ color: "#64748b", fontSize: 14 }}>Loading…</p>;

  const start = () => {
    const g = { state: RL_START, log: [] };
    setGame(g);
    save(g);
    setJustPlayed(null);
  };
  const reset = () => {
    setGame(null);
    save(null);
    setJustPlayed(null);
  };

  if (!game) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <section style={panel}>
          <h2 style={h2}>Ten years, one big decision a year</h2>
          <p style={pText}>You and your partner are 32, with one child, a combined take-home pay of ₹15 lakh a year, ₹13 lakh saved and ₹25,000 a month in rent. Each round is one year. You&apos;ll decide about insurance, a home, your child&apos;s education, your parents&apos; health and more.</p>
          <p style={pText}>There&apos;s no single right answer. Each choice shows its trade-off. The game never recommends a specific product.</p>
          <button onClick={start} style={primary}>Start the 10 years</button>
        </section>
        <Assumptions />
      </div>
    );
  }

  const s = game.state;
  const done = s.year >= RL_DECISIONS.length;
  const decision = RL_DECISIONS[s.year];

  const choose = (optionId: string) => {
    const option = decision.options(s).find((o) => o.id === optionId);
    if (!option || option.disabled) return;
    const { state, surplus } = runYear(s, option);
    const entry: YearLog = { year: state.year, decision: decision.title, choice: option.label, tradeOff: option.tradeOff, netWorth: netWorthRL(state), surplus };
    const g = { state, log: [...game.log, entry] };
    setGame(g);
    save(g);
    setJustPlayed(entry);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#0f172a" }}>{done ? "Ten years complete" : `Year ${s.year + 1} of ${RL_DECISIONS.length}`}</div>
        <button onClick={reset} style={secondary}>Start over</button>
      </div>

      <Snapshot s={s} />

      {justPlayed && (
        <section style={{ ...panel, borderColor: "#bbf7d0" }}>
          <div style={label}>Year {justPlayed.year} result</div>
          <h3 style={h2}>{justPlayed.choice}</h3>
          <p style={pText}>{justPlayed.tradeOff}</p>
          <p style={pText}>This year&apos;s money left after all costs: <b>{lakh(justPlayed.surplus)}</b>. Net worth now: <b>{lakh(justPlayed.netWorth)}</b>.</p>
        </section>
      )}

      {!done && decision && (
        <section style={panel}>
          <div style={label}>Year {decision.year} · {decision.concept}</div>
          <h3 style={h2}>{decision.title}</h3>
          <p style={pText}>{decision.body(s)}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {decision.options(s).map((o) => (
              <button key={o.id} onClick={() => choose(o.id)} disabled={!!o.disabled} style={{ textAlign: "left", background: o.disabled ? "#f8fafc" : "#fff", border: "1px solid #cbd5e1", borderRadius: 12, padding: "12px 14px", cursor: o.disabled ? "not-allowed" : "pointer" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: o.disabled ? "#94a3b8" : "#0f172a" }}>{o.label}</div>
                {o.disabled && <div style={{ fontSize: 12.5, color: "#b45309", marginTop: 3 }}>{o.disabled}</div>}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: "10px 0 0" }}>You&apos;ll see the trade-off after you choose, so decide the way you would in real life.</p>
        </section>
      )}

      {game.log.length > 0 && (
        <section style={panel}>
          <h3 style={h2}>Net worth over the years</h3>
          <LabChart ariaLabel="Net worth at the end of each year" series={[{ label: "Net worth", color: ACCENT, values: [netWorthRL(RL_START), ...game.log.map((l) => l.netWorth)] }]} xLabel={(i) => `Yr ${i}`} yFormat={lakh} />
        </section>
      )}

      {done && <Summary s={s} log={game.log} />}
      {s.otherDebt > 0 && <DebtHelp />}
      {done && <Assumptions />}
    </div>
  );
}

function Snapshot({ s }: { s: RLState }) {
  const items = [
    ["Emergency fund", s.emergency],
    ["Investments", s.invested],
    ["Education fund", s.eduFund],
    ["Home equity", s.home ? s.home.value - s.home.loan : 0],
    ["Debt (other than home)", -s.otherDebt],
    ["Net worth", netWorthRL(s)],
  ] as const;
  return (
    <section style={panel}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {items.map(([k, v]) => (
          <div key={k} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "9px 11px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".04em" }}>{k}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: v < 0 ? "#b91c1c" : "#0f172a" }}>{lakh(v)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12.5, color: "#475569", marginTop: 10 }}>
        <span>Life cover: <b>{s.term ? "₹1 crore term" : s.endowmentPremium ? "₹10 lakh endowment" : "none"}</b></span>
        <span>Parents&apos; health cover: <b>{s.parentsCover ? "yes" : "no"}</b></span>
        <span>Home: <b>{s.home ? (s.home.loan > 0 ? `owned, loan ${lakh(s.home.loan)}` : "owned, loan paid") : "renting"}</b></span>
        <span>Yearly take-home: <b>{lakh(s.income)}</b></span>
      </div>
    </section>
  );
}

function Summary({ s, log }: { s: RLState; log: YearLog[] }) {
  return (
    <section style={panel}>
      <h3 style={h2}>Your ten years</h3>
      <p style={pText}>You ended with a net worth of <b>{lakh(netWorthRL(s))}</b>. Your family was protected by {s.term ? "₹1 crore of term cover" : s.endowmentPremium ? "₹10 lakh of endowment cover" : "no life cover"}, and your parents {s.parentsCover ? "had" : "did not have"} health insurance.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {log.map((l) => (
          <div key={l.year} style={{ borderLeft: `3px solid ${ACCENT}`, padding: "4px 10px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Year {l.year} · {l.decision}: {l.choice}</div>
            <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>{l.tradeOff}</div>
          </div>
        ))}
      </div>
      <p style={{ ...pText, marginTop: 10 }}>Net worth isn&apos;t the only score. A family with life and health cover may have less on paper and still be far safer. Try the 10 years again with different choices and compare.</p>
      <Link href="/account/money/labs/rent-vs-buy" style={{ fontSize: 13, color: ACCENT, fontWeight: 800 }}>Try your own numbers in the Rent vs Buy lab →</Link>
    </section>
  );
}

function DebtHelp() {
  return (
    <section style={{ ...panel, background: "#fffbeb", borderColor: "#fde68a" }}>
      <h3 style={{ ...h2, color: "#78350f" }}>If this is your real life</h3>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "#78350f", lineHeight: 1.6 }}>
        <li>List every debt with its interest rate, and pay the most expensive first.</li>
        <li>Talk to your bank early about restructuring. Avoid new loans to repay old ones.</li>
        <li>If a bank or lender treats you unfairly, complain to it first, then to the RBI through its <a href="https://cms.rbi.org.in/" target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>Complaint Management System</a>.</li>
      </ul>
    </section>
  );
}

function Assumptions() {
  const a = RL_ASSUMPTIONS;
  const pct = (v: number) => `${(v * 100).toFixed(1).replace(/\.0$/, "")}%`;
  return (
    <details style={{ ...panel, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
      <summary style={{ cursor: "pointer", fontWeight: 800, color: "#334155" }}>The game&apos;s assumptions</summary>
      <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
        <li>Pay rises {pct(a.incomeGrowth)} a year; living costs and rent rise {pct(a.costGrowth)}.</li>
        <li>Investments grow {pct(a.investReturn)} a year except in the year-5 fall; savings earn {pct(a.savingsReturn)}; endowment money grows {pct(a.endowmentReturn)}.</li>
        <li>Home: ₹{(a.homePrice / 1e5).toFixed(0)} lakh, rising {pct(a.homeGrowth)} a year, upkeep {pct(a.homeUpkeep)} of its value, loan at {pct(a.homeLoanRate)}, plus {pct(a.upfrontCostPct)} stamp duty and registration.</li>
        <li>Car loan {pct(a.carLoanRate)}, personal loan {pct(a.personalLoanRate)}; cars lose {pct(a.carDepreciation)} of their value a year.</li>
        <li>Insurance premiums are round game numbers, not quotes. Tax is left out.</li>
        <li>Money left over each year tops up a six-month emergency fund first, then is invested.</li>
      </ul>
      <p style={{ margin: "8px 0 0" }}>These are illustrations for learning, not forecasts or advice. Real returns vary and can be negative.</p>
    </details>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 17, fontWeight: 900, color: "#0f172a", margin: "2px 0 6px" };
const pText: CSSProperties = { fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 10px" };
const label: CSSProperties = { fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" };
const primary: CSSProperties = { fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "11px 18px", cursor: "pointer" };
const secondary: CSSProperties = { fontSize: 12.5, fontWeight: 700, color: "#64748b", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "7px 12px", cursor: "pointer" };
