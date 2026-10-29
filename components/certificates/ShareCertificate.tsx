"use client";
/**
 * Sharing a certificate: add it to LinkedIn's "Licenses & certifications",
 * post the link (LinkedIn, WhatsApp, Facebook, X - each shows the certificate
 * as the link preview), download the image (Instagram has no link sharing:
 * post the image), or the phone's own share sheet with the image attached.
 */
import { useEffect, useState, type RefObject } from "react";
import { Icon } from "@/app/Icons";
import { certCode, type CertRecord } from "@/lib/certificates/catalog";
import { certUrl, shareLinks, shareText } from "@/lib/certificates/client";
import { certificateBlob } from "./drawCertificate";

const BRAND: Record<string, { label: string; color: string; path: string; stroke?: boolean }> = {
  linkedin: { label: "LinkedIn", color: "#0a66c2", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z" },
  whatsapp: { label: "WhatsApp", color: "#1fa855", path: "M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm5.8 14.1c-.25.7-1.45 1.33-2 1.4-.52.07-1.17.1-1.9-.12-.43-.14-1-.33-1.71-.64-3-1.3-4.97-4.34-5.12-4.54-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.2 1.05-2.5.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.67.5.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.14 1.01 2.1 1.33 2.4 1.48.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.12.08.72-.17 1.42z" },
  facebook: { label: "Facebook", color: "#1877f2", path: "M14 8h3V4.5h-3c-2.5 0-4 1.6-4 4V11H7.5v3.5H10V22h3.6v-7.5h3l.5-3.5h-3.5V8.9c0-.6.3-.9.9-.9z" },
  x: { label: "X", color: "#16181d", path: "M4 3h4.6l4.1 5.6L17.6 3H20l-6.2 7.1L21 21h-4.6l-4.5-6.1L6.4 21H4l6.8-7.8z" },
};

function Brand({ k, size = 18 }: { k: keyof typeof BRAND; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={BRAND[k].path} fill="currentColor" /></svg>;
}

export function ShareCertificate({ cert, canvas, own }: { cert: CertRecord; canvas: RefObject<HTMLCanvasElement | null>; own: boolean }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNative, setCanNative] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUrl(certUrl(cert.id));
    setCanNative(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [cert.id]);
  if (!url) return null;
  const links = shareLinks(cert, url, own);
  const fileName = `OneGrasp-certificate-${cert.courseTitle.replace(/[^a-z0-9]+/gi, "-")}-${certCode(cert.id)}.png`;

  const download = async () => {
    const c = canvas.current;
    const blob = c && await certificateBlob(c);
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  const nativeShare = async () => {
    setBusy(true);
    try {
      const c = canvas.current;
      const blob = c && await certificateBlob(c);
      const file = blob ? new File([blob], fileName, { type: "image/png" }) : null;
      const text = `${shareText(cert, own)} ${url}`;
      if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: cert.courseTitle, text });
      else await navigator.share({ title: cert.courseTitle, text: shareText(cert, own), url });
    } catch { /* cancelled */ }
    setBusy(false);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { window.prompt("Copy this link", url); }
  };

  return (
    <div className="crt-share">
      <div className="crt-share-main">
        {own && (
          <a href={links.linkedinProfile} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-pri crt-li">
            <Brand k="linkedin" size={17} /> Add to LinkedIn profile
          </a>
        )}
        <button type="button" className="fp-btn" onClick={() => void download()}>
          <Icon name="save" size={16} stroke={2} /> Download image
        </button>
        {canNative && (
          <button type="button" className="fp-btn" onClick={() => void nativeShare()} disabled={busy}>
            <Icon name="arrowRight" size={16} stroke={2} /> Share…
          </button>
        )}
      </div>
      <div className="crt-share-row">
        <span className="fp-muted">Share on</span>
        {(["linkedin", "whatsapp", "facebook", "x"] as const).map((k) => (
          <a key={k} href={links[k]} target="_blank" rel="noopener noreferrer" className="crt-soc" style={{ ["--b" as string]: BRAND[k].color }} aria-label={`Share on ${BRAND[k].label}`} title={BRAND[k].label}>
            <Brand k={k} />
          </a>
        ))}
        <button type="button" className="crt-soc crt-copy" onClick={() => void copy()} aria-label="Copy link">
          {copied ? <><Icon name="check" size={15} stroke={2.4} /> Copied</> : <>Copy link</>}
        </button>
      </div>
      <p className="fp-muted" style={{ margin: 0 }}>For Instagram, download the image and add it to your post or story. Anyone with the link can check it&apos;s real.</p>
    </div>
  );
}

export const SHARE_CSS = `
.crt-share{display:grid;gap:14px;align-content:start}
.crt-share-main{display:flex;flex-wrap:wrap;gap:8px}
.crt-share-main .fp-btn{height:40px}
.crt-li{background:#0a66c2;border-color:#0a66c2}
.crt-li:hover{background:#004182;border-color:#004182}
.crt-share-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.crt-soc{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:38px;height:38px;padding:0 10px;border:1px solid var(--line2,#d9d5cd);border-radius:999px;background:#fff;color:var(--b,#16181d);font:inherit;font-size:13px;font-weight:600;text-decoration:none;cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.crt-soc:hover{background:var(--b,#16181d);border-color:var(--b,#16181d);color:#fff}
.crt-copy{color:#16181d;padding:0 14px}
`;
