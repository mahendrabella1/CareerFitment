/**
 * Communication Lab rules (spec §3, §6, §9) as pure functions - shared by the
 * pages, the dashboard tile and the server's speech analysis; tested in
 * tests/commLab. No content imports, so it is light enough for any bundle.
 */
import { SKILLS, type CommLabState, type LessonProgress, type Module, type Skill, type SkillEntry, type VoiceMetrics } from "./types";

/** The track a student is assigned from their class (spec §2): T1 6-8, T2 9-10, T3 11-12, T4 college. */
export function trackIdFor(category?: string | null): "t1" | "t2" | "t3" | "t4" {
  switch (category) {
    case "class_6": case "class_7": case "class_8": return "t1";
    case "class_9_10": return "t2";
    case "class_11": case "class_12": case "class_11_12": return "t3";
    default: return "t4";
  }
}

// ------------------------------------------------------------------ CQ

export const CQ_WEIGHTS: Record<Skill, number> = { speaking: 0.35, writing: 0.25, listening: 0.2, reading: 0.2 };
export const SKILL_LABEL: Record<Skill, string> = { speaking: "Speaking", writing: "Writing", listening: "Listening", reading: "Reading" };

/** A skill's score: 70% the latest attempt, 30% the best of the last 3 - so one bad day doesn't collapse it. */
export function skillScore(entries?: SkillEntry[]): number | null {
  if (!entries?.length) return null;
  const sorted = [...entries].sort((a, b) => a.at - b.at);
  const latest = sorted[sorted.length - 1].score;
  const best3 = Math.max(...sorted.slice(-3).map((e) => e.score));
  return Math.round(0.7 * latest + 0.3 * best3);
}

/**
 * CQ = 0.35 Speaking + 0.25 Writing + 0.20 Listening + 0.20 Reading, from the
 * student's assigned track only (spec §2). Until all four skills have a
 * score, the weights of the measured ones are scaled up to 1, and `measured`
 * says which skills it rests on.
 */
export function cqOf(skills: CommLabState["skills"], trackId: string, until = Infinity): { cq: number | null; measured: Skill[]; bySkill: Partial<Record<Skill, number>> } {
  const bySkill: Partial<Record<Skill, number>> = {};
  for (const s of SKILLS) {
    const score = skillScore((skills[s] ?? []).filter((e) => e.t === trackId && e.at <= until));
    if (score !== null) bySkill[s] = score;
  }
  const measured = SKILLS.filter((s) => bySkill[s] !== undefined);
  if (!measured.length) return { cq: null, measured, bySkill };
  const w = measured.reduce((n, s) => n + CQ_WEIGHTS[s], 0);
  const cq = measured.reduce((n, s) => n + CQ_WEIGHTS[s] * bySkill[s]!, 0) / w;
  return { cq: Math.round(cq), measured, bySkill };
}

export function bandOf(cq: number): string {
  return cq >= 90 ? "Expert" : cq >= 75 ? "Advanced" : cq >= 60 ? "Proficient" : cq >= 40 ? "Developing" : "Beginner";
}

/** CQ at the end of each of the last `weeks` weeks (oldest first; null before any score). */
export function cqTrend(skills: CommLabState["skills"], trackId: string, weeks = 8, now = Date.now()): (number | null)[] {
  const WEEK = 7 * 86_400_000;
  return Array.from({ length: weeks }, (_, i) => cqOf(skills, trackId, now - (weeks - 1 - i) * WEEK).cq);
}

// ------------------------------------------------------------------ XP, levels, streaks

export const XP_PER_LEVEL = 500;
export const MODULE_XP = 100;
export const levelOf = (xp: number) => ({ level: Math.floor(xp / XP_PER_LEVEL) + 1, into: xp % XP_PER_LEVEL });

const keyToUtc = (k: string) => Date.UTC(Number(k.slice(1, 5)), Number(k.slice(5, 7)) - 1, Number(k.slice(7, 9)));

/**
 * Streak: days in a row with at least one lesson or practice, up to today
 * (or yesterday, until today is done). Every 7 days in a row earns a freeze,
 * which covers one missed day.
 */
