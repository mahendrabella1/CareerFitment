"use client";

/**
 * FullReport — the in-depth, multi-section career report. Cover → overview radar
 * → an eight-dimension deep dive (what it means, strengths, where you can grow,
 * recommendations, next step) → best-fit career DOMAINS (what they are, how to
 * join, India/abroad salaries, future scope, links) → a next-20-years roadmap.
 * Guided sticky sidebar, related imagery, charts, and scroll-in animations.
 * Print-friendly (the browser "Save as PDF" produces the downloadable report).
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { Icon } from "@/app/Icons";
import { DOMAINS, categoryDeepDive, roadmap, stageLabelOf } from "@/lib/report/knowledge";

const IMG = (id: string, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;
const BRAND = "https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";

type CatMeta = { label: string; icon: string; accent: string; img: string };
const CAT: Record<string, CatMeta> = {
  personality: { label: "Personality", icon: "personality", accent: "#4f6b9e", img: IMG("photo-1522071820081-009f0129c71c") },
  career_interest: { label: "Career Interests", icon: "career_interest", accent: "#7c6bd6", img: IMG("photo-1541339907198-e08756dedf3f") },
  multiple_intelligence: { label: "Multiple Intelligences", icon: "multiple_intelligence", accent: "#2f9e6f", img: IMG("photo-1532094349884-543bc11b234d") },
  emotional_intelligence: { label: "Emotional Intelligence", icon: "emotional_intelligence", accent: "#d98324", img: IMG("photo-1552664730-d307ca884978") },
  learning_styles: { label: "Learning Style", icon: "learning_styles", accent: "#3b82c4", img: IMG("photo-1503676260728-1c00da094a0b") },
  motivators: { label: "Motivators", icon: "motivators", accent: "#c0564f", img: IMG("photo-1454165804606-c3d57bc86b40") },
  strengths: { label: "Strengths", icon: "strengths", accent: "#7a9e3f", img: IMG("photo-1503387762-592deb58ef4e") },
  aptitude: { label: "Aptitude", icon: "aptitude", accent: "#5a76a6", img: IMG("photo-1461749280684-dccba630e2f6") },
};

export default function FullReport({ a, name }: { a: AssessmentSummary; name?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("overview");

  // Scroll-reveal + scrollspy.
  useEffect(() => {
    const revs = root.current?.querySelectorAll(".rv");
    if (revs && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revs.forEach((e) => io.observe(e));
      return () => io.disconnect();
    }
    revs?.forEach((e) => e.classList.add("in"));
  }, []);
  useEffect(() => {
    const secs = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-sec]") ?? []);
    if (!secs.length || !("IntersectionObserver" in window)) return;
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.getAttribute("data-sec") || "overview"); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    secs.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  const radar = a.radar ?? [];
  // Top career DOMAINS (broad fields) from the interest clusters.
  const topDomains = (a.themes ?? [])
    .filter((t) => t.score > 0 && DOMAINS[t.letter])
    .slice(0, 3)
    .map((t) => ({ ...DOMAINS[t.letter], fit: Math.round(t.score) }));
  const domainNames = topDomains.length ? topDomains : [{ ...DOMAINS.B, fit: 0 }];
  const topDomain = domainNames[0];
  const phases = roadmap(stageLabelOf(a.journeyCode), topDomain.name);

  const nav = [
    { id: "overview", label: "Overview", icon: "radar" },
    { id: "dimensions", label: "Your 8 dimensions", icon: "clusters" },
    { id: "domains", label: "Best-fit careers", icon: "match" },
    { id: "roadmap", label: "Next 20 years", icon: "explain" },
  ];

  return (
    <div ref={root} className="fr">
      <style>{CSS}</style>

      {/* cover */}
      <section data-sec="overview" className="fr-cover rv">
        <div className="fr-cover-l">
          <span className="fr-kick">OneGrasp · Career Report</span>
          <h1 className="fr-cover-h">Hi {name || "there"}, your best-fit direction is <span style={{ color: "#ffd7a6" }}>{topDomain.name}</span>.</h1>
          <p className="fr-cover-p">{a.summary || "A complete read of how you think, learn, feel and decide — and the career paths where you'll do your best work."}</p>
          <div className="fr-cover-meta">
            {a.overallFitmentPct != null && <span className="fr-cover-chip"><b>{a.overallFitmentPct}%</b> top fit</span>}
            {a.outcomeLabel && <span className="fr-cover-chip">{a.outcomeLabel}</span>}
            <span className="fr-cover-chip">Completed {new Date(a.completedAt).toLocaleDateString()}</span>
          </div>
          <button className="fr-btn og-noprint" onClick={() => window.print()}><Icon name="explain" size={16} /> Download / print PDF</button>
        </div>
        <div className="fr-cover-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND} alt="Your career direction" />
        </div>
      </section>

      <div className="fr-body">
        {/* guided sidebar */}
        <aside className="fr-side og-noprint">
          <div className="fr-side-label">Report</div>
          {nav.map((n) => (
            <a key={n.id} href={`#fr-${n.id}`} className={`fr-side-link${active === n.id ? " on" : ""}`}>
              <Icon name={n.icon} size={16} /> {n.label}
            </a>
          ))}
          <div className="fr-side-note">This report is a guide, not a verdict — use it to explore with confidence.</div>
        </aside>

        <main className="fr-main">
          {/* overview radar */}
          <section id="fr-overview" className="fr-card rv">
            <SecHead icon="radar" accent="#4f6b9e" kick="Overview" title="Your profile at a glance" />
            <div className="fr-overview">
              <div className="fr-radar-wrap"><Radar data={radar} /></div>
              <div className="fr-overview-list">
                {radar.map((r) => (
                  <div key={r.key} className="fr-ov-row">
                    <span className="fr-ov-ic" style={{ color: CAT[r.key]?.accent }}><Icon name={CAT[r.key]?.icon || "match"} size={15} /></span>
                    <span className="fr-ov-name">{r.label}</span>
                    <div className="fr-bar"><i style={{ width: `${clamp(r.score)}%`, background: CAT[r.key]?.accent }} /></div>
                    <b className="fr-ov-score">{r.score}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* dimensions deep dive */}
          <h2 id="fr-dimensions" data-sec="dimensions" className="fr-h2 rv">Your eight dimensions, in depth</h2>
          {radar.map((r, i) => {
            const meta = CAT[r.key]; if (!meta) return null;
            const dd = categoryDeepDive(r.key, a);
            return (
              <section key={r.key} className={`fr-dim fr-card rv ${i % 2 ? "from-right" : "from-left"}`}>
                <div className="fr-dim-banner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={meta.img} alt="" />
                  <div className="fr-dim-banner-o" style={{ background: `linear-gradient(90deg, ${meta.accent}ee, ${meta.accent}88 60%, transparent)` }} />
                  <div className="fr-dim-banner-t">
                    <span className="fr-dim-ic"><Icon name={meta.icon} size={22} /></span>
                    <div>
                      <div className="fr-dim-name">{meta.label}</div>
                      <div className="fr-dim-score">{r.score}<span>/100 · {bandLabel(r.score)}</span></div>
                    </div>
                  </div>
                </div>
                <div className="fr-dim-body">
                  <div className="fr-bar big"><i style={{ width: `${clamp(r.score)}%`, background: meta.accent }} /></div>
                  <p className="fr-dim-meaning">{dd.meaning}</p>
                  <div className="fr-dim-grid">
                    <Block accent="#2f9e6f" icon="strengths" title="Your strengths" items={dd.strengths} />
                    <Block accent="#d98324" icon="pulse" title="Where you can grow" items={dd.grow} />
                  </div>
                  <Block accent={meta.accent} icon="explain" title="Recommendations" items={dd.recommend} wide />
                  {dd.next && <div className="fr-next"><Icon name="chevronRight" size={15} /> <span><b>Next step:</b> {dd.next}</span></div>}
                </div>
              </section>
            );
          })}

          {/* career domains */}
          <h2 id="fr-domains" data-sec="domains" className="fr-h2 rv">Career domains that fit you</h2>
          <p className="fr-lead rv">We map you to broad <b>domains</b> — not one narrow job — so you keep options open. Here are your strongest fits, with how to enter, what they pay in India and abroad, and where to start.</p>
          {domainNames.map((d, i) => (
            <section key={d.key} className={`fr-domain fr-card rv ${i % 2 ? "from-right" : "from-left"}`}>
              <div className="fr-domain-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt="" className="fr-domain-img" />
                <div className="fr-domain-head-t">
                  <span className="fr-domain-rank">#{i + 1} best fit{d.fit ? ` · ${d.fit}%` : ""}</span>
                  <div className="fr-domain-name">{d.name}</div>
                  <div className="fr-domain-tag">{d.tagline}</div>
                </div>
              </div>
              <div className="fr-domain-body">
                <p className="fr-domain-what">{d.whatItIs}</p>
                <div className="fr-domain-grid">
                  <InfoList icon="match" title="Example roles" items={d.roles} accent="#4f6b9e" />
                  <InfoList icon="strengths" title="Skills that matter" items={d.skills} accent="#2f9e6f" />
                </div>
                <InfoList icon="clusters" title="How to get in" items={d.howToJoin} accent="#7c6bd6" ordered wide />
                <div className="fr-sal">
                  <div className="fr-sal-box"><div className="fr-sal-k">💰 India</div><div className="fr-sal-v">{d.salaryIndia}</div></div>
                  <div className="fr-sal-box"><div className="fr-sal-k">🌍 Abroad</div><div className="fr-sal-v">{d.salaryAbroad}</div></div>
                </div>
                <div className="fr-scope"><Icon name="explain" size={15} /> <span><b>Future scope:</b> {d.futureScope}</span></div>
                <div className="fr-links">
                  {d.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="fr-link">{l.label} ↗</a>
                  ))}
                </div>
              </div>
            </section>
          ))}
          <div className="fr-fallback rv">
            <b>If these don’t click,</b> that’s useful too. Your profile also leans toward{" "}
            {(a.themes ?? []).slice(3, 5).map((t) => DOMAINS[t.letter]?.name).filter(Boolean).join(" and ") || "adjacent fields"} — explore those before ruling anything out. The right domain is the one that fits how you think and what drives you, not just the highest score.
          </div>

          {/* roadmap */}
          <h2 id="fr-roadmap" data-sec="roadmap" className="fr-h2 rv">Your next 20 years</h2>
          <p className="fr-lead rv">A simple, stage-by-stage plan from where you are now (<b>{stageLabelOf(a.journeyCode)}</b>) toward a career in <b>{topDomain.name}</b>. Adjust as you learn more about yourself.</p>
          <div className="fr-road">
            {phases.map((ph, i) => (
              <div key={ph.period} className="fr-phase fr-card rv" style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="fr-phase-dot">{i + 1}</div>
                <div className="fr-phase-period">{ph.period}</div>
                <div className="fr-phase-title">{ph.title}</div>
                <ul className="fr-phase-list">{ph.points.map((p, k) => <li key={k}>{p}</li>)}</ul>
              </div>
            ))}
          </div>

          <section className="fr-close rv">
            <h3>Remember: this is a compass, not a cage.</h3>
            <p>Careers rarely go in straight lines. Use this report to make your next move with more confidence — then keep learning about yourself.</p>
            <div className="fr-close-cta og-noprint">
              <button className="fr-btn" onClick={() => window.print()}><Icon name="explain" size={16} /> Download / print PDF</button>
              <Link href="/?begin=1" className="fr-btn ghost">Retake assessment</Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------- pieces -------------------------------- */
