"use client";
/**
 * The search box in every feature hero: finds any page, tool or lesson in the
 * section as you type. Arrow keys move, Enter opens, Escape closes, and "/"
 * anywhere on the page jumps to the box. A page that filters its own list
 * (Career Library, Internships) passes onQuery instead of items.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/Icons";

export interface SearchItem {
  label: string;
  /** What kind of thing it is: "Lesson", "Tool", "Guide"... */
  kind: string;
  /** The part of the section it sits in. */
  hint?: string;
  href?: string;
  onSelect?: () => void;
  keywords?: string;
}

const MAX = 9;

function rank(item: SearchItem, words: string[]): number {
  const label = item.label.toLowerCase();
  const hay = `${label} ${(item.hint ?? "").toLowerCase()} ${(item.keywords ?? "").toLowerCase()}`;
  if (!words.every((w) => hay.includes(w))) return -1;
  const q = words.join(" ");
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  return words.every((w) => label.includes(w)) ? 1 : 0;
}

export function FeatureSearch({ items, placeholder, onQuery, value }: {
  items?: SearchItem[];
  placeholder: string;
  /** For pages that filter their own list instead of showing a dropdown. */
  onQuery?: (q: string) => void;
  value?: string;
}) {
  const router = useRouter();
  const box = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      e.preventDefault();
      box.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!items || !words.length) return [];
    return items
      .map((item, n) => ({ item, n, r: rank(item, words) }))
      .filter((x) => x.r >= 0)
      .sort((a, b) => b.r - a.r || a.n - b.n)
      .slice(0, MAX)
      .map((x) => x.item);
  }, [items, q]);

  const choose = (item: SearchItem) => {
    setOpen(false);
    setQ("");
    if (item.onSelect) item.onSelect();
    else if (item.href) router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onQuery) { if (e.key === "Escape") { setQ(""); onQuery(""); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter" && results[sel]) { e.preventDefault(); choose(results[sel]); }
    else if (e.key === "Escape") { setOpen(false); box.current?.blur(); }
  };

  const showList = !onQuery && open && q.trim().length > 0;

  return (
    <div className="fp-search" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <div className="fp-search-box">
        <Icon name="search" size={19} stroke={2} />
        <input
          ref={box}
          value={q}
          placeholder={placeholder}
          aria-label={placeholder}
          role={onQuery ? undefined : "combobox"}
          aria-expanded={onQuery ? undefined : showList}
          aria-controls={onQuery ? undefined : "fp-sr"}
          onChange={(e) => { setQ(e.target.value); setSel(0); setOpen(true); onQuery?.(e.target.value); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {q ? (
          <button type="button" className="fp-btn fp-btn-sm" style={{ border: 0 }} onClick={() => { setQ(""); onQuery?.(""); box.current?.focus(); }} aria-label="Clear search">
            <Icon name="close" size={15} stroke={2} />
          </button>
        ) : <kbd aria-hidden="true">/</kbd>}
      </div>
      {showList && (
        <div className="fp-sr" id="fp-sr" role="listbox">
          {results.length === 0 && <div className="fp-sr-empty">Nothing matches &quot;{q}&quot;. Try a shorter word.</div>}
          {results.map((r, i) => {
            const inner = (
              <>
                <span style={{ minWidth: 0 }}><b>{r.label}</b>{r.hint && <small>{r.hint}</small>}</span>
                <em>{r.kind}</em>
              </>
            );
            return r.href && !r.onSelect ? (
              <Link key={`${r.kind}-${r.label}-${i}`} href={r.href} role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => setOpen(false)}>{inner}</Link>
            ) : (
              <button key={`${r.kind}-${r.label}-${i}`} type="button" role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => choose(r)}>{inner}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}
