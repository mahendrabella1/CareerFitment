/**
 * The blog (/blogs): articles written for what students, parents and schools
 * search for, each linking to the feature pages and the assessment. Posts are
 * plain data in lib/blog/posts-*.ts (no CMS), rendered statically.
 *
 * Body text supports [link text](/path) and **bold**. Keep facts evergreen -
 * no exam dates, fees or amounts that go stale; point to the official site.
 */
import { POSTS_CAREERS } from "./posts-careers";
import { POSTS_SKILLS } from "./posts-skills";
import { POSTS_MONEY } from "./posts-money";
import { POSTS_WORK } from "./posts-work";
import { DEEPER, MORE, TAKEAWAYS } from "./deeper";

export type Block = { h2: string } | { h3: string } | { p: string } | { ul: string[] } | { ol: string[] } | { tip: string };
export interface Post {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  /** ISO date first published. */
  date: string;
  updated?: string;
  category: string;
  /** Picture for cards and sharing: /features/<key>.webp or /home/... */
  image: string;
  /** Feature pages (lib/seo/features.ts slugs) this post leads to. */
  features: string[];
  body: Block[];
  faqs?: { q: string; a: string }[];
}

/** Key takeaways after the opening paragraph; the deeper sections before the
 *  closing paragraph (the one pointing to a feature). */
function withDeeper(p: Post): Post {
  const extra = [...(DEEPER[p.slug] ?? []), ...(MORE[p.slug] ?? [])];
  const take = TAKEAWAYS[p.slug];
  let body = p.body;
  if (extra.length) {
    const last = body[body.length - 1];
    const closing = "p" in last && last.p.includes("](/features/");
    body = closing ? [...body.slice(0, -1), ...extra, last] : [...body, ...extra];
  }
  if (take?.length) body = [body[0], { h2: "Key takeaways" }, { ul: take }, ...body.slice(1)];
  return { ...p, body };
}

export const POSTS: Post[] = [...POSTS_CAREERS, ...POSTS_SKILLS, ...POSTS_MONEY, ...POSTS_WORK]
  .map(withDeeper)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export const CATEGORIES = [...new Set(POSTS.map((p) => p.category))];
export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
export const postsForFeature = (slug: string) => POSTS.filter((p) => p.features.includes(slug));

export function wordsIn(p: Post): number {
  const text = p.body.map((b) => ("p" in b ? b.p : "tip" in b ? b.tip : "ul" in b ? b.ul.join(" ") : "ol" in b ? b.ol.join(" ") : "h2" in b ? b.h2 : b.h3)).join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
export const readMinutes = (p: Post) => Math.max(2, Math.round(wordsIn(p) / 200));

/** Other posts to read next: same category first, then ones sharing a feature. */
export function relatedPosts(p: Post, n = 3): Post[] {
  const score = (q: Post) => (q.category === p.category ? 2 : 0) + q.features.filter((f) => p.features.includes(f)).length;
  return POSTS.filter((q) => q.slug !== p.slug).sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date)).slice(0, n);
}
