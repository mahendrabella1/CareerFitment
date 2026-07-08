/**
 * Emails allowed into the /admin dashboard.
 * IMPORTANT: keep this list in sync with the isAdmin() function in
 * firestore.rules (the rules can't import this file).
 */
export const ADMIN_EMAILS = [
  "2022csm.r306@svck.edu.in", // <- change / add your admin email(s)
];

export const isAdmin = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
