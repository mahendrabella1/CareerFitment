import { notFound } from "next/navigation";
import Link from "next/link";
import { SCAM_ITEMS, FAMILY_GUARD_ITEMS } from "@/data/money/scamItems";
import { stripScamSecrets } from "@/lib/money/scoring";
import { SwipeGame } from "@/components/money/SwipeGame";
import { ScamOfTheWeekCard, SpotTheFake, TheCall, TooGoodToBeTrue } from "@/components/money/ScamModes";

const TITLES: Record<string, string> = {
  swipe: "Safe or Scam",
  family: "Family Guard",
  "spot-the-fake": "Spot the Fake",
  "the-call": "The Call",
  "too-good-to-be-true": "Too Good to Be True",
  "scam-of-the-week": "Scam of the Week",
};

export default function ScamModePage({ params }: { params: { mode: string } }) {
  const mode = params.mode;
  if (!TITLES[mode]) notFound();

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/money/scam-shield" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Scam Shield</Link>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 20px" }}>{TITLES[mode]}</h1>
      {(mode === "swipe" || mode === "family") && <SwipeGame mode={mode} items={stripScamSecrets(mode === "family" ? FAMILY_GUARD_ITEMS : SCAM_ITEMS)} />}
      {mode === "spot-the-fake" && <SpotTheFake />}
      {mode === "the-call" && <TheCall />}
      {mode === "too-good-to-be-true" && <TooGoodToBeTrue />}
      {mode === "scam-of-the-week" && <ScamOfTheWeekCard />}
    </div>
  );
}
