"use client";

/**
 * ShareAchievement — the "I did it" card a student can post after finishing the
 * assessment, and the growth loop that comes with it: every share carries a
 * link back to careerfitment.onegrasp.com.
 *
 * The card has one job beyond celebrating: it has to make the person SEEING it
 * want to take the assessment too. So it reads as a certificate rather than a
 * screenshot — gold medallion, the student's name set large in a serif, and
 * three chips that tell a stranger what the thing actually is (8 dimensions,
 * 60+ questions, a personalised report). A plain "I finished a test" post
 * recruits nobody.
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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");
const LOGO = "/onegrasp-logo-tight.png";

/** Per-channel UTM, so the growth this actually drives is measurable. */
function shareUrl(channel: string): string {
  return `${SITE_URL}/?utm_source=${channel}&utm_medium=social&utm_campaign=student_share`;
}

const CAPTION = (first: string) =>
  `${first ? `I'm ${first}, and I` : "I"} just completed the OneGrasp Career Fitment Assessment 🎯\n\n60+ questions across 8 dimensions — personality, interests, aptitude, strengths — and a personalised report on the careers that actually fit me.\n\nIf you're deciding what to do next, it's worth 30 minutes:`;

/* Brand marks, inlined. Recognisable colour + logo is most of why a share row
   reads as "share" at a glance rather than as four grey buttons. */
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.78 9.78 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.8 9.8M20.5 3.5A11.7 11.7 0 0 0 12.05 0C5.56 0 .28 5.28.28 11.77c0 2.07.54 4.1 1.57 5.88L.18 24l6.5-1.7a11.72 11.72 0 0 0 5.37 1.36h.01c6.49 0 11.77-5.28 11.77-11.77 0-3.15-1.22-6.1-3.44-8.33"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z"/>
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/>
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);

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
      window.setTimeout(() => setCopied(null), 2600);
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

    const GOLD = "#f5c04e", GOLD_DEEP = "#d99a1f";

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const centre = (text: string, y: number, font: string, fill: string | CanvasGradient, spacing = 0) => {
      ctx.font = font; ctx.fillStyle = fill; ctx.textBaseline = "middle";
      if (!spacing) { ctx.textAlign = "center"; ctx.fillText(text, S / 2, y); return; }
      // Manual letter-spacing: ctx.letterSpacing is not in every browser yet.
      const chars = [...text];
      const width = chars.reduce((w, c) => w + ctx.measureText(c).width + spacing, -spacing);
      let x = S / 2 - width / 2;
      ctx.textAlign = "left";
      for (const c of chars) { ctx.fillText(c, x, y); x += ctx.measureText(c).width + spacing; }
      ctx.textAlign = "center";
    };

    /* ---- background: deep indigo, warmed from the top-left ---- */
    const bg = ctx.createLinearGradient(0, 0, S, S);
    bg.addColorStop(0, "#232a55");
    bg.addColorStop(0.5, "#171c36");
    bg.addColorStop(1, "#0f1226");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, S, S);

    const glow = (cx: number, cy: number, r: number, colour: string) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, colour);
      g.addColorStop(1, "rgba(15,18,38,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
    };
    glow(S / 2, 300, 620, "rgba(99,102,241,0.40)");
    glow(120, S - 90, 480, "rgba(217,70,160,0.16)");
    glow(S - 110, 110, 420, "rgba(56,189,248,0.14)");

    // Faint concentric arcs behind the medallion — depth without clutter.
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 2;
    for (const r of [230, 320, 410]) { ctx.beginPath(); ctx.arc(S / 2, 372, r, 0, Math.PI * 2); ctx.stroke(); }

    /* ---- gold hairline frame ---- */
    const frame = ctx.createLinearGradient(0, 60, S, S - 60);
    frame.addColorStop(0, "rgba(245,192,78,0.75)");
    frame.addColorStop(0.5, "rgba(245,192,78,0.22)");
    frame.addColorStop(1, "rgba(245,192,78,0.75)");
    ctx.strokeStyle = frame; ctx.lineWidth = 2.5;
    roundRect(52, 52, S - 104, S - 104, 40); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1.5;
    roundRect(68, 68, S - 136, S - 136, 30); ctx.stroke();

    /* ---- logo ---- */
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const h = 52, w = (img.width / img.height) * h;
        ctx.drawImage(img, S / 2 - w / 2, 122, w, h);
        resolve();
      };
      img.onerror = () => resolve(); // no logo is better than no card
      img.src = LOGO;
    });

    /* ---- gold medallion with laurels ---- */
    const my = 372;
    const med = ctx.createLinearGradient(S / 2 - 90, my - 90, S / 2 + 90, my + 90);
    med.addColorStop(0, "#ffe08a"); med.addColorStop(0.5, GOLD); med.addColorStop(1, GOLD_DEEP);
    ctx.beginPath(); ctx.arc(S / 2, my, 88, 0, Math.PI * 2);
    ctx.fillStyle = med; ctx.fill();
    ctx.beginPath(); ctx.arc(S / 2, my, 104, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(245,192,78,0.42)"; ctx.lineWidth = 3; ctx.stroke();

    // Laurel sprigs either side.
    ctx.strokeStyle = "rgba(245,192,78,0.65)"; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(S / 2, my, 132, dir === -1 ? Math.PI * 0.62 : Math.PI * 0.14, dir === -1 ? Math.PI * 1.38 : Math.PI * 0.86, dir === -1);
      ctx.stroke();
    }

    // Tick
    ctx.strokeStyle = "#1b2340"; ctx.lineWidth = 15; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(S / 2 - 38, my + 2); ctx.lineTo(S / 2 - 11, my + 30); ctx.lineTo(S / 2 + 41, my - 27);
    ctx.stroke();

    /* ---- titles ---- */
    centre("CERTIFICATE OF COMPLETION", 536, "700 24px Arial, Helvetica, sans-serif", GOLD, 5.5);

    // The name is the point of the card, so it gets the space — and shrinks
    // rather than overflowing when it is a long one.
    let nameSize = 88;
    const fit = (s: number) => { ctx.font = `700 ${s}px Georgia, 'Times New Roman', serif`; return ctx.measureText(full || "Your name").width; };
    while (fit(nameSize) > S - 230 && nameSize > 38) nameSize -= 3;
    centre(full || "Your name", 622, `700 ${nameSize}px Georgia, 'Times New Roman', serif`, "#ffffff");

    // Gold flourish under the name
    const fw = Math.min(S - 260, Math.max(260, fit(nameSize) + 70));
    const fl = ctx.createLinearGradient(S / 2 - fw / 2, 0, S / 2 + fw / 2, 0);
    fl.addColorStop(0, "rgba(245,192,78,0)"); fl.addColorStop(0.5, GOLD); fl.addColorStop(1, "rgba(245,192,78,0)");
    ctx.fillStyle = fl; ctx.fillRect(S / 2 - fw / 2, 674, fw, 3);

    centre("has successfully completed the", 716, "400 27px Arial, Helvetica, sans-serif", "rgba(255,255,255,0.66)");
    centre("Career Fitment Assessment", 762, "700 40px Arial, Helvetica, sans-serif", "#dfe4ff");

    /* ---- three chips: what a stranger needs to know ---- */
    const chips = ["8 DIMENSIONS", "60+ QUESTIONS", "PERSONALISED REPORT"];
    ctx.font = "700 19px Arial, Helvetica, sans-serif";
    const widths = chips.map((c) => ctx.measureText(c).width + 44);
    const gap = 16;
    let cx = S / 2 - (widths.reduce((a, b) => a + b, 0) + gap * (chips.length - 1)) / 2;
    chips.forEach((c, i) => {
      roundRect(cx, 818, widths[i], 50, 25);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(c, cx + widths[i] / 2, 844);
      cx += widths[i] + gap;
    });

    /* ---- footer ----
       Bottom-anchored against the gold inner frame, which ends at S-68 = 1012.
       The pill is 56 tall, so it starts at 926 and closes at 982 — 30px of
       breathing room. Push it any lower and the pill crosses the frame line. */
    centre(dateLabel, 900, "400 24px Arial, Helvetica, sans-serif", "rgba(255,255,255,0.5)");
    const url = "careerfitment.onegrasp.com";
    ctx.font = "700 28px Arial, Helvetica, sans-serif";
    const uw = ctx.measureText(url).width + 60;
    roundRect(S / 2 - uw / 2, 926, uw, 56, 28);
    const pill = ctx.createLinearGradient(S / 2 - uw / 2, 0, S / 2 + uw / 2, 0);
    pill.addColorStop(0, "#6366f1"); pill.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = pill; ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(url, S / 2, 954);

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
        <span className="sa-head-badge">🎉</span>
        <div>
          <div className="sa-head-t">Share your achievement</div>
          <div className="sa-head-s">Only your name and the date — your results stay private</div>
        </div>
      </div>

      {/* A preview of what actually gets posted, so nobody shares blind. */}
      <div className="sa-card">
        <div className="sa-card-frame" />
        <div className="sa-medal"><span>✓</span></div>
        <div className="sa-card-kick">Certificate of completion</div>
        <div className="sa-card-name">{full || "Your name"}</div>
        <div className="sa-flourish" />
        <div className="sa-card-sub">has successfully completed the</div>
        <div className="sa-card-title">Career Fitment Assessment</div>
        <div className="sa-chips">
          <span>8 dimensions</span><span>60+ questions</span><span>Personalised report</span>
        </div>
        <div className="sa-card-foot">
          <span className="sa-card-date">{dateLabel}</span>
          <span className="sa-card-url">careerfitment.onegrasp.com</span>
        </div>
      </div>

      {/* The OS share sheet is the ONLY route to Instagram Story, WhatsApp
          Status, Snapchat, Telegram and everything else on the phone — no
          website can target those directly. So it leads, and the per-app
          buttons below it are the desktop fallback. */}
      {canNativeShare && (
        <>
          <button className="sa-btn sa-primary" onClick={() => void nativeShare()} disabled={busy}>
            <IconShare /> {busy ? "Preparing your card…" : "Share to any app"}
          </button>
          <div className="sa-hint">
            Opens your phone’s share sheet with the card attached — pick
            <b> Instagram</b> (Story or Post), <b>WhatsApp</b> (a chat or
            <b> My Status</b>), Snapchat, Telegram, or anything else installed.
          </div>
        </>
      )}

      <div className="sa-btns">
        <a
          className="sa-btn sa-wa"
          href={`https://wa.me/?text=${encodeURIComponent(`${CAPTION(first)} ${shareUrl("whatsapp")}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconWhatsApp /> WhatsApp
        </a>
        <a
          className="sa-btn sa-li"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl("linkedin"))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => void copy(CAPTION(first), "caption")}
        >
          <IconLinkedIn /> LinkedIn
        </a>
        <button className="sa-btn sa-ig" onClick={() => void download()} disabled={busy}>
          <IconInstagram /> {busy ? "Saving…" : "Save image"}
        </button>
        <button className="sa-btn sa-copy" onClick={() => void copy(shareUrl("copy"), "link")}>
          <IconLink /> {copied === "link" ? "Copied ✓" : "Copy link"}
        </button>
      </div>

      {copied === "caption" && (
        <div className="sa-note sa-note-ok">
          ✓ Card saved and caption copied — add the image to your Instagram Story
          or Post, or to your WhatsApp Status, and paste the caption.
        </div>
      )}
      <div className="sa-note">
        {canNativeShare
          ? "Instagram Story vs Post, and WhatsApp chat vs Status, are chosen inside those apps — no website can pick for you, so the share sheet above hands them the card and you choose there."
          : "On a phone you’ll also get a “Share to any app” button, which reaches Instagram Story, WhatsApp Status and every other app installed."}
      </div>
    </div>
  );
}

