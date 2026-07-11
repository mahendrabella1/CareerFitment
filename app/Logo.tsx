/** OneGrasp logo — the official PNG used in the nav, so every page matches.
 *  On dark backgrounds, place it inside a light chip (see callers) rather than
 *  recolouring the image. */
const LOGO_SRC = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";

export function Logo({ height = 34 }: { height?: number; mono?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LOGO_SRC} alt="OneGrasp" style={{ height, width: "auto", display: "block", objectFit: "contain" }} />
  );
}
