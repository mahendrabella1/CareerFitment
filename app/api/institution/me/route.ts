import { NextResponse } from "next/server";
import { fail, requireInstitution } from "@/lib/institution/server";

export const dynamic = "force-dynamic";

/** GET /api/institution/me - the signed-in institution login and its institution. */
export async function GET(req: Request) {
  try {
    const { account, institution, db, viewAs } = await requireInstitution(req);
    if (!viewAs) await db.collection("institutionAccounts").doc(account.uid).update({ lastLoginAt: Date.now() }).catch(() => undefined);
    return NextResponse.json({
      viewAs,
      account: { username: account.username, displayName: account.displayName },
      institution: { id: institution.id, name: institution.name, aliases: institution.aliases ?? [] },
    });
  } catch (e) {
    return fail(e);
  }
}