export function streakOf(days: string[], todayKey: string): { current: number; longest: number } {
  const DAY = 86_400_000;
  const ts = [...new Set(days)].map(keyToUtc).sort((a, b) => a - b);
  if (!ts.length) return { current: 0, longest: 0 };
  // Active days in the run (a frozen day keeps the run but doesn't add to it).
  let run = 0, longest = 0, freezes = 0, sinceFreeze = 0;
  for (let i = 0; i < ts.length; i++) {
    const gap = i === 0 ? 1 : Math.round((ts[i] - ts[i - 1]) / DAY);
    if (gap === 1) run++;
    else if (gap === 2 && freezes > 0) { freezes--; run++; }
    else { run = 1; freezes = 0; sinceFreeze = 0; }
    if (++sinceFreeze === 7) { freezes = Math.min(freezes + 1, 2); sinceFreeze = 0; }
    longest = Math.max(longest, run);
  }
  const sinceLast = Math.round((keyToUtc(todayKey) - ts[ts.length - 1]) / DAY);
  const current = sinceLast <= 1 || (sinceLast === 2 && freezes > 0) ? run : 0;
  return { current, longest };
}

// ------------------------------------------------------------------ unlock rules (spec §3)

export const PASS_PERCENT = 60;

export function moduleStatus(m: Module, lessons: Record<string, LessonProgress>) {
  const done = m.lessons.filter((l) => lessons[l.id]?.s === "completed").length;
  const total = m.lessons.length;
  const assessment = m.lessons.find((l) => l.type === "quiz" && l.assessment);
  const assessmentTried = !assessment || (lessons[assessment.id]?.attempts ?? 0) > 0;
  const voice = m.lessons.find((l) => l.type === "voice");
  const voiceTried = !voice || lessons[voice.id]?.s === "completed";
  const pct = total ? Math.round((done / total) * 100) : 0;
  return {
    done, total, pct, assessmentTried,
    /** Opens the next module: 80%+ of lessons done and the module assessment attempted. */
    passed: pct >= 80 && assessmentTried,
    /** Earns the module badge (and its XP): passed, with the voice lesson submitted. */
    badge: pct >= 80 && assessmentTried && voiceTried,
    complete: done === total,
  };
}

/** Lessons open one after another within a module. */
export const lessonUnlocked = (m: Module, index: number, lessons: Record<string, LessonProgress>) =>
  index === 0 || lessons[m.lessons[index - 1].id]?.s === "completed";

export const moduleUnlocked = (modules: Module[], index: number, lessons: Record<string, LessonProgress>) =>
  index === 0 || moduleStatus(modules[index - 1], lessons).passed;

// ------------------------------------------------------------------ speech metrics (spec §6)

export interface TimedWord { word: string; start: number; end: number }

/** Spoken fillers. "like" and "you know" count only when set off by commas
 *  ("it was, like, huge") - otherwise "I like painting" would count. */
export function countFillers(transcript: string): Record<string, number> {
  const t = ` ${transcript.toLowerCase().replace(/[“”"]/g, "")} `;
  const count = (re: RegExp) => (t.match(re) ?? []).length;
  const out: Record<string, number> = {
    um: count(/\b(um+|umm+|hmm+)\b/g),
    uh: count(/\b(uh+|er+m?|ah+)\b/g),
    like: count(/,\s*like\s*,|(^|[.!?]\s+)like\s*,/g),
    "you know": count(/,?\s*you know\s*[,.?!]/g),
    basically: count(/\bbasically\b/g),
  };
  for (const k of Object.keys(out)) if (!out[k]) delete out[k];
  return out;
}

