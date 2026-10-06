"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { scopedKey } from "@/lib/progress/userStorage";

const ACCENT = "#0ea05f";
const KEY = "onegrasp.money.habits.v1";

const CATEGORIES = ["Food", "Travel", "Fun", "School or college", "Gift", "Rent", "Bills", "Other"] as const;

interface Entry {
  id: string;
  amount: number;
  category: string;
  isNeed: boolean;
  date: string; // YYYY-MM-DD
}

interface Goal {
  id: string;
  title: string;
  target: number;
  saved: number;
  dueDate: string | null;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  startedOn: string | null;
  doneDays: string[];
}

interface HabitsState {
  entries: Entry[];
  goals: Goal[];
  challenges: Challenge[];
}

const CHALLENGES: Omit<Challenge, "startedOn" | "doneDays">[] = [
  { id: "no-spend-weekend", title: "No-Spend Weekend", description: "Go two days without buying any wants. Track each weekend day you keep to it." },
  { id: "save-10-a-day", title: "Save ₹10 a Day", description: "Put ₹10 aside every day for 30 days. A simple start for younger learners." },
  { id: "track-everything", title: "Track Everything", description: "Log every rupee you spend for 30 days, even tiny amounts." },
  { id: "cancel-subscription", title: "Cancel One Subscription", description: "Find one subscription you do not use and cancel it, then keep the saving for 30 days." },
];

const emptyState: HabitsState = {
  entries: [],
  goals: [],
  challenges: CHALLENGES.map((c) => ({ ...c, startedOn: null, doneDays: [] })),
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const todayIso = () => new Date().toISOString().slice(0, 10);
const daysBetween = (fromIso: string, toIso: string) => Math.floor((Date.parse(toIso) - Date.parse(fromIso)) / 86400000);
const uid = () => Math.random().toString(36).slice(2, 10);

function load(): HabitsState {
  try {
    const raw = window.localStorage.getItem(scopedKey(KEY));
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as HabitsState;
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      challenges: CHALLENGES.map((c) => {
        const found = Array.isArray(parsed.challenges) ? parsed.challenges.find((x) => x.id === c.id) : undefined;
        return { ...c, startedOn: found?.startedOn ?? null, doneDays: found?.doneDays ?? [] };
      }),
    };
  } catch {
    return emptyState;
  }
}

function save(state: HabitsState) {
  try {
    window.localStorage.setItem(scopedKey(KEY), JSON.stringify(state));
  } catch {
    // Storage blocked: the tracker works for this visit only.
  }
}

