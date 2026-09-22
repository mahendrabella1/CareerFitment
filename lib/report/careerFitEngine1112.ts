/**
 * Class 11-12 Career Fitment / Suitability / Selector matching engine.
 *
 * Implements the mapping kit's own "Worked_Example" formula - a weighted
 * overlap between the student's normalised profile and each career's
 * profile, `Match% = ROUND(SUMPRODUCT(student, career) / SUM(career) * 100, 1)`
 * - adapted to what CAREERS_1112 actually stores (a 3-letter RIASEC code,
 * top-2 MI domains and one key aptitude, not full 6/8/6-value vectors like
 * the kit's own worked example assumes). Position in the RIASEC code and
 * MI1/MI2 ordering carries decreasing weight (most-to-least dominant, per
 * the kit's own Careers-sheet note), and the weight split across the three
 * signal groups (RIASEC / Aptitude / MI) mirrors the existing domainFit()
 * pattern in lib/report/knowledge.ts and calculateDomainAffinities() in
 * scoring11_12.ts (42/26/22 interest/aptitude/MI, with the 10% normally
 * spent on values folded into RIASEC here since Career1112's `values` field
 * is a single coarse tag, not a scoreable vector) - so this ranks careers
 * the same conceptual way every other class's domain ranking does, not a
 * fourth, unrelated formula.
 */
import type { PsychometricProfile } from "@/lib/newAssessment/scoring11_12";
import {
  CAREERS_1112, DOMAINS_1112, ROADMAP_MATRIX, STREAM_KEY_1112, roadmapFor,
  type Career1112, type RiasecLetter, type MICode, type AptCode, type StreamKey1112, type RoadmapEntry, type StandardCluster,
} from "@/lib/report/careerfit1112";

/**
 * Fitment/Suitability's interest score (scoreCareerAxes1112 below) is driven
 * ENTIRELY by RIASEC/MI/Aptitude - Subject Fit (Q64/65: enjoyed/hardest
 * subject) and Career Selector (Q78: the career the student actually typed)
 * never touch it. For a profile with one heavily dominant RIASEC letter,
 * that let unrelated-feeling clusters (Agricultural Economist, Constitutional
 * Lawyer) out-rank the student's own declared interest, purely because
 * "Investigative" roles exist in every field, not just the one the student
 * said they care about. RankingContext1112 lets a caller nudge the ranking
 * back toward what the student actually told the system - the two signals
 * this file otherwise never reads - without discarding RIASEC, which still
 * decides everything else.
 */
export interface RankingContext1112 {
  /** The exact desired-career free text from Career Selector (Q78) - the whole cluster it resolves to gets a ranking boost. */
  desiredCareerText?: string;
  /** Subject Fit Q64 - "Which subject do you enjoy the most?" */
  enjoyedSubject?: string;
  /** Subject Fit Q65 - "Which subject do you find most difficult?" */
  difficultSubject?: string;
  /** Subject Fit Q63 - "Which subjects are you currently studying?" (multi-select). A weaker signal than enjoyedSubject - it's what the stream enrolled them in, not a stated preference - so every matched cluster gets a lighter boost than SUBJECT_ENJOYED_BOOST, not the same one twice. */
  currentSubjects?: string[];
  /** Career Fit Q71 - "Which areas are you currently considering?" (up to 3 field names, e.g. "AI / Data Science", "Law"). A direct field-preference signal, same spirit as desiredCareerText but broader/less certain, so weighted lighter. */
  consideringAreas?: string[];
  /** Career Selector Q79 - "What are your other top career choices?" (up to 3 career names). Resolved the same way as desiredCareerText, weighted lighter since these are secondary, not the primary pick. */
  alternativeCareerTexts?: string[];
  /** Career Selector Q80 - "Which career areas would you NOT want to pursue?" (up to 3 career names). The question's own copy says "useful for elimination" - these specific careers are removed from ranking entirely, not just discounted. */
  excludedCareerTexts?: string[];
  /** Career Fit Q77 - "What kind of future pathway interests you most?" 4 of
   *  its 5 answers (Professional/Technical, Corporate & Business, Public
   *  Service & Government, Research & Academia) name specific fields and get
   *  a boost via PATHWAY_TYPE_CLUSTER_AFFINITY; "Exploratory" intentionally
   *  maps to nothing, same as an unlisted subject/field elsewhere in this file. */
  pathwayType?: string;
}

// Grounded in what each subject actually leads into, not a guess - kept
// small (1-3 clusters, the subject's real core use) so this nudges ranking
// rather than reshuffling it. "Other" and any unlisted answer intentionally
// map to nothing, so a stray/free-text value never fires a wrong adjustment.
const SUBJECT_CLUSTER_AFFINITY: Record<string, StandardCluster[]> = {
  "Physics": ["STEM"],
  "Chemistry": ["STEM", "Health Science"],
  "Mathematics": ["STEM", "Information Technology", "Finance"],
  "Biology": ["Health Science", "Agriculture, Food & Natural Resources"],
  "Computer Science / IP / IT": ["Information Technology"],
  "Accountancy": ["Finance", "Business Management & Administration"],
  "Business Studies": ["Business Management & Administration", "Marketing"],
  "Economics": ["Finance", "Government & Public Administration"],
  "History": ["Education & Training", "Law, Public Safety, Corrections & Security"],
  "Political Science": ["Government & Public Administration", "Law, Public Safety, Corrections & Security"],
  "Geography": ["Agriculture, Food & Natural Resources", "Architecture & Construction"],
  "Psychology": ["Human Services", "Education & Training"],
  "Sociology": ["Human Services", "Education & Training"],
  "Languages (English/Hindi/Regional)": ["Arts, A/V Technology & Communications", "Education & Training"],
};

