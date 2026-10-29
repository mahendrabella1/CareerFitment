"use client";
/** The public page of a certificate (/certificate/[id]): verified, shown, shareable. */
import { useRef } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { Logo } from "@/app/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import { FP_CSS } from "@/components/feature/styles";
import { certCode, certCourse, ISSUER, type CertRecord } from "@/lib/certificates/catalog";
import { certUrl } from "@/lib/certificates/client";
import { CertificateCanvas } from "./CertificateCanvas";
import { ShareCertificate, SHARE_CSS } from "./ShareCertificate";

export function CertificatePublic({ cert, problem }: { cert: CertRecord | null; problem?: "missing" | "offline" }) {
  const { profile } = useAuth();
  const canvas = useRef<HTMLCanvasElement>(null);
  const own = !!cert && profile?.certificates?.[cert.course]?.id === cert.id;
  const course = cert ? certCourse(cert.course) : undefined;
  const issued = cert ? new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="fp cp">
      <style dangerouslySetInnerHTML={{ __html: FP_CSS + SHARE_CSS + CSS }} />
      <header className="cp-top">
        <Link href="/" aria-label={ISSUER.name}><Logo height={48} /></Link>
        {own && <Link href="/account/certificates" className="fp-link" style={{ fontSize: 13 }}>My certificates <Icon name="arrowRight" size={14} stroke={2} /></Link>}
      </header>

      {!cert ? (
        <main className="cp-main cp-empty">
          <h1>{problem === "offline" ? "This certificate can't be checked right now" : "Certificate not found"}</h1>
          <p>{problem === "offline" ? "Please try again in a few minutes." : `There's no ${ISSUER.name} certificate at this address. Check the link, or the certificate ID printed on it.`}</p>
        </main>
      ) : (
        <main className="cp-main">
          <div className="cp-verified" role="status">
            <span className="cp-tick"><Icon name="check" size={16} stroke={2.6} /></span>
            <div>
              <b>Verified certificate</b>
              <span>Issued by {ISSUER.name} to <strong>{cert.name}</strong>{cert.className ? ` (${cert.className})` : ""} on {issued} for completing {cert.courseTitle}. ID {certCode(cert.id)}.</span>
            </div>
          </div>
          <CertificateCanvas ref={canvas} d={{ name: cert.name, className: cert.className, courseTitle: cert.courseTitle, lessons: cert.lessons, minutes: cert.minutes, accent: course?.accent ?? "#db3433", issuedAt: cert.issuedAt, code: certCode(cert.id), verifyUrl: certUrl(cert.id) }} />
          <div className="cp-share">
            <h2>{own ? "Share your certificate" : "Share this certificate"}</h2>
            <ShareCertificate cert={cert} canvas={canvas} own={own} />
          </div>
        </main>
      )}

      <footer className="cp-foot">
        <div>
          <b>About {ISSUER.name}</b>
          <p>{ISSUER.line}: a career assessment for every class, then short courses on money, law, entrance exams, scholarships, studying abroad, research and startups - each ending in a certificate.</p>
        </div>
        <div className="cp-foot-a">
          <Link href="/" className="fp-btn fp-btn-pri">Find your own career fit <Icon name="arrowRight" size={15} stroke={2} /></Link>
          <span className="fp-muted">{ISSUER.site} · {ISSUER.email}</span>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.cp{min-height:100vh;background:#f4f0eb;font-family:Inter,system-ui,"Segoe UI",sans-serif;color:var(--ink)}
.cp *{box-sizing:border-box}
.cp-top{max-width:1080px;margin:0 auto;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.cp-main{max-width:1080px;margin:0 auto;padding:4px 20px 8px}
.cp-empty{padding:80px 20px;text-align:center}
.cp-empty h1{font-size:26px;margin:0 0 10px}
.cp-empty p{color:var(--ink2);margin:0}
.cp-verified{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;margin-bottom:18px;background:#fff;border:1px solid #cfe8d8;border-left:4px solid var(--ok);border-radius:8px}
.cp-verified b{display:block;font-size:15px;color:var(--ok);margin-bottom:2px}
.cp-verified span{font-size:14px;line-height:1.5;color:var(--ink2)}
.cp-verified strong{color:var(--ink)}
.cp-tick{flex:none;width:28px;height:28px;border-radius:50%;background:var(--ok);color:#fff;display:grid;place-items:center}
.cp-share{margin-top:22px;padding:20px;background:#fff;border:1px solid var(--line);border-radius:8px}
.cp-share h2{font-size:18px;font-weight:600;margin:0 0 14px}
.cp-foot{max-width:1080px;margin:28px auto 0;padding:24px 20px 40px;border-top:1px solid var(--line2);display:flex;flex-wrap:wrap;gap:20px;justify-content:space-between;align-items:center}
.cp-foot b{font-family:Poppins,Inter,sans-serif;font-size:16px}
.cp-foot p{margin:6px 0 0;max-width:560px;color:var(--ink2);font-size:14px;line-height:1.55}
.cp-foot-a{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
`;
