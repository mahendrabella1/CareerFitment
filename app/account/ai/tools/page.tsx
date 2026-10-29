"use client";
/**
 * /account/ai/tools - AI tools with a rating card each (age, privacy, safety,
 * accuracy, what's free, tips). Age-gated by the learner's class: class 6-8
 * see only tools made for children and classrooms; class 9-12 also see 13+
 * tools, marked "parent permission"; 18+ tools only show to adults.
 */
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { CHECKED, TOOLS, TOOL_CATEGORIES, toolsFor, type ToolCategory } from "@/lib/ai/catalog";
import { AiShell, ToolCard, useLearner } from "@/components/ai/AiParts";

export default function AiTools() {
  return <AiShell><Tools /></AiShell>;
}

function Tools() {
  const learner = useLearner();
  const allowed = useMemo(() => toolsFor(learner.band), [learner.band]);
  const [cat, setCat] = useState<ToolCategory | null>(null);
  const [target, setTarget] = useState("");
  useEffect(() => { setTarget(window.location.hash.slice(1)); }, []);
  const list = allowed.filter((t) => !cat || t.categories.includes(cat));
  const cats = TOOL_CATEGORIES.filter((c) => allowed.some((t) => t.categories.includes(c)));
  const hidden = TOOLS.length - allowed.length;

  return (
    <>
      <PageHeader
        icon="cpu"
        eyebrow="AI tools"
        title={learner.band === "adult" ? "AI tools, rated" : "AI tools allowed at your age"}
        subtitle="Each tool has a rating card: who it's for, what's free, what happens to your data, and how to use it well. OneGrasp only links to them - we never sign in for you, and no tool pays to be listed."
        meta={[`${allowed.length} tools`, `Checked ${CHECKED}`]}
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        {learner.band === "kids" && (
          <div className="ai-banner"><Icon name="shield" size={18} stroke={2} /><span>You&apos;re seeing tools made for children and classrooms. Chat assistants like Gemini and ChatGPT are for ages 13 and up - ask a teacher or parent before trying any AI tool.</span></div>
        )}
        {learner.band === "teen" && (
          <div className="ai-banner"><Icon name="shield" size={18} stroke={2} /><span>Tools marked <b>13+ · parent permission</b> need a parent&apos;s or guardian&apos;s OK until you&apos;re 18 - show them the rating card. Tools for adults only aren&apos;t shown.</span></div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <button className="fp-chip" aria-pressed={!cat} onClick={() => setCat(null)}>All</button>
          {cats.map((c) => <button key={c} className="fp-chip" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>)}
        </div>
        <div className="ai-tools">
          {list.map((t) => <ToolCard key={t.slug} t={t} open={t.slug === target} />)}
        </div>
        {hidden > 0 && <p className="fp-muted" style={{ marginTop: 12 }}>{hidden} more {hidden === 1 ? "tool is" : "tools are"} for older learners.</p>}
      </section>
    </>
  );
}
