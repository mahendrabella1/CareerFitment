"use client";
/**
 * Communication Lab pages (spec §11): Lab home, a track (preview), a module,
 * a lesson, the daily challenge, and My CQ and progress.
 */
import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/app/Icons";
import { FEATURES } from "@/lib/features/catalog";
import { dayKey, lastDays } from "@/lib/progress/activity";
import { FeatureHero } from "@/components/feature/FeatureHero";
import type { SearchItem } from "@/components/feature/FeatureSearch";
import { PageHeader } from "@/components/course/fx";
import { TRACKS, TYPE_ICON, TYPE_LABEL, dailyPrompt, findLesson, findPrompt, lessonHref, trackById } from "@/lib/commLab/content";
import { SKILL_LABEL, XP_PER_LEVEL, bandOf, cqTrend, lessonUnlocked, levelLabel, moduleStatus, moduleUnlocked } from "@/lib/commLab/scoring";
import { SKILLS, type Track } from "@/lib/commLab/types";
import { useCommLab } from "./CommLabProvider";
import { BadgeShelf, CqTrend, ModuleList, ProgressRing, SkillRadar } from "./LabParts";
import { LessonPlayer } from "./LessonPlayer";
import { VoiceStudio } from "./VoiceStudio";

/** The next lesson to do in a track: the first open, unfinished one. */
function nextLesson(track: Track, lessons: ReturnType<typeof useCommLab>["state"]["lessons"]) {
  for (const [mi, m] of track.modules.entries()) {
    if (!moduleUnlocked(track.modules, mi, lessons)) return null;
    const i = m.lessons.findIndex((l, li) => lessons[l.id]?.s !== "completed" && lessonUnlocked(m, li, lessons));
    if (i >= 0) return { m, l: m.lessons[i], mi };
  }
  return null;
}

function trackPct(track: Track, lessons: ReturnType<typeof useCommLab>["state"]["lessons"]) {
  const all = track.modules.flatMap((m) => m.lessons);
  return all.length ? Math.round((all.filter((l) => lessons[l.id]?.s === "completed").length / all.length) * 100) : 0;
}

// ------------------------------------------------------------------ home

