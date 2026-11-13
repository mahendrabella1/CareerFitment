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
const { SITE_URL, ORGANIZATION_LD } = await import("../../lib/seo/site.ts");
const { CAREER_PAGES } = await import("../../lib/seo/careers.ts");
const CAREER_SLUGS = new Set(CAREER_PAGES.map((c) => c.slug));

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
  if (parts[0] === "careers" && parts.length === 2) return CAREER_SLUGS.has(parts[1]);
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
  const { DEEPER, DEEPER_MORE, MORE, TAKEAWAYS } = await import("../../lib/blog/deeper.ts");
  for (const k of [...Object.keys(DEEPER), ...Object.keys(DEEPER_MORE), ...Object.keys(MORE), ...Object.keys(TAKEAWAYS)]) assert.ok(POSTS.some((p) => p.slug === k), k);
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

test("career pages: one per researched roadmap, unique addresses, full content, old ids redirected", async () => {
  const { CAREER_PAGES, careerFaqs, groupsOf, schoolFacts, howTo, clean } = await import("../../lib/seo/careers.ts");
  assert.equal(CAREER_PAGES.length, 360);
  assert.equal(new Set(CAREER_PAGES.map((c) => c.slug)).size, CAREER_PAGES.length, "unique slugs");
  for (const c of CAREER_PAGES) {
    assert.match(c.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, c.slug);
    assert.ok(c.domain && c.domain !== "Other", `${c.name}: has a field`);
    assert.ok(c.roadmap.completeRoadmap.length >= 3 && schoolFacts(c).length >= 2 && c.roadmap.jobOptions.length >= 3, `${c.name}: content`);
    assert.ok(careerFaqs(c).length >= 2, `${c.name}: FAQs`);
    for (const f of ["topColleges", "skills", "pgSpecialization", "afterUgPathways"]) for (const g of groupsOf(c.roadmap[f], f)) assert.ok(g.items.length > 0, `${c.name}: ${f} group has items`);
  }
  assert.equal(howTo(CAREER_PAGES.find((c) => c.slug === "aerospace-engineer")), "How to become an Aerospace Engineer");
  assert.ok(!CAREER_PAGES.some((c) => /\bLogin\b/.test(clean(JSON.stringify(c.roadmap)))), "link-text artefacts cleaned");
  const page = readFileSync("app/careers/[slug]/page.tsx", "utf8");
  assert.match(page, /permanentRedirect\(`\/careers\/\$\{match\.slug\}`\)/, "old /careers/<id> links still work");
});

test("the dashboard's light list of career pages matches the pages; old library links go straight there", async () => {
  const { CAREER_PAGE_SLUGS } = await import("../../lib/seo/careerSlugList.ts");
  assert.deepEqual([...CAREER_PAGE_SLUGS].sort(), [...CAREER_SLUGS].sort(), "regenerate lib/seo/careerSlugList.ts");
  const lib = readFileSync("app/account/features/CareerLibrary.tsx", "utf8");
  assert.ok(!lib.includes("/careers/${career.id}"), "no links to the old /careers/<id> pages");
  assert.match(lib, /href=\{careerHref\(career\)\}/);
});

test("privacy policy, terms and social profiles", async () => {
  const { PRIVACY, TERMS } = await import("../../lib/seo/legal.ts");
  const text = JSON.stringify(PRIVACY);
  // Every outside service the app sends personal data to is named.
  for (const s of ["Firebase", "Vercel", "Razorpay", "Groq", "DeepSeek", "Twilio", "Meta Pixel", "Upstash", "Supabase"]) assert.ok(text.includes(s), `privacy names ${s}`);
  for (const s of ["not stored", "Data Protection Board", "/privacy/request", "under 18"]) assert.ok(text.includes(s), `privacy says ${s}`);
  assert.ok(JSON.stringify(TERMS).includes("not guarantees"));
  const urls = sitemap().map((e) => e.url);
  for (const p of ["/privacy", "/terms", "/privacy/request"]) assert.ok(urls.includes(`${SITE_URL}${p}`), p);
  const { SOCIAL } = await import("../../components/seo/SocialLinks.tsx");
  assert.deepEqual(SOCIAL.map((s) => s.name), ["Facebook", "Instagram", "LinkedIn", "YouTube"]);
  assert.ok(SOCIAL.every((s) => s.href.startsWith("https://www.") && /onegrasp/i.test(s.href)));
  assert.deepEqual(ORGANIZATION_LD.sameAs, SOCIAL.map((s) => s.href));
});

test("sitemap lists every public page on the canonical domain; robots blocks only the API", () => {
  const urls = sitemap().map((e) => e.url);
  assert.ok(urls.every((u) => u.startsWith(SITE_URL)), "canonical domain");
  for (const f of FEATURE_PAGES) assert.ok(urls.includes(`${SITE_URL}/features/${f.slug}`), f.slug);
  for (const p of POSTS) assert.ok(urls.includes(`${SITE_URL}/blogs/${p.slug}`), p.slug);
  assert.ok(urls.includes(`${SITE_URL}/careers/software-engineer`) && urls.filter((u) => u.includes("/careers/")).length === 360, "career pages");
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
  for (const p of ["/features", "/blogs", "/careers", "/jobs", "/register"]) assert.ok(!headers.some((h) => h.source.startsWith(p) && h.headers.some((x) => x.key === "X-Robots-Tag")), `${p} indexable`);
  const redirects = await config.redirects();
  assert.ok(redirects.some((r) => r.source === "/blog" && r.destination === "/blogs" && r.permanent));
  const layout = readFileSync("app/layout.tsx", "utf8");
  assert.match(layout, /metadataBase: new URL\(SITE_URL\)/);
  assert.ok(!/alternates/.test(layout.slice(layout.indexOf("export const metadata"), layout.indexOf("export const viewport"))), "no root canonical");
});
