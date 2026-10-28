import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ActivityTracker } from "@/components/ActivityTracker";
import MetaPixel from "@/app/MetaPixel";
import "./globals.css";
import "./landing-premium.css";
import "./hero-cine.css";
import "./home-sections.css";
import "./report-premium.css";
import "./exam-premium.css";

export const metadata: Metadata = {
  title: "OneGrasp Career Fitment",
  description:
    "Category-based career fitment assessments with a 60+ question journey and fit summary.",
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
