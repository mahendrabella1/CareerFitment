type RiasecLetter = "R" | "I" | "A" | "S" | "E" | "C";

const THEME_BY_LETTER: Record<
  RiasecLetter,
  { title: string; meaning: string }
> = {
  R: {
    title: "Realistic",
    meaning: "Hands-on, action-oriented, practical work that solves visible problems.",
  },
  I: {
    title: "Investigative",
    meaning: "Analytical, research-heavy, knowledge-driven work built around curiosity.",
  },
  A: {
    title: "Artistic",
    meaning: "Creative expression, design, storytelling, and originality.",
  },
  S: {
    title: "Social",
    meaning: "Helping, teaching, mentoring, and people-centered impact.",
  },
  E: {
    title: "Enterprising",
    meaning: "Leadership, persuasion, entrepreneurship, and initiative.",
  },
  C: {
    title: "Conventional",
    meaning: "Structured, detail-oriented, process-driven, and organized work.",
  },
};

const JOURNEY_CONTEXT: Record<
  string,
  { outcomeLabel: string; nextStep: string }
> = {
  career_discovery: {
    outcomeLabel: "exploration areas",
    nextStep:
      "Use the top themes to pick clubs, projects, and subjects that feel naturally energizing.",
  },
  stream_selection: {
    outcomeLabel: "stream directions",
    nextStep:
      "Use the fit themes with aptitude and academic strengths before locking a stream choice.",
  },
  career_planning: {
    outcomeLabel: "higher-study and career directions",
    nextStep:
      "Compare the fit themes with degree options, entrance exams, and real role requirements.",
  },
  graduate_readiness: {
    outcomeLabel: "entry-career directions",
    nextStep:
      "Match the fit themes with internships, projects, and placements that prove readiness.",
  },
  career_growth: {
    outcomeLabel: "early-career paths",
    nextStep:
      "Use the fit themes to narrow role families, upskilling plans, and next-job targets.",
  },
  leadership_excellence: {
    outcomeLabel: "leadership-fit directions",
    nextStep:
      "Use the fit themes to shape stretch assignments, leadership roles, and pivot options.",
  },
};

const JOURNEY_RECOMMENDATIONS: Record<string, Record<RiasecLetter, string[]>> = {
  career_discovery: {
    R: ["robotics and maker projects", "sports science activities", "nature and field exploration"],
    I: ["science clubs", "math puzzles and olympiads", "coding exploration"],
    A: ["art and design projects", "creative writing", "music and performance"],
    S: ["peer mentoring", "teaching games for younger students", "community activities"],
    E: ["student leadership roles", "debate and public speaking", "mini entrepreneurship tasks"],
    C: ["logic games", "structured research notebooks", "planning and organizing activities"],
  },
  stream_selection: {
    R: ["engineering and applied science streams", "technical design pathways", "agri-tech exploration"],
    I: ["science and research-oriented streams", "medical preparation tracks", "computer science foundations"],
    A: ["design, media, and architecture-adjacent tracks", "humanities with creative focus", "communication arts"],
    S: ["education and psychology foundations", "social science pathways", "health and care-oriented streams"],
    E: ["commerce and business pathways", "leadership and entrepreneurship exposure", "marketing-oriented learning"],
    C: ["accountancy foundations", "data and commerce operations", "structured analytical preparation"],
  },
  career_planning: {
    R: ["engineering", "operations and production", "aviation or applied technology"],
    I: ["medicine", "research sciences", "data and computing"],
    A: ["design", "media and communication", "content and creative industries"],
    S: ["teaching", "psychology", "healthcare and counseling"],
    E: ["business management", "sales and growth roles", "entrepreneurship"],
    C: ["finance", "accounting", "audit and compliance"],
  },
  graduate_readiness: {
    R: ["field engineering", "lab operations", "technical support and implementation"],
    I: ["data analysis", "research associate roles", "software and analytical careers"],
    A: ["design and brand roles", "content strategy", "creative production"],
    S: ["training", "customer success", "HR and people support roles"],
    E: ["business development", "consulting support", "startup operations"],
    C: ["business analysis", "finance operations", "project coordination"],
  },
  career_growth: {
    R: ["implementation specialist", "operations analyst", "technical project execution"],
    I: ["product analysis", "research and insights", "engineering problem-solving roles"],
    A: ["UX and product design", "content and campaign strategy", "creative planning"],
    S: ["learning and development", "people success", "consultative client roles"],
    E: ["account management", "growth and sales", "founder-track or business roles"],
    C: ["program management", "financial planning", "process excellence roles"],
  },
  leadership_excellence: {
    R: ["operations leadership", "plant or field leadership", "delivery execution leadership"],
    I: ["strategy and research leadership", "analytics leadership", "innovation leadership"],
    A: ["brand and creative leadership", "experience design leadership", "communications leadership"],
    S: ["people leadership", "coaching and culture roles", "customer and community leadership"],
    E: ["general management", "business unit leadership", "entrepreneurial leadership"],
    C: ["governance and compliance leadership", "PMO leadership", "financial control leadership"],
  },
};

