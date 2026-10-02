/**
 * National helplines and portals - real, stable, government-run numbers
 * only (no paid third-party services, per the "no api costs" instruction).
 * `lastVerifiedAt` is set at authoring time; this is a static file, not a
 * monthly-rechecked CMS - keeping it current going forward is a file edit.
 */

export interface HelpContact {
  slug: string;
  name: string;
  number?: string;
  url?: string;
  hours?: string;
  note: string;
  lastVerifiedAt: string;
}

export const HELP_CONTACTS: HelpContact[] = [
  { slug: "emergency", name: "Emergency (police, fire, ambulance)", number: "112", hours: "24x7", note: "National Emergency Response Support System - the single number for any emergency.", lastVerifiedAt: "2026-10-02" },
  { slug: "child", name: "Child helpline", number: "1098", hours: "24x7", note: "For children in danger or in need of help.", lastVerifiedAt: "2026-10-02" },
  { slug: "women", name: "Women helpline", number: "181", hours: "24x7", note: "For women in distress.", lastVerifiedAt: "2026-10-02" },
  { slug: "cyber-fraud", name: "Cyber fraud / cybercrime", number: "1930", url: "https://cybercrime.gov.in/", note: "Report online financial fraud fast; also file a detailed report on the portal.", lastVerifiedAt: "2026-10-02" },
  { slug: "consumer", name: "Consumer complaints", number: "1915", url: "https://consumerhelpline.gov.in/", note: "National Consumer Helpline - often settles complaints with a company directly.", lastVerifiedAt: "2026-10-02" },
  { slug: "legal-aid", name: "Free legal advice & aid", number: "15100", url: "https://nalsa.gov.in/", note: "NALSA legal aid helpline - free legal advice and, for eligible people, a lawyer.", lastVerifiedAt: "2026-10-02" },
  { slug: "senior", name: "Senior citizens", number: "14567", note: "Elderline - information, guidance and abuse support for senior citizens.", lastVerifiedAt: "2026-10-02" },
  { slug: "ragging", name: "Anti-ragging helpline", number: "1800-180-5522", note: "National Anti-Ragging Helpline, for ragging in colleges.", lastVerifiedAt: "2026-10-02" },
  { slug: "mental-health", name: "Mental health support", number: "14416", note: "Tele-MANAS - free, confidential mental health support, useful alongside legal problems that cause distress.", lastVerifiedAt: "2026-10-02" },
];

export const ONLINE_PORTALS: { name: string; url: string; note: string }[] = [
  { name: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/", note: "Cyber fraud, harassment and online abuse." },
  { name: "SHe-Box", url: "https://shebox.wcd.gov.in/", note: "Government portal for sexual harassment at work complaints." },
  { name: "e-Jagriti", url: "https://e-jagriti.gov.in/", note: "Consumer commission complaints (formerly e-Daakhil)." },
  { name: "RTI Online", url: "https://rtionline.gov.in/", note: "Right to Information applications to central government departments." },
];

export function helpContactBySlug(slug: string): HelpContact | undefined {
  return HELP_CONTACTS.find((c) => c.slug === slug);
}
