"use client";

/**
 * OfferBanner — the scrolling sale ribbon that sits at the very top of every
 * public page (landing, register, sign-in, payment).
 *
 * It marquees rather than sits still because it has four things to say and one
 * line to say them in: the campaign, the price drop, the auto-applied code and
 * the deadline. The track is rendered twice and translated by exactly -50%, so
 * the loop meets itself seamlessly with no gap at the wrap point.
 *
 * Renders nothing at all when the sale is off (`OFFER.active === false`), so
 * ending the campaign is a one-line change in lib/offer.ts, not a hunt through
 * every page that mounts this.
 */

import { useEffect, useState } from "react";
import { OFFER, offerIsLive, formatPaise, discountPctBetween } from "@/lib/offer";

export default function OfferBanner() {
  // Start from the copy in lib/offer.ts so the first paint is correct even
  // before (or without) a round-trip, then correct it against the price the
  // server will actually charge — an admin who changes the fee in /admin must
  // not leave the banner quoting yesterday's number.
  const [salePaise, setSalePaise] = useState<number>(OFFER.salePaise);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/payment/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const n = Number(d?.amountPaise);
        if (!cancelled && Number.isFinite(n) && n > 0) setSalePaise(n);
      })
      .catch(() => { /* marketing copy — the fallback above is good enough */ });
    return () => { cancelled = true; };
  }, []);

  if (!offerIsLive()) return null;

  const pct = discountPctBetween(OFFER.listPaise, salePaise);
  const items = [
    `🇮🇳 ${OFFER.name} is LIVE`,
    `Flat ${pct}% OFF — was ${formatPaise(OFFER.listPaise)}, now ${formatPaise(salePaise)}`,
    `Coupon ${OFFER.autoCouponCode} applied automatically at checkout`,
    `Offer ends ${OFFER.endsOnLabel} — start your career assessment today`,
  ];

  // One "track" = the full list. Two identical tracks scroll as one strip.
  const track = (
    <div className="ogb-track" aria-hidden="false">
      {items.map((t, i) => (
        <span className="ogb-item" key={i}>
          <span className="ogb-dot" />
          {t}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ogb" role="region" aria-label={`${OFFER.name} offer`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ogb-mask">
        {track}
        {/* Duplicate copy: what scrolls off the left is already on screen at
            the right, so the strip never shows a seam. Hidden from screen
            readers — the first copy already announced everything. */}
        <div className="ogb-track" aria-hidden="true">
          {items.map((t, i) => (
            <span className="ogb-item" key={`d${i}`}>
              <span className="ogb-dot" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ogb{position:relative;overflow:hidden;background:linear-gradient(90deg,#0f172a,#1f2a54 35%,#3b5bdb 70%,#e0242e);
  color:#fff;font-family:'Poppins',Inter,system-ui,Segoe UI,sans-serif;z-index:60}
.ogb-mask{display:flex;width:max-content;animation:ogbScroll 34s linear infinite}
.ogb:hover .ogb-mask{animation-play-state:paused}
.ogb-track{display:flex;align-items:center;flex:none}
.ogb-item{display:inline-flex;align-items:center;gap:12px;white-space:nowrap;
  padding:9px 0;margin-right:44px;font-size:13px;font-weight:600;letter-spacing:.015em}
.ogb-dot{width:6px;height:6px;border-radius:50%;background:#ffd166;flex:none;box-shadow:0 0 0 3px rgba(255,209,102,.25)}
@keyframes ogbScroll{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
@media(max-width:600px){.ogb-item{font-size:12px;margin-right:30px}.ogb-mask{animation-duration:26s}}
/* A moving strip is a genuine accessibility problem for some readers: hold it
   still when the OS asks for reduced motion — the copy is all still there. */
@media(prefers-reduced-motion:reduce){.ogb-mask{animation:none}.ogb-track[aria-hidden="true"]{display:none}
  .ogb-mask{width:100%;overflow-x:auto}}
`;
