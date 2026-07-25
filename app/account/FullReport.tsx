"use client";

/**
 * FullReport — the in-depth, magazine-grade career report (2026, v3).
 *
 * ~30 sections, one coherent design system (white / near-black / grey with a
 * single light-red accent), blending the best of the reference reports:
 *   · branded 8-dimension cover image + real stock-photo section bands
 *   · at-a-glance verdict table (traffic-light)      [SACS]
 *   · profile wheel + temperament wheel (rose charts)[Clevry]
 *   · RIASEC hexagon, radar, donuts, vertical & horizontal bars
 *   · career metric-badge cards (Bright Outlook / Salary / Automation / Future)
 *                                                    [TUCareers / CareerNaksha]
 *   · benchmark-vs-peers panel with percentiles
 *
 * Data comes from the saved assessment; narrative from lib/report/knowledge.
 * Scroll-reveal on screen; each sheet paginates for print ("Save as PDF").
 */

import { useEffect, useRef } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import { C, Ring, RadarChart, SkillBar, dimColor, type RadarDatum } from "@/app/account/viz";
import { Scene } from "@/app/account/illustrations";
import {
  categoryDeepDive, roadmap, stageLabelOf,
  archetype, percentileOf, subTraits, actionPlan, type Domain,
  temperamentOf, resultOf, TEMPERAMENTS, domainFit, type DomainFit,
  FUTURE, LEARNING, JOB_PORTALS, SCHOLARSHIPS_2026,
  academicPath, workEnvironment, ROLE_MODELS, PARENT_TIPS,
} from "@/lib/report/knowledge";

/* ------------------------------- assets -------------------------------- */
const LOGO = "/onegrasp-logo-tight.png";
const P = "https://onegrasp.com/wp-content/uploads/2026/07/";
const DIMS8 = P + "ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";

