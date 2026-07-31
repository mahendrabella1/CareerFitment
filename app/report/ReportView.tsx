"use client";

import { useMemo } from "react";
import { buildNarrative } from "@/lib/report/narrative";
import type { FitmentResult } from "@/lib/engine/fitment/types";

type ScoreParam = {
  parameterName: string;
  scoringStrategy: string;
  subTraits: { subTraitName: string; rawScore: number; normalizedScore: number }[];
};

export type ReportData = {
  student: {
    name: string;
    email: string;
    city: string | null;
    age: string | null;
    dreamCareer: string | null;
    stage: string | null;
  } | null;
  score: {
    sessionId: string;
    journey: { code: string; name: string; ageGroup: string };
    topStrengths: {
      parameterName: string;
      subTraitName: string;
      normalizedScore: number;
    }[];
    parameters: ScoreParam[];
  };
  fitment: FitmentResult;
};

const RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"] as const;
const RIASEC_TITLE: Record<string, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};
const CATEGORY_LABEL: Record<string, string> = {
  interest: "Interest",
  aptitude: "Aptitude",
  personality: "Personality",
  values: "Values",
  mi: "Intelligences",
  ei: "Emotional Int.",
  academic: "Academics",
};

export default function ReportView({ data }: { data: ReportData }) {
  const { student, score, fitment } = data;
  const narrative = useMemo(
    () => buildNarrative(score, fitment, student?.name),
    [score, fitment, student]
  );

  const firstName = student?.name?.trim().split(/\s+/)[0] ?? "there";
  const generated = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rep">
      {/* ---------- Cover / header ---------- */}
      <header className="rep-cover">
        <div className="rep-cover-top">
          <span className="og-logo">
            One<span>Grasp</span>
          </span>
          <button className="rep-print" onClick={() => window.print()} type="button">
            ⤓ Save / Print PDF
          </button>
        </div>
        <p className="rep-eyebrow">Career Fitment Report</p>
        <h1>
          {student?.name ?? "Your"}
          {student?.name ? "'s report" : " report"}
        </h1>
        <div className="rep-cover-meta">
          <span>{score.journey.name}</span>
          <span>·</span>
          <span>{score.journey.ageGroup}</span>
          {student?.city ? (
            <>
              <span>·</span>
              <span>{student.city}</span>
            </>
          ) : null}
          <span>·</span>
          <span>{generated}</span>
        </div>
        <span className={`rep-confidence ${fitment.validity.confidence}`}>
          {fitment.validity.confidence} confidence
        </span>
      </header>

      {/* ---------- Snapshot ---------- */}
      <section className="rep-snapshot">
        <div className="rep-code-badge">
          <span>Your code</span>
          <strong>{fitment.profile.riasecCode ?? "—"}</strong>
        </div>
        <div className="rep-snapshot-copy">
          <h2>{narrative.headline}</h2>
          <p>{narrative.summary}</p>
        </div>
      </section>

      {/* ---------- Interest themes ---------- */}
      {fitment.profile.riasec ? (
        <section className="rep-section">
          <div className="rep-head">
            <h3>Your career interests</h3>
            <p>How your six Holland interest themes compare.</p>
          </div>
          <div className="rep-riasec">
            {RIASEC_ORDER.map((letter) => {
              const value = Math.round(fitment.profile.riasec?.[letter] ?? 0);
              const top = fitment.profile.riasecCode?.includes(letter);
              return (
                <div key={letter} className={`rep-riasec-bar${top ? " top" : ""}`}>
                  <div className="rep-riasec-track">
                    <div className="rep-riasec-fill" style={{ height: `${Math.max(value, 3)}%` }} />
                  </div>
                  <strong>{value}</strong>
                  <span>{RIASEC_TITLE[letter]}</span>
                </div>
              );
            })}
          </div>
          <div className="rep-theme-cards">
            {narrative.interestThemes.map((t) => (
              <article key={t.letter} className="rep-theme-card">
                <span className="rep-theme-letter">{t.letter}</span>
                <div>
                  <strong>{t.title}</strong>
                  <p>You are drawn to {t.meaning}.</p>
                </div>
                <span className="rep-theme-score">{t.score}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------- Top 5 career matches ---------- */}
      <section className="rep-section">
        <div className="rep-head">
          <h3>Your top 5 career matches</h3>
          <p>The five careers your whole profile fits best, most-fit first.</p>
        </div>
        <div className="rep-matches">
          {fitment.matches.slice(0, 5).map((m, i) => (
            <article key={m.careerId} className="rep-match">
              <div className="rep-match-rank">{i + 1}</div>
              <div className="rep-match-main">
                <div className="rep-match-row">
                  <div>
                    <strong>{m.title}</strong>
                    <span className="rep-match-cluster">
                      {m.cluster} · {m.roles.join(", ")}
                    </span>
                  </div>
                  <div className="rep-match-score">
                    <span className={`rep-band band-${m.band.replace(/\s/g, "")}`}>{m.band}</span>
                    <strong>{m.fitmentPct}%</strong>
                  </div>
                </div>
                <div className="rep-fit-track">
                  <div className="rep-fit-fill" style={{ width: `${m.fitmentPct}%` }} />
                </div>
                <p className="rep-match-blurb">{m.blurb}</p>
                <div className="rep-contribs">
                  {m.contributions.slice(0, 5).map((c) => (
                    <span key={c.category} className="rep-contrib">
                      {CATEGORY_LABEL[c.category] ?? c.category} {Math.round(c.similarity * 100)}%
                    </span>
                  ))}
                </div>
                {m.gaps.length > 0 ? (
                  <ul className="rep-gaps">
                    {m.gaps.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        {fitment.matches.length > 5 ? (
          <div className="rep-more">
            <span>Also worth exploring:</span>
            <div className="rep-more-tags">
              {fitment.matches.slice(5, 10).map((m) => (
                <em key={m.careerId}>
                  {m.title} · {m.fitmentPct}%
                </em>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* ---------- Clusters + strengths ---------- */}
      <section className="rep-two-col">
        <div className="rep-panel">
          <h3>Top career clusters</h3>
          <div className="rep-clusters">
            {fitment.clusters.slice(0, 6).map((c) => (
              <div key={c.cluster} className="rep-cluster-row">
                <span>{c.cluster}</span>
                <div className="rep-cluster-track">
                  <div className="rep-cluster-fill" style={{ width: `${c.score}%` }} />
                </div>
                <strong>{c.score}%</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="rep-panel">
          <h3>Your strengths</h3>
          <ul className="rep-list good">
            {narrative.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {narrative.growthAreas.length > 0 ? (
            <>
              <h3 className="rep-subhead">Areas to develop</h3>
              <ul className="rep-list grow">
                {narrative.growthAreas.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      {/* ---------- Profile at a glance ---------- */}
      <section className="rep-section">
        <div className="rep-head">
          <h3>Your profile at a glance</h3>
        </div>
        <div className="rep-glance">
          {fitment.profile.topAptitudes.length > 0 ? (
            <GlanceCard
              label="Strongest aptitudes"
              items={fitment.profile.topAptitudes.map((a) => `${a.skill} ${a.score}`)}
            />
          ) : null}
          {fitment.profile.topValues.length > 0 ? (
            <GlanceCard label="Core motivators" items={fitment.profile.topValues.map((v) => v.tag)} />
          ) : null}
          {fitment.profile.topIntelligences.length > 0 ? (
            <GlanceCard
              label="Top intelligences"
              items={fitment.profile.topIntelligences.map((m) => m.name)}
            />
          ) : null}
          {fitment.profile.ei !== null ? (
            <GlanceCard label="Emotional intelligence" items={[`${fitment.profile.ei}/100`]} />
          ) : null}
        </div>
      </section>

      {/* ---------- Learning style + next steps ---------- */}
      <section className="rep-two-col">
        {narrative.learningStyle ? (
          <div className="rep-panel accent">
            <h3>How you learn best</h3>
            <strong className="rep-ls-name">{narrative.learningStyle.name}</strong>
            <p>{narrative.learningStyle.advice}</p>
          </div>
        ) : null}
        <div className="rep-panel">
          <h3>Recommended next steps</h3>
          <ol className="rep-steps">
            {narrative.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Recommendations ---------- */}
      <section className="rep-section">
        <div className="rep-head">
          <h3>What to explore next, {firstName}</h3>
        </div>
        <ul className="rep-reco">
          {narrative.recommendations.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <footer className="rep-footer">
        <p>
          This report is based on your responses across 8 psychometric categories, scored and
          matched against a career library using OneGrasp&apos;s fitment engine. Use it as
          guidance to explore — not as a fixed verdict.
        </p>
        <span>OneGrasp · Career Fitment Report</span>
      </footer>
    </div>
  );
}

function GlanceCard({ label, items }: { label: string; items: string[] }) {
  return (
    <article className="rep-glance-card">
      <span>{label}</span>
      <div className="rep-glance-tags">
        {items.map((it) => (
          <em key={it}>{it}</em>
        ))}
      </div>
    </article>
  );
}
