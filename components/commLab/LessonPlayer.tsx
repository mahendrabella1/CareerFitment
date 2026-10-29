"use client";
/**
 * One Communication Lab lesson (spec §3, §5, §7, §8): the header, the lesson
 * by type, and Previous / Next with the module's progress. Locked lessons and
 * modules explain what opens them.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { TYPE_ICON, TYPE_LABEL, lessonHref, moduleHref, type LessonRef } from "@/lib/commLab/content";
import { PASS_PERCENT, lessonUnlocked, moduleStatus, moduleUnlocked } from "@/lib/commLab/scoring";
import type { Activity, ActivityLesson, Question, QuizLesson, ReadingLesson, TaskLesson, TaskReport, VideoLesson } from "@/lib/commLab/types";
import { useCommLab } from "./CommLabProvider";
import { VoiceStudio } from "./VoiceStudio";

export function LessonPlayer({ refL }: { refL: LessonRef }) {
  const lab = useCommLab();
  const { track, module: m, moduleIndex, lesson, index } = refL;
  const status = moduleStatus(m, lab.state.lessons);
  const moduleOpen = moduleUnlocked(track.modules, moduleIndex, lab.state.lessons);
  const open = moduleOpen && lessonUnlocked(m, index, lab.state.lessons);
  const done = lab.progress(lesson.id)?.s === "completed";
  const prev = m.lessons[index - 1];
  const next = m.lessons[index + 1];
  const nextModule = track.modules[moduleIndex + 1];
  const preview = track.id !== lab.track.id;

  return (
    <div className="lp">
      <style dangerouslySetInnerHTML={{ __html: LP_CSS }} />
      <div className="lp-top">
        <Link href={moduleHref(track, m)} className="fp-link" style={{ fontSize: 13 }}><Icon name="arrowLeft" size={14} stroke={2} /> Module {moduleIndex + 1}: {m.title}</Link>
        <div className="lp-prog" aria-label={`${status.done} of ${status.total} lessons done`}>
          {m.lessons.map((l, i) => <i key={l.id} className={lab.progress(l.id)?.s === "completed" ? "is-done" : i === index ? "is-now" : ""} />)}
        </div>
      </div>
      <header className="lp-h">
        <span className="lp-kind"><Icon name={TYPE_ICON[lesson.type]} size={15} stroke={2} /> {TYPE_LABEL[lesson.type]} · Lesson {index + 1} of {m.lessons.length} · {lesson.minutes} min · +{lesson.xp} XP</span>
        <h1>{lesson.title}</h1>
        {done && <span className="lp-done"><Icon name="check" size={14} stroke={2.6} /> Completed</span>}
      </header>
      {preview && <p className="cl-note" style={{ margin: "0 0 14px" }}><Icon name="info" size={16} stroke={2} /> <span>You&apos;re previewing the {track.level} track. Your CQ counts lessons in your own track ({lab.track.level}).</span></p>}

      {!lab.ready ? <div className="lp-loading" aria-busy="true" /> : !open ? (
        <div className="cl-note"><Icon name="lock" size={16} stroke={2} /><span>{!moduleOpen
          ? <>This module opens when the one before it is 80% done and its module check-in has been attempted. <Link href={moduleHref(track, track.modules[moduleIndex - 1])} className="fp-link" style={{ fontSize: 14 }}>Go to module {moduleIndex}</Link></>
          : <>Finish the lesson before this one first. <Link href={lessonHref(track, m, prev)} className="fp-link" style={{ fontSize: 14 }}>{prev.title}</Link></>}</span></div>
      ) : (
        <div className="lp-body" key={lesson.id}>
          {lesson.type === "video" && <VideoBlock refL={refL} lesson={lesson} />}
          {lesson.type === "reading" && <ReadingBlock refL={refL} lesson={lesson} />}
          {lesson.type === "quiz" && <QuizBlockLesson refL={refL} lesson={lesson} />}
          {lesson.type === "activity" && <ActivityBlock refL={refL} lesson={lesson} />}
          {lesson.type === "task" && <TaskBlock refL={refL} lesson={lesson} />}
          {lesson.type === "voice" && <VoiceStudio prompt={lesson.prompt} lessonRef={refL} />}
        </div>
      )}

      <nav className="lp-nav" aria-label="Lessons">
        {prev ? <Link href={lessonHref(track, m, prev)} className="fp-btn fp-btn-sm"><Icon name="arrowLeft" size={14} stroke={2} /> Previous</Link> : <span />}
        <span className="fp-muted">{status.done} of {status.total} done</span>
        {next ? (
          done ? <Link href={lessonHref(track, m, next)} className="fp-btn fp-btn-pri fp-btn-sm">Next: {next.title.length > 22 ? `${next.title.slice(0, 21)}…` : next.title} <Icon name="arrowRight" size={14} stroke={2} /></Link>
            : <span className="fp-muted">Finish this lesson to go on</span>
        ) : status.passed && nextModule ? (
          <Link href={moduleHref(track, nextModule)} className="fp-btn fp-btn-pri fp-btn-sm">Next module <Icon name="arrowRight" size={14} stroke={2} /></Link>
        ) : <Link href={moduleHref(track, m)} className="fp-btn fp-btn-sm">Back to the module</Link>}
      </nav>
    </div>
  );
}

// ------------------------------------------------------------------ video (YouTube IFrame API, spec §5)

interface YTPlayer { getCurrentTime(): number; getDuration(): number; getPlayerState(): number; destroy(): void }
interface YTNamespace { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer; PlayerState: { PLAYING: number; ENDED: number } }
let ytReady: Promise<YTNamespace> | null = null;
function loadYouTube(): Promise<YTNamespace> {
  const w = window as unknown as { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };
  if (w.YT?.Player) return Promise.resolve(w.YT);
  ytReady ??= new Promise((resolve) => {
    const prior = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => { prior?.(); resolve(w.YT!); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return ytReady;
}

function VideoBlock({ refL, lesson }: { refL: LessonRef; lesson: VideoLesson }) {
  const lab = useCommLab();
  const saved = lab.progress(lesson.id);
  const holder = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(saved?.pct ?? 0);
  const save = useRef(lab.saveVideo);
  save.current = lab.saveVideo;

  useEffect(() => {
    let player: YTPlayer | null = null;
    let poll = 0;
    let gone = false;
    const dur = lesson.durationSec;
    let maxWatched = ((saved?.pct ?? 0) / 100) * dur;
    let lastSaved = 0;
    const resumeAt = saved?.pos && saved.pos < dur - 5 ? saved.pos : lesson.startSec ?? 0;
    const flush = () => {
      if (!player) return;
      const cur = player.getCurrentTime?.() ?? 0;
      const total = player.getDuration?.() || dur;
      const p = Math.min(100, Math.round((maxWatched / total) * 100));
      setPct((x) => Math.max(x, p));
      save.current(refL, cur, p);
      lastSaved = Date.now();
    };
    void loadYouTube().then((YT) => {
      if (gone || !holder.current) return;
      player = new YT.Player(holder.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: lesson.youtubeId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, start: Math.floor(resumeAt), cc_load_policy: 1, cc_lang_pref: "en" },
        events: {
          onStateChange: (e: { data: number }) => {
            if (e.data === YT.PlayerState.PLAYING) {
              window.clearInterval(poll);
              poll = window.setInterval(() => {
                const cur = player?.getCurrentTime() ?? 0;
                // Only natural playback counts: a jump of more than 10 s ahead doesn't.
                if (cur > maxWatched && cur - maxWatched <= 10) maxWatched = cur;
                if (Date.now() - lastSaved > 5000) flush();
              }, 1000);
            } else {
              window.clearInterval(poll);
              if (e.data === YT.PlayerState.ENDED) maxWatched = Math.max(maxWatched, (player?.getDuration() ?? dur) - 1);
              flush();
            }
          },
        },
      });
    });
    return () => { gone = true; window.clearInterval(poll); flush(); player?.destroy(); };
    // The player is created once per lesson.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const watched = pct >= 90 || saved?.s === "completed";
  return (
    <>
      <div className="lp-video"><div ref={holder} /></div>
      <div className="lp-watch">
        <div className="fp-bar" style={{ flex: 1 }}><i style={{ width: `${Math.min(100, pct)}%`, background: "var(--accent)" }} /></div>
        <span>{watched ? "Watched" : `${pct}% watched · completes at 90%`}</span>
      </div>
      <p className="fp-muted" style={{ margin: "4px 0 18px" }}>From {lesson.channel} on YouTube. Captions are on; turn them off with the CC button.</p>
      <section className="lp-sec">
        <h2>Key takeaways</h2>
        <ul className="lp-take">{lesson.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>
      <section className="lp-sec">
        <h2>Quick check</h2>
        {watched ? <QuizBlock questions={lesson.check} onScore={(s) => lab.videoCheck(refL, s)} best={saved?.best} />
          : <p className="fp-muted">Watch the video to unlock three quick questions.</p>}
      </section>
    </>
  );
}

// ------------------------------------------------------------------ reading

function ReadingBlock({ refL, lesson }: { refL: LessonRef; lesson: ReadingLesson }) {
  const lab = useCommLab();
  const end = useRef<HTMLDivElement>(null);
  const done = lab.progress(lesson.id)?.s === "completed";
  const [atEnd, setAtEnd] = useState(done);
  useEffect(() => {
    if (!end.current || atEnd) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) setAtEnd(true); });
    io.observe(end.current);
    return () => io.disconnect();
  }, [atEnd]);
  return (
    <article className="lp-read">
      {lesson.body.map((b, i) => typeof b === "string" ? <p key={i}>{b}</p>
        : "h" in b ? <h2 key={i}>{b.h}</h2>
        : "list" in b ? <ul key={i}>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>
        : <blockquote key={i}>{b.example.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</blockquote>)}
      <div ref={end} />
      <div className="lp-cta">
        {done ? <span className="lp-done"><Icon name="check" size={14} stroke={2.6} /> Marked as read</span>
          : <button type="button" className="fp-btn fp-btn-pri" disabled={!atEnd} onClick={() => lab.complete(refL)}>Mark as read</button>}
        {!atEnd && <span className="fp-muted">Read to the end to mark it.</span>}
      </div>
    </article>
  );
}

// ------------------------------------------------------------------ quiz

function QuizBlock({ questions, onScore, best, passMark }: { questions: Question[]; onScore: (score: number) => void; best?: number; passMark?: number }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const score = Math.round((answers.filter((a, i) => a === questions[i].answer).length / questions.length) * 100);
  const all = answers.every((a) => a !== null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!all) return; setChecked(true); onScore(score); }}>
      {questions.map((q, qi) => (
        <fieldset key={q.q} className="cl-q">
          <legend>{qi + 1}. {q.q}</legend>
          {q.options.map((o, oi) => {
            const cls = checked ? (oi === q.answer ? " is-right" : answers[qi] === oi ? " is-wrong" : "") : "";
            return (
              <label key={o} className={`cl-opt${cls}`}>
                <input type="radio" name={`q${qi}`} checked={answers[qi] === oi} disabled={checked} onChange={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))} />
                <span>{o}</span>
              </label>
            );
          })}
          {checked && q.why && <p className="cl-why">{q.why}</p>}
        </fieldset>
      ))}
      {checked ? (
        <div className="cl-result" role="status">
          <b>{score}%</b>
          <span>{passMark === undefined ? "Saved to your listening score." : score >= passMark ? "Passed - lesson complete." : `You need ${passMark}% to pass - have another go.`}</span>
          <button type="button" className="fp-btn fp-btn-sm" onClick={() => { setAnswers(questions.map(() => null)); setChecked(false); }}>Try again</button>
        </div>
      ) : (
        <div className="lp-cta">
          <button type="submit" className="fp-btn fp-btn-pri" disabled={!all}>Check my answers</button>
          {best !== undefined && <span className="fp-muted">Your best so far: {best}%</span>}
        </div>
      )}
    </form>
  );
}

function QuizBlockLesson({ refL, lesson }: { refL: LessonRef; lesson: QuizLesson }) {
  const lab = useCommLab();
  const started = useRef(Date.now());
  const [reflection, setReflection] = useState("");
  return (
    <>
      <QuizBlock questions={lesson.questions} passMark={PASS_PERCENT} best={lab.progress(lesson.id)?.best}
        onScore={(s) => lab.recordScore(refL, s, (Date.now() - started.current) / 1000)} />
      {lesson.reflection && (
        <section className="lp-sec">
          <h2>Think about it</h2>
          <label className="fp-muted" htmlFor="reflect" style={{ display: "block", marginBottom: 6 }}>{lesson.reflection} (just for you - not scored or saved)</label>
          <textarea id="reflect" className="lp-text" rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} />
        </section>
      )}
    </>
  );
}

// ------------------------------------------------------------------ activities (spec §7)

/** The same shuffle every time for a lesson (no hydration mismatch, fair retries). */
function seeded<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.every((x, i) => x === items[i]) && out.length > 1) [out[0], out[1]] = [out[1], out[0]];
  return out;
}

