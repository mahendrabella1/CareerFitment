"use client";

/**
 * The Class 11-12 content that genuinely has no equivalent in the class 9-10
 * report: a 5-lens career-alignment read + stated aspiration, an action plan
 * + entrance exams, and a closing strengths/risks/growth-areas summary.
 * (Creativity, the other 11-12-only dimension, is rendered as a real ninth
 * dimension page by FullReport.tsx itself, not here - see CAT.creativity in
 * FullReport.tsx and Class11ScoreOutput.layer1.creativity in the adapter.)
 *
 * This file used to also own the snapshot/stream-fit, Career Suitability and
 * Career Selector Match sheets - those three are now built by
 * lib/report/careerFit1112Sheets.tsx instead, from the more detailed
 * careerfit1112.ts/careerFitEngine1112.ts model (a real ranked match against
 * 63 careers with stream-eligibility roadmaps, not this file's simpler
 * domain-affinity lookup). Removed here rather than kept alongside, so a
 * student sees one Fitment/Suitability/Selector answer, not two disagreeing
 * ones - see the "hideCareerFitSections" comment in FullReport.tsx for the
 * matching decision on the shared 15-domain section.
 *
 * Rendered as FullReport.tsx's `extraSheets`, so it inherits the exact same
 * sheet chrome, fonts and CSS classes as every other page instead of
 * introducing a second visual system.
 *
 * Grouped into pages that pair two related sections, separated by an inline
 * divider, rather than one page per section - a short section on its own
 * page just left a near-empty A4 sheet under `.sheet{min-height:297mm}`.
 *
 * Visual language deliberately borrows FullReport.tsx's own data-viz
 * primitives (Ring, SkillBar, Icon, dimColor) instead of plain text/pills,
 * and follows the same chrome-vs-data colour rule the rest of the report
 * uses: page furniture (icon circles, headings) stays brand red/ink, while
 * an actual measured dimension (personality, RIASEC, aptitude, strengths,
 * motivators) keeps its own DIM_COLORS hue wherever its score is shown -
 * see the "chrome stays ink/grey/red; only data marks take these hues"
 * comment in app/account/viz.tsx.
 *
 * Deliberately does NOT include specific recommended degrees, named
 * colleges or cutoff estimates - that content was cut earlier for being
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

// The one icon-circle-plus-heading treatment per page - gives each combined
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

// The exact exam name strings getEntranceExams() (scoring11_12.ts) can
// return, each enriched with its real conducting body and official site -
// long-stable, well-known facts (the same ones already verified elsewhere
// in this report, e.g. CLUSTER_EXPLORE_LINKS), not fresh guesses.
const EXAM_INFO: Record<string, { body: string; note: string; url: string }> = {
  "JEE Main": { body: "NTA", note: "Gateway to NITs, IITs, IIITs and GFTIs - also the qualifier for JEE Advanced.", url: "https://jeemain.nta.nic.in/" },
  "JEE Advanced": { body: "One of the IITs (host rotates yearly)", note: "Only for students who clear JEE Main - for admission to the IITs.", url: "https://jeeadv.ac.in/" },
  "BITSAT": { body: "BITS Pilani", note: "BITS Pilani's own entrance test for its Pilani, Goa and Hyderabad campuses.", url: "https://www.bitsadmission.com/" },
  "NEET": { body: "NTA", note: "Gateway to MBBS, BDS, AYUSH and most nursing/allied-health seats nationwide.", url: "https://neet.nta.nic.in/" },
  "CLAT": { body: "Consortium of NLUs", note: "For admission to the National Law Universities.", url: "https://consortiumofnlus.ac.in/" },
  "CUET": { body: "NTA", note: "For undergraduate admission to central universities and many others that accept it.", url: "https://cuet.nta.nic.in/" },
  "CA Foundation": { body: "ICAI", note: "The entry-level exam to start the Chartered Accountancy course.", url: "https://www.icai.org/" },
  // State-level engineering CETs - each state runs its own, and which ones
  // matter depends entirely on which state's colleges a student is
  // targeting, not on their stream alone.
  "MHT-CET": { body: "Maharashtra State CET Cell", note: "Maharashtra's own entrance for engineering, pharmacy and agriculture admissions.", url: "https://cetcell.mahacet.org/" },
  "KCET": { body: "Karnataka Examinations Authority", note: "Karnataka's state entrance for government-quota engineering and medical seats.", url: "https://cetonline.karnataka.gov.in/" },
  "WBJEE": { body: "WBJEE Board", note: "West Bengal's state entrance for engineering, pharmacy and architecture admissions.", url: "https://wbjeeb.nic.in/" },
  "COMEDK UGET": { body: "COMEDK (Karnataka private colleges)", note: "A common entrance accepted by roughly 190 private engineering colleges in Karnataka.", url: "https://www.comedk.org/" },
  "KEAM": { body: "CEE Kerala", note: "Kerala's own entrance for engineering, medical and pharmacy admissions.", url: "https://cee.kerala.gov.in/" },
  "AP EAPCET": { body: "APSCHE, via JNTU Kakinada", note: "Andhra Pradesh's state entrance for engineering, agriculture and pharmacy admissions.", url: "https://cets.apsche.ap.gov.in/EAPCET/" },
  "TS EAPCET": { body: "Telangana Council of Higher Education", note: "Telangana's state entrance for engineering, agriculture and pharmacy admissions.", url: "https://eapcet.tgche.ac.in/" },
  "NDA": { body: "UPSC", note: "A commissioned-officer route into the Army, Navy or Air Force - a written exam followed by an SSB interview.", url: "https://upsc.gov.in/" },
  "NATA": { body: "Council of Architecture", note: "The standard entrance for B.Arch admission, alongside JEE Main's Paper 2.", url: "https://www.nata.in/" },
  "ICAR AIEEA": { body: "NTA, on behalf of ICAR", note: "The standard national route into agriculture, forestry and allied-science undergraduate degrees.", url: "https://exams.nta.ac.in/ICAR/" },
  "AILET": { body: "National Law University, Delhi", note: "NLU Delhi's own separate law entrance - CLAT doesn't cover this specific university.", url: "https://nationallawuniversitydelhi.in/" },
  "CMA Foundation": { body: "ICMAI", note: "The entry-level exam to start the Cost & Management Accountancy course.", url: "https://icmai.in/" },
  "CS Foundation": { body: "ICSI", note: "The entry-level exam to start the Company Secretary course.", url: "https://www.icsi.edu/" },
  "IPMAT": { body: "IIM Indore (also Rohtak, Jammu, Bodh Gaya)", note: "For the 5-year Integrated Programme in Management straight after Class 12, combining a bachelor's degree and an MBA.", url: "https://www.iimidr.ac.in/" },
};

export function buildClass11ExtraSheets(output: Class11ScoreOutput): ReportSheet[] {
  const acad = output.layer2;
  const path = output.layer3;
  const sum = output.summary;

  return [
    {
      id: "career-entrance-exams-1112",
      kicker: "Exams, strengths & growth",
      node: (
        <>
          <PageHead icon="route" eyebrow="Real, stable facts - not guesses" title={`Entrance exams for ${acad.currentStream || "your stream"}`}
            sub="Based on your current stream, not your assessment scores - it stays the same even if your profile points elsewhere, because exam eligibility is set by subjects, not personality or interests. Requirements change, so always verify current eligibility with the official exam or institution before relying on this." />
          <div className="prose" style={{ marginTop: 20 }}>
            {path.entranceExamsRequired.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {path.entranceExamsRequired.map((x, i) => {
                  const info = EXAM_INFO[x];
                  return (
                    <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>{x}</span>
                        {info && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>· conducted by {info.body}</span>}
                      </div>
                      {info ? (
                        <>
                          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>{info.note}</p>
                          <a href={info.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 6, fontSize: 11.5, fontWeight: 700, color: "var(--red)", textDecoration: "none" }}>Official site ↗</a>
                        </>
                      ) : (
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5 }}>{x}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>We don't have a specific exam mapping for your stream yet - talk to your school counsellor about what your target courses actually require.</p>
            )}
          </div>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            <SecHead eyebrow="Putting it all together" title="Your strengths, growth areas & other paths worth a look"
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
          </div>
        </>
      ),
    },
  ];
}