const CSS = `
.sa-wrap{text-align:left;background:linear-gradient(180deg,#fbfcff,#f6f8ff);border:1px solid #e3e8f7;
  border-radius:18px;padding:18px 18px 16px;margin:0 0 24px}
.sa-head{display:flex;align-items:center;gap:11px;margin-bottom:14px}
.sa-head-badge{width:34px;height:34px;flex:none;border-radius:10px;background:#fff5e0;border:1px solid #f6e2b4;
  display:grid;place-items:center;font-size:17px}
.sa-head-t{font-size:15px;font-weight:800;color:#0f172a}
.sa-head-s{font-size:11.5px;color:#7b8496;margin-top:1px}

/* --- the certificate preview --- */
.sa-card{position:relative;overflow:hidden;border-radius:16px;padding:22px 20px 16px;text-align:center;
  background:linear-gradient(145deg,#232a55 0%,#171c36 52%,#0f1226 100%);
  box-shadow:0 16px 38px rgba(15,18,38,.28)}
.sa-card::before{content:"";position:absolute;left:50%;top:-40%;width:150%;height:150%;transform:translateX(-50%);
  background:radial-gradient(closest-side,rgba(99,102,241,.42),rgba(15,18,38,0));pointer-events:none}
.sa-card::after{content:"";position:absolute;right:-20%;bottom:-30%;width:90%;height:90%;
  background:radial-gradient(closest-side,rgba(217,70,160,.18),rgba(15,18,38,0));pointer-events:none}
.sa-card-frame{position:absolute;inset:9px;border-radius:11px;border:1px solid rgba(245,192,78,.45);pointer-events:none}
.sa-card > *:not(.sa-card-frame){position:relative;z-index:1}

.sa-medal{width:56px;height:56px;margin:2px auto 12px;border-radius:50%;
  background:linear-gradient(140deg,#ffe08a,#f5c04e 50%,#d99a1f);
  display:grid;place-items:center;box-shadow:0 0 0 5px rgba(245,192,78,.18)}
.sa-medal span{color:#1b2340;font-size:26px;font-weight:900;line-height:1}
.sa-card-kick{font-size:9.5px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#f5c04e}
.sa-card-name{font-family:Georgia,'Times New Roman',serif;font-size:27px;font-weight:700;color:#fff;
  margin:8px 0 0;line-height:1.18;word-break:break-word}
.sa-flourish{width:120px;height:2px;margin:9px auto 0;
  background:linear-gradient(90deg,rgba(245,192,78,0),#f5c04e,rgba(245,192,78,0))}
.sa-card-sub{font-size:11.5px;color:rgba(255,255,255,.62);margin-top:10px}
.sa-card-title{font-size:16px;font-weight:800;color:#dfe4ff;margin-top:2px;letter-spacing:.01em}
.sa-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:13px}
.sa-chips span{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  color:rgba(255,255,255,.86);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.17);
  border-radius:999px;padding:5px 10px}
.sa-card-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:15px;padding-top:11px;
  border-top:1px solid rgba(255,255,255,.14);font-size:10px}
.sa-card-date{color:rgba(255,255,255,.5)}
.sa-card-url{font-weight:800;color:#fff;background:linear-gradient(90deg,#6366f1,#8b5cf6);
  border-radius:999px;padding:5px 11px}
@media(max-width:420px){.sa-card-foot{flex-direction:column;gap:7px}}

/* --- share row --- */
.sa-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.sa-btn{flex:1 1 auto;min-width:130px;padding:11px 13px;border-radius:11px;border:1.5px solid transparent;
  font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;text-align:center;text-decoration:none;
  display:inline-flex;align-items:center;justify-content:center;gap:7px;color:#fff;
  transition:transform .12s ease,filter .12s ease,box-shadow .12s ease}
.sa-btn:hover{transform:translateY(-1px);filter:brightness(1.06)}
.sa-btn:active{transform:none}
.sa-btn:disabled{opacity:.65;cursor:default;transform:none;filter:none}
.sa-btn svg{flex:none}
.sa-primary{display:flex;width:100%;margin-top:14px;padding:14px;font-size:14.5px;
  background:linear-gradient(90deg,#171624,#33305a);box-shadow:0 8px 20px rgba(23,22,36,.24)}
.sa-hint{font-size:11px;line-height:1.55;color:#6b7280;margin:8px 2px 0;text-align:center}
.sa-hint b{color:#3d4657;font-weight:800}
.sa-wa{background:#25D366;box-shadow:0 8px 18px rgba(37,211,102,.28)}
.sa-li{background:#0A66C2;box-shadow:0 8px 18px rgba(10,102,194,.26)}
.sa-ig{background:linear-gradient(90deg,#F58529,#DD2A7B 55%,#8134AF);box-shadow:0 8px 18px rgba(221,42,123,.26)}
.sa-copy{background:#fff;color:#3d4657;border-color:#dfe4ef;box-shadow:none}
.sa-copy:hover{background:#f3f6ff;border-color:#c9d4f5}

.sa-note{font-size:10.5px;line-height:1.5;color:#8a919f;margin-top:10px}
.sa-note-ok{color:#15803d;font-weight:700}
`;
