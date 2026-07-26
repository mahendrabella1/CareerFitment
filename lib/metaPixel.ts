// Thin wrapper around the Meta (Facebook) Pixel's global `fbq` — every call is
// a no-op until the pixel script has loaded, so nothing throws if it hasn't
// (or if NEXT_PUBLIC_META_PIXEL_ID isn't set on this deployment yet).
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const fbq = (): ((...args: unknown[]) => void) | undefined =>
  typeof window !== "undefined" ? window.fbq : undefined;

export function pixelPageView(): void {
  fbq()?.("track", "PageView");
}

/** Fire a Meta standard event (Lead, CompleteRegistration, Purchase, etc.) —
 *  use standard names so ad campaigns can actually optimise around them. */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
  fbq()?.("track", name, params);
}

/** Fire a custom (non-standard) event, e.g. generic CTA-click tracking. */
export function trackCustom(name: string, params?: Record<string, unknown>): void {
  fbq()?.("trackCustom", name, params);
}
