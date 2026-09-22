"use client";

/**
 * FullReport - the in-depth, magazine-grade career report (2026, v3).
 *
 * ~30 sections, one coherent design system (white / near-black / grey with a
 * single light-red accent), blending the best of the reference reports:
 *   · branded 8-dimension cover image + real stock-photo section bands
 *   · at-a-glance verdict table (traffic-light)      [SACS]
 *   · profile wheel + five-trait wheel (rose charts)  [Clevry]
 *   · RIASEC hexagon, radar, donuts, vertical & horizontal bars
 *   · career metric-badge cards (Bright Outlook / Salary / Automation / Future)
 *                                                    [TUCareers / CareerNaksha]
 *   · benchmark-vs-peers panel with percentiles
 *
 * Data comes from the saved assessment; narrative from lib/report/knowledge.
 * Scroll-reveal on screen. This is a VIEW-ONLY surface - <ViewOnlyReport/> (from
 * the parent) blanks the page on print, and the PDF students actually keep is
 * the one emailed to them, rendered server-side by lib/report/reportPdf.tsx.
 * The per-sheet pagination CSS below is kept so the layout can be printed again
 * by re-enabling that guard, but it has no effect while it's mounted.
 */

import { Fragment, useEffect, useMemo, useRef, type ReactNode } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, RadarChart, SkillBar, dimColor, type RadarDatum } from "@/app/account/viz";
import { Scene } from "@/app/account/illustrations";
import { CareerCard, getCareerVisual, CareerImageWithSVG } from "@/app/account/careerVisuals";
import { getImageForRole } from "@/app/account/careerRoleImages";
import { PersonalityMBTI, getMBTIType } from "@/app/account/PersonalityMBTI";
import {
  categoryDeepDive, roadmap, stageLabelOf, DOMAINS,
  percentileOf, subTraits, type Domain,
  traitProfile, resultOf, domainFit, type DomainFit,
  FUTURE, LEARNING, JOB_PORTALS, SCHOLARSHIPS_2026,
  PARENT_TIPS, eiQuadrants,
} from "@/lib/report/knowledge";

/* ------------------------------- assets -------------------------------- */
const LOGO = "/onegrasp-logo-tight.png";

/**
 * Colour per best-fit rank - green, amber, blue. Rank, not domain: the point is
 * to separate 1st / 2nd / 3rd at a glance, and it stays stable no matter which
 * domains come out on top. Ordered warm-to-cool so the strongest reads first.
 * All three sit near the same perceived weight, so none of them looks like a
 * warning next to the others.
 */
export const RANK_COLOURS = ["#12996b", "#e08a1e", "#2f6bff", "#8b5cf6", "#64748b"] as const;
// Rank order within a domain's role list, not an absolute score threshold -
// clustered percentages (e.g. 40/38/36/34/32, all technically "Low") still
// read as a clear green-to-red ladder instead of five identical grey pills.
const ROLE_GRADIENT = ["#12996b", "#7cb342", "#e08a1e", "#e2673b", "#E23B41"] as const;
// Same fallback pattern as careerFit1112Sheets.tsx's own SITE_URL_1112 - this
// report can be viewed as a downloaded/emailed PDF, not just in-app, so a
// link into the dashboard needs an absolute URL, not a relative path that
// would 404 outside the app shell.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");
const DASHBOARD_LINKS: { label: string; path: string; note: string }[] = [
  { label: "Live Internships", path: "/account/internships-new", note: "Real internship listings on your dashboard" },
  { label: "Career Library", path: "/account/career-library", note: "Deep-dive into hundreds of real career paths" },
  { label: "Entrance Exams", path: "/account/features/entrance-exams", note: "Exam dates, syllabus and prep resources" },
  { label: "Scholarships & Funding", path: "/account/features/scholarships", note: "Curated funding opportunities on your dashboard" },
];
const P = "https://onegrasp.com/wp-content/uploads/2026/07/";
const DIMS8 = P + "ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";
const COVER_ART = "https://onegrasp.com/wp-content/uploads/2026/09/0313fb3f-1b32-4e53-a3c9-3136f410247d.png";

type Meta = { label: string; dim: string; icon: string; img?: string };
const CAT: Record<string, Meta> = {
  personality: { label: "Personality", dim: "01", icon: "personality", img: P + "personality.png" },
  career_interest: { label: "Career Interest", dim: "02", icon: "career_interest", img: P + "career-interest.png" },
  multiple_intelligence: { label: "Multiple Intelligence", dim: "03", icon: "multiple_intelligence", img: P + "Multiple-intelligence.png" },
  emotional_intelligence: { label: "Emotional Intelligence", dim: "04", icon: "emotional_intelligence", img: P + "Emotional-inteliigence.png" },
  learning_styles: { label: "Learning Preferences", dim: "05", icon: "learning_styles", img: P + "Learning-stykes.png" },
  motivators: { label: "Motivators", dim: "06", icon: "motivators", img: P + "Motivators.png" },
  strengths: { label: "Strengths", dim: "07", icon: "strengths", img: P + "strenghts.png" },
  aptitude: { label: "Aptitude", dim: "08", icon: "aptitude", img: P + "aptitude.png" },
  // Not one of the 9-10 paper's eight - only rendered when a journey's own
  // radar actually includes a creativity score (see `radar` below), so
  // class 9-10 is completely unaffected.
  creativity: { label: "Creativity & Innovation", dim: "09", icon: "bulb", img: "https://onegrasp.com/wp-content/uploads/2026/09/ChatGPT-Image-Sep-11-2026-08_26_14-PM.png" },
};
const CANON = ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence", "learning_styles", "motivators", "strengths", "aptitude"];

// "Typical student at your stage" markers - presentation-only benchmark.
const BENCH: Record<string, number> = {
  personality: 55, career_interest: 52, multiple_intelligence: 54, emotional_intelligence: 56,
  learning_styles: 58, motivators: 55, strengths: 50, aptitude: 52, creativity: 52,
};

/** The short "what actually came out on top" name for a dimension - e.g. the
 *  learning style a student leans on, or their top motivator - so the
 *  scorecard can read "Sensing · 72%" instead of a bare percentage.
 *  Personality's own MBTI code is handled separately by the caller. */
function topResultFor(key: string, a: AssessmentSummary, riasec: { letter: string; title: string; score: number }[]): string | undefined {
  switch (key) {
    case "career_interest": return riasec.slice().sort((x, y) => y.score - x.score)[0]?.title;
    case "multiple_intelligence": return (a.topIntelligences ?? []).slice().sort((x, y) => y.score - x.score)[0]?.name;
    case "emotional_intelligence": return eiQuadrants(a).slice().sort((x, y) => y.value - x.value)[0]?.label;
    case "learning_styles": return (a.learningStyles ?? []).slice().sort((x, y) => y.score - x.score)[0]?.name;
    case "motivators": return (a.topValues ?? []).slice().sort((x, y) => y.score - x.score)[0]?.tag;
    case "strengths": return (a.strengthsBreakdown ?? []).slice().sort((x, y) => y.score - x.score)[0]?.name;
    case "aptitude": return (a.topAptitudes ?? []).slice().sort((x, y) => y.score - x.score)[0]?.skill;
    default: return undefined;
  }
}

const clamp = (n: number) => Math.max(3, Math.min(100, Math.round(n)));
// Labels deliberately avoid a blunt "Weak"/"Low" at the bottom of the
// scale - a student reading their own report about a below-average score
// shouldn't be told they're "weak" at something outright. "Developing" and
// "Emerging" say the same honest thing (this score is on the lower end)
// while framing it as a stage, not a verdict.
const bandOf = (p: number) =>
  p >= 75 ? { label: "Very High", tone: "hi" } : p >= 65 ? { label: "High", tone: "hi" }
  : p >= 50 ? { label: "Medium", tone: "mid" } : p >= 35 ? { label: "Developing", tone: "lo" }
  : { label: "Emerging", tone: "lo" };

/**
 * Extra report sheets, appended before the closing page.
 *
 * The class 11-12 demo needs its wanted-vs-found comparison and roadmaps in
 * the in-depth report too, not only on the dashboard. A student who opened
 * "Full report" previously got the standard report with no sign of the career
 * they chose - the very thing the demo exists to tell them.
 *
 * Each entry becomes its own `.sheet`, so it reads as part of the report
 * rather than a dashboard card that wandered in. Omit the prop and the report
 * is exactly what it always was.
 */
export interface ReportSheet {
  id: string;
  /** Small caps label in the sheet header, e.g. "Your choice vs your result". */
  kicker: string;
  node: ReactNode;
}

