"use client";

/**
 * FullReport — the in-depth, magazine-grade career report (2026, v3).
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
 * Scroll-reveal on screen. This is a VIEW-ONLY surface — <ViewOnlyReport/> (from
 * the parent) blanks the page on print, and the PDF students actually keep is
 * the one emailed to them, rendered server-side by lib/report/reportPdf.tsx.
 * The per-sheet pagination CSS below is kept so the layout can be printed again
 * by re-enabling that guard, but it has no effect while it's mounted.
 */

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, RadarChart, SkillBar, dimColor, type RadarDatum } from "@/app/account/viz";
import { Scene } from "@/app/account/illustrations";
import { CareerCard, getCareerVisual, CareerImageWithSVG } from "@/app/account/careerVisuals";
import { getImageForRole } from "@/app/account/careerRoleImages";
import { PersonalityMBTI } from "@/app/account/PersonalityMBTI";
import {
  categoryDeepDive, roadmap, stageLabelOf, DOMAINS,
  archetype, percentileOf, subTraits, actionPlan, type Domain,
  traitProfile, resultOf, domainFit, type DomainFit,
  FUTURE, LEARNING, JOB_PORTALS, SCHOLARSHIPS_2026,
  academicPath, workEnvironment, ROLE_MODELS, PARENT_TIPS,
} from "@/lib/report/knowledge";

/* ------------------------------- assets -------------------------------- */
const LOGO = "/onegrasp-logo-tight.png";

/**
 * Colour per best-fit rank — green, amber, blue. Rank, not domain: the point is
 * to separate 1st / 2nd / 3rd at a glance, and it stays stable no matter which
 * domains come out on top. Ordered warm-to-cool so the strongest reads first.
 * All three sit near the same perceived weight, so none of them looks like a
 * warning next to the others.
 */
const RANK_COLOURS = ["#12996b", "#e08a1e", "#2f6bff"] as const;
const P = "https://onegrasp.com/wp-content/uploads/2026/07/";
const DIMS8 = P + "ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";

type Meta = { label: string; dim: string; icon: string; img: string };
const CAT: Record<string, Meta> = {
  personality: { label: "Personality", dim: "01", icon: "personality", img: P + "personality.png" },
  career_interest: { label: "Career Interest", dim: "02", icon: "career_interest", img: P + "career-interest.png" },
  multiple_intelligence: { label: "Multiple Intelligence", dim: "03", icon: "multiple_intelligence", img: P + "Multiple-intelligence.png" },
  emotional_intelligence: { label: "Emotional Intelligence", dim: "04", icon: "emotional_intelligence", img: P + "Emotional-inteliigence.png" },
  learning_styles: { label: "Learning Preferences", dim: "05", icon: "learning_styles", img: P + "Learning-stykes.png" },
  motivators: { label: "Motivators", dim: "06", icon: "motivators", img: P + "Motivators.png" },
  strengths: { label: "Strengths", dim: "07", icon: "strengths", img: P + "strenghts.png" },
  aptitude: { label: "Aptitude", dim: "08", icon: "aptitude", img: P + "aptitude.png" },
};
const CANON = ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence", "learning_styles", "motivators", "strengths", "aptitude"];

// "Typical student at your stage" markers — presentation-only benchmark.
const BENCH: Record<string, number> = {
  personality: 55, career_interest: 52, multiple_intelligence: 54, emotional_intelligence: 56,
  learning_styles: 58, motivators: 55, strengths: 50, aptitude: 52,
};

const clamp = (n: number) => Math.max(3, Math.min(100, Math.round(n)));
const bandOf = (p: number) =>
  p >= 75 ? { label: "Very High", tone: "hi" } : p >= 65 ? { label: "High", tone: "hi" }
  : p >= 50 ? { label: "Medium", tone: "mid" } : p >= 35 ? { label: "Low", tone: "lo" }
  : { label: "Weak", tone: "lo" };

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

