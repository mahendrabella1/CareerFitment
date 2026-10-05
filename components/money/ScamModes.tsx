"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { recordScamRound, type ScamMode } from "@/lib/money/clientProgress";
import { addScamRound } from "@/lib/money/localProgress";
import { CALL_SCRIPTS, OFFER_ITEMS, SCAM_OF_THE_WEEK, SPOT_PAIRS, type FakeScreen } from "@/data/money/scamModes";

const GREEN = "#16a34a";
const RED = "#dc2626";

/** Shown at the end of every Scam Shield game. */
export function IfScammed() {
  return (
    <div style={{ marginTop: 20, borderRadius: 12, padding: "14px 16px", background: "#fef3c7", color: "#78350f", fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 900, marginBottom: 4 }}>If this ever happens for real</div>
      <ol style={{ margin: 0, paddingLeft: 18 }}>
        <li>Call the national cyber fraud helpline <b>1930</b> straight away. Acting fast improves the chance of freezing the money.</li>
        <li>Report it at <a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>cybercrime.gov.in</a>.</li>
        <li>Tell your bank and block the card or UPI.</li>
        <li>Tell a parent or trusted adult. Being scammed is nothing to be ashamed of.</li>
      </ol>
      <div style={{ marginTop: 6 }}>Got a suspicious call or message but haven&apos;t lost money? Report it on <a href="https://sancharsaathi.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>Sanchar Saathi (Chakshu)</a>.</div>
    </div>
  );
}

function useRecord(mode: ScamMode) {
  const { user } = useAuth();
  // Called from click handlers once per finished round.
  return (correct: number, total: number) => {
    addScamRound(mode, correct, total);
    if (user?.uid) recordScamRound(user.uid, mode, { correct, total, accuracyPercent: total ? Math.round((correct / total) * 100) : 0 }).catch(() => undefined);
  };
}

function Screen({ s, picked, onPick, state }: { s: FakeScreen; picked: boolean; onPick: () => void; state: "idle" | "right" | "wrong" | "real" }) {
  const border = state === "right" ? GREEN : state === "wrong" ? RED : picked ? "#0f172a" : "#cbd5e1";
  return (
    <button onClick={onPick} disabled={state !== "idle"} style={{ flex: "1 1 220px", minWidth: 0, textAlign: "left", background: "#fff", border: `2px solid ${border}`, borderRadius: 16, padding: 0, cursor: state === "idle" ? "pointer" : "default", overflow: "hidden" }}>
      <div style={{ background: "#f1f5f9", padding: "6px 12px", fontSize: 11.5, fontWeight: 800, color: "#475569", display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span>{s.app}</span>{s.from && <span style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{s.from}</span>}
      </div>
      <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {s.lines.map((l, i) => (
          <div key={i} style={{ fontSize: s.mono ? 13 : 14, fontFamily: s.mono ? "ui-monospace, Menlo, Consolas, monospace" : "inherit", color: "#0f172a", lineHeight: 1.45, overflowWrap: "anywhere", fontWeight: i === 0 && !s.mono ? 700 : 400 }}>{l}</div>
        ))}
      </div>
    </button>
  );
}

export function SpotTheFake() {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<"a" | "b" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const record = useRecord("spot-fake");
  const pair = SPOT_PAIRS[i];

  const pick = (side: "a" | "b") => {
    if (choice) return;
    setChoice(side);
    if (side === pair.fake) setScore((s) => s + 1);
  };
  const next = () => {
    if (i < SPOT_PAIRS.length - 1) {
      setI(i + 1);
      setChoice(null);
    } else {
      setDone(true);
      record(score, SPOT_PAIRS.length);
    }
  };

  if (done) {
    return (
      <div>
        <Result correct={score} total={SPOT_PAIRS.length} />
        <button onClick={() => { setI(0); setChoice(null); setScore(0); setDone(false); }} style={primary}>Play again</button>
        <IfScammed />
      </div>
    );
  }

  const stateFor = (side: "a" | "b") => (!choice ? "idle" : side === pair.fake ? (choice === side ? "right" : "wrong") : "real");
  return (
    <div>
      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 6px" }}>{i + 1} of {SPOT_PAIRS.length} · {pair.topic}</p>
      <p style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>{pair.prompt} Tap the fake.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Screen s={pair.a} picked={choice === "a"} onPick={() => pick("a")} state={stateFor("a")} />
        <Screen s={pair.b} picked={choice === "b"} onPick={() => pick("b")} state={stateFor("b")} />
      </div>
      {choice && (
        <div style={{ marginTop: 14, borderLeft: `4px solid ${choice === pair.fake ? GREEN : RED}`, background: "#f8fafc", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: choice === pair.fake ? GREEN : RED }}>{choice === pair.fake ? "Spotted it." : "That one was the real screen."}</div>
          <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "4px 0 0" }}>{pair.lesson}</p>
          <button onClick={next} style={{ ...primary, marginTop: 10 }}>{i < SPOT_PAIRS.length - 1 ? "Next pair" : "See my score"}</button>
        </div>
      )}
    </div>
  );
}

