/**
 * The link-preview image of a certificate (1200 × 630) - what LinkedIn,
 * WhatsApp, Facebook and X show when a certificate link is shared. Rendered
 * by next/og (app/certificate/[id]/opengraph-image.tsx); fonts come from
 * Google Fonts as TTF (next/og can't read the site's woff2), with the
 * built-in font if that fails.
 */
import { certCode, certCourse, ISSUER, type CertRecord } from "./catalog";

export const OG_SIZE = { width: 1200, height: 630 };

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 600 | 700; style: "normal" };

async function googleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error("no font");
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error("no font");
  return res.arrayBuffer();
}

/** Poppins (headings) and Inter (text), cut down to the characters on the image. */
export async function ogFonts(text: string): Promise<OgFont[]> {
  try {
    const [bold, semi, regular] = await Promise.all([googleFont("Poppins", 700, text), googleFont("Poppins", 600, text), googleFont("Inter", 400, text)]);
    return [
      { name: "Poppins", data: bold, weight: 700, style: "normal" },
      { name: "Poppins", data: semi, weight: 600, style: "normal" },
      { name: "Inter", data: regular, weight: 400, style: "normal" },
    ];
  } catch {
    return [];
  }
}

const RED = "#db3433", INK = "#16181d", MUTED = "#5d616c", FAINT = "#8b8f99";

export function ogText(c: CertRecord | null): string {
  return c ? `OneGrasp CERTIFICATE OF COMPLETION ${c.name} ${c.className} has completed the course ${c.courseTitle} Verified ${certCode(c.id)} ${ISSUER.site} ·` : `OneGrasp Certificate ${ISSUER.site}`;
}

export function ogElement(c: CertRecord | null) {
  const accent = (c && certCourse(c.course)?.accent) || RED;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f0eb", padding: 34, fontFamily: "Inter" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", background: "#fffdf8", border: `6px solid ${RED}`, padding: "30px 70px" }}>
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, bottom: 12, border: "2px solid #c9a86a", display: "flex" }} />
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, height: 8, background: accent, display: "flex" }} />
        <div style={{ display: "flex", fontFamily: "Poppins", fontWeight: 700, fontSize: 40 }}>
          <span style={{ color: INK }}>One</span><span style={{ color: RED }}>Grasp</span>
        </div>
        {c ? (
          // next/og lays a fragment's children out in a row - one column box instead.
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", marginTop: 14, fontFamily: "Poppins", fontWeight: 600, fontSize: 22, letterSpacing: 6, color: RED }}>CERTIFICATE OF COMPLETION</div>
            <div style={{ display: "flex", marginTop: 24, fontFamily: "Poppins", fontWeight: 700, fontSize: c.name.length > 26 ? 50 : 64, color: INK, textAlign: "center" }}>{c.name}</div>
            {c.className ? <div style={{ display: "flex", marginTop: 4, fontSize: 26, color: "#3d4049" }}>{c.className}</div> : null}
            <div style={{ display: "flex", marginTop: 20, fontSize: 26, color: MUTED }}>has completed the course</div>
            <div style={{ display: "flex", marginTop: 6, fontFamily: "Poppins", fontWeight: 700, fontSize: c.courseTitle.length > 28 ? 40 : 48, color: accent, textAlign: "center" }}>{c.courseTitle}</div>
          </div>
        ) : (
          <div style={{ display: "flex", marginTop: 18, fontFamily: "Poppins", fontWeight: 600, fontSize: 30, color: MUTED }}>Certificate</div>
        )}
        {c ? <div style={{ display: "flex", position: "absolute", bottom: 34, fontSize: 19, color: FAINT }}>{`Verified · ${certCode(c.id)} · ${ISSUER.site}`}</div> : null}
      </div>
    </div>
  );
}
