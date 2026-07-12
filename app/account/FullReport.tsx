"use client";

/**
 * FullReport — the in-depth career report, rebuilt to the approved 18-page
 * design: a bordered cover with the 8-Dimensions hero, a Career-DNA archetype
 * page with the profile radar, the eight dimensions each as their own themed
 * chapter (branded image, score ring, sub-trait bars, deep dive), best-fit
 * career domains (how to join, India/abroad salaries, scope, links), a 20-year
 * roadmap and an action plan + closing. Data comes straight from the saved
 * assessment; content from lib/report/knowledge. Scroll-reveal on screen and
 * print-friendly (browser "Save as PDF" produces the downloadable report).
 */

import { useEffect, useRef } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import {
  DOMAINS, categoryDeepDive, roadmap, stageLabelOf,
  archetype, percentileOf, subTraits, actionPlan, type Domain,
  temperamentOf, resultOf, careerRoles, TEMPERAMENTS,
  FUTURE, LEARNING, JOB_PORTALS, SCHOLARSHIPS_2026,
  academicPath, workEnvironment, ROLE_MODELS, PARENT_TIPS,
} from "@/lib/report/knowledge";

const P = "https://onegrasp.com/wp-content/uploads/2026/07/";
const LOGO = "/onegrasp-logo-tight.png"; // tightly-cropped local asset (no padding → reads large)
const DIMS8 = P + "ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";

type Meta = { label: string; dim: string; accent: string; img: string };
// Per-dimension accent + branded illustration (from the 8-Dimensions set).
const CAT: Record<string, Meta> = {
  personality: { label: "Personality", dim: "01", accent: "#2f6bed", img: P + "personality.png" },
  career_interest: { label: "Career Interest", dim: "02", accent: "#1fa97a", img: P + "career-interest.png" },
  multiple_intelligence: { label: "Multiple Intelligence", dim: "03", accent: "#f5a623", img: P + "Multiple-intelligence.png" },
  emotional_intelligence: { label: "Emotional Intelligence", dim: "04", accent: "#ec4f7a", img: P + "Emotional-inteliigence.png" },
  learning_styles: { label: "Learning Styles", dim: "05", accent: "#4560e0", img: P + "Learning-stykes.png" },
  motivators: { label: "Motivators", dim: "06", accent: "#f97316", img: P + "Motivators.png" },
  strengths: { label: "Strengths", dim: "07", accent: "#5b7cf0", img: P + "strenghts.png" },
  aptitude: { label: "Aptitude", dim: "08", accent: "#8b5cf6", img: P + "aptitude.png" },
};
const CANON = ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence", "learning_styles", "motivators", "strengths", "aptitude"];

const clamp = (n: number) => Math.max(3, Math.min(100, Math.round(n)));
const RC = 2 * Math.PI * 44; // score-ring circumference (r = 44)

