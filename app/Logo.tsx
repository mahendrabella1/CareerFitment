/** OneGrasp logo — grey disc + red "G" mark and the OneGrasp wordmark. */
export function Logo({ height = 34, mono = false }: { height?: number; mono?: boolean }) {
  const red = mono ? "#fff" : "#e0242e";
  const grey = mono ? "rgba(255,255,255,0.55)" : "#4d4d4d";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: height * 0.28 }}>
      <svg height={height} viewBox="0 0 120 116" aria-label="OneGrasp" role="img" style={{ display: "block" }}>
        <circle cx="44" cy="60" r="33" fill={grey} />
        <circle cx="73" cy="57" r="37" fill={red} />
        <text x="73" y="76" textAnchor="middle" fontSize="54" fontWeight="900" fill="#fff" fontFamily="Arial, sans-serif">G</text>
      </svg>
      <span style={{ fontWeight: 800, fontSize: height * 0.52, letterSpacing: "-0.03em", lineHeight: 1, color: grey, whiteSpace: "nowrap" }}>
        One<span style={{ color: red }}>Grasp</span>
      </span>
    </span>
  );
}
