"use client";

/** /institution/decisions - the next big decision each class faces, with a personal brief per student. */
import { useMemo, useState } from "react";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { Section } from "@/components/institution/ui";
import { send } from "@/components/institution/useApi";
import { decisionBriefText, decisionMomentFor, examsFor } from "@/lib/institution/features";
import { HowItWorks } from "@/components/HowItWorks";

export default function DecisionsPage() {
  const { students } = usePortal();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const now = Date.now();
  const groups = useMemo(() => {
    const m = new Map<string, NonNullable<typeof students>>();
    for (const s of (students ?? []).filter((x) => !x.archived)) { const k = s.category || "unknown"; m.set(k, [...(m.get(k) ?? []), s]); }
    const order = ["class_6", "class_7", "class_8", "class_9_10", "class_11", "class_11_12", "class_12", "graduate"];
    const rank = (k: string) => (order.indexOf(k) < 0 ? 99 : order.indexOf(k));
    return [...m.entries()].sort((a, b) => rank(a[0]) - rank(b[0]));
  }, [students]);
  if (!students) return <div className="ip-empty">Loading…</div>;

  const sendBriefs = async (cls: string) => {
    setBusy(cls); setMsg("");
    try { const r = await send<{ sent: number }>("/api/institution/decisions", "POST", { classes: [cls] }); setMsg(`Sent ${r.sent} personal decision briefs to ${categoryLabel(cls)}.`); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Could not send."); }
    finally { setBusy(null); }
  };

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Decision briefs</h1>
          <p className="ip-sub">Every class has a big decision coming - stream choice, entrance exams, course and college, internships. Send each student their own one-page brief: the decision, their best fits and goal, the exam dates that matter for them, and the questions to settle with parents and the counsellor.</p>
        </div>
      </div>
      <HowItWorks id="portal-decisions" steps={["Each class is shown with the big decision it faces next - stream, entrance exams, course and college, internships.", "Press 'See an example brief' to preview what a student will get.", "Press 'Send briefs' - every student gets their own brief: their fits and goal, the exam dates that matter to them, and questions to settle at home."]} sync={"Each brief arrives in the student's dashboard inbox as a recommendation, and they can reply to it."} />
      {msg && <div className="ip-alert good">{msg}</div>}
      {groups.map(([cls, rows]) => {
        const moment = decisionMomentFor(rows[0]);
        const withExams = rows.filter((r) => examsFor(r, now).length).length;
        return (
          <Section key={cls} title={`${cls === "unknown" ? "Class not stated" : categoryLabel(cls)}: ${moment.title}`} icon="signpost" aside={`${rows.length} students`} style={{ marginBottom: 12 }}>
            <p style={{ margin: "0 0 8px", lineHeight: 1.6 }}>{moment.why}</p>
            <div className="ip-muted" style={{ marginBottom: 10 }}>{withExams} of {rows.length} students have entrance exams to plan for in their career areas - each brief lists the dates, or the expected timing where the new dates aren&apos;t announced yet.</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="ip-btn sm" disabled={busy === cls || cls === "unknown"} onClick={() => void sendBriefs(cls)}>{busy === cls ? "Sending…" : `Send briefs to all ${rows.length}`}</button>
              <button className="ip-btn ghost sm" onClick={() => setPreview(preview === cls ? null : cls)}>{preview === cls ? "Hide example" : "See an example brief"}</button>
            </div>
            {preview === cls && (() => { const b = decisionBriefText(rows.find((r) => r.assessment.status === "completed") ?? rows[0], now); return (
              <div className="ip-insight info" style={{ marginTop: 10, display: "block", whiteSpace: "pre-line" }}><b style={{ display: "block", marginBottom: 6 }}>{b.title}</b>{b.body}</div>
            ); })()}
          </Section>
        );
      })}
    </>
  );
}
