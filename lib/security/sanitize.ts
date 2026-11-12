/**
 * Small, dependency-free cleaners for values that come from a request or from
 * a student and end up in an email, a link or a redirect. Pure, so the server
 * routes, the browser (research sources) and the tests all use the same rules.
 */

/**
 * An absolute http(s) URL, or "" for anything else - javascript:, data:,
 * vbscript:, relative paths and garbage all come back empty. A bare domain
 * ("www.example.com/page") is read as https.
 */
export function safeHttpUrl(raw: unknown): string {
  let s = String(raw ?? "").trim();
  if (!s || s.length > 2048 || /[\u0000-\u001f\u007f\s]/.test(s)) return "";
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s) && /^[a-z0-9-]+(\.[a-z0-9-]+)+(?::\d+)?(\/|$)/i.test(s)) s = `https://${s}`;
  try {
    const url = new URL(s);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname ? url.href : "";
  } catch {
    return "";
  }
}

/** One line of plain text: control characters and line breaks become spaces, runs of spaces collapse, cut to `max`. */
export function plainText(raw: unknown, max: number): string {
  return String(raw ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max).trim();
}

/**
 * A path on this site ("/account/exams?x=1"), or null. Rejects anything that a
 * browser would send to another host: "//evil.com", "/\\evil.com", "https://...",
 * "javascript:...", and control characters.
 */
export function safeInternalPath(raw: unknown): string | null {
  const s = String(raw ?? "").trim();
  if (!s.startsWith("/") || s.startsWith("//") || s.startsWith("/\\") || s.length > 500) return null;
  if (/[\u0000-\u001f\u007f\\]/.test(s)) return null;
  try {
    const base = "https://onegrasp.invalid";
    const url = new URL(s, base);
    return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}
