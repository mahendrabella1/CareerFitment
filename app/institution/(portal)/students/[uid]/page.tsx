"use client";

/** /institution/students/[uid] - one student's full picture, with suggested next steps to send. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { categoryLabel } from "@/lib/auth/formOptions";
import { apiFetch } from "@/lib/institution/client";
import { Bars, DailyChart, Kpi, Section, StatusPill } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { AREA_LABEL, lastDays } from "@/lib/progress/activity";
import {
  COURSES, daysActiveInLast, formatAgo, formatAgoInline, formatDuration, recommendationsFor, secondsInLast, studentStatus,
} from "@/lib/institution/analytics";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import type { MessageKind, StudentRow } from "@/lib/institution/types";
import { AREA_BY_KEY, TRAITS, decisionBriefText, parentAlignment, traitCheck, type ParentSurvey } from "@/lib/institution/features";
import { KIND_LABEL as MILESTONE_KIND, type Milestone } from "@/lib/institution/passport";
import { enjoymentLabel } from "@/lib/testDrive";
import { usePortal } from "@/components/institution/portalStore";
import { send } from "@/components/institution/useApi";
import { HowItWorks } from "@/components/HowItWorks";

interface Detail {
  student: StudentRow;
  profile: { uid: string; name: string; email: string; phone: string; category: string; city: string; age: string; desiredCareer: string; clarity: string; latestAssessment: AssessmentSummary | null };
  messages: { id: string; kind: MessageKind; title: string; createdAt: number; sentByName: string; readAt: number | null }[];
  startups: { lessonsCompleted: number; lessonsStarted: number; moduleTests: { module: string; bestPercent: number }[] };
  survey: ParentSurvey | null;
  milestones: Milestone[];
  observation: { ratings: Record<string, number>; by: string; updatedAt: number } | null;
  mentors: { id: string; mentorUid: string; menteeUid: string; mentorName: string; menteeName: string; area: string }[];
}

const KIND_LABEL: Record<MessageKind, string> = { message: "Message", reminder: "Reminder", alert: "Alert", recommendation: "Recommendation" };

export default function StudentPage({ params }: { params: { uid: string } }) {
  const [d, setD] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    apiFetch<Detail>(`/api/institution/students/${params.uid}`).then(setD).catch((e) => setError(e instanceof Error ? e.message : "Could not load this student."));
  }, [params.uid, tick]);

  if (error) return <><BackLink /><div className="ip-alert bad">{error}</div></>;
  if (!d) return <><BackLink /><div className="ip-empty">Loading…</div></>;

  const now = Date.now();
  const s = d.student;
  const a = d.profile.latestAssessment;
  const recs = recommendationsFor(s, now);
  const only = { type: "students" as const, uids: [s.uid], label: s.name };
  const fits: { name: string; pct: number | null }[] = a?.customFields?.length
    ? a.customFields.slice(0, 5).map((f) => ({ name: f.name, pct: Math.round(f.fit) }))
    : (a?.matches ?? []).slice(0, 5).map((m) => ({ name: m.title, pct: Math.round(m.fitmentPct) }));
  const areas = Object.entries(s.activity.byFeature).filter(([, v]) => v > 0).sort((x, y) => y[1] - x[1]);

  return (
    <>
      <BackLink />
      <div className="ip-head">
        <div>
          <h1 className="ip-h1" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{s.name} <StatusPill status={studentStatus(s, now)} /></h1>
          <p className="ip-sub">
            {[s.category ? categoryLabel(s.category) : "", s.email, s.phone, s.city].filter(Boolean).join(" · ")}
            {s.createdAt ? ` · joined ${new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
          </p>
        </div>
        {a ? (
          <Link className="ip-btn ghost" href={`/institution/report/${s.uid}`} style={{ textDecoration: "none" }}><Icon name="doc" size={15} /> Full report</Link>
        ) : null}
        <button className="ip-btn" onClick={() => setCompose({ audience: only })}><Icon name="bell" size={16} stroke={2} /> Message</button>
      </div>
      <HowItWorks id="portal-student" steps={["The top cards show the assessment status, time this week, days active and when they were last active.", "'Suggested next steps' come from their activity and results - press 'Send to student' to message one.", "Below: report trust, parents' view, teacher check, Career Passport, Career GPS, test-drives, family decision, time charts and courses.", "If the student replied to your messages, the conversation is at the bottom - answer it right there."]} sync={"The student sees your messages and answers in their dashboard inbox; parents see the decision sheet and weekly Career GPS on their family page."} />

      <div className="ip-kpis">
        <Kpi icon="check" label="Assessment" value={s.assessment.status === "completed" ? "Done" : s.assessment.status === "in_progress" ? "Unfinished" : "Pending"}
          sub={s.assessment.completedAt ? `Completed ${formatAgoInline(s.assessment.completedAt, now)}` : s.assessment.status === "in_progress" ? "Answers saved - can continue" : "Not started yet"} />
        <Kpi icon="clock" label="Time this week" value={formatDuration(secondsInLast(s, 7, now))} sub={`${formatDuration(s.activity.totalSec)} in total`} />
        <Kpi icon="calendar" label="Days active" value={<>{daysActiveInLast(s, 30, now)}<span style={{ fontSize: 15, color: "var(--muted)" }}>/30</span></>} sub="in the last 30 days" />
        <Kpi icon="pulse" label="Last active" value={formatAgo(s.activity.lastActiveAt, now)} sub={s.activity.lastFeature ? `in ${AREA_LABEL[s.activity.lastFeature] ?? s.activity.lastFeature}` : "No activity recorded yet"} />
      </div>

      <Section title="Suggested next steps" icon="sparkle" aside="generated from their activity and results" style={{ marginTop: 12 }}>
        {recs.length === 0 ? <div className="ip-muted">Nothing to suggest - this student is on track.</div> : recs.map((r) => (
          <div className="ip-rec" key={r.id}>
            <span className="ip-rec-dot" style={{ background: r.priority === "high" ? "var(--bad)" : r.priority === "medium" ? "var(--warn)" : "var(--accent)" }} title={`${r.priority} priority`} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700 }}>{r.title}</div>
              <div className="ip-muted">{r.detail}</div>
            </div>
            {r.message ? (
              <button className="ip-btn ghost sm" onClick={() => setCompose({ audience: only, ...r.message })}>Send to student</button>
            ) : <span className="ip-pill muted plain">For staff</span>}
          </div>
        ))}
      </Section>

      <BeyondReport d={d} onBrief={() => { const b = decisionBriefText(s, now); setCompose({ audience: only, kind: "recommendation", title: b.title, body: b.body, link: "/account" }); }} />

      <Journey s={s} />

      <div className="ip-grid2">
        <Section title="Daily time" icon="pulse" aside="minutes, last 30 days">
          <DailyChart data={lastDays(30, new Date(now)).map((day) => ({ day, value: Math.round((s.activity.byDay[day] ?? 0) / 60) }))} unit="minutes" />
        </Section>
        <Section title="Time by area" icon="clock" aside="all time">
          <Bars rows={areas.map(([k, v]) => ({ label: AREA_LABEL[k] ?? k, value: Math.round(v / 60) }))} format={(m) => formatDuration(m * 60)} empty="No time recorded yet." />
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Assessment results" icon="compass">
          {a ? (
            <>
              <Bars rows={fits.map((f) => ({ label: f.name, value: f.pct ?? 0 }))} format={(n) => `${n}%`} />
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", marginTop: 14, fontSize: 13 }}>
                {(a.desiredCareer || d.profile.desiredCareer) && <><span className="ip-muted">Wants to be</span><b>{a.desiredCareer || d.profile.desiredCareer}</b></>}
                {a.riasecCode && <><span className="ip-muted">Interest code</span><b>{a.riasecCode}</b></>}
                {a.topStrengths?.length > 0 && <><span className="ip-muted">Strengths</span><span>{a.topStrengths.slice(0, 3).map((t) => t.subTraitName || t.parameterName).join(", ")}</span></>}
                {d.profile.clarity && <><span className="ip-muted">Said they are</span><span>{d.profile.clarity}</span></>}
              </div>
              <Link href={`/institution/report/${s.uid}`} className="ip-btn ghost sm" style={{ marginTop: 14, textDecoration: "none" }}>Open the full report →</Link>
            </>
          ) : <div className="ip-muted">No report yet - {s.assessment.status === "in_progress" ? "they started the assessment but haven't finished it." : "they haven't taken the assessment."}</div>}
        </Section>
        <Section title="Courses and plan" icon="book">
          <Bars
            rows={COURSES.map((c) => { const p = s.courses[c.key]; return { label: c.label, value: p?.total ? Math.round((p.done / p.total) * 100) : 0, note: p?.total ? `${p.done}/${p.total} lessons` : "not started" }; })}
            format={(n) => `${n}%`} />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", marginTop: 14, fontSize: 13 }}>
            <span className="ip-muted">Startups</span>
            <span>{d.startups.lessonsCompleted} lesson{d.startups.lessonsCompleted === 1 ? "" : "s"} completed{d.startups.moduleTests.length ? ` · ${d.startups.moduleTests.length} module test${d.startups.moduleTests.length === 1 ? "" : "s"} (best ${Math.max(...d.startups.moduleTests.map((t) => t.bestPercent))}%)` : ""}</span>
            <span className="ip-muted">30/90-day plan</span>
            <span>{s.goals ? `${s.goals.done} of ${s.goals.total} steps ticked` : "Not started"}</span>
          </div>
        </Section>
      </div>

      <Section title="Messages sent" icon="bell" aside={`${d.messages.length} sent`} style={{ marginTop: 12 }}>
        {d.messages.length === 0 ? <div className="ip-muted">Nothing sent to this student yet.</div> : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th>Title</th><th>Type</th><th>Sent</th><th>By</th><th>Opened</th></tr></thead>
              <tbody>
                {d.messages.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.title}</td>
                    <td>{KIND_LABEL[m.kind]}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatAgo(m.createdAt, now)}</td>
                    <td>{m.sentByName}</td>
                    <td>{m.readAt ? <span className="ip-pill good">{formatAgo(m.readAt, now)}</span> : <span className="ip-pill muted">Not yet</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Conversations uid={s.uid} name={s.name} tick={tick} />

      <ComposeMessage preset={compose} onClose={() => setCompose(null)} onSent={() => setTick((t) => t + 1)} />
    </>
  );
}

/** Career GPS, Career Test-Drives and the Family Decision Room for one student. */
function Journey({ s }: { s: StudentRow }) {
  const d = s.decision;
  return (
    <div className="ip-grid2e">
      <Section title="Career GPS and test-drives" icon="compass">
        {s.gps ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <span className="ip-pill muted plain">{s.gps.points} points</span>
            <span className="ip-pill muted plain">{s.gps.streak}-week streak</span>
            <span className={`ip-pill ${s.gps.weekDone >= s.gps.weekTotal ? "good" : s.gps.weekDone > 0 ? "warn" : "muted"}`}>This week {s.gps.weekDone}/{s.gps.weekTotal}</span>
          </div>
        ) : <div className="ip-muted" style={{ marginBottom: 10 }}>Hasn&apos;t opened Career GPS yet (/account/gps).</div>}
        {s.testDrives.length === 0 ? <div className="ip-muted">No career test-drives yet.</div> : s.testDrives.map((t) => (
          <div key={t.career + t.completedAt} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
            <span className={`ip-pill ${t.enjoyment >= 3.4 ? "good" : t.enjoyment >= 2.6 ? "warn" : "bad"}`}>{enjoymentLabel(t.enjoyment)} · {t.enjoyment}/5</span>
            <span style={{ fontSize: 13 }}>{t.career} <span className="ip-muted">· {formatAgo(t.completedAt)}</span></span>
          </div>
        ))}
      </Section>
      <Section title="Family Decision Room" icon="signpost">
        {!d ? <div className="ip-muted">No decision sheet yet - students compare two paths at /account/decision-room.</div> : (
          <>
            <div style={{ fontSize: 14 }}>Comparing <b>{d.pathA}</b> and <b>{d.pathB}</b> · {d.chosen === "undecided" ? "still deciding" : <>chose <b>{d.chosen === "A" ? d.pathA : d.pathB}</b></>}</div>
            {d.reasons && <div className="ip-muted" style={{ marginTop: 4 }}>&ldquo;{d.reasons}&rdquo;</div>}
            <div style={{ marginTop: 8 }}>{d.parentAnswer === "agree" ? <span className="ip-pill good">Parents agree</span> : d.parentAnswer === "discuss" ? <span className="ip-pill warn">Parents want to discuss - invite the family</span> : <span className="ip-pill muted">Parents haven&apos;t answered</span>}</div>
            <div className="ip-muted" style={{ fontSize: 12, marginTop: 6 }}>Saved {formatAgoInline(d.savedAt)}</div>
          </>
        )}
      </Section>
    </div>
  );
}

