"use client";
/**
 * The Stress & Resilience Check itself: one question per screen, a short
 * intro before each part, progress saved in the browser (per account) so a
 * busy professional can stop and pick up later.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { BANK, stepsFor } from "@/lib/stress/bank";
import { scopedKey } from "@/lib/progress/userStorage";
import type { Band, SectionKey } from "@/lib/stress/types";
import { STRESS_CSS } from "./styles";

const DRAFT_KEY = "onegrasp.stress.draft.v1";
const SECTION_ICON: Record<SectionKey, string> = { load: "briefcase", signals: "pulse", burnout: "power", coping: "shield", resilience: "route", recovery: "clock", control: "heart", support: "users", checkin: "check" };
const RECALL_SECTIONS: SectionKey[] = ["load", "signals", "coping", "recovery", "checkin"];
const STD_NOTE: Partial<Record<SectionKey, string>> = {
  burnout: "Standard scale: Copenhagen Burnout Inventory (Kristensen et al., 2005), asked word for word.",
  coping: "Standard scale: Brief COPE (Carver, 1997), eight of its scales, asked word for word.",
};

interface Draft { band: Band; answers: Record<string, number>; facts: Record<string, string>; pos: number; elapsed: number; seen: string[] }

function readDraft(band: Band): Draft | null {
  try {
    const d = JSON.parse(localStorage.getItem(scopedKey(DRAFT_KEY)) || "null") as Draft | null;
    return d && d.band === band ? d : null;
  } catch { return null; }
}
export function clearStressDraft() { try { localStorage.removeItem(scopedKey(DRAFT_KEY)); } catch { /* private mode */ } }

