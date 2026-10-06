"use client";

import Link from "next/link";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";
import { STUDY_ABROAD_COURSES } from "@/data/studyAbroad/courses";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";

function Card({ href, title, desc, color }: { href: string; title: string; desc: string; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ border: `1px solid ${color}35`, background: `${color}08`, borderRadius: 14, padding: "16px 18px", height: "100%" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{title}</div>
        <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0", lineHeight: 1.5 }}>{desc}</p>
      </div>
    </Link>
  );
}

export function StudyAbroadHomeClient() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="globe" eyebrow="Decide" title="Your dashboard"
        subtitle="Decide honestly before anyone sells you a university - check the money first, then compare countries, then browse programmes." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
        <Card href="/account/study-abroad/roi" title="ROI calculator" desc="Full cost, loan EMI and realistic payback time - check this before applying anywhere." color={ACCENT} />
        <Card href="/account/study-abroad/countries" title="Compare countries" desc={`${STUDY_ABROAD_COUNTRIES.length} real country profiles with a "what changed" feed for each.`} color={ACCENT} />
        <Card href="/account/study-abroad/courses" title="Popular courses" desc={`${STUDY_ABROAD_COURSES.length} course pages with an honest "study it in India instead?" comparison.`} color={ACCENT} />
        <Card href="/account/features/study-abroad" title="Browse universities" desc="Search and filter universities by country, budget and programme." color="#2563eb" />
        <Card href="/account/study-abroad/vault" title="Document vault" desc="Passport, transcripts, test scores and more - upload once, reuse everywhere." color={ACCENT} />
        <Card href="/account/study-abroad/safety" title="Safety & MBBS/NMC checklist" desc="Avoid fraud, and the real rules for an MBBS abroad to count in India." color="#dc2626" />
        <Card href="/account/scholarships" title="Scholarships for abroad" desc="Chevening, Fulbright-Nehru, DAAD, Erasmus Mundus and more - in the Scholarships section." color="#166534" />
      </div>
      <p style={{ fontSize: 11, color: "#94a3b8" }}>Free to use, always. We never take commissions from universities, and any partnership is disclosed clearly.</p>
    </div>
  );
}
