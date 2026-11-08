"use client";
/**
 * The student's Aptitude Lab progress, shared by every Lab page (it sits in
 * app/account/aptitude/layout.tsx). Saved to users/{uid}.aptitudeLab field by
 * field and mirrored in per-student browser storage, like the Communication Lab.
 * A set is saved once, when it's finished - not answer by answer.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { dayKey } from "@/lib/progress/activity";
import { scopedKey } from "@/lib/progress/userStorage";
import { streakOf } from "@/lib/commLab/scoring";
import type { Level } from "@/lib/aptitude/core";
import { APT_TRACKS, aptTrackById, aptTrackFor, type AptTrack, type TrackTopic } from "@/lib/aptitude/topics";
import { EMPTY_APT, aptitudeScore, levelFor, updateTopic, type Answer, type AptitudeState, type MockResult, type TopicStat } from "@/lib/aptitude/scoring";

const LOCAL_KEY = "onegrasp.aptitude.v1";

const normalize = (s?: Partial<AptitudeState> | null): AptitudeState => ({
  ...EMPTY_APT, ...s,
  topics: { ...s?.topics }, mocks: [...(s?.mocks ?? [])], days: [...(s?.days ?? [])], daily: { ...s?.daily },
});

interface Api {
  ready: boolean;
  state: AptitudeState;
  /** The track in use: one the student picked, else their class's own. */
  track: AptTrack;
  ownTrack: AptTrack;
  signedIn: boolean;
  score: ReturnType<typeof aptitudeScore>;
  streak: ReturnType<typeof streakOf>;
  /** The level to practise a topic at (the student's own, within the track's range). */
  levelOf: (t: TrackTopic) => Level;
  /** The track's range for a topic, or the full range when it isn't in the track. */
  rangeOf: (topicId: string) => TrackTopic;
  /** A finished practice set (topic or today's ten). Returns each topic's level before and after. */
  recordPractice: (answers: Answer[], opts?: { daily?: boolean }) => Record<string, { from: Level; to: Level }>;
  recordMock: (result: MockResult, answers: Answer[]) => void;
  setTrack: (id: string | null) => void;
}

const Ctx = createContext<Api | null>(null);

export function useAptitude(): Api {
  const api = useContext(Ctx);
  if (!api) throw new Error("useAptitude outside AptitudeProvider");
  return api;
}

export function AptitudeProvider({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [state, setState] = useState<AptitudeState>(EMPTY_APT);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  const loadedFor = useRef<string | null>(null);
  const uid = user?.uid ?? null;
  const ownTrack = aptTrackFor(profile?.category);
  const track = aptTrackById(state.track) ?? ownTrack;

  useEffect(() => {
    if (loading) return;
    const who = uid ?? "guest";
    if (loadedFor.current === who) return;
    loadedFor.current = who;
    let local: Partial<AptitudeState> | null = null;
    try { local = JSON.parse(window.localStorage.getItem(scopedKey(LOCAL_KEY)) ?? "null"); } catch { /* storage blocked */ }
    const next = normalize(profile?.aptitudeLab ?? local);
    stateRef.current = next;
    setState(next);
    setReady(true);
  }, [loading, uid, profile]);

  const commit = useCallback((fn: (s: AptitudeState, w: Record<string, unknown>) => void, active = true) => {
    const s = normalize(structuredClone(stateRef.current));
    const w: Record<string, unknown> = {};
    fn(s, w);
    if (active) {
      const today = dayKey();
      if (!s.days.includes(today)) { s.days.push(today); w["aptitudeLab.days"] = arrayUnion(today); }
    }
    stateRef.current = s;
    setState(s);
    try { window.localStorage.setItem(scopedKey(LOCAL_KEY), JSON.stringify(s)); } catch { /* storage full or blocked */ }
    const db = getDb();
    if (uid && db && Object.keys(w).length) updateDoc(doc(db, "users", uid), w).catch(() => { /* offline: this device keeps it */ });
  }, [uid]);

  const rangeOf = useCallback((id: string): TrackTopic => track.topics.find((t) => t.id === id) ?? APT_TRACKS.flatMap((t) => t.topics).find((t) => t.id === id) ?? { id, min: 1, max: 3 }, [track]);

  const applyAnswers = useCallback((s: AptitudeState, w: Record<string, unknown>, answers: Answer[], adapt: boolean) => {
    const changes: Record<string, { from: Level; to: Level }> = {};
    const byTopic = new Map<string, Answer[]>();
    for (const a of answers) byTopic.set(a.topic, [...(byTopic.get(a.topic) ?? []), a]);
    for (const [id, list] of byTopic) {
      const range = rangeOf(id);
      const before = levelFor(s, range);
      const next: TopicStat = updateTopic(s.topics[id] ? { ...s.topics[id], level: before } : undefined, list, range, adapt);
      s.topics[id] = next;
      w[`aptitudeLab.topics.${id}`] = next;
      changes[id] = { from: before, to: next.level };
    }
    return changes;
  }, [rangeOf]);

  const api = useMemo<Api>(() => ({
    ready, state, track, ownTrack, signedIn: !!uid,
    score: aptitudeScore(state, track),
    streak: streakOf(state.days, dayKey()),
    levelOf: (t) => levelFor(state, t),
    rangeOf,
    recordPractice: (answers, opts) => {
      let changes: Record<string, { from: Level; to: Level }> = {};
      commit((s, w) => {
        // Today's ten mixes topics one question each - too few to move a level.
        changes = applyAnswers(s, w, answers, !opts?.daily);
        const today = dayKey();
        if (opts?.daily && s.daily[today] === undefined) { s.daily[today] = answers.filter((a) => a.ok).length; w[`aptitudeLab.daily.${today}`] = s.daily[today]; }
      });
      return changes;
    },
    recordMock: (result, answers) => commit((s, w) => {
      applyAnswers(s, w, answers, false);
      s.mocks = [...s.mocks, result].slice(-12);
      w["aptitudeLab.mocks"] = s.mocks;
    }),
    setTrack: (id) => commit((s, w) => {
      if (id && id !== ownTrack.id) { s.track = id; w["aptitudeLab.track"] = id; }
      else { delete s.track; w["aptitudeLab.track"] = null; }
    }, false),
  }), [ready, state, track, ownTrack, uid, rangeOf, commit, applyAnswers]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
