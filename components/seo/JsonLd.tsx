/** Structured data for search engines (schema.org JSON-LD). It is data, not
 *  a script that runs, so the Content-Security-Policy doesn't apply to it. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
