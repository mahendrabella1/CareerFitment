import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ActivityTracker } from "@/components/ActivityTracker";
import MetaPixel from "@/app/MetaPixel";
import { BRAND, DEFAULT_DESCRIPTION, DEFAULT_TITLE, KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import "./globals.css";
import "./landing-premium.css";
import "./hero-cine.css";
import "./home-sections.css";
import "./report-premium.css";
import "./exam-premium.css";

// Search and sharing defaults for every page (lib/seo/site.ts). Public pages set
// their own title and canonical address with pageMetadata(); private areas are
// kept out of search by an X-Robots-Tag header (next.config.js). No canonical
// here - a root canonical would be inherited by every page.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages without their own title (the signed-in areas, which aren't indexed) get the plain
  // site name - not the home page's title, which search tools flagged as duplicated hundreds of times.
  title: { default: SITE_NAME, template: `%s | ${BRAND}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: BRAND, url: "https://onegrasp.com" }],
  creator: BRAND,
  publisher: BRAND,
  category: "education",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Set in Vercel once the site is added to Google Search Console / Bing Webmaster Tools (HTML-tag method).
  // Read on the server when the page is built, so no NEXT_PUBLIC_ prefix is needed (the code is public
  // anyway - it's printed in the page for Google to find); the prefixed names still work.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: (process.env.BING_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION)
      ? { "msvalidate.01": (process.env.BING_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION)! }
      : undefined,
  },
  formatDetection: { telephone: false },
};

// Critical for phones: render at device width (not the 980px fallback) so every
// page's responsive rules actually take effect.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Inter, Plus Jakarta Sans and Poppins served from this site (public/fonts) - no
            waiting on two Google domains before text can render. lib/report/exportReportHtml.ts
            reads this stylesheet to embed the fonts in the downloaded report. */}
        <link rel="preload" href="/fonts/files/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/files/poppins-pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/files/poppins-pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body>
        <MetaPixel />
        <AuthProvider>
          {children}
          <ActivityTracker />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
