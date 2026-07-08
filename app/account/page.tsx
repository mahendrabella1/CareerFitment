"use client";

/** /account — protected page showing the signed-in user's saved details. */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { classLabel } from "@/lib/auth/formOptions";

export default function AccountPage() {
  const router = useRouter();
  const { loading, user, profile, logout, ready } = useAuth();

  useEffect(() => {
    if (!loading && ready && !user) router.replace("/signin");
  }, [loading, ready, user, router]);

  if (!ready) {
    return (
      <Centered>
        <p style={S.muted}>Accounts aren’t configured on this deployment yet.</p>
        <Link href="/" style={S.link}>← Back home</Link>
      </Centered>
    );
  }
  if (loading) return <Centered><p style={S.muted}>Loading…</p></Centered>;
  if (!user) return <Centered><p style={S.muted}>Redirecting to sign in…</p></Centered>;

  const rows: { label: string; value: string }[] = [
    { label: "Full name", value: profile?.name || user.displayName || "—" },
    { label: "Email", value: profile?.email || user.email || "—" },
    { label: "Phone", value: profile?.phone || "—" },
    { label: "City", value: profile?.city || "—" },
    { label: "Institution", value: profile?.institution || "—" },
    { label: "Class / category", value: profile?.classLevel ? classLabel(profile.classLevel) : "—" },
    { label: "Current status", value: profile?.status || "—" },
  ];

  const initial = (profile?.name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.head}>
          <div style={S.avatar}>{initial}</div>
          <div>
            <div style={S.name}>{profile?.name || user.displayName || "Your account"}</div>
            <div style={S.email}>{user.email}</div>
          </div>
        </div>

        <div style={S.table}>
          {rows.map((r) => (
            <div key={r.label} style={S.tr}>
              <span style={S.tk}>{r.label}</span>
              <span style={S.tv}>{r.value}</span>
            </div>
          ))}
        </div>

        <div style={S.actions}>
          <Link href="/" style={S.secondary}>Home</Link>
          <button style={S.logout} onClick={() => { void logout().then(() => router.push("/signin")); }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div style={{ ...S.page, alignItems: "center" }}><div style={{ textAlign: "center" }}>{children}</div></div>;
}

const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", display: "flex", justifyContent: "center", padding: "40px 20px", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  card: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 18, padding: "30px 30px 26px", boxShadow: "0 16px 50px rgba(30,41,59,.14)", height: "fit-content" },
  head: { display: "flex", alignItems: "center", gap: 16, paddingBottom: 22, borderBottom: "1px solid #eef2f6", marginBottom: 8 },
  avatar: { width: 56, height: 56, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 },
  name: { fontSize: 20, fontWeight: 800 },
  email: { fontSize: 14, color: "#64748b", marginTop: 2 },
  table: { display: "flex", flexDirection: "column" },
  tr: { display: "flex", justifyContent: "space-between", gap: 16, padding: "13px 0", borderBottom: "1px solid #f1f5f9" },
  tk: { fontSize: 13.5, color: "#64748b", fontWeight: 600 },
  tv: { fontSize: 14.5, color: "#0f172a", fontWeight: 600, textAlign: "right" },
  actions: { display: "flex", justifyContent: "space-between", marginTop: 24 },
  secondary: { padding: "11px 22px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 10, fontSize: 14.5, fontWeight: 700, textDecoration: "none" },
  logout: { padding: "11px 22px", background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 10, fontSize: 14.5, fontWeight: 700, cursor: "pointer" },
  muted: { color: "#64748b", fontSize: 15, marginBottom: 12 },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
};
