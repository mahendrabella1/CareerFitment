"use client";
/**
 * The Workplace Stress Check itself: 33 questions in four areas plus one
 * closing question, one per screen, a one-line intro before each area, and
 * progress saved in the browser (per account) so a busy professional can stop
 * and pick up later.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { BANK } from "@/lib/stress/bank";
import { AREA_META } from "@/lib/stress/content";
import { scopedKey } from "@/lib/progress/userStorage";
import type { AreaKey, Band, BankItem } from "@/lib/stress/types";
import { STRESS_CSS } from "./styles";

const DRAFT_KEY = "onegrasp.stress.draft.v3";

type Step = { kind: "item"; item: BankItem } | { kind: "closing" };
interface Draft { band: Band; answers: Record<string, number>; pos: number; elapsed: number; seen: AreaKey[] }

function readDraft(band: Band): Draft | null {
  try {
    const d = JSON.parse(localStorage.getItem(scopedKey(DRAFT_KEY)) || "null") as Draft | null;
    return d && d.band === band ? d : null;
  } catch { return null; }
}
export function clearStressDraft() { try { localStorage.removeItem(scopedKey(DRAFT_KEY)); } catch { /* private mode */ } }

const idOf = (s: Step) => (s.kind === "item" ? s.item.id : BANK.closing.id);

export function StressTest({ band, onFinish, exitHref }: {
  band: Band;
  onFinish: (answers: Record<string, number>, durationSec: number) => Promise<void>;
  exitHref: string;
}) {
  const steps = useMemo<Step[]>(() => [...BANK.items.map((item) => ({ kind: "item" as const, item })), { kind: "closing" as const }], []);
  const [pos, setPos] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [seen, setSeen] = useState<AreaKey[]>([]);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");
  const elapsedBefore = useRef(0);
  const started = useRef(Date.now());
  const advancing = useRef(false);

  useEffect(() => {
    const d = readDraft(band);
    if (d) {
      setAnswers(d.answers); setPos(Math.min(d.pos, steps.length - 1)); setSeen(d.seen ?? []);
      elapsedBefore.current = d.elapsed || 0;
    }
  }, [band, steps.length]);

  const elapsed = () => elapsedBefore.current + Math.round((Date.now() - started.current) / 1000);
  useEffect(() => {
    try { localStorage.setItem(scopedKey(DRAFT_KEY), JSON.stringify({ band, answers, pos, elapsed: elapsed(), seen } satisfies Draft)); } catch { /* private mode */ }
  }, [band, answers, pos, seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[pos];
  const area = step.kind === "item" ? BANK.areas.find((a) => a.id === step.item.area)! : null;
  const showIntro = !!area && !seen.includes(area.id) && steps.findIndex((s) => s.kind === "item" && s.item.area === area.id) === pos;
  const options = step.kind === "item" ? BANK.scale.labels : BANK.closing.options;
  const chosen = answers[idOf(step)];
  const done = steps.filter((s) => answers[idOf(s)] !== undefined).length;
  const parts = [...BANK.areas.map((a) => ({ id: a.id as string, label: AREA_META[a.id].label, steps: steps.filter((s) => s.kind === "item" && s.item.area === a.id) })), { id: "closing", label: "Wrap-up", steps: steps.slice(-1) }];
  const partNo = area ? BANK.areas.indexOf(area) : BANK.areas.length;

  const finish = useCallback(async (a: Record<string, number>) => {
    setFinishing(true);
    setError("");
    try { await onFinish(a, elapsed()); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't save your results. Please try again."); setFinishing(false); }
  }, [onFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (i: number) => {
    if (advancing.current) return;
    const next = { ...answers, [idOf(step)]: i };
    setAnswers(next);
    advancing.current = true;
    window.setTimeout(() => {
      advancing.current = false;
      const firstOpen = steps.findIndex((s) => next[idOf(s)] === undefined);
      if (firstOpen === -1) void finish(next);
      else setPos(pos >= steps.length - 1 ? firstOpen : pos + 1);
    }, 200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showIntro || finishing) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) choose(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="ws">
      <style dangerouslySetInnerHTML={{ __html: STRESS_CSS }} />
      <header className="ws-bar">
        <div className="ws-narrow ws-bar-in">
          <Link href={exitHref} className="ws-brand" aria-label="OneGrasp">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
            <span>Workplace Stress Check</span>
          </Link>
          <div className="ws-bar-r"><Link href={exitHref} className="ws-btn ws-btn-sm">Save &amp; exit</Link></div>
        </div>
      </header>

      <main className="ws-narrow" style={{ paddingBottom: 48 }}>
        <div className="ws-steps-bar" aria-label={`${done} of ${steps.length} answered`}>
          {parts.map((p, n) => {
            const frac = p.steps.filter((s) => answers[idOf(s)] !== undefined).length / p.steps.length;
            return (
              <div key={p.id} data-on={n === partNo}>
                <i><b style={{ transform: `scaleX(${frac})` }} /></i>
                <span>{p.label}</span>
              </div>
            );
          })}
        </div>

        {finishing ? (
          <section className="ws-qcard ws-fade" role="status">
            <h2 className="ws-qtext">Working out your results…</h2>
            <p className="ws-sub">Scoring your answers and building your 30-day plan.</p>
          </section>
        ) : showIntro && area ? (
          <section className="ws-qcard ws-fade" key={`intro-${area.id}`}>
            <span className="ws-recall">Part {partNo + 1} of 4 · {steps.filter((s) => s.kind === "item" && s.item.area === area.id).length} questions</span>
            <h2 className="ws-qtext" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon name={AREA_META[area.id].icon} size={26} /> {area.title}
            </h2>
            <p className="ws-sub" style={{ fontSize: 16, marginTop: 10 }}>{area.intro}</p>
            <p className="ws-small" style={{ marginTop: 14 }}>Think about the <b>last 3 months</b>, and pick how often each one happened.</p>
            <div className="ws-qnav">
              <button className="ws-btn" onClick={() => setPos(Math.max(0, pos - 1))} disabled={pos === 0}><Icon name="arrowLeft" size={16} /> Back</button>
              <button className="ws-btn ws-btn-pri ws-btn-lg" onClick={() => setSeen((s) => [...s, area.id])} autoFocus>Start <Icon name="arrowRight" size={16} /></button>
            </div>
          </section>
        ) : (
          <section className="ws-qcard ws-fade" key={idOf(step)} aria-live="polite">
            <span className="ws-recall">{step.kind === "item" ? `${BANK.recall} · ${pos + 1} of ${steps.length}` : "Last question"}</span>
            <h2 className="ws-qtext">{step.kind === "item" ? step.item.text : BANK.closing.text}</h2>
            <div className="ws-opts" role="radiogroup" aria-label="Your answer">
              {options.map((label, i) => (
                <button key={label} role="radio" aria-checked={chosen === i} className="ws-opt" onClick={() => choose(i)}>
                  <span className="ws-opt-dot" aria-hidden="true" />
                  <span>{label}</span>
                  <span className="ws-opt-key ws-hide-sm" aria-hidden="true">{i + 1}</span>
                </button>
              ))}
            </div>
            {error && (
              <p style={{ color: "#b42318", fontSize: 14, marginTop: 14 }}>
                {error} <button className="ws-btn ws-btn-sm" style={{ marginLeft: 8 }} onClick={() => void finish(answers)}>Try again</button>
              </p>
            )}
            <div className="ws-qnav">
              <button className="ws-btn" onClick={() => setPos(Math.max(0, pos - 1))} disabled={pos === 0}><Icon name="arrowLeft" size={16} /> Back</button>
              <span className="ws-muted">Saved as you go</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
