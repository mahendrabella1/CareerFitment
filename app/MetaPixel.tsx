"use client";

/**
 * Site-wide Meta Pixel: loads the base pixel once, fires PageView on every
 * client-side route change (App Router doesn't do this automatically), and
 * auto-tracks every button/link click on the site as a generic "CTAClick"
 * custom event — so no individual CTA needs to be wired up by hand.
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

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
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
