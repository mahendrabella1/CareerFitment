// Server-side PDF of the career report, attached to the emailed report.
// Uses @react-pdf/renderer primitives (not HTML) — a compact, branded, multi-page
// layout that auto-paginates. Rendered to a Buffer for nodemailer.
import { Document, Page, View, Text, Link, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { DOMAINS, categoryDeepDive, roadmap, stageLabelOf } from "@/lib/report/knowledge";

const NAVY = "#2f4062", ACCENT = "#4f6b9e", INK = "#1f2937", MUTED = "#64748b", LINE = "#e6e9ef";
const clamp = (n: number) => Math.max(4, Math.min(100, Math.round(n)));

const s = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 40, fontFamily: "Helvetica", color: INK, fontSize: 10 },
  header: { backgroundColor: NAVY, color: "#fff", padding: 26 },
  hKick: { fontSize: 8, letterSpacing: 1, color: "#c8d3ea", fontFamily: "Helvetica-Bold" },
  hTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", marginTop: 8, lineHeight: 1.25 },
  hSub: { fontSize: 10, color: "#dfe6f3", marginTop: 6 },
  body: { padding: "20 26" },
  summary: { fontSize: 10.5, color: "#475569", lineHeight: 1.55, marginBottom: 16 },
  h3: { fontSize: 12.5, fontFamily: "Helvetica-Bold", color: "#0f172a", marginBottom: 8, marginTop: 6 },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  barLabel: { width: 120, fontSize: 9, color: "#334155" },
  barTrack: { flex: 1, height: 7, backgroundColor: "#eef1f5", borderRadius: 4 },
  barFill: { height: 7, borderRadius: 4, backgroundColor: ACCENT },
  barScore: { width: 24, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  card: { border: `1 solid ${LINE}`, borderRadius: 8, padding: 12, marginBottom: 10 },
  cardRank: { fontSize: 8, color: MUTED, fontFamily: "Helvetica-Bold" },
  cardName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#0f172a", marginTop: 2, marginBottom: 3 },
  cardWhat: { fontSize: 9.5, color: "#475569", lineHeight: 1.5 },
  salRow: { flexDirection: "row", marginTop: 6 },
  salK: { width: 46, fontSize: 8.5, color: MUTED },
  salV: { flex: 1, fontSize: 9, color: "#0f172a", fontFamily: "Helvetica-Bold" },
  link: { fontSize: 8.5, color: "#3f5b8b", textDecoration: "none", marginRight: 12, marginTop: 6 },
  li: { flexDirection: "row", marginBottom: 4 },
  liDot: { width: 10, fontSize: 9, color: ACCENT },
  liText: { flex: 1, fontSize: 9.5, color: "#475569", lineHeight: 1.45 },
  phase: { flexDirection: "row", marginBottom: 8 },
  phPeriod: { width: 84, fontSize: 9, fontFamily: "Helvetica-Bold", color: ACCENT },
  phBody: { flex: 1 },
  phTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  phPoint: { fontSize: 9, color: MUTED, marginTop: 2, lineHeight: 1.4 },
  foot: { fontSize: 8, color: "#94a3b8", marginTop: 18, lineHeight: 1.5 },
});

function Bar({ label, score }: { label: string; score: number }) {
  return (
    <View style={s.barRow}>
      <Text style={s.barLabel}>{label}</Text>
      <View style={s.barTrack}><View style={{ ...s.barFill, width: `${clamp(score)}%` }} /></View>
      <Text style={s.barScore}>{Math.round(score)}</Text>
    </View>
  );
}

function ReportDoc({ name, a }: { name: string; a: AssessmentSummary }) {
  const domains = (a.themes ?? [])
    .filter((t) => t.score > 0 && DOMAINS[t.letter])
    .slice(0, 3)
    .map((t) => ({ ...DOMAINS[t.letter], fit: Math.round(t.score) }));
  const top = domains[0] || DOMAINS.B;
  const nextSteps = (a.radar ?? []).slice(0, 4).map((r) => ({ label: r.label, next: categoryDeepDive(r.key, a).next })).filter((x) => x.next);
  const phases = roadmap(stageLabelOf(a.journeyCode), top.name);

  return (
    <Document title="OneGrasp Career Report" author="OneGrasp">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.hKick}>ONEGRASP · CAREER REPORT</Text>
          <Text style={s.hTitle}>Hi {name || "there"}, your best-fit direction is {top.name}.</Text>
          <Text style={s.hSub}>
            {a.overallFitmentPct != null ? `${a.overallFitmentPct}% top fit` : ""}
            {a.outcomeLabel ? `  ·  ${a.outcomeLabel}` : ""}
            {`  ·  ${new Date(a.completedAt).toLocaleDateString()}`}
          </Text>
        </View>

        <View style={s.body}>
          {a.summary ? <Text style={s.summary}>{a.summary}</Text> : null}

          <Text style={s.h3}>Your profile at a glance</Text>
          {(a.radar ?? []).map((r) => <Bar key={r.key} label={r.label} score={r.score} />)}

          <Text style={{ ...s.h3, marginTop: 16 }}>Best-fit career domains</Text>
          {domains.map((d, i) => (
            <View key={d.key} style={s.card} wrap={false}>
              <Text style={s.cardRank}>#{i + 1} best fit{d.fit ? `  ·  ${d.fit}%` : ""}</Text>
              <Text style={s.cardName}>{d.name}</Text>
              <Text style={s.cardWhat}>{d.whatItIs}</Text>
              <View style={s.salRow}><Text style={s.salK}>India</Text><Text style={s.salV}>{d.salaryIndia}</Text></View>
              <View style={s.salRow}><Text style={s.salK}>Abroad</Text><Text style={s.salV}>{d.salaryAbroad}</Text></View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {d.links.slice(0, 2).map((l) => <Link key={l.url} src={l.url} style={s.link}>{l.label}</Link>)}
              </View>
            </View>
          ))}

          {nextSteps.length ? (
            <>
              <Text style={{ ...s.h3, marginTop: 8 }}>Your next steps</Text>
              {nextSteps.map((x, i) => (
                <View key={i} style={s.li}>
                  <Text style={s.liDot}>•</Text>
                  <Text style={s.liText}><Text style={{ fontFamily: "Helvetica-Bold" }}>{x.label}: </Text>{x.next}</Text>
                </View>
              ))}
            </>
          ) : null}

          <Text style={{ ...s.h3, marginTop: 12 }}>Your next 20 years</Text>
          {phases.map((p) => (
            <View key={p.period} style={s.phase} wrap={false}>
              <Text style={s.phPeriod}>{p.period}</Text>
              <View style={s.phBody}>
                <Text style={s.phTitle}>{p.title}</Text>
                <Text style={s.phPoint}>{p.points[0]}</Text>
              </View>
            </View>
          ))}

          <Text style={s.foot}>
            Generated from your OneGrasp career assessment. Sign in to your dashboard for the full interactive report.
            This report is a guide, not a verdict — salary figures are typical ranges.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(name: string, a: AssessmentSummary): Promise<Buffer> {
  return renderToBuffer(<ReportDoc name={name} a={a} />);
}
