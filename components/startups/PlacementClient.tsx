"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PLACEMENT_QUESTIONS, suggestTrack } from "@/lib/startups/placement";
import { saveProfile } from "@/lib/startups/clientProgress";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#f97316";
const TRACK_LABEL: Record<string, string> = { EXPLORER: "Explorer (class 6-8)", BUILDER: "Builder (class 9-12)", FOUNDER: "Founder (college)", OPERATOR: "Operator (professionals)" };

/** The placement quiz itself - the page wraps it in the Startups course frame. */
export function PlacementClient() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [suggested, setSuggested] = useState<string | null>(null);

  const allAnswered = PLACEMENT_QUESTIONS.every((q) => answers[q.id]);

  const finish = async () => {
    const track = suggestTrack(answers);
    setSuggested(track);
    if (user?.uid) await saveProfile(user.uid, { defaultTrack: track, chosenTrack: "BUILDER" });
  };

  if (suggested) {
    const hasContent = suggested === "BUILDER";
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#999", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Your suggested track</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: ACCENT, margin: "8px 0 16px" }}>{TRACK_LABEL[suggested]}</h1>
        {!hasContent && (
          <p style={{ fontSize: 13.5, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
            Only the Builder track has lessons ready right now - the other tracks are coming soon. You can still start with Builder today.
          </p>
        )}
        <Link href="/account/startups" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 10, background: ACCENT, color: "#fff", fontWeight: 700, textDecoration: "none" }}>
          Start the Builder track →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <PageHeader icon="target" eyebrow="Find your track" title="Quick placement quiz" subtitle="5 questions, about 2 minutes." />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {PLACEMENT_QUESTIONS.map((q) => (
          <div key={q.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px" }}>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: "#1a1a1a", margin: "0 0 10px" }}>{q.prompt}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              {q.options.map((o) => {
                const active = answers[q.id] === o.id;
                return (
                  <button key={o.id} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                    style={{
                      textAlign: "left", padding: "10px 14px", borderRadius: 9, cursor: "pointer",
                      border: `1.5px solid ${active ? ACCENT : "#e2e2e2"}`, background: active ? `${ACCENT}12` : "#fff", fontSize: 13.5,
                    }}>
                    {o.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={finish} disabled={!allAnswered}
        style={{ marginTop: 20, width: "100%", maxWidth: 320, padding: "13px 0", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 15, cursor: allAnswered ? "pointer" : "default", opacity: allAnswered ? 1 : 0.4 }}>
        See my track
      </button>
    </div>
  );
}
