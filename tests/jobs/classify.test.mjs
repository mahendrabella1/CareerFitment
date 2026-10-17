import { test } from "node:test";
import assert from "node:assert/strict";
import { CLUSTER_NAMES, classifyJob, matchRole, pathRoleNames } from "../../lib/jobs/classify.ts";
import { CATEGORY_SHORT, JOB_CATEGORIES } from "../../lib/jobs/clusters.ts";

test("the portal's category list matches the cluster file", () => {
  assert.deepEqual([...JOB_CATEGORIES], CLUSTER_NAMES);
  for (const c of JOB_CATEGORIES) assert.ok(CATEGORY_SHORT[c], `short label for ${c}`);
});

test("titles naming a OneGrasp role match it, ignoring seniority and location noise", () => {
  for (const title of ["Data Analyst", "Junior Data Analyst", "Data Analyst - Bengaluru", "Data Analyst (Remote)", "Sr. Data Analyst | Hybrid"]) {
    const m = matchRole(title);
    assert.ok(m, title);
    assert.match(m.role.toLowerCase(), /data analyst/, title);
  }
});

test("a report's careers map to the same role names jobs are labelled with", () => {
  const roles = pathRoleNames(["Data Analyst (Entry level)", "Engineer", "Something unrelated"]);
  assert.equal(roles.length, 1);
  assert.equal(roles[0], matchRole("Junior Data Analyst - Pune").role);
});

test("one-word titles too broad to mean a role don't match", () => {
  assert.equal(matchRole("Engineer"), null);
  assert.equal(matchRole("Manager"), null);
});

test("a job with no role match still gets a cluster from its words or source category", () => {
  assert.equal(classifyJob("Staff Nurse", null, []).category, "Healthcare & Medicine");
  assert.equal(classifyJob("Backend Developer (Go)", null, []).category, "Engineering, Technology & Computing");
  assert.equal(classifyJob("Team member", "Customer Service", []).category, "Business, Finance & Entrepreneurship");
  assert.deepEqual(classifyJob("Team member", null, []), { category: null, role: null });
});