// Career Fit Q71's own 24 field options, mapped to the clusters they
// actually lead into - same grounding standard as SUBJECT_CLUSTER_AFFINITY.
// "Other" maps to nothing on purpose.
const FIELD_CLUSTER_AFFINITY: Record<string, StandardCluster[]> = {
  "Engineering": ["STEM", "Manufacturing"],
  "Computer Science / IT": ["Information Technology"],
  "AI / Data Science": ["Information Technology", "STEM"],
  "Medicine": ["Health Science"],
  "Healthcare": ["Health Science"],
  "Biotechnology / Life Sciences": ["STEM", "Health Science"],
  "Pure Science": ["STEM"],
  "Mathematics / Statistics": ["STEM", "Finance"],
  "Commerce / Accounting": ["Finance", "Business Management & Administration"],
  "Finance / Investment": ["Finance"],
  "Economics": ["Finance", "Government & Public Administration"],
  "Business / Management": ["Business Management & Administration"],
  "Entrepreneurship": ["Business Management & Administration", "Marketing"],
  "Law": ["Law, Public Safety, Corrections & Security"],
  "Psychology": ["Human Services", "Education & Training"],
  "Social Sciences": ["Human Services", "Government & Public Administration"],
  "Humanities": ["Education & Training", "Arts, A/V Technology & Communications"],
  "Design": ["Arts, A/V Technology & Communications"],
  "Architecture": ["Architecture & Construction"],
  "Media / Communication": ["Arts, A/V Technology & Communications", "Marketing"],
  "Government / Public Service": ["Government & Public Administration"],
  "Defence": ["Government & Public Administration", "Transportation, Distribution & Logistics"],
  "Research": ["STEM"],
};

// Career Fit Q77's answers that actually name a field, mapped to the
// clusters they lead into - "Exploratory" (a flexible degree or still
// deciding) is deliberately absent, same as an unmapped "Other" elsewhere.
const PATHWAY_TYPE_CLUSTER_AFFINITY: Record<string, StandardCluster[]> = {
  "Professional / Technical: Direct specialization (e.g., Medicine, Law, Tech, CA).": ["Health Science", "Information Technology", "Law, Public Safety, Corrections & Security", "Finance"],
  "Corporate & Business: Working in companies or starting a business.": ["Business Management & Administration", "Finance", "Marketing"],
  "Public Service & Government: Civil services, defense, or government careers.": ["Government & Public Administration"],
  "Research & Academia: Scientific research, higher studies, or teaching.": ["STEM", "Education & Training"],
};

const DESIRED_CLUSTER_BOOST = 12;
const CONSIDERING_AREA_BOOST = 8;
const ALTERNATIVE_CAREER_BOOST = 5;
const PATHWAY_TYPE_BOOST = 6;
const SUBJECT_ENJOYED_BOOST = 6;
const SUBJECT_DIFFICULT_DISCOUNT = 6;
// Enrollment, not preference - a student takes 5-6 subjects because the
// stream bundled them, not because each one signals interest the way
// "the subject you enjoy most" does. Kept below SUBJECT_ENJOYED_BOOST so a
// cluster the student is merely studying never outweighs one they said they
// actually enjoy.
const CURRENT_SUBJECT_BOOST = 3;

interface ResolvedAdjustments1112 {
  desiredCluster: StandardCluster | null;
  consideringClusters: StandardCluster[];
  alternativeClusters: StandardCluster[];
  enjoyedClusters: StandardCluster[];
  difficultClusters: StandardCluster[];
  currentSubjectClusters: StandardCluster[];
  pathwayClusters: StandardCluster[];
  excludedCareerIds: Set<number>;
}
function resolveRankingAdjustments1112(ctx?: RankingContext1112): ResolvedAdjustments1112 {
  const desiredCluster = ctx?.desiredCareerText ? findCareer1112(ctx.desiredCareerText)?.cluster ?? null : null;
  // Deduped so a cluster hit by two of the up-to-3 selected areas/choices
  // still only gets the boost once - this nudges ranking, it doesn't let a
  // student's multi-select stack the same lever repeatedly.
  const consideringClusters = Array.from(new Set((ctx?.consideringAreas ?? []).flatMap((a) => FIELD_CLUSTER_AFFINITY[a] ?? [])));
  const alternativeClusters = Array.from(new Set((ctx?.alternativeCareerTexts ?? []).map((t) => findCareer1112(t)?.cluster).filter((c): c is StandardCluster => Boolean(c))));
  const enjoyedClusters = ctx?.enjoyedSubject ? SUBJECT_CLUSTER_AFFINITY[ctx.enjoyedSubject] ?? [] : [];
  const difficultClusters = ctx?.difficultSubject ? SUBJECT_CLUSTER_AFFINITY[ctx.difficultSubject] ?? [] : [];
  const currentSubjectClusters = Array.from(new Set((ctx?.currentSubjects ?? []).flatMap((s) => SUBJECT_CLUSTER_AFFINITY[s] ?? [])));
  const pathwayClusters = ctx?.pathwayType ? PATHWAY_TYPE_CLUSTER_AFFINITY[ctx.pathwayType] ?? [] : [];
  const excludedCareerIds = new Set((ctx?.excludedCareerTexts ?? []).map((t) => findCareer1112(t)?.id).filter((id): id is number => id != null));
  return { desiredCluster, consideringClusters, alternativeClusters, enjoyedClusters, difficultClusters, currentSubjectClusters, pathwayClusters, excludedCareerIds };
}

/** The net interest/score delta ranking should apply for one career's cluster - same sign and size used for both, so a boosted career's verdict and its domain ranking never disagree about which way it moved. */
function clusterAdjustment1112(cluster: StandardCluster, adj: ResolvedAdjustments1112): number {
  let delta = 0;
  if (adj.desiredCluster && cluster === adj.desiredCluster) delta += DESIRED_CLUSTER_BOOST;
  if (adj.consideringClusters.includes(cluster)) delta += CONSIDERING_AREA_BOOST;
  if (adj.alternativeClusters.includes(cluster)) delta += ALTERNATIVE_CAREER_BOOST;
  if (adj.enjoyedClusters.includes(cluster)) delta += SUBJECT_ENJOYED_BOOST;
  if (adj.difficultClusters.includes(cluster)) delta -= SUBJECT_DIFFICULT_DISCOUNT;
  if (adj.currentSubjectClusters.includes(cluster)) delta += CURRENT_SUBJECT_BOOST;
  if (adj.pathwayClusters.includes(cluster)) delta += PATHWAY_TYPE_BOOST;
  return delta;
}

