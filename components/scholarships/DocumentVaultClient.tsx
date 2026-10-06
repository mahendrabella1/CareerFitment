"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { VAULT_DOC_LABELS, type VaultDocKind, type VaultFile, uploadVaultDocument, listVaultDocuments, deleteVaultDocument } from "@/lib/scholarships/clientVault";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#166534";

export function DocumentVaultClient() {
  const { user } = useAuth();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [uploading, setUploading] = useState<VaultDocKind | null>(null);

  async function refresh(uid: string) {
    setFiles(await listVaultDocuments(uid));
  }

  useEffect(() => {
    if (user?.uid) refresh(user.uid);
  }, [user?.uid]);

  async function onUpload(kind: VaultDocKind, file: File) {
    if (!user?.uid) return;
    setUploading(kind);
    await uploadVaultDocument(user.uid, kind, file);
    await refresh(user.uid);
    setUploading(null);
  }

  async function onDelete(path: string) {
    await deleteVaultDocument(path);
    if (user?.uid) await refresh(user.uid);
  }

  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="lock" eyebrow="Track and prepare" title="Document vault"
        subtitle="Upload each document once, reuse it for every application. Stored privately under your account." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {(Object.keys(VAULT_DOC_LABELS) as VaultDocKind[]).map((kind) => {
          const existing = files.filter((f) => f.kind === kind);
          return (
            <div key={kind} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{VAULT_DOC_LABELS[kind]}</span>
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

      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 18 }}>Documents are shared only when you upload them yourself to an official application portal - this vault never submits anything on your behalf.</p>
    </div>
  );
}