export default function FullReport({ a, name, extraSheets = [] }: { a: AssessmentSummary; name?: string; extraSheets?: ReportSheet[] }) {
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
    return CANON.map((k) => src.find((r) => r.key === k) ?? { key: k, label: CAT[k].label, score: 0, bench: BENCH[k] || 50 });
  }, [a.radar]);
  // Coherent recommendations: blend interest + abilities + intelligences + values.
  const fits = domainFit(a);
  const domainList = fits.slice(0, 3);
  const topDomain = domainList[0];
  const phases = roadmap(stageLabelOf(a.journeyCode), topDomain.name);
  const arch = archetype(a);
  const plan = actionPlan(a, topDomain.name);
  // Overall fit now reflects the whole profile, not just the interest tally.
  const fit = Math.max(a.overallFitmentPct ?? 0, topDomain.fit);
  const roles = coherentRoles(a, fits);
  const traits = traitProfile(a);
  const acad = academicPath(a, a.journeyCode, topDomain.name);
  const workEnv = workEnvironment(a, topDomain.name);
  // Derive topLetter from topDomain for consistent role model selection
  const topLetter = Object.entries(DOMAINS).find(([_, d]) => d.name === topDomain.name)?.[0] ?? (a.themes ?? [])[0]?.letter ?? "B";
  const models = ROLE_MODELS[topLetter] ?? ROLE_MODELS.B;
  const strongest = radar.slice().sort((x, y) => y.score - x.score)[0];
  const weakest = radar.slice().filter((r) => r.score > 0).sort((x, y) => x.score - y.score)[0];
  const themes = (a.themes ?? []).slice();
  // Holland themes are their own vector (R/I/A/S/E/C). `themes` holds CAREER
  // CLUSTER letters (A–H) — feeding those to the hexagon mislabels clusters as
  // Holland types, so use the real RIASEC scores whenever the engine has them.
  const riasec = (a.riasecScores ?? []).length
    ? a.riasecScores!.map((r) => ({ letter: r.letter, title: r.name, score: r.score }))
    : themes.filter((t) => "RIASEC".includes(t.letter));
  const dateStr = (() => { try { return new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } })();
  const first = (name || "").trim().split(/\s+/)[0] || "you";
  // Check if this is a "new" Class 9-10 report with MBTI data
  const hasMBTIData = !!(
    (a as any).mbtiEI !== undefined ||
    (a as any).mbtiSN !== undefined ||
    (a as any).mbtiTF !== undefined ||
    (a as any).mbtiJP !== undefined
  );
  const isNewReport = a.journeyCode === "9-10" && hasMBTIData;

  let sheet = 0;
  const N = () => String(++sheet).padStart(2, "0");

  return (
    <div ref={root} className="frx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ===== COVER ===== */}
      <section className={`sheet cover rv ${isNewReport ? "cover-new" : "cover-old"}`}>
        <div className="cover-in">
          <div className="cover-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cover-logo" src={LOGO} alt="OneGrasp" />
            <span className="badge">8 dimensions · scientifically structured</span>
          </div>
          <div className="kick">Career Fitment Report</div>
          <h1>Who you are, <span>and where it can take you.</span></h1>
          <p className="lede">A complete map of your strengths, interests and natural wiring — built from your responses across eight established frameworks.</p>
          <div className="cover-foot">
            <div className="cover-name">
              <span className="rl">Prepared for</span>
              <span className="nm">{name || "You"}</span>
              {a.journeyName ? <span className="sub">{a.journeyName}</span> : null}
            </div>
            {dateStr && <div className="cover-chips"><span className="c">{dateStr}</span></div>}
          </div>
        </div>
      </section>

      {/* ===== CONTENTS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="What's inside" />
          <SecHead eyebrow="Your report at a glance" title="What this report covers"
            sub="Read it top to bottom, or jump to what matters. Every section is built from your own responses." />
          <div className="toc">
            {[
              ["Executive summary", "The headline read on who you are", "pulse"],
              ["Career DNA & profile", "Your archetype and profile radar", "radar"],
              ["How this was measured", "The eight frameworks behind your scores", "check"],
              ["At-a-glance scorecard", "All eight dimensions, ranked & rated", "score"],
              ["The eight dimensions", "A deep dive on each, one by one", "clusters"],
              ["Interests & personality", "RIASEC hexagon and your five traits", "career_interest"],
              ["Careers that fit you", "Roles, badges, salaries & recommendation", "briefcase"],
              ["Your path & plan", "Academics, roadmap, 30/90-day actions", "route"],
              ["Resources & scholarships", "Where to learn, work and get funded", "cap"],
            ].map(([t, d, ic]) => (
              <div className="toc-row" key={t}>
                <span className="toc-ic"><Icon name={ic} size={16} /></span>
                <div><div className="toc-t">{t}</div><div className="toc-d">{d}</div></div>
              </div>
            ))}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== EXECUTIVE SUMMARY ===== */}
      <section className="sheet rv">
        <SceneBand kind="growth" eyebrow={`Executive summary · ${N()}`} title={`In short, ${first} —`} />
        <div className="pad">
          <div className="exec">
            <div className="exec-l">
              <div className="dna-arch">Your archetype</div>
              <h2 className="arch">{arch.name}</h2>
              <p className="one">{a.summary || arch.tagline}</p>
              <div className="exec-cards">
                <div className="ec"><span className="ec-k">Top interest</span><span className="ec-v">{topDomain.name || "—"}</span></div>
                <div className="ec"><span className="ec-k">Core driver</span><span className="ec-v">{a.topValues?.[0]?.tag || "—"}</span></div>
                <div className="ec"><span className="ec-k">Strongest area</span><span className="ec-v">{strongest ? CAT[strongest.key].label : "—"}</span></div>
                <div className="ec"><span className="ec-k">Learns best via</span><span className="ec-v">{a.learningStyles?.[0]?.name || "—"}</span></div>
              </div>
            </div>
            <div className="exec-r">
              <Ring value={fit} size={150} stroke={14} color={C.red}>
                <div className="ring-num" style={{ fontSize: 24 }}>{bandOf(fit).label}</div>
                <div className="ring-den">profile alignment</div>
              </Ring>
              <div className="exec-legend">
                <div><b style={{ color: C.good }}>Where you shine</b>{strongest ? ` ${CAT[strongest.key].label}` : ""}</div>
                <div><b style={{ color: C.muted }}>Room to grow</b>{weakest ? ` ${CAT[weakest.key].label}` : ""}</div>
              </div>
              <div className="exec-caveat">
                How consistently your answers line up across the eight dimensions.
                It is not a prediction of success, and not a mark out of 100.
              </div>
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== CAREER DNA (radar + top domains) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Your Career DNA" />
          <SecHead eyebrow="How your eight dimensions come together" title="Your profile, on one map"
            sub="No single test defines you — the shape of all eight together is what makes this read accurate." />
          <div className="dna-hero">
            <div className="radar-wrap"><RadarChart data={radar} color={C.red} abbr={CATEGORY_ABBR} /></div>
            <div className="band-v">
              {Array.from(new Set(roles.map(r => r.domain))).slice(0, 3).map((domain, i) => {
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
          <RF name={name} />
        </div>
      </section>

      {/* ===== METHOD ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="How this was measured" />
          <SecHead eyebrow="The science behind your report" title="Eight established frameworks, one picture"
            sub="Your responses were scored against eight independent, research-backed models." />
          <div className="dims8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DIMS8} alt="The eight dimensions of your profile" loading="lazy" />
          </div>
          <div className="fw-grid">
            {FRAMEWORKS.map((f) => (
              <div className="fw" key={f.k}>
                <span className="ic"><Icon name={CAT[f.k].icon} size={18} /></span>
                <div><div className="nm">{CAT[f.k].label}</div><div className="fr">{f.fr}</div><div className="ds">{f.ds}</div></div>
                <span className="fwn">{CAT[f.k].dim}</span>
              </div>
            ))}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== VERDICT TABLE (at a glance) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="At a glance" />
          <SecHead eyebrow="Every dimension, ranked and rated" title="Your eight-dimension scorecard"
            sub="Strongest first. Scores are 0–100, the tick on each bar marks the typical student at your stage, and the note says what it means for you." />
          <div className="vtable">
            <div className="vhead"><span>Dimension</span><span>Score</span><span className="vhide">Rating</span><span className="vhide2">What it means</span></div>
            {/* Sorted strongest-first so this one table also carries the ranking. */}
            {radar.slice().sort((x, y) => y.score - x.score).map((d) => {
              const b = bandOf(d.score);
              const res = resultOf(d.key, a);
              return (
                <div className="vrow" key={d.key}>
                  <span className="vname"><span style={{ color: dimColor(d.key), display: "inline-flex" }}><Icon name={CAT[d.key].icon} size={15} /></span> {CAT[d.key].label}</span>
                  <span className="vbar"><SkillBar value={d.score} color={dimColor(d.key)} benchmark={BENCH[d.key]} /><b className="text-xs">{bandOf(d.score).label}</b></span>
                  <span className={`vpill ${b.tone}`}>{b.label}</span>
                  {/* Never hidden: on a phone this wraps to its own line rather
                      than dropping, so all eight dimensions keep their verdict. */}
                  <span className="vmean">{res ? `${res.label}: ${res.value}` : (VERDICT[d.key] ?? "")}</span>
                </div>
              );
            })}
          </div>
          <div className="vlegend">
            <span><i className="d hi" /> Very High (75+) / High (65–74)</span>
            <span><i className="d mid" /> Medium (50–64)</span>
            <span><i className="d lo" /> Low (35–49) / Weak (&lt;35)</span>
            <span className="vlegend-bench"><i className="tick" /> tick = typical student at your stage</span>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== THE 8 DIMENSIONS ===== */}
      {radar.map((d) => {
        const m = CAT[d.key];
        const col = dimColor(d.key);
        const isClass910 = a.journeyCode === "9-10";
        // Only show MBTI if this assessment actually has MBTI data
        const hasMBTIData = !!(
          (a as any).mbtiEI !== undefined ||
          (a as any).mbtiSN !== undefined ||
          (a as any).mbtiTF !== undefined ||
          (a as any).mbtiJP !== undefined
        );
        const isMBTIPersonality = d.key === "personality" && isClass910 && hasMBTIData;

        if (isMBTIPersonality) {
          const sheetNum = N();
          return (
            <section className="sheet param rv" key={d.key} style={{ borderTopColor: col, ["--dc" as string]: col, ["--dc-tint" as string]: col + "14", ["--dc-line" as string]: col + "40" } as React.CSSProperties}>
              <div className="pad">
                <RH n={sheetNum} kick={`Dimension ${m.dim} — ${m.label}`} accent />
                <PersonalityMBTI a={a} sheetNum={sheetNum} name={name} />
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
              <RH n={N()} kick={`Dimension ${m.dim} — ${m.label}`} accent />
              <div className="dimhero">
                <div className="dimhero-img" style={{ background: col + "12" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.label} loading="lazy" />
                  <span className="dimhero-num" style={{ WebkitTextStrokeColor: col }}>{m.dim}</span>
                </div>
                <div className="dimhero-meta">
                  <Ring value={d.score} size={96} stroke={10} color={col}>
                    <div className="ring-num text-sm">{bandOf(d.score).label}</div><div className="ring-den">Score</div>
                  </Ring>
                  <div>
                    {res ? <div className="resultchip"><span>{res.label}</span><b>{res.value}</b></div> : null}
                    <div className="verdict">{VERDICT[d.key] ?? m.label}</div>
                    <div className="dimtags">
                      <span className={`vpill ${bandOf(d.score).tone}`}>{bandOf(d.score).label}</span>
                      {d.score > 0 ? <span className="tagpct">Higher than {pct}% of peers</span> : null}
                      <span className={`tagdelta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "Well above" : delta < -10 ? "Below" : "About"} typical</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="dimlede">{dd.meaning}</p>

              <div className="cols">
                {subs.length ? (
                  <div>
                    <div className="subhd">Your breakdown</div>
                    <div className="bars">
                      {subs.map((sub) => {
                        const subBand = bandOf(sub.value);
                        return (
                          <div className="brow" key={sub.label}>
                            <span className="lb">{sub.label}</span>
                            <span className="bk"><SkillBar value={sub.value} color={col} height={9} /></span>
                            <span className="vv text-xs">{subBand.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : <div />}
                <div className="prose">
                  <div className="subhd">What this means for you</div>
                  <p className="lead">{dd.strengths[0] || `This dimension shows how ${CAT[d.key]?.label.toLowerCase()} impacts your choices and strengths.`}</p>
                  {dd.strengths[1] ? <p>{dd.strengths[1]}</p> : null}
                  {dd.grow[0] ? <p>{dd.grow[0]}</p> : null}
                </div>
              </div>
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

      {/* ===== INTERESTS — RIASEC HEXAGON ===== */}
      {riasec.length > 0 && (
        <section className="sheet rv">
          <div className="pad">
            <RH n={N()} kick="Your interests" />
            <SecHead eyebrow="Holland's RIASEC model" title="What genuinely pulls you"
              sub="Interest is the single biggest driver of long-term satisfaction. Your top themes point to the fields to explore first." />
            <div className="riasec-row">
              <RiasecHex themes={riasec} />
              <div className="riasec-bars">
                {["R", "I", "A", "S", "E", "C"].map((L) => {
                  const t = riasec.find((x) => x.letter === L);
                  const sc = t ? Math.round(t.score) : 0;
                  const top = (a.riasecCode || riasec.slice(0, 3).map((x) => x.letter).join("")).includes(L);
                  const riasecBand = bandOf(sc);
                  return (
                    <div className={`rb-row${top ? " top" : ""}`} key={L}>
                      <span className="rb-l">{RIASEC_NAME[L]}</span>
                      <span className="rb-track"><SkillBar value={sc} color={top ? C.red : C.faint} height={9} /></span>
                      <span className="rb-v text-xs">{riasecBand.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <RF name={name} />
          </div>
        </section>
      )}

      {/* ===== BEST-FIT DOMAINS ===== */}
      <section className="sheet rv">
        <SceneBand kind="careers" eyebrow={`Best-fit domains · ${N()}`} title="Fields you're built for" />
        <div className="pad">
          <SecHead eyebrow="Broad fields, not job titles" title="Domains worth exploring first"
            sub="Each with a real path into it from where you are now — in India and abroad." />
          {domainList.map((d, i) => <DomainCard key={d.key} d={d} rank={i + 1} />)}
          <RF name={name} />
        </div>
      </section>

      {/* ===== RECOMMENDED DOMAINS (NOT SPECIFIC ROLES) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Domains that fit you" />
          <SecHead eyebrow="Career domains aligned with your profile" title="Your recommended domains"
            sub="Based on your interests, abilities, intelligences, and values. These are your best-fit fields—not a ranked hierarchy, but fields where you have genuine strength. Below each domain are specific roles you can explore in that field." />

          {/* Explanation of what fit scores mean */}
          <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>📊 How to read these fits</div>
            <div style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: '1.5' }}>
              Each domain shows how well your profile aligns with it. <strong>50%+ fit means this is a genuine strength</strong> — you have real interest, ability, and values alignment. Higher percentages (70%+) indicate especially strong alignment. The specific job roles listed show which careers within that domain match you best.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {domainList.map((d, i) => {
              const domainRoles = roles.filter(r => r.domain === d.name);
              const confidenceLabel = d.breakdown.confidence === 4 ? "Strong" : d.breakdown.confidence === 3 ? "Good" : "Moderate";
              const verdict = d.fit >= 75 ? { t: "Top Match", c: "hi" } : d.fit >= 60 ? { t: "Good Match", c: "mid" } : { t: "Explore", c: "lo" };

              return (
                <div key={d.key} style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{d.name}</h3>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff', background: '#7c3aed', padding: '4px 8px', borderRadius: '4px' }}>{domainRoles.length} roles</span>
                  </div>

                  {/* Main Score */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed' }}>{d.fit}%</div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>Domain Fit</div>
                      <div style={{ display: 'inline-block', paddingTop: '4px', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                        background: verdict.c === 'hi' ? '#dcfce7' : verdict.c === 'mid' ? '#fef3c7' : '#fee2e2',
                        color: verdict.c === 'hi' ? '#15803d' : verdict.c === 'mid' ? '#92400e' : '#991b1b' }}>
                        {verdict.t}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>What aligns:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><span style={{ color: '#9ca3af' }}>Interest:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.interest}%</span></div>
                      {d.breakdown.aptitude !== null && <div><span style={{ color: '#9ca3af' }}>Aptitude:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.aptitude}%</span></div>}
                      {d.breakdown.mi !== null && <div><span style={{ color: '#9ca3af' }}>Intelligence:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.mi}%</span></div>}
                      {d.breakdown.values !== null && <div><span style={{ color: '#9ca3af' }}>Values:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.values}%</span></div>}
                    </div>
                  </div>

                  {/* Confidence indicator */}
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontWeight: '600' }}>Confidence:</span> {confidenceLabel} ({d.breakdown.confidence}/4 dimensions align)
                  </div>

                  {/* Job Roles */}
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Popular Job Roles:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {domainRoles.slice(0, 4).map((role) => {
                        const roleBand = bandOf(role.fit);
                        const bandColor = roleBand.tone === 'hi' ? '#10b981' : roleBand.tone === 'mid' ? '#f59e0b' : '#ef4444';
                        return (
                          <div key={role.role} style={{ fontSize: '13px', color: '#1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{role.role}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: bandColor, background: bandColor + '15', padding: '4px 8px', borderRadius: '4px' }}>{roleBand.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== ACADEMIC PATH ===== */}
      <section className="sheet rv">
        <SceneBand kind="education" eyebrow={`Academic path · ${N()}`} title="How to get there" />
        <div className="pad">
          <SecHead eyebrow="From where you are now" title="Stream, subjects & exams to aim for" sub={acad.note} />
          <div className="apath">
            <div className="apcard stream"><div className="aph"><Icon name="cap" size={15} /> Recommended stream</div><div className="apv">{acad.stream}</div></div>
            <div className="apcard"><div className="aph"><Icon name="answer" size={15} /> Focus subjects</div><div className="apchips">{acad.subjects.map((x) => <em key={x}>{x}</em>)}</div></div>
            <div className="apcard"><div className="aph"><Icon name="check" size={15} /> Exams to target</div><div className="apchips">{acad.exams.map((x) => <em key={x}>{x}</em>)}</div></div>
          </div>
          <div className="skills">
            <div className="subhd">Skills to start building now</div>
            <div className="skillrow">{acad.skills.map((sk) => <span className="skill" key={sk}>{sk}</span>)}</div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== WHERE YOU'LL THRIVE + ROLE MODELS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Where you’ll thrive" />
          <SecHead eyebrow="The environment that brings out your best" title="How and where you’ll do great work" />
          <div className="envbox">
            <div className="envfit"><span className="envic"><Icon name="match" size={22} /></span><div><div className="envt">{workEnv.fit}</div><p>{workEnv.blurb}</p></div></div>
            <div className="envtags">{workEnv.tags.map((t) => <em key={t}>{t}</em>)}</div>
          </div>
          <div className="models">
            <div className="subhd">People who started where you are</div>
            <div className="modelrow">
              {models.map((mm) => (
                <div className="model" key={mm.name}>
                  <div className="mav">{mm.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                  <div><div className="mn">{mm.name}</div><div className="mnote">{mm.note}</div></div>
                </div>
              ))}
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== FUTURE OUTLOOK ===== */}
      <section className="sheet rv">
        <SceneBand kind="future" eyebrow={`The next decade · ${N()}`} title="What’s rising, what’s fading" />
        <div className="pad">
          <SecHead eyebrow="Choose a direction that grows with the future" title="Stay future-proof"
            sub="A quick map of where the world of work is heading, so your choices age well." />
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

      {/* ===== 20-YEAR ROADMAP ===== */}
      <section className="sheet rv">
        <SceneBand kind="roadmap" eyebrow={`Your 20-year roadmap · ${N()}`} title="The path ahead" />
        <div className="pad">
          <SecHead eyebrow="From today to a career you’re built for" title="Phase by phase"
            sub={`A realistic timeline tuned to your profile and your best-fit domain, ${topDomain.name}.`} />
          <div style={{ marginBottom: "20px", padding: "12px 16px", background: "#f3f4f6", borderRadius: "8px", borderLeft: "4px solid var(--red)" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your path in</span>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#151a24", marginTop: "4px" }}>{topDomain.name}</div>
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
          <RF name={name} />
        </div>
      </section>

      {/* ===== ACTION PLAN ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Your action plan" />
          <SecHead eyebrow="Start small, start now" title="What to do next"
            sub="Momentum beats perfection. A focused checklist for the next 30 and 90 days." />
          <div className="act">
            <div className="acol n30"><div className="hd"><span className="p">30 days</span> Quick wins</div><ul>{plan.days30.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
            <div className="acol n90"><div className="hd"><span className="p">90 days</span> Build momentum</div><ul>{plan.days90.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== RESOURCES & SCHOLARSHIPS ===== */}
      <section className="sheet rv">
        <SceneBand kind="resources" eyebrow={`Resources & funding · ${N()}`} title="Take the next step" />
        <div className="pad">
          <SecHead eyebrow="Everything you need to move" title="Learn, find work & get funded"
            sub={`Hand-picked starting points relevant to ${topDomain.name} and your stage.`} />
          <div className="res">
            <div className="rgrp">
              <div className="rgh"><Icon name="cap" size={16} /> Learn these skills — free & paid</div>
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
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== EXTRA SHEETS (class 11-12 demo) ===== */}
      {extraSheets.map((sheet) => (
        <section key={sheet.id} className="sheet rv">
          <div className="pad">
            <RH n={N()} kick={sheet.kicker} />
            {sheet.node}
            <RF name={name} />
          </div>
        </section>
      ))}

      {/* ===== ALL JOB ROLES IN TOP 3 DOMAINS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Careers to explore" />
          <SecHead eyebrow="Job roles across your top 3 domains" title="All careers that fit you"
            sub="Explore the specific roles available in your top three recommended domains. Each role shows its fit score, salary range, and growth potential." />

          {domainList.map((domain, domainIndex) => {
            const domainRoles = roles.filter(r => r.domain === domain.name).slice(0, 8);
            return (
              <div key={domain.key} style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: C.ink, marginBottom: '20px', paddingBottom: '12px', borderBottom: `2px solid ${C.redLine}` }}>
                  0{domainIndex + 1}. {domain.name}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {domainRoles.map((role) => {
                    const fitBand = bandOf(role.fit);
                    return (
                      <div key={role.role} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#f9fafb', transition: 'all 200ms ease', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '700', color: C.ink, margin: 0, flex: 1 }}>{role.role}</h4>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: fitBand.tone === 'hi' ? '#1f7a55' : fitBand.tone === 'mid' ? '#d97706' : '#6b7280', background: fitBand.tone === 'hi' ? '#dcfce7' : fitBand.tone === 'mid' ? '#fef3c7' : '#f3f4f6', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                            {role.fit}% fit
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 10px 0' }}>{fitBand.label} match</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                          <div>
                            <div style={{ color: C.muted, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>India</div>
                            <div style={{ color: C.ink, fontWeight: '700', fontSize: '13px' }}>{role.salaryIndia || '—'}</div>
                          </div>
                          <div>
                            <div style={{ color: C.muted, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Abroad</div>
                            <div style={{ color: C.ink, fontWeight: '700', fontSize: '13px' }}>{role.salaryAbroad || '—'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '12px', color: C.muted }}>Showing {Math.min(8, domainRoles.length)} of {roles.filter(r => r.domain === domain.name).length} roles</span>
                </div>
              </div>
            );
          })}
          <RF name={name} />
        </div>
      </section>

      {/* ===== AVAILABLE ROLES IN RECOMMENDED DOMAIN ===== */}
      {topDomain && (
        <section className="sheet rv" style={{ display: 'none' }}>
          <div className="pad">
            <RH n={N()} kick={`Careers in ${topDomain.name}`} />
            <SecHead eyebrow="Specific job roles to explore" title={`All careers in ${topDomain.name}`}
              sub={`These are the specific job roles available in your recommended domain. Explore each role to understand responsibilities, required skills, salary expectations, and career growth paths.`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '24px' }}>
              {roles.filter(r => r.domain === topDomain.name).map((role, i) => (
                <div key={role.role} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '10px', background: '#f9fafb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{role.role}</h4>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff', background: '#7c3aed', padding: '4px 8px', borderRadius: '4px' }}>{role.fit}% fit</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0' }}>{role.domain}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#9ca3af' }}>Salary (India)</span><br />
                      <strong style={{ color: '#1f2937', fontSize: '13px' }}>{role.salaryIndia || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#9ca3af' }}>Salary (Abroad)</span><br />
                      <strong style={{ color: '#1f2937', fontSize: '13px' }}>{role.salaryAbroad || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <RF name={name} />
          </div>
        </section>
      )}

      {/* ===== FOR PARENTS + CLOSING ===== */}
      {/* ===== DOWNLOAD REPORT ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Download your report" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <DownloadButton format="pdf" name={name} />
            <DownloadButton format="html" name={name} />
          </div>
        </div>
      </section>

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
            <p>Your profile shows where you’ll thrive today — but you’re still growing. Revisit this report as you change, and share it with someone who’s guiding you.</p>
            {/* Was a print/download button. The PDF is emailed instead, so the
                inbox holds one canonical copy rather than stale printouts. */}
            <p className="closing-mail">A PDF copy of this report has been emailed to you — share that with a parent or mentor.</p>
          </div>
          {/* Says plainly what this is built from. A report that names a career
              invites more certainty than the method can carry, so the basis and
              its limits belong on the page rather than only in the footer. */}
          <p className="disclaimer">
            <b>How to read this report.</b> Everything here is derived from the answers you
            gave, interpreted through established frameworks — RIASEC career interests, the
            Big Five personality model, Gardner’s multiple intelligences, and emotional
            intelligence research — and matched against a library of careers. It reflects
            what you told us on one day, not a measure of your ability or a ceiling on it.
            Interests and strengths genuinely change through school, so treat this as a
            starting point for conversations with teachers, parents and counsellors, and
            revisit it as you grow.
          </p>
          <RF name={name} />
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- data ---------------------------------- */
const FRAMEWORKS = [
  { k: "personality", fr: "Big Five · OCEAN", ds: "Your natural traits, preferences and behaviour." },
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
};
const RIASEC_NAME: Record<string, string> = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" };

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
 * against the workbook's own profession tables), use those — they are the real
 * output of the career-vector matching. Otherwise fall back to representative
 * roles from the top domains, so older banks still render.
 */
function coherentRoles(a: AssessmentSummary, fits: DomainFit[]): ReportRole[] {
  // Priority 0 fix: always use `fits` as the canonical source, computed fresh from assessment data.
  // This ensures career recommendations are consistent with domainFit and top-domain logic elsewhere.
  // If a.matches existed from an older backend run, it may contradict the current fits —
  // prefer current data over stale precomputed matches.
  const out: ReportRole[] = [];
  // Sort by actual fit score descending to ensure top-recommended domains appear first
  fits.slice().sort((x, y) => y.fit - x.fit).slice(0, 3).forEach((d) => {
    (d.roles ?? []).slice(0, 2).forEach((role, ri) => {
      // Use actual domain fit score, slight variation per role to show diversity
      const roleFit = Math.max(25, Math.min(100, d.fit - ri * 2));
      out.push({ role, domain: d.name, fit: roleFit, why: d.why, salaryIndia: d.salaryIndia, salaryAbroad: d.salaryAbroad });
    });
  });
  return out.slice(0, 6);
}

/* ------------------------------ pieces --------------------------------- */
function RH({ n, kick, accent }: { n?: string; kick: string; accent?: boolean }) {
  return (
    <div className="rh">
      {!accent
        // eslint-disable-next-line @next/next/no-img-element
        ? <span className="brandmark"><img src={LOGO} alt="OneGrasp" /></span>
        : <span className="rh-dim">{n}</span>}
      <span className="ey"><span className="k" /> {kick}{n && !accent ? <em className="rh-n"> · {n}</em> : null}</span>
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
      <b>{value ?? (on ? "Yes" : "—")}</b>
    </span>
  );
}

/** Rose / polar wheel — petals sized by score. Used for the profile & the five traits. */
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

/** The classic RIASEC hexagon with the profile plotted inside. */
function RiasecHex({ themes }: { themes: { letter: string; title?: string; score: number }[] }) {
  const order = ["R", "I", "A", "S", "E", "C"];
  const cx = 150, cy = 150, R = 108;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  const outline = order.map((_, i) => pt(i, R)).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  const poly = order.map((L, i) => { const t = themes.find((x) => x.letter === L); return pt(i, (R * clamp(t?.score ?? 0)) / 100); });
  const polyD = poly.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label="RIASEC hexagon" style={{ width: "100%", maxWidth: 300, height: "auto", overflow: "visible" }}>
      {[0.33, 0.66, 1].map((f) => <path key={f} d={order.map((_, i) => pt(i, R * f)).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z"} fill="none" stroke={C.line} strokeWidth={1} />)}
      <path d={outline} fill="none" stroke={C.faint} strokeWidth={1.5} />
      <path d={polyD} fill="rgba(242,85,90,.14)" stroke={C.red} strokeWidth={2} strokeLinejoin="round" />
      {order.map((L, i) => { const [x, y] = pt(i, (R * clamp(themes.find((t) => t.letter === L)?.score ?? 0)) / 100); return <circle key={L} cx={x} cy={y} r={3.4} fill={C.red} />; })}
      {order.map((L, i) => {
        const [x, y] = pt(i, R + 20);
        return <text key={L} x={x.toFixed(1)} y={(y + 5).toFixed(1)} textAnchor="middle" fontSize="15" fontWeight="800" fill={C.ink}>{L}</text>;
      })}
    </svg>
  );
}

function DomainCard({ d, rank }: { d: DomainFit; rank: number }) {
  return (
    // Same rank colour as the Career DNA cards, so a domain that is 2nd in one
    // section is not green there and red here.
    <div className="dom" style={{ ["--rc" as string]: RANK_COLOURS[(rank - 1) % RANK_COLOURS.length] } as React.CSSProperties}>
      <div className="dom-hd">
        <span className="rk">{rank}</span>
        <div><div className="nm">{d.name}</div><div className="tl">{d.tagline}{d.why ? <span className="why"> · {d.why}</span> : null}</div></div>
        {d.fit ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div className="fit"><b>{d.fit}%</b><span>Fit</span></div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280' }}>
              {d.breakdown?.confidence === 4 ? '★★★★ Strong' : d.breakdown?.confidence === 3 ? '★★★ Good' : '★★ Moderate'}
            </div>
          </div>
        ) : null}
      </div>
      <div className="dom-bd">
        {d.breakdown && (
          <div className="dcell" style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', gridColumn: "1 / -1" }}>
            <div className="h" style={{ marginBottom: '8px' }}>What aligns with your profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
              <div><span style={{ color: '#6b7280' }}>Interest:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.interest}%</span></div>
              {d.breakdown.aptitude !== null && <div><span style={{ color: '#6b7280' }}>Aptitude:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.aptitude}%</span></div>}
              {d.breakdown.mi !== null && <div><span style={{ color: '#6b7280' }}>Intelligence:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.mi}%</span></div>}
              {d.breakdown.values !== null && <div><span style={{ color: '#6b7280' }}>Values:</span> <span style={{ fontWeight: '600', color: '#1f2937' }}>{d.breakdown.values}%</span></div>}
            </div>
          </div>
        )}
        <div className="dcell"><div className="h">What it is</div><p>{d.whatItIs}</p></div>
        <div className="dcell"><div className="h">How to join</div><p>{d.howToJoin.join(" · ")}</p></div>
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

function DownloadButton({ format, name }: { format: "pdf" | "html"; name?: string }) {
  const handleDownload = () => {
    const element = document.querySelector(".frx");
    if (!element) {
      alert("Report not found");
      return;
    }

    const filename = `${name || "Assessment-Report"}-${new Date().toISOString().split("T")[0]}`;

    if (format === "html") {
      const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title><style>body{font-family:system-ui,sans-serif;margin:20px}.frx{max-width:900px;margin:0 auto}</style></head><body>${element.outerHTML}</body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      const printWindow = window.open("", "", "height=600,width=800");
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title><style>@page{margin:10mm}body{font-family:system-ui,sans-serif}</style></head><body>${element.outerHTML}</body></html>`);
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); }, 250);
      }
    }
  };

  const icon = format === "pdf" ? "📄" : "📋";
  const label = format === "pdf" ? "Download as PDF" : "Download as HTML";
  const desc = format === "pdf" ? "Print to PDF" : "View in browser";

  return (
    <button onClick={handleDownload} style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#f9fafb", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937" }}>{label}</div>
      <div style={{ fontSize: "13px", color: "#6b7280" }}>{desc}</div>
    </button>
  );
}

function JourneyGraphic({ phases }: { phases: { period: string; title: string }[] }) {
  const n = Math.min(4, phases.length) || 4;
  const W = 760, H = 150, pad = 60;
  const xs = Array.from({ length: n }, (_, i) => pad + (i * (W - 2 * pad)) / (n - 1));
  const ys = (i: number) => (i % 2 === 0 ? 92 : 58);
  const d = xs.map((x, i) => { const y = ys(i); if (i === 0) return `M ${x} ${y}`; const px = xs[i - 1], py = ys(i - 1), mx = (px + x) / 2; return `C ${mx} ${py} ${mx} ${y} ${x} ${y}`; }).join(" ");
  return (
    <div className="journey">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Your career journey" style={{ width: "100%", height: "auto" }}>
        <path d={d} fill="none" stroke={C.redLine} strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
        {xs.map((x, i) => { const y = ys(i); return (
          <g key={i}>
            <circle cx={x} cy={y} r="18" fill="#fff" stroke={C.red} strokeWidth="2.5" />
            <text x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="800" fill={C.red}>{i + 1}</text>
            <text x={x} y={i % 2 === 0 ? y + 36 : y - 27} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={C.ink3}>{phases[i]?.period.split("·")[0].trim()}</text>
          </g>
        ); })}
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
  display:flex;flex-direction:column;gap:24px;letter-spacing:-.006em}
.frx *{box-sizing:border-box}
.frx .rv{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.frx .rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.frx .rv{opacity:1;transform:none;transition:none}}
.frx .vhide2{display:none}
@media(min-width:820px){.frx .vhide2{display:block}}

.frx .sheet{background:#fff;border:1px solid var(--line);border-top:3px solid var(--red);border-radius:16px;box-shadow:var(--shadow);overflow:hidden;position:relative}
.frx .pad{padding:40px 44px}
@media(max-width:720px){.frx .pad{padding:24px 18px}}
.frx h1,.frx h2,.frx h3{margin:0;letter-spacing:-.02em;color:var(--ink)}
.frx p{margin:0;color:var(--ink-2)}
.frx .eyebrow{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--red)}
.frx .ring-num{font-size:24px;font-weight:800;color:var(--ink);line-height:1}
.frx .ring-num small{font-size:14px;color:var(--muted);font-weight:700}
.frx .ring-den{font-size:10px;font-weight:700;color:var(--muted);margin-top:2px;text-transform:uppercase;letter-spacing:.05em}

.frx .rh{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:22px}
.frx .rh .brandmark img{height:30px;width:auto;display:block}
.frx .rh .rh-dim{font-size:26px;font-weight:800;color:var(--dc,var(--red))}
.frx .rh .ey{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:700;color:var(--ink-2)}
.frx .rh .ey .k{width:8px;height:8px;border-radius:50%;background:var(--red)}
.frx .rh .rh-n{font-style:normal;color:var(--faint);font-weight:800}
.frx .rf{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:26px;padding-top:14px;border-top:1px solid var(--line);font-size:11px;color:var(--muted)}
.frx .sechd{margin-bottom:20px}
.frx .sechd h2{font-size:24px;font-weight:800;margin-top:8px}
.frx .sechd p{font-size:14px;color:var(--ink-3);margin-top:8px;max-width:64ch;line-height:1.6}
.frx .subhd{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}

/* cover - NEW (with MBTI) */
.frx .cover-new{border-top:none;background:linear-gradient(135deg,#2f6bff 0%,#1a4d9e 50%,#12996b 100%);min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden}
.frx .cover-new::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;background:url(${LOGO}) center/contain no-repeat;opacity:0.08;z-index:1;pointer-events:none}

/* cover - OLD (without MBTI) */
.frx .cover-old{border-top:none;background:#fff;border:1px solid var(--line);border-top:3px solid var(--red)}

/* shared cover styles */
.frx .cover{border-top:none}
.frx .cover-new .cover-in{padding:80px 60px;color:#fff;position:relative;z-index:2}
.frx .cover-old .cover-in{padding:40px 44px 36px}
@media(max-width:720px){.frx .cover-new .cover-in{padding:50px 24px}.frx .cover-old .cover-in{padding:26px 18px}}
.frx .cover-top{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:30px}
.frx .cover-new .cover-top{justify-content:flex-start;margin-bottom:40px}
.frx .cover-logo{height:52px;width:auto}
.frx .cover-new .cover-logo{height:50px;filter:brightness(0) invert(1)}
.frx .cover .badge{font-size:11px;font-weight:700;color:var(--ink-2);background:#fff;border:1px solid var(--line);padding:7px 13px;border-radius:999px;box-shadow:var(--shadow-sm)}
.frx .cover-new .badge{color:rgba(255,255,255,.8);background:transparent;border:1px solid rgba(255,255,255,.3);box-shadow:none}
.frx .cover .kick{font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--red)}
.frx .cover-new .kick{color:#fff}
.frx .cover h1{color:var(--ink);font-size:clamp(28px,5vw,42px);line-height:1.06;font-weight:800;margin:12px 0 0;max-width:17ch}
.frx .cover-new h1{color:#fff;font-size:clamp(28px,5vw,52px)}
.frx .cover h1 span{color:var(--red)}
.frx .cover-new h1 span{color:#fff}
.frx .cover .lede{font-size:15px;line-height:1.6;margin-top:14px;max-width:52ch}
.frx .cover-new .lede{color:rgba(255,255,255,.95)}
.frx .cover-hero{margin:22px 0 4px}
.frx .cover-new .cover-hero{margin:22px 0 4px}
.frx .cover-preview{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 14px 40px rgba(20,20,25,.08);overflow:hidden}
.frx .cover-old .cover-preview{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 14px 40px rgba(20,20,25,.08)}
.frx .cp-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;background:${C.bg};border-bottom:1px solid var(--line)}
.frx .cp-kick{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.frx .cp-fit{font-size:12.5px;font-weight:700;color:var(--ink-2)}
.frx .cp-fit b{color:var(--red);font-weight:800;font-size:15px}
.frx .cp-body{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;padding:16px 20px 18px}
@media(max-width:560px){.frx .cp-body{grid-template-columns:1fr}}
.frx .cp-radar{display:flex;justify-content:center}
.frx .cp-radar svg{max-width:230px}
.frx .cp-arch-k{font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--red)}
.frx .cp-arch{font-size:19px;font-weight:800;color:var(--ink);margin:4px 0 14px;line-height:1.15}
.frx .cp-bars{display:flex;flex-direction:column;gap:9px}
.frx .cp-bar{display:grid;grid-template-columns:96px 1fr 24px;align-items:center;gap:9px}
.frx .cp-bar-l{font-size:11.5px;color:var(--ink-2);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.frx .cp-bar-t{height:7px;border-radius:999px;background:var(--line-2);overflow:hidden}
.frx .cp-bar-t i{display:block;height:100%;border-radius:999px;background:var(--red)}
.frx .cp-bar b{font-size:11.5px;font-weight:800;text-align:right}
.frx .dims8{margin:0 0 18px;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:${C.bg}}
.frx .dims8 img{width:100%;display:block}
.frx .cover-foot{margin-top:22px;padding-top:20px;border-top:1px solid var(--line);display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap}
.frx .cover-new .cover-foot{margin-top:40px;padding:20px;border-top:1px solid rgba(255,255,255,.2);border-left:4px solid #e08a1e;background:#fff;border-radius:8px}
.frx .cover-name{display:flex;flex-direction:column;gap:3px}
.frx .cover-name .rl{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.frx .cover-new .cover-name .rl{color:#999}
.frx .cover-name .nm{font-size:22px;font-weight:800;color:var(--ink)}
.frx .cover-new .cover-name .nm{font-size:26px;color:#1a1a1a}
.frx .cover-name .sub{font-size:13px;color:var(--ink-3)}
.frx .cover-new .cover-name .sub{color:#555}
.frx .cover-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.frx .cover-chips .c{font-size:12px;font-weight:600;color:var(--ink-2);background:#fff;border:1px solid var(--line);padding:8px 12px;border-radius:10px;box-shadow:var(--shadow-sm)}
.frx .cover-new .cover-chips .c{color:#666;background:#f8f8f8;border:1px solid #e0e0e0;box-shadow:none}
.frx .cover-chips .c b{color:var(--red);font-weight:800}
.frx .cover-new .cover-chips .c b{color:#e08a1e}

/* illustration band */
.frx .sband{display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:18px;padding:22px 44px;
  background:linear-gradient(120deg,#fff,${C.bg});border-bottom:1px solid var(--line)}
@media(max-width:720px){.frx .sband{grid-template-columns:1fr;padding:18px}.frx .sband-art{display:none}}
.frx .sband-eye{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--red)}
.frx .sband-title{color:var(--ink);font-size:clamp(22px,3.4vw,30px);font-weight:800;margin-top:6px}
.frx .sband-art{height:150px;display:flex;align-items:center;justify-content:flex-end}
.frx .sband-art img,.frx .sband-art svg{height:150px;width:100%;object-fit:contain}

/* contents */
.frx .toc{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:640px){.frx .toc{grid-template-columns:1fr}}
.frx .toc-row{display:flex;gap:12px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:13px 15px;background:#fff}
.frx .toc-ic{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;background:var(--red-tint);color:var(--red)}
.frx .toc-t{font-size:13.5px;font-weight:800}
.frx .toc-d{font-size:11.5px;color:var(--ink-3);margin-top:2px}

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

/* verdict table */
.frx .vtable{border:1px solid var(--line);border-radius:14px;overflow:hidden}
.frx .vhead,.frx .vrow{display:grid;grid-template-columns:1.3fr 1.4fr auto;gap:14px;align-items:center;padding:12px 16px}
@media(min-width:820px){.frx .vhead,.frx .vrow{grid-template-columns:1.1fr 1.3fr .5fr 1.4fr}}
.frx .vhead{background:${C.bg};font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .vrow{border-top:1px solid var(--line-2)}
.frx .vname{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--ink)}
.frx .vname svg{color:var(--red)}
.frx .vbar{display:flex;align-items:center;gap:10px}
.frx .vbar>div:first-child{flex:1}
.frx .vbar b{font-size:12.5px;font-weight:800;min-width:24px;text-align:right}
.frx .vpill{font-size:11px;font-weight:800;padding:4px 11px;border-radius:999px;white-space:nowrap;justify-self:start}
.frx .vpill.hi{background:var(--good-tint);color:#1f7a55}
.frx .vpill.mid{background:var(--red-tint);color:var(--red-strong)}
.frx .vpill.lo{background:var(--line-2);color:var(--ink-3)}
.frx .vmean{font-size:12px;color:var(--ink-3)}
/* Below the 4-column breakpoint the verdict wraps onto its own full-width line
   instead of being dropped — every dimension keeps its explanation on mobile. */
@media(max-width:819px){.frx .vmean{grid-column:1/-1;padding-left:23px;margin-top:-2px}}
.frx .vlegend{display:flex;flex-wrap:wrap;gap:14px;margin-top:14px;font-size:11.5px;color:var(--ink-3);align-items:center}
.frx .vlegend .d{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:6px;vertical-align:middle}
.frx .vlegend .d.hi{background:var(--good)}.frx .vlegend .d.mid{background:var(--red)}.frx .vlegend .d.lo{background:var(--faint)}
.frx .vlegend .tick{display:inline-block;width:2px;height:11px;background:var(--ink);opacity:.4;margin-right:6px;vertical-align:middle}
.frx .vlegend-bench{margin-left:auto}

.frx .dom-hd .why{color:var(--red);font-weight:700}

/* dimension pages */
.frx .dimhero{display:grid;grid-template-columns:1.15fr .85fr;gap:22px;align-items:center}
@media(max-width:720px){.frx .dimhero{grid-template-columns:1fr}}
.frx .dimhero-img{position:relative;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:${C.bg};box-shadow:var(--shadow-sm)}
.frx .dimhero-img img{width:100%;display:block}
.frx .dimhero-num{position:absolute;right:12px;top:8px;font-size:40px;font-weight:800;color:#fff;-webkit-text-stroke:1.5px var(--red-line);opacity:.9}
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

/* per-dimension category colour — each of the 8 pages reads in its own hue */
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
/* Five cards, each carrying a full sentence — the wheel takes the narrower
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
.frx .riasec-row{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}
@media(max-width:720px){.frx .riasec-row{grid-template-columns:1fr;gap:18px}}
.frx .riasec-bars{display:flex;flex-direction:column;gap:9px}
.frx .rb-row{display:grid;grid-template-columns:110px 1fr 28px;align-items:center;gap:10px}
.frx .rb-l{font-size:12.5px;color:var(--ink-2);font-weight:600}
.frx .rb-row.top .rb-l{color:var(--ink);font-weight:800}
.frx .rb-v{font-size:12.5px;font-weight:800;text-align:right}

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
.frx .ccard-verdict.mid{color:var(--red-strong)}
.frx .ccard-verdict.lo{color:var(--ink-3)}

/* domains */
.frx .dom{border:1px solid var(--line);border-radius:15px;overflow:hidden;background:#fff;margin-bottom:14px;box-shadow:var(--shadow-sm)}
.frx .dom-hd{display:flex;align-items:center;gap:14px;padding:16px 18px;background:${C.bg};border-bottom:1px solid var(--line)}
.frx .dom-hd .rk{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--rc,var(--red))}
.frx .dom-hd .nm{font-size:16px;font-weight:800}
.frx .dom-hd .tl{font-size:12px;color:var(--ink-3);margin-top:2px}
.frx .dom-hd .fit{margin-left:auto;text-align:right;flex:none}
.frx .dom-hd .fit b{font-size:21px;font-weight:800;color:var(--rc,var(--red))}
.frx .dom-hd .fit span{display:block;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.frx .dom-bd{display:grid;grid-template-columns:1fr 1fr}
@media(max-width:560px){.frx .dom-bd{grid-template-columns:1fr}}
.frx .dcell{padding:14px 18px;border-top:1px solid var(--line-2)}
.frx .dcell:nth-child(even){border-left:1px solid var(--line-2)}
@media(max-width:560px){.frx .dcell:nth-child(even){border-left:none}}
.frx .dcell .h{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.frx .dcell p{font-size:12.5px;line-height:1.55;color:var(--ink-2)}
.frx .sal{display:flex;gap:10px;flex-wrap:wrap}
.frx .sal .s{flex:1;min-width:150px;background:var(--line-2);border-radius:9px;padding:9px 11px}
.frx .sal .s .r{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.frx .sal .s .a{font-size:12.5px;font-weight:700;color:var(--ink);margin-top:2px}
.frx .dlinks{display:flex;flex-wrap:wrap;gap:7px}
.frx .dlinks a{font-size:11.5px;font-weight:700;color:var(--red);text-decoration:none;background:var(--red-tint);border:1px solid var(--red-line);padding:6px 11px;border-radius:8px}
.frx .dlinks a::after{content:" ↗";opacity:.6}

/* roadmap */
.frx .journey{border:1px solid var(--line);border-radius:14px;padding:14px 10px;background:${C.bg};margin-bottom:18px}
.frx .road{position:relative;padding-left:34px}
.frx .road::before{content:"";position:absolute;left:11px;top:6px;bottom:6px;width:2px;background:var(--red-line)}
.frx .rstep{position:relative;padding:0 0 22px}
.frx .rstep:last-child{padding-bottom:0}
.frx .rstep::before{content:"";position:absolute;left:-28px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid var(--red);box-shadow:0 0 0 4px #fff}
.frx .rstep .yr{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--red)}
.frx .rstep .ti{font-size:15px;font-weight:800;margin-top:3px}
.frx .rstep .tx{font-size:12.5px;line-height:1.55;color:var(--ink-2);margin-top:5px;max-width:62ch}
.frx .rstep .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.frx .rstep .tags em{font-style:normal;font-size:11px;font-weight:600;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:4px 10px;border-radius:999px}

/* action */
.frx .act{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:560px){.frx .act{grid-template-columns:1fr}}
.frx .acol{border:1px solid var(--line);border-radius:13px;padding:17px;background:#fff}
.frx .acol.n30{background:#fff;border-left:3px solid var(--red)}
.frx .acol.n90{background:#fff;border-left:3px solid var(--ink)}
.frx .acol .hd{font-size:13px;font-weight:800;display:flex;align-items:center;gap:9px;margin-bottom:12px}
.frx .acol .hd .p{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff;padding:3px 9px;border-radius:6px}
.frx .acol.n30 .p{background:var(--red)}.frx .acol.n90 .p{background:var(--ink)}
.frx .acol ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
.frx .acol li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .acol li::before{content:"";position:absolute;left:0;top:5px;width:13px;height:13px;border-radius:4px;border:2px solid var(--faint)}

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

/* thrive + models */
.frx .envbox{border:1px solid var(--line);border-radius:14px;padding:18px;background:${C.bg}}
.frx .envfit{display:flex;gap:14px;align-items:flex-start}
.frx .envic{width:44px;height:44px;border-radius:12px;flex:none;display:grid;place-items:center;background:var(--red-tint);color:var(--red)}
.frx .envt{font-size:16px;font-weight:800;margin-bottom:5px}
.frx .envfit p{font-size:13px;line-height:1.6;color:var(--ink-2)}
.frx .envtags{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}
.frx .envtags em{font-style:normal;font-size:12px;font-weight:700;color:var(--red);background:var(--red-tint);border:1px solid var(--red-line);padding:6px 12px;border-radius:999px}
.frx .models{margin-top:26px}
.frx .modelrow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .modelrow{grid-template-columns:1fr}}
.frx .model{display:flex;gap:13px;align-items:center;border:1px solid var(--line);border-radius:13px;padding:14px 16px;background:#fff}
.frx .mav{width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--red);font-size:15px}
.frx .mn{font-size:14.5px;font-weight:800}
.frx .mnote{font-size:12px;color:var(--ink-3);margin-top:2px;line-height:1.4}

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

/* Consistent A4 pages — every section prints as the same page size. */
@page{size:A4 portrait;margin:0}
@media print{
  /* Force every background, tint, bar-fill and colour to print (Chrome/Edge honour
     this even when "Background graphics" is unchecked). */
  .frx,.frx *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important}
  .frx{gap:0;display:block}
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
  .frx .twocard,.frx .dom,.frx .role,.frx .fw,.frx .dcard,.frx .ccard,.frx .apcard,
  .frx .model,.frx .scard,.frx .rstep,.frx .tcard,.frx .vrow{break-inside:avoid}
}
`;
