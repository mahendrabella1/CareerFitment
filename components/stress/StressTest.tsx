"use client";
/**
 * The Workplace Stress Check, on the same exam screen as the student
 * assessment (app/examTheme.tsx - the styles and pieces app/NewExam.tsx uses):
 * top bar with live counters, the four areas as section chips, a numbered
 * question card with read-aloud and mark-for-review, three answers per
 * question, Previous / Next and the question navigator. Answers are saved
 * in the browser as you go (per account), so it can be finished later.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { S, CSS, Stat, Radio, BLUE, GREEN, AMBER } from "@/app/examTheme";
import { BANK } from "@/lib/stress/bank";
import { AREA_META } from "@/lib/stress/content";
import { scopedKey } from "@/lib/progress/userStorage";
import type { Band, BankItem } from "@/lib/stress/types";

const DRAFT_KEY = "onegrasp.stress.draft.v4";

type Step = { kind: "item"; item: BankItem } | { kind: "closing" };
interface Draft { band: Band; answers: Record<string, number>; review: Record<string, boolean>; pos: number; elapsed: number }

function readDraft(band: Band): Draft | null {
  try {
    const d = JSON.parse(localStorage.getItem(scopedKey(DRAFT_KEY)) || "null") as Draft | null;
    return d && d.band === band ? d : null;
  } catch { return null; }
}
export function clearStressDraft() { try { localStorage.removeItem(scopedKey(DRAFT_KEY)); } catch { /* private mode */ } }

const idOf = (s: Step) => (s.kind === "item" ? s.item.id : BANK.closing.id);
const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

function readAloud(text: string) {
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    synth.speak(u);
  } catch { /* no speech support */ }
}

