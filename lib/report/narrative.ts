import { FitmentResult, RiasecLetter } from "@/lib/engine/fitment/types";

// Turns the raw score + fitment output into readable, report-ready prose:
// an interest interpretation, strengths, growth areas, learning-style advice,
// recommendations and age-appropriate next steps. Pure function — no I/O.

export interface ScoreParam {
  parameterName: string;
  scoringStrategy: string;
  subTraits: { subTraitName: string; rawScore: number; normalizedScore: number }[];
}

export interface ScorePayload {
  journey: { code: string; name: string; ageGroup: string };
  topStrengths: { parameterName: string; subTraitName: string; normalizedScore: number }[];
  parameters: ScoreParam[];
}

export interface ReportNarrative {
  headline: string;
  summary: string;
  interestThemes: { letter: RiasecLetter; title: string; meaning: string; score: number }[];
  strengths: string[];
  growthAreas: string[];
  learningStyle: { name: string; advice: string } | null;
  recommendations: string[];
  nextSteps: string[];
}

const THEME: Record<RiasecLetter, { title: string; meaning: string }> = {
  R: { title: "Realistic", meaning: "hands-on, practical, action-oriented work" },
  I: { title: "Investigative", meaning: "analytical, curious, research-driven work" },
  A: { title: "Artistic", meaning: "creative, expressive, original work" },
  S: { title: "Social", meaning: "helping, teaching and people-centred work" },
  E: { title: "Enterprising", meaning: "leadership, persuasion and initiative" },
  C: { title: "Conventional", meaning: "structured, organised, detail-focused work" },
};

const LEARNING_ADVICE: Record<string, string> = {
  Auditory: "Learn by listening and discussing — record notes, study aloud, and talk ideas through with others.",
  Visual: "Learn by seeing — use diagrams, mind-maps, colour-coding and videos over plain text.",
  "Read/Write": "Learn by reading and writing — make written summaries, rewrite notes, and list key points.",
  Kinesthetic: "Learn by doing — use hands-on practice, experiments, and real examples over theory.",
};

const NEXT_STEPS: Record<string, string[]> = {
  career_discovery: [
    "Explore clubs and activities that match your top interest themes.",
    "Try short projects in 2–3 fields to see what feels energising.",
    "Talk to a mentor or teacher about the careers listed here.",
  ],
  stream_selection: [
    "Use your top interests + aptitudes to shortlist a stream (Science / Commerce / Arts).",
    "Compare subject requirements for your top career matches.",
    "Speak to seniors or professionals in those fields before deciding.",
  ],
  career_planning: [
    "Map your top matches to degree options and entrance exams.",
    "Strengthen the aptitude areas flagged as gaps below.",
    "Shadow or intern in your top field to validate the fit.",
  ],
  graduate_readiness: [
    "Target internships and projects in your top-matched roles.",
    "Build the specific skills your best-fit careers need.",
    "Prepare a focused CV around your strengths.",
  ],
  career_growth: [
    "Choose a role family from the top matches to specialise in.",
    "Plan upskilling around your growth areas.",
    "Seek stretch assignments that use your strengths.",
  ],
  leadership_excellence: [
    "Use the fit themes to shape leadership and pivot options.",
    "Address the derailer/gap areas flagged below.",
    "Seek roles that leverage your strongest competencies.",
  ],
};

function levelWord(score: number): string {
  if (score >= 80) return "excellent";
  if (score >= 65) return "strong";
  if (score >= 50) return "good";
  if (score >= 35) return "developing";
  return "emerging";
}

export function buildNarrative(
  score: ScorePayload,
  fitment: FitmentResult,
  studentName?: string | null
): ReportNarrative {
  const first = studentName?.trim().split(/\s+/)[0];
  const code = fitment.profile.riasecCode;

  const interestThemes = code
    ? (code.split("") as RiasecLetter[]).map((letter) => ({
        letter,
        title: THEME[letter].title,
        meaning: THEME[letter].meaning,
        score: Math.round(fitment.profile.riasec?.[letter] ?? 0),
      }))
    : [];

  const themeTitles = interestThemes.map((t) => t.title);
  const headline = themeTitles.length
    ? `Your strongest fit is ${themeTitles.slice(0, 3).join(", ")}`
    : "Your personalised career fitment";

  const topMatch = fitment.matches[0];
  const summary = topMatch
    ? `${first ? first + ", based" : "Based"} on your responses, you lean towards ${themeTitles
        .slice(0, 2)
        .join(" and ")
        .toLowerCase()} work. Your strongest career match is ${topMatch.title} (${topMatch.fitmentPct}% fit), with several related paths in ${fitment.clusters
        .slice(0, 2)
        .map((c) => c.cluster)
        .join(" and ")}.`
    : "Your responses have been scored across all eight assessment categories below.";

  const strengths = score.topStrengths.slice(0, 5).map(
    (s) => `${s.subTraitName} — ${levelWord(s.normalizedScore)} (${s.normalizedScore}/100)`
  );

  // Growth areas: lowest-scoring reliable sub-traits + explicit gaps from matches.
  const allSubs = score.parameters.flatMap((p) =>
    p.subTraits.map((s) => ({ name: s.subTraitName, score: s.normalizedScore }))
  );
  const lowest = [...allSubs]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .filter((s) => s.score < 55)
    .map((s) => `${s.name} — ${levelWord(s.score)} (${s.score}/100), worth developing.`);
  const matchGaps = fitment.matches.slice(0, 3).flatMap((m) => m.gaps);
  const growthAreas = [...new Set([...lowest, ...matchGaps])].slice(0, 4);

  const ls = fitment.profile.learningStyles[0];
  const learningStyle = ls
    ? {
        name: ls.name,
        advice:
          LEARNING_ADVICE[
            Object.keys(LEARNING_ADVICE).find((k) =>
              ls.name.toLowerCase().includes(k.toLowerCase())
            ) ?? ""
          ] ?? "Use study methods that play to this preference.",
      }
    : null;

  const recommendations = [
    ...fitment.matches.slice(0, 3).map(
      (m) => `Explore ${m.title} (${m.cluster}) — ${m.fitmentPct}% fit.`
    ),
    ...fitment.clusters
      .slice(0, 2)
      .map((c) => `Look into more roles within ${c.cluster}.`),
  ];

  return {
    headline,
    summary,
    interestThemes,
    strengths,
    growthAreas,
    learningStyle,
    recommendations,
    nextSteps: NEXT_STEPS[score.journey.code] ?? NEXT_STEPS.career_planning,
  };
}
