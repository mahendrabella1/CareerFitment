// Server-only push of a captured lead to the OneGrasp CRM webhook. The bearer
// token is SERVER-ONLY — it must never be read into a NEXT_PUBLIC_* var or
// called from client-side code, or it leaks to anyone viewing page source /
// devtools network tab. Called from app/api/leads/route.ts after a lead is
// saved locally; failures are logged but never break lead capture itself.

const CRM_WEBHOOK_URL = "https://crm.onegrasp.com/api/webhook-leads";

export interface CrmLead {
  name: string;
  email: string;
  phone?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  message?: string | null;
  /** "unpaid" = registered but hasn't paid yet; "paid" = fee verified. */
  status?: "unpaid" | "paid";
}

export async function pushLeadToCRM(lead: CrmLead): Promise<void> {
  const token = process.env.ONEGRASP_CRM_WEBHOOK_TOKEN;
  if (!token) return; // not configured on this deployment — skip silently

  // "status" isn't part of the CRM's documented schema — a prior attempt to
  // send it as its own top-level field got a 500 (FUNCTION_INVOCATION_FAILED)
  // back from their webhook, most likely because their CRM has its own
  // internal lead-status enum and choked on an unrecognised value. Folding
  // the same information into the free-text "message" field instead keeps
  // the payload exactly on the schema they gave us.
  const statusNote = lead.status === "paid" ? "Payment status: PAID (₹99 fee verified)." : "Payment status: UNPAID (registered, hasn't paid yet).";
  const message = [statusNote, lead.message].filter(Boolean).join(" ");

  try {
    const res = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: lead.name,
        email: lead.email,
        phone: lead.phone ?? null,
        source: "Website",
        utm_source: lead.utmSource ?? null,
        utm_medium: lead.utmMedium ?? null,
        utm_campaign: lead.utmCampaign ?? null,
        message,
      }),
    });
    if (!res.ok) {
      console.error("CRM webhook returned", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    // Never let a CRM outage break lead capture / the assessment start flow.
    console.error("CRM webhook failed:", err instanceof Error ? err.message : err);
  }
}
