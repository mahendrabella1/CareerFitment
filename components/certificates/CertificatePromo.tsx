"use client";
/**
 * "Complete the course and get certified", on every feature home with a
 * course: a band under the hero with the student's progress (and, once
 * earned, their certificate), a one-time pop-up showing a preview of the
 * certificate with their own name, and a "you did it" pop-up the moment the
 * last lesson is ticked off. The pop-up waits for the feature's first-visit
 * tour, and never covers a lesson opened from a link.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { categoryLabel } from "@/lib/auth/formOptions";
import { FEATURES } from "@/lib/features/catalog";
import { scopedKey } from "@/lib/progress/userStorage";
import { certClass, certCourse, certName, ISSUER } from "@/lib/certificates/catalog";
import { claimCertificate } from "@/lib/certificates/client";
import type { CourseProgress } from "@/lib/progress/types";
import { tourSeen, TOUR_CLOSED } from "@/components/feature/FeatureTour";
import { CertificateCanvas } from "./CertificateCanvas";

const popKey = (key: string) => `onegrasp.certpop.${key}.v1`;
const myCertsHref = (key: string) => `/account/certificates?c=${encodeURIComponent(key)}`;

export function CertificatePromo({ courseKey, done, total, lessons, minutes, unit = "lessons", loaded, justFinished, next, lessonAccount }: {
  courseKey: string;
  done: number;
  total: number;
  /** The course's lessons and learning time, printed on the certificate. */
  lessons: number;
  minutes: number;
  /** What `done` counts: lessons, or (Startups) module tests. */
  unit?: string;
  /** False while the student's progress is still loading - nothing pops up before it is. */
  loaded: boolean;
  /** The last lesson was just ticked off, on this visit. */
  justFinished?: boolean;
  next?: { label: string; href?: string; onClick?: () => void };
  /** Lesson courses: the account copy of the ticks, pushed before claiming. */
  lessonAccount?: { total: number; account?: CourseProgress };
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const course = certCourse(courseKey);
  const issued = profile?.certificates?.[courseKey];
  const ready = loaded && !loading;
  const complete = ready && total > 0 && done >= total;
  const [pop, setPop] = useState<"intro" | "done" | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  // The moment the course is finished.
  useEffect(() => { if (justFinished && !issued) setPop("done"); }, [justFinished, issued]);

  // Once per student per feature: what they'll get - after the tour, if one is showing.
  useEffect(() => {
    if (!ready || complete || issued || !course) return;
    if (new URLSearchParams(window.location.search).has("lesson")) return;
    try { if (window.localStorage.getItem(scopedKey(popKey(courseKey)))) return; } catch { return; }
    const show = () => {
      try { window.localStorage.setItem(scopedKey(popKey(courseKey)), "1"); } catch { /* storage blocked */ }
      setPop((p) => p ?? "intro");
    };
    const tourPending = (FEATURES[courseKey]?.tour.length ?? 0) > 0 && !tourSeen(courseKey);
    if (!tourPending) { const t = window.setTimeout(show, 1400); return () => window.clearTimeout(t); }
    let t = 0;
    const onTour = () => { t = window.setTimeout(show, 500); };
    window.addEventListener(TOUR_CLOSED, onTour);
    return () => { window.removeEventListener(TOUR_CLOSED, onTour); window.clearTimeout(t); };
  }, [ready, complete, issued, course, courseKey]);

  useEffect(() => {
    if (!pop) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPop(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pop]);

  if (!course) return null;
  const name = certName(profile?.name || "Your name");
  const className = profile?.category ? certClass(categoryLabel(profile.category)) : "";
  const drawing = { name, className, courseTitle: course.title, lessons, minutes, accent: course.accent, preview: !issued };

  const claim = async () => {
    setClaiming(true); setError("");
    try {
      await claimCertificate(courseKey, lessonAccount);
      router.push(myCertsHref(courseKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't get your certificate - please try again.");
      setClaiming(false);
    }
  };

  const nextBtn = (cls: string, onDone?: () => void) => next && (next.href
    ? <Link href={next.href} className={cls} onClick={onDone}>{next.label} <Icon name="arrowRight" size={15} stroke={2} /></Link>
    : <button type="button" className={cls} onClick={() => { onDone?.(); next.onClick?.(); }}>{next.label} <Icon name="arrowRight" size={15} stroke={2} /></button>);

  const pct = total ? Math.round((Math.min(done, total) / total) * 100) : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PROMO_CSS }} />
      <section className="fp-sec crt-band" style={{ ["--ca" as string]: course.accent }} aria-label="Course certificate">
        <div className="crt-band-art" aria-hidden="true">
          <CertificateCanvas d={drawing} style={{ boxShadow: "0 10px 24px -14px rgba(20,20,25,.5)" }} />
          <span className="crt-ribbon"><Icon name="award" size={18} stroke={2} /></span>
        </div>
        <div className="crt-band-b">
          {issued ? (
            <>
              <span className="crt-tag is-done"><Icon name="check" size={13} stroke={2.6} /> Certified</span>
              <h2>You&apos;ve earned your {course.title} certificate</h2>
              <p>Issued {new Date(issued.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. Add it to LinkedIn, or share it on WhatsApp and Instagram.</p>
              <div className="crt-band-actions"><Link href={myCertsHref(courseKey)} className="fp-btn fp-btn-pri">View and share <Icon name="arrowRight" size={15} stroke={2} /></Link></div>
            </>
          ) : complete ? (
            <>
              <span className="crt-tag">Course complete</span>
              <h2>Your certificate is ready</h2>
              <p>You finished every {unit === "lessons" ? "lesson" : "module test"}. Get your {ISSUER.name} certificate with your name and class, ready to share.</p>
              <div className="crt-band-actions">
                <button type="button" className="fp-btn fp-btn-pri" onClick={() => void claim()} disabled={claiming}>{claiming ? "Getting it…" : "Get my certificate"} <Icon name="award" size={15} stroke={2} /></button>
              </div>
              {error && <p className="crt-err" role="alert">{error}</p>}
            </>
          ) : (
            <>
              <span className="crt-tag">Get certified</span>
              <h2>Complete the course and get your certificate</h2>
              <p>Finish all {total} {unit} to earn a {ISSUER.name} certificate with your name and class. Share it on LinkedIn, WhatsApp and Instagram.</p>
              <div className="crt-prog">
                <div className="fp-bar"><i style={{ width: `${pct}%`, background: "var(--ca)" }} /></div>
                <span>{ready ? `${Math.min(done, total)} of ${total} ${unit}` : "Loading your progress…"}</span>
              </div>
              <div className="crt-band-actions">
                {nextBtn("fp-btn fp-btn-pri")}
                <Link href="/account/certificates" className="fp-link" style={{ fontSize: 13 }}>All certificates <Icon name="arrowRight" size={14} stroke={2} /></Link>
              </div>
            </>
          )}
        </div>
      </section>

      {pop && (
        <div className="crt-pop" onClick={(e) => { if (e.target === e.currentTarget) setPop(null); }}>
          <div className="crt-pop-d" role="dialog" aria-modal="true" aria-labelledby="crt-pop-h" style={{ ["--ca" as string]: course.accent }}>
            <button type="button" className="crt-pop-x" onClick={() => setPop(null)} aria-label="Close"><Icon name="close" size={16} stroke={2} /></button>
            <div className="crt-pop-art"><CertificateCanvas d={{ ...drawing, preview: pop === "intro" }} /></div>
            <div className="crt-pop-b">
              {pop === "intro" ? (
                <>
                  <span className="crt-tag">Get certified</span>
                  <h2 id="crt-pop-h">Complete this course and get certified</h2>
                  <p>Finish all {total} {unit} of {course.title} and {ISSUER.name} gives you a certificate with your name on it, ready to add to LinkedIn and share with friends and family.</p>
                  <div className="crt-band-actions">
                    {nextBtn("fp-btn fp-btn-pri", () => setPop(null)) ?? <button type="button" className="fp-btn fp-btn-pri" onClick={() => setPop(null)}>Start learning</button>}
                    <button type="button" className="fp-btn" onClick={() => setPop(null)}>Maybe later</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="crt-tag is-done"><Icon name="check" size={13} stroke={2.6} /> Course complete</span>
                  <h2 id="crt-pop-h">{profile?.name?.trim() ? `You did it, ${name.split(" ")[0]}!` : "You did it!"}</h2>
                  <p>You&apos;ve finished {course.title}. Your certificate is ready: get it, then share it on LinkedIn, WhatsApp or Instagram.</p>
                  <div className="crt-band-actions">
                    <button type="button" className="fp-btn fp-btn-pri" onClick={() => void claim()} disabled={claiming}>{claiming ? "Getting it…" : "Get my certificate"} <Icon name="award" size={15} stroke={2} /></button>
                    <button type="button" className="fp-btn" onClick={() => setPop(null)}>Later</button>
                  </div>
                  {error && <p className="crt-err" role="alert">{error}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const PROMO_CSS = `
.crt-band{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:28px;align-items:center;padding:22px 26px;background:linear-gradient(100deg,color-mix(in srgb,var(--ca) 7%,#fff),#fff 62%);border:1px solid var(--line);border-left:4px solid var(--ca);border-radius:8px}
.crt-band-art{position:relative}
.crt-ribbon{position:absolute;right:-10px;top:-10px;width:36px;height:36px;border-radius:50%;background:var(--ca);color:#fff;display:grid;place-items:center;box-shadow:0 6px 14px -6px rgba(0,0,0,.4)}
.crt-band-b h2{font-size:21px;font-weight:600;margin:8px 0 6px;line-height:1.25}
.crt-band-b p{margin:0;color:var(--ink2);font-size:14.5px;line-height:1.55;max-width:620px}
.crt-tag{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--ca)}
.crt-tag.is-done{color:var(--ok)}
.crt-prog{display:flex;align-items:center;gap:12px;margin-top:14px;max-width:460px}
.crt-prog .fp-bar{flex:1}
.crt-prog span{font-size:13px;color:var(--mute);white-space:nowrap;font-variant-numeric:tabular-nums}
.crt-band-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin-top:16px}
.crt-err{color:#b42318!important;font-size:13px!important;margin-top:10px!important}
.crt-pop{position:fixed;inset:0;z-index:100;background:rgba(18,20,24,.55);display:grid;place-items:center;padding:16px;animation:fpfade .18s ease-out}
.crt-pop-d{position:relative;width:min(620px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,.3)}
.crt-pop-art{padding:26px 34px 6px;background:linear-gradient(180deg,color-mix(in srgb,var(--ca) 9%,#fff),#fff)}
.crt-pop-b{padding:14px 30px 26px}
.crt-pop-b h2{font-size:22px;font-weight:600;margin:8px 0 8px;line-height:1.25}
.crt-pop-b p{margin:0;color:var(--ink2);font-size:14.5px;line-height:1.55}
.crt-pop-x{position:absolute;top:10px;right:10px;z-index:2;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.9);display:grid;place-items:center;cursor:pointer;color:var(--ink)}
@media (max-width:760px){.crt-band{grid-template-columns:minmax(0,1fr);padding:18px;gap:16px}.crt-band-art{max-width:300px}.crt-pop-art{padding:22px 18px 4px}.crt-pop-b{padding:12px 18px 20px}}
`;