export function StressTest({ band, onFinish, exitHref }: {
  band: Band;
  onFinish: (answers: Record<string, number>, facts: Record<string, string>, durationSec: number) => Promise<void>;
  exitHref: string;
}) {
  const steps = useMemo(() => stepsFor(band), [band]);
  const sections = BANK.sections;
  const [pos, setPos] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [facts, setFacts] = useState<Record<string, string>>({});
  const [seen, setSeen] = useState<string[]>([]);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");
  const elapsedBefore = useRef(0);
  const started = useRef(Date.now());
  const advancing = useRef(false);

  // Resume a saved draft for this band.
  useEffect(() => {
    const d = readDraft(band);
    if (d) {
      setAnswers(d.answers); setFacts(d.facts); setPos(Math.min(d.pos, steps.length - 1)); setSeen(d.seen ?? []);
      elapsedBefore.current = d.elapsed || 0;
    }
  }, [band, steps.length]);

  const elapsed = () => elapsedBefore.current + Math.round((Date.now() - started.current) / 1000);
  useEffect(() => {
    try { localStorage.setItem(scopedKey(DRAFT_KEY), JSON.stringify({ band, answers, facts, pos, elapsed: elapsed(), seen } satisfies Draft)); } catch { /* private mode */ }
  }, [band, answers, facts, pos, seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[pos];
  const sectionId = step.section.id;
  const showIntro = !seen.includes(sectionId) && steps.findIndex((s) => s.section.id === sectionId) === pos;
  const sectionNo = sections.findIndex((s) => s.id === sectionId) + 1;
  const sectionSteps = steps.filter((s) => s.section.id === sectionId);
  const answered = (s: (typeof steps)[number]) => (s.kind === "item" ? answers[s.item.id] !== undefined : facts[s.fact.id] !== undefined);
  const chosen = step.kind === "item" ? answers[step.item.id] : step.fact.options.findIndex((o) => o.value === facts[step.fact.id]);
  const options = step.kind === "item" ? BANK.scales[step.scale].labels : step.fact.options.map((o) => o.label);
  const done = steps.filter(answered).length;

  const finish = useCallback(async (a: Record<string, number>, f: Record<string, string>) => {
    setFinishing(true);
    setError("");
    try { await onFinish(a, f, elapsed()); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't save your results. Please try again."); setFinishing(false); }
  }, [onFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (i: number) => {
    if (advancing.current) return;
    const nextA = step.kind === "item" ? { ...answers, [step.item.id]: i } : answers;
    const nextF = step.kind === "fact" ? { ...facts, [step.fact.id]: step.fact.options[i].value } : facts;
    setAnswers(nextA); setFacts(nextF);
    advancing.current = true;
    window.setTimeout(() => {
      advancing.current = false;
      const firstOpen = steps.findIndex((s) => (s.kind === "item" ? nextA[s.item.id] === undefined : nextF[s.fact.id] === undefined));
      if (pos >= steps.length - 1 || firstOpen === -1) { if (firstOpen === -1) void finish(nextA, nextF); else setPos(firstOpen); }
      else setPos(pos + 1);
    }, 220);
  };

  // Keys 1-5 pick an option on desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showIntro || finishing) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) choose(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const back = () => {
    if (showIntro || pos === 0) { if (pos > 0) setPos(pos - 1); return; }
    setPos(pos - 1);
  };

  return (
    <div className="st">
      <style dangerouslySetInnerHTML={{ __html: STRESS_CSS }} />
      <header className="st-bar">
        <div className="st-narrow st-bar-in">
          <Link href={exitHref} className="st-brand" aria-label="OneGrasp">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
            <span>Stress &amp; Resilience Check</span>
          </Link>
          <div className="st-bar-r"><Link href={exitHref} className="st-btn">Save &amp; exit</Link></div>
        </div>
      </header>

      <main className="st-narrow">
        <div className="st-progress" aria-hidden="true">
          {sections.map((s) => {
            const ss = steps.filter((x) => x.section.id === s.id);
            const frac = ss.length ? ss.filter(answered).length / ss.length : 0;
            return <i key={s.id}><b style={{ transform: `scaleX(${frac})` }} /></i>;
          })}
        </div>
        <div className="st-progress-meta">
          <span>Part {sectionNo} of {sections.length} · {step.section.title}</span>
          <span>{done} of {steps.length}</span>
        </div>

        {finishing ? (
          <div className="st-intro st-fade" role="status">
            <div className="st-intro-ic"><Icon name="pulse" size={26} /></div>
            <h2>Working out your results…</h2>
            <p>Scoring your answers and building your 30-day plan.</p>
          </div>
        ) : showIntro ? (
          <section className="st-intro st-fade" key={`intro-${sectionId}`}>
            <div className="st-intro-ic"><Icon name={SECTION_ICON[sectionId]} size={26} /></div>
            <span className="st-eyebrow">Part {sectionNo} of {sections.length} · about {Math.max(1, Math.round((sectionSteps.length * 9) / 60))} min</span>
            <h2 style={{ marginTop: 6 }}>{step.section.title}</h2>
            <p>{step.section.intro}</p>
            {STD_NOTE[sectionId] && <div className="st-std">{STD_NOTE[sectionId]}</div>}
            <div className="st-nav">
              <button className="st-btn" onClick={back} disabled={pos === 0}><Icon name="arrowLeft" size={16} /> Back</button>
              <button className="st-btn st-btn-pri st-btn-lg" onClick={() => setSeen((s) => [...s, sectionId])}>Start <Icon name="arrowRight" size={16} /></button>
            </div>
          </section>
        ) : (
          <section className="st-q st-fade" key={step.kind === "item" ? step.item.id : step.fact.id} aria-live="polite">
            {/* The 4-week recall applies to OneGrasp's frequency sections and the
                Brief COPE (whose author allows setting the time frame) - not to
                the CBI, which is asked exactly as published, without one. */}
            {step.kind === "item" && RECALL_SECTIONS.includes(step.section.id) && (
              <div className="st-q-recall">In the last 4 weeks</div>
            )}
            <h2 className="st-q-text">{step.kind === "item" ? step.item.text : step.fact.text}</h2>
            <div className="st-opts" role="radiogroup" aria-label="Your answer">
              {options.map((label, i) => (
                <button key={label} role="radio" aria-checked={chosen === i} className="st-opt" onClick={() => choose(i)}>
                  <span className="st-opt-dot" aria-hidden="true" />
                  <span>{label}</span>
                  <span className="st-opt-key" aria-hidden="true">{i + 1}</span>
                </button>
              ))}
            </div>
            {error && <p style={{ color: "#b91c1c", fontSize: 14, marginTop: 14 }}>{error} <button className="st-btn" style={{ marginLeft: 8 }} onClick={() => void finish(answers, facts)}>Try again</button></p>}
            <div className="st-nav">
              <button className="st-btn" onClick={back}><Icon name="arrowLeft" size={16} /> Back</button>
              <span className="st-note">Your answers are saved as you go.</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
