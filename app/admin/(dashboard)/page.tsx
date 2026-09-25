"use client";

/**
 * /admin - Users section of the dashboard. Every registered user, their
 * details, and assessment status/result, with school management and
 * one-click / bulk report emailing. Reads the Firestore `users` collection
 * (allowed for admins by firestore.rules). Auth is handled by the parent
 * app/admin/layout.tsx; this page can assume it's already an admin.
 *
 * "View report" now navigates to /admin/report/[uid] - its own route,
 * outside the sidebar's route group - instead of swapping in a full-screen
 * branch here, so the report keeps rendering with zero dashboard chrome
 * around it for print/save-as-PDF.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { type UserProfile } from "@/lib/auth/AuthProvider";
import { categoryLabel } from "@/lib/auth/formOptions";
import { getDb } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C, Ring } from "@/app/account/viz";
import { S as SHARED, emailReport } from "../adminShared";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserProfile[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sent, setSent] = useState<Record<string, string>>({}); // uid -> sending|sent|error msg
  const [bulk, setBulk] = useState(false);
  const [schools, setSchools] = useState<string[]>([]); // admin-managed school list
  const [schoolFilter, setSchoolFilter] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [assigning, setAssigning] = useState<string | null>(null);

  async function addSchool() {
    const name = newSchool.trim();
    if (!name) return;
    const db = getDb();
    if (!db) return;
    try {
      await addDoc(collection(db, "schools"), { name });
      setSchools((s) => Array.from(new Set([...s, name])).sort());
      setNewSchool("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add school - check Firestore admin write rules.");
    }
  }

  async function assignSchool(u: UserProfile, school: string) {
    const db = getDb();
    if (!db) return;
    setAssigning(u.uid);
    try {
      await updateDoc(doc(db, "users", u.uid), { institution: school });
      setRows((rs) => (rs ?? []).map((r) => (r.uid === u.uid ? { ...r, institution: school } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not assign school - check Firestore admin write rules.");
    } finally {
      setAssigning(null);
    }
  }

  async function archiveUser(u: UserProfile) {
    const db = getDb();
    if (!db) return;
    if (!confirm(`Archive ${u.name || u.email}? Their dashboard login will be blocked until you restore them from Archives.`)) return;
    try {
      await updateDoc(doc(db, "users", u.uid), { archived: true, archivedAt: new Date().toISOString() });
      setRows((rs) => (rs ?? []).map((r) => (r.uid === u.uid ? { ...r, archived: true } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not archive this user - check Firestore admin write rules.");
    }
  }

  async function sendReport(u: UserProfile) {
    setSent((s) => ({ ...s, [u.uid]: "sending" }));
    const r = await emailReport(u);
    setSent((s) => ({ ...s, [u.uid]: r.ok ? "sent" : `error: ${r.message || "failed"}` }));
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
    const db = getDb();
    if (!db) return;
    setFetching(true);
    Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "schools")).catch(() => null),
    ])
      .then(([usnap, ssnap]) => {
        setRows(usnap.docs.map((d) => d.data() as UserProfile));
        if (ssnap) setSchools(ssnap.docs.map((d) => (d.data() as { name?: string }).name || "").filter(Boolean));
      })
      .catch((e) => setError(e?.message || "Failed to load users."))
      .finally(() => setFetching(false));
  }, []);

  // All selectable schools = admin-added list ∪ schools users typed at registration.
  const allSchools = useMemo(() => {
    const set = new Set<string>(schools);
    (rows ?? []).forEach((u) => { if (u.institution) set.add(u.institution); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [schools, rows]);

  const filtered = useMemo(() => {
    // Archived users live on their own /admin/archives page instead of
    // cluttering this list - see archiveUser() below.
    let list = (rows ?? []).filter((u) => !u.archived);
    if (schoolFilter) list = list.filter((u) => (u.institution || "") === schoolFilter);
    const term = q.trim().toLowerCase();
    if (term) list = list.filter((u) =>
      [u.name, u.email, u.phone, u.institution].filter(Boolean).some((v) => v!.toLowerCase().includes(term))
    );
    return list;
  }, [rows, q, schoolFilter]);

  const stats = useMemo(() => {
    const list = rows ?? [];
    const completed = list.filter((u) => u.latestAssessment).length;
    const ratings = list
      .map((u) => u.latestAssessment?.feedbackRating)
      .filter((r): r is number => typeof r === "number");
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "-";
    const rate = list.length ? Math.round((completed / list.length) * 100) : 0;
    return { total: list.length, completed, pending: list.length - completed, avg, rate };
  }, [rows]);

  return (
    <>
      {/* overview */}
      <section style={S.overview} className="og-adm-overview">
        <div>
          <div style={S.eyebrow}>Admin console</div>
          <h1 style={S.title}>Users & reports</h1>
          <p style={S.subtitle}>Track registrations, assessment completion and report delivery across all schools.</p>
        </div>
        <div style={S.overviewRing}>
          <Ring value={stats.rate} size={92} stroke={10} color={C.red} track="#efeff2">
            <div style={S.ringPct}>{stats.rate}<small>%</small></div>
            <div style={S.ringLab}>completed</div>
          </Ring>
        </div>
      </section>

      <div style={S.statGrid} className="og-adm-stats">
        <Stat icon="user" label="Registered users" value={stats.total} />
        <Stat icon="check" label="Completed assessment" value={stats.completed} accent={C.good} />
        <Stat icon="clock" label="Not yet taken" value={stats.pending} accent={C.muted} />
        <Stat icon="star" label="Avg. feedback" value={stats.avg} accent={C.red} />
      </div>

      <div style={S.tableCard}>
        <div style={S.tableHead}>
          <div style={S.tableTitle}>Users {rows ? <span style={S.count}>{filtered.length}</span> : null}</div>
          <div style={S.toolbar}>
            <select style={S.schoolSel} value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
              <option value="">All schools ({rows?.length ?? 0})</option>
              {allSchools.map((s) => (
                <option key={s} value={s}>{s} ({(rows ?? []).filter((u) => u.institution === s).length})</option>
              ))}
            </select>
            <div style={S.addSchoolWrap}>
              <input style={S.addSchoolInput} placeholder="Add a school…" value={newSchool}
                onChange={(e) => setNewSchool(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void addSchool(); }} />
              <button style={{ ...S.addSchoolBtn, ...(newSchool.trim() ? {} : { opacity: 0.5, cursor: "default" }) }} onClick={() => void addSchool()} disabled={!newSchool.trim()}>Add</button>
            </div>
            <input style={S.search} placeholder="Search name / email / phone…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button
              style={{ ...S.bulkBtn, ...(bulk || !filtered.some((u) => u.latestAssessment) ? { opacity: 0.55, cursor: bulk ? "wait" : "default" } : {}) }}
              disabled={bulk || !filtered.some((u) => u.latestAssessment)}
              onClick={() => void sendAll(filtered)}
            >
              <Icon name="save" size={15} /> {bulk ? "Emailing…" : schoolFilter ? `Email ${schoolFilter}` : "Email all completed"}
            </button>
          </div>
        </div>

        {error && <div style={SHARED.error}>{error}</div>}
        {fetching && <div style={SHARED.muted}>Loading users…</div>}
        {rows && filtered.length === 0 && !fetching && <div style={S.emptyRow}>No users found.</div>}

        {filtered.length > 0 && (
          <div style={S.scroll}>
            <table style={S.table} className="og-adm-table">
              <thead>
                <tr>
                  {["Name", "Email", "Phone", "School", "Category", "Status", "Assessment", "Top career", "Fit %", "Report"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const a = u.latestAssessment;
                  return (
                    <tr key={u.uid || i}>
                      <td style={S.td}>
                        {/* The name is the obvious thing to click for "show
                            me this student" - but only once there's a report
                            behind it, or the click does nothing and reads as
                            broken. */}
                        {a ? (
                          <Link href={`/admin/report/${u.uid}`} target="_blank" rel="noopener noreferrer" style={S.nameBtn} title="Open this student's report">
                            {u.name || "-"}
                          </Link>
                        ) : (
                          <b style={S.name}>{u.name || "-"}</b>
                        )}
                      </td>
                      <td style={S.td}>{u.email || "-"}</td>
                      <td style={S.td}>{u.phone || "-"}</td>
                      <td style={S.td}>
                        <select
                          style={{ ...S.assignSel, ...(assigning === u.uid ? { opacity: 0.5 } : {}) }}
                          value={u.institution || ""}
                          disabled={assigning === u.uid}
                          onChange={(e) => void assignSchool(u, e.target.value)}
                        >
                          <option value="">- unassigned -</option>
                          {allSchools.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={S.td}>{u.category ? categoryLabel(u.category) : "-"}</td>
                      <td style={S.td}>{u.clarity || "-"}</td>
                      <td style={S.td}>
                        {a
                          ? <span style={{ ...SHARED.pill, ...SHARED.pillOk }}><span style={{ ...SHARED.dot, background: C.good }} /> Completed</span>
                          : <span style={{ ...SHARED.pill, ...SHARED.pillWait }}><span style={{ ...SHARED.dot, background: C.muted }} /> Pending</span>}
                      </td>
                      <td style={S.td}>{a?.topCareer || "-"}</td>
                      <td style={S.td}>{a?.overallFitmentPct != null ? <b style={{ color: C.red }}>{a.overallFitmentPct}%</b> : "-"}</td>
                      <td style={S.td}>
                        {a ? (
                          <div style={S.reportCell}>
                            <Link href={`/admin/report/${u.uid}`} target="_blank" rel="noopener noreferrer" style={S.viewBtn}>
                              <Icon name="explain" size={14} /> View report
                            </Link>
                            {(() => {
                              const st = sent[u.uid];
                              if (st === "sent") return <span style={{ ...SHARED.pill, ...SHARED.pillSent }}><Icon name="check" size={13} /> Sent</span>;
                              if (st?.startsWith("error")) return (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                                  <button style={SHARED.sendBtn} onClick={() => void sendReport(u)}>Retry</button>
                                  <span style={{ fontSize: 11, color: C.redStrong, maxWidth: 240, lineHeight: 1.35 }}>{st.replace(/^error:\s*/, "")}</span>
                                </div>
                              );
                              return (
                                <button style={{ ...SHARED.sendBtn, ...(st === "sending" ? { opacity: 0.6 } : {}) }} disabled={st === "sending"} onClick={() => void sendReport(u)}>
                                  {st === "sending" ? "Sending…" : "Email report"}
                                </button>
                              );
                            })()}
                            {/* Only offered once an assessment is complete -
                                archiving is for finished profiles, not ones
                                still mid-assessment. */}
                            <button style={S.archiveBtn} onClick={() => void archiveUser(u)}>
                              <Icon name="archive" size={13} /> Archive
                            </button>
                          </div>
                        ) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ icon, label, value, accent }: { icon: string; label: string; value: number | string; accent?: string }) {
  return (
    <div style={S.statCard}>
      <span style={{ ...S.statIcon, ...(accent ? { color: accent, background: tint(accent) } : {}) }}><Icon name={icon} size={17} /></span>
      <div style={S.statValue}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

function tint(hex: string) {
  if (hex === C.red) return C.redTint;
  if (hex === C.good) return C.goodTint;
  return C.line2;
}

const S: Record<string, React.CSSProperties> = {
  overview: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "24px 26px", marginBottom: 16, boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  eyebrow: { fontSize: 11, fontWeight: 800, letterSpacing: ".13em", textTransform: "uppercase", color: C.red },
  title: { fontSize: 26, fontWeight: 800, margin: "8px 0 0", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13.5, color: C.ink3, margin: "8px 0 0", maxWidth: "56ch", lineHeight: 1.55 },
  overviewRing: { flex: "none" },
  ringPct: { fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1 },
  ringLab: { fontSize: 9.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: C.muted, marginTop: 3 },

  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 },
  statCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  statIcon: { width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", background: C.line2, color: C.ink2, marginBottom: 12 },
  statValue: { fontSize: 26, fontWeight: 800, color: C.ink, lineHeight: 1.1 },
  statLabel: { fontSize: 12, color: C.ink3, fontWeight: 600, marginTop: 4 },

  tableCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  tableHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  tableTitle: { fontSize: 15.5, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 },
  count: { fontSize: 12, fontWeight: 800, color: C.red, background: C.redTint, borderRadius: 999, padding: "3px 10px" },
  toolbar: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },
  search: { padding: "9px 13px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, outline: "none", minWidth: 220, background: "#fff", color: C.ink },
  schoolSel: { padding: "9px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13, outline: "none", background: "#fff", cursor: "pointer", maxWidth: 220, color: C.ink },
  addSchoolWrap: { display: "flex", alignItems: "center" },
  addSchoolInput: { padding: "9px 12px", borderRadius: "10px 0 0 10px", border: `1px solid ${C.line}`, borderRight: "none", fontSize: 13, outline: "none", width: 140, color: C.ink },
  addSchoolBtn: { padding: "9px 15px", borderRadius: "0 10px 10px 0", border: `1px solid ${C.red}`, background: C.red, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  assignSel: { padding: "5px 8px", borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 12.5, background: "#fff", cursor: "pointer", maxWidth: 150, color: C.ink2 },
  bulkBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", background: C.red, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },

  scroll: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13.5 },
  th: { textAlign: "left", padding: "10px 12px", color: C.muted, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: .5, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap", background: "#fff", position: "sticky", top: 0 },
  td: { padding: "12px", borderBottom: `1px solid ${C.line2}`, color: C.ink2, whiteSpace: "nowrap" },
  name: { color: C.ink, fontWeight: 700 },
  emptyRow: { color: C.ink3, fontSize: 14, padding: "28px 0", textAlign: "center" },

  reportCell: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  viewBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 13px", background: C.ink, color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },
  archiveBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 13px", background: "#fff", color: C.redStrong, border: `1px solid ${C.redLine}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  nameBtn: { background: "none", border: "none", padding: 0, font: "inherit", color: C.ink, fontWeight: 700, cursor: "pointer", textAlign: "left", textDecoration: "underline", textDecorationColor: C.line, textUnderlineOffset: 3 },
};
