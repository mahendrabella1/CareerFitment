/**
 * 10 course pages, per the spec's own Phase 1 list (section 13: "starting
 * with CS and data science, business analytics, MBA, engineering and MBBS
 * abroad"). Each note is honest about real risks (crowded markets,
 * licensing hurdles), matching the spec's own instruction.
 */

export interface CourseDef {
  slug: string;
  name: string;
  oftenChosenCountries: string[]; // country codes from countries.ts
  typicalLength: string;
  whatToKnow: string;
  studyInIndiaInstead: string;
}

export const STUDY_ABROAD_COURSES: CourseDef[] = [
  {
    slug: "ms-computer-science-data-science-ai",
    name: "MS Computer Science, Data Science, AI",
    oftenChosenCountries: ["US", "CA", "DE", "UK", "IE"],
    typicalLength: "1-2 years",
    whatToKnow: "US STEM degrees give longer OPT (up to 3 years); strong demand but competitive entry-level markets. Internships and real projects matter more than the university's name for your first job.",
    studyInIndiaInstead: "IITs/IIITs' M.Tech CSE, IISc, and several strong private-university master's programmes offer comparable depth at a fraction of the cost.",
  },
  {
    slug: "business-analytics-information-systems",
    name: "Business Analytics, Information Systems",
    oftenChosenCountries: ["US", "UK", "IE", "AU"],
    typicalLength: "1-2 years",
    whatToKnow: "A popular and increasingly crowded field - choose programmes with real industry projects and published placement data, not just a brand name.",
    studyInIndiaInstead: "ISB, IIMs and several strong private universities now run dedicated business analytics master's programmes.",
  },
  {
    slug: "mba",
    name: "MBA",
    oftenChosenCountries: ["US", "UK", "CA", "FR"],
    typicalLength: "1-2 years",
    whatToKnow: "Usually needs 2-5 years' work experience. Costs are high, so ROI depends heavily on the specific school's placement record - run the ROI calculator before committing.",
    studyInIndiaInstead: "The IIMs, ISB and other top Indian B-schools offer a materially lower total cost with strong domestic placement.",
  },
  {
    slug: "engineering-mechanical-electrical-civil-automotive",
    name: "Engineering (Mechanical, Electrical, Civil, Automotive)",
    oftenChosenCountries: ["DE", "US", "CA", "AU"],
    typicalLength: "2 years (master's)",
    whatToKnow: "Germany is strong and low-cost but needs German-language proficiency for many jobs. Licensing/certification rules apply for some engineering roles, especially civil.",
    studyInIndiaInstead: "IITs/NITs' M.Tech programmes are strong and well-recognised by Indian and many global employers.",
  },
  {
    slug: "finance-accounting-economics",
    name: "Finance, Accounting, Economics",
    oftenChosenCountries: ["UK", "US", "CA", "AU"],
    typicalLength: "1-2 years",
    whatToKnow: "Professional certifications (CFA, ACCA, CPA) often matter as much as the degree itself for hiring and progression.",
    studyInIndiaInstead: "IIMs, ISB and top commerce programmes (SRCC, Narsee Monjee) are strong, lower-cost alternatives.",
  },
  {
    slug: "public-health-health-administration",
    name: "Public Health, Health Administration",
    oftenChosenCountries: ["US", "UK", "AU", "CA"],
    typicalLength: "1-2 years",
    whatToKnow: "Best suited to those with an existing medical, nursing or life-sciences background rather than as a first professional degree.",
    studyInIndiaInstead: "AIIMS and several central universities run strong MPH programmes at a much lower cost.",
  },
  {
    slug: "nursing-and-allied-health",
    name: "Nursing and Allied Health",
    oftenChosenCountries: ["AU", "CA", "UK", "IE"],
    typicalLength: "2-4 years",
    whatToKnow: "Clear long-term demand, but registration with the destination country's own nursing/allied-health board is required before you can practise - factor that timeline and cost in separately.",
    studyInIndiaInstead: "Indian nursing colleges are far cheaper, though starting salaries abroad are typically much higher once registered.",
  },
  {
    slug: "design-architecture-media",
    name: "Design, Architecture, Media",
    oftenChosenCountries: ["UK", "FR", "US"],
    typicalLength: "1-2 years",
    whatToKnow: "A strong portfolio matters far more than test scores for admission in this field.",
    studyInIndiaInstead: "NID, CEPT and several strong private design/architecture schools are well-regarded with a much lower total cost.",
  },
  {
    slug: "hospitality-and-culinary",
    name: "Hospitality and Culinary",
    oftenChosenCountries: ["AU", "CA"],
    typicalLength: "1-3 years",
    whatToKnow: "Strong internship-linked programmes exist, especially in Switzerland (not in this build's 8 profiled countries yet) - check total fees carefully, as marketing often understates them.",
    studyInIndiaInstead: "IHM (Institutes of Hotel Management) and other established Indian hospitality schools offer solid, much lower-cost training.",
  },
  {
    slug: "mbbs-abroad",
    name: "MBBS abroad",
    oftenChosenCountries: [],
    typicalLength: "5-6 years",
    whatToKnow: "Graduates must meet India's National Medical Commission (NMC) rules to practise in India - see the MBBS/NMC checklist before choosing a programme. Common destinations (Russia, Georgia, Kazakhstan, Uzbekistan, Philippines and others) aren't in this build's 8 profiled countries, since the spec's sourced policy data covers a different set of destinations.",
    studyInIndiaInstead: "NEET-UG-based admission to an Indian MBBS seat avoids the NMC equivalence process entirely - factor the real odds of that route in before deciding to go abroad instead.",
  },
];

export function courseBySlug(slug: string): CourseDef | undefined {
  return STUDY_ABROAD_COURSES.find((c) => c.slug === slug);
}
