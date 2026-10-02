"use client";

/**
 * Document vault for Study Abroad - same Firebase Storage pattern as
 * lib/scholarships/clientVault.ts, different storage path
 * (`studyAbroadVault/{uid}/...`) and document kinds.
 */
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";

export type AbroadVaultDocKind = "passport" | "transcripts" | "test_scores" | "cv" | "financial_documents" | "sop" | "lor";

export const ABROAD_VAULT_DOC_LABELS: Record<AbroadVaultDocKind, string> = {
  passport: "Passport", transcripts: "Transcripts", test_scores: "Test scores (IELTS/TOEFL/GRE/GMAT)",
  cv: "CV / resume", financial_documents: "Financial documents", sop: "Statement of purpose", lor: "Letters of recommendation",
};

export interface AbroadVaultFile {
  path: string;
  kind: string;
  name: string;
  url: string;
  uploadedAt: Date | null;
}

export async function uploadAbroadVaultDocument(uid: string, kind: AbroadVaultDocKind, file: File): Promise<boolean> {
  const storage = getFirebaseStorage();
  if (!storage) return false;
  const path = `studyAbroadVault/${uid}/${kind}-${Date.now()}-${file.name}`;
  try {
    await uploadBytes(ref(storage, path), file);
    return true;
  } catch (err) {
    console.error("Abroad vault upload failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function listAbroadVaultDocuments(uid: string): Promise<AbroadVaultFile[]> {
  const storage = getFirebaseStorage();
  if (!storage) return [];
  try {
    const folder = ref(storage, `studyAbroadVault/${uid}`);
    const res = await listAll(folder);
    return await Promise.all(res.items.map(async (item) => {
      const [url, meta] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
      return { path: item.fullPath, kind: item.name.split("-")[0], name: item.name, url, uploadedAt: meta.timeCreated ? new Date(meta.timeCreated) : null };
    }));
  } catch (err) {
    console.error("Abroad vault list failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function deleteAbroadVaultDocument(path: string): Promise<boolean> {
  const storage = getFirebaseStorage();
  if (!storage) return false;
  try {
    await deleteObject(ref(storage, path));
    return true;
  } catch (err) {
    console.error("Abroad vault delete failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
