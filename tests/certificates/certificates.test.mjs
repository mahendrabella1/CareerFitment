import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_COURSE_FACTS, courseFacts, courseStatus } from "../../lib/certificates/completion.ts";
import { CERT_COURSES, CERT_ID_ALPHABET, certClass, certCode, certName, learningTime, validCertId } from "../../lib/certificates/catalog.ts";

test("every certificate course has its facts", () => {
  assert.equal(ALL_COURSE_FACTS.length, CERT_COURSES.length);
  for (const c of CERT_COURSES) {
    const f = courseFacts(c.key);
    assert.ok(f, c.key);
    assert.ok(f.lessons > 0 && f.minutes > 0, `${c.key}: no lessons`);
    if (c.kind === "lessons") assert.equal(new Set(f.lessonIds).size, f.lessonIds.length, `${c.key}: duplicate lesson ids`);
    else assert.ok(f.modules.length > 0, `${c.key}: no modules`);
  }
});

test("a lesson course is complete only with every lesson ticked", () => {
  const f = courseFacts("money");
  assert.deepEqual(courseStatus(f, { done: [] }), { done: 0, total: f.lessonIds.length, complete: false });
  assert.equal(courseStatus(f, { done: f.lessonIds.slice(1) }).complete, false);
  const all = courseStatus(f, { done: [...f.lessonIds, "not-a-lesson"] });
  assert.equal(all.complete, true);
  assert.equal(all.done, f.lessonIds.length, "unknown ids don't count");
});

test("Startups is complete only with every module test passed", () => {
  const f = courseFacts("startups");
  const pass = Object.fromEntries(f.modules.map((m) => [m.slug, m.passMark]));
  assert.equal(courseStatus(f, { startups: { lessonBestPercent: {}, moduleTestBestPercent: pass } }).complete, true);
  const last = f.modules[f.modules.length - 1];
  const oneShort = { ...pass, [last.slug]: last.passMark - 1 };
  const s = courseStatus(f, { startups: { lessonBestPercent: {}, moduleTestBestPercent: oneShort } });
  assert.equal(s.complete, false);
  assert.equal(s.done, f.modules.length - 1);
  assert.equal(courseStatus(f, { startups: null }).done, 0);
});

test("names, classes, ids and times read well on a certificate", () => {
  assert.equal(certName("  priya   sharma "), "Priya Sharma");
  assert.equal(certName("RAHUL K"), "Rahul K");
  assert.equal(certName("McDonald O'Neil"), "McDonald O'Neil");
  assert.equal(certName(""), "Student");
  assert.equal(certClass("Undergraduate (18 – 21)"), "Undergraduate");
  assert.equal(certClass("Class 9 – 10"), "Class 9 – 10");
  assert.equal(certCode("k3m9q2x7ab"), "OG-K3M9Q2X7AB");
  assert.ok(validCertId("k3m9q2x7ab"));
  assert.ok(!validCertId("../users/x"));
  assert.ok(!/[01oil]/.test(CERT_ID_ALPHABET));
  assert.equal(learningTime(45), "45 minutes");
  assert.equal(learningTime(130), "about 2 hours");
  assert.equal(learningTime(100), "about 1.5 hours");
});
