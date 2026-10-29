/**
 * The certificate, drawn on a canvas (2000 × 1414, landscape A4) - so what is
 * on screen is exactly the image that is downloaded and shared. Uses the
 * site's own fonts (Poppins, Inter - public/fonts) and logo.
 */
import qrcode from "qrcode-generator";
import { ISSUER, learningTime } from "@/lib/certificates/catalog";

export const CERT_W = 2000;
export const CERT_H = 1414;

export interface CertDrawing {
  name: string;
  className: string;
  courseTitle: string;
  lessons: number;
  minutes: number;
  accent: string;
  issuedAt?: number;
  /** "OG-…" - with verifyUrl, printed with a QR code. Left out on a preview. */
  code?: string;
  verifyUrl?: string;
  /** "Preview" across it: what the student will get once they finish. */
  preview?: boolean;
}

const INK = "#16181d", MUTED = "#5d616c", FAINT = "#8b8f99", RED = "#db3433", GOLD = "#c9a86a", PAPER = "#fffdf8";
const fontOf = (w: number, size: number, family: "Poppins" | "Inter") => `${w} ${size}px ${family}, system-ui, sans-serif`;

let logo: Promise<HTMLImageElement | null> | null = null;
function loadLogo(): Promise<HTMLImageElement | null> {
  logo ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/onegrasp-logo-tight.png";
  });
  return logo;
}

async function fontsReady(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all([
    "400 32px Inter", "500 32px Inter", "600 32px Inter",
    "500 32px Poppins", "600 32px Poppins", "700 32px Poppins",
  ].map((f) => document.fonts.load(f).catch(() => undefined)));
}

/** Text spaced out letter by letter (canvas letterSpacing isn't everywhere yet). */
function tracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  const chars = [...text];
  const width = chars.reduce((s, c) => s + ctx.measureText(c).width, 0) + spacing * (chars.length - 1);
  let at = x - width / 2;
  ctx.textAlign = "left";
  for (const c of chars) { ctx.fillText(c, at, y); at += ctx.measureText(c).width + spacing; }
  ctx.textAlign = "center";
}

/** The largest size (down to `min`) at which `text` fits in `maxW`. */
function fitSize(ctx: CanvasRenderingContext2D, text: string, weight: number, family: "Poppins" | "Inter", size: number, min: number, maxW: number): number {
  for (let s = size; s > min; s -= 2) {
    ctx.font = fontOf(weight, s, family);
    if (ctx.measureText(text).width <= maxW) return s;
  }
  ctx.font = fontOf(weight, min, family);
  return min;
}

function seal(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const r = 92;
  ctx.save();
  ctx.fillStyle = RED;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, r - 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r - 44, 0, Math.PI * 2); ctx.stroke();
  // Words around the ring.
  const words = "ONEGRASP • CERTIFIED • ";
  ctx.fillStyle = "#fff"; ctx.font = fontOf(600, 16, "Poppins"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const chars = [...words];
  chars.forEach((ch, i) => {
    const a = (i / chars.length) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * (r - 28), cy + Math.sin(a) * (r - 28));
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  // A tick in the middle.
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(cx - 20, cy + 1); ctx.lineTo(cx - 5, cy + 16); ctx.lineTo(cx + 22, cy - 14); ctx.stroke();
  ctx.restore();
  ctx.textBaseline = "alphabetic";
}

function qr(ctx: CanvasRenderingContext2D, url: string, x: number, y: number, size: number) {
  const q = qrcode(0, "M");
  q.addData(url);
  q.make();
  const n = q.getModuleCount();
  const cell = size / (n + 2);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = INK;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (q.isDark(r, c)) ctx.fillRect(x + (c + 1) * cell, y + (r + 1) * cell, Math.ceil(cell), Math.ceil(cell));
  }
}

