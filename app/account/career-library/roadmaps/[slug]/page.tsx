"use client";

/**
 * /account/career-library/roadmaps/[slug] - one degree roadmap, with links to
 * the same career's roadmaps for other degrees and courses.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { LevelBadge, RoadmapBody, useRoadmapCatalog } from "@/components/careers/DegreeRoadmaps";
import { loadRoadmap, type RoleRoadmap } from "@/lib/report/roleRoadmapGrad";

export default function DegreeRoadmapPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const catalog = useRoadmapCatalog();
  const [rm, setRm] = useState<RoleRoadmap | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    setRm(undefined);
    void loadRoadmap(slug).then((r) => { if (live) setRm(r); });
    return () => { live = false; };
  }, [slug]);

  const entry = catalog?.roles.find((r) => r.versions.some((v) => v.slug === slug));
  const others = entry?.versions.filter((v) => v.slug !== slug) ?? [];
  const level = entry?.versions.find((v) => v.slug === slug)?.level;

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", fontFamily: "Inter, system-ui, 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/account/career-library/roadmaps" style={{ color: "#3b82f6", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← All degree roadmaps</Link>
        <Link href="/account/career-library" style={{ color: "#6b7280", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Career Library</Link>
      </div>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 16px 60px" }}>
        {rm === undefined ? <p style={{ color: "#6b7280" }}>Loading the roadmap…</p>
          : rm === null ? (
            <div style={{ background: "#fff", border: "1px solid #ececef", borderRadius: 14, padding: 24 }}>
              <h1 style={{ fontSize: 22, margin: "0 0 6px" }}>Roadmap not found</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>It may have been renamed. <Link href="/account/career-library/roadmaps">Browse all degree roadmaps</Link>.</p>
            </div>
          ) : (
            <>
              <div style={{ background: "#fff", border: "1px solid #ececef", borderRadius: 16, padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  {entry && catalog?.clusters[entry.cluster] && <span style={{ fontSize: 12, fontWeight: 700, color: "#4c5fd5", textTransform: "uppercase", letterSpacing: ".05em" }}>{catalog.clusters[entry.cluster]}</span>}
                  {level && <LevelBadge level={level} />}
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#141417", margin: 0, letterSpacing: "-.02em", lineHeight: 1.2 }}>{rm.role}</h1>
                <p style={{ fontSize: 13.5, color: "#63636f", margin: "4px 0 0" }}>Degree roadmap</p>
                {others.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#3d3d45", marginBottom: 6 }}>Also written for:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {others.map((v) => (
                        <Link key={v.slug} href={`/account/career-library/roadmaps/${v.slug}`} style={{ fontSize: 12.5, fontWeight: 600, color: "#3d4fb8", background: "#eef0fc", borderRadius: 999, padding: "5px 11px", textDecoration: "none" }}>
                          {v.for || "Any degree"}{v.level !== "ug" ? ` (${v.level === "pg" ? "PG" : "Ph.D."})` : ""}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <RoadmapBody rm={rm} />
            </>
          )}
      </div>
    </div>
  );
}
