import { NextResponse } from "next/server";
import { pushLeadToCRM } from "@/lib/crm";
import { sendLeadNotificationEmail } from "@/lib/leadEmail";

export const dynamic = "force-dynamic";

// POST /api/crm-lead — fires for every fresh registration (status "unpaid" —
// the fee comes later via PaymentGate). Pushes the lead to the CRM webhook
// and sends the internal "new lead" notification email. Deliberately
// independent of assessment mode (local/Supabase) and of the legacy
// /api/leads system — this is the one place every real signup calls,
// server-side, so the CRM bearer token and SMTP creds never reach the browser.
export async function POST(req: Request) {
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

  if (!body.name || !body.email) {
    return NextResponse.json({ success: false, message: "name and email are required" }, { status: 400 });
  }

  await Promise.all([
    pushLeadToCRM({
      name: body.name,
      email: body.email,
      phone: body.phone,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      status: "unpaid",
    }),
    sendLeadNotificationEmail(
      { name: body.name, email: body.email, phone: body.phone, institution: body.institution, category: body.category, city: body.city, age: body.age },
      "unpaid"
    ),
  ]);

  // Always 200 — a CRM/email outage should never surface as a registration error.
  return NextResponse.json({ success: true });
}
