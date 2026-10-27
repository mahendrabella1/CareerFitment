"use client";

/**
 * The sidebar shell - applies to the 4 dashboard sections (Users, Payment
 * Settings, Coupon Codes, Institutional Links) ONLY. Deliberately a route
 * GROUP: /admin/report/[uid] sits outside it, one level up, so a student's
 * report renders with zero dashboard chrome around it - the browser's own
 * print/save-as-PDF must capture the report alone, not this sidebar. The
 * parentheses in "(dashboard)" are stripped from the URL, so every section
 * still lives at the same path it always did (/admin, /admin/coupons, ...).
 *
 * Auth is already handled by the parent app/admin/layout.tsx by the time
 * this renders - nothing here re-checks isAdmin().
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
        <div style={S.headLeft}>
          <Link href="/" style={{ textDecoration: "none", display: "flex" }}><Logo height={34} /></Link>
          <span style={S.title}>Admin</span>
        </div>
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

// Same look as the student pages: warm off-white, ink, hairlines, small corners.
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#fbfaf8", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  header: { position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 60, padding: "0 24px", background: "#fff", borderBottom: "1px solid #e8e5df" },
  headLeft: { display: "flex", alignItems: "center", gap: 14 },
  title: { fontFamily: "Poppins, Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "#16181d", paddingLeft: 14, borderLeft: "1px solid #e8e5df" },
  headRight: { display: "flex", alignItems: "center", gap: 10 },
  adminTag: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4a4f59", fontWeight: 500, background: "#f7f5f1", border: "1px solid #e8e5df", borderRadius: 6, padding: "6px 10px" },
  logout: { height: 36, padding: "0 14px", background: "#fff", color: "#16181d", border: "1px solid #d9d5cd", borderRadius: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  shell: { maxWidth: 1360, margin: "0 auto", display: "flex", alignItems: "flex-start" },
  body: { flex: 1, minWidth: 0, padding: "24px" },
};
