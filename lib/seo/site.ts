/**
 * The site's search and sharing basics, in one place: the canonical address,
 * names, the default title/description, and the Organization / WebSite
 * structured data (schema.org JSON-LD) Google reads. Pages build their own
 * titles and canonical URLs with pageMetadata().
 */
import type { Metadata } from "next";

/** The one address every page is canonical to (Vercel's *.vercel.app copies point here). */
export const SITE_URL = "https://careerfitment.onegrasp.com";
export const SITE_NAME = "OneGrasp Career Fitment";
export const BRAND = "OneGrasp";
export const LOGO = "/onegrasp-logo-tight.png";

export const DEFAULT_TITLE = "Career Assessment Test for Students, Class 6 to College | OneGrasp";
export const DEFAULT_DESCRIPTION =
  "Take OneGrasp's career fitment test - Class 6 to undergraduates - and get a report on how you think, learn and work, the careers that fit you, and one dashboard of courses, labs and tools to get there.";

export const KEYWORDS = [
  "career assessment test", "career test for students", "psychometric test for students", "career counselling online India",
  "stream selection test after 10th", "career guidance for class 12", "aptitude test for students", "career fitment test",
  "best career for me", "career options after 12th", "career planning for students", "OneGrasp",
];

export const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** Title, description, canonical and share card for one public page. */
export function pageMetadata(o: { title: string; description: string; path: string; keywords?: string[]; image?: string; type?: "website" | "article"; publishedTime?: string; modifiedTime?: string; absoluteTitle?: boolean }): Metadata {
  // A page's own openGraph replaces the site's, so the share card is always set
  // here: the page's own card, or the site's default (app/opengraph-image.tsx).
  const images = [{ url: o.image ?? "/opengraph-image", width: 1200, height: 630, alt: o.title }];
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    keywords: o.keywords,
    alternates: { canonical: o.path },
    openGraph: {
      type: o.type ?? "website", url: o.path, siteName: SITE_NAME, locale: "en_IN", title: o.title, description: o.description, images,
      ...(o.type === "article" ? { publishedTime: o.publishedTime, modifiedTime: o.modifiedTime, authors: [BRAND] } : {}),
    },
    twitter: { card: "summary_large_image", title: o.title, description: o.description, images: images.map((i) => i.url) },
  };
}

export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND,
  alternateName: SITE_NAME,
  url: "https://onegrasp.com",
  logo: absolute(LOGO),
  email: "support@onegrasp.com",
  areaServed: "IN",
  description: "Career assessments, reports and a learning dashboard for students from Class 6 to college, and tools for schools and working professionals.",
};

export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: absolute(t.path) })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