export function TheCall() {
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [nodeId, setNodeId] = useState<string>("");
  const [log, setLog] = useState<{ who: "caller" | "you"; text: string }[]>([]);
  const [end, setEnd] = useState<{ safe: boolean; text: string } | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const record = useRecord("the-call");
  const script = CALL_SCRIPTS.find((s) => s.id === scriptId);

  const start = (id: string) => {
    const s = CALL_SCRIPTS.find((x) => x.id === id)!;
    setScriptId(id);
    setNodeId(s.start);
    setLog([{ who: "caller", text: s.nodes[s.start].caller }]);
    setEnd(null);
  };

  const answer = (label: string, nextId?: string, ending?: { safe: boolean; text: string }) => {
    if (!script) return;
    const newLog = [...log, { who: "you" as const, text: label }];
    if (ending) {
      setLog(newLog);
      setEnd(ending);
      const r = { ...results, [script.id]: ending.safe };
      setResults(r);
      if (Object.keys(r).length === CALL_SCRIPTS.length) record(Object.values(r).filter(Boolean).length, CALL_SCRIPTS.length);
      return;
    }
    if (nextId) {
      setNodeId(nextId);
      setLog([...newLog, { who: "caller", text: script.nodes[nextId].caller }]);
    }
  };

  if (!script) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Pick a call. Choose what you&apos;d say at each step. Any code shown in the game, such as 123456, is fake.</p>
        {CALL_SCRIPTS.map((s) => (
          <button key={s.id} onClick={() => start(s.id)} style={{ textAlign: "left", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", cursor: "pointer" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>📞 {s.title}</div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 3 }}>{s.intro}{s.id in results ? (results[s.id] ? " · You stayed safe ✓" : " · You got caught last time") : ""}</div>
          </button>
        ))}
        {Object.keys(results).length > 0 && <IfScammed />}
      </div>
    );
  }

  const node = script.nodes[nodeId];
  return (
    <div>
      <div style={{ background: "#0f172a", color: "#e2e8f0", borderRadius: 16, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Incoming call</div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{script.callerId}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {log.map((m, k) => (
            <div key={k} style={{ alignSelf: m.who === "caller" ? "flex-start" : "flex-end", maxWidth: "88%", background: m.who === "caller" ? "#1e293b" : "#166534", borderRadius: 12, padding: "8px 12px", fontSize: 13.5, lineHeight: 1.5 }}>
              {m.who === "caller" ? "📞 " : "You: "}{m.text}
            </div>
          ))}
        </div>
      </div>
      {!end && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {node.options.map((o) => (
            <button key={o.label} onClick={() => answer(o.label, o.next, o.end)} style={{ textAlign: "left", fontSize: 14, fontWeight: 700, color: "#0f172a", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, padding: "11px 14px", cursor: "pointer" }}>{o.label}</button>
          ))}
        </div>
      )}
      {end && (
        <div style={{ marginTop: 12, borderLeft: `4px solid ${end.safe ? GREEN : RED}`, background: "#f8fafc", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: end.safe ? GREEN : RED }}>{end.safe ? "You stayed safe" : "You got scammed (in the game)"}</div>
          <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "4px 0 0" }}>{end.text}</p>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "6px 0 0" }}><b>Remember:</b> {script.lesson}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            <button onClick={() => start(script.id)} style={secondary}>Try this call again</button>
            <button onClick={() => setScriptId(null)} style={primary}>Choose another call</button>
          </div>
        </div>
      )}
      {end && <IfScammed />}
    </div>
  );
}

