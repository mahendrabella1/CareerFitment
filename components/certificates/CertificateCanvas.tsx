"use client";
/** The certificate on screen - a canvas scaled to its box, the same pixels as the shared image. */
import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react";
import { CERT_H, CERT_W, drawCertificate, type CertDrawing } from "./drawCertificate";

export const CertificateCanvas = forwardRef<HTMLCanvasElement | null, { d: CertDrawing; style?: CSSProperties; className?: string }>(
  function CertificateCanvas({ d, style, className }, ref) {
    const canvas = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => canvas.current as HTMLCanvasElement, []);
    const key = JSON.stringify(d);
    useEffect(() => {
      if (canvas.current) void drawCertificate(canvas.current, d);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    return (
      <canvas
        ref={canvas}
        width={CERT_W}
        height={CERT_H}
        className={className}
        role="img"
        aria-label={`Certificate of completion${d.preview ? " (preview)" : ""}: ${d.name}${d.className ? `, ${d.className}` : ""}, completed ${d.courseTitle} on OneGrasp`}
        style={{ display: "block", width: "100%", height: "auto", aspectRatio: `${CERT_W} / ${CERT_H}`, background: "#fffdf8", borderRadius: 6, boxShadow: "0 18px 40px -22px rgba(20,20,25,.45), 0 2px 6px rgba(20,20,25,.06)", ...style }}
      />
    );
  },
);
