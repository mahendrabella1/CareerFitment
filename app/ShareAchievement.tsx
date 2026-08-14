"use client";

/**
 * ShareAchievement — the "I did it" card a student can post after finishing the
 * assessment, and the growth loop that comes with it: every share carries a
 * link back to careerfitment.onegrasp.com.
 *
 * WHAT IT DELIBERATELY DOES NOT SHARE: any result. No scores, no career
 * matches, no traits — a psychometric profile is private, and a student
 * cheerfully posting one to LinkedIn at 16 cannot consent to how that follows
 * them. The card carries their name, the fact they completed the assessment,
 * and the date. That is the achievement; the results stay in their dashboard.
 *
 * Channels work differently and the UI has to be honest about it:
 *   • WhatsApp   wa.me takes prefilled text — one tap, everything filled in.
 *   • LinkedIn   share-offsite takes a URL only; LinkedIn builds the preview
 *                from the page's own OG tags and ignores any text we pass, so
 *                the caption is copied to the clipboard for pasting.
 *   • Instagram  has NO web share intent. Nothing can prefill an Instagram
 *                post from a browser, so pretending otherwise with a button
 *                that opens instagram.com would just be a dead end. Instead the
 *                card downloads as a 1080x1080 image to add to a story, with
 *                the caption copied ready to paste.
 *   • Native     navigator.share on a phone covers all of the above at once,
 *                including Instagram, so it is offered first when available.
 *
 * The image is drawn on a <canvas> rather than rasterised from the DOM: no
 * html2canvas dependency, and the logo is served from our own /public so the
 * canvas stays untainted and toBlob() actually works.
 */

import { useCallback, useRef, useState } from "react";
import { Icon } from "@/app/Icons";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");
const LOGO = "/onegrasp-logo-tight.png";

/** Per-channel UTM, so the growth this actually drives is measurable. */
function shareUrl(channel: string): string {
  return `${SITE_URL}/?utm_source=${channel}&utm_medium=social&utm_campaign=student_share`;
}

const CAPTION = (first: string) =>
  `${first ? `I'm ${first}, and I` : "I"} just completed the OneGrasp Career Fitment Assessment — a look at how I think, learn and work across 8 dimensions, and the careers that actually fit.\n\nIf you're deciding what to do next, it's worth 30 minutes:`;

