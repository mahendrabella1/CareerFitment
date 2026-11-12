// Storage rules on the local emulator (npm run test:rules). Covers audit H-07.
import { test, before, after } from "node:test";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { ref, uploadBytes, getBytes, deleteObject } from "firebase/storage";

let env;
before(async () => {
  env = await initializeTestEnvironment({ projectId: "demo-onegrasp", storage: { rules: readFileSync("storage.rules", "utf8") } });
});
after(async () => { await env?.cleanup(); });

const as = (uid, email = `${uid}@example.com`) => env.authenticatedContext(uid, { email, email_verified: true }).storage();
const pdf = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]); // "%PDF-1.4"
const put = (st, path, bytes = pdf, contentType = "application/pdf") => uploadBytes(ref(st, path), bytes, { contentType });

test("owners upload, read and delete their own vault files", async () => {
  for (const vault of ["scholarshipVault", "studyAbroadVault"]) {
    const path = `${vault}/alice/marksheet-1-a.pdf`;
    await assertSucceeds(put(as("alice"), path));
    await assertSucceeds(getBytes(ref(as("alice"), path)));
    await assertSucceeds(deleteObject(ref(as("alice"), path)));
  }
});

test("nobody else reads or writes a vault", async () => {
  await assertSucceeds(put(as("alice"), "scholarshipVault/alice/id-1.pdf"));
  await assertFails(getBytes(ref(as("bob"), "scholarshipVault/alice/id-1.pdf")));
  await assertFails(put(as("bob"), "scholarshipVault/alice/sneaky.pdf"));
  await assertFails(put(env.unauthenticatedContext().storage(), "scholarshipVault/alice/anon.pdf"));
});

test("only PDF, image or Word files under 10 MB, and no overwrites", async () => {
  await assertFails(put(as("alice"), "scholarshipVault/alice/run.exe", pdf, "application/x-msdownload"));
  await assertFails(put(as("alice"), "scholarshipVault/alice/page.html", pdf, "text/html"));
  await assertFails(put(as("alice"), "scholarshipVault/alice/big.pdf", new Uint8Array(10 * 1024 * 1024 + 1)));
  await assertSucceeds(put(as("alice"), "scholarshipVault/alice/photo.jpg", pdf, "image/jpeg"));
  await assertFails(put(as("alice"), "scholarshipVault/alice/photo.jpg", pdf, "image/jpeg"), "overwrite refused");
});

test("review proofs: the owner uploads, admins can read", async () => {
  await assertSucceeds(put(as("alice"), "reviewVerification/alice/1-offer.pdf"));
  await assertSucceeds(getBytes(ref(as("admin", "support@onegrasp.com"), "reviewVerification/alice/1-offer.pdf")));
  await assertFails(getBytes(ref(as("bob"), "reviewVerification/alice/1-offer.pdf")));
});

test("everything else is denied", async () => {
  await assertFails(put(as("alice"), "public/alice/x.pdf"));
  await assertFails(put(as("alice"), "alice.pdf"));
});
