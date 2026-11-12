// Shared-secret guard for the few token-protected admin endpoints (e.g. GET
// /api/leads). The token comes only from ADMIN_TOKEN - there is no built-in
// default (security audit C-02). With ADMIN_TOKEN unset or shorter than 24
// characters every request is refused.
import { createHash, timingSafeEqual } from "crypto";

export const MIN_ADMIN_TOKEN_LENGTH = 24;

/** The configured admin token, or "" when it's missing or too short to trust. */
export function getAdminToken(): string {
  const token = String(process.env.ADMIN_TOKEN ?? "").trim();
  return token.length >= MIN_ADMIN_TOKEN_LENGTH ? token : "";
}

const digest = (s: string) => createHash("sha256").update(s, "utf8").digest();

/** True when the request carries the configured admin token. */
export function isAuthorizedAdmin(req: Request): boolean {
  const expected = getAdminToken();
  if (!expected) return false;
  const header = req.headers.get("authorization") || req.headers.get("x-admin-token") || "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  if (!provided) return false;
  // Compare fixed-length digests, so neither the length nor the content leaks through timing.
  return timingSafeEqual(digest(provided), digest(expected));
}
