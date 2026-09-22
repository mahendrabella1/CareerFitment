/**
 * Institutional links - a school-specific free-signup code, managed from
 * /admin/institutional. The doc ID in Firestore's `institutional_links`
 * collection IS the code (see app/api/institutional/*), so `code` here is a
 * convenience mirror for list rendering, not a separate identity.
 *
 * Always fully free - no per-link pricing. "Expired"/"full" aren't stored
 * statuses; a link's live validity is computed at redemption time from
 * `status`, `expiresAt` and `maxStudents`/`usedCount` together (see
 * app/api/institutional/redeem/route.ts).
 */
export interface InstitutionalLink {
  code: string;
  schoolName: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  notes?: string;
  expiresAt: string | null;
  maxStudents: number | null;
  usedCount: number;
  status: "active" | "inactive";
  createdAt: string;
  createdBy: string;
}
