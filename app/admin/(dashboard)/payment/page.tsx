"use client";

/**
 * /admin/payment - the assessment fee on/off + price toggle. Extracted from
 * the old single-file /admin page as its own dashboard section. Auth is
 * handled by the parent app/admin/layout.tsx.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import { OFFER, formatPaise } from "@/lib/offer";
import { S as SHARED, useAdminAuth } from "../../adminShared";

export default function AdminPaymentPage() {
  const { email } = useAdminAuth();

  // Loaded from /api/payment/status rather than read straight out of Firestore,
  // because that endpoint reports what the SERVER will actually do - including
  // whether Razorpay credentials exist and whether the toggle is even reaching
  // it. Saving writes the doc, then re-reads the endpoint to confirm.
  const [payEnabled, setPayEnabled] = useState(true);
  const [payPrice, setPayPrice] = useState(""); // rupees, as typed
  const [payLoaded, setPayLoaded] = useState(false);
  const [paySaving, setPaySaving] = useState(false);
  const [payMsg, setPayMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [payConfigured, setPayConfigured] = useState(true); // Razorpay secret present
  const [paySource, setPaySource] = useState<"firestore" | "env">("firestore");
  const [payForcedOff, setPayForcedOff] = useState(false); // code-level kill switch

  async function loadPaymentSettings() {
    try {
      const res = await fetch("/api/payment/status", { cache: "no-store" });
      const d = await res.json();
      setPayEnabled(d?.enabled !== false);
      setPayPrice(String((Number(d?.amountPaise) || 4900) / 100));
      setPayConfigured(Boolean(d?.configured));
      setPaySource(d?.settingsSource === "env" ? "env" : "firestore");
      setPayForcedOff(Boolean(d?.forcedOff));
    } catch {
      setPayMsg({ kind: "err", text: "Couldn't read the current payment settings." });
    } finally {
      setPayLoaded(true);
    }
  }

  async function savePaymentSettings() {
    const rupees = Number(payPrice);
    if (!Number.isFinite(rupees) || rupees < 1 || rupees > 100000) {
      setPayMsg({ kind: "err", text: "Enter a price between ₹1 and ₹1,00,000." });
      return;
    }
    const db = getDb();
    if (!db) { setPayMsg({ kind: "err", text: "Firebase isn't configured on this deployment." }); return; }
    setPaySaving(true);
    setPayMsg(null);
    try {
      await setDoc(
        doc(db, "settings", "payment"),
        {
          enabled: payEnabled,
          amountPaise: Math.round(rupees * 100),
          updatedAt: new Date().toISOString(),
          updatedBy: email || "admin",
        },
        { merge: true }
      );
      // Confirm the server sees the change - a write that Firestore accepted but
      // the server can't read back would silently leave the old price live.
      await loadPaymentSettings();
      setPayMsg({
        kind: "ok",
        text: payEnabled
          ? `Saved - students are charged ₹${rupees % 1 === 0 ? rupees : rupees.toFixed(2)} before the exam.`
          : "Saved - payment is off. Students go straight to the exam.",
      });
    } catch (e) {
      setPayMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Could not save - check Firestore admin write rules.",
      });
    } finally {
      setPaySaving(false);
    }
  }

  useEffect(() => {
    void loadPaymentSettings();
  }, []);

  return (
    <section style={S.payCard} className="og-adm-pay">
      <div style={S.payHead}>
        <span style={S.payIcon}><Icon name="card" size={18} /></span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={S.payTitle}>Assessment payment</div>
          <p style={S.paySub}>
            When this is on, students pay the fee below before the exam opens. Turn it off and
            they go straight into the exam - no payment screen at all.
          </p>
        </div>
        <label style={S.toggleWrap}>
          <span style={{ ...S.toggleLabel, color: payEnabled ? C.ink : C.muted }}>
            {payEnabled ? "Payment on" : "Payment off"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={payEnabled}
            aria-label="Enable payment"
            disabled={!payLoaded || paySaving}
            onClick={() => { setPayEnabled((v) => !v); setPayMsg(null); }}
            style={{ ...S.toggle, ...(payEnabled ? S.toggleOn : {}), ...(payLoaded ? {} : { opacity: 0.5 }) }}
          >
            <span style={{ ...S.toggleKnob, ...(payEnabled ? S.toggleKnobOn : {}) }} />
          </button>
        </label>
      </div>

      <div style={S.payRow}>
        <div>
          <label style={S.payLabel} htmlFor="og-price">Price (₹)</label>
          <div style={S.priceWrap}>
            <span style={S.pricePrefix}>₹</span>
            <input
              id="og-price"
              style={{ ...S.priceInput, ...(payEnabled ? {} : { color: C.muted }) }}
              type="number" min={1} max={100000} step="1" inputMode="decimal"
              value={payPrice}
              disabled={!payLoaded || paySaving}
              onChange={(e) => { setPayPrice(e.target.value); setPayMsg(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") void savePaymentSettings(); }}
            />
          </div>
        </div>
        <button
          style={{ ...S.paySave, ...(paySaving || !payLoaded ? { opacity: 0.6, cursor: "default" } : {}) }}
          disabled={paySaving || !payLoaded}
          onClick={() => void savePaymentSettings()}
        >
          {paySaving ? "Saving…" : "Save changes"}
        </button>
        <div style={S.payState} data-pay-state>
          {!payLoaded ? (
            <span style={S.payNote}>Loading current settings…</span>
          ) : payEnabled && payConfigured ? (
            <span style={{ ...SHARED.pill, ...SHARED.pillOk }}>
              <span style={{ ...SHARED.dot, background: C.good }} /> Live - students are charged
            </span>
          ) : (
            <span style={{ ...SHARED.pill, ...SHARED.pillWait }}>
              <span style={{ ...SHARED.dot, background: C.muted }} /> Free - exam opens without payment
            </span>
          )}
        </div>
      </div>

      {payMsg && (
        <div style={payMsg.kind === "ok" ? S.payOk : SHARED.error}>
          <Icon name={payMsg.kind === "ok" ? "check" : "info"} size={15} /> {payMsg.text}
        </div>
      )}
      {/* Kill switch is on - say so, or this whole card looks broken. */}
      {payLoaded && payForcedOff && (
        <div style={S.payWarn}>
          <Icon name="info" size={15} style={{ flex: "none", marginTop: 1 }} />
          <span>
            Payment is switched off in the code for everyone, so this toggle has no effect
            right now and nobody is being charged. To hand control back to this switch, set
            <b> FORCE_PAYMENT_OFF</b> to <b>false</b> in <b>lib/paymentSettings.ts</b> and redeploy.
          </span>
        </div>
      )}
      {/* The message goes in a single <span>: this row is a flex container,
          so a bare <b> would become its own flex item and get pushed away
          from the surrounding words by the row's gap. */}
      {payLoaded && payEnabled && !payConfigured && (
        <div style={S.payWarn}>
          <Icon name="info" size={15} style={{ flex: "none", marginTop: 1 }} />
          <span>
            Payment is switched on, but no Razorpay key secret is set on this deployment -
            students still get in free. Add <b>RAZORPAY_KEY_SECRET</b> to the host environment
            to start charging.
          </span>
        </div>
      )}
      {/* Not shown while forced off: the kill switch returns before the
          Firestore read, so "env" there says nothing about connectivity. */}
      {payLoaded && paySource === "env" && !payForcedOff && (
        <div style={S.payWarn}>
          <Icon name="info" size={15} style={{ flex: "none", marginTop: 1 }} />
          <span>
            The server can&apos;t reach Firestore, so it&apos;s falling back to the environment
            variables and this switch won&apos;t take effect. Add the Firebase admin credentials
            (<b>serviceAccountKey.json</b> or the <b>FIREBASE_*</b> env vars) on the server.
          </span>
        </div>
      )}

      {/* The sale banner/list-price copy is still a code constant
          (lib/offer.ts) - read-only here. The actual coupon codes
          themselves are no longer code constants; they're managed on
          their own page (Firestore-backed, live immediately). */}
      {payLoaded && payEnabled && (
        <div style={S.payOffer}>
          <div style={S.payOfferHead}>
            <span style={{ ...SHARED.pill, ...SHARED.pillOk }}>
              <span style={{ ...SHARED.dot, background: C.good }} /> {OFFER.active ? "Sale running" : "Sale off"}
            </span>
            <b style={{ fontSize: 13 }}>{OFFER.name}</b>
            <span style={{ fontSize: 12, color: C.muted }}>ends {OFFER.endsOnLabel}</span>
          </div>
          <div style={S.payOfferRow}>
            <span>Shown as</span>
            <b><s style={{ color: C.muted, fontWeight: 600 }}>{formatPaise(OFFER.listPaise)}</s> → {payPrice ? `₹${payPrice}` : formatPaise(OFFER.salePaise)}</b>
          </div>
          <div style={{ ...S.payNote, marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <span>Sale name/price above is still a code constant (lib/offer.ts). Free-code uses are logged to the <b>couponRedemptions</b> collection.</span>
            <span style={{ display: "flex", gap: 14, flex: "none" }}>
              <Link href="/admin/coupons" style={{ color: C.red, fontWeight: 700, whiteSpace: "nowrap" }}>Manage coupon codes →</Link>
              <Link href="/admin/institutional" style={{ color: C.red, fontWeight: 700, whiteSpace: "nowrap" }}>Manage institutional links →</Link>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

const S: Record<string, React.CSSProperties> = {
  payCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  payHead: { display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  payIcon: { width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", background: C.redTint, color: C.red, flex: "none" },
  payTitle: { fontSize: 15.5, fontWeight: 800, color: C.ink },
  paySub: { fontSize: 13, color: C.ink3, margin: "5px 0 0", maxWidth: "62ch", lineHeight: 1.55 },
  toggleWrap: { display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", flex: "none" },
  toggleLabel: { fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" },
  toggle: { position: "relative", width: 46, height: 26, borderRadius: 999, border: `1px solid ${C.line}`, background: C.line2, cursor: "pointer", padding: 0, transition: "background .15s, border-color .15s", flex: "none" },
  toggleOn: { background: C.good, borderColor: C.good },
  toggleKnob: { position: "absolute", top: 2, left: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(20,20,25,.25)", transition: "transform .15s", display: "block" },
  toggleKnobOn: { transform: "translateX(20px)" },
  payRow: { display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginTop: 18 },
  payLabel: { display: "block", fontSize: 12, fontWeight: 700, color: C.ink2, marginBottom: 6 },
  priceWrap: { display: "flex", alignItems: "stretch", border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", background: "#fff" },
  pricePrefix: { display: "grid", placeItems: "center", padding: "0 11px", background: C.line2, color: C.ink3, fontSize: 14, fontWeight: 700, borderRight: `1px solid ${C.line}` },
  priceInput: { width: 120, padding: "9px 12px", border: "none", outline: "none", fontSize: 14.5, fontWeight: 700, color: C.ink, fontFamily: "inherit" },
  paySave: { padding: "10px 18px", background: C.red, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  payState: { marginLeft: "auto", paddingBottom: 2 },
  payNote: { fontSize: 12.5, color: C.muted, fontWeight: 600 },
  payOk: { display: "flex", alignItems: "center", gap: 8, background: C.goodTint, border: "1px solid #cbe8db", color: "#1f7a55", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginTop: 14, fontWeight: 600 },
  payWarn: { display: "flex", alignItems: "flex-start", gap: 8, background: "#fff8e8", border: "1px solid #f2e0b5", color: "#8a6516", padding: "10px 14px", borderRadius: 10, fontSize: 12.5, marginTop: 12, lineHeight: 1.5, fontWeight: 600 },
  payOffer: { background: "#fbfcff", border: `1px dashed ${C.line}`, borderRadius: 12, padding: "13px 15px", marginTop: 14 },
  payOfferHead: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 },
  payOfferRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "7px 0", borderTop: `1px solid ${C.line}`, fontSize: 12.5, color: C.muted, lineHeight: 1.45 },
};
