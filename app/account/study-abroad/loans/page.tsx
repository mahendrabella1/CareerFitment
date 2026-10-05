import Link from "next/link";

const ACCENT = "#7c3aed";

const COMPARE = [
  ["Interest rate", "Fixed or floating? Which benchmark is it linked to, and how often can it change?"],
  ["Collateral and co-applicant", "Is property, a fixed deposit or a co-applicant needed, and above what amount?"],
  ["Margin money", "What share of the cost must your family pay first?"],
  ["Moratorium", "How long after the course before EMIs start, and is interest payable during study?"],
  ["Processing fee and charges", "Processing fee, insurance, prepayment or foreclosure charges."],
  ["Disbursement", "Paid straight to the university in instalments, or to you? Which costs are covered (living, travel, laptop)?"],
  ["Sanction letter timing", "How fast can you get a sanction letter for the visa file?"],
  ["Tax", "Is the lender a financial institution for Section 80E, so interest can be deducted and the remittance avoids TCS?"],
];

export default function AbroadLoansPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".08em" }}>Money</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Education loans for study abroad</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 700 }}>
        A loan should follow the money check, not lead it. Work out the full cost and payback time in the <Link href="/account/study-abroad/roi" style={{ color: ACCENT, fontWeight: 800 }}>ROI calculator</Link> first, then compare at least three lenders on the same points.
      </p>

      <section style={box}>
        <h2 style={h2}>Secured or unsecured</h2>
        <p style={p}>Public sector banks, private banks and NBFCs all lend for study abroad. A <b>secured</b> loan is backed by collateral such as property or a fixed deposit, and usually costs less. An <b>unsecured</b> loan needs no collateral but usually charges more and leans on the co-applicant&apos;s income and the course and university you chose.</p>
        <p style={p}>Loans up to ₹7.5 lakh can be covered by the government&apos;s Credit Guarantee Fund Scheme for Education Loans (CGFSEL) without collateral or a third-party guarantee. Most study-abroad budgets are larger, so expect to need collateral, a co-applicant, or both.</p>
      </section>

      <section style={{ ...box, marginTop: 14 }}>
        <h2 style={h2}>How repayment works</h2>
        <p style={p}>Under the Indian Banks&apos; Association model scheme, repayment starts after a moratorium of the course period plus one year. Interest usually builds up during that time, so the amount you owe at the first EMI is larger than the amount you borrowed. Ask every lender for a full repayment schedule.</p>
        <p style={p}>Many visa applications accept a loan sanction letter as part of your proof of funds. Check what your destination accepts on its official immigration site before you rely on it.</p>
      </section>

      <section style={{ ...box, marginTop: 14 }}>
        <h2 style={h2}>Tax rules worth knowing</h2>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "#334155", lineHeight: 1.75 }}>
          <li><b>Section 80E:</b> interest on an education loan from a financial institution or an approved charitable institution can be deducted from taxable income for up to 8 years, with no upper limit. It is available only under the old tax regime.</li>
          <li><b>TCS on fees sent abroad:</b> from 1 April 2025, no tax is collected at source when education fees are paid from a loan given by a financial institution as defined for Section 80E. For self-funded education, TCS is 5% on the amount above ₹10 lakh in a year.</li>
          <li>These rules change in budgets, so confirm them with your bank or a tax adviser when you remit.</li>
        </ul>
      </section>

      <section style={{ ...box, marginTop: 14 }}>
        <h2 style={h2}>Apply to several banks at once</h2>
        <p style={p}>The government-backed Vidya Lakshmi portal lets you fill one common education loan application form and apply to several banks, including for study abroad. Apply only on the official site, and never pay anyone to &quot;guarantee&quot; a loan.</p>
        <a href="https://www.vidyalakshmi.co.in/" target="_blank" rel="noreferrer" style={{ fontSize: 13.5, fontWeight: 800, color: ACCENT }}>Vidya Lakshmi portal ↗</a>
      </section>

      <section style={{ ...box, marginTop: 14 }}>
        <h2 style={h2}>Compare at least three lenders on these points</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 460, fontSize: 13.5 }}>
            <tbody>
              {COMPARE.map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9", fontWeight: 800, color: "#0f172a", verticalAlign: "top", width: "34%" }}>{k}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #f1f5f9", color: "#475569", lineHeight: 1.55 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...p, marginTop: 10 }}>OneGrasp has no lender partnerships. If that ever changes, partners will be labelled and shown alongside at least two others.</p>
      </section>

      <section style={{ ...box, marginTop: 14, borderColor: "#fecaca", background: "#fef2f2" }}>
        <h2 style={{ ...h2, color: "#991b1b" }}>Warning signs</h2>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "#7f1d1d", lineHeight: 1.75 }}>
          <li>Anyone asking for a fee to &quot;guarantee&quot; a loan or visa, or payment to a personal account.</li>
          <li>A plan that only works if you find a job abroad within a few months. Check the low-salary case in the ROI calculator.</li>
          <li>Pressure to sign before you have read the full repayment schedule.</li>
        </ul>
      </section>
    </div>
  );
}

const box = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" } as const;
const h2 = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" } as const;
const p = { fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 8px" } as const;