function ActivityBlock({ refL, lesson }: { refL: LessonRef; lesson: ActivityLesson }) {
  const lab = useCommLab();
  const started = useRef(Date.now());
  const submit = (score: number) => lab.recordScore(refL, score, (Date.now() - started.current) / 1000);
  const a: Activity = lesson.activity;
  const best = lab.progress(lesson.id)?.best;
  return (
    <>
      <p className="lp-ask">{a.prompt}</p>
      {a.kind === "order" && <OrderActivity items={a.items} seed={lesson.id} onSubmit={submit} />}
      {a.kind === "match" && <MatchActivity pairs={a.pairs} seed={lesson.id} onSubmit={submit} />}
      {a.kind === "choice" && <ChoiceActivity scenarios={a.scenarios} onSubmit={submit} />}
      {a.kind === "flashcards" && <Flashcards cards={a.cards} onSubmit={submit} />}
      {best !== undefined && <p className="fp-muted" style={{ marginTop: 10 }}>Your best so far: {best}%</p>}
    </>
  );
}

function OrderActivity({ items, seed, onSubmit }: { items: string[]; seed: string; onSubmit: (s: number) => void }) {
  const [list, setList] = useState(() => seeded(items, seed));
  const [checked, setChecked] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || checked) return;
    setList((l) => { const n = [...l]; const [x] = n.splice(from, 1); n.splice(to, 0, x); return n; });
  };
  const right = list.filter((x, i) => x === items[i]).length;
  return (
    <>
      <ol className="lp-order">
        {list.map((x, i) => (
          <li key={x} draggable={!checked} onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag !== null) move(drag, i); setDrag(null); }}
            className={checked ? (x === items[i] ? "is-right" : "is-wrong") : ""}>
            <span className="lp-grip" aria-hidden="true">⋮⋮</span>
            <span style={{ flex: 1 }}>{x}</span>
            {!checked && <>
              <button type="button" className="lp-mv" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move "${x}" up`}>↑</button>
              <button type="button" className="lp-mv" onClick={() => move(i, i + 1)} disabled={i === list.length - 1} aria-label={`Move "${x}" down`}>↓</button>
            </>}
          </li>
        ))}
      </ol>
      {checked ? (
        <div className="cl-result" role="status"><b>{right}/{items.length}</b><span>{right === items.length ? "Perfect order!" : "Green ones are in the right place."}</span>
          <button type="button" className="fp-btn fp-btn-sm" onClick={() => { setChecked(false); setList(seeded(items, seed + Date.now())); }}>Try again</button></div>
      ) : <div className="lp-cta"><button type="button" className="fp-btn fp-btn-pri" onClick={() => { setChecked(true); onSubmit(Math.round((right / items.length) * 100)); }}>Check the order</button><span className="fp-muted">Drag, or use the arrows.</span></div>}
    </>
  );
}

function MatchActivity({ pairs, seed, onSubmit }: { pairs: [string, string][]; seed: string; onSubmit: (s: number) => void }) {
  const options = useMemo(() => seeded(pairs.map((p) => p[1]), seed), [pairs, seed]);
  const [pick, setPick] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const right = pairs.filter(([a, b]) => pick[a] === b).length;
  return (
    <>
      <div className="lp-match">
        {pairs.map(([a, b]) => (
          <label key={a} className={checked ? (pick[a] === b ? "is-right" : "is-wrong") : ""}>
            <b>{a}</b>
            <select value={pick[a] ?? ""} disabled={checked} onChange={(e) => setPick((p) => ({ ...p, [a]: e.target.value }))}>
              <option value="">Choose a meaning…</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {checked && pick[a] !== b && <small>Answer: {b}</small>}
          </label>
        ))}
      </div>
      {checked ? (
        <div className="cl-result" role="status"><b>{right}/{pairs.length}</b><span>{right === pairs.length ? "All matched!" : "Check the answers in red."}</span>
          <button type="button" className="fp-btn fp-btn-sm" onClick={() => { setChecked(false); setPick({}); }}>Try again</button></div>
      ) : <div className="lp-cta"><button type="button" className="fp-btn fp-btn-pri" disabled={Object.keys(pick).length < pairs.length} onClick={() => { setChecked(true); onSubmit(Math.round((right / pairs.length) * 100)); }}>Check my matches</button></div>}
    </>
  );
}

function ChoiceActivity({ scenarios, onSubmit }: { scenarios: Extract<Activity, { kind: "choice" }>["scenarios"]; onSubmit: (s: number) => void }) {
  const [picks, setPicks] = useState<(number | null)[]>(() => scenarios.map(() => null));
  const [sent, setSent] = useState(false);
  const right = picks.filter((p, i) => p !== null && scenarios[i].options[p].best).length;
  const all = picks.every((p) => p !== null);
  useEffect(() => { if (all && !sent) { setSent(true); onSubmit(Math.round((right / scenarios.length) * 100)); } }, [all, sent, right, scenarios.length, onSubmit]);
  return (
    <>
      {scenarios.map((s, si) => (
        <fieldset key={s.situation} className="cl-q">
          <legend>{si + 1}. {s.situation}</legend>
          {s.options.map((o, oi) => {
            const chosen = picks[si] === oi;
            const cls = picks[si] !== null ? (o.best ? " is-right" : chosen ? " is-wrong" : "") : "";
            return (
              <div key={o.text}>
                <label className={`cl-opt${cls}`}>
                  <input type="radio" name={`s${si}`} checked={chosen} disabled={picks[si] !== null} onChange={() => setPicks((p) => p.map((x, i) => (i === si ? oi : x)))} />
                  <span>{o.text}</span>
                </label>
                {picks[si] !== null && (chosen || o.best) && <p className="cl-why">{o.best ? "Best choice: " : "Why not: "}{o.why}</p>}
              </div>
            );
          })}
        </fieldset>
      ))}
      {all && <div className="cl-result" role="status"><b>{right}/{scenarios.length}</b><span>best choices · saved</span>
        <button type="button" className="fp-btn fp-btn-sm" onClick={() => { setPicks(scenarios.map(() => null)); setSent(false); }}>Try again</button></div>}
    </>
  );
}

function Flashcards({ cards, onSubmit }: { cards: { word: string; meaning: string; example: string }[]; onSubmit: (s: number) => void }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const marked = Object.keys(known).length;
  const [sent, setSent] = useState(false);
  return (
    <>
      <div className="lp-cards">
        {cards.map((c) => (
          <div key={c.word} className={`lp-card${flipped[c.word] ? " is-flipped" : ""}${known[c.word] === true ? " is-known" : ""}`}>
            <button type="button" className="lp-card-face" onClick={() => setFlipped((f) => ({ ...f, [c.word]: !f[c.word] }))} aria-expanded={!!flipped[c.word]}>
              {flipped[c.word] ? <><b>{c.meaning}</b><small>&ldquo;{c.example}&rdquo;</small></> : <><b className="lp-word">{c.word}</b><small>Tap to see the meaning</small></>}
            </button>
            {flipped[c.word] && (
              <div className="lp-card-a">
                <button type="button" className={`fp-chip${known[c.word] === true ? " is-on" : ""}`} aria-pressed={known[c.word] === true} onClick={() => setKnown((k) => ({ ...k, [c.word]: true }))}>I know it</button>
                <button type="button" className="fp-chip" aria-pressed={known[c.word] === false} onClick={() => setKnown((k) => ({ ...k, [c.word]: false }))}>Practise again</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="lp-cta">
        <button type="button" className="fp-btn fp-btn-pri" disabled={marked < cards.length || sent} onClick={() => { setSent(true); onSubmit(Math.round((Object.values(known).filter(Boolean).length / cards.length) * 100)); }}>
          {sent ? "Saved" : "Done with the cards"}
        </button>
        <span className="fp-muted">{marked} of {cards.length} marked{sent ? " - come back to the ones to practise." : ""}</span>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ writing task (spec §8, AI review)

const MAX_ATTEMPTS = 3; // first try + 2 resubmissions

function TaskBlock({ refL, lesson }: { refL: LessonRef; lesson: TaskLesson }) {
  const lab = useCommLab();
  const prev = lab.state.tasks[lesson.id];
  const [text, setText] = useState(prev?.text ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const left = MAX_ATTEMPTS - (prev?.attempt ?? 0);

  const submit = async () => {
    setBusy(true); setError("");
    try {
      const token = await getFirebaseAuth()?.currentUser?.getIdToken();
      if (!token) throw new Error("Sign in to get feedback on your writing.");
      const res = await fetch("/api/comm-lab/task", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ lessonId: lesson.id, text }) });
      const data = (await res.json().catch(() => ({}))) as { report?: TaskReport; error?: string };
      if (!res.ok || !data.report) throw new Error(data.error || "Couldn't get feedback just now - please try again.");
      lab.recordTask(refL, text, data.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't get feedback just now - please try again.");
    }
    setBusy(false);
  };

  return (
    <>
      <p className="lp-ask">{lesson.instructions}</p>
      <details className="lp-rubric"><summary>How it&apos;s checked</summary><ul>{lesson.rubric.map((r) => <li key={r}>{r}</li>)}</ul></details>
      <textarea className="lp-text" rows={10} value={text} onChange={(e) => setText(e.target.value)} disabled={busy || left <= 0} aria-label="Your writing" placeholder="Write here…" />
      <div className="lp-cta">
        <button type="button" className="fp-btn fp-btn-pri" onClick={() => void submit()} disabled={busy || left <= 0 || words < lesson.minWords || words > lesson.maxWords || !lab.signedIn || (prev?.text === text && !!prev.report)}>
          {busy ? "Reading your work…" : prev ? "Resubmit for feedback" : "Submit for feedback"}
        </button>
        <span className={`fp-muted${words > lesson.maxWords ? " lp-over" : ""}`}>{words} words · {lesson.minWords}-{lesson.maxWords}{prev ? ` · ${Math.max(0, left)} ${left === 1 ? "try" : "tries"} left` : ""}</span>
      </div>
      {error && <p className="vs-err" role="alert" style={{ color: "#b42318" }}>{error}</p>}
      {prev?.report && (
        <section className="lp-sec">
          <h2>Feedback · {prev.report.score}/100 <small className="fp-muted">attempt {prev.attempt}, {new Date(prev.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</small></h2>
          <div className="lp-crit">{prev.report.criteria.map((c) => <div key={c.name}><span>{c.name}</span><i><b style={{ width: `${c.score * 10}%` }} /></i><em>{c.score}/10</em></div>)}</div>
          <div className="lp-fb">
            <div><b>What went well</b><ul>{prev.report.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div>
            <div><b>What to improve</b><ul>{prev.report.improvements.map((s) => <li key={s}>{s}</li>)}</ul></div>
          </div>
          <p className="cl-note" style={{ marginTop: 10 }}><Icon name="bulb" size={16} stroke={2} /> <span><b>Try this next:</b> {prev.report.nextTip}</span></p>
        </section>
      )}
    </>
  );
}

const LP_CSS = `
.lp{max-width:860px}
.lp-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}
.lp-prog{display:flex;gap:4px}
.lp-prog i{width:22px;height:6px;border-radius:3px;background:#e4e0d8}
.lp-prog i.is-done{background:var(--ok)}
.lp-prog i.is-now{background:var(--accent)}
.lp-h{margin-bottom:16px}
.lp-kind{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.04em}
.lp-h h1{font-size:clamp(24px,3vw,30px);font-weight:700;margin:6px 0 4px;line-height:1.2}
.lp-done{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;color:var(--ok)}
.lp-loading{min-height:240px;border-radius:8px;background:linear-gradient(90deg,#f6f4f0,#fbfaf7,#f6f4f0);background-size:200% 100%;animation:crtsh 1.4s linear infinite}
@keyframes crtsh{to{background-position:-200% 0}}
.lp-video{position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#111}
.lp-video iframe,.lp-video>div{position:absolute;inset:0;width:100%;height:100%;border:0}
.lp-watch{display:flex;align-items:center;gap:12px;margin-top:10px;font-size:13px;color:var(--ink2)}
.lp-sec{margin-top:24px}
.lp-sec h2{font-size:18px;font-weight:600;margin:0 0 10px}
.lp-take{margin:0;padding-left:20px;font-size:15px;line-height:1.7;color:var(--ink2)}
.lp-read{font-size:16px;line-height:1.75;color:var(--ink2)}
.lp-read h2{font-size:18px;font-weight:600;margin:22px 0 6px;color:var(--ink)}
.lp-read p{margin:0 0 12px}
.lp-read ul{margin:0 0 12px;padding-left:20px}
.lp-read blockquote{margin:12px 0;padding:12px 16px;border-left:3px solid var(--accent);background:var(--soft);border-radius:4px;color:var(--ink)}
.lp-cta{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin-top:16px}
.lp-ask{font-size:16px;font-weight:500;color:var(--ink);margin:0 0 14px}
.lp-order{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.lp-order li{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:8px;font-size:15px;cursor:grab}
.lp-order li.is-right{border-color:var(--ok);background:#f0f9f3}
.lp-order li.is-wrong{border-color:#e7a3a3;background:#fdf3f3}
.lp-grip{color:#b5b0a6;letter-spacing:-2px}
.lp-mv{width:34px;height:34px;border:1px solid var(--line2);border-radius:6px;background:#fff;cursor:pointer;font-size:15px}
.lp-mv:disabled{opacity:.35;cursor:default}
.lp-match{display:grid;gap:8px}
.lp-match label{display:grid;grid-template-columns:110px minmax(0,1fr);gap:4px 12px;align-items:center;padding:10px 12px;background:#fff;border:1px solid var(--line);border-radius:8px}
.lp-match label.is-right{border-color:var(--ok)}
.lp-match label.is-wrong{border-color:#e7a3a3}
.lp-match b{font-family:Poppins,Inter,sans-serif;font-size:16px}
.lp-match select{height:38px;border:1px solid var(--line2);border-radius:6px;padding:0 8px;font:inherit;font-size:14px;background:#fff}
.lp-match small{grid-column:2;font-size:12.5px;color:#b42318}
.lp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr));gap:10px}
.lp-card{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.lp-card.is-known{border-color:var(--ok)}
.lp-card-face{display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center;text-align:center;width:100%;min-height:118px;padding:14px;border:0;background:#fff;font:inherit;cursor:pointer;color:var(--ink)}
.lp-card.is-flipped .lp-card-face{background:color-mix(in srgb,var(--accent) 6%,#fff)}
.lp-word{font-family:Poppins,Inter,sans-serif;font-size:20px}
.lp-card-face small{font-size:12.5px;color:var(--mute);line-height:1.4}
.lp-card-a{display:flex;gap:6px;justify-content:center;padding:0 10px 10px}
.lp-card-a .fp-chip{height:28px;font-size:12px;padding:0 9px}
.lp-text{width:100%;border:1px solid var(--line2);border-radius:8px;padding:12px 14px;font:inherit;font-size:15px;line-height:1.6;resize:vertical;background:#fff}
.lp-text:focus{outline:2px solid color-mix(in srgb,var(--accent) 40%,transparent);border-color:var(--accent)}
.lp-over{color:#b42318!important}
.lp-rubric{margin-bottom:10px;font-size:14px;color:var(--ink2)}
.lp-rubric summary{cursor:pointer;font-weight:600;color:var(--ink)}
.lp-rubric ul{margin:6px 0 0;padding-left:20px}
.lp-crit{display:grid;gap:6px}
.lp-crit>div{display:grid;grid-template-columns:minmax(0,260px) minmax(0,1fr) 44px;gap:10px;align-items:center;font-size:13.5px;color:var(--ink2)}
.lp-crit i{display:block;height:8px;border-radius:4px;background:#ece9e3;overflow:hidden}
.lp-crit i b{display:block;height:100%;background:var(--accent)}
.lp-crit em{font-style:normal;text-align:right;color:var(--ink)}
.lp-fb{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.lp-fb>div{border:1px solid var(--line);border-radius:8px;padding:12px 14px;background:#fff}
.lp-fb ul{margin:6px 0 0;padding-left:18px;font-size:14px;line-height:1.6;color:var(--ink2)}
.lp-nav{position:sticky;bottom:0;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:28px;padding:12px 0;background:linear-gradient(transparent,var(--cps-bg,#f7f5f1) 30%)}
@media (max-width:640px){.lp-fb{grid-template-columns:1fr}.lp-crit>div{grid-template-columns:minmax(0,1fr) 44px}.lp-crit i{grid-column:1/-1;grid-row:2}.lp-match label{grid-template-columns:1fr}.lp-match small{grid-column:1}.lp-nav .fp-muted{display:none}}
`;
