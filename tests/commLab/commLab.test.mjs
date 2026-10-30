import { test } from "node:test";
import assert from "node:assert/strict";
import { TRACKS, findLesson, findPrompt, trackForCategory, dailyPrompt } from "../../lib/commLab/content.ts";
import { BADGES, bandOf, countFillers, cqOf, earnedBadges, fluencyScore, lessonUnlocked, moduleStatus, moduleUnlocked, pronunciationScore, skillScore, speechMetrics, streakOf } from "../../lib/commLab/scoring.ts";
import { EMPTY_STATE } from "../../lib/commLab/types.ts";

test("content: unique ids, valid answers, every prompt findable", () => {
  const ids = new Set();
  for (const t of TRACKS) {
    assert.ok(t.daily.length >= 5, `${t.id}: daily prompts`);
    for (const m of t.modules) {
      assert.equal(m.lessons.filter((l) => l.type === "quiz" && l.assessment).length, 1, `${t.id}/${m.id}: one module assessment`);
      for (const l of m.lessons) {
        assert.ok(!ids.has(l.id), `duplicate lesson ${l.id}`); ids.add(l.id);
        assert.equal(findLesson(l.id)?.lesson, l);
        const qs = l.type === "quiz" ? l.questions : l.type === "video" ? l.check : [];
        for (const q of qs) assert.ok(q.answer >= 0 && q.answer < q.options.length, `${l.id}: ${q.q}`);
        if (l.type === "video") assert.equal(l.check.length, 3, `${l.id}: 3-question check`);
        if (l.type === "voice") { assert.equal(findPrompt(l.prompt.id)?.prompt, l.prompt); assert.ok(l.prompt.minSec < l.prompt.maxSec); }
        if (l.type === "activity" && l.activity.kind === "choice") for (const s of l.activity.scenarios) assert.equal(s.options.filter((o) => o.best).length, 1, l.id);
      }
    }
    for (const p of t.daily) assert.equal(findPrompt(p.id)?.track, t);
  }
  // The full curriculum (spec §4): 6, 6, 7 and 8 modules, nothing left as planned.
  assert.deepEqual(TRACKS.map((t) => t.modules.length), [6, 6, 7, 8]);
  assert.deepEqual(TRACKS.map((t) => t.planned.length), [0, 0, 0, 0]);
});

test("content: module ids, badges and lesson ids follow the conventions", () => {
  const badges = new Set(BADGES.map((b) => b.id));
  for (const t of TRACKS) {
    t.modules.forEach((m, i) => {
      assert.equal(m.id, `m${i + 1}`, `${t.id}: modules in order`);
      assert.ok(!badges.has(m.badge.id), `duplicate badge ${m.badge.id}`); badges.add(m.badge.id);
      assert.equal(m.lessons[0].type, "video", `${t.id}/${m.id} opens with a video`);
      m.lessons.forEach((l, j) => assert.equal(l.id, `${t.id}-${m.id}-l${j + 1}`));
      for (const l of m.lessons) {
        if (l.type === "voice") assert.equal(l.prompt.id, `${t.id}-${m.id}-voice`);
        if (l.type === "task") assert.ok(l.minWords < l.maxWords && l.rubric.length >= 3, l.id);
        if (l.type === "activity" && l.activity.kind === "order") assert.ok(l.activity.items.length >= 3, l.id);
      }
    });
  }
  // Listening lessons carry their clip (spec: T1 "Listen Like a Pro", T3 "Active Listening").
  assert.ok(findLesson("t1-m4-l3").lesson.listen && findLesson("t1-m4-l6").lesson.prompt.listen);
  assert.ok(findLesson("t3-m2-l5").lesson.listen && findLesson("t3-m2-l6").lesson.prompt.listen);
  // T2 "Writing Letters and Emails" has no voice lesson, and its badge still opens (spec: voice "None").
  const letters = TRACKS[1].modules[2];
  assert.ok(!letters.lessons.some((l) => l.type === "voice"));
  const all = Object.fromEntries(letters.lessons.map((l) => [l.id, { s: "completed", at: 1, attempts: 1 }]));
  assert.ok(moduleStatus(letters, all).badge);
});

test("track assignment follows the student's class", () => {
  assert.equal(trackForCategory("class_7").id, "t1");
  assert.equal(trackForCategory("class_9_10").id, "t2");
  assert.equal(trackForCategory("class_12").id, "t3");
  assert.equal(trackForCategory("graduate").id, "t4");
  assert.equal(dailyPrompt(TRACKS[0], new Date(2026, 9, 29)).id, dailyPrompt(TRACKS[0], new Date(2026, 9, 29, 23)).id, "same prompt all day");
});

