import { PublicShell } from "@/components/seo/PublicShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Blocks } from "@/components/seo/RichText";
import { breadcrumbLd } from "@/lib/seo/site";
import { LEGAL_UPDATED } from "@/lib/seo/legal";
import type { Block } from "@/lib/blog";

/** /privacy and /terms (lib/seo/legal.ts). */
export function LegalPage({ title, path, body, children }: { title: string; path: string; body: Block[]; children?: React.ReactNode }) {
  const updated = new Date(LEGAL_UPDATED).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <PublicShell>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: title, path }])} />
      <div className="pub-in pub-body" style={{ paddingTop: 28 }}>
        <article className="pub-art">
          <div className="pub-crumbs"><a href="/">Home</a> › {title}</div>
          <h1>{title}</h1>
          <p className="pub-meta">Last updated {updated}</p>
          <Blocks body={body} />
          {children}
        </article>
      </div>
    </PublicShell>
  );
}
