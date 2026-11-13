// Content-Security-Policy, REPORT-ONLY (security audit M-01 part 2 / 3.9): the
// browser blocks nothing, it only lists in the console what an enforced policy
// would have blocked. Watch the console on the main pages (home, sign-up,
// payment, the exam, the report, lessons with videos, the PDF download) for a
// week, add any missing source here, then rename the header to
// "Content-Security-Policy" to enforce it.
// What each source is for:
//   *.razorpay.com          - the payment window (script, frames, its API and logging)
//   youtube / ytimg         - lesson videos (youtube-nocookie embeds, the IFrame API in the Communication Lab)
//   *.googleapis.com        - Firebase sign-in, Firestore and Storage from the browser
//   *.firebaseapp.com       - Firebase Auth's helper frame on the auth domain
//   connect.facebook.net / www.facebook.com - the Meta Pixel (app/MetaPixel.tsx)
//   va.vercel-scripts.com / vitals.vercel-insights.com - Vercel Analytics and Speed Insights
//   onegrasp.com            - the home page's videos (WordPress media library)
//   img https:              - job-listing logos, YouTube thumbnails and photos come from many hosts
//   'unsafe-inline' scripts - Next.js 14 writes inline scripts without nonces (and the Pixel's loader)
//   'wasm-unsafe-eval'      - the resume PDF's layout engine (yoga-layout) is WebAssembly
//   blob:                   - recordings played back, generated PDFs/images, workers
// Fonts are self-hosted (public/fonts). Development adds 'unsafe-eval' for webpack.
const dev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${dev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://www.youtube.com https://s.ytimg.com https://connect.facebook.net https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https://onegrasp.com https://*.onegrasp.com",
  "connect-src 'self' data: blob: https://*.googleapis.com https://*.razorpay.com https://connect.facebook.net https://www.facebook.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://onegrasp.com",
  "frame-src 'self' https://*.razorpay.com https://www.youtube-nocookie.com https://www.youtube.com https://*.firebaseapp.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.razorpay.com",
  "frame-ancestors 'self'",
].join("; ");

// Security headers on every response (security audit M-01). Camera and
// microphone stay allowed for this site - the Communication Lab and the mock
// interview record from them.
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy-Report-Only", value: CSP },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // @react-pdf/renderer (used to build the emailed PDF) ships native-ish font
  // deps that must not be webpack-bundled - require it at runtime instead.
  // (Next 15 moved this out of `experimental`.)
  serverExternalPackages: ["@react-pdf/renderer"],
  // Files in public/ are otherwise sent with max-age=0, so every visit re-checks
  // every image. Their names aren't versioned, so images get a week (a replaced
  // image shows within a week, at once after a hard refresh); the font files are
  // versioned by name and never change, so they get a year.
  // "/blog" is a common guess for the blog's address; the blog lives at /blogs.
  async redirects() {
    return [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },
    ];
  },
  async headers() {
    const week = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    const year = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    // Kept out of search (but still crawlable, so shared links get their previews):
    // signed-in areas, admin, the school portal, parent and shared-report links,
    // student passports and the /testing sandbox. (/careers is public: the
    // "How to become..." pages, lib/seo/careers.ts.)
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    const PRIVATE = ["/account", "/admin", "/institution", "/parent", "/r", "/report", "/passport", "/testing", "/api"];
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...PRIVATE.flatMap((p) => [{ source: p, headers: noindex }, { source: `${p}/:path*`, headers: noindex }]),
      ...["home", "features", "jobs", "report", "illustrations", "gallery"].map((dir) => ({ source: `/${dir}/:path*`, headers: week })),
      { source: "/onegrasp-logo-tight.png", headers: week },
      { source: "/why-this-matters.png", headers: week },
      { source: "/fonts/fonts.css", headers: week },
      { source: "/fonts/files/:path*", headers: year },
    ];
  },
};

module.exports = nextConfig;
