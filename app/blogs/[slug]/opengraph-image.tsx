import { POSTS, postBySlug } from "@/lib/blog";
import { OG_SIZE, ogCard } from "@/lib/seo/ogCard";

export const alt = "OneGrasp blog";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const p = postBySlug((await props.params).slug);
  return ogCard(p ? `Blog · ${p.category}` : "Blog", p?.title ?? "OneGrasp blog", p?.description ?? "");
}
