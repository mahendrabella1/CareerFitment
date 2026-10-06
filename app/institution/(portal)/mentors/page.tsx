"use client";

/** /institution/mentors - seniors matched to mentor juniors who share a career area. */
import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { Section } from "@/components/institution/ui";
import { send, useApi } from "@/components/institution/useApi";
import { AREA_BY_KEY, suggestMentors } from "@/lib/institution/features";

interface Pair { id: string; mentorUid: string; menteeUid: string; mentorName: string; menteeName: string; area: string; createdAt: number }

export default function MentorsPage() {
  const { students } = usePortal();
  const { data, error, reload } = useApi<{ pairs: Pair[] }>("/api/institution/mentors");
  const [busy, setBusy] = useState<string | null>(null);
  const taken = useMemo(() => new Set((data?.pairs ?? []).map((p) => p.menteeUid)), [data]);
  const suggestions = useMemo(() => (students && data ? suggestMentors(students, taken) : []), [students, data, taken]);

  if (error) return <div className="ip-alert bad">{error}</div>;
  if (!data || !students) return <div className="ip-empty">Loading…</div>;
  const confirm = async (mentorUid: string, menteeUid: string, area: string) => {
    setBusy(menteeUid);
    try { await send("/api/institution/mentors", "POST", { mentorUid, menteeUid, area }); await reload(); }
    finally { setBusy(null); }
  };
  const end = async (id: string) => { await send(`/api/institution/mentors?id=${id}`, "DELETE"); await reload(); };

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Peer mentors</h1>
          <p className="ip-sub">Seniors who are heading the same way as a junior - same career area, further along - matched automatically. Confirm a pair and both get an introduction; you arrange the first meeting. No contact details are shared.</p>
        </div>
      </div>
      <Section title={`Suggested pairs (${suggestions.length})`} icon="sparkle" aside="best-prepared seniors first; up to 3 juniors each">
        {suggestions.length === 0 ? <div className="ip-muted">No new matches - pairs need students in different classes who share a career area and have completed the assessment.</div> : suggestions.map(({ mentor, mentee, area }) => (
          <div className="ip-rec" key={mentee.uid}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div><b><Link href={`/institution/students/${mentor.uid}`} style={{ color: "var(--ink)" }}>{mentor.name}</Link></b> <span className="ip-muted">({categoryLabel(mentor.category)})</span> → <b><Link href={`/institution/students/${mentee.uid}`} style={{ color: "var(--ink)" }}>{mentee.name}</Link></b> <span className="ip-muted">({categoryLabel(mentee.category)})</span></div>
              <div className="ip-muted">Both lean towards {AREA_BY_KEY[area]?.label ?? area}{mentor.assessment.desiredCareer ? ` · senior wants ${mentor.assessment.desiredCareer}` : ""}{mentee.assessment.desiredCareer ? ` · junior wants ${mentee.assessment.desiredCareer}` : ""}</div>
            </div>
            <button className="ip-btn sm" disabled={busy === mentee.uid} onClick={() => void confirm(mentor.uid, mentee.uid, area)}>Confirm pair</button>
          </div>
        ))}
      </Section>
      <Section title={`Active pairs (${data.pairs.length})`} icon="route" style={{ marginTop: 12 }}>
        {data.pairs.length === 0 ? <div className="ip-muted">None yet.</div> : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th>Mentor</th><th>Mentee</th><th>Area</th><th>Since</th><th /></tr></thead>
              <tbody>
                {data.pairs.sort((a, b) => b.createdAt - a.createdAt).map((p) => (
                  <tr key={p.id}>
                    <td className="ip-name"><Link href={`/institution/students/${p.mentorUid}`}>{p.mentorName}</Link></td>
                    <td className="ip-name"><Link href={`/institution/students/${p.menteeUid}`}>{p.menteeName}</Link></td>
                    <td>{p.area}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    <td className="num"><button className="ip-btn ghost sm" onClick={() => void end(p.id)}>End</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  );
}
