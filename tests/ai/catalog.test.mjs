import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, TOOLS, LEVELS, RULES, coursesFor, learnerOf, toolsFor } from "../../lib/ai/catalog.ts";

test("every course and tool is complete, unique and links out over https", () => {
  for (const list of [COURSES, TOOLS]) {
    assert.equal(new Set(list.map((x) => x.slug)).size, list.length, "duplicate slug");
    for (const x of list) assert.match(x.url, /^https:\/\//, x.slug);
  }
  for (const c of COURSES) {
    assert.ok(LEVELS.some((l) => l.level === c.level), c.slug);
    assert.ok(c.groups.length > 0 && c.certNote && c.why, c.slug);
  }
  for (const t of TOOLS) assert.ok(t.tips.length >= 3 && t.privacy && t.accuracy && t.tryThis, t.slug);
  assert.equal(RULES.length, 5);
});

test("tools are gated by the learner's class", () => {
  const kids = toolsFor(learnerOf("class_7").band);
  assert.ok(kids.length > 0 && kids.every((t) => t.band === "kids"), "class 6-8 see only tools made for children");
  const teens = toolsFor(learnerOf("class_9_10").band);
  assert.ok(teens.some((t) => t.band === "teen") && teens.every((t) => t.band !== "adult"), "class 9-12 never see 18+ tools");
  assert.equal(toolsFor(learnerOf("graduate").band).length, TOOLS.length);
});

test("every class has courses at level 1, including YUVA AI for All", () => {
  for (const cat of ["class_6", "class_9_10", "class_12", "graduate"]) {
    const list = coursesFor(learnerOf(cat).group);
    assert.ok(list.some((c) => c.slug === "yuva-ai-for-all"), cat);
    assert.ok(list.some((c) => c.level === 1), cat);
  }
  // Adult-only courses (Anthropic Academy) never show for school classes.
  for (const g of ["6-8", "9-12"]) assert.ok(coursesFor(g).every((c) => !/18 and over/.test(c.note ?? "")), g);
});
