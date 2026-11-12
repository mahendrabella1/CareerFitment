import { FEATURE_PAGES, featurePage } from "@/lib/seo/features";
import { OG_SIZE, ogCard } from "@/lib/seo/ogCard";

export const alt = "OneGrasp feature";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() {
  return FEATURE_PAGES.map((f) => ({ slug: f.slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const f = featurePage((await props.params).slug);
  return ogCard(f ? f.who : "OneGrasp", f?.name ?? "OneGrasp", f?.description ?? "");
}
