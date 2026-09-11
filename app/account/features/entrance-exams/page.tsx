"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import FeaturesDetailPage from "@/app/account/features/FeaturesDetailPage";
import { colors, spacing } from "@/app/account/designTokens";

export default function EntranceExamsPage() {
  const router = useRouter();
  const { loading, user, ready } = useAuth();
  if (!ready || loading) return <div style={styles.page}><p style={styles.muted}>Loading…</p></div>;
  if (!user) { router.replace("/signin"); return null; }
  return (
    <div style={styles.page}>
      <header style={styles.header} className="og-noprint">
        <Link href="/account" style={{ textDecoration: "none" }}><Logo height={38} /></Link>
        <div><span style={styles.email}>{user.email}</span><button style={styles.backBtn} onClick={() => router.back()}>← Back</button></div>
      </header>
      <div style={styles.content}><FeaturesDetailPage featureId="exams" onClose={() => router.back()} /></div>
    </div>
  );
}
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: colors.ink[95], fontFamily: "system-ui, -apple-system, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: spacing[4], borderBottom: `1px solid ${colors.ink[80]}`, background: "#fff" },
  email: { fontSize: 12, color: colors.ink[20], marginRight: spacing[4] },
  backBtn: { padding: `${spacing[2]} ${spacing[4]}`, background: colors.ink[95], border: `1px solid ${colors.ink[80]}`, borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, color: colors.ink[30] },
  content: { padding: spacing[4] },
  muted: { color: colors.ink[20], fontSize: 14 },
};
