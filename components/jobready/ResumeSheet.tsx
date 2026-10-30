"use client";
/**
 * The resume on screen: the chosen template drawn at true paper size in
 * points (lib/resume/templates.ts - the same numbers the PDF uses), scaled to
 * fit its column, with a dashed line where each new page starts. Reports how
 * many pages it takes.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Design } from "@/lib/resume/resume";
import { tokens, type DocEntry, type DocModel, type Tokens } from "@/lib/resume/templates";

const PX = 96 / 72; // CSS px per pt

export function ResumeSheet({ model, design, onPages, fixedScale }: { model: DocModel; design: Design; onPages?: (n: number) => void; fixedScale?: number }) {
  const k = tokens(design);
  const wrap = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(fixedScale ?? 0.8);
  const [pages, setPages] = useState(1);
  const [height, setHeight] = useState(k.paper.h * PX);

  useLayoutEffect(() => {
    if (fixedScale) return;
    const el = wrap.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1.25, el.clientWidth / (k.paper.w * PX)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [k.paper.w, fixedScale]);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => {
      const contentPt = el.scrollHeight / PX;
      const n = Math.max(1, Math.ceil((contentPt - 2) / k.pageBody));
      setPages(n);
      setHeight(Math.max(k.paper.h, k.margin * 2 + n * k.pageBody) * PX);
      onPages?.(n);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [model, design, k.pageBody, k.paper.h, onPages]);

  const t = k.t;
  const font = t.font === "Helvetica" ? 'Helvetica, Arial, "Liberation Sans", sans-serif' : '"Times New Roman", Times, "Liberation Serif", serif';
  const page: CSSProperties = { width: `${k.paper.w}pt`, minHeight: `${k.paper.h}pt`, height: height / PX + "pt", padding: `${k.margin}pt`, boxSizing: "border-box", background: "#fff", color: k.ink, fontFamily: font, fontSize: `${k.base}pt`, lineHeight: k.lineHeight, position: "relative" };

  return (
    <div ref={wrap} className="rs-wrap" style={{ height: height * scale }}>
      <div ref={sheet} className="rs-sheet" style={{ ...page, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <div ref={body}>
          <Header model={model} k={k} />
          {model.blocks.map((b) => (
            <section key={b.title} style={{ marginTop: `${k.sectionGap}pt` }}>
              <Heading title={b.title} k={k} />
              {b.kind === "text" && <p style={{ margin: 0 }}>{b.text}</p>}
              {b.kind === "list" && <Bullets items={b.items} />}
              {b.kind === "skills" && b.groups.map((g, i) => <p key={i} style={{ margin: "0 0 1.5pt" }}>{g.label && <b>{g.label}: </b>}{g.items}</p>)}
              {b.kind === "entries" && b.entries.map((e, i) => <EntryView key={e.key} e={e} k={k} first={i === 0} />)}
            </section>
          ))}
        </div>
        {Array.from({ length: pages - 1 }, (_, i) => (
          <div key={i} className="rs-break" style={{ top: `${k.margin + (i + 1) * k.pageBody}pt` }}><span>Page {i + 2}</span></div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: RS_CSS }} />
    </div>
  );
}

function Header({ model, k }: { model: DocModel; k: Tokens }) {
  const t = k.t;
  return (
    <header style={{ textAlign: t.nameAlign, paddingBottom: t.headerRule ? "5pt" : 0, borderBottom: t.headerRule ? `1pt solid ${k.accent}` : undefined }}>
      <div style={{ fontSize: `${k.name}pt`, fontWeight: 700, lineHeight: 1.15, color: t.nameAccent ? k.accent : k.ink, textTransform: t.nameUpper ? "uppercase" : "none", letterSpacing: t.nameUpper ? "0.04em" : 0 }}>{model.name || "Your Name"}</div>
      {model.contact.length > 0 && <div style={{ fontSize: `${k.small}pt`, color: k.muted, marginTop: "3pt" }}>{model.contact.join("  |  ")}</div>}
      {model.links.length > 0 && <div style={{ fontSize: `${k.small}pt`, color: k.muted, marginTop: "1pt" }}>{model.links.join("  |  ")}</div>}
    </header>
  );
}

function Heading({ title, k }: { title: string; k: Tokens }) {
  const t = k.t;
  return (
    <h2 style={{ margin: `0 0 ${3.5}pt`, fontSize: `${k.heading}pt`, fontWeight: 700, letterSpacing: t.headingUpper ? "0.08em" : 0, textTransform: t.headingUpper ? "uppercase" : "none", color: t.headingAccent ? k.accent : k.ink, borderBottom: t.headingRule ? `0.75pt solid ${t.headingAccent ? k.accent : "#888"}` : undefined, paddingBottom: t.headingRule ? "1.5pt" : 0, lineHeight: 1.2 }}>{title}</h2>
  );
}

function Bullets({ items }: { items: string[] }) {
  return <ul style={{ margin: "1.5pt 0 0", paddingLeft: "11pt" }}>{items.map((x, i) => <li key={i} style={{ marginBottom: "1pt", paddingLeft: "1pt" }}>{x}</li>)}</ul>;
}

/** Harvard layout, second line: the title (when the organisation led) and the score. */
const orgLine2 = (e: DocEntry) => [e.org ? e.title : "", e.score].filter(Boolean).join(", ");

/**
 * One entry, as two plain lines - no right-aligned columns, so every parser
 * reads it in order (a right-aligned date is read as a separate block by many).
 */
function EntryView({ e, k, first }: { e: DocEntry; k: Tokens; first: boolean }) {
  const [l1, l2] = entryLines(e, k.t.entry);
  return (
    <div style={{ marginTop: first ? 0 : `${k.entryGap}pt` }}>
      <div><b>{l1.bold}</b>{l1.rest}</div>
      {l2.text && <div style={{ fontSize: `${k.small}pt`, color: k.muted, fontStyle: l2.italic ? "italic" : "normal" }}>{l2.text}</div>}
      {e.bullets.length > 0 && <Bullets items={e.bullets} />}
    </div>
  );
}

/** An entry's two lines. "role": Title, Organisation / place | dates | score. "org" (Harvard): Organisation, place / Title | dates | score. */
export function entryLines(e: DocEntry, layout: "role" | "org"): [{ bold: string; rest: string }, { text: string; italic: boolean }] {
  if (layout === "org") {
    return [
      { bold: e.org || e.title, rest: e.place ? `, ${e.place}` : "" },
      { text: [orgLine2(e), e.dates].filter(Boolean).join("  |  "), italic: true },
    ];
  }
  return [
    { bold: e.title || e.org, rest: e.title && e.org ? `, ${e.org}` : "" },
    { text: [e.place, e.dates, e.score].filter(Boolean).join("  |  "), italic: false },
  ];
}

const RS_CSS = `
.rs-wrap{position:relative;width:100%;overflow:hidden}
.rs-sheet{box-shadow:0 1px 3px rgba(0,0,0,.08),0 8px 24px rgba(0,0,0,.06);border:1px solid #e7e5e4}
.rs-sheet b{font-weight:700}
.rs-sheet h2,.rs-sheet p,.rs-sheet ul{font-family:inherit}
.rs-break{position:absolute;left:0;right:0;border-top:1.5px dashed #c4c4c4;pointer-events:none}
.rs-break span{position:absolute;right:6px;top:-9px;background:#fff;padding:0 4px;font:600 9px/1.2 Inter,sans-serif;color:#9a9a9a;letter-spacing:.04em;text-transform:uppercase}
`;