/** WPM, fillers, long pauses (> 1.5 s between words) and clarity (speech-to-text confidence, approximate). */
export function speechMetrics(input: { transcript: string; words: TimedWord[]; durationSec: number; segmentLogprobs: number[] }): VoiceMetrics {
  const { transcript, words, durationSec } = input;
  const fillerWords = countFillers(transcript);
  const fillerCount = Object.values(fillerWords).reduce((a, b) => a + b, 0);
  const speakingSec = words.length > 1 ? Math.max(1, words[words.length - 1].end - words[0].start) : Math.max(1, durationSec);
  const wordCount = words.length || transcript.split(/\s+/).filter(Boolean).length;
  let longPauses = 0;
  for (let i = 1; i < words.length; i++) if (words[i].start - words[i - 1].end > 1.5) longPauses++;
  const probs = input.segmentLogprobs.filter((x) => Number.isFinite(x)).map((x) => Math.exp(x));
  const clarity = probs.length ? Math.round((probs.reduce((a, b) => a + b, 0) / probs.length) * 100) : 85;
  return {
    durationSec: Math.round(durationSec * 10) / 10,
    wpm: Math.round(wordCount / (speakingSec / 60)),
    fillerCount,
    fillersPerMin: Math.round((fillerCount / Math.max(speakingSec / 60, 0.25)) * 10) / 10,
    fillerWords,
    longPauses,
    clarity: Math.min(100, Math.max(0, clarity)),
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Fluency, out of 20, from the measured numbers: pace (8), fillers (7), pauses (5). */
export function fluencyScore(m: VoiceMetrics): number {
  const dist = m.wpm < 110 ? 110 - m.wpm : m.wpm > 150 ? m.wpm - 150 : 0;
  const pace = clamp(8 - dist / 6, 0, 8);
  const fillers = m.fillersPerMin <= 2 ? 7 : m.fillersPerMin <= 3 ? 6 : clamp(6 - (m.fillersPerMin - 3) * 1.5, 0, 6);
  const perMin = m.longPauses / Math.max(m.durationSec / 60, 0.25);
  const pauses = perMin <= 1 ? 5 : clamp(5 - (perMin - 1) * 1.5, 0, 5);
  return Math.round(pace + fillers + pauses);
}

/** Pronunciation and clarity, out of 15 - estimated from how surely the speech-to-text understood the words. */
export const pronunciationScore = (clarity: number) => Math.round(clamp(5 + ((clarity - 60) / 30) * 10, 0, 15));

/** Within ±20% of the target length (spec §6). */
export const durationOk = (sec: number, target: number) => sec >= target * 0.8 && sec <= target * 1.2;

export const levelLabel = (total: number) =>
  total >= 85 ? "Excellent" : total >= 70 ? "Great" : total >= 55 ? "Good" : total >= 40 ? "Getting there" : "Keep practising";

// ------------------------------------------------------------------ badges (spec §9)

export interface BadgeDef { id: string; title: string; how: string }
export const BADGES: BadgeDef[] = [
  { id: "first-voice", title: "First Voice", how: "Submit your first voice practice." },
  { id: "streak-7", title: "7-Day Streak", how: "Practise 7 days in a row." },
  { id: "fluency-star", title: "Fluency Star", how: "Speak at 110-150 words a minute with fewer than 3 fillers a minute." },
  { id: "wordsmith", title: "Wordsmith", how: "Score 80 or more on a writing task." },
  { id: "module-master", title: "Module Master", how: "Finish every lesson in a module." },
  { id: "debate-champ", title: "Debate Champ", how: "Comes with the Debate and Elocution module." },
];

/** The general badges a state has earned (module badges are awarded with the module). */
export function earnedBadges(state: CommLabState, modules: Module[], todayKey: string): string[] {
  const out: string[] = [];
  const attempts = Object.values(state.voice).flat();
  if (attempts.length) out.push("first-voice");
  if (streakOf(state.days, todayKey).current >= 7) out.push("streak-7");
  if (attempts.some((a) => !a.unscored && a.metrics.wpm >= 110 && a.metrics.wpm <= 150 && a.metrics.fillersPerMin < 3 && a.metrics.durationSec >= 20)) out.push("fluency-star");
  if (Object.values(state.tasks).some((t) => (t.report?.score ?? 0) >= 80)) out.push("wordsmith");
  if (modules.some((m) => moduleStatus(m, state.lessons).complete)) out.push("module-master");
  return out;
}
