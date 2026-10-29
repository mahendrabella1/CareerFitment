"use client";
/**
 * /account/ai/courses - every free AI course that ends in a free certificate
 * or badge, level by level. Starts filtered to the learner's class; anyone
 * can widen it. Each course opens on the provider's site.
 */
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { CHECKED, COURSES, GROUP_LABEL, LEVELS, coursesFor, type Group, type Level } from "@/lib/ai/catalog";
import { AiShell, CourseRow, useLearner } from "@/components/ai/AiParts";

export default function AiCourses() {
  return <AiShell><Suspense fallback={null}><Courses /></Suspense></AiShell>;
}

const GROUPS: Group[] = ["6-8", "9-12", "college", "teachers", "everyone"];

function Courses() {
  const learner = useLearner();
  const params = useSearchParams();
  const [group, setGroup] = useState<Group | "all" | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [india, setIndia] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => { const l = Number(params.get("level")); if (l >= 1 && l <= 4) setLevel(l as Level); }, [params]);
  // Start with the learner's own class group.
  const shownGroup = group ?? learner.group ?? "all";

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (shownGroup === "all" ? COURSES : coursesFor(shownGroup)).filter((c) =>
      (!level || c.level === level) && (!india || c.kind === "india") &&
      (!s || `${c.name} ${c.provider} ${c.why}`.toLowerCase().includes(s)));
  }, [shownGroup, level, india, q]);

  const certs = COURSES.filter((c) => c.certificate === "certificate").length;

  return (
    <>
      <PageHeader
        icon="award"
        eyebrow="Free courses"
        title="Free AI courses with free certificates"
        subtitle="Every course here is free and ends in a free certificate or badge from the provider - the Government of India, universities and companies. You learn on their site; OneGrasp never charges."
        meta={[`${COURSES.length} courses`, `${certs} certificates, ${COURSES.length - certs} badges`, `Checked ${CHECKED}`]}
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="fp-dir" style={{ marginBottom: 14 }}>
          <div className="fp-dir-h" style={{ gap: 8 }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses or providers" aria-label="Search courses" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span className="fp-muted" style={{ marginRight: 2 }}>For</span>
              {GROUPS.map((g) => (
                <button key={g} className="fp-chip" aria-pressed={shownGroup === g} onClick={() => setGroup(g)}>
                  {GROUP_LABEL[g]}{g === learner.group ? " (you)" : ""}
                </button>
              ))}
              <button className="fp-chip" aria-pressed={shownGroup === "all"} onClick={() => setGroup("all")}>Show all</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span className="fp-muted" style={{ marginRight: 2 }}>Level</span>
              <button className="fp-chip" aria-pressed={!level} onClick={() => setLevel(null)}>Any</button>
              {LEVELS.map((l) => <button key={l.level} className="fp-chip" aria-pressed={level === l.level} onClick={() => setLevel(level === l.level ? null : l.level)}>{l.level}. {l.short}</button>)}
              <span style={{ flex: 1 }} />
              <button className="fp-chip" aria-pressed={india} onClick={() => setIndia(!india)}>Government of India only</button>
            </div>
          </div>
        </div>

        {LEVELS.map((l) => {
          const rows = list.filter((c) => c.level === l.level);
          if (!rows.length) return null;
          return (
            <div key={l.level} style={{ marginBottom: 26 }}>
              <div className="fp-sec-h" style={{ marginBottom: 10 }}><div><h2>Level {l.level}: {l.name}</h2><p>{l.text}</p></div></div>
              <div className="ai-list">{rows.map((c) => <CourseRow key={c.slug} c={c} />)}</div>
            </div>
          );
        })}
        {list.length === 0 && <p className="fp-muted">No course matches. Try fewer words, or <button className="fp-link" style={{ fontSize: 13 }} onClick={() => { setGroup("all"); setLevel(null); setIndia(false); setQ(""); }}>show every course</button>.</p>}
      </section>

      <section className="fp-sec">
        <div className="fp-card" style={{ padding: "18px 20px" }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>How the free certificates work</h2>
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.65, color: "var(--ink2)" }}>
            <li>Sign up on the provider&apos;s site with your own email (some ask a parent to sign up for students under 18).</li>
            <li>Finish every lesson and the final quiz or project - that is what earns the certificate.</li>
            <li>Download it and keep a copy. Add it to your <Link href="/account/passport" className="fp-link" style={{ fontSize: 14 }}>Career Passport</Link> so your school can verify it.</li>
          </ol>
          <p className="fp-muted" style={{ margin: "12px 0 0" }}><Icon name="info" size={13} stroke={2} /> Checked in {CHECKED}. Providers change their courses and rules - if a site asks you to pay for the certificate, it isn&apos;t the free one listed here.</p>
        </div>
      </section>
    </>
  );
}
