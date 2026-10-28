/** @type {import('next').NextConfig} */
const nextConfig = {
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
      ...["home", "features", "jobs", "report", "illustrations", "gallery"].map((dir) => ({ source: `/${dir}/:path*`, headers: week })),
      { source: "/onegrasp-logo-tight.png", headers: week },
      { source: "/why-this-matters.png", headers: week },
      { source: "/fonts/fonts.css", headers: week },
      { source: "/fonts/files/:path*", headers: year },
    ];
  },
};

module.exports = nextConfig;
