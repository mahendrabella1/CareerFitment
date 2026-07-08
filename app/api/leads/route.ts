import { NextResponse } from "next/server";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import {
  createLocalLead,
  listLocalLeads,
  completeLocalLead,
  attachSessionToLead,
} from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

// GET  /api/leads          — list captured leads (admin view)
// POST /api/leads          — create a lead (name/email/phone/city/age/class)
// PATCH /api/leads         — attach a session or mark completed
//
// Only wired for local mode today; the Supabase/Firestore adapters plug in the
// same way the assessment routes do.
export async function GET(req: Request) {
  // Listing leads is admin-only. (POST/PATCH stay open — students call them
  // during the public assessment flow.)
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", statusCode: 401, data: null },
      { status: 401 }
    );
  }
  const leads = await listLocalLeads();
  return NextResponse.json({
    success: true,
    message: "Leads retrieved",
    statusCode: 200,
    data: leads,
  });
}

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    age?: string;
    journeyCode?: string;
    stage?: string;
    dreamCareer?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body", statusCode: 400, data: null },
      { status: 400 }
    );
  }

  if (!body.name || !body.email || !body.journeyCode) {
    return NextResponse.json(
      {
        success: false,
        message: "name, email and journeyCode are required",
        statusCode: 400,
        data: null,
      },
      { status: 400 }
    );
  }
  if (!body.email.includes("@")) {
    return NextResponse.json(
      { success: false, message: "A valid email is required", statusCode: 400, data: null },
      { status: 400 }
    );
  }

  if (!isLocalAssessmentMode()) {
    return NextResponse.json(
      { success: false, message: "Leads API is only available in local mode", statusCode: 501, data: null },
      { status: 501 }
    );
  }

  try {
    const lead = await createLocalLead({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      city: body.city ?? null,
      age: body.age ?? null,
      journeyCode: body.journeyCode,
      stage: body.stage ?? null,
      dreamCareer: body.dreamCareer ?? null,
    });
    return NextResponse.json({
      success: true,
      message: "Lead captured",
      statusCode: 200,
      data: lead,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, message, statusCode: 400, data: null },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  let body: { leadId?: string; sessionId?: string; topCareer?: string | null; complete?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body", statusCode: 400, data: null },
      { status: 400 }
    );
  }
  if (!body.leadId) {
    return NextResponse.json(
      { success: false, message: "leadId is required", statusCode: 400, data: null },
      { status: 400 }
    );
  }
  if (!isLocalAssessmentMode()) {
    return NextResponse.json(
      { success: false, message: "Leads API is only available in local mode", statusCode: 501, data: null },
      { status: 501 }
    );
  }

  if (body.sessionId) {
    await attachSessionToLead(body.leadId, body.sessionId);
  }
  if (body.complete) {
    await completeLocalLead(body.leadId, body.topCareer ?? null);
  }
  return NextResponse.json({
    success: true,
    message: "Lead updated",
    statusCode: 200,
    data: null,
  });
}
