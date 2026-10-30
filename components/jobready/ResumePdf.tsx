"use client";
/**
 * The downloadable resume PDF, made in the browser with @react-pdf/renderer
 * (loaded only when asked for). Same template numbers as the on-screen
 * ResumeSheet; standard PDF fonts (Helvetica / Times), real selectable text,
 * no hyphenation, so every applicant-tracking system can read it.
 */
import type { Design } from "@/lib/resume/resume";
import { pdfSafe, tokens, type DocEntry, type DocModel } from "@/lib/resume/templates";
import { entryLines } from "./ResumeSheet";

let hyphenationOff = false;

export async function resumePdf(model: DocModel, design: Design): Promise<{ blob: Blob; pages: number }> {
  const { pdf, Document, Page, View, Text, Font } = await import("@react-pdf/renderer");
  if (!hyphenationOff) { Font.registerHyphenationCallback((w) => [w]); hyphenationOff = true; }
  const k = tokens(design);
  const t = k.t;
  const fam = t.font === "Helvetica" ? { r: "Helvetica", b: "Helvetica-Bold", i: "Helvetica-Oblique" } : { r: "Times-Roman", b: "Times-Bold", i: "Times-Italic" };
  const s = (x: string) => pdfSafe(x);

  const bullets = (items: string[]) => items.map((x, i) => (
    <View key={i} style={{ flexDirection: "row", marginTop: i ? 1 : 1.5 }}>
      <Text style={{ width: 9 }}>•</Text>
      <Text style={{ flex: 1 }}>{s(x)}</Text>
    </View>
  ));

  // Two plain lines per entry (see entryLines) - no right-aligned columns, so parsers read it in order.
  const entry = (e: DocEntry, first: boolean) => {
    const [l1, l2] = entryLines(e, t.entry);
    return (
      <View key={e.key} style={{ marginTop: first ? 0 : k.entryGap }} wrap={e.bullets.length > 6}>
        <Text><Text style={{ fontFamily: fam.b }}>{s(l1.bold)}</Text>{s(l1.rest)}</Text>
        {l2.text ? <Text style={{ fontSize: k.small, color: k.muted, fontFamily: l2.italic ? fam.i : fam.r }}>{s(l2.text)}</Text> : null}
        {bullets(e.bullets)}
      </View>
    );
  };

  const doc = (
    <Document title={`${model.name || "Resume"} - Resume`} author={model.name} creator="OneGrasp" producer="OneGrasp">
      <Page size={design.paper === "Letter" ? "LETTER" : "A4"} style={{ padding: k.margin, fontFamily: fam.r, fontSize: k.base, lineHeight: k.lineHeight, color: k.ink }}>
        <View style={{ textAlign: t.nameAlign, paddingBottom: t.headerRule ? 5 : 0, borderBottomWidth: t.headerRule ? 1 : 0, borderBottomColor: k.accent }}>
          <Text style={{ fontFamily: fam.b, fontSize: k.name, lineHeight: 1.15, color: t.nameAccent ? k.accent : k.ink, textTransform: t.nameUpper ? "uppercase" : "none", letterSpacing: t.nameUpper ? 0.6 : 0 }}>{s(model.name || "Your Name")}</Text>
          {model.contact.length ? <Text style={{ fontSize: k.small, color: k.muted, marginTop: 3 }}>{s(model.contact.join("  |  "))}</Text> : null}
          {model.links.length ? <Text style={{ fontSize: k.small, color: k.muted, marginTop: 1 }}>{s(model.links.join("  |  "))}</Text> : null}
        </View>
        {model.blocks.map((b) => (
          <View key={b.title} style={{ marginTop: k.sectionGap }}>
            <View minPresenceAhead={36} style={{ marginBottom: 3.5, paddingBottom: t.headingRule ? 1.5 : 0, borderBottomWidth: t.headingRule ? 0.75 : 0, borderBottomColor: t.headingAccent ? k.accent : "#888888" }}>
              <Text style={{ fontFamily: fam.b, fontSize: k.heading, color: t.headingAccent ? k.accent : k.ink, textTransform: t.headingUpper ? "uppercase" : "none", letterSpacing: t.headingUpper ? 0.8 : 0, lineHeight: 1.2 }}>{s(b.title)}</Text>
            </View>
            {b.kind === "text" ? <Text>{s(b.text)}</Text> : null}
            {b.kind === "list" ? bullets(b.items) : null}
            {b.kind === "skills" ? b.groups.map((g, i) => <Text key={i} style={{ marginBottom: 1.5 }}>{g.label ? <Text style={{ fontFamily: fam.b }}>{s(`${g.label}: `)}</Text> : null}{s(g.items)}</Text>) : null}
            {b.kind === "entries" ? b.entries.map((e, i) => entry(e, i === 0)) : null}
          </View>
        ))}
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  const raw = await blob.text().catch(() => "");
  const pages = (raw.match(/\/Type\s*\/Page(?!s)/g) ?? []).length || 1;
  return { blob, pages };
}
