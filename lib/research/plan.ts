/**
 * Backwards planner - implements the Research & Conferences plan's own
 * algorithm (section 10, "Backwards planner (lib/research/plan.ts)"):
 * subtract a 2-week buffer from the abstract deadline, spread the
 * remaining steps by level-specific weights, work backwards from today.
 */

export type Level = "POSTER" | "ORAL" | "PAPER";

export const STEPS = ["Choose a date", "Ask a question", "Read and plan", "Collect data", "Write abstract", "Mentor review", "Submit", "Present"] as const;

// Share of the preparation time each step gets, by level (steps 1-7; step 8 is the event itself).
const WEIGHTS: Record<Level, number[]> = {
  POSTER: [0, 1, 2, 3, 1, 1, 1],
  ORAL: [0, 1, 2, 4, 1, 1, 1],
  PAPER: [0, 2, 3, 5, 1, 2, 1],
};
const MIN_WEEKS: Record<Level, number> = { POSTER: 6, ORAL: 8, PAPER: 12 };
const DAY = 864e5;

export interface PlanStep { order: number; title: string; dueAt: Date }
export type PlanResult = { ok: true; steps: PlanStep[] } | { ok: false; reason: string };

export function buildPlan(level: Level, today: Date, abstractDeadline: Date, eventDate: Date): PlanResult {
  const bufferDays = 14;
  const submitBy = new Date(abstractDeadline.getTime() - bufferDays * DAY);
  const days = Math.floor((submitBy.getTime() - today.getTime()) / DAY);

  if (days < MIN_WEEKS[level] * 7) {
    return { ok: false, reason: `A ${level.toLowerCase()} needs about ${MIN_WEEKS[level]} weeks. Choose a later conference or a simpler level.` };
  }

  const w = WEIGHTS[level];
  const total = w.reduce((a, b) => a + b, 0);
  let cursor = today.getTime();
  const steps: PlanStep[] = STEPS.map((title, i) => {
    if (i === 7) return { order: 8, title, dueAt: eventDate };
    cursor += Math.round((w[i] / total) * days) * DAY;
    return { order: i + 1, title, dueAt: new Date(i === 6 ? submitBy.getTime() : cursor) };
  });
  return { ok: true, steps };
}

/** Attendee level (the 5th, lightest participation type from section 3)
 *  isn't in the plan's own buildPlan() - it's a 1-week, single-step
 *  commitment (watch talks, ask a question, write a reflection), not an
 *  8-step research project. Handled separately rather than forcing it
 *  through the POSTER/ORAL/PAPER weighting, which would misrepresent how
 *  light this level actually is. */
export function attendeePlan(eventDate: Date): PlanStep[] {
  return [{ order: 1, title: "Attend, ask one question, write a reflection", dueAt: eventDate }];
}
