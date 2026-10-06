"use client";

/** /institution/students - every student, filterable, sortable, messageable and exportable. */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { StatusPill } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { Pager, usePaged } from "@/components/ui/Pager";
import {
  STATUS_META, courseTotals, daysActiveInLast, formatAgo, formatAgoInline, formatDuration, secondsInLast, studentStatus, type StudentStatus,
} from "@/lib/institution/analytics";
import type { StudentRow } from "@/lib/institution/types";

type SortKey = "name" | "class" | "status" | "week" | "days" | "courses" | "last";

export default function StudentsPage() {
  const { students } = usePortal();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [status, setStatus] = useState<StudentStatus | "">("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const top = useRef<HTMLDivElement | null>(null);
  const now = Date.now();

  // ?status=inactive from the Overview's "Where students stand" links.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("status");
    if (s && s in STATUS_META) setStatus(s as StudentStatus);
  }, []);

  const active = useMemo(() => (students ?? []).filter((s) => !s.archived), [students]);
  const classes = useMemo(() => [...new Set(active.map((s) => s.category).filter(Boolean))].sort(), [active]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { "": active.length };
    for (const s of active) { const k = studentStatus(s, now); c[k] = (c[k] ?? 0) + 1; }
    return c;
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = active.filter((s) =>
      (!cls || s.category === cls) &&
      (!status || studentStatus(s, now) === status) &&
      (!term || [s.name, s.email, s.phone, s.city, s.assessment.topFit ?? ""].some((v) => v.toLowerCase().includes(term))));
    const val = (s: StudentRow): string | number => {
      switch (sort.key) {
        case "name": return s.name.toLowerCase();
        case "class": return s.category;
        case "status": return ["not_started", "inactive", "needs_nudge", "on_track"].indexOf(studentStatus(s, now));
        case "week": return secondsInLast(s, 7, now);
        case "days": return daysActiveInLast(s, 30, now);
        case "courses": return courseTotals(s).pct;
        case "last": return s.activity.lastActiveAt ?? 0;
      }
    };
    return [...list].sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : 0) * sort.dir; });
  }, [active, q, cls, status, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const paged = usePaged(rows, 50, `${q}|${cls}|${status}|${sort.key}|${sort.dir}`);
  const allOnPage = paged.items.length > 0 && paged.items.every((s) => picked.has(s.uid));

  if (!students) return <div className="ip-empty">Loading your students…</div>;

  const th = (key: SortKey, label: string, num = false) => (
    <th className={num ? "num" : undefined}>
      <button onClick={() => setSort((s) => ({ key, dir: s.key === key ? (-s.dir as 1 | -1) : key === "name" || key === "class" ? 1 : -1 }))}>
        {label}{sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Students</h1>
          <p className="ip-sub">{active.length} students · select students to message them, or open one for their full picture.</p>
        </div>
        <button className="ip-btn ghost" onClick={() => exportCsv(rows, now)}><Icon name="save" size={15} /> Export CSV</button>
        <button className="ip-btn" disabled={!picked.size} onClick={() => setCompose({ audience: { type: "students", uids: [...picked], label: `${picked.size} selected student${picked.size === 1 ? "" : "s"}` } })}>
          <Icon name="bell" size={16} stroke={2} /> Message {picked.size || ""} selected
        </button>
      </div>

      <div className="ip-card" ref={top}>
        <div className="ip-toolbar">
          <input className="ip-input" placeholder="Search name, email, phone, career…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search students" />
          <select className="ip-select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class">
            <option value="">All classes</option>
            {classes.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
          </select>
          <div className="ip-tabs">
            <button className={`ip-tab${status === "" ? " on" : ""}`} onClick={() => setStatus("")}>All ({counts[""] ?? 0})</button>
            {(Object.keys(STATUS_META) as StudentStatus[]).map((k) => (
              <button key={k} className={`ip-tab${status === k ? " on" : ""}`} onClick={() => setStatus(k)}>{STATUS_META[k].label} ({counts[k] ?? 0})</button>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="ip-empty">{active.length ? "No students match these filters." : "No students are linked to your institution yet."}</div>
        ) : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead>
                <tr>
                  <th style={{ width: 34 }}>
                    <input type="checkbox" aria-label="Select all on this page" checked={allOnPage}
                      onChange={(e) => setPicked((p) => { const n = new Set(p); paged.items.forEach((s) => (e.target.checked ? n.add(s.uid) : n.delete(s.uid))); return n; })} />
                  </th>
                  {th("name", "Student")}
                  {th("class", "Class")}
                  <th>Assessment</th>
                  {th("status", "Status")}
                  {th("week", "Time this week", true)}
                  {th("days", "Active days", true)}
                  {th("courses", "Courses", true)}
                  {th("last", "Last active")}
                </tr>
              </thead>
              <tbody>
                {paged.items.map((s) => {
                  const ct = courseTotals(s);
                  return (
                    <tr key={s.uid}>
                      <td><input type="checkbox" aria-label={`Select ${s.name}`} checked={picked.has(s.uid)} onChange={(e) => setPicked((p) => { const n = new Set(p); if (e.target.checked) n.add(s.uid); else n.delete(s.uid); return n; })} /></td>
                      <td className="ip-name"><Link href={`/institution/students/${s.uid}`}>{s.name}</Link><small>{s.email || s.phone}</small></td>
                      <td style={{ whiteSpace: "nowrap" }}>{s.category ? categoryLabel(s.category) : "-"}</td>
                      <td style={{ minWidth: 150 }}>
                        {s.assessment.status === "completed"
                          ? <><b style={{ fontWeight: 700 }}>{s.assessment.topFit ?? "Completed"}</b><small style={{ display: "block", color: "var(--muted)", fontSize: 11.5 }}>completed {formatAgoInline(s.assessment.completedAt, now)}</small></>
                          : <span style={{ color: "var(--muted)" }}>{s.assessment.status === "in_progress" ? "Unfinished" : "Not started"}</span>}
                      </td>
                      <td><StatusPill status={studentStatus(s, now)} /></td>
                      <td className="num">{formatDuration(secondsInLast(s, 7, now))}<small style={{ display: "block", color: "var(--muted)", fontSize: 11.5 }}>{formatDuration(s.activity.totalSec)} total</small></td>
                      <td className="num">{daysActiveInLast(s, 30, now)}<span style={{ color: "var(--muted)" }}>/30</span></td>
                      <td className="num">{ct.total ? `${ct.pct}%` : "-"}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatAgo(s.activity.lastActiveAt, now)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {paged.pages > 1 && <div style={{ padding: 12, borderTop: "1px solid var(--line)" }}><Pager paged={paged} accent="#4c5fd5" noun="students" scrollTo={top} /></div>}
      </div>
      {picked.size > 0 && (
        <p className="ip-muted" style={{ marginTop: 10 }}>
          {picked.size} selected · <button className="ip-tab" onClick={() => setPicked(new Set())}>Clear selection</button>
        </p>
      )}
      <ComposeMessage preset={compose} onClose={() => setCompose(null)} onSent={() => setPicked(new Set())} />
    </>
  );
}

function exportCsv(rows: StudentRow[], now: number) {
  const head = ["Name", "Email", "Phone", "Class", "City", "Assessment", "Best fit", "Status", "Minutes this week", "Minutes all time", "Days active (30)", "Course progress %", "Last active"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((s) => [
    s.name, s.email, s.phone, s.category ? categoryLabel(s.category) : "", s.city,
    s.assessment.status, s.assessment.topFit ?? "", STATUS_META[studentStatus(s, now)].label,
    Math.round(secondsInLast(s, 7, now) / 60), Math.round(s.activity.totalSec / 60), daysActiveInLast(s, 30, now),
    courseTotals(s).total ? courseTotals(s).pct : "", s.activity.lastActiveAt ? new Date(s.activity.lastActiveAt).toISOString().slice(0, 10) : "",
  ].map(esc).join(","));
  const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `students-${new Date(now).toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
