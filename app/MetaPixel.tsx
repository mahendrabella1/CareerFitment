"use client";

/**
 * Site-wide Meta Pixel: loads the base pixel once, fires PageView on every
 * client-side route change (App Router doesn't do this automatically), and
 * auto-tracks every button/link click on the site as a generic "CTAClick"
 * custom event - so no individual CTA needs to be wired up by hand.
 * Named conversion events (Lead, CompleteRegistration, Purchase) are fired
 * separately at the actual funnel points via lib/metaPixel.ts.
 */

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID, pixelPageView, trackCustom } from "@/lib/metaPixel";

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    pixelPageView();
  }, [pathname]);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest("button, a");
      if (!el) return;
      const label = el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 80) || "";
      if (!label) return;
      trackCustom("CTAClick", { label, path: pathname });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  // Meta's snippet in two parts: the tiny `fbq` queue straight away, so every
  // PageView, click and conversion is recorded from the first moment, and the
  // ~217 KB fbevents.js only once the page has loaded and the browser is idle -
  // it then sends everything queued so far.
  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[]}(window);
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <Script id="meta-pixel-lib" src="https://connect.facebook.net/en_US/fbevents.js" strategy="lazyOnload" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
