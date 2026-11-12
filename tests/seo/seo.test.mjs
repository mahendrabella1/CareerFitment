// SEO: blog posts, feature pages, sitemap, robots and noindex rules. npm run test:seo
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const { POSTS, wordsIn, relatedPosts } = await import("../../lib/blog/index.ts");
const { FEATURE_PAGES } = await import("../../lib/seo/features.ts");
const { default: sitemap } = await import("../../app/sitemap.ts");
const { default: robots } = await import("../../app/robots.ts");
const { SITE_URL } = await import("../../lib/seo/site.ts");

const pages = [];
(function walk(dir, segs) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) { if (name === "page.tsx") pages.push(segs); continue; }
    if (name.startsWith("(")) walk(p, segs); else if (name !== "api") walk(p, [...segs, name]);
  }
})("app", []);
const routeExists = (href) => {
  const parts = href.split(/[?#]/)[0].split("/").filter(Boolean);
  if (parts[0] === "features" && parts.length === 2) return FEATURE_PAGES.some((f) => f.slug === parts[1]);
  if (parts[0] === "blogs" && parts.length === 2) return POSTS.some((p) => p.slug === parts[1]);
  return pages.some((s) => s.length === parts.length && s.every((x, i) => x === parts[i] || /^\[[^.]+\]$/.test(x)));
};
const linksIn = (p) => p.body.flatMap((b) => [b.p, b.tip, ...(b.ul ?? []), ...(b.ol ?? [])].filter(Boolean)).flatMap((t) => [...t.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]));

test("20-30 blog posts, each a complete, well-formed article", () => {
  assert.ok(POSTS.length >= 20 && POSTS.length <= 30, `${POSTS.length} posts`);
  assert.equal(new Set(POSTS.map((p) => p.slug)).size, POSTS.length, "unique slugs");
  assert.equal(new Set(POSTS.map((p) => p.title)).size, POSTS.length, "unique titles");
  for (const p of POSTS) {
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, p.slug);
    assert.ok(p.title.length >= 30 && p.title.length <= 90, `${p.slug}: title length ${p.title.length}`);
    assert.ok(p.description.length >= 90 && p.description.length <= 200, `${p.slug}: description length ${p.description.length}`);
    assert.ok(p.keywords.length >= 4, `${p.slug}: keywords`);
    assert.ok(wordsIn(p) >= 340, `${p.slug}: ${wordsIn(p)} words`);
    assert.ok(p.body.some((b) => "h2" in b && b.h2 === "Key takeaways"), `${p.slug}: key takeaways`);
    assert.ok(p.body.some((b) => "h2" in b), `${p.slug}: has sections`);
    assert.ok(!Number.isNaN(Date.parse(p.date)), `${p.slug}: date`);
    for (const f of p.features) assert.ok(FEATURE_PAGES.some((x) => x.slug === f), `${p.slug}: feature ${f}`);
    const links = linksIn(p);
    assert.ok(links.some((l) => l.startsWith("/features/")), `${p.slug}: links to a feature page`);
    for (const l of links.filter((l) => l.startsWith("/"))) assert.ok(routeExists(l), `${p.slug}: link ${l} exists`);
    assert.ok(relatedPosts(p).length === 3, `${p.slug}: has posts to read next`);
  }
});

test("every extra section belongs to a real post", async () => {
  const { DEEPER, MORE, TAKEAWAYS } = await import("../../lib/blog/deeper.ts");
  for (const k of [...Object.keys(DEEPER), ...Object.keys(MORE), ...Object.keys(TAKEAWAYS)]) assert.ok(POSTS.some((p) => p.slug === k), k);
});

test("feature pages: unique, well-formed, and every link goes somewhere real", () => {
  assert.equal(new Set(FEATURE_PAGES.map((f) => f.slug)).size, FEATURE_PAGES.length);
  for (const f of FEATURE_PAGES) {
    assert.ok(f.title.length <= 90 && f.description.length >= 90 && f.description.length <= 210, `${f.slug}: title ${f.title.length} / description ${f.description.length}`);
    assert.ok(f.points.length >= 3 && f.faqs.length >= 1 && f.intro.length >= 1, f.slug);
    for (const r of f.related) assert.ok(FEATURE_PAGES.some((x) => x.slug === r), `${f.slug}: related ${r}`);
    assert.ok(routeExists(f.dashboard), `${f.slug}: dashboard link ${f.dashboard}`);
    assert.ok(statSync(join("public", f.image)).isFile(), `${f.slug}: image ${f.image}`);
  }
  for (const p of POSTS) assert.ok(statSync(join("public", p.image)).isFile(), `${p.slug}: image ${p.image}`);
  // No price claims on the public pages (the price is shown before paying and changes with offers).
  const text = JSON.stringify(FEATURE_PAGES) + JSON.stringify(POSTS);
  assert.ok(!/₹\s?\d|Rs\.?\s?\d|free career (test|assessment)/i.test(text), "no prices or 'free test' claims");
});

test("sitemap lists every public page on the canonical domain; robots blocks only the API", () => {
  const urls = sitemap().map((e) => e.url);
  assert.ok(urls.every((u) => u.startsWith(SITE_URL)), "canonical domain");
  for (const f of FEATURE_PAGES) assert.ok(urls.includes(`${SITE_URL}/features/${f.slug}`), f.slug);
  for (const p of POSTS) assert.ok(urls.includes(`${SITE_URL}/blogs/${p.slug}`), p.slug);
  assert.ok(!urls.some((u) => /\/(account|admin|institution|parent|passport|api)\b/.test(u)), "no private pages");
  const r = robots();
  assert.deepEqual(r.rules[0].disallow, ["/api/"], "shared links keep their previews");
  assert.equal(r.sitemap, `${SITE_URL}/sitemap.xml`);
});

test("private areas carry noindex; the root layout sets the base URL but no site-wide canonical", async () => {
  const config = createRequire(import.meta.url)("../../next.config.js");
  const headers = await config.headers();
  for (const p of ["/account", "/admin", "/institution", "/parent", "/passport", "/api"]) {
    const rule = headers.find((h) => h.source === `${p}/:path*`);
    assert.ok(rule?.headers.some((h) => h.key === "X-Robots-Tag" && /noindex/.test(h.value)), `${p} noindex`);
  }
  for (const p of ["/features", "/blogs", "/jobs", "/register"]) assert.ok(!headers.some((h) => h.source.startsWith(p) && h.headers.some((x) => x.key === "X-Robots-Tag")), `${p} indexable`);
  const redirects = await config.redirects();
  assert.ok(redirects.some((r) => r.source === "/blog" && r.destination === "/blogs" && r.permanent));
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /metadataBase: new URL\(SITE_URL\)/);
  assert.ok(!/alternates/.test(layout.slice(layout.indexOf("export const metadata"), layout.indexOf("export const viewport"))), "no root canonical");
});