export function StressTest({ band, onFinish, onExit }: {
  band: Band;
  onFinish: (answers: Record<string, number>, durationSec: number) => Promise<void>;
  onExit: () => void;
}) {
  const steps = useMemo<Step[]>(() => [...BANK.items.map((item) => ({ kind: "item" as const, item })), { kind: "closing" as const }], []);
  const sections = useMemo(() => [
    ...BANK.areas.map((a) => ({ key: a.id as string, label: AREA_META[a.id].label, icon: AREA_META[a.id].icon, idx: steps.map((s, i) => (s.kind === "item" && s.item.area === a.id ? i : -1)).filter((i) => i >= 0) })),
    { key: "closing", label: "Wrap-up", icon: "check", idx: [steps.length - 1] },
  ], [steps]);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [review, setReview] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const base = useRef(0);
  const started = useRef(Date.now());
  const advancing = useRef(false);

  useEffect(() => {
    const d = readDraft(band);
    if (d) {
      setAnswers(d.answers); setReview(d.review ?? {}); setCur(Math.min(d.pos, steps.length - 1));
      base.current = d.elapsed || 0;
    }
  }, [band, steps.length]);

  useEffect(() => {
    const t = window.setInterval(() => setElapsed(base.current + Math.round((Date.now() - started.current) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const now = () => base.current + Math.round((Date.now() - started.current) / 1000);
  useEffect(() => {
    try { localStorage.setItem(scopedKey(DRAFT_KEY), JSON.stringify({ band, answers, review, pos: cur, elapsed: now() } satisfies Draft)); } catch { /* private mode */ }
  }, [band, answers, review, cur]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[cur];
  const qid = idOf(step);
  const options = step.kind === "item" ? BANK.scale.labels : BANK.closing.options;
  const text = step.kind === "item" ? step.item.text : BANK.closing.text;
  const answered = (s: Step) => answers[idOf(s)] !== undefined;
  const answeredCount = steps.filter(answered).length;
  const markedCount = Object.values(review).filter(Boolean).length;
  const total = steps.length;
  const allDone = answeredCount === total;
  const pct = Math.round((answeredCount / total) * 100);
  const sectionOf = (i: number) => sections.findIndex((s) => s.idx.includes(i));
  const curSec = sectionOf(cur);

  const finish = useCallback(async (a: Record<string, number>) => {
    setSubmitting(true);
    setErr("");
    try { await onFinish(a, now()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Couldn't save your results. Please try again."); setSubmitting(false); }
  }, [onFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (i: number) => setCur(Math.max(0, Math.min(total - 1, i)));
  const answer = (i: number) => {
    if (advancing.current) return;
    const next = { ...answers, [qid]: i };
    setAnswers(next);
    setSaved(false);
    // Tap an answer and it moves on, as in the student exam.
    if (cur < total - 1) {
      advancing.current = true;
      window.setTimeout(() => { advancing.current = false; setCur((c) => Math.min(total - 1, c + 1)); }, 220);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (submitting) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) answer(n - 1);
      else if (e.key === "ArrowRight") go(cur + 1);
      else if (e.key === "ArrowLeft") go(cur - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (submitting) {
    return (
      <div style={S.center}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="og-spin" />
        <div style={S.big}>Working out your results…</div>
        <div style={S.subT}>Finding where your stress is coming from and building your 30-day plan.</div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header style={S.top} className="og-exam-top">
        <div style={S.topLeft}>
          <span style={S.logoBox}><Logo height={28} /></span>
          <div className="og-exam-topmeta"><div style={S.topTitle}>Workplace Stress Check</div><div style={S.topSub}>{total} Questions</div></div>
        </div>
        <div style={S.statsPanel} className="og-exam-stats">
          <Stat icon="clock" label="TIME TAKEN" value={fmt(elapsed)} />
          <div style={S.topDiv} />
          <Stat icon="help" label="QUESTION" value={`${cur + 1} / ${total}`} />
          <div style={S.topDiv} />
          <Stat icon="check" label="ANSWERED" value={`${answeredCount}`} color={GREEN} />
          <div style={S.topDiv} />
          <Stat icon="flag" label="MARKED" value={`${markedCount}`} />
        </div>
        <div style={S.topRight} className="og-exam-topright">
          <button style={{ ...S.saveBtn, ...(saved ? S.saveBtnOk : {}) }} onClick={() => { setSaved(true); onExit(); }}><Icon name="save" size={16} /> <span className="og-exam-btn-label">{saved ? "Saved ✓" : "Save Progress"}</span></button>
          <button style={S.exitBtn} onClick={onExit}><Icon name="power" size={15} /> <span className="og-exam-btn-label">Exit</span></button>
        </div>
      </header>

      <nav style={S.catBar} className="og-exam-catbar">
        {sections.map((s, si) => {
          const a = s.idx.filter((i) => answered(steps[i])).length;
          const done = a === s.idx.length;
          const on = si === curSec;
          return (
            <button key={s.key} title={s.label} onClick={() => go(s.idx[0])} style={{ ...S.catChip, ...(on ? S.catChipOn : {}) }}>
              <span style={{ display: "flex", flexShrink: 0, color: on ? BLUE : done ? GREEN : "#9aa3b2" }}><Icon name={s.icon} size={15} /></span>
              <span style={S.catChipName}>{s.label}</span>
              <span style={{ ...S.catChipBadge, ...(done ? S.catChipBadgeDone : on ? S.catChipBadgeOn : {}) }}>{done ? "✓" : `${a}/${s.idx.length}`}</span>
            </button>
          );
        })}
      </nav>

      <div style={S.grid} className="og-exam-grid">
        <main style={S.main}>
          <div style={S.mainInner}>
            <div style={S.progOuter}><div style={{ ...S.progFill, width: `${pct}%` }} /></div>
            <div style={S.qBlock}>
              <span style={S.qNum}>{cur + 1}</span>
              <div style={S.qCard}>
                <div style={S.qHead}>
                  <div style={S.qText}>
                    <div style={{ ...S.topSub, fontWeight: 600, marginBottom: 6 }}>{step.kind === "item" ? `${BANK.recall} · ${sections[curSec]?.label}` : "Last question"}</div>
                    {text}
                  </div>
                  <div style={S.qHeadBtns}>
                    <button style={S.speakBtn} title="Read aloud" onClick={() => readAloud(text)}><Icon name="audio" size={16} /></button>
                    <button style={{ ...S.reviewIcon, ...(review[qid] ? S.reviewIconOn : {}) }} title="Mark for review" onClick={() => setReview((r) => ({ ...r, [qid]: !r[qid] }))}><Icon name="bookmark" size={16} /></button>
                  </div>
                </div>
                <div style={S.optList} role="radiogroup" aria-label="Your answer">
                  {options.map((label, i) => {
                    const sel = answers[qid] === i;
                    return (
                      <button key={label} role="radio" aria-checked={sel} className="og-opt" style={{ ...S.optRow, ...(sel ? S.optRowOn : {}) }} onMouseDown={(e) => e.preventDefault()} onClick={() => answer(i)}>
                        <Radio on={sel} />
                        <span style={{ ...S.optLabel, ...(sel ? S.optLabelOn : {}) }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={S.actions}>
              <button style={{ ...S.ghost, ...(cur === 0 ? S.disabled : {}) }} disabled={cur === 0} onClick={() => go(cur - 1)}><Icon name="chevronLeft" size={16} /> Previous</button>
              <div style={{ flex: 1 }} />
              {cur === total - 1 ? (
                <button style={{ ...S.finish, ...(allDone ? {} : S.disabled) }} disabled={!allDone} onClick={() => void finish(answers)}>Finish &amp; see results</button>
              ) : (
                <button style={S.next} onClick={() => go(cur + 1)}>Next <Icon name="chevronRight" size={16} /></button>
              )}
            </div>
            {cur < total - 1 && <div style={S.tapHint}>Tap an answer to continue, or use Next to come back to it later</div>}
            {!allDone && cur === total - 1 && <div style={S.hint}>Answer all {total} questions to finish ({total - answeredCount} left).</div>}
            {err && <div style={S.err}>{err}</div>}
          </div>
        </main>

        <aside style={S.nav} className="og-exam-nav">
          <div style={S.navTitle}>Question Navigator</div>
          <div style={S.legend}>
            <span style={S.legItem}><i style={{ ...S.dot, background: GREEN }} /> Answered</span>
            <span style={S.legItem}><i style={{ ...S.dot, background: BLUE }} /> Current</span>
            <span style={S.legItem}><i style={{ ...S.dot, background: AMBER }} /> Review</span>
            <span style={S.legItem}><i style={{ ...S.dot, background: "#cbd2dd" }} /> Pending</span>
          </div>
          <div style={S.navScroll} className="og-nav-scroll">
            <div style={S.navGrid}>
              {steps.map((s, i) => {
                const id = idOf(s);
                const st = i === cur ? S.navCur : review[id] ? S.navRev : answered(s) ? S.navAns : S.navPend;
                return <button key={id} onMouseDown={(e) => e.preventDefault()} onClick={() => go(i)} style={{ ...S.navCell, ...st }}>{i + 1}</button>;
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
