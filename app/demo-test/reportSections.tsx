"use client";

/**
 * The two sections that make the class 11-12 demo report what it is:
 * the wanted-vs-found comparison, and the detailed roadmap(s).
 *
 * They live here rather than inside the /demo-test page because the report is
 * shown in TWO places and must be identical in both:
 *
 *   /demo-test   immediately after the paper, from the scoring response
 *   /account     any time afterwards, from what was saved on the profile
 *
 * They were originally only in the first. A student who finished the paper and
 * clicked through to their dashboard - or simply came back the next day - found
 * the standard report with no sign of the career they chose, the career they
 * were matched to, or the roadmap. The whole point of the demo was missing from
 * the place students actually return to.
 *
 * Both callers pass the same `DemoReportExtras`, so the two cannot diverge.
 */

import { useState } from "react";
import type { ExtraSection } from "@/app/account/Dashboard";
import { C } from "@/app/account/viz";

const NAVY = "#2f3f9e";

type Verdict = "strong" | "partial" | "divergent";

interface Alignment {
  verdict: Verdict;
  desired: { id: string; title: string; cluster: string; clusterName: string };
  measured: { title: string; cluster: string | null; clusterName: string | null; fitmentPct: number | null };
  desiredClusterScore: number | null;
  desiredRank: number | null;
  headline: string;
  explanation: string;
  nextSteps: string[];
}

interface Roadmap {
  entranceExams: { name: string; when: string; opens: string }[];
  afterSchool: { stage: string; years: string; what: string }[];
  topColleges: string[];
  coreSkills: string[];
  buildNow: string[];
  salary: { entry: string; mid: string; senior: string };
  realityCheck: string;
  whatYouDo: string[];
  dayInLife: string;
}

interface CareerBlock {
  id: string;
  title: string;
  clusterName: string;
  familyLabel: string;
  degrees: string[];
  blurb: string;
  roadmap: Roadmap;
  alternatives: { id: string; title: string; blurb: string; verdict: string; cluster: string }[];
}

export interface Figures {
  asOf: string;
  basis: string;
  confidence: string;
  reviewNeeded: boolean;
}

/**
 * Everything the two demo sections need, and nothing else.
 *
 * Deliberately self-contained - it carries the resolved roadmaps rather than
 * career ids - so rendering it from the profile later needs no lookup, no API
 * call and no risk of the catalogue having moved on underneath a saved report.
 */
export interface DemoReportExtras {
  figures?: Figures;
  alignment: Alignment | null;
  desiredCareer: CareerBlock;
  measuredCareer: CareerBlock | null;
  combination: string;
}

const VERDICT_STYLE: Record<Verdict, { bg: string; line: string; ink: string; label: string; icon: string }> = {
  strong: { bg: "#eaf6f0", line: "#bfe3d1", ink: "#1d6c4c", label: "Your choice and your results agree", icon: "✓" },
  partial: { bg: "#fdf6e8", line: "#f0dcb8", ink: "#8a5f18", label: "Close, but not the same career", icon: "≈" },
  divergent: { bg: "#fdeeed", line: "#f3ccc9", ink: "#8d3f39", label: "Your results point elsewhere", icon: "!" },
};

/* ===================== 1. WANTED vs FOUND ===================== */
function AlignmentSection({ alignment, bare }: { alignment: Alignment; bare?: boolean }) {
  const v = VERDICT_STYLE[alignment.verdict];
  // `bare` drops the dashboard card chrome. Inside the in-depth report each
  // section is already its own sheet, and a card within a page reads as a
  // stray widget rather than part of the document.
  return (
    <div
      className={bare ? undefined : "ogd-card"}
      style={bare
        ? { background: v.bg, border: `1px solid ${v.line}`, borderRadius: 14, padding: "20px 22px" }
        : { background: v.bg, borderColor: v.line }}
    >
      <div style={S.verdictTop}>
        <span style={{ ...S.verdictIcon, background: v.ink }}>{v.icon}</span>
        <span style={{ ...S.verdictLabel, color: v.ink }}>{v.label}</span>
      </div>
      <h2 style={{ ...S.h2, color: v.ink }}>{alignment.headline}</h2>

      <div style={S.vsRow} className="ogx-vs">
        <div style={S.vsBox}>
          <div style={S.vsCap}>What you said you wanted</div>
          <div style={S.vsTitle}>{alignment.desired.title}</div>
          <div style={S.vsMeta}>{alignment.desired.clusterName}</div>
          {alignment.desiredClusterScore != null && (
            <div style={S.vsScore}>
              {Math.round(alignment.desiredClusterScore)}% blended fit
              {alignment.desiredRank ? ` — rank ${alignment.desiredRank} of 8 fields` : ""}
            </div>
          )}
        </div>
        <div style={S.vsArrow}>vs</div>
        <div style={S.vsBox}>
          <div style={S.vsCap}>What the assessment found</div>
          <div style={S.vsTitle}>{alignment.measured.title}</div>
          <div style={S.vsMeta}>{alignment.measured.clusterName ?? "—"}</div>
          {alignment.measured.fitmentPct != null && (
            <div style={S.vsScore}>{alignment.measured.fitmentPct}% blended fit</div>
          )}
        </div>
      </div>

      <p style={S.explain}>{alignment.explanation}</p>

      <div style={S.stepsBox}>
        <div style={S.stepsTitle}>What to do about it</div>
        <ol style={S.steps}>
          {alignment.nextSteps.map((s, i) => <li key={i} style={S.step}>{s}</li>)}
        </ol>
      </div>
    </div>
  );
}

