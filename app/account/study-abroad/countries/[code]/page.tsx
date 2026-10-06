import { notFound } from "next/navigation";
import { countryByCode } from "@/data/studyAbroad/countries";
import { CountryProfileView } from "@/components/studyAbroad/CountryProfileView";

export default function CountryDetailPage({ params }: { params: { code: string } }) {
  const country = countryByCode(params.code.toUpperCase());
  if (!country) notFound();
  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <CountryProfileView country={country} />
    </div>
  );
}