interface ThreadReply { id: string; from: "student" | "school"; authorName: string; text: string; createdAt: number; seenBySchool: boolean }
interface Thread { messageId: string; messageTitle: string; replies: ThreadReply[]; unread: number }

/** This student's replies to the institution's messages, with an answer box. */
function Conversations({ uid, name, tick }: { uid: string; name: string; tick: number }) {
  const { refreshUnread } = usePortal();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const load = () => apiFetch<{ threads: Thread[] }>(`/api/institution/replies?uid=${uid}`).then((r) => {
    setThreads(r.threads);
    const unseen = r.threads.flatMap((t) => t.replies.filter((x) => x.from === "student" && !x.seenBySchool).map((x) => x.id));
    if (unseen.length) void send("/api/institution/replies", "POST", { seen: unseen }).then(() => refreshUnread()).catch(() => undefined);
  }).catch(() => setThreads([]));
  useEffect(() => { void load(); }, [uid, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  async function answer(messageId: string) {
    const text = (draft[messageId] ?? "").trim();
    if (!text) return;
    setBusy(messageId); setErr("");
    try { await send("/api/institution/replies", "POST", { messageId, studentUid: uid, text }); setDraft((d) => ({ ...d, [messageId]: "" })); await load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not send."); }
    finally { setBusy(null); }
  }

  if (!threads || threads.length === 0) return null;
  return (
    <Section title={`Conversation with ${name}`} icon="answer" aside="their replies to your messages" style={{ marginTop: 12 }}>
      {err && <div className="ip-alert bad">{err}</div>}
      {threads.map((t) => (
        <div key={t.messageId} style={{ borderTop: "1px solid var(--line)", padding: "10px 0" }}>
          <div className="ip-muted" style={{ fontWeight: 700, marginBottom: 6 }}>On &ldquo;{t.messageTitle}&rdquo;</div>
          <div style={{ display: "grid", gap: 6 }}>
            {t.replies.map((r) => (
              <div key={r.id} style={{ justifySelf: r.from === "school" ? "end" : "start", maxWidth: "80%", background: r.from === "school" ? "var(--accentTint)" : "var(--line2)", borderRadius: 12, padding: "8px 12px", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                {r.text}<div className="ip-muted" style={{ fontSize: 11 }}>{r.from === "school" ? r.authorName : name} · {formatAgo(r.createdAt)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <textarea className="ip-input" rows={1} maxLength={1000} placeholder={`Answer ${name}…`} value={draft[t.messageId] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [t.messageId]: e.target.value }))} />
            <button className="ip-btn sm" disabled={busy === t.messageId || !(draft[t.messageId] ?? "").trim()} onClick={() => void answer(t.messageId)}>Send</button>
          </div>
        </div>
      ))}
    </Section>
  );
}

function BackLink() {
  return <Link href="/institution/students" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink3)", fontWeight: 700, fontSize: 13, textDecoration: "none", marginBottom: 12 }}><Icon name="chevronLeft" size={15} /> All students</Link>;
}

/** Trust in the report, the parents' view, teachers' check, Career Passport and mentor - one glance each. */
function BeyondReport({ d, onBrief }: { d: Detail; onBrief: () => void }) {
  const s = d.student;
  const q = s.assessment.quality;
  const al = d.survey ? parentAlignment(d.survey, s) : null;
  const gaps = traitCheck(d.observation?.ratings ?? {}, s.assessment.strengths);
  const tone = (t: string) => ({ conflict: "bad", partial: "warn", aligned: "good", open: "good", no_report: "muted" } as Record<string, string>)[t];
  return (
    <div className="ip-grid2e">
      <Section title="Report trust and next decision" icon="shield">
        {q ? (
          <div style={{ marginBottom: 10 }}>
            <span className={`ip-pill ${q.trust === "high" ? "good" : q.trust === "medium" ? "warn" : "bad"}`}>{q.trust === "high" ? "Answered carefully" : q.trust === "medium" ? "Check this report" : "Low trust - consider a retake"}</span>
            <div className="ip-muted" style={{ marginTop: 6 }}>{Math.round(q.durationSec / 60)} min for {q.answered} of {q.total} questions · {q.avgSecPerQuestion}s a question{q.reasons.length ? ` · ${q.reasons.join("; ")}` : ""}</div>
          </div>
        ) : <div className="ip-muted" style={{ marginBottom: 10 }}>Trust is measured for assessments taken from now on.</div>}
        <button className="ip-btn ghost sm" onClick={onBrief}>Send their decision brief</button>
      </Section>
      <Section title="Parents' view" icon="heart">
        {!d.survey ? <div className="ip-muted">Parents haven&apos;t answered the survey - create a link on the <Link href="/institution/parents">Parents</Link> page.</div> : (
          <>
            <span className={`ip-pill ${tone(al!.status)}`}>{al!.status === "conflict" ? "Conflict" : al!.status === "partial" ? "Partly aligned" : al!.status === "no_report" ? "Awaiting assessment" : "Aligned"}</span>
            <div style={{ marginTop: 6 }}>{al!.summary}</div>
            <div className="ip-muted" style={{ marginTop: 4 }}>
              {d.survey.parentName || "Parent"}{d.survey.relation ? ` (${d.survey.relation})` : ""} hopes for {d.survey.areas.includes("open") ? "whatever the child chooses" : d.survey.areas.map((x) => AREA_BY_KEY[x]?.label ?? x).join(", ")}{d.survey.priorities.length ? ` · values ${d.survey.priorities.join(", ")}` : ""}
            </div>
            {al!.status === "conflict" && <ol style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.6 }}>{al!.guide.map((g) => <li key={g}>{g}</li>)}</ol>}
          </>
        )}
      </Section>
      <Section title="Teacher check" icon="check">
        {!d.observation ? <div className="ip-muted">No ratings yet - teachers rate on the <Link href="/institution/observations">Teacher check</Link> page.</div> : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{TRAITS.map((t) => <span key={t.key} className="ip-pill muted plain">{t.label}: {d.observation!.ratings[t.key] ?? "-"}/5</span>)}</div>
            {gaps.length ? gaps.map((g) => <div key={g.trait} className="ip-muted" style={{ marginTop: 6 }}>• {g.text}</div>) : <div className="ip-muted" style={{ marginTop: 6 }}>Teachers and the test broadly agree.</div>}
          </>
        )}
      </Section>
      <Section title="Career Passport and mentor" icon="award">
        {d.milestones.length === 0 ? <div className="ip-muted">No milestones added yet.</div> : d.milestones.slice(0, 5).map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
            <span className={`ip-pill ${m.status === "verified" ? "good" : m.status === "pending" ? "warn" : "muted"}`}>{m.status === "verified" ? "Verified" : m.status === "pending" ? "To review" : "Not accepted"}</span>
            <span style={{ fontSize: 13 }}>{m.title} <span className="ip-muted">· {MILESTONE_KIND[m.kind]}</span></span>
          </div>
        ))}
        {d.milestones.some((m) => m.status === "pending") && <Link href="/institution/passport" className="ip-btn ghost sm" style={{ textDecoration: "none", marginTop: 6 }}>Review milestones</Link>}
        <div className="ip-muted" style={{ marginTop: 10 }}>
          {d.mentors.length === 0 ? "No peer mentor yet." : d.mentors.map((p) => (p.mentorUid === s.uid ? `Mentors ${p.menteeName} (${p.area})` : `Mentored by ${p.mentorName} (${p.area})`)).join(" · ")}
        </div>
      </Section>
    </div>
  );
}
