"use client";

/**
 * Mentor Review Queue - Phase 1 simplification: gated behind the existing
 * admin allowlist (lib/auth/admins.ts), because this app has no dedicated
 * mentor-invite/role system yet. A real mentor network (teachers, PhD
 * students, retired experts per the plan's section 12 rollout) needs its
 * own invite flow and role - flagged here as a real gap, not hidden. For
 * Phase 1, an admin reviewing the queue themselves lets the review
 * mechanism (rubric scoring, approve/revise) actually be tested end to end.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isAdmin } from "@/lib/auth/admins";
import { fetchPendingReviews, submitReview, type AbstractVersion } from "@/lib/research/clientProgress";
import { RUBRIC_ITEMS, isApproved, type RubricScores } from "@/lib/research/rubric";

const ACCENT = "#7c3aed";

export default function MentorQueuePage() {
  const { user } = useAuth();
  const admin = isAdmin(user?.email);
  const [queue, setQueue] = useState<AbstractVersion[] | null>(null);

  useEffect(() => { if (admin) fetchPendingReviews().then(setQueue); }, [admin]);

  if (!admin) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <p style={{ color: "#888" }}>Mentor review access is limited to the OneGrasp team for now. If you're a mentor, reach out to get added.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Mentor Review Queue</h1>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 22px" }}>{queue?.length ?? 0} abstract{queue?.length === 1 ? "" : "s"} awaiting review.</p>

      {queue === null && <p style={{ color: "#888" }}>Loading…</p>}
      {queue?.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>Nothing to review right now.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {queue?.map((a) => <ReviewCard key={a.id} abstractItem={a} onDone={() => fetchPendingReviews().then(setQueue)} />)}
      </div>
    </div>
  );
}

function ReviewCard({ abstractItem, onDone }: { abstractItem: AbstractVersion; onDone: () => void }) {
  const [scores, setScores] = useState<RubricScores>(Object.fromEntries(RUBRIC_ITEMS.map((i) => [i, 3])) as RubricScores);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try { await submitReview(abstractItem.id, scores, comments, isApproved(scores)); onDone(); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "16px 20px" }}>
      <p style={{ fontSize: 13, color: "#999", margin: "0 0 10px" }}>Version {abstractItem.version} · {abstractItem.wordCount} words</p>
      <p style={{ fontSize: 13, color: "#333", lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto", background: "#fafafa", borderRadius: 8, padding: 10, margin: "0 0 14px" }}>{abstractItem.text}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {RUBRIC_ITEMS.map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 12.5, color: "#444" }}>{item}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4].map((n) => (
                <button key={n} onClick={() => setScores((s) => ({ ...s, [item]: n }))}
                  style={{
                    width: 24, height: 24, borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    border: `1.5px solid ${scores[item] === n ? ACCENT : "#e2e2e2"}`, background: scores[item] === n ? ACCENT : "#fff", color: scores[item] === n ? "#fff" : "#888",
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Comments for the learner (what to fix, what's working)" rows={3}
        style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd", padding: 10, fontSize: 12.5, fontFamily: "inherit", resize: "vertical", marginBottom: 10, boxSizing: "border-box" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: isApproved(scores) ? "#166534" : "#92400e" }}>
          {isApproved(scores) ? "Would approve (every item ≥ 3)" : "Would send back (some item below 3)"}
        </span>
        <button onClick={submit} disabled={submitting} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {submitting ? "Saving…" : "Submit review"}
        </button>
      </div>
    </div>
  );
}