export default function FullReport({ a, name }: { a: AssessmentSummary; name?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revs = root.current?.querySelectorAll(".rv");
    if (!revs) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
      );
      revs.forEach((e) => io.observe(e));
      // Failsafe: never leave a page hidden if the observer misses it.
      const t = window.setTimeout(() => revs.forEach((e) => e.classList.add("in")), 2200);
      return () => { io.disconnect(); window.clearTimeout(t); };
    }
    revs.forEach((e) => e.classList.add("in"));
  }, []);

  const radar = (a.radar ?? []).length ? a.radar! : CANON.map((k) => ({ key: k, label: CAT[k].label, score: 0 }));
  const dims = CANON.map((k) => radar.find((r) => r.key === k) ?? { key: k, label: CAT[k].label, score: 0 });

  // Best-fit domains (broad fields) from the interest clusters.
  const topDomains = (a.themes ?? [])
    .filter((t) => t.score > 0 && DOMAINS[t.letter])
    .slice(0, 3)
    .map((t) => ({ ...DOMAINS[t.letter], fit: Math.round(t.score) }));
  const domainList = topDomains.length ? topDomains : [{ ...DOMAINS.B, fit: a.overallFitmentPct ?? 0 }];
  const topDomain = domainList[0];
  const phases = roadmap(stageLabelOf(a.journeyCode), topDomain.name);
  const arch = archetype(a);
  const plan = actionPlan(a, topDomain.name);
  const dnaDomains = domainList.slice(0, 3);
  const fit = a.overallFitmentPct ?? Math.round(dims.reduce((s, d) => s + d.score, 0) / (dims.length || 1));
  const domAccents = ["#2f6bed", "#8b5cf6", "#1fa97a"];
  const roles = careerRoles(a);
  const temp = temperamentOf(a);
  const acad = academicPath(a, a.journeyCode);
  const workEnv = workEnvironment(a);
  const topLetter = (a.themes ?? []).filter((t) => t.score > 0 && DOMAINS[t.letter])[0]?.letter ?? "B";
  const models = ROLE_MODELS[topLetter] ?? ROLE_MODELS.B;

  const dateStr = (() => { try { return new Date(a.completedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }); } catch { return ""; } })();

  return (
    <div ref={root} className="frx">
      <style>{CSS}</style>

      {/* ===== 1 · COVER ===== */}
      <section className="sheet cover rv">
        <div className="cover-in">
          <div className="cover-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cover-logo" src={LOGO} alt="OneGrasp" />
            <span className="badge">◆ 8 dimensions · scientifically structured</span>
          </div>
          <div className="kick">Career Fitment Report</div>
          <h1>Who you are, <span>and where it can take you.</span></h1>
          <p className="lede">A complete map of your strengths, interests and natural wiring — built from your responses across eight validated frameworks.</p>
          <div className="cover-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DIMS8} alt="The eight dimensions of your profile" />
          </div>
          <div className="cover-foot">
            <div className="cover-name">
              <span className="rl">Prepared for</span>
              <span className="nm">{name || "You"}</span>
              {a.journeyName ? <span className="sub">{a.journeyName}</span> : null}
            </div>
            <div className="cover-chips">
              {dateStr ? <span className="c">📅 {dateStr}</span> : null}
              <span className="c">Overall fit · <b>{fit}%</b></span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2 · CAREER DNA ===== */}
      <section className="sheet dna rv">
        <div className="pad">
          <RH kick="Your Career DNA" />
          <div className="dna-hero">
            <div>
              <div className="dna-arch">Your archetype</div>
              <h2 className="arch">{arch.name}</h2>
              <p className="one">{a.summary || arch.tagline}</p>
              <div className="fitrow">
                <div className="fit-num">{fit}<small>%</small></div>
                <div className="fit-cap"><b>Overall career fitment</b>Confidence across all eight dimensions, weighted for your stage.</div>
              </div>
            </div>
            <div className="radar-wrap"><Radar data={dims} /></div>
          </div>
          {dnaDomains.length ? (
            <div className="band">
              {dnaDomains.map((d, i) => (
                <div className="dcard" key={d.key}>
                  <div className="rk">BEST-FIT DOMAIN 0{i + 1}</div>
                  <div className="nm">{d.name}</div>
                  <div className="ds">{d.tagline}</div>
                  <div className="mt"><span className="t"><i style={{ width: `${clamp(d.fit)}%` }} /></span><span className="v">{d.fit}</span></div>
                </div>
              ))}
            </div>
          ) : null}
          <RF name={name} />
        </div>
      </section>

      {/* ===== 3 · METHOD ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="How this was measured" />
          <SecHead eyebrow="The science behind your report" title="Eight validated frameworks, one complete picture"
            sub="Your responses were scored against eight independent, research-backed models. No single test defines you — the combination is what makes this accurate." />
          <div className="fw-grid">
            {FRAMEWORKS.map((f, i) => (
              <div className="fw" key={f.k}>
                <span className="ic" style={{ background: CAT[f.k].accent }}>{i + 1}</span>
                <div><div className="nm">{CAT[f.k].label}</div><div className="fr">{f.fr}</div><div className="ds">{f.ds}</div></div>
              </div>
            ))}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== 4–11 · THE 8 DIMENSIONS ===== */}
      {dims.map((d) => {
        const m = CAT[d.key]; if (!m) return null;
        const dd = categoryDeepDive(d.key, a);
        const subs = subTraits(d.key, a);
        const pct = percentileOf(d.score);
        const res = resultOf(d.key, a);
        const off = (RC * (1 - clamp(d.score) / 100)).toFixed(1);
        const soft = m.accent + "14", line = m.accent + "33";
        return (
          <section className="sheet param rv" key={d.key}
            style={{ ["--accent" as string]: m.accent, ["--soft" as string]: soft, ["--line2" as string]: line }}>
            <div className="pad">
              <RH kick={`Dimension ${m.dim} — ${m.label}`} accent />
              <div className="hero-fig">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.label} loading="lazy" />
              </div>
              <div className="scorebar">
                <svg className="ring" width="104" height="104" viewBox="0 0 104 104" aria-label={`Score ${d.score} of 100`}>
                  <circle cx="52" cy="52" r="44" fill="none" stroke="#eef0f5" strokeWidth="11" />
                  <circle className="ring-fg" cx="52" cy="52" r="44" fill="none" stroke={m.accent} strokeWidth="11"
                    strokeLinecap="round" strokeDasharray={RC.toFixed(1)}
                    style={{ ["--off" as string]: off } as React.CSSProperties}
                    transform="rotate(-90 52 52)" />
                  <text x="52" y="49" textAnchor="middle" fontSize="27" fontWeight="800" fill="#151c30">{d.score}</text>
                  <text x="52" y="66" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#8a92a6">/ 100</text>
                </svg>
                <div className="score-meta">
                  {res ? <div className="resultchip"><span>{res.label}</span><b>{res.value}</b></div> : null}
                  <div className="verdict">{VERDICT[d.key] ?? m.label}</div>
                  <p>{dd.meaning}</p>
                  {d.score > 0 ? <span className="pct">Higher than {pct}% of students at your stage</span> : null}
                </div>
              </div>

              {d.key === "personality" ? (
                <div className="temps">
                  <div className="subhd">The four temperaments — yours is highlighted</div>
                  <div className="temp-grid">
                    {temp.scores.map((ts) => {
                      const T = TEMPERAMENTS[ts.key]; const on = ts.key === temp.primary.key;
                      return (
                        <div className={`tcard${on ? " on" : ""}`} key={ts.key}>
                          <div className="th"><span className="te">{T.emoji}</span><span className="tn">{T.name}</span><span className="tsc">{ts.score}</span></div>
                          <div className="tt">{T.tagline}</div>
                          <div className="ttr">{T.traits.map((x) => <em key={x}>{x}</em>)}</div>
                          {on ? <div className="tw"><b>Your edge:</b> {T.strength}</div> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div className="cols">
                {subs.length ? (
                  <div>
                    <div className="subhd">Your breakdown</div>
                    <div className="bars">
                      {subs.map((s) => (
                        <div className="brow" key={s.label}>
                          <span className="lb">{s.label}</span>
                          <span className="tk"><i style={{ ["--w" as string]: `${clamp(s.value)}%` } as React.CSSProperties} /></span>
                          <span className="vv">{Math.round(s.value)}</span>
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
                  <h4>◆ Where you’re strong</h4>
                  <ul>{dd.strengths.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
                <div className="lc grow">
                  <h4>◆ Where you can grow</h4>
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

      {/* ===== 13 · BEST-FIT DOMAINS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Best-fit career domains" />
          <SecHead eyebrow="Where your profile fits — fields, not job titles" title="Domains worth exploring first"
            sub="Broad fields your wiring is suited to, each with a real path into it from where you are now — in India and abroad." />
          {domainList.map((d, i) => (
            <DomainCard key={d.key} d={d} rank={i + 1} accent={domAccents[i % domAccents.length]} />
          ))}
          <RF name={name} />
        </div>
      </section>

      {/* ===== 14 · CAREERS WHERE YOU FIT (concrete roles + salary compare) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Careers where you fit" />
          <SecHead eyebrow="Specific roles your whole profile points to" title="Jobs that match you — and what they pay"
            sub="These roles blend your interests, intelligences and drivers. The pay compares a typical India salary with the same role abroad." />
          <div className="rolelist">
            {roles.map((r, i) => (
              <div className="role" key={r.role + i}>
                <div className="role-top">
                  <span className="role-rk">{i + 1}</span>
                  <div className="role-main"><div className="role-nm">{r.role}</div><div className="role-dm">{r.domain} · {r.why}</div></div>
                  <div className="role-fit"><b>{r.fit}%</b><span>fit</span></div>
                </div>
                <div className="role-sal">
                  <div className="rs"><span className="fl fl-in">🇮🇳 India</span> {r.salaryIndia}</div>
                  <div className="rs"><span className="fl fl-ab">🌍 Abroad</span> {r.salaryAbroad}</div>
                </div>
              </div>
            ))}
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== ACADEMIC PATH (stream · subjects · exams · skills) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Your academic path" />
          <SecHead eyebrow="How to get there from where you are" title="Stream, subjects & exams to aim for"
            sub={acad.note} />
          <div className="apath">
            <div className="apcard stream"><div className="aph">📚 Recommended stream</div><div className="apv">{acad.stream}</div></div>
            <div className="apcard"><div className="aph">✏️ Focus subjects</div><div className="apchips">{acad.subjects.map((x) => <em key={x}>{x}</em>)}</div></div>
            <div className="apcard"><div className="aph">📝 Exams to target</div><div className="apchips">{acad.exams.map((x) => <em key={x}>{x}</em>)}</div></div>
          </div>
          <div className="skills">
            <div className="subhd">Skills to start building now</div>
            <div className="skillrow">{acad.skills.map((s) => <span className="skill" key={s}>{s}</span>)}</div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== WHERE YOU'LL THRIVE + ROLE MODELS ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Where you’ll thrive" />
          <SecHead eyebrow="The environment that brings out your best" title="How and where you’ll do great work" />
          <div className="envbox">
            <div className="envfit"><span className="envic">🎯</span><div><div className="envt">{workEnv.fit}</div><p>{workEnv.blurb}</p></div></div>
            <div className="envtags">{workEnv.tags.map((t) => <em key={t}>{t}</em>)}</div>
          </div>
          <div className="models">
            <div className="subhd">People who started where you are</div>
            <div className="modelrow">
              {models.map((m) => (
                <div className="model" key={m.name}>
                  <div className="mav">{m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                  <div><div className="mn">{m.name}</div><div className="mnote">{m.note}</div></div>
                </div>
              ))}
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== FUTURE OUTLOOK (rising trends + jobs at risk) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="The next decade" />
          <SecHead eyebrow="Choose a direction that grows with the future" title="What’s rising — and what’s fading"
            sub="A quick map of where the world of work is heading, so your choices stay future-proof." />
          <div className="future">
            <div className="fcol rise">
              <div className="fh"><span className="fi">📈</span> Rising & future-proof</div>
              <div className="fgrid">
                {FUTURE.rising.map((x) => (
                  <div className="fitem" key={x.t}><div className="ft">{x.t}</div><div className="fd">{x.d}</div></div>
                ))}
              </div>
            </div>
            <div className="fcol fall">
              <div className="fh"><span className="fi">📉</span> Fading or automating</div>
              <ul className="flist">{FUTURE.declining.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="fnote">{FUTURE.note}</div>
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== RESOURCES & OPPORTUNITIES (learn · jobs · scholarships) ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Resources & opportunities" />
          <SecHead eyebrow="Everything you need to take the next step" title="Where to learn, find work & get funded"
            sub={`Hand-picked starting points relevant to ${topDomain.name} and your stage.`} />
          <div className="res">
            <div className="rgrp">
              <div className="rgh"><span className="ri">🎓</span> Learn these skills — free & paid</div>
              <div className="rchips">{LEARNING.map((l) => <a className="rchip" key={l.url} href={l.url} target="_blank" rel="noreferrer"><b>{l.label}</b><span>{l.note}</span></a>)}</div>
            </div>
            <div className="rgrp">
              <div className="rgh"><span className="ri">💼</span> Where to find jobs & internships</div>
              <div className="portals">
                {JOB_PORTALS.map((p) => (
                  <div className="pcol" key={p.region}>
                    <div className="pr">{p.region}</div>
                    <div className="plist">{p.sites.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label}</a>)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rgrp">
              <div className="rgh"><span className="ri">🏆</span> Scholarships to apply for (2026)</div>
              <div className="schol">
                {SCHOLARSHIPS_2026.map((s) => (
                  <a className="scard" key={s.name} href={s.url} target="_blank" rel="noreferrer">
                    <div className="sn">{s.name}</div><div className="sw">{s.who}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <RF name={name} />
        </div>
      </section>

      {/* ===== 15 · ROADMAP ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Your 20-year roadmap" />
          <SecHead eyebrow="From today to a career you’re built for" title="The path ahead, phase by phase"
            sub={`A realistic timeline tuned to your profile and your best-fit domain, ${topDomain.name}.`} />
          <JourneyGraphic phases={phases} />
          <div className="road">
            {phases.map((p, i) => (
              <div className="rstep" key={p.period} style={{ ["--rc" as string]: ["#2f6bed", "#4560e0", "#5b7cf0", "#8b5cf6"][i % 4] } as React.CSSProperties}>
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

      {/* ===== 16 + 18 · ACTION PLAN & CLOSING ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Your action plan" />
          <SecHead eyebrow="Start small, start now" title="What to do next"
            sub="Momentum beats perfection. Here’s a focused checklist for the next 30 and 90 days." />
          <div className="act">
            <div className="acol n30">
              <div className="hd"><span className="p">30 days</span> Quick wins</div>
              <ul>{plan.days30.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div className="acol n90">
              <div className="hd"><span className="p">90 days</span> Build momentum</div>
              <ul>{plan.days90.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
          </div>

          <div className="parents">
            <div className="ph"><span className="pic">👪</span> For parents &amp; mentors</div>
            <p className="pintro">The best way to support {name ? name.split(" ")[0] : "your child"} is to guide, not decide. A few things that help:</p>
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

/* ------------------------------- pieces -------------------------------- */
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
  personality: "How you’re naturally wired.",
  career_interest: "What genuinely pulls you.",
  multiple_intelligence: "How your mind works best.",
  emotional_intelligence: "How you read and manage emotion.",
  learning_styles: "How you learn fastest.",
  motivators: "What keeps you going.",
  strengths: "Your repeatable talents.",
  aptitude: "How quickly you pick things up.",
};

function RH({ kick, accent }: { kick: string; accent?: boolean }) {
  return (
    <div className="rh">
      {!accent
        // eslint-disable-next-line @next/next/no-img-element
        ? <span className="brandmark"><img src={LOGO} alt="OneGrasp" /></span>
        : <span />}
      <span className="ey"><span className="k" /> {kick}</span>
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

function DomainCard({ d, rank, accent }: { d: Domain & { fit: number }; rank: number; accent: string }) {
  const soft = accent + "14", line = accent + "33";
  return (
    <div className="dom" style={{ ["--accent" as string]: accent, ["--soft" as string]: soft, ["--line2" as string]: line }}>
      <div className="dom-hd">
        <span className="rk">{rank}</span>
        <div><div className="nm">{d.name}</div><div className="tl">{d.tagline}</div></div>
        {d.fit ? <div className="fit"><b>{d.fit}%</b><span>Fit</span></div> : null}
      </div>
      <div className="dom-bd">
        <div className="dcell"><div className="h">◆ What it is</div><p>{d.whatItIs}</p></div>
        <div className="dcell"><div className="h">◆ How to join</div><p>{d.howToJoin.join(" · ")}</p></div>
        <div className="dcell" style={{ gridColumn: "1 / -1" }}>
          <div className="h">◆ Typical earnings</div>
          <div className="sal">
            <div className="s"><div className="r">India</div><div className="a">{d.salaryIndia}</div></div>
            <div className="s"><div className="r">Abroad</div><div className="a">{d.salaryAbroad}</div></div>
          </div>
        </div>
        <div className="dcell"><div className="h">◆ Future scope</div><p>{d.futureScope}</p></div>
        <div className="dcell"><div className="h">◆ Explore</div>
          <div className="dlinks">{d.links.slice(0, 3).map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>)}</div>
        </div>
      </div>
    </div>
  );
}

/** A conceptual "career journey" graphic — a winding path with milestone stops. */
function JourneyGraphic({ phases }: { phases: { period: string; title: string }[] }) {
  const cols = ["#2f6bed", "#4560e0", "#5b7cf0", "#8b5cf6"];
  const icons = ["🌱", "🚀", "⭐", "🏔"];
  const n = Math.min(4, phases.length) || 4;
  const W = 760, H = 150, pad = 60;
  const xs = Array.from({ length: n }, (_, i) => pad + (i * (W - 2 * pad)) / (n - 1));
  const ys = (i: number) => (i % 2 === 0 ? 92 : 58);
  const d = xs.map((x, i) => {
    const y = ys(i);
    if (i === 0) return `M ${x} ${y}`;
    const px = xs[i - 1], py = ys(i - 1), mx = (px + x) / 2;
    return `C ${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }).join(" ");
  return (
    <div className="journey">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Your career journey" style={{ width: "100%", height: "auto" }}>
        <defs><linearGradient id="jpath" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2f6bed" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
        <path d={d} fill="none" stroke="url(#jpath)" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
        {xs.map((x, i) => {
          const y = ys(i);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="17" fill="#fff" stroke={cols[i % 4]} strokeWidth="3" />
              <text x={x} y={y + 6} textAnchor="middle" fontSize="16">{icons[i % 4]}</text>
              <text x={x} y={i % 2 === 0 ? y + 34 : y - 26} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={cols[i % 4]}>{phases[i]?.period.split("·")[0].trim()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Single-series radar across the eight dimensions (CVD-safe by construction). */
function Radar({ data }: { data: { key: string; label: string; score: number }[] }) {
  const cx = 170, cy = 158, R = 118, n = data.length || 8;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, r: number) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  const ring = (f: number) => data.map((_, i) => pt(i, R * f)).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  const poly = data.map((d, i) => pt(i, R * clamp(d.score) / 100));
  const polyD = poly.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
  return (
    <svg viewBox="0 0 340 320" role="img" aria-label="Your profile across eight dimensions" style={{ width: "100%", maxWidth: 360, height: "auto", overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((f) => <path key={f} d={ring(f)} fill="none" stroke="#e9ecf3" strokeWidth={1} />)}
      {data.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#eceef4" strokeWidth={1} />; })}
      {data.map((d, i) => {
        const [x, y] = pt(i, R + 18);
        const anchor = Math.abs(x - cx) < 12 ? "middle" : x > cx ? "start" : "end";
        return <text key={d.key} x={x.toFixed(1)} y={(y + 3).toFixed(1)} textAnchor={anchor} fontSize="9.5" fontWeight="700" fill="#8a92a6">{CAT[d.key]?.label.split(" ")[0] ?? d.label}</text>;
      })}
      <path d={polyD} fill="rgba(47,107,237,.16)" stroke="#2f6bed" strokeWidth={2} strokeLinejoin="round" />
      {poly.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={3.4} fill="#2f6bed" />)}
    </svg>
  );
}

/* -------------------------------- styles ------------------------------- */
const CSS = `
.frx{font-family:'Poppins',Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#151c30;
  --paper:#fff;--ink:#151c30;--ink-2:#39415a;--ink-3:#5a6377;--muted:#8a92a6;--line:#e8ebf2;--line-2:#f1f3f8;
  --brand:#212e57;--brand-2:#2f6bed;--good:#1f9d6b;--grow:#e07b39;
  --dims-grad:linear-gradient(90deg,#2f6bed,#1fa97a,#f5a623,#ec4f7a,#4560e0,#f97316,#5b7cf0,#8b5cf6);
  --shadow:0 14px 40px rgba(18,25,45,.10),0 3px 10px rgba(18,25,45,.05);--shadow-sm:0 2px 10px rgba(18,25,45,.06);
  display:flex;flex-direction:column;gap:24px;letter-spacing:-.006em}
.frx *{box-sizing:border-box}
.frx .rv{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.frx .rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.frx .rv{opacity:1;transform:none;transition:none}}

.frx .sheet{background:var(--paper);border:1px solid var(--line);border-top:3px solid var(--accent,var(--brand-2));
  border-radius:14px;box-shadow:var(--shadow);overflow:hidden;position:relative}
.frx .pad{padding:40px 44px}
@media(max-width:720px){.frx .pad{padding:24px 18px}}
.frx h1,.frx h2,.frx h3{margin:0;letter-spacing:-.02em;color:var(--ink)}
.frx p{margin:0;color:var(--ink-2)}
.frx .eyebrow{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent,var(--brand-2))}

.frx .rh{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:22px}
.frx .rh .brandmark img{height:34px;width:auto;display:block}
.frx .rh .ey{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:700;color:var(--ink-2)}
.frx .rh .ey .k{width:8px;height:8px;border-radius:50%;background:var(--accent,var(--brand-2))}
.frx .rf{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:26px;padding-top:14px;
  border-top:1px solid var(--line);font-size:11px;color:var(--muted)}
.frx .sechd{margin-bottom:20px}
.frx .sechd h2{font-size:24px;font-weight:800;margin-top:8px}
.frx .sechd p{font-size:14px;color:var(--ink-3);margin-top:8px;max-width:62ch;line-height:1.6}

/* cover */
.frx .cover{border-top:none;background:linear-gradient(180deg,#fbfcff,#eef1fb)}
.frx .cover::before{content:"";position:absolute;top:0;left:0;right:0;height:5px;background:var(--dims-grad)}
.frx .cover-in{padding:40px 44px 36px}
@media(max-width:720px){.frx .cover-in{padding:26px 18px}}
.frx .cover-top{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:30px}
.frx .cover-logo{height:58px;width:auto}
.frx .cover .badge{font-size:11px;font-weight:700;color:var(--brand);background:#fff;border:1px solid var(--line);
  padding:7px 13px;border-radius:999px;box-shadow:var(--shadow-sm)}
.frx .cover .kick{font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--brand-2)}
.frx .cover h1{color:var(--brand);font-size:clamp(28px,5vw,42px);line-height:1.06;font-weight:800;margin:12px 0 0;max-width:17ch}
.frx .cover h1 span{background:linear-gradient(90deg,#2f6bed,#8b5cf6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.frx .cover .lede{font-size:15px;line-height:1.6;margin-top:14px;max-width:52ch}
.frx .cover-hero{margin:26px 0 4px;background:#fff;border:1px solid var(--line);border-radius:15px;padding:12px;box-shadow:0 14px 40px rgba(30,42,90,.10)}
.frx .cover-hero img{width:100%;display:block;border-radius:8px}
.frx .cover-foot{margin-top:22px;padding-top:20px;border-top:1px solid var(--line);display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap}
.frx .cover-name{display:flex;flex-direction:column;gap:3px}
.frx .cover-name .rl{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.frx .cover-name .nm{font-size:22px;font-weight:800;color:var(--ink)}
.frx .cover-name .sub{font-size:13px;color:var(--ink-3)}
.frx .cover-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.frx .cover-chips .c{font-size:12px;font-weight:600;color:var(--ink-2);background:#fff;border:1px solid var(--line);padding:8px 12px;border-radius:10px;box-shadow:var(--shadow-sm)}
.frx .cover-chips .c b{color:var(--brand);font-weight:800}

/* career DNA */
.frx .dna-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:28px;align-items:center}
@media(max-width:720px){.frx .dna-hero{grid-template-columns:1fr;gap:20px}}
.frx .dna-arch{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--brand-2)}
.frx h2.arch{font-size:clamp(28px,4.4vw,42px);line-height:1.05;font-weight:800;margin:10px 0 0}
.frx .one{font-size:15px;line-height:1.62;color:var(--ink-2);margin-top:14px;max-width:44ch}
.frx .fitrow{display:flex;align-items:center;gap:20px;margin-top:22px}
.frx .fit-num{font-size:48px;font-weight:800;line-height:1;color:var(--brand)}
.frx .fit-num small{font-size:20px;color:var(--muted);font-weight:700}
.frx .fit-cap{font-size:12.5px;color:var(--ink-3);line-height:1.45}
.frx .fit-cap b{color:var(--ink);font-weight:800;display:block;font-size:13.5px;margin-bottom:2px}
.frx .radar-wrap{display:flex;justify-content:center}
.frx .band{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:30px}
@media(max-width:560px){.frx .band{grid-template-columns:1fr}}
.frx .dcard{border:1px solid var(--line);border-radius:12px;padding:15px;background:linear-gradient(180deg,#fff,#fcfdff)}
.frx .dcard .rk{font-size:10.5px;font-weight:800;color:var(--brand-2);letter-spacing:.06em}
.frx .dcard .nm{font-size:15px;font-weight:800;margin-top:6px}
.frx .dcard .ds{font-size:12px;color:var(--ink-3);margin-top:4px;line-height:1.45}
.frx .dcard .mt{display:flex;align-items:center;gap:8px;margin-top:11px}
.frx .dcard .mt .t{flex:1;height:6px;border-radius:999px;background:var(--line);overflow:hidden}
.frx .dcard .mt .t i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#2f6bed,#5b8cff)}
.frx .dcard .mt .v{font-size:12px;font-weight:800;color:var(--brand)}

/* method */
.frx .fw-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .fw-grid{grid-template-columns:1fr}}
.frx .fw{display:flex;gap:12px;padding:14px 15px;border:1px solid var(--line);border-radius:12px;background:#fff}
.frx .fw .ic{width:34px;height:34px;border-radius:9px;flex:none;display:grid;place-items:center;font-weight:800;color:#fff}
.frx .fw .nm{font-size:13.5px;font-weight:800}
.frx .fw .fr{font-size:11px;font-weight:700;color:var(--muted);margin-top:1px}
.frx .fw .ds{font-size:12px;color:var(--ink-3);margin-top:5px;line-height:1.45}

/* parameter */
.frx .hero-fig{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--soft,#f6f8ff);box-shadow:var(--shadow-sm)}
.frx .hero-fig img{width:100%;display:block}
.frx .scorebar{display:flex;align-items:center;gap:20px;margin:24px 0 4px;flex-wrap:wrap}
.frx .ring{flex:none}
.frx .ring-fg{stroke-dashoffset:var(--off)}
.frx .sheet.in .ring-fg{animation:frxring 1.1s cubic-bezier(.2,.8,.2,1) both}
@keyframes frxring{from{stroke-dashoffset:276.5}to{stroke-dashoffset:var(--off)}}
.frx .score-meta{min-width:200px;flex:1}
.frx .score-meta .verdict{font-size:17px;font-weight:800;line-height:1.25}
.frx .score-meta p{font-size:13.5px;color:var(--ink-2);margin-top:6px;line-height:1.55;max-width:56ch}
.frx .pct{display:inline-flex;align-items:center;gap:7px;margin-top:10px;font-size:12px;font-weight:700;color:var(--accent,#2f6bed);
  background:var(--soft,#eef3ff);border:1px solid var(--line2,#d7e3fb);padding:6px 12px;border-radius:999px}
.frx .pct::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent,#2f6bed)}
.frx .cols{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:28px}
@media(max-width:720px){.frx .cols{grid-template-columns:1fr;gap:22px}}
.frx .subhd{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
.frx .bars{display:flex;flex-direction:column;gap:11px}
.frx .brow{display:grid;grid-template-columns:120px 1fr 32px;align-items:center;gap:10px}
.frx .brow .lb{font-size:12.5px;color:var(--ink-2);font-weight:600}
.frx .brow .tk{height:9px;border-radius:999px;background:var(--line-2);overflow:hidden;position:relative}
.frx .brow .tk i{position:absolute;left:0;top:0;height:100%;border-radius:999px;width:var(--w);
  background:linear-gradient(90deg,color-mix(in srgb,var(--accent,#2f6bed) 60%,#fff),var(--accent,#2f6bed))}
.frx .sheet.in .brow .tk i{animation:frxgrow 1s cubic-bezier(.2,.8,.2,1) both}
@keyframes frxgrow{from{width:0}to{width:var(--w)}}
.frx .brow .vv{font-size:12.5px;font-weight:800;text-align:right}
.frx .prose .lead{font-size:14.5px;color:var(--ink)}
.frx .prose p{font-size:13.5px;line-height:1.65;color:var(--ink-2)}
.frx .prose p+p{margin-top:11px}
.frx .twocard{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:28px}
@media(max-width:560px){.frx .twocard{grid-template-columns:1fr}}
.frx .lc{border:1px solid var(--line);border-radius:13px;padding:17px 17px 15px;background:#fff}
.frx .lc.good{background:linear-gradient(180deg,#f4fbf7,#fff);border-color:#dcefe5}
.frx .lc.grow{background:linear-gradient(180deg,#fdf6ef,#fff);border-color:#f2e2d1}
.frx .lc h4{margin:0 0 11px;font-size:13px;font-weight:800;display:flex;align-items:center;gap:8px}
.frx .lc.good h4{color:#157a51}.frx .lc.grow h4{color:#b4602a}
.frx .lc ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px}
.frx .lc li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .lc li::before{position:absolute;left:0;top:0;font-weight:800}
.frx .lc.good li::before{content:"✓";color:var(--good)}
.frx .lc.grow li::before{content:"→";color:var(--grow)}
.frx .recos{margin-top:28px}
.frx .recos ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;counter-reset:r}
.frx .recos li{counter-increment:r;position:relative;padding:14px 16px 14px 54px;border:1px solid var(--line);
  border-left:3px solid var(--accent,#2f6bed);border-radius:12px;background:#fff;font-size:13px;line-height:1.55;color:var(--ink-2)}
.frx .recos li::before{content:counter(r);position:absolute;left:14px;top:50%;transform:translateY(-50%);width:27px;height:27px;
  border-radius:8px;background:var(--soft,#eef3ff);color:var(--accent,#2f6bed);display:grid;place-items:center;font-weight:800;font-size:13px}

/* domains */
.frx .dom{border:1px solid var(--line);border-radius:15px;overflow:hidden;background:#fff;margin-bottom:14px;box-shadow:var(--shadow-sm)}
.frx .dom-hd{display:flex;align-items:center;gap:14px;padding:16px 18px;background:linear-gradient(180deg,var(--soft,#eef3ff),#fff);border-bottom:1px solid var(--line)}
.frx .dom-hd .rk{width:32px;height:32px;border-radius:9px;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--accent,#2f6bed)}
.frx .dom-hd .nm{font-size:16px;font-weight:800}
.frx .dom-hd .tl{font-size:12px;color:var(--ink-3);margin-top:2px}
.frx .dom-hd .fit{margin-left:auto;text-align:right;flex:none}
.frx .dom-hd .fit b{font-size:21px;font-weight:800;color:var(--accent,#2f6bed)}
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
.frx .dlinks a{font-size:11.5px;font-weight:700;color:var(--accent,#2f6bed);text-decoration:none;background:var(--soft,#eef3ff);border:1px solid var(--line2,#d7e3fb);padding:6px 11px;border-radius:8px}
.frx .dlinks a::after{content:" ↗";opacity:.6}

/* roadmap */
.frx .road{position:relative;padding-left:34px}
.frx .road::before{content:"";position:absolute;left:11px;top:6px;bottom:6px;width:2px;background:linear-gradient(180deg,#2f6bed,#8b5cf6)}
.frx .rstep{position:relative;padding:0 0 22px}
.frx .rstep:last-child{padding-bottom:0}
.frx .rstep::before{content:"";position:absolute;left:-28px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid var(--rc,#2f6bed);box-shadow:0 0 0 4px #fff}
.frx .rstep .yr{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--rc,#2f6bed)}
.frx .rstep .ti{font-size:15px;font-weight:800;margin-top:3px}
.frx .rstep .tx{font-size:12.5px;line-height:1.55;color:var(--ink-2);margin-top:5px;max-width:62ch}
.frx .rstep .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.frx .rstep .tags em{font-style:normal;font-size:11px;font-weight:600;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:4px 10px;border-radius:999px}

/* action + closing */
.frx .act{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:560px){.frx .act{grid-template-columns:1fr}}
.frx .acol{border:1px solid var(--line);border-radius:13px;padding:17px;background:#fff}
.frx .acol.n30{background:linear-gradient(180deg,#eff4ff,#fff);border-color:#d9e4fb}
.frx .acol.n90{background:linear-gradient(180deg,#f3f0ff,#fff);border-color:#e2dbf8}
.frx .acol .hd{font-size:13px;font-weight:800;display:flex;align-items:center;gap:9px;margin-bottom:12px}
.frx .acol .hd .p{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff;padding:3px 9px;border-radius:6px}
.frx .acol.n30 .p{background:#2f6bed}.frx .acol.n90 .p{background:#7c5cdb}
.frx .acol ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
.frx .acol li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .acol li::before{content:"";position:absolute;left:0;top:5px;width:13px;height:13px;border-radius:4px;border:2px solid var(--muted);opacity:.55}
.frx .closing{margin-top:16px;border-radius:15px;overflow:hidden;background:linear-gradient(160deg,#20305f,#161f42);color:#fff;padding:32px 28px;text-align:center;position:relative}
.frx .closing::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:var(--dims-grad)}
.frx .closing h3{color:#fff;font-size:23px;font-weight:800}
.frx .closing p{color:#c3ccec;font-size:14px;line-height:1.6;max-width:52ch;margin:11px auto 0}
.frx .closing .b{margin-top:20px;font-size:13px;font-weight:700;padding:12px 22px;border-radius:11px;border:none;cursor:pointer}
.frx .closing .b1{background:#fff;color:#20305f}

/* result chip */
.frx .resultchip{display:inline-flex;align-items:center;gap:8px;margin-bottom:8px;padding:5px 12px;border-radius:999px;
  background:var(--soft,#eef3ff);border:1px solid var(--line2,#d7e3fb)}
.frx .resultchip span{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .resultchip b{font-size:13px;font-weight:800;color:var(--accent,#2f6bed)}

/* temperaments */
.frx .temps{margin-top:26px}
.frx .temp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}
@media(max-width:720px){.frx .temp-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:440px){.frx .temp-grid{grid-template-columns:1fr}}
.frx .tcard{border:1px solid var(--line);border-radius:12px;padding:14px;background:#fff}
.frx .tcard.on{border-color:var(--accent,#2f6bed);background:var(--soft,#eef3ff);box-shadow:0 6px 18px rgba(47,107,237,.12)}
.frx .th{display:flex;align-items:center;gap:8px}
.frx .th .te{font-size:17px}
.frx .th .tn{font-size:14px;font-weight:800;flex:1}
.frx .th .tsc{font-size:12px;font-weight:800;color:var(--muted)}
.frx .tcard.on .th .tsc{color:var(--accent,#2f6bed)}
.frx .tt{font-size:11.5px;color:var(--ink-3);margin-top:5px;line-height:1.4}
.frx .ttr{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
.frx .ttr em{font-style:normal;font-size:10.5px;font-weight:600;color:var(--ink-2);background:var(--line-2);border-radius:999px;padding:3px 8px}
.frx .tw{margin-top:10px;font-size:11.5px;line-height:1.45;color:var(--ink-2)}
.frx .tw b{color:var(--accent,#2f6bed);font-weight:800}

/* careers / roles */
.frx .rolelist{display:flex;flex-direction:column;gap:11px}
.frx .role{border:1px solid var(--line);border-radius:13px;overflow:hidden;background:#fff}
.frx .role-top{display:flex;align-items:center;gap:13px;padding:14px 16px}
.frx .role-rk{width:28px;height:28px;border-radius:8px;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:#2f6bed;font-size:13px}
.frx .role-main{flex:1;min-width:0}
.frx .role-nm{font-size:15px;font-weight:800}
.frx .role-dm{font-size:11.5px;color:var(--ink-3);margin-top:2px}
.frx .role-fit{text-align:right;flex:none}
.frx .role-fit b{font-size:18px;font-weight:800;color:#2f6bed}
.frx .role-fit span{display:block;font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.frx .role-sal{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border-top:1px solid var(--line)}
@media(max-width:560px){.frx .role-sal{grid-template-columns:1fr}}
.frx .role-sal .rs{background:#fafbff;padding:10px 16px;font-size:11.5px;color:var(--ink-2);line-height:1.4}
.frx .role-sal .fl{display:inline-block;font-weight:800;font-size:10px;margin-right:6px;padding:2px 7px;border-radius:5px}
.frx .fl-in{background:#eef7f1;color:#157a51}.frx .fl-ab{background:#eef3ff;color:#2f6bed}

/* future outlook */
.frx .future{display:grid;grid-template-columns:1.1fr .9fr;gap:14px}
@media(max-width:720px){.frx .future{grid-template-columns:1fr}}
.frx .fcol{border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.frx .fcol.rise{background:linear-gradient(180deg,#f1f9f4,#fff);border-color:#d8ecdf}
.frx .fcol.fall{background:linear-gradient(180deg,#fbf3f3,#fff);border-color:#f0dcdc}
.frx .fh{font-size:13.5px;font-weight:800;display:flex;align-items:center;gap:8px;margin-bottom:13px}
.frx .fcol.rise .fh{color:#157a51}.frx .fcol.fall .fh{color:#b4443f}
.frx .fgrid{display:flex;flex-direction:column;gap:10px}
.frx .fitem .ft{font-size:13px;font-weight:800;color:var(--ink)}
.frx .fitem .fd{font-size:11.5px;color:var(--ink-3);margin-top:2px;line-height:1.45}
.frx .flist{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.frx .flist li{position:relative;padding-left:22px;font-size:12.5px;color:var(--ink-2);line-height:1.4}
.frx .flist li::before{content:"↓";position:absolute;left:0;top:0;color:#b4443f;font-weight:800}
.frx .fnote{margin-top:13px;padding-top:12px;border-top:1px dashed var(--line);font-size:11.5px;color:var(--ink-2);line-height:1.5;font-style:italic}

/* resources */
.frx .res{display:flex;flex-direction:column;gap:20px}
.frx .rgh{font-size:13.5px;font-weight:800;display:flex;align-items:center;gap:8px;margin-bottom:11px}
.frx .rgh .ri{font-size:16px}
.frx .rchips{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}
@media(max-width:640px){.frx .rchips{grid-template-columns:1fr 1fr}}
@media(max-width:440px){.frx .rchips{grid-template-columns:1fr}}
.frx .rchip{display:block;border:1px solid var(--line);border-radius:11px;padding:11px 13px;text-decoration:none;background:#fff}
.frx .rchip b{display:block;font-size:13px;font-weight:800;color:var(--brand-2)}
.frx .rchip span{display:block;font-size:11px;color:var(--ink-3);margin-top:2px}
.frx .portals{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .portals{grid-template-columns:1fr}}
.frx .pcol{border:1px solid var(--line);border-radius:12px;padding:13px 15px;background:#fff}
.frx .pr{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:9px}
.frx .plist{display:flex;flex-wrap:wrap;gap:7px}
.frx .plist a{font-size:12px;font-weight:700;color:var(--brand-2);text-decoration:none;background:#eef3ff;border:1px solid #dce6fb;padding:6px 11px;border-radius:8px}
.frx .schol{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.frx .schol{grid-template-columns:1fr}}
.frx .scard{display:block;border:1px solid var(--line);border-left:3px solid #c2922b;border-radius:11px;padding:12px 14px;text-decoration:none;background:linear-gradient(180deg,#fffdf6,#fff)}
.frx .scard .sn{font-size:13px;font-weight:800;color:var(--ink)}
.frx .scard .sw{font-size:11px;color:var(--ink-3);margin-top:3px;line-height:1.45}

/* journey graphic */
.frx .journey{border:1px solid var(--line);border-radius:14px;padding:14px 10px;background:linear-gradient(180deg,#f7f9ff,#fff);margin-bottom:18px}

/* academic path */
.frx .apath{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:640px){.frx .apath{grid-template-columns:1fr}}
.frx .apcard{border:1px solid var(--line);border-radius:12px;padding:15px 16px;background:#fff}
.frx .apcard.stream{background:linear-gradient(180deg,#eef3ff,#fff);border-color:#d9e4fb}
.frx .aph{font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:9px}
.frx .apv{font-size:16px;font-weight:800;color:var(--brand-2)}
.frx .apchips{display:flex;flex-wrap:wrap;gap:6px}
.frx .apchips em{font-style:normal;font-size:12px;font-weight:700;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:5px 10px;border-radius:8px}
.frx .skills{margin-top:22px}
.frx .skillrow{display:flex;flex-wrap:wrap;gap:8px}
.frx .skill{font-size:12.5px;font-weight:700;color:#157a51;background:#eef7f1;border:1px solid #d8ecdf;padding:7px 13px;border-radius:999px}

/* where you'll thrive + role models */
.frx .envbox{border:1px solid var(--line);border-radius:14px;padding:18px;background:linear-gradient(180deg,#f7f9ff,#fff)}
.frx .envfit{display:flex;gap:14px;align-items:flex-start}
.frx .envic{font-size:24px;flex:none}
.frx .envt{font-size:16px;font-weight:800;margin-bottom:5px}
.frx .envfit p{font-size:13px;line-height:1.6;color:var(--ink-2)}
.frx .envtags{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}
.frx .envtags em{font-style:normal;font-size:12px;font-weight:700;color:var(--brand-2);background:#eef3ff;border:1px solid #dce6fb;padding:6px 12px;border-radius:999px}
.frx .models{margin-top:26px}
.frx .modelrow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:560px){.frx .modelrow{grid-template-columns:1fr}}
.frx .model{display:flex;gap:13px;align-items:center;border:1px solid var(--line);border-radius:13px;padding:14px 16px;background:#fff}
.frx .mav{width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;
  background:linear-gradient(135deg,#2f6bed,#8b5cf6);font-size:15px}
.frx .mn{font-size:14.5px;font-weight:800}
.frx .mnote{font-size:12px;color:var(--ink-3);margin-top:2px;line-height:1.4}

/* for parents */
.frx .parents{margin-top:16px;border:1px solid #e6ddf6;border-radius:14px;padding:18px 20px;background:linear-gradient(180deg,#f6f3fd,#fff)}
.frx .ph{font-size:14px;font-weight:800;color:#6b3fd4;display:flex;align-items:center;gap:9px}
.frx .ph .pic{font-size:18px}
.frx .pintro{font-size:13px;color:var(--ink-2);margin:9px 0 12px;line-height:1.55}
.frx .plist2{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:9px}
@media(max-width:560px){.frx .plist2{grid-template-columns:1fr}}
.frx .plist2 li{position:relative;padding-left:23px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
.frx .plist2 li::before{content:"✦";position:absolute;left:0;top:0;color:#8b5cf6;font-weight:800}

@media print{
  .frx{gap:0}
  .frx .og-noprint{display:none !important}
  .frx .sheet{box-shadow:none;border-radius:0;border:none;border-top:3px solid var(--accent,var(--brand-2));
    page-break-after:always;break-after:page}
  .frx .sheet:last-child{page-break-after:auto}
  .frx .rv{opacity:1 !important;transform:none !important}
  .frx .cover-hero,.frx .hero-fig,.frx .closing{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
`;
