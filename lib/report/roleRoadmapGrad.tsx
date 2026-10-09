"use client";

/**
 * Role-specific roadmaps for the Graduates (UG) Career Selector, built from
 * the Word files by scripts/build-ug-role-roadmaps.py into
 * public/roadmaps/ug/. Nothing here is bundled into the report: the small
 * index and the one roadmap a student needs are fetched only when that
 * student's chosen career has one, so the set can grow to thousands.
 *
 * When a role has several versions (e.g. Project Engineer written for
 * Electrical and for Mechanical), the one whose stated degree/course best
 * matches the student's own is used. If the role has no roadmap, or loading
 * fails, the caller's existing roadmap (`fallback`) is shown instead.
 */
import { useEffect, useState, type ReactNode } from "react";

export interface RoleRoadmapCell { text: string; url?: string }
export type RoleRoadmapBlock =
  | { type: "p"; text: string; url?: string }
  | { type: "h"; text: string }
  | { type: "note"; label: string; text: string }
  | { type: "list"; items: { text: string; url?: string }[] }
  /** A progression ("A → B → C") or, with sep "+", a skill stack. */
  | { type: "flow"; items: string[]; sep?: "+"; label?: string }
  | { type: "table"; header: string[]; rows: RoleRoadmapCell[][] };
export interface RoleRoadmapSection {
  heading: string;
  /** build, internships, certifications, careers, pg_india, abroad, growth, horizons or other */
  kind: string;
  blocks: RoleRoadmapBlock[];
}
export interface RoleRoadmap {
  title: string;
  role: string;
  summary: string;
  facts: Record<string, string>;
  about: { label: string; text: string }[];
  /** Guidance written among the facts (e.g. the usual progression). */
  intro?: RoleRoadmapBlock[];
  horizons: { period: string; question: string; output: string }[];
  sections: RoleRoadmapSection[];
}

/** Per version: the degree/course it states it was written for, and the
 *  wider text around it (career cluster, route notes, opening lines). */
export interface RoadmapVersion { for: string; course?: string; about: string; level?: DegreeLevel }
export type DegreeLevel = "ug" | "pg" | "doctoral";

/** Same rule as degree_level() in scripts/build-ug-role-roadmaps.py. */
export function degreeLevel(s: string): DegreeLevel {
  if (/ph\.?\s?d\b|\bd\.\s?sc\b|d\.\s?litt|\bdba\b|doctorate|post-?doctoral|doctoral/i.test(s)) return "doctoral";
  if (/\b(m\.\s?(tech|e|sc|a|com|phil|pharm|des|arch|ed|s)\b|mba\b|pgdm|master|post-?graduate)/i.test(s)) return "pg";
  return "ug";
}
interface RoadmapIndex { roles: Record<string, string[]>; versions: Record<string, RoadmapVersion> }

