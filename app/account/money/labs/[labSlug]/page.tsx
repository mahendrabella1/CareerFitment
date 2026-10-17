"use client";

import Link from "next/link";
import { CompoundingLab } from "@/components/money/CompoundingLab";
import { EmiLab } from "@/components/money/EmiLab";
import { GoalPlannerLab } from "@/components/money/GoalPlannerLab";
import { InflationLab } from "@/components/money/InflationLab";
import { CreditCardLab } from "@/components/money/CreditCardLab";
import { SaveVsGrowLab } from "@/components/money/SaveVsGrowLab";
import { SalarySlipLab } from "@/components/money/SalarySlipLab";
import { RentVsBuyLab } from "@/components/money/RentVsBuyLab";
import { labBySlug } from "@/data/money/labs";
import { HeaderNote, PageHeader } from "@/components/course/fx";
import { Icon } from "@/app/Icons";

// The tool on the left in a white card; how to use it and where to go next
// on the right, so the page has no empty half on a wide screen.
const LAB_CSS = `
.lab-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start}
.lab-work{padding:22px 24px}
.lab-work-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:14px;margin-bottom:18px;border-bottom:1px solid #f0f1f3}
.lab-work-h h2{font-size:16px;font-weight:700;margin:0}
.lab-work-h span{font-size:12.5px;color:#6b7280}
.lab-rail{display:flex;flex-direction:column;gap:14px;position:sticky;top:calc(var(--bar,0px) + 20px)}
.lab-rail .fx-card{padding:16px 18px}
.lab-rail h3{font-size:14px;font-weight:600;margin:0 0 10px}
.lab-steps{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;counter-reset:s}
.lab-steps li{display:flex;gap:10px;font-size:13.5px;color:#374151;line-height:1.5;counter-increment:s}
.lab-steps li::before{content:counter(s);flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:600;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,#fff)}
.lab-cta{display:flex;flex-direction:column;gap:4px;text-decoration:none;color:#111827}
.lab-cta b{font-size:14px;font-weight:600}
.lab-cta span{font-size:13px;color:#4b5563;line-height:1.5}
.lab-cta em{font-style:normal;font-size:13px;font-weight:600;color:var(--accent);margin-top:4px}
@media (max-width:1100px){.lab-grid{grid-template-columns:minmax(0,1fr)}.lab-rail{position:static}}
@media (max-width:640px){.lab-work{padding:16px}}
`;

export default function LabPage({ params }: { params: { labSlug: string } }) {
  const slug = params.labSlug;
  const lab = labBySlug(slug);

  if (!lab) {
    return (
      <div>
        <PageHeader icon="score" eyebrow="Money Lab" title="That lab doesn't exist" subtitle="It may have been renamed."
          actions={<Link href="/account/money/labs" className="fx-btn fx-btn-primary">See all labs</Link>} />
      </div>
    );
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: LAB_CSS }} />
      <PageHeader
        icon={lab.glyph}
        eyebrow="Money Lab"
        title={lab.title}
        subtitle={lab.desc}
        meta={[lab.worlds]}
        aside={<HeaderNote title="What you'll learn"><ul>{lab.learn.map((l) => <li key={l}>{l}</li>)}</ul></HeaderNote>}
      />

      <div className="lab-grid">
        <section className="fx-card lab-work" aria-label={lab.title}>
          <div className="lab-work-h">
            <h2>Try it</h2>
            <span>Every number updates as you move a slider.</span>
          </div>
          {slug === "compounding" && <CompoundingLab />}
          {slug === "inflation" && <InflationLab />}
          {slug === "emi" && <EmiLab />}
          {slug === "credit-card" && <CreditCardLab />}
          {slug === "save-vs-grow" && <SaveVsGrowLab />}
          {slug === "salary-slip" && <SalarySlipLab />}
          {slug === "goal-planner" && <GoalPlannerLab />}
          {slug === "rent-vs-buy" && <RentVsBuyLab />}
        </section>

        <aside className="lab-rail">
          <div className="fx-card">
            <h3>How to use it</h3>
            <ol className="lab-steps">{lab.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
          <Link href="/account/money/play" className="fx-card fx-lift lab-cta">
            <b>Use it in a real month</b>
            <span>Money Life puts you in charge of a monthly budget. Try what you just learned there.</span>
            <em>Play Money Life →</em>
          </Link>
          <Link href="/account/money/cards" className="fx-card fx-lift lab-cta">
            <b><Icon name="book" size={15} stroke={2} style={{ verticalAlign: "-2px", marginRight: 6 }} />Read the idea in a minute</b>
            <span>Short Concept Library cards explain the idea behind each lab.</span>
            <em>Open the cards →</em>
          </Link>
        </aside>
      </div>
    </div>
  );
}
