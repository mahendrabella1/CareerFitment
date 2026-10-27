"use client";

/**
 * Landing - the marketing home, rendered by app/assessment-experience.tsx
 * when nothing is in progress. `onStart` is its gated start: register when
 * signed out, the dashboard when signed in (professionals go on to the
 * stress check from there).
 *
 * Order: a hero (the hook on the left, the dashboard tour playing on the
 * right with a clickable chapter timeline, and a one-line "built for"); the
 * report; photos from our sessions; the four steps as one story picture;
 * then zig-zag rows (text one side, a video playing on the other) for every
 * feature and schools; the decision tools, professionals, trust, FAQ.
 *
 * Motion costs nothing to load: sections stack like pages (rounded top edges
 * that overlap) and lift as they scroll in (CSS scroll-driven animation where
 * the browser has it), and content slides in once as it is reached
 * (useReveal, one IntersectionObserver). Nothing moves for people who asked
 * their device for less motion.
 *
 * Videos load only when played or on screen (components/home/HomeVideo.tsx);
 * the words, numbers and photo captions are in components/home/homeContent.ts.
 * Same look as the dashboard and sign-in: warm off-white, ink text and
 * buttons, OneGrasp red for accents.
 */

import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import { Icon } from "@/app/Icons";
import { featureArt } from "@/lib/features/catalog";
import { HomeVideo, type HomeVideoHandle } from "@/components/home/HomeVideo";
import { StoryGrid } from "@/components/home/StoryGrid";
import {
  CONTACT, DIMENSIONS, FACTS, FAQ, FEATURES, REPORT_VIDEO, SCHOOLS_VIDEO, SCHOOL_POINTS,
  STAGES, STEPS, TOOLS, TOUR, TOUR_CHAPTERS, TOUR_END,
} from "@/components/home/homeContent";

type TimeSink = MutableRefObject<((t: number) => void) | null>;

