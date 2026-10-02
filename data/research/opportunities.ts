/**
 * Conference Finder - Phase 1 content. ONLY real, verifiable opportunities
 * (per "Research and International Conferences Section - Plan.pdf",
 * section 8) - deliberately does NOT include OneGrasp's own 500+ event
 * catalog, because the plan itself notes OneGrasp's site blocked automated
 * access when it was written, so no real event data (dates, subjects,
 * fees, deadlines) exists to populate it with. Inventing plausible-looking
 * OneGrasp listings would mean a student planning their actual research
 * timeline around a fabricated deadline - the same "never fabricate
 * signal" standard this project holds its assessment data to. Once
 * OneGrasp provides real event data (see the open questions this plan
 * raises), wire it into this same list/filter structure rather than
 * replacing it.
 */

export type AudienceLevel = "school" | "undergraduate" | "postgraduate" | "professional" | "any";

export interface ResearchOpportunity {
  id: string;
  name: string;
  who: string;
  audience: AudienceLevel[];
  subject: string;
  what: string;
  link: string;
  verified: boolean; // passed the quality checklist in lib/research/checklist.ts
}

export const RESEARCH_OPPORTUNITIES: ResearchOpportunity[] = [
  {
    id: "iris-national-fair",
    name: "IRIS National Fair",
    who: "School students in India",
    audience: ["school"],
    subject: "Science & Engineering (all subjects)",
    what: "India's national science and engineering fair; top projects can go on to the international Regeneron ISEF.",
    link: "https://irisnationalfair.org",
    verified: true,
  },
  {
    id: "inspire-manak",
    name: "INSPIRE Awards - MANAK",
    who: "Class 6-10 in India",
    audience: ["school"],
    subject: "Science & Technology (original ideas)",
    what: "Government (DST) scheme in which schools nominate students' original ideas for funding and recognition. Search \"INSPIRE Awards MANAK\" for the current official DST portal - not linked here since the exact root domain wasn't independently confirmed.",
    link: "",
    verified: false,
  },
  {
    id: "ncsc",
    name: "National Children's Science Congress",
    who: "Children in India, roughly ages 10-17",
    audience: ["school"],
    subject: "Science (yearly theme)",
    what: "Project-based congress on a yearly theme, from district to national level. Search \"National Children's Science Congress\" plus your state for the current official registration page - not linked here since the exact root domain wasn't independently confirmed.",
    link: "",
    verified: false,
  },
  {
    id: "breakthrough-junior-challenge",
    name: "Breakthrough Junior Challenge",
    who: "Ages 13-18, worldwide",
    audience: ["school"],
    subject: "Science & Mathematics",
    what: "Short video explaining a science or maths concept - a good fit for learners who enjoy presenting.",
    link: "https://breakthroughjuniorchallenge.org",
    verified: true,
  },
  {
    id: "university-symposiums",
    name: "University student symposiums",
    who: "Undergraduates and postgraduates",
    audience: ["undergraduate", "postgraduate"],
    subject: "All subjects (varies by university)",
    what: "Many universities run free or low-cost student research days - check your own university's website for its symposium.",
    link: "",
    verified: false, // generic category, not one verifiable organiser - flagged, not a "Verified" badge
  },
  {
    id: "professional-society-conferences",
    name: "Professional society conferences (IEEE, ACM, subject societies)",
    who: "Postgraduates, researchers, professionals",
    audience: ["postgraduate", "professional"],
    subject: "Engineering, computing and other professional fields",
    what: "Peer-reviewed conferences with published proceedings - more selective than a first practice run.",
    link: "",
    verified: false, // generic category spanning many real societies - check each society's own events page
  },
];

export function opportunitiesFor(audience: AudienceLevel): ResearchOpportunity[] {
  return RESEARCH_OPPORTUNITIES.filter((o) => o.audience.includes(audience) || o.audience.includes("any"));
}