const RIASEC_WEIGHTS = [1, 0.6, 0.3]; // 1st/2nd/3rd letter of a career's code
const MI_WEIGHTS = [1, 0.6]; // mi1/mi2
const APT_LEVEL_WEIGHT: Record<string, number> = { "Low-Medium": 0.55, Medium: 0.7, "Medium-High": 0.85, High: 1 };

// lib/newAssessment/*Scoring.ts's own canonical 8 MI domain names (shared
// across every class's strengths scoring) - mapped to the kit's MI codes.
const MI_NAME_TO_CODE: Record<string, MICode> = {
  Linguistic: "MI_LINGUISTIC",
  "Logical-Mathematical": "MI_ANALYTICAL",
  Spatial: "MI_VISUAL",
  Interpersonal: "MI_INTERPERSONAL",
  Intrapersonal: "MI_INTRAPERSONAL",
  Naturalistic: "MI_NATURALISTIC",
  Musical: "MI_AUDITORY",
  "Bodily-Kinesthetic": "MI_KINESTHETIC",
};

// Strengths (Intellectual & Analytical, Creative & Innovative, Strategic &
// Futuristic, Execution & Achievement, Influence & Leadership, Relationship
// & Adaptability - scoring11_12.ts's scoreStrengthAreas) has no per-career
// tag the way RIASEC/MI/aptitude do - tagging all 332 CAREERS_1112 entries
// individually would be a large, error-prone authoring effort for a 6-value
// scale. Tagging at the CLUSTER level instead (every career in a cluster
// inherits its cluster's own 2 dominant strengths, primary/secondary like
// MI's mi1/mi2) is coarser but still a real, defensible signal - grounded in
// what that cluster's work actually demands, not a guess. Every one of the
// 16 clusters gets exactly 2, so this can reuse the same primary/secondary
// weighting MI already uses.
const CLUSTER_STRENGTH_AFFINITY: Record<StandardCluster, [string, string]> = {
  "STEM": ["Intellectual & Analytical", "Strategic & Futuristic"],
  "Information Technology": ["Intellectual & Analytical", "Execution & Achievement"],
  "Health Science": ["Intellectual & Analytical", "Relationship & Adaptability"],
  "Finance": ["Intellectual & Analytical", "Execution & Achievement"],
  "Business Management & Administration": ["Influence & Leadership", "Strategic & Futuristic"],
  "Law, Public Safety, Corrections & Security": ["Intellectual & Analytical", "Influence & Leadership"],
  "Human Services": ["Relationship & Adaptability", "Influence & Leadership"],
  "Arts, A/V Technology & Communications": ["Creative & Innovative", "Relationship & Adaptability"],
  "Architecture & Construction": ["Creative & Innovative", "Execution & Achievement"],
  "Government & Public Administration": ["Influence & Leadership", "Strategic & Futuristic"],
  "Hospitality & Tourism": ["Relationship & Adaptability", "Influence & Leadership"],
  "Agriculture, Food & Natural Resources": ["Intellectual & Analytical", "Execution & Achievement"],
  "Education & Training": ["Relationship & Adaptability", "Influence & Leadership"],
  "Marketing": ["Creative & Innovative", "Influence & Leadership"],
  "Manufacturing": ["Execution & Achievement", "Intellectual & Analytical"],
  "Transportation, Distribution & Logistics": ["Execution & Achievement", "Strategic & Futuristic"],
};
const STRENGTH_WEIGHTS = [1, 0.6]; // primary/secondary, same shape as MI_WEIGHTS

export interface StudentVector1112 {
  riasec: Partial<Record<RiasecLetter, number>>; // 0-1
  mi: Partial<Record<MICode, number>>; // 0-1
  apt: Partial<Record<AptCode, number>>; // 0-1
  strength: Partial<Record<string, number>>; // 0-1, keyed by the 6 Strength domain names
}

/** Normalises a Class11ScoreOutput's layer1 into the 0-1 vectors CAREERS_1112 is scored against. */
export function buildStudentVector1112(layer1: PsychometricProfile): StudentVector1112 {
  const riasec: Partial<Record<RiasecLetter, number>> = {};
  for (const r of layer1.riasec) {
    const letter = r.code as RiasecLetter;
    riasec[letter] = (r.percentile ?? r.score ?? 0) / 100;
  }

  // multipleIntelligence, not strengthDomains - the 8 Gardner MI domains
  // MI_NAME_TO_CODE expects (Linguistic, Logical-Mathematical, ...) live
  // there. strengthDomains now holds the real, separate Strengths measure
  // (Intellectual & Analytical, Creative & Innovative, ...) since that got
  // split out from Multiple Intelligence - reading it here meant every
  // MI_NAME_TO_CODE lookup returned undefined, so `mi` came back completely
  // empty for every Class 11-12 student. scoreCareer1112 below silently
  // drops any signal with no matching vector entry rather than erroring, so
  // this didn't crash - it just quietly removed MI's entire 22% weight from
  // every career's match score, which is exactly the kind of thing that
  // shows up as "the recommendations got worse" with no visible error.
  const mi: Partial<Record<MICode, number>> = {};
  for (const d of layer1.multipleIntelligence) {
    const code = MI_NAME_TO_CODE[d.domain];
    if (code) mi[code] = Math.max(0, Math.min(1, d.score / 5));
  }

  const ap = layer1.aptitude;
  const apt: Partial<Record<AptCode, number>> = {
    APT_NUMERICAL: ap.numerical.score / 100,
    APT_LOGICAL: ap.logical.score / 100,
    APT_VERBAL: ap.verbal.score / 100,
    APT_ABSTRACT: ap.abstractPattern.score / 100,
    APT_SPATIAL: ap.spatial.score / 100,
    APT_DATA: ap.dataInterpretation.score / 100,
  };

  // strengthDomains, not multipleIntelligence - the real 6-parameter
  // Strengths measure (Intellectual & Analytical, Creative & Innovative,
  // ...) lives there now.
  const strength: Partial<Record<string, number>> = {};
  for (const d of layer1.strengthDomains) {
    strength[d.domain] = Math.max(0, Math.min(1, d.score / 5));
  }

  return { riasec, mi, apt, strength };
}

