import { test } from "node:test";
import assert from "node:assert/strict";
import { FORMS, SERVICES, abstractOpen, cleanRequest, fileProblem, issnAllowed, parseDay, servicesFor, todayIST, upcomingConferences } from "../../lib/boosters/catalog.ts";

test("ISSN is for undergraduates and working professionals only", () => {
  assert.equal(issnAllowed("graduate"), true);
  assert.equal(issnAllowed("experienced_professional"), true);
  for (const c of ["class_6", "class_8", "class_9_10", "class_11", "class_12", "class_11_12"]) assert.equal(issnAllowed(c), false, c);
  assert.equal(issnAllowed(undefined), true, "an account without a category isn't locked out");
  assert.deepEqual(servicesFor("class_12").map((s) => s.id), ["publishing", "writing", "isbn", "magazine"]);
  assert.equal(servicesFor("graduate").length, SERVICES.length);
});

test("every form belongs to a service and its selects have options", () => {
  const ids = new Set(SERVICES.map((s) => s.id));
  for (const f of Object.values(FORMS)) {
    assert.ok(ids.has(f.service), f.id);
    assert.ok(f.fields.some((x) => x.required), `${f.id} asks for something`);
    for (const x of f.fields) if (x.kind === "select") assert.ok(x.options?.length, `${f.id}.${x.name}`);
    assert.equal(new Set(f.fields.map((x) => x.name)).size, f.fields.length, `${f.id} field names unique`);
  }
});

test("cleanRequest keeps only the form's fields and checks them", () => {
  const ok = cleanRequest("isbn", { title: "  My Book ", format: "E-book", publisher: "Not sure yet", stage: "Still writing", hack: "x", message: "" });
  assert.deepEqual(ok, { ok: true, data: { title: "My Book", format: "E-book", publisher: "Not sure yet", stage: "Still writing" } });
  assert.equal(cleanRequest("isbn", { title: "B" }).ok, false, "required fields");
  assert.match(cleanRequest("isbn", { title: "B", format: "Scroll", publisher: "Not sure yet", stage: "Still writing" }).error, /choose an option/);
  assert.equal(cleanRequest("nope", {}).ok, false);
  const issn = { title: "J", medium: "Online", frequency: "Quarterly", publisher: "P", firstIssue: "Being planned", board: "Not formed yet" };
  assert.equal(cleanRequest("issn", { ...issn, website: "javascript:alert(1)" }).ok, false, "web address");
  assert.equal(cleanRequest("issn", { ...issn, website: "https://journal.example.edu/j" }).ok, true);
  assert.equal(cleanRequest("writing", { work: "Book chapter", stage: "The proposal", subject: "S", message: "m", deadline: "next week" }).ok, false, "date");
  const long = cleanRequest("magazine", { type: "An article", title: "t".repeat(999), section: "Education", summary: "s" });
  assert.equal(long.ok && long.data.title.length, 250, "cut to length");
});

test("attachments: Word or PDF, up to 4 MB", () => {
  assert.equal(fileProblem("abstract.DOCX", 20_000), null);
  assert.equal(fileProblem("paper.pdf", 4 * 1024 * 1024), null);
  assert.ok(fileProblem("paper.pdf", 4 * 1024 * 1024 + 1));
  assert.ok(fileProblem("run.exe", 10));
  assert.ok(fileProblem("empty.doc", 0));
});

test("dates from the conference feed", () => {
  assert.equal(parseDay("2026-10-28"), "2026-10-28");
  assert.equal(parseDay("October 13, 2026"), "2026-10-13");
  assert.equal(parseDay("Oct 3 2026"), "2026-10-03");
  assert.equal(parseDay("13 October 2026"), "2026-10-13");
  assert.equal(parseDay("20 JANUARY"), null, "no year");
  assert.equal(parseDay(""), null);
  assert.equal(todayIST(new Date("2026-10-29T20:00:00Z")), "2026-10-30", "after 18:30 UTC it's tomorrow in India");
});

test("upcoming conferences: past ones and foreign links drop out, soonest first", () => {
  const raw = [
    { id: 1, title: "Past", event_date: "2026-10-01", permalink: "https://onegrasp.com/events/a/", is_past: false },
    { id: 2, title: "Later  one", event_date: "2027-02-04", deadline: "January 20, 2027", permalink: "https://onegrasp.com/events/b/", category: "Education" },
    { id: 3, title: "Soon", event_date: "2026-11-03", deadline: "October 13, 2026", registration_deadline: "October 18, 2026", permalink: "https://onegrasp.com/events/c/" },
    { id: 4, title: "Flagged past", event_date: "2026-12-01", permalink: "https://onegrasp.com/events/d/", is_past: true },
    { id: 5, title: "Elsewhere", event_date: "2026-12-01", permalink: "https://evil.example/x" },
    { id: 6, title: "No date", event_date: "", dates: "4 FEBRUARY", permalink: "https://onegrasp.com/events/e/" },
  ];
  const list = upcomingConferences(raw, "2026-10-29");
  assert.deepEqual(list.map((c) => c.id), [3, 2, 6]);
  assert.equal(list[1].title, "Later one");
  assert.equal(list[0].abstractBy, "2026-10-13");
  assert.equal(list[2].category, "Other");
  assert.equal(abstractOpen(list[0], "2026-10-29"), false);
  assert.equal(abstractOpen(list[1], "2026-10-29"), true);
  assert.equal(abstractOpen(list[2], "2026-10-29"), true, "no deadline given");
  assert.deepEqual(upcomingConferences(null, "2026-10-29"), []);
});
