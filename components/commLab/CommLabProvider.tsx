"use client";
/**
 * The student's Communication Lab progress, shared by every Lab page (it sits
 * in app/account/communication/layout.tsx, so it survives moving between
 * pages). Saved to users/{uid}.commLab (field by field, like the course
 * progress) and mirrored in per-student browser storage so a reload or a
 * signed-out preview starts where it was.
 *
 * Every change goes through `commit`, which also stamps today for the streak,
 * awards badges (module badges add 100 XP) and shows a toast.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { arrayUnion, doc, increment, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { dayKey } from "@/lib/progress/activity";
import { scopedKey } from "@/lib/progress/userStorage";
import { TRACKS, trackForCategory, type LessonRef } from "@/lib/commLab/content";
import { BADGES, MODULE_XP, PASS_PERCENT, cqOf, earnedBadges, levelOf, moduleStatus, streakOf } from "@/lib/commLab/scoring";
import { EMPTY_STATE, type CommLabState, type LessonProgress, type Skill, type TaskReport, type TaskSubmission, type Track, type VoiceReport } from "@/lib/commLab/types";

const LOCAL_KEY = "onegrasp.commlab.v1";
const ALL_MODULES = TRACKS.flatMap((t) => t.modules);
const BADGE_TITLE: Record<string, string> = Object.fromEntries([...BADGES.map((b) => [b.id, b.title]), ...ALL_MODULES.map((m) => [m.badge.id, m.badge.title])]);

const normalize = (s?: Partial<CommLabState> | null): CommLabState => ({
  ...EMPTY_STATE, ...s,
  lessons: { ...s?.lessons }, skills: { ...s?.skills }, voice: { ...s?.voice }, tasks: { ...s?.tasks },
  badges: { ...s?.badges }, daily: { ...s?.daily }, days: [...(s?.days ?? [])], xp: Number(s?.xp ?? 0),
});

type Writes = Record<string, unknown>;

interface Api {
  ready: boolean;
  state: CommLabState;
  /** The student's own track (from their class); CQ and badges count only there. */
  track: Track;
  /** Class 6-12: voice practice needs a parent's or guardian's OK first. */
  minor: boolean;
  signedIn: boolean;
  cq: ReturnType<typeof cqOf>;
  level: ReturnType<typeof levelOf>;
  streak: ReturnType<typeof streakOf>;
  progress: (lessonId: string) => LessonProgress | undefined;
  saveVideo: (ref: LessonRef, pos: number, pct: number) => void;
  videoCheck: (ref: LessonRef, score: number) => void;
  /** A quiz or activity attempt. Quizzes complete at 60%+; activities on submit. */
  recordScore: (ref: LessonRef, score: number, sec: number) => void;
  complete: (ref: LessonRef) => void;
  recordVoice: (report: VoiceReport, ref: LessonRef | null) => void;
  recordTask: (ref: LessonRef, text: string, report: TaskReport) => void;
  setConsent: () => void;
  toast: string | null;
}

const Ctx = createContext<Api | null>(null);

export function useCommLab(): Api {
  const api = useContext(Ctx);
  if (!api) throw new Error("useCommLab outside CommLabProvider");
  return api;
}

