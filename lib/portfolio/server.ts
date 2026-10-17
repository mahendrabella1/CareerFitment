/**
 * Server-only helpers for the student portfolio ("Build Your Website",
 * /account/portfolio). Every write goes through cleanPortfolioInput(), so a
 * request can only set the fields a student may edit, with sane lengths -
 * never userId, profileSlug, views or careerScore.
 */
import { randomBytes } from "crypto";
import type { Firestore } from "firebase-admin/firestore";
import { ApiError } from "@/lib/institution/server";
import type {
  PortfolioCertification, PortfolioEducation, PortfolioExperience, PortfolioProfile, PortfolioSkill,
} from "@/lib/data/portfolioSchema";

export const PORTFOLIOS = "portfolios";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bool = (v: unknown) => v === true;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const month = (v: unknown) => (typeof v === "string" && MONTH.test(v) ? v : "");
const ID = /^[A-Za-z0-9-]{4,40}$/;
const newId = () => randomBytes(6).toString("hex");
const id = (v: unknown) => (typeof v === "string" && ID.test(v) ? v : newId());

/** A web link, or "" - only http(s), "https://" added when left out. */
function url(v: unknown): string {
  const s = str(v, 200);
  if (!s) return "";
  const full = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(full);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

const list = <T>(v: unknown, max: number, each: (x: Record<string, unknown>) => T | null): T[] =>
  (Array.isArray(v) ? v : []).slice(0, max).flatMap((x) => {
    const item = x && typeof x === "object" ? each(x as Record<string, unknown>) : null;
    return item ? [item] : [];
  });

const SKILL_CATEGORIES = ["technical", "professional", "language", "other"] as const;

/**
 * The editable fields present in `body`, cleaned. Keys a request leaves out
 * are left out here too, so a save can touch one section at a time.
 */
export function cleanPortfolioInput(body: Record<string, unknown>): Partial<PortfolioProfile> {
  const out: Partial<PortfolioProfile> = {};
  const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);

  if (has("displayName")) out.displayName = str(body.displayName, 80);
  if (has("headline")) out.headline = str(body.headline, 120);
  if (has("bio")) out.bio = str(body.bio, 1500);
  if (has("location")) out.location = str(body.location, 80);
  if (has("careerFit")) out.careerFit = str(body.careerFit, 80);
  if (has("email")) out.email = str(body.email, 120);
  if (has("phone")) out.phone = str(body.phone, 20);
  for (const k of ["website", "linkedin", "github", "twitter"] as const) if (has(k)) out[k] = url(body[k]);
  for (const k of ["isPublic", "showEmail", "showPhone", "showCareerScore"] as const) if (has(k)) out[k] = bool(body[k]);

  if (has("experience")) {
    out.experience = list<PortfolioExperience>(body.experience, 20, (x) => {
      const title = str(x.title, 100);
      const company = str(x.company, 100);
      if (!title || !company) return null;
      const current = bool(x.currentlyWorking);
      return {
        id: id(x.id), title, company, location: str(x.location, 80),
        startDate: month(x.startDate), endDate: current ? "" : month(x.endDate), currentlyWorking: current,
        description: str(x.description, 1000),
        skills: (Array.isArray(x.skills) ? x.skills : []).map((s) => str(s, 40)).filter(Boolean).slice(0, 10),
      };
    });
  }
  if (has("education")) {
    out.education = list<PortfolioEducation>(body.education, 15, (x) => {
      const institution = str(x.institution, 120);
      if (!institution) return null;
      const current = bool(x.currentlyStudying);
      return {
        id: id(x.id), institution, degree: str(x.degree, 100), field: str(x.field, 100),
        startDate: month(x.startDate), endDate: current ? "" : month(x.endDate), currentlyStudying: current,
        description: str(x.description, 600),
      };
    });
  }
  if (has("certifications")) {
    out.certifications = list<PortfolioCertification>(body.certifications, 30, (x) => {
      const name = str(x.name, 120);
      if (!name) return null;
      return {
        id: id(x.id), name, issuer: str(x.issuer, 100), issueDate: month(x.issueDate), expiryDate: month(x.expiryDate),
        credentialUrl: url(x.credentialUrl), credentialId: str(x.credentialId, 80),
      };
    });
  }
  if (has("skills")) {
    const seen = new Set<string>();
    out.skills = list<PortfolioSkill>(body.skills, 50, (x) => {
      const name = str(x.name, 40);
      if (!name || seen.has(name.toLowerCase())) return null;
      seen.add(name.toLowerCase());
      const category = SKILL_CATEGORIES.find((c) => c === x.category) ?? "other";
      return { id: id(x.id), name, endorsements: 0, category };
    });
  }
  return out;
}

/** Firestore Timestamps (older portfolios) and Dates as ISO strings. */
function iso(v: unknown): string {
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  const t = v as { toDate?: () => Date; _seconds?: number } | null;
  if (t?.toDate) return t.toDate().toISOString();
  if (typeof t?._seconds === "number") return new Date(t._seconds * 1000).toISOString();
  return new Date().toISOString();
}

/** A stored portfolio with every list present and dates as strings. */
export function normalisePortfolio(data: Record<string, unknown>): PortfolioProfile {
  const p = data as unknown as PortfolioProfile;
  return {
    ...p,
    experience: p.experience ?? [], education: p.education ?? [], certifications: p.certifications ?? [], skills: p.skills ?? [],
    isPublic: !!p.isPublic, showEmail: !!p.showEmail, showPhone: !!p.showPhone, showCareerScore: p.showCareerScore !== false,
    views: p.views ?? 0, lastUpdated: iso(data.lastUpdated), createdAt: iso(data.createdAt),
  };
}

function slugFor(name: string): string {
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "student";
  return `${base}-${randomBytes(3).toString("hex")}`;
}

/**
 * Save the student's own portfolio: creates it on the first save (a headline
 * and a short bio are needed then), otherwise updates only the given fields.
 */
export async function savePortfolio(db: Firestore, uid: string, body: Record<string, unknown>): Promise<PortfolioProfile> {
  const ref = db.collection(PORTFOLIOS).doc(uid);
  const snap = await ref.get();
  const input = cleanPortfolioInput(body);
  const now = new Date().toISOString();

  if (!snap.exists) {
    if (!input.headline || !input.bio) throw new ApiError(400, "Add a headline and a short bio to create your portfolio.");
    const user = await db.collection("users").doc(uid).get();
    const displayName = input.displayName || String(user.get("name") || "").trim().slice(0, 80);
    const created: PortfolioProfile = {
      userId: uid, profileSlug: slugFor(displayName || input.headline), displayName,
      headline: input.headline, bio: input.bio, location: input.location ?? "", careerFit: input.careerFit ?? "",
      website: "", email: "", phone: "", linkedin: "", github: "", twitter: "",
      experience: [], education: [], certifications: [], skills: [],
      isPublic: false, shareToken: randomBytes(8).toString("hex"), views: 0, lastUpdated: now, createdAt: now,
      showEmail: false, showPhone: false, showCareerScore: true,
      ...input,
    };
    await ref.set(created);
    return created;
  }

  if (input.headline === "") delete input.headline; // a headline can't be emptied
  await ref.update({ ...input, lastUpdated: now });
  return normalisePortfolio((await ref.get()).data() ?? {});
}
