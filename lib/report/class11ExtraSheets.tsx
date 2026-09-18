"use client";

/**
 * The Class 11-12 content that genuinely has no equivalent in the class 9-10
 * report: a 5-lens career-alignment read + stated aspiration, an action plan
 * + entrance exams, and a closing strengths/risks/growth-areas summary.
 * (Creativity, the other 11-12-only dimension, is rendered as a real ninth
 * dimension page by FullReport.tsx itself, not here — see CAT.creativity in
 * FullReport.tsx and Class11ScoreOutput.layer1.creativity in the adapter.)
 *
 * This file used to also own the snapshot/stream-fit, Career Suitability and
 * Career Selector Match sheets — those three are now built by
 * lib/report/careerFit1112Sheets.tsx instead, from the more detailed
 * careerfit1112.ts/careerFitEngine1112.ts model (a real ranked match against
 * 63 careers with stream-eligibility roadmaps, not this file's simpler
 * domain-affinity lookup). Removed here rather than kept alongside, so a
 * student sees one Fitment/Suitability/Selector answer, not two disagreeing
 * ones — see the "hideCareerFitSections" comment in FullReport.tsx for the
 * matching decision on the shared 15-domain section.
 *
 * Rendered as FullReport.tsx's `extraSheets`, so it inherits the exact same
 * sheet chrome, fonts and CSS classes as every other page instead of
 * introducing a second visual system.
 *
 * Grouped into pages that pair two related sections, separated by an inline
 * divider, rather than one page per section — a short section on its own
 * page just left a near-empty A4 sheet under `.sheet{min-height:297mm}`.
 *
 * Visual language deliberately borrows FullReport.tsx's own data-viz
 * primitives (Ring, SkillBar, Icon, dimColor) instead of plain text/pills,
 * and follows the same chrome-vs-data colour rule the rest of the report
 * uses: page furniture (icon circles, headings) stays brand red/ink, while
 * an actual measured dimension (personality, RIASEC, aptitude, strengths,
 * motivators) keeps its own DIM_COLORS hue wherever its score is shown —
 * see the "chrome stays ink/grey/red; only data marks take these hues"
 * comment in app/account/viz.tsx.
 *
 * Deliberately does NOT include specific recommended degrees, named
 * colleges or cutoff estimates — that content was cut earlier for being
 * fabricated (no real data source exists for per-college cutoffs here), and
 * rebuilding it with the same guesswork would repeat the exact mistake.
 * Only the real, stable facts (which entrance exam a stream typically
 * needs) are included.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import type { Class11ScoreOutput } from "@/lib/newAssessment/scoring11_12";
import { Icon } from "@/app/Icons";

function SecHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="sechd">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p className="sub">{sub}</p> : null}
    </div>
  );
}

// The one icon-circle-plus-heading treatment per page — gives each combined
// page the same "what am I looking at" visual anchor a dimension page gets
// from its hero image, without needing a full illustrated banner.
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

export function buildClass11ExtraSheets(output: Class11ScoreOutput): ReportSheet[] {
  const acad = output.layer2;
  const path = output.layer3;
  const sum = output.summary;

  return [
    {
      id: "career-entrance-exams-1112",
      kicker: "Entrance exams",
      node: (
        <>
          <PageHead icon="route" eyebrow="Real, stable facts — not guesses" title="Entrance exams typically linked to your stream"
            sub="This is based on your current stream, not your assessment scores — it stays the same even if your profile points elsewhere, because exam eligibility is set by subjects, not personality or interests. Requirements change, so always verify current eligibility with the official exam or institution before relying on this." />
          <div className="prose" style={{ marginTop: 20 }}>
            {path.entranceExamsRequired.length > 0 ? (
              <div className="twocard" style={{ gridTemplateColumns: "1fr" }}>
                <div className="lc good">
                  <h4>{acad.currentStream || "Your stream"}</h4>
                  <ul>{path.entranceExamsRequired.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
              </div>
            ) : (
              <p>We don't have a specific exam mapping for your stream yet — talk to your school counsellor about what your target courses actually require.</p>
            )}
          </div>
        </>
      ),
    },
    {
      id: "summary-action",
      kicker: "Strengths, risks & growth",
      node: (
        <>
          <PageHead icon="shield" eyebrow="Putting it all together" title="Your strengths, growth areas & other paths worth a look"
            sub="What's already working for you, what's worth deliberate practice, and a couple of alternative directions worth a look." />
          <div className="twocard" style={{ marginTop: 20 }}>
            <div className="lc good">
              <h4>Strengths to leverage</h4>
              <ul>{sum.strengthToLeverage.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div className="lc grow">
              <h4>Growth areas</h4>
              <ul>{sum.growthAreas.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          </div>
          {sum.riskFactors.length > 0 && (
            <div className="recos" style={{ marginBottom: 16 }}>
              <div className="subhd">Worth keeping an eye on</div>
              <ol>{sum.riskFactors.map((x, i) => <li key={i}>{x}</li>)}</ol>
            </div>
          )}
          {sum.alternativePaths.length > 0 && (
            <div className="prose">
              <div className="subhd">Other domains worth exploring</div>
              <div className="dom-skills">{sum.alternativePaths.map((x, i) => <span key={i} className="dom-skill">{x}</span>)}</div>
            </div>
          )}
        </>
      ),
    },
  ];
}