// RIASEC stays at its original 0.52 - the design already treats it as the
// single most reliable "which field" signal (see scoreCareerAxes1112's own
// comment below) and nothing here argues for diluting that. MI (0.22) and
// Aptitude (0.26) are trimmed slightly to make room for Strengths (0.11) -
// the same 22:26 ratio between them, just rescaled so the four weights
// still sum to 1: 0.52 + 0.17 + 0.20 + 0.11 = 1.00.
const RIASEC_SHARE = 0.52, MI_SHARE_TOTAL = 0.17, APT_SHARE_TOTAL = 0.20, STRENGTH_SHARE_TOTAL = 0.11;

/** 0-100 weighted-overlap match between a student vector and one career. */
export function scoreCareer1112(vector: StudentVector1112, career: Career1112): number {
  let num = 0;
  let den = 0;

  const letters = career.riasec.split("") as RiasecLetter[];
  letters.forEach((letter, i) => {
    const w = (RIASEC_WEIGHTS[i] ?? 0) * RIASEC_SHARE;
    const s = vector.riasec[letter];
    if (s != null) { num += w * s; den += w; }
  });

  [career.mi1, career.mi2].forEach((code, i) => {
    const w = (MI_WEIGHTS[i] ?? 0) * MI_SHARE_TOTAL;
    const s = vector.mi[code];
    if (s != null) { num += w * s; den += w; }
  });

  const aptW = (APT_LEVEL_WEIGHT[career.aptitudeLevel] ?? 0.7) * APT_SHARE_TOTAL;
  const aptS = vector.apt[career.keyAptitude];
  if (aptS != null) { num += aptW * aptS; den += aptW; }

  const [str1, str2] = CLUSTER_STRENGTH_AFFINITY[career.cluster] ?? [];
  [str1, str2].forEach((name, i) => {
    if (!name) return;
    const w = (STRENGTH_WEIGHTS[i] ?? 0) * STRENGTH_SHARE_TOTAL;
    const s = vector.strength[name];
    if (s != null) { num += w * s; den += w; }
  });

  return den > 0 ? Math.round((num / den) * 100 * 10) / 10 : 0;
}

/**
 * The same signal scoreCareer1112 blends into one number, split into the
 * two axes a student actually needs to see separately - "would I enjoy
 * this" (interest, RIASEC-only) vs "am I naturally equipped for this"
 * (skill, MI + Aptitude, renormalised to its own 100%). A blended score
 * hides *why* a career ranked where it did - a role can score respectably
 * overall purely on skill fit while a student's actual interest in it is
 * low, which reads as "the algorithm is wrong" when it's really just
 * invisible. Interest and skill are shown as two separate bars, matching
 * the "Psy. Analysis" / "Skill and Abilities" split in the reference
 * report format this was modelled on.
 */
const ALL_RIASEC: RiasecLetter[] = ["R", "I", "A", "S", "E", "C"];
const ALL_MI: MICode[] = ["MI_LINGUISTIC", "MI_ANALYTICAL", "MI_VISUAL", "MI_INTERPERSONAL", "MI_INTRAPERSONAL", "MI_NATURALISTIC", "MI_AUDITORY", "MI_KINESTHETIC"];
const ALL_APT: AptCode[] = ["APT_NUMERICAL", "APT_LOGICAL", "APT_VERBAL", "APT_ABSTRACT", "APT_SPATIAL", "APT_DATA"];
const ALL_STRENGTHS = ["Intellectual & Analytical", "Creative & Innovative", "Strategic & Futuristic", "Execution & Achievement", "Influence & Leadership", "Relationship & Adaptability"];
// A student's RIASEC percentiles sum to ~100 across all SIX letters (a
// forced-choice tally - scoring high on one necessarily leaves less for the
// rest). Only weighing a career's OWN 3 listed letters (the original
// formula) throws away where the other ~half of the student's measured
// interest actually landed - so two careers sharing a dominant letter but
// differing in their other two often scored identically, which reads as
// "the algorithm is broken" even though it's mathematically consistent.
// Scoring across all 6 (a small penalty for the 3 letters a career does
// NOT list, not just 0) recovers that signal: a career whose unlisted
// letters overlap heavily with where the student's OTHER interest sits
// scores lower than one that doesn't, even when both share the same top
// letter. (The one case this can't manufacture differentiation for is a
// genuinely maximal, single-letter-only profile - there every unlisted
// letter is equally near-zero, so there's honestly no signal left to find,
// not a formula bug.)
const OUTSIDE_PENALTY = 0.15;
const INTEREST_WEIGHT_SUM = RIASEC_WEIGHTS.reduce((a, b) => a + b, 0) + OUTSIDE_PENALTY * (ALL_RIASEC.length - RIASEC_WEIGHTS.length);
// Rescaled against the provable ceiling (100% on a career's #1 letter, 0
// elsewhere) so 100 means "as good as this formula could ever score," not
// an arbitrary number nothing can reach - otherwise "Top Choice" (70+)
// would be mathematically unreachable and everything reads as "Worth Considering".
const INTEREST_CEILING = (100 * (RIASEC_WEIGHTS[0] ?? 1)) / INTEREST_WEIGHT_SUM;

