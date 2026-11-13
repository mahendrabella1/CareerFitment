import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/security/rateLimit";
import { cleanEnquiry, TRAP, type EnquiryKind } from "@/lib/enquiries/forms";
import { saveEnquiry } from "@/lib/enquiries/server";
import { logged } from "@/lib/security/serverError";

export const dynamic = "force-dynamic";

const KINDS: EnquiryKind[] = ["school", "privacy"];

/**
 * POST /api/enquiries/school | /api/enquiries/privacy - the public forms
 * (lib/enquiries/forms.ts). No sign-in: limited to 5 an hour per visitor, a
 * hidden field catches bots, every field is checked and capped. Saved
 * server-only and emailed to the team (lib/enquiries/server.ts).
 */
export async function POST(req: Request, props: { params: Promise<{ kind: string }> }) {
  const { kind } = await props.params;
  if (!KINDS.includes(kind as EnquiryKind)) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  const limited = await rateLimited(req, `enquiry-${kind}`, 5, 3600);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Please fill in the form again." }, { status: 400 });
  }
  // A bot filled in the field people can't see: say thanks, keep nothing.
  if (typeof body[TRAP] === "string" && body[TRAP]) return NextResponse.json({ ok: true, id: "SC-THANKS" });

  const clean = cleanEnquiry(kind as EnquiryKind, body);
  if (!clean.ok) return NextResponse.json({ ok: false, error: clean.error }, { status: 400 });
  try {
    const page = typeof body.page === "string" ? body.page : "";
    const { id } = await saveEnquiry(kind as EnquiryKind, clean.data, { ip: clientIp(req), page });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: logged(`enquiry:${kind}`, e, "We couldn't send that just now - please email support@onegrasp.com instead.") }, { status: 500 });
  }
}
