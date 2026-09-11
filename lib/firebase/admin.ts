import { existsSync, readFileSync } from "fs";
import path from "path";
import type { Firestore } from "firebase-admin/firestore";

// firebase-admin is imported *dynamically* (see getFirestore) so it is never
// loaded, bundled, or evaluated on the local-JSON path — only when Firestore is
// actually configured and used. Keeping it out of module-load also avoids its
// native/protobuf deps breaking route bundling when it isn't needed.

// Resolves Firebase Admin credentials from either:
//   1. project/serviceAccountKey.json  (the file you download from the console)
//   2. env vars FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
// Whichever is present wins (file first). Returns null when nothing is set —
// that's the signal to fall back to the local JSON store.

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const KEY_FILE = path.join(process.cwd(), "serviceAccountKey.json");

let cachedAccount: ServiceAccount | null | undefined;

function resolveServiceAccount(): ServiceAccount | null {
  if (cachedAccount !== undefined) return cachedAccount;

  // 1. Key file on disk
  if (existsSync(KEY_FILE)) {
    try {
      const raw = JSON.parse(readFileSync(KEY_FILE, "utf8"));
      if (raw.project_id && raw.client_email && raw.private_key) {
        cachedAccount = {
          projectId: raw.project_id,
          clientEmail: raw.client_email,
          privateKey: String(raw.private_key).replace(/\\n/g, "\n"),
        };
        return cachedAccount;
      }
    } catch {
      // fall through to env
    }
  }

  // 2. Environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    cachedAccount = {
      projectId,
      clientEmail,
      // env-stored keys usually carry literal "\n" — normalise to real newlines
      privateKey: privateKey.replace(/\\n/g, "\n"),
    };
    return cachedAccount;
  }

  cachedAccount = null;
  return cachedAccount;
}

/** True when Firebase credentials are available (file or env). */
export function isFirestoreConfigured(): boolean {
  return resolveServiceAccount() !== null;
}

/**
 * Lazily initialise the Admin app and return a Firestore handle. Throws if
 * called without credentials — callers must guard with isFirestoreConfigured().
 */
export async function getFirestore(): Promise<Firestore> {
  const account = resolveServiceAccount();
  if (!account) {
    throw new Error(
      "Firestore is not configured. Add serviceAccountKey.json or FIREBASE_* env vars."
    );
  }
  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const { getFirestore: adminGetFirestore } = await import("firebase-admin/firestore");
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: account.projectId,
        clientEmail: account.clientEmail,
        privateKey: account.privateKey,
      }),
    });
  }
  return adminGetFirestore();
}
