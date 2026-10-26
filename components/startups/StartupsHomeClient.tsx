"use client";

/**
 * Startups home - laid out like an online course page: the hero (search,
 * tour), then "What you'll build", the course content (modules -> lessons ->
 * module test, with locked / done states) and a sticky card with progress,
 * the Startup Readiness Score and what the course includes.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { PublicTrack } from "@/lib/startups/publicShape";
import { fetchProgress, fetchSkillScoresHistory } from "@/lib/startups/clientProgress";
import { lessonStatus, moduleStatus, moduleTestUnlocked, nextUnfinishedLesson, type ProgressMap } from "@/lib/startups/unlock";
import { readinessScore } from "@/lib/startups/scoring";
import { FEATURES } from "@/lib/features/catalog";
import { FeatureHero } from "@/components/feature/FeatureHero";
import type { SearchItem } from "@/components/feature/FeatureSearch";

const MORE = [
  { href: "/account/startups/placement", title: "Placement quiz", note: "2 minutes", icon: "target" },
  { href: "/account/startups/portfolio", title: "Your Startup Portfolio", note: "Everything you've written", icon: "doc" },
  { href: "/account/startups/videos", title: "Video library", note: "Expert talks per module", icon: "video" },
];

function Chevron() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function StartupsHomeClient({ track }: { track: PublicTrack }) {
  const { user } = useAuth();
  const meta = FEATURES.startups;
  const [progress, setProgress] = useState<ProgressMap | null>(null);
  const [readiness, setReadiness] = useState<{ overall: number; bySkill: Record<string, number> } | null>(null);
  const [open, setOpen] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!user?.uid) { setProgress({ lessonBestPercent: {}, moduleTestBestPercent: {} }); setReadiness({ overall: 0, bySkill: {} }); return; }
    fetchProgress(user.uid).then(setProgress);
    fetchSkillScoresHistory(user.uid).then((attempts) => {
      // Average every attempt's per-skill score across the learner's whole
      // history (quiz-only term of the readiness score; see lib/startups/scoring).
      const sums: Record<string, { total: number; count: number }> = {};
      for (const a of attempts) {
        for (const [tag, score] of Object.entries(a.skillScores)) {
          sums[tag] ??= { total: 0, count: 0 };
          sums[tag].total += score; sums[tag].count += 1;
        }
      }
      const quizAverages = Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, Math.round(v.total / v.count)]));
      setReadiness(readinessScore(quizAverages));
    });
  }, [user?.uid]);

  const p = progress ?? { lessonBestPercent: {}, moduleTestBestPercent: {} };
  const lessons = track.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
  const doneCount = lessons.filter(({ m, l }) => lessonStatus(track, m.slug, l.slug, p) === "COMPLETED").length;
  const minutes = lessons.reduce((s, x) => s + x.l.durationMin, 0);
  const percent = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const next = nextUnfinishedLesson(track, p);
  const nextModule = next ? track.modules.find((m) => m.slug === next.moduleSlug) : null;
  const nextLesson = nextModule?.lessons.find((l) => l.slug === next?.lessonSlug);
  const nextHref = nextLesson && nextModule ? `/account/startups/${track.slug}/${nextModule.slug}/${nextLesson.slug}` : null;
  const started = Object.keys(p.lessonBestPercent).length > 0;
  const expanded = open ?? new Set(nextModule ? [nextModule.slug] : track.modules.slice(0, 1).map((m) => m.slug));

  const search = useMemo<SearchItem[]>(() => [
    ...track.modules.map((m) => ({ label: m.title, kind: "Module", hint: `Module ${m.order} · ${m.lessons.length} lessons`, href: `/account/startups/${track.slug}/${m.slug}` })),
    ...track.modules.flatMap((m) => m.lessons.map((l) => ({ label: l.title, kind: "Lesson", hint: `Module ${m.order}: ${m.title}`, href: `/account/startups/${track.slug}/${m.slug}/${l.slug}` }))),
    ...MORE.map((x) => ({ label: x.title, kind: "Tool", hint: x.note, href: x.href })),
  ], [track]);

  const toggle = (slug: string) => {
    const n = new Set(expanded);
    if (n.has(slug)) n.delete(slug); else n.add(slug);
    setOpen(n);
  };

  return (
    <div className="fp" style={{ ["--accent" as string]: meta.accent }}>
      <FeatureHero
        meta={meta}
        search={search}
        placeholder={`Search ${track.modules.length} modules and ${lessons.length} lessons`}
        popular={track.modules.slice(0, 3).map((m) => ({ label: m.title, href: `/account/startups/${track.slug}/${m.slug}` }))}
        primary={nextHref ? { label: started ? "Continue learning" : "Start lesson 1", href: nextHref } : undefined}
        secondary={{ label: "Take the placement quiz", href: "/account/startups/placement" }}
        stats={[
          { value: track.modules.length, label: "modules" },
          { value: lessons.length, label: "video lessons" },
          { value: `${Math.round(minutes / 60 * 10) / 10} h`, label: "of learning" },
          { value: `${percent}%`, label: progress ? `done - ${doneCount} of ${lessons.length} lessons` : "loading your progress" },
        ]}
      />

      <div className="fp-two fp-sec">
        <div style={{ minWidth: 0 }}>
          <div className="fp-card" style={{ marginBottom: 28 }}>
            <div style={{ padding: "16px 20px 0" }}><h2 style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>What you&apos;ll build</h2></div>
            <ul className="fp-learn">
              {track.modules.slice(0, 8).map((m) => <li key={m.slug}><Icon name="check" size={16} stroke={2.4} /><span>{m.missionText}</span></li>)}
            </ul>
          </div>

          <div className="fp-sec-h"><div><h2>Course content</h2><p>{track.title} track · {track.modules.length} modules · {lessons.length} lessons · {Math.round(minutes)} min</p></div>
            <button className="fp-link" style={{ fontSize: 13 }} onClick={() => setOpen(expanded.size === track.modules.length ? new Set() : new Set(track.modules.map((m) => m.slug)))}>
              {expanded.size === track.modules.length ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <div className="fp-curr">
            {track.modules.map((m) => {
              const st = moduleStatus(m, p);
              const isOpen = expanded.has(m.slug);
              const done = m.lessons.filter((l) => lessonStatus(track, m.slug, l.slug, p) === "COMPLETED").length;
              const mins = m.lessons.reduce((s, l) => s + l.durationMin, 0);
              const testOpen = moduleTestUnlocked(m, p);
              return (
                <div key={m.slug} className="fp-mod">
                  <button className="fp-mod-h" aria-expanded={isOpen} onClick={() => toggle(m.slug)}>
                    <Chevron />
                    <span style={{ minWidth: 0 }}><b>{m.order}. {m.title}</b><small>Mission: {m.missionText}</small></span>
                    <small style={{ whiteSpace: "nowrap" }}>{st === "COMPLETED" ? "Done" : `${done}/${m.lessons.length}`} · {mins} min</small>
                  </button>
                  {isOpen && (
                    <>
                      {m.lessons.map((l) => {
                        const s = lessonStatus(track, m.slug, l.slug, p);
                        const href = `/account/startups/${track.slug}/${m.slug}/${l.slug}`;
                        const tick = <span className={`fp-tick${s === "COMPLETED" ? " is-done" : s === "LOCKED" ? " is-locked" : ""}`}>{s === "COMPLETED" ? "✓" : ""}</span>;
                        return s === "LOCKED" ? (
                          <div key={l.slug} className="fp-les" style={{ cursor: "default", color: "var(--mute)" }} title="Pass the previous lesson's quiz to unlock">
                            {tick}<span>{l.title}</span><small><Icon name="lock" size={13} /> {l.durationMin} min</small>
                          </div>
                        ) : (
                          <Link key={l.slug} href={href} className="fp-les">{tick}<span>{l.title}</span><small>{l.durationMin} min</small></Link>
                        );
                      })}
                      {testOpen ? (
                        <Link href={`/account/startups/${track.slug}/${m.slug}/test`} className="fp-les"><span className={`fp-tick${st === "COMPLETED" ? " is-done" : ""}`}>{st === "COMPLETED" ? "✓" : ""}</span><span><b style={{ fontWeight: 600 }}>Module test</b></span><small>Pass mark {m.passMark}%</small></Link>
                      ) : (
                        <div className="fp-les" style={{ cursor: "default", color: "var(--mute)" }}><span className="fp-tick is-locked" /><span>Module test</span><small><Icon name="lock" size={13} /> after the lessons</small></div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="fp-side">
          <div className="fp-card" style={{ padding: 20 }}>
            <span className="fp-kicker">Your progress</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "6px 0 10px" }}>
              <b className="fp-display" style={{ fontSize: 34, fontWeight: 700 }}>{percent}%</b>
              <span className="fp-muted">{doneCount} of {lessons.length} lessons</span>
            </div>
            <div className="fp-bar"><i style={{ width: `${percent}%` }} /></div>
            {nextHref && nextLesson ? (
              <Link href={nextHref} className="fp-btn fp-btn-pri" style={{ width: "100%", marginTop: 16 }}>{started ? "Continue" : "Start"}: {nextLesson.title.length > 24 ? `${nextLesson.title.slice(0, 23)}…` : nextLesson.title}</Link>
            ) : progress && <p style={{ margin: "14px 0 0", fontSize: 14, fontWeight: 600, color: "var(--ok)" }}>Every module complete.</p>}
            <Link href="/account/progress" className="fp-link" style={{ fontSize: 13, marginTop: 12 }}>See all my progress <Icon name="arrowRight" size={14} stroke={2} /></Link>
          </div>

          {readiness && readiness.overall > 0 && (
            <div className="fp-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="fp-kicker">Startup readiness</span>
                <b className="fp-display" style={{ fontSize: 22 }}>{readiness.overall}</b>
              </div>
              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                {Object.entries(readiness.bySkill).map(([skill, score]) => (
                  <div key={skill} style={{ display: "grid", gridTemplateColumns: "96px minmax(0,1fr) 28px", gap: 10, alignItems: "center", fontSize: 13 }}>
                    <span style={{ textTransform: "capitalize", color: "var(--ink2)" }}>{skill.replace("-", " ")}</span>
                    <span className="fp-bar"><i style={{ width: `${score}%` }} /></span>
                    <span style={{ textAlign: "right", color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="fp-card" style={{ padding: 20 }}>
            <span className="fp-kicker">This course includes</span>
            <ul className="fp-includes" style={{ marginTop: 12 }}>
              <li><Icon name="video" size={17} /> {lessons.length} video lessons, {Math.round(minutes)} min</li>
              <li><Icon name="exam" size={17} /> A quiz after every lesson, a test per module</li>
              <li><Icon name="flag" size={17} /> {track.modules.length} missions on your own idea</li>
              <li><Icon name="doc" size={17} /> A Startup Portfolio you build as you go</li>
            </ul>
            <div style={{ display: "grid", gap: 6, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
              {MORE.map((x) => (
                <Link key={x.href} href={x.href} className="fp-link" style={{ justifyContent: "space-between", fontWeight: 500 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Icon name={x.icon} size={16} /> {x.title}</span>
                  <Icon name="arrowRight" size={14} stroke={2} />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
