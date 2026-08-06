"use client";

/**
 * PaymentGate — shown before the exam when the signed-in user hasn't paid.
 *
 * Prices are never decided here. The gate asks the server what the fee is
 * (/api/payment/status) and what a coupon is worth (/api/payment/coupon), then
 * either opens Razorpay Checkout for a real charge or calls
 * /api/payment/redeem for a code that waives the fee outright. Only a verified
 * success — a signature checked server-side, or a waiver the server priced —
 * fires onPaid(), which is what lets the exam load.
 *
 * The sale runs on two coupons (see lib/coupons.ts):
 *   • OG15 — applied for the student the moment this screen opens, and
 *     announced in a popup so the discount is impossible to miss. It resolves
 *     to the admin's own fee, so the screen and the order can't disagree.
 *   • OGFREE — typed in by hand; the fee drops to ₹0 and there is no Razorpay
 *     order at all.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import type { UserProfile } from "@/lib/auth/AuthProvider";
import { getFirebaseAuth, getDb } from "@/lib/firebase/client";
import { trackEvent } from "@/lib/metaPixel";
import { OFFER, formatPaise, msUntilOfferEnds } from "@/lib/offer";
import OfferBanner from "@/app/OfferBanner";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { Razorpay?: any }
}

/** What /api/payment/coupon hands back — the whole price line, priced server-side. */
interface Priced {
  listPaise: number;
  basePaise: number;
  payablePaise: number;
  savingPaise: number;
  discountPct: number;
  coupon: { code: string; label: string; note: string; percentOff: number; auto: boolean } | null;
  free: boolean;
  invalidCode: boolean;
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** "2d 06h 41m" until the sale ends, or "" once it has passed. */
function formatCountdown(ms: number): string {
  if (ms <= 0) return "";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return d > 0 ? `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`
               : `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export default function PaymentGate({ profile, onPaid }: { profile: UserProfile; onPaid: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(true);

  // Fee comes from the server so the price on screen always matches the amount
  // the order is actually created for (NEXT_PUBLIC_* is frozen at build time).
  const [priced, setPriced] = useState<Priced>({
    listPaise: OFFER.listPaise,
    basePaise: OFFER.salePaise,
    payablePaise: OFFER.salePaise,
    savingPaise: OFFER.listPaise - OFFER.salePaise,
    discountPct: OFFER.discountPct,
    coupon: null,
    free: false,
    invalidCode: false,
  });

  // Coupon box (the hand-typed path — OGFREE and anything added later).
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // The auto-applied-coupon popup. `popupCoupon` is what it announces.
  const [popupCoupon, setPopupCoupon] = useState<Priced | null>(null);

  const [countdown, setCountdown] = useState("");

  // `onPaid` is an inline arrow in the parent, so it is a new function on every
  // parent render. Holding it in a ref lets the effect below depend on nothing
  // and still call the current one.
  //
  // This matters more than it looks. With `onPaid` in the dependency list, a
  // parent re-render tears the effect down mid-flight — the cleanup marks the
  // in-flight request cancelled, and the request then returns without ever
  // clearing `checking`, leaving the student on "Preparing your assessment…"
  // for good. Depending on nothing means the cleanup runs only on a real
  // unmount, which is the only time "cancelled" should mean anything.
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  // Ask the server whether this student should be charged. It says no when an
  // admin has switched payment off in /admin, or when real payment isn't
  // configured (no Razorpay secret) — either way we skip the fee and let the
  // exam load immediately.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // A request that never settles would park the student on the loading
      // card indefinitely. Time it out into the catch below, which treats it
      // the same as any other network failure — because that is what a request
      // that never answers is.
      const abort = new AbortController();
      const timer = window.setTimeout(() => abort.abort(), 15000);
      try {
        const res = await fetch("/api/payment/status", { cache: "no-store", signal: abort.signal });
        const data = await res.json();
        window.clearTimeout(timer);
        if (cancelled) return;
        if (!data?.active) { onPaidRef.current(); return; }

        // Seed the price line from the server's own numbers first, so that even
        // if the coupon call below fails the screen still quotes the admin's fee
        // rather than the fallback compiled into lib/offer.ts.
        const base = Number(data?.amountPaise) || OFFER.salePaise;
        const list = Math.max(Number(data?.offer?.listPaise) || OFFER.listPaise, base);
        setPriced((p) => ({
          ...p,
          listPaise: list,
          basePaise: base,
          payablePaise: base,
          savingPaise: Math.max(0, list - base),
          discountPct: Number(data?.offer?.discountPct) || p.discountPct,
        }));

        // Apply the sale coupon on the student's behalf before showing a price
        // — they should never see the undiscounted number as their total. The
        // code comes from the server, so the campaign lives in one file.
        const autoCode: string | undefined = data?.offer?.autoCoupon?.code;
        const applied = await priceCoupon(autoCode || "");
        if (cancelled) return;
        if (applied) {
          setPriced(applied);
          // Announce it: a discount applied silently reads as "the price is 99"
          // rather than "you just saved 900".
          if (applied.coupon) setPopupCoupon(applied);
        }
        // Whatever the coupon call did, the price line is populated and the
        // student must come out of the loading state. Nothing below this point
        // may return early.
        setChecking(false);
      } catch {
        window.clearTimeout(timer);
        if (!cancelled) onPaidRef.current(); // fail open on a network/misconfig error
      }
    })();
    return () => { cancelled = true; };
    // Mount only — see onPaidRef above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live "ends in" clock. Started in an effect so the server-rendered markup
  // and the first client paint agree (they'd otherwise differ by a second).
  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(msUntilOfferEnds()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  /** Ask the server what a code is worth. Returns null on a transport failure. */
  async function priceCoupon(code: string): Promise<Priced | null> {
    try {
      const res = await fetch("/api/payment/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!data?.success) return null;
      return data as Priced;
    } catch {
      return null;
    }
  }

  async function applyTypedCoupon() {
    const code = couponInput.trim();
    if (!code || couponBusy) return;
    setCouponBusy(true);
    setCouponMsg(null);
    setErr("");
    const result = await priceCoupon(code);
    setCouponBusy(false);
    if (!result) { setCouponMsg({ kind: "err", text: "Couldn't check that code. Please try again." }); return; }
    if (!result.coupon) {
      setCouponMsg({ kind: "err", text: `“${code.toUpperCase()}” isn't a valid coupon code.` });
      return;
    }
    setPriced(result);
    setCouponInput("");
    setCouponMsg({
      kind: "ok",
      text: result.free
        ? `${result.coupon.code} applied — your fee is fully waived.`
        : `${result.coupon.code} applied — you pay ${formatPaise(result.payablePaise)}.`,
    });
    setPopupCoupon(result);
  }

  /** Drop back to the sale price after a hand-typed code is removed. */
  async function clearTypedCoupon() {
    setCouponMsg(null);
    const back = await priceCoupon(OFFER.autoCouponCode);
    if (back) setPriced(back);
  }

  /**
   * Record "paid" under the user. The server has already verified the payment
   * (signature) or the waiver (coupon re-priced server-side) by the time this
   * runs; the write itself needs no admin creds because a user may write their
   * own document per the Firestore rules.
   */
  const markPaid = useCallback(async (fields: Record<string, unknown>) => {
    try {
      const db = getDb();
      const uid = getFirebaseAuth()?.currentUser?.uid;
      if (db && uid) {
        await setDoc(doc(db, "users", uid), {
          paid: true, paymentStatus: "paid", paidAt: new Date().toISOString(), ...fields,
        }, { merge: true });
      }
    } catch { /* verified server-side already — proceed regardless */ }
  }, []);

  /** OGFREE and friends: no Razorpay order exists, so nothing to check out. */
  async function redeemFree() {
    setErr("");
    setBusy(true);
    try {
      const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();
      const res = await fetch("/api/payment/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: priced.coupon?.code,
          idToken,
          profile: {
            name: profile?.name, email: profile?.email, phone: profile?.phone,
            institution: profile?.institution, category: profile?.category, desiredCareer: profile?.desiredCareer,
          },
        }),
      });
      const data = await res.json();
      if (!data?.success) {
        // The fee was switched off while this tab sat open — that isn't an
        // error for the student, it's a free pass.
        if (data?.reason === "payment_disabled") { onPaid(); return; }
        throw new Error(data?.message || "That coupon could not be applied.");
      }
      trackEvent("Purchase", { value: 0, currency: "INR", content_name: `Career Assessment fee (coupon ${priced.coupon?.code})` });
      await markPaid({ paymentId: `COUPON-${priced.coupon?.code}`, couponCode: priced.coupon?.code, amountPaid: 0 });
      onPaid();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  async function pay() {
    if (priced.free) return redeemFree();
    setErr("");
    setBusy(true);
    try {
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok || !window.Razorpay) throw new Error("Couldn't load the payment window. Check your connection and try again.");

      const couponCode = priced.coupon?.code;
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon: couponCode }),
      });
      const order = await orderRes.json();
      if (!order.success) {
        // An admin switched payment off while this tab was open — don't show an
        // error for something that isn't one; just let them into the exam.
        if (order.reason === "payment_disabled") { onPaid(); return; }
        // The code turned out to be a full waiver (e.g. the price changed under
        // us): take the free path rather than failing.
        if (order.reason === "free_coupon") { setBusy(false); return redeemFree(); }
        // Never open Checkout without a valid order — Razorpay would render its
        // own "The api key provided is invalid" screen, which looks to the user
        // like a failed payment on a page that can still take their money.
        if (order.reason === "razorpay_auth_failed") {
          console.error("[payment] Razorpay rejected key", order.keyId, "— Key ID/Secret pair mismatch.");
        }
        throw new Error(order.message || "Couldn't start the payment.");
      }

      const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "OneGrasp",
        description: couponCode ? `Career Assessment fee · ${couponCode}` : "Career Assessment fee",
        image: "/onegrasp-logo-tight.png",
        prefill: { name: profile?.name || "", email: profile?.email || "", contact: profile?.phone || "" },
        theme: { color: "#6366F1" },
        handler: async (resp: any) => {
          try {
            const details = {
              name: profile?.name, email: profile?.email, phone: profile?.phone,
              institution: profile?.institution, category: profile?.category, desiredCareer: profile?.desiredCareer,
            };
            const v = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...resp, idToken, profile: details, coupon: couponCode }),
            });
            const vd = await v.json();
            if (!vd.success) { setErr(vd.message || "Payment could not be verified."); setBusy(false); return; }
            trackEvent("Purchase", { value: order.amount / 100, currency: "INR", content_name: "Career Assessment fee" });
            await markPaid({
              paymentId: vd.paymentId || resp.razorpay_payment_id,
              orderId: resp.razorpay_order_id,
              couponCode: couponCode || null,
              amountPaid: order.amount / 100,
            });
            onPaid();
          } catch {
            setErr("Payment verification failed. If you were charged, contact support@onegrasp.com.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on("payment.failed", (r: any) => { setErr(r?.error?.description || "Payment failed. Please try again."); setBusy(false); });
      rzp.open();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div style={S.page}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="pg-card" style={{ maxWidth: 340 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pg-logo" src="/onegrasp-logo-tight.png" alt="OneGrasp" />
          <p className="pg-sub" style={{ margin: 0 }}>Preparing your assessment…</p>
        </div>
      </div>
    );
  }

  const payLabel = priced.free
    ? "Unlock free & start the assessment"
    : `Pay ${formatPaise(priced.payablePaise)} & start`;

  return (
    <div className="pg-shell">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <OfferBanner />

      <div style={S.page}>
        <div className="pg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pg-logo" src="/onegrasp-logo-tight.png" alt="OneGrasp" />

          {OFFER.active && (
            <div className="pg-ribbon">
              <span className="pg-ribbon-flag">🇮🇳</span>
              <span>{OFFER.name}</span>
              {countdown && <span className="pg-ribbon-time">ends in {countdown}</span>}
            </div>
          )}

          <div className="pg-kicker">One-time assessment fee</div>

          <div className="pg-pricerow">
            {priced.savingPaise > 0 && <span className="pg-was">{formatPaise(priced.listPaise)}</span>}
            <h1 className="pg-price">{priced.free ? "FREE" : formatPaise(priced.payablePaise)}</h1>
            {priced.discountPct > 0 && <span className="pg-off">{priced.discountPct}% OFF</span>}
          </div>
          {priced.savingPaise > 0 && (
            <div className="pg-save">You save {formatPaise(priced.savingPaise)} today</div>
          )}

          {priced.coupon && (
            <div className={`pg-chip${priced.free ? " pg-chip-free" : ""}`}>
              <span className="pg-chip-tick">✓</span>
              <span className="pg-chip-body">
                <b>{priced.coupon.code}</b> applied
                <small>{priced.coupon.note}</small>
              </span>
              {!priced.coupon.auto && (
                <button className="pg-chip-x" onClick={() => void clearTypedCoupon()} aria-label="Remove coupon">✕</button>
              )}
            </div>
          )}

          <p className="pg-sub">Unlock your full psychometric assessment and personalised career report.</p>
          <ul className="pg-list">
            <li>120-question assessment across 8 validated frameworks</li>
            <li>Coherent best-fit career fields &amp; matches</li>
            <li>In-depth report — strengths, growth areas &amp; a plan</li>
            <li>Report emailed to you on completion</li>
          </ul>

          {/* Hand-typed codes. Kept visible even with the sale code applied —
              a student holding OGFREE must have somewhere to put it. */}
          <div className="pg-coupon">
            <label className="pg-coupon-label" htmlFor="pg-coupon-input">Have a coupon code?</label>
            <div className="pg-coupon-row">
              <input
                id="pg-coupon-input"
                className="pg-coupon-input"
                value={couponInput}
                placeholder="Enter code"
                autoCapitalize="characters"
                spellCheck={false}
                disabled={couponBusy || busy}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponMsg(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") void applyTypedCoupon(); }}
              />
              <button className="pg-coupon-btn" disabled={couponBusy || busy || !couponInput.trim()} onClick={() => void applyTypedCoupon()}>
                {couponBusy ? "Checking…" : "Apply"}
              </button>
            </div>
            {couponMsg && <div className={couponMsg.kind === "ok" ? "pg-coupon-ok" : "pg-coupon-err"}>{couponMsg.text}</div>}
          </div>

          {err ? <div className="pg-err">{err}</div> : null}
          <button className="pg-btn" onClick={() => void pay()} disabled={busy}>
            {busy ? (priced.free ? "Unlocking…" : "Opening secure checkout…") : payLabel}
          </button>
          <div className="pg-secure">
            {priced.free ? "🎁 No payment needed · You won’t be charged" : "🔒 Secure payment via Razorpay · You won’t be charged again"}
          </div>
          <a className="pg-back" href="/account">← Back to dashboard</a>
        </div>
      </div>

      {popupCoupon?.coupon && (
        <CouponPopup priced={popupCoupon} countdown={countdown} onClose={() => setPopupCoupon(null)} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ popup */
/**
 * The "your discount is already applied" modal. It opens by itself the first
 * time the gate prices the sale coupon, and again whenever a hand-typed code
 * lands — the moment a price changes is exactly when it's worth interrupting.
 */
function CouponPopup({ priced, countdown, onClose }: { priced: Priced; countdown: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const free = priced.free;
  return (
    <div className="pg-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="pg-modal-title" onClick={onClose}>
      <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pg-modal-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="pg-modal-burst">{free ? "🎁" : "🎉"}</div>
        <div className="pg-modal-kick">{free ? "Coupon applied" : OFFER.name}</div>
        <h2 className="pg-modal-title" id="pg-modal-title">
          {free ? "Your fee is fully waived!" : `Flat ${priced.discountPct}% off — applied for you`}
        </h2>

        <div className="pg-modal-code">
          <span className="pg-modal-code-label">Coupon code</span>
          <span className="pg-modal-code-val">{priced.coupon?.code}</span>
          <span className="pg-modal-code-state">
            {priced.coupon?.auto ? "✓ Applied automatically" : "✓ Applied to your order"}
          </span>
        </div>

        <div className="pg-modal-prices">
          <span className="pg-modal-was">{formatPaise(priced.listPaise)}</span>
          <span className="pg-modal-arrow">→</span>
          <span className="pg-modal-now">{free ? "FREE" : formatPaise(priced.payablePaise)}</span>
        </div>
        <div className="pg-modal-save">You save {formatPaise(priced.savingPaise)}</div>

        {!free && countdown && (
          <div className="pg-modal-timer">⏳ Offer ends in <b>{countdown}</b> ({OFFER.endsOnLabel})</div>
        )}

        <button className="pg-modal-btn" onClick={onClose}>
          {free ? "Start my assessment" : `Continue — pay ${formatPaise(priced.payablePaise)}`}
        </button>
        {!free && <div className="pg-modal-foot">Have another code? Enter it under “Have a coupon code?”</div>}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6fb", padding: 20, fontFamily: "Inter, system-ui, Segoe UI, sans-serif" },
};

const CSS = `
.pg-shell{min-height:100vh;display:flex;flex-direction:column;background:#f5f6fb}
.pg-card{width:100%;max-width:440px;background:#fff;border:1px solid #eceef4;border-radius:20px;padding:30px 32px 34px;
  box-shadow:0 20px 50px rgba(30,27,75,.10);text-align:center}
.pg-logo{height:40px;margin-bottom:14px}

.pg-ribbon{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;
  background:linear-gradient(90deg,#1f2a54,#3b5bdb 55%,#e0242e);color:#fff;border-radius:999px;
  padding:7px 14px;margin:0 0 16px;font-size:12px;font-weight:800;letter-spacing:.02em}
.pg-ribbon-flag{font-size:13px}
.pg-ribbon-time{background:rgba(255,255,255,.18);border-radius:999px;padding:2px 9px;font-weight:700;font-size:11px}

.pg-kicker{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#8a8f9c}
.pg-pricerow{display:flex;align-items:center;justify-content:center;gap:11px;flex-wrap:wrap;margin-top:4px}
.pg-was{font-size:20px;font-weight:700;color:#a2a7b4;text-decoration:line-through;text-decoration-thickness:2px}
.pg-price{font-family:'Plus Jakarta Sans',Inter,sans-serif;font-size:46px;font-weight:800;color:#171624;margin:2px 0 0;letter-spacing:-.02em;line-height:1.05}
.pg-off{background:#e7f8ee;color:#137a45;border:1px solid #c3ecd6;border-radius:8px;padding:4px 9px;font-size:12px;font-weight:800}
.pg-save{font-size:12.5px;font-weight:700;color:#137a45;margin-top:6px}

.pg-chip{display:flex;align-items:center;gap:10px;text-align:left;background:#f2f5ff;border:1px dashed #c3cdf5;
  border-radius:12px;padding:10px 12px;margin:14px 0 0}
.pg-chip-free{background:#eefaf2;border-color:#a9dfc2}
.pg-chip-tick{width:20px;height:20px;flex:none;border-radius:50%;background:#137a45;color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.pg-chip-body{flex:1;min-width:0;font-size:13px;color:#2b3350;line-height:1.35}
.pg-chip-body small{display:block;font-size:11.5px;color:#6f7690;font-weight:500;margin-top:1px}
.pg-chip-x{background:none;border:none;color:#8a8f9c;font-size:13px;cursor:pointer;padding:2px 4px;line-height:1}
.pg-chip-x:hover{color:#171624}

.pg-sub{font-size:14px;color:#5b6070;line-height:1.55;margin:14px 0 18px}
.pg-list{list-style:none;padding:0;margin:0 0 18px;display:flex;flex-direction:column;gap:11px;text-align:left}
.pg-list li{position:relative;padding-left:28px;font-size:13.5px;color:#3d4150;line-height:1.5}
.pg-list li::before{content:"✓";position:absolute;left:0;top:0;width:19px;height:19px;border-radius:50%;background:#eef0ff;color:#6366F1;font-size:12px;font-weight:800;display:grid;place-items:center}

.pg-coupon{text-align:left;border-top:1px solid #f0f1f6;padding-top:16px;margin-bottom:16px}
.pg-coupon-label{display:block;font-size:12px;font-weight:700;color:#5b6070;margin-bottom:7px}
.pg-coupon-row{display:flex;gap:8px}
.pg-coupon-input{flex:1;min-width:0;border:1px solid #dfe3ec;border-radius:10px;padding:11px 12px;font-size:14px;
  font-weight:700;letter-spacing:.06em;text-transform:uppercase;outline:none;font-family:inherit;background:#fbfcfe}
.pg-coupon-input:focus{border-color:#6366F1;box-shadow:0 0 0 3px rgba(99,102,241,.14);background:#fff}
.pg-coupon-btn{flex:none;padding:0 18px;background:#171624;color:#fff;border:none;border-radius:10px;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit}
.pg-coupon-btn:disabled{opacity:.4;cursor:default}
.pg-coupon-ok{font-size:12.5px;font-weight:700;color:#137a45;margin-top:8px}
.pg-coupon-err{font-size:12.5px;font-weight:700;color:#b3261e;margin-top:8px}

.pg-err{background:#fdecec;border:1px solid #f6c9c9;color:#b3261e;font-size:12.5px;font-weight:600;border-radius:10px;padding:10px 12px;margin-bottom:14px;text-align:left}
.pg-btn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;transition:background .15s}
.pg-btn:hover{background:#4f46e5}
.pg-btn:disabled{opacity:.65;cursor:default}
.pg-secure{font-size:11.5px;color:#8a8f9c;margin-top:12px}
.pg-back{display:inline-block;margin-top:16px;font-size:13px;font-weight:700;color:#6b7080;text-decoration:none}
.pg-back:hover{color:#171624}

/* ---- auto-applied coupon popup ---- */
.pg-modal-wrap{position:fixed;inset:0;z-index:1400;background:rgba(16,18,34,.62);backdrop-filter:blur(3px);
  display:flex;align-items:center;justify-content:center;padding:20px;animation:pgFade .22s ease both}
.pg-modal{position:relative;width:100%;max-width:400px;background:#fff;border-radius:22px;padding:30px 28px 26px;
  text-align:center;box-shadow:0 30px 70px rgba(10,12,30,.4);animation:pgPop .34s cubic-bezier(.2,.9,.28,1.06) both;
  font-family:Inter,system-ui,Segoe UI,sans-serif}
.pg-modal-x{position:absolute;top:12px;right:14px;background:none;border:none;font-size:14px;color:#a2a7b4;cursor:pointer;line-height:1}
.pg-modal-x:hover{color:#171624}
.pg-modal-burst{font-size:44px;line-height:1;animation:pgBurst .55s cubic-bezier(.2,.9,.28,1.2) both}
.pg-modal-kick{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#e0242e;margin-top:10px}
.pg-modal-title{font-size:21px;font-weight:800;color:#171624;margin:7px 0 18px;line-height:1.3}
.pg-modal-code{display:flex;flex-direction:column;align-items:center;gap:3px;border:2px dashed #c3cdf5;background:#f5f7ff;border-radius:14px;padding:13px 12px}
.pg-modal-code-label{font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8a8f9c}
.pg-modal-code-val{font-size:24px;font-weight:800;letter-spacing:.12em;color:#3b5bdb;font-family:'Plus Jakarta Sans',Inter,sans-serif}
.pg-modal-code-state{font-size:11.5px;font-weight:700;color:#137a45}
.pg-modal-prices{display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:16px}
.pg-modal-was{font-size:19px;font-weight:700;color:#a2a7b4;text-decoration:line-through;text-decoration-thickness:2px}
.pg-modal-arrow{font-size:15px;color:#a2a7b4}
.pg-modal-now{font-size:32px;font-weight:800;color:#137a45;font-family:'Plus Jakarta Sans',Inter,sans-serif}
.pg-modal-save{font-size:13px;font-weight:700;color:#137a45;margin-top:2px}
.pg-modal-timer{font-size:12px;color:#5b6070;background:#fff6ed;border:1px solid #ffe0c2;border-radius:10px;padding:8px 10px;margin-top:14px}
.pg-modal-btn{width:100%;margin-top:18px;padding:14px;background:#171624;color:#fff;border:none;border-radius:12px;font-size:14.5px;font-weight:800;cursor:pointer;font-family:inherit}
.pg-modal-btn:hover{background:#2b2a3f}
.pg-modal-foot{font-size:11.5px;color:#8a8f9c;margin-top:11px}

@keyframes pgFade{from{opacity:0}to{opacity:1}}
@keyframes pgPop{from{opacity:0;transform:translateY(22px) scale(.94)}to{opacity:1;transform:none}}
@keyframes pgBurst{0%{transform:scale(.3) rotate(-18deg);opacity:0}60%{transform:scale(1.18) rotate(6deg);opacity:1}100%{transform:none;opacity:1}}
@media(prefers-reduced-motion:reduce){.pg-modal,.pg-modal-wrap,.pg-modal-burst{animation:none}}
@media(max-width:420px){.pg-card{padding:24px 20px 28px}.pg-price{font-size:40px}}
`;
