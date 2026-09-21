"use client";

/**
 * /admin/institutional — create and manage school signup links. A link is
 * just {origin}/register?ref={code}: a student who registers through it goes
 * through the EXACT same signup/assessment flow as anyone else, tagged with
 * this school's name (the existing, working `institution` field on their
 * profile — already filterable on the main /admin user table, so there's no
 * separate reporting view here) — the only difference is their fee is
 * automatically waived (see app/api/institutional/redeem/route.ts).
 *
 * Same strict admin gate as /admin and /admin/coupons (isAdmin(email), not
 * just "signed in") — this collection holds school contact details and
 * directly controls fee-waiver access.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isAdmin } from "@/lib/auth/admins";
import { getDb } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import type { InstitutionalLink } from "@/lib/types/institutional";

function generateLinkCode(schoolName: string): string {
  const slug = schoolName.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 16) || "SCHOOL";
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${slug}-${random}`;
}

export default function AdminInstitutionalPage() {
  const { ready, loading, user } = useAuth();
  const admin = isAdmin(user?.email);

  const [rows, setRows] = useState<InstitutionalLink[] | null>(null);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({ schoolName: "", contactPersonName: "", contactPersonEmail: "", contactPersonPhone: "", expiresAt: "", maxStudents: "", notes: "" });

  async function load() {
    const db = getDb();
    if (!db) { setError("Firebase isn't configured on this deployment."); return; }
    try {
      const snap = await getDocs(collection(db, "institutional_links"));
      setRows(
        snap.docs
          .map((d) => ({ ...(d.data() as InstitutionalLink), code: d.id }))
          .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load institutional links.");
    }
  }

  useEffect(() => {
    if (!admin) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  async function createLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const db = getDb();
    if (!db) { setError("Firebase isn't configured on this deployment."); return; }

    const schoolName = f.schoolName.trim();
    if (!schoolName) { setError("Enter a school name."); return; }
    const maxStudents = f.maxStudents.trim() ? Math.max(1, Math.round(Number(f.maxStudents))) : null;
    if (f.maxStudents.trim() && !Number.isFinite(maxStudents)) { setError("Max students must be a number."); return; }

    let code = generateLinkCode(schoolName);
    // Vanishingly unlikely to collide (school-name slug + 4 random chars),
    // but the code is the doc ID, so a collision would silently overwrite an
    // existing link — check once and re-roll if it happens.
    if ((rows ?? []).some((r) => r.code === code)) code = generateLinkCode(schoolName);

    setSaving(true);
    try {
      const link: InstitutionalLink = {
        code,
        schoolName,
        contactPersonName: f.contactPersonName.trim() || undefined,
        contactPersonEmail: f.contactPersonEmail.trim() || undefined,
        contactPersonPhone: f.contactPersonPhone.trim() || undefined,
        notes: f.notes.trim() || undefined,
        expiresAt: f.expiresAt ? new Date(f.expiresAt).toISOString() : null,
        maxStudents,
        usedCount: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        createdBy: user?.email || "admin",
      };
      await setDoc(doc(db, "institutional_links", code), link);
      setRows((rs) => [link, ...(rs ?? [])]);
      setF({ schoolName: "", contactPersonName: "", contactPersonEmail: "", contactPersonPhone: "", expiresAt: "", maxStudents: "", notes: "" });
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save — check Firestore admin write rules.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(link: InstitutionalLink) {
    const db = getDb();
    if (!db) return;
    const next = link.status === "active" ? "inactive" : "active";
    try {
      await updateDoc(doc(db, "institutional_links", link.code), { status: next });
      setRows((rs) => (rs ?? []).map((r) => (r.code === link.code ? { ...r, status: next } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update — check Firestore admin write rules.");
    }
  }

  function copyLink(code: string) {
    const url = `${window.location.origin}/register?ref=${code}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 2000);
  }

  if (!ready) return <Center>Accounts aren&apos;t configured on this deployment yet.</Center>;
  if (loading) return <Center>Loading…</Center>;
  if (!user || !admin) {
    return (
      <Center>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 12 }}>
          {user ? <>Signed in as <b>{user.email}</b>, which isn&apos;t an admin account.</> : "Sign in required."}
        </p>
        <Link href="/admin" style={{ color: C.red, fontWeight: 700, fontSize: 14 }}>Go to /admin to sign in →</Link>
      </Center>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "32px 20px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.ink3, fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 18 }}>
          <Icon name="chevronLeft" size={15} /> Back to admin
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: "0 0 6px" }}>Institutional links</h1>
        <p style={{ fontSize: 14, color: C.ink3, margin: "0 0 24px" }}>
          A student who registers through a school&apos;s link goes through the exact same signup and assessment as anyone else — just with the fee waived. They show up in the main user table, filterable by school, same as always.
        </p>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} style={{ ...S.btn, marginBottom: 24 }}>+ New school link</button>
        ) : (
          <form onSubmit={createLink} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="og-inst-grid">
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={S.label}>School name</label>
                <input style={S.input} value={f.schoolName} onChange={(e) => setF((p) => ({ ...p, schoolName: e.target.value }))} placeholder="e.g. Sri Venkateswara EM High School" />
              </div>
              <div>
                <label style={S.label}>Contact person (optional)</label>
                <input style={S.input} value={f.contactPersonName} onChange={(e) => setF((p) => ({ ...p, contactPersonName: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Contact email (optional)</label>
                <input style={S.input} type="email" value={f.contactPersonEmail} onChange={(e) => setF((p) => ({ ...p, contactPersonEmail: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Contact phone (optional)</label>
                <input style={S.input} value={f.contactPersonPhone} onChange={(e) => setF((p) => ({ ...p, contactPersonPhone: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Max students (optional)</label>
                <input style={S.input} type="number" min={1} value={f.maxStudents} onChange={(e) => setF((p) => ({ ...p, maxStudents: e.target.value }))} placeholder="No limit if empty" />
              </div>
              <div>
                <label style={S.label}>Expires on (optional)</label>
                <input style={S.input} type="date" value={f.expiresAt} onChange={(e) => setF((p) => ({ ...p, expiresAt: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={S.label}>Notes (optional)</label>
                <input style={S.input} value={f.notes} onChange={(e) => setF((p) => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={saving} style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}>{saving ? "Creating…" : "Create link"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={S.ghostBtn}>Cancel</button>
            </div>
          </form>
        )}

        {error && <div style={{ background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
          {rows === null ? (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>Loading…</div>
          ) : rows.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>No institutional links yet — create one above.</div>
          ) : (
            rows.map((r) => (
              <div key={r.code} style={{ padding: "14px 18px", borderBottom: `1px solid ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <b style={{ fontSize: 14, color: C.ink }}>{r.schoolName}</b>
                  <span style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "2px 9px", ...(r.status === "active" ? { color: C.good, background: C.goodTint } : { color: C.muted, background: C.line2 }) }}>
                    {r.status === "active" ? "ACTIVE" : "INACTIVE"}
                  </span>
                  <span style={{ fontSize: 12.5, color: C.ink3 }}>{r.usedCount}/{r.maxStudents ?? "∞"} students</span>
                  {r.expiresAt && <span style={{ fontSize: 12.5, color: C.ink3 }}>expires {new Date(r.expiresAt).toLocaleDateString()}</span>}
                  <span style={{ flex: 1 }} />
                  <button onClick={() => copyLink(r.code)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 8, padding: "5px 11px", fontSize: 12.5, fontWeight: 700, color: C.ink2, cursor: "pointer" }}>
                    {copiedCode === r.code ? "Copied ✓" : "Copy link"}
                  </button>
                  <button onClick={() => void toggleStatus(r)} style={{ background: "none", border: "none", fontSize: 12.5, fontWeight: 700, color: r.status === "active" ? C.redStrong : C.good, cursor: "pointer" }}>
                    {r.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 4, fontFamily: "monospace" }}>{r.code}</div>
                {(r.contactPersonName || r.contactPersonEmail || r.contactPersonPhone) && (
                  <div style={{ fontSize: 12, color: C.ink3, marginTop: 4 }}>
                    {[r.contactPersonName, r.contactPersonEmail, r.contactPersonPhone].filter(Boolean).join(" · ")}
                  </div>
                )}
                {r.notes && <div style={{ fontSize: 12, color: C.ink3, marginTop: 4 }}>{r.notes}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  label: { display: "block", fontSize: 12, fontWeight: 700, color: C.ink3, marginBottom: 6 },
  input: { width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 12px", fontSize: 14, color: C.ink },
  btn: { background: C.red, color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  ghostBtn: { background: "none", border: `1px solid ${C.line}`, color: C.ink2, borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
};

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: C.bg, padding: 20, textAlign: "center" }}>
      {children}
    </div>
  );
}
