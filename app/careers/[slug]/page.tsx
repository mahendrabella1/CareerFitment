import { notFound, permanentRedirect, redirect } from "next/navigation";
import { PublicShell, CtaBox } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CAREER_PAGES, careerByName, careerFaqs, careerPage, clean, cut, fact, groupsOf, howTo, relatedCareers, schoolFacts, streamsInWords, summary,
  type Group,
} from "@/lib/seo/careers";
import { getAllCareers } from "@/lib/data/careerLibraryData";
import { absolute, breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo/site";

export function generateStaticParams() {
  return CAREER_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const c = careerPage((await props.params).slug);
  if (!c) return { robots: { index: false } };
  const s = summary(c);
  return pageMetadata({
    title: `${howTo(c).replace(/^How to become/, "How to Become")} in India - Stream, Exams, Colleges and Roadmap`,
    description: `${cut(s, 110)} Stream, subjects, entrance exams, colleges and a step-by-step roadmap.`,
    path: `/careers/${c.slug}`,
    keywords: [`how to become ${c.article} ${c.name.toLowerCase()}`, `${c.name.toLowerCase()} course after 12th`, `${c.name.toLowerCase()} career in India`, `${c.name.toLowerCase()} salary and jobs`, `${c.domain.toLowerCase()} careers`],
    image: `/careers/${c.slug}/opengraph-image`,
  });
}

/**
 * /careers/<slug> - "How to become a ..." for one career, from its researched
 * Class 11-12 roadmap (lib/seo/careers.ts). The old /careers/<id> pages used
 * ids like "10-9585.00" from the earlier 930-career list (still linked from
 * app/account/features/CareerLibrary.tsx): those redirect here when the career
 * has a page, otherwise to the same career in the dashboard's library.
 */
export default async function CareerPageView(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const c = careerPage(slug);
  if (!c) {
    const old = getAllCareers().find((x) => x.id === decodeURIComponent(slug));
    if (old) {
      const match = careerByName(old.name);
      if (match) permanentRedirect(`/careers/${match.slug}`);
      redirect(`/account/career-library/${encodeURIComponent(old.name)}`);
    }
    notFound();
  }
  const r = c.roadmap;
  const faqs = careerFaqs(c);
  const related = relatedCareers(c);
  const streams = streamsInWords(c.streams) || fact(c, /stream/i) || "";
  const exams = fact(c, /entrance/i);
  const firstDegree = clean(r.ugPathways[0] ?? "").split("→")[0].trim();
  const years = r.ugDevelopment?.years ?? [];
  const notes = groupsOf(r.ugDevelopment?.notes, "notes");

  return (
    <PublicShell>
      <JsonLd data={[
        breadcrumbLd([{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }, { name: c.name, path: `/careers/${c.slug}` }]),
        {
          "@context": "https://schema.org", "@type": "Occupation", name: c.name, description: summary(c), occupationalCategory: c.domain,
          educationRequirements: [streams, exams, firstDegree].filter(Boolean).join(". "),
          skills: groupsOf(r.skills, "skills").flatMap((g) => g.items).slice(0, 20).join(", "),
          occupationLocation: { "@type": "Country", name: "India" }, url: absolute(`/careers/${c.slug}`),
        },
        ...(faqs.length ? [faqLd(faqs)] : []),
      ]} />
      <section className="pub-hero">
        <div className="pub-in pub-hero-in" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <div className="pub-crumbs"><a href="/">Home</a> › <a href="/careers">Careers</a> › {c.domain}</div>
            <span className="pub-kicker">{c.domain}</span>
            <h1>{howTo(c)}</h1>
            <p className="pub-lead" style={{ maxWidth: 820 }}>{summary(c)}</p>
            <div className="pub-hero-a">
              <a href="/register" className="pub-btn pri">Check if it fits you</a>
              <a href="/careers" className="pub-btn ghost">All careers</a>
            </div>
            <div className="pub-facts">
              {streams && <div><small>Stream in Class 11-12</small><b>{streams}</b></div>}
              {exams && <div><small>Entrance exams</small><b>{cut(exams, 120)}</b></div>}
              {firstDegree && <div><small>A common degree</small><b>{firstDegree}</b></div>}
            </div>
          </div>
        </div>
      </section>

      <div className="pub-in pub-body">
        {r.completeRoadmap.length > 0 && (
          <section>
            <h2>The roadmap at a glance</h2>
            <ol className="pub-steps">{r.completeRoadmap.map((s, i) => <li key={i}>{clean(s)}</li>)}</ol>
          </section>
        )}

        <section>
          <h2>In school: Class 11 and 12</h2>
          <dl className="pub-dl">{schoolFacts(c).map((f, i) => <Fragment2 key={i} label={f.label || "Also"} text={f.text} />)}</dl>
        </section>

        {r.ugPathways.length > 0 && (
          <section>
            <h2>Degrees after Class 12</h2>
            <dl className="pub-dl">
              {r.ugPathways.map((p, i) => {
                const [deg, ...rest] = clean(p).split("→");
                return <Fragment2 key={i} label={deg.trim()} text={rest.join("→").trim() || "-"} />;
              })}
            </dl>
          </section>
        )}

        <Groups title="Top colleges in India" groups={groupsOf(r.topColleges, "topColleges")} />

        {years.length > 0 && (
          <section>
            <h2>Year by year in college</h2>
            <div className="pub-years">{years.map((y) => <div key={y.year}><b>{clean(y.year)}</b><p>{clean(y.focus)}</p></div>)}</div>
            {notes.length > 0 && <div style={{ marginTop: 10 }}><GroupsBody groups={notes} /></div>}
          </section>
        )}

        <Groups title="Internships" groups={groupsOf(r.internships, "internships")} />
        <Groups title="Skills to build" groups={groupsOf(r.skills, "skills")} />
        <Groups title="Scholarships and financial help" groups={groupsOf(r.scholarships, "scholarships")} />
        <Groups title="After your degree" groups={groupsOf(r.afterUgPathways, "afterUgPathways")} />
        <Groups title="Postgraduate study and specialisation" groups={groupsOf(r.pgSpecialization, "pgSpecialization")} />

        {r.jobOptions.length > 0 && (
          <section>
            <h2>Jobs on this path</h2>
            <ul className="pub-chips">{r.jobOptions.map((j, i) => <li key={i}>{clean(j)}</li>)}</ul>
          </section>
        )}

        {r.careerProgression.length > 0 && (
          <section>
            <h2>How the career grows</h2>
            <ol className="pub-steps">{r.careerProgression.map((s, i) => <li key={i}>{clean(s)}</li>)}</ol>
          </section>
        )}

        <Groups title="Studying abroad" groups={groupsOf(r.abroadEducation, "abroadEducation")} />
        <Groups title="Working abroad" groups={groupsOf(r.abroadJobs, "abroadJobs")} />

        {r.keyDistinction && (
          <section className="pub-art">
            <h2>How it differs from similar careers</h2>
            <p>{clean(r.keyDistinction)}</p>
          </section>
        )}

        {faqs.length > 0 && (
          <section>
            <h2>Questions</h2>
            <div className="pub-faq">{faqs.map((q) => <details key={q.q}><summary>{q.q}</summary><p>{q.a}</p></details>)}</div>
          </section>
        )}

        <CtaBox title={`Is ${c.article} ${c.name} career right for you?`} text="Take the OneGrasp career assessment for your class - it shows how you think, learn and work, which careers fit you best, and a roadmap for each. Then try a day in the job with Career Test-Drive." />

        {related.length > 0 && (
          <section>
            <h2>Related careers in {c.domain}</h2>
            <div className="pub-tags">{related.map((x) => <a key={x.slug} href={`/careers/${x.slug}`}>{x.name}</a>)}<a href="/careers">All careers</a></div>
          </section>
        )}
        <h2>Plan it on OneGrasp</h2>
        <div className="pub-tags">
          <a href="/features/career-test-drive">Career Test-Drive</a>
          <a href="/features/entrance-exams">Entrance exams</a>
          <a href="/features/scholarships">Scholarships</a>
          <a href="/features/career-library">Career library</a>
          <a href="/blogs/how-to-choose-stream-after-10th">How to choose a stream</a>
        </div>
        {r.disclaimer && <p className="pub-note">{clean(r.disclaimer)} Colleges and programmes are examples, not a ranking.</p>}
      </div>
    </PublicShell>
  );
}

function Fragment2({ label, text }: { label: string; text: string }) {
  return <><dt>{label}</dt><dd>{text}</dd></>;
}

function GroupsBody({ groups }: { groups: Group[] }) {
  return (
    <div className="pub-groups">
      {groups.map((g, i) => (
        <div key={i}>
          {g.heading && <h3>{g.heading}</h3>}
          <ul>{g.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

function Groups({ title, groups }: { title: string; groups: Group[] }) {
  if (!groups.length) return null;
  return (
    <section>
      <h2>{title}</h2>
      <GroupsBody groups={groups} />
    </section>
  );
}
