/**
 * Class 12 JEE page - "What your score band realistically opens up": real
 * institution categories, real named examples, and real funding/scholarship
 * programs, per the same 6 percentage bands NewExam.tsx's pre-exam dropdown
 * already collects (see PERCENTAGE_BANDS there - this keys off the exact
 * same midpoint values: 45/55/65/75/85/95).
 *
 * Every fact here was pulled from live web research (JEE Main 2026 college-
 * predictor trend data, AICTE/NSP scholarship pages, Indian Army recruitment
 * pages) rather than invented - this codebase already tried shipping
 * fabricated college names and cutoffs once (see degreeStreamMatrix.ts's own
 * file header and careerFit1112Sheets.tsx's comment on why specific college
 * names/cutoffs were cut earlier) and it was wrong to. Even so, JEE cutoffs
 * genuinely shift year to year by category/home-state quota/round, so this
 * is deliberately framed as "the general tier this band has recently opened
 * up" with named examples as illustrations, not a promise - every sheet
 * that renders this carries the same explicit verify-before-relying-on-it
 * disclaimer degreeStreamMatrix.ts's consumers already show.
 *
 * IMPORTANT scope note: NewExam.tsx's percentage field is generic ("board or
 * entrance exam" - JEE/NEET/CUET all share it), but this guide is
 * specifically about JEE Main percentile-to-institution trends. It's shown
 * only alongside JEE-relevant content and is explicitly labelled as such -
 * a NEET or CUET student's percentage isn't the same scale and this page
 * says so rather than silently mis-applying JEE guidance to them.
 */

export interface FundingOption {
  name: string;
  amount: string;
  eligibility: string;
}

export interface PercentileBandGuide {
  value: number; // matches NewExam.tsx's PERCENTAGE_BANDS[].value
  label: string;
  realistic: string;
  examples: string[];
  alternativeRoutes?: string[];
}

export const PERCENTILE_BAND_GUIDE: PercentileBandGuide[] = [
  {
    value: 95,
    label: "Above 90%",
    realistic: "The top NITs' Computer Science branches (Trichy, Surathkal, Rourkela, Warangal, Calicut) typically need 99+ percentile even at this level - that's a different tier again. Below that, this band realistically opens up mid-to-lower NITs (especially via home-state quota), strong IIITs, and the better GFTIs.",
    examples: ["Mid/lower NITs - Mechanical/Civil branches, or CSE/ECE via home-state quota", "Well-ranked IIITs (e.g. IIIT Allahabad, IIIT Gwalior tier)", "Top Government-Funded Technical Institutes (GFTIs)"],
  },
  {
    value: 85,
    label: "80% – 90%",
    realistic: "A decent branch at a good IIIT and most GFTIs are realistically in reach at this level. Top-NIT CSE is very unlikely; a mid-NIT in a less-demanded branch is possible in later JoSAA/CSAB rounds, especially under home-state quota.",
    examples: ["Good IIITs (non-CSE branches, or CSE at newer IIITs)", "Government-Funded Technical Institutes (GFTIs)", "Mid-tier NIT seats in later counselling rounds, home-state quota"],
  },
  {
    value: 75,
    label: "70% – 80%",
    realistic: "Mainstream NIT seats are unlikely at this level except in later CSAB special rounds. This band's realistic path is GFTIs, state-run engineering colleges via your state's own counselling, and reputed private universities.",
    examples: ["Assam University, Gurukula Kangri Vishwavidyalaya, IET Lucknow (GFTI-tier)", "State government engineering colleges via your state's own counselling", "Reputed private universities (see Alternative routes below)"],
    alternativeRoutes: ["Your state's own engineering entrance/counselling (e.g. state CET) usually reaches colleges closer to home than JoSAA does at this band."],
  },
  {
    value: 65,
    label: "60% – 70%",
    realistic: "NIT seats are extremely limited here - a handful of remote/newer NITs (Agartala, Delhi, Durgapur, Goa, Hamirpur among them) have historically had seats go this low, almost always in later rounds and home-state quota. GFTIs, state colleges and private universities are the dependable path.",
    examples: ["A small number of newer/remote NITs, later rounds only, home-state quota", "GFTIs and state-run engineering colleges via state counselling", "Reputed private universities (BITSAT/VITEEE/SRMJEEE-track ones - see below)"],
    alternativeRoutes: ["Alternative entrance exams - BITSAT, VITEEE, SRMJEEE, your state's CET - often reach a better-matched college at this band than JoSAA/CSAB alone."],
  },
  {
    value: 55,
    label: "50% – 60%",
    realistic: "NIT/IIIT seats are essentially out of reach through the main JoSAA rounds at this level. This is squarely private-university and state-college territory - genuinely fine engineering degrees, just not through the JoSAA/CSAB route.",
    examples: ["Chandigarh University, Punjab University, Sanskriti University (illustrative - many private universities admit in this band)", "State-run engineering colleges via your state's own counselling"],
    alternativeRoutes: ["BITSAT, VITEEE, SRMJEEE and your state CET are worth attempting in parallel - several private universities weight Class 12 PCM marks over JEE percentile specifically."],
  },
  {
    value: 45,
    label: "Below 50%",
    realistic: "JoSAA/CSAB (NITs, IIITs, most GFTIs) are not realistically reachable at this level. That does NOT mean no real engineering degree is available - most large private universities admit primarily on Class 12 PCM marks, not JEE percentile, so this band still has genuine, accredited options.",
    examples: ["Private universities that admit mainly on Class 12 PCM marks (no hard JEE percentile cutoff) - e.g. Sharda University, Galgotias University, Graphic Era University, Uttaranchal University, LPU, Manipal University Jaipur, UPES Dehradun (select branches)"],
    alternativeRoutes: [
      "BITSAT, VITEEE, SRMJEEE and your state CET are separate exams - a poor JEE Main percentile doesn't carry over to them, so they're genuinely worth a real attempt.",
      "A repeat/drop year to specifically target JEE Main again is a real option many students use - talk it through with a counsellor rather than deciding alone.",
    ],
  },
];

