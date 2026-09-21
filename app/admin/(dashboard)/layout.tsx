"use client";

/**
 * The sidebar shell — applies to the 4 dashboard sections (Users, Payment
 * Settings, Coupon Codes, Institutional Links) ONLY. Deliberately a route
 * GROUP: /admin/report/[uid] sits outside it, one level up, so a student's
 * report renders with zero dashboard chrome around it — the browser's own
 * print/save-as-PDF must capture the report alone, not this sidebar. The
 * parentheses in "(dashboard)" are stripped from the URL, so every section
 * still lives at the same path it always did (/admin, /admin/coupons, ...).
 *
 * Auth is already handled by the parent app/admin/layout.tsx by the time
 * this renders — nothing here re-checks isAdmin().
 */

import Link from "next/link";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import { useAdminAuth } from "../adminShared";
import AdminSidebar from "./AdminSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { email, logout } = useAdminAuth();
  return (
    <div style={S.page}>
      <header style={S.header} className="og-adm-header">
        <Link href="/" style={{ textDecoration: "none" }}><Logo height={38} /></Link>
        <div style={S.headRight}>
          <span style={S.adminTag}><Icon name="shield" size={14} /> {email}</span>
          <button style={S.logout} onClick={() => void logout()}>Sign out</button>
        </div>
      </header>
      <div style={S.shell}>
        <AdminSidebar />
        <main style={S.body} className="og-adm-body">{children}</main>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: C.bg, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${C.line}` },
  headRight: { display: "flex", alignItems: "center", gap: 12 },
  adminTag: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.ink2, fontWeight: 600, background: C.line2, border: `1px solid ${C.line}`, borderRadius: 999, padding: "6px 12px" },
  logout: { padding: "9px 16px", background: "#fff", color: C.redStrong, border: `1px solid ${C.redLine}`, borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
  shell: { maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "flex-start" },
  body: { flex: 1, minWidth: 0, padding: "24px" },
};