export async function drawCertificate(canvas: HTMLCanvasElement, d: CertDrawing): Promise<void> {
  const [img] = await Promise.all([loadLogo(), fontsReady()]);
  canvas.width = CERT_W;
  canvas.height = CERT_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = CERT_W, H = CERT_H, cx = W / 2;

  // Paper and frame.
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.strokeRect(44, 44, W - 88, H - 88);
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
  // Corner marks.
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3;
  for (const [x, y, sx, sy] of [[86, 86, 1, 1], [W - 86, 86, -1, 1], [86, H - 86, 1, -1], [W - 86, H - 86, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(x, y + sy * 70); ctx.lineTo(x, y); ctx.lineTo(x + sx * 70, y); ctx.stroke();
  }
  // The course's colour, as a thin band at the top.
  ctx.fillStyle = d.accent; ctx.fillRect(70, 70, W - 140, 10);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Logo.
  // The logo file has a white background: "multiply" lets the paper show through it.
  if (img) {
    const h = 112, w = (img.width / img.height) * h;
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.drawImage(img, cx - w / 2, 124, w, h); ctx.restore();
  }
  else { ctx.fillStyle = INK; ctx.font = fontOf(700, 64, "Poppins"); ctx.fillText(ISSUER.name, cx, 200); }

  ctx.fillStyle = RED; ctx.font = fontOf(600, 36, "Poppins");
  tracked(ctx, "CERTIFICATE OF COMPLETION", cx, 320, 9);
  // Ornament: two rules and a diamond.
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 190, 362); ctx.lineTo(cx - 18, 362); ctx.moveTo(cx + 18, 362); ctx.lineTo(cx + 190, 362); ctx.stroke();
  ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(cx, 352); ctx.lineTo(cx + 10, 362); ctx.lineTo(cx, 372); ctx.lineTo(cx - 10, 362); ctx.closePath(); ctx.fill();

  ctx.fillStyle = MUTED; ctx.font = fontOf(400, 36, "Inter");
  ctx.fillText("This is to certify that", cx, 462);

  ctx.fillStyle = INK; fitSize(ctx, d.name, 700, "Poppins", 108, 56, 1480);
  ctx.fillText(d.name, cx, 590);
  ctx.strokeStyle = "#e4dccd"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 470, 628); ctx.lineTo(cx + 470, 628); ctx.stroke();

  let y = 690;
  if (d.className) {
    ctx.fillStyle = "#3d4049"; ctx.font = fontOf(500, 34, "Inter");
    ctx.fillText(d.className, cx, y);
    y += 82;
  } else y += 30;
  ctx.fillStyle = MUTED; ctx.font = fontOf(400, 36, "Inter");
  ctx.fillText("has successfully completed the course", cx, y);

  ctx.fillStyle = d.accent; fitSize(ctx, d.courseTitle, 700, "Poppins", 76, 44, 1500);
  ctx.fillText(d.courseTitle, cx, y + 104);
  ctx.fillStyle = FAINT; ctx.font = fontOf(400, 30, "Inter");
  ctx.fillText(`${d.lessons} lessons · ${learningTime(d.minutes)} of learning on ${ISSUER.name}`, cx, y + 166);

  // Bottom row: date | seal | certificate id and QR.
  const base = 1176;
  ctx.strokeStyle = "#d9cfbd"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(220, base - 50); ctx.lineTo(600, base - 50); ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = INK; ctx.font = fontOf(600, 34, "Poppins");
  ctx.fillText(d.issuedAt ? new Date(d.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "On completion", 220, base - 70);
  ctx.fillStyle = FAINT; ctx.font = fontOf(600, 21, "Inter");
  trackedLeft(ctx, "DATE OF ISSUE", 220, base - 14, 3);
  ctx.fillStyle = INK; ctx.font = fontOf(600, 30, "Poppins");
  ctx.fillText(`${ISSUER.name}`, 220, base + 44);
  ctx.fillStyle = FAINT; ctx.font = fontOf(400, 22, "Inter");
  ctx.fillText("Issuing organisation", 220, base + 78);

  seal(ctx, cx, base - 10);

  if (d.code && d.verifyUrl) {
    const size = 176, qx = W - 220 - size, qy = base - 120;
    qr(ctx, d.verifyUrl, qx, qy, size);
    ctx.textAlign = "right";
    ctx.fillStyle = FAINT; ctx.font = fontOf(600, 21, "Inter");
    trackedRight(ctx, "CERTIFICATE ID", qx - 28, qy + 50, 3);
    ctx.fillStyle = INK; ctx.font = fontOf(600, 32, "Poppins");
    ctx.fillText(d.code, qx - 28, qy + 92);
    ctx.fillStyle = FAINT; ctx.font = fontOf(400, 22, "Inter");
    ctx.fillText("Scan to verify", qx - 28, qy + 130);
  }

  // Issuer line.
  ctx.textAlign = "center";
  ctx.fillStyle = FAINT; ctx.font = fontOf(400, 23, "Inter");
  ctx.fillText(`${ISSUER.name} · ${ISSUER.line} · ${ISSUER.site} · ${ISSUER.email}`, cx, H - 112);

  if (d.preview) {
    ctx.save();
    ctx.translate(cx, H / 2);
    ctx.rotate(-Math.PI / 9);
    ctx.fillStyle = "rgba(219,52,51,.09)";
    ctx.font = fontOf(700, 260, "Poppins");
    ctx.fillText("PREVIEW", 0, 90);
    ctx.restore();
  }
}

/** Left-aligned spaced text. */
function trackedLeft(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  let at = x;
  for (const c of text) { ctx.fillText(c, at, y); at += ctx.measureText(c).width + spacing; }
}
/** Right-aligned spaced text. */
function trackedRight(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  const width = [...text].reduce((s, c) => s + ctx.measureText(c).width, 0) + spacing * (text.length - 1);
  ctx.textAlign = "left";
  trackedLeft(ctx, text, x - width, y, spacing);
  ctx.textAlign = "right";
}

/** The drawn certificate as a PNG. */
export function certificateBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
