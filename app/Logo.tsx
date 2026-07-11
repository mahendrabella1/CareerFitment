/** OneGrasp logo — the official PNG used in the nav, so every page matches.
 *  `mono` renders it white for dark backgrounds. */
const LOGO_SRC = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";

export function Logo({ height = 34, mono = false }: { height?: number; mono?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="OneGrasp"
      style={{
        height,
        width: "auto",
        display: "block",
        objectFit: "contain",
        ...(mono ? { filter: "brightness(0) invert(1)" } : {}),
      }}
    />
  );
}
