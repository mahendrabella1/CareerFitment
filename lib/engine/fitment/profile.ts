import {
  AptitudeSkill,
  AptitudeVector,
  BigFiveTrait,
  BigFiveVector,
  MatchCategory,
  MiVector,
  MultipleIntelligence,
  RiasecLetter,
  RiasecVector,
  UserProfile,
  ValueTag,
} from "./types";

// The scored-session shape the matcher consumes — exactly what /score returns.
export interface ScoredParameter {
  parameterName: string;
  scoringStrategy: string;
  subTraits: { subTraitName: string; rawScore: number; normalizedScore: number }[];
}

// A sub-score needs ~4 items to be stable (blueprint §4/§6). We don't get item
// counts in the score payload, but we treat a present sub-trait as one reliable
// signal and count them per category for the confidence band.
const RIASEC_LETTERS: RiasecLetter[] = ["R", "I", "A", "S", "E", "C"];

function riasecLetterFromName(name: string): RiasecLetter | null {
  const n = name.toUpperCase();
  // Leading "R-", "R –", "SDS — R", "O*NET — R", "SII — R (..."
  const tail = n.match(/(?:^|[–—-]\s*)([RIASEC])\s*(?:[-–—(]|$)/);
  if (tail) return tail[1] as RiasecLetter;
  if (n.includes("REALISTIC")) return "R";
  if (n.includes("INVESTIGATIVE")) return "I";
  if (n.includes("ARTISTIC")) return "A";
  if (n.includes("ENTERPRISING")) return "E";
  if (n.includes("CONVENTIONAL")) return "C";
  if (n.includes("SOCIAL")) return "S";
  return null;
}

function extractRiasec(param: ScoredParameter | undefined): {
  vector: RiasecVector | null;
  code: string | null;
  n: number;
} {
  if (!param) return { vector: null, code: null, n: 0 };
  const buckets: Record<RiasecLetter, number[]> = {
    R: [], I: [], A: [], S: [], E: [], C: [],
  };
  for (const st of param.subTraits) {
    const letter = riasecLetterFromName(st.subTraitName);
    if (letter) buckets[letter].push(st.normalizedScore);
  }
  const vector = {} as RiasecVector;
  let present = 0;
  for (const l of RIASEC_LETTERS) {
    if (buckets[l].length) {
      vector[l] = avg(buckets[l]);
      present++;
    } else {
      vector[l] = 0;
    }
  }
  if (present === 0) return { vector: null, code: null, n: 0 };
  const code = RIASEC_LETTERS.slice()
    .sort((a, b) => vector[b] - vector[a])
    .slice(0, 3)
    .join("");
  return { vector, code, n: present };
}

const APTITUDE_MATCHERS: [RegExp, AptitudeSkill][] = [
  [/numeric|quantitat/i, "Numerical"],
  [/verbal|reading|comprehen|written|language/i, "Verbal"],
  [/abstract|logical|inductive|pattern/i, "Abstract"],
  [/spatial|visuali/i, "Spatial"],
  [/clerical|checking|speed|accuracy|processing/i, "Clerical"],
  [/mechanic/i, "Mechanical"],
];

function extractAptitude(param: ScoredParameter | undefined): {
  vector: AptitudeVector;
  n: number;
} {
  const vector: AptitudeVector = {};
  if (!param) return { vector, n: 0 };
  const buckets = new Map<AptitudeSkill, number[]>();
  for (const st of param.subTraits) {
    for (const [re, skill] of APTITUDE_MATCHERS) {
      if (re.test(st.subTraitName)) {
        const b = buckets.get(skill) ?? [];
        b.push(st.normalizedScore);
        buckets.set(skill, b);
        break;
      }
    }
  }
  for (const [skill, vals] of buckets) vector[skill] = avg(vals);
  return { vector, n: buckets.size };
}

// Big Five from Big-Five, Hogan HPI and (loosely) MBTI-style sub-traits. Each
// returns the trait it informs, and whether the score should be inverted
// (e.g. "Emotional Stability" is reverse of Neuroticism).
const BIGFIVE_MATCHERS: [RegExp, BigFiveTrait, boolean][] = [
  [/openness|inquisitive|imaginative|learning approach|curiosity/i, "O", false],
  [/conscientious|prudence|diligent|dutiful|organi/i, "C", false],
  [/extraver|extrover|sociability|ambition|bold|colorful/i, "E", false],
  [/agreeable|interpersonal sensitivity|warmth|altruis/i, "A", false],
  [/neuroticism/i, "N", false],
  [/emotional stability|excitable/i, "N", true], // stability → invert to N
];

function extractBigFive(param: ScoredParameter | undefined): {
  vector: BigFiveVector;
  n: number;
} {
  const vector: BigFiveVector = {};
  if (!param) return { vector, n: 0 };
  const buckets = new Map<BigFiveTrait, number[]>();
  for (const st of param.subTraits) {
    if (/lie scale|social desirability|validity|consistency/i.test(st.subTraitName)) {
      continue; // validity items — not personality signal
    }
    for (const [re, trait, invert] of BIGFIVE_MATCHERS) {
      if (re.test(st.subTraitName)) {
        const v = invert ? 100 - st.normalizedScore : st.normalizedScore;
        const b = buckets.get(trait) ?? [];
        b.push(v);
        buckets.set(trait, b);
        break;
      }
    }
  }
  for (const [trait, vals] of buckets) vector[trait] = avg(vals);
  return { vector, n: buckets.size };
}

const VALUE_MATCHERS: [RegExp, ValueTag][] = [
  [/achievement|mastery|results/i, "achievement"],
  [/autonomy|independen/i, "autonomy"],
  [/helping|altruis|support|service/i, "helping"],
  [/recognition|prestige|status/i, "recognition"],
  [/security|stability|tradition|working conditions|surroundings/i, "security"],
  [/creativi|expression|aesthetic|innovation|design/i, "creativity"],
  [/intellect|science|data|analyt|thought/i, "intellectual"],
  [/social|relationship|affiliation|collaborat/i, "affiliation"],
  [/power|influence|leadership|supervis/i, "power"],
  [/commerce|business|economic|returns/i, "commerce"],
  [/variety|change/i, "variety"],
  [/fun|leisure|hedonism|lifestyle|work-life/i, "lifestyle"],
];

function extractValues(param: ScoredParameter | undefined): {
  values: { tag: ValueTag; score: number }[];
  n: number;
} {
  if (!param) return { values: [], n: 0 };
  const buckets = new Map<ValueTag, number[]>();
  for (const st of param.subTraits) {
    for (const [re, tag] of VALUE_MATCHERS) {
      if (re.test(st.subTraitName)) {
        const b = buckets.get(tag) ?? [];
        b.push(st.normalizedScore);
        buckets.set(tag, b);
        break;
      }
    }
  }
  const values = [...buckets.entries()]
    .map(([tag, vals]) => ({ tag, score: Math.round(avg(vals)) }))
    .sort((a, b) => b.score - a.score);
  return { values, n: buckets.size };
}

const MI_MATCHERS: [RegExp, MultipleIntelligence][] = [
  [/linguistic|language/i, "linguistic"],
  [/logical-math|logical.math|mathematic/i, "logical-mathematical"],
  [/spatial/i, "spatial"],
  [/kinesthet|bodily/i, "bodily-kinesthetic"],
  [/musical/i, "musical"],
  [/interpersonal|relationship building|influencing|people/i, "interpersonal"],
  [/intrapersonal|self-aware|self\b/i, "intrapersonal"],
  [/naturalist/i, "naturalist"],
];

function extractMi(param: ScoredParameter | undefined): { vector: MiVector; n: number } {
  const vector: MiVector = {};
  if (!param) return { vector, n: 0 };
  const buckets = new Map<MultipleIntelligence, number[]>();
  for (const st of param.subTraits) {
    for (const [re, mi] of MI_MATCHERS) {
      if (re.test(st.subTraitName)) {
        const b = buckets.get(mi) ?? [];
        b.push(st.normalizedScore);
        buckets.set(mi, b);
        break;
      }
    }
  }
  for (const [mi, vals] of buckets) vector[mi] = avg(vals);
  return { vector, n: buckets.size };
}

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function findParam(
  params: ScoredParameter[],
  ...needles: string[]
): ScoredParameter | undefined {
  return params.find((p) =>
    needles.some((n) => p.parameterName.toLowerCase().includes(n.toLowerCase()))
  );
}

/**
 * Build the canonical user profile from a scored session's parameters.
 * Every extractor is defensive: a category the session didn't cover yields an
 * empty vector and contributes 0 reliability, so the matcher can renormalise.
 */
export function extractUserProfile(params: ScoredParameter[]): UserProfile {
  const reliability: Partial<Record<MatchCategory, number>> = {};

  const interest = extractRiasec(findParam(params, "career interest", "interest"));
  if (interest.n) reliability.interest = interest.n;

  const apt = extractAptitude(findParam(params, "aptitude", "cognitive"));
  if (apt.n) reliability.aptitude = apt.n;

  const big = extractBigFive(findParam(params, "personality"));
  if (big.n) reliability.personality = big.n;

  const values = extractValues(findParam(params, "values", "motivator", "work values"));
  if (values.n) reliability.values = values.n;

  const mi = extractMi(findParam(params, "multiple intelligence"));
  if (mi.n) reliability.mi = mi.n;

  const eiParam = findParam(params, "emotional intelligence");
  const ei = eiParam && eiParam.subTraits.length
    ? Math.round(avg(eiParam.subTraits.map((s) => s.normalizedScore)))
    : null;
  if (ei !== null) reliability.ei = eiParam!.subTraits.length;

  const academicParam = findParam(params, "academic", "subject");
  const academic = academicParam
    ? academicParam.subTraits
        .map((s) => ({ name: s.subTraitName, score: Math.round(s.normalizedScore) }))
        .sort((a, b) => b.score - a.score)
    : [];
  if (academic.length) reliability.academic = academic.length;

  const learningParam = findParam(params, "learning style", "learning");
  const learningStyles = learningParam
    ? learningParam.subTraits
        .map((s) => ({ name: s.subTraitName, score: Math.round(s.normalizedScore) }))
        .sort((a, b) => b.score - a.score)
    : [];

  return {
    riasec: interest.vector,
    riasecCode: interest.code,
    aptitude: apt.vector,
    bigFive: big.vector,
    values: values.values,
    mi: mi.vector,
    ei,
    academic,
    learningStyles,
    reliability,
  };
}
