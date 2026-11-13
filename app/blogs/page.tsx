import { PublicShell, CtaBox } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { CATEGORIES, POSTS, readMinutes } from "@/lib/blog";
import { absolute, breadcrumbLd, pageMetadata } from "@/lib/seo/site";

const base = pageMetadata({
  title: "Career Guidance Blog for Students, Parents and Schools",
  description: "Practical guides on choosing a stream and career, career tests, skills, exams and scholarships, money and rights, studying abroad, resumes and interviews - from OneGrasp.",
  path: "/blogs",
  keywords: ["career guidance blog", "career advice for students", "stream selection guide", "career tips India"],
});
export const metadata = { ...base, alternates: { ...base.alternates, types: { "application/rss+xml": "/blogs/rss.xml" } } };

const day = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** /blogs - every article, newest first, by category. */
export default function BlogIndex() {
  return (
    <PublicShell>
      <JsonLd data={[
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blogs" }]),
        { "@context": "https://schema.org", "@type": "Blog", name: "OneGrasp Career Guidance Blog", url: absolute("/blogs"), blogPost: POSTS.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absolute(`/blogs/${p.slug}`), datePublished: p.date })) },
      ]} />
      <section className="pub-hero">
        <div className="pub-in pub-hero-in" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="pub-kicker">Blog</span>
            <h1>Career guidance, one clear question at a time</h1>
            <p className="pub-lead">Guides for students from Class 6 to college, for parents and for schools - choosing a stream and a career, building skills, exams, scholarships, money, and getting ready for work.</p>
            <div className="pub-tags">{CATEGORIES.map((c) => <a key={c} href={`#${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{c}</a>)}</div>
          </div>
        </div>
      </section>
      <div className="pub-in pub-body">
        {CATEGORIES.map((c) => (
          <section key={c} id={c.toLowerCase().replace(/[^a-z]+/g, "-")}>
            <h2>{c}</h2>
            <div className="pub-cards">
              {POSTS.filter((p) => p.category === c).map((p) => (
                <a key={p.slug} href={`/blogs/${p.slug}`} className="pub-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="pub-card-img"><img src={p.image} alt={`${p.category} illustration`} loading="lazy" /></span>
                  <span className="pub-card-b"><small>{readMinutes(p)} min read · {day(p.date)}</small><b>{p.title}</b><p>{p.description}</p></span>
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