test("CQ: 70/30 skill scores, weighted, assigned track only, bands", () => {
  const e = (score, at, t = "t1") => ({ score, at, src: "x", t });
  assert.equal(skillScore([e(50, 1), e(90, 2), e(40, 3)]), Math.round(0.7 * 40 + 0.3 * 90));
  const skills = { speaking: [e(80, 1)], writing: [e(60, 1)], listening: [e(70, 1)], reading: [e(90, 1)], };
  assert.equal(cqOf(skills, "t1").cq, Math.round(0.35 * 80 + 0.25 * 60 + 0.2 * 70 + 0.2 * 90));
  assert.deepEqual(cqOf({ speaking: [e(80, 1)], writing: [e(99, 1, "t4")] }, "t1"), { cq: 80, measured: ["speaking"], bySkill: { speaking: 80 } });
  assert.equal(cqOf({}, "t1").cq, null);
  assert.deepEqual([0, 39, 40, 60, 75, 90].map(bandOf), ["Beginner", "Beginner", "Developing", "Proficient", "Advanced", "Expert"]);
});

test("streaks count days in a row, with a freeze after 7", () => {
  const k = (d) => `d202610${String(d).padStart(2, "0")}`;
  assert.deepEqual(streakOf([k(27), k(28), k(29)], k(29)), { current: 3, longest: 3 });
  assert.equal(streakOf([k(27), k(28)], k(29)).current, 2, "today not done yet");
  assert.equal(streakOf([k(26), k(27)], k(29)).current, 0, "missed yesterday");
  const week = [1, 2, 3, 4, 5, 6, 7].map(k);
  assert.equal(streakOf([...week, k(9)], k(9)).current, 8, "a freeze covers the 8th");
  assert.equal(streakOf([1, 2, 3, 4, 5].map(k).concat(k(7)), k(7)).current, 1, "no freeze before 7 days");
});

test("unlock rules: lessons in order; next module at 80% + assessment tried", () => {
  const [m1, m2] = TRACKS[0].modules;
  const done = (ids, extra = {}) => Object.fromEntries(ids.map((id) => [id, { s: "completed", at: 1, ...extra[id] }]));
  assert.ok(lessonUnlocked(m1, 0, {}));
  assert.ok(!lessonUnlocked(m1, 1, {}));
  assert.ok(lessonUnlocked(m1, 1, done([m1.lessons[0].id])));
  const ids = m1.lessons.map((l) => l.id);
  const sixDone = done(ids.slice(0, 6));
  assert.ok(!moduleUnlocked([m1, m2], 1, sixDone), "assessment not attempted");
  const withAssessment = { ...sixDone, [ids[6]]: { s: "in_progress", attempts: 1, at: 1 } };
  assert.ok(moduleUnlocked([m1, m2], 1, withAssessment));
  assert.equal(moduleStatus(m1, withAssessment).pct, 86);
  assert.ok(moduleStatus(m1, withAssessment).badge, "voice lesson done, 80%+, assessment tried");
});

test("speech metrics: WPM, fillers (not 'I like'), long pauses, clarity", () => {
  assert.deepEqual(countFillers("Um, I like painting. It was, like, huge, you know. Uh basically yes"), { um: 1, uh: 1, like: 1, "you know": 1, basically: 1 });
  const words = Array.from({ length: 60 }, (_, i) => ({ word: "w", start: i * 0.5, end: i * 0.5 + 0.4 }));
  words[30] = { word: "w", start: 17, end: 17.4 }; // a 2 s gap before it
  for (let i = 31; i < 60; i++) words[i] = { word: "w", start: 17.5 + (i - 31) * 0.5, end: 17.9 + (i - 31) * 0.5 };
  const m = speechMetrics({ transcript: "um " + "word ".repeat(59), words, durationSec: 33, segmentLogprobs: [Math.log(0.9), Math.log(0.8)] });
  assert.equal(m.longPauses, 1);
  assert.equal(m.clarity, 85);
  assert.equal(m.fillerCount, 1);
  assert.ok(m.wpm > 100 && m.wpm < 130, String(m.wpm));
  assert.equal(fluencyScore({ ...m, wpm: 130, fillersPerMin: 1, longPauses: 0 }), 20);
  assert.ok(fluencyScore({ ...m, wpm: 200, fillersPerMin: 8, longPauses: 6 }) < 6);
  assert.equal(pronunciationScore(90), 15);
  assert.equal(pronunciationScore(30), 0);
});

test("badges", () => {
  const today = "d20261029";
  const s = { ...EMPTY_STATE, voice: { p: [{ at: 1, promptId: "p", transcript: "", total: 70, scores: {}, feedback: {}, metrics: { wpm: 130, fillersPerMin: 1, durationSec: 30 } }] }, tasks: { t: { text: "", at: 1, attempt: 1, report: { score: 85 } } } };
  assert.deepEqual(earnedBadges(s, TRACKS[0].modules, today).sort(), ["first-voice", "fluency-star", "wordsmith"]);
});
