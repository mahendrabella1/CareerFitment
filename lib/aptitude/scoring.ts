/**
 * Aptitude Lab - the student's progress and what it adds up to. Pure, so the
 * browser, the dashboard tile and the tests all agree.
 *
 * - Each topic keeps its answer count, right answers, time and the last 30
 *   results, and its own level (1-3): a set of 8+ at 80% or more moves it up,
 *   40% or less moves it down, always within the track's range.
 * - A section's score = 80% accuracy over its recent answers + 20% speed
 *   against each topic's target time. The Aptitude Score is the mean of the
 *   sections with at least MIN_ANSWERS answers. It's a practice score - a
 *   guide to where you are, not a prediction of an exam result.
 */
import { SECTIONS, type Level, type Section } from "./core";
import { topicInfo, type AptTrack, type TrackTopic } from "./tracks";

export interface TopicStat {
  n: number;
  c: number;
  /** Total seconds spent. */
  sec: number;
  level: Level;
  /** The last 30 results, oldest first: "1" right, "0" wrong. */
  recent: string;
  at: number;
}

export interface MockResult {
  /** "1".."3" for the fixed mocks, "random-<seed>" for a surprise one. */
  key: string;
  at: number;
  c: number;
  n: number;
  sec: number;
  by: Partial<Record<Section, { c: number; n: number }>>;
  track: string;
}

export interface AptitudeState {
  topics: Record<string, TopicStat>;
  mocks: MockResult[];
  /** Day keys with any practice (lib/progress/activity.ts dayKey). */
  days: string[];
  /** Day key -> today's ten score (0-10), first attempt only. */
  daily: Record<string, number>;
  /** A track the student picked instead of their class's own. */
  track?: string;
}

export const EMPTY_APT: AptitudeState = { topics: {}, mocks: [], days: [], daily: {} };
export const MIN_ANSWERS = 10;
const RECENT = 30;

export interface Answer { topic: string; ok: boolean; sec: number }

/** A topic's stat after a set of answers, with its level moved up or down by the set's accuracy. */
export function updateTopic(prev: TopicStat | undefined, answers: { ok: boolean; sec: number }[], range: TrackTopic, adapt = true): TopicStat {
  const base: TopicStat = prev ?? { n: 0, c: 0, sec: 0, level: range.min, recent: "", at: 0 };
  const right = answers.filter((a) => a.ok).length;
  let level = Math.min(range.max, Math.max(range.min, base.level)) as Level;
  if (adapt && answers.length >= 8) {
    const acc = right / answers.length;
    if (acc >= 0.8 && level < range.max) level = (level + 1) as Level;
    else if (acc <= 0.4 && level > range.min) level = (level - 1) as Level;
  }
  return {
    n: base.n + answers.length,
    c: base.c + right,
    sec: base.sec + Math.round(answers.reduce((s, a) => s + Math.min(a.sec, 600), 0)),
    level,
    recent: (base.recent + answers.map((a) => (a.ok ? "1" : "0")).join("")).slice(-RECENT),
    at: Date.now(),
  };
}

/** Where the student stands on a topic. */
export function mastery(s?: TopicStat): { label: "New" | "Learning" | "Good" | "Strong"; pct: number | null } {
  if (!s || !s.n) return { label: "New", pct: null };
  const pct = Math.round((100 * [...s.recent].filter((x) => x === "1").length) / Math.max(1, s.recent.length));
  return { label: pct >= 85 && s.n >= 20 ? "Strong" : pct >= 60 ? "Good" : "Learning", pct };
}

export interface SectionScore { section: Section; answered: number; accuracy: number | null; speed: number | null; score: number | null }

/** Accuracy, speed and score per section, over the track's topics. */
export function sectionScores(state: AptitudeState, track: AptTrack): SectionScore[] {
  return SECTIONS.map((section) => {
    const stats = track.topics.map((t) => ({ t: topicInfo(t.id)!, s: state.topics[t.id] })).filter((x) => x.t.section === section && x.s?.n);
    const answered = stats.reduce((n, x) => n + x.s!.n, 0);
    if (!stats.length || !track.topics.some((t) => topicInfo(t.id)!.section === section)) return { section, answered, accuracy: null, speed: null, score: null };
    const recent = stats.flatMap((x) => [...x.s!.recent]);
    const accuracy = Math.round((100 * recent.filter((x) => x === "1").length) / Math.max(1, recent.length));
    // Speed: each topic's target ÷ its average time (capped at 1), weighted by answers.
    const speed = Math.round((100 * stats.reduce((sum, x) => sum + Math.min(1, x.t.targetSec / Math.max(1, x.s!.sec / x.s!.n)) * x.s!.n, 0)) / answered);
    return { section, answered, accuracy, speed, score: answered >= MIN_ANSWERS ? Math.round(0.8 * accuracy + 0.2 * speed) : null };
  });
}

/** The Aptitude Score (0-100) - the mean of the sections with enough answers. */
export function aptitudeScore(state: AptitudeState, track: AptTrack): { score: number | null; measured: Section[] } {
  const scored = sectionScores(state, track).filter((s) => s.score !== null);
  return { score: scored.length ? Math.round(scored.reduce((n, s) => n + s.score!, 0) / scored.length) : null, measured: scored.map((s) => s.section) };
}

export function scoreBand(score: number): string {
  return score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 55 ? "Good" : score >= 40 ? "Developing" : "Beginner";
}

/** The level to practise a track topic at: the student's own, kept within the track's range. */
export const levelFor = (state: AptitudeState, t: TrackTopic): Level => Math.min(t.max, Math.max(t.min, state.topics[t.id]?.level ?? t.min)) as Level;

/** Topics to work on next: practised but weakest first, then not yet tried. */
export function focusTopics(state: AptitudeState, track: AptTrack, n = 3): TrackTopic[] {
  const tried = track.topics.filter((t) => state.topics[t.id]?.n).sort((a, b) => (mastery(state.topics[a.id]).pct ?? 0) - (mastery(state.topics[b.id]).pct ?? 0));
  const weak = tried.filter((t) => (mastery(state.topics[t.id]).pct ?? 0) < 70);
  return [...weak, ...track.topics.filter((t) => !state.topics[t.id]?.n)].slice(0, n);
}

export const totalAnswered = (state: AptitudeState) => Object.values(state.topics).reduce((n, s) => n + (s?.n ?? 0), 0);
