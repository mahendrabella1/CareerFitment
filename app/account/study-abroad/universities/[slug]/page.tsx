import Link from "next/link";
import { notFound } from "next/navigation";
import { universityBySlug, RECOGNITION_CHECKS, RANKING_PUBLISHERS } from "@/data/studyAbroad/universities";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";
import { SaveToShortlistButton } from "@/components/studyAbroad/UniversityBrowser";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";

export default function UniversityPage({ params }: { params: { slug: string } }) {
  const uni = universityBySlug(params.slug);
  if (!uni) notFound();
  const country = STUDY_ABROAD_COUNTRIES.find((c) => c.code === uni.countryCode);
  const recognition = RECOGNITION_CHECKS[uni.countryCode];

  const facts: [string, string][] = country
    ? [
        ["Typical tuition in this country (approx.)", country.tuitionPerYearApprox],
        ["Proof of funds", country.livingFundsNote],
        ["Work while studying", country.workWhileStudying],
        ["Work after studying", country.postStudyWork],
        ["Main intakes", country.mainIntakes],
        ["Tests usually needed", country.testsNeeded],
      ]
    : [];

  return (
    <div style={{ maxWidth: 820 }}>
      <PageHeader back={{ href: "/account/study-abroad/universities", label: "All universities" }} icon="school" eyebrow={country?.name}
        title={uni.name} subtitle={`${uni.city} · ${uni.type === "public" ? "Public institution" : "Private institution"}`} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <a href={uni.website} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 800, color: ACCENT, textDecoration: "none" }}>Official website: {uni.website.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗</a>
        <SaveToShortlistButton uni={uni} />
      </div>

      {uni.tuitionNote && (
        <section style={{ ...box, marginTop: 18, borderColor: "#c4b5fd", background: "#faf5ff" }}>
          <div style={boxTitle}>Tuition for Indian (non-EU) students</div>
          <p style={pText}>{uni.tuitionNote}</p>
          {uni.tuitionSource && <a href={uni.tuitionSource} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: ACCENT, fontWeight: 700 }}>Source ↗</a>}
        </section>
      )}

      {facts.length > 0 && (
        <section style={{ ...box, marginTop: 16 }}>
          <div style={boxTitle}>Studying in {country?.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {facts.map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 13.5, borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
                <span style={{ color: "#64748b", flex: "0 0 220px", minWidth: 0 }}>{k}</span>
                <span style={{ color: "#0f172a", flex: "1 1 260px", minWidth: 0 }}>{v}</span>
              </div>
            ))}
          </div>
          <Link href={`/account/study-abroad/countries/${uni.countryCode.toLowerCase()}`} style={{ display: "inline-block", marginTop: 10, fontSize: 13, fontWeight: 800, color: ACCENT, textDecoration: "none" }}>Country profile and what changed recently →</Link>
        </section>
      )}

      <section style={{ ...box, marginTop: 16 }}>
        <div style={boxTitle}>Before you apply</div>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>
          <li>Find your exact programme on the official website: length, intake, tuition, required tests and the application deadline.</li>
          <li>Look for the programme&apos;s class profile or admissions statistics, and note the typical admitted marks and scores. Add them to your shortlist to see whether it is a reach, match or safe choice.</li>
          <li>Check the published graduate outcomes (employment rate, salary range and the cohort year) before you trust any salary claim.</li>
          <li>Confirm recognition: <a href={recognition.url} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700 }}>{recognition.label} ↗</a>. If you plan to use the degree in India, check equivalence with the <a href="https://www.aiu.ac.in/" target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700 }}>Association of Indian Universities ↗</a>.</li>
          <li>Run the full cost through the <Link href="/account/study-abroad/roi" style={{ color: ACCENT, fontWeight: 700 }}>ROI calculator</Link> before paying any application fee.</li>
        </ol>
      </section>

      <section style={{ ...box, marginTop: 16 }}>
        <div style={boxTitle}>Rankings</div>
        <p style={pText}>
          Rankings change each year and differ by publisher and subject, so we show none here. Check the current edition and its year on{" "}
          {RANKING_PUBLISHERS.map((r, i) => (
            <span key={r.url}>
              {i > 0 && " and "}
              <a href={r.url} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700 }}>{r.label} ↗</a>
            </span>
          ))}
          , including the subject ranking for your course.
        </p>
      </section>

      <section style={{ ...box, marginTop: 16 }}>
        <div style={boxTitle}>Reviews</div>
        <p style={pText}>We publish only verified student and alumni reviews, good and bad. <Link href="/account/study-abroad/reviews" style={{ color: ACCENT, fontWeight: 700 }}>Read or write a verified review →</Link></p>
      </section>
    </div>
  );
}

const box = { border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", background: "#fff" } as const;
const boxTitle = { fontSize: 13.5, fontWeight: 900, color: "#0f172a", marginBottom: 8 } as const;
const pText = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" } as const;
