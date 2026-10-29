import { ImageResponse } from "next/og";
import { OG_SIZE, ogElement, ogFonts, ogText } from "@/lib/certificates/og";
import { loadCertificate } from "./load";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "OneGrasp certificate of completion";

export default async function Image({ params }: { params: { id: string } }) {
  const r = await loadCertificate(params.id);
  const cert = r.state === "ok" ? r.cert : null;
  return new ImageResponse(ogElement(cert), { ...OG_SIZE, fonts: await ogFonts(ogText(cert)) });
}
