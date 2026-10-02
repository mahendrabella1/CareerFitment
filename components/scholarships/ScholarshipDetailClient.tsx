"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { ScholarshipDef } from "@/data/scholarships/scholarships";
import { SCHOLARSHIP_TYPE_LABEL } from "@/data/scholarships/scholarships";
import { evaluate } from "@/lib/scholarships/eligibility";
import { fetchScholarshipProfile, type StoredScholarshipProfile } from "@/lib/scholarships/clientProfile";
import { saveApplication } from "@/lib/scholarships/clientApplications";

const ACCENT = "#166534";

export function ScholarshipDetailClient({ scholarship }: { scholarship: ScholarshipDef }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StoredScholarshipProfile | null | undefined>(undefined);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }
    fetchScholarshipProfile(user.uid).then(setProfile);
  }, [user?.uid]);

  const result = profile ? evaluate(scholarship.rules, profile) : null;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/scholarships" style={{ color: "#999", textDecoration: "none" }}>← Scholarships</Link>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em" }}>{SCHOLARSHIP_TYPE_LABEL[scholarship.type]}</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "4px 0 4px" }}>{scholarship.name}</h1>
      <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{scholarship.provider}</p>
      <a href={scholarship.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: 8 }}>Official website ↗</a>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Amount</div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", marginTop: 3 }}>{scholarship.amountText}</div>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Apply via</div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", marginTop: 3 }}>{scholarship.applyVia}</div>
        </div>
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 18px", marginTop: 16 }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>When to apply</div>
        <p style={{ fontSize: 13, color: "#334155", margin: 0 }}>{scholarship.deadlineNote}</p>
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Your eligibility</div>
        {!profile ? (
          <p style={{ fontSize: 13, color: "#64748b" }}><Link href="/account/scholarships" style={{ color: ACCENT, fontWeight: 700 }}>Fill in your profile</Link> to see whether you qualify.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result!.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 13, color: "#334155", padding: "8px 10px", borderRadius: 8, background: "#f8fafc" }}>{r.reason}</div>
            ))}
          </div>
        )}
        <p style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 10, fontStyle: "italic" }}>Last checked {new Date(scholarship.checkedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} against {scholarship.sourceUrl.replace(/^https?:\/\//, "")}. Always confirm on the official site before applying.</p>
      </div>

      {user?.uid && (
        <button
          onClick={() => { saveApplication(user.uid, scholarship.slug, { status: "in_progress" }); setTracking(true); }}
          style={{ marginTop: 16, width: "100%", fontSize: 13.5, fontWeight: 700, padding: "12px 16px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", cursor: "pointer" }}
        >
          {tracking ? "Added to My Applications ✓" : "Start tracking this application"}
        </button>
      )}

      <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, border: "1px solid #fecaca", background: "#fef2f2" }}>
        <p style={{ fontSize: 12, color: "#991b1b", margin: 0 }}>Genuine scholarships never ask you to pay to receive money. See <Link href="/account/scholarships/safety" style={{ color: "#991b1b", fontWeight: 700 }}>scam warnings</Link> before sharing any documents.</p>
      </div>
    </div>
  );
}
