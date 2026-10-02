/**
 * 8 country profiles - the 8 the source spec itself sourced real, dated
 * current-cycle data for (USA, Canada, UK, Australia, Germany, France,
 * Ireland, New Zealand). This is a NEW, additional data set alongside the
 * existing lib/data/studyAbroadData.ts (which powers the university
 * browser at /account/features/study-abroad, left unchanged) - these
 * country profiles focus on policy/cost/work-rights facts and a real
 * "what changed" feed, not university listings.
 *
 * Figures are typical ranges, explicitly approximate - mark them so in the
 * UI. Each `whatChanged` item is a real, dated, sourced policy note from
 * the spec itself, not invented.
 */

export interface WhatChangedItem {
  date: string; // ISO date, approximate to the month where the spec didn't give a day
  title: string;
  summary: string;
}

export interface CountryProfile {
  code: string;
  name: string;
  flag: string;
  currency: string;
  tuitionPerYearApprox: string;
  livingFundsNote: string;
  workWhileStudying: string;
  postStudyWork: string;
  mainIntakes: string;
  testsNeeded: string;
  settlementPathway: string;
  dependants: string;
  costOfLivingNote: string;
  safetyNote: string;
  officialLinks: { label: string; url: string }[];
  whatChanged: WhatChangedItem[];
}

