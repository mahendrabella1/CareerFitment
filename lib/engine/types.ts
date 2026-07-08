export type QuestionType = "likert5" | "yes_no" | "mcq";

export interface QuestionRow {
  id: string;
  sub_trait_id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  correct_answer: string | null;
}

export interface SubTraitRow {
  id: string;
  parameter_id: string;
  name: string;
}

export interface BlueprintParameterRow {
  id: string;
  journey_id: string;
  name: string;
  weight_pct: number;
  question_count: number;
  min_per_subtrait: number;
  ideal_per_subtrait: number;
  max_per_subtrait: number;
  sort_order: number;
}

export interface JourneyRow {
  id: string;
  code: string;
  name: string;
  age_group: string;
  total_questions: number;
  is_active: boolean;
}

/** Result of distributing a parameter's question budget across its sub-traits. */
export interface Allocation {
  alloc: Record<string, number>; // sub_trait_id -> question count
  warnings: string[];
}

export interface SessionQuestion {
  id: string;
  parameterId: string;
  parameterName: string;
  subTraitId: string;
  subTraitName: string;
  text: string;
  type: QuestionType;
  options: string[] | null;
  displayOrder: number;
}

/** A fully generated, ready-to-render parameter block within a session. */
export interface SessionParameter {
  parameterId: string;
  name: string;
  weightPct: number;
  questionCount: number;
  status: "live" | "missing_pool" | "insufficient_pool";
  warnings: string[];
  questions: SessionQuestion[];
}

export interface GeneratedSession {
  sessionId: string;
  journeyCode: string;
  parameters: SessionParameter[];
  questions: SessionQuestion[];
  totalQuestions: number;
}
