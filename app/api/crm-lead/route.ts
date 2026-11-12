import { NextResponse } from "next/server";
import { pushLeadToCRM } from "@/lib/crm";
import { sendLeadNotificationEmail } from "@/lib/leadEmail";
import { bearerIdentity } from "@/lib/security/requestAuth";
import { rateLimited } from "@/lib/security/rateLimit";
import { plainText } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

// POST /api/crm-lead - fires for every fresh registration (status "unpaid" -
// the fee comes later via PaymentGate). Pushes the lead to the CRM webhook
// and sends the internal "new lead" notification email. Deliberately
// independent of assessment mode (local/Supabase) and of the legacy
// /api/leads system - this is the one place every real signup calls,
// server-side, so the CRM bearer token and SMTP creds never reach the browser.
//
// Security audit M-04: the caller must be signed in (the new account's ID
// token), the email is the account's own - never the body's - and each
// account can send at most 3 a day, so this can't be used to flood the CRM or
// the team's inbox with made-up leads.
export async function POST(req: Request) {
  const who = await bearerIdentity(req);
  if (!who?.email) return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
  const limited = await rateLimited(req, "crm-lead", 3, 86_400, who.uid);
  if (limited) return limited;

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    institution?: string;
    category?: string;
    city?: string;
    age?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const t = (v: unknown, n = 120) => plainText(v, n) || undefined;
  const name = t(body.name);
  if (!name) return NextResponse.json({ success: false, message: "name is required" }, { status: 400 });
  const lead = { name, email: who.email, phone: t(body.phone, 30), institution: t(body.institution), category: t(body.category, 40), city: t(body.city, 80), age: t(body.age, 10) };

  await Promise.all([
    pushLeadToCRM({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      utmSource: t(body.utmSource, 100),
      utmMedium: t(body.utmMedium, 100),
      utmCampaign: t(body.utmCampaign, 100),
      status: "unpaid",
    }),
    sendLeadNotificationEmail(lead, "unpaid"),
  ]);

  // Always 200 - a CRM/email outage should never surface as a registration error.
  return NextResponse.json({ success: true });
}