export interface AxisScores1112 {
  interest: number;
  skill: number;
}
export function scoreCareerAxes1112(vector: StudentVector1112, career: Career1112): AxisScores1112 {
  const letters = career.riasec.split("") as RiasecLetter[];
  let inum = 0;
  for (const letter of ALL_RIASEC) {
    const posIdx = letters.indexOf(letter);
    const w = posIdx >= 0 ? (RIASEC_WEIGHTS[posIdx] ?? 0) : -OUTSIDE_PENALTY;
    const s = vector.riasec[letter] ?? 0;
    inum += w * s;
  }
  const rawInterest = (inum / INTEREST_WEIGHT_SUM) * 100;
  const interest = Math.round(Math.max(0, Math.min(100, (rawInterest / INTEREST_CEILING) * 100)) * 10) / 10;

  // 146 of 332 careers (44%) share the same #1 intelligence code
  // (MI_ANALYTICAL) - using the RAW mi1/mi2/keyAptitude scores meant those
  // careers could only really be told apart by mi2 and keyAptitude, and for
  // a realistically varied (not extreme) student that left barely 11 points
  // of skill-score spread across all of Engineering or Computer Science/IT
  // (Business/Management, whose careers draw on more varied MI codes,
  // spread over 22 points on the identical profile - the signal was always
  // there, the narrow 3-slot read just wasn't using enough of it).
  //
  // Adding a flat "average of your other traits" bonus to every career was
  // tried and made this WORSE, not better - that average is similar across
  // sibling careers in the same domain, so it pulled every score toward a
  // shared baseline instead of spreading them out. What actually carries
  // real per-career signal is RELATIVE standing: is the student stronger or
  // weaker at THIS specific trait than at their traits generally? Scoring
  // mi1/mi2/keyAptitude relative to the student's own mean across all 8
  // MI / 6 aptitude scores amplifies exactly the differences between which
  // specific slot each career names, while a student with a genuinely flat
  // profile (no relative strengths anywhere) correctly still shows little
  // spread - that's an honest result, not a bug (same principle already
  // applied to the interest axis's OUTSIDE_PENALTY).
  const miVals = ALL_MI.map((c) => vector.mi[c]).filter((v): v is number => v != null);
  const miMean = miVals.length ? miVals.reduce((a, b) => a + b, 0) / miVals.length : 0.5;
  const aptVals = ALL_APT.map((c) => vector.apt[c]).filter((v): v is number => v != null);
  const aptMean = aptVals.length ? aptVals.reduce((a, b) => a + b, 0) / aptVals.length : 0.5;
  // Strengths gets the SAME relative-to-own-mean treatment as MI/Aptitude
  // above, for the same reason: a flat "how strong is this trait" number is
  // similar across sibling careers in the same cluster (they share the same
  // 2 tagged strengths), so it wouldn't add any per-career spread - whether
  // this trait is stronger or weaker than the student's OWN average across
  // all 6 strengths is what actually differentiates one profile from another.
  const strVals = ALL_STRENGTHS.map((c) => vector.strength[c]).filter((v): v is number => v != null);
  const strMean = strVals.length ? strVals.reduce((a, b) => a + b, 0) / strVals.length : 0.5;
  const RELATIVE_BOOST = 0.6;
  const relative = (raw: number, mean: number) => Math.max(0, Math.min(1, raw + RELATIVE_BOOST * (raw - mean)));

  let snum = 0, sden = 0;
  // MI:Aptitude:Strength's 17:20:11 split (see scoreCareer1112's own
  // constants), renormalised to 100% for this axis alone.
  const MI_SHARE = 17 / 48, APT_SHARE = 20 / 48, STR_SHARE = 11 / 48;
  [career.mi1, career.mi2].forEach((code, i) => {
    const w = (MI_WEIGHTS[i] ?? 0) * MI_SHARE;
    const s = vector.mi[code];
    if (s != null) { snum += w * relative(s, miMean); sden += w; }
  });
  const aptW = (APT_LEVEL_WEIGHT[career.aptitudeLevel] ?? 0.7) * APT_SHARE;
  const aptS = vector.apt[career.keyAptitude];
  if (aptS != null) { snum += aptW * relative(aptS, aptMean); sden += aptW; }
  const [str1, str2] = CLUSTER_STRENGTH_AFFINITY[career.cluster] ?? [];
  [str1, str2].forEach((name, i) => {
    if (!name) return;
    const w = (STRENGTH_WEIGHTS[i] ?? 0) * STR_SHARE;
    const s = vector.strength[name];
    if (s != null) { snum += w * relative(s, strMean); sden += w; }
  });
  const skill = sden > 0 ? Math.round((snum / sden) * 100 * 10) / 10 : 0;

  return { interest, skill };
}

/**
 * The plain-English verdict the reference format shows per role - 3 tiers,
 * not 6: a career needs to be genuinely strong on both interest AND skill to
 * be a Top Choice, genuinely weak on both to be a Low Choice, and everything
 * else (strong on one axis but not the other, or middling on both) is a
 * Medium Choice rather than a fine-grained label a 17-year-old has to
 * puzzle out the difference between.
 */
export type Verdict1112 = "Top Choice" | "Medium Choice" | "Low Choice";
export function verdictFor1112(interest: number, skill: number): Verdict1112 {
  if (interest >= 60 && skill >= 55) return "Top Choice";
  if (interest < 40 && skill < 50) return "Low Choice";
  return "Medium Choice";
}

export interface RankedCareer1112 {
  career: Career1112;
  score: number;
  interest: number;
  skill: number;
  verdict: Verdict1112;
  /** Same as `score`/`interest` but WITHOUT the 0-100 display clamp - a
   *  cluster that agrees with several nudge signals at once (desired career +
   *  considering area + enjoyed subject + current subjects + pathway, up to
   *  +40 today) can legitimately earn a raw value past 100. Clamping before
   *  comparing flattens every career/cluster that overshoots the ceiling to
   *  the same 100, so two genuinely different fits tie and the tie-break
   *  falls to whatever's left (skill, 30% of the domain blend) instead of the
   *  real, larger interest signal. Sorting/averaging must use these raw
   *  fields; `score`/`interest` stay clamped for anything shown to a
   *  student, where a ">100% match" would just look broken. */
  rawScore: number;
  rawInterest: number;
}

