"use client";
/**
 * /account/ai/safety - using AI well and safely: the five rules (worded for
 * the learner's age), what's allowed in schoolwork, deepfakes and AI scams
 * (the 1930 helpline, linked to Law & Rights and Scam Shield), and a note for
 * parents of under-18s.
 */
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { RULES } from "@/lib/ai/catalog";
import { AiShell, useLearner } from "@/components/ai/AiParts";

export default function AiSafety() {
  return <AiShell><Safety /></AiShell>;
}

function Safety() {
  const learner = useLearner();
  return (
    <>
      <PageHeader
        icon="shield"
        eyebrow="Use AI safely"
        title="Use AI to think better, not to stop thinking"
        subtitle="Five rules that come with every course and tool here, what's fair in schoolwork, and how to spot AI scams and deepfakes."
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="fp-sec-h"><div><h2>Five rules</h2></div></div>
        <div className="ai-rules">
          {RULES.map((r, i) => <div key={r.title} className="ai-rule"><i>{i + 1}</i><b>{r.title}</b><p>{learner.band === "kids" ? r.kids : r.text}</p></div>)}
        </div>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>AI and schoolwork</h2><p>Follow your school&apos;s rules first. Where it has none, this is fair.</p></div></div>
        <div className="sf-cols">
          <div className="fp-card sf-col is-ok">
            <b><Icon name="check" size={16} stroke={2.4} /> Fine to do</b>
            <ul><li>Brainstorm ideas</li><li>Ask it to explain a concept another way</li><li>Make practice quizzes</li><li>Check grammar and spelling</li><li>Get feedback on your own draft</li></ul>
          </div>
          <div className="fp-card sf-col is-no">
            <b><Icon name="close" size={16} stroke={2.4} /> Not fair</b>
            <ul><li>Let it write your assignment, essay or application</li><li>Use it during a test</li><li>Invent sources, quotes or data</li><li>Hand in AI work as your own</li></ul>
          </div>
          <div className="fp-card sf-col">
            <b><Icon name="answer" size={16} stroke={2} /> Say how you used it</b>
            <p>Add one honest line where AI helped, for example:</p>
            <blockquote>&ldquo;I used AI to check my grammar and to make practice questions.&rdquo;</blockquote>
          </div>
        </div>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Deepfakes and AI scams</h2><p>AI can copy a face or a voice in seconds. Scammers use it.</p></div></div>
        <div className="fp-card" style={{ padding: "18px 20px" }}>
          <ul className="sf-list">
            <li><b>A panicked call from &ldquo;family&rdquo; asking for money?</b> Hang up and call them back on the number you already have. Agree a family code word only you know.</li>
            <li><b>A video of a famous person promising money or prizes?</b> Look for odd lips, blinking, hands and lighting - and check the person&apos;s official account.</li>
            <li><b>Never</b> share OTPs, UPI PINs, passwords or Aadhaar details - not with a caller, not with an AI chat.</li>
            <li><b>Targeted or scammed?</b> Call the cyber fraud helpline <a href="tel:1930" className="sf-num">1930</a> straight away, and report it at <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer">cybercrime.gov.in</a>.</li>
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            <Link href="/account/money/scam-shield" className="fp-btn fp-btn-sm">Practise spotting scams <Icon name="arrowRight" size={14} stroke={2} /></Link>
            <Link href="/account/legal/help" className="fp-btn fp-btn-sm">Helplines and your rights <Icon name="arrowRight" size={14} stroke={2} /></Link>
          </div>
        </div>
      </section>

      {learner.band !== "adult" && (
        <section className="fp-sec">
          <div className="ai-banner" style={{ marginBottom: 0 }}>
            <Icon name="users" size={18} stroke={2} />
            <span><b>For parents:</b> OneGrasp shows students only the tools allowed at their age, and links out - it never signs in to any tool for them. Chat assistants need a parent&apos;s permission until 18; most have parental controls. In projects, students should never upload photos of themselves or others to AI tools.</span>
          </div>
        </section>
      )}
      <style dangerouslySetInnerHTML={{ __html: SAFETY_CSS }} />
    </>
  );
}

const SAFETY_CSS = `
.sf-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.sf-col{padding:16px 18px}
.sf-col b{display:flex;align-items:center;gap:6px;font-size:15px;margin-bottom:8px}
.sf-col.is-ok b{color:var(--ok)}
.sf-col.is-no b{color:#b42318}
.sf-col ul{margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:var(--ink2)}
.sf-col p{margin:0 0 8px;font-size:14px;color:var(--ink2)}
.sf-col blockquote{margin:0;padding:10px 12px;background:var(--soft);border-left:3px solid var(--accent);border-radius:4px;font-size:14px;color:var(--ink)}
.sf-list{margin:0;padding-left:18px;display:grid;gap:10px;font-size:14px;line-height:1.6;color:var(--ink2)}
.sf-list b{color:var(--ink)}
.sf-num{font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:16px;color:var(--accent)}
@media (max-width:900px){.sf-cols{grid-template-columns:minmax(0,1fr)}}
`;
