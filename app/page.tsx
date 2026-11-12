import { Suspense } from "react";
import AssessmentExperience from "./assessment-experience";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORGANIZATION_LD, WEBSITE_LD, faqLd, pageMetadata } from "@/lib/seo/site";
import { FAQ } from "@/components/home/homeContent";

export const metadata = pageMetadata({ title: DEFAULT_TITLE, absoluteTitle: true, description: DEFAULT_DESCRIPTION, path: "/" });

export default function HomePage() {
  return (
    <>
      {/* Who we are, the site, and the home page's FAQ - for search engines. */}
      <JsonLd data={[ORGANIZATION_LD, WEBSITE_LD, faqLd(FAQ)]} />
      <Suspense fallback={null}>
        <AssessmentExperience />
      </Suspense>
    </>
  );
}