function SecHead({ icon, accent, kick, title }: { icon: string; accent: string; kick: string; title: string }) {
  return (
    <div className="fr-sec-head">
      <span className="fr-sec-ic" style={{ background: `${accent}1a`, color: accent }}><Icon name={icon} size={18} /></span>
      <div><div className="fr-sec-kick" style={{ color: accent }}>{kick}</div><div className="fr-sec-title">{title}</div></div>
    </div>
  );
}

function Block({ icon, title, items, accent, wide }: { icon: string; title: string; items: string[]; accent: string; wide?: boolean }) {
  if (!items.length) return null;
  return (
    <div className="fr-block" style={{ gridColumn: wide ? "1 / -1" : undefined }}>
      <div className="fr-block-h"><span style={{ color: accent }}><Icon name={icon} size={15} /></span> {title}</div>
      <ul className="fr-block-l">{items.map((it, i) => <li key={i} style={{ "--c": accent } as CSSProperties}>{it}</li>)}</ul>
    </div>
  );
}

function InfoList({ icon, title, items, accent, ordered, wide }: { icon: string; title: string; items: string[]; accent: string; ordered?: boolean; wide?: boolean }) {
  if (!items.length) return null;
  return (
    <div className="fr-block" style={{ gridColumn: wide ? "1 / -1" : undefined }}>
      <div className="fr-block-h"><span style={{ color: accent }}><Icon name={icon} size={15} /></span> {title}</div>
      {ordered ? (
        <ol className="fr-block-ol">{items.map((it, i) => <li key={i} style={{ "--c": accent } as CSSProperties}>{it}</li>)}</ol>
      ) : (
        <ul className="fr-block-l">{items.map((it, i) => <li key={i} style={{ "--c": accent } as CSSProperties}>{it}</li>)}</ul>
      )}
    </div>
  );
}

