"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { VAULT_DOC_LABELS, type VaultDocKind, type VaultFile, uploadVaultDocument, listVaultDocuments, deleteVaultDocument } from "@/lib/scholarships/clientVault";

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
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/scholarships" style={{ color: "#999", textDecoration: "none" }}>← Scholarships</Link>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Document vault</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>Upload each document once, reuse it for every application. Stored privately under your account.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(Object.keys(VAULT_DOC_LABELS) as VaultDocKind[]).map((kind) => {
          const existing = files.filter((f) => f.kind === kind);
          return (
            <div key={kind} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px" }}>
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
