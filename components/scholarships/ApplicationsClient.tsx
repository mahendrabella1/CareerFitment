"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scholarshipBySlug, cycleDate } from "@/data/scholarships/scholarships";
import { fetchApplications, saveApplication, type ApplicationStatus, type ScholarshipApplication, type ScholarshipChecklist } from "@/lib/scholarships/clientApplications";
import { StatusChip } from "@/components/scholarships/StatusChip";

const ACCENT = "#166534";

const CHECKLIST_LABELS: { key: keyof ScholarshipChecklist; label: string; onlyIfInterview?: boolean }[] = [
  { key: "eligibilityConfirmed", label: "Eligibility confirmed on the official page" },
  { key: "documentsAttached", label: "Documents attached (current-year income certificate, bank passbook, marksheets)" },
  { key: "essayFinal", label: "Essay or statement final" },
  { key: "instituteVerificationRequested", label: "Institute or teacher verification requested" },
  { key: "submitted", label: "Submitted, with a screenshot of the confirmation saved" },
  { key: "interviewPrep", label: "Interview or test preparation done", onlyIfInterview: true },
];

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "submitted", label: "Submitted" },
  { value: "verification_pending", label: "Verification pending" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Not selected" },
];

export function ApplicationsClient() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Record<string, ScholarshipApplication> | null>(null);

  useEffect(() => {
    if (user?.uid) fetchApplications(user.uid).then(setApps).catch(() => setApps({}));
  }, [user?.uid]);

  async function update(slug: string, patch: Partial<ScholarshipApplication>) {
    if (!user?.uid || !apps) return;
    const current = apps[slug];
    await saveApplication(user.uid, slug, patch);
    setApps({ ...apps, [slug]: { ...current, ...patch, checklist: { ...current.checklist, ...(patch.checklist ?? {}) } } });
  }

  return (
    <div style={{ padding: "0 0 8px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>My applications</h1>
      <p style={{ color: "#475569", margin: "0 0 18px", fontSize: 14, lineHeight: 1.6 }}>
        Track every scholarship you are applying to. Set the status as you go; once you are <b>Selected</b>, record the payment in <Link href="/account/scholarships/won" style={{ color: ACCENT, fontWeight: 800 }}>Money won</Link>.
      </p>

      {!user?.uid ? (
        <p style={{ fontSize: 13.5, color: "#64748b" }}>Sign in to track applications.</p>
      ) : !apps || Object.keys(apps).length === 0 ? (
        <p style={{ fontSize: 13.5, color: "#64748b" }}>
          No applications yet. Open a matched scholarship from <Link href="/account/scholarships/dashboard" style={{ color: ACCENT, fontWeight: 800 }}>Money you can apply for</Link> and tap &quot;Start tracking this application&quot;.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.values(apps).map((app) => {
            const scholarship = scholarshipBySlug(app.scholarshipSlug);
            if (!scholarship) return null;
            const verifyBy = cycleDate(scholarship.cycle?.verifyBy);
            return (
              <div key={app.scholarshipSlug} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <Link href={`/account/scholarships/${scholarship.slug}`} style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", textDecoration: "none", flex: "1 1 260px", minWidth: 0 }}>{scholarship.name}</Link>
                  <StatusChip scholarship={scholarship} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "#475569" }}>
                  Status
                  <select
                    value={app.status}
                    onChange={(e) => update(app.scholarshipSlug, { status: e.target.value as ApplicationStatus })}
                    style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: 13 }}
                  >
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {app.status === "selected" && <Link href="/account/scholarships/won" style={{ color: ACCENT, fontWeight: 800 }}>Record payment →</Link>}
                </label>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {CHECKLIST_LABELS.filter((c) => !c.onlyIfInterview || scholarship.hasTestOrInterview).map((c) => (
                    <label key={c.key} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
                      <input
                        type="checkbox"
                        checked={Boolean(app.checklist?.[c.key])}
                        onChange={(e) => update(app.scholarshipSlug, { checklist: { ...app.checklist, [c.key]: e.target.checked } })}
                        style={{ marginTop: 3, accentColor: ACCENT }}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
                {verifyBy && !app.checklist?.instituteVerificationRequested && (
                  <p style={{ fontSize: 12.5, color: "#b45309", fontWeight: 700, margin: "10px 0 0" }}>
                    Ask your institution to verify your NSP application before {verifyBy.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 12, color: "#64748b", marginTop: 18, lineHeight: 1.6 }}>
        A missed institute verification is the most common reason NSP applications fail. Your college must verify your form on the portal after you submit it.
      </p>
    </div>
  );
}
