import { notFound } from "next/navigation";
import Link from "next/link";
import { SCAM_ITEMS, FAMILY_GUARD_ITEMS } from "@/data/money/scamItems";
import { stripScamSecrets } from "@/lib/money/scoring";
import { SwipeGame } from "@/components/money/SwipeGame";

const TITLES: Record<string, string> = { swipe: "Safe or Scam", family: "Family Guard" };

export default function ScamModePage({ params }: { params: { mode: string } }) {
  const mode = params.mode as "swipe" | "family";
  if (mode !== "swipe" && mode !== "family") notFound();
  const items = mode === "family" ? FAMILY_GUARD_ITEMS : SCAM_ITEMS;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/money/scam-shield" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Scam Shield</Link>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 20px" }}>{TITLES[mode]}</h1>
      <SwipeGame mode={mode} items={stripScamSecrets(items)} />
    </div>
  );
}
