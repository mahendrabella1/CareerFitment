"use client";

/**
 * /institution/parents - what parents want for their child vs the child's
 * measured fit and own goal (survey by private link), the conflicts to
 * resolve with a conversation guide, and automated voice calls to parents.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { categoryLabel } from "@/lib/auth/formOptions";
import { Kpi, Section } from "@/components/institution/ui";
import { send, useApi } from "@/components/institution/useApi";
import { AREA_BY_KEY, parentAlignment, type Alignment, type ParentSurvey } from "@/lib/institution/features";
import { VOICE_LANGS, VOICE_TEMPLATES, type VoiceTemplate } from "@/lib/institution/voice";
import type { StudentRow } from "@/lib/institution/types";
import { HowItWorks } from "@/components/HowItWorks";

interface Data { students: StudentRow[]; links: Record<string, string>; surveys: Record<string, ParentSurvey> }

const STATUS: Record<Alignment["status"], { label: string; tone: string }> = {
  conflict: { label: "Conflict", tone: "bad" }, partial: { label: "Partly aligned", tone: "warn" }, aligned: { label: "Aligned", tone: "good" },
  open: { label: "Open to child's choice", tone: "good" }, no_report: { label: "Awaiting assessment", tone: "muted" },
};

export default function ParentsPage() {
  const { data, error, reload } = useApi<Data>("/api/institution/parents");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const rows = useMemo(() => {
    if (!data) return [];
    return data.students.map((s) => {
      const survey = data.surveys[s.uid] ?? null;
      return { s, survey, link: data.links[s.uid] ? `${origin}/parent/${data.links[s.uid]}` : "", alignment: survey ? parentAlignment(survey, s) : null };
    }).sort((a, b) => sev(b.alignment) - sev(a.alignment) || a.s.name.localeCompare(b.s.name));
  }, [data, origin]);

  if (error) return <div className="ip-alert bad">{error}</div>;
  if (!data) return <div className="ip-empty">Loading…</div>;

  const surveyed = rows.filter((r) => r.survey);
  const conflicts = rows.filter((r) => r.alignment?.status === "conflict");
  const makeLinks = async (uids: string[]) => {
    setBusy(true); setNote("");
    try { await send("/api/institution/parents", "POST", { uids }); await reload(); setNote(`Survey links ready for ${uids.length} student${uids.length === 1 ? "" : "s"}.`); }
    catch (e) { setNote(e instanceof Error ? e.message : "Could not create links."); }
    finally { setBusy(false); }
  };
  const share = (r: (typeof rows)[number]) => `https://wa.me/?text=${encodeURIComponent(`Dear parent of ${r.s.name.split(" ")[0]}, please answer 6 quick questions about your child's future (2 minutes): ${r.link}`)}`;
  const copyAll = () => {
    const text = rows.filter((r) => r.link && (!picked.size || picked.has(r.s.uid))).map((r) => `${r.s.name} (${r.s.category ? categoryLabel(r.s.category) : ""}): ${r.link}`).join("\n");
    navigator.clipboard.writeText(text).then(() => setNote("Links copied - paste them into your class WhatsApp groups or SMS.")).catch(() => setNote("Couldn't copy - select the links in the table instead."));
  };

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Parents</h1>
          <p className="ip-sub">Parents answer 6 quick questions by a private link - no account needed. Their wishes are compared with the child&apos;s measured fit and own goal, so you know where a three-way conversation is needed.</p>
        </div>
        <button className="ip-btn ghost" disabled={busy} onClick={() => void makeLinks((picked.size ? [...picked] : rows.map((r) => r.s.uid)).filter((u) => !data.links[u]))}>
          <Icon name="doc" size={15} /> Create links {picked.size ? `for ${picked.size} selected` : "for everyone"}
        </button>
        <button className="ip-btn" onClick={copyAll}>Copy links</button>
      </div>
      <HowItWorks id="portal-parents" steps={["Create a private family link for a student and share it with the parents (WhatsApp, SMS or email).", "Parents open it without an account, answer a 2-minute survey, and later see their child's decision sheet and weekly progress there.", "Here you see each family's answer next to the child's result - Aligned, Partly aligned or Conflict - with a conversation guide for conflicts.", "Automated voice calls can update parents in English, Hindi or Telugu once OneGrasp has connected a calling provider."]} sync={"Parents only ever see their own child. The child sees the parents' 'We agree' / 'Let's discuss' in their Decision Room."} />
      {note && <div className="ip-alert good">{note}</div>}

      <div className="ip-kpis">
        <Kpi icon="heart" label="Parents answered" value={surveyed.length} sub={`of ${rows.length} students · ${Object.keys(data.links).length} links made`} />
        <Kpi icon="flag" label="Conflicts" value={conflicts.length} sub={`${conflicts.filter((r) => r.alignment?.severity === "high").length} where parents are firm`} />
        <Kpi icon="pulse" label="Partly aligned" value={rows.filter((r) => r.alignment?.status === "partial").length} sub="some overlap to build on" />
        <Kpi icon="check" label="Aligned or open" value={rows.filter((r) => r.alignment && ["aligned", "open"].includes(r.alignment.status)).length} sub="parents, report and child agree" />
      </div>

      {conflicts.length > 0 && (
        <Section title="Conversations to have" icon="flag" aside="most urgent first" style={{ marginTop: 12 }}>
          {conflicts.map((r) => (
            <div className="ip-rec" key={r.s.uid}>
              <span className="ip-rec-dot" style={{ background: r.alignment!.severity === "high" ? "var(--bad)" : "var(--warn)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800 }}><Link href={`/institution/students/${r.s.uid}`} style={{ color: "var(--ink)" }}>{r.s.name}</Link> <span className="ip-muted">· {r.s.category ? categoryLabel(r.s.category) : ""}</span></div>
                <div className="ip-muted">{r.alignment!.summary}</div>
                {r.survey!.note && <div className="ip-muted" style={{ fontStyle: "italic" }}>Parent&apos;s note: &ldquo;{r.survey!.note}&rdquo;</div>}
                {openGuide === r.s.uid && <ol style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.6 }}>{r.alignment!.guide.map((g) => <li key={g}>{g}</li>)}</ol>}
              </div>
              <button className="ip-btn ghost sm" onClick={() => setOpenGuide(openGuide === r.s.uid ? null : r.s.uid)}>{openGuide === r.s.uid ? "Hide guide" : "Conversation guide"}</button>
            </div>
          ))}
        </Section>
      )}

      <Section title="All students" icon="users" style={{ marginTop: 12 }}>
        <div className="ip-table-wrap">
          <table className="ip-table">
            <thead><tr><th style={{ width: 34 }} /><th>Student</th><th>Parents want</th><th>Child&apos;s fit / goal</th><th>Status</th><th>Survey link</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.s.uid}>
                  <td><input type="checkbox" aria-label={`Select ${r.s.name}`} checked={picked.has(r.s.uid)} onChange={(e) => setPicked((p) => { const n = new Set(p); if (e.target.checked) n.add(r.s.uid); else n.delete(r.s.uid); return n; })} /></td>
                  <td className="ip-name"><Link href={`/institution/students/${r.s.uid}`}>{r.s.name}</Link><small>{r.s.category ? categoryLabel(r.s.category) : ""}</small></td>
                  <td style={{ minWidth: 150 }}>{r.survey ? (r.survey.areas.includes("open") ? "Child's choice" : r.survey.areas.map((a) => AREA_BY_KEY[a]?.label ?? a).join(", ")) : <span className="ip-muted">Not answered</span>}{r.survey && r.survey.firmness === "insist" && <small style={{ display: "block", color: "var(--bad)" }}>firm about it</small>}</td>
                  <td style={{ minWidth: 150 }}>{r.s.assessment.topFits.slice(0, 2).join(", ") || <span className="ip-muted">No report</span>}{r.s.assessment.desiredCareer && <small style={{ display: "block", color: "var(--muted)" }}>wants {r.s.assessment.desiredCareer}</small>}</td>
                  <td>{r.alignment ? <span className={`ip-pill ${STATUS[r.alignment.status].tone}`}>{STATUS[r.alignment.status].label}</span> : <span className="ip-pill muted">Waiting</span>}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {r.link ? (
                      <>
                        <button className="ip-btn ghost sm" onClick={() => navigator.clipboard.writeText(r.link).then(() => setNote(`Link for ${r.s.name}'s parents copied.`)).catch(() => undefined)}>Copy</button>{" "}
                        <a className="ip-btn ghost sm" style={{ textDecoration: "none" }} href={share(r)} target="_blank" rel="noreferrer">WhatsApp ↗</a>
                      </>
                    ) : <button className="ip-btn ghost sm" disabled={busy} onClick={() => void makeLinks([r.s.uid])}>Create link</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <VoiceCalls rows={rows} picked={picked} />
    </>
  );
}

function sev(a: Alignment | null): number {
  if (!a) return 0;
  return a.status === "conflict" ? (a.severity === "high" ? 4 : 3) : a.status === "partial" ? 2 : 1;
}

function VoiceCalls({ rows, picked }: { rows: { s: StudentRow; survey: ParentSurvey | null }[]; picked: Set<string> }) {
  const { data } = useApi<{ configured: boolean; reachable: number }>("/api/institution/voice");
  const [template, setTemplate] = useState<VoiceTemplate>("monthly");
  const [custom, setCustom] = useState("");
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const targets = rows.filter((r) => r.survey?.phone && (!picked.size || picked.has(r.s.uid)));
  const body = { uids: targets.map((r) => r.s.uid), template, custom };

  const run = async (previewOnly: boolean) => {
    setBusy(true); setResult("");
    try {
      if (previewOnly) {
        const r = await send<{ preview: string }>("/api/institution/voice", "POST", { ...body, preview: true });
        setPreview(r.preview);
      } else {
        const r = await send<{ placed: number; noPhone: number; failed: string[] }>("/api/institution/voice", "POST", body);
        setResult(`${r.placed} call${r.placed === 1 ? "" : "s"} placed.${r.failed.length ? ` ${r.failed.length} failed: ${r.failed.slice(0, 3).join("; ")}` : ""}`);
      }
    } catch (e) { setResult(e instanceof Error ? e.message : "Couldn't place the calls."); }
    finally { setBusy(false); }
  };

  return (
    <Section title="Voice calls to parents" icon="phone" aside={data ? `${data.reachable} parents gave a phone number` : undefined} style={{ marginTop: 12 }}>
      <p className="ip-muted" style={{ margin: "0 0 10px" }}>An automated call in each parent&apos;s language ({VOICE_LANGS.map((l) => l.label).join(", ")}) - for parents who don&apos;t read email or WhatsApp. Uses the phone number and language they gave in the survey.</p>
      {data && !data.configured && <div className="ip-alert warn">Calling isn&apos;t switched on for your account yet - OneGrasp needs to connect a calling provider. You can still preview the script.</div>}
      <div className="ip-tabs" style={{ marginBottom: 10 }}>
        {VOICE_TEMPLATES.map((t) => <button key={t.key} className={`ip-tab${template === t.key ? " on" : ""}`} onClick={() => { setTemplate(t.key); setPreview(""); }}>{t.label}</button>)}
      </div>
      {template === "custom" && <textarea className="ip-input" rows={3} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Write the message in the parents' language - it is read out as written." style={{ marginBottom: 10 }} />}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button className="ip-btn ghost sm" disabled={busy || !targets.length} onClick={() => void run(true)}>Preview the script</button>
        <button className="ip-btn sm" disabled={busy || !targets.length || !data?.configured} onClick={() => void run(false)}>Call {targets.length} parent{targets.length === 1 ? "" : "s"}{picked.size ? " (selected)" : ""}</button>
      </div>
      {preview && <div className="ip-insight info" style={{ marginTop: 10 }}><Icon name="phone" size={16} /><span>{preview}</span></div>}
      {result && <div className="ip-alert good" style={{ marginTop: 10 }}>{result}</div>}
    </Section>
  );
}
