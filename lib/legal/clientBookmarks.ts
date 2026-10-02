"use client";

/**
 * Firestore read/write for bookmarked guides - the ONLY thing this section
 * saves server-side (per the privacy-by-design rule: navigator answers,
 * letter text, timelines never leave the device). Same flat top-level
 * collection pattern as lib/startups/clientProgress.ts.
 */
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

const BOOKMARKS = "legalBookmarks";

export async function fetchBookmarkedSlugs(uid: string): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, BOOKMARKS), where("uid", "==", uid)));
  return snap.docs.map((d) => (d.data() as { guideSlug: string }).guideSlug);
}

export async function bookmarkGuide(uid: string, guideSlug: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, BOOKMARKS, `${uid}_${guideSlug}`), { uid, guideSlug, createdAt: serverTimestamp() });
}

export async function unbookmarkGuide(uid: string, guideSlug: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, BOOKMARKS, `${uid}_${guideSlug}`));
}
