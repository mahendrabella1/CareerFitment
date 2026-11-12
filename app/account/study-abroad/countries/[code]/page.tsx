import { notFound } from "next/navigation";
import { countryByCode } from "@/data/studyAbroad/countries";
import { CountryProfileView } from "@/components/studyAbroad/CountryProfileView";

export default async function CountryDetailPage(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  const country = countryByCode(params.code.toUpperCase());
  if (!country) notFound();
  return (
    <div className="fx-narrow" style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <CountryProfileView country={country} />
    </div>
  );
}
