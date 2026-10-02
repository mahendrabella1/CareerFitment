import { notFound } from "next/navigation";
import Link from "next/link";
import { countryByCode } from "@/data/studyAbroad/countries";
import { CountryProfileView } from "@/components/studyAbroad/CountryProfileView";

export default function CountryDetailPage({ params }: { params: { code: string } }) {
  const country = countryByCode(params.code.toUpperCase());
  if (!country) notFound();
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad/countries" style={{ color: "#999", textDecoration: "none" }}>← Compare countries</Link>
      </div>
      <CountryProfileView country={country} />
    </div>
  );
}
