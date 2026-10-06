import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/adminAuth";
import { ApiError, fail, institutionNames, requireAdmin, usernameEmail, USERNAME_RE } from "@/lib/institution/server";
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
    const perName = new Map<string, number>();
    usersSnap.forEach((d) => {
      const n = String(d.get("institution") || "").trim();
      if (n) perName.set(n, (perName.get(n) ?? 0) + 1);
    });
    const accounts = accSnap.docs.map((d) => ({ ...(d.data() as InstitutionAccount), uid: d.id }));
    const institutions = instSnap.docs.map((d) => {
      const inst = { ...(d.data() as Institution), id: d.id };
      return {
        ...inst,
        students: institutionNames(inst).reduce((s, n) => s + (perName.get(n) ?? 0), 0),
        accounts: accounts.filter((a) => a.institutionId === inst.id).sort((a, b) => a.createdAt - b.createdAt),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const known = new Map<string, number>(perName);
    schoolsSnap.forEach((d) => { const n = String(d.get("name") || "").trim(); if (n && !known.has(n)) known.set(n, 0); });
    linksSnap.forEach((d) => { const n = String(d.get("schoolName") || "").trim(); if (n && !known.has(n)) known.set(n, 0); });
    const knownSchools = [...known.entries()].map(([name, students]) => ({ name, students })).sort((a, b) => b.students - a.students || a.name.localeCompare(b.name));

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

    const auth = await getAdminAuth();
    let uid: string;
    try {
      const user = await auth.createUser({ email: usernameEmail(username), password, displayName: displayName || inst.name });
      uid = user.uid;
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
    const auth = await getAdminAuth();

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
      await auth.updateUser(uid, { password });
      await auth.revokeRefreshTokens(uid); // signs the old password's sessions out
      return NextResponse.json({ ok: true });
    }
    if (action === "active") {
      const active = !!body.active;
      await auth.updateUser(uid, { disabled: !active });
      if (!active) await auth.revokeRefreshTokens(uid);
      await ref.update({ active });
      return NextResponse.json({ ok: true });
    }
    if (action === "delete") {
      await auth.deleteUser(uid).catch(() => undefined);
      await ref.delete();
      return NextResponse.json({ ok: true });
    }
    throw new ApiError(400, "Unknown action.");
  } catch (e) {
    return fail(e);
  }
}
