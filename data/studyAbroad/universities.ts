/**
 * University seed list from the Study Abroad plan (section 6): well-known
 * institutions that vary in cost and selectivity. These are examples to
 * seed the database, not recommendations, and the UI says so.
 *
 * Only stable, checkable facts are stored: city, public or private status
 * and the official website (each checked to respond on 2026-10-03). Ranking
 * numbers are deliberately NOT stored - they change every year and must show
 * their year and publisher, so the pages link to the publishers instead.
 * Tuition notes are included only where a published rule applies to Indian
 * (non-EU) students, such as Germany's state rules.
 */

export interface UniversityDef {
  slug: string;
  name: string;
  countryCode: "US" | "CA" | "UK" | "AU" | "DE" | "IE" | "FR";
  city: string;
  type: "public" | "private";
  website: string;
  /** A checked fee rule for non-EU students, where one applies. */
  tuitionNote?: string;
  tuitionSource?: string;
}

export const UNIVERSITIES: UniversityDef[] = [
  // USA
  { slug: "mit", name: "Massachusetts Institute of Technology (MIT)", countryCode: "US", city: "Cambridge, Massachusetts", type: "private", website: "https://www.mit.edu/" },
  { slug: "stanford", name: "Stanford University", countryCode: "US", city: "Stanford, California", type: "private", website: "https://www.stanford.edu/" },
  { slug: "carnegie-mellon", name: "Carnegie Mellon University", countryCode: "US", city: "Pittsburgh, Pennsylvania", type: "private", website: "https://www.cmu.edu/" },
  { slug: "georgia-tech", name: "Georgia Institute of Technology", countryCode: "US", city: "Atlanta, Georgia", type: "public", website: "https://www.gatech.edu/" },
  { slug: "uiuc", name: "University of Illinois Urbana-Champaign", countryCode: "US", city: "Urbana-Champaign, Illinois", type: "public", website: "https://illinois.edu/" },
  { slug: "purdue", name: "Purdue University", countryCode: "US", city: "West Lafayette, Indiana", type: "public", website: "https://www.purdue.edu/" },
  { slug: "arizona-state", name: "Arizona State University", countryCode: "US", city: "Tempe, Arizona", type: "public", website: "https://www.asu.edu/" },
  { slug: "northeastern", name: "Northeastern University", countryCode: "US", city: "Boston, Massachusetts", type: "private", website: "https://www.northeastern.edu/" },
  // Canada
  { slug: "toronto", name: "University of Toronto", countryCode: "CA", city: "Toronto, Ontario", type: "public", website: "https://www.utoronto.ca/" },
  { slug: "ubc", name: "University of British Columbia", countryCode: "CA", city: "Vancouver, British Columbia", type: "public", website: "https://www.ubc.ca/" },
  { slug: "mcgill", name: "McGill University", countryCode: "CA", city: "Montreal, Quebec", type: "public", website: "https://www.mcgill.ca/" },
  { slug: "waterloo", name: "University of Waterloo", countryCode: "CA", city: "Waterloo, Ontario", type: "public", website: "https://uwaterloo.ca/" },
  { slug: "alberta", name: "University of Alberta", countryCode: "CA", city: "Edmonton, Alberta", type: "public", website: "https://www.ualberta.ca/" },
  // UK
  { slug: "imperial", name: "Imperial College London", countryCode: "UK", city: "London", type: "public", website: "https://www.imperial.ac.uk/" },
  { slug: "edinburgh", name: "University of Edinburgh", countryCode: "UK", city: "Edinburgh, Scotland", type: "public", website: "https://www.ed.ac.uk/" },
  { slug: "manchester", name: "University of Manchester", countryCode: "UK", city: "Manchester", type: "public", website: "https://www.manchester.ac.uk/" },
  { slug: "kings-college-london", name: "King's College London", countryCode: "UK", city: "London", type: "public", website: "https://www.kcl.ac.uk/" },
  { slug: "warwick", name: "University of Warwick", countryCode: "UK", city: "Coventry", type: "public", website: "https://warwick.ac.uk/" },
  // Australia
  { slug: "melbourne", name: "University of Melbourne", countryCode: "AU", city: "Melbourne, Victoria", type: "public", website: "https://www.unimelb.edu.au/" },
  { slug: "sydney", name: "University of Sydney", countryCode: "AU", city: "Sydney, New South Wales", type: "public", website: "https://www.sydney.edu.au/" },
  { slug: "unsw", name: "UNSW Sydney", countryCode: "AU", city: "Sydney, New South Wales", type: "public", website: "https://www.unsw.edu.au/" },
  { slug: "monash", name: "Monash University", countryCode: "AU", city: "Melbourne, Victoria", type: "public", website: "https://www.monash.edu/" },
  { slug: "queensland", name: "University of Queensland", countryCode: "AU", city: "Brisbane, Queensland", type: "public", website: "https://www.uq.edu.au/" },
  // Germany
  {
    slug: "tum", name: "Technical University of Munich (TUM)", countryCode: "DE", city: "Munich, Bavaria", type: "public", website: "https://www.tum.de/",
    tuitionNote: "Since winter semester 2024/25, TUM charges non-EU students €2,000-3,000 a semester for bachelor's and €4,000-6,000 for master's, depending on the programme. A few master's programmes remain tuition-free, so check the programme page.",
    tuitionSource: "https://expatrio.com/about-germany/technical-university-of-munich",
  },
  { slug: "rwth-aachen", name: "RWTH Aachen University", countryCode: "DE", city: "Aachen, North Rhine-Westphalia", type: "public", website: "https://www.rwth-aachen.de/", tuitionNote: "Public universities in North Rhine-Westphalia charge no tuition fees for non-EU students; you pay a semester contribution." },
  { slug: "tu-berlin", name: "Technische Universität Berlin", countryCode: "DE", city: "Berlin", type: "public", website: "https://www.tu.berlin/", tuitionNote: "Berlin's public universities charge no tuition fees for non-EU students; you pay a semester contribution." },
  {
    slug: "kit", name: "Karlsruhe Institute of Technology (KIT)", countryCode: "DE", city: "Karlsruhe, Baden-Württemberg", type: "public", website: "https://www.kit.edu/",
    tuitionNote: "Baden-Württemberg charges non-EU students €1,500 a semester (in place since winter 2017/18), plus the semester contribution.",
    tuitionSource: "https://www.studienstart.kit.edu/english/financing-part-time-job.php",
  },
  {
    slug: "stuttgart", name: "University of Stuttgart", countryCode: "DE", city: "Stuttgart, Baden-Württemberg", type: "public", website: "https://www.uni-stuttgart.de/",
    tuitionNote: "Baden-Württemberg charges non-EU students €1,500 a semester, plus the semester contribution.",
    tuitionSource: "https://www.student.uni-stuttgart.de/en/organizing-studies/formalities/tuition-and-fees/",
  },
  // Ireland
  { slug: "trinity-college-dublin", name: "Trinity College Dublin", countryCode: "IE", city: "Dublin", type: "public", website: "https://www.tcd.ie/" },
  { slug: "ucd", name: "University College Dublin", countryCode: "IE", city: "Dublin", type: "public", website: "https://www.ucd.ie/" },
  { slug: "galway", name: "University of Galway", countryCode: "IE", city: "Galway", type: "public", website: "https://www.universityofgalway.ie/" },
  // France
  { slug: "hec-paris", name: "HEC Paris", countryCode: "FR", city: "Jouy-en-Josas, near Paris", type: "private", website: "https://www.hec.edu/" },
  { slug: "essec", name: "ESSEC Business School", countryCode: "FR", city: "Cergy, near Paris", type: "private", website: "https://www.essec.edu/" },
  { slug: "sciences-po", name: "Sciences Po", countryCode: "FR", city: "Paris", type: "public", website: "https://www.sciencespo.fr/" },
  { slug: "paris-saclay", name: "Université Paris-Saclay", countryCode: "FR", city: "Paris-Saclay, south of Paris", type: "public", website: "https://www.universite-paris-saclay.fr/" },
];

/** Where to check that an institution is officially recognised, by country (plan section 11). */
export const RECOGNITION_CHECKS: Record<UniversityDef["countryCode"], { label: string; url: string }> = {
  US: { label: "Study in the States school search (SEVP-certified schools)", url: "https://studyinthestates.dhs.gov/school-search" },
  CA: { label: "Designated learning institutions list (IRCC)", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html" },
  UK: { label: "Register of licensed student sponsors (UK Home Office)", url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-students" },
  AU: { label: "CRICOS register of institutions and courses", url: "https://cricos.education.gov.au/" },
  DE: { label: "Hochschulkompass (German Rectors' Conference)", url: "https://www.hochschulkompass.de/" },
  IE: { label: "Education in Ireland (official portal)", url: "https://www.educationinireland.com/" },
  FR: { label: "Campus France", url: "https://www.campusfrance.org/en" },
};

export const RANKING_PUBLISHERS = [
  { label: "QS World University Rankings", url: "https://www.topuniversities.com/world-university-rankings" },
  { label: "Times Higher Education World University Rankings", url: "https://www.timeshighereducation.com/world-university-rankings" },
];

export function universityBySlug(slug: string): UniversityDef | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}
