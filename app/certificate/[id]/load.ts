import { cache } from "react";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { readCertificate } from "@/lib/certificates/server";
import type { CertRecord } from "@/lib/certificates/catalog";

export type Loaded = { state: "ok"; cert: CertRecord } | { state: "missing" } | { state: "offline" };

/** One certificate for the public page, its metadata and its preview image (read once per request). */
export const loadCertificate = cache(async (id: string): Promise<Loaded> => {
  if (!isFirestoreConfigured()) return { state: "offline" };
  try {
    const cert = await readCertificate(await getFirestore(), id);
    return cert ? { state: "ok", cert } : { state: "missing" };
  } catch (e) {
    console.error("[certificate]", e instanceof Error ? e.message : e);
    return { state: "offline" };
  }
});
