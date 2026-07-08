"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  age: string | null;
  journeyCode: string;
  journeyName: string;
  ageGroup: string;
  stage: string | null;
  dreamCareer: string | null;
  sessionId: string | null;
  status: "started" | "completed";
  topCareer: string | null;
  createdAt: string;
  completedAt: string | null;
};

type Envelope<T> = { success: boolean; message: string; data: T };

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [journeyFilter, setJourneyFilter] = useState<string>("all");
  const [token, setToken] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? sessionStorage.getItem("og_admin_token") : null;
    if (saved) {
      setToken(saved);
      void load(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function load(tok: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-token": tok } });
      const payload = (await res.json()) as Envelope<Lead[]>;
      if (res.status === 401) {
        setAuthed(false);
        setToken(null);
        sessionStorage.removeItem("og_admin_token");
        setLoginError("Incorrect access token.");
        return;
      }
      if (!res.ok || !payload.success) throw new Error(payload.message);
      setLeads(payload.data);
      setAuthed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  function submitLogin() {
    const t = pw.trim();
    if (!t) return;
    sessionStorage.setItem("og_admin_token", t);
    setToken(t);
    setLoginError(null);
    void load(t);
  }

  if (!authed) {
    return (
      <main className="shell og-login-shell">
        <div className="panel og-login">
          <span className="og-logo">
            One<span>Grasp</span>
          </span>
          <h2>Admin access</h2>
          <p className="muted">Enter the admin access token to view captured leads.</p>
          {loginError ? <div className="banner error">{loginError}</div> : null}
          <input
            className="admin-search"
            type="password"
            placeholder="Access token"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitLogin()}
          />
          <button className="og-btn-primary" onClick={submitLogin} type="button">
            Sign in
          </button>
        </div>
      </main>
    );
  }

  const journeys = useMemo(() => {
    const map = new Map<string, string>();
    leads.forEach((l) => map.set(l.journeyCode, l.journeyName));
    return [...map.entries()];
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (journeyFilter !== "all" && l.journeyCode !== journeyFilter) return false;
      if (!q) return true;
      return [l.name, l.email, l.phone, l.city, l.journeyName, l.topCareer]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, query, journeyFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const today = leads.filter((l) => isToday(l.createdAt)).length;
    const completed = leads.filter((l) => l.status === "completed").length;
    const rate = total ? Math.round((completed / total) * 100) : 0;
    return { total, today, completed, rate };
  }, [leads]);

  function exportCsv() {
    const headers = [
      "Name", "Email", "Phone", "City", "Age", "Class", "Age group",
      "Stage", "Dream career", "Status", "Top career", "Created",
    ];
    const rows = filtered.map((l) => [
      l.name, l.email, l.phone ?? "", l.city ?? "", l.age ?? "",
      l.journeyName, l.ageGroup, l.stage ?? "", l.dreamCareer ?? "",
      l.status, l.topCareer ?? "", l.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `onegrasp-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <header className="og-nav">
        <span className="og-logo">
          One<span>Grasp</span> <em className="admin-tag">Admin · Leads</em>
        </span>
        <a className="ghost-button" href="/">
          ← Assessment
        </a>
      </header>

      {error ? (
        <div className="banner error">
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      <section className="admin-stats">
        <StatTile label="Total leads" value={stats.total} />
        <StatTile label="Today" value={stats.today} />
        <StatTile label="Completed" value={stats.completed} />
        <StatTile label="Completion rate" value={`${stats.rate}%`} />
      </section>

      <section className="panel">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search name, email, phone, city, career…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="admin-select"
            value={journeyFilter}
            onChange={(e) => setJourneyFilter(e.target.value)}
          >
            <option value="all">All classes ({leads.length})</option>
            {journeys.map(([code, name]) => (
              <option key={code} value={code}>
                {name} ({leads.filter((l) => l.journeyCode === code).length})
              </option>
            ))}
          </select>
          <button className="og-btn-primary admin-export" onClick={exportCsv} type="button">
            Export CSV ({filtered.length})
          </button>
          <button
            className="ghost-button"
            onClick={() => token && void load(token)}
            type="button"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <p className="muted">
            No leads yet. Complete an assessment from the{" "}
            <a href="/">home page</a> and it will appear here.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Class</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Top career</th>
                  <th>Created</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id}>
                    <td className="admin-num">{i + 1}</td>
                    <td>
                      <strong>{l.name}</strong>
                      <span className="admin-sub">{l.email}</span>
                    </td>
                    <td>{l.phone ?? "—"}</td>
                    <td>
                      {l.journeyName}
                      <span className="admin-sub">{l.ageGroup}</span>
                    </td>
                    <td>{l.city ?? "—"}</td>
                    <td>
                      <span className={`status-pill ${l.status === "completed" ? "good" : "warn"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>{l.topCareer ?? "—"}</td>
                    <td className="admin-date">{fmtDate(l.createdAt)}</td>
                    <td>
                      {l.sessionId && l.status === "completed" ? (
                        <a className="admin-link" href={`/report/${l.sessionId}`} target="_blank" rel="noreferrer">
                          View →
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
