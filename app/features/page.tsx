import { PublicShell, CtaBox } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { FEATURE_GROUPS, FEATURE_PAGES } from "@/lib/seo/features";
import { absolute, breadcrumbLd, pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Every Feature - Career Test, Report, Labs, Courses and Career Tools",
  description: "Everything in the OneGrasp dashboard: the career assessment and report, a 40-week Year Plan, Communication and Aptitude Labs, courses on money, law, exams, scholarships and study abroad, and career tools.",
  path: "/features",
  keywords: ["career guidance platform", "career counselling online", "student dashboard", "career tools for students"],
});

/** /features - every dashboard feature, grouped, each linking to its own page. */
export default function FeaturesPage() {
  return (
    <PublicShell>
      <JsonLd data={[
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }]),
        { "@context": "https://schema.org", "@type": "ItemList", itemListElement: FEATURE_PAGES.map((f, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(`/features/${f.slug}`), name: f.name })) },
      ]} />
      <section className="pub-hero">
        <div className="pub-in pub-hero-in" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="pub-kicker">Features</span>
            <h1>One test, one report, and everything you need after it</h1>
            <p className="pub-lead">Your career assessment opens a dashboard made for your class - a Year Plan, two labs, six courses with certificates and the tools to plan and start your career. Here is everything in it.</p>
            <div className="pub-hero-a"><a href="/register" className="pub-btn pri">Start the assessment</a><a href="/blogs" className="pub-btn ghost">Read the blog</a></div>
          </div>
        </div>
      </section>
      <div className="pub-in pub-body">
        {FEATURE_GROUPS.map((g) => (
          <section key={g}>
            <h2>{g}</h2>
            <div className="pub-cards">
              {FEATURE_PAGES.filter((f) => f.group === g).map((f) => (
                <a key={f.slug} href={`/features/${f.slug}`} className="pub-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="pub-card-img"><img src={f.image} alt="" loading="lazy" /></span>
                  <span className="pub-card-b"><small>{f.who}</small><b>{f.name}</b><p>{f.description}</p></span>
                </a>
              ))}
            </div>
          </section>
        ))}
        <CtaBox />
      </div>
    </PublicShell>
  );
}
