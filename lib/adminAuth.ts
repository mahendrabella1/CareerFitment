// Simple shared-secret guard for admin-only endpoints. Set ADMIN_TOKEN in
// .env.local for production; falls back to a dev default otherwise.
export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN || "onegrasp-admin-dev";
}

/** True when the request carries the correct admin token. */
export function isAuthorizedAdmin(req: Request): boolean {
  const expected = getAdminToken();
  const header =
    req.headers.get("authorization") || req.headers.get("x-admin-token") || "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  return provided.length > 0 && provided === expected;
}