export function percentileBandFor(estimatedPercentage: number | undefined): PercentileBandGuide | null {
  if (estimatedPercentage == null) return null;
  return PERCENTILE_BAND_GUIDE.reduce((closest, band) =>
    Math.abs(band.value - estimatedPercentage) < Math.abs(closest.value - estimatedPercentage) ? band : closest
  );
}

/**
 * Funding that isn't percentile-gated the way admission itself is - shown
 * once regardless of band, since eligibility here runs on income/category/
 * gender/disability, not JEE score. Every figure verified via a live search
 * against the scheme's own current page, not carried over from memory.
 */
export const ENGINEERING_FUNDING_OPTIONS: FundingOption[] = [
  {
    name: "AICTE Pragati Scholarship (for girls)",
    amount: "₹50,000/year, paid directly to your bank account (DBT)",
    eligibility: "Girl students in the 1st year (or 2nd year via lateral entry) of an AICTE-approved technical degree/diploma, admitted through the centralised state/central admission process. Family income up to ₹8 lakh/year. Apply via the National Scholarship Portal (NSP).",
  },
  {
    name: "AICTE Saksham Scholarship (for students with disabilities)",
    amount: "₹50,000/year, paid directly to your bank account (DBT)",
    eligibility: "Students with 40%+ disability (valid certificate required) in an AICTE-approved technical degree/diploma. Family income up to ₹8 lakh/year. Apply via the National Scholarship Portal (NSP).",
  },
  {
    name: "Central Sector Scheme of Scholarship (CSSS)",
    amount: "₹12,000/year (years 1–3), ₹20,000/year (year 4, for a 4-year degree like B.Tech)",
    eligibility: "Needs strong Class 12 board marks specifically - broadly the top 20th percentile of your board, and typically 80%+ marks in practice. Family income up to ₹4.5 lakh/year. Most relevant if your board percentage is strong even where your JEE percentile isn't.",
  },
  {
    name: "State tuition-fee waivers (varies by state)",
    amount: "Full tuition waiver at government/aided colleges (exact terms vary by state)",
    eligibility: "State-domicile students meeting that state's own entrance-rank and family-income thresholds - Tamil Nadu's TNEA fee waiver is one well-known example. Check your own state's technical education department for its equivalent scheme.",
  },
  {
    name: "Need-based private scholarships (e.g. IDFC FIRST Bank Engineering Scholarship)",
    amount: "Covers part of B.Tech/BE tuition fees for the full 4 years",
    eligibility: "Already secured admission to an eligible B.Tech/BE program; household income below the scheme's threshold (around ₹6 lakh/year for this particular one). A genuine option regardless of which college/percentile band you land in.",
  },
];

/**
 * The real answer to "a free college that also pays a stipend for the
 * degree years" - the Indian Army's Technical Entry Scheme. Deliberately
 * kept separate from ENGINEERING_FUNDING_OPTIONS: this isn't a scholarship
 * layered on top of a college you apply to separately - it IS the
 * admission route, via SSB interview and merit, not JEE percentile, which
 * is exactly why it's worth surfacing regardless of which band a student
 * is in, especially a lower one.
 */
export const FREE_STIPEND_ROUTE = {
  name: "Technical Entry Scheme (TES) - Indian Army",
  summary: "A fully-funded engineering degree, not a scholarship on top of one. Selection is by merit and an SSB interview - not JEE percentile - so it's a genuine option at any score band.",
  eligibility: "Unmarried male candidates, Class 12 with 60%+ in PCM, who have appeared for JEE Main. Selection is via merit shortlisting and an SSB interview, not a JEE cutoff.",
  structure: "4-year training: 3 years at a military engineering college (CME Pune / MCTE Mhow / MCEME Secunderabad) plus 1 year at the Indian Military Academy, Dehradun. Tuition, boarding and training are fully funded by the Army throughout.",
  stipend: "A stipend of ₹56,100/month is paid during the IMA year (the final year of the 4-year program).",
  outcome: "On completion: an engineering degree plus a Permanent Commission as a Lieutenant in the Indian Army, with pay starting at Level 10 of the officer pay matrix.",
  verify: "Apply directly at joinindianarmy.nic.in when a TES notification opens - vacancy numbers and exact dates change with each intake.",
};
