"use client";

/**
 * Shared across every /admin/* page: the small set of style tokens actually
 * reused in more than one place (most section-specific styling stays local
 * to that section's own file — see app/admin/(dashboard)/coupons/page.tsx
 * for the established pattern), the print/layout CSS injected once by the
 * outer layout, the "loading/blocked" centering shell, the admin identity
 * every section needs without re-deriving isAdmin() itself, and the one
 * network call ("email this student's report") more than one section makes.
 */

import { createContext, useContext } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { C } from "@/app/account/viz";

export const S: Record<string, React.CSSProperties> = {
  error: { display: "flex", alignItems: "center", gap: 8, background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },
  pill: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  dot: { width: 7, height: 7, borderRadius: "50%", flex: "none" },
  pillOk: { background: C.goodTint, color: "#1f7a55" },
  pillWait: { background: C.line2, color: C.ink3 },
  pillSent: { background: C.goodTint, color: "#1f7a55" },
  sendBtn: { padding: "6px 13px", background: "#fff", color: C.ink2, border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  muted: { color: C.ink3, fontSize: 14, padding: "8px 0" },
};

// Print/layout rules shared by every /admin screen. Injected once by
// app/admin/layout.tsx instead of the 3 identical copies the old single-file
// version carried (one per branch it could render).
export const ADMIN_CSS = `
.og-adm-table tbody tr{transition:background .12s}
.og-adm-table tbody tr:hover{background:${C.line2}}
/* Keep the printed report to the report itself. */
@media print{.og-noprint{display:none !important}}
@media (max-width: 640px){
  .og-adm-repbar{padding:10px 12px !important;gap:10px !important}
}
@media (max-width: 720px){
  .og-adm-stats{grid-template-columns:repeat(2,1fr) !important}
  .og-adm-overview{flex-direction:column;align-items:flex-start !important;gap:18px}
}
@media (max-width: 640px){
  .og-adm-header{padding:12px 14px !important}
  .og-adm-body{padding:16px 12px !important}
  .og-adm-pay [data-pay-state]{margin-left:0 !important}
}
`;

export function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>{children}</div>
    </div>
  );
}

// What every already-authenticated admin section needs, without each page
// re-deriving isAdmin(user?.email) itself — the outer layout (app/admin/layout.tsx)
// is the only place that check happens; everything under it can assume it's true.
export interface AdminAuthValue {
  email: string;
  logout: () => Promise<void>;
}
const AdminAuthContext = createContext<AdminAuthValue | null>(null);
export const AdminAuthProvider = AdminAuthContext.Provider;
export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within the /admin layout");
  return ctx;
}

/**
 * The actual "email this student's report" network call, shared by the
 * Users table and the standalone report route so there's one implementation
 * to keep correct, not two that can drift. Each caller keeps its own local
 * `sent` bookkeeping around this — they're separate component instances.
 */
export async function emailReport(u: {
  uid: string;
  email?: string | null;
  name?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  latestAssessment?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  demoReport?: any;
}): Promise<{ ok: boolean; message?: string }> {
  if (!u.email || !u.latestAssessment) return { ok: false, message: "No report to send yet." };
  try {
    const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();
    const res = await fetch("/api/admin/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Include the class 11-12 sections so the emailed PDF matches what the
      // student saw on screen. Absent for class 9-10, and the PDF omits the
      // page rather than printing an empty one.
      body: JSON.stringify({ idToken, to: u.email, name: u.name, report: u.latestAssessment, demo: u.demoReport ?? null }),
    });
    const data = await res.json();
    return { ok: res.ok && Boolean(data?.success), message: data?.message };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "failed" };
  }
}
