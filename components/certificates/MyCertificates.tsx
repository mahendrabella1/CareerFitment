"use client";
/**
 * /account/certificates - every course that awards a certificate: the ones
 * earned (open one to see and share it), the ones ready to claim, and how far
 * along the rest are. `?c=<course>` opens that course's certificate.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { featureArt } from "@/lib/features/catalog";
import { readCourseDone } from "@/lib/progress/progressStore";
import { fetchProgress } from "@/lib/startups/clientProgress";
import type { ProgressMap } from "@/lib/startups/unlock";
import { CERT_COURSES, certCode, certPath, ISSUER, type CertRecord } from "@/lib/certificates/catalog";
import { courseStatus, type CourseFacts } from "@/lib/certificates/status";
import { claimCertificate, certUrl } from "@/lib/certificates/client";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { CertificateCanvas } from "./CertificateCanvas";
import { ShareCertificate, SHARE_CSS } from "./ShareCertificate";

const ACCENT = "#db3433";

export function MyCertificates({ facts }: { facts: CourseFacts[] }) {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [startups, setStartups] = useState<ProgressMap | null>(null);
  const [claiming, setClaiming] = useState("");
  const [error, setError] = useState<{ key: string; text: string } | null>(null);
  const issued = profile?.certificates ?? {};

  useEffect(() => { if (user?.uid) fetchProgress(user.uid).then(setStartups).catch(() => setStartups({ lessonBestPercent: {}, moduleTestBestPercent: {} })); }, [user?.uid]);

  const rows = useMemo(() => CERT_COURSES.map((c) => {
    const f = facts.find((x) => x.key === c.key);
    const s = f ? courseStatus(f, c.kind === "track" ? { startups } : { done: readCourseDone(c.key, profile?.progress?.courses?.[c.key]) }) : { done: 0, total: 0, complete: false };
    return { c, f, s, cert: issued[c.key], unit: c.kind === "track" ? "module tests" : "lessons" };
  }), [facts, startups, profile, issued]);

  const earned = rows.filter((r) => r.cert).length;
  // The certificate to show: ?c=, else the latest earned.
  const want = params.get("c");
  const shown = rows.find((r) => r.c.key === want && r.cert) ?? [...rows].filter((r) => r.cert).sort((a, b) => (b.cert!.issuedAt - a.cert!.issuedAt))[0];

  const claim = async (key: string) => {
    const r = rows.find((x) => x.c.key === key);
    setClaiming(key); setError(null);
    try {
      await claimCertificate(key, r?.c.kind === "lessons" ? { total: r.s.total, account: profile?.progress?.courses?.[key] } : undefined);
      await refreshProfile();
      router.replace(`/account/certificates?c=${encodeURIComponent(key)}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError({ key, text: e instanceof Error ? e.message : "Couldn't get your certificate - please try again." });
    }
    setClaiming("");
  };

  return (
    <CoursePlayerShell accent={ACCENT} banner={{ title: "My certificates", icon: "award", backHref: "/account", backLabel: "Dashboard" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS + SHARE_CSS }} />
      <div className="fp crt-page">
        <header className="crt-head">
          <span className="fp-kicker" style={{ border: 0, paddingTop: 0 }}>Certificates</span>
          <h1>Finish a course, get certified</h1>
          <p>Every course on {ISSUER.name} ends with a certificate in your name. Add it to LinkedIn, or share it on WhatsApp and Instagram. Anyone with the link can check it&apos;s real.</p>
          <div className="crt-count"><b>{earned}</b> of {rows.length} earned</div>
        </header>

        {shown?.cert && <Viewer key={shown.cert.id} id={shown.cert.id} />}

        <section className="fp-sec">
          <div className="fp-sec-h"><div><h2>{earned ? "All courses" : "Courses that award a certificate"}</h2><p>Complete every lesson in a course to unlock its certificate.</p></div></div>
          <div className="crt-grid">
            {rows.map(({ c, s, cert, unit, f }) => {
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              const isShown = shown?.c.key === c.key;
              return (
                <div key={c.key} className={`crt-card${isShown ? " is-on" : ""}`} style={{ ["--ca" as string]: c.accent }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featureArt(c.key).thumb} alt="" />
                  <div className="crt-card-b">
                    <b>{c.title}</b>
                    {cert ? (
                      <small className="crt-ok"><Icon name="check" size={13} stroke={2.6} /> Earned {new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</small>
                    ) : (
                      <>
                        <div className="fp-bar" style={{ margin: "8px 0 6px" }}><i style={{ width: `${pct}%`, background: "var(--ca)" }} /></div>
                        <small>{s.complete ? "Course complete" : `${s.done} of ${s.total || f?.lessons || 0} ${unit}`}</small>
                      </>
                    )}
                    {error?.key === c.key && <small className="crt-err" role="alert">{error.text}</small>}
                  </div>
                  <div className="crt-card-a">
                    {cert ? (
                      <button type="button" className="fp-btn fp-btn-sm" onClick={() => { router.replace(`/account/certificates?c=${encodeURIComponent(c.key)}`, { scroll: false }); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={isShown}>{isShown ? "Showing" : "View and share"}</button>
                    ) : s.complete ? (
                      <button type="button" className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => void claim(c.key)} disabled={!!claiming}>{claiming === c.key ? "Getting it…" : "Get my certificate"}</button>
                    ) : (
                      <Link href={c.href} className="fp-btn fp-btn-sm">{s.done ? "Continue" : "Start"} <Icon name="arrowRight" size={14} stroke={2} /></Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </CoursePlayerShell>
  );
}

/** One earned certificate, as issued, with its share buttons. */
function Viewer({ id }: { id: string }) {
  const [cert, setCert] = useState<CertRecord | null>(null);
  const [error, setError] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const course = cert ? CERT_COURSES.find((c) => c.key === cert.course) : undefined;

  useEffect(() => {
    fetch(`/api/certificates/${id}`).then(async (r) => {
      const d = (await r.json().catch(() => ({}))) as { certificate?: CertRecord; error?: string };
      if (!r.ok || !d.certificate) throw new Error(d.error || "Couldn't load this certificate.");
      setCert(d.certificate);
    }).catch((e) => setError(e instanceof Error ? e.message : "Couldn't load this certificate."));
  }, [id]);

  if (error) return <div className="fp-card crt-view" style={{ padding: 20 }}><p className="fp-muted" style={{ margin: 0 }}>{error}</p></div>;
  if (!cert) return <div className="fp-card crt-view crt-view-loading" aria-busy="true" />;
  return (
    <section className="fp-card crt-view">
      <div className="crt-view-art">
        <CertificateCanvas ref={canvas} d={{ name: cert.name, className: cert.className, courseTitle: cert.courseTitle, lessons: cert.lessons, minutes: cert.minutes, accent: course?.accent ?? ACCENT, issuedAt: cert.issuedAt, code: certCode(cert.id), verifyUrl: certUrl(cert.id) }} />
      </div>
      <div className="crt-view-side">
        <span className="crt-ok"><Icon name="check" size={14} stroke={2.6} /> Verified by {ISSUER.name}</span>
        <h2>{cert.courseTitle}</h2>
        <p className="fp-muted" style={{ margin: "0 0 4px" }}>Certificate ID {certCode(cert.id)} · issued {new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        <a href={certPath(cert.id)} target="_blank" rel="noopener noreferrer" className="fp-link" style={{ fontSize: 13, marginBottom: 14 }}>Open the public page <Icon name="arrowRight" size={14} stroke={2} /></a>
        <ShareCertificate cert={cert} canvas={canvas} own />
      </div>
    </section>
  );
}

const CSS = `
.crt-page{padding-bottom:20px}
.crt-head{max-width:760px;padding:6px 0 4px}
.crt-head h1{font-size:clamp(26px,3.4vw,36px);font-weight:700;margin:8px 0 8px;line-height:1.15}
.crt-head p{margin:0;color:var(--ink2);font-size:15px;line-height:1.55}
.crt-count{margin-top:14px;font-size:14px;color:var(--ink2)}
.crt-count b{font-family:Poppins,Inter,sans-serif;font-size:22px;color:var(--ink);margin-right:2px}
.crt-view{margin-top:26px;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,1fr);gap:28px;padding:24px;align-items:start}
.crt-view-loading{min-height:360px;background:linear-gradient(90deg,#f6f4f0,#fbfaf7,#f6f4f0);background-size:200% 100%;animation:crtsh 1.4s linear infinite}
@keyframes crtsh{to{background-position:-200% 0}}
.crt-view-side h2{font-size:22px;font-weight:600;margin:8px 0 4px}
.crt-view-side{display:flex;flex-direction:column}
.crt-ok{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:700;color:var(--ok)}
.crt-err{color:#b42318!important}
.crt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:12px}
.crt-card{display:grid;grid-template-columns:56px minmax(0,1fr) auto;gap:14px;align-items:center;padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px}
.crt-card.is-on{border-color:var(--ca);box-shadow:0 0 0 1px var(--ca)}
.crt-card img{width:56px;height:56px;object-fit:contain}
.crt-card-b{min-width:0;display:flex;flex-direction:column}
.crt-card-b b{font-size:15px;font-weight:600;color:var(--ink)}
.crt-card-b small{font-size:12.5px;color:var(--mute)}
@media (max-width:900px){.crt-view{grid-template-columns:minmax(0,1fr);padding:16px;gap:18px}}
@media (max-width:480px){.crt-card{grid-template-columns:44px minmax(0,1fr)}.crt-card img{width:44px;height:44px}.crt-card-a{grid-column:2}}
`;
