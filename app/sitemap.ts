import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { FEATURE_PAGES } from "@/lib/seo/features";
import { POSTS } from "@/lib/blog";

/** /sitemap.xml - every public page search engines should know about. Private
 *  areas (dashboard, admin, portal, shared links) are deliberately left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string) => `${SITE_URL}${p}`;
  return [
    { url: u("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: u("/features"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...FEATURE_PAGES.map((f) => ({ url: u(`/features/${f.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: u("/blogs"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...POSTS.map((p) => ({ url: u(`/blogs/${p.slug}`), lastModified: new Date(p.updated ?? p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: u("/jobs"), lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: u("/register"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: u("/signin"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
