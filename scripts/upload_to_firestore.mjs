// Seeds the question bank into Firestore.
//
// Usage (from the project/ dir, after placing serviceAccountKey.json there):
//   node scripts/upload_to_firestore.mjs
//
// Writes one document per source into the `question_banks` collection:
//   question_banks/{Source} = { source, questionCount, ageGroups: {...} }
// The app reads these back via lib/firebase/questionBank.ts.

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const KEY_FILE = path.join(projectRoot, "serviceAccountKey.json");
const BANK_FILE = path.join(__dirname, "extracted_questions.json");

function loadCredential() {
  if (existsSync(KEY_FILE)) {
    const raw = JSON.parse(readFileSync(KEY_FILE, "utf8"));
    return cert({
      projectId: raw.project_id,
      clientEmail: raw.client_email,
      privateKey: String(raw.private_key).replace(/\\n/g, "\n"),
    });
  }
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }
  console.error(
    "No Firebase credentials found. Put serviceAccountKey.json in project/ " +
      "or set FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY."
  );
  process.exit(1);
}

async function main() {
  initializeApp({ credential: loadCredential() });
  const db = getFirestore();

  const bank = JSON.parse(readFileSync(BANK_FILE, "utf8"));
  const sources = Object.keys(bank);
  let grandTotal = 0;

  for (const source of sources) {
    const ageGroups = bank[source];
    let count = 0;
    for (const ag of Object.keys(ageGroups)) {
      for (const st of Object.keys(ageGroups[ag])) {
        count += ageGroups[ag][st].length;
      }
    }
    grandTotal += count;
    await db
      .collection("question_banks")
      .doc(source)
      .set({ source, questionCount: count, ageGroups });
    console.log(`  ✔ ${source.padEnd(24)} ${count} questions`);
  }

  console.log(`\nUploaded ${grandTotal} questions across ${sources.length} sources.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
