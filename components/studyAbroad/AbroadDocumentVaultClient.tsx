"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ABROAD_VAULT_DOC_LABELS, type AbroadVaultDocKind, type AbroadVaultFile, uploadAbroadVaultDocument, listAbroadVaultDocuments, deleteAbroadVaultDocument } from "@/lib/studyAbroad/clientVault";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";

export function AbroadDocumentVaultClient() {
  const { user } = useAuth();
  const [files, setFiles] = useState<AbroadVaultFile[]>([]);
  const [uploading, setUploading] = useState<AbroadVaultDocKind | null>(null);

  async function refresh(uid: string) {
    setFiles(await listAbroadVaultDocuments(uid));
  }

  useEffect(() => {
    if (user?.uid) refresh(user.uid);
  }, [user?.uid]);

  async function onUpload(kind: AbroadVaultDocKind, file: File) {
    if (!user?.uid) return;
    setUploading(kind);
    await uploadAbroadVaultDocument(user.uid, kind, file);
    await refresh(user.uid);
    setUploading(null);
  }

  async function onDelete(path: string) {
    await deleteAbroadVaultDocument(path);
    if (user?.uid) await refresh(user.uid);
  }

  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="lock" eyebrow="Prepare" title="Document vault" subtitle="Upload each document once, reuse it across applications. Stored privately under your account." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {(Object.keys(ABROAD_VAULT_DOC_LABELS) as AbroadVaultDocKind[]).map((kind) => {
          const existing = files.filter((f) => f.kind === kind);
          return (
            <div key={kind} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{ABROAD_VAULT_DOC_LABELS[kind]}</span>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", background: ACCENT, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>
                  {uploading === kind ? "Uploading…" : existing.length ? "Replace" : "Upload"}
                  <input type="file" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(kind, f); e.target.value = ""; }} />
                </label>
              </div>
              {existing.map((f) => (
                <div key={f.path} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 12 }}>
                  <a href={f.url} target="_blank" rel="noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>View uploaded file ↗</a>
                  <button onClick={() => onDelete(f.path)} style={{ fontSize: 11, color: "#991b1b", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
