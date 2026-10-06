"use client";

/** /institution/observations - teachers rate five visible traits; where they and the test disagree is flagged. */
import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { Section } from "@/components/institution/ui";
import { send, useApi } from "@/components/institution/useApi";
import { TRAITS, traitCheck } from "@/lib/institution/features";

type Obs = Record<string, { ratings: Record<string, number>; by: string; updatedAt: number }>;

export default function ObservationsPage() {
  const { students } = usePortal();
  const { data, error } = useApi<{ observations: Obs }>("/api/institution/observations");
  const [local, setLocal] = useState<Obs>({});
  const [cls, setCls] = useState("");
  const obs = useMemo(() => ({ ...(data?.observations ?? {}), ...local }), [data, local]);
  const active = useMemo(() => (students ?? []).filter((s) => !s.archived), [students]);
  const classes = useMemo(() => [...new Set(active.map((s) => s.category).filter(Boolean))].sort(), [active]);
  const shown = active.filter((s) => !cls || s.category === cls).sort((a, b) => a.name.localeCompare(b.name));
  const gaps = useMemo(() => active.flatMap((s) => traitCheck(obs[s.uid]?.ratings ?? {}, s.assessment.strengths).map((g) => ({ s, g }))), [active, obs]);

  if (error) return <div className="ip-alert bad">{error}</div>;
  if (!data || !students) return <div className="ip-empty">Loading…</div>;
  const rate = (uid: string, trait: string, v: number) => {
    const ratings = { ...(obs[uid]?.ratings ?? {}), [trait]: v };
    setLocal((l) => ({ ...l, [uid]: { ratings, by: "you", updatedAt: Date.now() } }));
    void send("/api/institution/observations", "POST", { uid, ratings });
  };

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Teacher check</h1>
          <p className="ip-sub">Class teachers rate five traits they can see in class (1 = rarely, 5 = always) - a few seconds per student. Where teachers and the test disagree, it&apos;s flagged so the counsellor can look closer.</p>
        </div>
        <select className="ip-select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class">
          <option value="">All classes</option>
          {classes.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
        </select>
      </div>

      {gaps.length > 0 && (
        <Section title={`Where teachers and the test disagree (${gaps.length})`} icon="flag" style={{ marginBottom: 12 }}>
          {gaps.slice(0, 20).map(({ s, g }, i) => (
            <div className="ip-rec" key={i}>
              <span className={`ip-pill ${g.kind === "test_only" ? "warn" : "good"}`} style={{ minWidth: 120, justifyContent: "center" }}>{g.kind === "test_only" ? "Test only" : "Teachers only"}</span>
              <div style={{ flex: 1 }}><b><Link href={`/institution/students/${s.uid}`} style={{ color: "var(--ink)" }}>{s.name}</Link></b> <span className="ip-muted">· {g.text}</span></div>
            </div>
          ))}
        </Section>
      )}

      <Section title={`Rate students${cls ? ` - ${categoryLabel(cls)}` : ""}`} icon="check" aside={`${shown.filter((s) => Object.keys(obs[s.uid]?.ratings ?? {}).length === TRAITS.length).length} of ${shown.length} done`}>
        <div className="ip-table-wrap">
          <table className="ip-table">
            <thead><tr><th>Student</th>{TRAITS.map((t) => <th key={t.key} title={t.hint}>{t.label}</th>)}</tr></thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s.uid}>
                  <td className="ip-name"><Link href={`/institution/students/${s.uid}`}>{s.name}</Link><small>{s.category ? categoryLabel(s.category) : ""}</small></td>
                  {TRAITS.map((t) => {
                    const v = obs[s.uid]?.ratings?.[t.key] ?? 0;
                    return (
                      <td key={t.key} style={{ whiteSpace: "nowrap" }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} aria-label={`${t.label} ${n}`} onClick={() => rate(s.uid, t.key, n)}
                            style={{ width: 24, height: 24, margin: 1, borderRadius: 6, border: "1px solid var(--line)", cursor: "pointer", font: "inherit", fontSize: 11.5, fontWeight: 800, background: v === n ? "var(--accent)" : v > n ? "var(--accentTint)" : "#fff", color: v === n ? "#fff" : "var(--ink2)" }}>{n}</button>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
