import { CAREER_PAGES, careerPage, howTo, summary } from "@/lib/seo/careers";
import { OG_SIZE, ogCard } from "@/lib/seo/ogCard";

export const alt = "How to become - OneGrasp careers";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() {
  return CAREER_PAGES.map((c) => ({ slug: c.slug }));
}

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const c = careerPage((await props.params).slug);
  return ogCard(c ? `Careers · ${c.domain}` : "Careers", c ? howTo(c) : "How to become...", c ? summary(c) : "");
}
