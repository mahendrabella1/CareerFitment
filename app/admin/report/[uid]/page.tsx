"use client";

/**
 * /admin/report/[uid] — a student's report, full screen, with ZERO dashboard
 * chrome around it (no sidebar, no header) — a real route rather than
 * in-memory state, deliberately outside the (dashboard) route group, so the
 * browser's own print/save-as-PDF captures the report alone. Auth is still
 * handled by the parent app/admin/layout.tsx, which wraps this route too.
 *
 * Fetches the target user directly by uid instead of relying on data already
 * sitting in the Users table's in-memory list — works on direct navigation
 * or a refresh, not just click-through from the table.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { categoryLabel } from "@/lib/auth/formOptions";
import { type UserProfile } from "@/lib/auth/AuthProvider";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import { S as SHARED, Center, emailReport } from "../../adminShared";
import FullReport from "@/app/account/FullReport";

export default function AdminReportPage({ params }: { params: { uid: string } }) {
  const [viewing, setViewing] = useState<UserProfile | null | "loading" | "error">("loading");
  const [sent, setSent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const db = getDb();
    if (!db) { setViewing("error"); return; }
    getDoc(doc(db, "users", params.uid))
      .then((snap) => {
        if (cancelled) return;
        setViewing(snap.exists() ? (snap.data() as UserProfile) : null);
      })
      .catch(() => { if (!cancelled) setViewing("error"); });
    return () => { cancelled = true; };
  }, [params.uid]);

  async function sendReport(u: UserProfile) {
    setSent("sending");
    const r = await emailReport(u);
    setSent(r.ok ? "sent" : `error: ${r.message || "failed"}`);
  }

  if (viewing === "loading") return <Center>Loading…</Center>;
  if (viewing === "error") return <Center><p style={SHARED.muted}>Couldn&apos;t load this student.</p><BackLink /></Center>;
  if (!viewing) return <Center><p style={SHARED.muted}>No user found with this ID.</p><BackLink /></Center>;
  if (!viewing.latestAssessment) {
    return (
      <Center>
        <p style={SHARED.muted}><b>{viewing.name || viewing.email || "This student"}</b> hasn&apos;t completed an assessment yet — there&apos;s no report to show.</p>
        <BackLink />
      </Center>
    );
  }

  const a = viewing.latestAssessment;
  const completed = (() => {
    try { return new Date(a.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return ""; }
  })();

  return (
    <div style={S.reportPage}>
      <div style={S.reportBar} className="og-noprint og-adm-repbar">
        <Link href="/admin" style={S.reportBack}>
          <Icon name="chevronLeft" size={16} /> Back to users
        </Link>
        <div style={S.reportWho}>
          <b style={{ fontSize: 14 }}>{viewing.name || "—"}</b>
          <span style={{ fontSize: 12, color: C.muted }}>
            {viewing.email || "—"}
            {viewing.institution ? ` · ${viewing.institution}` : ""}
            {completed ? ` · completed ${completed}` : ""}
          </span>
        </div>
        <div style={S.reportActions}>
          <button style={SHARED.sendBtn} onClick={() => window.print()}>
            <Icon name="save" size={14} /> Print / PDF
          </button>
          {sent === "sent" ? (
            <span style={{ ...SHARED.pill, ...SHARED.pillSent }}><Icon name="check" size={13} /> Emailed</span>
          ) : (
            <button
              style={{ ...SHARED.sendBtn, ...(sent === "sending" ? { opacity: 0.6 } : {}) }}
              disabled={sent === "sending"}
              onClick={() => void sendReport(viewing)}
            >
              {sent === "sending" ? "Sending…" : "Email to student"}
            </button>
          )}
        </div>
      </div>
      <FullReport
        a={a}
        name={viewing.name}
        institution={viewing.institution || undefined}
        studentClass={viewing.category ? categoryLabel(viewing.category) : undefined}
        extraSheets={[]}
      />
    </div>
  );
}

function BackLink() {
  return <Link href="/admin" style={{ color: C.red, fontWeight: 700, fontSize: 14, marginTop: 12, display: "inline-block" }}>← Back to users</Link>;
}

const S: Record<string, React.CSSProperties> = {
  reportPage: { minHeight: "100vh", background: "#f7f7f8", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  reportBar: { position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "12px 22px", background: "rgba(255,255,255,.94)", backdropFilter: "saturate(160%) blur(10px)", borderBottom: `1px solid ${C.line}` },
  reportBack: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fff", color: C.ink2, border: `1px solid ${C.line}`, borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },
  reportWho: { display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 160 },
  reportActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
};
