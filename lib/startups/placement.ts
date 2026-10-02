/**
 * Placement quiz (PDF section 2) - 5 questions, suggests a track from the
 * learner's answers. Only the Builder track has real content in Phase 1 (see
 * data/startups/content.ts), so every outcome resolves to "builder" for now;
 * the scoring logic itself is built to the full 4-track spec so Explorer/
 * Founder/Operator need only content, not a rewrite, once they exist.
 */

export type TrackLevel = "EXPLORER" | "BUILDER" | "FOUNDER" | "OPERATOR";

export interface PlacementQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string; points: Partial<Record<TrackLevel, number>> }[];
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "sold-anything",
    prompt: "Have you ever sold anything (online, at school, to neighbours)?",
    options: [
      { id: "no", text: "No, never", points: { EXPLORER: 2 } },
      { id: "small", text: "Small things, informally", points: { BUILDER: 2 } },
      { id: "regularly", text: "Yes, fairly regularly", points: { FOUNDER: 2, OPERATOR: 1 } },
    ],
  },
  {
    id: "knows-basics",
    prompt: "Do you know what a customer, profit, and cost are?",
    options: [
      { id: "no", text: "Not really", points: { EXPLORER: 2 } },
      { id: "some", text: "I have a general idea", points: { BUILDER: 2 } },
      { id: "yes", text: "Yes, clearly", points: { FOUNDER: 2, OPERATOR: 2 } },
    ],
  },
  {
    id: "has-idea",
    prompt: "Do you already have a startup idea?",
    options: [
      { id: "no", text: "No" , points: { EXPLORER: 1, BUILDER: 1 } },
      { id: "vague", text: "A vague one", points: { BUILDER: 2 } },
      { id: "clear", text: "Yes, fairly clear", points: { FOUNDER: 2, OPERATOR: 1 } },
    ],
  },
  {
    id: "built-anything",
    prompt: "Have you built anything: a website, app, product, or service?",
    options: [
      { id: "no", text: "No" , points: { EXPLORER: 2 } },
      { id: "school", text: "A school/college project", points: { BUILDER: 2, FOUNDER: 1 } },
      { id: "real", text: "Something real people used", points: { FOUNDER: 2, OPERATOR: 2 } },
    ],
  },
  {
    id: "goal",
    prompt: "What is your goal?",
    options: [
      { id: "fun", text: "Learn for fun", points: { EXPLORER: 2 } },
      { id: "school-project", text: "Start a school project", points: { BUILDER: 2 } },
      { id: "real-business", text: "Start a real business", points: { FOUNDER: 2 } },
      { id: "grow-existing", text: "Grow an existing one", points: { OPERATOR: 2 } },
    ],
  },
];

export function suggestTrack(answers: Record<string, string>): TrackLevel {
  const totals: Record<TrackLevel, number> = { EXPLORER: 0, BUILDER: 0, FOUNDER: 0, OPERATOR: 0 };
  for (const q of PLACEMENT_QUESTIONS) {
    const chosen = q.options.find((o) => o.id === answers[q.id]);
    if (!chosen) continue;
    for (const [track, pts] of Object.entries(chosen.points)) {
      totals[track as TrackLevel] += pts ?? 0;
    }
  }
  const ranked = (Object.entries(totals) as [TrackLevel, number][]).sort((a, b) => b[1] - a[1]);
  return ranked[0][0];
}
