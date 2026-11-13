import { PublicShell, CtaBox } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { CAREER_DOMAINS, CAREER_PAGES, careersIn } from "@/lib/seo/careers";
import { absolute, breadcrumbLd, pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: `How to Become... ${CAREER_PAGES.length} Careers Explained - Stream, Exams, Colleges and Roadmap`,
  description: `Step-by-step roadmaps for ${CAREER_PAGES.length} careers in India - the stream and subjects to take, entrance exams, degrees, top colleges, skills, jobs and how to grow. For students in Class 9 to 12 and their parents.`,
  path: "/careers",
  keywords: ["career options after 12th", "how to become", "list of careers in India", "career roadmap", "career guidance after 10th"],
});

const anchor = (d: string) => d.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** /careers - every career with a researched roadmap, by field. */
export default function CareersIndex() {
  return (
    <PublicShell>
      <JsonLd data={[
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }]),
        { "@context": "https://schema.org", "@type": "ItemList", numberOfItems: CAREER_PAGES.length, itemListElement: CAREER_PAGES.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(`/careers/${c.slug}`), name: c.name })) },
      ]} />
      <section className="pub-hero">
        <div className="pub-in pub-hero-in" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="pub-kicker">Careers</span>
            <h1>How to become... {CAREER_PAGES.length} careers, step by step</h1>
            <p className="pub-lead">For each career: the stream and subjects to choose, the entrance exams, degrees and colleges in India, the skills to build year by year, the jobs it leads to and how to grow - researched for Indian students.</p>
            <div className="pub-tags">{CAREER_DOMAINS.map((d) => <a key={d} href={`#${anchor(d)}`}>{d}</a>)}</div>
          </div>
        </div>
      </section>
      <div className="pub-in pub-body">
        {CAREER_DOMAINS.map((d) => (
          <section key={d} id={anchor(d)}>
            <h2>{d}</h2>
            <ul className="pub-idx">
              {careersIn(d).map((c) => <li key={c.slug}><a href={`/careers/${c.slug}`}>{c.name}</a></li>)}
            </ul>
          </section>
        ))}
        <CtaBox title="Not sure which career fits you?" text="Take the OneGrasp career assessment for your class - it shows how you think, learn and work, and which of these careers fit you best, with a roadmap for each." />
      </div>
    </PublicShell>
  );
}
