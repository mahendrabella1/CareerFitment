import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * /robots.txt. Only the API is blocked here: private and personal pages
 * (dashboard, admin, portal, parent links, shared reports, passports) get a
 * "noindex" header instead (next.config.js), because LinkedIn, X and WhatsApp
 * obey robots.txt when they build a link preview - blocking a shared
 * certificate or passport here would break its preview.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
