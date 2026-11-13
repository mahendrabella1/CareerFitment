import { notFound } from "next/navigation";
import { PublicShell, CtaBox } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { FEATURE_PAGES, featurePage } from "@/lib/seo/features";
import { postsForFeature } from "@/lib/blog";
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return FEATURE_PAGES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const f = featurePage((await props.params).slug);
  if (!f) return {};
  return pageMetadata({ title: f.title, description: f.description, path: `/features/${f.slug}`, keywords: f.keywords, image: `/features/${f.slug}/opengraph-image` });
}

/** /features/<slug> - one dashboard feature, for people searching for it. */
export default async function FeaturePage(props: { params: Promise<{ slug: string }> }) {
  const f = featurePage((await props.params).slug);
  if (!f) notFound();
  const related = f.related.map(featurePage).filter((x) => !!x);
  const posts = postsForFeature(f.slug).slice(0, 3);
  return (
    <PublicShell>
      <JsonLd data={[
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Features", path: "/features" }, { name: f.name, path: `/features/${f.slug}` }]),
        faqLd(f.faqs),
      ]} />
      <section className="pub-hero">
        <div className="pub-in pub-hero-in">
          <div>
            <div className="pub-crumbs"><a href="/">Home</a> › <a href="/features">Features</a> › {f.name}</div>
            <span className="pub-kicker">{f.who}</span>
            <h1>{f.h1}</h1>
            <p className="pub-lead">{f.description}</p>
            <div className="pub-hero-a">
              <a href="/register" className="pub-btn pri">Start the assessment</a>
              {/* nofollow: crawlers shouldn't wander into the signed-in area (it's noindex anyway). */}
              <a href={f.dashboard} className="pub-btn ghost" rel="nofollow">Open in my dashboard</a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.image} alt={f.name} />
        </div>
      </section>
      <div className="pub-in pub-body">
        <div className="pub-art">{f.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        <h2>What you get</h2>
        <div className="pub-points">{f.points.map((p) => <div key={p.t} className="pub-point"><b>{p.t}</b><p>{p.d}</p></div>)}</div>

        {f.slug === "for-schools" && (
          <section id="partner">
            <h2>Bring OneGrasp to your school</h2>
            <p className="pub-art" style={{ marginTop: 0 }}>Tell us a little about your school or college and our team will get in touch to show you the portal and plan a rollout for your classes.</p>
            <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 22, background: "#fff", maxWidth: 860 }}>
              <EnquiryForm kind="school" submitLabel="Send to the OneGrasp team" doneTitle="Thank you - we've got it." doneText="Our team will get in touch with you soon by email or phone." />
            </div>
          </section>
        )}

        <h2>Questions</h2>
        <div className="pub-faq">{f.faqs.map((q) => <details key={q.q}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>

        {posts.length > 0 && (
          <>
            <h2>From the blog</h2>
            <div className="pub-cards">
              {posts.map((p) => (
                <a key={p.slug} href={`/blogs/${p.slug}`} className="pub-card">
                  <span className="pub-card-b"><small>{p.category}</small><b>{p.title}</b><p>{p.description}</p></span>
                </a>
              ))}
            </div>
          </>
        )}

        <h2>Related features</h2>
        <div className="pub-tags">{related.map((r) => <a key={r.slug} href={`/features/${r.slug}`}>{r.name}</a>)}<a href="/features">All features</a></div>
        <CtaBox />
      </div>
    </PublicShell>
  );
}
