"use client";
/**
 * /account/interview - the 100 most common interview questions, by area:
 * why each is asked, how to answer, a model answer and the mistake to avoid.
 * Ticking "practised" is remembered per student in this browser.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { scopedKey } from "@/lib/progress/userStorage";
import { CATEGORIES, QUESTIONS, type CatKey, type InterviewQ } from "@/lib/interview/questions";
import { JobReadyShell } from "@/components/jobready/JobReadyShell";

const KEY = "onegrasp.interview.practised.v1";

export default function InterviewPage() {
  const [cat, setCat] = useState<CatKey | "all">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => { try { setDone(new Set(JSON.parse(localStorage.getItem(scopedKey(KEY)) || "[]"))); } catch { /* storage blocked */ } }, []);
  const toggle = (id: string) => setDone((d) => {
    const n = new Set(d); if (n.has(id)) n.delete(id); else n.add(id);
    try { localStorage.setItem(scopedKey(KEY), JSON.stringify([...n])); } catch { /* storage blocked */ }
    return n;
  });

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return QUESTIONS.filter((x) => (cat === "all" || x.cat === cat) && (!s || `${x.q} ${x.answer} ${x.how}`.toLowerCase().includes(s)));
  }, [cat, q]);

  return (
    <JobReadyShell>
      <div className="iv-head">
        <div>
          <h1>Interview questions</h1>
          <p>The 100 questions asked most in internship, placement, first-job, college and scholarship interviews - with why they&apos;re asked, how to answer, and a model answer to adapt. Make every answer yours: swap in your own examples.</p>
        </div>
        <div className="iv-prog"><b>{done.size}</b><span>of 100 practised</span><Link href="/account/interview/practice" className="fp-btn fp-btn-pri fp-btn-sm">Start a mock interview</Link></div>
      </div>

      <div className="fp-dir" style={{ margin: "16px 0 14px" }}>
        <div className="fp-dir-h" style={{ gap: 8 }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions - e.g. weakness, salary, conflict" aria-label="Search questions" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button className="fp-chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All 100</button>
            {CATEGORIES.map((c) => <button key={c.key} className="fp-chip" aria-pressed={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</button>)}
          </div>
        </div>
      </div>

      <div className="iv-tip"><Icon name="info" size={15} stroke={2} /> <span>For &quot;Tell me about a time…&quot; questions, use <b>STAR</b>: the <b>S</b>ituation, your <b>T</b>ask, the <b>A</b>ction you took, and the <b>R</b>esult - with a number if you have one.</span></div>

      {CATEGORIES.filter((c) => cat === "all" || c.key === cat).map((c) => {
        const rows = list.filter((x) => x.cat === c.key);
        if (!rows.length) return null;
        return (
          <section key={c.key} className="iv-sec">
            <div className="iv-sec-h"><h2>{c.label}</h2><span>{c.text} · {rows.filter((x) => done.has(x.id)).length}/{rows.length} practised</span></div>
            <div className="iv-list">{rows.map((x) => <Question key={x.id} x={x} n={QUESTIONS.indexOf(x) + 1} open={open === x.id} done={done.has(x.id)} onOpen={() => setOpen(open === x.id ? null : x.id)} onDone={() => toggle(x.id)} />)}</div>
          </section>
        );
      })}
      {!list.length && <p className="fp-muted">No question matches. <button className="fp-link" style={{ fontSize: 13 }} onClick={() => { setQ(""); setCat("all"); }}>Show all 100</button></p>}
      <style dangerouslySetInnerHTML={{ __html: IV_CSS }} />
    </JobReadyShell>
  );
}

function Question({ x, n, open, done, onOpen, onDone }: { x: InterviewQ; n: number; open: boolean; done: boolean; onOpen: () => void; onDone: () => void }) {
  return (
    <article className={`iv-q${open ? " is-open" : ""}`}>
      <button className="iv-q-h" aria-expanded={open} onClick={onOpen}>
        <span className="iv-n">{n}</span>
        <b>{x.q}</b>
        {done && <span className="iv-done"><Icon name="check" size={13} stroke={2.4} /> Practised</span>}
        <Icon name={open ? "chevronLeft" : "chevronRight"} size={15} stroke={2} style={{ transform: open ? "rotate(-90deg)" : "none", color: "var(--mute)", flex: "none" }} />
      </button>
      {open && (
        <div className="iv-q-b">
          <dl>
            <dt>Why they ask</dt><dd>{x.why}</dd>
            <dt>How to answer</dt><dd>{x.how}</dd>
            <dt>Model answer</dt><dd className="iv-ans">{x.answer}</dd>
            <dt>Avoid</dt><dd>{x.avoid}</dd>
          </dl>
          <div className="iv-q-a">
            <Link href={`/account/interview/practice?q=${x.id}`} className="fp-btn fp-btn-pri fp-btn-sm"><Icon name="audio" size={14} stroke={2} /> Practise out loud</Link>
            <button className="fp-btn fp-btn-sm" onClick={onDone}>{done ? "Mark as not practised" : "Mark as practised"}</button>
          </div>
        </div>
      )}
    </article>
  );
}

const IV_CSS = `
.iv-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-top:8px}
.iv-head h1{margin:0;font-size:22px;font-weight:600}
.iv-head p{margin:6px 0 0;font-size:14px;line-height:1.55;color:var(--ink2);max-width:720px}
.iv-prog{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.iv-prog b{font-size:28px;font-weight:700}
.iv-prog span{font-size:13px;color:var(--mute);margin-right:6px}
.iv-tip{display:flex;gap:8px;align-items:flex-start;padding:10px 14px;background:#fff;border:1px solid var(--line);border-radius:8px;font-size:13.5px;line-height:1.5;color:var(--ink2);margin-bottom:18px}
.iv-tip svg{flex:none;margin-top:2px;color:var(--mute)}
.iv-sec{margin-bottom:24px}
.iv-sec-h{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:8px}
.iv-sec-h h2{margin:0;font-size:17px;font-weight:600}
.iv-sec-h span{font-size:13px;color:var(--mute)}
.iv-list{background:#fff;border:1px solid var(--line);border-radius:8px}
.iv-q{border-top:1px solid #f0ede8}
.iv-q:first-child{border-top:0}
.iv-q-h{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;padding:13px 16px;cursor:pointer}
.iv-q-h:hover b{color:var(--accent)}
.iv-q-h:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.iv-n{flex:none;width:26px;font-size:12.5px;font-weight:600;color:var(--mute);font-variant-numeric:tabular-nums}
.iv-q-h b{flex:1;font-size:14.5px;font-weight:600;line-height:1.4;color:var(--ink)}
.iv-done{display:inline-flex;align-items:center;gap:4px;flex:none;font-size:12px;font-weight:600;color:#166534}
.iv-q.is-open{background:#fcfcfb}
.iv-q-b{padding:0 16px 16px 54px}
.iv-q-b dl{display:grid;grid-template-columns:130px minmax(0,1fr);gap:8px 14px;margin:0;font-size:14px;line-height:1.6}
.iv-q-b dt{font-weight:600;color:var(--mute);font-size:13px}
.iv-q-b dd{margin:0;color:var(--ink2)}
.iv-ans{background:#fff;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;padding:10px 12px;color:var(--ink)!important}
.iv-q-a{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
@media (max-width:640px){.iv-q-b{padding:0 14px 14px}.iv-q-b dl{grid-template-columns:minmax(0,1fr)}.iv-q-b dt{margin-top:6px}}
`;
