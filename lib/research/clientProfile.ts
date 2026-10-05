"use client";

/**
 * Public research profiles (plan section 10, "Research profile"). One doc
 * per learner in researchProfiles/{slug}. The learner chooses exactly what
 * appears; personal contact details are refused by validate() and never
 * stored. Needs Firestore rules that allow public reads of this collection
 * and writes only by the owner (doc.uid == request.auth.uid).
 */
import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

const PROFILES = "researchProfiles";

export interface ProfileProject {
  question: string;
  conferenceTitle: string;
  organiser: string;
  level: string;
  status: string;
  startsAt: number;
}

export interface ResearchProfileDoc {
  uid: string;
  slug: string;
  displayName: string;
  school: string;
  under18: boolean;
  bio: string;
  subjects: string[];
  projects: ProfileProject[];
}

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE = /(\+?\d[\d\s-]{8,}\d)/;
const URL_RE = /(https?:\/\/|www\.)/i;

/** Returns an error message, or "" when the profile follows the privacy rules. */
export function validateProfile(p: ResearchProfileDoc, parentConsent: boolean): string {
  const name = p.displayName.trim();
  const school = p.school.trim();
  if (!name && !school) return "Add a display name or your school's name.";
  if (p.under18) {
    if (name && !/^[A-Za-z][A-Za-z'-]{1,30} [A-Za-z]\.?$/.test(name)) return "Under 18: show only your first name and the initial of your surname (for example 'Ananya R'), or leave the name blank and show your school only.";
    if (!parentConsent) return "Under 18: a parent or guardian must agree before the profile is published.";
    if (URL_RE.test(p.bio)) return "Under 18: please don't include links in your bio.";
  } else if (name.length > 60) {
    return "Keep the display name under 60 characters.";
  }
  const text = `${name} ${school} ${p.bio} ${p.subjects.join(" ")}`;
  if (EMAIL.test(text)) return "Remove the email address. Profiles never show contact details.";
  if (PHONE.test(text)) return "Remove the phone number. Profiles never show contact details.";
  if (p.bio.length > 400) return "Keep the bio under 400 characters.";
  return "";
}

export function makeSlug(base: string): string {
  const stem = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 30) || "researcher";
  return `${stem}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function fetchMyProfile(uid: string): Promise<ResearchProfileDoc | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await getDocs(query(collection(db, PROFILES), where("uid", "==", uid), limit(1)));
    return snap.empty ? null : (snap.docs[0].data() as ResearchProfileDoc);
  } catch {
    return null;
  }
}

export async function publishProfile(p: ResearchProfileDoc): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    await setDoc(doc(db, PROFILES, p.slug), { ...p, updatedAt: serverTimestamp() });
    return true;
  } catch (err) {
    console.error("Publishing the research profile failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function unpublishProfile(slug: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    await deleteDoc(doc(db, PROFILES, slug));
    return true;
  } catch {
    return false;
  }
}

export async function fetchPublicProfile(slug: string): Promise<ResearchProfileDoc | null | "error"> {
  const db = getDb();
  if (!db) return "error";
  try {
    const snap = await getDoc(doc(db, PROFILES, slug));
    return snap.exists() ? (snap.data() as ResearchProfileDoc) : null;
  } catch {
    return "error";
  }
}
