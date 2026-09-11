import { SupabaseClient } from "@supabase/supabase-js";
import { distributeAcrossSubtraits } from "./blueprintEngine";
import {
  BlueprintParameterRow,
  GeneratedSession,
  QuestionRow,
  SessionParameter,
  SessionQuestion,
  SubTraitRow,
} from "./types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Loads the blueprint for a journey and generates a full assessment session:
 *
 *   journey -> blueprint parameters -> sub-traits -> pool sizes
 *     -> distributeAcrossSubtraits() (blueprint engine)
 *     -> random sample per sub-trait, with a session-wide `usedIds` Set
 *        blocking any question from being drawn twice
 *     -> final global shuffle so each learner sees a different question order
 *     -> persisted as session_questions rows (the DB unique constraint on
 *        (session_id, question_id) is the enforced backstop for the same rule)
 *
 * Parameters with no sub-trait pool at all are marked `missing_pool` and
 * skipped rather than silently under-filled - the caller decides whether
 * that's acceptable (e.g. still show the session with a gap flagged) or
 * should block session creation entirely.
 */
export async function generateSession(
  admin: SupabaseClient,
  journeyCode: string,
  userId: string | null
): Promise<GeneratedSession> {
  const { data: journey, error: jErr } = await admin
    .from("journeys")
    .select("*")
    .eq("code", journeyCode)
    .eq("is_active", true)
    .single();
  if (jErr || !journey) {
    throw new Error(`Unknown or inactive journey: ${journeyCode}`);
  }

  const { data: params, error: pErr } = await admin
    .from("blueprint_parameters")
    .select("*")
    .eq("journey_id", journey.id)
    .order("sort_order", { ascending: true });
  if (pErr) throw pErr;
  const parameters = (params ?? []) as BlueprintParameterRow[];

  const { data: session, error: sErr } = await admin
    .from("assessment_sessions")
    .insert({ journey_id: journey.id, user_id: userId })
    .select()
    .single();
  if (sErr || !session) throw sErr ?? new Error("Failed to create session");

  const usedIds = new Set<string>();
  const parameterDrafts: Omit<SessionParameter, "questions">[] = [];
  const selectedQuestions: Omit<SessionQuestion, "displayOrder">[] = [];

  for (const param of parameters) {
    const { data: subTraits, error: stErr } = await admin
      .from("sub_traits")
      .select("*")
      .eq("parameter_id", param.id);
    if (stErr) throw stErr;
    const traits = (subTraits ?? []) as SubTraitRow[];

    if (traits.length === 0) {
      parameterDrafts.push({
        parameterId: param.id,
        name: param.name,
        weightPct: param.weight_pct,
        questionCount: param.question_count,
        status: "missing_pool",
        warnings: [`No question bank exists yet for "${param.name}" - skipped.`],
      });
      continue;
    }

    const poolSizes: Record<string, number> = {};
    for (const t of traits) {
      const { count, error: cErr } = await admin
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("sub_trait_id", t.id)
        .eq("is_active", true);
      if (cErr) throw cErr;
      poolSizes[t.id] = count ?? 0;
    }

    const { alloc, warnings } = distributeAcrossSubtraits(
      param.question_count,
      poolSizes,
      param.min_per_subtrait,
      param.ideal_per_subtrait,
      param.max_per_subtrait
    );

    const questions: Omit<SessionQuestion, "displayOrder">[] = [];
    let insufficientAny = false;

    for (const t of traits) {
      const need = alloc[t.id] ?? 0;
      if (need === 0) continue;

      const { data: pool, error: qErr } = await admin
        .from("questions")
        .select("*")
        .eq("sub_trait_id", t.id)
        .eq("is_active", true);
      if (qErr) throw qErr;

      const candidates = shuffle((pool ?? []) as QuestionRow[]).filter(
        (q) => !usedIds.has(q.id)
      );
      const picked = candidates.slice(0, need);
      if (picked.length < need) insufficientAny = true;

      for (const q of picked) {
        usedIds.add(q.id);
        questions.push({
          id: q.id,
          parameterId: param.id,
          parameterName: param.name,
          subTraitId: t.id,
          subTraitName: t.name,
          text: q.question_text,
          type: q.question_type,
          options: q.options,
        });
      }
    }

    const paramWarnings = [...warnings];
    if (questions.length < param.question_count) {
      paramWarnings.push(
        `Only ${questions.length} of ${param.question_count} questions could be allocated for "${param.name}".`
      );
    }

    parameterDrafts.push({
      parameterId: param.id,
      name: param.name,
      weightPct: param.weight_pct,
      questionCount: param.question_count,
      status: insufficientAny ? "insufficient_pool" : "live",
      warnings: paramWarnings,
    });
    selectedQuestions.push(...questions);
  }

  const orderedQuestions: SessionQuestion[] = shuffle(selectedQuestions).map(
    (question, index) => ({
      ...question,
      displayOrder: index,
    })
  );

  const sessionQuestionRows = orderedQuestions.map((question) => ({
    session_id: session.id,
    question_id: question.id,
    parameter_id: question.parameterId,
    sub_trait_id: question.subTraitId,
    display_order: question.displayOrder,
  }));

  if (sessionQuestionRows.length > 0) {
    // The (session_id, question_id) unique constraint is the DB-enforced
    // duplicate guard - if the in-memory usedIds Set ever had a bug, this
    // insert fails loudly instead of silently shipping a duplicate.
    const { error: insErr } = await admin
      .from("session_questions")
      .insert(sessionQuestionRows);
    if (insErr) throw insErr;
  }

  const questionsByParameter = new Map<string, SessionQuestion[]>();
  for (const question of orderedQuestions) {
    const bucket = questionsByParameter.get(question.parameterId) ?? [];
    bucket.push(question);
    questionsByParameter.set(question.parameterId, bucket);
  }

  const sessionParams: SessionParameter[] = parameterDrafts.map((draft) => ({
    ...draft,
    questions: questionsByParameter.get(draft.parameterId) ?? [],
  }));

  return {
    sessionId: session.id,
    journeyCode,
    parameters: sessionParams,
    questions: orderedQuestions,
    totalQuestions: orderedQuestions.length,
  };
}
