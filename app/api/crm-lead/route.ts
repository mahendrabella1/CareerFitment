import { NextResponse } from "next/server";
import { pushLeadToCRM } from "@/lib/crm";

export const dynamic = "force-dynamic";

// POST /api/crm-lead — pushes a captured lead to the OneGrasp CRM webhook.
// Deliberately independent of assessment mode (local/Supabase) and of the
// legacy /api/leads system — this is the one place every real signup should
// call, server-side, so the CRM bearer token never reaches the browser.
export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
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

  await pushLeadToCRM({
    name: body.name,
    email: body.email,
    phone: body.phone,
    utmSource: body.utmSource,
    utmMedium: body.utmMedium,
    utmCampaign: body.utmCampaign,
  });

  // Always 200 — a CRM outage should never surface as a registration error.
  return NextResponse.json({ success: true });
}
