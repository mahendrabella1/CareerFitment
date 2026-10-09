"use client";

/**
 * /account/career-library/roadmaps - every role with a degree roadmap,
 * searchable and filterable by career cluster and degree level. Each card
 * opens the roadmap written for it (components/careers/DegreeRoadmaps.tsx).
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { HowItWorks } from "@/components/HowItWorks";
import { LevelBadge, LEVEL_LABEL, normRole, useRoadmapCatalog } from "@/components/careers/DegreeRoadmaps";
import type { DegreeLevel } from "@/lib/report/roleRoadmapGrad";

const PAGE = 60;

export default function DegreeRoadmapsPage() {
  const catalog = useRoadmapCatalog();
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState(-1);
  const [level, setLevel] = useState<DegreeLevel | "all">("ug");
  const [shown, setShown] = useState(PAGE);

  const list = useMemo(() => {
    if (!catalog) return [];
    const n = normRole(q);
    return catalog.roles
      .map((r) => ({ ...r, versions: level === "all" ? r.versions : r.versions.filter((v) => v.level === level) }))
      .filter((r) => r.versions.length
        && (cluster < 0 || r.cluster === cluster)
        && (!n || normRole(`${r.role} ${r.versions.map((v) => v.for).join(" ")}`).includes(n)));
  }, [catalog, q, cluster, level]);

  const counts = useMemo(() => {
    const c = new Map<number, number>();
    for (const r of catalog?.roles ?? []) if (level === "all" || r.versions.some((v) => v.level === level)) c.set(r.cluster, (c.get(r.cluster) ?? 0) + 1);
    return c;
  }, [catalog, level]);
  const total = catalog?.roles.reduce((s, r) => s + r.versions.length, 0) ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "Inter, system-ui, 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/account/career-library" style={{ color: "#3b82f6", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← Career Library</Link>
      </div>
      <div style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)", padding: "36px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1f2937", margin: "0 0 8px", letterSpacing: "-.02em" }}>Degree roadmaps</h1>
          <p style={{ fontSize: 15.5, color: "#4b5563", margin: "0 0 18px", maxWidth: 720, lineHeight: 1.6 }}>
            {catalog ? `${catalog.roles.length.toLocaleString("en-IN")} careers, ${total.toLocaleString("en-IN")} roadmaps` : "Careers and roadmaps"} - each one a year-by-year plan for a specific degree and course: what to build, internships, certifications, the jobs you can be hired for, PG in India, study abroad and how the career grows.
          </p>
          <input value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="Search a career, degree or course - e.g. Data Analyst, B.Com, Nursing"
            style={{ width: "100%", maxWidth: 640, padding: "13px 16px", fontSize: 15, border: "1px solid #c7d2fe", borderRadius: 10, background: "#fff", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 60px" }}>
        <HowItWorks id="degree-roadmaps" steps={[
          "Search for a career, or pick a career cluster below.",
          "Each card shows the degrees and courses its roadmaps were written for - open the one closest to yours.",
          "A roadmap walks you year by year through your degree: skills to build, internships, certifications, the jobs it leads to, PG in India, study abroad and long-term growth.",
          "Still in school? Use these to see what each degree path really involves before you choose a stream or college.",
        ]} sync="Time you spend here counts towards your Career GPS 'Explore careers' mission; your school sees time spent in the Career Library." />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#6b7280" }}>Level:</span>
          {(["ug", "pg", "doctoral", "all"] as const).map((l) => (
            <button key={l} onClick={() => { setLevel(l); setShown(PAGE); }} style={pill(level === l)}>{l === "all" ? "All levels" : LEVEL_LABEL[l]}</button>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{ __html: ".dr-clusters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}@media (max-width:640px){.dr-clusters{flex-wrap:nowrap;overflow-x:auto;padding-bottom:6px}.dr-clusters button{flex:none}}" }} />
        <div className="dr-clusters">
          <button onClick={() => { setCluster(-1); setShown(PAGE); }} style={pill(cluster < 0)}>All clusters</button>
          {catalog?.clusters.map((c, i) => counts.get(i) ? (
            <button key={c} onClick={() => { setCluster(i); setShown(PAGE); }} style={pill(cluster === i)}>{c} ({counts.get(i)})</button>
          ) : null)}
        </div>

        {catalog === undefined ? <p style={{ color: "#6b7280" }}>Loading roadmaps…</p>
          : catalog === null ? <p style={{ color: "#b91c1c" }}>The roadmaps couldn&apos;t be loaded. Please refresh the page.</p>
          : (
            <>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 12px" }}>{list.length.toLocaleString("en-IN")} career{list.length === 1 ? "" : "s"}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {list.slice(0, shown).map((r) => (
                  <div key={r.role} style={{ minWidth: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{r.role}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{catalog.clusters[r.cluster] ?? ""}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 6 }}>
                      {r.versions.slice(0, 4).map((v) => (
                        <Link key={v.slug} href={`/account/career-library/roadmaps/${v.slug}`} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, padding: "7px 10px", borderRadius: 8, background: "#f8fafc", textDecoration: "none", color: "#1f2937", fontSize: 13 }}>
                          <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={v.for || "Any degree"}>{v.for || "Any degree"}</span>
                          {level === "all" && <LevelBadge level={v.level} />}
                          <span style={{ color: "#4c5fd5", fontWeight: 700 }}>→</span>
                        </Link>
                      ))}
                      {r.versions.length > 4 && <Link href={`/account/career-library/roadmaps/${r.versions[0].slug}`} style={{ fontSize: 12.5, color: "#4c5fd5", fontWeight: 600, textDecoration: "none" }}>+{r.versions.length - 4} more versions</Link>}
                    </div>
                  </div>
                ))}
              </div>
              {shown < list.length && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button onClick={() => setShown((s) => s + PAGE)} style={{ ...pill(false), padding: "10px 22px", fontSize: 14 }}>Show more ({(list.length - shown).toLocaleString("en-IN")} left)</button>
                </div>
              )}
              {list.length === 0 && <p style={{ color: "#6b7280" }}>No roadmap matches yet - try a shorter search, another cluster or &quot;All levels&quot;.</p>}
            </>
          )}
      </div>
    </div>
  );
}

const pill = (on: boolean): React.CSSProperties => ({
  border: `1px solid ${on ? "#4c5fd5" : "#e5e7eb"}`, background: on ? "#4c5fd5" : "#fff", color: on ? "#fff" : "#374151",
  borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
});
