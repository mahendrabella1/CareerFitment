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
} from "@/lib/report/knowledge";

const P = "https://onegrasp.com/wp-content/uploads/2026/07/";
const LOGO = P + "onegrasp-logo.png";
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
    if (revs && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      revs.forEach((e) => io.observe(e));
      return () => io.disconnect();
    }
    revs?.forEach((e) => e.classList.add("in"));
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
                  <div className="verdict">{VERDICT[d.key] ?? m.label}</div>
                  <p>{dd.meaning}</p>
                  {d.score > 0 ? <span className="pct">Higher than {pct}% of students at your stage</span> : null}
                </div>
              </div>
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

      {/* ===== 15 · ROADMAP ===== */}
      <section className="sheet rv">
        <div className="pad">
          <RH kick="Your 20-year roadmap" />
          <SecHead eyebrow="From today to a career you’re built for" title="The path ahead, phase by phase"
            sub={`A realistic timeline tuned to your profile and your best-fit domain, ${topDomain.name}.`} />
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
.frx .rh .brandmark img{height:20px;width:auto;display:block}
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
.frx .cover-logo{height:32px;width:auto}
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