/**
 * Career Fitment - every career ranked against the profile, ignoring stream
 * entirely. `ctx` (optional, see RankingContext1112) nudges which CLUSTER a
 * career belongs to toward what the student actually told the system via
 * Subject Fit/Career Selector - RIASEC/MI/Aptitude still decide the base
 * score and everything within a cluster.
 */
export function rankFitment1112(layer1: PsychometricProfile, ctx?: RankingContext1112): RankedCareer1112[] {
  const vector = buildStudentVector1112(layer1);
  const adj = resolveRankingAdjustments1112(ctx);
  return CAREERS_1112
    // Career Selector's "which career areas would you NOT want to pursue"
    // says "useful for elimination" right in the question copy - these
    // specific careers are removed everywhere (Fitment, Suitability,
    // Selector's own "close alternatives"), not just discounted, since a
    // discount can still let an explicitly-ruled-out career surface.
    .filter((career) => !adj.excludedCareerIds.has(career.id))
    .map((career) => {
      const { interest: baseInterest, skill } = scoreCareerAxes1112(vector, career);
      const delta = clusterAdjustment1112(career.cluster, adj);
      const rawInterest = Math.round((baseInterest + delta) * 10) / 10;
      const rawScore = Math.round((scoreCareer1112(vector, career) + delta) * 10) / 10;
      const interest = Math.max(0, Math.min(100, rawInterest));
      const score = Math.max(0, Math.min(100, rawScore));
      return { career, score, interest, skill, rawScore, rawInterest, verdict: verdictFor1112(interest, skill) };
    }).sort((a, b) => b.rawScore - a.rawScore);
}

export interface SuitableCareer1112 extends RankedCareer1112 {
  roadmap: RoadmapEntry;
}

/**
 * Career Suitability - the same ranking, filtered to careers realistically
 * reachable from the student's actual stream (per ROADMAP_MATRIX's
 * Fit_Type, the kit's authoritative table - see careerfit1112.ts's file
 * header on why this is preferred over the Careers sheet's own informal
 * Eligible_Streams text). `includeBridge` widens the pool to Bridge-type
 * careers too (not just Native Fit) - used for Class 12's wider breadth
 * page per the kit's own Report_Sections_Logic: "widen the Eligible_Streams
 * filter to show the FULL range of options... no new engine needed."
 */
export function rankSuitability1112(
  layer1: PsychometricProfile,
  appStreamKey: string,
  opts: { includeBridge?: boolean } & RankingContext1112 = {}
): SuitableCareer1112[] {
  const streamKey = STREAM_KEY_1112[appStreamKey] ?? "Vocational/Other";
  const ranked = rankFitment1112(layer1, opts);
  const out: SuitableCareer1112[] = [];
  for (const r of ranked) {
    const entry = ROADMAP_MATRIX[r.career.requiredGroup][streamKey];
    const isNative = entry.fitType === "Native Fit";
    const isBridge = entry.fitType.startsWith("Bridge");
    if (isNative || (opts.includeBridge && isBridge)) out.push({ ...r, roadmap: entry });
  }
  return out;
}

export interface DomainGroup1112<T extends RankedCareer1112 = RankedCareer1112> {
  domain: string;
  topScore: number;
  careers: T[];
}

/**
 * Groups a ranked list by domain, for the "top N domains with roles"
 * display. WHICH domains rank where is decided by each domain's own
 * genuine interest fit (its 3 best-interest careers' average RIASEC
 * match), not by whichever single career anywhere in the list happens to
 * score highest overall.
 *
 * That distinction matters: `careers[0].score` blends interest with skill
 * (MI + aptitude), and a domain full of careers that share a demanding
 * aptitude profile (e.g. Engineering, where most roles want High logical/
 * spatial reasoning) can out-score a domain the student is genuinely more
 * INTERESTED in purely because one of its roles happens to line up well on
 * skill - a strong-logical-reasoning, coding-focused student could see
 * Engineering (via, say, Petroleum or Electrical Engineer's skill match)
 * edge out Computer Science/IT this way even though every one of their
 * RIASEC answers pointed at Investigative, coding-flavoured work. RIASEC
 * interest is what actually signals "which field," not aptitude - aptitude
 * says how well-equipped you are for a role, which is what ROLE ordering
 * within a domain (`careers`, still sorted by the blended score) is for.
 */
/**
 * `excludeCareerIds` - used to keep Career Suitability from repeating the
 * exact same role list Career Fitment already showed for a shared domain.
 * Only trims which roles are DISPLAYED per domain; which domains appear and
 * in what order is still decided from the domain's full, unfiltered career
 * list, so excluding a few already-shown roles can't quietly reshuffle
 * domain rank. If exclusion would empty a domain's list entirely (every
 * Native-Fit role in it was already shown), that domain shows its normal
 * top list instead of an empty table.
 */
export function groupByDomain1112<T extends RankedCareer1112>(ranked: T[], domainLimit = 5, rolesPerDomain = 4, excludeCareerIds?: Set<number>): DomainGroup1112<T>[] {
  return groupByKey1112(ranked, (c) => c.domain, domainLimit, rolesPerDomain, excludeCareerIds);
}

/**
 * Same grouping/ranking as groupByDomain1112, keyed on each career's
 * standard-cluster tag (StandardCluster, careerfit1112.ts) instead of its
 * 27-domain one - the coarser, industry-standard bucketing the redesigned
 * Fitment/Suitability/Selector pages present against. The returned
 * `domain` field holds a cluster name here, not a DOMAINS_1112 name - kept
 * on the same DomainGroup1112 shape so existing render code (DomainBlock,
 * RolesTable, etc.) works unchanged regardless of which grouping produced it.
 */
