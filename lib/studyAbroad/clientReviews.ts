"use client";

/**
 * Verified study-abroad reviews (plan section 8). A submission is stored as
 * "pending_verification" and is never shown until staff verify it and set
 * status to "published". Proof documents go to Storage under
 * reviewVerification/{uid}/ so staff can check and then delete them; only a
 * "Verified student" or "Verified alumni" badge is kept on the review.
 *
 * Requires Firestore and Storage rules that let a signed-in user create their
 * own pending review and read published ones. If the rules don't allow it
 * yet, submit returns false and the UI keeps the draft on the device.
 */
import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { getDb, getFirebaseStorage } from "@/lib/firebase/client";

const REVIEWS = "studyAbroadReviews";

export const REVIEW_AREAS = [
  { key: "teaching", label: "Teaching and course", question: "Was the course what was promised?" },
  { key: "value", label: "Value for money", question: "Was it worth the total cost?" },
  { key: "career", label: "Career support and jobs", question: "Did you get internships or a job? How long did it take?" },
  { key: "visa", label: "Visa and immigration", question: "How smooth were the student visa and the post-study work visa?" },
  { key: "living", label: "Living", question: "Housing, safety, part-time work and cost of living." },
  { key: "community", label: "Indian community and food", question: "Did you feel welcome?" },
] as const;

export type ReviewAreaKey = (typeof REVIEW_AREAS)[number]["key"];

export interface ReviewDraft {
  universitySlug?: string;
  universityName: string;
  programme: string;
  countryCode?: string;
  role: "student" | "alumni";
  yearStarted: string;
  ratings: Partial<Record<ReviewAreaKey, number>>;
  answers: Partial<Record<ReviewAreaKey, string>>;
  outcome: { jobTitle?: string; salaryBand?: string; monthsToJob?: string; stayedAbroad?: "yes" | "no" | "" };
  advice: string;
  displayName: string; // first name and initial only
  verification: "university_email" | "document";
  universityEmail?: string;
}

export interface PublishedReview extends ReviewDraft {
  id: string;
  badge: "Verified student" | "Verified alumni";
}

export async function submitReview(uid: string, draft: ReviewDraft, proof?: File): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    let proofPath: string | null = null;
    if (draft.verification === "document" && proof) {
      const storage = getFirebaseStorage();
      if (!storage) return false;
      proofPath = `reviewVerification/${uid}/${Date.now()}-${proof.name}`;
      await uploadBytes(ref(storage, proofPath), proof);
    }
    // A JSON round trip drops undefined fields, which Firestore rejects.
    const clean = JSON.parse(JSON.stringify(draft)) as ReviewDraft;
    await addDoc(collection(db, REVIEWS), {
      ...clean,
      uid,
      proofPath,
      status: "pending_verification",
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Review submission failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function fetchPublishedReviews(): Promise<PublishedReview[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await getDocs(query(collection(db, REVIEWS), where("status", "==", "published"), limit(100)));
    return snap.docs.map((d) => {
      const data = d.data() as ReviewDraft & { role: "student" | "alumni" };
      return { ...data, id: d.id, badge: data.role === "alumni" ? "Verified alumni" : "Verified student" };
    });
  } catch (err) {
    console.error("Could not load reviews:", err instanceof Error ? err.message : err);
    return null;
  }
}
