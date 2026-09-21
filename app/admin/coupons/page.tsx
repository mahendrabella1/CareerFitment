"use client";

/**
 * /admin/coupons — add or remove coupon codes without editing lib/coupons.ts
 * and redeploying. Writes straight to the `coupons` Firestore collection
 * (same pattern as the payment-settings card on /admin: client SDK write,
 * enforced admin-only by firestore.rules) — lib/coupons.ts reads this same
 * collection server-side via the Admin SDK for every price it computes, so a
 * code added here is live on the payment screen immediately, no redeploy.
 *
 * Same strict admin gate as /admin (isAdmin(email), not just "signed in") —
 * unlike /admin/institutional, a coupon page controls real discounts.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isAdmin } from "@/lib/auth/admins";
import { getDb } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";

interface CouponRow {
  id: string;
  code: string;
  percentOff: number;
  auto: boolean;
}

export default function AdminCouponsPage() {
  const { ready, loading, user } = useAuth();
  const admin = isAdmin(user?.email);

  const [rows, setRows] = useState<CouponRow[] | null>(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("10");
  const [auto, setAuto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    const db = getDb();
    if (!db) { setError("Firebase isn't configured on this deployment."); return; }
    try {
      const snap = await getDocs(collection(db, "coupons"));
      setRows(
        snap.docs
          .map((d) => {
            const data = d.data() as { code?: string; percentOff?: number; auto?: boolean };
            return { id: d.id, code: String(data.code || ""), percentOff: Number(data.percentOff) || 0, auto: Boolean(data.auto) };
          })
          .sort((a, b) => a.code.localeCompare(b.code))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load coupons.");
    }
  }

  useEffect(() => {
    if (!admin) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  async function addCoupon(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const db = getDb();
    if (!db) { setError("Firebase isn't configured on this deployment."); return; }

    const normalized = code.trim().toUpperCase();
    const pct = Math.round(Number(percentOff));
    if (!normalized) { setError("Enter a code."); return; }
    if (!Number.isFinite(pct) || pct < 1 || pct > 100) { setError("Percent off must be between 1 and 100."); return; }
    if ((rows ?? []).some((r) => r.code === normalized)) { setError(`${normalized} already exists.`); return; }

    setSaving(true);
    try {
      // Only one coupon auto-applies at a time (lib/coupons.ts takes the
      // first match) — turning this one on turns any other off, so the
      // payment screen never has to guess which one is "the" sale price.
      if (auto) {
        const currentAuto = (rows ?? []).filter((r) => r.auto);
        await Promise.all(currentAuto.map((r) => updateDoc(doc(db, "coupons", r.id), { auto: false })));
      }
      await addDoc(collection(db, "coupons"), {
        code: normalized,
        percentOff: pct,
        auto,
        createdAt: new Date().toISOString(),
        createdBy: user?.email || "admin",
      });
      setCode("");
      setPercentOff("10");
      setAuto(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save — check Firestore admin write rules.");
    } finally {
      setSaving(false);
    }
  }

  async function removeCoupon(row: CouponRow) {
    const db = getDb();
    if (!db) return;
    if (!confirm(`Delete coupon ${row.code}? Any link or poster using this code will stop working immediately.`)) return;
    setDeletingId(row.id);
    try {
      await deleteDoc(doc(db, "coupons", row.id));
      setRows((rs) => (rs ?? []).filter((r) => r.id !== row.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete — check Firestore admin write rules.");
    } finally {
      setDeletingId(null);
    }
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
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.ink3, fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 18 }}>
          <Icon name="chevronLeft" size={15} /> Back to admin
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: "0 0 6px" }}>Coupon codes</h1>
        <p style={{ fontSize: 14, color: C.ink3, margin: "0 0 24px" }}>
          Add or remove codes the payment screen accepts — live immediately, no redeploy. The auto-apply code (if any) is applied for every student without them typing it.
        </p>

        <form onSubmit={addCoupon} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 160px" }}>
            <label style={S.label}>Code</label>
            <input style={S.input} value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SCHOOL50" />
          </div>
          <div style={{ flex: "0 1 120px" }}>
            <label style={S.label}>Percent off</label>
            <input style={S.input} type="number" min={1} max={100} value={percentOff} onChange={(e) => setPercentOff(e.target.value)} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.ink2, paddingBottom: 10 }}>
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
            Apply automatically (no code needed)
          </label>
          <button type="submit" disabled={saving} style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Adding…" : "Add coupon"}
          </button>
        </form>

        {error && <div style={{ background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
          {rows === null ? (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>Loading…</div>
          ) : rows.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>No coupons yet — add one above.</div>
          ) : (
            rows.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.line}` }}>
                <b style={{ fontSize: 14, color: C.ink, letterSpacing: ".02em" }}>{r.code}</b>
                <span style={{ fontSize: 13, color: C.ink3 }}>{r.percentOff}% off</span>
                {r.auto && <span style={{ fontSize: 11, fontWeight: 700, color: C.good, background: C.goodTint, borderRadius: 999, padding: "2px 9px" }}>AUTO-APPLIED</span>}
                <span style={{ flex: 1 }} />
                <button
                  onClick={() => void removeCoupon(r)}
                  disabled={deletingId === r.id}
                  style={{ background: "none", border: "none", color: C.redStrong, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: deletingId === r.id ? 0.5 : 1 }}
                >
                  {deletingId === r.id ? "Deleting…" : "Delete"}
                </button>
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
};

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: C.bg, padding: 20, textAlign: "center" }}>
      {children}
    </div>
  );
}
