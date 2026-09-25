"use client";

/**
 * /admin/archives - students an admin has archived (always students who'd
 * already completed their assessment - see the Archive button on the main
 * Users table, which only appears once latestAssessment exists). Archiving
 * doesn't delete anything; it just blocks their own /account login (see
 * app/account/page.tsx's `profile.archived` check) until an admin restores
 * them from here. Same load/write pattern as the Users table: client SDK,
 * enforced admin-only by firestore.rules.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { type UserProfile } from "@/lib/auth/AuthProvider";
import { getDb } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import { S as SHARED } from "../../adminShared";

export default function AdminArchivesPage() {
  const [rows, setRows] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState("");
  const [restoring, setRestoring] = useState<string | null>(null);

  async function load() {
    const db = getDb();
    if (!db) { setError("Firebase isn't configured on this deployment."); return; }
    try {
      const snap = await getDocs(collection(db, "users"));
      setRows(snap.docs.map((d) => d.data() as UserProfile).filter((u) => u.archived));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load archived users.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function restoreUser(u: UserProfile) {
    const db = getDb();
    if (!db) return;
    setRestoring(u.uid);
    try {
      await updateDoc(doc(db, "users", u.uid), { archived: false });
      setRows((rs) => (rs ?? []).filter((r) => r.uid !== u.uid));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore this user - check Firestore admin write rules.");
    } finally {
      setRestoring(null);
    }
  }

  const archivedDate = (u: UserProfile) => {
    if (!u.archivedAt) return "-";
    try { return new Date(u.archivedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return "-"; }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: "0 0 6px" }}>Archives</h1>
      <p style={{ fontSize: 14, color: C.ink3, margin: "0 0 24px" }}>
        Archived students can&apos;t sign in to their dashboard - they see a &ldquo;revoked, contact the administrator&rdquo; message instead. Nothing is deleted; restore a profile any time to give it back.
      </p>

      {error && <div style={SHARED.error}>{error}</div>}

      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
        {rows === null ? (
          <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>Loading…</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>No archived profiles.</div>
        ) : (
          rows.map((u) => (
            <div key={u.uid} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: `1px solid ${C.line}`, flexWrap: "wrap" }}>
              <div style={{ minWidth: 160 }}>
                <b style={{ fontSize: 14, color: C.ink }}>{u.name || "-"}</b>
                <div style={{ fontSize: 12.5, color: C.ink3 }}>{u.email || "-"}</div>
              </div>
              <span style={{ fontSize: 12.5, color: C.muted }}>{u.institution || "-"}</span>
              <span style={{ fontSize: 12, color: C.muted }}>Archived {archivedDate(u)}</span>
              <span style={{ flex: 1 }} />
              <Link href={`/admin/report/${u.uid}`} target="_blank" rel="noopener noreferrer" style={SHARED.sendBtn}>
                <Icon name="explain" size={13} /> View report
              </Link>
              <button
                onClick={() => void restoreUser(u)}
                disabled={restoring === u.uid}
                style={{ ...S.restoreBtn, opacity: restoring === u.uid ? 0.6 : 1 }}
              >
                {restoring === u.uid ? "Restoring…" : "Restore"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  restoreBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: C.ink, color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
};