type Meta = { label: string; dim: string; icon: string; img: string };
const CAT: Record<string, Meta> = {
  personality: { label: "Personality", dim: "01", icon: "personality", img: P + "personality.png" },
  career_interest: { label: "Career Interest", dim: "02", icon: "career_interest", img: P + "career-interest.png" },
  multiple_intelligence: { label: "Multiple Intelligence", dim: "03", icon: "multiple_intelligence", img: P + "Multiple-intelligence.png" },
  emotional_intelligence: { label: "Emotional Intelligence", dim: "04", icon: "emotional_intelligence", img: P + "Emotional-inteliigence.png" },
  learning_styles: { label: "Learning Styles", dim: "05", icon: "learning_styles", img: P + "Learning-stykes.png" },
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
  p >= 80 ? { label: "Standout", tone: "hi" } : p >= 65 ? { label: "Strength", tone: "hi" }
  : p >= 50 ? { label: "Solid", tone: "mid" } : p >= 35 ? { label: "Emerging", tone: "lo" }
  : { label: "Developing", tone: "lo" };

export default function FullReport({ a, name }: { a: AssessmentSummary; name?: string }) {
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

  const radar: RadarDatum[] = (a.radar ?? []).length
    ? CANON.map((k) => (a.radar!.find((r) => r.key === k) ?? { key: k, label: CAT[k].label, score: 0 }))
    : CANON.map((k) => ({ key: k, label: CAT[k].label, score: 0 }));

  // Coherent recommendations: blend interest + abilities + intelligences + values.
  const fits = domainFit(a);
  const domainList = fits.slice(0, 3);
  const topDomain = domainList[0];
  const phases = roadmap(stageLabelOf(a.journeyCode), topDomain.name);
  const arch = archetype(a);
  const plan = actionPlan(a, topDomain.name);
  // Overall fit now reflects the whole profile, not just the interest tally.
  const fit = Math.max(a.overallFitmentPct ?? 0, topDomain.fit);
  const roles = coherentRoles(fits);
  const temp = temperamentOf(a);
  const acad = academicPath(a, a.journeyCode);
  const workEnv = workEnvironment(a);
  const topLetter = (a.themes ?? [])[0]?.letter ?? "B";
  const models = ROLE_MODELS[topLetter] ?? ROLE_MODELS.B;
  const strongest = radar.slice().sort((x, y) => y.score - x.score)[0];
  const weakest = radar.slice().filter((r) => r.score > 0).sort((x, y) => x.score - y.score)[0];
  const themes = (a.themes ?? []).slice();
  const dateStr = (() => { try { return new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } })();
  const first = (name || "").trim().split(/\s+/)[0] || "you";

  let sheet = 0;
  const N = () => String(++sheet).padStart(2, "0");

  return (
    <div ref={root} className="frx">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ===== COVER ===== */}
      <section className="sheet cover rv">
        <div className="cover-in">
          <div className="cover-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cover-logo" src={LOGO} alt="OneGrasp" />
            <span className="badge">8 dimensions · scientifically structured</span>
          </div>
          <div className="kick">Career Fitment Report</div>
          <h1>Who you are, <span>and where it can take you.</span></h1>
          <p className="lede">A complete map of your strengths, interests and natural wiring — built from your responses across eight validated frameworks.</p>
          <div className="cover-hero">
            <div className="cover-preview">
              <div className="cp-head">
                <span className="cp-kick">Your profile · at a glance</span>
                <span className="cp-fit"><b>{fit}%</b> overall fit</span>
              </div>
              <div className="cp-body">
                <div className="cp-radar"><RadarChart data={radar} color={C.red} abbr={CATEGORY_ABBR} /></div>
                <div className="cp-side">
                  <div className="cp-arch-k">Career archetype</div>
                  <div className="cp-arch">{arch.name}</div>
                  <div className="cp-bars">
                    {radar.slice().sort((x, y) => y.score - x.score).slice(0, 4).map((d) => (
                      <div className="cp-bar" key={d.key}>
                        <span className="cp-bar-l">{CAT[d.key]?.label || d.label}</span>
                        <span className="cp-bar-t"><i style={{ width: `${clamp(d.score)}%` }} /></span>
                        <b>{Math.round(d.score)}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cover-foot">
            <div className="cover-name">
              <span className="rl">Prepared for</span>
              <span className="nm">{name || "You"}</span>
              {a.journeyName ? <span className="sub">{a.journeyName}</span> : null}
            </div>
            <div className="cover-chips">
              {dateStr ? <span className="c">{dateStr}</span> : null}
              <span className="c">Overall fit · <b>{fit}%</b></span>
            </div>
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
              ["Career DNA & profile", "Your archetype, radar and profile wheel", "radar"],
              ["At-a-glance verdict", "All eight dimensions, scored & rated", "check"],
              ["Benchmark vs peers", "How you compare to your stage", "score"],
              ["The eight dimensions", "A deep dive on each, one by one", "clusters"],
              ["Interests & personality", "RIASEC hexagon and temperament wheel", "career_interest"],
              ["Careers that fit you", "Roles, badges, salaries & match table", "briefcase"],
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
                <div className="ec"><span className="ec-k">Top interest</span><span className="ec-v">{themes[0]?.title || "—"}</span></div>
                <div className="ec"><span className="ec-k">Core driver</span><span className="ec-v">{a.topValues?.[0]?.tag || "—"}</span></div>
                <div className="ec"><span className="ec-k">Strongest area</span><span className="ec-v">{strongest ? CAT[strongest.key].label : "—"}</span></div>
                <div className="ec"><span className="ec-k">Learns best via</span><span className="ec-v">{a.learningStyles?.[0]?.name || "—"}</span></div>
              </div>
            </div>
            <div className="exec-r">
              <Ring value={fit} size={150} stroke={14} color={C.red}>
                <div className="ring-num" style={{ fontSize: 34 }}>{fit}<small>%</small></div>
                <div className="ring-den">overall fit</div>
              </Ring>
              <div className="exec-legend">
                <div><b style={{ color: C.good }}>Where you shine</b>{strongest ? ` ${CAT[strongest.key].label}` : ""}</div>
                <div><b style={{ color: C.muted }}>Room to grow</b>{weakest ? ` ${CAT[weakest.key].label}` : ""}</div>
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
              {domainList.slice(0, 3).map((d, i) => (
                <div className="dcard" key={d.key}>
                  <div className="rk">BEST-FIT DOMAIN 0{i + 1}</div>
                  <div className="nm">{d.name}</div>
                  <div className="ds">{d.tagline}</div>
                  <div className="mt"><span className="t"><i style={{ width: `${clamp(d.fit)}%` }} /></span><span className="v">{d.fit}</span></div>
                </div>
              ))}
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== METHOD ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="How this was measured" />
          <SecHead eyebrow="The science behind your report" title="Eight validated frameworks, one picture"
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
          <SecHead eyebrow="Every dimension, one verdict each" title="Your eight-dimension scorecard"
            sub="Scores are 0–100. The rating shows where each area sits; the note says what it means for you." />
          <div className="vtable">
            <div className="vhead"><span>Dimension</span><span>Score</span><span className="vhide">Rating</span><span className="vhide2">What it means</span></div>
            {radar.map((d) => {
              const b = bandOf(d.score);
              const res = resultOf(d.key, a);
              return (
                <div className="vrow" key={d.key}>
                  <span className="vname"><span style={{ color: dimColor(d.key), display: "inline-flex" }}><Icon name={CAT[d.key].icon} size={15} /></span> {CAT[d.key].label}</span>
                  <span className="vbar"><SkillBar value={d.score} color={dimColor(d.key)} benchmark={BENCH[d.key]} /><b>{Math.round(d.score)}</b></span>
                  <span className={`vpill ${b.tone}`}>{b.label}</span>
                  <span className="vmean vhide2">{res ? `${res.label}: ${res.value}` : (VERDICT[d.key] ?? "")}</span>
                </div>
              );
            })}
          </div>
          <div className="vlegend">
            <span><i className="d hi" /> Strength (65+)</span>
            <span><i className="d mid" /> Solid (50–64)</span>
            <span><i className="d lo" /> Developing (&lt;50)</span>
            <span className="vlegend-bench"><i className="tick" /> tick = typical student at your stage</span>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== PROFILE WHEEL ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Your profile wheel" />
          <SecHead eyebrow="The same eight dimensions, as a wheel" title="Where your energy concentrates"
            sub="Longer petals are stronger areas. The wheel makes the overall shape of your profile easy to see at a glance." />
          <div className="wheel-row">
            <RoseWheel items={radar.map((r) => ({ label: CAT[r.key].label.split(" ")[0], score: r.score, icon: CAT[r.key].icon, color: dimColor(r.key) }))} />
            <div className="wheel-side">
              {radar.slice().sort((x, y) => y.score - x.score).map((r, i) => (
                <div className="ws-row" key={r.key}>
                  <span className="ws-rk">{i + 1}</span>
                  <span className="ws-dot" style={{ background: dimColor(r.key) }} />
                  <span className="ws-nm">{CAT[r.key].label}</span>
                  <span className="ws-v">{Math.round(r.score)}</span>
                </div>
              ))}
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== DIMENSION DONUT DIALS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Dimension dials" />
          <SecHead eyebrow="Each dimension, scored" title="Your eight scores at a glance"
            sub="A quick, colour-coded read of every dimension and what it captures." />
          <div className="dials">
            {radar.map((d) => {
              const col = dimColor(d.key);
              return (
                <div className="dial" key={d.key}>
                  <Ring value={d.score} size={72} stroke={8} color={col} track={C.line}>
                    <div className="dial-n" style={{ color: col }}>{Math.round(d.score)}</div>
                  </Ring>
                  <div className="dial-body">
                    <div className="dial-t"><span className="dial-ic" style={{ color: col }}><Icon name={CAT[d.key].icon} size={15} /></span>{CAT[d.key].label}</div>
                    <div className="dial-d">{VERDICT[d.key]}</div>
                  </div>
                  <span className={`vpill ${bandOf(d.score).tone}`}>{bandOf(d.score).label}</span>
                </div>
              );
            })}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== BENCHMARK VS PEERS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Benchmark vs peers" />
          <SecHead eyebrow="How you compare to your stage" title="You, against a typical student"
            sub="Each dimension is compared with the average student at your level. Green means you're ahead; grey means room to grow." />
          <div className="bench">
            {radar.map((d) => {
              const bench = BENCH[d.key];
              const delta = Math.round(d.score - bench);
              const pct = percentileOf(d.score);
              return (
                <div className="brow2" key={d.key}>
                  <span className="bname"><Icon name={CAT[d.key].icon} size={14} /> {CAT[d.key].label}</span>
                  <div className="btrack">
                    <div className="bfill" style={{ width: `${clamp(d.score)}%` }} />
                    <div className="bmark" style={{ left: `${clamp(bench)}%` }} title={`Typical: ${bench}`} />
                  </div>
                  <span className="byou">{Math.round(d.score)}</span>
                  <span className={`bdelta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "+" : ""}{delta}</span>
                  <span className="bpct vhide">top {100 - pct}%</span>
                </div>
              );
            })}
          </div>
          <div className="bench-note"><Icon name="info" size={14} /> Percentiles are indicative, comparing your score to a broad sample of students at the same stage.</div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== THE 8 DIMENSIONS ===== */}
      {radar.map((d) => {
        const m = CAT[d.key];
        const col = dimColor(d.key);
        const dd = categoryDeepDive(d.key, a);
        const subs = subTraits(d.key, a);
        const pct = percentileOf(d.score);
        const res = resultOf(d.key, a);
        const bench = BENCH[d.key];
        const delta = Math.round(d.score - bench);
        return (
          <section className="sheet param rv" key={d.key} style={{ borderTopColor: col, ["--dc" as string]: col, ["--dc-tint" as string]: col + "14", ["--dc-line" as string]: col + "40" } as React.CSSProperties}>
            <div className="pad">
              <RH n={N()} kick={`Dimension ${m.dim} — ${m.label}`} accent />
              <div className="dimhero">
                <div className="dimhero-img" style={{ background: col + "12" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.label} loading="lazy" />
                  <span className="dimhero-num" style={{ WebkitTextStrokeColor: col }}>{m.dim}</span>
                </div>
                <div className="dimhero-meta">
                  <Ring value={d.score} size={96} stroke={10} color={col}>
                    <div className="ring-num">{d.score}</div><div className="ring-den">/100</div>
                  </Ring>
                  <div>
                    {res ? <div className="resultchip"><span>{res.label}</span><b>{res.value}</b></div> : null}
                    <div className="verdict">{VERDICT[d.key] ?? m.label}</div>
                    <div className="dimtags">
                      <span className={`vpill ${bandOf(d.score).tone}`}>{bandOf(d.score).label}</span>
                      {d.score > 0 ? <span className="tagpct">Higher than {pct}% of peers</span> : null}
                      <span className={`tagdelta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "+" : ""}{delta} vs typical</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="dimlede">{dd.meaning}</p>

              {d.key === "personality" ? (
                <div className="temps">
                  <div className="subhd">Your temperament — the four types, yours highlighted</div>
                  <div className="temp-wheel-row">
                    <RoseWheel small items={temp.scores.map((ts) => ({ label: TEMPERAMENTS[ts.key].name, score: ts.score }))}
                      accentIndex={temp.scores.findIndex((ts) => ts.key === temp.primary.key)} />
                    <div className="temp-grid">
                      {temp.scores.map((ts) => {
                        const T = TEMPERAMENTS[ts.key]; const on = ts.key === temp.primary.key;
                        return (
                          <div className={`tcard${on ? " on" : ""}`} key={ts.key}>
                            <div className="th"><span className={`tdot${on ? " on" : ""}`} /><span className="tn">{T.name}</span><span className="tsc">{ts.score}</span></div>
                            <div className="tt">{T.tagline}</div>
                            {on ? <div className="tw"><b>Your edge:</b> {T.strength}</div> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="cols">
                {subs.length ? (
                  <div>
                    <div className="subhd">Your breakdown</div>
                    <div className="bars">
                      {subs.map((sub) => (
                        <div className="brow" key={sub.label}>
                          <span className="lb">{sub.label}</span>
                          <span className="bk"><SkillBar value={sub.value} color={col} height={9} /></span>
                          <span className="vv">{Math.round(sub.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div />}
                <div className="prose">
                  <div className="subhd">What this means for you</div>
                  <p className="lead">{dd.strengths[0] || dd.meaning}</p>
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
      {themes.length > 0 && (
        <section className="sheet rv">
          <div className="pad">
            <RH n={N()} kick="Your interests" />
            <SecHead eyebrow="Holland's RIASEC model" title="What genuinely pulls you"
              sub="Interest is the single biggest driver of long-term satisfaction. Your top themes point to the fields to explore first." />
            <div className="riasec-row">
              <RiasecHex themes={themes} />
              <div className="riasec-bars">
                {["R", "I", "A", "S", "E", "C"].map((L) => {
                  const t = themes.find((x) => x.letter === L);
                  const sc = t ? Math.round(t.score) : 0;
                  const top = (a.riasecCode || themes.slice(0, 3).map((x) => x.letter).join("")).includes(L);
                  return (
                    <div className={`rb-row${top ? " top" : ""}`} key={L}>
                      <span className="rb-l">{RIASEC_NAME[L]}</span>
                      <span className="rb-track"><SkillBar value={sc} color={top ? C.red : C.faint} height={9} /></span>
                      <span className="rb-v">{sc}</span>
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

      {/* ===== CAREERS WHERE YOU FIT — metric badge cards ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Careers where you fit" />
          <SecHead eyebrow="Specific roles your whole profile points to" title="Your top career matches"
            sub="Ranked by fit, with the signals that matter: outlook, pay, automation-resistance and future demand." />
          <div className="cardgrid">
            {roles.map((r, i) => {
              const mt = roleMetric(r.role);
              return (
                <div className="ccard" key={r.role + i}>
                  <div className="ccard-top">
                    <span className="ccard-rk">{i + 1}</span>
                    <div className="ccard-main"><div className="ccard-nm">{r.role}</div><div className="ccard-dm">{r.domain}</div></div>
                    <div className="ccard-fit"><b>{r.fit}%</b><span>fit</span></div>
                  </div>
                  <div className="ccard-badges">
                    <Badge on={mt.brightOutlook} label="Bright Outlook" icon="star" />
                    <Badge label="Salary" value={mt.salary} icon="briefcase" tone={salaryTone(mt.salary)} />
                    <Badge label="Automation" value={mt.automation} icon="cpu" tone={mt.automation === "Low" ? "good" : mt.automation === "High" ? "warn" : "mid"} />
                    <Badge on={mt.future} label="Future-ready" icon="pulse" />
                  </div>
                  {r.salaryIndia ? (
                    <div className="ccard-sal"><span>India {r.salaryIndia}</span><span>Abroad {r.salaryAbroad}</span></div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== CAREER MATCH TABLE (Top Choice) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH n={N()} kick="Ranked career table" />
          <SecHead eyebrow="Everything, side by side" title="Your recommendations, ranked"
            sub="A quick table view of the same matches — sorted by fit, with a clear recommendation on each." />
          <div className="mtable">
            <div className="mhead"><span>#</span><span>Career</span><span className="vhide">Domain</span><span>Fit</span><span>Verdict</span></div>
            {roles.map((r, i) => {
              const v = r.fit >= 75 ? { t: "Top Choice", c: "hi" } : r.fit >= 60 ? { t: "Good Choice", c: "mid" } : { t: "Explore", c: "lo" };
              return (
                <div className="mrow" key={r.role + i}>
                  <span className="mrk">{i + 1}</span>
                  <span className="mnm">{r.role}</span>
                  <span className="mdm vhide">{r.domain}</span>
                  <span className="mfit"><span className="mfit-bar"><SkillBar value={r.fit} color={C.red} height={7} /></span><b>{r.fit}%</b></span>
                  <span className={`mbadge ${v.c}`}>{v.t}</span>
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

      {/* ===== FOR PARENTS + CLOSING ===== */}
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
            <button className="og-noprint b b1" onClick={() => window.print()}>Download / print this report</button>
          </div>
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
  learning_styles: "How you learn fastest.", motivators: "What keeps you going.",
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

/** Specific roles drawn from the coherent top domains (so careers correlate with
 *  the recommended fields), each carrying that domain's blended fit. */
function coherentRoles(fits: DomainFit[]) {
  const out: { role: string; domain: string; fit: number; why: string; salaryIndia: string; salaryAbroad: string }[] = [];
  fits.slice(0, 3).forEach((d) => {
    (d.roles ?? []).slice(0, 2).forEach((role, ri) => {
      out.push({ role, domain: d.name, fit: Math.max(45, Math.min(95, d.fit - ri * 3)), why: d.why, salaryIndia: d.salaryIndia, salaryAbroad: d.salaryAbroad });
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

/** Rose / polar wheel — petals sized by score. Used for the profile & temperament. */
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

function DomainCard({ d, rank }: { d: Domain & { fit: number; why?: string }; rank: number }) {
  return (
    <div className="dom">
      <div className="dom-hd">
        <span className="rk">{rank}</span>
        <div><div className="nm">{d.name}</div><div className="tl">{d.tagline}{d.why ? <span className="why"> · {d.why}</span> : null}</div></div>
        {d.fit ? <div className="fit"><b>{d.fit}%</b><span>Fit</span></div> : null}
      </div>
      <div className="dom-bd">
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
.frx .rh .rh-dim{font-size:22px;font-weight:800;color:var(--faint)}
.frx .rh .ey{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:700;color:var(--ink-2)}
.frx .rh .ey .k{width:8px;height:8px;border-radius:50%;background:var(--red)}
.frx .rh .rh-n{font-style:normal;color:var(--faint);font-weight:800}
.frx .rf{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:26px;padding-top:14px;border-top:1px solid var(--line);font-size:11px;color:var(--muted)}
.frx .sechd{margin-bottom:20px}
.frx .sechd h2{font-size:24px;font-weight:800;margin-top:8px}
.frx .sechd p{font-size:14px;color:var(--ink-3);margin-top:8px;max-width:64ch;line-height:1.6}
.frx .subhd{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}

/* cover */
.frx .cover{border-top:none}
.frx .cover::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--red),var(--red-strong))}
.frx .cover-in{padding:40px 44px 36px}
@media(max-width:720px){.frx .cover-in{padding:26px 18px}}
.frx .cover-top{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:30px}
.frx .cover-logo{height:52px;width:auto}
.frx .cover .badge{font-size:11px;font-weight:700;color:var(--ink-2);background:#fff;border:1px solid var(--line);padding:7px 13px;border-radius:999px;box-shadow:var(--shadow-sm)}
.frx .cover .kick{font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--red)}
.frx .cover h1{color:var(--ink);font-size:clamp(28px,5vw,42px);line-height:1.06;font-weight:800;margin:12px 0 0;max-width:17ch}
.frx .cover h1 span{color:var(--red)}
.frx .cover .lede{font-size:15px;line-height:1.6;margin-top:14px;max-width:52ch}
.frx .cover-hero{margin:22px 0 4px}
.frx .cover-preview{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 14px 40px rgba(20,20,25,.08);overflow:hidden}
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
.frx .cover-name{display:flex;flex-direction:column;gap:3px}
.frx .cover-name .rl{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.frx .cover-name .nm{font-size:22px;font-weight:800;color:var(--ink)}
.frx .cover-name .sub{font-size:13px;color:var(--ink-3)}
.frx .cover-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.frx .cover-chips .c{font-size:12px;font-weight:600;color:var(--ink-2);background:#fff;border:1px solid var(--line);padding:8px 12px;border-radius:10px;box-shadow:var(--shadow-sm)}
.frx .cover-chips .c b{color:var(--red);font-weight:800}

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
.frx .exec-legend{font-size:12px;color:var(--ink-2);display:flex;flex-direction:column;gap:6px;text-align:center}
.frx .exec-legend b{font-weight:800}

/* dna */
.frx .dna-hero{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}
@media(max-width:720px){.frx .dna-hero{grid-template-columns:1fr;gap:20px}}
.frx .radar-wrap{display:flex;justify-content:center}
.frx .band-v{display:flex;flex-direction:column;gap:10px}
.frx .dcard{border:1px solid var(--line);border-radius:12px;padding:14px 15px;background:#fff}
.frx .dcard .rk{font-size:10.5px;font-weight:800;color:var(--red);letter-spacing:.06em}
.frx .dcard .nm{font-size:15px;font-weight:800;margin-top:5px}
.frx .dcard .ds{font-size:12px;color:var(--ink-3);margin-top:4px;line-height:1.45}
.frx .dcard .mt{display:flex;align-items:center;gap:8px;margin-top:10px}
.frx .dcard .mt .t{flex:1;height:6px;border-radius:999px;background:var(--line);overflow:hidden}
.frx .dcard .mt .t i{display:block;height:100%;border-radius:999px;background:var(--red)}
.frx .dcard .mt .v{font-size:12px;font-weight:800;color:var(--red)}

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
.frx .vlegend{display:flex;flex-wrap:wrap;gap:14px;margin-top:14px;font-size:11.5px;color:var(--ink-3);align-items:center}
.frx .vlegend .d{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:6px;vertical-align:middle}
.frx .vlegend .d.hi{background:var(--good)}.frx .vlegend .d.mid{background:var(--red)}.frx .vlegend .d.lo{background:var(--faint)}
.frx .vlegend .tick{display:inline-block;width:2px;height:11px;background:var(--ink);opacity:.4;margin-right:6px;vertical-align:middle}
.frx .vlegend-bench{margin-left:auto}

/* wheel */
.frx .wheel-row{display:grid;grid-template-columns:1.1fr .9fr;gap:28px;align-items:center}
@media(max-width:720px){.frx .wheel-row{grid-template-columns:1fr;gap:18px}}
.frx .wheel-side{display:flex;flex-direction:column;gap:2px}
.frx .ws-row{display:grid;grid-template-columns:auto auto 1fr auto;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line-2)}
.frx .ws-rk{width:22px;height:22px;border-radius:6px;background:var(--line-2);color:var(--ink-2);font-size:11px;font-weight:800;display:grid;place-items:center}
.frx .ws-dot{width:12px;height:12px;border-radius:4px;flex:none}
.frx .ws-nm{font-size:13px;font-weight:600;color:var(--ink-2)}
.frx .ws-v{font-size:13.5px;font-weight:800;color:var(--ink)}

/* dimension donut dials */
.frx .dials{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .dials{grid-template-columns:1fr}}
.frx .dial{display:flex;align-items:center;gap:14px;border:1px solid var(--line);border-radius:14px;padding:12px 15px;background:#fff}
.frx .dial-n{font-size:17px;font-weight:800}
.frx .dial-body{flex:1;min-width:0}
.frx .dial-t{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:800}
.frx .dial-ic{display:inline-flex}
.frx .dial-d{font-size:11.5px;color:var(--ink-3);margin-top:2px}
.frx .dom-hd .why{color:var(--red);font-weight:700}

/* benchmark */
.frx .bench{display:flex;flex-direction:column;gap:12px}
.frx .brow2{display:grid;grid-template-columns:1.1fr 2fr auto auto;gap:12px;align-items:center}
@media(min-width:820px){.frx .brow2{grid-template-columns:1.1fr 2.4fr auto auto auto}}
.frx .bname{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:var(--ink-2)}
.frx .bname svg{color:var(--red)}
.frx .btrack{position:relative;height:12px;background:var(--line-2);border-radius:999px;overflow:hidden}
.frx .bfill{position:absolute;left:0;top:0;height:100%;background:var(--red);border-radius:999px}
.frx .bmark{position:absolute;top:-2px;bottom:-2px;width:2px;background:var(--ink);opacity:.55;border-radius:2px}
.frx .byou{font-size:13px;font-weight:800;min-width:24px;text-align:right}
.frx .bdelta{font-size:11.5px;font-weight:800;min-width:34px;text-align:right}
.frx .bdelta.up{color:var(--good)}.frx .bdelta.down{color:var(--muted)}
.frx .bpct{font-size:11px;color:var(--muted);min-width:52px;text-align:right}
.frx .bench-note{display:flex;align-items:center;gap:8px;margin-top:16px;font-size:11.5px;color:var(--ink-3);background:${C.bg};border:1px solid var(--line);border-radius:10px;padding:11px 14px}
.frx .bench-note svg{color:var(--red);flex:none}

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
.frx .prose .lead{font-size:14.5px;color:var(--ink)}
.frx .prose p{font-size:13.5px;line-height:1.65;color:var(--ink-2)}
.frx .prose p+p{margin-top:11px}
.frx .twocard{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:26px}
@media(max-width:560px){.frx .twocard{grid-template-columns:1fr}}
.frx .lc{border:1px solid var(--line);border-radius:13px;padding:17px 17px 15px;background:#fff}
.frx .lc.good{background:var(--red-tint);border-color:var(--red-line)}
.frx .lc.grow{background:${C.bg}}
.frx .lc h4{margin:0 0 11px;font-size:13px;font-weight:800;display:flex;align-items:center;gap:8px}
.frx .lc h4::before{content:"";width:8px;height:8px;border-radius:2px}
.frx .lc.good h4{color:var(--red-strong)}.frx .lc.good h4::before{background:var(--red)}
.frx .lc.grow h4{color:var(--ink-2)}.frx .lc.grow h4::before{background:var(--faint)}
.frx .lc ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px}
.frx .lc li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .lc li::before{position:absolute;left:0;top:0;font-weight:800}
.frx .lc.good li::before{content:"✓";color:var(--red)}.frx .lc.grow li::before{content:"→";color:var(--muted)}
.frx .recos{margin-top:26px}
.frx .recos ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;counter-reset:r}
.frx .recos li{counter-increment:r;position:relative;padding:14px 16px 14px 54px;border:1px solid var(--line);border-left:3px solid var(--red);border-radius:12px;background:#fff;font-size:13px;line-height:1.55;color:var(--ink-2)}
.frx .recos li::before{content:counter(r);position:absolute;left:14px;top:50%;transform:translateY(-50%);width:27px;height:27px;border-radius:8px;background:var(--red-tint);color:var(--red);display:grid;place-items:center;font-weight:800;font-size:13px}

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

/* temperament */
.frx .temps{margin-top:26px}
.frx .temp-wheel-row{display:grid;grid-template-columns:.8fr 1.2fr;gap:22px;align-items:center}
@media(max-width:640px){.frx .temp-wheel-row{grid-template-columns:1fr}}
.frx .temp-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
@media(max-width:440px){.frx .temp-grid{grid-template-columns:1fr}}
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

/* match table */
.frx .mtable{border:1px solid var(--line);border-radius:14px;overflow:hidden}
.frx .mhead,.frx .mrow{display:grid;grid-template-columns:26px 1fr 1.2fr auto;gap:12px;align-items:center;padding:11px 16px}
@media(max-width:820px){.frx .mhead,.frx .mrow{grid-template-columns:22px 1fr 1.1fr auto}}
.frx .mhead{background:${C.bg};font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .mrow{border-top:1px solid var(--line-2)}
.frx .mrk{font-size:12px;font-weight:800;color:var(--ink-3)}
.frx .mnm{font-size:13px;font-weight:700}
.frx .mdm{font-size:12px;color:var(--ink-3)}
.frx .mfit{display:flex;align-items:center;gap:10px}
.frx .mfit-bar{width:70px}
.frx .mfit b{font-size:12.5px;font-weight:800;color:var(--red)}
.frx .mbadge{font-size:10.5px;font-weight:800;padding:4px 11px;border-radius:999px;white-space:nowrap;justify-self:end}
.frx .mbadge.hi{background:var(--good-tint);color:#1f7a55}
.frx .mbadge.mid{background:var(--red-tint);color:var(--red-strong)}
.frx .mbadge.lo{background:var(--line-2);color:var(--ink-3)}

/* domains */
.frx .dom{border:1px solid var(--line);border-radius:15px;overflow:hidden;background:#fff;margin-bottom:14px;box-shadow:var(--shadow-sm)}
.frx .dom-hd{display:flex;align-items:center;gap:14px;padding:16px 18px;background:${C.bg};border-bottom:1px solid var(--line)}
.frx .dom-hd .rk{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--red)}
.frx .dom-hd .nm{font-size:16px;font-weight:800}
.frx .dom-hd .tl{font-size:12px;color:var(--ink-3);margin-top:2px}
.frx .dom-hd .fit{margin-left:auto;text-align:right;flex:none}
.frx .dom-hd .fit b{font-size:21px;font-weight:800;color:var(--red)}
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
  .frx .model,.frx .scard,.frx .rstep,.frx .tcard,.frx .dial,.frx .vrow,.frx .brow2{break-inside:avoid}
}
`;
