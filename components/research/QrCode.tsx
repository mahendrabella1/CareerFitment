"use client";

import { useMemo } from "react";
import qrcode from "qrcode-generator";

/** A QR code for a URL, drawn as SVG in the browser (no network call). */
export function QrCode({ value, size = 160, label }: { value: string; size?: number; label: string }) {
  const { svg, dataUrl } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    return { svg: qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true }), dataUrl: qr.createDataURL(8, 4) };
  }, [value]);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      <div role="img" aria-label={label} style={{ width: size, height: size, background: "#fff", padding: 4, borderRadius: 8 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <a href={dataUrl} download="research-profile-qr.gif" style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed" }}>Download QR code</a>
    </div>
  );
}