export const STUDY_ABROAD_COUNTRIES: CountryProfile[] = [
  {
    code: "US", name: "United States", flag: "🇺🇸", currency: "USD",
    tuitionPerYearApprox: "US$25,000-60,000",
    livingFundsNote: "Shown on the I-20 by the university",
    workWhileStudying: "On-campus only, about 20 hrs/week in term",
    postStudyWork: "OPT 12 months, plus 24 more for STEM degrees",
    mainIntakes: "Fall (Aug-Sep), Spring (Jan)",
    testsNeeded: "IELTS/TOEFL/Duolingo; GRE/GMAT for many master's",
    settlementPathway: "H-1B work visa (lottery-based) after OPT, then employer-sponsored green card - long and uncertain.",
    dependants: "F-2 dependants generally cannot work while the primary visa holder studies.",
    costOfLivingNote: "Varies hugely by city - a Tier-1 city (NYC, SF, Boston) can cost 2x a smaller college town.",
    safetyNote: "Large, established Indian student communities at most major universities.",
    officialLinks: [{ label: "Study in the States (US govt)", url: "https://studyinthestates.dhs.gov/" }],
    whatChanged: [
      { date: "2025-09", title: "$100,000 fee on new H-1B petitions", summary: "Guidance says this does not apply to students changing status inside the US (F-1 to H-1B), but it raises employer costs and hiring caution." },
      { date: "2025-06", title: "F-1 visas to Indians fell 44% in H1 2025", summary: "A sharp cooling in visa issuance to Indian students compared to prior years." },
    ],
  },
  {
    code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD",
    tuitionPerYearApprox: "CAD 20,000-45,000",
    livingFundsNote: "CAD 22,895/year (single applicant)",
    workWhileStudying: "Limited off-campus hours per week in term - check the current cap before applying.",
    postStudyWork: "PGWP up to 3 years, with language and field rules",
    mainIntakes: "Sep, Jan, some May",
    testsNeeded: "IELTS/CELPIP/PTE; CLB 7 needed for PGWP (degree)",
    settlementPathway: "Express Entry (points-based permanent residence) - competitive, and has become more so as new-permit volumes collapsed in 2025.",
    dependants: "Spousal open work permits have been tightened - check current eligibility before counting on one.",
    costOfLivingNote: "Toronto and Vancouver are notably more expensive than other Canadian student cities.",
    safetyNote: "Very large Indian student population, especially in Ontario and British Columbia.",
    officialLinks: [{ label: "Immigration, Refugees and Citizenship Canada", url: "https://www.canada.ca/en/immigration-refugees-citizenship.html" }],
    whatChanged: [
      { date: "2026-01", title: "National cap of ~309,670 study permit applications for 2026", summary: "A continuation of Canada's multi-year effort to reduce international student volumes." },
      { date: "2025-01", title: "Provincial attestation letter dropped for some programmes", summary: "Master's and PhD students at public institutions no longer need one, though undergraduate programmes generally still do." },
      { date: "2025-01", title: "Language test now required for PGWP eligibility", summary: "CLB 7 (degree) or CLB 5 (diploma) language proof is now a PGWP requirement, not just an admission one." },
    ],
  },
  {
    code: "UK", name: "United Kingdom", flag: "🇬🇧", currency: "GBP",
    tuitionPerYearApprox: "£15,000-35,000 (most master's are 1 year)",
    livingFundsNote: "Set by UKVI per month of course, shown on the official UKVI financial-requirements page",
    workWhileStudying: "20 hrs/week in term for degree students",
    postStudyWork: "Graduate Route 2 years, falling to 18 months for those applying from 1 Jan 2027 (PhD stays at 3 years)",
    mainIntakes: "Sep, Jan",
    testsNeeded: "IELTS/PTE/TOEFL (UKVI-approved where needed)",
    settlementPathway: "Skilled Worker visa after Graduate Route, then settlement after 5 years on a qualifying visa.",
    dependants: "Dependant rules have tightened significantly for most taught master's courses in recent years - check your specific course's current eligibility.",
    costOfLivingNote: "London costs substantially more than other UK student cities (Manchester, Edinburgh, Birmingham).",
    safetyNote: "One of the largest Indian student populations of any country, strong community infrastructure.",
    officialLinks: [{ label: "UK Council for International Student Affairs (UKCISA)", url: "https://www.ukcisa.org.uk/" }],
    whatChanged: [
      { date: "2026-01", title: "Graduate Route post-study work cut to 18 months", summary: "For those applying from 1 January 2027; PhD graduates keep the full 3 years. A levy on international student fees has also been proposed." },
      { date: "2025-06", title: "98,015 visas granted to Indians up to June 2025", summary: "Rising demand, mostly for master's programmes." },
    ],
  },
  {
    code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD",
    tuitionPerYearApprox: "AUD 30,000-50,000",
    livingFundsNote: "AUD 29,710/year",
    workWhileStudying: "Limited hours per fortnight in term - check the current cap before applying.",
    postStudyWork: "485 visa: 2 years (bachelor's/master's), 3 years (research); maximum age 35",
    mainIntakes: "Feb, Jul",
    testsNeeded: "IELTS 6.0+ (6.5 for the 485 visa), PTE, TOEFL",
    settlementPathway: "Skilled migration points-based visas after the 485 - competitive and points-tested.",
    dependants: "Partner work rights depend on the specific visa subclass - verify current rules before relying on one.",
    costOfLivingNote: "Sydney and Melbourne are considerably pricier than other Australian student cities.",
    safetyNote: "Large, well-established Indian student community, especially in Sydney and Melbourne.",
    officialLinks: [{ label: "Study Australia (official)", url: "https://www.studyaustralia.gov.au/" }],
    whatChanged: [
      { date: "2026-01", title: "Student visa fee raised to AUD 2,000", summary: "A significant increase; processing is also now prioritised by each institution's enrollment-cap usage." },
      { date: "2025-06", title: "New enrolment starts down 8% in 2025", summary: "Despite total enrolled numbers staying around 139,720, new intake growth has slowed." },
    ],
  },
  {
    code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR",
    tuitionPerYearApprox: "Public: mostly no tuition, ~€150-400 semester fee; private €10,000-25,000",
    livingFundsNote: "€11,904/year blocked account (€992/month)",
    workWhileStudying: "140 full or 280 half days a year",
    postStudyWork: "18-month job-search permit after graduation",
    mainIntakes: "Oct (winter), Apr (summer)",
    testsNeeded: "APS certificate required for Indian applicants; IELTS/TOEFL or a German-language level for German-taught programmes",
    settlementPathway: "EU Blue Card for skilled roles after the job-search permit - one of the more accessible settlement routes in Europe.",
    dependants: "Spouses can generally accompany and work, subject to standard visa conditions.",
    costOfLivingNote: "Munich and Frankfurt cost noticeably more than smaller university towns.",
    safetyNote: "Growing Indian student population (more than doubled 2020-2024), strong engineering/tech community.",
    officialLinks: [{ label: "DAAD (German Academic Exchange Service)", url: "https://www.daad.in/" }],
    whatChanged: [
      { date: "2025-01", title: "Blocked account amount at €11,904/year", summary: "The current proof-of-funds requirement for a German student visa." },
    ],
  },
  {
    code: "FR", name: "France", flag: "🇫🇷", currency: "EUR",
    tuitionPerYearApprox: "Public universities: a few thousand euros for non-EU students; grandes écoles and business schools higher",
    livingFundsNote: "Set by Campus France",
    workWhileStudying: "Up to 964 hours a year",
    postStudyWork: "Post-study permit for master's graduates (check current duration)",
    mainIntakes: "Sep, some Jan",
    testsNeeded: "IELTS/TOEFL for English-taught programmes; French level for French-taught programmes",
    settlementPathway: "Talent passport and standard skilled-worker routes after the post-study permit.",
    dependants: "Standard family-visa rules apply; check current requirements with Campus France.",
    costOfLivingNote: "Paris costs considerably more than other French student cities.",
    safetyNote: "Smaller but fast-growing Indian student community (up 17% in 2024/25), with active government recruitment of Indian students.",
    officialLinks: [{ label: "Campus France", url: "https://www.indembassyparis.gov.in/" }],
    whatChanged: [
      { date: "2025-01", title: "Active recruitment of Indian students", summary: "France has set a target of 30,000 Indian students by 2030 and is expanding English-taught programmes to support it." },
    ],
  },
  {
    code: "IE", name: "Ireland", flag: "🇮🇪", currency: "EUR",
    tuitionPerYearApprox: "€12,000-30,000",
    livingFundsNote: "Set by Irish immigration",
    workWhileStudying: "20 hrs/week in term, 40 in holidays",
    postStudyWork: "Stay-back permission of up to 24 months for bachelor's, master's and PhD graduates",
    mainIntakes: "Sep, some Jan",
    testsNeeded: "IELTS/PTE/TOEFL/Duolingo",
    settlementPathway: "Critical Skills Employment Permit after stay-back, then long-term residency routes.",
    dependants: "Standard family-visa rules apply; check current requirements before relying on one.",
    costOfLivingNote: "Dublin costs noticeably more than other Irish student cities.",
    safetyNote: "Smaller but rapidly growing Indian student community (up ~50% to over 7,000 in 2023/24).",
    officialLinks: [{ label: "Education in Ireland (official)", url: "https://www.educationinireland.com/" }],
    whatChanged: [
      { date: "2024-01", title: "Stay-back permission up to 24 months", summary: "Applies to bachelor's, master's and PhD graduates alike - one of the more generous post-study windows in Europe." },
    ],
  },
  {
    code: "NZ", name: "New Zealand", flag: "🇳🇿", currency: "NZD",
    tuitionPerYearApprox: "NZD 25,000-45,000",
    livingFundsNote: "Set by Immigration New Zealand",
    workWhileStudying: "Limited hours per week - check the current cap before applying.",
    postStudyWork: "Post-study work up to 3 years, by qualification level",
    mainIntakes: "Feb, Jul",
    testsNeeded: "IELTS/PTE/TOEFL",
    settlementPathway: "Skilled migrant category after post-study work - points-based.",
    dependants: "Standard family-visa rules apply; check current requirements before relying on one.",
    costOfLivingNote: "Auckland costs more than other New Zealand student cities.",
    safetyNote: "Stable Indian student population (~12,000), smaller but well-established community.",
    officialLinks: [{ label: "Immigration New Zealand", url: "https://www.immigration.govt.nz/" }],
    whatChanged: [],
  },
];

export function countryByCode(code: string): CountryProfile | undefined {
  return STUDY_ABROAD_COUNTRIES.find((c) => c.code === code);
}