export default function FullReport({ a, name, institution, studentClass, extraSheets = [], hideCareerFitSections = false }: { a: AssessmentSummary; name?: string; institution?: string; studentClass?: string; extraSheets?: ReportSheet[]; /** Classes 11/12 replace these two sections with their own Fitment/Suitability/Selector pages (see careerFit1112Sheets.tsx) - passed in via extraSheets instead, so the shared 15-domain ranking isn't shown alongside a disagreeing, more detailed one. */ hideCareerFitSections?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revs = root.current?.querySelectorAll(".rv");
    if (!revs) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
      );
      revs.forEach((e) => io.observe(e));
      const t = window.setTimeout(() => revs.forEach((e) => e.classList.add("in")), 2400);
      return () => { io.disconnect(); window.clearTimeout(t); };
    }
    revs.forEach((e) => e.classList.add("in"));
  }, []);

  const radar: RadarDatum[] = useMemo(() => {
    const src = ((a.radar ?? []).length ? a.radar! : []).map((r) => ({ ...r, bench: BENCH[r.key] || 50 }));
    // Creativity isn't one of the fixed eight - only add it as a ninth
    // dimension (radar chart included) when this journey's own data actually
    // measured it, so class 9-10's radar and dimension pages stay exactly
    // eight, unchanged.
    const keys = src.some((r) => r.key === "creativity") ? [...CANON, "creativity"] : CANON;
    return keys.map((k) => src.find((r) => r.key === k) ?? { key: k, label: CAT[k].label, score: 0, bench: BENCH[k] || 50 });
  }, [a.radar]);
  const dimWord = radar.length === 9 ? "nine" : "eight";
  // Coherent recommendations: blend interest + abilities + intelligences + values.
  const fits = domainFit(a);
  const domainList = fits.slice(0, 5);
  const topDomain = domainList[0];
  const phases = roadmap(stageLabelOf(a.journeyCode), topDomain.name);
  const roles = coherentRoles(a, fits);
  const traits = traitProfile(a);
  const themes = (a.themes ?? []).slice();
  // Holland themes are their own vector (R/I/A/S/E/C). `themes` holds CAREER
  // CLUSTER letters (A–H) - feeding those to the hexagon mislabels clusters as
  // Holland types, so use the real RIASEC scores whenever the engine has them.
  const riasec = (a.riasecScores ?? []).length
    ? a.riasecScores!.map((r) => ({ letter: r.letter, title: r.name, score: r.score }))
    : themes.filter((t) => "RIASEC".includes(t.letter));
  const dateStr = (() => { try { return new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } })();
  const first = (name || "").trim().split(/\s+/)[0] || "you";
  // Hoisted out of the per-dimension-page map below (where it's still used
  // for the MBTI compass) so the scorecard, earlier in the page, can also
  // show a real 4-letter type instead of a bare score for Personality.
  const hasMBTIData = !!(
    (a as any).mbtiEI !== undefined ||
    (a as any).mbtiSN !== undefined ||
    (a as any).mbtiTF !== undefined ||
    (a as any).mbtiJP !== undefined
  );

  let sheet = 0;
  const N = () => String(++sheet).padStart(2, "0");

  return (
    <div ref={root} className="frx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ===== COVER ===== */}
      <section className="sheet cover rv">
        <div className="cover-in">
          <div className="cover-logo-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cover-logo" src={LOGO} alt="OneGrasp" />
          </div>
          <span className="cover-badge">{dimWord} dimensions · scientifically structured</span>
          <h1 className="cover-title">Career Fitment Report</h1>
          <p className="cover-lede">
            A complete, evidence-based map of your strengths, interests and natural wiring -
            built from your own responses, scored across eight established frameworks and
            benchmarked against students at your stage.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cover-art" src={COVER_ART} alt="The eight dimensions this report measures" loading="lazy" />
          <div className="cover-student">
            <span className="cover-student-lbl">Prepared for</span>
            <div className="cover-student-name">{name || "You"}</div>
            <span className={`cover-student-school${institution ? "" : " ph"}`}>{institution || "School name"}</span>
          </div>
          <div className="cover-chips">
            {studentClass ? <span className="cover-chip cc1"><span className="k">Class</span><span className="v">{studentClass}</span></span> : null}
            {dateStr ? <span className="cover-chip cc3"><span className="k">Exam date</span><span className="v">{dateStr}</span></span> : null}
            {!studentClass && !institution && a.journeyName ? <span className="cover-chip cc1"><span className="k">Stage</span><span className="v">{a.journeyName}</span></span> : null}
          </div>
        </div>
      </section>

      {/* ===== CONTENTS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="What's inside" />
          {/* One centred headline instead of an eyebrow+title+sub stack -
              this page's only job is orienting the reader before they scroll,
              not explaining the methodology again (that's covered on the
              scorecard page right after this one). */}
          <h2 className="tocHeadline">What's inside this report</h2>
          {/* A horizontal path, not a box grid - 5 stops, each just an icon
              + label, joined by connector lines like a process/journey strip
              rather than 5-6 bordered cards. Condensed from the old 6-item
              list: "Career DNA & profile" (radar/archetype) is folded into
              "Careers that fit you" here since both pages sit back-to-back
              and a reader doesn't need them announced as 2 separate stops. */}
          <div className="tocPath">
            {[
              ["score", `All ${dimWord} dimensions`],
              ["clusters", `The ${dimWord} dimensions, in depth`],
              ["briefcase", "Careers that fit you"],
              ["route", "Your path & plan"],
              ["cap", "Resources & scholarships"],
            ].map(([ic, t], i, arr) => (
              <Fragment key={t}>
                <div className="tocStop">
                  <span className="tocStop-ic"><Icon name={ic} size={18} /></span>
                  <span className="tocStop-t">{t}</span>
                </div>
                {i < arr.length - 1 ? <span className="tocStop-line" /> : null}
              </Fragment>
            ))}
          </div>
          <div className="dims8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DIMS8} alt={`The ${dimWord} dimensions of your profile`} loading="lazy" />
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== SCORECARD (at a glance) ===== */}
      <section className="sheet sheet-compact rv">
        <div className="pad">
          <RH n={N()} kick="At a glance" />
          <SecHead eyebrow="In the order explained ahead" title={`Your ${dimWord}-dimension scorecard`}
            sub="What actually came out on top for you in each dimension - the real, specific result, not a number." />
          {/* A card grid - every card leads with the qualitative result itself
              (the code, the learning style, the top motivator...), the same
              way Personality leads with its 4-letter type rather than a bare
              score. The full numeric score for each dimension lives on that
              dimension's own page, right after this one. Cards follow the
              SAME 01→09 order the dimension pages themselves use (radar is
              already built in that order) instead of being re-sorted by
              score - a scorecard whose order doesn't match the pages that
              follow it reads as two different sequences of the same 9
              things. The strongest dimension still gets a small marker,
              computed separately so it isn't tied to card position anymore.
              Value text sizes down for longer results (e.g. "Relationship
              Management") so it wraps cleanly at a word boundary instead of
              overflowing. */}
          <div className="scoreGrid">
            {(() => {
              const strongestKey = radar.slice().sort((x, y) => y.score - x.score)[0]?.key;
              return radar.map((d) => {
                const col = dimColor(d.key);
                const isPersonality = d.key === "personality" && hasMBTIData;
                const topResult = topResultFor(d.key, a, riasec);
                const bigValue = isPersonality ? getMBTIType(a) : (topResult || `${Math.round(d.score)}%`);
                const valSize = bigValue.length > 20 ? 15 : bigValue.length > 13 ? 17 : bigValue.length > 8 ? 19 : 22;
                return (
                  <div className="scoreCard" key={d.key} style={{ ["--sc" as string]: col, ["--sc-tint" as string]: col + "17" } as React.CSSProperties}>
                    {d.key === strongestKey ? <span className="scoreCard-top">Strongest</span> : null}
                    <span className="scoreCard-ic"><Icon name={CAT[d.key].icon} size={15} /></span>
                    <span className="scoreCard-lbl">{CAT[d.key].label}</span>
                    <span className="scoreCard-val" style={{ fontSize: valSize }}>{bigValue}</span>
                  </div>
                );
              });
            })()}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== THE 8 DIMENSIONS ===== */}
      {radar.map((d) => {
        const m = CAT[d.key];
        const col = dimColor(d.key);
        // Show the real MBTI compass whenever the assessment actually
        // computed per-axis scores - not just for class 9-10. Class 6/7/8
        // and 11-12 now compute the same axisScores, and gating this to one
        // journeyCode would silently downgrade them to the generic,
        // unmeasured Big-Five fallback text despite having the real type.
        // (hasMBTIData itself is hoisted to the top of the component now -
        // the scorecard page, above, needs it too.)
        const isMBTIPersonality = d.key === "personality" && hasMBTIData;

        if (isMBTIPersonality) {
          const sheetNum = N();
          const pct = percentileOf(d.score);
          const mbtiType = getMBTIType(a);
          const res = { label: "Your type", value: mbtiType };
          const bench = BENCH[d.key];
          const delta = Math.round(d.score - bench);
          return (
            <section className="sheet param rv" key={d.key} style={{ borderTopColor: col, ["--dc" as string]: col, ["--dc-tint" as string]: col + "14", ["--dc-line" as string]: col + "40" } as React.CSSProperties}>
              <div className="pad">
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: col, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    Dimension {m.dim}
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                    {m.label}
                  </h2>
                </div>
                <RH n={sheetNum} kick={`Dimension ${m.dim} - ${m.label}`} />
                <div className="dimhero">
                  <div className="dimhero-img" style={{ background: col + "12" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.label} loading="lazy" />
                  </div>
                  <div className="dimhero-meta">
                    <Ring value={d.score} size={96} stroke={10} color={col}>
                      <div className="ring-num ring-top">{mbtiType}</div><div className="ring-den">Your type</div>
                    </Ring>
                    <div>
                      <div className="resultchip"><span>{res.label}</span><b>{res.value}</b></div>
                      <div className="verdict">{VERDICT[d.key] ?? m.label}</div>
                      <div className="dimtags">
                        <span className={`vpill ${bandOf(d.score).tone}`}>{Math.round(d.score)}%</span>
                        {d.score > 0 ? <span className="tagpct">Higher than {pct}% of peers</span> : null}
                        <span className={`tagdelta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "Well above" : delta < -10 ? "Below" : "About"} typical</span>
                      </div>
                    </div>
                  </div>
                </div>
                <PersonalityMBTI a={a} />
                <RF name={name} />
              </div>
            </section>
          );
        }

        const dd = categoryDeepDive(d.key, a);
        const subs = subTraits(d.key, a);
        const pct = percentileOf(d.score);
        const res = resultOf(d.key, a);
        const bench = BENCH[d.key];
        const delta = Math.round(d.score - bench);
        // career_interest already got its own breakdown above (the RIASEC
        // hexagon + bars) - repeating it as a second list here is just
        // duplication, so the generic list is skipped and the prose next to
        // it takes the full row instead of leaving that half empty.
        const showBreakdown = subs.length > 0 && d.key !== "career_interest";
        return (
          <section className="sheet param rv" key={d.key} style={{ borderTopColor: col, ["--dc" as string]: col, ["--dc-tint" as string]: col + "14", ["--dc-line" as string]: col + "40" } as React.CSSProperties}>
            <div className="pad">
              {/* Big dimension heading */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: col, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Dimension {m.dim}
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                  {m.label}
                </h2>
              </div>
              <RH n={N()} kick={`Dimension ${m.dim} - ${m.label}`} accent />
              <div className="dimhero">
                {m.img ? (
                  <div className="dimhero-img" style={{ background: col + "12" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.img} alt={m.label} loading="lazy" />
                  </div>
                ) : null}
                <div className="dimhero-meta" style={m.img ? undefined : { gridColumn: "1 / -1" }}>
                  <Ring value={d.score} size={96} stroke={10} color={col}>
                    {subs.length ? (
                      <>
                        <div className="ring-num ring-top" style={{ fontSize: subs[0].label.length > 12 ? 12 : subs[0].label.length > 7 ? 15 : 19 }}>{subs[0].label}</div>
                        <div className="ring-den">Top</div>
                      </>
                    ) : (
                      <>
                        <div className="ring-num">{Math.round(d.score)}%</div><div className="ring-den">Score</div>
                      </>
                    )}
                  </Ring>
                  <div>
                    {res ? <div className="resultchip"><span>{res.label}</span><b>{res.value}</b></div> : null}
                    <div className="verdict">{VERDICT[d.key] ?? m.label}</div>
                    <div className="dimtags">
                      <span className={`vpill ${bandOf(d.score).tone}`}>{Math.round(d.score)}%</span>
                      {d.score > 0 ? <span className="tagpct">Higher than {pct}% of peers</span> : null}
                      <span className={`tagdelta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "Well above" : delta < -10 ? "Below" : "About"} typical</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="dimlede">{dd.meaning}</p>

              {d.key === "career_interest" && riasec.length > 0 ? (
                // One RIASEC list (ranked, strongest first), paired with the
                // prose - not a second bars list repeating the same six
                // letters in a different order right next to it.
                <div className="riasec-row">
                  <RiasecHex themes={riasec} />
                  <div className="prose">
                    <div className="subhd">What this means for you</div>
                    <p className="lead">{dd.strengths[0] || `This dimension shows how ${CAT[d.key]?.label.toLowerCase()} impacts your choices and strengths.`}</p>
                    {dd.strengths[1] ? <p>{dd.strengths[1]}</p> : null}
                    {dd.grow[0] ? <p>{dd.grow[0]}</p> : null}
                  </div>
                </div>
              ) : (
                <div className="cols">
                  {showBreakdown ? (
                    <div>
                      <div className="subhd">Your breakdown</div>
                      <div className="bars">
                        {subs.map((sub) => (
                          <div className="brow" key={sub.label}>
                            <span className="lb">{sub.label}</span>
                            <span className="bk"><SkillBar value={sub.value} color={col} height={9} /></span>
                            <span className="vv text-xs">{Math.round(sub.value)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="prose" style={showBreakdown ? undefined : { gridColumn: "1 / -1" }}>
                    <div className="subhd">What this means for you</div>
                    <p className="lead">{dd.strengths[0] || `This dimension shows how ${CAT[d.key]?.label.toLowerCase()} impacts your choices and strengths.`}</p>
                    {dd.strengths[1] ? <p>{dd.strengths[1]}</p> : null}
                    {dd.grow[0] ? <p>{dd.grow[0]}</p> : null}
                  </div>
                </div>
              )}
              <div className="twocard">
                <div className="lc good">
                  <h4>Where you’re strong</h4>
                  <ul>{dd.strengths.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
                <div className="lc grow">
                  <h4>Where you can grow</h4>
                  <ul>{dd.grow.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
              </div>
              {dd.recommend.length ? (
                <div className="recos">
                  <div className="subhd">Recommended next steps</div>
                  <ol>{dd.recommend.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ol>
                </div>
              ) : null}
              <RF name={name} />
            </div>
          </section>
        );
      })}

      {/* ===== CAREER DNA (radar + top domains) - a bridge into best-fit domains =====
           Classes 11/12 skip this and the Best-fit Domains section below: their own
           Fitment/Suitability/Selector pages (via extraSheets, built from the more
           detailed careerfit1112.ts model) replace both - see hideCareerFitSections. */}
      {!hideCareerFitSections && (
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Your Career DNA" />
          <SecHead eyebrow={`How your ${dimWord} dimensions come together`} title="Your career, in one page"
            sub={`No single test defines you - the shape of all ${dimWord} together is what makes this read accurate.`} />
          <div className="dna-hero">
            <div className="radar-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
              <RadarChart data={radar} color={C.red} />
            </div>
            <div className="band-v">
              {Array.from(new Set(roles.map(r => r.domain))).slice(0, 5).map((domain, i) => {
                const domainRoles = roles.filter(r => r.domain === domain);
                const avgFit = Math.round(domainRoles.reduce((sum, r) => sum + r.fit, 0) / domainRoles.length);
                const domainBand = bandOf(avgFit);
                return (
                  <div className="dcard" key={domain} style={{ ["--rc" as string]: RANK_COLOURS[i] } as React.CSSProperties}>
                    <div className="rk">TOP DOMAIN 0{i + 1}</div>
                    <div className="nm">{domain}</div>
                    <div className="ds">{domainRoles.length} roles • {domainBand.label}</div>
                    <div className="mt"><span className="t"><i style={{ width: `${clamp(avgFit)}%` }} /></span><span className="v">{avgFit}%</span></div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="disclaimer">
            These top domains are based on your own answers - your aptitude, skills and career
            interests from the questions you answered. You have complete freedom to explore other
            domains too; these are just recommendations, not a fixed path.
          </p>
          <RF name={name} />
        </div>
      </section>
      )}

      {/* ===== BEST-FIT DOMAINS ===== */}
      {!hideCareerFitSections && (
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Best-fit domains" />
          <div className="domhead">
            <span className="domhead-eye">Ranked by fit, from your full profile - not just job titles</span>
            <h2 className="domhead-title">Your top 5 domains</h2>
            <p className="domhead-sub">Each with a real path into it from where you are now, in India and abroad.</p>
          </div>
          {domainList.map((d, i) => <DomainCard key={d.key} d={d} rank={i + 1} roles={roles} />)}
          <RF name={name} />
        </div>
      </section>
      )}

      {/* ===== EXTRA SHEETS (class 11-12 and any other journey with unique
           content beyond the standard eight/nine dimensions) - placed right
           after the domain cards and before Future Outlook/Roadmap, so
           journey-specific content reads as a continuation of "your fit",
           not an afterthought tacked on after the shared closing pages. ===== */}
      {extraSheets.map((sheet) => (
        <section key={sheet.id} className="sheet rv">
          <div className="pad">
            <RH n={N()} kick={sheet.kicker} />
            {sheet.node}
            <RF name={name} />
          </div>
        </section>
      ))}

      {/* ===== FUTURE OUTLOOK ===== */}
      <section className="sheet rv">
        <SceneBand kind="future" eyebrow={`The next decade · ${N()}`} title="What’s rising, what’s fading" />
        <div className="pad">
          <SecHead eyebrow="Choose a direction that grows with the future" title="Stay future-proof"
            sub="A quick map of where the world of work is heading, so your choices age well." />
          <p className="disclaimer" style={{ marginTop: -6, marginBottom: 18 }}>{FUTURE.source}</p>
          <div className="future">
            <div className="fcol rise">
              <div className="fh"><Icon name="score" size={16} /> Rising & future-proof</div>
              <div className="fgrid">{FUTURE.rising.map((x) => <div className="fitem" key={x.t}><div className="ft">{x.t}</div><div className="fd">{x.d}</div></div>)}</div>
            </div>
            <div className="fcol fall">
              <div className="fh"><Icon name="pulse" size={16} /> Fading or automating</div>
              <ul className="flist">{FUTURE.declining.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="fnote">{FUTURE.note}</div>
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== 20-YEAR ROADMAP - built from the shared 15-domain ranking,
           which classes 11/12 hide (see hideCareerFitSections). They get
           their own career-specific version instead - see
           "career-roadmap-1112" in class11ExtraSheets.tsx, built from the
           student's actual named desired career, not just their #1 domain. ===== */}
      {!hideCareerFitSections && (
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Your 20-year roadmap" />
          <div className="domhead">
            <span className="domhead-eye">From today to a career you’re built for</span>
            <h2 className="domhead-title">Your 20-year roadmap</h2>
            <p className="domhead-sub">Built around your #1 best-fit domain - the same core moves (exams, skills, internships) carry over even if you lean toward another domain from your top 5.</p>
          </div>
          <div className="road-card" style={{ ["--rc" as string]: RANK_COLOURS[0], ["--rc-tint" as string]: RANK_COLOURS[0] + "16" } as React.CSSProperties}>
            <div className="road-intro">
              <span className="road-intro-rk">01</span>
              <div className="road-intro-main">
                <span className="road-intro-k">Roadmap built for</span>
                <div className="road-intro-nm">{topDomain.name}</div>
              </div>
              {topDomain.fit ? <div className="road-intro-fit"><b>{topDomain.fit}%</b><span>Fit</span></div> : null}
            </div>
            <JourneyGraphic phases={phases} />
            <div className="road">
              {phases.map((p) => (
                <div className="rstep" key={p.period}>
                  <div className="yr">{p.period}</div>
                  <div className="ti">{p.title}</div>
                  <div className="tx">{p.points[0]}</div>
                  {p.points.length > 1 ? <div className="tags">{p.points.slice(1).map((t, j) => <em key={j}>{t}</em>)}</div> : null}
                </div>
              ))}
            </div>
            <div className="road-note">This is one realistic path, not a fixed rulebook - revisit it each time your interests sharpen or a new opportunity opens up.</div>
          </div>
          <RF name={name} />
        </div>
      </section>
      )}

      {/* ===== RESOURCES & SCHOLARSHIPS ===== */}
      <section className="sheet rv">
        <SceneBand kind="resources" eyebrow={`Resources & funding · ${N()}`} title="Take the next step" />
        <div className="pad">
          <SecHead eyebrow="Everything you need to move" title="Learn, find work & get funded"
            sub={`Hand-picked starting points relevant to ${topDomain.name} and your stage.`} />
          <div className="res">
            <div className="rgrp">
              <div className="rgh"><Icon name="cap" size={16} /> Learn these skills - free & paid</div>
              <div className="rchips">{LEARNING.map((l) => <a className="rchip" key={l.url} href={l.url} target="_blank" rel="noreferrer"><b>{l.label}</b><span>{l.note}</span></a>)}</div>
            </div>
            <div className="rgrp">
              <div className="rgh"><Icon name="briefcase" size={16} /> Where to find jobs & internships</div>
              <div className="portals">{JOB_PORTALS.map((p) => (
                <div className="pcol" key={p.region}><div className="pr">{p.region}</div><div className="plist">{p.sites.map((si) => <a key={si.url} href={si.url} target="_blank" rel="noreferrer">{si.label}</a>)}</div></div>
              ))}</div>
            </div>
            <div className="rgrp">
              <div className="rgh"><Icon name="star" size={16} /> Scholarships to apply for (2026)</div>
              <div className="schol">{SCHOLARSHIPS_2026.map((sc) => (
                <a className="scard" key={sc.name} href={sc.url} target="_blank" rel="noreferrer"><div className="sn">{sc.name}</div><div className="sw">{sc.who}</div></a>
              ))}</div>
            </div>
            <div className="rgrp">
              <div className="rgh"><Icon name="compass" size={16} /> Explore more on your dashboard</div>
              <div className="schol">{DASHBOARD_LINKS.map((l) => (
                <a className="scard" key={l.path} href={`${SITE_URL}${l.path}`} target="_blank" rel="noreferrer"><div className="sn">{l.label}</div><div className="sw">{l.note}</div></a>
              ))}</div>
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== FOR PARENTS + CLOSING (download buttons live on this last page too) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="For parents & mentors" />
          <div className="parents">
            <div className="ph"><span className="pic"><Icon name="heart" size={16} /></span> Supporting {first}</div>
            <p className="pintro">The best way to support {first} is to guide, not decide. A few things that help:</p>
            <ul className="plist2">{PARENT_TIPS.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
          <div className="closing">
            <h3>This is a map, not a verdict.</h3>
            <p>Your profile shows where you’ll thrive today - but you’re still growing. Revisit this report as you change, and share it with someone who’s guiding you.</p>
            <p className="closing-mail">A PDF copy of this report has also been emailed to you - share that with a parent or mentor.</p>
          </div>
          {/* Says plainly what this is built from, in plain language - no
              framework names - so the basis and its limits belong on the
              page rather than only in the footer. */}
          <p className="disclaimer">
            <b>How to read this report.</b> These recommendations are derived from your own
            answers - your aptitude, skills and career interests from the questions you
            answered - not a measure of your ability or a ceiling on it. You have complete
            freedom to explore other domains too; these are just recommendations based on
            what you told us, not a fixed verdict. Interests and strengths genuinely change
            through school, so treat this as a starting point for conversations with
            teachers, parents and counsellors, and revisit it as you grow.
          </p>
          <div className="dl-cta">
            <div className="dl-cta-label">Keep a copy</div>
            <div className="dl-cta-row">
              <DownloadButton name={name} />
            </div>
          </div>
          <div className="contact-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="contact-logo" src={LOGO} alt="OneGrasp" />
            <div className="contact-lines">
              <span>support@onegrasp.com</span>
              <span>+91 89777 60442</span>
              <span>onegrasp.com</span>
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- data ---------------------------------- */
const FRAMEWORKS = [
  { k: "personality", fr: "MBTI-style", ds: "Your natural traits, preferences and behaviour." },
  { k: "career_interest", fr: "Holland Codes · RIASEC", ds: "The kinds of work and environments that pull you." },
  { k: "multiple_intelligence", fr: "Gardner’s MI", ds: "Your abilities beyond a single IQ number." },
  { k: "emotional_intelligence", fr: "EQ · Goleman", ds: "How you read, use and manage emotions." },
  { k: "learning_styles", fr: "VARK", ds: "How you take in and retain information best." },
  { k: "motivators", fr: "Work Values", ds: "What drives you and keeps you going." },
  { k: "strengths", fr: "Signature Themes", ds: "Your core, repeatable talents." },
  { k: "aptitude", fr: "Reasoning & Ability", ds: "How you learn and solve new problems." },
];
const VERDICT: Record<string, string> = {
  personality: "How you’re naturally wired.", career_interest: "What genuinely pulls you.",
  multiple_intelligence: "How your mind works best.", emotional_intelligence: "How you read and manage emotion.",
  learning_styles: "How you prefer to study.", motivators: "What keeps you going.",
  strengths: "Your repeatable talents.", aptitude: "How quickly you pick things up.",
  creativity: "How you approach a problem with no set method.",
};

/** Curated, O*NET-style career signals derived from the role name (heuristic,
 *  not part of scoring). Gives each match professional metric badges. */
function roleMetric(name: string) {
  const s = name.toLowerCase();
  const has = (...k: string[]) => k.some((x) => s.includes(x));
  const bright = has("data", "ai", "software", "cyber", "health", "bio", "design", "ux", "product", "research", "engineer", "analyst", "scientist", "digital", "market", "nurse", "therapist", "developer");
  const automation: "Low" | "Medium" | "High" =
    has("clerk", "entry", "assembly", "bookkeep", "cashier", "operator", "teller", "filing") ? "High"
    : has("writer", "support", "admin", "coordinator", "assistant") ? "Medium" : "Low";
  const salary =
    has("doctor", "surgeon", "fund", "executive", "ceo", "cto", "pilot", "lawyer", "architect", "ml ", "machine learning") ? "Very High"
    : has("engineer", "manager", "developer", "scientist", "consultant", "specialist", "analyst", "pharmac", "psycholog") ? "Above Average"
    : has("teacher", "nurse", "designer", "technician", "associate", "coordinator", "planner") ? "Average"
    : has("artist", "dancer", "assistant", "intern", "writer") ? "Below Average" : "Average";
  const future = bright || has("teacher", "manager", "consultant", "therapist", "doctor", "planner", "strategist");
  return { brightOutlook: bright, salary, automation, future };
}
const salaryTone = (s: string) => (s.includes("Very High") || s.includes("Above") ? "good" : s.includes("Below") || s.includes("Very Low") ? "warn" : "mid");

type ReportRole = { role: string; domain: string; fit: number; why: string; salaryIndia: string; salaryAbroad: string };

/**
 * Specific roles for the career cards and the ranked table.
 *
 * When the engine produced named professions (the 60-question bank matches
 * against the workbook's own profession tables), use those - they are the real
 * output of the career-vector matching. Otherwise fall back to representative
 * roles from the top domains, so older banks still render.
 */
function coherentRoles(a: AssessmentSummary, fits: DomainFit[]): ReportRole[] {
  // Priority 0 fix: always use `fits` as the canonical source, computed fresh from assessment data.
  // This ensures career recommendations are consistent with domainFit and top-domain logic elsewhere.
  // If a.matches existed from an older backend run, it may contradict the current fits -
  // prefer current data over stale precomputed matches.
  const out: ReportRole[] = [];
  // Sort by actual fit score descending to ensure top-recommended domains appear first.
  // Covers all 5 recommended domains - not just the top 3 - so every domain
  // card and the "all job roles" section has real roles to show, not an
  // empty state for ranks 4 and 5.
  fits.slice().sort((x, y) => y.fit - x.fit).slice(0, 5).forEach((d) => {
    (d.roles ?? []).slice(0, 8).forEach((role, ri) => {
      // Use actual domain fit score, slight variation per role to show diversity
      const roleFit = Math.max(25, Math.min(100, d.fit - ri * 2));
      out.push({ role, domain: d.name, fit: roleFit, why: d.why, salaryIndia: d.salaryIndia, salaryAbroad: d.salaryAbroad });
    });
  });
  return out;
}

/* ------------------------------ pieces --------------------------------- */
// The full logo only belongs on the cover - repeating it as a running header
// on every one of ~20 pages read as clutter, so each page just gets its
// section label instead (the small dot keeps a lightweight brand cue).
function RH({ n, kick }: { n?: string; kick: string; accent?: boolean }) {
  return (
    <div className="rh">
      <span className="ey"><span className="k" /> {kick}{n ? <em className="rh-n"> · {n}</em> : null}</span>
    </div>
  );
}
function RF({ name }: { name?: string }) {
  return <div className="rf"><span>OneGrasp Career Fitment</span><span className="id">{name || "Your report"}</span></div>;
}
function SecHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="sechd">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}

type SceneKind = "careers" | "education" | "future" | "roadmap" | "growth" | "resources";
/** Section header band with a flat-vector illustration (always renders). */
function SceneBand({ kind, eyebrow, title }: { kind: SceneKind; eyebrow: string; title: string }) {
  return (
    <div className="sband">
      <div className="sband-text"><span className="sband-eye">{eyebrow}</span><h2 className="sband-title">{title}</h2></div>
      <div className="sband-art"><Scene kind={kind} /></div>
    </div>
  );
}

function Badge({ on, label, value, icon, tone }: { on?: boolean; label: string; value?: string; icon: string; tone?: string }) {
  const t = value ? (tone || "mid") : on ? "good" : "off";
  return (
    <span className={`mbadge2 ${t}`}>
      <Icon name={icon} size={12} />
      <span className="mb-l">{label}</span>
      <b>{value ?? (on ? "Yes" : "-")}</b>
    </span>
  );
}

/** Rose / polar wheel - petals sized by score. Used for the profile & the five traits. */
function RoseWheel({ items, accentIndex = -1, small }: { items: { label: string; score: number; icon?: string; color?: string }[]; accentIndex?: number; small?: boolean }) {
  const size = small ? 200 : 300;
  const cx = size / 2, cy = size / 2, R = small ? 74 : 116, n = items.length || 8;
  const seg = (2 * Math.PI) / n, gap = 0.08;
  const wedge = (i: number, r: number) => {
    const a0 = -Math.PI / 2 + i * seg - seg / 2 + gap;
    const a1 = -Math.PI / 2 + i * seg + seg / 2 - gap;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Profile wheel" style={{ width: "100%", maxWidth: size, height: "auto", overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((f) => <circle key={f} cx={cx} cy={cy} r={R * f} fill="none" stroke={C.line} strokeWidth={1} />)}
      {items.map((it, i) => {
        const r = (R * clamp(it.score)) / 100;
        const col = it.color ?? (i === accentIndex ? C.red : C.redLine);
        const op = accentIndex === -1 ? (it.color ? 0.9 : 0.45 + 0.55 * (it.score / 100)) : (i === accentIndex ? 0.95 : 0.4);
        return <path key={i} d={wedge(i, r)} fill={col} opacity={op} stroke="#fff" strokeWidth={1.5} />;
      })}
      {items.map((it, i) => {
        const a = -Math.PI / 2 + i * seg;
        const lx = cx + (R + (small ? 14 : 20)) * Math.cos(a), ly = cy + (R + (small ? 14 : 20)) * Math.sin(a);
        const anchor = Math.abs(lx - cx) < 10 ? "middle" : lx > cx ? "start" : "end";
        return <text key={i} x={lx.toFixed(1)} y={(ly + 3).toFixed(1)} textAnchor={anchor} fontSize={small ? 8.5 : 10} fontWeight={i === accentIndex ? 800 : 600} fill={i === accentIndex ? C.ink : C.muted}>{it.label}</text>;
      })}
    </svg>
  );
}

/** The six RIASEC codes, ranked, as plain bars. */
function RiasecHex({ themes }: { themes: { letter: string; title?: string; score: number }[] }) {
  const order = ["R", "I", "A", "S", "E", "C"];
  const labels: Record<string, string> = {
    R: "Realistic", I: "Investigative", A: "Artistic",
    S: "Social", E: "Enterprising", C: "Conventional",
  };
  const rows = order
    .map((letter) => ({ letter, label: labels[letter], score: themes.find((t) => t.letter === letter)?.score ?? 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((r) => (
        <div key={r.letter} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 22, fontSize: 12, fontWeight: 800, color: C.ink }}>{r.letter}</span>
          <span style={{ flex: "0 0 96px", fontSize: 12, fontWeight: 600, color: C.ink3 }}>{r.label}</span>
          <span style={{ flex: 1 }}><SkillBar value={r.score} color={C.red} /></span>
          <span style={{ width: 36, textAlign: "right", fontSize: 12, fontWeight: 700, color: C.ink }}>{Math.round(r.score)}%</span>
        </div>
      ))}
    </div>
  );
}

function DomainCard({ d, rank, roles }: { d: DomainFit; rank: number; roles: ReportRole[] }) {
  // How many dimensions had SOME matching evidence used to say "how many
  // factors point here" - but it never checked how strongly they pointed
  // there, so a domain scoring 50/35/11 across the board could still read
  // "Strong match" just because all four numbers happened to be non-null.
  // Base the label on the actual strength of those numbers instead, so it
  // can never contradict what the breakdown grid right below it shows.
  const breakdownScores = [d.breakdown?.interest, d.breakdown?.aptitude, d.breakdown?.mi, d.breakdown?.values]
    .filter((v): v is number => v !== null && v !== undefined);
  const avgStrength = breakdownScores.length ? breakdownScores.reduce((s, v) => s + v, 0) / breakdownScores.length : d.fit;
  const confidenceLabel = avgStrength >= 65 ? "Strong match" : avgStrength >= 45 ? "Good match" : "Worth exploring";
  const domainRoles = roles.filter((r) => r.domain === d.name).slice(0, 8);
  const rc = RANK_COLOURS[(rank - 1) % RANK_COLOURS.length];
  const rcVars = { ["--rc" as string]: rc, ["--rc-tint" as string]: rc + "12", ["--rc-line" as string]: rc + "38" } as React.CSSProperties;
  return (
    // Same rank colour as the Career DNA cards, so a domain that is 2nd in one
    // section is not green there and red here.
    <div className="dom" style={rcVars}>
      <div className="dom-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.image} alt={d.name} className="dom-img" loading="lazy" />
        <span className="dom-img-rk">{rank}</span>
      </div>
      <div className="dom-hd">
        <span className="rk">{rank}</span>
        <div className="dom-hd-main">
          <div className="nm">{d.name}</div>
          <div className="tl">{d.tagline}{d.why ? <span className="why"> · {d.why}</span> : null}</div>
        </div>
        {d.fit ? (
          <div className="dom-fitbox">
            <div className="fit"><b>{d.fit}%</b><span>Fit</span></div>
            <div className="dom-confidence">{confidenceLabel}</div>
          </div>
        ) : null}
      </div>
      {d.fit ? <div className="dom-fitbar"><SkillBar value={d.fit} color={rc} height={6} /></div> : null}

      <div className="dom-bd">
        {d.breakdown && (
          <div className="dcell dom-align" style={{ gridColumn: "1 / -1" }}>
            <div className="h">What aligns with your profile</div>
            <div className="dom-align-grid">
              <div><span className="k">Interest</span><span className="v">{d.breakdown.interest}%</span></div>
              {d.breakdown.aptitude !== null && <div><span className="k">Aptitude</span><span className="v">{d.breakdown.aptitude}%</span></div>}
              {d.breakdown.mi !== null && <div><span className="k">Intelligence</span><span className="v">{d.breakdown.mi}%</span></div>}
              {d.breakdown.values !== null && <div><span className="k">Values</span><span className="v">{d.breakdown.values}%</span></div>}
            </div>
          </div>
        )}
        <div className="dcell"><div className="h">What it is</div><p>{d.whatItIs}</p></div>
        <div className="dcell"><div className="h">How to join</div><p>{d.howToJoin.join(" · ")}</p></div>

        <div className="dcell" style={{ gridColumn: "1 / -1" }}>
          <div className="h">Key skills</div>
          <div className="dom-skills">{d.skills.slice(0, 6).map((s) => <span key={s} className="dom-skill">{s}</span>)}</div>
        </div>

        <div className="dcell" style={{ gridColumn: "1 / -1" }}>
          <div className="h">Roles that fit you here</div>
          <div className="dom-roles">
            {(domainRoles.length ? domainRoles : d.roles.slice(0, 8).map((r) => ({ role: r, fit: 0, domain: d.name, why: "", salaryIndia: "", salaryAbroad: "" } as ReportRole))).map((r, i) => {
              const rc = ROLE_GRADIENT[i % ROLE_GRADIENT.length];
              return (
                <div className="dom-role-row" key={r.role}>
                  <span className="dom-role-nm">{r.role}</span>
                  {r.fit ? (
                    <span className="dom-role-fitwrap">
                      <span className="dom-role-bar"><SkillBar value={r.fit} color={rc} height={7} /></span>
                      <span className="dom-role-pct" style={{ color: rc }}>{r.fit}%</span>
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="dcell" style={{ gridColumn: "1 / -1" }}>
          <div className="h">Typical earnings</div>
          <div className="sal"><div className="s"><div className="r">India</div><div className="a">{d.salaryIndia}</div></div><div className="s"><div className="r">Abroad</div><div className="a">{d.salaryAbroad}</div></div></div>
        </div>
        <div className="dcell"><div className="h">Future scope</div><p>{d.futureScope}</p></div>
        <div className="dcell"><div className="h">Explore</div><div className="dlinks">{d.links.slice(0, 3).map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>)}</div></div>
      </div>
    </div>
  );
}

/** Fetches a same-origin asset and inlines it as a data: URI. Used only for
 *  the logo - everything else in the report already uses absolute CDN URLs,
 *  which keep working once downloaded, but the logo is served from this
 *  site's own "/..." path, which resolves to nothing once the markup is
 *  opened from a saved file or a print popup with no real origin of its own. */
async function toDataURL(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function DownloadButton({ name }: { name?: string }) {
  const handleDownload = async () => {
    const element = document.querySelector(".frx");
    if (!element) {
      alert("Report not found");
      return;
    }

    const filename = `${name || "Assessment-Report"}-${new Date().toISOString().split("T")[0]}`;

    // The rest of the report's images are absolute CDN URLs (onegrasp.com,
    // images.unsplash.com) and keep working wherever this file is opened.
    // Only the logo needs inlining - see toDataURL above.
    let html = element.outerHTML;
    try {
      const logoDataUrl = await toDataURL(LOGO);
      html = html.split(`src="${LOGO}"`).join(`src="${logoDataUrl}"`);
    } catch {
      /* offline or blocked - leave the original path rather than fail the download */
    }
    // `.frx`'s own <style> tag (the full report stylesheet) rides along
    // inside `html` already, since it's a child of the element captured
    // above - no separate stylesheet to attach.
    const doc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${filename}</title></head><body style="margin:0">${html}</body></html>`;

    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="dl-btn">
      <span className="dl-btn-icon">📋</span>
      <span>
        <span className="dl-btn-label">Download report</span>
        <span className="dl-btn-desc">Saves as an HTML file you can open in any browser</span>
      </span>
    </button>
  );
}

export function JourneyGraphic({ phases }: { phases: { period: string; title: string }[] }) {
  // A steadily rising line, left to right - the shape itself reads as
  // "upward progress over time" rather than a decorative zigzag.
  const n = Math.min(4, phases.length) || 4;
  const W = 760, H = 150, pad = 56;
  const xs = Array.from({ length: n }, (_, i) => pad + (i * (W - 2 * pad)) / (n - 1));
  const yTop = 34, yBottom = 112;
  const ys = (i: number) => yBottom - (i * (yBottom - yTop)) / (n - 1);
  const d = xs.map((x, i) => {
    const y = ys(i);
    if (i === 0) return `M ${x} ${y}`;
    const px = xs[i - 1], py = ys(i - 1), mx = (px + x) / 2;
    return `C ${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }).join(" ");
  return (
    <div className="journey">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Your career journey, rising step by step" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="journeyLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.red} />
            <stop offset="100%" stopColor={C.ink} />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#journeyLine)" strokeWidth="4" strokeLinecap="round" />
        {xs.map((x, i) => {
          const y = ys(i);
          const nodeColor = i === n - 1 ? C.ink : C.red;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="17" fill={nodeColor} stroke="#fff" strokeWidth="3.5" />
              <text x={x} y={y + 5.5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">{i + 1}</text>
              <text x={x} y={y + 38} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={C.ink3}>{phases[i]?.period.split("·")[0].trim()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------- styles ------------------------------- */
const CSS = `
.frx{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:${C.ink};
  --ink:${C.ink};--ink-2:${C.ink2};--ink-3:${C.ink3};--muted:${C.muted};--faint:${C.faint};
  --line:${C.line};--line-2:${C.line2};--red:${C.red};--red-strong:${C.redStrong};--red-tint:${C.redTint};--red-line:${C.redLine};--good:${C.good};--good-tint:${C.goodTint};
  --shadow:0 14px 40px rgba(20,20,25,.08),0 3px 10px rgba(20,20,25,.04);--shadow-sm:0 2px 10px rgba(20,20,25,.05);
  display:flex;flex-direction:column;align-items:center;gap:24px;letter-spacing:-.006em;
  background:${C.bg};padding:32px 16px}
.frx *{box-sizing:border-box}
/* On-screen page preview: every section reads as one A4 sheet, not a web
   column. Matches the print rule below so screen and PDF look the same. */
.frx .sheet{width:100%;max-width:210mm;min-height:297mm;margin:0 auto}
@media(max-width:860px){.frx .sheet{min-height:auto}}
.frx .rv{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.frx .rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.frx .rv{opacity:1;transform:none;transition:none}}

.frx .sheet{background:#fff;border:1px solid var(--line);border-top:3px solid var(--red);border-radius:16px;box-shadow:var(--shadow);overflow:hidden;position:relative}
.frx .pad{padding:40px 44px}
@media(max-width:720px){.frx .pad{padding:24px 18px}}
/* Lets a wide, dense block (e.g. the Fitment/Suitability/Selector overview
   table) reclaim .pad's own side padding and run edge-to-edge inside the
   sheet, instead of being squeezed into an already-narrow page width on top
   of that padding - every extra pixel matters once content is split 3 ways. */
.frx .full-bleed{margin-left:-44px;margin-right:-44px}
@media(max-width:720px){.frx .full-bleed{margin-left:-18px;margin-right:-18px}}
/* A domain/role summary card's inner sections, laid out side by side and
   collapsing to a single stacked column on narrow screens - replaces a wide
   <table> (fixed columns, forces horizontal scroll) with a card whose
   sections just reflow, so nothing ever needs a horizontal scrollbar and one
   long list (e.g. skills) only grows that one card, not a whole shared row. */
.frx .domcard-grid{display:grid;grid-template-columns:1.1fr 1.1fr 1fr}
.frx .domcard-sec{padding:14px 16px;border-right:1px solid var(--line-2,var(--line))}
.frx .domcard-sec:last-child{border-right:none}
@media(max-width:760px){
  .frx .domcard-grid{grid-template-columns:1fr}
  .frx .domcard-sec{border-right:none;border-bottom:1px solid var(--line-2,var(--line))}
  .frx .domcard-sec:last-child{border-bottom:none}
}
.frx h1,.frx h2,.frx h3{margin:0;letter-spacing:-.02em;color:var(--ink)}
.frx p{margin:0;color:var(--ink-2)}
.frx .eyebrow{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--red)}
.frx .ring-num{font-size:24px;font-weight:800;color:var(--ink);line-height:1}
.frx .ring-num small{font-size:14px;color:var(--muted);font-weight:700}
.frx .ring-num.ring-top{max-width:72px;line-height:1.15;word-break:break-word;font-weight:800;color:var(--dc,var(--ink))}
.frx .ring-den{font-size:10px;font-weight:700;color:var(--muted);margin-top:2px;text-transform:uppercase;letter-spacing:.05em}

.frx .rh{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:22px}
.frx .rh .ey{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:700;color:var(--ink-2)}
.frx .rh .ey .k{width:8px;height:8px;border-radius:50%;background:var(--red)}
.frx .rh .rh-n{font-style:normal;color:var(--faint);font-weight:800}
.frx .rf{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:26px;padding-top:14px;border-top:1px solid var(--line);font-size:11px;color:var(--muted)}
.frx .sechd{margin-bottom:20px}
.frx .sechd h2{font-size:24px;font-weight:800;margin-top:8px}
.frx .sechd p{font-size:14px;color:var(--ink-3);margin-top:8px;max-width:64ch;line-height:1.6}
.frx .domhead{text-align:center;max-width:56ch;margin:6px auto 28px}
.frx .domhead-eye{display:block;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--red)}
.frx .domhead-title{font-size:clamp(26px,4vw,34px);font-weight:900;color:var(--ink);margin-top:8px;letter-spacing:-.01em}
.frx .domhead-sub{font-size:14.5px;color:var(--ink-3);margin-top:10px;line-height:1.6}
.frx .subhd{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}

/* cover - one red-themed page, no variants */
.frx .cover{border-top:none;background:linear-gradient(160deg,var(--red) 0%,var(--red-strong) 55%,#B5262C 100%);display:flex;align-items:flex-start;position:relative;overflow:hidden}
.frx .cover-in{width:100%;padding:56px 48px 72px;color:#fff;position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center}
@media(max-width:720px){.frx .cover-in{padding:36px 22px 52px}}
.frx .cover-logo-card{background:#fff;border-radius:20px;padding:20px 32px;box-shadow:0 12px 30px rgba(0,0,0,.2);margin-bottom:26px}
.frx .cover-logo{height:80px;width:auto;display:block}
.frx .cover-badge{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.85);background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.3);padding:7px 16px;border-radius:999px;margin-bottom:26px}
.frx .cover-title{color:#fff;font-size:clamp(34px,6vw,60px);line-height:1.05;font-weight:900;letter-spacing:-.01em;margin:0}
.frx .cover-lede{color:rgba(255,255,255,.92);font-size:15.5px;line-height:1.7;margin:18px auto 0;max-width:56ch}
.frx .cover-art{width:100%;max-width:230px;height:auto;margin:28px auto;display:block}
.frx .cover-student-lbl{display:block;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.frx .cover-student-name{font-size:clamp(26px,4.4vw,42px);font-weight:800;color:#fff;margin-top:6px}
.frx .cover-student-school{display:inline-block;font-size:clamp(14px,2vw,18px);font-weight:800;color:var(--red-strong);background:#fff;padding:8px 18px;border-radius:999px;margin-top:12px;box-shadow:0 6px 16px rgba(0,0,0,.16)}
.frx .cover-student-school.ph{font-weight:700;color:var(--muted);background:rgba(255,255,255,.85)}
.frx .cover-chips{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:26px}
.frx .cover-chip{display:flex;flex-direction:column;align-items:flex-start;gap:2px;background:#fff;border-radius:12px;padding:10px 18px;box-shadow:0 10px 24px rgba(0,0,0,.16);border-left:4px solid var(--rank,var(--red))}
.frx .cover-chip.cc1{--rank:#12996b}
.frx .cover-chip.cc3{--rank:#e08a1e}
.frx .cover-chip .k{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.frx .cover-chip .v{font-size:14px;font-weight:800;color:var(--ink)}
.frx .dims8{margin:0 0 18px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:${C.bg}}
.frx .dims8 img{width:100%;display:block}

/* illustration band */
.frx .sband{display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:18px;padding:22px 44px;
  background:linear-gradient(120deg,#fff,${C.bg});border-bottom:1px solid var(--line)}
@media(max-width:720px){.frx .sband{grid-template-columns:1fr;padding:18px}.frx .sband-art{height:110px;justify-content:center}}
.frx .sband-eye{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--red)}
.frx .sband-title{color:var(--ink);font-size:clamp(22px,3.4vw,30px);font-weight:800;margin-top:6px}
.frx .sband-art{height:150px;display:flex;align-items:center;justify-content:flex-end}
.frx .sband-art img,.frx .sband-art svg{height:150px;width:100%;object-fit:contain}

/* contents */
.frx .tocHeadline{font-size:clamp(22px,3.4vw,30px);font-weight:800;color:var(--ink);text-align:center;letter-spacing:-.01em;margin:0 0 26px}
.frx .tocPath{display:flex;align-items:flex-start;justify-content:center;flex-wrap:wrap;gap:6px 0}
.frx .tocStop{display:flex;flex-direction:column;align-items:center;gap:8px;width:112px;text-align:center}
.frx .tocStop-ic{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--red-tint);color:var(--red);flex:none}
.frx .tocStop-t{font-size:11.5px;font-weight:700;color:var(--ink-2);line-height:1.35}
/* Both this and .tocStop share the row's top edge (align-items:flex-start
   above), so a fixed 22px top margin - exactly half the 44px icon circle -
   always lands the line through the circle's centre, regardless of how many
   lines the label text below wraps to. */
.frx .tocStop-line{flex:1 1 24px;height:2px;min-width:16px;background:var(--red-line);margin:22px 2px 0}
@media(max-width:640px){.frx .tocPath{flex-direction:column}.frx .tocStop-line{display:none}}

/* executive */
.frx .exec{display:grid;grid-template-columns:1.2fr .8fr;gap:26px;align-items:center}
@media(max-width:720px){.frx .exec{grid-template-columns:1fr;gap:20px}}
.frx .dna-arch{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--red)}
.frx h2.arch{font-size:clamp(26px,4vw,38px);line-height:1.05;font-weight:800;margin:10px 0 0}
.frx .one{font-size:15px;line-height:1.62;color:var(--ink-2);margin-top:14px;max-width:52ch}
.frx .exec-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px}
.frx .ec{border:1px solid var(--line);border-radius:11px;padding:12px 14px;background:${C.bg}}
.frx .ec-k{font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);display:block}
.frx .ec-v{font-size:14px;font-weight:800;color:var(--ink);margin-top:3px;display:block}
.frx .exec-r{display:flex;flex-direction:column;align-items:center;gap:14px}
.frx .exec-legend{font-size:14px;color:var(--ink-2);display:flex;flex-direction:column;gap:6px;text-align:center}
.frx .exec-caveat{margin-top:10px;max-width:230px;font-size:12px;line-height:1.5;color:var(--muted);text-align:center}
.frx .exec-legend b{font-weight:800}

/* dna */
.frx .dna-hero{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}
@media(max-width:720px){.frx .dna-hero{grid-template-columns:1fr;gap:20px}}
.frx .radar-wrap{display:flex;justify-content:center}
.frx .band-v{display:flex;flex-direction:column;gap:10px}
/* --rc is set per card in the markup (RANK_COLOURS); the red fallback keeps
   any other .dcard usage looking as it did. */
.frx .dcard{border:1px solid var(--line);border-radius:12px;padding:14px 15px;background:#fff;
  border-left:3px solid var(--rc,var(--red))}
.frx .dcard .rk{font-size:10.5px;font-weight:800;color:var(--rc,var(--red));letter-spacing:.06em}
.frx .dcard .nm{font-size:15px;font-weight:800;margin-top:5px}
.frx .dcard .ds{font-size:12px;color:var(--ink-3);margin-top:4px;line-height:1.45}
.frx .dcard .mt{display:flex;align-items:center;gap:8px;margin-top:10px}
.frx .dcard .mt .t{flex:1;height:6px;border-radius:999px;background:var(--line);overflow:hidden}
.frx .dcard .mt .t i{display:block;height:100%;border-radius:999px;background:var(--rc,var(--red))}
.frx .dcard .mt .v{font-size:12px;font-weight:800;color:var(--rc,var(--red))}

/* method */
.frx .fw-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .fw-grid{grid-template-columns:1fr}}
.frx .fw{display:flex;gap:12px;padding:14px 15px;border:1px solid var(--line);border-radius:12px;background:#fff;position:relative}
.frx .fw .ic{width:34px;height:34px;border-radius:9px;flex:none;display:grid;place-items:center;background:var(--red-tint);color:var(--red)}
.frx .fw .nm{font-size:13.5px;font-weight:800}
.frx .fw .fr{font-size:11px;font-weight:700;color:var(--muted);margin-top:1px}
.frx .fw .ds{font-size:12px;color:var(--ink-3);margin-top:5px;line-height:1.45}
.frx .fw .fwn{position:absolute;top:12px;right:14px;font-size:12px;font-weight:800;color:var(--faint)}

/* scorecard - min-height:auto overrides the base .sheet's forced A4 page
   height for on-screen viewing only: this section's content is naturally
   short, and the print rule (further down) still forces the full A4 height
   during print/PDF, so pagination there is unaffected. */
.frx .sheet-compact{min-height:auto}
.frx .scoreGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:860px){.frx .scoreGrid{grid-template-columns:repeat(2,1fr)}}
.frx .scoreCard{position:relative;display:flex;flex-direction:column;gap:9px;border:1px solid var(--line);
  border-radius:16px;padding:18px 16px;background:linear-gradient(160deg,var(--sc-tint),#fff 65%);
  box-shadow:0 3px 12px rgba(20,20,25,.05);overflow:hidden}
.frx .scoreCard::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:var(--sc)}
.frx .scoreCard-top{position:absolute;top:14px;right:14px;font-size:9px;font-weight:800;letter-spacing:.08em;
  text-transform:uppercase;color:var(--sc);background:#fff;border:1px solid var(--sc);border-radius:999px;padding:3px 8px}
.frx .scoreCard-ic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  background:var(--sc);color:#fff;flex:none;box-shadow:0 3px 8px rgba(20,20,25,.14)}
.frx .scoreCard-lbl{font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)}
.frx .scoreCard-val{font-weight:800;color:var(--sc);letter-spacing:-.01em;line-height:1.2;overflow-wrap:break-word;min-height:1.2em}
/* .vpill is still used on the per-dimension pages further down. */
.frx .vpill{font-size:11px;font-weight:800;padding:4px 11px;border-radius:999px;white-space:nowrap;justify-self:start}
.frx .vpill.hi{background:var(--good-tint);color:#1f7a55}
.frx .vpill.mid{background:#fdf3dd;color:#a3620b}
.frx .vpill.lo{background:var(--line-2);color:var(--ink-3)}

.frx .dom-hd .why{color:var(--red);font-weight:700}

/* dimension pages */
.frx .dimhero{display:grid;grid-template-columns:1.15fr .85fr;gap:22px;align-items:center}
@media(max-width:720px){.frx .dimhero{grid-template-columns:1fr}}
.frx .dimhero-img{position:relative;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:${C.bg};box-shadow:var(--shadow-sm)}
.frx .dimhero-img img{width:100%;display:block}
.frx .dimhero-meta{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.frx .verdict{font-size:17px;font-weight:800;line-height:1.25;margin-top:2px}
.frx .dimtags{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}
.frx .tagpct{font-size:11px;font-weight:700;color:var(--red);background:var(--red-tint);border:1px solid var(--red-line);padding:4px 10px;border-radius:999px}
.frx .tagdelta{font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;background:var(--line-2)}
.frx .tagdelta.up{color:#1f7a55;background:var(--good-tint)}.frx .tagdelta.down{color:var(--ink-3)}
.frx .dimlede{font-size:14px;line-height:1.65;color:var(--ink-2);margin-top:20px;max-width:74ch}
.frx .resultchip{display:inline-flex;align-items:center;gap:8px;margin-bottom:8px;padding:5px 12px;border-radius:999px;background:var(--red-tint);border:1px solid var(--red-line)}
.frx .resultchip span{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .resultchip b{font-size:13px;font-weight:800;color:var(--red)}
.frx .cols{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:26px}
@media(max-width:720px){.frx .cols{grid-template-columns:1fr;gap:22px}}
.frx .bars{display:flex;flex-direction:column;gap:12px}
.frx .brow{display:grid;grid-template-columns:120px 1fr 32px;align-items:center;gap:10px}
.frx .brow .lb{font-size:12.5px;color:var(--ink-2);font-weight:600}
.frx .brow .bk{display:block}
.frx .brow .vv{font-size:12.5px;font-weight:800;text-align:right}
.frx .prose{max-width:68ch}
.frx .prose .subhd{color:var(--dc,var(--red));font-size:12px;font-weight:800;letter-spacing:.08em}
.frx .prose .lead{font-size:14.5px;color:var(--ink)}
.frx .prose p{font-size:13.5px;line-height:1.65;color:var(--ink-2)}
.frx .prose p+p{margin-top:11px}
.frx .twocard{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:26px}
@media(max-width:560px){.frx .twocard{grid-template-columns:1fr}}
.frx .lc{border:1px solid var(--line);border-radius:13px;padding:17px 17px 15px;background:#fff}
.frx .lc.good{background:#dcf5e9;border-color:#b1e8d4}
.frx .lc.grow{background:#fef3c7;border-color:#fde68a}
.frx .lc h4{margin:0 0 11px;font-size:13px;font-weight:800;display:flex;align-items:center;gap:8px}
.frx .lc h4::before{content:"";width:8px;height:8px;border-radius:2px}
.frx .lc.good h4{color:#1f7a55}.frx .lc.good h4::before{background:#10b981}
.frx .lc.grow h4{color:#d97706}.frx .lc.grow h4::before{background:#f59e0b}
.frx .lc ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px}
.frx .lc li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .lc li::before{position:absolute;left:0;top:0;font-weight:800}
.frx .lc.good li::before{content:"✓";color:#10b981}.frx .lc.grow li::before{content:"→";color:#f59e0b}
.frx .recos{margin-top:26px}
.frx .recos .subhd{color:#d97706;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.frx .recos ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;counter-reset:r}
.frx .recos li{counter-increment:r;position:relative;padding:16px 18px 16px 56px;border:1px solid var(--line);border-left:3px solid #f59e0b;border-radius:12px;background:#fffbeb;font-size:14px;line-height:1.55;color:var(--ink-2)}
.frx .recos li::before{content:counter(r);position:absolute;left:16px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:8px;background:#fef3c7;color:#d97706;display:grid;place-items:center;font-weight:800;font-size:14px;border:1px solid #fde68a}

/* per-dimension category colour - each of the 8 pages reads in its own hue */
.frx .param{--red:var(--dc);--red-strong:var(--dc);--red-tint:var(--dc-tint);--red-line:var(--dc-line)}
.frx .param .eyebrow,.frx .param .rh .ey .k{color:var(--dc)}
.frx .param .rh .ey .k{background:var(--dc)}
.frx .param .resultchip{background:var(--dc-tint);border-color:var(--dc-line)}
.frx .param .resultchip b{color:var(--dc)}
.frx .param .tagpct{color:var(--dc);background:var(--dc-tint);border-color:var(--dc-line)}
.frx .param .lc.good{background:var(--dc-tint);border-color:var(--dc-line)}
.frx .param .lc.good h4{color:var(--dc)}
.frx .param .lc.good h4::before{background:var(--dc)}
.frx .param .lc.good li::before{color:var(--dc)}
.frx .param .recos li{border-left-color:var(--dc)}
.frx .param .recos li::before{background:var(--dc-tint);color:var(--dc)}
.frx .param .tcard.on{border-color:var(--dc);background:var(--dc-tint);box-shadow:none}
.frx .param .tcard.on .th .tsc,.frx .param .tw b{color:var(--dc)}
.frx .param .th .tdot.on{background:var(--dc)}

/* the five traits */
.frx .temps{margin-top:26px}
/* Five cards, each carrying a full sentence - the wheel takes the narrower
   column and the cards get the room, or the text sets three words to a line. */
.frx .temp-wheel-row{display:grid;grid-template-columns:.62fr 1.38fr;gap:22px;align-items:start}
@media(max-width:640px){.frx .temp-wheel-row{grid-template-columns:1fr}}
.frx .temp-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
@media(max-width:440px){.frx .temp-grid{grid-template-columns:1fr}}
.frx .tnote{margin-top:14px;padding:11px 14px;border-radius:11px;background:var(--dc-tint);
  border:1px solid var(--dc-line);font-size:11.5px;line-height:1.5;color:var(--ink-2)}
.frx .tcard{border:1px solid var(--line);border-radius:12px;padding:13px;background:#fff}
.frx .tcard.on{border-color:var(--red);background:var(--red-tint);box-shadow:0 6px 18px rgba(242,85,90,.12)}
.frx .th{display:flex;align-items:center;gap:8px}
.frx .th .tdot{width:9px;height:9px;border-radius:50%;background:var(--faint);flex:none}
.frx .th .tdot.on{background:var(--red)}
.frx .th .tn{font-size:14px;font-weight:800;flex:1}
.frx .th .tsc{font-size:12px;font-weight:800;color:var(--muted)}
.frx .tcard.on .th .tsc{color:var(--red)}
.frx .tt{font-size:11.5px;color:var(--ink-3);margin-top:5px;line-height:1.4}
.frx .tw{margin-top:9px;font-size:11.5px;line-height:1.45;color:var(--ink-2)}
.frx .tw b{color:var(--red);font-weight:800}

/* riasec */
.frx .riasec-row{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}
@media(max-width:720px){.frx .riasec-row{grid-template-columns:1fr;gap:18px}}

/* career badge cards */
.frx .cardgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:640px){.frx .cardgrid{grid-template-columns:1fr}}
.frx .ccard{border:1px solid var(--line);border-radius:14px;padding:15px 16px;background:#fff;box-shadow:var(--shadow-sm)}
.frx .ccard-top{display:flex;align-items:center;gap:12px}
.frx .ccard-rk{width:28px;height:28px;border-radius:8px;flex:none;display:grid;place-items:center;background:var(--red);color:#fff;font-weight:800;font-size:13px}
.frx .ccard-main{flex:1;min-width:0}
.frx .ccard-nm{font-size:14.5px;font-weight:800}
.frx .ccard-dm{font-size:11.5px;color:var(--ink-3);margin-top:1px}
.frx .ccard-fit{text-align:right;flex:none}
.frx .ccard-fit b{font-size:18px;font-weight:800;color:var(--red)}
.frx .ccard-fit span{display:block;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .ccard-badges{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:13px}
.frx .mbadge2{display:flex;align-items:center;gap:6px;font-size:11px;border:1px solid var(--line);border-radius:9px;padding:7px 9px;color:var(--ink-2);background:${C.bg}}
.frx .mbadge2 svg{flex:none;color:var(--muted)}
.frx .mbadge2 .mb-l{color:var(--ink-3)}
.frx .mbadge2 b{margin-left:auto;font-weight:800;color:var(--ink)}
.frx .mbadge2.good{background:var(--good-tint);border-color:#cfe9dd}.frx .mbadge2.good svg{color:#1f7a55}.frx .mbadge2.good b{color:#1f7a55}
.frx .mbadge2.warn{background:var(--red-tint);border-color:var(--red-line)}.frx .mbadge2.warn svg{color:var(--red)}.frx .mbadge2.warn b{color:var(--red-strong)}
.frx .mbadge2.off{opacity:.7}
.frx .ccard-sal{display:flex;gap:8px;margin-top:11px;font-size:11px;color:var(--ink-3)}
.frx .ccard-sal span{flex:1;background:var(--line-2);border-radius:7px;padding:7px 9px;font-weight:600}

/* the recommendation that used to be a table of its own */
.frx .ccard-verdict{font-weight:800}
.frx .ccard-verdict.hi{color:#1f7a55}
.frx .ccard-verdict.mid{color:#a3620b}
.frx .ccard-verdict.lo{color:var(--ink-3)}

/* domains */
.frx .dom{border:1px solid var(--rc-line,var(--line));border-top:5px solid var(--rc,var(--red));border-radius:16px;overflow:hidden;background:#fff;margin-bottom:28px;box-shadow:var(--shadow)}
.frx .dom-img-wrap{position:relative;height:148px;background:var(--rc-tint,${C.bg})}
.frx .dom-img{width:100%;height:100%;object-fit:cover;display:block}
.frx .dom-img-rk{position:absolute;left:16px;bottom:-22px;width:52px;height:52px;border-radius:14px;display:grid;place-items:center;font-size:22px;font-weight:800;color:#fff;background:var(--rc,var(--red));box-shadow:0 6px 16px rgba(20,20,25,.28);border:3px solid #fff}
.frx .dom-hd{display:flex;align-items:center;gap:14px;padding:16px 18px 16px 82px;background:var(--rc-tint,${C.bg});border-bottom:1px solid var(--rc-line,var(--line))}
.frx .dom-hd .rk{display:none}
.frx .dom-hd-main{flex:1;min-width:0}
.frx .dom-hd .nm{font-size:16px;font-weight:800}
.frx .dom-hd .tl{font-size:12px;color:var(--ink-3);margin-top:2px}
.frx .dom-hd .fit{margin-left:auto;text-align:right;flex:none}
.frx .dom-hd .fit b{font-size:21px;font-weight:800;color:var(--rc,var(--red))}
.frx .dom-hd .fit span{display:block;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.frx .dom-fitbox{margin-left:auto;text-align:right;flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.frx .dom-confidence{font-size:10px;font-weight:800;letter-spacing:.04em;color:var(--rc,var(--red));background:var(--red-tint);border:1px solid var(--red-line);padding:2px 8px;border-radius:999px;white-space:nowrap}
.frx .dom-fitbar{padding:0 18px 14px}
.frx .dom-bd{display:grid;grid-template-columns:1fr 1fr}
@media(max-width:560px){.frx .dom-bd{grid-template-columns:1fr}}
.frx .dcell{padding:14px 18px;border-top:1px solid var(--line-2)}
.frx .dcell:nth-child(even){border-left:1px solid var(--line-2)}
@media(max-width:560px){.frx .dcell:nth-child(even){border-left:none}}
.frx .dcell .h{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.frx .dcell p{font-size:12.5px;line-height:1.55;color:var(--ink-2)}
.frx .dom-align{background:${C.bg}}
.frx .dom-align-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}
.frx .dom-align-grid .k{display:block;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
.frx .dom-align-grid .v{display:block;font-size:16px;font-weight:800;color:var(--ink);margin-top:2px}
.frx .dom-skills{display:flex;flex-wrap:wrap;gap:7px}
.frx .dom-skill{font-size:11.5px;font-weight:700;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:5px 11px;border-radius:999px}
.frx .dom-roles{display:flex;flex-direction:column;gap:8px}
.frx .dom-role-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 11px;background:${C.bg};border-radius:8px}
.frx .dom-role-nm{font-size:12.5px;font-weight:700;color:var(--ink);flex:1;min-width:0}
.frx .dom-role-fitwrap{display:flex;align-items:center;gap:9px;flex:none;width:130px}
.frx .dom-role-bar{flex:1;min-width:60px}
.frx .dom-role-pct{font-size:11.5px;font-weight:800;width:36px;text-align:right;flex:none}

.frx .sal{display:flex;gap:10px;flex-wrap:wrap}
.frx .sal .s{flex:1;min-width:150px;background:var(--line-2);border-radius:9px;padding:9px 11px}
.frx .sal .s .r{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.frx .sal .s .a{font-size:12.5px;font-weight:700;color:var(--ink);margin-top:2px}
.frx .dlinks{display:flex;flex-wrap:wrap;gap:7px}
.frx .dlinks a{font-size:11.5px;font-weight:700;color:var(--red);text-decoration:none;background:var(--red-tint);border:1px solid var(--red-line);padding:6px 11px;border-radius:8px}
.frx .dlinks a::after{content:" ↗";opacity:.6}

/* roadmap */
.frx .road-card{background:var(--rc-tint,${C.bg});border:1px solid var(--rc-line,var(--line));border-radius:20px;padding:26px 24px}
.frx .road-intro{display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--rc-line,var(--line))}
.frx .road-intro-rk{width:38px;height:38px;border-radius:10px;flex:none;display:grid;place-items:center;font-weight:800;font-size:14px;color:#fff;background:var(--rc,var(--red))}
.frx .road-intro-main{flex:1;min-width:0}
.frx .road-intro-k{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.frx .road-intro-nm{font-size:18px;font-weight:800;color:var(--ink);margin-top:3px}
.frx .road-intro-fit{flex:none;text-align:right}
.frx .road-intro-fit b{font-size:20px;font-weight:800;color:var(--rc,var(--red))}
.frx .road-intro-fit span{display:block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .journey{border:1px solid var(--line);border-radius:14px;padding:14px 10px;background:#fff;margin-bottom:18px}
.frx .road{position:relative;padding-left:38px;counter-reset:road}
.frx .road::before{content:"";position:absolute;left:12px;top:6px;bottom:6px;width:2px;background:var(--red-line)}
.frx .rstep{position:relative;padding:0 0 22px;counter-increment:road}
.frx .rstep:last-child{padding-bottom:0}
.frx .rstep::before{content:counter(road);position:absolute;left:-38px;top:-3px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff;background:var(--red);box-shadow:0 0 0 4px #fff}
.frx .rstep:last-child::before{background:var(--ink)}
.frx .rstep .yr{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--red)}
.frx .rstep .ti{font-size:15px;font-weight:800;margin-top:3px}
.frx .rstep .tx{font-size:12.5px;line-height:1.55;color:var(--ink-2);margin-top:5px;max-width:62ch}
.frx .rstep .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.frx .rstep .tags em{font-style:normal;font-size:11px;font-weight:600;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:4px 10px;border-radius:999px}
.frx .road-note{margin-top:18px;padding:12px 16px;border-radius:10px;background:#fff;border:1px solid var(--rc-line,var(--line));font-size:12px;line-height:1.5;color:var(--ink-3);font-style:italic}


/* academic path */
.frx .apath{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:640px){.frx .apath{grid-template-columns:1fr}}
.frx .apcard{border:1px solid var(--line);border-radius:12px;padding:15px 16px;background:#fff}
.frx .apcard.stream{background:#fff;border-left:3px solid var(--red)}
.frx .aph{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:9px;display:flex;align-items:center;gap:7px}
.frx .aph svg{color:var(--red)}
.frx .apv{font-size:16px;font-weight:800;color:var(--red)}
.frx .apchips{display:flex;flex-wrap:wrap;gap:6px}
.frx .apchips em{font-style:normal;font-size:12px;font-weight:700;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:5px 10px;border-radius:8px}
.frx .skills{margin-top:22px}
.frx .skillrow{display:flex;flex-wrap:wrap;gap:8px}
.frx .skill{font-size:12.5px;font-weight:700;color:var(--red);background:var(--red-tint);border:1px solid var(--red-line);padding:7px 13px;border-radius:999px}


/* future */
.frx .future{display:grid;grid-template-columns:1.1fr .9fr;gap:14px}
@media(max-width:720px){.frx .future{grid-template-columns:1fr}}
.frx .fcol{border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.frx .fcol.rise{background:var(--red-tint);border-color:var(--red-line)}
.frx .fcol.fall{background:${C.bg}}
.frx .fh{font-size:13.5px;font-weight:800;display:flex;align-items:center;gap:8px;margin-bottom:13px}
.frx .fcol.rise .fh{color:var(--red-strong)}.frx .fcol.fall .fh{color:var(--ink-2)}
.frx .fgrid{display:flex;flex-direction:column;gap:10px}
.frx .fitem .ft{font-size:13px;font-weight:800;color:var(--ink)}
.frx .fitem .fd{font-size:11.5px;color:var(--ink-3);margin-top:2px;line-height:1.45}
.frx .flist{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.frx .flist li{position:relative;padding-left:22px;font-size:12.5px;color:var(--ink-2);line-height:1.4}
.frx .flist li::before{content:"↓";position:absolute;left:0;top:0;color:var(--muted);font-weight:800}
.frx .fnote{margin-top:13px;padding-top:12px;border-top:1px dashed var(--line);font-size:11.5px;color:var(--ink-2);line-height:1.5;font-style:italic}

/* resources */
.frx .res{display:flex;flex-direction:column;gap:20px}
.frx .rgh{font-size:13.5px;font-weight:800;display:flex;align-items:center;gap:8px;margin-bottom:11px;color:var(--ink)}
.frx .rgh svg{color:var(--red)}
.frx .rchips{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}
@media(max-width:640px){.frx .rchips{grid-template-columns:1fr 1fr}}
@media(max-width:440px){.frx .rchips{grid-template-columns:1fr}}
.frx .rchip{display:block;border:1px solid var(--line);border-radius:11px;padding:11px 13px;text-decoration:none;background:#fff}
.frx .rchip b{display:block;font-size:13px;font-weight:800;color:var(--ink)}
.frx .rchip span{display:block;font-size:11px;color:var(--ink-3);margin-top:2px}
.frx .portals{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .portals{grid-template-columns:1fr}}
.frx .pcol{border:1px solid var(--line);border-radius:12px;padding:13px 15px;background:#fff}
.frx .pr{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:9px}
.frx .plist{display:flex;flex-wrap:wrap;gap:7px}
.frx .plist a{font-size:12px;font-weight:700;color:var(--red);text-decoration:none;background:var(--red-tint);border:1px solid var(--red-line);padding:6px 11px;border-radius:8px}
.frx .schol{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.frx .schol{grid-template-columns:1fr}}
.frx .scard{display:block;border:1px solid var(--line);border-left:3px solid var(--red);border-radius:11px;padding:12px 14px;text-decoration:none;background:#fff}
.frx .scard .sn{font-size:13px;font-weight:800;color:var(--ink)}
.frx .scard .sw{font-size:11px;color:var(--ink-3);margin-top:3px;line-height:1.45}

/* parents + closing */
.frx .parents{border:1px solid var(--line);border-radius:14px;padding:18px 20px;background:${C.bg}}
.frx .ph{font-size:14px;font-weight:800;color:var(--ink);display:flex;align-items:center;gap:9px}
.frx .ph .pic{color:var(--red);display:inline-flex}
.frx .pintro{font-size:13px;color:var(--ink-2);margin:9px 0 12px;line-height:1.55}
.frx .plist2{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:9px}
@media(max-width:560px){.frx .plist2{grid-template-columns:1fr}}
.frx .plist2 li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .plist2 li::before{content:"✦";position:absolute;left:0;top:0;color:var(--red);font-weight:800}
.frx .closing{margin-top:16px;border-radius:15px;overflow:hidden;background:${C.ink};color:#fff;padding:32px 28px;text-align:center;position:relative}
.frx .closing::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--red),var(--red-strong))}
.frx .closing h3{color:#fff;font-size:23px;font-weight:800}
.frx .closing p{color:#c9c9d2;font-size:14px;line-height:1.6;max-width:52ch;margin:11px auto 0}
.frx .closing .b{margin-top:20px;font-size:13px;font-weight:700;padding:12px 22px;border-radius:11px;border:none;cursor:pointer}
.frx .closing .b1{background:var(--red);color:#fff}
.frx .closing .closing-mail{margin-top:20px;display:inline-block;font-size:12.5px;font-weight:600;color:#e6e6ec;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:11px;padding:11px 18px;max-width:46ch}
.frx .disclaimer{margin-top:14px;padding:14px 18px;border:1px solid var(--line);border-radius:12px;
  background:#fafafb;color:#5b5b66;font-size:12.5px;line-height:1.65}
.frx .disclaimer b{color:${C.ink}}
.frx .dl-cta{margin-top:26px;padding-top:22px;border-top:1px solid var(--line)}
.frx .dl-cta-label{font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:12px}
.frx .dl-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:560px){.frx .dl-cta-row{grid-template-columns:1fr}}
.frx .dl-btn{display:flex;align-items:center;gap:14px;padding:16px 18px;border:1px solid var(--line);border-radius:13px;background:${C.bg};cursor:pointer;text-align:left;font-family:inherit;width:100%}
.frx .dl-btn:hover{border-color:var(--red-line)}
.frx .dl-btn-icon{font-size:22px;flex:none}
.frx .dl-btn-label{display:block;font-size:14px;font-weight:800;color:var(--ink)}
.frx .dl-btn-desc{display:block;font-size:12px;color:var(--muted);margin-top:2px}
.frx .contact-block{margin-top:32px;padding-top:26px;border-top:1px solid var(--line);text-align:center}
.frx .contact-logo{height:32px;width:auto;margin:0 auto 16px;display:block}
.frx .contact-lines{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px 20px}
.frx .contact-lines span{font-size:20px;font-weight:800;color:var(--ink);letter-spacing:-.01em}

/* Consistent A4 pages - every section prints as the same page size. */
@page{size:A4 portrait;margin:0}
@media print{
  /* Force every background, tint, bar-fill and colour to print (Chrome/Edge honour
     this even when "Background graphics" is unchecked). */
  .frx,.frx *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
  /* The on-screen .frx has its own 32px/16px padding for the scrollable
     preview - left in place during print, it only pads the very first page
     (padding on the flex/block container isn't repeated per page break),
     shifting page 1's content down relative to every page after it. */
  .frx{gap:0;display:block;padding:0}
  .frx .og-noprint{display:none !important}
  /* Each sheet = one uniform A4 page (same width + height). */
  .frx .sheet{box-sizing:border-box;width:210mm;min-height:296mm;margin:0 auto;
    box-shadow:none;border:none;border-radius:0;border-top:3px solid var(--red);
    page-break-after:always;break-after:page;overflow:visible}
  .frx .sheet:last-child{page-break-after:auto}
  /* never leave a scroll-reveal section hidden in the PDF */
  .frx .rv{opacity:1 !important;transform:none !important}
  /* keep charts and blocks from being clipped/split awkwardly */
  .frx svg{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important}
  /* break-inside:avoid on every card/row that has its own visible border or
     a badge/ring inside it - without this, the browser is free to split ANY
     of these mid-box across a page boundary, which is what "cut off" and
     "misaligned" actually were: a next-step card's number badge on one
     page and its text on the next, or the score ring in the dimension hero
     sliced in half. .dimhero and .recos li were the two real gaps - the
     hero row (image + score ring) and the numbered "Recommended next
     steps" cards had no protection at all. */
  .frx .twocard,.frx .dom,.frx .role,.frx .fw,.frx .dcard,.frx .ccard,.frx .apcard,
  .frx .model,.frx .scard,.frx .rstep,.frx .tcard,.frx .scoreCard,
  .frx .dimhero,.frx .recos li,.frx .lc{break-inside:avoid}
}
`;
