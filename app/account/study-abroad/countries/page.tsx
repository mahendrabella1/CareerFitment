import { CountryComparison } from "@/components/studyAbroad/CountryComparison";
import { PageHeader } from "@/components/course/fx";

export default function CountriesComparePage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="globe" eyebrow="Decide" title="Compare countries" subtitle="Pick up to 4 destinations to compare side by side." />
      <CountryComparison />
    </div>
  );
}