export function CommLabProvider({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [state, setState] = useState<CommLabState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const stateRef = useRef(state);
  const loadedFor = useRef<string | null>(null);
  const uid = user?.uid ?? null;
  const track = trackForCategory(profile?.category);
  const minor = !!profile?.category && profile.category !== "graduate" && profile.category !== "experienced_professional";

  // Load once per account: the account copy, else this device's copy.
  useEffect(() => {
    if (loading) return;
    const who = uid ?? "guest";
    if (loadedFor.current === who) return;
    loadedFor.current = who;
    let local: Partial<CommLabState> | null = null;
    try { local = JSON.parse(window.localStorage.getItem(scopedKey(LOCAL_KEY)) ?? "null"); } catch { /* storage blocked */ }
    const next = normalize(profile?.commLab ?? local);
    stateRef.current = next;
    setState(next);
    setReady(true);
  }, [loading, uid, profile]);

  const persist = useCallback((w: Writes, next: CommLabState) => {
    try { window.localStorage.setItem(scopedKey(LOCAL_KEY), JSON.stringify(next)); } catch { /* storage full or blocked */ }
    const db = getDb();
    if (!uid || !db || !Object.keys(w).length) return;
    updateDoc(doc(db, "users", uid), w).catch(() => {
      // Offline: the device copy keeps it; the next change saves the latest state of each field.
    });
  }, [uid]);

  /** Apply a change; `active` marks today for the streak and checks badges. */
  const commit = useCallback((fn: (s: CommLabState, w: Writes, addXp: (n: number) => void) => void, active = true) => {
    const s = normalize(structuredClone(stateRef.current));
    const w: Writes = {};
    let xp = 0;
    const addXp = (n: number) => { xp += n; };
    fn(s, w, addXp);
    const earned: string[] = [];
    if (active) {
      const today = dayKey();
      if (!s.days.includes(today)) { s.days.push(today); w["commLab.days"] = arrayUnion(today); }
      const now = Date.now();
      for (const id of earnedBadges(s, ALL_MODULES, today)) {
        if (!s.badges[id]) { s.badges[id] = now; w[`commLab.badges.${id}`] = now; earned.push(BADGE_TITLE[id] ?? id); }
      }
      for (const m of ALL_MODULES) {
        if (!s.badges[m.badge.id] && moduleStatus(m, s.lessons).badge) {
          s.badges[m.badge.id] = now; w[`commLab.badges.${m.badge.id}`] = now; xp += MODULE_XP; earned.push(m.badge.title);
        }
      }
    }
    if (xp) { s.xp += xp; w["commLab.xp"] = increment(xp); }
    stateRef.current = s;
    setState(s);
    persist(w, s);
    if (earned.length) {
      setToast(`Badge earned: ${earned.join(", ")}${xp >= MODULE_XP ? ` · +${xp} XP` : ""}`);
      window.setTimeout(() => setToast(null), 4500);
    }
  }, [persist]);

  const setLesson = (s: CommLabState, w: Writes, id: string, patch: Partial<LessonProgress>) => {
    const next: LessonProgress = { ...(s.lessons[id] ?? { s: "in_progress", at: 0 }), ...patch, at: Date.now() };
    s.lessons[id] = next;
    w[`commLab.lessons.${id}`] = next;
    return next;
  };
  /** Completes a lesson; its XP is given once. */
  const completeIn = (s: CommLabState, w: Writes, addXp: (n: number) => void, ref: LessonRef) => {
    if (s.lessons[ref.lesson.id]?.s !== "completed") addXp(ref.lesson.xp);
    setLesson(s, w, ref.lesson.id, { s: "completed" });
  };
  const addSkill = (s: CommLabState, w: Writes, skill: Skill, score: number, src: string, t: string) => {
    const list = [...(s.skills[skill] ?? []), { at: Date.now(), score: Math.round(score), src, t }].slice(-12);
    s.skills[skill] = list;
    w[`commLab.skills.${skill}`] = list;
  };

  const api = useMemo<Api>(() => ({
    ready, state, track, minor, signedIn: !!uid, toast,
    cq: cqOf(state.skills, track.id),
    level: levelOf(state.xp),
    streak: streakOf(state.days, dayKey()),
    progress: (id) => state.lessons[id],
    saveVideo: (ref, pos, pct) => commit((s, w, addXp) => {
      const cur = s.lessons[ref.lesson.id];
      const best = Math.max(cur?.pct ?? 0, pct);
      setLesson(s, w, ref.lesson.id, { s: cur?.s ?? "in_progress", pos: Math.round(pos), pct: best });
      if (best >= 90 && cur?.s !== "completed") completeIn(s, w, addXp, ref);
    }, pct >= 90),
    videoCheck: (ref, score) => commit((s, w) => {
      const cur = s.lessons[ref.lesson.id];
      setLesson(s, w, ref.lesson.id, { score, best: Math.max(cur?.best ?? 0, score), attempts: (cur?.attempts ?? 0) + 1 });
      addSkill(s, w, ref.lesson.skill, score, ref.lesson.id, ref.track.id);
    }),
    recordScore: (ref, score, sec) => commit((s, w, addXp) => {
      const cur = s.lessons[ref.lesson.id];
      setLesson(s, w, ref.lesson.id, { s: cur?.s ?? "in_progress", score, best: Math.max(cur?.best ?? 0, score), attempts: (cur?.attempts ?? 0) + 1, sec: (cur?.sec ?? 0) + Math.round(sec) });
      addSkill(s, w, ref.lesson.skill, score, ref.lesson.id, ref.track.id);
      if (ref.lesson.type !== "quiz" || score >= PASS_PERCENT) completeIn(s, w, addXp, ref);
    }),
    complete: (ref) => commit((s, w, addXp) => completeIn(s, w, addXp, ref)),
    recordVoice: (report, ref) => commit((s, w, addXp) => {
      const attempt = { ...report, transcript: report.transcript.slice(0, 1500), at: Date.now() };
      const list = [...(s.voice[report.promptId] ?? []), attempt].slice(-5);
      s.voice[report.promptId] = list;
      w[`commLab.voice.${report.promptId}`] = list;
      if (report.unscored) return;
      addSkill(s, w, "speaking", report.total, report.promptId, ref?.track.id ?? track.id);
      if (ref) completeIn(s, w, addXp, ref);
      else {
        const today = dayKey();
        if (!s.daily[today]) { s.daily[today] = report.promptId; w[`commLab.daily.${today}`] = report.promptId; addXp(30); }
      }
    }),
    recordTask: (ref, text, report) => commit((s, w, addXp) => {
      const prev = s.tasks[ref.lesson.id];
      const sub: TaskSubmission = { text: text.slice(0, 4000), at: Date.now(), attempt: (prev?.attempt ?? 0) + 1, report };
      s.tasks[ref.lesson.id] = sub;
      w[`commLab.tasks.${ref.lesson.id}`] = sub;
      addSkill(s, w, "writing", report.score, ref.lesson.id, ref.track.id);
      const cur = s.lessons[ref.lesson.id];
      setLesson(s, w, ref.lesson.id, { score: report.score, best: Math.max(cur?.best ?? 0, report.score), attempts: sub.attempt });
      completeIn(s, w, addXp, ref);
    }),
    setConsent: () => commit((s, w) => { s.consent = { at: Date.now(), minor }; w["commLab.consent"] = s.consent; }, false),
  }), [ready, state, track, minor, uid, toast, commit]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
