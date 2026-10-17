import Link from "next/link";
import { LABS } from "@/data/money/labs";
import { PageHeader } from "@/components/course/fx";
import { Icon } from "@/app/Icons";

const CSS = `
.labs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.labs-card{display:flex;flex-direction:column;gap:10px;padding:16px 18px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;text-decoration:none;color:#111827;min-width:0}
.labs-top{display:flex;align-items:center;gap:12px}
.labs-ic{flex:none;width:38px;height:38px;border-radius:9px;display:grid;place-items:center;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,#fff)}
.labs-t{font-size:15px;font-weight:600;line-height:1.3}
.labs-w{font-size:12px;color:#6b7280}
.labs-d{font-size:13.5px;color:#4b5563;line-height:1.5;margin:0;flex:1}
.labs-go{font-size:13.5px;font-weight:600;color:var(--accent);padding-top:10px;border-top:1px solid #f0f1f3}
`;

export default function LabsPage() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <PageHeader icon="score" eyebrow="Money Labs" title="Try the numbers yourself"
        subtitle="Move the sliders and watch the numbers change. Every rate is labelled as an assumption, and each lab shows how it is calculated."
        meta={[`${LABS.length} labs`, "About 5 minutes each"]}
        actions={<Link href="/account/money/labs/compounding" className="fx-btn fx-btn-primary">Start with Compounding →</Link>} />

      <div className="labs-grid">
        {LABS.map((l) => (
          <Link key={l.slug} href={`/account/money/labs/${l.slug}`} className="labs-card fx-lift">
            <div className="labs-top">
              <span className="labs-ic" aria-hidden="true"><Icon name={l.glyph} size={19} stroke={1.9} /></span>
              <div style={{ minWidth: 0 }}>
                <div className="labs-t">{l.title}</div>
                <div className="labs-w">{l.worlds}</div>
              </div>
            </div>
            <p className="labs-d">{l.desc}</p>
            <span className="labs-go">Open the lab →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
