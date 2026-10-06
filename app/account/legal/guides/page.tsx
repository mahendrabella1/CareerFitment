"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { LegalShell, LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { LEGAL_AREAS, LEGAL_GUIDES, type AgeBand } from "@/data/legal/guides";
import { Pager, usePaged } from "@/components/ui/Pager";
import { PageHeader } from "@/components/course/fx";

const AGE_LABEL: Record<AgeBand, string> = { SCHOOL: "School", COLLEGE: "College", WORKING: "Working", SENIOR: "60+" };
const PAGE_SIZE = 12;

const GUIDES_CSS = `
.lg-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}
.lg-chip{font:inherit;font-size:12.5px;font-weight:700;padding:6px 13px;border-radius:999px;border:1.5px solid #e2e8f0;background:#fff;color:#475569;cursor:pointer}
.lg-chip[aria-pressed="true"]{border-color:${ACCENT};background:${ACCENT}14;color:${ACCENT}}
.lg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;scroll-margin-top:80px}
.lg-card{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;text-decoration:none;transition:border-color .15s,box-shadow .15s}
.lg-card:hover{border-color:${ACCENT};box-shadow:0 8px 20px rgba(15,23,42,.06)}
.lg-area{font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:${ACCENT}}
.lg-title{font-size:14.5px;font-weight:800;color:#0f172a;line-height:1.35}
.lg-title span{color:#94a3b8;margin-right:6px}
.lg-line{font-size:12.5px;color:#64748b;line-height:1.5;flex:1}
.lg-ages{display:flex;gap:4px;flex-wrap:wrap}
.lg-ages span{font-size:10.5px;font-weight:700;color:#475569;background:#f1f5f9;border-radius:999px;padding:2px 8px}
`;

export default function LegalGuidesPage() {
  const known = new Set<string>(LEGAL_AREAS);
  const areas = [...LEGAL_AREAS, ...Array.from(new Set(LEGAL_GUIDES.map((g) => g.area).filter((a) => !known.has(a))))];
  const [area, setArea] = useState<string | null>(null);
  const sorted = [...LEGAL_GUIDES].sort((a, b) => a.number - b.number);
  const shown = area ? sorted.filter((g) => g.area === area) : sorted;
  const paged = usePaged(shown, PAGE_SIZE, area);
  const top = useRef<HTMLDivElement | null>(null);

  return (
    <LegalShell>
      <style dangerouslySetInnerHTML={{ __html: GUIDES_CSS }} />
      <div style={{ padding: "0 0 8px" }}>
        <PageHeader icon="book" eyebrow="Guides" title={`All ${LEGAL_GUIDES.length} guides`}
          subtitle={<>Organised by life area. Each guide is drafted from real, named laws and official sources, and is flagged for a lawyer&apos;s review before it can be relied on.</>} />

        <div className="lg-chips" role="group" aria-label="Filter by life area">
          <button className="lg-chip" aria-pressed={area === null} onClick={() => setArea(null)}>All · {LEGAL_GUIDES.length}</button>
          {areas.map((a) => {
            const n = LEGAL_GUIDES.filter((g) => g.area === a).length;
            return n ? <button key={a} className="lg-chip" aria-pressed={area === a} onClick={() => setArea(a)}>{a} · {n}</button> : null;
          })}
        </div>

        <div ref={top} className="lg-grid">
          {paged.items.map((g) => (
            <Link key={g.slug} href={`/account/legal/guides/${g.slug}`} className="lg-card fx-lift">
              {!area && <span className="lg-area">{g.area}</span>}
              <span className="lg-title"><span>{g.number}.</span>{g.title}</span>
              <span className="lg-line">{g.oneLine}</span>
              <span className="lg-ages">{g.ageBands.map((b) => <span key={b}>{AGE_LABEL[b]}</span>)}</span>
            </Link>
          ))}
        </div>
        <Pager paged={paged} accent={ACCENT} noun="guides" scrollTo={top} />
      </div>
    </LegalShell>
  );
}
