"use client";
/**
 * My Progress - everything a student has done in every feature: lessons
 * finished AND tools used (each calculator, tracker, finder and catalogue
 * they've opened - lib/progress/featureTasks.ts), so time spent in a feature
 * shows up as progress too. Overall completion, the top three features, each
 * feature's modules and tools (done / still to do) with a "continue" link, an
 * activity calendar with the current streak, and time spent per area. Reads
 * only the student's own data: progress.courses.* and progress.visited.*
 * (lib/progress/progressStore.ts, components/ActivityTracker.tsx), the
 * Startups progress collections (lib/startups/clientProgress.ts),
 * progress.legal, the Scam Shield tally on this device and users/{uid}.activity.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { readCourseDone } from "@/lib/progress/progressStore";
import { AREA_LABEL, dayKey, dayLabel, lastDays } from "@/lib/progress/activity";
import { loadScamTally } from "@/lib/money/localProgress";
import { fetchProgress } from "@/lib/startups/clientProgress";
import { lessonStatus, moduleStatus, type ProgressMap } from "@/lib/startups/unlock";
import type { PublicTrack } from "@/lib/startups/publicShape";
import { bandOf, cqOf, trackIdFor } from "@/lib/commLab/scoring";
import { FEATURES, featureArt } from "@/lib/features/catalog";
import { tasksDone, type FeatureTaskSpec } from "@/lib/progress/featureTasks";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { FeatureHero } from "@/components/feature/FeatureHero";

export interface CourseOutline {
  key: string;
  modules: { id: string; title: string; lessons: { id: string; title: string; minutes: number }[] }[];
}

interface ModRow { title: string; done: number; total: number; lessons: { title: string; done: boolean }[] }
interface ToolRow { label: string; href: string; done: boolean; note?: string }
interface Row {
  key: string; title: string; href: string;
  modules: ModRow[]; tools: ToolRow[];
  lessonsDone: number; lessonsTotal: number; toolsDone: number;
  /** Lessons + tools. */
  done: number; total: number; percent: number;
  next?: { title: string; href: string };
  seconds: number; lastAt?: number; note?: string;
}

const ACTIVITY_KEY: Record<string, string> = { money: "money", legal: "legal", exams: "exams", scholarships: "scholarships", "study-abroad": "study_abroad", research: "research", startups: "startups", careers: "careers", internships: "internships", ai: "ai", communication: "communication" };
const ONLY_TIME = ["jobs", "gps", "test_drive", "decision", "passport", "portfolio"];

/** A feature's tools from its task list, with what's been opened. */
function toolsFor(spec: FeatureTaskSpec | undefined, visited: string[] | undefined): ToolRow[] {
  if (!spec) return [];
  const { done, explored } = tasksDone(spec, visited);
  return spec.tasks.map((t) => {
    const n = explored[t.id] ?? 0;
    const note = t.kind === "any" ? (t.count ? `${n} of ${t.count} opened` : n ? `${n} opened` : undefined) : undefined;
    return { label: t.label, href: t.href, done: done.has(t.id), note };
  });
}
const HEAT = ["#ece9e3", "#cfe5d2", "#93c79d", "#4f9c5f", "#256b36"];
const WEEKS = 16;
type Filter = "all" | "progress" | "todo" | "done";

