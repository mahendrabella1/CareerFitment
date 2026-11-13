/**
 * OneGrasp's official social profiles - the ones linked from onegrasp.com
 * (header/footer and contact page, checked 13 Nov 2026). Used in the home and
 * public footers and in the Organization structured data (sameAs). Add a
 * profile only once onegrasp.com links it too.
 */
export const SOCIAL = [
  { name: "Facebook", href: "https://www.facebook.com/onegrasp/", d: "M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14.1 2C10.9 2 10.2 4.4 10.2 6v2.5H8V12h2.2v10H14V12h2.7l.4-3.5z" },
  { name: "Instagram", href: "https://www.instagram.com/onegrasp/", d: "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1C3.8 5.2 5.1 3.9 7.9 3.8 9 3.7 9.3 3.6 12 3.6zM12 2c-2.7 0-3.1 0-4.2.1C4.2 2.2 2.2 4.2 2.1 7.8 2 8.9 2 9.3 2 12s0 3.1.1 4.2c.2 3.6 2.1 5.6 5.7 5.7 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c3.6-.2 5.6-2.1 5.7-5.7.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c-.2-3.6-2.1-5.6-5.7-5.7C15.1 2 14.7 2 12 2z" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/onegrasp/", d: "M6.9 21H3.3V9.2h3.6V21zM5.1 7.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM21 21h-3.6v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9.7V9.2h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5V21z" },
  { name: "YouTube", href: "https://www.youtube.com/@OneGrasp", d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" },
] as const;

/** A row of round icon links to the profiles (open in a new tab). */
export function SocialLinks({ color = "currentColor", size = 18, className }: { color?: string; size?: number; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
      {SOCIAL.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noopener" aria-label={`OneGrasp on ${s.name}`} title={`OneGrasp on ${s.name}`}
          style={{ display: "inline-grid", placeItems: "center", width: size + 14, height: size + 14, borderRadius: "50%", border: "1px solid currentColor", color, opacity: 0.85 }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={s.d} /></svg>
        </a>
      ))}
    </span>
  );
}
