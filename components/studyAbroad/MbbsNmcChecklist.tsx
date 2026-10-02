import { NMC_CHECKLIST, NMC_SOURCE_URL, NMC_CHECKED_AT } from "@/data/studyAbroad/nmcChecklist";

const ACCENT = "#7c3aed";

export function MbbsNmcChecklist() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Safety: MBBS abroad and India's NMC rules</h1>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px" }}>To practise in India, a foreign medical graduate must meet every one of these National Medical Commission requirements.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {NMC_CHECKLIST.map((item, i) => (
          <div key={i} style={{ border: `1px solid ${ACCENT}30`, borderRadius: 12, padding: "12px 16px", display: "flex", gap: 12 }}>
            <span style={{ flex: "none", width: 22, height: 22, borderRadius: 7, background: `${ACCENT}18`, color: ACCENT, fontSize: 11, fontWeight: 900, display: "grid", placeItems: "center" }}>{i + 1}</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{item.label}</div>
              <p style={{ fontSize: 12.5, color: "#475569", margin: "2px 0 0", lineHeight: 1.5 }}>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: "2px solid #dc2626", background: "#fef2f2", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", margin: 0 }}>Be careful with very cheap or very fast programmes, online-only degrees marketed as campus degrees, and "pathway" colleges whose credits don't transfer - these risk failing the checklist above entirely.</p>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Avoiding fraud generally</div>
      <ul style={{ fontSize: 13, color: "#334155", lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
        <li>Warning signs: "guaranteed admission" or "guaranteed visa," agent fees paid in cash or to personal accounts, being discouraged from contacting the university directly, or being rushed to pay a deposit.</li>
        <li>Confirm every offer letter directly with the university's admissions office, using contact details from the official website - never only the agent's.</li>
        <li>Never let anyone else submit visa forms with false documents or bank statements - visa fraud can lead to long bans.</li>
        <li>Check that the institution is officially recognised in its country before enrolling or paying any deposit.</li>
      </ul>

      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 16, fontStyle: "italic" }}>Last checked {new Date(NMC_CHECKED_AT).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} against {NMC_SOURCE_URL.replace(/^https?:\/\//, "")}. NMC rules can be updated - always confirm the current advisory before relying on this checklist.</p>
    </div>
  );
}
