// Firestore rules on the local emulator (npm run test:rules - needs Java and
// firebase-tools; never touches the live project: "demo-" projects are
// emulator-only). Covers audit H-05 and documents the gaps still open.
import { test, before, after, beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

let env;
before(async () => {
  env = await initializeTestEnvironment({ projectId: "demo-onegrasp", firestore: { rules: readFileSync("firestore.rules", "utf8") } });
});
after(async () => { await env?.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

const student = () => env.authenticatedContext("alice", { email: "alice@example.com", email_verified: true }).firestore();
const other = () => env.authenticatedContext("bob", { email: "bob@example.com", email_verified: true }).firestore();
const admin = (verified = true) => env.authenticatedContext("admin", { email: "support@onegrasp.com", email_verified: verified }).firestore();
const seed = (path, data) => env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), path), data));
const signup = { name: "Alice", email: "alice@example.com", category: "class_9_10", paid: false, paymentStatus: "unpaid" };

test("a student can create their own profile, including their school name", async () => {
  await assertSucceeds(setDoc(doc(student(), "users/alice"), { ...signup, institution: "Sunrise School" }));
});

test("H-05: a new profile can't start out paid", async () => {
  await assertFails(setDoc(doc(student(), "users/alice"), { ...signup, paid: true }));
});

test("H-05: a new profile can't carry another uid", async () => {
  await assertFails(setDoc(doc(student(), "users/alice"), { ...signup, uid: "bob" }));
  await assertSucceeds(setDoc(doc(student(), "users/alice"), { ...signup, uid: "alice" }));
});

test("H-05: a new profile can't set admin-only fields", async () => {
  for (const field of ["institutionalLinkCode", "archivedAt", "testDrives", "decision", "certificates", "boosterRequests"]) {
    await assertFails(setDoc(doc(student(), "users/alice"), { ...signup, [field]: "x" }));
  }
});

test("nobody creates or reads someone else's profile", async () => {
  await assertFails(setDoc(doc(other(), "users/alice"), signup));
  await seed("users/alice", signup);
  await assertFails(getDoc(doc(other(), "users/alice")));
});

test("a student can't change their school or archive state after sign-up", async () => {
  await seed("users/alice", signup);
  await assertFails(updateDoc(doc(student(), "users/alice"), { institution: "Another School" }));
  await assertFails(updateDoc(doc(student(), "users/alice"), { archived: true }));
});

test("payments are server-only", async () => {
  await seed("payments/pay_ABC12345", { uid: "alice" });
  await assertFails(getDoc(doc(student(), "payments/pay_ABC12345")));
  await assertFails(setDoc(doc(student(), "payments/pay_NEW12345"), { uid: "alice" }));
});

test("C-03: a student can't mark themselves paid", async () => {
  await seed("users/alice", signup);
  await assertFails(updateDoc(doc(student(), "users/alice"), { paid: true, paymentStatus: "paid" }));
  await assertSucceeds(updateDoc(doc(student(), "users/alice"), { desiredCareer: "Doctor" }), "ordinary fields still save");
});

test("M-03: an admin email must be verified", async () => {
  await seed("users/alice", signup);
  await assertSucceeds(getDoc(doc(admin(true), "users/alice")));
  await assertFails(getDoc(doc(admin(false), "users/alice")));
});
