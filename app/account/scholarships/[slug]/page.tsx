import { notFound } from "next/navigation";
import { scholarshipBySlug } from "@/data/scholarships/scholarships";
import { ScholarshipDetailClient } from "@/components/scholarships/ScholarshipDetailClient";

export default function ScholarshipDetailPage({ params }: { params: { slug: string } }) {
  const scholarship = scholarshipBySlug(params.slug);
  if (!scholarship) notFound();
  return <ScholarshipDetailClient scholarship={scholarship} />;
}
