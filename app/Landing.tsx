"use client";

/**
 * Landing — the marketing home page. Clean WHITE canvas, calm palette, and
 * sections that animate in on scroll: hero with a product mockup, the eight
 * dimensions we measure, the science behind it, real-world statistics with
 * charts, a report preview, and reviews. Self-contained (`og-*` classes).
 * `onStart` runs the gated CTA (register, or dashboard if already signed in).
 */

import { useEffect, useRef } from "react";
import { Icon } from "@/app/Icons";

const LOGO = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";
const IMG = (id: string, w = 640) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const PRIMARY = "#4f6b9e";

export default function Landing({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  // Scroll-reveal.
  useEffect(() => {
    const els = root.current?.querySelectorAll(".og-reveal");
    if (!els || !("IntersectionObserver" in window)) {
      els?.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((e) => io.observe(e));
    const failsafe = window.setTimeout(() => els.forEach((e) => e.classList.add("in")), 1600);
    return () => { io.disconnect(); window.clearTimeout(failsafe); };
  }, []);

  return (
    <div ref={root} className="og-land">
      <style>{CSS}</style>

      {/* ---------- nav ---------- */}
      <header className="og-nav">
        <div className="og-nav-in">
          <img src={LOGO} alt="OneGrasp" className="og-logo" />
          <nav className="og-nav-links">
            <a href="#dimensions">What we measure</a>
            <a href="#science">The science</a>
            <a href="#proof">Why it matters</a>
            <a href="#reviews">Reviews</a>
          </nav>
          <div className="og-nav-cta">
            <a href="/signin" className="og-btn-ghost">Sign in</a>
            <button className="og-btn" onClick={onStart}>Start assessment</button>
          </div>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="og-hero">
        <div className="og-hero-copy og-reveal">
          <span className="og-eyebrow">Career fitment, backed by science</span>
          <h1 className="og-h1">The decision that shapes your <span className="og-hl">next 20 years</span> — made with clarity.</h1>
          <p className="og-lead">
            OneGrasp measures how you think, learn, feel and decide across eight
            research-backed dimensions, then maps you to the careers where you’ll
            genuinely thrive — not just the ones you’ve heard of.
          </p>
          <div className="og-hero-actions">
            <button className="og-btn og-btn-lg" onClick={onStart}>Take the assessment →</button>
            <a href="#science" className="og-btn-ghost og-btn-lg">See how it works</a>
          </div>
          <div className="og-hero-meta">
            <span>✓ 25–30 minutes</span>
            <span>✓ 8 dimensions</span>
            <span>✓ Personalised report</span>
          </div>
        </div>
        <div className="og-hero-visual og-reveal">
          <div className="og-hero-photo">
            <img src={IMG("photo-1523240795612-9a054b0db644", 900)} alt="Students planning their future" />
          </div>
          <div className="og-hero-float">
            <div className="og-hero-float-top"><Icon name="radar" size={16} /> Your profile</div>
            <RadarMock small />
          </div>
          <div className="og-hero-chip"><Icon name="match" size={15} /> Best fit: <b>Design &amp; Media</b></div>
        </div>
      </section>

      {/* ---------- stats strip ---------- */}
      <section className="og-strip og-reveal">
        {[
          { n: "8", l: "dimensions measured" },
          { n: "60+", l: "questions, tuned to your stage" },
          { n: "5", l: "scientific frameworks" },
          { n: "20 yrs", l: "of impact per choice" },
        ].map((s) => (
          <div key={s.l} className="og-strip-item">
            <div className="og-strip-n">{s.n}</div>
            <div className="og-strip-l">{s.l}</div>
          </div>
        ))}
      </section>

      {/* ---------- why it matters ---------- */}
      <section className="og-sec">
        <div className="og-sec-head og-reveal">
          <span className="og-kicker">Why this matters</span>
          <h2 className="og-h2">Most people pick a path with almost no data about themselves.</h2>
          <p className="og-sub">
            A career isn’t one decision — it’s tens of thousands of hours. Yet the
            choice is usually made on marks, peer pressure and guesswork. OneGrasp
            replaces the guesswork with a clear, structured read of who you are.
          </p>
        </div>
        <div className="og-facts">
          {FACTS.map((f, i) => (
            <div key={i} className="og-fact og-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="og-fact-viz">{f.viz}</div>
              <div className="og-fact-stat">{f.stat}</div>
              <div className="og-fact-text">{f.text}</div>
            </div>
          ))}
        </div>
        <p className="og-facts-note og-reveal">Figures reflect widely reported workforce-engagement and career-satisfaction research, shown to illustrate the cost of misalignment.</p>
      </section>

      {/* ---------- dimensions ---------- */}
      <section id="dimensions" className="og-sec og-alt">
        <div className="og-sec-head og-reveal">
          <span className="og-kicker">What we measure</span>
          <h2 className="og-h2">Eight dimensions. One complete picture.</h2>
          <p className="og-sub">Each dimension uses an established framework, so your report reads like a proper profile — not a personality quiz.</p>
        </div>
        <div className="og-dims">
          {DIMENSIONS.map((d, i) => (
            <div key={d.title} className="og-dim og-reveal" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              <div className="og-dim-img"><img src={d.img} alt={d.title} loading="lazy" /><span className="og-dim-ic"><Icon name={d.icon} size={20} /></span></div>
              <div className="og-dim-body">
                <div className="og-dim-t">{d.title}</div>
                <div className="og-dim-f">{d.framework}</div>
                <div className="og-dim-d">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- science / how we evaluate ---------- */}
      <section id="science" className="og-sec">
        <div className="og-sec-head og-reveal">
          <span className="og-kicker">How we evaluate</span>
          <h2 className="og-h2">A scientific method, end to end.</h2>
          <p className="og-sub">Every answer is scored against a validated model, combined, and translated into plain-English guidance.</p>
        </div>
        <div className="og-steps">
          {STEPS.map((s, i) => (
            <div key={s.t} className="og-step og-reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="og-step-n">{i + 1}</div>
              <div className="og-step-ic"><Icon name={s.ic} size={26} /></div>
              <div className="og-step-t">{s.t}</div>
              <div className="og-step-d">{s.d}</div>
              {i < STEPS.length - 1 && <div className="og-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- proof / statistics ---------- */}
      <section id="proof" className="og-sec og-alt">
        <div className="og-sec-head og-reveal">
          <span className="og-kicker">The cost of getting it wrong</span>
          <h2 className="og-h2">Alignment isn’t a luxury — it’s the difference.</h2>
        </div>
        <div className="og-proof">
          <div className="og-proof-card og-reveal">
            <h3 className="og-proof-t">Engagement by career fit</h3>
            <BarChart data={[
              { label: "Well matched", value: 82, color: "#2f9e6f" },
              { label: "Somewhat", value: 54, color: PRIMARY },
              { label: "Mismatched", value: 21, color: "#c0564f" },
            ]} />
            <p className="og-proof-note">People in roles that fit their strengths report far higher day-to-day engagement.</p>
          </div>
          <div className="og-proof-card og-reveal" style={{ transitionDelay: "90ms" }}>
            <h3 className="og-proof-t">Why students switch paths</h3>
            <PieChart data={[
              { label: "Wrong fit / interest", value: 42, color: PRIMARY },
              { label: "Poor guidance", value: 33, color: "#d99a2b" },
              { label: "Financial / other", value: 25, color: "#a4708a" },
            ]} />
            <p className="og-proof-note">A large share of course and career switches trace back to weak early self-knowledge.</p>
          </div>
        </div>
      </section>

      {/* ---------- report preview ---------- */}
      <section className="og-sec">
        <div className="og-report-row">
          <div className="og-report-viz og-reveal"><RadarMock /></div>
          <div className="og-report-copy og-reveal">
            <span className="og-kicker">Your report</span>
            <h2 className="og-h2">One clear map of all eight areas.</h2>
            <p className="og-sub">
              Your results come together in a single visual profile, with a plain
              explanation of each dimension and the careers that fit you best. Sign
              in any time to revisit it.
            </p>
            <ul className="og-check">
              <li>Ranked career matches with fit scores</li>
              <li>Personality, intelligences, EI, learning style &amp; motivators</li>
              <li>Strengths &amp; aptitude, scored objectively</li>
            </ul>
            <button className="og-btn og-btn-lg" onClick={onStart}>Build my report →</button>
          </div>
        </div>
      </section>

      {/* ---------- reviews ---------- */}
      <section id="reviews" className="og-sec og-alt">
        <div className="og-sec-head og-reveal">
          <span className="og-kicker">What people say</span>
          <h2 className="og-h2">Clarity people wish they’d had sooner.</h2>
        </div>
        <div className="og-reviews">
          {REVIEWS.map((r, i) => (
            <figure key={r.name} className="og-review og-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="og-stars">★★★★★</div>
              <blockquote className="og-review-q">“{r.quote}”</blockquote>
              <figcaption className="og-review-by">
                <span className="og-ava" style={{ background: r.color }}>{r.name.charAt(0)}</span>
                <span><b>{r.name}</b><span className="og-review-role">{r.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- final CTA ---------- */}
      <section className="og-cta og-reveal">
        <h2 className="og-cta-t">Your clearest career decision starts here.</h2>
        <p className="og-cta-s">Take 25 minutes today to save years of second-guessing.</p>
        <button className="og-btn og-btn-light og-btn-lg" onClick={onStart}>Start the assessment →</button>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="og-foot">
        <img src={LOGO} alt="OneGrasp" className="og-logo" style={{ height: 26 }} />
        <span>© {new Date().getFullYear()} OneGrasp · Career fitment, backed by science</span>
        <a href="/signin">Sign in</a>
      </footer>
    </div>
  );
}

/* ------------------------------- content ------------------------------- */
const DIMENSIONS = [
  { title: "Personality", framework: "Big Five + Temperament", icon: "personality", img: IMG("photo-1522071820081-009f0129c71c"), desc: "How you engage, decide, handle pressure and recharge." },
  { title: "Career Interests", framework: "Interest clustering", icon: "career_interest", img: IMG("photo-1541339907198-e08756dedf3f"), desc: "The fields and activities that genuinely pull you in." },
  { title: "Multiple Intelligences", framework: "Gardner’s 8 intelligences", icon: "multiple_intelligence", img: IMG("photo-1532094349884-543bc11b234d"), desc: "The ways you most naturally think and process the world." },
  { title: "Emotional Intelligence", framework: "EI scenarios", icon: "emotional_intelligence", img: IMG("photo-1552664730-d307ca884978"), desc: "Reading situations, managing yourself and relating to others." },
  { title: "Learning Style", framework: "VARK", icon: "learning_styles", img: IMG("photo-1503676260728-1c00da094a0b"), desc: "How you absorb new material fastest — visual, aural, reading, kinesthetic." },
  { title: "Motivators", framework: "Work-values model", icon: "motivators", img: IMG("photo-1454165804606-c3d57bc86b40"), desc: "What energises you — and what quietly burns you out." },
  { title: "Strengths", framework: "Reasoning + self-report", icon: "strengths", img: IMG("photo-1503387762-592deb58ef4e"), desc: "Problem-solving, critical thinking, decisions and communication." },
  { title: "Aptitude", framework: "Cognitive reasoning", icon: "aptitude", img: IMG("photo-1461749280684-dccba630e2f6"), desc: "Verbal, numerical, logical and spatial reasoning, scored objectively." },
];

const STEPS = [
  { ic: "answer", t: "Answer", d: "Stage-appropriate questions across all eight dimensions, with visuals and audio where it helps." },
  { ic: "score", t: "Score", d: "Each response is scored against its validated model — Big Five, Gardner, VARK, EI and more." },
  { ic: "combine", t: "Combine", d: "Dimensions are weighted and cross-checked to build one coherent profile." },
  { ic: "match", t: "Match", d: "Your interests and aptitudes map to specific career clusters and roles." },
  { ic: "explain", t: "Explain", d: "You get a clear report — a single visual map plus plain-English guidance." },
];

const FACTS = [
  { stat: "~2 in 3", text: "employees feel disengaged at work — most in roles that never fit them.", viz: <MiniDonut pct={66} color="#c0564f" /> },
  { stat: "50%+", text: "of students reconsider their stream or degree within the first two years.", viz: <MiniDonut pct={52} color="#d99a2b" /> },
  { stat: "90,000", text: "hours are spent working across an average lifetime — spend them well.", viz: <MiniDonut pct={100} color={PRIMARY} /> },
];

const REVIEWS = [
  { name: "Aarav", role: "Class 11 student", color: "#4f6b9e", quote: "I always assumed engineering. The report showed my strengths pointed to design and communication — it genuinely changed my plan." },
  { name: "Priya", role: "Graduate", color: "#2f9e6f", quote: "The eight-area chart made everything click. For the first time my choices felt based on something real, not just marks." },
  { name: "Rahul", role: "Parent", color: "#a4708a", quote: "As a parent this gave us a calm, structured conversation instead of arguments. Worth every minute." },
];

/* ------------------------------- visuals ------------------------------- */
function RadarMock({ small }: { small?: boolean }) {
  const vals = [72, 66, 84, 78, 61, 70, 74, 80];
  const n = vals.length, cx = 110, cy = 110, R = small ? 74 : 92;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const poly = (frac: number, arr?: number[]) =>
    vals.map((v, i) => { const r = R * (arr ? arr[i] / 100 : frac); return `${cx + r * Math.cos(ang(i))},${cy + r * Math.sin(ang(i))}`; }).join(" ");
  return (
    <svg viewBox="0 0 220 220" className="og-radar">
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={poly(f)} fill="none" stroke="#e7eaf0" strokeWidth="1" />)}
      {vals.map((_, i) => { const r = R; return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(ang(i))} y2={cy + r * Math.sin(ang(i))} stroke="#e7eaf0" strokeWidth="1" />; })}
      <polygon points={poly(1, vals)} fill="rgba(79,107,158,.2)" stroke={PRIMARY} strokeWidth="2.2" strokeLinejoin="round" />
      {vals.map((v, i) => { const r = R * (v / 100); return <circle key={i} cx={cx + r * Math.cos(ang(i))} cy={cy + r * Math.sin(ang(i))} r="3" fill={PRIMARY} />; })}
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  return (
    <div className="og-bc">
      {data.map((d) => (
        <div key={d.label} className="og-bc-row">
          <span className="og-bc-l">{d.label}</span>
          <div className="og-bc-track"><div className="og-bc-fill" style={{ width: `${d.value}%`, background: d.color }} /></div>
          <span className="og-bc-v">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0; const R = 60, C = 70;
  return (
    <div className="og-pie">
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
      <div className="og-pie-leg">
        {data.map((d) => <span key={d.label}><i style={{ background: d.color }} />{d.label} · {d.value}%</span>)}
      </div>
    </div>
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
.og-land{background:#fff;color:#1f2937;font-family:Inter,system-ui,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased}
.og-land *{box-sizing:border-box}
.og-reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.og-reveal.in{opacity:1;transform:none}

.og-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.86);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid #eef0f4}
.og-nav-in{max-width:1140px;margin:0 auto;display:flex;align-items:center;gap:20px;padding:13px 24px}
.og-logo{height:30px;width:auto;display:block}
.og-nav-links{display:flex;gap:24px;margin-left:22px;flex:1}
.og-nav-links a{color:#4b5563;text-decoration:none;font-size:14px;font-weight:600}
.og-nav-links a:hover{color:${PRIMARY}}
.og-nav-cta{display:flex;align-items:center;gap:10px}
@media(max-width:860px){.og-nav-links{display:none}}

.og-btn{background:${PRIMARY};color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;transition:transform .12s,box-shadow .2s;box-shadow:0 6px 18px rgba(79,107,158,.28)}
.og-btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(79,107,158,.34)}
.og-btn-lg{padding:14px 26px;font-size:15.5px;border-radius:12px}
.og-btn-light{background:#fff;color:${PRIMARY};box-shadow:0 10px 30px rgba(0,0,0,.14)}
.og-btn-ghost{background:transparent;color:#374151;border:1px solid #dfe3ea;border-radius:10px;padding:10px 16px;font-size:14px;font-weight:700;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center}
.og-btn-ghost:hover{border-color:#c4cbd6}

.og-hero{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;padding:70px 24px 60px}
@media(max-width:900px){.og-hero{grid-template-columns:1fr;padding:44px 24px 30px;gap:30px}}
.og-eyebrow{display:inline-block;background:#eef2f8;color:${PRIMARY};font-size:12.5px;font-weight:800;padding:6px 13px;border-radius:999px;letter-spacing:.2px}
.og-h1{font-size:clamp(30px,4.6vw,50px);line-height:1.08;font-weight:800;letter-spacing:-.02em;margin:16px 0 0}
.og-hl{color:${PRIMARY}}
.og-lead{font-size:17px;line-height:1.65;color:#5b6470;margin:18px 0 26px;max-width:520px}
.og-hero-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.og-hero-meta{display:flex;gap:18px;flex-wrap:wrap;margin-top:22px;color:#6b7280;font-size:13.5px;font-weight:600}

.og-strip{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:22px 24px;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4}
@media(max-width:700px){.og-strip{grid-template-columns:repeat(2,1fr);gap:22px}}
.og-strip-item{text-align:center}
.og-strip-n{font-size:30px;font-weight:800;color:${PRIMARY}}
.og-strip-l{font-size:13px;color:#6b7280;margin-top:2px}

.og-sec{max-width:1140px;margin:0 auto;padding:72px 24px}
.og-alt{max-width:none;background:#f7f8fb;border-top:1px solid #eef0f4;border-bottom:1px solid #eef0f4}
.og-alt>*{max-width:1140px;margin-left:auto;margin-right:auto}
.og-sec-head{max-width:720px;margin:0 auto 40px;text-align:center}
.og-kicker{font-size:12.5px;font-weight:800;text-transform:uppercase;letter-spacing:.9px;color:${PRIMARY}}
.og-h2{font-size:clamp(24px,3.4vw,34px);font-weight:800;letter-spacing:-.015em;margin:10px 0 0;line-height:1.15}
.og-sub{font-size:16px;line-height:1.65;color:#5b6470;margin:14px 0 0}

.og-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
@media(max-width:820px){.og-facts{grid-template-columns:1fr}}
.og-fact{background:#fff;border:1px solid #eceef2;border-radius:16px;padding:26px 24px;text-align:center;box-shadow:0 2px 12px rgba(30,41,59,.04)}
.og-fact-viz{display:flex;justify-content:center;margin-bottom:12px}
.og-fact-stat{font-size:30px;font-weight:800;color:#1f2937}
.og-fact-text{font-size:14.5px;color:#5b6470;line-height:1.55;margin-top:6px}
.og-facts-note{text-align:center;font-size:12.5px;color:#9aa1ad;margin:22px auto 0;max-width:620px}

.og-dims{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:980px){.og-dims{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.og-dims{grid-template-columns:1fr}}
.og-dim{background:#fff;border:1px solid #eceef2;border-radius:16px;overflow:hidden;transition:transform .18s,box-shadow .2s}
.og-dim:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(30,41,59,.08)}
.og-dim-img{position:relative;height:118px;overflow:hidden;background:#f0f2f5}
.og-dim-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}
.og-dim:hover .og-dim-img img{transform:scale(1.05)}
.og-dim-ic{position:absolute;left:14px;bottom:-17px;width:40px;height:40px;border-radius:11px;background:#fff;border:1px solid #eceef2;display:grid;place-items:center;color:${PRIMARY};box-shadow:0 6px 14px rgba(31,41,63,.12)}
.og-dim-body{padding:26px 18px 20px}
.og-dim-t{font-size:16px;font-weight:800}
.og-dim-f{font-size:12px;font-weight:700;color:${PRIMARY};margin:3px 0 8px}
.og-dim-d{font-size:13.5px;color:#5b6470;line-height:1.55}

.og-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;position:relative}
@media(max-width:900px){.og-steps{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.og-steps{grid-template-columns:1fr}}
.og-step{position:relative;background:#fff;border:1px solid #eceef2;border-radius:16px;padding:22px 18px;text-align:center}
.og-step-n{position:absolute;top:-12px;left:50%;transform:translateX(-50%);width:26px;height:26px;border-radius:50%;background:${PRIMARY};color:#fff;font-size:13px;font-weight:800;display:grid;place-items:center}
.og-step-ic{font-size:28px;margin:8px 0 8px}
.og-step-t{font-size:15.5px;font-weight:800}
.og-step-d{font-size:13px;color:#5b6470;line-height:1.5;margin-top:6px}
.og-step-arrow{display:none}

.og-proof{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:820px){.og-proof{grid-template-columns:1fr}}
.og-proof-card{background:#fff;border:1px solid #eceef2;border-radius:18px;padding:26px 24px;box-shadow:0 2px 12px rgba(30,41,59,.04)}
.og-proof-t{font-size:16px;font-weight:800;margin:0 0 18px}
.og-proof-note{font-size:13px;color:#6b7280;line-height:1.55;margin:16px 0 0}
.og-bc{display:flex;flex-direction:column;gap:14px}
.og-bc-row{display:flex;align-items:center;gap:12px}
.og-bc-l{width:112px;font-size:13.5px;color:#374151;font-weight:600;flex-shrink:0}
.og-bc-track{flex:1;height:14px;background:#eef1f5;border-radius:8px;overflow:hidden}
.og-bc-fill{height:100%;border-radius:8px;transition:width 1s ease}
.og-bc-v{width:38px;text-align:right;font-weight:800;font-size:13.5px}
.og-pie{display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:center}
.og-pie-leg{display:flex;flex-direction:column;gap:8px;font-size:13px;color:#374151}
.og-pie-leg span{display:flex;align-items:center;gap:8px}
.og-pie-leg i{width:11px;height:11px;border-radius:3px;display:inline-block}

.og-report-row{display:grid;grid-template-columns:.9fr 1.1fr;gap:44px;align-items:center}
@media(max-width:860px){.og-report-row{grid-template-columns:1fr;gap:24px}}
.og-report-viz{display:flex;justify-content:center;background:#f7f8fb;border:1px solid #eceef2;border-radius:20px;padding:26px}
.og-check{list-style:none;padding:0;margin:16px 0 24px;display:flex;flex-direction:column;gap:10px}
.og-check li{position:relative;padding-left:28px;font-size:14.5px;color:#374151;line-height:1.5}
.og-check li:before{content:"✓";position:absolute;left:0;top:0;width:19px;height:19px;background:#e9f4ef;color:#2f9e6f;border-radius:50%;font-size:12px;font-weight:800;display:grid;place-items:center}

.og-reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
@media(max-width:860px){.og-reviews{grid-template-columns:1fr}}
.og-review{background:#fff;border:1px solid #eceef2;border-radius:16px;padding:24px 22px;margin:0;box-shadow:0 2px 12px rgba(30,41,59,.04)}
.og-stars{color:#e0a92e;font-size:15px;letter-spacing:2px}
.og-review-q{font-size:14.5px;line-height:1.6;color:#374151;margin:12px 0 18px}
.og-review-by{display:flex;align-items:center;gap:11px}
.og-ava{width:40px;height:40px;border-radius:50%;color:#fff;font-weight:800;display:grid;place-items:center;font-size:16px;flex-shrink:0}
.og-review-by b{font-size:14px;display:block}
.og-review-role{font-size:12.5px;color:#8a919c}

.og-cta{background:linear-gradient(135deg,#42597f,#5a76a6);color:#fff;text-align:center;padding:64px 24px;margin-top:0}
.og-cta-t{font-size:clamp(24px,3.6vw,34px);font-weight:800;margin:0}
.og-cta-s{font-size:16px;opacity:.9;margin:12px 0 26px}

.og-foot{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:26px 24px;color:#8a919c;font-size:13px;flex-wrap:wrap}
.og-foot a{color:#5b6470;text-decoration:none;font-weight:600}

/* hero visual */
.og-hero-visual{position:relative}
.og-hero-photo{border-radius:22px;overflow:hidden;box-shadow:0 30px 70px rgba(31,41,63,.16);aspect-ratio:4/3.4;background:#eef1f5}
.og-hero-photo img{width:100%;height:100%;object-fit:cover;display:block}
.og-radar{width:180px;height:180px;display:block;margin:0 auto}
.og-hero-float{position:absolute;left:-18px;bottom:-18px;background:#fff;border:1px solid #eceef2;border-radius:16px;padding:12px 14px 8px;box-shadow:0 20px 44px rgba(31,41,63,.16);animation:ogFloat 6s ease-in-out infinite}
.og-hero-float-top{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:#6b7280;margin-bottom:2px}
@keyframes ogFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
.og-hero-chip{position:absolute;top:22px;right:-14px;display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #eceef2;border-radius:12px;padding:9px 13px;font-size:12.5px;color:#374151;font-weight:600;box-shadow:0 16px 34px rgba(31,41,63,.14);animation:ogFloat 6s ease-in-out infinite;animation-delay:1s}
.og-hero-chip b{color:${PRIMARY}}
.og-hero-float-top svg,.og-hero-chip svg{color:${PRIMARY}}
@media(max-width:600px){.og-hero-float{left:0;transform:none}.og-hero-chip{right:0}}
`;
