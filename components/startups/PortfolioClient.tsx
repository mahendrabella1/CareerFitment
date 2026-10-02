"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchTaskSubmissions, type TaskSubmissionRow } from "@/lib/startups/clientProgress";

const ACCENT = "#f97316";
const KIND_LABEL: Record<string, string> = { task: "Lesson task", mission: "Real-world mission", portfolio: "Portfolio item" };

export function PortfolioClient({ moduleTitles }: { moduleTitles: Record<string, string> }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<TaskSubmissionRow[] | null>(null);

  useEffect(() => {
    if (!user?.uid) { setRows([]); return; }
    fetchTaskSubmissions(user.uid).then(setRows);
  }, [user?.uid]);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/startups" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Startups</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 4px" }}>Your Startup Portfolio</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 24px" }}>Everything you've built, from your own idea - real proof of work.</p>

      {rows === null && <p style={{ color: "#888" }}>Loading…</p>}
      {rows && rows.length === 0 && (
        <div style={{ border: "1px dashed #ddd", borderRadius: 12, padding: 32, textAlign: "center", color: "#999" }}>
          Nothing here yet - complete a lesson task or module mission and it'll show up here.
        </div>
      )}
      {rows && rows.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: ".03em" }}>{KIND_LABEL[r.kind]}</span>
                <span style={{ fontSize: 11.5, color: "#aaa" }}>{moduleTitles[r.moduleSlug] ?? r.moduleSlug}</span>
              </div>
              <p style={{ fontSize: 14, color: "#333", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
