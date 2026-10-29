/** Communication Lab - the shapes of its content and of a student's progress. */

export type Skill = "speaking" | "writing" | "listening" | "reading";
export const SKILLS: Skill[] = ["speaking", "writing", "listening", "reading"];

export type LessonType = "video" | "reading" | "quiz" | "activity" | "task" | "voice";

export interface Question { q: string; options: string[]; answer: number; why?: string }

export type PromptType = "self_intro" | "read_aloud" | "topic" | "retell" | "opinion" | "interview" | "roleplay";

export interface VoicePrompt {
  id: string;
  type: PromptType;
  /** What the student is asked to say. */
  text: string;
  /** A passage to read, for read-aloud prompts. */
  passage?: string;
  tips: string[];
  minSec: number;
  maxSec: number;
  /** The length to aim for (the duration metric is scored against it, ±20%). */
  targetSec: number;
  /** Read aloud by the browser as a model answer. */
  modelAnswer?: string;
}

interface LessonBase {
  id: string;
  title: string;
  minutes: number;
  xp: number;
  /** The skill this lesson's score counts towards. */
  skill: Skill;
}

export interface VideoLesson extends LessonBase {
  type: "video";
  youtubeId: string;
  durationSec: number;
  startSec?: number;
  channel: string;
  takeaways: string[];
  check: Question[];
  /** Spec §5 sourcing checklist: who checked the video and its questions. */
  reviewedBy: string;
}

export type ReadingBlock = string | { h: string } | { list: string[] } | { example: string };
export interface ReadingLesson extends LessonBase { type: "reading"; body: ReadingBlock[] }

export interface QuizLesson extends LessonBase {
  type: "quiz";
  questions: Question[];
  /** The module assessment (attempting it is needed to unlock the next module). */
  assessment?: boolean;
  /** An unscored question to think about after the quiz. */
  reflection?: string;
}

export type Activity =
  | { kind: "order"; prompt: string; items: string[] } // items in the right order
  | { kind: "match"; prompt: string; pairs: [string, string][] }
  | { kind: "choice"; prompt: string; scenarios: { situation: string; options: { text: string; best?: boolean; why: string }[] }[] }
  | { kind: "flashcards"; prompt: string; cards: { word: string; meaning: string; example: string }[] };
export interface ActivityLesson extends LessonBase { type: "activity"; activity: Activity }

export interface TaskLesson extends LessonBase {
  type: "task";
  instructions: string;
  minWords: number;
  maxWords: number;
  /** What the AI reviewer (and the student) checks. */
  rubric: string[];
}

export interface VoiceLesson extends LessonBase { type: "voice"; prompt: VoicePrompt }

export type Lesson = VideoLesson | ReadingLesson | QuizLesson | ActivityLesson | TaskLesson | VoiceLesson;

export interface Module {
  id: string;
  title: string;
  summary: string;
  outcomes: string[];
  minutes: number;
  badge: { id: string; title: string };
  lessons: Lesson[];
}

/** A module that is in the curriculum but not built yet (spec §20 rollout). */
export interface PlannedModule { title: string; lessons: string; voice: string }

export interface Track {
  id: "t1" | "t2" | "t3" | "t4";
  code: "T1" | "T2" | "T3" | "T4";
  title: string;
  level: string;
  focus: string;
  weeks: number;
  /** Built modules, then the rest of the curriculum as planned ones. */
  modules: Module[];
  planned: PlannedModule[];
  /** The daily challenge rotates through these. */
  daily: VoicePrompt[];
}

// ------------------------------------------------------------------ progress (users/{uid}.commLab)

export interface LessonProgress {
  s: "in_progress" | "completed";
  /** Video: % watched (furthest point reached naturally) and where to resume. */
  pct?: number;
  pos?: number;
  /** Latest and best score (0-100) and attempts, for scored lessons. */
  score?: number;
  best?: number;
  attempts?: number;
  sec?: number;
  at: number;
}

export interface SkillEntry { at: number; score: number; src: string; t: string }

export interface VoiceMetrics {
  durationSec: number;
  wpm: number;
  fillerCount: number;
  fillersPerMin: number;
  fillerWords: Record<string, number>;
  longPauses: number;
  clarity: number;
}

export interface VoiceScores { content: number; structure: number; fluency: number; pronunciation: number; grammar: number; tone: number }

export interface VoiceReport {
  promptId: string;
  transcript: string;
  metrics: VoiceMetrics;
  scores: VoiceScores;
  total: number;
  feedback: { strengths: string[]; improvements: string[]; nextTip: string };
  /** Too short or too quiet to score: the report says so instead of scoring. */
  unscored?: string;
}

export interface VoiceAttempt extends Omit<VoiceReport, "transcript"> { at: number; transcript: string }

export interface TaskReport {
  score: number;
  criteria: { name: string; score: number }[];
  strengths: string[];
  improvements: string[];
  nextTip: string;
}
export interface TaskSubmission { text: string; at: number; attempt: number; report?: TaskReport }

export interface CommLabState {
  lessons: Record<string, LessonProgress>;
  skills: Partial<Record<Skill, SkillEntry[]>>;
  voice: Record<string, VoiceAttempt[]>;
  tasks: Record<string, TaskSubmission>;
  xp: number;
  /** Day keys (lib/progress/activity.ts dayKey) with at least one lesson or practice. */
  days: string[];
  badges: Record<string, number>;
  /** Day key -> the daily challenge done that day. */
  daily: Record<string, string>;
  /** Voice practice consent: for under-18s, confirmed with a parent or guardian. */
  consent?: { at: number; minor: boolean };
}

export const EMPTY_STATE: CommLabState = { lessons: {}, skills: {}, voice: {}, tasks: {}, xp: 0, days: [], badges: {}, daily: {} };
