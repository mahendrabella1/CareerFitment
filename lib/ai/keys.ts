/**
 * Server-only: read an API key from the environment the way it was meant to
 * be - without the spaces, line breaks or quotes a copy-paste into Vercel
 * often adds (a key like `"gsk_..."` or `gsk_...\n` is rejected as invalid).
 */
export function envKey(name: string): string {
  return String(process.env[name] ?? "").trim().replace(/^(['"])(.*)\1$/s, "$2").trim();
}

/** What's wrong with a key's shape, without revealing it (for the admin status page). */
export function keyShape(name: string, prefix?: string): { set: boolean; length: number; cleaned: boolean; prefixOk: boolean | null; ends: string } {
  const raw = String(process.env[name] ?? "");
  const key = envKey(name);
  return {
    set: !!key,
    length: key.length,
    cleaned: raw !== key,
    prefixOk: prefix ? key.startsWith(prefix) : null,
    ends: key ? `…${key.slice(-4)}` : "",
  };
}
