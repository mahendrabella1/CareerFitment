"use client";

/**
 * Firebase browser client - Auth + Firestore for user accounts.
 *
 * The Firebase WEB config below is PUBLIC and safe to commit (security is
 * enforced by Firebase Auth + Firestore rules, not by hiding these values).
 * This is NOT the same as serviceAccountKey.json, which is secret.
 *
 *  >>> PASTE YOUR firebaseConfig VALUES BELOW (Firebase console -> Project
 *      settings -> Your apps -> Web app -> SDK setup and configuration). <<<
 *
 * Env vars (NEXT_PUBLIC_FIREBASE_*) still override these if set, so you can
 * keep secrets out of git later without touching this file.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// ---- Hardcoded web config (public - safe to commit) -----------------------
const HARDCODED = {
  apiKey: "AIzaSyA3fUy9CkpoNf-vjrhswJQNwqy0qSr2cL0",
  authDomain: "careerfitment.firebaseapp.com",
  projectId: "careerfitment",
  storageBucket: "careerfitment.firebasestorage.app",
  messagingSenderId: "31414352479",
  appId: "1:31414352479:web:2631f8d57a50cee405b9ea",
  measurementId: "G-2WRRXZHE04",
};

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || HARDCODED.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || HARDCODED.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || HARDCODED.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || HARDCODED.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || HARDCODED.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || HARDCODED.appId,
  measurementId: HARDCODED.measurementId,
};

// "Ready" only when the placeholders have actually been filled in.
export const firebaseReady = Boolean(
  config.apiKey &&
    !config.apiKey.startsWith("PASTE_") &&
    config.projectId &&
    config.authDomain
);

console.log("Firebase client config - Ready:", firebaseReady, "Config:", { apiKey: config.apiKey ? "***" : "MISSING", projectId: config.projectId, authDomain: config.authDomain });

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

function ensureApp(): FirebaseApp | null {
  if (!firebaseReady) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = ensureApp();
  if (!a) return null;
  if (!authInstance) authInstance = getAuth(a);
  return authInstance;
}

export function getDb(): Firestore | null {
  const a = ensureApp();
  if (!a) return null;
  if (!dbInstance) {
    try {
      dbInstance = getFirestore(a);
    } catch (err) {
      console.warn("Firestore initialization failed, returning null:", err);
      return null;
    }
  }
  return dbInstance;
}

/** Document-vault storage (Scholarships, Study Abroad) - the same Firebase
 *  project already in use for Auth/Firestore, not a new paid vendor. New
 *  infrastructure, though: Storage security rules must be set on the
 *  Firebase console (reject-all-but-owner by default) before any document
 *  uploaded here is truly private - this client code alone doesn't enforce
 *  that, same as Firestore's own access control lives in its rules, not here. */
export function getFirebaseStorage(): FirebaseStorage | null {
  const a = ensureApp();
  if (!a) return null;
  if (!storageInstance) {
    try {
      storageInstance = getStorage(a);
    } catch (err) {
      console.warn("Firebase Storage initialization failed, returning null:", err);
      return null;
    }
  }
  return storageInstance;
}
