"use client";

/**
 * /admin — admin dashboard. An admin (email in lib/auth/admins.ts) signs in and
 * sees every registered user, their details, and assessment status/result.
 * Reads the Firestore `users` collection (allowed for admins by firestore.rules).
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { useAuth, authErrorMessage, type UserProfile } from "@/lib/auth/AuthProvider";
import { isAdmin, ADMIN_LOGIN_EMAIL } from "@/lib/auth/admins";
import { categoryLabel } from "@/lib/auth/formOptions";
import { getDb, getFirebaseAuth } from "@/lib/firebase/client";

export default function AdminPage() {
  const { ready, loading, user, logout, signIn } = useAuth();
  const admin = isAdmin(user?.email);

  const [email, setEmail] = useState(ADMIN_LOGIN_EMAIL);
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function adminSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setSigningIn(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setLoginError(authErrorMessage(err));
    } finally {
      setSigningIn(false);
    }
  }

  const [rows, setRows] = useState<UserProfile[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sent, setSent] = useState<Record<string, string>>({}); // uid -> sending|sent|error msg
  const [bulk, setBulk] = useState(false);

  async function sendReport(u: UserProfile) {
    if (!u.email || !u.latestAssessment) return;
    setSent((s) => ({ ...s, [u.uid]: "sending" }));
    try {
      const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();
      const res = await fetch("/api/admin/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, to: u.email, name: u.name, report: u.latestAssessment }),
      });
      const data = await res.json();
      setSent((s) => ({ ...s, [u.uid]: res.ok && data.success ? "sent" : `error: ${data.message || "failed"}` }));
    } catch (e) {
      setSent((s) => ({ ...s, [u.uid]: `error: ${e instanceof Error ? e.message : "failed"}` }));
    }
  }

  async function sendAll(list: UserProfile[]) {
    setBulk(true);
    for (const u of list) {
      if (u.email && u.latestAssessment && sent[u.uid] !== "sent") {
        // eslint-disable-next-line no-await-in-loop
        await sendReport(u);
      }
    }
    setBulk(false);
  }

  useEffect(() => {
    if (!admin) return;
    const db = getDb();
    if (!db) return;
    setFetching(true);
    getDocs(collection(db, "users"))
      .then((snap) => setRows(snap.docs.map((d) => d.data() as UserProfile)))
      .catch((e) => setError(e?.message || "Failed to load users."))
      .finally(() => setFetching(false));
  }, [admin]);

  const filtered = useMemo(() => {
    const list = rows ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((u) =>
      [u.name, u.email, u.phone, u.institution].filter(Boolean).some((v) => v!.toLowerCase().includes(term))
    );
  }, [rows, q]);

  const stats = useMemo(() => {
    const list = rows ?? [];
    const completed = list.filter((u) => u.latestAssessment).length;
    const ratings = list
      .map((u) => u.latestAssessment?.feedbackRating)
      .filter((r): r is number => typeof r === "number");
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";
    return { total: list.length, completed, pending: list.length - completed, avg };
  }, [rows]);

  if (!ready) return <Center>Accounts aren’t configured on this deployment yet.</Center>;
  if (loading) return <Center>Loading…</Center>;
  if (!user) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <form onSubmit={adminSignIn} style={S.loginCard}>
          <div style={S.loginBadge}>🔐</div>
          <h1 style={S.loginTitle}>Admin sign in</h1>
          <p style={S.loginSub}>Restricted to OneGrasp administrators.</p>
          {loginError && <div style={S.error}>{loginError}</div>}
          <label style={S.loginLabel}>Email</label>
          <input style={S.loginInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@onegrasp.com" />
          <label style={{ ...S.loginLabel, marginTop: 12 }}>Password</label>
          <input style={S.loginInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit" style={{ ...S.loginBtn, ...(signingIn ? { opacity: 0.6 } : {}) }} disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }
  if (!admin) {
    return (
      <Center>
        <p style={S.muted}>You’re signed in as <b>{user.email}</b>, which isn’t an admin account.</p>
        <button style={S.linkBtn} onClick={() => void logout()}>Sign out</button>
      </Center>
    );
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <Link href="/" className="og-logo" style={S.logo}>One<span>Grasp</span></Link>
        <div style={S.headRight}>
          <span style={S.adminTag}>Admin · {user.email}</span>
          <button style={S.logout} onClick={() => void logout()}>Sign out</button>
        </div>
      </header>

      <div style={S.body}>
        <h1 style={S.title}>Admin dashboard</h1>

        <div style={S.statGrid}>
          <Stat label="Registered users" value={stats.total} />
          <Stat label="Completed assessment" value={stats.completed} color="#16a34a" />
          <Stat label="Not yet taken" value={stats.pending} color="#d97706" />
          <Stat label="Avg. feedback" value={stats.avg} color="#3b4a9c" />
        </div>

        <div style={S.tableCard}>
          <div style={S.tableHead}>
            <div style={S.tableTitle}>Users {rows ? `(${filtered.length})` : ""}</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input style={S.search} placeholder="Search name / email / phone…" value={q} onChange={(e) => setQ(e.target.value)} />
              <button
                style={{ ...S.bulkBtn, ...(bulk ? { opacity: 0.6, cursor: "wait" } : {}) }}
                disabled={bulk || !filtered.some((u) => u.latestAssessment)}
                onClick={() => void sendAll(filtered)}
              >
                {bulk ? "Emailing…" : "✉ Email all completed"}
              </button>
            </div>
          </div>

          {error && <div style={S.error}>{error}</div>}
          {fetching && <div style={S.muted}>Loading users…</div>}
          {rows && filtered.length === 0 && !fetching && <div style={S.muted}>No users found.</div>}

          {filtered.length > 0 && (
            <div style={S.scroll}>
              <table style={S.table}>
                <thead>
                  <tr>
                    {["Name", "Email", "Phone", "Category", "Status", "Assessment", "Top career", "Fit %", "Report"].map((h) => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => {
                    const a = u.latestAssessment;
                    return (
                      <tr key={u.uid || i} style={{ background: i % 2 ? "#fafbfc" : "#fff" }}>
                        <td style={S.td}><b>{u.name || "—"}</b></td>
                        <td style={S.td}>{u.email || "—"}</td>
                        <td style={S.td}>{u.phone || "—"}</td>
                        <td style={S.td}>{u.category ? categoryLabel(u.category) : "—"}</td>
                        <td style={S.td}>{u.clarity || "—"}</td>
                        <td style={S.td}>
                          {a ? <span style={{ ...S.pill, ...S.pillOk }}>Completed</span> : <span style={{ ...S.pill, ...S.pillWait }}>Pending</span>}
                        </td>
                        <td style={S.td}>{a?.topCareer || "—"}</td>
                        <td style={S.td}>{a?.overallFitmentPct != null ? `${a.overallFitmentPct}%` : "—"}</td>
                        <td style={S.td}>
                          {a ? (
                            (() => {
                              const st = sent[u.uid];
                              if (st === "sent") return <span style={{ ...S.pill, ...S.pillOk }}>✓ Sent</span>;
                              if (st?.startsWith("error")) return <button style={S.sendBtn} onClick={() => void sendReport(u)} title={st}>Retry</button>;
                              return (
                                <button style={S.sendBtn} disabled={st === "sending"} onClick={() => void sendReport(u)}>
                                  {st === "sending" ? "Sending…" : "✉ Email report"}
                                </button>
                              );
                            })()
                          ) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={S.statCard}>
      <div style={{ ...S.statValue, ...(color ? { color } : {}) }}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>{children}</div>
    </div>
  );
}

const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "#fff", borderBottom: "1px solid #e6e9ef" },
  logo: { textDecoration: "none", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" },
  headRight: { display: "flex", alignItems: "center", gap: 12 },
  adminTag: { fontSize: 12.5, color: "#64748b", fontWeight: 600 },
  logout: { padding: "8px 16px", background: "#fff", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
  body: { maxWidth: 1080, margin: "0 auto", padding: "24px" },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 18px" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 },
  statCard: { background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  statValue: { fontSize: 28, fontWeight: 800, color: "#0f172a" },
  statLabel: { fontSize: 12.5, color: "#64748b", fontWeight: 600, marginTop: 4 },
  tableCard: { background: "#fff", border: "1px solid #e6e9ef", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  tableHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" },
  tableTitle: { fontSize: 15, fontWeight: 800 },
  search: { padding: "9px 13px", borderRadius: 9, border: "1px solid #cbd5e1", fontSize: 13.5, outline: "none", minWidth: 240 },
  error: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },
  scroll: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13.5 },
  th: { textAlign: "left", padding: "10px 12px", color: "#64748b", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: .4, borderBottom: "2px solid #eef1f6", whiteSpace: "nowrap" },
  td: { padding: "11px 12px", borderBottom: "1px solid #f1f5f9", color: "#334155", whiteSpace: "nowrap" },
  pill: { padding: "3px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  pillOk: { background: "#dcfce7", color: "#15803d" },
  pillWait: { background: "#fef3c7", color: "#92400e" },
  sendBtn: { padding: "6px 12px", background: "#eef2ff", color: "#3b4a9c", border: "1px solid #c7d2fe", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  bulkBtn: { padding: "9px 16px", background: "#3b4a9c", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  muted: { color: "#64748b", fontSize: 14, padding: "8px 0" },
  primary: { display: "inline-block", marginTop: 12, padding: "11px 26px", background: BLUE, color: "#fff", borderRadius: 10, fontSize: 14.5, fontWeight: 700, textDecoration: "none" },
  linkBtn: { marginTop: 12, background: "none", border: "none", color: BLUE, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  loginCard: { width: "100%", maxWidth: 400, background: "#fff", borderRadius: 16, padding: "34px 32px", boxShadow: "0 16px 50px rgba(30,41,59,.16)", textAlign: "center" },
  loginBadge: { fontSize: 40, marginBottom: 8 },
  loginTitle: { fontSize: 23, fontWeight: 800, margin: "0 0 4px" },
  loginSub: { fontSize: 13.5, color: "#64748b", margin: "0 0 22px" },
  loginLabel: { display: "block", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 6 },
  loginInput: { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14.5, outline: "none", boxSizing: "border-box" },
  loginBtn: { width: "100%", marginTop: 20, padding: "13px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
};