export default function ShareAchievement({ name, date }: { name?: string; date?: Date }) {
  const first = (name || "").trim().split(/\s+/)[0] || "";
  const full = (name || "").trim();
  const when = date ?? new Date();
  const dateLabel = when.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const [copied, setCopied] = useState<"link" | "caption" | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const copy = useCallback(async (text: string, what: "link" | "caption") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 2200);
    } catch {
      /* clipboard blocked (insecure context / permissions) — the buttons below
         still work, so this is not worth an error state */
    }
  }, []);

  /** Draw the 1080x1080 card. Resolves to a blob, or null if canvas is unavailable. */
  const renderCard = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const S = 1080;
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background — deep indigo with a soft radial lift, so the card reads on
    // both a white feed and a dark one.
    ctx.fillStyle = "#151a2e";
    ctx.fillRect(0, 0, S, S);
    const glow = ctx.createRadialGradient(S / 2, S * 0.32, 40, S / 2, S * 0.32, S * 0.75);
    glow.addColorStop(0, "rgba(99,102,241,0.42)");
    glow.addColorStop(1, "rgba(21,26,46,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, S, S);

    // Rounded inner panel
    const pad = 64, r = 44;
    ctx.beginPath();
    ctx.moveTo(pad + r, pad);
    ctx.arcTo(S - pad, pad, S - pad, S - pad, r);
    ctx.arcTo(S - pad, S - pad, pad, S - pad, r);
    ctx.arcTo(pad, S - pad, pad, pad, r);
    ctx.arcTo(pad, pad, S - pad, pad, r);
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const centre = (text: string, y: number, font: string, fill: string, spacing = 0) => {
      ctx.font = font; ctx.fillStyle = fill; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (!spacing) { ctx.fillText(text, S / 2, y); return; }
      // Manual letter-spacing: ctx.letterSpacing is not in every browser yet.
      const chars = [...text];
      const width = chars.reduce((w, c) => w + ctx.measureText(c).width + spacing, -spacing);
      let x = S / 2 - width / 2;
      ctx.textAlign = "left";
      for (const c of chars) { ctx.fillText(c, x, y); x += ctx.measureText(c).width + spacing; }
      ctx.textAlign = "center";
    };

    // Logo, drawn from our own origin so the canvas is never tainted.
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const h = 58, w = (img.width / img.height) * h;
        ctx.drawImage(img, S / 2 - w / 2, 132, w, h);
        resolve();
      };
      img.onerror = () => resolve(); // no logo is better than no card
      img.src = LOGO;
    });

    // Tick medallion
    ctx.beginPath();
    ctx.arc(S / 2, 352, 74, 0, Math.PI * 2);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 13; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(S / 2 - 33, 352);
    ctx.lineTo(S / 2 - 9, 377);
    ctx.lineTo(S / 2 + 35, 328);
    ctx.stroke();

    centre("ASSESSMENT COMPLETED", 474, "700 25px Arial, Helvetica, sans-serif", "#8ef0b4", 4);

    // The name is the point of the card, so it gets the space — and shrinks
    // rather than overflowing when it is a long one.
    let nameSize = 82;
    ctx.font = `800 ${nameSize}px Georgia, 'Times New Roman', serif`;
    while (ctx.measureText(full || "Your name").width > S - 220 && nameSize > 40) {
      nameSize -= 4;
      ctx.font = `800 ${nameSize}px Georgia, 'Times New Roman', serif`;
    }
    centre(full || "Your name", 566, `800 ${nameSize}px Georgia, 'Times New Roman', serif`, "#ffffff");

    centre("has successfully completed the", 646, "400 30px Arial, Helvetica, sans-serif", "rgba(255,255,255,0.72)");
    centre("OneGrasp Career Fitment Assessment", 700, "700 37px Arial, Helvetica, sans-serif", "#c7d2fe");
    centre("8 dimensions · personality · interests · aptitude · strengths", 762, "400 24px Arial, Helvetica, sans-serif", "rgba(255,255,255,0.55)");

    // Footer rule + date and site
    ctx.beginPath();
    ctx.moveTo(280, 838); ctx.lineTo(S - 280, 838);
    ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 2; ctx.stroke();
    centre(dateLabel, 886, "400 26px Arial, Helvetica, sans-serif", "rgba(255,255,255,0.6)");
    centre("careerfitment.onegrasp.com", 948, "700 30px Arial, Helvetica, sans-serif", "#ffffff", 1);

    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png", 0.95));
  }, [full, dateLabel]);

  const download = useCallback(async () => {
    setBusy(true);
    try {
      const blob = await renderCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `onegrasp-${(first || "assessment").toLowerCase()}-career-fitment.png`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      await copy(`${CAPTION(first)} ${shareUrl("instagram")}`, "caption");
    } finally { setBusy(false); }
  }, [renderCard, first, copy]);

  /** One-tap share on a phone — this is the path that reaches Instagram. */
  const nativeShare = useCallback(async () => {
    const url = shareUrl("native");
    const text = CAPTION(first);
    setBusy(true);
    try {
      const blob = await renderCard();
      const file = blob ? new File([blob], "onegrasp-career-fitment.png", { type: "image/png" }) : null;
      // Share the card itself where the platform allows it, and fall back to
      // text + link where it doesn't.
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${text} ${url}` });
      } else {
        await navigator.share({ title: "OneGrasp Career Fitment", text, url });
      }
    } catch {
      /* the user dismissed the sheet — not an error */
    } finally { setBusy(false); }
  }, [renderCard, first]);

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="sa-wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />

      <div className="sa-head">
        <span className="sa-head-ic"><Icon name="score" size={17} /></span>
        <div>
          <div className="sa-head-t">Share your achievement</div>
          <div className="sa-head-s">Only your name and the date — your results stay private</div>
        </div>
      </div>

      {/* A preview of what actually gets posted, so nobody shares blind. */}
      <div className="sa-card">
        <div className="sa-card-tick"><Icon name="check" size={22} stroke={3} /></div>
        <div className="sa-card-kick">Assessment completed</div>
        <div className="sa-card-name">{full || "Your name"}</div>
        <div className="sa-card-sub">has successfully completed the</div>
        <div className="sa-card-title">OneGrasp Career Fitment Assessment</div>
        <div className="sa-card-foot">
          <span>{dateLabel}</span>
          <span className="sa-card-url">careerfitment.onegrasp.com</span>
        </div>
      </div>

      <div className="sa-btns">
        {canNativeShare && (
          <button className="sa-btn sa-btn-primary" onClick={() => void nativeShare()} disabled={busy}>
            <Icon name="chevronRight" size={15} /> Share
          </button>
        )}
        <a
          className="sa-btn sa-wa"
          href={`https://wa.me/?text=${encodeURIComponent(`${CAPTION(first)} ${shareUrl("whatsapp")}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <a
          className="sa-btn sa-li"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl("linkedin"))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => void copy(CAPTION(first), "caption")}
        >
          LinkedIn
        </a>
        <button className="sa-btn sa-ig" onClick={() => void download()} disabled={busy}>
          {busy ? "Preparing…" : "Instagram / Save image"}
        </button>
        <button className="sa-btn" onClick={() => void copy(shareUrl("copy"), "link")}>
          {copied === "link" ? "Link copied ✓" : "Copy link"}
        </button>
      </div>

      {copied === "caption" && (
        <div className="sa-note sa-note-ok">
          Caption copied — paste it when you post. For Instagram, add the saved
          image to your story or feed.
        </div>
      )}
      <div className="sa-note">
        Instagram doesn’t let a website fill in a post, so the card downloads as an
        image for you to add yourself.
      </div>
    </div>
  );
}