export interface CareerFitInput {
  subTraitName: string;
  normalizedScore: number;
}

export interface CareerFitTheme {
  letter: RiasecLetter;
  title: string;
  score: number;
  meaning: string;
  suggestions: string[];
}

export interface CareerFitSummary {
  primaryCode: string;
  outcomeLabel: string;
  summary: string;
  themes: CareerFitTheme[];
  recommendations: string[];
  nextStep: string;
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }

  return out;
}

function extractRiasecLetter(name: string): RiasecLetter | null {
  const direct = name.match(/^\s*([RIASEC])\s*(?:[-\u2013\u2014]|$)/i);
  if (direct) return direct[1].toUpperCase() as RiasecLetter;

  const dashed = name.match(/[\u2013\u2014-]\s*([RIASEC])\b/i);
  if (dashed) return dashed[1].toUpperCase() as RiasecLetter;

  const parenthetical = name.match(/\b([RIASEC])\s*\(/i);
  if (parenthetical) return parenthetical[1].toUpperCase() as RiasecLetter;

  const upper = name.toUpperCase();
  if (upper.includes("REALISTIC")) return "R";
  if (upper.includes("INVESTIGATIVE")) return "I";
  if (upper.includes("ARTISTIC")) return "A";
  if (upper.includes("SOCIAL")) return "S";
  if (upper.includes("ENTERPRISING")) return "E";
  if (upper.includes("CONVENTIONAL")) return "C";

  return null;
}

export function deriveCareerFit(
  journeyCode: string,
  scores: CareerFitInput[]
): CareerFitSummary | null {
  const scoreByLetter = new Map<RiasecLetter, number>();

  for (const score of scores) {
    const letter = extractRiasecLetter(score.subTraitName);
    if (!letter) continue;

    const current = scoreByLetter.get(letter);
    if (current === undefined || score.normalizedScore > current) {
      scoreByLetter.set(letter, score.normalizedScore);
    }
  }

  const rankedLetters = [...scoreByLetter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (rankedLetters.length === 0) {
    return null;
  }

  const context = JOURNEY_CONTEXT[journeyCode] ?? {
    outcomeLabel: "career directions",
    nextStep: "Validate the fit with aptitude evidence, real projects, and guided conversations.",
  };
  const journeyRecommendations =
    JOURNEY_RECOMMENDATIONS[journeyCode] ?? JOURNEY_RECOMMENDATIONS.career_planning;

  const themes: CareerFitTheme[] = rankedLetters.map(([letter, score]) => ({
    letter,
    title: THEME_BY_LETTER[letter].title,
    score,
    meaning: THEME_BY_LETTER[letter].meaning,
    suggestions: journeyRecommendations[letter] ?? [],
  }));

  return {
    primaryCode: themes.map((theme) => theme.letter).join(""),
    outcomeLabel: context.outcomeLabel,
    summary: `Your strongest Holland-style fit pattern combines ${themes
      .map((theme) => theme.title)
      .join(", ")} strengths.`,
    themes,
    recommendations: uniqueStrings(themes.flatMap((theme) => theme.suggestions)).slice(0, 6),
    nextStep: context.nextStep,
  };
}