function Radar({ data }: { data: { key: string; label: string; score: number }[] }) {
  const n = data.length || 8, cx = 150, cy = 150, R = 108;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, rad: number) => `${cx + rad * Math.cos(ang(i))},${cy + rad * Math.sin(ang(i))}`;
  const ring = (f: number) => data.map((_, i) => pt(i, R * f)).join(" ");
  const poly = data.map((d, i) => pt(i, R * (d.score / 100))).join(" ");
  return (
    <svg viewBox="0 0 300 300" className="fr-radar">
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={ring(f)} fill="none" stroke="#e6eaf1" strokeWidth="1" />)}
      {data.map((_, i) => { const [x, y] = pt(i, R).split(","); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e6eaf1" strokeWidth="1" />; })}
      <polygon points={poly} fill="rgba(79,107,158,.2)" stroke="#4f6b9e" strokeWidth="2.2" strokeLinejoin="round" />
      {data.map((d, i) => { const [x, y] = pt(i, R * (d.score / 100)).split(","); return <circle key={i} cx={x} cy={y} r="3.5" fill={CAT[d.key]?.accent || "#4f6b9e"} />; })}
    </svg>
  );
}

const clamp = (n: number) => Math.max(4, Math.min(100, Math.round(n)));
const bandLabel = (p: number) => (p >= 80 ? "Standout" : p >= 65 ? "Strong" : p >= 50 ? "Solid" : p >= 35 ? "Emerging" : "Developing");

/* -------------------------------- styles ------------------------------- */
const CSS = `
.fr{font-family:'Poppins',Inter,system-ui,sans-serif;color:#1f2937}
.fr *{box-sizing:border-box}
.rv{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
.rv.from-left{transform:translateX(-46px)}
.rv.from-right{transform:translateX(46px)}
.rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.rv{transition:opacity .3s;transform:none}}

.fr-cover{display:grid;grid-template-columns:1.15fr .85fr;gap:26px;align-items:center;background:linear-gradient(135deg,#2f4062,#5a76a6);color:#fff;border-radius:20px;padding:30px 32px;margin-bottom:18px;overflow:hidden}
@media(max-width:760px){.fr-cover{grid-template-columns:1fr;padding:22px 18px}.fr-cover-r{display:none}}
.fr-kick{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:.8}
.fr-cover-h{font-size:clamp(22px,3.3vw,30px);font-weight:700;line-height:1.18;margin:10px 0 0}
.fr-cover-p{font-size:14.5px;line-height:1.6;opacity:.92;margin:12px 0 0;max-width:520px}
.fr-cover-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.fr-cover-chip{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:5px 13px;font-size:12.5px;font-weight:600}
.fr-cover-chip b{font-weight:800}
.fr-cover-r img{width:100%;border-radius:14px;display:block;box-shadow:0 18px 40px rgba(0,0,0,.28)}
.fr-btn{display:inline-flex;align-items:center;gap:7px;background:#fff;color:#2f4062;border:none;border-radius:11px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;margin-top:18px;text-decoration:none}
.fr-btn.ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5)}

.fr-body{display:grid;grid-template-columns:210px 1fr;gap:22px;align-items:start}
@media(max-width:900px){.fr-body{grid-template-columns:1fr}.fr-side{display:none}}
.fr-side{position:sticky;top:18px;background:#fff;border:1px solid #eceef3;border-radius:16px;padding:14px 12px}
.fr-side-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:#9aa1ad;margin:2px 8px 8px}
.fr-side-link{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;color:#475569;text-decoration:none;font-size:13.5px;font-weight:600}
.fr-side-link.on,.fr-side-link:hover{background:#eef2f8;color:#2f4062}
.fr-side-note{font-size:11.5px;color:#94a3b8;line-height:1.5;margin:12px 8px 2px;padding-top:12px;border-top:1px solid #f1f5f9}

.fr-main{min-width:0;display:flex;flex-direction:column;gap:16px}
.fr-card{background:#fff;border:1px solid #eceef3;border-radius:16px;box-shadow:0 2px 12px rgba(30,41,59,.04);overflow:hidden}
.fr-h2{font-size:22px;font-weight:700;color:#0f172a;margin:14px 2px 2px}
.fr-lead{font-size:14.5px;line-height:1.65;color:#475569;margin:0 2px}

.fr-sec-head{display:flex;align-items:center;gap:11px;padding:18px 20px 0}
.fr-sec-ic{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;flex-shrink:0}
.fr-sec-kick{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.6px}
.fr-sec-title{font-size:17px;font-weight:800;color:#0f172a}

.fr-overview{display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:center;padding:16px 20px 22px}
@media(max-width:620px){.fr-overview{grid-template-columns:1fr}}
.fr-radar-wrap{display:flex;justify-content:center}
.fr-radar{width:100%;max-width:280px;height:auto}
.fr-overview-list{display:flex;flex-direction:column;gap:9px}
.fr-ov-row{display:flex;align-items:center;gap:10px;font-size:13px}
.fr-ov-ic{display:inline-flex}
.fr-ov-name{width:140px;flex-shrink:0;color:#334155;font-weight:600}
.fr-ov-score{width:28px;text-align:right;color:#0f172a;font-weight:800}
.fr-bar{flex:1;height:8px;background:#eef1f5;border-radius:6px;overflow:hidden}
.fr-bar i{display:block;height:100%;border-radius:6px}
.fr-bar.big{height:12px;margin-bottom:14px}

.fr-dim-banner{position:relative;height:132px;overflow:hidden}
.fr-dim-banner img{width:100%;height:100%;object-fit:cover;display:block}
.fr-dim-banner-o{position:absolute;inset:0}
.fr-dim-banner-t{position:absolute;left:22px;bottom:16px;display:flex;align-items:center;gap:12px;color:#fff}
.fr-dim-ic{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.4);display:grid;place-items:center}
.fr-dim-name{font-size:19px;font-weight:800}
.fr-dim-score{font-size:22px;font-weight:800;line-height:1.1}
.fr-dim-score span{font-size:12.5px;font-weight:600;opacity:.9}
.fr-dim-body{padding:20px 22px 22px}
.fr-dim-meaning{font-size:14.5px;line-height:1.65;color:#334155;margin:0 0 16px}
.fr-dim-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
@media(max-width:560px){.fr-dim-grid{grid-template-columns:1fr}}
.fr-block{background:#f8fafc;border:1px solid #eef1f5;border-radius:12px;padding:14px 16px}
.fr-block-h{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;color:#0f172a;margin-bottom:8px}
.fr-block-l,.fr-block-ol{margin:0;padding:0 0 0 4px;list-style:none;display:flex;flex-direction:column;gap:6px}
.fr-block-l li{position:relative;padding-left:18px;font-size:13.5px;line-height:1.5;color:#475569}
.fr-block-l li:before{content:"";position:absolute;left:2px;top:7px;width:7px;height:7px;border-radius:50%;background:var(--c,#4f6b9e)}
.fr-block-ol{counter-reset:s;padding-left:0}
.fr-block-ol li{counter-increment:s;position:relative;padding-left:26px;font-size:13.5px;line-height:1.5;color:#475569}
.fr-block-ol li:before{content:counter(s);position:absolute;left:0;top:0;width:18px;height:18px;border-radius:50%;background:var(--c,#4f6b9e);color:#fff;font-size:10.5px;font-weight:800;display:grid;place-items:center}
.fr-next{display:flex;gap:8px;align-items:flex-start;background:#eef7f1;border:1px solid #d6ebdf;border-radius:11px;padding:12px 14px;font-size:13.5px;line-height:1.5;color:#1c5a3a;margin-top:6px}
.fr-next svg{color:#2f9e6f;flex-shrink:0;margin-top:2px}

.fr-domain-head{position:relative;display:flex;align-items:flex-end;min-height:150px}
.fr-domain-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fr-domain-head-t{position:relative;padding:20px 22px;color:#fff;width:100%;background:linear-gradient(0deg,rgba(15,20,35,.82),rgba(15,20,35,.25) 70%,transparent)}
.fr-domain-rank{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:3px 11px;font-size:11.5px;font-weight:700;margin-bottom:6px}
.fr-domain-name{font-size:22px;font-weight:800}
.fr-domain-tag{font-size:13.5px;opacity:.92}
.fr-domain-body{padding:20px 22px 22px}
.fr-domain-what{font-size:14.5px;line-height:1.65;color:#334155;margin:0 0 16px}
.fr-domain-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
@media(max-width:560px){.fr-domain-grid{grid-template-columns:1fr}}
.fr-sal{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}
@media(max-width:480px){.fr-sal{grid-template-columns:1fr}}
.fr-sal-box{background:linear-gradient(135deg,#eef2fb,#f6f8fd);border:1px solid #e3e9f5;border-radius:12px;padding:13px 16px}
.fr-sal-k{font-size:12px;font-weight:800;color:#64748b;margin-bottom:3px}
.fr-sal-v{font-size:13.5px;font-weight:700;color:#0f172a;line-height:1.4}
.fr-scope{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;line-height:1.55;color:#475569;background:#fbf7ee;border:1px solid #f0e6cf;border-radius:11px;padding:12px 14px;margin-bottom:14px}
.fr-scope svg{color:#d98324;flex-shrink:0;margin-top:2px}
.fr-links{display:flex;flex-wrap:wrap;gap:8px}
.fr-link{background:#eef2f8;border:1px solid #e0e7f1;border-radius:9px;padding:7px 13px;font-size:12.5px;font-weight:700;color:#3f5b8b;text-decoration:none}
.fr-link:hover{background:#e2e9f5}
.fr-fallback{background:#fff;border:1px dashed #d7dbe6;border-radius:14px;padding:16px 20px;font-size:13.5px;line-height:1.6;color:#475569}

.fr-road{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:820px){.fr-road{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.fr-road{grid-template-columns:1fr}}
.fr-phase{position:relative;padding:22px 18px 18px}
.fr-phase-dot{position:absolute;top:-13px;left:18px;width:28px;height:28px;border-radius:50%;background:#4f6b9e;color:#fff;font-weight:800;font-size:13px;display:grid;place-items:center;box-shadow:0 6px 14px rgba(79,107,158,.3)}
.fr-phase-period{font-size:12px;font-weight:800;color:#4f6b9e;margin-top:6px}
.fr-phase-title{font-size:15px;font-weight:800;color:#0f172a;margin:2px 0 8px}
.fr-phase-list{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:6px}
.fr-phase-list li{font-size:12.5px;line-height:1.45;color:#475569}

.fr-close{background:linear-gradient(135deg,#2f4062,#5a76a6);color:#fff;border-radius:16px;padding:26px 24px;text-align:center;margin-top:6px}
.fr-close h3{font-size:19px;font-weight:800;margin:0 0 6px}
.fr-close p{font-size:14px;opacity:.9;line-height:1.6;margin:0 auto;max-width:520px}
.fr-close-cta{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px}

@media print{
  .og-noprint{display:none !important}
  .fr-side{display:none !important}
  .fr-body{grid-template-columns:1fr !important}
  .rv{opacity:1 !important;transform:none !important}
  .fr-card,.fr-cover,.fr-close{break-inside:avoid}
}
`;
