/**
 * Per-student browser storage.
 *
 * The feature tools (course checkmarks, habits, mock tests, essay and SOP
 * drafts, planners...) keep their data in localStorage. Their keys used to be
 * fixed ("onegrasp.money.habits.v1"), so every account signed in on the same
 * computer - a school lab, a family laptop - saw and changed the same data.
 * Every key is now suffixed with the signed-in student's uid.
 *
 * AuthProvider sets the scope the moment Firebase knows who is signed in, and
 * CoursePlayerShell waits for that before rendering any tool, so a tool's
 * first read already uses the right student's key.
 */

let scope: string | null = null;

const LEGACY_PREFIXES = ["onegrasp.", "og-goals-"];
const ADOPTED_FLAG = "onegrasp.legacyAdopted.v1";

/** Called by AuthProvider with the signed-in uid (null when signed out). */
export function setStorageScope(uid: string | null): void {
  scope = uid;
  if (uid) adoptLegacy(uid);
}

/** The signed-in uid the storage is currently scoped to. */
export function storageScope(): string | null {
  return scope;
}

/** `base` for the signed-in student ("guest" when nobody is signed in). */
export function scopedKey(base: string): string {
  return `${base}::${scope ?? "guest"}`;
}

/**
 * Data saved before keys were per student has no owner. Once per device it is
 * moved to the first account that signs in after this change: on a personal
 * phone that is its owner; on a shared computer it was already shared, and
 * from then on nothing is.
 */
function adoptLegacy(uid: string): void {
  try {
    const ls = window.localStorage;
    if (ls.getItem(ADOPTED_FLAG)) return;
    const legacy: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && k !== ADOPTED_FLAG && !k.includes("::") && LEGACY_PREFIXES.some((p) => k.startsWith(p))) legacy.push(k);
    }
    for (const k of legacy) {
      const value = ls.getItem(k);
      const target = `${k}::${uid}`;
      if (value != null && ls.getItem(target) == null) ls.setItem(target, value);
      ls.removeItem(k);
    }
    ls.setItem(ADOPTED_FLAG, "1");
  } catch {
    // Storage blocked (private window): nothing to move.
  }
}