const BASE = "/roadmaps/ug";
let indexPromise: Promise<RoadmapIndex | null> | null = null;
function loadIndex(): Promise<RoadmapIndex | null> {
  indexPromise ??= fetch(`${BASE}/index.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return indexPromise;
}

// Words that say nothing about which course a version was written for.
const GENERIC = new Set(["and", "the", "for", "with", "bachelor", "technology", "engineering", "tech", "b.tech", "b.e", "degree", "of", "in"]);
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !GENERIC.has(w)));
const phrase = (s: string) => ` ${s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim()} `;
const hits = (a: Set<string>, b: Set<string>) => [...a].filter((w) => b.has(w)).length;

// The kind of degree, so a B.Tech student gets the B.Tech version rather
// than the BCA one even though "technology"/"engineering" are too common to
// count as words. First match wins (LLB before BA for "BA LLB").
const FAMILIES: [string, RegExp][] = [
  ["btech", /\bb\.?\s?tech\b|\bb\.?\s?e\.?(?=[\s/(]|$)|bachelor of (technology|engineering)/i],
  ["bca", /\bbca\b|computer applications/i],
  ["bsc", /\bb\.?\s?sc\b|bachelor of science/i],
  ["bcom", /\bb\.?\s?com\b|bachelor of commerce/i],
  ["bba", /\bbba\b|\bbbm\b|business administration/i],
  ["bdes", /\bb\.?\s?des\b|bachelor of design/i],
  ["law", /\bllb\b/i],
  ["ba", /\bb\.?\s?a\b(?![a-z])|bachelor of arts/i],
  ["pharm", /pharm/i],
];
export function degreeFamily(s: string): string | null {
  return FAMILIES.find(([, re]) => re.test(s))?.[0] ?? null;
}

/** The version best matching the student, among those written for the
 *  student's own degree level (a Ph.D. plan starts at Ph.D. Year 1, so it is
 *  never offered to an undergraduate) - null when there is none. Scored by:
 *  a different kind of degree (-8: B.Tech vs BCA); the student's exact course
 *  named in what the version was written for (+10); how closely the
 *  version's course matches theirs (up to +20, so "Psychology" prefers a
 *  Psychology version over "Clinical / Counselling Psychology"); course words
 *  found there (x3) and in the wider text; degree words. The first version
 *  on a tie. */
export function pickVersion(slugs: string[], versions: Record<string, RoadmapVersion>, degree: string, course: string): string | null {
  const level = degreeLevel(`${degree} ${course}`);
  const candidates = slugs.filter((s) => (versions[s]?.level ?? "ug") === level);
  if (!candidates.length) return null;
  const courseWords = words(course);
  const degreeWords = words(degree);
  const family = degreeFamily(degree);
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const slug of candidates) {
    const v = versions[slug] ?? { for: "", about: "" };
    const forWords = words(v.for);
    const vFamily = degreeFamily(v.for);
    const vCourseWords = words(v.course || v.for);
    const union = new Set([...courseWords, ...vCourseWords]).size;
    // A different kind of degree counts against a version; the same kind adds
    // nothing, so a version that doesn't state its degree isn't out-ranked by
    // one that merely does.
    const score = (family && vFamily && family !== vFamily ? -8 : 0)
      + (course.trim() && phrase(v.for).includes(phrase(course)) ? 10 : 0)
      + (union ? 20 * hits(courseWords, vCourseWords) / union : 0)
      + 3 * hits(courseWords, forWords) + hits(courseWords, words(v.about)) + 0.5 * hits(degreeWords, forWords);
    if (score > bestScore) { best = slug; bestScore = score; }
  }
  return best;
}

/** One roadmap file, or null when it can't be loaded. */
export function loadRoadmap(slug: string): Promise<RoleRoadmap | null> {
  return fetch(`${BASE}/${encodeURIComponent(slug)}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
}

/** The roadmap index (role -> versions), fetched once per page load. */
export const loadRoadmapIndex = loadIndex;

/** Every role with a roadmap, for browsing (public/roadmaps/ug/catalog.json,
 *  written by the build script): its career cluster and each version's level
 *  and what it was written for. Far smaller than the index. */
export interface RoadmapCatalog {
  clusters: string[];
  roles: { role: string; cluster: number; versions: { slug: string; level: DegreeLevel; for: string }[] }[];
}
let catalogPromise: Promise<RoadmapCatalog | null> | null = null;
export function loadRoadmapCatalog(): Promise<RoadmapCatalog | null> {
  catalogPromise ??= fetch(`${BASE}/catalog.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return catalogPromise;
}

type State = { status: "loading" } | { status: "none" } | { status: "ready"; roadmap: RoleRoadmap };

export function RoleRoadmapSwitch({ role, degree, course, found, fallback }: {
  role: string | undefined;
  degree: string;
  course: string;
  /** Renders a loaded roadmap (the caller supplies the report's look). */
  found: (roadmap: RoleRoadmap) => ReactNode;
  /** What to show when this role has no roadmap of its own. */
  fallback: ReactNode;
}) {
  const [state, setState] = useState<State>(role ? { status: "loading" } : { status: "none" });

  useEffect(() => {
    if (!role) { setState({ status: "none" }); return; }
    let live = true;
    setState({ status: "loading" });
    loadIndex()
      .then(async (index) => {
        const slugs = index?.roles[role];
        if (!index || !slugs?.length) return null;
        const slug = pickVersion(slugs, index.versions, degree, course);
        if (!slug) return null;
        const res = await fetch(`${BASE}/${slug}.json`);
        return res.ok ? ((await res.json()) as RoleRoadmap) : null;
      })
      .catch(() => null)
      .then((roadmap) => { if (live) setState(roadmap ? { status: "ready", roadmap } : { status: "none" }); });
    return () => { live = false; };
  }, [role, degree, course]);

  if (state.status === "ready") return <>{found(state.roadmap)}</>;
  if (state.status === "loading") {
    return <div style={{ marginTop: 20, padding: "28px 16px", textAlign: "center", fontSize: 13, color: "var(--muted, #64748b)" }}>Loading your career roadmap…</div>;
  }
  return <>{fallback}</>;
}

// ---------------------------------------------------------------- rendering
// Shared by the UG report's Career Selector (lib/report/careerFitGradSheets.tsx,
// which frames the standard sections in its own 7-step look) and the Career
// Library's degree roadmaps (app/account/career-library/roadmaps). Colours come
// from the --ink / --ink-2 / --line CSS variables of the page around them.

// Which of the standard 7 steps a section kind is.
export const ROLE_KIND_STEP: Record<string, number> = { build: 1, internships: 2, certifications: 3, careers: 4, pg_india: 5, abroad: 6, growth: 7 };

export function RoleLink({ text, url, color }: { text: string; url?: string; color: string }) {
  const lines = text.split("\n");
  const body = lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>);
  return url
    ? <a href={url} target="_blank" rel="noreferrer" style={{ color, fontWeight: 700, textDecoration: "none" }}>{body} ↗</a>
    : <>{body}</>;
}

export function RoleBlocks({ blocks, color }: { blocks: RoleRoadmapBlock[]; color: string }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // A run of "heading + one short line" pairs reads as a label/value list.
    if (b.type === "h") {
      const pairs: { k: string; v: RoleRoadmapBlock }[] = [];
      let j = i;
      while (blocks[j]?.type === "h" && blocks[j + 1]?.type === "p" && (blocks[j + 1] as { text: string }).text.length <= 160 && blocks[j + 2]?.type !== "p") {
        pairs.push({ k: (blocks[j] as { text: string }).text, v: blocks[j + 1] });
        j += 2;
      }
      if (pairs.length >= 2) {
        out.push(
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 34%) 1fr", gap: "0", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", margin: "8px 0" }}>
            {pairs.map((pr, n) => (
              <div key={n} style={{ display: "contents" }}>
                <div style={{ padding: "8px 12px", fontSize: 12, fontWeight: 800, color, background: `${color}0a`, borderTop: n ? "1px solid var(--line)" : "none" }}>{pr.k}</div>
                <div style={{ padding: "8px 12px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, borderTop: n ? "1px solid var(--line)" : "none" }}>
                  <RoleLink text={(pr.v as { text: string }).text} url={(pr.v as { url?: string }).url} color={color} />
                </div>
              </div>
            ))}
          </div>
        );
        i = j - 1;
        continue;
      }
      out.push(<div key={i} style={{ fontSize: 12.5, fontWeight: 900, color: "var(--ink)", margin: "14px 0 6px" }}>{b.text}</div>);
    } else if (b.type === "p") {
      out.push(<p key={i} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, margin: "6px 0" }}><RoleLink text={b.text} url={b.url} color={color} /></p>);
    } else if (b.type === "note") {
      out.push(
        <div key={i} style={{ margin: "8px 0", padding: "9px 12px", borderLeft: `3px solid ${color}`, background: `${color}0a`, borderRadius: "0 10px 10px 0", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
          <b style={{ color: "var(--ink)" }}>{b.label}:</b> {b.text}
        </div>
      );
    } else if (b.type === "flow") {
      // A progression reads left to right with arrows; a skill stack with "+".
      out.push(
        <div key={i} style={{ margin: "8px 0" }}>
          {b.label && <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink)", marginBottom: 6 }}>{b.label}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 0" }}>
            {b.items.map((it, n) => (
              <span key={n} style={{ display: "inline-flex", alignItems: "center" }}>
                {n > 0 && <span aria-hidden style={{ color, fontWeight: 900, fontSize: 13, padding: "0 6px" }}>{b.sep ?? "→"}</span>}
                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.35, color: "var(--ink-2)", background: `${color}0c`, border: `1px solid ${color}33`, borderRadius: 999, padding: "4px 10px" }}>{it}</span>
              </span>
            ))}
          </div>
        </div>
      );
    } else if (b.type === "list") {
      // Short items (role titles, topics) sit in two columns.
      const twoCol = b.items.length > 10 || (b.items.length >= 6 && b.items.every((it) => it.text.length <= 40));
      out.push(
        <ul key={i} style={{ margin: "6px 0", paddingLeft: 18, columns: twoCol ? 2 : 1, columnGap: 24 }}>
          {b.items.map((it, n) => (
            <li key={n} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, breakInside: "avoid" }}><RoleLink text={it.text} url={it.url} color={color} /></li>
          ))}
        </ul>
      );
    } else if (b.type === "table") {
      out.push(
        <div key={i} style={{ overflowX: "auto", margin: "8px 0", border: "1px solid var(--line)", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            {b.header.some(Boolean) && (
              <thead>
                <tr>{b.header.map((h, n) => <th key={n} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10.5, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", color, background: `${color}0f`, borderBottom: `1px solid ${color}30`, whiteSpace: "nowrap" }}>{h}</th>)}</tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} style={{ background: r % 2 ? "var(--line-2, #fafafb)" : "#fff" }}>
                  {row.map((c, n) => (
                    <td key={n} style={{ padding: "8px 10px", verticalAlign: "top", color: n === 0 ? "var(--ink)" : "var(--ink-2)", fontWeight: n === 0 ? 700 : 400, lineHeight: 1.5, borderTop: "1px solid var(--line)", minWidth: 110 }}>
                      <RoleLink text={c.text} url={c.url} color={color} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
  return <>{out}</>;
}