const CSS = `
.sa-wrap{text-align:left;background:#fbfcff;border:1px solid #e6eaf5;border-radius:16px;padding:18px 18px 16px;margin:0 0 24px}
.sa-head{display:flex;align-items:center;gap:11px;margin-bottom:14px}
.sa-head-ic{width:32px;height:32px;flex:none;border-radius:9px;background:#eef2ff;color:#3b5bdb;display:grid;place-items:center}
.sa-head-t{font-size:15px;font-weight:800;color:#0f172a}
.sa-head-s{font-size:12px;color:#7b8496;margin-top:1px}

.sa-card{position:relative;overflow:hidden;border-radius:14px;padding:20px 18px 16px;text-align:center;
  background:radial-gradient(120% 90% at 50% 0%,#2c3566 0%,#151a2e 62%);border:1px solid #2b3358}
.sa-card-tick{width:46px;height:46px;margin:0 auto 10px;border-radius:50%;background:#22c55e;color:#fff;display:grid;place-items:center}
.sa-card-kick{font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#8ef0b4}
.sa-card-name{font-family:Georgia,'Times New Roman',serif;font-size:25px;font-weight:800;color:#fff;margin:7px 0 0;line-height:1.2;word-break:break-word}
.sa-card-sub{font-size:11.5px;color:rgba(255,255,255,.7);margin-top:8px}
.sa-card-title{font-size:14.5px;font-weight:800;color:#c7d2fe;margin-top:3px}
.sa-card-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:15px;padding-top:11px;
  border-top:1px solid rgba(255,255,255,.16);font-size:10.5px;color:rgba(255,255,255,.6)}
.sa-card-url{font-weight:800;color:#fff}
@media(max-width:420px){.sa-card-foot{flex-direction:column;gap:4px}}

.sa-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.sa-btn{flex:1 1 auto;min-width:112px;padding:10px 12px;border-radius:10px;border:1.5px solid #dfe4ef;background:#fff;
  color:#3d4657;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;text-align:center;text-decoration:none;
  display:inline-flex;align-items:center;justify-content:center;gap:6px}
.sa-btn:hover{background:#f3f6ff;border-color:#c9d4f5}
.sa-btn:disabled{opacity:.6;cursor:default}
.sa-btn-primary{background:#171624;border-color:#171624;color:#fff;flex-basis:100%}
.sa-btn-primary:hover{background:#2b2a3f;border-color:#2b2a3f}
.sa-wa{color:#0b7a45;border-color:#bfe6d1}
.sa-wa:hover{background:#effaf3}
.sa-li{color:#12557f;border-color:#c2ddf0}
.sa-li:hover{background:#eef7fd}
.sa-ig{color:#a6296c;border-color:#f0c6de}
.sa-ig:hover{background:#fdf0f7}

.sa-note{font-size:11px;line-height:1.5;color:#8a919f;margin-top:10px}
.sa-note-ok{color:#15803d;font-weight:600}
`;
