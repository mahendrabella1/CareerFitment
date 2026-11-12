import { notFound } from "next/navigation";
import { PublicShell, CtaBox } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Blocks } from "@/components/seo/RichText";
import { POSTS, postBySlug, readMinutes, relatedPosts, wordsIn } from "@/lib/blog";
import { featurePage } from "@/lib/seo/features";
import { BRAND, LOGO, absolute, breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const p = postBySlug((await props.params).slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.description, path: `/blogs/${p.slug}`, keywords: p.keywords, type: "article", publishedTime: p.date, modifiedTime: p.updated ?? p.date, image: `/blogs/${p.slug}/opengraph-image` });
}

const day = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/** /blogs/<slug> - one article, with the features it leads to and what to read next. */
export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const p = postBySlug((await props.params).slug);
  if (!p) notFound();
  const features = p.features.map(featurePage).filter((x) => !!x);
  const next = relatedPosts(p);
  const url = absolute(`/blogs/${p.slug}`);
  return (
    <PublicShell>
      <JsonLd data={[
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blogs" }, { name: p.title, path: `/blogs/${p.slug}` }]),
        {
          "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.description, url, mainEntityOfPage: url,
          datePublished: p.date, dateModified: p.updated ?? p.date, image: absolute(p.image), wordCount: wordsIn(p), keywords: p.keywords.join(", "),
          inLanguage: "en-IN", articleSection: p.category,
          author: { "@type": "Organization", name: BRAND, url: "https://onegrasp.com" },
          publisher: { "@type": "Organization", name: BRAND, logo: { "@type": "ImageObject", url: absolute(LOGO) } },
        },
        ...(p.faqs?.length ? [faqLd(p.faqs)] : []),
      ]} />
      <div className="pub-in pub-body" style={{ paddingTop: 28 }}>
        <article className="pub-art">
          <div className="pub-crumbs"><a href="/">Home</a> › <a href="/blogs">Blog</a> › {p.category}</div>
          <h1>{p.title}</h1>
          <p className="pub-meta">{day(p.date)} · {readMinutes(p)} min read · {BRAND}</p>
          <p className="pub-lead" style={{ marginTop: 14 }}>{p.description}</p>
          <Blocks body={p.body} />
          {p.faqs?.length ? (
            <>
              <h2>Questions</h2>
              <div className="pub-faq">{p.faqs.map((q) => <details key={q.q}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
            </>
          ) : null}
        </article>

        {features.length > 0 && (
          <>
            <h2>Try it on OneGrasp</h2>
            <div className="pub-cards">
              {features.map((f) => (
                <a key={f.slug} href={`/features/${f.slug}`} className="pub-card">
                  <span className="pub-card-b"><small>{f.who}</small><b>{f.name}</b><p>{f.description}</p></span>
                </a>
              ))}
            </div>
          </>
        )}
        <CtaBox />
        {next.length > 0 && (
          <>
            <h2>Read next</h2>
            <div className="pub-cards">
              {next.map((q) => (
                <a key={q.slug} href={`/blogs/${q.slug}`} className="pub-card">
                  <span className="pub-card-b"><small>{q.category}</small><b>{q.title}</b><p>{q.description}</p></span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </PublicShell>
  );
}
