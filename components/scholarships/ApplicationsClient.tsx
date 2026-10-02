"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scholarshipBySlug } from "@/data/scholarships/scholarships";
import { fetchApplications, saveApplication, type ScholarshipApplication, type ScholarshipChecklist } from "@/lib/scholarships/clientApplications";

const CHECKLIST_LABELS: { key: keyof ScholarshipChecklist; label: string }[] = [
  { key: "eligibilityConfirmed", label: "Eligibility confirmed" },
  { key: "documentsAttached", label: "Documents attached" },
  { key: "essayFinal", label: "Essay final" },
  { key: "instituteVerificationRequested", label: "Institute/teacher verification requested" },
  { key: "submitted", label: "Submitted" },
];

export function ApplicationsClient() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Record<string, ScholarshipApplication> | null>(null);

  useEffect(() => {
    if (user?.uid) fetchApplications(user.uid).then(setApps);
  }, [user?.uid]);

  async function toggleItem(slug: string, key: keyof ScholarshipChecklist, value: boolean) {
    if (!user?.uid || !apps) return;
    const current = apps[slug];
    await saveApplication(user.uid, slug, { checklist: { ...current.checklist, [key]: value } });
    setApps({ ...apps, [slug]: { ...current, checklist: { ...current.checklist, [key]: value } } });
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/scholarships" style={{ color: "#999", textDecoration: "none" }}>← Scholarships</Link>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>My applications</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>Track every scholarship you're actively applying to.</p>

      {!apps || Object.keys(apps).length === 0 ? (
        <p style={{ fontSize: 13.5, color: "#64748b" }}>No applications started yet - open a matched scholarship and tap "Start tracking this application."</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.values(apps).map((app) => {
            const scholarship = scholarshipBySlug(app.scholarshipSlug);
            if (!scholarship) return null;
            return (
              <div key={app.scholarshipSlug} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
                <Link href={`/account/scholarships/${scholarship.slug}`} style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>{scholarship.name}</Link>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {CHECKLIST_LABELS.map((c) => (
                    <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#334155" }}>
                      <input type="checkbox" checked={app.checklist[c.key]} onChange={(e) => toggleItem(app.scholarshipSlug, c.key, e.target.checked)} />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 18 }}>Institute/teacher verification is the single most common reason NSP applications fail - don't skip it.</p>
    </div>
  );
}
