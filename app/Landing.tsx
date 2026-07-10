"use client";

/**
 * Landing — the marketing home page. Clean, light, zig-zag (alternating
 * visual / text) sections with accurate information about the assessment.
 * Self-contained (scoped `og-*` classes) so it doesn't clash with the rest
 * of the app. `onStart` runs the gated CTA (register or dashboard).
 */

import { useEffect, useRef } from "react";

const LOGO = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";

export default function Landing({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  // Scroll-reveal for the zig-zag rows.
  useEffect(() => {
    const els = root.current?.querySelectorAll(".og-reveal");
    if (!els || !("IntersectionObserver" in window)) {
      els?.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
      { threshold: 0.18 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="og-land">
      <style>{CSS}</style>

      {/* nav */}
      <header className="og-nav">
        <div className="og-nav-in">
          <img className="og-logo" src={LOGO} alt="OneGrasp" />
          <nav className="og-nav-links">
            <a href="#what">What it is</a>
            <a href="#how">How it works</a>
            <a href="#report">The report</a>
            <a href="#who">Who it's for</a>
          </nav>
          <button className="og-btn og-btn-fill" onClick={onStart}>Start free</button>
        </div>
      </header>

      {/* hero */}
      <section className="og-hero">
        <div className="og-hero-in">
          <div className="og-hero-copy og-reveal">
            <span className="og-kicker">Career fitment — engineered, not guessed</span>
            <h1>Find the career that truly fits you.</h1>
            <p>One guided assessment across personality, interests, intelligences and more — returning a ranked shortlist of careers built for you, with the reasons behind every match.</p>
            <div className="og-hero-cta">
              <button className="og-btn og-btn-fill og-lg" onClick={onStart}>Start free assessment →</button>
              <a className="og-btn og-btn-ghost og-lg" href="#report">See the report</a>
            </div>
            <div className="og-hero-meta">
              <span>⏱ ~25 minutes</span><span>🎓 Class 6 to professionals</span><span>🔒 Private to you</span>
            </div>
          </div>
          <div className="og-hero-art og-reveal">
            <ReportCard />
          </div>
        </div>
      </section>

      {/* ---- ZIG-ZAG ROWS ---- */}
      <section id="what" className="og-band">
        <Row art={<DimsArt />} reverse={false}
          kicker="What it is"
          title="One assessment. The whole person."
          body="Career fit isn't one number. OneGrasp reads several validated dimensions together to build a profile that's genuinely yours — not a generic label."
          points={["Personality & temperament", "Career interests", "Multiple intelligences", "Emotional intelligence", "Learning style", "Motivators"]} />
      </section>

      <section id="how" className="og-band og-alt">
        <Row art={<ExamArt />} reverse={true}
          kicker="How it works"
          title="Section by section, at your own pace."
          body="You move through one category at a time — answer every question in a section, then continue to the next. Different question styles suit each dimension: choose-one scenarios, situational judgment, and 1–10 sliders."
          points={["A short intro before each section", "A timer and a live question map", "Your answers saved as you go"]} />
      </section>

      <section id="report" className="og-band">
        <Row art={<MatchesArt />} reverse={false}
          kicker="The report"
          title="A ranked report you can act on."
          body="The moment you finish, you get a ranked shortlist of best-fit careers with a fit score for each — plus your strongest dimensions and where to grow. Saved to your account and emailed to you."
          points={["Top career matches with fit %", "Your strengths & interests", "Clear, age-appropriate next steps"]} />
      </section>

      {/* who */}
      <section id="who" className="og-who">
        <div className="og-who-in og-reveal">
          <span className="og-kicker">Who it's for</span>
          <h2>The right assessment for every stage.</h2>
          <p className="og-lead">Questions and outcomes adapt to where you are in life.</p>
          <div className="og-stages">
            {["Class 6–8", "Class 9–10", "Class 11–12", "Graduates", "Early professionals", "Experienced professionals"].map((s) => (
              <span key={s} className="og-stage">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="og-band">
        <div className="og-testi-in og-reveal">
          <div className="og-head-c"><span className="og-kicker">Trusted by families &amp; counsellors</span><h2>Clarity that changes decisions.</h2></div>
          <div className="og-quotes">
            {[
              { q: "For the first time my daughter could explain why a path suits her. It made our stream decision easy.", n: "Meera R.", r: "Parent · Class 10" },
              { q: "The top matches were spot on. Seeing strengths and gaps side by side told me exactly what to work on.", n: "Aditya S.", r: "Class 12 student" },
              { q: "We use it with every counselling student. Rigorous, clear, and the report does half our conversation.", n: "K. Prasad", r: "Career counsellor" },
            ].map((t) => (
              <figure key={t.n} className="og-quote">
                <blockquote>“{t.q}”</blockquote>
                <figcaption><span className="og-ava">{t.n.charAt(0)}</span><span><b>{t.n}</b><small>{t.r}</small></span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="og-final og-reveal">
        <h2>See where you fit.</h2>
        <p>Free to start · about 25 minutes · your report the moment you finish.</p>
        <button className="og-btn og-btn-fill og-lg" onClick={onStart}>Start free assessment →</button>
      </section>

      <footer className="og-foot">
        <img className="og-logo sm" src={LOGO} alt="OneGrasp" />
        <span>© {new Date().getFullYear()} OneGrasp — career fitment, engineered not guessed.</span>
      </footer>
    </div>
  );
}

/* --------------------------- zig-zag row -------------------------------- */
function Row({ art, reverse, kicker, title, body, points }: {
  art: React.ReactNode; reverse: boolean; kicker: string; title: string; body: string; points: string[];
}) {
  return (
    <div className={`og-row og-reveal${reverse ? " og-row-rev" : ""}`}>
      <div className="og-row-art">{art}</div>
      <div className="og-row-copy">
        <span className="og-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{body}</p>
        <ul className="og-points">
          {points.map((p) => <li key={p}><i>✓</i>{p}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* --------------------------- themed visuals ----------------------------- */
function ReportCard() {
  return (
    <div className="og-card og-float">
      <div className="og-card-top">
        <div><div className="og-card-k">Your career report</div><div className="og-card-h">Design &amp; Product</div></div>
        <svg className="og-donut" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="none" stroke="#eef0f4" strokeWidth="7" /><circle cx="30" cy="30" r="24" fill="none" stroke="#3f6fe0" strokeWidth="7" strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset="18" transform="rotate(-90 30 30)" /><text x="30" y="34" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d1d24">88%</text></svg>
      </div>
      {[["UX / Product Designer", 88], ["Architect", 81], ["Marketing Strategist", 76]].map(([t, v]) => (
        <div key={t as string} className="og-mrow"><div className="og-mrow-h"><b>{t}</b><span>{v}%</span></div><div className="og-track"><i style={{ width: `${v}%` }} /></div></div>
      ))}
    </div>
  );
}
function ExamArt() {
  return (
    <div className="og-card">
      <div className="og-exam-top"><div><div className="og-card-k" style={{ color: "rgba(255,255,255,.55)" }}>Career Interests</div><div className="og-card-h" style={{ color: "#fff" }}>Question 8 of 15</div></div><span className="og-time">⏱ 4:20</span></div>
      <div className="og-exam-b">
        <p className="og-q">If you had a free Saturday, what would you most want to do?</p>
        {[["A", "Draw, paint, write, or make music", false], ["B", "Set up a stall or sell something", true], ["C", "Help organize things with friends", false], ["D", "Explore outside or do an experiment", false]].map(([l, t, sel]) => (
          <div key={l as string} className={`og-opt${sel ? " sel" : ""}`}><span className="og-ab">{l}</span>{t}{sel ? <span className="og-ck">✓</span> : null}</div>
        ))}
      </div>
    </div>
  );
}
function DimsArt() {
  const dims = [["🧠", "Personality"], ["🧭", "Interests"], ["⚡", "Intelligences"], ["❤️", "Emotional"], ["📚", "Learning"], ["💎", "Motivators"]];
  return (
    <div className="og-dims">
      {dims.map(([ic, n]) => <div key={n} className="og-dim"><span className="og-dim-ic">{ic}</span><span>{n}</span></div>)}
    </div>
  );
}
function MatchesArt() {
  return (
    <div className="og-card">
      <div className="og-card-top"><div><div className="og-card-k">Career report</div><div className="og-card-h">Your top 5 matches</div></div></div>
      {[["UX / Product Designer", 88, "Very High"], ["Architect", 81, "High"], ["UX Researcher", 78, "High"], ["Marketing Strategist", 76, "Good"], ["Art Director", 72, "Good"]].map(([t, v, b]) => (
        <div key={t as string} className="og-mrow"><div className="og-mrow-h"><b>{t}</b><span>{v}% · {b}</span></div><div className="og-track"><i style={{ width: `${v}%` }} /></div></div>
      ))}
    </div>
  );
}

const CSS = `
.og-land{--ink:#1d1d24;--grey:#6b6c78;--grey2:#9698a3;--bg:#ffffff;--bg2:#f6f6f9;--hair:#e6e7ee;--blue:#3f6fe0;--red:#e0242e;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.55;letter-spacing:-.011em;}
.og-land *{box-sizing:border-box}
.og-land h1,.og-land h2{letter-spacing:-.03em;text-wrap:balance;margin:0}
.og-kicker{display:inline-block;font-size:13px;font-weight:700;letter-spacing:.02em;color:var(--blue);margin-bottom:12px}
.og-lead{font-size:19px;color:var(--grey);margin:0 auto;max-width:52ch}
.og-btn{display:inline-flex;align-items:center;gap:7px;font-size:15px;font-weight:600;padding:11px 20px;border-radius:999px;border:none;cursor:pointer;text-decoration:none;transition:.18s;font-family:inherit}
.og-btn.og-lg{font-size:16px;padding:14px 26px}
.og-btn-fill{background:var(--ink);color:#fff}.og-btn-fill:hover{transform:translateY(-1px);background:#000}
.og-btn-ghost{background:#fff;color:var(--ink);border:1px solid var(--hair)}
.og-logo{height:30px;width:auto;display:block}.og-logo.sm{height:24px;opacity:.9}

/* nav */
.og-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.75);backdrop-filter:saturate(180%) blur(18px);border-bottom:1px solid rgba(0,0,0,.06)}
.og-nav-in{max-width:1120px;margin:0 auto;padding:12px 28px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.og-nav-links{display:flex;gap:28px;font-size:14px;color:var(--grey)}
.og-nav-links a{color:var(--ink);text-decoration:none}.og-nav-links a:hover{color:var(--grey)}
.og-nav .og-btn-fill{padding:8px 16px;font-size:13.5px}

/* hero */
.og-hero{padding:70px 28px 40px}
.og-hero-in{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.og-hero h1{font-size:clamp(38px,5.4vw,64px);font-weight:700;line-height:1.04;margin-bottom:18px}
.og-hero p{font-size:19px;color:var(--grey);margin:0 0 28px;max-width:46ch}
.og-hero-cta{display:flex;gap:12px;flex-wrap:wrap}
.og-hero-meta{display:flex;gap:20px;margin-top:26px;font-size:13.5px;color:var(--grey2);flex-wrap:wrap}

/* bands */
.og-band{padding:84px 28px}
.og-band.og-alt{background:var(--bg2)}
.og-row{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.og-row-rev .og-row-art{order:2}
.og-row-copy h2{font-size:clamp(28px,3.6vw,40px);font-weight:700;margin:0 0 14px}
.og-row-copy p{font-size:17px;color:var(--grey);margin:0 0 20px}
.og-points{list-style:none;padding:0;margin:0;display:grid;gap:11px}
.og-points li{display:flex;gap:11px;align-items:center;font-size:15.5px;font-weight:500}
.og-points i{width:22px;height:22px;border-radius:50%;background:#eaf0fd;color:var(--blue);display:grid;place-items:center;font-size:12px;font-weight:800;font-style:normal;flex-shrink:0}

/* cards / visuals */
.og-card{background:#fff;border:1px solid var(--hair);border-radius:20px;box-shadow:0 4px 16px rgba(20,20,40,.05),0 30px 60px rgba(20,20,40,.08);padding:22px;overflow:hidden}
.og-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:16px}
.og-card-k{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--grey2);font-weight:700}
.og-card-h{font-size:18px;font-weight:700;margin-top:3px}
.og-donut{width:60px;height:60px;flex-shrink:0}
.og-mrow{margin-top:13px}
.og-mrow-h{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px}
.og-mrow-h b{font-weight:500}.og-mrow-h span{color:var(--blue);font-weight:600;font-variant-numeric:tabular-nums}
.og-track{height:7px;background:#eef0f4;border-radius:999px;overflow:hidden}.og-track i{display:block;height:100%;background:linear-gradient(90deg,#3f6fe0,#6d8ff0);border-radius:999px}
.og-exam-top{background:#22222b;margin:-22px -22px 16px;padding:15px 20px;display:flex;justify-content:space-between;align-items:center}
.og-time{font-size:12px;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:5px 11px}
.og-q{font-size:16px;font-weight:600;margin:0 0 14px;line-height:1.4}
.og-opt{display:flex;align-items:center;gap:12px;border:1.5px solid var(--hair);border-radius:12px;padding:11px 14px;margin-bottom:9px;font-size:14px}
.og-ab{width:26px;height:26px;border-radius:50%;border:1.5px solid #cfd2dc;display:grid;place-items:center;font-size:12px;font-weight:700;color:var(--grey)}
.og-opt.sel{border-color:var(--blue);background:#f2f6fe}.og-opt.sel .og-ab{background:var(--blue);border-color:var(--blue);color:#fff}
.og-ck{margin-left:auto;color:var(--blue);font-weight:800}
.og-dims{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.og-dim{background:#fff;border:1px solid var(--hair);border-radius:16px;padding:20px;display:flex;align-items:center;gap:13px;font-weight:600;font-size:15px;box-shadow:0 2px 10px rgba(20,20,40,.04)}
.og-dim-ic{width:42px;height:42px;border-radius:12px;background:#f1f4fb;display:grid;place-items:center;font-size:20px}

/* who */
.og-who{padding:90px 28px;background:var(--bg2);text-align:center}
.og-who-in{max-width:820px;margin:0 auto}
.og-who h2{font-size:clamp(28px,4vw,44px);font-weight:700;margin:0 0 12px}
.og-stages{display:flex;flex-wrap:wrap;gap:11px;justify-content:center;margin-top:32px}
.og-stage{background:#fff;border:1px solid var(--hair);border-radius:999px;padding:11px 20px;font-size:15px;font-weight:500}

/* testimonials */
.og-testi-in{max-width:1080px;margin:0 auto}
.og-head-c{text-align:center;max-width:52ch;margin:0 auto 44px}
.og-head-c h2{font-size:clamp(26px,3.6vw,40px);font-weight:700;margin:0}
.og-quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.og-quote{background:#fff;border:1px solid var(--hair);border-radius:20px;padding:28px;margin:0;box-shadow:0 2px 12px rgba(20,20,40,.04)}
.og-quote blockquote{margin:0 0 18px;font-size:16.5px;line-height:1.5}
.og-quote figcaption{display:flex;align-items:center;gap:12px}
.og-ava{width:40px;height:40px;border-radius:50%;background:#eceef4;display:grid;place-items:center;font-weight:700;color:var(--grey)}
.og-quote figcaption b{display:block;font-size:14px}.og-quote figcaption small{color:var(--grey);font-size:13px}

/* final + footer */
.og-final{text-align:center;padding:100px 28px;background:var(--bg2)}
.og-final h2{font-size:clamp(30px,4.4vw,52px);font-weight:700;margin:0 0 12px}
.og-final p{color:var(--grey);margin:0 0 26px;font-size:18px}
.og-foot{max-width:1120px;margin:0 auto;padding:30px 28px;display:flex;align-items:center;gap:14px;color:var(--grey2);font-size:13px;border-top:1px solid var(--hair);flex-wrap:wrap}

/* motion */
.og-reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
.og-reveal.in{opacity:1;transform:none}
@keyframes ogFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.og-float{animation:ogFloat 6s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.og-reveal{opacity:1;transform:none}.og-float{animation:none}}

@media(max-width:860px){
  .og-nav-links{display:none}
  .og-hero-in{grid-template-columns:1fr;gap:34px}
  .og-row{grid-template-columns:1fr;gap:30px}
  .og-row-rev .og-row-art{order:0}
  .og-quotes{grid-template-columns:1fr}
  .og-band{padding:60px 22px}
}
`;
