"use client";

/**
 * Degree roadmaps in the Career Library: the role-specific roadmaps written
 * for undergraduates (public/roadmaps/ug, built by
 * scripts/build-ug-role-roadmaps.py), browsable by every student. Shared by
 * the browse page, the roadmap page and the card on each library career.
 *
 * The data is fetched on demand (catalog.json to browse, one roadmap file to
 * read) - nothing is bundled into the page code.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ROLE_KIND_STEP, RoleBlocks, loadRoadmapCatalog,
  type DegreeLevel, type RoadmapCatalog, type RoleRoadmap,
} from "@/lib/report/roleRoadmapGrad";

export const LEVEL_LABEL: Record<DegreeLevel, string> = { ug: "Undergraduate", pg: "Postgraduate", doctoral: "Ph.D." };

/** The seven standard steps, in the order every roadmap follows. */
export const STEPS: { kind: string; label: string; color: string }[] = [
  { kind: "build", label: "What to build", color: "#4c5fd5" },
  { kind: "internships", label: "Internships", color: "#0ea5e9" },
  { kind: "certifications", label: "Certifications", color: "#d97706" },
  { kind: "careers", label: "Careers you can be hired as", color: "#16a34a" },
  { kind: "pg_india", label: "Postgraduate study in India", color: "#8b5cf6" },
  { kind: "abroad", label: "Study abroad", color: "#db2777" },
  { kind: "growth", label: "Going forward", color: "#0f766e" },
];
const STEP_COLOR = Object.fromEntries(STEPS.map((s) => [s.kind, s.color]));

/** Colour tokens the shared block renderer reads. */
export const ROADMAP_VARS = { "--ink": "#141417", "--ink-2": "#3d3d45", "--muted": "#63636f", "--line": "#ececef", "--line-2": "#fafafb" } as React.CSSProperties;

export const normRole = (s: string) => s.toLowerCase().replace(/&/g, " and ").replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();

export function useRoadmapCatalog(): RoadmapCatalog | null | undefined {
  const [catalog, setCatalog] = useState<RoadmapCatalog | null | undefined>(undefined);
  useEffect(() => { let live = true; void loadRoadmapCatalog().then((c) => { if (live) setCatalog(c); }); return () => { live = false; }; }, []);
  return catalog;
}

/** The catalog roles a Career Library career's name points to. */
export function rolesNamed(catalog: RoadmapCatalog, name: string) {
  const n = normRole(name);
  return catalog.roles.filter((r) => normRole(r.role) === n);
}

export function LevelBadge({ level }: { level: DegreeLevel }) {
  const c = level === "ug" ? { bg: "#eef0fc", fg: "#3d4fb8" } : level === "pg" ? { bg: "#f3e8ff", fg: "#7c3aed" } : { bg: "#fdf3e2", fg: "#9a6700" };
  return <span style={{ fontSize: 11, fontWeight: 800, borderRadius: 999, padding: "3px 9px", background: c.bg, color: c.fg, whiteSpace: "nowrap" }}>{LEVEL_LABEL[level]}</span>;
}

