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
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";
import { SocialLinks } from "@/components/seo/SocialLinks";
import "./landing-home.css";
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
                        <img src={x.photo ?? featureArt(x.art!).thumb} alt={`${x.title} - OneGrasp`} loading="lazy" className={x.photo ? "is-photo" : undefined} />
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
                <a className="hm-btn hm-btn-pri hm-btn-lg" href="#partner" onClick={(e) => { e.preventDefault(); goTo("partner"); }}>Partner with us <Icon name="arrowRight" size={17} /></a>
                <a className="hm-btn hm-btn-lg" href={`tel:${CONTACT.phone}`}><Icon name="phone" size={15} /> {CONTACT.phoneLabel}</a>
              </div>
            </div>
            <div className="hm-zz-media" data-rv="right"><HomeVideo video={SCHOOLS_VIDEO} title="The OneGrasp institution portal" auto /></div>
          </div>
        </section>

        {/* ---------- school partnership form (lib/enquiries) ---------- */}
        <section id="partner" className="hm-sec hm-sheet hm-bg-white">
          <div className="hm-in hm-partner">
            <div className="hm-partner-copy">
              <span className="hm-kicker">Work with us</span>
              <h2>Want to bring OneGrasp to your school?</h2>
              <p className="hm-sub">Tell us a little about your school or college. Our team will get in touch to show you the portal, plan a rollout for your classes and answer your questions.</p>
              <ul className="hm-ticks">
                <li>An assessment, report and Year Plan for every student</li>
                <li>A portal for counsellors and leadership</li>
                <li>Help planning the rollout, class by class</li>
              </ul>
              <p className="hm-partner-alt">Prefer to talk? Call <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a> or email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
            </div>
            <div className="hm-partner-form">
              <EnquiryForm kind="school" submitLabel="Send to the OneGrasp team" doneTitle="Thank you - we've got it." doneText="Our team will get in touch with you soon by email or phone." />
            </div>
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
            <a href="/features">All features</a>
            <a href="/careers">Careers</a>
            <a href="/blogs">Blog</a>
            <a href="/jobs">Jobs board</a>
            <a href="#partner" onClick={(e) => { e.preventDefault(); goTo("partner"); }}>Partner with us</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/signin">Sign in</a>
          </div>
          <SocialLinks color="#cfd4dc" size={16} />
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
function useReveal(root: RefObject<HTMLElement | null>) {
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
