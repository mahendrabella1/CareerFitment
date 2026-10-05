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

// Plain one-line explanations for the exam names that appear in the PG exam
// lists, shown under the list so students aren't left with bare acronyms.
// Only what each exam is for - no dates, fees or cut-offs, which change.
const EXAM_GLOSSARY: { match: RegExp; name: string; what: string }[] = [
  { match: /CUET-PG/, name: "CUET-PG", what: "Common University Entrance Test for master's admissions at central and many other universities." },
  { match: /\bGATE\b/, name: "GATE", what: "Graduate Aptitude Test in Engineering - for M.Tech/M.E. admissions and many public-sector (PSU) jobs." },
  { match: /IIT JAM/, name: "IIT JAM", what: "Joint Admission Test for Masters - for M.Sc and similar programmes at IITs and IISc." },
  { match: /\bJEST\b/, name: "JEST", what: "Joint Entrance Screening Test - for PhD and integrated PhD in physics and related subjects at research institutes." },
  { match: /\bCCMT\b/, name: "CCMT", what: "Not an exam - the counselling that allots M.Tech seats at NITs and other institutes using GATE scores." },
  { match: /\bCOAP\b/, name: "COAP", what: "Not an exam - the portal where IITs make M.Tech offers based on GATE scores." },
  { match: /PGECET/, name: "TS / AP PGECET", what: "Telangana and Andhra Pradesh state entrance tests for M.Tech and M.Pharm." },
  { match: /AP PGCET/, name: "AP PGCET", what: "Andhra Pradesh's entrance for master's programmes (M.A., M.Sc., M.Com.) at state universities." },
  { match: /\bICET\b/, name: "TS / AP ICET", what: "Telangana and Andhra Pradesh state entrance tests for MBA and MCA." },
  { match: /NIMCET/, name: "NIMCET", what: "Entrance for MCA (Master of Computer Applications) at NITs." },
  { match: /\bCAT\b/, name: "CAT", what: "Common Admission Test - for MBA programmes at IIMs and many other business schools." },
  { match: /\bXAT\b/, name: "XAT", what: "Entrance for MBA programmes at XLRI and other business schools." },
  { match: /\bCMAT\b/, name: "CMAT", what: "National entrance for AICTE-approved MBA/PGDM programmes." },
  { match: /\bNMAT\b/, name: "NMAT", what: "Entrance for MBA programmes at NMIMS and other business schools." },
  { match: /\bSNAP\b/, name: "SNAP", what: "Entrance for MBA programmes at Symbiosis institutes." },
  { match: /\bMAT\b/, name: "MAT", what: "Management Aptitude Test - accepted by many MBA/PGDM colleges." },
  { match: /MAH-CET/, name: "MAH-CET", what: "Maharashtra's state entrance for MBA programmes." },
  { match: /\bGMAT\b/, name: "GMAT", what: "Entrance for MBA programmes, mainly abroad and at some Indian business schools." },
  { match: /\bGRE\b/, name: "GRE", what: "Entrance for master's and PhD programmes abroad, mostly in the USA." },
  { match: /NEET-PG/, name: "NEET-PG", what: "Entrance for MD/MS and other postgraduate medical courses." },
  { match: /NEET-MDS/, name: "NEET-MDS", what: "Entrance for MDS (master's in dental surgery)." },
  { match: /NEET-SS/, name: "NEET-SS", what: "Entrance for super-speciality medical courses (DM/MCh) after MD/MS." },
  { match: /INI-CET/, name: "INI-CET", what: "Entrance for postgraduate medical seats at AIIMS, JIPMER, PGIMER and NIMHANS." },
  { match: /AIAPGET/, name: "AIAPGET", what: "Entrance for postgraduate AYUSH courses (Ayurveda, Homoeopathy, Siddha, Unani)." },
  { match: /\bGPAT\b/, name: "GPAT", what: "Graduate Pharmacy Aptitude Test - for M.Pharm admissions." },
  { match: /ICAR AIEEA/, name: "ICAR AIEEA-PG", what: "Entrance for master's in agriculture and related subjects at agricultural universities." },
  { match: /CLAT-PG/, name: "CLAT-PG", what: "Entrance for LLM (master's in law) at National Law Universities." },
  { match: /AILET-PG/, name: "AILET-PG", what: "Entrance for LLM at National Law University Delhi." },
  { match: /\bCEED\b/, name: "CEED", what: "Common Entrance Exam for Design - for M.Des at IITs and IISc." },
  { match: /NID DAT/, name: "NID DAT", what: "National Institute of Design's entrance for M.Des." },
  { match: /NIFT PG/, name: "NIFT PG", what: "NIFT's entrance for its master's programmes in design, fashion technology and management." },
];

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
  // Must match the Suitability page's own top cluster (rankSuitabilityGrad,
  // anchored to the student's real degree+course) - output.summary.topCluster
  // already goes through that same ranking (see scoreGraduateAssessment),
  // so this page never disagrees with the Suitability/Selector pages about
  // which cluster is "top."
  const topCluster = output.summary.topCluster || "";
  const roadmap = clusterRoadmapGradFor(topCluster);
  const pgExams = roadmap?.pgInIndia.entranceExams ?? [];

  // Pillars 1-2 (personality, interests) are preference profiles whose score
  // is consistency, not ability, so only the six skill pillars are compared.
  const scores = dimensionScoresGrad(output).slice(2);
  const ranked = [...scores].sort((a, b) => b.score - a.score);
  const strengthToLeverage = ranked.slice(0, 3).map((d) => `${d.label} (${d.score}/100)`);
  const growthAreas = ranked.slice(-3).reverse().map((d) => `${d.label} (${d.score}/100)`);
  const lowest = ranked[ranked.length - 1];
  // Purely psychometric order here (not rankSuitabilityGrad) - these are
  // explicitly framed as OTHER paths worth a look, so excluding topCluster
  // itself (which the degree-anchor could otherwise let slip in below rank
  // 1) keeps this list from just repeating what's already shown above.
  const alternativePaths = output.clusterAffinities.filter((c) => c.cluster !== topCluster).slice(0, 3).map((c) => c.cluster);

  return [
    {
      id: "grad-entrance-exams",
      kicker: "Exams, strengths & growth",
      node: (
        <>
          <PageHead icon="route" eyebrow="If you plan a master's" title={`PG entrance exams for ${topCluster || "your field"}`}
            sub="These are the exams commonly used for admission to master's (PG) programmes in your degree's field. Rules change every year, so check the official exam website before you apply." />
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
              <p>We don&apos;t have a list of PG entrance exams for this field yet - ask your department or a career counsellor which exams your target master&apos;s programmes use.</p>
            )}
            {(() => {
              const all = pgExams.join(" , ");
              const found = EXAM_GLOSSARY.filter((g) => g.match.test(all));
              return found.length ? (
                <div style={{ marginTop: 16, border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px", background: "var(--paper, #f8f7f3)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>What these exams are</div>
                  {found.map((g) => (
                    <p key={g.name} style={{ fontSize: 12.5, margin: "0 0 5px", lineHeight: 1.5 }}><b>{g.name}:</b> {g.what}</p>
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            <SecHead eyebrow="Putting it all together" title="Your strengths, growth areas & other paths worth a look"
              sub="Your strongest and weakest areas from this test, and a few other career areas worth exploring." />
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
                <ol><li>{lowest.label} is your least developed area right now ({lowest.score}/100) — worth deliberate practice rather than avoidance.</li></ol>
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