/** On a Career Library career page: the degree roadmaps written for it. */
export function CareerRoadmapLinks({ name }: { name: string }) {
  const catalog = useRoadmapCatalog();
  if (!catalog) return null;
  const versions = rolesNamed(catalog, name).flatMap((r) => r.versions.map((v) => ({ ...v, role: r.role })));
  if (!versions.length) return null;
  return (
    <div style={{ background: "#fff", padding: "24px 28px", borderRadius: 12, border: "1px solid #c7d2fe", boxShadow: "0 1px 0 #eef0fc" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 22 }}>🗺️</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>Degree roadmap{versions.length > 1 ? "s" : ""} for this career</h2>
      </div>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "8px 0 14px" }}>
        A year-by-year plan for your degree: what to build, internships, certifications, the jobs you can be hired for, PG in India, study abroad and how the career grows.
        {versions.length > 1 ? " Pick the one written for your degree and course." : ""}
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {versions.map((v) => (
          <Link key={v.slug} href={`/account/career-library/roadmaps/${v.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 10, textDecoration: "none", color: "#0f172a" }}>
            <span style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 14 }}>{v.for || "Any degree"}</span>
            <LevelBadge level={v.level} />
            <span style={{ color: "#4c5fd5", fontWeight: 700, fontSize: 13 }}>Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** A full roadmap, laid out for the Career Library. */
export function RoadmapBody({ rm }: { rm: RoleRoadmap }) {
  const writtenFor = [rm.facts["Current degree"], rm.facts["Course"]].filter(Boolean).join(" · ");
  const present = new Set(rm.sections.map((s) => s.kind));
  return (
    <div style={ROADMAP_VARS}>
      {rm.summary && <p style={{ fontSize: 15.5, color: "#3d3d45", lineHeight: 1.65, margin: "0 0 14px" }}>{rm.summary}</p>}
      {(writtenFor || rm.facts["Starts"]) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
          {writtenFor && <span style={chip}>Written for: {writtenFor}</span>}
          {rm.facts["Starts"] && <span style={chip}>Starts: {rm.facts["Starts"]}</span>}
        </div>
      )}
      {writtenFor && <p style={{ fontSize: 12.5, color: "#63636f", margin: "0 0 16px" }}>If your degree or course is different, keep the same goals and adapt the year-by-year plan to your own subjects.</p>}
      {rm.about.map((a, i) => (
        <div key={i} style={{ margin: "0 0 10px", padding: "10px 14px", borderLeft: "3px solid #4c5fd5", background: "#4c5fd50a", borderRadius: "0 10px 10px 0", fontSize: 13.5, color: "#3d3d45", lineHeight: 1.55 }}>
          <b style={{ color: "#141417" }}>{a.label}:</b> {a.text}
        </div>
      ))}
      {rm.intro && rm.intro.length > 0 && <div style={{ margin: "0 0 14px" }}><RoleBlocks blocks={rm.intro} color="#4c5fd5" /></div>}

      {/* The seven steps at a glance, so a student can see the whole journey. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0 18px" }}>
        {STEPS.map((s, i) => (
          <span key={s.kind} style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "5px 11px", border: `1px solid ${s.color}40`, color: present.has(s.kind) ? s.color : "#9a9aa6", background: present.has(s.kind) ? `${s.color}0d` : "#fafafb" }}>
            {i + 1}. {s.label}
          </span>
        ))}
      </div>

      {rm.horizons.length > 0 && (
        <div style={{ margin: "0 0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
          {rm.horizons.map((h, i) => (
            <div key={i} style={{ border: "1px solid #4c5fd530", borderTop: "3px solid #4c5fd5", borderRadius: 12, padding: "10px 12px", background: "#fff" }}>
              <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase", color: "#4c5fd5" }}>{h.period}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#141417", margin: "3px 0 4px" }}>{h.question}</div>
              <div style={{ fontSize: 12.5, color: "#3d3d45", lineHeight: 1.5 }}>{h.output}</div>
            </div>
          ))}
        </div>
      )}

      {rm.sections.map((s, i) => {
        const step = ROLE_KIND_STEP[s.kind];
        const color = STEP_COLOR[s.kind] ?? "#475569";
        return (
          <section key={i} style={{ marginTop: 16, background: "#fff", border: "1px solid #ececef", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: `linear-gradient(110deg, ${color}12, #fff)`, borderBottom: `1px solid ${color}25` }}>
              {step ? <span style={{ width: 26, height: 26, borderRadius: 999, background: color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 13, flex: "none" }}>{step}</span> : null}
              <h2 style={{ margin: 0, fontSize: 17, color: "#141417", letterSpacing: "-.01em" }}>{s.heading}</h2>
            </div>
            <div style={{ padding: "8px 16px 14px" }}><RoleBlocks blocks={s.blocks} color={color} /></div>
          </section>
        );
      })}
      <p style={{ fontSize: 12, color: "#63636f", marginTop: 18 }}>Fees, dates, eligibility and links change every year - confirm them on each official website before you apply or pay.</p>
    </div>
  );
}

const chip: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#3d3d45", background: "#4c5fd50c", border: "1px solid #4c5fd530", borderRadius: 999, padding: "4px 11px" };