export default function Landing({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tour = useRef<HomeVideoHandle>(null);
  // The tour reports its time straight to the chapter bar, so only the bar re-renders.
  const tourTime: TimeSink = useRef(null);
  useReveal(root);

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  // Played inside the click, so phones allow sound.
  const watchWithSound = () => {
    document.getElementById("tour")?.scrollIntoView({ behavior: "smooth", block: "center" });
    tour.current?.playFrom(0);
  };

  return (
    <div ref={root} className="hm">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="hm-nav">
        <div className="hm-in hm-nav-in">
          <a href="/" className="hm-brand" aria-label="OneGrasp home">
            {/* A trimmed, transparent copy - the shared logo PNG has wide built-in padding. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/logo.png" alt="OneGrasp" width={75} height={44} />
          </a>
          <nav className="hm-links" aria-label="On this page">
            <a href="#stories">Our work</a>
            <a href="#how">How it works</a>
            <a href="#inside">What&apos;s inside</a>
            <a href="#schools">For schools</a>
            <a href="#professionals">Professionals</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="hm-nav-cta">
            <a href="/signin" className="hm-btn hm-btn-ghost">Sign in</a>
            <button type="button" className="hm-btn hm-btn-pri" onClick={onStart}>
              <span className="hm-hide-sm">Start assessment</span><span className="hm-show-sm">Start</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- hero: the promise, the tour playing, who it's for ---------- */}
        <section className="hm-hero">
          <div className="hm-in">
            {/* Text left, the tour playing right - both on the first screen. */}
            <div className="hm-hero-grid">
              <div className="hm-hero-copy">
                <span className="hm-kicker hm-enter">For Class 6 to undergraduates</span>
                <h1 className="hm-enter hm-d1">Stop guessing your career. <em>Start knowing it.</em></h1>
                <p className="hm-lead hm-enter hm-d2">
                  One test shows how you think, learn and work - and the careers you&apos;re built for.
                  Then your report, your roadmap and every tool to get there, in one dashboard.
                </p>
                <div className="hm-actions hm-enter hm-d3">
                  <button type="button" className="hm-btn hm-btn-pri hm-btn-lg" onClick={onStart}>Take the test now <Icon name="arrowRight" size={17} /></button>
                  <a className="hm-btn hm-btn-lg" href="#inside" onClick={(e) => { e.preventDefault(); goTo("inside"); }}>
                    See what you get <span className="hm-down"><Icon name="arrowRight" size={15} /></span>
                  </a>
                </div>
                <p className="hm-assure hm-enter hm-d3"><Icon name="check" size={15} stroke={2.4} /> Your report is ready the moment you finish</p>
                <ul className="hm-facts hm-enter hm-d4">
                  {FACTS.map((x) => <li key={x.l}><b>{x.n}</b>{x.l}</li>)}
                </ul>
              </div>

              <div id="tour" className="hm-hero-video hm-enter hm-d2">
                <HomeVideo ref={tour} video={TOUR} title="OneGrasp dashboard tour" auto eager onTime={(t) => tourTime.current?.(t)} />
                <ChapterBar sink={tourTime} onPick={(t) => tour.current?.seek(t)} />
              </div>
            </div>

            <div className="hm-built" aria-label="Who it's for">
              <span className="hm-built-lbl">Built for</span>
              <div className="hm-built-row">
                {STAGES.map((s, i) => {
                  const inner = (
                    <>
                      <span className="hm-ic hm-ic-sm"><Icon name={s.icon} size={16} /></span>
                      <span><b>{s.title}</b><small>{s.short}</small></span>
                    </>
                  );
                  const props = { className: "hm-built-i", title: s.text, "data-rv": "", style: { transitionDelay: `${i * 60}ms` } };
                  return s.school
                    ? <a key={s.key} href="#schools" {...props}>{inner}</a>
                    : <button key={s.key} type="button" onClick={onStart} {...props}>{inner}</button>;
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- the report: right after the hero ---------- */}
        <section id="report" className="hm-sec hm-sheet hm-bg-white">
          <div className="hm-in hm-zz is-even">
            <div className="hm-zz-copy" data-rv="">
              <span className="hm-kicker">Your report</span>
              <h2>A report that explains you - and shows the way.</h2>
              <p className="hm-sub">Built from your own answers: your eight dimensions in plain words, then the careers that fit you and the road to them.</p>
              <ul className="hm-dims">{DIMENSIONS.map((d) => <li key={d}>{d}</li>)}</ul>
              <div className="hm-views">
                <span className="hm-views-lbl">From Class 11, three views of your career</span>
                <ul>
                  <li title="The careers that fit you">Career Fitment</li>
                  <li title="The careers that fit your stream">Career Suitability</li>
                  <li title="The road to the career you chose">Career Selector</li>
                </ul>
              </div>
            </div>
            <div className="hm-zz-media" data-rv="right"><HomeVideo video={REPORT_VIDEO} title="The Career Fitment report, explained" auto /></div>
          </div>
        </section>

        {/* ---------- photos from our sessions ---------- */}
        <section id="stories" className="hm-sec hm-sheet hm-bg-warm">
          <div className="hm-in">
            <Head kicker="Our work" title="From our sessions with schools and colleges." sub="Assessment days, career talks, workshops and one-to-one guidance. Open any photo to see it larger." />
            <StoryGrid />
          </div>
        </section>

        {/* ---------- how it works, as one story ---------- */}
        <section id="how" className="hm-sec hm-sheet hm-bg-page">
          <div className="hm-in">
            <Head kicker="How it works" title="From one test to a plan you can follow." />
            <figure className="hm-story" data-rv="zoom">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/story.webp" srcSet="/home/story-820.webp 820w, /home/story.webp 1600w" sizes="(max-width: 900px) 100vw, 1132px"
                alt="A student takes the test, reads their report, explores the dashboard and climbs towards a flag" width={1600} height={583} loading="lazy" decoding="async" />
            </figure>
            <ol className="hm-steps">
              {STEPS.map((s, i) => (
                <li key={s.t} data-rv="" style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="hm-step-n">{i + 1}</span>
                  <div><h3>{s.t}</h3><p>{s.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- every feature: zig-zag rows, each with its own video ---------- */}
        <section id="inside" className="hm-sec hm-sheet hm-bg-warm">
          <div className="hm-in">
            <Head kicker="What's inside your dashboard" title="Everything you can do after the test." sub={`${FEATURES.length} tools, each with its own short video - they play as you scroll.`} />
            <div className="hm-zzs">
              {FEATURES.map((x, i) => {
                const flip = i % 2 === 1;
                return (
                  <article key={x.key} className={`hm-zz${flip ? " is-flip" : ""}`}>
                    <div className="hm-zz-copy" data-rv="">
                      <div className="hm-zz-head">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={x.photo ?? featureArt(x.art!).thumb} alt="" loading="lazy" className={x.photo ? "is-photo" : undefined} />
                        <span className="hm-zz-n">{String(i + 1).padStart(2, "0")} / {FEATURES.length}</span>
                      </div>
                      <h3>{x.title}</h3>
                      <p className="hm-zz-line">{x.line}</p>
                      <ul className="hm-ticks">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    </div>
                    <div className="hm-zz-media" data-rv={flip ? "left" : "right"}><HomeVideo video={x.video} title={x.title} auto /></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- decision tools ---------- */}
        <section id="tools" className="hm-sec hm-sheet hm-bg-page">
          <div className="hm-in">
            <Head kicker="Help with the decision" title="Four tools for the hardest part: choosing." />
            <div className="hm-tools">
              {TOOLS.map((t, i) => (
                <div key={t.title} className="hm-tool" data-rv="" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="hm-ic"><Icon name={t.icon} size={19} /></span>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
            <p className="hm-note">Plus a builder for your own portfolio website, and a jobs board that marks the openings on your career path.</p>
          </div>
        </section>

        {/* ---------- schools ---------- */}
        <section id="schools" className="hm-sec hm-sheet hm-bg-warm">
          <div className="hm-in hm-zz">
            <div className="hm-zz-copy" data-rv="">
              <span className="hm-kicker">For schools &amp; colleges</span>
              <h2>See every student&apos;s journey - and act on it.</h2>
              <p className="hm-sub">A portal for your institution: every student&apos;s results and progress in one place, and the tools to reach the ones who need you.</p>
              <ul className="hm-ticks">{SCHOOL_POINTS.map((p) => <li key={p}>{p}</li>)}</ul>
              <div className="hm-actions">
                <a className="hm-btn hm-btn-pri hm-btn-lg" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("OneGrasp for our school")}`}>Book a demo <Icon name="arrowRight" size={17} /></a>
                <a className="hm-btn hm-btn-lg" href={`tel:${CONTACT.phone}`}><Icon name="phone" size={15} /> {CONTACT.phoneLabel}</a>
              </div>
            </div>
            <div className="hm-zz-media" data-rv="right"><HomeVideo video={SCHOOLS_VIDEO} title="The OneGrasp institution portal" auto /></div>
          </div>
        </section>

        {/* ---------- working professionals ---------- */}
        <section id="professionals" className="hm-sec hm-sheet hm-bg-page">
          <div className="hm-in">
            <div className="hm-pro" data-rv="">
              <div>
                <span className="hm-kicker">For working professionals</span>
                <h2>Find out where your work stress comes from.</h2>
                <p className="hm-sub">A private check across workload, behaviour at work, culture and career security. You get your stress score, the drivers behind it, and a 30-day plan with steps and ready-to-send messages.</p>
                <ul className="hm-ticks">
                  <li>Private - nothing is shared with your employer</li>
                  <li>Compared anonymously with people at your career stage, once enough have taken it</li>
                  <li>A weekly check-in, to see whether your plan is working</li>
                </ul>
                <button type="button" className="hm-btn hm-btn-pri hm-btn-lg" onClick={onStart}>Take the stress check <Icon name="arrowRight" size={17} /></button>
              </div>
              <dl className="hm-pro-stats">
                <div><dt>34</dt><dd>questions</dd></div>
                <div><dt>~5 min</dt><dd>to finish</dd></div>
                <div><dt>14</dt><dd>stress drivers</dd></div>
                <div><dt>30-day</dt><dd>plan, step by step</dd></div>
              </dl>
            </div>
          </div>
        </section>

        {/* ---------- honest about it ---------- */}
        <section id="trust" className="hm-sec hm-sheet hm-bg-warm">
          <div className="hm-in">
            <Head kicker="Honest about how it works" title="A guide you can trust - and question." />
            <div className="hm-trust">
              {[
                { icon: "shield", t: "Built on established psychology", d: "Questions written by OneGrasp for each stage, scored against well-researched ways of describing how people think, learn and work." },
                { icon: "lock", t: "Private by default", d: "Your answers stay on your account. Your school sees your results only if you register under it, and your parents see only what you share with them." },
                { icon: "compass", t: "A starting point, not a verdict", d: "Your report shows where you fit best today. Talk it through with your parents, teachers or a counsellor - it's a guide, not a final answer." },
              ].map((c, i) => (
                <div key={c.t} data-rv="" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="hm-ic"><Icon name={c.icon} size={19} /></span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section id="faq" className="hm-sec hm-sheet hm-bg-page">
          <div className="hm-in hm-faq-in">
            <div className="hm-faq-side">
              <Head kicker="Questions" title="Good to know." sub="Still unsure? Write to us any time." />
              <figure className="hm-faq-art" data-rv="zoom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home/faq.webp" srcSet="/home/faq-480.webp 480w, /home/faq.webp 760w" sizes="(max-width: 900px) 70vw, 380px"
                  alt="A student and parent looking at a laptop together, with questions in mind" width={760} height={942} loading="lazy" decoding="async" />
              </figure>
            </div>
            <div className="hm-faq" data-rv="">
              {FAQ.map((x) => (
                <details key={x.q}>
                  <summary>{x.q}</summary>
                  <p>{x.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="hm-cta hm-sheet">
          <div className="hm-in" data-rv="">
            <h2>Your next step starts with one test.</h2>
            <p>Start today - or watch the 90-second tour first.</p>
            <div className="hm-actions hm-center">
              <button type="button" className="hm-btn hm-btn-light hm-btn-lg" onClick={onStart}>Start the assessment <Icon name="arrowRight" size={17} /></button>
              <button type="button" className="hm-btn hm-btn-line hm-btn-lg" onClick={watchWithSound}><Icon name="play" size={15} /> Watch the tour</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="hm-foot">
        <div className="hm-in hm-foot-in">
          <div className="hm-foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="hm-logo-chip"><img src="/home/logo.png" alt="OneGrasp" width={48} height={28} /></span>
            <span>Career fitment, backed by science</span>
          </div>
          <div className="hm-foot-links">
            <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href="/jobs">Jobs board</a>
            <a href="/signin">Sign in</a>
          </div>
          <span className="hm-copy">© {new Date().getFullYear()} OneGrasp</span>
        </div>
      </footer>
    </div>
  );
}

function Head({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="hm-head" data-rv="">
      <span className="hm-kicker">{kicker}</span>
      <h2>{title}</h2>
      {sub && <p className="hm-sub">{sub}</p>}
    </div>
  );
}

/** The tour's 13 chapters: a segmented bar that fills as it plays, and the
 *  chapter names to jump with (the active one kept in view on phones). */
function ChapterBar({ sink, onPick }: { sink: TimeSink; onPick: (t: number) => void }) {
  const [t, setT] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    sink.current = setT;
    return () => { sink.current = null; };
  }, [sink]);
  const cur = TOUR_CHAPTERS.reduce((a, c, i) => (t >= c.t ? i : a), -1);
  useEffect(() => {
    const r = row.current;
    const b = r?.children[cur] as HTMLElement | undefined;
    if (r && b && r.scrollWidth > r.clientWidth) r.scrollTo({ left: b.offsetLeft - r.clientWidth / 2 + b.offsetWidth / 2, behavior: "smooth" });
  }, [cur]);

  return (
    <div className="hm-chap">
      <div className="hm-chap-bar" aria-hidden="true">
        {TOUR_CHAPTERS.map((c, i) => {
          const end = TOUR_CHAPTERS[i + 1]?.t ?? TOUR_END;
          const f = t <= c.t ? 0 : t >= end ? 1 : (t - c.t) / (end - c.t);
          return (
            <button key={c.t} type="button" tabIndex={-1} style={{ flexGrow: end - c.t }} onClick={() => onPick(c.t)} title={c.label}>
              <i style={{ transform: `scaleX(${f})` }} />
            </button>
          );
        })}
      </div>
      <div ref={row} className="hm-chap-row" role="group" aria-label="Jump to a part of the tour">
        {TOUR_CHAPTERS.map((c, i) => (
          <button key={c.t} type="button" aria-pressed={cur === i} onClick={() => onPick(c.t)}>{c.label}</button>
        ))}
      </div>
    </div>
  );
}

/** Content below the fold slides in once as it's reached ([data-rv] =
 *  "" up, "left", "right", "zoom"). Anything already on screen at load is
 *  left alone, so nothing visible ever blinks. Off for reduced motion. */
function useReveal(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const fold = window.innerHeight * 0.92;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-rv]")).filter((n) => n.getBoundingClientRect().top > fold);
    items.forEach((n) => n.classList.add("rv-wait"));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.remove("rv-wait"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    items.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [root]);
}

/* -------------------------------- styles ------------------------------- */
const CSS = `
.hm{--ink:#16181d;--ink2:#4a4f59;--mute:#7b808b;--line:#e8e5df;--soft:#f7f5f1;--warm:#f4f0eb;--page:#fbfaf8;--base:#c9c4ba;--red:#db3433;--sheet:26px;
  background:var(--page);color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:clip}
.hm *{box-sizing:border-box}
.hm h1,.hm h2,.hm h3{font-family:Poppins,Inter,sans-serif;letter-spacing:-.015em;color:var(--ink)}
/* Zero-weight resets, so a single class (.hm-sub, .hm-note...) can set its own margins. */
.hm :where(h1,h2,h3,p,ul,ol,dl,dd,figure){margin:0}
.hm :where(a){color:inherit}
.hm button{font-family:inherit}
.hm section[id]{scroll-margin-top:60px}
.hm button:focus-visible,.hm a:focus-visible,.hm summary:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
.hm-in{max-width:1180px;margin:0 auto;padding:0 24px}
.hm-show-sm{display:none}

/* nav */
.hm-nav{position:sticky;top:0;z-index:50;background:rgba(251,250,248,.9);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.hm-nav-in{display:flex;align-items:center;gap:26px;height:64px}
.hm-brand{display:flex;flex:none;text-decoration:none}
.hm-brand img{height:42px;width:auto;max-width:none;display:block}
.hm-links{display:flex;gap:22px;flex:1}
.hm-links a{font-size:14px;font-weight:500;color:var(--ink2);text-decoration:none;position:relative}
.hm-links a::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s}
.hm-links a:hover{color:var(--ink)}
.hm-links a:hover::after{transform:scaleX(1)}
.hm-nav-cta{display:flex;gap:8px;margin-left:auto}

/* buttons */
.hm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 16px;border-radius:6px;border:1px solid #d9d5cd;background:#fff;color:var(--ink);font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .15s,border-color .15s,transform .15s}
.hm-btn:hover{background:var(--soft)}
.hm-btn:active{transform:translateY(1px)}
.hm-btn-pri{background:var(--ink);border-color:var(--ink);color:#fff}
.hm-btn-pri:hover{background:#2b2e35}
.hm-btn-lg{height:50px;padding:0 22px;font-size:15px}
.hm-btn-ghost{border-color:transparent;background:none}
.hm-btn-ghost:hover{background:var(--warm)}
.hm-btn-light{background:#fff;border-color:#fff;color:var(--ink)}
.hm-btn-light:hover{background:#f1efea}
.hm-btn-line{background:transparent;border-color:rgba(255,255,255,.35);color:#fff}
.hm-btn-line:hover{background:rgba(255,255,255,.08)}

/* hero */
.hm-hero{position:relative;padding:26px 0 calc(36px + var(--sheet));background:linear-gradient(180deg,var(--page) 0%,var(--warm) 100%)}
.hm-hero::before{content:"";position:absolute;inset:0 0 40%;background-image:radial-gradient(#e3ded4 1px,transparent 1.2px);background-size:22px 22px;-webkit-mask-image:linear-gradient(to bottom,#000,transparent);mask-image:linear-gradient(to bottom,#000,transparent);pointer-events:none}
.hm-hero .hm-in{position:relative}
/* Text left, the tour right - side by side, both on the first screen. */
.hm-hero-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:48px;align-items:center;padding-top:14px}
.hm-hero-video{min-width:0}
.hm-hero h1{font-size:clamp(32px,3.6vw,52px);line-height:1.08;font-weight:700;margin-top:12px;text-wrap:balance}
.hm-hero h1 em{font-style:normal;color:var(--red);display:inline-block}
.hm-lead{font-size:17px;color:var(--ink2);margin-top:16px;max-width:34em}
.hm-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.hm-center{justify-content:center}
.hm-down{display:inline-flex;transform:rotate(90deg)}
.hm-assure{display:flex;align-items:center;gap:7px;margin-top:14px;font-size:13.5px;color:var(--ink2)}
.hm-assure svg{color:#16a34a;flex:none}
.hm-facts{list-style:none;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:26px;border-top:1px solid var(--line)}
.hm-facts li{padding:12px 10px 0 0;font-size:12.5px;color:var(--mute);line-height:1.35}
.hm-facts b{display:block;margin-bottom:2px;font-family:Poppins,Inter,sans-serif;font-size:22px;font-weight:600;line-height:1.15;color:var(--ink);font-variant-numeric:tabular-nums}
.hm-hero-video .hm-video{border-radius:14px;box-shadow:0 30px 70px -20px rgba(22,24,29,.32),0 0 0 1px rgba(22,24,29,.06)}
.hm-chap{margin-top:12px}
.hm-chap-bar{display:flex;gap:3px;height:6px}
.hm-chap-bar button{position:relative;min-width:0;height:100%;padding:0;border:0;border-radius:3px;background:#e3ded4;cursor:pointer;overflow:hidden}
.hm-chap-bar button:hover{background:#d6d0c4}
.hm-chap-bar i{position:absolute;inset:0;background:var(--red);transform-origin:left;transition:transform .3s linear}
.hm-chap-row{position:relative;display:flex;gap:6px;margin-top:10px;overflow-x:auto;scrollbar-width:none;-webkit-mask-image:linear-gradient(to right,transparent,#000 16px,#000 calc(100% - 16px),transparent);mask-image:linear-gradient(to right,transparent,#000 16px,#000 calc(100% - 16px),transparent);padding:0 16px}
.hm-chap-row::-webkit-scrollbar{display:none}
.hm-chap-row button{flex:none;height:30px;padding:0 11px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:12.5px;font-weight:500;color:var(--ink2);cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.hm-chap-row button:hover{border-color:var(--base);color:var(--ink)}
.hm-chap-row button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.hm-built{display:grid;gap:10px;margin-top:28px;padding-top:18px;border-top:1px solid var(--line)}
.hm-built-lbl{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.hm-built-row{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}
.hm-built-i{display:flex;align-items:center;gap:10px;min-width:0;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;font:inherit;color:var(--ink);text-align:left;text-decoration:none;cursor:pointer;transition:border-color .15s,transform .2s}
.hm-built-i:hover{border-color:var(--base);transform:translateY(-2px)}
.hm-built-i b{display:block;font-size:13.5px;font-weight:600;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hm-built-i small{display:block;font-size:12px;color:var(--mute);line-height:1.3}
.hm-built-i>span:last-child{min-width:0}

/* video */
.hm-video{position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;background:#15171c;box-shadow:0 18px 44px -16px rgba(22,24,29,.24),0 0 0 1px rgba(22,24,29,.06)}
.hm-video video{position:absolute;inset:0;width:100%;height:100%;display:block;background:#15171c;cursor:pointer}
.hm-video-cover{position:absolute;inset:0;padding:0;border:0;cursor:pointer;background:#15171c;display:block;width:100%}
.hm-video-cover img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease,filter .2s}
.hm-video-cover:hover img{transform:scale(1.015);filter:brightness(.95)}
.hm-play{position:absolute;left:50%;top:50%;width:66px;height:66px;margin:-33px 0 0 -33px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;padding-left:3px;box-shadow:0 10px 30px rgba(0,0,0,.28);transition:background .15s}
.hm-video-cover:hover .hm-play{background:var(--red)}
.hm-len{position:absolute;right:12px;bottom:12px;background:rgba(22,24,29,.84);color:#fff;font-size:12.5px;font-weight:600;padding:3px 8px;border-radius:4px;font-variant-numeric:tabular-nums}
.hm-vctl{position:absolute;right:12px;bottom:12px;display:flex;gap:6px}
.hm-vctl button{display:inline-flex;align-items:center;gap:6px;height:34px;min-width:34px;padding:0 10px;justify-content:center;border:0;border-radius:6px;background:rgba(22,24,29,.78);color:#fff;font-size:12.5px;font-weight:600;cursor:pointer;backdrop-filter:blur(4px)}
.hm-vctl button:hover{background:rgba(22,24,29,.92)}

/* sections stacked like pages */
.hm-sec{padding:52px 0}
.hm-sheet{position:relative;margin-top:calc(-1 * var(--sheet));border-radius:var(--sheet) var(--sheet) 0 0;box-shadow:0 -16px 34px -24px rgba(22,24,29,.3)}
.hm-bg-white{background:#fff}
.hm-bg-page{background:var(--page)}
.hm-bg-warm{background:var(--warm)}
.hm-head{max-width:720px;margin-bottom:24px}
.hm-head h2,.hm-zz h2,.hm-pro h2{font-size:clamp(26px,3vw,38px);line-height:1.15;font-weight:700;margin-top:8px;text-wrap:balance}
.hm-kicker{display:block;font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--red)}
.hm-sub{font-size:16.5px;color:var(--ink2);margin-top:12px;max-width:62ch}
.hm-note{font-size:14px;color:var(--mute);margin-top:18px}
.hm-ic{width:40px;height:40px;border-radius:8px;background:var(--warm);display:grid;place-items:center;color:var(--ink);flex:none}
.hm-ic-sm{width:32px;height:32px;border-radius:7px}
.hm-bg-warm .hm-ic{background:var(--soft)}
.hm-ticks{list-style:none;padding:0;display:grid;gap:8px}
.hm-ticks li{position:relative;padding-left:24px;font-size:14.5px;color:var(--ink2);line-height:1.5}
.hm-ticks li::before{content:"";position:absolute;left:2px;top:6px;width:11px;height:6px;border-left:2px solid var(--red);border-bottom:2px solid var(--red);transform:rotate(-45deg)}

/* photos */
.hm-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.hm-chips button{height:34px;padding:0 13px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13.5px;font-weight:500;color:var(--ink2);cursor:pointer}
.hm-chips button:hover{border-color:var(--base);color:var(--ink)}
.hm-chips button em{font-style:normal;color:var(--mute);margin-left:6px;font-variant-numeric:tabular-nums}
.hm-chips button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.hm-chips button[aria-pressed="true"] em{color:rgba(255,255,255,.6)}
.hm-stories{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));grid-auto-rows:128px;grid-auto-flow:dense;gap:10px}
.hm-st{position:relative;padding:0;border:0;border-radius:8px;overflow:hidden;cursor:zoom-in;background:var(--warm);grid-row:span 2}
.hm-st.is-wide{grid-column:span 2}
.hm-st img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.hm-st:hover img{transform:scale(1.05)}
.hm-st-cap{position:absolute;left:0;right:0;bottom:0;padding:30px 12px 10px;background:linear-gradient(to top,rgba(15,17,21,.8),rgba(15,17,21,0));color:#fff;text-align:left;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s}
.hm-st:hover .hm-st-cap,.hm-st:focus-visible .hm-st-cap{opacity:1;transform:none}
.hm-st-cap b{display:block;font-size:13px;font-weight:600;line-height:1.35}
.hm-st-cap small{display:block;font-size:11.5px;opacity:.78;margin-top:2px}
@media (hover:none){.hm-st-cap{opacity:1;transform:none}}
.hm-stories-more{display:flex;justify-content:center;margin-top:18px}
.hm-lb{position:fixed;inset:0;z-index:100;background:rgba(10,11,14,.975);display:grid;place-items:center;padding:60px 76px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
.hm-lb,.hm-lb *{box-sizing:border-box}
.hm-lb figure{margin:0;display:flex;flex-direction:column;align-items:center;max-width:100%}
.hm-lb img{max-width:min(1200px,100%);max-height:calc(100vh - 160px);object-fit:contain;display:block;border-radius:6px;background:center/contain no-repeat}
.hm-lb figcaption{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;width:100%;margin-top:12px;color:#e5e7eb;font-size:14px}
.hm-lb figcaption span{color:#9ca3af;font-variant-numeric:tabular-nums}
.hm-lb-x,.hm-lb-prev,.hm-lb-next{position:absolute;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;font-size:26px;line-height:1;cursor:pointer;display:grid;place-items:center;font-family:inherit}
.hm-lb-x:hover,.hm-lb-prev:hover,.hm-lb-next:hover{background:rgba(255,255,255,.16)}
.hm-lb-x{top:14px;right:14px}
.hm-lb-prev{left:16px;top:50%;margin-top:-23px}
.hm-lb-next{right:16px;top:50%;margin-top:-23px}

/* how it works: one story picture, four steps under it */
.hm-story{margin:4px -8px 0}
.hm-story img{width:100%;height:auto;display:block}
.hm-steps{list-style:none;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:10px}
.hm-steps li{display:flex;gap:12px;align-items:flex-start;padding-top:14px;border-top:2px solid var(--line)}
.hm-step-n{flex:none;width:28px;height:28px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-size:13px;font-weight:600}
.hm-steps h3{font-size:16.5px;font-weight:600;line-height:1.3}
.hm-steps p{font-size:14px;color:var(--ink2);margin-top:4px;line-height:1.5}

/* zig-zag rows: text one side, a playing video on the other */
.hm-zzs{display:grid;gap:56px}
.hm-zz{display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);gap:52px;align-items:center}
.hm-zz.is-flip{grid-template-columns:minmax(0,1.14fr) minmax(0,.86fr)}
.hm-zz.is-flip .hm-zz-copy{order:2}
.hm-zz.is-even{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px}
.hm-zz-head{display:flex;align-items:center;gap:12px}
.hm-zz-head img{width:64px;height:52px;object-fit:contain;display:block;transition:transform .4s}
.hm-zz:hover .hm-zz-head img{transform:translateY(-3px) rotate(-3deg)}
.hm-zz-head img.is-photo{width:58px;height:44px;object-fit:cover;border-radius:6px}
.hm-zz-n{font-size:12.5px;font-weight:600;letter-spacing:.06em;color:var(--mute);font-variant-numeric:tabular-nums}
.hm-zz h3{font-size:clamp(22px,2.2vw,28px);font-weight:700;line-height:1.2;margin-top:12px}
.hm-zz-line{font-size:16px;color:var(--ink2);margin-top:6px}
.hm-zz .hm-ticks{margin-top:16px}
.hm-dims{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:6px;margin-top:18px}
.hm-dims li{padding:6px 11px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:13.5px;font-weight:500;color:var(--ink)}
.hm-views{margin-top:16px}
.hm-views-lbl{display:block;font-size:12.5px;font-weight:600;color:var(--mute)}
.hm-views ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.hm-views li{padding:6px 11px;border-left:3px solid var(--red);background:#fff;border-radius:0 6px 6px 0;font-size:13.5px;font-weight:600;cursor:help}
#report .hm-sub{margin-top:10px}
#report .hm-dims{margin-top:14px}
#report .hm-dims li{padding:5px 10px;font-size:13px}
#schools .hm-ticks{margin-top:18px}

/* tools, professionals, trust */
.hm-tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.hm-tool,.hm-trust>div{padding:22px;background:#fff;border:1px solid var(--line);border-radius:8px;transition:border-color .2s,transform .25s}
.hm-tool:hover,.hm-trust>div:hover{border-color:var(--base);transform:translateY(-3px)}
.hm-tool h3,.hm-trust h3{font-size:16.5px;font-weight:600;margin-top:14px}
.hm-tool p,.hm-trust p{font-size:14px;color:var(--ink2);margin-top:6px;line-height:1.6}
.hm-pro{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:44px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:10px;padding:36px}
.hm-pro .hm-ticks{margin:18px 0 24px}
.hm-pro-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1px solid var(--line);border-radius:8px;overflow:hidden}
.hm-pro-stats>div{padding:20px;border-bottom:1px solid var(--line)}
.hm-pro-stats>div:nth-child(odd){border-right:1px solid var(--line)}
.hm-pro-stats>div:nth-last-child(-n+2){border-bottom:0}
.hm-pro-stats dt{font-family:Poppins,Inter,sans-serif;font-size:28px;font-weight:600;line-height:1.1;letter-spacing:-.02em}
.hm-pro-stats dd{font-size:13px;color:var(--mute);margin-top:3px}
.hm-trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}

/* faq */
.hm-faq-in{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:48px;align-items:start}
.hm-faq-side{position:sticky;top:84px}
.hm-faq-art{max-width:340px}
.hm-faq-art img{width:100%;height:auto;display:block;border-radius:14px;box-shadow:0 18px 40px -20px rgba(22,24,29,.3)}
.hm-faq{border-top:1px solid var(--line)}
.hm-faq details{border-bottom:1px solid var(--line)}
.hm-faq summary{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:17px 0;cursor:pointer;font-weight:600;font-size:16px;list-style:none;transition:color .15s}
.hm-faq summary:hover{color:var(--red)}
.hm-faq summary::-webkit-details-marker{display:none}
.hm-faq summary::after{content:"+";font-size:22px;font-weight:400;color:var(--mute);line-height:1;transition:transform .25s}
.hm-faq details[open] summary::after{transform:rotate(45deg)}
.hm-faq p{padding:0 0 18px;font-size:15px;color:var(--ink2);max-width:62ch}
.hm-faq details[open] p{animation:hmFade .35s ease}

/* cta + footer */
.hm-cta{background:var(--ink);padding:64px 0 calc(64px + 4px);text-align:center}
.hm-cta h2{color:#fff;font-size:clamp(28px,3.6vw,44px);font-weight:700;text-wrap:balance}
.hm-cta p{color:rgba(255,255,255,.72);margin-top:10px;font-size:16px}
.hm-foot{background:#0f1115;color:#aab0bb;padding:24px 0}
.hm-foot-in{display:flex;align-items:center;justify-content:space-between;gap:16px 24px;flex-wrap:wrap}
.hm-foot-brand{display:flex;align-items:center;gap:12px;font-size:13px}
.hm-logo-chip{background:#fff;border-radius:6px;padding:4px 8px;display:inline-flex}
.hm-logo-chip img{height:28px;width:auto;max-width:none;display:block}
.hm-foot-links{display:flex;gap:18px;flex-wrap:wrap;font-size:13px}
.hm-foot-links a{color:#cfd4dc;text-decoration:none}
.hm-foot-links a:hover{color:#fff}
.hm-copy{font-size:12.5px;color:#6b7280}

/* motion - cheap: transforms and opacity only */
@keyframes hmUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes hmFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.hm-enter{animation:hmUp .7s cubic-bezier(.2,.7,.2,1) both}
.hm-d1{animation-delay:.06s}.hm-d2{animation-delay:.14s}.hm-d3{animation-delay:.22s}.hm-d4{animation-delay:.32s}
[data-rv]{transition:opacity .75s cubic-bezier(.2,.7,.2,1),transform .75s cubic-bezier(.2,.7,.2,1)}
.rv-wait{opacity:0;transform:translateY(26px)}
.rv-wait[data-rv="left"]{transform:translateX(-40px)}
.rv-wait[data-rv="right"]{transform:translateX(40px)}
.rv-wait[data-rv="zoom"]{transform:scale(.95)}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .hm-sheet{animation:hmSheet linear both;animation-timeline:view();animation-range:entry 0% entry 60%}
    @keyframes hmSheet{from{transform:translateY(46px) scale(.985)}to{transform:none}}
    /* The photo viewer is position:fixed inside this section - a transformed
       ancestor would pin it to the section instead of the screen. */
    #stories.hm-sheet{animation:none}
  }
}
@media (prefers-reduced-motion:reduce){
  .hm *,.hm *::before,.hm *::after{animation:none!important;transition:none!important}
}

@media (max-width:1080px){
  .hm-links{display:none}
  .hm-tools{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hm-built-row{display:flex;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
  .hm-built-row::-webkit-scrollbar{display:none}
  .hm-built-i{flex:none}
}
@media (max-width:900px){
  .hm-hero{padding:22px 0 calc(28px + var(--sheet))}
  /* Stacked on phones and tablets: headline, buttons, then the tour - the
     numbers move under it, so the video is on the first screen too. */
  .hm-hero-grid{display:flex;flex-direction:column;align-items:stretch;gap:0;padding-top:0}
  .hm-hero-copy{display:contents}
  .hm-hero-video{order:1;margin-top:22px}
  .hm-hero .hm-facts{order:2}
  .hm-pro,.hm-faq-in{grid-template-columns:minmax(0,1fr);gap:26px}
  .hm-zz,.hm-zz.is-flip,.hm-zz.is-even{grid-template-columns:minmax(0,1fr);gap:18px}
  .hm-zz.is-flip .hm-zz-copy{order:0}
  .hm-zzs{gap:44px}
  .hm-stories{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:116px}
  .hm-steps{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hm-trust{grid-template-columns:minmax(0,1fr)}
  .hm-sec{padding:40px 0}
  .hm-pro{padding:24px}
  .hm-faq-side{position:static}
  .hm-faq-art{max-width:260px}
  .rv-wait[data-rv="left"],.rv-wait[data-rv="right"]{transform:translateY(26px)}
}
@media (max-width:560px){
  .hm{--sheet:18px}
  .hm-in{padding:0 16px}
  .hm-nav-in{height:58px;gap:10px}
  .hm-brand img{height:38px}
  .hm-hide-sm{display:none}
  .hm-show-sm{display:inline}
  .hm-hero h1{margin-top:14px}
  .hm-lead{font-size:16px}
  .hm-actions .hm-btn{width:100%}
  .hm-facts{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:4px}
  .hm-facts b{font-size:20px}
  .hm-hero .hm-hero-video{width:calc(100% + 12px);margin-top:20px;margin-left:-6px;margin-right:-6px}
  .hm-hero-video .hm-video{border-radius:10px}
  .hm-chap-row{margin-left:-16px;margin-right:-16px}
  .hm-built{margin-top:22px}
  .hm-built-row{margin:0 -16px;padding:0 16px 2px}
  .hm-tools,.hm-steps,.hm-views{grid-template-columns:minmax(0,1fr)}
  .hm-steps{gap:12px}
  .hm-story{margin:0 -16px}
  .hm-play{width:56px;height:56px;margin:-28px 0 0 -28px}
  .hm-pro-stats dt{font-size:24px}
  .hm-pro{padding:20px}
  .hm-stories{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:104px;gap:8px}
  .hm-lb{padding:56px 10px 76px}
  .hm-lb-prev,.hm-lb-next{top:auto;bottom:16px;margin-top:0}
  .hm-lb-prev{left:calc(50% - 56px)}
  .hm-lb-next{right:calc(50% - 56px)}
}
`;
