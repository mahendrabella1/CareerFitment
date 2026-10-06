import { notFound } from "next/navigation";
import { SCAM_ITEMS, FAMILY_GUARD_ITEMS } from "@/data/money/scamItems";
import { stripScamSecrets } from "@/lib/money/scoring";
import { SwipeGame } from "@/components/money/SwipeGame";
import { ScamOfTheWeekCard, SpotTheFake, TheCall, TooGoodToBeTrue } from "@/components/money/ScamModes";
import { PageHeader } from "@/components/course/fx";

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
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <PageHeader back={{ href: "/account/money/scam-shield", label: "Scam Shield" }} icon="shield" eyebrow="Scam Shield game" title={TITLES[mode]} />
      {(mode === "swipe" || mode === "family") && <SwipeGame mode={mode} items={stripScamSecrets(mode === "family" ? FAMILY_GUARD_ITEMS : SCAM_ITEMS)} />}
      {mode === "spot-the-fake" && <SpotTheFake />}
      {mode === "the-call" && <TheCall />}
      {mode === "too-good-to-be-true" && <TooGoodToBeTrue />}
      {mode === "scam-of-the-week" && <ScamOfTheWeekCard />}
    </div>
  );
}
