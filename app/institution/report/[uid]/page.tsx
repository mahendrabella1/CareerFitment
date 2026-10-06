"use client";

/**
 * /institution/report/[uid] - a student's full report, as the student sees
 * it, for their own institution only (the server route refuses anyone
 * else's student). Outside the portal shell so it prints on its own.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import FullReport from "@/app/account/FullReport";
import { Icon } from "@/app/Icons";
import { categoryLabel } from "@/lib/auth/formOptions";
import { apiFetch } from "@/lib/institution/client";
import { prepareStudentReport } from "@/lib/report/prepareStudentReport";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

interface Profile { name: string; email: string; institution: string; category: string; latestAssessment: AssessmentSummary | null }

export default function InstitutionReportPage({ params }: { params: { uid: string } }) {
  const [p, setP] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ profile: Profile }>(`/api/institution/students/${params.uid}`).then((r) => setP(r.profile)).catch((e) => setError(e instanceof Error ? e.message : "Could not load this report."));
  }, [params.uid]);

  const bar = (
    <div className="og-noprint" style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "12px 20px", background: "rgba(255,255,255,.94)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
      <Link href={`/institution/students/${params.uid}`} className="ip-btn ghost sm" style={{ textDecoration: "none" }}><Icon name="chevronLeft" size={15} /> Back to student</Link>
      {p && <div style={{ flex: 1, minWidth: 160 }}><b>{p.name}</b><div className="ip-muted" style={{ fontSize: 12 }}>{[p.category ? categoryLabel(p.category) : "", p.institution].filter(Boolean).join(" · ")}</div></div>}
      {p?.latestAssessment && <button className="ip-btn ghost sm" onClick={() => window.print()}><Icon name="save" size={14} /> Print / PDF</button>}
      <style>{`@media print{.og-noprint{display:none !important}}`}</style>
    </div>
  );

  if (error) return <>{bar}<div className="ip-main"><div className="ip-alert bad">{error}</div></div></>;
  if (!p) return <>{bar}<div className="ip-empty">Loading the report…</div></>;
  if (!p.latestAssessment) return <>{bar}<div className="ip-empty">{p.name} hasn&apos;t completed the assessment yet - there&apos;s no report to show.</div></>;

  const report = prepareStudentReport(p.latestAssessment);
  return (
    <div style={{ background: "#f7f7f8", minHeight: "100vh" }}>
      {bar}
      {report.stale ? (
        <div className="ip-empty">This report was made by an earlier version of the assessment and can&apos;t be shown with the current scoring. Ask {p.name} to retake the assessment.</div>
      ) : (
        <FullReport
          a={report.summary}
          name={p.name}
          institution={p.institution || undefined}
          studentClass={p.category ? categoryLabel(p.category) : undefined}
          hideCareerFitSections={report.hideCareerFitSections}
          extraSheets={report.extraSheets}
        />
      )}
    </div>
  );
}
