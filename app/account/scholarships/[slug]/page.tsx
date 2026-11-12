import { notFound } from "next/navigation";
import { scholarshipBySlug } from "@/data/scholarships/scholarships";
import { ScholarshipDetailClient } from "@/components/scholarships/ScholarshipDetailClient";

export default async function ScholarshipDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const scholarship = scholarshipBySlug(params.slug);
  if (!scholarship) notFound();
  return <ScholarshipDetailClient scholarship={scholarship} />;
}
