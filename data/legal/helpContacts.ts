/**
 * National helplines and portals - real, stable, government-run numbers and
 * sites only (no paid third-party services, per the "no api costs"
 * instruction). `lastVerifiedAt` is set at authoring time; this is a static
 * file, not a monthly-rechecked CMS - keeping it current going forward is a
 * file edit. Entries with only a `url` are official portals (no phone line).
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
  { slug: "women", name: "Women helpline", number: "181", hours: "24x7", note: "For women in distress. Connects to One Stop Centres (Sakhi) for shelter, medical, legal and counselling help.", lastVerifiedAt: "2026-10-03" },
  { slug: "ncw", name: "National Commission for Women helpline", number: "14490", url: "https://ncw.gov.in/", hours: "24x7", note: "NCW's short-code helpline, linked to its 24x7 line 7827170170, for women facing violence or harassment.", lastVerifiedAt: "2026-10-03" },
  { slug: "cyber-fraud", name: "Cyber fraud / cybercrime", number: "1930", url: "https://cybercrime.gov.in/", note: "Report online financial fraud fast; also file a detailed report on the portal.", lastVerifiedAt: "2026-10-02" },
  { slug: "consumer", name: "Consumer complaints", number: "1915", url: "https://consumerhelpline.gov.in/", note: "National Consumer Helpline - often settles complaints with a company directly.", lastVerifiedAt: "2026-10-02" },
  { slug: "rbi", name: "RBI contact centre and Ombudsman", number: "14448", url: "https://cms.rbi.org.in/", hours: "9:30 am to 5:15 pm, working days", note: "Help with complaints against banks, NBFCs and payment apps. File Ombudsman complaints free on the CMS portal.", lastVerifiedAt: "2026-10-03" },
  { slug: "legal-aid", name: "Free legal advice & aid", number: "15100", url: "https://nalsa.gov.in/", note: "NALSA legal aid helpline - free legal advice and, for eligible people, a lawyer.", lastVerifiedAt: "2026-10-02" },
  { slug: "tele-law", name: "Tele-Law (free legal advice)", number: "14454", url: "https://www.tele-law.in/", note: "Free advice from panel lawyers before going to court, by phone, the Tele-Law app or a Common Service Centre.", lastVerifiedAt: "2026-10-03" },
  { slug: "senior", name: "Senior citizens", number: "14567", note: "Elderline - information, guidance and abuse support for senior citizens.", lastVerifiedAt: "2026-10-02" },
  { slug: "ragging", name: "Anti-ragging helpline", number: "1800-180-5522", url: "https://www.antiragging.in/", note: "National Anti-Ragging Helpline, toll-free in 12 languages, for ragging in colleges.", lastVerifiedAt: "2026-10-03" },
  { slug: "mental-health", name: "Mental health support", number: "14416", note: "Tele-MANAS - free, confidential mental health support, useful alongside legal problems that cause distress.", lastVerifiedAt: "2026-10-02" },
  // Official portals (no phone line)
  { slug: "ncpcr", name: "NCPCR e-Baal Nidan (child rights complaints)", url: "https://ncpcr.gov.in/ebaalnidan/", note: "Free online complaints about violations of child rights, including the right to education. Track status by SMS and email.", lastVerifiedAt: "2026-10-03" },
  { slug: "pencil", name: "PENCIL portal (child labour)", url: "https://pencil.gov.in/", note: "Report child labour online. The district nodal officer checks complaints within 48 hours.", lastVerifiedAt: "2026-10-03" },
  { slug: "gac", name: "Grievance Appellate Committee", url: "https://gac.gov.in/", note: "Appeal within 30 days if a social media or online platform's grievance officer does not resolve your complaint.", lastVerifiedAt: "2026-10-03" },
  { slug: "e-jagriti", name: "e-Jagriti (consumer commissions)", url: "https://e-jagriti.gov.in/", note: "File and track consumer commission complaints online (formerly e-Daakhil).", lastVerifiedAt: "2026-10-03" },
  { slug: "sachet", name: "RBI Sachet portal", url: "https://sachet.rbi.org.in/", note: "Report unauthorised lenders, illegal loan apps and deposit schemes.", lastVerifiedAt: "2026-10-03" },
  { slug: "she-box", name: "SHe-Box (sexual harassment at work)", url: "https://shebox.wcd.gov.in/", note: "File a workplace sexual harassment complaint online; it goes to the Internal Committee concerned.", lastVerifiedAt: "2026-10-03" },
  { slug: "labour-samadhan", name: "Samadhan portal (labour disputes)", url: "https://samadhan.labour.gov.in/", note: "Ministry of Labour portal for filing and tracking industrial disputes in the central sphere.", lastVerifiedAt: "2026-10-03" },
  { slug: "eshram", name: "e-Shram (unorganised and gig workers)", url: "https://eshram.gov.in/", note: "Register for a Universal Account Number and access social security schemes.", lastVerifiedAt: "2026-10-03" },
  { slug: "msme-samadhaan", name: "MSME Samadhaan (delayed payments)", url: "https://samadhaan.msme.gov.in/", note: "Registered micro and small enterprises, including freelancers, can file delayed-payment cases.", lastVerifiedAt: "2026-10-03" },
  { slug: "disability", name: "Chief Commissioner for Persons with Disabilities", url: "https://ccdisabilities.nic.in/", note: "Complaints when the rights of persons with disabilities are denied.", lastVerifiedAt: "2026-10-03" },
  { slug: "rti-online", name: "RTI Online", url: "https://rtionline.gov.in/", note: "File RTI applications and first appeals to central government departments, and pay the ₹10 fee online.", lastVerifiedAt: "2026-10-03" },
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

/** Phone helplines only (the SOS bar and "call" lists). */
export const PHONE_CONTACTS = HELP_CONTACTS.filter((c) => Boolean(c.number));

/** Every official portal, from ONLINE_PORTALS plus portal-only contacts, without duplicate URLs. */
export const ALL_PORTALS: { name: string; url: string; note: string }[] = (() => {
  const seen = new Set<string>();
  const out: { name: string; url: string; note: string }[] = [];
  for (const p of [...ONLINE_PORTALS, ...HELP_CONTACTS.filter((c) => !c.number && c.url).map((c) => ({ name: c.name, url: c.url as string, note: c.note }))]) {
    if (seen.has(p.url)) continue;
    seen.add(p.url);
    out.push(p);
  }
  return out;
})();