const MP_CSS = `
.mp-top{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:6px;padding:18px}
.mp-top img{height:84px;width:auto;max-width:150px;object-fit:contain;align-self:flex-end;margin:-6px 0 -4px}
.mp-top b{font-size:15px;font-weight:600}
.mp-rank{position:absolute;top:14px;left:16px;width:28px;height:28px;border-radius:6px;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:14px}
.mp-feat{border-top:1px solid var(--line)}
.mp-feat:first-child{border-top:0}
.mp-head{display:grid;grid-template-columns:64px minmax(0,1fr) 64px;gap:14px;align-items:center;width:100%;padding:14px 16px;border:0;background:#fff;font:inherit;text-align:left;cursor:pointer;color:var(--ink)}
.mp-head:hover{background:#fcfbf9}
.mp-head img{width:64px;height:48px;object-fit:contain}
.mp-head b{display:block;font-size:15px;font-weight:600}
.mp-head small{display:block;font-size:12.5px;color:var(--mute);margin-top:2px}
.mp-pct{font-family:Poppins,Inter,sans-serif;font-size:20px;font-weight:700;text-align:right}
.mp-segs{display:flex;gap:3px;margin-top:8px}
.mp-segs i{flex:1;height:6px;border-radius:2px;background:#ece9e3;overflow:hidden;display:block}
.mp-segs b{display:block;height:100%;background:var(--ink)}
.mp-body{padding:4px 16px 18px 94px;background:#fff}
.mp-mod{padding:10px 0;border-top:1px solid #f0ede8}
.mp-mod-h{display:flex;justify-content:space-between;gap:10px;font-size:14px}
.mp-mod-h b{font-weight:600}
.mp-lessons{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.mp-lessons span{font-size:12.5px;padding:4px 9px;border-radius:5px;border:1px dashed #cfcac0;color:var(--ink2)}
.mp-lessons span.is-done{border:1px solid #bfe0c6;background:#eef7f0;color:#14532d}
.mp-lessons .mp-todo{font-size:12.5px;padding:4px 9px;border-radius:5px;border:1px solid var(--line);background:#fff;color:var(--ink);text-decoration:none}
.mp-lessons .mp-todo:hover{border-color:var(--ink)}
.mp-segs i.is-tools{flex:2}
.mp-segs i.is-tools b{background:var(--accent,#16181d)}
.mp-heat{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,12px);grid-auto-columns:12px;gap:3px;margin-top:12px;overflow-x:auto}
.mp-heat i{width:12px;height:12px;border-radius:2px;display:block}
@media (max-width:1100px){.mp-body{padding-left:16px}}
@media (max-width:560px){.mp-head{grid-template-columns:48px minmax(0,1fr) 48px;gap:10px;padding:12px}.mp-head img{width:48px;height:36px}.mp-pct{font-size:17px}}
`;

/** "3 of 16 lessons · 5 of 21 tools used" (just the part that applies). */
const summaryOf = (r: Row) => [
  r.lessonsTotal ? `${r.lessonsDone} of ${r.lessonsTotal} lessons` : "",
  r.tools.length ? `${r.toolsDone} of ${r.tools.length} tools used` : "",
].filter(Boolean).join(" · ");