export function groupByCluster1112<T extends RankedCareer1112>(ranked: T[], clusterLimit = 5, rolesPerCluster = 4, excludeCareerIds?: Set<number>): DomainGroup1112<T>[] {
  return groupByKey1112(ranked, (c) => c.cluster, clusterLimit, rolesPerCluster, excludeCareerIds);
}

function groupByKey1112<T extends RankedCareer1112>(ranked: T[], keyOf: (c: Career1112) => string, groupLimit: number, rolesPerGroup: number, excludeCareerIds?: Set<number>): DomainGroup1112<T>[] {
  const byDomain = new Map<string, T[]>();
  for (const r of ranked) {
    const key = keyOf(r.career);
    const list = byDomain.get(key) ?? [];
    list.push(r);
    byDomain.set(key, list);
  }
  const groups = Array.from(byDomain.entries()).map(([domain, careers]) => {
    const byInterest = careers.slice().sort((a, b) => b.rawInterest - a.rawInterest);
    // Distinct RIASEC codes only, not distinct careers - 215 of 332 careers
    // share their exact 3-letter code with a same-domain sibling (mostly
    // real sub-specialties: Cardiologist/Neurologist/Dermatologist are all
    // legitimately "ISA", Physicist/Astrophysicist/Astronomer all "IRA" -
    // not a data error to fix by inventing artificial differences). But
    // averaging the RAW top-3 careers let a domain "stack" the identical
    // ceiling score 2-3 times and out-rank a domain with genuinely more
    // VARIED strong matches: an MPC, Realistic-leaning profile saw
    // Agriculture (Agronomist/Horticulturist/Forester, all coded "RIA")
    // edge out Engineering (RIA/RAI/RIE - three different codes, each
    // independently strong) by ~2 points, purely because Agriculture had 3
    // identical scores to average instead of Engineering's 3 distinct ones.
    // Deduping by code first means a domain's ranking reflects the breadth
    // of DIFFERENT interest angles it satisfies, not how many synonyms for
    // the same one angle it happens to contain.
    const seenRiasec = new Set<string>();
    const topInterest: T[] = [];
    for (const c of byInterest) {
      if (seenRiasec.has(c.career.riasec)) continue;
      seenRiasec.add(c.career.riasec);
      topInterest.push(c);
      if (topInterest.length === 3) break;
    }
    const domainInterest = topInterest.reduce((sum, c) => sum + c.rawInterest, 0) / (topInterest.length || 1);
    // Domain RANKING used to be interest-only - MI/aptitude only affected
    // ordering of roles WITHIN a domain, never which domains won the top-5.
    // That let a domain that's a pure RIASEC-code neighbour of a genuinely
    // strong one (e.g. Agriculture Sciences' RIA/IRA codes sit right next to
    // Engineering's RIC/RIE/RIA) rank almost as high as it, purely on
    // interest, even when the student's actual MI/aptitude profile (e.g.
    // strong Logical-Mathematical, weak Naturalistic) points clearly one way
    // and not the other. Blending in the same top-3 careers' skill score
    // (aptitude + MI, already computed per-career by scoreCareerAxes1112)
    // lets "am I actually equipped for this" help decide which FIELD ranks
    // where too, not just which specific role within a field looks best -
    // interest still dominates the blend, since it's still the stronger
    // long-term-fit signal (see verdictFor1112's own comment on this).
    const domainSkill = topInterest.reduce((sum, c) => sum + c.skill, 0) / (topInterest.length || 1);
    const domainRank = domainInterest * 0.7 + domainSkill * 0.3;
    const filtered = excludeCareerIds ? careers.filter((c) => !excludeCareerIds.has(c.career.id)) : careers;
    const shown = filtered.length > 0 ? filtered : careers;
    // topScore is the number actually printed next to the domain (the bar
    // chart %, the summary-table %) - domainRank itself is built from
    // rawInterest/skill (see above) and can run past 100 when several nudge
    // signals agree on the same cluster, so it's clamped here, at the very
    // last step before display, rather than earlier where it would also
    // flatten the sort order. Sort order (below) still runs on the unclamped
    // domainRank, so this clamp never reorders anything - it only stops a
    // ">100% match" from reaching the page.
    const displayScore = Math.max(0, Math.min(100, Math.round(domainRank * 10) / 10));
    return { domain, topScore: displayScore, domainRank, careers: shown.slice(0, rolesPerGroup) };
  });
  return groups
    .sort((a, b) => b.domainRank - a.domainRank)
    .slice(0, groupLimit)
    .map(({ domain, topScore, careers }) => ({ domain, topScore, careers }));
}

const norm = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");

/**
 * Matches a free-text desired-career string (from the pre-exam "desired
 * career" dropdown - see NewExam.tsx's preinfo phase, sourced from
 * DOMAINS_1112/CAREERS_1112 directly so this should almost always be an
 * exact hit) to a CAREERS_1112 entry. Exact match first, then substring
 * overlap, so a near-miss (different casing, a trailing "(MBBS)") still
 * resolves instead of silently returning nothing.
 */
export function findCareer1112(desiredCareerText: string): Career1112 | null {
  if (!desiredCareerText) return null;
  const needle = norm(desiredCareerText);
  const exact = CAREERS_1112.find((c) => norm(c.name) === needle);
  if (exact) return exact;
  // Near-miss fallback (different casing, a trailing "(MBBS)") - picks the
  // LONGEST overlapping name, not just the first array hit, so a short/
  // generic needle (e.g. "Engineer") can't accidentally resolve to whichever
  // unrelated career happens to sit earliest in CAREERS_1112.
  const candidates = CAREERS_1112.filter((c) => {
    const n = norm(c.name);
    return n.includes(needle) || needle.includes(n);
  });
  if (!candidates.length) return null;
  candidates.sort((a, b) => norm(b.name).length - norm(a.name).length);
  return candidates[0];
}

export interface Selector1112Result {
  career: Career1112 | null;
  /** Where this career currently ranks in the student's own Fitment list (1-based), or null if not found in CAREERS_1112. */
  fitmentRank: number | null;
  fitmentScore: number | null;
  interest: number | null;
  skill: number | null;
  verdict: Verdict1112 | null;
  roadmap: RoadmapEntry | null;
}

