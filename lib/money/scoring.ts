import type { ScamItem } from "@/data/money/scamItems";

export interface ClientScamItem { id: string; channel: ScamItem["channel"]; text: string }
export function stripScamSecrets(items: ScamItem[]): ClientScamItem[] {
  return items.map((i) => ({ id: i.id, channel: i.channel, text: i.text }));
}

export interface SwipeAnswer { itemId: string; saidScam: boolean; ms: number }
export interface GradedSwipeAnswer extends SwipeAnswer { correct: boolean; isScam: boolean; lesson: string }
export interface SwipeGradeResult {
  correct: number;
  total: number;
  accuracyPercent: number;
  graded: GradedSwipeAnswer[];
}

export function gradeSwipeRound(items: ScamItem[], answers: SwipeAnswer[]): SwipeGradeResult {
  const byId = new Map(items.map((i) => [i.id, i]));
  const graded: GradedSwipeAnswer[] = answers
    .filter((a) => byId.has(a.itemId))
    .map((a) => {
      const item = byId.get(a.itemId)!;
      return { ...a, correct: a.saidScam === item.isScam, isScam: item.isScam, lesson: item.lesson };
    });
  const correct = graded.filter((g) => g.correct).length;
  const total = graded.length;
  return { correct, total, accuracyPercent: total ? Math.round((correct / total) * 100) : 0, graded };
}