const mins = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min` : `${Math.max(0, Math.round(s / 60))} min`);
const ago = (t?: number) => {
  if (!t) return "";
  const d = Math.floor((Date.now() - t) / 86400000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : d < 30 ? `${d} days ago` : new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/** A Communication Lab track's outline (titles only), from the server page. */
export interface LabOutline { id: string; modules: { id: string; title: string; lessons: { id: string; title: string }[] }[] }

export function MyProgress({ courses, track, tasks, labTracks = [] }: { courses: CourseOutline[]; track: PublicTrack; tasks: FeatureTaskSpec[]; labTracks?: LabOutline[] }) {
  const { user, profile } = useAuth();
  const meta = FEATURES.progress;
  const [startups, setStartups] = useState<ProgressMap | null>(null);
  const [scam, setScam] = useState<{ correct: number; total: number } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    setScam(loadScamTally());
    if (!user?.uid) { setStartups({ lessonBestPercent: {}, moduleTestBestPercent: {} }); return; }
    fetchProgress(user.uid).then(setStartups).catch(() => setStartups({ lessonBestPercent: {}, moduleTestBestPercent: {} }));
  }, [user?.uid]);

  const activity = profile?.activity;
  const byFeature = activity?.byFeature ?? {};
  const lastBy = activity?.lastByFeature ?? {};

  const visited = profile?.progress?.visited;
  const rows = useMemo<Row[]>(() => {
    const row = (key: string, modules: ModRow[], nextLesson: Row["next"], note?: string): Row => {
      const f = FEATURES[key];
      const spec = tasks.find((t) => t.key === key);
      const tools = toolsFor(spec, spec ? visited?.[spec.area] : undefined);
      const lessonsTotal = modules.reduce((s, m) => s + m.total, 0);
      const lessonsDone = modules.reduce((s, m) => s + m.done, 0);
      const toolsDone = tools.filter((t) => t.done).length;
      const total = lessonsTotal + tools.length;
      const done = lessonsDone + toolsDone;
      const nextTool = tools.find((t) => !t.done);
      const act = ACTIVITY_KEY[key];
      return {
        key, title: f?.title ?? key, href: f?.href ?? "/account",
        modules, tools, lessonsDone, lessonsTotal, toolsDone, done, total,
        percent: total ? Math.round((done / total) * 100) : 0,
        next: nextLesson ?? (nextTool ? { title: nextTool.label, href: nextTool.href } : undefined),
        seconds: byFeature[act] ?? 0, lastAt: lastBy[act], note,
      };
    };
    const out: Row[] = courses.map((c) => {
      const f = FEATURES[c.key];
      const done = new Set(readCourseDone(c.key, profile?.progress?.courses?.[c.key]));
      const modules = c.modules.map((m) => {
        const lessons = m.lessons.map((l) => ({ title: l.title, done: done.has(l.id) }));
        return { title: m.title, lessons, done: lessons.filter((l) => l.done).length, total: lessons.length };
      });
      const nextLesson = c.modules.flatMap((m) => m.lessons).find((l) => !done.has(l.id));
      let note: string | undefined;
      if (c.key === "legal" && profile?.progress?.legal?.done) note = `${profile.progress.legal.done} "What would you do?" scenarios played`;
      if (c.key === "money" && scam?.total) note = `Scam Shield: ${Math.round((scam.correct / scam.total) * 100)}% right over ${scam.total} questions`;
      return row(c.key, modules, nextLesson ? { title: nextLesson.title, href: `${f?.href}?lesson=${encodeURIComponent(nextLesson.id)}` } : undefined, note);
    });
    // Features with tools but no lessons.
    for (const k of ["careers", "internships", "ai"]) if (tasks.some((t) => t.key === k)) out.push(row(k, [], undefined));
    // Startups: a lesson counts once its quiz is passed.
    const p = startups ?? { lessonBestPercent: {}, moduleTestBestPercent: {} };
    const sMods = track.modules.map((m) => {
      const lessons = m.lessons.map((l) => ({ title: l.title, done: lessonStatus(track, m.slug, l.slug, p) === "COMPLETED" }));
      return { title: m.title, lessons, done: lessons.filter((l) => l.done).length, total: lessons.length };
    });
    const sTotal = sMods.reduce((s, m) => s + m.total, 0);
    const sDone = sMods.reduce((s, m) => s + m.done, 0);
    const nextMod = track.modules.find((m) => moduleStatus(m, p) !== "COMPLETED");
    const nextL = nextMod?.lessons.find((l) => lessonStatus(track, nextMod.slug, l.slug, p) !== "COMPLETED");
    out.push({
      key: "startups", title: FEATURES.startups.title, href: FEATURES.startups.href, modules: sMods, tools: [],
      lessonsDone: sDone, lessonsTotal: sTotal, toolsDone: 0, done: sDone, total: sTotal,
      percent: sTotal ? Math.round((sDone / sTotal) * 100) : 0,
      next: nextMod && nextL ? { title: nextL.title, href: `/account/startups/${track.slug}/${nextMod.slug}/${nextL.slug}` } : undefined,
      seconds: byFeature.startups ?? 0, lastAt: lastBy.startups,
      note: `${track.modules.filter((m) => moduleStatus(m, p) === "COMPLETED").length} of ${track.modules.length} module tests passed`,
    });
    // Communication Lab: the student's own track (by class), when it has modules open.
    const lab = labTracks.find((t) => t.id === trackIdFor(profile?.category));
    if (lab?.modules.length) {
      const doneIds = profile?.commLab?.lessons ?? {};
      const lMods = lab.modules.map((m) => {
        const lessons = m.lessons.map((l) => ({ title: l.title, done: doneIds[l.id]?.s === "completed" }));
        return { title: m.title, lessons, done: lessons.filter((l) => l.done).length, total: lessons.length };
      });
      const nextMod = lab.modules.find((m) => m.lessons.some((l) => doneIds[l.id]?.s !== "completed"));
      const nextL = nextMod?.lessons.find((l) => doneIds[l.id]?.s !== "completed");
      const cq = cqOf(profile?.commLab?.skills ?? {}, lab.id).cq;
      out.push(row("communication", lMods, nextMod && nextL ? { title: nextL.title, href: `/account/communication/${lab.id}/${nextMod.id}/${nextL.id}` } : undefined,
        cq !== null ? `CQ ${cq} (${bandOf(cq)})` : undefined));
    }
    return out;
  }, [courses, track, tasks, visited, startups, profile, scam, byFeature, lastBy, labTracks]);

  const total = rows.reduce((s, r) => s + r.total, 0);
  const done = rows.reduce((s, r) => s + r.done, 0);
  const overall = total ? Math.round((done / total) * 100) : 0;
  const lessonsDone = rows.reduce((s, r) => s + r.lessonsDone, 0);
  const lessonsTotal = rows.reduce((s, r) => s + r.lessonsTotal, 0);
  const toolsDone = rows.reduce((s, r) => s + r.toolsDone, 0);
  const toolsTotal = rows.reduce((s, r) => s + r.tools.length, 0);
  const top = [...rows].filter((r) => r.done > 0).sort((a, b) => b.percent - a.percent || b.done - a.done).slice(0, 3);
  const resume = [...rows].filter((r) => r.next && r.done > 0).sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0))[0] ?? rows.find((r) => r.next);
  const shown = rows.filter((r) => filter === "all" || (filter === "done" ? r.percent === 100 : filter === "todo" ? r.done === 0 : r.done > 0 && r.percent < 100));

  // Activity calendar: WEEKS columns of Monday-to-Sunday, the last one this week.
  const byDay = activity?.byDay ?? {};
  const today = new Date();
  const daysLeftInWeek = 6 - ((today.getDay() + 6) % 7);
  const days = lastDays(WEEKS * 7 - daysLeftInWeek);
  const level = (s: number) => (s <= 0 ? 0 : s < 300 ? 1 : s < 900 ? 2 : s < 1800 ? 3 : 4);
  // Days in a row with at least a minute of learning; today not started yet doesn't break it.
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const s = byDay[dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i))] ?? 0;
    if (s >= 60) streak++;
    else if (i > 0) break;
  }
  const activeDays = days.filter((k) => (byDay[k] ?? 0) >= 60).length;
  const times = Object.entries(byFeature).filter(([k, s]) => s >= 60 && k !== "dashboard" && k !== "assessment").sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxTime = times[0]?.[1] ?? 1;
  const extraTime = ONLY_TIME.filter((k) => (byFeature[k] ?? 0) >= 60);

  return (
    <CoursePlayerShell accent={meta.accent} banner={{ title: meta.title, icon: "score", backHref: "/account", backLabel: "Dashboard" }}>
      <style dangerouslySetInnerHTML={{ __html: MP_CSS }} />
      <div className="fp" style={{ ["--accent" as string]: meta.accent }}>
        <FeatureHero
          meta={meta}
          primary={resume?.next ? { label: `Continue: ${resume.next.title.length > 30 ? `${resume.next.title.slice(0, 29)}…` : resume.next.title}`, href: resume.next.href } : undefined}
          secondary={{ label: "Back to dashboard", href: "/account" }}
          stats={[
            { value: `${overall}%`, label: "done across every feature" },
            { value: `${lessonsDone}/${lessonsTotal}`, label: "lessons finished" },
            { value: `${toolsDone}/${toolsTotal}`, label: "tools used" },
            { value: mins(activity?.totalSec ?? 0), label: "time spent learning" },
          ]}
        />

        <section className="fp-sec">
          <div className="fp-sec-h"><div><h2>Top completed</h2><p>Your three strongest features so far.</p></div></div>
          {top.length === 0 ? (
            <div className="fp-card" style={{ padding: 20 }}><p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }}>Finish a lesson or use a tool in any feature and it shows up here.</p></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
              {top.map((r, i) => (
                <Link key={r.key} href={r.href} className="fp-card mp-top" style={{ textDecoration: "none", color: "inherit" }}>
                  <span className="mp-rank">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featureArt(r.key).card} alt="" />
                  <b>{r.title}</b>
                  <span className="fp-display" style={{ fontSize: 26, fontWeight: 700 }}>{r.percent}%</span>
                  <span className="fp-bar" style={{ width: "100%" }}><i style={{ width: `${r.percent}%` }} /></span>
                  <small className="fp-muted">{summaryOf(r)}</small>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="fp-two fp-sec" style={{ gridTemplateColumns: "minmax(0,1fr) 360px" }}>
          <section style={{ minWidth: 0 }}>
            <div className="fp-sec-h">
              <div><h2>Every feature</h2><p>Tap a feature to see its modules - done and still to do.</p></div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} role="group" aria-label="Show">
                {([["all", "All"], ["progress", "In progress"], ["todo", "Not started"], ["done", "Completed"]] as [Filter, string][]).map(([k, l]) => (
                  <button key={k} className="fp-chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="fp-dir">
              {shown.map((r) => {
                const isOpen = openKey === r.key;
                return (
                  <div key={r.key} className="mp-feat">
                    <button className="mp-head" aria-expanded={isOpen} onClick={() => setOpenKey(isOpen ? null : r.key)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featureArt(r.key).thumb} alt="" />
                      <span style={{ minWidth: 0 }}>
                        <b>{r.title}</b>
                        <small>{summaryOf(r)}{r.seconds >= 60 ? ` · ${mins(r.seconds)}` : ""}{r.lastAt ? ` · last ${ago(r.lastAt)}` : ""}</small>
                        <span className="mp-segs" aria-hidden="true">
                          {r.modules.map((m, i) => <i key={i} title={`${m.title}: ${m.done}/${m.total}`}><b style={{ width: `${m.total ? (m.done / m.total) * 100 : 0}%` }} /></i>)}
                          {r.tools.length > 0 && <i className="is-tools" title={`Tools: ${r.toolsDone}/${r.tools.length}`}><b style={{ width: `${(r.toolsDone / r.tools.length) * 100}%` }} /></i>}
                        </span>
                      </span>
                      <span className="mp-pct">{r.percent}%</span>
                    </button>
                    {isOpen && (
                      <div className="mp-body">
                        {r.note && <p className="fp-muted" style={{ margin: "0 0 10px" }}>{r.note}</p>}
                        {r.modules.map((m) => (
                          <div key={m.title} className="mp-mod">
                            <div className="mp-mod-h">
                              <b>{m.title}</b>
                              <span className="fp-muted">{m.done === m.total ? "Done" : `${m.done}/${m.total}`}</span>
                            </div>
                            <div className="mp-lessons">
                              {m.lessons.map((l) => <span key={l.title} className={l.done ? "is-done" : ""}>{l.done ? "✓ " : ""}{l.title}</span>)}
                            </div>
                          </div>
                        ))}
                        {r.tools.length > 0 && (
                          <div className="mp-mod">
                            <div className="mp-mod-h">
                              <b>Tools and pages</b>
                              <span className="fp-muted">{r.toolsDone === r.tools.length ? "All used" : `${r.toolsDone}/${r.tools.length} used`}</span>
                            </div>
                            <div className="mp-lessons">
                              {r.tools.map((t) => t.done
                                ? <span key={t.href + t.label} className="is-done">✓ {t.label}{t.note ? ` · ${t.note}` : ""}</span>
                                : <Link key={t.href + t.label} href={t.href} className="mp-todo">{t.label} →</Link>)}
                            </div>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                          {r.next && <Link href={r.next.href} className="fp-btn fp-btn-pri fp-btn-sm">Continue: {r.next.title.length > 34 ? `${r.next.title.slice(0, 33)}…` : r.next.title}</Link>}
                          <Link href={r.href} className="fp-btn fp-btn-sm">Open {r.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {shown.length === 0 && <p className="fp-muted" style={{ padding: 16, margin: 0 }}>Nothing here yet.</p>}
            </div>
          </section>

          <aside className="fp-side">
            <div className="fp-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="fp-kicker">Activity</span>
                <span className="fp-muted">{activeDays} active days in {WEEKS} weeks{streak > 0 ? ` · ${streak}-day streak` : ""}</span>
              </div>
              <div className="mp-heat" role="img" aria-label={`${activeDays} active days in the last ${WEEKS} weeks; current streak ${streak} days`}>
                {days.map((k) => <i key={k} title={`${dayLabel(k)}: ${mins(byDay[k] ?? 0)}`} style={{ background: HEAT[level(byDay[k] ?? 0)] }} />)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 8 }} className="fp-muted">
                Less {HEAT.map((c) => <i key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />)} More
              </div>
            </div>

            <div className="fp-card" style={{ padding: 18 }}>
              <span className="fp-kicker">Time by feature</span>
              {times.length === 0 ? <p className="fp-muted" style={{ margin: "10px 0 0" }}>Time shows here once you start using a feature.</p> : (
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  {times.map(([k, s]) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 70px", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "var(--ink2)" }}>{AREA_LABEL[k] ?? k}
                        <span className="fp-bar" style={{ display: "block", marginTop: 4 }}><i style={{ width: `${(s / maxTime) * 100}%` }} /></span>
                      </span>
                      <span style={{ fontSize: 12.5, textAlign: "right", color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{mins(s)}</span>
                    </div>
                  ))}
                </div>
              )}
              {extraTime.length > 0 && <p className="fp-muted" style={{ margin: "12px 0 0" }}>Also explored: {extraTime.map((k) => AREA_LABEL[k]).join(", ")}.</p>}
            </div>
          </aside>
        </div>
      </div>
    </CoursePlayerShell>
  );
}