export function HabitsTracker() {
  const [state, setState] = useState<HabitsState>(emptyState);
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [isNeed, setIsNeed] = useState(true);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDue, setGoalDue] = useState("");

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  const update = (next: HabitsState) => {
    setState(next);
    save(next);
  };

  const today = todayIso();
  const weekStart = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  })();

  const week = useMemo(() => state.entries.filter((e) => e.date >= weekStart && e.date <= today), [state.entries, weekStart, today]);
  const weekTotal = week.reduce((s, e) => s + e.amount, 0);
  const weekWants = week.filter((e) => !e.isNeed).reduce((s, e) => s + e.amount, 0);
  const wantsShare = weekTotal ? Math.round((weekWants / weekTotal) * 100) : 0;
  const byCategory = Object.entries(
    week.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const topCategory = byCategory[0];

  const addEntry = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    const entry: Entry = { id: uid(), amount: Math.round(value), category, isNeed, date: today };
    update({ ...state, entries: [entry, ...state.entries] });
    setAmount("");
  };

  const removeEntry = (id: string) => update({ ...state, entries: state.entries.filter((e) => e.id !== id) });

  const addGoal = () => {
    const target = Number(goalTarget);
    if (!goalTitle.trim() || !target || target <= 0) return;
    const goal: Goal = { id: uid(), title: goalTitle.trim(), target: Math.round(target), saved: 0, dueDate: goalDue || null };
    update({ ...state, goals: [goal, ...state.goals] });
    setGoalTitle("");
    setGoalTarget("");
    setGoalDue("");
  };

  const depositGoal = (id: string, value: number) => {
    update({
      ...state,
      goals: state.goals.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + value) } : g)),
    });
  };

  const removeGoal = (id: string) => update({ ...state, goals: state.goals.filter((g) => g.id !== id) });

  const startChallenge = (id: string) =>
    update({ ...state, challenges: state.challenges.map((c) => (c.id === id ? { ...c, startedOn: today, doneDays: [] } : c)) });

  const toggleChallengeDay = (id: string) =>
    update({
      ...state,
      challenges: state.challenges.map((c) => {
        if (c.id !== id || !c.startedOn) return c;
        const done = c.doneDays.includes(today) ? c.doneDays.filter((d) => d !== today) : [...c.doneDays, today];
        return { ...c, doneDays: done };
      }),
    });

  if (!ready) return <div style={{ color: "#64748b", fontSize: 14 }}>Loading your habits…</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
        Everything here is stored only on this device, and only what you type is recorded. The tracker never connects to a bank account or moves money.
      </p>

      <section style={panel}>
        <h2 style={panelTitle}>Log a payment</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          <input type="number" min={1} inputMode="numeric" placeholder="Amount ₹" value={amount} onChange={(e) => setAmount(e.target.value)} style={input} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setIsNeed(true)} style={toggle(isNeed)}>Need</button>
            <button onClick={() => setIsNeed(false)} style={toggle(!isNeed)}>Want</button>
          </div>
          <button onClick={addEntry} style={primaryButton}>Add</button>
        </div>
      </section>

      <section style={panel}>
        <h2 style={panelTitle}>This week</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          <Stat label="Spent" value={inr(weekTotal)} />
          <Stat label="On wants" value={`${wantsShare}%`} />
          <Stat label="Entries" value={String(week.length)} />
        </div>
        <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "12px 0 0" }}>
          {weekTotal === 0
            ? "No payments logged this week yet. Log a few and the weekly insight appears here."
            : topCategory
            ? `Your biggest category this week is ${topCategory[0]} at ${inr(topCategory[1])}. ${wantsShare >= 40 ? `About ${wantsShare}% of what you spent went on wants, which is worth a look.` : `About ${wantsShare}% went on wants.`}`
            : ""}
        </p>
        {state.entries.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {state.entries.slice(0, 12).map((e) => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, fontSize: 13, color: "#334155", borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
                <span>{e.date} · {e.category} · {e.isNeed ? "need" : "want"}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <b>{inr(e.amount)}</b>
                  <button onClick={() => removeEntry(e.id)} style={linkButton}>remove</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={panel}>
        <h2 style={panelTitle}>Goal jars</h2>
        <p style={panelText}>Set a real goal, then record each deposit you actually make. The jar fills with milestones at 25%, 50%, 75% and 100%.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          <input placeholder="Goal, e.g. a cycle" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} style={input} />
          <input type="number" min={1} placeholder="Target ₹" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} style={input} />
          <input type="date" value={goalDue} onChange={(e) => setGoalDue(e.target.value)} style={input} aria-label="Due date" />
          <button onClick={addGoal} style={primaryButton}>Add goal</button>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {state.goals.length === 0 && <div style={{ fontSize: 13, color: "#64748b" }}>No goals yet.</div>}
          {state.goals.map((g) => {
            const pct = Math.round((g.saved / g.target) * 100);
            const milestone = pct >= 100 ? "Goal reached" : pct >= 75 ? "75% reached" : pct >= 50 ? "Halfway" : pct >= 25 ? "25% reached" : "Just started";
            return (
              <div key={g.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a" }}>{g.title}</div>
                    <div style={{ fontSize: 12.5, color: "#64748b" }}>{inr(g.saved)} of {inr(g.target)}{g.dueDate ? ` · by ${g.dueDate}` : ""} · {milestone}</div>
                  </div>
                  <button onClick={() => removeGoal(g.id)} style={linkButton}>remove</button>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", marginTop: 8 }}>
                  <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: ACCENT }} />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {[100, 500, 1000].map((v) => (
                    <button key={v} onClick={() => depositGoal(g.id, v)} style={chip}>+ {inr(v)}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={panel}>
        <h2 style={panelTitle}>30-day challenges</h2>
        <p style={panelText}>Start one, then mark each day you kept to it. Progress is counted from the day you start.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.challenges.map((c) => {
            const elapsed = c.startedOn ? Math.min(30, daysBetween(c.startedOn, today) + 1) : 0;
            const done = c.doneDays.length;
            const pct = Math.round((done / 30) * 100);
            const todayDone = c.doneDays.includes(today);
            return (
              <div key={c.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a" }}>{c.title}</div>
                    <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>{c.description}</div>
                  </div>
                  {!c.startedOn ? (
                    <button onClick={() => startChallenge(c.id)} style={primaryButton}>Start</button>
                  ) : (
                    <button onClick={() => toggleChallengeDay(c.id)} style={todayDone ? doneButton : primaryButton}>
                      {todayDone ? "Done for today ✓" : "Mark today done"}
                    </button>
                  )}
                </div>
                {c.startedOn && (
                  <>
                    <div style={{ height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", marginTop: 10 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: ACCENT }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Day {elapsed} of 30 · {done} days kept</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a", marginTop: 2 }}>{value}</div>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 18px 16px" };
const panelTitle: CSSProperties = { fontSize: 17, fontWeight: 900, color: "#0f172a", margin: "0 0 10px" };
const panelText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 12px" };
const input: CSSProperties = { fontSize: 14, padding: "9px 10px", borderRadius: 10, border: "1px solid #cbd5e1", minWidth: 0 };
const primaryButton: CSSProperties = { fontSize: 13.5, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "9px 14px", cursor: "pointer" };
const doneButton: CSSProperties = { ...primaryButton, background: "#dcfce7", color: "#166534" };
const linkButton: CSSProperties = { fontSize: 12, fontWeight: 700, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0 };
const chip: CSSProperties = { fontSize: 12, fontWeight: 800, color: ACCENT, background: "#ecfdf5", border: `1px solid ${ACCENT}55`, borderRadius: 999, padding: "5px 11px", cursor: "pointer" };
const toggle = (active: boolean): CSSProperties => ({
  flex: 1,
  fontSize: 13,
  fontWeight: 800,
  color: active ? "#fff" : "#334155",
  background: active ? ACCENT : "#fff",
  border: `1px solid ${active ? ACCENT : "#cbd5e1"}`,
  borderRadius: 10,
  padding: "9px 6px",
  cursor: "pointer",
});
