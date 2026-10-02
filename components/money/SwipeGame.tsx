"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { recordScamRound } from "@/lib/money/clientProgress";
import type { ClientScamItem, SwipeAnswer, SwipeGradeResult } from "@/lib/money/scoring";

const CHANNEL_ICON: Record<string, string> = { SMS: "💬", WhatsApp: "📱", Call: "📞", Email: "✉️", App: "🔔" };
const GREEN = "#22c55e";
const RED = "#ef4444";

export function SwipeGame({ mode, items }: { mode: "swipe" | "family"; items: ClientScamItem[] }) {
  const { user } = useAuth();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<SwipeAnswer[]>([]);
  const [result, setResult] = useState<SwipeGradeResult | null>(null);
  const startedAt = useRef(Date.now());

  const answer = async (saidScam: boolean) => {
    const next = [...answers, { itemId: items[i].id, saidScam, ms: Date.now() - startedAt.current }];
    setAnswers(next);
    startedAt.current = Date.now();
    if (i < items.length - 1) { setI(i + 1); return; }
    const res = await fetch("/api/money/grade-scam", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, answers: next }),
    });
    const data = await res.json();
    if (data.success) {
      setResult(data.result);
      if (user?.uid) await recordScamRound(user.uid, mode, data.result);
    }
  };

  if (result) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", border: "1px solid #eee", borderRadius: 16, padding: "28px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{result.accuracyPercent}%</div>
          <div style={{ color: "#888", marginTop: 4 }}>{result.correct}/{result.total} spotted correctly</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.graded.map((g) => (
            <div key={g.itemId} style={{ borderLeft: `4px solid ${g.correct ? GREEN : RED}`, background: "#fafafa", borderRadius: 6, padding: "10px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: g.isScam ? RED : GREEN, marginBottom: 4 }}>{g.isScam ? "This was a SCAM" : "This was SAFE"}{!g.correct && " — you got this one wrong"}</div>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.5 }}>{g.lesson}</p>
            </div>
          ))}
        </div>
        <button onClick={() => { setI(0); setAnswers([]); setResult(null); startedAt.current = Date.now(); }}
          style={{ marginTop: 20, width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: "#1a1a1a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
          Play again
        </button>
      </div>
    );
  }

  const item = items[i];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginBottom: 10 }}>{i + 1} of {items.length}</p>
      <div style={{ border: "1px solid #eee", borderRadius: 16, padding: "22px 20px", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>{CHANNEL_ICON[item.channel]} {item.channel}</div>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#1a1a1a", margin: 0 }}>{item.text}</p>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        <button onClick={() => answer(false)} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: `1.5px solid ${GREEN}`, background: `${GREEN}12`, color: GREEN, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          ✓ Safe
        </button>
        <button onClick={() => answer(true)} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: `1.5px solid ${RED}`, background: `${RED}12`, color: RED, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          ⚠ Scam
        </button>
      </div>
    </div>
  );
}
