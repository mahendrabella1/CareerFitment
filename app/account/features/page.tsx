"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import FeaturesHub from "@/app/account/FeaturesHub";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { C } from "@/app/account/viz";

export default function FeaturesPage() {
  const router = useRouter();
  const { loading, user, ready } = useAuth();

  if (!ready) {
    return (
      <div style={S.page}>
        <p style={S.muted}>Features aren't configured yet.</p>
      </div>
    );
  }

  if (loading) return <div style={S.page}><p style={S.muted}>Loading…</p></div>;

  if (!user) {
    router.replace("/signin");
    return null;
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <header style={S.header} className="og-noprint">
        <Link href="/account" style={{ textDecoration: "none" }}>
          <Logo height={38} />
        </Link>
        <div>
          <span style={S.email}>{user.email}</span>
          <button
            style={S.backBtn}
            onClick={() => router.back()}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Features Hub */}
      <FeaturesHub />
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "Inter, system-ui, Segoe UI, sans-serif",
    color: C.ink,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "#fff",
    borderBottom: `1px solid ${C.line}`,
  },
  email: {
    fontSize: 13,
    color: C.ink[60],
    marginRight: 16,
  },
  backBtn: {
    padding: "9px 16px",
    background: "#fff",
    color: C.red,
    border: `1px solid ${C.redLine}`,
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  muted: {
    color: C.ink[60],
    fontSize: 15,
    marginBottom: 12,
  },
};
