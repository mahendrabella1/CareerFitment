import type { QuizQuestion, QuestionType } from "@/data/startups/content";

// What the client ever sees of a question - no correctOptionIds, no
// explanation, matching new-assessment/score/route.ts's "never trust the
// client" discipline (it never sends `correct`/`q.weights` either).
export interface ClientQuizOption { id: string; text: string }
export interface ClientQuizQuestion {
  id: string; type: QuestionType; prompt: string; options: ClientQuizOption[];
}

export function stripQuizSecrets(questions: QuizQuestion[]): ClientQuizQuestion[] {
  return questions.map((q) => ({ id: q.id, type: q.type, prompt: q.prompt, options: q.options.map((o) => ({ id: o.id, text: o.text })) }));
}

export interface SubmittedAnswer { questionId: string; selectedOptionIds: string[] }
export interface GradedAnswer extends SubmittedAnswer {
  correct: boolean;
  correctOptionIds: string[];
  explanation: string;
}

export interface GradeResult {
  score: number;
  maxScore: number;
  percent: number;
  passed: boolean;
  graded: GradedAnswer[];
  skillScores: Record<string, number>;
}

function isCorrect(q: QuizQuestion, selected: string[]): boolean {
  const picked = new Set(selected);
  const correct = new Set(q.correctOptionIds);
  if (picked.size !== correct.size) return false;
  for (const id of picked) if (!correct.has(id)) return false;
  return true;
}

/** Grades a submitted quiz against the real (server-held) questions. Each
 *  question is worth 1 point - the PDF's simpler lesson-quiz model, not
 *  11-12/UG's weighted trait tallying (no trait signal here, just right/wrong). */
export function gradeQuiz(questions: QuizQuestion[], answers: SubmittedAnswer[], passMarkPercent: number): GradeResult {
  const byId = new Map(answers.map((a) => [a.questionId, a.selectedOptionIds]));
  const skill: Record<string, { got: number; max: number }> = {};
  let score = 0;
  const graded: GradedAnswer[] = questions.map((q) => {
    const selected = byId.get(q.id) ?? [];
    const correct = isCorrect(q, selected);
    if (correct) score += 1;
    skill[q.skillTag] ??= { got: 0, max: 0 };
    skill[q.skillTag].max += 1;
    if (correct) skill[q.skillTag].got += 1;
    return { questionId: q.id, selectedOptionIds: selected, correct, correctOptionIds: q.correctOptionIds, explanation: q.explanation };
  });
  const maxScore = questions.length;
  const percent = maxScore ? Math.round((score / maxScore) * 100) : 100;
  const skillScores = Object.fromEntries(Object.entries(skill).map(([k, v]) => [k, v.max ? Math.round((v.got / v.max) * 100) : 100]));
  return { score, maxScore, percent, passed: percent >= passMarkPercent, graded, skillScores };
}

/** Deterministic-enough "random" draw for a module test: Fisher-Yates with
 *  Math.random is fine here (unlike the Money Life simulation, a module
 *  test isn't replayed from a seed - every attempt should genuinely vary). */
export function drawModuleTestQuestions(bank: QuizQuestion[], count: number): QuizQuestion[] {
  const pool = [...bank];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

const ALL_SKILL_TAGS = ["ideation", "validation", "customers", "mvp", "business-model", "marketing", "finance", "team", "legal", "pitching"] as const;

/** Startup Readiness Score (PDF section 11, #3): per skill, 70% from quiz
 *  average + 30% from approved missions in that skill - the simple version
 *  the PDF itself specifies. Phase 1 has no mission-approval flow yet, so
 *  missionScores defaults to empty and the formula coverage-normalises
 *  (same "average only what's measured" pattern used across this project's
 *  other scoring engines) rather than treating a missing mission signal as 0. */
export function readinessScore(
  quizSkillAverages: Record<string, number>,
  missionSkillScores: Record<string, number> = {}
): { overall: number; bySkill: Record<string, number> } {
  const bySkill: Record<string, number> = {};
  for (const tag of ALL_SKILL_TAGS) {
    const quiz = quizSkillAverages[tag];
    const mission = missionSkillScores[tag];
    if (quiz === undefined && mission === undefined) continue;
    if (quiz !== undefined && mission !== undefined) bySkill[tag] = Math.round(quiz * 0.7 + mission * 0.3);
    else bySkill[tag] = Math.round((quiz ?? mission)!);
  }
  const vals = Object.values(bySkill);
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  return { overall, bySkill };
}
