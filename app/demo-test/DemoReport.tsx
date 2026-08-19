"use client";

/**
 * /demo-test report.
 *
 * Everything the standard report shows (the eight-dimension profile, clusters,
 * strengths, aptitude), plus the two sections this demo exists for:
 *
 *   1. WANTED vs FOUND - the career the student named before the paper, set
 *      against what the paper measured, with the disagreement stated plainly
 *      when there is one.
 *   2. ROADMAPS - the detailed route for the desired career, and, when the two
 *      disagree, the route for the measured one too, side by side.
 *
 * The comparison is placed FIRST, above the charts. It is the question the
 * student actually came with, and burying it under radar plots would be a
 * design that flatters the engine rather than serving the reader.
 */

import { useState } from "react";
import { Logo } from "@/app/Logo";
import { C, Ring, RadarChart, SkillBar, dimColor, type RadarDatum } from "@/app/account/viz";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Summary = any;

export interface Figures {
  asOf: string;
  basis: string;
  confidence: string;
  reviewNeeded: boolean;
}

export interface DemoReportData {
  summary: Summary;
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

export default function DemoReport({ data, name, onExit }: {
  data: DemoReportData;
  name?: string;
  onExit: () => void;
}) {
  const { summary, alignment, desiredCareer, measuredCareer } = data;
  const [tab, setTab] = useState<"desired" | "measured">("desired");

  const radar: RadarDatum[] = (summary.radar ?? []).map((r: RadarDatum) => ({
    key: r.key, label: r.label, score: r.score,
  }));
  const v = alignment ? VERDICT_STYLE[alignment.verdict] : null;

  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header style={S.header} className="og-noprint">
        <Logo height={34} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={S.demoTag}>Demo report</span>
          <button style={S.exitBtn} onClick={onExit}>Go to dashboard</button>
        </div>
      </header>

      <main style={S.wrap}>
        <section style={S.hero}>
          <h1 style={S.h1}>{name ? `${name}, here is your report` : "Your career report"}</h1>
          <p style={S.heroSub}>
            {data.combination} &middot; {summary.matches?.length ?? 0} career matches &middot;
            {" "}60 questions across 8 dimensions
          </p>
        </section>

        {/* ===================== 1. WANTED vs FOUND ===================== */}
        {alignment && v && (
          <section style={{ ...S.card, background: v.bg, borderColor: v.line }}>
            <div style={S.verdictTop}>
              <span style={{ ...S.verdictIcon, background: v.ink }}>{v.icon}</span>
              <span style={{ ...S.verdictLabel, color: v.ink }}>{v.label}</span>
            </div>

            <h2 style={{ ...S.h2, color: v.ink }}>{alignment.headline}</h2>

            <div style={S.vsRow}>
              <div style={S.vsBox}>
                <div style={S.vsCap}>What you said you wanted</div>
                <div style={S.vsTitle}>{alignment.desired.title}</div>
                <div style={S.vsMeta}>{alignment.desired.clusterName}</div>
                {alignment.desiredClusterScore != null && (
                  <div style={S.vsScore}>
                    You scored {Math.round(alignment.desiredClusterScore)}% on this cluster
                    {alignment.desiredRank ? ` — rank ${alignment.desiredRank} of 8` : ""}
                  </div>
                )}
              </div>
              <div style={S.vsArrow}>vs</div>
              <div style={S.vsBox}>
                <div style={S.vsCap}>What the assessment found</div>
                <div style={S.vsTitle}>{alignment.measured.title}</div>
                <div style={S.vsMeta}>{alignment.measured.clusterName ?? "—"}</div>
                {alignment.measured.fitmentPct != null && (
                  <div style={S.vsScore}>{alignment.measured.fitmentPct}% profile alignment</div>
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
          </section>
        )}

        {/* ===================== 2. ROADMAPS ===================== */}
        <section style={S.card}>
          <h2 style={S.h2}>Your detailed roadmap</h2>
          {measuredCareer ? (
            <>
              <p style={S.cardSub}>
                Both routes are here. Read the one you chose first, then the one your answers point at
                &mdash; then decide for yourself. Nobody is telling you to switch.
              </p>
              <div style={S.tabRow}>
                <button
                  style={{ ...S.roadTab, ...(tab === "desired" ? S.roadTabOn : {}) }}
                  onClick={() => setTab("desired")}
                >
                  You chose: {desiredCareer.title}
                </button>
                <button
                  style={{ ...S.roadTab, ...(tab === "measured" ? S.roadTabOn : {}) }}
                  onClick={() => setTab("measured")}
                >
                  Assessment suggests: {measuredCareer.title}
                </button>
              </div>
              <RoadmapView career={tab === "desired" ? desiredCareer : measuredCareer} figures={data.figures} />
            </>
          ) : (
            <>
              <p style={S.cardSub}>
                Your choice and your results agree, so there is one road to walk. Here it is in detail.
              </p>
              <RoadmapView career={desiredCareer} figures={data.figures} />
            </>
          )}
        </section>

        {/* ===================== 3. THE PROFILE ===================== */}
        <section style={S.card}>
          <h2 style={S.h2}>Your eight-dimension profile</h2>
          <p style={S.cardSub}>
            Each dimension was scored separately. This is the evidence the comparison above is built on.
          </p>
          {radar.length > 0 && (
            <div style={S.radarWrap}><RadarChart data={radar} /></div>
          )}
          <div style={S.dimGrid}>
            {radar.map((r) => (
              <div key={r.key} style={S.dimCell}>
                <DimRing label={r.label} score={r.score} dimKey={r.key} />
              </div>
            ))}
          </div>
        </section>

        {summary.matches?.length > 0 && (
          <section style={S.card}>
            <h2 style={S.h2}>Your strongest career matches</h2>
            <p style={S.cardSub}>
              Ranked by how much of your weighted profile actually supports each one. This is a measure
              of fit, not a prediction of success.
            </p>
            {summary.matches.map((m: { title: string; fitmentPct: number; band: string; blurb: string }) => (
              <div key={m.title} style={S.matchRow}>
                <div style={{ flex: 1 }}>
                  <strong style={S.matchTitle}>{m.title}</strong>
                  <div style={S.matchBlurb}>{m.blurb}</div>
                </div>
                <div style={S.matchPct}>{m.fitmentPct}%</div>
              </div>
            ))}
          </section>
        )}

        {summary.themes?.length > 0 && (
          <section style={S.card}>
            <h2 style={S.h2}>Career clusters</h2>
            {summary.themes.map((t: { letter: string; title: string; score: number; meaning: string }) => (
              <div key={t.letter} style={{ marginBottom: 10 }}>
                <BarRow label={t.title} score={t.score} />
                <div style={S.clusterMeaning}>{t.meaning}</div>
              </div>
            ))}
          </section>
        )}

        {summary.topAptitudes?.length > 0 && (
          <section style={S.card}>
            <h2 style={S.h2}>Aptitude</h2>
            <p style={S.cardSub}>
              15 reasoning questions across six areas, weighted by difficulty. With two to three
              questions behind each area, read these as a shape rather than an exact mark.
            </p>
            {summary.topAptitudes.map((a: { skill: string; score: number }) => (
              <BarRow key={a.skill} label={a.skill} score={a.score} />
            ))}
          </section>
        )}

        <p style={S.disclaimer}>
          This is a demo report. It reflects the answers you gave today, read through established
          frameworks &mdash; RIASEC interests, the Big Five, multiple intelligences and emotional
          intelligence. It is a starting point for a conversation, not a limit on what you can become.
        </p>
      </main>
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
          <div key={e.name} style={S.examRow}>
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
        <ul style={S.ul}>{r.buildNow.map((x, i) => <li key={i} style={S.liAction}>{x}</li>)}</ul>
      </Block>

      <div style={S.twoCol}>
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
        <div style={S.salaryRow}>
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

/** A labelled dial. Ring itself draws only the arc; the caption is its child. */
function DimRing({ label, score, dimKey }: { label: string; score: number; dimKey: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <Ring value={score} size={92} stroke={9} color={dimColor(dimKey)}>
        <tspan style={{ fontSize: 19, fontWeight: 800, fill: C.ink }}>{Math.round(score)}</tspan>
      </Ring>
      <div style={{ fontSize: 11.5, color: C.ink3, marginTop: 6, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/** A named row with a bar, which is how every score list in this report reads. */
function BarRow({ label, score, color }: { label: string; score: number; color?: string }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.ink2 }}>{label}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink3 }}>{Math.round(score)}</span>
      </div>
      <SkillBar value={score} color={color} />
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
  page: { minHeight: "100vh", background: C.bg, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "#fff", borderBottom: `1px solid ${C.line}`, position: "sticky", top: 0, zIndex: 5 },
  demoTag: { fontSize: 11.5, fontWeight: 700, color: NAVY, background: "#eef1fb", border: "1px solid #dfe4f7", borderRadius: 999, padding: "5px 11px" },
  exitBtn: { padding: "9px 16px", background: NAVY, color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" },

  wrap: { maxWidth: 860, margin: "0 auto", padding: "24px 18px 70px" },
  hero: { marginBottom: 18 },
  h1: { fontSize: 26, fontWeight: 800, margin: "0 0 6px", letterSpacing: -.4 },
  heroSub: { fontSize: 13, color: C.ink3, margin: 0 },

  card: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "24px 22px", marginBottom: 16, boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
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
  liAction: { fontSize: 13.5, lineHeight: 1.65, color: C.ink2, marginBottom: 7, fontWeight: 500 },
  dayInLife: { fontSize: 13, color: C.ink3, lineHeight: 1.65, marginTop: 10, background: C.line2, borderRadius: 9, padding: "10px 13px" },

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

  radarWrap: { maxWidth: 420, margin: "0 auto 18px" },
  dimGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  dimCell: { display: "flex", justifyContent: "center" },

  matchRow: { display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: `1px solid ${C.line2}` },
  matchTitle: { fontSize: 14.5 },
  matchBlurb: { fontSize: 12, color: C.muted, marginTop: 2 },
  matchPct: { fontSize: 17, fontWeight: 800, color: NAVY },

  clusterMeaning: { fontSize: 11.5, color: C.muted, marginTop: -4, marginBottom: 8 },

  caveat: { fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: "10px 0 0",
            background: C.line2, borderRadius: 8, padding: "9px 11px" },
  disclaimer: { fontSize: 12, color: C.muted, lineHeight: 1.7, textAlign: "center", maxWidth: 640, margin: "26px auto 0" },
};

const CSS = `
@media print{ .og-noprint{display:none !important} }
@media(max-width:720px){
  .og-vs{flex-direction:column !important}
}`;
