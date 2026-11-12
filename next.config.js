// Security headers on every response (security audit M-01). Camera and
// microphone stay allowed for this site - the Communication Lab and the mock
// interview record from them. Content-Security-Policy is added separately,
// report-only first (audit M-01 part 2 / 3.9).
const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(), browsing-topics=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // @react-pdf/renderer (used to build the emailed PDF) ships native-ish font
  // deps that must not be webpack-bundled - require it at runtime instead.
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
  // Files in public/ are otherwise sent with max-age=0, so every visit re-checks
  // every image. Their names aren't versioned, so images get a week (a replaced
  // image shows within a week, at once after a hard refresh); the font files are
  // versioned by name and never change, so they get a year.
  async headers() {
    const week = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    const year = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...["home", "features", "jobs", "report", "illustrations", "gallery"].map((dir) => ({ source: `/${dir}/:path*`, headers: week })),
      { source: "/onegrasp-logo-tight.png", headers: week },
      { source: "/why-this-matters.png", headers: week },
      { source: "/fonts/fonts.css", headers: week },
      { source: "/fonts/files/:path*", headers: year },
    ];
  },
};

module.exports = nextConfig;
