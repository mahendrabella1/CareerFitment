/**
 * Emails allowed into the /admin dashboard.
 * IMPORTANT: keep this list in sync with the isAdmin() function in
 * firestore.rules (the rules can't import this file).
 */
export const ADMIN_EMAILS = [
  "support@onegrasp.com", // <- admin login email
];

/** Pre-filled email on the /admin login form. */
export const ADMIN_LOGIN_EMAIL = "support@onegrasp.com";

export const isAdmin = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
