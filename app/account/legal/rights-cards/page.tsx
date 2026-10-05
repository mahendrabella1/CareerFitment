import { LegalShell } from "@/components/legal/LegalShell";
import { RightsCards } from "@/components/legal/RightsCards";

export default function LegalRightsCardsPage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 980 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".08em" }}>Keep them on your phone</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Rights cards</h1>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
          Short cards for the moments that matter. Save a card as an image to your phone&apos;s photos, or copy the text to share it. Each card links to its full guide.
        </p>
        <RightsCards />
      </div>
    </LegalShell>
  );
}