/** Career Selector - the desired career checked against the student's stream, with rank-in-fitment context. */
export function selectCareer1112(desiredCareerText: string, layer1: PsychometricProfile, appStreamKey: string): Selector1112Result {
  const career = findCareer1112(desiredCareerText);
  if (!career) return { career: null, fitmentRank: null, fitmentScore: null, interest: null, skill: null, verdict: null, roadmap: null };
  const ranked = rankFitment1112(layer1);
  const idx = ranked.findIndex((r) => r.career.id === career.id);
  const match = idx >= 0 ? ranked[idx] : null;
  return {
    career,
    fitmentRank: idx >= 0 ? idx + 1 : null,
    fitmentScore: match?.score ?? null,
    interest: match?.interest ?? null,
    skill: match?.skill ?? null,
    verdict: match?.verdict ?? null,
    roadmap: roadmapFor(career, appStreamKey),
  };
}

/**
 * The single source of truth for "what domain does this profile point
 * toward" for classes 11/12 - used by scoring11_12.ts's
 * calculateDomainAffinities() so that the shared dimension pages (Career
 * Interest, etc.), the Resources page, and "Other domains worth exploring"
 * all agree with Career Fitment/Suitability/Selector instead of computing a
 * second, disagreeing answer from the older 8-domain catalogue in
 * knowledge.ts. Same shape scoring11_12.ts's Class11ScoreOutput expects
 * (domain/domainName/affinity/reasoning) - domain and domainName are now
 * simply the same DOMAINS_1112 name, since there's no separate letter-code
 * catalogue to key against any more.
 */
export interface DomainAffinity1112 {
  domain: string;
  domainName: string;
  affinity: number;
  reasoning: string[];
}
export function domainAffinitiesFromProfile1112(layer1: PsychometricProfile, ctx?: RankingContext1112): DomainAffinity1112[] {
  const ranked = rankFitment1112(layer1, ctx);
  const groups = groupByDomain1112(ranked, DOMAINS_1112.length, 3);
  return groups.map((g) => ({
    domain: g.domain,
    domainName: g.domain,
    affinity: Math.round(g.topScore),
    reasoning: [`Best-matching roles: ${g.careers.map((c) => c.career.name).join(", ")}`],
  }));
}

/** Every DOMAINS_1112 domain with at least one career that's a Native Fit for this stream - the same "reachable without a bridge" test Career Suitability itself uses, reused here so stream-suitability text agrees with it instead of consulting a separate, older compatibility table. */
export function domainsCompatibleWithStream1112(appStreamKey: string): Set<string> {
  const compatible = new Set<string>();
  for (const career of CAREERS_1112) {
    if (roadmapFor(career, appStreamKey).fitType === "Native Fit") compatible.add(career.domain);
  }
  return compatible;
}

/** Real roles compatible with a stream, grouped by domain - the Career Suitability reference listing, keyed the same way (domain name, not a letter code). */
export function careerSuitabilityForStream1112(appStreamKey: string): { domain: string; domainName: string; roles: string[] }[] {
  const byDomain = new Map<string, string[]>();
  for (const career of CAREERS_1112) {
    if (roadmapFor(career, appStreamKey).fitType !== "Native Fit") continue;
    const list = byDomain.get(career.domain) ?? [];
    list.push(career.name);
    byDomain.set(career.domain, list);
  }
  return Array.from(byDomain.entries()).map(([domain, roles]) => ({ domain, domainName: domain, roles }));
}

// Plain-English labels for the MI/aptitude codes CAREERS_1112 stores -
// reused to show a career's real "skills this rewards" tags (Career
// Selector's deep-dive page) without inventing per-skill percentages
// CAREERS_1112 has no honest data for.
const MI_LABEL: Record<string, string> = {
  MI_LINGUISTIC: "Linguistic", MI_ANALYTICAL: "Logical-Mathematical", MI_VISUAL: "Spatial",
  MI_INTERPERSONAL: "Interpersonal", MI_INTRAPERSONAL: "Intrapersonal", MI_NATURALISTIC: "Naturalistic",
  MI_AUDITORY: "Musical", MI_KINESTHETIC: "Bodily-Kinesthetic",
};
const APT_LABEL: Record<string, string> = {
  APT_NUMERICAL: "Numerical Reasoning", APT_LOGICAL: "Logical Reasoning", APT_VERBAL: "Verbal Reasoning",
  APT_ABSTRACT: "Abstract/Pattern Reasoning", APT_SPATIAL: "Spatial Reasoning", APT_DATA: "Data Interpretation",
};
export function skillTagsFor1112(career: Career1112): string[] {
  return [MI_LABEL[career.mi1], MI_LABEL[career.mi2], APT_LABEL[career.keyAptitude]].filter((x): x is string => Boolean(x));
}

/**
 * Turns a domain's own real salaryIndia text ("₹4–10 LPA entry · ₹15–38 LPA
 * mid · ₹55 LPA+ senior / lead") into 3 chartable points - reusing the
 * exact figures already shown as text elsewhere on these pages, not new
 * numbers, so the Career Selector deep-dive's salary chart stays honest.
 */
export interface SalaryPoint1112 { label: string; lpa: number }
export function parseSalaryBands1112(salaryIndia: string): SalaryPoint1112[] {
  const nums = Array.from(salaryIndia.matchAll(/₹\s*([\d.]+)(?:\s*[–-]\s*([\d.]+))?\s*LPA/g)).map((m) => {
    const lo = parseFloat(m[1]);
    const hi = m[2] ? parseFloat(m[2]) : lo;
    return Math.round(((lo + hi) / 2) * 10) / 10;
  });
  const labels = ["Entry", "Mid-career", "Senior"];
  return nums.slice(0, 3).map((lpa, i) => ({ label: labels[i], lpa }));
}

export { CAREERS_1112, DOMAINS_1112 };