export function TooGoodToBeTrue() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const record = useRecord("too-good");
  const correctIds = useMemo(() => OFFER_ITEMS.filter((o) => ratings[o.id] !== undefined && Math.abs(ratings[o.id] - o.expert) <= 1).map((o) => o.id), [ratings]);
  const allRated = OFFER_ITEMS.every((o) => ratings[o.id] !== undefined);

  const check = () => {
    setChecked(true);
    record(correctIds.length, OFFER_ITEMS.length);
  };

  return (
    <div>
      <p style={{ fontSize: 14, color: "#475569", margin: "0 0 12px", lineHeight: 1.6 }}>Rate each offer from <b>1 (safe)</b> to <b>5 (scam)</b>. Within one point of our rating counts as right.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {OFFER_ITEMS.map((o) => {
          const r = ratings[o.id];
          const ok = checked && r !== undefined && Math.abs(r - o.expert) <= 1;
          return (
            <div key={o.id} style={{ border: `1px solid ${checked ? (ok ? "#86efac" : "#fca5a5") : "#e2e8f0"}`, borderRadius: 14, padding: "12px 14px", background: "#fff" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".04em" }}>{o.channel}</div>
              <p style={{ fontSize: 14.5, color: "#0f172a", lineHeight: 1.5, margin: "4px 0 10px" }}>{o.text}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} role="radio" aria-checked={r === n} disabled={checked} onClick={() => setRatings({ ...ratings, [o.id]: n })}
                    style={{ width: 40, height: 36, borderRadius: 9, fontWeight: 900, fontSize: 14, cursor: checked ? "default" : "pointer", border: `1px solid ${r === n ? "#0f172a" : "#cbd5e1"}`, background: r === n ? (n <= 2 ? "#dcfce7" : n === 3 ? "#fef9c3" : "#fee2e2") : "#fff", color: "#0f172a" }}>
                    {n}
                  </button>
                ))}
              </div>
              {checked && (
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.55, margin: "8px 0 0" }}>
                  <b style={{ color: ok ? GREEN : RED }}>Our rating: {o.expert}.</b> {o.why}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!checked ? (
        <button onClick={check} disabled={!allRated} style={{ ...primary, marginTop: 14, opacity: allRated ? 1 : 0.5, cursor: allRated ? "pointer" : "not-allowed" }}>{allRated ? "Check my ratings" : `Rate all ${OFFER_ITEMS.length} offers to check`}</button>
      ) : (
        <>
          <Result correct={correctIds.length} total={OFFER_ITEMS.length} />
          <button onClick={() => { setRatings({}); setChecked(false); }} style={primary}>Play again</button>
          <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, marginTop: 12 }}>
            Check any deposit scheme on RBI&apos;s <a href="https://sachet.rbi.org.in/" target="_blank" rel="noreferrer" style={{ color: "#0ea05f", fontWeight: 800 }}>Sachet portal</a>, and any adviser or broker on <a href="https://www.sebi.gov.in/intermediaries.html" target="_blank" rel="noreferrer" style={{ color: "#0ea05f", fontWeight: 800 }}>SEBI&apos;s list of registered intermediaries</a>. This game teaches warning signs. It doesn&apos;t recommend any product.
          </p>
          <IfScammed />
        </>
      )}
    </div>
  );
}

export function ScamOfTheWeekCard({ compact = false }: { compact?: boolean }) {
  const [latest, ...older] = SCAM_OF_THE_WEEK;
  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const card = (w: typeof latest, big: boolean) => (
    <div key={w.date} style={{ border: `1px solid ${big ? "#fecaca" : "#e2e8f0"}`, background: big ? "#fff7f7" : "#fff", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: big ? RED : "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>{big ? "Scam of the week · " : ""}{fmt(w.date)}</div>
      <div style={{ fontSize: big ? 17 : 15, fontWeight: 900, color: "#0f172a", marginTop: 3 }}>{w.title}</div>
      <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "6px 0" }}>{w.what}</p>
      {(big || !compact) && (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: "#475569" }}>Red flags</div>
          <ul style={{ margin: "2px 0 6px", paddingLeft: 18, fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{w.redFlags.map((f) => <li key={f}>{f}</li>)}</ul>
          <p style={{ fontSize: 13, color: "#14532d", lineHeight: 1.55, margin: "0 0 6px" }}><b>What to do:</b> {w.doThis}</p>
        </>
      )}
      <a href={w.source.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#0ea05f", fontWeight: 700 }}>Source: {w.source.label}</a>
    </div>
  );
  if (compact) return card(latest, true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {card(latest, true)}
      <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a", marginTop: 8 }}>Earlier warnings</div>
      {older.map((w) => card(w, false))}
      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55, margin: 0 }}>Every entry is a real warning from PIB Fact Check, the Indian Cyber Crime Coordination Centre (I4C) or the RBI. We add new ones as official warnings are published, so check the date shown.</p>
      <IfScammed />
    </div>
  );
}

function Result({ correct, total }: { correct: number; total: number }) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div style={{ textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 16, padding: "22px 16px", margin: "14px 0" }}>
      <div style={{ fontSize: 38, fontWeight: 900, color: "#0f172a" }}>{pct}%</div>
      <div style={{ color: "#64748b", marginTop: 2 }}>{correct} of {total} right</div>
    </div>
  );
}

const primary: CSSProperties = { fontSize: 14, fontWeight: 800, color: "#fff", background: "#0ea05f", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer" };
const secondary: CSSProperties = { fontSize: 13.5, fontWeight: 700, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10, padding: "9px 14px", cursor: "pointer" };
