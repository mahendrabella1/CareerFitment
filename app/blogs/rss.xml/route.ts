import { POSTS } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo/site";

/** /blogs/rss.xml - the blog as an RSS feed (feed readers, some aggregators). Built at deploy. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = POSTS.map((p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blogs/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blogs/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OneGrasp Career Guidance Blog</title>
    <link>${SITE_URL}/blogs</link>
    <atom:link href="${SITE_URL}/blogs/rss.xml" rel="self" type="application/rss+xml" />
    <description>Career guidance for students, parents and schools - from OneGrasp.</description>
    <language>en-IN</language>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
