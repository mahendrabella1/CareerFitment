"use client";

/**
 * Document vault - Firebase Storage, under storagePath
 * `scholarshipVault/{uid}/{docKind}-{timestamp}-{filename}`. New
 * infrastructure (see lib/firebase/client.ts's getFirebaseStorage() doc
 * comment) - genuinely private only once Storage security rules are set
 * on the Firebase console to restrict each uid's folder to its own user;
 * this client code enforces nothing on its own, same as Firestore.
 */
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";

export type VaultDocKind =
  | "aadhaar" | "income_certificate" | "caste_certificate" | "domicile_certificate"
  | "marksheet_10" | "marksheet_12" | "admission_proof" | "fee_receipt" | "bank_passbook" | "photo";

export const VAULT_DOC_LABELS: Record<VaultDocKind, string> = {
  aadhaar: "Aadhaar", income_certificate: "Income certificate", caste_certificate: "Caste/community/disability certificate",
  domicile_certificate: "Domicile certificate", marksheet_10: "Class 10 marksheet", marksheet_12: "Class 12 marksheet",
  admission_proof: "Admission/bonafide proof", fee_receipt: "Fee receipt", bank_passbook: "Bank passbook (Aadhaar-seeded)", photo: "Photo",
};

export interface VaultFile {
  path: string;
  kind: string;
  name: string;
  url: string;
  uploadedAt: Date | null;
}

export async function uploadVaultDocument(uid: string, kind: VaultDocKind, file: File): Promise<boolean> {
  const storage = getFirebaseStorage();
  if (!storage) return false;
  const path = `scholarshipVault/${uid}/${kind}-${Date.now()}-${file.name}`;
  try {
    await uploadBytes(ref(storage, path), file);
    return true;
  } catch (err) {
    console.error("Vault upload failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function listVaultDocuments(uid: string): Promise<VaultFile[]> {
  const storage = getFirebaseStorage();
  if (!storage) return [];
  try {
    const folder = ref(storage, `scholarshipVault/${uid}`);
    const res = await listAll(folder);
    const files = await Promise.all(res.items.map(async (item) => {
      const [url, meta] = await Promise.all([getDownloadURL(item), getMetadata(item)]);
      const kind = item.name.split("-")[0];
      return { path: item.fullPath, kind, name: item.name, url, uploadedAt: meta.timeCreated ? new Date(meta.timeCreated) : null };
    }));
    return files;
  } catch (err) {
    console.error("Vault list failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function deleteVaultDocument(path: string): Promise<boolean> {
  const storage = getFirebaseStorage();
  if (!storage) return false;
  try {
    await deleteObject(ref(storage, path));
    return true;
  } catch (err) {
    console.error("Vault delete failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
