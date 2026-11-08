"use client";
/**
 * Aptitude Lab - the shell (tabs + progress provider) and the pieces the pages
 * share: a question card, the practice runner (one question at a time, the
 * worked solution straight after each answer) and the mock-test runner
 * (timed, a question palette, mark for review, results by section).
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { FEATURES } from "@/lib/features/catalog";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { SECTION_LABEL, type Question, type Section } from "@/lib/aptitude/core";
import { topicById } from "@/lib/aptitude/topics";
import { mastery, type TopicStat } from "@/lib/aptitude/scoring";
import { AptitudeProvider } from "./AptitudeProvider";

const TABS = [
  { href: "/account/aptitude", label: "Lab home" },
  { href: "/account/aptitude/daily", label: "Today's 10" },
  { href: "/account/aptitude/mock", label: "Mock tests" },
  { href: "/account/aptitude/progress", label: "My progress" },
];

export function AptLayout({ children }: { children: ReactNode }) {
  const meta = FEATURES.aptitude;
  const path = usePathname() ?? "";
  const at = TABS.findIndex((t, i) => i > 0 && path.startsWith(t.href));
  return (
    <AptitudeProvider>
      <CoursePlayerShell
        accent={meta.accent}
        banner={{ title: meta.title, icon: "aptitude", backHref: "/account", backLabel: "Dashboard" }}
        homeHref="/account/aptitude"
        tabs={TABS.map((t, i) => ({ ...t, active: at === -1 ? i === 0 : i === at }))}
      >
        <style dangerouslySetInnerHTML={{ __html: APT_CSS }} />
        <div className="fp ap" style={{ ["--accent" as string]: meta.accent }}>{children}</div>
      </CoursePlayerShell>
    </AptitudeProvider>
  );
}

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const LETTER = ["A", "B", "C", "D"];

export function MasteryChip({ stat }: { stat?: TopicStat }) {
  const m = mastery(stat);
  return <span className={`ap-chip is-${m.label.toLowerCase()}`}>{m.label}{m.pct !== null ? ` · ${m.pct}%` : ""}</span>;
}

// ------------------------------------------------------------------ one question

export function QuestionView({ q, chosen, reveal, onChoose }: { q: Question; chosen: number | null; reveal: boolean; onChoose?: (i: number) => void }) {
  return (
    <div className="ap-q">
      {q.passage && (
        <details className="ap-passage" open>
          <summary>Passage</summary>
          <p>{q.passage}</p>
        </details>
      )}
      <div className="ap-stem">{q.stem.split("\n").map((line, i) => <p key={i}>{line}</p>)}</div>
      {q.table && (
        <div className="ap-tablewrap">
          <table className="ap-table">
            <caption>{q.table.caption}</caption>
            <thead><tr>{q.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{q.table.rows.map((row) => <tr key={String(row[0])}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
          </table>
        </div>
      )}
      <div className="ap-opts" role="radiogroup" aria-label="Options">
        {q.options.map((o, i) => {
          const cls = reveal ? (i === q.answer ? " is-right" : i === chosen ? " is-wrong" : " is-dim") : i === chosen ? " is-picked" : "";
          return (
            <button key={o} type="button" role="radio" aria-checked={chosen === i} className={`ap-opt${cls}`} disabled={reveal && !onChoose} onClick={() => onChoose?.(i)}>
              <span className="ap-letter" aria-hidden="true">{reveal && i === q.answer ? <Icon name="check" size={14} stroke={3} /> : reveal && i === chosen ? <Icon name="close" size={13} stroke={3} /> : LETTER[i]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Solution({ q, chosen }: { q: Question; chosen: number | null }) {
  const ok = chosen === q.answer;
  return (
    <div className={`ap-sol${ok ? " is-ok" : ""}`} role="status">
      <b>{chosen === null ? `Answer: ${q.options[q.answer]}` : ok ? "Correct!" : `Not quite - the answer is ${q.options[q.answer]}`}</b>
      <ol>{q.solution.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </div>
  );
}

export interface Logged { q: Question; choice: number | null; ok: boolean; sec: number }

/** Every question with the student's answer and the worked solution. */
export function Review({ log, initial = "all" }: { log: Logged[]; initial?: "all" | "wrong" }) {
  const [show, setShow] = useState<"all" | "wrong">(initial);
  const list = show === "wrong" ? log.filter((l) => !l.ok) : log;
  return (
    <section className="fp-sec">
      <div className="fp-sec-h"><div><h2>Review</h2><p>Every question with the worked solution.</p></div>
        <div className="ap-seg" role="tablist" aria-label="Show">
          {(["all", "wrong"] as const).map((k) => <button key={k} role="tab" aria-selected={show === k} className={show === k ? "is-on" : ""} onClick={() => setShow(k)}>{k === "all" ? `All ${log.length}` : `Wrong or skipped ${log.filter((l) => !l.ok).length}`}</button>)}
        </div>
      </div>
      <div className="ap-review">
        {list.map((l) => (
          <details key={l.q.id} className={`ap-rev${l.ok ? " is-ok" : ""}`}>
            <summary>
              <span className="ap-rev-ic" aria-label={l.ok ? "Right" : l.choice === null ? "Skipped" : "Wrong"}><Icon name={l.ok ? "check" : l.choice === null ? "help" : "close"} size={13} stroke={3} /></span>
              <span className="ap-rev-t">{l.q.stem.split("\n")[0]}</span>
              <small>{topicById(l.q.topic)?.title} · {mmss(l.sec)}</small>
            </summary>
            <div className="ap-rev-b">
              <QuestionView q={l.q} chosen={l.choice} reveal />
              <Solution q={l.q} chosen={l.choice} />
            </div>
          </details>
        ))}
        {!list.length && <p className="fp-muted" style={{ padding: 16, margin: 0 }}>Nothing wrong - well done.</p>}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ practice: one at a time, solution after each

export function PracticeRunner({ questions, onFinish, again, exit }: {
  questions: Question[];
  /** Called once with every answer; returns a line to show on the results (e.g. a level change). */
  onFinish: (log: Logged[]) => string | null;
  again?: { label: string; onClick: () => void };
  exit: { label: string; href: string };
}) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [log, setLog] = useState<Logged[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);
  const started = useRef(Date.now());
  const finished = useRef(false);
  const q = questions[i];

  useEffect(() => { const t = window.setInterval(() => setTick((n) => n + 1), 1000); return () => window.clearInterval(t); }, []);

  const choose = (c: number) => {
    if (picked !== null || done || !q) return;
    setPicked(c);
    setLog((l) => [...l, { q, choice: c, ok: c === q.answer, sec: Math.round((Date.now() - started.current) / 1000) }]);
  };
  const next = () => {
    if (picked === null) return;
    if (i + 1 < questions.length) { setI(i + 1); setPicked(null); started.current = Date.now(); return; }
    if (!finished.current) { finished.current = true; setNote(onFinish(log)); }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || (e.target as HTMLElement)?.closest?.("input, textarea, select")) return;
      const k = e.key.toLowerCase();
      const n = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
      if (n >= 0 && q && n < q.options.length) choose(n);
      else if ((e.key === "Enter" || e.key === "ArrowRight") && picked !== null) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!questions.length) return <p className="fp-muted">No questions here yet.</p>;

  if (done) {
    const right = log.filter((l) => l.ok).length;
    const avg = Math.round(log.reduce((s, l) => s + l.sec, 0) / Math.max(1, log.length));
    const target = Math.round(log.reduce((s, l) => s + (topicById(l.q.topic)?.targetSec ?? 45), 0) / Math.max(1, log.length));
    const pct = Math.round((100 * right) / log.length);
    return (
      <>
        <div className="ap-result">
          <div className="ap-result-n"><b>{right}</b><span>/ {log.length}</span></div>
          <div>
            <h2>{pct >= 80 ? "Excellent work" : pct >= 60 ? "Good going" : pct >= 40 ? "Getting there" : "Keep practising"}</h2>
            <p className="fp-muted">{pct}% right · {avg}s a question on average (target about {target}s){note ? ` · ${note}` : ""}</p>
            <div className="ap-cta">
              {again && <button className="fp-btn fp-btn-pri" onClick={again.onClick}>{again.label}</button>}
              <Link href={exit.href} className="fp-btn">{exit.label}</Link>
            </div>
          </div>
        </div>
        <Review log={log} initial={right < log.length ? "wrong" : "all"} />
      </>
    );
  }

  const elapsed = Math.round((Date.now() - started.current) / 1000);
  const target = topicById(q.topic)?.targetSec ?? 45;
  void tick;
  return (
    <div className="ap-run">
      <div className="ap-run-top">
        <span><b>Question {i + 1}</b> of {questions.length}</span>
        <span className="ap-dots" aria-hidden="true">{questions.map((_, k) => <i key={k} className={k < log.length ? (log[k].ok ? "is-ok" : "is-no") : k === i ? "is-cur" : ""} />)}</span>
        <span className={`ap-time${picked === null && elapsed > target ? " is-over" : ""}`} aria-label="Time on this question"><Icon name="clock" size={14} stroke={2} /> {mmss(picked === null ? elapsed : log[log.length - 1]?.sec ?? elapsed)}</span>
      </div>
      <div className="ap-card">
        <span className="ap-kick">{topicById(q.topic)?.title} · level {q.level}</span>
        <QuestionView q={q} chosen={picked} reveal={picked !== null} onChoose={picked === null ? choose : undefined} />
        {picked !== null && <Solution q={q} chosen={picked} />}
        <div className="ap-cta">
          {picked === null
            ? <span className="fp-muted" style={{ fontSize: 13 }}>Pick an answer (or press 1-4). Aim for about {target} seconds.</span>
            : <button className="fp-btn fp-btn-pri" onClick={next} autoFocus>{i + 1 < questions.length ? "Next question" : "See my results"} <Icon name="arrowRight" size={15} stroke={2} /></button>}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ mock test: timed, palette, submit

export function MockRunner({ questions, minutes, title, onSubmit, exit }: {
  questions: Question[];
  minutes: number;
  title: string;
  onSubmit: (log: Logged[], totalSec: number) => void;
  exit: { label: string; href: string };
}) {
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [left, setLeft] = useState(minutes * 60);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<{ log: Logged[]; sec: number } | null>(null);
  const spent = useRef<Record<string, number>>({});
  const since = useRef(Date.now());
  const begun = useRef(Date.now());

  const charge = () => { const id = questions[cur]?.id; if (id) spent.current[id] = (spent.current[id] ?? 0) + (Date.now() - since.current) / 1000; since.current = Date.now(); };
  const go = (n: number) => { charge(); setCur(Math.max(0, Math.min(questions.length - 1, n))); setConfirm(false); };

  const submit = () => {
    if (result) return;
    charge();
    const log: Logged[] = questions.map((q) => ({ q, choice: ans[q.id] ?? null, ok: ans[q.id] === q.answer, sec: Math.round(spent.current[q.id] ?? 0) }));
    const sec = Math.round((Date.now() - begun.current) / 1000);
    setResult({ log, sec });
    onSubmit(log, sec);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (result) return;
    const t = window.setInterval(() => setLeft((s) => s - 1), 1000);
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => { window.clearInterval(t); window.removeEventListener("beforeunload", warn); };
  }, [result]);
  useEffect(() => { if (left <= 0 && !result) submit(); }); // time's up

  const sections = useMemo(() => {
    const out: { section: Section; from: number; to: number }[] = [];
    questions.forEach((q, i) => { const last = out[out.length - 1]; if (last?.section === q.section) last.to = i; else out.push({ section: q.section, from: i, to: i }); });
    return out;
  }, [questions]);

  if (result) {
    const right = result.log.filter((l) => l.ok).length;
    return (
      <>
        <div className="ap-result">
          <div className="ap-result-n"><b>{right}</b><span>/ {questions.length}</span></div>
          <div>
            <h2>{title} - {Math.round((100 * right) / questions.length)}%</h2>
            <p className="fp-muted">Time used {mmss(result.sec)} of {minutes}:00 · {result.log.filter((l) => l.choice === null).length} left unanswered</p>
            <div className="ap-secs">
              {sections.map((s) => {
                const part = result.log.slice(s.from, s.to + 1), c = part.filter((l) => l.ok).length;
                return <div key={s.section} className="ap-secbar"><span>{SECTION_LABEL[s.section]}</span><i><b style={{ width: `${(100 * c) / part.length}%` }} /></i><em>{c}/{part.length}</em></div>;
              })}
            </div>
            <div className="ap-cta"><Link href={exit.href} className="fp-btn fp-btn-pri">{exit.label}</Link><Link href="/account/aptitude/progress" className="fp-btn">My progress</Link></div>
          </div>
        </div>
        <Review log={result.log} initial="wrong" />
      </>
    );
  }

  const q = questions[cur];
  const answered = Object.keys(ans).length;
  return (
    <div className="ap-mock">
      <div className="ap-mock-bar">
        <b>{title}</b>
        <span className={`ap-clock${left <= 120 ? " is-low" : ""}`} role="timer" aria-label={`Time left ${mmss(Math.max(0, left))}`}><Icon name="clock" size={15} stroke={2} /> {mmss(Math.max(0, left))}</span>
        <span className="fp-muted">{answered}/{questions.length} answered{marked.size ? ` · ${marked.size} marked` : ""}</span>
        <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => (answered < questions.length ? setConfirm(true) : submit())}>Submit</button>
      </div>
      {confirm && (
        <div className="ap-confirm" role="alertdialog" aria-label="Submit the test?">
          <span>{questions.length - answered} question{questions.length - answered === 1 ? " is" : "s are"} unanswered. Submit anyway?</span>
          <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={submit}>Submit now</button>
          <button className="fp-btn fp-btn-sm" onClick={() => setConfirm(false)}>Keep going</button>
        </div>
      )}
      <div className="ap-mock-grid">
        <div className="ap-card">
          <span className="ap-kick">Question {cur + 1} of {questions.length} · {SECTION_LABEL[q.section]}</span>
          <QuestionView q={q} chosen={ans[q.id] ?? null} reveal={false} onChoose={(c) => setAns((a) => (a[q.id] === c ? Object.fromEntries(Object.entries(a).filter(([k]) => k !== q.id)) : { ...a, [q.id]: c }))} />
          <div className="ap-cta">
            <button className="fp-btn" onClick={() => go(cur - 1)} disabled={cur === 0}><Icon name="arrowLeft" size={15} stroke={2} /> Previous</button>
            <button className={`fp-btn${marked.has(q.id) ? " is-marked" : ""}`} onClick={() => setMarked((m) => { const n = new Set(m); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; })}>
              <Icon name="bookmark" size={15} stroke={2} /> {marked.has(q.id) ? "Marked" : "Mark for review"}
            </button>
            {cur + 1 < questions.length
              ? <button className="fp-btn fp-btn-pri" onClick={() => go(cur + 1)}>Next <Icon name="arrowRight" size={15} stroke={2} /></button>
              : <button className="fp-btn fp-btn-pri" onClick={() => (answered < questions.length ? setConfirm(true) : submit())}>Submit test</button>}
          </div>
          <p className="fp-muted" style={{ fontSize: 12.5, margin: "10px 0 0" }}>Tap an option again to clear it. No marks are lost for a wrong answer.</p>
        </div>
        <nav className="ap-palette" aria-label="Questions">
          {sections.map((s) => (
            <div key={s.section}>
              <small>{SECTION_LABEL[s.section]}</small>
              <div className="ap-pal">
                {questions.slice(s.from, s.to + 1).map((x, k) => {
                  const n = s.from + k;
                  return <button key={x.id} onClick={() => go(n)} aria-label={`Question ${n + 1}${ans[x.id] !== undefined ? ", answered" : ""}${marked.has(x.id) ? ", marked" : ""}`} aria-current={n === cur ? "step" : undefined}
                    className={`${ans[x.id] !== undefined ? "is-done" : ""}${marked.has(x.id) ? " is-marked" : ""}${n === cur ? " is-cur" : ""}`}>{n + 1}</button>;
                })}
              </div>
            </div>
          ))}
          <p className="ap-legend"><i className="is-done" /> answered <i className="is-marked" /> marked</p>
        </nav>
      </div>
    </div>
  );
}

