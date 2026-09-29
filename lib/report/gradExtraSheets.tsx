"use client";

/**
 * Graduates (UG) analog of class11ExtraSheets.tsx - the one page that file
 * builds (PG entrance exams + a strengths/growth-areas/alternatives close)
 * had no Graduates equivalent at all, which is part of why the UG report
 * read as noticeably thinner than 11-12's. Same rendering pattern: plain
 * ReportSheet nodes appended to FullReport.tsx's `extraSheets`, inheriting
 * its chrome/CSS rather than introducing a second visual system.
 *
 * Unlike 11-12's version (entrance exams for the student's CURRENT stream,
 * since they haven't picked a degree yet), Graduates already have a degree -
 * the natural analog is PG entrance exams for their top-ranked cluster,
 * pulled from the same real Excel-sourced data clusterRoadmapsGrad.ts
 * already uses, not a new source.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import { Icon } from "@/app/Icons";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { dimensionScoresGrad } from "@/lib/report/adaptGraduate";
import { clusterRoadmapGradFor } from "@/lib/report/clusterRoadmapsGrad";

function SecHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="sechd">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p className="sub">{sub}</p> : null}
    </div>
  );
}
function PageHead({ icon, eyebrow, title, sub }: { icon: string; eyebrow: string; title: string; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <span style={{ width: 46, height: 46, borderRadius: 13, background: "var(--red-tint)", display: "grid", placeItems: "center", flex: "none" }}>
        <Icon name={icon} size={22} style={{ color: "var(--red)" }} />
      </span>
      <SecHead eyebrow={eyebrow} title={title} sub={sub} />
    </div>
  );
}

export function buildGradExtraSheets(output: GraduateScoreOutput): ReportSheet[] {
  const topCluster = output.clusterAffinities[0]?.cluster ?? "";
  const roadmap = clusterRoadmapGradFor(topCluster);
  const pgExams = roadmap?.pgInIndia.entranceExams ?? [];

  const scores = dimensionScoresGrad(output);
  const ranked = [...scores].sort((a, b) => b.score - a.score);
  const strengthToLeverage = ranked.slice(0, 3).map((d) => `${d.label} clarity (${d.score}/100)`);
  const growthAreas = ranked.slice(-3).reverse().map((d) => `${d.label} clarity (${d.score}/100)`);
  const lowest = ranked[ranked.length - 1];
  const alternativePaths = output.clusterAffinities.slice(1, 4).map((c) => c.cluster);

  return [
    {
      id: "grad-entrance-exams",
      kicker: "Exams, strengths & growth",
      node: (
        <>
          <PageHead icon="route" eyebrow="Real, stable facts - not guesses" title={`PG entrance exams for ${topCluster || "your top cluster"}`}
            sub="Based on your top-ranked Career Suitability cluster, sourced directly from current course data - not a guess. Requirements change, so always verify current eligibility with the official exam or institution before relying on this." />
          <div className="prose" style={{ marginTop: 20 }}>
            {pgExams.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pgExams.map((x, i) => (
                  <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>{x}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>We don&apos;t have a specific PG entrance-exam mapping for this cluster yet - talk to your department or a career counsellor about what your target PG programmes actually require.</p>
            )}
          </div>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            <SecHead eyebrow="Putting it all together" title="Your strengths, growth areas & other paths worth a look"
              sub="What's already working for you, what's worth deliberate practice, and a couple of alternative clusters worth a look." />
            <div className="twocard" style={{ marginTop: 20 }}>
              <div className="lc good">
                <h4>Strengths to leverage</h4>
                <ul>{strengthToLeverage.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
              <div className="lc grow">
                <h4>Growth areas</h4>
                <ul>{growthAreas.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            </div>
            {lowest && (
              <div className="recos" style={{ marginBottom: 16 }}>
                <div className="subhd">Worth keeping an eye on</div>
                <ol><li>{lowest.label} clarity is your least developed area right now ({lowest.score}/100) — worth deliberate practice rather than avoidance.</li></ol>
              </div>
            )}
            {alternativePaths.length > 0 && (
              <div className="prose">
                <div className="subhd">Other clusters worth exploring</div>
                <div className="dom-skills">{alternativePaths.map((x, i) => <span key={i} className="dom-skill">{x}</span>)}</div>
              </div>
            )}
          </div>
        </>
      ),
    },
  ];
}
