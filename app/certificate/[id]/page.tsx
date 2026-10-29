/**
 * /certificate/[id] - a certificate's public page, the link students share:
 * the certificate as OneGrasp issued it (name, class, course, date, ID), so
 * anyone can check it's real. Its link preview is ./opengraph-image.tsx.
 * Kept out of search engines - it's shared by the student, not listed.
 */
import type { Metadata } from "next";
import { headers } from "next/headers";
import { CertificatePublic } from "@/components/certificates/CertificatePublic";
import { ISSUER } from "@/lib/certificates/catalog";
import { loadCertificate } from "./load";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const base = host ? new URL(`${h.get("x-forwarded-proto") || "https"}://${host}`) : undefined;
  const r = await loadCertificate(params.id);
  if (r.state !== "ok") return { title: `Certificate | ${ISSUER.name}`, robots: { index: false, follow: false }, metadataBase: base };
  const c = r.cert;
  const title = `${c.name} completed ${c.courseTitle} | ${ISSUER.name} certificate`;
  const description = `${c.name}${c.className ? ` (${c.className})` : ""} completed the ${c.courseTitle} course on ${ISSUER.name} and earned this certificate. Verified by ${ISSUER.name}.`;
  return {
    title,
    description,
    metadataBase: base,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website", siteName: ISSUER.name },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const r = await loadCertificate(params.id);
  return <CertificatePublic cert={r.state === "ok" ? r.cert : null} problem={r.state === "offline" ? "offline" : r.state === "missing" ? "missing" : undefined} />;
}
