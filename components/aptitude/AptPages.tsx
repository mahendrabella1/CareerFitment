"use client";
/**
 * Aptitude Lab pages: home, a topic (concept card, then practice), today's ten,
 * the mock tests, and My progress.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { FEATURES } from "@/lib/features/catalog";
import { dayKey } from "@/lib/progress/activity";
import { FeatureHero } from "@/components/feature/FeatureHero";
import type { SearchItem } from "@/components/feature/FeatureSearch";
import { PageHeader } from "@/components/course/fx";
import { SECTION_LABEL, SECTIONS, type Level, type Section } from "@/lib/aptitude/core";
import { APT_TRACKS, MOCKS_PER_TRACK, dailySet, freshSeed, mockSet, topicById, topicSet } from "@/lib/aptitude/topics";
import { focusTopics, mastery, scoreBand, sectionScores, totalAnswered, type Answer } from "@/lib/aptitude/scoring";
import { useAptitude } from "./AptitudeProvider";
import { MasteryChip, MockRunner, PracticeRunner, mmss, type Logged } from "./AptParts";

const toAnswers = (log: Logged[]): Answer[] => log.map((l) => ({ topic: l.q.topic, ok: l.ok, sec: l.sec }));
const sectionsOf = (topics: { id: string }[]) => SECTIONS.filter((s) => topics.some((t) => topicById(t.id)?.section === s));

// ------------------------------------------------------------------ home

export function AptHome() {
  const apt = useAptitude();
  const meta = FEATURES.aptitude;
  const t = apt.track;
  const today = dayKey();
  const doneToday = apt.state.daily[today];
  const scores = sectionScores(apt.state, t);
  const focus = focusTopics(apt.state, t, 4);
  const lastMock = [...apt.state.mocks].reverse().find((m) => m.track === t.id);
  const solved = totalAnswered(apt.state);

  const search = useMemo<SearchItem[]>(() => t.topics.map((x) => {
    const tp = topicById(x.id)!;
    return { label: tp.title, kind: SECTION_LABEL[tp.section], hint: tp.concept.idea, href: `/account/aptitude/topic/${tp.id}` };
  }), [t]);

  return (
    <>
      <FeatureHero
        meta={meta}
        search={search}
        placeholder="Search topics: percentages, series, syllogisms..."
        popular={[{ label: "Today's 10", href: "/account/aptitude/daily" }, { label: "Mock test", href: "/account/aptitude/mock" }]}
        primary={doneToday === undefined ? { label: "Start today's 10", href: "/account/aptitude/daily" } : { label: "Take a mock test", href: "/account/aptitude/mock" }}
        secondary={doneToday === undefined ? { label: "Take a mock test", href: "/account/aptitude/mock" } : { label: "My progress", href: "/account/aptitude/progress" }}
        stats={[
          // The first two also make the tour's opening line, so they describe the Lab rather than the student.
          { value: t.topics.length, label: "topics with worked solutions" },
          { value: `${t.mock.sections.reduce((n, s) => n + s.count, 0)}-question`, label: "timed mock tests" },
          { value: apt.score.score ?? "–", label: apt.score.score !== null ? `Aptitude Score · ${scoreBand(apt.score.score)}` : "Aptitude Score (after 10 in a section)" },
          { value: apt.streak.current, label: `day streak · ${solved} solved` },
        ]}
      />

      <section className="fp-sec">
        <div className="ap-grid">
          <div className="ap-box">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Aptitude Score</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="ap-big">{apt.score.score ?? "–"}</span>
              {apt.score.score !== null && <span className="ap-band">{scoreBand(apt.score.score)}</span>}
            </div>
            <small className="fp-muted">{apt.score.score === null ? "Answer 10 questions in a section to get a score." : "Accuracy, with a little for speed. A practice score - not an exam prediction."}</small>
            <div className="ap-secs">
              {scores.filter((s) => sectionsOf(t.topics).includes(s.section)).map((s) => (
                <div key={s.section} className="ap-secbar"><span>{SECTION_LABEL[s.section]}</span><i><b style={{ width: `${s.score ?? 0}%` }} /></i><em>{s.score ?? "–"}</em></div>
              ))}
            </div>
          </div>
          <div className="ap-box">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Today&apos;s 10</span>
            <h3>{doneToday === undefined ? "Ten mixed questions, about 8 minutes" : `Done today: ${doneToday}/10`}</h3>
            <small className="fp-muted">{doneToday === undefined ? "Maths, reasoning and English, at your level. A new set every day." : apt.streak.current > 1 ? `${apt.streak.current}-day streak - come back tomorrow for a new set.` : "Come back tomorrow for a new set."}</small>
            <Link href="/account/aptitude/daily" className={`fp-btn${doneToday === undefined ? " fp-btn-pri" : ""}`} style={{ marginTop: "auto", alignSelf: "flex-start" }}>
              {doneToday === undefined ? <>Start <Icon name="arrowRight" size={15} stroke={2} /></> : "Review or practise again"}
            </Link>
          </div>
          <div className="ap-box">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Mock test</span>
            <h3>{t.mock.title}: {t.mock.sections.reduce((n, s) => n + s.count, 0)} questions, {t.mock.minutes} minutes</h3>
            <small className="fp-muted">{lastMock ? `Last: ${lastMock.c}/${lastMock.n} on ${new Date(lastMock.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.` : "Timed, like the real thing - with a score for each section."}</small>
            <Link href="/account/aptitude/mock" className="fp-btn" style={{ marginTop: "auto", alignSelf: "flex-start" }}>See the tests <Icon name="arrowRight" size={15} stroke={2} /></Link>
          </div>
        </div>
      </section>

      {focus.length > 0 && (
        <section className="fp-sec">
          <div className="fp-sec-h"><div><h2>{solved ? "Work on these next" : "Good places to start"}</h2><p>{solved ? "Your weakest topics first, then ones you haven't tried." : "Pick any topic - each starts with a short concept card."}</p></div></div>
          <div className="ap-topics">{focus.map((x) => <TopicCard key={x.id} id={x.id} />)}</div>
        </section>
      )}

      {sectionsOf(t.topics).map((sec) => (
        <section key={sec} className="fp-sec">
          <div className="fp-sec-h"><div><h2>{SECTION_LABEL[sec]}</h2><p>{t.topics.filter((x) => topicById(x.id)!.section === sec).length === 1 ? "1 topic" : `${t.topics.filter((x) => topicById(x.id)!.section === sec).length} topics`}</p></div></div>
          <div className="ap-topics">{t.topics.filter((x) => topicById(x.id)!.section === sec).map((x) => <TopicCard key={x.id} id={x.id} />)}</div>
        </section>
      ))}

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Your track: {t.title}</h2><p>{t.level} · in the style of {t.forExams}</p></div></div>
        <div className="ap-grid ap-grid4">
          {APT_TRACKS.map((x) => (
            <button key={x.id} className="ap-box" style={{ textAlign: "left", cursor: "pointer", font: "inherit", borderColor: x.id === t.id ? "var(--accent)" : undefined }} onClick={() => apt.setTrack(x.id)} aria-pressed={x.id === t.id}>
              <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>{x.level}{x.id === apt.ownTrack.id ? " · your class" : ""}</span>
              <h3>{x.title}</h3>
              <small className="fp-muted">{x.topics.length} topics · {x.mock.title}</small>
            </button>
          ))}
        </div>
        <p className="ap-note" style={{ marginTop: 12 }}><Icon name="info" size={16} stroke={2} /><span>Maths and reasoning questions are generated fresh each time with worked solutions, so you never run out. Practice tests are in the style of these exams - they aren&apos;t official papers, and the Aptitude Score is a practice guide, not a prediction.</span></p>
      </section>
    </>
  );
}

function TopicCard({ id }: { id: string }) {
  const apt = useAptitude();
  const tp = topicById(id)!;
  const stat = apt.state.topics[id];
  const range = apt.rangeOf(id);
  return (
    <Link href={`/account/aptitude/topic/${id}`} className="ap-topic">
      <b>{tp.title}</b>
      <small>{tp.concept.idea}</small>
      <span className="ap-topic-f">
        <MasteryChip stat={stat} />
        <span className="ap-lvl">{stat?.n ? `${stat.n} done · ` : ""}level {apt.levelOf(range)} of {range.max}</span>
      </span>
    </Link>
  );
}

// ------------------------------------------------------------------ a topic: concept card, then practice

export function TopicPage({ topicId }: { topicId: string }) {
  const apt = useAptitude();
  const tp = topicById(topicId);
  const range = apt.rangeOf(topicId);
  const [level, setLevel] = useState<Level | null>(null);
  const [run, setRun] = useState<string | null>(null);
  if (!tp) return <p className="fp-muted">No such topic. <Link href="/account/aptitude" className="fp-link">Back to the Lab</Link></p>;
  const lv = level ?? apt.levelOf(range);
  const stat = apt.state.topics[topicId];
  const inTrack = apt.track.topics.some((x) => x.id === topicId);
  const levels = ([1, 2, 3] as Level[]).filter((l) => l >= range.min && l <= range.max);

  if (run) {
    const questions = topicSet(topicId, lv, run, 10, range);
    return (
      <>
        <PageHeader icon="aptitude" eyebrow={`${SECTION_LABEL[tp.section]} · level ${lv}`} title={tp.title} back={{ href: "/account/aptitude", label: "All topics" }} />
        <div style={{ marginTop: 18 }}>
          <PracticeRunner key={run} questions={questions}
            onFinish={(log) => {
              const change = apt.recordPractice(toAnswers(log))[topicId];
              if (!change || change.from === change.to) return null;
              setLevel(change.to);
              return change.to > change.from ? `moved up to level ${change.to}` : `moved to level ${change.to} to build up`;
            }}
            again={{ label: "10 more questions", onClick: () => setRun(freshSeed()) }}
            exit={{ label: "Back to topics", href: "/account/aptitude" }} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader icon="aptitude" eyebrow={`${SECTION_LABEL[tp.section]}${inTrack ? "" : " · not in your track"}`} title={tp.title} subtitle={tp.concept.idea}
        meta={[`Target ~${tp.targetSec}s a question`, stat?.n ? `${stat.n} answered · ${mastery(stat).pct}% recently` : "Not tried yet", `Level ${lv} of ${range.max}`]} />
      <section className="fp-sec" style={{ marginTop: 22 }}>
        <div className="ap-concept">
          <div className="ap-box">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>The method</span>
            <ol>{tp.concept.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <span className="fp-kicker" style={{ border: 0, paddingTop: 8 }}>Example</span>
            <p className="ap-ex">{tp.concept.example}</p>
          </div>
          <div className="ap-box" style={{ gap: 12 }}>
            {tp.concept.shortcut && <p className="ap-tip" style={{ margin: 0 }}><Icon name="bulb" size={17} stroke={2} /><span><b>Shortcut.</b> {tp.concept.shortcut}</span></p>}
            {tp.concept.trap && <p className="ap-tip" style={{ margin: 0 }}><Icon name="shield" size={17} stroke={2} /><span><b>Common mistake.</b> {tp.concept.trap}</span></p>}
            <div style={{ marginTop: "auto" }}>
              <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Level</span>
              <div className="ap-seg" role="radiogroup" aria-label="Level" style={{ marginTop: 6 }}>
                {levels.map((l) => <button key={l} role="radio" aria-checked={lv === l} className={lv === l ? "is-on" : ""} onClick={() => setLevel(l)}>{l === 1 ? "Basic" : l === 2 ? "Standard" : "Advanced"}</button>)}
              </div>
              <p className="fp-muted" style={{ fontSize: 12.5, margin: "6px 0 0" }}>Score 8 or more out of 10 and you move up a level; 4 or less and you move down.</p>
            </div>
            <button className="fp-btn fp-btn-pri" style={{ alignSelf: "flex-start" }} onClick={() => setRun(freshSeed())}>Practise 10 questions <Icon name="arrowRight" size={15} stroke={2} /></button>
          </div>
        </div>
      </section>
    </>
  );
}

// ------------------------------------------------------------------ today's ten

export function DailyPage() {
  const apt = useAptitude();
  const today = dayKey();
  const [run, setRun] = useState(0);
  const questions = useMemo(() => dailySet(apt.track, apt.levelOf, today), [apt.track, today]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = apt.state.daily[today];
  if (!apt.ready) return <p className="fp-muted">Loading…</p>;
  return (
    <>
      <PageHeader icon="calendar" eyebrow={`${apt.track.title} · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`} title="Today's 10"
        subtitle="Four maths or data questions, four reasoning and two English - a new set every day, at your own level."
        meta={[done !== undefined ? `Today's score: ${done}/10` : "Not done yet", `${apt.streak.current}-day streak`]} />
      <div style={{ marginTop: 18 }}>
        <PracticeRunner key={run} questions={questions}
          onFinish={(log) => { apt.recordPractice(toAnswers(log), { daily: true }); return done !== undefined ? "today's score stays your first try" : null; }}
          again={{ label: "Try the same ten again", onClick: () => setRun((n) => n + 1) }}
          exit={{ label: "Back to the Lab", href: "/account/aptitude" }} />
      </div>
    </>
  );
}

// ------------------------------------------------------------------ mock tests

export function MockListPage() {
  const apt = useAptitude();
  const t = apt.track;
  const mine = apt.state.mocks.filter((m) => m.track === t.id);
  const count = t.mock.sections.reduce((n, s) => n + s.count, 0);
  return (
    <>
      <PageHeader icon="exam" eyebrow={`${t.title} · ${t.level}`} title="Mock tests" subtitle={`Timed tests in the style of ${t.forExams}. Each section is scored separately, and every question has a worked solution afterwards.`}
        meta={[`${count} questions`, `${t.mock.minutes} minutes`, t.mock.sections.map((s) => `${s.count} ${SECTION_LABEL[s.section].toLowerCase()}`).join(" · ")]} />
      <section className="fp-sec" style={{ marginTop: 22 }}>
        <div className="ap-grid">
          {Array.from({ length: MOCKS_PER_TRACK }, (_, i) => String(i + 1)).map((k) => {
            const best = mine.filter((m) => m.key === k).sort((a, b) => b.c - a.c)[0];
            return (
              <div key={k} className="ap-box">
                <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Mock test {k}</span>
                <h3>{t.mock.title}</h3>
                <small className="fp-muted">{best ? `Best: ${best.c}/${best.n} · same questions each time, so you can see your improvement.` : "The same questions each time - retake it to see your improvement."}</small>
                <Link href={`/account/aptitude/mock/${k}`} className="fp-btn fp-btn-pri" style={{ marginTop: "auto", alignSelf: "flex-start" }}>{best ? "Retake" : "Start"} <Icon name="arrowRight" size={15} stroke={2} /></Link>
              </div>
            );
          })}
        </div>
        <div className="ap-box" style={{ marginTop: 12, flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 220 }}><h3>Surprise test</h3><small className="fp-muted">New questions every time, at the same length and timing.</small></div>
          <Link href="/account/aptitude/mock/random" className="fp-btn">Start a surprise test</Link>
        </div>
      </section>
      {mine.length > 0 && (
        <section className="fp-sec">
          <div className="fp-sec-h"><div><h2>Your results</h2><p>Your last {mine.length} test{mine.length === 1 ? "" : "s"} on this track.</p></div></div>
          <MockHistory />
        </section>
      )}
    </>
  );
}

export function MockPage({ mockKey }: { mockKey: string }) {
  const apt = useAptitude();
  const t = apt.track;
  const [seed] = useState(() => (mockKey === "random" ? `random-${freshSeed()}` : mockKey));
  const questions = useMemo(() => mockSet(t, seed), [t, seed]);
  if (!apt.ready) return <p className="fp-muted">Loading…</p>;
  const title = mockKey === "random" ? "Surprise test" : `Mock test ${mockKey}`;
  return (
    <div style={{ marginTop: 8 }}>
      <MockRunner questions={questions} minutes={t.mock.minutes} title={title} exit={{ label: "Back to the tests", href: "/account/aptitude/mock" }}
        onSubmit={(log, sec) => {
          const by: Partial<Record<Section, { c: number; n: number }>> = {};
          for (const l of log) { const b = (by[l.q.section] ??= { c: 0, n: 0 }); b.n += 1; if (l.ok) b.c += 1; }
          // Skipped questions count as wrong for the test, but only answered ones feed each topic's accuracy.
          apt.recordMock({ key: seed, at: Date.now(), c: log.filter((l) => l.ok).length, n: log.length, sec, by, track: t.id }, toAnswers(log.filter((l) => l.choice !== null)));
        }} />
    </div>
  );
}

function MockHistory() {
  const apt = useAptitude();
  const mine = [...apt.state.mocks].filter((m) => m.track === apt.track.id).reverse();
  return (
    <table className="ap-tbl">
      <thead><tr><th scope="col">Test</th><th scope="col">Date</th><th scope="col" className="n">Score</th><th scope="col" className="hide-sm">By section</th><th scope="col" className="n hide-sm">Time</th></tr></thead>
      <tbody>
        {mine.map((m) => (
          <tr key={`${m.key}-${m.at}`}>
            <td>{m.key.startsWith("random") ? "Surprise test" : `Mock test ${m.key}`}</td>
            <td>{new Date(m.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
            <td className="n"><b>{m.c}/{m.n}</b> · {Math.round((100 * m.c) / m.n)}%</td>
            <td className="hide-sm">{(Object.entries(m.by) as [Section, { c: number; n: number }][]).map(([s, v]) => `${SECTION_LABEL[s]} ${v.c}/${v.n}`).join(" · ")}</td>
            <td className="n hide-sm">{mmss(m.sec)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ------------------------------------------------------------------ my progress

export function ProgressPage() {
  const apt = useAptitude();
  const t = apt.track;
  const scores = sectionScores(apt.state, t).filter((s) => sectionsOf(t.topics).includes(s.section));
  const days = apt.state.days.length;
  return (
    <>
      <PageHeader icon="score" eyebrow={`${t.title} · ${t.level}`} title="My aptitude progress"
        subtitle="How accurate and how quick you are in each section and topic, and how your mock tests went."
        meta={[apt.score.score !== null ? `Aptitude Score ${apt.score.score} · ${scoreBand(apt.score.score)}` : "No score yet", `${totalAnswered(apt.state)} questions`, `${days} day${days === 1 ? "" : "s"} practised · ${apt.streak.current}-day streak`]} />

      <section className="fp-sec" style={{ marginTop: 22 }}>
        <div className="fp-sec-h"><div><h2>By section</h2><p>Score = 80% accuracy (your last 30 answers per topic) + 20% speed against each topic&apos;s target time. A section is scored after 10 answers.</p></div></div>
        <table className="ap-tbl">
          <thead><tr><th scope="col">Section</th><th scope="col" className="n">Answered</th><th scope="col" className="n">Accuracy</th><th scope="col" className="n">Speed</th><th scope="col" className="n">Score</th></tr></thead>
          <tbody>
            {scores.map((s) => (
              <tr key={s.section}>
                <th scope="row">{SECTION_LABEL[s.section]}</th>
                <td className="n">{s.answered}</td>
                <td className="n">{s.accuracy ?? "–"}{s.accuracy !== null ? "%" : ""}</td>
                <td className="n">{s.speed ?? "–"}{s.speed !== null ? "%" : ""}</td>
                <td className="n"><b>{s.score ?? "–"}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>By topic</h2><p>Average time is compared with the target for each topic.</p></div></div>
        <table className="ap-tbl">
          <thead><tr><th scope="col">Topic</th><th scope="col">Where you are</th><th scope="col" className="n hide-sm">Answered</th><th scope="col" className="n hide-sm">Avg time</th><th scope="col" className="n">Level</th><th scope="col" aria-label="Practise" /></tr></thead>
          <tbody>
            {t.topics.map((x) => {
              const tp = topicById(x.id)!, s = apt.state.topics[x.id];
              const avg = s?.n ? Math.round(s.sec / s.n) : null;
              return (
                <tr key={x.id}>
                  <th scope="row" style={{ fontWeight: 500 }}>{tp.title}<br /><small className="fp-muted">{SECTION_LABEL[tp.section]}</small></th>
                  <td><MasteryChip stat={s} /></td>
                  <td className="n hide-sm">{s?.n ?? 0}</td>
                  <td className="n hide-sm">{avg !== null ? <span style={{ color: avg > tp.targetSec * 1.25 ? "#a15c00" : undefined }}>{avg}s / {tp.targetSec}s</span> : "–"}</td>
                  <td className="n">{apt.levelOf(x)}/{x.max}</td>
                  <td><Link href={`/account/aptitude/topic/${x.id}`}>Practise</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Mock tests</h2><p>{apt.state.mocks.filter((m) => m.track === t.id).length ? "Your recent tests on this track." : "No mock test yet on this track."}</p></div>
          <Link href="/account/aptitude/mock" className="fp-link">Take a test <Icon name="arrowRight" size={15} stroke={2} /></Link></div>
        {apt.state.mocks.some((m) => m.track === t.id) && <MockHistory />}
      </section>
    </>
  );
}