export const APT_CSS = `
.ap .ap-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.ap .ap-grid4{grid-template-columns:repeat(4,minmax(0,1fr))}
.ap .ap-box{background:#fff;border:1px solid var(--line);border-radius:8px;padding:18px 20px;display:flex;flex-direction:column;gap:6px;min-width:0}
.ap .ap-box h3{font-size:15px;font-weight:600;margin:0}
.ap .ap-big{font-family:Poppins,Inter,sans-serif;font-size:40px;font-weight:700;line-height:1;color:var(--ink)}
.ap .ap-band{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent);font-size:12.5px;font-weight:700}
.ap .ap-secs{display:grid;gap:6px;margin-top:8px}
.ap .ap-secbar{display:grid;grid-template-columns:130px minmax(0,1fr) 44px;gap:8px;align-items:center;font-size:12.5px;color:var(--ink2)}
.ap .ap-secbar i{display:block;height:6px;border-radius:3px;background:#ece9e3;overflow:hidden}
.ap .ap-secbar i b{display:block;height:100%;background:var(--accent);border-radius:3px}
.ap .ap-secbar em{font-style:normal;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.ap .ap-topics{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:10px}
.ap .ap-topic{display:flex;flex-direction:column;gap:6px;padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px;text-decoration:none;color:var(--ink)}
.ap .ap-topic:hover{border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}
.ap .ap-topic b{font-size:14.5px;font-weight:600}
.ap .ap-topic small{font-size:12.5px;color:var(--mute)}
.ap .ap-topic-f{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto}
.ap .ap-chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:600;background:#f1efea;color:var(--ink2);white-space:nowrap}
.ap .ap-chip.is-good{background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent)}
.ap .ap-chip.is-strong{background:var(--accent);color:#fff}
.ap .ap-chip.is-learning{background:#fdf3e3;color:#8a5a00}
.ap .ap-lvl{font-size:12px;color:var(--mute)}
.ap .ap-card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:20px 22px}
.ap .ap-kick{display:block;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.ap .ap-stem p{margin:0 0 6px;font-size:16.5px;line-height:1.55;color:var(--ink);font-weight:500}
.ap .ap-passage{border:1px solid var(--line);border-radius:8px;background:#fcfbf9;padding:10px 14px;margin-bottom:14px}
.ap .ap-passage summary{cursor:pointer;font-size:13px;font-weight:600;color:var(--ink2)}
.ap .ap-passage p{margin:8px 0 0;font-size:14.5px;line-height:1.7;color:var(--ink)}
.ap .ap-tablewrap{overflow-x:auto;margin:6px 0 12px}
.ap .ap-table{border-collapse:collapse;font-size:14px;min-width:320px}
.ap .ap-table caption{caption-side:top;text-align:left;font-size:12.5px;color:var(--mute);padding-bottom:6px}
.ap .ap-table th,.ap .ap-table td{border:1px solid var(--line);padding:6px 12px;text-align:right;font-variant-numeric:tabular-nums}
.ap .ap-table thead th{background:#f7f5f1;font-weight:600;text-align:right}
.ap .ap-table th[scope=row],.ap .ap-table thead th:first-child{text-align:left}
.ap .ap-opts{display:grid;gap:8px;margin-top:12px}
.ap .ap-opt{display:flex;gap:12px;align-items:center;text-align:left;padding:11px 14px;border:1px solid var(--line);border-radius:8px;background:#fff;font:inherit;font-size:15px;color:var(--ink);cursor:pointer;min-height:48px}
.ap .ap-opt:hover:not(:disabled){border-color:#c9c4ba}
.ap .ap-opt:disabled{cursor:default}
.ap .ap-letter{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#f1efea;font-size:12.5px;font-weight:700;color:var(--ink2)}
.ap .ap-opt.is-picked{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 6%,#fff)}
.ap .ap-opt.is-picked .ap-letter{background:var(--accent);color:#fff}
.ap .ap-opt.is-right{border-color:var(--ok);background:#f0f9f3}
.ap .ap-opt.is-right .ap-letter{background:var(--ok);color:#fff}
.ap .ap-opt.is-wrong{border-color:#e7a3a3;background:#fdf3f3}
.ap .ap-opt.is-wrong .ap-letter{background:#c0392b;color:#fff}
.ap .ap-opt.is-dim{color:var(--ink2)}
.ap .ap-sol{margin-top:14px;padding:12px 16px;border-radius:8px;background:#fdf6f4;border:1px solid #f0d4cd}
.ap .ap-sol.is-ok{background:#f0f9f3;border-color:#cde9d6}
.ap .ap-sol b{font-size:14.5px}
.ap .ap-sol ol{margin:6px 0 0;padding-left:20px;font-size:14px;line-height:1.6;color:var(--ink2)}
.ap .ap-cta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:16px}
.ap .ap-run{max-width:780px}
.ap .ap-run-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:6px 0 12px;font-size:14px;color:var(--ink2)}
.ap .ap-dots{display:flex;gap:4px;flex:1;min-width:120px}
.ap .ap-dots i{flex:1;height:5px;border-radius:3px;background:#e8e5df;max-width:36px}
.ap .ap-dots i.is-ok{background:var(--ok)}
.ap .ap-dots i.is-no{background:#d9534f}
.ap .ap-dots i.is-cur{background:var(--accent)}
.ap .ap-time{display:inline-flex;align-items:center;gap:5px;font-variant-numeric:tabular-nums}
.ap .ap-time.is-over{color:#a15c00}
.ap .ap-result{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:10px;padding:20px 22px;margin:8px 0 4px}
.ap .ap-result h2{margin:0 0 4px;font-size:20px}
.ap .ap-result>div:last-child{flex:1;min-width:240px}
.ap .ap-result-n{display:flex;align-items:baseline;gap:4px}
.ap .ap-result-n b{font-family:Poppins,Inter,sans-serif;font-size:52px;line-height:1}
.ap .ap-result-n span{font-size:16px;color:var(--mute)}
.ap .ap-seg{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff}
.ap .ap-seg button{border:0;background:transparent;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer;color:var(--ink2)}
.ap .ap-seg button.is-on{background:var(--accent);color:#fff}
.ap .ap-review{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.ap .ap-rev{border-top:1px solid #f0ede8}
.ap .ap-rev:first-child{border-top:0}
.ap .ap-rev summary{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:10px;align-items:center;padding:11px 14px;cursor:pointer;list-style:none}
.ap .ap-rev summary::-webkit-details-marker{display:none}
.ap .ap-rev-ic{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#fbe3e1;color:#b42318}
.ap .ap-rev.is-ok .ap-rev-ic{background:#dcf2e3;color:#1a7f37}
.ap .ap-rev-t{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ap .ap-rev summary small{font-size:12px;color:var(--mute);white-space:nowrap}
.ap .ap-rev-b{padding:4px 16px 16px}
.ap .ap-mock-bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:6px 0 12px}
.ap .ap-mock-bar>b{font-size:15px}
.ap .ap-mock-bar .fp-btn{margin-left:auto}
.ap .ap-clock{display:inline-flex;align-items:center;gap:6px;font-variant-numeric:tabular-nums;font-weight:700;font-size:15px}
.ap .ap-clock.is-low{color:#b42318}
.ap .ap-confirm{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;margin:-4px 0 12px;border:1px solid #f1d9a8;background:#fffaf0;border-radius:8px;font-size:14px}
.ap .ap-mock-grid{display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:14px;align-items:start}
.ap .ap-palette{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;position:sticky;top:64px;display:grid;gap:10px}
.ap .ap-palette small{display:block;font-size:12px;font-weight:600;color:var(--ink2);margin-bottom:6px}
.ap .ap-pal{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.ap .ap-pal button{height:34px;border:1px solid var(--line);border-radius:6px;background:#fff;font:inherit;font-size:13px;cursor:pointer;font-variant-numeric:tabular-nums}
.ap .ap-pal button.is-done{background:color-mix(in srgb,var(--accent) 14%,#fff);border-color:color-mix(in srgb,var(--accent) 40%,#fff)}
.ap .ap-pal button.is-marked{box-shadow:inset 0 0 0 2px #c27c00}
.ap .ap-pal button.is-cur{outline:2px solid var(--ink);outline-offset:1px}
.ap .ap-legend{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--mute);margin:0}
.ap .ap-legend i{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid var(--line)}
.ap .ap-legend i.is-done{background:color-mix(in srgb,var(--accent) 14%,#fff)}
.ap .ap-legend i.is-marked{box-shadow:inset 0 0 0 2px #c27c00;margin-left:8px}
.ap .fp-btn.is-marked{border-color:#c27c00;color:#8a5a00}
.ap .ap-concept{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px}
.ap .ap-concept ol{margin:0;padding-left:20px;font-size:14.5px;line-height:1.65;color:var(--ink)}
.ap .ap-ex{margin:0;padding:12px 14px;border-left:3px solid var(--accent);background:#fcfbf9;border-radius:0 6px 6px 0;font-size:14.5px;line-height:1.6}
.ap .ap-tip{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.55;color:var(--ink2)}
.ap .ap-tip svg{flex:none;margin-top:2px;color:var(--accent)}
.ap .ap-note{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:8px;background:color-mix(in srgb,var(--accent) 6%,#fff);border:1px solid color-mix(in srgb,var(--accent) 22%,#fff);font-size:14px;line-height:1.5;color:var(--ink2)}
.ap .ap-note svg{flex:none;color:var(--accent);margin-top:2px}
.ap .ap-tbl{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden;font-size:14px}
.ap .ap-tbl th,.ap .ap-tbl td{padding:9px 12px;border-top:1px solid #f0ede8;text-align:left;vertical-align:middle}
.ap .ap-tbl thead th{border-top:0;background:#f7f5f1;font-size:12.5px;font-weight:600;color:var(--ink2)}
.ap .ap-tbl td.n,.ap .ap-tbl th.n{text-align:right;font-variant-numeric:tabular-nums}
.ap .ap-tbl a{color:var(--accent);font-weight:600;text-decoration:none}
@media (max-width:980px){.ap .ap-mock-grid{grid-template-columns:minmax(0,1fr)}.ap .ap-palette{position:static}.ap .ap-concept{grid-template-columns:minmax(0,1fr)}}
@media (max-width:1100px){.ap .ap-grid4{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:900px){.ap .ap-grid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:560px){.ap .ap-card{padding:16px}.ap .ap-secbar{grid-template-columns:96px minmax(0,1fr) 40px}.ap .ap-tbl .hide-sm{display:none}}
`;