/* ===================== 2. ROADMAPS ===================== */
function RoadmapSection({ desired, measured, figures, bare }: {
  desired: CareerBlock; measured: CareerBlock | null; figures?: Figures; bare?: boolean;
}) {
  const [tab, setTab] = useState<"desired" | "measured">("desired");
  return (
    <div className={bare ? undefined : "ogd-card"}>
      <h2 style={S.h2}>Your detailed roadmap</h2>
      {measured ? (
        <>
          <p style={S.cardSub}>
            Both routes are here. Read the one you chose first, then the one your answers point at
            &mdash; then decide for yourself. Nobody is telling you to switch.
          </p>
          <div style={S.tabRow}>
            <button style={{ ...S.roadTab, ...(tab === "desired" ? S.roadTabOn : {}) }} onClick={() => setTab("desired")}>
              You chose: {desired.title}
            </button>
            <button style={{ ...S.roadTab, ...(tab === "measured" ? S.roadTabOn : {}) }} onClick={() => setTab("measured")}>
              Assessment suggests: {measured.title}
            </button>
          </div>
          <RoadmapView career={tab === "desired" ? desired : measured} figures={figures} />
        </>
      ) : (
        <>
          <p style={S.cardSub}>
            Your choice and your results agree, so there is one road to walk. Here it is in detail.
          </p>
          <RoadmapView career={desired} figures={figures} />
        </>
      )}
    </div>
  );
}

