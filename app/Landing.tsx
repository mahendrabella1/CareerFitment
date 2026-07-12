"use client";

/**
 * Landing — the marketing home. Clean, editorial, WHITE canvas with a serif
 * headline, the eight dimensions shown right in the hero (reference layout),
 * then storytelling sections that animate in on scroll: explore-each-dimension
 * with photos, the science, real-world stats with charts, a report preview and
 * reviews. Self-contained (`ogl-*` classes). `onStart` runs the gated CTA.
 */

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/app/Icons";

const LOGO = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";
const IMG = (id: string, w = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

const PRIMARY = "#3b5bdb";
const INK = "#151a24";

export default function Landing({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = root.current?.querySelectorAll(".ogl-reveal");
    if (!els || !("IntersectionObserver" in window)) { els?.forEach((e) => e.classList.add("in")); return; }
    // Reveal each element only when it actually scrolls into view (then stop
    // watching it), so each section animates in as the user reaches it.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="ogl-land">
      <style>{CSS}</style>

      {/* nav */}
      <header className="ogl-nav">
        <div className="ogl-nav-in">
          <img src={LOGO} alt="OneGrasp" className="ogl-logo" />
          <nav className="ogl-nav-links">
            <a href="#measure">What we measure</a>
            <a href="#science">The science</a>
            <a href="#why">Why it matters</a>
            <a href="#reviews">Reviews</a>
          </nav>
          <div className="ogl-nav-cta">
            <a href="/signin" className="ogl-btn-ghost">Sign in</a>
            <button className="ogl-btn" onClick={onStart}>Start assessment <Icon name="chevronRight" size={16} /></button>
          </div>
        </div>
      </header>

      {/* hero — text left, image right */}
      <section className="ogl-hero">
        <div className="ogl-hero-copy ogl-reveal ogl-from-left">
          <span className="ogl-eyebrow">Career fitment, backed by science</span>
          <h1 className="ogl-h1 ogl-serif">
            Find the career you’re<br />built to{" "}
            <span className="ogl-rot-wrap"><Rotator words={["love.", "master.", "lead.", "grow in."]} /></span>
          </h1>
          <p className="ogl-lead">
            Most people choose a career on a hunch. OneGrasp measures <b>eight sides of
            how you think, learn and work</b>, then maps you to the paths where you’ll
            genuinely excel — clear, personal and backed by science.
          </p>
          <div className="ogl-hero-tags">
            {["Personality", "Interests", "Intelligences", "Aptitude", "+4 more"].map((t) => (
              <span key={t} className="ogl-tag">{t}</span>
            ))}
          </div>
          <div className="ogl-hero-actions">
            <button className="ogl-btn ogl-btn-lg" onClick={onStart}>Take the assessment <Icon name="chevronRight" size={17} /></button>
            <a href="#science" className="ogl-btn-ghost ogl-btn-lg"><Icon name="play" size={14} /> See how it works</a>
          </div>
        </div>

        <div className="ogl-hero-media ogl-reveal ogl-from-right">
          <div className="ogl-hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-05_34_15-PM.png" alt="Discover the career that fits you" />
            <div className="ogl-photo-badge">
              <span className="ogl-photo-badge-ic"><Icon name="score" size={16} /></span>
              <span><b>Science-backed</b><small>Trusted by 50K+ students &amp; professionals</small></span>
            </div>
          </div>
          <div className="ogl-trust">
            <span><Icon name="lock" size={16} /> <b>100% Confidential</b><small>Your data is secure</small></span>
            <span><Icon name="score" size={16} /> <b>Research-backed</b><small>Validated assessments</small></span>
            <span><Icon name="user" size={16} /> <b>50K+ Users</b><small>Students &amp; professionals</small></span>
          </div>
        </div>
      </section>

      {/* why it matters — the story */}
      <section id="why" className="ogl-sec">
        <div className="ogl-why-top">
          <div className="ogl-why-copy ogl-reveal ogl-from-left">
            <span className="ogl-kicker">Why this matters</span>
            <h2 className="ogl-why-h">You’re at a crossroads. Which road is actually <span className="ogl-hl">yours</span>?</h2>
            <p className="ogl-sub">
              Marks, peer pressure, a gut feeling at 16 or 21 — that’s what most big
              choices come down to. But the right road gets a lot clearer once you can
              see how you actually think, learn and work. <b>OneGrasp</b> turns that signpost
              of doubts into one clear direction that genuinely fits you.
            </p>
          </div>
          <div className="ogl-why-art ogl-reveal ogl-from-right"><WhyArt /></div>
        </div>

        <div className="ogl-facts">
          {FACTS.map((f, i) => (
            <div key={i} className="ogl-fact ogl-reveal ogl-pop" style={{ transitionDelay: `${i * 110}ms`, borderColor: f.soft }}>
              <span className="ogl-fact-wave" style={{ background: f.soft }} />
              <div className="ogl-fact-row">
                <span className="ogl-fact-ic" style={{ background: f.soft, color: f.color }}><Icon name={f.icon} size={22} /></span>
                <div className="ogl-fact-stat" style={{ color: f.color }}>{f.stat}</div>
              </div>
              <div className="ogl-fact-bar" style={{ background: f.color }} />
              <div className="ogl-fact-text">{f.text}</div>
            </div>
          ))}
        </div>
        <div className="ogl-facts-note ogl-reveal"><span className="ogl-note-shield"><Icon name="shield" size={16} /></span> Figures reflect widely reported workforce-engagement and career-satisfaction research, shown to illustrate the cost of misalignment.</div>
        <div className="ogl-sec-cta ogl-reveal"><button className="ogl-btn ogl-btn-lg" onClick={onStart}>Take the assessment <Icon name="chevronRight" size={16} /></button></div>
      </section>

      {/* explore each dimension — with photos */}
      <section id="measure" className="ogl-sec ogl-alt">
        <div className="ogl-sec-head ogl-reveal">
          <span className="ogl-kicker">What we measure</span>
          <h2 className="ogl-h2 ogl-serif">Eight dimensions. One complete picture.</h2>
          <p className="ogl-sub">Each dimension uses an established framework, so your report reads like a proper profile — not a personality quiz.</p>
        </div>
        <div className="ogl-dims">
          {DIMENSIONS.map((d, i) => (
            <div key={d.title} className="ogl-dim ogl-reveal ogl-pop" style={{ transitionDelay: `${i * 75}ms` }}>
              <div className="ogl-dim-img"><img src={d.img} alt={d.title} loading="lazy" /><span className="ogl-dim-ic"><Icon name={d.icon} size={19} /></span></div>
              <div className="ogl-dim-body">
                <div className="ogl-dim-t">{d.title}</div>
                <div className="ogl-dim-f">{d.framework}</div>
                <div className="ogl-dim-d">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="ogl-sec-cta ogl-reveal"><button className="ogl-btn ogl-btn-lg" onClick={onStart}>Discover your eight dimensions <Icon name="chevronRight" size={16} /></button></div>
      </section>

      {/* the science */}
      <section id="science" className="ogl-sec">
        <div className="ogl-sec-head ogl-reveal">
          <span className="ogl-kicker">How we evaluate</span>
          <h2 className="ogl-h2 ogl-serif">A scientific method, <span className="ogl-hl">end to end.</span></h2>
          <p className="ogl-sub">Every answer is scored against a validated model, combined, then translated into plain-English guidance.</p>
        </div>
        <div className="ogl-steps">
          {STEPS.map((s, i) => (
            <div key={s.t} className="ogl-step-cell">
              <div className="ogl-step ogl-reveal ogl-pop" style={{ transitionDelay: `${i * 90}ms`, borderBottomColor: s.color }}>
                <span className="ogl-step-n" style={{ background: s.color }}>{i + 1}</span>
                <span className="ogl-step-ic" style={{ background: s.soft, color: s.color }}><Icon name={s.ic} size={26} /></span>
                <div className="ogl-step-t">{s.t}</div>
                <div className="ogl-step-d">{s.d}</div>
              </div>
              {i < STEPS.length - 1 && <span className="ogl-step-arrow"><Icon name="chevronRight" size={15} /></span>}
            </div>
          ))}
        </div>
        <div className="ogl-sci-banner ogl-reveal">
          <span className="ogl-sci-shield"><Icon name="shield" size={26} /></span>
          <div className="ogl-sci-text">
            <b>Built on science. Made simple.</b>
            <span>Our framework combines global, validated models with advanced analytics to deliver clarity you can actually use.</span>
          </div>
          <div className="ogl-sci-charts">
            <MiniDonut pct={72} color="#2f6bff" />
            <svg viewBox="0 0 90 46" width="90" height="46" aria-hidden>
              <rect x="4" y="26" width="12" height="16" rx="2" fill="#dbe6ff" />
              <rect x="22" y="18" width="12" height="24" rx="2" fill="#bcd2ff" />
              <rect x="40" y="10" width="12" height="32" rx="2" fill="#2f6bff" />
              <polyline points="6,22 28,14 46,6 66,12 86,4" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {[[6, 22], [28, 14], [46, 6], [66, 12], [86, 4]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="2.4" fill="#7c3aed" />)}
            </svg>
          </div>
        </div>
        <div className="ogl-sec-cta ogl-reveal"><button className="ogl-btn ogl-btn-lg" onClick={onStart}>See it work on you <Icon name="chevronRight" size={16} /></button></div>
      </section>

      {/* proof / charts */}
      <section className="ogl-sec ogl-alt">
        <div className="ogl-sec-head ogl-reveal">
          <span className="ogl-kicker">The cost of getting it wrong</span>
          <h2 className="ogl-h2 ogl-serif">Alignment isn’t a luxury — it’s the difference.</h2>
        </div>
        <div className="ogl-proof">
          <div className="ogl-proof-card ogl-reveal ogl-from-left">
            <h3 className="ogl-proof-t">Engagement by career fit</h3>
            <BarChart data={[
              { label: "Well matched", value: 82, color: "#2f9e6f" },
              { label: "Somewhat", value: 54, color: PRIMARY },
              { label: "Mismatched", value: 21, color: "#c0564f" },
            ]} />
            <p className="ogl-proof-note">People in roles that fit their strengths report far higher day-to-day engagement.</p>
          </div>
          <div className="ogl-proof-card ogl-reveal ogl-from-right" style={{ transitionDelay: "90ms" }}>
            <h3 className="ogl-proof-t">Why students switch paths</h3>
            <PieChart data={[
              { label: "Wrong fit / interest", value: 42, color: PRIMARY },
              { label: "Poor guidance", value: 33, color: "#d99a2b" },
              { label: "Financial / other", value: 25, color: "#a4708a" },
            ]} />
            <p className="ogl-proof-note">A large share of course and career switches trace back to weak early self-knowledge.</p>
          </div>
        </div>
        <div className="ogl-sec-cta ogl-reveal"><button className="ogl-btn ogl-btn-lg" onClick={onStart}>Get on the right side <Icon name="chevronRight" size={16} /></button></div>
      </section>

      {/* report preview */}
      <section className="ogl-sec">
        <div className="ogl-report-row">
          <div className="ogl-report-viz ogl-reveal ogl-from-left"><ReportMock /></div>
          <div className="ogl-report-copy ogl-reveal ogl-from-right">
            <span className="ogl-kicker">Your report</span>
            <h2 className="ogl-h2 ogl-serif">One clear map of all eight areas.</h2>
            <p className="ogl-sub">Every answer comes together in a single visual profile — with a plain-English read on each dimension and the careers that fit you best. Sign in any time to revisit it.</p>
            <ul className="ogl-check">
              <li>Ranked career matches with fit scores</li>
              <li>Personality, intelligences, EI, learning style &amp; motivators</li>
              <li>Strengths &amp; aptitude, scored objectively</li>
            </ul>
            <button className="ogl-btn ogl-btn-lg" onClick={onStart}>Build my report <Icon name="chevronRight" size={17} /></button>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section id="reviews" className="ogl-sec ogl-alt">
        <div className="ogl-rev-head ogl-reveal">
          <div>
            <span className="ogl-kicker">What people say</span>
            <h2 className="ogl-h2 ogl-serif">Clarity people wish they’d had sooner.</h2>
          </div>
          <div className="ogl-rev-score">
            <div className="ogl-rev-score-n">4.9<span>/5</span></div>
            <div className="ogl-stars">★★★★★</div>
            <div className="ogl-rev-score-l">from 2,000+ assessments</div>
          </div>
        </div>
        <div className="ogl-reviews">
          {REVIEWS.map((r, i) => (
            <figure key={r.name} className={`ogl-review ogl-reveal ogl-pop${i === 1 ? " ogl-review-hot" : ""}`} style={{ transitionDelay: `${i * 110}ms` }}>
              <span className="ogl-quote">“</span>
              <div className="ogl-stars">★★★★★</div>
              <blockquote className="ogl-review-q">{r.quote}</blockquote>
              <figcaption className="ogl-review-by">
                <span className="ogl-ava" style={{ background: r.color }}>{r.name.charAt(0)}</span>
                <span><b>{r.name}</b><span className="ogl-review-role">{r.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="ogl-sec-cta ogl-reveal"><button className="ogl-btn ogl-btn-lg" onClick={onStart}>Start your assessment <Icon name="chevronRight" size={16} /></button></div>
      </section>

      {/* final CTA */}
      <section className="ogl-cta ogl-reveal ogl-mid">
        <h2 className="ogl-cta-t ogl-serif">Your clearest career decision starts here.</h2>
        <p className="ogl-cta-s">Take 25 minutes today to save years of second-guessing.</p>
        <button className="ogl-btn ogl-btn-light ogl-btn-lg" onClick={onStart}>Start the assessment <Icon name="chevronRight" size={17} /></button>
      </section>

      <footer className="ogl-foot">
        <img src={LOGO} alt="OneGrasp" className="ogl-logo" style={{ height: 26 }} />
        <span>© {new Date().getFullYear()} OneGrasp · Career fitment, backed by science</span>
        <a href="/signin">Sign in</a>
      </footer>
    </div>
  );
}

/* ------------------------------- content ------------------------------- */
const DIMENSIONS = [
  { title: "Personality", short: "How you naturally think, feel and behave.", desc: "How you engage, decide, handle pressure and recharge.", framework: "Big Five + Temperament", icon: "user", img: IMG("photo-1522071820081-009f0129c71c") },
  { title: "Career Interest", short: "Work environments that match your interests.", desc: "The fields and activities that genuinely pull you in.", framework: "Interest clustering", icon: "compass", img: IMG("photo-1541339907198-e08756dedf3f") },
  { title: "Multiple Intelligence", short: "Your natural abilities beyond traditional IQ.", desc: "The ways you most naturally think and process the world.", framework: "Gardner’s 8 intelligences", icon: "bulb", img: IMG("photo-1532094349884-543bc11b234d") },
  { title: "Emotional Intelligence", short: "How you understand and manage emotions.", desc: "Reading situations, managing yourself and relating to others.", framework: "EI scenarios", icon: "pulse", img: IMG("photo-1552664730-d307ca884978") },
  { title: "Learning Styles", short: "The way you learn best and retain more.", desc: "How you absorb new material fastest — visual, aural, reading, kinesthetic.", framework: "VARK", icon: "learning_styles", img: IMG("photo-1503676260728-1c00da094a0b") },
  { title: "Motivators", short: "What drives you and keeps you going.", desc: "What energises you — and what quietly burns you out.", framework: "Work-values model", icon: "match", img: IMG("photo-1454165804606-c3d57bc86b40") },
  { title: "Strengths", short: "Your core strengths and how to use them.", desc: "Problem-solving, critical thinking, decisions and communication.", framework: "Reasoning + self-report", icon: "star", img: IMG("photo-1503387762-592deb58ef4e") },
  { title: "Aptitude", short: "Your ability to learn and solve problems.", desc: "Verbal, numerical, logical and spatial reasoning, scored objectively.", framework: "Cognitive reasoning", icon: "cpu", img: IMG("photo-1461749280684-dccba630e2f6") },
];

const STEPS = [
  { ic: "answer", t: "Answer", d: "Stage-appropriate questions across all eight dimensions, with visuals and audio where it helps.", color: "#2f6bff", soft: "#e9f0ff" },
  { ic: "score", t: "Score", d: "Each response is scored against its validated model — Big Five, Gardner, VARK, EI and more.", color: "#16a34a", soft: "#e6f6ec" },
  { ic: "combine", t: "Combine", d: "Dimensions are weighted and cross-checked to build one coherent profile.", color: "#7c3aed", soft: "#f1e9fd" },
  { ic: "match", t: "Match", d: "Your interests and aptitudes map to specific career clusters and roles.", color: "#f59e0b", soft: "#fdf1dd" },
  { ic: "explain", t: "Explain", d: "You get a clear report — a single visual map plus plain-English guidance.", color: "#14b8a6", soft: "#e0f5f2" },
];

const FACTS = [
  { stat: "~2 in 3", text: "employees feel disengaged at work — most in roles that never fit them.", icon: "user", color: "#dc2626", soft: "#fdecec" },
  { stat: "50%+", text: "of students reconsider their stream or degree within the first two years.", icon: "cap", color: "#e08a0a", soft: "#fdf1dd" },
  { stat: "90,000", text: "hours are spent working across an average lifetime — spend them well.", icon: "clock", color: "#2f6bff", soft: "#e9f0ff" },
];

const REVIEWS = [
  { name: "Aarav", role: "Class 11 student", color: "#3b5bdb", quote: "I always assumed engineering. The report showed my strengths pointed to design and communication — it genuinely changed my plan." },
  { name: "Priya", role: "Graduate", color: "#2f9e6f", quote: "The eight-area chart made everything click. For the first time my choices felt based on something real, not just marks." },
  { name: "Rahul", role: "Parent", color: "#a4708a", quote: "As a parent this gave us a calm, structured conversation instead of arguments. Worth every minute." },
];

/* ------------------------------- visuals ------------------------------- */
/** Polished report-card mockup for the "Your report" section. */
function ReportMock() {
  const bars: [string, number][] = [["Aptitude", 78], ["Strengths", 72], ["Emotional Int.", 84], ["Interests", 66]];
  return (
    <div className="ogl-repcard">
      <div className="ogl-repcard-top">
        <div>
          <div className="ogl-repcard-kick">Career Report</div>
          <div className="ogl-repcard-name">Design &amp; Media</div>
        </div>
        <div className="ogl-repcard-fit"><b>86%</b><span>top fit</span></div>
      </div>
      <div className="ogl-repcard-radar"><RadarMock /></div>
      <div className="ogl-repcard-bars">
        {bars.map(([l, v]) => (
          <div key={l} className="ogl-repcard-bar">
            <span>{l}</span>
            <i><b style={{ width: `${v}%` }} /></i>
            <em>{v}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarMock() {
  const vals = [72, 66, 84, 78, 61, 70, 74, 80];
  const n = vals.length, cx = 110, cy = 110, R = 92;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const poly = (frac: number, arr?: number[]) =>
    vals.map((v, i) => { const r = R * (arr ? arr[i] / 100 : frac); return `${cx + r * Math.cos(ang(i))},${cy + r * Math.sin(ang(i))}`; }).join(" ");
  return (
    <svg viewBox="0 0 220 220" className="ogl-radar">
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={poly(f)} fill="none" stroke="#e5e8ee" strokeWidth="1" />)}
      {vals.map((_, i) => <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(ang(i))} y2={cy + R * Math.sin(ang(i))} stroke="#e5e8ee" strokeWidth="1" />)}
      <polygon points={poly(1, vals)} fill="rgba(59,91,219,.16)" stroke={PRIMARY} strokeWidth="2.2" strokeLinejoin="round" />
      {vals.map((v, i) => { const r = R * (v / 100); return <circle key={i} cx={cx + r * Math.cos(ang(i))} cy={cy + r * Math.sin(ang(i))} r="3" fill={PRIMARY} />; })}
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  return (
    <div className="ogl-bc">
      {data.map((d) => (
        <div key={d.label} className="ogl-bc-row">
          <span className="ogl-bc-l">{d.label}</span>
          <div className="ogl-bc-track"><div className="ogl-bc-fill" style={{ width: `${d.value}%`, background: d.color }} /></div>
          <span className="ogl-bc-v">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0; const R = 60, C = 70;
  return (
    <div className="ogl-pie">
      <svg viewBox="0 0 140 140" width="140" height="140">
        {data.map((d, i) => {
          const a0 = (acc / total) * 2 * Math.PI; acc += d.value;
          const a1 = (acc / total) * 2 * Math.PI;
          const x0 = C + R * Math.sin(a0), y0 = C - R * Math.cos(a0);
          const x1 = C + R * Math.sin(a1), y1 = C - R * Math.cos(a1);
          const large = a1 - a0 > Math.PI ? 1 : 0;
          return <path key={i} d={`M${C},${C} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`} fill={d.color} />;
        })}
        <circle cx={C} cy={C} r="30" fill="#fff" />
      </svg>
      <div className="ogl-pie-leg">
        {data.map((d) => <span key={d.label}><i style={{ background: d.color }} />{d.label} · {d.value}%</span>)}
      </div>
    </div>
  );
}

/** Animated rotating word for the hero headline. */
function Rotator({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  return <span key={i} className="ogl-rot">{words[i]}</span>;
}

/** Uses the provided illustration (public/why-this-matters.png); if it isn't
 *  present yet, gracefully falls back to the inline SVG scene below. */
function WhyArt() {
  const [failed, setFailed] = useState(false);
  if (failed) return <WhyIllustration />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-06_22_06-PM.png" alt="Choosing the right path with clarity" className="ogl-why-svg" onError={() => setFailed(true)} />;
}

/** Stylized scene: a traveller at a signpost of doubts, a clear road to the peak. */
function WhyIllustration() {
  const signs = ["Marks", "Peer Pressure", "Guesswork", "Uncertainty"];
  const road = "M96 384 C 150 340, 128 292, 220 274 S 356 250, 402 196";
  return (
    <svg viewBox="0 0 520 400" className="ogl-why-svg" role="img" aria-label="Choosing a path with clarity">
      <rect x="0" y="0" width="520" height="400" rx="22" fill="#f2f6ff" />
      <circle cx="426" cy="120" r="54" fill="#fff2d6" />
      {/* mountains */}
      <path d="M300 262 L360 168 L420 262 Z" fill="#dbe6fb" />
      <path d="M336 262 L418 108 L500 262 Z" fill="#c7d6f4" />
      <path d="M418 108 L446 160 L426 170 L406 156 L392 168 Z" fill="#fff" />
      <line x1="418" y1="108" x2="418" y2="80" stroke="#334155" strokeWidth="3" />
      <path d="M418 82 L440 89 L418 97 Z" fill="#2f6bff" />
      {/* grass */}
      <ellipse cx="80" cy="372" rx="60" ry="16" fill="#dcefe0" />
      <ellipse cx="470" cy="316" rx="46" ry="13" fill="#dcefe0" />
      {/* road */}
      <path d={road} fill="none" stroke="#e5ebf6" strokeWidth="36" strokeLinecap="round" />
      <path d={road} fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" />
      <path d={road} fill="none" stroke="#c3d2ee" strokeWidth="2.5" strokeDasharray="7 11" strokeLinecap="round" />
      {/* goal check */}
      <circle cx="402" cy="196" r="15" fill="#2f6bff" />
      <path d="M395 196 l5 5 9-10" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="344" y="220" width="150" height="26" rx="13" fill="#fff" stroke="#e3e8f0" />
      <text x="357" y="237" fontSize="11" fontWeight="800" fill="#2f6bff" fontFamily="Poppins,Inter,sans-serif">Clarity · Purpose · Path</text>
      {/* signpost */}
      <rect x="150" y="120" width="8" height="176" rx="4" fill="#b9c2d0" />
      {signs.map((s, i) => {
        const y = 132 + i * 38;
        return (
          <g key={s}>
            <path d={`M150 ${y} h -84 l -13 14 l 13 14 h 84 z`} fill="#fff" stroke="#e3e8f0" />
            <circle cx="58" cy={y + 14} r="3.5" fill="#9aa6b6" />
            <text x="78" y={y + 18} fontSize="12" fontWeight="700" fill="#5b6470" fontFamily="Poppins,Inter,sans-serif">{s}</text>
          </g>
        );
      })}
      {/* traveller */}
      <path d="M196 336 q22 -52 44 0 z" fill="#2f5bd6" />
      <rect x="204" y="322" width="8" height="24" rx="3" fill="#1f2b4a" />
      <rect x="224" y="322" width="8" height="24" rx="3" fill="#1f2b4a" />
      <circle cx="218" cy="266" r="14" fill="#f0c9a8" />
      <path d="M205 262 q4 -16 13 -16 q11 0 13 15 q-7 -6 -13 -6 q-8 0 -13 7z" fill="#26324d" />
      <path d="M240 300 l24 -8" stroke="#f0c9a8" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function MiniDonut({ pct, color }: { pct: number; color: string }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" width="60" height="60">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#eceef2" strokeWidth="7" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 32 32)" />
    </svg>
  );
}

/* -------------------------------- styles ------------------------------- */
const CSS = `
.ogl-land{background:#fff;color:${INK};font-family:'Poppins',Inter,system-ui,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased}
.ogl-land *{box-sizing:border-box}
.ogl-serif{font-family:'Poppins',Inter,sans-serif;font-weight:700;letter-spacing:-.015em}
.ogl-hl{color:${PRIMARY};box-shadow:inset 0 -0.28em 0 rgba(59,91,219,.16)}
.ogl-reveal{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}
.ogl-reveal.ogl-from-left{transform:translateX(-52px)}
.ogl-reveal.ogl-from-right{transform:translateX(52px)}
.ogl-reveal.ogl-pop{transform:translateY(34px) scale(.92);transition:opacity .42s cubic-bezier(.2,.8,.25,1.05),transform .42s cubic-bezier(.2,.8,.25,1.05)}
.ogl-reveal.ogl-mid{transform:scale(.9)}
.ogl-reveal.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.ogl-reveal{transition:opacity .3s;transform:none}}

.ogl-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.9);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid #eef0f4}
.ogl-nav-in{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:20px;padding:6px 24px}
.ogl-logo{height:88px;width:auto;display:block}
@media(max-width:600px){.ogl-logo{height:60px}.ogl-nav-in{gap:10px;padding:6px 14px}}
@media(max-width:380px){.ogl-logo{height:50px}}
.ogl-nav-links{display:flex;gap:24px;margin-left:28px;flex:1}
.ogl-nav-links a{color:#4b5563;text-decoration:none;font-size:13.5px;font-weight:600}
.ogl-nav-links a:hover{color:${INK}}
.ogl-nav-cta{display:flex;align-items:center;gap:10px}
@media(max-width:880px){.ogl-nav-links{display:none}}

.ogl-btn{display:inline-flex;align-items:center;gap:6px;background:${INK};color:#fff;border:none;border-radius:11px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;transition:transform .12s,box-shadow .2s;box-shadow:0 8px 20px rgba(21,26,36,.18)}
.ogl-btn:hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(21,26,36,.24)}
.ogl-btn-lg{padding:14px 24px;font-size:15px;border-radius:12px}
.ogl-btn-light{background:#fff;color:${INK};box-shadow:0 12px 30px rgba(0,0,0,.16)}
.ogl-btn-ghost{display:inline-flex;align-items:center;gap:7px;background:transparent;color:#374151;border:1px solid #dfe3ea;border-radius:11px;padding:11px 16px;font-size:14px;font-weight:700;text-decoration:none;cursor:pointer}
.ogl-btn-ghost:hover{border-color:#c4cbd6}
.ogl-btn-lg.ogl-btn-ghost{padding:14px 20px}
.ogl-sec-cta{display:flex;justify-content:center;margin-top:38px}

/* hero — fills the first screen */
.ogl-hero{max-width:1160px;margin:0 auto;min-height:calc(100vh - 66px);display:grid;grid-template-columns:1.08fr .92fr;gap:48px;align-items:center;padding:20px 44px 40px}
@media(max-width:940px){.ogl-hero{min-height:0;grid-template-columns:1fr;gap:26px;padding:22px 26px 34px}}
.ogl-hero-tags{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 24px}
.ogl-tag{background:#f2f5fb;border:1px solid #e6ecf6;color:#3f4855;font-size:12.5px;font-weight:600;padding:6px 13px;border-radius:999px}
.ogl-hero-photo{position:relative;border-radius:20px;overflow:hidden;box-shadow:0 26px 60px rgba(21,26,36,.16);aspect-ratio:4/3.7;background:#eef1f5}
.ogl-hero-photo img{width:100%;height:100%;object-fit:cover;display:block}
.ogl-photo-badge{position:absolute;left:16px;bottom:16px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.96);border-radius:12px;padding:10px 13px;box-shadow:0 12px 26px rgba(21,26,36,.16)}
.ogl-photo-badge-ic{width:30px;height:30px;border-radius:8px;background:#eef2ff;color:${PRIMARY};display:grid;place-items:center;flex-shrink:0}
.ogl-photo-badge b{font-size:13px;display:block}
.ogl-photo-badge small{font-size:11px;color:#6b7280;display:block}
.ogl-trust{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;border:1px solid #eef0f4;border-radius:14px;padding:14px}
.ogl-trust span{display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:#6b7280}
.ogl-trust span svg{color:${PRIMARY}}
.ogl-trust b{font-size:12.5px;color:${INK}}
.ogl-trust small{font-size:11px;color:#8a919c}

.ogl-eyebrow{display:inline-block;background:#eef2ff;color:${PRIMARY};font-size:12px;font-weight:700;padding:6px 13px;border-radius:999px;text-transform:uppercase;letter-spacing:.6px}
.ogl-h1{font-size:clamp(28px,3.2vw,42px);line-height:1.14;font-weight:700;margin:14px 0 0;color:${INK}}
.ogl-rot-wrap{display:inline-block;position:relative}
.ogl-rot{display:inline-block;color:${PRIMARY};box-shadow:inset 0 -0.16em 0 rgba(59,91,219,.16);animation:oglRot .55s cubic-bezier(.2,.8,.2,1)}
@keyframes oglRot{0%{opacity:0;transform:translateY(14px) rotateX(-40deg)}100%{opacity:1;transform:none}}
.ogl-lead{font-size:16px;line-height:1.68;color:#454b57;margin:14px 0 22px;max-width:540px}
.ogl-hero-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px 16px;margin-bottom:24px}
@media(max-width:420px){.ogl-hero-grid{grid-template-columns:1fr}}
.ogl-hg{display:flex;flex-direction:column;gap:1px;padding-left:2px}
.ogl-hg-ic{width:34px;height:34px;border-radius:9px;background:#f4f6fb;border:1px solid #e9edf4;color:${PRIMARY};display:grid;place-items:center;margin-bottom:7px}
.ogl-hg-t{font-size:13.5px;font-weight:700}
.ogl-hg-d{font-size:11.5px;color:#8a919c;line-height:1.4;margin-top:1px}
.ogl-hero-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center}

/* sections */
.ogl-sec{max-width:1180px;margin:0 auto;padding:70px 24px}
.ogl-alt{max-width:none;background:#f7f8fa;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4}
.ogl-alt>*{max-width:1180px;margin-left:auto;margin-right:auto}
.ogl-sec-head{max-width:740px;margin:0 auto 40px;text-align:center}
.ogl-kicker{font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:.9px;color:${PRIMARY}}
.ogl-h2{font-size:clamp(25px,3.3vw,35px);font-weight:700;margin:12px 0 0;line-height:1.16}
.ogl-sub{font-size:16px;line-height:1.68;color:#454b57;margin:14px 0 0}

.ogl-why-top{display:grid;grid-template-columns:1fr 1.2fr;gap:44px;align-items:center;margin-bottom:46px}
@media(max-width:880px){.ogl-why-top{grid-template-columns:1fr;gap:24px}}
.ogl-why-h{font-family:'Poppins',Inter,sans-serif;font-size:clamp(26px,3.4vw,38px);font-weight:700;letter-spacing:-.02em;line-height:1.14;margin:12px 0 0}
.ogl-why-art{display:flex;justify-content:center}
.ogl-why-svg{width:100%;max-width:680px;height:auto;border-radius:16px}

.ogl-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
@media(max-width:820px){.ogl-facts{grid-template-columns:1fr}}
.ogl-fact{position:relative;overflow:hidden;background:#fff;border:1px solid #eceef2;border-radius:18px;padding:24px 24px 22px;box-shadow:0 4px 16px rgba(21,26,36,.05)}
.ogl-fact-wave{position:absolute;left:0;right:0;bottom:0;height:38px;border-radius:50% 50% 0 0 / 100% 100% 0 0;opacity:.5}
.ogl-fact-row{display:flex;align-items:center;gap:14px;position:relative}
.ogl-fact-ic{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;flex-shrink:0}
.ogl-fact-stat{font-size:32px;font-weight:700;line-height:1}
.ogl-fact-bar{width:34px;height:3px;border-radius:2px;margin:14px 0 10px;position:relative}
.ogl-fact-text{font-size:14px;color:#5b6470;line-height:1.55;position:relative}
.ogl-facts-note{display:flex;align-items:flex-start;gap:10px;justify-content:center;text-align:left;font-size:12.5px;color:#6b7280;line-height:1.5;background:#eef6f0;border:1px solid #d9ece1;border-radius:12px;padding:12px 16px;margin:22px auto 0;max-width:720px}
.ogl-note-shield{color:#2f9e6f;flex-shrink:0;margin-top:1px}

.ogl-dims{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:980px){.ogl-dims{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.ogl-dims{grid-template-columns:1fr}}
.ogl-dim{background:#fff;border:1px solid #eceef2;border-radius:16px;overflow:hidden;transition:transform .18s,box-shadow .2s}
.ogl-dim:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(21,26,36,.08)}
.ogl-dim-img{position:relative;height:116px;overflow:hidden;background:#f0f2f5}
.ogl-dim-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}
.ogl-dim:hover .ogl-dim-img img{transform:scale(1.05)}
.ogl-dim-ic{position:absolute;left:14px;bottom:-17px;width:40px;height:40px;border-radius:11px;background:#fff;border:1px solid #eceef2;display:grid;place-items:center;color:${PRIMARY};box-shadow:0 6px 14px rgba(21,26,36,.12)}
.ogl-dim-body{padding:26px 18px 20px}
.ogl-dim-t{font-size:16px;font-weight:700}
.ogl-dim-f{font-size:12px;font-weight:700;color:${PRIMARY};margin:3px 0 8px}
.ogl-dim-d{font-size:13.5px;color:#5b6470;line-height:1.55}

.ogl-steps{display:flex;align-items:stretch;gap:0;margin-top:24px}
@media(max-width:900px){.ogl-steps{flex-wrap:wrap;justify-content:center;gap:14px}}
.ogl-step-cell{flex:1;display:flex;align-items:stretch}
@media(max-width:900px){.ogl-step-cell{flex:0 0 260px}}
.ogl-step{position:relative;flex:1;background:#fff;border:1px solid #edf0f5;border-bottom:3px solid;border-radius:16px;padding:34px 18px 22px;text-align:center;margin-top:14px;box-shadow:0 4px 16px rgba(21,26,36,.05)}
.ogl-step-n{position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:30px;height:30px;border-radius:50%;color:#fff;font-size:14px;font-weight:700;display:grid;place-items:center;box-shadow:0 6px 14px rgba(21,26,36,.18)}
.ogl-step-ic{width:58px;height:58px;border-radius:50%;margin:6px auto 12px;display:grid;place-items:center}
.ogl-step-t{font-size:16px;font-weight:700}
.ogl-step-d{font-size:12.5px;color:#6b7280;line-height:1.5;margin-top:8px}
.ogl-step-arrow{display:flex;align-items:center;justify-content:center;color:#c3ccda;width:38px;flex-shrink:0}
@media(max-width:900px){.ogl-step-arrow{display:none}}

.ogl-sci-banner{display:flex;align-items:center;gap:18px;background:#f7f9fc;border:1px solid #e9edf3;border-radius:18px;padding:20px 24px;margin-top:34px}
@media(max-width:700px){.ogl-sci-banner{flex-direction:column;text-align:center}}
.ogl-sci-shield{width:52px;height:52px;border-radius:14px;background:#eaf0ff;color:${PRIMARY};display:grid;place-items:center;flex-shrink:0}
.ogl-sci-text{flex:1}
.ogl-sci-text b{display:block;font-size:16px;font-weight:700;margin-bottom:3px}
.ogl-sci-text span{font-size:13.5px;color:#6b7280;line-height:1.5}
.ogl-sci-charts{display:flex;align-items:center;gap:16px;flex-shrink:0}

.ogl-proof{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:820px){.ogl-proof{grid-template-columns:1fr}}
.ogl-proof-card{background:#fff;border:1px solid #eceef2;border-radius:18px;padding:26px 24px;box-shadow:0 2px 12px rgba(21,26,36,.04)}
.ogl-proof-t{font-size:16px;font-weight:700;margin:0 0 18px}
.ogl-proof-note{font-size:13px;color:#6b7280;line-height:1.55;margin:16px 0 0}
.ogl-bc{display:flex;flex-direction:column;gap:14px}
.ogl-bc-row{display:flex;align-items:center;gap:12px}
.ogl-bc-l{width:112px;font-size:13.5px;color:#374151;font-weight:600;flex-shrink:0}
.ogl-bc-track{flex:1;height:14px;background:#eef1f5;border-radius:8px;overflow:hidden}
.ogl-bc-fill{height:100%;border-radius:8px;transition:width 1s ease}
.ogl-bc-v{width:38px;text-align:right;font-weight:700;font-size:13.5px}
.ogl-pie{display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:center}
.ogl-pie-leg{display:flex;flex-direction:column;gap:8px;font-size:13px;color:#374151}
.ogl-pie-leg span{display:flex;align-items:center;gap:8px}
.ogl-pie-leg i{width:11px;height:11px;border-radius:3px;display:inline-block}

.ogl-report-row{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;align-items:center}
@media(max-width:860px){.ogl-report-row{grid-template-columns:1fr;gap:24px}}
.ogl-report-viz{display:flex;justify-content:center;background:linear-gradient(140deg,#eaf0fc,#f6f8fd);border-radius:24px;padding:36px 26px}
.ogl-radar{width:210px;height:210px;display:block}
.ogl-repcard{background:#fff;border:1px solid #edf0f6;border-radius:20px;padding:20px;box-shadow:0 26px 60px rgba(21,26,36,.14);max-width:390px;width:100%}
.ogl-repcard-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
.ogl-repcard-kick{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#94a3b8}
.ogl-repcard-name{font-size:18px;font-weight:700;color:${INK};margin-top:2px}
.ogl-repcard-fit{text-align:center;background:#eef2ff;border-radius:12px;padding:7px 13px}
.ogl-repcard-fit b{display:block;font-size:19px;font-weight:700;color:${PRIMARY}}
.ogl-repcard-fit span{font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:#9aa6c4}
.ogl-repcard-radar{display:flex;justify-content:center}
.ogl-repcard-radar svg{width:186px;height:186px}
.ogl-repcard-bars{display:flex;flex-direction:column;gap:9px;margin-top:6px}
.ogl-repcard-bar{display:flex;align-items:center;gap:10px;font-size:12px;color:#5b6470;font-weight:600}
.ogl-repcard-bar span{width:82px;flex-shrink:0}
.ogl-repcard-bar i{flex:1;height:8px;background:#eef1f5;border-radius:6px;overflow:hidden;display:block}
.ogl-repcard-bar b{display:block;height:100%;background:${PRIMARY};border-radius:6px}
.ogl-repcard-bar em{width:24px;text-align:right;font-style:normal;color:${INK};font-weight:700}
.ogl-check{list-style:none;padding:0;margin:16px 0 24px;display:flex;flex-direction:column;gap:10px}
.ogl-check li{position:relative;padding-left:28px;font-size:14.5px;color:#374151;line-height:1.5}
.ogl-check li:before{content:"✓";position:absolute;left:0;top:0;width:19px;height:19px;background:#e9f4ef;color:#2f9e6f;border-radius:50%;font-size:12px;font-weight:700;display:grid;place-items:center}

.ogl-rev-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;max-width:1180px;margin:0 auto 38px;flex-wrap:wrap}
.ogl-rev-head .ogl-h2{margin-top:10px}
.ogl-rev-score{text-align:right;flex-shrink:0}
.ogl-rev-score-n{font-size:36px;font-weight:700;color:${INK};line-height:1;font-family:'Poppins',Inter,sans-serif}
.ogl-rev-score-n span{font-size:16px;color:#9aa6c4;font-weight:600}
.ogl-rev-score-l{font-size:12px;color:#8a919c;margin-top:3px}
.ogl-reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
@media(max-width:860px){.ogl-reviews{grid-template-columns:1fr}.ogl-rev-head{text-align:left}.ogl-rev-score{text-align:left}}
.ogl-review{position:relative;overflow:hidden;background:#fff;border:1px solid #eceef2;border-radius:18px;padding:28px 24px 24px;margin:0;box-shadow:0 6px 20px rgba(21,26,36,.05)}
.ogl-review-hot{border-color:#c9d6f5;box-shadow:0 20px 46px rgba(59,91,219,.16)}
.ogl-quote{position:absolute;top:2px;right:20px;font-family:Georgia,serif;font-size:70px;color:#eef1f8;line-height:1;pointer-events:none}
.ogl-stars{color:#e0a92e;font-size:15px;letter-spacing:2px}
.ogl-review-q{position:relative;font-size:15px;line-height:1.62;color:#374151;margin:12px 0 18px}
.ogl-review-by{display:flex;align-items:center;gap:11px}
.ogl-ava{width:40px;height:40px;border-radius:50%;color:#fff;font-weight:700;display:grid;place-items:center;font-size:16px;flex-shrink:0}
.ogl-review-by b{font-size:14px;display:block}
.ogl-review-role{font-size:12.5px;color:#8a919c}

.ogl-cta{background:${INK};color:#fff;text-align:center;padding:66px 24px}
.ogl-cta-t{font-size:clamp(25px,3.6vw,35px);font-weight:700;margin:0}
.ogl-cta-s{font-size:16px;opacity:.85;margin:12px 0 26px}

.ogl-foot{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:26px 24px;color:#8a919c;font-size:13px;flex-wrap:wrap}
.ogl-foot a{color:#5b6470;text-decoration:none;font-weight:600}
`;