export function LabHome() {
  const lab = useCommLab();
  const meta = FEATURES.communication;
  const t = lab.track;
  const next = nextLesson(t, lab.state.lessons);
  const pct = trackPct(t, lab.state.lessons);
  const today = dailyPrompt(t);
  const doneToday = !!lab.state.daily[dayKey()];
  const started = Object.keys(lab.state.lessons).length > 0;

  const search = useMemo<SearchItem[]>(() => [t, ...TRACKS.filter((x) => x !== t)].flatMap((tr) => tr.modules.flatMap((m) => m.lessons.map((l) => ({
    label: l.title, kind: TYPE_LABEL[l.type], hint: `${tr.level} · ${m.title}`, href: lessonHref(tr, m, l),
  })))), [t]);

  return (
    <>
      <FeatureHero
        meta={meta}
        search={search}
        placeholder="Search lessons, videos and practice"
        popular={[{ label: "Today's challenge", href: "/account/communication/practice" }, { label: "My CQ", href: "/account/communication/progress" }]}
        primary={next ? { label: started ? `Continue: ${next.l.title.length > 24 ? `${next.l.title.slice(0, 23)}…` : next.l.title}` : "Start lesson 1", href: lessonHref(t, next.m, next.l) } : { label: "Today's speaking challenge", href: "/account/communication/practice" }}
        secondary={next ? { label: "Today's speaking challenge", href: "/account/communication/practice" } : { label: "My CQ and progress", href: "/account/communication/progress" }}
        stats={[
          { value: lab.cq.cq ?? "-", label: lab.cq.cq !== null ? `CQ · ${bandOf(lab.cq.cq)}` : "CQ - finish a lesson to get one" },
          { value: lab.streak.current, label: "day streak" },
          { value: `Level ${lab.level.level}`, label: `${lab.state.xp} XP` },
          { value: t.modules.length ? `${pct}%` : "-", label: t.modules.length ? `of ${t.level} done` : "your track opens soon" },
        ]}
      />

      <section className="fp-sec">
        <div className="cl-grid">
          <div className="cl-card">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Communication Score</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="cl-big">{lab.cq.cq ?? "–"}</span>
              {lab.cq.cq !== null && <span className="cl-band">{bandOf(lab.cq.cq)}</span>}
            </div>
            <small className="fp-muted">{lab.cq.cq === null ? "Your CQ appears after your first scored lesson or recording." : lab.cq.measured.length < 4 ? `Based on ${lab.cq.measured.length} of 4 skills so far.` : "Speaking, writing, listening and reading."}</small>
            <div className="cl-skillbars">
              {SKILLS.map((s) => <div key={s} className="cl-skillbar"><span>{SKILL_LABEL[s]}</span><i><b style={{ width: `${lab.cq.bySkill[s] ?? 0}%` }} /></i><span>{lab.cq.bySkill[s] ?? "–"}</span></div>)}
            </div>
          </div>
          <div className="cl-card">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>{started ? "Continue where you left off" : "Your course"}</span>
            {t.modules.length ? (
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <ProgressRing pct={pct} label={`${pct}% of the ${t.level} track done`} />
                <div style={{ minWidth: 0 }}>
                  <h3>{next ? next.l.title : t.planned.length ? "Every open lesson done!" : "Track complete!"}</h3>
                  <small className="fp-muted">{next ? `Module ${next.mi + 1}: ${next.m.title} · ${TYPE_LABEL[next.l.type]} · ${next.l.minutes} min` : t.planned.length ? "New modules are on the way." : "Keep your CQ growing with the daily challenge."}</small>
                </div>
              </div>
            ) : <p className="fp-muted" style={{ margin: 0 }}>The {t.level} track ({t.title}) opens in the next update. Until then, do the daily challenge - it counts towards your CQ.</p>}
            {next && <Link href={lessonHref(t, next.m, next.l)} className="fp-btn fp-btn-pri" style={{ marginTop: "auto", alignSelf: "flex-start" }}>{started ? "Continue" : "Start"} <Icon name="arrowRight" size={15} stroke={2} /></Link>}
          </div>
          <div className="cl-card">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Today&apos;s 1-minute challenge</span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "var(--ink)" }}>{today.text}</p>
            <small className="fp-muted">{doneToday ? "Done today - come back tomorrow for a new one." : `${lab.streak.current ? `Keep your ${lab.streak.current}-day streak going.` : "Daily goal: one lesson or one challenge."}`}</small>
            <Link href="/account/communication/practice" className={`fp-btn${doneToday ? "" : " fp-btn-pri"}`} style={{ marginTop: "auto", alignSelf: "flex-start" }}>
              {doneToday ? <><Icon name="check" size={15} stroke={2.4} /> Practise again</> : <><Icon name="audio" size={15} stroke={2} /> Record now</>}
            </Link>
          </div>
        </div>
      </section>

      <section className="fp-sec" id="track" style={{ scrollMarginTop: 120 }}>
        <div className="fp-sec-h"><div><h2>Your track: {t.title}</h2><p>{t.code} · {t.level} · {t.focus} · {t.weeks} weeks · {t.modules.length + t.planned.length} modules</p></div></div>
        <ModuleList track={t} state={lab.state} />
        <p className="fp-muted" style={{ marginTop: 10 }}>Lessons open one after another. The next module opens when you&apos;ve done 80% of a module and tried its check-in.</p>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Badges</h2><p>{Object.keys(lab.state.badges).length} earned · Level {lab.level.level} ({lab.level.into}/{XP_PER_LEVEL} XP to the next)</p></div>
          <Link href="/account/communication/progress" className="fp-link">My CQ and progress <Icon name="arrowRight" size={15} stroke={2} /></Link></div>
        <BadgeShelf track={t} state={lab.state} />
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Other tracks</h2><p>Have a look at any level. Your CQ counts only your own track.</p></div></div>
        <div className="cl-grid">
          {TRACKS.filter((x) => x !== t).map((x) => (
            <Link key={x.id} href={`/account/communication/${x.id}`} className="cl-card" style={{ textDecoration: "none", color: "var(--ink)" }}>
              <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>{x.code} · {x.level}</span>
              <h3>{x.title}</h3>
              <small className="fp-muted">{x.focus} · {x.modules.length ? `${x.modules.length} modules open` : "opens soon"}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="fp-sec">
        <p className="cl-note"><Icon name="shield" size={16} stroke={2} /><span>Your voice recordings are turned into text and scored, then dropped - OneGrasp keeps only the text and your scores. Students under 18 need a parent&apos;s or guardian&apos;s OK before their first recording.</span></p>
      </section>
    </>
  );
}

// ------------------------------------------------------------------ track (preview or your own)

export function TrackPage({ trackId }: { trackId: string }) {
  const lab = useCommLab();
  const t = trackById(trackId);
  if (!t) return <p className="fp-muted">No such track. <Link href="/account/communication" className="fp-link">Back to the Lab</Link></p>;
  const own = t.id === lab.track.id;
  return (
    <>
      <PageHeader icon="route" eyebrow={`${t.code} · ${t.level}${own ? " · your track" : " · preview"}`} title={t.title} subtitle={t.focus} meta={[`${t.weeks} weeks`, `${t.modules.length + t.planned.length} modules`, ...(t.planned.length ? [t.modules.length ? `${t.modules.length} open now` : "Opens soon"] : [`${t.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons`])]} />
      <section className="fp-sec" style={{ marginTop: 24 }}>
        <ModuleList track={t} state={lab.state} preview={!own} />
      </section>
      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Daily challenges for {t.level}</h2><p>One prompt a day - try any of them in the practice room.</p></div></div>
        <ul className="lp-take" style={{ fontSize: 14.5 }}>{t.daily.map((p) => <li key={p.id}>{p.text}</li>)}</ul>
      </section>
    </>
  );
}

// ------------------------------------------------------------------ module

export function ModulePage({ trackId, moduleId }: { trackId: string; moduleId: string }) {
  const lab = useCommLab();
  const t = trackById(trackId);
  const mi = t?.modules.findIndex((m) => m.id === moduleId) ?? -1;
  if (!t || mi < 0) return <p className="fp-muted">This module isn&apos;t open yet. <Link href="/account/communication" className="fp-link">Back to the Lab</Link></p>;
  const m = t.modules[mi];
  const st = moduleStatus(m, lab.state.lessons);
  const open = moduleUnlocked(t.modules, mi, lab.state.lessons);
  return (
    <>
      <PageHeader icon="layers" back={{ href: t.id === lab.track.id ? "/account/communication#track" : `/account/communication/${t.id}`, label: `${t.code} · ${t.title}` }}
        eyebrow={`Module ${mi + 1} of ${t.modules.length + t.planned.length} · ${t.level}`} title={m.title} subtitle={m.summary}
        meta={[`${m.lessons.length} lessons`, `About ${m.minutes} min`, `Badge: ${m.badge.title}`]} />
      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="cl-grid" style={{ gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)" }}>
          <div className="cl-card">
            <h3>By the end of this module you can</h3>
            <ul className="lp-take" style={{ fontSize: 14.5, margin: 0 }}>{m.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
          <div className="cl-card" style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <ProgressRing pct={st.pct} size={76} label={`${st.pct}% of the module done`} />
            <div><h3>{st.done} of {st.total} lessons</h3><small className="fp-muted">{st.badge ? `Badge earned: ${m.badge.title}` : st.passed ? "Next module open" : "80% + the check-in opens the next module"}</small></div>
          </div>
        </div>
      </section>
      <section className="fp-sec">
        {!open && <p className="cl-note" style={{ marginBottom: 12 }}><Icon name="lock" size={16} stroke={2} /><span>This module opens when module {mi} is 80% done and its check-in has been tried.</span></p>}
        <div className="cl-mods">
          {m.lessons.map((l, i) => {
            const p = lab.progress(l.id);
            const unlocked = open && lessonUnlocked(m, i, lab.state.lessons);
            const done = p?.s === "completed";
            return (
              <Link key={l.id} href={lessonHref(t, m, l)} className={`cl-mod${unlocked ? "" : " is-locked"}`}>
                <span className={`cl-mod-n${done ? " is-done" : ""}`}>{done ? <Icon name="check" size={18} stroke={2.6} /> : unlocked ? <Icon name={TYPE_ICON[l.type]} size={17} stroke={2} /> : <Icon name="lock" size={16} stroke={2} />}</span>
                <span className="cl-mod-b"><b>{i + 1}. {l.title}</b><small>{TYPE_LABEL[l.type]}{l.type === "quiz" && l.assessment ? " · module check-in" : ""} · {l.minutes} min · +{l.xp} XP{p?.best !== undefined ? ` · best ${p.best}%` : ""}</small></span>
                <span className="cl-mod-s">{done ? "Done" : unlocked ? <>Open <Icon name="arrowRight" size={14} stroke={2} /></> : "Locked"}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

export function LessonPage({ lessonId }: { lessonId: string }) {
  const ref = findLesson(lessonId);
  if (!ref) return <p className="fp-muted">This lesson doesn&apos;t exist. <Link href="/account/communication" className="fp-link">Back to the Lab</Link></p>;
  return <LessonPlayer refL={ref} />;
}

// ------------------------------------------------------------------ daily challenge

/** ?p=<prompt id> picks another prompt (read in the browser, so the page stays static). */
export function PracticeFromQuery() {
  const p = useSearchParams().get("p") ?? undefined;
  return <PracticePage promptId={p} />;
}

export function PracticePage({ promptId }: { promptId?: string }) {
  const lab = useCommLab();
  const t = lab.track;
  const today = dailyPrompt(t);
  const chosen = (promptId && findPrompt(promptId)?.prompt) || today;
  const isToday = chosen.id === today.id;
  return (
    <>
      <PageHeader icon="audio" eyebrow={isToday ? `Daily challenge · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}` : "Practice room"}
        title={isToday ? "Today's speaking challenge" : "Practise any prompt"}
        subtitle="One minute, out loud. Get your pace, filler words, pauses and three things to try next."
        meta={[`${lab.streak.current}-day streak`, lab.state.daily[dayKey()] ? "Done today" : "+30 XP today", `Track: ${t.level}`]} />
      <section className="fp-sec" style={{ marginTop: 24 }}>
        <VoiceStudio key={chosen.id} prompt={chosen} lessonRef={null} />
      </section>
      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>More prompts for {t.level}</h2><p>Practise as often as you like - each recording counts towards your speaking score.</p></div></div>
        <div className="cl-mods">
          {t.daily.map((p) => (
            <Link key={p.id} href={`/account/communication/practice?p=${p.id}`} className="cl-mod" aria-current={p.id === chosen.id ? "true" : undefined}>
              <span className="cl-mod-n"><Icon name="audio" size={16} stroke={2} /></span>
              <span className="cl-mod-b"><b>{p.text}</b><small>{p.targetSec} s · {(lab.state.voice[p.id] ?? []).length} attempts{p.id === today.id ? " · today's challenge" : ""}</small></span>
              <span className="cl-mod-s">{p.id === chosen.id ? "Here" : <>Try <Icon name="arrowRight" size={14} stroke={2} /></>}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

// ------------------------------------------------------------------ my CQ and progress

export function ProgressPage() {
  const lab = useCommLab();
  const t = lab.track;
  const trend = cqTrend(lab.state.skills, t.id);
  const days = lastDays(28);
  const active = new Set(lab.state.days);
  const attempts = Object.entries(lab.state.voice).flatMap(([pid, list]) => list.map((a) => ({ ...a, pid }))).filter((a) => !a.unscored).sort((a, b) => b.at - a.at);
  return (
    <>
      <PageHeader icon="radar" eyebrow={`${t.code} · ${t.level}`} title="My CQ and progress" subtitle="Your Communication Score (CQ) combines speaking (35%), writing (25%), listening (20%) and reading (20%). Each skill weighs your latest attempt most, so one bad day doesn't pull it down." />
      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="cl-grid">
          <div className="cl-card">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>CQ</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="cl-big">{lab.cq.cq ?? "–"}</span>{lab.cq.cq !== null && <span className="cl-band">{bandOf(lab.cq.cq)}</span>}</div>
            <small className="fp-muted">Bands: Beginner 0-39 · Developing 40-59 · Proficient 60-74 · Advanced 75-89 · Expert 90-100</small>
          </div>
          <div className="cl-card">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Level and XP</span>
            <span className="cl-big">Level {lab.level.level}</span>
            <div className="fp-bar"><i style={{ width: `${(lab.level.into / XP_PER_LEVEL) * 100}%`, background: "var(--accent)" }} /></div>
            <small className="fp-muted">{lab.state.xp} XP · {XP_PER_LEVEL - lab.level.into} to the next level</small>
          </div>
          <div className="cl-card">
            <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Streak</span>
            <span className="cl-big">{lab.streak.current} <small style={{ fontSize: 16, color: "var(--mute)" }}>days</small></span>
            <div className="cl-cal" aria-label="Last 4 weeks of practice">{days.map((d) => <i key={d} className={active.has(d) ? "is-on" : ""} title={d} />)}</div>
            <small className="fp-muted">Longest: {lab.streak.longest} days · a freeze covers one missed day after every 7</small>
          </div>
        </div>
      </section>
      <section className="fp-sec">
        <div className="cl-grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)" }}>
          <div className="cl-card" style={{ alignItems: "center" }}>
            <h3 style={{ alignSelf: "flex-start" }}>Skills</h3>
            <SkillRadar bySkill={lab.cq.bySkill} />
            <small className="fp-muted" style={{ alignSelf: "flex-start" }}>{lab.cq.measured.length < 4 ? `Not measured yet: ${SKILLS.filter((s) => !lab.cq.measured.includes(s)).map((s) => SKILL_LABEL[s]).join(", ")}.` : "All four skills measured."}</small>
          </div>
          <div className="cl-card">
            <h3>CQ, week by week</h3>
            {trend.some((v) => v !== null) ? <CqTrend points={trend} /> : <p className="fp-muted" style={{ margin: 0 }}>Your trend line starts after your first scored lesson.</p>}
          </div>
        </div>
      </section>
      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Modules</h2></div></div>
        <ModuleList track={t} state={lab.state} />
      </section>
      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Voice practice</h2><p>{attempts.length ? `${attempts.length} scored recordings` : "No recordings yet."}</p></div>
          <Link href="/account/communication/practice" className="fp-link">Record one <Icon name="arrowRight" size={15} stroke={2} /></Link></div>
        {attempts.length > 0 && (
          <div className="cl-mods">
            {attempts.slice(0, 10).map((a) => (
              <div key={a.at} className="cl-mod">
                <span className="cl-mod-n">{a.total}</span>
                <span className="cl-mod-b"><b>{findPrompt(a.pid)?.prompt.text ?? a.pid}</b><small>{new Date(a.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {a.metrics.wpm} wpm · {a.metrics.fillersPerMin} fillers/min · {Math.round(a.metrics.durationSec)} s</small></span>
                <span className="cl-mod-s">{levelLabel(a.total)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Badges</h2></div></div>
        <BadgeShelf track={t} state={lab.state} />
      </section>
      <style dangerouslySetInnerHTML={{ __html: `.cl .cl-cal{display:grid;grid-template-columns:repeat(14,1fr);gap:3px;margin:4px 0}.cl .cl-cal i{aspect-ratio:1;border-radius:3px;background:#ece9e3}.cl .cl-cal i.is-on{background:var(--accent)}` }} />
    </>
  );
}