function RoadmapView({ career, figures }: { career: CareerBlock; figures?: Figures }) {
  const r = career.roadmap;
  return (
    <div>
      <div style={S.roadHead}>
        <div>
          <div style={S.roadTitle}>{career.title}</div>
          <div style={S.roadMeta}>{career.familyLabel} &middot; {career.clusterName}</div>
        </div>
      </div>
      <p style={S.roadBlurb}>{career.blurb}</p>

      <Block title="What you would actually do">
        <ul style={S.ul}>{r.whatYouDo.map((x, i) => <li key={i} style={S.li}>{x}</li>)}</ul>
        {r.dayInLife && <p style={S.dayInLife}><b>A typical day:</b> {r.dayInLife}</p>}
      </Block>

      <Block title="Entrance exams to plan for">
        <p style={S.caveat}>
          Exam windows shift by a few weeks each year. Treat the months below as the shape of the
          calendar and confirm exact dates on each board&rsquo;s official site.
        </p>
        {r.entranceExams.map((e) => (
          <div key={e.name} style={S.examRow} className="ogx-exam">
            <div style={S.examName}>{e.name}</div>
            <div style={S.examWhen}>{e.when}</div>
            <div style={S.examOpens}>{e.opens}</div>
          </div>
        ))}
      </Block>

      <Block title="The path, stage by stage">
        <ol style={S.timeline}>
          {r.afterSchool.map((s, i) => (
            <li key={i} style={S.timelineItem}>
              <div style={S.tlStage}>{s.stage}</div>
              <div style={S.tlYears}>{s.years}</div>
              <div style={S.tlWhat}>{s.what}</div>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Start this year — while you are still in school">
        <ul style={S.ul}>{r.buildNow.map((x, i) => <li key={i} style={S.li}>{x}</li>)}</ul>
      </Block>

      <div style={S.twoCol} className="ogx-two">
        <Block title="Skills that matter">
          <ul style={S.ul}>{r.coreSkills.map((x, i) => <li key={i} style={S.li}>{x}</li>)}</ul>
        </Block>
        <Block title="Where people study this">
          <ul style={S.ul}>{r.topColleges.map((x, i) => <li key={i} style={S.li}>{x}</li>)}</ul>
          <p style={S.caveat}>
            Representative institutions, not a ranking and not an exhaustive list. Cut-offs, fees
            and intake change every year &mdash; confirm against the current prospectus.
          </p>
        </Block>
      </div>

      <Block title="What it pays">
        <div style={S.salaryRow} className="ogx-sal">
          {(["entry", "mid", "senior"] as const).map((k) => (
            <div key={k} style={S.salaryCell}>
              <div style={S.salaryCap}>{k === "entry" ? "Starting" : k === "mid" ? "Mid-career" : "Senior"}</div>
              <div style={S.salaryVal}>{r.salary[k]}</div>
            </div>
          ))}
        </div>
        <p style={S.caveat}>
          <b>Indicative ranges, not quotes.</b>{" "}
          {figures?.confidence ??
            "Pay varies widely by city, institution and employer; read these as orders of magnitude."}
          {figures?.asOf ? ` Compiled ${figures.asOf}; check current figures before relying on them.` : ""}
        </p>
      </Block>

      {r.realityCheck && (
        <div style={S.reality}>
          <div style={S.realityCap}>The honest part</div>
          <p style={S.realityText}>{r.realityCheck}</p>
        </div>
      )}

      {career.degrees.length > 0 && (
        <Block title="Degrees that lead here from your stream">
          <div style={S.degreeWrap}>
            {career.degrees.map((d) => <span key={d} style={S.degreeChip}>{d}</span>)}
          </div>
        </Block>
      )}

      {career.alternatives.length > 0 && (
        <Block title="Related careers your stream also opens">
          {career.alternatives.map((a) => (
            <div key={a.id} style={S.altRow}>
              <strong style={S.altTitle}>{a.title}</strong>
              <span style={S.altBlurb}>{a.blurb}</span>
            </div>
          ))}
        </Block>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={S.block}>
      <div style={S.blockTitle}>{title}</div>
      {children}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  h2: { fontSize: 18, fontWeight: 800, margin: "0 0 6px" },
  cardSub: { fontSize: 13, color: C.ink3, lineHeight: 1.6, margin: "0 0 16px" },

  verdictTop: { display: "flex", alignItems: "center", gap: 9, marginBottom: 10 },
  verdictIcon: { width: 22, height: 22, borderRadius: "50%", color: "#fff", fontSize: 13, fontWeight: 800, display: "grid", placeItems: "center" },
  verdictLabel: { fontSize: 11.5, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase" },

  vsRow: { display: "flex", alignItems: "stretch", gap: 12, margin: "16px 0" },
  vsBox: { flex: 1, background: "rgba(255,255,255,.72)", borderRadius: 12, padding: "14px 15px" },
  vsCap: { fontSize: 10.5, fontWeight: 800, letterSpacing: .4, textTransform: "uppercase", color: C.muted, marginBottom: 6 },
  vsTitle: { fontSize: 16.5, fontWeight: 800, lineHeight: 1.3 },
  vsMeta: { fontSize: 12, color: C.ink3, marginTop: 3 },
  vsScore: { fontSize: 11.5, color: C.ink3, marginTop: 8, fontWeight: 600 },
  vsArrow: { alignSelf: "center", fontSize: 12, fontWeight: 800, color: C.muted, textTransform: "uppercase" },

  explain: { fontSize: 14, lineHeight: 1.72, color: C.ink2, margin: "0 0 16px" },
  stepsBox: { background: "rgba(255,255,255,.72)", borderRadius: 12, padding: "14px 16px" },
  stepsTitle: { fontSize: 11.5, fontWeight: 800, letterSpacing: .4, textTransform: "uppercase", color: C.muted, marginBottom: 8 },
  steps: { margin: 0, paddingLeft: 18 },
  step: { fontSize: 13.5, lineHeight: 1.65, color: C.ink2, marginBottom: 7 },

  tabRow: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  roadTab: { padding: "10px 16px", border: `1.5px solid ${C.line}`, background: "#fff", borderRadius: 9, fontSize: 12.5, fontWeight: 700, color: C.ink3, cursor: "pointer" },
  roadTabOn: { borderColor: NAVY, background: "#eef1fb", color: NAVY },

  roadHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  roadTitle: { fontSize: 19, fontWeight: 800 },
  roadMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  roadBlurb: { fontSize: 14, color: C.ink2, lineHeight: 1.65, margin: "0 0 18px" },

  block: { marginBottom: 20 },
  blockTitle: { fontSize: 11.5, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase", color: NAVY, marginBottom: 9, paddingBottom: 6, borderBottom: `1px solid ${C.line}` },
  ul: { margin: 0, paddingLeft: 18 },
  li: { fontSize: 13.5, lineHeight: 1.65, color: C.ink2, marginBottom: 5 },
  dayInLife: { fontSize: 13, color: C.ink3, lineHeight: 1.65, marginTop: 10, background: C.line2, borderRadius: 9, padding: "10px 13px" },

  caveat: { fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: "10px 0 0", background: C.line2, borderRadius: 8, padding: "9px 11px" },

  examRow: { display: "grid", gridTemplateColumns: "1.1fr 1fr 1.4fr", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.line2}`, fontSize: 12.5 },
  examName: { fontWeight: 700, color: C.ink },
  examWhen: { color: C.ink3 },
  examOpens: { color: C.ink3 },

  timeline: { margin: 0, paddingLeft: 18 },
  timelineItem: { marginBottom: 12 },
  tlStage: { fontSize: 13.5, fontWeight: 700 },
  tlYears: { fontSize: 11.5, color: NAVY, fontWeight: 600, margin: "1px 0 3px" },
  tlWhat: { fontSize: 13, color: C.ink3, lineHeight: 1.6 },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },

  salaryRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  salaryCell: { background: C.line2, borderRadius: 10, padding: "12px 13px" },
  salaryCap: { fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4, color: C.muted, marginBottom: 4 },
  salaryVal: { fontSize: 13.5, fontWeight: 700, color: C.ink },

  reality: { background: "#fdf6e8", border: "1px solid #f0dcb8", borderRadius: 12, padding: "14px 16px", marginBottom: 20 },
  realityCap: { fontSize: 10.5, fontWeight: 800, letterSpacing: .4, textTransform: "uppercase", color: "#8a5f18", marginBottom: 6 },
  realityText: { fontSize: 13.5, lineHeight: 1.68, color: "#6d4d16", margin: 0 },

  degreeWrap: { display: "flex", flexWrap: "wrap", gap: 7 },
  degreeChip: { fontSize: 12, fontWeight: 600, color: C.ink2, background: C.line2, border: `1px solid ${C.line}`, borderRadius: 999, padding: "5px 11px" },

  altRow: { padding: "9px 0", borderBottom: `1px solid ${C.line2}` },
  altTitle: { fontSize: 13.5, display: "block" },
  altBlurb: { fontSize: 12.5, color: C.ink3, lineHeight: 1.55 },
};

const CSS = `
@media(max-width:720px){
  .ogx-vs{flex-direction:column !important}
  .ogx-two{grid-template-columns:1fr !important}
  .ogx-sal{grid-template-columns:1fr !important}
  .ogx-exam{grid-template-columns:1fr !important;gap:2px !important}
}`;


/**
 * The demo's two sections, ready to hand to Dashboard.
 *
 * `alignment` is anchored ahead of the dimensions because it answers the
 * question the student actually came with; the charts below it are the
 * evidence for that answer, not a substitute for it.
 */
export function demoExtraSections(data: DemoReportExtras): ExtraSection[] {
  const out: ExtraSection[] = [];
  if (data.alignment) {
    out.push({
      id: "alignment",
      label: "Your choice vs your result",
      icon: "compass",
      before: "dimensions",
      inFullReport: true,
      node: <AlignmentSection alignment={data.alignment} />,
      reportNode: <AlignmentSection alignment={data.alignment} bare />,
    });
  }
  out.push({
    id: "roadmap",
    label: "Your roadmap",
    icon: "route",
    inFullReport: true,
    node: (
      <RoadmapSection
        desired={data.desiredCareer}
        measured={data.measuredCareer}
        figures={data.figures}
      />
    ),
    reportNode: (
      <RoadmapSection
        desired={data.desiredCareer}
        measured={data.measuredCareer}
        figures={data.figures}
        bare
      />
    ),
  });
  return out;
}
