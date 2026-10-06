import { NextResponse } from "next/server";
import { createAuthUser, deleteAuthUser, updateAuthUser } from "@/lib/firebase/adminAuth";
import { ApiError, fail, institutionNames, normName, requireAdmin, usernameEmail, USERNAME_RE } from "@/lib/institution/server";
import type { Institution, InstitutionAccount } from "@/lib/institution/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * /api/admin/institutions - OneGrasp admins create and manage the logins
 * schools and colleges use for the institution portal (/institution).
 *
 * GET    every institution with its logins and linked-student count, plus
 *        the school names already in use (to pick from when creating one)
 * POST   create a login - for a new institution, or another login for an
 *        existing one
 * PATCH  { action: "password" | "active" | "delete", uid, ... } on a login,
 *        or { action: "institution", id, ... } to edit names/contact
 */

export async function GET(req: Request) {
  try {
    const { db } = await requireAdmin(req);
    const [instSnap, accSnap, schoolsSnap, linksSnap, usersSnap] = await Promise.all([
      db.collection("institutions").get(),
      db.collection("institutionAccounts").get(),
      db.collection("schools").get(),
      db.collection("institutional_links").get(),
      db.collection("users").select("institution").get(),
    ]);
    // Students per school name, compared the way the portal compares them
    // (normName: spacing and capitals ignored), so this count is always what
    // the institution will see. Each group is shown in its most common spelling.
    const groups = new Map<string, { students: number; spellings: Map<string, number> }>();
    const addName = (raw: unknown, count: number) => {
      const key = normName(raw);
      if (!key) return;
      const g = groups.get(key) ?? { students: 0, spellings: new Map() };
      const spelling = String(raw).trim().replace(/\s+/g, " ");
      g.students += count;
      g.spellings.set(spelling, (g.spellings.get(spelling) ?? 0) + Math.max(count, 0.5));
      groups.set(key, g);
    };
    usersSnap.forEach((d) => addName(d.get("institution"), 1));
    schoolsSnap.forEach((d) => addName(d.get("name"), 0));
    linksSnap.forEach((d) => addName(d.get("schoolName"), 0));

    const accounts = accSnap.docs.map((d) => ({ ...(d.data() as InstitutionAccount), uid: d.id }));
    const institutions = instSnap.docs.map((d) => {
      const inst = { ...(d.data() as Institution), id: d.id };
      return {
        ...inst,
        students: [...new Set(institutionNames(inst).map(normName))].reduce((s, k) => s + (groups.get(k)?.students ?? 0), 0),
        accounts: accounts.filter((a) => a.institutionId === inst.id).sort((a, b) => a.createdAt - b.createdAt),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const knownSchools = [...groups.values()]
      .map((g) => ({ name: [...g.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0], students: g.students }))
      .sort((a, b) => b.students - a.students || a.name.localeCompare(b.name));

    return NextResponse.json({ institutions, knownSchools });
  } catch (e) {
    return fail(e);
  }
}

function clean(v: unknown, max = 160): string {
  return String(v ?? "").trim().slice(0, max);
}

function cleanAliases(v: unknown, name: string): string[] {
  const list = Array.isArray(v) ? v : String(v ?? "").split("\n");
  return [...new Set(list.map((s) => clean(s)).filter((s) => s && s !== name))].slice(0, 40);
}

export async function POST(req: Request) {
  try {
    const { db, email } = await requireAdmin(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const username = clean(body.username, 32).toLowerCase();
    const password = String(body.password ?? "");
    const displayName = clean(body.displayName, 80);
    if (!USERNAME_RE.test(username)) throw new ApiError(400, "Username: 3-32 characters - lowercase letters, numbers, dot, dash or underscore, starting with a letter or number.");
    if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters.");

    let inst: Institution;
    if (body.institutionId) {
      const snap = await db.collection("institutions").doc(String(body.institutionId)).get();
      if (!snap.exists) throw new ApiError(404, "That institution no longer exists.");
      inst = { ...(snap.data() as Institution), id: snap.id };
    } else {
      const name = clean(body.name);
      if (!name) throw new ApiError(400, "Enter the institution's name exactly as students have it on their profiles.");
      const ref = db.collection("institutions").doc();
      inst = {
        id: ref.id, name, aliases: cleanAliases(body.aliases, name),
        ...(clean(body.contactName) ? { contactName: clean(body.contactName) } : {}),
        ...(clean(body.contactEmail) ? { contactEmail: clean(body.contactEmail) } : {}),
        ...(clean(body.contactPhone, 30) ? { contactPhone: clean(body.contactPhone, 30) } : {}),
        createdAt: Date.now(), createdBy: email,
      };
      await ref.set(inst);
    }

    let uid: string;
    try {
      uid = await createAuthUser({ email: usernameEmail(username), password, displayName: displayName || inst.name });
    } catch (e) {
      const code = (e as { code?: string })?.code || "";
      if (code.includes("email-already-exists")) throw new ApiError(409, `The username "${username}" is already taken.`);
      if (code.includes("invalid-password")) throw new ApiError(400, "Firebase rejected that password - use at least 8 characters.");
      throw e;
    }
    const account: InstitutionAccount = {
      uid, institutionId: inst.id, username, displayName: displayName || inst.name,
      active: true, createdAt: Date.now(), createdBy: email,
    };
    await db.collection("institutionAccounts").doc(uid).set(account);
    return NextResponse.json({ institution: inst, account });
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const { db } = await requireAdmin(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const action = String(body.action || "");

    if (action === "institution") {
      const ref = db.collection("institutions").doc(String(body.id || ""));
      const snap = await ref.get();
      if (!snap.exists) throw new ApiError(404, "That institution no longer exists.");
      const name = clean(body.name) || String(snap.get("name"));
      await ref.update({
        name, aliases: cleanAliases(body.aliases, name),
        contactName: clean(body.contactName), contactEmail: clean(body.contactEmail), contactPhone: clean(body.contactPhone, 30),
      });
      return NextResponse.json({ ok: true });
    }

    const uid = String(body.uid || "");
    const ref = db.collection("institutionAccounts").doc(uid);
    if (!uid || !(await ref.get()).exists) throw new ApiError(404, "That login no longer exists.");
    if (action === "password") {
      const password = String(body.password ?? "");
      if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters.");
      await updateAuthUser(uid, { password, signOut: true }); // the old password's sessions end
      return NextResponse.json({ ok: true });
    }
    if (action === "active") {
      const active = !!body.active;
      await updateAuthUser(uid, { disabled: !active, signOut: !active });
      await ref.update({ active });
      return NextResponse.json({ ok: true });
    }
    if (action === "delete") {
      await deleteAuthUser(uid).catch(() => undefined);
      await ref.delete();
      return NextResponse.json({ ok: true });
    }
    throw new ApiError(400, "Unknown action.");
  } catch (e) {
    return fail(e);
  }
}
