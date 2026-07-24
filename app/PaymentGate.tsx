"use client";

/**
 * PaymentGate — shown before the exam when the signed-in user hasn't paid.
 * Loads Razorpay Checkout on demand, creates an order server-side, opens the
 * payment window, then verifies the signature server-side. Only on a verified
 * success does onPaid() fire (which lets the exam load).
 */

import { useState } from "react";
import type { UserProfile } from "@/lib/auth/AuthProvider";
import { getFirebaseAuth } from "@/lib/firebase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { Razorpay?: any }
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

export default function PaymentGate({ profile, onPaid }: { profile: UserProfile; onPaid: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pay() {
    setErr("");
    setBusy(true);
    try {
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok || !window.Razorpay) throw new Error("Couldn't load the payment window. Check your connection and try again.");

      const orderRes = await fetch("/api/payment/order", { method: "POST" });
      const order = await orderRes.json();
      if (!order.success) throw new Error(order.message || "Couldn't start the payment.");

      const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "OneGrasp",
        description: "Career Assessment fee",
        image: "/onegrasp-logo-tight.png",
        prefill: { name: profile?.name || "", email: profile?.email || "", contact: profile?.phone || "" },
        theme: { color: "#6366F1" },
        handler: async (resp: any) => {
          try {
            const v = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...resp, idToken }),
            });
            const vd = await v.json();
            if (vd.success) onPaid();
            else { setErr(vd.message || "Payment could not be verified."); setBusy(false); }
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

  const amount = Number(process.env.NEXT_PUBLIC_RAZORPAY_AMOUNT_PAISE || 100) / 100;

  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pg-logo" src="/onegrasp-logo-tight.png" alt="OneGrasp" />
        <div className="pg-kicker">One-time assessment fee</div>
        <h1 className="pg-price">₹{amount % 1 === 0 ? amount : amount.toFixed(2)}</h1>
        <p className="pg-sub">Unlock your full psychometric assessment and personalised career report.</p>
        <ul className="pg-list">
          <li>120-question assessment across 8 validated frameworks</li>
          <li>Coherent best-fit career fields &amp; matches</li>
          <li>In-depth report — strengths, growth areas &amp; a plan</li>
          <li>Report emailed to you on completion</li>
        </ul>
        {err ? <div className="pg-err">{err}</div> : null}
        <button className="pg-btn" onClick={pay} disabled={busy}>
          {busy ? "Opening secure checkout…" : `Pay ₹${amount % 1 === 0 ? amount : amount.toFixed(2)} & start`}
        </button>
        <div className="pg-secure">🔒 Secure payment via Razorpay · You won&apos;t be charged again</div>
        <a className="pg-back" href="/account">← Back to dashboard</a>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6fb", padding: 20, fontFamily: "Inter, system-ui, Segoe UI, sans-serif" },
};

const CSS = `
.pg-card{width:100%;max-width:440px;background:#fff;border:1px solid #eceef4;border-radius:20px;padding:34px 32px;
  box-shadow:0 20px 50px rgba(30,27,75,.10);text-align:center}
.pg-logo{height:40px;margin-bottom:16px}
.pg-kicker{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#8a8f9c}
.pg-price{font-family:'Plus Jakarta Sans',Inter,sans-serif;font-size:46px;font-weight:800;color:#171624;margin:6px 0 0;letter-spacing:-.02em}
.pg-sub{font-size:14px;color:#5b6070;line-height:1.55;margin:8px 0 20px}
.pg-list{list-style:none;padding:0;margin:0 0 22px;display:flex;flex-direction:column;gap:11px;text-align:left}
.pg-list li{position:relative;padding-left:28px;font-size:13.5px;color:#3d4150;line-height:1.5}
.pg-list li::before{content:"✓";position:absolute;left:0;top:0;width:19px;height:19px;border-radius:50%;background:#eef0ff;color:#6366F1;font-size:12px;font-weight:800;display:grid;place-items:center}
.pg-err{background:#fdecec;border:1px solid #f6c9c9;color:#b3261e;font-size:12.5px;font-weight:600;border-radius:10px;padding:10px 12px;margin-bottom:14px;text-align:left}
.pg-btn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;transition:background .15s}
.pg-btn:hover{background:#4f46e5}
.pg-btn:disabled{opacity:.65;cursor:default}
.pg-secure{font-size:11.5px;color:#8a8f9c;margin-top:12px}
.pg-back{display:inline-block;margin-top:16px;font-size:13px;font-weight:700;color:#6b7080;text-decoration:none}
.pg-back:hover{color:#171624}
`;
